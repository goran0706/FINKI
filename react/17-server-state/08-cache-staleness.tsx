/**
 * Cache Staleness
 * ===============
 *
 * Cached server data has a freshness lifecycle. A cache entry can be considered fresh for a
 * period of time and later become stale when it exceeds the configured freshness threshold.
 * Staleness describes the age or freshness classification of cached data; it does not mean
 * that the cached data has been deleted or that it is necessarily incorrect.
 *
 * Freshness and availability are separate concepts. Fresh cached data can be reused without
 * immediately contacting the server, while stale data can remain available and may still be
 * rendered while a query-management system decides whether to refetch it.
 *
 * The exact freshness policy depends on the query-management system and its configuration.
 * A common model is a `staleTime` value that determines how long successfully fetched data
 * is considered fresh.
 */

import React, { useEffect, useState } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface User {
  readonly id: number;
  readonly name: string;
  readonly email: string;
}

export interface CacheEntry<TData> {
  readonly data: TData;
  readonly cachedAt: number;
  readonly staleTime: number;
}

export interface CacheStalenessExampleProps {
  readonly staleTime: number;
}

export interface StaleDataExampleProps {
  readonly user: User;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * Demonstrates a fresh cache entry.
 *
 * The entry is considered fresh while its age remains below the configured staleTime.
 * Freshness is determined from the cache timestamp rather than from whether the component
 * currently happens to be rendering the data.
 */
export const FreshCacheEntry: React.FC<CacheStalenessExampleProps> = ({
  staleTime,
}: CacheStalenessExampleProps): React.ReactElement => {
  const cachedAt: number = Date.now();
  const cacheEntry: CacheEntry<User> = {
    data: {
      id: 1,
      name: "John Doe",
      email: "john.doe@example.com",
    },
    cachedAt,
    staleTime,
  };

  const age: number = Date.now() - cacheEntry.cachedAt;
  const isFresh: boolean = age < cacheEntry.staleTime;

  return (
    <div>
      <p>Cached user: {cacheEntry.data.name}</p>
      <p>Cache age: {age} ms</p>
      <p>Stale time: {cacheEntry.staleTime} ms</p>
      <p>Status: {isFresh ? "Fresh" : "Stale"}</p>
    </div>
  );
};

/**
 * Demonstrates a cache entry becoming stale as time passes.
 *
 * The data remains in the cache after becoming stale. Only its freshness classification changes.
 */
export const CacheEntryBecomesStale: React.FC = (): React.ReactElement => {
  const staleTime: number = 2000;
  const [cachedAt] = useState<number>(Date.now());
  const [now, setNow] = useState<number>(Date.now());

  useEffect((): (() => void) => {
    const intervalId: number = window.setInterval((): void => {
      setNow(Date.now());
    }, 250);

    return (): void => {
      window.clearInterval(intervalId);
    };
  }, []);

  const age: number = now - cachedAt;
  const isStale: boolean = age >= staleTime;

  return (
    <div>
      <p>Cache age: {age} ms</p>
      <p>Stale time: {staleTime} ms</p>
      <p>Status: {isStale ? "Stale" : "Fresh"}</p>
      <p>Cached data remains available after the entry becomes stale.</p>
    </div>
  );
};

/**
 * Demonstrates the difference between stale data and missing data.
 *
 * A stale entry still has a cached value. A missing entry has no cached value at all.
 * Staleness therefore does not imply that the cache entry has been removed.
 */
export const StaleDataRemainsAvailable: React.FC<StaleDataExampleProps> = ({
  user,
}: StaleDataExampleProps): React.ReactElement => {
  const [isStale] = useState<boolean>(true);

  return (
    <div>
      <p>Cached user: {user.name}</p>
      <p>Cache status: {isStale ? "Stale" : "Fresh"}</p>
      <p>Data status: Available</p>
    </div>
  );
};

/**
 * Demonstrates that stale data does not automatically mean incorrect data.
 *
 * Staleness is a freshness policy used to decide when validation or refetching may be useful.
 * The server may have changed, but the client does not know that merely because the cache
 * entry became stale.
 */
export const StaleDoesNotMeanInvalid: React.FC = (): React.ReactElement => {
  const user: User = {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
  };

  return (
    <div>
      <p>Cached value: {user.name}</p>
      <p>Status: Stale</p>
      <p>
        Stale means the data is outside its configured freshness window; it does not prove that the cached value is
        incorrect.
      </p>
    </div>
  );
};

/**
 * Demonstrates that a stale cache entry can remain visible while it is being refreshed.
 *
 * Existing data can provide immediate UI while a background request checks whether
 * the remote representation has changed.
 */
export const StaleWhileRefetching: React.FC = (): React.ReactElement => {
  const [user, setUser] = useState<User>({
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
  });
  const [isStale, setIsStale] = useState<boolean>(true);
  const [isRefetching, setIsRefetching] = useState<boolean>(false);

  const refetch = (): void => {
    setIsRefetching(true);

    window.setTimeout((): void => {
      setUser({
        id: 1,
        name: "Jane Doe",
        email: "jane.doe@example.com",
      });
      setIsStale(false);
      setIsRefetching(false);
    }, 1000);
  };

  return (
    <div>
      <p>Name: {user.name}</p>
      <p>Status: {isStale ? "Stale" : "Fresh"}</p>
      <p>{isRefetching ? "Refreshing..." : "Not currently fetching."}</p>
      <button type="button" onClick={refetch} disabled={isRefetching}>
        Refetch
      </button>
    </div>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const CacheStaleness: React.FC = (): React.ReactElement => {
  const user: User = {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
  };

  return (
    <main>
      <h1>Cache Staleness</h1>

      <h2>1. Fresh cache entry</h2>
      <FreshCacheEntry staleTime={5000} />

      <h2>2. Cache entry becoming stale over time</h2>
      <CacheEntryBecomesStale />

      <h2>3. Stale data remains available</h2>
      <StaleDataRemainsAvailable user={user} />

      <h2>4. Stale does not mean invalid</h2>
      <StaleDoesNotMeanInvalid />

      <h2>5. Stale data during refetching</h2>
      <StaleWhileRefetching />
    </main>
  );
};

export default CacheStaleness;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// Cache freshness describes whether cached server data is inside or outside its freshness window.
// staleTime commonly determines how long successfully fetched data remains fresh.
// Stale data is not automatically deleted from the cache.
// Stale data can remain available for rendering while a refetch is performed.
// Stale does not prove that the cached value is incorrect; it indicates that freshness should no longer be assumed.
// Freshness and cache retention are separate concepts: data can be stale while still remaining in the cache.
