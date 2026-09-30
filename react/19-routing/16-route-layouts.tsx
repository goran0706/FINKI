/**
 * Route Layouts
 * =============
 *
 * A route layout is a parent route element that provides persistent UI around
 * its matched child routes. The layout typically contains shared navigation,
 * headers, sidebars, or other structural elements and renders the active child
 * route through an `Outlet`.
 *
 * Route layouts allow multiple pages to share the same component structure
 * without duplicating that structure in every page component. The layout remains
 * mounted while navigation occurs between its nested child routes.
 *
 * Layout routes can also be pathless. A pathless layout participates in the route
 * hierarchy without adding a URL segment, which is useful when several routes
 * should share UI or behavior without introducing another path level.
 */

import { type FC, type ReactElement } from "react";
import { BrowserRouter, Link, Outlet, Route, Routes } from "react-router-dom";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface RouteLayoutNavigationProps {
  readonly label: string;
  readonly destination: string;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * Demonstrates a basic route layout.
 *
 * The parent layout provides shared navigation and uses `Outlet` as the
 * rendering location for its nested child routes.
 */
export const BasicRouteLayoutExample: FC = (): ReactElement => {
  return (
    <div>
      <header>
        <h3>Application dashboard</h3>
        <nav aria-label="Dashboard navigation">
          <Link to="overview">Overview</Link>
          {" | "}
          <Link to="activity">Activity</Link>
          {" | "}
          <Link to="settings">Settings</Link>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
};

/**
 * Demonstrates a route layout with persistent structural UI.
 *
 * The sidebar and header belong to the parent route, so they remain part of
 * the rendered route branch while the child route changes.
 */
export const PersistentRouteLayoutExample: FC = (): ReactElement => {
  return (
    <div>
      <header>
        <h3>Account</h3>
      </header>
      <div>
        <aside>
          <nav aria-label="Account navigation">
            <Link to="profile">Profile</Link>
            {" | "}
            <Link to="security">Security</Link>
          </nav>
        </aside>
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

/**
 * Demonstrates a layout with an index route.
 *
 * The layout itself matches the parent URL while the index route supplies
 * the default child content through the outlet.
 */
export const LayoutWithIndexRouteExample: FC = (): ReactElement => {
  return (
    <div>
      <h3>Settings</h3>
      <nav aria-label="Settings navigation">
        <Link to=".">General</Link>
        {" | "}
        <Link to="notifications">Notifications</Link>
      </nav>
      <Outlet />
    </div>
  );
};

/**
 * Demonstrates a pathless route layout.
 *
 * A pathless route does not contribute a URL segment, but its element can
 * still provide shared UI around multiple nested routes.
 */
export const PathlessRouteLayoutExample: FC = (): ReactElement => {
  return (
    <div>
      <header>
        <strong>Shared application header</strong>
      </header>
      <Outlet />
    </div>
  );
};

/**
 * Demonstrates a layout nested inside another layout.
 *
 * Each matched layout contributes its own structural layer and outlet to
 * the final rendered component tree.
 */
export const NestedRouteLayoutExample: FC = (): ReactElement => {
  return (
    <section>
      <h3>Projects section</h3>
      <nav aria-label="Projects navigation">
        <Link to="list">Projects</Link>
        {" | "}
        <Link to="archive">Archive</Link>
      </nav>
      <Outlet />
    </section>
  );
};

/**
 * Demonstrates a layout that preserves shared navigation while its child
 * route changes.
 *
 * The navigation belongs to the parent layout rather than the individual
 * child pages.
 */
export const SharedNavigationLayoutExample: FC = (): ReactElement => {
  return (
    <div>
      <nav aria-label="Product navigation">
        <Link to="details">Details</Link>
        {" | "}
        <Link to="reviews">Reviews</Link>
        {" | "}
        <Link to="specifications">Specifications</Link>
      </nav>
      <Outlet />
    </div>
  );
};

/**
 * Demonstrates a route layout that does not represent a separate page.
 *
 * The layout is structural UI rather than page content. Its nested routes
 * provide the actual page-level content.
 */
export const StructuralRouteLayoutExample: FC = (): ReactElement => {
  return (
    <div>
      <header>
        <h3>Customer area</h3>
      </header>
      <Outlet />
    </div>
  );
};

/**
 * Demonstrates a common misconception about route layouts.
 *
 * A route layout does not require every child page to manually render the
 * layout. The nested route hierarchy allows the parent layout to wrap them.
 */
export const LayoutAvoidsDuplicationExample: FC = (): ReactElement => {
  return (
    <div>
      <p>The parent route owns the shared structure.</p>
      <Outlet />
    </div>
  );
};

/**
 * Demonstrates that a route layout depends on nested route configuration.
 *
 * Rendering an `Outlet` alone does not make a component a route layout.
 * A child route must actually be nested under the route that renders the layout.
 */
export const LayoutRequiresNestedRoutesExample: FC = (): ReactElement => {
  return (
    <div>
      <p>This layout provides an outlet for a matched child route.</p>
      <Outlet />
    </div>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const DashboardOverviewPage: FC = (): ReactElement => {
  return (
    <div>
      <h4>Overview</h4>
      <p>Overview is rendered inside the dashboard layout.</p>
    </div>
  );
};

const DashboardActivityPage: FC = (): ReactElement => {
  return (
    <div>
      <h4>Activity</h4>
      <p>Activity shares the same dashboard layout.</p>
    </div>
  );
};

const DashboardSettingsPage: FC = (): ReactElement => {
  return (
    <div>
      <h4>Settings</h4>
      <p>Settings shares the same dashboard layout.</p>
    </div>
  );
};

const AccountProfilePage: FC = (): ReactElement => {
  return (
    <div>
      <h4>Profile</h4>
      <p>Profile is rendered inside the persistent account layout.</p>
    </div>
  );
};

const AccountSecurityPage: FC = (): ReactElement => {
  return (
    <div>
      <h4>Security</h4>
      <p>Security is rendered inside the same account layout.</p>
    </div>
  );
};

const SettingsGeneralPage: FC = (): ReactElement => {
  return (
    <div>
      <h4>General settings</h4>
      <p>This index route provides the default settings content.</p>
    </div>
  );
};

const SettingsNotificationsPage: FC = (): ReactElement => {
  return (
    <div>
      <h4>Notifications</h4>
      <p>Notification settings are rendered through the same layout.</p>
    </div>
  );
};

const ProjectsListPage: FC = (): ReactElement => {
  return (
    <div>
      <h4>Projects</h4>
      <p>The project list is rendered inside the nested project layout.</p>
    </div>
  );
};

const ProjectsArchivePage: FC = (): ReactElement => {
  return (
    <div>
      <h4>Archive</h4>
      <p>Archived projects are rendered through the same nested layout.</p>
    </div>
  );
};

const SharedHomePage: FC = (): ReactElement => {
  return (
    <main>
      <h4>Home</h4>
      <p>This page receives the shared pathless layout.</p>
    </main>
  );
};

const SharedAboutPage: FC = (): ReactElement => {
  return (
    <main>
      <h4>About</h4>
      <p>This page receives the same pathless layout.</p>
    </main>
  );
};

const ProductDetailsPage: FC = (): ReactElement => {
  return (
    <div>
      <h4>Product details</h4>
      <p>Product details are rendered inside the shared product navigation.</p>
    </div>
  );
};

const ProductReviewsPage: FC = (): ReactElement => {
  return (
    <div>
      <h4>Product reviews</h4>
      <p>Reviews use the same parent navigation.</p>
    </div>
  );
};

const ProductSpecificationsPage: FC = (): ReactElement => {
  return (
    <div>
      <h4>Product specifications</h4>
      <p>Specifications use the same parent navigation.</p>
    </div>
  );
};

const CustomerOverviewPage: FC = (): ReactElement => {
  return (
    <div>
      <h4>Customer overview</h4>
      <p>Customer content is rendered inside the structural layout.</p>
    </div>
  );
};

const CustomerOrdersPage: FC = (): ReactElement => {
  return (
    <div>
      <h4>Customer orders</h4>
      <p>Orders share the same customer layout.</p>
    </div>
  );
};

const LayoutHomePage: FC = (): ReactElement => {
  return (
    <main>
      <h2>Route Layouts</h2>
      <p>Select an example to inspect persistent route structure and nested layouts.</p>

      <nav aria-label="Route layout examples">
        <ul>
          <li>
            <Link to="/dashboard/overview">Basic route layout</Link>
          </li>
          <li>
            <Link to="/account/profile">Persistent layout</Link>
          </li>
          <li>
            <Link to="/settings">Layout with index route</Link>
          </li>
          <li>
            <Link to="/pathless/about">Pathless layout</Link>
          </li>
          <li>
            <Link to="/projects/list">Nested layouts</Link>
          </li>
          <li>
            <Link to="/product/details">Shared navigation</Link>
          </li>
          <li>
            <Link to="/customer/orders">Structural layout</Link>
          </li>
        </ul>
      </nav>
    </main>
  );
};

const RouteLayoutsDemo: FC = (): ReactElement => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LayoutHomePage />} />

        <Route path="/dashboard" element={<BasicRouteLayoutExample />}>
          <Route path="overview" element={<DashboardOverviewPage />} />
          <Route path="activity" element={<DashboardActivityPage />} />
          <Route path="settings" element={<DashboardSettingsPage />} />
        </Route>

        <Route path="/account" element={<PersistentRouteLayoutExample />}>
          <Route path="profile" element={<AccountProfilePage />} />
          <Route path="security" element={<AccountSecurityPage />} />
        </Route>

        <Route path="/settings" element={<LayoutWithIndexRouteExample />}>
          <Route index element={<SettingsGeneralPage />} />
          <Route path="notifications" element={<SettingsNotificationsPage />} />
        </Route>

        <Route element={<PathlessRouteLayoutExample />}>
          <Route path="/pathless/home" element={<SharedHomePage />} />
          <Route path="/pathless/about" element={<SharedAboutPage />} />
        </Route>

        <Route path="/projects" element={<BasicRouteLayoutExample />}>
          <Route element={<NestedRouteLayoutExample />}>
            <Route path="list" element={<ProjectsListPage />} />
            <Route path="archive" element={<ProjectsArchivePage />} />
          </Route>
        </Route>

        <Route path="/product" element={<SharedNavigationLayoutExample />}>
          <Route path="details" element={<ProductDetailsPage />} />
          <Route path="reviews" element={<ProductReviewsPage />} />
          <Route path="specifications" element={<ProductSpecificationsPage />} />
        </Route>

        <Route path="/customer" element={<StructuralRouteLayoutExample />}>
          <Route path="overview" element={<CustomerOverviewPage />} />
          <Route path="orders" element={<CustomerOrdersPage />} />
        </Route>

        <Route path="/duplication" element={<LayoutAvoidsDuplicationExample />}>
          <Route index element={<CustomerOverviewPage />} />
        </Route>

        <Route path="/nested-required" element={<LayoutRequiresNestedRoutesExample />}>
          <Route index element={<CustomerOverviewPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default RouteLayoutsDemo;

// ---------------------------------------------------------------------
// Summary
// Route layouts are parent route elements that provide shared structure around child routes.
// Layouts commonly contain navigation, headers, sidebars, and other persistent UI.
// `Outlet` is the rendering location for the currently matched child route.
// Layouts prevent shared UI from being duplicated across individual pages.
// A layout can contain an index route as its default child.
// Pathless layouts share UI without adding a URL segment.
// Layouts can be nested so multiple route levels contribute persistent structure.
// A route layout depends on nested route configuration; an `Outlet` alone does not create child routes.
// ---------------------------------------------------------------------
