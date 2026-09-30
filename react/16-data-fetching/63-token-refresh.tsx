/**
 * Token Refresh
 * =============
 *
 * Token refresh is the process of replacing an expired or soon-to-expire
 * access token with a newly issued access token using an authentication
 * mechanism supported by the server. A common implementation sends a refresh
 * token to a dedicated authentication endpoint and receives a new access token.
 *
 * A client-side refresh operation normally has three distinct stages: determine
 * that a refresh is needed, request replacement credentials, and update the
 * credential used by subsequent protected requests. Axios transports each HTTP
 * operation but does not decide when credentials should be refreshed.
 *
 * Refresh can be proactive when the client detects that an access token is near
 * expiration, or reactive when a protected request receives an authentication
 * failure such as HTTP 401. Proactive refresh can avoid failed application
 * requests, while reactive refresh is useful when the server is authoritative
 * about token validity.
 *
 * When a protected request receives HTTP 401, blindly retrying the same request
 * with the same access token does not change the authentication state. A valid
 * refresh operation must occur first, and the original request should only be
 * retried after a replacement access token has been obtained.
 *
 * A common concurrency edge case occurs when multiple requests discover an
 * expired access token simultaneously. Starting multiple refresh operations can
 * create unnecessary traffic and can conflict with refresh-token rotation.
 * A shared in-flight refresh promise can coordinate callers so they wait for
 * one refresh operation.
 *
 * Refresh failures must terminate the refresh path. If the refresh credential
 * is expired, revoked, or otherwise invalid, repeatedly refreshing with the
 * same credential cannot restore authentication. The application must instead
 * transition to its appropriate unauthenticated state.
 *
 * Refresh credentials are sensitive and should not be rendered, logged
 * unnecessarily, or placed in URLs. The server remains authoritative for token
 * validity even when the client performs local expiration checks.
 */

import React, { useRef, useState } from "react";
import axios, { AxiosInstance, AxiosResponse } from "axios";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface TokenRefreshResponse {
  readonly accessToken: string;
  readonly expiresIn: number;
}

export interface TokenRefreshRequestProps {
  readonly client: AxiosInstance;
  readonly refreshToken: string | null;
}

export interface TokenRefreshOnUnauthorizedProps {
  readonly client: AxiosInstance;
  readonly accessToken: string | null;
  readonly refreshToken: string | null;
}

export interface TokenRefreshProactiveProps {
  readonly client: AxiosInstance;
  readonly accessToken: string | null;
  readonly refreshToken: string | null;
}

export interface TokenRefreshConcurrencyProps {
  readonly client: AxiosInstance;
  readonly refreshToken: string | null;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * Demonstrates explicitly exchanging a refresh token for a new access token.
 *
 * The refresh token is sent to a dedicated authentication endpoint rather than
 * to the protected resource endpoint. The returned access token is kept in
 * component state for subsequent application use.
 */
export const TokenRefreshRequest: React.FC<TokenRefreshRequestProps> = ({
  client,
  refreshToken,
}: TokenRefreshRequestProps): React.ReactElement => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [message, setMessage] = useState<string>("Ready.");
  const [loading, setLoading] = useState<boolean>(false);

  const handleRefresh = async (): Promise<void> => {
    const token: string = refreshToken?.trim() ?? "";

    if (token === "") {
      setMessage("A refresh token is required.");

      return;
    }

    setLoading(true);
    setMessage("Requesting a replacement access token...");

    try {
      const response: AxiosResponse<TokenRefreshResponse> = await client.post<TokenRefreshResponse>("/auth/refresh", {
        refreshToken: token,
      });

      setAccessToken(response.data.accessToken);

      setMessage(`Token refresh succeeded. New lifetime: ${response.data.expiresIn} seconds.`);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setMessage(`Refresh failed with HTTP ${error.response?.status ?? "unknown"}.`);
      } else {
        setMessage("Token refresh failed unexpectedly.");
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

      <p>Replacement access token available: {accessToken !== null ? "Yes" : "No"}</p>
    </section>
  );
};

/**
 * Demonstrates reactive token refresh after HTTP 401.
 *
 * The protected request is attempted with the current access token. If the
 * server returns 401, the component exchanges the refresh token for a new
 * access token and retries the original operation exactly once.
 */
export const TokenRefreshOnUnauthorized: React.FC<TokenRefreshOnUnauthorizedProps> = ({
  client,
  accessToken,
  refreshToken,
}: TokenRefreshOnUnauthorizedProps): React.ReactElement => {
  const [message, setMessage] = useState<string>("Ready.");
  const [loading, setLoading] = useState<boolean>(false);

  const requestWithToken = async (token: string): Promise<AxiosResponse<unknown>> => {
    return client.get<unknown>("/users/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };

  const refreshAccessToken = async (): Promise<string> => {
    const token: string = refreshToken?.trim() ?? "";

    if (token === "") {
      throw new Error("A refresh token is required.");
    }

    const response: AxiosResponse<TokenRefreshResponse> = await client.post<TokenRefreshResponse>("/auth/refresh", {
      refreshToken: token,
    });

    return response.data.accessToken;
  };

  const handleRequest = async (): Promise<void> => {
    const initialToken: string = accessToken?.trim() ?? "";

    if (initialToken === "") {
      setMessage("No access token is available.");

      return;
    }

    setLoading(true);
    setMessage("Requesting protected data...");

    try {
      try {
        await requestWithToken(initialToken);

        setMessage("Protected request succeeded without refresh.");

        return;
      } catch (error: unknown) {
        if (!axios.isAxiosError(error) || error.response?.status !== 401) {
          throw error;
        }
      }

      setMessage("Access token was rejected. Refreshing credentials...");

      const replacementToken: string = await refreshAccessToken();

      await requestWithToken(replacementToken);

      setMessage("Token refreshed and the original request succeeded.");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setMessage(`Request flow failed with HTTP ${error.response?.status ?? "unknown"}.`);
      } else if (error instanceof Error) {
        setMessage(error.message);
      } else {
        setMessage("Authentication flow failed.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <button type="button" onClick={handleRequest} disabled={loading}>
        {loading ? "Refreshing..." : "Request With 401 Recovery"}
      </button>

      <p role="status">{message}</p>
    </section>
  );
};

/**
 * Demonstrates proactive token refresh using an expiration safety window.
 *
 * The client refreshes before the access token reaches its exact expiration
 * time. This reduces the chance that a request begins with a credential that
 * expires while the server is processing it.
 */
export const TokenRefreshProactive: React.FC<TokenRefreshProactiveProps> = ({
  client,
  accessToken,
  refreshToken,
}: TokenRefreshProactiveProps): React.ReactElement => {
  const [message, setMessage] = useState<string>("Ready.");
  const [loading, setLoading] = useState<boolean>(false);

  const handleRefreshCheck = async (): Promise<void> => {
    const currentToken: string = accessToken?.trim() ?? "";
    const currentRefreshToken: string = refreshToken?.trim() ?? "";

    if (currentToken === "") {
      setMessage("No access token is available.");

      return;
    }

    if (currentRefreshToken === "") {
      setMessage("No refresh token is available.");

      return;
    }

    const tokenExpiresAt: number = Date.now() + 2_000;
    const safetyWindowMs: number = 5_000;

    const shouldRefresh: boolean = Date.now() + safetyWindowMs >= tokenExpiresAt;

    if (!shouldRefresh) {
      setMessage("The access token is outside the refresh safety window.");

      return;
    }

    setLoading(true);
    setMessage("Token is inside the safety window. Refreshing...");

    try {
      const response: AxiosResponse<TokenRefreshResponse> = await client.post<TokenRefreshResponse>("/auth/refresh", {
        refreshToken: currentRefreshToken,
      });

      setMessage(`Proactive refresh succeeded. New lifetime: ${response.data.expiresIn} seconds.`);
    } catch (error: unknown) {
      const status: number | undefined = axios.isAxiosError(error) ? error.response?.status : undefined;

      setMessage(`Proactive refresh failed with HTTP ${status ?? "unknown"}.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <button type="button" onClick={handleRefreshCheck} disabled={loading}>
        {loading ? "Refreshing..." : "Check Refresh Window"}
      </button>

      <p role="status">{message}</p>
    </section>
  );
};

/**
 * Demonstrates sharing one in-flight refresh operation between concurrent
 * callers.
 *
 * The ref stores the promise rather than the resulting token. A second caller
 * can therefore await the same promise while the first refresh request is
 * still running.
 */
export const TokenRefreshConcurrency: React.FC<TokenRefreshConcurrencyProps> = ({
  client,
  refreshToken,
}: TokenRefreshConcurrencyProps): React.ReactElement => {
  const refreshPromiseRef = useRef<Promise<TokenRefreshResponse> | null>(null);

  const [message, setMessage] = useState<string>("Ready.");
  const [loading, setLoading] = useState<boolean>(false);

  const refreshAccessToken = async (): Promise<TokenRefreshResponse> => {
    if (refreshPromiseRef.current !== null) {
      return refreshPromiseRef.current;
    }

    const token: string = refreshToken?.trim() ?? "";

    if (token === "") {
      throw new Error("A refresh token is required.");
    }

    const refreshPromise: Promise<TokenRefreshResponse> = client
      .post<TokenRefreshResponse>("/auth/refresh", {
        refreshToken: token,
      })
      .then((response: AxiosResponse<TokenRefreshResponse>): TokenRefreshResponse => response.data)
      .finally((): void => {
        refreshPromiseRef.current = null;
      });

    refreshPromiseRef.current = refreshPromise;

    return refreshPromise;
  };

  const handleConcurrentRefresh = async (): Promise<void> => {
    setLoading(true);
    setMessage("Starting two callers that share one refresh operation...");

    try {
      const results: TokenRefreshResponse[] = await Promise.all([refreshAccessToken(), refreshAccessToken()]);

      setMessage(`Both callers received the shared result with ${results[0].expiresIn} seconds of token lifetime.`);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setMessage(`Shared refresh failed with HTTP ${error.response?.status ?? "unknown"}.`);
      } else if (error instanceof Error) {
        setMessage(error.message);
      } else {
        setMessage("Shared refresh failed unexpectedly.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <button type="button" onClick={handleConcurrentRefresh} disabled={loading}>
        {loading ? "Refreshing..." : "Coordinate Concurrent Refresh"}
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

const exampleRefreshToken: string = "example-refresh-token";

export const TokenRefreshDemo: React.FC = (): React.ReactElement => {
  return (
    <main>
      <h1>Token Refresh</h1>

      <h2>1. Exchange a Refresh Token for a New Access Token</h2>
      <TokenRefreshRequest client={apiClient} refreshToken={exampleRefreshToken} />

      <h2>2. Refresh After a Protected Request Returns 401</h2>
      <TokenRefreshOnUnauthorized
        client={apiClient}
        accessToken={exampleAccessToken}
        refreshToken={exampleRefreshToken}
      />

      <h2>3. Refresh Before Access Token Expiration</h2>
      <TokenRefreshProactive client={apiClient} accessToken={exampleAccessToken} refreshToken={exampleRefreshToken} />

      <h2>4. Coordinate Concurrent Token Refresh Operations</h2>
      <TokenRefreshConcurrency client={apiClient} refreshToken={exampleRefreshToken} />
    </main>
  );
};

export default TokenRefreshDemo;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Token refresh replaces an expired or soon-to-expire access token with a new credential.
// - A refresh token is commonly exchanged with a dedicated authentication endpoint.
// - Proactive refresh can occur before expiration by using a safety window.
// - Reactive refresh can recover from an HTTP 401 when the authentication system supports it.
// - The original protected request should be retried only after a replacement access token is obtained.
// - The same rejected access token should not be retried indefinitely.
// - Concurrent callers can share one in-flight refresh promise to avoid duplicate refresh requests.
// - A failed refresh must terminate the refresh path when the refresh credential cannot be accepted.
// - The server remains authoritative for token validity even when the client performs local expiration checks.
// - Refresh credentials should not be rendered, exposed in URLs, or logged unnecessarily.
