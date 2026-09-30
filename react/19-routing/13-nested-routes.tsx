/**
 * Nested Routes
 * =============
 *
 * Nested routes allow a route hierarchy to mirror the structure of an application's
 * interface. A parent route can render shared layout or contextual content while a
 * child route renders inside the parent's `<Outlet>`.
 *
 * Child route paths are normally relative to their parent route. For example, a parent
 * route at `/account` can define children such as `profile` and `settings`, producing
 * `/account/profile` and `/account/settings`.
 *
 * Nested routes also create a route hierarchy that can share URL parameters, layouts,
 * loaders, actions, and error boundaries. A child route can access parameters defined
 * by its matched parent routes through `useParams`.
 */

import type { FC, ReactElement } from "react";
import { BrowserRouter, Link, Outlet, Route, Routes, useParams } from "react-router-dom";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface AccountRouteParams {
  readonly accountId: string;
}

export interface NestedRouteLinkProps {
  readonly to: string;
  readonly label: string;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * Demonstrates a basic nested route outlet.
 *
 * The parent route renders the shared account layout, while the matching child
 * route is rendered inside the parent's `<Outlet>`.
 */
export const BasicNestedRouteExample: FC = (): ReactElement => {
  return (
    <div>
      <h3>Account layout</h3>
      <p>The child route is rendered below inside the Outlet.</p>
      <Outlet />
    </div>
  );
};

/**
 * Demonstrates an index route inside a parent route.
 *
 * An index route renders at the parent's URL without adding another path segment.
 * For an `/account` parent, the index route renders at `/account`.
 */
export const IndexNestedRouteExample: FC = (): ReactElement => {
  return (
    <div>
      <p>Account overview</p>
      <nav aria-label="Account navigation">
        <Link to="profile">Profile</Link>
        {" | "}
        <Link to="settings">Settings</Link>
      </nav>
      <Outlet />
    </div>
  );
};

/**
 * Demonstrates relative child route paths.
 *
 * The child paths `profile` and `settings` are resolved relative to the parent
 * route rather than requiring the complete `/account/...` URL.
 */
export const RelativeNestedPathExample: FC = (): ReactElement => {
  return (
    <div>
      <h3>Account navigation</h3>
      <nav aria-label="Nested account routes">
        <Link to="profile">Profile</Link>
        {" | "}
        <Link to="settings">Settings</Link>
      </nav>
      <Outlet />
    </div>
  );
};

/**
 * Demonstrates a nested route with a dynamic parent parameter.
 *
 * The `accountId` parameter belongs to the parent route and remains available
 * to components rendered by its nested child routes.
 */
export const ParentParameterExample: FC = (): ReactElement => {
  const { accountId } = useParams<keyof AccountRouteParams>();

  return (
    <div>
      <p>Account ID: {accountId}</p>
      <Outlet />
    </div>
  );
};

/**
 * Demonstrates a child route reading a parameter defined by its parent.
 *
 * The child does not need to redeclare `:accountId` in its own path.
 */
export const ChildReadsParentParameterExample: FC = (): ReactElement => {
  const { accountId } = useParams<keyof AccountRouteParams>();

  return (
    <div>
      <p>Profile belongs to account: {accountId}</p>
    </div>
  );
};

/**
 * Demonstrates a nested route hierarchy with multiple levels.
 *
 * Each level can provide its own layout and outlet, allowing the interface
 * structure to follow the route hierarchy.
 */
export const MultiLevelNestedRouteExample: FC = (): ReactElement => {
  return (
    <div>
      <h3>Account section</h3>
      <Outlet />
    </div>
  );
};

/**
 * Demonstrates that a parent route remains rendered while a child route changes.
 *
 * The parent layout stays mounted while the router changes which element is
 * rendered through its outlet.
 */
export const PersistentParentLayoutExample: FC = (): ReactElement => {
  return (
    <div>
      <aside>
        <strong>Account sidebar</strong>
        <nav aria-label="Persistent account navigation">
          <Link to="profile">Profile</Link>
          {" | "}
          <Link to="settings">Settings</Link>
        </nav>
      </aside>
      <section>
        <Outlet />
      </section>
    </div>
  );
};

/**
 * Demonstrates a common misconception about nested routes.
 *
 * Declaring child routes does not automatically render them inside the parent.
 * The parent route must render an `<Outlet>` at the location where child content
 * should appear.
 */
export const NestedRouteRequiresOutletExample: FC = (): ReactElement => {
  return (
    <div>
      <p>A parent route needs an Outlet for its matched child route to render.</p>
      <Outlet />
    </div>
  );
};

/**
 * Demonstrates navigation from a child route back to its parent.
 *
 * The `..` destination is resolved relative to the current route hierarchy,
 * making it useful for navigating upward within nested routes.
 */
export const ParentNavigationExample: FC = (): ReactElement => {
  return (
    <div>
      <p>Profile content</p>
      <Link to="..">Back to account</Link>
    </div>
  );
};

/**
 * Demonstrates nested route links that remain relative to their parent.
 *
 * Relative links avoid duplicating the parent pathname and remain easier to
 * maintain when the parent route structure changes.
 */
export const RelativeChildNavigationExample: FC = (): ReactElement => {
  return (
    <nav aria-label="Nested navigation">
      <Link to="profile">Profile</Link>
      {" | "}
      <Link to="settings">Settings</Link>
    </nav>
  );
};

/**
 * Demonstrates the distinction between nested routes and merely similar URLs.
 *
 * Two paths can look hierarchical without being configured as parent and child
 * routes. Actual nesting is created by placing child route definitions inside
 * a parent route's `children` configuration or nested `<Route>` elements.
 */
export const NestedConfigurationExample: FC = (): ReactElement => {
  return (
    <div>
      <p>URL structure alone does not create route nesting.</p>
      <p>The route definitions must establish the parent-child relationship.</p>
    </div>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const HomePage: FC = (): ReactElement => {
  return (
    <main>
      <h2>Nested Routes</h2>
      <p>Select a nested route demonstration.</p>

      <nav aria-label="Nested route examples">
        <ul>
          <li>
            <Link to="/account">Basic nested route</Link>
          </li>
          <li>
            <Link to="/account-overview">Index route</Link>
          </li>
          <li>
            <Link to="/account-navigation">Relative child paths</Link>
          </li>
          <li>
            <Link to="/accounts/42">Parent parameter</Link>
          </li>
          <li>
            <Link to="/accounts/42/profile">Child reads parent parameter</Link>
          </li>
          <li>
            <Link to="/account-levels">Multiple nested levels</Link>
          </li>
          <li>
            <Link to="/persistent-account">Persistent parent layout</Link>
          </li>
          <li>
            <Link to="/outlet-example">Outlet requirement</Link>
          </li>
          <li>
            <Link to="/parent-navigation/profile">Navigate to parent</Link>
          </li>
          <li>
            <Link to="/relative-navigation">Relative child navigation</Link>
          </li>
          <li>
            <Link to="/configuration">Nested configuration</Link>
          </li>
        </ul>
      </nav>
    </main>
  );
};

const AccountOverviewPage: FC = (): ReactElement => {
  return (
    <main>
      <h2>Account overview</h2>
      <p>This is the index route rendered at the parent URL.</p>
      <nav aria-label="Account overview navigation">
        <Link to="profile">Profile</Link>
        {" | "}
        <Link to="settings">Settings</Link>
      </nav>
      <Outlet />
    </main>
  );
};

const ProfilePage: FC = (): ReactElement => {
  return (
    <div>
      <h3>Profile</h3>
      <p>Profile content is rendered inside the parent outlet.</p>
    </div>
  );
};

const SettingsPage: FC = (): ReactElement => {
  return (
    <div>
      <h3>Settings</h3>
      <p>Settings content is rendered inside the parent outlet.</p>
    </div>
  );
};

const AccountNavigationPage: FC = (): ReactElement => {
  return (
    <main>
      <h2>Account navigation</h2>
      <RelativeChildNavigationExample />
      <Outlet />
    </main>
  );
};

const AccountParameterLayout: FC = (): ReactElement => {
  return (
    <main>
      <h2>Account</h2>
      <ParentParameterExample />
    </main>
  );
};

const AccountProfilePage: FC = (): ReactElement => {
  return (
    <div>
      <h3>Profile</h3>
      <ChildReadsParentParameterExample />
    </div>
  );
};

const AccountLevelsPage: FC = (): ReactElement => {
  return (
    <main>
      <h2>Account levels</h2>
      <MultiLevelNestedRouteExample />
    </main>
  );
};

const AccountDetailsLayout: FC = (): ReactElement => {
  return (
    <div>
      <h3>Account details</h3>
      <Outlet />
    </div>
  );
};

const PersistentAccountLayout: FC = (): ReactElement => {
  return (
    <main>
      <h2>Persistent account layout</h2>
      <PersistentParentLayoutExample />
    </main>
  );
};

const OutletExamplePage: FC = (): ReactElement => {
  return (
    <main>
      <h2>Outlet example</h2>
      <NestedRouteRequiresOutletExample />
    </main>
  );
};

const ParentNavigationPage: FC = (): ReactElement => {
  return (
    <main>
      <h2>Parent navigation</h2>
      <Outlet />
    </main>
  );
};

const RelativeNavigationPage: FC = (): ReactElement => {
  return (
    <main>
      <h2>Relative navigation</h2>
      <RelativeChildNavigationExample />
      <Outlet />
    </main>
  );
};

const ConfigurationPage: FC = (): ReactElement => {
  return (
    <main>
      <h2>Nested configuration</h2>
      <NestedConfigurationExample />
    </main>
  );
};

const NestedRoutesDemo: FC = (): ReactElement => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />

        <Route path="/account" element={<BasicNestedRouteExample />}>
          <Route index element={<ProfilePage />} />
        </Route>

        <Route path="/account-overview" element={<AccountOverviewPage />}>
          <Route index element={<ProfilePage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        <Route path="/account-navigation" element={<RelativeNestedPathExample />}>
          <Route path="profile" element={<ProfilePage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        <Route path="/accounts/:accountId" element={<AccountParameterLayout />}>
          <Route path="profile" element={<AccountProfilePage />} />
        </Route>

        <Route path="/account-levels" element={<AccountLevelsPage />}>
          <Route path="details" element={<AccountDetailsLayout />}>
            <Route path="profile" element={<ProfilePage />} />
          </Route>
        </Route>

        <Route path="/persistent-account" element={<PersistentAccountLayout />}>
          <Route path="profile" element={<ProfilePage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        <Route path="/outlet-example" element={<OutletExamplePage />}>
          <Route path="child" element={<ProfilePage />} />
        </Route>

        <Route path="/parent-navigation" element={<ParentNavigationPage />}>
          <Route path="profile" element={<ParentNavigationExample />} />
        </Route>

        <Route path="/relative-navigation" element={<RelativeNavigationPage />}>
          <Route path="profile" element={<ProfilePage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        <Route path="/configuration" element={<ConfigurationPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default NestedRoutesDemo;

// ---------------------------------------------------------------------
// Summary
// Nested routes establish a parent-child relationship between route definitions.
// Child paths are normally relative to their parent route.
// The parent route renders an Outlet where matched child content appears.
// Index routes render at the parent URL without adding another path segment.
// Parent layouts remain rendered while their child route changes.
// Child routes can access parameters defined by matched parent routes.
// Relative links can navigate within a nested route hierarchy without repeating parent paths.
// The `..` destination can navigate upward through the route hierarchy.
// URL structure alone does not create nested routes; the route configuration establishes the hierarchy.
// A parent route must render an Outlet for its matched child route to appear.
// ---------------------------------------------------------------------
