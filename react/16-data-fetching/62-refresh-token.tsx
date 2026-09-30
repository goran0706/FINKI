/**
 * Refresh Token
 * =============
 *
 * A refresh token is a credential used with an authentication system to obtain
 * a new access token after the access token expires or is close to expiration.
 * It is distinct from an access token: an access token is commonly presented to
 * protected APIs, while a refresh token is commonly presented only to a token
 * endpoint that issues new authentication credentials.
 *
 * A typical refresh flow sends the refresh token to a dedicated authentication
 * endpoint. The server validates the refresh token and may issue a new access
 * token, a new refresh token, or both. Refresh-token rotation means the server
 * replaces the previous refresh token with a new one and invalidates the old
 * credential, reducing the usefulness of a stolen token after it has been used.
 *
 * Axios does not perform refresh-token semantics automatically. It only sends
 * HTTP requests. The application or authentication layer decides when a token
 * should be refreshed, how the refresh request is authenticated, and how newly
 * issued credentials are stored.
 *
 * A common edge case is a refresh failure. If the refresh token is expired,
 * revoked, malformed, or otherwise rejected, repeatedly calling the same refresh
 * endpoint with the same credential does not resolve the authentication state.
 * The application generally needs to require a new authentication flow.
 *
 * Another important edge case is concurrent expiration. If several protected
 * requests discover an expired access token simultaneously, starting a separate
 * refresh request for every request can create redundant refresh operations.
 * Production authentication layers commonly coordinate refresh operations so
 * concurrent requests can share one refresh result.
 *
 * Refresh tokens are sensitive credentials and should receive stronger
 * protection than ordinary application data. They should not be rendered in the
 * UI, included in URLs, or logged unnecessarily. Their storage and transport
 * strategy should follow the authentication system's security model.
 */

import React, { useState } from "react";
import axios, { AxiosError, AxiosInstance, AxiosResponse } from "axios";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface TokenResponse {
  readonly accessToken: string;
  readonly refreshToken?: string;
  readonly expiresIn: number;
}

export interface RefreshTokenRequestProps {
  readonly client: AxiosInstance;
  readonly refreshToken: string | null;
}

export interface RefreshTokenRotationProps {
  readonly client: AxiosInstance;
  readonly refreshToken: string | null;
}

export interface RefreshTokenFailureProps {
  readonly client: AxiosInstance;
  readonly refreshToken: string | null;
}

export interface RefreshTokenConcurrencyProps {
  readonly client: AxiosInstance;
  readonly refreshToken: string | null;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * Demonstrates sending a refresh token to a dedicated token endpoint.
 *
 * The refresh token is not sent to the protected resource endpoint. The token
 * endpoint validates the refresh credential and returns a new access token.
 */
export const RefreshTokenRequest: React.FC<RefreshTokenRequestProps> = ({
  client,
  refreshToken,
}: RefreshTokenRequestProps): React.ReactElement => {
  const [message, setMessage] = useState<string>("Ready.");
  const [loading, setLoading] = useState<boolean>(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const handleRefresh = async (): Promise<void> => {
    const token: string = refreshToken?.trim() ?? "";

    if (token === "") {
      setMessage("No refresh token is available.");

      return;
    }

    setLoading(true);
    setMessage("Requesting a new access token...");

    try {
      const response: AxiosResponse<TokenResponse> = await client.post<TokenResponse>("/auth/refresh", {
        refreshToken: token,
      });

      setAccessToken(response.data.accessToken);

      setMessage(`Access token refreshed. Lifetime: ${response.data.expiresIn} seconds.`);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setMessage(`Refresh request failed with HTTP ${error.response?.status ?? "unknown"}.`);
      } else {
        setMessage("Refresh request failed unexpectedly.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <button type="button" onClick={handleRefresh} disabled={loading}>
        {loading ? "Refreshing..." : "Refresh Access Token"}
      </button>

      <p role="status">{message}</p>

      <p>New access token available: {accessToken !== null ? "Yes" : "No"}</p>
    </section>
  );
};

/**
 * Demonstrates refresh-token rotation.
 *
 * When the token endpoint returns a replacement refresh token, the application
 * must use the replacement according to the authentication provider's contract
 * rather than continuing to use an invalidated previous token.
 */
export const RefreshTokenRotation: React.FC<RefreshTokenRotationProps> = ({
  client,
  refreshToken,
}: RefreshTokenRotationProps): React.ReactElement => {
  const [currentRefreshToken, setCurrentRefreshToken] = useState<string | null>(refreshToken);
  const [message, setMessage] = useState<string>("Ready.");
  const [loading, setLoading] = useState<boolean>(false);

  const handleRefresh = async (): Promise<void> => {
    const token: string = currentRefreshToken?.trim() ?? "";

    if (token === "") {
      setMessage("No refresh token is available.");

      return;
    }

    setLoading(true);
    setMessage("Requesting rotated credentials...");

    try {
      const response: AxiosResponse<TokenResponse> = await client.post<TokenResponse>("/auth/refresh", {
        refreshToken: token,
      });

      if (response.data.refreshToken !== undefined) {
        setCurrentRefreshToken(response.data.refreshToken);

        setMessage("Access token refreshed and the refresh token was rotated.");
      } else {
        setMessage("Access token refreshed without a replacement refresh token.");
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setMessage(`Refresh failed with HTTP ${error.response?.status ?? "unknown"}.`);
      } else {
        setMessage("Refresh failed unexpectedly.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <button type="button" onClick={handleRefresh} disabled={loading}>
        {loading ? "Rotating..." : "Refresh With Rotation"}
      </button>

      <p role="status">{message}</p>

      <p>Current refresh credential available: {currentRefreshToken !== null ? "Yes" : "No"}</p>
    </section>
  );
};

/**
 * Demonstrates stopping after a refresh-token failure.
 *
 * A failed refresh request is not retried indefinitely because the refresh
 * credential itself may be expired, revoked, or otherwise invalid.
 */
export const RefreshTokenFailure: React.FC<RefreshTokenFailureProps> = ({
  client,
  refreshToken,
}: RefreshTokenFailureProps): React.ReactElement => {
  const [message, setMessage] = useState<string>("Ready.");
  const [loading, setLoading] = useState<boolean>(false);

  const handleRefresh = async (): Promise<void> => {
    const token: string = refreshToken?.trim() ?? "";

    if (token === "") {
      setMessage("Refresh cannot start without a refresh token.");

      return;
    }

    setLoading(true);
    setMessage("Attempting token refresh...");

    try {
      await client.post<TokenResponse>("/auth/refresh", {
        refreshToken: token,
      });

      setMessage("Refresh succeeded.");
    } catch (error: unknown) {
      if (!axios.isAxiosError(error)) {
        setMessage("Refresh failed unexpectedly.");

        return;
      }

      const axiosError: AxiosError = error;
      const status: number | undefined = axiosError.response?.status;

      if (status === 400 || status === 401 || status === 403) {
        setMessage("The refresh credential was rejected. A new authentication flow may be required.");
      } else {
        setMessage(`Refresh request failed with HTTP ${status ?? "unknown"}.`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <button type="button" onClick={handleRefresh} disabled={loading}>
        {loading ? "Refreshing..." : "Attempt Refresh"}
      </button>

      <p role="status">{message}</p>
    </section>
  );
};

/**
 * Demonstrates coordinating concurrent refresh calls.
 *
 * The shared promise ensures that multiple callers can wait for one in-flight
 * refresh operation instead of independently starting duplicate refresh
 * requests.
 */
export const RefreshTokenConcurrency: React.FC<RefreshTokenConcurrencyProps> = ({
  client,
  refreshToken,
}: RefreshTokenConcurrencyProps): React.ReactElement => {
  const refreshPromiseRef = React.useRef<Promise<TokenResponse> | null>(null);

  const [message, setMessage] = useState<string>("Ready.");
  const [loading, setLoading] = useState<boolean>(false);

  const refreshAccessToken = async (): Promise<TokenResponse> => {
    const token: string = refreshToken?.trim() ?? "";

    if (token === "") {
      throw new Error("A refresh token is required.");
    }

    if (refreshPromiseRef.current !== null) {
      return refreshPromiseRef.current;
    }

    const requestPromise: Promise<TokenResponse> = client
      .post<TokenResponse>("/auth/refresh", {
        refreshToken: token,
      })
      .then((response: AxiosResponse<TokenResponse>): TokenResponse => response.data)
      .finally((): void => {
        refreshPromiseRef.current = null;
      });

    refreshPromiseRef.current = requestPromise;

    return requestPromise;
  };

  const handleConcurrentRefresh = async (): Promise<void> => {
    setLoading(true);
    setMessage("Starting coordinated refresh...");

    try {
      const responses: TokenResponse[] = await Promise.all([refreshAccessToken(), refreshAccessToken()]);

      setMessage(
        `Two callers received the shared refresh result with ${responses[0].expiresIn} seconds of access-token lifetime.`,
      );
    } catch (error: unknown) {
      setMessage(error instanceof Error ? error.message : "Coordinated refresh failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <button type="button" onClick={handleConcurrentRefresh} disabled={loading}>
        {loading ? "Refreshing..." : "Simulate Concurrent Refresh"}
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

const exampleRefreshToken: string = "example-refresh-token";

export const RefreshTokenDemo: React.FC = (): React.ReactElement => {
  return (
    <main>
      <h1>Refresh Token</h1>

      <h2>1. Exchange a Refresh Token for a New Access Token</h2>
      <RefreshTokenRequest client={apiClient} refreshToken={exampleRefreshToken} />

      <h2>2. Handle Refresh Token Rotation</h2>
      <RefreshTokenRotation client={apiClient} refreshToken={exampleRefreshToken} />

      <h2>3. Stop When the Refresh Credential Is Rejected</h2>
      <RefreshTokenFailure client={apiClient} refreshToken={exampleRefreshToken} />

      <h2>4. Coordinate Concurrent Refresh Operations</h2>
      <RefreshTokenConcurrency client={apiClient} refreshToken={exampleRefreshToken} />
    </main>
  );
};

export default RefreshTokenDemo;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - A refresh token is used to obtain new access credentials from an authentication system.
// - Refresh tokens are distinct from access tokens and are commonly sent only to a token endpoint.
// - Axios transports refresh requests but does not implement refresh-token semantics itself.
// - Refresh-token rotation replaces an old refresh credential with a new one when the server supports rotation.
// - A rejected refresh token should not be retried indefinitely with the same credential.
// - Concurrent expiration events can be coordinated through one shared in-flight refresh promise.
// - A successful refresh does not itself authorize the protected API; the resulting access token is used for protected requests.
// - Refresh tokens are sensitive credentials and should not be rendered, placed in URLs, or logged unnecessarily.
