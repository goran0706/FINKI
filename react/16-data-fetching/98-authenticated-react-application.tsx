/**
 * Authenticated React Application
 * ===============================
 *
 * This file combines routing, authentication, authorization, HTTP transport,
 * server state, and client state in one layered application. Each layer has a
 * single responsibility and depends only on the layer below it:
 *
 *   Pages and HOCs -> TanStack Query hooks -> User service -> API client -> Axios
 *   Pages and HOCs -> Zustand store (client-only UI state)
 *
 * Dependencies: react-router-dom (v6.9+ or v7), @tanstack/react-query (v5),
 * zustand (v5), axios (v1).
 *
 * Authentication model
 * --------------------
 * The session lives in an HttpOnly, Secure, SameSite cookie set by the server.
 * JavaScript cannot read or steal it, so the client never stores a token. The
 * cookie can hold a session id or a JWT; the client does not care which. The
 * browser attaches it automatically because the API client sets
 * `withCredentials: true`. Whether the user is signed in is decided by asking
 * the server (GET /auth/me), never by inspecting anything in the browser.
 *
 * If a bearer JWT is required instead, keep the access token in memory only
 * (never in localStorage), attach it with a request interceptor in the API
 * client, and renew it through an HttpOnly refresh cookie.
 *
 * Server contract assumed by this file
 * ------------------------------------
 *   POST   /api/auth/login   { email, password } -> 200 UserDto and sets the cookie, 401 on bad credentials
 *   POST   /api/auth/logout                      -> 204 and clears the cookie
 *   GET    /api/auth/me                          -> 200 UserDto, 401 when there is no session
 *   GET    /api/users                            -> 200 UserDto[]
 *   GET    /api/users/:id                        -> 200 UserDto, 404 when missing
 *   POST   /api/users                            -> 201 UserDto
 *   PATCH  /api/users/:id                        -> 200 UserDto
 *   DELETE /api/users/:id                        -> 204
 *   Errors are JSON: { "message": string }
 *
 * Serve the API from the same origin as the app (for example /api behind a
 * reverse proxy or a dev-server proxy) so no CORS configuration is needed. If
 * the API is on another origin, the server must allow that exact origin and
 * send Access-Control-Allow-Credentials: true. Cookie-authenticated unsafe
 * requests also need CSRF protection; the API client echoes a readable
 * XSRF-TOKEN cookie in the X-XSRF-TOKEN header for that purpose.
 *
 * Where each kind of state lives
 * ------------------------------
 * - Server state (session user, users): TanStack Query. It owns caching,
 *   deduplication, refetching, and invalidation. The session user is server
 *   state, so it is not duplicated in Zustand.
 * - Client state (users search term): Zustand. It exists only in the browser.
 * - Navigation state (where to return after login): React Router location state.
 *
 * Authorization
 * -------------
 * The HOCs and role checks decide only what the UI renders. They are not a
 * security boundary. The server must authenticate and authorize every request.
 */

import {
  QueryClient,
  QueryClientProvider,
  queryOptions,
  skipToken,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import axios, { type AxiosResponse } from "axios";
import {
  type ChangeEvent,
  type ComponentType,
  type FC,
  type FormEvent,
  type ReactNode,
  useMemo,
  useState,
} from "react";
import { createBrowserRouter, Link, Navigate, Outlet, RouterProvider, useLocation, useParams } from "react-router-dom";
import { create } from "zustand";

// ---------------------------------------------------------------------
// 1. Types
// ---------------------------------------------------------------------

export type Role = "admin" | "user";

export interface User {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly role: Role;
  readonly createdAt: Date;
}

/** Wire format of a user as sent by the server. */
export interface UserDto {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly role: Role;
  readonly createdAt: string;
}

export interface Credentials {
  readonly email: string;
  readonly password: string;
}

export interface CreateUserInput {
  readonly name: string;
  readonly email: string;
  readonly password: string;
}

export interface UpdateUserInput {
  readonly name?: string;
  readonly email?: string;
}

export interface Session {
  readonly status: "loading" | "error" | "authenticated" | "unauthenticated";
  readonly user: User | null;
  readonly retry: () => void;
}

export interface RequestOptions {
  readonly signal?: AbortSignal;
  readonly params?: Readonly<Record<string, string | number | boolean>>;
}

export interface ApiClientOptions {
  readonly baseURL: string;
  readonly timeout?: number;
  readonly onUnauthorized?: () => void;
}

export interface ApiClient {
  get<T>(url: string, options?: RequestOptions): Promise<T>;
  post<T, B = unknown>(url: string, body?: B, options?: RequestOptions): Promise<T>;
  put<T, B = unknown>(url: string, body?: B, options?: RequestOptions): Promise<T>;
  patch<T, B = unknown>(url: string, body?: B, options?: RequestOptions): Promise<T>;
  delete<T = void>(url: string, options?: RequestOptions): Promise<T>;
}

export interface UserService {
  getCurrentUser(signal?: AbortSignal): Promise<User | null>;
  login(credentials: Credentials): Promise<User>;
  logout(): Promise<void>;
  list(signal?: AbortSignal): Promise<readonly User[]>;
  getById(id: string, signal?: AbortSignal): Promise<User | null>;
  create(input: CreateUserInput): Promise<User>;
  update(id: string, input: UpdateUserInput): Promise<User>;
  remove(id: string): Promise<void>;
}

interface SessionFallbackProps {
  readonly session: Session;
}

interface FieldProps {
  readonly label: string;
  readonly type: "text" | "email" | "password";
  readonly value: string;
  readonly autoComplete: string;
  readonly onChange: (value: string) => void;
}

// ---------------------------------------------------------------------
// 2. API Client (transport only, knows nothing about the application)
// ---------------------------------------------------------------------

export class ApiError extends Error {
  public readonly status: number | null;

  public constructor(message: string, status: number | null) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

const unwrap = async <T,>(request: Promise<AxiosResponse<T>>): Promise<T> => {
  const response: AxiosResponse<T> = await request;

  return response.data;
};

const toApiError = (error: unknown): ApiError => {
  if (axios.isAxiosError<{ readonly message?: string }>(error)) {
    return new ApiError(error.response?.data?.message ?? error.message, error.response?.status ?? null);
  }

  return new ApiError(error instanceof Error ? error.message : "Unexpected error", null);
};

export const createApiClient = ({ baseURL, timeout = 10_000, onUnauthorized }: ApiClientOptions): ApiClient => {
  const instance = axios.create({
    baseURL,
    timeout,
    withCredentials: true,
    xsrfCookieName: "XSRF-TOKEN",
    xsrfHeaderName: "X-XSRF-TOKEN",
    withXSRFToken: true,
  });

  instance.interceptors.response.use(undefined, (error: unknown): Promise<never> => {
    if (axios.isCancel(error)) {
      return Promise.reject(error);
    }

    const apiError: ApiError = toApiError(error);

    if (apiError.status === 401) {
      onUnauthorized?.();
    }

    return Promise.reject(apiError);
  });

  return {
    get<T>(url: string, options?: RequestOptions): Promise<T> {
      return unwrap(instance.get<T>(url, options));
    },
    post<T, B = unknown>(url: string, body?: B, options?: RequestOptions): Promise<T> {
      return unwrap(instance.post<T>(url, body, options));
    },
    put<T, B = unknown>(url: string, body?: B, options?: RequestOptions): Promise<T> {
      return unwrap(instance.put<T>(url, body, options));
    },
    patch<T, B = unknown>(url: string, body?: B, options?: RequestOptions): Promise<T> {
      return unwrap(instance.patch<T>(url, body, options));
    },
    delete<T = void>(url: string, options?: RequestOptions): Promise<T> {
      return unwrap(instance.delete<T>(url, options));
    },
  };
};

// ---------------------------------------------------------------------
// 3. User Service (application domain logic on top of the API client)
// ---------------------------------------------------------------------

const normalizeEmail = (email: string): string => email.trim().toLowerCase();

const userPath = (id: string): string => `/users/${encodeURIComponent(id)}`;

const toUser = (dto: UserDto): User => ({
  id: dto.id,
  name: dto.name,
  email: dto.email,
  role: dto.role,
  createdAt: new Date(dto.createdAt),
});

/** Turns an expected HTTP status into a domain-level "absent" result. */
const resolveNullOn = async <T,>(status: number, request: Promise<T>): Promise<T | null> => {
  try {
    return await request;
  } catch (error: unknown) {
    if (error instanceof ApiError && error.status === status) {
      return null;
    }

    throw error;
  }
};

export const createUserService = (api: ApiClient): UserService => ({
  async getCurrentUser(signal?: AbortSignal): Promise<User | null> {
    const dto: UserDto | null = await resolveNullOn(401, api.get<UserDto>("/auth/me", { signal }));

    return dto === null ? null : toUser(dto);
  },

  async login({ email, password }: Credentials): Promise<User> {
    const dto: UserDto = await api.post<UserDto, Credentials>("/auth/login", {
      email: normalizeEmail(email),
      password,
    });

    return toUser(dto);
  },

  async logout(): Promise<void> {
    await api.post<void>("/auth/logout");
  },

  async list(signal?: AbortSignal): Promise<readonly User[]> {
    const dtos: readonly UserDto[] = await api.get<readonly UserDto[]>("/users", { signal });

    return dtos.map(toUser);
  },

  async getById(id: string, signal?: AbortSignal): Promise<User | null> {
    const dto: UserDto | null = await resolveNullOn(404, api.get<UserDto>(userPath(id), { signal }));

    return dto === null ? null : toUser(dto);
  },

  async create(input: CreateUserInput): Promise<User> {
    const dto: UserDto = await api.post<UserDto, CreateUserInput>("/users", {
      ...input,
      email: normalizeEmail(input.email),
    });

    return toUser(dto);
  },

  async update(id: string, input: UpdateUserInput): Promise<User> {
    const dto: UserDto = await api.patch<UserDto, UpdateUserInput>(userPath(id), {
      name: input.name,
      email: input.email === undefined ? undefined : normalizeEmail(input.email),
    });

    return toUser(dto);
  },

  async remove(id: string): Promise<void> {
    await api.delete(userPath(id));
  },
});

// ---------------------------------------------------------------------
// 4. Server State (TanStack Query)
// ---------------------------------------------------------------------

const queryKeys = {
  session: ["session"] as const,
  users: {
    all: ["users"] as const,
    list: ["users", "list"] as const,
    detail: (userId: string | undefined) => ["users", "detail", userId] as const,
  },
} as const;

const shouldRetry = (failureCount: number, error: Error): boolean => {
  const isClientError: boolean = error instanceof ApiError && error.status !== null && error.status < 500;

  return !isClientError && failureCount < 2;
};

export const queryClient: QueryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 60_000, retry: shouldRetry },
    mutations: { retry: false },
  },
});

/**
 * Replaces the signed-in user and discards all other cached server data so
 * nothing from a previous session can be shown to the next one.
 */
const replaceSession = (client: QueryClient, user: User | null): void => {
  client.removeQueries({ predicate: (query): boolean => query.queryKey[0] !== queryKeys.session[0] });
  client.setQueryData<User | null>(queryKeys.session, user);
};

export const apiClient: ApiClient = createApiClient({
  baseURL: "/api",
  onUnauthorized: (): void => {
    replaceSession(queryClient, null);
  },
});

export const userService: UserService = createUserService(apiClient);

const sessionQueryOptions = queryOptions({
  queryKey: queryKeys.session,
  queryFn: ({ signal }) => userService.getCurrentUser(signal),
  retry: false,
  staleTime: 5 * 60_000,
});

const usersQueryOptions = queryOptions({
  queryKey: queryKeys.users.list,
  queryFn: ({ signal }) => userService.list(signal),
});

const userQueryOptions = (userId: string | undefined) =>
  queryOptions({
    queryKey: queryKeys.users.detail(userId),
    queryFn: userId === undefined ? skipToken : ({ signal }) => userService.getById(userId, signal),
  });

const useSession = (): Session => {
  const { data, isError, refetch } = useQuery(sessionQueryOptions);

  const retry = (): void => {
    void refetch();
  };

  // A failed background refetch keeps the previous data, so only the initial
  // load can end up in the "error" state.
  if (data === undefined) {
    return { status: isError ? "error" : "loading", user: null, retry };
  }

  if (data === null) {
    return { status: "unauthenticated", user: null, retry };
  }

  return { status: "authenticated", user: data, retry };
};

const useCurrentUser = (): User => {
  const { user } = useSession();

  if (user === null) {
    throw new Error("useCurrentUser must be used inside an authenticated route.");
  }

  return user;
};

const useLogin = () => {
  const client: QueryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: Credentials) => userService.login(credentials),
    onSuccess: (user: User): void => {
      replaceSession(client, user);
    },
  });
};

const useLogout = () => {
  const client: QueryClient = useQueryClient();

  return useMutation({
    mutationFn: () => userService.logout(),
    onSuccess: (): void => {
      replaceSession(client, null);
    },
  });
};

const useUsers = () => useQuery(usersQueryOptions);

const useCreateUser = () => {
  const client: QueryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateUserInput) => userService.create(input),
    onSuccess: (): Promise<void> => client.invalidateQueries({ queryKey: queryKeys.users.all }),
  });
};

const useDeleteUser = () => {
  const client: QueryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => userService.remove(userId),
    onSuccess: (): Promise<void> => client.invalidateQueries({ queryKey: queryKeys.users.all }),
  });
};

// ---------------------------------------------------------------------
// 5. Client State (Zustand)
// ---------------------------------------------------------------------

interface UsersFilterState {
  readonly searchTerm: string;
  readonly setSearchTerm: (searchTerm: string) => void;
}

const useUsersFilterStore = create<UsersFilterState>()((set) => ({
  searchTerm: "",
  setSearchTerm: (searchTerm: string): void => {
    set({ searchTerm });
  },
}));

// ---------------------------------------------------------------------
// 6. Authentication and Authorization HOCs
// ---------------------------------------------------------------------

const getDisplayName = (component: { readonly displayName?: string; readonly name: string }): string =>
  component.displayName ?? (component.name || "Component");

const isSafePath = (value: unknown): value is string =>
  typeof value === "string" && value.startsWith("/") && !value.startsWith("//");

const getRedirectPath = (state: unknown): string => {
  if (typeof state === "object" && state !== null && "from" in state && isSafePath(state.from)) {
    return state.from;
  }

  return "/";
};

const SessionFallback: FC<SessionFallbackProps> = ({ session }: SessionFallbackProps): ReactNode =>
  session.status === "error" ? (
    <div role="alert">
      <p>Unable to verify your session.</p>

      <button type="button" onClick={session.retry}>
        Retry
      </button>
    </div>
  ) : (
    <p role="status">Checking session...</p>
  );

/** Renders the component only for signed-in users; everyone else goes to /login. */
export const withAuthentication = <P extends object>(Component: ComponentType<P>): FC<P> => {
  const WithAuthentication: FC<P> = (props: P): ReactNode => {
    const session: Session = useSession();
    const location = useLocation();

    if (session.status === "loading" || session.status === "error") {
      return <SessionFallback session={session} />;
    }

    if (session.status === "unauthenticated") {
      return <Navigate to="/login" replace state={{ from: `${location.pathname}${location.search}` }} />;
    }

    return <Component {...props} />;
  };

  WithAuthentication.displayName = `withAuthentication(${getDisplayName(Component)})`;

  return WithAuthentication;
};

/** Renders the component only for signed-out users; signed-in users are sent back to where they came from. */
export const withPublicOnly = <P extends object>(Component: ComponentType<P>): FC<P> => {
  const WithPublicOnly: FC<P> = (props: P): ReactNode => {
    const session: Session = useSession();
    const location = useLocation();

    if (session.status === "loading" || session.status === "error") {
      return <SessionFallback session={session} />;
    }

    if (session.status === "authenticated") {
      return <Navigate to={getRedirectPath(location.state)} replace />;
    }

    return <Component {...props} />;
  };

  WithPublicOnly.displayName = `withPublicOnly(${getDisplayName(Component)})`;

  return WithPublicOnly;
};

/** Requires authentication and one of the allowed roles; other roles are sent to /forbidden. */
export const withAuthorization = <P extends object>(
  Component: ComponentType<P>,
  allowedRoles: readonly Role[],
): FC<P> => {
  const Authorized: FC<P> = (props: P): ReactNode => {
    const user: User = useCurrentUser();

    if (!allowedRoles.includes(user.role)) {
      return <Navigate to="/forbidden" replace />;
    }

    return <Component {...props} />;
  };

  Authorized.displayName = `withAuthorization(${getDisplayName(Component)})`;

  return withAuthentication(Authorized);
};

// ---------------------------------------------------------------------
// 7. Components and Pages
// ---------------------------------------------------------------------

const Field: FC<FieldProps> = ({ label, type, value, autoComplete, onChange }: FieldProps): ReactNode => (
  <div>
    <label>
      {label}{" "}
      <input
        type={type}
        value={value}
        autoComplete={autoComplete}
        required
        onChange={(event: ChangeEvent<HTMLInputElement>): void => {
          onChange(event.target.value);
        }}
      />
    </label>
  </div>
);

const AppLayout: FC = (): ReactNode => {
  const user: User = useCurrentUser();
  const logout = useLogout();

  return (
    <div>
      <header>
        <nav>
          <Link to="/">Dashboard</Link> <Link to="/users">Users</Link>{" "}
          {user.role === "admin" && <Link to="/admin">Admin</Link>}
        </nav>

        <span>{user.name}</span>

        <button
          type="button"
          disabled={logout.isPending}
          onClick={(): void => {
            logout.mutate();
          }}
        >
          Sign out
        </button>

        {logout.isError && <p role="alert">Unable to sign out. Please try again.</p>}
      </header>

      <main>
        <Outlet />
      </main>
    </div>
  );
};

const LoginPage: FC = (): ReactNode => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const login = useLogin();

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    login.mutate({ email, password });
  };

  return (
    <section>
      <h1>Sign in</h1>

      <form onSubmit={handleSubmit}>
        <Field label="Email" type="email" value={email} autoComplete="username" onChange={setEmail} />

        <Field
          label="Password"
          type="password"
          value={password}
          autoComplete="current-password"
          onChange={setPassword}
        />

        <button type="submit" disabled={login.isPending}>
          Sign in
        </button>
      </form>

      {login.isError && (
        <p role="alert">
          {login.error instanceof ApiError && login.error.status === 401
            ? "Invalid email or password."
            : "Unable to sign in. Please try again."}
        </p>
      )}
    </section>
  );
};

const DashboardPage: FC = (): ReactNode => {
  const user: User = useCurrentUser();

  return (
    <section>
      <h1>Dashboard</h1>

      <p>Name: {user.name}</p>

      <p>Email: {user.email}</p>

      <p>Role: {user.role}</p>
    </section>
  );
};

const UsersPage: FC = (): ReactNode => {
  const { data: users, isPending, isError } = useUsers();
  const searchTerm: string = useUsersFilterStore((state) => state.searchTerm);
  const setSearchTerm: (searchTerm: string) => void = useUsersFilterStore((state) => state.setSearchTerm);

  const visibleUsers: readonly User[] = useMemo((): readonly User[] => {
    const term: string = searchTerm.trim().toLowerCase();

    return (users ?? []).filter(
      (user: User): boolean => user.name.toLowerCase().includes(term) || user.email.includes(term),
    );
  }, [users, searchTerm]);

  if (isPending) {
    return <p role="status">Loading users...</p>;
  }

  if (isError) {
    return <p role="alert">Unable to load users.</p>;
  }

  return (
    <section>
      <h1>Users</h1>

      <input
        type="search"
        placeholder="Search by name or email"
        value={searchTerm}
        onChange={(event: ChangeEvent<HTMLInputElement>): void => {
          setSearchTerm(event.target.value);
        }}
      />

      <ul>
        {visibleUsers.map(
          (user: User): ReactNode => (
            <li key={user.id}>
              <Link to={`/users/${encodeURIComponent(user.id)}`}>{user.name}</Link> ({user.email})
            </li>
          ),
        )}
      </ul>
    </section>
  );
};

const UserDetailPage: FC = (): ReactNode => {
  const { userId } = useParams<{ userId: string }>();
  const { data: user, isPending, isError } = useQuery(userQueryOptions(userId));

  if (isPending) {
    return <p role="status">Loading user...</p>;
  }

  if (isError) {
    return <p role="alert">Unable to load the user.</p>;
  }

  if (user === null) {
    return (
      <section>
        <p>User not found.</p>

        <Link to="/users">Back to users</Link>
      </section>
    );
  }

  return (
    <section>
      <h1>{user.name}</h1>

      <p>Email: {user.email}</p>

      <p>Role: {user.role}</p>

      <p>Created: {user.createdAt.toLocaleDateString()}</p>

      <Link to="/users">Back to users</Link>
    </section>
  );
};

const AdminPage: FC = (): ReactNode => {
  const currentUser: User = useCurrentUser();
  const { data: users, isPending, isError } = useUsers();
  const createUser = useCreateUser();
  const deleteUser = useDeleteUser();
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    createUser.mutate(
      { name, email, password },
      {
        onSuccess: (): void => {
          setName("");
          setEmail("");
          setPassword("");
        },
      },
    );
  };

  return (
    <section>
      <h1>Administration</h1>

      <h2>Create user</h2>

      <form onSubmit={handleSubmit}>
        <Field label="Name" type="text" value={name} autoComplete="off" onChange={setName} />

        <Field label="Email" type="email" value={email} autoComplete="off" onChange={setEmail} />

        <Field label="Password" type="password" value={password} autoComplete="new-password" onChange={setPassword} />

        <button type="submit" disabled={createUser.isPending}>
          Create user
        </button>
      </form>

      {createUser.isError && <p role="alert">{createUser.error.message}</p>}

      <h2>All users</h2>

      {isPending && <p role="status">Loading users...</p>}

      {isError && <p role="alert">Unable to load users.</p>}

      {users !== undefined && (
        <ul>
          {users.map(
            (user: User): ReactNode => (
              <li key={user.id}>
                {user.name} ({user.email}){" "}
                <button
                  type="button"
                  disabled={user.id === currentUser.id || deleteUser.isPending}
                  onClick={(): void => {
                    deleteUser.mutate(user.id);
                  }}
                >
                  Delete
                </button>
              </li>
            ),
          )}
        </ul>
      )}

      {deleteUser.isError && <p role="alert">{deleteUser.error.message}</p>}
    </section>
  );
};

const ForbiddenPage: FC = (): ReactNode => (
  <section>
    <h1>Forbidden</h1>

    <p>You do not have permission to view this page.</p>

    <Link to="/">Go to dashboard</Link>
  </section>
);

const NotFoundPage: FC = (): ReactNode => (
  <section>
    <h1>Page not found</h1>

    <Link to="/">Go to dashboard</Link>
  </section>
);

// ---------------------------------------------------------------------
// 8. Router and Main Container
// ---------------------------------------------------------------------

// HOCs are applied once at module level. Creating them inside a component
// would produce a new component type on every render and remount the subtree.
const PublicLayout = withPublicOnly(Outlet);
const ProtectedLayout = withAuthentication(AppLayout);
const AdminLayout = withAuthorization(Outlet, ["admin"]);

const router = createBrowserRouter([
  {
    Component: PublicLayout,
    children: [{ path: "/login", Component: LoginPage }],
  },
  {
    Component: ProtectedLayout,
    children: [
      { index: true, Component: DashboardPage },
      { path: "/users", Component: UsersPage },
      { path: "/users/:userId", Component: UserDetailPage },
      {
        Component: AdminLayout,
        children: [{ path: "/admin", Component: AdminPage }],
      },
    ],
  },
  { path: "/forbidden", Component: ForbiddenPage },
  { path: "*", Component: NotFoundPage },
]);

const AppContainer: FC = (): ReactNode => (
  <QueryClientProvider client={queryClient}>
    <RouterProvider router={router} />
  </QueryClientProvider>
);

export default AppContainer;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - The session is an HttpOnly, Secure, SameSite cookie; JavaScript never reads or stores a token.
// - The API client sends the cookie with withCredentials and echoes the XSRF cookie in a header.
// - Sign-in state comes from GET /auth/me, never from browser-side storage.
// - The API client is transport only: generic get, post, put, patch, and delete that return response data.
// - The API client normalizes every failure into ApiError and reports 401 through a callback, without knowing what the callback does.
// - The user service owns domain logic: email normalization, DTO-to-User mapping, and "absent" results for expected 401 and 404 responses.
// - The user service receives the API client as a parameter, so it can be tested with a fake transport.
// - TanStack Query owns server state: caching, deduplication, retries, refetching, and invalidation after mutations.
// - Query keys are defined in one place; the retry policy skips 4xx responses.
// - Changing the signed-in user discards every other cached query, so data never leaks between sessions.
// - Zustand owns client-only state (the users search term); server data is never copied into it.
// - withAuthentication protects routes, withPublicOnly keeps signed-in users off public routes, and withAuthorization adds a role check.
// - HOCs are applied to layout routes, so one wrapper protects a whole subtree and is created once at module level.
// - After login, the user returns to the page they originally requested, and only same-app paths are accepted.
// - UI guards only control what renders; the server must authenticate and authorize every request.
// - TypeScript types describe expected server data but do not validate it at runtime.
