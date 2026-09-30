/**
 * Authorization Routes
 * =====================
 *
 * Authorization determines whether an authenticated user is permitted to
 * access a particular route or resource. Unlike authentication, which answers
 * whether a user has an authenticated identity, authorization evaluates that
 * identity against application-specific roles, permissions, or ownership rules.
 *
 * React Router data routers can perform authorization checks in loaders before
 * rendering protected route content. A loader can return the required route
 * data when access is allowed or throw a `Response` with a `403` status when
 * the authenticated user does not have the required permission.
 *
 * Authorization logic should be enforced by the server or API that owns the
 * protected resource. Client-side route checks are useful for navigation and
 * user experience, but they must not be treated as the security boundary.
 */

import { type FC, type ReactElement } from "react";
import type { LoaderFunctionArgs } from "react-router-dom";
import {
  createBrowserRouter,
  isRouteErrorResponse,
  Link,
  Outlet,
  redirect,
  RouterProvider,
  useLoaderData,
  useRouteError,
} from "react-router-dom";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface AuthenticatedUser {
  readonly id: string;
  readonly name: string;
  readonly role: "user" | "editor" | "admin";
  readonly permissions: readonly string[];
}

export interface AuthorizationRouteData {
  readonly user: AuthenticatedUser;
  readonly resource: string;
}

export interface RoleRouteData {
  readonly user: AuthenticatedUser;
  readonly requiredRole: "user" | "editor" | "admin";
}

export interface PermissionRouteData {
  readonly user: AuthenticatedUser;
  readonly requiredPermission: string;
}

export interface OwnershipRouteData {
  readonly user: AuthenticatedUser;
  readonly resourceOwnerId: string;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * Demonstrates a route accessible to every authenticated user.
 *
 * Authentication and authorization are separate checks. This route only
 * requires an authenticated identity and does not require a special role
 * or permission.
 */
export const AuthenticatedRouteExample: FC = (): ReactElement => {
  const data = useLoaderData<typeof authenticatedRouteLoader>();

  return (
    <section>
      <h2>1. Authenticated route</h2>
      <p>Welcome, {data.user.name}.</p>
      <p>This route requires authentication but no special authorization.</p>
    </section>
  );
};

/**
 * Demonstrates role-based authorization.
 *
 * The route loader checks the authenticated user's role before returning the
 * route data required by the component.
 */
export const RoleBasedAuthorizationExample: FC = (): ReactElement => {
  const data = useLoaderData<typeof adminRouteLoader>();

  return (
    <section>
      <h2>2. Role-based authorization</h2>
      <p>User: {data.user.name}</p>
      <p>Required role: {data.requiredRole}</p>
      <p>Access granted because the user's role satisfies the route requirement.</p>
    </section>
  );
};

/**
 * Demonstrates permission-based authorization.
 *
 * Permissions can represent more specific capabilities than broad roles,
 * allowing routes to require a particular operation.
 */
export const PermissionBasedAuthorizationExample: FC = (): ReactElement => {
  const data = useLoaderData<typeof permissionRouteLoader>();

  return (
    <section>
      <h2>3. Permission-based authorization</h2>
      <p>User: {data.user.name}</p>
      <p>Required permission: {data.requiredPermission}</p>
    </section>
  );
};

/**
 * Demonstrates a forbidden-route boundary.
 *
 * A loader can throw a `403` response when authentication succeeds but the
 * authenticated user does not have permission to access the route.
 */
export const ForbiddenRouteExample: FC = (): ReactElement => {
  const error: unknown = useRouteError();

  if (isRouteErrorResponse(error) && error.status === 403) {
    return (
      <main>
        <h2>Access denied</h2>
        <p>You are authenticated but do not have permission to access this route.</p>
        <Link to="/">Return home</Link>
      </main>
    );
  }

  return (
    <main>
      <h2>Authorization error</h2>
      <p>The authorization check could not be completed.</p>
      <Link to="/">Return home</Link>
    </main>
  );
};

/**
 * Demonstrates route-level authorization inside a protected layout.
 *
 * The parent layout can establish authentication while individual child routes
 * apply more specific authorization requirements.
 */
export const AuthorizationLayoutExample: FC = (): ReactElement => {
  const data = useLoaderData<typeof authenticatedLayoutLoader>();

  return (
    <main>
      <h2>5. Authorization layout</h2>
      <p>Signed in as {data.user.name}.</p>
      <nav aria-label="Authorized navigation">
        <Link to="/workspace">Workspace</Link>
        {" | "}
        <Link to="/workspace/editor">Editor</Link>
        {" | "}
        <Link to="/workspace/admin">Administration</Link>
      </nav>
      <Outlet />
    </main>
  );
};

/**
 * Demonstrates a role-restricted child route.
 *
 * The parent authentication check does not automatically grant every child
 * permission. The child route can perform an additional role check.
 */
export const EditorRouteExample: FC = (): ReactElement => {
  const data = useLoaderData<typeof editorRouteLoader>();

  return (
    <section>
      <h3>Editor workspace</h3>
      <p>
        {data.user.name} has the {data.requiredRole} role.
      </p>
      <p>Editing functionality is available.</p>
    </section>
  );
};

/**
 * Demonstrates an administrator-only child route.
 *
 * The same authenticated user can reach the parent layout while a more
 * restrictive child route denies access when the role is insufficient.
 */
export const AdminRouteExample: FC = (): ReactElement => {
  const data = useLoaderData<typeof adminRouteLoader>();

  return (
    <section>
      <h3>Administration</h3>
      <p>{data.user.name} has administrator access.</p>
    </section>
  );
};

/**
 * Demonstrates resource ownership authorization.
 *
 * A user may be allowed to access a resource only when the authenticated
 * user's identifier matches the resource owner's identifier.
 */
export const ResourceOwnershipExample: FC = (): ReactElement => {
  const data = useLoaderData<typeof ownershipRouteLoader>();

  return (
    <section>
      <h2>8. Resource ownership</h2>
      <p>User: {data.user.name}</p>
      <p>Resource owner: {data.resourceOwnerId}</p>
      <p>Access is granted because the authenticated user owns the resource.</p>
    </section>
  );
};

/**
 * Demonstrates multiple authorization conditions.
 *
 * Authorization rules can combine requirements, such as requiring both a
 * specific role and a specific permission.
 */
export const CombinedAuthorizationExample: FC = (): ReactElement => {
  const data = useLoaderData<typeof combinedAuthorizationLoader>();

  return (
    <section>
      <h2>9. Combined authorization</h2>
      <p>User: {data.user.name}</p>
      <p>Role: {data.user.role}</p>
      <p>Required permission: {data.requiredPermission}</p>
    </section>
  );
};

/**
 * Demonstrates that hiding UI controls is not authorization.
 *
 * Removing a button or link can improve the interface for unauthorized users,
 * but the route or server must still enforce the actual access rule.
 */
export const HiddenControlsAreNotAuthorizationExample: FC = (): ReactElement => {
  return (
    <section>
      <h2>10. Hidden controls are not authorization</h2>
      <p>Hiding an administrative link does not prevent direct navigation to the administrative URL.</p>
      <p>The authorization rule must be enforced when the protected resource is accessed.</p>
    </section>
  );
};

/**
 * Demonstrates that client-side authorization is not a security boundary.
 *
 * The route can prevent unauthorized UI from rendering, but the backend must
 * independently verify authorization for protected operations and data.
 */
export const ServerAuthorizationExample: FC = (): ReactElement => {
  return (
    <section>
      <h2>11. Server-side authorization</h2>
      <p>Client-side authorization controls navigation and presentation.</p>
      <p>The server or API must independently enforce the same access policy.</p>
    </section>
  );
};

/**
 * Demonstrates a route that requires a specific permission without exposing
 * the authorization implementation to the component.
 *
 * The component receives authorized data only after the loader's policy check
 * has succeeded.
 */
export const AuthorizationBoundaryExample: FC = (): ReactElement => {
  const data = useLoaderData<typeof permissionRouteLoader>();

  return (
    <section>
      <h2>12. Authorization boundary</h2>
      <p>Authorized user: {data.user.name}</p>
      <p>Resource: {data.requiredPermission}</p>
    </section>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const currentUser: AuthenticatedUser = {
  id: "user-100",
  name: "John Doe",
  role: "editor",
  permissions: ["workspace.read", "workspace.edit", "profile.read"],
};

const getAuthenticatedUser = (): AuthenticatedUser | null => {
  return currentUser;
};

const requireAuthenticatedUser = (): AuthenticatedUser => {
  const user: AuthenticatedUser | null = getAuthenticatedUser();

  if (!user) {
    throw redirect("/login");
  }

  return user;
};

const requireRole = (user: AuthenticatedUser, requiredRole: "user" | "editor" | "admin"): void => {
  const roleRank: Record<AuthenticatedUser["role"], number> = {
    user: 1,
    editor: 2,
    admin: 3,
  };

  if (roleRank[user.role] < roleRank[requiredRole]) {
    throw new Response("Forbidden", {
      status: 403,
      statusText: "Forbidden",
    });
  }
};

const requirePermission = (user: AuthenticatedUser, requiredPermission: string): void => {
  if (!user.permissions.includes(requiredPermission)) {
    throw new Response("Forbidden", {
      status: 403,
      statusText: "Forbidden",
    });
  }
};

const authenticatedRouteLoader = async (): Promise<AuthorizationRouteData> => {
  const user: AuthenticatedUser = requireAuthenticatedUser();

  return {
    user,
    resource: "authenticated workspace",
  };
};

const adminRouteLoader = async (): Promise<RoleRouteData> => {
  const user: AuthenticatedUser = requireAuthenticatedUser();

  requireRole(user, "admin");

  return {
    user,
    requiredRole: "admin",
  };
};

const permissionRouteLoader = async (): Promise<PermissionRouteData> => {
  const user: AuthenticatedUser = requireAuthenticatedUser();

  requirePermission(user, "workspace.edit");

  return {
    user,
    requiredPermission: "workspace.edit",
  };
};

const authenticatedLayoutLoader = async (): Promise<AuthorizationRouteData> => {
  const user: AuthenticatedUser = requireAuthenticatedUser();

  return {
    user,
    resource: "workspace",
  };
};

const editorRouteLoader = async (): Promise<RoleRouteData> => {
  const user: AuthenticatedUser = requireAuthenticatedUser();

  requireRole(user, "editor");

  return {
    user,
    requiredRole: "editor",
  };
};

const ownershipRouteLoader = async ({ params }: LoaderFunctionArgs): Promise<OwnershipRouteData> => {
  const user: AuthenticatedUser = requireAuthenticatedUser();
  const resourceOwnerId: string = params.userId ?? "";

  if (resourceOwnerId !== user.id) {
    throw new Response("Forbidden", {
      status: 403,
      statusText: "Forbidden",
    });
  }

  return {
    user,
    resourceOwnerId,
  };
};

const combinedAuthorizationLoader = async (): Promise<PermissionRouteData> => {
  const user: AuthenticatedUser = requireAuthenticatedUser();

  requireRole(user, "editor");
  requirePermission(user, "workspace.edit");

  return {
    user,
    requiredPermission: "workspace.edit",
  };
};

const DashboardPage: FC = (): ReactElement => {
  return (
    <section>
      <h3>Workspace home</h3>
      <p>The authenticated user can access the general workspace.</p>
    </section>
  );
};

const LoginPage: FC = (): ReactElement => {
  return (
    <main>
      <h1>Login</h1>
      <p>This example uses a fixed authenticated user for demonstration.</p>
      <Link to="/">Return home</Link>
    </main>
  );
};

const HomePage: FC = (): ReactElement => {
  return (
    <main>
      <h1>Authorization Routes</h1>
      <p>Select an example to inspect role, permission, and ownership checks.</p>

      <nav aria-label="Authorization route examples">
        <ul>
          <li>
            <Link to="/authenticated">Authenticated route</Link>
          </li>
          <li>
            <Link to="/admin">Role-based authorization</Link>
          </li>
          <li>
            <Link to="/edit">Permission-based authorization</Link>
          </li>
          <li>
            <Link to="/workspace">Authorization layout</Link>
          </li>
          <li>
            <Link to="/workspace/editor">Editor route</Link>
          </li>
          <li>
            <Link to="/workspace/admin">Admin route</Link>
          </li>
          <li>
            <Link to="/users/user-100/profile">Resource ownership</Link>
          </li>
          <li>
            <Link to="/combined">Combined authorization</Link>
          </li>
          <li>
            <Link to="/hidden-controls">Hidden controls</Link>
          </li>
          <li>
            <Link to="/server-authorization">Server authorization</Link>
          </li>
          <li>
            <Link to="/authorization-boundary">Authorization boundary</Link>
          </li>
        </ul>
      </nav>
    </main>
  );
};

const AuthorizationRoutesDemo: FC = (): ReactElement => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <HomePage />,
    },
    {
      path: "/authenticated",
      element: <AuthenticatedRouteExample />,
      loader: authenticatedRouteLoader,
    },
    {
      path: "/admin",
      element: <RoleBasedAuthorizationExample />,
      loader: adminRouteLoader,
      errorElement: <ForbiddenRouteExample />,
    },
    {
      path: "/edit",
      element: <PermissionBasedAuthorizationExample />,
      loader: permissionRouteLoader,
      errorElement: <ForbiddenRouteExample />,
    },
    {
      path: "/workspace",
      element: <AuthorizationLayoutExample />,
      loader: authenticatedLayoutLoader,
      children: [
        {
          index: true,
          element: <DashboardPage />,
        },
        {
          path: "editor",
          element: <EditorRouteExample />,
          loader: editorRouteLoader,
          errorElement: <ForbiddenRouteExample />,
        },
        {
          path: "admin",
          element: <AdminRouteExample />,
          loader: adminRouteLoader,
          errorElement: <ForbiddenRouteExample />,
        },
      ],
    },
    {
      path: "/users/:userId/profile",
      element: <ResourceOwnershipExample />,
      loader: ownershipRouteLoader,
      errorElement: <ForbiddenRouteExample />,
    },
    {
      path: "/combined",
      element: <CombinedAuthorizationExample />,
      loader: combinedAuthorizationLoader,
      errorElement: <ForbiddenRouteExample />,
    },
    {
      path: "/hidden-controls",
      element: <HiddenControlsAreNotAuthorizationExample />,
    },
    {
      path: "/server-authorization",
      element: <ServerAuthorizationExample />,
    },
    {
      path: "/authorization-boundary",
      element: <AuthorizationBoundaryExample />,
      loader: permissionRouteLoader,
      errorElement: <ForbiddenRouteExample />,
    },
    {
      path: "/login",
      element: <LoginPage />,
    },
  ]);

  return <RouterProvider router={router} />;
};

export default AuthorizationRoutesDemo;

// ---------------------------------------------------------------------
// Summary
// Authorization determines whether an authenticated user may access a resource or route.
// Role-based authorization checks a user's role against a required role.
// Permission-based authorization checks a user's capabilities against a required permission.
// Resource ownership can authorize access by comparing the authenticated user with the resource owner.
// A loader can enforce authorization before protected route content renders.
// A `403` response represents an authenticated request that is not permitted.
// Parent routes can establish authentication while child routes apply additional authorization rules.
// Authorization rules can combine roles, permissions, and resource-specific conditions.
// Hiding navigation controls does not enforce authorization.
// Client-side authorization improves navigation and UI but is not a security boundary.
// The server or API must independently enforce authorization for protected resources and operations.
// ---------------------------------------------------------------------
