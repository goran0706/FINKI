/**
 * Secret Management
 * ==================
 *
 * Secret management is the process of securely creating, storing, accessing, rotating,
 * revoking, auditing, and deleting sensitive credentials used by applications and
 * infrastructure. Secrets include API credentials, database passwords, private keys,
 * signing keys, service credentials, and other values that must not be disclosed to
 * unauthorized parties.
 *
 * A React application should never be the final security boundary for a secret. Browser
 * code and anything deliberately sent to the browser must be treated as public. Sensitive
 * credentials should remain in server-side infrastructure or a dedicated secrets-management
 * system, with access controlled according to least privilege.
 */

import { type FC, type ReactElement } from "react";

// ---------------------------------------------------------------------
// 1. What is a secret?
// ---------------------------------------------------------------------

// A secret is sensitive data whose disclosure could allow an attacker to
// authenticate, authorize actions, decrypt protected data, sign data,
// access infrastructure, or impersonate a trusted system.
//
// Common examples include:
// - API credentials
// - database passwords
// - private keys
// - signing keys
// - service-account credentials
// - webhook secrets
// - encryption keys
// - access tokens

export type SecretKind =
  | "api-credential"
  | "database-credential"
  | "private-key"
  | "signing-key"
  | "service-credential"
  | "webhook-secret"
  | "encryption-key"
  | "access-token";

export interface SecretMetadata {
  readonly name: string;
  readonly kind: SecretKind;
  readonly owner: string;
}

export const exampleSecretMetadata: SecretMetadata = {
  name: "PAYMENT_PROVIDER_SECRET",
  kind: "api-credential",
  owner: "payments-service",
};

// ---------------------------------------------------------------------
// 2. Secret vs. public configuration
// ---------------------------------------------------------------------

// Not every configuration value is a secret.
//
// Public configuration may safely be delivered to the browser:
//
// API base URL
// application name
// public feature configuration
//
// A secret must remain confidential:
//
// database password
// private API credential
// signing key
// encryption key
//
// The classification depends on what the value allows an attacker to do,
// not simply on whether the value is stored in an environment variable.

// ---------------------------------------------------------------------
// 3. Browser code is not a secret store
// ---------------------------------------------------------------------

// Anything delivered to a browser should be considered observable by
// the user.
//
// Users can inspect:
// - JavaScript bundles
// - network requests
// - browser storage
// - runtime values
// - developer tools
//
// Therefore, a React component must never contain a credential that must
// remain confidential.

export const browserSafeConfiguration = {
  apiBaseUrl: "https://example.com/api",
  applicationName: "Example Application",
} as const;

// These values are intentionally public configuration.

// ---------------------------------------------------------------------
// 4. Never hardcode secrets
// ---------------------------------------------------------------------

// Never do this:
//
// const apiSecret = "real-secret";
// const databasePassword = "real-password";
// const signingKey = "real-signing-key";
//
// Source code is copied, reviewed, cached, backed up, and distributed.
//
// Removing the value from the latest source file does not remove it from
// previous Git commits, build artifacts, logs, or backups.

// ---------------------------------------------------------------------
// 5. Never commit secrets to version control
// ---------------------------------------------------------------------

// Secret values should not be committed to Git repositories.
//
// This includes:
// - source files
// - JSON configuration
// - YAML files
// - test fixtures
// - shell scripts
// - CI configuration
// - documentation
//
// A secret accidentally committed to a repository should be treated as
// exposed and rotated or revoked as appropriate.
//
// Deleting the file in a later commit does not erase the secret from
// repository history.

// ---------------------------------------------------------------------
// 6. .env files are not secret-management systems
// ---------------------------------------------------------------------

// A .env file can be useful for local development configuration.
//
// It is not, by itself, a secure secret-management solution.
//
// A local .env file may still be:
// - copied
// - committed accidentally
// - included in backups
// - printed by debugging tools
// - exposed through incorrect deployment configuration
//
// Secret-bearing local files should normally be excluded from version
// control.

// ---------------------------------------------------------------------
// 7. Environment variables are an injection mechanism
// ---------------------------------------------------------------------

export interface ServerConfiguration {
  readonly databaseUrl: string;
  readonly sessionSecret: string;
}

export const serverConfigurationNames: Readonly<Record<keyof ServerConfiguration, string>> = {
  databaseUrl: "DATABASE_URL",
  sessionSecret: "SESSION_SECRET",
};

// Environment variables can be one way for a server process to receive
// configuration.
//
// They do not automatically provide the access control, auditing,
// rotation, lifecycle management, or isolation expected from a dedicated
// secrets-management system.

// ---------------------------------------------------------------------
// 8. Dedicated secret-management systems
// ---------------------------------------------------------------------

// A secrets-management system centralizes capabilities such as:
//
// - secret storage
// - access control
// - auditing
// - rotation
// - expiration
// - revocation
// - secret versioning
//
// Examples include cloud-provider secret managers and dedicated systems
// such as HashiCorp Vault.
//
// The exact product is an architectural choice; the security properties
// are the important part.

// ---------------------------------------------------------------------
// 9. Centralize secret management
// ---------------------------------------------------------------------

// Centralization makes it easier to answer:
//
// Who can access this secret?
// What service uses it?
// When was it rotated?
// When does it expire?
// How is it revoked?
// What should happen if it is compromised?
//
// Scattering credentials across source files, deployment manifests,
// scripts, and developer machines makes these questions harder to answer.

// ---------------------------------------------------------------------
// 10. Least privilege
// ---------------------------------------------------------------------

export interface SecretAccessPolicy {
  readonly secretName: string;
  readonly consumer: string;
  readonly allowedOperations: readonly ("read" | "rotate")[];
}

export const paymentSecretAccessPolicy: SecretAccessPolicy = {
  secretName: "PAYMENT_PROVIDER_SECRET",
  consumer: "payments-service",
  allowedOperations: ["read"],
};

// A service should receive access only to the secrets it requires.
//
// A service that only needs to read a credential should not automatically
// receive permission to delete or rotate every secret in the system.

// ---------------------------------------------------------------------
// 11. Separate secrets by service
// ---------------------------------------------------------------------

// Avoid using one credential across unrelated services:
//
// application A -> SHARED_ADMIN_PASSWORD
// application B -> SHARED_ADMIN_PASSWORD
// application C -> SHARED_ADMIN_PASSWORD
//
// If that credential is compromised, the blast radius can span all
// consumers.
//
// Prefer distinct credentials with narrowly scoped permissions.

// ---------------------------------------------------------------------
// 12. Avoid the "big secret"
// ---------------------------------------------------------------------

// A single highly privileged credential creates a large blast radius.
//
// Prefer:
//
// frontend backend -> limited API credential
// payments service -> payment credential
// reporting service -> read-only database credential
//
// instead of:
//
// every service -> organization-wide administrator credential

export interface ServiceCredential {
  readonly service: string;
  readonly permissions: readonly string[];
}

export const serviceCredentials: readonly ServiceCredential[] = [
  {
    service: "payments-service",
    permissions: ["payments:read", "payments:write"],
  },
  {
    service: "reporting-service",
    permissions: ["reports:read"],
  },
];

// ---------------------------------------------------------------------
// 13. Secret lifecycle
// ---------------------------------------------------------------------

export type SecretLifecycleStage =
  "creation" | "distribution" | "use" | "rotation" | "revocation" | "expiration" | "deletion";

export const secretLifecycle: readonly SecretLifecycleStage[] = [
  "creation",
  "distribution",
  "use",
  "rotation",
  "revocation",
  "expiration",
  "deletion",
];

// A secure design considers the complete lifecycle rather than only the
// storage location of the secret.

// ---------------------------------------------------------------------
// 14. Secure secret creation
// ---------------------------------------------------------------------

// Secrets should be generated with cryptographically secure mechanisms
// appropriate for their purpose.
//
// Do not create credentials from predictable values such as:
//
// Date.now()
// username
// application name
// incremental counters
//
// The secret-management system or an appropriate cryptographic API
// should perform secure generation.

// ---------------------------------------------------------------------
// 15. Secure secret distribution
// ---------------------------------------------------------------------

// A secret must reach its consumer without being unnecessarily exposed.
//
// Prefer controlled machine-to-machine retrieval over copying a secret
// through:
// - chat messages
// - source files
// - tickets
// - email
// - screenshots
// - documentation
//
// The consumer should authenticate to the secret-management system and
// receive only the secrets it is authorized to access.

// ---------------------------------------------------------------------
// 16. Secret retrieval at runtime
// ---------------------------------------------------------------------

export interface SecretReference {
  readonly name: string;
  readonly version?: string;
}

export const databaseSecretReference: SecretReference = {
  name: "production/database",
};

// A service can retrieve a secret using its workload identity or another
// controlled authentication mechanism.
//
// The application does not need to contain the secret in its source code.

// ---------------------------------------------------------------------
// 17. Workload identity
// ---------------------------------------------------------------------

// A workload should ideally authenticate to its secret manager using an
// identity associated with the workload itself.
//
// Conceptually:
//
// application instance
//       |
//       | workload identity
//       v
// secret manager
//       |
//       | authorized secret
//       v
// application
//
// This can reduce the need for long-lived bootstrap credentials.

// ---------------------------------------------------------------------
// 18. Dynamic secrets
// ---------------------------------------------------------------------

// Dynamic secrets are credentials generated for a specific consumer or
// lease and can have a limited lifetime.
//
// For example:
//
// application -> requests database credential
// secret manager -> creates temporary credential
// application -> uses credential
// credential -> expires or is revoked
//
// Short-lived credentials can reduce the useful lifetime of a stolen
// credential.

// ---------------------------------------------------------------------
// 19. Static vs. dynamic credentials
// ---------------------------------------------------------------------

export type CredentialLifetime = "static" | "short-lived" | "dynamic";

export interface CredentialPolicy {
  readonly name: string;
  readonly lifetime: CredentialLifetime;
}

export const credentialPolicies: readonly CredentialPolicy[] = [
  {
    name: "legacy-api-credential",
    lifetime: "static",
  },
  {
    name: "temporary-database-credential",
    lifetime: "dynamic",
  },
];

// Dynamic credentials are not appropriate for every integration, but
// they can reduce credential reuse and long-term exposure where supported.

// ---------------------------------------------------------------------
// 20. Secret rotation
// ---------------------------------------------------------------------

// Rotation replaces an existing credential with a new credential.
//
// Rotation limits the useful lifetime of a compromised secret and can
// also satisfy organizational lifecycle requirements.
//
// Rotation should be designed as an operational process rather than as
// a manual value replacement.

// ---------------------------------------------------------------------
// 21. Safe rotation
// ---------------------------------------------------------------------

export type RotationStage = "create" | "activate" | "verify" | "retire";

export const rotationStages: readonly RotationStage[] = ["create", "activate", "verify", "retire"];

// A safe rotation can conceptually:
//
// 1. create the new credential
// 2. make the new credential available
// 3. verify that consumers work
// 4. retire the previous credential
//
// The exact sequence depends on the service being rotated.

// ---------------------------------------------------------------------
// 22. Dual-credential rotation
// ---------------------------------------------------------------------

// Some systems support overlapping credentials during rotation:
//
// old credential -> still accepted
// new credential -> accepted
// application -> switches to new credential
// old credential -> revoked
//
// This can avoid downtime during a credential transition.
//
// The overlap period should be controlled and as short as practical.

// ---------------------------------------------------------------------
// 23. Rotation is not revocation
// ---------------------------------------------------------------------

// Rotation creates or activates a replacement credential.
//
// Revocation makes a credential unusable.
//
// If a secret is actively compromised, waiting for a scheduled rotation
// may leave the attacker with access.
//
// A compromised credential should be revoked or replaced promptly
// according to the incident-response process.

// ---------------------------------------------------------------------
// 24. Secret expiration
// ---------------------------------------------------------------------

export interface SecretExpiration {
  readonly expiresAt: number | null;
  readonly renewable: boolean;
}

export const temporarySecretExpiration: SecretExpiration = {
  expiresAt: Date.now() + 15 * 60 * 1000,
  renewable: false,
};

// Expiration provides another lifecycle boundary.
//
// Not every secret can have a short expiration period, but credentials
// should have a defined lifecycle appropriate to their purpose and risk.

// ---------------------------------------------------------------------
// 25. Secret revocation
// ---------------------------------------------------------------------

export interface RevocationRecord {
  readonly secretName: string;
  readonly revokedAt: number;
  readonly reason: "compromised" | "no-longer-required" | "rotation" | "incident";
}

export const exampleRevocationRecord: RevocationRecord = {
  secretName: "PAYMENT_PROVIDER_SECRET",
  revokedAt: Date.now(),
  reason: "compromised",
};

// Revocation should prevent further use of the affected credential
// wherever the underlying authentication system supports revocation.

// ---------------------------------------------------------------------
// 26. Secret versioning
// ---------------------------------------------------------------------

export interface SecretVersion {
  readonly version: string;
  readonly state: "current" | "previous" | "revoked";
}

export const secretVersions: readonly SecretVersion[] = [
  {
    version: "v2",
    state: "current",
  },
  {
    version: "v1",
    state: "revoked",
  },
];

// Versioning can support controlled rotation, rollback procedures, and
// auditing without requiring the application to hardcode credentials.

// ---------------------------------------------------------------------
// 27. Never log plaintext secrets
// ---------------------------------------------------------------------

export const unsafeSecretLoggingExample = (secret: string): void => {
  void secret;

  // Never do this:
  // console.log("Payment secret:", secret);
};

// Secrets should not appear in application logs, request logs, error
// reports, metrics, analytics events, or debugging output.

// ---------------------------------------------------------------------
// 28. Mask sensitive values when necessary
// ---------------------------------------------------------------------

export const maskSecret = (secret: string): string => {
  if (secret.length <= 4) {
    return "****";
  }

  return `${"*".repeat(secret.length - 4)}${secret.slice(-4)}`;
};

// Masking can reduce accidental disclosure in diagnostic output.
//
// It should not be interpreted as permission to log secrets routinely.
// The preferred approach is to avoid logging them at all.

// ---------------------------------------------------------------------
// 29. Avoid secrets in URLs
// ---------------------------------------------------------------------

export const unsafeSecretUrlExample = (): string => {
  // Never do this:
  // return `https://example.com/api?apiKey=${secret}`;

  return "https://example.com/api";
};

// URLs can be recorded in browser history, proxy logs, server logs,
// analytics systems, monitoring tools, and other infrastructure.

// ---------------------------------------------------------------------
// 30. Avoid secrets in client-side state
// ---------------------------------------------------------------------

export interface PublicApplicationState {
  readonly authenticated: boolean;
  readonly displayName: string;
}

export const publicApplicationState: PublicApplicationState = {
  authenticated: true,
  displayName: "John Doe",
};

// React state is not a secret store.
//
// A secret placed in React state is still present in browser memory and
// potentially observable by client-side code or debugging tools.

// ---------------------------------------------------------------------
// 31. Do not pass server secrets through React props
// ---------------------------------------------------------------------

export interface SafeClientProps {
  readonly apiBaseUrl: string;
}

export const createSafeClientProps = (apiBaseUrl: string): SafeClientProps => {
  return { apiBaseUrl };
};

// Server components or server-side code should pass only values that are
// intentionally safe for the client.
//
// A private API credential must not be serialized into client props.

// ---------------------------------------------------------------------
// 32. Secret management and API clients
// ---------------------------------------------------------------------

export interface ServerApiClientConfig {
  readonly baseUrl: string;
  readonly credentialReference: SecretReference;
}

export const serverApiClientConfig: ServerApiClientConfig = {
  baseUrl: "https://example.com/api",
  credentialReference: {
    name: "example/api-credential",
  },
};

// The credential reference identifies where the server can obtain the
// secret.
//
// The actual secret does not appear in the client-side application.

// ---------------------------------------------------------------------
// 33. Backend-for-frontend pattern
// ---------------------------------------------------------------------

// A browser can communicate with an application-owned backend:
//
// Browser
//   |
//   v
// Backend-for-frontend
//   |
//   v
// Third-party API
//
// The backend can retrieve a confidential third-party credential from a
// secret manager and use it without exposing the credential to the
// browser.

// ---------------------------------------------------------------------
// 34. CI/CD secret exposure
// ---------------------------------------------------------------------

// CI/CD systems often need credentials for deployment or external
// services.
//
// Important controls include:
// - least-privilege CI credentials
// - protected secrets
// - restricted administrative access
// - secret masking
// - short-lived credentials where possible
// - rotation
// - audit logging
// - protection against secrets leaking into build output
//
// A CI job that can print a secret can potentially expose it.

// ---------------------------------------------------------------------
// 35. Never print secrets in CI logs
// ---------------------------------------------------------------------

export const ciLogExample = (deploymentToken: string): string => {
  void deploymentToken;

  return "Deployment started.";
};

// CI scripts should avoid commands that dump environment variables,
// configuration objects, credentials, or authentication headers.

// ---------------------------------------------------------------------
// 36. Pull requests and forks
// ---------------------------------------------------------------------

// CI/CD workflows must consider untrusted code paths.
//
// A workflow triggered by an untrusted pull request should not
// automatically expose production secrets to arbitrary code.
//
// Secret availability should depend on the trust level and purpose of
// the workflow.

// ---------------------------------------------------------------------
// 37. Secret detection
// ---------------------------------------------------------------------

export type SecretDetectionSource = "pre-commit" | "pull-request" | "repository-scan" | "build" | "runtime";

export const secretDetectionSources: readonly SecretDetectionSource[] = [
  "pre-commit",
  "pull-request",
  "repository-scan",
  "build",
  "runtime",
];

// Secret scanning can detect accidentally committed credentials.
//
// Detection is defense in depth; it does not replace proper secret
// storage and lifecycle management.

// ---------------------------------------------------------------------
// 38. Incident response for leaked secrets
// ---------------------------------------------------------------------

export type SecretExposureResponse = "identify" | "revoke" | "rotate" | "investigate" | "monitor";

export const leakedSecretResponse: readonly SecretExposureResponse[] = [
  "identify",
  "revoke",
  "rotate",
  "investigate",
  "monitor",
];

// When a secret is exposed, the response should not stop at deleting the
// leaked value from source.
//
// The credential's validity must be addressed, affected systems should
// be investigated, and follow-up monitoring should be performed.

// ---------------------------------------------------------------------
// 39. Audit access to secrets
// ---------------------------------------------------------------------

export interface SecretAccessAuditEvent {
  readonly secretName: string;
  readonly actor: string;
  readonly action: "read" | "rotate" | "revoke";
  readonly timestamp: number;
  readonly outcome: "allowed" | "denied";
}

export const exampleSecretAuditEvent: SecretAccessAuditEvent = {
  secretName: "PAYMENT_PROVIDER_SECRET",
  actor: "payments-service",
  action: "read",
  timestamp: Date.now(),
  outcome: "allowed",
};

// Auditing helps establish who or what requested access, whether access
// was allowed, and when lifecycle operations occurred.
//
// Audit logs themselves must be protected from unauthorized modification.

// ---------------------------------------------------------------------
// 40. Secret metadata
// ---------------------------------------------------------------------

export interface ManagedSecretMetadata {
  readonly name: string;
  readonly purpose: string;
  readonly owner: string;
  readonly consumers: readonly string[];
  readonly rotationRequired: boolean;
}

export const managedSecretMetadata: ManagedSecretMetadata = {
  name: "example/payment-api",
  purpose: "Authenticate the payments service",
  owner: "payments-service",
  consumers: ["payments-service"],
  rotationRequired: true,
};

// Metadata makes ownership, purpose, consumers, and lifecycle
// responsibilities explicit.

// ---------------------------------------------------------------------
// 41. Backup and recovery
// ---------------------------------------------------------------------

// Secret-management infrastructure is itself production infrastructure.
//
// Availability and recovery matter because an unavailable secret manager
// can prevent applications from obtaining required credentials.
//
// Backups, recovery procedures, access controls, and emergency recovery
// processes must themselves be protected.

// ---------------------------------------------------------------------
// 42. Break-glass access
// ---------------------------------------------------------------------

export interface BreakGlassPolicy {
  readonly enabled: boolean;
  readonly requiresAudit: boolean;
  readonly requiresApproval: boolean;
}

export const breakGlassPolicy: BreakGlassPolicy = {
  enabled: true,
  requiresAudit: true,
  requiresApproval: true,
};

// Emergency credentials can be necessary when normal access paths fail.
//
// Break-glass access should be tightly controlled, audited, and tested.
// It should not become a normal operational authentication mechanism.

// ---------------------------------------------------------------------
// 43. Encryption at rest
// ---------------------------------------------------------------------

// A secrets-management system should protect stored secrets against
// unauthorized access to its underlying storage.
//
// Encryption at rest can provide an additional protection layer.
//
// Encryption does not replace access control: an application or operator
// that is already authorized to retrieve a secret can still receive the
// plaintext secret.

// ---------------------------------------------------------------------
// 44. Key management vs. secret management
// ---------------------------------------------------------------------

export type SensitiveMaterial = "application-secret" | "encryption-key" | "certificate-private-key";

export interface SensitiveMaterialPolicy {
  readonly material: SensitiveMaterial;
  readonly requiresLifecycleManagement: boolean;
}

export const sensitiveMaterialPolicies: readonly SensitiveMaterialPolicy[] = [
  {
    material: "application-secret",
    requiresLifecycleManagement: true,
  },
  {
    material: "encryption-key",
    requiresLifecycleManagement: true,
  },
  {
    material: "certificate-private-key",
    requiresLifecycleManagement: true,
  },
];

// Encryption keys have additional lifecycle and cryptographic
// requirements, but they still require controlled creation, storage,
// access, rotation, and revocation.

// ---------------------------------------------------------------------
// 45. Secret manager availability
// ---------------------------------------------------------------------

export interface SecretManagerHealth {
  readonly available: boolean;
  readonly lastSuccessfulAccess: number | null;
}

export const secretManagerHealth: SecretManagerHealth = {
  available: true,
  lastSuccessfulAccess: Date.now(),
};

// Secret-management infrastructure is a dependency.
//
// Applications should define appropriate startup, caching, retry, and
// failure behavior without accidentally creating unsafe fallback paths.

// ---------------------------------------------------------------------
// 46. Do not create insecure fallback credentials
// ---------------------------------------------------------------------

export const getCredentialReference = (configuredReference: SecretReference | undefined): SecretReference => {
  if (!configuredReference) {
    throw new Error("Required secret reference is not configured.");
  }

  return configuredReference;
};

// A missing secret should fail safely.
//
// Never replace a missing production credential with a hardcoded default
// password or publicly known fallback credential.

// ---------------------------------------------------------------------
// 47. Secret caching
// ---------------------------------------------------------------------

export interface SecretCachePolicy {
  readonly cacheAllowed: boolean;
  readonly maximumLifetimeMs: number;
}

export const secretCachePolicy: SecretCachePolicy = {
  cacheAllowed: true,
  maximumLifetimeMs: 5 * 60 * 1000,
};

// Some applications cache retrieved secrets to avoid repeatedly querying
// the secret manager.
//
// The cache should have an explicit lifetime and should be protected like
// the secret itself.
//
// Caching must not accidentally turn a short-lived secret into an
// effectively permanent credential.

// ---------------------------------------------------------------------
// 48. Minimize secret exposure in memory
// ---------------------------------------------------------------------

// Applications should minimize how long sensitive values remain in
// plaintext memory and should avoid copying them unnecessarily.
//
// Exact memory-clearing guarantees depend on the runtime and language.
//
// In JavaScript, developers should not assume that assigning an empty
// string guarantees immediate removal of previous sensitive bytes from
// memory.

// ---------------------------------------------------------------------
// 49. Secret management and React
// ---------------------------------------------------------------------

export const SecretManagementBoundary: FC = (): ReactElement => {
  const publicConfiguration = {
    apiBaseUrl: "https://example.com/api",
    applicationName: "Example Application",
  };

  return (
    <section>
      <h2>{publicConfiguration.applicationName}</h2>
      <p>API: {publicConfiguration.apiBaseUrl}</p>
      <p>Confidential credentials remain outside the browser application.</p>
    </section>
  );
};

// React consumes public configuration and communicates with application
// backends.
//
// It should not retrieve or display server-only secrets.

// ---------------------------------------------------------------------
// 50. Secure secret-management architecture
// ---------------------------------------------------------------------

export interface SecureSecretArchitecture {
  readonly browserReceivesSecret: boolean;
  readonly centralizedManagement: boolean;
  readonly leastPrivilege: boolean;
  readonly rotationSupported: boolean;
  readonly revocationSupported: boolean;
  readonly auditingEnabled: boolean;
}

export const secureSecretArchitecture: SecureSecretArchitecture = {
  browserReceivesSecret: false,
  centralizedManagement: true,
  leastPrivilege: true,
  rotationSupported: true,
  revocationSupported: true,
  auditingEnabled: true,
};

// A secure architecture keeps the secret outside the browser and applies
// lifecycle management and access controls on the server side.

// ---------------------------------------------------------------------
// 51. Secret-management checklist
// ---------------------------------------------------------------------

export interface SecretManagementChecklist {
  readonly noHardcodedSecrets: boolean;
  readonly noCommittedSecrets: boolean;
  readonly clientExposurePrevented: boolean;
  readonly leastPrivilegeApplied: boolean;
  readonly accessAudited: boolean;
  readonly rotationDefined: boolean;
  readonly revocationDefined: boolean;
  readonly incidentResponseDefined: boolean;
}

export const secretManagementChecklist: SecretManagementChecklist = {
  noHardcodedSecrets: true,
  noCommittedSecrets: true,
  clientExposurePrevented: true,
  leastPrivilegeApplied: true,
  accessAudited: true,
  rotationDefined: true,
  revocationDefined: true,
  incidentResponseDefined: true,
};

// ---------------------------------------------------------------------
// 52. Integrated example
// ---------------------------------------------------------------------

export const SecretManagementDemo: FC = (): ReactElement => {
  const publicConfiguration = browserSafeConfiguration;
  const secretReference = databaseSecretReference;

  return (
    <section>
      <h2>{publicConfiguration.applicationName}</h2>
      <p>API: {publicConfiguration.apiBaseUrl}</p>
      <p>Server secret reference: {secretReference.name}</p>
      <p>The browser receives configuration and a reference concept, not the confidential credential itself.</p>
    </section>
  );
};

export default SecretManagementDemo;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Secrets include API credentials, database credentials, private keys, signing keys, service credentials, and tokens.
// - Browser code is not a secure location for confidential secrets.
// - Public configuration and confidential credentials must be classified differently.
// - Secrets should not be hardcoded in source code or committed to version control.
// - .env files are configuration inputs, not dedicated secret-management systems.
// - Dedicated secret-management systems can centralize storage, access control, auditing, rotation, expiration, and revocation.
// - Least privilege limits which users and services can access each secret.
// - Separate credentials reduce the blast radius of a compromise.
// - Secrets have a lifecycle that includes creation, distribution, use, rotation, revocation, expiration, and deletion.
// - Cryptographically appropriate mechanisms should generate secrets rather than predictable application values.
// - Dynamic and short-lived credentials can reduce the useful lifetime of stolen credentials.
// - Rotation replaces credentials; revocation makes compromised or unnecessary credentials unusable.
// - Secrets should never be written to logs, URLs, client-side state, or browser-visible props.
// - CI/CD systems require the same least-privilege, auditing, masking, and rotation controls as application infrastructure.
// - Secret scanning helps detect accidental exposure but does not replace proper secret management.
// - A leaked secret should be treated as exposed and handled through revocation, rotation, investigation, and monitoring.
// - Secret access and lifecycle operations should be auditable.
// - Secret-management infrastructure requires availability, backup, recovery, and tightly controlled emergency access.
// - Encryption at rest provides defense in depth but does not replace access control.
// - React should consume public configuration and communicate with server-side systems; it should not become a secret store.
