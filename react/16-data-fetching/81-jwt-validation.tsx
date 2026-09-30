/**
 * JWT Validation
 * ==============
 *
 * JWT validation is the process of determining whether a JSON Web Token is
 * acceptable for an authentication or authorization decision. A secure
 * validator does more than decode the token: it verifies the cryptographic
 * signature and checks the claims required by the application's security
 * policy.
 *
 * For a signed compact JWT, the token contains an encoded header, an encoded
 * payload, and a signature. Signature verification reconstructs the signing
 * input from the first two encoded segments and verifies the signature using
 * the expected cryptographic algorithm and key. The algorithm must be selected
 * according to trusted server configuration rather than blindly trusting an
 * attacker-controlled `alg` value.
 *
 * Claim validation is separate from signature verification. Depending on the
 * protocol, a validator can check claims such as `iss` for the expected issuer,
 * `aud` for the intended audience, `exp` for expiration, `nbf` for the earliest
 * valid time, and `sub` for the subject. A valid signature alone does not mean
 * that the token is valid for the current API or operation.
 *
 * JWT validation should normally occur on the trusted server or API boundary.
 * Browser-side decoding can inspect a token for presentation purposes, but it
 * cannot safely establish authentication merely by reading the payload. The
 * browser should therefore treat decoded claims as untrusted data.
 *
 * A validator should also reject malformed tokens and unexpected claim types.
 * Depending on the authentication system, it may additionally enforce key
 * identifiers, token type, scopes, roles, revocation state, token freshness,
 * or other application-specific requirements.
 *
 * A common misconception is that checking `exp` is equivalent to validating a
 * JWT. Expiration is only one possible claim check. Another misconception is
 * that a syntactically correct three-segment token is automatically valid.
 * Structure, decoding, signature verification, and claim validation are
 * distinct operations.
 */

import React, { useState } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface JwtValidationClaims {
  readonly iss?: unknown;
  readonly sub?: unknown;
  readonly aud?: unknown;
  readonly exp?: unknown;
  readonly nbf?: unknown;
  readonly iat?: unknown;
  readonly jti?: unknown;

  readonly [claim: string]: unknown;
}

export interface JwtValidationProps {
  readonly token: string;
}

export interface JwtValidationStructureProps {
  readonly token: string;
}

export interface JwtValidationClaimsProps {
  readonly token: string;
  readonly expectedIssuer: string;
  readonly expectedAudience: string;
}

export interface JwtValidationExpirationProps {
  readonly token: string;
}

export interface JwtValidationNotBeforeProps {
  readonly token: string;
}

export interface JwtValidationPipelineProps {
  readonly token: string;
  readonly expectedIssuer: string;
  readonly expectedAudience: string;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * Demonstrates the distinction between token structure and complete JWT
 * validation.
 *
 * This browser-side example validates only the compact structure. Cryptographic
 * signature verification requires trusted key material and a cryptographic
 * implementation, so a three-segment result is not treated as authenticated.
 */
export const JwtValidation: React.FC<JwtValidationProps> = ({ token }: JwtValidationProps): React.ReactElement => {
  const [message, setMessage] = useState<string>("JWT validation has not been attempted.");

  const handleValidateStructure = (): void => {
    const segments: string[] = token.split(".");

    if (segments.length !== 3) {
      setMessage("The token is structurally invalid for a compact signed JWT.");

      return;
    }

    if (segments.some((segment: string): boolean => segment.length === 0)) {
      setMessage("The token contains an empty JWT segment.");

      return;
    }

    setMessage(
      "The token has three non-empty segments, but structure alone does not validate its signature or claims.",
    );
  };

  return (
    <section>
      <button type="button" onClick={handleValidateStructure} disabled={token.length === 0}>
        Validate JWT Structure
      </button>

      <p role="status">{message}</p>
    </section>
  );
};

/**
 * Demonstrates validating issuer and audience claims after decoding a JWT
 * payload.
 *
 * The comparison is intentionally presented as an inspection example. A
 * browser-side decoded claim is untrusted until the token has been validated
 * by the trusted authentication boundary.
 */
export const JwtValidationClaims: React.FC<JwtValidationClaimsProps> = ({
  token,
  expectedIssuer,
  expectedAudience,
}: JwtValidationClaimsProps): React.ReactElement => {
  const [message, setMessage] = useState<string>("Issuer and audience have not been inspected.");

  const handleValidateClaims = (): void => {
    const segments: string[] = token.split(".");

    if (segments.length !== 3) {
      setMessage("The token does not contain three JWT segments.");

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

      const claims: JwtValidationClaims = parsedPayload as JwtValidationClaims;

      const issuerMatches: boolean = claims.iss === expectedIssuer;

      const audienceMatches: boolean =
        typeof claims.aud === "string"
          ? claims.aud === expectedAudience
          : Array.isArray(claims.aud) && claims.aud.some((audience: unknown): boolean => audience === expectedAudience);

      if (issuerMatches && audienceMatches) {
        setMessage(
          "The decoded issuer and audience match the expected values. Server-side signature and claim validation is still required.",
        );
      } else if (!issuerMatches && !audienceMatches) {
        setMessage("Neither the decoded issuer nor the decoded audience matches the expected values.");
      } else if (!issuerMatches) {
        setMessage("The decoded issuer does not match the expected issuer.");
      } else {
        setMessage("The decoded audience does not match the expected audience.");
      }
    } catch {
      setMessage("The JWT payload could not be decoded as valid JSON.");
    }
  };

  return (
    <section>
      <p>Expected issuer: {expectedIssuer}</p>

      <p>Expected audience: {expectedAudience}</p>

      <button type="button" onClick={handleValidateClaims} disabled={token.length === 0}>
        Inspect Issuer and Audience
      </button>

      <p role="status">{message}</p>
    </section>
  );
};

/**
 * Demonstrates validating the expiration claim as a client-side inspection.
 *
 * The exp claim is a NumericDate in seconds, whereas JavaScript timestamps use
 * milliseconds. The component converts the units before comparing the value.
 */
export const JwtValidationExpiration: React.FC<JwtValidationExpirationProps> = ({
  token,
}: JwtValidationExpirationProps): React.ReactElement => {
  const [message, setMessage] = useState<string>("Expiration has not been inspected.");

  const handleValidateExpiration = (): void => {
    const segments: string[] = token.split(".");

    if (segments.length !== 3) {
      setMessage("The token does not contain three JWT segments.");

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
        setMessage("The JWT does not contain a valid numeric exp claim.");

        return;
      }

      const expired: boolean = Date.now() >= expiration * 1000;

      setMessage(
        expired
          ? "The decoded exp claim indicates that the token is expired."
          : "The decoded exp claim indicates that the token is not expired.",
      );
    } catch {
      setMessage("The JWT expiration claim could not be inspected.");
    }
  };

  return (
    <section>
      <button type="button" onClick={handleValidateExpiration} disabled={token.length === 0}>
        Inspect exp Claim
      </button>

      <p role="status">{message}</p>
    </section>
  );
};

/**
 * Demonstrates inspection of the JWT `nbf` claim.
 *
 * The `nbf` claim specifies the earliest time at which a token is intended to
 * be accepted. Like `exp`, it is a NumericDate measured in seconds.
 */
export const JwtValidationNotBefore: React.FC<JwtValidationNotBeforeProps> = ({
  token,
}: JwtValidationNotBeforeProps): React.ReactElement => {
  const [message, setMessage] = useState<string>("The nbf claim has not been inspected.");

  const handleValidateNotBefore = (): void => {
    const segments: string[] = token.split(".");

    if (segments.length !== 3) {
      setMessage("The token does not contain three JWT segments.");

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

      const notBefore: unknown = (
        parsedPayload as {
          readonly nbf?: unknown;
        }
      ).nbf;

      if (typeof notBefore !== "number" || !Number.isFinite(notBefore)) {
        setMessage("The JWT does not contain a valid numeric nbf claim.");

        return;
      }

      const active: boolean = Date.now() >= notBefore * 1000;

      setMessage(
        active
          ? "The decoded nbf claim does not place the token in the future."
          : "The decoded nbf claim indicates that the token is not valid yet.",
      );
    } catch {
      setMessage("The JWT nbf claim could not be inspected.");
    }
  };

  return (
    <section>
      <button type="button" onClick={handleValidateNotBefore} disabled={token.length === 0}>
        Inspect nbf Claim
      </button>

      <p role="status">{message}</p>
    </section>
  );
};

/**
 * Demonstrates a conceptual JWT validation pipeline.
 *
 * The browser performs only structural and claim inspection here. Actual
 * signature verification must use trusted key material and a cryptographic
 * verifier at a trusted authentication boundary.
 */
export const JwtValidationPipeline: React.FC<JwtValidationPipelineProps> = ({
  token,
  expectedIssuer,
  expectedAudience,
}: JwtValidationPipelineProps): React.ReactElement => {
  const [steps, setSteps] = useState<string[]>([]);

  const handleRunPipeline = (): void => {
    const segments: string[] = token.split(".");

    const nextSteps: string[] = [];

    if (segments.length !== 3) {
      nextSteps.push("Rejected: expected three compact JWT segments.");
      setSteps(nextSteps);

      return;
    }

    if (segments.some((segment: string): boolean => segment.length === 0)) {
      nextSteps.push("Rejected: one or more JWT segments are empty.");
      setSteps(nextSteps);

      return;
    }

    nextSteps.push("Structure check passed.");

    let claims: JwtValidationClaims;

    try {
      const normalizedPayload: string = segments[1].replace(/-/g, "+").replace(/_/g, "/");

      const padding: number = (4 - (normalizedPayload.length % 4)) % 4;

      const decodedPayload: string = atob(normalizedPayload + "=".repeat(padding));

      const parsedPayload: unknown = JSON.parse(decodedPayload);

      if (typeof parsedPayload !== "object" || parsedPayload === null || Array.isArray(parsedPayload)) {
        nextSteps.push("Rejected: payload is not a JSON object.");
        setSteps(nextSteps);

        return;
      }

      claims = parsedPayload as JwtValidationClaims;
      nextSteps.push("Payload decoding passed.");
    } catch {
      nextSteps.push("Rejected: payload could not be decoded as JSON.");
      setSteps(nextSteps);

      return;
    }

    if (claims.iss !== expectedIssuer) {
      nextSteps.push("Issuer check failed.");
    } else {
      nextSteps.push("Issuer check passed.");
    }

    const audienceMatches: boolean =
      typeof claims.aud === "string"
        ? claims.aud === expectedAudience
        : Array.isArray(claims.aud) && claims.aud.some((audience: unknown): boolean => audience === expectedAudience);

    if (!audienceMatches) {
      nextSteps.push("Audience check failed.");
    } else {
      nextSteps.push("Audience check passed.");
    }

    if (typeof claims.exp === "number" && Number.isFinite(claims.exp)) {
      const expired: boolean = Date.now() >= claims.exp * 1000;

      nextSteps.push(expired ? "Expiration check failed." : "Expiration check passed.");
    } else {
      nextSteps.push("Expiration check could not be performed because exp is missing or invalid.");
    }

    nextSteps.push(
      "Signature verification must be performed separately with a trusted verification key and approved algorithm policy.",
    );

    setSteps(nextSteps);
  };

  return (
    <section>
      <button type="button" onClick={handleRunPipeline} disabled={token.length === 0}>
        Run Validation Pipeline
      </button>

      {steps.length > 0 && (
        <ol>
          {steps.map((step: string, index: number): React.ReactElement => (
            <li key={index}>{step}</li>
          ))}
        </ol>
      )}
    </section>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const exampleJwt: string =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJhdXRoLmV4YW1wbGUuY29tIiwiYXVkIjoiYXBpLmV4YW1wbGUuY29tIiwic3ViIjoiMTIzNDUiLCJleHAiOjQxMDI0NDQ4MDAsImlhdCI6NDAwMDAwMDAwMH0.example-signature";

export const JwtValidationDemo: React.FC = (): React.ReactElement => {
  return (
    <main>
      <h1>JWT Validation</h1>

      <h2>1. Validate the Basic JWT Structure</h2>
      <JwtValidation token={exampleJwt} />

      <h2>2. Inspect Issuer and Audience Claims</h2>
      <JwtValidationClaims token={exampleJwt} expectedIssuer="auth.example.com" expectedAudience="api.example.com" />

      <h2>3. Inspect the JWT Expiration Claim</h2>
      <JwtValidationExpiration token={exampleJwt} />

      <h2>4. Inspect the JWT Not-Before Claim</h2>
      <JwtValidationNotBefore token={exampleJwt} />

      <h2>5. Demonstrate the JWT Validation Pipeline</h2>
      <JwtValidationPipeline token={exampleJwt} expectedIssuer="auth.example.com" expectedAudience="api.example.com" />
    </main>
  );
};

export default JwtValidationDemo;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - JWT validation is broader than decoding because it includes cryptographic signature verification and claim validation.
// - JWT structure checks determine whether a token has the expected compact representation but do not establish authenticity.
// - Signature verification must use trusted key material and an approved algorithm policy.
// - The issuer claim identifies the expected token issuer and should be validated against trusted configuration.
// - The audience claim identifies the intended recipient and should match the API's expected audience.
// - The exp claim limits how long a token can be accepted, while nbf can prevent acceptance before a specified time.
// - A valid signature does not by itself mean that a token is authorized for a particular API or operation.
// - Browser-side decoded claims are untrusted until the token has been validated by a trusted authentication boundary.
// - Authentication systems can apply additional checks such as scopes, roles, token type, key identifiers, revocation state, and application-specific requirements.
