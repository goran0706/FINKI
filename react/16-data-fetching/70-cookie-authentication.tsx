/**
 * Cookie Authentication
 * =====================
 *
 * Cookie authentication uses an HTTP cookie as the browser-managed credential
 * associated with requests to a server. The browser can attach matching cookies
 * automatically according to cookie attributes such as Domain, Path, Secure,
 * SameSite, and expiration.
 *
 * HttpOnly is an important security attribute for authentication cookies. An
 * HttpOnly cookie is sent with eligible HTTP requests but cannot be read through
 * document.cookie by JavaScript. This reduces direct JavaScript access to the
 * credential, although it does not make the application immune to attacks.
 *
 * Secure instructs the browser to send the cookie only over HTTPS, except for
 * browser-specific localhost handling. SameSite controls when cookies are sent
 * with cross-site requests and is an important part of CSRF defense. SameSite
 * configuration does not replace a complete CSRF strategy for every
 * authentication architecture.
 *
 * JavaScript cannot create an HttpOnly cookie. A server must normally establish
 * an HttpOnly authentication cookie with a Set-Cookie response header. Client
 * JavaScript can request the server with credentials included, but it cannot
 * inspect an HttpOnly authentication cookie's value.
 *
 * With Axios, requests made to the same origin naturally use eligible browser
 * cookies. Cross-origin requests require the Axios withCredentials option, and
 * the server must allow credentialed cross-origin requests through the
 * appropriate CORS configuration. The browser still applies cookie rules
 * independently of Axios.
 *
 * A common misconception is that "cookie authentication" always means an
 * HttpOnly session cookie. Cookies can also be readable by JavaScript when
 * HttpOnly is absent, but authentication designs that use sensitive session
 * credentials commonly use HttpOnly cookies so application JavaScript does not
 * need direct access to the credential.
 *
 * Another important distinction is authentication versus authorization. The
 * authentication cookie identifies an authenticated browser session to the
 * server; authorization is the server's separate decision about what that
 * authenticated identity may access.
 */

import React, { useState } from "react";
import axios, { AxiosInstance, AxiosResponse } from "axios";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface CookieAuthenticationProps {
  readonly client: AxiosInstance;
}

export interface HttpOnlyCookieProps {
  readonly client: AxiosInstance;
}

export interface CookieCredentialsProps {
  readonly client: AxiosInstance;
}

export interface CookieLogoutProps {
  readonly client: AxiosInstance;
}

export interface CookieAuthenticationStateProps {
  readonly client: AxiosInstance;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * Demonstrates requesting authenticated data when authentication is maintained
 * by a browser cookie.
 *
 * The component does not read or construct the authentication cookie. The
 * browser manages the cookie and Axios sends the request normally.
 */
export const CookieAuthentication: React.FC<CookieAuthenticationProps> = ({
  client,
}: CookieAuthenticationProps): React.ReactElement => {
  const [authenticated, setAuthenticated] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("Ready.");
  const [loading, setLoading] = useState<boolean>(false);

  const handleRequest = async (): Promise<void> => {
    setLoading(true);
    setMessage("Requesting authenticated data...");

    try {
      const response: AxiosResponse<{
        readonly name: string;
      }> = await client.get<{
        readonly name: string;
      }>("/users/me");

      setAuthenticated(true);
      setMessage(`Authenticated as ${response.data.name}.`);
    } catch (error: unknown) {
      setAuthenticated(false);

      if (axios.isAxiosError(error)) {
        setMessage(`Authentication request failed with HTTP ${error.response?.status ?? "unknown"}.`);
      } else {
        setMessage("Authentication request failed unexpectedly.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <p>Authenticated: {authenticated ? "Yes" : "No"}</p>

      <button type="button" onClick={handleRequest} disabled={loading}>
        {loading ? "Requesting..." : "Request With Cookie"}
      </button>

      <p role="status">{message}</p>
    </section>
  );
};

/**
 * Demonstrates the client-side limitation of an HttpOnly authentication cookie.
 *
 * JavaScript cannot retrieve an HttpOnly cookie through document.cookie. The
 * browser can still attach that cookie to an eligible request, so application
 * code can use the authenticated session without handling the credential value.
 */
export const HttpOnlyCookie: React.FC<HttpOnlyCookieProps> = ({ client }: HttpOnlyCookieProps): React.ReactElement => {
  const [message, setMessage] = useState<string>("An HttpOnly cookie is not readable by client JavaScript.");
  const [loading, setLoading] = useState<boolean>(false);

  const handleRequest = async (): Promise<void> => {
    setLoading(true);
    setMessage("The browser is making a request without JavaScript reading the cookie.");

    try {
      await client.get<unknown>("/users/me");

      setMessage("The request completed. The browser handled eligible cookies.");
    } catch (error: unknown) {
      setMessage(
        axios.isAxiosError(error)
          ? `The request returned HTTP ${error.response?.status ?? "unknown"}.`
          : "The request failed unexpectedly.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <p>Cookie value readable by JavaScript: No, when the server sets it with HttpOnly.</p>

      <button type="button" onClick={handleRequest} disabled={loading}>
        {loading ? "Requesting..." : "Use Browser-Managed Cookie"}
      </button>

      <p role="status">{message}</p>
    </section>
  );
};

/**
 * Demonstrates Axios's withCredentials option for credentialed requests.
 *
 * For cross-origin requests, withCredentials tells the browser that credentials
 * such as eligible cookies may be included. The server must also permit
 * credentialed cross-origin requests through compatible CORS response headers.
 */
export const CookieCredentials: React.FC<CookieCredentialsProps> = ({
  client,
}: CookieCredentialsProps): React.ReactElement => {
  const [message, setMessage] = useState<string>("Ready.");
  const [loading, setLoading] = useState<boolean>(false);

  const handleRequest = async (): Promise<void> => {
    setLoading(true);
    setMessage("Sending a credentialed request...");

    try {
      await client.get<unknown>("/users/me", {
        withCredentials: true,
      });

      setMessage("The credentialed request completed.");
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
      <p>withCredentials: true</p>

      <button type="button" onClick={handleRequest} disabled={loading}>
        {loading ? "Requesting..." : "Send Credentialed Request"}
      </button>

      <p role="status">{message}</p>
    </section>
  );
};

/**
 * Demonstrates cookie-based logout through a server endpoint.
 *
 * For an HttpOnly authentication cookie, JavaScript cannot remove the cookie
 * value directly. The server normally expires the cookie by returning an
 * appropriate Set-Cookie response, often from a logout endpoint.
 */
export const CookieLogout: React.FC<CookieLogoutProps> = ({ client }: CookieLogoutProps): React.ReactElement => {
  const [authenticated, setAuthenticated] = useState<boolean>(true);
  const [message, setMessage] = useState<string>("Authenticated session assumed.");
  const [loading, setLoading] = useState<boolean>(false);

  const handleLogout = async (): Promise<void> => {
    setLoading(true);
    setMessage("Requesting server-side session logout...");

    try {
      await client.post<void>("/auth/logout", undefined, {
        withCredentials: true,
      });

      setAuthenticated(false);
      setMessage("The logout endpoint completed. The server can expire the authentication cookie.");
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

/**
 * Demonstrates the distinction between browser cookie storage and authentication
 * state returned by the server.
 *
 * The component does not attempt to infer authentication by inspecting a cookie.
 * Instead, it treats the server's response as the source of truth for whether
 * the current session is authenticated.
 */
export const CookieAuthenticationState: React.FC<CookieAuthenticationStateProps> = ({
  client,
}: CookieAuthenticationStateProps): React.ReactElement => {
  const [state, setState] = useState<"unknown" | "authenticated" | "unauthenticated">("unknown");
  const [message, setMessage] = useState<string>("Authentication state has not been checked.");
  const [loading, setLoading] = useState<boolean>(false);

  const handleCheck = async (): Promise<void> => {
    setLoading(true);
    setState("unknown");
    setMessage("Checking authentication with the server...");

    try {
      await client.get<unknown>("/auth/session", {
        withCredentials: true,
      });

      setState("authenticated");
      setMessage("The server accepted the current authentication session.");
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        setState("unauthenticated");
        setMessage("The server reported that the current session is unauthenticated.");
      } else {
        setState("unknown");
        setMessage("Authentication state could not be determined from this request.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <p>Server authentication state: {state}</p>

      <button type="button" onClick={handleCheck} disabled={loading}>
        {loading ? "Checking..." : "Check Session"}
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

export const CookieAuthenticationDemo: React.FC = (): React.ReactElement => {
  return (
    <main>
      <h1>Cookie Authentication</h1>

      <h2>1. Use a Browser-Managed Authentication Cookie</h2>
      <CookieAuthentication client={apiClient} />

      <h2>2. Keep an HttpOnly Cookie Outside JavaScript Access</h2>
      <HttpOnlyCookie client={apiClient} />

      <h2>3. Send Cookies With Credentialed Axios Requests</h2>
      <CookieCredentials client={apiClient} />

      <h2>4. Log Out Through the Server</h2>
      <CookieLogout client={apiClient} />

      <h2>5. Treat the Server as the Authentication State Authority</h2>
      <CookieAuthenticationState client={apiClient} />
    </main>
  );
};

export default CookieAuthenticationDemo;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Cookie authentication lets the browser attach eligible cookies to HTTP requests.
// - HttpOnly prevents JavaScript from reading an authentication cookie through document.cookie.
// - Secure restricts cookie transmission to HTTPS connections, subject to browser localhost behavior.
// - SameSite controls when cookies participate in cross-site requests and is an important CSRF consideration.
// - JavaScript cannot create or directly remove an HttpOnly cookie; the server normally manages its lifetime through Set-Cookie.
// - Axios withCredentials enables credentialed cross-origin requests, but compatible server-side CORS configuration is also required.
// - Cookie removal in the browser is not the same operation as server-side session invalidation.
// - Authentication state should be determined from server responses rather than inferred solely from cookie presence.
// - Authentication identifies the session, while authorization separately determines what that authenticated session may access.
