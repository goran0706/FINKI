/**
 * Authentication
 * ===============
 *
 * Authentication is the process of verifying that a user, service, or other entity is who they
 * claim to be. In a web application, authentication establishes an authenticated identity that
 * can then be used by the server to make authorization decisions.
 *
 * React is responsible for representing authentication state in the user interface, while the
 * server must perform the actual authentication and enforce access to protected resources.
 */

import { type FC, type ReactElement } from "react";

// ---------------------------------------------------------------------
// 1. Authentication versus authorization
// ---------------------------------------------------------------------

// Authentication answers:
//
// "Who are you?"
//
// Authorization answers:
//
// "What are you allowed to do?"
//
// These are separate security concerns.
//
// Authentication
//     ↓
// establishes identity
//
// Authorization
//     ↓
// determines permissions
//
// A React component can display authentication state, but it should not be
// treated as the authority for either security decision.

// ---------------------------------------------------------------------
// 2. Authentication flow
// ---------------------------------------------------------------------

// A simplified authentication flow is:
//
// 1. User provides credentials.
// 2. Server verifies the credentials.
// 3. Server establishes an authenticated session or issues credentials.
// 4. Browser uses those credentials for subsequent requests.
// 5. Server authenticates those requests.
// 6. Server performs authorization checks for protected operations.
//
// React primarily handles the user interface around this process.

// ---------------------------------------------------------------------
// 3. Login form
// ---------------------------------------------------------------------

interface LoginFormProps {
  readonly onSubmit: (email: string, password: string) => void;
}

const LoginForm: FC<LoginFormProps> = ({ onSubmit }): ReactElement => {
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();

        const form = new FormData(event.currentTarget);
        const email = String(form.get("email") ?? "");
        const password = String(form.get("password") ?? "");

        onSubmit(email, password);
      }}
    >
      <label>
        Email
        <input name="email" type="email" autoComplete="username" />
      </label>

      <label>
        Password
        <input name="password" type="password" autoComplete="current-password" />
      </label>

      <button type="submit">Sign in</button>
    </form>
  );
};

// The form collects credentials, but it does not authenticate the user.
//
// The server must verify the submitted credentials against the account's
// authentication data.

// ---------------------------------------------------------------------
// 4. Passwords must be verified on the server
// ---------------------------------------------------------------------

// The browser should submit credentials to the appropriate authentication
// endpoint over HTTPS.
//
// Conceptually:
//
// POST /api/login
//
// {
//     "email": "john.doe@example.com",
//     "password": "user-password"
// }
//
// The server is responsible for:
//
// - locating the account,
// - verifying the password,
// - applying account security controls,
// - establishing authentication,
// - and returning the appropriate response.
//
// React should not independently decide whether a password is correct.

// ---------------------------------------------------------------------
// 5. Password hashing
// ---------------------------------------------------------------------

// Passwords should not be stored as plaintext.
//
// A password database should contain a password hash produced by a password
// hashing function designed for password storage.
//
// Conceptually:
//
// password
//    ↓
// password hashing function
//    ↓
// password hash
//
// During login:
//
// submitted password
//    ↓
// password verification
//    ↓
// stored password hash
//
// The exact password-hashing algorithm and configuration belong to the
// server-side authentication system.

// ---------------------------------------------------------------------
// 6. Password verification is different from encryption
// ---------------------------------------------------------------------

// Password hashing and encryption solve different problems.
//
// Encryption:
//
// plaintext
//    ↓
// encrypted data
//    ↓
// decryption
//    ↓
// plaintext
//
// Password hashing:
//
// password
//    ↓
// password hash
//    ↓
// verification against a candidate password
//
// Password storage should use a password hashing scheme intended for
// password authentication rather than reversible encryption.

// ---------------------------------------------------------------------
// 7. Authentication response
// ---------------------------------------------------------------------

interface AuthenticationResponse {
  readonly authenticated: boolean;
  readonly userId?: string;
}

const AuthenticationResponseExample: FC = (): ReactElement => {
  const response: AuthenticationResponse = {
    authenticated: true,
    userId: "user-123",
  };

  return <p>{response.authenticated ? `Authenticated user: ${response.userId}` : "Not authenticated"}</p>;
};

// The server can return information indicating that authentication succeeded.
//
// Sensitive credential material does not need to be returned merely to
// represent the user's authenticated state.

// ---------------------------------------------------------------------
// 8. Session-based authentication
// ---------------------------------------------------------------------

// A common architecture uses a server-side session.
//
// Login:
//
// browser
//    ↓ credentials
// server
//    ↓
// session created
//    ↓
// session cookie
// browser
//
// Later:
//
// browser
//    ↓ session cookie
// server
//    ↓
// session lookup
//    ↓
// authenticated identity
//
// The browser does not need to contain the complete server-side session data.

// ---------------------------------------------------------------------
// 9. Session cookies
// ---------------------------------------------------------------------

// A session cookie can be configured with security attributes such as:
//
// Set-Cookie:
//     __Host-session=SESSION_VALUE;
//     Path=/;
//     Secure;
//     HttpOnly;
//     SameSite=Lax
//
// `HttpOnly` prevents JavaScript from directly reading the cookie.
//
// `Secure` restricts transmission to HTTPS connections.
//
// `SameSite` controls cross-site cookie transmission.
//
// The exact SameSite policy depends on the application's architecture.

// ---------------------------------------------------------------------
// 10. HttpOnly does not mean authenticated requests stop working
// ---------------------------------------------------------------------

const SessionStatus: FC = (): ReactElement => {
  return (
    <section>
      <h2>Authentication status</h2>
      <p>Authenticated session is active.</p>
    </section>
  );
};

// JavaScript does not need to read an HttpOnly session cookie for the browser
// to send it with an appropriate request.
//
// For example:
//
// fetch("/api/account");
//
// The browser can attach the applicable cookie automatically.
//
// This allows the server to authenticate the request without exposing the
// session identifier to application JavaScript.

// ---------------------------------------------------------------------
// 11. Client authentication state
// ---------------------------------------------------------------------

interface AuthenticatedUser {
  readonly id: string;
  readonly displayName: string;
}

interface AuthState {
  readonly isAuthenticated: boolean;
  readonly user: AuthenticatedUser | null;
}

const authState: AuthState = {
  isAuthenticated: true,
  user: {
    id: "user-123",
    displayName: "John Doe",
  },
};

// React state can represent whether the interface should display signed-in
// or signed-out content.
//
// However, this state is not the security authority.
//
// The server must independently authenticate every protected request.

// ---------------------------------------------------------------------
// 12. Authentication state can become stale
// ---------------------------------------------------------------------

const AuthenticatedContent: FC = (): ReactElement => {
  return (
    <section>
      <h2>Account</h2>
      <p>Authenticated content.</p>
    </section>
  );
};

// Client-side authentication state can become stale because:
//
// - the session may expire,
// - the user may sign out in another tab,
// - the server may revoke the session,
// - the account may become disabled,
// - the authentication context may change.
//
// Therefore, protected data must be obtained through authenticated server
// requests rather than trusting a local boolean such as:
//
// isAuthenticated === true

// ---------------------------------------------------------------------
// 13. Checking authentication with the server
// ---------------------------------------------------------------------

interface CurrentUserResponse {
  readonly user: AuthenticatedUser | null;
}

const CurrentUserExample: FC = (): ReactElement => {
  const response: CurrentUserResponse = {
    user: {
      id: "user-123",
      displayName: "John Doe",
    },
  };

  return <p>{response.user ? `Signed in as ${response.user.displayName}` : "Signed out"}</p>;
};

// A common pattern is an endpoint that returns the current authenticated
// identity:
//
// GET /api/me
//
// The server derives the identity from the authenticated request rather than
// trusting a user ID supplied by the browser.

// ---------------------------------------------------------------------
// 14. Never authenticate from client-provided identity alone
// ---------------------------------------------------------------------

interface ClientProvidedIdentityProps {
  readonly userId: string;
}

const ClientProvidedIdentityExample: FC<ClientProvidedIdentityProps> = ({ userId }): ReactElement => {
  return <p>Requested user: {userId}</p>;
};

// A value such as:
//
// GET /api/account?userId=user-123
//
// does not prove that the requester is `user-123`.
//
// The server must derive the authenticated identity from the authentication
// mechanism and then perform authorization for the requested resource.

// ---------------------------------------------------------------------
// 15. Authentication middleware
// ---------------------------------------------------------------------

// Protected request:
//
// request
//   ↓
// authentication middleware
//   ↓
// authenticated identity
//   ↓
// authorization
//   ↓
// application handler
//
// Authentication middleware can centralize verification so protected
// endpoints consistently establish the identity associated with a request.

// ---------------------------------------------------------------------
// 16. Authorization follows authentication
// ---------------------------------------------------------------------

interface ProtectedResourceProps {
  readonly resourceName: string;
}

const ProtectedResource: FC<ProtectedResourceProps> = ({ resourceName }): ReactElement => {
  return <p>Protected resource: {resourceName}</p>;
};

// The server should conceptually perform:
//
// authenticate(request)
//        ↓
// identify user
//        ↓
// authorize(user, requestedResource)
//        ↓
// return resource
//
// Successfully authenticating a user does not automatically grant access to
// every resource or operation.

// ---------------------------------------------------------------------
// 17. Login failure responses
// ---------------------------------------------------------------------

interface LoginResultProps {
  readonly message: string;
}

const LoginResult: FC<LoginResultProps> = ({ message }): ReactElement => {
  return <p role="alert">{message}</p>;
};

// Authentication interfaces should avoid unnecessarily revealing sensitive
// account information.
//
// For example, a login failure should not disclose whether a particular email
// address exists in the account database when that distinction is not needed.
//
// Generic authentication failure messages can reduce account-enumeration
// signals.

// ---------------------------------------------------------------------
// 18. Rate limiting
// ---------------------------------------------------------------------

const LoginSecurityStatus: FC = (): ReactElement => {
  return (
    <section>
      <h2>Login protection</h2>
      <p>Authentication attempts are subject to server-side controls.</p>
    </section>
  );
};

// Authentication endpoints should have appropriate protections against
// automated credential attacks.
//
// Depending on the architecture, controls can include:
//
// - rate limiting,
// - progressive delays,
// - monitoring,
// - credential-stuffing detection,
// - account protection mechanisms,
// - and additional authentication factors.
//
// These controls belong primarily on the server.

// ---------------------------------------------------------------------
// 19. Multi-factor authentication
// ---------------------------------------------------------------------

interface MfaStatusProps {
  readonly enabled: boolean;
}

const MfaStatus: FC<MfaStatusProps> = ({ enabled }): ReactElement => {
  return <p>Multi-factor authentication: {enabled ? "Enabled" : "Disabled"}</p>;
};

// Multi-factor authentication adds another authentication factor beyond the
// primary credential.
//
// Common factor categories include:
//
// - something the user knows,
// - something the user has,
// - something the user is.
//
// The authentication server must verify the required factors.

// ---------------------------------------------------------------------
// 20. Password reset is an authentication flow
// ---------------------------------------------------------------------

// Password reset should be treated as a security-sensitive authentication
// flow rather than as ordinary account functionality.
//
// A simplified flow is:
//
// request reset
//      ↓
// server creates reset mechanism
//      ↓
// user receives reset message
//      ↓
// reset mechanism is verified
//      ↓
// new password is established
//      ↓
// relevant sessions or credentials are handled appropriately
//
// Reset mechanisms should be single-use, time-limited, and sufficiently
// unpredictable.

// ---------------------------------------------------------------------
// 21. Email verification is not the same as authentication
// ---------------------------------------------------------------------

interface VerificationStatusProps {
  readonly verified: boolean;
}

const VerificationStatus: FC<VerificationStatusProps> = ({ verified }): ReactElement => {
  return <p>Email verification: {verified ? "Complete" : "Required"}</p>;
};

// Verifying control of an email address establishes a particular fact about
// the account.
//
// It should not automatically be treated as proof of every other identity
// claim associated with the user.

// ---------------------------------------------------------------------
// 22. OAuth authorization versus authentication
// ---------------------------------------------------------------------

// OAuth is an authorization framework.
//
// It allows a client to obtain delegated access to protected resources.
//
// In real-world applications, OAuth-based systems are often combined with
// OpenID Connect when the application needs standardized identity information
// and authentication.
//
// Therefore:
//
// OAuth
//    → authorization
//
// OpenID Connect
//    → identity/authentication layer built on OAuth 2.0
//
// The exact protocol flow depends on the identity provider and application.

// ---------------------------------------------------------------------
// 23. Do not implement identity-provider protocols casually
// ---------------------------------------------------------------------

// Authentication protocols contain security-sensitive details involving:
//
// - redirect URIs,
// - state,
// - nonce values,
// - authorization codes,
// - token validation,
// - issuer validation,
// - audience validation,
// - signature verification,
// - PKCE,
// - and session handling.
//
// These mechanisms should use well-maintained libraries and established
// identity-provider guidance rather than custom cryptographic or protocol
// implementations.

// ---------------------------------------------------------------------
// 24. OpenID Connect identity
// ---------------------------------------------------------------------

interface IdentityClaims {
  readonly subject: string;
  readonly name?: string;
}

const IdentityClaimsExample: FC = (): ReactElement => {
  const claims: IdentityClaims = {
    subject: "provider-specific-subject",
    name: "John Doe",
  };

  return <p>{claims.name ?? "Authenticated user"}</p>;
};

// An OpenID Connect identity is associated with claims issued by the identity
// provider.
//
// The server should validate the identity token according to the protocol
// rather than trusting arbitrary claims supplied directly by the browser.

// ---------------------------------------------------------------------
// 25. JWTs are credentials, not authentication by themselves
// ---------------------------------------------------------------------

// A JSON Web Token (JWT) is a token format.
//
// It can carry claims and can be cryptographically signed.
//
// However, using a JWT does not automatically make an authentication system
// secure.
//
// The server must validate the token according to the relevant protocol and
// application requirements, including appropriate issuer, audience,
// signature, and expiration checks when applicable.

// ---------------------------------------------------------------------
// 26. Token expiration
// ---------------------------------------------------------------------

interface TokenState {
  readonly expiresAt: number;
}

const TokenExpirationExample: FC = (): ReactElement => {
  const tokenState: TokenState = {
    expiresAt: Date.now() + 60_000,
  };

  return <p>Credential expires at: {tokenState.expiresAt}</p>;
};

// Credentials should have an appropriate lifetime.
//
// The server must reject expired credentials.
//
// Client-side timers can improve the user experience, but they must not be
// treated as the authoritative expiration check.

// ---------------------------------------------------------------------
// 27. Logout
// ---------------------------------------------------------------------

interface LogoutButtonProps {
  readonly onLogout: () => void;
}

const LogoutButton: FC<LogoutButtonProps> = ({ onLogout }): ReactElement => {
  return (
    <button type="button" onClick={onLogout}>
      Sign out
    </button>
  );
};

// Logout should invalidate or otherwise terminate the relevant authentication
// state according to the application's session architecture.
//
// For a server-side session, the server can invalidate the session and clear
// the corresponding cookie.
//
// Client-side UI state should then be updated to reflect the signed-out state.

// ---------------------------------------------------------------------
// 28. Logout is not just a React state update
// ---------------------------------------------------------------------

const IncorrectLogoutExample: FC = (): ReactElement => {
  return <p>Setting local state to signed out is not sufficient by itself.</p>;
};

// This is insufficient as the complete logout mechanism:
//
// setIsAuthenticated(false);
//
// If the server-side session remains valid, a subsequent request may still be
// authenticated.
//
// Logout therefore requires the authentication system itself to transition
// to the signed-out state.

// ---------------------------------------------------------------------
// 29. Session expiration
// ---------------------------------------------------------------------

interface SessionExpirationProps {
  readonly expired: boolean;
}

const SessionExpiration: FC<SessionExpirationProps> = ({ expired }): ReactElement => {
  return <p>{expired ? "Session expired" : "Session active"}</p>;
};

// When the server determines that a session has expired, the client should
// respond appropriately:
//
// protected request
//      ↓
// authentication failure
//      ↓
// refresh authentication state
//      ↓
// show signed-out or re-authentication UI
//
// The client should not silently assume that an old authenticated state
// remains valid.

// ---------------------------------------------------------------------
// 30. Authentication errors
// ---------------------------------------------------------------------

interface AuthenticationErrorProps {
  readonly status: number;
}

const AuthenticationError: FC<AuthenticationErrorProps> = ({ status }): ReactElement => {
  return <p role="alert">Authentication request failed with status {status}.</p>;
};

// Authentication failures should be handled explicitly.
//
// Common HTTP responses include:
//
// 401 Unauthorized
//     → the request lacks valid authentication credentials.
//
// 403 Forbidden
//     → the server understood the request but refuses the operation.
//
// The exact response behavior depends on the API and authorization model.

// ---------------------------------------------------------------------
// 31. Authentication is server-authoritative
// ---------------------------------------------------------------------

interface ServerAuthoritativeStateProps {
  readonly user: AuthenticatedUser | null;
}

const ServerAuthoritativeState: FC<ServerAuthoritativeStateProps> = ({ user }): ReactElement => {
  return <section>{user ? <p>Authenticated as {user.displayName}</p> : <p>Not authenticated</p>}</section>;
};

// A useful rule is:
//
// UI authentication state
//       ↓
// representation
//
// Server authentication state
//       ↓
// authority
//
// A user should never gain access to protected data merely because a React
// state variable says:
//
// isAuthenticated: true

// ---------------------------------------------------------------------
// 32. Protecting API requests
// ---------------------------------------------------------------------

const ProtectedDataExample: FC = (): ReactElement => {
  return (
    <section>
      <h2>Protected data</h2>
      <p>Data should be returned only after server-side authentication.</p>
    </section>
  );
};

// A protected API should verify authentication for every protected request:
//
// GET /api/account
//
// request
//    ↓
// authenticate
//    ↓
// authorize
//    ↓
// return account data
//
// Hiding a route or component in React is not an access-control mechanism.

// ---------------------------------------------------------------------
// 33. Client-side route protection
// ---------------------------------------------------------------------

interface ProtectedRouteProps {
  readonly isAuthenticated: boolean;
  readonly children: ReactElement;
}

const ProtectedRoute: FC<ProtectedRouteProps> = ({ isAuthenticated, children }): ReactElement => {
  if (!isAuthenticated) {
    return <p>Sign in required.</p>;
  }

  return children;
};

// Client-side route protection improves navigation and user experience.
//
// It does not protect the underlying resource.
//
// A user can bypass client-side UI checks by directly sending requests to the
// API.
//
// The API must therefore enforce authentication independently.

// ---------------------------------------------------------------------
// 34. Authentication context
// ---------------------------------------------------------------------

interface AuthenticationContextValue {
  readonly user: AuthenticatedUser | null;
  readonly isAuthenticated: boolean;
}

const authenticationContextValue: AuthenticationContextValue = {
  user: null,
  isAuthenticated: false,
};

// React context can distribute authentication state through a component tree.
//
// It is useful for UI concerns such as:
//
// - showing the current user,
// - deciding which navigation to render,
// - displaying sign-in controls,
// - coordinating client-side authentication state.
//
// Context is not a security boundary.

// ---------------------------------------------------------------------
// 35. Authentication context must not become a secret store
// ---------------------------------------------------------------------

interface AuthenticationContextWithToken {
  readonly user: AuthenticatedUser | null;
  readonly accessToken: string | null;
}

const AuthenticationContextExample: FC = (): ReactElement => {
  const context: AuthenticationContextWithToken = {
    user: null,
    accessToken: null,
  };

  return <p>Access token available: {context.accessToken !== null ? "Yes" : "No"}</p>;
};

// Putting an access token into React context makes that token available to
// JavaScript in the application.
//
// It does not provide isolation from XSS.
//
// Authentication state and authentication secrets should therefore be
// considered separately.

// ---------------------------------------------------------------------
// 36. Loading authentication state
// ---------------------------------------------------------------------

interface AuthenticationLoadingProps {
  readonly loading: boolean;
}

const AuthenticationLoading: FC<AuthenticationLoadingProps> = ({ loading }): ReactElement => {
  if (loading) {
    return <p>Checking authentication...</p>;
  }

  return <p>Authentication state loaded.</p>;
};

// Applications commonly have an initial state in which the client has not
// yet established whether the current server session is authenticated.
//
// A useful state model is:
//
// loading
// authenticated
// unauthenticated
//
// Avoid treating "not loaded yet" as definitively "signed out."

// ---------------------------------------------------------------------
// 37. Authentication state machine
// ---------------------------------------------------------------------

type AuthenticationStatus = "loading" | "authenticated" | "unauthenticated";

interface AuthenticationStateMachineProps {
  readonly status: AuthenticationStatus;
}

const AuthenticationStateMachine: FC<AuthenticationStateMachineProps> = ({ status }): ReactElement => {
  switch (status) {
    case "loading":
      return <p>Checking session...</p>;
    case "authenticated":
      return <p>Authenticated.</p>;
    case "unauthenticated":
      return <p>Sign in required.</p>;
  }
};

// Explicit states make authentication UI behavior easier to reason about.
//
// The server remains authoritative even when the client represents these
// states locally.

// ---------------------------------------------------------------------
// 38. Do not trust authentication-related URL parameters
// ---------------------------------------------------------------------

interface CallbackPageProps {
  readonly code: string | null;
}

const CallbackPage: FC<CallbackPageProps> = ({ code }): ReactElement => {
  return <p>Authorization response received: {code ? "Yes" : "No"}</p>;
};

// Values in the URL are attacker-controlled input unless the authentication
// protocol explicitly defines and validates them.
//
// Authentication callback flows must validate protocol parameters according
// to the identity provider's requirements.
//
// A value such as:
//
// ?authenticated=true
//
// must never be treated as proof of authentication.

// ---------------------------------------------------------------------
// 39. HTTPS
// ---------------------------------------------------------------------

const SecureTransportExample: FC = (): ReactElement => {
  return <p>Authentication credentials should be transmitted over HTTPS.</p>;
};

// Authentication credentials must be protected during transport.
//
// HTTPS provides encrypted communication between the browser and server.
//
// It does not replace:
//
// - secure credential storage,
// - server-side authentication,
// - authorization,
// - XSS prevention,
// - CSRF defenses where applicable,
// - or secure session management.

// ---------------------------------------------------------------------
// 40. Integrated authentication example
// ---------------------------------------------------------------------

interface AccountViewProps {
  readonly user: AuthenticatedUser | null;
}

const AccountView: FC<AccountViewProps> = ({ user }): ReactElement => {
  if (!user) {
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
      <p>Signed in as {user.displayName}</p>
      <LogoutButton onLogout={() => undefined} />
    </section>
  );
};

const AuthenticationDemo: FC = (): ReactElement => {
  const user: AuthenticatedUser | null = {
    id: "user-123",
    displayName: "John Doe",
  };

  return <AccountView user={user} />;
};

// This example demonstrates the UI layer of an authentication system.
//
// A production application would obtain the authenticated user from a
// server-backed authentication mechanism.
//
// The component should not decide that a user is authenticated merely because
// a client-controlled value says so.

// ---------------------------------------------------------------------
// 41. Authentication security checklist
// ---------------------------------------------------------------------

// When reviewing authentication, ask:
//
// 1. Are credentials transmitted over HTTPS?
// 2. Are passwords stored using an appropriate password hashing scheme?
// 3. Are authentication decisions made by the server?
// 4. Are session cookies protected with appropriate attributes?
// 5. Are authentication credentials unnecessarily exposed to JavaScript?
// 6. Are login endpoints protected against automated attacks?
// 7. Are authentication failures handled without unnecessary account-enumeration signals?
// 8. Are sessions expired and invalidated appropriately?
// 9. Does logout actually terminate the relevant authentication state?
// 10. Are protected API resources authenticated independently of the UI?
// 11. Are authorization checks performed after authentication?
// 12. Are third-party identity protocols implemented using established libraries and guidance?
// 13. Are authentication callback parameters validated?
// 14. Is multi-factor authentication available where appropriate?
// 15. Are password-reset and account-recovery flows protected as authentication flows?

// ---------------------------------------------------------------------
// 42. Practical guidance
// ---------------------------------------------------------------------

// Treat authentication as a server-side security boundary.
//
// React should:
//
// - collect credentials,
// - display authentication state,
// - coordinate authentication-related UI,
// - handle loading and error states,
// - and request protected data.
//
// The server should:
//
// - verify credentials,
// - establish and validate sessions,
// - validate authentication tokens,
// - determine the authenticated identity,
// - enforce authorization,
// - manage session expiration and invalidation,
// - and protect authentication endpoints.
//
// Keep authentication credentials out of client-readable state whenever the
// architecture does not require them there.

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Authentication verifies the identity associated with a request.
// - Authorization determines whether an authenticated identity may perform a particular operation.
// - React represents authentication state but is not the security authority.
// - The server must authenticate protected requests independently of client-side UI state.
// - Passwords should not be stored as plaintext and should be protected with an appropriate password hashing scheme.
// - Session-based authentication commonly uses a server-side session associated with a browser cookie.
// - HttpOnly prevents JavaScript from directly reading a session cookie.
// - Secure restricts sensitive cookie transmission to HTTPS connections.
// - SameSite controls cross-site cookie transmission and can contribute to CSRF protection.
// - Client-side `isAuthenticated` state can become stale and must not protect server resources.
// - A current-user endpoint can expose authenticated identity information without exposing the session credential.
// - Client-provided user IDs do not prove the identity of the requester.
// - Authentication should occur before authorization for protected operations.
// - Login endpoints should use appropriate protections against automated credential attacks.
// - Multi-factor authentication adds additional authentication factors to the authentication process.
// - Password-reset and account-recovery mechanisms are security-sensitive authentication flows.
// - OAuth is an authorization framework; OpenID Connect adds an identity and authentication layer.
// - JWT is a token format and does not make an authentication system secure by itself.
// - Authentication credentials should have appropriate lifetimes and server-side validation.
// - Logout must terminate the relevant authentication state rather than only changing React state.
// - Client-side route guards improve UI behavior but do not protect API resources.
// - React context is useful for distributing authentication state but is not a security boundary.
// - Authentication callback parameters must be validated according to the relevant protocol.
// - HTTPS protects authentication data during transport but does not replace other security controls.
// - Minimize authentication credential exposure to browser JavaScript whenever the architecture permits.

export default AuthenticationDemo;
