# Resource Cache

A resource cache stores the result of asynchronous data requests so that subsequent consumers can reuse existing data
instead of independently fetching the same resource again.

The cache introduces an identity between a request and its result. Instead of treating every invocation of a fetching
function as an independent operation, the application determines which requests refer to the same resource and
associates their results with a shared cache entry.

The core abstraction is:

```tsx
const user = await getUser(userId);
```

becoming conceptually associated with a resource identity such as:

```tsx
["user", userId]
```

Multiple consumers using the same resource identity can then reuse the same cached result.

## Intent

Use a resource cache when asynchronous resources need to be reused, deduplicated, or retained beyond the lifetime of an
individual request.

A cache can prevent multiple consumers from independently requesting the same resource:

```tsx
useUser("123");
useUser("123");
```

Instead of producing two independent requests, both consumers can resolve against one cache entry.

The cache therefore separates resource acquisition from resource reuse.

## Resource Identity

A cache requires a stable way to identify a resource.

For example:

```tsx
["user", "123"]
```

might identify user `123`.

A search result could use:

```tsx
["users", {query: "john", page: 2}]
```

The identity must contain every parameter that determines the resource.

If two requests produce different data, they must not accidentally share the same cache entry.

```tsx
["user", "123"]
    ["user", "456"]
```

represent different resources.

Conversely, two logically identical requests should use equivalent identities if they are expected to share data.

## Cache Key

The resource identity is commonly represented as a cache key.

A simple implementation might serialize a key:

```tsx
function cacheKey(key: unknown[]): string {
    return JSON.stringify(key);
}
```

A cache can then store results by key:

```tsx
const cache = new Map<string, unknown>();
```

For example:

```tsx
const key = cacheKey(["user", "123"]);

cache.set(key, user);
```

The exact key representation is an implementation detail. The important property is that equivalent resource identities
resolve to the same cache entry.

## Cache Entry

A cache entry usually contains more than the fetched data.

A useful model is:

```tsx
type CacheEntry<T> = {
    status: "pending" | "success" | "error";
    data?: T;
    error?: Error;
    promise?: Promise<T>;
    updatedAt: number;
};
```

The entry can therefore represent:

* an in-flight request;
* successful data;
* a failed request;
* when the data was obtained;
* potentially additional metadata such as expiration or subscriber information.

The cache is therefore a resource lifecycle store rather than simply a `Map` of values.

## Basic Cache

A minimal cache can store completed results:

```tsx
const cache = new Map<string, User>();

async function getUser(userId: string) {
    const key = JSON.stringify(["user", userId]);

    const cached = cache.get(key);

    if (cached) {
        return cached;
    }

    const user = await fetchUser(userId);

    cache.set(key, user);

    return user;
}
```

The second request for the same user can reuse the stored result.

This is the simplest form of resource caching.

## In-Flight Deduplication

A completed-result cache does not prevent duplicate requests that occur concurrently.

Consider:

```tsx
const first = getUser("123");
const second = getUser("123");
```

If neither request has completed yet, both can call `fetchUser()`.

A resource cache can instead cache the in-flight promise:

```tsx
const cache = new Map<string, Promise<User>>();

function getUser(userId: string): Promise<User> {
    const key = JSON.stringify(["user", userId]);

    const existing = cache.get(key);

    if (existing) {
        return existing;
    }

    const promise = fetchUser(userId);

    cache.set(key, promise);

    return promise;
}
```

Both callers now receive the same promise.

This is request deduplication.

## Promise Reuse

Caching a promise establishes shared ownership of one asynchronous operation.

```tsx
const promise = fetchUser("123");

cache.set(key, promise);
```

Multiple consumers can await the same operation:

```tsx
const userA = await getUser("123");
const userB = await getUser("123");
```

The underlying request does not need to be repeated while the shared operation remains in flight.

The cache therefore treats an in-progress request as a resource that can itself be reused.

## Removing Failed Promises

A failed promise should not normally remain permanently cached unless failure caching is intentional.

For example:

```tsx
function getUser(userId: string) {
    const key = JSON.stringify(["user", userId]);

    const existing = cache.get(key);

    if (existing) {
        return existing;
    }

    const promise = fetchUser(userId).catch((error) => {
        cache.delete(key);
        throw error;
    });

    cache.set(key, promise);

    return promise;
}
```

After failure, a subsequent request can attempt the operation again.

Whether errors should be cached depends on the application's retry and failure semantics.

## Caching Errors

A resource cache can intentionally cache failures:

```tsx
type CacheEntry<T> =
    | {
    status: "success";
    data: T;
    updatedAt: number;
}
    | {
    status: "error";
    error: Error;
    updatedAt: number;
};
```

This can prevent repeated requests when the same failure would otherwise occur continuously.

However, errors often have different lifetimes from successful data.

A temporary network failure may be worth retrying quickly, while a deterministic validation failure may remain invalid
until its request parameters change.

Error caching therefore requires an explicit policy.

## Freshness

Cached data eventually becomes stale.

A cache can record when a resource was obtained:

```tsx
type CacheEntry<T> = {
    data: T;
    updatedAt: number;
};
```

Freshness can then be calculated:

```tsx
function isFresh(
    entry: CacheEntry<unknown>,
    maxAge: number,
) {
    return Date.now() - entry.updatedAt < maxAge;
}
```

A fresh entry can be reused directly.

A stale entry may trigger a new request.

Freshness is a cache policy, not an inherent property of the resource itself.

## TTL

A time-to-live policy can determine how long cached data remains fresh.

```tsx
const TTL = 60_000;

function isFresh(entry: CacheEntry<unknown>) {
    return Date.now() - entry.updatedAt < TTL;
}
```

After the TTL expires, the entry is stale.

The cache may:

* refetch before returning data;
* return stale data and refresh in the background;
* remove the entry;
* leave the entry available but mark it stale.

These behaviors are different policies.

## Stale-While-Revalidate

A cache can return existing stale data immediately while starting a new request.

```tsx
const cached = cache.get(key);

if (cached && isStale(cached)) {
    refresh(key);
    return cached.data;
}
```

The user continues to see the previous result while the cache obtains newer data.

This avoids replacing usable content with a loading state merely because the resource needs refreshing.

Stale-while-revalidate therefore separates data availability from freshness.

## Cache Invalidation

Invalidation marks cached data as no longer trustworthy or fresh.

A simple cache can delete an entry:

```tsx
cache.delete(JSON.stringify(["user", userId]));
```

A more sophisticated cache can retain the data while marking it stale:

```tsx
entry.stale = true;
```

Invalidation is useful after mutations.

For example:

```tsx
await updateUser(userId, changes);

invalidate(["user", userId]);
```

The next read can obtain fresh data.

## Invalidation by Resource Identity

Invalidation should operate on resource identity rather than arbitrary component instances.

```tsx
invalidate(["user", userId]);
```

Any consumer using that resource identity can then observe the invalidated resource.

This is one of the primary advantages of a shared resource cache: the resource lifecycle is independent of individual
component instances.

## Invalidation by Namespace

Caches may support invalidating a broader resource family.

For example:

```tsx
invalidate(["users"]);
```

could invalidate:

```tsx
["users", { page: 1 }]
["users", { page: 2 }]
["users", { query: "john" }]
```

This is useful when a mutation changes assumptions shared by many resource variants.

However, broad invalidation can cause unnecessary refetching. Cache invalidation should therefore be as precise as the
application's consistency requirements permit.

## Cache Lifetime

Caching data indefinitely can produce unbounded memory growth.

A cache therefore needs a lifetime policy.

Possible policies include:

* fixed expiration;
* removal after inactivity;
* removal after all consumers unsubscribe;
* least-recently-used eviction;
* bounded entry count;
* explicit invalidation;
* application lifetime.

The correct policy depends on the resource.

A small static resource can safely remain cached for a long time. A large, highly variable dataset may require
aggressive eviction.

## Garbage Collection

A cache can remove resources that are no longer being used.

A reference-counted design might track consumers:

```tsx
type CacheEntry<T> = {
  data?: T;
  subscribers: number;
};
```

When the last consumer leaves, the cache can start an expiration timer.

```tsx
if (entry.subscribers === 0) {
  scheduleRemoval(key);
}
```

This is different from freshness.

A resource can be fresh but unused.

A resource can also be stale while actively consumed.

Usage lifetime and data freshness are separate dimensions.

## Subscriber Tracking

A shared cache becomes more useful when consumers can subscribe to updates.

A simplified entry might contain:

```tsx
type CacheEntry<T> = {
  data?: T;
  listeners: Set<() => void>;
};
```

Consumers subscribe:

```tsx
entry.listeners.add(listener);
```

When the resource changes:

```tsx
for (const listener of entry.listeners) {
  listener();
}
```

This allows multiple consumers to observe the same resource without each maintaining an independent copy.

At this point the cache begins to overlap with server-state management, where subscription and synchronization become
first-class concerns.

## Cache as an External Store

A shared resource cache can be treated as an external state source.

React provides `useSyncExternalStore` for integrating external mutable stores with rendering:

```tsx
function useResource<T>(key: ResourceKey<T>) {
  return useSyncExternalStore(
    () => subscribe(key),
    () => getSnapshot(key),
  );
}
```

The cache then owns the resource state while React subscribes to its changes.

This is useful when the resource is shared across component instances.

The external-store integration mechanism itself is separate from cache semantics.

## Cache and React State

A cache should not normally be copied into component state merely to make it usable.

Avoid:

```tsx
const [user, setUser] = useState(cache.get(key));
```

This creates another state representation that can become stale relative to the cache.

Instead, components should consume the cache through an appropriate subscription or resource abstraction.

The cache should remain the authoritative store for the cached resource.

## Cache and Component State

Component-local state and cached resource state have different lifetimes.

Component state generally belongs to a particular component instance.

A cache entry can outlive that component:

```tsx
<UserProfile userId="123" />
```

may mount, unmount, and later remount while the cached resource remains available.

This is one of the fundamental reasons to use a resource cache: resource lifetime can exceed component lifetime.

## Request Identity Versus Component Identity

Component identity is determined by React's component and key semantics.

Resource identity is determined by the cache key.

These are independent.

Two different component instances can consume one resource:

```tsx
<UserCard userId="123" />
<Profile userId="123" />
```

If both use:

```tsx
["user", "123"]
```

they can share one cached resource.

Likewise, one component instance can consume different resources over time:

```tsx
<UserProfile userId="123"/>
```

followed by:

```tsx
<UserProfile userId="456" />
```

The component identity may remain unchanged while the resource identity changes.

## Cache Key Stability

Cache keys must be stable and semantically meaningful.

This can be problematic:

```tsx
const key = ["user", { id: userId }];
```

if the cache uses reference identity rather than structural equality.

A new object may represent the same logical request but produce a different key:

```tsx
["user", { id: "123" }]
["user", { id: "123" }]
```

If those objects are compared by reference, they are different keys.

A cache implementation must therefore define its key equality semantics.

Possible approaches include:

* stable serialization;
* structural hashing;
* canonical key construction;
* explicit string keys;
* object identity with memoized key objects.

The cache contract must make this behavior predictable.

## Cache Key Completeness

A cache key must contain every parameter that changes the resource.

Incorrect:

```tsx
["users"]
```

when the request depends on:

```tsx
{
  query,
  page,
  sort,
}
```

Correct:

```tsx
["users", { query, page, sort }]
```

If a request parameter is omitted, the cache can incorrectly return data for a different request.

This is a correctness issue, not merely a performance issue.

## Cache Key Granularity

A key should identify the resource at the level at which it can safely be reused.

For example:

```tsx
["user", userId]
```

is appropriate when the complete user resource can be shared.

If different requests intentionally return different representations, their identities should differ:

```tsx
["user", userId, "summary"]
["user", userId, "details"]
```

Overly broad keys cause incorrect reuse.

Overly narrow keys reduce reuse and deduplication.

## Serialization

Some cache implementations use serialized keys:

```tsx
const key = JSON.stringify([
  "users",
  {
    query,
    page,
  },
]);
```

Serialization is convenient but has limitations.

The serialization algorithm must provide deterministic representations for logically equivalent keys.

It must also handle the value types permitted by the cache-key contract.

A resource cache should preferably define a constrained key format rather than accepting arbitrary JavaScript values
without specifying equality semantics.

## Cache Scope

A cache can exist at different scopes.

A component-local cache:

```tsx
function Component() {
  const cache = useMemo(() => new Map(), []);

  // ...
}
```

is useful only to that component instance.

A feature-level cache can be shared by a feature subtree.

An application-level cache can be shared across many routes and components.

A request-level cache can exist only for one rendering or server request.

The cache scope should match the intended resource lifetime.

## Request-Scoped Caches

Server rendering can use a cache whose lifetime is limited to one request.

This can deduplicate repeated resource reads during that render without accidentally sharing request-specific data
between users.

The principle is important:

```text
cache lifetime must not exceed the security and consistency boundary of the data.
```

A resource containing user-specific data should not accidentally enter a process-wide cache that is shared between
unrelated requests.

## Browser Cache Versus Application Cache

HTTP caching and an application-level resource cache operate at different layers.

The browser may cache an HTTP response according to HTTP cache directives.

An application-level cache can additionally control:

* resource identity;
* in-memory reuse;
* subscriptions;
* freshness semantics;
* invalidation;
* request deduplication;
* integration with React rendering.

Application caching therefore does not replace HTTP caching.

Both layers can participate in resource reuse.

## Persistent Cache

Some resources can be persisted beyond a browser session.

For example, a cache may use:

```tsx
localStorage
```

or another persistent storage mechanism.

Persistence introduces additional concerns:

* serialization;
* storage limits;
* schema changes;
* expiration;
* cross-tab synchronization;
* sensitive data;
* migration;
* corruption recovery.

Persistent caching should therefore be used only when the resource's lifetime and consistency requirements justify it.

A process-memory cache and a persistent cache have materially different ownership and lifecycle semantics.

## Cache Hydration

A resource cache can be populated before a component reads it.

For example:

```tsx
cache.set(
  key,
  {
    status: "success",
    data: initialData,
    updatedAt: Date.now(),
  },
);
```

The component can then render from the existing resource rather than starting a new request.

This is useful when data was already obtained by another rendering layer.

Hydration therefore allows server-acquired or preloaded data to enter the client-side resource cache.

## Prefetching

A cache can be populated before the data is actually required.

```tsx
function preloadUser(userId: string) {
  const key = ["user", userId];

  if (!cache.has(key)) {
    cache.set(
      key,
      fetchUser(userId),
    );
  }
}
```

A component can then consume the resource later.

```tsx
onMouseEnter={() => preloadUser("123")}
```

When navigation or rendering eventually requires the user, the request may already be in progress or complete.

Prefetching changes when acquisition starts, while caching determines whether the resulting resource can be reused.

## Cache Warming

An application can intentionally preload commonly required resources during startup or navigation.

```tsx
preloadUser(currentUserId);
preloadSettings(currentUserId);
```

Cache warming can reduce latency for predictable future reads.

It should not be confused with blindly fetching everything in advance. Unnecessary prefetching consumes bandwidth,
memory, and server resources.

## Cache Reads

A resource cache can expose a synchronous read for already available data:

```tsx
function getCachedUser(userId: string) {
  return cache.get(
    JSON.stringify(["user", userId]),
  );
}
```

A missing result can be represented as:

```tsx
undefined
```

or through an explicit resource state.

The read API should make the distinction between missing, pending, stale, successful, and failed resources clear.

## Cache Writes

Explicit writes can be useful after mutations.

```tsx
cache.set(
  JSON.stringify(["user", userId]),
  updatedUser,
);
```

This allows the application to update the cached resource immediately rather than waiting for another network request.

However, direct cache mutation should respect the cache's consistency model.

A manually inserted value that does not satisfy the resource contract can be worse than an explicit invalidation.

## Optimistic Updates

A cache can temporarily represent an expected future result.

```tsx
const previous = cache.get(key);

cache.set(key, optimisticUser);

try {
  const updated = await updateUser(userId, changes);
  cache.set(key, updated);
} catch (error) {
  cache.set(key, previous);
  throw error;
}
```

The cache becomes the location through which consumers observe the optimistic state.

Optimistic mutation semantics are more closely associated with server-state management, but resource caches must support
appropriate cache updates if they are used as the shared representation of remote resources.

## Cache Consistency

The central cache consistency question is:

> When can a cached value be considered equivalent to the authoritative resource?

For immutable resources, a long cache lifetime may be acceptable.

For frequently changing resources, the cache may need short freshness windows or explicit invalidation.

For resources modified by the application itself, successful mutations should define how affected cache entries are
updated or invalidated.

The cache policy must therefore reflect the consistency requirements of the resource.

## Cache Invalidation After Mutation

Suppose a user is updated:

```tsx
await updateUser(userId, changes);
```

The cached representation may now be stale.

A simple strategy is invalidation:

```tsx
invalidate(["user", userId]);
```

A more immediate strategy is direct replacement:

```tsx
const updatedUser = await updateUser(userId, changes);

setCache(["user", userId], updatedUser);
```

Another strategy is optimistic update followed by reconciliation.

The appropriate strategy depends on the mutation semantics and consistency requirements.

## Cache Eviction

Invalidation and eviction are different operations.

Invalidation means:

> This entry should no longer be treated as fresh or authoritative.

Eviction means:

> Remove this entry from the cache.

An invalidated entry can remain available for stale rendering or revalidation:

```tsx
entry.stale = true;
```

An evicted entry no longer exists:

```tsx
cache.delete(key);
```

Keeping these concepts separate allows the cache to preserve useful stale data while still forcing eventual refresh.

## LRU Eviction

A cache with many resources can use least-recently-used eviction.

Conceptually:

```tsx
class ResourceCache {
  // Track access order and remove least-recently-used entries.
}
```

LRU is useful when cache size must be bounded but recently accessed resources should remain available.

The eviction algorithm is an implementation policy rather than a requirement of resource caching.

## Cache Size

A cache should have a deliberate memory policy.

Potential constraints include:

* maximum number of entries;
* maximum estimated memory;
* maximum age;
* maximum size per resource;
* maximum number of inactive entries.

Large responses can make an otherwise small number of entries consume significant memory.

Cache design should therefore account for the actual size and cardinality of resources.

## Cache Isolation

Cache scope must respect data isolation.

A global cache containing:

```tsx
["user", "123"]
```

must not accidentally expose that resource to a request or user for whom it is unauthorized.

This is particularly important for server-side rendering.

Request-specific data should generally use request-scoped caches unless the resource is explicitly safe to share.

Cache isolation is therefore both a lifecycle and security concern.

## Testing

A resource cache should be tested independently of individual components.

Important behaviors include:

* equivalent keys sharing one resource;
* different keys remaining isolated;
* concurrent requests being deduplicated;
* successful results being reused;
* failed requests following the configured error policy;
* stale entries being revalidated according to policy;
* invalidation marking the correct resources;
* eviction removing unused entries;
* mutations updating or invalidating affected resources;
* cache scope preventing unintended sharing.

For example, two simultaneous reads of the same resource should result in one underlying request:

```tsx
const first = getUser("123");
const second = getUser("123");

expect(fetchUser).toHaveBeenCalledTimes(1);

await Promise.all([first, second]);
```

The test verifies the cache's resource identity and in-flight deduplication behavior rather than any particular React
implementation.

## Common Misuse

A common misuse is using a cache without defining resource identity clearly. If the key does not fully describe the
request, the cache can return incorrect data.

Another is caching every request forever. This creates stale-data and memory-retention problems.

Another is treating invalidation as equivalent to deletion. A stale entry can still be useful while a fresh result is
being obtained.

Another is caching promises indefinitely. Failed or abandoned operations can remain permanently associated with a
resource unless their lifecycle is explicitly handled.

Another is using component state as a second cache. This creates multiple representations of the same resource and makes
synchronization harder.

Another is creating a process-wide cache for request-specific or user-specific server data without an appropriate
isolation boundary.

Another is implementing broad invalidation for every mutation. This can destroy most of the performance benefit of
caching by causing excessive refetching.

Another is confusing a resource cache with a complete server-state solution. Caching answers how resources are reused;
server-state management also needs to coordinate synchronization, mutations, freshness, invalidation, and subscriptions
at application scale.

## Advantages

Resource caching can eliminate duplicate requests, reduce latency, reuse data across component instances, retain data
across component lifetimes, support prefetching, and provide a centralized location for resource identity and freshness
policy.

It also creates a clean boundary between obtaining a resource and deciding whether an existing resource can be reused.

## Disadvantages

Caching introduces lifecycle and consistency complexity. The system must define key equality, freshness, invalidation,
eviction, error handling, concurrency, memory limits, and scope.

Incorrect cache keys can produce incorrect data, while overly aggressive invalidation can eliminate most cache benefits.

A cache can also retain sensitive or large data longer than intended if its lifetime is not carefully controlled.

## When to Use

Use a resource cache when:

* multiple consumers may request the same resource;
* concurrent requests should be deduplicated;
* fetched data should survive component unmounting;
* resources should be reused across component instances;
* prefetching provides a meaningful latency benefit;
* freshness and expiration need explicit policies;
* mutations need targeted invalidation or cache updates;
* resource identity can be defined reliably.

## When Not to Use

Do not introduce a shared cache when a resource is genuinely one-shot and used by only one component.

Do not cache data when reuse would violate security or consistency requirements.

Do not create a process-wide cache for request-specific server data without strict isolation.

Do not use a cache as a substitute for clearly defining the ownership and synchronization model of remote state.

Do not add persistent caching when the resource does not benefit from surviving application restarts.

## Relationships

Data Fetching provides the asynchronous acquisition mechanism. Resource Cache adds reuse, request identity,
deduplication, freshness, invalidation, and retention around that acquisition.

Server State builds on these concepts when remote resources become shared application state that must be synchronized,
mutated, invalidated, and observed across the application.

State Colocation determines where component-local request state belongs when no shared resource cache is required.

External Store provides the React integration mechanism when the cache itself becomes a shared external state source.

Suspense Boundary can coordinate rendering around a resource that is pending, but Suspense does not define cache
identity or cache policy.

Effect Synchronization can initiate client-side requests, but it does not provide resource reuse by itself.

Effect Cleanup handles cancellation and lifecycle cleanup for requests, while the cache determines whether the resulting
resource should remain reusable.

Controlled Components and Uncontrolled Components concern component state ownership and are separate from resource
caching.

Stable Keys and Component Identity determine component-instance identity. Resource Cache uses a separate resource
identity based on request semantics.

## Summary

A resource cache associates asynchronous resources with stable identities so that their results can be reused across
consumers and component lifetimes.

A robust cache must answer several questions:

* What resource does this key represent?
* Can concurrent consumers share one in-flight request?
* How long is the result fresh?
* What makes the resource stale?
* How is the resource invalidated?
* When is it evicted?
* How are failures handled?
* How is the cache scoped?
* Can consumers subscribe to changes?
* How does a mutation update or invalidate affected resources?

The essential model is:

```tsx
const key = ["user", userId];

const resource = cache.get(key);

if (!resource) {
    cache.set(key, fetchUser(userId));
}
```

The exact implementation can range from a small in-memory `Map` to a sophisticated resource-management system.

The central rule is: **cache by stable resource identity, not by component instance, and define freshness, invalidation,
and lifetime explicitly.**
