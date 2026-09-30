/**
 * Cross-Site Request Forgery (CSRF)
 * =================================
 *
 * Cross-Site Request Forgery (CSRF) is an attack in which an attacker causes a user's
 * browser to send an unwanted request to a trusted application where the user is already
 * authenticated. Cookie-based authentication is particularly relevant because browsers
 * can attach applicable cookies automatically to requests.
 *
 * CSRF defenses verify that a state-changing request originated from an expected context.
 * Common defenses include CSRF tokens, SameSite cookies, Origin validation, and Fetch Metadata.
 */

import { type FC, type ReactElement, useState } from "react";

// ---------------------------------------------------------------------
// 1. What is CSRF?
// ---------------------------------------------------------------------

// CSRF abuses the browser's existing authenticated state.
//
// A typical flow is:
//
// 1. The user signs in to example.com.
// 2. The browser stores the user's session cookie.
// 3. The user visits an attacker-controlled site.
// 4. The attacker causes the browser to send a request to example.com.
// 5. The browser may automatically attach the session cookie.
// 6. The server receives an authenticated request.
//
// The critical problem is that the server may have no way to distinguish the
// forged request from a legitimate request unless it validates additional
// request context.

// ---------------------------------------------------------------------
// 2. Why cookie authentication matters
// ---------------------------------------------------------------------

interface SessionCookiePolicy {
  readonly authenticationMethod: "cookie";
  readonly browserAttachesCredential: boolean;
}

const sessionCookiePolicy: SessionCookiePolicy = {
  authenticationMethod: "cookie",
  browserAttachesCredential: true,
};

const CookieAuthenticationExample: FC = (): ReactElement => {
  return <p>Cookie authentication: the browser can automatically attach an applicable session cookie.</p>;
};

// Consider:
//
// POST /api/profile/email
// Cookie: __Host-session=...
//
// The application receives the session cookie without the React component
// explicitly reading or attaching it.
//
// This automatic behavior is useful for authentication but creates a CSRF
// consideration for state-changing requests.

// ---------------------------------------------------------------------
// 3. CSRF requires an authenticated target
// ---------------------------------------------------------------------

interface CsrfAttackPrerequisites {
  readonly victimAuthenticated: boolean;
  readonly browserHasCredential: boolean;
  readonly stateChangingOperation: boolean;
}

const csrfAttackPrerequisites: CsrfAttackPrerequisites = {
  victimAuthenticated: true,
  browserHasCredential: true,
  stateChangingOperation: true,
};

const CsrfPrerequisitesExample: FC = (): ReactElement => {
  const { victimAuthenticated, browserHasCredential, stateChangingOperation } = csrfAttackPrerequisites;

  return (
    <ul>
      <li>Victim authenticated: {String(victimAuthenticated)}</li>
      <li>Browser has credential: {String(browserHasCredential)}</li>
      <li>State-changing operation: {String(stateChangingOperation)}</li>
    </ul>
  );
};

// CSRF is not simply "another site can send a request."
//
// The attack matters when the target application relies on browser-managed
// credentials or another mechanism that causes the forged request to carry
// the victim's authority.

// ---------------------------------------------------------------------
// 4. CSRF versus XSS
// ---------------------------------------------------------------------

interface AttackComparison {
  readonly csrf: string;
  readonly xss: string;
}

const attackComparison: AttackComparison = {
  csrf: "Abuses authenticated requests from another context",
  xss: "Executes attacker-controlled JavaScript in the trusted origin",
};

const CsrfVsXssExample: FC = (): ReactElement => {
  return (
    <ul>
      <li>CSRF: {attackComparison.csrf}</li>
      <li>XSS: {attackComparison.xss}</li>
    </ul>
  );
};

// CSRF and XSS are different vulnerabilities.
//
// CSRF:
//
// attacker site
//     ↓
// victim browser
//     ↓
// authenticated target request
//
// XSS:
//
// attacker-controlled input
//     ↓
// trusted application
//     ↓
// JavaScript execution
//
// A strong XSS defense does not automatically provide complete CSRF protection,
// and CSRF protection does not prevent XSS.

// ---------------------------------------------------------------------
// 5. CSRF affects state-changing operations
// ---------------------------------------------------------------------

type HttpMethod = "GET" | "HEAD" | "OPTIONS" | "POST" | "PUT" | "PATCH" | "DELETE";

const safeMethods: readonly HttpMethod[] = ["GET", "HEAD", "OPTIONS"];

const stateChangingMethods: readonly HttpMethod[] = ["POST", "PUT", "PATCH", "DELETE"];

const MethodClassificationExample: FC = (): ReactElement => {
  return (
    <section>
      <p>Safe methods: {safeMethods.join(", ")}</p>
      <p>State-changing methods: {stateChangingMethods.join(", ")}</p>
    </section>
  );
};

// State-changing operations should use methods such as:
//
// POST
// PUT
// PATCH
// DELETE
//
// GET, HEAD, and OPTIONS should not be used to perform state-changing
// operations.
//
// A GET request that changes account state can remain vulnerable to CSRF even
// when SameSite=Lax is being used.

// ---------------------------------------------------------------------
// 6. Do not change state with GET
// ---------------------------------------------------------------------

interface Endpoint {
  readonly method: HttpMethod;
  readonly path: string;
  readonly changesState: boolean;
}

const endpointExamples: readonly Endpoint[] = [
  {
    method: "GET",
    path: "/api/profile",
    changesState: false,
  },
  {
    method: "POST",
    path: "/api/profile/email",
    changesState: true,
  },
];

const StateChangingEndpointExample: FC = (): ReactElement => {
  return (
    <ul>
      {endpointExamples.map((endpoint) => (
        <li key={`${endpoint.method}-${endpoint.path}`}>
          {endpoint.method} {endpoint.path}: {endpoint.changesState ? "changes state" : "read-only"}
        </li>
      ))}
    </ul>
  );
};

// Prefer:
//
// GET /api/profile
//
// for reading data and:
//
// POST /api/profile/email
//
// for changing data.
//
// Avoid:
//
// GET /api/delete-account
//
// because a cross-site navigation could trigger the operation.

// ---------------------------------------------------------------------
// 7. The basic attack model
// ---------------------------------------------------------------------

const CsrfAttackFlow: FC = (): ReactElement => {
  return (
    <ol>
      <li>The user is authenticated to the target application.</li>
      <li>The user visits an attacker-controlled page.</li>
      <li>The attacker causes a request to the target application.</li>
      <li>The browser attaches applicable authentication credentials.</li>
      <li>The server processes the request if no CSRF defense rejects it.</li>
    </ol>
  );
};

// The attacker generally does not need to read the target application's
// response for a state-changing CSRF attack.
//
// The attacker's goal can simply be to cause the target application to perform
// an action using the victim's authority.

// ---------------------------------------------------------------------
// 8. CSRF tokens
// ---------------------------------------------------------------------

interface CsrfToken {
  readonly name: string;
  readonly value: string;
}

const csrfToken: CsrfToken = {
  name: "csrfToken",
  value: "random-server-generated-value",
};

const CsrfTokenExample: FC = (): ReactElement => {
  return <p>CSRF token: {csrfToken.name}</p>;
};

// A CSRF token is an additional value that the attacker cannot successfully
// provide when submitting a forged request.
//
// The server can require:
//
// session cookie
//     +
// valid CSRF token
//
// A cross-site attacker may cause the browser to send the session cookie, but
// should not be able to obtain the valid CSRF token.

// ---------------------------------------------------------------------
// 9. Synchronizer token pattern
// ---------------------------------------------------------------------

interface SynchronizerTokenFlow {
  readonly serverGeneratesToken: boolean;
  readonly serverAssociatesTokenWithSession: boolean;
  readonly requestMustContainToken: boolean;
}

const synchronizerTokenFlow: SynchronizerTokenFlow = {
  serverGeneratesToken: true,
  serverAssociatesTokenWithSession: true,
  requestMustContainToken: true,
};

const SynchronizerTokenExample: FC = (): ReactElement => {
  return (
    <ul>
      <li>Server generates token: {String(synchronizerTokenFlow.serverGeneratesToken)}</li>
      <li>Token associated with session: {String(synchronizerTokenFlow.serverAssociatesTokenWithSession)}</li>
      <li>Request must contain token: {String(synchronizerTokenFlow.requestMustContainToken)}</li>
    </ul>
  );
};

// In the synchronizer token pattern:
//
// 1. The server generates a CSRF token.
// 2. The token is associated with the user's session.
// 3. The application places the token in a form or otherwise exposes it to
//    trusted client code.
// 4. The client sends the token with state-changing requests.
// 5. The server validates the token against the session.
//
// The attacker should not be able to obtain the valid token from another origin.

// ---------------------------------------------------------------------
// 10. CSRF token in a form
// ---------------------------------------------------------------------

interface ProfileFormProps {
  readonly csrfToken: string;
}

const ProfileForm = ({ csrfToken: token }: ProfileFormProps): ReactElement => {
  return (
    <form method="post" action="/account/profile">
      <input type="hidden" name="csrfToken" value={token} />
      <label>
        Display name
        <input name="displayName" defaultValue="John Doe" />
      </label>
      <button type="submit">Save profile</button>
    </form>
  );
};

// A server-rendered form can include the CSRF token as a hidden field.
//
// The server then verifies:
//
// session
//     +
// submitted token
//
// before changing state.

// ---------------------------------------------------------------------
// 11. CSRF tokens are not passwords
// ---------------------------------------------------------------------

const CsrfTokenPurposeExample: FC = (): ReactElement => {
  return <p>A CSRF token proves request context; it is not a replacement for authentication or authorization.</p>;
};

// CSRF tokens should not be treated as:
//
// passwords,
// API keys,
// user identifiers,
// authorization roles.
//
// The session credential establishes authentication.
//
// The CSRF token provides an additional request-integrity check.

// ---------------------------------------------------------------------
// 12. Custom request headers
// ---------------------------------------------------------------------

interface CustomHeaderRequest {
  readonly method: "POST";
  readonly headers: {
    readonly "X-CSRF-Token": string;
  };
}

const customHeaderRequest: CustomHeaderRequest = {
  method: "POST",
  headers: {
    "X-CSRF-Token": "random-server-generated-value",
  },
};

const CustomHeaderExample: FC = (): ReactElement => {
  return <p>The client can send a CSRF token in a custom request header.</p>;
};

// A custom header can be useful for API-driven applications:
//
// X-CSRF-Token: <token>
//
// A cross-origin HTML form cannot arbitrarily add this custom header.
//
// The server should still validate the header and should not assume that the
// presence of a header name alone is sufficient.

// ---------------------------------------------------------------------
// 13. React fetch with a CSRF header
// ---------------------------------------------------------------------

interface SaveProfileProps {
  readonly csrfToken: string;
}

const SaveProfileButton = ({ csrfToken: token }: SaveProfileProps): ReactElement => {
  const saveProfile = async (): Promise<void> => {
    const response = await fetch("/api/profile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": token,
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

// The important part is the protocol between client and server:
//
// client
//     ↓
// X-CSRF-Token
//     ↓
// server validation
//
// The server must reject the request when the token is missing or invalid.

// ---------------------------------------------------------------------
// 14. Cookie-to-header pattern
// ---------------------------------------------------------------------

interface CookieToHeaderPolicy {
  readonly csrfCookieReadableByJavaScript: boolean;
  readonly sessionCookieHttpOnly: boolean;
  readonly csrfTokenSentInHeader: boolean;
}

const cookieToHeaderPolicy: CookieToHeaderPolicy = {
  csrfCookieReadableByJavaScript: true,
  sessionCookieHttpOnly: true,
  csrfTokenSentInHeader: true,
};

const CookieToHeaderExample: FC = (): ReactElement => {
  return (
    <ul>
      <li>CSRF cookie readable by JavaScript: {String(cookieToHeaderPolicy.csrfCookieReadableByJavaScript)}</li>
      <li>Session cookie HttpOnly: {String(cookieToHeaderPolicy.sessionCookieHttpOnly)}</li>
      <li>Token sent in request header: {String(cookieToHeaderPolicy.csrfTokenSentInHeader)}</li>
    </ul>
  );
};

// A common SPA pattern is:
//
// server
//     ↓
// CSRF token cookie
//     ↓
// same-origin JavaScript reads token
//     ↓
// custom request header
//     ↓
// server validates token
//
// The CSRF cookie may intentionally be readable by JavaScript.
//
// The authentication/session cookie should remain HttpOnly when the
// architecture uses an HttpOnly session cookie.

// ---------------------------------------------------------------------
// 15. CSRF cookie does not authenticate the user
// ---------------------------------------------------------------------

const CsrfCookieAuthenticationExample: FC = (): ReactElement => {
  return <p>A CSRF token should not be treated as the application's authentication credential.</p>;
};

// The security roles are different:
//
// session cookie
//     → authentication
//
// CSRF token
//     → request validation
//
// Losing a CSRF token should not grant account access by itself.

// ---------------------------------------------------------------------
// 16. Double-submit cookie pattern
// ---------------------------------------------------------------------

interface DoubleSubmitPattern {
  readonly cookieValue: string;
  readonly requestValue: string;
}

const doubleSubmitPattern: DoubleSubmitPattern = {
  cookieValue: "random-csrf-value",
  requestValue: "random-csrf-value",
};

const DoubleSubmitCookieExample: FC = (): ReactElement => {
  return (
    <p>The server can compare a CSRF value from a cookie with a value sent through a request parameter or header.</p>
  );
};

// The double-submit pattern sends the same CSRF value through two channels:
//
// cookie
//     +
// request parameter or header
//
// The server compares the values.
//
// The exact implementation must follow a secure construction and should not
// simply accept arbitrary client-controlled values without an integrity model.

// ---------------------------------------------------------------------
// 17. Signed double-submit cookies
// ---------------------------------------------------------------------

interface SignedDoubleSubmitToken {
  readonly tokenContainsIntegrityProtection: boolean;
  readonly serverValidatesSignature: boolean;
}

const signedDoubleSubmitToken: SignedDoubleSubmitToken = {
  tokenContainsIntegrityProtection: true,
  serverValidatesSignature: true,
};

const SignedDoubleSubmitExample: FC = (): ReactElement => {
  return <p>A signed double-submit design can bind the CSRF token to trusted server-side context.</p>;
};

// When using a double-submit design, the CSRF token should be constructed so
// that an attacker cannot simply choose an arbitrary value and satisfy the
// server's comparison.
//
// A signed token can provide integrity when implemented correctly.
//
// Framework-provided implementations are preferable when available.

// ---------------------------------------------------------------------
// 18. SameSite cookies
// ---------------------------------------------------------------------

type SameSitePolicy = "Strict" | "Lax" | "None";

interface SameSiteCsrfPolicy {
  readonly value: SameSitePolicy;
  readonly purpose: string;
}

const sameSitePolicies: readonly SameSiteCsrfPolicy[] = [
  {
    value: "Strict",
    purpose: "strongly restrict cross-site cookie transmission",
  },
  {
    value: "Lax",
    purpose: "allow limited cross-site top-level navigations",
  },
  {
    value: "None",
    purpose: "allow cross-site cookie transmission",
  },
];

const SameSiteCsrfExample: FC = (): ReactElement => {
  return (
    <ul>
      {sameSitePolicies.map((policy) => (
        <li key={policy.value}>
          {policy.value}: {policy.purpose}
        </li>
      ))}
    </ul>
  );
};

// SameSite changes when the browser sends a cookie in a cross-site context.
//
// Strict:
//
// SameSite=Strict
//
// Lax:
//
// SameSite=Lax
//
// None:
//
// SameSite=None; Secure
//
// SameSite can reduce CSRF exposure but should be evaluated against the
// application's actual cross-site requirements.

// ---------------------------------------------------------------------
// 19. SameSite=Lax is not universal CSRF protection
// ---------------------------------------------------------------------

const SameSiteLaxLimitationExample: FC = (): ReactElement => {
  return <p>SameSite=Lax does not protect state-changing GET endpoints from all cross-site navigation scenarios.</p>;
};

// This is unsafe:
//
// GET /api/delete-account
//
// Even a SameSite=Lax session cookie can be sent in some cross-site
// top-level navigation scenarios involving safe methods.
//
// Therefore:
//
// GET
//     → should never change state
//
// This is a fundamental API-design rule in addition to cookie configuration.

// ---------------------------------------------------------------------
// 20. SameSite=Strict tradeoff
// ---------------------------------------------------------------------

const SameSiteStrictExample: FC = (): ReactElement => {
  return (
    <p>
      SameSite=Strict provides stronger cross-site cookie restrictions but can affect legitimate navigation flows from
      external sites.
    </p>
  );
};

// Strict can provide stronger CSRF resistance:
//
// SameSite=Strict
//
// but it can also prevent a session cookie from being sent when a user arrives
// at the application from another site.
//
// Cookie policy must therefore reflect the application's navigation and
// authentication requirements.

// ---------------------------------------------------------------------
// 21. Origin header validation
// ---------------------------------------------------------------------

interface OriginValidationPolicy {
  readonly expectedOrigin: string;
  readonly rejectUnexpectedOrigin: boolean;
}

const originValidationPolicy: OriginValidationPolicy = {
  expectedOrigin: "https://example.com",
  rejectUnexpectedOrigin: true,
};

const OriginValidationExample: FC = (): ReactElement => {
  return <p>State-changing requests can be checked against an expected Origin.</p>;
};

// The server can inspect the Origin request header:
//
// Origin: https://example.com
//
// and compare it against the expected application origin.
//
// Example:
//
// expected: https://example.com
// received: https://example.com
// result:   allowed
//
// A different origin should normally be rejected for protected state-changing
// operations.

// ---------------------------------------------------------------------
// 22. Origin comparison must be exact
// ---------------------------------------------------------------------

const ExactOriginExample: FC = (): ReactElement => {
  return <p>Origin validation must compare the complete trusted origin rather than using unsafe substring matching.</p>;
};

// Do not implement origin validation like:
//
// origin.includes("example.com")
//
// because:
//
// https://example.com.attacker.example
//
// could incorrectly match.
//
// Compare the actual scheme, host, and port of the expected origin.

// ---------------------------------------------------------------------
// 23. Referer fallback
// ---------------------------------------------------------------------

interface OriginFallback {
  readonly primaryHeader: "Origin";
  readonly fallbackHeader: "Referer";
}

const originFallback: OriginFallback = {
  primaryHeader: "Origin",
  fallbackHeader: "Referer",
};

const RefererFallbackExample: FC = (): ReactElement => {
  return <p>When appropriate, a server can use Referer validation when Origin is unavailable.</p>;
};

// A server can use:
//
// Origin
//     ↓
// if unavailable
//     ↓
// Referer
//
// The comparison must still validate the expected origin precisely.
//
// Applications should account for legitimate requests in which privacy
// settings or browser behavior omit these headers.

// ---------------------------------------------------------------------
// 24. Missing Origin and Referer
// ---------------------------------------------------------------------

const MissingOriginExample: FC = (): ReactElement => {
  return (
    <p>Sensitive state-changing endpoints should have an explicit policy for requests missing origin information.</p>
  );
};

// A security-sensitive endpoint can:
//
// reject the request,
// require another CSRF defense,
// log the request for investigation,
// or apply an application-specific fallback.
//
// Silently accepting every request with no origin information can weaken an
// origin-validation defense.

// ---------------------------------------------------------------------
// 25. Fetch Metadata
// ---------------------------------------------------------------------

interface FetchMetadataRequest {
  readonly secFetchSite: "same-origin" | "same-site" | "cross-site" | "none";
}

const fetchMetadataRequest: FetchMetadataRequest = {
  secFetchSite: "same-origin",
};

const FetchMetadataExample: FC = (): ReactElement => {
  return (
    <p>Sec-Fetch-Site provides information about the relationship between the request initiator and target site.</p>
  );
};

// The browser can send:
//
// Sec-Fetch-Site
//
// with values such as:
//
// same-origin
// same-site
// cross-site
// none
//
// A server can use this information as an additional CSRF defense.

// ---------------------------------------------------------------------
// 26. Blocking cross-site state-changing requests
// ---------------------------------------------------------------------

const FetchMetadataPolicyExample: FC = (): ReactElement => {
  return (
    <pre>
      {`if (secFetchSite === "cross-site" && isStateChangingMethod) {
    rejectRequest();
}`}
    </pre>
  );
};

// A high-level policy can be:
//
// if Sec-Fetch-Site === "cross-site"
//     and method changes state
//         → reject
//
// This is particularly useful as defense in depth.
//
// Applications should define explicit behavior for missing Fetch Metadata
// headers and legitimate cross-origin integrations.

// ---------------------------------------------------------------------
// 27. same-origin versus same-site
// ---------------------------------------------------------------------

interface FetchSiteClassification {
  readonly sameOrigin: string;
  readonly sameSite: string;
}

const fetchSiteClassification: FetchSiteClassification = {
  sameOrigin: "same scheme, host, and port",
  sameSite: "same site, potentially different origins",
};

const SameOriginVsSameSiteExample: FC = (): ReactElement => {
  return (
    <ul>
      <li>same-origin: {fetchSiteClassification.sameOrigin}</li>
      <li>same-site: {fetchSiteClassification.sameSite}</li>
    </ul>
  );
};

// same-origin is stricter than same-site.
//
// For example:
//
// https://app.example.com
//
// and:
//
// https://api.example.com
//
// are different origins but can be same-site.
//
// Whether same-site requests should be trusted depends on whether all sibling
// subdomains are within the application's security boundary.

// ---------------------------------------------------------------------
// 28. Client-side CSRF
// ---------------------------------------------------------------------

interface ClientSideCsrfInput {
  readonly endpoint: string;
}

const clientSideCsrfInput: ClientSideCsrfInput = {
  endpoint: "/api/profile",
};

const ClientSideCsrfExample: FC = (): ReactElement => {
  return (
    <p>
      Client-side CSRF can occur when attacker-controlled input determines which request the application's own
      JavaScript sends.
    </p>
  );
};

// A client-side CSRF flow can look like:
//
// attacker-controlled URL/input
//     ↓
// application JavaScript
//     ↓
// fetch(attackerControlledEndpoint)
//     ↓
// authenticated request
//
// This can bypass defenses that focus only on cross-site browser requests.
//
// Do not construct sensitive request URLs directly from untrusted input.

// ---------------------------------------------------------------------
// 29. Unsafe URL construction
// ---------------------------------------------------------------------

interface RequestTarget {
  readonly endpoint: string;
}

const requestTarget: RequestTarget = {
  endpoint: "/api/profile",
};

const SafeRequestTargetExample: FC = (): ReactElement => {
  return <p>Sensitive request targets should come from trusted application logic or validated allowlists.</p>;
};

// Avoid:
//
// fetch(userControlledUrl)
//
// Prefer:
//
// const endpoint = allowedEndpoints[action];
//
// fetch(endpoint)
//
// Validate and constrain attacker-influenced values before using them to
// construct state-changing requests.

// ---------------------------------------------------------------------
// 30. CSRF and CORS
// ---------------------------------------------------------------------

interface CorsCsrfPolicy {
  readonly allowedOrigins: readonly string[];
  readonly credentialsAllowed: boolean;
}

const corsCsrfPolicy: CorsCsrfPolicy = {
  allowedOrigins: ["https://example.com"],
  credentialsAllowed: true,
};

const CorsCsrfExample: FC = (): ReactElement => {
  return (
    <ul>
      <li>Allowed origin: {corsCsrfPolicy.allowedOrigins.join(", ")}</li>
      <li>Credentials allowed: {String(corsCsrfPolicy.credentialsAllowed)}</li>
    </ul>
  );
};

// CORS and CSRF solve different problems.
//
// CORS controls which cross-origin browser code is permitted to read responses
// and participate in certain cross-origin requests.
//
// CSRF protection validates whether a state-changing request is legitimate.
//
// Do not assume that enabling CORS automatically prevents CSRF.

// ---------------------------------------------------------------------
// 31. Credentialed cross-origin requests
// ---------------------------------------------------------------------

interface CredentialedRequestProps {
  readonly endpoint: string;
}

const CredentialedRequestExample = ({ endpoint }: CredentialedRequestProps): ReactElement => {
  const sendRequest = async (): Promise<void> => {
    const response = await fetch(endpoint, {
      method: "POST",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Request failed");
    }
  };

  return (
    <button
      type="button"
      onClick={() => {
        void sendRequest();
      }}
    >
      Send request
    </button>
  );
};

// credentials: "include" asks fetch to include credentials according to the
// browser's credential and cookie rules.
//
// Cross-origin credentialed requests require coordinated server-side CORS
// configuration and should not be broadly allowed from arbitrary origins.

// ---------------------------------------------------------------------
// 32. Preflight is not a complete CSRF defense
// ---------------------------------------------------------------------

const PreflightLimitationExample: FC = (): ReactElement => {
  return <p>Relying only on CORS preflight behavior is not a substitute for an explicit CSRF policy.</p>;
};

// Some requests require a CORS preflight before the browser sends the actual
// cross-origin request.
//
// However, simple cross-origin requests can be sent without the same
// preflight mechanism.
//
// Therefore, "the browser will preflight it" is not a general CSRF defense.

// ---------------------------------------------------------------------
// 33. Content-Type is not a CSRF token
// ---------------------------------------------------------------------

const ContentTypeExample: FC = (): ReactElement => {
  return (
    <p>
      Restricting requests to a particular Content-Type can contribute to a security design but does not replace CSRF
      validation.
    </p>
  );
};

// A JSON-only endpoint can reduce the requests that a basic HTML form can
// construct, but the server should still use an explicit CSRF strategy where
// cookie-based authentication requires it.
//
// Do not treat:
//
// Content-Type: application/json
//
// as equivalent to:
//
// valid CSRF token

// ---------------------------------------------------------------------
// 34. Authorization is still required
// ---------------------------------------------------------------------

interface AuthorizationPolicy {
  readonly authenticated: boolean;
  readonly authorized: boolean;
  readonly csrfValid: boolean;
}

const authorizationPolicy: AuthorizationPolicy = {
  authenticated: true,
  authorized: true,
  csrfValid: true,
};

const AuthorizationAndCsrfExample: FC = (): ReactElement => {
  return (
    <ul>
      <li>Authenticated: {String(authorizationPolicy.authenticated)}</li>
      <li>Authorized: {String(authorizationPolicy.authorized)}</li>
      <li>CSRF valid: {String(authorizationPolicy.csrfValid)}</li>
    </ul>
  );
};

// CSRF validation does not replace authentication or authorization.
//
// A protected operation should conceptually verify:
//
// authenticated
//     ↓
// authorized
//     ↓
// CSRF request validation
//     ↓
// perform operation
//
// The exact order and implementation belong to the server's security design.

// ---------------------------------------------------------------------
// 35. User interaction for sensitive operations
// ---------------------------------------------------------------------

const SensitiveActionExample: FC = (): ReactElement => {
  return (
    <section>
      <h2>Delete account</h2>
      <p>Highly sensitive operations can require additional user interaction or reauthentication.</p>
      <button type="button">Continue</button>
    </section>
  );
};

// For highly sensitive actions, applications can add another confirmation
// layer such as:
//
// reauthentication,
// password confirmation,
// MFA,
// explicit confirmation.
//
// This does not replace normal CSRF protection, but can reduce the impact of
// a forged request.

// ---------------------------------------------------------------------
// 36. CSRF protection in React forms
// ---------------------------------------------------------------------

interface DeleteAccountFormProps {
  readonly csrfToken: string;
}

const DeleteAccountForm = ({ csrfToken: token }: DeleteAccountFormProps): ReactElement => {
  return (
    <form method="post" action="/account/delete">
      <input type="hidden" name="csrfToken" value={token} />
      <button type="submit">Delete account</button>
    </form>
  );
};

// React does not automatically make a form CSRF-safe.
//
// A form that changes server state needs a server-side CSRF defense.
//
// The token can be rendered into the form and submitted with the request.

// ---------------------------------------------------------------------
// 37. CSRF protection in an event handler
// ---------------------------------------------------------------------

interface UpdateProfileProps {
  readonly csrfToken: string;
}

const UpdateProfile = ({ csrfToken: token }: UpdateProfileProps): ReactElement => {
  const [status, setStatus] = useState<"idle" | "saved" | "error">("idle");

  const updateProfile = async (): Promise<void> => {
    setStatus("idle");

    const response = await fetch("/api/profile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": token,
      },
      body: JSON.stringify({
        displayName: "John Doe",
      }),
    });

    setStatus(response.ok ? "saved" : "error");
  };

  return (
    <section>
      <button
        type="button"
        onClick={() => {
          void updateProfile();
        }}
      >
        Save profile
      </button>

      <p role="status">
        {status === "idle" && "Ready"}
        {status === "saved" && "Profile saved"}
        {status === "error" && "Unable to save profile"}
      </p>
    </section>
  );
};

// The token is part of the request protocol.
//
// React's responsibility is to send the value provided by the application's
// trusted data flow.
//
// The server remains responsible for validating the token.

// ---------------------------------------------------------------------
// 38. Never trust a CSRF token supplied by the wrong context
// ---------------------------------------------------------------------

const CsrfTokenValidationExample: FC = (): ReactElement => {
  return <p>The server must validate the token according to the CSRF mechanism it selected.</p>;
};

// This is insufficient:
//
// if (csrfToken) {
//     allowRequest();
// }
//
// A token's mere existence does not prove that it is valid.
//
// The server must validate:
//
// token format,
// token integrity,
// token association,
// expiration,
// session relationship,
// or other properties required by the chosen pattern.

// ---------------------------------------------------------------------
// 39. Do not put CSRF tokens in URLs unnecessarily
// ---------------------------------------------------------------------

const CsrfUrlExample: FC = (): ReactElement => {
  return (
    <p>
      CSRF tokens should generally be sent in request bodies or headers rather than unnecessary URL query parameters.
    </p>
  );
};

// Avoid:
//
// /api/profile?csrfToken=...
//
// URLs can appear in:
//
// browser history,
// logs,
// analytics,
// monitoring,
// referrer information,
// copied links.
//
// Prefer a request body or appropriate custom header when the protocol allows it.

// ---------------------------------------------------------------------
// 40. CSRF token lifetime
// ---------------------------------------------------------------------

interface CsrfTokenLifetime {
  readonly tiedToSession: boolean;
  readonly expires: boolean;
}

const csrfTokenLifetime: CsrfTokenLifetime = {
  tiedToSession: true,
  expires: true,
};

const CsrfLifetimeExample: FC = (): ReactElement => {
  return (
    <ul>
      <li>Tied to session: {String(csrfTokenLifetime.tiedToSession)}</li>
      <li>Expires or rotates: {String(csrfTokenLifetime.expires)}</li>
    </ul>
  );
};

// The token lifecycle should be consistent with the selected CSRF mechanism.
//
// A session-bound token should not remain valid after the associated security
// context has been invalidated.

// ---------------------------------------------------------------------
// 41. CSRF token rotation
// ---------------------------------------------------------------------

const CsrfRotationExample: FC = (): ReactElement => {
  return <p>CSRF tokens can be rotated according to the application's security and session-management requirements.</p>;
};

// Token rotation can be used at important lifecycle boundaries.
//
// However, unnecessarily rotating a token on every request can introduce
// concurrency and usability problems if multiple browser requests can be
// active simultaneously.
//
// Choose a lifecycle that matches the application's architecture.

// ---------------------------------------------------------------------
// 42. Framework-provided CSRF protection
// ---------------------------------------------------------------------

interface FrameworkProtection {
  readonly available: boolean;
  readonly preferredWhenAvailable: boolean;
}

const frameworkProtection: FrameworkProtection = {
  available: true,
  preferredWhenAvailable: true,
};

const FrameworkCsrfExample: FC = (): ReactElement => {
  return <p>Prefer maintained framework CSRF protections when they fit the application's architecture.</p>;
};

// Frameworks may provide:
//
// CSRF middleware,
// hidden form tokens,
// request-header validation,
// cookie-to-header helpers,
// Origin checks.
//
// Prefer established framework mechanisms over implementing cryptographic
// protocols from scratch.

// ---------------------------------------------------------------------
// 43. Server-side validation
// ---------------------------------------------------------------------

interface ServerValidation {
  readonly validatesToken: boolean;
  readonly validatesAuthorization: boolean;
  readonly validatesRequestMethod: boolean;
}

const serverValidation: ServerValidation = {
  validatesToken: true,
  validatesAuthorization: true,
  validatesRequestMethod: true,
};

const ServerValidationExample: FC = (): ReactElement => {
  return (
    <ul>
      <li>CSRF token: {String(serverValidation.validatesToken)}</li>
      <li>Authorization: {String(serverValidation.validatesAuthorization)}</li>
      <li>HTTP method: {String(serverValidation.validatesRequestMethod)}</li>
    </ul>
  );
};

// CSRF is fundamentally a server-side security problem.
//
// The server must enforce:
//
// correct HTTP method,
// authentication,
// authorization,
// CSRF validation,
// input validation,
// business rules.
//
// Client-side checks alone are not security boundaries.

// ---------------------------------------------------------------------
// 44. CSRF errors
// ---------------------------------------------------------------------

type CsrfErrorCode = "missing-token" | "invalid-token" | "origin-rejected" | "cross-site-request-rejected";

const csrfErrorCodes: readonly CsrfErrorCode[] = [
  "missing-token",
  "invalid-token",
  "origin-rejected",
  "cross-site-request-rejected",
];

const CsrfErrorsExample: FC = (): ReactElement => {
  return (
    <ul>
      {csrfErrorCodes.map((errorCode) => (
        <li key={errorCode}>{errorCode}</li>
      ))}
    </ul>
  );
};

// CSRF failures should be handled as security validation failures.
//
// Do not expose sensitive internal validation details to attackers.
//
// Logging should provide enough information for operators to investigate
// repeated or suspicious failures.

// ---------------------------------------------------------------------
// 45. Logging CSRF failures
// ---------------------------------------------------------------------

interface CsrfSecurityEvent {
  readonly event: "csrf-validation-failure";
  readonly requestPath: string;
}

const csrfSecurityEvent: CsrfSecurityEvent = {
  event: "csrf-validation-failure",
  requestPath: "/api/profile",
};

const CsrfLoggingExample: FC = (): ReactElement => {
  return <p>CSRF validation failures can be recorded as security events without logging sensitive token values.</p>;
};

// Never log the actual CSRF token.
//
// Security logs can record:
//
// event type,
// endpoint,
// timestamp,
// request context,
// authenticated principal when appropriate,
// validation result.
//
// Avoid placing credentials or token values into logs.

// ---------------------------------------------------------------------
// 46. CSRF and caching
// ---------------------------------------------------------------------

const CsrfCachingExample: FC = (): ReactElement => {
  return <p>Responses containing CSRF tokens require appropriate cache handling when the token is user-specific.</p>;
};

// If a page contains a session-specific CSRF token, caching that page in a
// shared cache can expose the token to another user.
//
// Server-side rendering and caching strategy must therefore account for
// user-specific security state.

// ---------------------------------------------------------------------
// 47. CSRF and Content Security Policy
// ---------------------------------------------------------------------

const CsrfCspExample: FC = (): ReactElement => {
  return <p>Content Security Policy can reduce some XSS risks but does not replace CSRF protection.</p>;
};

// Security controls have different responsibilities:
//
// CSP
//     → restricts resource and script behavior
//
// CSRF protection
//     → validates state-changing request context
//
// Authentication
//     → identifies the principal
//
// Authorization
//     → determines permissions

// ---------------------------------------------------------------------
// 48. CSRF and HttpOnly
// ---------------------------------------------------------------------

const CsrfHttpOnlyExample: FC = (): ReactElement => {
  return <p>HttpOnly protects session-cookie confidentiality from JavaScript but does not itself prevent CSRF.</p>;
};

// This configuration:
//
// Secure
// HttpOnly
// SameSite=Lax
//
// improves cookie security.
//
// But if an authenticated state-changing endpoint accepts a forged request,
// cookie attributes alone may not provide the complete protection required by
// the application's threat model.

// ---------------------------------------------------------------------
// 49. CSRF and SameSite cookies
// ---------------------------------------------------------------------

interface SecureSessionCookie {
  readonly name: "__Host-session";
  readonly secure: true;
  readonly httpOnly: true;
  readonly sameSite: "Lax" | "Strict";
  readonly path: "/";
}

const secureSessionCookie: SecureSessionCookie = {
  name: "__Host-session",
  secure: true,
  httpOnly: true,
  sameSite: "Lax",
  path: "/",
};

const SecureSessionCookieExample: FC = (): ReactElement => {
  return (
    <ul>
      <li>Name: {secureSessionCookie.name}</li>
      <li>Secure: {String(secureSessionCookie.secure)}</li>
      <li>HttpOnly: {String(secureSessionCookie.httpOnly)}</li>
      <li>SameSite: {secureSessionCookie.sameSite}</li>
      <li>Path: {secureSessionCookie.path}</li>
    </ul>
  );
};

// A secure session cookie can reduce CSRF exposure:
//
// __Host-session
// Secure
// HttpOnly
// SameSite=Lax or Strict
// Path=/
//
// The cookie configuration should be combined with an explicit CSRF strategy
// appropriate to the application's requirements.

// ---------------------------------------------------------------------
// 50. CSRF protection checklist
// ---------------------------------------------------------------------

interface CsrfChecklist {
  readonly safeMethods: boolean;
  readonly csrfDefense: boolean;
  readonly sameSite: boolean;
  readonly originValidation: boolean;
  readonly authorization: boolean;
}

const csrfChecklist: CsrfChecklist = {
  safeMethods: true,
  csrfDefense: true,
  sameSite: true,
  originValidation: true,
  authorization: true,
};

const CsrfChecklistExample: FC = (): ReactElement => {
  return (
    <ul>
      <li>No state-changing GET: {String(csrfChecklist.safeMethods)}</li>
      <li>Explicit CSRF defense: {String(csrfChecklist.csrfDefense)}</li>
      <li>SameSite policy: {String(csrfChecklist.sameSite)}</li>
      <li>Origin validation: {String(csrfChecklist.originValidation)}</li>
      <li>Server authorization: {String(csrfChecklist.authorization)}</li>
    </ul>
  );
};

// A practical CSRF review should ask:
//
// - Do any GET endpoints change state?
// - Does cookie authentication exist?
// - Is an explicit CSRF defense implemented?
// - Is SameSite configured intentionally?
// - Are Origin or Fetch Metadata checks useful for this deployment?
// - Are cross-origin integrations explicitly controlled?
// - Are client-side request targets validated?
// - Does the server perform authorization independently?
// - Are CSRF failures logged without exposing token values?

// ---------------------------------------------------------------------
// 51. Integrated example
// ---------------------------------------------------------------------

interface Profile {
  readonly displayName: string;
}

interface SecureProfileEditorProps {
  readonly csrfToken: string;
  readonly profile: Profile;
}

const SecureProfileEditor = ({ csrfToken: token, profile }: SecureProfileEditorProps): ReactElement => {
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
          "X-CSRF-Token": token,
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

const CsrfDemo: FC = (): ReactElement => {
  return (
    <SecureProfileEditor
      csrfToken="random-server-generated-value"
      profile={{
        displayName: "John Doe",
      }}
    />
  );
};

export default CsrfDemo;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - CSRF causes a user's browser to perform an unwanted state-changing request against an application where the user is authenticated.
// - Cookie-based authentication is particularly relevant because browsers can automatically attach applicable cookies to requests.
// - CSRF is different from XSS: CSRF abuses authenticated request behavior, while XSS executes attacker-controlled JavaScript in the trusted origin.
// - State-changing operations should use POST, PUT, PATCH, or DELETE rather than GET.
// - GET, HEAD, and OPTIONS should not perform state-changing operations.
// - A CSRF token adds request-specific information that an attacker should not be able to obtain from another origin.
// - The synchronizer token pattern associates a server-generated token with the user's security context and validates it on state-changing requests.
// - A CSRF token is not an authentication credential, password, or authorization role.
// - API-driven applications can send CSRF tokens through custom request headers.
// - The cookie-to-header pattern can use a JavaScript-readable CSRF cookie while keeping the authentication session cookie HttpOnly.
// - A CSRF cookie does not authenticate the user; it serves a separate request-validation purpose.
// - The double-submit cookie pattern compares a CSRF value supplied through a cookie with a value supplied through another request channel.
// - Signed double-submit designs can provide stronger integrity when implemented correctly.
// - SameSite=Strict strongly restricts cross-site cookie transmission.
// - SameSite=Lax provides useful CSRF defense while permitting certain cross-site top-level navigations.
// - SameSite=None permits cross-site cookie transmission and requires Secure.
// - SameSite should generally be treated as defense in depth rather than the sole CSRF defense.
// - SameSite does not make state-changing GET requests safe.
// - SameSite is evaluated at the site level, so sibling subdomains can remain within the same site boundary.
// - Origin validation can reject state-changing requests whose Origin does not match the expected application origin.
// - Origin comparisons must validate the complete trusted origin rather than using substring matching.
// - Referer can be used as an additional or fallback source of origin information when appropriate.
// - Sensitive endpoints should have an explicit policy for requests that lack Origin and Referer information.
// - Fetch Metadata headers such as Sec-Fetch-Site can provide additional request-context information for CSRF defense.
// - Cross-site state-changing requests can be rejected based on Sec-Fetch-Site when that policy matches the application's threat model.
// - Fetch Metadata handling should account for missing headers and legitimate cross-origin integrations.
// - same-origin and same-site are different concepts; sibling subdomains can be same-site without being same-origin.
// - Client-side CSRF can occur when attacker-controlled input causes the application's own JavaScript to construct a state-changing request.
// - Sensitive request targets should come from trusted application logic or validated allowlists rather than arbitrary user-controlled URLs.
// - CORS and CSRF solve different problems; enabling CORS does not automatically prevent CSRF.
// - Credentialed cross-origin requests require coordinated cookie and CORS policies and should not be broadly enabled for arbitrary origins.
// - CORS preflight behavior is not a complete CSRF defense.
// - Content-Type restrictions can contribute to a security design but do not replace explicit CSRF validation.
// - CSRF protection does not replace authentication or authorization; the server must continue to enforce both.
// - Highly sensitive operations can add reauthentication, MFA, or explicit user interaction as additional defense in depth.
// - React does not automatically protect forms or fetch requests against CSRF.
// - The client can send a CSRF token, but the server must validate it.
// - CSRF tokens should not be unnecessarily exposed through URLs because URLs can appear in history, logs, analytics, and other systems.
// - CSRF tokens should have a lifecycle appropriate to the selected protection mechanism and session architecture.
// - Framework-provided CSRF protections should generally be preferred over custom implementations when they fit the application.
// - CSRF failures can be logged as security events, but actual token values should never be logged.
// - User-specific CSRF tokens require appropriate cache handling to avoid exposing one user's token to another user.
// - CSP, HttpOnly, Secure, and SameSite are complementary security controls and do not individually replace an explicit CSRF strategy.
