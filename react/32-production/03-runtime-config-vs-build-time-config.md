# Runtime Configuration vs. Build-Time Configuration

Build-time configuration is resolved while an application is being built. Runtime configuration is resolved after the application has been deployed.

The distinction matters because it determines when a configuration value becomes fixed, whether changing the value requires a new build, which deployment environments can share the same artifact, and how configuration reaches a browser application.

---

## 1. The fundamental distinction

The simplest distinction is:

```text
Build time
    ↓
source code + build configuration
    ↓
production artifacts
    ↓
deployment
    ↓
application execution
    ↑
Runtime configuration
```

Build-time configuration influences the artifacts that are produced.

Runtime configuration influences an already-deployed application while it executes.

For example:

```text
Build-time:
    minification
    source-map generation
    dead-code elimination
    asset naming

Runtime:
    API base URL
    public application settings
    deployment-specific endpoints
    operational settings
```

---

## 2. Build-time configuration

Build-time configuration is available to the build process.

Conceptually:

```ts
interface BuildConfiguration {
  readonly mode: "development" | "production";
  readonly minify: boolean;
  readonly sourceMaps: boolean;
}

const buildConfiguration: BuildConfiguration = {
  mode: "production",
  minify: true,
  sourceMaps: true,
};
```

The build process can use these values to determine how source code becomes production assets.

```text
source
  ↓
build configuration
  ↓
compiler / bundler / optimizer
  ↓
generated assets
```

Once the assets have been generated, the effects of many build-time settings are already incorporated into those assets.

---

## 3. Runtime configuration

Runtime configuration is resolved after the application has been deployed.

For example:

```json
{
  "apiBaseUrl": "https://example.com/api",
  "assetBaseUrl": "https://example.com/assets"
}
```

A browser application might load this information from a public configuration resource before starting the application.

```text
browser
   ↓
/config.json
   ↓
validate
   ↓
application configuration
   ↓
application
```

The exact mechanism depends on the deployment architecture.

---

## 4. The key question: when is the value resolved?

The most useful way to distinguish the two approaches is to ask:

> At what point does this value become part of the application's behavior?

For build-time configuration:

```text
configuration
     ↓
build
     ↓
artifact contains result
     ↓
deployment
```

For runtime configuration:

```text
build
     ↓
artifact
     ↓
deployment
     ↓
configuration loaded
     ↓
application uses value
```

This difference determines whether a configuration change requires rebuilding the application.

---

## 5. Build-time configuration is embedded into the build

Consider:

```ts
const apiBaseUrl = "https://example.com/api";
```

If the value is replaced during the build:

```text
build for staging
    ↓
https://staging.example.com/api

build for production
    ↓
https://example.com/api
```

the resulting artifacts can contain different values.

Therefore:

```text
staging build ≠ production build
```

The two deployments were produced from different configuration inputs.

---

## 6. Runtime configuration can be changed independently

With runtime configuration:

```text
                    same build
                       │
          ┌────────────┼────────────┐
          ↓            ↓            ↓
       staging      testing     production
          │            │            │
     config.json   config.json   config.json
          │            │            │
          ↓            ↓            ↓
      staging API   test API    production API
```

The same application assets can be deployed to multiple environments.

Only the runtime configuration changes.

This can be useful when an organization wants to build an artifact once and deploy that artifact consistently across environments.

---

## 7. Build once, deploy many times

A runtime configuration architecture can support:

```text
source
  ↓
one production build
  ↓
one artifact
  ↓
┌─────────────┬─────────────┬─────────────┐
↓             ↓             ↓
staging       testing       production
```

Each environment supplies its own runtime configuration.

This separates:

```text
artifact
```

from:

```text
deployment environment
```

The artifact remains identical while the environment-specific public settings differ.

---

## 8. Multiple builds for multiple environments

Build-time configuration can instead produce separate artifacts.

```text
source
  │
  ├── staging configuration
  │        ↓
  │    staging build
  │
  └── production configuration
           ↓
       production build
```

This is not inherently incorrect.

It simply means the environment is part of the build process.

The resulting artifacts are environment-specific.

---

## 9. Comparison

| Property                            | Build-time                               | Runtime          |
| ----------------------------------- | ---------------------------------------- | ---------------- |
| Resolved                            | During build                             | During execution |
| Affects generated artifacts         | Yes                                      | Usually no       |
| Requires rebuild when value changes | Usually                                  | No               |
| Same artifact across environments   | Possible but limited for embedded values | Natural fit      |
| Available to optimizer              | Yes                                      | Usually no       |
| Can influence dead-code elimination | Yes                                      | No               |
| Typical API endpoint configuration  | Possible                                 | Common           |
| Typical minification setting        | Yes                                      | No               |
| Typical source-map generation       | Yes                                      | No               |
| Browser-visible values              | Public                                   | Public           |
| Secrets safe in browser             | No                                       | No               |

The distinction is architectural rather than syntactic.

---

## 10. Build-time configuration can affect code generation

Some build-time values can influence which code is included in the final artifact.

Conceptually:

```ts
const production = true;

if (production) {
  // production behavior
} else {
  // development behavior
}
```

A build system may be able to eliminate unreachable development-only code when the value is known during the build.

This is fundamentally different from runtime configuration.

If the value is only known at runtime:

```ts
if (configuration.production) {
  // behavior
}
```

the build generally cannot assume which branch will execute.

Therefore, runtime configuration usually cannot provide the same compile-time optimization opportunities.

---

## 11. Build-time configuration and dead-code elimination

Consider:

```ts
const enableDebugTools = false;

if (enableDebugTools) {
  initializeDebugTools();
}
```

If the build system can determine that the condition is permanently false during the build, optimization may remove the unreachable branch.

Conceptually:

```text
build-time constant
       ↓
optimization
       ↓
unused branch removed
```

With runtime configuration:

```text
runtime value
      ↓
application starts
      ↓
condition evaluated
```

the branch must generally remain available in the artifact.

---

## 12. Runtime configuration cannot change the artifact

Suppose the built application contains:

```text
application.a1b2c3.js
```

and runtime configuration specifies:

```json
{
  "apiBaseUrl": "https://example.com/api"
}
```

Changing the configuration to:

```json
{
  "apiBaseUrl": "https://another.example/api"
}
```

does not change:

```text
application.a1b2c3.js
```

It changes only the value consumed by the application.

This distinction is central to runtime configuration.

---

## 13. What belongs at build time?

Build-time configuration is appropriate for values that affect how artifacts are produced.

Typical examples include:

```text
production/development build mode
minification
source-map generation
tree shaking
dead-code elimination
asset naming
code splitting
compile-time feature selection
```

These values are properties of the build process.

---

## 14. What belongs at runtime?

Runtime configuration is appropriate for values that need to describe the environment in which an already-built application is executing.

Typical examples include:

```text
API base URL
public asset origin
public application name
deployment-specific public settings
runtime logging level
public monitoring endpoint
deployment metadata
```

Not every application needs all of these at runtime.

The correct choice depends on the deployment architecture.

---

## 15. Values that are naturally build-time

Some values directly determine generated output.

For example:

```text
source maps enabled
minification enabled
development diagnostics included
bundle optimization enabled
```

Changing such a value generally requires another build because the generated files themselves need to change.

```text
configuration
     ↓
build
     ↓
different artifacts
```

---

## 16. Values that are naturally runtime

Other values describe the environment rather than the generated code.

For example:

```text
API endpoint
asset origin
deployment identifier
public environment name
```

These can potentially be loaded at runtime:

```text
same application assets
        +
different runtime configuration
        ↓
different deployment behavior
```

This is particularly useful for static frontend deployments.

---

## 17. Browser applications have an important limitation

A browser application cannot keep a configuration value secret if it needs that value itself.

For example:

```json
{
  "apiBaseUrl": "https://example.com/api"
}
```

is public configuration.

A browser user can inspect the network request that retrieves it.

Therefore:

```text
runtime configuration
        ≠
secret configuration
```

Runtime configuration solves a timing and deployment problem, not a secrecy problem.

---

## 18. Runtime configuration is not a secret store

This is unsafe:

```json
{
  "apiBaseUrl": "https://example.com/api",
  "privateApiKey": "actual-secret"
}
```

If the browser can load the file, the private key is exposed.

The correct architecture is:

```text
browser
   ↓
public configuration

server
   ↓
private configuration
   ↓
secret store
```

Public browser configuration and server-side secrets must remain separate.

---

## 19. Environment variables do not determine the architecture

An environment variable can participate in either build-time or server-side runtime configuration.

For example:

```text
API_BASE_URL=...
```

could be consumed:

```text
during build
```

or:

```text
by a server that generates runtime configuration
```

The variable's name does not determine when it is resolved.

The consuming system determines its lifecycle.

---

## 20. Build-time environment variables

A build system can read environment variables:

```text
API_BASE_URL=https://example.com/api
```

and substitute the value into generated client assets.

Conceptually:

```text
environment variable
        ↓
build system
        ↓
bundle
        ↓
browser
```

At that point, the value is part of the browser-delivered application and is therefore public.

---

## 21. Runtime environment variables

A server can instead read an environment variable at runtime:

```text
API_BASE_URL=https://example.com/api
```

and expose only the appropriate public value to the browser.

Conceptually:

```text
server environment
        ↓
runtime configuration
        ↓
browser
```

This allows the same static application assets to use different public configuration values in different deployments.

---

## 22. Static runtime configuration

A common pattern is a generated public configuration file:

```text
/config.json
```

The deployment process can generate:

```json
{
  "apiBaseUrl": "https://example.com/api"
}
```

without rebuilding the application bundle.

The flow becomes:

```text
application build
        ↓
static assets

deployment
        ↓
generate /config.json

browser
        ↓
load assets + /config.json
```

This separates artifact generation from environment-specific public configuration.

---

## 23. Runtime configuration through HTML

Another possible architecture is to inject configuration into the HTML document.

Conceptually:

```html
<script>
  window.__APP_CONFIG__ = {
    apiBaseUrl: "https://example.com/api",
  };
</script>
```

The JavaScript application can read the value after the document has loaded.

The important property is still the same:

```text
configuration is supplied after the build
```

The exact injection mechanism is an architectural choice.

---

## 24. Runtime configuration through an endpoint

Configuration can also come from an HTTP endpoint:

```text
GET /config
```

The response might contain:

```json
{
  "apiBaseUrl": "https://example.com/api"
}
```

The application then validates the response before using it.

```text
request
  ↓
configuration response
  ↓
parse
  ↓
validate
  ↓
application
```

This allows configuration to be managed independently from the application assets.

---

## 25. Configuration loading must happen before dependent code

If an application requires runtime configuration before initialization, it needs an explicit startup sequence.

```text
application starts
       ↓
load configuration
       ↓
validate configuration
       ↓
initialize services
       ↓
render application
```

Without this ordering, application code may attempt to use configuration before it exists.

---

## 26. Configuration loading failure

Runtime configuration introduces another failure mode.

The configuration resource might:

- be unavailable
- return invalid JSON
- contain an invalid URL
- contain an unsupported schema version
- be missing a required value

Therefore, runtime configuration needs an intentional failure path.

```text
load
  ↓
 ┌─────────────┐
 ↓             ↓
valid         invalid
 ↓             ↓
start         fail
```

The application should not silently substitute an unsafe production default.

---

## 27. Runtime configuration validation

Runtime configuration should initially be treated as unknown data.

```ts
const parseConfiguration = (value: unknown): ApplicationConfiguration => {
  if (typeof value !== "object" || value === null) {
    throw new Error("Configuration must be an object.");
  }

  const candidate = value as Record<string, unknown>;

  if (typeof candidate.apiBaseUrl !== "string" || candidate.apiBaseUrl.length === 0) {
    throw new Error("API base URL is required.");
  }

  if (typeof candidate.assetBaseUrl !== "string" || candidate.assetBaseUrl.length === 0) {
    throw new Error("Asset base URL is required.");
  }

  return {
    apiBaseUrl: candidate.apiBaseUrl,
    assetBaseUrl: candidate.assetBaseUrl,
  };
};
```

The important point is that TypeScript types do not validate the data received at runtime.

---

## 28. Caching runtime configuration

Runtime configuration introduces caching considerations.

Suppose:

```text
/config.json
```

is cached aggressively.

A deployment changes:

```text
API_BASE_URL
```

but users continue receiving the old configuration from a cache.

The application may therefore use stale configuration even though the deployment has already changed.

Runtime configuration needs an appropriate caching strategy.

---

## 29. Runtime configuration and cache headers

A runtime configuration resource often needs different caching behavior from hashed static assets.

For example:

```text
application.a1b2c3.js
    ↓
long-lived cache

/config.json
    ↓
short-lived or revalidated cache
```

The appropriate policy depends on how frequently configuration changes and how quickly those changes need to propagate.

---

## 30. Runtime configuration and immutable assets

Runtime configuration works particularly well with content-hashed assets.

```text
application.a1b2c3.js
application.7d8e9f.css
/config.json
```

The static assets can be cached for long periods because their URLs change when their content changes.

The configuration resource can use a shorter caching policy because it represents deployment-specific state.

---

## 31. Build-time feature selection

Some feature decisions are intentionally made at build time.

For example:

```text
build configuration
    ↓
feature included
    ↓
feature code bundled
```

This can allow unused feature code to be removed during optimization.

Build-time feature selection is therefore useful when the feature set is known before deployment.

---

## 32. Runtime feature flags

Runtime feature flags are different.

```text
application
    ↓
load feature configuration
    ↓
feature enabled?
    ↓
yes / no
```

The code for both possibilities generally needs to exist in the artifact.

Runtime flags are therefore useful when feature availability needs to change without rebuilding.

They trade some build-time optimization opportunities for deployment-time flexibility.

---

## 33. The same feature can involve both phases

A feature can use both build-time and runtime configuration.

For example:

```text
Build time
    ↓
include search implementation

Runtime
    ↓
enable or disable new search
```

The build determines whether code exists in the artifact.

Runtime configuration determines whether that existing code is active.

These are separate decisions.

---

## 34. Deployment consistency

Build-time configuration can create multiple artifacts:

```text
staging artifact
production artifact
```

Runtime configuration can instead allow:

```text
one artifact
    ↓
different environments
```

This distinction matters for deployment consistency.

If the exact same artifact is promoted between environments, runtime configuration can keep environment-specific values outside the artifact itself.

---

## 35. Artifact promotion

An artifact-promotion workflow can look like:

```text
source
  ↓
build
  ↓
artifact
  ↓
test
  ↓
staging
  ↓
production
```

The artifact remains unchanged as it moves between environments.

Runtime configuration supplies environment-specific values.

This creates a clear separation between:

```text
what was built
```

and:

```text
where it is running
```

---

## 36. Multiple environment builds

An alternative workflow is:

```text
source
  ├── staging configuration → staging artifact
  └── production configuration → production artifact
```

This can be appropriate when the environments genuinely require different generated code.

The important consequence is that the artifacts are no longer identical.

The deployment process must therefore verify that each artifact was built from the intended source and configuration.

---

## 37. Reproducibility

Build-time configuration affects reproducibility.

If:

```text
source + dependencies + build configuration
```

are identical, a deterministic build should produce equivalent artifacts.

Changing build-time configuration intentionally produces different artifacts.

Runtime configuration does not need to affect artifact generation:

```text
source + dependencies + build configuration
        ↓
same artifact
        ↓
different runtime configurations
```

This separation can simplify artifact promotion.

---

## 38. Configuration precedence

A system may combine multiple sources:

```text
defaults
   ↓
build configuration
   ↓
deployment configuration
   ↓
runtime configuration
```

However, this should not be assumed automatically.

The application architecture must define:

- which sources exist
- which source wins
- when each source is evaluated
- which values can be overridden
- which values are required

Ambiguous precedence produces difficult-to-debug deployments.

---

## 39. Do not mix timing accidentally

A common mistake is assuming that all configuration belongs to one phase.

For example:

```text
minification
```

is naturally a build concern.

An API endpoint may instead be a runtime concern.

Trying to resolve everything during the build can produce environment-specific artifacts unnecessarily.

Trying to resolve everything at runtime can prevent build-time optimization.

The correct phase depends on what the value controls.

---

## 40. A practical decision process

For each configuration value, ask:

```text
1. Does it affect generated code or assets?
       ↓
     build time

2. Does it need to vary after the artifact is built?
       ↓
     runtime

3. Does the browser need the value?
       ↓
     public

4. Does only the server need the value?
       ↓
     server-side

5. Is the value sensitive?
       ↓
     secret-management system
```

These questions separate four concerns that are often incorrectly combined:

```text
timing
visibility
execution environment
sensitivity
```

---

## 41. Example classification

Consider these settings:

| Configuration         | Phase                 | Visibility         | Reason                    |
| --------------------- | --------------------- | ------------------ | ------------------------- |
| Minification          | Build time            | Build-only         | Changes generated assets  |
| Source-map generation | Build time            | Build-only         | Changes build output      |
| API base URL          | Runtime or build time | Public             | Browser needs it          |
| Asset origin          | Runtime or build time | Public             | Browser needs it          |
| Database password     | Server runtime        | Secret             | Server-only credential    |
| Signing key           | Server runtime        | Secret             | Must not reach browser    |
| Logging level         | Runtime               | Operational/public | Controls runtime behavior |
| Release identifier    | Build/runtime         | Public metadata    | Identifies deployment     |
| Runtime feature flag  | Runtime               | Public             | Controls existing code    |
| Dead-code elimination | Build time            | Build-only         | Requires build knowledge  |

The correct phase depends on the desired lifecycle of the setting.

---

## 42. Build-time configuration is appropriate when

Build-time configuration is generally appropriate when:

- the value affects generated artifacts
- the value affects optimization
- the value determines which code is included
- the value determines asset naming
- the value controls source-map generation
- the value is fixed for the artifact's lifetime
- changing the value should require a rebuild

The defining characteristic is that the value participates in producing the artifact.

---

## 43. Runtime configuration is appropriate when

Runtime configuration is generally appropriate when:

- the value varies between deployments
- the same artifact should run in multiple environments
- changing the value should not require rebuilding
- the value describes the deployment environment
- the value is public and safe for browser delivery
- the application needs to obtain the value after deployment

The defining characteristic is that the value belongs to the deployed environment rather than the generated artifact.

---

## 44. What runtime configuration does not solve

Runtime configuration does not solve:

```text
secret storage
```

It also does not automatically solve:

```text
authentication
authorization
```

and it does not make a public API endpoint private.

Its purpose is to separate:

```text
artifact generation
```

from:

```text
deployment-specific public configuration
```

---

## 45. Recommended conceptual architecture

A clean browser deployment can be modeled as:

```text
                    source
                      │
                      ↓
              build-time configuration
                      │
                      ↓
                   build
                      │
                      ↓
             immutable application
                  artifacts
                      │
             ┌────────┴────────┐
             ↓                 ↓
          staging          production
             │                 │
      runtime config     runtime config
             │                 │
             └────────┬────────┘
                      ↓
                  browser
```

The artifact describes what was built.

Runtime configuration describes where and how that artifact is operating.

---

## 46. Build-time and runtime can coexist

The two approaches are not mutually exclusive.

A production application can use:

```text
Build time
├── production optimization
├── minification
├── source maps
├── asset hashing
└── code generation

Runtime
├── API endpoint
├── asset origin
├── public deployment settings
├── logging level
└── feature availability
```

This is often the most useful model because each phase handles values appropriate to its lifecycle.

---

## 47. Final comparison

The distinction can be reduced to one question:

```text
Does changing this value require changing the generated artifact?
```

If yes, the value is generally a build-time concern.

If no, and the value needs to vary according to the deployment environment, it may be a runtime configuration concern.

Then apply the security question separately:

```text
Does browser code need this value?
```

If yes, treat it as public.

If no, and it is sensitive, keep it server-side or in a secret-management system.

The resulting model is:

```text
                    Configuration
                         │
             ┌───────────┴───────────┐
             ↓                       ↓
        Build time                Runtime
             │                       │
       affects artifact       affects execution
             │                       │
             └───────────┬───────────┘
                         ↓
                    Visibility
                         │
                  ┌──────┴──────┐
                  ↓             ↓
                Public        Secret
                  │             │
              browser       server only
```

---

## Summary

- Build-time configuration is resolved while the application is being built.
- Runtime configuration is resolved after the application has been deployed.
- Build-time configuration can directly affect generated artifacts.
- Runtime configuration changes application behavior without necessarily changing the generated artifacts.
- Changing a build-time value generally requires another build.
- Runtime configuration can allow the same artifact to run with different environment-specific public settings.
- Build-time values can participate in optimization such as dead-code elimination.
- Runtime values generally cannot provide the same compile-time optimization opportunities.
- Browser-delivered runtime configuration is public.
- Runtime configuration is not a mechanism for storing secrets.
- Environment variables can participate in either build-time or runtime configuration depending on what consumes them.
- Static configuration files, HTML injection, and configuration endpoints are possible runtime-configuration mechanisms.
- Runtime configuration requires explicit loading, validation, failure handling, and appropriate caching.
- Build-time feature selection and runtime feature flags solve different lifecycle problems.
- Build-time and runtime configuration can coexist in the same application.
- Artifact promotion can use runtime configuration to keep the built artifact identical across environments.
- Configuration precedence must be explicit when multiple sources are combined.
- The key architectural question is whether changing a configuration value should require changing the generated artifact.
