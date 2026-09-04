# Facade

The Facade pattern provides a simplified interface to a complex subsystem. It defines a higher-level entry point through
which clients can perform common operations without needing to understand or coordinate the subsystem's internal
components.

Facade is fundamentally about **interface simplification and subsystem encapsulation**. The subsystem remains composed
of its existing classes, services, and implementation details, while the facade exposes the subset of functionality that
clients commonly need.

A facade does not necessarily replace the subsystem's existing interfaces. The underlying components can remain directly
accessible when specialized clients need them. The facade provides a simpler path for the common case.

## Intent

Facade provides a unified, higher-level interface to a set of interfaces in a subsystem.

The central idea is **hide unnecessary subsystem complexity behind an interface designed around client use cases**.

A client should be able to perform a meaningful operation without knowing which internal objects must be created,
configured, invoked, or coordinated.

For example, instead of requiring a client to coordinate authentication, authorization, validation, persistence,
notification, and auditing independently, a facade can expose a higher-level operation such as:

```js
accountFacade.createAccount(input);
```

The facade coordinates the subsystem internally.

## Problem

Complex subsystems often expose many low-level components.

Consider an order-processing subsystem:

```js
const customer = customerRepository.findById(customerId);

const inventory = inventoryService.reserve(items);

const payment = paymentService.charge(customer.paymentMethod, total);

const order = orderRepository.create({
    customer,
    items,
    payment
});

notificationService.sendOrderConfirmation(customer, order);

auditService.record("order-created", order);
```

A client that performs this workflow must understand:

* which components are involved;
* which operations must happen first;
* which data must be passed between components;
* which operations are mandatory;
* which failures require compensation;
* which infrastructure services are needed.

The client has become coupled to the internal structure of the subsystem.

A facade can expose the workflow as a single higher-level operation:

```js
orderFacade.placeOrder({
    customerId,
    items,
    paymentMethod
});
```

The facade owns the coordination required to execute the use case.

## Subsystem

The subsystem is the collection of components whose complexity the facade simplifies.

A subsystem may contain:

* domain services;
* repositories;
* infrastructure clients;
* parsers;
* validators;
* factories;
* persistence mechanisms;
* external service integrations;
* configuration;
* workflow components;
* internal helper objects.

The subsystem does not need to be a separate package or module. The term refers to a conceptual boundary around related
functionality.

A facade becomes useful when clients would otherwise need to understand too much of that internal structure.

## Facade Interface

A facade should expose operations that correspond to meaningful client-level tasks rather than simply copying every
subsystem operation.

For example:

```js
class OrderFacade {
    constructor({
                    customerService,
                    inventoryService,
                    paymentService,
                    orderService,
                    notificationService
                }) {
        this.customerService = customerService;
        this.inventoryService = inventoryService;
        this.paymentService = paymentService;
        this.orderService = orderService;
        this.notificationService = notificationService;
    }

    async placeOrder(input) {
        const customer =
            await this.customerService.getCustomer(input.customerId);

        await this.inventoryService.reserve(input.items);

        const payment =
            await this.paymentService.charge(
                customer,
                input.paymentMethod,
                input.items
            );

        const order =
            await this.orderService.create({
                customer,
                items: input.items,
                payment
            });

        await this.notificationService.sendConfirmation(order);

        return order;
    }
}
```

The client now depends on the use-case-level contract rather than the internal subsystem components.

The facade is therefore not merely a shorter syntax for calling several objects. Its purpose is to establish a more
appropriate abstraction boundary.

## Simplification

Facade reduces the amount of knowledge required by a client.

Without a facade, the client needs to know the subsystem's internal collaboration model.

With a facade, the client needs to know only the facade's contract.

This creates a reduction in **client-to-subsystem coupling**.

The internal subsystem can potentially change its implementation without forcing every client to change, provided the
facade contract remains stable.

For example, the subsystem could replace one payment provider with another, change its persistence mechanism, or
introduce additional validation while keeping:

```js
orderFacade.placeOrder(input);
```

unchanged.

The facade therefore acts as a boundary around implementation complexity.

## Facade Does Not Mean Complete Encapsulation

A facade does not necessarily prevent access to the underlying subsystem.

Specialized clients may still require lower-level functionality.

For example:

```js
const facade = new MediaFacade(...);

await facade.convertVideo(input);
```

might be sufficient for ordinary clients, while an advanced client might need direct access to a codec configuration
object.

The existence of a facade does not require the subsystem to become inaccessible.

This is an important distinction between **simplification** and **strict encapsulation**.

A facade provides a preferred high-level interface. It does not inherently prohibit lower-level interfaces.

## Facade and API Design

Facade is closely related to API design because an API often serves as a simplified boundary over internal
implementation.

A public module can expose:

```js
export {
    createUser,
    authenticateUser,
    resetPassword
};
```

while internally coordinating many services.

The exported API effectively acts as a facade when it intentionally hides subsystem complexity and presents a
client-oriented interface.

The pattern is therefore not restricted to classes. A module, service, function, object, or endpoint can serve as a
facade when its purpose is to provide simplified access to a more complex subsystem.

## Module Facade

JavaScript modules provide a natural mechanism for implementing Facade.

Suppose the subsystem contains:

```js
// internal/parser.js
// internal/validator.js
// internal/compiler.js
// internal/emitter.js
```

A public module can expose only the common workflow:

```js
import {parse} from "./internal/parser.js";
import {validate} from "./internal/validator.js";
import {compile} from "./internal/compiler.js";
import {emit} from "./internal/emitter.js";

export function build(source) {
    const ast = parse(source);
    validate(ast);
    const compiled = compile(ast);
    return emit(compiled);
}
```

Clients can use:

```js
import {build} from "./compiler.js";

const output = build(source);
```

They do not need to know the internal sequence.

This is a particularly natural form of Facade in JavaScript because module boundaries can expose a stable public surface
while keeping implementation modules private by convention or by package/module structure.

## Class Facade

A facade can also be represented explicitly as a class.

```js
class VideoConversionFacade {
    constructor({
                    codec,
                    bitrate,
                    audio,
                    fileSystem
                }) {
        this.codec = codec;
        this.bitrate = bitrate;
        this.audio = audio;
        this.fileSystem = fileSystem;
    }

    async convert(input, output) {
        const source = await this.fileSystem.read(input);

        const decoded = await this.codec.decode(source);

        const encoded =
            await this.codec.encode(
                decoded,
                this.bitrate
            );

        const withAudio =
            await this.audio.process(encoded);

        await this.fileSystem.write(output, withAudio);
    }
}
```

The facade owns the workflow while the underlying components remain independently implemented.

## Function Facade

A facade does not require object-oriented structure.

A function can act as a facade:

```js
async function registerUser(input) {
    const validated = validateRegistration(input);

    const user = await userService.create(validated);

    await emailService.sendWelcome(user);

    await auditService.record("user-created", user);

    return user;
}
```

This can be preferable when the subsystem operation is naturally procedural or functional.

The pattern concerns the abstraction boundary, not whether the implementation uses classes.

## Facade and Workflow Coordination

A facade frequently coordinates several operations.

This does not mean that every function that calls multiple services is automatically a facade.

The important question is whether the function provides a **simplified interface to a larger subsystem**.

For example:

```js
async function createInvoice(input) {
    const customer = await customers.find(input.customerId);
    const prices = await pricing.calculate(input.items);
    const invoice = await invoices.create(customer, prices);
    await notifications.send(invoice);

    return invoice;
}
```

This is facade-like if it represents the public entry point to an invoicing subsystem.

If it is merely an internal helper that happens to call multiple functions, labeling it a Facade adds little value.

The pattern describes a deliberate architectural role, not a call count.

## Facade and Use Cases

Application-layer use cases often resemble facades because they provide a high-level interface over multiple lower-level
components.

For example:

```ts
class PlaceOrder {
    constructor(
        private readonly customers: CustomerRepository,
        private readonly inventory: InventoryService,
        private readonly payments: PaymentService,
        private readonly orders: OrderRepository
    ) {
    }

    async execute(input: PlaceOrderInput): Promise<Order> {
        const customer =
            await this.customers.findById(input.customerId);

        await this.inventory.reserve(input.items);

        const payment =
            await this.payments.charge(
                customer,
                input.items
            );

        return this.orders.create({
            customer,
            items: input.items,
            payment
        });
    }
}
```

This is often described as a use-case or application service rather than literally calling it a Facade.

The concepts overlap because both provide a higher-level interface over lower-level collaboration.

The distinction is useful: **Facade describes the simplification role; application service or use case describes the
architectural responsibility and layer.**

A use case may therefore be implemented as a facade over domain and infrastructure services without requiring the entire
concept to be reduced to the GoF pattern.

## Facade and Encapsulation

Facade contributes to encapsulation by preventing clients from depending on unnecessary implementation details.

Suppose a client directly depends on:

```js
parser
validator
compiler
optimizer
emitter
```

The client is coupled to all five components.

If the client depends only on:

```js
compilerFacade.compile(source);
```

then changes inside the subsystem have a smaller impact surface.

This is often more valuable than merely reducing the number of lines of client code.

The primary architectural benefit is **dependency reduction**.

## Dependency Reduction

A facade can reduce the number of subsystem types a client must know about.

Without a facade:

```js
import {Parser} from "./parser.js";
import {Validator} from "./validator.js";
import {Compiler} from "./compiler.js";
import {Optimizer} from "./optimizer.js";
import {Emitter} from "./emitter.js";
```

With a facade:

```js
import {CompilerFacade} from "./compiler-facade.js";
```

This reduces compile-time, structural, and conceptual coupling.

It also makes dependency graphs easier to reason about because clients depend on a smaller public surface.

## Facade and Stability

A facade can provide a stable interface over an unstable subsystem.

Suppose an internal implementation evolves from:

```js
legacyPaymentService
```

to:

```js
paymentGateway
fraudService
ledgerService
```

A facade can preserve:

```js
paymentFacade.processPayment(input);
```

while changing its internal coordination.

This makes the facade useful as a **change containment boundary**.

However, the facade must actually maintain a stable abstraction. If every internal change leaks through its public
contract, the facade provides little isolation.

## Facade and Third-Party Libraries

Facade is frequently useful when integrating third-party libraries.

Instead of allowing application code to depend directly on a library:

```js
import ThirdPartyClient from "third-party-library";

const client = new ThirdPartyClient({
    /* configuration */
});

await client.authenticate();
await client.createResource(...);
await client.waitForCompletion();
```

the application can expose its own abstraction:

```js
class ResourceClient {
    constructor(client) {
        this.client = client;
    }

    async create(input) {
        await this.client.authenticate();

        const resource =
            await this.client.createResource(input);

        return this.client.waitForCompletion(resource.id);
    }
}
```

Application code now depends on `ResourceClient`.

The facade can isolate library-specific initialization, workflow, configuration, error handling, and response
normalization.

If the wrapper also translates an incompatible interface, it may additionally contain Adapter responsibilities. These
concepts can coexist, but they should not be confused.

## Facade and Adapter

Facade and Adapter both simplify interaction with other components, but their intent differs.

**Adapter makes an existing interface compatible with another interface.**

**Facade provides a simpler interface to a subsystem.**

An Adapter is used because the client expects one contract while the existing object provides another:

```js
const repository = new RepositoryAdapter(legacyRepository);
```

A Facade is used because the subsystem is too complex for the client's needs:

```js
const result = await mediaFacade.convert(input);
```

The underlying subsystem may already have perfectly usable interfaces. The facade simply provides a higher-level entry
point.

A facade can internally use adapters when the subsystem contains incompatible components, but that does not make the
facade itself an Adapter.

## Facade and Decorator

Facade and Decorator can both appear as wrapper objects, but they solve different problems.

**Decorator preserves a component's contract and adds responsibilities to that component.**

**Facade defines a new, simplified interface over multiple subsystem operations.**

A decorator normally remains substitutable for the object it wraps:

```js
const service = new LoggingDecorator(service);
```

A facade usually provides a different abstraction:

```js
const facade = new OrderFacade(...);

await facade.placeOrder(input);
```

The facade is not simply an enhanced version of one underlying component. It is a higher-level interface to a collection
of components.

## Facade and Proxy

Proxy and Facade can both stand between clients and another object or subsystem.

**Proxy preserves the target's interface while controlling access to that target.**

**Facade simplifies access to a subsystem by exposing a higher-level interface.**

A proxy commonly maintains the same conceptual abstraction:

```js
const service = new ServiceProxy(realService);
service.execute(input);
```

A facade may expose operations that do not correspond one-to-one with any single subsystem object:

```js
await facade.createAccount(input);
```

The facade can coordinate multiple objects and multiple operations.

## Facade and Bridge

Bridge separates an abstraction from its implementation so that the two dimensions can vary independently.

Facade does not create two independent variation dimensions.

Facade instead reduces the complexity visible to clients.

A system may use Bridge internally and expose a Facade externally. The patterns operate at different structural
concerns.

## Facade and Composite

Composite organizes objects into recursive part-whole structures and allows clients to treat individual objects and
compositions uniformly.

Facade does not require recursive structure or uniform treatment of leaves and composites.

A facade may internally use a Composite, but its purpose is to simplify subsystem access rather than represent a
part-whole hierarchy.

## Facade and Mediator

Facade and Mediator are particularly easy to confuse because both can coordinate multiple objects.

Their responsibilities differ.

A **Facade simplifies access to a subsystem from external clients.**

A **Mediator centralizes communication and collaboration between peer objects within a system.**

For example, a facade might provide:

```js
checkoutFacade.checkout(input);
```

while internally coordinating payment, inventory, and shipping.

A mediator might instead coordinate interactions among UI controls:

```js
dialogMediator.notify(sender, event);
```

The mediator manages peer collaboration. The facade manages the boundary presented to external clients.

A facade therefore primarily defines a simplified subsystem interface, while a mediator primarily reduces direct
coupling between collaborating peers.

## Facade and Command

Command encapsulates a request as an object.

Facade provides a simplified interface to subsystem functionality.

They can be combined:

```js
const command = facade.createOrderCommand(input);

command.execute();
```

The facade can construct commands internally, but the two patterns solve different problems.

Command represents a request as a first-class object. Facade simplifies access to the underlying subsystem.

## Facade and Abstract Factory

Abstract Factory creates related families of objects.

Facade can use an Abstract Factory to construct its subsystem dependencies, but object creation is not the primary
purpose of Facade.

For example:

```js
const services = factory.createOrderServices();

const facade = new OrderFacade(services);
```

The factory manages creation. The facade manages simplified interaction.

## Layered Architecture

Facade is useful at architectural layer boundaries.

An infrastructure layer may expose a facade around several infrastructure clients.

An application layer may expose use-case-level interfaces over domain and infrastructure services.

A domain subsystem may expose a simplified service over several internal domain operations.

The important architectural principle is to avoid forcing higher-level clients to understand lower-level implementation
structure unnecessarily.

A facade can therefore function as a boundary that reduces downward coupling.

## Package and Module Boundaries

Facade is particularly valuable at package boundaries.

A package may internally contain dozens of modules but expose only a small public API:

```js
export {
    createClient,
    authenticate,
    upload
};
```

The package's public API becomes a facade over the internal implementation.

This allows internal modules to change without requiring consumers to understand or depend on them.

A strong package facade also prevents accidental coupling to implementation modules.

## Public API Surface

A facade should be intentionally smaller than the subsystem it represents.

Exposing every internal operation defeats the purpose.

For example, this is usually a poor facade:

```js
class UserFacade {
    findUser() {
    }

    validateUser() {
    }

    normalizeUser() {
    }

    buildQuery() {
    }

    executeQuery() {
    }

    mapDatabaseRow() {
    }

    createCacheKey() {
    }

    invalidateCache() {
    }
}
```

The facade has become a dumping ground for subsystem functionality.

A better interface represents client-level operations:

```js
class UserFacade {
    getUser(id) {
    }

    updateUser(id, input) {
    }

    deactivateUser(id) {
    }
}
```

The internal implementation can remain complex while the public interface remains task-oriented.

## Facade Granularity

A facade can operate at different levels.

A small facade can simplify one library or technical subsystem.

A larger facade can simplify an entire application subsystem.

An architectural facade can expose an integration boundary over several services.

The appropriate granularity depends on the complexity and stability of the boundary.

A facade should not be introduced merely because a subsystem contains several classes. It becomes valuable when clients
would otherwise need unnecessary knowledge of those classes and their coordination.

## Stateful Facades

A facade may or may not maintain state.

A stateless facade typically delegates to injected services:

```js
class UserFacade {
    constructor(userService) {
        this.userService = userService;
    }

    getUser(id) {
        return this.userService.getUser(id);
    }
}
```

A stateful facade may maintain workflow state, sessions, caches, or transactions.

State increases the facade's responsibility and therefore requires explicit lifecycle and concurrency considerations.

A facade should not accumulate state merely because it happens to be the convenient place to store it.

## Error Handling

A facade often has an opportunity to establish a higher-level error contract.

Instead of exposing several subsystem-specific errors:

```js
ParserError
ValidationError
DatabaseError
NetworkError
```

the facade may expose domain-level failures appropriate to its client contract.

For example:

```js
class RegistrationFacade {
    async register(input) {
        try {
            return await this.registrationService.register(input);
        } catch (error) {
            throw new RegistrationFailedError(error);
        }
    }
}
```

This can reduce coupling to implementation-specific failure types.

However, blindly converting every error into a generic error can destroy useful diagnostic information. The facade
should preserve the information required by its contract while preventing unnecessary leakage of internal implementation
details.

## Transactions and Consistency

When a facade coordinates multiple operations, transactional semantics can become important.

Consider:

```js
await inventory.reserve(items);
await payment.charge(paymentDetails);
await order.create(orderDetails);
```

If the third operation fails, the subsystem may require compensation for the previous operations.

A facade should not imply atomicity merely because multiple operations are invoked from one method.

If the facade represents a transactional workflow, the transaction or compensation strategy must be explicit.

For distributed systems, this may involve:

* local transactions;
* compensating actions;
* sagas;
* idempotency;
* retries;
* eventual consistency.

The facade can provide the high-level operation, but it does not automatically solve the consistency problem created by
the underlying workflow.

## Asynchronous Facades

Modern application subsystems are frequently asynchronous.

A facade can hide the asynchronous coordination:

```js
class MediaFacade {
    async process(input) {
        const source = await this.storage.read(input.path);

        const decoded = await this.decoder.decode(source);

        const transformed =
            await this.processor.transform(decoded);

        await this.storage.write(
            input.outputPath,
            transformed
        );

        return input.outputPath;
    }
}
```

The client interacts with one operation:

```js
await facade.process(input);
```

The facade absorbs the complexity of the internal asynchronous workflow.

This can substantially improve API usability, particularly when the subsystem requires several sequential or parallel
operations.

## Parallel Coordination

A facade may coordinate operations concurrently when they are independent.

```js
class DashboardFacade {
    constructor({
                    profileService,
                    notificationService,
                    activityService
                }) {
        this.profileService = profileService;
        this.notificationService = notificationService;
        this.activityService = activityService;
    }

    async loadDashboard(userId) {
        const [
            profile,
            notifications,
            activity
        ] = await Promise.all([
            this.profileService.getProfile(userId),
            this.notificationService.getNotifications(userId),
            this.activityService.getRecentActivity(userId)
        ]);

        return {
            profile,
            notifications,
            activity
        };
    }
}
```

The facade can therefore hide not only the number of components but also their concurrency model.

Care is required when operations have dependencies, side effects, rate limits, or failure interactions.

## Configuration

Facade can centralize subsystem configuration.

```js
class PaymentFacade {
    constructor(config) {
        this.gateway = new PaymentGateway(config.gateway);
        this.fraud = new FraudService(config.fraud);
        this.ledger = new Ledger(config.ledger);
    }
}
```

Clients do not need to know how each subsystem component is configured.

However, configuration should not become an excuse to make the facade responsible for every environment-specific concern
in the system.

Construction and configuration can be separated through factories or dependency injection when the subsystem becomes
large.

## Dependency Injection

Dependency injection allows a facade to coordinate abstractions without constructing all of its dependencies itself.

```ts
class CheckoutFacade {
    constructor(
        private readonly inventory: InventoryService,
        private readonly payment: PaymentService,
        private readonly orders: OrderRepository
    ) {
    }

    async checkout(input: CheckoutInput): Promise<Order> {
        await this.inventory.reserve(input.items);

        const payment =
            await this.payment.charge(input.payment);

        return this.orders.create({
            items: input.items,
            payment
        });
    }
}
```

The composition root can decide which implementations the facade receives.

This keeps the facade focused on coordination and simplification rather than infrastructure construction.

## Testing

Facade tests should focus primarily on the contract presented to its clients and the coordination it owns.

Dependencies can be replaced with test doubles:

```js
const inventory = {
    reserve: async () => {
    }
};

const payment = {
    charge: async () => ({id: "payment-1"})
};

const orders = {
    create: async input => input
};

const facade =
    new CheckoutFacade(
        inventory,
        payment,
        orders
    );
```

Tests can verify:

* the correct subsystem operations are invoked;
* operations occur in the correct order;
* independent operations execute concurrently when intended;
* data is transformed correctly between subsystem components;
* errors are handled according to the facade contract;
* results expose the intended abstraction rather than unnecessary implementation details.

The internal components should have their own tests. Facade tests should not reproduce every implementation detail of
the subsystem.

## Refactoring Toward Facade

A facade is often introduced when many clients duplicate the same subsystem coordination.

Suppose several callers repeatedly perform:

```js
const user = await users.find(id);
const permissions = await permissions.load(user);
const profile = await profiles.load(user);
const result = await formatter.format(
    user,
    permissions,
    profile
);
```

A facade can centralize the workflow:

```js
const result =
    await userFacade.getUserProfile(id);
```

This removes duplicated knowledge of the subsystem from the clients.

Another signal is a client that imports and coordinates a large number of low-level subsystem components.

Moving that coordination behind a facade reduces the client's dependency surface.

## Refactoring Without Over-Facading

Not every repeated sequence requires a facade.

If a workflow is already simple and stable:

```js
const user = await users.find(id);
```

introducing:

```js
await userFacade.findUser(id);
```

may add no meaningful value.

A facade should provide an abstraction benefit, not merely another indirection layer.

The strongest candidates are subsystems where clients currently need to understand internal sequencing, configuration,
component relationships, or implementation-specific details.

## Common Misuse

A common misuse is creating a facade that simply forwards every method of another class:

```js
class Facade {
    methodA(...args) {
        return subsystem.methodA(...args);
    }

    methodB(...args) {
        return subsystem.methodB(...args);
    }

    methodC(...args) {
        return subsystem.methodC(...args);
    }
}
```

This does not meaningfully simplify the subsystem.

Another misuse is turning the facade into a **god object** that contains all business logic, construction logic,
persistence logic, validation, formatting, and infrastructure behavior.

The facade should coordinate and simplify. It should not automatically absorb every responsibility that happens to be
involved in the workflow.

A third misuse is creating multiple overlapping facades whose boundaries are unclear. This can produce another layer of
architectural ambiguity rather than reducing complexity.

## Facade as a God Object

A facade can gradually accumulate responsibilities because it is already the entry point to the subsystem.

For example:

```js
class ApplicationFacade {
    createUser() {
    }

    deleteUser() {
    }

    processPayment() {
    }

    sendEmail() {
    }

    generateReport() {
    }

    resizeImage() {
    }

    importData() {
    }
}
```

This is not a useful facade merely because it provides one interface.

The facade should correspond to a coherent subsystem boundary.

A facade that spans unrelated responsibilities becomes a central coupling point and a maintenance bottleneck.

## Facade and Business Logic

A facade may coordinate business logic without necessarily owning all of it.

For example:

```js
class CheckoutFacade {
    async checkout(input) {
        const cart = await this.cartService.load(input.cartId);

        const total = cart.calculateTotal();

        const payment =
            await this.paymentService.charge(total);

        return this.orderService.create(cart, payment);
    }
}
```

The facade coordinates the use case, while domain behavior such as calculating totals can remain in the appropriate
domain object.

The distinction is important because otherwise a facade can become a procedural replacement for a well-designed domain
model.

## Security Boundaries

A facade can provide a useful security boundary by exposing only operations that clients are authorized to perform.

For example:

```js
class AdminFacade {
    constructor({
                    authorization,
                    userService
                }) {
        this.authorization = authorization;
        this.userService = userService;
    }

    async deactivateUser(actor, userId) {
        await this.authorization.requireAdmin(actor);

        return this.userService.deactivate(userId);
    }
}
```

However, a facade should not be treated as the sole security mechanism merely because it is a high-level entry point.
Authorization requirements must be enforced at the appropriate trust boundary.

The facade can simplify the security-sensitive workflow, but the underlying subsystem must not become insecure merely
because a lower-level interface is bypassing the facade.

## Versioning

A facade can isolate clients from subsystem version changes.

Suppose a third-party service changes:

```js
legacyClient.createUser(...)
```

to:

```js
modernClient.users.create(...)
```

The facade can preserve:

```js
userFacade.createUser(input);
```

while changing its internal implementation.

This makes facade boundaries useful for migration and compatibility.

The facade should therefore expose a contract based on application requirements rather than mirroring the current
third-party API.

## Distributed Systems

Facade concepts also apply across service boundaries.

An API gateway or backend-for-frontend can expose a simplified endpoint while coordinating multiple backend services.

For example, a client might request:

```http
GET /dashboard
```

while the backend retrieves data from several services.

This is architecturally facade-like because the client sees one higher-level interface instead of coordinating multiple
service calls itself.

However, an API gateway has additional concerns such as routing, authentication, rate limiting, observability, protocol
translation, and resilience. Calling the entire gateway simply a GoF Facade can therefore obscure those additional
architectural responsibilities.

The GoF concept remains useful as one of the underlying design ideas.

## Facade in Libraries

Libraries commonly expose a facade over complicated internal functionality.

A consumer may use:

```js
await compiler.compile(source);
```

without knowing that compilation internally involves parsing, validation, transformation, optimization, code generation,
and output formatting.

This is one of the strongest applications of Facade because library consumers generally benefit from a stable,
task-oriented API while the library remains free to evolve its internal implementation.

## Facade and Information Hiding

Facade is closely related to information hiding.

The subsystem's internal details may include:

* implementation classes;
* sequencing rules;
* temporary data structures;
* infrastructure-specific configuration;
* internal protocols;
* retry behavior;
* resource management.

Clients should not need to depend on these details unless they genuinely require them.

The facade therefore creates an abstraction boundary where internal knowledge can be hidden from ordinary consumers.

## Dependency Stability

A facade can improve dependency stability by making clients depend on a smaller and more stable abstraction.

Without a facade, a client may depend on ten subsystem classes.

With a facade, it may depend on one interface.

The subsystem can then evolve internally with fewer downstream effects.

This does not mean the facade automatically guarantees stability. Its contract must be deliberately designed to avoid
exposing volatile implementation details.

## Performance

Facade itself generally introduces little computational overhead.

Its primary cost is another abstraction layer and whatever coordination it performs.

In fact, a facade can sometimes improve performance because it centralizes opportunities for:

* batching;
* parallel execution;
* caching;
* connection reuse;
* request coalescing.

For example, a facade can combine several independent data requests into one coordinated operation.

Performance benefits should not be assumed, however. The facade may also introduce additional transformations or
coordination overhead.

## Observability

A facade can provide a natural instrumentation point for high-level operations.

```js
class OrderFacade {
    async placeOrder(input) {
        const start = performance.now();

        try {
            const order = await this.orderService.place(input);

            metrics.record("order.success", {
                duration: performance.now() - start
            });

            return order;
        } catch (error) {
            metrics.record("order.failure", {
                duration: performance.now() - start
            });

            throw error;
        }
    }
}
```

This can provide operation-level metrics that are meaningful to the application.

Lower-level components can still provide detailed instrumentation where necessary.

## When to Use Facade

Facade is appropriate when:

* a subsystem is complex relative to its common use cases;
* clients currently coordinate many internal components;
* clients depend on implementation details they should not know;
* the same subsystem workflow is repeatedly implemented by different clients;
* a stable public interface is needed over a changing implementation;
* a package or module needs a deliberately small public API;
* a higher-level operation should hide internal sequencing and configuration.

Facade is particularly valuable when the main problem is **too much knowledge required from the client**.

## When Not to Use Facade

Facade is usually unnecessary when:

* the underlying interface is already simple;
* clients genuinely need low-level subsystem functionality;
* the facade only forwards methods without simplifying anything;
* the subsystem does not have a coherent boundary;
* introducing the facade would create another unnecessary abstraction layer;
* the facade would become a centralized god object;
* the primary problem is interface incompatibility rather than complexity;
* the primary problem is behavioral extension rather than simplification.

The existence of multiple classes is not by itself evidence that a facade is required.

## Benefits

Facade provides several important benefits.

**Reduced coupling.** Clients depend on fewer subsystem components.

**Simplified usage.** Common workflows can be expressed through a small number of high-level operations.

**Information hiding.** Internal implementation details remain outside the client's dependency surface.

**Change containment.** Internal subsystem changes can often be made without changing facade consumers.

**Centralized coordination.** Repeated subsystem workflows can be implemented in one place.

**Stable public APIs.** A facade can provide a client-oriented contract over volatile internals.

**Improved usability.** Consumers can work with meaningful operations rather than low-level implementation primitives.

## Costs

Facade also introduces costs.

**Additional abstraction.** There is another layer between clients and the subsystem.

**Potential god object.** Poorly designed facades can accumulate unrelated responsibilities.

**Contract maintenance.** A facade requires deliberate API design and versioning.

**Possible loss of flexibility.** Clients that genuinely need low-level capabilities may still need direct subsystem
access.

**Coordination responsibility.** Complex workflows can make the facade difficult to maintain if coordination logic grows
excessively.

**Abstraction leakage.** If subsystem details continually appear in the facade's API, the boundary is not doing its job.

Facade is therefore most valuable when the reduction in client complexity is greater than the cost of maintaining the
additional interface.

## Decision Criteria

Use Facade when the primary design question is:

**How can clients interact with this complex subsystem through a smaller, higher-level interface without needing to
understand its internal structure?**

Prefer Adapter when the primary problem is interface incompatibility.

Prefer Decorator when the primary problem is adding responsibilities to an existing object while preserving its
contract.

Prefer Proxy when the primary problem is controlling access to an object.

Prefer Bridge when the primary problem is separating independently varying abstractions and implementations.

Prefer Mediator when the primary problem is reducing direct coupling among peer objects.

Prefer Composite when the primary problem is representing recursive part-whole structures.

## Summary

Facade provides a simplified, higher-level interface to a complex subsystem.

Its central purpose is **reducing the knowledge and coupling required by clients**. The facade hides unnecessary
internal coordination, sequencing, configuration, and implementation details while exposing operations that correspond
to meaningful client-level tasks.

A facade can be implemented as a class, function, module, package API, service boundary, or another abstraction that
presents a simpler interface over a more complex subsystem.

Facade does not require the underlying subsystem to become inaccessible. Specialized clients may still use lower-level
interfaces when necessary. The facade establishes a preferred high-level boundary for common use cases.

The pattern is distinct from Adapter because it simplifies rather than translates interfaces, from Decorator because it
introduces a new higher-level interface rather than preserving one component contract while adding behavior, and from
Proxy because it simplifies subsystem interaction rather than primarily controlling access to one target.

A good facade is small, coherent, client-oriented, and stable. A bad facade merely forwards methods or becomes a
centralized god object.

The central design principle is: **when clients should not need to understand the internal structure and coordination of
a subsystem, provide a focused higher-level interface that encapsulates that complexity.**
