/**
 * Bearer Token
 * ============
 *
 * A bearer token is an access credential where possession of the token is
 * sufficient for presenting the credential to a protected HTTP resource.
 * For HTTP bearer authentication, the token is conventionally sent in the
 * Authorization header using the "Bearer <token>" authentication scheme.
 *
 * Axios does not interpret the token's permissions or validate its signature.
 * It serializes the configured header into the outgoing HTTP request, while the
 * server or an authentication gateway validates the token and determines the
 * authenticated principal and authorization scope.
 *
 * The bearer scheme does not require the client to understand the token's
 * internal format. A token may be opaque or structured, such as a signed token.
 * The client normally treats it as an uninterpreted credential and sends it
 * exactly as issued.
 *
 * A common edge case is whitespace around a token. Trimming user-supplied
 * credential input can prevent accidentally constructing a malformed header,
 * but application code should not arbitrarily transform a token beyond what its
 * authentication contract permits.
 *
 * Another edge case is a 401 response. Retrying the same rejected bearer token
 * does not make the credential valid. If the authentication system supports
 * renewal, the application needs a separate token-renewal mechanism.
 *
 * Bearer tokens are sensitive because anyone who can successfully present a
 * valid bearer credential may be treated as the token's authorized holder.
 * Tokens should therefore be transmitted over HTTPS and should not be exposed in
 * URLs, rendered into the UI, or logged unnecessarily.
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

export interface BearerTokenRequestProps {
  readonly client: AxiosInstance;
  readonly bearerToken: string | null;
}

export interface BearerTokenHeaderProps {
  readonly client: AxiosInstance;
  readonly bearerToken: string | null;
}

export interface BearerTokenValidationProps {
  readonly client: AxiosInstance;
  readonly bearerToken: string | null;
}

export interface BearerTokenFailureProps {
  readonly client: AxiosInstance;
  readonly bearerToken: string | null;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * Demonstrates sending a bearer token through an Authorization header.
 *
 * The token is treated as an opaque credential. The client does not inspect its
 * contents before placing it after the Bearer authentication scheme.
 */
export const BearerTokenRequest: React.FC<BearerTokenRequestProps> = ({
  client,
  bearerToken,
}: BearerTokenRequestProps): React.ReactElement => {
  const [user, setUser] = useState<User | null>(null);
  const [message, setMessage] = useState<string>("Ready.");
  const [loading, setLoading] = useState<boolean>(false);

  const handleRequest = async (): Promise<void> => {
    const token: string = bearerToken?.trim() ?? "";

    if (token === "") {
      setMessage("A bearer token is required.");

      return;
    }

    setLoading(true);
    setMessage("Sending bearer-authenticated request...");

    try {
      const response: AxiosResponse<User> = await client.get<User>("/users/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUser(response.data);
      setMessage("Bearer-authenticated request succeeded.");
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
        {loading ? "Requesting..." : "Send Bearer Request"}
      </button>

      <p role="status">{message}</p>

      {user !== null && <p>Authenticated user: {user.name}</p>}
    </section>
  );
};

/**
 * Demonstrates constructing the bearer Authorization header without exposing
 * the credential in rendered content.
 *
 * The resulting header contains the authentication scheme followed by the token.
 * The component reports only whether the credential is available.
 */
export const BearerTokenHeader: React.FC<BearerTokenHeaderProps> = ({
  client,
  bearerToken,
}: BearerTokenHeaderProps): React.ReactElement => {
  const [message, setMessage] = useState<string>("No request has been made.");
  const [loading, setLoading] = useState<boolean>(false);

  const handleRequest = async (): Promise<void> => {
    const token: string = bearerToken?.trim() ?? "";

    if (token === "") {
      setMessage("The bearer token is unavailable.");

      return;
    }

    const authorizationHeader: string = `Bearer ${token}`;

    setLoading(true);
    setMessage("Sending the Authorization header...");

    try {
      await client.get<User>("/users/me", {
        headers: {
          Authorization: authorizationHeader,
        },
      });

      setMessage("Authorization header was accepted.");
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
      <p>Bearer token available: {bearerToken?.trim() !== "" ? "Yes" : "No"}</p>

      <button type="button" onClick={handleRequest} disabled={loading}>
        {loading ? "Sending..." : "Send Bearer Header"}
      </button>

      <p role="status">{message}</p>
    </section>
  );
};

/**
 * Demonstrates treating a bearer token as an opaque credential.
 *
 * The client does not decode, parse, or infer permissions from the token before
 * sending it. Token validation and authorization remain server responsibilities.
 */
export const BearerTokenValidation: React.FC<BearerTokenValidationProps> = ({
  client,
  bearerToken,
}: BearerTokenValidationProps): React.ReactElement => {
  const [message, setMessage] = useState<string>("The token has not been used.");
  const [loading, setLoading] = useState<boolean>(false);

  const handleRequest = async (): Promise<void> => {
    const token: string = bearerToken?.trim() ?? "";

    if (token === "") {
      setMessage("No bearer token is available.");

      return;
    }

    setLoading(true);
    setMessage("The server will validate the bearer token...");

    try {
      const response: AxiosResponse<User> = await client.get<User>("/users/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMessage(`Server accepted the credential for ${response.data.name}.`);
    } catch (error: unknown) {
      if (!axios.isAxiosError(error)) {
        setMessage("The request failed unexpectedly.");

        return;
      }

      const axiosError: AxiosError = error;

      setMessage(
        `Server rejected or could not process the credential (HTTP ${axiosError.response?.status ?? "unknown"}).`,
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <p>The client treats the bearer token as an opaque credential.</p>

      <button type="button" onClick={handleRequest} disabled={loading}>
        {loading ? "Checking..." : "Send Opaque Credential"}
      </button>

      <p role="status">{message}</p>
    </section>
  );
};

/**
 * Demonstrates handling a rejected bearer token without repeatedly retrying the
 * same credential.
 *
 * A 401 response indicates that the authentication attempt was unsuccessful.
 * The component reports the condition instead of starting an automatic retry
 * loop with the same token.
 */
export const BearerTokenFailure: React.FC<BearerTokenFailureProps> = ({
  client,
  bearerToken,
}: BearerTokenFailureProps): React.ReactElement => {
  const [message, setMessage] = useState<string>("Ready.");
  const [loading, setLoading] = useState<boolean>(false);

  const handleRequest = async (): Promise<void> => {
    const token: string = bearerToken?.trim() ?? "";

    if (token === "") {
      setMessage("No bearer token is available.");

      return;
    }

    setLoading(true);
    setMessage("Requesting protected data...");

    try {
      await client.get<User>("/users/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMessage("Protected data was returned.");
    } catch (error: unknown) {
      if (!axios.isAxiosError(error)) {
        setMessage("The request failed unexpectedly.");

        return;
      }

      const status: number | undefined = error.response?.status;

      if (status === 401) {
        setMessage("Bearer authentication failed. The same token should not be retried indefinitely.");
      } else if (status === 403) {
        setMessage("The bearer credential was not permitted to access this resource.");
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
        {loading ? "Requesting..." : "Request Protected Data"}
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

const exampleBearerToken: string = "example-bearer-token";

export const BearerTokenDemo: React.FC = (): React.ReactElement => {
  return (
    <main>
      <h1>Bearer Token</h1>

      <h2>1. Send a Bearer Token With a Protected Request</h2>
      <BearerTokenRequest client={apiClient} bearerToken={exampleBearerToken} />

      <h2>2. Construct the Bearer Authorization Header</h2>
      <BearerTokenHeader client={apiClient} bearerToken={exampleBearerToken} />

      <h2>3. Treat the Bearer Token as an Opaque Credential</h2>
      <BearerTokenValidation client={apiClient} bearerToken={exampleBearerToken} />

      <h2>4. Handle a Rejected Bearer Token</h2>
      <BearerTokenFailure client={apiClient} bearerToken={exampleBearerToken} />
    </main>
  );
};

export default BearerTokenDemo;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - A bearer token is a credential presented by possession of the token.
// - Bearer authentication conventionally uses the Authorization header.
// - Axios transports the token but does not validate its contents or permissions.
// - Client code should generally treat access tokens as opaque credentials.
// - Missing or empty bearer tokens should not produce an Authorization header.
// - A rejected bearer token should not be retried indefinitely without obtaining a valid credential.
// - HTTP 401 commonly indicates failed authentication, while HTTP 403 commonly indicates denied access.
// - Bearer tokens should be protected with HTTPS and should not be exposed in URLs, rendered output, or unnecessary logs.
