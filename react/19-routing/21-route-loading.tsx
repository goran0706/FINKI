/**
 * Route Loading
 * =============
 *
 * React Router provides navigation and data-loading state through its data router APIs.
 * The `useNavigation` hook exposes the current navigation state, allowing components
 * to render pending UI while a navigation, loader, or action is being processed.
 *
 * A navigation can be in the `"idle"`, `"submitting"`, or `"loading"` state. The
 * `"loading"` state is used while a navigation is loading route data, while
 * `"submitting"` represents a form submission before the resulting navigation or
 * revalidation completes.
 *
 * Route loading UI is different from component-level loading state. React Router
 * manages the state of route transitions and data APIs, so pending indicators can
 * respond to navigation activity without manually coordinating `useState` with
 * every route change.
 */

import { type FC, type ReactElement } from "react";
import type { LoaderFunctionArgs } from "react-router-dom";
import { createBrowserRouter, Link, Outlet, RouterProvider, useLoaderData, useNavigation } from "react-router-dom";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface ProductRouteData {
  readonly id: string;
  readonly name: string;
  readonly description: string;
}

export interface DashboardRouteData {
  readonly title: string;
  readonly username: string;
}

export interface LoadingNavigationProps {
  readonly label: string;
  readonly destination: string;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * Demonstrates the basic `useNavigation` state.
 *
 * The navigation state is `"idle"` when no navigation is in progress and
 * becomes `"loading"` when a navigation is loading the next route's data.
 */
export const NavigationLoadingStateExample: FC = (): ReactElement => {
  const navigation = useNavigation();

  return (
    <section>
      <h2>1. Navigation loading state</h2>
      <p>Current navigation state: {navigation.state}</p>
      {navigation.state === "loading" && <p aria-live="polite">Loading the next route...</p>}
    </section>
  );
};

/**
 * Demonstrates a global pending indicator.
 *
 * A layout component can observe the router's navigation state and display
 * pending UI while any descendant route is being loaded.
 */
export const GlobalLoadingIndicatorExample: FC = (): ReactElement => {
  const navigation = useNavigation();
  const isLoading: boolean = navigation.state === "loading";

  return (
    <header aria-live="polite">
      <p>Global status: {isLoading ? "Loading..." : "Ready"}</p>
    </header>
  );
};

/**
 * Demonstrates disabling navigation-related controls while a route is loading.
 *
 * `useNavigation` provides the state needed to prevent repeated interactions
 * while the router is already transitioning to another location.
 */
export const LoadingNavigationControlExample: FC = (): ReactElement => {
  const navigation = useNavigation();
  const isLoading: boolean = navigation.state === "loading";

  return (
    <nav aria-label="Loading navigation controls">
      <Link
        aria-disabled={isLoading}
        onClick={(event) => {
          if (isLoading) {
            event.preventDefault();
          }
        }}
        to="/products/100"
      >
        {isLoading ? "Loading product..." : "Open product"}
      </Link>
    </nav>
  );
};

/**
 * Demonstrates route-level loading UI around an outlet.
 *
 * The layout remains mounted while the child route changes, so navigation
 * state can be displayed without replacing the surrounding application shell.
 */
export const RouteLoadingLayoutExample: FC = (): ReactElement => {
  const navigation = useNavigation();
  const isLoading: boolean = navigation.state === "loading";

  return (
    <div>
      <GlobalLoadingIndicatorExample />
      <nav aria-label="Product navigation">
        <Link to="/products/100">Product 100</Link>
        {" | "}
        <Link to="/products/200">Product 200</Link>
      </nav>
      {isLoading && <p aria-live="polite">Loading route content...</p>}
      <Outlet />
    </div>
  );
};

/**
 * Demonstrates that route loading state is connected to route data loading.
 *
 * The loader intentionally waits before returning its data so that the pending
 * navigation state remains observable during the transition.
 */
export const LoaderLoadingExample: FC = (): ReactElement => {
  const product = useLoaderData<typeof productLoader>();

  return (
    <section>
      <h2>5. Loading route data</h2>
      <h3>{product.name}</h3>
      <p>{product.description}</p>
      <p>Product ID: {product.id}</p>
    </section>
  );
};

/**
 * Demonstrates reading the current navigation destination.
 *
 * During a loading navigation, `navigation.location` describes the location
 * being navigated to. It is undefined while the router is idle.
 */
export const LoadingDestinationExample: FC = (): ReactElement => {
  const navigation = useNavigation();
  const destination: string | undefined = navigation.location?.pathname;

  return (
    <section>
      <h2>6. Loading destination</h2>
      <p>Destination: {destination ?? "No pending destination"}</p>
    </section>
  );
};

/**
 * Demonstrates a navigation loading indicator that does not replace content.
 *
 * A pending indicator can be rendered alongside the existing route content,
 * allowing the previous screen to remain visible until the next route is ready.
 */
export const NonBlockingLoadingExample: FC = (): ReactElement => {
  const navigation = useNavigation();
  const isLoading: boolean = navigation.state === "loading";

  return (
    <section>
      <h2>7. Non-blocking loading UI</h2>
      {isLoading && <p aria-live="polite">Updating route content...</p>}
      <p>Existing route content remains rendered while the next route loads.</p>
    </section>
  );
};

/**
 * Demonstrates the distinction between idle and loading states.
 *
 * A component should not treat every render as a pending state. The router
 * returns to `"idle"` after the navigation and its associated data loading
 * have completed.
 */
export const IdleAfterLoadingExample: FC = (): ReactElement => {
  const navigation = useNavigation();
  const status: string = navigation.state === "idle" ? "Navigation complete" : "Navigation in progress";

  return (
    <section>
      <h2>8. Returning to idle</h2>
      <p>{status}</p>
    </section>
  );
};

/**
 * Demonstrates a common misconception about route loading.
 *
 * Route loading state comes from the router's navigation state. A component
 * should not assume that local `useState` is required to track every route
 * transition when the router already exposes this state.
 */
export const RouterOwnsRouteLoadingStateExample: FC = (): ReactElement => {
  const navigation = useNavigation();

  return (
    <section>
      <h2>9. Router-owned loading state</h2>
      <p>React Router state: {navigation.state}</p>
      <p>The router tracks route transition state independently of local component state.</p>
    </section>
  );
};

/**
 * Demonstrates loading state inside a nested route layout.
 *
 * The parent layout can remain mounted while the child route is replaced,
 * making the navigation state useful for persistent application shells.
 */
export const NestedRouteLoadingExample: FC = (): ReactElement => {
  const navigation = useNavigation();

  return (
    <section>
      <h2>10. Nested route loading</h2>
      <p>Nested navigation: {navigation.state}</p>
      <Outlet />
    </section>
  );
};

/**
 * Demonstrates route loading as a transient state rather than route data.
 *
 * The actual product remains available through `useLoaderData`; navigation
 * state only describes the current transition.
 */
export const LoadingStateVsRouteDataExample: FC = (): ReactElement => {
  const navigation = useNavigation();
  const product = useLoaderData<typeof productLoader>();

  return (
    <section>
      <h2>11. Loading state vs route data</h2>
      <p>Product: {product.name}</p>
      <p>Navigation: {navigation.state}</p>
    </section>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const delay = async (milliseconds: number): Promise<void> => {
  await new Promise<void>((resolve) => {
    window.setTimeout(resolve, milliseconds);
  });
};

const productLoader = async ({ params }: LoaderFunctionArgs): Promise<ProductRouteData> => {
  const productId: string = params.productId ?? "unknown";

  await delay(900);

  return {
    id: productId,
    name: productId === "200" ? "Example Keyboard" : "Example Monitor",
    description:
      productId === "200"
        ? "A compact keyboard for an example product catalog."
        : "A high-resolution monitor for an example product catalog.",
  };
};

const dashboardLoader = async (): Promise<DashboardRouteData> => {
  await delay(700);

  return {
    title: "Dashboard",
    username: "John Doe",
  };
};

const ProductNavigationPage: FC = (): ReactElement => {
  const navigation = useNavigation();

  return (
    <section>
      <h3>Product navigation</h3>
      <p>Navigation state: {navigation.state}</p>
      <p>Select a product to trigger route loading.</p>
    </section>
  );
};

const DashboardPage: FC = (): ReactElement => {
  const dashboard = useLoaderData<typeof dashboardLoader>();

  return (
    <section>
      <h3>{dashboard.title}</h3>
      <p>Welcome, {dashboard.username}.</p>
      <Outlet />
    </section>
  );
};

const DashboardChildPage: FC = (): ReactElement => {
  return (
    <div>
      <p>This child route is rendered after its parent route loads.</p>
    </div>
  );
};

const HomePage: FC = (): ReactElement => {
  return (
    <main>
      <h1>Route Loading</h1>
      <p>Select an example to observe React Router navigation and loading state.</p>

      <nav aria-label="Route loading examples">
        <ul>
          <li>
            <Link to="/loading-state">Navigation loading state</Link>
          </li>
          <li>
            <Link to="/global-loading">Global loading indicator</Link>
          </li>
          <li>
            <Link to="/loading-controls">Loading navigation controls</Link>
          </li>
          <li>
            <Link to="/products">Route loading layout</Link>
          </li>
          <li>
            <Link to="/products/100">Loader loading</Link>
          </li>
          <li>
            <Link to="/loading-destination">Loading destination</Link>
          </li>
          <li>
            <Link to="/non-blocking-loading">Non-blocking loading</Link>
          </li>
          <li>
            <Link to="/idle-after-loading">Idle after loading</Link>
          </li>
          <li>
            <Link to="/router-owned-loading">Router-owned loading state</Link>
          </li>
          <li>
            <Link to="/nested-loading">Nested route loading</Link>
          </li>
          <li>
            <Link to="/loading-vs-data">Loading state vs route data</Link>
          </li>
          <li>
            <Link to="/dashboard">Dashboard loading</Link>
          </li>
        </ul>
      </nav>
    </main>
  );
};

const RouteLoadingDemo: FC = (): ReactElement => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <HomePage />,
    },
    {
      path: "/loading-state",
      element: <NavigationLoadingStateExample />,
    },
    {
      path: "/global-loading",
      element: <GlobalLoadingIndicatorExample />,
    },
    {
      path: "/loading-controls",
      element: <LoadingNavigationControlExample />,
    },
    {
      path: "/products",
      element: <RouteLoadingLayoutExample />,
      children: [
        {
          index: true,
          element: <ProductNavigationPage />,
        },
        {
          path: ":productId",
          element: <LoaderLoadingExample />,
          loader: productLoader,
        },
      ],
    },
    {
      path: "/loading-destination",
      element: <LoadingDestinationExample />,
    },
    {
      path: "/non-blocking-loading",
      element: <NonBlockingLoadingExample />,
    },
    {
      path: "/idle-after-loading",
      element: <IdleAfterLoadingExample />,
    },
    {
      path: "/router-owned-loading",
      element: <RouterOwnsRouteLoadingStateExample />,
    },
    {
      path: "/nested-loading",
      element: <NestedRouteLoadingExample />,
      children: [
        {
          index: true,
          element: <p>Nested route is ready.</p>,
        },
        {
          path: "details",
          element: <p>Nested details are ready.</p>,
        },
      ],
    },
    {
      path: "/loading-vs-data",
      element: <LoadingStateVsRouteDataExample />,
      loader: productLoader,
    },
    {
      path: "/dashboard",
      element: <DashboardPage />,
      loader: dashboardLoader,
      children: [
        {
          index: true,
          element: <DashboardChildPage />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
};

export default RouteLoadingDemo;

// ---------------------------------------------------------------------
// Summary
// `useNavigation` exposes the router's current navigation state.
// `"idle"` means that no navigation or submission is currently pending.
// `"loading"` indicates that the router is loading the next route or its data.
// A parent layout can use navigation state to display global pending UI.
// `navigation.location` identifies the destination being loaded when available.
// Route loading state is managed by React Router rather than requiring local state for every transition.
// Pending UI can remain visible alongside existing content instead of replacing the current route.
// Loader data and navigation state represent different concepts: one is route data, the other is transition state.
// Nested route layouts can observe loading state while their surrounding UI remains mounted.
// ---------------------------------------------------------------------
