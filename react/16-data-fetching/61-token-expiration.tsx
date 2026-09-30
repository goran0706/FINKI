/**
 * Token Expiration
 * ================
 *
 * Access tokens commonly have a finite lifetime represented by an expiration
 * time. When the server determines that an access token is expired, it can
 * reject a protected request, commonly with HTTP 401 Unauthorized.
 *
 * A client can sometimes determine an expiration instant from token metadata,
 * but client-side expiration checks are only an optimization. The server remains
 * authoritative because clocks can differ, tokens can be revoked, and the
 * server may apply additional validation rules that the client cannot observe.
 *
 * A useful client-side strategy is to consider a token expired slightly before
 * its exact expiration instant. This safety window accounts for network latency
 * and small clock differences. For example, a token with an expiration timestamp
 * five seconds in the future can be treated as effectively expired when a
 * five-second safety window is configured.
 *
 * Token expiration and token renewal are separate operations. Detecting an
 * expired token does not itself create a new credential. An application may use
 * a supported refresh mechanism or require the user to authenticate again.
 *
 * A common edge case is an expiration value that is already in the past. Such
 * a token should be treated as expired immediately. Another edge case is a
 * malformed or unavailable expiration value; the client should not assume that
 * an invalid expiration value means the token is valid.
 *
 * Token expiration must not be implemented by repeatedly retrying an expired
 * request with the same token. If the server returns 401 for an expired
 * credential, repeating the identical request with the identical credential
 * does not change the authentication state.
 */

import React, { useState } from "react";
import axios, { AxiosInstance } from "axios";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface TokenExpirationRequestProps {
  readonly client: AxiosInstance;
  readonly accessToken: string | null;
}

export interface TokenExpirationStatusProps {
  readonly expiresAt: number | null;
  readonly safetyWindowMs: number;
}

export interface TokenExpirationSafetyWindowProps {
  readonly expiresAt: number | null;
  readonly safetyWindowMs: number;
}

export interface TokenExpirationServerResponseProps {
  readonly client: AxiosInstance;
  readonly accessToken: string | null;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * Demonstrates checking a known expiration timestamp before making a protected
 * request.
 *
 * The expiration timestamp is represented as milliseconds since the Unix epoch,
 * matching the representation returned by Date.now(). The request is skipped
 * when the token is already expired.
 */
export const TokenExpirationRequest: React.FC<TokenExpirationRequestProps> = ({
  client,
  accessToken,
}: TokenExpirationRequestProps): React.ReactElement => {
  const [message, setMessage] = useState<string>("Ready.");
  const [loading, setLoading] = useState<boolean>(false);

  const handleRequest = async (): Promise<void> => {
    const token: string = accessToken?.trim() ?? "";

    if (token === "") {
      setMessage("No access token is available.");

      return;
    }

    const expiresAt: number = Date.now() + 60_000;

    if (Date.now() >= expiresAt) {
      setMessage("The access token is expired.");

      return;
    }

    setLoading(true);
    setMessage("The token is locally considered valid. Sending request...");

    try {
      await client.get<unknown>("/users/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMessage("Protected request succeeded.");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setMessage(`Server response: HTTP ${error.response?.status ?? "unknown"}.`);
      } else {
        setMessage("The protected request failed.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <button type="button" onClick={handleRequest} disabled={loading}>
        {loading ? "Requesting..." : "Check Token and Request"}
      </button>

      <p role="status">{message}</p>
    </section>
  );
};

/**
 * Demonstrates determining whether an expiration timestamp has passed.
 *
 * Date.now() and the expiration value use the same millisecond-based epoch, so
 * the comparison does not require converting between different time units.
 */
export const TokenExpirationStatus: React.FC<TokenExpirationStatusProps> = ({
  expiresAt,
}: TokenExpirationStatusProps): React.ReactElement => {
  const now: number = Date.now();
  const hasExpiration: boolean = expiresAt !== null;
  const isExpired: boolean = expiresAt !== null && now >= expiresAt;

  return (
    <section>
      <p>Expiration configured: {hasExpiration ? "Yes" : "No"}</p>

      <p>Current status: {expiresAt === null ? "Unknown" : isExpired ? "Expired" : "Not expired"}</p>
    </section>
  );
};

/**
 * Demonstrates using a safety window before the exact expiration instant.
 *
 * Treating a token as expired slightly early can avoid beginning a request when
 * the token is likely to expire while the request is being transmitted or
 * processed.
 */
export const TokenExpirationSafetyWindow: React.FC<TokenExpirationSafetyWindowProps> = ({
  expiresAt,
  safetyWindowMs,
}: TokenExpirationSafetyWindowProps): React.ReactElement => {
  const now: number = Date.now();

  const isEffectivelyExpired: boolean = expiresAt !== null && now + safetyWindowMs >= expiresAt;

  const remainingMs: number = expiresAt === null ? 0 : Math.max(expiresAt - now, 0);

  return (
    <section>
      <p>
        Effective status:{" "}
        {expiresAt === null
          ? "Unknown"
          : isEffectivelyExpired
            ? "Expired or inside safety window"
            : "Outside safety window"}
      </p>

      <p>Approximate remaining time: {remainingMs} ms</p>

      <p>Safety window: {safetyWindowMs} ms</p>
    </section>
  );
};

/**
 * Demonstrates handling a server-side expiration response.
 *
 * A local expiration check cannot guarantee that the server will accept the
 * token. The server can reject an otherwise locally valid token because of
 * clock differences, revocation, or other server-side validation rules.
 */
export const TokenExpirationServerResponse: React.FC<TokenExpirationServerResponseProps> = ({
  client,
  accessToken,
}: TokenExpirationServerResponseProps): React.ReactElement => {
  const [message, setMessage] = useState<string>("Ready.");
  const [loading, setLoading] = useState<boolean>(false);

  const handleRequest = async (): Promise<void> => {
    const token: string = accessToken?.trim() ?? "";

    if (token === "") {
      setMessage("No access token is available.");

      return;
    }

    setLoading(true);
    setMessage("Sending request to the server...");

    try {
      await client.get<unknown>("/users/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMessage("The server accepted the access token.");
    } catch (error: unknown) {
      if (!axios.isAxiosError(error)) {
        setMessage("The request failed unexpectedly.");

        return;
      }

      const status: number | undefined = error.response?.status;

      if (status === 401) {
        setMessage("The server rejected the token. A renewal or new authentication flow may be required.");
      } else {
        setMessage(`The server returned HTTP ${status ?? "unknown"}.`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <button type="button" onClick={handleRequest} disabled={loading}>
        {loading ? "Requesting..." : "Validate With Server"}
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

const exampleExpiration: number = Date.now() + 60_000;

const exampleSafetyWindow: number = 5_000;

export const TokenExpirationDemo: React.FC = (): React.ReactElement => {
  return (
    <main>
      <h1>Token Expiration</h1>

      <h2>1. Check Token Expiration Before a Protected Request</h2>
      <TokenExpirationRequest client={apiClient} accessToken={exampleAccessToken} />

      <h2>2. Determine Whether an Expiration Timestamp Has Passed</h2>
      <TokenExpirationStatus expiresAt={exampleExpiration} safetyWindowMs={exampleSafetyWindow} />

      <h2>3. Apply a Safety Window Before Exact Expiration</h2>
      <TokenExpirationSafetyWindow expiresAt={exampleExpiration} safetyWindowMs={exampleSafetyWindow} />

      <h2>4. Handle Server-Side Token Expiration</h2>
      <TokenExpirationServerResponse client={apiClient} accessToken={exampleAccessToken} />
    </main>
  );
};

export default TokenExpirationDemo;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Access tokens commonly have finite lifetimes.
// - Date.now() can be compared directly with an expiration timestamp expressed in milliseconds.
// - A safety window can treat a token as effectively expired before its exact expiration instant.
// - Client-side expiration checks are optimizations; the server remains authoritative.
// - Token expiration detection does not itself renew or replace a credential.
// - HTTP 401 commonly indicates that the server rejected the authentication credential.
// - Retrying an expired token without changing the credential does not resolve the authentication failure.
// - Clock differences, revocation, and server-side validation can make a locally valid token unacceptable to the server.
