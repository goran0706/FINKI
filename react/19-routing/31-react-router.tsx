/**
 * React Router
 * ============
 *
 * React Router is a routing library for React applications that maps URL
 * locations to React UI and provides navigation, route parameters, nested
 * layouts, data loading, form actions, redirects, error boundaries, and
 * navigation state.
 *
 * A route configuration describes the relationship between URL patterns and
 * route implementations. Data routers can associate loaders and actions with
 * those routes so that navigation and data mutations are coordinated by the
 * router rather than implemented as unrelated component effects.
 *
 * React Router also supports nested routes through `Outlet`, dynamic segments
 * through route parameters, query-string state through `useSearchParams`, and
 * programmatic navigation through `useNavigate`. The URL remains the source
 * of truth for addressable navigation state.
 */

import { type FC, type ReactElement } from "react";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router-dom";
import {
  createBrowserRouter,
  Form,
  Link,
  NavLink,
  Outlet,
  redirect,
  RouterProvider,
  useLoaderData,
  useLocation,
  useNavigate,
  useNavigation,
  useParams,
  useSearchParams,
} from "react-router-dom";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface RouterOverviewData {
  readonly title: string;
  readonly description: string;
}

export interface UserRouteData {
  readonly id: string;
  readonly name: string;
}

export interface SearchRouteData {
  readonly query: string;
  readonly category: string;
}

export interface FormActionData {
  readonly message: string;
  readonly name: string;
}

export interface NavigationStatusProps {
  readonly message: string;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * Demonstrates a basic route component.
 *
 * A route connects a URL pattern to the React element that should render
 * when that pattern matches the current location.
 */
export const BasicRouteExample: FC = (): ReactElement => {
  return (
    <section>
      <h2>1. Basic route</h2>
      <p>This component is rendered by a route associated with a URL path.</p>
    </section>
  );
};

/**
 * Demonstrates declarative navigation with `Link`.
 *
 * `Link` performs client-side navigation instead of requiring a full document
 * request for every internal route transition.
 */
export const DeclarativeNavigationExample: FC = (): ReactElement => {
  return (
    <section>
      <h2>2. Declarative navigation</h2>
      <p>Links describe destinations directly in the rendered interface.</p>
      <Link to="/router/user/user-100">Open user</Link>
    </section>
  );
};

/**
 * Demonstrates active navigation with `NavLink`.
 *
 * `NavLink` exposes whether its destination matches the current location,
 * making it useful for navigation elements that need active styling or state.
 */
export const ActiveNavigationExample: FC = (): ReactElement => {
  return (
    <section>
      <h2>3. Active navigation</h2>
      <nav aria-label="Active navigation example">
        <NavLink to="/router">Home</NavLink>
        {" | "}
        <NavLink to="/router/user/user-100">User</NavLink>
      </nav>
    </section>
  );
};

/**
 * Demonstrates dynamic route parameters.
 *
 * A parameterized route can match different URLs while exposing the matched
 * value through `useParams`.
 */
export const DynamicRouteExample: FC = (): ReactElement => {
  const { userId } = useParams<"userId">();

  return (
    <section>
      <h2>4. Dynamic route parameter</h2>
      <p>User ID: {userId ?? "No user ID was provided."}</p>
    </section>
  );
};

/**
 * Demonstrates route loader data.
 *
 * A data router can execute a loader before rendering the route and expose
 * its resolved result through `useLoaderData`.
 */
export const LoaderDataExample: FC = (): ReactElement => {
  const data = useLoaderData<typeof userLoader>();

  return (
    <section>
      <h2>5. Route loader data</h2>
      <p>User: {data.name}</p>
      <p>ID: {data.id}</p>
    </section>
  );
};

/**
 * Demonstrates nested routes through `Outlet`.
 *
 * The parent route remains rendered while the matching child route is inserted
 * into the parent's outlet.
 */
export const NestedRouteLayoutExample: FC = (): ReactElement => {
  return (
    <section>
      <h2>6. Nested routes</h2>
      <nav aria-label="Nested route navigation">
        <Link to="/router/workspace">Overview</Link>
        {" | "}
        <Link to="/router/workspace/settings">Settings</Link>
      </nav>
      <Outlet />
    </section>
  );
};

/**
 * Demonstrates query parameters as URL state.
 *
 * `useSearchParams` reads and updates query-string values without requiring
 * manual parsing of the complete URL.
 */
export const QueryParameterExample: FC = (): ReactElement => {
  const [searchParams, setSearchParams] = useSearchParams();

  const query: string = searchParams.get("q") ?? "";
  const category: string = searchParams.get("category") ?? "all";

  const selectCategory = (nextCategory: string): void => {
    const nextSearchParams = new URLSearchParams(searchParams);
    nextSearchParams.set("category", nextCategory);
    setSearchParams(nextSearchParams);
  };

  return (
    <section>
      <h2>7. Query parameters</h2>
      <p>Search: {query || "none"}</p>
      <p>Category: {category}</p>
      <button type="button" onClick={() => selectCategory("books")}>
        Select books
      </button>
    </section>
  );
};

/**
 * Demonstrates programmatic navigation.
 *
 * `useNavigate` is useful when navigation is a consequence of an event or
 * application operation rather than a rendered link.
 */
export const ProgrammaticNavigationExample: FC = (): ReactElement => {
  const navigate = useNavigate();

  const handleNavigate = (): void => {
    navigate("/router/workspace");
  };

  return (
    <section>
      <h2>8. Programmatic navigation</h2>
      <button type="button" onClick={handleNavigate}>
        Open workspace
      </button>
    </section>
  );
};

/**
 * Demonstrates form actions.
 *
 * A data-router action can process a submitted `Form` and return or redirect
 * without requiring the component to manually coordinate the request lifecycle.
 */
export const RouteActionExample: FC = (): ReactElement => {
  return (
    <section>
      <h2>9. Route action</h2>
      <Form method="post">
        <label>
          Name <input name="name" defaultValue="John Doe" />
        </label>{" "}
        <button type="submit">Save</button>
      </Form>
    </section>
  );
};

/**
 * Demonstrates navigation state.
 *
 * `useNavigation` exposes the router's current navigation state, which can be
 * used for pending UI during navigations and form submissions.
 */
export const NavigationStateExample: FC<NavigationStatusProps> = ({ message }): ReactElement => {
  const navigation = useNavigation();

  return (
    <section aria-live="polite">
      <h2>10. Navigation state</h2>
      <p>State: {navigation.state}</p>
      <p>{navigation.state === "idle" ? "Ready." : message}</p>
    </section>
  );
};

/**
 * Demonstrates access to the current location.
 *
 * `useLocation` exposes the current pathname, search string, hash, and
 * navigation state associated with the current location.
 */
export const LocationExample: FC = (): ReactElement => {
  const location = useLocation();

  return (
    <section>
      <h2>11. Current location</h2>
      <p>Pathname: {location.pathname}</p>
      <p>Search: {location.search || "No query string."}</p>
      <p>Hash: {location.hash || "No hash."}</p>
    </section>
  );
};

/**
 * Demonstrates redirects from a data-router loader.
 *
 * Redirects can be performed before a route renders, allowing route-level
 * navigation decisions to remain inside the route configuration.
 */
export const RedirectRouteExample: FC = (): ReactElement => {
  return (
    <section>
      <h2>12. Route redirect</h2>
      <p>This route is redirected by its loader before this component renders.</p>
    </section>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const userLoader = async ({ params }: LoaderFunctionArgs): Promise<UserRouteData> => {
  const userId: string = params.userId ?? "unknown";

  return {
    id: userId,
    name: "John Doe",
  };
};

const searchLoader = async ({ request }: LoaderFunctionArgs): Promise<SearchRouteData> => {
  const url: URL = new URL(request.url);

  return {
    query: url.searchParams.get("q") ?? "",
    category: url.searchParams.get("category") ?? "all",
  };
};

const saveAction = async ({ request }: ActionFunctionArgs): Promise<FormActionData> => {
  const formData: FormData = await request.formData();
  const nameValue: FormDataEntryValue | null = formData.get("name");
  const name: string = typeof nameValue === "string" ? nameValue : "John Doe";

  return {
    message: "The form was processed by the route action.",
    name,
  };
};

const redirectLoader = async (): Promise<Response> => {
  return redirect("/router/workspace");
};

const ActionResultPage: FC = (): ReactElement => {
  return (
    <section>
      <h2>Saved</h2>
      <p>The route action completed the form submission.</p>
      <Link to="/router">Return home</Link>
    </section>
  );
};

const WorkspaceOverview: FC = (): ReactElement => {
  return (
    <section>
      <h3>Workspace overview</h3>
      <p>The parent workspace route remains rendered around this child route.</p>
    </section>
  );
};

const WorkspaceSettings: FC = (): ReactElement => {
  return (
    <section>
      <h3>Workspace settings</h3>
      <p>This is a nested child route rendered through the parent outlet.</p>
    </section>
  );
};

const RedirectDestination: FC = (): ReactElement => {
  return (
    <section>
      <h2>Redirect destination</h2>
      <p>The loader redirected navigation to this route.</p>
    </section>
  );
};

const HomePage: FC = (): ReactElement => {
  return (
    <main>
      <h1>React Router</h1>
      <p>Select an example to inspect the main routing APIs and concepts.</p>

      <nav aria-label="React Router examples">
        <ul>
          <li>
            <Link to="/router/basic">Basic route</Link>
          </li>
          <li>
            <Link to="/router/navigation">Declarative navigation</Link>
          </li>
          <li>
            <Link to="/router/active">Active navigation</Link>
          </li>
          <li>
            <Link to="/router/user/user-100">Dynamic route parameter</Link>
          </li>
          <li>
            <Link to="/router/user/user-100/data">Route loader data</Link>
          </li>
          <li>
            <Link to="/router/workspace">Nested routes</Link>
          </li>
          <li>
            <Link to="/router/search?q=headphones&category=electronics">Query parameters</Link>
          </li>
          <li>
            <Link to="/router/programmatic">Programmatic navigation</Link>
          </li>
          <li>
            <Link to="/router/action">Route action</Link>
          </li>
          <li>
            <Link to="/router/navigation-state">Navigation state</Link>
          </li>
          <li>
            <Link to="/router/location">Current location</Link>
          </li>
          <li>
            <Link to="/router/redirect">Route redirect</Link>
          </li>
        </ul>
      </nav>
    </main>
  );
};

const ReactRouterDemo: FC = (): ReactElement => {
  const router = createBrowserRouter([
    {
      path: "/router",
      element: <HomePage />,
    },
    {
      path: "/router/basic",
      element: <BasicRouteExample />,
    },
    {
      path: "/router/navigation",
      element: <DeclarativeNavigationExample />,
    },
    {
      path: "/router/active",
      element: <ActiveNavigationExample />,
    },
    {
      path: "/router/user/:userId",
      element: <DynamicRouteExample />,
    },
    {
      path: "/router/user/:userId/data",
      element: <LoaderDataExample />,
      loader: userLoader,
    },
    {
      path: "/router/workspace",
      element: <NestedRouteLayoutExample />,
      children: [
        {
          index: true,
          element: <WorkspaceOverview />,
        },
        {
          path: "settings",
          element: <WorkspaceSettings />,
        },
      ],
    },
    {
      path: "/router/search",
      element: <QueryParameterExample />,
      loader: searchLoader,
    },
    {
      path: "/router/programmatic",
      element: <ProgrammaticNavigationExample />,
    },
    {
      path: "/router/action",
      element: <RouteActionExample />,
      action: saveAction,
    },
    {
      path: "/router/action/success",
      element: <ActionResultPage />,
    },
    {
      path: "/router/navigation-state",
      element: <NavigationStateExample message="A navigation or form submission is in progress." />,
    },
    {
      path: "/router/location",
      element: <LocationExample />,
    },
    {
      path: "/router/redirect",
      element: <RedirectRouteExample />,
      loader: redirectLoader,
    },
    {
      path: "/router/redirect-destination",
      element: <RedirectDestination />,
    },
  ]);

  return <RouterProvider router={router} />;
};

export default ReactRouterDemo;

// ---------------------------------------------------------------------
// Summary
// React Router maps URL locations to React route implementations.
// `createBrowserRouter` creates a data-router configuration for the application.
// Routes connect URL patterns to components and can also define loaders and actions.
// `Link` provides declarative client-side navigation.
// `NavLink` provides navigation state for active destinations.
// Dynamic segments expose URL values through `useParams`.
// `useSearchParams` reads and updates query-string URL state.
// `useNavigate` performs programmatic navigation.
// Nested routes render child content through `Outlet`.
// Loaders provide route data before the route renders.
// Actions process route-associated form submissions.
// `useNavigation` exposes the router's current navigation state.
// `useLocation` exposes the current location object.
// Data-router redirects can change the destination before the route renders.
// URL state is addressable and should be preferred for state that must be shareable or restorable.
// ---------------------------------------------------------------------
