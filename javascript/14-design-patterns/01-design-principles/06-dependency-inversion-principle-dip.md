# Dependency Inversion Principle (DIP)

The **Dependency Inversion Principle (DIP)** states that high-level policy should not depend directly on low-level
implementation details. Both should depend on abstractions, and abstractions should not depend on implementation
details. DIP is fundamentally about **dependency direction** and the ownership of the boundary between policy and
implementation.

The principle is commonly expressed through two rules:

1. **High-level modules should not depend on low-level modules. Both should depend on abstractions.**
2. **Abstractions should not depend on details. Details should depend on abstractions.**

A common architectural problem occurs when high-level application logic directly depends on concrete infrastructure.
Changes in infrastructure can then propagate upward into policy code. DIP inverts this relationship so that high-level
policy depends on an abstraction while the low-level implementation conforms to that abstraction. The conventional
dependency `Policy → Detail` therefore becomes `Policy → Abstraction ← Detail`.

The important word is **inversion**. The high-level policy owns or defines the abstraction that expresses what it
requires, while low-level infrastructure adapts itself to that abstraction.

## Dependency

A dependency exists when one component requires another component to perform its work.

```js
class OrderService {
    constructor(database) {
        this.database = database;
    }

    create(order) {
        this.database.insert("orders", order);
    }
}
```

`OrderService` depends directly on `database`. If `database` represents a concrete implementation tied to a particular
technology, the high-level application logic is coupled to infrastructure.

## High-Level and Low-Level Modules

A **high-level module** contains application or domain policy. Examples include order processing, authorization rules,
pricing policy, account management, business workflows, and domain decisions.

A **low-level module** provides implementation mechanisms. Examples include SQL databases, HTTP clients, filesystem
access, message brokers, SMTP clients, cloud SDKs, logging libraries, and framework APIs.

```js
class OrderService {
    // High-level policy
}

class PostgresClient {
    // Low-level infrastructure
}
```

A direct dependency from `OrderService` to `PostgresClient` couples high-level policy to a specific infrastructure
mechanism. The purpose of DIP is not to eliminate the infrastructure dependency entirely, but to prevent the high-level
policy from being structurally dependent on that concrete detail.

## The Traditional Dependency Direction

A conventional layered design may place presentation above application logic, application logic above domain logic, and
domain logic above infrastructure. The exact layering varies between architectures, but the important concern is the
direction of source-code dependencies.

If domain and application layers directly depend on infrastructure, infrastructure details can influence the structure
of higher-level policy. This is especially problematic when infrastructure is more volatile than the business rules that
depend on it.

DIP changes the source-code dependency so that the higher-level policy depends on an abstraction while infrastructure
depends on that abstraction.

## Dependency Inversion

Consider an application service that requires persistence. Rather than depending directly on PostgreSQL, the application
can depend on an application-facing repository contract.

```js
class OrderRepository {
    save(order) {
        throw new Error("Not implemented");
    }
}

class OrderService {
    constructor(orderRepository) {
        this.orderRepository = orderRepository;
    }

    create(order) {
        this.orderRepository.save(order);
    }
}
```

Infrastructure can then implement the required contract:

```js
class PostgresOrderRepository extends OrderRepository {
    save(order) {
        // PostgreSQL-specific implementation
    }
}
```

The concrete implementation still exists, but the application service no longer depends directly on PostgreSQL. The
important change is the ownership and direction of the dependency boundary.

## Example: Database Dependency

Without DIP, a service may construct and use a concrete database implementation directly:

```js
class OrderService {
    constructor() {
        this.database = new PostgresDatabase();
    }

    create(order) {
        this.database.query(
            "INSERT INTO orders (...) VALUES (...)",
            order
        );
    }
}
```

Several forms of coupling exist here. The service constructs infrastructure, knows the database technology, contains
SQL, requires database infrastructure for testing, and must be modified if the persistence technology changes.
Infrastructure configuration has therefore leaked into application policy.

Applying DIP means defining the capability the application actually requires and depending on that capability instead:

```js
class OrderRepository {
    save(order) {
        throw new Error("Not implemented");
    }
}

class OrderService {
    constructor(orderRepository) {
        this.orderRepository = orderRepository;
    }

    create(order) {
        this.orderRepository.save(order);
    }
}

class PostgresOrderRepository extends OrderRepository {
    save(order) {
        // PostgreSQL-specific implementation
    }
}
```

The application depends on `OrderRepository`, while `PostgresOrderRepository` adapts PostgreSQL to the application's
persistence requirement.

## Dependency Injection

**Dependency Injection (DI)** is one of the primary mechanisms used to implement DIP. DIP is the architectural
principle; DI is a technique for supplying dependencies from outside rather than constructing them internally.

Without injection:

```js
class OrderService {
    constructor() {
        this.repository = new PostgresOrderRepository();
    }
}
```

With injection:

```js
class OrderService {
    constructor(repository) {
        this.repository = repository;
    }
}
```

The service no longer decides which concrete implementation to use. The composition boundary can select the
implementation:

```js
const repository = new PostgresOrderRepository();
const service = new OrderService(repository);
```

## DIP Is Not Dependency Injection

These concepts should not be conflated. DIP specifies an architectural relationship between high-level policy,
abstractions, and low-level details. Dependency Injection specifies a mechanism for supplying dependencies.

Dependency injection can exist without meaningful dependency inversion:

```js
class OrderService {
    constructor(postgresDatabase) {
        this.database = postgresDatabase;
    }
}
```

The dependency is injected, but the high-level module still explicitly depends on a concrete PostgreSQL-oriented
abstraction. DI alone therefore does not guarantee DIP.

## Dependency on Abstractions

The purpose of DIP is not to eliminate dependencies. It changes what the dependency represents.

Instead of depending on:

```js
class OrderService {
    constructor(postgresDatabase) {
        this.database = postgresDatabase;
    }
}
```

the service should depend on a behavioral abstraction representing its actual requirement:

```js
class OrderService {
    constructor(orderRepository) {
        this.orderRepository = orderRepository;
    }
}
```

The service still depends on something. The difference is that it depends on a capability required by application policy
rather than on an infrastructure technology.

## Abstractions Should Belong to Policy

A critical aspect of DIP is the ownership of abstractions. Consider a generic database abstraction:

```ts
interface Database {
    query(sql: string): Promise<unknown>;
}
```

This abstraction is database-oriented. The application does not actually need a database as an abstract concept; it
needs to persist orders.

A more policy-oriented abstraction is:

```ts
interface OrderRepository {
    save(order: Order): Promise<void>;

    findById(id: string): Promise<Order | null>;
}
```

The second abstraction expresses an application requirement rather than an infrastructure mechanism. This distinction is
central to dependency inversion.

## Detail-Oriented Abstractions

A poor abstraction often exposes infrastructure terminology:

```js
class SqlDatabase {
    execute(query, parameters) {
    }

    beginTransaction() {
    }

    rollback() {
    }

    commit() {
    }
}
```

An application depending on this abstraction must understand SQL, transactions, database sessions, queries, and
parameters.

A policy-oriented abstraction instead expresses the application's concepts:

```js
class OrderRepository {
    save(order) {
    }

    findById(id) {
    }
}
```

The application cares about orders. Infrastructure cares about SQL. DIP separates those concerns.

## Details Depend on Policy

With DIP, the application defines the capability it requires and infrastructure conforms to that contract.

```js
class OrderRepository {
    save(order) {
    }

    findById(id) {
    }
}

class PostgresOrderRepository {
    save(order) {
        // PostgreSQL implementation
    }

    findById(id) {
        // PostgreSQL implementation
    }
}
```

The PostgreSQL adapter depends conceptually on the application's repository contract. The database implementation adapts
itself to the needs of the application rather than forcing the application to adopt the database's API.

## Ports and Adapters

This dependency structure is central to **Hexagonal Architecture**. The application defines a port representing a
required capability, while infrastructure provides an adapter that implements that port.

```js
class OrderRepository {
    save(order) {
    }

    findById(id) {
    }
}

class PostgresOrderRepository {
    save(order) {
        // ...
    }

    findById(id) {
        // ...
    }
}
```

The database remains outside the application boundary. The application knows the repository contract; the adapter knows
how to translate that contract into PostgreSQL operations.

## DIP and Dependency Direction

The essential difference is between a high-level component directly depending on infrastructure and a high-level
component depending on an abstraction implemented by infrastructure.

Without inversion:

```text
Application → Infrastructure
```

With inversion:

```text
Application → Application Abstraction ← Infrastructure
```

The implementation dependency has been redirected toward the abstraction. The runtime call may still eventually reach
infrastructure, but the source-code dependency is no longer directly coupled to the concrete implementation.

## DIP and Dependency Ownership

Dependency inversion is also about **ownership**.

Suppose business logic needs the capability `saveOrder(order)`. The application should define a contract around that
requirement:

```ts
interface OrderWriter {
    saveOrder(order: Order): Promise<void>;
}
```

Infrastructure implements it:

```ts
class SqlOrderWriter implements OrderWriter {
    async saveOrder(order: Order) {
        // SQL implementation
    }
}
```

The application owns the concept because the application determines what behavior it requires. Infrastructure adapts to
that requirement.

## Stable vs Volatile Dependencies

DIP is particularly useful when a stable component depends on a volatile component. Business policy such as order
processing, authorization, and pricing generally has a longer conceptual lifetime than a particular database, cloud
provider, framework, SDK, or external API.

The goal is to prevent volatile implementation details from determining the structure of stable policy. This does not
mean that every volatile dependency requires an abstraction; the abstraction must provide meaningful architectural
value.

## Policy and Detail

The distinction can be expressed simply. **Policy** describes what the system should do, while **detail** describes how
the system technically accomplishes it.

For example, the policy might be that an order must be persisted before confirmation. The implementation detail might be
that the system performs a PostgreSQL `INSERT` followed by `COMMIT`. The policy should not need to know that PostgreSQL
or SQL exists merely to express its requirement.

## DIP and Business Rules

Consider:

```js
class CheckoutService {
    checkout(order) {
        if (order.total <= 0) {
            throw new Error("Invalid order");
        }

        // persist
        // charge
        // notify
    }
}
```

The validation rule is business policy. Persistence, payment, and notification are external mechanisms. DIP can separate
these concerns by making the required capabilities explicit:

```js
class CheckoutService {
    constructor(orderRepository, paymentGateway, notifier) {
        this.orderRepository = orderRepository;
        this.paymentGateway = paymentGateway;
        this.notifier = notifier;
    }

    async checkout(order) {
        if (order.total <= 0) {
            throw new Error("Invalid order");
        }

        await this.orderRepository.save(order);
        await this.paymentGateway.charge(order.total);
        await this.notifier.notify(order);
    }
}
```

The high-level workflow depends on capabilities rather than technologies.

## DIP and Dependency Inversion at Multiple Levels

A system can apply DIP at multiple architectural boundaries. For example, checkout logic can depend on a payment
capability, while the payment adapter depends on an external provider API.

The application therefore depends on the payment capability, while the adapter translates that capability into the
external provider's API. The provider remains an implementation detail at the outer boundary.

## DIP and Interfaces

In statically typed languages, interfaces are commonly used to express abstractions:

```ts
interface PaymentGateway {
    charge(amount: number): Promise<void>;
}
```

A high-level component can then depend on that interface:

```ts
class CheckoutService {
    constructor(
        private readonly gateway: PaymentGateway
    ) {
    }
}
```

Infrastructure implements it:

```ts
class StripePaymentGateway implements PaymentGateway {
    async charge(amount: number) {
        // provider-specific implementation
    }
}
```

The high-level policy does not depend on the provider's concrete API.

## DIP in JavaScript

JavaScript does not require formal interfaces. A dependency can instead be represented by an implicit object contract:

```js
class CheckoutService {
    constructor(paymentGateway) {
        this.paymentGateway = paymentGateway;
    }

    async checkout(order) {
        await this.paymentGateway.charge(order.total);
    }
}
```

The effective abstraction is simply the capability `charge(amount)`. Any implementation satisfying that contract can be
supplied.

## Structural Dependency Inversion

JavaScript and TypeScript's structural nature makes capability-oriented DIP straightforward.

```ts
type PaymentGateway = {
    charge(amount: number): Promise<void>;
};

function checkout(gateway: PaymentGateway, amount: number) {
    return gateway.charge(amount);
}
```

An implementation does not need to inherit from a base class or explicitly declare that it implements the abstraction.
It only needs to satisfy the required behavior.

## Functions as Abstractions

A single function can be the correct abstraction when the consuming component needs only one operation.

Instead of:

```js
class UserService {
    constructor(repository) {
        this.repository = repository;
    }

    load(id) {
        return this.repository.findById(id);
    }
}
```

the service can receive the exact operation:

```js
class UserService {
    constructor(findUser) {
        this.findUser = findUser;
    }

    load(id) {
        return this.findUser(id);
    }
}
```

The abstraction is therefore the function `findUser(id)`. This is dependency inversion without requiring an interface
object or repository class.

## DIP and Higher-Order Functions

Functional composition can express the same architectural boundary:

```js
const createOrderService = ({
                                saveOrder,
                                publishEvent,
                                sendNotification
                            }) => ({
    async create(order) {
        await saveOrder(order);

        await publishEvent({
            type: "OrderCreated",
            order
        });

        await sendNotification(order);
    }
});
```

Concrete implementations are supplied externally:

```js
const service = createOrderService({
    saveOrder: postgresSaveOrder,
    publishEvent: kafkaPublishEvent,
    sendNotification: emailNotification
});
```

The business workflow depends on capabilities rather than technologies.

## DIP and Dependency Injection Styles

### Constructor Injection

```js
class OrderService {
    constructor(repository) {
        this.repository = repository;
    }
}
```

The dependency is required to construct the object. This is usually the clearest form because required dependencies are
explicit and the object cannot normally be created without supplying them.

### Method Injection

```js
class OrderService {
    process(order, repository) {
        repository.save(order);
    }
}
```

The dependency exists only for a particular operation. This can be appropriate when the collaborator is specific to that
operation rather than a persistent dependency of the object.

### Property Injection

```js
class OrderService {
    repository = null;
}
```

The dependency is assigned after construction. This is generally less explicit and can allow partially initialized
objects, so it is usually less desirable for required dependencies.

## Composition Root

A **composition root** is the location where concrete implementations are assembled with high-level components.

```js
const repository = new PostgresOrderRepository();
const gateway = new StripePaymentGateway();
const notifier = new EmailNotifier();

const checkout = new CheckoutService(
    repository,
    gateway,
    notifier
);
```

The composition root knows about concrete infrastructure. Business logic knows only about the capabilities it requires.

Centralizing this wiring creates a clear boundary between implementation selection and policy execution.

## Why the Composition Root Matters

Without a composition root, concrete dependency selection can leak throughout the system:

```js
class OrderService {
    constructor() {
        this.repository = new PostgresOrderRepository();
    }
}

class UserService {
    constructor() {
        this.repository = new PostgresUserRepository();
    }
}
```

With centralized composition:

```js
const orderRepository = new PostgresOrderRepository();
const userRepository = new PostgresUserRepository();

const orderService = new OrderService(orderRepository);
const userService = new UserService(userRepository);
```

Concrete infrastructure is localized to the composition boundary instead of being selected throughout application
policy.

## DIP and Testability

One practical benefit of DIP is easier testing.

Without DIP:

```js
class UserService {
    constructor() {
        this.repository = new PostgresUserRepository();
    }
}
```

Testing requires PostgreSQL or some form of infrastructure interception.

With DIP:

```js
class UserService {
    constructor(repository) {
        this.repository = repository;
    }
}
```

A test can provide a small test double:

```js
const repository = {
    findById: async () => ({
        id: "42",
        name: "Alice"
    })
};

const service = new UserService(repository);
```

The test isolates the high-level policy from persistence infrastructure.

## Testability Is a Consequence, Not the Principle

It is common to explain DIP as making code easier to test. That is true but incomplete. Testability is a consequence of
the architectural separation, not the principle's primary objective.

The architectural objective is **preventing high-level policy from being structurally coupled to implementation
details**. The same decoupling can improve replaceability, maintainability, portability, architectural stability, and
independent evolution.

## DIP and Replaceability

Consider:

```js
class OrderService {
    constructor(repository) {
        this.repository = repository;
    }
}
```

Different implementations can satisfy the same dependency:

```js
new PostgresOrderRepository();
new MongoOrderRepository();
new InMemoryOrderRepository();
new ApiOrderRepository();
```

The service does not change. Implementation selection occurs at the composition boundary.

## DIP and Infrastructure Migration

Suppose an application initially uses PostgreSQL. If the application depends directly on PostgreSQL, migrating to
another database can require changes throughout application code.

With DIP, the application continues to depend on the stable `OrderRepository` contract while a different adapter
implements it. The application contract remains stable and the infrastructure implementation changes at the boundary.

This is one of the major benefits of dependency inversion.

## DIP and Framework Independence

Frameworks are implementation details from the perspective of business policy.

A business service should ideally not require framework-specific infrastructure merely to execute its policy:

```js
class OrderService {
    // business rules
}
```

Rather than embedding framework imports and infrastructure clients throughout the core business logic, those
dependencies can be pushed toward outer layers where adapters and composition code can handle them.

## DIP and Framework APIs

Consider an HTTP framework:

```js
class OrderService {
    create(request, response) {
        // business logic mixed with HTTP concerns
    }
}
```

The business service is now coupled to HTTP semantics. A better design keeps the service focused on application-level
input:

```js
class OrderService {
    create(order) {
        // business policy
    }
}
```

The HTTP controller performs the translation:

```js
function createOrderController(request, response) {
    const order = mapRequestToOrder(request);

    const result = orderService.create(order);

    response.json(result);
}
```

The framework remains at the boundary.

## DIP and Persistence

Persistence should generally be represented in terms of domain or application needs rather than database mechanics.

Bad:

```js
class OrderService {
    constructor(sqlClient) {
        this.sqlClient = sqlClient;
    }

    create(order) {
        return this.sqlClient.query(
            "INSERT INTO orders ..."
        );
    }
}
```

Better:

```js
class OrderService {
    constructor(orderRepository) {
        this.orderRepository = orderRepository;
    }

    create(order) {
        return this.orderRepository.save(order);
    }
}
```

The SQL implementation belongs behind the application-facing abstraction.

## DIP and Messaging

The same pattern applies to message brokers.

Bad:

```js
class OrderService {
    constructor(kafkaProducer) {
        this.kafkaProducer = kafkaProducer;
    }

    publish(event) {
        return this.kafkaProducer.send({
            topic: "orders",
            messages: [{value: JSON.stringify(event)}]
        });
    }
}
```

Better:

```js
class OrderService {
    constructor(eventPublisher) {
        this.eventPublisher = eventPublisher;
    }

    publish(event) {
        return this.eventPublisher.publish(event);
    }
}
```

The application depends on publishing behavior. Kafka becomes an implementation detail.

## DIP and External APIs

External APIs should normally be hidden behind application-facing abstractions.

Bad:

```js
class ShippingService {
    constructor(fedexClient) {
        this.fedexClient = fedexClient;
    }

    ship(order) {
        return this.fedexClient.createShipment({
            // provider-specific structure
        });
    }
}
```

Better:

```js
class ShippingService {
    constructor(shippingProvider) {
        this.shippingProvider = shippingProvider;
    }

    ship(order) {
        return this.shippingProvider.ship(order);
    }
}
```

The adapter translates the internal contract into the provider's API.

## DIP and Anti-Corruption Layers

When integrating with external systems, an adapter can prevent external concepts from becoming internal dependencies.

The application depends on its own abstraction, while a translation layer adapts that abstraction to the external API.
This prevents external terminology, data structures, and behavioral assumptions from spreading throughout the
application.

## DIP and Domain Models

The domain should not depend on infrastructure details.

For example, a domain entity should generally not require a database client:

```js
class Order {
    constructor(database) {
        this.database = database;
    }
}
```

Instead, infrastructure concerns remain outside:

```js
class Order {
    constructor(items) {
        this.items = items;
    }
}
```

Persistence is handled by an application or infrastructure component:

```js
class OrderRepository {
    save(order) {
        // infrastructure implementation
    }
}
```

The domain model remains independent of persistence details.

## DIP and Dependency Direction in Clean Architecture

Clean Architecture expresses dependency inversion through its boundary structure. Business rules reside toward the
stable center, while infrastructure and framework concerns remain toward the outer layers.

The important property is that source-code dependencies point toward the stable inner policy. Infrastructure depends
inward rather than the domain depending outward on infrastructure.

## DIP and Hexagonal Architecture

Hexagonal Architecture expresses the same principle through ports and adapters. A port expresses an application's
required capability, while an adapter implements that capability for a particular external technology.

```js
class OrderRepository {
    save(order) {
    }

    findById(id) {
    }
}
```

```js
class PostgresOrderRepository {
    save(order) {
        // PostgreSQL implementation
    }

    findById(id) {
        // PostgreSQL implementation
    }
}
```

The application depends on the port; PostgreSQL-specific infrastructure implements it.

## DIP and Onion Architecture

Onion Architecture similarly places business policy at the center and infrastructure toward the outside. The important
dependency rule is that dependencies point toward the stable inner layers.

Infrastructure is replaceable because the core does not depend directly on infrastructure-specific implementations.

## DIP and Dependency Inversion vs Layering

Layering and DIP are related but not identical.

A layered architecture might have UI depending on application code, which depends on infrastructure. DIP can alter the
source-code structure so that application code depends on an application abstraction while infrastructure depends on
that abstraction.

The runtime call may still flow from application code into infrastructure. DIP therefore does not necessarily reverse
runtime execution. It reverses the relevant source-code dependency relationship.

## Source Dependency vs Runtime Dependency

DIP does not mean infrastructure will never execute.

At runtime, an `OrderService` can call an `OrderRepository`, whose concrete implementation can execute PostgreSQL
operations. The important distinction is that the application source code depends on the repository contract rather than
directly on the PostgreSQL implementation.

DIP concerns **source-code dependency ownership and abstraction boundaries**, not the physical runtime execution path.

## DIP and Dependency Graphs

Without DIP:

```text
OrderService → PostgresRepository → PostgreSQL
```

With DIP:

```text
OrderService → OrderRepository ← PostgresOrderRepository → PostgreSQL
```

The high-level policy no longer depends directly on the concrete infrastructure detail. The infrastructure
implementation depends on the abstraction required by the application.

## DIP and Volatility

DIP is especially valuable at boundaries where volatility differs. Business rules may remain stable while databases,
cloud providers, payment providers, frameworks, message brokers, and external APIs change.

The abstraction provides a stable boundary between these concerns. This does not mean every external technology must be
wrapped; it means volatile details should not unnecessarily determine the structure of stable policy.

## DIP Does Not Mean Abstract Everything

A common mistake is creating interfaces for every class:

```ts
interface StringFormatter {
    format(value: string): string;
}

class StringFormatterImpl implements StringFormatter {
    format(value) {
        return value.trim();
    }
}
```

If there is no meaningful variation, architectural boundary, or independent implementation requirement, this abstraction
may add unnecessary complexity.

DIP is about **strategic dependency inversion**, not abstraction for its own sake.

## DIP and Abstraction Cost

Every abstraction introduces cost: another concept, another file, another dependency boundary, additional wiring, more
indirection, and additional documentation.

Abstractions should therefore be introduced where they provide meaningful architectural value. Good candidates often
include external systems, persistence, messaging, payment providers, cloud services, infrastructure APIs, volatile
libraries, and application ports.

## DIP and Stable Abstractions

A good abstraction should represent stable policy rather than volatile implementation details.

Poor:

```ts
interface PostgresDatabase {
    executeSql(query: string): Promise<void>;
}
```

Better:

```ts
interface OrderRepository {
    save(order: Order): Promise<void>;
}
```

The second abstraction is more stable because it represents what the application needs rather than how a particular
database performs the operation.

## DIP and Interface Segregation

DIP and ISP work together. A dependency should be inverted toward an abstraction, but that abstraction should also be
appropriately narrow.

A broad database service may expose operations such as querying, migration, backup, restore, replication, index
creation, and index deletion. An order service that only needs to persist orders should not depend on all of those
capabilities.

A better dependency is:

```js
class OrderService {
    constructor(orderRepository) {
        this.orderRepository = orderRepository;
    }
}
```

The abstraction is both inverted and appropriately segregated.

## DIP and Liskov Substitution

Once high-level policy depends on an abstraction, concrete implementations must satisfy that abstraction's behavioral
contract.

```js
class PostgresOrderRepository {
    save(order) {
        // ...
    }
}

class MongoOrderRepository {
    save(order) {
        // ...
    }
}
```

Both implementations must be valid substitutes for the `OrderRepository` abstraction. DIP creates the dependency
boundary; LSP constrains the behavior of implementations that cross that boundary.

## DIP and Open-Closed Principle

DIP also supports OCP. If the application depends on a payment abstraction, additional implementations can be introduced
without modifying the high-level policy:

```js
class CheckoutService {
    constructor(paymentGateway) {
        this.paymentGateway = paymentGateway;
    }
}
```

Different gateways can implement the same capability. DIP provides a mechanism for isolating variation behind
abstractions, allowing high-level policy to remain stable while new implementations are introduced.

## DIP and Single Responsibility

DIP can also help preserve SRP by preventing application services from accumulating infrastructure responsibilities.

Without DIP:

```js
class OrderService {
    validateOrder() {
    }

    generateSql() {
    }

    executeSql() {
    }

    serializeEvent() {
    }

    publishToKafka() {
    }

    sendEmail() {
    }
}
```

With DIP:

```js
class OrderService {
    constructor(repository, publisher, notifier) {
        this.repository = repository;
        this.publisher = publisher;
        this.notifier = notifier;
    }

    process(order) {
        // business workflow
    }
}
```

The service coordinates the business workflow while infrastructure responsibilities remain in their respective
implementations.

## DIP and Functional Programming

DIP does not require object-oriented programming.

Functions can depend on injected capabilities:

```js
const createOrderService = ({
                                saveOrder,
                                publishEvent,
                                sendNotification
                            }) => ({
    async create(order) {
        await saveOrder(order);

        await publishEvent({
            type: "OrderCreated",
            order
        });

        await sendNotification(order);
    }
});
```

Concrete implementations are supplied externally:

```js
const service = createOrderService({
    saveOrder: postgresSaveOrder,
    publishEvent: kafkaPublishEvent,
    sendNotification: emailNotification
});
```

The business workflow depends on capabilities rather than technologies.

## DIP and Modules

ES modules can also form dependency boundaries.

A high-level module can expose or consume application-level capabilities without importing infrastructure:

```js
import {createOrderService} from "./order-service.js";
```

Infrastructure is composed elsewhere:

```js
import {PostgresOrderRepository} from "./postgres-order-repository.js";
import {createOrderService} from "./order-service.js";

const repository = new PostgresOrderRepository();
const orderService = createOrderService(repository);
```

The core module does not need to import PostgreSQL.

## DIP and Dynamic Imports

Dynamic imports do not automatically implement DIP.

```js
const module = await import("./postgres.js");
```

If business logic still decides which concrete infrastructure module to load, the dependency remains coupled to the
implementation.

DIP concerns architectural dependency direction, not the mechanism used to load modules.

## DIP and Service Locators

A **Service Locator** can hide dependencies:

```js
class OrderService {
    create(order) {
        const repository = container.resolve("OrderRepository");

        return repository.save(order);
    }
}
```

Although the concrete implementation is not directly constructed, the dependency is now implicit. This can reduce
clarity because the constructor no longer communicates what the service requires.

Explicit dependency injection is generally preferable:

```js
class OrderService {
    constructor(repository) {
        this.repository = repository;
    }
}
```

DIP does not require a dependency container.

## DIP and Dependency Containers

A dependency injection container can centralize composition:

```js
container.register(
    "OrderRepository",
    () => new PostgresOrderRepository()
);

container.register(
    "OrderService",
    ({OrderRepository}) =>
        new OrderService(OrderRepository)
);
```

This can be useful in large systems. However, a container is an implementation mechanism rather than the principle
itself. The architecture should remain understandable without requiring knowledge of the container.

## DIP and Global State

Global infrastructure often creates direct or hidden coupling.

```js
import database from "./database.js";

class OrderService {
    create(order) {
        return database.insert(order);
    }
}
```

The service has a hidden dependency that is difficult to replace and difficult to see from the class's public contract.

A better design makes the dependency explicit:

```js
class OrderService {
    constructor(repository) {
        this.repository = repository;
    }
}
```

Explicit dependencies improve architectural visibility.

## DIP and Singletons

Singleton infrastructure can also create direct coupling:

```js
class OrderService {
    create(order) {
        return Database.instance.insert(order);
    }
}
```

Even though the service does not construct the database, it still depends directly on the concrete singleton.

Dependency inversion instead provides a stable abstraction:

```js
class OrderService {
    constructor(repository) {
        this.repository = repository;
    }
}
```

The singleton can still exist at the infrastructure layer if necessary. The application does not need to know about it.

## DIP and Configuration

Configuration should generally be supplied at the boundary rather than accessed globally throughout business logic.

Bad:

```js
class PaymentService {
    charge(amount) {
        if (config.paymentProvider === "stripe") {
            // ...
        }
    }
}
```

Better:

```js
const paymentGateway = createPaymentGateway(config);

const paymentService = new PaymentService(paymentGateway);
```

Provider selection belongs in composition. Payment policy belongs in the service.

## DIP and Factory Functions

Factory functions can act as composition boundaries:

```js
function createApplication(config) {
    const repository = createRepository(config);
    const gateway = createPaymentGateway(config);

    return {
        orderService: new OrderService(repository),
        paymentService: new PaymentService(gateway)
    };
}
```

The factory knows implementation details. The application services do not.

## DIP and Environment Selection

Environment-specific infrastructure can be selected at the boundary:

```js
const repository =
    process.env.NODE_ENV === "test"
        ? new InMemoryOrderRepository()
        : new PostgresOrderRepository();

const service = new OrderService(repository);
```

The service itself does not contain environment-specific logic. Deployment concerns remain outside policy.

## DIP and Feature Variants

Different implementations can represent different operational strategies:

```js
class InMemoryOrderRepository {
}

class PostgresOrderRepository {
}

class CachedOrderRepository {
}

class RemoteOrderRepository {
}
```

The application depends on the repository contract. Composition determines which implementation is active.

## DIP and Decorators

DIP works naturally with the **Decorator Pattern**.

```js
class CachedOrderRepository {
    constructor(repository, cache) {
        this.repository = repository;
        this.cache = cache;
    }

    async findById(id) {
        const cached = await this.cache.get(id);

        if (cached) {
            return cached;
        }

        return this.repository.findById(id);
    }
}
```

The decorator depends on the same abstraction as the wrapped implementation. The application remains unaware of whether
caching is present.

## DIP and Proxy

The same applies to proxies:

```js
class LoggingOrderRepository {
    constructor(repository, logger) {
        this.repository = repository;
        this.logger = logger;
    }

    async save(order) {
        this.logger.log("Saving order");
        return this.repository.save(order);
    }
}
```

The proxy can wrap any valid repository implementation. DIP provides the abstraction that makes this composition
possible.

## DIP and Strategy

The Strategy Pattern is another natural application of DIP.

```js
class CheckoutService {
    constructor(pricingStrategy) {
        this.pricingStrategy = pricingStrategy;
    }

    calculateTotal(cart) {
        return this.pricingStrategy.calculate(cart);
    }
}
```

The service depends on pricing behavior rather than a concrete pricing algorithm. Different strategies can be supplied
without changing the high-level service.

## DIP and Factory Method

Factory Method can encapsulate the selection or creation of concrete implementations.

The high-level policy still depends on an abstraction. The factory can therefore remain at the composition boundary
rather than leaking infrastructure choices into policy code.

## DIP and Abstract Factory

Abstract Factory is useful when multiple related infrastructure implementations must be created together.

```js
class InfrastructureFactory {
    createRepository() {
    }

    createPublisher() {
    }

    createNotifier() {
    }
}
```

The application can receive the capabilities it needs without knowing which concrete technology provides them. The
pattern is useful when implementation families must remain consistent.

## DIP and Plugin Architectures

Plugin systems are natural applications of dependency inversion.

```ts
interface Plugin {
    initialize(context: PluginContext): void;
}
```

Plugins implement the contract, while the core application depends only on the plugin API. The core does not need to
depend on any specific plugin implementation.

## DIP and SDKs

An SDK can be hidden behind an application-specific abstraction. Instead of spreading provider APIs throughout the
codebase:

```js
stripe.customers.create(...);
stripe.paymentIntents.create(...);
stripe.refunds.create(...);
```

the application can depend on:

```js
paymentGateway.charge(amount);
paymentGateway.refund(transactionId);
```

The provider-specific SDK remains behind the adapter.

## DIP and Vendor Lock-In

DIP can reduce architectural vendor lock-in by preventing provider-specific APIs from becoming the application's
internal abstraction.

Without such a boundary, provider APIs can spread throughout application code. With application-owned ports such as
`Storage`, `PaymentGateway`, and `EventPublisher`, provider-specific implementations remain localized to adapters.

The application still uses vendors. It simply does not make their APIs the application's internal architectural
contracts.

## DIP Does Not Mean Technology Independence

DIP does not make an application completely independent of infrastructure. A real system may still require a database,
network, filesystem, cloud provider, operating system, and runtime.

The objective is not to eliminate those dependencies. It is to **localize them behind appropriate boundaries** so that
stable policy does not become structurally coupled to volatile implementation details.

## DIP and Abstraction Leakage

An abstraction fails when implementation details leak through it.

For example:

```js
interface
Repository
{
    executeSql(query, parameters)
    {
    }
}
```

This is technically an abstraction, but SQL has leaked into the contract.

A better abstraction is:

```js
interface
OrderRepository
{
    findById(id)
    {
    }

    save(order)
    {
    }
}
```

The implementation details remain behind the boundary.

## DIP and Generic Abstractions

Generic infrastructure abstractions can sometimes be useful:

```ts
interface Repository<T> {
    findById(id: string): Promise<T | null>;

    save(entity: T): Promise<void>;
}
```

However, generic abstractions can also become too broad or lose application-specific meaning.

An application-specific contract may communicate intent more clearly:

```ts
interface OrderRepository {
    findById(id: string): Promise<Order | null>;

    save(order: Order): Promise<void>;
}
```

The correct abstraction depends on the architectural boundary, client needs, cohesion, variation, and desired ownership.

## DIP and Over-Abstraction

This is a common anti-pattern:

```text
Service
  ↓
IRepository
  ↓
RepositoryFactory
  ↓
RepositoryProvider
  ↓
DatabaseAdapter
  ↓
DatabaseClient
```

If every layer exists solely to wrap another layer without providing meaningful architectural separation, DIP has become
ceremonial.

Abstraction should remove meaningful coupling. It should not merely increase indirection.

## DIP and Leaky Interfaces

A leaky abstraction exposes details that callers must understand.

For example:

```js
class UserRepository {
    findById(id) {
        return sqlClient.query(
            "SELECT ...",
            [id]
        );
    }
}
```

If callers must understand SQL result shapes, the abstraction is leaking.

A better boundary returns application-level values:

```js
class UserRepository {
    async findById(id) {
        return user;
    }
}
```

The infrastructure translates its representation into the application's representation.

## DIP and Data Transfer Objects

Data shapes can also leak infrastructure details.

For example:

```js
{
    user_id: 42,
        created_at_timestamp
:
    "...",
        internal_status_code
:
    7
}
```

The application should not necessarily depend on database-specific row structures. The adapter can map the
infrastructure representation into an application-level representation:

```js
{
    id: 42,
        createdAt
:
    new Date(...),
        status
:
    "active"
}
```

DIP therefore often requires translation between infrastructure models and application models.

## DIP and Persistence Models

A domain entity does not have to equal a database record.

For example:

```js
class Order {
    constructor(items) {
        this.items = items;
    }

    total() {
        return this.items.reduce(
            (sum, item) => sum + item.price,
            0
        );
    }
}
```

The database representation can differ:

```js
{
    order_id: 42,
        item_count
:
    3,
        total_cents
:
    12500
}
```

The repository adapter performs the mapping. The domain model remains independent of persistence details.

## DIP and Serialization

The same principle applies to serialization. Business logic should not need to know whether external data is represented
as JSON, XML, Protobuf, MessagePack, database rows, or another representation unless that representation is itself part
of the business contract.

An adapter can translate between external representations and internal models, keeping serialization mechanisms at the
appropriate boundary.

## DIP and Logging

Logging is often treated as infrastructure:

```js
class OrderService {
    constructor(logger) {
        this.logger = logger;
    }

    create(order) {
        this.logger.info("Creating order");
    }
}
```

The application can depend on a narrow logging capability:

```js
const logger = {
    info(message) {
    }
};
```

The concrete implementation can be a console logger, structured logger, cloud logger, or test logger. The application
does not need to know the destination or logging library.

## DIP and Observability

Metrics and tracing can be treated similarly.

Instead of coupling application code directly to a monitoring SDK:

```js
datadog.increment("orders.created");
```

an application-facing capability can be used:

```js
metrics.increment("orders.created");
```

The infrastructure implementation determines how that metric is emitted.

## DIP and Caching

Caching is another detail that can be inverted.

Instead of:

```js
class UserService {
    getUser(id) {
        return redis.get(`user:${id}`);
    }
}
```

the service can depend on a cache capability:

```js
class UserService {
    constructor(cache) {
        this.cache = cache;
    }

    getUser(id) {
        return this.cache.get(id);
    }
}
```

Redis becomes an implementation detail.

## DIP and Transactions

Transaction handling requires more care. A naive abstraction may expose infrastructure mechanics:

```js
transaction.begin();
transaction.commit();
transaction.rollback();
```

A more application-oriented abstraction may represent the required atomic operation:

```js
transaction.execute(async () => {
    await repository.save(order);
    await repository.save(payment);
});
```

The infrastructure can implement the transaction semantics while the application expresses the required atomic
operation.

## DIP and Unit of Work

A Unit of Work abstraction can represent application-level transaction boundaries:

```js
class UnitOfWork {
    execute(work) {
        // ...
    }
}
```

Infrastructure determines how atomicity is implemented. The application depends on the capability rather than a specific
database transaction API.

## DIP and External Authentication

Authentication providers can be hidden behind application-facing contracts.

Bad:

```js
class LoginService {
    constructor(auth0Client) {
        this.auth0Client = auth0Client;
    }
}
```

Better:

```js
class LoginService {
    constructor(identityProvider) {
        this.identityProvider = identityProvider;
    }
}
```

The application depends on identity behavior. The concrete provider is selected outside the service.

## DIP and Cloud Infrastructure

Cloud-specific APIs should generally remain at infrastructure boundaries.

For example:

```js
class ImageService {
    constructor(s3Client) {
        this.s3Client = s3Client;
    }
}
```

A policy-oriented abstraction is:

```js
class ImageStorage {
    upload(image) {
    }

    delete(id) {
    }
}
```

An S3 adapter implements the contract. The application does not need to know that S3 exists.

## DIP and Architectural Boundaries

A useful architectural boundary places application and domain policy on one side of an abstraction and infrastructure
implementations on the other.

The important relationships are:

* Application and domain policy **depend on** the abstraction.
* Infrastructure **implements** the abstraction.
* Concrete technology remains outside the policy boundary.
* Composition selects and assembles concrete implementations.
* Runtime execution may still cross the boundary into infrastructure.

This creates a stable center while allowing volatile outer details to change independently.

## Detecting DIP Violations

Common warning signs include:

* business logic imports infrastructure libraries,
* domain entities instantiate database clients,
* services construct external SDK clients,
* application code contains SQL,
* business logic contains HTTP framework objects,
* business rules reference cloud provider APIs,
* infrastructure terminology appears throughout the domain,
* concrete implementations are constructed deep inside business services,
* global infrastructure objects are accessed directly,
* switching infrastructure requires modifying application policy,
* tests require real infrastructure to exercise business rules.

These signs do not automatically prove a DIP violation. The important question is whether high-level policy is directly
coupled to low-level implementation details.

## DIP Violation: Direct Construction

```js
class InvoiceService {
    constructor() {
        this.repository = new PostgresInvoiceRepository();
    }
}
```

The high-level module chooses the low-level detail.

Better:

```js
class InvoiceService {
    constructor(repository) {
        this.repository = repository;
    }
}
```

The composition root chooses the implementation.

## DIP Violation: Infrastructure Import

```js
import Stripe from "stripe";

class PaymentService {
    charge(amount) {
        return Stripe.paymentIntents.create({
            amount
        });
    }
}
```

The service is coupled directly to the provider.

Better:

```js
class PaymentService {
    constructor(paymentGateway) {
        this.paymentGateway = paymentGateway;
    }

    charge(amount) {
        return this.paymentGateway.charge(amount);
    }
}
```

The provider-specific implementation is moved outside the high-level policy.

## DIP Violation: Framework-Coupled Domain

```js
class Order {
    static async findById(id) {
        return Prisma.order.findUnique({
            where: {id}
        });
    }
}
```

The domain object is now coupled to persistence infrastructure.

A better separation is:

```js
class OrderRepository {
    findById(id) {
        // infrastructure implementation
    }
}
```

The domain model remains independent.

## DIP Violation: Leaking Infrastructure Types

```js
function processResult(sqlResult) {
    // ...
}
```

If business logic requires a SQL-specific result object, the database has leaked through the boundary.

Instead:

```js
function processUser(user) {
    // ...
}
```

The adapter translates infrastructure data into application-level data.

## Refactoring Toward DIP

A practical refactoring process starts by identifying the high-level policy and its concrete details. Find the code
containing business decisions, then identify dependencies on PostgreSQL, Redis, Kafka, Stripe, AWS, Express, the
filesystem, or other infrastructure mechanisms.

Next, determine what capability the policy actually requires. Typical requirements include persisting an order, charging
a payment, publishing an event, or sending a notification.

Define application-facing contracts around those requirements:

```js
class OrderRepository {
    save(order) {
    }
}

class PaymentGateway {
    charge(amount) {
    }
}

class EventPublisher {
    publish(event) {
    }
}
```

Inject those contracts into the high-level component:

```js
class CheckoutService {
    constructor(repository, paymentGateway, publisher) {
        this.repository = repository;
        this.paymentGateway = paymentGateway;
        this.publisher = publisher;
    }
}
```

Implement the contracts in infrastructure:

```js
class PostgresOrderRepository {
    save(order) {
        // ...
    }
}

class StripePaymentGateway {
    charge(amount) {
        // ...
    }
}
```

Finally, compose the concrete implementations at the boundary:

```js
const checkout = new CheckoutService(
    new PostgresOrderRepository(),
    new StripePaymentGateway(),
    new KafkaEventPublisher()
);
```

The high-level policy no longer knows which infrastructure technologies are being used.

## Common Misconceptions

### “DIP means all dependencies must be interfaces”

Incorrect. Only dependencies where abstraction provides meaningful architectural value need inversion.

### “DIP means no concrete classes”

Incorrect. Concrete classes are necessary. The principle concerns where concrete details are allowed to influence
high-level policy.

### “Dependency injection is DIP”

Incorrect. Dependency injection is a technique. DIP is the architectural principle.

### “Using a dependency container means DIP is implemented”

Incorrect. A container can still wire inappropriate concrete dependencies. The dependency graph must still be
architecturally inverted.

### “DIP means the application cannot depend on libraries”

Incorrect. The application can depend on stable libraries when that dependency is appropriate. DIP is primarily
concerned with dependencies on volatile implementation details and architectural boundaries.

### “Every external API requires an interface”

Not necessarily. If an external dependency is itself an acceptable stable abstraction for the application, additional
wrapping may provide little value. The decision should be based on coupling, volatility, and architectural ownership.

### “DIP means the runtime cannot call infrastructure”

Incorrect. Runtime execution can still flow from application code into infrastructure. DIP concerns source-code
dependency direction and ownership.

### “DIP eliminates vendor lock-in”

Not completely. It can localize vendor-specific dependencies and reduce their impact on application policy. The system
still depends on the vendor at the infrastructure boundary.

### “DIP means business logic cannot use I/O”

Incorrect. Business workflows often require persistence, messaging, and external services. The issue is that those
mechanisms should be accessed through appropriate abstractions.

### “More abstractions mean better DIP”

Incorrect. Excessive abstraction creates indirection without reducing meaningful coupling.

## DIP and Abstraction Ownership

One of the most important questions when applying DIP is **who should own the interface or contract**.

Consider an infrastructure-owned abstraction:

```text
Infrastructure Package
        ↓
DatabaseInterface
        ↑
    Application
```

The application is forced to conform to an infrastructure-defined abstraction.

A stronger architecture defines the contract around application needs:

```text
Application
    ↓
OrderRepository
    ↑
Infrastructure
```

The abstraction is defined according to what the application requires, and infrastructure adapts to it.

## DIP and Application Ports

Application ports should generally express useful capabilities rather than infrastructure mechanisms.

Good:

```ts
interface PaymentGateway {
    charge(payment: Payment): Promise<Receipt>;
}
```

Poor:

```ts
interface HttpClient {
    request(
        method: string,
        url: string,
        headers: Record<string, string>,
        body: unknown
    ): Promise<Response>;
}
```

The second abstraction is generic infrastructure. The first expresses an application-level capability.

## DIP and Abstraction Granularity

An abstraction can be too broad:

```js
class Infrastructure {
    database() {
    }

    cache() {
    }

    queue() {
    }

    storage() {
    }

    email() {
    }
}
```

It can also be too narrow:

```js
class OrderSaver {
    save(order) {
    }
}

class OrderFinder {
    find(id) {
    }
}

class OrderDeleter {
    delete(id) {
    }
}
```

when all consumers naturally require the same cohesive repository behavior.

The correct granularity depends on client needs, cohesion, change patterns, architectural boundaries, and implementation
variation.

## DIP and ISP Together

A strong dependency boundary often satisfies both DIP and ISP. The high-level policy depends on an abstraction, that
abstraction is owned around policy needs, and the contract is narrow enough that consumers do not depend on irrelevant
capabilities.

```js
class CheckoutService {
    constructor(orderRepository) {
        this.orderRepository = orderRepository;
    }
}
```

The abstraction is therefore:

* owned by the policy,
* narrow enough for its clients,
* behaviorally meaningful,
* implemented by infrastructure.

This combines the concerns of DIP, ISP, and LSP without requiring them to be treated as the same principle.

## DIP and the SOLID Principles

DIP is the final principle in SOLID:

* **S** — Single Responsibility
* **O** — Open-Closed
* **L** — Liskov Substitution
* **I** — Interface Segregation
* **D** — Dependency Inversion

The principles reinforce one another but remain independent rules. SRP encourages cohesive components, OCP encourages
stable extension boundaries, LSP constrains substitutability, ISP keeps client contracts focused, and DIP establishes an
appropriate dependency direction.

A strongly decoupled architecture can emerge when these principles are applied together, but applying one principle does
not automatically imply that the others have been satisfied.

## DIP and Architecture Quality

Dependency inversion improves architecture when it creates meaningful separation between policy and detail. The policy
can evolve without requiring direct knowledge of infrastructure, while infrastructure can change without forcing
modifications throughout the policy layer.

This can provide:

* independent policy evolution,
* independent infrastructure evolution,
* replaceable implementations,
* isolated policy tests,
* localized integrations,
* framework dependencies at the boundary,
* reduced vendor-specific coupling.

The goal is not abstraction for abstraction's sake. The goal is **independent evolution of policy and detail**.

## Practical DIP Checklist

Before introducing an abstraction, ask:

1. Is this dependency an implementation detail?
2. Is the consuming component high-level policy?
3. Does the dependency vary independently?
4. Does the consuming component actually need the dependency's full API?
5. Can the required capability be expressed in application terms?
6. Should the abstraction belong to the application rather than infrastructure?
7. Can the implementation depend on that abstraction?
8. Can the concrete implementation be selected at the composition root?
9. Would this reduce meaningful coupling?
10. Is the abstraction worth the additional complexity?

If the answers consistently indicate meaningful separation, dependency inversion is likely appropriate.

## Summary

The **Dependency Inversion Principle** states that high-level modules should not depend on low-level modules; both
should depend on abstractions. Abstractions should not depend on details; details should depend on abstractions.

The essential relationship is:

```text
High-Level Policy → Abstraction ← Low-Level Detail
```

DIP does not eliminate dependencies. It changes their direction and ownership.

Instead of:

```text
Application → PostgreSQL
```

the application can depend on:

```js
class OrderService {
    constructor(repository) {
        this.repository = repository;
    }
}
```

while infrastructure provides the implementation:

```js
class PostgresOrderRepository {
    save(order) {
        // PostgreSQL-specific implementation
    }
}
```

The application defines or owns the capability it needs. Infrastructure provides how that capability is implemented.

Dependency Injection is commonly used to realize this architecture, but DI and DIP remain distinct concepts. DI supplies
dependencies from outside; DIP determines whether the resulting dependency structure is architecturally appropriate.

DIP is therefore not about making every class abstract, introducing interfaces everywhere, eliminating concrete classes,
or removing infrastructure dependencies. It is about ensuring that **stable, high-level policy is not structurally
controlled by volatile, low-level implementation details**.

The practical rule is: **Let policy define the capabilities it requires, and make infrastructure adapt to those
capabilities.**
