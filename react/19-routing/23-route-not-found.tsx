/**
 * Route Not Found
 * ===============
 *
 * React Router can handle unmatched URLs explicitly by defining a catch-all
 * route with the `*` path pattern. The catch-all route matches when no more
 * specific route matches the requested pathname, allowing the application to
 * render a dedicated not-found page instead of leaving the user without
 * useful navigation or feedback.
 *
 * A not-found route is different from a route that happens to render a
 * "not found" message. The former is part of the route configuration and
 * participates in route matching, while the latter is ordinary component
 * rendering based on application data.
 *
 * Route parameters can also represent resources that do not exist. In that
 * case, the URL itself can be valid and match a route, but the loader can
 * return or throw a 404 response when the requested resource cannot be found.
 * These two cases should be distinguished: one concerns an unknown URL, while
 * the other concerns a missing resource at a known URL.
 */

import { type FC, type ReactElement } from "react";
import {
  createBrowserRouter,
  isRouteErrorResponse,
  Link,
  Outlet,
  RouterProvider,
  useLoaderData,
  useRouteError,
} from "react-router-dom";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface NotFoundPageProps {
  readonly title: string;
  readonly message: string;
}

export interface ProductData {
  readonly id: string;
  readonly name: string;
}

export interface ProductNotFoundData {
  readonly requestedId: string;
  readonly message: string;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * Demonstrates a basic application-level not-found page.
 *
 * The component is rendered by a catch-all `*` route when no more specific
 * route matches the requested URL.
 */
export const BasicNotFoundExample: FC = (): ReactElement => {
  return (
    <main>
      <h1>Page not found</h1>
      <p>The requested page does not exist.</p>
      <Link to="/">Return home</Link>
    </main>
  );
};

/**
 * Demonstrates a not-found page with explicit navigation choices.
 *
 * A useful 404 page should provide a clear recovery path instead of requiring
 * the user to manually edit the URL.
 */
export const NotFoundNavigationExample: FC = (): ReactElement => {
  return (
    <main>
      <h1>Page not found</h1>
      <p>The address does not match any available route.</p>
      <nav aria-label="Not-found navigation">
        <Link to="/">Home</Link>
        {" | "}
        <Link to="/products">Products</Link>
      </nav>
    </main>
  );
};

/**
 * Demonstrates that a catch-all route matches an otherwise unmatched pathname.
 *
 * The `*` path pattern does not need to enumerate every invalid URL. It acts
 * as the final route when no more specific route can be matched.
 */
export const CatchAllRouteExample: FC = (): ReactElement => {
  return (
    <section>
      <h2>3. Catch-all route</h2>
      <p>This component is rendered because no more specific route matched.</p>
    </section>
  );
};

/**
 * Demonstrates a valid route whose resource does not exist.
 *
 * The URL matches `/products/:productId`, but the requested product can still
 * be missing. This is a resource-level 404 rather than an unknown-route 404.
 */
export const ResourceNotFoundExample: FC = (): ReactElement => {
  const product = useLoaderData<typeof productLoader>();

  return (
    <section>
      <h2>4. Resource not found</h2>
      <p>{product.message}</p>
      <Link to="/products">Return to products</Link>
    </section>
  );
};

/**
 * Demonstrates a successful resource lookup.
 *
 * The same parameterized route can render normally when the requested resource
 * exists, showing why resource existence and route matching are separate concerns.
 */
export const ExistingResourceExample: FC = (): ReactElement => {
  const product = useLoaderData<typeof productLoader>();

  return (
    <section>
      <h2>5. Existing resource</h2>
      <p>
        {product.name} ({product.id})
      </p>
      <Link to="/products">Return to products</Link>
    </section>
  );
};

/**
 * Demonstrates a route-level 404 response boundary.
 *
 * The loader throws a response with status 404 when the resource is absent,
 * and the route's `errorElement` renders the corresponding fallback.
 */
export const ResourceNotFoundBoundaryExample: FC = (): ReactElement => {
  const error: unknown = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <main>
        <h1>{error.status}</h1>
        <p>{typeof error.data === "string" ? error.data : "The requested resource was not found."}</p>
        <Link to="/products">Return to products</Link>
      </main>
    );
  }

  return (
    <main>
      <h1>Unable to load resource</h1>
      <Link to="/products">Return to products</Link>
    </main>
  );
};

/**
 * Demonstrates a nested not-found route.
 *
 * A catch-all route can be scoped beneath a parent route, allowing a section
 * of an application to provide its own fallback for unmatched child URLs.
 */
export const NestedNotFoundExample: FC = (): ReactElement => {
  return (
    <section>
      <h2>7. Nested not-found route</h2>
      <p>No child route matched within this section.</p>
      <Link to="/dashboard">Return to dashboard</Link>
    </section>
  );
};

/**
 * Demonstrates that a catch-all route should be less specific than normal routes.
 *
 * React Router attempts to match the most appropriate route, so a normal
 * concrete or parameterized route can still handle a URL before the catch-all
 * route handles unmatched paths.
 */
export const SpecificRouteBeforeCatchAllExample: FC = (): ReactElement => {
  return (
    <section>
      <h2>8. Specific route before catch-all</h2>
      <p>This content belongs to a specific route and does not use the application's catch-all fallback.</p>
    </section>
  );
};

/**
 * Demonstrates that a not-found page is not the same as redirecting.
 *
 * A 404 page describes an unmatched request, while a redirect intentionally
 * changes the requested location to another route.
 */
export const NotFoundIsNotRedirectExample: FC = (): ReactElement => {
  return (
    <section>
      <h2>9. Not found is not a redirect</h2>
      <p>The not-found route keeps the unmatched URL instead of silently navigating somewhere else.</p>
      <Link to="/">Return home</Link>
    </section>
  );
};

/**
 * Demonstrates a not-found route inside a persistent layout.
 *
 * The parent layout can remain responsible for shared navigation while the
 * unmatched child path receives section-specific fallback content.
 */
export const LayoutNotFoundExample: FC = (): ReactElement => {
  return (
    <main>
      <h2>Dashboard</h2>
      <nav aria-label="Dashboard navigation">
        <Link to="/dashboard">Overview</Link>
        {" | "}
        <Link to="/dashboard/settings">Settings</Link>
      </nav>
      <Outlet />
    </main>
  );
};

/**
 * Demonstrates a common misconception about route matching.
 *
 * A dynamic segment such as `:productId` matches many different strings, but
 * that does not mean every resulting resource exists.
 */
export const ParameterMatchDoesNotGuaranteeResourceExample: FC = (): ReactElement => {
  return (
    <section>
      <h2>11. Parameter matching does not guarantee a resource</h2>
      <p>A parameterized route can match an ID even when no corresponding resource exists.</p>
    </section>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const productLoader = async ({
  params,
}: {
  readonly params: Readonly<Record<string, string | undefined>>;
}): Promise<ProductData | ProductNotFoundData> => {
  const productId: string | undefined = params.productId;

  if (productId !== "100") {
    throw new Response(`Product ${productId ?? "unknown"} was not found.`, {
      status: 404,
      statusText: "Not Found",
    });
  }

  return {
    id: "100",
    name: "Example Monitor",
  };
};

const DashboardOverview: FC = (): ReactElement => {
  return (
    <section>
      <h3>Dashboard overview</h3>
      <p>This is a valid child route.</p>
    </section>
  );
};

const DashboardSettings: FC = (): ReactElement => {
  return (
    <section>
      <h3>Dashboard settings</h3>
      <p>These settings belong to the dashboard section.</p>
    </section>
  );
};

const HomePage: FC = (): ReactElement => {
  return (
    <main>
      <h1>Route Not Found</h1>
      <p>Select an example to inspect unknown routes and missing resources.</p>

      <nav aria-label="Route not-found examples">
        <ul>
          <li>
            <Link to="/basic-not-found">Basic not-found page</Link>
          </li>
          <li>
            <Link to="/missing-page">Not-found navigation</Link>
          </li>
          <li>
            <Link to="/products/does-not-exist">Resource not found</Link>
          </li>
          <li>
            <Link to="/products/100">Existing resource</Link>
          </li>
          <li>
            <Link to="/dashboard/unknown-section">Nested not-found route</Link>
          </li>
          <li>
            <Link to="/specific-route">Specific route</Link>
          </li>
          <li>
            <Link to="/not-found-is-not-redirect">Not found is not a redirect</Link>
          </li>
          <li>
            <Link to="/dashboard/unknown">Layout not-found route</Link>
          </li>
          <li>
            <Link to="/parameterized-route-example">Parameter matching</Link>
          </li>
        </ul>
      </nav>
    </main>
  );
};

const RouteNotFoundDemo: FC = (): ReactElement => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <HomePage />,
    },
    {
      path: "/basic-not-found",
      element: <BasicNotFoundExample />,
    },
    {
      path: "/missing-page",
      element: <NotFoundNavigationExample />,
    },
    {
      path: "/products",
      element: (
        <section>
          <h1>Products</h1>
          <p>Available example products.</p>
          <Link to="/products/100">Example Monitor</Link>
          <Outlet />
        </section>
      ),
      children: [
        {
          path: ":productId",
          element: <ExistingResourceExample />,
          loader: productLoader,
          errorElement: <ResourceNotFoundBoundaryExample />,
        },
      ],
    },
    {
      path: "/dashboard",
      element: <LayoutNotFoundExample />,
      children: [
        {
          index: true,
          element: <DashboardOverview />,
        },
        {
          path: "settings",
          element: <DashboardSettings />,
        },
        {
          path: "*",
          element: <NestedNotFoundExample />,
        },
      ],
    },
    {
      path: "/specific-route",
      element: <SpecificRouteBeforeCatchAllExample />,
    },
    {
      path: "/not-found-is-not-redirect",
      element: <NotFoundIsNotRedirectExample />,
    },
    {
      path: "/parameterized-route-example",
      element: <ParameterMatchDoesNotGuaranteeResourceExample />,
    },
    {
      path: "*",
      element: <CatchAllRouteExample />,
    },
  ]);

  return <RouterProvider router={router} />;
};

export default RouteNotFoundDemo;

// ---------------------------------------------------------------------
// Summary
// A catch-all `*` route can render application-specific UI for unmatched URLs.
// An unknown URL and a missing resource are different kinds of 404 conditions.
// A parameterized route can match a URL even when the requested resource does not exist.
// A loader can throw a 404 `Response` when a matched resource cannot be found.
// `isRouteErrorResponse` can identify and narrow router-generated error responses.
// Catch-all routes can also be scoped beneath a parent route for section-specific not-found UI.
// Specific routes can continue to handle valid URLs while a catch-all handles unmatched paths.
// A not-found page describes an unmatched request and does not inherently redirect the user.
// ---------------------------------------------------------------------
