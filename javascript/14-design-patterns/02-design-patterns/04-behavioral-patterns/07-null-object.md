# Null Object

## Intent

**Null Object provides an object that represents the absence of a meaningful object while conforming to the same
interface as the object it replaces.**

Instead of repeatedly checking whether an object exists before using it, clients can interact with a Null Object through
the same contract as a real implementation.

The pattern therefore replaces conditional absence handling with an object whose behavior represents "nothing to do,"
"no result," "no-op," or another explicitly defined absence semantics.

The Null Object is not merely a value such as `null`, `undefined`, `false`, or an empty object. Its defining
characteristic is that **it is a valid participant in the same polymorphic contract as the non-null implementation**.

## Problem

A client often needs to work with an object that may or may not exist.

Without a Null Object, the client may repeatedly perform null checks:

```js
if (logger) {
    logger.info("User created");
}

if (logger) {
    logger.error(error);
}
```

As these checks spread throughout the codebase, absence becomes part of every caller's control flow.

The client must know:

* whether the dependency exists;
* how absence should be handled;
* whether the operation should be skipped;
* what default behavior should occur.

A Null Object moves those semantics into an object that satisfies the expected interface:

```js
class NullLogger {
    info() {
    }

    error() {
    }
}
```

The client can then use the dependency without checking for absence:

```js
logger.info("User created");
logger.error(error);
```

The important change is that the caller no longer needs to distinguish between a real logger and the absence of logging.

## Structure

The pattern typically consists of:

* an abstract contract or expected interface;
* one or more concrete implementations;
* a Null Object implementing the same contract;
* clients that depend only on the contract.

```js
class Logger {
    info(message) {
    }

    error(error) {
    }
}

class ConsoleLogger extends Logger {
    info(message) {
        console.log(message);
    }

    error(error) {
        console.error(error);
    }
}

class NullLogger extends Logger {
    info(message) {
    }

    error(error) {
    }
}
```

The client does not need special handling:

```js
class UserService {
    constructor(logger) {
        this.logger = logger;
    }

    createUser(user) {
        this.logger.info(`Creating user ${user.id}`);

        // creation logic

        this.logger.info(`Created user ${user.id}`);
    }
}
```

The application can provide either implementation:

```js
const service = new UserService(
    loggingEnabled
        ? new ConsoleLogger()
        : new NullLogger()
);
```

The decision about whether logging exists is made at the composition boundary rather than repeatedly inside the business
logic.

## The Contract

A Null Object must satisfy the contract expected by its clients.

For example:

```js
class PaymentGateway {
    charge(amount) {
        throw new Error("Not implemented");
    }

    refund(transaction) {
        throw new Error("Not implemented");
    }
}
```

A Null implementation must define meaningful absence behavior for those operations:

```js
class NullPaymentGateway {
    charge(amount) {
        return {
            status: "skipped"
        };
    }

    refund(transaction) {
        return {
            status: "skipped"
        };
    }
}
```

The Null Object should not arbitrarily throw simply because it represents absence. If throwing is the intended semantic
for the absence case, the object may instead be a fail-fast implementation, but that is no longer the typical no-op form
of Null Object.

## No-Op Behavior

The most common Null Object performs no operation.

```js
class NullMetrics {
    increment(name) {
    }

    gauge(name, value) {
    }

    timing(name, duration) {
    }
}
```

The client can always invoke the metrics API:

```js
metrics.increment("requests");
metrics.timing("request.duration", duration);
```

When metrics are disabled, the Null Object absorbs the operations.

This is particularly useful for optional infrastructure such as:

* logging;
* metrics;
* tracing;
* notifications;
* callbacks;
* feature integrations;
* optional plugins;
* event handlers.

## Explicit Absence Semantics

A Null Object should represent a clearly defined absence semantic.

For example, a notification system might use:

```js
class NullNotifier {
    async send(notification) {
    }
}
```

This means:

**The application intentionally has no notification behavior.**

That is different from:

```js
class FailingNotifier {
    async send(notification) {
        throw new Error("Notifier unavailable");
    }
}
```

The latter represents an unavailable or failed dependency rather than intentional absence.

The distinction should remain explicit.

## Null Object Versus `null`

A Null Object is not equivalent to `null`.

With `null`:

```js
const logger = null;

logger.info("message");
```

the operation fails because `null` does not implement the logger contract.

With a Null Object:

```js
const logger = new NullLogger();

logger.info("message");
```

the operation is valid and produces the defined absence behavior.

The pattern therefore replaces **absence as a control-flow condition** with **absence as a polymorphic object**.

## Null Object Versus `undefined`

The same distinction applies to `undefined`.

```js
function send(logger = undefined) {
    if (logger) {
        logger.info("sent");
    }
}
```

A Null Object removes the conditional:

```js
function send(logger = new NullLogger()) {
    logger.info("sent");
}
```

The important benefit is not the default parameter itself. It is that the default value satisfies the same behavioral
contract.

## Default Values

Not every default value is a Null Object.

Consider:

```js
const timeout = options.timeout ?? 5000;
```

`5000` is a default value, not a Null Object.

Likewise:

```js
const items = input.items ?? [];
```

An empty array may represent absence of items, but it is not automatically a Null Object.

A Null Object requires an object that participates in a behavioral abstraction and provides the contractually
appropriate absence behavior.

## Null Collection

Collections require special consideration.

An empty collection can sometimes act similarly to a Null Object because operations such as iteration naturally produce
no results:

```js
for (const item of []) {
    // nothing
}
```

However, an empty collection is not necessarily an instance of the Null Object pattern.

The distinction depends on whether the collection is being used as a normal value representing zero elements or as a
polymorphic implementation of an abstraction whose absence behavior is intentionally encapsulated.

## Null Strategy

A Null Object can sometimes resemble a Strategy whose algorithm performs no meaningful work.

```js
class NullCompressionStrategy {
    compress(data) {
        return data;
    }
}
```

This can be a valid design when "no compression" is itself a legitimate implementation of the strategy abstraction.

However, the conceptual ownership differs.

Strategy is about interchangeable algorithms.

Null Object is about representing absence through a valid implementation.

A Null Strategy can therefore be an application of both concepts.

## Null Handler

A handler abstraction is another common application.

```js
class NullHandler {
    handle(request) {
        return false;
    }
}
```

A system can guarantee that a handler is always present:

```js
class RequestProcessor {
    constructor(handler = new NullHandler()) {
        this.handler = handler;
    }

    process(request) {
        return this.handler.handle(request);
    }
}
```

The return value must have defined semantics. Returning `false`, `undefined`, a result object, or another value should
be a deliberate part of the handler contract.

## Null Callback

Optional callbacks can be represented by a function rather than an object:

```js
const noop = () => {
};
```

For example:

```js
function process(value, onComplete = () => {
}) {
    const result = transform(value);
    onComplete(result);
}
```

This follows the same underlying idea: replace an absent behavior with a callable implementation that does nothing.

Strictly speaking, whether this is called a Null Object depends on whether the function itself is being treated as the
polymorphic object/behavioral contract.

The broader principle is often described as the **Null Object pattern** even when the implementation is a function.

## Null Function

JavaScript makes Null Object particularly easy to implement for function-based APIs.

```js
const noop = () => {
};
```

A dependency can always be called:

```js
const onError = options.onError ?? noop;

onError(error);
```

This eliminates repeated conditional invocation.

For asynchronous contracts:

```js
const noopAsync = async () => {
};
```

The asynchronous contract should be preserved:

```js
await onComplete();
```

A synchronous no-op should not silently replace an API whose callers depend on a Promise.

## Return Values

No-op behavior becomes more complicated when methods return values.

Consider:

```js
class Cache {
    get(key) {
        return undefined;
    }
}
```

The Null implementation must define what absence means.

Possible semantics include:

```js
return undefined;
```

or:

```js
return null;
```

or:

```js
return {
    found: false
};
```

The choice depends on the contract.

The Null Object should not return an arbitrary value merely to avoid errors. Its return value must preserve the semantic
expectations of the abstraction.

## Null Repository

A repository can define an empty implementation:

```js
class NullRepository {
    async findById(id) {
        return null;
    }

    async save(entity) {
    }

    async delete(id) {
    }
}
```

This can be useful for optional persistence or disabled features.

However, silently discarding writes can be dangerous.

A Null Repository should only be used when "persistence is intentionally disabled" is a legitimate and safe application
state.

If persistence is required for correctness, a Null Repository can conceal a serious configuration error.

## Null Logger

Logging is one of the safest and most common applications.

```js
class NullLogger {
    debug(message, metadata) {
    }

    info(message, metadata) {
    }

    warn(message, metadata) {
    }

    error(message, metadata) {
    }
}
```

The application can always depend on a logger:

```js
class Service {
    constructor(logger = new NullLogger()) {
        this.logger = logger;
    }
}
```

This removes logging conditionals from business logic.

## Null Metrics

Metrics have similar semantics:

```js
class NullMetrics {
    increment(name, value = 1) {
    }

    observe(name, value) {
    }

    timing(name, duration) {
    }
}
```

The business code remains independent of whether telemetry is enabled.

This can be especially useful in libraries where requiring a telemetry implementation would impose an unnecessary
dependency on consumers.

## Null Tracer

A tracing abstraction can use a Null implementation:

```js
class NullTracer {
    startSpan(name) {
        return new NullSpan();
    }
}

class NullSpan {
    setAttribute(name, value) {
    }

    addEvent(name, attributes) {
    }

    end() {
    }
}
```

This allows code to maintain the same lifecycle:

```js
const span = tracer.startSpan("operation");

try {
    execute();
} finally {
    span.end();
}
```

The application does not need separate tracing-enabled and tracing-disabled control paths.

## Null Event Sink

An event sink can similarly absorb events:

```js
class NullEventSink {
    publish(event) {
    }
}
```

The client remains simple:

```js
eventSink.publish({
    type: "order.created",
    orderId
});
```

The Null Object represents intentional absence of event publication.

This should not be used when publication is required for correctness.

## Null Notification

Optional notifications are another appropriate use:

```js
class NullNotifier {
    async notify(recipient, message) {
    }
}
```

The application can invoke notifications unconditionally.

The semantic assumption is that notification is optional.

If notification is required to complete the operation, silently discarding it would be incorrect.

## Null Object and Dependency Injection

Null Objects work naturally with dependency injection.

```js
class OrderService {
    constructor({
                    repository,
                    logger = new NullLogger(),
                    metrics = new NullMetrics(),
                    notifier = new NullNotifier()
                }) {
        this.repository = repository;
        this.logger = logger;
        this.metrics = metrics;
        this.notifier = notifier;
    }
}
```

The service always receives valid collaborators.

Composition determines which implementation is used.

This is preferable to making the service responsible for repeatedly deciding whether each dependency exists.

## Composition Root

The Null Object can be selected at the application's composition boundary.

```js
const logger = config.logging
    ? new ConsoleLogger()
    : new NullLogger();

const service = new UserService(logger);
```

The service itself remains unaware of the configuration decision.

This keeps infrastructure configuration outside the business logic.

## Singleton Null Objects

A stateless Null Object can often be shared.

```js
const nullLogger = Object.freeze({
    info() {
    },
    warn() {
    },
    error() {
    }
});
```

Every client can use the same instance:

```js
serviceA.logger = nullLogger;
serviceB.logger = nullLogger;
```

A singleton-like instance is appropriate when the Null Object is immutable and stateless.

There is no requirement that a Null Object be a Singleton pattern.

## Null Object and Singleton

The patterns solve different problems.

Singleton controls instance multiplicity.

Null Object defines behavior for absence.

A Null Object may happen to be implemented as one shared instance:

```js
const NULL_LOGGER = new NullLogger();
```

but sharing the instance is an implementation optimization rather than the defining characteristic of the pattern.

## Statelessness

Null Objects are often naturally stateless.

```js
class NullLogger {
    info() {
    }

    error() {
    }
}
```

Statelessness makes them:

* reusable;
* safe to share;
* easy to test;
* inexpensive to create.

However, a Null Object can maintain state if the abstraction requires it.

The key requirement is that its state must remain consistent with its absence semantics.

## Stateful Null Objects

Consider a metrics abstraction where clients query whether a metric was recorded.

A Null implementation might maintain no actual measurements:

```js
class NullMetrics {
    increment(name) {
    }

    hasMetric(name) {
        return false;
    }
}
```

This is still coherent if `false` means that no metrics are recorded.

The Null implementation should not pretend that work occurred if callers rely on the result for correctness.

## Identity

A Null Object may have meaningful identity, but often does not.

For example:

```js
const NULL_USER = new NullUser();
```

If code uses object identity:

```js
if (user === NULL_USER) {
    // special handling
}
```

the implementation has reintroduced explicit Null Object checks.

This can undermine the purpose of the pattern.

Prefer behavior-based contracts over checking whether the object is the Null Object.

## Null User

A domain model can sometimes use a Null Object for an absent related entity:

```js
class NullUser {
    getName() {
        return "Unknown";
    }

    hasPermission(permission) {
        return false;
    }
}
```

This can simplify presentation or optional relationship handling.

However, domain-level Null Objects require more care than infrastructure no-ops.

An absent user, account, order, or payment may have materially different business semantics from a real entity.

The Null Object must not erase a distinction that the domain needs to preserve.

## Domain Semantics

The pattern is strongest when absence is itself a valid domain or application state.

For example:

```js
class NoDiscount {
    calculate(total) {
        return total;
    }
}
```

Here "no discount" can legitimately be modeled as an implementation of the discount policy.

But if the difference between "no discount" and "discount calculation failed" matters, those cases should not be
collapsed into the same Null Object.

## Error Handling

A Null Object should not silently suppress errors that represent invalid system state.

Consider:

```js
class NullPaymentProcessor {
    async charge(amount) {
    }
}
```

If payment is mandatory, this is dangerous.

The caller may believe the payment succeeded because no exception occurred.

In such a system, a fail-fast implementation may be more appropriate:

```js
class MissingPaymentProcessor {
    async charge(amount) {
        throw new Error("Payment processor is not configured");
    }
}
```

The distinction is fundamental:

* Null Object represents legitimate absence.
* Fail-fast implementation represents invalid configuration or unavailable required behavior.

## Null Object Versus Optional/Maybe

Optional or Maybe abstractions explicitly represent the possibility that a value is absent.

For example:

```js
const user = findUser(id);

if (user.isSome()) {
    // use user
}
```

A Null Object instead provides an implementation that can be used directly:

```js
const user = findUserOrNullObject(id);

user.getName();
```

Optional/Maybe makes absence explicit in the type or value.

Null Object makes absence polymorphic.

Neither is universally better.

Optional is generally preferable when callers need to distinguish presence from absence.

Null Object is useful when absence should have stable default behavior and callers should not need to branch.

## Null Object Versus Optional Chaining

Optional chaining:

```js
logger?.info("message");
```

is a language-level mechanism for conditionally accessing a potentially absent value.

A Null Object:

```js
logger.info("message");
```

provides a valid collaborator regardless of whether logging is enabled.

Optional chaining preserves absence as a condition.

Null Object removes that condition from the client.

## Null Object Versus Nullish Coalescing

Nullish coalescing can select a Null Object:

```js
const logger = providedLogger ?? new NullLogger();
```

The `??` operator itself is not the pattern.

It is merely a mechanism for selecting the Null implementation.

The resulting object is a Null Object only if it implements the expected behavioral contract and defines the intended
absence semantics.

## Null Object Versus Empty Object

This is not sufficient:

```js
const nullLogger = {};
```

A client expecting:

```js
logger.info("message");
```

will fail because the method does not exist.

The Null Object must satisfy the required interface:

```js
const nullLogger = {
    info() {
    },
    error() {
    }
};
```

Structural compatibility matters more than class inheritance.

## Structural Typing in TypeScript

TypeScript makes structural Null Objects straightforward.

```ts
interface Logger {
    info(message: string): void;

    error(error: unknown): void;
}

const nullLogger: Logger = {
    info() {
    },
    error() {
    }
};
```

No explicit inheritance is required.

The object is a valid Null Object because it satisfies the `Logger` contract.

## TypeScript Classes

A class can provide the same behavior:

```ts
interface Notifier {
    notify(message: string): Promise<void>;
}

class NullNotifier implements Notifier {
    async notify(message: string): Promise<void> {
    }
}
```

The interface makes the substitution explicit.

## Generic Null Objects

Some abstractions can provide reusable generic no-op implementations.

```ts
interface Consumer<T> {
    consume(value: T): void;
}

class NullConsumer<T> implements Consumer<T> {
    consume(value: T): void {
    }
}
```

The Null implementation can now satisfy different instantiations:

```ts
const consumer: Consumer<string> = new NullConsumer<string>();
```

Generics preserve the contract while allowing the implementation to remain behaviorally empty.

## Async Contracts

A Null Object must preserve asynchronous contracts.

If the interface is:

```ts
interface Repository {
    save(entity: Entity): Promise<void>;
}
```

the Null implementation should return a Promise:

```ts
class NullRepository implements Repository {
    async save(entity: Entity): Promise<void> {
    }
}
```

This allows:

```ts
await repository.save(entity);
```

to work consistently.

Returning `undefined` instead would violate the behavioral contract even if the method performs no work.

## Iteration

A Null Object can represent an empty source of values by implementing iteration:

```js
const nullCollection = {
    * [Symbol.iterator]() {
    }
};
```

The client can safely iterate:

```js
for (const item of nullCollection) {
    process(item);
}
```

This can be useful when the absence of a collection should behave as an empty iterable.

However, an ordinary empty array may be simpler when no separate abstraction is needed.

## Null Object and Iterator

An empty iterable and a Null Object can overlap.

Iterator concerns traversal.

Null Object concerns representing absence through a valid contract.

A Null Object may implement an iterator contract by producing no values, but the iterator behavior itself does not make
an object a Null Object.

## Null Object and Composite

A Null Object can also participate in a Composite hierarchy if the domain defines an empty component.

For example:

```js
class NullNode {
    evaluate() {
        return 0;
    }
}
```

Whether this is appropriate depends on whether "empty node" is a meaningful component of the model.

Composite concerns recursive part-whole structure.

Null Object concerns substitution for absence.

The concepts can therefore coexist.

## Testing

Null Objects simplify tests by eliminating optional infrastructure.

```js
const service = new UserService({
    repository,
    logger: new NullLogger()
});
```

Tests do not need to configure logging merely because the service expects a logger.

Null Objects can also make interaction tests explicit:

```js
const logger = {
    info: jest.fn(),
    error: jest.fn()
};
```

A test double is not necessarily a Null Object.

A mock records interactions.

A Null Object intentionally provides absence behavior.

## Null Object Versus Test Doubles

Test doubles such as mocks, stubs, spies, and fakes exist primarily for testing.

A Null Object exists primarily as a production design abstraction.

A test can use a Null Object, but the concepts should not be conflated.

For example:

```js
const nullLogger = new NullLogger();
```

is a Null Object.

```js
const logger = {
    info: jest.fn()
};
```

is a test double.

## Refactoring Toward Null Object

A system is a candidate for Null Object when the same optional dependency is repeatedly checked.

For example:

```js
if (logger) {
    logger.info(message);
}

if (logger) {
    logger.error(error);
}

if (logger) {
    logger.debug(details);
}
```

A refactoring can introduce:

```js
class NullLogger {
    info() {
    }

    error() {
    }

    debug() {
    }
}
```

and normalize the dependency at construction:

```js
this.logger = logger ?? new NullLogger();
```

The rest of the class can then use the contract directly.

## Refactoring Repeated Conditional Behavior

The same approach applies to optional callbacks:

```js
if (onSuccess) {
    onSuccess(result);
}

if (onFailure) {
    onFailure(error);
}
```

These can become:

```js
const onSuccess = providedOnSuccess ?? (() => {
});
const onFailure = providedOnFailure ?? (() => {
});
```

The conditional behavior is replaced by a valid implementation.

For object-based contracts, an explicit Null Object is often clearer and more maintainable.

## Conditional Explosion

Null Object is particularly useful when absence checks are repeated across many operations.

Before:

```js
if (cache) {
    cache.get(key);
}

if (cache) {
    cache.set(key, value);
}

if (cache) {
    cache.invalidate(key);
}
```

After:

```js
cache.get(key);
cache.set(key, value);
cache.invalidate(key);
```

with:

```js
class NullCache {
    get(key) {
        return undefined;
    }

    set(key, value) {
    }

    invalidate(key) {
    }
}
```

The absence semantics are centralized.

## Common Misuse

The most dangerous misuse is using a Null Object to hide a required dependency.

For example:

```js
class NullDatabase {
    async save(entity) {
    }
}
```

If saving is mandatory, silently ignoring the operation can create data loss.

The Null Object should only be used where doing nothing is semantically valid.

Another misuse is creating Null Objects for every nullable value even when an explicit optional representation would be
clearer.

The pattern is a design technique, not a rule that every `null` should be eliminated.

## Hidden Failure

A Null Object can make failures harder to detect.

Consider:

```js
class NullEmailSender {
    async send(message) {
    }
}
```

If production accidentally receives this implementation, email silently disappears.

For optional notifications, that may be correct.

For mandatory notifications, it may be a serious operational failure.

Configuration should therefore make the distinction between optional and required dependencies explicit.

## Observability

A Null Object can make optional observability infrastructure disappear from the execution path.

This is useful when observability is genuinely optional:

```js
const metrics =
    config.metricsEnabled
        ? new MetricsClient()
        : new NullMetrics();
```

However, critical operational telemetry should not necessarily be modeled as optional.

If losing telemetry would make a system unsafe or unmanageable, silently replacing it with a Null Object may be
inappropriate.

## Performance

Null Objects can improve performance by avoiding repeated conditional branches and by eliminating unnecessary
infrastructure calls.

For example:

```js
class NullLogger {
    debug() {
    }
}
```

is cheaper than constructing and invoking a full logging pipeline when debugging is disabled.

However, the performance benefit is usually secondary.

The primary benefit is simplifying the client contract and removing repeated absence handling.

## Allocation

Stateless Null Objects can be shared:

```js
const NULL_LOGGER = Object.freeze({
    info() {
    },
    error() {
    }
});
```

This avoids repeated allocations.

For classes:

```js
const NULL_LOGGER = new NullLogger();
```

can be reused safely if the class has no mutable state.

There is no need to introduce Singleton machinery solely for this optimization.

## Thread Safety and Concurrency

A shared Null Object should be immutable or stateless if it can be accessed concurrently.

```js
const NULL_LOGGER = Object.freeze({
    info() {
    },
    error() {
    }
});
```

This makes sharing straightforward.

A stateful Null Object requires the same concurrency considerations as any other shared object.

## Architecture

Null Objects are particularly useful at dependency boundaries where a capability is optional.

Examples include:

* telemetry;
* logging;
* notification;
* optional caching;
* plugin hooks;
* event sinks;
* optional integrations;
* feature-specific services.

They allow application components to depend on stable contracts while the composition layer decides whether a real
capability is enabled.

## Dependency Inversion

Null Objects work well with dependency inversion.

A service depends on an abstraction:

```js
class OrderService {
    constructor(notifier) {
        this.notifier = notifier;
    }
}
```

The composition layer supplies either:

```js
new EmailNotifier()
```

or:

```js
new NullNotifier()
```

The service does not depend on infrastructure configuration.

This preserves the dependency direction while providing a valid implementation for optional behavior.

## Benefits

Null Object provides several important benefits:

1. It eliminates repetitive null checks.
2. It converts absence into a polymorphic behavior.
3. It simplifies client code.
4. It centralizes absence semantics.
5. It allows optional dependencies to satisfy stable contracts.
6. It can improve testability and dependency injection.
7. It allows stateless implementations to be safely shared.
8. It reduces branching caused solely by optional capabilities.

## Costs

Null Object also introduces costs:

1. Silent no-op behavior can hide configuration errors.
2. Every operation needs meaningful absence semantics.
3. The implementation can become misleading when absence is not actually valid.
4. Domain-level Null Objects can accidentally collapse important business distinctions.
5. Return values can become ambiguous if the contract does not define absence clearly.
6. A large abstraction may require a large Null implementation.
7. Debugging can become harder when operations intentionally disappear.

The central trade-off is between **explicit absence handling in clients** and **encapsulated absence behavior in an
implementation**.

## Decision Criteria

Null Object is appropriate when:

1. A dependency is genuinely optional.
2. Absence has predictable and valid semantics.
3. Clients repeatedly branch on the dependency's existence.
4. The absence behavior can satisfy the same contract as the real implementation.
5. Silent or neutral behavior is safe.
6. The application benefits from treating the dependency as always available.

Do not use Null Object when absence must remain visible to the caller, when absence represents an error, or when
silently discarding operations could violate correctness.

## Summary

Null Object represents the absence of a meaningful implementation through an object that satisfies the same behavioral
contract as the real implementation.

Instead of requiring clients to repeatedly check for `null` or `undefined`, the system supplies a Null Object whose
behavior represents the appropriate absence semantics. The most common implementation is a no-op, but a Null Object can
also return empty results, neutral values, or other explicitly defined absence behavior.

Null Object is distinct from Optional or Maybe because those abstractions make absence explicit, while Null Object makes
absence polymorphic. It is distinct from optional chaining and nullish coalescing because those are language mechanisms
for handling missing values rather than behavioral abstractions. It is distinct from a default value because a Null
Object must satisfy a behavioral contract. It is distinct from Singleton because instance multiplicity is unrelated to
the pattern's intent.

The pattern is especially effective for optional infrastructure such as logging, metrics, tracing, notifications,
callbacks, and plugins. It becomes dangerous when used to hide required dependencies or failures.

The defining principle is **make a legitimate absence behave as a valid implementation of the expected contract, so
clients do not need to encode absence as repeated control flow**.
