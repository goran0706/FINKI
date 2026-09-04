# Object Pool

Object Pool is a creational design pattern that maintains a collection of reusable objects and manages their acquisition
and release so that callers can reuse existing instances instead of repeatedly creating and destroying them.

The pattern is useful when object creation or initialization is sufficiently expensive, object allocation is frequent,
and instances can safely be reset and reused. The pool owns the lifecycle of the pooled resources while clients
temporarily acquire and return them.

Object Pool is fundamentally a lifecycle-management pattern. Its value comes from controlled reuse, not merely from
hiding object construction behind another function.

## Intent

The intent of Object Pool is to improve the efficiency and predictability of repeatedly acquiring expensive or limited
resources by reusing instances.

A pool maintains objects that are temporarily available and provides operations for:

* acquiring an available object
* tracking objects currently in use
* returning objects to the pool
* resetting objects before reuse
* creating additional objects when capacity permits
* rejecting or waiting for acquisition when capacity is exhausted
* disposing of objects when the pool is shut down

The pool therefore owns more than object creation. It owns the lifecycle required to make reuse safe.

## Problem

Repeatedly constructing an expensive object can introduce unnecessary overhead.

For example:

```javascript
class DatabaseConnection {
    constructor(config) {
        // Expensive initialization.
    }

    query(sql) {
        // ...
    }

    close() {
        // Expensive cleanup.
    }
}

async function executeQuery(config, sql) {
    const connection = new DatabaseConnection(config);

    try {
        return await connection.query(sql);
    } finally {
        connection.close();
    }
}
```

If this operation occurs thousands of times, repeatedly establishing and closing connections can be considerably more
expensive than reusing a bounded number of existing connections.

A similar problem occurs with objects that are expensive to initialize, allocate frequently, or represent scarce
resources.

Object Pool moves the ownership of reuse and lifecycle management into a dedicated pool.

## Pool Lifecycle

A pool generally manages several states for each resource:

* available
* acquired
* returned
* reset
* disposed

The exact state model depends on the implementation.

An object must not be handed to one client while another client still owns it. Likewise, an object must not be returned
to the available pool until its previous client has finished using it and its reusable state has been restored.

This lifecycle distinction is central to Object Pool. Simply storing objects in an array and returning them is
insufficient if the objects retain state from previous users.

## Basic Implementation

A simple synchronous pool can be implemented with an array of available objects:

```javascript
class ObjectPool {
    #available = new Set();
    #inUse = new Set();

    constructor(create, reset) {
        this.create = create;
        this.reset = reset;
    }

    acquire() {
        let object;

        if (this.#available.size > 0) {
            object = this.#available.values().next().value;
            this.#available.delete(object);
        } else {
            object = this.create();
        }

        this.#inUse.add(object);

        return object;
    }

    release(object) {
        if (!this.#inUse.has(object)) {
            throw new Error("Object does not belong to this pool");
        }

        this.#inUse.delete(object);
        this.reset(object);
        this.#available.add(object);
    }
}
```

Usage:

```javascript
const pool = new ObjectPool(
    () => new ExpensiveObject(),
    object => object.reset()
);

const object = pool.acquire();

try {
    object.process();
} finally {
    pool.release(object);
}
```

The `finally` block is important. Returning a pooled object is part of the resource lifecycle and must happen even when
the operation fails.

## Factory Responsibility

The pool needs a mechanism for creating objects that do not already exist.

That mechanism can be supplied as a function:

```javascript
const pool = new ObjectPool(
    () => new Worker(),
    worker => worker.reset()
);
```

The pool therefore does not necessarily need to know the concrete class being instantiated.

This separates the pool's lifecycle responsibility from the object's construction mechanism.

Object Pool and Factory are consequently complementary. A factory creates an object; a pool decides whether a new object
needs to be created or whether an existing object can be reused.

## Pool Capacity

A production pool generally needs explicit capacity rules.

For example:

```javascript
class ObjectPool {
    #available = [];
    #inUse = new Set();

    constructor({create, reset, maxSize}) {
        this.create = create;
        this.reset = reset;
        this.maxSize = maxSize;
    }

    acquire() {
        if (this.#available.length > 0) {
            const object = this.#available.pop();

            this.#inUse.add(object);

            return object;
        }

        if (this.#inUse.size < this.maxSize) {
            const object = this.create();

            this.#inUse.add(object);

            return object;
        }

        throw new Error("Pool exhausted");
    }

    release(object) {
        if (!this.#inUse.delete(object)) {
            throw new Error("Object is not currently acquired");
        }

        this.reset(object);
        this.#available.push(object);
    }
}
```

A maximum size prevents unbounded resource creation.

Without a capacity limit, a pool can simply become a lazy object factory that retains objects indefinitely.

## Minimum Capacity

A pool can optionally maintain a minimum number of ready objects:

```javascript
class ObjectPool {
    #available = [];

    constructor({create, reset, minSize = 0}) {
        this.create = create;
        this.reset = reset;

        for (let i = 0; i < minSize; i++) {
            this.#available.push(this.create());
        }
    }
}
```

Preallocation can reduce acquisition latency when object initialization is expensive.

However, preallocating resources also consumes memory or external capacity before those resources are actually required.

Minimum and maximum pool sizes should therefore reflect actual workload characteristics rather than arbitrary numbers.

## Resetting Pooled Objects

Resetting is one of the most important responsibilities of an Object Pool.

Suppose a reusable object contains state:

```javascript
class Worker {
    constructor() {
        this.tasks = [];
        this.metadata = {};
        this.status = "idle";
    }

    process(task) {
        this.tasks.push(task);
        this.status = "working";
    }

    reset() {
        this.tasks = [];
        this.metadata = {};
        this.status = "idle";
    }
}
```

The pool must reset the object before making it available to another caller:

```javascript
release(worker)
{
    if (!this.#inUse.delete(worker)) {
        throw new Error("Worker is not acquired");
    }

    worker.reset();
    this.#available.push(worker);
}
```

Without reset semantics, state from one use can leak into another use.

This can cause correctness problems rather than merely performance problems.

## Reset Semantics

Resetting must restore every piece of state that can affect subsequent users.

This can include:

* mutable properties
* buffers
* collections
* temporary metadata
* authentication state
* request-specific configuration
* error state
* event handlers
* subscriptions
* timers
* callbacks
* external resource associations

The exact reset operation depends on the object's lifecycle.

A pool is unsafe if it assumes an object is reusable while leaving externally observable state attached to it.

## Resource Pooling

Object Pool is frequently used for objects that represent resources rather than ordinary application objects.

Examples include:

* database connections
* network connections
* worker instances
* parser instances
* rendering resources
* reusable buffers
* execution contexts
* file handles
* client sessions

In these cases, the pool controls access to a finite set of resources.

The distinction matters because pooling a scarce external resource can provide capacity control in addition to reducing
construction overhead.

## Database Connection Pools

A database connection pool is a common real-world application of the pattern.

Conceptually:

```javascript
const connection = await pool.acquire();

try {
    return await connection.query(sql);
} finally {
    pool.release(connection);
}
```

The connection is not owned permanently by the caller. The caller temporarily leases it.

The pool can enforce a maximum number of concurrent connections:

```javascript
const pool = new ConnectionPool({
    maxSize: 20
});
```

If all connections are occupied, a production implementation may wait for an existing connection to become available
rather than immediately throwing.

The pool therefore acts as both a reuse mechanism and a concurrency boundary.

## Asynchronous Acquisition

JavaScript applications often need asynchronous acquisition because resources may be initialized asynchronously or
because callers may need to wait for capacity.

```javascript
class AsyncPool {
    #available = [];
    #inUse = new Set();
    #waiters = [];

    constructor({create, reset, maxSize}) {
        this.create = create;
        this.reset = reset;
        this.maxSize = maxSize;
    }

    async acquire() {
        if (this.#available.length > 0) {
            const object = this.#available.pop();

            this.#inUse.add(object);

            return object;
        }

        if (this.#inUse.size < this.maxSize) {
            const object = await this.create();

            this.#inUse.add(object);

            return object;
        }

        return new Promise(resolve => {
            this.#waiters.push(resolve);
        });
    }

    async release(object) {
        if (!this.#inUse.delete(object)) {
            throw new Error("Object is not acquired");
        }

        await this.reset(object);

        const waiter = this.#waiters.shift();

        if (waiter) {
            this.#inUse.add(object);
            waiter(object);
            return;
        }

        this.#available.push(object);
    }
}
```

The important concept is that an exhausted pool can suspend acquisition until a resource is released.

Production implementations need additional handling for cancellation, timeouts, initialization failures, shutdown, and
abandoned acquisitions.

## Acquisition Timeouts

Waiting indefinitely for a resource can cause requests to remain pending indefinitely.

A pool can therefore impose an acquisition timeout:

```javascript
async function acquireWithTimeout(pool, timeout) {
    return Promise.race([
        pool.acquire(),
        new Promise((_, reject) => {
            setTimeout(() => {
                reject(new Error("Pool acquisition timed out"));
            }, timeout);
        })
    ]);
}
```

A production implementation should ensure that the timeout mechanism is cleaned up when acquisition succeeds.

Timeout behavior should also be part of the pool's documented contract because it affects application-level failure
handling.

## Lease-Based APIs

A useful API design is to represent acquisition as a temporary lease.

Instead of requiring callers to manually coordinate acquisition and release:

```javascript
const object = await pool.acquire();

try {
    await use(object);
} finally {
    await pool.release(object);
}
```

the pool can provide a scoped operation:

```javascript
await pool.use(async object => {
    await object.process();
});
```

The pool controls the release operation:

```javascript
class Pool {
    async use(callback) {
        const object = await this.acquire();

        try {
            return await callback(object);
        } finally {
            await this.release(object);
        }
    }
}
```

This API reduces the risk of resource leaks because release is structurally associated with acquisition.

## Resource Leaks

A pooled object that is acquired but never released remains unavailable.

```javascript
const connection = await pool.acquire();

await connection.query(sql);

// Missing release.
```

After enough leaked acquisitions, the pool becomes exhausted even though the underlying resources still exist.

This is one of the primary failure modes of pooling.

The API should therefore make correct lifecycle management easy and incorrect lifecycle management difficult.

## Double Release

The opposite problem is releasing the same object more than once:

```javascript
pool.release(connection);
pool.release(connection);
```

A robust pool should detect this:

```javascript
release(object)
{
    if (!this.#inUse.delete(object)) {
        throw new Error("Object is not currently acquired");
    }

    this.reset(object);
    this.#available.push(object);
}
```

Without ownership tracking, the same object could appear multiple times in the available collection, allowing multiple
clients to acquire the same instance simultaneously.

## Foreign Objects

A pool should generally reject objects that do not belong to it.

```javascript
const objectFromAnotherPool = otherPool.acquire();

pool.release(objectFromAnotherPool);
```

This should fail rather than silently adding the object to the pool.

Ownership tracking prevents accidental cross-pool contamination.

## Pool Shutdown

A production pool needs an explicit shutdown lifecycle.

```javascript
async function shutdown(pool) {
    await pool.close();
}
```

Shutdown may need to:

* prevent new acquisitions
* wait for active users
* reject pending acquisitions
* close available resources
* close resources after they are released
* release external handles
* clear internal collections

A pool that cannot be shut down cleanly can keep resources alive beyond the lifetime of the application component that
created it.

## Pool Shutdown State

A pool can explicitly track whether it is active:

```javascript
class Pool {
    #closed = false;

    acquire() {
        if (this.#closed) {
            throw new Error("Pool is closed");
        }

        // ...
    }

    async close() {
        if (this.#closed) {
            return;
        }

        this.#closed = true;

        // Dispose available resources.
    }
}
```

Once closed, new acquisitions should generally be rejected.

Whether active resources are allowed to complete depends on the shutdown policy.

## Disposal

Pooled resources may require explicit cleanup:

```javascript
class ResourcePool {
    constructor({create, reset, destroy}) {
        this.create = create;
        this.reset = reset;
        this.destroy = destroy;
    }
}
```

The `destroy` operation becomes important when a resource is invalid, expired, or no longer needed.

For example:

```javascript
async
release(resource)
{
    if (!this.#inUse.delete(resource)) {
        throw new Error("Resource is not acquired");
    }

    if (resource.isBroken()) {
        await this.destroy(resource);
        return;
    }

    await this.reset(resource);
    this.#available.push(resource);
}
```

A resource that cannot safely be reset must not be returned to the available pool.

## Validation Before Reuse

Some resources can become invalid while they are idle.

A pool can validate a resource before returning it:

```javascript
async
acquire()
{
    while (this.#available.length > 0) {
        const resource = this.#available.pop();

        if (await this.validate(resource)) {
            this.#inUse.add(resource);
            return resource;
        }

        await this.destroy(resource);
    }

    return this.createResource();
}
```

This is particularly relevant for network connections, database connections, and other resources whose validity depends
on external systems.

## Pool Eviction

A pool may remove resources that have remained idle too long.

For example, a pool can track acquisition and release timestamps:

```javascript
{
    resource,
        lastUsedAt
}
```

Idle resources can then be destroyed after a configured lifetime.

Eviction prevents a pool from permanently retaining resources that are no longer useful.

This is a lifecycle policy rather than a defining requirement of Object Pool.

## Pool Sizing

Pool size should generally be derived from resource constraints and workload characteristics.

An excessively small pool causes callers to wait unnecessarily.

An excessively large pool can consume excessive memory, increase contention, exhaust external resources, or reduce
overall throughput.

For external resources such as database connections, the appropriate pool size may also be constrained by server-side
connection limits.

The pool therefore acts as a concurrency-control mechanism, not merely an allocation optimization.

## Object Pool and Caching

Object Pool and caching both retain objects for future use, but they have fundamentally different ownership semantics.

A cache retains an object so that the same object or value can be retrieved later based on a key or lookup condition.

A pool retains interchangeable reusable resources that are temporarily leased to callers.

For example:

```javascript
cache.get(userId);
```

is cache semantics.

```javascript
const connection = await pool.acquire();
```

is pool semantics.

A cached object is normally identified by its value or key. A pooled object is normally identified by its availability
and lifecycle state.

## Object Pool and Singleton

Singleton ensures that access to a particular object is centralized around one instance.

Object Pool intentionally manages multiple reusable instances.

A pool can contain one object, but that does not make the design conceptually equivalent to Singleton. The pool's
defining responsibility is controlled acquisition and release.

## Object Pool and Factory

A factory answers the question of which object should be created and how it should be constructed.

A pool answers whether a new object needs to be created or an existing object can be reused.

For example:

```javascript
const pool = new ObjectPool({
    create: () => new Worker(),
    reset: worker => worker.reset()
});
```

The factory function creates the resource when necessary. The pool controls its lifecycle afterward.

## Object Pool and Prototype

Prototype creates new objects by copying an existing object.

Object Pool avoids creating a new object by reusing an existing instance.

Prototype is therefore appropriate when cloning is the desired creation mechanism.

Object Pool is appropriate when instances can safely be reused across independent operations.

## Object Pool and Builder

Builder assembles a new product through a construction process.

Object Pool manages existing products for reuse.

A system can use both:

```javascript
const worker = await workerPool.acquire();

try {
    const task = new TaskBuilder()
        .setPayload(payload)
        .setPriority(priority)
        .build();

    await worker.execute(task);
} finally {
    await workerPool.release(worker);
}
```

The Builder constructs the task. The pool manages the worker lifecycle.

## Object Pool and Dependency Injection

Dependency injection determines how dependencies are supplied to a component.

Object Pool determines how a reusable resource is acquired and released.

A pool can itself be injected:

```javascript
class ReportService {
    constructor(connectionPool) {
        this.connectionPool = connectionPool;
    }

    async generate() {
        return this.connectionPool.use(async connection => {
            return connection.query("SELECT ...");
        });
    }
}
```

This keeps resource-management infrastructure outside the service while giving the service access to the pool
abstraction.

## Object Pool and Concurrency

Pooling becomes particularly valuable when the resource is bounded.

For example, a pool with a maximum size of ten can ensure that no more than ten instances are simultaneously acquired.

This creates a concurrency boundary:

```javascript
const pool = new WorkerPool({
    maxSize: 10
});
```

When all ten workers are occupied, additional callers must either wait, fail, or be rejected according to the pool's
policy.

This behavior can protect downstream systems from uncontrolled concurrency.

## Pool Fairness

An asynchronous pool with waiting callers needs a policy for deciding which caller receives the next released resource.

A common policy is FIFO:

```javascript
const waiters = [];
```

The oldest waiter is resolved first:

```javascript
const waiter = waiters.shift();
```

Other policies are possible, but fairness should be intentional.

Without a defined policy, callers may experience starvation or unpredictable latency.

## Cancellation

Waiting for a pooled resource can outlive the request that initiated the acquisition.

For example, an HTTP request may be cancelled while waiting for a database connection.

A production pool should therefore consider cancellation mechanisms such as `AbortSignal`.

Conceptually:

```javascript
await pool.acquire({
    signal: request.signal
});
```

If the acquisition is cancelled, the waiting request should be removed from the queue and its resource should never be
assigned to the cancelled caller.

Cancellation is especially important in high-concurrency asynchronous systems.

## Error Handling

Pool operations can fail at several stages:

* resource creation
* resource validation
* resource reset
* resource destruction
* acquisition timeout
* acquisition cancellation
* pool shutdown

These failures should not leave the pool in an inconsistent state.

For example, if resetting fails:

```javascript
async
release(resource)
{
    if (!this.#inUse.delete(resource)) {
        throw new Error("Resource is not acquired");
    }

    try {
        await this.reset(resource);
        this.#available.push(resource);
    } catch (error) {
        await this.destroy(resource);
        throw error;
    }
}
```

A resource that fails reset should normally be discarded rather than returned to the pool.

## State Contamination

State contamination is one of the most serious risks of object reuse.

Consider:

```javascript
class RequestContext {
    constructor() {
        this.user = null;
        this.headers = {};
        this.permissions = [];
    }
}
```

If one request sets:

```javascript
context.user = authenticatedUser;
context.permissions = ["admin"];
```

and the context is returned without complete reset, another request may inherit the previous request's state.

Pooling therefore requires stronger lifecycle discipline than ordinary allocation.

Objects that contain request-specific, security-sensitive, or externally observable state require particularly careful
reset and validation semantics.

## Object Identity

Pooling preserves object identity across separate uses.

```javascript
const first = pool.acquire();
pool.release(first);

const second = pool.acquire();

console.log(first === second);
```

This may be `true`.

Clients must therefore treat a pooled object as a temporary lease rather than assuming that each acquisition produces a
new identity.

Code that depends on object identity being unique per operation is generally incompatible with pooling unless identity
is explicitly managed separately.

## Thread and Execution Safety

A pooled object must not be concurrently used by multiple consumers unless the object is explicitly designed for
concurrent use.

The typical pooling model assumes exclusive ownership during an acquisition:

```javascript
const resource = await pool.acquire();

try {
    await use(resource);
} finally {
    await pool.release(resource);
}
```

This exclusive ownership is what makes mutable reusable objects practical.

In environments with multiple workers, threads, or processes, the pool's ownership model must account for the execution
boundary. A JavaScript object cannot simply be shared across isolated execution contexts unless the runtime provides an
appropriate sharing mechanism.

## When Object Pool Is Appropriate

Object Pool is a strong candidate when:

* object creation is expensive
* initialization is expensive
* resources are scarce
* objects are acquired and released frequently
* instances are interchangeable
* instances can be safely reset
* concurrent usage needs to be bounded
* resource lifetime needs centralized management

Typical examples include connection pools, worker pools, reusable parser instances, and other bounded resources.

## When Object Pool Is Unnecessary

Object Pool is usually unnecessary when object creation is cheap.

For example:

```javascript
const point = {
    x,
    y
};
```

There is generally no benefit in maintaining a pool of ordinary short-lived value objects.

Modern garbage-collected runtimes are designed to make ordinary object allocation practical. Avoiding every allocation
is not a sufficient reason to introduce pooling.

Pooling should be justified by measured allocation cost, resource constraints, initialization cost, latency
requirements, or concurrency requirements.

## Performance Considerations

Object Pool can improve performance by reducing:

* expensive initialization
* external connection setup
* repeated resource allocation
* garbage-generation pressure
* allocation latency

However, pooling introduces its own costs:

* lifecycle bookkeeping
* reset operations
* synchronization
* waiting queues
* validation
* memory retention
* increased implementation complexity

For ordinary JavaScript objects, these costs can outweigh the benefits.

Performance claims should therefore be validated with profiling and representative workloads rather than assumed from
the existence of allocations alone.

## Garbage Collection Considerations

A pool intentionally retains objects that would otherwise become unreachable.

This means pooling can increase memory usage.

For example:

```javascript
const pool = [];

for (let i = 0; i < 10000; i++) {
    pool.push(new LargeObject());
}
```

Those objects remain strongly reachable through the pool.

A pool that is too large can therefore prevent garbage collection from reclaiming memory that is no longer needed.

This is particularly important for large buffers, complex object graphs, and objects retaining external resources.

## Memory Retention

A pooled object may retain references to large structures from its previous use.

For example:

```javascript
worker.payload = hugePayload;
```

If `reset()` does not clear the reference:

```javascript
reset()
{
    this.status = "idle";
}
```

the large payload remains reachable through the pooled worker.

A correct reset operation should therefore release references that are no longer required:

```javascript
reset()
{
    this.payload = null;
    this.status = "idle";
}
```

Pooling requires explicit attention to memory ownership because retained instances have longer lifetimes than ordinary
temporary objects.

## Pool Metrics

A production pool should often expose operational metrics such as:

* current pool size
* available resources
* active resources
* pending acquisitions
* acquisition latency
* creation count
* destruction count
* timeout count
* acquisition failures
* reset failures

These metrics make pool behavior observable.

Without metrics, pool exhaustion can appear as an unexplained application latency problem.

## Testing

Pool implementations should test lifecycle invariants rather than only successful acquisition.

Important cases include:

```javascript
const object = await pool.acquire();

expect(pool.activeCount).toBe(1);

await pool.release(object);

expect(pool.activeCount).toBe(0);
```

Tests should also cover:

* pool exhaustion
* waiting callers
* acquisition timeouts
* cancellation
* double release
* foreign resources
* resource creation failure
* reset failure
* resource destruction
* shutdown
* resource validation
* maximum capacity
* minimum capacity
* state reset
* concurrent acquisitions

A particularly important test is verifying that a resource returned after one use is clean when acquired again.

## Refactoring Toward Object Pool

A typical refactoring starts with repeated creation of an expensive resource:

```javascript
async function process(data) {
    const worker = await createWorker();

    try {
        return await worker.process(data);
    } finally {
        await worker.destroy();
    }
}
```

If profiling and resource characteristics show that workers are expensive to create and can safely be reused, a pool can
replace per-operation creation:

```javascript
async function process(data) {
    return workerPool.use(async worker => {
        return worker.process(data);
    });
}
```

The pool then becomes responsible for creation, reuse, reset, validation, and destruction.

The refactoring should not begin with the pool itself. First establish that the resource is reusable and that its
lifecycle can be made safe.

## Refactoring Away from Object Pool

Pooling should be removed when the underlying reason for reuse disappears.

For example, if a resource becomes cheap to create and ordinary allocation performs adequately:

```javascript
const object = new Worker();
```

may be preferable to:

```javascript
const object = await workerPool.acquire();
```

Removing the pool eliminates lifecycle bookkeeping, reset logic, capacity management, and potential contention.

A pool should also be reconsidered when resources cannot be reliably reset or when pooled state creates more correctness
risk than performance benefit.

## Common Misuse

A common misuse is pooling ordinary objects solely to reduce garbage collection.

Modern JavaScript engines optimize object allocation and garbage collection extensively. A manually managed pool can
introduce more overhead than it removes.

Another misuse is pooling objects that are not actually interchangeable. If each object carries unique state or identity
that must persist across operations, pooling can violate the object's semantics.

Pooling is also inappropriate when objects cannot be completely reset.

A further misuse is treating a pool as an unlimited cache. A pool should have explicit ownership, acquisition, release,
and capacity semantics.

## Security Considerations

Pooled resources can retain security-sensitive state.

Examples include:

* authentication information
* authorization context
* user identifiers
* request headers
* credentials
* encryption state
* tenant information

A reset operation must remove all state that must not cross ownership boundaries.

For example:

```javascript
reset()
{
    this.user = null;
    this.authorization = null;
    this.headers = {};
    this.tenant = null;
}
```

Security-sensitive pooling should be treated as a lifecycle boundary, not merely as a performance optimization.

## Architectural Considerations

Object Pool is most appropriate at boundaries where resource ownership and capacity need to be centralized.

A database connection pool can protect the database from excessive concurrent connections.

A worker pool can limit concurrent execution.

A network client pool can reuse expensive connections.

A reusable parser pool can reduce repeated initialization when parser instances are genuinely expensive.

The pool should remain responsible for resource lifecycle. Application services should generally acquire a resource, use
it, and release it without needing to understand how the pool creates, validates, resets, or destroys individual
instances.

## Decision Criteria

| Situation                                    | Object Pool suitability |
|----------------------------------------------|-------------------------|
| Object creation is cheap                     | Usually unnecessary     |
| Object initialization is expensive           | Potentially strong fit  |
| External resource is scarce                  | Strong fit              |
| Resources must be concurrency-bounded        | Strong fit              |
| Objects are safely reusable                  | Required                |
| Objects cannot be fully reset                | Poor fit                |
| Object identity must be unique per operation | Poor fit                |
| Need lookup by key                           | Prefer Cache            |
| Need to select which class to create         | Prefer Factory          |
| Need incremental construction                | Prefer Builder          |
| Need one globally shared instance            | Consider Singleton      |
| Need to clone existing objects               | Prefer Prototype        |
| Performance benefit has not been measured    | Do not introduce yet    |

## Benefits

Object Pool reduces repeated construction and initialization, supports controlled resource reuse, bounds concurrency,
centralizes resource lifecycle, and can reduce pressure on expensive external systems.

It is particularly valuable when the pooled object represents a finite or expensive resource rather than an ordinary
lightweight object.

## Costs

Object Pool introduces lifecycle complexity, mutable state management, reset requirements, capacity policies, waiting
behavior, error handling, and additional memory retention.

Incorrect pooling can cause state leakage, resource leaks, double releases, stale resources, memory retention, or
concurrency bugs.

The pattern can also reduce performance rather than improve it when used for cheap objects because pool bookkeeping can
cost more than ordinary allocation and garbage collection.

## Summary

Object Pool maintains a collection of reusable objects and provides controlled acquisition and release of those objects.

Its defining concern is lifecycle management and reuse. A factory can create pooled objects, but the pool determines
when creation is necessary and controls how resources are acquired, reset, validated, returned, and destroyed.

The pattern is most appropriate for expensive or scarce resources that are safely reusable and can be reliably reset.
Common examples include database connections, network connections, worker instances, and other bounded resources.

Object Pool should not be introduced merely to avoid JavaScript object allocation. For ordinary short-lived objects,
normal allocation and garbage collection are usually simpler and often sufficiently efficient.

The central question is whether the resource has a meaningful reuse lifecycle and whether controlling its availability
provides measurable value. If the answer is no, ordinary object creation is usually the better design.
