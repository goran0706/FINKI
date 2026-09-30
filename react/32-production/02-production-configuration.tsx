/**
 * Production Configuration
 * =========================
 *
 * Production configuration defines how an application is built, deployed, and operated in a
 * production environment. Configuration can control build behavior, public application settings,
 * service endpoints, asset paths, logging, source maps, and other environment-dependent behavior,
 * while sensitive values must remain outside browser-delivered code.
 */

import { useMemo, type FC, type ReactElement } from "react";

// ---------------------------------------------------------------------
// 1. Configuration is data
// ---------------------------------------------------------------------

interface ApplicationConfiguration {
  readonly applicationName: string;
  readonly apiBaseUrl: string;
  readonly assetBaseUrl: string;
}

const configuration: ApplicationConfiguration = {
  applicationName: "Example Application",
  apiBaseUrl: "https://example.com/api",
  assetBaseUrl: "https://example.com/assets",
};

console.log(configuration);

// Configuration is data that controls application behavior without requiring
// the behavior itself to be rewritten.

// ---------------------------------------------------------------------
// 2. Production configuration
// ---------------------------------------------------------------------

const productionConfiguration: ApplicationConfiguration = {
  applicationName: "Example Application",
  apiBaseUrl: "https://example.com/api",
  assetBaseUrl: "https://example.com/assets",
};

console.log(productionConfiguration);

// Production configuration contains values appropriate for the production deployment.
// The exact values depend on the application and deployment environment.

// ---------------------------------------------------------------------
// 3. Development configuration
// ---------------------------------------------------------------------

const developmentConfiguration: ApplicationConfiguration = {
  applicationName: "Example Application",
  apiBaseUrl: "http://localhost:3000/api",
  assetBaseUrl: "http://localhost:3000/assets",
};

console.log(developmentConfiguration);

// Different environments commonly use different service endpoints and asset locations.

// ---------------------------------------------------------------------
// 4. Configuration shape
// ---------------------------------------------------------------------

interface ApplicationSettings {
  readonly apiBaseUrl: string;
  readonly assetBaseUrl: string;
  readonly applicationName: string;
  readonly environment: "development" | "staging" | "production";
}

const applicationSettings: ApplicationSettings = {
  apiBaseUrl: "https://example.com/api",
  assetBaseUrl: "https://example.com/assets",
  applicationName: "Example Application",
  environment: "production",
};

console.log(applicationSettings);

// A typed configuration shape makes required application settings explicit.

// ---------------------------------------------------------------------
// 5. Environment name
// ---------------------------------------------------------------------

type EnvironmentName = "development" | "staging" | "production";

const environment: EnvironmentName = "production";

console.log(environment);

// An environment name identifies the deployment context.
// It should not itself be treated as a secret or security boundary.

// ---------------------------------------------------------------------
// 6. Environment-specific configuration
// ---------------------------------------------------------------------

const configurations: Record<EnvironmentName, ApplicationConfiguration> = {
  development: developmentConfiguration,
  staging: {
    applicationName: "Example Application",
    apiBaseUrl: "https://example.com/api",
    assetBaseUrl: "https://example.com/assets",
  },
  production: productionConfiguration,
};

console.log(configurations[environment]);

// A configuration map can make environment-specific values explicit.
// Real applications commonly load these values rather than hard-code every environment.

// ---------------------------------------------------------------------
// 7. Configuration selection
// ---------------------------------------------------------------------

const selectedConfiguration = (environmentName: EnvironmentName): ApplicationConfiguration => {
  return configurations[environmentName];
};

console.log(selectedConfiguration("production"));

// Configuration selection should be deterministic for a given environment.

// ---------------------------------------------------------------------
// 8. Build-time configuration
// ---------------------------------------------------------------------

interface BuildConfiguration {
  readonly mode: "development" | "production";
  readonly sourceMaps: boolean;
  readonly minify: boolean;
}

const buildConfiguration: BuildConfiguration = {
  mode: "production",
  sourceMaps: true,
  minify: true,
};

console.log(buildConfiguration);

// Build-time configuration controls how source code is transformed into production assets.

// ---------------------------------------------------------------------
// 9. Runtime configuration
// ---------------------------------------------------------------------

interface RuntimeConfiguration {
  readonly apiBaseUrl: string;
  readonly assetBaseUrl: string;
}

const runtimeConfiguration: RuntimeConfiguration = {
  apiBaseUrl: "https://example.com/api",
  assetBaseUrl: "https://example.com/assets",
};

console.log(runtimeConfiguration);

// Runtime configuration is consumed while the deployed application executes.

// ---------------------------------------------------------------------
// 10. Build-time versus runtime
// ---------------------------------------------------------------------

interface ConfigurationTiming {
  readonly buildTime: readonly string[];
  readonly runtime: readonly string[];
}

const configurationTiming: ConfigurationTiming = {
  buildTime: ["minification", "source-map generation", "asset naming"],
  runtime: ["API endpoint", "feature availability", "application settings"],
};

console.log(configurationTiming);

// Build-time settings affect generated artifacts.
// Runtime settings affect behavior after those artifacts have been deployed.

// ---------------------------------------------------------------------
// 11. Public configuration
// ---------------------------------------------------------------------

interface PublicConfiguration {
  readonly apiBaseUrl: string;
  readonly applicationName: string;
}

const publicConfiguration: PublicConfiguration = {
  apiBaseUrl: "https://example.com/api",
  applicationName: "Example Application",
};

console.log(publicConfiguration);

// Values required by browser code are public once delivered to the browser.

// ---------------------------------------------------------------------
// 12. Secrets are not public configuration
// ---------------------------------------------------------------------

interface ServerSecretConfiguration {
  readonly databasePassword: string;
  readonly privateApiKey: string;
}

const serverSecretConfiguration: ServerSecretConfiguration = {
  databasePassword: "server-managed-secret",
  privateApiKey: "server-managed-secret",
};

console.log(Object.keys(serverSecretConfiguration));

// This example represents server-side configuration only.
// Actual secrets must not be embedded into client-side production assets.

// ---------------------------------------------------------------------
// 13. Never expose secrets to the client
// ---------------------------------------------------------------------

const clientSafeConfiguration = {
  apiBaseUrl: "https://example.com/api",
  publicClientId: "example-client",
};

console.log(clientSafeConfiguration);

// A value is not made secret by giving it a secret-looking variable name.
// If browser code can access it, users can inspect it.

// ---------------------------------------------------------------------
// 14. Environment variables
// ---------------------------------------------------------------------

interface EnvironmentVariables {
  readonly NODE_ENV?: string;
  readonly API_BASE_URL?: string;
}

const environmentVariables: EnvironmentVariables = {
  NODE_ENV: "production",
  API_BASE_URL: "https://example.com/api",
};

console.log(environmentVariables);

// Environment variables are commonly used by build systems and servers.
// The mechanism for exposing them to browser code is tool-specific.

// ---------------------------------------------------------------------
// 15. Environment variables are not automatically browser-safe
// ---------------------------------------------------------------------

const environmentVariableNames = ["API_BASE_URL", "APPLICATION_NAME", "PRIVATE_API_KEY"] as const;

console.log(environmentVariableNames);

// An environment variable can be exposed to client code only if the build system
// explicitly makes it part of the browser bundle.

// ---------------------------------------------------------------------
// 16. Public environment variables
// ---------------------------------------------------------------------

const publicEnvironment = {
  applicationName: "Example Application",
  apiBaseUrl: "https://example.com/api",
};

console.log(publicEnvironment);

// Public environment variables contain values that are acceptable for browser delivery.

// ---------------------------------------------------------------------
// 17. Server-only environment variables
// ---------------------------------------------------------------------

const serverOnlyEnvironment = {
  databaseUrl: "server-managed-value",
  signingKey: "server-managed-value",
};

console.log(Object.keys(serverOnlyEnvironment));

// Server-only values must remain in server execution environments and outside client bundles.

// ---------------------------------------------------------------------
// 18. Configuration validation
// ---------------------------------------------------------------------

const isNonEmptyString = (value: unknown): value is string => {
  return typeof value === "string" && value.length > 0;
};

console.log(isNonEmptyString("https://example.com")); // true

// Runtime validation verifies configuration loaded from untyped external sources.

// ---------------------------------------------------------------------
// 19. URL validation
// ---------------------------------------------------------------------

const parseUrl = (value: string): URL => {
  return new URL(value);
};

const apiUrl = parseUrl("https://example.com/api");

console.log(apiUrl.origin);

// URL validation catches malformed endpoint configuration before the application uses it.

// ---------------------------------------------------------------------
// 20. Configuration validation at startup
// ---------------------------------------------------------------------

const validateConfiguration = (config: ApplicationConfiguration): void => {
  if (!isNonEmptyString(config.applicationName)) {
    throw new Error("Application name is required.");
  }

  parseUrl(config.apiBaseUrl);
  parseUrl(config.assetBaseUrl);
};

validateConfiguration(productionConfiguration);

// Failing fast during initialization is preferable to silently running with invalid configuration.

// ---------------------------------------------------------------------
// 21. Normalizing configuration
// ---------------------------------------------------------------------

const normalizeBaseUrl = (value: string): string => {
  return value.endsWith("/") ? value.slice(0, -1) : value;
};

console.log(normalizeBaseUrl("https://example.com/api/")); // "https://example.com/api"

// Normalization prevents small formatting differences from producing inconsistent URLs.

// ---------------------------------------------------------------------
// 22. Immutable configuration
// ---------------------------------------------------------------------

const immutableConfiguration = Object.freeze({
  apiBaseUrl: "https://example.com/api",
  applicationName: "Example Application",
});

console.log(immutableConfiguration);

// Freezing a configuration object prevents accidental mutation at runtime.
// TypeScript readonly properties provide compile-time protection but do not freeze objects.

// ---------------------------------------------------------------------
// 23. Readonly configuration types
// ---------------------------------------------------------------------

interface ReadonlyConfiguration {
  readonly apiBaseUrl: string;
  readonly applicationName: string;
}

const readonlyConfiguration: ReadonlyConfiguration = {
  apiBaseUrl: "https://example.com/api",
  applicationName: "Example Application",
};

console.log(readonlyConfiguration);

// readonly communicates that application code should not modify configuration after initialization.

// ---------------------------------------------------------------------
// 24. Configuration defaults
// ---------------------------------------------------------------------

interface OptionalConfiguration {
  readonly apiBaseUrl?: string;
  readonly requestTimeoutMs?: number;
}

const suppliedConfiguration: OptionalConfiguration = {
  apiBaseUrl: "https://example.com/api",
};

const resolvedConfiguration = {
  apiBaseUrl: suppliedConfiguration.apiBaseUrl ?? "https://example.com/api",
  requestTimeoutMs: suppliedConfiguration.requestTimeoutMs ?? 10_000,
};

console.log(resolvedConfiguration);

// Defaults provide predictable behavior when optional configuration is absent.

// ---------------------------------------------------------------------
// 25. Avoid unsafe defaults
// ---------------------------------------------------------------------

const resolveRequiredApiUrl = (value: string | undefined): string => {
  if (!value) {
    throw new Error("API base URL is required.");
  }

  return value;
};

console.log(resolveRequiredApiUrl("https://example.com/api"));

// Required production settings should generally fail validation rather than silently
// falling back to an incorrect production endpoint.

// ---------------------------------------------------------------------
// 26. Configuration precedence
// ---------------------------------------------------------------------

interface ConfigurationSources {
  readonly defaults: Partial<ApplicationConfiguration>;
  readonly environment: Partial<ApplicationConfiguration>;
}

const configurationSources: ConfigurationSources = {
  defaults: {
    applicationName: "Example Application",
  },
  environment: {
    apiBaseUrl: "https://example.com/api",
    assetBaseUrl: "https://example.com/assets",
  },
};

const mergedConfiguration = {
  ...configurationSources.defaults,
  ...configurationSources.environment,
};

console.log(mergedConfiguration);

// Later configuration sources can override earlier defaults.
// The precedence order should be documented and deterministic.

// ---------------------------------------------------------------------
// 27. Explicit configuration precedence
// ---------------------------------------------------------------------

const resolveConfiguration = (
  defaults: Partial<ApplicationConfiguration>,
  environmentValues: Partial<ApplicationConfiguration>,
): Partial<ApplicationConfiguration> => {
  return {
    ...defaults,
    ...environmentValues,
  };
};

console.log(resolveConfiguration(configurationSources.defaults, configurationSources.environment));

// Explicit merging makes configuration precedence visible in application code.

// ---------------------------------------------------------------------
// 28. Configuration should have one authority
// ---------------------------------------------------------------------

interface ConfigurationAuthority {
  readonly source: "environment";
  readonly values: ApplicationConfiguration;
}

const configurationAuthority: ConfigurationAuthority = {
  source: "environment",
  values: productionConfiguration,
};

console.log(configurationAuthority);

// Multiple independent configuration authorities can cause conflicting values.
// Prefer one clearly defined source of truth for each setting.

// ---------------------------------------------------------------------
// 29. Configuration should not be scattered
// ---------------------------------------------------------------------

const centralizedConfiguration = {
  apiBaseUrl: "https://example.com/api",
  assetBaseUrl: "https://example.com/assets",
  applicationName: "Example Application",
};

const apiEndpoint = `${centralizedConfiguration.apiBaseUrl}/users`;

console.log(apiEndpoint);

// Centralizing configuration makes dependencies easier to inspect and validate.

// ---------------------------------------------------------------------
// 30. API configuration
// ---------------------------------------------------------------------

interface ApiConfiguration {
  readonly baseUrl: string;
  readonly timeoutMs: number;
}

const apiConfiguration: ApiConfiguration = {
  baseUrl: "https://example.com/api",
  timeoutMs: 10_000,
};

console.log(apiConfiguration);

// API configuration can include public endpoint information and client behavior settings.

// ---------------------------------------------------------------------
// 31. API URL construction
// ---------------------------------------------------------------------

const createApiUrl = (config: ApiConfiguration, path: string): string => {
  return new URL(path.replace(/^\/+/, ""), `${normalizeBaseUrl(config.baseUrl)}/`).toString();
};

console.log(createApiUrl(apiConfiguration, "/users"));

// URL construction should avoid accidental duplicate or missing slashes.

// ---------------------------------------------------------------------
// 32. Request timeout configuration
// ---------------------------------------------------------------------

const requestTimeoutMs = 10_000;

const isRequestTimeoutValid = (timeout: number): boolean => {
  return timeout > 0;
};

console.log(isRequestTimeoutValid(requestTimeoutMs)); // true

// Operational settings such as request timeouts can be configurable without exposing secrets.

// ---------------------------------------------------------------------
// 33. Asset configuration
// ---------------------------------------------------------------------

interface AssetConfiguration {
  readonly baseUrl: string;
  readonly version: string;
}

const assetConfiguration: AssetConfiguration = {
  baseUrl: "https://example.com/assets",
  version: "1.0.0",
};

console.log(assetConfiguration);

// Asset configuration controls where static resources are expected to be served from.

// ---------------------------------------------------------------------
// 34. Content-hashed assets
// ---------------------------------------------------------------------

const hashedAsset = {
  file: "application.a1b2c3.js",
  baseUrl: assetConfiguration.baseUrl,
};

const hashedAssetUrl = `${hashedAsset.baseUrl}/${hashedAsset.file}`;

console.log(hashedAssetUrl);

// Content-hashed filenames allow long-lived caching because changed content receives a new URL.

// ---------------------------------------------------------------------
// 35. Application base path
// ---------------------------------------------------------------------

const applicationBasePath = "/example/";

const resolveApplicationPath = (path: string): string => {
  return `${applicationBasePath}${path.replace(/^\/+/, "")}`;
};

console.log(resolveApplicationPath("/settings")); // "/example/settings"

// Applications deployed under a subpath need consistent base-path configuration.

// ---------------------------------------------------------------------
// 36. Feature configuration
// ---------------------------------------------------------------------

interface FeatureConfiguration {
  readonly search: boolean;
  readonly accountSettings: boolean;
}

const featureConfiguration: FeatureConfiguration = {
  search: true,
  accountSettings: true,
};

console.log(featureConfiguration);

// Feature configuration determines whether application features are enabled.

// ---------------------------------------------------------------------
// 37. Configuration versus feature flags
// ---------------------------------------------------------------------

const configurationAndFlags = {
  configuration: {
    apiBaseUrl: "https://example.com/api",
  },
  featureFlags: {
    newSearch: false,
  },
};

console.log(configurationAndFlags);

// Stable environment configuration and dynamically managed feature flags are different concerns.

// ---------------------------------------------------------------------
// 38. Logging configuration
// ---------------------------------------------------------------------

type LogLevel = "error" | "warn" | "info" | "debug";

interface LoggingConfiguration {
  readonly level: LogLevel;
  readonly includeDebugLogs: boolean;
}

const loggingConfiguration: LoggingConfiguration = {
  level: "info",
  includeDebugLogs: false,
};

console.log(loggingConfiguration);

// Production logging should be intentional and should avoid exposing sensitive information.

// ---------------------------------------------------------------------
// 39. Error reporting configuration
// ---------------------------------------------------------------------

interface ErrorReportingConfiguration {
  readonly enabled: boolean;
  readonly environment: EnvironmentName;
}

const errorReportingConfiguration: ErrorReportingConfiguration = {
  enabled: true,
  environment: "production",
};

console.log(errorReportingConfiguration);

// Error monitoring often needs to know the deployment environment
// so events can be grouped and investigated correctly.

// ---------------------------------------------------------------------
// 40. Performance monitoring configuration
// ---------------------------------------------------------------------

interface PerformanceConfiguration {
  readonly enabled: boolean;
  readonly sampleRate: number;
}

const performanceConfiguration: PerformanceConfiguration = {
  enabled: true,
  sampleRate: 0.1,
};

console.log(performanceConfiguration);

// Performance monitoring may sample only a subset of sessions or transactions.
// Sampling is an operational policy rather than a security mechanism.

// ---------------------------------------------------------------------
// 41. Source-map configuration
// ---------------------------------------------------------------------

type SourceMapPolicy = "public" | "private" | "disabled";

const sourceMapPolicy: SourceMapPolicy = "private";

console.log(sourceMapPolicy);

// Source maps can be kept private while still being available to controlled
// error-monitoring infrastructure.

// ---------------------------------------------------------------------
// 42. Production configuration should be explicit
// ---------------------------------------------------------------------

const explicitProductionSettings = {
  mode: "production" as const,
  minify: true,
  sourceMaps: true,
};

console.log(explicitProductionSettings);

// Explicit production settings make the intended build behavior easier to audit.

// ---------------------------------------------------------------------
// 43. Avoid implicit development defaults
// ---------------------------------------------------------------------

const resolveBuildMode = (mode: string | undefined): "development" | "production" => {
  if (mode === "production") {
    return "production";
  }

  if (mode === "development") {
    return "development";
  }

  throw new Error("Unsupported build mode.");
};

console.log(resolveBuildMode("production"));

// Unknown environment values should be handled deliberately rather than silently treated as development.

// ---------------------------------------------------------------------
// 44. Configuration validation errors
// ---------------------------------------------------------------------

class ConfigurationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ConfigurationError";
  }
}

const requireConfiguration = (value: string | undefined, name: string): string => {
  if (!value) {
    throw new ConfigurationError(`${name} is required.`);
  }

  return value;
};

console.log(requireConfiguration("https://example.com/api", "API_BASE_URL"));

// A dedicated configuration error makes startup failures easier to identify.

// ---------------------------------------------------------------------
// 45. Validating numeric configuration
// ---------------------------------------------------------------------

const requirePositiveNumber = (value: number, name: string): number => {
  if (!Number.isFinite(value) || value <= 0) {
    throw new ConfigurationError(`${name} must be a positive number.`);
  }

  return value;
};

console.log(requirePositiveNumber(10_000, "REQUEST_TIMEOUT_MS"));

// Numeric configuration should be validated rather than trusted merely because its type is number.

// ---------------------------------------------------------------------
// 46. Validating enumerated configuration
// ---------------------------------------------------------------------

const isLogLevel = (value: string): value is LogLevel => {
  return value === "error" || value === "warn" || value === "info" || value === "debug";
};

console.log(isLogLevel("info")); // true

// Runtime values need explicit validation even when TypeScript types describe the intended shape.

// ---------------------------------------------------------------------
// 47. Parsing external configuration
// ---------------------------------------------------------------------

const parseLoggingConfiguration = (value: unknown): LoggingConfiguration => {
  if (typeof value !== "object" || value === null) {
    throw new ConfigurationError("Logging configuration must be an object.");
  }

  const candidate = value as Record<string, unknown>;

  if (typeof candidate.level !== "string" || !isLogLevel(candidate.level)) {
    throw new ConfigurationError("Invalid logging level.");
  }

  if (typeof candidate.includeDebugLogs !== "boolean") {
    throw new ConfigurationError("Invalid debug logging setting.");
  }

  return {
    level: candidate.level,
    includeDebugLogs: candidate.includeDebugLogs,
  };
};

console.log(
  parseLoggingConfiguration({
    level: "info",
    includeDebugLogs: false,
  }),
);

// Configuration loaded from JSON, HTML, or another external source must be runtime-validated.

// ---------------------------------------------------------------------
// 48. Configuration loaded from JSON
// ---------------------------------------------------------------------

const configurationJson = JSON.stringify({
  apiBaseUrl: "https://example.com/api",
  assetBaseUrl: "https://example.com/assets",
});

const parsedJson: unknown = JSON.parse(configurationJson);

console.log(parsedJson);

// JSON.parse returns untrusted runtime data from TypeScript's perspective.
// The parsed value should be validated before being treated as configuration.

// ---------------------------------------------------------------------
// 49. Runtime configuration file
// ---------------------------------------------------------------------

interface RuntimeConfigFile {
  readonly apiBaseUrl: string;
  readonly assetBaseUrl: string;
}

const runtimeConfigFile: RuntimeConfigFile = {
  apiBaseUrl: "https://example.com/api",
  assetBaseUrl: "https://example.com/assets",
};

console.log(runtimeConfigFile);

// A deployed application can load a runtime configuration resource when its architecture supports it.
// This allows certain values to change without rebuilding the application.

// ---------------------------------------------------------------------
// 50. Runtime configuration endpoint
// ---------------------------------------------------------------------

const runtimeConfigEndpoint = "/config.json";

console.log(runtimeConfigEndpoint);

// A configuration endpoint or static configuration file can provide deployment-specific
// public settings to browser code at runtime.

// ---------------------------------------------------------------------
// 51. Runtime configuration must be available before use
// ---------------------------------------------------------------------

interface ConfigState {
  readonly status: "loading" | "ready" | "error";
}

const configState: ConfigState = {
  status: "ready",
};

console.log(configState);

// Components that depend on asynchronously loaded runtime configuration
// need an explicit loading and failure state.

// ---------------------------------------------------------------------
// 52. Configuration loading state
// ---------------------------------------------------------------------

export const ConfigurationLoading: FC = (): ReactElement => {
  return <p>Loading application configuration...</p>;
};

// Loading UI prevents components from attempting to use configuration that has not arrived yet.

// ---------------------------------------------------------------------
// 53. Configuration error state
// ---------------------------------------------------------------------

export const ConfigurationErrorView: FC = (): ReactElement => {
  return <p role="alert">Application configuration could not be loaded.</p>;
};

// A configuration failure should produce an intentional failure state rather than undefined behavior.

// ---------------------------------------------------------------------
// 54. Configuration-driven API client
// ---------------------------------------------------------------------

interface ApiClient {
  readonly getUrl: (path: string) => string;
}

const createApiClient = (config: ApiConfiguration): ApiClient => {
  return {
    getUrl: (path) => createApiUrl(config, path),
  };
};

const apiClient = createApiClient(apiConfiguration);

console.log(apiClient.getUrl("/users"));

// Application services can receive configuration through dependency injection
// rather than reading global configuration everywhere.

// ---------------------------------------------------------------------
// 55. Dependency injection
// ---------------------------------------------------------------------

interface UserService {
  readonly getUsersUrl: () => string;
}

const createUserService = (client: ApiClient): UserService => {
  return {
    getUsersUrl: () => client.getUrl("/users"),
  };
};

const userService = createUserService(apiClient);

console.log(userService.getUsersUrl());

// Dependency injection makes configuration-dependent code easier to test and replace.

// ---------------------------------------------------------------------
// 56. Configuration in tests
// ---------------------------------------------------------------------

const testConfiguration: ApplicationConfiguration = {
  applicationName: "Example Application",
  apiBaseUrl: "https://example.com/test-api",
  assetBaseUrl: "https://example.com/test-assets",
};

const testApiClient = createApiClient({
  baseUrl: testConfiguration.apiBaseUrl,
  timeoutMs: 5_000,
});

console.log(testApiClient.getUrl("/users"));

// Tests can supply deterministic configuration without changing production configuration.

// ---------------------------------------------------------------------
// 57. Avoid reading configuration throughout components
// ---------------------------------------------------------------------

interface ApplicationProps {
  readonly apiBaseUrl: string;
}

export const ConfiguredComponent: FC<ApplicationProps> = ({ apiBaseUrl }): ReactElement => {
  return <p>API: {apiBaseUrl}</p>;
};

// Passing configuration through well-defined dependencies makes component behavior explicit.

// ---------------------------------------------------------------------
// 58. Configuration context
// ---------------------------------------------------------------------

const configurationForUi = {
  applicationName: "Example Application",
  apiBaseUrl: "https://example.com/api",
};

export const ConfigurationDisplay: FC = (): ReactElement => {
  return (
    <section>
      <h2>{configurationForUi.applicationName}</h2>
      <p>{configurationForUi.apiBaseUrl}</p>
    </section>
  );
};

// React Context can be used when many components need the same configuration.
// The context itself should still have one authoritative configuration source.

// ---------------------------------------------------------------------
// 59. Memoizing derived configuration
// ---------------------------------------------------------------------

export const MemoizedConfigurationView: FC = (): ReactElement => {
  const derivedConfiguration = useMemo(
    () => ({
      apiUrl: `${productionConfiguration.apiBaseUrl}/users`,
    }),
    [],
  );

  return <p>{derivedConfiguration.apiUrl}</p>;
};

// Derived configuration can be memoized when its creation is meaningful or when
// stable object identity is required by dependent code.

// ---------------------------------------------------------------------
// 60. Configuration should not contain UI state
// ---------------------------------------------------------------------

const productionSettings = {
  apiBaseUrl: "https://example.com/api",
  applicationName: "Example Application",
};

const uiState = {
  menuOpen: false,
};

console.log(productionSettings);
console.log(uiState);

// Configuration describes deployment or application settings.
// Ephemeral UI state belongs in React state rather than production configuration.

// ---------------------------------------------------------------------
// 61. Configuration should not replace application state
// ---------------------------------------------------------------------

interface ApplicationState {
  readonly authenticated: boolean;
  readonly selectedSection: string;
}

const applicationState: ApplicationState = {
  authenticated: false,
  selectedSection: "home",
};

console.log(applicationState);

// Runtime state changes during application execution and should not be modeled as static configuration.

// ---------------------------------------------------------------------
// 62. Configuration should not contain user data
// ---------------------------------------------------------------------

const applicationConfigurationForClient = {
  applicationName: "Example Application",
  apiBaseUrl: "https://example.com/api",
};

const userData = {
  displayName: "John Doe",
};

console.log(applicationConfigurationForClient);
console.log(userData);

// User-specific data is runtime application data, not deployment configuration.

// ---------------------------------------------------------------------
// 63. Configuration version
// ---------------------------------------------------------------------

interface VersionedConfiguration {
  readonly version: string;
  readonly apiBaseUrl: string;
}

const versionedConfiguration: VersionedConfiguration = {
  version: "1",
  apiBaseUrl: "https://example.com/api",
};

console.log(versionedConfiguration);

// A configuration schema version can help when independently deployed components
// need to evolve their configuration contract.

// ---------------------------------------------------------------------
// 64. Configuration schema compatibility
// ---------------------------------------------------------------------

const supportedConfigurationVersions = ["1"] as const;

const isSupportedConfigurationVersion = (version: string): boolean => {
  return supportedConfigurationVersions.includes(version as (typeof supportedConfigurationVersions)[number]);
};

console.log(isSupportedConfigurationVersion("1")); // true

// Runtime configuration should be rejected or migrated when its schema is unsupported.

// ---------------------------------------------------------------------
// 65. Configuration migration
// ---------------------------------------------------------------------

interface LegacyConfiguration {
  readonly endpoint: string;
}

interface CurrentConfiguration {
  readonly apiBaseUrl: string;
}

const migrateConfiguration = (legacy: LegacyConfiguration): CurrentConfiguration => {
  return {
    apiBaseUrl: legacy.endpoint,
  };
};

console.log(
  migrateConfiguration({
    endpoint: "https://example.com/api",
  }),
);

// Explicit migration keeps compatibility logic separate from normal application configuration.

// ---------------------------------------------------------------------
// 66. Production configuration and deployment
// ---------------------------------------------------------------------

interface DeploymentConfiguration {
  readonly environment: "production";
  readonly artifactDirectory: string;
  readonly publicBaseUrl: string;
}

const deploymentConfiguration: DeploymentConfiguration = {
  environment: "production",
  artifactDirectory: "dist",
  publicBaseUrl: "https://example.com",
};

console.log(deploymentConfiguration);

// Deployment configuration connects generated artifacts with their production serving environment.

// ---------------------------------------------------------------------
// 67. Configuration and CDN
// ---------------------------------------------------------------------

interface CdnConfiguration {
  readonly assetBaseUrl: string;
  readonly enabled: boolean;
}

const cdnConfiguration: CdnConfiguration = {
  assetBaseUrl: "https://example.com/assets",
  enabled: true,
};

console.log(cdnConfiguration);

// CDN configuration can determine where static assets are requested from.

// ---------------------------------------------------------------------
// 68. Configuration and caching
// ---------------------------------------------------------------------

interface CacheConfiguration {
  readonly staticAssetMaxAgeSeconds: number;
  readonly htmlRevalidation: boolean;
}

const cacheConfiguration: CacheConfiguration = {
  staticAssetMaxAgeSeconds: 31_536_000,
  htmlRevalidation: true,
};

console.log(cacheConfiguration);

// Cache behavior is part of deployment architecture and should align with asset naming strategy.

// ---------------------------------------------------------------------
// 69. Configuration and observability
// ---------------------------------------------------------------------

interface ObservabilityConfiguration {
  readonly environment: EnvironmentName;
  readonly release: string;
}

const observabilityConfiguration: ObservabilityConfiguration = {
  environment: "production",
  release: "1.0.0",
};

console.log(observabilityConfiguration);

// Observability systems can use environment and release identifiers to associate
// runtime events with a specific deployment.

// ---------------------------------------------------------------------
// 70. Configuration and release identity
// ---------------------------------------------------------------------

interface ReleaseIdentity {
  readonly version: string;
  readonly revision: string;
}

const releaseIdentity: ReleaseIdentity = {
  version: "1.0.0",
  revision: "example-revision",
};

console.log(releaseIdentity);

// Release identity helps distinguish deployments even when application configuration is otherwise identical.

// ---------------------------------------------------------------------
// 71. Configuration and feature rollout
// ---------------------------------------------------------------------

interface FeatureRolloutConfiguration {
  readonly newSearchEnabled: boolean;
  readonly rolloutPercentage: number;
}

const featureRolloutConfiguration: FeatureRolloutConfiguration = {
  newSearchEnabled: true,
  rolloutPercentage: 10,
};

console.log(featureRolloutConfiguration);

// Rollout configuration can determine which application behavior is enabled,
// but dynamic feature-flag systems may provide a more suitable mechanism for live changes.

// ---------------------------------------------------------------------
// 72. Configuration validation before deployment
// ---------------------------------------------------------------------

const validateProductionConfiguration = (config: ApplicationConfiguration): boolean => {
  try {
    validateConfiguration(config);
    return true;
  } catch {
    return false;
  }
};

console.log(validateProductionConfiguration(productionConfiguration)); // true

// Configuration should be validated before an invalid deployment reaches users.

// ---------------------------------------------------------------------
// 73. Configuration validation at runtime
// ---------------------------------------------------------------------

const runtimeValidationResult = validateProductionConfiguration(runtimeConfiguration);

console.log(runtimeValidationResult);

// Runtime validation protects the application when configuration comes from an external source.

// ---------------------------------------------------------------------
// 74. Fail closed for required configuration
// ---------------------------------------------------------------------

const requireProductionConfiguration = (config: Partial<ApplicationConfiguration>): ApplicationConfiguration => {
  if (!config.applicationName || !config.apiBaseUrl || !config.assetBaseUrl) {
    throw new ConfigurationError("Required production configuration is missing.");
  }

  return {
    applicationName: config.applicationName,
    apiBaseUrl: config.apiBaseUrl,
    assetBaseUrl: config.assetBaseUrl,
  };
};

console.log(requireProductionConfiguration(productionConfiguration));

// Required configuration should not silently degrade into an invalid or unsafe state.

// ---------------------------------------------------------------------
// 75. Configuration observability without secrets
// ---------------------------------------------------------------------

const configurationDiagnostics = {
  environment: "production",
  apiConfigured: true,
  assetBaseConfigured: true,
};

console.log(configurationDiagnostics);

// Diagnostics can report configuration presence and metadata without logging secret values.

// ---------------------------------------------------------------------
// 76. Avoid logging sensitive configuration
// ---------------------------------------------------------------------

const sensitiveConfiguration = {
  publicApiBaseUrl: "https://example.com/api",
  privateKey: "server-managed-secret",
};

const safeDiagnosticOutput = {
  publicApiBaseUrl: sensitiveConfiguration.publicApiBaseUrl,
  privateKeyConfigured: sensitiveConfiguration.privateKey.length > 0,
};

console.log(safeDiagnosticOutput);

// Production diagnostics should report whether sensitive configuration exists,
// not the sensitive value itself.

// ---------------------------------------------------------------------
// 77. Production configuration checklist
// ---------------------------------------------------------------------

const productionConfigurationChecklist = [
  "Define a clear configuration schema.",
  "Separate build-time and runtime configuration.",
  "Keep browser-delivered configuration public by design.",
  "Keep secrets in server-side or deployment-managed secret stores.",
  "Validate external configuration at runtime.",
  "Fail clearly when required configuration is missing.",
  "Centralize configuration ownership.",
  "Document configuration precedence.",
  "Keep configuration separate from UI state and user data.",
  "Associate observability data with environment and release identity.",
  "Validate configuration before deployment.",
] as const;

console.log(productionConfigurationChecklist);

// A production configuration strategy should be explicit about ownership,
// timing, validation, visibility, and deployment behavior.

// ---------------------------------------------------------------------
// 78. Complete configuration model
// ---------------------------------------------------------------------

interface CompleteProductionConfiguration {
  readonly application: ApplicationConfiguration;
  readonly build: BuildConfiguration;
  readonly logging: LoggingConfiguration;
  readonly performance: PerformanceConfiguration;
  readonly sourceMaps: SourceMapPolicy;
}

const completeProductionConfiguration: CompleteProductionConfiguration = {
  application: productionConfiguration,
  build: buildConfiguration,
  logging: loggingConfiguration,
  performance: performanceConfiguration,
  sourceMaps: sourceMapPolicy,
};

console.log(completeProductionConfiguration);

// Grouping related settings creates a configuration model that can be validated as a whole.

// ---------------------------------------------------------------------
// 79. Production configuration component
// ---------------------------------------------------------------------

export const ProductionConfigurationView: FC = (): ReactElement => {
  const config = completeProductionConfiguration;

  return (
    <section>
      <h1>{config.application.applicationName}</h1>
      <dl>
        <dt>Environment</dt>
        <dd>{config.build.mode}</dd>

        <dt>API</dt>
        <dd>{config.application.apiBaseUrl}</dd>

        <dt>Logging</dt>
        <dd>{config.logging.level}</dd>

        <dt>Source maps</dt>
        <dd>{config.sourceMaps}</dd>
      </dl>
    </section>
  );
};

// A configuration view should expose only information that is safe and useful for the client.

// ---------------------------------------------------------------------
// 80. Production configuration flow
// ---------------------------------------------------------------------

export const ProductionConfigurationOverview: FC = (): ReactElement => {
  const config = completeProductionConfiguration;

  return (
    <main>
      <h1>Production configuration</h1>

      <p>{config.application.applicationName}</p>

      <ProductionConfigurationView />
    </main>
  );
};

export default ProductionConfigurationOverview;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Production configuration defines values that control how an application is built, deployed, and operated.
// - Configuration should have an explicit, typed shape and a clearly defined source of truth.
// - Build-time configuration controls the generated production artifacts.
// - Runtime configuration is consumed after the application has been deployed.
// - Browser-delivered configuration is public and must never contain secrets.
// - Environment variables are not automatically safe for browser delivery; a build system must explicitly expose client-visible values.
// - Required configuration should be validated and should fail clearly when missing or invalid.
// - External configuration loaded from JSON, HTML, or another runtime source requires runtime validation.
// - Configuration precedence should be explicit when multiple sources are supported.
// - Configuration should be centralized rather than scattered throughout application components.
// - API endpoints, asset paths, logging settings, monitoring settings, and deployment metadata can be represented as configuration.
// - Configuration should remain separate from UI state, user data, and other values that change during application execution.
// - Dependency injection can make configuration-dependent services easier to test and replace.
// - Production diagnostics should expose configuration metadata without logging secret values.
// - Source-map, caching, CDN, observability, and release settings should align with the deployment architecture.
// - Configuration can be versioned and migrated when independently deployed components need an evolving configuration contract.
// - A reliable production configuration strategy makes ownership, timing, validation, visibility, and deployment behavior explicit.
