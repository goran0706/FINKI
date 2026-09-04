# Factory Functions

Factory Functions are a JavaScript object-creation pattern in which a function creates and returns objects instead of
requiring callers to instantiate a class directly. The function becomes the construction boundary: callers request an
object through a function, while the function controls how that object is initialized, which implementation is selected,
which defaults are applied, and which details remain hidden.

The pattern is especially natural in JavaScript because objects do not require class-based construction. A factory
function can return object literals, class instances, closures, functions, proxies, or entirely different
implementations depending on its inputs. The essential property is not the use of an object literal or the absence of
`new`; it is that object creation is encapsulated behind a callable creation API.

## Intent

The intent of a Factory Function is to centralize and encapsulate object creation while exposing a simpler creation
interface to consumers.

A caller should depend on what the created object can do rather than on the concrete construction procedure used to
produce it. The factory can therefore control defaults, validate input, normalize configuration, select implementations,
establish invariants, compose dependencies, and hide representation details.

For example:

```js
function createUser(name, email) {
    return {
        name,
        email,
        greet() {
            return `Hello, ${this.name}`;
        }
    };
}

const user = createUser("Alice", "alice@example.com");
```

The caller does not need to know how the object is assembled. That responsibility belongs to `createUser`.

## The Problem

Direct object construction often spreads construction knowledge throughout an application.

Without a factory, callers may repeatedly perform initialization themselves:

```js
const user = {
    name,
    email,
    active: true,
    createdAt: new Date(),
    permissions: []
};
```

When the construction rules become more complicated, the same knowledge can appear in multiple locations. Changes to
defaults, validation, initialization order, dependency construction, or implementation selection then require changes
throughout the calling code.

A factory establishes one creation boundary:

```js
function createUser(name, email) {
    return {
        name,
        email,
        active: true,
        createdAt: new Date(),
        permissions: []
    };
}
```

The caller depends on `createUser` rather than reproducing the construction procedure.

## Core Structure

A factory function normally has three conceptual responsibilities.

1. Accept the information required to create an object.
2. Construct and initialize the object.
3. Return an object satisfying the expected contract.

The returned value may be a plain object:

```js
function createLogger() {
    return {
        log(message) {
            console.log(message);
        }
    };
}
```

It may be a class instance:

```js
class User {
    constructor(name) {
        this.name = name;
    }

    greet() {
        return `Hello, ${this.name}`;
    }
}

function createUser(name) {
    return new User(name);
}
```

It may be a closure:

```js
function createCounter() {
    let value = 0;

    return {
        increment() {
            value++;
        },

        getValue() {
            return value;
        }
    };
}
```

It may even select different implementations:

```js
function createStorage(type) {
    if (type === "memory") {
        return createMemoryStorage();
    }

    if (type === "file") {
        return createFileStorage();
    }

    throw new Error(`Unsupported storage type: ${type}`);
}
```

The factory abstraction is therefore about the creation boundary, not about a particular representation of the created
object.

## Construction Encapsulation

The primary value of a factory function is construction encapsulation.

A consumer should not need to know:

* which concrete type is instantiated;
* which defaults are applied;
* which dependencies are created;
* how configuration is normalized;
* which validation is required;
* whether the implementation uses classes, closures, or object literals;
* whether construction requires multiple internal steps;
* whether a different implementation is selected for the supplied configuration.

For example:

```js
function createHttpClient(config) {
    const timeout = config.timeout ?? 5000;
    const baseUrl = config.baseUrl.replace(/\/$/, "");

    return {
        async get(path) {
            const response = await fetch(`${baseUrl}${path}`, {
                signal: AbortSignal.timeout(timeout)
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            return response.json();
        }
    };
}
```

Consumers depend on `createHttpClient()` rather than the details of URL normalization, timeout configuration, request
construction, and response validation.

## Factory Functions and Plain Object Literals

A factory function is not simply an object literal wrapped in a function.

An object literal expresses one concrete object construction directly:

```js
const user = {
    name: "Alice"
};
```

A factory function establishes a reusable creation operation:

```js
function createUser(name) {
    return {
        name
    };
}
```

The distinction becomes more important when construction involves logic, defaults, validation, dependencies, private
state, implementation selection, or multiple object instances.

## Multiple Instances

Factory functions naturally support multiple independent instances.

```js
function createCounter() {
    let value = 0;

    return {
        increment() {
            value++;
        },

        getValue() {
            return value;
        }
    };
}

const first = createCounter();
const second = createCounter();

first.increment();

console.log(first.getValue());  // 1
console.log(second.getValue()); // 0
```

Each invocation establishes a separate closure and therefore separate state.

This is one of the important differences between a factory function and a module that maintains one shared private
state.

## Private State Through Closures

Factory functions can combine object creation with closure-based encapsulation.

```js
function createBankAccount(initialBalance = 0) {
    let balance = initialBalance;

    return {
        deposit(amount) {
            if (amount <= 0) {
                throw new Error("Amount must be positive");
            }

            balance += amount;
        },

        withdraw(amount) {
            if (amount > balance) {
                throw new Error("Insufficient funds");
            }

            balance -= amount;
        },

        getBalance() {
            return balance;
        }
    };
}
```

`balance` is not an object property and cannot be accessed directly by consumers. The returned API controls how it can
change.

This makes Factory Functions particularly useful when object creation and private per-instance state naturally belong
together.

The pattern itself does not require private state. A factory can return a completely transparent object. Closure-based
encapsulation is one possible implementation technique.

## Shared Methods and Prototypes

A naïve factory function that creates methods inside every invocation creates a new function object for each instance:

```js
function createUser(name) {
    return {
        name,

        greet() {
            return `Hello, ${this.name}`;
        }
    };
}
```

For many applications this is perfectly acceptable. If large numbers of instances are created, however, method sharing
can become relevant.

One option is to use a prototype:

```js
const userPrototype = {
    greet() {
        return `Hello, ${this.name}`;
    }
};

function createUser(name) {
    const user = Object.create(userPrototype);

    user.name = name;

    return user;
}
```

The factory remains the creation boundary while the prototype provides shared behavior.

Another option is to use a class internally:

```js
class User {
    constructor(name) {
        this.name = name;
    }

    greet() {
        return `Hello, ${this.name}`;
    }
}

function createUser(name) {
    return new User(name);
}
```

The consumer does not need to know that a class is being used internally.

## Factory Functions and Classes

A Factory Function and a class solve different concerns.

A class primarily defines an object type and its behavior. A factory function primarily defines how an object is
created.

They can be used independently or together.

A factory may return a plain object:

```js
function createUser(name) {
    return {
        name
    };
}
```

A class may be instantiated directly:

```js
const user = new User("Alice");
```

A factory may hide the class:

```js
function createUser(name) {
    return new User(name);
}
```

This allows the implementation to change later without requiring consumers to change their construction code.

For example, the factory could eventually return a different implementation:

```js
function createUser(name) {
    if (name === "system") {
        return new SystemUser(name);
    }

    return new RegularUser(name);
}
```

The creation API remains stable while the concrete implementation changes.

## Dependency Injection

Factory Functions are natural composition points for dependency injection.

Dependencies can be passed into the factory rather than created internally:

```js
function createOrderService({repository, paymentGateway, logger}) {
    return {
        async placeOrder(order) {
            logger.info("Placing order");

            await repository.save(order);
            await paymentGateway.charge(order.total);
        }
    };
}
```

The factory establishes the object's dependency graph.

```js
const service = createOrderService({
    repository,
    paymentGateway,
    logger
});
```

This keeps construction concerns at the composition boundary and makes the resulting object easier to test.

A factory that always constructs its own dependencies is less flexible:

```js
function createOrderService() {
    const repository = createRepository();
    const paymentGateway = createPaymentGateway();
    const logger = createLogger();

    // ...
}
```

This may still be appropriate when those dependencies are implementation details, but it reduces substitution and
testability.

## Configuration Normalization

A factory can convert external configuration into a normalized internal representation.

```js
function createClient(options = {}) {
    const config = {
        baseUrl: options.baseUrl ?? "https://api.example.com",
        timeout: options.timeout ?? 5000,
        retries: options.retries ?? 3
    };

    return new Client(config);
}
```

Consumers do not need to know the defaults or normalization rules.

This is especially useful when configuration comes from environment variables, configuration files, command-line
arguments, or external APIs.

## Validation and Invariants

Factories can establish invariants before an object becomes visible to the rest of the system.

```js
function createUser({name, email}) {
    if (!name) {
        throw new Error("Name is required");
    }

    if (!email.includes("@")) {
        throw new Error("Invalid email");
    }

    return {
        name,
        email
    };
}
```

This prevents invalid objects from being created through the factory boundary.

The factory should not necessarily become the location for every domain rule. Validation belongs there when it is part
of construction validity. Business operations that occur after construction generally belong to the created object or an
appropriate domain/service component.

## Default Values

Factories are useful for applying consistent defaults.

```js
function createRequest({
                           method = "GET",
                           headers = {},
                           timeout = 5000
                       } = {}) {
    return {
        method,
        headers,
        timeout
    };
}
```

This is preferable to requiring every caller to reproduce defaulting logic.

Defaults should be applied carefully when values are mutable. A factory should create fresh mutable values when each
instance requires independent ownership.

```js
function createUser() {
    return {
        permissions: []
    };
}
```

Using one shared mutable array would incorrectly couple instances.

## Ownership of Mutable State

A factory often defines ownership boundaries.

```js
function createCart(items = []) {
    return {
        items: [...items]
    };
}
```

The copy establishes that the returned object owns its collection rather than sharing the caller's mutable array.

The correct ownership policy depends on the domain. Sometimes sharing is intentional; sometimes defensive copying is
necessary. The factory is an appropriate place to make that decision because it controls the transition from external
construction data to internal object state.

## Choosing Implementations

A factory can select an implementation based on configuration or runtime conditions.

```js
function createLogger(environment) {
    if (environment === "production") {
        return createStructuredLogger();
    }

    return createConsoleLogger();
}
```

The consumer depends only on the logger contract:

```js
const logger = createLogger(environment);

logger.info("Application started");
```

This can reduce coupling between application code and concrete implementations.

When the selection logic becomes substantial, however, the factory itself can become a policy or registry. At that
point, the design should be evaluated rather than allowing an increasingly large conditional factory to become a hidden
service locator.

## Factory Functions as Creation Policies

A factory can encode a creation policy rather than merely hide `new`.

For example:

```js
function createConnection(config) {
    if (config.protocol === "https") {
        return createSecureConnection(config);
    }

    return createConnection(config);
}
```

The factory determines which object is appropriate for the requested configuration.

The distinction matters because a factory becomes architecturally valuable when callers should not own that decision
themselves.

If every caller already knows the exact implementation to construct, the factory may provide little value.

## Factory Functions and Conditional Construction

Simple conditional construction is one of the most common forms of the pattern.

```js
function createParser(format) {
    switch (format) {
        case "json":
            return createJsonParser();

        case "xml":
            return createXmlParser();

        case "csv":
            return createCsvParser();

        default:
            throw new Error(`Unsupported format: ${format}`);
    }
}
```

This centralizes implementation selection.

However, a factory should not automatically absorb every conditional. If there is no meaningful abstraction over the
returned implementations, the factory may simply move a conditional to another location without improving the design.

## Registries and Extensible Factories

For extensible systems, a factory can use a registry.

```js
const parsers = new Map();

parsers.set("json", createJsonParser);
parsers.set("csv", createCsvParser);
parsers.set("xml", createXmlParser);

function createParser(format) {
    const factory = parsers.get(format);

    if (!factory) {
        throw new Error(`Unsupported format: ${format}`);
    }

    return factory();
}
```

This can make implementations dynamically extensible.

The registry introduces additional concerns, including registration order, duplicate registration, lifecycle,
initialization, security, and test isolation. A registry should therefore be introduced because dynamic extensibility is
actually required, not merely to eliminate a small `switch`.

## Higher-Order Factory Functions

A factory can itself be produced by another function.

```js
function createUserFactory(defaultRole) {
    return function createUser(name) {
        return {
            name,
            role: defaultRole
        };
    };
}

const createAdmin = createUserFactory("admin");

const user = createAdmin("Alice");
```

This is useful when a family of factories shares configuration or dependencies.

It can also be used to create specialized creation policies:

```js
function createRepositoryFactory(database) {
    return function createRepository(collection) {
        return new Repository(database, collection);
    };
}
```

The resulting factory captures shared dependencies through its closure.

## Curried and Partially Applied Factories

Factory functions can naturally participate in partial application.

```js
function createClient(baseUrl, timeout) {
    return {
        baseUrl,
        timeout
    };
}

const createApiClient = timeout =>
    baseUrl =>
        createClient(baseUrl, timeout);
```

This is a functional variation of factory composition. It is useful when some creation parameters remain stable while
others vary.

The abstraction remains a factory because the resulting function creates objects.

## Async Factory Functions

Construction can sometimes require asynchronous work.

An async factory can return a `Promise`:

```js
async function createDatabaseClient(config) {
    const connection = await connectToDatabase(config);

    return {
        async query(sql) {
            return connection.query(sql);
        }
    };
}
```

The API becomes:

```js
const client = await createDatabaseClient(config);
```

This is useful when initialization requires network connections, credential loading, dynamic imports, filesystem access,
or other asynchronous operations.

Async factories should be distinguished from ordinary factories because construction failure becomes asynchronous and
object lifecycle becomes more complex.

## Lazy Construction

A factory can defer expensive initialization until it is actually required.

```js
function createServiceFactory(config) {
    let service;

    return {
        getService() {
            if (!service) {
                service = createExpensiveService(config);
            }

            return service;
        }
    };
}
```

This combines creation with lazy initialization.

However, lazy creation introduces lifecycle and concurrency considerations. In asynchronous code, naïve lazy
initialization can create multiple instances if concurrent calls race before initialization completes.

## Memoized Factories

A factory can cache previously created objects:

```js
const users = new Map();

function createUser(id) {
    if (!users.has(id)) {
        users.set(id, new User(id));
    }

    return users.get(id);
}
```

At this point the function is no longer merely a factory. It also implements canonicalization or caching semantics.

This distinction matters because callers may now expect repeated requests for the same identifier to return the same
object.

A normal factory generally permits:

```js
createUser("123") !== createUser("123");
```

A cached factory may guarantee:

```js
createUser("123") === createUser("123");
```

Those are materially different contracts.

## Factory Functions and Singleton Semantics

A factory function does not inherently create a Singleton.

This:

```js
function createLogger() {
    return {
        log(message) {
            console.log(message);
        }
    };
}
```

can create unlimited instances.

A singleton-like factory must explicitly preserve one instance:

```js
let instance;

function getLogger() {
    if (!instance) {
        instance = createLogger();
    }

    return instance;
}
```

The important distinction is instance cardinality.

Factory Function concerns how objects are created. Singleton concerns restricting the number of instances.

## Factory Functions and Module Scope

A module can expose a factory:

```js
export function createUser(name) {
    return {
        name
    };
}
```

The module provides the export boundary while the factory provides the object-creation boundary.

The two patterns therefore operate at different levels. A module does not become a factory merely because it exports a
creation function, and a factory does not require a module.

## Factory Functions and Encapsulation

Factory Functions can provide encapsulation through several mechanisms:

* closure scope;
* object property visibility;
* prototypes;
* private class fields in an internally used class;
* module-private dependencies;
* controlled public APIs.

For example:

```js
function createAccount() {
    let balance = 0;

    function validateAmount(amount) {
        if (amount <= 0) {
            throw new Error("Amount must be positive");
        }
    }

    return {
        deposit(amount) {
            validateAmount(amount);
            balance += amount;
        },

        getBalance() {
            return balance;
        }
    };
}
```

The caller receives the public API but not the implementation details.

Factory Functions therefore combine particularly well with the Module Pattern and closure-based encapsulation, although
they remain conceptually distinct patterns.

## Factory Functions and Prototypes

Factory-created objects can explicitly share a prototype.

```js
const userPrototype = {
    greet() {
        return `Hello, ${this.name}`;
    }
};

function createUser(name) {
    return Object.assign(Object.create(userPrototype), {
        name
    });
}
```

This gives the factory control over instance creation while retaining prototype-based behavior.

It is useful when the application wants factory-style construction but does not need class syntax.

## Factory Functions and Object Composition

Factory Functions are naturally compatible with composition.

```js
function createAuditableRepository(repository, logger) {
    return {
        async save(entity) {
            logger.info("Saving entity");

            return repository.save(entity);
        }
    };
}
```

A factory can construct an object by combining smaller capabilities.

This can reduce reliance on inheritance and is particularly natural in JavaScript because functions, objects, closures,
and modules can all participate in composition.

## Factory Functions and Decorator

A factory may create a decorated object:

```js
function createRepository(dependencies) {
    const repository = createBaseRepository(dependencies);

    return withLogging(
        withCaching(repository)
    );
}
```

The factory owns the construction composition, while Decorator owns behavioral wrapping.

The two concepts are therefore complementary rather than competing patterns.

## Factory Functions and Builder

Factory Functions and Builder both concern object creation, but they solve different construction problems.

A factory normally provides a direct creation operation:

```js
const user = createUser({
    name: "Alice",
    role: "admin"
});
```

Builder is useful when construction is sufficiently complex that the construction process itself benefits from
incremental configuration:

```js
const user = new UserBuilder()
    .name("Alice")
    .role("admin")
    .build();
```

A factory can internally use a Builder, but the caller does not need to know that.

Factory Functions are generally preferable when the object can be created through a relatively direct set of inputs.

## Factory Functions and Prototype

Prototype is concerned with creating objects by cloning or deriving from an existing object.

Factory Functions are concerned with encapsulating a creation operation.

A factory may internally use cloning:

```js
function createUser(template) {
    return structuredClone(template);
}
```

That does not make Factory Function and Prototype the same pattern.

## Factory Functions and Factory Method

Factory Function is not the same as the GoF Factory Method pattern.

A Factory Function is simply a function whose responsibility includes object creation.

Factory Method is a GoF creational pattern in which a method provides a creation point that can be overridden or
specialized, traditionally through inheritance.

In JavaScript, a function such as:

```js
function createParser(format) {
    // ...
}
```

is naturally described as a factory function.

Calling it Factory Method merely because it creates an object would incorrectly broaden the GoF term.

The important distinction is structural: Factory Method is about deferring creation through a polymorphic method
structure, whereas Factory Function is about encapsulating construction in a function.

## Factory Functions and Abstract Factory

Abstract Factory provides an interface for creating families of related objects.

For example, an abstract factory might create a complete family of UI components:

```js
const windowsFactory = {
    createButton() {
    },
    createDialog() {
    },
    createMenu() {
    }
};
```

A Factory Function normally creates one object or one category of object:

```js
function createButton(config) {
    // ...
}
```

Several related factory functions can be combined into an Abstract Factory-like API, but a single Factory Function is
not automatically an Abstract Factory.

## Factory Functions and Strategy

Strategy encapsulates an interchangeable algorithm or policy.

A factory may select a Strategy:

```js
function createPricingStrategy(type) {
    switch (type) {
        case "standard":
            return standardPricing;

        case "premium":
            return premiumPricing;

        default:
            throw new Error(`Unknown pricing strategy: ${type}`);
    }
}
```

The factory determines which object or function is created. The Strategy determines how an operation is performed.

Creation and behavior selection can therefore coexist without being the same concern.

## Factory Functions and Dependency Injection

Dependency Injection determines how dependencies are supplied to a component.

A factory can be the mechanism used to perform that injection:

```js
function createOrderService({repository, paymentGateway}) {
    return new OrderService(repository, paymentGateway);
}
```

The factory and Dependency Injection are therefore not alternatives. Factory Functions often serve as composition-root
functions that construct components and supply their dependencies.

## Factory Functions and Service Locators

A factory should not silently become a Service Locator.

This is relatively clean:

```js
function createOrderService({repository, logger}) {
    return {
        // ...
    };
}
```

The dependencies are explicit.

A service-locator-oriented factory may hide them:

```js
function createOrderService() {
    const repository = container.resolve("repository");
    const logger = container.resolve("logger");

    return {
        // ...
    };
}
```

The second approach makes the factory depend on global or ambient dependency resolution. This can obscure the object's
actual dependencies and make testing more difficult.

## Factory Functions and Registries

A registry answers the question of which creator is associated with a key.

A factory answers the question of how to create the requested object.

They can be combined:

```js
const factories = new Map();

function register(type, factory) {
    factories.set(type, factory);
}

function create(type, options) {
    const factory = factories.get(type);

    if (!factory) {
        throw new Error(`Unknown type: ${type}`);
    }

    return factory(options);
}
```

The registry provides extensibility; the factory invocation provides creation.

## TypeScript

TypeScript can describe the contract returned by a factory without requiring consumers to know its implementation.

```ts
interface User {
    name: string;

    greet(): string;
}

function createUser(name: string): User {
    return {
        name,

        greet() {
            return `Hello, ${this.name}`;
        }
    };
}
```

The return type can deliberately expose only the public contract:

```ts
interface Repository {
    find(id: string): Promise<Entity | null>;

    save(entity: Entity): Promise<void>;
}

function createRepository(config: Config): Repository {
    return new SqlRepository(config);
}
```

Consumers depend on `Repository`, not `SqlRepository`.

This makes the factory a useful abstraction boundary.

## Generic Factory Functions

Factories can be generic when they create objects whose types depend on their inputs.

```ts
function createBox<T>(value: T) {
    return {
        value
    };
}

const numberBox = createBox(42);
const stringBox = createBox("hello");
```

A generic factory can preserve type information without exposing the concrete implementation.

## Factory Function Return Types

Explicit return types can be useful when the factory should expose a deliberately constrained contract.

```ts
interface Logger {
    info(message: string): void;

    error(message: string): void;
}

function createLogger(): Logger {
    return {
        info(message) {
            console.log(message);
        },

        error(message) {
            console.error(message);
        }
    };
}
```

Without the explicit return type, TypeScript may infer additional implementation details. An explicit interface can
therefore reinforce the architectural boundary.

## Factories Returning Unions

A factory can return different implementations behind a shared interface.

```ts
interface Storage {
    get(key: string): Promise<string | null>;

    set(key: string, value: string): Promise<void>;
}

function createStorage(type: "memory" | "remote"): Storage {
    if (type === "memory") {
        return new MemoryStorage();
    }

    return new RemoteStorage();
}
```

The caller depends on `Storage` rather than the concrete classes.

The common contract is essential. If the returned implementations expose unrelated APIs, the factory is not providing a
useful polymorphic abstraction.

## Factory Function APIs

A good factory API should make valid construction easy and invalid construction difficult.

Important design considerations include:

* required versus optional inputs;
* defaults;
* validation;
* dependency injection;
* returned contract;
* error behavior;
* synchronous versus asynchronous construction;
* object identity;
* ownership of mutable inputs;
* lifecycle;
* caching or canonicalization;
* implementation selection;
* resource allocation.

The factory should expose the information callers actually need to make a creation decision without leaking irrelevant
implementation details.

## Resource Ownership

Factories that allocate resources should make ownership explicit.

```js
function createConnection(config) {
    const connection = openConnection(config);

    return {
        query(sql) {
            return connection.query(sql);
        },

        close() {
            return connection.close();
        }
    };
}
```

If the factory creates a resource, callers need to understand whether the returned object owns that resource and how it
is released.

This becomes especially important for database connections, file handles, sockets, workers, streams, locks,
subscriptions, and other resources with explicit lifetimes.

## Lifecycle

A factory should be clear about whether each invocation creates:

* a new independent instance;
* a shared instance;
* a cached instance;
* a proxy around an existing instance;
* a resource-owning instance;
* a lightweight facade over shared infrastructure.

The function name and documentation should communicate non-obvious lifecycle semantics.

For example, `createClient()` normally suggests a new instance, whereas `getClient()` commonly suggests retrieval of an
existing or shared instance.

Naming is therefore part of the factory contract.

## Error Handling

Construction failures should be represented consistently.

```js
function createUser(data) {
    if (!data.name) {
        throw new Error("User name is required");
    }

    return {
        name: data.name
    };
}
```

For asynchronous factories:

```js
async function createClient(config) {
    const credentials = await loadCredentials(config);

    return new Client(credentials);
}
```

The asynchronous contract should not be hidden. Callers must know that construction can fail asynchronously.

Factories should also avoid swallowing initialization errors merely to return partially initialized objects.

## Testing

Factory Functions provide a natural testing boundary.

```js
const user = createUser("Alice");

expect(user.name).toBe("Alice");
expect(user.greet()).toBe("Hello, Alice");
```

Factories that accept dependencies can make integration boundaries explicit:

```js
const service = createOrderService({
    repository: fakeRepository,
    paymentGateway: fakePaymentGateway,
    logger: fakeLogger
});
```

Tests can therefore verify both construction rules and dependency composition.

Factories should not be used to hide dependencies merely to make test setup appear simpler.

## Performance

Factory Functions introduce little inherent performance overhead. The important costs come from what construction
performs.

Potential costs include:

* allocating objects;
* allocating closures;
* creating arrays or maps;
* cloning input;
* constructing class instances;
* registering subscriptions;
* opening resources;
* loading modules;
* performing asynchronous initialization;
* applying decorators or proxies;
* creating per-instance functions.

If a factory creates methods inside every instance, those functions may consume additional memory compared with
prototype-shared methods.

If the factory performs expensive initialization, repeated calls may become expensive. In such cases, caching or
explicit lifecycle management may be appropriate, but those semantics should be intentional.

## Identity Semantics

A normal factory invocation generally creates a new identity:

```js
const a = createUser("Alice");
const b = createUser("Alice");

console.log(a === b); // false
```

If the factory canonicalizes instances:

```js
const a = getUser("123");
const b = getUser("123");

console.log(a === b); // true
```

the identity contract has changed.

This affects equality, mutation, caching, lifecycle, synchronization, and testing. Factories should not introduce shared
identity accidentally.

## Immutability

Factories can enforce immutable construction.

```js
function createConfig(options) {
    return Object.freeze({
        timeout: options.timeout,
        retries: options.retries
    });
}
```

For nested mutable structures, shallow freezing may not be sufficient.

Alternatively, the factory can create immutable value objects through controlled APIs rather than freezing everything
mechanically.

Immutability is a property of the created object's contract, not a requirement of the Factory Function pattern.

## Security Boundaries

Factories can centralize security-sensitive construction.

Examples include:

* authenticated clients;
* authorization policies;
* cryptographic service wrappers;
* database connections;
* sandboxed execution contexts;
* capability objects;
* privileged API clients.

A factory can ensure required security configuration is present before returning an object.

However, a factory is not itself a security boundary merely because it constructs a security-sensitive object. The
actual enforcement must remain in the returned object's operations and the underlying system.

## Architectural Boundaries

Factory Functions are particularly useful at architectural boundaries where implementation selection should be
centralized.

Examples include:

* application composition roots;
* infrastructure adapters;
* persistence implementations;
* HTTP clients;
* message publishers;
* event consumers;
* domain service construction;
* plugin instantiation;
* environment-specific implementations.

For example:

```js
function createPaymentGateway(config) {
    if (config.provider === "stripe") {
        return createStripeGateway(config);
    }

    if (config.provider === "adyen") {
        return createAdyenGateway(config);
    }

    throw new Error(`Unsupported provider: ${config.provider}`);
}
```

Application code can depend on the payment gateway contract without knowing which provider is active.

This makes the factory a useful dependency-direction mechanism when implementation selection belongs at the composition
boundary.

## Common Misuse

Factory Functions are frequently overused.

Wrapping a trivial object literal does not automatically improve the design:

```js
function createPoint(x, y) {
    return {x, y};
}
```

This is perfectly valid, but if there is no meaningful construction policy, the factory may simply add a layer of
indirection.

Another misuse is creating a factory that contains a large collection of unrelated construction rules. A factory that
knows how to create every object in an application may become a god object or service locator.

Another problem is hiding important lifecycle semantics. A function named `createClient()` that returns a shared
singleton can surprise consumers and create difficult identity bugs.

Another misuse is putting substantial business logic into construction. Factories should establish objects and
construction invariants; they should not become general-purpose application services.

## Factory Explosion

A system can develop excessive numbers of trivial factories:

```js
createUser()
createAddress()
createEmail()
createPhone()
createName()
createDate()
```

There is nothing inherently wrong with small factories, but every abstraction has a maintenance cost.

A factory earns its place when it encapsulates meaningful construction logic, hides implementation choice, establishes
important invariants, composes dependencies, or provides a stable creation boundary.

If it merely renames `new Object()` without providing useful semantics, it may be unnecessary.

## Large Conditional Factories

A factory can become difficult to maintain when implementation selection grows indefinitely:

```js
function createHandler(type) {
    if (type === "a") {
        // ...
    }

    if (type === "b") {
        // ...
    }

    if (type === "c") {
        // ...

        // many more branches
    }
```

At that point, possible alternatives include:

* a registry;
* dependency injection;
* configuration-driven registration;
* separate factories;
* polymorphic creation objects;
* plugins;
* Abstract Factory when families of products are involved.

The correct alternative depends on why the number of implementations is growing.

## Refactoring Toward a Factory Function

A Factory Function is a useful refactoring when callers repeatedly duplicate construction logic.

Before:

```js
const user = {
    name,
    active: true,
    permissions: []
};
```

and elsewhere:

```js
const user = {
    name,
    active: true,
    permissions: []
};
```

After:

```js
function createUser(name) {
    return {
        name,
        active: true,
        permissions: []
    };
}
```

The duplicated construction logic now has one owner.

A more meaningful refactoring occurs when callers independently construct the same implementation and the application
later needs to hide or replace that implementation.

## Refactoring From a Constructor to a Factory

A class does not need to be removed to introduce a Factory Function.

Before:

```js
const user = new User(name);
```

After:

```js
const user = createUser(name);
```

with:

```js
function createUser(name) {
    return new User(name);
}
```

This creates a stable construction boundary without changing the underlying implementation.

Later, the factory can return another implementation without requiring callers to change.

## Refactoring From a Factory to Direct Construction

The reverse refactoring can also be appropriate.

If a factory contains no meaningful construction policy:

```js
function createPoint(x, y) {
    return new Point(x, y);
}
```

and consumers need to work directly with `Point`, the factory may provide unnecessary indirection.

Removing it can simplify the design.

The presence of a factory should therefore be justified by an actual construction boundary rather than by a rule that
object creation must always go through factories.

## Recognizing an Opportunity

A Factory Function is worth considering when one or more of the following conditions exist:

1. Multiple callers repeat the same construction logic.
2. Object initialization requires meaningful defaults or validation.
3. The concrete implementation should be hidden.
4. The implementation may change over time.
5. Different implementations must be selected based on configuration.
6. Dependencies must be assembled consistently.
7. Construction establishes important ownership or lifecycle rules.
8. Objects require private per-instance state.
9. The application needs a stable creation API.
10. A composition root needs to centralize implementation selection.

The pattern is less useful when construction is trivial and there is no reason to hide or centralize it.

## Relationship to JavaScript Language Features

Factory Functions are especially natural in JavaScript because the language treats functions as first-class values and
does not require class syntax for object construction.

A factory can return:

* object literals;
* class instances;
* functions;
* closures;
* arrays;
* proxies;
* iterators;
* async abstractions;
* domain objects;
* resource wrappers.

JavaScript's flexibility means a factory can be substantially more general than the class-oriented factory patterns
traditionally described in object-oriented literature.

## Relationship to ES Modules

ES Modules provide module-level organization and dependency boundaries. Factory Functions provide object-creation
boundaries.

For example:

```js
export function createUser(name) {
    return {
        name
    };
}
```

The module controls what is exported. The factory controls how each object is created.

An exported factory can therefore be part of a module's public API without making the Module Pattern and Factory
Function the same concept.

## Relationship to Closures

Closures provide lexical encapsulation. Factory Functions provide object creation.

They frequently appear together:

```js
function createCounter() {
    let count = 0;

    return {
        increment() {
            count++;
        },

        value() {
            return count;
        }
    };
}
```

The factory creates an object and the closure protects its state.

The two concepts should still be distinguished. A closure does not necessarily create objects, and a factory does not
necessarily use closures.

## Relationship to Dependency Inversion

A factory can support Dependency Inversion by isolating high-level application code from concrete infrastructure
creation.

```js
function createApplication({repository, logger}) {
    return {
        repository,
        logger
    };
}
```

The application depends on abstractions or contracts, while the composition boundary determines which implementations
are supplied.

This is often more valuable than simply replacing constructors with functions.

## Common Design Questions

### Should every object be created by a factory?

No. Direct object construction is often clearer when construction is simple, stable, and intentionally exposed.

### Does a factory have to return a class instance?

No. It can return any object satisfying the expected contract.

### Does a factory have to avoid `new`?

No. A factory can internally use `new`. The pattern concerns the public creation boundary, not whether the
implementation uses constructor syntax.

### Does a factory have to hide implementation details?

No, but hiding implementation details is one of its primary benefits.

### Does a factory have to select between multiple implementations?

No. Centralized construction alone is sufficient. Implementation selection is an additional use case.

### Is every `createX()` function a Factory Function?

Not necessarily. Naming alone does not establish a pattern. The function should meaningfully own object creation.

### Is a factory automatically a Singleton?

No. Factories normally create new instances unless their contract explicitly introduces sharing or caching.

### Is a factory automatically a Factory Method?

No. Factory Function and GoF Factory Method are distinct concepts.

## Benefits

Factory Functions provide several benefits:

* centralization of construction logic;
* reduced duplication;
* encapsulation of implementation details;
* consistent defaults and validation;
* explicit dependency composition;
* implementation selection;
* easy creation of multiple independent instances;
* natural closure-based private state;
* flexible object representations;
* compatibility with functional and object-oriented JavaScript;
* stable creation APIs;
* improved test seams;
* easier migration between implementations.

## Costs

Factory Functions also introduce costs:

* additional indirection;
* more abstractions to understand;
* possible factory proliferation;
* potential hidden lifecycle semantics;
* conditional factories can become large;
* cached factories can introduce surprising identity semantics;
* closure-heavy implementations can increase per-instance allocations;
* asynchronous factories complicate initialization;
* poorly designed factories can become service locators or god objects.

The pattern should therefore be introduced for a concrete construction problem rather than as a universal rule.

## Decision Criteria

Use a Factory Function when object creation itself deserves an abstraction boundary.

It is particularly appropriate when callers should not depend directly on the concrete implementation, when construction
logic is repeated or non-trivial, when dependencies need to be assembled consistently, when implementation selection is
required, or when construction establishes important state and ownership invariants.

Prefer direct construction when the concrete type is intentionally part of the API and construction is simple and
stable.

Use Factory Method when the problem specifically involves polymorphic creation through an overridable method structure.

Use Abstract Factory when the system needs coordinated creation of families of related objects.

Use Builder when construction itself is complex enough to benefit from incremental assembly.

Use Prototype when creation is fundamentally based on cloning existing objects.

Use Strategy when the primary variation concerns interchangeable algorithms or policies rather than object creation.

## Summary

Factory Functions encapsulate object creation behind an ordinary JavaScript function. They can create plain objects,
class instances, closures, proxies, functions, or other implementations and can centralize defaults, validation,
dependency injection, implementation selection, ownership, lifecycle, and initialization.

The essential idea is not simply “use a function instead of `new`.” The important design decision is to make object
creation an explicit boundary so that consumers depend on a creation contract rather than duplicating or exposing
construction details.

Factory Functions are especially powerful in JavaScript because they align naturally with first-class functions,
closures, object composition, modules, and structural typing. They can therefore provide a lightweight alternative to
class-centric construction patterns while remaining compatible with classes when classes are the appropriate internal
implementation.

The pattern should remain focused on creation. Once a factory starts accumulating unrelated business logic, hidden
dependency resolution, global service access, extensive registration machinery, or complex lifecycle management, the
design should be reconsidered. A good Factory Function has a clear creation responsibility and a contract that makes its
construction semantics understandable to its callers.
