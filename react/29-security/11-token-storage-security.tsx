/**
 * Token Storage Security
 * =======================
 *
 * Authentication tokens and session credentials must be stored and transported in a way that
 * limits unnecessary access from browser-side JavaScript, third-party code, and other unintended
 * consumers. The storage mechanism matters because different browser storage APIs provide
 * different security properties and exposure risks.
 *
 * For browser applications, sensitive authentication credentials should generally not be stored
 * in localStorage or sessionStorage. When the architecture permits, a server-managed session
 * represented by an HttpOnly, Secure cookie can reduce direct credential exposure to JavaScript.
 */

// ---------------------------------------------------------------------
// 1. Authentication storage is a security decision
// ---------------------------------------------------------------------

// Authentication state and authentication credentials are different:
//
// authentication state
//     → "the user is signed in"
//
// authentication credential
//     → the secret or identifier that proves that state
//
// The UI may need to know whether a user is authenticated without needing
// direct access to the credential that establishes the session.

// ---------------------------------------------------------------------
// 2. Common browser storage mechanisms
// ---------------------------------------------------------------------

type StorageMechanism = "localStorage" | "sessionStorage" | "cookie" | "memory" | "IndexedDB";

interface StorageOption {
  readonly mechanism: StorageMechanism;
  readonly readableByPageJavaScript: boolean;
}

const storageOptions: readonly StorageOption[] = [
  {
    mechanism: "localStorage",
    readableByPageJavaScript: true,
  },
  {
    mechanism: "sessionStorage",
    readableByPageJavaScript: true,
  },
  {
    mechanism: "cookie",
    readableByPageJavaScript: false,
  },
  {
    mechanism: "memory",
    readableByPageJavaScript: true,
  },
  {
    mechanism: "IndexedDB",
    readableByPageJavaScript: true,
  },
];

// The exact security properties of a cookie depend on its attributes.
//
// A cookie with HttpOnly cannot be read through JavaScript, while a normal
// cookie without HttpOnly can be accessed through document.cookie.
//
// Browser storage APIs such as localStorage, sessionStorage, and IndexedDB
// remain accessible to JavaScript running in the same origin.

// ---------------------------------------------------------------------
// 3. localStorage
// ---------------------------------------------------------------------

const LocalStorageExample = (): React.ReactElement => {
  return (
    <section>
      <h2>localStorage</h2>
      <p>
        localStorage persists data across browser sessions and is readable by JavaScript running in the same origin.
      </p>
    </section>
  );
};

// Example:
//
// localStorage.setItem("theme", "dark");
//
// This is appropriate for many non-sensitive preferences.
//
// It is not an appropriate place for authentication credentials merely because
// the browser provides persistent storage.

// ---------------------------------------------------------------------
// 4. Why localStorage is risky for tokens
// ---------------------------------------------------------------------

const LocalStorageTokenRisk = (): React.ReactElement => {
  return <p>A token stored in localStorage can be read by JavaScript executing in the same origin.</p>;
};

// Example of a credential stored in client-readable storage:
//
// localStorage.setItem("accessToken", accessToken);
//
// If an XSS vulnerability allows attacker-controlled JavaScript to execute in
// the origin, that JavaScript can attempt to read the stored credential.
//
// Therefore, localStorage should not be treated as a secure authentication
// credential store.

// ---------------------------------------------------------------------
// 5. sessionStorage
// ---------------------------------------------------------------------

const SessionStorageExample = (): React.ReactElement => {
  return (
    <section>
      <h2>sessionStorage</h2>
      <p>sessionStorage is scoped to the browser's page session but remains accessible to JavaScript in that origin.</p>
    </section>
  );
};

// sessionStorage is useful when data does not need to persist beyond the
// relevant page session.
//
// Its shorter lifetime does not change the fundamental JavaScript-access
// property.
//
// A token in sessionStorage can still be exposed through XSS.

// ---------------------------------------------------------------------
// 6. localStorage versus sessionStorage
// ---------------------------------------------------------------------

interface WebStorageComparison {
  readonly mechanism: "localStorage" | "sessionStorage";
  readonly persistsAcrossSessions: boolean;
  readonly readableByJavaScript: boolean;
}

const webStorageComparison: readonly WebStorageComparison[] = [
  {
    mechanism: "localStorage",
    persistsAcrossSessions: true,
    readableByJavaScript: true,
  },
  {
    mechanism: "sessionStorage",
    persistsAcrossSessions: false,
    readableByJavaScript: true,
  },
];

const WebStorageComparisonExample = (): React.ReactElement => {
  return (
    <ul>
      {webStorageComparison.map((storage) => (
        <li key={storage.mechanism}>
          {storage.mechanism}: {storage.persistsAcrossSessions ? "persistent" : "session-scoped"}
        </li>
      ))}
    </ul>
  );
};

// The important security distinction is not:
//
// localStorage = bad
// sessionStorage = good
//
// Both are readable by page JavaScript.
//
// The storage lifetime differs, but neither provides the HttpOnly property of
// an HttpOnly cookie.

// ---------------------------------------------------------------------
// 7. IndexedDB
// ---------------------------------------------------------------------

const IndexedDbExample = (): React.ReactElement => {
  return (
    <section>
      <h2>IndexedDB</h2>
      <p>
        IndexedDB provides structured client-side storage but does not make authentication secrets inaccessible to
        JavaScript.
      </p>
    </section>
  );
};

// IndexedDB can store significantly more complex application data than
// localStorage.
//
// It should not automatically be considered a secure token vault.
//
// JavaScript running in the origin can access the database, and XSS can expose
// data stored there.

// ---------------------------------------------------------------------
// 8. Cookies
// ---------------------------------------------------------------------

interface CookieSecurityAttributes {
  readonly secure: boolean;
  readonly httpOnly: boolean;
  readonly sameSite: "Strict" | "Lax" | "None";
}

const sessionCookieAttributes: CookieSecurityAttributes = {
  secure: true,
  httpOnly: true,
  sameSite: "Strict",
};

const CookieExample = (): React.ReactElement => {
  return (
    <p>Session cookies should use restrictive security attributes appropriate to the application's architecture.</p>
  );
};

// Cookies are different from Web Storage because the browser can automatically
// attach applicable cookies to HTTP requests.
//
// This allows a server-managed session to work without exposing the session
// identifier directly to application JavaScript.

// ---------------------------------------------------------------------
// 9. HttpOnly
// ---------------------------------------------------------------------

const HttpOnlyExample = (): React.ReactElement => {
  return (
    <section>
      <h2>HttpOnly</h2>
      <p>HttpOnly prevents JavaScript from directly reading the cookie.</p>
    </section>
  );
};

// A server can issue a cookie such as:
//
// Set-Cookie: __Host-session=...; Path=/; Secure; HttpOnly; SameSite=Lax
//
// JavaScript cannot retrieve the HttpOnly cookie through:
//
// document.cookie
//
// The browser can still send the cookie with applicable requests.

// ---------------------------------------------------------------------
// 10. HttpOnly does not make a cookie universally secure
// ---------------------------------------------------------------------

const HttpOnlyLimitations = (): React.ReactElement => {
  return (
    <p>
      HttpOnly reduces direct credential theft but does not prevent XSS, CSRF, session abuse, or server-side
      authorization failures.
    </p>
  );
};

// HttpOnly specifically addresses JavaScript access to the cookie value.
//
// It does not:
//
// - prevent malicious JavaScript from executing,
// - prevent authenticated requests made by malicious same-origin JavaScript,
// - replace CSRF defenses,
// - replace server-side authorization,
// - prevent all forms of session compromise.

// ---------------------------------------------------------------------
// 11. Secure
// ---------------------------------------------------------------------

const SecureCookieExample = (): React.ReactElement => {
  return (
    <p>
      Secure instructs the browser to send the cookie only over HTTPS, subject to browser-defined exceptions such as
      localhost behavior.
    </p>
  );
};

// Secure protects the cookie during network transmission.
//
// It does not prevent JavaScript from reading the cookie value.
//
// Therefore:
//
// Secure
//     → protects transmission
//
// HttpOnly
//     → prevents JavaScript from reading the cookie value

// ---------------------------------------------------------------------
// 12. SameSite
// ---------------------------------------------------------------------

type SameSitePolicy = "Strict" | "Lax" | "None";

interface SameSiteExample {
  readonly policy: SameSitePolicy;
  readonly crossSiteTransmission: string;
}

const sameSitePolicies: readonly SameSiteExample[] = [
  {
    policy: "Strict",
    crossSiteTransmission: "most restrictive",
  },
  {
    policy: "Lax",
    crossSiteTransmission: "restricted",
  },
  {
    policy: "None",
    crossSiteTransmission: "allowed when Secure is also set",
  },
];

const SameSiteExample = (): React.ReactElement => {
  return (
    <ul>
      {sameSitePolicies.map((policy) => (
        <li key={policy.policy}>
          {policy.policy}: {policy.crossSiteTransmission}
        </li>
      ))}
    </ul>
  );
};

// SameSite controls whether cookies are sent with cross-site requests.
//
// Strict is the most restrictive policy.
//
// Lax permits some cross-site top-level navigations.
//
// None permits cross-site cookie transmission and requires Secure.
//
// The correct choice depends on the application's authentication and
// cross-site requirements.

// ---------------------------------------------------------------------
// 13. Secure session-cookie baseline
// ---------------------------------------------------------------------

const secureSessionCookie = {
  name: "__Host-session",
  attributes: ["Path=/", "Secure", "HttpOnly", "SameSite=Lax"],
} as const;

const SecureSessionCookieExample = (): React.ReactElement => {
  return (
    <ul>
      <li>Name: {secureSessionCookie.name}</li>
      {secureSessionCookie.attributes.map((attribute) => (
        <li key={attribute}>{attribute}</li>
      ))}
    </ul>
  );
};

// A common secure session-cookie design uses:
//
// __Host-
// Secure
// HttpOnly
// SameSite=Lax or Strict
// Path=/
//
// The exact SameSite policy depends on the application's requirements.

// ---------------------------------------------------------------------
// 14. __Host- cookie prefix
// ---------------------------------------------------------------------

const HostCookieExample = (): React.ReactElement => {
  return <p>A __Host- cookie must use Secure, Path=/, and no Domain attribute.</p>;
};

// The __Host- prefix imposes additional browser-enforced restrictions:
//
// Secure
// Path=/
// no Domain
//
// This binds the cookie to the host that set it and prevents a parent-domain
// cookie from being used with the __Host- name.

// ---------------------------------------------------------------------
// 15. __Secure- cookie prefix
// ---------------------------------------------------------------------

const SecurePrefixExample = (): React.ReactElement => {
  return <p>A __Secure- cookie must be set from a secure context with Secure.</p>;
};

// The __Secure- prefix requires the Secure attribute.
//
// Unlike __Host-, it does not prohibit a Domain attribute.
//
// Therefore, __Secure- and __Host- provide different scope guarantees.

// ---------------------------------------------------------------------
// 16. Cookie Domain
// ---------------------------------------------------------------------

interface CookieDomainPolicy {
  readonly domain: string | null;
  readonly sharedWithSubdomains: boolean;
}

const cookieDomainPolicy: CookieDomainPolicy = {
  domain: null,
  sharedWithSubdomains: false,
};

const CookieDomainExample = (): React.ReactElement => {
  return <p>A host-only cookie avoids sharing the credential with other subdomains.</p>;
};

// Omitting Domain creates a host-only cookie.
//
// Setting:
//
// Domain=example.com
//
// can make the cookie available to subdomains under that domain.
//
// Only use Domain when cross-subdomain cookie sharing is actually required.

// ---------------------------------------------------------------------
// 17. Cookie Path
// ---------------------------------------------------------------------

interface CookiePathPolicy {
  readonly path: string;
}

const cookiePathPolicy: CookiePathPolicy = {
  path: "/",
};

const CookiePathExample = (): React.ReactElement => {
  return <p>Cookie path: {cookiePathPolicy.path}</p>;
};

// Path controls which request paths receive the cookie.
//
// However, Path is not a security boundary for JavaScript access.
//
// An HttpOnly cookie remains inaccessible to JavaScript regardless of its
// Path, while a non-HttpOnly cookie can still be exposed through client-side
// APIs according to cookie rules.

// ---------------------------------------------------------------------
// 18. Cookie expiration
// ---------------------------------------------------------------------

interface CookieLifetime {
  readonly maxAgeSeconds: number;
}

const cookieLifetime: CookieLifetime = {
  maxAgeSeconds: 1_800,
};

const CookieLifetimeExample = (): React.ReactElement => {
  return <p>Session lifetime: {cookieLifetime.maxAgeSeconds / 60} minutes</p>;
};

// Session credentials should expire when they are no longer needed.
//
// Max-Age provides a relative lifetime.
//
// Expires provides an absolute expiration time.
//
// Shorter lifetimes can reduce the window during which an exposed credential
// remains useful.

// ---------------------------------------------------------------------
// 19. Client-readable cookies
// ---------------------------------------------------------------------

const ClientReadableCookieExample = (): React.ReactElement => {
  return <p>Cookies without HttpOnly remain accessible to JavaScript through browser cookie APIs where permitted.</p>;
};

// A cookie is not automatically secure simply because it is a cookie.
//
// This is not equivalent to an HttpOnly session cookie:
//
// document.cookie = "session=...; Secure";
//
// JavaScript can still access a cookie without HttpOnly.
//
// Sensitive session identifiers should generally not require JavaScript access.

// ---------------------------------------------------------------------
// 20. Cookie versus localStorage
// ---------------------------------------------------------------------

interface CredentialStorageComparison {
  readonly storage: string;
  readonly automaticRequestAttachment: boolean;
  readonly javascriptReadable: boolean;
}

const credentialStorageComparison: readonly CredentialStorageComparison[] = [
  {
    storage: "localStorage",
    automaticRequestAttachment: false,
    javascriptReadable: true,
  },
  {
    storage: "sessionStorage",
    automaticRequestAttachment: false,
    javascriptReadable: true,
  },
  {
    storage: "HttpOnly cookie",
    automaticRequestAttachment: true,
    javascriptReadable: false,
  },
];

const CredentialStorageComparisonExample = (): React.ReactElement => {
  return (
    <ul>
      {credentialStorageComparison.map((option) => (
        <li key={option.storage}>
          {option.storage}: {option.javascriptReadable ? "JavaScript-readable" : "not JavaScript-readable"}
        </li>
      ))}
    </ul>
  );
};

// The choice changes the request model:
//
// localStorage/sessionStorage
//     → JavaScript reads the credential
//     → JavaScript attaches it to requests
//
// HttpOnly cookie
//     → JavaScript does not read the credential
//     → browser attaches applicable cookie automatically

// ---------------------------------------------------------------------
// 21. Authorization header storage
// ---------------------------------------------------------------------

interface AuthorizationHeaderExampleProps {
  readonly accessToken: string;
}

const AuthorizationHeaderExample = ({ accessToken }: AuthorizationHeaderExampleProps): React.ReactElement => {
  void accessToken;

  return <p>Bearer tokens used from browser JavaScript must be handled as client-accessible credentials.</p>;
};

// A JavaScript-managed access token may be sent as:
//
// Authorization: Bearer <token>
//
// This requires the browser application to have access to the token.
//
// If the token is stored in localStorage, sessionStorage, React state, or
// another JavaScript-readable location, XSS can potentially access it.

// ---------------------------------------------------------------------
// 22. In-memory token storage
// ---------------------------------------------------------------------

interface MemoryCredentialProps {
  readonly token: string | null;
}

const MemoryCredentialExample = ({ token }: MemoryCredentialProps): React.ReactElement => {
  return <p>Credential available in memory: {token !== null ? "Yes" : "No"}</p>;
};

// In-memory storage can avoid persistent browser storage.
//
// For example:
//
// const [accessToken, setAccessToken] = useState<string | null>(null);
//
// This can reduce persistence-related exposure.
//
// However, the token is still accessible to JavaScript while it exists in
// memory.
//
// Therefore, memory is not equivalent to HttpOnly storage.

// ---------------------------------------------------------------------
// 23. In-memory storage tradeoff
// ---------------------------------------------------------------------

interface MemoryStorageTradeoff {
  readonly advantage: string;
  readonly limitation: string;
}

const memoryStorageTradeoff: MemoryStorageTradeoff = {
  advantage: "avoids persistent Web Storage",
  limitation: "remains accessible to application JavaScript",
};

const MemoryStorageTradeoffExample = (): React.ReactElement => {
  return (
    <p>
      {memoryStorageTradeoff.advantage}; {memoryStorageTradeoff.limitation}.
    </p>
  );
};

// In-memory storage may be appropriate for some client-side token architectures,
// particularly when persistence is deliberately avoided.
//
// It does not eliminate XSS exposure while the credential is present in
// JavaScript memory.

// ---------------------------------------------------------------------
// 24. Do not confuse persistence with security
// ---------------------------------------------------------------------

interface PersistenceSecurityExample {
  readonly persistence: "persistent" | "temporary";
  readonly javascriptAccess: "yes" | "no";
}

const persistenceSecurityExamples: readonly PersistenceSecurityExample[] = [
  {
    persistence: "persistent",
    javascriptAccess: "yes",
  },
  {
    persistence: "temporary",
    javascriptAccess: "yes",
  },
];

const PersistenceSecurityExample = (): React.ReactElement => {
  return <p>Temporary storage can still be insecure when untrusted JavaScript can access the credential.</p>;
};

// A common misconception is:
//
// "sessionStorage is safer because it disappears when the tab closes."
//
// The shorter lifetime can reduce persistence, but it does not change the fact
// that page JavaScript can read the value.

// ---------------------------------------------------------------------
// 25. Authentication state without exposing a token
// ---------------------------------------------------------------------

interface UserSummary {
  readonly id: string;
  readonly displayName: string;
}

interface AuthenticationState {
  readonly authenticated: boolean;
  readonly user: UserSummary | null;
}

const authenticationState: AuthenticationState = {
  authenticated: true,
  user: {
    id: "user-123",
    displayName: "John Doe",
  },
};

const AuthenticationStateExample = (): React.ReactElement => {
  if (!authenticationState.authenticated || !authenticationState.user) {
    return <p>Signed out.</p>;
  }

  return <p>Signed in as {authenticationState.user.displayName}.</p>;
};

// The client often needs authentication state:
//
// authenticated
// user
// permissions needed for presentation
//
// It does not necessarily need:
//
// accessToken
// refreshToken
// sessionId
//
// Keeping credentials out of general application state reduces unnecessary
// exposure.

// ---------------------------------------------------------------------
// 26. Fetching authenticated data with a session cookie
// ---------------------------------------------------------------------

interface AccountResponse {
  readonly id: string;
  readonly displayName: string;
}

const fetchAccount = async (): Promise<AccountResponse> => {
  const response = await fetch("/api/account", {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Unable to load account");
  }

  return response.json() as Promise<AccountResponse>;
};

// When authentication uses cookies, JavaScript does not need to read the
// session cookie itself.
//
// The browser can include applicable cookies when making the request.
//
// `credentials: "include"` is relevant when the request's credential mode
// requires explicit inclusion, particularly for cross-origin requests where
// credentials are otherwise omitted.

// ---------------------------------------------------------------------
// 27. Same-origin requests and cookies
// ---------------------------------------------------------------------

const loadProtectedResource = async (): Promise<Response> => {
  return fetch("/api/protected");
};

// For same-origin requests, the browser's normal credential handling can send
// applicable cookies.
//
// The server should then validate the session before returning protected data.
//
// The React component does not need access to the session identifier.

// ---------------------------------------------------------------------
// 28. Cross-origin credentialed requests
// ---------------------------------------------------------------------

interface CrossOriginRequestOptions {
  readonly credentials: RequestCredentials;
}

const crossOriginRequestOptions: CrossOriginRequestOptions = {
  credentials: "include",
};

const CrossOriginRequestExample = (): React.ReactElement => {
  return <p>Cross-origin credentialed requests require appropriate browser and server configuration.</p>;
};

// Cross-origin credentialed requests involve more than setting:
//
// credentials: "include"
//
// The server must also provide appropriate CORS behavior, and cookie attributes
// such as SameSite must permit the intended request context.
//
// Do not enable credentialed cross-origin access more broadly than necessary.

// ---------------------------------------------------------------------
// 29. CORS does not make localStorage secure
// ---------------------------------------------------------------------

const CorsStorageExample = (): React.ReactElement => {
  return <p>CORS configuration does not prevent same-origin JavaScript from reading localStorage.</p>;
};

// CORS controls whether browser JavaScript from another origin can read certain
// cross-origin responses.
//
// It does not turn localStorage into a secure credential store.
//
// JavaScript executing within the same origin can still access that origin's
// Web Storage.

// ---------------------------------------------------------------------
// 30. Same-origin scope
// ---------------------------------------------------------------------

interface Origin {
  readonly scheme: string;
  readonly host: string;
  readonly port: number;
}

const applicationOrigin: Origin = {
  scheme: "https",
  host: "example.com",
  port: 443,
};

const SameOriginExample = (): React.ReactElement => {
  return (
    <p>
      Origin: {applicationOrigin.scheme}://{applicationOrigin.host}:{applicationOrigin.port}
    </p>
  );
};

// Web Storage is separated by origin.
//
// An origin is defined by:
//
// scheme
// host
// port
//
// JavaScript from one origin cannot directly read Web Storage belonging to a
// different origin.

// ---------------------------------------------------------------------
// 31. Same-origin does not mean same application
// ---------------------------------------------------------------------

const SharedOriginExample = (): React.ReactElement => {
  return <p>Multiple applications sharing an origin also share the origin's Web Storage namespace.</p>;
};

// If multiple applications are deployed under the same origin, they can share
// access to that origin's Web Storage.
//
// Therefore, do not assume that localStorage provides isolation between
// different applications hosted at the same origin.

// ---------------------------------------------------------------------
// 32. Subdomains are different origins
// ---------------------------------------------------------------------

const SubdomainStorageExample = (): React.ReactElement => {
  return (
    <p>
      Different subdomains have different Web Storage origins, while cookie Domain rules can intentionally span
      subdomains.
    </p>
  );
};

// For example:
//
// https://app.example.com
// https://admin.example.com
//
// have different origins.
//
// Cookies have separate Domain semantics, so a cookie configured for
// example.com can potentially be sent to multiple subdomains.

// ---------------------------------------------------------------------
// 33. Token storage and XSS
// ---------------------------------------------------------------------

const XssStorageExample = (): React.ReactElement => {
  return (
    <section>
      <h2>XSS impact</h2>
      <p>Client-readable token storage gives injected JavaScript a direct place to look for credentials.</p>
    </section>
  );
};

// With client-readable storage:
//
// XSS
//   ↓
// JavaScript executes in the application origin
//   ↓
// read storage
//   ↓
// obtain token
//
// With an HttpOnly cookie:
//
// XSS
//   ↓
// JavaScript executes in the application origin
//   ↓
// cannot directly read the session cookie
//
// HttpOnly therefore changes one important consequence of XSS, but it does not
// eliminate the underlying XSS vulnerability.

// ---------------------------------------------------------------------
// 34. Token storage and CSRF
// ---------------------------------------------------------------------

const CsrfStorageExample = (): React.ReactElement => {
  return <p>Moving a credential from JavaScript storage to cookies changes the application's CSRF considerations.</p>;
};

// Cookies are automatically attached to applicable requests.
//
// This means a cookie-authenticated application must consider CSRF.
//
// Relevant defenses can include:
//
// SameSite
// CSRF tokens
// Origin validation
// appropriate server-side request validation
//
// Token storage decisions therefore affect the threat model rather than
// eliminating security requirements.

// ---------------------------------------------------------------------
// 35. Token storage and authorization
// ---------------------------------------------------------------------

interface AuthorizationCheck {
  readonly authenticated: boolean;
  readonly authorized: boolean;
}

const authorizationCheck: AuthorizationCheck = {
  authenticated: true,
  authorized: false,
};

const AuthorizationCheckExample = (): React.ReactElement => {
  return (
    <p>
      Authenticated: {authorizationCheck.authenticated ? "Yes" : "No"}; Authorized:{" "}
      {authorizationCheck.authorized ? "Yes" : "No"}
    </p>
  );
};

// Secure token storage does not replace authorization.
//
// The server must still verify:
//
// who is making the request
// what resource is being requested
// what action is being performed
// whether that user is permitted to perform it

// ---------------------------------------------------------------------
// 36. Do not store passwords
// ---------------------------------------------------------------------

interface PasswordStoragePolicy {
  readonly clientStorageAllowed: false;
  readonly serverStorageAllowed: false;
}

const passwordStoragePolicy: PasswordStoragePolicy = {
  clientStorageAllowed: false,
  serverStorageAllowed: false,
};

const PasswordStorageExample = (): React.ReactElement => {
  return <p>Passwords should not be stored as client-side credentials.</p>;
};

// A browser application should not persist a user's password in:
//
// localStorage
// sessionStorage
// cookies
// IndexedDB
// React state
//
// Passwords should be handled by the authentication system and stored on the
// server only as appropriately protected password verifiers, not plaintext
// passwords.

// ---------------------------------------------------------------------
// 37. Do not store refresh tokens in Web Storage
// ---------------------------------------------------------------------

const RefreshTokenStorageExample = (): React.ReactElement => {
  return <p>Refresh tokens should not be placed in localStorage or sessionStorage.</p>;
};

// Refresh tokens can have significant lifetime and privilege.
//
// Storing them in client-readable Web Storage gives JavaScript access to a
// credential that may be used to obtain additional access tokens.
//
// Prefer an architecture that keeps refresh credentials out of browser-readable
// storage when the authentication protocol and application architecture permit.

// ---------------------------------------------------------------------
// 38. Do not store session identifiers in Web Storage
// ---------------------------------------------------------------------

const SessionIdStorageExample = (): React.ReactElement => {
  return <p>Session identifiers should not be stored in localStorage or sessionStorage.</p>;
};

// A session identifier is itself a credential.
//
// Treating it differently from an access token merely because it is called an
// "ID" can create a serious security mistake.

// ---------------------------------------------------------------------
// 39. Do not serialize secrets into HTML
// ---------------------------------------------------------------------

interface PublicBootstrapState {
  readonly userId: string;
  readonly displayName: string;
}

const publicBootstrapState: PublicBootstrapState = {
  userId: "user-123",
  displayName: "John Doe",
};

const BootstrapStateExample = (): React.ReactElement => {
  return <p>{publicBootstrapState.displayName}</p>;
};

// Server-rendered applications sometimes embed initial state into HTML:
//
// <script>
//     window.__INITIAL_STATE__ = ...
// </script>
//
// This state is visible to browser JavaScript.
//
// Therefore, never assume that serialization into HTML creates a secret
// storage location.

// ---------------------------------------------------------------------
// 40. Avoid credentials in DOM data
// ---------------------------------------------------------------------

interface SafeDomData {
  readonly userId: string;
  readonly displayName: string;
}

const safeDomData: SafeDomData = {
  userId: "user-123",
  displayName: "John Doe",
};

const SafeDomDataExample = (): React.ReactElement => {
  return (
    <div>
      <p>{safeDomData.displayName}</p>
    </div>
  );
};

// Safe application data can be rendered into the DOM when appropriate.
//
// Sensitive credentials should not be rendered into:
//
// data-* attributes
// hidden inputs
// element IDs
// CSS classes
// accessible labels
//
// The DOM is accessible to page JavaScript.

// ---------------------------------------------------------------------
// 41. Avoid credentials in React context
// ---------------------------------------------------------------------

interface AuthContextValue {
  readonly user: UserSummary | null;
  readonly accessToken: string | null;
}

const authContextValue: AuthContextValue = {
  user: {
    id: "user-123",
    displayName: "John Doe",
  },
  accessToken: null,
};

const AuthContextExample = (): React.ReactElement => {
  return <p>Context is a state-sharing mechanism, not a credential-security boundary.</p>;
};

// React Context is useful for sharing authentication state.
//
// It does not make its values inaccessible to components.
//
// Therefore, avoid putting sensitive credentials into context unless the client
// genuinely requires them.

// ---------------------------------------------------------------------
// 42. Avoid credentials in Redux-style global state
// ---------------------------------------------------------------------

interface GlobalAuthState {
  readonly user: UserSummary | null;
  readonly accessToken: string | null;
}

const globalAuthState: GlobalAuthState = {
  user: {
    id: "user-123",
    displayName: "John Doe",
  },
  accessToken: null,
};

const GlobalStateExample = (): React.ReactElement => {
  return <p>Global state should contain only required authentication data.</p>;
};

// The same principle applies to any global state library.
//
// Zustand
// Redux
// Context
// custom stores
//
// None of these mechanisms inherently protect a credential from JavaScript.

// ---------------------------------------------------------------------
// 43. Avoid unnecessary token duplication
// ---------------------------------------------------------------------

interface TokenCopies {
  readonly storageCopies: number;
  readonly stateCopies: number;
}

const tokenCopies: TokenCopies = {
  storageCopies: 0,
  stateCopies: 0,
};

const TokenDuplicationExample = (): React.ReactElement => {
  return <p>Avoiding unnecessary credential copies reduces the number of places that must be protected.</p>;
};

// A token should not be copied unnecessarily into:
//
// localStorage
// sessionStorage
// React state
// context
// DOM attributes
// analytics payloads
// debugging objects
//
// Every additional copy increases the number of locations that can expose it.

// ---------------------------------------------------------------------
// 44. Token storage and logout
// ---------------------------------------------------------------------

const clearClientState = (): void => {
  // Clear only client-side authentication state that the application owns.
  //
  // The server must invalidate server-managed sessions or credentials.
};

const LogoutExample = (): React.ReactElement => {
  return (
    <button type="button" onClick={clearClientState}>
      Sign out
    </button>
  );
};

// Clearing React state or Web Storage is not sufficient when the real session
// exists on the server.
//
// A secure logout flow must invalidate the server-side session or otherwise
// handle the relevant credential according to the authentication architecture.

// ---------------------------------------------------------------------
// 45. Token storage and session expiration
// ---------------------------------------------------------------------

interface SessionExpiration {
  readonly expiresAt: number;
}

const sessionExpiration: SessionExpiration = {
  expiresAt: Date.now() + 1_800_000,
};

const SessionExpirationExample = (): React.ReactElement => {
  return <p>Session expiration is controlled by the authentication system.</p>;
};

// Client-side timers can update the UI when a session appears to expire, but
// the server must remain authoritative.
//
// A client should never extend a session merely because its local timer says
// that the session is still active.

// ---------------------------------------------------------------------
// 46. Token rotation
// ---------------------------------------------------------------------

interface RotationState {
  readonly rotated: boolean;
}

const rotationState: RotationState = {
  rotated: true,
};

const TokenRotationExample = (): React.ReactElement => {
  return <p>Credential rotation can reduce the useful lifetime of individual credentials.</p>;
};

// Authentication systems can rotate:
//
// session identifiers
// refresh tokens
// access tokens
//
// Rotation strategies depend on the authentication architecture and should be
// coordinated with server-side invalidation and replay detection where
// applicable.

// ---------------------------------------------------------------------
// 47. Token storage and session fixation
// ---------------------------------------------------------------------

const SessionFixationExample = (): React.ReactElement => {
  return (
    <p>
      Authentication systems should issue or rotate session identifiers appropriately when authentication state changes.
    </p>
  );
};

// A session identifier established before authentication should not simply
// remain the authenticated session identifier when the application architecture
// requires session renewal.
//
// Regenerating session identifiers at authentication boundaries can help defend
// against session fixation.

// ---------------------------------------------------------------------
// 48. Token storage and subdomain trust
// ---------------------------------------------------------------------

interface SubdomainTrust {
  readonly applicationHost: string;
  readonly trustedSubdomains: readonly string[];
}

const subdomainTrust: SubdomainTrust = {
  applicationHost: "example.com",
  trustedSubdomains: ["app.example.com"],
};

const SubdomainTrustExample = (): React.ReactElement => {
  return (
    <p>
      Cookie sharing across subdomains should be limited to domains that genuinely share the required trust boundary.
    </p>
  );
};

// A cookie with:
//
// Domain=example.com
//
// may be available to multiple subdomains.
//
// If one subdomain is compromised or operates under a different trust model,
// broad cookie scope can increase session risk.

// ---------------------------------------------------------------------
// 49. Token storage and third-party scripts
// ---------------------------------------------------------------------

const ThirdPartyScriptStorageExample = (): React.ReactElement => {
  return (
    <section>
      <h2>Third-party JavaScript</h2>
      <p>Third-party scripts should not receive unnecessary access to authentication state or credentials.</p>
    </section>
  );
};

// Client-readable tokens increase the impact of compromised third-party code.
//
// Minimize third-party scripts and avoid exposing credentials to code that does
// not need them.
//
// Security controls such as Content Security Policy and Subresource Integrity
// can provide additional defense in depth.

// ---------------------------------------------------------------------
// 50. Token storage and browser extensions
// ---------------------------------------------------------------------

const BrowserExtensionStorageExample = (): React.ReactElement => {
  return (
    <p>
      Browser-side storage should not be treated as an isolated secret vault against all code running in the user's
      browser environment.
    </p>
  );
};

// Browser extensions can have different permissions and capabilities.
//
// The application should therefore minimize the amount of sensitive material
// exposed to browser-readable JavaScript regardless of whether that JavaScript
// originates from application code or another browser capability.

// ---------------------------------------------------------------------
// 51. Token storage and client-side encryption
// ---------------------------------------------------------------------

interface EncryptedTokenExample {
  readonly ciphertext: string;
}

const encryptedTokenExample: EncryptedTokenExample = {
  ciphertext: "example-ciphertext",
};

const ClientSideEncryptionExample = (): React.ReactElement => {
  return <p>Encryption alone does not automatically make browser storage secure.</p>;
};

// A common misconception is:
//
// "If I encrypt the token before localStorage, the token is secure."
//
// If the browser also stores or can derive the decryption key, malicious
// JavaScript may potentially access both the ciphertext and the key.
//
// Client-side encryption can protect against particular storage threats, but
// it is not a substitute for sound credential architecture.

// ---------------------------------------------------------------------
// 52. Web Crypto is not a universal token-storage solution
// ---------------------------------------------------------------------

const WebCryptoExample = (): React.ReactElement => {
  return (
    <p>
      Web Crypto can provide cryptographic primitives but does not turn arbitrary browser storage into a universal
      secret vault.
    </p>
  );
};

// Cryptographic APIs can protect particular data under particular threat
// models.
//
// They do not automatically protect credentials from JavaScript that is already
// executing with the ability to use the same application's cryptographic
// operations.

// ---------------------------------------------------------------------
// 53. Storage should match the threat model
// ---------------------------------------------------------------------

interface ThreatModel {
  readonly threat: string;
  readonly relevantControl: string;
}

const threatModel: readonly ThreatModel[] = [
  {
    threat: "JavaScript reading session credentials",
    relevantControl: "HttpOnly cookies",
  },
  {
    threat: "Credential transmission over HTTP",
    relevantControl: "Secure cookies and HTTPS",
  },
  {
    threat: "Cross-site cookie transmission",
    relevantControl: "SameSite and CSRF defenses",
  },
  {
    threat: "Long-lived exposed credentials",
    relevantControl: "Short lifetimes and rotation",
  },
];

const ThreatModelExample = (): React.ReactElement => {
  return (
    <ul>
      {threatModel.map((item) => (
        <li key={item.threat}>
          {item.threat}: {item.relevantControl}
        </li>
      ))}
    </ul>
  );
};

// No storage mechanism solves every authentication threat.
//
// Storage must be considered together with:
//
// XSS defenses
// CSRF defenses
// HTTPS
// session management
// authorization
// credential lifetime
// credential rotation
// server-side validation

// ---------------------------------------------------------------------
// 54. Recommended server-managed session flow
// ---------------------------------------------------------------------

const ServerManagedSessionExample = (): React.ReactElement => {
  return (
    <ol>
      <li>User authenticates with the server.</li>
      <li>Server creates a session.</li>
      <li>Server sends an HttpOnly, Secure session cookie.</li>
      <li>Browser sends the cookie with applicable requests.</li>
      <li>Server validates the session before returning protected data.</li>
      <li>Client receives application data rather than the session secret.</li>
    </ol>
  );
};

// Conceptual flow:
//
// browser
//    ↓ credentials
// server
//    ↓
// server-side session
//    ↓
// HttpOnly cookie
//
// Later:
//
// browser
//    ↓ cookie
// server
//    ↓ session lookup
// protected response
//
// The React application can work with the authenticated result without directly
// handling the session identifier.

// ---------------------------------------------------------------------
// 55. Backend for Frontend
// ---------------------------------------------------------------------

const BackendForFrontendExample = (): React.ReactElement => {
  return (
    <section>
      <h2>Backend for Frontend</h2>
      <p>
        A BFF can keep upstream access credentials on the server while exposing only an application session to the
        browser.
      </p>
    </section>
  );
};

// Conceptual architecture:
//
// browser
//    ↓
// BFF session
//    ↓
// Backend for Frontend
//    ↓
// upstream access token
//    ↓
// protected API
//
// This can prevent upstream access tokens from being directly exposed to
// browser JavaScript.

// ---------------------------------------------------------------------
// 56. What the client should store
// ---------------------------------------------------------------------

interface ClientAuthenticationData {
  readonly authenticated: boolean;
  readonly user: UserSummary | null;
}

const clientAuthenticationData: ClientAuthenticationData = {
  authenticated: true,
  user: {
    id: "user-123",
    displayName: "John Doe",
  },
};

const ClientAuthenticationDataExample = (): React.ReactElement => {
  return (
    <section>
      <h2>Client authentication state</h2>
      <p>
        {clientAuthenticationData.authenticated
          ? `Signed in as ${clientAuthenticationData.user?.displayName}.`
          : "Signed out."}
      </p>
    </section>
  );
};

// The browser may need:
//
// authenticated
// user profile
// UI permissions
// loading state
//
// It should not receive sensitive credentials simply because authentication
// state exists.

// ---------------------------------------------------------------------
// 57. What the server should retain
// ---------------------------------------------------------------------

interface ServerSessionData {
  readonly sessionId: string;
  readonly userId: string;
  readonly createdAt: number;
  readonly expiresAt: number;
}

const serverSessionData: ServerSessionData = {
  sessionId: "opaque-session-id",
  userId: "user-123",
  createdAt: Date.now(),
  expiresAt: Date.now() + 1_800_000,
};

const ServerSessionDataExample = (): React.ReactElement => {
  return <p>Server-side session data can remain outside the browser's application state.</p>;
};

// The server can maintain sensitive session information while the browser
// receives only the information required by the UI.
//
// This separation is especially useful when the browser does not need direct
// access to upstream API credentials.

// ---------------------------------------------------------------------
// 58. Storage decision example
// ---------------------------------------------------------------------

interface StorageDecision {
  readonly data: string;
  readonly storage: string;
}

const storageDecisions: readonly StorageDecision[] = [
  {
    data: "Theme preference",
    storage: "localStorage",
  },
  {
    data: "Temporary UI state",
    storage: "React state or sessionStorage",
  },
  {
    data: "Server-managed session identifier",
    storage: "HttpOnly Secure cookie",
  },
  {
    data: "Upstream API secret",
    storage: "server-side secret storage",
  },
];

const StorageDecisionExample = (): React.ReactElement => {
  return (
    <ul>
      {storageDecisions.map((decision) => (
        <li key={decision.data}>
          {decision.data}: {decision.storage}
        </li>
      ))}
    </ul>
  );
};

// Storage should be selected according to the sensitivity and required access
// pattern of the data.
//
// Non-sensitive UI preferences can use Web Storage.
//
// Server-managed credentials should generally remain inaccessible to page
// JavaScript when the architecture allows it.

// ---------------------------------------------------------------------
// 59. Integrated authentication-state example
// ---------------------------------------------------------------------

interface Account {
  readonly id: string;
  readonly displayName: string;
}

interface AccountViewProps {
  readonly account: Account | null;
  readonly authenticated: boolean;
}

const AccountView = ({ account, authenticated }: AccountViewProps): React.ReactElement => {
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
      <p>The component receives user information without receiving the session credential.</p>
    </section>
  );
};

const TokenStorageSecurityDemo = (): React.ReactElement => {
  const account: Account = {
    id: "user-123",
    displayName: "John Doe",
  };

  return <AccountView account={account} authenticated={true} />;
};

export default TokenStorageSecurityDemo;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Authentication credentials should be stored according to their sensitivity and required access pattern.
// - localStorage is persistent and readable by JavaScript in the same origin.
// - sessionStorage is less persistent than localStorage but is also readable by JavaScript.
// - IndexedDB provides structured storage but does not prevent same-origin JavaScript from accessing its contents.
// - Do not store authentication tokens, session identifiers, refresh tokens, JWTs, or other credentials in Web Storage.
// - An XSS vulnerability can expose credentials stored in JavaScript-readable browser storage.
// - Cookies provide a different storage and request model because the browser can automatically attach applicable cookies to requests.
// - HttpOnly prevents JavaScript from directly reading the cookie value.
// - HttpOnly does not prevent XSS or malicious JavaScript from making authenticated requests.
// - Secure limits cookie transmission to HTTPS connections, subject to browser-defined exceptions such as localhost.
// - SameSite controls cross-site cookie transmission and can contribute to CSRF protection.
// - SameSite=None requires Secure.
// - A host-only cookie omits the Domain attribute and is not intentionally shared with subdomains.
// - The __Host- cookie prefix requires Secure, Path=/, and no Domain attribute.
// - The __Secure- cookie prefix requires Secure but permits a Domain attribute when otherwise valid.
// - Cookie Path controls where the browser sends the cookie but should not be treated as a JavaScript security boundary.
// - Sensitive session cookies should have appropriate expiration and should not remain valid longer than necessary.
// - A cookie without HttpOnly remains accessible to JavaScript according to normal browser cookie rules.
// - In-memory credentials avoid persistent Web Storage but remain accessible to JavaScript while they exist.
// - React state, React Context, and global state libraries are not credential-security boundaries.
// - The client often needs authentication state without needing direct access to the authentication credential.
// - Client-readable environment variables and browser-delivered source code are public to the browser context.
// - CORS does not make localStorage or other JavaScript-readable storage secure.
// - Web Storage is separated by origin, but multiple applications sharing one origin share that origin's Web Storage namespace.
// - Cookie Domain rules can intentionally share cookies across subdomains and therefore require careful trust-boundary consideration.
// - Do not store passwords in client-side browser storage.
// - Do not serialize authentication secrets into HTML, DOM attributes, hidden inputs, or client bootstrap state.
// - Avoid unnecessary duplication of credentials across storage, React state, context, DOM, logs, and telemetry.
// - Client-side encryption does not automatically protect a credential when the browser can also access the decryption key or operation.
// - Token storage decisions must account for XSS, CSRF, HTTPS, session management, authorization, expiration, and credential rotation.
// - A server-managed session can keep the session identifier outside application JavaScript while allowing the browser to authenticate requests with an HttpOnly cookie.
// - A Backend for Frontend architecture can keep upstream access credentials on the server and expose only an application session to the browser.
// - Secure token storage reduces exposure but does not replace server-side authentication and authorization.
