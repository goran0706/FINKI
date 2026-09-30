/**
 * Route Error Handling
 * ====================
 *
 * React Router data routers provide route-level error handling through the
 * `errorElement` route property and the `useRouteError` hook. When a loader,
 * action, or route element throws an error, the router can render the nearest
 * configured error boundary instead of allowing the error to escape the route
 * tree.
 *
 * `useRouteError` returns the error associated with the route currently being
 * rendered by an error boundary. `isRouteErrorResponse` can distinguish a
 * router-generated `Response` error, such as one created with a status code,
 * from an ordinary JavaScript error.
 *
 * Error boundaries are hierarchical. An error can be handled by the nearest
 * ancestor route that defines an `errorElement`, allowing different parts of
 * an application to provide different recovery or diagnostic UI.
 */

import { type FC, type ReactElement } from "react";
import {
  createBrowserRouter,
  isRouteErrorResponse,
  Link,
  Outlet,
  RouterProvider,
  useRouteError,
} from "react-router-dom";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface RouteErrorDisplayProps {
  readonly title: string;
  readonly message: string;
}

export interface ErrorRecoveryProps {
  readonly destination: string;
  readonly label: string;
}

export interface ProductData {
  readonly id: string;
  readonly name: string;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * Demonstrates a basic route error boundary.
 *
 * The component reads the error associated with the route through
 * `useRouteError` and renders a stable fallback UI instead of assuming
 * that the thrown value is an ordinary `Error`.
 */
export const BasicRouteErrorBoundary: FC = (): ReactElement => {
  const error: unknown = useRouteError();

  return (
    <main>
      <h2>Something went wrong</h2>
      <p>The current route could not be rendered.</p>
      {error instanceof Error && <p>{error.message}</p>}
      <Link to="/">Return home</Link>
    </main>
  );
};

/**
 * Demonstrates handling a router-generated error response.
 *
 * `isRouteErrorResponse` narrows the error to a route error response so that
 * properties such as `status`, `statusText`, and `data` can be accessed safely.
 */
export const RouteErrorResponseBoundary: FC = (): ReactElement => {
  const error: unknown = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <main>
        <h2>
          {error.status} {error.statusText}
        </h2>
        <p>{typeof error.data === "string" ? error.data : "The route returned an error response."}</p>
        <Link to="/">Return home</Link>
      </main>
    );
  }

  return <BasicRouteErrorBoundary />;
};

/**
 * Demonstrates handling a normal JavaScript error.
 *
 * A loader or route element can throw an `Error`, and the route error boundary
 * can use `instanceof Error` to safely access the error message.
 */
export const JavaScriptErrorBoundary: FC = (): ReactElement => {
  const error: unknown = useRouteError();

  return (
    <main>
      <h2>Application error</h2>
      {error instanceof Error ? <p>{error.message}</p> : <p>An unknown error occurred.</p>}
      <Link to="/">Return home</Link>
    </main>
  );
};

/**
 * Demonstrates an error thrown by a loader.
 *
 * The loader fails before the route component receives loader data, so the
 * route's `errorElement` renders instead of the normal route element.
 */
export const LoaderErrorExample: FC = (): ReactElement => {
  return (
    <section>
      <h2>4. Loader error</h2>
      <p>This content is not rendered when the loader throws.</p>
    </section>
  );
};

/**
 * Demonstrates a route-specific recovery UI.
 *
 * An error boundary can provide navigation back to a known route instead of
 * requiring every error to display the same global fallback.
 */
export const RouteSpecificRecoveryExample: FC = (): ReactElement => {
  const error: unknown = useRouteError();

  return (
    <main>
      <h2>Product could not be loaded</h2>
      {isRouteErrorResponse(error) && <p>Request failed with status {error.status}.</p>}
      <Link to="/products">Return to products</Link>
    </main>
  );
};

/**
 * Demonstrates nested error boundaries.
 *
 * The parent route provides a fallback for errors that are not handled by a
 * more specific child route boundary.
 */
export const ParentRouteErrorBoundary: FC = (): ReactElement => {
  const error: unknown = useRouteError();

  return (
    <main>
      <h2>Dashboard error</h2>
      <p>An error occurred somewhere in the dashboard route tree.</p>
      {error instanceof Error && <p>{error.message}</p>}
      <Link to="/">Return home</Link>
    </main>
  );
};

/**
 * Demonstrates a child route with its own error boundary.
 *
 * Because this route defines its own `errorElement`, an error thrown by its
 * loader is handled here rather than by the parent route boundary.
 */
export const ChildRouteErrorBoundary: FC = (): ReactElement => {
  const error: unknown = useRouteError();

  return (
    <main>
      <h2>Dashboard section error</h2>
      <p>This child route could not load its data.</p>
      {error instanceof Error && <p>{error.message}</p>}
      <Link to="/dashboard">Return to dashboard</Link>
    </main>
  );
};

/**
 * Demonstrates a successful route next to an error-producing route.
 *
 * Route-level boundaries isolate failures so that a failing route does not
 * require unrelated routes to render the same fallback.
 */
export const ErrorIsolationExample: FC = (): ReactElement => {
  return (
    <section>
      <h2>8. Error isolation</h2>
      <p>The dashboard shell can remain available while an individual child route handles its own error.</p>
      <nav aria-label="Dashboard sections">
        <Link to="/dashboard/overview">Overview</Link>
        {" | "}
        <Link to="/dashboard/failing-section">Failing section</Link>
      </nav>
      <Outlet />
    </section>
  );
};

/**
 * Demonstrates a fallback for an unknown route.
 *
 * A catch-all route can provide application-specific not-found UI instead of
 * allowing unmatched URLs to produce an empty application state.
 */
export const NotFoundRouteExample: FC = (): ReactElement => {
  return (
    <main>
      <h2>Page not found</h2>
      <p>The requested route does not exist.</p>
      <Link to="/">Return home</Link>
    </main>
  );
};

/**
 * Demonstrates that route error boundaries are not ordinary React error
 * boundaries.
 *
 * React Router error boundaries handle errors raised during route rendering,
 * loaders, and actions through the router's route hierarchy.
 */
export const RouteBoundaryScopeExample: FC = (): ReactElement => {
  return (
    <section>
      <h2>10. Route boundary scope</h2>
      <p>
        Route error boundaries are part of the router's error handling system and receive errors through
        `useRouteError`.
      </p>
    </section>
  );
};

/**
 * Demonstrates a route that successfully returns data.
 *
 * This provides the successful counterpart to a route whose loader throws.
 */
export const SuccessfulLoaderExample: FC = (): ReactElement => {
  const product: ProductData = {
    id: "100",
    name: "Example Monitor",
  };

  return (
    <section>
      <h2>11. Successful route</h2>
      <p>
        {product.name} ({product.id})
      </p>
      <p>This route renders normally because no route error was thrown.</p>
    </section>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const failingLoader = async (): Promise<never> => {
  throw new Error("The product service is temporarily unavailable.");
};

const responseErrorLoader = async (): Promise<never> => {
  throw new Response("The requested product was not found.", {
    status: 404,
    statusText: "Not Found",
  });
};

const childFailingLoader = async (): Promise<never> => {
  throw new Error("The dashboard section could not be loaded.");
};

const HomePage: FC = (): ReactElement => {
  return (
    <main>
      <h1>Route Error Handling</h1>
      <p>Select an example to inspect React Router's route-level error handling.</p>

      <nav aria-label="Route error handling examples">
        <ul>
          <li>
            <Link to="/basic-error">Basic route error boundary</Link>
          </li>
          <li>
            <Link to="/response-error">Route error response</Link>
          </li>
          <li>
            <Link to="/javascript-error">JavaScript error</Link>
          </li>
          <li>
            <Link to="/loader-error">Loader error</Link>
          </li>
          <li>
            <Link to="/products/999">Route-specific recovery</Link>
          </li>
          <li>
            <Link to="/dashboard">Nested error boundaries</Link>
          </li>
          <li>
            <Link to="/dashboard/failing-section">Child route error</Link>
          </li>
          <li>
            <Link to="/dashboard/overview">Error isolation</Link>
          </li>
          <li>
            <Link to="/missing-page">Not-found route</Link>
          </li>
          <li>
            <Link to="/boundary-scope">Route boundary scope</Link>
          </li>
          <li>
            <Link to="/successful">Successful route</Link>
          </li>
        </ul>
      </nav>
    </main>
  );
};

const DashboardLayout: FC = (): ReactElement => {
  return (
    <main>
      <h2>Dashboard</h2>
      <p>This layout remains the parent of its nested routes.</p>
      <nav aria-label="Dashboard navigation">
        <Link to="/dashboard/overview">Overview</Link>
        {" | "}
        <Link to="/dashboard/failing-section">Failing section</Link>
      </nav>
      <Outlet />
    </main>
  );
};

const DashboardOverview: FC = (): ReactElement => {
  return (
    <section>
      <h3>Dashboard overview</h3>
      <p>This route loads successfully.</p>
    </section>
  );
};

const DashboardErrorIsolationLayout: FC = (): ReactElement => {
  return (
    <main>
      <h2>Dashboard error isolation</h2>
      <p>The parent layout remains available while individual children can handle their own errors.</p>
      <nav aria-label="Dashboard error isolation">
        <Link to="/dashboard/overview">Overview</Link>
        {" | "}
        <Link to="/dashboard/failing-section">Failing section</Link>
      </nav>
      <Outlet />
    </main>
  );
};

const RouteErrorHandlingDemo: FC = (): ReactElement => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <HomePage />,
      errorElement: <BasicRouteErrorBoundary />,
    },
    {
      path: "/basic-error",
      element: <LoaderErrorExample />,
      loader: failingLoader,
      errorElement: <BasicRouteErrorBoundary />,
    },
    {
      path: "/response-error",
      element: <LoaderErrorExample />,
      loader: responseErrorLoader,
      errorElement: <RouteErrorResponseBoundary />,
    },
    {
      path: "/javascript-error",
      element: <LoaderErrorExample />,
      loader: failingLoader,
      errorElement: <JavaScriptErrorBoundary />,
    },
    {
      path: "/loader-error",
      element: <LoaderErrorExample />,
      loader: failingLoader,
      errorElement: <BasicRouteErrorBoundary />,
    },
    {
      path: "/products/:productId",
      element: <LoaderErrorExample />,
      loader: responseErrorLoader,
      errorElement: <RouteSpecificRecoveryExample />,
    },
    {
      path: "/dashboard",
      element: <DashboardLayout />,
      errorElement: <ParentRouteErrorBoundary />,
      children: [
        {
          index: true,
          element: <DashboardOverview />,
        },
        {
          path: "overview",
          element: <DashboardOverview />,
        },
        {
          path: "failing-section",
          element: <LoaderErrorExample />,
          loader: childFailingLoader,
          errorElement: <ChildRouteErrorBoundary />,
        },
      ],
    },
    {
      path: "/dashboard-isolation",
      element: <DashboardErrorIsolationLayout />,
      errorElement: <ParentRouteErrorBoundary />,
      children: [
        {
          index: true,
          element: <ErrorIsolationExample />,
        },
        {
          path: "overview",
          element: <DashboardOverview />,
        },
        {
          path: "failing-section",
          element: <LoaderErrorExample />,
          loader: childFailingLoader,
          errorElement: <ChildRouteErrorBoundary />,
        },
      ],
    },
    {
      path: "/missing-page",
      element: <NotFoundRouteExample />,
    },
    {
      path: "/boundary-scope",
      element: <RouteBoundaryScopeExample />,
    },
    {
      path: "/successful",
      element: <SuccessfulLoaderExample />,
    },
    {
      path: "*",
      element: <NotFoundRouteExample />,
    },
  ]);

  return <RouterProvider router={router} />;
};

export default RouteErrorHandlingDemo;

// ---------------------------------------------------------------------
// Summary
// React Router uses `errorElement` to define route-level error UI.
// `useRouteError` reads the error associated with the current route boundary.
// `isRouteErrorResponse` narrows router-generated response errors.
// Loaders and actions can throw errors that are handled by route error boundaries.
// Error boundaries are hierarchical and the nearest matching boundary can handle a route error.
// A child route can define its own error boundary instead of relying on its parent.
// Route errors can be represented by ordinary JavaScript errors or router response errors.
// A catch-all route can provide explicit UI for URLs that do not match application routes.
// Route error boundaries are part of React Router's routing system rather than ordinary component state.
// ---------------------------------------------------------------------
