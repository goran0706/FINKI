# Singleton

Singleton is a creational design pattern that restricts a class or component to a single instance within a defined scope
and provides a controlled way to access that instance.

The defining characteristic of Singleton is not merely global accessibility. It is the combination of controlled
instance cardinality and controlled access to that instance.

The scope of "single" must be explicitly understood. A Singleton may be unique within a process, module graph,
application container, worker, execution context, or another defined boundary. It is not automatically a single instance
across an entire distributed system.

## Intent

The intent of Singleton is to ensure that a particular component has at most one instance within its defined scope and
that consumers use a consistent access point to that instance.

Typical examples include components representing:

* application-wide configuration
* logging infrastructure
* metrics registries
* resource managers
* coordination services
* caches with intentionally centralized ownership
* factories or registries whose state must be shared

Singleton is primarily about controlling instance ownership and cardinality.

## The Singleton Constraint

A Singleton requires two properties:

1. The instance cannot be freely created by arbitrary consumers.
2. Access to the instance is controlled so that repeated access returns the same instance within the defined scope.

Conceptually:

```javascript
const first = Singleton.getInstance();
const second = Singleton.getInstance();

console.log(first === second); // true
```

The important invariant is:

```text
first === second
```

The exact implementation used to enforce this invariant depends on the language and architectural environment.

## Class-Based Implementation

A traditional implementation uses a private constructor and a static instance:

```javascript
class Singleton {
    static #instance;

    constructor() {
        if (Singleton.#instance) {
            throw new Error("Use Singleton.getInstance()");
        }

        Singleton.#instance = this;
    }

    static getInstance() {
        if (!Singleton.#instance) {
            Singleton.#instance = new Singleton();
        }

        return Singleton.#instance;
    }
}
```

Usage:

```javascript
const first = Singleton.getInstance();
const second = Singleton.getInstance();

console.log(first === second); // true
```

The private static field stores the single instance.

However, JavaScript provides simpler mechanisms for many Singleton use cases.

## JavaScript Modules as Singletons

ES modules are naturally suitable for Singleton-like module ownership.

Consider:

```javascript
class Configuration {
    constructor() {
        this.environment = "production";
    }
}

export const configuration = new Configuration();
```

Consumers import the same exported binding:

```javascript
import {configuration} from "./configuration.js";
```

The module itself owns the instance.

A separate `getInstance()` method is often unnecessary because the module system already provides controlled
initialization and sharing.

This is one of the most important differences between traditional GoF Singleton implementations and idiomatic
JavaScript.

## Module-Level Singleton

A module can simply create and export one object:

```javascript
const registry = new Map();

export function register(name, value) {
    registry.set(name, value);
}

export function resolve(name) {
    return registry.get(name);
}
```

There is only one `registry` within the relevant module instance.

Consumers cannot directly instantiate another registry through the module's public API.

This often provides the same architectural result as a class-based Singleton with less ceremony.

## Singleton Scope

Singleton does not mean "one instance everywhere."

The relevant scope may be:

* one module instance
* one application process
* one worker
* one execution context
* one dependency-injection container
* one test environment
* one request scope
* one tenant scope

For example, a Node.js application may have one module instance within a process while another process has its own
independent instance.

Therefore, Singleton should always be documented in terms of its ownership scope.

## Singleton and Distributed Systems

A Singleton implemented inside one process is not a distributed Singleton.

For example:

```javascript
const cache = new Map();
```

may produce one cache per application process.

If an application runs five processes, there can be five independent caches.

Likewise, deploying an application across multiple servers produces multiple Singleton instances.

If global uniqueness across processes is required, an external coordination or storage mechanism is necessary.

Examples include:

* distributed locks
* centralized databases
* distributed caches
* coordination services
* external configuration stores

A process-local Singleton cannot enforce distributed uniqueness.

## Singleton and JavaScript Modules

The JavaScript module system often makes explicit Singleton classes unnecessary.

Instead of:

```javascript
class Logger {
    static #instance;

    static getInstance() {
        if (!Logger.#instance) {
            Logger.#instance = new Logger();
        }

        return Logger.#instance;
    }
}
```

a module can expose one instance:

```javascript
class Logger {
    log(message) {
        console.log(message);
    }
}

export const logger = new Logger();
```

Consumers use:

```javascript
import {logger} from "./logger.js";

logger.log("Application started");
```

The module boundary provides the ownership boundary.

This is generally simpler and more idiomatic when a process-wide shared instance is actually required.

## Singleton and Private Constructors

JavaScript classes do not historically provide the same constructor visibility model found in languages such as Java or
C#.

Modern JavaScript can still prevent direct construction through module encapsulation and private implementation details.

For example:

```javascript
class Database {
    #constructorToken;

    constructor(token) {
        if (token !== Database.#constructorToken) {
            throw new Error("Use Database.getInstance()");
        }
    }

    static #constructorToken = Symbol();

    static #instance;

    static getInstance() {
        if (!Database.#instance) {
            Database.#instance = new Database(
                Database.#constructorToken
            );
        }

        return Database.#instance;
    }
}
```

This is possible, but it is often unnecessary when a module can simply export the instance.

## Lazy Initialization

A Singleton can be initialized lazily:

```javascript
class Service {
    static #instance;

    static getInstance() {
        if (!Service.#instance) {
            Service.#instance = new Service();
        }

        return Service.#instance;
    }
}
```

The instance is created only when first requested.

Lazy initialization can reduce startup cost when the component is not always required.

However, lazy initialization can also make initialization failures occur later and less predictably.

## Eager Initialization

A Singleton can instead be initialized when its module is loaded:

```javascript
class Service {
    start() {
        // ...
    }
}

export const service = new Service();
```

Eager initialization makes construction deterministic relative to module initialization.

It is appropriate when the component is always required and construction is inexpensive or intentionally part of
application startup.

## Singleton Initialization and Side Effects

Module-level Singleton construction can execute side effects during module evaluation:

```javascript
export const connection = new DatabaseConnection();
```

If construction opens a network connection or performs expensive I/O, merely importing the module can trigger that
behavior.

This couples dependency loading with resource initialization.

In such cases, explicit lifecycle management may be preferable:

```javascript
class Database {
    async connect() {
        // ...
    }

    async close() {
        // ...
    }
}

export const database = new Database();
```

The module owns the instance while the application controls when it is initialized and shut down.

## Singleton Lifecycle

A Singleton does not necessarily have an eternal lifetime.

A production component may need:

```javascript
await service.start();
```

and:

```javascript
await service.stop();
```

For example:

```javascript
class Metrics {
    start() {
        // Start collection.
    }

    stop() {
        // Release resources.
    }
}

export const metrics = new Metrics();
```

The Singleton controls instance cardinality, while explicit lifecycle methods control operational state.

These concerns should not be conflated.

## Singleton State

Singletons are often mutable:

```javascript
class Configuration {
    set(key, value) {
        this[key] = value;
    }
}
```

This means every consumer can potentially observe changes made by every other consumer.

Shared mutable state is one of the primary costs of Singleton.

For example:

```javascript
configuration.set("timeout", 1000);
```

may affect unrelated components that use the same configuration instance.

The more mutable state a Singleton exposes, the stronger the coupling between its consumers.

## Immutable Singleton

A Singleton can expose immutable state:

```javascript
class Configuration {
    constructor(values) {
        this.values = Object.freeze({
            ...values
        });
    }

    get(key) {
        return this.values[key];
    }
}

export const configuration = new Configuration({
    environment: "production",
    timeout: 5000
});
```

Consumers can share the same configuration without being able to mutate its internal values directly.

Immutability reduces one of the major risks associated with global shared state.

## Singleton and Dependency Injection

Singleton and dependency injection solve different problems.

Singleton controls instance cardinality.

Dependency injection controls how dependencies are supplied.

A dependency-injection container can manage a Singleton lifetime:

```javascript
container.register("logger", {
    useClass: Logger,
    lifetime: "singleton"
});
```

The container owns the instance rather than the class itself.

This is often preferable because the application's composition root controls lifecycle and scope.

A class does not need to know that it is globally unique.

## Singleton Lifetime vs Singleton Pattern

A dependency-injection container may provide singleton lifetime without implementing the traditional GoF Singleton
pattern.

For example:

```javascript
container.register(Logger, {
    lifetime: "singleton"
});
```

The container guarantees one `Logger` instance within the container scope.

The `Logger` class itself remains ordinary:

```javascript
class Logger {
    log(message) {
        console.log(message);
    }
}
```

This distinction is architecturally important.

Singleton lifetime is a lifecycle policy.

Singleton pattern is an object-design mechanism that embeds or centralizes the uniqueness constraint.

The former is often more flexible.

## Singleton and Global State

Singleton is frequently criticized because it can become disguised global state.

For example:

```javascript
export const applicationState = {
    users: [],
    configuration: {},
    currentRequest: null
};
```

Every consumer can access and mutate the same state.

This creates implicit dependencies.

A component may appear to have no external dependencies:

```javascript
class Service {
    execute() {
        applicationState.currentRequest = this.getRequest();
    }
}
```

but its behavior depends on globally shared mutable state.

This makes dependencies less visible and can make the system harder to reason about.

## Singleton and Coupling

Singleton introduces coupling through shared ownership.

A consumer that directly accesses:

```javascript
Logger.getInstance()
```

is coupled to:

* the Singleton's access mechanism
* its concrete type
* its global lifetime
* its shared state
* its initialization behavior

Dependency injection can reduce this coupling:

```javascript
class Service {
    constructor(logger) {
        this.logger = logger;
    }
}
```

The service now depends on a logger abstraction rather than directly retrieving a global Singleton.

## Singleton and Testing

Singletons can make tests harder to isolate.

Consider:

```javascript
const service = Service.getInstance();

service.configure({
    mode: "test"
});
```

A later test may receive the same mutated instance.

Test order can therefore affect behavior.

This is especially problematic when the Singleton contains:

* mutable configuration
* caches
* registries
* counters
* subscriptions
* timers
* mock state
* request-specific state

Tests should have an explicit strategy for resetting or replacing Singleton state when isolation is required.

## Resettable Singleton

A Singleton can expose a reset operation for tests:

```javascript
class Service {
    static #instance;

    static getInstance() {
        if (!Service.#instance) {
            Service.#instance = new Service();
        }

        return Service.#instance;
    }

    static resetForTesting() {
        Service.#instance = undefined;
    }
}
```

This should generally remain test infrastructure rather than becoming part of the production API.

A better architectural solution is often to avoid embedding Singleton access into application components and let
dependency injection control the lifetime.

## Singleton and Test Containers

Dependency injection can provide a fresh singleton scope per test:

```javascript
const container = createContainer();

container.register(Service, {
    lifetime: "singleton"
});
```

Each test can create its own container.

The service is still singleton-scoped within that test's container but does not leak state into other tests.

This provides the benefits of shared identity while preserving test isolation.

## Singleton and Concurrency

JavaScript's execution model affects Singleton initialization.

Within a single JavaScript execution context, synchronous initialization such as:

```javascript
if (!instance) {
    instance = new Service();
}
```

does not normally encounter the same thread-level race condition found in multithreaded environments because JavaScript
executes synchronous code sequentially within an execution context.

Asynchronous initialization introduces a different problem.

Consider:

```javascript
static
async
getInstance()
{
    if (!this.#instance) {
        this.#instance = await createService();
    }

    return this.#instance;
}
```

Two callers can invoke the method before initialization completes.

This can result in multiple initialization attempts unless the initialization promise itself is shared.

## Promise-Based Initialization

A safer asynchronous Singleton can cache the initialization promise:

```javascript
class Service {
    static #instancePromise;

    static async getInstance() {
        if (!Service.#instancePromise) {
            Service.#instancePromise = createService();
        }

        return Service.#instancePromise;
    }
}
```

All concurrent callers await the same initialization operation.

The distinction is important:

```javascript
instance
```

represents the initialized object, while:

```javascript
instancePromise
```

represents the shared initialization process.

For asynchronous Singleton initialization, the latter is often the synchronization primitive that enforces uniqueness.

## Failed Initialization

Asynchronous initialization also requires a policy for failure.

Consider:

```javascript
Service.#instancePromise = createService();
```

If `createService()` rejects, the rejected promise remains stored unless explicitly replaced.

One strategy is to clear the cached promise:

```javascript
static
async
getInstance()
{
    if (!Service.#instancePromise) {
        Service.#instancePromise = createService()
            .catch(error => {
                Service.#instancePromise = undefined;
                throw error;
            });
    }

    return Service.#instancePromise;
}
```

This allows a later attempt to initialize the Singleton again.

Whether retrying is correct depends on the component's lifecycle semantics.

## Singleton and Worker Isolation

A Singleton is normally scoped to the execution context in which it is created.

If an application uses multiple workers:

```text
Worker A
Worker B
Worker C
```

each worker can have its own module instance and therefore its own Singleton instance.

A Singleton therefore cannot automatically coordinate mutable state across workers.

If cross-worker uniqueness is required, shared or external coordination is necessary.

## Singleton and Server Processes

The same principle applies to server processes.

Running:

```bash
node server.js
```

once can result in one process-local Singleton.

Running multiple processes:

```bash
node server.js
node server.js
node server.js
```

creates separate process-local instances.

This is why Singleton should never be used as the mechanism for distributed coordination.

## Singleton and Caching

A Singleton cache and a cache with singleton lifetime are not necessarily the same architectural decision.

A cache may be shared because cache consistency or memory ownership requires centralized state.

But a cache can also be instantiated per request, per tenant, per service, or per process.

The decision should be based on cache scope and consistency requirements rather than the assumption that caches should
always be Singletons.

## Singleton and Factory

A Singleton can be used to hold a factory:

```javascript
export const reportFactory = new ReportFactory();
```

However, this does not make the factory pattern itself a Singleton.

The factory's creation responsibility and its lifecycle are separate concerns.

A dependency-injection container can provide one factory instance without requiring the factory class to enforce its own
Singleton behavior.

## Singleton and Object Pool

A pool can itself be singleton-scoped:

```javascript
export const connectionPool = new ConnectionPool({
    maxSize: 20
});
```

This means one pool manages connections within the module's scope.

The pooled connections are not Singletons. They are multiple reusable resources managed by one pool.

Singleton and Object Pool therefore operate at different levels:

* Singleton controls one manager instance.
* Object Pool controls multiple reusable resource instances.

## Singleton and Prototype

Prototype creates new objects from existing objects.

Singleton restricts the number of instances.

The two patterns can coexist, but they solve opposite lifecycle concerns.

A Singleton could hold a prototype registry:

```javascript
export const registry = new PrototypeRegistry();
```

The registry is unique while the products created from its prototypes are not.

## Singleton and Facade

A Singleton can expose a centralized Facade:

```javascript
export const application = new ApplicationFacade();
```

This can provide convenient access to several subsystems.

However, combining Facade and Singleton can make the facade a global service locator.

The design should therefore distinguish convenience of access from legitimate requirements for centralized ownership.

## Singleton and Service Locator

Singleton and Service Locator are often combined:

```javascript
ServiceLocator.getInstance().resolve("logger");
```

This introduces two global mechanisms:

* Singleton controls the locator's instance.
* Service Locator hides dependency resolution.

The resulting design can make dependencies invisible.

Direct dependency injection is usually preferable when components need explicit, testable dependencies.

## Singleton and Configuration

Application configuration is one of the more defensible Singleton use cases when configuration is intentionally
process-wide and immutable after initialization.

For example:

```javascript
export const configuration = Object.freeze({
    environment: "production",
    apiUrl: "https://example.com"
});
```

Every consumer sees the same configuration.

However, configuration should not automatically be global if different tenants, requests, or components require
different configuration scopes.

The correct scope is determined by the architecture.

## Singleton and Logging

Logging infrastructure is another common candidate:

```javascript
export const logger = new Logger();
```

The shared instance can centralize:

* log formatting
* output destinations
* log levels
* structured metadata
* transports

Even here, Singleton lifetime should not be confused with global state. A logger can be singleton-scoped while exposing
a narrow immutable or controlled interface.

## Singleton and Registries

A registry may legitimately need centralized ownership:

```javascript
export const registry = new Registry();
```

Examples include:

* plugin registries
* serializer registries
* command registries
* metrics registries

The important question is whether the registry is conceptually global within its intended scope.

If different subsystems need independent registries, forcing one Singleton creates unnecessary coupling.

## Singleton and Resource Managers

A resource manager may be singleton-scoped when the application requires one centralized authority over a bounded
resource.

For example:

```javascript
export const connectionPool = new ConnectionPool({
    maxSize: 20
});
```

Having multiple independent pools could accidentally exceed the intended external resource limit.

In this case, singleton scope can be part of the architecture rather than merely a convenience.

## Singleton and Global Event Buses

An event bus is often implemented as a Singleton:

```javascript
export const eventBus = new EventBus();
```

This can provide application-wide communication.

However, global event buses create implicit coupling between producers and consumers.

They can make event ownership, lifecycle, and dependency relationships difficult to trace.

A scoped event bus is often preferable when communication does not actually need to cross the entire application.

## Singleton and Encapsulation

A Singleton should expose the smallest interface required by its consumers.

For example:

```javascript
class Metrics {
    increment(name) {
        // ...
    }
}
```

is preferable to exposing internal mutable structures:

```javascript
export const metrics = {
    counters: new Map()
};
```

Encapsulation limits the ways consumers can interfere with shared state.

## Singleton and Immutability

Immutability significantly reduces Singleton risks.

For configuration:

```javascript
export const configuration = Object.freeze({
    environment: "production",
    timeout: 5000
});
```

Consumers can safely share the same object because they cannot intentionally mutate its top-level properties.

Nested structures may also require deep immutability or defensive copies depending on the data model.

## Singleton and Ownership

The most important architectural question is not "How do I implement Singleton?"

It is:

**Who owns this instance, and why must that ownership be unique?**

If there is no clear answer, Singleton is probably being used as a convenience mechanism rather than because the
architecture requires singleton cardinality.

Good Singleton candidates have an explicit ownership reason.

## Singleton and Scope

A useful way to evaluate a Singleton is to define its scope before implementing it.

For example:

```javascript
Application
    └── Logger
```

should not be interpreted as a global rule.

Instead, the architecture should state something such as:

"The application owns one logger instance per process."

Similarly:

"The dependency-injection container owns one database pool instance per application container."

The scope determines whether Singleton is actually appropriate.

## When Singleton Is Appropriate

Singleton is appropriate when:

* exactly one instance is required within a clearly defined scope
* multiple instances would violate a resource or ownership invariant
* the instance represents centralized infrastructure
* shared state is intentional
* lifecycle ownership is centralized
* the scope is stable and well understood

Examples include process-local resource managers, application-wide immutable configuration, and intentionally
centralized registries.

## When Singleton Is Inappropriate

Singleton is usually inappropriate when:

* the only reason is convenience of access
* the object contains request-specific state
* different tests require independent instances
* multiple configurations are legitimate
* different tenants require independent state
* the object has no real uniqueness requirement
* dependencies should be explicit
* global mutable state is causing coupling

If the requirement is simply "many components need this dependency," dependency injection is generally a better
solution.

## Common Misuse

A common misuse is treating Singleton as a synonym for global variable.

For example:

```javascript
export const state = {};
```

may technically provide one shared object, but that alone does not establish a meaningful Singleton design.

Another misuse is making every service a Singleton because creating multiple instances appears unnecessary.

Instance count should follow ownership requirements rather than convenience.

A further misuse is using Singleton for distributed coordination.

Process-local Singleton state cannot guarantee uniqueness across multiple processes, servers, workers, or containers.

## Refactoring Toward Singleton

A Singleton can be introduced when multiple components independently create a resource that must actually have one
owner.

Before:

```javascript
const pool = new ConnectionPool({
    maxSize: 20
});
```

appearing in several modules can result in several independent pools.

If the architecture requires one process-wide pool, ownership can be centralized:

```javascript
export const connectionPool = new ConnectionPool({
    maxSize: 20
});
```

Consumers then share the same pool.

The important refactoring is not merely replacing constructors with a global accessor. It is establishing one legitimate
ownership boundary.

## Refactoring Away from Singleton

A Singleton should be replaced when uniqueness is no longer an actual requirement.

Before:

```javascript
const logger = Logger.getInstance();
```

a component can instead receive its dependency:

```javascript
class Service {
    constructor(logger) {
        this.logger = logger;
    }
}
```

The composition root can still provide one logger instance:

```javascript
const logger = new Logger();

const service = new Service(logger);
```

The application retains one logger while removing the Singleton pattern from the `Logger` class.

This separates lifecycle policy from implementation.

## Dependency Injection as an Alternative

Dependency injection often provides the same practical benefit as Singleton while preserving greater flexibility.

Instead of:

```javascript
class Service {
    execute() {
        Logger.getInstance().log("Executing");
    }
}
```

use:

```javascript
class Service {
    constructor(logger) {
        this.logger = logger;
    }

    execute() {
        this.logger.log("Executing");
    }
}
```

The composition root can decide whether `logger` is:

* singleton-scoped
* request-scoped
* test-scoped
* tenant-scoped
* transient

This makes lifecycle an architectural configuration rather than a hard-coded property of the class.

## Decision Criteria

| Situation                                     | Singleton suitability                    |
|-----------------------------------------------|------------------------------------------|
| Exactly one instance is an explicit invariant | Strong fit                               |
| One process-wide resource manager is required | Strong fit                               |
| Shared immutable configuration                | Strong fit                               |
| Centralized registry is intentionally unique  | Potentially strong fit                   |
| Need convenient global access                 | Poor justification                       |
| Need explicit dependencies                    | Prefer Dependency Injection              |
| Need different instances for tests            | Prefer scoped dependency injection       |
| State varies by request                       | Poor fit                                 |
| State varies by tenant                        | Poor fit unless tenant scope is explicit |
| Need uniqueness across processes              | Singleton is insufficient                |
| Need bounded reusable resources               | Consider Object Pool                     |
| Need object creation from templates           | Consider Prototype                       |
| Need object construction delegation           | Consider Factory Method                  |

## Benefits

Singleton can enforce a clear ownership invariant, prevent accidental duplication of scarce resources, centralize
lifecycle management, and provide one shared instance where that shared identity is genuinely required.

In JavaScript, module-level exports can provide these benefits with considerably less implementation complexity than a
traditional Singleton class.

## Costs

Singleton can introduce global coupling, hidden dependencies, shared mutable state, difficult test isolation, lifecycle
ambiguity, and incorrect assumptions about application-wide uniqueness.

It can also make architectural scope less visible. A process-local Singleton may appear global even though multiple
application processes each contain their own instance.

The pattern therefore requires explicit scope and ownership semantics.

## Summary

Singleton restricts an object's instance cardinality to one within a defined scope and provides controlled access to
that instance.

The most important part of the pattern is the uniqueness invariant, not the presence of a static `getInstance()` method.

JavaScript modules frequently provide a simpler implementation for process- or module-scoped Singletons:

```javascript
export const service = new Service();
```

Dependency injection can provide singleton lifetime without forcing the class itself to implement the Singleton pattern:

```javascript
container.register(Service, {
    lifetime: "singleton"
});
```

Singleton is justified when uniqueness is an actual architectural requirement. It should not be introduced merely
because many components need access to the same dependency.

The critical questions are therefore: what must be unique, within which scope, who owns its lifecycle, and what
invariant would be violated by allowing multiple instances? If those questions do not have clear answers, Singleton is
usually the wrong abstraction.
