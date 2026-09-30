/**
 * Routes
 * ======
 *
 * A route associates a URL path pattern with the React element that should be rendered when the
 * current location matches that pattern. In React Router, Routes provides the route-matching
 * context and Route declares individual path-to-element relationships.
 *
 * A Route does not render simply because it is declared. React Router evaluates the current
 * location against the configured route paths and renders the element belonging to the matching
 * route. Routes can also contain nested Route definitions, allowing larger applications to
 * organize related URL structures hierarchically.
 *
 * Route paths can represent exact static locations such as "/about" or dynamic locations such as
 * "/users/:userId". A route configuration therefore describes the URL structure of an application
 * separately from the components that implement each view.
 */

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

import { BrowserRouter, Route, Routes } from "react-router-dom";
import type { FC, ReactElement } from "react";

export interface RoutePageProps {
  readonly title: string;
  readonly description: string;
}

export interface RouteExampleProps {
  readonly title: string;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

export const HomeRoutePage: FC<RoutePageProps> = ({ title, description }: RoutePageProps): ReactElement => {
  return (
    <article>
      <h3>{title}</h3>
      <p>{description}</p>
    </article>
  );
};

export const AboutRoutePage: FC<RoutePageProps> = ({ title, description }: RoutePageProps): ReactElement => {
  return (
    <article>
      <h3>{title}</h3>
      <p>{description}</p>
    </article>
  );
};

export const ContactRoutePage: FC<RoutePageProps> = ({ title, description }: RoutePageProps): ReactElement => {
  return (
    <article>
      <h3>{title}</h3>
      <p>{description}</p>
    </article>
  );
};

export const StaticRoutesExample: FC<RouteExampleProps> = ({ title }: RouteExampleProps): ReactElement => {
  return (
    <article>
      <h3>{title}</h3>
      <Routes>
        <Route
          path="/"
          element={
            <HomeRoutePage
              title="Home"
              description="This element renders when the current location matches the root route."
            />
          }
        />
        <Route
          path="/about"
          element={
            <AboutRoutePage
              title="About"
              description="This element renders when the current location matches /about."
            />
          }
        />
        <Route
          path="/contact"
          element={
            <ContactRoutePage
              title="Contact"
              description="This element renders when the current location matches /contact."
            />
          }
        />
      </Routes>
    </article>
  );
};

export const RouteElementExample: FC<RouteExampleProps> = ({ title }: RouteExampleProps): ReactElement => {
  return (
    <article>
      <h3>{title}</h3>
      <Routes>
        <Route
          path="/example"
          element={
            <HomeRoutePage
              title="Example Route"
              description="The element prop identifies the React element rendered for a matching route."
            />
          }
        />
      </Routes>
    </article>
  );
};

export const RouteMatchingExample: FC<RouteExampleProps> = ({ title }: RouteExampleProps): ReactElement => {
  return (
    <article>
      <h3>{title}</h3>
      <Routes>
        <Route
          path="/products"
          element={<HomeRoutePage title="Products" description="This route matches the /products location." />}
        />
        <Route
          path="/products/details"
          element={
            <AboutRoutePage
              title="Product Details"
              description="This route matches the more specific /products/details location."
            />
          }
        />
      </Routes>
    </article>
  );
};

export const RouteConfigurationExample: FC<RouteExampleProps> = ({ title }: RouteExampleProps): ReactElement => {
  return (
    <article>
      <h3>{title}</h3>
      <p>A route configuration describes URL patterns and the UI associated with those patterns.</p>
      <p>
        The route path is declarative: React Router uses it to determine whether the route matches the current location.
      </p>
    </article>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const RoutesDemo: FC = (): ReactElement => {
  return (
    <BrowserRouter>
      <main>
        <h2>1. Routes Associate Paths With React Elements</h2>
        <StaticRoutesExample title="Static Route Definitions" />

        <h2>2. The Route element Defines Matching UI</h2>
        <RouteElementExample title="Route Element" />

        <h2>3. React Router Matches the Current Location</h2>
        <RouteMatchingExample title="Route Matching" />

        <h2>4. Route Configuration Describes Application URLs</h2>
        <RouteConfigurationExample title="Route Configuration" />
      </main>
    </BrowserRouter>
  );
};

export default RoutesDemo;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// A Route associates a URL path pattern with a React element.
// Routes provides the route-matching context for its Route descendants.
// The element prop specifies the React element rendered for a matching route.
// React Router evaluates route paths against the current location.
// Static route paths represent fixed URL locations such as /about or /contact.
// Route configuration provides a declarative description of the application's URL structure.
// More advanced route definitions can introduce dynamic segments and nested route hierarchies.
