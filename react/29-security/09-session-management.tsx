/**
 * Session Management
 * ===================
 *
 * Session management maintains an authenticated user's state across multiple HTTP requests.
 * A secure session system creates, associates, validates, expires, rotates, and invalidates
 * session identifiers so that authentication state cannot be easily stolen, predicted, or reused.
 *
 * React represents session state in the interface, but the server is responsible for creating,
 * validating, rotating, and invalidating authenticated sessions.
 */

import { type FC, type ReactElement } from "react";

// ---------------------------------------------------------------------
// 1. What is a session?
// ---------------------------------------------------------------------

// HTTP is stateless:
//
// request 1
//     ↓
// response 1
//
// request 2
//     ↓
// response 2
//
// The server does not inherently know that request 2 belongs to the same
// authenticated user as request 1.
//
// A session provides continuity:
//
// login
//   ↓
// authenticated session
//   ↓
// subsequent requests
//   ↓
// same authenticated identity

// ---------------------------------------------------------------------
// 2. Session identifier
// ---------------------------------------------------------------------

interface Session {
  readonly id: string;
  readonly userId: string;
  readonly createdAt: number;
  readonly expiresAt: number;
}

const session: Session = {
  id: "opaque-session-identifier",
  userId: "user-123",
  createdAt: Date.now(),
  expiresAt: Date.now() + 1_800_000,
};

// A session identifier is a credential that allows the server to associate
// subsequent requests with an authenticated session.
//
// The identifier should be treated as sensitive authentication material.
//
// An opaque, unpredictable session identifier does not need to contain the
// user's identity or authorization information.

// ---------------------------------------------------------------------
// 3. Session lifecycle
// ---------------------------------------------------------------------

// A session commonly follows this lifecycle:
//
// unauthenticated
//      ↓
// login
//      ↓
// session creation
//      ↓
// authenticated
//      ↓
// session rotation / renewal
//      ↓
// expiration or logout
//      ↓
// invalidated
//
// Each transition should be controlled by the authentication system.

// ---------------------------------------------------------------------
// 4. Creating a session
// ---------------------------------------------------------------------

interface SessionCreationResult {
  readonly sessionId: string;
  readonly userId: string;
}

const createSessionExample = (userId: string): SessionCreationResult => {
  return {
    sessionId: "new-opaque-session-id",
    userId,
  };
};

const SessionCreationExample: FC = (): ReactElement => {
  const result = createSessionExample("user-123");

  return <p>Session created for {result.userId}.</p>;
};

// After successful authentication, the server can create a new session and
// associate it with the authenticated user.
//
// The browser receives the session identifier through the appropriate
// authentication mechanism, commonly a secure cookie.

// ---------------------------------------------------------------------
// 5. Session cookie
// ---------------------------------------------------------------------

const SessionCookieExample: FC = (): ReactElement => {
  return (
    <section>
      <h2>Session cookie</h2>
      <p>Session credentials should use appropriate cookie security attributes.</p>
    </section>
  );
};

// A server-managed session can use a cookie conceptually configured like:
//
// Set-Cookie:
//     __Host-session=SESSION_ID;
//     Path=/;
//     Secure;
//     HttpOnly;
//     SameSite=Lax
//
// `HttpOnly` prevents JavaScript from directly reading the cookie.
//
// `Secure` restricts transmission to HTTPS connections.
//
// `SameSite` controls when the browser sends the cookie in cross-site
// contexts.
//
// The exact SameSite policy depends on the application's architecture.

// ---------------------------------------------------------------------
// 6. HttpOnly session cookies
// ---------------------------------------------------------------------

const HttpOnlySessionExample: FC = (): ReactElement => {
  return <p>JavaScript does not need direct access to an HttpOnly session cookie.</p>;
};

// An HttpOnly cookie cannot be read through:
//
// document.cookie
//
// This reduces the ability of injected JavaScript to directly extract the
// session identifier.
//
// HttpOnly does not prevent XSS itself.
//
// Malicious same-origin JavaScript may still be able to make requests that
// include applicable cookies, so XSS prevention remains important.

// ---------------------------------------------------------------------
// 7. Secure session cookies
// ---------------------------------------------------------------------

const SecureSessionExample: FC = (): ReactElement => {
  return <p>Session cookies should be transmitted over HTTPS.</p>;
};

// `Secure` instructs the browser to send the cookie only over secure
// connections.
//
// Secure transport protects the session identifier while it travels between
// the browser and server.
//
// It does not protect against every form of session abuse or XSS.

// ---------------------------------------------------------------------
// 8. SameSite session cookies
// ---------------------------------------------------------------------

type SameSitePolicy = "Strict" | "Lax" | "None";

interface SessionCookiePolicy {
  readonly sameSite: SameSitePolicy;
  readonly secure: boolean;
  readonly httpOnly: boolean;
}

const sessionCookiePolicy: SessionCookiePolicy = {
  sameSite: "Lax",
  secure: true,
  httpOnly: true,
};

const SameSiteExample: FC = (): ReactElement => {
  return <p>SameSite policy: {sessionCookiePolicy.sameSite}</p>;
};

// SameSite controls cross-site cookie sending behavior.
//
// `SameSite=None` requires `Secure`.
//
// The correct policy depends on whether the application requires cookies in
// cross-site contexts.

// ---------------------------------------------------------------------
// 9. The __Host- cookie prefix
// ---------------------------------------------------------------------

const HostCookieExample: FC = (): ReactElement => {
  return <p>A host-prefixed session cookie can strengthen cookie scoping.</p>;
};

// A cookie named:
//
// __Host-session
//
// can be configured with:
//
// Secure
// Path=/
//
// and without a Domain attribute.
//
// The `__Host-` prefix helps prevent the cookie from being scoped to a parent
// domain and requires the browser to enforce specific cookie attributes.

// ---------------------------------------------------------------------
// 10. Session identifiers must be unpredictable
// ---------------------------------------------------------------------

const SessionIdentifierExample: FC = (): ReactElement => {
  return (
    <section>
      <h2>Session identifier</h2>
      <p>Session identifiers should be generated with a cryptographically secure random mechanism.</p>
    </section>
  );
};

// A session identifier must not be predictable.
//
// Unsafe examples include:
//
// session-1
// session-2
// user-123-session
// Date.now().toString()
//
// Predictable identifiers can allow an attacker to guess or enumerate valid
// sessions.
//
// Session identifiers should be generated by a cryptographically secure
// random mechanism on the server.

// ---------------------------------------------------------------------
// 11. Do not encode sensitive data into session IDs
// ---------------------------------------------------------------------

interface SessionIdentifierDesign {
  readonly identifier: string;
}

const sessionIdentifierDesign: SessionIdentifierDesign = {
  identifier: "opaque-random-value",
};

const OpaqueSessionExample: FC = (): ReactElement => {
  return <p>Session identifier: {sessionIdentifierDesign.identifier}</p>;
};

// Prefer opaque identifiers rather than identifiers that expose information
// such as:
//
// userId=123
// role=admin
// email=john.doe@example.com
//
// Authorization data should be derived from trusted server-side session and
// account data rather than from a client-controlled identifier.

// ---------------------------------------------------------------------
// 12. Server-side session storage
// ---------------------------------------------------------------------

interface SessionRecord {
  readonly sessionId: string;
  readonly userId: string;
  readonly expiresAt: number;
}

const sessionRecord: SessionRecord = {
  sessionId: "opaque-session-id",
  userId: "user-123",
  expiresAt: Date.now() + 1_800_000,
};

const ServerSessionExample: FC = (): ReactElement => {
  return <p>Server session belongs to {sessionRecord.userId}.</p>;
};

// With server-side sessions, the browser typically stores only the session
// identifier.
//
// The server maintains the session record:
//
// session ID
//     ↓
// user ID
//     ↓
// session metadata
//     ↓
// expiration
//
// The exact storage mechanism depends on the application's infrastructure.

// ---------------------------------------------------------------------
// 13. Stateless session models
// ---------------------------------------------------------------------

interface StatelessCredential {
  readonly token: string;
}

const statelessCredential: StatelessCredential = {
  token: "signed-credential-placeholder",
};

const StatelessSessionExample: FC = (): ReactElement => {
  return <p>Stateless authentication can carry claims in a signed credential.</p>;
};

// Some systems use self-contained credentials rather than a server-side
// session record.
//
// This can reduce server-side session storage requirements but introduces
// different security and revocation considerations.
//
// A signed token is not automatically safer than a server-side session.

// ---------------------------------------------------------------------
// 14. Session validation
// ---------------------------------------------------------------------

interface SessionValidationResult {
  readonly valid: boolean;
  readonly userId: string | null;
}

const validateSession = (sessionRecord: SessionRecord, currentTime: number): SessionValidationResult => {
  if (currentTime >= sessionRecord.expiresAt) {
    return {
      valid: false,
      userId: null,
    };
  }

  return {
    valid: true,
    userId: sessionRecord.userId,
  };
};

const SessionValidationExample: FC = (): ReactElement => {
  const result = validateSession(sessionRecord, Date.now());

  return <p>Session: {result.valid ? "Valid" : "Expired"}</p>;
};

// The server should validate the session when processing protected requests.
//
// A client-side value such as:
//
// isAuthenticated === true
//
// is not sufficient evidence that the server-side session remains valid.

// ---------------------------------------------------------------------
// 15. Session expiration
// ---------------------------------------------------------------------

interface SessionExpirationPolicy {
  readonly idleTimeoutMs: number;
  readonly absoluteTimeoutMs: number;
}

const sessionExpirationPolicy: SessionExpirationPolicy = {
  idleTimeoutMs: 30 * 60 * 1000,
  absoluteTimeoutMs: 8 * 60 * 60 * 1000,
};

const SessionExpirationExample: FC = (): ReactElement => {
  return (
    <ul>
      <li>Idle timeout: {sessionExpirationPolicy.idleTimeoutMs / 60_000} minutes</li>
      <li>Absolute timeout: {sessionExpirationPolicy.absoluteTimeoutMs / 3_600_000} hours</li>
    </ul>
  );
};

// Session lifetime can be constrained by:
//
// idle timeout
//     → expires after a period of inactivity
//
// absolute timeout
//     → expires after a maximum lifetime
//
// Appropriate values depend on the sensitivity of the application and its
// operational requirements.

// ---------------------------------------------------------------------
// 16. Idle timeout
// ---------------------------------------------------------------------

interface ActivityState {
  readonly lastActivityAt: number;
}

const activityState: ActivityState = {
  lastActivityAt: Date.now(),
};

const isIdleSessionExpired = (state: ActivityState, now: number, idleTimeoutMs: number): boolean => {
  return now - state.lastActivityAt >= idleTimeoutMs;
};

const IdleTimeoutExample: FC = (): ReactElement => {
  const expired = isIdleSessionExpired(activityState, Date.now(), 30 * 60 * 1000);

  return <p>Idle timeout: {expired ? "Expired" : "Active"}</p>;
};

// Idle expiration limits how long an inactive session remains valid.
//
// The server should be the authority for determining whether an idle timeout
// has been exceeded.

// ---------------------------------------------------------------------
// 17. Absolute session timeout
// ---------------------------------------------------------------------

interface AbsoluteSession {
  readonly createdAt: number;
}

const absoluteSession: AbsoluteSession = {
  createdAt: Date.now(),
};

const hasAbsoluteTimeoutExpired = (sessionValue: AbsoluteSession, now: number, timeoutMs: number): boolean => {
  return now - sessionValue.createdAt >= timeoutMs;
};

const AbsoluteTimeoutExample: FC = (): ReactElement => {
  const expired = hasAbsoluteTimeoutExpired(absoluteSession, Date.now(), 8 * 60 * 60 * 1000);

  return <p>Absolute timeout: {expired ? "Expired" : "Active"}</p>;
};

// An absolute timeout places an upper bound on the lifetime of a session,
// even if the user remains active.

// ---------------------------------------------------------------------
// 18. Session renewal
// ---------------------------------------------------------------------

interface SessionRenewalResult {
  readonly oldSessionId: string;
  readonly newSessionId: string;
}

const renewSession = (oldSessionId: string): SessionRenewalResult => {
  return {
    oldSessionId,
    newSessionId: "new-opaque-session-id",
  };
};

const SessionRenewalExample: FC = (): ReactElement => {
  const result = renewSession("old-session-id");

  return (
    <p>
      Session renewed: {result.oldSessionId} → {result.newSessionId}
    </p>
  );
};

// Session renewal can extend a valid session while issuing a new identifier.
//
// The old identifier should no longer remain usable when rotation requires
// replacement.

// ---------------------------------------------------------------------
// 19. Session fixation
// ---------------------------------------------------------------------

interface SessionFixationExampleProps {
  readonly authenticated: boolean;
}

const SessionFixationExample: FC<SessionFixationExampleProps> = ({ authenticated }): ReactElement => {
  return <p>Session state: {authenticated ? "Authenticated" : "Unauthenticated"}</p>;
};

// Session fixation occurs when an attacker can cause a victim to authenticate
// using a session identifier already known to the attacker.
//
// A key defense is:
//
// before authentication
//     ↓
// pre-authentication session
//
// successful authentication
//     ↓
// issue a fresh session identifier
//
// The authenticated session should not simply continue using an identifier
// that existed before authentication.

// ---------------------------------------------------------------------
// 20. Rotate the session after authentication
// ---------------------------------------------------------------------

const SessionRotationExample: FC = (): ReactElement => {
  return (
    <section>
      <h2>Authentication transition</h2>
      <p>A new session identifier should be established when authentication state changes.</p>
    </section>
  );
};

// Conceptually:
//
// anonymous session ID
//       ↓
// successful login
//       ↓
// invalidate old session ID
//       ↓
// generate new authenticated session ID
//
// This prevents a previously established session identifier from becoming
// the authenticated session identifier.

// ---------------------------------------------------------------------
// 21. Session rotation after privilege changes
// ---------------------------------------------------------------------

type AuthenticationTransition = "login" | "mfa-complete" | "privilege-change" | "logout";

interface SessionTransition {
  readonly type: AuthenticationTransition;
}

const sessionTransition: SessionTransition = {
  type: "mfa-complete",
};

const SessionTransitionExample: FC = (): ReactElement => {
  return <p>Authentication transition: {sessionTransition.type}</p>;
};

// Session identifiers may need to be rotated after security-sensitive
// authentication or privilege transitions.
//
// Examples include:
//
// - successful login,
// - completion of stronger authentication,
// - elevation of privileges.
//
// The exact rotation strategy depends on the session architecture.

// ---------------------------------------------------------------------
// 22. Logout
// ---------------------------------------------------------------------

interface LogoutState {
  readonly loggedOut: boolean;
}

const logoutState: LogoutState = {
  loggedOut: true,
};

const LogoutExample: FC = (): ReactElement => {
  return <p>Session status: {logoutState.loggedOut ? "Logged out" : "Active"}</p>;
};

// A secure logout flow should invalidate the server-side session or otherwise
// revoke the credential according to the authentication architecture.
//
// Merely changing React state:
//
// setIsAuthenticated(false)
//
// does not invalidate a server-side session.

// ---------------------------------------------------------------------
// 23. Session invalidation
// ---------------------------------------------------------------------

const invalidateSession = (activeSessionId: string): string | null => {
  // The server would invalidate the session record associated with the ID.
  void activeSessionId;

  return null;
};

const SessionInvalidationExample: FC = (): ReactElement => {
  const sessionAfterLogout = invalidateSession("active-session-id");

  return <p>Session after invalidation: {sessionAfterLogout ?? "Invalidated"}</p>;
};

// Once a server-side session is invalidated, the old session identifier should
// no longer authenticate requests.
//
// This is important for:
//
// - explicit logout,
// - account security events,
// - administrative session revocation,
// - suspected credential compromise.

// ---------------------------------------------------------------------
// 24. Cookie expiration during logout
// ---------------------------------------------------------------------

const LogoutCookieExample: FC = (): ReactElement => {
  return <p>Logout should clear the browser's session cookie as part of the session termination flow.</p>;
};

// A server can instruct the browser to remove the session cookie.
//
// Clearing the browser cookie alone is not sufficient if the server-side
// session remains valid.
//
// A robust logout flow addresses both:
//
// browser cookie
//       ↓
// cleared
//
// server session
//       ↓
// invalidated

// ---------------------------------------------------------------------
// 25. Session revocation
// ---------------------------------------------------------------------

interface RevocationState {
  readonly sessionId: string;
  readonly revoked: boolean;
}

const revokedSession: RevocationState = {
  sessionId: "session-123",
  revoked: true,
};

const SessionRevocationExample: FC = (): ReactElement => {
  return (
    <p>
      Session {revokedSession.sessionId}: {revokedSession.revoked ? "Revoked" : "Active"}
    </p>
  );
};

// Revocation allows the server to invalidate a session before its normal
// expiration time.
//
// This can be useful after:
//
// - logout,
// - suspected account compromise,
// - password changes,
// - account suspension,
// - administrative security actions.

// ---------------------------------------------------------------------
// 26. Multiple sessions
// ---------------------------------------------------------------------

interface ActiveSession {
  readonly id: string;
  readonly device: string;
  readonly lastUsedAt: number;
}

const activeSessions: readonly ActiveSession[] = [
  {
    id: "session-123",
    device: "Browser",
    lastUsedAt: Date.now(),
  },
  {
    id: "session-456",
    device: "Mobile",
    lastUsedAt: Date.now() - 86_400_000,
  },
];

const ActiveSessionsExample: FC = (): ReactElement => {
  return (
    <ul>
      {activeSessions.map((activeSession) => (
        <li key={activeSession.id}>{activeSession.device}</li>
      ))}
    </ul>
  );
};

// An account can have multiple active sessions.
//
// A session-management interface may allow a user to:
//
// - inspect active sessions,
// - revoke an individual session,
// - revoke all other sessions.
//
// The server must perform the actual revocation.

// ---------------------------------------------------------------------
// 27. Revoke all sessions
// ---------------------------------------------------------------------

interface SessionRevocationActionProps {
  readonly onRevokeAll: () => void;
}

const RevokeAllSessions: FC<SessionRevocationActionProps> = ({ onRevokeAll }): ReactElement => {
  return (
    <button type="button" onClick={onRevokeAll}>
      Sign out other sessions
    </button>
  );
};

// "Sign out all other sessions" is a server-side operation.
//
// The server can identify the user's active sessions and invalidate the
// sessions that should no longer be accepted.

// ---------------------------------------------------------------------
// 28. Session activity metadata
// ---------------------------------------------------------------------

interface SessionMetadata {
  readonly createdAt: number;
  readonly lastUsedAt: number;
  readonly ipAddress: string;
  readonly userAgent: string;
}

const sessionMetadata: SessionMetadata = {
  createdAt: Date.now() - 3_600_000,
  lastUsedAt: Date.now(),
  ipAddress: "example-address",
  userAgent: "example-user-agent",
};

const SessionMetadataExample: FC = (): ReactElement => {
  return <p>Session activity recorded at {sessionMetadata.lastUsedAt}.</p>;
};

// Session metadata can support account-security features such as displaying
// recent sessions.
//
// IP addresses and user-agent strings are not guaranteed to uniquely identify
// a person or device and should be interpreted accordingly.

// ---------------------------------------------------------------------
// 29. Concurrent session limits
// ---------------------------------------------------------------------

interface SessionLimitPolicy {
  readonly maximumActiveSessions: number;
}

const sessionLimitPolicy: SessionLimitPolicy = {
  maximumActiveSessions: 5,
};

const SessionLimitExample: FC = (): ReactElement => {
  return <p>Maximum active sessions: {sessionLimitPolicy.maximumActiveSessions}</p>;
};

// Some applications limit the number of concurrent sessions.
//
// When a limit is reached, the server may revoke older sessions or require the
// user to explicitly terminate an existing session.
//
// The appropriate policy depends on the application's risk model.

// ---------------------------------------------------------------------
// 30. Session timeout versus token expiration
// ---------------------------------------------------------------------

interface CredentialLifetime {
  readonly sessionExpiresAt: number;
  readonly accessCredentialExpiresAt: number;
}

const credentialLifetime: CredentialLifetime = {
  sessionExpiresAt: Date.now() + 1_800_000,
  accessCredentialExpiresAt: Date.now() + 300_000,
};

const CredentialLifetimeExample: FC = (): ReactElement => {
  return <p>Authentication credentials can have different lifetimes.</p>;
};

// A system may use multiple credential lifetimes.
//
// For example:
//
// session lifetime
//     → controls the authenticated session
//
// access credential lifetime
//     → controls an individual access credential
//
// These concepts should not be conflated.

// ---------------------------------------------------------------------
// 31. Refresh mechanisms
// ---------------------------------------------------------------------

interface RefreshState {
  readonly canRefresh: boolean;
}

const refreshState: RefreshState = {
  canRefresh: true,
};

const RefreshExample: FC = (): ReactElement => {
  return <p>Credential refresh: {refreshState.canRefresh ? "Available" : "Unavailable"}</p>;
};

// Systems that use short-lived access credentials may use a refresh mechanism
// to obtain new credentials.
//
// Refresh credentials are themselves sensitive credentials and require secure
// storage, transmission, rotation, expiration, and revocation strategies.

// ---------------------------------------------------------------------
// 32. Session credentials in browser storage
// ---------------------------------------------------------------------

const BrowserStorageWarning: FC = (): ReactElement => {
  return (
    <section>
      <h2>Browser storage</h2>
      <p>
        Authentication session credentials should not be placed in client-readable storage without a specific security
        justification.
      </p>
    </section>
  );
};

// localStorage and sessionStorage are accessible to JavaScript running in the
// page.
//
// Therefore, storing session identifiers, refresh tokens, or other
// authentication credentials there can expose them to XSS.
//
// A common server-session architecture instead keeps the session identifier
// in an HttpOnly cookie.

// ---------------------------------------------------------------------
// 33. Session storage is not a security boundary
// ---------------------------------------------------------------------

interface StorageExample {
  readonly key: string;
  readonly value: string;
}

const storageExample: StorageExample = {
  key: "example",
  value: "example-value",
};

const StorageExampleComponent: FC = (): ReactElement => {
  return <p>Storage key: {storageExample.key}</p>;
};

// `sessionStorage` is scoped to a browser tab/session context, but it remains
// accessible to JavaScript running in that page.
//
// Its lifetime and scope do not make it a secure storage mechanism for
// authentication credentials.

// ---------------------------------------------------------------------
// 34. Cross-site request considerations
// ---------------------------------------------------------------------

interface SameSiteRequestPolicy {
  readonly sameSite: SameSitePolicy;
  readonly requiresCsrfDefense: boolean;
}

const sameSiteRequestPolicy: SameSiteRequestPolicy = {
  sameSite: "Lax",
  requiresCsrfDefense: true,
};

const SameSiteRequestExample: FC = (): ReactElement => {
  return <p>CSRF protection depends on the application's complete request model.</p>;
};

// Cookie-based sessions require consideration of Cross-Site Request Forgery
// (CSRF).
//
// SameSite cookies can reduce cross-site request exposure, but applications
// should evaluate their complete authentication and request architecture and
// apply appropriate CSRF defenses where needed.

// ---------------------------------------------------------------------
// 35. Session cookies and CSRF
// ---------------------------------------------------------------------

const CsrfSessionExample: FC = (): ReactElement => {
  return (
    <section>
      <h2>Cookie-based session</h2>
      <p>Browser-managed session cookies require appropriate CSRF defenses for state-changing requests.</p>
    </section>
  );
};

// A browser can automatically attach applicable cookies to requests.
//
// Therefore, an attacker who can cause a victim's browser to send a request
// may potentially trigger an authenticated state-changing operation if the
// application lacks appropriate CSRF protection.
//
// Session security and CSRF protection are related but distinct concerns.

// ---------------------------------------------------------------------
// 36. Session state in React
// ---------------------------------------------------------------------

interface CurrentUser {
  readonly id: string;
  readonly displayName: string;
}

interface SessionState {
  readonly status: "loading" | "authenticated" | "unauthenticated";
  readonly user: CurrentUser | null;
}

const sessionState: SessionState = {
  status: "authenticated",
  user: {
    id: "user-123",
    displayName: "John Doe",
  },
};

const SessionStateExample: FC = (): ReactElement => {
  if (sessionState.status === "loading") {
    return <p>Checking session...</p>;
  }

  if (sessionState.status === "unauthenticated") {
    return <p>Sign in required.</p>;
  }

  return <p>Signed in as {sessionState.user?.displayName}</p>;
};

// React can represent the current session state:
//
// loading
//     ↓
// authenticated
//
// or:
//
// loading
//     ↓
// unauthenticated
//
// The UI state is a representation of server-backed session state, not the
// security authority.

// ---------------------------------------------------------------------
// 37. Loading the current session
// ---------------------------------------------------------------------

const CurrentSessionExample: FC = (): ReactElement => {
  return (
    <section>
      <h2>Current session</h2>
      <p>The application can request the current authenticated identity from the server.</p>
    </section>
  );
};

// A common pattern is:
//
// GET /api/session
//
// The server determines the authenticated user from the session credential.
//
// The response can contain safe user information needed by the interface.
//
// The browser should not determine its own authenticated identity by reading
// or modifying arbitrary client-side values.

// ---------------------------------------------------------------------
// 38. Session expiration in the UI
// ---------------------------------------------------------------------

interface SessionExpiredProps {
  readonly expired: boolean;
}

const SessionExpired: FC<SessionExpiredProps> = ({ expired }): ReactElement => {
  if (expired) {
    return (
      <section>
        <h2>Session expired</h2>
        <p>Please sign in again.</p>
      </section>
    );
  }

  return <p>Session is active.</p>;
};

// The interface can respond to a server authentication failure by updating
// its local session state.
//
// The server's response is the authoritative signal that the session is no
// longer valid.

// ---------------------------------------------------------------------
// 39. Handling 401 responses
// ---------------------------------------------------------------------

interface UnauthorizedResponseProps {
  readonly status: number;
}

const UnauthorizedResponse: FC<UnauthorizedResponseProps> = ({ status }): ReactElement => {
  return <p>Authentication response: HTTP {status}</p>;
};

// A protected request can return HTTP 401 when the request lacks valid
// authentication.
//
// The client can then:
//
// - clear its local session representation,
// - display signed-out UI,
// - redirect to authentication,
// - or attempt an appropriate re-authentication flow.
//
// The exact behavior depends on the application.

// ---------------------------------------------------------------------
// 40. Session expiration versus authorization failure
// ---------------------------------------------------------------------

type ProtectedRequestResult = "authenticated" | "unauthenticated" | "forbidden";

interface ProtectedRequestState {
  readonly result: ProtectedRequestResult;
}

const protectedRequestState: ProtectedRequestState = {
  result: "authenticated",
};

const ProtectedRequestExample: FC = (): ReactElement => {
  return <p>Request state: {protectedRequestState.result}</p>;
};

// These states represent different security decisions:
//
// unauthenticated
//     → no valid authentication
//
// authenticated
//     → valid authentication exists
//
// forbidden
//     → authentication exists but authorization denies the operation
//
// Session management primarily concerns the authenticated state and its
// lifecycle, while authorization determines permitted operations.

// ---------------------------------------------------------------------
// 41. Password changes and sessions
// ---------------------------------------------------------------------

interface PasswordChangePolicy {
  readonly revokeExistingSessions: boolean;
}

const passwordChangePolicy: PasswordChangePolicy = {
  revokeExistingSessions: true,
};

const PasswordChangeExample: FC = (): ReactElement => {
  return (
    <p>Existing sessions may be revoked after a password change according to the application's security policy.</p>
  );
};

// A password change can be a security-sensitive account event.
//
// Applications may revoke existing sessions after password changes so that
// previously issued sessions do not remain active indefinitely.
//
// The exact policy should reflect the application's threat model and
// authentication architecture.

// ---------------------------------------------------------------------
// 42. Account compromise response
// ---------------------------------------------------------------------

type SecurityEvent = "suspicious-login" | "credential-compromise" | "account-suspension";

interface SecurityResponse {
  readonly event: SecurityEvent;
  readonly revokeSessions: boolean;
}

const securityResponse: SecurityResponse = {
  event: "credential-compromise",
  revokeSessions: true,
};

const SecurityResponseExample: FC = (): ReactElement => {
  return <p>Security event: {securityResponse.event}</p>;
};

// Security-sensitive events can trigger session revocation.
//
// This allows an application to terminate previously established sessions
// when the account's security state changes.

// ---------------------------------------------------------------------
// 43. Session concurrency and race conditions
// ---------------------------------------------------------------------

interface SessionRequest {
  readonly sessionId: string;
  readonly operation: "read" | "logout";
}

const sessionRequest: SessionRequest = {
  sessionId: "session-123",
  operation: "logout",
};

const SessionConcurrencyExample: FC = (): ReactElement => {
  return <p>Session operation: {sessionRequest.operation}</p>;
};

// Session-management systems should account for concurrent requests.
//
// For example:
//
// request A → logout
// request B → protected operation
//
// Depending on timing, both requests may reach the server close together.
//
// The server's session state and authorization logic should define whether
// request B remains valid and ensure invalidation semantics are consistent.

// ---------------------------------------------------------------------
// 44. Session fixation defense
// ---------------------------------------------------------------------

const SessionFixationDefense: FC = (): ReactElement => {
  return (
    <section>
      <h2>Session fixation defense</h2>
      <p>Authentication should establish a fresh session identifier.</p>
    </section>
  );
};

// A robust session-management system should:
//
// - accept only valid session identifiers,
// - generate unpredictable identifiers,
// - replace the session identifier after authentication,
// - invalidate the previous identifier when appropriate,
// - and avoid allowing attacker-selected identifiers to become authenticated
//   sessions.

// ---------------------------------------------------------------------
// 45. Session hijacking
// ---------------------------------------------------------------------

const SessionHijackingExample: FC = (): ReactElement => {
  return (
    <section>
      <h2>Session hijacking</h2>
      <p>Protect session credentials from theft, interception, and unauthorized reuse.</p>
    </section>
  );
};

// Session hijacking occurs when an attacker obtains a valid session credential
// and uses it as the victim.
//
// Defenses include:
//
// - HTTPS,
// - Secure cookies,
// - HttpOnly cookies,
// - appropriate SameSite configuration,
// - XSS prevention,
// - secure session identifiers,
// - reasonable session lifetimes,
// - session rotation,
// - session revocation,
// - and monitoring for suspicious activity.

// ---------------------------------------------------------------------
// 46. Session binding
// ---------------------------------------------------------------------

interface SessionBindingPolicy {
  readonly bindToIpAddress: boolean;
  readonly bindToUserAgent: boolean;
}

const sessionBindingPolicy: SessionBindingPolicy = {
  bindToIpAddress: false,
  bindToUserAgent: false,
};

const SessionBindingExample: FC = (): ReactElement => {
  return <p>Session binding requires careful consideration of reliability and security tradeoffs.</p>;
};

// Some systems attempt to bind sessions to client characteristics.
//
// Strict IP or user-agent binding can create usability problems because:
//
// - IP addresses can change,
// - users can move between networks,
// - proxies can alter observed addresses,
// - browsers can change characteristics.
//
// Such signals can contribute to risk detection, but they should not be
// assumed to provide perfect identity binding.

// ---------------------------------------------------------------------
// 47. Session monitoring
// ---------------------------------------------------------------------

interface SessionSecurityEvent {
  readonly type: "created" | "revoked" | "expired";
  readonly sessionId: string;
}

const sessionSecurityEvent: SessionSecurityEvent = {
  type: "created",
  sessionId: "session-123",
};

const SessionMonitoringExample: FC = (): ReactElement => {
  return <p>Session event: {sessionSecurityEvent.type}</p>;
};

// Session lifecycle events can support security monitoring.
//
// Useful events can include:
//
// - session creation,
// - session rotation,
// - session revocation,
// - expiration,
// - unusual authentication activity.
//
// Logs should avoid storing session identifiers or other credentials in
// plaintext when they are not required.

// ---------------------------------------------------------------------
// 48. Do not log session credentials
// ---------------------------------------------------------------------

const CredentialLoggingExample: FC = (): ReactElement => {
  return <p>Session credentials should not be written to application logs.</p>;
};

// Avoid logging sensitive values such as:
//
// session IDs
// access tokens
// refresh tokens
// passwords
//
// Logs frequently have broad access and long retention periods, making
// credential exposure especially dangerous.

// ---------------------------------------------------------------------
// 49. Session management and React Server/Client boundaries
// ---------------------------------------------------------------------

const SessionBoundaryExample: FC = (): ReactElement => {
  return (
    <section>
      <h2>Session boundary</h2>
      <p>Server-side session validation should remain outside the browser's security authority.</p>
    </section>
  );
};

// In architectures that support server-rendered components, server-side code
// can read authenticated request/session state and render appropriate content.
//
// Client components can receive safe session-derived data.
//
// Sensitive session credentials should not be unnecessarily passed into
// client-readable component props.

// ---------------------------------------------------------------------
// 50. Session context
// ---------------------------------------------------------------------

interface SessionContextValue {
  readonly status: "loading" | "authenticated" | "unauthenticated";
  readonly user: CurrentUser | null;
}

const sessionContextValue: SessionContextValue = {
  status: "authenticated",
  user: {
    id: "user-123",
    displayName: "John Doe",
  },
};

const SessionContextExample: FC = (): ReactElement => {
  return <p>Session context: {sessionContextValue.status}</p>;
};

// React context can distribute session state throughout the component tree.
//
// For example:
//
// SessionProvider
//      ↓
// navigation
// account menu
// protected UI
//
// Context is a state-distribution mechanism, not a security boundary.

// ---------------------------------------------------------------------
// 51. Protected routes
// ---------------------------------------------------------------------

interface ProtectedRouteProps {
  readonly authenticated: boolean;
  readonly children: ReactElement;
}

const ProtectedRoute: FC<ProtectedRouteProps> = ({ authenticated, children }): ReactElement => {
  if (!authenticated) {
    return <p>Sign in required.</p>;
  }

  return children;
};

// Client-side route protection can prevent unauthenticated users from seeing
// parts of the interface.
//
// It does not protect the underlying API or server resource.
//
// The server must independently validate the session for protected requests.

// ---------------------------------------------------------------------
// 52. Session state and authorization
// ---------------------------------------------------------------------

interface SessionUser {
  readonly id: string;
  readonly role: "customer" | "support" | "admin";
}

const sessionUser: SessionUser = {
  id: "user-123",
  role: "customer",
};

const SessionAndAuthorizationExample: FC = (): ReactElement => {
  return (
    <p>
      Signed in as {sessionUser.id} with role {sessionUser.role}.
    </p>
  );
};

// A session establishes the authenticated identity.
//
// Authorization determines what that identity can do.
//
// Therefore:
//
// valid session
//     ≠
// permission to perform every operation

// ---------------------------------------------------------------------
// 53. Session management responsibilities
// ---------------------------------------------------------------------

interface SessionResponsibilities {
  readonly create: boolean;
  readonly validate: boolean;
  readonly rotate: boolean;
  readonly expire: boolean;
  readonly revoke: boolean;
}

const sessionResponsibilities: SessionResponsibilities = {
  create: true,
  validate: true,
  rotate: true,
  expire: true,
  revoke: true,
};

const SessionResponsibilitiesExample: FC = (): ReactElement => {
  const responsibilities = Object.entries(sessionResponsibilities)
    .filter(([, enabled]) => enabled)
    .map(([name]) => name);

  return <p>Session responsibilities: {responsibilities.join(", ")}</p>;
};

// A complete session-management system should account for:
//
// creation
// validation
// rotation
// expiration
// revocation
//
// Treating session management as only "storing a cookie" leaves important
// lifecycle and security behavior unspecified.

// ---------------------------------------------------------------------
// 54. Integrated session-management example
// ---------------------------------------------------------------------

interface AccountSession {
  readonly user: CurrentUser | null;
  readonly status: "loading" | "authenticated" | "unauthenticated";
}

interface SessionDashboardProps {
  readonly session: AccountSession;
  readonly onLogout: () => void;
}

const SessionDashboard: FC<SessionDashboardProps> = ({ session, onLogout }): ReactElement => {
  if (session.status === "loading") {
    return <p>Checking session...</p>;
  }

  if (session.status === "unauthenticated" || !session.user) {
    return <p>Sign in to continue.</p>;
  }

  return (
    <section>
      <h2>Account</h2>
      <p>Signed in as {session.user.displayName}</p>
      <button type="button" onClick={onLogout}>
        Sign out
      </button>
    </section>
  );
};

const SessionManagementDemo: FC = (): ReactElement => {
  const session: AccountSession = {
    status: "authenticated",
    user: {
      id: "user-123",
      displayName: "John Doe",
    },
  };

  const handleLogout = (): void => {
    // A production implementation would call the server's logout endpoint.
  };

  return <SessionDashboard session={session} onLogout={handleLogout} />;
};

export default SessionManagementDemo;

// ---------------------------------------------------------------------
// 55. Session-management security checklist
// ---------------------------------------------------------------------
// - Generate session identifiers with a cryptographically secure random mechanism.
// - Use opaque, unpredictable session identifiers rather than identifiers containing sensitive information.
// - Protect session cookies with appropriate `Secure`, `HttpOnly`, and `SameSite` attributes.
// - Consider the `__Host-` cookie prefix for host-scoped session cookies.
// - Establish a fresh session identifier when authentication state changes.
// - Defend against session fixation by replacing pre-authentication identifiers after login.
// - Validate the session on protected server-side requests.
// - Use appropriate idle and absolute session timeouts.
// - Rotate or renew sessions according to the application's security requirements.
// - Invalidate sessions during logout.
// - Consider revoking existing sessions after security-sensitive account events.
// - Support session revocation when the application's threat model requires it.
// - Treat session identifiers, access tokens, and refresh tokens as sensitive credentials.
// - Do not store authentication credentials in client-readable browser storage without a specific security justification.
// - Remember that `HttpOnly` prevents direct cookie reads but does not prevent XSS or authenticated requests made by malicious same-origin JavaScript.
// - Consider CSRF defenses for cookie-based authentication and state-changing requests.
// - Do not rely on React state, protected routes, hidden buttons, or context as security boundaries.
// - Do not log session identifiers, passwords, access tokens, refresh tokens, or other authentication credentials.
// - Consider monitoring session creation, rotation, expiration, and revocation events.
// - Design concurrent session behavior and revocation semantics explicitly.
// - Treat session management and authorization as separate security concerns.
// - Keep the server authoritative for session creation, validation, expiration, and invalidation.
// - Expose only the session information the client needs to render the interface.
// - Test session creation, fixation resistance, expiration, logout, revocation, rotation, and unauthorized access.

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - A session provides continuity between otherwise stateless HTTP requests.
// - A session identifier associates subsequent requests with an authenticated identity.
// - Session identifiers are sensitive authentication credentials and should be protected accordingly.
// - Session identifiers should be opaque, unpredictable, and generated with a cryptographically secure random mechanism.
// - Server-side sessions commonly keep session state on the server while the browser stores only the session identifier.
// - Secure session cookies commonly use `Secure`, `HttpOnly`, and an appropriate `SameSite` policy.
// - `HttpOnly` prevents JavaScript from directly reading the session cookie but does not prevent XSS or authenticated requests made by malicious same-origin JavaScript.
// - `Secure` restricts cookie transmission to secure connections.
// - `SameSite` controls cross-site cookie transmission and can contribute to CSRF risk reduction.
// - The `__Host-` cookie prefix can enforce stronger host-scoping requirements for cookies.
// - Session management includes creation, validation, rotation, expiration, renewal, and revocation.
// - A fresh session identifier should be established when authentication state changes to defend against session fixation.
// - Idle timeouts limit sessions after periods of inactivity.
// - Absolute timeouts limit the maximum lifetime of a session.
// - Logout should invalidate the server-side session or credential and clear the corresponding browser state.
// - Clearing a browser cookie alone does not necessarily invalidate the server-side session.
// - Session revocation allows active credentials to be invalidated before their normal expiration.
// - Applications can support multiple active sessions and allow individual or global session revocation.
// - Password changes and other security-sensitive events may require existing sessions to be revoked according to the application's security policy.
// - Session identifiers and other authentication credentials should not be written to application logs.
// - Client-readable browser storage exposes authentication credentials to JavaScript and therefore increases their exposure to XSS.
// - Cookie-based sessions require appropriate consideration of CSRF for state-changing requests.
// - React can represent loading, authenticated, and unauthenticated session states.
// - React context can distribute session state but is not a security boundary.
// - Client-side route protection improves the interface but does not protect server resources.
// - Authentication establishes the identity associated with a session; authorization separately determines what that identity may do.
// - The server must remain authoritative for session validation, expiration, revocation, and access to protected resources.
