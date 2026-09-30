/**
 * Access Token
 * ============
 *
 * An access token is a credential presented by a client to access protected
 * resources on behalf of an authenticated principal. For HTTP APIs, a bearer
 * access token is commonly sent in the Authorization header as
 * "Bearer <token>".
 *
 * Access tokens are typically issued by an authentication system after a
 * successful authentication flow. The API validates the token on each protected
 * request and uses the token's claims or associated server-side state to
 * determine the authenticated principal and permitted access.
 *
 * Access-token lifetime is normally finite. When a token expires, the API can
 * reject it, commonly with HTTP 401. A client may then need to obtain another
 * token through the application's authentication mechanism. Refresh tokens,
 * when supported, are a separate credential with different lifecycle and
 * security properties.
 *
 * Axios does not authenticate a token itself. It only transports the token as
 * part of the HTTP request configuration. Authentication and authorization are
 * server-side responsibilities.
 *
 * A common edge case is an empty or missing access token. The client should not
 * construct an Authorization header containing an empty credential. Another
 * edge case is an expired token: blindly retrying the same expired token will
 * not repair the authentication state.
 *
 * Access tokens are sensitive values. They should not be displayed in the UI,
 * logged unnecessarily, embedded directly into source code, or exposed through
 * URLs when the API provides a safer header-based mechanism.
 */

import React, { useState } from "react";
import axios, { AxiosError, AxiosInstance, AxiosResponse } from "axios";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface User {
  readonly id: number;
  readonly name: string;
  readonly email: string;
}

export interface AccessTokenRequestProps {
  readonly client: AxiosInstance;
  readonly accessToken: string | null;
}

export interface AccessTokenPresenceProps {
  readonly accessToken: string | null;
}

export interface AccessTokenExpirationProps {
  readonly client: AxiosInstance;
  readonly accessToken: string | null;
}

export interface AccessTokenHeaderProps {
  readonly client: AxiosInstance;
  readonly accessToken: string | null;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * Demonstrates sending an access token as a bearer credential.
 *
 * The token is inserted into the Authorization header only after confirming that
 * a non-empty value exists. The token itself is never rendered.
 */
export const AccessTokenRequest: React.FC<AccessTokenRequestProps> = ({
  client,
  accessToken,
}: AccessTokenRequestProps): React.ReactElement => {
  const [message, setMessage] = useState<string>("Ready.");
  const [loading, setLoading] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);

  const handleRequest = async (): Promise<void> => {
    const token: string = accessToken?.trim() ?? "";

    if (token === "") {
      setMessage("No access token is available.");

      return;
    }

    setLoading(true);
    setMessage("Sending authenticated request...");

    try {
      const response: AxiosResponse<User> = await client.get<User>("/users/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUser(response.data);
      setMessage("Authenticated request succeeded.");
    } catch (error: unknown) {
      const status: number | undefined = axios.isAxiosError(error) ? error.response?.status : undefined;

      setMessage(`Request failed with HTTP status ${status ?? "unknown"}.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <button type="button" onClick={handleRequest} disabled={loading}>
        {loading ? "Requesting..." : "Use Access Token"}
      </button>

      <p role="status">{message}</p>

      {user !== null && <p>Current user: {user.name}</p>}
    </section>
  );
};

/**
 * Demonstrates checking whether an access token is available without exposing
 * its value.
 *
 * Applications can derive a boolean availability state from the token while
 * keeping the credential itself out of rendered output.
 */
export const AccessTokenPresence: React.FC<AccessTokenPresenceProps> = ({
  accessToken,
}: AccessTokenPresenceProps): React.ReactElement => {
  const hasAccessToken: boolean = accessToken?.trim() !== "";

  return (
    <section>
      <p>Access token available: {hasAccessToken ? "Yes" : "No"}</p>

      <p>Token value is intentionally not displayed.</p>
    </section>
  );
};

/**
 * Demonstrates handling an expired access token response.
 *
 * An HTTP 401 response is treated as an authentication failure. The example
 * reports that the credential needs attention instead of repeatedly retrying
 * the same token.
 */
export const AccessTokenExpiration: React.FC<AccessTokenExpirationProps> = ({
  client,
  accessToken,
}: AccessTokenExpirationProps): React.ReactElement => {
  const [message, setMessage] = useState<string>("Ready.");
  const [loading, setLoading] = useState<boolean>(false);

  const handleRequest = async (): Promise<void> => {
    const token: string = accessToken?.trim() ?? "";

    if (token === "") {
      setMessage("No access token is available.");

      return;
    }

    setLoading(true);
    setMessage("Checking the protected resource...");

    try {
      await client.get<User>("/users/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMessage("The access token was accepted.");
    } catch (error: unknown) {
      if (!axios.isAxiosError(error)) {
        setMessage("The protected request failed.");

        return;
      }

      const status: number | undefined = error.response?.status;

      if (status === 401) {
        setMessage("The access token was rejected or has expired.");
      } else {
        setMessage(`Protected request failed with HTTP status ${status ?? "unknown"}.`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <button type="button" onClick={handleRequest} disabled={loading}>
        {loading ? "Checking..." : "Check Access Token"}
      </button>

      <p role="status">{message}</p>
    </section>
  );
};

/**
 * Demonstrates attaching an access token through request configuration.
 *
 * The authentication value is kept in the HTTP headers rather than in the URL,
 * which avoids placing the credential into a query string that may be captured
 * by logs, browser history, analytics, or intermediary systems.
 */
export const AccessTokenHeader: React.FC<AccessTokenHeaderProps> = ({
  client,
  accessToken,
}: AccessTokenHeaderProps): React.ReactElement => {
  const [message, setMessage] = useState<string>("No request has been made.");
  const [loading, setLoading] = useState<boolean>(false);

  const handleRequest = async (): Promise<void> => {
    const token: string = accessToken?.trim() ?? "";

    if (token === "") {
      setMessage("A non-empty access token is required.");

      return;
    }

    setLoading(true);
    setMessage("Sending token in the Authorization header...");

    try {
      await client.get<User>("/users/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMessage("Request completed successfully.");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const axiosError: AxiosError = error;

        setMessage(`Request failed with HTTP status ${axiosError.response?.status ?? "unknown"}.`);
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
        {loading ? "Sending..." : "Send Authorization Header"}
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
  headers: {
    Accept: "application/json",
  },
});

const exampleAccessToken: string = "example-access-token";

export const AccessTokenDemo: React.FC = (): React.ReactElement => {
  return (
    <main>
      <h1>Access Token</h1>

      <h2>1. Send an Access Token as a Bearer Credential</h2>
      <AccessTokenRequest client={apiClient} accessToken={exampleAccessToken} />

      <h2>2. Check Token Availability Without Exposing the Token</h2>
      <AccessTokenPresence accessToken={exampleAccessToken} />

      <h2>3. Handle an Expired or Rejected Access Token</h2>
      <AccessTokenExpiration client={apiClient} accessToken={exampleAccessToken} />

      <h2>4. Send the Access Token Through the Authorization Header</h2>
      <AccessTokenHeader client={apiClient} accessToken={exampleAccessToken} />
    </main>
  );
};

export default AccessTokenDemo;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - An access token is a credential used to access protected resources.
// - Bearer access tokens are commonly sent through the Authorization header.
// - Axios transports access tokens but does not authenticate or authorize them.
// - Missing or empty tokens should be detected before constructing the Authorization header.
// - HTTP 401 commonly indicates that authentication credentials were rejected or are missing.
// - Reusing an expired token repeatedly does not resolve an authentication failure.
// - Access tokens should not be rendered, logged unnecessarily, hard-coded, or placed in URLs.
// - HTTPS protects access tokens while they are transmitted between the client and server.
