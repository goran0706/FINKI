/**
 * Client vs. Server Secrets
 * ==========================
 *
 * A client application runs in an environment controlled by the user, so any value delivered
 * to the client must be treated as potentially observable. A server runs in a controlled
 * environment and can keep confidential credentials outside the browser.
 *
 * The security boundary is therefore architectural: public configuration may cross from the
 * server to the client, but confidential credentials must remain on the server and be used
 * through controlled server-side operations.
 */

import { type FC, type ReactElement } from "react";

// ---------------------------------------------------------------------
// 1. Client vs. server execution
// ---------------------------------------------------------------------

// Client-side code executes in the user's browser.
//
// Server-side code executes in infrastructure controlled by the application
// operator.
//
// This distinction determines whether a value can remain confidential.
//
// Browser:
//     user-controlled environment
//
// Server:
//     application-controlled environment

export type ExecutionEnvironment = "client" | "server";

export interface ExecutionContext {
  readonly environment: ExecutionEnvironment;
  readonly canKeepSecretsConfidential: boolean;
}

export const executionContexts: readonly ExecutionContext[] = [
  {
    environment: "client",
    canKeepSecretsConfidential: false,
  },
  {
    environment: "server",
    canKeepSecretsConfidential: true,
  },
];

// ---------------------------------------------------------------------
// 2. What is a client secret?
// ---------------------------------------------------------------------

// A "client secret" is not actually confidential when it is embedded
// in browser-delivered code.
//
// Once a value reaches the browser, a user can inspect the application,
// network traffic, runtime state, and other client-visible resources.
//
// Therefore, credentials that must remain confidential cannot be
// protected by hiding them inside frontend code.

// ---------------------------------------------------------------------
// 3. Public configuration
// ---------------------------------------------------------------------

export interface PublicClientConfiguration {
  readonly apiBaseUrl: string;
  readonly applicationName: string;
  readonly publicFeatureEnabled: boolean;
}

export const publicClientConfiguration: PublicClientConfiguration = {
  apiBaseUrl: "https://example.com/api",
  applicationName: "Example Application",
  publicFeatureEnabled: true,
};

// These values are intentionally safe to expose to browser code.
//
// Public configuration should be designed with the assumption that users
// can inspect it.

// ---------------------------------------------------------------------
// 4. Server-only secrets
// ---------------------------------------------------------------------

export interface ServerSecretReferences {
  readonly databaseCredential: string;
  readonly paymentCredential: string;
  readonly signingKey: string;
}

export const serverSecretReferences: ServerSecretReferences = {
  databaseCredential: "DATABASE_CREDENTIAL",
  paymentCredential: "PAYMENT_PROVIDER_SECRET",
  signingKey: "APPLICATION_SIGNING_KEY",
};

// These are references to confidential values, not the secret values.
//
// The corresponding credentials must remain in the server-side
// environment or an appropriate secrets-management system.

// ---------------------------------------------------------------------
// 5. Browser visibility
// ---------------------------------------------------------------------

// Anything sent to the browser can potentially be observed.
//
// This includes values embedded in:
// - JavaScript bundles
// - HTML
// - CSS
// - serialized application state
// - component props
// - network responses
// - browser storage
//
// A secret should therefore never cross the server-to-client boundary.

// ---------------------------------------------------------------------
// 6. Source code does not become private because it is compiled
// ---------------------------------------------------------------------

// TypeScript and JavaScript compilation does not create a confidentiality
// boundary.
//
// This:
//
// const secret = "private-value";
//
// remains discoverable if the resulting code is delivered to the browser.
//
// Minification and bundling can make code harder to read, but they do not
// make a credential secret.

// ---------------------------------------------------------------------
// 7. Environment variables do not automatically remain server-side
// ---------------------------------------------------------------------

// Frontend build tools can replace environment-variable references with
// values during the build.
//
// Once substituted into browser code, the values become client-visible.
//
// The important question is:
//
// "Does this value reach the browser?"
//
// not:
//
// "Was this value originally stored in an environment variable?"

// ---------------------------------------------------------------------
// 8. Public environment variables
// ---------------------------------------------------------------------

export interface PublicEnvironmentConfiguration {
  readonly apiBaseUrl: string;
}

export const publicEnvironmentConfiguration: PublicEnvironmentConfiguration = {
  apiBaseUrl: "https://example.com/api",
};

// A frontend build can safely expose configuration that is intentionally
// public.
//
// The exact environment-variable prefix depends on the build system.
// For example, Vite exposes VITE_* variables to client-side code.

// ---------------------------------------------------------------------
// 9. Server environment variables
// ---------------------------------------------------------------------

export interface ServerEnvironmentConfiguration {
  readonly databaseUrl: string;
  readonly sessionSecret: string;
}

export const serverEnvironmentVariableNames: Readonly<Record<keyof ServerEnvironmentConfiguration, string>> = {
  databaseUrl: "DATABASE_URL",
  sessionSecret: "SESSION_SECRET",
};

// These names describe server-side configuration.
//
// The actual values must not be serialized into browser code.

// ---------------------------------------------------------------------
// 10. API credentials
// ---------------------------------------------------------------------

// An API credential falls into one of two broad categories:
//
// Public credential:
//     intentionally designed by the provider for browser exposure.
//
// Confidential credential:
//     grants privileged access and must remain private.
//
// The provider's documentation determines whether a particular key is
// designed to be public.

// ---------------------------------------------------------------------
// 11. Public API keys are not automatically secrets
// ---------------------------------------------------------------------

export interface PublicProviderConfiguration {
  readonly publishableKey: string;
}

export const publicProviderConfiguration: PublicProviderConfiguration = {
  publishableKey: "pk_example",
};

// Some services deliberately provide publishable identifiers for browser
// applications.
//
// A publishable key can still have restrictions such as allowed origins,
// quotas, or limited operations.
//
// It must not be confused with a provider credential that grants
// privileged server-side access.

// ---------------------------------------------------------------------
// 12. Confidential API credentials
// ---------------------------------------------------------------------

export interface ConfidentialProviderCredential {
  readonly reference: string;
}

export const confidentialProviderCredential: ConfidentialProviderCredential = {
  reference: "PAYMENT_PROVIDER_SECRET",
};

// The browser should not receive the actual confidential credential.
//
// Instead, the browser can call an application-owned backend that uses
// the credential on the server.

// ---------------------------------------------------------------------
// 13. The backend-for-frontend pattern
// ---------------------------------------------------------------------

// A common architecture is:
//
// Browser
//    |
//    | application request
//    v
// Application backend
//    |
//    | confidential credential
//    v
// Third-party API
//
// The browser never receives the third-party credential.
//
// The backend becomes the security boundary for the confidential
// operation.

// ---------------------------------------------------------------------
// 14. React component boundary
// ---------------------------------------------------------------------

export interface ClientComponentProps {
  readonly apiBaseUrl: string;
}

export const ClientComponent: FC<ClientComponentProps> = ({ apiBaseUrl }): ReactElement => {
  return (
    <section>
      <p>API: {apiBaseUrl}</p>
    </section>
  );
};

// The component receives only browser-safe configuration.
//
// A confidential credential should not be added to this interface merely
// because the component needs to perform an API operation.

// ---------------------------------------------------------------------
// 15. Server-side operation
// ---------------------------------------------------------------------

export interface ServerOperation {
  readonly endpoint: string;
  readonly credentialReference: string;
}

export const serverOperation: ServerOperation = {
  endpoint: "https://example.com/api/payment",
  credentialReference: "PAYMENT_PROVIDER_SECRET",
};

// The server can retrieve the confidential credential and use it when
// communicating with the third-party service.
//
// The credential itself does not need to be returned to the browser.

// ---------------------------------------------------------------------
// 16. Do not pass secrets through props
// ---------------------------------------------------------------------

export interface UnsafeServerProps {
  readonly apiBaseUrl: string;
  readonly privateApiCredential: string;
}

// This type demonstrates a dangerous boundary.
//
// A server-rendered application must not populate
// privateApiCredential with a real secret and serialize it to the client.
//
// The problem is not TypeScript; the problem is crossing a confidentiality
// boundary with sensitive data.

// ---------------------------------------------------------------------
// 17. Safe server-to-client props
// ---------------------------------------------------------------------

export interface SafeServerProps {
  readonly apiBaseUrl: string;
  readonly applicationName: string;
}

export const createSafeServerProps = (configuration: PublicClientConfiguration): SafeServerProps => {
  return {
    apiBaseUrl: configuration.apiBaseUrl,
    applicationName: configuration.applicationName,
  };
};

// Only intentionally public values are selected for the client.

// ---------------------------------------------------------------------
// 18. Server components and client components
// ---------------------------------------------------------------------

// In architectures that support server and client components, server
// code can access server-only resources.
//
// A client component executes in the browser and cannot be trusted with
// confidential server credentials.
//
// Server-side code can compose client components and provide them with
// public data or other values that are intentionally safe to expose.

// ---------------------------------------------------------------------
// 19. Server-generated data is not automatically public
// ---------------------------------------------------------------------

export interface ServerData {
  readonly displayName: string;
  readonly accountId: string;
}

export const serverData: ServerData = {
  displayName: "John Doe",
  accountId: "account-example",
};

// Server-generated data can be safe or sensitive depending on its
// contents.
//
// The server should deliberately select which fields are appropriate to
// send to the browser rather than serializing internal objects wholesale.

// ---------------------------------------------------------------------
// 20. Data transfer objects
// ---------------------------------------------------------------------

export interface PublicAccountData {
  readonly displayName: string;
}

export const toPublicAccountData = (data: ServerData): PublicAccountData => {
  return {
    displayName: data.displayName,
  };
};

// Explicit data-transfer objects make the server-to-client contract
// visible and reduce accidental exposure of internal fields.

// ---------------------------------------------------------------------
// 21. Server-side authorization
// ---------------------------------------------------------------------

export interface AuthorizationRequest {
  readonly userId: string;
  readonly resourceId: string;
}

export const authorizeResourceAccess = (request: AuthorizationRequest): boolean => {
  // A real implementation performs authorization against trusted
  // server-side identity and resource ownership information.
  return request.userId.length > 0 && request.resourceId.length > 0;
};

// The browser must never be the final authority for authorization.
//
// Hiding an operation in React does not prevent a user from constructing
// the corresponding HTTP request manually.

// ---------------------------------------------------------------------
// 22. Client-side authorization checks are presentation logic
// ---------------------------------------------------------------------

export interface ClientUser {
  readonly role: "user" | "admin";
}

export const ClientAuthorizationExample: FC<{
  readonly user: ClientUser;
}> = ({ user }): ReactElement => {
  return <section>{user.role === "admin" && <button type="button">Manage users</button>}</section>;
};

// This can improve the interface by hiding controls from users who
// should not normally see them.
//
// The corresponding server endpoint must still enforce authorization.

// ---------------------------------------------------------------------
// 23. Authentication cookies
// ---------------------------------------------------------------------

// A browser session can use an HttpOnly, Secure cookie so JavaScript
// cannot directly read the session cookie value.
//
// The browser can still automatically send the cookie to matching
// requests.
//
// Cookie-based authentication therefore requires additional protections
// against cross-site request forgery where applicable.

// ---------------------------------------------------------------------
// 24. HttpOnly does not make every client operation safe
// ---------------------------------------------------------------------

export interface SessionCookiePolicy {
  readonly httpOnly: boolean;
  readonly secure: boolean;
  readonly sameSite: "strict" | "lax" | "none";
}

export const sessionCookiePolicy: SessionCookiePolicy = {
  httpOnly: true,
  secure: true,
  sameSite: "lax",
};

// HttpOnly prevents JavaScript from reading the cookie through the normal
// document.cookie API.
//
// It does not prevent an attacker from using an already authenticated
// browser in every possible attack scenario.

// ---------------------------------------------------------------------
// 25. Bearer tokens
// ---------------------------------------------------------------------

// A bearer token generally grants access to whoever possesses it.
//
// If JavaScript must read a browser token, an XSS vulnerability can create
// additional exposure because injected code may access the token.
//
// Authentication architecture should therefore consider where tokens are
// stored, how long they live, how they are rotated, and how they are
// revoked.

// ---------------------------------------------------------------------
// 26. Do not move secrets into localStorage
// ---------------------------------------------------------------------

export const unsafeBrowserStorageExample = (): void => {
  // Never store a confidential server credential like this:
  //
  // localStorage.setItem("paymentSecret", secret);
  //
  // JavaScript-readable storage is not a secret store.
};

// Moving a secret from an environment variable into localStorage does not
// make the secret safer.

// ---------------------------------------------------------------------
// 27. Do not move secrets into sessionStorage
// ---------------------------------------------------------------------

export const unsafeSessionStorageExample = (): void => {
  // Never do this with a confidential credential:
  //
  // sessionStorage.setItem("privateKey", privateKey);
};

// sessionStorage is also accessible to JavaScript running in the page.

// ---------------------------------------------------------------------
// 28. Secrets in URL parameters
// ---------------------------------------------------------------------

export const safeApiUrlExample = (): string => {
  // Never put confidential credentials in URLs:
  //
  // return `/api/payment?secret=${secret}`;

  return "/api/payment";
};

// URLs can appear in browser history, logs, analytics systems, monitoring
// systems, and other infrastructure.

// ---------------------------------------------------------------------
// 29. Secrets in request bodies
// ---------------------------------------------------------------------

// Sending a secret in an HTTPS request body protects it in transit from
// ordinary network interception, but it does not make the browser a
// trustworthy place to keep that secret.
//
// If the browser must know the credential in order to send it, the user
// and client-side code can potentially inspect it.

// ---------------------------------------------------------------------
// 30. Server-side credential injection
// ---------------------------------------------------------------------

export interface ServerRequest {
  readonly method: "GET" | "POST";
  readonly path: string;
  readonly body?: string;
}

export const createServerRequest = (path: string): ServerRequest => {
  return {
    method: "POST",
    path,
  };
};

// The server can construct an outbound request and attach its private
// credential without returning that credential to the browser.

// ---------------------------------------------------------------------
// 31. Secret proxy example
// ---------------------------------------------------------------------

export interface ThirdPartyRequest {
  readonly path: string;
  readonly usesServerCredential: boolean;
}

export const createThirdPartyRequest = (path: string): ThirdPartyRequest => {
  return {
    path,
    usesServerCredential: true,
  };
};

// The browser asks the application's backend to perform an operation.
//
// The backend authenticates the user, authorizes the operation, retrieves
// the required secret, and communicates with the third-party service.

// ---------------------------------------------------------------------
// 32. Do not expose database credentials
// ---------------------------------------------------------------------

export interface DatabaseAccess {
  readonly serverOnly: boolean;
  readonly credentialReference: string;
}

export const databaseAccess: DatabaseAccess = {
  serverOnly: true,
  credentialReference: "DATABASE_URL",
};

// A browser should never connect directly to a production database using
// a database username and password.
//
// The application server should enforce authorization and mediate access.

// ---------------------------------------------------------------------
// 33. Do not expose private signing keys
// ---------------------------------------------------------------------

export interface SigningConfiguration {
  readonly privateKeyReference: string;
  readonly serverOnly: boolean;
}

export const signingConfiguration: SigningConfiguration = {
  privateKeyReference: "APPLICATION_SIGNING_KEY",
  serverOnly: true,
};

// A private signing key must remain under the control of the system that
// is authorized to sign data.
//
// A public verification key can often be distributed separately when the
// cryptographic design calls for it.

// ---------------------------------------------------------------------
// 34. Public and private cryptographic keys
// ---------------------------------------------------------------------

export interface KeyPairVisibility {
  readonly publicKey: "client-safe";
  readonly privateKey: "server-only";
}

export const keyPairVisibility: KeyPairVisibility = {
  publicKey: "client-safe",
  privateKey: "server-only",
};

// Public-key cryptography intentionally separates a distributable public
// key from a confidential private key.
//
// The private key must not be embedded in client-side application code.

// ---------------------------------------------------------------------
// 35. Encryption keys
// ---------------------------------------------------------------------

// An encryption key that must remain confidential is a secret.
//
// If browser code receives the decryption key, users or malicious scripts
// running in that browser may potentially use it.
//
// Whether browser-side encryption is appropriate depends on the threat
// model and the intended ownership of the encrypted data.

// ---------------------------------------------------------------------
// 36. Webhook secrets
// ---------------------------------------------------------------------

export interface WebhookVerificationConfiguration {
  readonly secretReference: string;
  readonly verificationEnvironment: "server";
}

export const webhookVerificationConfiguration: WebhookVerificationConfiguration = {
  secretReference: "WEBHOOK_SIGNING_SECRET",
  verificationEnvironment: "server",
};

// Webhook signatures should be verified on a trusted server boundary
// when the signing secret is confidential.
//
// The browser should not receive the webhook signing secret.

// ---------------------------------------------------------------------
// 37. Third-party OAuth credentials
// ---------------------------------------------------------------------

// OAuth has different credential types and flows.
//
// A client identifier can be intentionally public in some OAuth
// architectures.
//
// A confidential client secret must remain on the server.
//
// The correct classification depends on the OAuth client type and flow.

// ---------------------------------------------------------------------
// 38. PKCE does not turn a client secret into a secret
// ---------------------------------------------------------------------

// Public clients such as browser applications cannot safely keep a
// traditional confidential client secret.
//
// PKCE provides protection for authorization-code flows without requiring
// a browser application to possess a confidential client secret.
//
// It does not make an embedded secret confidential.

// ---------------------------------------------------------------------
// 39. Build-time secret leakage
// ---------------------------------------------------------------------

export interface BuildArtifact {
  readonly containsSecret: boolean;
  readonly distributedToBrowser: boolean;
}

export const unsafeBuildArtifact: BuildArtifact = {
  containsSecret: true,
  distributedToBrowser: true,
};

// If a secret enters a browser build artifact, it should be considered
// exposed.
//
// Removing the environment variable after deployment does not retroactively
// remove the credential from already published artifacts.

// ---------------------------------------------------------------------
// 40. Source maps
// ---------------------------------------------------------------------

// Source maps can expose additional source information when served
// publicly.
//
// They are not the primary concern if no secret exists in the source or
// generated bundle.
//
// The fundamental rule remains:
//
// Do not put confidential credentials into client source code in the
// first place.

// ---------------------------------------------------------------------
// 41. Client-visible feature flags
// ---------------------------------------------------------------------

export interface PublicFeatureFlags {
  readonly newDashboard: boolean;
  readonly experimentalSearch: boolean;
}

export const publicFeatureFlags: PublicFeatureFlags = {
  newDashboard: true,
  experimentalSearch: false,
};

// Feature flags can control client-visible product behavior.
//
// They are not security controls.
//
// A hidden client-side feature must still have server-side authorization
// if it accesses protected resources.

// ---------------------------------------------------------------------
// 42. Client vs. server API design
// ---------------------------------------------------------------------

export interface ApiBoundary {
  readonly clientCanRequest: boolean;
  readonly clientCanChooseAuthorization: boolean;
  readonly serverEnforcesAuthorization: boolean;
  readonly serverCanUsePrivateCredentials: boolean;
}

export const apiBoundary: ApiBoundary = {
  clientCanRequest: true,
  clientCanChooseAuthorization: false,
  serverEnforcesAuthorization: true,
  serverCanUsePrivateCredentials: true,
};

// The browser can request an operation.
//
// The server decides whether the authenticated principal is authorized
// and can use private credentials when contacting downstream services.

// ---------------------------------------------------------------------
// 43. Authentication before secret use
// ---------------------------------------------------------------------

export interface ProtectedOperation {
  readonly authenticated: boolean;
  readonly authorized: boolean;
}

export const canUseProtectedOperation = (operation: ProtectedOperation): boolean => {
  return operation.authenticated && operation.authorized;
};

// The backend should authenticate and authorize the caller before using a
// confidential credential on the caller's behalf.

// ---------------------------------------------------------------------
// 44. Minimize secret exposure
// ---------------------------------------------------------------------

export interface SecretExposurePolicy {
  readonly browserExposure: "none";
  readonly logging: "none";
  readonly urlExposure: "none";
  readonly accessScope: "minimal";
}

export const secretExposurePolicy: SecretExposurePolicy = {
  browserExposure: "none",
  logging: "none",
  urlExposure: "none",
  accessScope: "minimal",
};

// Secret management should minimize both the number of systems that can
// access a secret and the number of places where the value can appear.

// ---------------------------------------------------------------------
// 45. Secret rotation
// ---------------------------------------------------------------------

export interface CredentialRotationPolicy {
  readonly supported: boolean;
  readonly oldCredentialRevocable: boolean;
  readonly automated: boolean;
}

export const credentialRotationPolicy: CredentialRotationPolicy = {
  supported: true,
  oldCredentialRevocable: true,
  automated: true,
};

// Server-side credentials should have a defined rotation and revocation
// process.
//
// If a credential is exposed, changing the source code is not enough;
// the credential itself must be replaced or revoked.

// ---------------------------------------------------------------------
// 46. Secret access auditing
// ---------------------------------------------------------------------

export interface SecretAccessEvent {
  readonly consumer: string;
  readonly secretReference: string;
  readonly action: "read";
  readonly outcome: "allowed" | "denied";
}

export const exampleSecretAccessEvent: SecretAccessEvent = {
  consumer: "payments-service",
  secretReference: "PAYMENT_PROVIDER_SECRET",
  action: "read",
  outcome: "allowed",
};

// Secret-management systems can provide audit records describing which
// identities accessed which secrets and when.
//
// Audit logs should themselves be protected against unauthorized access
// and modification.

// ---------------------------------------------------------------------
// 47. Integrated server boundary
// ---------------------------------------------------------------------

export interface ServerBoundaryResult {
  readonly userAuthenticated: boolean;
  readonly operationAuthorized: boolean;
  readonly privateCredentialUsed: boolean;
  readonly privateCredentialReturned: boolean;
}

export const processProtectedOperation = (): ServerBoundaryResult => {
  return {
    userAuthenticated: true,
    operationAuthorized: true,
    privateCredentialUsed: true,
    privateCredentialReturned: false,
  };
};

// The important property is that the backend can use the credential
// internally while returning only the operation's intended result.

// ---------------------------------------------------------------------
// 48. Integrated React example
// ---------------------------------------------------------------------

export const ClientVsServerSecretsDemo: FC = (): ReactElement => {
  const configuration = publicClientConfiguration;

  return (
    <section>
      <h2>{configuration.applicationName}</h2>
      <p>API: {configuration.apiBaseUrl}</p>
      <p>Confidential credentials remain on the server and are never rendered into this component.</p>
    </section>
  );
};

export default ClientVsServerSecretsDemo;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Browser code executes in a user-controlled environment and cannot provide a confidentiality boundary for secrets.
// - Anything deliberately delivered to the browser should be treated as potentially observable.
// - Public configuration can safely cross into client-side code when it is intentionally designed for public exposure.
// - Confidential credentials such as database passwords, private keys, signing keys, and private API credentials must remain server-side.
// - Compiling, bundling, minifying, or hiding a secret behind an environment-variable name does not make it confidential.
// - Frontend environment variables are safe only when their values are safe for browser exposure.
// - Public provider keys and confidential provider credentials must be distinguished according to the provider's documented security model.
// - A backend-for-frontend can use confidential credentials without exposing them to the browser.
// - Server-to-client props should contain only intentionally public data.
// - Explicit data-transfer objects reduce accidental exposure of internal server fields.
// - Client-side authorization checks can control presentation but cannot enforce authorization.
// - Authentication cookies can be HttpOnly and Secure, but cookie-based authentication still requires appropriate CSRF protections.
// - JavaScript-readable localStorage and sessionStorage are not appropriate secret stores.
// - Confidential credentials should not be placed in URLs, browser state, or client-visible request data merely to support frontend operations.
// - Database credentials and private signing keys must remain behind trusted server boundaries.
// - Public cryptographic keys can be distributed when the cryptographic design requires it; private keys must remain confidential.
// - Browser applications cannot safely protect traditional confidential OAuth client secrets; public-client flows use architectures such as PKCE instead.
// - Feature flags are product configuration, not authorization controls.
// - Protected backend operations should authenticate and authorize the caller before using private downstream credentials.
// - Secret exposure should be minimized through least privilege, auditing, rotation, and revocation.
// - React consumes public data and communicates with backend boundaries; it should not function as a secret store.
