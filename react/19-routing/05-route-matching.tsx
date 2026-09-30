/**
 * Route Matching
 * ===============
 *
 * Route matching is the process React Router uses to compare the current URL location with the
 * path patterns declared in Route components. When multiple routes could potentially match,
 * React Router ranks the available route branches and selects the most appropriate match.
 *
 * Static paths match fixed URL segments, dynamic segments match variable values, and splat
 * segments can match the remainder of a URL. Route matching is independent of rendering: the
 * router first determines which route matches the current location, then renders the element
 * associated with that match.
 *
 * Route paths are matched against URL pathname segments rather than arbitrary strings. A route
 * such as "/products" therefore matches the products location while a dynamic route such as
 * "/products/:productId" can match multiple product-specific locations.
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

export interface RouteMatchingExampleProps {
  readonly title: string;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

export const StaticMatchExample: FC<RoutePageProps> = ({ title, description }: RoutePageProps): ReactElement => {
  return (
    <article>
      <h3>{title}</h3>
      <p>{description}</p>
    </article>
  );
};

export const DynamicMatchExample: FC<RoutePageProps> = ({ title, description }: RoutePageProps): ReactElement => {
  return (
    <article>
      <h3>{title}</h3>
      <p>{description}</p>
    </article>
  );
};

export const SplatMatchExample: FC<RoutePageProps> = ({ title, description }: RoutePageProps): ReactElement => {
  return (
    <article>
      <h3>{title}</h3>
      <p>{description}</p>
    </article>
  );
};

export const StaticRouteMatching: FC<RouteMatchingExampleProps> = ({
  title,
}: RouteMatchingExampleProps): ReactElement => {
  return (
    <article>
      <h3>{title}</h3>
      <Routes>
        <Route
          path="/products"
          element={
            <StaticMatchExample title="Products" description="The /products route matches the /products pathname." />
          }
        />
        <Route
          path="/contact"
          element={
            <StaticMatchExample title="Contact" description="The /contact route matches the /contact pathname." />
          }
        />
      </Routes>
    </article>
  );
};

export const DynamicRouteMatching: FC<RouteMatchingExampleProps> = ({
  title,
}: RouteMatchingExampleProps): ReactElement => {
  return (
    <article>
      <h3>{title}</h3>
      <Routes>
        <Route
          path="/users/:userId"
          element={
            <DynamicMatchExample
              title="User Route"
              description="The dynamic route matches a pathname containing one user ID segment."
            />
          }
        />
      </Routes>
    </article>
  );
};

export const SplatRouteMatching: FC<RouteMatchingExampleProps> = ({
  title,
}: RouteMatchingExampleProps): ReactElement => {
  return (
    <article>
      <h3>{title}</h3>
      <Routes>
        <Route
          path="/docs/*"
          element={
            <SplatMatchExample
              title="Documentation Route"
              description="The splat route can match the remaining pathname after /docs/."
            />
          }
        />
      </Routes>
    </article>
  );
};

export const RouteRankingExample: FC<RouteMatchingExampleProps> = ({
  title,
}: RouteMatchingExampleProps): ReactElement => {
  return (
    <article>
      <h3>{title}</h3>
      <Routes>
        <Route
          path="/products/:productId"
          element={
            <DynamicMatchExample
              title="Dynamic Product Route"
              description="This dynamic route can match a product-specific pathname."
            />
          }
        />
        <Route
          path="/products/new"
          element={
            <StaticMatchExample
              title="New Product"
              description="This static route is selected for /products/new rather than treating new as a product ID."
            />
          }
        />
      </Routes>
    </article>
  );
};

export const NoMatchExample: FC<RouteMatchingExampleProps> = ({ title }: RouteMatchingExampleProps): ReactElement => {
  return (
    <article>
      <h3>{title}</h3>
      <Routes>
        <Route
          path="/known"
          element={
            <StaticMatchExample
              title="Known Route"
              description="This route renders only when the current pathname matches /known."
            />
          }
        />
      </Routes>
      <p>
        If no route matches the current location, these Routes render no route element unless a fallback route is
        configured.
      </p>
    </article>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const RouteMatchingDemo: FC = (): ReactElement => {
  return (
    <BrowserRouter>
      <main>
        <h2>1. Static Paths Match Fixed URL Segments</h2>
        <StaticRouteMatching title="Static Route Matching" />

        <h2>2. Dynamic Segments Match Variable Path Values</h2>
        <DynamicRouteMatching title="Dynamic Route Matching" />

        <h2>3. Splat Segments Match the Remaining Path</h2>
        <SplatRouteMatching title="Splat Route Matching" />

        <h2>4. Static Routes Can Take Precedence Over Dynamic Matches</h2>
        <RouteRankingExample title="Route Ranking" />

        <h2>5. No Route Matches When No Path Matches the Location</h2>
        <NoMatchExample title="No Match" />
      </main>
    </BrowserRouter>
  );
};

export default RouteMatchingDemo;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// Route matching compares the current URL pathname with configured route path patterns.
// Static route segments match fixed pathname values.
// Dynamic segments such as :userId match one variable pathname segment.
// Splat segments such as * can match the remaining pathname.
// React Router ranks matching route branches rather than relying only on declaration order.
// A more specific static path can therefore be selected over a competing dynamic path.
// Routes does not render an element when none of its routes matches the current location.
// A fallback route can be added when an application needs dedicated UI for unmatched locations.
