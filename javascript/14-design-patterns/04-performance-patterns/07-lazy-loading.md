# Lazy Loading

Lazy Loading is a runtime and build-time technique for deferring the loading of a resource until it is actually needed.
Instead of making all application code, data, components, modules, or external resources available during initial
startup, the system loads selected resources on demand. The primary objective is to reduce initial work and resource
consumption while preserving the ability to obtain functionality later.

In JavaScript applications, lazy loading is most commonly implemented through dynamic `import()`, deferred script
loading, route-level loading, component-level loading, on-demand data fetching, and conditional loading of optional
dependencies. Lazy Loading is closely related to Code Splitting and Lazy Initialization, but they solve different
problems. Code Splitting determines how code is separated into independently loadable artifacts, while Lazy Loading
determines when a resource is requested. Lazy Initialization defers creation or computation of an already available
resource; Lazy Loading defers obtaining the resource itself.

## Intent

The intent of Lazy Loading is to avoid loading resources before they provide value. A resource should become available
when the application reaches a point where the resource is required, rather than necessarily during startup.

Lazy Loading is particularly useful when an application contains functionality that is expensive, rarely used,
conditional, environment-specific, or accessible only after a user action. Examples include administrative interfaces,
large editors, visualization libraries, language packs, payment integrations, feature-specific code, optional
integrations, and route-specific components.

The technique should not be interpreted as a universal optimization. Deferring a resource moves work from startup to a
later point in time. The resulting system must therefore balance initial-load performance against latency when the
deferred resource is first requested.

## Loading Versus Initialization

Loading and initialization represent different stages of resource availability.

Loading obtains the resource. For JavaScript, this may involve fetching a module from a server, retrieving a chunk from
a CDN, reading a module from a filesystem, or obtaining another external resource.

Initialization performs the work required to make the loaded resource usable. This may include constructing objects,
establishing connections, parsing data, registering handlers, or performing expensive computations.

A module can therefore be loaded eagerly but initialized lazily, or loaded lazily and initialized immediately after
loading.

```js
import {createEditor} from "./editor.js";

let editor;

function getEditor() {
    return editor ??= createEditor();
}
```

Here the module is loaded during normal module initialization, while the editor instance is created only when
`getEditor()` is called. This is Lazy Initialization rather than Lazy Loading.

Dynamic import can defer both operations:

```js
let editorPromise;

function loadEditor() {
    return editorPromise ??= import("./editor.js");
}
```

The module is not requested until `loadEditor()` is called. The resulting promise is cached so concurrent callers share
the same loading operation.

## Dynamic Import

The primary native JavaScript mechanism for lazy-loading modules is dynamic `import()`.

```js
async function openEditor() {
    const {Editor} = await import("./editor.js");

    const editor = new Editor();
    editor.open();
}
```

Unlike a static import declaration, a dynamic import is an expression that evaluates to a promise. The module can
therefore be requested conditionally or in response to runtime behavior.

```js
button.addEventListener("click", async () => {
    const {showSettings} = await import("./settings.js");

    showSettings();
});
```

This is particularly useful when the settings interface is not required until the user opens it.

Dynamic imports also allow runtime decisions:

```js
async function loadFormatter(format) {
    switch (format) {
        case "json":
            return import("./formatters/json.js");

        case "xml":
            return import("./formatters/xml.js");

        case "yaml":
            return import("./formatters/yaml.js");

        default:
            throw new Error(`Unsupported format: ${format}`);
    }
}
```

The implementation can load only the formatter required by the current operation rather than loading every formatter
during startup.

## Relationship to Code Splitting

Code Splitting and Lazy Loading are related but distinct.

Code Splitting divides a module graph into separately loadable artifacts. Lazy Loading determines whether and when one
of those artifacts is requested.

A dynamic import is commonly used as a split point by JavaScript build tools:

```js
async function loadAdminPanel() {
    const module = await import("./admin-panel.js");

    return module.createAdminPanel();
}
```

A bundler may place `admin-panel.js` and its dependencies into a separately loadable chunk. The application then loads
that chunk when `loadAdminPanel()` executes.

Code Splitting without Lazy Loading is possible. An application can create multiple chunks but preload or eagerly
request them immediately.

Lazy Loading without JavaScript Code Splitting is also possible. An application may lazily retrieve an image, JSON
document, stylesheet, WebAssembly module, or other resource without splitting JavaScript modules.

The distinction is therefore important: **Code Splitting concerns artifact boundaries; Lazy Loading concerns loading
timing.**

## Route-Level Lazy Loading

Applications with multiple routes commonly lazy-load route-specific code.

```js
const routes = {
    home: () => import("./routes/home.js"),
    products: () => import("./routes/products.js"),
    account: () => import("./routes/account.js")
};

async function navigate(route) {
    const module = await routes[route]();

    return module.render();
}
```

The initial application does not need to load every route implementation. A route is loaded when navigation reaches it.

Route-level lazy loading is effective when routes have substantial dependencies that are not shared by most of the
application. It is less useful when every route depends on essentially the same large runtime or when users predictably
visit nearly every route during a short session.

## Feature-Level Lazy Loading

Lazy Loading can be applied to individual features rather than entire routes.

```js
async function enableChartFeature() {
    const {createChart} = await import("./chart-feature.js");

    return createChart();
}
```

This is useful for optional functionality such as reporting, advanced search, media editing, analytics dashboards,
export functionality, or administration tools.

Feature-level loading can also be driven by configuration or capabilities:

```js
async function loadIntegration(name) {
    if (name === "stripe") {
        return import("./integrations/stripe.js");
    }

    if (name === "paypal") {
        return import("./integrations/paypal.js");
    }

    throw new Error(`Unknown integration: ${name}`);
}
```

The application can avoid shipping or loading integrations that are not relevant to the current execution path.

## Component-Level Lazy Loading

User interfaces can lazy-load components that are expensive or unlikely to be rendered immediately.

```js
async function renderChart(container, data) {
    const {Chart} = await import("./Chart.js");

    const chart = new Chart(container);
    chart.render(data);
}
```

This is useful for large visualization components, rich text editors, maps, media players, and other functionality with
substantial dependencies.

Component-level lazy loading introduces an additional concern: the application must provide an appropriate loading state
while the component is being obtained.

```js
async function renderLazyComponent(render) {
    showLoadingIndicator();

    try {
        await render();
    } catch (error) {
        showLoadingError(error);
    } finally {
        hideLoadingIndicator();
    }
}
```

The loading state is part of the user experience and should be designed rather than treated as an implementation detail.

## Lazy Loading External Resources

Lazy Loading is not limited to JavaScript modules.

Images can be loaded when they approach the viewport:

```html
<img
        src="placeholder.jpg"
        data-src="large-image.jpg"
        loading="lazy"
        alt="Product photograph"
>
```

The `loading="lazy"` attribute delegates loading decisions to the browser.

Applications can also load external data only when required:

```js
async function loadProductDetails(id) {
    const response = await fetch(`/api/products/${id}`);

    if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
    }

    return response.json();
}
```

The same architectural principle applies: do not obtain a resource until the application has a reason to obtain it.

## Lazy Loading and User Interaction

User interaction is a common trigger for lazy loading.

```js
let searchModulePromise;

searchButton.addEventListener("click", async () => {
    searchModulePromise ??= import("./advanced-search.js");

    const {openSearch} = await searchModulePromise;

    openSearch();
});
```

The module is not needed until the user requests advanced search functionality.

This pattern can be combined with predictive loading. If application behavior indicates that a user is likely to request
a resource soon, the application can begin loading it before the operation actually requires it.

```js
function prepareSearch() {
    searchModulePromise ??= import("./advanced-search.js");
}

searchButton.addEventListener("mouseenter", prepareSearch);
searchButton.addEventListener("focus", prepareSearch);

searchButton.addEventListener("click", async () => {
    const {openSearch} = await searchModulePromise;

    openSearch();
});
```

The first two events provide opportunities to hide part of the network latency without making the resource part of the
initial load.

Predictive loading should remain conservative. Speculatively loading too many resources can negate the benefit of Lazy
Loading.

## Prefetching and Preloading

Lazy Loading and prefetching can coexist.

Lazy Loading normally means that the resource is not requested until a trigger occurs. Prefetching intentionally
requests a resource before it is immediately required because the application predicts future demand.

Preloading expresses a stronger priority: a resource is expected to be needed soon and should receive early loading
priority.

These mechanisms should not be treated as synonyms. They represent different scheduling decisions.

A useful strategy is to lazy-load a feature while prefetching it only when there is strong evidence that the user will
need it soon.

## Promise Sharing

A common failure mode is accidentally starting multiple loads for the same resource.

```js
async function loadEditor() {
    return import("./editor.js");
}
```

Multiple calls can independently request the module-loading operation from the application perspective.

A shared promise makes the loading operation explicit and reusable:

```js
let editorPromise;

function loadEditor() {
    return editorPromise ??= import("./editor.js");
}
```

Now concurrent callers can share the same promise.

This pattern is particularly important when loading involves more than JavaScript module caching, such as network
requests, initialization procedures, or external resources.

## Failure Handling

Lazy Loading moves failures from startup into runtime execution.

An eagerly loaded module can prevent the application from starting when it cannot be loaded. A lazily loaded module may
allow the application to start successfully but fail when the user later activates the corresponding functionality.

```js
async function openReports() {
    try {
        const {renderReports} = await import("./reports.js");

        renderReports();
    } catch (error) {
        console.error("Unable to load reports", error);
        showReportsUnavailable();
    }
}
```

The failure path should be designed explicitly. Appropriate behavior may include retrying, displaying an error state,
falling back to another implementation, disabling an optional feature, or directing the user toward recovery.

Lazy loading failures can result from network connectivity, deployment inconsistencies, CDN failures, missing artifacts,
incorrect URLs, browser restrictions, authentication, authorization, or incompatible deployments.

## Retry Semantics

Retrying a failed load requires a deliberate policy.

```js
let modulePromise;

function loadFeature() {
    return modulePromise ??= import("./feature.js").catch(error => {
        modulePromise = undefined;
        throw error;
    });
}
```

This implementation allows a subsequent invocation to retry after a failure.

Whether retries are appropriate depends on the failure. A transient network failure may justify retrying, while a
missing deployment artifact or authorization failure may not.

Retries should also be bounded. Uncontrolled retry loops can amplify failures and create unnecessary network traffic.

## Timeouts

Dynamic imports themselves do not provide an application-level timeout API.

When the loading operation includes an external request under application control, a timeout can be implemented with
`AbortController`.

```js
async function fetchConfiguration(signal) {
    const response = await fetch("/config.json", {signal});

    if (!response.ok) {
        throw new Error(`Configuration request failed: ${response.status}`);
    }

    return response.json();
}
```

The timeout policy belongs to the operation that owns the request. It should not be confused with arbitrary cancellation
of JavaScript module evaluation.

Timeouts are particularly important for resources whose absence should not block the user interface indefinitely.

## Cancellation

Cancellation is more nuanced than timeout handling.

A fetch request can normally be associated with an `AbortSignal`:

```js
async function loadData(signal) {
    const response = await fetch("/api/data", {signal});

    if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
    }

    return response.json();
}
```

Dynamic `import()` does not expose an `AbortSignal` parameter. Once a module import has been initiated, application code
should not assume that it can cancel the module loading operation through the import expression.

This distinction matters for architecture. If cancellation is a hard requirement, the resource-loading mechanism may
need to be designed around an explicitly cancellable operation rather than treating every form of lazy loading as
cancellable.

## Loading State

Lazy-loaded functionality should expose an explicit state model when loading affects application behavior.

A minimal state model may distinguish loading, loaded, and failed states:

```js
let state = {
    status: "idle",
    module: null,
    error: null
};

async function loadFeature() {
    if (state.status === "loaded") {
        return state.module;
    }

    if (state.status === "loading") {
        return state.promise;
    }

    state.status = "loading";

    state.promise = import("./feature.js")
        .then(module => {
            state = {
                status: "loaded",
                module,
                error: null
            };

            return module;
        })
        .catch(error => {
            state = {
                status: "failed",
                module: null,
                error
            };

            throw error;
        });

    return state.promise;
}
```

The appropriate state model depends on the application. UI systems may need loading, success, error, and retry states.
Infrastructure systems may additionally require degraded, unavailable, expired, or permanently failed states.

## Module Identity and Evaluation

ES modules are not recreated from scratch every time a dynamic import is evaluated. Module loading is integrated with
the module system's module records and caching semantics.

```js
const first = await import("./module.js");
const second = await import("./module.js");

console.log(first === second);
```

The namespace objects associated with the same resolved module are stable for the module system rather than representing
independent module instances.

This means Lazy Loading does not automatically provide isolated module instances. If multiple independent instances are
required, the module should expose a factory or another explicit instance-creation mechanism.

```js
const {createSession} = await import("./session.js");

const firstSession = createSession();
const secondSession = createSession();
```

The module is loaded once while application-level objects can still have independent lifetimes.

## Lazy Loading and State

Lazy loading can change when module-level side effects occur.

```js
export const client = createClient();
```

If this module is loaded lazily, `createClient()` does not execute until the module is loaded and evaluated.

This can affect logging, registration, configuration validation, singleton creation, environment detection, and other
initialization behavior.

Moving an import from static to dynamic is therefore not merely a performance change. It can change observable
initialization order.

Code that depends on eager registration should be reviewed carefully before being moved behind a lazy-loading boundary.

## Top-Level Await

Modules can use top-level `await`, which makes dynamic module loading asynchronous beyond merely fetching source code.

```js
const configuration = await loadConfiguration();

export const api = createApi(configuration);
```

A dynamic import resolves only after the imported module and its dependency graph have completed the required module
evaluation.

This can make lazy loading substantially more expensive than downloading a JavaScript file. The application should
account for module evaluation, nested dependencies, asynchronous initialization, and downstream resource access when
estimating the cost of a lazy-loaded feature.

## Dependency Graphs

Lazy Loading changes the effective execution path through the module dependency graph.

A lazily loaded module may itself have many dependencies:

```js
const {createEditor} = await import("./editor.js");
```

The apparent size of `editor.js` does not necessarily represent the total amount of work required to activate the
feature. Its transitive dependencies may also need to be loaded and evaluated.

Build tooling can optimize shared dependencies, but application architecture remains important. A supposedly small
lazy-loaded feature can still pull a substantial dependency subtree into the browser.

Lazy-loading boundaries should therefore be evaluated in terms of the complete dependency graph rather than individual
source files.

## Shared Dependencies

Multiple lazy-loaded features may depend on the same module.

```js
async function loadReports() {
    return import("./reports.js");
}

async function loadAnalytics() {
    return import("./analytics.js");
}
```

If both modules depend on the same large library, the bundler may place that dependency in a shared artifact or may
duplicate it depending on the build configuration and dependency graph.

The important architectural question is not simply how many files exist, but how much code must be transferred and
evaluated for each user journey.

## Dynamic Import Expressions

Static dynamic-import specifiers are easier for build tools to analyze:

```js
import("./features/editor.js");
```

Expressions can make the set of possible resources harder to determine:

```js
import(`./features/${featureName}.js`);
```

Whether this works efficiently depends on the build tool and its module-resolution model. Some tools generate a context
containing all possible matching modules, which can result in substantially more code being included than expected.

When the set of modules is known, an explicit registry is often more predictable:

```js
const loaders = {
    editor: () => import("./features/editor.js"),
    reports: () => import("./features/reports.js"),
    settings: () => import("./features/settings.js")
};

function loadFeature(name) {
    const loader = loaders[name];

    if (!loader) {
        throw new Error(`Unknown feature: ${name}`);
    }

    return loader();
}
```

This keeps the set of lazy-loadable modules explicit and improves static analysis.

## Lazy Loading and Bundling

Bundling determines the deployment representation of modules, while Lazy Loading determines when those representations
are requested.

A bundler may transform:

```js
const {Editor} = await import("./editor.js");
```

into a request for a generated chunk containing the editor and its dependencies.

The resulting filename, chunk structure, preloading behavior, caching strategy, and runtime loader are build concerns
rather than semantics of the `import()` expression itself.

Lazy Loading therefore should be designed together with the bundling strategy. A source-level lazy boundary that
produces an inefficient deployment artifact may provide little practical benefit.

## Caching

Lazy-loaded resources interact strongly with browser, CDN, service-worker, and application caches.

Content-hashed artifacts are generally well suited to long-lived caching because a changed artifact receives a different
URL. Applications can then cache previously loaded chunks without confusing an old resource with a newer version.

Deployment systems must nevertheless consider version skew. A running application may request a chunk that existed when
the application was initially loaded but has since been removed from the server during deployment.

A robust deployment strategy should retain compatible artifacts for an appropriate period or provide a controlled
recovery mechanism for stale clients.

## Service Workers

Service workers can alter the effective behavior of Lazy Loading because they can intercept resource requests and
satisfy them from caches.

This can make lazy-loaded resources appear almost instantaneous after they have been cached. It can also introduce cache
invalidation and deployment-versioning concerns.

A service worker should therefore be treated as part of the resource-delivery architecture rather than as an invisible
implementation detail.

## Server-Side Environments

Lazy Loading also applies outside browsers.

Node.js supports dynamic `import()` and can use it for conditional dependencies, optional functionality, plugin systems,
and environment-specific implementations.

```js
async function loadDatabaseDriver(type) {
    if (type === "postgres") {
        return import("./drivers/postgres.js");
    }

    if (type === "sqlite") {
        return import("./drivers/sqlite.js");
    }

    throw new Error(`Unsupported database: ${type}`);
}
```

Server-side Lazy Loading can reduce startup work or avoid loading optional integrations, but the trade-off is different
from browser performance. Network transfer may not be the dominant cost, while module initialization, memory usage,
startup latency, and operational predictability may be more important.

Serverless systems can also benefit from deferred loading when only some execution paths require particular
dependencies, although the resulting cold-start behavior must be measured.

## Workers

Large or isolated workloads can be deferred until the corresponding worker is needed.

```js
const worker = new Worker(
    new URL("./image-worker.js", import.meta.url),
    {type: "module"}
);
```

Creating the worker only when the feature is activated is a form of lazy resource acquisition. The worker's own module
graph can then be loaded when the worker starts.

This is distinct from dynamically importing a module into the current execution context because a worker introduces an
independent execution environment.

## WebAssembly

WebAssembly modules can also be loaded lazily.

```js
async function loadCodec() {
    const {instance} = await WebAssembly.instantiateStreaming(
        fetch("/codec.wasm")
    );

    return instance;
}
```

This is useful for computationally expensive functionality that is not required by every execution path.

The same concerns apply: loading time, compilation time, initialization, caching, failure handling, and resource
ownership all contribute to the actual cost.

## Lazy Loading and Dependency Injection

Dependency Injection can determine when dependencies are resolved.

```js
class ReportService {
    constructor(reportLoader) {
        this.reportLoader = reportLoader;
    }

    async generate() {
        const {generateReport} = await this.reportLoader();

        return generateReport();
    }
}

const service = new ReportService(
    () => import("./report-engine.js")
);
```

The service depends on a loader abstraction rather than directly deciding how the report engine is obtained.

This can improve testing and architectural separation. The production composition root can provide a dynamic loader,
while tests can provide an immediate implementation.

```js
const service = new ReportService(
    async () => ({
        generateReport: () => "test report"
    })
);
```

Lazy Loading and Dependency Injection therefore address different concerns. Lazy Loading controls acquisition timing;
Dependency Injection controls how dependencies are supplied.

## Plugin Loading

Plugin architectures frequently use Lazy Loading because plugins are often optional.

```js
const pluginLoaders = {
    markdown: () => import("./plugins/markdown.js"),
    csv: () => import("./plugins/csv.js"),
    pdf: () => import("./plugins/pdf.js")
};

async function loadPlugin(name) {
    const loader = pluginLoaders[name];

    if (!loader) {
        throw new Error(`Unknown plugin: ${name}`);
    }

    return loader();
}
```

The registry makes the available plugin set explicit while allowing individual implementations to remain unloaded until
required.

Plugin loading introduces additional security and lifecycle concerns. Dynamically loading code does not make that code
trustworthy. Plugin sources, versions, permissions, configuration, and compatibility must be governed by the surrounding
architecture.

## Security

Lazy Loading is not a security boundary.

A dynamically imported module still executes with the permissions and authority available to the surrounding
application.

Loading code only after authentication or authorization may reduce unnecessary work, but it should not be treated as a
substitute for server-side authorization.

```js
if (user.canManageReports) {
    const {openReports} = await import("./reports-admin.js");

    openReports();
}
```

The authorization check controls whether the feature is activated, but sensitive operations must still be protected by
the appropriate backend authorization mechanisms.

Dynamic loading of arbitrary URLs or user-controlled module specifiers is particularly dangerous. Module selection
should normally be constrained to trusted, known resources.

## Observability

Lazy Loading introduces runtime events that should be observable.

Useful measurements include load start time, resource transfer duration, module evaluation duration, failure rate, retry
count, cache hit behavior, and time from user intent to feature readiness.

For user-facing functionality, the most meaningful metric is often not simply whether the resource loaded, but how long
the user waited before the requested capability became usable.

Instrumentation should distinguish network delay from initialization and rendering delay so that the actual bottleneck
can be identified.

## Performance Trade-offs

Lazy Loading primarily improves initial performance by deferring work. It does not eliminate that work.

Potential benefits include lower initial JavaScript transfer, reduced parsing and compilation during startup, lower
initial memory usage, reduced initialization work, and improved time to first useful interaction.

Potential costs include additional network requests, later interaction latency, more complex loading states, additional
error paths, cache misses, duplicated dependencies, and increased application complexity.

A resource that is always needed immediately is generally a poor candidate for Lazy Loading. Deferring it merely inserts
a loading boundary into the critical path.

## Granularity

The size and frequency of lazy-loaded resources must be balanced.

Very large chunks reduce the number of requests but can create long waits when activated. Very small chunks can produce
excessive request overhead, duplicated dependencies, complex caching behavior, and difficult operational debugging.

The optimal granularity depends on application behavior, network conditions, runtime costs, caching, and user navigation
patterns.

Lazy-loading boundaries should therefore follow meaningful application capabilities rather than being created
mechanically for individual source files.

## Lazy Loading Versus Lazy Initialization

Lazy Loading and Lazy Initialization are often combined but should remain conceptually distinct.

Lazy Loading delays acquisition:

```js
const module = await import("./feature.js");
```

Lazy Initialization delays creation:

```js
let feature;

function getFeature() {
    return feature ??= createFeature();
}
```

Both can be combined:

```js
let featurePromise;

async function getFeature() {
    const module = await (
        featurePromise ??= import("./feature.js")
    );

    return module.createFeature();
}
```

In this example, loading is deferred until first use, while the actual feature instance is created after the module
becomes available.

## Lazy Loading Versus Lazy Evaluation

Lazy Evaluation delays computation until its result is required. It does not necessarily involve resource acquisition.

```js
const value = () => expensiveCalculation();
```

The calculation is deferred, but no external resource is necessarily loaded.

Lazy Loading instead concerns obtaining a resource that is not currently available to the executing context.

The two techniques can be combined, but they solve different problems.

## Lazy Loading Versus Caching

Caching retains an already obtained result so that subsequent accesses do not repeat the underlying operation.

Lazy Loading controls when the first acquisition occurs.

```js
let modulePromise;

function getFeature() {
    return modulePromise ??= import("./feature.js");
}
```

The promise serves as a cache of the in-progress and completed loading operation.

Lazy Loading without caching can repeatedly perform expensive application-level loading work when the resource is not
managed by a lower-level cache. Caching without Lazy Loading can still eagerly acquire and retain a resource.

## Testing

Tests should cover both the loaded and unloaded states.

A lazy-loaded feature should be tested for successful acquisition, failed acquisition, loading-state behavior, retries
where applicable, concurrent callers, and behavior after the resource has already been loaded.

The loader should often be injected or abstracted when the application needs deterministic tests:

```js
class FeatureService {
    constructor(loader) {
        this.loader = loader;
    }

    async execute() {
        const feature = await this.loader();

        return feature.execute();
    }
}
```

Tests can provide a controlled loader:

```js
const service = new FeatureService(
    async () => ({
        execute: () => 42
    })
);

const result = await service.execute();

console.assert(result === 42);
```

This avoids coupling the unit test to the actual module-loading infrastructure.

## Common Failure Modes

Lazy Loading becomes counterproductive when almost every user immediately requires the deferred resource. In that
situation the application has merely moved essential work later in time.

Another failure mode is creating too many small loading boundaries. Excessive fragmentation can increase network
overhead, complicate caching, and make runtime behavior difficult to reason about.

A particularly important mistake is treating a dynamic import as inherently lightweight. The imported module may have a
large transitive dependency graph and expensive initialization.

Another mistake is ignoring error handling. Lazy-loaded functionality introduces runtime failure states that may not
exist when the same functionality is eagerly loaded during application startup.

Changing static imports to dynamic imports can also alter initialization ordering. Modules that previously registered
handlers, initialized configuration, or established global state during startup may now perform those actions only when
the feature is activated.

## Architectural Considerations

Lazy Loading is most effective when application boundaries correspond to meaningful usage boundaries.

Good candidates often have one or more of these characteristics:

* They are not required for initial startup.
* They are used only by particular routes or workflows.
* They contain substantial dependencies.
* They are accessed by a minority of users.
* They are conditionally enabled.
* They are expensive to initialize.
* They can tolerate activation latency.
* They can be independently cached and deployed.

Poor candidates include core runtime functionality, universally required dependencies, resources that must be available
immediately after startup, and extremely small modules whose separation creates more overhead than benefit.

Lazy-loading boundaries should therefore be selected from observed application behavior rather than from source-code
structure alone.

## Relationship to Other Patterns and Techniques

Lazy Loading frequently works with several other mechanisms.

Code Splitting creates independently loadable deployment artifacts that Lazy Loading can request later.

Lazy Initialization defers creation or setup after a resource is already available.

Factory Functions can create instances after a lazily loaded implementation becomes available.

Dependency Injection can provide loader functions without coupling consumers to the loading mechanism.

Proxy can defer access to a resource by intercepting operations, although Proxy and Lazy Loading should not be
conflated. A proxy can implement lazy acquisition as one behavior among many.

Object Pooling reuses existing resources rather than deferring their initial acquisition.

Caching retains previously acquired resources rather than determining when acquisition occurs.

Plugin architectures commonly use Lazy Loading because plugins are often optional.

Dynamic `import()` provides the native JavaScript mechanism most directly associated with lazy-loading modules, but Lazy
Loading itself is broader than dynamic module import.

## When to Use Lazy Loading

Use Lazy Loading when delaying acquisition provides a measurable benefit and the deferred resource can tolerate
activation latency.

It is particularly appropriate for route-specific code, optional features, large libraries, rarely used integrations,
expensive UI components, specialized workers, large datasets, and other resources that do not belong on the initial
critical path.

Do not introduce Lazy Loading merely because a resource is large. A large resource that every user needs immediately may
belong in the critical path despite its size.

The decision should be based on the complete cost model: transfer, parsing, compilation, evaluation, initialization,
memory, caching, interaction latency, and operational complexity.

## Summary

Lazy Loading defers resource acquisition until a resource is needed or is predicted to be needed soon. In JavaScript,
dynamic `import()` is the primary native mechanism for lazy-loading modules, while browser loading primitives, network
requests, workers, WebAssembly, and application-level loaders extend the technique to other resource types.

Lazy Loading is distinct from Code Splitting, which defines independently loadable artifacts, and from Lazy
Initialization, which defers creation or setup of an already available resource. Effective Lazy Loading requires
explicit loading states, failure handling, caching, concurrency control, deployment compatibility, observability, and
appropriate boundaries.

The central trade-off is simple: **Lazy Loading reduces work on the initial path by moving work to a later path.** It is
beneficial when the deferred work is not immediately required and the cost of later activation is acceptable.
