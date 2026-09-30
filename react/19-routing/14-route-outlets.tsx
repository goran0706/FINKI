/**
 * Route Outlets
 * =============
 *
 * The `Outlet` component is the rendering point for a route's matched child route.
 * When routes are nested, the parent route remains rendered and React Router places
 * the element belonging to the deepest matched child route into the parent's `Outlet`.
 *
 * An outlet therefore connects the route hierarchy to the component hierarchy. A parent
 * component can render shared navigation, headers, sidebars, or other layout elements
 * around the outlet while child routes provide the changing page content.
 *
 * `Outlet` can also receive context that child routes read with `useOutletContext`.
 * This allows a parent route to provide strongly typed contextual data to its direct
 * child route without introducing a separate global state mechanism.
 */

import { type FC, type ReactElement, useState } from "react";
import { BrowserRouter, Link, Outlet, Route, Routes, useOutletContext } from "react-router-dom";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface DashboardOutletContext {
  readonly username: string;
  readonly notifications: number;
}

export interface OutletNavigationProps {
  readonly label: string;
  readonly destination: string;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * Demonstrates the basic purpose of `Outlet`.
 *
 * The parent renders its own content and uses `Outlet` as the location where
 * the currently matched child route will be rendered.
 */
export const BasicOutletExample: FC = (): ReactElement => {
  return (
    <div>
      <h3>Parent content</h3>
      <p>The child route is rendered below this content.</p>
      <Outlet />
    </div>
  );
};

/**
 * Demonstrates an outlet inside a layout.
 *
 * Shared layout elements remain rendered while the outlet changes according
 * to the active child route.
 */
export const LayoutOutletExample: FC = (): ReactElement => {
  return (
    <div>
      <header>
        <strong>Dashboard</strong>
      </header>
      <nav aria-label="Dashboard navigation">
        <Link to="overview">Overview</Link>
        {" | "}
        <Link to="activity">Activity</Link>
        {" | "}
        <Link to="settings">Settings</Link>
      </nav>
      <main>
        <Outlet />
      </main>
    </div>
  );
};

/**
 * Demonstrates an outlet with an index route.
 *
 * An index child renders when the parent route matches without an additional
 * child path segment.
 */
export const IndexOutletExample: FC = (): ReactElement => {
  return (
    <div>
      <h3>Account</h3>
      <nav aria-label="Account navigation">
        <Link to="profile">Profile</Link>
        {" | "}
        <Link to="security">Security</Link>
      </nav>
      <Outlet />
    </div>
  );
};

/**
 * Demonstrates multiple levels of outlets.
 *
 * Each nested parent can expose its own outlet, allowing one route hierarchy
 * to produce several layers of persistent layout.
 */
export const MultiLevelOutletExample: FC = (): ReactElement => {
  return (
    <div>
      <h3>Application layout</h3>
      <Outlet />
    </div>
  );
};

/**
 * Demonstrates the second level of an outlet hierarchy.
 *
 * This component acts as another parent and provides a second rendering point
 * for its own matched child route.
 */
export const NestedOutletExample: FC = (): ReactElement => {
  return (
    <section>
      <h4>Dashboard section</h4>
      <Outlet />
    </section>
  );
};

/**
 * Demonstrates passing context through an outlet.
 *
 * `Outlet` can provide contextual data to its child route through its `context`
 * prop. The child retrieves that data with `useOutletContext`.
 */
export const OutletContextProviderExample: FC = (): ReactElement => {
  const [notifications] = useState<number>(3);

  const context: DashboardOutletContext = {
    username: "John Doe",
    notifications,
  };

  return (
    <div>
      <h3>Dashboard layout</h3>
      <p>Shared dashboard content.</p>
      <Outlet context={context} />
    </div>
  );
};

/**
 * Demonstrates reading context supplied by an outlet.
 *
 * The generic argument passed to `useOutletContext` describes the shape of the
 * context supplied by the parent outlet.
 */
export const OutletContextConsumerExample: FC = (): ReactElement => {
  const context = useOutletContext<DashboardOutletContext>();

  return (
    <div>
      <p>User: {context.username}</p>
      <p>Notifications: {context.notifications}</p>
    </div>
  );
};

/**
 * Demonstrates that an outlet renders the currently matched child.
 *
 * The parent does not manually choose which child component to render. React Router
 * determines the matched child route from the current location.
 */
export const MatchedChildOutletExample: FC = (): ReactElement => {
  return (
    <div>
      <h3>Route-controlled content</h3>
      <p>The router determines which child appears in this outlet.</p>
      <Outlet />
    </div>
  );
};

/**
 * Demonstrates a parent layout that remains visible across child navigation.
 *
 * Only the content rendered through the outlet changes when the active child route
 * changes, while the surrounding layout remains part of the matched route branch.
 */
export const PersistentOutletLayoutExample: FC = (): ReactElement => {
  return (
    <div>
      <aside>
        <strong>Persistent sidebar</strong>
      </aside>
      <section>
        <Outlet />
      </section>
    </div>
  );
};

/**
 * Demonstrates that an outlet does not independently create a route.
 *
 * An `Outlet` only provides a rendering location. A matching nested route must
 * exist for meaningful child content to appear there.
 */
export const OutletDoesNotCreateRouteExample: FC = (): ReactElement => {
  return (
    <div>
      <p>This parent contains an outlet.</p>
      <Outlet />
    </div>
  );
};

/**
 * Demonstrates a common misconception about outlets.
 *
 * An outlet is not a general-purpose placeholder that renders arbitrary children
 * passed directly to the parent component. Its content is controlled by the
 * router's matched child route.
 */
export const OutletIsNotRegularChildrenExample: FC = (): ReactElement => {
  return (
    <div>
      <p>Outlet content comes from the matched child route.</p>
      <Outlet />
    </div>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const HomePage: FC = (): ReactElement => {
  return (
    <main>
      <h2>Route Outlets</h2>
      <p>Select an example to inspect how matched child routes render through an Outlet.</p>

      <nav aria-label="Outlet examples">
        <ul>
          <li>
            <Link to="/basic-outlet">Basic outlet</Link>
          </li>
          <li>
            <Link to="/dashboard/overview">Layout outlet</Link>
          </li>
          <li>
            <Link to="/account">Index outlet</Link>
          </li>
          <li>
            <Link to="/application/dashboard/activity">Multiple outlet levels</Link>
          </li>
          <li>
            <Link to="/context-dashboard">Outlet context</Link>
          </li>
          <li>
            <Link to="/matched/first">Matched child</Link>
          </li>
          <li>
            <Link to="/persistent/profile">Persistent layout</Link>
          </li>
          <li>
            <Link to="/empty-outlet">Outlet without child</Link>
          </li>
          <li>
            <Link to="/children-outlet">Outlet is not regular children</Link>
          </li>
        </ul>
      </nav>
    </main>
  );
};

const BasicOutletChildPage: FC = (): ReactElement => {
  return (
    <div>
      <h4>Child route</h4>
      <p>This component is rendered by the parent's Outlet.</p>
    </div>
  );
};

const DashboardOverviewPage: FC = (): ReactElement => {
  return (
    <div>
      <h3>Overview</h3>
      <p>The dashboard layout remains visible around this child content.</p>
    </div>
  );
};

const DashboardActivityPage: FC = (): ReactElement => {
  return (
    <div>
      <h3>Activity</h3>
      <p>The same parent layout remains while the outlet renders a different child.</p>
    </div>
  );
};

const DashboardSettingsPage: FC = (): ReactElement => {
  return (
    <div>
      <h3>Settings</h3>
      <p>Settings is another child rendered through the dashboard outlet.</p>
    </div>
  );
};

const AccountIndexPage: FC = (): ReactElement => {
  return (
    <div>
      <h3>Account overview</h3>
      <p>This is the index child rendered at the account parent URL.</p>
    </div>
  );
};

const AccountProfilePage: FC = (): ReactElement => {
  return (
    <div>
      <h3>Profile</h3>
      <p>Profile is rendered through the account outlet.</p>
    </div>
  );
};

const AccountSecurityPage: FC = (): ReactElement => {
  return (
    <div>
      <h3>Security</h3>
      <p>Security is rendered through the same account outlet.</p>
    </div>
  );
};

const ApplicationDashboardPage: FC = (): ReactElement => {
  return (
    <div>
      <h3>Dashboard</h3>
      <NestedOutletExample />
    </div>
  );
};

const DashboardActivityNestedPage: FC = (): ReactElement => {
  return (
    <div>
      <p>Activity is rendered through the second-level outlet.</p>
    </div>
  );
};

const DashboardOverviewNestedPage: FC = (): ReactElement => {
  return (
    <div>
      <p>Overview is rendered through the second-level outlet.</p>
    </div>
  );
};

const ContextDashboardPage: FC = (): ReactElement => {
  return (
    <div>
      <h3>Dashboard</h3>
      <OutletContextProviderExample />
    </div>
  );
};

const ContextDashboardChildPage: FC = (): ReactElement => {
  return <OutletContextConsumerExample />;
};

const MatchedChildFirstPage: FC = (): ReactElement => {
  return (
    <div>
      <p>First child is currently matched.</p>
    </div>
  );
};

const MatchedChildSecondPage: FC = (): ReactElement => {
  return (
    <div>
      <p>Second child is currently matched.</p>
    </div>
  );
};

const PersistentProfilePage: FC = (): ReactElement => {
  return (
    <div>
      <h3>Profile</h3>
      <p>The sidebar remains while this child is rendered.</p>
    </div>
  );
};

const PersistentSettingsPage: FC = (): ReactElement => {
  return (
    <div>
      <h3>Settings</h3>
      <p>The same sidebar remains while this child is rendered.</p>
    </div>
  );
};

const EmptyOutletPage: FC = (): ReactElement => {
  return (
    <main>
      <h2>Parent with no matched child</h2>
      <p>The parent remains rendered, but there is no child content for the outlet.</p>
      <Outlet />
    </main>
  );
};

const ChildrenOutletPage: FC = (): ReactElement => {
  return (
    <main>
      <h2>Outlet rendering behavior</h2>
      <Outlet />
    </main>
  );
};

const OutletDemo: FC = (): ReactElement => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />

        <Route path="/basic-outlet" element={<BasicOutletExample />}>
          <Route index element={<BasicOutletChildPage />} />
        </Route>

        <Route path="/dashboard" element={<LayoutOutletExample />}>
          <Route path="overview" element={<DashboardOverviewPage />} />
          <Route path="activity" element={<DashboardActivityPage />} />
          <Route path="settings" element={<DashboardSettingsPage />} />
        </Route>

        <Route path="/account" element={<IndexOutletExample />}>
          <Route index element={<AccountIndexPage />} />
          <Route path="profile" element={<AccountProfilePage />} />
          <Route path="security" element={<AccountSecurityPage />} />
        </Route>

        <Route path="/application" element={<MultiLevelOutletExample />}>
          <Route path="dashboard" element={<ApplicationDashboardPage />}>
            <Route path="activity" element={<DashboardActivityNestedPage />} />
            <Route path="overview" element={<DashboardOverviewNestedPage />} />
          </Route>
        </Route>

        <Route path="/context-dashboard" element={<ContextDashboardPage />}>
          <Route index element={<ContextDashboardChildPage />} />
        </Route>

        <Route path="/matched" element={<MatchedChildOutletExample />}>
          <Route path="first" element={<MatchedChildFirstPage />} />
          <Route path="second" element={<MatchedChildSecondPage />} />
        </Route>

        <Route path="/persistent" element={<PersistentOutletLayoutExample />}>
          <Route path="profile" element={<PersistentProfilePage />} />
          <Route path="settings" element={<PersistentSettingsPage />} />
        </Route>

        <Route path="/empty-outlet" element={<OutletDoesNotCreateRouteExample />} />

        <Route path="/children-outlet" element={<OutletIsNotRegularChildrenExample />}>
          <Route index element={<BasicOutletChildPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default OutletDemo;

// ---------------------------------------------------------------------
// Summary
// `Outlet` is the rendering point for a matched child route.
// Parent routes remain rendered while their child content changes through the outlet.
// An outlet is commonly used to build persistent layouts with shared navigation and structure.
// Index routes render through the parent's outlet at the parent URL.
// Multiple nested route levels can each provide their own Outlet.
// `Outlet` can provide typed contextual data to child routes through `useOutletContext`.
// The router determines which child route is rendered inside an outlet.
// An Outlet does not create a route by itself; a matching child route must exist.
// An Outlet is not a general-purpose replacement for ordinary React children.
// ---------------------------------------------------------------------
