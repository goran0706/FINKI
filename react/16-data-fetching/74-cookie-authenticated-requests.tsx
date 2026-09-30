/**
 * Cookie Authenticated Requests
 * =============================
 *
 * A cookie-authenticated request relies on the browser to attach an eligible
 * authentication cookie to an HTTP request. Application code does not manually
 * place the cookie value into an Authorization header. The browser evaluates
 * the cookie's Domain, Path, Secure, SameSite, expiration, and HttpOnly rules
 * before deciding whether the cookie can participate in the request.
 *
 * For same-origin requests, browsers can send matching cookies automatically.
 * For cross-origin requests made by browser JavaScript, Axios can request that
 * credentials be included by setting withCredentials: true. The server must
 * also permit credentialed cross-origin requests through compatible CORS
 * headers. Axios cannot override browser cookie policy.
 *
 * An HttpOnly cookie is particularly useful for session authentication because
 * JavaScript cannot read its value through document.cookie. The browser can
 * still attach that cookie to an eligible request, so application code can use
 * the authenticated session without handling the credential itself.
 *
 * A successful authenticated response does not necessarily mean that the
 * browser's cookie will remain valid indefinitely. The server can expire or
 * revoke a session independently of the browser's stored cookie. A 401
 * response commonly indicates that the current request is not authenticated,
 * although an application's API contract determines the exact semantics.
 *
 * Cookie authentication also differs from bearer-token authentication. A
 * bearer
 * token is commonly read by application code and placed into an Authorization
 * header, while a cookie-authenticated request delegates credential attachment
 * to the browser. This difference affects request construction, CSRF defenses,
 * credential visibility, and logout behavior.
 *
 * A common edge case is assuming that withCredentials makes every cross-origin
 * request authenticated. It does not. The cookie must satisfy browser cookie
 * rules, and the server must support credentialed CORS when the request is
 * cross-origin. Another common misconception is that receiving a 200 response
 * proves a cookie was sent; the endpoint may be public or may authenticate the
 * request through another mechanism.
 */

import React, { useState } from "react";
import axios, { AxiosInstance, AxiosResponse } from "axios";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface CookieAuthenticatedRequestProps {
  readonly client: AxiosInstance;
}

export interface CookieAuthenticatedCredentialsProps {
  readonly client: AxiosInstance;
}

export interface CookieAuthenticatedIdentityProps {
  readonly client: AxiosInstance;
}

export interface CookieAuthenticatedUnauthorizedProps {
  readonly client: AxiosInstance;
}

export interface CookieAuthenticatedLogoutProps {
  readonly client: AxiosInstance;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * Demonstrates a same-origin cookie-authenticated request.
 *
 * The request does not contain an Authorization header. The browser is
 * responsible for attaching any matching authentication cookie.
 */
export const CookieAuthenticatedRequest: React.FC<CookieAuthenticatedRequestProps> = ({
  client,
}: CookieAuthenticatedRequestProps): React.ReactElement => {
  const [message, setMessage] = useState<string>("Ready.");
  const [loading, setLoading] = useState<boolean>(false);

  const handleRequest = async (): Promise<void> => {
    setLoading(true);
    setMessage("Requesting authenticated data...");

    try {
      const response: AxiosResponse<{
        readonly message: string;
      }> = await client.get<{
        readonly message: string;
      }>("/users/me");

      setMessage(response.data.message);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setMessage(`Request failed with HTTP ${error.response?.status ?? "unknown"}.`);
      } else {
        setMessage("Request failed unexpectedly.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <p>Authentication is supplied by an eligible browser cookie.</p>

      <button type="button" onClick={handleRequest} disabled={loading}>
        {loading ? "Requesting..." : "Request Authenticated Data"}
      </button>

      <p role="status">{message}</p>
    </section>
  );
};

/**
 * Demonstrates enabling credentials for a cross-origin Axios request.
 *
 * withCredentials requests that the browser include eligible credentials such
 * as cookies. The server must explicitly support credentialed CORS for the
 * browser to expose the cross-origin response to JavaScript.
 */
export const CookieAuthenticatedCredentials: React.FC<CookieAuthenticatedCredentialsProps> = ({
  client,
}: CookieAuthenticatedCredentialsProps): React.ReactElement => {
  const [message, setMessage] = useState<string>("Ready.");
  const [loading, setLoading] = useState<boolean>(false);

  const handleRequest = async (): Promise<void> => {
    setLoading(true);
    setMessage("Sending a credentialed cross-origin request...");

    try {
      await client.get<unknown>("/users/me", {
        withCredentials: true,
      });

      setMessage("The credentialed request completed successfully.");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setMessage(`Credentialed request failed with HTTP ${error.response?.status ?? "unknown"}.`);
      } else {
        setMessage("Credentialed request failed unexpectedly.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <p>Axios credential mode: withCredentials=true</p>

      <button type="button" onClick={handleRequest} disabled={loading}>
        {loading ? "Requesting..." : "Send Credentialed Request"}
      </button>

      <p role="status">{message}</p>
    </section>
  );
};

/**
 * Demonstrates retrieving authenticated identity information from the server.
 *
 * The client does not inspect the authentication cookie. Instead, the server
 * determines the authenticated identity and returns application data.
 */
export const CookieAuthenticatedIdentity: React.FC<CookieAuthenticatedIdentityProps> = ({
  client,
}: CookieAuthenticatedIdentityProps): React.ReactElement => {
  const [identity, setIdentity] = useState<string | null>(null);
  const [message, setMessage] = useState<string>("Ready.");
  const [loading, setLoading] = useState<boolean>(false);

  const handleLoadIdentity = async (): Promise<void> => {
    setLoading(true);
    setMessage("Loading the authenticated identity...");

    try {
      const response: AxiosResponse<{
        readonly name: string;
      }> = await client.get<{
        readonly name: string;
      }>("/auth/session", {
        withCredentials: true,
      });

      setIdentity(response.data.name);
      setMessage("The server returned the authenticated identity.");
    } catch (error: unknown) {
      setIdentity(null);

      if (axios.isAxiosError(error) && error.response?.status === 401) {
        setMessage("The server reported that the session is unauthenticated.");
      } else if (axios.isAxiosError(error)) {
        setMessage(`Identity request failed with HTTP ${error.response?.status ?? "unknown"}.`);
      } else {
        setMessage("Identity request failed unexpectedly.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <p>Authenticated identity: {identity ?? "Unknown"}</p>

      <button type="button" onClick={handleLoadIdentity} disabled={loading}>
        {loading ? "Loading..." : "Load Identity"}
      </button>

      <p role="status">{message}</p>
    </section>
  );
};

/**
 * Demonstrates explicit handling of an unauthenticated response.
 *
 * A 401 response can be handled as an authentication-state transition rather
 * than treated as an unexpected application crash.
 */
export const CookieAuthenticatedUnauthorized: React.FC<CookieAuthenticatedUnauthorizedProps> = ({
  client,
}: CookieAuthenticatedUnauthorizedProps): React.ReactElement => {
  const [authenticationState, setAuthenticationState] = useState<"unknown" | "authenticated" | "unauthenticated">(
    "unknown",
  );

  const [message, setMessage] = useState<string>("Authentication state has not been checked.");
  const [loading, setLoading] = useState<boolean>(false);

  const handleCheck = async (): Promise<void> => {
    setLoading(true);
    setAuthenticationState("unknown");

    try {
      await client.get<unknown>("/auth/session", {
        withCredentials: true,
      });

      setAuthenticationState("authenticated");
      setMessage("The server accepted the authentication session.");
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        setAuthenticationState("unauthenticated");
        setMessage("The server returned 401, so the current request is unauthenticated.");
      } else if (axios.isAxiosError(error)) {
        setAuthenticationState("unknown");
        setMessage(`The request failed with HTTP ${error.response?.status ?? "unknown"}.`);
      } else {
        setAuthenticationState("unknown");
        setMessage("The request failed unexpectedly.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <p>Authentication state: {authenticationState}</p>

      <button type="button" onClick={handleCheck} disabled={loading}>
        {loading ? "Checking..." : "Check Authentication"}
      </button>

      <p role="status">{message}</p>
    </section>
  );
};

/**
 * Demonstrates server-managed logout for cookie authentication.
 *
 * The client does not need to read or delete the authentication cookie. The
 * logout endpoint can expire the cookie and invalidate the corresponding
 * server-side session.
 */
export const CookieAuthenticatedLogout: React.FC<CookieAuthenticatedLogoutProps> = ({
  client,
}: CookieAuthenticatedLogoutProps): React.ReactElement => {
  const [authenticated, setAuthenticated] = useState<boolean>(true);
  const [message, setMessage] = useState<string>("Example authenticated session is active.");
  const [loading, setLoading] = useState<boolean>(false);

  const handleLogout = async (): Promise<void> => {
    setLoading(true);
    setMessage("Requesting server-side logout...");

    try {
      await client.post<void>("/auth/logout", undefined, {
        withCredentials: true,
      });

      setAuthenticated(false);
      setMessage(
        "The logout endpoint completed. The server can expire the authentication cookie and invalidate the session.",
      );
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setMessage(`Logout failed with HTTP ${error.response?.status ?? "unknown"}.`);
      } else {
        setMessage("Logout failed unexpectedly.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <p>Authenticated session: {authenticated ? "Yes" : "No"}</p>

      <button type="button" onClick={handleLogout} disabled={loading}>
        {loading ? "Logging Out..." : "Log Out"}
      </button>

      <p role="status">{message}</p>
    </section>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const apiClient: AxiosInstance = axios.create({
  baseURL: "https://api.example.com",
  timeout: 5000,
});

export const CookieAuthenticatedRequestsDemo: React.FC = (): React.ReactElement => {
  return (
    <main>
      <h1>Cookie Authenticated Requests</h1>

      <h2>1. Send an Authenticated Request With a Browser Cookie</h2>
      <CookieAuthenticatedRequest client={apiClient} />

      <h2>2. Enable Credentials for a Cross-Origin Request</h2>
      <CookieAuthenticatedCredentials client={apiClient} />

      <h2>3. Read Authenticated Identity From the Server</h2>
      <CookieAuthenticatedIdentity client={apiClient} />

      <h2>4. Handle an Unauthenticated 401 Response</h2>
      <CookieAuthenticatedUnauthorized client={apiClient} />

      <h2>5. Log Out Through a Cookie-Aware Server Endpoint</h2>
      <CookieAuthenticatedLogout client={apiClient} />
    </main>
  );
};

export default CookieAuthenticatedRequestsDemo;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Cookie-authenticated requests rely on the browser to attach eligible authentication cookies.
// - Application code does not need to place a cookie value into an Authorization header.
// - Axios withCredentials enables credentialed cross-origin requests, subject to browser cookie rules and server CORS policy.
// - HttpOnly cookies can authenticate requests without exposing the credential value to JavaScript.
// - A successful response does not by itself prove that a particular authentication cookie was used.
// - A 401 response can represent an unauthenticated request and should be handled according to the API contract.
// - Server responses can provide the authenticated identity without exposing the underlying cookie value.
// - Cookie authentication and bearer-token authentication differ in how credentials are attached to requests.
// - Logout normally uses a server endpoint that expires the cookie and invalidates the corresponding authentication session.
