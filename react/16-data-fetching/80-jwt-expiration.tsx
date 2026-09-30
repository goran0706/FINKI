/**
 * JWT Expiration
 * ==============
 *
 * JWT expiration is commonly represented by the registered `exp` claim in the
 * token payload. The claim is a NumericDate: an integer representing seconds
 * since 00:00:00 UTC on 1 January 1970. A token is considered expired when the
 * current time is greater than or equal to the `exp` value.
 *
 * JavaScript timestamps returned by Date.now() are measured in milliseconds,
 * so an `exp` value must be multiplied by 1000 before comparing it with
 * Date.now() or constructing a JavaScript Date.
 *
 * The `exp` claim is part of the token's claims and is normally validated by
 * the server that accepts the JWT. A browser can decode the payload and use
 * `exp` for user-interface behavior, such as showing an expiration time or
 * avoiding a request that is already known to be expired, but this does not
 * validate the token's signature or establish that the claim is trustworthy.
 *
 * An expiration check can also be affected by clock differences between the
 * client and server. Authentication systems may therefore account for a small
 * clock-skew tolerance. The exact tolerance is determined by the validating
 * service rather than by the JWT format itself.
 *
 * A token without an `exp` claim is not automatically expired merely because
 * the claim is absent. Whether `exp` is required depends on the authentication
 * protocol and the server's validation policy. Conversely, having a future
 * `exp` value does not make a token valid: signature verification, issuer,
 * audience, not-before, revocation, and other required checks can still fail.
 */

import React, { useState } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface JwtExpirationProps {
  readonly token: string;
}

export interface JwtExpirationStatusProps {
  readonly token: string;
}

export interface JwtExpirationDateProps {
  readonly token: string;
}

export interface JwtExpirationRemainingProps {
  readonly token: string;
}

export interface JwtExpirationMissingClaimProps {
  readonly token: string;
}

export interface JwtExpirationClockSkewProps {
  readonly token: string;
  readonly toleranceSeconds: number;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * Demonstrates a basic client-side check of the JWT `exp` claim.
 *
 * The payload is decoded only to inspect the expiration value. The result must
 * not be treated as proof that the JWT is authentic or accepted by an API.
 */
export const JwtExpiration: React.FC<JwtExpirationProps> = ({ token }: JwtExpirationProps): React.ReactElement => {
  const [message, setMessage] = useState<string>("Expiration has not been checked.");

  const handleCheckExpiration = (): void => {
    const segments: string[] = token.split(".");

    if (segments.length !== 3) {
      setMessage("The value does not contain the expected three JWT segments.");

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

      const expirationMilliseconds: number = expiration * 1000;

      const expired: boolean = Date.now() >= expirationMilliseconds;

      setMessage(
        expired
          ? "The token is expired according to its decoded exp claim."
          : "The token is not expired according to its decoded exp claim.",
      );
    } catch {
      setMessage("The JWT payload could not be decoded.");
    }
  };

  return (
    <section>
      <button type="button" onClick={handleCheckExpiration} disabled={token.length === 0}>
        Check JWT Expiration
      </button>

      <p role="status">{message}</p>
    </section>
  );
};

/**
 * Demonstrates converting the JWT `exp` NumericDate into a JavaScript Date.
 *
 * JWT NumericDate values use seconds, while JavaScript Date uses milliseconds
 * internally. Multiplying by 1000 performs the required unit conversion.
 */
export const JwtExpirationDate: React.FC<JwtExpirationDateProps> = ({
  token,
}: JwtExpirationDateProps): React.ReactElement => {
  const [expirationDate, setExpirationDate] = useState<string | null>(null);
  const [message, setMessage] = useState<string>("No expiration date has been calculated.");

  const handleReadExpiration = (): void => {
    const segments: string[] = token.split(".");

    if (segments.length !== 3) {
      setExpirationDate(null);
      setMessage("The token does not have the expected JWT structure.");

      return;
    }

    try {
      const normalizedPayload: string = segments[1].replace(/-/g, "+").replace(/_/g, "/");

      const padding: number = (4 - (normalizedPayload.length % 4)) % 4;

      const decodedPayload: string = atob(normalizedPayload + "=".repeat(padding));

      const parsedPayload: unknown = JSON.parse(decodedPayload);

      if (typeof parsedPayload !== "object" || parsedPayload === null || Array.isArray(parsedPayload)) {
        setExpirationDate(null);
        setMessage("The JWT payload is not a JSON object.");

        return;
      }

      const expiration: unknown = (
        parsedPayload as {
          readonly exp?: unknown;
        }
      ).exp;

      if (typeof expiration !== "number" || !Number.isFinite(expiration)) {
        setExpirationDate(null);
        setMessage("The JWT does not contain a valid numeric exp claim.");

        return;
      }

      const date: Date = new Date(expiration * 1000);

      if (!Number.isFinite(date.getTime())) {
        setExpirationDate(null);
        setMessage("The exp value does not represent a valid JavaScript date.");

        return;
      }

      setExpirationDate(date.toISOString());
      setMessage("The JWT expiration time was converted from seconds to a JavaScript date.");
    } catch {
      setExpirationDate(null);
      setMessage("The JWT expiration value could not be decoded.");
    }
  };

  return (
    <section>
      <button type="button" onClick={handleReadExpiration} disabled={token.length === 0}>
        Read Expiration Date
      </button>

      {expirationDate !== null && <p>Expiration: {expirationDate}</p>}

      <p role="status">{message}</p>
    </section>
  );
};

/**
 * Demonstrates calculating the approximate amount of time remaining before
 * the decoded JWT `exp` claim.
 *
 * The calculation is intentionally a display-oriented client-side estimate.
 * Server-side validation remains authoritative.
 */
export const JwtExpirationRemaining: React.FC<JwtExpirationRemainingProps> = ({
  token,
}: JwtExpirationRemainingProps): React.ReactElement => {
  const [message, setMessage] = useState<string>("Remaining lifetime has not been calculated.");

  const handleCalculateRemaining = (): void => {
    const segments: string[] = token.split(".");

    if (segments.length !== 3) {
      setMessage("The token does not have the expected JWT structure.");

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

      const remainingMilliseconds: number = expiration * 1000 - Date.now();

      if (remainingMilliseconds <= 0) {
        setMessage("The token has no remaining lifetime according to the client clock.");

        return;
      }

      const remainingSeconds: number = Math.ceil(remainingMilliseconds / 1000);

      const remainingMinutes: number = Math.floor(remainingSeconds / 60);

      const displaySeconds: number = remainingSeconds % 60;

      setMessage(`${remainingMinutes} minute(s) and ${displaySeconds} second(s) remain according to the client clock.`);
    } catch {
      setMessage("The JWT expiration could not be calculated.");
    }
  };

  return (
    <section>
      <button type="button" onClick={handleCalculateRemaining} disabled={token.length === 0}>
        Calculate Remaining Lifetime
      </button>

      <p role="status">{message}</p>
    </section>
  );
};

/**
 * Demonstrates the edge case where the `exp` claim is absent.
 *
 * The absence of `exp` is not equivalent to an expired token. Whether an
 * expiration claim is mandatory is determined by the authentication protocol
 * and the validating service.
 */
export const JwtExpirationMissingClaim: React.FC<JwtExpirationMissingClaimProps> = ({
  token,
}: JwtExpirationMissingClaimProps): React.ReactElement => {
  const [message, setMessage] = useState<string>("The presence of exp has not been inspected.");

  const handleInspectClaim = (): void => {
    const segments: string[] = token.split(".");

    if (segments.length !== 3) {
      setMessage("The token does not have the expected JWT structure.");

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

      const hasExpiration: boolean = Object.prototype.hasOwnProperty.call(parsedPayload, "exp");

      setMessage(
        hasExpiration
          ? "The JWT payload contains an exp claim."
          : "The JWT payload does not contain an exp claim. Absence is not itself proof that the token is expired.",
      );
    } catch {
      setMessage("The JWT payload could not be inspected.");
    }
  };

  return (
    <section>
      <button type="button" onClick={handleInspectClaim} disabled={token.length === 0}>
        Inspect exp Claim
      </button>

      <p role="status">{message}</p>
    </section>
  );
};

/**
 * Demonstrates applying an explicit client-side clock-skew tolerance to an
 * expiration display check.
 *
 * Clock skew handling is an application-level policy. This component uses the
 * supplied tolerance only for its local comparison and does not change the
 * token's actual exp claim.
 */
export const JwtExpirationClockSkew: React.FC<JwtExpirationClockSkewProps> = ({
  token,
  toleranceSeconds,
}: JwtExpirationClockSkewProps): React.ReactElement => {
  const [message, setMessage] = useState<string>("Clock-skew-aware expiration has not been checked.");

  const handleCheck = (): void => {
    if (!Number.isFinite(toleranceSeconds) || toleranceSeconds < 0) {
      setMessage("Clock-skew tolerance must be a finite non-negative number.");

      return;
    }

    const segments: string[] = token.split(".");

    if (segments.length !== 3) {
      setMessage("The token does not have the expected JWT structure.");

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

      const toleranceMilliseconds: number = toleranceSeconds * 1000;

      const expirationWithTolerance: number = expiration * 1000 - toleranceMilliseconds;

      const consideredExpired: boolean = Date.now() >= expirationWithTolerance;

      setMessage(
        consideredExpired
          ? `The token is considered expired using a ${toleranceSeconds}-second client-side clock-skew tolerance.`
          : `The token is not considered expired using a ${toleranceSeconds}-second client-side clock-skew tolerance.`,
      );
    } catch {
      setMessage("The JWT expiration could not be evaluated.");
    }
  };

  return (
    <section>
      <p>Clock-skew tolerance: {toleranceSeconds} seconds</p>

      <button type="button" onClick={handleCheck} disabled={token.length === 0}>
        Check With Clock Skew
      </button>

      <p role="status">{message}</p>
    </section>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const exampleJwt: string =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NSIsImV4cCI6NDEwMjQ0NDgwMH0.example-signature";

export const JwtExpirationDemo: React.FC = (): React.ReactElement => {
  return (
    <main>
      <h1>JWT Expiration</h1>

      <h2>1. Check Whether a JWT Is Expired</h2>
      <JwtExpiration token={exampleJwt} />

      <h2>2. Convert the exp NumericDate Into a JavaScript Date</h2>
      <JwtExpirationDate token={exampleJwt} />

      <h2>3. Calculate the Remaining Access-Token Lifetime</h2>
      <JwtExpirationRemaining token={exampleJwt} />

      <h2>4. Handle a JWT Without an exp Claim</h2>
      <JwtExpirationMissingClaim token={exampleJwt} />

      <h2>5. Apply a Client-Side Clock-Skew Tolerance</h2>
      <JwtExpirationClockSkew token={exampleJwt} toleranceSeconds={30} />
    </main>
  );
};

export default JwtExpirationDemo;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - The JWT exp claim is a NumericDate measured in seconds since the Unix epoch.
// - JavaScript Date and Date.now() use milliseconds, so exp values require a 1000x conversion.
// - A token is expired when the current time is greater than or equal to its exp value.
// - Client-side expiration checks are useful for interface behavior but do not authenticate a JWT.
// - The server must validate the signature and all required security claims before trusting exp.
// - A missing exp claim is not automatically equivalent to an expired token; the validation policy determines whether exp is required.
// - A future exp value does not prove that a token is otherwise valid.
// - Client and server clocks can differ, so authentication systems may account for clock skew.
// - Clock-skew tolerance is a validation policy and does not modify the JWT's actual expiration claim.
