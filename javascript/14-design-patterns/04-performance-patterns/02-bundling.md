# Bundling Pattern

## Intent

The Bundling Pattern combines multiple JavaScript modules and their dependencies into one or more distributable
artifacts that can be loaded or deployed as a unit.

Bundling transforms a module dependency graph into deployment-oriented output. The source application may consist of
many modules with explicit imports and exports, while the resulting artifact may contain a consolidated module graph,
transformed module boundaries, optimized code, and optionally additional assets.

The pattern is primarily concerned with controlling how JavaScript code is assembled for execution or distribution. It
is therefore a build-time pattern rather than a runtime object-oriented pattern.

## Problem

A JavaScript application is commonly divided into many modules:

```js
// user-service.js
import {UserRepository} from "./user-repository.js";

export class UserService {
    constructor(repository = new UserRepository()) {
        this.repository = repository;
    }
}
```

Those modules form a dependency graph. Delivering every source module independently can create deployment, loading,
compatibility, or performance concerns depending on the execution environment.

A browser application, for example, may contain hundreds or thousands of modules. Loading each module independently can
introduce additional network requests, metadata overhead, and coordination between module resources. A library may also
need to distribute its implementation in a form compatible with consumers that do not use the same module system.

Bundling addresses this by resolving the module graph during the build process and producing deployment artifacts
designed for the target environment.

## Core Concept

A bundler starts from one or more entry points and follows their dependencies.

For example:

```js
// main.js
import {render} from "./render.js";
import {createStore} from "./store.js";

const store = createStore();

render(store);
```

The bundler analyzes the imports from `main.js`, follows the dependencies of `render.js` and `store.js`, continues
through their dependencies, and constructs an output representation containing the reachable module graph.

The resulting artifact can then be loaded by the target environment.

The essential transformation is from a source-level module graph into a deployment-level artifact graph.

## Entry Points

An entry point identifies a module from which bundling begins.

A simple application might have one entry point:

```text
src/main.js
```

A larger application can have several:

```text
src/main.js
src/admin.js
src/worker.js
```

Multiple entry points allow independently executable parts of an application to be produced as separate artifacts.

The choice of entry points is an architectural decision because it affects dependency sharing, deployment boundaries,
caching, and code splitting.

## Dependency Graph

Bundling operates on a dependency graph rather than simply concatenating files.

Consider:

```js
// main.js
import {start} from "./app.js";

// app.js
import {createLogger} from "./logger.js";
import {createRouter} from "./router.js";

export function start() {
    const logger = createLogger();
    const router = createRouter();

    router.start(logger);
}
```

The bundler must understand the relationships between these modules and preserve their required semantics.

This is fundamentally different from concatenating files in an arbitrary order.

Module dependencies determine:

* which modules are reachable;
* which modules must be included;
* how imports are resolved;
* which exports are required;
* how initialization occurs;
* which modules can be shared;
* which modules can be removed;
* where execution boundaries can be introduced.

## Static Module Analysis

ES modules are particularly suitable for bundling because their `import` and `export` declarations are statically
analyzable.

For example:

```js
import {calculateTotal} from "./pricing.js";

export function checkout(order) {
    return calculateTotal(order);
}
```

The dependency relationship can be identified without executing the module.

This enables bundlers to perform optimizations such as tree shaking, dependency analysis, chunk generation, and static
validation.

Dynamic module loading is different:

```js
const module = await import("./feature.js");
```

The module path may define a separate loading boundary and can result in a separate output chunk.

## Module Resolution

A bundler must resolve module specifiers to concrete source modules or packages.

Examples include:

```js
import "./logger.js";
import {createClient} from "@example/client";
import config from "./config.json";
```

Resolution can involve:

* relative paths;
* package names;
* package exports;
* package conditions;
* file extensions;
* directory resolution;
* aliases;
* platform-specific implementations;
* browser-specific replacements;
* environment-specific entry points.

Resolution is therefore part of the build environment and can affect which implementation is actually included.

## Bundling vs Concatenation

Bundling is not equivalent to concatenating source files.

Concatenation merely places source files next to one another.

Bundling understands module dependencies and can transform the resulting dependency graph.

A bundler may:

* resolve imports;
* eliminate unused exports;
* transform syntax;
* split output into chunks;
* rewrite module references;
* isolate modules;
* substitute platform-specific dependencies;
* process assets;
* generate source maps.

The distinction is important because arbitrary concatenation does not preserve module semantics in general.

## Bundling vs Module Systems

Bundling does not replace the module system at the source level.

An application can use ES modules as its source representation and then bundle them into browser-oriented output.

Likewise, a package can publish multiple module formats for different consumers.

The module system describes how modules are represented and connected. Bundling describes how those modules are
assembled for distribution or execution.

## Bundling vs Transpilation

Transpilation changes source syntax or language features into another representation.

For example, source code may use newer JavaScript syntax while the output targets an older runtime.

Bundling instead assembles modules and their dependencies.

A build pipeline may perform both operations, but they solve different problems.

```text
Source modules
    ↓
Syntax transformation
    ↓
Module bundling
    ↓
Optimized deployment artifacts
```

The conceptual stages are independent even when a single build tool performs them together.

## Bundling vs Minification

Minification reduces the size of generated code by transforming its textual representation while preserving behavior.

For example:

```js
function calculateTotal(price, tax) {
    return price + price * tax;
}
```

can be minified into a more compact representation.

Minification is therefore an optimization of output representation.

Bundling is the assembly of modules and dependencies.

A project can bundle without minifying and minify without fundamentally changing how its modules are organized.

## Tree Shaking

Tree shaking removes code that can be proven to be unused from the statically analyzed module graph.

Consider:

```js
export function add(a, b) {
    return a + b;
}

export function multiply(a, b) {
    return a * b;
}
```

If an application imports only:

```js
import {add} from "./math.js";
```

a bundler may be able to omit `multiply()` from the final artifact.

Tree shaking depends heavily on static module analysis and correct assumptions about side effects.

It is particularly effective with ES modules because their exports and imports are statically declared.

## Side Effects

Tree shaking cannot safely remove code merely because no exported value is referenced if executing that module has
observable effects.

For example:

```js
console.log("module initialized");

export function createService() {
    return {};
}
```

Importing the module may have observable behavior even when `createService()` is never called.

Other side effects include:

* modifying global state;
* registering plugins;
* installing event listeners;
* defining custom elements;
* modifying prototypes;
* initializing external systems;
* importing styles or assets;
* registering serializers or handlers.

Bundling therefore requires a correct understanding of module side effects.

## Package Side-Effect Metadata

Packages can communicate side-effect information to build tooling.

A package may indicate that certain modules can safely be treated as side-effect-free when their exports are unused.

Such metadata must be accurate.

Incorrectly declaring side-effectful modules as side-effect-free can cause a bundler to remove required initialization
and produce incorrect applications.

## Code Splitting

A single large bundle is not always the optimal output.

Code splitting divides the application into multiple chunks that can be loaded independently.

Dynamic imports naturally create a potential boundary:

```js
async function openEditor() {
    const {Editor} = await import("./editor.js");

    return new Editor();
}
```

The editor implementation can be placed into a separate chunk and loaded only when required.

Code splitting therefore changes the deployment graph rather than simply reducing source size.

## Lazy Loading

Lazy loading delays loading code until it is required.

Typical use cases include:

* application routes;
* administrative interfaces;
* large editors;
* visualization libraries;
* rarely used features;
* locale data;
* optional integrations.

Bundling and lazy loading work together: the bundler identifies output boundaries while the runtime loads the
corresponding chunks when required.

## Shared Chunks

Multiple entry points or lazy-loaded features may depend on the same module.

A bundler can place shared dependencies into a separate artifact rather than duplicating them.

For example, several application areas may depend on the same utility or library.

Shared chunks can reduce duplication but introduce additional loading relationships. Splitting too aggressively can
increase request count and loading coordination.

## Chunk Granularity

Chunk boundaries represent a trade-off.

Large chunks can:

* reduce request overhead;
* simplify loading;
* improve compression efficiency;
* contain more immediately available code.

Small chunks can:

* improve lazy loading;
* reduce initial download size;
* improve independent caching;
* prevent rarely used code from being loaded unnecessarily.

The appropriate granularity depends on application navigation, runtime behavior, caching strategy, network conditions,
and deployment architecture.

## Dynamic Imports

Dynamic imports create runtime loading boundaries:

```js
const feature = await import("./feature.js");
```

Unlike static imports, dynamic imports do not necessarily require the feature implementation to be part of the initial
execution artifact.

A bundler can analyze the expression and generate an appropriate chunk when the dependency can be statically determined.

Highly dynamic expressions may be more difficult to analyze:

```js
await import(`./features/${name}.js`);
```

The resulting behavior depends on the bundler's module-resolution capabilities and configuration.

## Bundling and Browser Deployment

Browsers natively support ES modules, so bundling is not universally required.

An application can load modules directly:

```html

<script type="module" src="/src/main.js"></script>
```

This can be appropriate for smaller applications, development environments, or applications where native module loading
is sufficient.

Bundling becomes useful when the build needs to optimize dependency delivery, transform source code, split code, process
assets, or target specific browser environments.

The existence of native ESM therefore does not make bundling obsolete. It changes the reasons for using it.

## Bundling and Node.js

Node.js supports multiple module systems, including ES modules and CommonJS.

A Node.js application may execute source modules directly without bundling, or it may bundle its application into
deployment artifacts.

Bundling can be useful for:

* serverless deployments;
* reducing deployment file counts;
* eliminating unused dependencies;
* producing self-contained artifacts;
* targeting specific runtimes;
* simplifying deployment packaging.

However, bundling server-side applications can introduce complications around dynamic loading, filesystem access, native
modules, runtime resolution, and package behavior.

Bundling is therefore not automatically beneficial for every Node.js application.

## Library Bundling

Libraries have different bundling requirements from applications.

An application controls its deployment environment and can often produce a tightly optimized artifact.

A library must preserve a public API that external consumers can import.

Over-bundling a library can accidentally include dependencies that should remain external.

For example, a library may want its consumer to provide a framework dependency rather than embedding another copy of
that framework.

Library bundling therefore requires explicit decisions about which dependencies are bundled and which remain external.

## External Dependencies

A build can mark dependencies as external.

Conceptually:

```js
import {framework} from "some-framework";
```

may remain an external dependency rather than being incorporated into the generated artifact.

Externalization can:

* reduce bundle size;
* prevent duplicate dependencies;
* allow consumers to control versions;
* preserve runtime-provided modules;
* simplify peer dependency handling.

The correct externalization strategy depends on whether the output is an application, library, server package, worker,
or another artifact type.

## Dependency Duplication

Multiple versions or copies of the same dependency can accidentally enter an application.

This can increase bundle size and, more importantly, produce semantic problems when libraries rely on object identity or
singleton-like runtime state.

Examples include:

* multiple copies of a framework;
* multiple versions of a state-management library;
* duplicated runtime registries;
* duplicated class definitions affecting `instanceof`;
* duplicated context providers.

Bundling should therefore be evaluated not only by total byte size but also by dependency identity and runtime behavior.

## Module Identity

Bundling can affect assumptions about module identity.

Within a conventional module system, importing the same module from the same resolved location generally refers to the
same module instance within a given module graph.

A bundler may preserve that behavior internally, but multiple entry points, duplicated dependencies, or separate chunks
can produce different runtime instances depending on the generated architecture.

Code that relies on singleton-like module state should therefore be designed with the deployment model in mind.

## Singleton-Like Module State

ES modules naturally provide module-scoped state:

```js
let connection;

export function getConnection() {
    if (!connection) {
        connection = createConnection();
    }

    return connection;
}
```

Bundling generally preserves the module's internal state semantics within the resulting module graph.

However, producing multiple independently loaded copies of the same logical module can result in multiple instances of
that state.

This matters for registries, caches, event systems, configuration, and other module-level state.

## Asset Bundling

Modern JavaScript build systems often bundle more than JavaScript.

An import can represent other resources:

```js
import "./application.css";
import logo from "./logo.svg";
```

The build system may transform those dependencies into output assets and rewrite references accordingly.

The JavaScript module graph can therefore become part of a larger asset dependency graph.

This is a build-system concern rather than a requirement of the JavaScript module system itself.

## Source Maps

Bundling and minification can make generated code substantially different from source code.

Source maps preserve a mapping between generated output and original source.

They improve:

* debugging;
* stack trace interpretation;
* browser developer tools;
* production diagnostics.

Source maps do not change application behavior. They provide tooling metadata for relating generated artifacts to their
source representation.

## Environment-Specific Bundling

The same source code can produce different artifacts for different execution environments.

Examples include:

* browser;
* Node.js;
* serverless runtime;
* Web Worker;
* service worker;
* test environment.

Build-time substitution can select environment-specific implementations:

```js
import {createStorage} from "./storage.js";
```

where the resolved implementation differs depending on the target.

This can be useful when platform capabilities differ, but excessive environment-specific branching can make the module
graph difficult to reason about.

## Conditional Exports

Package metadata can expose different implementations depending on the consumer environment.

A package may provide different entry points for:

* import;
* require;
* browser;
* Node.js;
* development;
* production.

Bundling participates in this resolution process by selecting the appropriate package entry points for the target.

The resulting artifact can therefore differ even when the application source imports the same package name.

## Build-Time Constants

Bundlers can replace known build-time values:

```js
if (process.env.NODE_ENV === "production") {
    enableProductionMode();
}
```

After substitution, dead-code elimination may remove branches that cannot execute in the target build.

This is one reason bundling and tree shaking are often used together.

Build-time substitution should not be confused with runtime configuration. Values embedded into client-side bundles are
generally observable by the client and must not be treated as secrets.

## Environment Variables and Security

A bundler does not make configuration confidential.

If a value is embedded into a browser artifact, the value can normally be extracted by inspecting the generated code or
network resources.

Consequently:

* API keys intended to be public may be embedded;
* private credentials must not be embedded;
* server-only secrets must remain server-side;
* build-time substitution must be treated as code generation, not secret storage.

This is an architectural boundary rather than merely a build configuration concern.

## Reproducible Builds

A bundling process should ideally produce deterministic output from the same source, dependencies, configuration, and
toolchain.

Reproducibility improves:

* debugging;
* deployment verification;
* caching;
* supply-chain analysis;
* artifact comparison.

Lockfiles, pinned tool versions, deterministic module resolution, and controlled build environments contribute to
reproducibility.

## Content Hashing

Production bundlers commonly incorporate content-derived hashes into asset names.

For example:

```text
app.8f3c1a.js
```

The exact naming scheme is tool-dependent.

Content hashing allows long-lived caching while ensuring that changed content receives a new URL.

This connects bundling directly to deployment and HTTP caching strategy.

## Bundle Size

Bundle size is not simply the number of source lines.

Important measurements include:

* raw size;
* compressed size;
* initial JavaScript;
* total JavaScript;
* per-route JavaScript;
* shared chunks;
* duplicated dependencies;
* parse and compilation cost;
* execution cost.

A smaller compressed file can still be expensive if it contains large amounts of code that must be parsed and executed
during startup.

Bundle analysis should therefore consider runtime cost as well as transfer size.

## Tree Shaking and Side-Effect Design

Libraries designed for bundling should expose modular APIs and avoid unnecessary module-level side effects.

For example:

```js
export function formatDate(date) {
    return date.toISOString();
}
```

is easier to analyze than a module that performs substantial initialization merely because it was imported.

This does not mean that all side effects should be eliminated. Side effects are sometimes required. The important
requirement is that they be explicit and correctly represented in the package's build metadata.

## Bundling and API Design

The way a package exposes its API affects how effectively consumers can optimize it.

A package with many independently importable exports can provide more opportunities for consumers to eliminate unused
functionality.

For example:

```js
import {parse} from "library";
```

can be more optimization-friendly than an API that requires importing a large monolithic object.

However, API granularity should still reflect conceptual cohesion. Artificially splitting every function solely for
bundling can make the public API harder to understand.

## Bundling and Dead Code

Dead-code elimination depends on static analysis and semantic assumptions.

Code that is obviously unreachable after build-time substitution can often be removed:

```js
if (false) {
    initializeDevelopmentTools();
}
```

More complex cases involving dynamic property access, reflection, side effects, or runtime evaluation can prevent
reliable elimination.

Bundling optimizations therefore work best when the source code expresses dependencies and behavior explicitly.

## Dynamic Evaluation

Code such as:

```js
eval(source);
```

or:

```js
new Function(source);
```

is difficult for static build analysis.

The bundler cannot generally determine the module dependencies represented by arbitrary runtime-generated source.

Dynamic evaluation can therefore interfere with optimization, security analysis, and deployment assumptions.

It should not be introduced merely to circumvent static module structure.

## CommonJS and Bundling

CommonJS uses runtime-oriented module loading:

```js
const logger = require("./logger");
```

This is less statically explicit than ES module syntax.

Bundlers can still analyze many CommonJS modules, but dynamic patterns can make analysis more difficult:

```js
const moduleName = getModuleName();
const module = require(moduleName);
```

The more dynamic the module resolution behavior becomes, the less precisely a bundler can determine the dependency
graph.

This is one reason ES modules are generally preferable for modern source code intended for static bundling.

## Bundling and Circular Dependencies

Circular dependencies can exist in module graphs:

```js
// a.js
import {valueB} from "./b.js";

export const valueA = valueB + 1;
```

```js
// b.js
import {valueA} from "./a.js";

export const valueB = valueA + 1;
```

Bundling does not inherently eliminate the semantic consequences of circular dependencies.

Module initialization order, live bindings, and partially initialized exports can still matter.

A bundle should therefore preserve the relevant module semantics rather than assuming that physically combining modules
eliminates dependency cycles.

## Build-Time vs Runtime Boundaries

Bundling happens before the application runs.

Runtime behavior includes:

* module initialization;
* dynamic imports;
* network requests;
* user interaction;
* application state;
* API calls.

Build-time bundling can optimize what is known statically, but it cannot generally determine arbitrary runtime behavior.

A common architectural mistake is attempting to use build-time bundling to solve problems that actually require runtime
configuration or dynamic resource discovery.

## Caching

Bundling interacts strongly with browser and CDN caching.

A monolithic bundle can be cached efficiently when it rarely changes, but a small change can invalidate the entire
artifact.

Code splitting can isolate frequently changing and rarely changing code into different assets.

Shared chunks can improve reuse across application routes.

Caching strategy should therefore be considered when deciding bundle boundaries rather than treating chunking purely as
a JavaScript optimization.

## Deployment

The bundling process can produce deployment artifacts such as:

* JavaScript files;
* CSS files;
* images;
* fonts;
* source maps;
* metadata.

The deployment system then publishes those artifacts to the target environment.

The source module structure and deployment artifact structure do not need to be identical.

This separation allows source code to remain modular while deployment output is optimized for the target environment.

## Testing

Bundled and unbundled execution should not necessarily be treated as completely separate implementations.

Tests can operate against source modules for fast feedback, while production builds test the actual bundling
configuration.

Important build-level tests include:

* successful dependency resolution;
* expected entry points;
* correct code splitting;
* absence of accidental dependency duplication;
* correct external dependencies;
* expected asset generation;
* correct environment substitutions;
* source map generation;
* production build execution.

Integration tests should verify that the generated artifacts actually run in their target environments.

## Development Builds

Development and production builds often have different requirements.

Development builds may prioritize:

* fast rebuilds;
* readable output;
* source maps;
* detailed diagnostics;
* incremental compilation.

Production builds may prioritize:

* minification;
* tree shaking;
* code splitting;
* content hashing;
* compression;
* dead-code elimination.

The source architecture should remain understandable independently of these optimization differences.

## Watch Mode and Incremental Builds

Large JavaScript projects benefit from incremental bundling.

Instead of rebuilding the entire dependency graph after every source change, the build system can reuse previously
analyzed information and rebuild only affected portions.

This is primarily a tooling optimization, but it influences developer productivity and the practicality of maintaining a
large modular codebase.

## Build Configuration

Bundling configuration should be treated as part of the system's build architecture.

Important configuration decisions include:

* entry points;
* target environments;
* output formats;
* external dependencies;
* aliases;
* asset handling;
* source maps;
* code splitting;
* tree shaking;
* minification;
* environment substitution;
* library output;
* development versus production modes.

Configuration should remain comprehensible and should not contain unnecessary transformations merely because the bundler
supports them.

## Bundler Choice

The pattern does not depend on a particular bundler.

Different tools implement the same general concept using different architectures and optimization strategies.

The relevant architectural questions are:

* what module formats are supported;
* how dependencies are resolved;
* how static analysis works;
* how code splitting is represented;
* how plugins transform the graph;
* how output formats are generated;
* how development builds operate;
* how reproducible the output is;
* how well the tool fits the deployment environment.

The pattern should therefore be understood independently of any particular build tool.

## Plugin and Loader Systems

Bundlers often expose extension mechanisms for processing additional resource types or transforming modules.

These mechanisms can support:

* TypeScript;
* JSX;
* CSS;
* images;
* WebAssembly;
* JSON;
* generated code.

Such transformations extend the build graph beyond ordinary JavaScript modules.

The architecture should keep these transformations understandable because excessive build-time magic can make source
behavior difficult to predict.

## Bundling and TypeScript

TypeScript compilation and JavaScript bundling are separate concerns.

TypeScript primarily provides static type checking and source transformation.

A bundler assembles the resulting module graph.

Some modern build systems combine these responsibilities or use specialized transformations that do not perform full
type checking.

Projects should therefore decide explicitly where type checking occurs rather than assuming that successful bundling
implies successful type correctness.

## Bundling and JSX

JSX is not a JavaScript runtime feature. It must be transformed into JavaScript or another executable representation
before the target environment can execute it.

A bundler can participate in that transformation while simultaneously assembling the module graph.

Again, syntax transformation and dependency bundling are distinct concerns even when performed by the same tool.

## Server-Side Bundling

Server-side bundling can produce a deployable artifact that contains application code and selected dependencies.

This can simplify serverless deployment where minimizing uploaded files is useful.

However, server-side applications may depend on runtime filesystem paths, native modules, dynamic imports, child
processes, or package metadata that bundling can alter.

Server-side bundling should therefore be evaluated against the runtime's actual module and resource requirements.

## Worker Bundling

Web Workers and other worker contexts can have separate entry points:

```js
const worker = new Worker(
    new URL("./worker.js", import.meta.url)
);
```

A build system can produce a dedicated worker artifact while sharing or duplicating dependencies according to its
chunking strategy.

Worker entry points should therefore be treated as deployment boundaries rather than simply ordinary modules.

## Service Worker Bundling

Service workers have their own lifecycle and execution context.

Bundling service-worker code requires particular attention to:

* generated asset paths;
* cache manifests;
* update behavior;
* versioning;
* scope;
* precaching;
* runtime caching.

A service worker bundle can be technically valid while still producing incorrect cache behavior if generated artifact
names and service-worker caching logic are inconsistent.

## Bundling and WebAssembly

JavaScript modules can depend on WebAssembly modules or related binary assets.

The bundling system may copy, reference, inline, or otherwise process these resources depending on its configuration.

The important architectural concern is preserving the runtime relationship between generated JavaScript and binary
resources.

## Common Misuse

A common misuse is bundling solely because a project contains JavaScript modules.

Native ES modules may already provide an adequate delivery mechanism.

Another misuse is treating one enormous bundle as inherently better than multiple chunks. A monolithic artifact can
increase initial loading and invalidation costs.

The opposite mistake is excessive code splitting. Creating a large number of tiny chunks can introduce loading overhead
and complicated runtime dependency relationships.

Another misuse is bundling libraries without considering which dependencies should remain external. This can create
duplicate framework instances or unnecessarily large consumer applications.

Another mistake is confusing bundling with minification or transpilation. These are related build operations but solve
different problems.

## Over-Bundling

Over-bundling occurs when unrelated or rarely used functionality is forced into the same artifact.

Symptoms can include:

* large initial JavaScript;
* slow startup;
* poor cache isolation;
* unnecessary dependency inclusion;
* difficulty identifying feature boundaries.

The solution is not necessarily more code splitting. The underlying module and deployment boundaries should first be
examined.

## Under-Bundling

Under-bundling occurs when the output is fragmented into too many independently loaded resources without sufficient
benefit.

Symptoms can include:

* excessive network coordination;
* duplicated runtime overhead;
* inefficient caching;
* complicated preload relationships;
* slower feature loading.

The correct bundle structure depends on actual application loading behavior.

## Refactoring Toward Bundling

A project can be refactored toward a bundle-oriented architecture by:

1. Establishing explicit module boundaries.
2. Replacing implicit global dependencies with imports and exports.
3. Establishing clear application entry points.
4. Removing unnecessary dynamic module resolution.
5. Identifying environment-specific dependencies.
6. Separating application dependencies from external runtime dependencies.
7. Introducing a build step that resolves the module graph.
8. Measuring output size and startup behavior.
9. Introducing code splitting where actual loading boundaries justify it.
10. Verifying the generated artifacts in the target environment.

Bundling should be introduced after the module dependency structure is sufficiently explicit. A bundler should not be
used to conceal an incoherent dependency graph.

## Refactoring Away from Bundling

A project may also move away from bundling when the target environment can efficiently consume native modules.

This can simplify:

* development;
* deployment;
* debugging;
* module identity;
* source mapping;
* runtime dependency resolution.

However, removing bundling may also eliminate optimizations or compatibility transformations that the application still
requires.

The decision should therefore be based on the target runtime and deployment requirements.

## Architectural Boundaries

Bundling can create a distinction between source architecture and deployment architecture.

Source modules may be organized around:

* domains;
* features;
* components;
* services;
* infrastructure;
* shared utilities.

Deployment artifacts may instead be organized around:

* application startup;
* routes;
* workers;
* lazy features;
* runtime environments.

These two structures do not need to correspond one-to-one.

A good build architecture preserves source modularity while generating deployment artifacts appropriate for runtime
behavior.

## Bundling and Dependency Inversion

Bundling does not determine dependency direction.

A well-structured application can use dependency inversion and then bundle the resulting module graph.

For example, application code can depend on an abstract capability while the composition root selects a concrete
implementation.

The bundler then resolves the concrete module dependencies that actually belong to the selected build.

Build-time replacement can reinforce dependency inversion, but it should not become a substitute for explicit
architectural boundaries.

## Bundling and Dependency Injection

Dependency Injection determines how runtime dependencies are supplied.

Bundling determines which implementation modules are present in the deployment artifact.

They can be combined:

```js
import {createProductionRepository} from "./production-repository.js";

const repository = createProductionRepository();

const service = new UserService(repository);
```

The bundler can include the production repository implementation while the application still uses explicit dependency
injection.

Build-time selection and runtime dependency injection should not be confused.

## Bundling and Plugin Architectures

Dynamic plugin systems can conflict with aggressive static bundling because the complete plugin set may not be known at
build time.

A build can include known plugins statically:

```js
import pluginA from "./plugins/plugin-a.js";
import pluginB from "./plugins/plugin-b.js";
```

while a runtime plugin architecture may discover modules dynamically.

The choice depends on whether plugins are known deployment artifacts or genuinely runtime-discovered extensions.

## Bundling and Dynamic Applications

Highly dynamic applications may require a hybrid approach.

Static dependencies can be bundled normally, while dynamic capabilities are loaded through:

```js
await import(moduleSpecifier);
```

This preserves static optimization for the known dependency graph while allowing controlled runtime extensibility.

The boundary between static and dynamic loading should be deliberate because dynamic loading reduces what the build
system can prove about the complete dependency graph.

## Benefits

Bundling provides:

* deployment-oriented module assembly;
* dependency graph analysis;
* tree shaking;
* code splitting;
* lazy loading;
* dependency deduplication opportunities;
* environment-specific output;
* asset processing;
* optimized distribution artifacts;
* compatibility transformations;
* content-hashed deployment assets;
* integration between source modules and deployment architecture.

For large applications, its primary value is often the ability to transform a rich source dependency graph into a
runtime-oriented delivery strategy.

## Costs

Bundling introduces:

* build complexity;
* configuration;
* build-time dependencies;
* generated artifacts;
* source-map complexity;
* possible module-semantic differences;
* debugging differences between source and output;
* dependency-resolution complexity;
* potential duplication;
* chunk-management complexity;
* build performance concerns.

A bundler also becomes part of the development and deployment toolchain, which creates an additional operational
dependency.

## Decision Criteria

Use bundling when the deployment environment or application requirements benefit from assembling modules into optimized
artifacts.

Typical reasons include:

* large client applications;
* dependency graph optimization;
* tree shaking;
* code splitting;
* lazy loading;
* legacy runtime targeting;
* asset processing;
* library distribution;
* controlled deployment artifacts;
* serverless packaging.

Do not introduce bundling merely because the application uses modules.

If native ES modules provide adequate loading behavior and no significant build-time transformation or optimization is
required, direct module delivery may be simpler.

If the main problem is syntax compatibility, use an appropriate transformation mechanism.

If the main problem is file size, consider minification and compression.

If the main problem is initial loading, consider code splitting and lazy loading.

If the main problem is repeated computation, bundling is unrelated and another optimization is required.

## Summary

The Bundling Pattern assembles a JavaScript module dependency graph into one or more deployment-oriented artifacts.

Its central concern is not simply combining files. A bundler resolves module dependencies, analyzes the graph,
determines reachable code, and can transform that graph into optimized chunks appropriate for the target runtime.

Bundling is distinct from ES modules, transpilation, minification, tree shaking, and code splitting. These mechanisms
frequently operate together, but each addresses a different concern.

The most important architectural principle is to preserve the distinction between source modularity and deployment
structure. A codebase can remain highly modular while its production artifacts are consolidated, split, optimized, or
otherwise transformed according to runtime requirements.

JavaScript's native module systems reduce the need for bundling in some environments, but bundling remains valuable when
applications require optimized dependency delivery, static analysis, compatibility transformation, code splitting, asset
processing, or controlled deployment artifacts.
