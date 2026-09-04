# Composition Patterns

Composition Patterns describe techniques for constructing objects and behavior by combining independent components
rather than deriving everything from a single inheritance hierarchy.

Composition is one of the fundamental ways to structure JavaScript systems. Objects can delegate behavior to other
objects, functions can be combined into larger functions, capabilities can be assembled from smaller components, and
higher-level components can coordinate lower-level ones.

Composition is not one single design pattern. It is a family of design techniques and relationships. Patterns such as
Decorator, Composite, Strategy, Bridge, Facade, and Chain of Responsibility can all use composition, but each solves a
different problem.

The central design principle is to prefer assembling independent behavior where that produces clearer dependencies and
variation than inheritance.

## Composition as a Design Principle

Composition means constructing a larger abstraction from smaller abstractions.

For example:

```js
const logger = {
    log(message) {
        console.log(message);
    }
};

const validator = {
    validate(value) {
        return value.length > 0;
    }
};

const service = {
    logger,
    validator
};
```

The service is composed from separate capabilities.

The components retain their own responsibilities rather than being forced into a parent-child inheritance relationship.

Composition therefore primarily concerns how responsibilities are assembled.

## Composition Over Inheritance

The principle commonly expressed as **favor composition over inheritance** means that behavior should often be assembled
from collaborating components instead of being obtained through increasingly deep inheritance hierarchies.

Inheritance creates a structural relationship between a derived abstraction and its base abstraction.

Composition creates relationships between collaborating components.

Consider an inheritance-oriented design:

```js
class Vehicle {
    move() {
        // ...
    }
}

class Car extends Vehicle {
    // ...
}
```

A composed design might instead represent movement as an independent capability:

```js
const movement = {
    move() {
        // ...
    }
};

const car = {
    movement
};
```

The appropriate choice depends on the domain. Composition is not a universal replacement for inheritance.

## Why Composition Is Often Preferred

Composition can provide:

* smaller responsibilities;
* explicit dependencies;
* replaceable components;
* independent testing;
* runtime configuration;
* reduced coupling to class hierarchies;
* easier reuse across unrelated objects;
* clearer ownership of state;
* more localized changes.

These benefits become particularly important when a system has several independent dimensions of variation.

## Composition and Coupling

Composition does not eliminate coupling.

A composed object is still coupled to the components it uses.

The important difference is that the coupling is often explicit.

```js
class OrderService {
    constructor(repository, paymentService, logger) {
        this.repository = repository;
        this.paymentService = paymentService;
        this.logger = logger;
    }
}
```

The service explicitly depends on three collaborators.

This is generally easier to replace and test than dependencies hidden in a deep inheritance hierarchy.

## Composition and Cohesion

Composition works best when each component has a cohesive responsibility.

A component should not become a generic container for unrelated functionality merely because composition makes it
technically possible.

For example:

```js
const userService = {
    createUser() {
    },
    sendEmail() {
    },
    generatePdf() {
    },
    calculateTax() {
    },
    writeAuditLog() {
    }
};
```

Calling this object a composed component does not make its responsibilities cohesive.

Composition should produce meaningful collaborators, not arbitrary collections of methods.

## Object Composition

Object composition combines objects through references.

```js
const repository = {
    findById(id) {
        // ...
    }
};

const service = {
    repository,

    getUser(id) {
        return this.repository.findById(id);
    }
};
```

The service does not inherit repository behavior.

It collaborates with the repository explicitly.

This is the most common form of composition in application architecture.

## Delegation

Delegation is a core composition technique.

An object forwards part of its responsibility to another object:

```js
const paymentProcessor = {
    charge(amount) {
        // ...
    }
};

const checkout = {
    processor: paymentProcessor,

    pay(amount) {
        return this.processor.charge(amount);
    }
};
```

The checkout object remains responsible for the checkout operation while delegating payment processing to another
component.

Delegation can be explicit and narrowly scoped.

## Explicit Capability Composition

Objects can be assembled from capabilities.

```js
const canSerialize = {
    serialize() {
        return JSON.stringify(this.data);
    }
};

const canValidate = {
    validate() {
        return this.data != null;
    }
};

const object = {
    data: {},
    serialization: canSerialize,
    validation: canValidate
};
```

The capabilities are separate from the primary object's state and can be reused independently.

An alternative is to expose the capabilities directly through methods copied or delegated onto the object.

The choice depends on whether the capability should remain an identifiable collaborator or become part of the object's
direct interface.

## Composition Through Functions

JavaScript functions can be composed just as objects can.

A function can become the input to another function:

```js
const trim = value => value.trim();
const lowercase = value => value.toLowerCase();
const normalize = value => lowercase(trim(value));
```

The resulting function is composed from smaller transformations.

Functional composition is particularly useful for:

* data transformation;
* validation;
* parsing;
* normalization;
* request processing;
* event processing;
* reusable business rules.

## Higher-Order Function Composition

Higher-order functions can create composed behavior:

```js
const withLogging = fn => (...args) => {
    console.log("calling function");
    return fn(...args);
};

const withValidation = fn => (...args) => {
    if (args.length === 0) {
        throw new Error("Missing arguments");
    }

    return fn(...args);
};

const operation = withLogging(
    withValidation(
        value => value * 2
    )
);
```

The resulting function combines independent responsibilities.

This is composition even though no objects or classes are involved.

## Function Composition

A general composition helper can combine functions:

```js
const compose = (...functions) => value =>
    functions.reduceRight(
        (result, fn) => fn(result),
        value
    );
```

For example:

```js
const trim = value => value.trim();
const lowercase = value => value.toLowerCase();
const normalize = compose(lowercase, trim);

normalize("  HELLO  ");
```

The implementation of composition should remain subordinate to the semantics of the composed functions.

If function order matters, that order should be explicit.

## Pipeline Composition

Pipeline-style composition applies operations in sequence:

```js
const pipe = (...functions) => value =>
    functions.reduce(
        (result, fn) => fn(result),
        value
    );

const normalize = pipe(
    value => value.trim(),
    value => value.toLowerCase(),
    value => value.replace(/\s+/g, " ")
);
```

Pipeline composition is especially useful when each stage transforms the result of the previous stage.

It is conceptually different from Chain of Responsibility, where handlers may decide whether to handle a request and may
terminate or continue responsibility processing.

## Async Composition

Composition also applies to asynchronous functions:

```js
const loadUser = async id => {
    // ...
};

const loadPermissions = async user => {
    // ...
};

const getUserPermissions = async id => {
    const user = await loadUser(id);
    return loadPermissions(user);
};
```

Async composition requires explicit handling of:

* promise resolution;
* rejection;
* cancellation;
* ordering;
* concurrency;
* resource ownership.

Sequential composition should not be confused with parallel composition.

## Parallel Composition

Independent operations can sometimes be composed concurrently:

```js
const [user, settings] = await Promise.all([
    loadUser(id),
    loadSettings(id)
]);
```

The operations are composed into a larger operation, but they execute independently.

Parallel composition requires understanding failure semantics. If one operation rejects, `Promise.all()` rejects even
though another operation may have completed successfully.

Composition therefore does not imply sequential execution.

## Component Composition

A component can be constructed from smaller components:

```js
const header = {
    render() {
        return "<header></header>";
    }
};

const content = {
    render() {
        return "<main></main>";
    }
};

const page = {
    render() {
        return header.render() + content.render();
    }
};
```

The page delegates rendering to its constituent components.

This form of composition is common in:

* UI systems;
* service layers;
* application services;
* adapters;
* infrastructure components;
* domain services.

## Structural Composition

Structural composition concerns building a larger object from smaller objects.

For example:

```js
const address = {
    street: "Example Street",
    city: "Skopje"
};

const customer = {
    name: "Alice",
    address
};
```

The customer contains an address as part of its structure.

Structural composition does not necessarily imply behavioral composition.

A value object can be composed into a larger domain object without providing delegated behavior.

## Behavioral Composition

Behavioral composition combines responsibilities or operations.

```js
const cache = {
    get(key) {
        // ...
    }
};

const repository = {
    find(key) {
        // ...
    }
};

const cachedRepository = {
    find(key) {
        const cached = cache.get(key);

        if (cached !== undefined) {
            return cached;
        }

        const value = repository.find(key);
        // cache value
        return value;
    }
};
```

The resulting component combines repository access with caching behavior.

When this becomes a reusable wrapping mechanism, it approaches the Decorator pattern.

## Composition Through Constructor Injection

Constructor injection is a common way to establish object composition.

```js
class OrderService {
    constructor(repository, paymentProcessor, logger) {
        this.repository = repository;
        this.paymentProcessor = paymentProcessor;
        this.logger = logger;
    }

    async createOrder(order) {
        // ...
    }
}
```

The service is composed from collaborators supplied externally.

This separates object construction from dependency selection.

It also makes dependencies visible in the constructor contract.

## Composition Through Factory Functions

Factory Functions can construct composed objects:

```js
function createOrderService({
                                repository,
                                paymentProcessor,
                                logger
                            }) {
    return {
        async createOrder(order) {
            logger.log("Creating order");

            const saved = await repository.save(order);

            await paymentProcessor.charge(saved.total);

            return saved;
        }
    };
}
```

The factory establishes the composition while the resulting object contains the application behavior.

This is particularly natural in JavaScript because object literals and closures can provide lightweight component
boundaries.

## Composition and Dependency Injection

Dependency Injection is closely related to composition but is not the same concept.

Composition determines which components collaborate.

Dependency Injection determines how those dependencies are supplied to a component.

For example:

```js
function createService(repository) {
    return {
        find(id) {
            return repository.find(id);
        }
    };
}
```

The service is composed with a repository.

Passing the repository into the factory is dependency injection.

The two concepts frequently appear together.

## Composition Roots

Large systems should generally have a deliberate location where major components are assembled.

For example:

```js
const repository = createRepository(database);
const paymentProcessor = createPaymentProcessor(gateway);
const service = createOrderService({
    repository,
    paymentProcessor,
    logger
});
```

This assembly location is often called a composition root.

The composition root owns dependency selection and wiring rather than allowing individual components to construct their
own infrastructure dependencies.

## Composition and Dependency Inversion

Composition works particularly well with Dependency Inversion.

A high-level component can depend on an abstraction while the composition root supplies a concrete implementation.

```js
const service = createOrderService({
    repository: postgresRepository
});
```

The service does not need to know how the repository was constructed.

This makes infrastructure replaceable without changing the high-level component.

## Interface Composition

A component can depend on a narrow interface rather than an entire object.

For example:

```js
function createReportService({
                                 loadData,
                                 formatReport
                             }) {
    return {
        async generate() {
            const data = await loadData();
            return formatReport(data);
        }
    };
}
```

The service requires only two capabilities.

This is often preferable to passing a large infrastructure object with dozens of unrelated operations.

## Capability Interfaces

Composition can be based on capabilities rather than concrete types.

For example:

```js
function createImporter({read, parse, validate}) {
    return {
        async import(source) {
            const content = await read(source);
            const data = parse(content);

            validate(data);

            return data;
        }
    };
}
```

The importer does not require a particular file reader, parser, or validator implementation.

It requires capabilities.

This aligns naturally with structural typing in TypeScript.

## TypeScript Composition

TypeScript interfaces can define composable contracts:

```ts
interface Repository<T> {
    findById(id: string): Promise<T>;
}

interface Logger {
    log(message: string): void;
}

interface PaymentProcessor {
    charge(amount: number): Promise<void>;
}
```

A service can then depend on those contracts:

```ts
class OrderService {
    constructor(
        private readonly repository: Repository<Order>,
        private readonly logger: Logger,
        private readonly paymentProcessor: PaymentProcessor
    ) {
    }
}
```

The resulting design is composition through explicit dependencies rather than inheritance.

## Intersection Types

TypeScript can represent composed capabilities with intersection types:

```ts
type Serializable = {
    serialize(): string;
};

type Validatable = {
    validate(): boolean;
};

type Entity = Serializable & Validatable;
```

This expresses that an object satisfies multiple contracts.

Intersection types describe the resulting type shape; they do not automatically determine how the runtime object is
composed.

## Mixin Composition

Mixins combine behavior into objects or classes.

A simple object-based approach is:

```js
const timestampMixin = {
    getTimestamp() {
        return this.timestamp;
    }
};

const loggingMixin = {
    log(message) {
        console.log(message);
    }
};

const prototype = Object.assign(
    {},
    timestampMixin,
    loggingMixin
);
```

Mixin composition can provide reusable behavior without establishing an inheritance relationship with every behavior
source.

However, mixins can introduce naming collisions and hidden dependencies on object state.

## Mixin Collisions

Consider:

```js
const firstMixin = {
    save() {
        // ...
    }
};

const secondMixin = {
    save() {
        // ...
    }
};

const combined = Object.assign(
    {},
    firstMixin,
    secondMixin
);
```

The later property overwrites the earlier one.

Large collections of mixins can therefore make ownership of behavior difficult to determine.

Explicit composition is often clearer when capabilities have significant semantics.

## Composition Through Closures

Closures can compose private state with public behavior:

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

Multiple such components can be composed:

```js
function createService(counter, logger) {
    return {
        execute() {
            counter.increment();
            logger.log(counter.getValue());
        }
    };
}
```

The service does not need direct access to the private state of either component.

This provides strong encapsulation through composition.

## Composition and Encapsulation

Composition can strengthen encapsulation when components expose narrow interfaces.

A composed object should not normally reach into another component's internal representation.

Prefer:

```js
repository.findById(id);
```

over:

```js
repository.connection.tables.users.find(id);
```

The first establishes a component boundary.

The second exposes implementation details and weakens the value of composition.

## Composition and Information Hiding

Composition and information hiding reinforce each other.

A component can hide its implementation while exposing only the operations needed by its collaborators.

This makes the composed system less sensitive to internal implementation changes.

However, composition does not automatically provide information hiding. Exposing every internal collaborator publicly
can simply move coupling into object graphs.

## Composition and Object Ownership

Composition creates ownership questions.

If an object contains another object, determine whether it:

* owns the collaborator;
* merely references it;
* shares it;
* creates it;
* disposes it;
* configures it;
* delegates to it.

For example:

```js
class Service {
    constructor(repository) {
        this.repository = repository;
    }
}
```

The service references the repository but does not necessarily own its lifecycle.

Lifecycle ownership should be explicit in systems involving resources such as connections, streams, workers, or
subscriptions.

## Shared Components

A component can be shared by multiple composed objects:

```js
const logger = createLogger();

const firstService = createService({
    logger
});

const secondService = createService({
    logger
});
```

This can be desirable for stateless or deliberately shared infrastructure.

It can also create hidden shared state if the component is mutable.

The lifetime and mutability of shared collaborators should therefore be intentional.

## Stateful Components

Composition becomes more complex when collaborators maintain state.

```js
const cache = createCache();

const serviceA = createService({cache});
const serviceB = createService({cache});
```

Both services now interact with the same cache.

This can be correct, but it changes the semantics of the composed system.

A useful design question is whether the collaborator should be:

* per operation;
* per object;
* per request;
* per session;
* per process;
* globally shared.

Composition should make those lifecycle decisions explicit.

## Composition and Immutability

Immutable components are particularly easy to compose.

```js
const configuration = Object.freeze({
    timeout: 5000,
    retries: 3
});
```

Multiple components can safely reference the same immutable configuration.

Mutable components require stronger ownership and synchronization rules.

Immutability therefore reduces some of the complexity associated with shared composition.

## Composition and State Transitions

A composed object can delegate state transitions to another component:

```js
const stateMachine = {
    transition(event) {
        // ...
    }
};

const workflow = {
    stateMachine,

    handle(event) {
        return this.stateMachine.transition(event);
    }
};
```

If the state-dependent behavior becomes the primary design concern, the State pattern may be more appropriate than
treating the state machine merely as a generic collaborator.

Composition is the mechanism; State is the behavioral pattern.

## Composition and Strategy

Strategy is itself commonly implemented through composition.

```js
class Checkout {
    constructor(pricingStrategy) {
        this.pricingStrategy = pricingStrategy;
    }

    calculateTotal(order) {
        return this.pricingStrategy.calculate(order);
    }
}
```

The checkout object is composed with a pricing strategy.

Composition answers how the strategy is supplied.

Strategy answers why multiple interchangeable algorithms exist.

## Composition and Decorator

Decorator uses composition by wrapping one component inside another component with the same conceptual contract.

```js
const loggingRepository = {
    async findById(id) {
        console.log("findById", id);
        return repository.findById(id);
    }
};
```

The defining property of Decorator is not merely composition. It is that the wrapper preserves the component contract
while adding responsibilities.

Therefore:

**Composition is the general mechanism; Decorator is a specific behavioral structure built using composition.**

## Composition and Composite

Composite uses composition to build recursive part-whole structures.

```js
const group = {
    children: [
        itemA,
        itemB
    ]
};
```

The defining property of Composite is that individual objects and compositions are treated through a common component
abstraction.

Composition itself does not require recursion or uniform treatment of parts and wholes.

## Composition and Bridge

Bridge deliberately composes an abstraction with an implementation.

```js
class RemoteControl {
    constructor(device) {
        this.device = device;
    }
}
```

The composition separates two dimensions of variation.

Generic composition does not necessarily imply Bridge.

Bridge is appropriate when the abstraction and implementation need to vary independently.

## Composition and Adapter

Adapter may contain a composed adaptee:

```js
class PaymentAdapter {
    constructor(gateway) {
        this.gateway = gateway;
    }

    pay(amount) {
        return this.gateway.charge(amount);
    }
}
```

The important property is interface translation.

Composition is merely how the adapter obtains access to the adapted object.

## Composition and Facade

Facade often composes several subsystem components:

```js
class OrderFacade {
    constructor(inventory, payment, shipping) {
        this.inventory = inventory;
        this.payment = payment;
        this.shipping = shipping;
    }

    async placeOrder(order) {
        // coordinate subsystem operations
    }
}
```

The defining property of Facade is the simplified subsystem-facing interface.

Composition provides the collaborators used to implement that interface.

## Composition and Mediator

Mediator is also composition-heavy because the mediator holds or receives references to participating components.

The distinction is responsibility.

Generic composition assembles collaborators.

Mediator specifically centralizes how a set of objects interact with one another.

## Composition and Chain of Responsibility

A chain is commonly represented by composition:

```js
const firstHandler = {
    next: secondHandler
};
```

The important behavior is responsibility propagation through handlers.

Composition provides the structural connection.

Chain of Responsibility defines the semantics of request handling.

## Composition and Observer

Observer depends on composition through references to observers:

```js
const subject = {
    observers: []
};
```

The defining behavior is one-to-many notification and subscription management.

Composition itself does not imply notification semantics.

## Composition and Null Object

A Null Object can be supplied as a composed dependency:

```js
const service = createService({
    logger: nullLogger
});
```

The service can operate without conditional checks because the Null Object satisfies the expected contract.

Composition provides the dependency relationship.

Null Object defines the absence behavior.

## Composition and Flyweight

Flyweight uses composition to externalize extrinsic state.

```js
const glyph = glyphFactory.get("A");

const renderedGlyph = {
    glyph,
    position: {x: 10, y: 20}
};
```

The flyweight contains shared intrinsic data while the composed context supplies extrinsic state.

The defining concern is state sharing and memory optimization, not composition alone.

## Composition and Prototype-Based Design

Prototype-based design uses delegation through prototype relationships.

Composition can instead be explicit:

```js
const service = {
    repository,
    logger
};
```

The two approaches can be combined.

A prototype can define shared behavior while individual objects contain composed collaborators:

```js
const servicePrototype = {
    execute() {
        this.logger.log("executing");
        return this.repository.find();
    }
};

const service = Object.create(servicePrototype);

service.repository = repository;
service.logger = logger;
```

Prototype delegation and object composition solve different structural concerns.

## Composition Versus Inheritance

Inheritance should generally represent a meaningful substitutability relationship rather than merely a desire to reuse
code.

If the primary requirement is:

* reuse this algorithm;
* add this capability;
* use this implementation;
* delegate this responsibility;
* combine these services;
* vary this policy;

composition is often more appropriate.

If the model genuinely requires subtype relationships and inherited invariants, inheritance may be appropriate.

## Composition Versus Copying

Copying properties is not necessarily composition.

```js
const result = Object.assign({}, first, second);
```

This produces a new object containing copied properties.

The original components are not necessarily collaborators of `result`.

Composition generally implies a meaningful relationship between the resulting component and its constituent components,
whether through delegation, containment, wrapping, or function application.

## Composition Versus Aggregation

Aggregation describes a relationship in which an object refers to other objects that can exist independently.

```js
const team = {
    members
};
```

The members can exist independently of the team.

Composition is sometimes used more broadly to include such relationships, but strict object-model terminology may
distinguish composition from aggregation based on ownership and lifecycle semantics.

The exact terminology should be defined consistently within the system.

## Composition Versus Containment

Containment means that an object stores another object as part of its state.

```js
const order = {
    customer,
    items
};
```

Containment is one implementation mechanism for composition.

Not every contained object is necessarily a compositional abstraction, because the relationship may simply represent
domain data.

## Composition and API Design

A composed object should expose only the operations that consumers actually need.

For example:

```js
function createCheckout({paymentProcessor}) {
    return {
        pay(amount) {
            return paymentProcessor.charge(amount);
        }
    };
}
```

The checkout does not need to expose the entire payment processor.

This keeps the public API smaller and limits coupling.

## Composition and Law of Demeter

Composition can violate the Law of Demeter when consumers traverse long collaborator chains:

```js
order.customer.account.paymentMethod.gateway.charge(amount);
```

This exposes the internal structure of the composed object graph.

A better design often delegates the operation:

```js
order.charge(amount);
```

The order object can then coordinate the required collaborators internally.

Composition should therefore reduce unnecessary structural knowledge rather than merely create large object graphs.

## Composition and Tell, Don't Ask

Composed objects can encapsulate behavior by delegating operations rather than exposing internal data.

Prefer:

```js
order.calculateTotal();
```

over:

```js
order.items.reduce(
    (total, item) => total + item.price,
    0
);
```

when the calculation is conceptually owned by the order.

Composition should preserve responsibility boundaries.

## Composition and Testing

Composition generally improves testing because collaborators can be replaced.

```js
const repository = {
    findById: async () => ({
        id: "1",
        name: "Test"
    })
};

const service = createService({repository});
```

A test can provide a controlled collaborator without constructing the entire infrastructure stack.

This creates a natural seam for unit testing.

## Test Doubles

Composed dependencies can be replaced with:

* stubs;
* mocks;
* spies;
* fakes;
* deterministic implementations;
* Null Objects.

The component under test should depend on a sufficiently narrow contract so that the test double does not need to
reproduce irrelevant behavior.

## Composition and Error Handling

A composed operation must define what happens when a collaborator fails.

```js
async function execute({repository, paymentProcessor}) {
    const order = await repository.find();

    await paymentProcessor.charge(order.total);

    return order;
}
```

If payment fails after the order has been persisted, the system may require compensation, rollback, retry, or a
different transaction boundary.

Composition therefore creates an operational dependency graph whose failure semantics must be designed explicitly.

## Composition and Transactions

When multiple composed components participate in one business operation, transaction ownership becomes important.

For example, an operation involving:

* persistence;
* payment;
* inventory;
* messaging;

may cross several transactional boundaries.

The fact that components are composed does not automatically make the overall operation atomic.

Distributed side effects may require idempotency, transactional messaging, compensation, or workflow orchestration.

## Composition and Resource Ownership

Resource-owning components should define who is responsible for releasing resources.

Examples include:

* database connections;
* file handles;
* streams;
* subscriptions;
* workers;
* sockets;
* timers.

If a composed object creates a resource, it may own its lifecycle.

If the resource is injected, ownership may remain with the composition root.

Ambiguous ownership leads to leaks and premature cleanup.

## Composition and Asynchronous Lifecycles

A composed component can outlive the operation that created it.

For example, a service may subscribe to events during initialization.

```js
const unsubscribe = eventBus.subscribe(handler);
```

The component then needs a corresponding lifecycle operation:

```js
unsubscribe();
```

Composition therefore requires lifecycle management when collaborators maintain external registrations.

## Composition and Cancellation

When composed operations are cancellable, cancellation should propagate through the component boundaries.

```js
async function loadData({signal, repository}) {
    return repository.findAll({signal});
}
```

A composed operation that accepts an `AbortSignal` should generally pass it to collaborators that support cancellation.

Otherwise cancellation may stop the outer operation while underlying work continues.

## Composition and Observability

Composed systems can make tracing and logging easier when boundaries are explicit.

A service can instrument its collaborators:

```js
const service = createService({
    repository: tracedRepository,
    logger
});
```

Alternatively, Decorator-style wrappers can add observability without modifying the underlying component.

The important distinction is that composition provides the connection; the observability behavior comes from the
selected component or wrapper.

## Performance

Composition introduces indirection.

A method may call another component, which calls another component, and so on.

This can increase call depth and object count.

In most application systems, the architectural benefits outweigh small amounts of invocation overhead.

Performance-sensitive systems should measure actual bottlenecks rather than avoiding composition based on theoretical
overhead.

## Allocation and Object Graph Size

Fine-grained composition can produce many objects:

```js
const service = {
    validator,
    repository,
    cache,
    logger,
    metrics,
    formatter
};
```

This is not inherently problematic.

However, excessive decomposition can produce object graphs whose lifecycle and ownership are difficult to manage.

Component granularity should therefore be driven by responsibility boundaries rather than a goal of maximizing the
number of abstractions.

## Over-Composition

Composition can be taken too far.

A system becomes over-composed when trivial operations are extracted into components that add more indirection than
value.

For example, creating separate objects for every two-line operation can make straightforward logic difficult to follow.

Composition is useful when the resulting boundary provides meaningful:

* variation;
* reuse;
* isolation;
* ownership;
* testing;
* lifecycle;
* dependency management.

Without such value, direct implementation may be clearer.

## Dependency Graph Complexity

Composition makes dependencies explicit, but a system with hundreds of components can still become difficult to
understand.

A component graph should have coherent boundaries and preferably predictable dependency direction.

If many components depend on one another bidirectionally, composition has not solved the underlying coupling problem.

The dependency graph itself should be designed.

## Circular Dependencies

Composition can create cycles:

```js
const a = {
    b
};

const b = {
    a
};
```

Cycles may be legitimate, but they complicate lifecycle, initialization, testing, and reasoning.

At architectural boundaries, circular dependencies often indicate that responsibilities need to be reorganized.

## Composition and Module Boundaries

Composition should normally occur through module-level contracts rather than reaching into module internals.

```js
import {createRepository} from "./repository.js";
import {createService} from "./service.js";
```

The composition root can assemble exported components while preserving module encapsulation.

This makes module boundaries and object boundaries reinforce each other.

## Composition in Application Architecture

Composition is fundamental to layered and component-oriented architecture.

An application can be composed from:

* domain components;
* application services;
* repositories;
* infrastructure adapters;
* external clients;
* message handlers;
* configuration providers;
* observability components.

Each component should have a defined responsibility and dependency contract.

The architecture then emerges from how those components are composed.

## Composition in Domain Models

Domain objects can be composed from value objects and domain components.

```js
const money = {
    amount: 100,
    currency: "EUR"
};

const orderLine = {
    productId: "P1",
    quantity: 2,
    price: money
};
```

This can produce a more expressive domain model than storing unrelated primitive values everywhere.

Composition should reflect domain relationships rather than simply mirroring database tables.

## Composition in UI Systems

UI systems commonly use composition to construct larger interfaces from smaller components.

```js
const page = {
    header,
    navigation,
    content,
    footer
};
```

A component can therefore be assembled from independent visual and behavioral units.

The same principle applies regardless of whether the UI system uses classes, functions, templates, or a framework.

## Composition in Middleware

Middleware systems commonly compose functions:

```js
const middleware = [
    authenticate,
    authorize,
    validate,
    handler
];
```

The framework combines them into a larger request-processing behavior.

Depending on the control semantics, this may also constitute Chain of Responsibility or pipeline processing.

The word composition describes the assembly mechanism; the specific pattern depends on the runtime behavior.

## Composition in Event Processing

Event handlers can be composed into a larger processing system:

```js
const handlers = [
    validateEvent,
    enrichEvent,
    persistEvent,
    publishEvent
];
```

If every stage executes in order, this resembles a pipeline.

If handlers independently decide whether to handle the event, it may resemble Chain of Responsibility.

If subscribers are notified independently, it may instead be Observer or Pub/Sub.

The behavioral semantics determine the pattern.

## Composition in Plugin Systems

Plugins are naturally compositional.

```js
const application = createApplication({
    plugins: [
        authenticationPlugin,
        metricsPlugin,
        reportingPlugin
    ]
});
```

The application is assembled from independently developed extensions.

A plugin architecture should define:

* plugin contract;
* initialization;
* ordering;
* lifecycle;
* failure behavior;
* dependency requirements;
* version compatibility;
* isolation boundaries.

Composition alone does not provide those semantics.

## Composition and Configuration

Configuration often determines which components are composed.

```js
const service = createService({
    repository: config.useMemory
        ? memoryRepository
        : databaseRepository
});
```

This allows deployment-specific composition without changing the service implementation.

Configuration should select valid implementations rather than becoming an untyped mechanism for arbitrary runtime
behavior.

## Composition and Factories

Factories are frequently used at the composition boundary.

```js
const repository = repositoryFactory.create(config);
const payment = paymentFactory.create(config);

const service = createService({
    repository,
    payment
});
```

The factory decides which concrete component to create.

The composed component depends only on the resulting contract.

## Composition and Abstract Factory

Abstract Factory provides coordinated creation of related families of objects.

Composition can then assemble those objects into an application component.

The distinction is:

* Composition assembles collaborators.
* Factory creates collaborators.
* Abstract Factory coordinates creation of related product families.

These concerns commonly coexist.

## Common Misuse

A common misuse is treating composition as automatically superior to inheritance.

Another is composing components whose responsibilities are too small to justify separate boundaries.

Another is passing large objects instead of narrow capability interfaces.

Another is exposing internal collaborators through public APIs.

Another is creating hidden shared state between composed objects.

Another is allowing the composition root to become a massive collection of hard-coded infrastructure decisions.

Another is using composition to avoid making a necessary domain relationship explicit.

## Composition Root Becoming a God Component

A composition root can itself become overly complex:

```js
const application = createApplication({
    repository: createRepository(...),
    cache: createCache(...),
    logger: createLogger(...),
    metrics: createMetrics(...),
    payment: createPayment(...),
    ...
});
```

Some complexity is unavoidable because dependencies must be assembled somewhere.

The solution is not to hide composition but to structure it into meaningful factories, modules, configuration layers, or
subsystem composition boundaries.

## Hidden Composition

Composition becomes difficult to reason about when components construct their own dependencies internally:

```js
function createService() {
    const repository = createDatabaseRepository();
    const logger = createProductionLogger();

    return {
        // ...
    };
}
```

The service is still technically composed from collaborators, but dependency selection is hidden inside it.

Explicit dependency injection usually provides a clearer composition boundary.

## Composition and Service Locators

A Service Locator can technically provide composed dependencies:

```js
serviceLocator.get("repository");
```

but this hides dependencies behind a global or indirect lookup mechanism.

Explicit constructor or factory injection generally makes the composition more visible.

Composition and Service Locator are therefore not equivalent.

## Refactoring Toward Composition

A common refactoring begins with a class containing unrelated responsibilities:

```js
class OrderService {
    saveOrder(order) {
        // persistence
    }

    chargePayment(order) {
        // payment
    }

    sendEmail(order) {
        // notification
    }
}
```

Those responsibilities can be extracted:

```js
const orderService = createOrderService({
    repository,
    paymentProcessor,
    notifier
});
```

The resulting service coordinates collaborators instead of implementing every responsibility itself.

## Refactoring Inheritance Toward Composition

Suppose several subclasses exist primarily because they need different algorithms.

```js
class Report {
    generate() {
        // ...
    }
}

class PdfReport extends Report {
    // ...
}

class HtmlReport extends Report {
    // ...
}
```

If the actual variation is report formatting, composition may be clearer:

```js
const report = createReport({
    formatter: htmlFormatter
});
```

The formatter becomes an explicit collaborator.

This is a common transition from inheritance toward Strategy-style composition.

## Refactoring Prototype Reuse Toward Explicit Composition

Prototype-based reuse can sometimes hide dependencies.

Instead of placing unrelated capabilities on a shared prototype:

```js
const servicePrototype = {
    validate() {
    },
    save() {
    },
    sendEmail() {
    }
};
```

those responsibilities can become explicit collaborators:

```js
const service = createService({
    validator,
    repository,
    notifier
});
```

This is often clearer when the capabilities are independently replaceable.

## Recognizing an Opportunity

Composition is a strong candidate when:

1. An object depends on several independently replaceable behaviors.
2. Different implementations need to be selected at runtime.
3. Multiple unrelated objects need the same capability.
4. An inheritance hierarchy exists primarily for code reuse.
5. A component contains several distinct responsibilities.
6. Dependencies should be explicit and testable.
7. Lifecycle ownership needs to be controlled independently.
8. Components need to be assembled differently in different environments.
9. The system benefits from narrow contracts.
10. Behavior can be expressed as independent functions or objects.

## When Not to Introduce Composition

Do not introduce a separate component merely because a method could theoretically be extracted.

A direct implementation can be preferable when:

* the behavior has no independent variation;
* it has no meaningful reuse;
* it has no separate lifecycle;
* testing does not benefit from substitution;
* extraction would create unnecessary indirection;
* the domain relationship is already clear without another abstraction.

Composition should reduce meaningful coupling, not maximize abstraction count.

## Benefits

Composition provides:

* explicit dependencies;
* replaceable implementations;
* reusable capabilities;
* smaller responsibilities;
* reduced dependence on inheritance;
* easier unit testing;
* runtime configurability;
* independent lifecycle management;
* clearer dependency direction;
* support for object and functional styles;
* compatibility with dependency injection;
* natural support for modular architectures.

It is one of the primary mechanisms through which JavaScript applications can be assembled from independently
understandable components.

## Costs

Composition can introduce:

* additional objects and indirection;
* larger dependency graphs;
* lifecycle-management complexity;
* more configuration;
* potential circular dependencies;
* excessive fragmentation;
* shared-state problems;
* more complex error propagation;
* additional interface design.

The goal is therefore not maximal composition but useful composition.

## Decision Criteria

Use composition when a larger responsibility can be expressed cleanly as collaboration among smaller independent
responsibilities.

Use inheritance when a genuine subtype relationship and shared invariants make the hierarchy clearer.

Use Prototype-Based Design when direct object delegation is the important mechanism.

Use Strategy when the composed component represents an interchangeable algorithm or policy.

Use Decorator when a component must be wrapped with additional responsibilities while preserving its contract.

Use Composite when compositions form recursive part-whole structures that should be treated uniformly.

Use Bridge when two dimensions of abstraction and implementation need to vary independently.

Use Adapter when an existing component has the wrong interface.

Use Facade when a complex subsystem needs a simpler public interface.

Use Mediator when the main problem is coordinating interactions among multiple objects.

Composition is often the underlying mechanism for several of these patterns, but it should not be confused with their
specific behavioral intent.

## Summary

Composition Patterns describe the techniques used to build larger behavior from smaller collaborating components. In
JavaScript, this can be implemented through object references, delegation, containment, higher-order functions, function
composition, closures, dependency injection, factories, mixins, and prototype-based delegation.

Composition is fundamentally about assembly and collaboration. It does not by itself define the semantics of the
resulting system. Decorator adds responsibilities through wrapping, Strategy provides interchangeable algorithms,
Composite models recursive part-whole structures, Bridge separates abstraction from implementation, Adapter translates
interfaces, Facade simplifies a subsystem, Mediator coordinates collaboration, and Chain of Responsibility distributes
request handling. All can use composition without being equivalent to generic composition.

The strongest composition designs make dependencies explicit, keep component responsibilities cohesive, use narrow
contracts, define ownership and lifecycle clearly, and avoid unnecessary object-graph complexity.

The principle is not that inheritance is always wrong or composition is always better. The useful distinction is whether
the relationship being modeled is primarily a subtype hierarchy or a collaboration among independently variable
responsibilities. When the latter is true, composition usually provides the more flexible design.
