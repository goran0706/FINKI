# Object Pool Pattern

## Intent

The Object Pool Pattern manages a reusable collection of objects so that objects can be acquired for temporary use and
returned to the pool when they are no longer needed. Instead of repeatedly creating and destroying objects, the pool
controls object allocation, reuse, lifecycle, and availability.

The pattern is primarily useful when object creation or initialization is sufficiently expensive, when the number of
simultaneously active objects should be bounded, or when an external resource represented by an object is scarce. The
defining characteristic is not merely reuse. The pool owns a set of reusable instances and exposes an acquisition and
release protocol that controls access to them.

In JavaScript, object pooling is less universally useful than in environments where object allocation and destruction
are expensive. Modern JavaScript engines perform allocation and garbage collection efficiently for many short-lived
objects. Consequently, an object pool should normally be introduced because of a measured allocation, initialization,
resource, or concurrency constraint rather than because object allocation is inherently considered undesirable.

## Problem

An application may repeatedly create objects that have a relatively expensive initialization process or represent
limited resources. Examples include rendering objects, parser contexts, buffers, temporary worker state, reusable
request contexts, database-related resources, or objects that maintain expensive internal structures.

Creating a new instance for every operation can introduce unnecessary initialization cost and increase allocation
pressure. Conversely, retaining every object indefinitely defeats garbage collection and can create unbounded memory
consumption.

An object pool establishes a controlled lifecycle. A client acquires an available object, uses it, and releases it back
to the pool so another operation can reuse it.

The pool therefore introduces an additional state for every pooled object: available or acquired. Correctness depends on
respecting that lifecycle.

## Structure

A typical object pool contains four conceptual participants:

* **Pool** — owns and manages reusable objects.
* **Pooled Object** — an object that can be acquired and subsequently returned.
* **Client** — requests an object from the pool and returns it after use.
* **Factory or Reset Mechanism** — creates new objects when permitted and restores objects to a reusable state.

The pool determines how many objects exist, which objects are available, how objects are acquired, and what happens when
no object is available.

The pool may maintain a minimum size, maximum size, idle timeout, expiration policy, or other lifecycle constraints.
These policies are independent of the core pooling mechanism.

## Core Lifecycle

A pooled object normally moves through three conceptual phases:

1. **Created** — the object has been constructed and initialized.
2. **Available** — the object is currently owned by the pool and can be acquired.
3. **Acquired** — the object is temporarily owned by a client.

After use, the client must release the object. The pool then resets it as necessary and makes it available again.

The reset operation is fundamental. Reusing an object without clearing state left by the previous client can cause data
leakage, stale configuration, incorrect behavior, and security problems.

A pool should therefore define exactly what state is reset and what state remains associated with the pooled object.

## Basic JavaScript Implementation

A simple synchronous pool can be implemented with a factory function and an available-object collection:

```js
class ObjectPool {
    #available = [];
    #factory;

    constructor(factory, initialSize = 0) {
        this.#factory = factory;

        for (let i = 0; i < initialSize; i++) {
            this.#available.push(factory());
        }
    }

    acquire() {
        return this.#available.pop() ?? this.#factory();
    }

    release(object) {
        this.#available.push(object);
    }
}
```

The implementation above demonstrates the basic mechanism but does not yet enforce a maximum size, reset objects, track
ownership, or prevent invalid releases. A production pool normally needs stronger lifecycle semantics.

## Resetting Pooled Objects

A pooled object must be restored to a valid baseline before it becomes available to another client.

A pool can delegate reset behavior to the object:

```js
class BufferPool {
    #available = [];

    acquire() {
        return this.#available.pop() ?? new ArrayBuffer(1024);
    }

    release(buffer) {
        this.#available.push(buffer);
    }
}
```

For objects containing mutable application state, explicit reset logic is usually necessary:

```js
class RequestContext {
    constructor() {
        this.user = null;
        this.headers = {};
        this.body = null;
        this.metadata = {};
    }

    reset() {
        this.user = null;
        this.headers = {};
        this.body = null;
        this.metadata = {};
    }
}

class RequestContextPool {
    #available = [];

    acquire() {
        return this.#available.pop() ?? new RequestContext();
    }

    release(context) {
        context.reset();
        this.#available.push(context);
    }
}
```

The reset operation should establish the complete reusable invariant. Clearing only the fields currently known to be
relevant is dangerous because future modifications may introduce additional state that survives between clients.

## Factory-Based Pools

A factory allows the pool to control object creation without coupling itself to a particular constructor.

```js
class ObjectPool {
    #available = [];
    #factory;
    #reset;

    constructor({factory, reset}) {
        this.#factory = factory;
        this.#reset = reset;
    }

    acquire() {
        return this.#available.pop() ?? this.#factory();
    }

    release(object) {
        this.#reset(object);
        this.#available.push(object);
    }
}

const pool = new ObjectPool({
    factory: () => ({
        value: null,
        metadata: {}
    }),
    reset: object => {
        object.value = null;
        object.metadata = {};
    }
});
```

This form separates object creation, pooling policy, and object reset behavior.

The factory does not necessarily need to create class instances. Pooled objects can be plain objects, typed-array-backed
structures, class instances, parser contexts, buffers, or other reusable representations.

## Bounded Pools

An unbounded pool can retain every object ever released into it. This can turn an optimization intended to reduce
allocation into a memory-retention mechanism.

A bounded pool can impose a maximum number of retained objects:

```js
class BoundedObjectPool {
    #available = [];
    #factory;
    #reset;
    #maxSize;

    constructor({factory, reset, maxSize}) {
        this.#factory = factory;
        this.#reset = reset;
        this.#maxSize = maxSize;
    }

    acquire() {
        return this.#available.pop() ?? this.#factory();
    }

    release(object) {
        this.#reset(object);

        if (this.#available.length < this.#maxSize) {
            this.#available.push(object);
        }
    }
}
```

The maximum retained size does not necessarily represent the maximum number of objects that can exist. Objects currently
acquired by clients may exist in addition to objects retained by the pool.

A pool may therefore distinguish between:

* maximum retained objects,
* maximum total objects,
* maximum concurrently acquired objects,
* minimum preallocated objects.

These constraints have different semantics and should not be conflated.

## Acquisition Limits

If the pool represents a scarce resource rather than merely reusable memory, acquisition may need to be bounded.

For example, a pool may allow only a fixed number of concurrent clients to acquire an object. When the limit is reached,
acquisition can either fail immediately or wait for a released object.

A synchronous JavaScript pool can fail immediately:

```js
class LimitedPool {
    #available = [];
    #active = 0;
    #maxSize;
    #factory;

    constructor(factory, maxSize) {
        this.#factory = factory;
        this.#maxSize = maxSize;
    }

    acquire() {
        const object = this.#available.pop();

        if (object !== undefined) {
            this.#active++;
            return object;
        }

        if (this.#active >= this.#maxSize) {
            throw new Error("Object pool exhausted");
        }

        this.#active++;
        return this.#factory();
    }

    release(object) {
        this.#active--;
        this.#available.push(object);
    }
}
```

For asynchronous resources, a pool commonly needs a waiting queue instead of immediately throwing when capacity is
exhausted.

## Asynchronous Acquisition

JavaScript applications frequently use asynchronous resources. An asynchronous pool may queue acquisition requests until
an object becomes available.

```js
class AsyncObjectPool {
    #available = [];
    #waiters = [];
    #active = 0;
    #maxSize;
    #factory;
    #reset;

    constructor({factory, reset, maxSize}) {
        this.#factory = factory;
        this.#reset = reset;
        this.#maxSize = maxSize;
    }

    acquire() {
        const object = this.#available.pop();

        if (object !== undefined) {
            this.#active++;
            return Promise.resolve(object);
        }

        if (this.#active < this.#maxSize) {
            this.#active++;
            return Promise.resolve(this.#factory());
        }

        return new Promise(resolve => {
            this.#waiters.push(resolve);
        });
    }

    release(object) {
        this.#reset(object);

        const waiter = this.#waiters.shift();

        if (waiter) {
            waiter(object);
            return;
        }

        this.#active--;
        this.#available.push(object);
    }
}
```

A production implementation must additionally address rejection, cancellation, timeouts, disposal, fairness, and
failures during creation or reset.

## Acquire-and-Use APIs

Explicit `acquire()` and `release()` calls are easy to understand but create a lifecycle hazard:

```js
const resource = await pool.acquire();

try {
    await useResource(resource);
} finally {
    pool.release(resource);
}
```

The `finally` block is important because exceptions must not permanently remove resources from the pool.

An API can reduce this risk by encapsulating the lifecycle:

```js
async function using(pool, callback) {
    const object = await pool.acquire();

    try {
        return await callback(object);
    } finally {
        pool.release(object);
    }
}
```

The client then cannot accidentally omit the release operation under normal control flow:

```js
await using(pool, async object => {
    await process(object);
});
```

This style is particularly useful for asynchronous resources because ownership and release are explicitly coupled to one
operation.

## Resource Ownership

Pooling becomes substantially more important when the pooled object represents something more expensive or scarce than
ordinary JavaScript memory.

Examples include:

* database connections,
* network connections,
* worker instances,
* parser contexts,
* rendering resources,
* native-backed resources,
* reusable buffers,
* compression contexts,
* cryptographic contexts,
* file-related resources.

In these cases, the pool is not merely optimizing object allocation. It is controlling resource concurrency and
lifecycle.

This distinction matters because a resource pool may require acquisition timeouts, health checks, validation, eviction,
destruction, reconnection, and explicit shutdown.

## Object Validity

A pooled resource may become invalid while it is sitting in the pool.

For example, a connection may expire or be closed externally. A robust pool can validate an object before handing it to
a client:

```js
class ResourcePool {
    #available = [];
    #factory;
    #isValid;

    constructor({factory, isValid}) {
        this.#factory = factory;
        this.#isValid = isValid;
    }

    async acquire() {
        while (this.#available.length > 0) {
            const resource = this.#available.pop();

            if (await this.#isValid(resource)) {
                return resource;
            }

            await this.#destroy(resource);
        }

        return this.#factory();
    }

    async #destroy(resource) {
        if (typeof resource.close === "function") {
            await resource.close();
        }
    }

    release(resource) {
        this.#available.push(resource);
    }
}
```

Validation and destruction policies are resource-management concerns rather than intrinsic requirements of every object
pool.

## Pool Ownership and Encapsulation

Clients should generally not manipulate the pool's internal collection.

The pool should own:

* available-object storage,
* creation,
* release,
* reset,
* destruction,
* capacity accounting,
* waiting clients,
* health checks,
* lifecycle state.

Exposing the underlying array undermines the abstraction because clients can remove, duplicate, mutate, or bypass pooled
objects without respecting the pool's lifecycle rules.

The pool should also avoid exposing operations that allow clients to retain an object indefinitely without
accountability when the resource is scarce.

## Preventing Double Release

A client releasing the same object twice can corrupt pool accounting and cause the same object to be handed to multiple
clients simultaneously.

A stronger implementation can track acquired objects:

```js
class SafeObjectPool {
    #available = [];
    #acquired = new Set();
    #factory;

    constructor(factory) {
        this.#factory = factory;
    }

    acquire() {
        const object = this.#available.pop() ?? this.#factory();
        this.#acquired.add(object);
        return object;
    }

    release(object) {
        if (!this.#acquired.delete(object)) {
            throw new Error("Object was not acquired from this pool");
        }

        this.#available.push(object);
    }
}
```

This introduces tracking overhead but makes lifecycle violations detectable.

For high-throughput pools, the additional bookkeeping may itself become significant. The appropriate level of validation
depends on whether lifecycle correctness or maximum throughput is the dominant concern.

## JavaScript Memory Management

Object pooling has a special relationship with JavaScript garbage collection.

Ordinary short-lived objects can often be allocated cheaply and collected efficiently. A pool prevents those objects
from becoming unreachable because it deliberately retains references to them.

Consequently, pooling can reduce allocation churn while simultaneously increasing retained memory.

This creates an important trade-off:

**A pool trades some allocation and initialization work for explicit retention and lifecycle management.**

A pool is therefore not automatically a garbage-collection optimization.

If pooled objects are rarely reused, retaining them can consume more memory than allocating new objects and allowing
them to become garbage.

## Pooling and Garbage Collection

The pool itself strongly affects object lifetime.

Without pooling, an object can become collectible when no references remain:

```js
function createTemporaryObject() {
    return {
        data: new Array(1000)
    };
}
```

With pooling, the pool maintains a strong reference:

```js
const pool = [];

pool.push({
    data: new Array(1000)
});
```

The object remains reachable as long as the pool retains it.

Therefore, a pool should normally have a retention policy rather than assuming that every created object should remain
available indefinitely.

## Idle Eviction

A pool can discard objects that have remained unused for too long.

An eviction policy may consider:

* last-used timestamp,
* total idle duration,
* pool size,
* resource health,
* memory pressure,
* application lifecycle.

Eviction is especially relevant for pools representing external resources, where idle resources may consume connections,
file descriptors, sockets, or other scarce capacity.

For ordinary JavaScript objects, idle eviction can introduce unnecessary complexity unless measurements demonstrate a
meaningful benefit.

## Minimum Pool Size

A pool may preallocate a minimum number of objects:

```js
class PreallocatedPool {
    #available = [];

    constructor(factory, size) {
        for (let i = 0; i < size; i++) {
            this.#available.push(factory());
        }
    }

    acquire() {
        return this.#available.pop() ?? factory();
    }
}
```

Preallocation can reduce first-use latency when object initialization is expensive, but it also allocates resources
before they are needed.

A minimum size should therefore reflect a known warm-up requirement rather than an arbitrary preference for
preallocation.

## Pooling Stateful Objects

Pooling is particularly sensitive to object state.

Suppose an object contains:

```js
class WorkerContext {
    constructor() {
        this.userId = null;
        this.permissions = [];
        this.result = null;
    }
}
```

If one client sets `userId` and the object is subsequently returned without resetting it, the next client may observe
stale state.

The problem becomes more serious when state contains security-sensitive information. A pooled object that retains
authentication data, credentials, request information, authorization decisions, or private application data can cause
cross-request information leakage.

Reset logic must therefore be treated as part of the correctness boundary, not as an optional optimization.

## Immutable Pooled Objects

Pooling immutable objects is usually less useful when ordinary allocation is inexpensive because immutable objects
cannot accumulate mutable client-specific state.

Pooling can still be useful when the objects are expensive to initialize or represent scarce resources.

If the primary goal is simply sharing immutable data among many consumers, the **Flyweight Pattern** is usually the more
appropriate conceptual model.

## Object Pool vs Flyweight

Object Pool and Flyweight both involve reuse, but they solve different problems.

**Object Pool manages reusable instances over time. Flyweight shares common intrinsic state among multiple logical
objects.**

A pooled object is temporarily owned by one client and should normally not be used simultaneously by multiple clients. A
flyweight is intended to be safely shared by multiple clients.

Pooling is therefore about lifecycle and availability. Flyweight is about state sharing and memory reduction through
representation sharing.

## Object Pool vs Cache

A cache retains previously produced results or objects so they can be retrieved again.

A pool retains reusable resources so clients can temporarily acquire them and later return them.

A cache typically answers the question, “Can I reuse a previously computed or loaded value?”

A pool answers the question, “Can I temporarily borrow a reusable resource?”

A cache entry usually remains associated with its key. A pooled object is normally independent of the client that
previously used it.

## Object Pool vs Singleton

A Singleton restricts or coordinates instance cardinality, usually providing a single shared instance.

An Object Pool intentionally manages multiple instances and controls their concurrent availability.

A pool can technically contain one object, but that does not make it conceptually a Singleton. The pool's defining
concern is controlled reuse and acquisition rather than global instance uniqueness.

## Object Pool vs Prototype

The Prototype Pattern creates new objects by cloning an existing object or prototype.

An Object Pool does not normally create a new logical object for every client. It reassigns an existing instance after
it has been returned.

Prototype concerns object creation from an existing exemplar. Object Pool concerns reuse of existing instances.

## Object Pool vs Flyweight Factory

A Flyweight Factory commonly canonicalizes equivalent intrinsic state so requests for the same state return the same
shared object.

An Object Pool Factory creates objects when additional capacity is needed.

The identity semantics are therefore different. Flyweight factories may intentionally return the same object for
equivalent state. A pool normally returns an available object whose previous client is irrelevant after reset.

## Object Pool vs Memoization

Memoization stores the result of a function for reuse based on its input.

Object pooling stores reusable instances for temporary acquisition.

Memoization optimizes repeated computation. Pooling optimizes repeated resource or object creation and lifecycle.

## Object Pool vs Dependency Injection

Dependency Injection determines where a dependency comes from and how it is supplied to a consumer.

An object pool determines how a reusable dependency is allocated, acquired, and released.

A pool can itself be injected:

```js
class Renderer {
    constructor(bufferPool) {
        this.bufferPool = bufferPool;
    }
}
```

Dependency Injection and Object Pool therefore operate at different concerns and can be used together.

## Object Pool vs Resource Pool

The terms are often used interchangeably, but a useful distinction is that an object pool can manage ordinary JavaScript
objects, while a resource pool manages objects representing constrained external or runtime resources.

A database connection pool is therefore a resource-management application of the same underlying pooling mechanism.

When the resource has an external lifecycle, pool correctness becomes more important than allocation performance.

## Function-Based Pools

JavaScript does not require classes for object pooling.

A closure can encapsulate the pool:

```js
function createPool(factory, reset) {
    const available = [];

    return {
        acquire() {
            return available.pop() ?? factory();
        },

        release(object) {
            reset(object);
            available.push(object);
        }
    };
}
```

This implementation keeps the pool's internal collection private through lexical scope.

The closure-based form works well when the pool has a small API and does not need inheritance or a large amount of
stateful lifecycle machinery.

## Generic TypeScript Pools

TypeScript can express the relationship between the factory, pooled objects, and reset operation:

```ts
interface ObjectPool<T> {
    acquire(): T;

    release(object: T): void;
}

function createPool<T>(
    factory: () => T,
    reset: (object: T) => void
): ObjectPool<T> {
    const available: T[] = [];

    return {
        acquire() {
            return available.pop() ?? factory();
        },

        release(object) {
            reset(object);
            available.push(object);
        }
    };
}
```

The generic type ensures that objects produced by the factory and objects accepted by `release()` have the same type.

More advanced pools may parameterize acquisition options, asynchronous factories, disposal operations, or ownership
tokens.

## Ownership Tokens

For stricter APIs, releasing the object itself can be replaced or supplemented by an ownership token.

This can make it harder to accidentally release an object belonging to another pool or release an object more than once.

The additional abstraction is justified when resource ownership is sufficiently important to warrant stronger lifecycle
enforcement.

## Async Factories

A resource may require asynchronous initialization:

```js
const pool = createAsyncPool({
    factory: async () => {
        return await createConnection();
    },
    reset: async connection => {
        await connection.reset();
    }
});
```

An asynchronous pool must account for resources that are:

* being created,
* available,
* acquired,
* being reset,
* being destroyed,
* failed,
* waiting for acquisition.

The lifecycle is therefore more complicated than a synchronous array of reusable objects.

## Cancellation

Queued acquisition is vulnerable to cancellation.

A client may request a resource and then stop waiting because its operation has been cancelled or timed out.

A production asynchronous pool should remove cancelled waiters rather than allowing them to remain indefinitely in the
acquisition queue.

The exact mechanism depends on the API and may involve `AbortSignal`.

## Error Handling

Failures can occur during:

* object creation,
* initialization,
* acquisition,
* validation,
* reset,
* release,
* destruction.

A pool should define whether an object that fails validation or reset is discarded, retried, or returned to the
available collection.

A failed reset should generally prevent the object from being made available again because its reusable invariant has
not been established.

## Resource Destruction

A pool should distinguish between releasing an object and destroying it.

Release means that the object remains valid and becomes available for reuse.

Destruction means that the object is permanently removed from the pool and its underlying resources are cleaned up.

For example:

```js
async function destroy(resource) {
    await resource.close();
}
```

A pool may destroy resources because they are unhealthy, expired, excessive, or because the application itself is
shutting down.

## Shutdown

Resource pools should normally expose an explicit shutdown operation when their objects own external resources.

Shutdown can:

* prevent new acquisitions,
* reject waiting clients,
* destroy available resources,
* wait for active resources,
* optionally force destruction after a timeout.

A pool containing ordinary JavaScript objects generally does not require an explicit shutdown lifecycle because garbage
collection can eventually reclaim the pool itself.

## Concurrency

JavaScript execution is commonly single-threaded within an individual agent, but asynchronous operations can still
produce logical concurrency.

For example, two asynchronous callers can both await pool acquisition and later resume with different resources. The
pool must maintain correct accounting across those interleavings.

When workers or shared resources are involved, actual parallel execution may also exist. In that case, the
synchronization model depends on whether the pool is local to one agent or coordinates resources across workers or other
execution contexts.

A JavaScript object pool should not be described as inherently thread-safe merely because ordinary JavaScript execution
is single-threaded.

## Performance

The performance argument for pooling usually involves some combination of:

* expensive construction,
* expensive initialization,
* expensive destruction,
* high allocation rates,
* resource limits,
* reduced initialization latency,
* bounded concurrency.

However, pooling introduces its own costs:

* reset operations,
* bookkeeping,
* retained memory,
* acquisition/release overhead,
* lifecycle complexity,
* synchronization or queue management,
* debugging complexity.

A pool is beneficial only when those costs are lower than the costs it is intended to eliminate.

## Pooling and Object Shapes

JavaScript engines optimize objects based partly on their internal representations and property layouts. Reusing objects
can preserve stable object shapes when reset operations modify the same properties consistently.

However, pooling does not automatically guarantee better engine performance. Poorly designed reset logic, changing
object shapes, unnecessary property deletion, or excessive bookkeeping can offset any allocation benefit.

The correct decision should therefore be based on profiling rather than assumptions about garbage collection or object
allocation.

## Typed Arrays and Buffers

Pooling can be particularly useful for large binary allocations.

For example:

```js
class BufferPool {
    #available = [];
    #size;

    constructor(size) {
        this.#size = size;
    }

    acquire() {
        return this.#available.pop() ?? new Uint8Array(this.#size);
    }

    release(buffer) {
        buffer.fill(0);
        this.#available.push(buffer);
    }
}
```

Resetting a binary buffer may itself have a measurable cost. Whether clearing is required depends on the data's
sensitivity and the correctness requirements.

Security-sensitive data should not remain available to another consumer merely because clearing the buffer would reduce
performance.

## Security

Pooling can create cross-client data leakage if state is not completely reset.

Sensitive state can include:

* authentication information,
* authorization decisions,
* user identifiers,
* request metadata,
* cryptographic material,
* credentials,
* private application data.

A pool that crosses security or tenant boundaries therefore requires explicit state sanitization.

Security-sensitive pooling should be treated as a lifecycle and isolation problem, not merely an optimization.

## Testing

Pooling requires tests for both functional behavior and lifecycle correctness.

Important cases include:

* acquiring an empty pool,
* acquiring an existing object,
* releasing an object,
* resetting state,
* maximum capacity,
* pool exhaustion,
* waiting acquisition,
* cancellation,
* duplicate release,
* release of foreign objects,
* creation failure,
* reset failure,
* destruction,
* shutdown,
* resource validation,
* concurrent asynchronous acquisition.

Tests should also verify that state from one client cannot be observed by another client.

## Observability

A production resource pool can expose metrics such as:

* current pool size,
* available objects,
* active objects,
* acquisition count,
* release count,
* creation count,
* destruction count,
* acquisition wait time,
* timeout count,
* exhaustion count,
* reset failures.

These metrics help determine whether the pool is actually providing value and whether capacity is appropriately
configured.

A pool that is constantly exhausted may need greater capacity or different workload management. A pool that retains
large numbers of idle objects may be overprovisioned.

## Common Misuse

A common misuse is pooling every frequently allocated JavaScript object. This can make the program more complicated
while providing no measurable benefit.

Another misuse is using a pool to compensate for an inefficient object design. If initialization is expensive because an
object performs unnecessary work, optimizing that initialization may be preferable to retaining a large collection of
reusable objects.

Another failure mode is treating the pool as a global storage mechanism. A pool should manage reusable resources, not
become a hidden registry of arbitrary objects.

Another common mistake is returning objects to the pool while asynchronous work still references them. The pool then
gives the same object to another client while the previous client is still using it.

## Releasing Too Early

This is especially dangerous with asynchronous code:

```js
const object = await pool.acquire();

pool.release(object);

await useResource(object);
```

The object has been released before the operation has completed. Another client can acquire the same instance and mutate
it concurrently.

The correct lifecycle is:

```js
const object = await pool.acquire();

try {
    await useResource(object);
} finally {
    pool.release(object);
}
```

The object must remain exclusively owned by the client for the complete duration of its logical use.

## Pool Explosion

Introducing a separate pool for every small object type can produce excessive infrastructure.

Multiple pools may introduce:

* configuration complexity,
* duplicated lifecycle logic,
* additional metrics,
* more failure modes,
* memory retention,
* difficult shutdown semantics.

A pool should correspond to a meaningful resource boundary rather than simply to the existence of repeated allocations.

## Pooling and Dependency Injection

Pools are often injected into components rather than created inside them:

```js
class ParserService {
    constructor(contextPool) {
        this.contextPool = contextPool;
    }

    async parse(input) {
        const context = await this.contextPool.acquire();

        try {
            return parseWithContext(input, context);
        } finally {
            this.contextPool.release(context);
        }
    }
}
```

This keeps pooling policy outside the consuming component and allows tests to replace the pool with a simpler
implementation.

The composition root can decide the pool's size, lifecycle, factory, reset policy, and resource configuration.

## Pooling and Factories

A factory is commonly responsible for creating pooled objects.

The distinction is straightforward: the factory answers how an object is created, while the pool answers when an
existing object can be reused and how ownership is transferred.

The two mechanisms complement one another rather than competing.

## Pooling and Prototype-Based Design

JavaScript's prototype system can reduce memory consumption by allowing many instances to share methods.

Object pooling solves a different problem: reuse of the instances themselves.

For example:

```js
class Particle {
    update() {
        // shared through the prototype
    }
}
```

The prototype allows all `Particle` instances to share the `update` method implementation. A pool can separately control
how many `Particle` instances are created and reused.

Prototype sharing and object pooling can therefore be combined.

## Pooling and Composition

A pooled object can itself be composed from multiple reusable components.

However, pooling the outer object does not automatically pool every object it references. Each component has its own
ownership and lifecycle semantics.

Reset behavior must therefore account for the entire object graph that the pool owns.

## Pooling and Resource Ownership

The most important architectural question is often not “How can this object be reused?” but “Who owns this resource
while it is acquired?”

The pool owns an available resource. The client owns the resource while it is acquired. The client returns ownership to
the pool by releasing it.

This ownership model should be explicit because lifecycle bugs frequently arise when multiple components assume they own
the same object.

## Refactoring Toward Object Pool

An object pool can be introduced when profiling or resource constraints identify repeated creation as a meaningful
problem.

A typical refactoring process is:

1. Identify the expensive or constrained object.
2. Define its reusable invariant.
3. Separate creation from acquisition.
4. Define complete reset behavior.
5. Introduce a pool around creation and reuse.
6. Replace direct construction with acquisition.
7. Ensure release occurs in `finally` blocks or an equivalent lifecycle abstraction.
8. Add capacity and destruction policies where necessary.
9. Measure allocation, latency, memory retention, and resource utilization.
10. Remove the pool if measurements show that its complexity does not provide sufficient benefit.

The reset invariant should be established before introducing reuse. Otherwise, the pool can convert an isolated
allocation problem into a state-corruption problem.

## Recognizing an Object Pool Opportunity

An object pool is a candidate when most of the following are true:

* objects are repeatedly created and discarded;
* creation or initialization is expensive;
* objects can be safely reset;
* the number of concurrently active objects is bounded or naturally limited;
* objects have sufficiently similar lifecycles;
* retaining idle objects has an acceptable memory cost;
* profiling demonstrates allocation or initialization pressure;
* resource ownership benefits from explicit acquisition and release.

The pattern is a poor candidate when objects are cheap, short-lived, difficult to reset, rarely reused, or highly
stateful in ways that cannot be reliably restored.

## Benefits

Object pooling can provide:

* reduced repeated initialization;
* bounded resource concurrency;
* reduced allocation pressure in suitable workloads;
* predictable resource reuse;
* explicit lifecycle management;
* reduced setup cost for expensive resources;
* centralized resource validation and destruction;
* improved control over scarce external resources.

For resource pools, the most important benefit may be concurrency control rather than memory or allocation performance.

## Costs

The pattern introduces:

* lifecycle complexity;
* explicit acquisition and release;
* reset requirements;
* retained memory;
* bookkeeping;
* potential pool exhaustion;
* asynchronous waiting and cancellation concerns;
* more complicated shutdown;
* possible state leakage;
* debugging difficulty;
* configuration and capacity tuning.

In JavaScript specifically, the cost-benefit calculation must account for the effectiveness of modern garbage collectors
and the relatively low cost of ordinary object allocation.

## Decision Criteria

Use an Object Pool when the system has a concrete reason to control reusable object or resource instances and the
lifecycle can be defined precisely.

Do not use it merely because repeated allocation appears aesthetically undesirable.

If the primary problem is shared immutable state, consider Flyweight.

If the primary problem is repeated computation, consider Memoization.

If the primary problem is retrieving previously produced values, consider Caching.

If the primary problem is supplying dependencies externally, use Dependency Injection.

If the primary problem is limiting access to a scarce external resource, an Object Pool or Resource Pool may be
appropriate.

If the primary problem is expensive construction but objects are independent and do not need exclusive reuse, consider
whether Prototype, Factory Functions, or a simpler optimized constructor is more appropriate.

## Summary

The Object Pool Pattern manages reusable instances through explicit acquisition, use, reset, and release lifecycle
semantics. Its defining concern is controlled reuse and availability rather than merely avoiding allocation.

JavaScript makes object pooling a more specialized optimization than it is in some lower-level environments because
garbage collection handles many short-lived allocations effectively. The strongest JavaScript use cases are expensive
initialization, large reusable buffers, constrained resources, bounded concurrency, and external resources such as
connections or workers.

The central correctness requirement is lifecycle ownership. A client must exclusively own an acquired object until it
has finished using it, and the object must be restored to a valid reusable state before another client can acquire it.

Object Pool should therefore be introduced only when reuse or resource constraints justify the additional lifecycle
machinery. For ordinary JavaScript objects, profiling should establish that pooling provides a meaningful benefit before
the pattern is adopted.
