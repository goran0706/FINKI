/**
 * Cookie Security
 * ===============
 *
 * Cookies are browser-managed name-value pairs that can be used for sessions, preferences,
 * and other application state. When cookies contain authentication credentials or other
 * sensitive data, attributes such as HttpOnly, Secure, SameSite, Domain, Path, and expiration
 * determine how broadly the browser exposes and transmits them.
 *
 * Secure cookie design limits credential exposure, reduces cross-site request risks, and
 * keeps authentication state under server control.
 */

import { type FC, type ReactElement } from "react";

// ---------------------------------------------------------------------
// 1. What is a cookie?
// ---------------------------------------------------------------------

// A cookie is a small piece of state associated with a web origin or domain.
//
// The server can create a cookie with Set-Cookie:
//
// Set-Cookie: session=example
//
// The browser stores the cookie and can include it in subsequent requests
// when the cookie's scope and policy allow it.
//
// Cookies are commonly used for:
//
// - sessions,
// - authentication,
// - preferences,
// - CSRF-related state,
// - feature configuration.

// ---------------------------------------------------------------------
// 2. Cookies and authentication
// ---------------------------------------------------------------------

interface AuthenticationCookie {
  readonly name: string;
  readonly purpose: "session";
}

const authenticationCookie: AuthenticationCookie = {
  name: "__Host-session",
  purpose: "session",
};

const AuthenticationCookieExample: FC = (): ReactElement => {
  return <p>Authentication cookie: {authenticationCookie.name}</p>;
};

// A session cookie can contain an opaque session identifier:
//
// browser
//     ↓
// session cookie
//     ↓
// server-side session
//
// The browser does not need to know the user's permissions, database records,
// or other server-side session details.

// ---------------------------------------------------------------------
// 3. Set-Cookie
// ---------------------------------------------------------------------

interface SetCookieExample {
  readonly name: string;
  readonly attributes: readonly string[];
}

const setCookieExample: SetCookieExample = {
  name: "__Host-session",
  attributes: ["Path=/", "Secure", "HttpOnly", "SameSite=Lax"],
};

const SetCookieExampleComponent: FC = (): ReactElement => {
  return (
    <ul>
      <li>Name: {setCookieExample.name}</li>
      {setCookieExample.attributes.map((attribute) => (
        <li key={attribute}>{attribute}</li>
      ))}
    </ul>
  );
};

// A server can send:
//
// Set-Cookie: __Host-session=...; Path=/; Secure; HttpOnly; SameSite=Lax
//
// React does not normally create an HttpOnly authentication cookie directly.
// HttpOnly is a server-controlled cookie attribute.

// ---------------------------------------------------------------------
// 4. HttpOnly
// ---------------------------------------------------------------------

const HttpOnlyExample: FC = (): ReactElement => {
  return (
    <section>
      <h2>HttpOnly</h2>
      <p>HttpOnly prevents JavaScript from directly reading the cookie value.</p>
    </section>
  );
};

// Without HttpOnly, a cookie may be accessible through:
//
// document.cookie
//
// With HttpOnly:
//
// document.cookie
//     ↓
// does not expose the HttpOnly cookie
//
// The browser can still send the cookie with applicable HTTP requests.

// ---------------------------------------------------------------------
// 5. HttpOnly is not an XSS defense
// ---------------------------------------------------------------------

const HttpOnlyLimitationExample: FC = (): ReactElement => {
  return <p>HttpOnly limits direct cookie theft but does not prevent malicious JavaScript from executing.</p>;
};

// HttpOnly protects the confidentiality of the cookie value from page
// JavaScript.
//
// It does not prevent an XSS payload from making requests such as:
//
// fetch("/api/account", {
//     method: "POST",
// });
//
// If the request is eligible to include the session cookie, the browser may
// send it automatically.
//
// Therefore, HttpOnly reduces one consequence of XSS but does not make XSS
// harmless.

// ---------------------------------------------------------------------
// 6. Secure
// ---------------------------------------------------------------------

const SecureExample: FC = (): ReactElement => {
  return <p>Secure restricts cookie transmission to HTTPS requests, with browser exceptions such as localhost.</p>;
};

// Secure protects the cookie during network transmission.
//
// A session cookie should normally use:
//
// Secure
//
// so that it is not intentionally sent over an unencrypted HTTP connection.
//
// Secure does not prevent JavaScript from reading the cookie. HttpOnly serves
// that separate purpose.

// ---------------------------------------------------------------------
// 7. SameSite
// ---------------------------------------------------------------------

type SameSiteValue = "Strict" | "Lax" | "None";

interface SameSitePolicy {
  readonly value: SameSiteValue;
  readonly description: string;
}

const sameSitePolicies: readonly SameSitePolicy[] = [
  {
    value: "Strict",
    description: "restricts the cookie to same-site requests",
  },
  {
    value: "Lax",
    description: "allows a limited set of cross-site navigations",
  },
  {
    value: "None",
    description: "allows cross-site transmission when Secure is also set",
  },
];

const SameSiteExample: FC = (): ReactElement => {
  return (
    <ul>
      {sameSitePolicies.map((policy) => (
        <li key={policy.value}>
          {policy.value}: {policy.description}
        </li>
      ))}
    </ul>
  );
};

// SameSite controls whether cookies are sent with cross-site requests.
//
// Strict is the most restrictive policy.
//
// Lax allows some cross-site top-level navigations.
//
// None allows cross-site cookie transmission and requires Secure.
//
// SameSite is an important defense against CSRF but should not be treated as
// the only CSRF defense for sensitive state-changing operations.

// ---------------------------------------------------------------------
// 8. SameSite=None requires Secure
// ---------------------------------------------------------------------

interface SameSiteNonePolicy {
  readonly sameSite: "None";
  readonly secure: true;
}

const sameSiteNonePolicy: SameSiteNonePolicy = {
  sameSite: "None",
  secure: true,
};

const SameSiteNoneExample: FC = (): ReactElement => {
  return <p>SameSite=None requires the Secure attribute.</p>;
};

// This configuration is valid:
//
// SameSite=None; Secure
//
// This configuration is not valid for a SameSite=None cookie:
//
// SameSite=None
//
// The browser requires Secure when SameSite=None is used.

// ---------------------------------------------------------------------
// 9. Domain
// ---------------------------------------------------------------------

interface CookieDomain {
  readonly domain: string | null;
  readonly hostOnly: boolean;
}

const cookieDomain: CookieDomain = {
  domain: null,
  hostOnly: true,
};

const CookieDomainExample: FC = (): ReactElement => {
  return <p>Domain omitted: the cookie is host-only.</p>;
};

// When Domain is omitted, the cookie is host-only.
//
// When Domain is specified:
//
// Domain=example.com
//
// the cookie can be sent to example.com and applicable subdomains.
//
// Use Domain only when cross-subdomain sharing is actually required.

// ---------------------------------------------------------------------
// 10. Host-only cookies
// ---------------------------------------------------------------------

const HostOnlyCookieExample: FC = (): ReactElement => {
  return <p>Host-only cookies are not intentionally shared with subdomains.</p>;
};

// A host-only cookie is created by omitting Domain:
//
// Set-Cookie: session=...; Secure; HttpOnly; Path=/
//
//
// example.com
//     ↓
// host-only cookie
//
// The browser does not treat the cookie as a Domain cookie shared with
// subdomains.

// ---------------------------------------------------------------------
// 11. Broad Domain scope
// ---------------------------------------------------------------------

interface DomainScope {
  readonly domain: string;
  readonly affectedHosts: readonly string[];
}

const broadDomainScope: DomainScope = {
  domain: "example.com",
  affectedHosts: ["example.com", "app.example.com", "admin.example.com"],
};

const BroadDomainExample: FC = (): ReactElement => {
  return (
    <ul>
      {broadDomainScope.affectedHosts.map((host) => (
        <li key={host}>{host}</li>
      ))}
    </ul>
  );
};

// A broad Domain attribute can cause a session cookie to be sent to multiple
// subdomains.
//
// This can increase the trust boundary of the credential.
//
// If one subdomain has a weaker security posture, sharing authentication
// cookies across the parent domain can increase session risk.

// ---------------------------------------------------------------------
// 12. Path
// ---------------------------------------------------------------------

interface CookiePath {
  readonly path: string;
}

const cookiePath: CookiePath = {
  path: "/",
};

const CookiePathExample: FC = (): ReactElement => {
  return <p>Cookie path: {cookiePath.path}</p>;
};

// Path controls which request paths receive the cookie.
//
// For example:
//
// Path=/account
//
// can limit the cookie to matching account paths.
//
// However, Path is not a JavaScript security boundary.
//
// It should not be treated as a mechanism that prevents another application
// on the same host from accessing the cookie through browser APIs when the
// cookie is not HttpOnly.

// ---------------------------------------------------------------------
// 13. Cookie prefixes
// ---------------------------------------------------------------------

type CookiePrefix = "__Secure-" | "__Host-";

interface CookiePrefixPolicy {
  readonly prefix: CookiePrefix;
  readonly requirements: readonly string[];
}

const cookiePrefixPolicies: readonly CookiePrefixPolicy[] = [
  {
    prefix: "__Secure-",
    requirements: ["Secure", "HTTPS"],
  },
  {
    prefix: "__Host-",
    requirements: ["Secure", "HTTPS", "Path=/", "no Domain"],
  },
];

const CookiePrefixExample: FC = (): ReactElement => {
  return (
    <ul>
      {cookiePrefixPolicies.map((policy) => (
        <li key={policy.prefix}>
          {policy.prefix}: {policy.requirements.join(", ")}
        </li>
      ))}
    </ul>
  );
};

// Cookie prefixes let the browser enforce additional naming conventions.
//
// The two commonly used security prefixes are:
//
// __Secure-
// __Host-
//
// The __Host- prefix provides stronger host and scope restrictions than
// __Secure-.

// ---------------------------------------------------------------------
// 14. __Secure-
// ---------------------------------------------------------------------

const SecurePrefixExample: FC = (): ReactElement => {
  return <p>__Secure- cookies must be set with Secure from a secure origin.</p>;
};

// Example:
//
// Set-Cookie: __Secure-session=...; Secure; HttpOnly; SameSite=Lax
//
// The __Secure- prefix requires Secure.
//
// It does not prohibit Domain, so it can be used when legitimate
// cross-subdomain sharing is required.

// ---------------------------------------------------------------------
// 15. __Host-
// ---------------------------------------------------------------------

const HostPrefixExample: FC = (): ReactElement => {
  return <p>__Host- cookies require Secure, Path=/, and no Domain attribute.</p>;
};

// Example:
//
// Set-Cookie: __Host-session=...; Secure; HttpOnly; SameSite=Lax; Path=/
//
// The browser requires:
//
// Secure
// Path=/
// no Domain
//
// This makes the cookie host-bound and prevents it from being scoped to a
// parent domain.

// ---------------------------------------------------------------------
// 16. Why __Host- is useful for sessions
// ---------------------------------------------------------------------

interface HostSessionCookie {
  readonly name: "__Host-session";
  readonly secure: true;
  readonly httpOnly: true;
  readonly sameSite: "Lax" | "Strict";
  readonly path: "/";
  readonly domain: null;
}

const hostSessionCookie: HostSessionCookie = {
  name: "__Host-session",
  secure: true,
  httpOnly: true,
  sameSite: "Lax",
  path: "/",
  domain: null,
};

const HostSessionCookieExample: FC = (): ReactElement => {
  return (
    <ul>
      <li>Name: {hostSessionCookie.name}</li>
      <li>Secure: {String(hostSessionCookie.secure)}</li>
      <li>HttpOnly: {String(hostSessionCookie.httpOnly)}</li>
      <li>SameSite: {hostSessionCookie.sameSite}</li>
      <li>Path: {hostSessionCookie.path}</li>
      <li>Domain: omitted</li>
    </ul>
  );
};

// A strong baseline for a host-specific session cookie is:
//
// __Host-session
// Secure
// HttpOnly
// SameSite=Lax or Strict
// Path=/
// no Domain
//
// The correct SameSite policy depends on the application's requirements.

// ---------------------------------------------------------------------
// 17. Cookie expiration
// ---------------------------------------------------------------------

interface CookieLifetime {
  readonly maxAgeSeconds: number | null;
  readonly sessionCookie: boolean;
}

const sessionCookieLifetime: CookieLifetime = {
  maxAgeSeconds: null,
  sessionCookie: true,
};

const CookieLifetimeExample: FC = (): ReactElement => {
  return <p>{sessionCookieLifetime.sessionCookie ? "Session cookie" : "Persistent cookie"}</p>;
};

// A cookie without Max-Age or Expires is generally a session cookie.
//
// A cookie with Max-Age or Expires is persistent.
//
// Session cookies can reduce the amount of time a session identifier remains
// stored by the browser, although server-side expiration and invalidation are
// still required.

// ---------------------------------------------------------------------
// 18. Max-Age
// ---------------------------------------------------------------------

interface MaxAgeCookie {
  readonly maxAgeSeconds: number;
}

const maxAgeCookie: MaxAgeCookie = {
  maxAgeSeconds: 1_800,
};

const MaxAgeExample: FC = (): ReactElement => {
  return <p>Max-Age: {maxAgeCookie.maxAgeSeconds} seconds</p>;
};

// Max-Age specifies the cookie lifetime in seconds.
//
// Example:
//
// Max-Age=1800
//
// means that the cookie is intended to expire after 1,800 seconds.
//
// For authentication cookies, lifetime should be consistent with the
// application's session policy.

// ---------------------------------------------------------------------
// 19. Expires
// ---------------------------------------------------------------------

interface ExpiringCookie {
  readonly expires: string;
}

const expiringCookie: ExpiringCookie = {
  expires: "example expiration time",
};

const ExpiresExample: FC = (): ReactElement => {
  return <p>Persistent cookies can specify an expiration time.</p>;
};

// Expires specifies an absolute expiration date.
//
// Max-Age is generally preferred when expressing a relative lifetime.
//
// The server should not rely on the client cookie alone for session expiration.
// The server must enforce the session's actual validity.

// ---------------------------------------------------------------------
// 20. Cookie deletion
// ---------------------------------------------------------------------

interface CookieDeletion {
  readonly name: string;
  readonly maxAge: 0;
}

const cookieDeletion: CookieDeletion = {
  name: "__Host-session",
  maxAge: 0,
};

const CookieDeletionExample: FC = (): ReactElement => {
  return <p>Cookie {cookieDeletion.name} can be instructed to expire immediately.</p>;
};

// To remove a cookie, the server can send a Set-Cookie response that expires
// the cookie.
//
// The deletion response should use compatible cookie scope attributes so that
// the intended cookie is actually removed.
//
// Clearing a client-visible cookie does not replace server-side session
// invalidation.

// ---------------------------------------------------------------------
// 21. Logout
// ---------------------------------------------------------------------

interface LogoutPolicy {
  readonly invalidateServerSession: boolean;
  readonly expireCookie: boolean;
}

const logoutPolicy: LogoutPolicy = {
  invalidateServerSession: true,
  expireCookie: true,
};

const LogoutExample: FC = (): ReactElement => {
  return (
    <ul>
      <li>Server session invalidated: {String(logoutPolicy.invalidateServerSession)}</li>
      <li>Cookie expired: {String(logoutPolicy.expireCookie)}</li>
    </ul>
  );
};

// A secure logout flow should address both sides:
//
// server
//     ↓
// invalidate session
//
// browser
//     ↓
// expire authentication cookie
//
// Clearing only the browser cookie may leave the server-side session valid.

// ---------------------------------------------------------------------
// 22. Cookie rotation after authentication
// ---------------------------------------------------------------------

const SessionRotationExample: FC = (): ReactElement => {
  return <p>Authentication should use an appropriate session-identifier rotation strategy.</p>;
};

// A session identifier that existed before authentication should not simply
// become the long-term authenticated identifier when the architecture requires
// session renewal.
//
// Rotating the session identifier at authentication boundaries helps mitigate
// session fixation.

// ---------------------------------------------------------------------
// 23. Cookies and CSRF
// ---------------------------------------------------------------------

const CookieCsrfExample: FC = (): ReactElement => {
  return (
    <section>
      <h2>Cookies and CSRF</h2>
      <p>Automatically attached cookies require explicit consideration of cross-site request forgery.</p>
    </section>
  );
};

// Cookie authentication has an important property:
//
// browser
//     ↓
// automatically attaches applicable cookie
//
// This is convenient for sessions, but it also means an attacker may try to
// cause a victim's browser to make authenticated requests.
//
// Defenses can include:
//
// SameSite
// CSRF tokens
// Origin validation
// appropriate server-side request validation

// ---------------------------------------------------------------------
// 24. SameSite is defense in depth
// ---------------------------------------------------------------------

const SameSiteDefenseExample: FC = (): ReactElement => {
  return <p>SameSite should contribute to CSRF protection without being treated as the only CSRF defense.</p>;
};

// A sensitive state-changing endpoint should not rely on a single browser
// behavior for authorization.
//
// SameSite is valuable defense in depth.
//
// Applications with important state-changing operations should evaluate
// dedicated CSRF protections according to their architecture.

// ---------------------------------------------------------------------
// 25. Cookies and XSS
// ---------------------------------------------------------------------

const CookieXssExample: FC = (): ReactElement => {
  return (
    <section>
      <h2>Cookies and XSS</h2>
      <p>
        HttpOnly protects the cookie value from direct JavaScript reads, but XSS can still abuse an authenticated
        browser session.
      </p>
    </section>
  );
};

// With an HttpOnly session cookie:
//
// XSS
//   ↓
// cannot directly read session cookie
//
// But:
//
// XSS
//   ↓
// can potentially make same-origin authenticated requests
//
// Therefore cookie security and XSS prevention are complementary controls.

// ---------------------------------------------------------------------
// 26. Cookies and HTTPS
// ---------------------------------------------------------------------

const HttpsCookieExample: FC = (): ReactElement => {
  return <p>Authentication cookies should be used with HTTPS for the entire authenticated session.</p>;
};

// Secure cookies should be paired with HTTPS across the authenticated
// application.
//
// Protecting only the login request is insufficient if the session identifier
// later travels over an unencrypted connection.

// ---------------------------------------------------------------------
// 27. HSTS
// ---------------------------------------------------------------------

const HstsExample: FC = (): ReactElement => {
  return <p>HTTP Strict Transport Security can help enforce HTTPS for supported browsers.</p>;
};

// HSTS tells supporting browsers to use HTTPS for a host.
//
// HSTS complements Secure cookies:
//
// HTTPS
//     +
// Secure
//     +
// HSTS
//
// provides stronger transport protection than relying on a Secure cookie
// alone.

// ---------------------------------------------------------------------
// 28. Cookie scope and subdomains
// ---------------------------------------------------------------------

interface SubdomainCookieRisk {
  readonly parentDomain: string;
  readonly subdomains: readonly string[];
}

const subdomainCookieRisk: SubdomainCookieRisk = {
  parentDomain: "example.com",
  subdomains: ["app.example.com", "admin.example.com", "legacy.example.com"],
};

const SubdomainCookieRiskExample: FC = (): ReactElement => {
  return (
    <ul>
      {subdomainCookieRisk.subdomains.map((subdomain) => (
        <li key={subdomain}>{subdomain}</li>
      ))}
    </ul>
  );
};

// A Domain cookie can create a trust relationship across subdomains.
//
// If:
//
// Domain=example.com
//
// is used for an authentication cookie, multiple applications can participate
// in that cookie's scope.
//
// A host-only or __Host- cookie avoids that broad Domain scope.

// ---------------------------------------------------------------------
// 29. Cookie scope should be intentional
// ---------------------------------------------------------------------

interface CookieScopePolicy {
  readonly domain: "omitted";
  readonly path: "/";
  readonly sameSite: "Lax" | "Strict";
}

const cookieScopePolicy: CookieScopePolicy = {
  domain: "omitted",
  path: "/",
  sameSite: "Lax",
};

const CookieScopePolicyExample: FC = (): ReactElement => {
  return (
    <ul>
      <li>Domain: {cookieScopePolicy.domain}</li>
      <li>Path: {cookieScopePolicy.path}</li>
      <li>SameSite: {cookieScopePolicy.sameSite}</li>
    </ul>
  );
};

// A cookie should be given only the scope it actually needs.
//
// For a host-wide session:
//
// Domain omitted
// Path=/
//
// can be appropriate.
//
// If the session genuinely needs cross-subdomain access, Domain can be used,
// but the broader trust boundary should be intentional.

// ---------------------------------------------------------------------
// 30. Cookie names should be unambiguous
// ---------------------------------------------------------------------

interface CookieNamePolicy {
  readonly name: string;
  readonly purpose: string;
}

const cookieNamePolicies: readonly CookieNamePolicy[] = [
  {
    name: "__Host-session",
    purpose: "authenticated session",
  },
  {
    name: "theme",
    purpose: "UI preference",
  },
];

const CookieNameExample: FC = (): ReactElement => {
  return (
    <ul>
      {cookieNamePolicies.map((cookie) => (
        <li key={cookie.name}>
          {cookie.name}: {cookie.purpose}
        </li>
      ))}
    </ul>
  );
};

// Use distinct names and clearly defined purposes.
//
// Avoid reusing the same cookie name across different paths or domain scopes
// when doing so makes session handling difficult to reason about.

// ---------------------------------------------------------------------
// 31. Do not put secrets in ordinary cookies
// ---------------------------------------------------------------------

const OrdinaryCookieExample: FC = (): ReactElement => {
  return <p>A cookie is not automatically a secure place for arbitrary secrets.</p>;
};

// This is not sufficient:
//
// Set-Cookie: secret=...
//
// A sensitive cookie should normally have an explicit security policy:
//
// Secure
// HttpOnly
// SameSite
// appropriate scope
// appropriate lifetime
//
// The correct configuration depends on the credential and application.

// ---------------------------------------------------------------------
// 32. Do not store passwords in cookies
// ---------------------------------------------------------------------

const PasswordCookieExample: FC = (): ReactElement => {
  return <p>Passwords should never be stored in browser cookies.</p>;
};

// A password is an authentication input, not a session credential that should
// be persisted by the browser.
//
// After authentication, use an appropriate session mechanism rather than
// storing the password in a cookie.

// ---------------------------------------------------------------------
// 33. Do not store access tokens unnecessarily in cookies
// ---------------------------------------------------------------------

const AccessTokenCookieExample: FC = (): ReactElement => {
  return (
    <p>
      Putting an access token in a cookie changes its threat model and requires careful CSRF and scope considerations.
    </p>
  );
};

// Cookies can be used to transport credentials, but the decision should be
// deliberate.
//
// When a cookie carries an authentication credential:
//
// - HttpOnly can protect its confidentiality from JavaScript,
// - Secure protects transmission,
// - SameSite influences cross-site sending,
// - CSRF defenses may be required,
// - server-side authorization remains mandatory.

// ---------------------------------------------------------------------
// 34. Cookie value design
// ---------------------------------------------------------------------

interface SessionCookieValue {
  readonly format: "opaque";
  readonly value: string;
}

const sessionCookieValue: SessionCookieValue = {
  format: "opaque",
  value: "random-session-identifier",
};

const SessionCookieValueExample: FC = (): ReactElement => {
  return <p>Session cookies can contain opaque identifiers that have no useful meaning by themselves.</p>;
};

// A server-managed session cookie commonly contains an opaque, unpredictable
// session identifier.
//
// Example:
//
// __Host-session=<opaque-random-value>
//
// The server uses the identifier to locate the associated session.

// ---------------------------------------------------------------------
// 35. Do not trust cookie contents
// ---------------------------------------------------------------------

interface CookieClaims {
  readonly userId: string;
  readonly role: string;
}

const cookieClaims: CookieClaims = {
  userId: "user-123",
  role: "user",
};

const CookieClaimsExample: FC = (): ReactElement => {
  return <p>Cookie contents must be validated according to the authentication architecture.</p>;
};

// The server must not blindly trust client-controlled cookie values.
//
// For example, this is unsafe as an authorization model:
//
// role=admin
//
// A client may attempt to modify such a value.
//
// Authorization must be derived from trusted server-side state or from a
// cryptographically validated credential according to the authentication
// architecture.

// ---------------------------------------------------------------------
// 36. Signed cookie values
// ---------------------------------------------------------------------

interface SignedCookie {
  readonly value: string;
  readonly signature: string;
}

const signedCookie: SignedCookie = {
  value: "user-123",
  signature: "example-signature",
};

const SignedCookieExample: FC = (): ReactElement => {
  return <p>Signed cookies can provide integrity when validated correctly by the server.</p>;
};

// A signed cookie can detect unauthorized modification.
//
// However, signing does not automatically provide:
//
// confidentiality
// expiration enforcement
// authorization correctness
// replay prevention
//
// The server must still validate the complete security model.

// ---------------------------------------------------------------------
// 37. Encrypted cookie values
// ---------------------------------------------------------------------

interface EncryptedCookie {
  readonly ciphertext: string;
}

const encryptedCookie: EncryptedCookie = {
  ciphertext: "example-ciphertext",
};

const EncryptedCookieExample: FC = (): ReactElement => {
  return <p>Encryption can protect cookie contents from disclosure to parties that cannot decrypt them.</p>;
};

// Encryption can provide confidentiality when implemented correctly.
//
// It does not eliminate the need for:
//
// Secure
// HttpOnly
// SameSite
// appropriate scope
// expiration
// server-side authorization
//
// A cryptographically protected cookie can still be replayed if an attacker
// obtains a valid copy.

// ---------------------------------------------------------------------
// 38. Cookie size and data minimization
// ---------------------------------------------------------------------

interface CookieDataPolicy {
  readonly contains: "minimal-session-information";
}

const cookieDataPolicy: CookieDataPolicy = {
  contains: "minimal-session-information",
};

const CookieDataExample: FC = (): ReactElement => {
  return <p>Authentication cookies should contain only the information required by the chosen session design.</p>;
};

// Avoid placing large or unnecessary application state into cookies.
//
// Cookies are sent with matching requests, so unnecessary cookie data can:
//
// increase request size,
// increase exposure surface,
// complicate session management.
//
// An opaque session identifier is often simpler than putting an entire user
// profile into a cookie.

// ---------------------------------------------------------------------
// 39. Cookie caching
// ---------------------------------------------------------------------

const CookieCachingExample: FC = (): ReactElement => {
  return (
    <p>Responses containing session identifiers or other sensitive state should use appropriate cache controls.</p>
  );
};

// Session identifiers and sensitive authenticated responses should not be
// unintentionally stored in shared caches.
//
// Server responses containing sensitive session state can use:
//
// Cache-Control: no-store
//
// when appropriate to prevent storage of the response by caches.

// ---------------------------------------------------------------------
// 40. Clear-Site-Data
// ---------------------------------------------------------------------

interface ClearSiteDataPolicy {
  readonly directives: readonly string[];
}

const clearSiteDataPolicy: ClearSiteDataPolicy = {
  directives: ["cache", "cookies", "storage"],
};

const ClearSiteDataExample: FC = (): ReactElement => {
  return <p>Clear-Site-Data can help clean up browser state during security-sensitive session termination.</p>;
};

// A server can use Clear-Site-Data during logout when appropriate.
//
// For example:
//
// Clear-Site-Data: "cache", "cookies", "storage"
//
// This is powerful and should be used deliberately because it can affect
// broader browser state for the origin.

// ---------------------------------------------------------------------
// 41. React cannot make a cookie HttpOnly
// ---------------------------------------------------------------------

const ReactCookieLimitationExample: FC = (): ReactElement => {
  return <p>HttpOnly must be established through the HTTP response that sets the cookie.</p>;
};

// This does not create an HttpOnly cookie:
//
// document.cookie = "session=...; HttpOnly";
//
// HttpOnly is intentionally unavailable to JavaScript cookie-setting APIs.
//
// The server must send the Set-Cookie response header with HttpOnly.

// ---------------------------------------------------------------------
// 42. React can trigger authenticated requests
// ---------------------------------------------------------------------

interface AccountRequestExampleProps {
  readonly endpoint: string;
}

const AccountRequestExample = ({ endpoint }: AccountRequestExampleProps): ReactElement => {
  const loadAccount = async (): Promise<void> => {
    const response = await fetch(endpoint);

    if (!response.ok) {
      throw new Error("Unable to load account");
    }
  };

  return (
    <button
      type="button"
      onClick={() => {
        void loadAccount();
      }}
    >
      Load account
    </button>
  );
};

// The browser can attach an applicable HttpOnly session cookie to a fetch
// request even though JavaScript cannot read the cookie.
//
// This is one of the main benefits of server-managed cookie sessions.

// ---------------------------------------------------------------------
// 43. Credentialed fetch
// ---------------------------------------------------------------------

interface CredentialedFetchProps {
  readonly endpoint: string;
}

const CredentialedFetchExample = ({ endpoint }: CredentialedFetchProps): ReactElement => {
  const request = async (): Promise<void> => {
    const response = await fetch(endpoint, {
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
        void request();
      }}
    >
      Request protected data
    </button>
  );
};

// credentials: "include" tells fetch to include credentials for the request
// when the browser's cookie and CORS policies permit it.
//
// For cross-origin requests, the server must also provide compatible CORS
// headers and the cookie's SameSite policy must allow the intended context.

// ---------------------------------------------------------------------
// 44. Avoid manually copying HttpOnly cookies
// ---------------------------------------------------------------------

const HttpOnlyCopyExample: FC = (): ReactElement => {
  return (
    <p>Application JavaScript should not attempt to copy an HttpOnly session cookie into another storage mechanism.</p>
  );
};

// The purpose of HttpOnly is to keep the session credential outside direct
// JavaScript access.
//
// Copying authentication state into:
//
// localStorage
// sessionStorage
// React state
// DOM attributes
//
// would defeat that design.

// ---------------------------------------------------------------------
// 45. Cookie authentication and server authorization
// ---------------------------------------------------------------------

interface AuthorizationResult {
  readonly authenticated: boolean;
  readonly authorized: boolean;
}

const authorizationResult: AuthorizationResult = {
  authenticated: true,
  authorized: true,
};

const ServerAuthorizationExample: FC = (): ReactElement => {
  return (
    <p>
      Authenticated: {String(authorizationResult.authenticated)}; Authorized: {String(authorizationResult.authorized)}
    </p>
  );
};

// A valid cookie proves only what the authentication system says it proves.
//
// Every protected operation should still perform appropriate authorization:
//
// authenticated
//     ↓
// identify principal
//     ↓
// verify permission
//     ↓
// perform operation

// ---------------------------------------------------------------------
// 46. Cookie security and session expiration
// ---------------------------------------------------------------------

interface SessionPolicy {
  readonly idleTimeoutMinutes: number;
  readonly absoluteTimeoutMinutes: number;
}

const sessionPolicy: SessionPolicy = {
  idleTimeoutMinutes: 30,
  absoluteTimeoutMinutes: 480,
};

const SessionTimeoutExample: FC = (): ReactElement => {
  return (
    <ul>
      <li>Idle timeout: {sessionPolicy.idleTimeoutMinutes} minutes</li>
      <li>Absolute timeout: {sessionPolicy.absoluteTimeoutMinutes} minutes</li>
    </ul>
  );
};

// Cookie expiration and server-side session expiration are related but distinct.
//
// The browser can stop sending an expired cookie.
//
// The server must also reject expired or revoked sessions.
//
// Never rely exclusively on the browser to enforce authentication expiration.

// ---------------------------------------------------------------------
// 47. Cookie security and session revocation
// ---------------------------------------------------------------------

interface SessionRevocation {
  readonly sessionId: string;
  readonly revoked: boolean;
}

const sessionRevocation: SessionRevocation = {
  sessionId: "session-123",
  revoked: true,
};

const SessionRevocationExample: FC = (): ReactElement => {
  return (
    <p>
      Session {sessionRevocation.sessionId}: {sessionRevocation.revoked ? "revoked" : "active"}
    </p>
  );
};

// A server-side session can be revoked independently of the browser cookie.
//
// This allows the server to invalidate a session after:
//
// logout,
// credential compromise,
// administrative action,
// suspicious activity,
// password changes,
// other security events.

// ---------------------------------------------------------------------
// 48. Cookie security and session rotation
// ---------------------------------------------------------------------

const CookieRotationExample: FC = (): ReactElement => {
  return <p>Session identifiers should be rotated at appropriate authentication and privilege boundaries.</p>;
};

// Session rotation can help prevent session fixation.
//
// Important transitions can include:
//
// unauthenticated
//     ↓
// authenticated
//
// ordinary user
//     ↓
// elevated privilege
//
// The exact rotation policy depends on the session architecture.

// ---------------------------------------------------------------------
// 49. Multiple cookies
// ---------------------------------------------------------------------

interface SessionCookies {
  readonly session: string;
  readonly csrf: string;
}

const sessionCookies: SessionCookies = {
  session: "__Host-session",
  csrf: "csrf-token",
};

const MultipleCookiesExample: FC = (): ReactElement => {
  return (
    <ul>
      <li>Session: {sessionCookies.session}</li>
      <li>CSRF-related state: {sessionCookies.csrf}</li>
    </ul>
  );
};

// Applications may use multiple cookies for different purposes.
//
// For example:
//
// session cookie
// CSRF-related cookie
// preference cookie
//
// Each cookie should have an explicit purpose and security configuration.
//
// When multiple cookies contribute to session security, the server must verify
// their relationships correctly.

// ---------------------------------------------------------------------
// 50. Cookie-based CSRF token
// ---------------------------------------------------------------------

interface CsrfCookie {
  readonly name: string;
  readonly readableByJavaScript: boolean;
}

const csrfCookie: CsrfCookie = {
  name: "csrf-token",
  readableByJavaScript: true,
};

const CsrfCookieExample: FC = (): ReactElement => {
  return (
    <p>A CSRF token may intentionally be readable by JavaScript when the application's CSRF defense requires it.</p>
  );
};

// Not every cookie should be HttpOnly.
//
// A CSRF token may need to be readable by client code so that JavaScript can
// copy it into a request header.
//
// This is fundamentally different from the session credential:
//
// session cookie
//     → HttpOnly
//
// CSRF token
//     → may be intentionally readable

// ---------------------------------------------------------------------
// 51. Cookie security and CORS
// ---------------------------------------------------------------------

interface CorsPolicy {
  readonly allowCredentials: boolean;
  readonly allowedOrigin: string;
}

const corsPolicy: CorsPolicy = {
  allowCredentials: true,
  allowedOrigin: "https://example.com",
};

const CorsExample: FC = (): ReactElement => {
  return (
    <ul>
      <li>Credentials: {String(corsPolicy.allowCredentials)}</li>
      <li>Allowed origin: {corsPolicy.allowedOrigin}</li>
    </ul>
  );
};

// Credentialed cross-origin requests require coordinated browser and server
// configuration.
//
// A server should not broadly allow arbitrary origins together with credentials.
//
// The allowed origin should be intentionally restricted to trusted origins.

// ---------------------------------------------------------------------
// 52. Cookie security and third-party services
// ---------------------------------------------------------------------

const ThirdPartyCookieExample: FC = (): ReactElement => {
  return <p>Authentication cookies should not be unnecessarily exposed to third-party contexts.</p>;
};

// Third-party cookie behavior is increasingly restricted by browsers and can
// vary with browser privacy policies.
//
// Authentication architecture should avoid depending on unrestricted
// third-party cookie behavior unless that behavior is genuinely required.

// ---------------------------------------------------------------------
// 53. Cookie security and browser defaults
// ---------------------------------------------------------------------

const BrowserDefaultsExample: FC = (): ReactElement => {
  return (
    <p>
      Security-sensitive cookies should explicitly declare important attributes rather than relying on browser defaults.
    </p>
  );
};

// Explicitly configuring:
//
// Secure
// HttpOnly
// SameSite
// Path
//
// makes the intended security policy visible and easier to review.
//
// Do not assume that an unspecified security attribute has the exact behavior
// your application requires across all environments and browsers.

// ---------------------------------------------------------------------
// 54. Cookie security and server frameworks
// ---------------------------------------------------------------------

interface CookieFrameworkPolicy {
  readonly framework: string;
  readonly responsibility: string;
}

const cookieFrameworkPolicy: CookieFrameworkPolicy = {
  framework: "example server framework",
  responsibility: "send and validate the cookie security policy",
};

const CookieFrameworkExample: FC = (): ReactElement => {
  return <p>Framework cookie helpers still require an intentional security configuration.</p>;
};

// Server frameworks often provide cookie APIs such as:
//
// setCookie(...)
// clearCookie(...)
//
// These abstractions do not remove the need to configure:
//
// HttpOnly
// Secure
// SameSite
// Domain
// Path
// expiration
//
// Review the generated Set-Cookie header rather than assuming the framework's
// defaults are appropriate.

// ---------------------------------------------------------------------
// 55. Inspect the actual Set-Cookie header
// ---------------------------------------------------------------------

interface CookieHeaderReview {
  readonly header: string;
}

const cookieHeaderReview: CookieHeaderReview = {
  header: "Set-Cookie: __Host-session=...; Path=/; Secure; HttpOnly; SameSite=Lax",
};

const CookieHeaderReviewExample: FC = (): ReactElement => {
  return <p>Security reviews should verify the actual cookie attributes sent by the server.</p>;
};

// A useful security review checks the generated HTTP response:
//
// Set-Cookie
//     ↓
// name
// Secure
// HttpOnly
// SameSite
// Domain
// Path
// Max-Age / Expires
//
// Do not infer the final policy solely from application configuration code.

// ---------------------------------------------------------------------
// 56. Avoid cookie shadowing
// ---------------------------------------------------------------------

const CookieShadowingExample: FC = (): ReactElement => {
  return <p>Avoid reusing the same cookie name across confusing path or domain scopes.</p>;
};

// Multiple cookies with the same name but different scope can make server-side
// cookie handling difficult to reason about.
//
// Authentication code should use clear, unique cookie names and a single
// intentional scope wherever possible.

// ---------------------------------------------------------------------
// 57. Cookie security and session fixation
// ---------------------------------------------------------------------

const CookieFixationExample: FC = (): ReactElement => {
  return (
    <p>
      Session identifiers should be regenerated when authentication state changes where the session architecture
      requires it.
    </p>
  );
};

// An attacker should not be able to choose or fix the authenticated session
// identifier.
//
// Secure session management should:
//
// generate unpredictable identifiers,
// rotate identifiers at appropriate boundaries,
// reject invalid or unexpected session mechanisms,
// invalidate old sessions when required.

// ---------------------------------------------------------------------
// 58. Cookie security and token entropy
// ---------------------------------------------------------------------

interface SessionIdentifier {
  readonly value: string;
}

const sessionIdentifier: SessionIdentifier = {
  value: "opaque-random-session-identifier",
};

const SessionEntropyExample: FC = (): ReactElement => {
  return <p>Session identifiers should be generated with sufficient unpredictability.</p>;
};

// A cookie attribute cannot compensate for a predictable session identifier.
//
// The server-side session identifier itself must be generated using a
// cryptographically secure mechanism with sufficient entropy.

// ---------------------------------------------------------------------
// 59. Cookie security and sensitive responses
// ---------------------------------------------------------------------

const SensitiveResponseExample: FC = (): ReactElement => {
  return <p>Sensitive authenticated responses should use appropriate cache controls.</p>;
};

// Cookie security protects the session credential, but authenticated response
// data can also be sensitive.
//
// Consider:
//
// Cache-Control: no-store
//
// for responses containing highly sensitive information when persistent or
// shared caching would be inappropriate.

// ---------------------------------------------------------------------
// 60. Integrated secure session example
// ---------------------------------------------------------------------

interface Account {
  readonly id: string;
  readonly displayName: string;
}

interface AccountViewProps {
  readonly account: Account | null;
  readonly authenticated: boolean;
}

const AccountView: FC<AccountViewProps> = ({ account, authenticated }): ReactElement => {
  if (!authenticated || !account) {
    return (
      <section>
        <h2>Account</h2>
        <p>Sign in to continue.</p>
      </section>
    );
  }

  return (
    <section>
      <h2>Account</h2>
      <p>Signed in as {account.displayName}.</p>
      <p>The session credential remains outside the component's JavaScript state.</p>
    </section>
  );
};

const CookieSecurityDemo: FC = (): ReactElement => {
  const account: Account = {
    id: "user-123",
    displayName: "John Doe",
  };

  return <AccountView account={account} authenticated={true} />;
};

export default CookieSecurityDemo;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Cookies are browser-managed state commonly used for authentication sessions, preferences, and other application data.
// - Authentication cookies should be treated as security-sensitive credentials when they represent a session or other authority.
// - HttpOnly prevents JavaScript from directly reading the cookie value.
// - HttpOnly does not prevent XSS or malicious same-origin JavaScript from making authenticated requests.
// - Secure restricts cookie transmission to HTTPS requests, with browser-defined exceptions such as localhost.
// - SameSite controls whether cookies are sent with cross-site requests.
// - SameSite=Strict is the most restrictive SameSite policy.
// - SameSite=Lax permits a limited set of cross-site navigations.
// - SameSite=None permits cross-site cookie transmission and requires Secure.
// - SameSite is useful defense in depth against CSRF but should not automatically be treated as the only CSRF defense.
// - Omitting Domain creates a host-only cookie that is not intentionally shared with subdomains.
// - A Domain attribute can expand a cookie's scope to subdomains and should be used only when required.
// - Broad Domain scope can increase the trust boundary between applications on different subdomains.
// - Path controls which request paths receive a cookie but is not a JavaScript security boundary.
// - The __Secure- prefix requires Secure and an HTTPS secure origin.
// - The __Host- prefix requires Secure, Path=/, and no Domain attribute.
// - The __Host- prefix is useful for host-specific session cookies because it prevents parent-domain scoping.
// - Session cookies can be non-persistent when Max-Age and Expires are omitted.
// - Persistent cookies use Max-Age or Expires and should have an intentional lifetime.
// - Browser cookie expiration does not replace server-side session expiration and invalidation.
// - Logout should expire the authentication cookie and invalidate the corresponding server-side session.
// - Session identifiers should be rotated at appropriate authentication and privilege boundaries to reduce session fixation risk.
// - Session identifiers must be unpredictable; secure cookie attributes cannot compensate for weak credential generation.
// - A server-managed session can use an opaque identifier in an HttpOnly, Secure cookie while keeping session details on the server.
// - Cookies should contain only the information required by the chosen authentication architecture.
// - Do not store passwords in cookies.
// - Do not assume every cookie is secure merely because it uses the cookie mechanism.
// - Cookies used for authentication should have an explicit security policy covering scope, transport, JavaScript access, cross-site behavior, and lifetime.
// - Cookie-based authentication requires consideration of CSRF because browsers automatically attach applicable cookies to requests.
// - A CSRF token may intentionally be JavaScript-readable when the chosen CSRF defense requires the client to send it in a request header.
// - React cannot create an HttpOnly cookie because HttpOnly must be established by the server's Set-Cookie response.
// - React components can make authenticated requests without directly reading an HttpOnly session cookie.
// - Credentialed cross-origin requests require compatible CORS configuration, cookie attributes, and server policy.
// - Authentication cookies should not be unnecessarily shared with third-party contexts or unrelated subdomains.
// - Client-side application state should represent authentication status and user information without unnecessarily duplicating the session credential.
// - Server-side authorization must remain authoritative even when the authentication cookie is correctly protected.
// - Sensitive authenticated responses should use appropriate cache controls when they must not be stored by browsers or shared caches.
// - The actual Set-Cookie response should be inspected during security review to verify the final cookie policy.
// - A strong host-specific session-cookie baseline is typically __Host-, Secure, HttpOnly, an appropriate SameSite policy, and Path=/ with no Domain attribute.
