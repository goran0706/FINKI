/**
 * Index Routes
 * ============
 *
 * An index route is the default child route rendered when its parent route matches
 * and no more specific child path is present. It is configured with the `index` prop
 * instead of a `path`, so it renders at exactly the parent's URL.
 *
 * Index routes are useful for providing default content inside nested layouts. The
 * parent route can render persistent UI and an `Outlet`, while the index route supplies
 * the initial content shown at the parent URL.
 *
 * An index route is different from a route with an empty or repeated path. It is a
 * distinct route configuration that specifically represents the default child of a
 * parent route. An index route also cannot have child routes of its own.
 */

import { type FC, type ReactElement } from "react";
import { BrowserRouter, Link, Outlet, Route, Routes } from "react-router-dom";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface IndexNavigationProps {
  readonly label: string;
  readonly destination: string;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * Demonstrates the basic purpose of an index route.
 *
 * The parent route matches `/dashboard`, and its index child is rendered because
 * no additional child path segment is present.
 */
export const BasicIndexRouteExample: FC = (): ReactElement => {
  return (
    <div>
      <h3>Dashboard overview</h3>
      <p>This is the default child rendered at the parent dashboard URL.</p>
    </div>
  );
};

/**
 * Demonstrates the parent route that provides the rendering location for an
 * index route.
 *
 * The parent remains rendered while the index route supplies the default content
 * through its Outlet.
 */
export const IndexRouteParentExample: FC = (): ReactElement => {
  return (
    <div>
      <h3>Dashboard</h3>
      <nav aria-label="Dashboard navigation">
        <Link to=".">Overview</Link>
        {" | "}
        <Link to="activity">Activity</Link>
        {" | "}
        <Link to="settings">Settings</Link>
      </nav>
      <Outlet />
    </div>
  );
};

/**
 * Demonstrates that an index route has no `path` property.
 *
 * The route is selected because it is the default child of its parent, rather
 * than because the URL contains an additional path segment.
 */
export const IndexRouteHasNoPathExample: FC = (): ReactElement => {
  return (
    <div>
      <h3>Default dashboard content</h3>
      <p>The URL is the parent route URL because the index route does not add a path segment.</p>
    </div>
  );
};

/**
 * Demonstrates navigation from an index route to another child route.
 *
 * Navigating to a child path replaces the index route with the newly matched
 * child while the parent layout remains rendered.
 */
export const IndexRouteSiblingExample: FC = (): ReactElement => {
  return (
    <div>
      <h3>Activity</h3>
      <p>This sibling child route replaces the index route when its path is matched.</p>
    </div>
  );
};

/**
 * Demonstrates an index route inside a deeper nested route hierarchy.
 *
 * Index routes apply at their immediate parent level, so a nested layout can
 * have its own default child independently of an index route higher in the tree.
 */
export const NestedIndexRouteExample: FC = (): ReactElement => {
  return (
    <div>
      <h4>Team overview</h4>
      <p>This index route is the default child of the team layout.</p>
    </div>
  );
};

/**
 * Demonstrates that index routes can coexist with parameterized sibling routes.
 *
 * The index route handles the parent URL, while the parameterized route handles
 * a URL containing an additional dynamic segment.
 */
export const ParameterizedSiblingIndexExample: FC = (): ReactElement => {
  return (
    <div>
      <h3>Team overview</h3>
      <p>The index route handles the team URL before a specific member is selected.</p>
    </div>
  );
};

/**
 * Demonstrates a common misconception about index routes.
 *
 * An index route is not a redirect to another URL. It renders its element at the
 * parent URL, so the browser location does not acquire an additional path segment.
 */
export const IndexRouteIsNotRedirectExample: FC = (): ReactElement => {
  return (
    <div>
      <h3>Account overview</h3>
      <p>This content is rendered at the parent URL rather than through a redirect.</p>
    </div>
  );
};

/**
 * Demonstrates the restriction that an index route cannot have child routes.
 *
 * Index routes are terminal routes in the route hierarchy. If another nested
 * level is required, a normal path route should be used as the parent instead.
 */
export const IndexRouteIsTerminalExample: FC = (): ReactElement => {
  return (
    <div>
      <h3>Terminal index route</h3>
      <p>An index route cannot contain nested child routes of its own.</p>
    </div>
  );
};

/**
 * Demonstrates that an index route is selected only when the parent route is
 * matched without a more specific child path.
 *
 * The index route therefore represents the parent's default child rather than
 * competing with the parent's sibling child routes.
 */
export const IndexRouteMatchingExample: FC = (): ReactElement => {
  return (
    <div>
      <h3>Default settings content</h3>
      <p>This content appears when the settings parent matches without a specific child path.</p>
    </div>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const ActivityPage: FC = (): ReactElement => {
  return (
    <div>
      <h3>Activity</h3>
      <p>Activity is a sibling child route of the dashboard index route.</p>
    </div>
  );
};

const SettingsPage: FC = (): ReactElement => {
  return (
    <div>
      <h3>Settings</h3>
      <p>Settings is another sibling child route.</p>
    </div>
  );
};

const TeamLayout: FC = (): ReactElement => {
  return (
    <div>
      <h3>Team</h3>
      <nav aria-label="Team navigation">
        <Link to=".">Overview</Link>
        {" | "}
        <Link to="members">Members</Link>
      </nav>
      <Outlet />
    </div>
  );
};

const TeamMembersPage: FC = (): ReactElement => {
  return (
    <div>
      <h4>Team members</h4>
      <p>This child route replaces the team index route.</p>
    </div>
  );
};

const TeamMemberPage: FC = (): ReactElement => {
  return (
    <div>
      <h4>Team member</h4>
      <p>A specific team member can be represented by a parameterized sibling route.</p>
    </div>
  );
};

const ParameterizedTeamLayout: FC = (): ReactElement => {
  return (
    <div>
      <h3>Engineering team</h3>
      <nav aria-label="Engineering team navigation">
        <Link to=".">Overview</Link>
        {" | "}
        <Link to="members">Members</Link>
        {" | "}
        <Link to="members/john">John</Link>
      </nav>
      <Outlet />
    </div>
  );
};

const AccountLayout: FC = (): ReactElement => {
  return (
    <div>
      <h3>Account</h3>
      <nav aria-label="Account navigation">
        <Link to=".">Overview</Link>
        {" | "}
        <Link to="profile">Profile</Link>
      </nav>
      <Outlet />
    </div>
  );
};

const AccountProfilePage: FC = (): ReactElement => {
  return (
    <div>
      <h3>Profile</h3>
      <p>Profile is a sibling route of the account index route.</p>
    </div>
  );
};

const SettingsLayout: FC = (): ReactElement => {
  return (
    <div>
      <h3>Settings</h3>
      <Outlet />
    </div>
  );
};

const SettingsDefaultPage: FC = (): ReactElement => {
  return (
    <div>
      <h3>General settings</h3>
      <p>This index route provides the default settings content.</p>
    </div>
  );
};

const SettingsNotificationsPage: FC = (): ReactElement => {
  return (
    <div>
      <h3>Notifications</h3>
      <p>Notification settings are a separate child route.</p>
    </div>
  );
};

const HomePage: FC = (): ReactElement => {
  return (
    <main>
      <h1>Index Routes</h1>
      <p>Select an example to inspect how index routes provide default child content.</p>

      <nav aria-label="Index route examples">
        <ul>
          <li>
            <Link to="/dashboard">Basic index route</Link>
          </li>
          <li>
            <Link to="/team">Nested index route</Link>
          </li>
          <li>
            <Link to="/teams/engineering">Parameterized sibling route</Link>
          </li>
          <li>
            <Link to="/account">Index route without redirect</Link>
          </li>
          <li>
            <Link to="/settings">Index route matching</Link>
          </li>
        </ul>
      </nav>
    </main>
  );
};

const IndexRoutesDemo: FC = (): ReactElement => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />

        <Route path="/dashboard" element={<IndexRouteParentExample />}>
          <Route index element={<BasicIndexRouteExample />} />
          <Route path="activity" element={<ActivityPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        <Route path="/team" element={<TeamLayout />}>
          <Route index element={<NestedIndexRouteExample />} />
          <Route path="members" element={<TeamMembersPage />} />
        </Route>

        <Route path="/teams/:teamId" element={<ParameterizedTeamLayout />}>
          <Route index element={<ParameterizedSiblingIndexExample />} />
          <Route path="members" element={<TeamMembersPage />} />
          <Route path="members/john" element={<TeamMemberPage />} />
        </Route>

        <Route path="/account" element={<AccountLayout />}>
          <Route index element={<IndexRouteIsNotRedirectExample />} />
          <Route path="profile" element={<AccountProfilePage />} />
        </Route>

        <Route path="/settings" element={<SettingsLayout />}>
          <Route index element={<IndexRouteMatchingExample />} />
          <Route path="notifications" element={<SettingsNotificationsPage />} />
        </Route>

        <Route path="/terminal-index" element={<IndexRouteIsTerminalExample />} />

        <Route path="/index-path-example" element={<IndexRouteHasNoPathExample />} />

        <Route path="/sibling-example" element={<IndexRouteSiblingExample />} />
      </Routes>
    </BrowserRouter>
  );
};

export default IndexRoutesDemo;

// ---------------------------------------------------------------------
// Summary
// An index route is the default child route of a parent route.
// An index route uses `index` instead of `path`.
// An index route renders at the parent's URL without adding another path segment.
// The parent route normally renders an `Outlet` where the index route appears.
// A sibling child route replaces the index route when its path is matched.
// Index routes can exist at multiple levels of a nested route hierarchy.
// An index route is not a redirect and does not change the browser URL.
// An index route is terminal and cannot have child routes of its own.
// ---------------------------------------------------------------------
