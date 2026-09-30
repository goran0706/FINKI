/**
 * Routing Fundamentals
 * =====================
 *
 * Routing determines which UI a React application renders for a particular URL. A router
 * interprets the current location, matches it against application routes, and renders the
 * corresponding route component without requiring the browser to perform a traditional
 * full-page navigation for every route change.
 *
 * In a client-side React application, routing connects URL state with rendered UI. The URL
 * becomes an addressable representation of application state, allowing users to navigate with
 * browser controls, links, bookmarks, and direct URL entry while the application determines
 * which view should be displayed.
 *
 * Routing is distinct from rendering alone. A React component can render different content based
 * on application state, but routing establishes a structured relationship between URL locations
 * and application views. React Router is a commonly used library for providing this routing model.
 */

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import type { FC, ReactElement } from "react";

export interface RoutePageProps {
  readonly title: string;
  readonly description: string;
}

export interface RoutingExampleProps {
  readonly title: string;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

export const HomePage: FC<RoutePageProps> = ({ title, description }: RoutePageProps): ReactElement => {
  return (
    <article>
      <h3>{title}</h3>
      <p>{description}</p>
    </article>
  );
};

export const AboutPage: FC<RoutePageProps> = ({ title, description }: RoutePageProps): ReactElement => {
  return (
    <article>
      <h3>{title}</h3>
      <p>{description}</p>
    </article>
  );
};

export const ContactPage: FC<RoutePageProps> = ({ title, description }: RoutePageProps): ReactElement => {
  return (
    <article>
      <h3>{title}</h3>
      <p>{description}</p>
    </article>
  );
};

export const RoutingNavigation: FC = (): ReactElement => {
  return (
    <nav aria-label="Primary navigation">
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/about">About</Link>
        </li>
        <li>
          <Link to="/contact">Contact</Link>
        </li>
      </ul>
    </nav>
  );
};

export const RouteMatchingExample: FC = (): ReactElement => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <HomePage title="Home" description="This UI is rendered when the current URL matches the root route." />
        }
      />
      <Route
        path="/about"
        element={
          <AboutPage title="About" description="This UI is rendered when the current URL matches the about route." />
        }
      />
      <Route
        path="/contact"
        element={
          <ContactPage
            title="Contact"
            description="This UI is rendered when the current URL matches the contact route."
          />
        }
      />
    </Routes>
  );
};

export const RoutingConceptExample: FC<RoutingExampleProps> = ({ title }: RoutingExampleProps): ReactElement => {
  return (
    <article>
      <h3>{title}</h3>
      <p>
        The URL identifies a location, the router matches that location against configured routes, and the matching
        route determines which React element is rendered.
      </p>
    </article>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const RoutingDemo: FC = (): ReactElement => {
  return (
    <BrowserRouter>
      <main>
        <h2>1. Routing Connects URLs With React UI</h2>
        <RoutingConceptExample title="Routing Model" />

        <h2>2. Navigation Changes the Current Route</h2>
        <RoutingNavigation />

        <h2>3. Routes Determine Which UI Is Rendered</h2>
        <RouteMatchingExample />
      </main>
    </BrowserRouter>
  );
};

export default RoutingDemo;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// Routing establishes a relationship between URL locations and rendered React UI.
// A router observes the current location and determines which configured route matches it.
// A route associates a URL pattern with the React element that should be rendered for that match.
// Links provide declarative navigation between application routes.
// Client-side routing can change the rendered view without requiring a traditional full-page document navigation.
// BrowserRouter uses the browser's history and URL mechanisms for client-side routing.
// Routing is the foundation for features such as route parameters, nested routes, layouts, loaders, and navigation.
