/**
 * Fetch Options
 * =============
 *
 * The second argument passed to fetch() is a RequestInit object that controls
 * how the request is made. It can configure the HTTP method, request headers,
 * request body, credentials mode, cache behavior, redirect behavior, referrer
 * policy, abort signal, and other request characteristics.
 *
 * fetch(input, init) creates a Request using the supplied input and options.
 * The resulting Request is then used by the browser's networking layer. Some
 * options affect browser behavior before a request is sent, while others become
 * HTTP request properties such as the method, headers, and body.
 *
 * RequestInit is intentionally flexible. For example, `body` accepts several
 * BodyInit-compatible values, including strings, URLSearchParams, FormData, and
 * Blob. A body is generally appropriate for methods such as POST, PUT, and
 * PATCH, while GET and HEAD requests cannot contain a request body.
 *
 * The `headers` option can be supplied as a Headers object, an iterable of
 * header name/value pairs, or a plain object whose values are strings.
 * Browser-controlled restrictions still apply to certain request headers.
 *
 * The `credentials` option controls whether credentials such as cookies are
 * included with requests. Its values are "omit", "same-origin", and "include".
 * Cross-origin credentialed requests can also be subject to CORS requirements.
 *
 * The `signal` option connects fetch() to an AbortSignal. Calling abort() on
 * the associated AbortController causes an active fetch to reject with an
 * AbortError.
 *
 * Options such as `cache`, `redirect`, and `referrerPolicy` influence browser
 * request behavior rather than simply becoming HTTP headers. They should not
 * be confused with arbitrary custom request headers.
 */

import { type FC, type ReactNode, useState } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface FetchMethodOptionProps {
  readonly url: string;
  readonly method: string;
}

export interface FetchHeadersOptionProps {
  readonly url: string;
  readonly headerName: string;
  readonly headerValue: string;
}

export interface FetchBodyOptionProps {
  readonly url: string;
  readonly name: string;
  readonly email: string;
}

export interface FetchCredentialsOptionProps {
  readonly url: string;
  readonly credentials: RequestCredentials;
}

export interface FetchCacheOptionProps {
  readonly url: string;
  readonly cache: RequestCache;
}

export interface FetchRedirectOptionProps {
  readonly url: string;
  readonly redirect: RequestRedirect;
}

export interface FetchReferrerPolicyOptionProps {
  readonly url: string;
  readonly referrerPolicy: ReferrerPolicy;
}

export interface FetchSignalOptionProps {
  readonly url: string;
}

export interface FetchCombinedOptionsProps {
  readonly url: string;
  readonly method: string;
  readonly headerName: string;
  readonly headerValue: string;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * Demonstrates configuring the HTTP method through RequestInit.
 */
export const FetchMethodOptionExample: FC<FetchMethodOptionProps> = ({
  url,
  method,
}: FetchMethodOptionProps): ReactNode => {
  const request: Request = new Request(url, {
    method,
  });

  return (
    <section>
      <h3>Method option</h3>

      <p>URL: {request.url}</p>

      <p>Method: {request.method}</p>

      <p>The `method` option controls the HTTP request method used by fetch().</p>
    </section>
  );
};

/**
 * Demonstrates configuring request headers with RequestInit.
 */
export const FetchHeadersOptionExample: FC<FetchHeadersOptionProps> = ({
  url,
  headerName,
  headerValue,
}: FetchHeadersOptionProps): ReactNode => {
  const request: Request = new Request(url, {
    headers: {
      [headerName]: headerValue,
    },
  });

  const configuredValue: string | null = request.headers.get(headerName);

  return (
    <section>
      <h3>Headers option</h3>

      <p>Header name: {headerName}</p>

      <p>Header value: {configuredValue ?? "Not configured"}</p>
    </section>
  );
};

/**
 * Demonstrates supplying a JSON request body through RequestInit.
 */
export const FetchBodyOptionExample: FC<FetchBodyOptionProps> = ({
  url,
  name,
  email,
}: FetchBodyOptionProps): ReactNode => {
  const body: string = JSON.stringify({
    name,
    email,
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
      <h3>Body option</h3>

      <p>Method: {request.method}</p>

      <p>Content-Type: {request.headers.get("Content-Type") ?? "Not configured"}</p>

      <p>Request body: {body}</p>
    </section>
  );
};

/**
 * Demonstrates the three standard fetch credentials modes.
 */
export const FetchCredentialsOptionExample: FC<FetchCredentialsOptionProps> = ({
  url,
  credentials,
}: FetchCredentialsOptionProps): ReactNode => {
  const request: Request = new Request(url, {
    credentials,
  });

  return (
    <section>
      <h3>Credentials option</h3>

      <p>URL: {request.url}</p>

      <p>Credentials mode: {request.credentials}</p>

      <p>
        `omit` excludes credentials, `same-origin` uses credentials for same-origin requests, and `include` permits
        credentials for cross-origin requests subject to browser security and CORS requirements.
      </p>
    </section>
  );
};

/**
 * Demonstrates the cache option, which controls the browser's cache behavior
 * for the fetch request.
 */
export const FetchCacheOptionExample: FC<FetchCacheOptionProps> = ({
  url,
  cache,
}: FetchCacheOptionProps): ReactNode => {
  const request: Request = new Request(url, {
    cache,
  });

  return (
    <section>
      <h3>Cache option</h3>

      <p>Cache mode: {request.cache}</p>

      <p>The cache option controls how the browser interacts with its HTTP cache for the request.</p>
    </section>
  );
};

/**
 * Demonstrates redirect behavior controlled through RequestInit.
 */
export const FetchRedirectOptionExample: FC<FetchRedirectOptionProps> = ({
  url,
  redirect,
}: FetchRedirectOptionProps): ReactNode => {
  const request: Request = new Request(url, {
    redirect,
  });

  return (
    <section>
      <h3>Redirect option</h3>

      <p>Redirect mode: {request.redirect}</p>

      <p>
        `follow` permits normal redirect following, `error` rejects when a redirect is encountered, and `manual` exposes
        redirect handling to the Fetch API according to browser rules.
      </p>
    </section>
  );
};

/**
 * Demonstrates selecting a referrer policy through RequestInit.
 */
export const FetchReferrerPolicyOptionExample: FC<FetchReferrerPolicyOptionProps> = ({
  url,
  referrerPolicy,
}: FetchReferrerPolicyOptionProps): ReactNode => {
  const request: Request = new Request(url, {
    referrerPolicy,
  });

  return (
    <section>
      <h3>Referrer policy option</h3>

      <p>URL: {request.url}</p>

      <p>Referrer policy: {request.referrerPolicy || "Not explicitly configured"}</p>

      <p>Referrer policy controls which referrer information the browser may include with requests.</p>
    </section>
  );
};

/**
 * Demonstrates connecting an AbortSignal to fetch through RequestInit.
 */
export const FetchSignalOptionExample: FC<FetchSignalOptionProps> = ({ url }: FetchSignalOptionProps): ReactNode => {
  const [message, setMessage] = useState<string>("Request is idle");

  const handleRequest = (): void => {
    const controller: AbortController = new AbortController();

    const request: Request = new Request(url, {
      signal: controller.signal,
    });

    const run: () => Promise<void> = async (): Promise<void> => {
      try {
        await fetch(request);

        setMessage("Request completed.");
      } catch (error: unknown) {
        if (error instanceof DOMException && error.name === "AbortError") {
          setMessage("Request was aborted.");
          return;
        }

        setMessage("Request failed.");
      }
    };

    void run();

    controller.abort();
  };

  return (
    <section>
      <h3>Signal option</h3>

      <p>{message}</p>

      <button type="button" onClick={handleRequest}>
        Start and abort request
      </button>
    </section>
  );
};

/**
 * Demonstrates combining several RequestInit properties into a single Request.
 */
export const FetchCombinedOptionsExample: FC<FetchCombinedOptionsProps> = ({
  url,
  method,
  headerName,
  headerValue,
}: FetchCombinedOptionsProps): ReactNode => {
  const request: Request = new Request(url, {
    method,
    headers: {
      [headerName]: headerValue,
    },
    credentials: "same-origin",
    cache: "no-store",
    redirect: "follow",
    referrerPolicy: "strict-origin-when-cross-origin",
  });

  return (
    <section>
      <h3>Combining fetch options</h3>

      <ul>
        <li>Method: {request.method}</li>

        <li>Header: {request.headers.get(headerName) ?? "Not configured"}</li>

        <li>Credentials: {request.credentials}</li>

        <li>Cache: {request.cache}</li>

        <li>Redirect: {request.redirect}</li>

        <li>Referrer policy: {request.referrerPolicy || "Not explicitly configured"}</li>
      </ul>
    </section>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const FetchOptionsContainer: FC = (): ReactNode => {
  return (
    <main>
      <h1>Fetch Options</h1>

      <h2>1. Configuring the HTTP method</h2>
      <FetchMethodOptionExample url="https://example.com/api/users" method="GET" />

      <h2>2. Configuring request headers</h2>
      <FetchHeadersOptionExample
        url="https://example.com/api/users"
        headerName="X-Example-Header"
        headerValue="example"
      />

      <h2>3. Configuring a request body</h2>
      <FetchBodyOptionExample url="https://example.com/api/users" name="John Doe" email="john.doe@example.com" />

      <h2>4. Configuring credentials</h2>
      <FetchCredentialsOptionExample url="https://example.com/api/profile" credentials="include" />

      <h2>5. Configuring cache behavior</h2>
      <FetchCacheOptionExample url="https://example.com/api/users" cache="no-store" />

      <h2>6. Configuring redirect behavior</h2>
      <FetchRedirectOptionExample url="https://example.com/api/users" redirect="follow" />

      <h2>7. Configuring referrer policy</h2>
      <FetchReferrerPolicyOptionExample
        url="https://example.com/api/users"
        referrerPolicy="strict-origin-when-cross-origin"
      />

      <h2>8. Configuring request cancellation</h2>
      <FetchSignalOptionExample url="https://example.com/api/users" />

      <h2>9. Combining multiple fetch options</h2>
      <FetchCombinedOptionsExample
        url="https://example.com/api/users"
        method="GET"
        headerName="X-Example-Header"
        headerValue="example"
      />
    </main>
  );
};

export default FetchOptionsContainer;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - The second argument to fetch() is a RequestInit object.
// - RequestInit can configure method, headers, body, credentials, cache, redirects, referrer policy, and an AbortSignal.
// - The method option controls the HTTP method used for the request.
// - The headers option configures request headers subject to browser restrictions.
// - The body option supplies request content and cannot be used with GET or HEAD requests.
// - JSON request bodies should normally be serialized and accompanied by an application/json Content-Type.
// - The credentials option controls whether credentials such as cookies are included.
// - Cross-origin credentialed requests are also subject to CORS rules.
// - The cache option controls browser cache interaction for the request.
// - The redirect option controls how fetch handles HTTP redirects.
// - The referrerPolicy option controls referrer information sent by the browser.
// - The signal option connects fetch() to an AbortSignal for cancellation.
// - RequestInit options are not all HTTP headers; several control browser networking behavior directly.
// - Multiple RequestInit options can be combined in the same fetch() call.
