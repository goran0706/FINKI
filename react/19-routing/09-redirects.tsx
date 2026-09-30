/**
 * Redirects
 * =========
 *
 * React Router supports redirects that move the application from one location to another
 * without requiring the user to activate a navigation link. Redirects can be declarative,
 * using the `Navigate` component, or data-driven, using the `redirect` utility from a route
 * loader or action.
 *
 * `Navigate` is useful when a rendered component determines that the current location should
 * immediately change. The `redirect` utility is designed for loaders and actions, where the
 * router can make the redirect decision before rendering the destination route.
 *
 * Redirects can either push a new history entry or replace the current entry. Replacing is
 * commonly appropriate when the current location should not remain reachable through Back
 * navigation, such as after authentication or when normalizing a legacy URL.
 */

import type { FC, ReactElement } from "react";
import { BrowserRouter, Link, Navigate, Route, Routes, useLocation } from "react-router-dom";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface RedirectState {
  readonly message: string;
  readonly source: string;
}

export interface RedirectPageProps {
  readonly destination: string;
}

export interface LegacyRouteState {
  readonly source: string;
  readonly destination: string;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * Demonstrates a basic declarative redirect with `Navigate`.
 *
 * Rendering `Navigate` causes React Router to navigate to its `to` destination.
 * The component itself renders no visible UI because `Navigate` returns `null`.
 */
export const BasicRedirectExample: FC = (): ReactElement => {
  return <Navigate to="/products" />;
};

/**
 * Demonstrates a conditional redirect.
 *
 * A component can render its normal content when access is allowed and render
 * `Navigate` when the current application state requires another destination.
 */
export const ConditionalRedirectExample: FC = (): ReactElement => {
  const isAuthenticated: boolean = false;

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return <p>Authenticated content</p>;
};

/**
 * Demonstrates replacing the current history entry during a redirect.
 *
 * `replace` prevents the redirected-from location from remaining as a separate
 * entry in the browser history stack.
 */
export const ReplaceRedirectExample: FC = (): ReactElement => {
  return <Navigate to="/products" replace />;
};

/**
 * Demonstrates redirecting while carrying location state.
 *
 * The state is stored with the destination history entry and can be read through
 * `useLocation` at the destination. It is not encoded into the URL.
 */
export const RedirectWithStateExample: FC = (): ReactElement => {
  const redirectState: RedirectState = {
    message: "Authentication is required.",
    source: "/account",
  };

  return <Navigate to="/login" state={redirectState} />;
};

/**
 * Demonstrates reading state supplied by a redirect.
 *
 * `location.state` contains client-side history state supplied during navigation.
 * The state is separate from the pathname, search string, and hash.
 */
export const RedirectDestinationExample: FC = (): ReactElement => {
  const location = useLocation();
  const state = location.state as RedirectState | null;

  return (
    <div>
      <p>Destination: {location.pathname}</p>
      <p>Message: {state?.message ?? "No redirect state"}</p>
      <p>Source: {state?.source ?? "Unknown"}</p>
    </div>
  );
};

/**
 * Demonstrates a legacy URL redirect.
 *
 * A redirect can preserve an old entry point while moving users to the current
 * route. Replacing the entry prevents the obsolete URL from remaining in history.
 */
export const LegacyRouteRedirectExample: FC = (): ReactElement => {
  const legacyState: LegacyRouteState = {
    source: "/old-products",
    destination: "/products",
  };

  return <Navigate to={legacyState.destination} replace />;
};

/**
 * Demonstrates a redirect that preserves query and hash information.
 *
 * The `to` value can contain a complete application-relative destination, including
 * a query string and hash fragment.
 */
export const RedirectWithUrlPartsExample: FC = (): ReactElement => {
  return <Navigate to="/products?category=books#featured" replace />;
};

/**
 * Demonstrates a common redirect misconception.
 *
 * A redirect does not make the original route disappear from the route configuration.
 * The original route still exists, but rendering it immediately navigates elsewhere.
 */
export const RedirectDoesNotRemoveRouteExample: FC = (): ReactElement => {
  return (
    <div>
      <p>This route remains configured, even though it redirects immediately.</p>
      <Navigate to="/products" />
    </div>
  );
};

/**
 * Demonstrates the difference between a redirect and ordinary navigation.
 *
 * A redirect is normally used when the current location should lead somewhere else
 * automatically, while a link lets the user explicitly choose the destination.
 */
export const RedirectVsNavigationExample: FC = (): ReactElement => {
  return (
    <div>
      <p>A redirect changes the destination automatically.</p>
      <p>A link lets the user explicitly choose to navigate.</p>
      <Link to="/products">Open products</Link>
    </div>
  );
};

/**
 * Demonstrates a route that redirects immediately.
 *
 * This is useful for compatibility routes, aliases, and locations that should
 * transparently point to a canonical URL.
 */
export const RedirectRouteExample: FC = (): ReactElement => {
  return <Navigate to="/products" replace />;
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const HomePage: FC = (): ReactElement => {
  return (
    <div>
      <p>Home page</p>
      <Link to="/products">Open products</Link>
    </div>
  );
};

const ProductsPage: FC = (): ReactElement => {
  return (
    <div>
      <p>Products page</p>
      <Link to="/account">Open account</Link>
    </div>
  );
};

const LoginPage: FC = (): ReactElement => {
  return (
    <div>
      <p>Login page</p>
      <Link to="/account">Continue to account</Link>
    </div>
  );
};

const AccountPage: FC = (): ReactElement => {
  return (
    <div>
      <p>Account page</p>
      <RedirectDestinationExample />
    </div>
  );
};

const LegacyProductsPage: FC = (): ReactElement => {
  return <LegacyRouteRedirectExample />;
};

const RedirectDemo: FC = (): ReactElement => {
  return (
    <BrowserRouter>
      <main>
        <h1>React Router Redirects</h1>

        <section>
          <h2>1. Basic Redirect</h2>
          <p>Navigate to the products route automatically.</p>
          <Link to="/basic-redirect">Run redirect</Link>
        </section>

        <section>
          <h2>2. Conditional Redirect</h2>
          <p>Redirect when the application condition requires authentication.</p>
          <Link to="/protected">Open protected route</Link>
        </section>

        <section>
          <h2>3. Replace Redirect</h2>
          <p>Redirect while replacing the current history entry.</p>
          <Link to="/replace-redirect">Run replace redirect</Link>
        </section>

        <section>
          <h2>4. Redirect with State</h2>
          <p>Redirect while attaching client-side navigation state.</p>
          <Link to="/account-redirect">Run state redirect</Link>
        </section>

        <section>
          <h2>5. Reading Redirect State</h2>
          <p>The destination can read state supplied by the redirect.</p>
          <Link to="/account-redirect">Open redirected account</Link>
        </section>

        <section>
          <h2>6. Legacy Route Redirect</h2>
          <p>Redirect an obsolete URL to its canonical destination.</p>
          <Link to="/old-products">Open legacy products URL</Link>
        </section>

        <section>
          <h2>7. Redirect with URL Parts</h2>
          <p>Preserve a query string and hash in the redirect destination.</p>
          <Link to="/products-redirect">Run URL redirect</Link>
        </section>

        <section>
          <h2>8. Redirect Does Not Remove a Route</h2>
          <p>The original route remains configured and redirects when rendered.</p>
          <Link to="/configured-redirect">Open redirecting route</Link>
        </section>

        <section>
          <h2>9. Redirect vs Navigation</h2>
          <RedirectVsNavigationExample />
        </section>

        <section>
          <h2>10. Redirect Route</h2>
          <p>Use a route as an alias for another route.</p>
          <Link to="/products-alias">Open products alias</Link>
        </section>

        <section>
          <h2>11. Routed Pages</h2>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/account" element={<AccountPage />} />
            <Route path="/basic-redirect" element={<BasicRedirectExample />} />
            <Route path="/protected" element={<ConditionalRedirectExample />} />
            <Route path="/replace-redirect" element={<ReplaceRedirectExample />} />
            <Route path="/account-redirect" element={<RedirectWithStateExample />} />
            <Route path="/old-products" element={<LegacyProductsPage />} />
            <Route path="/products-redirect" element={<RedirectWithUrlPartsExample />} />
            <Route path="/configured-redirect" element={<RedirectDoesNotRemoveRouteExample />} />
            <Route path="/products-alias" element={<RedirectRouteExample />} />
          </Routes>
        </section>
      </main>
    </BrowserRouter>
  );
};

export default RedirectDemo;

// ---------------------------------------------------------------------
// Summary
// `Navigate` performs a declarative redirect when it is rendered.
// Conditional redirects can send users to another route when application state requires it.
// `replace` replaces the current history entry instead of adding another entry.
// `state` attaches client-side navigation state to the redirected destination.
// Query strings and hash fragments can be included in the redirect destination.
// Legacy URLs can redirect to canonical routes without removing the original route definition.
// A redirect changes where the user is sent; it does not remove the source route from configuration.
// A redirect is different from a link because the destination is selected automatically.
// `redirect` is also available for loaders and actions in React Router's data APIs,
// where the router can perform the redirect before rendering the destination.
// ---------------------------------------------------------------------
