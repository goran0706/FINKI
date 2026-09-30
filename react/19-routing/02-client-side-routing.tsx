/**
 * Client-Side Routing
 * ===================
 *
 * Client-side routing allows a web application to change the rendered React UI in response to
 * URL changes without requesting a completely new HTML document from the server for every route.
 * A client-side router observes navigation, matches the new location against configured routes,
 * and updates the relevant portion of the React component tree.
 *
 * The browser still maintains a real URL and continues to support navigation history, bookmarks,
 * refreshes, and direct URL entry. The difference is that navigation between application routes
 * can be handled by JavaScript and React after the application has loaded, rather than requiring
 * a full document navigation for each internal route transition.
 *
 * Client-side routing therefore separates document loading from application navigation. The
 * initial application document may be loaded from the server, while subsequent route changes
 * can be handled inside the already-running React application.
 */

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import type { FC, ReactElement } from "react";

export interface PageProps {
  readonly title: string;
  readonly description: string;
}

export interface NavigationExampleProps {
  readonly title: string;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

export const HomePage: FC<PageProps> = ({ title, description }: PageProps): ReactElement => {
  return (
    <article>
      <h3>{title}</h3>
      <p>{description}</p>
    </article>
  );
};

export const ProductsPage: FC<PageProps> = ({ title, description }: PageProps): ReactElement => {
  return (
    <article>
      <h3>{title}</h3>
      <p>{description}</p>
    </article>
  );
};

export const ProfilePage: FC<PageProps> = ({ title, description }: PageProps): ReactElement => {
  return (
    <article>
      <h3>{title}</h3>
      <p>{description}</p>
    </article>
  );
};

export const ClientSideNavigation: FC = (): ReactElement => {
  return (
    <nav aria-label="Application navigation">
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/products">Products</Link>
        </li>
        <li>
          <Link to="/profile">Profile</Link>
        </li>
      </ul>
    </nav>
  );
};

export const ClientSideRouteExample: FC = (): ReactElement => {
  return (
    <Routes>
      <Route path="/" element={<HomePage title="Home" description="The home view is rendered for the root URL." />} />
      <Route
        path="/products"
        element={
          <ProductsPage title="Products" description="The products view is rendered when the URL matches /products." />
        }
      />
      <Route
        path="/profile"
        element={
          <ProfilePage title="Profile" description="The profile view is rendered when the URL matches /profile." />
        }
      />
    </Routes>
  );
};

export const ClientSideNavigationExample: FC<NavigationExampleProps> = ({
  title,
}: NavigationExampleProps): ReactElement => {
  return (
    <article>
      <h3>{title}</h3>
      <p>
        Clicking a React Router Link changes the application location and allows the router to render the matching route
        without performing a traditional full-page document navigation.
      </p>
      <ClientSideNavigation />
    </article>
  );
};

export const BrowserNavigationExample: FC<NavigationExampleProps> = ({
  title,
}: NavigationExampleProps): ReactElement => {
  return (
    <article>
      <h3>{title}</h3>
      <p>
        Client-side routing does not remove browser history. The browser can still move backward and forward between
        locations created during navigation.
      </p>
      <p>
        The application must also be configured on the server so direct requests to application routes can return the
        application's entry document.
      </p>
    </article>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const ClientSideRoutingDemo: FC = (): ReactElement => {
  return (
    <BrowserRouter>
      <main>
        <h2>1. Client-Side Navigation Uses Application Routing</h2>
        <ClientSideNavigationExample title="Client-Side Navigation" />

        <h2>2. The Router Renders the Matching Route</h2>
        <ClientSideRouteExample />

        <h2>3. Browser History Still Works With Client-Side Routing</h2>
        <BrowserNavigationExample title="Browser History" />
      </main>
    </BrowserRouter>
  );
};

export default ClientSideRoutingDemo;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// Client-side routing handles internal application navigation in the already-running application.
// A client-side router observes location changes and renders the route that matches the current URL.
// React Router Link enables navigation without a traditional full-page document request.
// Browser history remains available, so users can use back and forward navigation normally.
// Client-side routing does not eliminate the need for server configuration for directly requested routes.
// The server must be able to return the application entry document when a user loads an application route directly.
// Client-side routing separates subsequent application navigation from full document navigation.
