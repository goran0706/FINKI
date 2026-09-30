/**
 * JWT Structure
 * =============
 *
 * A JSON Web Token (JWT) is a compact representation of claims that can be
 * transferred between parties. A signed JWT commonly uses the compact
 * serialization format consisting of three Base64URL-encoded segments:
 *
 *   header.payload.signature
 *
 * The header identifies metadata about the token, commonly including the
 * signing algorithm through the alg property and the token type through typ.
 * The payload contains claims such as sub, iss, aud, iat, and exp. The signature
 * protects the integrity of the encoded header and payload when a supported
 * signing algorithm and verification key are used.
 *
 * The first two JWT segments are Base64URL-encoded JSON objects. Base64URL is
 * an encoding, not encryption. Anyone who obtains a JWT can generally decode
 * its header and payload without possessing the signing key. Confidential
 * information therefore should not be placed in an ordinary signed JWT merely
 * because the payload is encoded.
 *
 * For a compact JWS-style JWT, the signing input is the ASCII representation
 * of the encoded header, a period, and the encoded payload:
 *
 *   encodedHeader + "." + encodedPayload
 *
 * The signature is calculated over that signing input. A verifier reconstructs
 * the signing input and validates the signature with the expected algorithm and
 * key. Decoding the three segments in browser code does not perform that
 * verification.
 *
 * The payload is a JSON object of claims. Registered claim names such as iss,
 * sub, aud, exp, nbf, iat, and jti have standardized meanings, while private
 * claims can carry application-specific information. The presence of a claim
 * does not by itself make its value trustworthy; trust comes from successful
 * server-side validation of the token and its claims.
 *
 * A common misconception is that every JWT must contain exactly these three
 * segments. Three segments are typical for a signed compact JWS token, while
 * encrypted JWT representations have different structures. Another common
 * misconception is that the signature hides the payload. It does not; the
 * signature provides integrity and authenticity when correctly verified.
 */

import React, { useState } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface JwtHeader {
  readonly alg?: string;
  readonly typ?: string;
  readonly kid?: string;

  readonly [claim: string]: unknown;
}

export interface JwtPayload {
  readonly iss?: string;
  readonly sub?: string;
  readonly aud?: string | readonly string[];
  readonly exp?: number;
  readonly nbf?: number;
  readonly iat?: number;
  readonly jti?: string;

  readonly [claim: string]: unknown;
}

export interface JwtStructureProps {
  readonly token: string;
}

export interface JwtHeaderProps {
  readonly token: string;
}

export interface JwtPayloadProps {
  readonly token: string;
}

export interface JwtSignatureProps {
  readonly token: string;
}

export interface JwtSegmentsProps {
  readonly token: string;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * Demonstrates the three-segment compact structure of a signed JWT.
 *
 * The component only inspects the token shape. It does not claim that the
 * signature is valid or that the decoded claims are trustworthy.
 */
export const JwtStructure: React.FC<JwtStructureProps> = ({ token }: JwtStructureProps): React.ReactElement => {
  const [message, setMessage] = useState<string>("JWT structure has not been inspected.");

  const handleInspect = (): void => {
    const segments: string[] = token.split(".");

    if (segments.length !== 3) {
      setMessage(`This value contains ${segments.length} segments; a compact signed JWT normally contains three.`);

      return;
    }

    setMessage("The value contains three compact JWT segments: header, payload, and signature.");
  };

  return (
    <section>
      <button type="button" onClick={handleInspect} disabled={token.length === 0}>
        Inspect JWT Structure
      </button>

      <p role="status">{message}</p>
    </section>
  );
};

/**
 * Demonstrates decoding the JWT header.
 *
 * Base64URL decoding reveals the JSON representation but does not validate the
 * signature or establish that the declared algorithm should be trusted.
 */
export const JwtHeader: React.FC<JwtHeaderProps> = ({ token }: JwtHeaderProps): React.ReactElement => {
  const [header, setHeader] = useState<JwtHeader | null>(null);
  const [message, setMessage] = useState<string>("JWT header has not been decoded.");

  const handleDecode = (): void => {
    const segments: string[] = token.split(".");

    if (segments.length !== 3) {
      setHeader(null);
      setMessage("The token does not contain three JWT segments.");

      return;
    }

    try {
      const normalizedHeader: string = segments[0].replace(/-/g, "+").replace(/_/g, "/");

      const padding: number = (4 - (normalizedHeader.length % 4)) % 4;

      const decodedHeader: string = atob(normalizedHeader + "=".repeat(padding));

      const parsedHeader: unknown = JSON.parse(decodedHeader);

      if (typeof parsedHeader !== "object" || parsedHeader === null || Array.isArray(parsedHeader)) {
        setHeader(null);
        setMessage("The decoded header is not a JSON object.");

        return;
      }

      setHeader(parsedHeader as JwtHeader);
      setMessage("The JWT header was decoded. Decoding does not verify the token.");
    } catch {
      setHeader(null);
      setMessage("The JWT header could not be decoded as valid JSON.");
    }
  };

  return (
    <section>
      <button type="button" onClick={handleDecode} disabled={token.length === 0}>
        Decode JWT Header
      </button>

      {header !== null && <pre>{JSON.stringify(header, null, 2)}</pre>}

      <p role="status">{message}</p>
    </section>
  );
};

/**
 * Demonstrates decoding the JWT payload.
 *
 * The payload is Base64URL-encoded JSON. Decoding it does not verify the
 * signature, issuer, audience, expiration, or any other security property.
 */
export const JwtPayload: React.FC<JwtPayloadProps> = ({ token }: JwtPayloadProps): React.ReactElement => {
  const [payload, setPayload] = useState<JwtPayload | null>(null);
  const [message, setMessage] = useState<string>("JWT payload has not been decoded.");

  const handleDecode = (): void => {
    const segments: string[] = token.split(".");

    if (segments.length !== 3) {
      setPayload(null);
      setMessage("The token does not contain three JWT segments.");

      return;
    }

    try {
      const normalizedPayload: string = segments[1].replace(/-/g, "+").replace(/_/g, "/");

      const padding: number = (4 - (normalizedPayload.length % 4)) % 4;

      const decodedPayload: string = atob(normalizedPayload + "=".repeat(padding));

      const parsedPayload: unknown = JSON.parse(decodedPayload);

      if (typeof parsedPayload !== "object" || parsedPayload === null || Array.isArray(parsedPayload)) {
        setPayload(null);
        setMessage("The decoded payload is not a JSON object.");

        return;
      }

      setPayload(parsedPayload as JwtPayload);
      setMessage("The JWT payload was decoded for inspection only.");
    } catch {
      setPayload(null);
      setMessage("The JWT payload could not be decoded as valid JSON.");
    }
  };

  return (
    <section>
      <button type="button" onClick={handleDecode} disabled={token.length === 0}>
        Decode JWT Payload
      </button>

      {payload !== null && <pre>{JSON.stringify(payload, null, 2)}</pre>}

      <p role="status">{message}</p>
    </section>
  );
};

/**
 * Demonstrates that the signature is a separate encoded segment.
 *
 * The signature is not decoded as JSON. It is binary data represented using
 * Base64URL in compact serialization. Actual signature verification requires
 * the expected algorithm and cryptographic key and should be performed by a
 * trusted verifier.
 */
export const JwtSignature: React.FC<JwtSignatureProps> = ({ token }: JwtSignatureProps): React.ReactElement => {
  const [signatureLength, setSignatureLength] = useState<number | null>(null);
  const [message, setMessage] = useState<string>("JWT signature has not been inspected.");

  const handleInspect = (): void => {
    const segments: string[] = token.split(".");

    if (segments.length !== 3) {
      setSignatureLength(null);
      setMessage("The token does not contain the expected signature segment.");

      return;
    }

    const signatureSegment: string = segments[2];

    if (signatureSegment.length === 0) {
      setSignatureLength(null);
      setMessage("The signature segment is empty.");

      return;
    }

    setSignatureLength(signatureSegment.length);
    setMessage("The signature segment exists. Its presence does not prove that the signature is valid.");
  };

  return (
    <section>
      <button type="button" onClick={handleInspect} disabled={token.length === 0}>
        Inspect Signature Segment
      </button>

      {signatureLength !== null && <p>Encoded signature length: {signatureLength}</p>}

      <p role="status">{message}</p>
    </section>
  );
};

/**
 * Demonstrates the relationship between JWT segment positions and their
 * conceptual roles.
 *
 * A compact signed JWT normally maps segment zero to the encoded header,
 * segment one to the encoded payload, and segment two to the encoded signature.
 */
export const JwtSegments: React.FC<JwtSegmentsProps> = ({ token }: JwtSegmentsProps): React.ReactElement => {
  const [segments, setSegments] = useState<string[]>([]);

  const handleSplit = (): void => {
    setSegments(token.split("."));
  };

  return (
    <section>
      <button type="button" onClick={handleSplit} disabled={token.length === 0}>
        Split JWT Into Segments
      </button>

      {segments.length > 0 && (
        <ol>
          {segments.map((segment: string, index: number): React.ReactElement => (
            <li key={`${index}-${segment.length}`}>
              <strong>
                {index === 0 ? "Header" : index === 1 ? "Payload" : index === 2 ? "Signature" : "Additional segment"}:
              </strong>{" "}
              {segment}
            </li>
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
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NSIsIm5hbWUiOiJKb2huIERvZSIsImV4cCI6NDEwMjQ0NDgwMH0.example-signature";

export const JwtStructureDemo: React.FC = (): React.ReactElement => {
  return (
    <main>
      <h1>JWT Structure</h1>

      <h2>1. Identify the Three Compact JWT Segments</h2>
      <JwtStructure token={exampleJwt} />

      <h2>2. Decode the JWT Header</h2>
      <JwtHeader token={exampleJwt} />

      <h2>3. Decode the JWT Payload</h2>
      <JwtPayload token={exampleJwt} />

      <h2>4. Inspect the JWT Signature Segment</h2>
      <JwtSignature token={exampleJwt} />

      <h2>5. Map Each JWT Segment to Its Structural Role</h2>
      <JwtSegments token={exampleJwt} />
    </main>
  );
};

export default JwtStructureDemo;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - A compact signed JWT commonly contains three Base64URL-encoded segments: header, payload, and signature.
// - The header contains token metadata such as alg, typ, and optionally kid.
// - The payload contains registered and application-specific claims.
// - Base64URL encoding does not provide confidentiality; JWT payload contents should not be treated as secret.
// - The signature protects the encoded header and payload when a verifier validates it with the expected algorithm and key.
// - Decoding a JWT in browser code does not verify its signature or establish that its claims are trustworthy.
// - Claims such as iss, sub, aud, exp, nbf, iat, and jti have standardized meanings but still require server-side validation.
// - Three segments describe a typical signed compact JWT, while encrypted JWT representations can use different structures.
// - JWT structure and JWT authentication are related but distinct: structure describes the token representation, while authentication depends on correct server-side validation.
