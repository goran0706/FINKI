# Caching Strategies

Caching is the technique of retaining previously obtained or computed data so that subsequent accesses can be served
without repeating the original operation. A cache trades storage and invalidation complexity for lower latency, reduced
computation, reduced network traffic, or reduced load on an underlying resource.

In JavaScript systems, caching can occur at many levels. The runtime may cache parsed or compiled code, the module
system caches evaluated modules, browsers cache HTTP responses, service workers can implement application-specific
caches, libraries can cache computed values, and application code can retain objects or data structures in memory. These
mechanisms have different ownership, consistency, lifetime, and invalidation semantics and should not be treated as one
interchangeable cache.

Caching is fundamentally a correctness concern as well as a performance concern. A cached value is useful only when
returning it instead of obtaining a fresh value is semantically acceptable. The central design problem is therefore not
merely how to store a value, but under what conditions that value remains valid.

## Intent

The intent of caching is to avoid repeating expensive work or repeatedly accessing a slower underlying resource when a
previously obtained result can safely be reused.

A cache may reduce latency, network bandwidth, CPU consumption, database load, disk I/O, external API usage, or object
allocation. It can also improve availability by allowing previously obtained data to remain usable when the underlying
resource is temporarily unavailable, provided that stale data is acceptable for the application.

Caching should be introduced around a clearly defined resource or computation with known reuse characteristics. A cache
without an explicit validity model can turn an optimization into a source of stale data, memory retention, inconsistent
behavior, or difficult-to-reproduce bugs.

## Cache Lookup

The fundamental cache operation consists of looking for an existing value before performing the underlying operation.

```js
const cache = new Map();

async function getUser(id) {
    if (cache.has(id)) {
        return cache.get(id);
    }

    const user = await fetchUser(id);

    cache.set(id, user);

    return user;
}
```

The cache key identifies the request or computation for which the value is valid. The key is therefore part of the
correctness model.

If two requests produce different results but are represented by the same key, the cache can return an incorrect value.
Conversely, if equivalent requests produce different keys, the cache may fail to reuse available values.

## Cache Keys

A cache key must represent every input that materially affects the cached result.

```js
const cache = new Map();

async function getProduct(id, locale) {
    const key = `${id}:${locale}`;

    if (cache.has(key)) {
        return cache.get(key);
    }

    const product = await fetchProduct(id, locale);

    cache.set(key, product);

    return product;
}
```

The locale is part of the key because it affects the returned representation.

Keys can be strings, numbers, symbols, object identities, tuples represented by nested maps, or serialized
representations.

Using objects directly as keys has identity semantics:

```js
const cache = new Map();

const requestA = {id: 42};
const requestB = {id: 42};

cache.set(requestA, "result");

console.log(cache.get(requestB));
```

The second lookup does not retrieve the first value because `requestA` and `requestB` are different object identities.

When structural equality is required, the application must construct an appropriate canonical key rather than assuming
`Map` performs deep equality.

## Map-Based Caches

`Map` is a common in-memory cache structure.

```js
const cache = new Map();

cache.set("user:42", {
    id: 42,
    name: "Ada"
});

const user = cache.get("user:42");
```

`Map` provides explicit cache semantics without modifying `Object.prototype` or treating arbitrary objects as
dictionaries.

A cache should normally distinguish a missing entry from a cached value that happens to be `undefined`.

```js
if (cache.has(key)) {
    return cache.get(key);
}
```

Using only `cache.get(key) === undefined` can be incorrect when `undefined` is itself a valid cached value.

## Cache-Aside

Cache-Aside, also called Lazy Loading caching, lets application code explicitly check the cache and retrieve the
underlying value when necessary.

```js
async function getUser(id) {
    const cached = cache.get(id);

    if (cached !== undefined) {
        return cached;
    }

    const user = await repository.findById(id);

    cache.set(id, user);

    return user;
}
```

The application controls when the cache is consulted and populated.

This strategy is simple and flexible, but every consumer must follow the caching policy correctly. If different
consumers implement different lookup, expiration, or invalidation rules, the cache can become inconsistent.

## Read-Through

A read-through cache encapsulates the underlying data source behind the cache abstraction.

```js
class CachedRepository {
    constructor(repository) {
        this.repository = repository;
        this.cache = new Map();
    }

    async findById(id) {
        if (this.cache.has(id)) {
            return this.cache.get(id);
        }

        const value = await this.repository.findById(id);

        this.cache.set(id, value);

        return value;
    }
}
```

Consumers call the cache-backed repository without directly implementing the lookup logic.

This can centralize cache policy, but the abstraction must still define expiration, invalidation, failure handling, and
ownership.

## Write-Through

Write-Through caching updates the cache as part of a write operation.

```js
async function saveUser(user) {
    const saved = await repository.save(user);

    cache.set(user.id, saved);

    return saved;
}
```

The cache is populated or updated when the underlying data is successfully written.

This can make subsequent reads consistent with the successful write, but it requires careful handling when the write and
cache update do not share a transaction.

## Write-Behind

Write-Behind, or Write-Back, allows a cache to accept writes and persist them to the underlying system later.

```js
function updateUser(user) {
    cache.set(user.id, user);

    queuePersistence(user);
}
```

This can reduce write latency and combine multiple updates, but it introduces substantially stronger durability and
consistency requirements.

The application must determine what happens if the process crashes before persistence, if the persistence queue fails,
or if another process reads the underlying store before the cached write has been persisted.

Write-Behind should therefore be treated as a durability architecture rather than merely a performance optimization.

## Refresh-Ahead

Refresh-Ahead proactively refreshes values before they are expected to expire.

```js
async function refresh(key, loader) {
    const value = await loader();

    cache.set(key, {
        value,
        expiresAt: Date.now() + 60_000
    });

    return value;
}
```

A system can refresh frequently accessed entries before expiration so that users rarely encounter the underlying loading
latency.

Refresh-Ahead can reduce latency but consumes resources even when the value is no longer requested. It is most
appropriate when future demand can be predicted and stale data has a bounded lifetime.

## Memoization

Memoization caches function results based on input arguments.

```js
function memoize(fn) {
    const cache = new Map();

    return function (...args) {
        const key = JSON.stringify(args);

        if (cache.has(key)) {
            return cache.get(key);
        }

        const result = fn(...args);

        cache.set(key, result);

        return result;
    };
}
```

Memoization is a specific form of caching focused on deterministic or sufficiently stable computations.

The cache key must correctly represent the function's relevant inputs. `JSON.stringify()` is only appropriate for inputs
where its serialization semantics match the desired equality semantics.

Memoization is especially effective for expensive, repeated, referentially stable computations. It can be harmful for
functions with low reuse, high-cardinality inputs, side effects, or results that consume substantial memory.

## Promise Caching

Asynchronous operations can be cached by retaining the promise representing an in-progress operation.

```js
const cache = new Map();

function loadUser(id) {
    if (cache.has(id)) {
        return cache.get(id);
    }

    const promise = fetchUser(id);

    cache.set(id, promise);

    return promise;
}
```

Concurrent callers requesting the same resource can therefore share one underlying operation.

This prevents a cache stampede caused by multiple callers observing a miss simultaneously.

Promise caching requires explicit rejection policy. A rejected promise may represent a transient failure and should not
necessarily remain cached indefinitely.

```js
function loadUser(id) {
    if (cache.has(id)) {
        return cache.get(id);
    }

    const promise = fetchUser(id).catch(error => {
        cache.delete(id);
        throw error;
    });

    cache.set(id, promise);

    return promise;
}
```

The failed operation is removed so a later request can retry.

## TTL

Time-to-Live limits how long an entry is considered valid.

```js
const cache = new Map();

function set(key, value, ttl) {
    cache.set(key, {
        value,
        expiresAt: Date.now() + ttl
    });
}

function get(key) {
    const entry = cache.get(key);

    if (!entry) {
        return undefined;
    }

    if (entry.expiresAt <= Date.now()) {
        cache.delete(key);
        return undefined;
    }

    return entry.value;
}
```

TTL is useful when freshness can be expressed as a maximum age.

TTL does not guarantee that a value is correct until expiration or incorrect after expiration. It merely defines a
time-based validity policy.

The appropriate duration depends on the semantics of the data. A configuration value may tolerate minutes of staleness,
while account balances or authorization information may require substantially stronger consistency.

## Stale-While-Revalidate

Stale-While-Revalidate allows a stale value to be returned while a background refresh obtains a newer value.

```js
async function get(key, loader) {
    const entry = cache.get(key);

    if (entry && entry.expiresAt > Date.now()) {
        return entry.value;
    }

    if (entry) {
        refresh(key, loader);
        return entry.value;
    }

    return refresh(key, loader);
}

async function refresh(key, loader) {
    const value = await loader();

    cache.set(key, {
        value,
        expiresAt: Date.now() + 60_000
    });

    return value;
}
```

This strategy prioritizes latency while accepting bounded staleness.

The implementation must prevent multiple callers from independently triggering the same refresh operation. Promise
sharing or another refresh-coordination mechanism is usually required.

## LRU

A Least Recently Used cache evicts entries that have not been accessed recently.

```js
class LruCache {
    #entries = new Map();

    constructor(limit) {
        this.limit = limit;
    }

    get(key) {
        if (!this.#entries.has(key)) {
            return undefined;
        }

        const value = this.#entries.get(key);

        this.#entries.delete(key);
        this.#entries.set(key, value);

        return value;
    }

    set(key, value) {
        if (this.#entries.has(key)) {
            this.#entries.delete(key);
        }

        this.#entries.set(key, value);

        if (this.#entries.size > this.limit) {
            const oldestKey = this.#entries.keys().next().value;
            this.#entries.delete(oldestKey);
        }
    }
}
```

`Map` preserves insertion order, which makes it suitable for implementing a simple LRU policy.

LRU is useful when memory is bounded and recent accesses are a good predictor of future accesses.

Other eviction policies include FIFO, LFU, MRU, random eviction, size-based eviction, and application-specific policies.
The correct policy depends on the workload rather than on a universal rule.

## Size-Based Eviction

Entry count is not always a meaningful measure of cache cost.

One object may occupy a few bytes while another may contain a large graph of strings, arrays, or nested objects.

A cache can therefore track approximate entry size:

```js
function set(key, value, size) {
    cache.set(key, {
        value,
        size
    });

    enforceCapacity();
}
```

Exact JavaScript object memory consumption is difficult to calculate reliably from application code, so size-based
policies often use application-specific estimates.

For large binary data, explicit byte sizes are usually easier to reason about than object counts.

## WeakMap Caching

`WeakMap` can associate cached data with object keys without preventing those keys from being garbage collected.

```js
const cache = new WeakMap();

function getMetadata(object) {
    if (cache.has(object)) {
        return cache.get(object);
    }

    const metadata = computeMetadata(object);

    cache.set(object, metadata);

    return metadata;
}
```

When the object becomes otherwise unreachable, its `WeakMap` entry can become collectible.

This is useful for metadata associated with object identity.

`WeakMap` is not a general-purpose replacement for `Map`. It only supports object and non-registered-symbol keys, does
not provide iteration, and does not provide deterministic cache eviction.

## Weak References

`WeakRef` can represent a non-owning reference to an object.

```js
const reference = new WeakRef(object);

const cached = reference.deref();

if (cached) {
    use(cached);
}
```

Weak references can support memory-sensitive caches, but they introduce nondeterministic behavior because garbage
collection timing is not controlled by application code.

A cache should not rely on a weak reference remaining available for correctness. Weak references are appropriate only
when recomputation or reloading is an acceptable response to collection.

## HTTP Caching

Browser and intermediary HTTP caches provide another caching layer.

HTTP caching is controlled through response metadata such as `Cache-Control`, validators, and related HTTP semantics.

For example, a server can communicate a freshness policy:

```http
Cache-Control: public, max-age=3600
```

The browser can then reuse the response according to that policy without the JavaScript application maintaining its own
copy.

Application-level caches should not automatically duplicate browser caching. Before introducing another cache, determine
whether an existing HTTP or platform cache already provides the required behavior.

## ETag and Conditional Requests

HTTP validators can allow a client to determine whether a cached representation remains current without transferring the
complete resource again.

A response can provide an entity tag:

```http
ETag: "product-42-v7"
```

The client can later send:

```http
If-None-Match: "product-42-v7"
```

The server can respond that the cached representation remains valid, avoiding transfer of the complete representation.

This is different from an application-level cache because the HTTP protocol itself participates in the freshness
decision.

## Browser Storage

JavaScript applications can persist cached data using browser storage mechanisms such as IndexedDB.

IndexedDB is appropriate for larger structured datasets that should survive page reloads or browser sessions.

```js
const request = indexedDB.open("app-cache", 1);

request.onupgradeneeded = () => {
    const database = request.result;

    database.createObjectStore("responses");
};
```

Persistent browser caching introduces serialization, schema evolution, quota, eviction, migration, and corruption
concerns that do not exist for a simple in-memory `Map`.

Persistent cache entries should therefore have an explicit versioning and invalidation strategy.

## Service Worker Caching

Service workers can intercept network requests and implement cache policies at the resource-delivery layer.

```js
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(cached => {
      return cached ?? fetch(event.request);
    })
  );
});
```

Service-worker caches are particularly useful for offline-capable applications and controlled network caching.

The cache lifecycle is independent of ordinary JavaScript object lifetimes. Updating application code does not
automatically invalidate every previously cached resource.

Versioning and cache cleanup therefore need to be part of service-worker deployment.

## Cache Invalidation

Cache invalidation determines when a cached value must no longer be used.

Common strategies include expiration, explicit invalidation after writes, versioned keys, generation numbers,
event-driven invalidation, dependency-based invalidation, and complete cache replacement.

Explicit invalidation can be straightforward:

```js
async function updateUser(user) {
    const updated = await repository.update(user);

    cache.delete(user.id);

    return updated;
}
```

A more sophisticated implementation can replace the cached value immediately:

```js
async function updateUser(user) {
    const updated = await repository.update(user);

    cache.set(user.id, updated);

    return updated;
}
```

The correct strategy depends on whether the cache can safely observe every mutation.

## Invalidation Across Processes

An in-memory cache exists only inside one JavaScript process or execution context.

If multiple server processes maintain independent caches, updating one process does not automatically invalidate another
process's cache.

Distributed invalidation can use mechanisms such as a shared cache, message broker, database notifications, version
numbers, or short TTLs.

The architectural requirement is to define the consistency boundary explicitly. A local cache should not be expected to
provide global consistency.

## Versioned Keys

Versioning can make invalidation implicit.

```js
const cacheKey = `products:v3:${productId}`;
```

Changing the version causes the application to address a new namespace without needing to enumerate and delete every old
entry.

This is particularly useful for static assets, serialized application data, and schema-dependent cached representations.

Old entries may still occupy storage, however, so version changes may need to be combined with explicit cleanup or
expiration.

## Cache Stampede

A cache stampede occurs when many callers simultaneously encounter an expired or missing value and all attempt to
regenerate it.

```js
async function getData(key) {
  const cached = cache.get(key);

  if (cached) {
    return cached;
  }

  return expensiveLoad();
}
```

If many callers execute this code concurrently, each can invoke `expensiveLoad()`.

Promise sharing can collapse these concurrent operations:

```js
const inFlight = new Map();

async function getData(key) {
  const cached = cache.get(key);

  if (cached !== undefined) {
    return cached;
  }

  if (inFlight.has(key)) {
    return inFlight.get(key);
  }

  const promise = expensiveLoad(key)
    .then(value => {
      cache.set(key, value);
      return value;
    })
    .finally(() => {
      inFlight.delete(key);
    });

  inFlight.set(key, promise);

  return promise;
}
```

The in-flight map and result cache serve different purposes. One coordinates concurrent work; the other retains
completed results.

## Cache Penetration

Cache penetration occurs when requests repeatedly ask for values that do not exist, causing every request to reach the
underlying system.

Negative caching can mitigate this problem:

```js
const NOT_FOUND = Symbol("not-found");

async function findUser(id) {
  if (cache.has(id)) {
    const value = cache.get(id);

    return value === NOT_FOUND ? null : value;
  }

  const user = await repository.findById(id);

  cache.set(id, user ?? NOT_FOUND);

  return user;
}
```

Negative entries should normally have a shorter lifetime than valid data because an absent resource may later be
created.

## Cache Poisoning

A cache can return incorrect data to many consumers if an attacker or faulty producer can insert an invalid
representation.

Cache keys, authorization context, tenant identity, content negotiation, and user-specific state must therefore be
considered carefully.

A particularly dangerous mistake is using a cache key that omits security-relevant inputs.

```js
const key = `/account`;

cache.set(key, responseForUserA);
```

If the same key is later used for another user, the cache can return data belonging to the wrong security principal.

Security-sensitive cache keys must include every relevant isolation dimension, or the resource must not be shared
through that cache.

## Authorization and Caching

Authentication and authorization information can affect cacheability.

A response generated for one principal may not be safe to reuse for another.

```js
const key = `${user.id}:dashboard`;

cache.set(key, dashboard);
```

The user identity is part of the cache key because the dashboard is user-specific.

Multi-tenant systems require similar isolation. Tenant identity, permissions, locale, feature configuration, and other
contextual inputs may all affect the validity of a cached result.

## Serialization

Persistent and distributed caches generally require serialization.

```js
const serialized = JSON.stringify(value);

await cacheStore.set(key, serialized);
```

Serialization can alter types and object identity.

```js
const value = {
  createdAt: new Date()
};

const restored = JSON.parse(JSON.stringify(value));

console.log(restored.createdAt instanceof Date);
```

The restored value is not equivalent in runtime type to the original.

Caches containing domain objects should therefore define their serialization format explicitly rather than assuming
arbitrary JavaScript objects can be safely persisted and reconstructed.

## Cache Ownership

Every cache should have an explicit owner responsible for its lifetime and invalidation policy.

A module-level cache can behave like application-global state:

```js
const cache = new Map();
```

This is convenient but makes lifetime and testing less explicit.

A class-scoped cache can associate ownership with a service:

```js
class UserService {
  #cache = new Map();

  async getUser(id) {
    if (this.#cache.has(id)) {
      return this.#cache.get(id);
    }

    const user = await this.loadUser(id);

    this.#cache.set(id, user);

    return user;
  }
}
```

Dependency Injection can make cache ownership explicit by supplying a cache abstraction to the component that needs it.

## Cache Lifetime

Cache lifetime should correspond to the validity of the cached resource.

Possible lifetimes include a single function call, object lifetime, module lifetime, process lifetime, browser-session
lifetime, persistent browser lifetime, or distributed infrastructure lifetime.

A longer lifetime is not automatically better. Long-lived caches increase the risk of stale data and memory retention.

Short-lived caches reduce stale-data risk but may provide fewer cache hits.

## Memory Retention

An in-memory cache creates strong references to its values.

```js
const cache = new Map();

cache.set(key, largeObject);
```

As long as the cache retains the object, garbage collection cannot reclaim it through ordinary reachability analysis.

A cache without an eviction policy can therefore become an unbounded memory-retention mechanism.

For long-running JavaScript processes, bounded capacity, TTL, explicit invalidation, or another retention policy should
normally be considered.

## Cache and Object Identity

Caching objects can intentionally preserve identity:

```js
const first = cache.get("user:42");
const second = cache.get("user:42");

console.log(first === second);
```

This can be useful when application code relies on stable object identity.

It can also create accidental shared mutable state:

```js
const user = cache.get("user:42");

user.name = "Changed";
```

Every consumer receiving the same cached object may now observe the mutation.

Applications that require isolation can cache immutable values, clone values on retrieval, use structured cloning where
appropriate, or cache serialized representations.

## Immutable Cached Values

Immutable cached data reduces accidental mutation.

```js
const user = Object.freeze({
  id: 42,
  name: "Ada"
});

cache.set("user:42", user);
```

Freezing is only shallow unless nested structures are also protected.

In larger systems, immutable domain representations or persistent data structures may provide stronger guarantees.

The correct choice depends on whether cached objects are intended to be shared by identity or treated as independent
snapshots.

## Caching Errors

Caching failures is different from caching successful results.

A temporary network failure generally should not be retained for the same duration as a successfully retrieved resource.

However, short-lived negative or failure caching can prevent repeated requests from overwhelming a failing dependency.

```js
cache.set(key, {
  status: "failed",
  error,
  expiresAt: Date.now() + 5_000
});
```

Failure caching should have explicit semantics. A cached error can hide recovery if it is retained too long.

## Caching and Consistency

Caching introduces a second representation of data.

If the source changes while the cache retains an older representation, the application observes stale data.

Consistency models can range from strongly coordinated updates to deliberately stale eventual behavior.

The application should define whether it requires:

* Fresh data on every read.
* Bounded staleness.
* Read-your-writes behavior.
* Monotonic reads.
* Eventual consistency.
* Best-effort cached data.
* Offline availability.

A cache strategy should be selected from these semantics rather than from performance requirements alone.

## Cache and Transactions

Caches do not automatically participate in database transactions.

```js
await database.transaction(async transaction => {
    await transaction.updateUser(user);

    cache.set(user.id, user);
});
```

If the database transaction later rolls back, the cache may already contain the value.

The cache update must therefore be coordinated with transaction success, commonly by updating or invalidating the cache
only after the transaction commits.

Distributed transactions involving caches are even more complex and may require event-driven invalidation or versioned
data instead.

## Distributed Caches

A distributed cache provides shared cached state across multiple processes or machines.

This can improve cache sharing and reduce duplication, but it introduces network latency, serialization, connection
failures, availability concerns, and consistency semantics.

A distributed cache should not be assumed to behave like an in-process `Map`.

An in-memory cache can often serve a value in nanoseconds or microseconds, while a remote cache introduces network
communication and failure modes.

For some workloads, a small local cache layered in front of a distributed cache is useful.

## Multi-Level Caching

Applications can combine caches with different performance and lifetime characteristics.

A local in-memory cache can serve extremely frequent requests, while a shared cache can provide broader reuse, and the
authoritative database remains the final source.

```js
async function getUser(id) {
    const local = localCache.get(id);

    if (local !== undefined) {
        return local;
    }

    const shared = await sharedCache.get(id);

    if (shared !== undefined) {
        localCache.set(id, shared);
        return shared;
    }

    const user = await repository.findById(id);

    await sharedCache.set(id, user);
    localCache.set(id, user);

    return user;
}
```

Each level requires its own invalidation and consistency considerations.

## Caching and Lazy Loading

Lazy Loading and caching are complementary.

Lazy Loading determines when a resource is first acquired. Caching determines whether an acquired result is retained for
reuse.

```js
let modulePromise;

function loadFeature() {
  return modulePromise ??= import("./feature.js");
}
```

The dynamic import is lazy, while retaining the promise provides reuse.

A browser, module system, bundler, or application-level cache may also independently cache the underlying resource.

The two concepts should therefore remain separate when documenting architecture.

## Caching and Lazy Initialization

Lazy Initialization delays creation of an object until it is needed.

Caching retains the resulting object for later reuse.

```js
let client;

function getClient() {
  return client ??= createClient();
}
```

This code combines lazy initialization with caching of the initialized object.

The cached object is not necessarily a previously fetched external resource; it may simply be an application object
whose lifetime is intentionally extended.

## Caching and Object Pooling

Object Pooling retains reusable object instances so they can be acquired and released repeatedly.

Caching retains values because they represent reusable results.

A pooled object is normally returned to the pool after use and may be reset before another consumer receives it. A
cached value remains associated with its key because its result is reusable.

Confusing the two can create lifecycle bugs. A resource that must be actively acquired and released generally belongs to
pooling rather than ordinary caching.

## Caching and Memoization

Memoization is a specialized caching strategy for function results.

Caching is the broader concept and can apply to HTTP responses, database records, parsed representations, modules,
images, computations, configuration, and other resources.

Memoization usually derives its key from function arguments, while general caches may use resource identifiers, URLs,
versions, users, tenants, or protocol-level validators.

## Testing

Caching should be tested as a stateful behavior rather than only as a performance optimization.

Tests should cover cache hits, cache misses, expiration, invalidation, concurrent requests, failed loads, retries,
eviction, serialization, version changes, authorization boundaries, and stale-data behavior where applicable.

The underlying dependency should normally be controllable so tests can verify whether it was accessed:

```js
let calls = 0;

async function load() {
  calls++;
  return { value: 42 };
}
```

After a successful cache hit, the test can verify that the underlying operation was not repeated.

Integration tests should additionally verify behavior across actual persistence, HTTP, browser, service-worker, or
distributed-cache boundaries where those layers are part of the architecture.

## Observability

A cache should expose useful operational metrics.

Typical measurements include hit count, miss count, hit ratio, entry count, memory consumption, eviction count,
expiration count, load latency, refresh latency, failure rate, and stale-response frequency.

For distributed caches, network latency, connection failures, timeouts, and serialization cost are also important.

A high hit ratio does not necessarily mean the cache is beneficial. A cache may have many hits while retaining expensive
data, returning stale values, or consuming more resources than it saves.

The metric should therefore reflect the actual business or system objective.

## Performance Considerations

Caching is beneficial when the cost of retrieving or computing a value exceeds the cost of maintaining the cache.

A cache lookup itself has a cost. Memory consumption, synchronization, serialization, network traffic, invalidation,
eviction, and observability all contribute to total system cost.

Caching a trivial computation that is almost never repeated can make the system slower and more complex.

Caching large values can reduce CPU or network usage while significantly increasing memory pressure.

Caching should therefore be justified using measurements of latency, throughput, resource consumption, and reuse
frequency.

## Common Failure Modes

The most fundamental caching failure is incorrect invalidation. If the application cannot determine when a value becomes
invalid, the cache may silently return incorrect data.

Another common failure is an incomplete cache key. Omitting locale, tenant, user, permissions, configuration, version,
or another relevant input can cause logically different requests to share a cache entry.

Unbounded memory retention is another frequent problem in long-lived JavaScript processes. A `Map` used as a cache will
retain its entries until the application removes them or the owning process terminates.

Caching rejected promises indefinitely can turn a transient dependency failure into a persistent application failure.

Caching mutable objects can introduce shared state between otherwise independent consumers.

Finally, adding multiple cache layers without understanding their interaction can make freshness and invalidation nearly
impossible to reason about.

## Architectural Decision Criteria

Caching is a good candidate when a resource has substantial retrieval or computation cost, meaningful reuse, a definable
validity policy, and a tolerable amount of staleness or a reliable invalidation mechanism.

The design should answer at least these questions:

* What exactly is being cached?
* What constitutes the cache key?
* Who owns the cache?
* How long is an entry valid?
* What invalidates it?
* What happens when the source changes?
* What happens when loading fails?
* What happens when many callers request the same missing value?
* What is the maximum memory or storage consumption?
* Is object identity shared?
* Is cached data security-sensitive?
* Does the cache survive process or browser restarts?
* Is the cache local or distributed?
* What happens during deployment or schema changes?
* How is cache behavior observed and tested?

If these questions cannot be answered, the cache policy is probably underspecified.

## Summary

Caching retains previously obtained or computed values so that future operations can avoid repeating expensive work.
JavaScript systems can cache at the application, module, browser, HTTP, service-worker, persistent-storage, or
distributed-infrastructure level.

Common strategies include Cache-Aside, Read-Through, Write-Through, Write-Behind, Refresh-Ahead, TTL,
Stale-While-Revalidate, LRU eviction, negative caching, promise caching, and memoization. Each strategy introduces
different consistency, failure, lifetime, and resource-management characteristics.

The defining problem of caching is invalidation. A cache is correct only when the system knows when a cached
representation can safely be reused. Cache keys, expiration, mutation handling, authorization boundaries, memory
retention, concurrency, deployment, serialization, and observability are therefore architectural concerns rather than
incidental implementation details.

Caching should be treated as a deliberate consistency and resource-management decision: **retain a result only when its
reuse semantics are understood, its lifetime is bounded appropriately, and the cost of maintaining the cache is
justified by the work it avoids.**
