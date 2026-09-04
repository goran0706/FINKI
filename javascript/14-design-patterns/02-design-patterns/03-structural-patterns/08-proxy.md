# Proxy

## Intent

Proxy provides a substitute object that controls access to another object, known as the target or real subject, while
presenting a compatible interface to clients.

The proxy receives client requests and decides whether, when, and how the corresponding operation is forwarded to the
target.

The central concern is **access control**. A proxy may delay target creation, restrict access, perform authorization,
manage remote communication, cache results, monitor execution, or otherwise control interaction with the target without
requiring clients to know that a substitute is involved.

Proxy is therefore fundamentally different from Decorator. A Decorator adds responsibilities to an object while
preserving its interface; a Proxy primarily controls access to an object.

## Problem

A client may need to interact with an object whose direct use is undesirable, expensive, inaccessible, remote,
sensitive, or otherwise subject to additional access rules.

For example, constructing an expensive resource immediately may be unnecessary:

```js
class ExpensiveReport {
    constructor() {
        console.log("Loading large report...");
        this.data = loadLargeReport();
    }

    render() {
        return renderReport(this.data);
    }
}
```

If the report is rarely used, creating it during application startup wastes resources.

A proxy can postpone creation:

```js
class ReportProxy {
    #report;

    render() {
        if (!this.#report) {
            this.#report = new ExpensiveReport();
        }

        return this.#report.render();
    }
}
```

The client interacts with the proxy rather than directly constructing the expensive object.

The same principle applies when the target is remote:

```js
class UserServiceProxy {
    async findUser(id) {
        return fetchUserFromRemoteService(id);
    }
}
```

The client can use the same conceptual service operation without directly managing the communication mechanism.

## Structure

The pattern consists of a common subject contract, a real subject implementing that contract, and a proxy that also
implements the contract.

The **Subject** defines the operations clients expect.

The **Real Subject** performs the actual work.

The **Proxy** holds or obtains a reference to the real subject and controls access to it.

In JavaScript:

```js
class Image {
    display() {
        throw new Error("Not implemented");
    }
}

class RealImage extends Image {
    constructor(filename) {
        super();
        this.data = loadImage(filename);
    }

    display() {
        renderImage(this.data);
    }
}

class ImageProxy extends Image {
    #filename;
    #image;

    constructor(filename) {
        super();
        this.#filename = filename;
    }

    display() {
        if (!this.#image) {
            this.#image = new RealImage(this.#filename);
        }

        this.#image.display();
    }
}
```

The client can work with the subject abstraction:

```js
function showImage(image) {
    image.display();
}

showImage(new ImageProxy("large-image.png"));
```

The target is created only when required.

## Access Control

The defining characteristic of Proxy is that the proxy controls whether and how access reaches the target.

For example:

```js
class SecureDocumentProxy {
    #document;
    #user;

    constructor(document, user) {
        this.#document = document;
        this.#user = user;
    }

    read() {
        if (!this.#user.canRead) {
            throw new Error("Access denied");
        }

        return this.#document.read();
    }
}
```

The proxy establishes an access boundary around the target.

Authorization is only one form of access control. A proxy can also control:

* creation;
* execution;
* network access;
* resource allocation;
* concurrency;
* visibility;
* lifecycle;
* caching;
* retries;
* synchronization;
* logging;
* rate limiting.

## Virtual Proxy

A Virtual Proxy controls access to an expensive object by delaying its creation or initialization until the object is
actually needed.

```js
class VideoProxy {
    #source;
    #video;

    constructor(source) {
        this.#source = source;
    }

    play() {
        if (!this.#video) {
            this.#video = new Video(this.#source);
        }

        return this.#video.play();
    }
}
```

This is useful when the target is expensive to construct, load, allocate, or initialize.

Typical examples include:

* large images;
* videos;
* database connections;
* heavyweight parsers;
* large data sets;
* expensive computational resources;
* browser resources;
* machine-learning models.

The important property is not simply caching the target. The proxy changes when the target becomes available by
controlling access to its creation.

## Protection Proxy

A Protection Proxy restricts access based on authorization or policy.

```js
class AccountProxy {
    #account;
    #permissions;

    constructor(account, permissions) {
        this.#account = account;
        this.#permissions = permissions;
    }

    withdraw(amount) {
        if (!this.#permissions.includes("withdraw")) {
            throw new Error("Permission denied");
        }

        return this.#account.withdraw(amount);
    }

    getBalance() {
        if (!this.#permissions.includes("read_balance")) {
            throw new Error("Permission denied");
        }

        return this.#account.getBalance();
    }
}
```

The target remains responsible for its own domain invariants. The proxy adds an access policy around those operations.

A protection proxy should not become a replacement for authorization architecture. Security-sensitive systems often need
authorization enforced at multiple boundaries, especially when requests can bypass the proxy.

## Remote Proxy

A Remote Proxy represents an object whose implementation resides elsewhere.

The proxy translates local method calls into communication with the remote target.

```js
class RemoteUserServiceProxy {
    async findUser(id) {
        const response = await fetch(`/api/users/${id}`);

        if (!response.ok) {
            throw new Error("Failed to fetch user");
        }

        return response.json();
    }
}
```

The local proxy represents a remote capability.

The abstraction can be useful when the client should not need to understand:

* transport protocols;
* request construction;
* serialization;
* deserialization;
* endpoint addresses;
* connection management;
* remote error mapping.

However, a remote proxy cannot make remote interaction identical to local interaction in every meaningful respect.
Latency, partial failure, serialization, retries, availability, and network boundaries remain architectural realities.

## Caching Proxy

A caching proxy can avoid repeating expensive operations.

```js
class CachedUserService {
    #service;
    #cache = new Map();

    constructor(service) {
        this.#service = service;
    }

    async findUser(id) {
        if (this.#cache.has(id)) {
            return this.#cache.get(id);
        }

        const user = await this.#service.findUser(id);

        this.#cache.set(id, user);

        return user;
    }
}
```

The proxy controls access to the target and decides whether the target needs to be invoked.

Caching introduces additional concerns:

* cache invalidation;
* staleness;
* memory growth;
* eviction;
* concurrency;
* error handling;
* consistency;
* request coalescing.

A caching proxy is therefore not merely a `Map` around a service. The proxy owns the policy governing whether a target
operation is executed.

## Logging Proxy

A proxy can observe target interactions.

```js
class LoggingProxy {
    #target;

    constructor(target) {
        this.#target = target;
    }

    async execute(input) {
        console.log("Executing operation", input);

        try {
            const result = await this.#target.execute(input);

            console.log("Operation completed");

            return result;
        } catch (error) {
            console.error("Operation failed", error);
            throw error;
        }
    }
}
```

This may resemble Decorator because both can add behavior around an operation.

The distinction depends on intent.

If the wrapper is primarily used to add a composable responsibility such as metrics or retries while treating the
wrapped object as the same service, the design is often better understood as Decorator.

If the wrapper represents a controlled access point to a target, especially where the target is hidden, remote,
expensive, or protected, Proxy is the more appropriate interpretation.

## Synchronization Proxy

A proxy can control concurrent access to a target.

```js
class SerializedProxy {
    #target;
    #queue = Promise.resolve();

    constructor(target) {
        this.#target = target;
    }

    execute(operation) {
        const result = this.#queue.then(() => operation(this.#target));

        this.#queue = result.catch(() => {
        });

        return result;
    }
}
```

The proxy serializes access to the target.

This can be useful when the target is not safe for concurrent operations or when operations must be executed in a
defined order.

The proxy becomes responsible for an access policy rather than merely forwarding calls.

## JavaScript Proxy Object

JavaScript provides a native `Proxy` object:

```js
const proxy = new Proxy(target, handler);
```

This language feature is closely related to the GoF Proxy pattern but is not identical to it.

The GoF pattern is an object-oriented design concept.

JavaScript's `Proxy` is a language mechanism that intercepts operations performed on an object.

For example:

```js
const user = {
    name: "Alice"
};

const proxy = new Proxy(user, {
    get(target, property, receiver) {
        console.log("Reading:", property);

        return Reflect.get(target, property, receiver);
    }
});

proxy.name;
```

The JavaScript mechanism can implement a Proxy pattern, but it can also be used for metaprogramming tasks that have
nothing to do with the GoF pattern.

## Proxy Traps

JavaScript `Proxy` objects can intercept many operations.

Common traps include:

* `get`;
* `set`;
* `has`;
* `deleteProperty`;
* `apply`;
* `construct`;
* `getOwnPropertyDescriptor`;
* `defineProperty`;
* `ownKeys`;
* `getPrototypeOf`;
* `setPrototypeOf`;
* `isExtensible`;
* `preventExtensions`.

For example:

```js
const proxy = new Proxy(target, {
    get(target, property, receiver) {
        return Reflect.get(target, property, receiver);
    },

    set(target, property, value, receiver) {
        return Reflect.set(target, property, value, receiver);
    }
});
```

`Reflect` is generally useful when implementing transparent forwarding because it preserves the standard
object-operation semantics more reliably than manually reproducing them.

## Transparent Proxy

A transparent proxy attempts to preserve the target's observable behavior while intercepting access.

```js
const proxy = new Proxy(target, {
    get(target, property, receiver) {
        return Reflect.get(target, property, receiver);
    }
});
```

Transparency is useful when the proxy should remain substitutable for the target.

However, JavaScript proxies are not completely transparent.

They can affect:

* identity;
* equality;
* reflection;
* private field access;
* `this` binding;
* performance;
* error stack information;
* property descriptors;
* prototype-related behavior.

Therefore, a proxy should not be assumed to be observationally identical to its target.

## Private Fields and Proxies

JavaScript private fields are associated with the actual object instance and are not ordinary properties.

For example:

```js
class User {
    #name;

    constructor(name) {
        this.#name = name;
    }

    getName() {
        return this.#name;
    }
}
```

Wrapping an instance in a JavaScript `Proxy` can cause problems with methods that rely on private fields.

```js
const user = new User("Alice");

const proxy = new Proxy(user, {});

proxy.getName();
```

Inside `getName()`, `this` may be the proxy rather than the original instance, and the proxy does not possess the
target's private field brand.

A common solution is explicit binding:

```js
const proxy = new Proxy(user, {
    get(target, property) {
        const value = Reflect.get(target, property, target);

        if (typeof value === "function") {
            return value.bind(target);
        }

        return value;
    }
});
```

This preserves the original receiver for method execution, but it changes other observable behavior and should not be
applied indiscriminately.

## Method Forwarding

A simple class-based proxy can forward methods explicitly:

```js
class UserServiceProxy {
    #target;

    constructor(target) {
        this.#target = target;
    }

    findUser(id) {
        return this.#target.findUser(id);
    }

    deleteUser(id) {
        return this.#target.deleteUser(id);
    }
}
```

This has the advantage of making the public proxy contract explicit.

A JavaScript `Proxy` can instead forward arbitrary properties:

```js
const proxy = new Proxy(target, {
    get(target, property, receiver) {
        return Reflect.get(target, property, receiver);
    }
});
```

The choice depends on whether explicit interface control or dynamic forwarding is more important.

## Function Proxies

JavaScript `Proxy` can also wrap functions.

```js
function calculate(a, b) {
    return a + b;
}

const proxy = new Proxy(calculate, {
    apply(target, thisArg, args) {
        console.log("Arguments:", args);

        return Reflect.apply(target, thisArg, args);
    }
});
```

This can implement access control, logging, metrics, validation, tracing, rate limiting, or other execution policies.

The same conceptual rule applies: the proxy controls access to the underlying callable target.

## Asynchronous Proxies

Proxies frequently operate around asynchronous targets.

```js
class RetryProxy {
    #target;
    #attempts;

    constructor(target, attempts = 3) {
        this.#target = target;
        this.#attempts = attempts;
    }

    async execute(input) {
        let lastError;

        for (let attempt = 0; attempt < this.#attempts; attempt++) {
            try {
                return await this.#target.execute(input);
            } catch (error) {
                lastError = error;
            }
        }

        throw lastError;
    }
}
```

The proxy controls execution rather than changing the target's core operation.

Asynchronous proxies require explicit decisions about:

* retries;
* timeout;
* cancellation;
* backoff;
* error propagation;
* idempotency;
* concurrent requests;
* request deduplication.

A retry proxy, for example, must not blindly retry operations that are non-idempotent.

## Timeout Proxy

A proxy can impose execution deadlines:

```js
class TimeoutProxy {
    #target;
    #timeout;

    constructor(target, timeout) {
        this.#target = target;
        this.#timeout = timeout;
    }

    execute(input) {
        return Promise.race([
            this.#target.execute(input),
            new Promise((_, reject) => {
                setTimeout(
                    () => reject(new Error("Operation timed out")),
                    this.#timeout
                );
            })
        ]);
    }
}
```

This controls how long the client is willing to wait.

A timeout does not necessarily cancel the underlying operation. If cancellation is required, the proxy should use an
explicit cancellation mechanism such as `AbortController` where the target supports it.

## Rate-Limiting Proxy

A proxy can control how frequently a target is accessed.

```js
class RateLimitedProxy {
    #target;
    #lastExecution = 0;
    #interval;

    constructor(target, interval) {
        this.#target = target;
        this.#interval = interval;
    }

    async execute(input) {
        const now = Date.now();
        const wait = this.#interval - (now - this.#lastExecution);

        if (wait > 0) {
            await new Promise(resolve => setTimeout(resolve, wait));
        }

        this.#lastExecution = Date.now();

        return this.#target.execute(input);
    }
}
```

The proxy controls access frequency while the target remains responsible for performing the operation.

In distributed systems, rate limiting usually belongs at an appropriate infrastructure or service boundary rather than
being implemented independently in every client-side proxy.

## Proxy and Substitutability

A proxy should normally preserve the conceptual contract of the target.

If the target provides:

```js
interface
Repository
{
    findById(id);
    save(entity);
}
```

a proxy should generally provide the same operations:

```js
class RepositoryProxy {
    findById(id) {
    }

    save(entity) {
    }
}
```

This allows clients to depend on the subject abstraction rather than knowing whether they are interacting with the real
implementation.

However, exact behavioral substitutability can be difficult for remote or asynchronous proxies.

A local target might guarantee immediate execution:

```js
const value = service.getValue();
```

while a remote proxy may require:

```js
const value = await service.getValue();
```

The difference is not a minor implementation detail. It changes the contract.

A remote proxy should therefore model the semantics of remote execution honestly rather than pretending that a network
operation is equivalent to a local method call.

## Proxy and Interface Compatibility

Proxy normally preserves the target's conceptual interface.

This distinguishes it from Adapter.

Adapter translates an incompatible interface into one expected by the client.

Proxy generally does not exist because the target has the wrong interface.

For example:

```js
class ThirdPartyService {
    executeRequest(payload) {
    }
}
```

An Adapter might expose:

```js
execute(input)
{
}
```

because the client's expected contract differs.

A Proxy around a service that already exposes `execute()` instead controls access to that service:

```js
class ServiceProxy {
    execute(input) {
        return this.#target.execute(input);
    }
}
```

The difference is **compatibility versus controlled access**.

## Proxy and Decorator

Proxy and Decorator are structurally similar because both commonly contain another object and delegate operations.

Their intent differs.

Decorator wraps an object to add responsibilities:

```js
const service =
    new MetricsDecorator(
        new LoggingDecorator(
            new Service()
        )
    );
```

Proxy controls access to a target:

```js
const service =
    new AuthorizationProxy(
        new Service()
    );
```

The distinction becomes less obvious when a proxy also performs logging, caching, or metrics.

The correct classification depends on the dominant responsibility.

If the wrapper is part of a composable behavior-enhancement pipeline, Decorator is often the clearer model.

If the wrapper exists because access to the target must be mediated, Proxy is the clearer model.

## Proxy and Facade

Facade provides a simpler interface to a subsystem.

```js
class OrderFacade {
    async placeOrder(order) {
        await this.inventory.reserve(order);
        await this.payment.charge(order);
        await this.shipping.createShipment(order);
    }
}
```

Proxy normally preserves the target's interface:

```js
class OrderServiceProxy {
    placeOrder(order) {
        return this.#target.placeOrder(order);
    }
}
```

Facade simplifies a complex subsystem.

Proxy mediates access to a particular subject.

## Proxy and Bridge

Bridge separates an abstraction from its implementation so both dimensions can vary independently.

Proxy does not primarily separate two dimensions of variation.

A bridge might contain:

```js
class RemoteRenderer {
    render() {
    }
}

class Renderer {
    constructor(implementation) {
        this.implementation = implementation;
    }
}
```

A proxy instead represents controlled access to an existing renderer:

```js
class RendererProxy {
    constructor(renderer) {
        this.renderer = renderer;
    }

    render() {
        return this.renderer.render();
    }
}
```

Bridge concerns structural variation.

Proxy concerns access mediation.

## Proxy and Adapter

Adapter changes the interface.

Proxy preserves the interface while controlling access.

For example:

```js
class Adapter {
    request(input) {
        return this.legacyService.executeRequest(input);
    }
}
```

The adapter translates `request()` into `executeRequest()`.

A proxy might instead expose the same operation:

```js
class Proxy {
    request(input) {
        return this.target.request(input);
    }
}
```

The target and proxy speak the same client-facing contract.

## Proxy and Strategy

Strategy encapsulates interchangeable algorithms.

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

The strategy is selected because the algorithm varies.

A proxy is selected because access to the target needs mediation.

A proxy may internally use a strategy for its policy, but the concepts remain distinct.

## Proxy and Chain of Responsibility

Chain of Responsibility passes a request through a sequence of handlers.

```js
class Handler {
    setNext(handler) {
        this.next = handler;
        return handler;
    }

    handle(request) {
        if (this.next) {
            return this.next.handle(request);
        }
    }
}
```

A proxy generally has one target and mediates access to that target.

A chain is about request routing through multiple potential handlers.

A proxy is about controlled access to a particular subject.

## Proxy and State

State changes an object's behavior according to its current state.

Proxy does not primarily represent state transitions.

A proxy can maintain state, such as a cache or connection status, but the target's access policy remains the defining
concern.

## Proxy and Composite

Composite represents recursive part-whole structures.

Proxy represents a substitute for one subject.

A proxy can wrap a composite, but it does not become a Composite simply because the target contains children.

## Proxy and Flyweight

Flyweight reduces memory usage by sharing intrinsic state.

Proxy controls access to a subject.

A flyweight may itself be exposed through a proxy, but sharing and access mediation are different concerns.

## JavaScript Native Proxy and GoF Proxy

The JavaScript `Proxy` API is particularly powerful because it can intercept language-level operations rather than only
explicit method calls.

```js
const proxy = new Proxy(target, {
    get(target, property, receiver) {
        return Reflect.get(target, property, receiver);
    }
});
```

This makes it suitable for:

* reactive systems;
* validation;
* observable objects;
* access control;
* virtualization;
* lazy properties;
* compatibility layers;
* metaprogramming.

However, not every use of JavaScript `Proxy` is a GoF Proxy.

For example, an object that validates assignments:

```js
const user = new Proxy({}, {
    set(target, property, value) {
        if (property === "age" && value < 0) {
            throw new Error("Invalid age");
        }

        return Reflect.set(target, property, value);
    }
});
```

may be better understood as a language-level interception mechanism rather than a classic Proxy structure.

The GoF pattern concerns the design relationship between a client, subject, proxy, and target.

## TypeScript

TypeScript makes explicit proxy contracts straightforward.

```ts
interface Image {
    display(): void;
}

class RealImage implements Image {
    constructor(private readonly filename: string) {
    }

    display(): void {
        // Load and display image.
    }
}

class ImageProxy implements Image {
    private image?: RealImage;

    constructor(
        private readonly filename: string
    ) {
    }

    display(): void {
        this.image ??= new RealImage(this.filename);
        this.image.display();
    }
}
```

The interface defines the subject contract.

Both the proxy and real subject implement it.

This allows clients to depend on the interface:

```ts
function displayImage(image: Image): void {
    image.display();
}
```

TypeScript structural typing also means explicit inheritance from a common base class is unnecessary when the contract
is satisfied.

## Generic Proxy Types

A generic class can preserve a target contract:

```ts
class LazyProxy<T> {
    private target?: T;

    constructor(
        private readonly factory: () => T
    ) {
    }

    get(): T {
        return this.target ??= this.factory();
    }
}
```

This represents lazy access to a value but does not automatically make arbitrary operations transparent.

For arbitrary object forwarding, JavaScript's native `Proxy` can be used:

```ts
function createLoggingProxy<T extends object>(target: T): T {
    return new Proxy(target, {
        get(target, property, receiver) {
            console.log("Access:", String(property));
            return Reflect.get(target, property, receiver);
        }
    });
}
```

The generic return type communicates the intended surface contract, although runtime behavior still depends on the proxy
handler.

## Dependency Injection

Proxy and dependency injection work naturally together.

```js
class Application {
    constructor(userService) {
        this.userService = userService;
    }
}
```

The application can receive either:

```js
new UserService()
```

or:

```js
new AuthorizationProxy(
    new UserService()
)
```

The application does not need to know which implementation it received.

This allows cross-cutting access policies to be introduced without modifying consumers.

Factories and dependency-injection containers can also construct proxies automatically.

## Proxy at Architectural Boundaries

Proxy is useful when access to a component needs to be mediated at a boundary.

Examples include:

* domain service access;
* infrastructure clients;
* remote services;
* persistence repositories;
* external APIs;
* expensive resources;
* security-sensitive resources;
* rate-limited resources.

At architectural scale, proxies can represent concerns such as:

* remote invocation;
* authorization;
* caching;
* circuit breaking;
* retry policy;
* observability;
* resource lifecycle.

However, the proxy should not conceal architectural semantics that materially affect the caller.

A remote service remains remote.

A potentially stale cache remains a cache.

A retrying operation remains subject to retry semantics.

Abstraction should reduce unnecessary coupling without hiding important operational characteristics.

## Remote Failure

Remote proxies require explicit failure semantics.

A local call may fail because of a programming error or domain rule.

A remote call can also fail because:

* the network is unavailable;
* the remote process crashed;
* DNS resolution failed;
* the connection timed out;
* the remote service is overloaded;
* the response was malformed;
* the request was duplicated;
* the connection was interrupted after the server processed the request.

The proxy therefore becomes part of the distributed-systems boundary.

Retries, timeouts, circuit breakers, idempotency, and error mapping must be designed intentionally.

## Lifecycle Management

A proxy may own or participate in target lifecycle management.

A lazy proxy may create the target:

```js
class LazyConnectionProxy {
    #connection;

    getConnection() {
        return this.#connection ??= createConnection();
    }
}
```

If the resource requires cleanup, the proxy must determine whether it owns that lifecycle.

```js
class ConnectionProxy {
    #connection;

    connect() {
        this.#connection ??= createConnection();
        return this.#connection.connect();
    }

    close() {
        return this.#connection?.close();
    }
}
```

Lifecycle ownership should be explicit.

A proxy that creates a resource but cannot determine when it should be released can create resource leaks.

## Identity

Proxy introduces an identity distinction.

```js
const target = new Service();
const proxy = new ServiceProxy(target);
```

These are two different JavaScript objects:

```js
target === proxy;
```

is false.

This can matter when code uses:

* identity comparisons;
* `Map` keys;
* `Set` membership;
* object branding;
* weak references;
* private fields;
* instance checks.

A proxy that needs to preserve identity semantics must address them explicitly rather than assuming transparent
substitution.

## State and Caching

A proxy may contain its own state.

```js
class CachedProxy {
    #target;
    #cache = new Map();

    constructor(target) {
        this.#target = target;
    }
}
```

This creates two distinct state domains:

* target state;
* proxy state.

The proxy must define whether cached or policy state is shared across proxy instances.

Two proxies around the same target may otherwise maintain independent caches:

```js
const first = new CachedProxy(target);
const second = new CachedProxy(target);
```

If caching is supposed to be global for the target, the cache ownership needs to be designed accordingly.

## Concurrency

Lazy initialization introduces concurrency concerns.

A naive implementation:

```js
if (!this.#target) {
    this.#target = await createTarget();
}
```

can create multiple targets when concurrent callers arrive before initialization completes.

A promise can represent initialization itself:

```js
class AsyncLazyProxy {
    #targetPromise;

    constructor(factory) {
        this.#targetPromise = null;
        this.factory = factory;
    }

    async getTarget() {
        return this.#targetPromise ??= this.factory();
    }
}
```

The exact lifecycle semantics depend on whether failed initialization should be retried or permanently cached.

## Performance

Proxy introduces an additional level of indirection.

For explicit class-based proxies, the overhead is usually straightforward method delegation.

JavaScript's native `Proxy` can have more significant performance implications because arbitrary object operations may
be intercepted.

Performance should therefore be evaluated when proxies occur on extremely hot paths.

More importantly, policy operations can dominate the cost.

For example, a proxy that performs network authorization, logging, serialization, or cache lookups may add substantially
more overhead than the method dispatch itself.

The design should optimize actual bottlenecks rather than avoiding the pattern merely because an extra object exists.

## Testing

A proxy should be tested according to its access policy and its contract with the target.

For a protection proxy:

```js
expect(() => proxy.deleteUser(id))
    .toThrow("Permission denied");
```

For a lazy proxy:

```js
expect(factory).not.toHaveBeenCalled();

proxy.render();

expect(factory).toHaveBeenCalledTimes(1);
```

For a caching proxy:

```js
await proxy.findUser("123");
await proxy.findUser("123");

expect(target.findUser)
    .toHaveBeenCalledTimes(1);
```

Tests should also verify failure behavior, concurrency, cache invalidation, and lifecycle management where those
concerns are part of the proxy.

The target itself should generally be tested independently.

## Refactoring Toward Proxy

A class is a candidate for Proxy when clients already depend on a subject-like contract but additional access control is
repeatedly implemented around the target.

For example:

```js
async function getUser(id) {
    if (!currentUser.canReadUsers) {
        throw new Error("Access denied");
    }

    return userService.findUser(id);
}
```

If the same policy is repeatedly applied to the same service operations, it may be extracted into a proxy:

```js
class UserServiceProxy {
    #service;
    #user;

    constructor(service, user) {
        this.#service = service;
        this.#user = user;
    }

    async findUser(id) {
        if (!this.#user.canReadUsers) {
            throw new Error("Access denied");
        }

        return this.#service.findUser(id);
    }
}
```

Consumers can then depend on the same service contract while the access policy becomes a distinct component.

## Recognizing a Proxy Opportunity

Look for code where:

* clients repeatedly check authorization before accessing one object;
* expensive resources are created before they are actually needed;
* remote access logic is duplicated;
* caching logic surrounds calls to one target;
* access logging is duplicated;
* rate limiting is repeatedly applied;
* lifecycle control is mixed into consumers;
* multiple consumers need the same access policy;
* clients need to interact with a resource without knowing how it is obtained.

The strongest signal is that the **target already represents the desired abstraction**, but access to that target needs
mediation.

## Common Misuse

Do not introduce a proxy merely because an object delegates to another object.

Delegation alone is not enough.

```js
class Wrapper {
    constructor(target) {
        this.target = target;
    }

    execute(input) {
        return this.target.execute(input);
    }
}
```

Without a meaningful access-control responsibility, this structure does not automatically justify Proxy.

Do not use Proxy when the real problem is interface incompatibility. That is Adapter.

Do not use Proxy when the real purpose is to add independently composable responsibilities. That is often Decorator.

Do not use Proxy to simplify a large subsystem interface. That is Facade.

Do not use Proxy to separate two independent dimensions of variation. That is Bridge.

## Proxy Explosion

A system can accumulate excessive proxy layers:

```js
const service =
    new LoggingProxy(
        new RetryProxy(
            new CacheProxy(
                new AuthorizationProxy(
                    new Service()
                )
            )
        )
    );
```

Layering is not inherently wrong, but each proxy introduces another policy boundary.

The resulting system can become difficult to understand when:

* ordering affects semantics;
* errors are transformed multiple times;
* caching occurs before authorization;
* retries interact with transactions;
* logging exposes sensitive data;
* timeouts conflict;
* multiple proxies own lifecycle state.

Cross-cutting behavior should be composed deliberately rather than automatically wrapped around every service.

## Security Considerations

A protection proxy is not automatically a security boundary.

If the underlying target can be accessed through another path, callers may bypass the proxy.

For example:

```js
const secureService = new AuthorizationProxy(service);
```

does not make `service` secure if another component still receives the raw instance:

```js
container.register("service", service);
```

Security boundaries depend on actual access paths.

Sensitive authorization should be enforced as close as necessary to the protected resource and should not rely
exclusively on an optional client-side proxy.

## Error Handling

A proxy should normally preserve or intentionally transform target errors.

Transparent delegation:

```js
try {
    return await this.#target.execute(input);
} catch (error) {
    throw error;
}
```

is often preferable to unnecessarily replacing errors.

If the proxy transforms errors, the transformation should be part of its contract:

```js
catch
(error)
{
    throw new ServiceUnavailableError(
        "Remote service unavailable",
        {cause: error}
    );
}
```

Error translation becomes especially important for remote proxies where transport-level errors need to be mapped into
application-level failures.

## Observability

Proxies can provide a useful observability boundary.

```js
class MetricsProxy {
    #target;
    #metrics;

    constructor(target, metrics) {
        this.#target = target;
        this.#metrics = metrics;
    }

    async execute(input) {
        const start = performance.now();

        try {
            const result = await this.#target.execute(input);

            this.#metrics.success(performance.now() - start);

            return result;
        } catch (error) {
            this.#metrics.failure(performance.now() - start);
            throw error;
        }
    }
}
```

This allows instrumentation without modifying the target implementation.

However, care is required around sensitive arguments, high-cardinality labels, and duplicated instrumentation when
multiple proxy layers observe the same operation.

## API Boundaries

Proxy is particularly useful when a stable API should remain independent of the target's access mechanism.

For example:

```js
interface
PaymentGateway
{
    charge(request);
}
```

The application can depend on `PaymentGateway`.

A local implementation may directly perform the operation.

A proxy may add:

* authorization;
* caching where applicable;
* rate limiting;
* retries;
* remote communication;
* metrics.

The consumer remains coupled to the gateway contract rather than to the access mechanism.

## Decision Criteria

Use Proxy when:

* access to an object needs to be controlled;
* the target is expensive to create;
* the target is remote;
* access requires authorization;
* calls need caching or request coordination;
* lifecycle needs to be mediated;
* execution needs rate limiting or synchronization;
* clients should not know how the target is obtained;
* a stable subject contract already exists.

Do not use Proxy when:

* the client needs a different interface;
* the subsystem needs a simpler higher-level interface;
* the main purpose is adding independently composable behavior;
* two dimensions of implementation need independent variation;
* the object is already simple and requires no access mediation;
* a language-level mechanism provides the required behavior more directly.

## Benefits

Proxy controls access without requiring clients to depend directly on the target implementation.

It can defer expensive initialization.

It can enforce authorization and other access policies.

It can represent remote resources.

It can centralize caching, rate limiting, synchronization, retries, timeouts, and observability.

It can preserve a stable subject-oriented API while changing how the target is accessed.

It can isolate clients from resource acquisition and lifecycle details.

It can introduce access policies without modifying the real subject.

## Costs

Proxy introduces another level of indirection.

Additional proxy state can complicate lifecycle and concurrency.

Multiple proxies can create complicated policy interactions.

Caching proxies introduce consistency and invalidation problems.

Remote proxies cannot eliminate the semantic consequences of network communication.

Native JavaScript `Proxy` can complicate debugging, identity, private-field behavior, reflection, and performance.

Protection proxies are ineffective as security boundaries when the target remains independently accessible.

Poorly designed proxies can become hidden service layers that accumulate unrelated responsibilities.

## Summary

Proxy provides a substitute for an object that controls access to the real target while generally preserving the
target's conceptual interface.

The pattern covers several forms of access mediation, including virtual proxies for lazy initialization, protection
proxies for authorization, remote proxies for remote resources, caching proxies for repeated operations, and
synchronization or policy proxies for controlled execution.

JavaScript's native `Proxy` object provides a powerful mechanism for implementing proxy-like behavior at the
language-operation level, but the language feature and the GoF design pattern are not synonymous.

The key distinctions are:

* **Adapter** changes an incompatible interface.
* **Bridge** separates independently varying abstraction and implementation dimensions.
* **Decorator** adds responsibilities through composition.
* **Facade** simplifies access to a subsystem.
* **Proxy** controls access to a target.

The essential design rule is:

**When the target already represents the desired abstraction but access to that target must be mediated, introduce a
proxy rather than changing the target or forcing every client to implement the access policy.**
