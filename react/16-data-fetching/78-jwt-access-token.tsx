/**
 * JWT Access Token
 * ================
 *
 * A JWT access token is a bearer credential that represents authorization
 * granted by an authentication server or another trusted issuer. A client
 * commonly sends the access token to an API using the HTTP Authorization header
 * with the Bearer authentication scheme.
 *
 * An access token can contain claims describing the subject, issuer, audience,
 * expiration time, issuance time, scopes, roles, or other authorization data.
 * The API must validate the token's signature and security-relevant claims before
 * using those claims to authorize an operation.
 *
 * Access-token handling has two distinct concerns: token representation and
 * token transport. A JWT can be decoded because its header and payload are
 * Base64URL-encoded, but decoding does not establish that the token is valid.
 * Transport determines how the credential reaches the API, such as through an
 * Authorization header or a browser-managed cookie in a different architecture.
 *
 * Access tokens should normally be short-lived relative to long-lived session
 * credentials. When an access token expires, an authentication system may issue
 * a replacement through a refresh mechanism rather than extending the original
 * token indefinitely. The exact lifetime and renewal strategy are application
 * design decisions.
 *
 * The audience claim is particularly important for access tokens. An API should
 * verify that the token was intended for that API rather than accepting any
 * valid token issued by the same authorization system. Likewise, the issuer,
 * signature algorithm, signature, expiration, and other required claims must be
 * checked according to the API's authentication contract.
 *
 * A common misconception is that possession of a JWT access token proves that
 * the client is currently authorized for every operation. Authorization can be
 * narrower than authentication: a valid token may still lack the required
 * scope, role, audience, or other permission for a particular endpoint.
 */

import React, { useState } from "react";
import axios, { AxiosInstance, AxiosResponse } from "axios";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface JwtAccessTokenProps {
  readonly client: AxiosInstance;
  readonly accessToken: string;
}

export interface JwtAccessTokenHeaderProps {
  readonly accessToken: string;
}

export interface JwtAccessTokenAudienceProps {
  readonly accessToken: string;
  readonly expectedAudience: string;
}

export interface JwtAccessTokenScopeProps {
  readonly client: AxiosInstance;
  readonly accessToken: string;
  readonly requiredScope: string;
}

export interface JwtAccessTokenExpirationProps {
  readonly accessToken: string;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * Demonstrates sending a JWT access token as a Bearer credential.
 *
 * The access token is transmitted in the Authorization header rather than in a
 * query string or request body. The API remains responsible for validating
 * the token before granting access to protected data.
 */
export const JwtAccessToken: React.FC<JwtAccessTokenProps> = ({
  client,
  accessToken,
}: JwtAccessTokenProps): React.ReactElement => {
  const [message, setMessage] = useState<string>("Ready.");
  const [loading, setLoading] = useState<boolean>(false);

  const handleRequest = async (): Promise<void> => {
    if (accessToken.length === 0) {
      setMessage("An access token is required.");

      return;
    }

    setLoading(true);
    setMessage("Sending the JWT access token...");

    try {
      const response: AxiosResponse<{
        readonly message: string;
      }> = await client.get<{
        readonly message: string;
      }>("/protected", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
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
      <p>Access token status: {accessToken.length > 0 ? "Present" : "Missing"}</p>

      <button type="button" onClick={handleRequest} disabled={loading || accessToken.length === 0}>
        {loading ? "Requesting..." : "Send Access Token"}
      </button>

      <p role="status">{message}</p>
    </section>
  );
};

/**
 * Demonstrates the transport format used for a Bearer access token.
 *
 * The component displays the header shape without exposing the complete token
 * value in the interface. The Authorization header is an HTTP request header,
 * not a JWT claim.
 */
export const JwtAccessTokenHeader: React.FC<JwtAccessTokenHeaderProps> = ({
  accessToken,
}: JwtAccessTokenHeaderProps): React.ReactElement => {
  const [header, setHeader] = useState<string>("Authorization header has not been prepared.");

  const handlePrepareHeader = (): void => {
    if (accessToken.length === 0) {
      setHeader("Cannot prepare a Bearer header without an access token.");

      return;
    }

    setHeader("Authorization: Bearer <access-token>");
  };

  return (
    <section>
      <button type="button" onClick={handlePrepareHeader} disabled={accessToken.length === 0}>
        Prepare Bearer Header
      </button>

      <p role="status">{header}</p>
    </section>
  );
};

/**
 * Demonstrates checking an access token's audience claim for an expected API.
 *
 * This is a client-side inspection example only. The API must perform the
 * authoritative audience validation because decoded JWT claims are untrusted
 * until the token's signature and security requirements have been verified.
 */
export const JwtAccessTokenAudience: React.FC<JwtAccessTokenAudienceProps> = ({
  accessToken,
  expectedAudience,
}: JwtAccessTokenAudienceProps): React.ReactElement => {
  const [message, setMessage] = useState<string>("Audience has not been inspected.");

  const handleCheckAudience = (): void => {
    const segments: string[] = accessToken.split(".");

    if (segments.length !== 3) {
      setMessage("The access token does not have the expected JWT structure.");

      return;
    }

    try {
      const normalizedPayload: string = segments[1].replace(/-/g, "+").replace(/_/g, "/");

      const padding: number = (4 - (normalizedPayload.length % 4)) % 4;

      const decodedPayload: string = atob(normalizedPayload + "=".repeat(padding));

      const parsedPayload: unknown = JSON.parse(decodedPayload);

      if (typeof parsedPayload !== "object" || parsedPayload === null || Array.isArray(parsedPayload)) {
        setMessage("The JWT payload is not a JSON object.");

        return;
      }

      const payload: {
        readonly aud?: unknown;
      } = parsedPayload as {
        readonly aud?: unknown;
      };

      const audience: unknown = payload.aud;

      const matches: boolean =
        typeof audience === "string"
          ? audience === expectedAudience
          : Array.isArray(audience) && audience.some((value: unknown): boolean => value === expectedAudience);

      setMessage(
        matches
          ? "The decoded audience contains the expected API identifier. The server must still validate the token."
          : "The decoded audience does not contain the expected API identifier.",
      );
    } catch {
      setMessage("The access token payload could not be decoded.");
    }
  };

  return (
    <section>
      <p>Expected audience: {expectedAudience}</p>

      <button type="button" onClick={handleCheckAudience} disabled={accessToken.length === 0}>
        Inspect Audience
      </button>

      <p role="status">{message}</p>
    </section>
  );
};

/**
 * Demonstrates that a valid access token can still lack permission for a
 * particular operation.
 *
 * The client can send a token to a scope-protected endpoint, but the API must
 * decide whether the token contains the required scope. A successful token
 * validation does not automatically grant every permission.
 */
export const JwtAccessTokenScope: React.FC<JwtAccessTokenScopeProps> = ({
  client,
  accessToken,
  requiredScope,
}: JwtAccessTokenScopeProps): React.ReactElement => {
  const [message, setMessage] = useState<string>(`Ready to request an operation requiring "${requiredScope}".`);
  const [loading, setLoading] = useState<boolean>(false);

  const handleRequest = async (): Promise<void> => {
    if (accessToken.length === 0) {
      setMessage("An access token is required.");

      return;
    }

    setLoading(true);
    setMessage(`Requesting an operation requiring "${requiredScope}"...`);

    try {
      await client.get<unknown>("/protected/write", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      setMessage(
        "The API accepted the request. The server determined that the token was authorized for the operation.",
      );
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.status === 403) {
        setMessage(
          `The API rejected the operation with HTTP 403. A valid access token can still lack the required "${requiredScope}" permission.`,
        );
      } else if (axios.isAxiosError(error)) {
        setMessage(`The protected operation failed with HTTP ${error.response?.status ?? "unknown"}.`);
      } else {
        setMessage("The protected operation failed unexpectedly.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <p>Required scope: {requiredScope}</p>

      <button type="button" onClick={handleRequest} disabled={loading || accessToken.length === 0}>
        {loading ? "Requesting..." : "Request Scoped Operation"}
      </button>

      <p role="status">{message}</p>
    </section>
  );
};

/**
 * Demonstrates inspecting the exp claim of an access token.
 *
 * The exp claim is a NumericDate measured in seconds since the Unix epoch.
 * This component uses the claim only as a client-side display hint and does not
 * treat decoding as token validation.
 */
export const JwtAccessTokenExpiration: React.FC<JwtAccessTokenExpirationProps> = ({
  accessToken,
}: JwtAccessTokenExpirationProps): React.ReactElement => {
  const [message, setMessage] = useState<string>("Access-token expiration has not been inspected.");

  const handleCheckExpiration = (): void => {
    const segments: string[] = accessToken.split(".");

    if (segments.length !== 3) {
      setMessage("The access token does not have the expected JWT structure.");

      return;
    }

    try {
      const normalizedPayload: string = segments[1].replace(/-/g, "+").replace(/_/g, "/");

      const padding: number = (4 - (normalizedPayload.length % 4)) % 4;

      const decodedPayload: string = atob(normalizedPayload + "=".repeat(padding));

      const parsedPayload: unknown = JSON.parse(decodedPayload);

      if (typeof parsedPayload !== "object" || parsedPayload === null || Array.isArray(parsedPayload)) {
        setMessage("The JWT payload is not a JSON object.");

        return;
      }

      const expiration: unknown = (
        parsedPayload as {
          readonly exp?: unknown;
        }
      ).exp;

      if (typeof expiration !== "number" || !Number.isFinite(expiration)) {
        setMessage("The access token does not contain a valid numeric exp claim.");

        return;
      }

      const expirationDate: Date = new Date(expiration * 1000);

      const expired: boolean = Date.now() >= expirationDate.getTime();

      setMessage(
        expired
          ? `The decoded access token expiration is ${expirationDate.toISOString()}; the client-side check considers it expired.`
          : `The decoded access token expiration is ${expirationDate.toISOString()}; the client-side check considers it unexpired.`,
      );
    } catch {
      setMessage("The access-token expiration could not be decoded.");
    }
  };

  return (
    <section>
      <button type="button" onClick={handleCheckExpiration} disabled={accessToken.length === 0}>
        Check Access Token Expiration
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

const exampleAccessToken: string =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NSIsImF1ZCI6ImFwaS5leGFtcGxlLmNvbSIsInNjb3BlIjoicmVhZCB3cml0ZSIsImV4cCI6NDEwMjQ0NDgwMH0.example-signature";

export const JwtAccessTokenDemo: React.FC = (): React.ReactElement => {
  return (
    <main>
      <h1>JWT Access Token</h1>

      <h2>1. Send a JWT Access Token to a Protected API</h2>
      <JwtAccessToken client={apiClient} accessToken={exampleAccessToken} />

      <h2>2. Construct the Bearer Authorization Header</h2>
      <JwtAccessTokenHeader accessToken={exampleAccessToken} />

      <h2>3. Inspect the Access Token Audience</h2>
      <JwtAccessTokenAudience accessToken={exampleAccessToken} expectedAudience="api.example.com" />

      <h2>4. Distinguish Token Validity From Scope Authorization</h2>
      <JwtAccessTokenScope client={apiClient} accessToken={exampleAccessToken} requiredScope="write" />

      <h2>5. Inspect Access Token Expiration</h2>
      <JwtAccessTokenExpiration accessToken={exampleAccessToken} />
    </main>
  );
};

export default JwtAccessTokenDemo;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - A JWT access token commonly represents authorization for protected API resources.
// - Bearer access tokens are commonly transmitted through the Authorization header.
// - The API must validate the token's signature and relevant claims before trusting it.
// - The audience claim helps ensure that an access token was intended for the receiving API.
// - A valid access token does not automatically grant every operation; scopes and other authorization rules can restrict access.
// - The exp claim can provide a client-side expiration hint, but the server remains authoritative for token validity.
// - JWT decoding exposes encoded claims but does not verify the token.
// - Access-token transport and access-token storage are separate architectural decisions.
// - Short-lived access tokens can be combined with a separate renewal mechanism when an application requires continued authentication.
