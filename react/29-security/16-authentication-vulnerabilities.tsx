/**
 * Authentication Vulnerabilities
 * ==============================
 *
 * Authentication vulnerabilities occur when an application incorrectly verifies identity,
 * handles credentials, manages recovery, or maintains authenticated sessions. Common failures
 * include credential stuffing, brute-force attacks, user enumeration, weak recovery flows,
 * missing multi-factor authentication, session fixation, and improper logout or re-authentication.
 *
 * React is responsible for presenting authentication interfaces and handling client-side state,
 * but the security-critical verification must happen on the server. The server must verify
 * credentials, enforce authentication requirements, create and invalidate sessions, and authorize
 * sensitive operations.
 */

import { useState, type FC, type FormEvent, type ReactElement } from "react";

// ---------------------------------------------------------------------
// 1. Authentication vs. authorization
// ---------------------------------------------------------------------

// Authentication answers:
// "Who is this user?"
//
// Authorization answers:
// "Is this authenticated user allowed to perform this action?"
//
// A successful login does not automatically authorize every operation.

export interface AuthenticatedUser {
  readonly id: string;
  readonly email: string;
}

export interface AuthorizedUser extends AuthenticatedUser {
  readonly role: "user" | "admin";
}

export const AuthenticationVsAuthorizationExample: FC = (): ReactElement => {
  const user: AuthorizedUser = {
    id: "user-123",
    email: "john.doe@example.com",
    role: "user",
  };

  const isAuthenticated = Boolean(user);
  const canManageUsers = user.role === "admin";

  return (
    <section>
      <p>Authenticated: {String(isAuthenticated)}</p>
      <p>Can manage users: {String(canManageUsers)}</p>
    </section>
  );
};

// ---------------------------------------------------------------------
// 2. Brute-force attacks
// ---------------------------------------------------------------------

// A brute-force attack repeatedly tries passwords against one account.
//
// The application should limit automated attempts without creating an
// account-lockout mechanism that attackers can abuse as a denial of service.

export interface LoginProtectionState {
  readonly failedAttempts: number;
  readonly temporarilyBlocked: boolean;
}

export const LoginProtectionExample: FC = (): ReactElement => {
  const [state] = useState<LoginProtectionState>({
    failedAttempts: 2,
    temporarilyBlocked: false,
  });

  return (
    <section>
      <p>Failed attempts: {state.failedAttempts}</p>
      <p>Temporarily blocked: {String(state.temporarilyBlocked)}</p>
    </section>
  );
};

// ---------------------------------------------------------------------
// 3. Credential stuffing
// ---------------------------------------------------------------------

// Credential stuffing uses username/password pairs obtained from other
// breaches and tests them against another service.
//
// This differs from brute force because the attacker may already have
// plausible credentials rather than guessing passwords randomly.
//
// MFA, breached-password screening, rate controls, and monitoring help
// reduce the impact of credential stuffing.

// ---------------------------------------------------------------------
// 4. Password spraying
// ---------------------------------------------------------------------

// Password spraying tries a small number of commonly used passwords
// against many different accounts.
//
// Per-account controls alone may not detect this pattern because each
// account receives only a small number of attempts.
//
// Detection should therefore consider broader patterns such as IP,
// account, device, and request volume.

// ---------------------------------------------------------------------
// 5. Weak passwords
// ---------------------------------------------------------------------

// Applications should not rely only on arbitrary composition rules such
// as "one uppercase, one number, and one symbol."
//
// Modern password guidance emphasizes sufficient length and blocking
// commonly used or compromised passwords.
//
// Passwords must still be stored using a password hashing mechanism
// designed for password storage, never as plaintext.

export interface PasswordPolicyResult {
  readonly accepted: boolean;
  readonly reason?: string;
}

export const evaluatePasswordPolicy = (password: string, isKnownCompromised: boolean): PasswordPolicyResult => {
  if (password.length < 12) {
    return {
      accepted: false,
      reason: "Password is too short.",
    };
  }

  if (isKnownCompromised) {
    return {
      accepted: false,
      reason: "Password has appeared in a known breach.",
    };
  }

  return { accepted: true };
};

// ---------------------------------------------------------------------
// 6. Password reuse
// ---------------------------------------------------------------------

// A strong password can still be compromised if the same password is
// reused on another service that suffers a breach.
//
// The application cannot prevent reuse across unrelated websites, but
// it can reduce the resulting risk through MFA and breached-password
// screening.

// ---------------------------------------------------------------------
// 7. Password disclosure
// ---------------------------------------------------------------------

// Passwords should not appear in:
// - URLs
// - query strings
// - logs
// - analytics events
// - error messages
// - client-side application state that is unnecessarily retained
//
// A password should normally be sent only over an encrypted connection
// to the authentication endpoint.

export const unsafePasswordLoggingExample = (email: string, password: string): void => {
  void email;
  void password;

  // Never do this:
  // console.log("Login attempt:", email, password);
};

// ---------------------------------------------------------------------
// 8. User enumeration
// ---------------------------------------------------------------------

// User enumeration occurs when an attacker can determine whether an
// account exists by observing different responses.
//
// Vulnerable examples include:
// "Email does not exist."
// "Incorrect password."
//
// Authentication and recovery endpoints should generally return
// responses that do not reveal whether a particular account exists.

export const genericLoginMessage = "Invalid username or password.";

export const genericRecoveryMessage = "If the account exists, recovery instructions will be sent.";

// ---------------------------------------------------------------------
// 9. Enumeration through HTTP differences
// ---------------------------------------------------------------------

// Enumeration can leak through more than visible text.
//
// Differences in status codes, response bodies, headers, timing, or
// other observable behavior can reveal whether an account exists.
//
// A generic UI message is therefore not sufficient if the underlying
// HTTP behavior still exposes a reliable distinction.

// ---------------------------------------------------------------------
// 10. Account lockout as a vulnerability
// ---------------------------------------------------------------------

// Locking an account after a few failures can reduce guessing, but a
// permanent or easily triggered lockout can itself become an attack.
//
// An attacker could intentionally submit invalid passwords for another
// user's account to prevent that user from logging in.
//
// Prefer carefully designed throttling, progressive delays, risk-based
// controls, and monitoring rather than assuming permanent lockout is safe.

// ---------------------------------------------------------------------
// 11. Missing multi-factor authentication
// ---------------------------------------------------------------------

// Password-only authentication makes a stolen password sufficient for
// account access.
//
// MFA adds an independent authentication factor.
//
// A password plus a second password or PIN is not true MFA because both
// values belong to the same "something you know" factor.

export type AuthenticationFactor = "knowledge" | "possession" | "inherence";

export interface AuthenticationFactors {
  readonly primary: AuthenticationFactor;
  readonly secondary: AuthenticationFactor;
}

export const mfaExample: AuthenticationFactors = {
  primary: "knowledge",
  secondary: "possession",
};

// ---------------------------------------------------------------------
// 12. MFA bypass
// ---------------------------------------------------------------------

// Adding MFA to the normal login page is not enough if another endpoint
// can silently bypass it.
//
// Recovery, alternate login methods, trusted-device flows, and account
// support procedures must not become weaker authentication paths.
//
// An attacker should not be able to obtain an authenticated session
// simply by choosing a less-protected route.

// ---------------------------------------------------------------------
// 13. MFA reset vulnerabilities
// ---------------------------------------------------------------------

// Resetting a lost MFA factor is itself a security-sensitive operation.
//
// A recovery mechanism that is easier to defeat than the MFA it replaces
// can become the effective authentication boundary.
//
// MFA recovery should require appropriate proof of account ownership and
// should invalidate or review affected credentials and sessions when
// necessary.

// ---------------------------------------------------------------------
// 14. Credential recovery vulnerabilities
// ---------------------------------------------------------------------

// Password recovery is part of authentication security.
//
// A recovery endpoint is vulnerable if it:
// - reveals whether an account exists
// - uses predictable reset tokens
// - creates long-lived tokens
// - allows token reuse
// - automatically logs users in without careful session handling
//
// Recovery tokens should be cryptographically random, single-use, stored
// securely, and expire after an appropriate period.

// ---------------------------------------------------------------------
// 15. Predictable reset tokens
// ---------------------------------------------------------------------

export interface PasswordResetToken {
  readonly value: string;
  readonly expiresAt: number;
  readonly used: boolean;
}

// This interface represents server-side state only.
// The actual token must be generated with a cryptographically secure
// random mechanism on the server.

export const isResetTokenUsable = (token: PasswordResetToken, now: number): boolean => {
  return !token.used && token.expiresAt > now;
};

// ---------------------------------------------------------------------
// 16. Password reset account takeover
// ---------------------------------------------------------------------

// A reset flow must not change the account merely because a reset request
// was submitted.
//
// The account should only be changed after the user proves control of
// the approved recovery channel through a valid reset credential.
//
// Reset requests should also be rate-limited to reduce abuse.

// ---------------------------------------------------------------------
// 17. Login CSRF
// ---------------------------------------------------------------------

// Login CSRF can occur when an attacker causes a victim's browser to
// become authenticated as the attacker's account.
//
// This can cause the victim to associate sensitive information with the
// attacker's account.
//
// Authentication flows should therefore protect state-changing requests
// against cross-site request attacks where applicable.

// ---------------------------------------------------------------------
// 18. Session fixation
// ---------------------------------------------------------------------

// Session fixation occurs when an application continues using an
// attacker-influenced session identifier after authentication.
//
// A secure authentication flow establishes a new session identifier
// after successful authentication.
//
// The old pre-authentication identifier must not become the authenticated
// session identifier.

export interface SessionTransition {
  readonly preAuthenticationSessionId: string;
  readonly postAuthenticationSessionId: string;
}

export const hasRotatedSession = (transition: SessionTransition): boolean => {
  return transition.preAuthenticationSessionId !== transition.postAuthenticationSessionId;
};

// ---------------------------------------------------------------------
// 19. Session identifier exposure
// ---------------------------------------------------------------------

// Session identifiers should not be placed in URLs.
//
// URLs can be copied, logged, stored in browser history, included in
// analytics, or leaked through referrer-related mechanisms.
//
// Secure session cookies are generally preferable for browser sessions.

export const unsafeSessionUrlExample = (): string => {
  // Never construct authenticated URLs this way:
  // return `/account?sessionId=${sessionId}`;

  return "/account";
};

// ---------------------------------------------------------------------
// 20. Session invalidation failures
// ---------------------------------------------------------------------

// Logout must invalidate the server-side session or otherwise make the
// authentication credential unusable.
//
// Clearing only a client-side React state variable does not invalidate
// a server session.

export interface SessionStatus {
  readonly authenticated: boolean;
  readonly serverSessionInvalidated: boolean;
}

export const isActuallyLoggedOut = (session: SessionStatus): boolean => {
  return !session.authenticated && session.serverSessionInvalidated;
};

// ---------------------------------------------------------------------
// 21. Missing session expiration
// ---------------------------------------------------------------------

// Long-lived sessions increase the time available to an attacker who
// obtains a valid session.
//
// Applications should define appropriate idle and absolute expiration
// policies for their risk level.
//
// High-risk operations may also require re-authentication even when the
// broader session remains valid.

// ---------------------------------------------------------------------
// 22. Re-authentication failures
// ---------------------------------------------------------------------

// Sensitive actions can require recent authentication.
//
// Examples include:
// - changing a password
// - changing MFA settings
// - adding a trusted device
// - changing payment information
// - changing important account-recovery information
//
// The server must enforce this requirement; disabling a button in React
// is not an authorization control.

export interface SensitiveActionState {
  readonly requiresRecentAuthentication: boolean;
  readonly recentlyAuthenticated: boolean;
}

export const canPerformSensitiveAction = (state: SensitiveActionState): boolean => {
  return !state.requiresRecentAuthentication || state.recentlyAuthenticated;
};

// ---------------------------------------------------------------------
// 23. Authentication state trusted from the client
// ---------------------------------------------------------------------

// Client state can improve the interface, but it cannot establish
// authentication by itself.
//
// This is unsafe as a security boundary:
//
// const isAdmin = localStorage.getItem("isAdmin") === "true";
//
// The server must derive identity and authorization from trusted
// authentication state.

export const ClientAuthenticationStateExample: FC = (): ReactElement => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <section>
      <p>UI state: {String(isAuthenticated)}</p>
      <button type="button" onClick={() => setIsAuthenticated((current) => !current)}>
        Toggle UI state
      </button>
    </section>
  );
};

// ---------------------------------------------------------------------
// 24. Authentication checks in the UI are not authorization
// ---------------------------------------------------------------------

// Conditional rendering is useful for user experience:
//
// {user.role === "admin" && <AdminPanel />}
//
// But the corresponding API operation must still perform authorization
// on the server.
//
// A malicious client can modify JavaScript, call APIs directly, or
// construct requests without using the application's UI.

// ---------------------------------------------------------------------
// 25. Trusting client-provided roles
// ---------------------------------------------------------------------

export interface ClientProvidedIdentity {
  readonly userId: string;
  readonly role: string;
}

export const UnsafeClientRoleExample: FC<{
  readonly identity: ClientProvidedIdentity;
}> = ({ identity }): ReactElement => {
  const displayAdminControls = identity.role === "admin";

  return (
    <section>
      <p>Admin controls visible: {String(displayAdminControls)}</p>
    </section>
  );
};

// The example demonstrates presentation logic only.
// The server must independently determine whether the authenticated
// principal actually has administrative privileges.

// ---------------------------------------------------------------------
// 26. Token theft and authentication compromise
// ---------------------------------------------------------------------

// A stolen bearer token can allow an attacker to act as the token's
// owner until the token expires or is revoked.
//
// Authentication security therefore includes protecting session and
// authentication credentials after login, not only protecting passwords.
//
// Browser applications should carefully choose between secure,
// appropriately scoped cookies and explicit token mechanisms.

// ---------------------------------------------------------------------
// 27. Authentication credentials in localStorage
// ---------------------------------------------------------------------

// Storing long-lived authentication credentials in JavaScript-readable
// storage can make those credentials accessible to injected scripts.
//
// HttpOnly cookies prevent JavaScript from reading the cookie value.
//
// This does not eliminate every web security risk, and cookie-based
// authentication introduces CSRF considerations that must also be handled.

// ---------------------------------------------------------------------
// 28. Default credentials
// ---------------------------------------------------------------------

// Applications and administrative interfaces must not ship with known
// default credentials.
//
// Examples such as:
//
// username: admin
// password: admin
//
// are especially dangerous when deployed to production.
//
// Administrative accounts should use strong authentication and should
// not depend on undocumented default passwords.

// ---------------------------------------------------------------------
// 29. Passwords stored incorrectly
// ---------------------------------------------------------------------

// Password storage is a server-side responsibility.
//
// Never store passwords as plaintext.
// Never use reversible encryption merely because the application needs
// to "decrypt" a password later.
// Never use fast general-purpose hashes such as plain SHA-256 as a
// substitute for a password hashing function.
//
// Password storage should use an appropriate password-hashing algorithm
// and configuration for the server environment.

// ---------------------------------------------------------------------
// 30. Authentication through insecure transport
// ---------------------------------------------------------------------

// Credentials and authentication responses must be protected in transit.
//
// Production authentication flows should use HTTPS.
//
// Secure cookies should also use the Secure attribute so browsers do not
// send them over an insecure HTTP connection.

// ---------------------------------------------------------------------
// 31. Authentication error handling
// ---------------------------------------------------------------------

export interface AuthenticationResult {
  readonly success: boolean;
  readonly message: string;
}

export const authenticate = (username: string, password: string): AuthenticationResult => {
  void username;
  void password;

  // A real implementation must perform credential verification on the
  // server. This example demonstrates the response shape only.
  return {
    success: false,
    message: genericLoginMessage,
  };
};

// ---------------------------------------------------------------------
// 32. React login form
// ---------------------------------------------------------------------

export const LoginForm: FC = (): ReactElement => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    // The browser submits credentials to an HTTPS authentication
    // endpoint in a real application. The server performs the
    // credential verification and creates the authenticated session.
    void authenticate(email, password);

    setMessage("If the credentials are valid, the server will authenticate the account.");
    setPassword("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Email
        <input type="email" value={email} autoComplete="username" onChange={(event) => setEmail(event.target.value)} />
      </label>

      <label>
        Password
        <input
          type="password"
          value={password}
          autoComplete="current-password"
          onChange={(event) => setPassword(event.target.value)}
        />
      </label>

      <button type="submit">Sign in</button>

      {message && <p>{message}</p>}
    </form>
  );
};

// ---------------------------------------------------------------------
// 33. Do not expose authentication decisions through client-only logic
// ---------------------------------------------------------------------

// This pattern is insufficient:
//
// if (password === "known-password") {
//     setIsAuthenticated(true);
// }
//
// The browser cannot safely contain the application's authentication
// secret or make the final authentication decision.
//
// Client-side validation can improve usability, but server-side
// verification is authoritative.

// ---------------------------------------------------------------------
// 34. Authentication timing differences
// ---------------------------------------------------------------------

// Authentication endpoints should avoid unnecessary timing differences
// that reveal whether an account exists.
//
// This is particularly relevant to login and password-recovery flows.
//
// Generic messages alone do not guarantee equivalent observable behavior;
// the complete request/response path must be considered.

// ---------------------------------------------------------------------
// 35. Automated attack detection
// ---------------------------------------------------------------------

export interface AuthenticationTelemetry {
  readonly accountId?: string;
  readonly sourceAddress: string;
  readonly failedAttempts: number;
  readonly suspicious: boolean;
}

export const shouldIncreaseAuthenticationProtection = (telemetry: AuthenticationTelemetry): boolean => {
  return telemetry.suspicious || telemetry.failedAttempts >= 5;
};

// Detection signals can include repeated failures, unusual login
// patterns, high request volume, and suspicious credential reuse.
//
// Detection should complement prevention rather than replace it.

// ---------------------------------------------------------------------
// 36. Security notifications
// ---------------------------------------------------------------------

// Security-sensitive events can be surfaced to users when appropriate.
//
// Examples include:
// - successful login from a new context
// - successful password change
// - MFA changes
// - new trusted-device registration
// - suspicious authentication activity
//
// Notifications should be useful and actionable rather than generating
// so much noise that users ignore them.

// ---------------------------------------------------------------------
// 37. Passkeys and phishing resistance
// ---------------------------------------------------------------------

// Passkeys use public-key cryptography through WebAuthn.
//
// The browser and authenticator use the site's origin when producing the
// authentication assertion, which helps protect against phishing sites.
//
// Passkeys can replace passwords or be used as an additional
// authentication method depending on the application's design.

// ---------------------------------------------------------------------
// 38. Authentication should have one security boundary
// ---------------------------------------------------------------------

// Every authentication entry point must enforce the same fundamental
// security requirements.
//
// This includes:
// - normal login
// - API authentication
// - password recovery
// - MFA
// - account linking
// - trusted-device enrollment
// - session restoration
// - administrative authentication
//
// An overlooked alternate path can undermine an otherwise secure login.

// ---------------------------------------------------------------------
// 39. Integrated authentication vulnerability checklist
// ---------------------------------------------------------------------

export interface AuthenticationSecurityChecklist {
  readonly mfaAvailable: boolean;
  readonly credentialsProtected: boolean;
  readonly enumerationReduced: boolean;
  readonly automatedAttacksLimited: boolean;
  readonly recoveryProtected: boolean;
  readonly sessionsRotated: boolean;
  readonly sessionsInvalidated: boolean;
  readonly sensitiveActionsReauthenticated: boolean;
}

export const authenticationSecurityChecklist: AuthenticationSecurityChecklist = {
  mfaAvailable: true,
  credentialsProtected: true,
  enumerationReduced: true,
  automatedAttacksLimited: true,
  recoveryProtected: true,
  sessionsRotated: true,
  sessionsInvalidated: true,
  sensitiveActionsReauthenticated: true,
};

// ---------------------------------------------------------------------
// 40. Complete authentication security example
// ---------------------------------------------------------------------

export const AuthenticationSecurityDemo: FC = (): ReactElement => {
  const [authenticated, setAuthenticated] = useState(false);
  const [message, setMessage] = useState("");

  const handleLogin = (): void => {
    // A real application would send credentials to the server.
    // The server would verify them, enforce MFA where required,
    // rotate the session, and establish the authenticated session.
    setAuthenticated(true);
    setMessage("Authentication state was established by the example UI.");
  };

  const handleLogout = (): void => {
    // A real application must invalidate the server-side session.
    // Clearing React state alone is not sufficient.
    setAuthenticated(false);
    setMessage("The example UI is logged out.");
  };

  return (
    <section>
      <h2>Authentication security</h2>
      <p>Authenticated: {String(authenticated)}</p>

      {!authenticated ? (
        <button type="button" onClick={handleLogin}>
          Sign in
        </button>
      ) : (
        <button type="button" onClick={handleLogout}>
          Sign out
        </button>
      )}

      {message && <p>{message}</p>}
    </section>
  );
};

export default AuthenticationSecurityDemo;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Authentication vulnerabilities can occur in login, recovery, MFA, session, and alternate authentication flows.
// - Brute force, credential stuffing, and password spraying are different automated authentication attacks.
// - MFA reduces the impact of stolen or guessed passwords, but its recovery and bypass flows must also be protected.
// - Authentication responses should avoid unnecessarily revealing whether an account exists.
// - Password recovery tokens should be unpredictable, single-use, securely stored, and short-lived.
// - Successful authentication should establish a new session rather than reusing a pre-authentication session identifier.
// - Logout must invalidate the server-side authentication state; clearing React state is not enough.
// - Authentication credentials and sessions must be protected after login, not only during password verification.
// - Client-side authentication state and role checks are presentation mechanisms, not authorization boundaries.
// - Sensitive operations may require recent authentication or step-up verification.
// - Passwords must be handled and stored using appropriate server-side security controls.
// - Passkeys use WebAuthn and public-key cryptography and can reduce several password-related attack risks.
// - Authentication security requires defense in depth across credentials, MFA, recovery, sessions, transport, monitoring, and server-side authorization.
