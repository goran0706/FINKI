# Lazy Initialization Pattern

## Intent

The Lazy Initialization Pattern defers the creation, computation, or initialization of a value or resource until the
value is actually required.

Instead of performing initialization immediately when an object, module, or application component is created, the system
records enough information to initialize it later. Once initialization is triggered, the resulting value may be retained
and reused for subsequent accesses.

The pattern is fundamentally about controlling initialization timing. It can reduce startup work, avoid unnecessary
resource creation, reduce initial memory consumption, and defer expensive operations until there is evidence that they
are needed.

Lazy initialization is particularly natural in JavaScript because functions, closures, getters, modules, promises, and
dynamic imports provide several mechanisms for expressing deferred work.

## Problem

An application may contain components whose initialization is expensive or whose use is conditional.

For example:

```js
class Application {
    constructor() {
        this.database = createDatabase();
        this.renderer = createRenderer();
        this.analytics = createAnalytics();
    }
}
```

If only the renderer is used during a particular execution path, eagerly creating all three resources performs
unnecessary work.

Lazy initialization changes the lifecycle so that a resource is created only when requested:

```js
class Application {
    #renderer;

    get renderer() {
        return this.#renderer ??= createRenderer();
    }
}
```

The renderer is not initialized when the `Application` instance is constructed. It is initialized on the first access.

## Core Concept

Lazy initialization separates declaration of a resource from initialization of that resource.

The component initially holds an uninitialized state. When an operation requires the resource, initialization occurs.
The resulting value may then be stored so subsequent accesses reuse it.

The essential lifecycle is:

1. The resource is not initialized.
2. The application requests the resource.
3. Initialization is performed.
4. The initialized value is retained if reuse is intended.
5. Subsequent requests use the initialized value.

The pattern does not require caching in every implementation. A lazy operation can recompute its value on every access
if that is the intended semantic. When the result is retained after first initialization, lazy initialization overlaps
with memoization.

## Eager vs Lazy Initialization

Eager initialization performs work immediately:

```js
const configuration = loadConfiguration();
```

Lazy initialization defers it:

```js
let configuration;

function getConfiguration() {
    return configuration ??= loadConfiguration();
}
```

The eager version guarantees that initialization occurs immediately.

The lazy version guarantees only that initialization occurs before the first successful use.

This difference affects startup time, failure timing, resource lifetime, observability, and memory consumption.

## Basic Function-Based Implementation

A simple JavaScript implementation uses a closure:

```js
function createLazy(factory) {
    let initialized = false;
    let value;

    return function get() {
        if (!initialized) {
            value = factory();
            initialized = true;
        }

        return value;
    };
}
```

Usage:

```js
const getDatabase = createLazy(() => createDatabaseConnection());

const database = getDatabase();
```

The closure keeps the initialization state private.

This implementation also correctly distinguishes between “not initialized” and an initialized value that happens to be
`undefined`.

## Nullish Assignment

When `undefined` or `null` cannot be legitimate initialized values, JavaScript provides a concise form:

```js
let connection;

function getConnection() {
    return connection ??= createConnection();
}
```

This is convenient but should not be used when `undefined` or `null` are valid initialization results.

For example:

```js
let result;

function getResult() {
    return result ??= computeResult();
}
```

If `computeResult()` legitimately returns `undefined`, subsequent calls will execute it again.

An explicit initialization flag avoids that ambiguity:

```js
let initialized = false;
let result;

function getResult() {
    if (!initialized) {
        result = computeResult();
        initialized = true;
    }

    return result;
}
```

## Lazy Class Properties

A class can lazily initialize private state:

```js
class ReportService {
    #renderer;

    get renderer() {
        if (this.#renderer === undefined) {
            this.#renderer = createRenderer();
        }

        return this.#renderer;
    }
}
```

The resource belongs to the instance and is created only when accessed.

Using a private field prevents external code from directly manipulating the initialization state.

## Lazy Getters

A getter provides a natural property-oriented API:

```js
class User {
    #profile;

    get profile() {
        return this.#profile ??= loadProfile();
    }
}
```

The caller sees a property:

```js
user.profile;
```

while the implementation performs deferred initialization.

Getters should be used carefully when accessing the property performs expensive or observable work. Property syntax can
imply that the operation is cheap and side-effect-free.

For expensive initialization, an explicit method such as `getProfile()` may communicate the lifecycle more clearly.

## Lazy Object Creation

Lazy initialization is often used for expensive objects:

```js
class Application {
    #logger;

    getLogger() {
        if (!this.#logger) {
            this.#logger = createLogger();
        }

        return this.#logger;
    }
}
```

This is useful when the object is required only on certain execution paths.

The factory should normally be deterministic with respect to the initialization context unless varying initialization is
explicitly intended.

## Lazy Collections

Large collections can also be initialized lazily:

```js
class Registry {
    #entries;

    get entries() {
        return this.#entries ??= new Map();
    }
}
```

An empty collection does not need to be allocated until it is actually used.

This is useful when many instances exist but only a small proportion require the collection.

## Lazy State

The resource being initialized does not have to be an external resource.

It can be derived state:

```js
class Document {
    #text;
    #tokens;

    constructor(text) {
        this.#text = text;
    }

    get tokens() {
        return this.#tokens ??= tokenize(this.#text);
    }
}
```

Tokenization is deferred until tokens are requested.

This overlaps with memoization because the computed result is retained.

## Lazy Computation

A lazy computation can defer work until its result is required:

```js
function createLazyValue(compute) {
    let initialized = false;
    let value;

    return {
        get() {
            if (!initialized) {
                value = compute();
                initialized = true;
            }

            return value;
        }
    };
}
```

This abstraction is useful when the computation is expensive and may never be needed.

The computation should not be considered lazy merely because it is wrapped in a function. The function must represent
deferred execution as part of the intended lifecycle.

## Lazy Initialization vs Lazy Evaluation

Lazy initialization usually refers to delaying creation or initialization of a particular resource.

Lazy evaluation is a broader computational strategy in which expressions are evaluated only when their values are
required.

For example, a lazy sequence may defer each element independently:

```js
function* numbers() {
    let value = 0;

    while (true) {
        yield value++;
    }
}
```

That is lazy evaluation rather than simply initializing one resource later.

The two concepts can overlap, but they should not be treated as identical.

## Lazy Initialization vs Memoization

Memoization caches the result of a computation according to its inputs.

Lazy initialization usually initializes a resource once for a particular owner or lifecycle.

For example:

```js
class Service {
    #client;

    getClient() {
        return this.#client ??= createClient();
    }
}
```

This is lazy initialization because the service's client is initialized on first use.

By contrast:

```js
const memoized = memoize(calculate);
```

may maintain different cached results for many different inputs.

Memoization is about result reuse. Lazy initialization is about deferred initialization.

## Lazy Initialization vs Caching

Caching retains values so they can be reused later.

Lazy initialization may retain the initialized value, but its defining concern is delaying initialization until it is
needed.

A cache normally has lookup, invalidation, eviction, or freshness semantics.

A lazily initialized resource often has a much simpler lifecycle: uninitialized followed by initialized.

If invalidation and replacement become central concerns, the design is increasingly a cache or resource-management
abstraction rather than simple lazy initialization.

## Lazy Initialization vs Lazy Loading

Lazy loading defers loading something from an external source or separate deployment artifact.

Examples include:

```js
const module = await import("./editor.js");
```

or loading an image only when required.

Lazy initialization does not necessarily involve loading anything. The resource may already be available in the program
and simply not yet initialized.

Dynamic `import()` can therefore implement lazy loading, while the creation of an object after that module has loaded
can separately be lazy initialization.

## Lazy Initialization vs Dynamic Import

Dynamic import:

```js
const module = await import("./feature.js");
```

defers module loading.

Lazy initialization:

```js
let feature;

async function getFeature() {
    return feature ??= createFeature();
}
```

defers creation.

They can be combined:

```js
let feature;

async function getFeature() {
    if (!feature) {
        const {Feature} = await import("./feature.js");
        feature = new Feature();
    }

    return feature;
}
```

The module and the object are both initialized lazily, but they represent separate lifecycle decisions.

## Lazy Module Initialization

ES modules execute their module initialization as part of module loading.

Application-level resources exported by a module can still be initialized lazily:

```js
let database;

export function getDatabase() {
    return database ??= createDatabase();
}
```

The module itself is loaded eagerly when imported, but the database resource is not created until `getDatabase()` is
called.

This distinction is important because module loading and resource initialization are separate lifecycle events.

## Module-Level Lazy State

Module scope naturally provides a private location for lazy state:

```js
let client;

export function getClient() {
    return client ??= createClient();
}
```

All consumers of that module share the same lazily initialized value within the module instance.

This creates singleton-like behavior, but lazy initialization itself does not require singleton semantics.

A factory can instead create independent lazy resources:

```js
function createService() {
    let client;

    return {
        getClient() {
            return client ??= createClient();
        }
    };
}
```

Each service instance now has its own lazy lifecycle.

## Lazy Initialization and Singleton

A Singleton controls instance cardinality.

Lazy initialization controls initialization timing.

The two concerns can be combined:

```js
let instance;

export function getInstance() {
    return instance ??= createInstance();
}
```

This creates a lazily initialized singleton-like module resource.

However, not every lazily initialized object is a singleton. Instance-level lazy fields are common and have no global
uniqueness requirement.

## Lazy Initialization and Factory Functions

Factory Functions are particularly suitable for lazy initialization because the factory can be stored without invoking
it:

```js
function createLazyService(factory) {
    let service;

    return () => service ??= factory();
}
```

The factory represents how the object is created. The lazy wrapper controls when creation occurs.

These concerns can therefore be separated cleanly.

## Lazy Initialization and Dependency Injection

A dependency can itself be initialized lazily:

```js
class OrderService {
    #repository;

    constructor(repositoryFactory) {
        this.repositoryFactory = repositoryFactory;
    }

    getRepository() {
        return this.#repository ??=
            this.repositoryFactory();
    }
}
```

This can be useful when constructing the dependency is expensive.

However, lazy dependency creation can obscure lifecycle behavior if dependencies are expected to exist when the
consuming object is constructed.

Dependency Injection determines how a dependency is supplied. Lazy initialization determines when that supplied
dependency is instantiated or activated.

## Lazy Initialization and Dependency Containers

Dependency-injection containers frequently support lazy or scoped resolution.

Conceptually:

```js
const service = container.resolve("service");
```

may create the service only when resolution first occurs.

This is still lazy initialization even though the mechanism is implemented by a container.

The important architectural question is whether the lazy lifetime belongs to the container or to the consuming
component.

## Async Lazy Initialization

Initialization may itself be asynchronous:

```js
let connectionPromise;

function getConnection() {
    return connectionPromise ??= createConnection();
}
```

If `createConnection()` returns a promise, storing the promise rather than the eventual value ensures that concurrent
callers share the same initialization operation.

For example:

```js
async function createConnection() {
    await connectToServer();

    return createClient();
}
```

Then:

```js
const connectionPromise = getConnection();
const anotherConnectionPromise = getConnection();
```

can refer to the same in-progress initialization.

This is often preferable to allowing every concurrent caller to initiate a separate connection.

## Promise Memoization During Initialization

An asynchronous lazy resource should generally cache the in-flight promise when initialization must happen only once.

A naive implementation can be incorrect:

```js
let connection;

async function getConnection() {
    if (!connection) {
        connection = await createConnection();
    }

    return connection;
}
```

Two callers can enter the initialization branch before the first initialization has completed.

Storing the promise avoids that race:

```js
let connectionPromise;

async function getConnection() {
    return connectionPromise ??= createConnection();
}
```

The promise itself represents the initialization operation.

## Failed Initialization

Failure semantics must be defined explicitly.

Consider:

```js
let resourcePromise;

function getResource() {
    return resourcePromise ??= createResource();
}
```

If `createResource()` rejects, `resourcePromise` remains a rejected promise.

Subsequent calls therefore receive the same failure.

This may be desirable when initialization failure is permanent.

If failure should permit retry, the rejected promise must be cleared:

```js
let resourcePromise;

async function getResource() {
    if (!resourcePromise) {
        resourcePromise = createResource().catch(error => {
            resourcePromise = undefined;
            throw error;
        });
    }

    return resourcePromise;
}
```

Retry behavior is a separate lifecycle policy and should not be introduced accidentally.

## Initialization State Machine

A robust asynchronous lazy resource may conceptually have states such as:

* uninitialized;
* initializing;
* initialized;
* failed;
* disposed.

These states matter when initialization can fail, be cancelled, or be retried.

Simple synchronous lazy initialization can often represent the lifecycle with a single flag or field. Asynchronous
resources usually require more explicit state management.

## Cancellation

Lazy initialization can interact with cancellation.

Suppose an asynchronous resource is requested with an `AbortSignal`:

```js
async function createResource(signal) {
    return connect({
        signal
    });
}
```

If the initialization operation is shared by multiple callers, cancellation semantics become difficult.

One caller cancelling its request should not necessarily cancel initialization for every other caller waiting for the
same resource.

Shared lazy initialization therefore requires a clear ownership model for cancellation.

## Timeouts

A lazy resource can remain uninitialized indefinitely, which is normally harmless for ordinary objects.

For external resources, initialization can hang.

A lazy asynchronous initialization mechanism may therefore require a timeout:

```js
async function createWithTimeout(signal) {
    return await connect({
        signal
    });
}
```

The exact timeout mechanism depends on the resource API.

Timeouts should be applied to the initialization operation rather than merely to the caller's local wait if the
underlying operation itself must be terminated.

## Resource Lifetime

Lazy initialization delays creation but does not necessarily shorten the lifetime of the resource.

A resource initialized on first use may remain alive until its owner is destroyed.

For example:

```js
class Application {
    #database;

    get database() {
        return this.#database ??= createDatabase();
    }
}
```

Once initialized, the database remains associated with the application instance.

If the resource requires explicit cleanup, lazy initialization should be paired with disposal:

```js
class Application {
    #database;

    get database() {
        return this.#database ??= createDatabase();
    }

    async dispose() {
        await this.#database?.close();
        this.#database = undefined;
    }
}
```

Lazy initialization does not replace resource lifecycle management.

## Disposal Before Initialization

A well-designed lazy component should handle disposal even when initialization never occurred.

```js
async
dispose()
{
    await this.#resource?.close();
}
```

This makes disposal idempotent with respect to the uninitialized state.

For asynchronous initialization, disposal may also need to wait for an in-progress initialization before closing the
resulting resource.

## Reinitialization

After disposal, the component may either:

* remain permanently disposed;
* permit reinitialization;
* create a new resource on the next access.

These are different lifecycle models.

Allowing reinitialization can be useful for restartable components, but it requires explicit state management to prevent
use-after-dispose behavior.

## Getters and Hidden Work

Lazy getters can make expensive work appear inexpensive:

```js
get
analytics()
{
    return this.#analytics ??= createAnalytics();
}
```

A caller cannot tell from the syntax whether `analytics` is a simple field or an expensive initialization operation.

This can create performance surprises.

Use a getter when property semantics remain appropriate. Use an explicit method when the initialization cost, side
effects, failure potential, or asynchronous nature should be visible in the API.

## Lazy Initialization and Side Effects

Initialization may have observable effects:

```js
function createClient() {
    console.log("Connecting...");
    return connect();
}
```

Moving this work from construction to first access changes when the side effect occurs.

This can affect:

* logging;
* network connections;
* authentication;
* metrics;
* startup validation;
* error handling;
* resource allocation.

Lazy initialization is therefore a semantic lifecycle change, not merely a performance optimization.

## Error Timing

Eager initialization can fail during application startup:

```js
const database = createDatabase();
```

Lazy initialization can defer the same failure:

```js
let database;

function getDatabase() {
    return database ??= createDatabase();
}
```

The application may now start successfully and fail later when the database is first requested.

This can be desirable when the resource is optional. It can be undesirable when startup should validate critical
infrastructure immediately.

The failure boundary must therefore be part of the design decision.

## Configuration Validation

Lazy initialization can also delay configuration validation.

Suppose:

```js
function createClient(config) {
    if (!config.endpoint) {
        throw new Error("Missing endpoint");
    }

    return new Client(config);
}
```

If the client is initialized lazily, the configuration error may not appear until the client is first used.

For mandatory infrastructure, eager validation combined with lazy resource creation may be preferable.

## Performance

Lazy initialization can improve startup performance by avoiding work that may never be required.

It can also increase latency at the point of first use because initialization has been moved into the request path.

For example:

```js
application.start();
```

may become faster while:

```js
application.render();
```

becomes slower on its first invocation.

This is a latency-shifting optimization rather than necessarily a reduction in total work.

## Startup vs First-Use Latency

The performance trade-off can be described as:

**Eager initialization pays the cost during startup; lazy initialization pays the cost when the resource is first
needed.**

The correct choice depends on whether startup latency or first-use latency is more important.

Applications with interactive startup paths often benefit from lazy initialization of optional features.
Latency-sensitive first-use operations may instead prefer prewarming or eager initialization.

## Prewarming

Lazy systems can support explicit prewarming:

```js
await service.initialize();
```

or:

```js
service.preload();
```

This allows the application to initialize a resource at a strategically chosen time rather than strictly at first use.

Prewarming is useful when the application knows that a resource will soon be needed but does not want to perform all
initialization during startup.

## Partial Initialization

A component can contain several independently lazy resources:

```js
class Application {
    #renderer;
    #analytics;
    #search;

    get renderer() {
        return this.#renderer ??= createRenderer();
    }

    get analytics() {
        return this.#analytics ??= createAnalytics();
    }

    get search() {
        return this.#search ??= createSearch();
    }
}
```

This can be preferable to lazily initializing the entire application because each resource has an independent lifecycle.

However, excessive lazy fields can make the lifecycle of the object difficult to understand.

## Lazy Initialization of Optional Features

Lazy initialization is particularly appropriate when a feature is optional:

```js
async function getEditor() {
    const {Editor} = await import("./editor.js");

    return new Editor();
}
```

Here both module loading and object creation can be deferred until the feature is actually requested.

This is common for:

* administrative interfaces;
* advanced editors;
* reporting;
* visualization;
* optional integrations;
* rarely used services.

## Lazy Initialization and Bundling

Bundling determines how source modules become deployment artifacts.

Lazy initialization determines when a resource is created.

They can work together.

A bundle may contain a module whose exported service is initialized lazily:

```js
let service;

export function getService() {
    return service ??= createService();
}
```

Alternatively, dynamic import can defer loading the module itself:

```js
const {createService} = await import("./service.js");
```

The first delays initialization. The second delays module loading.

This distinction is important when reasoning about startup cost and deployment behavior.

## Lazy Initialization and Object Pools

An Object Pool manages reusable instances.

Lazy initialization can be used inside a pool to delay creation until the pool actually requires additional capacity.

For example, a pool can begin with zero objects and create objects only as demand occurs.

The pool controls reuse and availability; lazy initialization controls when the first instances are created.

These are complementary patterns.

## Lazy Initialization and Flyweight

Flyweight shares intrinsic state among multiple logical objects.

Lazy initialization may be used by a Flyweight Factory to defer creation of a shared flyweight until that intrinsic
state is first requested.

The patterns solve different concerns.

Flyweight controls state sharing. Lazy initialization controls creation timing.

## Lazy Initialization and Proxy

A Proxy can defer creation of its target:

```js
function createLazyProxy(factory) {
    let target;

    return new Proxy({}, {
        get(_, property) {
            target ??= factory();
            return target[property];
        }
    });
}
```

This combines Proxy and Lazy Initialization.

The Proxy controls access to the target. Lazy initialization controls when the target is created.

A Proxy is not required for lazy initialization.

## Lazy Initialization and Factory Functions

A factory can represent the deferred creation operation:

```js
const createReport = () => new Report();

let report;

function getReport() {
    return report ??= createReport();
}
```

This keeps construction separate from initialization timing.

Factory Functions and Lazy Initialization are therefore complementary rather than alternative patterns.

## Testing

Lazy initialization changes when dependencies and side effects occur, so tests should explicitly cover lifecycle
behavior.

Important cases include:

* resource is not initialized before first use;
* first use initializes the resource;
* subsequent use reuses it;
* factory executes exactly once when required;
* initialization failure is handled correctly;
* failed initialization is retried or retained according to policy;
* disposal works before initialization;
* disposal works after initialization;
* asynchronous concurrent callers share initialization when intended;
* cancellation behaves correctly;
* first-use latency is acceptable.

Tests should verify observable lifecycle behavior rather than merely checking that a field eventually contains an
object.

## Mocking Lazy Resources

A lazily initialized dependency can be difficult to test if the factory is hidden inside the implementation.

Dependency Injection can make the factory explicit:

```js
class Service {
    #client;

    constructor(clientFactory) {
        this.clientFactory = clientFactory;
    }

    getClient() {
        return this.#client ??= this.clientFactory();
    }
}
```

Tests can then provide a controlled factory:

```js
let calls = 0;

const service = new Service(() => {
    calls++;
    return fakeClient;
});
```

This allows tests to verify that initialization happens exactly when intended.

## Common Misuse

A common misuse is making every dependency lazy. This can make object lifecycle unpredictable and move failures away
from the location where configuration errors should be detected.

Another misuse is using lazy initialization to hide expensive operations behind property access.

Another is caching a promise indefinitely after initialization failure when retry is actually required.

Another is failing to dispose of a lazily created external resource.

Another is introducing complex lazy state when eager initialization would be simpler and the resource is always used.

## Hidden Control Flow

Lazy initialization creates control flow that is triggered indirectly by access.

For example:

```js
const client = service.client;
```

may actually:

1. allocate a resource;
2. perform network I/O;
3. initialize authentication;
4. throw an exception;
5. modify application state.

The API should make these semantics appropriate to the abstraction.

Lazy initialization is easiest to reason about when the initialization boundary is explicit and predictable.

## Over-Laziness

Overuse of lazy initialization can produce an application in which almost every component has an implicit initialization
state.

This can result in:

* complicated lifecycle reasoning;
* unpredictable first-use latency;
* deferred failures;
* hidden side effects;
* difficult debugging;
* difficult shutdown;
* complex asynchronous state.

Lazy initialization should therefore be applied selectively to resources whose delayed creation provides a meaningful
benefit.

## Refactoring Toward Lazy Initialization

A component can be refactored toward lazy initialization by:

1. Identify initialization work that is not required for every execution path.
2. Separate construction from resource creation.
3. Move creation into a dedicated factory or initialization function.
4. Add explicit initialized state where necessary.
5. Cache the initialized value when reuse is intended.
6. Define failure semantics.
7. Define disposal and reinitialization semantics.
8. Handle concurrent asynchronous initialization.
9. Measure startup and first-use latency.
10. Verify that the new failure timing is acceptable.

The refactoring should preserve the component's externally required invariants.

## Refactoring Away from Lazy Initialization

Lazy initialization should be removed when it creates more lifecycle complexity than value.

Eager initialization may be preferable when:

* the resource is always required;
* startup validation is important;
* deterministic initialization is required;
* first-use latency is unacceptable;
* initialization failures should prevent startup;
* the resource has a simple and cheap construction cost.

A simple eager field can often be easier to reason about than a lazily initialized field with multiple lifecycle states.

## Architectural Considerations

Lazy initialization is often useful at architectural boundaries where expensive infrastructure is optional or
conditionally used.

Examples include:

* database clients;
* telemetry systems;
* optional integrations;
* feature-specific services;
* large parsers;
* rendering engines;
* administrative capabilities.

However, core infrastructure that every request requires may gain little from being lazy if it will inevitably be
initialized immediately afterward.

The architectural question is therefore not simply whether initialization can be delayed, but whether delaying it
improves the system's lifecycle or deployment behavior.

## Benefits

Lazy initialization provides:

* reduced startup work;
* avoidance of unnecessary resource creation;
* reduced initial memory consumption;
* deferred expensive computation;
* conditional resource allocation;
* potential first-use sharing for asynchronous initialization;
* more flexible resource lifecycles;
* compatibility with lazy loading and code splitting.

Its greatest benefit occurs when initialization is expensive and a meaningful proportion of executions never require the
resource.

## Costs

Lazy initialization introduces:

* delayed failures;
* first-use latency;
* lifecycle state;
* hidden work behind access;
* concurrency concerns for asynchronous initialization;
* retry semantics;
* disposal complexity;
* more complicated testing;
* potentially less deterministic startup behavior.

The cost is particularly significant for resources with external side effects or complicated asynchronous lifecycles.

## Decision Criteria

Use Lazy Initialization when initialization is expensive, conditional, or otherwise beneficial to defer and the
resulting lifecycle can be clearly defined.

Prefer eager initialization when the resource is always required, startup validation is important, or first-use latency
is unacceptable.

Use lazy loading when the primary goal is deferring delivery of code or external resources.

Use memoization when the primary goal is reusing computed results across inputs.

Use caching when retention, invalidation, freshness, or eviction are central concerns.

Use an Object Pool when the primary concern is controlled reuse of multiple resource instances.

Use a Proxy only when access mediation is required in addition to deferred initialization.

Use Dependency Injection when the primary concern is controlling where dependencies come from rather than when they are
initialized.

## Summary

The Lazy Initialization Pattern defers creation, computation, or initialization until the resulting resource is actually
required.

JavaScript provides several natural implementations, including closures, private class fields, getters, module state,
factory functions, promises, and dynamic imports. The implementation mechanism is secondary to the lifecycle semantics:
the resource begins uninitialized and is initialized at a deliberate later point.

Lazy initialization is not synonymous with lazy loading, memoization, caching, or asynchronous programming. It can be
combined with all of them, but each addresses a different concern.

The principal trade-off is straightforward: **lazy initialization moves cost and potentially failure from startup to
first use**. It is most valuable when initialization is expensive and optional, and least valuable when the resource is
always needed or when deterministic startup behavior is more important than deferred work.

For asynchronous resources, the design must additionally define shared initialization, failure, retry, cancellation,
timeout, and disposal semantics. For ordinary synchronous objects, a simple private field or closure is often
sufficient.
