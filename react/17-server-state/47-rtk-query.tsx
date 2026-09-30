/**
 * RTK Query
 * =========
 *
 * RTK Query is a data-fetching and server-state management solution included with Redux Toolkit.
 * It lets an application define an API service with endpoints that describe how remote resources
 * are queried or mutated. RTK Query generates React hooks from those endpoint definitions so
 * components can consume server state without implementing request and cache management manually.
 *
 * A createApi service contains the endpoint definitions and manages the associated cache. A
 * reducerPath identifies where the service state is stored in the Redux store, while middleware
 * handles asynchronous requests and other RTK Query behavior.
 *
 * Query endpoints describe read operations. Their generated hooks expose data together with
 * request lifecycle state such as isLoading, isFetching, isSuccess, and isError. RTK Query
 * identifies cached query data using the endpoint name and serialized query arguments, allowing
 * components requesting the same resource to share cached state.
 *
 * Mutation endpoints describe operations that change server state. Tags can connect queries and
 * mutations so that a successful mutation can invalidate related cached queries and cause
 * affected data to be refetched when appropriate.
 *
 * RTK Query separates the API definition from presentation components. The API service defines
 * how remote data is accessed and managed, while React components consume the generated hooks and
 * focus primarily on rendering and user interaction.
 *
 * This example uses a custom asynchronous base query to simulate a remote API without requiring
 * an external HTTP endpoint. The RTK Query architecture remains the same when using fetchBaseQuery
 * or another real base-query implementation.
 */

import { configureStore, createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import type { BaseQueryFn } from "@reduxjs/toolkit/query";
import { Provider } from "react-redux";
import type { FC, ReactElement } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface User {
  readonly id: number;
  readonly name: string;
  readonly role: "Admin" | "Editor" | "Viewer";
}

export interface UserQueryError {
  readonly message: string;
}

export interface GetUserArgs {
  readonly id: number;
}

export interface UpdateUserArgs {
  readonly id: number;
  readonly role: User["role"];
}

export interface QueryStateDisplayProps {
  readonly isLoading: boolean;
  readonly isFetching: boolean;
  readonly isSuccess: boolean;
  readonly isError: boolean;
}

export interface UserDisplayProps {
  readonly user: User;
}

export interface UserQueryProps {
  readonly userId: number;
}

export interface RtkQueryDemoProps {
  readonly userId: number;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

const initialUsers: User[] = [
  {
    id: 1,
    name: "John Doe",
    role: "Admin",
  },
  {
    id: 2,
    name: "Jane Doe",
    role: "Editor",
  },
];

const simulatedBaseQuery: BaseQueryFn<unknown, unknown, UserQueryError> = async (
  argument: unknown,
): Promise<{ data: unknown } | { error: UserQueryError }> => {
  await new Promise<void>((resolve: () => void) => {
    window.setTimeout(resolve, 500);
  });

  if (typeof argument !== "object" || argument === null || !("operation" in argument)) {
    return {
      error: {
        message: "Invalid API request.",
      },
    };
  }

  const request: {
    readonly operation: unknown;
    readonly id: unknown;
    readonly role: unknown;
  } = argument as {
    readonly operation: unknown;
    readonly id: unknown;
    readonly role: unknown;
  };

  if (request.operation === "getUser" && typeof request.id === "number") {
    const user: User | undefined = initialUsers.find((currentUser: User): boolean => currentUser.id === request.id);

    if (user === undefined) {
      return {
        error: {
          message: "User not found.",
        },
      };
    }

    return {
      data: user,
    };
  }

  if (request.operation === "updateUser" && typeof request.id === "number" && typeof request.role === "string") {
    const user: User | undefined = initialUsers.find((currentUser: User): boolean => currentUser.id === request.id);

    if (user === undefined) {
      return {
        error: {
          message: "User not found.",
        },
      };
    }

    const updatedUser: User = {
      ...user,
      role: request.role as User["role"],
    };

    return {
      data: updatedUser,
    };
  }

  return {
    error: {
      message: "Unsupported API operation.",
    },
  };
};

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fakeBaseQuery<UserQueryError>(),
  tagTypes: ["User"],
  endpoints: (builder) => ({
    getUser: builder.query<User, GetUserArgs>({
      queryFn: async ({ id }: GetUserArgs): Promise<{ data: User } | { error: UserQueryError }> => {
        const result = await simulatedBaseQuery({
          operation: "getUser",
          id,
        });

        if ("error" in result) {
          return result;
        }

        return {
          data: result.data as User,
        };
      },
      providesTags: (_result: User | undefined, _error: UserQueryError | undefined, argument: GetUserArgs) => [
        {
          type: "User" as const,
          id: argument.id,
        },
      ],
    }),
    updateUser: builder.mutation<User, UpdateUserArgs>({
      queryFn: async ({ id, role }: UpdateUserArgs): Promise<{ data: User } | { error: UserQueryError }> => {
        const result = await simulatedBaseQuery({
          operation: "updateUser",
          id,
          role,
        });

        if ("error" in result) {
          return result;
        }

        return {
          data: result.data as User,
        };
      },
      invalidatesTags: (_result: User | undefined, _error: UserQueryError | undefined, argument: UpdateUserArgs) => [
        {
          type: "User" as const,
          id: argument.id,
        },
      ],
    }),
  }),
});

export const { useGetUserQuery, useUpdateUserMutation } = userApi;

export const QueryStateDisplay: FC<QueryStateDisplayProps> = ({
  isLoading,
  isFetching,
  isSuccess,
  isError,
}): ReactElement => {
  return (
    <dl>
      <dt>Initial loading</dt>
      <dd>{isLoading ? "yes" : "no"}</dd>
      <dt>Fetching</dt>
      <dd>{isFetching ? "yes" : "no"}</dd>
      <dt>Success</dt>
      <dd>{isSuccess ? "yes" : "no"}</dd>
      <dt>Error</dt>
      <dd>{isError ? "yes" : "no"}</dd>
    </dl>
  );
};

export const UserDisplay: FC<UserDisplayProps> = ({ user }): ReactElement => {
  return (
    <article>
      <h3>{user.name}</h3>
      <p>User ID: {user.id}</p>
      <p>Role: {user.role}</p>
    </article>
  );
};

export const UserQuery: FC<UserQueryProps> = ({ userId }): ReactElement => {
  const query = useGetUserQuery({
    id: userId,
  });

  return (
    <div>
      <QueryStateDisplay
        isLoading={query.isLoading}
        isFetching={query.isFetching}
        isSuccess={query.isSuccess}
        isError={query.isError}
      />

      {query.isLoading && <p>Loading user...</p>}

      {query.isError && <p>Error: {query.error.message}</p>}

      {query.data !== undefined && <UserDisplay user={query.data} />}

      {query.isFetching && !query.isLoading && <p>Background fetch in progress...</p>}

      <button
        type="button"
        disabled={query.isFetching}
        onClick={() => {
          void query.refetch();
        }}
      >
        {query.isFetching ? "Fetching..." : "Refetch user"}
      </button>
    </div>
  );
};

export const UserMutation: FC<UserQueryProps> = ({ userId }): ReactElement => {
  const [updateUser, mutation] = useUpdateUserMutation();

  const updateRole = (): void => {
    void updateUser({
      id: userId,
      role: "Editor",
    });
  };

  return (
    <div>
      <p>Mutation status: {mutation.status}</p>

      {mutation.isLoading && <p>Updating user...</p>}

      {mutation.isSuccess && mutation.data !== undefined && <p>Server returned role: {mutation.data.role}</p>}

      {mutation.isError && <p>Error: {mutation.error.message}</p>}

      <button type="button" disabled={mutation.isLoading} onClick={updateRole}>
        {mutation.isLoading ? "Updating..." : "Update role"}
      </button>
    </div>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const store = configureStore({
  reducer: {
    [userApi.reducerPath]: userApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(userApi.middleware),
});

const RtkQueryDemo: FC<RtkQueryDemoProps> = ({ userId }): ReactElement => {
  const query = useGetUserQuery({
    id: userId,
  });

  return (
    <section>
      <h2>1. API Service</h2>
      <p>The API service defines query and mutation endpoints and owns their RTK Query cache.</p>

      <h2>2. Generated Query Hook</h2>
      <UserQuery userId={userId} />

      <h2>3. Query Cache Identity</h2>
      <p>The cache entry is associated with the getUser endpoint and its serialized arguments.</p>
      <p>Current resource: user {userId}</p>

      <h2>4. Query Lifecycle</h2>
      <QueryStateDisplay
        isLoading={query.isLoading}
        isFetching={query.isFetching}
        isSuccess={query.isSuccess}
        isError={query.isError}
      />

      <h2>5. Cached Server Data</h2>
      {query.data !== undefined && <UserDisplay user={query.data} />}

      <h2>6. Mutation Endpoint</h2>
      <UserMutation userId={userId} />

      <h2>7. Tag-Based Invalidation</h2>
      <p>
        The mutation invalidates the User tag for the updated ID, allowing the corresponding active query to be
        considered stale and refetched.
      </p>
    </section>
  );
};

const RtkQueryProvider: FC = (): ReactElement => {
  return (
    <Provider store={store}>
      <RtkQueryDemo userId={1} />
    </Provider>
  );
};

export default RtkQueryProvider;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// RTK Query is included with Redux Toolkit and provides server-state management for Redux applications.
// createApi defines an API service containing query and mutation endpoints.
// A query endpoint describes how a remote resource is retrieved.
// A mutation endpoint describes an operation that changes server state.
// RTK Query generates React hooks from the endpoint definitions.
// Query hooks expose data and request lifecycle state to React components.
// RTK Query stores query results in its managed cache using endpoint and argument identity.
// The API service's reducer must be registered in the Redux store.
// The API service's middleware handles RTK Query's asynchronous and cache-management behavior.
// Tags connect cached query data with mutations that may invalidate that data.
// Invalidating a tag can cause an affected active query to refetch.
// isLoading represents the initial loading state when query data is not available yet.
// isFetching can remain true while existing data is displayed during a refetch.
// The API service defines server communication and query behavior while components focus on presentation.
