# Adapter

## Intent

**Adapter converts the interface of an existing object into an interface expected by the client.** It allows otherwise
incompatible components to collaborate without changing the adapted component itself.

Adapter is fundamentally an **interface compatibility pattern**. The adapted object already provides useful behavior,
but its public interface does not match what the consuming code expects. The adapter translates the client's requests
into operations understood by the adaptee and, when necessary, translates the adaptee's results or errors back into the
client's expected form.

The pattern is particularly useful when integrating legacy code, third-party libraries, external APIs, incompatible
abstractions, or components owned by another team.

## The Problem

A client is designed against an interface:

```js
class PaymentProcessor {
    processPayment(amount) {
        // ...
    }
}
```

An existing component provides equivalent functionality through a different interface:

```js
class LegacyPaymentGateway {
    makePaymentInCents(cents) {
        // ...
    }
}
```

The two components represent compatible functionality but incompatible interfaces. Changing the client to understand
every external interface spreads integration concerns throughout the application.

Changing the adaptee may also be impossible or undesirable. It may be third-party code, legacy code, shared
infrastructure, or a component whose existing consumers depend on its current API.

An adapter introduces a translation boundary:

```js
class PaymentGatewayAdapter {
    constructor(gateway) {
        this.gateway = gateway;
    }

    processPayment(amount) {
        return this.gateway.makePaymentInCents(amount * 100);
    }
}
```

The client continues to use the interface it expects:

```js
const gateway = new PaymentGatewayAdapter(
    new LegacyPaymentGateway()
);

gateway.processPayment(25);
```

The client does not need to know that the underlying implementation uses cents or a differently named operation.

## Structure

The essential participants are:

* **Client** — code that depends on the expected interface.
* **Target** — the interface or contract expected by the client.
* **Adapter** — implements the target interface and translates requests.
* **Adaptee** — the existing component whose interface is incompatible with the target.

The Target and Adaptee are conceptually distinct even when JavaScript does not express either one as an explicit
interface.

The important relationship is:

**Client → Target ← Adapter → Adaptee**

The adapter is the compatibility boundary. The client depends on the target contract rather than on the adaptee's native
API.

## Object Adapter

The most common form in JavaScript is the **object adapter**. The adapter receives an existing adaptee instance and
delegates operations to it.

```js
class StripePaymentGateway {
    async createPayment(amountInCents, currency) {
        // ...
    }
}

class PaymentGatewayAdapter {
    constructor(gateway) {
        this.gateway = gateway;
    }

    async processPayment(amount, currency) {
        return this.gateway.createPayment(
            Math.round(amount * 100),
            currency
        );
    }
}
```

The adapter owns the translation:

```js
const gateway = new PaymentGatewayAdapter(
    new StripePaymentGateway()
);

await gateway.processPayment(49.99, "USD");
```

This approach preserves composition and works naturally with JavaScript's object model.

## Class Adapter

The classical GoF pattern also describes a **class adapter**, where the adapter inherits from the adaptee while
implementing the target interface.

Languages with multiple inheritance can combine a target interface and adaptee implementation directly. JavaScript does
not support multiple class inheritance, so the classical form does not map cleanly to JavaScript.

A JavaScript class can extend one superclass:

```js
class LegacyGateway {
    makePayment(amountInCents) {
        // ...
    }
}

class PaymentGatewayAdapter extends LegacyGateway {
    processPayment(amount) {
        return this.makePayment(amount * 100);
    }
}
```

This can technically adapt an inherited implementation, but it is generally less flexible than object composition.

Composition is usually preferable because the adapter can wrap any compatible adaptee instance and does not couple the
adapter's inheritance hierarchy to the adaptee.

## Interface Translation

Adapter translation can involve more than renaming methods.

An adapter may translate:

* method names;
* parameter order;
* parameter structures;
* return values;
* data representations;
* units;
* error types;
* asynchronous behavior;
* optional values;
* status codes;
* naming conventions;
* lifecycle operations;
* callback-based APIs into promises;
* external models into domain models.

For example:

```js
class LegacyUserService {
    getUser(userId, callback) {
        // ...
    }
}

class UserServiceAdapter {
    constructor(service) {
        this.service = service;
    }

    getUser(userId) {
        return new Promise((resolve, reject) => {
            this.service.getUser(userId, (error, user) => {
                if (error) {
                    reject(error);
                    return;
                }

                resolve({
                    id: user.user_id,
                    name: user.full_name,
                    email: user.email_address
                });
            });
        });
    }
}
```

The adapter is not merely renaming `getUser`. It translates both the invocation model and the returned data model.

## Data Translation

Adapters frequently translate between different data representations.

```js
class ExternalOrderAdapter {
    constructor(api) {
        this.api = api;
    }

    async getOrder(id) {
        const response = await this.api.fetchOrder(id);

        return {
            id: response.order_id,
            customerId: response.customer.id,
            total: response.total_amount,
            currency: response.currency_code,
            status: response.order_status
        };
    }
}
```

The rest of the application can operate on its expected representation without depending on the external API's naming
conventions.

This is particularly valuable at architectural boundaries. External representations can remain isolated at the boundary
instead of leaking into the domain or application layers.

## Adapter as an Integration Boundary

Adapter is frequently used at system boundaries.

Typical examples include:

* payment providers;
* cloud SDKs;
* database drivers;
* message brokers;
* HTTP clients;
* file systems;
* logging libraries;
* authentication providers;
* notification services;
* storage providers;
* legacy systems;
* third-party APIs.

For example, an application may define its own storage abstraction:

```js
class UserRepository {
    async findById(id) {
        // ...
    }

    async save(user) {
        // ...
    }
}
```

A specific persistence technology can then be adapted to that contract:

```js
class MongoUserRepositoryAdapter {
    constructor(collection) {
        this.collection = collection;
    }

    async findById(id) {
        const document = await this.collection.findOne({_id: id});

        if (!document) {
            return null;
        }

        return {
            id: document._id,
            name: document.name,
            email: document.email
        };
    }

    async save(user) {
        await this.collection.replaceOne(
            {_id: user.id},
            {
                _id: user.id,
                name: user.name,
                email: user.email
            },
            {upsert: true}
        );
    }
}
```

The application depends on the repository contract rather than directly on MongoDB's API.

## Dependency Inversion

Adapter often appears as part of a dependency-inversion architecture.

The application defines the contract it needs:

```js
class NotificationService {
    async send(message) {
        // ...
    }
}
```

An external provider has a different API:

```js
class SendGridClient {
    async sendMail(options) {
        // ...
    }
}
```

An adapter reconciles the two:

```js
class SendGridNotificationAdapter {
    constructor(client) {
        this.client = client;
    }

    async send(message) {
        await this.client.sendMail({
            to: message.recipient,
            subject: message.subject,
            text: message.body
        });
    }
}
```

The dependency direction is therefore controlled by the application's required contract rather than by the external
library's API.

Adapter does not itself establish dependency inversion. It provides the translation mechanism that makes an inverted
dependency boundary practical.

## Domain-Facing Adapters

A particularly useful architectural form is an adapter that prevents infrastructure concerns from entering the domain
model.

For example:

```js
class PaymentService {
    constructor(paymentGateway) {
        this.paymentGateway = paymentGateway;
    }

    async charge(order) {
        return this.paymentGateway.charge({
            amount: order.total,
            currency: order.currency
        });
    }
}
```

An infrastructure adapter can translate that domain-oriented operation into an external provider's API:

```js
class ExternalPaymentAdapter {
    constructor(client) {
        this.client = client;
    }

    async charge(payment) {
        const response = await this.client.createPaymentIntent({
            amount: Math.round(payment.amount * 100),
            currency: payment.currency.toLowerCase()
        });

        return {
            transactionId: response.id,
            status: response.status
        };
    }
}
```

The domain-facing contract remains stable even if the provider changes.

## JavaScript Functions as Adapters

JavaScript does not require a class to implement an adapter.

A function can be the adapter when the target contract is functional.

```js
function adaptLogger(logger) {
    return {
        info(message) {
            logger.log("INFO", message);
        },

        error(message) {
            logger.log("ERROR", message);
        }
    };
}
```

Usage:

```js
const logger = adaptLogger(existingLogger);

logger.info("Application started");
logger.error("Request failed");
```

This is still Adapter because the essential operation is interface translation. The presence or absence of a class is
irrelevant.

## Higher-Order Function Adapters

A function can also adapt one function signature into another.

```js
function adaptCallbackApi(callbackApi) {
    return (...args) =>
        new Promise((resolve, reject) => {
            callbackApi(...args, (error, value) => {
                if (error) {
                    reject(error);
                    return;
                }

                resolve(value);
            });
        });
}
```

The adapter converts a callback-based contract into a promise-based contract.

This is an example of Adapter expressed idiomatically through JavaScript functions.

## Asynchronous Adapters

Adapters often normalize asynchronous behavior.

For example, an external library may return callbacks while the application expects promises, or the external API may
expose synchronous operations while the application contract is asynchronous.

```js
class UserServiceAdapter {
    constructor(legacyService) {
        this.legacyService = legacyService;
    }

    getUser(id) {
        return new Promise((resolve, reject) => {
            this.legacyService.getUser(id, (error, result) => {
                if (error) {
                    reject(error);
                    return;
                }

                resolve({
                    id: result.userId,
                    name: result.displayName
                });
            });
        });
    }
}
```

The adapter therefore becomes the boundary where asynchronous semantics are normalized.

## Error Translation

External systems frequently expose error models that should not leak into the rest of the application.

```js
class PaymentProviderError extends Error {
}

class PaymentAdapter {
    constructor(provider) {
        this.provider = provider;
    }

    async charge(payment) {
        try {
            const result = await this.provider.charge(payment);

            return {
                transactionId: result.id,
                status: result.status
            };
        } catch (error) {
            throw new PaymentProviderError(
                `Payment provider rejected the transaction: ${error.message}`
            );
        }
    }
}
```

Error translation should be deliberate. An adapter should preserve information that the application actually needs
rather than blindly exposing provider-specific errors.

## Semantic Compatibility

Matching method signatures is not sufficient for a correct adapter.

Two APIs can have identical method names and parameter types while having different semantics.

For example:

```js
deleteUser(id)
```

could mean:

* permanently delete the user;
* deactivate the user;
* mark the user for asynchronous deletion;
* return successfully even when the user does not exist.

An adapter must therefore reconcile **behavioral contracts**, not merely syntax.

A correct adapter must understand the semantics of both interfaces and preserve the guarantees expected by the target
contract.

## Contract Preservation

The adapter should preserve the target's observable contract.

This includes considerations such as:

* accepted inputs;
* output structure;
* error behavior;
* asynchronous behavior;
* nullability;
* ordering guarantees;
* idempotency;
* transactional behavior;
* lifecycle expectations;
* resource ownership.

If the target contract promises an operation is idempotent but the adaptee is not, simply forwarding the call does not
produce a valid adapter.

The adapter may need additional logic to reconcile the difference, or the incompatibility may be fundamental and require
a different integration design.

## Adapter and Third-Party Libraries

Adapter is particularly useful when consuming third-party libraries directly would create excessive coupling.

Instead of:

```js
import ThirdPartyClient from "third-party-client";

export async function createUser(user) {
    const client = new ThirdPartyClient();

    return client.users.create({
        given_name: user.firstName,
        family_name: user.lastName,
        email_address: user.email
    });
}
```

the application can define its own abstraction:

```js
class UserProvider {
    async createUser(user) {
        // ...
    }
}
```

and isolate the third-party API:

```js
class ThirdPartyUserAdapter {
    constructor(client) {
        this.client = client;
    }

    async createUser(user) {
        const result = await this.client.users.create({
            given_name: user.firstName,
            family_name: user.lastName,
            email_address: user.email
        });

        return {
            id: result.id,
            firstName: result.given_name,
            lastName: result.family_name,
            email: result.email_address
        };
    }
}
```

This allows the application-facing contract to remain stable when the external provider changes.

## Multiple Adapters

Multiple implementations of the same target interface can coexist.

```js
class StripePaymentAdapter {
    async charge(payment) {
        // Stripe-specific translation
    }
}

class AdyenPaymentAdapter {
    async charge(payment) {
        // Adyen-specific translation
    }
}

class TestPaymentAdapter {
    async charge(payment) {
        // Test implementation
    }
}
```

The application can depend on the same contract while infrastructure-specific adapters vary.

This is particularly useful when an architecture needs provider substitution, testing, or gradual migration.

## Adapter Composition

Adapters can themselves be composed when multiple compatibility transformations are necessary.

```js
const callbackService = new LegacyService();
const promiseService = adaptCallbackApi(
    callbackService.execute.bind(callbackService)
);
```

However, excessive adapter chaining can make the actual contract difficult to understand.

If every integration requires several translation layers, the system may need a clearer canonical abstraction or a more
deliberate boundary design.

## Adapter vs Facade

Adapter and Facade both wrap existing functionality, but they solve different problems.

**Adapter solves interface incompatibility.**

**Facade simplifies a complex subsystem.**

An adapter makes one interface usable as another:

```js
class Adapter {
    execute(request) {
        return adaptee.differentOperation(
            transform(request)
        );
    }
}
```

A facade exposes a simpler API over multiple existing operations:

```js
class OrderFacade {
    async placeOrder(order) {
        await this.inventory.reserve(order);
        await this.payment.charge(order);
        await this.shipping.createShipment(order);
    }
}
```

The facade does not necessarily reconcile incompatible interfaces. It provides a simplified entry point to a subsystem.

## Adapter vs Decorator

Decorator preserves the existing interface while adding responsibilities.

```js
class LoggingRepository {
    constructor(repository) {
        this.repository = repository;
    }

    async findById(id) {
        console.log("Finding user", id);
        return this.repository.findById(id);
    }
}
```

Adapter changes one interface into another.

If the wrapper exists because the client expects a different contract, it is Adapter. If the wrapper exists to add
behavior while preserving the contract, it is Decorator.

## Adapter vs Proxy

Proxy provides another access point to an object while generally preserving its interface.

Typical proxy concerns include:

* access control;
* lazy loading;
* caching;
* remote access;
* logging;
* lifecycle control.

Adapter changes the interface.

A proxy might expose:

```js
repository.findById(id)
```

and forward the same operation.

An adapter might expose:

```js
userService.getUser(id)
```

while internally calling:

```js
repository.findOne({_id: id})
```

The distinction is the contract being exposed to the client.

## Adapter vs Bridge

Bridge separates an abstraction from its implementation so both can vary independently.

Adapter is normally introduced because two already-existing interfaces are incompatible.

Bridge is designed proactively to avoid coupling between abstraction and implementation dimensions.

Adapter is therefore commonly a **retrofit compatibility mechanism**, while Bridge is an **independent variation
mechanism**.

## Adapter vs Strategy

Strategy encapsulates interchangeable algorithms behind a common interface.

```js
class Checkout {
    constructor(pricingStrategy) {
        this.pricingStrategy = pricingStrategy;
    }

    calculate(order) {
        return this.pricingStrategy.calculate(order);
    }
}
```

The strategy implementations are designed to satisfy the same contract.

Adapter is different: the underlying component already exists with a different contract, and the adapter reconciles it
with the required one.

## Adapter vs Facade in Integration Architecture

An integration component can sometimes perform both adaptation and simplification.

For example:

```js
class PaymentProviderAdapter {
    async charge(payment) {
        // translate application contract
        // call provider
        // translate provider response
    }
}
```

If it only translates the application's contract into the provider's contract, it is an adapter.

If it additionally orchestrates several provider APIs, hides subsystem complexity, manages workflows, and presents a
simplified high-level operation, it may also function as a facade.

The names describe different responsibilities. A single integration component can legitimately have more than one
pattern characteristic, but the responsibilities should remain clear.

## Adapter and TypeScript

TypeScript makes the target contract explicit.

```ts
interface PaymentGateway {
    processPayment(
        amount: number,
        currency: string
    ): Promise<PaymentResult>;
}
```

The adaptee has a different contract:

```ts
interface ExternalGateway {
    createPayment(
        amountInCents: number,
        currencyCode: string
    ): Promise<ExternalPayment>;
}
```

The adapter implements the target:

```ts
class PaymentGatewayAdapter implements PaymentGateway {
    constructor(
        private readonly gateway: ExternalGateway
    ) {
    }

    async processPayment(
        amount: number,
        currency: string
    ): Promise<PaymentResult> {
        const result = await this.gateway.createPayment(
            Math.round(amount * 100),
            currency
        );

        return {
            transactionId: result.id,
            status: result.state
        };
    }
}
```

TypeScript therefore makes structural compatibility explicit, but it does not eliminate the need for semantic
adaptation.

## Structural Typing

TypeScript's structural type system means that an object does not need to explicitly declare that it implements an
interface.

If the object has the required structure, it can satisfy the type.

This makes many simple JavaScript adapters unnecessary.

For example:

```ts
interface Logger {
    info(message: string): void;
}

const logger = {
    info(message: string) {
        console.log(message);
    }
};
```

`logger` already satisfies `Logger`.

An adapter becomes useful when the structures or semantics actually differ.

```ts
interface Logger {
    info(message: string): void;
}

interface LegacyLogger {
    log(level: string, message: string): void;
}

class LegacyLoggerAdapter implements Logger {
    constructor(
        private readonly logger: LegacyLogger
    ) {
    }

    info(message: string): void {
        this.logger.log("INFO", message);
    }
}
```

Do not introduce an adapter merely because two interfaces have different TypeScript names when their structural
contracts are already compatible and no semantic translation is required.

## Generic Adapter Types

Generic types can express reusable adapter abstractions.

```ts
interface Adapter<Source, Target> {
    adapt(source: Source): Target;
}
```

A concrete adapter can then specialize the transformation:

```ts
interface ExternalUser {
    user_id: string;
    full_name: string;
}

interface User {
    id: string;
    name: string;
}

class UserAdapter implements Adapter<ExternalUser, User> {
    adapt(user: ExternalUser): User {
        return {
            id: user.user_id,
            name: user.full_name
        };
    }
}
```

This form is useful when adaptation is primarily data transformation rather than behavioral delegation.

## Functional Data Adapters

Not every transformation should be elevated into a class.

A simple pure transformation can be represented directly as a function:

```js
function toUser(externalUser) {
    return {
        id: externalUser.user_id,
        name: externalUser.full_name
    };
}
```

Calling this an Adapter can be conceptually valid when it forms an explicit compatibility boundary, but introducing an
`Adapter` class adds little value if the transformation is trivial and has no independent lifecycle, dependencies, or
behavior.

The pattern should describe a meaningful architectural responsibility, not merely every object conversion.

## Testing Adapters

Adapters should be tested primarily as contract translators.

A useful test verifies that a target operation produces the correct adaptee invocation:

```js
test("processPayment translates dollars to cents", async () => {
    const gateway = {
        createPayment: jest.fn().mockResolvedValue({
            id: "txn-1",
            state: "completed"
        })
    };

    const adapter = new PaymentGatewayAdapter(gateway);

    const result = await adapter.processPayment(25.50, "USD");

    expect(gateway.createPayment).toHaveBeenCalledWith(
        2550,
        "USD"
    );

    expect(result).toEqual({
        transactionId: "txn-1",
        status: "completed"
    });
});
```

Tests should cover translation boundaries rather than merely checking that delegation occurred.

Important cases include:

* parameter transformation;
* result transformation;
* error translation;
* missing values;
* boundary values;
* asynchronous behavior;
* provider-specific failures;
* semantic differences;
* idempotency;
* resource ownership.

## Contract Testing

When an adapter implements an application-facing contract, contract tests can verify that each adapter satisfies the
same expected behavior.

For example, multiple payment adapters should all satisfy the same `PaymentGateway` contract.

This prevents provider-specific implementations from silently diverging in behavior.

The goal is not to prove that every provider behaves identically internally. The goal is to prove that each adapter
presents the guarantees promised by the target abstraction.

## Error Handling

Adapters should not automatically swallow or replace every external error.

Bad adaptation:

```js
async function execute() {
    try {
        return await external.execute();
    } catch {
        return null;
    }
}
```

This changes failure semantics without establishing that `null` is a valid representation of failure.

A better adapter explicitly maps errors when the target contract requires a different error model:

```js
async function execute() {
    try {
        return await external.execute();
    } catch (error) {
        throw new ApplicationOperationError(
            "External operation failed",
            {cause: error}
        );
    }
}
```

Error translation should preserve useful diagnostic information while preventing unnecessary leakage of external
implementation details.

## Lifecycle and Resource Ownership

An adapter should make resource ownership explicit.

If the adaptee owns a network connection, file descriptor, database pool, or other resource, the adapter should not
accidentally assume ownership merely because it wraps the object.

For example:

```js
class RepositoryAdapter {
    constructor(client) {
        this.client = client;
    }

    async close() {
        // Should this adapter close client?
    }
}
```

Whether `close()` belongs on the adapter depends on the ownership contract.

If the client was injected from outside, closing it may be incorrect because another component may still use it.

Adapter design therefore needs to distinguish **translation responsibility** from **resource ownership**.

## Stateful Adapters

An adapter may maintain state when necessary.

```js
class SessionAdapter {
    constructor(session) {
        this.session = session;
        this.authenticated = false;
    }

    async authenticate(credentials) {
        await this.session.login(credentials);
        this.authenticated = true;
    }

    isAuthenticated() {
        return this.authenticated;
    }
}
```

However, state should exist because the target contract requires it, not merely because the adapter happens to be a
convenient place to store information.

Unnecessary adapter state increases lifecycle and concurrency complexity.

## Caching Inside an Adapter

An adapter may cache results, but caching is not part of Adapter itself.

```js
class CachedUserAdapter {
    constructor(service) {
        this.service = service;
        this.cache = new Map();
    }

    async getUser(id) {
        if (this.cache.has(id)) {
            return this.cache.get(id);
        }

        const user = await this.service.getUser(id);
        this.cache.set(id, user);

        return user;
    }
}
```

The adapter may simultaneously exhibit Adapter and caching behavior, but caching should be treated as a separate
responsibility.

If the caching logic becomes substantial, composing an adapter with a dedicated caching decorator or cache layer may
produce a cleaner design.

## Adapter Boundaries and Change

One of the strongest reasons to use Adapter is to localize change.

Suppose an application depends on:

```js
paymentGateway.charge(payment);
```

while the external provider exposes:

```js
paymentProvider.createPaymentIntent(options);
```

The provider-specific API is isolated inside the adapter.

If the provider changes from one SDK to another, the application-facing contract can remain unchanged:

```js
class ProviderAAdapter {
    async charge(payment) {
        // Provider A
    }
}

class ProviderBAdapter {
    async charge(payment) {
        // Provider B
    }
}
```

The adapter therefore acts as a **change containment boundary**.

This does not eliminate change. It localizes it.

## Migration and Legacy Systems

Adapter is useful during incremental migration.

An existing system may expose an old interface:

```js
class LegacyCustomerService {
    findCustomerByNumber(number) {
        // ...
    }
}
```

A new application contract may use:

```js
class CustomerService {
    async findById(id) {
        // ...
    }
}
```

An adapter allows new code to consume the old system:

```js
class LegacyCustomerAdapter {
    constructor(service) {
        this.service = service;
    }

    async findById(id) {
        return this.service.findCustomerByNumber(id);
    }
}
```

The old system can then be replaced independently.

This makes Adapter useful for strangler-style migrations, compatibility layers, and phased infrastructure replacement.

## When Adapter Is Appropriate

Adapter is appropriate when:

* an existing component already provides useful functionality;
* its interface differs from the required interface;
* changing the adaptee is undesirable or impossible;
* the incompatibility can be translated reliably;
* the translation belongs at a clear architectural boundary;
* external APIs should be isolated from application-facing contracts;
* legacy components need to coexist with newer abstractions;
* multiple providers need to satisfy one application contract.

The strongest signal is simple: **the client needs one interface, while the existing component provides another
interface for essentially the same capability.**

## When Adapter Is Unnecessary

Do not introduce Adapter when:

* the existing interface is already suitable;
* TypeScript structural typing already provides compatibility;
* the transformation is trivial and has no meaningful boundary responsibility;
* changing the client is simpler and more maintainable;
* the adapter merely forwards every operation without translating anything;
* the abstraction exists only to follow a pattern rather than solve incompatibility.

For example:

```js
class Adapter {
    constructor(service) {
        this.service = service;
    }

    execute(...args) {
        return this.service.execute(...args);
    }
}
```

If there is no interface, data, semantic, or behavioral translation, this is usually unnecessary indirection.

## Common Misuse

### Using Adapter for Simplification

If the purpose is to provide a simpler interface over a complex subsystem, the problem is closer to Facade.

### Using Adapter to Add Behavior

If the existing interface should remain unchanged while logging, caching, authorization, metrics, or other
responsibilities are added, Decorator or Proxy may be more appropriate.

### Using Adapter for Every Transformation

Not every object mapping deserves an Adapter class. Simple pure transformations are often better represented by
functions.

### Hiding Semantic Incompatibility

An adapter cannot magically make incompatible semantics compatible.

If the adaptee cannot satisfy the target contract without violating important guarantees, the abstraction is invalid.

### Excessive Translation

An adapter that performs business workflows, persistence orchestration, retries, caching, authorization, metrics, and
multiple unrelated transformations can become an integration monolith.

Keep the adapter centered on compatibility.

### Leaking the Adaptee

An adapter that exposes the underlying adaptee defeats the purpose of the boundary:

```js
class BadAdapter {
    constructor(service) {
        this.service = service;
    }

    getRawService() {
        return this.service;
    }
}
```

Once clients start using the raw service, the external contract leaks into the application.

## Refactoring Toward Adapter

A common refactoring sequence is:

1. Identify external or legacy APIs that are directly consumed by application code.
2. Define the application-facing contract actually required by the clients.
3. Identify the translation between that contract and the existing API.
4. Implement the adapter at the integration boundary.
5. Replace direct external calls with the target abstraction.
6. Add contract tests for the adapter.
7. Prevent external types and concepts from leaking beyond the boundary.
8. Introduce additional adapters when alternative providers must satisfy the same contract.

The goal is not simply to add a wrapper. The goal is to establish a stable contract and isolate incompatibility behind
it.

## Refactoring Away from Adapter

An adapter should be reconsidered when the incompatibility disappears.

For example, if an external library adopts the application's required API, the adapter may become redundant.

Likewise, if the adapter has accumulated substantial business logic, it may indicate that the boundary has been given
too many responsibilities.

Refactoring may involve:

* removing the adapter;
* moving pure transformations into dedicated mapping functions;
* extracting business logic into application services;
* separating caching or retry behavior;
* introducing a dedicated facade;
* replacing an unstable external abstraction;
* redefining the target contract.

## Architectural Considerations

Adapters are particularly valuable at architectural boundaries because they control dependency leakage.

An application-facing abstraction can remain stable while infrastructure-specific details remain outside the core
application.

For example, the application may depend on:

```js
class UserRepository {
    async findById(id) {
        // ...
    }
}
```

while infrastructure contains:

```js
class PostgreSQLUserRepositoryAdapter {
    constructor(database) {
        this.database = database;
    }

    async findById(id) {
        const result = await this.database.query(
            "SELECT id, name, email FROM users WHERE id = $1",
            [id]
        );

        return result.rows[0] ?? null;
    }
}
```

The application does not need to understand SQL, database drivers, query-result structures, or connection-management
APIs.

This is one reason adapters appear frequently in ports-and-adapters and hexagonal architectures.

## Adapter and Dependency Injection

Dependency injection and Adapter solve different problems but commonly work together.

Dependency injection determines how a dependency is supplied:

```js
class UserService {
    constructor(repository) {
        this.repository = repository;
    }
}
```

Adapter determines how an incompatible implementation satisfies the expected dependency contract:

```js
const repository = new PostgreSQLUserRepositoryAdapter(database);

const service = new UserService(repository);
```

Dependency injection provides the seam. Adapter provides the compatibility translation.

## Adapter and Configuration

Adapters are often selected through configuration:

```js
function createPaymentGateway(config) {
    switch (config.provider) {
        case "stripe":
            return new StripePaymentAdapter(
                createStripeClient(config)
            );

        case "adyen":
            return new AdyenPaymentAdapter(
                createAdyenClient(config)
            );

        default:
            throw new Error(
                `Unsupported payment provider: ${config.provider}`
            );
    }
}
```

The rest of the application receives the same target contract regardless of the selected provider.

The provider-selection logic is not itself Adapter. It is composition or factory logic surrounding the adapters.

## Adapter and Dependency Stability

A stable application-facing contract can protect the system from volatile external APIs.

The external provider can change:

* SDK versions;
* method names;
* authentication mechanisms;
* request structures;
* response structures;
* error models;
* transport mechanisms.

The adapter absorbs changes that can be translated without changing the application's contract.

However, the target abstraction should remain honest. If provider-specific capabilities are fundamental to the
application's requirements, hiding them behind an artificially generic contract can make the abstraction weaker rather
than stronger.

## Adapter Granularity

An adapter can wrap:

* a single function;
* a single object;
* a service;
* an SDK;
* a repository;
* an entire subsystem.

The correct granularity is determined by the compatibility boundary.

A provider-wide adapter can be appropriate when the provider exposes many related operations that need to be translated
consistently.

A small adapter is preferable when only one operation is incompatible.

Avoid creating an adapter hierarchy merely to mirror the hierarchy of the external library.

## Adapter as a Stable Boundary

A useful adapter has a stable target contract and a volatile implementation behind it.

For example:

```js
class UserDirectory {
    async findByEmail(email) {
        // application-facing contract
    }
}
```

The implementation may change:

```js
class LDAPUserDirectoryAdapter {
}

class OktaUserDirectoryAdapter {
}

class AzureUserDirectoryAdapter {
}

class InMemoryUserDirectoryAdapter {
}
```

The stable contract allows the rest of the system to remain independent of those implementations.

This is particularly useful when infrastructure technology is expected to change more frequently than application
semantics.

## Benefits

Adapter provides several important benefits:

* isolates incompatible interfaces;
* allows existing components to be reused;
* protects clients from external API changes;
* localizes data and semantic translation;
* supports legacy-system integration;
* enables provider substitution;
* reduces infrastructure leakage;
* improves testability through stable contracts;
* supports incremental migration;
* works naturally with dependency injection and ports-and-adapters architectures.

## Costs

Adapter also introduces costs:

* additional abstraction;
* additional indirection;
* translation code;
* potential semantic mismatch;
* maintenance of two contracts;
* possible performance overhead;
* additional testing requirements;
* risk of adapters becoming overly complex;
* potential false abstraction if the target contract is poorly designed.

The adapter is worthwhile when the compatibility boundary provides meaningful isolation. It is unnecessary when it
merely wraps an already-compatible API.

## Decision Criteria

Use Adapter when the answer to most of the following is yes:

| Question                                                            | Adapter signal |
|---------------------------------------------------------------------|----------------|
| Does an existing component already provide the required capability? | Yes            |
| Is its interface incompatible with the client's expected interface? | Yes            |
| Can the incompatibility be translated reliably?                     | Yes            |
| Is changing the adaptee undesirable or impossible?                  | Yes            |
| Should the client remain independent of the adaptee?                | Yes            |
| Is there a clear compatibility boundary?                            | Yes            |
| Will the boundary contain meaningful external or legacy coupling?   | Yes            |

If the main problem is instead simplification, additional behavior, access control, independent
abstraction/implementation variation, or algorithm selection, another pattern is likely a better fit.

## Summary

Adapter converts an existing interface into the interface required by a client. Its central responsibility is
**compatibility translation**.

In JavaScript, Adapter is commonly implemented through object composition, functions, higher-order functions, or
classes. The implementation mechanism is secondary; the defining property is that the adapter allows a client to consume
an existing capability through a different contract.

Adapter is especially valuable at integration and architectural boundaries. It can translate method signatures, data
models, asynchronous behavior, errors, units, and other semantic differences while preventing external or legacy APIs
from leaking into the rest of the application.

Adapter should remain distinct from Facade, Decorator, Proxy, Bridge, and Strategy. The decisive question is: **Is the
wrapper primarily translating an existing interface into the interface the client expects?** If so, Adapter is the
appropriate conceptual model.
