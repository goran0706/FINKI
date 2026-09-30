/**
 * Lazy Routes
 * ===========
 *
 * React Router supports route-level lazy loading through the `lazy` route property.
 * A lazy route keeps the route's matching information, such as `path` and `index`,
 * available to the router while deferring the route implementation until navigation
 * requires it. The lazy implementation can provide properties such as `Component`,
 * `loader`, `action`, and `ErrorBoundary`.
 *
 * Route-level lazy loading is different from `React.lazy`. `React.lazy` lazily loads
 * a React component and therefore requires a `Suspense` boundary, while React Router's
 * `lazy` property lazily loads route implementation properties as part of navigation.
 * Route-level lazy loading is particularly useful when a route also has a loader,
 * action, or error boundary that should be loaded together with its component.
 */

import { type FC, type ReactElement } from "react";
import type { LoaderFunctionArgs, RouteObject } from "react-router-dom";
import { createBrowserRouter, Link, Outlet, RouterProvider, useLoaderData, useNavigation } from "react-router-dom";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface LazyRouteData {
  readonly title: string;
  readonly description: string;
}

export interface LazyUserRouteData {
  readonly userId: string;
  readonly name: string;
}

export interface LazyNavigationProps {
  readonly message: string;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * Demonstrates a route component returned from a route's `lazy` function.
 *
 * The component itself is not imported into the initial route definition.
 * React Router loads the module containing the route implementation when
 * navigation reaches the route.
 */
export const BasicLazyRouteExample: FC = (): ReactElement => {
  return (
    <section>
      <h2>1. Basic lazy route</h2>
      <p>This route component is supplied by a lazily loaded route module.</p>
      <p>The route path remains available to the router before the implementation loads.</p>
    </section>
  );
};

/**
 * Demonstrates a lazy route component that also uses loader data.
 *
 * The route implementation can provide both `Component` and `loader`, allowing
 * route-specific UI and route-specific data requirements to remain in the same
 * lazily loaded module.
 */
export const LazyRouteWithLoaderExample: FC = (): ReactElement => {
  const data = useLoaderData<typeof lazyUserLoader>();

  return (
    <section>
      <h2>2. Lazy route with loader</h2>
      <p>User: {data.name}</p>
      <p>User ID: {data.userId}</p>
      <p>Both the component and loader belong to the lazy route implementation.</p>
    </section>
  );
};

/**
 * Demonstrates that route-level lazy loading can include an error boundary.
 *
 * The route's error boundary can be loaded alongside the component and loader
 * instead of being included in the initial route implementation.
 */
export const LazyRouteErrorBoundaryExample: FC = (): ReactElement => {
  return (
    <section>
      <h2>3. Lazy route error boundary</h2>
      <p>The route module can provide an error boundary together with its other route implementation properties.</p>
    </section>
  );
};

/**
 * Demonstrates a lazy route nested inside a shared layout.
 *
 * The layout can remain part of the eagerly available route tree while individual
 * child routes load their implementations only when they are needed.
 */
export const LazyChildRouteExample: FC = (): ReactElement => {
  return (
    <section>
      <h2>4. Lazy child route</h2>
      <p>This child route is loaded independently from its parent layout.</p>
    </section>
  );
};

/**
 * Demonstrates a parent layout containing lazy child routes.
 *
 * `Outlet` renders whichever child route matches the current location. The parent
 * layout does not need to know the implementation details of each lazy child.
 */
export const LazyRouteLayoutExample: FC = (): ReactElement => {
  return (
    <main>
      <h2>5. Lazy route layout</h2>
      <nav aria-label="Lazy route navigation">
        <Link to="/workspace">Workspace</Link>
        {" | "}
        <Link to="/workspace/profile">Profile</Link>
        {" | "}
        <Link to="/workspace/reports">Reports</Link>
      </nav>
      <Outlet />
    </main>
  );
};

/**
 * Demonstrates navigation state while a lazy route implementation is loading.
 *
 * The navigation state can be observed independently of the route component.
 * This allows a shared interface to communicate that navigation is in progress.
 */
export const LazyRouteNavigationStateExample: FC = (): ReactElement => {
  const navigation = useNavigation();

  return (
    <section>
      <h2>6. Lazy route navigation state</h2>
      <p>Navigation state: {navigation.state}</p>
      <p>A shared loading indicator can observe the router while a lazy route implementation is being requested.</p>
    </section>
  );
};

/**
 * Demonstrates that route-level lazy loading can load route data logic as well
 * as the route component.
 *
 * The loader is not part of the eagerly defined route object. React Router loads
 * the route implementation before executing the lazy route's loader.
 */
export const LazyRouteDataExample: FC = (): ReactElement => {
  const data = useLoaderData<typeof lazyProductLoader>();

  return (
    <section>
      <h2>7. Lazy route data</h2>
      <p>Product: {data.title}</p>
      <p>{data.description}</p>
    </section>
  );
};

/**
 * Demonstrates the distinction between `React.lazy` and React Router's
 * route-level `lazy` property.
 *
 * React Router's `lazy` can defer multiple route implementation properties,
 * whereas `React.lazy` specifically creates a lazy React component.
 */
export const ReactLazyVsRouteLazyExample: FC = (): ReactElement => {
  return (
    <section>
      <h2>8. React.lazy versus route lazy</h2>
      <p>React.lazy loads a React component and normally requires Suspense.</p>
      <p>
        React Router's route lazy loading can defer the route component, loader, action, and error boundary together.
      </p>
    </section>
  );
};

/**
 * Demonstrates that route matching information remains available before the
 * lazy route implementation is loaded.
 *
 * The router knows the route path from the eagerly defined portion of the route
 * object and therefore does not need to discover the path from the lazy module.
 */
export const LazyRouteMatchingExample: FC = (): ReactElement => {
  return (
    <section>
      <h2>9. Route matching before lazy implementation</h2>
      <p>The path is defined eagerly, while the route implementation is deferred.</p>
      <p>This allows React Router to match the destination before loading its implementation.</p>
    </section>
  );
};

/**
 * Demonstrates a route-specific loading message using router navigation state.
 *
 * This is useful for showing route transitions without placing a Suspense
 * boundary around the route component.
 */
export const LazyRouteLoadingIndicatorExample: FC<LazyNavigationProps> = ({ message }): ReactElement => {
  const navigation = useNavigation();

  return (
    <section aria-live="polite">
      <h2>10. Lazy route loading indicator</h2>
      <p>{navigation.state === "idle" ? "Navigation is idle." : message}</p>
    </section>
  );
};

/**
 * Demonstrates that lazy loading is a performance mechanism rather than a
 * security mechanism.
 *
 * Deferring a route's JavaScript does not authorize access to its resources.
 * Protected data must still be checked by the appropriate server or API.
 */
export const LazyRoutesAreNotAuthorizationExample: FC = (): ReactElement => {
  return (
    <section>
      <h2>11. Lazy routes are not authorization</h2>
      <p>
        Loading a route implementation only when it is visited does not prevent a user from requesting that route
        directly.
      </p>
      <p>Authorization must be enforced independently for protected resources.</p>
    </section>
  );
};

/**
 * Demonstrates that a lazy route can keep route-specific implementation together.
 *
 * A route module can contain the component, loader, and error boundary so that
 * the code required for that route is loaded as one logical route boundary.
 */
export const LazyRouteModuleBoundaryExample: FC = (): ReactElement => {
  return (
    <section>
      <h2>12. Lazy route module boundary</h2>
      <p>
        Route-specific implementation can be organized around the route rather than eagerly importing every
        implementation into the router.
      </p>
    </section>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const lazyUserLoader = async ({ params }: LoaderFunctionArgs): Promise<LazyUserRouteData> => {
  const userId: string = params.userId ?? "unknown";

  return {
    userId,
    name: "John Doe",
  };
};

const lazyProductLoader = async (): Promise<LazyRouteData> => {
  return {
    title: "Example product",
    description: "This data is loaded by a route implementation that is itself lazy.",
  };
};

const LazyRouteErrorBoundary: FC = (): ReactElement => {
  return (
    <section>
      <h2>Lazy route error</h2>
      <p>The lazy route implementation could not be loaded or rendered.</p>
      <Link to="/">Return home</Link>
    </section>
  );
};

const LazyRouteUser = lazyUserLoader;

const LazyWorkspaceRoute: RouteObject["lazy"] = async () => {
  return {
    Component: LazyChildRouteExample,
  };
};

const HomePage: FC = (): ReactElement => {
  return (
    <main>
      <h1>Lazy Routes</h1>
      <p>Select an example to inspect React Router's route-level lazy loading.</p>

      <nav aria-label="Lazy route examples">
        <ul>
          <li>
            <Link to="/basic">Basic lazy route</Link>
          </li>
          <li>
            <Link to="/users/user-100">Lazy route with loader</Link>
          </li>
          <li>
            <Link to="/lazy-error">Lazy route error boundary</Link>
          </li>
          <li>
            <Link to="/workspace">Lazy route layout</Link>
          </li>
          <li>
            <Link to="/navigation-state">Lazy route navigation state</Link>
          </li>
          <li>
            <Link to="/products/example">Lazy route data</Link>
          </li>
          <li>
            <Link to="/react-lazy">React.lazy versus route lazy</Link>
          </li>
          <li>
            <Link to="/matching">Lazy route matching</Link>
          </li>
          <li>
            <Link to="/loading-indicator">Lazy route loading indicator</Link>
          </li>
          <li>
            <Link to="/not-authorization">Lazy routes and authorization</Link>
          </li>
          <li>
            <Link to="/module-boundary">Lazy route module boundary</Link>
          </li>
        </ul>
      </nav>
    </main>
  );
};

const LazyRoutesDemo: FC = (): ReactElement => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <HomePage />,
    },
    {
      path: "/basic",
      lazy: async () => ({
        Component: BasicLazyRouteExample,
      }),
    },
    {
      path: "/users/:userId",
      lazy: async () => ({
        Component: LazyRouteWithLoaderExample,
        loader: LazyRouteUser,
        ErrorBoundary: LazyRouteErrorBoundary,
      }),
    },
    {
      path: "/lazy-error",
      lazy: async () => ({
        Component: LazyRouteErrorBoundaryExample,
        ErrorBoundary: LazyRouteErrorBoundary,
      }),
    },
    {
      path: "/workspace",
      Component: LazyRouteLayoutExample,
      children: [
        {
          index: true,
          lazy: LazyWorkspaceRoute,
        },
        {
          path: "profile",
          lazy: async () => ({
            Component: LazyRouteComponentExample,
          }),
        },
        {
          path: "reports",
          lazy: async () => ({
            Component: LazyRouteModuleBoundaryExample,
          }),
        },
      ],
    },
    {
      path: "/navigation-state",
      Component: LazyRouteNavigationStateExample,
    },
    {
      path: "/products/:productId",
      lazy: async () => ({
        Component: LazyRouteDataExample,
        loader: lazyProductLoader,
      }),
    },
    {
      path: "/react-lazy",
      Component: ReactLazyVsRouteLazyExample,
    },
    {
      path: "/matching",
      lazy: async () => ({
        Component: LazyRouteMatchingExample,
      }),
    },
    {
      path: "/loading-indicator",
      Component: () => <LazyRouteLoadingIndicatorExample message="Loading lazy route implementation..." />,
    },
    {
      path: "/not-authorization",
      Component: LazyRoutesAreNotAuthorizationExample,
    },
    {
      path: "/module-boundary",
      lazy: async () => ({
        Component: LazyRouteModuleBoundaryExample,
      }),
    },
  ]);

  return <RouterProvider router={router} />;
};

export default LazyRoutesDemo;

// ---------------------------------------------------------------------
// Summary
// React Router's `lazy` property defers loading of a route's implementation.
// Route paths and other matching information can remain available before the implementation loads.
// A lazy route can provide `Component`, `loader`, `action`, and error-boundary implementations.
// Route-level lazy loading can keep related route implementation code together.
// Lazy child routes can load independently inside an eagerly available layout.
// `React.lazy` and React Router's `lazy` solve related but different problems.
// React.lazy creates a lazy React component and normally works with Suspense.
// React Router's route lazy loading integrates route implementation loading with navigation.
// Navigation state can provide loading feedback while a lazy route is being loaded.
// Lazy loading improves code-loading behavior but does not provide authorization or security.
// ---------------------------------------------------------------------
