/**
 * Route Loaders
 * =============
 *
 * A route loader is a function associated with a React Router data route that
 * provides data before the route element renders. Loaders receive information
 * about the current navigation, including route parameters and the request URL,
 * and their returned value becomes the route's loader data.
 *
 * Loaders are executed by React Router during navigation and initial route
 * loading. A loader can return synchronous data or a promise, allowing route
 * components to consume asynchronous data through `useLoaderData` without
 * manually coordinating the initial request in a component effect.
 *
 * Loaders are route-level data dependencies. They are especially useful when
 * the data required to render a page is determined by the matched URL, such as
 * a resource identified by a route parameter or query string.
 */

import { type FC, type ReactElement } from "react";
import type { LoaderFunctionArgs } from "react-router-dom";
import { createBrowserRouter, Link, Outlet, RouterProvider, useLoaderData } from "react-router-dom";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface ProductLoaderData {
  readonly id: string;
  readonly name: string;
  readonly price: number;
}

export interface UserLoaderData {
  readonly id: string;
  readonly name: string;
  readonly email: string;
}

export interface SearchLoaderData {
  readonly query: string;
  readonly results: readonly string[];
}

export interface DashboardLoaderData {
  readonly title: string;
  readonly username: string;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * Demonstrates the basic purpose of a route loader.
 *
 * The loader returns data for the route, and the route component reads that
 * data with `useLoaderData`.
 */
export const BasicRouteLoaderExample: FC = (): ReactElement => {
  const product = useLoaderData<typeof productLoader>();

  return (
    <section>
      <h2>1. Basic route loader</h2>
      <p>Product: {product.name}</p>
      <p>Price: ${product.price.toFixed(2)}</p>
    </section>
  );
};

/**
 * Demonstrates a loader that receives route parameters.
 *
 * The loader reads `productId` from the matched URL and uses it to determine
 * which product data to return.
 */
export const ParameterRouteLoaderExample: FC = (): ReactElement => {
  const product = useLoaderData<typeof parameterProductLoader>();

  return (
    <section>
      <h2>2. Loader route parameters</h2>
      <p>Product ID: {product.id}</p>
      <p>Product: {product.name}</p>
    </section>
  );
};

/**
 * Demonstrates reading the request URL inside a loader.
 *
 * The loader can inspect `request.url` to access the current URL, including
 * its query string.
 */
export const RequestUrlLoaderExample: FC = (): ReactElement => {
  const search = useLoaderData<typeof searchLoader>();

  return (
    <section>
      <h2>3. Loader request URL</h2>
      <p>Search query: {search.query || "(empty)"}</p>
      <ul>
        {search.results.map((result: string) => (
          <li key={result}>{result}</li>
        ))}
      </ul>
    </section>
  );
};

/**
 * Demonstrates an asynchronous route loader.
 *
 * Returning a promise allows the router to resolve asynchronous data before
 * the route element consumes it.
 */
export const AsyncRouteLoaderExample: FC = (): ReactElement => {
  const user = useLoaderData<typeof userLoader>();

  return (
    <section>
      <h2>4. Asynchronous route loader</h2>
      <p>User: {user.name}</p>
      <p>Email: {user.email}</p>
    </section>
  );
};

/**
 * Demonstrates a loader shared by a parent route.
 *
 * Parent route loader data is available to the parent route element and can
 * also be consumed by components rendered within that matched route branch.
 */
export const ParentLoaderExample: FC = (): ReactElement => {
  const dashboard = useLoaderData<typeof dashboardLoader>();

  return (
    <div>
      <h2>5. Parent route loader</h2>
      <p>{dashboard.title}</p>
      <p>Signed in as {dashboard.username}</p>
      <Outlet />
    </div>
  );
};

/**
 * Demonstrates that loader data follows route navigation.
 *
 * Navigating between URLs handled by the same parameterized route causes the
 * loader to run for the new route match and provide the corresponding data.
 */
export const LoaderNavigationExample: FC = (): ReactElement => {
  const product = useLoaderData<typeof parameterProductLoader>();

  return (
    <section>
      <h2>6. Loader data and navigation</h2>
      <p>Current product: {product.name}</p>
      <nav aria-label="Product navigation">
        <Link to="/products/100">Product 100</Link>
        {" | "}
        <Link to="/products/200">Product 200</Link>
      </nav>
    </section>
  );
};

/**
 * Demonstrates that loader functions can return ordinary serializable data.
 *
 * A loader does not need to perform a network request. It can return data from
 * any synchronous or asynchronous source available to the application.
 */
export const LoaderWithoutNetworkRequestExample: FC = (): ReactElement => {
  const product = useLoaderData<typeof localProductLoader>();

  return (
    <section>
      <h2>7. Loader without a network request</h2>
      <p>Product: {product.name}</p>
      <p>This data was produced by the loader without an HTTP request.</p>
    </section>
  );
};

/**
 * Demonstrates a common misconception about loaders.
 *
 * A loader is not a React component and does not use component hooks. It is a
 * route-level function executed by the router.
 */
export const LoaderIsNotComponentExample: FC = (): ReactElement => {
  const user = useLoaderData<typeof userLoader>();

  return (
    <section>
      <h2>8. Loader is not a component</h2>
      <p>Loaded user: {user.name}</p>
      <p>The loader provides data; the route component renders that data.</p>
    </section>
  );
};

/**
 * Demonstrates the distinction between loader data and a component effect.
 *
 * Route-critical data can be declared as a dependency of the route itself
 * instead of initiating the initial request from a component effect.
 */
export const LoaderVsEffectExample: FC = (): ReactElement => {
  const user = useLoaderData<typeof userLoader>();

  return (
    <section>
      <h2>9. Loader versus component effect</h2>
      <p>User: {user.name}</p>
      <p>The route declares this data dependency through its loader.</p>
    </section>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const productLoader = async (): Promise<ProductLoaderData> => {
  return {
    id: "100",
    name: "Example Laptop",
    price: 999,
  };
};

const parameterProductLoader = async ({ params }: LoaderFunctionArgs): Promise<ProductLoaderData> => {
  const productId = params.productId ?? "unknown";

  if (productId === "200") {
    return {
      id: "200",
      name: "Example Monitor",
      price: 399,
    };
  }

  return {
    id: productId,
    name: "Example Laptop",
    price: 999,
  };
};

const searchLoader = async ({ request }: LoaderFunctionArgs): Promise<SearchLoaderData> => {
  const url = new URL(request.url);
  const query = url.searchParams.get("q") ?? "";

  const results: readonly string[] = query ? [`Result for "${query}"`, `Another result for "${query}"`] : [];

  return {
    query,
    results,
  };
};

const userLoader = async (): Promise<UserLoaderData> => {
  await Promise.resolve();

  return {
    id: "100",
    name: "John Doe",
    email: "john.doe@example.com",
  };
};

const dashboardLoader = async (): Promise<DashboardLoaderData> => {
  return {
    title: "Dashboard",
    username: "John Doe",
  };
};

const localProductLoader = (): ProductLoaderData => {
  return {
    id: "300",
    name: "Example Keyboard",
    price: 79,
  };
};

const DashboardHomePage: FC = (): ReactElement => {
  return (
    <section>
      <h3>Dashboard home</h3>
      <p>This child route is rendered beneath the parent route loader.</p>
    </section>
  );
};

const HomePage: FC = (): ReactElement => {
  return (
    <main>
      <h1>Route Loaders</h1>
      <p>Select an example to inspect how route loaders provide data to matched routes.</p>

      <nav aria-label="Route loader examples">
        <ul>
          <li>
            <Link to="/basic-loader">Basic loader</Link>
          </li>
          <li>
            <Link to="/products/100">Parameter loader</Link>
          </li>
          <li>
            <Link to="/search?q=react">Request URL loader</Link>
          </li>
          <li>
            <Link to="/async-loader">Asynchronous loader</Link>
          </li>
          <li>
            <Link to="/dashboard">Parent loader</Link>
          </li>
          <li>
            <Link to="/products/100/navigation">Loader navigation</Link>
          </li>
          <li>
            <Link to="/local-loader">Loader without network request</Link>
          </li>
          <li>
            <Link to="/loader-component">Loader is not a component</Link>
          </li>
          <li>
            <Link to="/loader-effect">Loader versus effect</Link>
          </li>
        </ul>
      </nav>
    </main>
  );
};

const RouteLoadersDemo: FC = (): ReactElement => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <HomePage />,
    },
    {
      path: "/basic-loader",
      element: <BasicRouteLoaderExample />,
      loader: productLoader,
    },
    {
      path: "/products/:productId",
      element: <ParameterRouteLoaderExample />,
      loader: parameterProductLoader,
    },
    {
      path: "/products/:productId/navigation",
      element: <LoaderNavigationExample />,
      loader: parameterProductLoader,
    },
    {
      path: "/search",
      element: <RequestUrlLoaderExample />,
      loader: searchLoader,
    },
    {
      path: "/async-loader",
      element: <AsyncRouteLoaderExample />,
      loader: userLoader,
    },
    {
      id: "dashboard",
      path: "/dashboard",
      element: <ParentLoaderExample />,
      loader: dashboardLoader,
      children: [
        {
          index: true,
          element: <DashboardHomePage />,
        },
      ],
    },
    {
      path: "/local-loader",
      element: <LoaderWithoutNetworkRequestExample />,
      loader: localProductLoader,
    },
    {
      path: "/loader-component",
      element: <LoaderIsNotComponentExample />,
      loader: userLoader,
    },
    {
      path: "/loader-effect",
      element: <LoaderVsEffectExample />,
      loader: userLoader,
    },
  ]);

  return <RouterProvider router={router} />;
};

export default RouteLoadersDemo;

// ---------------------------------------------------------------------
// Summary
// A route loader is a route-level function that provides data for a matched route.
// Loaders can return synchronous values or promises for asynchronous data.
// `LoaderFunctionArgs` provides access to route parameters and the current request.
// Route parameters can determine which data a loader returns.
// `request.url` allows a loader to inspect the current URL and query parameters.
// `useLoaderData` reads the data returned by the current route's loader.
// Parent route loaders can provide data for routes in the same matched branch.
// Loaders do not need to perform network requests; they can read from other data sources.
// A loader is a router function, not a React component, and does not use React hooks.
// Route loaders can declare route-critical data dependencies outside component effects.
// ---------------------------------------------------------------------
