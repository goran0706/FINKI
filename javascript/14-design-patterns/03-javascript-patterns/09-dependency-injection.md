# Dependency Injection

Dependency Injection is a technique for supplying an object's dependencies from outside the object instead of allowing
the object to construct or discover those dependencies itself.

The central idea is separation between dependency use and dependency construction. A component declares what it needs,
while another component is responsible for providing those dependencies.

Dependency Injection is not a GoF design pattern. It is a general design technique that commonly supports Dependency
Inversion, composition, modularity, testing, and separation of concerns.

## The Dependency Problem

A component has a dependency when its behavior requires another component.

```js
class OrderService {
    constructor() {
        this.repository = new DatabaseRepository();
        this.logger = new ProductionLogger();
    }
}
```

`OrderService` depends on both `DatabaseRepository` and `ProductionLogger`, but it also decides how those dependencies
are constructed.

This creates two separate responsibilities:

* using dependencies;
* selecting and constructing dependencies.

Dependency Injection separates those responsibilities.

## Core Principle

With Dependency Injection, the component receives its dependencies:

```js
class OrderService {
    constructor(repository, logger) {
        this.repository = repository;
        this.logger = logger;
    }
}
```

The component knows how to use its dependencies but does not need to know how they were constructed.

The composition code decides which implementations to provide:

```js
const repository = new DatabaseRepository();
const logger = new ProductionLogger();

const service = new OrderService(repository, logger);
```

This is the fundamental structure of Dependency Injection.

## Dependency Construction Versus Dependency Use

A useful distinction is:

**Dependency construction answers which implementation should exist. Dependency Injection answers how that
implementation reaches the component that needs it.**

For example:

```js
const repository = createRepository(config);

const service = createOrderService({
    repository
});
```

`createRepository()` is responsible for construction.

`createOrderService()` receives the resulting dependency.

The two responsibilities can be maintained independently.

## Dependency Inversion

Dependency Injection and Dependency Inversion are related but distinct.

Dependency Inversion is a design principle concerning dependency direction and abstraction boundaries.

Dependency Injection is a mechanism for supplying dependencies.

A component can use Dependency Injection while still depending directly on a concrete implementation:

```js
class ReportService {
    constructor(pdfRenderer) {
        this.pdfRenderer = pdfRenderer;
    }
}
```

This is Dependency Injection even though `pdfRenderer` may be a concrete implementation.

Dependency Injection does not automatically produce Dependency Inversion.

## Dependency Injection and Composition

Composition determines which components collaborate.

Dependency Injection is one technique for establishing those collaborations.

For example:

```js
const service = new OrderService(
    repository,
    paymentProcessor,
    logger
);
```

The service is composed from three collaborators.

Those collaborators are injected through the constructor.

Composition is therefore broader than Dependency Injection.

## Dependency Injection and Dependency Inversion

The three concepts should remain distinct:

* Dependency Inversion is a design principle.
* Dependency Injection is a dependency-supply technique.
* Composition is the assembly of collaborating components.

They frequently reinforce one another but are not interchangeable terms.

## Constructor Injection

Constructor Injection supplies dependencies when an object is created.

```js
class OrderService {
    constructor(repository, paymentProcessor, logger) {
        this.repository = repository;
        this.paymentProcessor = paymentProcessor;
        this.logger = logger;
    }
}
```

Constructor Injection is generally the clearest form of Dependency Injection for mandatory dependencies.

The constructor establishes the object's required dependencies before the object becomes usable.

## Mandatory Dependencies

A mandatory dependency should normally be represented directly in the constructor or factory parameters.

```js
function createOrderService(repository, logger) {
    return {
        async create(order) {
            logger.log("Creating order");
            return repository.save(order);
        }
    };
}
```

The function cannot be constructed without providing the required collaborators.

This makes the dependency contract explicit.

## Optional Dependencies

Optional dependencies can be represented with defaults:

```js
function createService({
                           repository,
                           logger = console
                       }) {
    return {
        execute() {
            logger.log("Executing");
            return repository.find();
        }
    };
}
```

Optional dependencies should have meaningful default behavior.

If a dependency is actually required for correctness, making it optional merely to simplify construction hides an
invalid configuration.

## Constructor Validation

Dependencies can be validated at the composition boundary:

```js
class OrderService {
    constructor(repository) {
        if (!repository) {
            throw new TypeError("repository is required");
        }

        this.repository = repository;
    }
}
```

Validation can also occur in a factory or composition root.

The appropriate location depends on whether the component or the assembly layer owns the contract validation.

## Parameter Injection

A dependency can be supplied directly to a particular operation:

```js
function calculateReport(data, formatter) {
    return formatter.format(data);
}
```

This is useful when the dependency is relevant only to one operation.

Parameter Injection avoids storing a dependency as long-lived object state.

It can also make variation explicit at the call site.

## Parameter Injection and Strategy

Parameter Injection is particularly useful for Strategy-like behavior:

```js
function calculateTotal(order, pricingStrategy) {
    return pricingStrategy.calculate(order);
}
```

The strategy is supplied only for the operation that needs it.

This can be preferable to storing every possible algorithm on the object.

## Factory Injection

A factory can be injected when the component needs to create dependencies dynamically.

```js
class ReportService {
    constructor(reportFactory) {
        this.reportFactory = reportFactory;
    }

    generate(type) {
        const report = this.reportFactory.create(type);
        return report.generate();
    }
}
```

The service does not construct concrete report implementations itself.

It depends on the creation capability.

Factory Injection is useful when dependency creation itself is part of the component's responsibility.

## Provider Injection

A provider supplies a dependency when needed:

```js
function createService({getRepository}) {
    return {
        async execute() {
            const repository = getRepository();
            return repository.find();
        }
    };
}
```

This can support lazy creation or request-scoped dependencies.

However, providers can hide lifecycle semantics if their behavior is not clearly documented.

## Property Injection

A dependency can be assigned after construction:

```js
class OrderService {
    execute(order) {
        return this.repository.save(order);
    }
}

const service = new OrderService();
service.repository = repository;
```

Property Injection can be convenient for optional dependencies, frameworks, or legacy systems.

It is generally weaker than Constructor Injection for mandatory dependencies because the object can temporarily exist in
an invalid state.

## Setter Injection

A setter can establish a dependency:

```js
class Service {
    setLogger(logger) {
        this.logger = logger;
    }
}
```

Setter Injection can be useful when a dependency genuinely changes during the object's lifetime.

For immutable dependency configuration, Constructor Injection is usually clearer.

## Method Injection

A method can receive a dependency for a specific operation:

```js
class ReportService {
    generate(data, formatter) {
        return formatter.format(data);
    }
}
```

This is useful when the dependency represents operation-specific policy rather than stable service infrastructure.

## Interface Injection

Interface Injection is a less common form in which a component exposes an interface specifically for receiving a
dependency.

In JavaScript, this usually does not require a special language mechanism.

For example:

```js
class Service {
    setRepository(repository) {
        this.repository = repository;
    }
}
```

The method acts as the injection point.

In TypeScript, the expected contract can be represented explicitly:

```ts
interface Repository {
    find(id: string): Promise<User>;
}
```

JavaScript's structural nature makes dedicated interface-injection infrastructure less necessary than in languages with
nominal dependency frameworks.

## Dependency Injection Through Factory Functions

Factory Functions provide a natural Dependency Injection mechanism:

```js
function createUserService({
                               repository,
                               validator,
                               logger
                           }) {
    return {
        async create(user) {
            validator.validate(user);

            const result = await repository.save(user);

            logger.log(`Created ${result.id}`);

            return result;
        }
    };
}
```

The resulting object contains the supplied dependencies.

No framework is required.

## Dependency Injection Through Classes

Classes can use Constructor Injection:

```js
class UserService {
    constructor(repository, validator, logger) {
        this.repository = repository;
        this.validator = validator;
        this.logger = logger;
    }
}
```

The mechanism is the same as with factory-created objects.

Classes provide one construction mechanism; Dependency Injection describes where dependencies come from.

## Dependency Injection Through Closures

Closures can capture injected dependencies:

```js
function createUserService({repository, logger}) {
    return {
        async find(id) {
            logger.log(`Finding ${id}`);
            return repository.find(id);
        }
    };
}
```

The dependencies become part of the closure's environment.

This can provide strong encapsulation because consumers cannot directly replace the captured dependencies after
construction.

## Dependency Injection Through Modules

ES modules can also provide dependencies through imports:

```js
import {repository} from "./repository.js";
```

This is dependency provisioning, but it is not necessarily Dependency Injection in the narrow sense.

The dependency is resolved by the module system rather than explicitly supplied to the component.

This distinction becomes important when testing, configuring, or replacing implementations.

## Explicit Versus Implicit Dependencies

Consider:

```js
import {repository} from "./repository.js";

export function findUser(id) {
    return repository.find(id);
}
```

The dependency is explicit at the module level but implicit in the function's parameters.

Compare:

```js
export function findUser(id, repository) {
    return repository.find(id);
}
```

The second form makes the dependency explicit at the function boundary.

Neither approach is universally superior.

The appropriate boundary depends on the module's intended lifecycle, configurability, and architectural role.

## Global Dependencies

Global dependencies are a common alternative to Dependency Injection:

```js
const repository = globalThis.repository;

function findUser(id) {
    return repository.find(id);
}
```

This hides the dependency and makes configuration and testing more difficult.

Global state also introduces lifetime and concurrency concerns.

Dependency Injection is generally preferable when a dependency is part of a component's configurable behavior.

## Service Locator

A Service Locator provides dependencies through an indirect lookup:

```js
const repository = container.get("repository");
```

The component does not receive its dependency directly.

Instead, it asks another object to locate it.

Service Locator and Dependency Injection solve related problems differently.

Dependency Injection makes dependencies part of the component's construction or operation contract.

Service Locator hides dependencies behind a lookup mechanism.

## Dependency Injection Container

A Dependency Injection Container automates dependency construction and resolution.

Conceptually, a container can associate a contract with an implementation:

```js
container.register("repository", repositoryFactory);
```

and later resolve it:

```js
const repository = container.resolve("repository");
```

Containers are tooling around Dependency Injection, not the definition of Dependency Injection itself.

A system can use extensive Dependency Injection without having a container.

## Manual Dependency Injection

Manual construction is often sufficient:

```js
const repository = createRepository(database);
const logger = createLogger(config);

const service = createOrderService({
    repository,
    logger
});
```

This is Dependency Injection.

The absence of a container is not a deficiency.

Manual composition is often preferable when the dependency graph is small enough to understand directly.

## Dependency Injection Containers and Complexity

Containers become useful when construction graphs are large or repetitive.

They can provide:

* automatic dependency resolution;
* lifecycle management;
* scopes;
* configuration;
* decorators or interceptors;
* conditional implementations.

They can also introduce:

* hidden dependency graphs;
* runtime configuration errors;
* difficult debugging;
* framework coupling;
* complicated lifecycle semantics.

A container should therefore solve an actual composition problem rather than being introduced merely because Dependency
Injection is being used.

## Dependency Registration

Container-based systems commonly register implementations:

```js
container.register({
    repository: {
        useFactory: createRepository
    }
});
```

Registration should remain close to the composition boundary.

Business components should generally not be responsible for registering their own infrastructure dependencies.

## Dependency Scopes

A dependency can have different lifetimes.

Common scopes include:

* transient;
* singleton;
* request-scoped;
* session-scoped;
* application-scoped.

For example, a database connection pool may be application-scoped while a request context may be request-scoped.

Dependency Injection makes these lifecycle choices configurable, but it does not determine the correct scope.

## Singleton Dependencies

A container may provide one shared instance:

```js
const logger = createLogger();

const firstService = createService({logger});
const secondService = createService({logger});
```

This is an instance-lifetime decision.

Dependency Injection does not imply Singleton semantics.

A dependency can be injected as a new instance each time.

## Transient Dependencies

A transient dependency is created for each consumer or resolution:

```js
const serviceA = createService({
    repository: createRepository()
});

const serviceB = createService({
    repository: createRepository()
});
```

This can provide isolation between components.

The cost is additional construction and potentially duplicated resources.

## Request-Scoped Dependencies

In server applications, some dependencies should exist only for one request.

Examples include:

* request context;
* authentication context;
* transaction context;
* correlation identifiers;
* request-local caches.

A request-scoped dependency should not accidentally be shared across concurrent requests.

Dependency Injection infrastructure can enforce these boundaries when necessary.

## Lifecycle Management

Dependency Injection becomes more important when dependencies own resources.

For example:

```js
const database = createDatabase();

const repository = createRepository(database);

const service = createService({
    repository
});
```

The composition root may own the database lifecycle and pass it down to components that use it.

Ownership should not be confused with dependency visibility.

A component can use a resource without owning its lifetime.

## Disposal

Resources may require explicit cleanup:

```js
await database.close();
```

If a container manages the lifecycle, it may also manage disposal.

If dependencies are manually composed, the composition root should define shutdown behavior.

Dependency Injection does not automatically solve resource management.

## Dependency Direction

A useful architecture often has high-level components depend on stable contracts while infrastructure provides concrete
implementations.

For example:

```ts
interface UserRepository {
    findById(id: string): Promise<User>;
}
```

The application service depends on `UserRepository`.

The database implementation satisfies that contract.

The composition root connects the two.

This keeps infrastructure selection outside the high-level component.

## Ports and Adapters

In Ports and Adapters architecture, application components commonly depend on ports while adapters implement those
ports.

Dependency Injection connects the application to the selected adapter.

```js
const application = createApplication({
    userRepository: postgresUserRepository
});
```

The application does not construct the PostgreSQL adapter itself.

Dependency Injection therefore supports the architectural separation but does not define Ports and Adapters.

## Dependency Injection and Hexagonal Architecture

Hexagonal Architecture uses explicit boundaries between application logic and external systems.

Dependency Injection can connect those boundaries at the composition root.

For example:

```js
const application = createApplication({
    payments: stripePayments,
    users: postgresUsers
});
```

The application depends on capabilities.

Infrastructure implementations are supplied externally.

## Dependency Injection and Clean Architecture

Clean Architecture commonly places dependency direction toward inner policy and uses abstractions at architectural
boundaries.

Dependency Injection is one mechanism for satisfying those dependencies from the outer layers.

The composition root generally belongs near the application's outer boundary.

## Dependency Injection and Functional Programming

Functional programming can use Dependency Injection without classes.

```js
function createApplication({repository, clock}) {
    return {
        async execute(id) {
            const user = await repository.find(id);
            return {
                user,
                timestamp: clock.now()
            };
        }
    };
}
```

The dependencies are ordinary function values.

This makes Dependency Injection natural in JavaScript because functions are first-class values.

## Dependency Injection and Higher-Order Functions

Higher-order functions can inject behavior:

```js
const createHandler = validate => request => {
    validate(request);
    return process(request);
};
```

The validator is supplied externally.

The same technique can inject:

* policies;
* serializers;
* loggers;
* clocks;
* random-number generators;
* persistence operations;
* feature decisions.

## Dependency Injection and the Clock

Time is a common hidden dependency.

Instead of:

```js
function isExpired(expiresAt) {
    return Date.now() >= expiresAt;
}
```

a component can receive a clock:

```js
function createExpirationService(clock) {
    return {
        isExpired(expiresAt) {
            return clock.now() >= expiresAt;
        }
    };
}
```

Tests can provide a deterministic clock.

This illustrates a broader rule: Dependency Injection is particularly valuable for dependencies that are
nondeterministic, external, stateful, or environment-specific.

## Dependency Injection and Randomness

Randomness can similarly be injected:

```js
function createTokenGenerator(random) {
    return {
        generate() {
            return random();
        }
    };
}
```

Tests can supply a deterministic implementation.

This avoids coupling domain behavior directly to process-global randomness.

## Dependency Injection and Environment Configuration

Environment-specific configuration can be injected:

```js
const service = createService({
    endpoint: config.apiEndpoint,
    timeout: config.timeout
});
```

The component does not need to read environment variables directly.

This keeps environment access near the composition boundary.

## Dependency Injection and Configuration Objects

Configuration can itself become a dependency:

```js
function createClient(config) {
    return {
        request(path) {
            // use config
        }
    };
}
```

Configuration should be separated from operational collaborators when that distinction improves clarity.

For example, a logger is a behavioral dependency while a timeout is configuration data.

Both can be supplied through the same factory without necessarily being modeled as the same conceptual type.

## Dependency Injection and Constants

Not every value needs Dependency Injection.

Injecting trivial constants can create unnecessary ceremony:

```js
createService({
    timeout: 1000,
    maxRetries: 3
});
```

This can be appropriate when the values vary by environment or policy.

If a value is an invariant of the component itself, keeping it internal may be clearer.

## Dependency Injection and State

Injecting a stateful dependency creates shared-state decisions.

```js
const cache = createCache();

const serviceA = createService({cache});
const serviceB = createService({cache});
```

The services now share cache state.

Creating separate caches produces different semantics:

```js
const serviceA = createService({
    cache: createCache()
});

const serviceB = createService({
    cache: createCache()
});
```

Dependency Injection makes the choice possible but does not decide which lifetime is correct.

## Dependency Injection and Mutability

Mutable dependencies can create unexpected coupling.

```js
const state = {
    count: 0
};

const first = createService({state});
const second = createService({state});
```

Both services can modify the same object.

Shared mutable dependencies should therefore be intentional.

Immutable dependencies are often safer when sharing is expected.

## Dependency Injection and Immutability

Dependencies that do not change after construction can be stored as immutable references:

```js
class Service {
    constructor(repository) {
        this.repository = repository;
    }
}
```

In TypeScript:

```ts
class Service {
    constructor(
        private readonly repository: Repository
    ) {
    }
}
```

`readonly` prevents reassignment of the reference but does not make the repository itself immutable.

## Dependency Injection and TypeScript

TypeScript interfaces make injected contracts explicit:

```ts
interface UserRepository {
    findById(id: string): Promise<User>;
}

interface Logger {
    log(message: string): void;
}

class UserService {
    constructor(
        private readonly repository: UserRepository,
        private readonly logger: Logger
    ) {
    }
}
```

The implementation supplied at runtime only needs to satisfy the structural contract.

## Structural Typing

TypeScript's structural typing makes lightweight Dependency Injection particularly natural.

```ts
const repository = {
    async findById(id: string) {
        return loadUser(id);
    }
};
```

No explicit class inheritance is required.

If the object satisfies the required structure, it can be injected.

## Generic Dependencies

Generic contracts can preserve type relationships:

```ts
interface Repository<T> {
    findById(id: string): Promise<T>;

    save(value: T): Promise<T>;
}

class Service<T> {
    constructor(
        private readonly repository: Repository<T>
    ) {
    }
}
```

This allows the same component structure to work with multiple domain types.

## Dependency Injection and Testing

Testing is one of the most visible benefits of Dependency Injection.

Instead of using a production repository:

```js
const service = createService({
    repository: productionRepository
});
```

a test can supply a deterministic implementation:

```js
const repository = {
    findById: async () => ({
        id: "1",
        name: "Test"
    })
};

const service = createService({
    repository
});
```

The test controls the dependency without modifying the production component.

## Test Doubles

Injected dependencies can be replaced with:

* stubs;
* mocks;
* spies;
* fakes;
* deterministic implementations;
* in-memory implementations;
* Null Objects.

The injected contract should remain narrow enough that the test double is not forced to reproduce unrelated behavior.

## Dependency Injection and Mocking

Dependency Injection makes mocking technically easier, but easier mocking is not itself the architectural goal.

If a component requires twenty mocks, that may indicate excessive coupling.

Dependency Injection should expose meaningful boundaries rather than provide a mechanism for compensating for poor
component design.

## Dependency Injection and Deterministic Testing

External dependencies commonly introduce nondeterminism:

* current time;
* randomness;
* network access;
* filesystem state;
* environment variables;
* databases;
* external services.

Injecting these dependencies can make tests deterministic without changing business behavior.

## Dependency Injection and Integration Testing

Dependency Injection also allows tests to select realistic implementations.

For example:

```js
const service = createService({
    repository: testDatabaseRepository
});
```

The same application service can operate against a test database rather than a production database.

The component does not need a separate implementation merely because the environment changed.

## Dependency Injection and Mocks Versus Fakes

A fake provides a functioning alternative implementation:

```js
const repository = createInMemoryRepository();
```

A mock or spy instead focuses on observing interactions.

Dependency Injection supports both.

The choice should follow the testing objective rather than a blanket preference for one type of test double.

## Dependency Injection and Error Handling

Injected dependencies can have different failure behavior.

For example, a production repository may throw network errors while an in-memory repository does not.

The consuming component should define the contract it expects.

Replacing a dependency in tests should not accidentally remove important failure cases that production code must handle.

## Contract Compatibility

A replacement dependency must satisfy the behavioral contract, not merely the syntactic shape.

For example:

```js
const repository = {
    async findById(id) {
        return null;
    }
};
```

The function signature may be correct while the semantic behavior differs from the production contract.

Dependency Injection therefore increases the importance of explicit contracts and contract testing.

## Dependency Injection and Error Translation

An adapter may translate infrastructure errors into application-level errors before the dependency is injected.

```js
const repository = createRepositoryAdapter(database);
const service = createService({repository});
```

The service depends on the adapter's contract rather than the database driver's error model.

Dependency Injection and Adapter therefore commonly work together.

## Dependency Injection and Async Dependencies

Dependencies may expose asynchronous contracts:

```ts
interface UserRepository {
    findById(id: string): Promise<User>;
}
```

The injection mechanism does not change because the dependency is asynchronous.

The important design concerns are timeout, cancellation, failure, retries, and resource ownership.

## Cancellation

A dependency may require cancellation support:

```ts
interface Repository {
    findById(
        id: string,
        options?: { signal?: AbortSignal }
    ): Promise<User>;
}
```

The consuming component should propagate cancellation when the operation supports it.

Dependency Injection does not automatically provide cancellation semantics.

## Dependency Injection and Resource Boundaries

Injecting a database client, network client, or stream creates a resource boundary.

The component should know whether it:

* owns the resource;
* borrows it;
* shares it;
* creates child resources;
* closes it.

The composition root should normally coordinate application-wide resources.

## Dependency Injection and Concurrency

Shared dependencies can become concurrency boundaries.

A mutable injected dependency may be accessed by many operations simultaneously.

Examples include:

* caches;
* connection pools;
* mutable configuration;
* request registries;
* queues.

The concurrency guarantees of the dependency must be understood before choosing a shared scope.

## Dependency Injection and Performance

Dependency Injection itself usually introduces little runtime overhead when implemented manually.

Container-based systems may add:

* lookup overhead;
* reflection or metadata processing;
* proxying;
* additional allocations;
* lifecycle bookkeeping.

These costs may be negligible in application code but can matter in high-frequency or latency-sensitive paths.

Performance should be measured rather than assumed.

## Dependency Injection and Memory

Long-lived injected dependencies can extend object lifetimes.

For example, an application-scoped cache injected into many services remains reachable as long as those services remain
reachable.

Large object graphs can therefore retain substantial memory.

Lifecycle and scope decisions are part of Dependency Injection design.

## Dependency Injection and Security

Dependency selection can affect security behavior.

For example:

```js
const application = createApplication({
    authorization: productionAuthorizationPolicy
});
```

Injecting a weaker implementation into the wrong environment could bypass security controls.

Composition configuration should therefore be treated as part of the application's trusted configuration boundary.

## Dependency Injection and Plugins

Plugin systems can use Dependency Injection to provide shared services:

```js
plugin.initialize({
    logger,
    configuration,
    eventBus
});
```

Plugins can depend on capabilities without constructing their own application infrastructure.

This is useful for modular architectures, provided plugin contracts and lifecycle semantics are explicit.

## Dependency Injection and Module Boundaries

Dependency Injection can preserve module boundaries by preventing lower-level modules from importing every
infrastructure implementation they need.

Instead:

```js
const service = createService({
    repository
});
```

The composition layer determines the concrete implementation.

This reduces direct dependency edges between modules.

## Composition Root

The Composition Root is the location where the application's major components are constructed and connected.

```js
const database = createDatabase(config.database);
const repository = createRepository(database);
const logger = createLogger(config.logging);
const service = createOrderService({
    repository,
    logger
});
```

The composition root is where Dependency Injection becomes concrete.

It should generally be close to the application's entry point or infrastructure boundary.

## Keeping Business Logic Free of Wiring

Business components should generally not contain application startup logic:

```js
function createOrderService() {
    const database = connectToProductionDatabase();
    const repository = createRepository(database);

    // ...
}
```

This couples the business component to a specific deployment environment.

Instead, wiring should occur externally:

```js
const database = connectToProductionDatabase();
const repository = createRepository(database);

const service = createOrderService({
    repository
});
```

The business component remains independent of the infrastructure construction process.

## Conditional Dependency Selection

The composition root can select implementations based on configuration:

```js
const repository = config.environment === "test"
    ? createInMemoryRepository()
    : createDatabaseRepository(database);
```

The application service receives only the resulting contract.

This keeps environment-specific decisions outside the business component.

## Runtime Dependency Selection

Some dependencies genuinely need to vary during execution.

```js
function createPaymentService({providers}) {
    return {
        pay(payment) {
            const provider = providers[payment.provider];
            return provider.charge(payment);
        }
    };
}
```

This combines Dependency Injection with runtime selection.

If the selection itself represents interchangeable algorithms or policies, Strategy may be the more precise behavioral
abstraction.

## Dependency Injection and Strategy

Strategy can be injected:

```js
const service = createPricingService({
    strategy: pricingStrategy
});
```

Dependency Injection answers how the strategy reaches the service.

Strategy answers the behavioral problem of interchangeable algorithms or policies.

## Dependency Injection and Factory

A factory can be injected:

```js
const service = createReportService({
    reportFactory
});
```

The service depends on a creation capability.

Factory patterns answer object creation problems.

Dependency Injection answers dependency provisioning.

## Dependency Injection and Adapter

An adapter is often injected at an architectural boundary:

```js
const service = createPaymentService({
    payments: paymentGatewayAdapter
});
```

The adapter reconciles an external interface.

Dependency Injection selects and supplies the adapter.

## Dependency Injection and Decorator

Decorators can be composed before injection:

```js
const repository = withLogging(
    withCaching(
        databaseRepository
    )
);

const service = createService({
    repository
});
```

The service receives the final component.

Decorator controls behavioral wrapping.

Dependency Injection controls how that resulting component is supplied.

## Dependency Injection and Null Object

A Null Object can be injected when absence should have valid behavior:

```js
const service = createService({
    logger: config.logging
        ? productionLogger
        : nullLogger
});
```

The service does not need to know whether logging is enabled.

The Null Object provides the contract-preserving behavior.

## Dependency Injection and Service Locator

The distinction is important.

With Dependency Injection:

```js
const service = createService({
    repository
});
```

The dependency is supplied to the service.

With Service Locator:

```js
function createService(container) {
    return {
        execute() {
            const repository = container.get("repository");
            // ...
        }
    };
}
```

The service retrieves its dependency itself.

The second approach hides the actual dependency behind the locator.

## Dependency Injection and Global State

Global state can sometimes appear convenient:

```js
const config = globalThis.config;
```

but it creates implicit coupling.

Dependency Injection makes the dependency boundary explicit:

```js
createService({
    config
});
```

This generally improves testability and configuration clarity.

## Dependency Injection and Singleton

A Singleton controls instance cardinality.

Dependency Injection controls dependency supply.

A Singleton can be injected:

```js
const logger = Logger.getInstance();

const service = createService({
    logger
});
```

An injected dependency does not need to be a Singleton.

The two concepts should not be conflated.

## Dependency Injection and Module Pattern

A Module Pattern can capture injected dependencies:

```js
function createModule({repository}) {
    return {
        find(id) {
            return repository.find(id);
        }
    };
}
```

The closure provides encapsulation.

Dependency Injection provides the repository.

These concerns are independent.

## Dependency Injection and Factory Functions

Factory Functions are often an especially lightweight way to implement Dependency Injection:

```js
function createService({repository, logger}) {
    return {
        execute() {
            logger.log("Executing");
            return repository.find();
        }
    };
}
```

The factory becomes the construction boundary while the resulting object remains independent of infrastructure creation.

## Dependency Injection and Constructor Functions

Constructor Functions can receive dependencies through their arguments:

```js
function Service(repository, logger) {
    this.repository = repository;
    this.logger = logger;
}
```

The fact that the constructor is invoked with `new` does not change the Dependency Injection principle.

## Dependency Injection and Classes

Classes provide the same basic mechanism:

```js
class Service {
    constructor(repository, logger) {
        this.repository = repository;
        this.logger = logger;
    }
}
```

The language construct is irrelevant to the underlying dependency-management principle.

## Dependency Injection and Prototype-Based Design

Prototype-based objects can receive dependencies as properties:

```js
const service = Object.create(servicePrototype);

service.repository = repository;
service.logger = logger;
```

The prototype provides shared behavior while the object contains its injected collaborators.

Prototype delegation and Dependency Injection address different concerns.

## Dependency Injection and Inheritance

Inheritance can create implicit dependencies on base-class behavior:

```js
class Service extends BaseService {
    // ...
}
```

Composition with injected collaborators can make those dependencies explicit:

```js
class Service {
    constructor(repository) {
        this.repository = repository;
    }
}
```

This is one reason Dependency Injection frequently accompanies composition-over-inheritance designs.

## Common Misuse

A common misuse is assuming Dependency Injection requires a container.

It does not.

Another is injecting every possible value, including constants and trivial implementation details.

Another is using interfaces merely to satisfy a Dependency Injection framework without obtaining a meaningful
architectural boundary.

Another is injecting large objects when only one capability is required.

Another is using a Service Locator while calling the system Dependency Injection.

Another is making mandatory dependencies optional to simplify construction.

Another is introducing excessive abstraction solely to make mocking easier.

Another is creating a container configuration so complex that the dependency graph becomes harder to understand than the
original construction code.

## Injecting Too Much

Consider:

```js
createService({
    database,
    logger,
    config,
    metrics,
    cache,
    environment,
    filesystem,
    network,
    clock,
    random
});
```

Some of these dependencies may be legitimate.

Others may indicate that the component has too many responsibilities.

Dependency Injection exposes coupling; it does not eliminate it.

A constructor with many dependencies should trigger architectural investigation rather than automatic refactoring into a
container.

## Injecting Large Objects

Suppose a service needs only one operation:

```js
function createService(database) {
    return {
        find(id) {
            return database.users.findById(id);
        }
    };
}
```

Passing the entire database abstraction may expose more capability than necessary.

A narrower contract is often better:

```js
function createService({findUser}) {
    return {
        find(id) {
            return findUser(id);
        }
    };
}
```

The second design communicates the actual dependency more precisely.

## Dependency Injection and Interface Segregation

Dependency Injection works particularly well with narrow interfaces.

A component that requires:

```ts
interface UserReader {
    findById(id: string): Promise<User>;
}
```

does not need a complete repository containing unrelated operations.

This reduces coupling between the consumer and provider.

## Hidden Dependencies

A component can appear to use Dependency Injection while hiding dependencies behind injected containers:

```js
function createService(container) {
    return {
        execute() {
            const repository = container.get("repository");
            const logger = container.get("logger");
            // ...
        }
    };
}
```

The container itself has become the dependency.

This weakens the explicitness that Dependency Injection is intended to provide.

## Temporal Coupling

Property Injection can create temporal coupling:

```js
const service = new Service();

service.setRepository(repository);

service.execute();
```

The object must be configured correctly before use.

Constructor Injection avoids this particular problem:

```js
const service = new Service(repository);
```

The object is configured as part of construction.

## Mutable Injection

Allowing dependencies to be replaced later can be useful:

```js
service.repository = anotherRepository;
```

but it can also make behavior depend on mutation history.

If dependency replacement is not part of the component's intended lifecycle, dependencies should generally be treated as
immutable after construction.

## Dependency Injection and Reconfiguration

Some systems legitimately need runtime reconfiguration.

For example, a component may switch a feature policy:

```js
service.setPricingStrategy(newStrategy);
```

This is not automatically a better form of Dependency Injection.

Runtime behavior replacement should be intentional and should have clear concurrency and lifecycle semantics.

## Dependency Injection and Concurrency

Replacing a dependency while operations are executing can create race conditions:

```js
service.setRepository(repositoryA);

// operation starts

service.setRepository(repositoryB);
```

The operation may observe different collaborators depending on when access occurs.

Immutable dependency configuration avoids many such problems.

## Dependency Injection and Reentrancy

Injected collaborators may call back into their consumers.

```js
const dependency = {
    execute() {
        consumer.handle();
    }
};
```

Such cycles can create reentrancy problems.

Dependency Injection makes the reference possible but does not make the interaction safe.

Architectural cycles should be examined separately from simple dependency wiring.

## Dependency Injection and Circular Dependencies

Two components may directly depend on each other:

```js
const a = createA({b});
const b = createB({a});
```

This makes construction order and lifecycle more difficult.

Circular dependencies often indicate that a third abstraction should own the shared responsibility.

However, some bidirectional domain relationships are legitimate and should not be eliminated merely because they are
inconvenient for a container.

## Dependency Injection and Observability

Logging, metrics, tracing, and audit services are common injected dependencies:

```js
const service = createService({
    repository,
    logger,
    metrics,
    tracer
});
```

This allows observability behavior to vary independently from business logic.

Decorators and middleware can sometimes provide the same behavior without increasing every component's direct dependency
list.

## Dependency Injection and Cross-Cutting Concerns

Not every cross-cutting concern should become an explicit dependency.

Logging may be appropriate as a collaborator.

Tracing may instead be applied through middleware or wrappers.

Authentication may belong at an application boundary.

The correct mechanism depends on where the responsibility belongs.

Dependency Injection is a mechanism, not a universal solution for cross-cutting concerns.

## Dependency Injection and Architecture

Dependency Injection is most valuable at architectural boundaries.

Typical boundaries include:

* domain to infrastructure;
* application to persistence;
* application to messaging;
* application to external APIs;
* business logic to environment services;
* components to replaceable policies.

At these boundaries, explicit dependency contracts reduce direct coupling.

## Dependency Injection and Distributed Systems

Dependency Injection does not make a distributed dependency local.

For example:

```js
const paymentService = createPaymentService({
    gateway: remotePaymentGateway
});
```

The injected gateway may still fail because of:

* network latency;
* timeouts;
* partial failure;
* authentication;
* remote version changes;
* rate limits.

The local injection boundary does not eliminate distributed-systems concerns.

## Dependency Injection and Remote Adapters

A remote client is often wrapped by an Adapter:

```js
const payments = createPaymentAdapter(remoteClient);

const application = createApplication({
    payments
});
```

The application receives a stable contract while the adapter manages the remote protocol.

Dependency Injection establishes the connection between those layers.

## Dependency Injection and Versioning

Injected interfaces should evolve carefully.

Changing:

```ts
interface Repository {
    findById(id: string): Promise<User>;
}
```

to require additional behavior can break every implementation.

Stable dependency contracts therefore matter when multiple components or modules provide implementations.

## Dependency Injection and Backward Compatibility

A component can preserve a stable contract while implementations evolve behind it.

```js
const service = createService({
    repository: newRepository
});
```

The service does not need to change if the repository continues to satisfy the expected behavior.

This is one of the architectural benefits of explicit dependency boundaries.

## Dependency Injection and Configuration Errors

Manual Dependency Injection generally fails during construction if a required dependency is missing:

```js
new Service(undefined);
```

Container-based systems may instead fail during resolution.

These failures should be detected as early as practical.

Startup-time validation is preferable to discovering invalid dependency configuration during a business operation.

## Dependency Injection and Type Safety

TypeScript can detect many missing or incompatible dependencies at compile time:

```ts
const service = new UserService(repository, logger);
```

If `repository` does not satisfy the required contract, the compiler can reject the composition.

Runtime validation may still be necessary for JavaScript consumers or dynamically loaded components.

## Dependency Injection and Dynamic Modules

Dynamically loaded modules can be injected if they satisfy a runtime contract:

```js
const plugin = await loadPlugin();

const service = createService({
    plugin
});
```

The system should validate plugin contracts before execution when the source is dynamic or untrusted.

## Dependency Injection and Security Boundaries

Dependency Injection should not be treated as a security mechanism.

Supplying a dependency through a constructor does not establish authorization.

Security-sensitive dependencies should still enforce their own invariants and permissions.

The composition root should also ensure that privileged implementations are not accidentally supplied to untrusted
components.

## Refactoring Toward Dependency Injection

A common starting point is internal construction:

```js
class UserService {
    constructor() {
        this.repository = new DatabaseRepository();
    }
}
```

Refactor the dependency into the constructor:

```js
class UserService {
    constructor(repository) {
        this.repository = repository;
    }
}
```

Then move construction outward:

```js
const repository = new DatabaseRepository();
const service = new UserService(repository);
```

The service no longer owns repository construction.

## Refactoring Global Dependencies

A global dependency:

```js
function createUser(id) {
    return globalRepository.save(id);
}
```

can become an explicit parameter:

```js
function createUser(id, repository) {
    return repository.save(id);
}
```

If the dependency is stable across many operations, it can then be captured by a factory:

```js
function createUserService(repository) {
    return {
        create(id) {
            return repository.save(id);
        }
    };
}
```

This progressively moves dependency management toward an explicit composition boundary.

## Refactoring Toward a Composition Root

Once components accept dependencies, application startup can assemble them:

```js
const database = createDatabase(config);
const repository = createRepository(database);
const logger = createLogger(config);

const service = createService({
    repository,
    logger
});
```

This creates a clear location for infrastructure selection.

## Recognizing a Dependency Injection Opportunity

Dependency Injection is particularly useful when:

1. A component constructs infrastructure dependencies internally.
2. A dependency must vary by environment.
3. A dependency needs deterministic testing.
4. A dependency has multiple implementations.
5. A dependency represents an external system.
6. A component should not know how a dependency is constructed.
7. Dependency lifetime must be controlled externally.
8. A component needs a policy or algorithm supplied by its caller.
9. A module boundary requires inversion of implementation dependencies.
10. A component's dependencies need to be visible as part of its contract.

## When Not to Use Dependency Injection

Do not introduce injection merely to make every value configurable.

Internal implementation details can remain internal.

A small pure function often needs no injected dependencies:

```js
function add(a, b) {
    return a + b;
}
```

There is no benefit in injecting arithmetic behavior unless the operation is genuinely variable.

Dependency Injection is most valuable when the dependency represents a meaningful boundary.

## Benefits

Dependency Injection provides:

* explicit dependencies;
* separation of construction and use;
* replaceable implementations;
* improved testability;
* controlled lifecycle;
* environment-specific configuration;
* reduced direct coupling;
* support for Dependency Inversion;
* clearer composition boundaries;
* easier substitution of infrastructure;
* more deterministic testing;
* explicit architectural connections.

## Costs

Dependency Injection can introduce:

* additional construction code;
* larger constructors;
* configuration complexity;
* dependency graph complexity;
* lifecycle-management complexity;
* excessive abstraction;
* container-specific behavior;
* hidden complexity when containers are overused.

Dependency Injection should therefore be applied where the dependency boundary has real architectural or behavioral
value.

## Decision Criteria

Use Constructor Injection for mandatory, stable dependencies.

Use Parameter Injection when a dependency is needed only for one operation or represents operation-specific policy.

Use Factory or Provider Injection when dependency creation itself must be controlled or deferred.

Use Property or Setter Injection when late configuration is genuinely required and temporary invalid states are
acceptable.

Use a Dependency Injection Container when dependency construction and lifecycle management are sufficiently complex to
justify one.

Use manual Dependency Injection when the dependency graph is small enough to understand directly.

Prefer narrow dependency contracts over large infrastructure objects.

Keep dependency construction near the composition root.

Do not confuse Dependency Injection with Dependency Inversion, Service Locator, Singleton, or Composition.

## Summary

Dependency Injection separates dependency use from dependency construction by supplying required collaborators from
outside the component that consumes them.

Constructor Injection is usually the clearest form for mandatory dependencies, while parameter, factory, provider,
property, setter, and method injection are useful in more specific circumstances. JavaScript supports Dependency
Injection naturally through functions, closures, factory functions, classes, objects, and ordinary values; no framework
or container is required.

Dependency Injection works particularly well with Composition, Dependency Inversion, Ports and Adapters, Clean
Architecture, Strategy, Adapter, Decorator, Factory, and modular application design. However, it remains a mechanism
rather than a complete architectural pattern.

A good Dependency Injection design makes dependencies explicit, keeps contracts narrow, separates construction from
behavior, defines lifecycle ownership, and places assembly decisions at an appropriate composition boundary.

The goal is not to inject everything. The goal is to make meaningful dependencies explicit where doing so reduces
coupling, improves substitution, clarifies architecture, or establishes a useful testing and lifecycle boundary.
