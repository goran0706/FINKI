/**
 * Authentication Routes
 * =====================
 *
 * Authentication routes are routes that participate in the sign-in lifecycle,
 * including login, logout, callback, and authenticated application entry
 * points. React Router can coordinate navigation between these routes, while
 * the actual authentication state is normally owned by an authentication
 * service or application-level state.
 *
 * Authentication and authorization are separate concerns. Authentication
 * establishes whether a user has an authenticated identity, while authorization
 * determines what that authenticated user is permitted to access.
 *
 * A route configuration can represent the authentication lifecycle without
 * implementing an authentication provider. In a real application, the login
 * route would communicate with an identity provider or backend, the callback
 * route would process the provider response, and protected routes would verify
 * the resulting authenticated session before rendering protected content.
 */

import { type FC, type ReactElement } from "react";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router-dom";
import {
  createBrowserRouter,
  Form,
  Link,
  Outlet,
  redirect,
  RouterProvider,
  useLoaderData,
  useLocation,
  useNavigate,
} from "react-router-dom";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface AuthenticationState {
  readonly isAuthenticated: boolean;
  readonly username: string | null;
}

export interface AuthenticationUser {
  readonly id: string;
  readonly name: string;
  readonly email: string;
}

export interface AuthenticationRouteData {
  readonly user: AuthenticationUser;
}

export interface LoginActionData {
  readonly username: string;
}

export interface AuthenticationCallbackData {
  readonly provider: string;
  readonly status: "authenticated";
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * Demonstrates a public login route.
 *
 * The login route must remain accessible to unauthenticated users because it
 * is the entry point for establishing an authenticated session.
 */
export const LoginRouteExample: FC = (): ReactElement => {
  return (
    <section>
      <h2>1. Login route</h2>
      <p>This route is publicly accessible and represents the start of the authentication flow.</p>
      <Form method="post">
        <label>
          Username
          <input name="username" type="text" defaultValue="John Doe" required />
        </label>
        <button type="submit">Sign in</button>
      </Form>
    </section>
  );
};

/**
 * Demonstrates preserving a destination through the authentication flow.
 *
 * A protected route can redirect to login with a destination value so the
 * authentication flow knows where the user intended to go.
 */
export const LoginDestinationExample: FC = (): ReactElement => {
  const location = useLocation();

  const searchParams: URLSearchParams = new URLSearchParams(location.search);
  const redirectTo: string = searchParams.get("redirectTo") ?? "/";

  return (
    <section>
      <h2>2. Preserved login destination</h2>
      <p>After authentication, the application can return the user to:</p>
      <p>{redirectTo}</p>
      <Form method="post">
        <input name="username" type="hidden" value="John Doe" />
        <input name="redirectTo" type="hidden" value={redirectTo} />
        <button type="submit">Complete sign in</button>
      </Form>
    </section>
  );
};

/**
 * Demonstrates an authenticated application route.
 *
 * The loader verifies the current authentication state before the route
 * receives the authenticated user's data.
 */
export const AuthenticatedApplicationExample: FC = (): ReactElement => {
  const data = useLoaderData<typeof authenticatedApplicationLoader>();

  return (
    <section>
      <h2>3. Authenticated application route</h2>
      <p>Welcome, {data.user.name}.</p>
      <p>Email: {data.user.email}</p>
      <Link to="/account">Account</Link>
    </section>
  );
};

/**
 * Demonstrates an authentication callback route.
 *
 * External identity providers commonly return the browser to a callback URL.
 * The callback route can process the authentication result before redirecting
 * the user into the authenticated application.
 */
export const AuthenticationCallbackExample: FC = (): ReactElement => {
  const data = useLoaderData<typeof authenticationCallbackLoader>();

  return (
    <section>
      <h2>4. Authentication callback</h2>
      <p>Provider: {data.provider}</p>
      <p>Authentication status: {data.status}</p>
    </section>
  );
};

/**
 * Demonstrates a logout route.
 *
 * Logging out normally invalidates the authenticated session and then
 * redirects the user to a public route such as the login page.
 */
export const LogoutRouteExample: FC = (): ReactElement => {
  return (
    <section>
      <h2>5. Logout route</h2>
      <p>The logout action represents the end of an authenticated session.</p>
      <Form method="post">
        <button type="submit">Sign out</button>
      </Form>
    </section>
  );
};

/**
 * Demonstrates an authenticated route layout.
 *
 * A parent authentication route can provide shared authenticated navigation
 * and render its child routes through an `Outlet`.
 */
export const AuthenticatedLayoutExample: FC = (): ReactElement => {
  const data = useLoaderData<typeof authenticatedApplicationLoader>();

  return (
    <main>
      <h2>6. Authenticated route layout</h2>
      <p>Signed in as {data.user.name}.</p>
      <nav aria-label="Authenticated navigation">
        <Link to="/app">Home</Link>
        {" | "}
        <Link to="/app/account">Account</Link>
        {" | "}
        <Link to="/app/logout">Logout</Link>
      </nav>
      <Outlet />
    </main>
  );
};

/**
 * Demonstrates an authenticated child route.
 *
 * Once the parent authentication loader succeeds, child routes can render
 * inside the authenticated application layout.
 */
export const AuthenticatedChildExample: FC = (): ReactElement => {
  return (
    <section>
      <h3>Authenticated home</h3>
      <p>This route is rendered inside the authenticated application layout.</p>
    </section>
  );
};

/**
 * Demonstrates an account route that uses authenticated route data.
 */
export const AuthenticatedAccountExample: FC = (): ReactElement => {
  const data = useLoaderData<typeof authenticatedApplicationLoader>();

  return (
    <section>
      <h3>Account</h3>
      <p>Name: {data.user.name}</p>
      <p>Email: {data.user.email}</p>
    </section>
  );
};

/**
 * Demonstrates navigation after authentication.
 *
 * `useNavigate` can be used when application code needs to navigate after an
 * authentication-related operation has completed.
 */
export const PostAuthenticationNavigationExample: FC = (): ReactElement => {
  const navigate = useNavigate();

  return (
    <section>
      <h2>9. Post-authentication navigation</h2>
      <p>Navigation can occur after an authentication operation succeeds.</p>
      <button
        type="button"
        onClick={() => {
          navigate("/app");
        }}
      >
        Open authenticated application
      </button>
    </section>
  );
};

/**
 * Demonstrates separating authentication from authorization.
 *
 * Authentication routes establish or end the user's session, while
 * authorization rules determine which authenticated routes are available.
 */
export const AuthenticationVsAuthorizationExample: FC = (): ReactElement => {
  return (
    <section>
      <h2>10. Authentication vs authorization</h2>
      <p>Authentication establishes the user's authenticated identity.</p>
      <p>Authorization determines which authenticated resources the user is allowed to access.</p>
    </section>
  );
};

/**
 * Demonstrates that authentication state must come from an actual source of
 * truth rather than from the URL alone.
 *
 * A query parameter can carry routing information such as a return destination,
 * but it should not itself be treated as proof that a user is authenticated.
 */
export const AuthenticationStateSourceExample: FC = (): ReactElement => {
  return (
    <section>
      <h2>11. Authentication state source</h2>
      <p>
        Authentication state should come from the application's session or identity provider, not from an arbitrary URL
        parameter.
      </p>
    </section>
  );
};

/**
 * Demonstrates a common misconception about authentication routes.
 *
 * Rendering a login page does not authenticate a user. The application must
 * complete the authentication protocol and establish a trusted session before
 * protected routes treat the user as authenticated.
 */
export const LoginDoesNotAuthenticateByItselfExample: FC = (): ReactElement => {
  return (
    <section>
      <h2>12. Login UI is not authentication</h2>
      <p>A login form is only part of the authentication flow.</p>
      <p>Protected routes should rely on verified authentication state.</p>
    </section>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const authenticationState: AuthenticationState = {
  isAuthenticated: true,
  username: "John Doe",
};

const getAuthenticatedUser = (): AuthenticationUser | null => {
  if (!authenticationState.isAuthenticated || !authenticationState.username) {
    return null;
  }

  return {
    id: "user-100",
    name: authenticationState.username,
    email: "john.doe@example.com",
  };
};

const authenticatedApplicationLoader = async (): Promise<AuthenticationRouteData> => {
  const user: AuthenticationUser | null = getAuthenticatedUser();

  if (!user) {
    throw redirect("/login");
  }

  return {
    user,
  };
};

const loginAction = async ({ request }: ActionFunctionArgs): Promise<Response> => {
  const formData: FormData = await request.formData();
  const usernameValue: FormDataEntryValue | null = formData.get("username");
  const username: string = typeof usernameValue === "string" ? usernameValue.trim() : "";

  if (!username) {
    throw new Response("Username is required.", {
      status: 400,
      statusText: "Bad Request",
    });
  }

  const redirectValue: FormDataEntryValue | null = formData.get("redirectTo");
  const redirectTo: string = typeof redirectValue === "string" ? redirectValue : "/app";

  return redirect(redirectTo.startsWith("/") ? redirectTo : "/app");
};

const callbackLoader = async ({ request }: LoaderFunctionArgs): Promise<AuthenticationCallbackData> => {
  const url: URL = new URL(request.url);
  const provider: string = url.searchParams.get("provider") ?? "example-idp";

  return {
    provider,
    status: "authenticated",
  };
};

const authenticationCallbackLoader = async (): Promise<AuthenticationCallbackData> => {
  return {
    provider: "example-idp",
    status: "authenticated",
  };
};

const logoutAction = async (): Promise<Response> => {
  return redirect("/login");
};

const HomePage: FC = (): ReactElement => {
  return (
    <main>
      <h1>Authentication Routes</h1>
      <p>Select an example to inspect the routes involved in an authentication flow.</p>

      <nav aria-label="Authentication route examples">
        <ul>
          <li>
            <Link to="/login">Login</Link>
          </li>
          <li>
            <Link to="/login?redirectTo=/app/account">Preserved login destination</Link>
          </li>
          <li>
            <Link to="/app">Authenticated application</Link>
          </li>
          <li>
            <Link to="/auth/callback?provider=example-idp">Authentication callback</Link>
          </li>
          <li>
            <Link to="/logout">Logout</Link>
          </li>
          <li>
            <Link to="/app">Authenticated route layout</Link>
          </li>
          <li>
            <Link to="/post-authentication">Post-authentication navigation</Link>
          </li>
          <li>
            <Link to="/authentication-vs-authorization">Authentication vs authorization</Link>
          </li>
          <li>
            <Link to="/authentication-state">Authentication state source</Link>
          </li>
          <li>
            <Link to="/login-not-authentication">Login UI is not authentication</Link>
          </li>
        </ul>
      </nav>
    </main>
  );
};

const AuthenticatedHomePage: FC = (): ReactElement => {
  return (
    <section>
      <h3>Authenticated application</h3>
      <p>The authenticated route layout has completed its access check.</p>
    </section>
  );
};

const AuthenticationRoutesDemo: FC = (): ReactElement => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <HomePage />,
    },
    {
      path: "/login",
      element: <LoginDestinationExample />,
      action: loginAction,
    },
    {
      path: "/login-form",
      element: <LoginRouteExample />,
      action: loginAction,
    },
    {
      path: "/auth/callback",
      element: <AuthenticationCallbackExample />,
      loader: authenticationCallbackLoader,
    },
    {
      path: "/logout",
      element: <LogoutRouteExample />,
      action: logoutAction,
    },
    {
      path: "/app",
      element: <AuthenticatedLayoutExample />,
      loader: authenticatedApplicationLoader,
      children: [
        {
          index: true,
          element: <AuthenticatedChildExample />,
        },
        {
          path: "account",
          element: <AuthenticatedAccountExample />,
          loader: authenticatedApplicationLoader,
        },
        {
          path: "logout",
          element: <LogoutRouteExample />,
          action: logoutAction,
        },
      ],
    },
    {
      path: "/post-authentication",
      element: <PostAuthenticationNavigationExample />,
    },
    {
      path: "/authentication-vs-authorization",
      element: <AuthenticationVsAuthorizationExample />,
    },
    {
      path: "/authentication-state",
      element: <AuthenticationStateSourceExample />,
    },
    {
      path: "/login-not-authentication",
      element: <LoginDoesNotAuthenticateByItselfExample />,
    },
  ]);

  return <RouterProvider router={router} />;
};

export default AuthenticationRoutesDemo;

// ---------------------------------------------------------------------
// Summary
// Authentication routes represent stages such as login, callback, authenticated application access, and logout.
// Authentication establishes an authenticated identity; authorization determines what that identity may access.
// A login route must remain accessible to users who are not authenticated.
// A protected application route can verify authentication in its loader before rendering.
// A return destination can be preserved through the login flow.
// Callback routes can process the result of an external identity-provider flow.
// Logout routes can invalidate the session and redirect to a public route.
// An authenticated parent route can provide shared navigation and render child routes through an `Outlet`.
// `useNavigate` can perform navigation after an authentication-related operation completes.
// Authentication state must come from a trusted session or identity source rather than from URL parameters.
// Rendering a login form does not itself establish authentication.
// ---------------------------------------------------------------------
