/**
 * Cache Retention
 * ===============
 *
 * Cache retention describes how long cached server data remains available in a query cache
 * after it is no longer actively being used. Retention is different from freshness: freshness
 * determines whether cached data should be considered current, while retention determines
 * whether the cached data remains stored and reusable.
 *
 * A query can therefore be stale while still being retained in the cache. This allows a later
 * observer to reuse the existing data instead of starting with an empty cache entry. When the
 * retention period expires, a query-management system may remove the unused entry so that it
 * no longer consumes memory.
 *
 * Retention is especially useful for understanding why cached data can survive after a component
 * unmounts. The component may stop observing the query, while the cache entry itself remains
 * available for some period of time. The exact retention behavior and configuration depend on
 * the query-management library being used.
 */

import React, { useState } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface CacheEntry<TData> {
  readonly key: string;
  readonly data: TData;
  readonly isStale: boolean;
}

export interface User {
  readonly id: number;
  readonly name: string;
}

export interface RetainedCacheEntryProps {
  readonly initialEntry: CacheEntry<User>;
}

export interface UnusedCacheEntryProps {
  readonly initialEntry: CacheEntry<User>;
}

export interface RetentionAfterUnmountProps {
  readonly initialEntry: CacheEntry<User>;
}

export interface RetentionAndFreshnessProps {
  readonly initialEntry: CacheEntry<User>;
}

export interface RetentionExpiryProps {
  readonly initialEntry: CacheEntry<User>;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

export const RetainedCacheEntry: React.FC<RetainedCacheEntryProps> = ({ initialEntry }): React.ReactElement => {
  const [entry, setEntry] = useState<CacheEntry<User>>(initialEntry);
  const [isObserved, setIsObserved] = useState<boolean>(true);

  const toggleObserver = (): void => {
    setIsObserved((currentValue: boolean): boolean => !currentValue);
  };

  const readCache = (): void => {
    setEntry((currentEntry: CacheEntry<User>): CacheEntry<User> => ({
      ...currentEntry,
      isStale: false,
    }));
  };

  return (
    <div>
      <p>Query: {entry.key}</p>
      <p>Observer: {isObserved ? "active" : "inactive"}</p>
      <p>Cached data: {entry.data.name}</p>
      <button type="button" onClick={toggleObserver}>
        {isObserved ? "Stop observing" : "Start observing"}
      </button>
      <button type="button" onClick={readCache}>
        Read retained cache
      </button>
    </div>
  );
};

export const UnusedCacheEntry: React.FC<UnusedCacheEntryProps> = ({ initialEntry }): React.ReactElement => {
  const [entry, setEntry] = useState<CacheEntry<User>>(initialEntry);
  const [isUsed, setIsUsed] = useState<boolean>(true);

  const stopUsingCache = (): void => {
    setIsUsed(false);
  };

  const reuseCache = (): void => {
    setIsUsed(true);
    setEntry((currentEntry: CacheEntry<User>): CacheEntry<User> => ({
      ...currentEntry,
      isStale: false,
    }));
  };

  return (
    <div>
      <p>Query: {entry.key}</p>
      <p>Cache status: {isUsed ? "in use" : "unused"}</p>
      <p>Cached value: {entry.data.name}</p>
      <button type="button" onClick={stopUsingCache}>
        Stop using query
      </button>
      <button type="button" onClick={reuseCache}>
        Reuse cache
      </button>
    </div>
  );
};

export const RetentionAfterUnmount: React.FC<RetentionAfterUnmountProps> = ({ initialEntry }): React.ReactElement => {
  const [entry] = useState<CacheEntry<User>>(initialEntry);
  const [isMounted, setIsMounted] = useState<boolean>(true);

  const toggleComponent = (): void => {
    setIsMounted((currentValue: boolean): boolean => !currentValue);
  };

  return (
    <div>
      <button type="button" onClick={toggleComponent}>
        {isMounted ? "Unmount observer" : "Mount observer"}
      </button>

      {isMounted ? (
        <p>Observer mounted. Cached value: {entry.data.name}</p>
      ) : (
        <p>Observer unmounted. The cache entry can still be retained.</p>
      )}
    </div>
  );
};

export const RetentionAndFreshness: React.FC<RetentionAndFreshnessProps> = ({ initialEntry }): React.ReactElement => {
  const [entry, setEntry] = useState<CacheEntry<User>>(initialEntry);
  const [isObserved, setIsObserved] = useState<boolean>(true);

  const makeStale = (): void => {
    setEntry((currentEntry: CacheEntry<User>): CacheEntry<User> => ({
      ...currentEntry,
      isStale: true,
    }));
  };

  const toggleObserver = (): void => {
    setIsObserved((currentValue: boolean): boolean => !currentValue);
  };

  return (
    <div>
      <p>Freshness: {entry.isStale ? "stale" : "fresh"}</p>
      <p>Retention: {isObserved ? "actively observed" : "still retained but unused"}</p>
      <button type="button" onClick={makeStale}>
        Mark data stale
      </button>
      <button type="button" onClick={toggleObserver}>
        {isObserved ? "Stop observing" : "Start observing"}
      </button>
    </div>
  );
};

export const RetentionExpiry: React.FC<RetentionExpiryProps> = ({ initialEntry }): React.ReactElement => {
  const [entry, setEntry] = useState<CacheEntry<User>>(initialEntry);
  const [isRetained, setIsRetained] = useState<boolean>(true);

  const expireRetention = (): void => {
    setIsRetained(false);
    setEntry((currentEntry: CacheEntry<User>): CacheEntry<User> => ({
      ...currentEntry,
      isStale: true,
    }));
  };

  const restoreCache = (): void => {
    setIsRetained(true);
    setEntry(initialEntry);
  };

  return (
    <div>
      <p>Query: {entry.key}</p>
      <p>Retention: {isRetained ? "retained" : "expired"}</p>
      {isRetained ? <p>Cached data: {entry.data.name}</p> : <p>Cached entry is no longer available for reuse.</p>}
      <button type="button" onClick={expireRetention}>
        Expire retention
      </button>
      <button type="button" onClick={restoreCache}>
        Restore cache entry
      </button>
    </div>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const CacheRetention: React.FC = (): React.ReactElement => {
  const userEntry: CacheEntry<User> = {
    key: "user:1",
    data: {
      id: 1,
      name: "John Doe",
    },
    isStale: false,
  };

  return (
    <main>
      <h1>Cache Retention</h1>

      <h2>1. Retained cache can outlive an active observer</h2>
      <RetainedCacheEntry initialEntry={userEntry} />

      <h2>2. Unused cache can remain available temporarily</h2>
      <UnusedCacheEntry initialEntry={userEntry} />

      <h2>3. Cache can remain after an observer unmounts</h2>
      <RetentionAfterUnmount initialEntry={userEntry} />

      <h2>4. Retention and freshness are different concerns</h2>
      <RetentionAndFreshness initialEntry={userEntry} />

      <h2>5. Retention can eventually expire</h2>
      <RetentionExpiry initialEntry={userEntry} />
    </main>
  );
};

export default CacheRetention;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// Cache retention determines how long unused cached data remains stored.
// Retention is different from freshness: stale data can still be retained.
// A query observer can unmount while its cache entry remains available.
// Retained cache data can be reused when a query becomes active again.
// Retention eventually expires according to the query-management system's policy.
// Removing an expired cache entry frees the cache from storing data that is no longer needed.
