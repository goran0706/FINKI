/**
 * CORS
 * ====
 *
 * Cross-Origin Resource Sharing (CORS) is a browser security mechanism that
 * controls whether a web page can read resources returned by a different
 * origin. An origin is defined by its scheme, hostname, and port, so changing
 * any of those components creates a different origin.
 *
 * Why CORS exists
 * ---------------
 * By default, browsers apply the same-origin policy: JavaScript running on
 * https://app.example.com cannot read responses from https://api.example.com.
 * Without this rule, any website you visit could use your logged-in cookies to
 * call another site's API and read the result. CORS is the controlled exception
 * to that rule: the server declares which other origins may read its responses.
 *
 * Who does what
 * -------------
 * - The server configures CORS by sending response headers that say which
 *   origins, methods, and headers it allows.
 * - The browser enforces CORS. It adds the Origin header to cross-origin
 *   requests, evaluates the server's response headers, and decides whether
 *   JavaScript may read the response.
 * - React does nothing for CORS. React code cannot grant itself access, bypass
 *   a CORS failure, or change the headers the server sends. It can only send
 *   the request with fetch(), opt into credentialed requests with
 *   `credentials: "include"`, and handle the failure. A blocked CORS request
 *   rejects fetch() with a generic TypeError, and JavaScript cannot read the
 *   specific CORS reason. The details appear only in the browser console.
 *
 * Basic flow
 * ----------
 * 1. The page at https://app.example.com calls fetch("https://api.example.com/users").
 * 2. The browser sends the request with "Origin: https://app.example.com".
 * 3. The server responds with "Access-Control-Allow-Origin: https://app.example.com".
 * 4. The browser compares the header with the page's origin. If it matches (or
 *    is "*" for a non-credentialed request), JavaScript can read the response.
 *    If the header is missing or different, the browser blocks JavaScript from
 *    reading it and fetch() rejects.
 *
 * Server configuration example (Express, using the "cors" package)
 * ----------------------------------------------------------------
 * This code runs on the server, not in React. It only sets the response
 * headers. The browser is what enforces them.
 *
 *   app.use(
 *     cors({
 *       origin: "https://app.example.com",                    // Access-Control-Allow-Origin
 *       methods: ["GET", "POST", "PUT"],                      // Access-Control-Allow-Methods
 *       allowedHeaders: ["content-type", "x-example-header"], // Access-Control-Allow-Headers
 *       credentials: true,                                    // Access-Control-Allow-Credentials: true
 *       maxAge: 600,                                          // Access-Control-Max-Age (preflight cache, seconds)
 *     }),
 *   );
 *
 * The components in this file do not configure CORS. They display the values
 * that the server and browser exchange so each concept can be inspected.
 *
 * CORS is implemented by browsers using HTTP request and response headers.
 * A server indicates which origins are allowed to access its resources with
 * response headers such as Access-Control-Allow-Origin. The browser evaluates
 * those headers and determines whether JavaScript is permitted to expose the
 * response to the requesting page.
 *
 * A cross-origin request is not automatically the same thing as a blocked
 * network request. The browser can send certain cross-origin requests while
 * preventing JavaScript from reading the response when the server does not
 * grant the required CORS permission. CORS therefore primarily controls
 * browser access to cross-origin resources rather than acting as a general
 * server-side firewall.
 *
 * Some cross-origin requests are classified as "simple" requests and can be
 * sent without a CORS preflight when their method and request headers satisfy
 * the browser's CORS-safelisted requirements. Other requests require a
 * preflight. The browser sends an OPTIONS request before the actual request
 * to ask whether the server permits the intended method and request headers.
 *
 * A CORS preflight response can use Access-Control-Allow-Origin,
 * Access-Control-Allow-Methods, and Access-Control-Allow-Headers to describe
 * the permitted cross-origin operation. The browser evaluates the response
 * before deciding whether the actual request may proceed. The browser can
 * cache the preflight result for the duration of Access-Control-Max-Age.
 *
 * Credentials such as cookies introduce additional CORS restrictions. When a
 * request includes credentials, the server must explicitly allow the
 * requesting origin and cannot use the wildcard "*" as the value of
 * Access-Control-Allow-Origin. The server must also send
 * Access-Control-Allow-Credentials: true. The client must also opt into
 * credentialed requests, for example by using `credentials: "include"` with
 * fetch().
 *
 * CORS is enforced by browsers and is not a replacement for server-side
 * authentication or authorization. A non-browser client such as a server-side
 * HTTP client is not subject to browser CORS enforcement and can generally
 * send the same HTTP request regardless of the response's CORS headers.
 */

import { type FC, type ReactNode } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface CorsOriginProps {
  readonly pageOrigin: string;
  readonly apiOrigin: string;
}

export interface CorsAllowOriginProps {
  readonly requestingOrigin: string;
  readonly allowedOrigin: string;
}

export interface CorsSimpleRequestProps {
  readonly url: string;
  readonly method: string;
}

export interface CorsPreflightProps {
  readonly origin: string;
  readonly method: string;
  readonly requestHeaders: readonly string[];
}

export interface CorsPreflightResponseProps {
  readonly allowedOrigin: string;
  readonly allowedMethods: readonly string[];
  readonly allowedHeaders: readonly string[];
}

export interface CorsCredentialsProps {
  readonly origin: string;
  readonly allowCredentials: boolean;
}

export interface CorsWildcardCredentialsProps {
  readonly origin: string;
  readonly allowOrigin: string;
}

export interface CorsSameOriginProps {
  readonly firstUrl: string;
  readonly secondUrl: string;
}

export interface CorsServerSecurityProps {
  readonly origin: string;
  readonly authenticated: boolean;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * Demonstrates how two URLs can be compared by their origin components.
 */
export const CorsOriginExample: FC<CorsOriginProps> = ({ pageOrigin, apiOrigin }: CorsOriginProps): ReactNode => {
  const pageUrl: URL = new URL(pageOrigin);
  const apiUrl: URL = new URL(apiOrigin);

  const sameOrigin: boolean = pageUrl.origin === apiUrl.origin;

  return (
    <section>
      <h3>Identifying cross-origin requests</h3>

      <p>Page origin: {pageUrl.origin}</p>

      <p>API origin: {apiUrl.origin}</p>

      <p>Same origin: {sameOrigin ? "Yes" : "No"}</p>
    </section>
  );
};

/**
 * Demonstrates the role of Access-Control-Allow-Origin in granting a specific
 * requesting origin access to a cross-origin response.
 */
export const CorsAllowOriginExample: FC<CorsAllowOriginProps> = ({
  requestingOrigin,
  allowedOrigin,
}: CorsAllowOriginProps): ReactNode => {
  const allowed: boolean = allowedOrigin === "*" || allowedOrigin === requestingOrigin;

  return (
    <section>
      <h3>Access-Control-Allow-Origin</h3>

      <p>Requesting origin: {requestingOrigin}</p>

      <p>Allowed origin: {allowedOrigin}</p>

      <p>Origin permitted by this header: {allowed ? "Yes" : "No"}</p>
    </section>
  );
};

/**
 * Demonstrates a request that uses a method commonly associated with a
 * CORS-safelisted request when the other CORS-safelisted requirements are
 * also satisfied.
 */
export const CorsSimpleRequestExample: FC<CorsSimpleRequestProps> = ({
  url,
  method,
}: CorsSimpleRequestProps): ReactNode => {
  const request: Request = new Request(url, {
    method,
  });

  const methodUpperCase: string = request.method.toUpperCase();

  const commonlySimpleMethod: boolean =
    methodUpperCase === "GET" || methodUpperCase === "HEAD" || methodUpperCase === "POST";

  return (
    <section>
      <h3>CORS-safelisted request method</h3>

      <p>URL: {request.url}</p>

      <p>Method: {request.method}</p>

      <p>Commonly CORS-safelisted method: {commonlySimpleMethod ? "Yes" : "No"}</p>

      <p>
        Method alone does not determine whether a request avoids preflight; headers and other request properties also
        matter.
      </p>
    </section>
  );
};

/**
 * Demonstrates the information represented by a CORS preflight request.
 * The browser uses OPTIONS to ask whether the intended cross-origin request
 * is permitted.
 */
export const CorsPreflightExample: FC<CorsPreflightProps> = ({
  origin,
  method,
  requestHeaders,
}: CorsPreflightProps): ReactNode => {
  const requestedHeaders: string = requestHeaders.join(", ");

  return (
    <section>
      <h3>CORS preflight request</h3>

      <dl>
        <dt>Method</dt>
        <dd>OPTIONS</dd>

        <dt>Origin</dt>
        <dd>{origin}</dd>

        <dt>Access-Control-Request-Method</dt>
        <dd>{method}</dd>

        <dt>Access-Control-Request-Headers</dt>
        <dd>{requestedHeaders || "None"}</dd>
      </dl>

      <p>The browser uses these headers to describe the cross-origin request it wants to make.</p>
    </section>
  );
};

/**
 * Demonstrates the main response headers used by a server to authorize a
 * CORS preflighted operation.
 */
export const CorsPreflightResponseExample: FC<CorsPreflightResponseProps> = ({
  allowedOrigin,
  allowedMethods,
  allowedHeaders,
}: CorsPreflightResponseProps): ReactNode => {
  const methods: string = allowedMethods.join(", ");

  const headers: string = allowedHeaders.join(", ");

  return (
    <section>
      <h3>CORS preflight response</h3>

      <dl>
        <dt>Access-Control-Allow-Origin</dt>
        <dd>{allowedOrigin}</dd>

        <dt>Access-Control-Allow-Methods</dt>
        <dd>{methods}</dd>

        <dt>Access-Control-Allow-Headers</dt>
        <dd>{headers}</dd>
      </dl>
    </section>
  );
};

/**
 * Demonstrates the client-side fetch option required when cookies or other
 * credentials should be included in a cross-origin request.
 */
export const CorsCredentialsExample: FC<CorsCredentialsProps> = ({
  origin,
  allowCredentials,
}: CorsCredentialsProps): ReactNode => {
  const request: Request = new Request("https://example.com/api/profile", {
    credentials: "include",
  });

  const credentialsHeader: string = allowCredentials ? "true" : "Not permitted";

  return (
    <section>
      <h3>CORS credentials</h3>

      <p>Requesting origin: {origin}</p>

      <p>Fetch credentials mode: {request.credentials}</p>

      <p>Server permission: {credentialsHeader}</p>

      <p>Credentialed CORS requires explicit server permission for the requesting origin.</p>
    </section>
  );
};

/**
 * Demonstrates why a wildcard Access-Control-Allow-Origin value cannot be used
 * together with credentialed CORS responses.
 */
export const CorsWildcardCredentialsExample: FC<CorsWildcardCredentialsProps> = ({
  origin,
  allowOrigin,
}: CorsWildcardCredentialsProps): ReactNode => {
  const usesWildcard: boolean = allowOrigin === "*";

  const validCredentialConfiguration: boolean = !usesWildcard && allowOrigin === origin;

  return (
    <section>
      <h3>Wildcard origins and credentials</h3>

      <p>Requesting origin: {origin}</p>

      <p>Access-Control-Allow-Origin: {allowOrigin}</p>

      <p>Credential-compatible configuration: {validCredentialConfiguration ? "Yes" : "No"}</p>

      <p>A credentialed CORS response cannot use `*` as Access-Control-Allow-Origin.</p>
    </section>
  );
};

/**
 * Demonstrates that scheme, hostname, and port all participate in origin
 * comparison.
 */
export const CorsSameOriginExample: FC<CorsSameOriginProps> = ({
  firstUrl,
  secondUrl,
}: CorsSameOriginProps): ReactNode => {
  const first: URL = new URL(firstUrl);
  const second: URL = new URL(secondUrl);

  const sameOrigin: boolean = first.origin === second.origin;

  return (
    <section>
      <h3>Origin comparison</h3>

      <p>First origin: {first.origin}</p>

      <p>Second origin: {second.origin}</p>

      <p>Same origin: {sameOrigin ? "Yes" : "No"}</p>

      <p>
        Paths do not determine whether two URLs have the same origin. Scheme, hostname, and port determine the origin.
      </p>
    </section>
  );
};

/**
 * Demonstrates that CORS does not replace server-side authentication or
 * authorization.
 */
export const CorsServerSecurityExample: FC<CorsServerSecurityProps> = ({
  origin,
  authenticated,
}: CorsServerSecurityProps): ReactNode => {
  const authorized: boolean = authenticated;

  return (
    <section>
      <h3>CORS is not authorization</h3>

      <p>Requesting origin: {origin}</p>

      <p>User authenticated: {authenticated ? "Yes" : "No"}</p>

      <p>Application authorization result: {authorized ? "Allowed" : "Denied"}</p>

      <p>
        CORS controls browser access to a cross-origin response. The server must still authenticate and authorize
        protected operations.
      </p>
    </section>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const CorsContainer: FC = (): ReactNode => {
  return (
    <main>
      <h1>CORS</h1>

      <h2>1. Identifying cross-origin requests</h2>
      <CorsOriginExample pageOrigin="https://app.example.com" apiOrigin="https://api.example.com" />

      <h2>2. Using Access-Control-Allow-Origin</h2>
      <CorsAllowOriginExample requestingOrigin="https://app.example.com" allowedOrigin="https://app.example.com" />

      <h2>3. Understanding CORS-safelisted request methods</h2>
      <CorsSimpleRequestExample url="https://api.example.com/users" method="GET" />

      <h2>4. Understanding a CORS preflight request</h2>
      <CorsPreflightExample
        origin="https://app.example.com"
        method="PUT"
        requestHeaders={["content-type", "x-example-header"]}
      />

      <h2>5. Understanding a CORS preflight response</h2>
      <CorsPreflightResponseExample
        allowedOrigin="https://app.example.com"
        allowedMethods={["GET", "POST", "PUT"]}
        allowedHeaders={["content-type", "x-example-header"]}
      />

      <h2>6. Understanding credentialed CORS requests</h2>
      <CorsCredentialsExample origin="https://app.example.com" allowCredentials={true} />

      <h2>7. Understanding wildcard origins with credentials</h2>
      <CorsWildcardCredentialsExample origin="https://app.example.com" allowOrigin="*" />

      <h2>8. Understanding how origins are compared</h2>
      <CorsSameOriginExample firstUrl="https://example.com/users" secondUrl="https://example.com/profile" />

      <h2>9. Understanding why CORS is not authorization</h2>
      <CorsServerSecurityExample origin="https://app.example.com" authenticated={true} />
    </main>
  );
};

export default CorsContainer;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - By default, browsers block JavaScript from reading responses from a different origin (same-origin policy).
// - CORS is the mechanism that lets a server relax that rule for specific origins.
// - The server configures CORS with response headers; the browser enforces it; React does nothing for CORS.
// - React code cannot grant itself access or bypass CORS; it can only send requests, opt into credentials, and handle failures.
// - A CORS failure rejects fetch() with a generic TypeError; the specific reason is visible only in the browser console.
// - An origin consists of a scheme, hostname, and port.
// - The browser sends an Origin header; the server answers with Access-Control-Allow-Origin; the browser compares them.
// - Some cross-origin requests can be sent without a preflight when they satisfy CORS-safelisted requirements.
// - A preflight request uses OPTIONS to ask whether a cross-origin operation is permitted.
// - Access-Control-Allow-Methods identifies methods permitted after a preflight.
// - Access-Control-Allow-Headers identifies non-safelisted request headers permitted after a preflight.
// - Access-Control-Max-Age lets the browser cache a preflight result.
// - Credentialed requests need client opt-in (credentials: "include") and server permission (an explicit origin plus Access-Control-Allow-Credentials: true).
// - Access-Control-Allow-Origin cannot use `*` for a credentialed CORS response.
// - CORS does not replace authentication or server-side authorization.
// - CORS is enforced by browsers and is not a general restriction on non-browser HTTP clients.
// - A CORS failure can prevent JavaScript from reading a response even though the HTTP request may have reached the server.
// - Request methods alone do not determine whether a request requires a preflight; request headers and other CORS requirements also matter.
