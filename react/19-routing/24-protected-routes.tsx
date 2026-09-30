/**
 * Protected Routes
 * ================
 *
 * A protected route restricts access to route content based on application
 * state such as authentication. In React Router data routers, access checks
 * can be performed in loaders before the protected route renders, allowing
 * unauthenticated users to be redirected before protected data is displayed.
 *
 * Authentication answers whether a user is signed in, while authorization
 * answers whether that authenticated user has permission to access a particular
 * resource. A route can therefore be protected by authentication alone or by
 * both authentication and authorization rules.
 *
 * Client-side route protection improves the user experience by controlling
 * navigation and rendering, but it is not a security boundary by itself.
 * Sensitive data and privileged operations must still be protected by the
 * server or API that owns the resource.
 */

import { type FC, type ReactElement } from "react";
import type { LoaderFunctionArgs } from "react-router-dom";
import { createBrowserRouter, Link, Outlet, redirect, RouterProvider, useLoaderData } from "react-router-dom";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface AuthState {
  readonly isAuthenticated: boolean;
  readonly username: string | null;
}

export interface UserProfile {
  readonly username: string;
  readonly email: string;
}

export interface ProtectedRouteData {
  readonly user: UserProfile;
}

export interface AuthorizationData {
  readonly username: string;
  readonly role: "user" | "admin";
}

export interface ProtectedNavigationProps {
  readonly destination: string;
  readonly label: string;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * Demonstrates a public route.
 *
 * Public routes do not require authentication and can be rendered regardless
 * of whether the current user is signed in.
 */
export const PublicRouteExample: FC = (): ReactElement => {
  return (
    <section>
      <h2>1. Public route</h2>
      <p>This route is available without authentication.</p>
      <Link to="/private">Open protected route</Link>
    </section>
  );
};

/**
 * Demonstrates a protected route using a loader-based access check.
 *
 * The loader runs before the protected route renders. When the user is not
 * authenticated, it redirects to the login route instead of rendering the
 * protected component.
 */
export const ProtectedRouteExample: FC = (): ReactElement => {
  const data = useLoaderData<typeof protectedRouteLoader>();

  return (
    <section>
      <h2>2. Protected route</h2>
      <p>Welcome, {data.user.username}.</p>
      <p>This content is rendered only after the authentication check succeeds.</p>
    </section>
  );
};

/**
 * Demonstrates preserving the originally requested destination.
 *
 * A protected-route loader can include the current pathname in the login URL
 * so that the authentication flow can return the user to the requested route.
 */
export const PreservedDestinationExample: FC = (): ReactElement => {
  const data = useLoaderData<typeof protectedRouteLoader>();

  return (
    <section>
      <h2>3. Preserved destination</h2>
      <p>Authenticated user: {data.user.username}</p>
      <p>This route was reached after its access check completed.</p>
    </section>
  );
};

/**
 * Demonstrates an authentication check separate from authorization.
 *
 * An authenticated user can still be denied access when the application
 * requires a particular role or permission.
 */
export const AuthorizationExample: FC = (): ReactElement => {
  const data = useLoaderData<typeof adminRouteLoader>();

  return (
    <section>
      <h2>4. Authorization</h2>
      <p>User: {data.username}</p>
      <p>Role: {data.role}</p>
      <p>This route requires both authentication and the administrator role.</p>
    </section>
  );
};

/**
 * Demonstrates a protected route layout.
 *
 * A parent route can perform the access check once and render multiple
 * protected child routes through an `Outlet`.
 */
export const ProtectedLayoutExample: FC = (): ReactElement => {
  const data = useLoaderData<typeof protectedLayoutLoader>();

  return (
    <main>
      <h2>5. Protected route layout</h2>
      <p>Signed in as {data.user.username}.</p>
      <nav aria-label="Protected navigation">
        <Link to="/account">Account</Link>
        {" | "}
        <Link to="/account/settings">Settings</Link>
      </nav>
      <Outlet />
    </main>
  );
};

/**
 * Demonstrates a protected child route.
 *
 * Once the parent authentication check succeeds, the child routes can render
 * inside the protected layout without repeating the same authentication check.
 */
export const ProtectedChildRouteExample: FC = (): ReactElement => {
  return (
    <section>
      <h3>Protected child route</h3>
      <p>This child route is rendered inside an authenticated route layout.</p>
    </section>
  );
};

/**
 * Demonstrates a protected route with its own authorization check.
 *
 * Authentication can be established by the parent while a child loader applies
 * a more specific permission or role requirement.
 */
export const ProtectedAdminChildExample: FC = (): ReactElement => {
  const data = useLoaderData<typeof adminRouteLoader>();

  return (
    <section>
      <h3>Protected administrator route</h3>
      <p>{data.username} has the required administrator role.</p>
    </section>
  );
};

/**
 * Demonstrates the difference between authentication and authorization.
 *
 * Authentication identifies whether the user is signed in; authorization
 * determines whether that signed-in user may access a particular resource.
 */
export const AuthenticationVsAuthorizationExample: FC = (): ReactElement => {
  return (
    <section>
      <h2>7. Authentication vs authorization</h2>
      <p>Authentication determines who the user is.</p>
      <p>Authorization determines what that authenticated user is allowed to access.</p>
    </section>
  );
};

/**
 * Demonstrates a public login route.
 *
 * A login page itself should normally remain publicly accessible because an
 * unauthenticated user needs somewhere to complete the authentication flow.
 */
export const LoginRouteExample: FC = (): ReactElement => {
  return (
    <section>
      <h2>8. Login route</h2>
      <p>This route is public so an unauthenticated user can complete authentication.</p>
      <Link to="/private">Try the protected route</Link>
    </section>
  );
};

/**
 * Demonstrates a protected route that renders multiple pieces of content.
 *
 * The access decision happens before this component reads its protected route
 * data, so the component can focus on presentation rather than access control.
 */
export const ProtectedContentExample: FC = (): ReactElement => {
  const data = useLoaderData<typeof protectedRouteLoader>();

  return (
    <section>
      <h2>9. Protected content</h2>
      <p>Account owner: {data.user.username}</p>
      <p>Email: {data.user.email}</p>
    </section>
  );
};

/**
 * Demonstrates why a client-side guard is not a security boundary.
 *
 * Route protection controls what the client displays and where it navigates.
 * The server must independently enforce authentication and authorization for
 * protected data and privileged operations.
 */
export const ClientGuardIsNotSecurityBoundaryExample: FC = (): ReactElement => {
  return (
    <section>
      <h2>10. Client guard is not a security boundary</h2>
      <p>Client-side route protection controls the application's navigation and UI.</p>
      <p>The server or API must independently enforce access to protected resources.</p>
    </section>
  );
};

/**
 * Demonstrates a common misconception about protected routes.
 *
 * Hiding a link does not protect the destination because users can navigate
 * directly to a URL. The route itself must perform the access check.
 */
export const HidingLinksIsNotProtectionExample: FC = (): ReactElement => {
  return (
    <section>
      <h2>11. Hiding links is not protection</h2>
      <p>Removing a navigation link does not prevent direct navigation to its URL.</p>
      <p>Access control belongs at the route and server/API boundaries.</p>
    </section>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const authState: AuthState = {
  isAuthenticated: true,
  username: "John Doe",
};

const adminAuthState: AuthState = {
  isAuthenticated: true,
  username: "John Doe",
};

const getCurrentUser = (): UserProfile | null => {
  if (!authState.isAuthenticated || !authState.username) {
    return null;
  }

  return {
    username: authState.username,
    email: "john.doe@example.com",
  };
};

const getCurrentAdmin = (): AuthorizationData | null => {
  if (!adminAuthState.isAuthenticated || !adminAuthState.username) {
    return null;
  }

  return {
    username: adminAuthState.username,
    role: "admin",
  };
};

const protectedRouteLoader = async ({ request }: LoaderFunctionArgs): Promise<ProtectedRouteData> => {
  const user: UserProfile | null = getCurrentUser();

  if (!user) {
    const url: URL = new URL(request.url);
    const redirectTo: string = `${url.pathname}${url.search}`;

    throw redirect(`/login?redirectTo=${encodeURIComponent(redirectTo)}`);
  }

  return {
    user,
  };
};

const adminRouteLoader = async ({ request }: LoaderFunctionArgs): Promise<AuthorizationData> => {
  const admin: AuthorizationData | null = getCurrentAdmin();

  if (!admin) {
    const url: URL = new URL(request.url);
    const redirectTo: string = `${url.pathname}${url.search}`;

    throw redirect(`/login?redirectTo=${encodeURIComponent(redirectTo)}`);
  }

  if (admin.role !== "admin") {
    throw new Response("Forbidden", {
      status: 403,
      statusText: "Forbidden",
    });
  }

  return admin;
};

const protectedLayoutLoader = async (): Promise<ProtectedRouteData> => {
  const user: UserProfile | null = getCurrentUser();

  if (!user) {
    throw redirect("/login");
  }

  return {
    user,
  };
};

const HomePage: FC = (): ReactElement => {
  return (
    <main>
      <h1>Protected Routes</h1>
      <p>Select an example to inspect authentication and authorization checks.</p>

      <nav aria-label="Protected route examples">
        <ul>
          <li>
            <Link to="/public">Public route</Link>
          </li>
          <li>
            <Link to="/private">Protected route</Link>
          </li>
          <li>
            <Link to="/private/destination">Preserved destination</Link>
          </li>
          <li>
            <Link to="/admin">Authorization</Link>
          </li>
          <li>
            <Link to="/account">Protected route layout</Link>
          </li>
          <li>
            <Link to="/account/admin">Protected administrator child</Link>
          </li>
          <li>
            <Link to="/authentication-vs-authorization">Authentication vs authorization</Link>
          </li>
          <li>
            <Link to="/login">Login route</Link>
          </li>
          <li>
            <Link to="/private/content">Protected content</Link>
          </li>
          <li>
            <Link to="/client-guard">Client guard limitation</Link>
          </li>
          <li>
            <Link to="/hidden-link">Hiding links is not protection</Link>
          </li>
        </ul>
      </nav>
    </main>
  );
};

const AccountSettingsPage: FC = (): ReactElement => {
  return (
    <section>
      <h3>Account settings</h3>
      <p>This child route is protected by the parent route layout.</p>
    </section>
  );
};

const LoginPage: FC = (): ReactElement => {
  return (
    <main>
      <h1>Login</h1>
      <p>
        This example uses a fixed authenticated state so the protected route examples can be inspected without a real
        authentication service.
      </p>
      <Link to="/">Return home</Link>
    </main>
  );
};

const ForbiddenPage: FC = (): ReactElement => {
  return (
    <main>
      <h1>Access denied</h1>
      <p>The authenticated user does not have permission to access this resource.</p>
      <Link to="/">Return home</Link>
    </main>
  );
};

const ProtectedRoutesDemo: FC = (): ReactElement => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <HomePage />,
    },
    {
      path: "/public",
      element: <PublicRouteExample />,
    },
    {
      path: "/private",
      element: <ProtectedRouteExample />,
      loader: protectedRouteLoader,
    },
    {
      path: "/private/destination",
      element: <PreservedDestinationExample />,
      loader: protectedRouteLoader,
    },
    {
      path: "/private/content",
      element: <ProtectedContentExample />,
      loader: protectedRouteLoader,
    },
    {
      path: "/admin",
      element: <AuthorizationExample />,
      loader: adminRouteLoader,
      errorElement: <ForbiddenPage />,
    },
    {
      path: "/account",
      element: <ProtectedLayoutExample />,
      loader: protectedLayoutLoader,
      children: [
        {
          index: true,
          element: <ProtectedChildRouteExample />,
        },
        {
          path: "settings",
          element: <AccountSettingsPage />,
        },
        {
          path: "admin",
          element: <ProtectedAdminChildExample />,
          loader: adminRouteLoader,
          errorElement: <ForbiddenPage />,
        },
      ],
    },
    {
      path: "/authentication-vs-authorization",
      element: <AuthenticationVsAuthorizationExample />,
    },
    {
      path: "/login",
      element: <LoginRouteExample />,
    },
    {
      path: "/client-guard",
      element: <ClientGuardIsNotSecurityBoundaryExample />,
    },
    {
      path: "/hidden-link",
      element: <HidingLinksIsNotProtectionExample />,
    },
  ]);

  return <RouterProvider router={router} />;
};

export default ProtectedRoutesDemo;

// ---------------------------------------------------------------------
// Summary
// Protected routes restrict access based on authentication or authorization state.
// A data-router loader can check access before the protected route renders.
// `redirect` can send unauthenticated users to a login route.
// The original destination can be preserved during a login redirect.
// Authentication determines whether a user is signed in; authorization determines what that user may access.
// A protected parent route can protect multiple child routes through an `Outlet`.
// Child routes can apply additional authorization checks when different permissions are required.
// Hiding navigation links does not prevent direct navigation to a protected URL.
// Client-side route guards control navigation and UI but are not a security boundary.
// Servers and APIs must independently enforce authentication and authorization for protected resources.
// ---------------------------------------------------------------------
