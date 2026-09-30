/**
 * Credentials Include
 * ===================
 *
 * The Fetch API uses the Request.credentials option to control whether browser
 * credentials such as cookies are included with a request and whether
 * credentials received from the response may be respected by the user agent.
 * Its primary values are "omit", "same-origin", and "include".
 *
 * "same-origin" is the default Fetch behavior. Credentials are included for
 * same-origin requests but not for cross-origin requests. "include" requests
 * that credentials be included even when the request is cross-origin, subject
 * to browser cookie rules and the server's CORS policy.
 *
 * Axios exposes equivalent browser behavior through its withCredentials
 * configuration option. withCredentials: true corresponds to requesting
 * credentialed cross-origin behavior when the browser adapter is used.
 *
 * Credentials are still controlled by browser security rules. Setting
 * credentials to "include" does not force a cookie to be sent when the cookie
 * is blocked by Domain, Path, Secure, SameSite, expiration, or other browser
 * policies. Likewise, a cross-origin response is not automatically exposed to
 * JavaScript merely because credentials were requested; the server must return
 * compatible CORS headers.
 *
 * For credentialed cross-origin CORS requests, the server must identify the
 * requesting origin rather than use Access-Control-Allow-Origin: *. The server
 * also needs Access-Control-Allow-Credentials: true for the browser to expose
 * the credentialed response to JavaScript.
 *
 * A common misconception is that "include" means "send every cookie". The
 * browser only sends cookies that match the request and satisfy the cookie's
 * security and scope rules. Another misconception is that credentials include
 * only cookies; browser credential handling can also involve HTTP
 * authentication and client TLS certificates depending on the request and
 * environment.
 */

import React, { useState } from "react";
import axios, { AxiosInstance, AxiosResponse } from "axios";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface CredentialsIncludeFetchProps {
  readonly requestUrl: string;
}

export interface CredentialsIncludeAxiosProps {
  readonly client: AxiosInstance;
}

export interface CredentialsIncludeComparisonProps {
  readonly client: AxiosInstance;
}

export interface CredentialsIncludeCrossOriginProps {
  readonly client: AxiosInstance;
}

export interface CredentialsIncludeResponseProps {
  readonly client: AxiosInstance;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * Demonstrates the Fetch API credentials: "include" option.
 *
 * The browser is asked to include credentials even when the request is
 * cross-origin. Cookie eligibility is still determined independently by the
 * browser.
 */
export const CredentialsIncludeFetch: React.FC<CredentialsIncludeFetchProps> = ({
  requestUrl,
}: CredentialsIncludeFetchProps): React.ReactElement => {
  const [message, setMessage] = useState<string>("Ready.");
  const [loading, setLoading] = useState<boolean>(false);

  const handleRequest = async (): Promise<void> => {
    setLoading(true);
    setMessage("Sending a Fetch request with credentials included...");

    try {
      const response: Response = await fetch(requestUrl, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        setMessage(`Request completed with HTTP ${response.status}.`);

        return;
      }

      setMessage("The credentialed Fetch request completed successfully.");
    } catch (error: unknown) {
      if (error instanceof TypeError) {
        setMessage("The browser rejected or could not complete the request.");
      } else {
        setMessage("The request failed unexpectedly.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <p>Fetch credentials mode: credentials="include"</p>

      <button type="button" onClick={handleRequest} disabled={loading}>
        {loading ? "Requesting..." : "Fetch With Credentials"}
      </button>

      <p role="status">{message}</p>
    </section>
  );
};

/**
 * Demonstrates the Axios equivalent of credentials: "include".
 *
 * Axios uses withCredentials: true in browser requests to request credential
 * inclusion for cross-origin requests. The browser remains responsible for
 * deciding whether particular cookies are eligible.
 */
export const CredentialsIncludeAxios: React.FC<CredentialsIncludeAxiosProps> = ({
  client,
}: CredentialsIncludeAxiosProps): React.ReactElement => {
  const [message, setMessage] = useState<string>("Ready.");
  const [loading, setLoading] = useState<boolean>(false);

  const handleRequest = async (): Promise<void> => {
    setLoading(true);
    setMessage("Sending an Axios request with credentials enabled...");

    try {
      await client.get<unknown>("/auth/session", {
        withCredentials: true,
      });

      setMessage("The credentialed Axios request completed successfully.");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setMessage(`Axios request failed with HTTP ${error.response?.status ?? "unknown"}.`);
      } else {
        setMessage("Axios request failed unexpectedly.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <p>Axios browser configuration: withCredentials=true</p>

      <button type="button" onClick={handleRequest} disabled={loading}>
        {loading ? "Requesting..." : "Axios With Credentials"}
      </button>

      <p role="status">{message}</p>
    </section>
  );
};

/**
 * Demonstrates that credentials: "include" does not mean that every cookie is
 * sent to the destination.
 *
 * The browser evaluates cookie scope and security attributes after the request
 * asks for credentials. Cookies that do not match the destination or violate
 * browser cookie rules remain excluded.
 */
export const CredentialsIncludeComparison: React.FC<CredentialsIncludeComparisonProps> = ({
  client,
}: CredentialsIncludeComparisonProps): React.ReactElement => {
  const [message, setMessage] = useState<string>(
    "Credentials include requests eligible credentials; it does not bypass cookie rules.",
  );
  const [loading, setLoading] = useState<boolean>(false);

  const handleRequest = async (): Promise<void> => {
    setLoading(true);
    setMessage("Requesting the session with credentials enabled...");

    try {
      const response: AxiosResponse<{
        readonly authenticated: boolean;
      }> = await client.get<{
        readonly authenticated: boolean;
      }>("/auth/session", {
        withCredentials: true,
      });

      setMessage(
        response.data.authenticated
          ? "The server reports an authenticated session."
          : "The server reports an unauthenticated session.",
      );
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
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
      <p>Credentials include does not bypass cookie Domain, Path, Secure, SameSite, or expiration rules.</p>

      <button type="button" onClick={handleRequest} disabled={loading}>
        {loading ? "Checking..." : "Check Session"}
      </button>

      <p role="status">{message}</p>
    </section>
  );
};

/**
 * Demonstrates a credentialed cross-origin request.
 *
 * Requesting credentials is only one half of a cross-origin authenticated
 * request. The server must also provide a compatible CORS response, including
 * a specific allowed origin and Access-Control-Allow-Credentials: true.
 */
export const CredentialsIncludeCrossOrigin: React.FC<CredentialsIncludeCrossOriginProps> = ({
  client,
}: CredentialsIncludeCrossOriginProps): React.ReactElement => {
  const [message, setMessage] = useState<string>("Ready.");
  const [loading, setLoading] = useState<boolean>(false);

  const handleRequest = async (): Promise<void> => {
    setLoading(true);
    setMessage("Sending a credentialed cross-origin request...");

    try {
      await client.get<unknown>("/users/me", {
        withCredentials: true,
      });

      setMessage("The browser exposed the cross-origin response to JavaScript.");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setMessage(`Cross-origin request failed or was not exposed with HTTP ${error.response?.status ?? "unknown"}.`);
      } else {
        setMessage("Cross-origin request failed unexpectedly.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <p>Cross-origin credentialed requests require compatible server-side CORS configuration.</p>

      <button type="button" onClick={handleRequest} disabled={loading}>
        {loading ? "Requesting..." : "Send Cross-Origin Request"}
      </button>

      <p role="status">{message}</p>
    </section>
  );
};

/**
 * Demonstrates that requesting credentials and receiving a response are
 * separate concerns.
 *
 * A request can reach a server while browser CORS policy prevents application
 * JavaScript from reading the response. This distinction is especially
 * important when diagnosing credentialed cross-origin requests.
 */
export const CredentialsIncludeResponse: React.FC<CredentialsIncludeResponseProps> = ({
  client,
}: CredentialsIncludeResponseProps): React.ReactElement => {
  const [message, setMessage] = useState<string>("Ready to check the authenticated response.");
  const [loading, setLoading] = useState<boolean>(false);

  const handleRequest = async (): Promise<void> => {
    setLoading(true);
    setMessage("Requesting authenticated response data...");

    try {
      const response: AxiosResponse<{
        readonly name: string;
      }> = await client.get<{
        readonly name: string;
      }>("/users/me", {
        withCredentials: true,
      });

      setMessage(`Server response received for ${response.data.name}.`);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setMessage(
          `Response could not be used by the application. HTTP status: ${error.response?.status ?? "unknown"}.`,
        );
      } else {
        setMessage("The response could not be processed.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <p>Credential inclusion and response accessibility are separate browser concerns.</p>

      <button type="button" onClick={handleRequest} disabled={loading}>
        {loading ? "Loading..." : "Read Authenticated Response"}
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

export const CredentialsIncludeDemo: React.FC = (): React.ReactElement => {
  return (
    <main>
      <h1>Credentials Include</h1>

      <h2>1. Include Credentials With the Fetch API</h2>
      <CredentialsIncludeFetch requestUrl="https://api.example.com/auth/session" />

      <h2>2. Include Credentials With Axios</h2>
      <CredentialsIncludeAxios client={apiClient} />

      <h2>3. Understand That Include Does Not Bypass Cookie Rules</h2>
      <CredentialsIncludeComparison client={apiClient} />

      <h2>4. Configure Credentialed Cross-Origin Requests</h2>
      <CredentialsIncludeCrossOrigin client={apiClient} />

      <h2>5. Distinguish Credential Inclusion From Response Access</h2>
      <CredentialsIncludeResponse client={apiClient} />
    </main>
  );
};

export default CredentialsIncludeDemo;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Fetch credentials: "include" requests that browser credentials be included for same-origin and cross-origin requests.
// - Axios withCredentials: true provides the corresponding browser configuration for credentialed Axios requests.
// - Credentials include does not force the browser to send every cookie.
// - Cookie Domain, Path, Secure, SameSite, expiration, and other browser rules still determine cookie eligibility.
// - Credentialed cross-origin CORS requires compatible server response headers.
// - A credentialed CORS response cannot use Access-Control-Allow-Origin: * when credentials are involved.
// - Requesting credentials and being allowed to read the response are separate browser concerns.
// - HttpOnly cookies can participate in credentialed requests without their values being readable by JavaScript.
// - Credentials include is a request policy, not a mechanism for manually constructing or exposing authentication credentials.
