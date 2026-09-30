/**
 * JWT Refresh Token
 * =================
 *
 * A refresh token is a credential used to obtain a new access token after the
 * current access token expires or becomes unsuitable for continued API access.
 * In a typical token-based authentication system, the access token is short
 * lived and is presented to protected APIs, while the refresh token is sent to
 * a dedicated authentication endpoint that can issue a replacement access
 * token.
 *
 * Refresh tokens are usually longer lived than access tokens and have a
 * different security role. A refresh token should not normally be sent to
 * ordinary resource APIs because possession of it can allow an attacker to
 * obtain additional access tokens. The authorization server or authentication
 * service is responsible for validating the refresh token before issuing a
 * replacement access token.
 *
 * A refresh request commonly contains a payload similar to:
 *
 *   {
 *     refresh_token: "<refresh-token>"
 *   }
 *
 * The server can validate the refresh token, check its expiration and session
 * state, apply rotation or revocation rules, and return a new access token.
 * Depending on the authentication architecture, it may also return a new
 * refresh token.
 *
 * Refresh tokens do not have to be JWTs. They can be opaque random values
 * stored and validated server-side. When a refresh token is itself a JWT, the
 * server still needs to validate its signature and security-relevant claims
 * before accepting it. The token format does not remove the need for server
 * side validation.
 *
 * A common misconception is that a client should decode a refresh token and
 * decide whether it is valid before refreshing. Client-side decoding can be
 * useful for displaying non-sensitive metadata, but it does not authenticate
 * the token. The authentication server must make the authoritative decision.
 *
 * Another important distinction is that an expired access token does not
 * necessarily mean that the user's entire session has ended. A valid refresh
 * token can allow the authentication service to issue a new access token. If
 * the refresh token is expired, revoked, invalid, or otherwise rejected, the
 * client generally needs to treat the authenticated session as no longer
 * renewable.
 */

import React, { useState } from "react";
import axios, { AxiosInstance, AxiosResponse } from "axios";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface JwtRefreshTokenResponse {
  readonly accessToken: string;
  readonly refreshToken?: string;
  readonly expiresIn?: number;
}

export interface JwtRefreshTokenProps {
  readonly client: AxiosInstance;
  readonly refreshToken: string;
}

export interface JwtRefreshTokenRequestProps {
  readonly client: AxiosInstance;
  readonly refreshToken: string;
}

export interface JwtRefreshTokenSuccessProps {
  readonly client: AxiosInstance;
  readonly refreshToken: string;
}

export interface JwtRefreshTokenFailureProps {
  readonly client: AxiosInstance;
  readonly refreshToken: string;
}

export interface JwtRefreshTokenRotationProps {
  readonly client: AxiosInstance;
  readonly refreshToken: string;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * Demonstrates the basic refresh-token exchange.
 *
 * The refresh token is sent only to the authentication endpoint. The response
 * contains a replacement access token that can subsequently be used with
 * protected resource endpoints.
 */
export const JwtRefreshToken: React.FC<JwtRefreshTokenProps> = ({
  client,
  refreshToken,
}: JwtRefreshTokenProps): React.ReactElement => {
  const [accessToken, setAccessToken] = useState<string>("");
  const [message, setMessage] = useState<string>("Ready to refresh the access token.");
  const [loading, setLoading] = useState<boolean>(false);

  const handleRefresh = async (): Promise<void> => {
    if (refreshToken.length === 0) {
      setMessage("A refresh token is required.");

      return;
    }

    setLoading(true);
    setMessage("Requesting a new access token...");

    try {
      const response: AxiosResponse<JwtRefreshTokenResponse> = await client.post<JwtRefreshTokenResponse>(
        "/auth/refresh",
        {
          refresh_token: refreshToken,
        },
      );

      setAccessToken(response.data.accessToken);

      setMessage("The authentication service issued a new access token.");
    } catch (error: unknown) {
      setAccessToken("");

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
      <p>New access token: {accessToken.length > 0 ? "Available" : "Not available"}</p>

      <button type="button" onClick={handleRefresh} disabled={loading || refreshToken.length === 0}>
        {loading ? "Refreshing..." : "Refresh Access Token"}
      </button>

      <p role="status">{message}</p>
    </section>
  );
};

/**
 * Demonstrates keeping the refresh-token exchange separate from normal API
 * requests.
 *
 * The refresh endpoint receives the refresh token, while the resulting access
 * token is the credential intended for protected resource requests.
 */
export const JwtRefreshTokenRequest: React.FC<JwtRefreshTokenRequestProps> = ({
  client,
  refreshToken,
}: JwtRefreshTokenRequestProps): React.ReactElement => {
  const [message, setMessage] = useState<string>("No refresh request has been made.");
  const [loading, setLoading] = useState<boolean>(false);

  const handleRefresh = async (): Promise<void> => {
    if (refreshToken.length === 0) {
      setMessage("No refresh token is available.");

      return;
    }

    setLoading(true);

    try {
      const response: AxiosResponse<JwtRefreshTokenResponse> = await client.post<JwtRefreshTokenResponse>(
        "/auth/refresh",
        {
          refresh_token: refreshToken,
        },
      );

      setMessage(
        response.data.accessToken.length > 0
          ? "The refresh endpoint returned a new access token."
          : "The refresh endpoint returned no access token.",
      );
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setMessage(`The refresh endpoint returned HTTP ${error.response?.status ?? "unknown"}.`);
      } else {
        setMessage("The refresh request failed unexpectedly.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <p>Refresh endpoint: /auth/refresh</p>

      <button type="button" onClick={handleRefresh} disabled={loading || refreshToken.length === 0}>
        {loading ? "Refreshing..." : "Request New Access Token"}
      </button>

      <p role="status">{message}</p>
    </section>
  );
};

/**
 * Demonstrates storing a newly issued access token after a successful refresh.
 *
 * The refresh token itself is not replaced in this example. The component
 * therefore illustrates a non-rotating refresh response in which only the
 * access token changes.
 */
export const JwtRefreshTokenSuccess: React.FC<JwtRefreshTokenSuccessProps> = ({
  client,
  refreshToken,
}: JwtRefreshTokenSuccessProps): React.ReactElement => {
  const [currentAccessToken, setCurrentAccessToken] = useState<string>("");
  const [message, setMessage] = useState<string>("Ready.");
  const [loading, setLoading] = useState<boolean>(false);

  const handleRefresh = async (): Promise<void> => {
    setLoading(true);

    try {
      const response: AxiosResponse<JwtRefreshTokenResponse> = await client.post<JwtRefreshTokenResponse>(
        "/auth/refresh",
        {
          refresh_token: refreshToken,
        },
      );

      setCurrentAccessToken(response.data.accessToken);

      setMessage("The replacement access token is now the active access token.");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setMessage(`The token refresh failed with HTTP ${error.response?.status ?? "unknown"}.`);
      } else {
        setMessage("The token refresh failed unexpectedly.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <p>Active access token: {currentAccessToken.length > 0 ? "Updated" : "None"}</p>

      <button type="button" onClick={handleRefresh} disabled={loading || refreshToken.length === 0}>
        {loading ? "Refreshing..." : "Refresh and Store Access Token"}
      </button>

      <p role="status">{message}</p>
    </section>
  );
};

/**
 * Demonstrates handling a rejected refresh token.
 *
 * A failed refresh is different from an ordinary protected-resource failure:
 * the client cannot obtain another access token through the same refresh
 * credential. The application can therefore transition to an unauthenticated
 * state instead of retrying the same invalid refresh token indefinitely.
 */
export const JwtRefreshTokenFailure: React.FC<JwtRefreshTokenFailureProps> = ({
  client,
  refreshToken,
}: JwtRefreshTokenFailureProps): React.ReactElement => {
  const [authenticationState, setAuthenticationState] = useState<"authenticated" | "renewal-failed">("authenticated");

  const [message, setMessage] = useState<string>("The current session is considered renewable.");
  const [loading, setLoading] = useState<boolean>(false);

  const handleRefresh = async (): Promise<void> => {
    setLoading(true);

    try {
      await client.post<JwtRefreshTokenResponse>("/auth/refresh", {
        refresh_token: refreshToken,
      });

      setAuthenticationState("authenticated");
      setMessage("The refresh token was accepted.");
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && (error.response?.status === 400 || error.response?.status === 401)) {
        setAuthenticationState("renewal-failed");
        setMessage("The refresh credential was rejected. The session can no longer be renewed with this credential.");
      } else if (axios.isAxiosError(error)) {
        setMessage(`The refresh request failed with HTTP ${error.response?.status ?? "unknown"}.`);
      } else {
        setMessage("The refresh request failed unexpectedly.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <p>Renewal state: {authenticationState}</p>

      <button type="button" onClick={handleRefresh} disabled={loading || refreshToken.length === 0}>
        {loading ? "Refreshing..." : "Attempt Token Refresh"}
      </button>

      <p role="status">{message}</p>
    </section>
  );
};

/**
 * Demonstrates refresh-token rotation.
 *
 * With rotation, a successful refresh can return both a new access token and a
 * new refresh token. The client replaces the previously active refresh token
 * instead of continuing to use the old value.
 */
export const JwtRefreshTokenRotation: React.FC<JwtRefreshTokenRotationProps> = ({
  client,
  refreshToken,
}: JwtRefreshTokenRotationProps): React.ReactElement => {
  const [activeRefreshToken, setActiveRefreshToken] = useState<string>(refreshToken);
  const [activeAccessToken, setActiveAccessToken] = useState<string>("");
  const [message, setMessage] = useState<string>("Refresh-token rotation has not been performed.");
  const [loading, setLoading] = useState<boolean>(false);

  const handleRefresh = async (): Promise<void> => {
    if (activeRefreshToken.length === 0) {
      setMessage("No active refresh token is available.");

      return;
    }

    setLoading(true);

    try {
      const response: AxiosResponse<JwtRefreshTokenResponse> = await client.post<JwtRefreshTokenResponse>(
        "/auth/refresh",
        {
          refresh_token: activeRefreshToken,
        },
      );

      setActiveAccessToken(response.data.accessToken);

      if (typeof response.data.refreshToken === "string") {
        setActiveRefreshToken(response.data.refreshToken);
        setMessage("The access token and refresh token were both replaced.");
      } else {
        setMessage("A new access token was issued, but no replacement refresh token was returned.");
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setMessage(`Rotated refresh request failed with HTTP ${error.response?.status ?? "unknown"}.`);
      } else {
        setMessage("Rotated refresh request failed unexpectedly.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <p>Access token: {activeAccessToken.length > 0 ? "Present" : "Not available"}</p>

      <p>Refresh token: {activeRefreshToken.length > 0 ? "Present" : "Not available"}</p>

      <button type="button" onClick={handleRefresh} disabled={loading || activeRefreshToken.length === 0}>
        {loading ? "Refreshing..." : "Rotate Refresh Token"}
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

const exampleRefreshToken: string = "example-refresh-token-value";

export const JwtRefreshTokenDemo: React.FC = (): React.ReactElement => {
  return (
    <main>
      <h1>JWT Refresh Token</h1>

      <h2>1. Exchange a Refresh Token for a New Access Token</h2>
      <JwtRefreshToken client={apiClient} refreshToken={exampleRefreshToken} />

      <h2>2. Send the Refresh Token Only to the Refresh Endpoint</h2>
      <JwtRefreshTokenRequest client={apiClient} refreshToken={exampleRefreshToken} />

      <h2>3. Store the Newly Issued Access Token</h2>
      <JwtRefreshTokenSuccess client={apiClient} refreshToken={exampleRefreshToken} />

      <h2>4. Handle a Rejected Refresh Token</h2>
      <JwtRefreshTokenFailure client={apiClient} refreshToken={exampleRefreshToken} />

      <h2>5. Replace the Refresh Token During Rotation</h2>
      <JwtRefreshTokenRotation client={apiClient} refreshToken={exampleRefreshToken} />
    </main>
  );
};

export default JwtRefreshTokenDemo;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - A refresh token can be exchanged for a new access token after the access token expires.
// - Refresh tokens are normally sent to a dedicated authentication endpoint rather than ordinary resource APIs.
// - Refresh tokens can be JWTs or opaque server-managed credentials.
// - Client-side decoding does not establish that a refresh token is valid.
// - A rejected refresh token can mean that the session can no longer be renewed with that credential.
// - A successful refresh can return only a new access token or can also return a replacement refresh token.
// - Refresh-token rotation replaces the active refresh credential after a successful exchange.
// - Access-token lifetime and refresh-token lifetime serve different purposes and can be managed independently.
// - The authentication service remains authoritative for refresh-token validity, expiration, revocation, and rotation rules.
