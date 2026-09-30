/**
 * Fetch Credentials
 * =================
 *
 * The Fetch API uses the `credentials` RequestInit option to control whether
 * credentials are included with a request and whether credential-related
 * response headers are honored. The available values are `omit`, `same-origin`,
 * and `include`.
 *
 * With `omit`, credentials are excluded from the request. With `same-origin`,
 * credentials are included for same-origin requests but omitted for
 * cross-origin requests. With `include`, credentials are included for both
 * same-origin and cross-origin requests when the browser's security rules
 * permit them.
 *
 * Credentials can include cookies, TLS client certificates, and authentication
 * information associated with a browser-managed URL credential store. The
 * credentials mode does not itself create an authentication token or add an
 * Authorization header.
 *
 * Cross-origin credentialed requests have additional CORS requirements. A
 * server must explicitly allow credentials with
 * `Access-Control-Allow-Credentials: true`, and
 * `Access-Control-Allow-Origin` cannot use the wildcard `*` for a credentialed
 * response. Browser cookie policies, including SameSite restrictions, can also
 * prevent a cookie from being sent even when `credentials: "include"` is set.
 *
 * The credentials option is therefore a browser credential policy, not a
 * guarantee that a particular cookie or authentication mechanism will be sent.
 * The effective behavior depends on the request's origin, cookie attributes,
 * browser privacy rules, and server-side CORS configuration.
 */

import { type FC, type ReactNode, useState } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface FetchCredentialsModeProps {
  readonly url: string;
  readonly credentials: RequestCredentials;
}

export interface FetchCredentialsComparisonProps {
  readonly url: string;
}

export interface FetchCredentialsSameOriginProps {
  readonly sameOriginUrl: string;
  readonly crossOriginUrl: string;
}

export interface FetchCredentialsIncludeProps {
  readonly url: string;
}

export interface FetchCredentialsOmitProps {
  readonly url: string;
}

export interface FetchCredentialsGotchaProps {
  readonly url: string;
}

export interface FetchCredentialsRequestProps {
  readonly url: string;
  readonly credentials: RequestCredentials;
}

export interface FetchCredentialsAbortProps {
  readonly url: string;
  readonly credentials: RequestCredentials;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * Demonstrates configuring a Request with an explicit credentials mode.
 */
export const FetchCredentialsModeExample: FC<FetchCredentialsModeProps> = ({
  url,
  credentials,
}: FetchCredentialsModeProps): ReactNode => {
  const request: Request = new Request(url, {
    credentials,
  });

  return (
    <section>
      <h3>Credentials mode</h3>

      <p>URL: {request.url}</p>

      <p>Credentials: {request.credentials}</p>
    </section>
  );
};

/**
 * Demonstrates the three credentials modes without making a network request.
 */
export const FetchCredentialsComparisonExample: FC<FetchCredentialsComparisonProps> = ({
  url,
}: FetchCredentialsComparisonProps): ReactNode => {
  const omitRequest: Request = new Request(url, {
    credentials: "omit",
  });

  const sameOriginRequest: Request = new Request(url, {
    credentials: "same-origin",
  });

  const includeRequest: Request = new Request(url, {
    credentials: "include",
  });

  return (
    <section>
      <h3>Credentials mode comparison</h3>

      <ul>
        <li>omit: {omitRequest.credentials}</li>

        <li>same-origin: {sameOriginRequest.credentials}</li>

        <li>include: {includeRequest.credentials}</li>
      </ul>

      <p>
        The mode is stored on the Request and determines how the Fetch algorithm handles credentials for the request.
      </p>
    </section>
  );
};

/**
 * Demonstrates that same-origin is conditional on the relationship between
 * the request URL and the page's origin.
 */
export const FetchCredentialsSameOriginExample: FC<FetchCredentialsSameOriginProps> = ({
  sameOriginUrl,
  crossOriginUrl,
}: FetchCredentialsSameOriginProps): ReactNode => {
  const sameOriginRequest: Request = new Request(sameOriginUrl, {
    credentials: "same-origin",
  });

  const crossOriginRequest: Request = new Request(crossOriginUrl, {
    credentials: "same-origin",
  });

  return (
    <section>
      <h3>same-origin credentials</h3>

      <p>Same-origin URL: {sameOriginRequest.url}</p>

      <p>Cross-origin URL: {crossOriginRequest.url}</p>

      <p>
        Both requests have the same credentials mode, but the mode is evaluated relative to the document origin when the
        request is performed.
      </p>
    </section>
  );
};

/**
 * Demonstrates explicitly selecting include for a request that may need
 * credentials across origins.
 */
export const FetchCredentialsIncludeExample: FC<FetchCredentialsIncludeProps> = ({
  url,
}: FetchCredentialsIncludeProps): ReactNode => {
  const request: Request = new Request(url, {
    credentials: "include",
  });

  return (
    <section>
      <h3>include credentials</h3>

      <p>Credentials mode: {request.credentials}</p>

      <p>
        include requests credentials for cross-origin requests as well as same-origin requests, subject to browser
        security and cookie policies.
      </p>
    </section>
  );
};

/**
 * Demonstrates explicitly excluding credentials from a request.
 */
export const FetchCredentialsOmitExample: FC<FetchCredentialsOmitProps> = ({
  url,
}: FetchCredentialsOmitProps): ReactNode => {
  const request: Request = new Request(url, {
    credentials: "omit",
  });

  return (
    <section>
      <h3>omit credentials</h3>

      <p>Credentials mode: {request.credentials}</p>

      <p>omit prevents credentials from being included with the request.</p>
    </section>
  );
};

/**
 * Demonstrates the distinction between the credentials option and an
 * Authorization header.
 */
export const FetchCredentialsGotchaExample: FC<FetchCredentialsGotchaProps> = ({
  url,
}: FetchCredentialsGotchaProps): ReactNode => {
  const request: Request = new Request(url, {
    credentials: "include",
  });

  const authorization: string | null = request.headers.get("Authorization");

  return (
    <section>
      <h3>Credentials do not create Authorization headers</h3>

      <p>Credentials mode: {request.credentials}</p>

      <p>Authorization header: {authorization ?? "Not configured"}</p>

      <p>The credentials option does not automatically create a Bearer token or Authorization header.</p>
    </section>
  );
};

/**
 * Demonstrates passing credentials through fetch() RequestInit.
 */
export const FetchCredentialsRequestExample: FC<FetchCredentialsRequestProps> = ({
  url,
  credentials,
}: FetchCredentialsRequestProps): ReactNode => {
  const [message, setMessage] = useState<string>("Request not started");

  const handleRequest = (): void => {
    const request: Request = new Request(url, {
      credentials,
    });

    const run: () => Promise<void> = async (): Promise<void> => {
      try {
        const response: Response = await fetch(request);

        setMessage(`HTTP ${response.status}; credentials mode: ${request.credentials}`);
      } catch (error: unknown) {
        if (error instanceof TypeError) {
          setMessage("The browser rejected the request.");
          return;
        }

        setMessage("The request failed.");
      }
    };

    void run();
  };

  return (
    <section>
      <h3>Using credentials with fetch()</h3>

      <p>{message}</p>

      <button type="button" onClick={handleRequest}>
        Send request
      </button>
    </section>
  );
};

/**
 * Demonstrates combining credentials with an AbortSignal so the request can
 * be cancelled without changing its credentials mode.
 */
export const FetchCredentialsAbortExample: FC<FetchCredentialsAbortProps> = ({
  url,
  credentials,
}: FetchCredentialsAbortProps): ReactNode => {
  const [message, setMessage] = useState<string>("Request is idle");

  const handleRequest = (): void => {
    const controller: AbortController = new AbortController();

    const request: Request = new Request(url, {
      credentials,
      signal: controller.signal,
    });

    setMessage(`Request started with ${request.credentials} credentials.`);

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
      <h3>Credentials and request cancellation</h3>

      <p>{message}</p>

      <button type="button" onClick={handleRequest}>
        Start and abort request
      </button>
    </section>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const FetchCredentialsContainer: FC = (): ReactNode => {
  return (
    <main>
      <h1>Fetch Credentials</h1>

      <h2>1. Configuring a credentials mode</h2>
      <FetchCredentialsModeExample url="https://example.com/api/profile" credentials="include" />

      <h2>2. Comparing the three credentials modes</h2>
      <FetchCredentialsComparisonExample url="https://example.com/api/profile" />

      <h2>3. Understanding same-origin credentials</h2>
      <FetchCredentialsSameOriginExample
        sameOriginUrl="/api/profile"
        crossOriginUrl="https://example.com/api/profile"
      />

      <h2>4. Including credentials</h2>
      <FetchCredentialsIncludeExample url="https://example.com/api/profile" />

      <h2>5. Omitting credentials</h2>
      <FetchCredentialsOmitExample url="https://example.com/api/profile" />

      <h2>6. Distinguishing credentials from Authorization headers</h2>
      <FetchCredentialsGotchaExample url="https://example.com/api/profile" />

      <h2>7. Passing credentials to fetch()</h2>
      <FetchCredentialsRequestExample url="https://example.com/api/profile" credentials="include" />

      <h2>8. Combining credentials with cancellation</h2>
      <FetchCredentialsAbortExample url="https://example.com/api/profile" credentials="include" />
    </main>
  );
};

export default FetchCredentialsContainer;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - RequestInit.credentials controls the credentials mode used by fetch().
// - The available credentials modes are "omit", "same-origin", and "include".
// - "omit" excludes credentials from the request.
// - "same-origin" includes credentials for same-origin requests.
// - "include" permits credentials for cross-origin requests subject to browser security rules.
// - The credentials option does not create an Authorization header or authentication token.
// - Cross-origin credentialed requests require compatible CORS response headers.
// - Access-Control-Allow-Credentials must be true for credentialed cross-origin responses.
// - Access-Control-Allow-Origin cannot be "*" for a credentialed cross-origin response.
// - Cookie attributes such as SameSite can still prevent a cookie from being sent.
// - Browser privacy and storage policies can also affect whether credentials are available.
// - credentials: "include" is not a guarantee that a particular cookie or credential will be sent.
// - The credentials mode can be combined with other RequestInit options such as signal.
