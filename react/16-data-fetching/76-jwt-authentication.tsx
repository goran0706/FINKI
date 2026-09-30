/**
 * JWT Authentication
 * ==================
 *
 * JSON Web Token (JWT) authentication uses a signed token to represent claims
 * about an authenticated principal. A JWT commonly contains a header, payload,
 * and signature separated by periods:
 *
 *   base64url(header).base64url(payload).base64url(signature)
 *
 * The payload contains claims such as sub, exp, and iss. The payload is encoded,
 * not encrypted, so its contents must not be treated as secret data. A server
 * validates the token's signature and relevant claims before trusting it.
 *
 * In a common API architecture, the client sends a JWT in the Authorization
 * header using the Bearer authentication scheme:
 *
 *   Authorization: Bearer <token>
 *
 * The server validates the token independently. Decoding a JWT in browser
 * JavaScript is useful for presentation concerns such as displaying an expiry
 * time, but decoding does not verify the signature and must never be treated as
 * authentication.
 *
 * The exp claim represents a NumericDate, which is the number of seconds since
 * the Unix epoch. A client can use exp to avoid knowingly sending an expired
 * token, but the server remains authoritative because it can reject tokens for
 * expiration, revocation, issuer mismatch, audience mismatch, signature
 * failure, or other policy violations.
 *
 * A JWT is not automatically safer than a cookie-backed session. Security
 * depends on token lifetime, storage, transport, validation, revocation
 * strategy, and protection against XSS and CSRF as appropriate for the chosen
 * architecture.
 *
 * A common misconception is that "JWT authentication" means the browser must
 * store the token in localStorage. JWTs can be transported or stored in
 * different ways. The authentication protocol and credential storage mechanism
 * are separate design decisions.
 */

import React, { useState } from "react";
import axios, { AxiosInstance, AxiosResponse } from "axios";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface JwtClaims {
  readonly sub?: string;
  readonly iss?: string;
  readonly aud?: string | string[];
  readonly exp?: number;
  readonly iat?: number;

  readonly [claim: string]: unknown;
}

export interface JwtAuthenticationRequestProps {
  readonly client: AxiosInstance;
  readonly token: string;
}

export interface JwtAuthenticationClaimsProps {
  readonly token: string;
}

export interface JwtAuthenticationExpirationProps {
  readonly token: string;
}

export interface JwtAuthenticationUnauthorizedProps {
  readonly client: AxiosInstance;
  readonly token: string;
}

export interface JwtAuthenticationHeaderProps {
  readonly client: AxiosInstance;
  readonly token: string;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * Demonstrates sending a JWT through the Authorization Bearer header.
 *
 * The token is supplied as request configuration rather than being placed in
 * the URL. URLs can be recorded by browser history, proxies, analytics systems,
 * and server logs, so authentication credentials should not be placed there.
 */
export const JwtAuthenticationRequest: React.FC<JwtAuthenticationRequestProps> = ({
  client,
  token,
}: JwtAuthenticationRequestProps): React.ReactElement => {
  const [message, setMessage] = useState<string>("Ready.");
  const [loading, setLoading] = useState<boolean>(false);

  const handleRequest = async (): Promise<void> => {
    setLoading(true);
    setMessage("Sending the JWT as a Bearer credential...");

    try {
      const response: AxiosResponse<{
        readonly name: string;
      }> = await client.get<{
        readonly name: string;
      }>("/users/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMessage(`Authenticated API response received for ${response.data.name}.`);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setMessage(`Authenticated request failed with HTTP ${error.response?.status ?? "unknown"}.`);
      } else {
        setMessage("Authenticated request failed unexpectedly.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <p>Authentication header: Authorization: Bearer &lt;JWT&gt;</p>

      <button type="button" onClick={handleRequest} disabled={loading || token.length === 0}>
        {loading ? "Requesting..." : "Send Authenticated Request"}
      </button>

      <p role="status">{message}</p>
    </section>
  );
};

/**
 * Demonstrates decoding a JWT payload for display purposes.
 *
 * JWT payload decoding does not verify the token's signature. The component
 * therefore treats decoded claims as untrusted display data rather than as
 * proof that the user is authenticated.
 */
export const JwtAuthenticationClaims: React.FC<JwtAuthenticationClaimsProps> = ({
  token,
}: JwtAuthenticationClaimsProps): React.ReactElement => {
  const [claims, setClaims] = useState<JwtClaims | null>(null);
  const [message, setMessage] = useState<string>("JWT claims have not been decoded.");

  const handleDecode = (): void => {
    const parts: string[] = token.split(".");

    if (parts.length !== 3) {
      setClaims(null);
      setMessage("The value does not have the expected three JWT segments.");

      return;
    }

    try {
      const normalizedPayload: string = parts[1].replace(/-/g, "+").replace(/_/g, "/");

      const padding: number = (4 - (normalizedPayload.length % 4)) % 4;

      const paddedPayload: string = normalizedPayload + "=".repeat(padding);

      const decodedPayload: string = atob(paddedPayload);

      const parsedClaims: unknown = JSON.parse(decodedPayload);

      if (typeof parsedClaims !== "object" || parsedClaims === null || Array.isArray(parsedClaims)) {
        setClaims(null);
        setMessage("The JWT payload is not a JSON object.");

        return;
      }

      setClaims(parsedClaims as JwtClaims);
      setMessage("Claims decoded for display. Signature verification still requires the server.");
    } catch {
      setClaims(null);
      setMessage("The JWT payload could not be decoded as valid JSON.");
    }
  };

  return (
    <section>
      <button type="button" onClick={handleDecode} disabled={token.length === 0}>
        Decode JWT Claims
      </button>

      {claims !== null && <pre>{JSON.stringify(claims, null, 2)}</pre>}

      <p role="status">{message}</p>
    </section>
  );
};

/**
 * Demonstrates interpreting the exp claim as a client-side expiry hint.
 *
 * The exp claim uses seconds while JavaScript Date values use milliseconds.
 * Therefore the claim must be multiplied by 1000 before constructing a Date.
 */
export const JwtAuthenticationExpiration: React.FC<JwtAuthenticationExpirationProps> = ({
  token,
}: JwtAuthenticationExpirationProps): React.ReactElement => {
  const [message, setMessage] = useState<string>("Expiration has not been checked.");

  const handleCheckExpiration = (): void => {
    const parts: string[] = token.split(".");

    if (parts.length !== 3) {
      setMessage("The value does not have the expected JWT structure.");

      return;
    }

    try {
      const normalizedPayload: string = parts[1].replace(/-/g, "+").replace(/_/g, "/");

      const padding: number = (4 - (normalizedPayload.length % 4)) % 4;

      const decodedPayload: string = atob(normalizedPayload + "=".repeat(padding));

      const claims: unknown = JSON.parse(decodedPayload);

      if (
        typeof claims !== "object" ||
        claims === null ||
        Array.isArray(claims) ||
        typeof (
          claims as {
            readonly exp?: unknown;
          }
        ).exp !== "number"
      ) {
        setMessage("The JWT does not contain a numeric exp claim.");

        return;
      }

      const expirationSeconds: number = (
        claims as {
          readonly exp: number;
        }
      ).exp;

      const expirationDate: Date = new Date(expirationSeconds * 1000);

      if (!Number.isFinite(expirationDate.getTime())) {
        setMessage("The exp claim does not represent a valid date.");

        return;
      }

      const expired: boolean = Date.now() >= expirationDate.getTime();

      setMessage(
        expired
          ? `The token's exp claim is ${expirationDate.toISOString()}, so it is expired according to this client-side check.`
          : `The token's exp claim is ${expirationDate.toISOString()}, so it is not expired according to this client-side check.`,
      );
    } catch {
      setMessage("The JWT expiration claim could not be decoded.");
    }
  };

  return (
    <section>
      <button type="button" onClick={handleCheckExpiration} disabled={token.length === 0}>
        Check Token Expiration
      </button>

      <p role="status">{message}</p>
    </section>
  );
};

/**
 * Demonstrates handling an HTTP 401 response from a JWT-protected endpoint.
 *
 * A client can treat 401 as an authentication failure and clear its local
 * representation of the active token. The server's validation remains the
 * authority for whether the token is actually valid.
 */
export const JwtAuthenticationUnauthorized: React.FC<JwtAuthenticationUnauthorizedProps> = ({
  client,
  token,
}: JwtAuthenticationUnauthorizedProps): React.ReactElement => {
  const [activeToken, setActiveToken] = useState<string>(token);
  const [message, setMessage] = useState<string>("Ready.");
  const [loading, setLoading] = useState<boolean>(false);

  const handleRequest = async (): Promise<void> => {
    if (activeToken.length === 0) {
      setMessage("No active JWT is available.");

      return;
    }

    setLoading(true);
    setMessage("Requesting a protected resource...");

    try {
      await client.get<unknown>("/protected", {
        headers: {
          Authorization: `Bearer ${activeToken}`,
        },
      });

      setMessage("The protected request succeeded.");
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        setActiveToken("");
        setMessage("The server rejected the JWT with HTTP 401. The client cleared its active token.");
      } else if (axios.isAxiosError(error)) {
        setMessage(`Protected request failed with HTTP ${error.response?.status ?? "unknown"}.`);
      } else {
        setMessage("Protected request failed unexpectedly.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <p>Active JWT: {activeToken.length > 0 ? "Present" : "Cleared"}</p>

      <button type="button" onClick={handleRequest} disabled={loading || activeToken.length === 0}>
        {loading ? "Requesting..." : "Request Protected Resource"}
      </button>

      <p role="status">{message}</p>
    </section>
  );
};

/**
 * Demonstrates a reusable Axios instance configured with a JWT header.
 *
 * A request interceptor can read the current token and add the Authorization
 * header to outgoing requests. This example uses a closure around the token
 * supplied to the component rather than assuming a particular token-storage
 * mechanism.
 */
export const JwtAuthenticationHeader: React.FC<JwtAuthenticationHeaderProps> = ({
  client,
  token,
}: JwtAuthenticationHeaderProps): React.ReactElement => {
  const [message, setMessage] = useState<string>("The request client is ready.");
  const [loading, setLoading] = useState<boolean>(false);

  const handleRequest = async (): Promise<void> => {
    if (token.length === 0) {
      setMessage("A JWT is required before making the protected request.");

      return;
    }

    setLoading(true);
    setMessage("Sending the JWT through the Authorization header...");

    try {
      const response: AxiosResponse<{
        readonly message: string;
      }> = await client.get<{
        readonly message: string;
      }>("/protected", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMessage(response.data.message);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setMessage(`Protected request failed with HTTP ${error.response?.status ?? "unknown"}.`);
      } else {
        setMessage("Protected request failed unexpectedly.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <button type="button" onClick={handleRequest} disabled={loading || token.length === 0}>
        {loading ? "Requesting..." : "Send JWT Header"}
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

const exampleJwt: string =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NSIsIm5hbWUiOiJKb2huIERvZSIsImV4cCI6NDEwMjQ0NDgwMH0.example-signature";

export const JwtAuthenticationDemo: React.FC = (): React.ReactElement => {
  return (
    <main>
      <h1>JWT Authentication</h1>

      <h2>1. Send a JWT With the Bearer Authorization Header</h2>
      <JwtAuthenticationRequest client={apiClient} token={exampleJwt} />

      <h2>2. Decode JWT Claims Without Treating Them as Verified</h2>
      <JwtAuthenticationClaims token={exampleJwt} />

      <h2>3. Interpret the JWT exp Claim as an Expiration Hint</h2>
      <JwtAuthenticationExpiration token={exampleJwt} />

      <h2>4. Handle a 401 Response From a JWT-Protected Endpoint</h2>
      <JwtAuthenticationUnauthorized client={apiClient} token={exampleJwt} />

      <h2>5. Attach a JWT to a Protected Axios Request</h2>
      <JwtAuthenticationHeader client={apiClient} token={exampleJwt} />
    </main>
  );
};

export default JwtAuthenticationDemo;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - JWT authentication commonly sends a token in the Authorization: Bearer header.
// - A JWT consists of a header, payload, and signature separated by periods.
// - JWT payloads are encoded rather than encrypted, so they must not contain data that needs secrecy.
// - Client-side JWT decoding does not verify the signature and must not be used as proof of authentication.
// - The exp claim is a NumericDate measured in seconds since the Unix epoch.
// - Client-side expiration checks are useful hints, while the server remains authoritative for token validity.
// - A protected API commonly responds with HTTP 401 when the supplied authentication credential is not accepted.
// - JWT authentication does not require a particular client-side storage mechanism.
// - Token security depends on transport, storage, lifetime, validation, revocation strategy, and protection against relevant browser attacks.
