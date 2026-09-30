/**
 * Authentication Header
 * =====================
 *
 * An authentication header carries credentials in an HTTP request header so the
 * server can authenticate the request. For bearer-token authentication, the
 * standard Authorization header uses the format "Bearer <access-token>".
 *
 * Axios accepts request headers through the request configuration. A request can
 * provide an Authorization header for one operation, while an Axios instance
 * can provide a default header for requests that consistently use the same
 * authentication context.
 *
 * Header names are case-insensitive according to HTTP semantics, although using
 * the conventional "Authorization" spelling improves readability. The header
 * value is significant: the authentication scheme and credential must be
 * separated according to the scheme's syntax.
 *
 * Authentication headers should not be confused with application-specific
 * headers. A header such as X-Api-Key may represent a different authentication
 * mechanism, while Authorization is commonly used for standardized schemes such
 * as Bearer and Basic authentication.
 *
 * A common edge case is an absent credential. The client should avoid sending an
 * Authorization header with an empty or undefined value. Another edge case is
 * accidentally overwriting an existing Authorization header when merging Axios
 * configuration objects.
 *
 * Authentication headers contain sensitive credentials. They should not be
 * rendered into the DOM, placed into URLs, or logged unnecessarily. HTTPS is
 * required to protect credentials while they travel over the network.
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

export interface AuthenticationHeaderExampleProps {
  readonly client: AxiosInstance;
  readonly accessToken: string | null;
}

export interface AuthenticationHeaderOptionalProps {
  readonly client: AxiosInstance;
  readonly accessToken: string | null;
}

export interface AuthenticationHeaderInstanceProps {
  readonly client: AxiosInstance;
  readonly accessToken: string | null;
}

export interface AuthenticationHeaderErrorProps {
  readonly client: AxiosInstance;
  readonly accessToken: string | null;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * Demonstrates adding a bearer authentication header to one request.
 *
 * The Authorization header is created only when a non-empty access token is
 * available. The credential is never included in rendered output.
 */
export const AuthenticationHeaderExample: React.FC<AuthenticationHeaderExampleProps> = ({
  client,
  accessToken,
}: AuthenticationHeaderExampleProps): React.ReactElement => {
  const [message, setMessage] = useState<string>("Ready.");
  const [loading, setLoading] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);

  const handleRequest = async (): Promise<void> => {
    const token: string = accessToken?.trim() ?? "";

    if (token === "") {
      setMessage("No authentication credential is available.");

      return;
    }

    setLoading(true);
    setMessage("Sending the Authorization header...");

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
        {loading ? "Sending..." : "Send Authenticated Request"}
      </button>

      <p role="status">{message}</p>

      {user !== null && <p>Authenticated user: {user.name}</p>}
    </section>
  );
};

/**
 * Demonstrates conditionally including the Authorization header.
 *
 * Conditional construction avoids sending an empty bearer credential when the
 * caller has not supplied an access token.
 */
export const AuthenticationHeaderOptional: React.FC<AuthenticationHeaderOptionalProps> = ({
  client,
  accessToken,
}: AuthenticationHeaderOptionalProps): React.ReactElement => {
  const [message, setMessage] = useState<string>("No request has been made.");
  const [loading, setLoading] = useState<boolean>(false);

  const handleRequest = async (): Promise<void> => {
    const token: string = accessToken?.trim() ?? "";

    if (token === "") {
      setMessage("Request skipped because the token is missing.");

      return;
    }

    setLoading(true);

    const headers: Record<string, string> = {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    };

    try {
      await client.get<User>("/users/me", {
        headers,
      });

      setMessage("Request completed with an Authorization header.");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setMessage(`Request failed with HTTP status ${error.response?.status ?? "unknown"}.`);
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
        {loading ? "Requesting..." : "Send When Credential Exists"}
      </button>

      <p role="status">{message}</p>
    </section>
  );
};

/**
 * Demonstrates configuring an authentication header on an Axios instance.
 *
 * Instance defaults apply to requests made through that instance. This is useful
 * when many requests share the same authentication context.
 */
export const AuthenticationHeaderInstance: React.FC<AuthenticationHeaderInstanceProps> = ({
  client,
  accessToken,
}: AuthenticationHeaderInstanceProps): React.ReactElement => {
  const [message, setMessage] = useState<string>("Authenticated client has not been used.");
  const [loading, setLoading] = useState<boolean>(false);

  const handleRequest = async (): Promise<void> => {
    const token: string = accessToken?.trim() ?? "";

    if (token === "") {
      setMessage("An access token is required.");

      return;
    }

    const authenticatedClient: AxiosInstance = axios.create({
      baseURL: client.defaults.baseURL,
      timeout: client.defaults.timeout,
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    setLoading(true);
    setMessage("Using an Axios instance with authentication defaults...");

    try {
      const response: AxiosResponse<User> = await authenticatedClient.get<User>("/users/me");

      setMessage(`Request succeeded for ${response.data.name}.`);
    } catch (error: unknown) {
      setMessage(
        axios.isAxiosError(error)
          ? `Request failed with HTTP status ${error.response?.status ?? "unknown"}.`
          : "Request failed unexpectedly.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <button type="button" onClick={handleRequest} disabled={loading}>
        {loading ? "Requesting..." : "Use Authenticated Instance"}
      </button>

      <p role="status">{message}</p>
    </section>
  );
};

/**
 * Demonstrates handling authentication failures returned for an Authorization
 * header.
 *
 * HTTP 401 generally represents an authentication failure, while HTTP 403
 * commonly represents a request that was understood but not permitted for the
 * authenticated principal.
 */
export const AuthenticationHeaderError: React.FC<AuthenticationHeaderErrorProps> = ({
  client,
  accessToken,
}: AuthenticationHeaderErrorProps): React.ReactElement => {
  const [message, setMessage] = useState<string>("Ready.");
  const [loading, setLoading] = useState<boolean>(false);

  const handleRequest = async (): Promise<void> => {
    const token: string = accessToken?.trim() ?? "";

    if (token === "") {
      setMessage("No authentication credential is available.");

      return;
    }

    setLoading(true);
    setMessage("Requesting a protected resource...");

    try {
      await client.get<User>("/protected-resource", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMessage("Protected resource returned successfully.");
    } catch (error: unknown) {
      if (!axios.isAxiosError(error)) {
        setMessage("The request failed unexpectedly.");

        return;
      }

      const axiosError: AxiosError = error;
      const status: number | undefined = axiosError.response?.status;

      if (status === 401) {
        setMessage("Authentication was rejected or is missing.");
      } else if (status === 403) {
        setMessage("Authentication was accepted, but access was denied.");
      } else {
        setMessage(`Request failed with HTTP status ${status ?? "unknown"}.`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <button type="button" onClick={handleRequest} disabled={loading}>
        {loading ? "Checking..." : "Request Protected Resource"}
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

export const AuthenticationHeaderDemo: React.FC = (): React.ReactElement => {
  return (
    <main>
      <h1>Authentication Header</h1>

      <h2>1. Send a Bearer Token in the Authorization Header</h2>
      <AuthenticationHeaderExample client={apiClient} accessToken={exampleAccessToken} />

      <h2>2. Include the Header Only When a Credential Exists</h2>
      <AuthenticationHeaderOptional client={apiClient} accessToken={exampleAccessToken} />

      <h2>3. Configure Authentication on an Axios Instance</h2>
      <AuthenticationHeaderInstance client={apiClient} accessToken={exampleAccessToken} />

      <h2>4. Handle Authentication and Authorization Responses</h2>
      <AuthenticationHeaderError client={apiClient} accessToken={exampleAccessToken} />
    </main>
  );
};

export default AuthenticationHeaderDemo;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - The Authorization header carries authentication credentials for an HTTP request.
// - Bearer authentication uses the Authorization: Bearer <token> format.
// - Authentication headers can be configured per request or on an Axios instance.
// - Missing credentials should not produce an empty Authorization header.
// - HTTP 401 commonly indicates an authentication failure.
// - HTTP 403 commonly indicates that access is denied for the authenticated principal.
// - Authentication credentials should not be rendered, placed in URLs, or logged unnecessarily.
// - HTTPS protects authentication headers while they are transmitted.
