/**
 * Navigation
 * ==========
 *
 * Navigation changes the current application location so that a different route can be rendered.
 * In React Router, navigation can be declarative through Link components or programmatic through
 * navigation APIs such as useNavigate.
 *
 * Declarative navigation describes where a user should go through rendered links. Programmatic
 * navigation is useful when navigation is a consequence of application logic, such as completing
 * a form submission or responding to an interaction that is not itself a link.
 *
 * React Router navigation updates the browser location and history while allowing the router to
 * coordinate the corresponding React UI. Internal application navigation should generally use
 * router navigation mechanisms instead of manually changing window.location.
 */

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

import { BrowserRouter, Link, Route, Routes, useLocation } from "react-router-dom";
import type { FC, ReactElement } from "react";

export interface NavigationPageProps {
  readonly title: string;
  readonly description: string;
}

export interface NavigationExampleProps {
  readonly title: string;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

export const NavigationHomePage: FC<NavigationPageProps> = ({
  title,
  description,
}: NavigationPageProps): ReactElement => {
  return (
    <article>
      <h3>{title}</h3>
      <p>{description}</p>
    </article>
  );
};

export const NavigationProductsPage: FC<NavigationPageProps> = ({
  title,
  description,
}: NavigationPageProps): ReactElement => {
  return (
    <article>
      <h3>{title}</h3>
      <p>{description}</p>
    </article>
  );
};

export const DeclarativeNavigationExample: FC<NavigationExampleProps> = ({
  title,
}: NavigationExampleProps): ReactElement => {
  return (
    <article>
      <h3>{title}</h3>
      <nav aria-label="Declarative navigation">
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/products">Products</Link>
          </li>
        </ul>
      </nav>
      <p>Link declares the destination directly in the rendered UI.</p>
    </article>
  );
};

export const RelativeNavigationExample: FC<NavigationExampleProps> = ({
  title,
}: NavigationExampleProps): ReactElement => {
  return (
    <article>
      <h3>{title}</h3>
      <nav aria-label="Navigation destinations">
        <ul>
          <li>
            <Link to="/products">Products</Link>
          </li>
          <li>
            <Link to="/products/details">Product Details</Link>
          </li>
        </ul>
      </nav>
      <p>
        A Link destination can represent an absolute application path or a route-relative destination when used inside a
        nested route hierarchy.
      </p>
    </article>
  );
};

export const NavigationLocationExample: FC<NavigationExampleProps> = ({
  title,
}: NavigationExampleProps): ReactElement => {
  const location = useLocation();

  return (
    <article>
      <h3>{title}</h3>
      <p>Current pathname: {location.pathname}</p>
      <p>
        useLocation provides information about the current router location so components can react to navigation
        changes.
      </p>
    </article>
  );
};

export const NavigationHistoryExample: FC<NavigationExampleProps> = ({
  title,
}: NavigationExampleProps): ReactElement => {
  return (
    <article>
      <h3>{title}</h3>
      <p>
        Navigation through React Router participates in browser history, so users can normally move between visited
        locations with the Back and Forward controls.
      </p>
      <nav aria-label="History navigation">
        <Link to="/">Return Home</Link>
      </nav>
    </article>
  );
};

export const NavigationMisconceptionExample: FC<NavigationExampleProps> = ({
  title,
}: NavigationExampleProps): ReactElement => {
  return (
    <article>
      <h3>{title}</h3>
      <p>
        Internal application navigation should not normally use window.location.href because that performs a document
        navigation rather than using the router's navigation model.
      </p>
      <p>Router navigation keeps route changes inside the client-side routing system.</p>
    </article>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const NavigationDemo: FC = (): ReactElement => {
  return (
    <BrowserRouter>
      <main>
        <h2>1. Link Provides Declarative Navigation</h2>
        <DeclarativeNavigationExample title="Declarative Navigation" />

        <h2>2. Navigation Can Target Different Application Paths</h2>
        <RelativeNavigationExample title="Navigation Destinations" />

        <h2>3. Components Can Observe the Current Location</h2>
        <NavigationLocationExample title="Current Location" />

        <h2>4. Router Navigation Participates in Browser History</h2>
        <NavigationHistoryExample title="Navigation History" />

        <h2>5. Internal Navigation Should Use the Router</h2>
        <NavigationMisconceptionExample title="Router Navigation" />

        <Routes>
          <Route
            path="/"
            element={<NavigationHomePage title="Home" description="The home route is rendered at the root location." />}
          />
          <Route
            path="/products"
            element={
              <NavigationProductsPage title="Products" description="The products route is rendered at /products." />
            }
          />
          <Route
            path="/products/details"
            element={
              <NavigationProductsPage
                title="Product Details"
                description="The product details route is rendered at /products/details."
              />
            }
          />
        </Routes>
      </main>
    </BrowserRouter>
  );
};

export default NavigationDemo;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// Navigation changes the current application location so the router can render another route.
// Link provides declarative navigation by associating rendered UI with a destination.
// useLocation exposes the current location to components inside the router.
// Router navigation participates in the browser's session history.
// Internal application navigation should generally use React Router rather than window.location.
// Navigation and route rendering are coordinated by the router.
// Programmatic navigation is useful when navigation follows application logic rather than direct link activation.
