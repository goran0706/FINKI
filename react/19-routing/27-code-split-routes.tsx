/**
 * Code-Split Routes
 * =================
 *
 * Code splitting divides an application's JavaScript into separate chunks that can be
 * loaded independently. Route-based code splitting is especially useful because users
 * generally need only the code for the routes they actually visit.
 *
 * React.lazy creates a lazy component whose module is loaded when React first attempts
 * to render it. Suspense provides the fallback UI while that module is loading. With
 * React Router, lazy route modules can also be declared directly on route definitions,
 * allowing route components and route-specific exports to be loaded together.
 *
 * Code splitting affects when JavaScript is downloaded and evaluated; it does not
 * automatically make a route secure or prevent its source code from being inspected.
 */

import { type FC, lazy, type ReactElement, type ReactNode, Suspense } from "react";
import { createBrowserRouter, Link, Outlet, RouterProvider } from "react-router-dom";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface RouteLoadingFallbackProps {
  readonly message: string;
}

export interface LazyRouteExampleProps {
  readonly title: string;
  readonly description: string;
}

export interface RouteLayoutProps {
  readonly children?: ReactNode;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * Demonstrates a reusable Suspense fallback for a lazily loaded route.
 *
 * The fallback is rendered only while the lazy component's module is being
 * loaded. Once loading completes, Suspense renders the resolved component.
 */
export const RouteLoadingFallbackExample: FC<RouteLoadingFallbackProps> = ({ message }): ReactElement => {
  return (
    <div role="status" aria-live="polite">
      {message}
    </div>
  );
};

/**
 * Demonstrates a route component that can be loaded lazily.
 *
 * `lazy()` receives a function that dynamically imports the module only when
 * React needs to render the lazy component.
 */
export const LazyRouteComponentExample: FC<LazyRouteExampleProps> = ({ title, description }): ReactElement => {
  return (
    <section>
      <h2>{title}</h2>
      <p>{description}</p>
      <p>This component can be placed in a separate JavaScript chunk.</p>
    </section>
  );
};

/**
 * Demonstrates a Suspense boundary around a lazy route component.
 *
 * The boundary defines what the user sees while the route component's module
 * is being downloaded and evaluated.
 */
export const SuspenseRouteBoundaryExample: FC = (): ReactElement => {
  return (
    <Suspense fallback={<RouteLoadingFallbackExample message="Loading route..." />}>
      <LazyRouteComponentExample
        title="Suspense boundary"
        description="The fallback remains visible while the lazy component is loading."
      />
    </Suspense>
  );
};

/**
 * Demonstrates route navigation to a lazily loaded route.
 *
 * The navigation itself remains ordinary React Router navigation. Code
 * splitting changes when the destination route's JavaScript is loaded.
 */
export const LazyRouteNavigationExample: FC = (): ReactElement => {
  return (
    <section>
      <h2>4. Navigation to a lazy route</h2>
      <p>The destination route can load its JavaScript only when it is visited.</p>
      <Link to="/reports">Open reports</Link>
    </section>
  );
};

/**
 * Demonstrates that a lazy route can remain inside a shared layout.
 *
 * Shared layout code can remain available while route-specific content is
 * loaded independently.
 */
export const SharedLayoutWithLazyRouteExample: FC = (): ReactElement => {
  return (
    <section>
      <h2>5. Shared layout with lazy route content</h2>
      <p>The surrounding layout can remain mounted while the destination route loads its own code.</p>
      <Outlet />
    </section>
  );
};

/**
 * Demonstrates a route component with substantial route-specific content.
 *
 * In a real application, a route like a reporting dashboard may contain
 * dependencies that are not needed by the application's initial screen.
 */
export const ReportsRouteExample: FC = (): ReactElement => {
  return (
    <section>
      <h2>Reports</h2>
      <p>This route represents code that can be isolated from the initial bundle.</p>
      <p>Its module can be downloaded when the reports route is requested.</p>
    </section>
  );
};

/**
 * Demonstrates that lazy loading is independent from authorization.
 *
 * Splitting a route into a separate chunk does not restrict access to the
 * route or protect its data. Authorization must still be enforced separately.
 */
export const CodeSplittingIsNotAuthorizationExample: FC = (): ReactElement => {
  return (
    <section>
      <h2>7. Code splitting is not authorization</h2>
      <p>A lazy route may still be downloaded by a user who can discover its URL.</p>
      <p>Protected resources must still enforce authorization independently.</p>
    </section>
  );
};

/**
 * Demonstrates that a lazy component is not the same as a dynamically changing
 * route definition.
 *
 * The route remains part of the application's routing configuration while its
 * component implementation is loaded on demand.
 */
export const LazyComponentVsDynamicRouteExample: FC = (): ReactElement => {
  return (
    <section>
      <h2>8. Lazy component versus dynamic route</h2>
      <p>Code splitting changes how route code is loaded; it does not dynamically create arbitrary routes.</p>
    </section>
  );
};

/**
 * Demonstrates a route that can contain multiple independently loaded sections.
 *
 * Splitting should follow meaningful application boundaries rather than
 * creating a separate chunk for every small component.
 */
export const RouteChunkBoundaryExample: FC = (): ReactElement => {
  return (
    <section>
      <h2>9. Route chunk boundary</h2>
      <p>A route is often a useful boundary for isolating code that is needed only for that part of the application.</p>
    </section>
  );
};

/**
 * Demonstrates a loading fallback that is scoped to one part of the UI.
 *
 * A Suspense boundary can be placed around a route-specific region instead
 * of replacing the entire application while a chunk is loading.
 */
export const ScopedSuspenseBoundaryExample: FC = (): ReactElement => {
  return (
    <section>
      <h2>10. Scoped Suspense boundary</h2>
      <p>The surrounding interface can remain rendered while the lazy region displays its loading fallback.</p>
    </section>
  );
};

/**
 * Demonstrates the distinction between initial loading and later route loading.
 *
 * A route chunk may be unnecessary during the initial render and downloaded
 * only after the user navigates to that route.
 */
export const InitialBundleVsRouteChunkExample: FC = (): ReactElement => {
  return (
    <section>
      <h2>11. Initial bundle versus route chunk</h2>
      <p>Route-based splitting can move route-specific JavaScript out of the initial JavaScript payload.</p>
      <p>The browser can request that chunk later when navigation requires it.</p>
    </section>
  );
};

/**
 * Demonstrates a simple route-level lazy loading pattern.
 *
 * This pattern uses `React.lazy` and `Suspense` explicitly, making the
 * relationship between dynamic import, lazy rendering, and fallback UI visible.
 */
export const ExplicitLazyLoadingExample: FC = (): ReactElement => {
  return (
    <section>
      <h2>12. Explicit lazy loading</h2>
      <Suspense fallback={<RouteLoadingFallbackExample message="Loading settings..." />}>
        <LazyRouteComponentExample
          title="Settings"
          description="This component is represented as a separately loaded route module."
        />
      </Suspense>
    </section>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const ReportsRoute = lazy(async () => ({
  default: ReportsRouteExample,
}));

const LazyReportsLayout: FC = (): ReactElement => {
  return (
    <main>
      <h1>Code-Split Reports</h1>
      <nav aria-label="Reports navigation">
        <Link to="/reports">Reports</Link>
        {" | "}
        <Link to="/">Home</Link>
      </nav>
      <Suspense fallback={<RouteLoadingFallbackExample message="Loading reports..." />}>
        <Outlet />
      </Suspense>
    </main>
  );
};

const HomePage: FC = (): ReactElement => {
  return (
    <main>
      <h1>Code-Split Routes</h1>
      <p>Select an example to inspect route-based JavaScript loading.</p>

      <nav aria-label="Code splitting examples">
        <ul>
          <li>
            <Link to="/navigation">Lazy route navigation</Link>
          </li>
          <li>
            <Link to="/reports">Reports</Link>
          </li>
          <li>
            <Link to="/authorization">Code splitting and authorization</Link>
          </li>
          <li>
            <Link to="/dynamic-route">Lazy component versus dynamic route</Link>
          </li>
          <li>
            <Link to="/chunk-boundary">Route chunk boundary</Link>
          </li>
          <li>
            <Link to="/scoped-suspense">Scoped Suspense boundary</Link>
          </li>
          <li>
            <Link to="/initial-bundle">Initial bundle versus route chunk</Link>
          </li>
          <li>
            <Link to="/explicit-lazy">Explicit lazy loading</Link>
          </li>
        </ul>
      </nav>
    </main>
  );
};

const CodeSplitRoutesDemo: FC = (): ReactElement => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <HomePage />,
    },
    {
      path: "/navigation",
      element: (
        <main>
          <LazyRouteNavigationExample />
        </main>
      ),
    },
    {
      path: "/reports",
      element: <LazyReportsLayout />,
      children: [
        {
          index: true,
          element: <ReportsRoute />,
        },
      ],
    },
    {
      path: "/authorization",
      element: <CodeSplittingIsNotAuthorizationExample />,
    },
    {
      path: "/dynamic-route",
      element: <LazyComponentVsDynamicRouteExample />,
    },
    {
      path: "/chunk-boundary",
      element: <RouteChunkBoundaryExample />,
    },
    {
      path: "/scoped-suspense",
      element: <ScopedSuspenseBoundaryExample />,
    },
    {
      path: "/initial-bundle",
      element: <InitialBundleVsRouteChunkExample />,
    },
    {
      path: "/explicit-lazy",
      element: <ExplicitLazyLoadingExample />,
    },
  ]);

  return <RouterProvider router={router} />;
};

export default CodeSplitRoutesDemo;

// ---------------------------------------------------------------------
// Summary
// Code splitting separates JavaScript into independently loaded chunks.
// Route-based splitting loads route-specific code when that route is needed.
// `React.lazy` uses a dynamic import to defer loading a component module.
// `Suspense` provides fallback UI while a lazy component is loading.
// A shared layout can remain mounted while route-specific code loads.
// Route chunks can reduce the amount of JavaScript required by the initial render.
// A route chunk is not a security boundary and does not replace authorization.
// Code splitting does not dynamically create arbitrary application routes.
// Suspense boundaries can be scoped to prevent unrelated UI from being replaced.
// Route splitting should follow meaningful application boundaries rather than arbitrary component boundaries.
// ---------------------------------------------------------------------
