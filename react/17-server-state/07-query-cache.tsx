/**
 * Query Cache
 * ===========
 *
 * A query cache stores server-state results by query identity so that data retrieved for one
 * component can be reused by other components requesting the same resource. The cache is not
 * the server itself; it is a client-side representation of remote data that can be reused,
 * updated, invalidated, or eventually removed.
 *
 * A query cache is typically organized around query keys. When a query is requested, its key
 * identifies the corresponding cache entry. A later request using the same key can read the
 * existing cached result instead of necessarily starting another network request.
 *
 * Cached server data can have a lifecycle independent of the component that originally requested
 * it. This allows multiple components to share the same server-state result and prevents each
 * component from having to maintain an isolated copy of the same remote data.
 */

import React, { useState } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface User {
  readonly id: number;
  readonly name: string;
  readonly email: string;
}

export interface QueryCacheEntry<TData> {
  readonly queryKey: string;
  readonly data: TData;
  readonly cachedAt: number;
}

export interface QueryCacheExampleProps {
  readonly userId: number;
}

export interface SharedCacheExampleProps {
  readonly user: User;
}

export interface CacheEntryExampleProps {
  readonly entry: QueryCacheEntry<User>;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * Demonstrates the basic relationship between a query key and a cache entry.
 *
 * The query key identifies the remote resource, while the cache entry contains the
 * corresponding server data and metadata describing when that data was cached.
 */
export const BasicQueryCache: React.FC<QueryCacheExampleProps> = ({
  userId,
}: QueryCacheExampleProps): React.ReactElement => {
  const cacheEntry: QueryCacheEntry<User> = {
    queryKey: `user:${userId}`,
    data: {
      id: userId,
      name: "John Doe",
      email: "john.doe@example.com",
    },
    cachedAt: Date.now(),
  };

  return (
    <div>
      <p>Query key: {cacheEntry.queryKey}</p>
      <p>Cached user: {cacheEntry.data.name}</p>
      <p>Cached at: {new Date(cacheEntry.cachedAt).toLocaleTimeString()}</p>
    </div>
  );
};

/**
 * Demonstrates cache reuse.
 *
 * The same cache entry can satisfy multiple reads for the same query key. In a real
 * query-management system, this shared cache is what allows multiple consumers to
 * observe the same server-state result.
 */
export const CacheReuse: React.FC = (): React.ReactElement => {
  const [cache, setCache] = useState<Map<string, User>>((): Map<string, User> => new Map());

  const loadUser = (): void => {
    setCache((currentCache: Map<string, User>): Map<string, User> => {
      if (currentCache.has("user:1")) {
        return currentCache;
      }

      const nextCache: Map<string, User> = new Map(currentCache);

      nextCache.set("user:1", {
        id: 1,
        name: "John Doe",
        email: "john.doe@example.com",
      });

      return nextCache;
    });
  };

  const cachedUser: User | undefined = cache.get("user:1");

  return (
    <div>
      <p>Cache status: {cachedUser === undefined ? "Empty" : "Contains user:1"}</p>
      <p>{cachedUser === undefined ? "No cached data is available." : `Cached user: ${cachedUser.name}`}</p>
      <button type="button" onClick={loadUser}>
        Read User
      </button>
    </div>
  );
};

/**
 * Demonstrates that multiple consumers can read the same cache entry.
 *
 * Both consumers receive the same server-state representation from one cache entry
 * instead of maintaining separate copies of the same remote resource.
 */
export const SharedCacheEntry: React.FC<SharedCacheExampleProps> = ({
  user,
}: SharedCacheExampleProps): React.ReactElement => {
  const cacheEntry: QueryCacheEntry<User> = {
    queryKey: `user:${user.id}`,
    data: user,
    cachedAt: Date.now(),
  };

  return (
    <div>
      <p>Consumer A: {cacheEntry.data.name}</p>
      <p>Consumer B: {cacheEntry.data.name}</p>
      <p>Shared key: {cacheEntry.queryKey}</p>
    </div>
  );
};

/**
 * Demonstrates that different query keys represent different cache entries.
 *
 * Even when the returned objects have the same shape, different resource identifiers
 * represent different pieces of server state and therefore require separate identities.
 */
export const SeparateCacheEntries: React.FC = (): React.ReactElement => {
  const cache: Map<string, User> = new Map<string, User>([
    [
      "user:1",
      {
        id: 1,
        name: "John Doe",
        email: "john.doe@example.com",
      },
    ],
    [
      "user:2",
      {
        id: 2,
        name: "Jane Doe",
        email: "jane.doe@example.com",
      },
    ],
  ]);

  return (
    <div>
      <p>Cache entry user:1: {cache.get("user:1")?.name}</p>
      <p>Cache entry user:2: {cache.get("user:2")?.name}</p>
      <p>These entries represent different server resources.</p>
    </div>
  );
};

/**
 * Demonstrates that cache data is a client-side representation rather than the
 * authoritative server source.
 *
 * Updating a cache entry changes what consumers currently read from the client cache.
 * It does not, by itself, perform a mutation against the remote server.
 */
export const CacheIsNotTheServer: React.FC<CacheEntryExampleProps> = ({
  entry,
}: CacheEntryExampleProps): React.ReactElement => {
  return (
    <div>
      <p>Cached name: {entry.data.name}</p>
      <p>
        Changing this cached value would change the client representation, but a separate mutation is required to
        persist a change on the server.
      </p>
    </div>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const QueryCache: React.FC = (): React.ReactElement => {
  const user: User = {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
  };

  const cacheEntry: QueryCacheEntry<User> = {
    queryKey: "user:1",
    data: user,
    cachedAt: Date.now(),
  };

  return (
    <main>
      <h1>Query Cache</h1>

      <h2>1. Query key and cache entry</h2>
      <BasicQueryCache userId={1} />

      <h2>2. Reusing cached server data</h2>
      <CacheReuse />

      <h2>3. Sharing one cache entry</h2>
      <SharedCacheEntry user={user} />

      <h2>4. Separate resources use separate cache entries</h2>
      <SeparateCacheEntries />

      <h2>5. The cache is not the server</h2>
      <CacheIsNotTheServer entry={cacheEntry} />
    </main>
  );
};

export default QueryCache;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// A query cache stores client-side representations of server-state results.
// Query keys identify which server resource a cache entry represents.
// Multiple consumers can reuse the same cached result for the same query identity.
// Different query keys represent different cache entries.
// Cached data can remain available independently of the component that originally requested it.
// The cache is not the authoritative server source and changing it does not automatically mutate the server.
// Query caches support reuse, sharing, synchronization, invalidation, and lifecycle management of server data.
