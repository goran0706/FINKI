/**
 * Route Scroll Restoration
 * =========================
 *
 * React Router's `ScrollRestoration` component manages scroll positions across route
 * navigations and browser history changes. It emulates the browser's scroll-restoration
 * behavior while coordinating the scroll position with the router's location and navigation
 * lifecycle.
 *
 * On a new location, React Router normally resets the window scroll position to the top.
 * When returning through browser history, `ScrollRestoration` can restore the previously
 * recorded position for that history entry. The component stores scroll positions in
 * session storage so they can survive route changes within the current browser session.
 *
 * Links and programmatic navigations can use `preventScrollReset` when a navigation should
 * preserve the current scroll position instead of resetting it. `ScrollRestoration` should
 * normally be rendered once for an application rather than once per route.
 */

import type { FC, ReactElement } from "react";
import {
  createBrowserRouter,
  Link,
  Outlet,
  RouterProvider,
  ScrollRestoration,
  useLocation,
  useNavigate,
} from "react-router-dom";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface ScrollSection {
  readonly id: string;
  readonly title: string;
  readonly description: string;
}

export interface ScrollPosition {
  readonly pathname: string;
  readonly scrollY: number;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * Demonstrates the application-level placement of `ScrollRestoration`.
 *
 * `ScrollRestoration` belongs in the routed application tree and should normally
 * be rendered only once. The component coordinates scroll behavior with router
 * navigation rather than requiring each route to implement it independently.
 */
export const ScrollRestorationLayout: FC = (): ReactElement => {
  return (
    <>
      <header>
        <h1>Route Scroll Restoration</h1>
        <nav aria-label="Primary navigation">
          <Link to="/">Home</Link>
          {" | "}
          <Link to="/long-page">Long page</Link>
          {" | "}
          <Link to="/settings">Settings</Link>
        </nav>
      </header>

      <Outlet />

      <ScrollRestoration />
    </>
  );
};

/**
 * Demonstrates a long document that can be used to create a meaningful scroll position.
 *
 * When the user scrolls this page and then navigates away before returning through
 * browser history, `ScrollRestoration` can restore the previous position.
 */
export const LongPageExample: FC = (): ReactElement => {
  const sections: readonly ScrollSection[] = Array.from({ length: 12 }, (_, index: number): ScrollSection => ({
    id: `section-${index + 1}`,
    title: `Section ${index + 1}`,
    description: "This content provides enough document height to demonstrate route scroll restoration.",
  }));

  return (
    <main>
      <h2>Long page</h2>
      <p>
        Scroll down, open another route, and then use browser Back navigation. The previous scroll position can be
        restored.
      </p>

      {sections.map((section: ScrollSection): ReactElement => (
        <section key={section.id}>
          <h3>{section.title}</h3>
          <p>{section.description}</p>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante.</p>
        </section>
      ))}
    </main>
  );
};

/**
 * Demonstrates normal navigation with scroll restoration.
 *
 * A new location normally resets the window scroll position to the top. When the
 * user later navigates backward or forward, `ScrollRestoration` can restore the
 * position associated with that history entry.
 */
export const NormalScrollNavigationExample: FC = (): ReactElement => {
  const navigate = useNavigate();

  const handleNavigate = (): void => {
    navigate("/settings");
  };

  return (
    <div>
      <p>This navigation uses the router's normal scroll behavior.</p>
      <button type="button" onClick={handleNavigate}>
        Open settings
      </button>
    </div>
  );
};

/**
 * Demonstrates `preventScrollReset` on a `Link`.
 *
 * This option prevents the navigation from resetting the current scroll position.
 * It is useful for navigation that changes URL state without conceptually moving
 * the user to a new document position, such as tabs implemented with search params.
 */
export const PreventScrollResetLinkExample: FC = (): ReactElement => {
  return (
    <div>
      <p>This link preserves the current scroll position during navigation.</p>
      <Link to="/settings?tab=notifications" preventScrollReset>
        Open notifications settings
      </Link>
    </div>
  );
};

/**
 * Demonstrates `preventScrollReset` with programmatic navigation.
 *
 * The same behavior is available through the `useNavigate` options object.
 */
export const PreventScrollResetNavigationExample: FC = (): ReactElement => {
  const navigate = useNavigate();

  const handleNavigate = (): void => {
    navigate("/settings?tab=privacy", {
      preventScrollReset: true,
    });
  };

  return (
    <button type="button" onClick={handleNavigate}>
      Open privacy settings without resetting scroll
    </button>
  );
};

/**
 * Demonstrates a custom scroll-restoration key.
 *
 * The `getKey` option can make several history entries share the same restoration
 * key. Using only the pathname means that different entries for the same pathname
 * can reuse the same stored scroll position.
 */
export const CustomScrollKeyExample: FC = (): ReactElement => {
  const location = useLocation();

  return (
    <div>
      <p>Current pathname: {location.pathname}</p>
      <p>
        A custom restoration key can be based on the pathname when the application wants one scroll position per route
        instead of one position per history entry.
      </p>
    </div>
  );
};

/**
 * Demonstrates hash-based navigation separately from route scroll restoration.
 *
 * A hash identifies a document fragment. It should not be confused with restoring
 * a previously recorded scroll position for a browser history entry.
 */
export const HashNavigationExample: FC = (): ReactElement => {
  return (
    <div>
      <p>Hash navigation targets a specific element in the document.</p>
      <Link to="/long-page#section-8">Jump to section 8</Link>
    </div>
  );
};

/**
 * Demonstrates the difference between restoration and scroll reset prevention.
 *
 * Restoration answers "where should this history entry return me?" while
 * `preventScrollReset` answers "should this new navigation avoid resetting
 * the current scroll position?"
 */
export const RestorationVsPreventResetExample: FC = (): ReactElement => {
  return (
    <div>
      <p>Restoration is primarily about returning to a previously stored position.</p>
      <p>`preventScrollReset` keeps the current position during a new navigation.</p>
    </div>
  );
};

/**
 * Demonstrates a common misconception about scroll restoration.
 *
 * `ScrollRestoration` does not make every scrollable element automatically preserve
 * its own position. Its standard behavior concerns the browser window's scroll position.
 */
export const ScrollRestorationGotchaExample: FC = (): ReactElement => {
  return (
    <div>
      <p>ScrollRestoration manages the window scroll position, not arbitrary independently scrollable containers.</p>
      <div
        style={{
          maxHeight: "120px",
          overflowY: "auto",
        }}
      >
        <p>
          A separately scrollable container has its own scroll position and requires application-specific handling if
          that position must persist.
        </p>
        <p>Container scrolling is different from window scroll restoration.</p>
        <p>Additional content demonstrates the independently scrollable region.</p>
        <p>The router does not automatically treat this container like window scrolling.</p>
      </div>
    </div>
  );
};

/**
 * Demonstrates that multiple `ScrollRestoration` components are unnecessary.
 *
 * The application should normally render one instance at the application level
 * rather than placing a separate instance inside every route component.
 */
export const SingleRestorationExample: FC = (): ReactElement => {
  return (
    <div>
      <p>Render one ScrollRestoration component for the routed application.</p>
      <p>Individual routes should not each create their own restoration manager.</p>
    </div>
  );
};

/**
 * Demonstrates the current location while working with restoration.
 *
 * Scroll restoration is tied to router locations, so the pathname can be inspected
 * independently when explaining which route owns the current document.
 */
export const CurrentLocationExample: FC = (): ReactElement => {
  const location = useLocation();

  return (
    <div>
      <p>Current route: {location.pathname}</p>
      <p>Search: {location.search || "none"}</p>
    </div>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const HomePage: FC = (): ReactElement => {
  return (
    <main>
      <h2>Home</h2>
      <p>Open the long page and scroll to a lower section to test restoration.</p>

      <LongPageExample />
    </main>
  );
};

const LongPageRoute: FC = (): ReactElement => {
  return (
    <main>
      <h2>Long page route</h2>
      <p>Scroll to a lower section, navigate away, then return with browser Back.</p>

      <LongPageExample />

      <HashNavigationExample />
    </main>
  );
};

const SettingsPage: FC = (): ReactElement => {
  return (
    <main>
      <h2>Settings</h2>
      <p>This route represents a new location in the application.</p>
      <CurrentLocationExample />
      <Link to="/long-page">Return to long page</Link>
    </main>
  );
};

const ScrollRestorationDemo: FC = (): ReactElement => {
  return (
    <>
      <ScrollRestorationLayout />

      <section>
        <h2>1. Normal Scroll Navigation</h2>
        <NormalScrollNavigationExample />
      </section>

      <section>
        <h2>2. Prevent Scroll Reset with Link</h2>
        <PreventScrollResetLinkExample />
      </section>

      <section>
        <h2>3. Prevent Scroll Reset with Programmatic Navigation</h2>
        <PreventScrollResetNavigationExample />
      </section>

      <section>
        <h2>4. Custom Restoration Key</h2>
        <CustomScrollKeyExample />
      </section>

      <section>
        <h2>5. Hash Navigation</h2>
        <HashNavigationExample />
      </section>

      <section>
        <h2>6. Restoration vs Preventing Reset</h2>
        <RestorationVsPreventResetExample />
      </section>

      <section>
        <h2>7. Scroll Restoration Gotcha</h2>
        <ScrollRestorationGotchaExample />
      </section>

      <section>
        <h2>8. Single Restoration Instance</h2>
        <SingleRestorationExample />
      </section>
    </>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <ScrollRestorationDemo />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "long-page",
        element: <LongPageRoute />,
      },
      {
        path: "settings",
        element: <SettingsPage />,
      },
    ],
  },
]);

const App: FC = (): ReactElement => {
  return <RouterProvider router={router} />;
};

export default App;

// ---------------------------------------------------------------------
// Summary
// `ScrollRestoration` coordinates window scroll positions with router navigation.
// A new location normally resets the window scroll position to the top.
// Browser Back and Forward navigation can restore previously recorded positions.
// `preventScrollReset` prevents a new navigation from resetting the current scroll position.
// `Link` and `useNavigate` both support `preventScrollReset`.
// `getKey` can customize which locations share a scroll-restoration key.
// Hash navigation targets a document fragment and is distinct from history scroll restoration.
// ScrollRestoration manages window scrolling, not arbitrary independently scrollable containers.
// Applications should normally render one ScrollRestoration instance.
// ---------------------------------------------------------------------
