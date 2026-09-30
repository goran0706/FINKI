/**
 * Environment Variables
 * ======================
 *
 * Environment variables provide configuration to an application from the environment in which
 * it runs instead of hardcoding environment-specific values into source code. In frontend
 * applications, environment variables must be treated carefully because values exposed to
 * browser code become part of the client-visible application and are not secrets.
 *
 * A frontend environment variable is appropriate for non-sensitive configuration such as a
 * public API base URL or feature configuration. Credentials, private API keys, database
 * passwords, signing keys, and other secrets must remain on the server or in a server-side
 * secrets-management system.
 */

import { type FC, type ReactElement } from "react";

// ---------------------------------------------------------------------
// 1. What environment variables are
// ---------------------------------------------------------------------

// Environment variables are values supplied by the execution or build
// environment rather than hardcoded directly into application logic.
//
// Typical server-side examples include:
// DATABASE_URL
// SESSION_SECRET
// PAYMENT_PROVIDER_SECRET
//
// Frontend examples can include non-sensitive configuration such as:
// PUBLIC_API_BASE_URL
// PUBLIC_APP_NAME
//
// The important distinction is not the variable's name but whether the
// value is safe to disclose to every user of the application.

// ---------------------------------------------------------------------
// 2. Environment variables are configuration, not automatically secrets
// ---------------------------------------------------------------------

export type EnvironmentValueClassification = "public-configuration" | "server-secret";

export interface EnvironmentValue {
  readonly name: string;
  readonly classification: EnvironmentValueClassification;
}

export const environmentExamples: readonly EnvironmentValue[] = [
  {
    name: "PUBLIC_API_BASE_URL",
    classification: "public-configuration",
  },
  {
    name: "SESSION_SECRET",
    classification: "server-secret",
  },
];

// A variable being stored in an environment variable does not make its
// value secret.
//
// A secret placed into a browser-visible environment variable is still
// a client-side secret leak.

// ---------------------------------------------------------------------
// 3. Server environment vs. browser environment
// ---------------------------------------------------------------------

// A server process can read private environment variables because the
// values remain within the server-side execution environment.
//
// Browser JavaScript is different.
//
// Anything delivered to the browser can potentially be inspected by the
// user through:
// - DevTools
// - downloaded JavaScript bundles
// - source maps when available
// - network responses
// - runtime inspection
//
// Therefore, frontend configuration must be classified according to
// whether it is safe for the browser to know.

// ---------------------------------------------------------------------
// 4. Public frontend configuration
// ---------------------------------------------------------------------

export interface PublicFrontendConfig {
  readonly apiBaseUrl: string;
  readonly applicationName: string;
}

export const publicFrontendConfig: PublicFrontendConfig = {
  apiBaseUrl: "https://example.com/api",
  applicationName: "Example Application",
};

// These values are intentionally public.
//
// Knowing an API's public origin or an application's display name does
// not normally provide an authentication secret.

// ---------------------------------------------------------------------
// 5. Secrets belong on the server
// ---------------------------------------------------------------------

export interface ServerSecretNames {
  readonly sessionSecret: string;
  readonly databaseUrl: string;
  readonly paymentProviderSecret: string;
}

export const serverSecretNames: ServerSecretNames = {
  sessionSecret: "SESSION_SECRET",
  databaseUrl: "DATABASE_URL",
  paymentProviderSecret: "PAYMENT_PROVIDER_SECRET",
};

// The object contains variable names, not secret values.
//
// A real application should resolve the corresponding values only in
// server-side code or through an appropriate secrets-management system.

// ---------------------------------------------------------------------
// 6. Never hardcode secrets in frontend source
// ---------------------------------------------------------------------

// Never write:
//
// const paymentSecret = "actual-secret-value";
// const databasePassword = "actual-password";
// const signingKey = "actual-signing-key";
//
// Frontend source is distributed to users.
//
// Moving a secret from one frontend source file into another frontend
// source file does not make it secret.

// ---------------------------------------------------------------------
// 7. Never use frontend environment variables for secrets
// ---------------------------------------------------------------------

// This is unsafe:
//
// const apiSecret = import.meta.env.VITE_PAYMENT_SECRET;
//
// In Vite, variables with the VITE_ prefix are exposed to client-side
// source code during the build.
//
// Therefore, VITE_PAYMENT_SECRET would not be a server-only secret.
//
// Vite explicitly documents that VITE_* values are bundled into the
// client and should not contain sensitive information.

// ---------------------------------------------------------------------
// 8. Vite public environment variables
// ---------------------------------------------------------------------

// With Vite, client-exposed variables use the VITE_ prefix by default:
//
// VITE_API_BASE_URL=https://example.com/api
// VITE_APP_NAME=Example Application
//
// They can then be accessed from browser code:
//
// import.meta.env.VITE_API_BASE_URL
// import.meta.env.VITE_APP_NAME
//
// These values should be considered public.
//
// Vite replaces these values during the build rather than providing a
// secure runtime secret store.

// ---------------------------------------------------------------------
// 9. Vite server-only environment variables
// ---------------------------------------------------------------------

// A value without the VITE_ prefix is not automatically exposed to
// Vite client source:
//
// DATABASE_URL=...
// SESSION_SECRET=...
// PAYMENT_PROVIDER_SECRET=...
//
// These values can be used by server-side tooling or server code,
// depending on the application's architecture.
//
// They should never be copied into browser-facing configuration.

// ---------------------------------------------------------------------
// 10. Environment variables are strings
// ---------------------------------------------------------------------

// Environment variables are generally represented as strings.
//
// For example:
//
// VITE_MAX_ITEMS=50
// VITE_FEATURE_ENABLED=true
//
// should not be assumed to have these TypeScript values:
//
// number
// boolean
//
// Instead, the application must explicitly parse them when needed.

export const parseBooleanEnvironmentValue = (value: string | undefined): boolean => {
  return value === "true";
};

export const parseNumberEnvironmentValue = (value: string | undefined, fallback: number): number => {
  if (value === undefined) {
    return fallback;
  }

  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : fallback;
};

// ---------------------------------------------------------------------
// 11. Environment variable validation
// ---------------------------------------------------------------------

// Configuration should be validated at the boundary where it enters
// the application.
//
// Validation prevents invalid configuration from silently propagating
// through unrelated application code.

export interface ParsedApplicationConfig {
  readonly apiBaseUrl: string;
  readonly maxItems: number;
  readonly featureEnabled: boolean;
}

export const parseApplicationConfig = (values: Record<string, string | undefined>): ParsedApplicationConfig => {
  const apiBaseUrl = values.VITE_API_BASE_URL;

  if (!apiBaseUrl) {
    throw new Error("VITE_API_BASE_URL is required.");
  }

  return {
    apiBaseUrl,
    maxItems: parseNumberEnvironmentValue(values.VITE_MAX_ITEMS, 50),
    featureEnabled: parseBooleanEnvironmentValue(values.VITE_FEATURE_ENABLED),
  };
};

// ---------------------------------------------------------------------
// 12. TypeScript does not validate environment values automatically
// ---------------------------------------------------------------------

// TypeScript can describe the expected shape of configuration, but it
// cannot prove that a value supplied by the deployment environment is
// valid.
//
// For example, this type:
//
// interface Config {
//     readonly maxItems: number;
// }
//
// does not make an environment variable containing "not-a-number" into
// a valid number.
//
// Runtime parsing and validation are still required.

// ---------------------------------------------------------------------
// 13. Typed Vite environment variables
// ---------------------------------------------------------------------

// Vite supports TypeScript augmentation for import.meta.env.
//
// A project can declare expected variables in a declaration file:
//
// interface ImportMetaEnv {
//     readonly VITE_API_BASE_URL: string;
//     readonly VITE_MAX_ITEMS: string;
// }
//
// interface ImportMeta {
//     readonly env: ImportMetaEnv;
// }
//
// This improves editor support and catches misspelled property names.
//
// Type declarations describe the expected interface; they do not prove
// that the deployed environment actually contains valid values.

// ---------------------------------------------------------------------
// 14. Avoid optional configuration when it is actually required
// ---------------------------------------------------------------------

export const requireConfiguration = (name: string, value: string | undefined): string => {
  if (!value) {
    throw new Error(`Missing required configuration: ${name}`);
  }

  return value;
};

// Required configuration should fail clearly at its boundary rather
// than producing obscure failures much later in the application.

// ---------------------------------------------------------------------
// 15. Environment-specific configuration
// ---------------------------------------------------------------------

// Applications commonly have different configuration for:
//
// development
// staging
// production
//
// The configuration can change between environments without changing
// application source code.
//
// For example:
//
// development -> https://example.com/api
// staging     -> https://staging.example.com/api
// production  -> https://example.com/api
//
// The values are configuration differences, not authentication secrets.

// ---------------------------------------------------------------------
// 16. Development vs. production
// ---------------------------------------------------------------------

export type ApplicationMode = "development" | "staging" | "production";

export const describeApplicationMode = (mode: ApplicationMode): string => {
  switch (mode) {
    case "development":
      return "Development configuration";
    case "staging":
      return "Staging configuration";
    case "production":
      return "Production configuration";
  }
};

// Environment mode can influence behavior, but security controls must
// not disappear simply because an application is running in development.
//
// Production security requirements must be enforced independently of
// client-visible mode checks.

// ---------------------------------------------------------------------
// 17. Client-visible mode is not a security boundary
// ---------------------------------------------------------------------

// This is not an authorization mechanism:
//
// if (import.meta.env.MODE === "development") {
//     // bypass authorization
// }
//
// A user controls the browser environment and client-side execution.
//
// Security decisions such as authentication and authorization must be
// enforced by the server.

// ---------------------------------------------------------------------
// 18. Public API URLs are different from API credentials
// ---------------------------------------------------------------------

export interface ApiConfiguration {
  readonly baseUrl: string;
}

export const apiConfiguration: ApiConfiguration = {
  baseUrl: "https://example.com/api",
};

// An API base URL tells the browser where to send requests.
//
// An API secret authenticates or authorizes access.
//
// The first can be public.
// The second must remain protected when it is a credential.

// ---------------------------------------------------------------------
// 19. Public API keys require careful classification
// ---------------------------------------------------------------------

// Some third-party services intentionally provide browser-safe public
// identifiers or publishable keys.
//
// Such a value is not equivalent to a secret merely because the provider
// calls it a "key".
//
// The provider's documentation determines whether a credential is
// designed for public browser use.
//
// If a credential must remain confidential, it must not be embedded in
// the frontend bundle.

// ---------------------------------------------------------------------
// 20. API proxy or backend-for-frontend
// ---------------------------------------------------------------------

// A browser can call an application-owned backend:
//
// Browser
//   |
//   v
// Application backend
//   |
//   v
// Third-party service
//
// The backend can keep the third-party secret private.
//
// This is useful when a third-party API requires a confidential
// credential that cannot safely be distributed to browsers.

// ---------------------------------------------------------------------
// 21. Environment variables do not replace a backend
// ---------------------------------------------------------------------

// This does not make a secret safe:
//
// .env
// PAYMENT_SECRET=secret
//
// followed by:
//
// VITE_PAYMENT_SECRET=secret
//
// The moment the secret is exposed to client-side code, it becomes
// accessible to the browser user.
//
// A backend boundary is required when the operation requires a
// confidential credential.

// ---------------------------------------------------------------------
// 22. .env files
// ---------------------------------------------------------------------

// Many JavaScript tooling ecosystems support .env files.
//
// Typical examples include:
//
// .env
// .env.local
// .env.development
// .env.production
//
// The exact loading rules depend on the build tool.
//
// A .env file is configuration input, not a secure vault.

// ---------------------------------------------------------------------
// 23. .env files should not be committed blindly
// ---------------------------------------------------------------------

// Local environment files can contain sensitive server-side values.
//
// A repository should normally ignore local secret-bearing files such
// as:
//
// .env.local
//
// Teams commonly commit a template containing variable names but not
// real secrets:
//
// .env.example
//
// The exact conventions depend on the project and deployment system.

// ---------------------------------------------------------------------
// 24. Example environment template
// ---------------------------------------------------------------------

export interface EnvironmentTemplate {
  readonly publicApiBaseUrl: string;
  readonly applicationName: string;
}

export const environmentTemplate: EnvironmentTemplate = {
  publicApiBaseUrl: "https://example.com/api",
  applicationName: "Example Application",
};

// A template should contain safe example values rather than production
// credentials.

// ---------------------------------------------------------------------
// 25. Do not log the complete environment
// ---------------------------------------------------------------------

// Never casually dump an environment object:
//
// console.log(process.env);
//
// or:
//
// console.log(import.meta.env);
//
// Environment objects may contain credentials in server-side contexts,
// and client-visible configuration may still expose information that
// should not be unnecessarily disclosed.
//
// Log only the specific non-sensitive value required for diagnostics.

// ---------------------------------------------------------------------
// 26. Avoid leaking secrets through error messages
// ---------------------------------------------------------------------

export const sanitizeConfigurationError = (variableName: string): string => {
  return `Configuration error involving ${variableName}.`;
};

// Error messages should identify the configuration field involved
// without including the secret value itself.

// ---------------------------------------------------------------------
// 27. Secrets can leak through build artifacts
// ---------------------------------------------------------------------

// A frontend build is an artifact intended for distribution.
//
// If a secret is included in that artifact, changing the source variable
// name does not protect it.
//
// Secrets can potentially remain in:
// - JavaScript bundles
// - generated assets
// - source maps
// - static configuration
// - embedded HTML
//
// Never place confidential credentials into browser build output.

// ---------------------------------------------------------------------
// 28. Source maps and secret exposure
// ---------------------------------------------------------------------

// Source maps can make debugging easier by mapping generated code back
// to source.
//
// They can also expose source information when publicly served.
//
// Source maps should therefore be treated as part of the application's
// deployment and information-disclosure strategy.
//
// Most importantly, a secret should never be present in source code or
// build output in the first place.

// ---------------------------------------------------------------------
// 29. Build-time substitution
// ---------------------------------------------------------------------

// Some frontend tools replace environment references during the build.
//
// Conceptually:
//
// source:
//     API_URL
//
// production build:
//     "https://example.com/api"
//
// The resulting browser application contains the value.
//
// Therefore, build-time substitution is configuration injection, not
// secret storage.

// ---------------------------------------------------------------------
// 30. Runtime configuration
// ---------------------------------------------------------------------

// Build-time configuration means values are selected when the frontend
// is built.
//
// Runtime configuration means values can be supplied when the deployed
// application starts or is served.
//
// Runtime configuration can be useful when the same frontend artifact
// must run in multiple environments.
//
// It still does not make sensitive values safe to expose to the browser.

// ---------------------------------------------------------------------
// 31. Runtime configuration must still be public
// ---------------------------------------------------------------------

export interface RuntimePublicConfiguration {
  readonly apiBaseUrl: string;
  readonly applicationName: string;
}

export const runtimePublicConfiguration: RuntimePublicConfiguration = {
  apiBaseUrl: "https://example.com/api",
  applicationName: "Example Application",
};

// A runtime configuration endpoint or generated configuration file is
// still browser-visible.
//
// It can safely contain public configuration only.

// ---------------------------------------------------------------------
// 32. Environment variables and SSR
// ---------------------------------------------------------------------

// Server-side rendering introduces separate execution environments.
//
// Server code can access private environment variables.
//
// Client components can access only values deliberately exposed to
// client code by the framework or build system.
//
// A server-only secret must not cross the server-to-client boundary.

// ---------------------------------------------------------------------
// 33. Server-to-client serialization
// ---------------------------------------------------------------------

export interface ServerConfiguration {
  readonly publicApiBaseUrl: string;
}

export interface ClientConfiguration {
  readonly apiBaseUrl: string;
}

export const exposePublicConfiguration = (configuration: ServerConfiguration): ClientConfiguration => {
  return {
    apiBaseUrl: configuration.publicApiBaseUrl,
  };
};

// The important security property is that only the intentionally public
// subset crosses the server-to-client boundary.

// ---------------------------------------------------------------------
// 34. Do not serialize server secrets into props
// ---------------------------------------------------------------------

export interface SafeServerProps {
  readonly apiBaseUrl: string;
}

export const createSafeServerProps = (apiBaseUrl: string): SafeServerProps => {
  return { apiBaseUrl };
};

// A server-rendered component can safely pass public configuration to a
// client component.
//
// It must not serialize private credentials into client props merely
// because the client component needs configuration.

// ---------------------------------------------------------------------
// 35. Environment variables and authorization
// ---------------------------------------------------------------------

// This is not secure:
//
// const isAdmin = import.meta.env.VITE_IS_ADMIN === "true";
//
// Environment variables exposed to browser code are controlled by the
// deployed application configuration and can be observed by users.
//
// Authorization must instead be derived from authenticated server-side
// identity and enforced on protected server operations.

// ---------------------------------------------------------------------
// 36. Feature flags are not security controls
// ---------------------------------------------------------------------

export interface FeatureFlags {
  readonly newDashboard: boolean;
  readonly experimentalSearch: boolean;
}

export const publicFeatureFlags: FeatureFlags = {
  newDashboard: true,
  experimentalSearch: false,
};

// Feature flags are useful for controlling product behavior.
//
// They should not be used as the only mechanism to protect sensitive
// functionality.
//
// Hiding an administrative button is not equivalent to authorizing the
// corresponding administrative API operation.

// ---------------------------------------------------------------------
// 37. Configuration validation in React
// ---------------------------------------------------------------------

export const ConfigurationStatus: FC<{
  readonly config: PublicFrontendConfig;
}> = ({ config }): ReactElement => {
  const hasApiUrl = config.apiBaseUrl.length > 0;
  const hasApplicationName = config.applicationName.length > 0;

  return (
    <section>
      <p>API configured: {String(hasApiUrl)}</p>
      <p>Application name configured: {String(hasApplicationName)}</p>
    </section>
  );
};

// React can display configuration status, but it should not expose
// sensitive configuration values merely for debugging.

// ---------------------------------------------------------------------
// 38. Safe configuration access
// ---------------------------------------------------------------------

export const getPublicApiBaseUrl = (config: PublicFrontendConfig): string => {
  return config.apiBaseUrl;
};

// Centralizing configuration access makes validation and replacement
// easier than scattering direct environment-variable reads throughout
// the application.

// ---------------------------------------------------------------------
// 39. Avoid scattering environment access
// ---------------------------------------------------------------------

// Prefer:
//
// const config = createApplicationConfig(environmentValues);
//
// and then:
//
// apiClient(config.apiBaseUrl);
//
// instead of repeatedly reading environment variables throughout every
// component.
//
// This keeps configuration parsing at a clear boundary and makes the
// rest of the application operate on validated values.

// ---------------------------------------------------------------------
// 40. Secret rotation
// ---------------------------------------------------------------------

// A secret that may have been exposed should be considered compromised.
//
// Renaming the variable or removing it from the current source file does
// not invalidate a credential that has already been disclosed.
//
// The affected credential should be revoked or rotated according to the
// service's credential-management process.

// ---------------------------------------------------------------------
// 41. Environment variables and version control
// ---------------------------------------------------------------------

// Never commit real credentials merely because the file is named:
//
// .env
//
// Git history can preserve secrets even after the latest commit removes
// them.
//
// If a secret is accidentally committed, removing the file is not enough.
// The credential should be treated as exposed and rotated.

// ---------------------------------------------------------------------
// 42. Environment variables and container deployment
// ---------------------------------------------------------------------

// Server deployments can receive configuration from their deployment
// environment.
//
// For example:
//
// application process
//     |
//     +-- DATABASE_URL
//     +-- SESSION_SECRET
//
// The exact mechanism depends on the deployment platform.
//
// Sensitive values should be managed with appropriate secret-management
// controls rather than casually embedded in images or source repositories.

// ---------------------------------------------------------------------
// 43. Environment variables are not always the best secret store
// ---------------------------------------------------------------------

// Environment variables are convenient, but they can be exposed through
// process inspection, debugging information, crash reports, logs, or
// deployment configuration depending on the environment.
//
// Dedicated secret-management systems can provide stronger controls
// such as access policies, auditing, rotation, and versioning.

// ---------------------------------------------------------------------
// 44. Configuration vs. secret management
// ---------------------------------------------------------------------

export type ConfigurationKind = "public" | "private";

export const configurationResponsibilities: Readonly<Record<ConfigurationKind, string>> = {
  public: "Browser-safe configuration",
  private: "Server-side secret management",
};

// A configuration system answers:
// "What value should this deployment use?"
//
// A secret-management system additionally addresses:
// "Who can access this credential, when, and under what controls?"

// ---------------------------------------------------------------------
// 45. Environment variable naming
// ---------------------------------------------------------------------

// Names should communicate whether a value is intended for client use.
//
// For example:
//
// VITE_API_BASE_URL
// VITE_APP_NAME
//
// can indicate browser-visible configuration.
//
// Names such as:
//
// SESSION_SECRET
// DATABASE_URL
// PAYMENT_PROVIDER_SECRET
//
// should remain server-side.
//
// Naming conventions help prevent mistakes, but the actual build system
// and deployment architecture determine exposure.

// ---------------------------------------------------------------------
// 46. Avoid broad client exposure
// ---------------------------------------------------------------------

// Build tools generally use an explicit prefix or allowlist to determine
// which environment variables are exposed to browser code.
//
// Broadly exposing all environment variables is dangerous.
//
// In Vite, changing envPrefix to expose everything would undermine the
// normal client-exposure boundary.

// ---------------------------------------------------------------------
// 47. Configuration boundary example
// ---------------------------------------------------------------------

export interface EnvironmentInput {
  readonly VITE_API_BASE_URL?: string;
  readonly VITE_APP_NAME?: string;
}

export const createPublicConfiguration = (environment: EnvironmentInput): PublicFrontendConfig => {
  return {
    apiBaseUrl: requireConfiguration("VITE_API_BASE_URL", environment.VITE_API_BASE_URL),
    applicationName: requireConfiguration("VITE_APP_NAME", environment.VITE_APP_NAME),
  };
};

// Only explicitly selected public variables are mapped into application
// configuration.

// ---------------------------------------------------------------------
// 48. Integrated secure configuration example
// ---------------------------------------------------------------------

export const EnvironmentVariablesDemo: FC = (): ReactElement => {
  const config = createPublicConfiguration({
    VITE_API_BASE_URL: "https://example.com/api",
    VITE_APP_NAME: "Example Application",
  });

  return (
    <section>
      <h2>{config.applicationName}</h2>
      <p>API: {config.apiBaseUrl}</p>
      <p>These values are intentionally public frontend configuration.</p>
    </section>
  );
};

export default EnvironmentVariablesDemo;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Environment variables provide configuration from the execution or build environment.
// - An environment variable is not automatically a secret simply because it is stored outside source code.
// - Anything exposed to browser code must be considered readable by the user.
// - Frontend environment variables should contain only values that are safe to disclose.
// - In Vite, VITE_* variables are exposed to client-side code and should not contain sensitive information.
// - Server-only credentials such as database passwords, session secrets, and private API credentials must remain server-side.
// - TypeScript can describe configuration types but cannot validate external environment values at runtime.
// - Environment values are commonly strings and should be parsed and validated when another type is required.
// - .env files are configuration inputs, not secure vaults.
// - Local secret-bearing environment files should be excluded from version control.
// - Secrets accidentally committed to version control should be treated as exposed and rotated.
// - Build-time substitution does not protect a value once it is included in a browser bundle.
// - Runtime configuration delivered to the browser is still public configuration.
// - Server-side rendering can access private environment variables, but private values must not cross into client-side props or serialized state.
// - Feature flags and client-side environment checks are not authorization controls.
// - Centralizing configuration parsing creates a clear boundary for validation and exposure.
// - Dedicated secret-management systems can provide stronger controls for sensitive credentials than ordinary environment variables.
// - React displays and consumes configuration; it does not make an environment variable secret.
