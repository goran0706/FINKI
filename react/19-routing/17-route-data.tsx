/**
 * Route Data
 * ==========
 *
 * React Router can associate data with a route so that the matched route component
 * receives data as part of the routing process. In data routers, route objects can
 * define a `loader` that supplies data before the route component renders, and the
 * component can access that data with `useLoaderData`.
 *
 * Route data belongs to the route match rather than ordinary component state. This
 * makes it useful for data that is determined by the current URL and route hierarchy,
 * such as records identified by route parameters or data shared by nested routes.
 *
 * A route can also expose its loader data to components associated with other matched
 * routes through `useRouteLoaderData` when the relevant route has an explicit route ID.
 */

import { type FC, type ReactElement } from "react";
import { createBrowserRouter, Link, Outlet, RouterProvider, useLoaderData, useRouteLoaderData } from "react-router-dom";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface UserRouteData {
  readonly id: string;
  readonly name: string;
  readonly email: string;
}

export interface DashboardRouteData {
  readonly title: string;
  readonly username: string;
}

export interface RouteDataNavigationProps {
  readonly label: string;
  readonly destination: string;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * Demonstrates route data accessed with `useLoaderData`.
 *
 * The route's loader supplies the data, and the matched component reads that
 * data through the route-data hook.
 */
export const UseLoaderDataExample: FC = (): ReactElement => {
  const user = useLoaderData<typeof userLoader>();

  return (
    <section>
      <h2>1. Reading data with useLoaderData</h2>
      <p>Name: {user.name}</p>
      <p>Email: {user.email}</p>
    </section>
  );
};

/**
 * Demonstrates route data derived from route parameters.
 *
 * The loader receives the matched route parameters and can use them to determine
 * which record should be returned to the route component.
 */
export const ParameterBasedRouteDataExample: FC = (): ReactElement => {
  const user = useLoaderData<typeof parameterUserLoader>();

  return (
    <section>
      <h2>2. Route data derived from parameters</h2>
      <p>User ID: {user.id}</p>
      <p>Name: {user.name}</p>
    </section>
  );
};

/**
 * Demonstrates route data shared with a nested route.
 *
 * The parent route owns the loader data while the child route renders through
 * the parent's outlet.
 */
export const ParentRouteDataExample: FC = (): ReactElement => {
  const dashboard = useLoaderData<typeof dashboardLoader>();

  return (
    <div>
      <h2>3. Parent route data</h2>
      <p>{dashboard.title}</p>
      <p>Signed in as {dashboard.username}</p>
      <Outlet />
    </div>
  );
};

/**
 * Demonstrates reading data from a specific matched parent route.
 *
 * `useRouteLoaderData` reads loader data belonging to a route identified by
 * its explicit route ID.
 */
export const UseRouteLoaderDataExample: FC = (): ReactElement => {
  const dashboard = useRouteLoaderData<DashboardRouteData>("dashboard");

  return (
    <section>
      <h2>4. Reading another matched route's data</h2>
      <p>{dashboard?.title}</p>
      <p>User: {dashboard?.username}</p>
    </section>
  );
};

/**
 * Demonstrates that route data is available when the route component renders.
 *
 * The component does not need a separate effect to request the initial route
 * data because the data router resolves the loader before rendering the route.
 */
export const RouteDataBeforeRenderExample: FC = (): ReactElement => {
  const user = useLoaderData<typeof userLoader>();

  return (
    <section>
      <h2>5. Route data before rendering</h2>
      <p>Loaded user: {user.name}</p>
      <p>The component receives its route data during route rendering.</p>
    </section>
  );
};

/**
 * Demonstrates that route data is associated with the current route match.
 *
 * Navigating between parameterized routes changes the matched route and therefore
 * changes the route data supplied by that route's loader.
 */
export const RouteDataFollowsRouteMatchExample: FC = (): ReactElement => {
  const user = useLoaderData<typeof parameterUserLoader>();

  return (
    <section>
      <h2>6. Route data follows the route match</h2>
      <p>Current user: {user.name}</p>
      <nav aria-label="User route navigation">
        <Link to="/users/100">User 100</Link>
        {" | "}
        <Link to="/users/200">User 200</Link>
      </nav>
    </section>
  );
};

/**
 * Demonstrates that route data is different from local component state.
 *
 * The displayed user comes from the route's data rather than from a state
 * variable owned by the component.
 */
export const RouteDataVsLocalStateExample: FC = (): ReactElement => {
  const user = useLoaderData<typeof userLoader>();

  return (
    <section>
      <h2>7. Route data versus local component state</h2>
      <p>Route data: {user.name}</p>
      <p>The value is supplied by the matched route rather than local component state.</p>
    </section>
  );
};

/**
 * Demonstrates a common misconception about route data.
 *
 * Route data is not automatically global application state. It belongs to the
 * route match and is accessed through the router's route-data APIs.
 */
export const RouteDataIsNotGlobalStateExample: FC = (): ReactElement => {
  const user = useLoaderData<typeof userLoader>();

  return (
    <section>
      <h2>8. Route data is not global state</h2>
      <p>Current route data belongs to this matched route.</p>
      <p>User: {user.name}</p>
    </section>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const userLoader = async (): Promise<UserRouteData> => {
  return {
    id: "100",
    name: "John Doe",
    email: "john.doe@example.com",
  };
};

const parameterUserLoader = async ({
  params,
}: {
  readonly params: Readonly<Record<string, string | undefined>>;
}): Promise<UserRouteData> => {
  const userId = params.userId ?? "unknown";

  return {
    id: userId,
    name: userId === "200" ? "Jane Doe" : "John Doe",
    email: userId === "200" ? "jane.doe@example.com" : "john.doe@example.com",
  };
};

const dashboardLoader = async (): Promise<DashboardRouteData> => {
  return {
    title: "Dashboard",
    username: "John Doe",
  };
};

const HomePage: FC = (): ReactElement => {
  return (
    <main>
      <h1>Route Data</h1>
      <p>Select an example to inspect how data is associated with matched routes.</p>

      <nav aria-label="Route data examples">
        <ul>
          <li>
            <Link to="/loader-data">Read route data with useLoaderData</Link>
          </li>
          <li>
            <Link to="/users/100">Use route parameters as data input</Link>
          </li>
          <li>
            <Link to="/dashboard">Read parent route data</Link>
          </li>
          <li>
            <Link to="/dashboard/shared">Read parent data with useRouteLoaderData</Link>
          </li>
          <li>
            <Link to="/before-render">Route data before rendering</Link>
          </li>
          <li>
            <Link to="/users/100">Route data follows the route match</Link>
          </li>
          <li>
            <Link to="/state-comparison">Route data versus local state</Link>
          </li>
          <li>
            <Link to="/not-global">Route data is not global state</Link>
          </li>
        </ul>
      </nav>
    </main>
  );
};

const DashboardChildPage: FC = (): ReactElement => {
  const dashboard = useRouteLoaderData<DashboardRouteData>("dashboard");

  return (
    <section>
      <h3>Nested dashboard content</h3>
      <p>Parent title: {dashboard?.title}</p>
      <p>Parent user: {dashboard?.username}</p>
    </section>
  );
};

const RouteDataDemo: FC = (): ReactElement => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <HomePage />,
    },
    {
      path: "/loader-data",
      element: <UseLoaderDataExample />,
      loader: userLoader,
    },
    {
      path: "/users/:userId",
      element: <ParameterBasedRouteDataExample />,
      loader: parameterUserLoader,
    },
    {
      path: "/users/:userId/navigation",
      element: <RouteDataFollowsRouteMatchExample />,
      loader: parameterUserLoader,
    },
    {
      id: "dashboard",
      path: "/dashboard",
      element: <ParentRouteDataExample />,
      loader: dashboardLoader,
      children: [
        {
          path: "shared",
          element: <UseRouteLoaderDataExample />,
        },
        {
          index: true,
          element: <DashboardChildPage />,
        },
      ],
    },
    {
      path: "/before-render",
      element: <RouteDataBeforeRenderExample />,
      loader: userLoader,
    },
    {
      path: "/state-comparison",
      element: <RouteDataVsLocalStateExample />,
      loader: userLoader,
    },
    {
      path: "/not-global",
      element: <RouteDataIsNotGlobalStateExample />,
      loader: userLoader,
    },
  ]);

  return <RouterProvider router={router} />;
};

export default RouteDataDemo;

// ---------------------------------------------------------------------
// Summary
// Route data is data associated with a matched route.
// Data routers can provide route data through route loaders.
// `useLoaderData` reads data returned by the current route's loader.
// Route loaders can use route parameters to determine which data to return.
// Parent route data can be shared with nested routes.
// `useRouteLoaderData` reads loader data from a specific matched route ID.
// Route data belongs to the route match rather than automatically becoming global state.
// Route data and local component state solve different data-management problems.
// ---------------------------------------------------------------------
