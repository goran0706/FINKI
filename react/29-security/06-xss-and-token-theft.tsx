/**
 * XSS and Token Theft
 * ====================
 *
 * Cross-Site Scripting (XSS) can become an authentication compromise when attacker-controlled
 * JavaScript gains access to credentials or can act within an authenticated browser session.
 * The impact depends on where credentials are stored and whether the browser exposes them to
 * JavaScript.
 *
 * HttpOnly cookies can prevent JavaScript from directly reading a session cookie, but they do
 * not prevent XSS itself or stop malicious JavaScript from making authenticated requests because
 * the browser can still attach an HttpOnly cookie to those requests. :contentReference[oaicite:0]{index=0}
 */

import { type FC, type ReactElement } from "react";

// ---------------------------------------------------------------------
// 1. XSS can become an authentication problem
// ---------------------------------------------------------------------

// Consider an application where an attacker manages to execute JavaScript
// in the application's origin.
//
// The injected code executes with the privileges available to JavaScript
// running in that origin.
//
// Depending on the application's architecture, that code may be able to:
//
// - read Web Storage,
// - access non-HttpOnly cookies,
// - read tokens exposed to JavaScript,
// - access application state,
// - make authenticated requests,
// - modify the visible application,
// - or capture information entered by the user.
//
// XSS is therefore not limited to displaying an unexpected message.

// ---------------------------------------------------------------------
// 2. Authentication tokens are high-value data
// ---------------------------------------------------------------------

interface AuthenticationState {
  readonly isAuthenticated: boolean;
  readonly accessToken?: string;
}

const AuthenticationStateExample: FC = (): ReactElement => {
  const state: AuthenticationState = {
    isAuthenticated: true,
  };

  return <p>{state.isAuthenticated ? "Authenticated" : "Signed out"}</p>;
};

// An access token represents authority to perform some authenticated
// operations. Its confidentiality therefore matters.
//
// The safest architecture is one that minimizes the amount of authentication
// material exposed to browser JavaScript.

// ---------------------------------------------------------------------
// 3. Token storage in localStorage
// ---------------------------------------------------------------------

const LocalStorageTokenExample: FC = (): ReactElement => {
  const storageKey = "access-token";

  return <p>Token storage key: {storageKey}</p>;
};

// A common pattern is:
//
// localStorage.setItem("access-token", accessToken);
//
// This makes the token directly accessible to JavaScript running on the
// origin:
//
// const token = localStorage.getItem("access-token");
//
// Therefore, if an XSS vulnerability allows attacker-controlled JavaScript
// to execute in the same origin, the token can be exposed.
//
// OWASP explicitly advises against storing authentication tokens, session IDs,
// JWTs, or refresh tokens in localStorage or sessionStorage because those
// values are accessible to JavaScript on the origin. :contentReference[oaicite:1]{index=1}

// ---------------------------------------------------------------------
// 4. sessionStorage has the same JavaScript-access issue
// ---------------------------------------------------------------------

const SessionStorageTokenExample: FC = (): ReactElement => {
  const storageKey = "access-token";

  return <p>Session storage key: {storageKey}</p>;
};

// sessionStorage is also accessible to JavaScript:
//
// sessionStorage.getItem("access-token");
//
// Its lifetime and storage behavior differ from localStorage, but that does
// not change the central XSS concern:
//
// JavaScript running in the origin can access the stored token.
//
// Storage lifetime is therefore not the same thing as credential isolation.

// ---------------------------------------------------------------------
// 5. HttpOnly cookies
// ---------------------------------------------------------------------

// A session cookie can instead be created by the server:
//
// Set-Cookie:
//     __Host-session=SESSION_VALUE;
//     Path=/;
//     Secure;
//     HttpOnly;
//     SameSite=Lax
//
// `HttpOnly` prevents JavaScript from reading the cookie through APIs such as
// `document.cookie`. :contentReference[oaicite:2]{index=2}
//
// The browser can still send the cookie with requests to the appropriate
// server because HttpOnly controls script access to the cookie value, not
// normal cookie transmission.

// ---------------------------------------------------------------------
// 6. HttpOnly does not prevent XSS
// ---------------------------------------------------------------------

const HttpOnlyExplanation: FC = (): ReactElement => {
  return (
    <section>
      <h2>HttpOnly</h2>
      <p>HttpOnly protects cookie confidentiality from JavaScript.</p>
    </section>
  );
};

// This distinction is critical:
//
// XSS
//   ↓
// JavaScript executes
//
// HttpOnly
//   ↓
// JavaScript cannot directly read the session cookie
//
// HttpOnly therefore mitigates token theft through direct cookie reads, but
// it does not remove the XSS vulnerability itself. OWASP notes that an XSS
// attack can still issue requests that include the session cookie. :contentReference[oaicite:3]{index=3}

// ---------------------------------------------------------------------
// 7. Authenticated requests with HttpOnly cookies
// ---------------------------------------------------------------------

const AuthenticatedRequestExample: FC = (): ReactElement => {
  return <p>The browser can attach an HttpOnly session cookie to an appropriate authenticated request.</p>;
};

// Conceptually:
//
// fetch("/api/account");
//
// If the request is made in the appropriate cookie context, the browser may
// attach the session cookie automatically.
//
// JavaScript does not need to read the cookie value to make the request.
//
// This is why HttpOnly prevents direct credential extraction but does not
// prevent every consequence of XSS.

// ---------------------------------------------------------------------
// 8. Direct token theft versus session abuse
// ---------------------------------------------------------------------

// There are two different outcomes to distinguish:
//
// Direct token theft:
//     attacker reads a token and obtains the credential value.
//
// Session abuse:
//     attacker-controlled code uses the victim's authenticated browser
//     to perform actions while the browser supplies its credentials.
//
// HttpOnly can prevent the first case for the session cookie itself, but it
// does not automatically prevent the second case.

// ---------------------------------------------------------------------
// 9. Bearer tokens exposed to JavaScript
// ---------------------------------------------------------------------

interface ApiRequestProps {
  readonly accessToken: string;
}

const BearerTokenExample: FC<ApiRequestProps> = ({ accessToken }): ReactElement => {
  const authorization = `Bearer ${accessToken}`;

  return <code>{authorization}</code>;
};

// A JavaScript-accessible bearer token may be placed in an Authorization
// header:
//
// fetch("/api/account", {
//     headers: {
//         Authorization: `Bearer ${accessToken}`,
//     },
// });
//
// If the token is available to application JavaScript, XSS executing in the
// same origin may also be able to access that token.

// ---------------------------------------------------------------------
// 10. Do not render tokens
// ---------------------------------------------------------------------

interface TokenDisplayProps {
  readonly token: string;
}

const UnsafeTokenDisplay: FC<TokenDisplayProps> = ({ token }): ReactElement => {
  return <code>{token}</code>;
};

// Authentication tokens should not be rendered into the UI unless there is
// an exceptional, explicit requirement to do so.
//
// Once a secret is placed into rendered application state or DOM content,
// other scripts and browser tooling may have additional opportunities to
// observe it.

// ---------------------------------------------------------------------
// 11. Avoid exposing tokens through global state
// ---------------------------------------------------------------------

interface AuthContextValue {
  readonly accessToken: string | null;
}

const authState: AuthContextValue = {
  accessToken: null,
};

// React context and other JavaScript state are accessible to JavaScript
// running in the same application.
//
// Therefore, putting a credential into React context does not make that
// credential inaccessible to XSS.
//
// Context is a state-management mechanism, not a security boundary.

// ---------------------------------------------------------------------
// 12. HttpOnly session architecture
// ---------------------------------------------------------------------

interface SessionStatusProps {
  readonly authenticated: boolean;
}

const SessionStatus: FC<SessionStatusProps> = ({ authenticated }): ReactElement => {
  return <p>{authenticated ? "Signed in" : "Signed out"}</p>;
};

// With a cookie-based session architecture:
//
// Browser
//    │
//    │ authenticated request
//    ▼
// Server
//    │
//    └── validates HttpOnly session cookie
//
// The React application does not need to read the session identifier.
//
// This reduces the amount of credential material directly exposed to
// browser JavaScript.

// ---------------------------------------------------------------------
// 13. Secure cookie attributes
// ---------------------------------------------------------------------

// A sensitive session cookie commonly uses:
//
// Set-Cookie:
//     __Host-session=SESSION_VALUE;
//     Path=/;
//     Secure;
//     HttpOnly;
//     SameSite=Lax
//
// `Secure` limits transmission to HTTPS connections.
// `HttpOnly` prevents JavaScript access.
// `SameSite` controls when the browser sends the cookie in cross-site
// contexts. :contentReference[oaicite:4]{index=4}
//
// The exact SameSite policy depends on the application's architecture.

// ---------------------------------------------------------------------
// 14. SameSite is not an XSS defense
// ---------------------------------------------------------------------

// `SameSite` primarily controls cross-site cookie transmission.
//
// It does not prevent malicious JavaScript that is already executing in the
// application's own origin from making same-site requests.
//
// Therefore:
//
// SameSite
//    ≠
// XSS prevention
//
// It is a separate browser security control and can also contribute to CSRF
// defenses. :contentReference[oaicite:5]{index=5}

// ---------------------------------------------------------------------
// 15. Secure is not an XSS defense
// ---------------------------------------------------------------------

// `Secure` protects cookie transmission by requiring HTTPS, but it does not
// prevent JavaScript from reading a cookie.
//
// For example:
//
// Secure
//    + no HttpOnly
//
// does not prevent:
//
// document.cookie
//
// from accessing a cookie that is otherwise script-readable.
//
// MDN specifically distinguishes `Secure` from `HttpOnly`: Secure protects
// transmission, while HttpOnly prevents JavaScript access. :contentReference[oaicite:6]{index=6}

// ---------------------------------------------------------------------
// 16. Token theft from Web Storage
// ---------------------------------------------------------------------

const WebStorageWarning: FC = (): ReactElement => {
  return (
    <section>
      <h2>Credential exposure</h2>
      <p>Browser JavaScript can access Web Storage belonging to its origin.</p>
    </section>
  );
};

// If an access token is stored as:
//
// localStorage.setItem("access-token", accessToken);
//
// then code executing in the same origin can potentially read it:
//
// localStorage.getItem("access-token");
//
// This is why an XSS vulnerability can directly expose credentials stored
// in Web Storage. OWASP explicitly warns against storing authentication
// credentials there. :contentReference[oaicite:7]{index=7}

// ---------------------------------------------------------------------
// 17. XSS can steal application data without stealing a token
// ---------------------------------------------------------------------

// An attacker does not necessarily need the raw session credential.
//
// XSS may also target:
//
// - profile information,
// - account data already rendered in the page,
// - form input,
// - CSRF tokens exposed to JavaScript,
// - API responses,
// - application state,
// - one-time codes,
// - other secrets accessible to the page.
//
// Therefore, "the token is HttpOnly" does not mean "XSS has no impact."

// ---------------------------------------------------------------------
// 18. XSS can perform authenticated actions
// ---------------------------------------------------------------------

const AccountActions: FC = (): ReactElement => {
  return (
    <section>
      <button type="button">Update profile</button>
      <button type="button">Change settings</button>
    </section>
  );
};

// If attacker-controlled JavaScript executes in the authenticated origin,
// it may be able to interact with application functionality available to the
// victim's session.
//
// This can include making requests or invoking application actions.
//
// The browser may attach an HttpOnly cookie automatically, even though the
// injected script cannot read its value. :contentReference[oaicite:8]{index=8}

// ---------------------------------------------------------------------
// 19. CSRF and XSS are different threats
// ---------------------------------------------------------------------

// CSRF abuses the browser's automatic credential attachment from a different
// site.
//
// XSS executes code inside the application's own origin.
//
// An important security relationship is:
//
// XSS
//  ↓
// can often defeat assumptions made by CSRF defenses
//
// For example, malicious same-origin JavaScript can often make requests in
// the authenticated browser context and can potentially access CSRF tokens
// that are exposed to JavaScript.
//
// Therefore, CSRF protection should still be implemented correctly, but it
// should not be considered a substitute for XSS prevention.

// ---------------------------------------------------------------------
// 20. HttpOnly and CSRF
// ---------------------------------------------------------------------

const CookieBasedSession: FC = (): ReactElement => {
  return <p>The server authenticates requests using a session cookie.</p>;
};

// An HttpOnly cookie protects the cookie value from JavaScript.
//
// It does not prevent the browser from sending the cookie with requests.
//
// Consequently, applications using cookie-based authentication may still
// need CSRF defenses appropriate to their request architecture.
//
// `SameSite` can provide some CSRF protection, but the correct defense depends
// on the application's cross-site request requirements. :contentReference[oaicite:9]{index=9}

// ---------------------------------------------------------------------
// 21. Short-lived credentials
// ---------------------------------------------------------------------

interface CredentialPolicyProps {
  readonly lifetime: string;
}

const CredentialPolicy: FC<CredentialPolicyProps> = ({ lifetime }): ReactElement => {
  return <p>Credential lifetime: {lifetime}</p>;
};

// Limiting credential lifetime reduces the window in which a stolen credential
// can remain useful.
//
// This does not prevent XSS, but it can reduce the impact of credential
// compromise.
//
// Session management should also support server-side invalidation when
// appropriate.

// ---------------------------------------------------------------------
// 22. Token rotation
// ---------------------------------------------------------------------

// Applications can rotate credentials so that long-lived credentials are not
// continuously reused.
//
// For example:
//
// login
//   ↓
// session credential
//   ↓
// authenticated use
//   ↓
// rotation / renewal
//
// The exact rotation model depends on the authentication protocol and
// application architecture.
//
// Rotation reduces the useful lifetime of individual credentials but does not
// replace XSS prevention.

// ---------------------------------------------------------------------
// 23. Minimize token exposure
// ---------------------------------------------------------------------

const MinimizedCredentialExposure: FC = (): ReactElement => {
  return (
    <section>
      <h2>Credential minimization</h2>
      <p>Keep authentication material out of client-readable state when the architecture does not require it there.</p>
    </section>
  );
};

// A useful security principle is:
//
// Do not expose a secret to a component or browser API unless that component
// or API actually needs the secret.
//
// Minimizing exposure reduces the number of places an XSS vulnerability can
// obtain sensitive information.

// ---------------------------------------------------------------------
// 24. Access tokens versus refresh tokens
// ---------------------------------------------------------------------

// Access tokens and refresh tokens have different lifetimes and purposes.
//
// A refresh token can often have a much greater security impact because it
// can be exchanged for additional access tokens.
//
// Therefore, exposing a refresh token to arbitrary browser JavaScript can
// create a particularly significant credential risk.
//
// The storage and lifecycle design should follow the authentication protocol
// and threat model rather than assuming all tokens are equivalent.

// ---------------------------------------------------------------------
// 25. Backend-for-Frontend architecture
// ---------------------------------------------------------------------

// A Backend-for-Frontend (BFF) can keep upstream access and refresh tokens
// on the server.
//
// Conceptually:
//
// Browser
//    │
//    │ HttpOnly session cookie
//    ▼
// BFF
//    │
//    │ server-side credential
//    ▼
// API
//
// The browser does not need direct access to the upstream token.
//
// This can reduce credential exposure to browser JavaScript, although an XSS
// vulnerability can still abuse the authenticated browser session.

// ---------------------------------------------------------------------
// 26. Do not assume a cookie eliminates XSS risk
// ---------------------------------------------------------------------

const CookieDoesNotPreventXss: FC = (): ReactElement => {
  return (
    <section>
      <h2>Defense in depth</h2>
      <p>HttpOnly cookies reduce direct token theft but do not remove the need to prevent XSS.</p>
    </section>
  );
};

// A secure session architecture should combine:
//
// - safe React rendering,
// - HTML sanitization when required,
// - URL validation,
// - Content Security Policy,
// - secure cookie configuration,
// - CSRF protection where applicable,
// - server-side authorization,
// - and appropriate session management.

// ---------------------------------------------------------------------
// 27. React escaping still matters
// ---------------------------------------------------------------------

interface CommentProps {
  readonly comment: string;
}

const SafeComment: FC<CommentProps> = ({ comment }): ReactElement => {
  return <p>{comment}</p>;
};

// Normal JSX rendering keeps the comment in a text context.
//
// This should remain the default for untrusted text.
//
// HttpOnly cookies are not a replacement for safe rendering.

// ---------------------------------------------------------------------
// 28. Avoid raw HTML for user content
// ---------------------------------------------------------------------

const UnsafeComment: FC<CommentProps> = ({ comment }): ReactElement => {
  return <div dangerouslySetInnerHTML={{ __html: comment }} />;
};

// If `comment` is attacker-controlled, this creates an XSS boundary.
//
// An XSS vulnerability in a page that handles authenticated sessions can
// have consequences beyond the affected piece of UI.

// ---------------------------------------------------------------------
// 29. Sanitized rich text
// ---------------------------------------------------------------------

interface RichTextProps {
  readonly sanitizedHtml: string;
}

const SanitizedComment: FC<RichTextProps> = ({ sanitizedHtml }): ReactElement => {
  return <div dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />;
};

// When rich HTML is genuinely required, the HTML should pass through a
// dedicated sanitization process before reaching this component.
//
// The component should not assume that every arbitrary string is safe merely
// because its type is `string`.

// ---------------------------------------------------------------------
// 30. Content Security Policy
// ---------------------------------------------------------------------

// A Content Security Policy can provide defense in depth against some forms
// of script injection.
//
// A strict policy can restrict which scripts the browser is permitted to
// execute.
//
// CSP does not make unsafe HTML safe, but it can reduce the impact of some
// XSS vulnerabilities.
//
// CSP should therefore complement, not replace:
//
// - safe JSX rendering,
// - HTML sanitization,
// - URL validation,
// - secure session design.

// ---------------------------------------------------------------------
// 31. Dependency and supply-chain risk
// ---------------------------------------------------------------------

// XSS can also enter an application through vulnerable or compromised
// dependencies.
//
// Security therefore includes:
//
// - dependency updates,
// - vulnerability monitoring,
// - review of third-party packages,
// - minimizing unnecessary dependencies,
// - and appropriate integrity controls.
//
// A CSP cannot make a compromised script from an explicitly trusted source
// harmless.

// ---------------------------------------------------------------------
// 32. Same-origin privilege
// ---------------------------------------------------------------------

// Browser security is based heavily on origins.
//
// JavaScript executing under the application's origin generally operates
// within that origin's authority, subject to browser security controls.
//
// This is why an XSS vulnerability is particularly serious:
//
// trusted application origin
//          ↓
// attacker-controlled JavaScript
//          ↓
// application privileges
//
// The attacker does not need to break the browser's same-origin policy if
// their code is already executing inside the trusted origin.

// ---------------------------------------------------------------------
// 33. Token theft is not the only authentication impact
// ---------------------------------------------------------------------

interface AccountInformation {
  readonly email: string;
  readonly displayName: string;
}

const AccountInformationExample: FC = (): ReactElement => {
  const account: AccountInformation = {
    email: "john.doe@example.com",
    displayName: "John Doe",
  };

  return (
    <section>
      <p>{account.displayName}</p>
      <p>{account.email}</p>
    </section>
  );
};

// XSS can expose data that the application already made available to the
// authenticated page.
//
// This means security review should consider:
//
// "What can code executing in this origin access?"
//
// rather than only:
//
// "Can JavaScript read the session cookie?"

// ---------------------------------------------------------------------
// 34. Security boundary comparison
// ---------------------------------------------------------------------

// Client-readable token:
//
// token
//   ↓
// localStorage / JavaScript state
//   ↓
// application JavaScript
//
// XSS
//   ↓
// potentially reads token
//
// HttpOnly session cookie:
//
// session cookie
//   ↓
// browser cookie store
//   ↓
// server request
//
// XSS
//   ↓
// cannot directly read cookie value
//   ↓
// may still make authenticated requests
//
// This distinction is central to understanding XSS and authentication.

// ---------------------------------------------------------------------
// 35. Authentication state without exposing credentials
// ---------------------------------------------------------------------

interface AuthenticatedViewProps {
  readonly userName: string;
}

const AuthenticatedView: FC<AuthenticatedViewProps> = ({ userName }): ReactElement => {
  return (
    <section>
      <h2>Welcome, {userName}</h2>
      <p>Your session is active.</p>
    </section>
  );
};

// The UI can receive non-secret account information without receiving the
// session credential itself.
//
// Keeping authentication material outside ordinary React props and state can
// reduce unnecessary credential exposure.

// ---------------------------------------------------------------------
// 36. Server-side authorization remains mandatory
// ---------------------------------------------------------------------

interface ProtectedActionProps {
  readonly actionName: string;
}

const ProtectedAction: FC<ProtectedActionProps> = ({ actionName }): ReactElement => {
  return <button type="button">{actionName}</button>;
};

// The presence of a button in the UI is not authorization.
//
// The server must verify authorization for the corresponding operation.
//
// If an attacker can trigger an authenticated request, server-side
// authorization must still prevent actions the authenticated user is not
// permitted to perform.

// ---------------------------------------------------------------------
// 37. XSS prevention layers
// ---------------------------------------------------------------------

// A layered architecture can look like:
//
// untrusted input
//      ↓
// validation
//      ↓
// safe React rendering / sanitization
//      ↓
// CSP defense in depth
//      ↓
// secure session cookie
//      ↓
// server-side authorization
//
// Each layer addresses a different part of the threat model.
//
// No individual control should be treated as sufficient for the complete
// security problem.

// ---------------------------------------------------------------------
// 38. Integrated example
// ---------------------------------------------------------------------

interface DashboardProps {
  readonly userName: string;
}

const Dashboard: FC<DashboardProps> = ({ userName }): ReactElement => {
  return (
    <section>
      <h1>Dashboard</h1>
      <p>Welcome, {userName}</p>
    </section>
  );
};

const XssAndTokenTheftDemo: FC = (): ReactElement => {
  const user = {
    userName: "John Doe",
  };

  return <Dashboard userName={user.userName} />;
};

// In a cookie-based session architecture, the dashboard does not need to
// receive the session identifier as a prop.
//
// The browser and server can manage authentication independently from the
// React component's display state.
//
// This reduces the amount of credential material exposed to application
// JavaScript.

// ---------------------------------------------------------------------
// 39. Security review checklist
// ---------------------------------------------------------------------

// When evaluating XSS and authentication together, ask:
//
// 1. Can attacker-controlled JavaScript execute in the application's origin?
// 2. Are access or refresh tokens stored in localStorage or sessionStorage?
// 3. Are authentication credentials exposed through React state or props?
// 4. Are session cookies marked HttpOnly?
// 5. Are sensitive cookies marked Secure?
// 6. Is an appropriate SameSite policy configured?
// 7. Can XSS make authenticated requests even when cookies are HttpOnly?
// 8. Are CSRF defenses appropriate for the authentication architecture?
// 9. Are server-side authorization checks enforced for every protected action?
// 10. Is a Content Security Policy used as defense in depth?
// 11. Are rich HTML and URL inputs handled by appropriate security boundaries?
// 12. Are authentication credentials exposed only where genuinely necessary?

// ---------------------------------------------------------------------
// 40. Practical guidance
// ---------------------------------------------------------------------

// The key architectural goal is to minimize what XSS can obtain and what
// authenticated browser code can do.
//
// Prefer:
//
// - normal JSX for untrusted text,
// - dedicated sanitization for required rich HTML,
// - explicit URL validation,
// - HttpOnly and Secure session cookies,
// - an appropriate SameSite policy,
// - short-lived and properly managed credentials,
// - server-side authorization,
// - CSRF protection where applicable,
// - Content Security Policy,
// - and careful dependency management.
//
// HttpOnly is particularly important for session cookies because it prevents
// JavaScript from directly reading the session identifier. It does not,
// however, make XSS harmless or prevent authenticated requests made by
// malicious same-origin JavaScript. :contentReference[oaicite:10]{index=10}

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - XSS can become an authentication compromise when attacker-controlled JavaScript executes in the application's origin.
// - Authentication tokens stored in localStorage or sessionStorage are directly accessible to JavaScript and can therefore be exposed by XSS.
// - HttpOnly prevents JavaScript from directly reading an HttpOnly cookie.
// - HttpOnly does not prevent XSS itself or prevent authenticated requests made by malicious same-origin JavaScript.
// - Secure protects cookie transmission over HTTPS but does not prevent JavaScript from reading a cookie without HttpOnly.
// - SameSite controls cross-site cookie transmission and can contribute to CSRF protection, but it is not an XSS defense.
// - Direct token theft and authenticated session abuse are different XSS outcomes.
// - XSS can expose application data, form input, API responses, and other secrets even when the session cookie itself is HttpOnly.
// - Keeping authentication credentials out of React props, context, and ordinary client-readable state reduces credential exposure.
// - A Backend-for-Frontend architecture can keep upstream credentials on the server and expose only a browser session.
// - Short credential lifetimes and appropriate rotation can reduce the impact of credential compromise.
// - Server-side authorization remains mandatory even when authentication uses secure cookies.
// - CSRF protection remains relevant to cookie-based authentication because HttpOnly cookies are still automatically attached to appropriate requests.
// - React's normal JSX escaping remains an important XSS defense and is not replaced by secure authentication storage.
// - HTML sanitization is required when trusted rich HTML must be rendered through `dangerouslySetInnerHTML`.
// - Content Security Policy can provide defense in depth but does not replace XSS prevention or secure session design.
// - The security goal is not merely to prevent token theft; it is to minimize what XSS can access and what attacker-controlled code can do.

export default XssAndTokenTheftDemo;
