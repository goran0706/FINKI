/**
 * Runtime Config vs. Build-Time Config
 * =====================================
 *
 * Build-time configuration is resolved while the application is being built and can affect
 * the generated assets. Runtime configuration is resolved after deployment while the application
 * is running, allowing certain deployment-specific values to change without rebuilding the assets.
 */

import { useEffect, useState, type FC, type ReactElement } from "react";

// ---------------------------------------------------------------------
// 1. Two different configuration lifecycles
// ---------------------------------------------------------------------

type ConfigurationLifecycle = "build-time" | "runtime";

const buildTime: ConfigurationLifecycle = "build-time";
const runtime: ConfigurationLifecycle = "runtime";

console.log(buildTime); // "build-time"
console.log(runtime); // "runtime"

// Build-time configuration is consumed by the build process.
// Runtime configuration is consumed by the running application.

// ---------------------------------------------------------------------
// 2. Build-time configuration
// ---------------------------------------------------------------------

interface BuildTimeConfiguration {
  readonly mode: "development" | "production";
  readonly minify: boolean;
  readonly sourceMaps: boolean;
}

const buildConfiguration: BuildTimeConfiguration = {
  mode: "production",
  minify: true,
  sourceMaps: true,
};

console.log(buildConfiguration);

// Build-time values can change how source code is transformed and which assets are generated.

// ---------------------------------------------------------------------
// 3. Runtime configuration
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

// Runtime values are read or resolved by the deployed application while it executes.

// ---------------------------------------------------------------------
// 4. The important distinction
// ---------------------------------------------------------------------

interface ConfigurationComparison {
  readonly buildTime: readonly string[];
  readonly runtime: readonly string[];
}

const configurationComparison: ConfigurationComparison = {
  buildTime: ["bundler behavior", "minification", "source-map generation", "compile-time constants"],
  runtime: ["API endpoint", "deployment-specific public settings", "runtime feature configuration"],
};

console.log(configurationComparison);

// The key distinction is when the value becomes available to the application.

// ---------------------------------------------------------------------
// 5. Build-time values become part of the output
// ---------------------------------------------------------------------

const BUILD_MODE = "production";

const buildMessage = BUILD_MODE === "production" ? "Production build" : "Development build";

console.log(buildMessage);

// A build tool can replace a configured compile-time value during the build.
// An optimizer may then simplify branches that depend on that known value.

// ---------------------------------------------------------------------
// 6. Runtime values are read after deployment
// ---------------------------------------------------------------------

interface RuntimeSettings {
  readonly apiBaseUrl: string;
}

const runtimeSettings: RuntimeSettings = {
  apiBaseUrl: "https://example.com/api",
};

const usersEndpoint = `${runtimeSettings.apiBaseUrl}/users`;

console.log(usersEndpoint);

// The endpoint is consumed when the application runs rather than determining how
// the application's JavaScript source is transformed.

// ---------------------------------------------------------------------
// 7. Rebuilding after a build-time change
// ---------------------------------------------------------------------

interface Deployment {
  readonly buildValue: string;
  readonly requiresRebuild: boolean;
}

const buildTimeDeployment: Deployment = {
  buildValue: "https://example.com/api",
  requiresRebuild: true,
};

console.log(buildTimeDeployment);

// If a value is embedded into the generated client assets at build time,
// changing that value normally requires another build.

// ---------------------------------------------------------------------
// 8. Changing runtime configuration
// ---------------------------------------------------------------------

const runtimeDeployment: Deployment = {
  buildValue: "loaded after deployment",
  requiresRebuild: false,
};

console.log(runtimeDeployment);

// A genuinely runtime-loaded value can change without rebuilding the application assets,
// provided the deployment architecture supports that configuration mechanism.

// ---------------------------------------------------------------------
// 9. Example: build-time environment value
// ---------------------------------------------------------------------

interface BuildEnvironment {
  readonly applicationName: string;
  readonly production: boolean;
}

const buildEnvironment: BuildEnvironment = {
  applicationName: "Example Application",
  production: true,
};

console.log(buildEnvironment);

// A build system can use environment-specific values while generating the application.

// ---------------------------------------------------------------------
// 10. Example: runtime configuration document
// ---------------------------------------------------------------------

const runtimeConfigurationDocument = {
  apiBaseUrl: "https://example.com/api",
  supportUrl: "https://example.com/support",
};

console.log(runtimeConfigurationDocument);

// A deployed application can load a public configuration document before using its values.

// ---------------------------------------------------------------------
// 11. Build-time configuration can control optimization
// ---------------------------------------------------------------------

const production = true;

if (production) {
  console.log("Production behavior selected at build time.");
}

// When the value is statically replaced and known to the optimizer,
// the unreachable branch may be removed from the generated asset.

// ---------------------------------------------------------------------
// 12. Runtime configuration cannot generally control bundling
// ---------------------------------------------------------------------

const runtimeFeatureEnabled = runtimeSettings.apiBaseUrl.length > 0;

if (runtimeFeatureEnabled) {
  console.log("Runtime feature is enabled.");
}

// A runtime value is not normally available to the bundler when the bundle is generated.
// Therefore it cannot generally determine which modules are included in that build.

// ---------------------------------------------------------------------
// 13. Build-time feature selection
// ---------------------------------------------------------------------

const BUILD_FEATURE = "search";

const buildFeatures = {
  search: BUILD_FEATURE === "search",
  reports: BUILD_FEATURE === "reports",
};

console.log(buildFeatures);

// Build-time feature conditions can potentially participate in dead-code elimination
// when the build tool can statically evaluate them.

// ---------------------------------------------------------------------
// 14. Runtime feature selection
// ---------------------------------------------------------------------

interface RuntimeFeatures {
  readonly search: boolean;
  readonly reports: boolean;
}

const runtimeFeatures: RuntimeFeatures = {
  search: true,
  reports: false,
};

console.log(runtimeFeatures);

// Runtime feature configuration controls behavior after the bundle already exists.

// ---------------------------------------------------------------------
// 15. Build-time feature selection affects assets
// ---------------------------------------------------------------------

const buildVariant = BUILD_FEATURE === "search" ? "search-build" : "reports-build";

console.log(buildVariant);

// A build system can produce different artifacts for different build-time variants.

// ---------------------------------------------------------------------
// 16. Runtime feature selection affects behavior
// ---------------------------------------------------------------------

const renderFeature = (features: RuntimeFeatures): string => {
  return features.search ? "Search is available." : "Search is unavailable.";
};

console.log(renderFeature(runtimeFeatures));

// The same generated application can behave differently according to runtime configuration.

// ---------------------------------------------------------------------
// 17. Same artifact, different runtime configuration
// ---------------------------------------------------------------------

const stagingRuntimeConfiguration: RuntimeConfiguration = {
  apiBaseUrl: "https://example.com/api",
  assetBaseUrl: "https://example.com/assets",
};

const productionRuntimeConfiguration: RuntimeConfiguration = {
  apiBaseUrl: "https://example.com/api",
  assetBaseUrl: "https://example.com/assets",
};

console.log(stagingRuntimeConfiguration);
console.log(productionRuntimeConfiguration);

// The same client artifact can consume different runtime values when those values
// are supplied independently of the build.

// ---------------------------------------------------------------------
// 18. The classic build-time configuration problem
// ---------------------------------------------------------------------

interface BuiltArtifact {
  readonly apiBaseUrl: string;
  readonly sourceRevision: string;
}

const builtArtifact: BuiltArtifact = {
  apiBaseUrl: "https://example.com/api",
  sourceRevision: "example-revision",
};

console.log(builtArtifact);

// If the API URL is embedded into this artifact, the artifact itself contains that value.
// Changing the URL requires regenerating the artifact.

// ---------------------------------------------------------------------
// 19. Runtime configuration avoids embedding deployment-specific values
// ---------------------------------------------------------------------

interface GenericArtifact {
  readonly sourceRevision: string;
  readonly containsApiBaseUrl: boolean;
}

const genericArtifact: GenericArtifact = {
  sourceRevision: "example-revision",
  containsApiBaseUrl: false,
};

console.log(genericArtifact);

// A runtime-configured artifact can remain environment-independent with respect to
// values that are loaded after deployment.

// ---------------------------------------------------------------------
// 20. Runtime configuration file
// ---------------------------------------------------------------------

interface PublicRuntimeConfig {
  readonly apiBaseUrl: string;
  readonly applicationName: string;
}

const publicRuntimeConfig: PublicRuntimeConfig = {
  apiBaseUrl: "https://example.com/api",
  applicationName: "Example Application",
};

const runtimeConfigJson = JSON.stringify(publicRuntimeConfig);

console.log(runtimeConfigJson);

// A static JSON file is one possible mechanism for delivering public runtime configuration.

// ---------------------------------------------------------------------
// 21. Runtime configuration loading
// ---------------------------------------------------------------------

const loadRuntimeConfiguration = async (url: string): Promise<PublicRuntimeConfig> => {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Configuration request failed: ${response.status}`);
  }

  return response.json() as Promise<PublicRuntimeConfig>;
};

void loadRuntimeConfiguration;

// Runtime configuration can be fetched before the application initializes.
// External data must still be validated before being trusted as configuration.

// ---------------------------------------------------------------------
// 22. Runtime configuration must be validated
// ---------------------------------------------------------------------

const isPublicRuntimeConfig = (value: unknown): value is PublicRuntimeConfig => {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const candidate = value as Record<string, unknown>;

  return typeof candidate.apiBaseUrl === "string" && typeof candidate.applicationName === "string";
};

console.log(isPublicRuntimeConfig(publicRuntimeConfig)); // true

// TypeScript cannot validate data arriving over HTTP.
// Runtime validation establishes that the received value matches the expected shape.

// ---------------------------------------------------------------------
// 23. Validating a fetched configuration
// ---------------------------------------------------------------------

const parsePublicRuntimeConfig = (value: unknown): PublicRuntimeConfig => {
  if (!isPublicRuntimeConfig(value)) {
    throw new Error("Invalid runtime configuration.");
  }

  return value;
};

console.log(parsePublicRuntimeConfig(publicRuntimeConfig));

// Parsing and validation should happen before configuration is exposed to the rest of the application.

// ---------------------------------------------------------------------
// 24. Configuration loading state
// ---------------------------------------------------------------------

type ConfigurationStatus = "loading" | "ready" | "error";

const configurationStatus: ConfigurationStatus = "ready";

console.log(configurationStatus);

// Runtime configuration introduces an initialization step,
// so applications need explicit loading and error states.

// ---------------------------------------------------------------------
// 25. Runtime configuration provider
// ---------------------------------------------------------------------

interface ConfigurationProviderProps {
  readonly configuration: PublicRuntimeConfig;
  readonly children: ReactElement;
}

export const ConfigurationProvider: FC<ConfigurationProviderProps> = ({ configuration, children }): ReactElement => {
  console.log(configuration);

  return children;
};

// A provider can make validated runtime configuration available to a component tree.
// Context is useful when many components need the same configuration.

// ---------------------------------------------------------------------
// 26. Build-time configuration provider
// ---------------------------------------------------------------------

interface BuildConfigurationViewProps {
  readonly configuration: BuildTimeConfiguration;
}

export const BuildConfigurationView: FC<BuildConfigurationViewProps> = ({ configuration }): ReactElement => {
  return (
    <dl>
      <dt>Mode</dt>
      <dd>{configuration.mode}</dd>

      <dt>Minified</dt>
      <dd>{String(configuration.minify)}</dd>

      <dt>Source maps</dt>
      <dd>{String(configuration.sourceMaps)}</dd>
    </dl>
  );
};

// Build-time configuration is normally already available when the application bundle starts.

// ---------------------------------------------------------------------
// 27. Runtime configuration component
// ---------------------------------------------------------------------

interface RuntimeConfigurationViewProps {
  readonly configuration: PublicRuntimeConfig;
}

export const RuntimeConfigurationView: FC<RuntimeConfigurationViewProps> = ({ configuration }): ReactElement => {
  return (
    <dl>
      <dt>Application</dt>
      <dd>{configuration.applicationName}</dd>

      <dt>API</dt>
      <dd>{configuration.apiBaseUrl}</dd>
    </dl>
  );
};

// Runtime configuration can be passed to components like any other application data.

// ---------------------------------------------------------------------
// 28. Loading runtime configuration in React
// ---------------------------------------------------------------------

export const RuntimeConfigurationLoader: FC = (): ReactElement => {
  const [configuration, setConfiguration] = useState<PublicRuntimeConfig | null>(null);

  const [status, setStatus] = useState<ConfigurationStatus>("loading");

  useEffect(() => {
    let active = true;

    const load = async (): Promise<void> => {
      try {
        const response = await fetch("/config.json");

        if (!response.ok) {
          throw new Error(`Configuration request failed: ${response.status}`);
        }

        const value: unknown = await response.json();

        const validated = parsePublicRuntimeConfig(value);

        if (active) {
          setConfiguration(validated);
          setStatus("ready");
        }
      } catch {
        if (active) {
          setStatus("error");
        }
      }
    };

    void load();

    return () => {
      active = false;
    };
  }, []);

  if (status === "loading") {
    return <p>Loading configuration...</p>;
  }

  if (status === "error" || !configuration) {
    return <p role="alert">Configuration could not be loaded.</p>;
  }

  return <RuntimeConfigurationView configuration={configuration} />;
};

// Runtime configuration loading introduces asynchronous application initialization.
// The cleanup prevents state updates after the component has unmounted.

// ---------------------------------------------------------------------
// 29. Configuration before application startup
// ---------------------------------------------------------------------

interface StartupConfiguration {
  readonly configuration: PublicRuntimeConfig;
}

const initializeApplication = (startupConfiguration: StartupConfiguration): void => {
  console.log(startupConfiguration.configuration.apiBaseUrl);
};

initializeApplication({
  configuration: publicRuntimeConfig,
});

// Another architecture is to load and validate configuration before rendering the application.
// This avoids rendering configuration-dependent components before configuration is ready.

// ---------------------------------------------------------------------
// 30. Preloaded runtime configuration
// ---------------------------------------------------------------------

const preloadedConfiguration: PublicRuntimeConfig = {
  apiBaseUrl: "https://example.com/api",
  applicationName: "Example Application",
};

initializeApplication({
  configuration: preloadedConfiguration,
});

// Configuration can also be injected into the initial page or bootstrap process,
// depending on the deployment architecture.

// ---------------------------------------------------------------------
// 31. Runtime configuration in HTML
// ---------------------------------------------------------------------

const runtimeConfigurationElement = {
  element: "script",
  type: "application/json",
  id: "application-config",
};

console.log(runtimeConfigurationElement);

// A deployment can place public configuration into the initial HTML document.
// The application can then read and validate it before rendering.

// ---------------------------------------------------------------------
// 32. Runtime configuration endpoint versus HTML
// ---------------------------------------------------------------------

type RuntimeConfigurationDelivery = "json-endpoint" | "html";

const configurationDelivery: RuntimeConfigurationDelivery = "json-endpoint";

console.log(configurationDelivery);

// Both approaches can provide runtime values.
// The correct choice depends on caching, startup requirements, deployment architecture, and security constraints.

// ---------------------------------------------------------------------
// 33. Runtime configuration and caching
// ---------------------------------------------------------------------

interface ConfigurationCachePolicy {
  readonly configurationCanBeCached: boolean;
  readonly mustRevalidate: boolean;
}

const configurationCachePolicy: ConfigurationCachePolicy = {
  configurationCanBeCached: true,
  mustRevalidate: true,
};

console.log(configurationCachePolicy);

// Runtime configuration has its own cache lifecycle.
// A stale configuration document can cause the application to use outdated settings.

// ---------------------------------------------------------------------
// 34. Build artifact caching
// ---------------------------------------------------------------------

interface BuildArtifactCache {
  readonly contentHashed: boolean;
  readonly longLivedCaching: boolean;
}

const buildArtifactCache: BuildArtifactCache = {
  contentHashed: true,
  longLivedCaching: true,
};

console.log(buildArtifactCache);

// Build artifacts and runtime configuration can have different caching requirements.

// ---------------------------------------------------------------------
// 35. Runtime configuration and deployment
// ---------------------------------------------------------------------

interface DeploymentRuntimeConfig {
  readonly artifact: string;
  readonly configuration: string;
}

const deploymentRuntimeConfig: DeploymentRuntimeConfig = {
  artifact: "application.a1b2c3.js",
  configuration: "/config.json",
};

console.log(deploymentRuntimeConfig);

// The application artifact and runtime configuration can be deployed as separate resources.

// ---------------------------------------------------------------------
// 36. One artifact, multiple deployments
// ---------------------------------------------------------------------

interface EnvironmentDeployment {
  readonly environment: "staging" | "production";
  readonly artifactRevision: string;
  readonly configurationSource: string;
}

const stagingDeployment: EnvironmentDeployment = {
  environment: "staging",
  artifactRevision: "example-revision",
  configurationSource: "/config.json",
};

const productionDeployment: EnvironmentDeployment = {
  environment: "production",
  artifactRevision: "example-revision",
  configurationSource: "/config.json",
};

console.log(stagingDeployment);
console.log(productionDeployment);

// The same artifact revision can be promoted while each environment supplies
// its own runtime configuration.

// ---------------------------------------------------------------------
// 37. Build once, configure at runtime
// ---------------------------------------------------------------------

const promotedArtifact = {
  revision: "example-revision",
  builtOnce: true,
};

const stagingConfigurationUrl = "/config.json";
const productionConfigurationUrl = "/config.json";

console.log(promotedArtifact);
console.log(stagingConfigurationUrl);
console.log(productionConfigurationUrl);

// Runtime configuration separates the artifact lifecycle from selected deployment values.

// ---------------------------------------------------------------------
// 38. What build-time configuration is good for
// ---------------------------------------------------------------------

const buildTimeResponsibilities = [
  "Compile-time constants",
  "Production optimizations",
  "Source-map generation",
  "Asset naming",
  "Code splitting",
  "Build variants",
] as const;

console.log(buildTimeResponsibilities);

// Build-time configuration is appropriate when a value affects how the application is generated.

// ---------------------------------------------------------------------
// 39. What runtime configuration is good for
// ---------------------------------------------------------------------

const runtimeResponsibilities = [
  "Deployment-specific public endpoints",
  "Public service URLs",
  "Operational application settings",
  "Configuration that must change without rebuilding",
] as const;

console.log(runtimeResponsibilities);

// Runtime configuration is appropriate when a value should remain changeable after the artifact is built.

// ---------------------------------------------------------------------
// 40. Values that generally belong at build time
// ---------------------------------------------------------------------

const buildTimeExamples = {
  minification: true,
  sourceMaps: true,
  target: "modern-browser",
};

console.log(buildTimeExamples);

// These settings determine how source code becomes the final application assets.

// ---------------------------------------------------------------------
// 41. Values that can belong at runtime
// ---------------------------------------------------------------------

const runtimeExamples = {
  apiBaseUrl: "https://example.com/api",
  supportUrl: "https://example.com/support",
};

console.log(runtimeExamples);

// These values can be supplied to an already-built client if the architecture loads them at runtime.

// ---------------------------------------------------------------------
// 42. A value can be either build-time or runtime
// ---------------------------------------------------------------------

const apiBaseUrlAtBuildTime = {
  embedded: true,
  requiresRebuildToChange: true,
};

const apiBaseUrlAtRuntime = {
  embedded: false,
  requiresRebuildToChange: false,
};

console.log(apiBaseUrlAtBuildTime);
console.log(apiBaseUrlAtRuntime);

// The category depends on how the application obtains the value,
// not on the value's semantic name.

// ---------------------------------------------------------------------
// 43. Same variable name, different lifecycle
// ---------------------------------------------------------------------

const apiBaseUrl = "https://example.com/api";

console.log(apiBaseUrl);

// A variable named API_BASE_URL does not automatically make its value runtime configuration.
// The build and application architecture determine when that value is resolved.

// ---------------------------------------------------------------------
// 44. Build-time environment replacement
// ---------------------------------------------------------------------

interface BuildEnvironmentValue {
  readonly name: string;
  readonly resolvedDuringBuild: boolean;
}

const buildEnvironmentValue: BuildEnvironmentValue = {
  name: "PUBLIC_API_BASE_URL",
  resolvedDuringBuild: true,
};

console.log(buildEnvironmentValue);

// Some build tools expose selected environment variables as compile-time constants.
// Their exact names and exposure rules are tool-specific.

// ---------------------------------------------------------------------
// 45. Runtime environment loading
// ---------------------------------------------------------------------

interface RuntimeEnvironmentValue {
  readonly name: string;
  readonly resolvedDuringExecution: boolean;
}

const runtimeEnvironmentValue: RuntimeEnvironmentValue = {
  name: "API_BASE_URL",
  resolvedDuringExecution: true,
};

console.log(runtimeEnvironmentValue);

// A server or runtime loader can resolve configuration independently from the client build.

// ---------------------------------------------------------------------
// 46. Client-side environment variables are public
// ---------------------------------------------------------------------

const clientEnvironmentValue = {
  exposedToBrowser: true,
  confidential: false,
};

console.log(clientEnvironmentValue);

// If a build system embeds an environment variable into browser code,
// its value can be inspected by users and should be considered public.

// ---------------------------------------------------------------------
// 47. Secrets do not become safe at runtime
// ---------------------------------------------------------------------

const runtimeSecretExample = {
  loadedAtRuntime: true,
  safeForBrowser: false,
};

console.log(runtimeSecretExample);

// Loading a secret into browser JavaScript at runtime does not make it secret.
// Browser users can inspect values delivered to their browser.

// ---------------------------------------------------------------------
// 48. Server-side runtime configuration
// ---------------------------------------------------------------------

interface ServerRuntimeConfiguration {
  readonly databaseUrl: string;
  readonly signingKey: string;
}

const serverRuntimeConfiguration: ServerRuntimeConfiguration = {
  databaseUrl: "server-managed-value",
  signingKey: "server-managed-value",
};

console.log(Object.keys(serverRuntimeConfiguration));

// Server-side runtime configuration can contain secrets because the values remain in server execution.
// They must not be serialized into client responses or bundles.

// ---------------------------------------------------------------------
// 49. Public runtime configuration
// ---------------------------------------------------------------------

const publicRuntimeConfiguration = {
  apiBaseUrl: "https://example.com/api",
  applicationName: "Example Application",
};

console.log(publicRuntimeConfiguration);

// Browser runtime configuration must contain only values that are safe to expose publicly.

// ---------------------------------------------------------------------
// 50. Configuration boundary
// ---------------------------------------------------------------------

interface ConfigurationBoundary {
  readonly serverOnly: readonly string[];
  readonly clientVisible: readonly string[];
}

const configurationBoundary: ConfigurationBoundary = {
  serverOnly: ["database credentials", "private signing keys"],
  clientVisible: ["API origin", "application name"],
};

console.log(configurationBoundary);

// The server/client boundary is more important than whether configuration is technically called
// an environment variable, JSON file, or runtime object.

// ---------------------------------------------------------------------
// 51. Runtime configuration and SSR
// ---------------------------------------------------------------------

interface ServerRenderedApplication {
  readonly serverCanReadConfiguration: boolean;
  readonly browserCanReadConfiguration: boolean;
}

const serverRenderedApplication: ServerRenderedApplication = {
  serverCanReadConfiguration: true,
  browserCanReadConfiguration: true,
};

console.log(serverRenderedApplication);

// In server-rendered applications, configuration can exist on the server without being exposed.
// Only values intentionally serialized into client-visible output become browser-accessible.

// ---------------------------------------------------------------------
// 52. Runtime configuration and server components
// ---------------------------------------------------------------------

const serverOnlyValue = {
  availableToServerCode: true,
  availableToBrowserCode: false,
};

console.log(serverOnlyValue);

// Server-side execution can access private configuration while keeping it outside client bundles,
// provided the value is not passed into browser-executed code.

// ---------------------------------------------------------------------
// 53. Runtime configuration passed to client code
// ---------------------------------------------------------------------

interface ClientConfigurationProps {
  readonly apiBaseUrl: string;
}

export const ClientConfiguration: FC<ClientConfigurationProps> = ({ apiBaseUrl }): ReactElement => {
  return <p>API: {apiBaseUrl}</p>;
};

// Once configuration is passed to a Client Component, it must be treated as browser-visible data.

// ---------------------------------------------------------------------
// 54. Configuration loading failure
// ---------------------------------------------------------------------

const configurationFailure = {
  recoverable: false,
  message: "Public runtime configuration could not be loaded.",
};

console.log(configurationFailure);

// If required runtime configuration cannot be loaded,
// the application should enter an intentional failure state rather than guessing values.

// ---------------------------------------------------------------------
// 55. Configuration fallback
// ---------------------------------------------------------------------

const resolveApiBaseUrl = (configuredValue: string | undefined): string => {
  if (!configuredValue) {
    throw new Error("API base URL is required.");
  }

  return configuredValue;
};

console.log(resolveApiBaseUrl("https://example.com/api"));

// Required deployment-specific configuration should not silently fall back to an unrelated endpoint.

// ---------------------------------------------------------------------
// 56. Avoid hard-coded production endpoints
// ---------------------------------------------------------------------

const configuredApiBaseUrl = runtimeConfiguration.apiBaseUrl;

const configuredUsersEndpoint = `${configuredApiBaseUrl}/users`;

console.log(configuredUsersEndpoint);

// Hard-coding a production endpoint into application logic defeats the purpose of configurable deployment values.

// ---------------------------------------------------------------------
// 57. Configuration factory
// ---------------------------------------------------------------------

const createRuntimeConfiguration = (apiBaseUrl: string, assetBaseUrl: string): RuntimeConfiguration => {
  return {
    apiBaseUrl,
    assetBaseUrl,
  };
};

const generatedRuntimeConfiguration = createRuntimeConfiguration(
  "https://example.com/api",
  "https://example.com/assets",
);

console.log(generatedRuntimeConfiguration);

// A factory provides one controlled construction point for runtime configuration.

// ---------------------------------------------------------------------
// 58. Configuration dependency injection
// ---------------------------------------------------------------------

interface ConfigurationConsumer {
  readonly getApiUrl: (path: string) => string;
}

const createConfigurationConsumer = (config: RuntimeConfiguration): ConfigurationConsumer => {
  return {
    getApiUrl: (path) => `${config.apiBaseUrl}${path}`,
  };
};

const configurationConsumer = createConfigurationConsumer(runtimeConfiguration);

console.log(configurationConsumer.getApiUrl("/users"));

// Dependency injection keeps configuration access explicit and makes testing easier.

// ---------------------------------------------------------------------
// 59. Testing with runtime configuration
// ---------------------------------------------------------------------

const testRuntimeConfiguration: RuntimeConfiguration = {
  apiBaseUrl: "https://example.com/test-api",
  assetBaseUrl: "https://example.com/test-assets",
};

const testConsumer = createConfigurationConsumer(testRuntimeConfiguration);

console.log(testConsumer.getApiUrl("/users"));

// Tests can inject deterministic runtime configuration without modifying production configuration.

// ---------------------------------------------------------------------
// 60. Configuration should be validated once
// ---------------------------------------------------------------------

const validatedConfiguration = parsePublicRuntimeConfig(publicRuntimeConfiguration);

console.log(validatedConfiguration);

// Validate external configuration at its boundary and pass the validated value inward.

// ---------------------------------------------------------------------
// 61. Avoid repeated parsing
// ---------------------------------------------------------------------

const configurationBoundaryResult = {
  parsedOnce: true,
  reusedAfterValidation: true,
};

console.log(configurationBoundaryResult);

// Repeated parsing throughout the component tree makes configuration ownership unclear
// and can introduce inconsistent validation behavior.

// ---------------------------------------------------------------------
// 62. Runtime configuration readiness
// ---------------------------------------------------------------------

interface ConfigurationReadiness {
  readonly ready: boolean;
  readonly configuration: PublicRuntimeConfig | null;
}

const configurationReadiness: ConfigurationReadiness = {
  ready: true,
  configuration: publicRuntimeConfiguration,
};

console.log(configurationReadiness);

// Components can depend on an explicit readiness state when configuration loads asynchronously.

// ---------------------------------------------------------------------
// 63. Build-time configuration readiness
// ---------------------------------------------------------------------

const buildTimeReadiness = {
  readyAtApplicationStart: true,
};

console.log(buildTimeReadiness);

// Build-time values are normally already embedded or resolved when the browser starts executing the bundle.

// ---------------------------------------------------------------------
// 64. Configuration timing and startup
// ---------------------------------------------------------------------

interface StartupBehavior {
  readonly buildTime: string;
  readonly runtime: string;
}

const startupBehavior: StartupBehavior = {
  buildTime: "Available immediately from generated assets.",
  runtime: "May require loading before dependent UI can render.",
};

console.log(startupBehavior);

// Runtime configuration can introduce startup latency or a loading phase.

// ---------------------------------------------------------------------
// 65. Avoid rendering before required configuration
// ---------------------------------------------------------------------

export const ConfigurationGate: FC = (): ReactElement => {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  if (!ready) {
    return <p>Preparing application...</p>;
  }

  return <p>Application is ready.</p>;
};

// A configuration gate can prevent configuration-dependent UI from rendering too early.
// The real implementation should tie readiness to actual configuration loading.

// ---------------------------------------------------------------------
// 66. Runtime configuration and hydration
// ---------------------------------------------------------------------

const hydrationConfiguration = {
  serverValue: "https://example.com/api",
  browserValue: "https://example.com/api",
  valuesMatch: true,
};

console.log(hydrationConfiguration);

// Server-rendered applications should ensure that configuration-dependent output is consistent
// between server rendering and browser hydration.

// ---------------------------------------------------------------------
// 67. Configuration and caching mismatch
// ---------------------------------------------------------------------

const configurationCacheMismatch = {
  htmlVersion: "1",
  runtimeConfigVersion: "2",
};

console.log(configurationCacheMismatch);

// Independently cached HTML, JavaScript, and runtime configuration can become temporarily inconsistent.
// Deployment architecture should account for those relationships.

// ---------------------------------------------------------------------
// 68. Version runtime configuration
// ---------------------------------------------------------------------

interface VersionedRuntimeConfiguration {
  readonly version: number;
  readonly apiBaseUrl: string;
}

const versionedRuntimeConfiguration: VersionedRuntimeConfiguration = {
  version: 1,
  apiBaseUrl: "https://example.com/api",
};

console.log(versionedRuntimeConfiguration);

// A version field can help the application detect incompatible runtime configuration schemas.

// ---------------------------------------------------------------------
// 69. Configuration contract
// ---------------------------------------------------------------------

interface ConfigurationContract {
  readonly required: readonly string[];
  readonly optional: readonly string[];
}

const configurationContract: ConfigurationContract = {
  required: ["apiBaseUrl", "applicationName"],
  optional: ["supportUrl"],
};

console.log(configurationContract);

// A configuration contract defines what the application expects from its configuration source.

// ---------------------------------------------------------------------
// 70. Build-time and runtime contract boundaries
// ---------------------------------------------------------------------

interface ConfigurationContracts {
  readonly build: BuildConfiguration;
  readonly runtime: RuntimeConfiguration;
}

const configurationContracts: ConfigurationContracts = {
  build: buildConfiguration,
  runtime: runtimeConfiguration,
};

console.log(configurationContracts);

// Keeping the contracts separate makes lifecycle differences explicit.

// ---------------------------------------------------------------------
// 71. Decision rule
// ---------------------------------------------------------------------

const chooseConfigurationLifecycle = (
  changesAfterDeployment: boolean,
  affectsBuildOutput: boolean,
): ConfigurationLifecycle => {
  if (affectsBuildOutput) {
    return "build-time";
  }

  if (changesAfterDeployment) {
    return "runtime";
  }

  return "build-time";
};

console.log(chooseConfigurationLifecycle(false, true)); // "build-time"

console.log(chooseConfigurationLifecycle(true, false)); // "runtime"

// A value that changes the generated artifact belongs to the build lifecycle.
// A value that must change independently after deployment can use the runtime lifecycle.

// ---------------------------------------------------------------------
// 72. Example decision table
// ---------------------------------------------------------------------

const configurationDecisions = [
  {
    value: "minification",
    lifecycle: "build-time",
  },
  {
    value: "source-map generation",
    lifecycle: "build-time",
  },
  {
    value: "public API endpoint",
    lifecycle: "runtime",
  },
  {
    value: "asset base URL",
    lifecycle: "runtime",
  },
] as const;

console.log(configurationDecisions);

// The appropriate lifecycle depends on when the value must be resolved and what it controls.

// ---------------------------------------------------------------------
// 73. Trade-off: build-time simplicity
// ---------------------------------------------------------------------

const buildTimeTradeoffs = {
  startup: "simple",
  deploymentConfiguration: "tied to artifact",
};

console.log(buildTimeTradeoffs);

// Build-time configuration is straightforward because values are available as part of the generated application.

// ---------------------------------------------------------------------
// 74. Trade-off: runtime flexibility
// ---------------------------------------------------------------------

const runtimeTradeoffs = {
  startup: "requires configuration readiness",
  deploymentConfiguration: "independent from artifact",
};

console.log(runtimeTradeoffs);

// Runtime configuration provides deployment flexibility at the cost of another configuration lifecycle.

// ---------------------------------------------------------------------
// 75. Trade-off: caching
// ---------------------------------------------------------------------

const lifecycleCachingTradeoff = {
  buildArtifacts: "content-hashed and long-lived",
  runtimeConfiguration: "must use an appropriate freshness policy",
};

console.log(lifecycleCachingTradeoff);

// The two lifecycles should not automatically share the same caching strategy.

// ---------------------------------------------------------------------
// 76. Trade-off: failure modes
// ---------------------------------------------------------------------

const lifecycleFailureModes = {
  buildTime: "build can fail before deployment",
  runtime: "application can fail during startup",
};

console.log(lifecycleFailureModes);

// Build-time validation moves failures earlier.
// Runtime configuration introduces the possibility of configuration-loading failures after deployment.

// ---------------------------------------------------------------------
// 77. Production recommendation model
// ---------------------------------------------------------------------

const productionConfigurationModel = {
  buildTime: ["compiler settings", "bundler settings", "minification", "source maps"],
  runtime: ["public API origin", "public asset origin", "deployment-specific public settings"],
  serverOnly: ["database credentials", "private signing keys"],
} as const;

console.log(productionConfigurationModel);

// Separating build-time, client-visible runtime, and server-only configuration
// creates clear lifecycle and security boundaries.

// ---------------------------------------------------------------------
// 78. Integrated configuration model
// ---------------------------------------------------------------------

export const ConfigurationLifecycleView: FC = (): ReactElement => {
  return (
    <section>
      <h2>Configuration lifecycle</h2>

      <h3>Build time</h3>
      <BuildConfigurationView configuration={buildConfiguration} />

      <h3>Runtime</h3>
      <RuntimeConfigurationView configuration={publicRuntimeConfiguration} />
    </section>
  );
};

// The integrated view demonstrates that build-time and runtime configuration
// are separate concerns even when they are used by the same application.

// ---------------------------------------------------------------------
// 79. Complete lifecycle model
// ---------------------------------------------------------------------

export const RuntimeVsBuildTimeOverview: FC = (): ReactElement => {
  return (
    <main>
      <h1>Runtime vs. build-time configuration</h1>

      <p>Build-time configuration affects generated assets. Runtime configuration is resolved after deployment.</p>

      <ConfigurationLifecycleView />
    </main>
  );
};

// The application can combine both lifecycles while keeping their responsibilities distinct.

// ---------------------------------------------------------------------
// 80. Final comparison
// ---------------------------------------------------------------------

const finalComparison = {
  buildTime: {
    when: "during the build",
    affects: "generated artifacts",
    changingMayRequire: "a new build",
  },
  runtime: {
    when: "during application execution",
    affects: "runtime behavior",
    changingMayRequire: "a configuration update",
  },
};

console.log(finalComparison);

export default RuntimeVsBuildTimeOverview;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Build-time configuration is resolved while application assets are being generated.
// - Runtime configuration is resolved after deployment while the application executes.
// - Build-time values can affect compilation, bundling, optimization, asset generation, and code elimination.
// - Runtime values can change independently of the built artifact when the deployment architecture supports runtime loading.
// - A value's lifecycle depends on how it is supplied, not on its variable name.
// - Embedding a configuration value into browser assets makes that value part of the client-visible artifact.
// - Browser-delivered configuration must always be treated as public.
// - Loading a secret at runtime does not make it safe for browser code.
// - Server-only runtime configuration can contain secrets when those values remain on the server.
// - Runtime configuration commonly requires explicit loading, readiness, validation, and failure handling.
// - External runtime configuration must be validated at runtime because TypeScript types do not validate network data.
// - Runtime configuration can be supplied through a JSON resource, initial HTML, server bootstrap, or another deployment-specific mechanism.
// - Build artifacts and runtime configuration can have different caching and deployment lifecycles.
// - The same built artifact can be promoted across environments when deployment-specific values are supplied at runtime.
// - Build-time configuration is appropriate when a value affects generated output.
// - Runtime configuration is appropriate when a value must change independently after deployment.
// - Separating build-time, client-visible runtime, and server-only configuration creates clearer lifecycle and security boundaries.
