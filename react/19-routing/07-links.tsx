/**
 * Links
 * =====
 *
 * React Router provides the `Link` component for client-side navigation and the `NavLink`
 * component for navigation links that also need to expose active-state information.
 *
 * A `Link` renders an anchor-like element while allowing the router to handle navigation
 * without performing a full document reload. Its `to` prop can describe an absolute path,
 * a relative destination, or a location object containing pathname, search, and hash values.
 *
 * `NavLink` extends the navigation behavior of `Link` with active and pending state information.
 * Its `className`, `style`, and children can receive an object containing `isActive`,
 * `isPending`, and `isTransitioning`, making it useful for navigation menus and breadcrumbs.
 *
 * A `Link` should be used for internal application navigation. Ordinary `<a>` elements are
 * appropriate for external URLs or cases where a full document navigation is intentional.
 */

import type { FC, ReactElement } from "react";
import { BrowserRouter, Link, NavLink, Route, Routes } from "react-router-dom";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface LinkExampleProps {
  readonly label: string;
  readonly destination: string;
}

export interface NavigationState {
  readonly message: string;
  readonly destination: string;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * Demonstrates the basic `Link` component.
 *
 * `Link` should be used when the destination belongs to the same routed application.
 * Clicking the link changes the router location without requesting the document again.
 */
export const BasicLinkExample: FC = (): ReactElement => {
  return (
    <div>
      <p>Navigate to another route without a full document reload.</p>
      <Link to="/products">View products</Link>
    </div>
  );
};

/**
 * Demonstrates using the `to` prop with an absolute application path.
 *
 * A path beginning with `/` is resolved from the application's URL root.
 */
export const AbsoluteLinkExample: FC = (): ReactElement => {
  return (
    <nav aria-label="Absolute route links">
      <Link to="/">Home</Link>
      {" | "}
      <Link to="/products">Products</Link>
      {" | "}
      <Link to="/account">Account</Link>
    </nav>
  );
};

/**
 * Demonstrates a location object passed to `Link`.
 *
 * The object can describe multiple parts of the destination, including the pathname,
 * query string, and hash fragment.
 */
export const LocationObjectLinkExample: FC = (): ReactElement => {
  return (
    <div>
      <Link
        to={{
          pathname: "/products",
          search: "?category=books",
          hash: "#featured",
        }}
      >
        Featured books
      </Link>
    </div>
  );
};

/**
 * Demonstrates a relative `Link`.
 *
 * A relative destination such as `..` is resolved from the currently matched route.
 * This is useful when navigating within nested route hierarchies.
 */
export const RelativeLinkExample: FC = (): ReactElement => {
  return (
    <nav aria-label="Relative route links">
      <Link to="..">Back to account</Link>
      {" | "}
      <Link to="security">Security settings</Link>
    </nav>
  );
};

/**
 * Demonstrates `NavLink` active-state styling.
 *
 * `NavLink` provides `isActive` to its `className` callback, allowing the rendered
 * link to reflect whether its destination matches the current location.
 */
export const ActiveNavLinkExample: FC = (): ReactElement => {
  return (
    <nav aria-label="Active navigation links">
      <NavLink to="/" end className={({ isActive }): string => (isActive ? "active" : "")}>
        Home
      </NavLink>
      {" | "}
      <NavLink to="/products" className={({ isActive }): string => (isActive ? "active" : "")}>
        Products
      </NavLink>
      {" | "}
      <NavLink to="/account" className={({ isActive }): string => (isActive ? "active" : "")}>
        Account
      </NavLink>
    </nav>
  );
};

/**
 * Demonstrates why `end` can matter for `NavLink`.
 *
 * Without `end`, `/products` remains active while a deeper route such as
 * `/products/details` is matched. `end` requires the URL to match the link
 * destination through its end.
 */
export const NavLinkEndExample: FC = (): ReactElement => {
  return (
    <nav aria-label="Exact navigation links">
      <NavLink to="/products" end className={({ isActive }): string => (isActive ? "active" : "")}>
        Products
      </NavLink>
      {" | "}
      <NavLink to="/products/details" end className={({ isActive }): string => (isActive ? "active" : "")}>
        Product details
      </NavLink>
    </nav>
  );
};

/**
 * Demonstrates `NavLink` rendering different content from its active state.
 *
 * The children callback receives `isActive`, allowing the component to change
 * its rendered content without manually reading the current location.
 */
export const NavLinkChildrenExample: FC = (): ReactElement => {
  return (
    <nav aria-label="State-aware navigation">
      <NavLink to="/account">
        {({ isActive }): ReactElement => <span>{isActive ? "Current account" : "Account"}</span>}
      </NavLink>
    </nav>
  );
};

/**
 * Demonstrates `Link` navigation state.
 *
 * The `state` prop attaches client-side navigation state to the destination.
 * This state is associated with the history entry and is not part of the URL.
 */
export const LinkStateExample: FC = (): ReactElement => {
  const navigationState: NavigationState = {
    message: "Opened from the product list",
    destination: "/products",
  };

  return (
    <Link to="/products" state={navigationState}>
      Open products with navigation state
    </Link>
  );
};

/**
 * Demonstrates `replace`.
 *
 * A normal link navigation adds a new history entry. A link with `replace`
 * replaces the current history entry instead.
 */
export const ReplaceLinkExample: FC = (): ReactElement => {
  return (
    <div>
      <p>This navigation replaces the current history entry.</p>
      <Link to="/account" replace>
        Continue to account
      </Link>
    </div>
  );
};

/**
 * Demonstrates the distinction between internal and external links.
 *
 * `Link` is intended for destinations handled by the application's router.
 * External websites should normally use a standard anchor element.
 */
export const InternalVsExternalLinkExample: FC = (): ReactElement => {
  return (
    <nav aria-label="Internal and external links">
      <Link to="/products">Internal products page</Link>
      {" | "}
      <a href="https://example.com" target="_blank" rel="noreferrer">
        External website
      </a>
    </nav>
  );
};

/**
 * Demonstrates a common misconception about `Link`.
 *
 * Rendering a `Link` does not define a route. The application still needs a
 * matching `Route` somewhere in the router configuration for the destination
 * to render the intended route component.
 */
export const LinkDoesNotCreateRouteExample: FC = (): ReactElement => {
  return (
    <div>
      <Link to="/missing-route">Navigate to an unconfigured route</Link>
      <p>A link can navigate to a path even when no route renders content for it.</p>
    </div>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const HomePage: FC = (): ReactElement => {
  return <p>Home page</p>;
};

const ProductsPage: FC = (): ReactElement => {
  return (
    <div>
      <p>Products page</p>
      <RelativeLinkExample />
    </div>
  );
};

const ProductDetailsPage: FC = (): ReactElement => {
  return <p>Product details page</p>;
};

const AccountPage: FC = (): ReactElement => {
  return (
    <div>
      <p>Account page</p>
      <Link to="/account/security">Security settings</Link>
    </div>
  );
};

const SecurityPage: FC = (): ReactElement => {
  return (
    <div>
      <p>Security settings</p>
      <Link to="..">Back to account</Link>
    </div>
  );
};

const MissingRoutePage: FC = (): ReactElement => {
  return <p>No route matches this destination.</p>;
};

const LinksDemo: FC = (): ReactElement => {
  return (
    <BrowserRouter>
      <main>
        <h1>React Router Links</h1>

        <section>
          <h2>1. Basic Link</h2>
          <BasicLinkExample />
        </section>

        <section>
          <h2>2. Absolute Route Links</h2>
          <AbsoluteLinkExample />
        </section>

        <section>
          <h2>3. Location Object Link</h2>
          <LocationObjectLinkExample />
        </section>

        <section>
          <h2>4. Relative Link</h2>
          <p>Open the Products route to see relative navigation in a nested route.</p>
          <Link to="/products">Open products</Link>
        </section>

        <section>
          <h2>5. Active NavLink</h2>
          <ActiveNavLinkExample />
        </section>

        <section>
          <h2>6. NavLink with Exact Matching</h2>
          <NavLinkEndExample />
        </section>

        <section>
          <h2>7. NavLink Children Render Function</h2>
          <NavLinkChildrenExample />
        </section>

        <section>
          <h2>8. Link Navigation State</h2>
          <LinkStateExample />
        </section>

        <section>
          <h2>9. Replacing a History Entry</h2>
          <ReplaceLinkExample />
        </section>

        <section>
          <h2>10. Internal vs External Links</h2>
          <InternalVsExternalLinkExample />
        </section>

        <section>
          <h2>11. Link Does Not Create a Route</h2>
          <LinkDoesNotCreateRouteExample />
        </section>

        <section>
          <h2>12. Routed Pages</h2>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/products/details" element={<ProductDetailsPage />} />
            <Route path="/account" element={<AccountPage />} />
            <Route path="/account/security" element={<SecurityPage />} />
            <Route path="/missing-route" element={<MissingRoutePage />} />
          </Routes>
        </section>
      </main>
    </BrowserRouter>
  );
};

export default LinksDemo;

// ---------------------------------------------------------------------
// Summary
// `Link` provides client-side navigation for destinations handled by the router.
// `NavLink` adds active, pending, and transition state to navigation links.
// `to` can describe an absolute path, a relative destination, or a location object.
// Relative links are resolved from the currently matched route hierarchy.
// `end` makes a NavLink require an exact match through the end of its destination.
// `state` attaches client-side navigation state without adding it to the URL.
// `replace` replaces the current history entry instead of pushing a new one.
// Use ordinary `<a>` elements for external URLs or intentional document navigation.
// A Link does not define a route; a matching Route is still responsible for rendering content.
// ---------------------------------------------------------------------
