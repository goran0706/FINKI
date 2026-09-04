# Code Splitting

Code splitting is a build and deployment technique that divides an application's JavaScript into multiple independently
loadable chunks instead of delivering all executable code as one initial artifact. The goal is to ensure that the
runtime downloads, parses, compiles, and executes only the code required for the current application state, while
additional code can be loaded when it becomes necessary.

Code splitting is primarily a deployment optimization. It does not change the application's conceptual module
architecture by itself. A build tool analyzes the module graph and determines which portions can be emitted as separate
artifacts while preserving the runtime semantics of module loading and execution.

## Purpose

The primary purpose of code splitting is to reduce the amount of JavaScript required during an initial load.

A large application may contain functionality that a user does not need immediately:

```js
import {createDashboard} from "./dashboard.js";
import {createEditor} from "./editor.js";
import {createAdminPanel} from "./admin.js";
```

If all of these modules are included in the initial artifact, users must download and process code for functionality
they may never use.

Code splitting can instead allow the application to load the editor or administrative functionality only when the
corresponding feature is needed.

## Static Imports

Static imports establish dependencies that are known when the module is analyzed.

```js
import {createDashboard} from "./dashboard.js";
```

The imported module is part of the module's static dependency graph.

A build tool will normally include such dependencies in the same initial dependency set unless its chunking strategy
determines that the dependency can be shared or otherwise separated.

Static imports therefore provide strong dependency information but do not themselves imply a separate network request.

## Dynamic Imports

Dynamic `import()` is the primary JavaScript mechanism associated with code splitting.

```js
const module = await import("./editor.js");
```

Unlike a static import declaration, the dynamic import represents asynchronous module loading.

A bundler can use this boundary to emit `editor.js` or an equivalent generated chunk separately from the initial
application artifact.

The runtime loads the module when the expression is evaluated.

## Dynamic Import Semantics

Dynamic import returns a promise:

```js
const modulePromise = import("./editor.js");

modulePromise.then(module => {
    module.start();
});
```

The imported module is asynchronously loaded and evaluated according to ECMAScript module semantics.

The exact network behavior is environment-dependent. A browser may issue a network request for a generated chunk, while
another runtime may load the module from a filesystem, cache, package store, or other module source.

Code splitting is therefore a build strategy built around an asynchronous loading capability, not a requirement that
every dynamic import correspond to one physical network request.

## Chunk

A chunk is a generated deployment artifact containing code selected by the build system for a particular loading
boundary.

For example, a build might emit:

```text
app.js
editor.js
admin.js
```

The source modules do not necessarily map one-to-one onto these files.

A chunk can contain code from multiple source modules, and a source module can contribute code to a chunk according to
the bundler's optimization strategy.

The chunk is therefore a deployment concept rather than a JavaScript language construct.

## Entry Chunks

An entry chunk contains code required to begin executing an application entry point.

A build may have one entry point:

```js
import {startApplication} from "./application.js";

startApplication();
```

or several independent entry points for different applications, pages, workers, or runtime contexts.

Code splitting can operate within and around these entry points according to the dependency graph.

## Split Points

A split point is a location in the dependency graph where the build system can separate code into independently loadable
output.

Dynamic import is the most common explicit split point:

```js
async function openEditor() {
    const {createEditor} = await import("./editor.js");

    return createEditor();
}
```

The asynchronous boundary gives the bundler a clear indication that the editor implementation does not need to be part
of the initial synchronous dependency set.

## Lazy Loading

Code splitting and lazy loading are closely related but not identical.

Code splitting creates separate artifacts or loading boundaries.

Lazy loading delays loading one of those artifacts until it is needed.

An application can therefore split code without necessarily loading every split chunk lazily, and it can use lazy
loading for resources other than JavaScript.

The combination is particularly useful for features that are rarely used or expensive to initialize.

## Route-Based Splitting

Applications with multiple routes commonly split code according to navigation boundaries.

```js
async function loadSettingsPage() {
    return import("./pages/settings.js");
}
```

The settings implementation does not need to be included in the initial JavaScript required for unrelated pages.

Route-based splitting is effective because navigation already provides a natural asynchronous boundary.

## Feature-Based Splitting

Code can also be split around optional application features.

```js
async function openReporting() {
    const {createReporting} = await import("./reporting.js");

    return createReporting();
}
```

Reporting functionality can remain outside the initial artifact until the user actually requests it.

This is particularly useful for large applications with optional functionality that is used by only a subset of users.

## Component-Based Splitting

User-interface applications can split expensive components or feature areas.

```js
async function loadChart() {
    const {Chart} = await import("./chart.js");

    return new Chart();
}
```

The chart implementation can be loaded only when the component becomes relevant.

The effectiveness of this technique depends on whether the component is sufficiently large or sufficiently infrequently
used to justify the additional loading boundary.

## Library-Based Splitting

Large libraries can sometimes be isolated into separate chunks.

For example:

```js
async function exportDocument(document) {
    const {createPdf} = await import("./pdf.js");

    return createPdf(document);
}
```

A PDF generation implementation may be unnecessary for users who never export documents.

Splitting it out avoids making every user pay the initial cost.

## Vendor Code

Applications sometimes separate third-party dependencies from application code.

For example, a build system may produce chunks containing:

```text
application code
third-party dependencies
```

However, treating all dependencies as one permanent vendor chunk is not automatically optimal.

A dependency used by only one feature may be better placed with that feature, while a stable dependency shared by many
entry points can benefit from a reusable chunk.

Chunking should therefore follow dependency and caching characteristics rather than a simplistic
application-versus-vendor distinction.

## Shared Dependencies

Two dynamically loaded features may depend on the same module.

```js
async function openEditor() {
    return import("./editor.js");
}

async function openPreview() {
    return import("./preview.js");
}
```

If both features depend on a large shared library, a bundler can potentially emit that library as a shared chunk rather
than duplicating it.

Shared chunks reduce duplicate downloads but introduce additional loading dependencies.

The optimal structure depends on how frequently the features are used and how caching behaves.

## Chunk Duplication

Aggressive splitting can duplicate code.

If two chunks independently contain the same dependency, users may download the same code more than once.

A build tool can attempt to extract shared dependencies, but excessive sharing can itself create additional requests and
dependency chains.

Code splitting therefore involves a trade-off between duplication and additional loading boundaries.

## Chunk Granularity

Very coarse chunks reduce the number of requests but include more unused code.

Very fine-grained chunks reduce the amount of code associated with each feature but can increase request overhead,
scheduling complexity, dependency chains, and cache fragmentation.

The appropriate granularity depends on:

* application size;
* network characteristics;
* runtime startup cost;
* feature usage patterns;
* caching;
* dependency overlap;
* deployment architecture.

There is no universally optimal chunk size.

## Initial JavaScript

The initial JavaScript set should contain the code required to render and operate the initial application state.

It should not necessarily contain every feature available in the application.

For a large browser application, reducing initial JavaScript can improve startup by reducing transfer, parsing,
compilation, and execution work.

However, aggressively removing code from the initial set can increase latency when the user immediately requires a
deferred feature.

## Runtime Loading Cost

A deferred chunk still has a cost.

When a user requests a feature, the runtime may need to:

* discover the chunk;
* retrieve it;
* decode it;
* parse it;
* compile it;
* evaluate its modules;
* initialize the feature.

Code splitting therefore shifts some work from startup to feature activation rather than eliminating it.

## Startup Versus Interaction Latency

Code splitting creates a trade-off between startup latency and later interaction latency.

Without splitting, the application may pay a large upfront cost but have feature code immediately available.

With aggressive splitting, startup can become faster while activating an unloaded feature can become slower.

The correct architecture depends on which latency is important for the application.

## Prefetching

An application can load a split chunk before the user explicitly requires it.

```js
const editorPromise = import("./editor.js");
```

The application can initiate loading based on predicted user behavior.

Prefetching attempts to preserve much of the startup benefit of code splitting while reducing the latency of a later
feature activation.

The exact scheduling mechanism depends on the runtime and deployment environment.

## Preloading

Preloading prioritizes resources that are expected to be required soon.

The distinction between preloading and prefetching is primarily about expected urgency and resource priority.

A split chunk can therefore remain outside the initial JavaScript execution set while still being fetched before it is
needed.

This is useful when the application can predict the next likely feature.

## Conditional Loading

Code splitting is particularly useful when loading depends on runtime conditions.

```js
if (user.isAdministrator) {
    const {createAdminPanel} = await import("./admin.js");

    createAdminPanel();
}
```

The administrator functionality does not need to be loaded for users who cannot access it.

This is a performance optimization, not a security boundary. Server-side authorization must still enforce access
control.

## Capability-Based Loading

Feature loading can be based on capabilities:

```js
if (capabilities.canExport) {
    const {exportDocument} = await import("./export.js");

    await exportDocument(document);
}
```

This can reduce unnecessary client-side code for users who cannot use a feature.

Again, the capability check must not be treated as authorization. The server or authoritative subsystem must enforce
security-sensitive permissions.

## Error Handling

Dynamic imports can fail.

```js
try {
    const module = await import("./editor.js");

    module.open();
} catch (error) {
    reportLoadingFailure(error);
}
```

Failures can result from network problems, unavailable artifacts, incompatible deployments, cache inconsistencies, or
runtime errors during module evaluation.

Code-split features therefore require explicit failure handling when their availability matters to the user experience.

## Retry

Applications may retry failed dynamic loads when the failure is plausibly transient.

```js
async function loadEditor() {
    for (let attempt = 0; attempt < 3; attempt++) {
        try {
            return await import("./editor.js");
        } catch (error) {
            if (attempt === 2) {
                throw error;
            }
        }
    }
}
```

Retries should be bounded and should distinguish transient loading failures from deterministic evaluation or
compatibility failures.

Repeatedly retrying a broken deployment does not solve the underlying problem.

## Timeouts

Dynamic imports do not inherently provide an application-level timeout abstraction.

If a feature must fail after a bounded period, the application can race the loading operation against a timeout:

```js
async function loadWithTimeout(loader, timeout) {
    return Promise.race([
        loader(),
        new Promise((_, reject) => {
            setTimeout(() => {
                reject(new Error("Module load timed out"));
            }, timeout);
        })
    ]);
}
```

A timeout does not necessarily cancel the underlying network operation. It only changes when the application stops
waiting for the promise.

Cancellation and resource cleanup must therefore be considered separately.

## Cancellation

The ECMAScript dynamic `import()` operation does not expose an `AbortSignal` parameter.

Applications can stop waiting for a module and prevent subsequent feature activation, but that does not necessarily
cancel the underlying module fetch.

This distinction matters for applications with expensive or frequently abandoned feature loads.

## Module Evaluation

Loading a split module involves more than transferring bytes.

The module must be evaluated according to ECMAScript module semantics.

```js
// editor.js
initializeEditor();

export function open() {
    // ...
}
```

Importing the module causes its module-level initialization to occur.

Code splitting therefore changes when module evaluation occurs, which can change initialization timing.

## Side Effects

Side-effectful modules require careful treatment.

```js
console.log("editor module initialized");

export function open() {
}
```

When the module becomes dynamically imported, its top-level code executes at that time.

Moving such a module behind a split point therefore moves the timing of its side effects.

Code splitting should preserve required semantics while recognizing that asynchronous loading intentionally changes when
deferred code becomes available.

## Module State

ES modules are evaluated once per relevant module identity within their execution environment.

```js
// state.js
export const state = {
    value: 0
};
```

If multiple split chunks depend on the same module, the runtime's module loading and module identity semantics determine
how that shared module is instantiated.

Bundlers must preserve these semantics when transforming the module graph.

## Chunk Identity

Generated chunk names and URLs are build artifacts rather than application-level module identities.

A source module:

```js
import "./state.js";
```

may end up in a generated chunk with an unrelated filename.

Applications should generally depend on module semantics rather than hard-coded generated chunk names.

## Content Hashing

Generated chunks commonly use content hashes:

```text
app.4f82c1.js
editor.81a93d.js
```

When the content changes, the hash changes.

This allows long-lived caching of immutable artifacts while ensuring that updated code receives a new URL.

Content hashing is especially valuable for code-split applications because many chunks can remain cached across
deployments.

## Cacheability

Code splitting can improve caching by isolating rarely changing functionality from frequently changing application code.

If a large library changes infrequently, a stable shared chunk can remain cached while application-specific chunks
change.

Poor chunk boundaries can have the opposite effect by causing widely shared chunks to change whenever a small
application dependency changes.

Caching strategy should therefore be considered when designing split boundaries.

## Deployment Atomicity

Code splitting introduces multiple artifacts that must remain mutually compatible.

Consider an application where the initial chunk references:

```text
editor.81a93d.js
```

If the server deploys the new application chunk before the corresponding editor chunk, users can receive a broken
dependency.

Likewise, aggressive cache behavior can cause an old entry chunk to request a chunk that no longer exists.

Deployments should therefore treat related chunks as a coherent artifact set and preserve compatibility during rollout.

## Version Skew

Users can keep an older application in memory while the server deploys a new version.

A later dynamic import may then request a chunk associated with the old application version.

This creates a version-skew problem.

Common mitigations include immutable hashed assets, retaining old assets for a suitable period, atomic deployment
strategies, service-worker coordination, and explicit application version handling.

## Service Workers

Service workers can cache split chunks independently.

```js
self.addEventListener("fetch", event => {
    // Cache strategy omitted.
});
```

A service worker can therefore affect whether a dynamically imported module is served from the network or local cache.

Cache invalidation becomes particularly important because an outdated service worker can combine with new application
artifacts and produce incompatible chunk sets.

## HTTP Caching

Code splitting interacts directly with browser caching.

A chunk that remains unchanged can often be reused across application sessions without being downloaded again.

This means the initial download cost and repeat-visit cost can differ significantly.

Chunking decisions should therefore consider both first-load performance and long-term cache reuse.

## Network Requests

Each independently loadable chunk can introduce additional resource loading work.

Modern browsers can issue requests concurrently, but requests still have overhead involving connection scheduling,
prioritization, headers, caching, parsing, and dependency coordination.

Reducing chunk size indefinitely is therefore not necessarily beneficial.

## Dependency Chains

A poorly designed split can create sequential loading dependencies.

For example, one feature may require a chunk that requires another chunk before execution can continue.

This can increase interaction latency even when the total transferred bytes are small.

Chunk design should therefore minimize unnecessary serial dependency chains.

## Parallel Loading

Independent chunks can potentially be loaded in parallel.

```js
const editorPromise = import("./editor.js");
const previewPromise = import("./preview.js");

const [editor, preview] = await Promise.all([
    editorPromise,
    previewPromise
]);
```

This can reduce total waiting time when both features are needed.

However, loading multiple chunks in parallel can also increase bandwidth contention and compete with more important
resources.

Parallelism should therefore reflect actual loading priorities.

## Conditional Parallel Loading

An application can begin loading several optional modules when their future use is sufficiently likely.

```js
const editor = import("./editor.js");
const collaboration = import("./collaboration.js");

await Promise.all([editor, collaboration]);
```

This is useful when both features are required for an upcoming workflow.

It is counterproductive when the features are unlikely to be used because the application has effectively recreated a
large initial download.

## Route Transitions

Route transitions provide natural opportunities for asynchronous loading.

```js
async function navigateToSettings() {
    const {renderSettings} = await import("./settings-page.js");

    renderSettings();
}
```

The route handler can begin loading the next page while preserving a smaller initial bundle.

Framework routers frequently build higher-level abstractions around this mechanism.

## Server-Side Rendering

Server-side rendering changes the role of code splitting.

A server may need to know which client-side chunks correspond to the rendered page so that the browser can preload or
otherwise discover them efficiently.

The server and client build artifacts therefore need coordinated metadata.

The exact implementation depends on the rendering framework and bundler.

## Hydration

Applications using server-rendered HTML may defer hydration code for portions of the interface.

```js
const {hydrateEditor} = await import("./editor-hydration.js");

hydrateEditor();
```

This can reduce initial client-side JavaScript while keeping server-rendered content immediately visible.

The trade-off is that deferred functionality may not become interactive until its code loads.

## Islands and Partial Hydration

Architectures that isolate interactive regions can naturally align code loading with those regions.

A page can render static content without loading JavaScript for every possible interactive component.

When an interactive region becomes active, its corresponding code can be loaded.

The architectural principle is to align executable code with actual interactivity rather than shipping a uniform client
runtime for every page element.

## Workers

Workers can also participate in code splitting.

```js
const worker = new Worker("./worker.js");
```

A worker's code is separately loaded and executed in its own environment.

Applications can dynamically select different worker implementations depending on the operation:

```js
const workerModule = await import("./worker-factory.js");
```

The exact loading behavior depends on the worker architecture and runtime.

## Node.js

Code splitting is less about browser network transfer in server-side Node.js applications, but dynamic loading can still
provide useful startup and memory characteristics.

```js
const module = await import("./heavy-feature.js");
```

A server may defer loading an expensive feature until a request actually requires it.

The trade-off shifts from network transfer toward startup time, memory, initialization cost, and request latency.

## Serverless Functions

Serverless applications can use code splitting or separate entry points to avoid placing unrelated functionality into
every deployed function.

This can reduce package size and initialization work.

However, the appropriate optimization is often to produce independently deployable function artifacts rather than
creating many runtime dynamic imports inside one function.

The deployment model should determine the boundary.

## Dynamic Import and Feature Flags

Feature flags can control whether optional code is loaded.

```js
if (featureFlags.newEditor) {
    const {createEditor} = await import("./new-editor.js");

    createEditor();
}
```

This can prevent disabled functionality from being loaded.

However, if a feature is permanently disabled in a particular deployment, build-time configuration can provide stronger
optimization because tree shaking may remove the feature entirely.

## Build-Time Versus Runtime Decisions

Build-time decisions are more statically analyzable.

```js
import {createEditor} from "./editor.js";
```

Runtime decisions are more flexible:

```js
const module = await import(featureModule);
```

The trade-off is that dynamic decisions can make the dependency graph less predictable.

Use build-time selection when the deployment configuration is known in advance. Use runtime loading when actual runtime
conditions determine which functionality is required.

## Dynamic Import Expressions

Some build tools can analyze constrained dynamic import expressions:

```js
await import(`./locales/${locale}.js`);
```

If the possible values of `locale` correspond to a known finite set, the bundler can generate the appropriate artifacts.

Completely arbitrary expressions:

```js
await import(moduleName);
```

may prevent the build tool from determining the complete set of possible dependencies.

The exact behavior is bundler-specific.

## Localization

Localization is a common code-splitting use case.

```js
const messages = await import(`./locales/${locale}.js`);
```

An application may load only the language data required for the current user.

Because localization data can be substantial across many languages, splitting it prevents every deployment from carrying
every locale in the initial artifact.

## Optional Dependencies

Optional functionality can be loaded dynamically:

```js
async function enableMarkdown() {
    const {parse} = await import("./markdown-parser.js");

    return parse;
}
```

This is useful when only a subset of users require the capability.

It also allows the main application to remain independent of functionality that is not always needed.

## Error Boundaries

A dynamically loaded feature can fail independently from the rest of the application.

```js
async function openReports() {
    try {
        const {createReports} = await import("./reports.js");

        return createReports();
    } catch (error) {
        showFeatureUnavailable(error);
    }
}
```

This can be used to degrade optional features without taking down unrelated functionality.

The error handling strategy should distinguish loading failure from errors thrown while evaluating or executing the
imported module.

## Observability

Code splitting introduces operational events worth measuring.

Useful metrics can include:

* chunk load duration;
* chunk failure rate;
* chunk cache hit rate;
* feature activation latency;
* initial JavaScript size;
* total JavaScript loaded per session;
* duplicate bytes;
* parse and compilation time;
* feature abandonment before load completion.

Observability allows chunk boundaries to be evaluated against real user behavior rather than theoretical bundle-size
targets.

## Performance Measurement

Code splitting should be evaluated using actual application performance.

Relevant measurements include:

* initial page load;
* time to first render;
* time to interactive behavior;
* feature activation latency;
* JavaScript execution time;
* network transfer;
* cache reuse;
* memory consumption.

A split that reduces the initial bundle by a large amount but causes a frequently used feature to load slowly may be a
poor optimization.

## Over-Splitting

Over-splitting creates too many small chunks.

Potential consequences include:

* increased request overhead;
* more complex dependency relationships;
* additional runtime bookkeeping;
* worse cache behavior;
* increased loading latency;
* harder debugging;
* more complicated deployment management.

Code should not be split merely because a module can technically be separated.

## Under-Splitting

Under-splitting leaves too much code in the initial artifact.

Potential consequences include:

* larger initial transfer;
* longer parsing;
* longer compilation;
* higher startup CPU cost;
* increased memory usage;
* slower initial interaction.

The appropriate boundary is determined by actual usage and performance characteristics.

## Code Splitting and Tree Shaking

Tree shaking and code splitting solve different problems.

Tree shaking removes code that is not reachable.

Code splitting separates retained code into independently loadable artifacts.

A feature can therefore be tree-shaken internally while still being emitted as a separate chunk.

The two techniques are complementary.

## Code Splitting and Minification

Minification reduces the representation of each generated artifact.

Code splitting determines how the artifacts are divided.

A production build can therefore produce several minified chunks:

```text
app.min.js
editor.min.js
reports.min.js
```

Minification reduces the size of each chunk, while code splitting determines when those chunks need to be loaded.

## Code Splitting and Bundling

Bundling and code splitting are not opposites.

A bundler can combine many source modules into one chunk and simultaneously emit multiple chunks for different loading
boundaries.

The result is a set of deployment artifacts produced from one module graph.

## Code Splitting and Lazy Initialization

Lazy initialization defers creation or initialization of a value until it is needed.

Code splitting defers loading of code.

They can be combined:

```js
async function getEditor() {
    const {Editor} = await import("./editor.js");

    return new Editor();
}
```

The module is loaded lazily, and the editor instance is also created only when requested.

These are separate optimizations and should not be conflated.

## Code Splitting and Object Pools

Object pooling concerns runtime reuse of already-created objects.

Code splitting concerns when executable code is loaded.

The two can coexist, but they address different resource problems.

Loading fewer modules does not eliminate the need to manage runtime objects, and object pooling does not reduce the
amount of JavaScript that must be downloaded.

## Code Splitting and Dependency Injection

Dependency injection determines how implementations are supplied.

Code splitting determines when implementation code becomes available.

They can be combined:

```js
async function createRepository() {
    const {SqlRepository} = await import("./sql-repository.js");

    return new SqlRepository();
}
```

This allows an implementation to be loaded only when selected.

However, runtime dependency resolution can make the module graph less statically analyzable, potentially reducing
optimization opportunities.

## Code Splitting and Plugin Systems

Plugin systems are natural candidates for dynamic loading.

```js
async function loadPlugin(name) {
    return import(`./plugins/${name}.js`);
}
```

Plugins can remain outside the core application until needed.

The trade-off is that dynamic plugin discovery can make the complete dependency graph harder to analyze and can require
explicit handling of compatibility, versioning, security, and failure.

## Security

Code splitting is not an access-control mechanism.

A chunk that is not initially loaded is not inherently protected.

If a user can determine the URL of a chunk and retrieve it, the code should be considered public.

Sensitive operations must therefore be protected through server-side authorization and appropriate trust boundaries.

Code splitting can reduce unnecessary exposure of client functionality in ordinary usage, but that should not be
confused with confidentiality.

## Integrity

All generated chunks must be protected by the deployment's integrity and transport mechanisms.

A compromised chunk can compromise the application just as effectively as a compromised initial bundle.

Content hashing, HTTPS, appropriate content security controls, deployment verification, and supply-chain protections can
contribute to artifact integrity.

## Accessibility and Progressive Enhancement

Code splitting should not make essential functionality inaccessible because JavaScript loading fails.

Applications should determine which functionality is genuinely optional and provide appropriate fallback behavior when
deferred code cannot be loaded.

For applications using server-rendered content or progressive enhancement, code splitting can help keep the initial
experience functional while optional interactivity loads later.

## Deployment Strategy

A code-split application should deploy its generated artifacts as a coherent release.

A deployment should account for:

* entry chunks;
* dynamically loaded chunks;
* shared chunks;
* asset hashes;
* source maps;
* manifests;
* service workers;
* CDN caching;
* rollback behavior.

The deployment system must ensure that clients can resolve the chunk set expected by the version of the application they
are running.

## Manifest Files

Some build systems generate a manifest mapping source-level modules or logical assets to generated chunk URLs.

A server-rendering system can use this information to determine which assets belong to a rendered page.

The manifest is a build artifact and should be deployed consistently with the generated chunks.

## CDN Deployment

Code-split applications are often well suited to content-addressed or long-cache CDN deployment.

Immutable hashed chunks can be cached for long periods while a small entry artifact changes between releases.

This can reduce repeat-download costs significantly.

The CDN configuration must still account for rollout consistency and retention of old chunks needed by clients running
previous application versions.

## Rollback

Rollback is more complicated when multiple generated chunks exist.

An entry chunk from release A may depend on chunks from release A, while a deployment rollback might expose only release
B assets.

Keeping immutable release artifacts available or using atomic versioned deployments can avoid these compatibility
failures.

## Testing

Code-split applications require tests that exercise the actual loading boundaries.

Tests should cover:

* successful dynamic imports;
* loading failures;
* module evaluation failures;
* retry behavior;
* feature fallback;
* version mismatches;
* route transitions;
* optional feature loading;
* production chunk URLs.

Testing only the source modules does not validate the generated chunk graph or deployment configuration.

## Build Analysis

Bundle-analysis tools can show:

* chunk sizes;
* module composition;
* duplicated dependencies;
* shared dependencies;
* entry dependencies;
* dynamic import boundaries.

This information helps determine whether a split actually improves the intended performance characteristic.

The important question is not simply whether the application has many chunks, but whether those chunks correspond to
useful loading and caching boundaries.

## Common Failure Modes

One common failure is splitting every possible module. This produces excessive request and dependency overhead without
meaningful startup savings.

Another is splitting a frequently used feature too aggressively. Users then pay a loading delay immediately after
startup.

Another is creating shared chunks that change frequently, reducing cache effectiveness.

Another is deploying generated chunks non-atomically, allowing entry artifacts and deferred artifacts from different
releases to become mixed.

Another is treating a dynamically loaded chunk as a security boundary.

Another is ignoring dynamic import failures and assuming that deferred code will always be available.

Another is using arbitrary dynamic import expressions while expecting the bundler to discover every possible module
statically.

## Decision Criteria

Create a split point when a feature has a meaningful asynchronous boundary and separating it provides a measurable
benefit.

Good candidates include:

* rarely used routes;
* administrative functionality;
* large editors;
* visualization libraries;
* document-processing functionality;
* optional integrations;
* localization data;
* feature-specific dependencies.

Avoid splitting tiny modules merely to increase chunk count.

Keep frequently used critical functionality in the initial dependency set when the additional loading latency would
outweigh the startup benefit.

Evaluate chunk boundaries together with caching, dependency duplication, network behavior, and deployment strategy.

## Summary

Code splitting divides an application's JavaScript into independently loadable deployment artifacts so that code can be
downloaded, parsed, compiled, and evaluated when it is actually required.

Dynamic `import()` provides the primary JavaScript mechanism for expressing asynchronous module loading, while bundlers
determine the resulting chunk structure.

Effective code splitting requires balancing initial JavaScript size against feature activation latency. It must also
account for shared dependencies, duplicate code, caching, network requests, dependency chains, module side effects,
dynamic loading failures, version skew, deployment atomicity, and observability.

Code splitting complements tree shaking and minification rather than replacing them. Tree shaking removes unreachable
code, minification reduces the representation of retained code, and code splitting determines how retained code is
divided into loading boundaries.

The correct goal is not the largest possible number of chunks or the smallest possible initial bundle. The goal is a
deployment structure that aligns code loading with actual application usage while preserving module semantics,
maintaining reliable deployments, and improving the performance characteristics that matter to the system.
