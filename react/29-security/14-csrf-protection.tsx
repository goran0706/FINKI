/**
 * CSRF Protection
 * ===============
 *
 * CSRF protection is the collection of server-side controls used to prevent an attacker
 * from causing a victim's browser to perform unauthorized state-changing requests.
 * Effective protection combines an explicit request-validation mechanism with secure
 * cookie configuration, safe HTTP semantics, and appropriate origin checks.
 *
 * Common mechanisms include synchronizer tokens, signed double-submit cookies, custom
 * request headers, SameSite cookies, Origin validation, and Fetch Metadata. These controls
 * address different parts of the request flow and are commonly used together.
 */

import { type FC, type ReactElement, useState } from "react";

// ---------------------------------------------------------------------
// 1. Protection starts at the server
// ---------------------------------------------------------------------

interface CsrfProtectionBoundary {
  readonly clientCanRequest: boolean;
  readonly serverMustValidate: boolean;
  readonly browserIsSecurityBoundary: boolean;
}

const csrfProtectionBoundary: CsrfProtectionBoundary = {
  clientCanRequest: true,
  serverMustValidate: true,
  browserIsSecurityBoundary: false,
};

const ServerProtectionBoundary: FC = (): ReactElement => {
  return (
    <ul>
      <li>Client can send requests: {String(csrfProtectionBoundary.clientCanRequest)}</li>
      <li>Server must validate requests: {String(csrfProtectionBoundary.serverMustValidate)}</li>
      <li>Browser is the security boundary: {String(csrfProtectionBoundary.browserIsSecurityBoundary)}</li>
    </ul>
  );
};

// React can construct requests and send CSRF tokens.
//
// React cannot enforce authorization or CSRF protection because an attacker
// does not need to use the application's React code to send a request.
//
// The server must enforce the security policy.

// ---------------------------------------------------------------------
// 2. Protect state-changing methods
// ---------------------------------------------------------------------

type HttpMethod = "GET" | "HEAD" | "OPTIONS" | "POST" | "PUT" | "PATCH" | "DELETE";

const safeMethods: readonly HttpMethod[] = ["GET", "HEAD", "OPTIONS"];

const protectedMethods: readonly HttpMethod[] = ["POST", "PUT", "PATCH", "DELETE"];

const MethodProtectionExample: FC = (): ReactElement => {
  return (
    <section>
      <p>Safe methods: {safeMethods.join(", ")}</p>
      <p>Protected methods: {protectedMethods.join(", ")}</p>
    </section>
  );
};

// State-changing endpoints should not use GET.
//
// Prefer:
//
// GET    /api/profile
// POST   /api/profile
// DELETE /api/account
//
// instead of:
//
// GET /api/delete-account
//
// Safe HTTP methods should remain safe.

// ---------------------------------------------------------------------
// 3. Synchronizer token pattern
// ---------------------------------------------------------------------

interface SynchronizerTokenPolicy {
  readonly tokenStoredServerSide: boolean;
  readonly tokenSentWithRequest: boolean;
  readonly tokenValidatedServerSide: boolean;
}

const synchronizerTokenPolicy: SynchronizerTokenPolicy = {
  tokenStoredServerSide: true,
  tokenSentWithRequest: true,
  tokenValidatedServerSide: true,
};

const SynchronizerTokenProtection: FC = (): ReactElement => {
  return (
    <ul>
      <li>Token stored server-side: {String(synchronizerTokenPolicy.tokenStoredServerSide)}</li>
      <li>Token sent with request: {String(synchronizerTokenPolicy.tokenSentWithRequest)}</li>
      <li>Token validated server-side: {String(synchronizerTokenPolicy.tokenValidatedServerSide)}</li>
    </ul>
  );
};

// Stateful applications can associate a CSRF token with the user's session.
//
// Request:
//
// session cookie
//     +
// CSRF token
//
// Server:
//
// 1. Find the authenticated session.
// 2. Obtain the expected CSRF token.
// 3. Read the submitted token.
// 4. Compare the values.
// 5. Reject the request when validation fails.

// ---------------------------------------------------------------------
// 4. Generate CSRF tokens securely
// ---------------------------------------------------------------------

const secureTokenRequirements = {
  unique: true,
  unpredictable: true,
  secret: true,
} as const;

const SecureTokenRequirements: FC = (): ReactElement => {
  return (
    <ul>
      <li>Unique: {String(secureTokenRequirements.unique)}</li>
      <li>Unpredictable: {String(secureTokenRequirements.unpredictable)}</li>
      <li>Secret: {String(secureTokenRequirements.secret)}</li>
    </ul>
  );
};

// CSRF tokens should be generated using a cryptographically secure random
// generator on the server.
//
// Do not generate security tokens with:
//
// Math.random()
//
// predictable timestamps,
// incrementing counters,
// usernames,
// email addresses,
// UUIDs generated without understanding their security properties.
//
// The server should use an appropriate cryptographic random API.

// ---------------------------------------------------------------------
// 5. Session-bound synchronizer tokens
// ---------------------------------------------------------------------

interface SessionBoundToken {
  readonly sessionId: string;
  readonly csrfToken: string;
}

const sessionBoundToken: SessionBoundToken = {
  sessionId: "server-side-session-reference",
  csrfToken: "server-generated-random-token",
};

const SessionBoundTokenExample: FC = (): ReactElement => {
  return (
    <p>
      The CSRF token is associated with the authenticated server-side session rather than being treated as an
      independent credential.
    </p>
  );
};

// Conceptually:
//
// session
// ├── user
// ├── authentication state
// └── csrf token
//
// The attacker may cause the browser to send the session cookie, but should
// not be able to provide the matching session-bound CSRF token.

// ---------------------------------------------------------------------
// 6. Per-session versus per-request tokens
// ---------------------------------------------------------------------

interface TokenLifetimePolicy {
  readonly perSession: boolean;
  readonly perRequest: boolean;
}

const tokenLifetimePolicy: TokenLifetimePolicy = {
  perSession: true,
  perRequest: false,
};

const TokenLifetimeExample: FC = (): ReactElement => {
  return <p>This example uses one CSRF token for the lifetime of the session.</p>;
};

// A CSRF token can be generated once per session or regenerated more
// frequently.
//
// Per-request tokens can reduce the useful lifetime of a stolen token, but
// aggressive rotation can create usability problems with browser history,
// multiple tabs, retries, and concurrent requests.
//
// The token lifecycle should match the application's architecture.

// ---------------------------------------------------------------------
// 7. Validate the token on every protected request
// ---------------------------------------------------------------------

interface TokenValidationResult {
  readonly supplied: boolean;
  readonly matchesSession: boolean;
  readonly accepted: boolean;
}

const tokenValidationResult: TokenValidationResult = {
  supplied: true,
  matchesSession: true,
  accepted: true,
};

const TokenValidationExample: FC = (): ReactElement => {
  return (
    <ul>
      <li>Token supplied: {String(tokenValidationResult.supplied)}</li>
      <li>Token matches session: {String(tokenValidationResult.matchesSession)}</li>
      <li>Request accepted: {String(tokenValidationResult.accepted)}</li>
    </ul>
  );
};

// A server should reject a protected request when:
//
// token is missing,
// token is malformed,
// token does not match,
// token has expired,
// token is not associated with the current session,
// token fails integrity validation.
//
// Checking only whether a token exists is not sufficient.

// ---------------------------------------------------------------------
// 8. Do not log CSRF tokens
// ---------------------------------------------------------------------

interface SecurityLog {
  readonly event: "csrf-validation-failure";
  readonly tokenIncluded: false;
}

const securityLog: SecurityLog = {
  event: "csrf-validation-failure",
  tokenIncluded: false,
};

const SecurityLoggingExample: FC = (): ReactElement => {
  return <p>CSRF validation failures can be logged without recording the token value.</p>;
};

// Never put the actual CSRF token into:
//
// application logs,
// analytics,
// error reports,
// URLs,
// query strings,
// monitoring payloads.
//
// Log the validation event and relevant request context without exposing the
// secret value.

// ---------------------------------------------------------------------
// 9. Send tokens in request bodies
// ---------------------------------------------------------------------

interface FormTokenProps {
  readonly csrfToken: string;
}

const ProfileForm = ({ csrfToken }: FormTokenProps): ReactElement => {
  return (
    <form method="post" action="/account/profile">
      <input type="hidden" name="csrfToken" value={csrfToken} />

      <label>
        Display name
        <input name="displayName" defaultValue="John Doe" />
      </label>

      <button type="submit">Save profile</button>
    </form>
  );
};

// For a traditional HTML form, the token can be submitted as a form field.
//
// The server validates the token before performing the state-changing action.

// ---------------------------------------------------------------------
// 10. Send tokens in custom headers
// ---------------------------------------------------------------------

interface HeaderTokenRequest {
  readonly method: "POST";
  readonly headers: {
    readonly "X-CSRF-Token": string;
  };
}

const headerTokenRequest: HeaderTokenRequest = {
  method: "POST",
  headers: {
    "X-CSRF-Token": "server-generated-random-token",
  },
};

const HeaderTokenExample: FC = (): ReactElement => {
  return <p>API-driven applications can send the CSRF token in a custom request header.</p>;
};

// Example:
//
// X-CSRF-Token: server-generated-random-token
//
// A cross-origin HTML form cannot arbitrarily add this custom header.
//
// The server must still validate the token.

// ---------------------------------------------------------------------
// 11. React request with a CSRF header
// ---------------------------------------------------------------------

interface SaveProfileProps {
  readonly csrfToken: string;
}

const SaveProfileButton = ({ csrfToken }: SaveProfileProps): ReactElement => {
  const saveProfile = async (): Promise<void> => {
    const response = await fetch("/api/profile", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": csrfToken,
      },
      body: JSON.stringify({
        displayName: "John Doe",
      }),
    });

    if (!response.ok) {
      throw new Error("Unable to save profile");
    }
  };

  return (
    <button
      type="button"
      onClick={() => {
        void saveProfile();
      }}
    >
      Save profile
    </button>
  );
};

// The React component does not validate the token.
//
// It only participates in the request protocol:
//
// React
//     ↓
// X-CSRF-Token
//     ↓
// server
//     ↓
// token validation

// ---------------------------------------------------------------------
// 12. Synchronizer tokens should not be stored in cookies
// ---------------------------------------------------------------------

const SynchronizerCookieRule: FC = (): ReactElement => {
  return (
    <p>
      A synchronizer token is normally delivered through trusted page data and returned through a form field or request
      header.
    </p>
  );
};

// In the synchronizer token pattern, the server keeps the expected token in
// server-side session state.
//
// The token is not placed in a cookie merely so the browser will automatically
// return it.
//
// If the application needs a cookie-based CSRF design, use a properly
// implemented double-submit cookie pattern instead.

// ---------------------------------------------------------------------
// 13. Double-submit cookie pattern
// ---------------------------------------------------------------------

interface DoubleSubmitPolicy {
  readonly csrfCookie: string;
  readonly submittedToken: string;
}

const doubleSubmitPolicy: DoubleSubmitPolicy = {
  csrfCookie: "random-csrf-token",
  submittedToken: "random-csrf-token",
};

const DoubleSubmitExample: FC = (): ReactElement => {
  return <p>The server compares a CSRF value from a cookie with a value sent through another request channel.</p>;
};

// Double-submit:
//
// CSRF cookie
//     +
// request header or form value
//
// The server compares the two values.
//
// The design must prevent an attacker from setting or injecting a matching
// value.

// ---------------------------------------------------------------------
// 14. Signed double-submit cookies
// ---------------------------------------------------------------------

interface SignedDoubleSubmitPolicy {
  readonly usesHmac: boolean;
  readonly bindsToSession: boolean;
}

const signedDoubleSubmitPolicy: SignedDoubleSubmitPolicy = {
  usesHmac: true,
  bindsToSession: true,
};

const SignedDoubleSubmitExample: FC = (): ReactElement => {
  return (
    <ul>
      <li>Uses HMAC: {String(signedDoubleSubmitPolicy.usesHmac)}</li>
      <li>Binds token to session: {String(signedDoubleSubmitPolicy.bindsToSession)}</li>
    </ul>
  );
};

// A stronger stateless construction can use an HMAC-protected token:
//
// token = session-bound data + integrity protection
//
// The server verifies the HMAC using a server-side secret.
//
// Signing a token without binding it to the authenticated session does not
// provide the same protection as a properly session-bound construction.

// ---------------------------------------------------------------------
// 15. Do not invent cryptographic primitives
// ---------------------------------------------------------------------

const CryptographyRule: FC = (): ReactElement => {
  return (
    <p>
      CSRF token integrity should use established cryptographic primitives rather than custom hashing or encryption
      schemes.
    </p>
  );
};

// Avoid custom constructions such as:
//
// token + secret
// customHash(token)
// base64(token)
//
// Base64 is encoding, not authentication.
//
// If token integrity is required, use a standard MAC construction such as
// HMAC with a securely managed server-side key.

// ---------------------------------------------------------------------
// 16. SameSite cookies
// ---------------------------------------------------------------------

type SameSite = "Strict" | "Lax" | "None";

interface SameSitePolicy {
  readonly value: SameSite;
  readonly requiresSecure: boolean;
}

const sameSitePolicies: readonly SameSitePolicy[] = [
  {
    value: "Strict",
    requiresSecure: false,
  },
  {
    value: "Lax",
    requiresSecure: false,
  },
  {
    value: "None",
    requiresSecure: true,
  },
];

const SameSiteProtectionExample: FC = (): ReactElement => {
  return (
    <ul>
      {sameSitePolicies.map((policy) => (
        <li key={policy.value}>
          SameSite={policy.value}; Secure required: {String(policy.requiresSecure)}
        </li>
      ))}
    </ul>
  );
};

// SameSite controls whether cookies are sent in cross-site contexts.
//
// SameSite=Strict
//     → strongest cross-site restriction
//
// SameSite=Lax
//     → allows limited cross-site top-level navigation behavior
//
// SameSite=None; Secure
//     → permits cross-site cookie transmission

// ---------------------------------------------------------------------
// 17. SameSite is defense in depth
// ---------------------------------------------------------------------

const SameSiteDefenseInDepth: FC = (): ReactElement => {
  return <p>SameSite should normally complement an explicit CSRF protection strategy rather than replace it.</p>;
};

// SameSite is valuable because it can prevent the browser from attaching the
// session cookie to many cross-site requests.
//
// However, applications can have:
//
// legacy browsers,
// same-site sibling subdomains,
// legitimate cross-site flows,
// state-changing GET endpoints,
// client-side CSRF,
// integration requirements.
//
// An explicit request-validation mechanism remains important.

// ---------------------------------------------------------------------
// 18. Secure session cookie
// ---------------------------------------------------------------------

interface SessionCookiePolicy {
  readonly name: "__Host-session";
  readonly secure: true;
  readonly httpOnly: true;
  readonly sameSite: "Lax" | "Strict";
  readonly path: "/";
}

const sessionCookiePolicy: SessionCookiePolicy = {
  name: "__Host-session",
  secure: true,
  httpOnly: true,
  sameSite: "Lax",
  path: "/",
};

const SecureSessionCookieExample: FC = (): ReactElement => {
  return (
    <ul>
      <li>Name: {sessionCookiePolicy.name}</li>
      <li>Secure: {String(sessionCookiePolicy.secure)}</li>
      <li>HttpOnly: {String(sessionCookiePolicy.httpOnly)}</li>
      <li>SameSite: {sessionCookiePolicy.sameSite}</li>
      <li>Path: {sessionCookiePolicy.path}</li>
    </ul>
  );
};

// A session cookie can use:
//
// Set-Cookie:
// __Host-session=<value>; Secure; HttpOnly; SameSite=Lax; Path=/
//
// The __Host- prefix requires Secure, Path=/, and no Domain attribute.
//
// This reduces cookie scope and helps prevent certain cookie-injection and
// session-fixation scenarios.

// ---------------------------------------------------------------------
// 19. HttpOnly does not prevent CSRF
// ---------------------------------------------------------------------

const HttpOnlyLimitationExample: FC = (): ReactElement => {
  return (
    <p>
      HttpOnly prevents JavaScript from reading the session cookie, but the browser can still send that cookie with
      applicable requests.
    </p>
  );
};

// HttpOnly:
//
// protects cookie confidentiality from document.cookie
//
// but does not:
//
// prevent an attacker from causing a browser request,
// prevent authenticated requests,
// replace authorization,
// replace CSRF validation.
//
// HttpOnly and CSRF protection solve different problems.

// ---------------------------------------------------------------------
// 20. Secure does not prevent CSRF
// ---------------------------------------------------------------------

const SecureLimitationExample: FC = (): ReactElement => {
  return (
    <p>
      Secure protects cookie transmission over HTTPS but does not by itself determine whether a request is legitimate.
    </p>
  );
};

// Secure:
//
// HTTPS transport protection
//
// CSRF token:
//
// request-context validation
//
// These are complementary controls.

// ---------------------------------------------------------------------
// 21. Origin validation
// ---------------------------------------------------------------------

interface OriginPolicy {
  readonly expectedOrigin: string;
  readonly rejectUnexpectedOrigin: boolean;
}

const originPolicy: OriginPolicy = {
  expectedOrigin: "https://example.com",
  rejectUnexpectedOrigin: true,
};

const OriginValidationExample: FC = (): ReactElement => {
  return (
    <p>State-changing requests can be rejected when their Origin does not match the expected application origin.</p>
  );
};

// Example:
//
// Origin: https://example.com
//
// expected:
//
// https://example.com
//
// The server should compare the complete origin:
//
// scheme + host + port
//
// Do not use substring matching.

// ---------------------------------------------------------------------
// 22. Unsafe origin validation
// ---------------------------------------------------------------------

const unsafeOriginValidationExample = {
  rejected: false,
  reason: "Substring matching is not an origin validation strategy",
};

const UnsafeOriginValidationExample: FC = (): ReactElement => {
  return <p>Do not validate origins with substring checks such as origin.includes("example.com").</p>;
};

// This is unsafe:
//
// https://example.com.attacker.example
//
// It contains:
//
// example.com
//
// but it is not:
//
// https://example.com

// ---------------------------------------------------------------------
// 23. Referer validation
// ---------------------------------------------------------------------

interface RefererPolicy {
  readonly primarySignal: "Origin";
  readonly fallbackSignal: "Referer";
}

const refererPolicy: RefererPolicy = {
  primarySignal: "Origin",
  fallbackSignal: "Referer",
};

const RefererValidationExample: FC = (): ReactElement => {
  return <p>Referer can provide a fallback source of origin information when Origin is unavailable.</p>;
};

// A server can validate:
//
// Origin
//
// and, where appropriate:
//
// Referer
//
// against an exact trusted origin.
//
// Applications should explicitly decide how requests with neither header are
// handled.

// ---------------------------------------------------------------------
// 24. Fetch Metadata
// ---------------------------------------------------------------------

type FetchSite = "same-origin" | "same-site" | "cross-site" | "none";

interface FetchMetadataPolicy {
  readonly site: FetchSite;
  readonly stateChanging: boolean;
}

const fetchMetadataPolicy: FetchMetadataPolicy = {
  site: "same-origin",
  stateChanging: true,
};

const FetchMetadataExample: FC = (): ReactElement => {
  return <p>Sec-Fetch-Site provides request-context information that can be used as an additional CSRF defense.</p>;
};

// Important values:
//
// same-origin
// same-site
// cross-site
// none
//
// A common policy is to reject cross-site state-changing requests:
//
// if Sec-Fetch-Site === "cross-site"
//     and method is unsafe
//         → reject

// ---------------------------------------------------------------------
// 25. Handle missing Fetch Metadata
// ---------------------------------------------------------------------

interface FetchMetadataFallback {
  readonly headersCanBeMissing: boolean;
  readonly fallbackRequired: boolean;
}

const fetchMetadataFallback: FetchMetadataFallback = {
  headersCanBeMissing: true,
  fallbackRequired: true,
};

const FetchMetadataFallbackExample: FC = (): ReactElement => {
  return (
    <ul>
      <li>Headers can be missing: {String(fetchMetadataFallback.headersCanBeMissing)}</li>
      <li>Fallback required: {String(fetchMetadataFallback.fallbackRequired)}</li>
    </ul>
  );
};

// Fetch Metadata should not be the only security mechanism when compatibility
// with clients that do not provide the headers is required.
//
// A deployment can combine:
//
// Fetch Metadata
//     +
// Origin validation
//     +
// CSRF token
//     +
// SameSite cookie

// ---------------------------------------------------------------------
// 26. Same-origin and same-site are different
// ---------------------------------------------------------------------

interface SiteRelationship {
  readonly sameOrigin: boolean;
  readonly sameSite: boolean;
}

const siblingSubdomainRelationship: SiteRelationship = {
  sameOrigin: false,
  sameSite: true,
};

const SiteRelationshipExample: FC = (): ReactElement => {
  return <p>Two sibling subdomains can be same-site while still being different origins.</p>;
};

// Example:
//
// https://app.example.com
//
// https://api.example.com
//
// These are different origins because their hosts differ.
//
// They can nevertheless be same-site.
//
// This matters when deciding whether a same-site request should automatically
// be trusted.

// ---------------------------------------------------------------------
// 27. Trust boundaries between subdomains
// ---------------------------------------------------------------------

const SubdomainTrustExample: FC = (): ReactElement => {
  return <p>Same-site trust should be evaluated against the security of every relevant sibling subdomain.</p>;
};

// If:
//
// app.example.com
//
// trusts:
//
// uploads.example.com
//
// but the second host is compromised, same-site protections may not provide
// the isolation expected between those hosts.
//
// Avoid unnecessarily broad cookie Domain attributes.

// ---------------------------------------------------------------------
// 28. Custom headers and cross-origin requests
// ---------------------------------------------------------------------

interface CustomHeaderProtection {
  readonly headerName: "X-CSRF-Token";
  readonly browserFormCanSetHeader: false;
}

const customHeaderProtection: CustomHeaderProtection = {
  headerName: "X-CSRF-Token",
  browserFormCanSetHeader: false,
};

const CustomHeaderProtectionExample: FC = (): ReactElement => {
  return (
    <p>
      A custom CSRF header is useful for API requests because ordinary cross-origin HTML forms cannot arbitrarily set
      it.
    </p>
  );
};

// Example:
//
// X-CSRF-Token: random-token
//
// The server should require the header for protected API operations.
//
// The header must be validated server-side.

// ---------------------------------------------------------------------
// 29. CORS is not CSRF protection
// ---------------------------------------------------------------------

interface CorsPolicy {
  readonly allowedOrigins: readonly string[];
  readonly credentials: boolean;
}

const corsPolicy: CorsPolicy = {
  allowedOrigins: ["https://example.com"],
  credentials: true,
};

const CorsExample: FC = (): ReactElement => {
  return (
    <ul>
      <li>Allowed origin: {corsPolicy.allowedOrigins.join(", ")}</li>
      <li>Credentials enabled: {String(corsPolicy.credentials)}</li>
    </ul>
  );
};

// CORS controls cross-origin browser access to responses and certain
// cross-origin requests.
//
// CSRF protection determines whether a state-changing request should be
// accepted.
//
// A server should not treat CORS configuration as its only CSRF defense.

// ---------------------------------------------------------------------
// 30. Do not allow arbitrary credentialed origins
// ---------------------------------------------------------------------

const credentialedCorsRule: FC = (): ReactElement => {
  return <p>Credentialed cross-origin access should use an explicit allowlist of trusted origins.</p>;
};

// Avoid policies equivalent to:
//
// allow every origin
//     +
// allow credentials
//
// Cross-origin integrations should be intentionally configured.

// ---------------------------------------------------------------------
// 31. Content-Type restrictions
// ---------------------------------------------------------------------

interface ContentTypePolicy {
  readonly allowed: readonly string[];
  readonly stateChangingEndpoint: boolean;
}

const contentTypePolicy: ContentTypePolicy = {
  allowed: ["application/json"],
  stateChangingEndpoint: true,
};

const ContentTypeExample: FC = (): ReactElement => {
  return (
    <p>
      Restricting content types can reduce some cross-origin request possibilities but should not replace CSRF
      validation.
    </p>
  );
};

// For an API endpoint:
//
// Content-Type: application/json
//
// can make a basic HTML form unable to directly submit the expected payload.
//
// However, content-type restrictions are only one layer of protection.

// ---------------------------------------------------------------------
// 32. Client-side CSRF
// ---------------------------------------------------------------------

interface ClientSideRequest {
  readonly endpoint: string;
  readonly trusted: boolean;
}

const clientSideRequest: ClientSideRequest = {
  endpoint: "/api/profile",
  trusted: true,
};

const ClientSideCsrfExample: FC = (): ReactElement => {
  return (
    <p>
      Client-side CSRF occurs when attacker-controlled input influences a request generated by the application's own
      JavaScript.
    </p>
  );
};

// Example of a dangerous design:
//
// const endpoint = window.location.hash.slice(1);
// fetch(endpoint, {method: "POST"});
//
// The application's JavaScript is now using attacker-controlled data to choose
// a state-changing request target.

// ---------------------------------------------------------------------
// 33. Use allowlists for request targets
// ---------------------------------------------------------------------

const allowedEndpoints = {
  updateProfile: "/api/profile",
  changePassword: "/api/password",
  deleteAccount: "/api/account",
} as const;

type AllowedEndpoint = (typeof allowedEndpoints)[keyof typeof allowedEndpoints];

const getAllowedEndpoint = (action: keyof typeof allowedEndpoints): AllowedEndpoint => {
  return allowedEndpoints[action];
};

const AllowedEndpointExample: FC = (): ReactElement => {
  return (
    <ul>
      <li>{getAllowedEndpoint("updateProfile")}</li>
      <li>{getAllowedEndpoint("changePassword")}</li>
      <li>{getAllowedEndpoint("deleteAccount")}</li>
    </ul>
  );
};

// Prefer application-controlled request targets:
//
// allowedEndpoints[action]
//
// rather than:
//
// fetch(userControlledUrl)
//
// TypeScript can help model the set of allowed values, but runtime input still
// requires validation.

// ---------------------------------------------------------------------
// 34. Protect login requests
// ---------------------------------------------------------------------

const LoginCsrfExample: FC = (): ReactElement => {
  return (
    <p>
      Login endpoints can also require CSRF protection when their behavior can be influenced through cross-site
      requests.
    </p>
  );
};

// CSRF is not limited to:
//
// changing an existing profile,
// deleting an account,
// transferring money.
//
// Authentication-related endpoints can also have CSRF implications, including
// login CSRF in applications where an attacker can cause a victim to become
// authenticated as an unintended account.

// ---------------------------------------------------------------------
// 35. Protect password and security changes
// ---------------------------------------------------------------------

const SensitiveEndpointExample: FC = (): ReactElement => {
  return (
    <ul>
      <li>Change password</li>
      <li>Change email address</li>
      <li>Disable MFA</li>
      <li>Delete account</li>
    </ul>
  );
};

// These operations should receive particularly strong protection:
//
// CSRF validation,
// authorization,
// input validation,
// audit logging,
// and, where appropriate, reauthentication or MFA.

// ---------------------------------------------------------------------
// 36. User interaction as defense in depth
// ---------------------------------------------------------------------

const UserInteractionProtection: FC = (): ReactElement => {
  return (
    <p>
      Highly sensitive operations can require explicit confirmation, reauthentication, or another user-presence signal.
    </p>
  );
};

// User interaction can reduce the impact of a forged request.
//
// It does not replace:
//
// authentication,
// authorization,
// CSRF validation.
//
// It is an additional control for particularly sensitive actions.

// ---------------------------------------------------------------------
// 37. CSRF failure response
// ---------------------------------------------------------------------

type CsrfFailureCode = "missing-token" | "invalid-token" | "origin-rejected" | "cross-site-request-rejected";

const csrfFailureCodes: readonly CsrfFailureCode[] = [
  "missing-token",
  "invalid-token",
  "origin-rejected",
  "cross-site-request-rejected",
];

const CsrfFailureExample: FC = (): ReactElement => {
  return (
    <ul>
      {csrfFailureCodes.map((code) => (
        <li key={code}>{code}</li>
      ))}
    </ul>
  );
};

// A protected endpoint should reject invalid requests rather than silently
// performing the operation.
//
// The exact status code depends on the application's API conventions.
//
// The response should not reveal sensitive implementation details such as
// expected token values.

// ---------------------------------------------------------------------
// 38. Do not expose token values in errors
// ---------------------------------------------------------------------

const CsrfErrorMessageExample: FC = (): ReactElement => {
  return (
    <p>
      Use a generic CSRF validation error rather than returning the expected token or other sensitive server-side
      details.
    </p>
  );
};

// Avoid:
//
// expected token: abc123
// received token: xyz789
//
// Prefer:
//
// Request validation failed.
//
// Detailed security information belongs in controlled server-side diagnostics.

// ---------------------------------------------------------------------
// 39. CSRF token in HTML
// ---------------------------------------------------------------------

interface TokenizedDocumentProps {
  readonly csrfToken: string;
}

const TokenizedDocument = ({ csrfToken }: TokenizedDocumentProps): ReactElement => {
  return <meta name="csrf-token" content={csrfToken} />;
};

// An application can expose a CSRF token to trusted same-origin client code
// through server-rendered HTML.
//
// The client can then read the token and place it in a request header.
//
// The token should not be exposed through a URL.

// ---------------------------------------------------------------------
// 40. CSRF token in JSON
// ---------------------------------------------------------------------

interface CsrfResponse {
  readonly csrfToken: string;
}

const csrfResponse: CsrfResponse = {
  csrfToken: "server-generated-random-token",
};

const CsrfJsonExample: FC = (): ReactElement => {
  return (
    <p>
      An authenticated endpoint can return a CSRF token in a JSON response when the application architecture requires
      it.
    </p>
  );
};

// Example response:
//
// {
//     "csrfToken": "server-generated-random-token"
// }
//
// The application can then use the token in a protected request header.
//
// The endpoint returning the token must itself be designed so that it does not
// disclose another user's token.

// ---------------------------------------------------------------------
// 41. Do not place tokens in URLs
// ---------------------------------------------------------------------

const TokenUrlRule: FC = (): ReactElement => {
  return (
    <p>CSRF tokens should not be placed in query strings or URL fragments when a request body or header can be used.</p>
  );
};

// URLs can be copied, logged, stored in browser history, or exposed through
// other application infrastructure.
//
// Prefer:
//
// X-CSRF-Token: ...
//
// or:
//
// csrfToken in a POST body
//
// rather than:
//
// /api/profile?csrfToken=...

// ---------------------------------------------------------------------
// 42. Protect cached pages containing tokens
// ---------------------------------------------------------------------

interface CachePolicy {
  readonly userSpecificToken: boolean;
  readonly sharedCacheAllowed: boolean;
}

const cachePolicy: CachePolicy = {
  userSpecificToken: true,
  sharedCacheAllowed: false,
};

const CacheProtectionExample: FC = (): ReactElement => {
  return <p>Responses containing user-specific CSRF tokens require appropriate cache controls.</p>;
};

// A shared cache must not serve:
//
// User A's CSRF token
//
// to:
//
// User B.
//
// Server-side rendering and caching rules must account for security-sensitive
// user-specific content.

// ---------------------------------------------------------------------
// 43. Protect the session cookie
// ---------------------------------------------------------------------

const SessionCookieProtection: FC = (): ReactElement => {
  return (
    <pre>
      {`Set-Cookie:
__Host-session=<random-value>;
Secure;
HttpOnly;
SameSite=Lax;
Path=/`}
    </pre>
  );
};

// This is a secure baseline for a host-bound session cookie:
//
// Secure
//     → HTTPS transport
//
// HttpOnly
//     → blocks document.cookie access
//
// SameSite=Lax
//     → reduces cross-site cookie transmission
//
// __Host-
//     → host-only cookie with Path=/ and no Domain

// ---------------------------------------------------------------------
// 44. Avoid broad cookie domains
// ---------------------------------------------------------------------

interface CookieDomainPolicy {
  readonly domainAttribute: string | null;
  readonly sharesWithSubdomains: boolean;
}

const cookieDomainPolicy: CookieDomainPolicy = {
  domainAttribute: null,
  sharesWithSubdomains: false,
};

const CookieDomainExample: FC = (): ReactElement => {
  return <p>Omitting Domain keeps the session cookie host-only instead of intentionally sharing it with subdomains.</p>;
};

// Avoid unnecessarily broad:
//
// Domain=example.com
//
// when the application only needs:
//
// app.example.com
//
// Every subdomain included in the cookie's scope becomes relevant to the
// security boundary.

// ---------------------------------------------------------------------
// 45. CSRF protection and authorization
// ---------------------------------------------------------------------

interface ProtectedOperation {
  readonly authenticated: boolean;
  readonly authorized: boolean;
  readonly csrfValid: boolean;
}

const protectedOperation: ProtectedOperation = {
  authenticated: true,
  authorized: true,
  csrfValid: true,
};

const ProtectedOperationExample: FC = (): ReactElement => {
  return (
    <ul>
      <li>Authenticated: {String(protectedOperation.authenticated)}</li>
      <li>Authorized: {String(protectedOperation.authorized)}</li>
      <li>CSRF valid: {String(protectedOperation.csrfValid)}</li>
    </ul>
  );
};

// CSRF validation does not establish authorization.
//
// The server should independently determine:
//
// who is making the request,
// whether that principal is authenticated,
// whether the principal may perform the action,
// whether the request satisfies CSRF protection,
// whether the input is valid.

// ---------------------------------------------------------------------
// 46. Protect server actions and mutations
// ---------------------------------------------------------------------

interface MutationRequest {
  readonly method: "POST";
  readonly path: "/api/profile";
  readonly csrfProtected: true;
}

const mutationRequest: MutationRequest = {
  method: "POST",
  path: "/api/profile",
  csrfProtected: true,
};

const MutationProtectionExample: FC = (): ReactElement => {
  return <p>Every browser-accessible state-changing mutation should pass through the application's CSRF policy.</p>;
};

// The implementation mechanism can differ between:
//
// traditional forms,
// JSON APIs,
// server-rendered applications,
// client-rendered applications.
//
// The security property must remain the same: an attacker-controlled context
// must not be able to produce an accepted state-changing request.

// ---------------------------------------------------------------------
// 47. Testing CSRF protection
// ---------------------------------------------------------------------

interface CsrfTestCase {
  readonly name: string;
  readonly expected: "allow" | "reject";
}

const csrfTestCases: readonly CsrfTestCase[] = [
  {
    name: "Valid session and valid CSRF token",
    expected: "allow",
  },
  {
    name: "Missing CSRF token",
    expected: "reject",
  },
  {
    name: "Invalid CSRF token",
    expected: "reject",
  },
  {
    name: "Unexpected Origin",
    expected: "reject",
  },
  {
    name: "Cross-site unsafe request",
    expected: "reject",
  },
];

const CsrfTestingExample: FC = (): ReactElement => {
  return (
    <ul>
      {csrfTestCases.map((testCase) => (
        <li key={testCase.name}>
          {testCase.name}: {testCase.expected}
        </li>
      ))}
    </ul>
  );
};

// Security tests should cover:
//
// valid requests,
// missing tokens,
// incorrect tokens,
// expired tokens,
// wrong-session tokens,
// unexpected Origin,
// cross-site Fetch Metadata,
// missing Fetch Metadata,
// legitimate same-origin requests,
// legitimate same-site integrations,
// concurrent requests,
// logout/session expiration.
//
// The exact test matrix depends on the selected protection strategy.

// ---------------------------------------------------------------------
// 48. Test token binding
// ---------------------------------------------------------------------

interface TokenBindingTest {
  readonly session: string;
  readonly tokenSession: string;
  readonly accepted: boolean;
}

const tokenBindingTests: readonly TokenBindingTest[] = [
  {
    session: "session-a",
    tokenSession: "session-a",
    accepted: true,
  },
  {
    session: "session-a",
    tokenSession: "session-b",
    accepted: false,
  },
];

const TokenBindingTestExample: FC = (): ReactElement => {
  return (
    <ul>
      {tokenBindingTests.map((testCase) => (
        <li key={`${testCase.session}-${testCase.tokenSession}`}>
          {testCase.session} + {testCase.tokenSession}: {testCase.accepted ? "accepted" : "rejected"}
        </li>
      ))}
    </ul>
  );
};

// A session-bound CSRF implementation should reject:
//
// session A
// +
// token belonging to session B
//
// This test verifies that the token cannot be reused independently of its
// intended security context.

// ---------------------------------------------------------------------
// 49. Test cross-site requests
// ---------------------------------------------------------------------

const CrossSiteTestExample: FC = (): ReactElement => {
  return (
    <ul>
      <li>POST with cross-site Origin → reject</li>
      <li>POST with invalid CSRF token → reject</li>
      <li>POST with valid same-origin token → allow</li>
      <li>GET that only reads data → allow</li>
      <li>GET that changes state → redesign endpoint</li>
    </ul>
  );
};

// CSRF testing should verify behavior at the HTTP boundary.
//
// Do not test only the React component.
//
// The security property exists at the server endpoint.

// ---------------------------------------------------------------------
// 50. Production protection strategy
// ---------------------------------------------------------------------

interface ProductionCsrfStrategy {
  readonly tokenProtection: boolean;
  readonly sameSiteCookie: boolean;
  readonly originValidation: boolean;
  readonly fetchMetadata: boolean;
  readonly safeMethods: boolean;
}

const productionCsrfStrategy: ProductionCsrfStrategy = {
  tokenProtection: true,
  sameSiteCookie: true,
  originValidation: true,
  fetchMetadata: true,
  safeMethods: true,
};

const ProductionStrategyExample: FC = (): ReactElement => {
  return (
    <ul>
      <li>Explicit CSRF token: {String(productionCsrfStrategy.tokenProtection)}</li>
      <li>SameSite cookie: {String(productionCsrfStrategy.sameSiteCookie)}</li>
      <li>Origin validation: {String(productionCsrfStrategy.originValidation)}</li>
      <li>Fetch Metadata: {String(productionCsrfStrategy.fetchMetadata)}</li>
      <li>Safe HTTP semantics: {String(productionCsrfStrategy.safeMethods)}</li>
    </ul>
  );
};

// A defense-in-depth strategy can combine:
//
// explicit CSRF token
//     +
// SameSite cookie
//     +
// Origin validation
//     +
// Fetch Metadata
//     +
// safe HTTP methods
//
// Not every application needs every mechanism in exactly this form, but the
// controls should be selected deliberately based on the application's
// architecture and threat model.

// ---------------------------------------------------------------------
// 51. Integrated protected profile editor
// ---------------------------------------------------------------------

interface Profile {
  readonly displayName: string;
}

interface ProtectedProfileEditorProps {
  readonly csrfToken: string;
  readonly profile: Profile;
}

const ProtectedProfileEditor = ({ csrfToken, profile }: ProtectedProfileEditorProps): ReactElement => {
  const [displayName, setDisplayName] = useState(profile.displayName);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  const saveProfile = async (): Promise<void> => {
    setStatus("saving");

    try {
      const response = await fetch("/api/profile", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": csrfToken,
        },
        body: JSON.stringify({
          displayName,
        }),
      });

      if (!response.ok) {
        throw new Error("Unable to save profile");
      }

      setStatus("saved");
    } catch {
      setStatus("error");
    }
  };

  return (
    <section>
      <h2>Profile</h2>

      <label>
        Display name
        <input
          value={displayName}
          onChange={(event) => {
            setDisplayName(event.target.value);
          }}
        />
      </label>

      <button
        type="button"
        onClick={() => {
          void saveProfile();
        }}
        disabled={status === "saving"}
      >
        {status === "saving" ? "Saving..." : "Save profile"}
      </button>

      <p role="status">
        {status === "idle" && "Ready"}
        {status === "saving" && "Saving profile..."}
        {status === "saved" && "Profile saved"}
        {status === "error" && "Unable to save profile"}
      </p>
    </section>
  );
};

const CsrfProtectionDemo: FC = (): ReactElement => {
  return (
    <ProtectedProfileEditor
      csrfToken="server-generated-random-token"
      profile={{
        displayName: "John Doe",
      }}
    />
  );
};

export default CsrfProtectionDemo;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - CSRF protection is enforced by the server, not by React.
// - State-changing operations should use POST, PUT, PATCH, or DELETE rather than GET.
// - The synchronizer token pattern associates a server-generated CSRF token with the user's session.
// - Synchronizer tokens should be unique, secret, and unpredictable.
// - The server must validate the submitted token instead of merely checking whether one exists.
// - Per-session and per-request token lifetimes are both possible; per-request rotation can introduce usability problems.
// - CSRF tokens should never be logged or unnecessarily exposed through URLs.
// - Traditional forms can submit CSRF tokens as hidden fields.
// - API-driven applications can submit CSRF tokens through custom request headers.
// - A custom request header is useful because ordinary cross-origin HTML forms cannot arbitrarily set it.
// - In the synchronizer token pattern, the expected token is normally maintained in server-side security state rather than automatically supplied by a cookie.
// - The double-submit cookie pattern compares a CSRF value from a cookie with a value supplied through another request channel.
// - Signed double-submit cookies should bind the token to session-specific security context.
// - HMAC provides standard integrity protection; custom cryptographic constructions should be avoided.
// - SameSite=Strict strongly restricts cross-site cookie transmission.
// - SameSite=Lax provides useful CSRF defense while allowing certain cross-site top-level navigations.
// - SameSite=None permits cross-site cookie transmission and requires Secure.
// - SameSite is defense in depth and should not automatically be treated as a complete CSRF strategy.
// - HttpOnly prevents JavaScript from reading a cookie but does not prevent the browser from sending that cookie with applicable requests.
// - Secure protects cookie transmission over HTTPS but does not validate whether a request is legitimate.
// - Origin validation can reject state-changing requests whose Origin does not match the expected application origin.
// - Origin validation should compare the complete scheme, host, and port rather than using substring matching.
// - Referer can provide a fallback source of origin information when appropriate.
// - Fetch Metadata, especially Sec-Fetch-Site, can provide additional information for rejecting obvious cross-site state-changing requests.
// - Fetch Metadata policies should define behavior for missing headers and legitimate same-site integrations.
// - same-origin and same-site are different security concepts.
// - Broad cookie Domain attributes can expand the security boundary to additional subdomains.
// - CORS controls cross-origin browser access and does not replace CSRF validation.
// - Credentialed cross-origin access should use an explicit allowlist of trusted origins.
// - Content-Type restrictions can reduce some cross-origin request possibilities but do not replace CSRF protection.
// - Client-side CSRF can occur when attacker-controlled input determines the target of a request generated by trusted application JavaScript.
// - Sensitive request targets should be selected from trusted application logic or validated allowlists.
// - Authentication and authorization remain independent server-side requirements.
// - Highly sensitive operations can add reauthentication, MFA, or explicit user interaction as defense in depth.
// - CSRF tokens should not be exposed in URLs because URLs can appear in browser history, logs, analytics, and other infrastructure.
// - Responses containing user-specific CSRF tokens require appropriate cache controls.
// - Session cookies should use appropriate Secure, HttpOnly, SameSite, and host-scoping protections.
// - The __Host- cookie prefix requires Secure, Path=/, and no Domain attribute.
// - CSRF protection should be tested at the HTTP/server boundary, not only through React component tests.
// - A robust CSRF strategy commonly combines explicit request validation with secure cookie configuration and additional origin or Fetch Metadata checks.
