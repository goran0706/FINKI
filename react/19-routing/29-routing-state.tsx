/**
 * Routing State
 * =============
 *
 * Routing state is information associated with navigation rather than with the
 * route's pathname itself. React Router supports navigation state through `Link`,
 * `NavLink`, and programmatic navigation with `navigate`. The destination can
 * read that state through `useLocation`.
 *
 * Navigation state is useful for transient information such as where navigation
 * originated, whether a dialog should be opened after navigation, or which UI
 * context initiated a transition. It is stored with the browser history entry,
 * so it should not be treated as a replacement for URL state, persistent client
 * state, or server-side data.
 */

import { type FC, type ReactElement } from "react";
import { createBrowserRouter, Link, Outlet, RouterProvider, useLocation, useNavigate } from "react-router-dom";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface NavigationState {
  readonly from?: string;
  readonly message?: string;
  readonly source?: "link" | "button" | "list";
}

export interface RoutingStateDisplayProps {
  readonly title: string;
  readonly description: string;
}

export interface ProductNavigationState {
  readonly source: "product-list";
  readonly productId: string;
}

export interface ModalNavigationState {
  readonly source: "products";
  readonly openDetails: boolean;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * Demonstrates navigation state passed through a Link.
 *
 * The `state` property is attached to the resulting history entry without
 * changing the destination pathname or query string.
 */
export const LinkNavigationStateExample: FC = (): ReactElement => {
  return (
    <section>
      <h2>1. Link navigation state</h2>
      <p>The link passes transient state together with the navigation.</p>
      <Link
        to="/destination"
        state={
          {
            from: "/",
            message: "Navigation started from the home page.",
            source: "link",
          } satisfies NavigationState
        }
      >
        Open destination
      </Link>
    </section>
  );
};

/**
 * Demonstrates reading navigation state with `useLocation`.
 *
 * `location.state` contains the state associated with the current history entry.
 */
export const ReadNavigationStateExample: FC = (): ReactElement => {
  const location = useLocation();
  const state: NavigationState | null = location.state;

  return (
    <section>
      <h2>2. Read navigation state</h2>
      <p>Pathname: {location.pathname}</p>
      <p>Message: {state?.message ?? "No navigation state was provided."}</p>
      <p>Source: {state?.source ?? "unknown"}</p>
    </section>
  );
};

/**
 * Demonstrates programmatic navigation state.
 *
 * `navigate` accepts a `state` option in the same way that `Link` accepts a
 * `state` prop.
 */
export const ProgrammaticNavigationStateExample: FC = (): ReactElement => {
  const navigate = useNavigate();

  const handleNavigate = (): void => {
    navigate("/destination", {
      state: {
        from: "/programmatic",
        message: "Navigation started programmatically.",
        source: "button",
      } satisfies NavigationState,
    });
  };

  return (
    <section>
      <h2>3. Programmatic navigation state</h2>
      <p>Navigation state can accompany a call to `navigate`.</p>
      <button type="button" onClick={handleNavigate}>
        Navigate with state
      </button>
    </section>
  );
};

/**
 * Demonstrates using navigation state to preserve the origin of navigation.
 *
 * This can be useful when the destination needs to display context about
 * where the user came from without encoding that context into the URL.
 */
export const NavigationOriginExample: FC = (): ReactElement => {
  const location = useLocation();
  const state: NavigationState | null = location.state;

  return (
    <section>
      <h2>4. Navigation origin</h2>
      <p>Current route: {location.pathname}</p>
      <p>Navigation origin: {state?.from ?? "No origin was supplied."}</p>
    </section>
  );
};

/**
 * Demonstrates that navigation state does not change the URL.
 *
 * The pathname and query string remain separate from `location.state`.
 */
export const NavigationStateIsNotUrlStateExample: FC = (): ReactElement => {
  const location = useLocation();

  return (
    <section>
      <h2>5. Navigation state versus URL state</h2>
      <p>
        URL: {location.pathname}
        {location.search}
      </p>
      <p>The navigation state is associated with the history entry rather than represented in the visible URL.</p>
    </section>
  );
};

/**
 * Demonstrates passing structured state when navigating from a list.
 *
 * Typed state can carry transient context such as the item that initiated
 * navigation.
 */
export const StructuredNavigationStateExample: FC = (): ReactElement => {
  const productState: ProductNavigationState = {
    source: "product-list",
    productId: "product-100",
  };

  return (
    <section>
      <h2>6. Structured navigation state</h2>
      <Link to="/product/product-100" state={productState}>
        Open product
      </Link>
    </section>
  );
};

/**
 * Demonstrates reading structured navigation state.
 *
 * Runtime validation may still be appropriate when state originates outside
 * the component's controlled navigation flow.
 */
export const StructuredStateConsumerExample: FC = (): ReactElement => {
  const location = useLocation();
  const state: unknown = location.state;

  const isProductNavigationState = (value: unknown): value is ProductNavigationState => {
    if (typeof value !== "object" || value === null) {
      return false;
    }

    const candidate: Record<string, unknown> = value;

    return candidate.source === "product-list" && typeof candidate.productId === "string";
  };

  return (
    <section>
      <h2>7. Structured state consumer</h2>
      {isProductNavigationState(state) ? (
        <p>Product: {state.productId}</p>
      ) : (
        <p>No valid product navigation state was provided.</p>
      )}
    </section>
  );
};

/**
 * Demonstrates navigation state used for transient UI behavior.
 *
 * A destination can use state to decide whether a transient interface element,
 * such as a details dialog, should initially be displayed.
 */
export const TransientUiNavigationStateExample: FC = (): ReactElement => {
  const location = useLocation();
  const state: unknown = location.state;

  const isModalNavigationState = (value: unknown): value is ModalNavigationState => {
    if (typeof value !== "object" || value === null) {
      return false;
    }

    const candidate: Record<string, unknown> = value;

    return candidate.source === "products" && typeof candidate.openDetails === "boolean";
  };

  const shouldOpenDetails: boolean = isModalNavigationState(state) ? state.openDetails : false;

  return (
    <section>
      <h2>8. Transient UI state</h2>
      <p>Details dialog requested: {shouldOpenDetails ? "yes" : "no"}</p>
      <p>This state is navigation context, not persistent application state.</p>
    </section>
  );
};

/**
 * Demonstrates that navigation state is associated with a history entry.
 *
 * Moving between history entries can restore the state that was associated
 * with the corresponding entry.
 */
export const HistoryEntryStateExample: FC = (): ReactElement => {
  const location = useLocation();
  const state: NavigationState | null = location.state;

  return (
    <section>
      <h2>9. History entry state</h2>
      <p>Current pathname: {location.pathname}</p>
      <p>Associated message: {state?.message ?? "No state for this entry."}</p>
      <p>Browser history navigation can restore the state associated with a corresponding history entry.</p>
    </section>
  );
};

/**
 * Demonstrates the difference between navigation state and persistent state.
 *
 * Navigation state is intended for transient navigation context. Information
 * that must survive independently of a particular history entry should use
 * an appropriate persistent storage or application-state mechanism.
 */
export const NavigationStatePersistenceExample: FC = (): ReactElement => {
  return (
    <section>
      <h2>10. Navigation state persistence</h2>
      <p>Navigation state belongs to a history entry and should be treated as transient navigation context.</p>
      <p>It is not a substitute for a database, server state, or persistent application state.</p>
    </section>
  );
};

/**
 * Demonstrates a common misconception about navigation state.
 *
 * The destination must tolerate missing state because users can enter a route
 * directly without following the navigation path that normally supplies it.
 */
export const MissingNavigationStateExample: FC = (): ReactElement => {
  const location = useLocation();
  const state: NavigationState | null = location.state;

  return (
    <section>
      <h2>11. Missing navigation state</h2>
      <p>Message: {state?.message ?? "No navigation state is available."}</p>
      <p>Routes should remain valid when users open their URLs directly.</p>
    </section>
  );
};

/**
 * Demonstrates navigation state in a shared route layout.
 *
 * The layout can inspect the current location while the nested route renders
 * its own destination content through `Outlet`.
 */
export const RoutingStateLayoutExample: FC = (): ReactElement => {
  return (
    <main>
      <h2>12. Routing state layout</h2>
      <p>The layout remains mounted while child routes consume navigation context.</p>
      <Outlet />
    </main>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const DestinationPage: FC = (): ReactElement => {
  const location = useLocation();
  const state: NavigationState | null = location.state;

  return (
    <main>
      <h1>Destination</h1>
      <p>{state?.message ?? "Destination opened without navigation state."}</p>
      <Link to="/">Return home</Link>
    </main>
  );
};

const ProductPage: FC = (): ReactElement => {
  const location = useLocation();
  const state: unknown = location.state;

  return (
    <main>
      <h1>Product</h1>
      {typeof state === "object" && state !== null ? (
        <p>Navigation state was supplied for this product.</p>
      ) : (
        <p>Product opened without navigation state.</p>
      )}
      <Link to="/">Return home</Link>
    </main>
  );
};

const HomePage: FC = (): ReactElement => {
  return (
    <main>
      <h1>Routing State</h1>
      <p>Select an example to inspect transient state associated with navigation.</p>

      <nav aria-label="Routing state examples">
        <ul>
          <li>
            <Link to="/link-state">Link navigation state</Link>
          </li>
          <li>
            <Link to="/destination">Read navigation state</Link>
          </li>
          <li>
            <Link to="/programmatic-state">Programmatic navigation state</Link>
          </li>
          <li>
            <Link
              to="/origin"
              state={
                {
                  from: "/",
                  message: "The home page supplied this navigation context.",
                  source: "link",
                } satisfies NavigationState
              }
            >
              Navigation origin
            </Link>
          </li>
          <li>
            <Link to="/url-state">Navigation state versus URL state</Link>
          </li>
          <li>
            <Link to="/structured">Structured navigation state</Link>
          </li>
          <li>
            <Link
              to="/structured-consumer"
              state={
                {
                  source: "product-list",
                  productId: "product-100",
                } satisfies ProductNavigationState
              }
            >
              Structured state consumer
            </Link>
          </li>
          <li>
            <Link
              to="/transient-ui"
              state={
                {
                  source: "products",
                  openDetails: true,
                } satisfies ModalNavigationState
              }
            >
              Transient UI state
            </Link>
          </li>
          <li>
            <Link
              to="/history"
              state={
                {
                  from: "/",
                  message: "State associated with this history entry.",
                  source: "link",
                } satisfies NavigationState
              }
            >
              History entry state
            </Link>
          </li>
          <li>
            <Link to="/persistence">Navigation state persistence</Link>
          </li>
          <li>
            <Link to="/missing-state">Missing navigation state</Link>
          </li>
        </ul>
      </nav>
    </main>
  );
};

const RoutingStateDemo: FC = (): ReactElement => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <HomePage />,
    },
    {
      path: "/link-state",
      element: <LinkNavigationStateExample />,
    },
    {
      path: "/destination",
      element: <DestinationPage />,
    },
    {
      path: "/programmatic-state",
      element: <ProgrammaticNavigationStateExample />,
    },
    {
      path: "/origin",
      element: <NavigationOriginExample />,
    },
    {
      path: "/url-state",
      element: <NavigationStateIsNotUrlStateExample />,
    },
    {
      path: "/structured",
      element: <StructuredNavigationStateExample />,
    },
    {
      path: "/structured-consumer",
      element: <StructuredStateConsumerExample />,
    },
    {
      path: "/transient-ui",
      element: <TransientUiNavigationStateExample />,
    },
    {
      path: "/history",
      element: <HistoryEntryStateExample />,
    },
    {
      path: "/persistence",
      element: <NavigationStatePersistenceExample />,
    },
    {
      path: "/missing-state",
      element: <MissingNavigationStateExample />,
    },
    {
      path: "/layout-state",
      element: <RoutingStateLayoutExample />,
      children: [
        {
          index: true,
          element: <DestinationPage />,
        },
      ],
    },
    {
      path: "/product/:productId",
      element: <ProductPage />,
    },
  ]);

  return <RouterProvider router={router} />;
};

export default RoutingStateDemo;

// ---------------------------------------------------------------------
// Summary
// Routing state is transient information associated with a navigation history entry.
// `Link` can pass navigation state through its `state` prop.
// `navigate` can pass navigation state through its navigation options.
// `useLocation` exposes the state associated with the current location.
// Navigation state does not become part of the pathname or query string.
// Navigation state is useful for transient navigation context and UI behavior.
// Destination routes should tolerate missing state because users can enter URLs directly.
// Navigation state is not a replacement for URL state, persistent state, or server data.
// Structured navigation state can be validated at runtime when its source is not controlled.
// Navigation state is associated with history entries and can participate in browser history navigation.
// ---------------------------------------------------------------------
