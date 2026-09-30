/**
 * Authenticated Requests
 * ======================
 *
 * An authenticated HTTP request includes credentials or an access token that
 * allows a server to associate the request with an authenticated principal.
 * With Axios, request-specific authentication data can be supplied through
 * headers or through an Axios instance configuration.
 *
 * Bearer-token authentication commonly places an access token in the
 * Authorization header using the form "Bearer <token>". Axios sends that header
 * as part of the HTTP request configuration, while the server is responsible
 * for validating the token and deciding whether the request is authorized.
 *
 * Authentication and authorization are different concerns. Authentication
 * establishes or verifies an identity, while authorization determines whether
 * that identity may perform the requested operation. A valid access token can
 * therefore still result in an HTTP 403 response when the authenticated
 * principal lacks permission.
 *
 * Access tokens are sensitive credentials. They should not be hard-coded into
 * source code or exposed in rendered UI. This example uses a generic token
 * supplied through component props and displays only whether a token is
 * available.
 *
 * A common edge case is an absent token. The request should not blindly send an
 * Authorization header containing an undefined or empty value. The example
 * explicitly checks for a non-empty token before making the authenticated
 * request.
 *
 * Another common misconception is that adding an Authorization header makes an
 * endpoint secure by itself. Authentication depends on server-side validation,
 * and protected HTTP traffic should use HTTPS so credentials are not sent over
 * an unencrypted connection.
 */

import React, { useState } from "react";
import axios, { AxiosInstance, AxiosResponse } from "axios";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface User {
  readonly id: number;
  readonly name: string;
  readonly email: string;
}

export interface AuthenticatedRequestProps {
  readonly client: AxiosInstance;
  readonly accessToken: string | null;
}

export interface AuthenticatedRequestConfigProps {
  readonly client: AxiosInstance;
  readonly accessToken: string | null;
}

export interface AuthenticatedAuthorizationExampleProps {
  readonly client: AxiosInstance;
  readonly accessToken: string | null;
}

export interface AuthenticatedMissingTokenExampleProps {
  readonly client: AxiosInstance;
  readonly accessToken: string | null;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * Demonstrates sending a bearer access token with an individual request.
 *
 * The Authorization header is created only when a non-empty token is available.
 * The token itself is never rendered into the component output.
 */
export const AuthenticatedRequest: React.FC<AuthenticatedRequestProps> = ({
  client,
  accessToken,
}: AuthenticatedRequestProps): React.ReactElement => {
  const [user, setUser] = useState<User | null>(null);
  const [message, setMessage] = useState<string>("No request has been made.");
  const [loading, setLoading] = useState<boolean>(false);

  const handleRequest = async (): Promise<void> => {
    if (accessToken === null || accessToken.trim() === "") {
      setMessage("An access token is required.");

      return;
    }

    setLoading(true);
    setMessage("Sending authenticated request...");

    try {
      const response: AxiosResponse<User> = await client.get<User>("/users/me", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      setUser(response.data);
      setMessage("Authenticated request succeeded.");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setMessage(`Request failed with HTTP status ${error.response?.status ?? "unknown"}.`);
      } else {
        setMessage("The authenticated request failed.");
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

      {user !== null && <p>Authenticated user: {user.name}</p>}
    </section>
  );
};

/**
 * Demonstrates configuring authentication on an Axios instance.
 *
 * A configured instance applies its default headers to requests made through
 * that instance. This example creates a derived instance so the original client
 * is not mutated.
 */
export const AuthenticatedRequestConfig: React.FC<AuthenticatedRequestConfigProps> = ({
  client,
  accessToken,
}: AuthenticatedRequestConfigProps): React.ReactElement => {
  const [message, setMessage] = useState<string>("The authenticated client is ready.");
  const [loading, setLoading] = useState<boolean>(false);

  const handleRequest = async (): Promise<void> => {
    if (accessToken === null || accessToken.trim() === "") {
      setMessage("An access token is required.");

      return;
    }

    const authenticatedClient: AxiosInstance = axios.create({
      baseURL: client.defaults.baseURL,
      timeout: client.defaults.timeout,
      headers: {
        ...client.defaults.headers.common,
        Authorization: `Bearer ${accessToken}`,
      },
    });

    setLoading(true);
    setMessage("Sending request through the authenticated client...");

    try {
      const response: AxiosResponse<User> = await authenticatedClient.get<User>("/users/me");

      setMessage(`Authenticated request succeeded for ${response.data.name}.`);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setMessage(`Request failed with HTTP status ${error.response?.status ?? "unknown"}.`);
      } else {
        setMessage("The authenticated request failed.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <button type="button" onClick={handleRequest} disabled={loading}>
        {loading ? "Requesting..." : "Use Authenticated Client"}
      </button>

      <p role="status">{message}</p>
    </section>
  );
};

/**
 * Demonstrates distinguishing authentication failure from authorization
 * failure.
 *
 * HTTP 401 commonly indicates that authentication credentials are missing or
 * invalid, while HTTP 403 commonly indicates that the server understood the
 * authenticated identity but denied access to the requested resource.
 */
export const AuthenticatedAuthorizationExample: React.FC<AuthenticatedAuthorizationExampleProps> = ({
  client,
  accessToken,
}: AuthenticatedAuthorizationExampleProps): React.ReactElement => {
  const [message, setMessage] = useState<string>("Ready.");
  const [loading, setLoading] = useState<boolean>(false);

  const handleRequest = async (): Promise<void> => {
    if (accessToken === null || accessToken.trim() === "") {
      setMessage("No access token is available.");

      return;
    }

    setLoading(true);
    setMessage("Requesting a protected resource...");

    try {
      await client.get<User>("/admin/users", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      setMessage("The protected resource was returned.");
    } catch (error: unknown) {
      if (!axios.isAxiosError(error)) {
        setMessage("The request failed unexpectedly.");

        return;
      }

      const status: number | undefined = error.response?.status;

      if (status === 401) {
        setMessage("Authentication was rejected or is missing.");
      } else if (status === 403) {
        setMessage("Authentication succeeded, but access was denied.");
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

/**
 * Demonstrates handling an absent access token before making a request.
 *
 * The component fails locally when credentials are unavailable rather than
 * sending an Authorization header containing an empty credential.
 */
export const AuthenticatedMissingTokenExample: React.FC<AuthenticatedMissingTokenExampleProps> = ({
  client,
  accessToken,
}: AuthenticatedMissingTokenExampleProps): React.ReactElement => {
  const [message, setMessage] = useState<string>("Authentication status has not been checked.");
  const [loading, setLoading] = useState<boolean>(false);

  const handleRequest = async (): Promise<void> => {
    const normalizedToken: string = accessToken?.trim() ?? "";

    if (normalizedToken === "") {
      setMessage("Request skipped because no access token is available.");

      return;
    }

    setLoading(true);
    setMessage("Sending authenticated request...");

    try {
      await client.get<User>("/users/me", {
        headers: {
          Authorization: `Bearer ${normalizedToken}`,
        },
      });

      setMessage("Authenticated request succeeded.");
    } catch (error: unknown) {
      const status: number | undefined = axios.isAxiosError(error) ? error.response?.status : undefined;

      setMessage(`Authenticated request failed with HTTP status ${status ?? "unknown"}.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <p>Token available: {accessToken?.trim() !== "" ? "Yes" : "No"}</p>

      <button type="button" onClick={handleRequest} disabled={loading}>
        {loading ? "Requesting..." : "Request Current User"}
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

export const AuthenticatedRequestsDemo: React.FC = (): React.ReactElement => {
  return (
    <main>
      <h1>Authenticated Requests</h1>

      <h2>1. Send a Bearer Token With an Individual Request</h2>
      <AuthenticatedRequest client={apiClient} accessToken={exampleAccessToken} />

      <h2>2. Configure an Axios Client for Authenticated Requests</h2>
      <AuthenticatedRequestConfig client={apiClient} accessToken={exampleAccessToken} />

      <h2>3. Distinguish Authentication From Authorization Failures</h2>
      <AuthenticatedAuthorizationExample client={apiClient} accessToken={exampleAccessToken} />

      <h2>4. Handle a Missing Access Token Before Requesting</h2>
      <AuthenticatedMissingTokenExample client={apiClient} accessToken={null} />
    </main>
  );
};

export default AuthenticatedRequestsDemo;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Bearer authentication commonly uses the Authorization header.
// - Authentication verifies credentials, while authorization determines permitted access.
// - A valid authentication credential can still receive HTTP 403 when access is denied.
// - HTTP 401 commonly indicates missing or invalid authentication credentials.
// - Sensitive access tokens should not be hard-coded or rendered into the UI.
// - An Authorization header should not be created from an absent or empty token.
// - HTTPS should protect authenticated requests while credentials are transmitted.
// - Server-side token validation is required; adding a client-side header does not itself secure an endpoint.
