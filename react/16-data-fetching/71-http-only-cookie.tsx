/**
 * HttpOnly Cookie
 * ===============
 *
 * An HttpOnly cookie is a browser cookie created with the HttpOnly attribute.
 * The browser can attach the cookie to eligible HTTP requests, but client-side
 * JavaScript cannot read its value through document.cookie.
 *
 * HttpOnly changes which execution contexts can access the credential. Network
 * requests made by the browser can still include the cookie when the cookie's
 * Domain, Path, Secure, SameSite, and expiration rules permit it. JavaScript
 * therefore does not need to know the cookie value to use a cookie-backed
 * authenticated session.
 *
 * An HttpOnly cookie is normally established or updated by a server response
 * containing a Set-Cookie header. The HttpOnly attribute cannot be added to a
 * cookie by JavaScript through document.cookie because document.cookie cannot
 * create a cookie with HttpOnly.
 *
 * With Axios, same-origin requests can use eligible browser cookies normally.
 * Cross-origin requests require withCredentials: true on the client, and the
 * server must allow credentialed CORS requests with a specific allowed origin
 * rather than a wildcard origin. The browser independently applies cookie
 * rules even when Axios requests credentials.
 *
 * HttpOnly reduces direct credential access from JavaScript, but it does not
 * make a web application immune to XSS or other attacks. Malicious JavaScript
 * may still be able to make authenticated requests as the user because the
 * browser can attach the HttpOnly cookie to eligible requests. CSRF protection,
 * output encoding, input validation, and other web security controls remain
 * important.
 *
 * A common misconception is that HttpOnly means the cookie cannot be sent.
 * HttpOnly only prevents JavaScript from reading the cookie. The browser can
 * still include it in requests that satisfy the cookie's rules.
 */

import React, { useState } from "react";
import axios, { AxiosInstance } from "axios";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface HttpOnlyCookieReadProps {
  readonly storage: Storage;
  readonly cookieName: string;
}

export interface HttpOnlyCookieRequestProps {
  readonly client: AxiosInstance;
}

export interface HttpOnlyCookieCredentialsProps {
  readonly client: AxiosInstance;
}

export interface HttpOnlyCookieLogoutProps {
  readonly client: AxiosInstance;
}

export interface HttpOnlyCookieAuthenticationProps {
  readonly client: AxiosInstance;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * Demonstrates that document.cookie does not expose an HttpOnly cookie.
 *
 * JavaScript can inspect non-HttpOnly cookies through document.cookie, but an
 * HttpOnly authentication cookie is intentionally omitted from that API.
 */
export const HttpOnlyCookieRead: React.FC<HttpOnlyCookieReadProps> = ({
  storage,
  cookieName,
}: HttpOnlyCookieReadProps): React.ReactElement => {
  const [message, setMessage] = useState<string>("Ready.");

  const handleRead = (): void => {
    const cookieString: string = storage.getItem(cookieName) ?? "";

    if (cookieString === "") {
      setMessage("No value was exposed through this storage API.");

      return;
    }

    setMessage("A value is available through this storage API.");
  };

  return (
    <section>
      <p>HttpOnly cookies are not exposed through document.cookie.</p>

      <button type="button" onClick={handleRead}>
        Check Client-Readable Cookie Data
      </button>

      <p role="status">{message}</p>
    </section>
  );
};

/**
 * Demonstrates using an HttpOnly cookie without reading its value.
 *
 * The browser manages the credential and can attach it to an eligible request.
 * Application JavaScript only initiates the request and handles its response.
 */
export const HttpOnlyCookieRequest: React.FC<HttpOnlyCookieRequestProps> = ({
  client,
}: HttpOnlyCookieRequestProps): React.ReactElement => {
  const [message, setMessage] = useState<string>("Ready.");
  const [loading, setLoading] = useState<boolean>(false);

  const handleRequest = async (): Promise<void> => {
    setLoading(true);
    setMessage("Sending an authenticated request without reading the cookie value...");

    try {
      await client.get<unknown>("/users/me");

      setMessage("The server accepted the authenticated request.");
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
      <button type="button" onClick={handleRequest} disabled={loading}>
        {loading ? "Requesting..." : "Send Authenticated Request"}
      </button>

      <p role="status">{message}</p>
    </section>
  );
};

/**
 * Demonstrates Axios's withCredentials setting for credentialed requests.
 *
 * For a cross-origin request, withCredentials permits the browser to include
 * eligible cookies. The server must also return compatible credentialed CORS
 * headers for the browser to expose the response to the requesting origin.
 */
export const HttpOnlyCookieCredentials: React.FC<HttpOnlyCookieCredentialsProps> = ({
  client,
}: HttpOnlyCookieCredentialsProps): React.ReactElement => {
  const [message, setMessage] = useState<string>("Ready.");
  const [loading, setLoading] = useState<boolean>(false);

  const handleRequest = async (): Promise<void> => {
    setLoading(true);
    setMessage("Sending a request with browser credentials enabled...");

    try {
      await client.get<unknown>("/auth/session", {
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
      <p>Browser credentials enabled: withCredentials=true</p>

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
 * Because JavaScript cannot directly remove an HttpOnly cookie, the application
 * sends a logout request and lets the server expire or replace the cookie.
 */
export const HttpOnlyCookieLogout: React.FC<HttpOnlyCookieLogoutProps> = ({
  client,
}: HttpOnlyCookieLogoutProps): React.ReactElement => {
  const [authenticated, setAuthenticated] = useState<boolean>(true);
  const [message, setMessage] = useState<string>("Example authenticated state is active.");
  const [loading, setLoading] = useState<boolean>(false);

  const handleLogout = async (): Promise<void> => {
    setLoading(true);
    setMessage("Sending the logout request to the server...");

    try {
      await client.post<void>("/auth/logout", undefined, {
        withCredentials: true,
      });

      setAuthenticated(false);
      setMessage("The logout request completed. The server can expire the HttpOnly cookie.");
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
      <p>Example authenticated state: {authenticated ? "Yes" : "No"}</p>

      <button type="button" onClick={handleLogout} disabled={loading}>
        {loading ? "Logging Out..." : "Log Out"}
      </button>

      <p role="status">{message}</p>
    </section>
  );
};

/**
 * Demonstrates treating the server response as the source of truth for an
 * HttpOnly-cookie authentication session.
 *
 * The component does not attempt to determine authentication by reading a
 * cookie. A successful session endpoint response represents an authenticated
 * server-side session, while HTTP 401 represents an unauthenticated request.
 */
export const HttpOnlyCookieAuthentication: React.FC<HttpOnlyCookieAuthenticationProps> = ({
  client,
}: HttpOnlyCookieAuthenticationProps): React.ReactElement => {
  const [authenticationState, setAuthenticationState] = useState<"unknown" | "authenticated" | "unauthenticated">(
    "unknown",
  );

  const [message, setMessage] = useState<string>("Authentication has not been checked.");
  const [loading, setLoading] = useState<boolean>(false);

  const handleCheck = async (): Promise<void> => {
    setLoading(true);
    setAuthenticationState("unknown");
    setMessage("Checking the server-side authentication session...");

    try {
      await client.get<unknown>("/auth/session", {
        withCredentials: true,
      });

      setAuthenticationState("authenticated");
      setMessage("The server accepted the current session.");
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        setAuthenticationState("unauthenticated");
        setMessage("The server reported an unauthenticated session.");
      } else {
        setAuthenticationState("unknown");
        setMessage("The authentication state could not be determined.");
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

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const apiClient: AxiosInstance = axios.create({
  baseURL: "https://api.example.com",
  timeout: 5000,
});

export const HttpOnlyCookieDemo: React.FC = (): React.ReactElement => {
  return (
    <main>
      <h1>HttpOnly Cookie</h1>

      <h2>1. Keep the HttpOnly Credential Outside JavaScript Access</h2>
      <HttpOnlyCookieRead storage={window.localStorage} cookieName="example-auth-cookie" />

      <h2>2. Use an HttpOnly Cookie Without Reading Its Value</h2>
      <HttpOnlyCookieRequest client={apiClient} />

      <h2>3. Enable Browser Credentials for Credentialed Requests</h2>
      <HttpOnlyCookieCredentials client={apiClient} />

      <h2>4. Log Out Through a Server Endpoint</h2>
      <HttpOnlyCookieLogout client={apiClient} />

      <h2>5. Determine Authentication State From the Server</h2>
      <HttpOnlyCookieAuthentication client={apiClient} />
    </main>
  );
};

export default HttpOnlyCookieDemo;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - HttpOnly prevents JavaScript from reading a cookie through document.cookie.
// - The browser can still attach an HttpOnly cookie to requests that satisfy the cookie's rules.
// - An HttpOnly cookie is normally created or updated by a server Set-Cookie response.
// - JavaScript cannot add the HttpOnly attribute through document.cookie.
// - Axios withCredentials enables credentialed cross-origin requests when the server's CORS policy also permits them.
// - JavaScript cannot directly remove an HttpOnly cookie, so logout normally uses a server endpoint that expires the cookie.
// - HttpOnly reduces direct credential access but does not eliminate XSS or CSRF risks.
// - SameSite, Secure, Domain, Path, and expiration attributes affect when and where a cookie is sent.
// - Cookie presence should not be treated as proof of authentication; the server remains authoritative.
