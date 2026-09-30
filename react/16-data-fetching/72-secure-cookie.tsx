/**
 * Secure Cookie
 * =============
 *
 * A Secure cookie is a browser cookie created with the Secure attribute. The
 * browser restricts transmission of the cookie to secure connections, normally
 * HTTPS. The Secure attribute controls transport security; it does not itself
 * make a cookie inaccessible to JavaScript.
 *
 * Secure and HttpOnly are independent cookie attributes. Secure controls when
 * the browser sends the cookie over the network, while HttpOnly controls
 * whether client-side JavaScript can read the cookie through document.cookie.
 * An authentication cookie can therefore use both attributes simultaneously.
 *
 * The Secure attribute is set by the server through Set-Cookie or, for a
 * non-HttpOnly cookie, can be requested by document.cookie. JavaScript cannot
 * read an HttpOnly cookie even when the cookie is otherwise eligible for a
 * request. Cookie transmission is additionally affected by Domain, Path,
 * SameSite, expiration, and browser policy.
 *
 * Secure does not encrypt application data by itself. HTTPS provides transport
 * encryption and server authentication through TLS; the Secure attribute tells
 * the browser not to send the cookie over an insecure HTTP connection.
 *
 * A common edge case is local development. Browsers have special handling for
 * localhost and secure-cookie behavior can differ from production HTTPS
 * deployments. Production authentication cookies should be tested under the
 * actual HTTPS origin and should not rely on development-specific exceptions.
 *
 * Another common misconception is that Secure prevents JavaScript from stealing
 * a cookie. Secure does not provide that guarantee. HttpOnly prevents direct
 * JavaScript reads of the cookie value, while Secure protects against sending
 * the cookie over an insecure transport.
 */

import React, { useState } from "react";
import axios, { AxiosInstance } from "axios";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface SecureCookieTransportProps {
  readonly client: AxiosInstance;
}

export interface SecureCookieJavaScriptAccessProps {
  readonly cookieName: string;
}

export interface SecureCookieRequestProps {
  readonly client: AxiosInstance;
}

export interface SecureCookieCombinedProps {
  readonly client: AxiosInstance;
}

export interface SecureCookieLogoutProps {
  readonly client: AxiosInstance;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * Demonstrates that Secure controls cookie transport rather than JavaScript
 * accessibility.
 *
 * The browser decides whether an eligible Secure cookie may accompany a
 * request. Application code does not manually attach the cookie value.
 */
export const SecureCookieTransport: React.FC<SecureCookieTransportProps> = ({
  client,
}: SecureCookieTransportProps): React.ReactElement => {
  const [message, setMessage] = useState<string>("Ready.");
  const [loading, setLoading] = useState<boolean>(false);

  const handleRequest = async (): Promise<void> => {
    setLoading(true);
    setMessage("Sending a request so the browser can apply its cookie rules...");

    try {
      await client.get<unknown>("/auth/session");

      setMessage("The request completed. Eligible Secure cookies are managed by the browser.");
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
      <p>Secure controls whether an eligible cookie is transmitted over the connection.</p>

      <button type="button" onClick={handleRequest} disabled={loading}>
        {loading ? "Requesting..." : "Send Authenticated Request"}
      </button>

      <p role="status">{message}</p>
    </section>
  );
};

/**
 * Demonstrates that Secure and HttpOnly solve different problems.
 *
 * A Secure cookie can still be visible to document.cookie when HttpOnly is not
 * also set. This example checks a client-readable cookie without displaying
 * its actual value.
 */
export const SecureCookieJavaScriptAccess: React.FC<SecureCookieJavaScriptAccessProps> = ({
  cookieName,
}: SecureCookieJavaScriptAccessProps): React.ReactElement => {
  const [message, setMessage] = useState<string>("Ready.");

  const handleCheck = (): void => {
    const cookies: string = document.cookie;

    const cookieNames: string[] = cookies
      .split(";")
      .map((cookie: string): string => cookie.trim().split("=")[0])
      .filter((name: string): boolean => name.length > 0);

    const isReadable: boolean = cookieNames.includes(cookieName);

    setMessage(
      isReadable
        ? "A client-readable cookie with this name is visible to JavaScript."
        : "This cookie name is not visible through document.cookie. An HttpOnly cookie would behave this way.",
    );
  };

  return (
    <section>
      <p>Secure alone does not prevent JavaScript access.</p>

      <button type="button" onClick={handleCheck}>
        Check JavaScript Visibility
      </button>

      <p role="status">{message}</p>
    </section>
  );
};

/**
 * Demonstrates making a request while leaving cookie transmission to the browser.
 *
 * Axios does not need an authentication header when authentication is represented
 * by an eligible browser cookie. For cross-origin requests, withCredentials
 * must be enabled and the server must permit credentialed CORS.
 */
export const SecureCookieRequest: React.FC<SecureCookieRequestProps> = ({
  client,
}: SecureCookieRequestProps): React.ReactElement => {
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
      <button type="button" onClick={handleRequest} disabled={loading}>
        {loading ? "Requesting..." : "Send Credentialed Request"}
      </button>

      <p role="status">{message}</p>
    </section>
  );
};

/**
 * Demonstrates combining Secure and HttpOnly for a session cookie.
 *
 * Secure protects the cookie from transmission over insecure connections, while
 * HttpOnly prevents JavaScript from reading the cookie value. The server is
 * responsible for setting both attributes through Set-Cookie.
 */
export const SecureCookieCombined: React.FC<SecureCookieCombinedProps> = ({
  client,
}: SecureCookieCombinedProps): React.ReactElement => {
  const [message, setMessage] = useState<string>("A production session cookie can use Secure and HttpOnly together.");
  const [loading, setLoading] = useState<boolean>(false);

  const handleRequest = async (): Promise<void> => {
    setLoading(true);
    setMessage("Checking the server-side authenticated session...");

    try {
      await client.get<unknown>("/auth/session", {
        withCredentials: true,
      });

      setMessage("The server accepted the browser-managed session.");
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        setMessage("The server reported an unauthenticated session.");
      } else if (axios.isAxiosError(error)) {
        setMessage(`Session request failed with HTTP ${error.response?.status ?? "unknown"}.`);
      } else {
        setMessage("Session request failed unexpectedly.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <p>Recommended session-cookie properties: Secure + HttpOnly.</p>

      <button type="button" onClick={handleRequest} disabled={loading}>
        {loading ? "Checking..." : "Check Authenticated Session"}
      </button>

      <p role="status">{message}</p>
    </section>
  );
};

/**
 * Demonstrates server-managed logout for a Secure authentication cookie.
 *
 * The client does not need the cookie value. A logout endpoint can return a
 * Set-Cookie response that expires the existing authentication cookie.
 */
export const SecureCookieLogout: React.FC<SecureCookieLogoutProps> = ({
  client,
}: SecureCookieLogoutProps): React.ReactElement => {
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
      setMessage("The server can expire the Secure authentication cookie in its response.");
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
      <p>Authenticated state: {authenticated ? "Yes" : "No"}</p>

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

export const SecureCookieDemo: React.FC = (): React.ReactElement => {
  return (
    <main>
      <h1>Secure Cookie</h1>

      <h2>1. Let the Browser Enforce Secure Cookie Transport</h2>
      <SecureCookieTransport client={apiClient} />

      <h2>2. Distinguish Secure From JavaScript Visibility</h2>
      <SecureCookieJavaScriptAccess cookieName="example-auth-cookie" />

      <h2>3. Send Credentialed Requests With Browser Cookies</h2>
      <SecureCookieRequest client={apiClient} />

      <h2>4. Combine Secure and HttpOnly for Authentication Cookies</h2>
      <SecureCookieCombined client={apiClient} />

      <h2>5. Expire the Authentication Cookie Through Server Logout</h2>
      <SecureCookieLogout client={apiClient} />
    </main>
  );
};

export default SecureCookieDemo;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Secure instructs the browser to send a cookie only over secure connections, normally HTTPS.
// - Secure does not prevent JavaScript from reading a cookie when HttpOnly is absent.
// - HttpOnly and Secure provide different protections and can be used together.
// - HTTPS provides transport encryption; the Secure cookie attribute tells the browser when the cookie may be transmitted.
// - Cookie transmission also depends on Domain, Path, SameSite, expiration, and browser policy.
// - Axios withCredentials enables credentialed cross-origin requests when the server's CORS configuration also permits them.
// - Secure does not eliminate XSS or CSRF risks.
// - A server can expire an authentication cookie during logout by returning an appropriate Set-Cookie response.
// - Production authentication cookies commonly use Secure and HttpOnly together, with an appropriate SameSite policy.
