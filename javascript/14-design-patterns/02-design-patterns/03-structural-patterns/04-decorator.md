# Decorator

The Decorator pattern attaches additional responsibilities to an object dynamically by wrapping it with another object
that implements the same interface. Each decorator forwards the underlying operation while adding behavior before,
after, or around that operation. Multiple decorators can be composed to accumulate independent responsibilities without
modifying the original object or creating a separate subclass for every combination of behavior.

Decorator is fundamentally about **behavioral composition through same-contract wrapping**. The wrapped object and the
decorator are interchangeable from the client's perspective, while the decorator gains an opportunity to augment the
behavior of the wrapped object.

## Intent

Decorator lets you add responsibilities to an individual object without changing its class. Additional behavior is
represented by wrapper objects that implement the same contract as the object they decorate.

The central idea is **extend an object's behavior by wrapping it rather than modifying its implementation or creating a
specialized subclass**.

A decorator therefore has two essential properties:

* it implements the same client-facing contract as the object it decorates;
* it contains another object conforming to that same contract.

The decorator can then delegate to the wrapped object and introduce additional behavior around the delegation.

## Problem

A system often needs to add optional or combinable responsibilities to an existing object.

Suppose a component provides a basic operation:

```js
class MessageSender {
    send(message) {
        console.log(`Sending: ${message}`);
    }
}
```

Different deployments might require combinations of logging, metrics, retries, authorization, caching, tracing,
validation, or other cross-cutting behavior.

A subclass-based solution quickly becomes difficult to manage:

```js
class LoggingMessageSender extends MessageSender {
}

class RetryingMessageSender extends MessageSender {
}

class LoggingRetryingMessageSender extends MessageSender {
}

class AuthorizedLoggingMessageSender extends MessageSender {
}

class AuthorizedRetryingMessageSender extends MessageSender {
}

class AuthorizedLoggingRetryingMessageSender extends MessageSender {
}
```

The problem is not merely the number of classes. Each responsibility becomes coupled to every combination of the other
responsibilities.

Inheritance represents behavior combinations statically. Decorator represents them compositionally.

```js
class LoggingSender {
    constructor(sender) {
        this.sender = sender;
    }

    send(message) {
        console.log("Sending message");
        return this.sender.send(message);
    }
}

class RetryingSender {
    constructor(sender) {
        this.sender = sender;
    }

    send(message) {
        for (let attempt = 1; attempt <= 3; attempt++) {
            try {
                return this.sender.send(message);
            } catch (error) {
                if (attempt === 3) {
                    throw error;
                }
            }
        }
    }
}
```

The same base object can now be composed differently:

```js
const sender = new MessageSender();

const decoratedSender =
    new LoggingSender(
        new RetryingSender(sender)
    );

decoratedSender.send("hello");
```

The behavior is selected at composition time rather than encoded into a class hierarchy.

## Structure

The pattern consists of a common component contract, concrete components that provide the original behavior, and
decorators that implement the same contract while containing another component.

The **Component** defines the operations that clients use.

The **Concrete Component** provides the original behavior that needs additional responsibilities.

The **Decorator** implements the Component contract and maintains a reference to another Component. It normally
delegates operations to that wrapped component.

The **Concrete Decorators** add specific responsibilities around the delegated operation.

The essential relationship is that a decorator is itself a component and therefore can be wrapped by another decorator.
This recursive composability is what allows multiple independent responsibilities to be combined.

## Component Contract

The decorator and the object being decorated must expose a compatible contract.

A simple JavaScript implementation can rely on convention:

```js
class DataSource {
    write(data) {
        throw new Error("Not implemented");
    }

    read() {
        throw new Error("Not implemented");
    }
}
```

The concrete component provides the core behavior:

```js
class FileDataSource extends DataSource {
    write(data) {
        console.log("Writing data to file");
    }

    read() {
        console.log("Reading data from file");
        return "data";
    }
}
```

A decorator can implement the same operations:

```js
class DataSourceDecorator extends DataSource {
    constructor(source) {
        super();
        this.source = source;
    }

    write(data) {
        return this.source.write(data);
    }

    read() {
        return this.source.read();
    }
}
```

Concrete decorators can then specialize individual responsibilities:

```js
class CompressionDecorator extends DataSourceDecorator {
    write(data) {
        const compressed = this.compress(data);
        return this.source.write(compressed);
    }

    read() {
        const data = this.source.read();
        return this.decompress(data);
    }

    compress(data) {
        return `compressed(${data})`;
    }

    decompress(data) {
        return `decompressed(${data})`;
    }
}
```

Another decorator can add encryption independently:

```js
class EncryptionDecorator extends DataSourceDecorator {
    write(data) {
        const encrypted = this.encrypt(data);
        return this.source.write(encrypted);
    }

    read() {
        const data = this.source.read();
        return this.decrypt(data);
    }

    encrypt(data) {
        return `encrypted(${data})`;
    }

    decrypt(data) {
        return `decrypted(${data})`;
    }
}
```

The resulting composition can contain either responsibility independently or both:

```js
const source =
    new EncryptionDecorator(
        new CompressionDecorator(
            new FileDataSource()
        )
    );

source.write("hello");
```

The order of decorators is significant whenever responsibilities interact.

## Wrapping and Delegation

Delegation is the fundamental mechanism behind Decorator.

A decorator receives an operation from the client, performs its additional responsibility, delegates to the wrapped
component, and may perform additional work after delegation.

The general behavior can be represented directly in code:

```js
class Decorator {
    constructor(component) {
        this.component = component;
    }

    operation() {
        this.before();
        const result = this.component.operation();
        this.after(result);
        return result;
    }

    before() {
    }

    after(result) {
    }
}
```

This makes decorators particularly useful when the additional responsibility naturally surrounds an existing operation.

A decorator does not have to execute code exclusively before or after delegation. It can transform arguments, transform
results, conditionally delegate, handle errors, retry operations, measure execution, or alter control flow.

For example:

```js
class TimingDecorator {
    constructor(service) {
        this.service = service;
    }

    execute(input) {
        const start = performance.now();

        try {
            return this.service.execute(input);
        } finally {
            const duration = performance.now() - start;
            console.log(`Execution took ${duration}ms`);
        }
    }
}
```

The wrapped object remains responsible for its original operation. The decorator adds the timing responsibility.

## Dynamic Composition

One of Decorator's primary advantages is that responsibilities can be selected dynamically.

```js
let service = new Service();

if (config.logging) {
    service = new LoggingDecorator(service);
}

if (config.metrics) {
    service = new MetricsDecorator(service);
}

if (config.caching) {
    service = new CachingDecorator(service);
}
```

The resulting object still satisfies the same client-facing contract.

This makes Decorator useful when behavior is determined by configuration, environment, runtime conditions, feature
flags, dependency injection, or application composition.

The important property is not that the wrapping literally happens at runtime. A statically constructed decorator chain
is still a Decorator. The defining characteristic is behavioral composition through same-contract wrappers.

## Multiple Decorators

Decorators can be stacked because every decorator remains a valid component.

```js
const service =
    new AuthorizationDecorator(
        new LoggingDecorator(
            new MetricsDecorator(
                new CachingDecorator(
                    new Service()
                )
            )
        )
    );
```

This creates a pipeline of responsibilities.

Each layer can remain focused on one concern:

```js
class LoggingDecorator {
    constructor(service) {
        this.service = service;
    }

    execute(input) {
        console.log("Executing service", input);
        const result = this.service.execute(input);
        console.log("Execution completed");
        return result;
    }
}
```

The individual decorators do not need to know which other decorators surround them.

This provides a form of local extensibility: adding a new responsibility generally requires creating a new decorator
rather than modifying existing decorators or the concrete component.

## Order of Composition

Decorator order is part of the behavior whenever decorators are not commutative.

Consider:

```js
new LoggingDecorator(
    new AuthorizationDecorator(
        service
    )
);
```

versus:

```js
new AuthorizationDecorator(
    new LoggingDecorator(
        service
    )
);
```

These compositions can have different semantics.

In the first case, logging surrounds authorization. In the second case, logging may occur only after authorization has
delegated, depending on the implementation.

The same issue occurs with caching, retries, transactions, validation, compression, encryption, tracing, metrics, and
error handling.

For example, a retry decorator around a transaction decorator is not necessarily equivalent to a transaction decorator
around a retry decorator.

Decorator composition therefore requires an explicit understanding of the ordering semantics.

## Transparent and Non-Transparent Decorators

A decorator is most useful when it preserves the contract expected by clients.

A **transparent decorator** exposes the same externally visible contract as the wrapped component. Clients can use the
decorated object without knowing which decorators are present.

```js
class LoggingDecorator {
    constructor(component) {
        this.component = component;
    }

    execute(input) {
        console.log(input);
        return this.component.execute(input);
    }
}
```

A decorator becomes less transparent when it introduces additional public operations that clients need to know about:

```js
class SpecialDecorator {
    constructor(component) {
        this.component = component;
    }

    execute(input) {
        return this.component.execute(input);
    }

    specialOperation() {
        // Additional decorator-specific API
    }
}
```

This can still be valid, but it weakens substitutability and makes the abstraction increasingly dependent on knowledge
of the decorator.

A strong Decorator design normally keeps the component contract stable.

## Decorator in JavaScript

JavaScript's dynamic object model makes Decorator straightforward to implement without inheritance.

A function can be decorated directly:

```js
function withLogging(fn) {
    return function (...args) {
        console.log("Calling function");
        const result = fn(...args);
        console.log("Function completed");
        return result;
    };
}
```

Composition then becomes:

```js
const decorated = withLogging(
    withMetrics(
        withCaching(fetchData)
    )
);
```

This is structurally equivalent to object decorators. The function returned by each decorator preserves the callable
contract while adding behavior.

Higher-order functions are therefore a natural JavaScript representation of Decorator when the component contract is a
function.

## Preserving Function Metadata

Function decorators introduce a practical issue: wrapping a function creates a new function object.

```js
function withLogging(fn) {
    return (...args) => {
        console.log("Calling");
        return fn(...args);
    };
}
```

The wrapper does not automatically preserve custom properties, names, metadata, or other properties attached to the
original function.

If such metadata matters to the application, the decorator must explicitly preserve or reproduce it.

The important distinction is that preserving the observable contract does not necessarily mean preserving object
identity or every implementation detail.

## Asynchronous Decorators

Decorators work naturally with asynchronous operations.

```js
function withRetry(fn, attempts = 3) {
    return async function (...args) {
        let lastError;

        for (let attempt = 1; attempt <= attempts; attempt++) {
            try {
                return await fn(...args);
            } catch (error) {
                lastError = error;
            }
        }

        throw lastError;
    };
}
```

Another decorator can add logging:

```js
function withLogging(fn) {
    return async function (...args) {
        console.log("Starting operation");

        try {
            const result = await fn(...args);
            console.log("Operation succeeded");
            return result;
        } catch (error) {
            console.error("Operation failed", error);
            throw error;
        }
    };
}
```

The decorator must preserve the asynchronous contract. A synchronous wrapper around an asynchronous function must not
accidentally hide or mishandle the returned Promise.

## Error Handling

Decorators can observe, transform, suppress, retry, or propagate errors.

```js
class ErrorLoggingDecorator {
    constructor(service) {
        this.service = service;
    }

    execute(input) {
        try {
            return this.service.execute(input);
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}
```

The decision to rethrow or transform the error is part of the decorator's responsibility.

A decorator should not silently change error semantics merely as an incidental consequence of wrapping. If the
component's contract promises particular error types or failure behavior, the decorator should preserve those guarantees
unless changing them is explicitly its purpose.

## State in Decorators

Decorators can maintain state independently of the wrapped component.

A caching decorator is a typical example:

```js
class CachingDecorator {
    constructor(service) {
        this.service = service;
        this.cache = new Map();
    }

    execute(key) {
        if (this.cache.has(key)) {
            return this.cache.get(key);
        }

        const result = this.service.execute(key);
        this.cache.set(key, result);

        return result;
    }
}
```

The cache is a responsibility introduced by the decorator rather than by the underlying service.

However, stateful decorators introduce lifecycle and consistency concerns. Cache invalidation, synchronization, memory
growth, expiration, concurrency, and ownership must be defined explicitly.

A decorator is not automatically stateless merely because its purpose is behavioral composition.

## Decorator and Object Identity

Decorating an object creates a new object identity.

```js
const original = new Service();
const decorated = new LoggingDecorator(original);

console.log(original === decorated); // false
```

This matters when identity is observable.

A system that uses object identity for registration, equality, caching, synchronization, lifecycle management, or event
subscription must account for the additional wrapper.

A decorator should not be introduced casually around identity-sensitive objects without considering whether callers
expect the original object itself.

## TypeScript

TypeScript makes the component contract explicit.

```ts
interface DataSource {
    write(data: string): void;

    read(): string;
}
```

The concrete component implements the interface:

```ts
class FileDataSource implements DataSource {
    write(data: string): void {
        console.log(`Writing ${data}`);
    }

    read(): string {
        return "data";
    }
}
```

The decorator implements the same interface:

```ts
abstract class DataSourceDecorator implements DataSource {
    constructor(
        protected readonly source: DataSource
    ) {
    }

    write(data: string): void {
        this.source.write(data);
    }

    read(): string {
        return this.source.read();
    }
}
```

Concrete decorators can now safely wrap any `DataSource`:

```ts
class CompressionDecorator extends DataSourceDecorator {
    override write(data: string): void {
        this.source.write(this.compress(data));
    }

    override read(): string {
        return this.decompress(this.source.read());
    }

    private compress(data: string): string {
        return `compressed(${data})`;
    }

    private decompress(data: string): string {
        return `decompressed(${data})`;
    }
}
```

The type system makes the recursive nature of the pattern explicit: a decorator accepts the same interface that it
implements.

## Generic Decorators

Generic component contracts allow decorators to preserve input and output types.

```ts
interface Handler<TInput, TOutput> {
    handle(input: TInput): TOutput;
}
```

A logging decorator can preserve those types:

```ts
class LoggingHandler<TInput, TOutput>
    implements Handler<TInput, TOutput> {

    constructor(
        private readonly handler: Handler<TInput, TOutput>
    ) {
    }

    handle(input: TInput): TOutput {
        console.log("Handling", input);
        const result = this.handler.handle(input);
        console.log("Result", result);
        return result;
    }
}
```

This is preferable to weakening the decorator to `any`, because the decorator remains substitutable for the wrapped
handler.

The same principle applies to asynchronous contracts:

```ts
interface AsyncHandler<TInput, TOutput> {
    handle(input: TInput): Promise<TOutput>;
}
```

Decorators should preserve the generic contract rather than erasing its type information.

## Decorator and Inheritance

Inheritance and Decorator solve related but different extensibility problems.

Inheritance extends a class by defining a new subtype:

```js
class LoggingService extends Service {
    execute(input) {
        console.log(input);
        return super.execute(input);
    }
}
```

Decorator extends an individual object through composition:

```js
const service = new LoggingDecorator(
    new Service()
);
```

Inheritance determines the extension at the type/class level. Decorator determines it at the object/composition level.

Inheritance also makes behavior part of the subclass hierarchy. Decorator keeps responsibilities as separate composable
objects.

Decorator is particularly valuable when multiple independent responsibilities must be combined in different
configurations.

## Decorator and Adapter

Adapter and Decorator both wrap objects, but their purposes are fundamentally different.

**Adapter changes an interface so that an existing object can be used where another interface is expected.**

**Decorator preserves the interface so that additional behavior can be attached to the object.**

An adapter primarily solves compatibility:

```js
const expectedComponent = new Adapter(incompatibleComponent);
```

A decorator primarily solves behavioral extension:

```js
const enhancedComponent = new Decorator(existingComponent);
```

If the primary reason for wrapping is to make incompatible contracts compatible, the pattern is Adapter rather than
Decorator.

If the contract is already suitable and the purpose is to add responsibilities, Decorator is the appropriate
abstraction.

## Decorator and Proxy

Proxy and Decorator are structurally similar because both can place a wrapper between a client and an underlying object.

Their intent differs.

A **Proxy controls access to an object**. It can provide lazy initialization, access control, remote access,
virtualization, or lifecycle control.

A **Decorator adds responsibilities to an object** while preserving its interface.

The distinction is based on the reason for the wrapper rather than the mechanics of delegation.

Caching can illustrate the ambiguity. A caching wrapper may be described as a Decorator when caching is an additional
responsibility intentionally composed with an object. It may be described as a Proxy when the central purpose is
controlling access to the underlying object. The implementation alone does not determine the pattern; the design intent
does.

## Decorator and Bridge

Bridge separates an abstraction from its implementation so that two dimensions can vary independently.

Decorator does not establish two independent abstraction dimensions. It wraps an existing component to add
responsibilities.

Bridge therefore addresses structural variation between two independently changing concepts, while Decorator addresses
incremental behavioral extension of an existing object.

A system may use both patterns, but they solve different problems.

## Decorator and Composite

Composite represents part-whole structures in which individual objects and compositions share a common component
contract.

Decorator also contains another object implementing the same contract, but its semantics are fundamentally different.

A Composite represents **a collection or hierarchy of components**.

A Decorator represents **one component augmented by another layer of behavior**.

A composite typically delegates operations across multiple children. A decorator normally delegates to exactly one
wrapped component.

A tree node containing multiple children is therefore not a decorator merely because it implements the same interface.

## Decorator and Chain of Responsibility

Decorator and Chain of Responsibility can produce similar-looking wrapper structures, especially when requests pass
through several objects.

Their control semantics differ.

Decorator normally represents a known composition of responsibilities. Each layer contributes behavior to the same
logical operation.

Chain of Responsibility represents a sequence of handlers in which responsibility for handling a request may move from
one handler to another.

A decorator generally delegates as part of its behavior. A chain handler may choose not to delegate because it has
handled the request.

## Decorator and Strategy

Strategy encapsulates an interchangeable algorithm or policy.

Decorator retains the underlying operation and adds responsibility around it.

For example:

```js
const service = new Service(new RetryPolicy());
```

can represent Strategy when the service uses the supplied object as an algorithm or policy.

By contrast:

```js
const service = new RetryDecorator(
    new Service()
);
```

represents Decorator when retry behavior is attached around the existing service contract.

The distinction is whether the supplied object represents an alternative algorithm or an additional layer of behavior.

## Cross-Cutting Concerns

Decorator is particularly effective for responsibilities that cut across multiple operations or components.

Common examples include:

* logging;
* metrics;
* tracing;
* caching;
* authorization;
* validation;
* retries;
* rate limiting;
* transactions;
* auditing;
* compression;
* encryption;
* serialization;
* error translation;
* performance measurement.

A decorator can isolate such behavior from the primary implementation.

This can improve cohesion because the underlying component focuses on its core responsibility while decorators handle
orthogonal concerns.

However, excessive decorator composition can make execution behavior difficult to discover. The chain of
responsibilities must remain visible and understandable to developers.

## Middleware as Decorator-Like Composition

Middleware pipelines often resemble Decorator because one function wraps another.

For example:

```js
const withLogging = handler => async (request) => {
    console.log(request);
    return handler(request);
};

const withAuth = handler => async (request) => {
    authenticate(request);
    return handler(request);
};
```

Composition produces nested behavior:

```js
const handler =
    withLogging(
        withAuth(
            baseHandler
        )
    );
```

This is structurally decorator-like because each wrapper preserves the handler contract and adds behavior.

However, middleware systems frequently have additional semantics such as explicit continuation, branching,
short-circuiting, request context, response mutation, or framework-managed lifecycle. Calling every middleware pipeline
a literal GoF Decorator is therefore unnecessarily restrictive.

The Decorator pattern is the underlying structural idea when same-contract wrappers are used to add responsibilities.

## Dependency Injection

Decorator works naturally with dependency injection because a decorated implementation can still satisfy the same
dependency contract.

Suppose a service depends on an interface:

```ts
interface UserRepository {
    findById(id: string): Promise<User>;
}
```

The application can construct:

```ts
const repository =
    new CachingRepository(
        new LoggingRepository(
            new DatabaseUserRepository()
        )
    );
```

Consumers depend only on `UserRepository`.

This allows the composition root to determine which responsibilities are active without changing application code.

Decorator therefore works particularly well when the architecture has explicit composition roots and dependency
inversion.

## Factories and Decorator Composition

When decorator chains become large, constructing them manually can become repetitive.

A factory can centralize composition:

```js
function createService(config) {
    let service = new Service();

    if (config.cache) {
        service = new CachingDecorator(service);
    }

    if (config.logging) {
        service = new LoggingDecorator(service);
    }

    if (config.retry) {
        service = new RetryDecorator(service);
    }

    return service;
}
```

The factory does not replace the Decorator pattern. It manages the construction of the decorator composition.

Keeping construction separate from behavior is particularly useful when the set of decorators depends on deployment
configuration.

## Refactoring Toward Decorator

A common signal for introducing Decorator is a growing class hierarchy where subclasses represent combinations of
optional responsibilities.

For example:

```js
class LoggedService extends Service {
}

class CachedService extends Service {
}

class LoggedCachedService extends Service {
}

class RetryingLoggedCachedService extends Service {
}
```

The hierarchy can often be refactored by extracting each independent responsibility into a wrapper:

```js
const service =
    new RetryDecorator(
        new LoggingDecorator(
            new CachingDecorator(
                new Service()
            )
        )
    );
```

This refactoring is appropriate when the responsibilities are independently meaningful and composable.

It is not appropriate merely because a class is large. If the behaviors are intrinsically coupled or depend on a shared
internal state model, separating them into decorators may create more complexity rather than reducing it.

## Granularity

Decorators should represent meaningful responsibilities.

A useful decorator might represent:

* request authorization;
* transaction management;
* caching;
* tracing;
* retry policy;
* audit logging.

A decorator that exists solely to add one trivial line of code may not justify a separate abstraction.

Overly fine-grained decorators create long and difficult-to-read composition chains.

Overly coarse decorators can recreate the coupling that Decorator was intended to remove.

The appropriate granularity is the level at which a responsibility can be independently understood, tested, enabled,
disabled, and composed.

## Stateful Decorator Chains

Multiple stateful decorators can interact in non-obvious ways.

Consider:

```js
new CachingDecorator(
    new RetryDecorator(
        new Service()
    )
);
```

and:

```js
new RetryDecorator(
    new CachingDecorator(
        new Service()
    )
);
```

These are not necessarily equivalent.

In the first composition, a cache hit can prevent the retry decorator from executing at all.

In the second composition, the retry behavior surrounds the cache operation.

Similar interactions exist with transactions, authorization, metrics, rate limiting, and tracing.

Stateful decorators therefore require explicit documentation of ordering and ownership.

## Resource Management

Decorators can introduce resources such as timers, subscriptions, locks, cache entries, file handles, or instrumentation
contexts.

If the decorated component has a lifecycle, the decorator may need to participate in that lifecycle.

For example:

```ts
interface Connection {
    connect(): Promise<void>;

    disconnect(): Promise<void>;

    send(data: string): Promise<void>;
}
```

A decorator that measures connection usage may need to forward both lifecycle methods:

```ts
class MetricsConnection implements Connection {
    constructor(
        private readonly connection: Connection
    ) {
    }

    connect(): Promise<void> {
        return this.connection.connect();
    }

    disconnect(): Promise<void> {
        return this.connection.disconnect();
    }

    async send(data: string): Promise<void> {
        const start = performance.now();

        try {
            await this.connection.send(data);
        } finally {
            recordDuration(performance.now() - start);
        }
    }
}
```

Failing to preserve lifecycle operations can make a decorator contractually incomplete even if its primary operation
works.

## Immutability

Decorator composition works well with immutable objects because each wrapper can represent a new behavioral
configuration without modifying the underlying component.

```js
const base = new Service();

const logged = new LoggingDecorator(base);
const cached = new CachingDecorator(base);
```

The same base object can therefore participate in different compositions.

However, this is only safe when the underlying component itself is safe to share. Mutable state, caches, connection
ownership, or concurrency constraints may make independent decorator chains interact through the same underlying object.

## Performance

Every decorator introduces another level of indirection.

A deep chain can therefore increase:

* call-stack depth;
* object allocation;
* function-call overhead;
* debugging complexity;
* tracing complexity.

For ordinary application-level code, the overhead is usually less important than the architectural benefits. In
extremely hot execution paths, however, a large decorator chain can become relevant.

Performance-sensitive systems should measure the actual cost rather than assuming that the abstraction is free.

## Testing

Decorators should generally be tested independently from the underlying component.

A test can use a simple fake component:

```js
class FakeService {
    execute(input) {
        return `result:${input}`;
    }
}
```

The decorator can then be tested against known behavior:

```js
const service = new LoggingDecorator(
    new FakeService()
);

const result = service.execute("test");
```

Important tests include:

* delegation occurs correctly;
* arguments are preserved or intentionally transformed;
* results are preserved or intentionally transformed;
* errors are preserved or intentionally transformed;
* added behavior executes under the correct conditions;
* decorator ordering produces the intended semantics;
* lifecycle operations are forwarded correctly;
* state introduced by the decorator behaves correctly.

The underlying component should not need to be tested repeatedly for every decorator combination. Individual decorator
tests and a smaller number of composition tests provide better coverage.

## Common Misuse

Decorator is frequently overused simply because wrapping is mechanically convenient.

A wrapper is not automatically a Decorator.

If the wrapper exists to translate an incompatible interface, it is conceptually Adapter.

If it controls access to an object, it may be Proxy.

If it separates independently varying abstractions and implementations, it may be Bridge.

If it represents a recursive part-whole structure, it is Composite.

If it selects an interchangeable algorithm, it is Strategy.

If it passes responsibility through a sequence of handlers, it may be Chain of Responsibility.

The correct classification comes from design intent and responsibility, not from the fact that one object contains
another.

## Common Design Problems

Decorator can create several problems when used without discipline.

The first is **hidden behavior**. A client may receive an object whose behavior depends on a long chain that is
constructed far away from the call site.

The second is **ordering complexity**. Independent responsibilities can interact in ways that make different decorator
orders produce different semantics.

The third is **debugging complexity**. Stack traces and execution paths become deeper as decorators accumulate.

The fourth is **contract leakage**. If clients must inspect or unwrap decorators to access functionality, the
abstraction is becoming non-transparent.

The fifth is **decorator explosion**. If every small behavior becomes a decorator, the architecture can become
fragmented into a large number of tiny classes or functions.

Decorator should therefore reduce coupling and improve composability rather than merely replacing one form of complexity
with another.

## Architectural Boundaries

Decorator is useful at architectural boundaries when behavior must be attached without changing the underlying
implementation.

For example, an application service can be decorated with authorization, tracing, metrics, retries, and transaction
management while the core service remains unaware of those concerns.

This allows infrastructure concerns to surround application behavior without embedding infrastructure-specific logic
into the core implementation.

The same technique can be applied to repositories, clients, message handlers, command handlers, gateways, and other
stable application contracts.

Decorator is therefore particularly useful in architectures that emphasize dependency inversion and explicit
composition.

## Decorator and Dependency Direction

A decorator normally depends on the component abstraction rather than on a specific concrete implementation.

```ts
class LoggingService implements Service {
    constructor(
        private readonly service: Service
    ) {
    }

    execute(input: Input): Output {
        console.log(input);
        return this.service.execute(input);
    }
}
```

This means the decorator can wrap any implementation satisfying the contract.

The resulting dependency structure supports substitution and keeps the added responsibility independent of the
underlying implementation.

A decorator that directly depends on one concrete implementation loses much of the pattern's compositional benefit.

## Decorator and Open/Closed Principle

Decorator is a direct mechanism for extending behavior without modifying an existing component.

A new responsibility can be introduced through a new decorator:

```js
class AuditDecorator {
    constructor(component) {
        this.component = component;
    }

    execute(input) {
        recordAudit(input);
        return this.component.execute(input);
    }
}
```

The original component remains unchanged.

This is particularly useful when new responsibilities are expected to evolve independently from the core operation.

However, Open/Closed Principle does not imply that every new behavior should become a decorator. The abstraction must
still represent a coherent extension point.

## Functional Decorators

JavaScript's functional programming model makes function decorators especially concise.

```js
const withValidation = fn => (...args) => {
    validate(args);
    return fn(...args);
};

const withLogging = fn => (...args) => {
    console.log(args);
    return fn(...args);
};

const withMetrics = fn => (...args) => {
    const start = performance.now();

    try {
        return fn(...args);
    } finally {
        recordMetric(performance.now() - start);
    }
};
```

They can be composed:

```js
const operation =
    withLogging(
        withMetrics(
            withValidation(
                baseOperation
            )
        )
    );
```

This is one of the most idiomatic forms of Decorator in JavaScript when the component abstraction is a function.

## Native JavaScript Decorators

JavaScript also has a language-level decorator proposal for classes and class elements, standardized through the
ECMAScript decorators feature.

Language-level decorators and the GoF Decorator pattern are related but not identical concepts.

The GoF pattern describes an object-oriented design technique: an object is wrapped by another object that preserves its
component contract while adding responsibilities.

Language-level decorators provide syntax and semantics for applying transformations or metadata-oriented behavior to
classes and class elements.

For example, a language-level decorator may transform or instrument a method without requiring callers to manually
construct a wrapper object.

Therefore, the existence of JavaScript's decorator syntax does not make the GoF Decorator pattern obsolete. They operate
at different abstraction levels.

The GoF pattern is about object composition and runtime behavior. Language-level decorators are a language feature for
declaratively applying behavior or transformations to class definitions and members.

## Decorator Versus Language-Level Decoration

These concepts should not be conflated.

A GoF Decorator normally looks conceptually like:

```js
const service = new LoggingDecorator(
    new Service()
);
```

The client receives a new object that implements the same component contract.

Language-level decoration can instead modify or augment the definition of a class or member:

```js

@logged
class Service {
}
```

The exact semantics depend on the JavaScript decorator model and what the decorator implementation does.

The first is object composition. The second is language-level declaration transformation.

Both can be used for behavioral extension, but they are not interchangeable terminology.

## When to Use Decorator

Decorator is appropriate when:

* an existing object needs additional responsibilities;
* responsibilities are optional or combinable;
* behavior should be selected per object or composition;
* subclass combinations would proliferate;
* the component contract can remain stable;
* added responsibilities can be independently understood;
* behavior should be composable in layers;
* the original implementation should remain unaware of the added responsibility.

Decorator is especially valuable when the system has a stable abstraction and a growing set of orthogonal behaviors that
need different combinations.

## When Not to Use Decorator

Decorator is usually a poor choice when:

* the behavior is intrinsic to the component and should always exist;
* the extension requires deep access to implementation details;
* decorators must frequently inspect or unwrap one another;
* the composition order is too complex to reason about;
* the resulting chain becomes more difficult to understand than the original implementation;
* the wrapper exists primarily to translate an interface;
* the wrapper exists primarily to control access;
* the behavior is actually an alternative algorithm rather than an additional responsibility.

In such cases, direct implementation, Strategy, Adapter, Proxy, inheritance, or another composition mechanism may be
clearer.

## Benefits

Decorator provides several important benefits.

**Runtime extensibility.** Responsibilities can be attached to individual objects without changing their classes.

**Composability.** Multiple independent responsibilities can be combined through nested decorators.

**Avoidance of subclass explosion.** Behavior combinations do not require a separate subclass for every combination.

**Single-responsibility separation.** Each decorator can encapsulate one additional concern.

**Open/closed extensibility.** New responsibilities can often be introduced without modifying the decorated component.

**Implementation independence.** Decorators can target the component contract rather than a specific implementation.

**Configuration flexibility.** Different compositions can be created for different environments, requests, or use cases.

## Costs

Decorator also introduces costs.

**Indirection.** Calls pass through one or more additional objects.

**Composition complexity.** Large decorator chains can be difficult to understand.

**Ordering sensitivity.** The order of decorators may change behavior.

**Debugging overhead.** Execution paths become layered.

**Object proliferation.** Each responsibility can introduce another object.

**Contract complexity.** Lifecycle, errors, metadata, identity, and asynchronous behavior must be preserved correctly.

**Hidden configuration.** If decorator composition occurs far from where an object is consumed, its effective behavior
may be difficult to discover.

Decorator is therefore most effective when the additional compositional flexibility justifies the additional
indirection.

## Decision Criteria

Use Decorator when the primary design question is:

**How can this existing object's behavior be extended with independently composable responsibilities without modifying
the object itself?**

Prefer inheritance when the extension represents a stable subtype relationship and the behavior belongs naturally to the
class hierarchy.

Prefer Strategy when the requirement is to substitute one algorithm or policy for another.

Prefer Adapter when the problem is interface incompatibility.

Prefer Proxy when the primary concern is controlling access to an object.

Prefer Composite when the object represents a recursive part-whole structure.

Prefer Chain of Responsibility when request handling should move through a sequence of handlers.

## Summary

Decorator attaches additional responsibilities to an object by wrapping it with another object that preserves the same
component contract.

Its defining mechanism is **same-contract composition with delegation**. A decorator is itself usable as the component
it wraps, allowing multiple decorators to be composed into a chain.

The pattern is particularly effective for optional, orthogonal, and combinable responsibilities such as logging,
caching, authorization, retries, metrics, tracing, transactions, validation, and auditing.

Decorator should not be identified merely by the presence of a wrapper. Adapter changes an interface, Proxy controls
access, Bridge separates independently varying dimensions, Composite represents part-whole composition, Strategy
substitutes algorithms, and Chain of Responsibility passes handling through a sequence.

In JavaScript, Decorator can be implemented through objects, classes, higher-order functions, or middleware-like
wrappers. TypeScript interfaces and generics can make the component contract explicit and preserve type safety across
the decorator chain.

The central design principle is simple: **when behavior should be extended independently and compositionally, wrap the
existing component with another component that preserves its contract and adds the new responsibility.**
