/**
 * Token Exposure Risks
 * =====================
 *
 * Authentication tokens are credentials that can grant access to protected resources or
 * represent an authenticated session. Token exposure occurs when credentials become accessible
 * to unauthorized code, users, systems, logs, URLs, browser storage, or other unintended
 * recipients.
 *
 * React applications should minimize token exposure by keeping credentials out of unnecessary
 * client-readable state and by ensuring that protected operations remain server-authoritative.
 */

import { type FC, type ReactElement } from "react";

// ---------------------------------------------------------------------
// 1. What is a token?
// ---------------------------------------------------------------------

// A token is a credential or security artifact that can be presented to a
// server or identity provider.
//
// Examples include:
//
// - access tokens,
// - refresh tokens,
// - ID tokens,
// - session identifiers,
// - password-reset tokens,
// - email-verification tokens.
//
// Possession of some token types can be sufficient to perform authenticated
// operations, so they must be treated as sensitive.

// ---------------------------------------------------------------------
// 2. Token exposure
// ---------------------------------------------------------------------

// Token exposure occurs when a credential becomes available somewhere it
// should not be available.
//
// Common exposure locations include:
//
// browser storage
// URLs
// logs
// error reports
// analytics
// source code
// HTML
// React state
// browser extensions
// third-party scripts
// network traces
//
// The security impact depends on the type of credential and what an attacker
// can do with it.

// ---------------------------------------------------------------------
// 3. Access tokens
// ---------------------------------------------------------------------

interface AccessToken {
  readonly value: string;
  readonly expiresAt: number;
}

const accessToken: AccessToken = {
  value: "example-access-token",
  expiresAt: Date.now() + 300_000,
};

const AccessTokenExample: FC = (): ReactElement => {
  return <p>Access token expires at {accessToken.expiresAt}.</p>;
};

// An access token can authorize requests to protected resources.
//
// Because the token itself may grant access, exposing it can allow an attacker
// to use the token until it expires or is otherwise revoked.

// ---------------------------------------------------------------------
// 4. Refresh tokens
// ---------------------------------------------------------------------

interface RefreshToken {
  readonly value: string;
}

const refreshToken: RefreshToken = {
  value: "example-refresh-token",
};

const RefreshTokenExample: FC = (): ReactElement => {
  return <p>Refresh credentials require strong protection.</p>;
};

// Refresh tokens can often be used to obtain new access credentials.
//
// Their longer lifetime can make exposure particularly significant.
//
// Refresh tokens should therefore receive strong protection, appropriate
// rotation, expiration, and revocation controls.

// ---------------------------------------------------------------------
// 5. ID tokens
// ---------------------------------------------------------------------

interface IdentityToken {
  readonly value: string;
  readonly issuer: string;
}

const identityToken: IdentityToken = {
  value: "example-id-token",
  issuer: "https://example.com",
};

const IdentityTokenExample: FC = (): ReactElement => {
  return <p>Identity token issuer: {identityToken.issuer}</p>;
};

// An ID token is an identity assertion used by OpenID Connect.
//
// It is not simply a general-purpose API access token.
//
// Applications should use tokens according to the protocol and purpose for
// which they were issued.

// ---------------------------------------------------------------------
// 6. Session identifiers are credentials too
// ---------------------------------------------------------------------

interface SessionCredential {
  readonly sessionId: string;
}

const sessionCredential: SessionCredential = {
  sessionId: "opaque-session-identifier",
};

const SessionCredentialExample: FC = (): ReactElement => {
  return <p>Session credentials should remain protected from unnecessary exposure.</p>;
};

// A session identifier can authenticate a request even though it may not look
// like a conventional access token.
//
// Therefore, session IDs should be treated as credentials and protected from
// disclosure in the same way as other authentication secrets.

// ---------------------------------------------------------------------
// 7. Token exposure through localStorage
// ---------------------------------------------------------------------

const LocalStorageExposureExample: FC = (): ReactElement => {
  return (
    <section>
      <h2>Client-readable storage</h2>
      <p>Authentication credentials stored in localStorage are accessible to JavaScript running in the page.</p>
    </section>
  );
};

// This pattern exposes the credential to JavaScript:
//
// localStorage.setItem("accessToken", token);
//
// Any script executing in the page with access to the origin's storage can
// potentially read the value.
//
// XSS therefore becomes a direct token-extraction risk when sensitive
// credentials are stored in client-readable browser storage.

// ---------------------------------------------------------------------
// 8. Token exposure through sessionStorage
// ---------------------------------------------------------------------

const SessionStorageExposureExample: FC = (): ReactElement => {
  return (
    <section>
      <h2>Session storage</h2>
      <p>sessionStorage is also readable by JavaScript in the page.</p>
    </section>
  );
};

// sessionStorage differs from localStorage in lifetime and storage behavior,
// but it does not provide isolation from JavaScript running in the same page.
//
// Therefore:
//
// sessionStorage
//     ≠
// secure authentication storage

// ---------------------------------------------------------------------
// 9. Token exposure through React state
// ---------------------------------------------------------------------

interface TokenStateProps {
  readonly accessToken: string | null;
}

const TokenStateExample: FC<TokenStateProps> = ({ accessToken }): ReactElement => {
  return <p>Token available: {accessToken !== null ? "Yes" : "No"}</p>;
};

// React state is readable by the application's JavaScript.
//
// Keeping a token in:
//
// useState(token)
//
// does not make the token inaccessible to JavaScript.
//
// It can also increase the number of application components that can access
// the credential if that state is passed through props or context.

// ---------------------------------------------------------------------
// 10. Token exposure through React context
// ---------------------------------------------------------------------

interface AuthenticationContextValue {
  readonly userId: string | null;
  readonly accessToken: string | null;
}

const authenticationContext: AuthenticationContextValue = {
  userId: "user-123",
  accessToken: null,
};

const TokenContextExample: FC = (): ReactElement => {
  return <p>Authentication context available.</p>;
};

// Context is a state-distribution mechanism.
//
// It does not create a security boundary.
//
// If a token is placed into context, components with access to that context
// can access the token.

// ---------------------------------------------------------------------
// 11. Prefer HttpOnly cookies when the architecture permits
// ---------------------------------------------------------------------

const HttpOnlyCookieExample: FC = (): ReactElement => {
  return (
    <section>
      <h2>HttpOnly session cookie</h2>
      <p>An HttpOnly cookie prevents application JavaScript from directly reading the session credential.</p>
    </section>
  );
};

// A server-managed session can store its identifier in an HttpOnly cookie.
//
// The browser can automatically include the cookie in applicable requests:
//
// fetch("/api/account");
//
// JavaScript does not need to retrieve the session ID first.
//
// This can reduce direct credential exposure to application JavaScript.

// ---------------------------------------------------------------------
// 12. HttpOnly is not an XSS defense
// ---------------------------------------------------------------------

const HttpOnlyXssExample: FC = (): ReactElement => {
  return <p>HttpOnly reduces direct cookie theft but does not prevent XSS.</p>;
};

// HttpOnly prevents:
//
// document.cookie
//     ↓
// reading the protected cookie value
//
// It does not prevent malicious JavaScript from executing in the page.
//
// If an attacker controls same-origin JavaScript, that code may still be able
// to make authenticated requests that cause the browser to send applicable
// cookies.

// ---------------------------------------------------------------------
// 13. Token exposure through URLs
// ---------------------------------------------------------------------

interface CallbackUrlProps {
  readonly code: string | null;
}

const CallbackUrlExample: FC<CallbackUrlProps> = ({ code }): ReactElement => {
  return <p>Authentication response received: {code ? "Yes" : "No"}</p>;
};

// Sensitive credentials should generally not be placed in URLs.
//
// URLs can appear in:
//
// - browser history,
// - server logs,
// - reverse-proxy logs,
// - analytics systems,
// - monitoring tools,
// - referrer information,
// - screenshots,
// - copied links.
//
// Authentication protocols should define how authorization responses and
// credentials are transported and handled.

// ---------------------------------------------------------------------
// 14. Authorization code versus access token
// ---------------------------------------------------------------------

interface AuthorizationCode {
  readonly value: string;
}

const authorizationCode: AuthorizationCode = {
  value: "example-authorization-code",
};

const AuthorizationCodeExample: FC = (): ReactElement => {
  return <p>Authorization codes are protocol artifacts, not general-purpose API credentials.</p>;
};

// An authorization code is different from an access token.
//
// In OAuth authorization-code flows, the code is exchanged for tokens through
// the appropriate protocol flow.
//
// Protocol parameters such as state, redirect URI, and PKCE must also be
// handled according to the identity provider's requirements.

// ---------------------------------------------------------------------
// 15. Token exposure through logs
// ---------------------------------------------------------------------

const TokenLoggingExample: FC = (): ReactElement => {
  return <p>Authentication credentials should not be written to application logs.</p>;
};

// Avoid patterns such as:
//
// console.log(accessToken)
// console.error("Authentication failed", token)
// logger.info({token})
//
// Tokens can end up in:
//
// - application logs,
// - centralized logging systems,
// - debugging dashboards,
// - support tools,
// - crash reports.
//
// Logging a credential can turn a temporary application issue into a
// persistent credential-disclosure problem.

// ---------------------------------------------------------------------
// 16. Token exposure through error reporting
// ---------------------------------------------------------------------

interface ErrorReport {
  readonly message: string;
  readonly requestPath: string;
}

const errorReport: ErrorReport = {
  message: "Request failed",
  requestPath: "/api/account",
};

const ErrorReportingExample: FC = (): ReactElement => {
  return <p>Error reports should contain only information necessary for debugging.</p>;
};

// Error-reporting systems can automatically capture:
//
// - request URLs,
// - component state,
// - exception objects,
// - request metadata,
// - browser information.
//
// Sensitive authentication material should be excluded from telemetry and
// error reports.

// ---------------------------------------------------------------------
// 17. Token exposure through query parameters
// ---------------------------------------------------------------------

interface SearchParamsExampleProps {
  readonly query: string;
}

const SearchParamsExample: FC<SearchParamsExampleProps> = ({ query }): ReactElement => {
  return <p>Search query: {query}</p>;
};

// Query parameters are appropriate for ordinary search or navigation data,
// but they are generally a poor location for long-lived authentication
// credentials.
//
// A credential in:
//
// ?token=example-token
//
// may be exposed to systems that record the URL.

// ---------------------------------------------------------------------
// 18. Token exposure through fragments
// ---------------------------------------------------------------------

interface FragmentExampleProps {
  readonly fragment: string;
}

const FragmentExample: FC<FragmentExampleProps> = ({ fragment }): ReactElement => {
  return <p>Fragment received: {fragment}</p>;
};

// URL fragments are not sent as part of the HTTP request to the server, but
// they are available to browser-side JavaScript.
//
// Therefore, a credential in a fragment is still accessible to page scripts.
//
// Modern OAuth guidance generally favors authorization-code flows with PKCE
// rather than placing access tokens directly in browser URL fragments.

// ---------------------------------------------------------------------
// 19. Token exposure through source code
// ---------------------------------------------------------------------

const SourceCodeExposureExample: FC = (): ReactElement => {
  return <p>Secrets must not be embedded in client-side source code.</p>;
};

// This is not secret:
//
// const publicConfiguration = "example";
//
// This is not a safe location for a secret:
//
// const accessToken = "real-production-token";
//
// Anything shipped to browser JavaScript should be assumed to be accessible
// to the user and to code executing in that browser context.

// ---------------------------------------------------------------------
// 20. Environment variables are not automatically secret
// ---------------------------------------------------------------------

interface ClientConfiguration {
  readonly apiBaseUrl: string;
}

const clientConfiguration: ClientConfiguration = {
  apiBaseUrl: "https://example.com/api",
};

const ClientConfigurationExample: FC = (): ReactElement => {
  return <p>Client configuration can be public because it is delivered to the browser.</p>;
};

// A build-time environment variable does not become secret merely because it
// is called an "environment variable".
//
// If its value is embedded into a browser bundle, users can inspect it.
//
// Therefore:
//
// server-only environment variable
//     → can contain secrets
//
// client-exposed environment variable
//     → must be treated as public

// ---------------------------------------------------------------------
// 21. Public configuration versus secrets
// ---------------------------------------------------------------------

interface PublicConfiguration {
  readonly apiBaseUrl: string;
  readonly applicationName: string;
}

const publicConfiguration: PublicConfiguration = {
  apiBaseUrl: "https://example.com/api",
  applicationName: "Example Application",
};

const PublicConfigurationExample: FC = (): ReactElement => {
  return <p>Application: {publicConfiguration.applicationName}</p>;
};

// Values required by browser code are not secret merely because they originate
// from a deployment configuration system.
//
// Client-visible configuration should contain only values safe to disclose.

// ---------------------------------------------------------------------
// 22. Token exposure through third-party scripts
// ---------------------------------------------------------------------

const ThirdPartyScriptExample: FC = (): ReactElement => {
  return (
    <section>
      <h2>Third-party code</h2>
      <p>
        Third-party JavaScript executes within the application's browser security context according to the page's
        policies.
      </p>
    </section>
  );
};

// Third-party scripts can introduce additional code into the application.
//
// If sensitive credentials are accessible to page JavaScript, any compromised
// third-party script may increase the credential's exposure.
//
// Minimize unnecessary third-party code and apply controls such as Content
// Security Policy and Subresource Integrity where appropriate.

// ---------------------------------------------------------------------
// 23. Token exposure through analytics
// ---------------------------------------------------------------------

interface AnalyticsEvent {
  readonly eventName: string;
  readonly page: string;
}

const analyticsEvent: AnalyticsEvent = {
  eventName: "account-viewed",
  page: "/account",
};

const AnalyticsExample: FC = (): ReactElement => {
  return <p>Analytics event: {analyticsEvent.eventName}</p>;
};

// Analytics payloads should not contain:
//
// accessToken
// refreshToken
// sessionId
// password
//
// Authentication credentials should not be included merely because an
// analytics system accepts arbitrary event properties.

// ---------------------------------------------------------------------
// 24. Token exposure through referrer data
// ---------------------------------------------------------------------

const ReferrerExposureExample: FC = (): ReactElement => {
  return <p>Sensitive credentials should not be placed in URLs that may become referrer data.</p>;
};

// A sensitive value in a URL can potentially become available to another
// system through URL-derived metadata.
//
// Avoid putting authentication credentials into URLs in the first place rather
// than relying solely on referrer-policy configuration.

// ---------------------------------------------------------------------
// 25. Token exposure through browser history
// ---------------------------------------------------------------------

interface HistoryExampleProps {
  readonly path: string;
}

const HistoryExample: FC<HistoryExampleProps> = ({ path }): ReactElement => {
  return <p>Current path: {path}</p>;
};

// URLs containing credentials can remain in browser history.
//
// This creates another place from which sensitive information may be
// disclosed.
//
// Authentication flows should avoid unnecessarily placing credentials in
// navigable URLs.

// ---------------------------------------------------------------------
// 26. Token exposure through copied URLs
// ---------------------------------------------------------------------

const CopiedUrlExample: FC = (): ReactElement => {
  return <p>Sensitive credentials should never become shareable URL data.</p>;
};

// A user may copy, paste, bookmark, or share a URL.
//
// If a URL contains an authentication credential, ordinary browser behavior
// can unintentionally disclose that credential to another person.

// ---------------------------------------------------------------------
// 27. Token exposure through screenshots
// ---------------------------------------------------------------------

interface CredentialDisplayProps {
  readonly value: string;
}

const CredentialDisplay: FC<CredentialDisplayProps> = ({ value }): ReactElement => {
  return <p>{value}</p>;
};

// Authentication credentials should generally not be rendered into visible
// UI unless there is a specific, justified reason.
//
// Visible credentials can be captured through:
//
// - screenshots,
// - screen sharing,
// - browser recording,
// - support tools,
// - copied text.
//
// Keep secrets out of the rendered interface whenever possible.

// ---------------------------------------------------------------------
// 28. Token exposure through DOM attributes
// ---------------------------------------------------------------------

interface TokenAttributeExampleProps {
  readonly token: string;
}

const TokenAttributeExample: FC<TokenAttributeExampleProps> = ({ token }): ReactElement => {
  return <div data-token={token}>Protected content</div>;
};

// Authentication credentials should not be placed into:
//
// data-* attributes
// hidden inputs
// element IDs
// class names
// accessible labels
// arbitrary DOM properties
//
// Browser JavaScript can inspect the DOM, so these locations do not protect
// credentials.

// ---------------------------------------------------------------------
// 29. Token exposure through hidden fields
// ---------------------------------------------------------------------

const HiddenCredentialExample: FC = (): ReactElement => {
  return <p>A hidden HTML field is still accessible to browser JavaScript.</p>;
};

// This does not protect a credential:
//
// <input type="hidden" value="token" />
//
// "Hidden" means visually hidden from normal presentation.
//
// It does not mean inaccessible to scripts, browser extensions, or users
// inspecting the document.

// ---------------------------------------------------------------------
// 30. Token exposure through props
// ---------------------------------------------------------------------

interface SensitiveProps {
  readonly token: string;
}

const SensitivePropExample: FC<SensitiveProps> = ({ token }): ReactElement => {
  void token;

  return <p>Protected component.</p>;
};

// Passing a credential through props makes it available to the component and
// any code paths that receive the prop.
//
// Prefer passing the minimum data required by the component.

// ---------------------------------------------------------------------
// 31. Token exposure through broad application state
// ---------------------------------------------------------------------

interface ApplicationState {
  readonly userId: string;
  readonly displayName: string;
  readonly accessToken: string | null;
}

const applicationState: ApplicationState = {
  userId: "user-123",
  displayName: "John Doe",
  accessToken: null,
};

const ApplicationStateExample: FC = (): ReactElement => {
  return <p>Signed in as {applicationState.displayName}.</p>;
};

// A global state store can make credentials accessible to a large portion of
// the application.
//
// Broad distribution increases the number of places that must be trusted.
//
// Store and expose only the authentication information that the application
// actually needs.

// ---------------------------------------------------------------------
// 32. Minimize credential exposure
// ---------------------------------------------------------------------

interface AuthenticationRepresentation {
  readonly userId: string;
  readonly displayName: string;
}

const authenticationRepresentation: AuthenticationRepresentation = {
  userId: "user-123",
  displayName: "John Doe",
};

const MinimalAuthenticationState: FC = (): ReactElement => {
  return <p>User: {authenticationRepresentation.displayName}</p>;
};

// Prefer exposing safe session-derived information:
//
// userId
// displayName
// permissions needed for UI
//
// instead of distributing:
//
// sessionId
// accessToken
// refreshToken
//
// when the client does not actually need those credentials.

// ---------------------------------------------------------------------
// 33. Short-lived access tokens
// ---------------------------------------------------------------------

interface TokenLifetime {
  readonly expiresAt: number;
}

const shortLivedToken: TokenLifetime = {
  expiresAt: Date.now() + 300_000,
};

const ShortLivedTokenExample: FC = (): ReactElement => {
  return <p>Credential lifetime is limited.</p>;
};

// Short-lived credentials reduce the period during which an exposed credential
// remains usable.
//
// Short lifetime does not eliminate exposure risk.
//
// An attacker can still use a valid stolen credential until it expires or is
// otherwise invalidated.

// ---------------------------------------------------------------------
// 34. Refresh token rotation
// ---------------------------------------------------------------------

interface RefreshRotationResult {
  readonly previousToken: string;
  readonly replacementToken: string;
}

const refreshRotationResult: RefreshRotationResult = {
  previousToken: "previous-refresh-token",
  replacementToken: "replacement-refresh-token",
};

const RefreshRotationExample: FC = (): ReactElement => {
  return <p>Refresh credentials can be rotated according to the authentication architecture.</p>;
};

// Refresh-token rotation can make reuse of an already-used refresh token
// detectable or invalid.
//
// Exact behavior depends on the identity provider and protocol implementation.

// ---------------------------------------------------------------------
// 35. Token revocation
// ---------------------------------------------------------------------

interface RevocableToken {
  readonly tokenId: string;
  readonly revoked: boolean;
}

const revocableToken: RevocableToken = {
  tokenId: "credential-123",
  revoked: true,
};

const TokenRevocationExample: FC = (): ReactElement => {
  return (
    <p>
      Credential {revocableToken.tokenId}: {revocableToken.revoked ? "Revoked" : "Active"}
    </p>
  );
};

// Revocation can invalidate credentials before their normal expiration.
//
// Whether and how a token can be revoked depends on the token architecture and
// identity provider.

// ---------------------------------------------------------------------
// 36. Token audience and purpose
// ---------------------------------------------------------------------

interface TokenClaims {
  readonly audience: string;
  readonly purpose: "api-access" | "identity";
}

const tokenClaims: TokenClaims = {
  audience: "example-api",
  purpose: "api-access",
};

const TokenPurposeExample: FC = (): ReactElement => {
  return <p>Token purpose: {tokenClaims.purpose}</p>;
};

// A credential should be used only for its intended protocol purpose.
//
// Servers should validate relevant claims such as audience and issuer when
// required by the authentication protocol.
//
// An ID token should not simply be treated as an access token because both are
// encoded as token-like values.

// ---------------------------------------------------------------------
// 37. Token exposure through insecure transport
// ---------------------------------------------------------------------

const InsecureTransportExample: FC = (): ReactElement => {
  return <p>Authentication credentials should be transmitted over HTTPS.</p>;
};

// Credentials sent over an insecure transport can be intercepted.
//
// HTTPS protects data in transit between the browser and server.
//
// Cookie-based credentials should also use the Secure attribute so that the
// browser does not send them over insecure HTTP connections.

// ---------------------------------------------------------------------
// 38. Token exposure through mixed content
// ---------------------------------------------------------------------

const MixedContentExample: FC = (): ReactElement => {
  return <p>Authentication pages should avoid insecure resource loading.</p>;
};

// An otherwise secure page should not unnecessarily load active content over
// insecure HTTP.
//
// Mixed-content problems can undermine assumptions about the security of the
// page and its resources.

// ---------------------------------------------------------------------
// 39. Token exposure through browser extensions
// ---------------------------------------------------------------------

const BrowserExtensionExample: FC = (): ReactElement => {
  return (
    <p>
      Client-side credentials should be minimized because browser-side code has access according to the browser's
      security model.
    </p>
  );
};

// Browser extensions can have permissions that allow them to interact with
// pages or browser data.
//
// An application cannot treat all browser-side execution environments as
// equivalent trusted code.
//
// Minimizing exposed credentials reduces the amount of sensitive material
// available to browser-side code.

// ---------------------------------------------------------------------
// 40. Token exposure through third-party dependencies
// ---------------------------------------------------------------------

interface Dependency {
  readonly name: string;
  readonly trusted: boolean;
}

const dependency: Dependency = {
  name: "example-library",
  trusted: true,
};

const DependencyExample: FC = (): ReactElement => {
  return <p>Dependency: {dependency.name}</p>;
};

// A compromised dependency can execute application code and potentially access
// credentials exposed to that code.
//
// Dependency security, supply-chain controls, and minimizing unnecessary
// privileges are therefore part of token-protection strategy.

// ---------------------------------------------------------------------
// 41. Token exposure through debugging
// ---------------------------------------------------------------------

const DebuggingExample: FC = (): ReactElement => {
  return <p>Sensitive authentication values should be excluded from debugging output.</p>;
};

// Avoid exposing credentials through:
//
// console output
// debugger variables
// debug panels
// screenshots
// support bundles
//
// Development-only code can accidentally reach production if debugging
// instrumentation is not carefully controlled.

// ---------------------------------------------------------------------
// 42. Token exposure through crash dumps
// ---------------------------------------------------------------------

interface CrashContext {
  readonly route: string;
  readonly userId: string;
}

const crashContext: CrashContext = {
  route: "/account",
  userId: "user-123",
};

const CrashContextExample: FC = (): ReactElement => {
  return <p>Crash context: {crashContext.route}</p>;
};

// Crash reporting should collect enough context to diagnose failures without
// collecting authentication credentials.
//
// Avoid serializing entire authentication objects when a small safe subset of
// information is sufficient.

// ---------------------------------------------------------------------
// 43. Token exposure through serialized state
// ---------------------------------------------------------------------

interface SerializedState {
  readonly userId: string;
  readonly displayName: string;
}

const serializedState: SerializedState = {
  userId: "user-123",
  displayName: "John Doe",
};

const SerializedStateExample: FC = (): ReactElement => {
  return <p>Serialized user: {serializedState.displayName}</p>;
};

// Server-rendered applications sometimes serialize initial application state
// into HTML.
//
// Do not place authentication secrets into serialized state merely because the
// client needs some authentication-related information.
//
// HTML delivered to the browser is readable by browser-side code and the user.

// ---------------------------------------------------------------------
// 44. Token exposure through server-rendered HTML
// ---------------------------------------------------------------------

const ServerRenderedHtmlExample: FC = (): ReactElement => {
  return (
    <section>
      <h2>Rendered authentication state</h2>
      <p>Safe user information can be rendered without exposing credentials.</p>
    </section>
  );
};

// Prefer rendering safe information such as:
//
// user.displayName
// user.id
//
// rather than embedding:
//
// accessToken
// refreshToken
// sessionId
//
// into the generated HTML.

// ---------------------------------------------------------------------
// 45. Token exposure through network inspection
// ---------------------------------------------------------------------

const NetworkInspectionExample: FC = (): ReactElement => {
  return <p>Browser requests can be inspected by the user who controls the browser.</p>;
};

// Any credential intentionally delivered to browser JavaScript should be
// considered available to that browser context.
//
// Client-side code cannot create a secret that must remain secret from the
// person operating the browser.

// ---------------------------------------------------------------------
// 46. Public versus secret credentials
// ---------------------------------------------------------------------

type CredentialExposure = "public" | "confidential";

interface CredentialClassification {
  readonly name: string;
  readonly exposure: CredentialExposure;
}

const credentialClassification: readonly CredentialClassification[] = [
  {
    name: "Client application identifier",
    exposure: "public",
  },
  {
    name: "Access token",
    exposure: "confidential",
  },
  {
    name: "Refresh token",
    exposure: "confidential",
  },
];

const CredentialClassificationExample: FC = (): ReactElement => {
  return (
    <ul>
      {credentialClassification.map((credential) => (
        <li key={credential.name}>
          {credential.name}: {credential.exposure}
        </li>
      ))}
    </ul>
  );
};

// Some protocol identifiers are intentionally public.
//
// Authentication credentials are different.
//
// A value should be classified according to what an attacker can do with it,
// not according to what the variable is named.

// ---------------------------------------------------------------------
// 47. BFF pattern
// ---------------------------------------------------------------------

const BackendForFrontendExample: FC = (): ReactElement => {
  return (
    <section>
      <h2>Backend for Frontend</h2>
      <p>
        A BFF can keep sensitive upstream credentials on the server while the browser interacts with the application
        server.
      </p>
    </section>
  );
};

// A Backend for Frontend (BFF) architecture can place token-handling logic on
// the server:
//
// browser
//    ↓
// BFF
//    ↓
// protected API
//
// The browser can use a secure session with the BFF while the BFF manages
// upstream access credentials.
//
// This can reduce the number of sensitive credentials exposed to browser
// JavaScript.

// ---------------------------------------------------------------------
// 48. Token exposure and XSS
// ---------------------------------------------------------------------

const XssTokenRiskExample: FC = (): ReactElement => {
  return (
    <section>
      <h2>XSS and token exposure</h2>
      <p>Preventing XSS remains important even when authentication uses HttpOnly cookies.</p>
    </section>
  );
};

// If an application stores a token in client-readable state:
//
// XSS
//   ↓
// malicious JavaScript
//   ↓
// read token
//   ↓
// send token to attacker
//
// With an HttpOnly session cookie:
//
// XSS
//   ↓
// malicious JavaScript
//   ↓
// cannot directly read cookie
//
// but may still:
//
// XSS
//   ↓
// malicious JavaScript
//   ↓
// make authenticated same-origin requests
//
// Therefore HttpOnly reduces one consequence of XSS but does not make XSS
// harmless.

// ---------------------------------------------------------------------
// 49. Token exposure and CSP
// ---------------------------------------------------------------------

const CspTokenProtectionExample: FC = (): ReactElement => {
  return (
    <section>
      <h2>Content Security Policy</h2>
      <p>
        CSP can reduce some script-injection risks and provides defense in depth for applications handling
        authentication state.
      </p>
    </section>
  );
};

// Content Security Policy can restrict which scripts and resources a browser
// is permitted to load.
//
// CSP should be treated as defense in depth.
//
// It does not replace:
//
// - output encoding,
// - safe DOM APIs,
// - HTML sanitization where needed,
// - dependency security,
// - secure session management,
// - or server-side authorization.

// ---------------------------------------------------------------------
// 50. Token exposure and sanitization
// ---------------------------------------------------------------------

interface SanitizedContentProps {
  readonly content: string;
}

const SanitizedContentExample: FC<SanitizedContentProps> = ({ content }): ReactElement => {
  return <p>{content}</p>;
};

// React escapes ordinary text content.
//
// Prefer:
//
// <p>{untrustedContent}</p>
//
// rather than inserting untrusted HTML.
//
// When an application genuinely needs to render HTML, it should use an
// appropriate sanitization strategy before rendering it.

// ---------------------------------------------------------------------
// 51. Do not send tokens to unnecessary services
// ---------------------------------------------------------------------

interface ApiRequestTarget {
  readonly service: string;
}

const apiRequestTarget: ApiRequestTarget = {
  service: "example-api",
};

const ApiRequestTargetExample: FC = (): ReactElement => {
  return <p>Credential should be sent only to its intended service.</p>;
};

// An access token should not be forwarded to arbitrary third-party services.
//
// A credential intended for:
//
// example-api
//
// should not automatically be attached to requests for:
//
// analytics.example
// third-party.example
// unrelated-service.example
//
// Token audience and request routing should be carefully controlled.

// ---------------------------------------------------------------------
// 52. Token forwarding
// ---------------------------------------------------------------------

interface ForwardingPolicy {
  readonly allowedAudience: string;
}

const forwardingPolicy: ForwardingPolicy = {
  allowedAudience: "example-api",
};

const TokenForwardingExample: FC = (): ReactElement => {
  return <p>Allowed token audience: {forwardingPolicy.allowedAudience}</p>;
};

// Server-side components such as proxies and BFFs should not blindly forward
// every incoming credential to every upstream service.
//
// Credentials should be forwarded only when the target service is intended to
// accept that credential and the authorization model permits it.

// ---------------------------------------------------------------------
// 53. Token exposure through overly broad cookies
// ---------------------------------------------------------------------

interface CookieScope {
  readonly path: string;
  readonly domain: string | null;
}

const cookieScope: CookieScope = {
  path: "/",
  domain: null,
};

const CookieScopeExample: FC = (): ReactElement => {
  return <p>Session cookies should use the narrowest appropriate scope.</p>;
};

// Cookie scope affects where a browser sends a cookie.
//
// Avoid unnecessarily broad Domain and Path settings.
//
// A host-scoped session cookie can reduce exposure to unrelated subdomains
// when the application architecture permits it.

// ---------------------------------------------------------------------
// 54. Token exposure through subdomains
// ---------------------------------------------------------------------

const SubdomainExample: FC = (): ReactElement => {
  return <p>Shared cookie scope should be used only when required by the application.</p>;
};

// A cookie scoped to a parent domain can potentially be sent to multiple
// subdomains.
//
// If those subdomains have different trust boundaries, broad cookie scope can
// increase credential exposure.
//
// Host-only or `__Host-` cookies can provide stronger isolation when compatible
// with the architecture.

// ---------------------------------------------------------------------
// 55. Token exposure through unnecessary persistence
// ---------------------------------------------------------------------

interface CredentialPersistence {
  readonly persistent: boolean;
}

const credentialPersistence: CredentialPersistence = {
  persistent: false,
};

const PersistenceExample: FC = (): ReactElement => {
  return <p>Credential persistence should be limited to what the authentication design requires.</p>;
};

// Longer-lived credentials create longer windows of opportunity if they are
// exposed.
//
// Session and token lifetimes should therefore be chosen according to the
// application's security requirements rather than made permanent for
// convenience.

// ---------------------------------------------------------------------
// 56. Token exposure and logout
// ---------------------------------------------------------------------

const LogoutExposureExample: FC = (): ReactElement => {
  return <p>Logout should invalidate applicable authentication credentials.</p>;
};

// Logout should address the actual authentication mechanism.
//
// For a server-side session:
//
// logout
//    ↓
// invalidate session
//    ↓
// clear session cookie
//
// For token-based systems, the application should follow the relevant token
// revocation and expiration model.

// ---------------------------------------------------------------------
// 57. Token exposure and password changes
// ---------------------------------------------------------------------

const PasswordChangeExposureExample: FC = (): ReactElement => {
  return <p>Security-sensitive account changes may require existing credentials to be invalidated.</p>;
};

// Depending on the authentication architecture, changing a password or
// responding to suspected credential compromise may trigger:
//
// - session revocation,
// - refresh-token revocation,
// - credential rotation,
// - reauthentication.
//
// The exact behavior depends on the authentication system.

// ---------------------------------------------------------------------
// 58. Token exposure response
// ---------------------------------------------------------------------

interface TokenCompromiseResponse {
  readonly revoke: boolean;
  readonly rotate: boolean;
  readonly reauthenticate: boolean;
}

const tokenCompromiseResponse: TokenCompromiseResponse = {
  revoke: true,
  rotate: true,
  reauthenticate: true,
};

const TokenCompromiseExample: FC = (): ReactElement => {
  return (
    <ul>
      <li>Revoke affected credentials.</li>
      <li>Rotate credentials where supported.</li>
      <li>Require reauthentication when appropriate.</li>
    </ul>
  );
};

// If a sensitive credential is suspected to have been exposed, the response
// should focus on reducing the credential's remaining usefulness.
//
// Depending on the credential type:
//
// revoke
// rotate
// expire
// reauthenticate
//
// may be appropriate.

// ---------------------------------------------------------------------
// 59. Minimize the blast radius
// ---------------------------------------------------------------------

interface CredentialPolicy {
  readonly lifetimeMs: number;
  readonly audience: string;
  readonly scope: string;
}

const credentialPolicy: CredentialPolicy = {
  lifetimeMs: 300_000,
  audience: "example-api",
  scope: "orders.read",
};

const BlastRadiusExample: FC = (): ReactElement => {
  return (
    <ul>
      <li>Lifetime: {credentialPolicy.lifetimeMs / 60_000} minutes</li>
      <li>Audience: {credentialPolicy.audience}</li>
      <li>Scope: {credentialPolicy.scope}</li>
    </ul>
  );
};

// Credential design can reduce blast radius through:
//
// short lifetime
// narrow audience
// narrow scope
// limited permissions
// secure storage
//
// These controls do not eliminate the possibility of compromise, but they can
// limit what an exposed credential can accomplish.

// ---------------------------------------------------------------------
// 60. Secure token architecture
// ---------------------------------------------------------------------

const SecureTokenArchitecture: FC = (): ReactElement => {
  return (
    <section>
      <h2>Secure token architecture</h2>
      <p>Keep sensitive credentials on the server whenever the browser does not need direct access to them.</p>
    </section>
  );
};

// A server-managed session can provide:
//
// browser
//    ↓
// HttpOnly session cookie
//    ↓
// application server
//    ↓
// upstream API credentials
//
// The browser receives only the data required to render the interface.
//
// This architecture can significantly reduce direct exposure of upstream
// authentication credentials.

// ---------------------------------------------------------------------
// 61. Integrated token-exposure example
// ---------------------------------------------------------------------

interface UserSessionViewProps {
  readonly user: {
    readonly id: string;
    readonly displayName: string;
  } | null;
  readonly authenticated: boolean;
}

const UserSessionView: FC<UserSessionViewProps> = ({ user, authenticated }): ReactElement => {
  if (!authenticated || !user) {
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
      <p>Signed in as {user.displayName}.</p>
      <p>Authentication credentials are not exposed to this component.</p>
    </section>
  );
};

const TokenExposureDemo: FC = (): ReactElement => {
  const user = {
    id: "user-123",
    displayName: "John Doe",
  };

  return <UserSessionView user={user} authenticated={true} />;
};

export default TokenExposureDemo;

// ---------------------------------------------------------------------
// 62. Token-exposure security checklist
// ---------------------------------------------------------------------
// - Treat access tokens, refresh tokens, session identifiers, and other authentication credentials as sensitive.
// - Do not store sensitive authentication credentials in localStorage or sessionStorage without a specific security justification.
// - Remember that React state and React context are readable by application JavaScript and are not security boundaries.
// - Prefer server-managed sessions with appropriately protected cookies when that architecture fits the application.
// - Use `HttpOnly` to prevent JavaScript from directly reading session cookies.
// - Remember that `HttpOnly` does not prevent XSS or authenticated requests made by malicious same-origin JavaScript.
// - Use `Secure` for cookies that should be transmitted only over HTTPS.
// - Configure `SameSite` appropriately for the application's authentication architecture.
// - Avoid placing access tokens, session identifiers, or other credentials in URLs.
// - Avoid exposing credentials through query parameters, fragments, browser history, copied links, or referrer data.
// - Never hard-code production authentication secrets into client-side source code.
// - Treat client-exposed environment variables as public.
// - Do not place authentication credentials into HTML, hidden inputs, DOM attributes, or serialized client state unnecessarily.
// - Do not log access tokens, refresh tokens, session identifiers, passwords, or other authentication credentials.
// - Exclude credentials from analytics, crash reports, debugging output, and other telemetry.
// - Minimize third-party scripts and dependencies that can access browser-side application state.
// - Use Content Security Policy and other XSS defenses as defense in depth.
// - Render untrusted data as text unless a justified HTML-rendering requirement is properly sanitized.
// - Send credentials only to intended services and do not blindly forward tokens to unrelated upstream systems.
// - Use narrow cookie scope where the application architecture permits it.
// - Use short-lived and narrowly scoped credentials where appropriate.
// - Rotate and revoke credentials according to the authentication architecture.
// - Consider revoking active sessions or credentials after suspected compromise or sensitive account changes.
// - Treat credentials delivered to browser JavaScript as accessible to that browser context.
// - Consider a Backend for Frontend architecture when keeping upstream credentials server-side reduces browser exposure.
// - Design credentials with limited audience, scope, lifetime, and permissions to reduce blast radius.
// - Keep the client representation of authentication state separate from the credentials that establish that state.
// - Keep the server authoritative for authentication, credential validation, revocation, and authorization.

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Token exposure occurs when authentication credentials become accessible to unintended code, systems, users, or storage locations.
// - Access tokens, refresh tokens, session identifiers, and other authentication credentials must be treated as sensitive.
// - Client-readable browser storage such as localStorage and sessionStorage is accessible to JavaScript running in the page.
// - React state and React context are also client-readable and are not secure credential stores.
// - HttpOnly cookies prevent application JavaScript from directly reading the cookie value.
// - HttpOnly does not prevent XSS or stop malicious same-origin JavaScript from making authenticated requests.
// - Secure cookies restrict transmission to HTTPS connections.
// - SameSite controls cross-site cookie transmission and can contribute to CSRF risk reduction.
// - Sensitive authentication credentials should generally not be placed in URLs.
// - Credentials in URLs can become exposed through browser history, logs, analytics, referrer data, screenshots, and copied links.
// - Authorization codes and access tokens are different protocol artifacts and must be handled according to their intended protocols.
// - Authentication credentials should not be written to application logs, debugging output, analytics, crash reports, or unnecessary telemetry.
// - Secrets must not be embedded into browser-delivered source code.
// - Client-exposed environment variables are public because their values can be inspected by the browser user.
// - Third-party scripts and compromised dependencies can increase token exposure when credentials are accessible to browser JavaScript.
// - Sensitive credentials should not be unnecessarily placed into HTML, hidden inputs, DOM attributes, component props, or serialized client state.
// - Authentication credentials should be sent only to intended services and should not be blindly forwarded to unrelated upstream systems.
// - Broad cookie scope can increase exposure across subdomains; narrower host-scoped cookies can reduce that exposure when appropriate.
// - Short-lived, narrowly scoped, audience-restricted credentials can reduce the impact of credential exposure.
// - Refresh-token rotation and credential revocation can limit the usefulness of compromised credentials when supported by the authentication architecture.
// - Logout and sensitive account-security events may require server-side credential or session invalidation.
// - XSS prevention remains important even when authentication uses HttpOnly cookies.
// - Content Security Policy can provide defense in depth against script-injection risks but does not replace other security controls.
// - A Backend for Frontend architecture can keep sensitive upstream credentials on the server rather than exposing them to browser JavaScript.
// - The browser should receive only the authentication-related information required to render the interface.
// - The server must remain authoritative for credential validation, session management, authentication, and authorization.
