/**
 * HTTP Request
 * ============
 *
 * An HTTP request is a message sent by a client to an HTTP server to request
 * an operation on a resource. An HTTP request consists of a request method,
 * target URL, request headers, and an optional request body.
 *
 * The method communicates the intended operation, such as `GET`, `POST`,
 * `PUT`, `PATCH`, or `DELETE`. The target identifies the resource. Headers
 * provide metadata and control information, while the body carries optional
 * application data.
 *
 * At the protocol level, an HTTP request is transmitted using a request line,
 * followed by headers, an empty line, and an optional message body. HTTP/1.1
 * represents this structure directly as text. HTTP/2 and HTTP/3 use different
 * wire representations, but the same HTTP request semantics are preserved.
 *
 * A request body is not automatically associated with a particular method by
 * the browser Fetch API. For example, `fetch()` permits bodies for methods
 * where the Fetch standard allows them, while `GET` and `HEAD` requests cannot
 * have a request body in the Fetch API.
 *
 * The `Request` Web API represents an HTTP request programmatically. Its
 * properties expose the URL, method, headers, mode, credentials, redirect
 * behavior, and body configuration. A `Request` can be passed directly to
 * `fetch()`.
 *
 * HTTP requests are distinct from HTTP responses. A request describes what the
 * client sends to the server, while the response describes what the server
 * returns. The two messages have separate headers, bodies, and status-related
 * information.
 */

import { type FC, type ReactNode } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface HttpRequestBasicProps {
  readonly url: string;
}

export interface HttpRequestMethodProps {
  readonly url: string;
  readonly method: string;
}

export interface HttpRequestHeadersProps {
  readonly url: string;
  readonly authorizationToken: string;
}

export interface HttpRequestBodyProps {
  readonly url: string;
  readonly name: string;
}

export interface HttpRequestObjectProps {
  readonly url: string;
  readonly method: string;
}

export interface HttpRequestStructureProps {
  readonly method: string;
  readonly url: string;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * Creates a basic GET request using the `Request` Web API.
 */
export const HttpRequestBasicExample: FC<HttpRequestBasicProps> = ({ url }: HttpRequestBasicProps): ReactNode => {
  const request: Request = new Request(url);

  return (
    <section>
      <h3>Creating a basic HTTP request</h3>

      <dl>
        <dt>URL</dt>
        <dd>{request.url}</dd>

        <dt>Method</dt>
        <dd>{request.method}</dd>
      </dl>
    </section>
  );
};

/**
 * Demonstrates selecting an HTTP request method through the Request API.
 */
export const HttpRequestMethodExample: FC<HttpRequestMethodProps> = ({
  url,
  method,
}: HttpRequestMethodProps): ReactNode => {
  let request: Request | null = null;
  let errorMessage: string | null = null;

  try {
    request = new Request(url, {
      method,
    });
  } catch {
    errorMessage = "The request could not be created.";
  }

  return (
    <section>
      <h3>Setting the HTTP method</h3>

      {request !== null ? (
        <dl>
          <dt>URL</dt>
          <dd>{request.url}</dd>

          <dt>Method</dt>
          <dd>{request.method}</dd>
        </dl>
      ) : (
        <p>{errorMessage}</p>
      )}
    </section>
  );
};

/**
 * Adds request metadata through HTTP headers. Authorization values are
 * represented here as example data and are not persisted by the component.
 */
export const HttpRequestHeadersExample: FC<HttpRequestHeadersProps> = ({
  url,
  authorizationToken,
}: HttpRequestHeadersProps): ReactNode => {
  const headers: Headers = new Headers();

  headers.set("Accept", "application/json");

  headers.set("Authorization", `Bearer ${authorizationToken}`);

  const request: Request = new Request(url, {
    method: "GET",
    headers,
  });

  return (
    <section>
      <h3>Adding request headers</h3>

      <dl>
        <dt>Accept</dt>
        <dd>{request.headers.get("Accept")}</dd>

        <dt>Authorization</dt>
        <dd>{request.headers.get("Authorization")}</dd>
      </dl>
    </section>
  );
};

/**
 * Creates a JSON request body. The body is serialized explicitly and its
 * media type is declared with the Content-Type header.
 */
export const HttpRequestBodyExample: FC<HttpRequestBodyProps> = ({ url, name }: HttpRequestBodyProps): ReactNode => {
  const body: string = JSON.stringify({
    name,
  });

  const request: Request = new Request(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body,
  });

  return (
    <section>
      <h3>Adding a request body</h3>

      <dl>
        <dt>Method</dt>
        <dd>{request.method}</dd>

        <dt>Content-Type</dt>
        <dd>{request.headers.get("Content-Type")}</dd>

        <dt>Body</dt>
        <dd>{body}</dd>
      </dl>
    </section>
  );
};

/**
 * Demonstrates the complete `Request` object configuration and its commonly
 * inspected properties.
 */
export const HttpRequestObjectExample: FC<HttpRequestObjectProps> = ({
  url,
  method,
}: HttpRequestObjectProps): ReactNode => {
  const request: Request = new Request(url, {
    method,
    headers: {
      Accept: "application/json",
    },
    credentials: "same-origin",
    redirect: "follow",
  });

  return (
    <section>
      <h3>Inspecting a Request object</h3>

      <dl>
        <dt>URL</dt>
        <dd>{request.url}</dd>

        <dt>Method</dt>
        <dd>{request.method}</dd>

        <dt>Mode</dt>
        <dd>{request.mode}</dd>

        <dt>Credentials</dt>
        <dd>{request.credentials}</dd>

        <dt>Redirect</dt>
        <dd>{request.redirect}</dd>

        <dt>Accept</dt>
        <dd>{request.headers.get("Accept")}</dd>
      </dl>
    </section>
  );
};

/**
 * Demonstrates the conceptual structure of an HTTP request without attempting
 * to manually reproduce the browser's actual HTTP/2 or HTTP/3 wire format.
 */
export const HttpRequestStructureExample: FC<HttpRequestStructureProps> = ({
  method,
  url,
}: HttpRequestStructureProps): ReactNode => {
  const parsedUrl: URL = new URL(url);

  const requestLine: string = `${method} ${parsedUrl.pathname}${parsedUrl.search} HTTP/1.1`;

  return (
    <section>
      <h3>Understanding HTTP request structure</h3>

      <dl>
        <dt>Request line</dt>
        <dd>{requestLine}</dd>

        <dt>Host</dt>
        <dd>{parsedUrl.host}</dd>

        <dt>Headers</dt>
        <dd>Metadata and control information sent with the request.</dd>

        <dt>Body</dt>
        <dd>Optional application data sent after the request headers.</dd>
      </dl>
    </section>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const HttpRequestContainer: FC = (): ReactNode => {
  return (
    <main>
      <h1>HTTP Request</h1>

      <h2>1. Creating a basic HTTP request</h2>
      <HttpRequestBasicExample url="https://example.com/api/users" />

      <h2>2. Setting the HTTP method</h2>
      <HttpRequestMethodExample url="https://example.com/api/users" method="POST" />

      <h2>3. Adding request headers</h2>
      <HttpRequestHeadersExample url="https://example.com/api/users" authorizationToken="example-token" />

      <h2>4. Adding a request body</h2>
      <HttpRequestBodyExample url="https://example.com/api/users" name="John Doe" />

      <h2>5. Inspecting a Request object</h2>
      <HttpRequestObjectExample url="https://example.com/api/users" method="GET" />

      <h2>6. Understanding HTTP request structure</h2>
      <HttpRequestStructureExample method="GET" url="https://example.com/api/users?page=2" />
    </main>
  );
};

export default HttpRequestContainer;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - An HTTP request contains a method, target URL, headers, and an optional body.
// - The HTTP method communicates the intended operation on the target resource.
// - Request headers provide metadata and control information.
// - A request body carries optional application data.
// - The `Request` Web API represents an HTTP request programmatically.
// - `Request` exposes properties such as `url`, `method`, `headers`, `mode`, `credentials`, and `redirect`.
// - JSON request bodies must be serialized explicitly and normally use `Content-Type: application/json`.
// - Authorization headers should contain appropriately protected credentials in real applications.
// - GET and HEAD requests cannot have a request body through the Fetch API.
// - HTTP/1.1 has a textual request-line and header representation, while HTTP/2 and HTTP/3 use different wire formats with equivalent request semantics.
// - HTTP requests and HTTP responses are separate protocol messages with different metadata and bodies.
