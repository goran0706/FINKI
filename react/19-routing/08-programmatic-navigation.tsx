/**
 * Programmatic Navigation
 * ========================
 *
 * React Router provides the `useNavigate` hook for changing the current location
 * from JavaScript instead of relying on a declarative `<Link>` or `<NavLink>`.
 *
 * The returned `navigate` function accepts either a destination or a numeric history
 * delta. A destination can be a string path or a location object, while navigation
 * options can control history replacement, navigation state, and relative resolution.
 *
 * Programmatic navigation is useful when navigation is a consequence of an event
 * or application condition, such as submitting a form, completing an operation,
 * closing a workflow, or responding to an authentication result. When a navigation
 * can simply be represented as a user-facing link, declarative navigation is generally
 * more appropriate.
 */

import { type FC, type ReactElement, useEffect, useState } from "react";
import { BrowserRouter, Route, Routes, useLocation, useNavigate } from "react-router-dom";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface NavigationState {
  readonly message: string;
  readonly source: string;
}

export interface ProgrammaticNavigationProps {
  readonly destination: string;
}

export interface NavigationResult {
  readonly status: "idle" | "completed";
  readonly destination: string;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * Demonstrates basic programmatic navigation.
 *
 * `useNavigate` returns a function that changes the current router location.
 * Calling `navigate("/products")` performs the same kind of client-side route
 * transition that an internal link would perform, but the destination is chosen
 * by JavaScript.
 */
export const BasicProgrammaticNavigationExample: FC = (): ReactElement => {
  const navigate = useNavigate();

  const handleNavigate = (): void => {
    navigate("/products");
  };

  return (
    <div>
      <button type="button" onClick={handleNavigate}>
        Open products
      </button>
    </div>
  );
};

/**
 * Demonstrates navigation with a location object.
 *
 * A location object can describe the pathname, query string, and hash separately,
 * which is useful when those URL components are constructed dynamically.
 */
export const LocationObjectNavigationExample: FC = (): ReactElement => {
  const navigate = useNavigate();

  const handleNavigate = (): void => {
    navigate({
      pathname: "/products",
      search: "?category=books",
      hash: "#featured",
    });
  };

  return (
    <button type="button" onClick={handleNavigate}>
      Open featured books
    </button>
  );
};

/**
 * Demonstrates navigating backward and forward through browser history.
 *
 * Numeric navigation values represent history deltas. `-1` moves backward one
 * entry, while `1` moves forward one entry.
 */
export const HistoryDeltaNavigationExample: FC = (): ReactElement => {
  const navigate = useNavigate();

  return (
    <div>
      <button type="button" onClick={(): void => navigate(-1)}>
        Go back
      </button>
      <button type="button" onClick={(): void => navigate(1)}>
        Go forward
      </button>
    </div>
  );
};

/**
 * Demonstrates replacing the current history entry.
 *
 * `replace: true` prevents the current location from remaining as a separate
 * entry in the browser history stack.
 */
export const ReplaceNavigationExample: FC = (): ReactElement => {
  const navigate = useNavigate();

  const handleContinue = (): void => {
    navigate("/account", { replace: true });
  };

  return (
    <div>
      <p>Continue without keeping this page as a separate history entry.</p>
      <button type="button" onClick={handleContinue}>
        Continue
      </button>
    </div>
  );
};

/**
 * Demonstrates passing navigation state.
 *
 * The state is stored with the history entry rather than encoded into the URL.
 * The destination can read it through `useLocation`.
 */
export const NavigationStateExample: FC = (): ReactElement => {
  const navigate = useNavigate();

  const navigationState: NavigationState = {
    message: "Opened from the checkout flow",
    source: "checkout",
  };

  const handleNavigate = (): void => {
    navigate("/account", {
      state: navigationState,
    });
  };

  return (
    <button type="button" onClick={handleNavigate}>
      Open account with state
    </button>
  );
};

/**
 * Demonstrates reading navigation state at the destination.
 *
 * Navigation state is available through the location object after navigation.
 * It is not represented by the pathname, query string, or hash.
 */
export const ReadNavigationStateExample: FC = (): ReactElement => {
  const location = useLocation();
  const state = location.state as NavigationState | null;

  return (
    <div>
      <p>Message: {state?.message ?? "No navigation state"}</p>
      <p>Source: {state?.source ?? "Unknown"}</p>
    </div>
  );
};

/**
 * Demonstrates relative programmatic navigation.
 *
 * Relative navigation can resolve against the current route hierarchy. The
 * `relative` option can explicitly select route-relative or path-relative
 * resolution when the distinction matters.
 */
export const RelativeNavigationExample: FC = (): ReactElement => {
  const navigate = useNavigate();

  const handleNavigate = (): void => {
    navigate("security", { relative: "path" });
  };

  return (
    <button type="button" onClick={handleNavigate}>
      Open security settings
    </button>
  );
};

/**
 * Demonstrates navigation triggered by a state transition.
 *
 * Programmatic navigation can be initiated after application state reaches
 * a particular condition, such as a successful operation.
 */
export const StateDrivenNavigationExample: FC = (): ReactElement => {
  const navigate = useNavigate();
  const [result, setResult] = useState<NavigationResult>({
    status: "idle",
    destination: "/products",
  });

  useEffect((): void => {
    if (result.status !== "completed") {
      return;
    }

    navigate(result.destination, { replace: true });
  }, [navigate, result]);

  const handleComplete = (): void => {
    setResult({
      status: "completed",
      destination: "/products",
    });
  };

  return (
    <button type="button" onClick={handleComplete}>
      Complete operation
    </button>
  );
};

/**
 * Demonstrates the difference between programmatic navigation and a link.
 *
 * A navigation caused by an explicit user action that represents a destination
 * is often clearer as a `Link`. `useNavigate` is appropriate when navigation
 * depends on application logic or an event outcome.
 */
export const LinkVsProgrammaticNavigationExample: FC = (): ReactElement => {
  const navigate = useNavigate();

  const handleSuccessfulOperation = (): void => {
    navigate("/account");
  };

  return (
    <div>
      <p>Use a link when the destination is directly exposed as navigation.</p>
      <p>Use programmatic navigation when application logic determines the destination.</p>
      <button type="button" onClick={handleSuccessfulOperation}>
        Navigate after operation
      </button>
    </div>
  );
};

/**
 * Demonstrates a common history-navigation gotcha.
 *
 * A numeric history delta depends on the browser's existing history stack.
 * `navigate(-1)` does not guarantee that the previous entry belongs to the
 * current application or even that a previous entry exists.
 */
export const HistoryDeltaGotchaExample: FC = (): ReactElement => {
  const navigate = useNavigate();

  const handleBack = (): void => {
    navigate(-1);
  };

  return (
    <div>
      <p>A history delta depends on the entries currently available in browser history.</p>
      <button type="button" onClick={handleBack}>
        Attempt to go back
      </button>
    </div>
  );
};

/**
 * Demonstrates a common misconception about `useNavigate`.
 *
 * Calling `navigate` changes the router location, but it does not itself
 * define which route component should render at the destination.
 */
export const NavigationDoesNotCreateRouteExample: FC = (): ReactElement => {
  const navigate = useNavigate();

  const handleNavigate = (): void => {
    navigate("/unconfigured");
  };

  return (
    <div>
      <button type="button" onClick={handleNavigate}>
        Navigate to an unconfigured path
      </button>
      <p>Navigation changes the location; route configuration determines what renders there.</p>
    </div>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const HomePage: FC = (): ReactElement => {
  return <p>Home page</p>;
};

const ProductsPage: FC = (): ReactElement => {
  return (
    <div>
      <p>Products page</p>
      <LocationObjectNavigationExample />
    </div>
  );
};

const AccountPage: FC = (): ReactElement => {
  return (
    <div>
      <p>Account page</p>
      <ReadNavigationStateExample />
      <RelativeNavigationExample />
    </div>
  );
};

const SecurityPage: FC = (): ReactElement => {
  return (
    <div>
      <p>Security settings</p>
      <ReadNavigationStateExample />
    </div>
  );
};

const NotFoundPage: FC = (): ReactElement => {
  return <p>No configured route matches this location.</p>;
};

const ProgrammaticNavigationDemo: FC = (): ReactElement => {
  return (
    <BrowserRouter>
      <main>
        <h1>Programmatic Navigation</h1>

        <section>
          <h2>1. Basic Programmatic Navigation</h2>
          <BasicProgrammaticNavigationExample />
        </section>

        <section>
          <h2>2. Location Object Navigation</h2>
          <LocationObjectNavigationExample />
        </section>

        <section>
          <h2>3. History Delta Navigation</h2>
          <HistoryDeltaNavigationExample />
        </section>

        <section>
          <h2>4. Replacing a History Entry</h2>
          <ReplaceNavigationExample />
        </section>

        <section>
          <h2>5. Passing Navigation State</h2>
          <NavigationStateExample />
        </section>

        <section>
          <h2>6. Reading Navigation State</h2>
          <ReadNavigationStateExample />
        </section>

        <section>
          <h2>7. Relative Programmatic Navigation</h2>
          <p>Open the account route to test route-relative navigation.</p>
          <button
            type="button"
            onClick={(): void => {
              window.history.pushState(null, "", "/account");
              window.dispatchEvent(new PopStateEvent("popstate"));
            }}
          >
            Open account route
          </button>
        </section>

        <section>
          <h2>8. State-Driven Navigation</h2>
          <StateDrivenNavigationExample />
        </section>

        <section>
          <h2>9. Link vs Programmatic Navigation</h2>
          <LinkVsProgrammaticNavigationExample />
        </section>

        <section>
          <h2>10. History Delta Gotcha</h2>
          <HistoryDeltaGotchaExample />
        </section>

        <section>
          <h2>11. Navigation Does Not Create a Route</h2>
          <NavigationDoesNotCreateRouteExample />
        </section>

        <section>
          <h2>12. Routed Pages</h2>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/account" element={<AccountPage />} />
            <Route path="/account/security" element={<SecurityPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </section>
      </main>
    </BrowserRouter>
  );
};

export default ProgrammaticNavigationDemo;

// ---------------------------------------------------------------------
// Summary
// `useNavigate` returns a function for programmatic client-side navigation.
// `navigate("/path")` navigates to a specific destination.
// A location object can specify pathname, search, and hash separately.
// Numeric deltas navigate through the existing browser history stack.
// `replace: true` replaces the current history entry instead of adding one.
// `state` attaches client-side state to the destination's history entry.
// Relative navigation can be resolved against the route hierarchy or URL path.
// Programmatic navigation is useful when application logic determines when navigation occurs.
// Declarative links remain preferable when the destination is directly represented as a link.
// Navigation changes the location; route configuration determines what renders at that location.
// ---------------------------------------------------------------------
