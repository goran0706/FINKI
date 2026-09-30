/**
 * SSE Authentication
 * ==================
 *
 * Server-Sent Events use an HTTP request to establish the event stream, so authentication follows
 * normal HTTP credential rules. In browser applications, `EventSource` does not provide a general
 * mechanism for setting arbitrary request headers such as `Authorization`. Authentication is
 * therefore commonly based on an existing browser session cookie or another credential mechanism
 * supported by the server and browser.
 *
 * For cross-origin authenticated SSE, the `withCredentials` constructor option allows applicable
 * credentials such as cookies to be included in the request. The server must explicitly allow
 * credentialed cross-origin requests and must validate the authenticated session before sending
 * protected events. Authentication identifies the client; authorization determines which event
 * stream that client is permitted to access.
 */

import React, { useEffect, useState } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

interface SseCookieAuthenticationProps {
  readonly url: string;
}

interface SseCredentialedAuthenticationProps {
  readonly url: string;
  readonly withCredentials: boolean;
}

interface SseAuthorizationProps {
  readonly authenticated: boolean;
  readonly canReadStream: boolean;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * Demonstrates authentication through an existing browser session.
 *
 * Cookies applicable to the EventSource request can identify the user's HTTP session. The server
 * validates that session before establishing an authorized event stream. No authentication token
 * is manually added to the EventSource constructor.
 */
export const SseCookieAuthentication: React.FC<SseCookieAuthenticationProps> = ({ url }): React.ReactElement => {
  const [status, setStatus] = useState<string>("Connecting");

  useEffect((): (() => void) => {
    const eventSource: EventSource = new EventSource(url);

    const handleOpen = (_event: Event): void => {
      setStatus("Authenticated session connected");
    };

    const handleError = (_event: Event): void => {
      if (eventSource.readyState === EventSource.CONNECTING) {
        setStatus("Connection interrupted or authentication rejected");
        return;
      }

      setStatus("Closed");
    };

    eventSource.addEventListener("open", handleOpen);
    eventSource.addEventListener("error", handleError);

    return (): void => {
      eventSource.removeEventListener("open", handleOpen);
      eventSource.removeEventListener("error", handleError);
      eventSource.close();
    };
  }, [url]);

  return (
    <div>
      <p>Status: {status}</p>
      <p>Authentication: existing browser session</p>
    </div>
  );
};

/**
 * Demonstrates credentialed EventSource requests.
 *
 * `withCredentials` controls whether the browser can include credentials such as cookies in a
 * cross-origin EventSource request. The server must use compatible CORS response headers and
 * cannot use a wildcard `Access-Control-Allow-Origin` value for a credentialed request.
 */
export const SseCredentialedAuthentication: React.FC<SseCredentialedAuthenticationProps> = ({
  url,
  withCredentials,
}): React.ReactElement => {
  const [status, setStatus] = useState<string>("Connecting");

  useEffect((): (() => void) => {
    const eventSource: EventSource = new EventSource(url, {
      withCredentials,
    });

    const handleOpen = (_event: Event): void => {
      setStatus("Connected");
    };

    const handleError = (_event: Event): void => {
      if (eventSource.readyState === EventSource.CONNECTING) {
        setStatus("Reconnecting");
        return;
      }

      setStatus("Closed");
    };

    eventSource.addEventListener("open", handleOpen);
    eventSource.addEventListener("error", handleError);

    return (): void => {
      eventSource.removeEventListener("open", handleOpen);
      eventSource.removeEventListener("error", handleError);
      eventSource.close();
    };
  }, [url, withCredentials]);

  return (
    <div>
      <p>Status: {status}</p>
      <p>Credentials: {withCredentials ? "enabled" : "disabled"}</p>
    </div>
  );
};

/**
 * Separates authentication from authorization.
 *
 * A successfully authenticated client is not automatically authorized to consume every SSE
 * endpoint. The server must independently check the authenticated identity's permissions before
 * returning protected stream data.
 */
export const SseAuthorization: React.FC<SseAuthorizationProps> = ({
  authenticated,
  canReadStream,
}): React.ReactElement => {
  const accessState: string = !authenticated
    ? "Unauthenticated"
    : canReadStream
      ? "Authorized to read stream"
      : "Authenticated but not authorized";

  return (
    <div>
      <p>Authentication: {authenticated ? "successful" : "failed"}</p>
      <p>Stream access: {accessState}</p>
    </div>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const SseAuthenticationExamples: React.FC = (): React.ReactElement => {
  return (
    <main>
      <h1>SSE Authentication</h1>

      <h2>1. Cookie-Based SSE Authentication</h2>
      <SseCookieAuthentication url="https://example.com/events" />

      <h2>2. Credentialed SSE Requests</h2>
      <SseCredentialedAuthentication url="https://example.com/events" withCredentials={true} />

      <h2>3. Authentication and Authorization</h2>
      <SseAuthorization authenticated={true} canReadStream={true} />
    </main>
  );
};

export default SseAuthenticationExamples;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - SSE authentication uses the underlying HTTP request and normal browser credential mechanisms.
// - EventSource does not provide a general API for manually setting arbitrary HTTP request headers.
// - Existing session cookies can authenticate an SSE request when the server uses cookie-based sessions.
// - `withCredentials` enables applicable credentials for credentialed cross-origin EventSource requests.
// - Credentialed cross-origin SSE requires compatible server-side CORS configuration.
// - A credentialed CORS response cannot use `Access-Control-Allow-Origin: *`.
// - Authentication identifies the client; authorization determines whether that client may consume a stream.
// - The server must validate authentication and authorization before sending protected SSE data.
// - Sensitive credentials should be protected with HTTPS and should not be exposed unnecessarily in URLs.
