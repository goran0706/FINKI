# Production Configuration

Production configuration defines the values and rules that determine how an application is built, deployed, and operated in a production environment.

Configuration can control build behavior, service endpoints, asset locations, logging, source maps, caching, observability, feature availability, and other environment-dependent behavior. The central security rule is that anything delivered to browser code must be treated as public.

---

## 1. Configuration is data

Configuration is data that controls application behavior without requiring the behavior itself to be rewritten.

```ts
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
```

The application code defines behavior, while configuration supplies values that vary between environments or deployments.

---

## 2. Environment-specific configuration

Different environments commonly require different configuration values.

```ts
type EnvironmentName = "development" | "staging" | "production";

interface ApplicationConfiguration {
  readonly applicationName: string;
  readonly apiBaseUrl: string;
  readonly assetBaseUrl: string;
}

const configurations: Record<EnvironmentName, ApplicationConfiguration> = {
  development: {
    applicationName: "Example Application",
    apiBaseUrl: "http://localhost:3000/api",
    assetBaseUrl: "http://localhost:3000/assets",
  },
  staging: {
    applicationName: "Example Application",
    apiBaseUrl: "https://example.com/api",
    assetBaseUrl: "https://example.com/assets",
  },
  production: {
    applicationName: "Example Application",
    apiBaseUrl: "https://example.com/api",
    assetBaseUrl: "https://example.com/assets",
  },
};
```

The exact values depend on the deployment architecture.

In a real production system, these values are commonly supplied by the build system, deployment environment, server, configuration service, or runtime configuration resource rather than being hard-coded into application source code.

---

## 3. Configuration shape

A typed configuration shape makes required settings explicit.

```ts
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
```

TypeScript can describe what valid configuration should look like, but TypeScript types do not validate external runtime values.

---

## 4. Build-time configuration

Build-time configuration controls how source code is transformed into production artifacts.

Typical build-time settings include:

```ts
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
```

Build-time configuration can affect:

- compilation
- JSX transformation
- bundling
- tree shaking
- dead-code elimination
- minification
- source-map generation
- asset naming
- code splitting
- optimization

Once the build has produced static assets, changing a build-time value generally requires another build.

---

## 5. Runtime configuration

Runtime configuration is consumed after the application has been deployed.

For example:

```ts
interface RuntimeConfiguration {
  readonly apiBaseUrl: string;
  readonly assetBaseUrl: string;
}

const runtimeConfiguration: RuntimeConfiguration = {
  apiBaseUrl: "https://example.com/api",
  assetBaseUrl: "https://example.com/assets",
};
```

A deployed application can load public runtime configuration from a resource such as:

```text
/config.json
```

This can allow certain deployment-specific values to change without rebuilding the application.

Whether this architecture is appropriate depends on how the application is hosted and deployed.

---

## 6. Build-time versus runtime configuration

The distinction is important:

| Build-time            | Runtime                               |
| --------------------- | ------------------------------------- |
| Minification          | API endpoint                          |
| Source-map generation | Public application settings           |
| Asset naming          | Runtime feature availability          |
| Dead-code elimination | Deployment-specific URLs              |
| Code transformation   | Runtime operational settings          |
| Bundle generation     | Configuration loaded after deployment |

Build-time settings affect generated artifacts.

Runtime settings affect behavior after those artifacts have been deployed.

A value that needs to change independently for every deployment should not automatically be embedded into the build if the deployment architecture supports runtime configuration instead.

---

## 7. Public configuration

Browser applications can only use configuration that is available to browser code.

For example:

```ts
interface PublicConfiguration {
  readonly apiBaseUrl: string;
  readonly applicationName: string;
}

const publicConfiguration: PublicConfiguration = {
  apiBaseUrl: "https://example.com/api",
  applicationName: "Example Application",
};
```

These values should be considered public.

A user can inspect:

- JavaScript bundles
- network requests
- HTML
- runtime configuration files
- browser storage
- exposed environment variables
- configuration embedded in the application

Therefore, a value is not secret merely because its variable is named `SECRET`, `PRIVATE_KEY`, or `API_SECRET`.

---

## 8. Secrets are not client configuration

Secrets belong on the server or in deployment infrastructure.

Examples include:

- database passwords
- private API keys
- signing keys
- private certificates
- service credentials
- encryption keys

A server-side configuration might contain:

```ts
interface ServerSecretConfiguration {
  readonly databasePassword: string;
  readonly privateApiKey: string;
}
```

This does **not** mean that such values are safe to put into a browser application.

If browser-delivered JavaScript can access a value, users can inspect it.

---

## 9. Environment variables

Environment variables are commonly used by build systems and servers.

For example:

```text
NODE_ENV=production
API_BASE_URL=https://example.com/api
```

However, an environment variable is not automatically server-only.

The important question is whether its value is exposed to the browser during the build or runtime configuration process.

Different build systems and frameworks use different mechanisms for deciding which environment variables become client-visible.

Therefore:

```text
environment variable
        ↓
build/server configuration
        ↓
possibly exposed to browser
```

The exposure mechanism must be understood before putting a value into an environment variable intended for a client application.

---

## 10. Public and server-only environment variables

A useful conceptual distinction is:

```text
Public environment
├── application name
├── public API base URL
├── public asset URL
└── public feature configuration

Server-only environment
├── database credentials
├── signing keys
├── private service credentials
└── other secrets
```

Public values may be delivered to browser code.

Server-only values must remain outside client bundles and browser-accessible runtime configuration.

---

## 11. Configuration validation

Configuration loaded from an external source should be validated at runtime.

A simple validation helper might be:

```ts
const isNonEmptyString = (value: unknown): value is string => {
  return typeof value === "string" && value.length > 0;
};
```

The important distinction is:

```text
TypeScript validation
        ↓
compile-time correctness

Runtime validation
        ↓
actual external data correctness
```

TypeScript cannot guarantee that a JSON document, environment variable, HTTP response, or deployment setting contains the expected value.

---

## 12. URL validation

Configuration containing URLs should be validated before use.

```ts
const parseUrl = (value: string): URL => {
  return new URL(value);
};

const apiUrl = parseUrl("https://example.com/api");

console.log(apiUrl.origin);
```

Malformed endpoint configuration should cause a clear configuration failure rather than producing obscure failures later during requests.

---

## 13. Configuration validation at startup

Required configuration should be validated as early as possible.

```ts
const validateConfiguration = (config: ApplicationConfiguration): void => {
  if (!isNonEmptyString(config.applicationName)) {
    throw new Error("Application name is required.");
  }

  parseUrl(config.apiBaseUrl);
  parseUrl(config.assetBaseUrl);
};

validateConfiguration(configuration);
```

Failing during initialization is preferable to silently running with invalid configuration.

This is commonly called failing fast.

---

## 14. Configuration errors

A dedicated error type can make configuration failures easier to identify.

```ts
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
```

Configuration failures should clearly identify what is missing or invalid without exposing secret values.

---

## 15. Numeric configuration

Numeric settings also require runtime validation.

```ts
const requirePositiveNumber = (value: number, name: string): number => {
  if (!Number.isFinite(value) || value <= 0) {
    throw new ConfigurationError(`${name} must be a positive number.`);
  }

  return value;
};
```

A TypeScript `number` only tells the compiler that a value is numeric.

It does not guarantee that the value is:

- positive
- finite
- within an acceptable range
- appropriate for the particular setting

---

## 16. Enumerated configuration

Configuration values that have a limited set of valid strings should be validated explicitly.

```ts
type LogLevel = "error" | "warn" | "info" | "debug";

const isLogLevel = (value: string): value is LogLevel => {
  return value === "error" || value === "warn" || value === "info" || value === "debug";
};
```

Runtime input does not automatically become safe merely because a TypeScript type describes the intended value.

---

## 17. Parsing external configuration

External configuration should initially be treated as unknown data.

```ts
const configurationJson = JSON.stringify({
  apiBaseUrl: "https://example.com/api",
  assetBaseUrl: "https://example.com/assets",
});

const parsedConfiguration: unknown = JSON.parse(configurationJson);
```

`JSON.parse()` produces runtime data.

The application must validate that data before treating it as trusted configuration.

A useful conceptual flow is:

```text
external data
     ↓
unknown
     ↓
validation
     ↓
typed configuration
     ↓
application
```

---

## 18. Runtime configuration files

A deployed application can load public configuration from a static resource.

For example:

```text
/config.json
```

The resource might contain:

```json
{
  "apiBaseUrl": "https://example.com/api",
  "assetBaseUrl": "https://example.com/assets"
}
```

This architecture is useful when the same built application artifact needs to be deployed to multiple environments.

For example:

```text
                 same build
                     │
          ┌──────────┼──────────┐
          ↓          ↓          ↓
      staging     testing   production
          │          │          │
      config.json config.json config.json
```

The application binary or static assets remain the same while public deployment-specific configuration changes.

---

## 19. Configuration loading state

When runtime configuration is loaded asynchronously, the application needs explicit loading and failure states.

Conceptually:

```ts
type ConfigurationStatus = "loading" | "ready" | "error";
```

The application should not attempt to use configuration before it has been successfully loaded and validated.

A typical flow is:

```text
start application
       ↓
load configuration
       ↓
validate configuration
       ↓
 ┌─────┴─────┐
 ↓           ↓
valid       invalid
 ↓           ↓
start       fail clearly
application
```

---

## 20. Configuration defaults

Defaults can provide predictable behavior for optional settings.

```ts
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
```

Defaults are appropriate when a missing value has a known safe behavior.

---

## 21. Avoid unsafe defaults

Required production settings should generally fail validation rather than silently falling back to an incorrect value.

```ts
const resolveRequiredApiUrl = (value: string | undefined): string => {
  if (!value) {
    throw new ConfigurationError("API base URL is required.");
  }

  return value;
};
```

An unsafe default can cause an application to:

- contact the wrong service
- send data to the wrong environment
- silently disable required behavior
- hide deployment mistakes

---

## 22. Configuration precedence

Applications sometimes support multiple configuration sources.

For example:

```text
defaults
   ↓
environment configuration
   ↓
deployment configuration
   ↓
runtime configuration
```

If multiple sources are supported, their precedence should be explicit.

```ts
const mergedConfiguration = {
  ...defaults,
  ...environmentValues,
};
```

Later sources override earlier sources in this example.

The important property is determinism: the same inputs should produce the same configuration.

---

## 23. One configuration authority

Configuration should have a clearly defined source of truth.

A problematic architecture can have:

```text
component A → environment variable
component B → configuration file
service C   → hard-coded URL
service D   → another configuration object
```

This makes conflicting configuration values possible.

A better architecture centralizes configuration:

```text
deployment configuration
          ↓
   configuration loader
          ↓
 configuration validation
          ↓
    application config
       ↙    ↓    ↘
   service  API  logging
```

Each setting should have one authoritative source.

---

## 24. Centralize configuration

Configuration should not be scattered throughout application code.

Instead of:

```ts
const endpoint = "https://example.com/api";
```

being repeated in many locations, application services can receive configuration explicitly.

```ts
interface ApiConfiguration {
  readonly baseUrl: string;
  readonly timeoutMs: number;
}

const apiConfiguration: ApiConfiguration = {
  baseUrl: "https://example.com/api",
  timeoutMs: 10_000,
};
```

Centralization makes configuration easier to inspect, validate, test, and change.

---

## 25. Dependency injection

Configuration-dependent services can receive their dependencies explicitly.

```ts
interface ApiClient {
  readonly getUrl: (path: string) => string;
}

const createApiClient = (config: ApiConfiguration): ApiClient => {
  return {
    getUrl: (path) => new URL(path.replace(/^\/+/, ""), `${config.baseUrl.replace(/\/+$/, "")}/`).toString(),
  };
};
```

The service does not need to know where configuration originated.

This makes it easier to substitute configuration during testing.

---

## 26. Configuration in tests

Tests can provide deterministic configuration independently of production configuration.

```ts
const testConfiguration: ApiConfiguration = {
  baseUrl: "https://example.com/test-api",
  timeoutMs: 5_000,
};

const testApiClient = createApiClient(testConfiguration);

console.log(testApiClient.getUrl("/users"));
```

Dependency injection prevents tests from depending unnecessarily on the production environment.

---

## 27. API configuration

API configuration commonly contains public endpoint information and client behavior settings.

```ts
interface ApiConfiguration {
  readonly baseUrl: string;
  readonly timeoutMs: number;
}

const apiConfiguration: ApiConfiguration = {
  baseUrl: "https://example.com/api",
  timeoutMs: 10_000,
};
```

A public API base URL is not a secret.

Authentication credentials, private service credentials, and signing keys are separate concerns.

---

## 28. API URL construction

URL construction should avoid accidental duplicate or missing slashes.

```ts
const normalizeBaseUrl = (value: string): string => {
  return value.endsWith("/") ? value.slice(0, -1) : value;
};

const createApiUrl = (config: ApiConfiguration, path: string): string => {
  return new URL(path.replace(/^\/+/, ""), `${normalizeBaseUrl(config.baseUrl)}/`).toString();
};

console.log(createApiUrl(apiConfiguration, "/users"));
```

Centralizing URL construction prevents small formatting differences from producing inconsistent endpoints.

---

## 29. Request timeout configuration

Operational settings such as request timeouts can be configurable without exposing secrets.

```ts
const requestTimeoutMs = 10_000;

const isRequestTimeoutValid = (timeout: number): boolean => {
  return Number.isFinite(timeout) && timeout > 0;
};
```

Production configuration should define acceptable ranges rather than merely accepting arbitrary values.

---

## 30. Asset configuration

Static assets may be served from a configurable location.

```ts
interface AssetConfiguration {
  readonly baseUrl: string;
  readonly version: string;
}

const assetConfiguration: AssetConfiguration = {
  baseUrl: "https://example.com/assets",
  version: "1.0.0",
};
```

Asset configuration is particularly relevant when assets are served through a CDN or a different origin.

---

## 31. Content-hashed assets

Production builds commonly generate filenames containing content hashes.

For example:

```text
application.a1b2c3.js
```

If the content changes:

```text
application.f7e8d9.js
```

The URL changes with the content.

This allows static assets to use long-lived caching because a changed file receives a new URL.

Configuration therefore interacts with:

- asset URLs
- CDN behavior
- cache headers
- deployment strategy

---

## 32. Application base path

An application may be deployed under a subpath rather than the domain root.

For example:

```text
https://example.com/example/
```

The application needs a consistent base-path configuration so generated links and asset URLs resolve correctly.

```ts
const applicationBasePath = "/example/";

const resolveApplicationPath = (path: string): string => {
  return `${applicationBasePath}${path.replace(/^\/+/, "")}`;
};
```

Base-path configuration must be consistent with the hosting configuration.

---

## 33. Logging configuration

Production logging should be intentional.

```ts
type LogLevel = "error" | "warn" | "info" | "debug";

interface LoggingConfiguration {
  readonly level: LogLevel;
  readonly includeDebugLogs: boolean;
}

const loggingConfiguration: LoggingConfiguration = {
  level: "info",
  includeDebugLogs: false,
};
```

Logging configuration can control:

- minimum log level
- debug logging
- structured logging
- request identifiers
- diagnostic output

Sensitive information should never be logged merely because it is available to the application.

---

## 34. Error reporting configuration

Error monitoring often needs deployment metadata.

```ts
interface ErrorReportingConfiguration {
  readonly enabled: boolean;
  readonly environment: EnvironmentName;
}

const errorReportingConfiguration: ErrorReportingConfiguration = {
  enabled: true,
  environment: "production",
};
```

Environment and release identifiers help monitoring systems associate runtime errors with a particular deployment.

---

## 35. Performance monitoring configuration

Performance monitoring may use sampling.

```ts
interface PerformanceConfiguration {
  readonly enabled: boolean;
  readonly sampleRate: number;
}

const performanceConfiguration: PerformanceConfiguration = {
  enabled: true,
  sampleRate: 0.1,
};
```

A `0.1` sample rate means that approximately 10% of eligible events may be collected, depending on the monitoring implementation.

Sampling is an operational policy, not a security mechanism.

---

## 36. Source-map configuration

Source maps require deliberate production policy.

```ts
type SourceMapPolicy = "public" | "private" | "disabled";

const sourceMapPolicy: SourceMapPolicy = "private";
```

Source maps can remain private while being uploaded to controlled error-monitoring infrastructure.

The important distinction is between:

```text
source maps generated
        ≠
source maps publicly served
```

A build can generate source maps without making them publicly accessible.

---

## 37. Production build settings

Production configuration should make important build behavior explicit.

```ts
const productionBuildSettings = {
  mode: "production" as const,
  minify: true,
  sourceMaps: true,
};
```

Explicit settings make intended production behavior easier to audit.

Unknown or unsupported build modes should not silently fall back to development behavior.

```ts
const resolveBuildMode = (mode: string | undefined): "development" | "production" => {
  if (mode === "production") {
    return "production";
  }

  if (mode === "development") {
    return "development";
  }

  throw new ConfigurationError("Unsupported build mode.");
};
```

---

## 38. Configuration versus feature flags

Configuration and feature flags are related but distinct concerns.

Configuration generally describes deployment or environment properties:

```ts
const configuration = {
  apiBaseUrl: "https://example.com/api",
};
```

A feature flag controls whether particular behavior is enabled:

```ts
const featureFlags = {
  newSearch: false,
};
```

The distinction becomes especially important when feature availability needs to change without rebuilding or redeploying the application.

---

## 39. Feature rollout configuration

Some systems use rollout configuration:

```ts
interface FeatureRolloutConfiguration {
  readonly newSearchEnabled: boolean;
  readonly rolloutPercentage: number;
}

const featureRolloutConfiguration: FeatureRolloutConfiguration = {
  newSearchEnabled: true,
  rolloutPercentage: 10,
};
```

For dynamic rollouts, a dedicated feature-flag system may be more appropriate than static deployment configuration.

---

## 40. Configuration and caching

Caching behavior is part of deployment architecture.

```ts
interface CacheConfiguration {
  readonly staticAssetMaxAgeSeconds: number;
  readonly htmlRevalidation: boolean;
}

const cacheConfiguration: CacheConfiguration = {
  staticAssetMaxAgeSeconds: 31_536_000,
  htmlRevalidation: true,
};
```

A common production strategy is:

```text
HTML
  ↓
short-lived / revalidated

hashed static assets
  ↓
long-lived / immutable
```

This strategy works because content-hashed assets receive new URLs whenever their content changes.

---

## 41. Configuration and CDN deployment

Static assets may be served through a CDN.

```ts
interface CdnConfiguration {
  readonly assetBaseUrl: string;
  readonly enabled: boolean;
}

const cdnConfiguration: CdnConfiguration = {
  assetBaseUrl: "https://example.com/assets",
  enabled: true,
};
```

CDN configuration should align with:

- asset URLs
- cache headers
- content hashing
- deployment paths
- invalidation strategy

---

## 42. Observability configuration

Observability systems commonly need environment and release information.

```ts
interface ObservabilityConfiguration {
  readonly environment: EnvironmentName;
  readonly release: string;
}

const observabilityConfiguration: ObservabilityConfiguration = {
  environment: "production",
  release: "1.0.0",
};
```

This allows runtime events to be associated with a particular deployment.

---

## 43. Release identity

A release can be identified using multiple values.

```ts
interface ReleaseIdentity {
  readonly version: string;
  readonly revision: string;
}

const releaseIdentity: ReleaseIdentity = {
  version: "1.0.0",
  revision: "example-revision",
};
```

A version can identify the application release while a revision can identify the exact source-control revision or build.

This is particularly useful when investigating production failures.

---

## 44. Configuration should not contain application state

Configuration describes relatively stable deployment or application settings.

Application state changes during execution.

```text
Configuration
├── API base URL
├── asset location
├── logging level
└── deployment environment

Application state
├── authenticated user
├── selected page
├── loaded records
└── UI state
```

Runtime state should not be modeled as static production configuration.

---

## 45. Configuration should not contain user data

User-specific information is application data rather than deployment configuration.

```ts
const applicationConfiguration = {
  applicationName: "Example Application",
  apiBaseUrl: "https://example.com/api",
};

const userData = {
  displayName: "John Doe",
};
```

Configuration should describe the application or deployment rather than individual users.

---

## 46. Configuration versioning

A configuration schema can be versioned when independently deployed systems depend on it.

```ts
interface VersionedConfiguration {
  readonly version: string;
  readonly apiBaseUrl: string;
}

const versionedConfiguration: VersionedConfiguration = {
  version: "1",
  apiBaseUrl: "https://example.com/api",
};
```

Versioning can make configuration contract changes explicit.

---

## 47. Configuration compatibility

A runtime configuration consumer can check whether it supports a configuration version.

```ts
const supportedConfigurationVersions = ["1"] as const;

const isSupportedConfigurationVersion = (version: string): boolean => {
  return supportedConfigurationVersions.includes(version as (typeof supportedConfigurationVersions)[number]);
};
```

Unsupported configuration should be rejected or explicitly migrated rather than silently interpreted using incorrect assumptions.

---

## 48. Configuration migration

When a configuration schema changes, migration can translate an older representation into the current one.

```ts
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
```

Keeping migration logic separate from normal configuration processing makes compatibility behavior easier to reason about.

---

## 49. Deployment configuration

Deployment configuration connects generated artifacts with their production serving environment.

```ts
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
```

This can describe where artifacts are generated, where they are served, and which public URL represents the deployment.

---

## 50. Configuration diagnostics

Production diagnostics should expose useful metadata without exposing secrets.

```ts
const configurationDiagnostics = {
  environment: "production",
  apiConfigured: true,
  assetBaseConfigured: true,
};
```

A diagnostic system can report:

```text
API configured: yes
Asset base configured: yes
Database configured: yes
Signing key configured: yes
```

without reporting:

```text
Database password: ********
Signing key: actual-secret-value
```

---

## 51. Avoid logging sensitive configuration

Sensitive configuration should never be logged merely for debugging convenience.

```ts
const sensitiveConfiguration = {
  publicApiBaseUrl: "https://example.com/api",
  privateKey: "server-managed-secret",
};

const safeDiagnosticOutput = {
  publicApiBaseUrl: sensitiveConfiguration.publicApiBaseUrl,
  privateKeyConfigured: sensitiveConfiguration.privateKey.length > 0,
};
```

The diagnostic output reports the presence of the secret rather than the secret itself.

Even indirect logging should be considered carefully because logs are frequently copied into external systems.

---

## 52. Configuration validation before deployment

Configuration can be validated before an application reaches production.

```ts
const validateProductionConfiguration = (config: ApplicationConfiguration): boolean => {
  try {
    validateConfiguration(config);
    return true;
  } catch {
    return false;
  }
};
```

Validation can be part of:

```text
build
  ↓
configuration validation
  ↓
production artifact
  ↓
deployment
```

The goal is to prevent known-invalid configuration from reaching production.

---

## 53. Runtime validation after deployment

Pre-deployment validation does not eliminate the need for runtime validation.

Runtime configuration may come from:

- a JSON file
- an HTML document
- environment-specific infrastructure
- a configuration endpoint
- another external service

Therefore:

```text
pre-deployment validation
        +
runtime validation
```

provides protection at two different stages.

---

## 54. Fail closed for required configuration

Required configuration should not silently degrade into an invalid state.

```ts
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
```

A missing required value should produce a clear failure rather than an incorrect fallback.

---

## 55. Configuration ownership

A production configuration strategy should answer five questions for every important setting:

```text
Who owns it?
Where does it come from?
When is it resolved?
Who can see it?
What happens when it is invalid?
```

For example:

| Setting           | Source                   | Timing         | Visibility         |
| ----------------- | ------------------------ | -------------- | ------------------ |
| API base URL      | deployment configuration | runtime/build  | public             |
| Asset base URL    | deployment configuration | runtime/build  | public             |
| Database password | secret store             | server runtime | secret             |
| Build mode        | build system             | build time     | build-only         |
| Logging level     | deployment configuration | runtime        | public/operational |
| Signing key       | secret store             | server runtime | secret             |

This model prevents configuration concerns from becoming mixed together.

---

## 56. Complete production configuration model

A production configuration can be divided into logical groups.

```ts
interface CompleteProductionConfiguration {
  readonly application: ApplicationConfiguration;
  readonly build: BuildConfiguration;
  readonly logging: LoggingConfiguration;
  readonly performance: PerformanceConfiguration;
  readonly sourceMaps: SourceMapPolicy;
}

const completeProductionConfiguration: CompleteProductionConfiguration = {
  application: configuration,
  build: buildConfiguration,
  logging: loggingConfiguration,
  performance: performanceConfiguration,
  sourceMaps: sourceMapPolicy,
};
```

Grouping related settings creates a configuration model that can be validated as a whole.

---

## 57. Production configuration flow

A useful overall model is:

```text
                    Configuration sources
                            │
             ┌──────────────┼──────────────┐
             ↓              ↓              ↓
          defaults     environment     deployment
             │              │              │
             └──────────────┼──────────────┘
                            ↓
                  configuration resolution
                            ↓
                    runtime validation
                            ↓
                  validated configuration
                            │
             ┌──────────────┼──────────────┐
             ↓              ↓              ↓
           API           assets       observability
             │              │              │
             └──────────────┼──────────────┘
                            ↓
                      application
```

The exact architecture varies, but the important properties remain the same:

1. Configuration has defined sources.
2. Configuration precedence is deterministic.
3. External values are validated.
4. Public values are treated as public.
5. Secrets remain outside browser-delivered code.
6. Application code consumes validated configuration rather than independently reading configuration sources.

---

## 58. Production configuration checklist

A production configuration strategy should:

- Define a clear configuration schema.
- Separate build-time and runtime configuration.
- Keep browser-delivered configuration public by design.
- Keep secrets in server-side or deployment-managed secret stores.
- Validate external configuration at runtime.
- Fail clearly when required configuration is missing.
- Centralize configuration ownership.
- Document configuration precedence.
- Keep configuration separate from UI state and user data.
- Associate observability data with environment and release identity.
- Validate configuration before deployment.
- Align asset configuration with CDN and caching strategy.
- Avoid logging secret values.
- Version configuration schemas when compatibility requires it.
- Keep configuration-dependent services independently testable.

---

## Summary

- Production configuration defines values that control how an application is built, deployed, and operated.
- Configuration should have an explicit, typed shape and a clearly defined source of truth.
- Build-time configuration controls generated production artifacts.
- Runtime configuration is consumed after deployment.
- Browser-delivered configuration is public and must never contain secrets.
- Environment variables are not automatically safe for browser delivery.
- Required configuration should be validated and should fail clearly when missing or invalid.
- External configuration loaded from JSON, HTML, or another runtime source requires runtime validation.
- Configuration precedence should be explicit when multiple sources are supported.
- Configuration should be centralized rather than scattered throughout application code.
- API endpoints, asset paths, logging settings, monitoring settings, caching settings, and deployment metadata can be represented as configuration.
- Configuration should remain separate from application state and user-specific data.
- Dependency injection can make configuration-dependent services easier to test and replace.
- Production diagnostics should expose configuration metadata without logging secret values.
- Source-map, caching, CDN, and observability settings should align with the deployment architecture.
- Configuration can be versioned and migrated when independently deployed components require an evolving configuration contract.
- A reliable production configuration strategy makes ownership, timing, validation, visibility, and deployment behavior explicit.
