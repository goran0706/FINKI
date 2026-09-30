/**
 * Refresh Token Rotation
 * ======================
 *
 * Refresh token rotation is an authentication strategy in which a successful
 * refresh operation returns a replacement refresh token. The server can
 * invalidate the previously used refresh token so that the credential cannot
 * be reused indefinitely.
 *
 * A rotation flow normally sends the current refresh token to a token endpoint.
 * The server validates it and returns a new access token plus, when rotation is
 * enabled, a replacement refresh token. The client must replace its stored
 * refresh token with the newly issued value.
 *
 * Rotation changes the lifecycle of the refresh credential. The client should
 * never assume that the original refresh token remains valid after a successful
 * rotation. If the server invalidates the old token, attempting to use it again
 * can result in an authentication failure.
 *
 * A particularly important edge case is concurrent refresh. If two requests
 * attempt to rotate the same refresh token at nearly the same time, the server
 * may accept one operation and reject the other because the original token has
 * already been rotated. Client code can reduce this race by coordinating
 * concurrent refresh operations through one shared in-flight promise.
 *
 * Another edge case is refresh-token reuse detection. Some authentication
 * systems treat reuse of an already rotated token as a security event and may
 * invalidate the associated token family. The client should not automatically
 * retry the same rejected refresh token.
 *
 * Axios only transports the refresh request and its response. Rotation,
 * credential replacement, concurrency control, and failure handling are
 * application-level authentication responsibilities.
 */

import React, { useRef, useState } from "react";
import axios, { AxiosInstance, AxiosResponse } from "axios";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface RotatedTokenResponse {
  readonly accessToken: string;
  readonly refreshToken: string;
  readonly expiresIn: number;
}

export interface RefreshTokenRotationRequestProps {
  readonly client: AxiosInstance;
  readonly refreshToken: string | null;
}

export interface RefreshTokenReplacementProps {
  readonly client: AxiosInstance;
  readonly refreshToken: string | null;
}

export interface RefreshTokenReuseProps {
  readonly client: AxiosInstance;
  readonly refreshToken: string | null;
}

export interface RefreshTokenRotationConcurrencyProps {
  readonly client: AxiosInstance;
  readonly refreshToken: string | null;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * Demonstrates replacing the current refresh token after a successful rotation.
 *
 * The newly returned refresh token becomes the credential used by the next
 * refresh operation. The old value is removed from component state by replacing
 * it with the server-issued value.
 */
export const RefreshTokenRotationRequest: React.FC<RefreshTokenRotationRequestProps> = ({
  client,
  refreshToken,
}: RefreshTokenRotationRequestProps): React.ReactElement => {
  const [currentRefreshToken, setCurrentRefreshToken] = useState<string | null>(refreshToken);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [message, setMessage] = useState<string>("Ready.");
  const [loading, setLoading] = useState<boolean>(false);

  const handleRefresh = async (): Promise<void> => {
    const token: string = currentRefreshToken?.trim() ?? "";

    if (token === "") {
      setMessage("No refresh token is available.");

      return;
    }

    setLoading(true);
    setMessage("Rotating the refresh token...");

    try {
      const response: AxiosResponse<RotatedTokenResponse> = await client.post<RotatedTokenResponse>("/auth/refresh", {
        refreshToken: token,
      });

      setAccessToken(response.data.accessToken);

      setCurrentRefreshToken(response.data.refreshToken);

      setMessage("Access token refreshed and the refresh token was replaced.");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setMessage(`Rotation failed with HTTP ${error.response?.status ?? "unknown"}.`);
      } else {
        setMessage("Rotation failed unexpectedly.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <button type="button" onClick={handleRefresh} disabled={loading}>
        {loading ? "Rotating..." : "Rotate Refresh Token"}
      </button>

      <p role="status">{message}</p>

      <p>Replacement access token available: {accessToken !== null ? "Yes" : "No"}</p>

      <p>Current refresh token available: {currentRefreshToken !== null ? "Yes" : "No"}</p>
    </section>
  );
};

/**
 * Demonstrates the requirement to use the newly issued refresh token.
 *
 * Each successful rotation replaces the previous refresh credential. The second
 * operation therefore submits the replacement token rather than the original
 * token.
 */
export const RefreshTokenReplacement: React.FC<RefreshTokenReplacementProps> = ({
  client,
  refreshToken,
}: RefreshTokenReplacementProps): React.ReactElement => {
  const [currentRefreshToken, setCurrentRefreshToken] = useState<string | null>(refreshToken);
  const [rotationCount, setRotationCount] = useState<number>(0);
  const [message, setMessage] = useState<string>("Ready.");
  const [loading, setLoading] = useState<boolean>(false);

  const handleRotation = async (): Promise<void> => {
    const token: string = currentRefreshToken?.trim() ?? "";

    if (token === "") {
      setMessage("A refresh token is required.");

      return;
    }

    setLoading(true);

    try {
      const response: AxiosResponse<RotatedTokenResponse> = await client.post<RotatedTokenResponse>("/auth/refresh", {
        refreshToken: token,
      });

      setCurrentRefreshToken(response.data.refreshToken);

      setRotationCount((previousCount: number): number => previousCount + 1);

      setMessage("Rotation succeeded. The replacement refresh token is now current.");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setMessage(`Rotation failed with HTTP ${error.response?.status ?? "unknown"}.`);
      } else {
        setMessage("Rotation failed unexpectedly.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <button type="button" onClick={handleRotation} disabled={loading}>
        {loading ? "Rotating..." : "Perform Rotation"}
      </button>

      <p role="status">{message}</p>

      <p>Successful rotations: {rotationCount}</p>

      <p>The component uses the newest refresh credential for the next operation.</p>
    </section>
  );
};

/**
 * Demonstrates handling rejection of an already rotated refresh token.
 *
 * The component does not retry the same refresh credential after an
 * authentication failure because the credential may have been invalidated by
 * the previous successful rotation.
 */
export const RefreshTokenReuse: React.FC<RefreshTokenReuseProps> = ({
  client,
  refreshToken,
}: RefreshTokenReuseProps): React.ReactElement => {
  const [message, setMessage] = useState<string>("Ready.");
  const [loading, setLoading] = useState<boolean>(false);

  const handleRefresh = async (): Promise<void> => {
    const token: string = refreshToken?.trim() ?? "";

    if (token === "") {
      setMessage("No refresh token is available.");

      return;
    }

    setLoading(true);
    setMessage("Submitting the refresh credential...");

    try {
      await client.post<RotatedTokenResponse>("/auth/refresh", {
        refreshToken: token,
      });

      setMessage("Refresh succeeded. The returned replacement must be stored for future refreshes.");
    } catch (error: unknown) {
      if (!axios.isAxiosError(error)) {
        setMessage("Refresh failed unexpectedly.");

        return;
      }

      const status: number | undefined = error.response?.status;

      if (status === 400 || status === 401 || status === 403) {
        setMessage("The refresh credential was rejected. The same credential should not be retried automatically.");
      } else {
        setMessage(`Refresh failed with HTTP ${status ?? "unknown"}.`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <button type="button" onClick={handleRefresh} disabled={loading}>
        {loading ? "Refreshing..." : "Submit Refresh Credential"}
      </button>

      <p role="status">{message}</p>
    </section>
  );
};

/**
 * Demonstrates coordinating concurrent refresh requests during token rotation.
 *
 * The shared promise ensures that concurrent callers wait for the same server
 * operation. This prevents multiple callers from simultaneously submitting the
 * same refresh token when the authentication system invalidates it after use.
 */
export const RefreshTokenRotationConcurrency: React.FC<RefreshTokenRotationConcurrencyProps> = ({
  client,
  refreshToken,
}: RefreshTokenRotationConcurrencyProps): React.ReactElement => {
  const refreshPromiseRef = useRef<Promise<RotatedTokenResponse> | null>(null);

  const [message, setMessage] = useState<string>("Ready.");
  const [loading, setLoading] = useState<boolean>(false);

  const rotateRefreshToken = async (): Promise<RotatedTokenResponse> => {
    if (refreshPromiseRef.current !== null) {
      return refreshPromiseRef.current;
    }

    const token: string = refreshToken?.trim() ?? "";

    if (token === "") {
      throw new Error("A refresh token is required.");
    }

    const rotationPromise: Promise<RotatedTokenResponse> = client
      .post<RotatedTokenResponse>("/auth/refresh", {
        refreshToken: token,
      })
      .then((response: AxiosResponse<RotatedTokenResponse>): RotatedTokenResponse => response.data)
      .finally((): void => {
        refreshPromiseRef.current = null;
      });

    refreshPromiseRef.current = rotationPromise;

    return rotationPromise;
  };

  const handleConcurrentRotation = async (): Promise<void> => {
    setLoading(true);
    setMessage("Coordinating concurrent rotation requests...");

    try {
      const results: RotatedTokenResponse[] = await Promise.all([rotateRefreshToken(), rotateRefreshToken()]);

      setMessage(
        `Both callers received the shared rotated credential with ${results[0].expiresIn} seconds of access-token lifetime.`,
      );
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setMessage(`Concurrent rotation failed with HTTP ${error.response?.status ?? "unknown"}.`);
      } else if (error instanceof Error) {
        setMessage(error.message);
      } else {
        setMessage("Concurrent rotation failed unexpectedly.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <button type="button" onClick={handleConcurrentRotation} disabled={loading}>
        {loading ? "Rotating..." : "Coordinate Concurrent Rotation"}
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

export const RefreshTokenRotationDemo: React.FC = (): React.ReactElement => {
  return (
    <main>
      <h1>Refresh Token Rotation</h1>

      <h2>1. Replace the Refresh Token After Successful Rotation</h2>
      <RefreshTokenRotationRequest client={apiClient} refreshToken={exampleRefreshToken} />

      <h2>2. Use the Newly Issued Refresh Token for the Next Rotation</h2>
      <RefreshTokenReplacement client={apiClient} refreshToken={exampleRefreshToken} />

      <h2>3. Handle Reuse of a Rejected Refresh Token</h2>
      <RefreshTokenReuse client={apiClient} refreshToken={exampleRefreshToken} />

      <h2>4. Coordinate Concurrent Refresh Token Rotations</h2>
      <RefreshTokenRotationConcurrency client={apiClient} refreshToken={exampleRefreshToken} />
    </main>
  );
};

export default RefreshTokenRotationDemo;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Refresh token rotation issues a replacement refresh token after a successful refresh.
// - The newly issued refresh token should replace the previous refresh credential.
// - A rotated refresh token may no longer be valid after it has been used.
// - Reusing a rejected refresh token should not trigger an infinite retry loop.
// - Concurrent callers can share one in-flight rotation operation.
// - Coordinating concurrent rotation reduces races caused by single-use refresh credentials.
// - The server determines whether a refresh token is valid, expired, revoked, or reused.
// - Axios transports rotation requests but does not implement rotation semantics.
// - Refresh tokens are sensitive credentials and should not be exposed in rendered output, URLs, or unnecessary logs.
