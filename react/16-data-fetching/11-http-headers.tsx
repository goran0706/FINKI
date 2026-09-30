/**
 * HTTP Headers
 * ============
 *
 * HTTP headers are name-value metadata fields associated with HTTP requests
 * and responses. They communicate information such as the media type of a
 * message, accepted representations, caching directives, authentication
 * credentials, content length, and connection behavior.
 *
 * In the Fetch API, the `Headers` interface provides a case-insensitive
 * collection of header names and values. Header names are normalized when
 * stored, and methods such as `set()`, `append()`, `get()`, `has()`, and
 * `delete()` provide controlled access to the collection.
 *
 * `set()` replaces an existing value, while `append()` adds another value to
 * the same header name. This distinction matters for headers that can contain
 * multiple values. `get()` returns the combined serialized value when a header
 * has multiple values, while `getSetCookie()` is available in environments
 * that support it for retrieving multiple `Set-Cookie` response values.
 *
 * The Fetch API applies restrictions to certain headers in browser contexts.
 * Some request headers are forbidden from being set by application code, and
 * CORS rules can restrict which request headers may be sent cross-origin.
 * Therefore, having a string accepted by `Headers.set()` does not guarantee
 * that a browser will transmit that header in every request context.
 *
 * Request and response headers serve different purposes. Request headers are
 * sent by the client and describe the request or client preferences, while
 * response headers are sent by the server and describe the response or
 * instructions for caching, security, and subsequent requests.
 */

import { type FC, type ReactNode } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface HttpHeadersBasicProps {
  readonly contentType: string;
}

export interface HttpHeadersCaseInsensitiveProps {
  readonly headerName: string;
  readonly headerValue: string;
}

export interface HttpHeadersSetProps {
  readonly initialValue: string;
  readonly replacementValue: string;
}

export interface HttpHeadersAppendProps {
  readonly firstValue: string;
  readonly secondValue: string;
}

export interface HttpHeadersDeleteProps {
  readonly headerName: string;
  readonly headerValue: string;
}

export interface HttpHeadersRequestProps {
  readonly url: string;
  readonly authorizationToken: string;
}

export interface HttpHeadersResponseProps {
  readonly contentType: string;
  readonly cacheControl: string;
}

export interface HttpHeadersIterationProps {
  readonly contentType: string;
  readonly accept: string;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * Creates a Headers collection and adds a standard media-type header.
 */
export const HttpHeadersBasicExample: FC<HttpHeadersBasicProps> = ({
  contentType,
}: HttpHeadersBasicProps): ReactNode => {
  const headers: Headers = new Headers();

  headers.set("Content-Type", contentType);

  return (
    <section>
      <h3>Creating HTTP headers</h3>

      <p>Content-Type: {headers.get("Content-Type")}</p>
    </section>
  );
};

/**
 * Demonstrates that HTTP header names are case-insensitive.
 */
export const HttpHeadersCaseInsensitiveExample: FC<HttpHeadersCaseInsensitiveProps> = ({
  headerName,
  headerValue,
}: HttpHeadersCaseInsensitiveProps): ReactNode => {
  const headers: Headers = new Headers();

  headers.set(headerName, headerValue);

  const lowerCaseValue: string | null = headers.get(headerName.toLowerCase());

  const upperCaseValue: string | null = headers.get(headerName.toUpperCase());

  return (
    <section>
      <h3>Header names are case-insensitive</h3>

      <p>Stored value: {headerValue}</p>

      <p>Lower-case lookup: {lowerCaseValue}</p>

      <p>Upper-case lookup: {upperCaseValue}</p>
    </section>
  );
};

/**
 * Demonstrates that `set()` replaces the current value for a header name.
 */
export const HttpHeadersSetExample: FC<HttpHeadersSetProps> = ({
  initialValue,
  replacementValue,
}: HttpHeadersSetProps): ReactNode => {
  const headers: Headers = new Headers();

  headers.set("X-Example", initialValue);

  headers.set("X-Example", replacementValue);

  return (
    <section>
      <h3>Replacing a header with set()</h3>

      <p>Final value: {headers.get("X-Example")}</p>
    </section>
  );
};

/**
 * Demonstrates that `append()` adds another value instead of replacing the
 * existing value.
 */
export const HttpHeadersAppendExample: FC<HttpHeadersAppendProps> = ({
  firstValue,
  secondValue,
}: HttpHeadersAppendProps): ReactNode => {
  const headers: Headers = new Headers();

  headers.append("X-Example", firstValue);

  headers.append("X-Example", secondValue);

  return (
    <section>
      <h3>Adding values with append()</h3>

      <p>Combined value: {headers.get("X-Example")}</p>
    </section>
  );
};

/**
 * Demonstrates removing a header with `delete()`.
 */
export const HttpHeadersDeleteExample: FC<HttpHeadersDeleteProps> = ({
  headerName,
  headerValue,
}: HttpHeadersDeleteProps): ReactNode => {
  const headers: Headers = new Headers();

  headers.set(headerName, headerValue);

  const existedBeforeDelete: boolean = headers.has(headerName);

  headers.delete(headerName);

  const existsAfterDelete: boolean = headers.has(headerName);

  return (
    <section>
      <h3>Deleting a header</h3>

      <p>Present before delete: {existedBeforeDelete ? "Yes" : "No"}</p>

      <p>Present after delete: {existsAfterDelete ? "Yes" : "No"}</p>
    </section>
  );
};

/**
 * Adds request headers to a Request object. Authentication data shown here is
 * example data and should be replaced with application-specific credentials
 * handling in a real application.
 */
export const HttpHeadersRequestExample: FC<HttpHeadersRequestProps> = ({
  url,
  authorizationToken,
}: HttpHeadersRequestProps): ReactNode => {
  const headers: Headers = new Headers();

  headers.set("Accept", "application/json");

  headers.set("Authorization", `Bearer ${authorizationToken}`);

  const request: Request = new Request(url, {
    method: "GET",
    headers,
  });

  return (
    <section>
      <h3>Request headers</h3>

      <p>Accept: {request.headers.get("Accept")}</p>

      <p>Authorization: {request.headers.get("Authorization")}</p>
    </section>
  );
};

/**
 * Adds headers to a Response object to demonstrate that response metadata is
 * separate from request metadata.
 */
export const HttpHeadersResponseExample: FC<HttpHeadersResponseProps> = ({
  contentType,
  cacheControl,
}: HttpHeadersResponseProps): ReactNode => {
  const response: Response = new Response(null, {
    status: 200,
    headers: {
      "Content-Type": contentType,
      "Cache-Control": cacheControl,
    },
  });

  return (
    <section>
      <h3>Response headers</h3>

      <p>Content-Type: {response.headers.get("Content-Type")}</p>

      <p>Cache-Control: {response.headers.get("Cache-Control")}</p>
    </section>
  );
};

/**
 * Demonstrates iterating over a Headers collection. Header entries are exposed
 * in normalized, sorted order by the Fetch Headers API.
 */
export const HttpHeadersIterationExample: FC<HttpHeadersIterationProps> = ({
  contentType,
  accept,
}: HttpHeadersIterationProps): ReactNode => {
  const headers: Headers = new Headers();

  headers.set("Content-Type", contentType);

  headers.set("Accept", accept);

  const entries: string[] = [];

  headers.forEach((value: string, key: string): void => {
    entries.push(`${key}: ${value}`);
  });

  return (
    <section>
      <h3>Iterating through headers</h3>

      <ul>
        {entries.map((entry: string): ReactNode => (
          <li key={entry}>{entry}</li>
        ))}
      </ul>
    </section>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const HttpHeadersContainer: FC = (): ReactNode => {
  return (
    <main>
      <h1>HTTP Headers</h1>

      <h2>1. Creating HTTP headers</h2>
      <HttpHeadersBasicExample contentType="application/json" />

      <h2>2. Header names are case-insensitive</h2>
      <HttpHeadersCaseInsensitiveExample headerName="Content-Type" headerValue="application/json" />

      <h2>3. Replacing a header with set()</h2>
      <HttpHeadersSetExample initialValue="text/plain" replacementValue="application/json" />

      <h2>4. Adding values with append()</h2>
      <HttpHeadersAppendExample firstValue="application/json" secondValue="text/plain" />

      <h2>5. Deleting a header</h2>
      <HttpHeadersDeleteExample headerName="X-Example" headerValue="example-value" />

      <h2>6. Request headers</h2>
      <HttpHeadersRequestExample url="https://example.com/api/users" authorizationToken="example-token" />

      <h2>7. Response headers</h2>
      <HttpHeadersResponseExample contentType="application/json" cacheControl="no-cache" />

      <h2>8. Iterating through headers</h2>
      <HttpHeadersIterationExample contentType="application/json" accept="application/json" />
    </main>
  );
};

export default HttpHeadersContainer;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - HTTP headers are name-value metadata fields associated with HTTP messages.
// - The Fetch API represents header collections with the `Headers` interface.
// - Header names are case-insensitive.
// - `set()` replaces the current value for a header name.
// - `append()` adds another value to the existing header.
// - `get()` retrieves a header value, while `has()` checks whether a header exists.
// - `delete()` removes a header from the collection.
// - Request headers describe client requests and client preferences.
// - Response headers describe server responses and response-related metadata.
// - Browser Fetch applies restrictions to certain request headers and cross-origin requests.
// - A header accepted by the `Headers` API is not necessarily guaranteed to be transmitted in every browser request context.
// - Request and response headers are separate collections with different protocol roles.
