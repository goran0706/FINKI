/**
 * Garbage Collection
 * ===================
 *
 * Garbage collection is the process of removing inactive cache entries that are no longer
 * needed. In a server-state cache, an entry can become inactive when it has no active observers,
 * while still remaining in the cache for a configured retention period.
 *
 * Garbage collection is therefore different from invalidation and staleness. Invalidating a
 * query marks its data as needing synchronization, while garbage collection removes an unused
 * cache entry entirely. A stale query can remain cached, and a fresh query can eventually be
 * garbage collected if it becomes inactive and remains unused long enough.
 *
 * Query libraries commonly expose a garbage-collection or cache-retention duration. For example,
 * TanStack Query uses the `gcTime` option to control how long inactive query data remains in
 * memory before it can be garbage collected. The timer applies to inactive cache entries rather
 * than actively observed queries.
 *
 * Garbage collection is primarily a memory-management mechanism. It does not mean that the
 * corresponding resource is deleted from the server, and it does not determine whether the
 * server data itself is valid.
 */

import React, { useState } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface CacheEntry<TData> {
  readonly key: string;
  readonly data: TData;
  readonly isStale: boolean;
  readonly isActive: boolean;
}

export interface User {
  readonly id: number;
  readonly name: string;
}

export interface InactiveCacheEntryProps {
  readonly initialEntry: CacheEntry<User>;
}

export interface GarbageCollectionTimerProps {
  readonly initialEntry: CacheEntry<User>;
}

export interface ReusedBeforeCollectionProps {
  readonly initialEntry: CacheEntry<User>;
}

export interface GarbageCollectedEntryProps {
  readonly initialEntry: CacheEntry<User>;
}

export interface StaleEntryCanBeCollectedProps {
  readonly initialEntry: CacheEntry<User>;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

export const InactiveCacheEntry: React.FC<InactiveCacheEntryProps> = ({ initialEntry }): React.ReactElement => {
  const [entry, setEntry] = useState<CacheEntry<User>>(initialEntry);

  const toggleActivity = (): void => {
    setEntry((currentEntry: CacheEntry<User>): CacheEntry<User> => ({
      ...currentEntry,
      isActive: !currentEntry.isActive,
    }));
  };

  return (
    <div>
      <p>Query: {entry.key}</p>
      <p>Cache entry: {entry.isActive ? "active" : "inactive"}</p>
      <p>Cached data: {entry.data.name}</p>
      <p>
        {entry.isActive
          ? "The entry is being observed and is not eligible for garbage collection."
          : "The entry has no active observer and can become eligible for garbage collection."}
      </p>
      <button type="button" onClick={toggleActivity}>
        {entry.isActive ? "Make inactive" : "Make active"}
      </button>
    </div>
  );
};

export const GarbageCollectionTimer: React.FC<GarbageCollectionTimerProps> = ({ initialEntry }): React.ReactElement => {
  const [entry, setEntry] = useState<CacheEntry<User>>(initialEntry);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);

  const simulateTimePassing = (): void => {
    if (!entry.isActive) {
      setElapsedSeconds((currentSeconds: number): number => currentSeconds + 1);
    }
  };

  const makeInactive = (): void => {
    setEntry((currentEntry: CacheEntry<User>): CacheEntry<User> => ({
      ...currentEntry,
      isActive: false,
    }));
    setElapsedSeconds(0);
  };

  return (
    <div>
      <p>Query: {entry.key}</p>
      <p>Activity: {entry.isActive ? "active" : "inactive"}</p>
      <p>Inactive duration: {elapsedSeconds} simulated seconds</p>
      <p>Garbage collection can occur after the configured retention period once the query is inactive.</p>
      <button type="button" onClick={makeInactive} disabled={!entry.isActive}>
        Stop observing
      </button>
      <button type="button" onClick={simulateTimePassing} disabled={entry.isActive}>
        Simulate one second
      </button>
    </div>
  );
};

export const ReusedBeforeCollection: React.FC<ReusedBeforeCollectionProps> = ({ initialEntry }): React.ReactElement => {
  const [entry, setEntry] = useState<CacheEntry<User>>(initialEntry);
  const [isAvailable, setIsAvailable] = useState<boolean>(true);

  const stopObserving = (): void => {
    setEntry((currentEntry: CacheEntry<User>): CacheEntry<User> => ({
      ...currentEntry,
      isActive: false,
    }));
  };

  const reuseEntry = (): void => {
    if (!isAvailable) {
      return;
    }

    setEntry((currentEntry: CacheEntry<User>): CacheEntry<User> => ({
      ...currentEntry,
      isActive: true,
    }));
  };

  const collectEntry = (): void => {
    setIsAvailable(false);
  };

  return (
    <div>
      <p>Query: {entry.key}</p>
      <p>Cache available: {isAvailable ? "yes" : "no"}</p>
      <p>Activity: {entry.isActive ? "active" : "inactive"}</p>
      {isAvailable ? <p>Cached data: {entry.data.name}</p> : <p>The cache entry has been garbage collected.</p>}
      <button type="button" onClick={stopObserving} disabled={!isAvailable || !entry.isActive}>
        Stop observing
      </button>
      <button type="button" onClick={reuseEntry} disabled={!isAvailable || entry.isActive}>
        Reuse before collection
      </button>
      <button type="button" onClick={collectEntry} disabled={!isAvailable || entry.isActive}>
        Garbage collect
      </button>
    </div>
  );
};

export const GarbageCollectedEntry: React.FC<GarbageCollectedEntryProps> = ({ initialEntry }): React.ReactElement => {
  const [entry, setEntry] = useState<CacheEntry<User> | null>(initialEntry);

  const garbageCollect = (): void => {
    setEntry(null);
  };

  const recreateEntry = (): void => {
    setEntry(initialEntry);
  };

  return (
    <div>
      {entry === null ? (
        <p>No cache entry exists. A future query must obtain the data again.</p>
      ) : (
        <>
          <p>Query: {entry.key}</p>
          <p>Cached data: {entry.data.name}</p>
          <p>Cache entry is currently retained.</p>
        </>
      )}
      <button type="button" onClick={garbageCollect} disabled={entry === null}>
        Garbage collect
      </button>
      <button type="button" onClick={recreateEntry} disabled={entry !== null}>
        Create cache entry again
      </button>
    </div>
  );
};

export const StaleEntryCanBeCollected: React.FC<StaleEntryCanBeCollectedProps> = ({
  initialEntry,
}): React.ReactElement => {
  const [entry, setEntry] = useState<CacheEntry<User>>(initialEntry);

  const makeStale = (): void => {
    setEntry((currentEntry: CacheEntry<User>): CacheEntry<User> => ({
      ...currentEntry,
      isStale: true,
    }));
  };

  const stopObserving = (): void => {
    setEntry((currentEntry: CacheEntry<User>): CacheEntry<User> => ({
      ...currentEntry,
      isActive: false,
    }));
  };

  return (
    <div>
      <p>Query: {entry.key}</p>
      <p>Freshness: {entry.isStale ? "stale" : "fresh"}</p>
      <p>Activity: {entry.isActive ? "active" : "inactive"}</p>
      <p>
        {entry.isActive
          ? "The entry is active and remains in use."
          : "The entry is inactive and can become eligible for garbage collection."}
      </p>
      <button type="button" onClick={makeStale}>
        Mark stale
      </button>
      <button type="button" onClick={stopObserving} disabled={!entry.isActive}>
        Stop observing
      </button>
    </div>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const GarbageCollection: React.FC = (): React.ReactElement => {
  const activeUserEntry: CacheEntry<User> = {
    key: "user:1",
    data: {
      id: 1,
      name: "John Doe",
    },
    isStale: false,
    isActive: true,
  };

  const inactiveUserEntry: CacheEntry<User> = {
    key: "user:2",
    data: {
      id: 2,
      name: "Jane Doe",
    },
    isStale: false,
    isActive: false,
  };

  const staleUserEntry: CacheEntry<User> = {
    key: "user:3",
    data: {
      id: 3,
      name: "Alex Smith",
    },
    isStale: true,
    isActive: false,
  };

  return (
    <main>
      <h1>Garbage Collection</h1>

      <h2>1. Only inactive cache entries become eligible for collection</h2>
      <InactiveCacheEntry initialEntry={activeUserEntry} />

      <h2>2. Garbage collection waits for the retention period</h2>
      <GarbageCollectionTimer initialEntry={inactiveUserEntry} />

      <h2>3. Reusing an entry before collection keeps it available</h2>
      <ReusedBeforeCollection initialEntry={inactiveUserEntry} />

      <h2>4. Garbage collection removes the cache entry</h2>
      <GarbageCollectedEntry initialEntry={inactiveUserEntry} />

      <h2>5. Stale data can still be garbage collected</h2>
      <StaleEntryCanBeCollected initialEntry={staleUserEntry} />
    </main>
  );
};

export default GarbageCollection;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// Garbage collection removes inactive cache entries that are no longer needed.
// An active query is not eligible for garbage collection merely because its data is stale.
// An inactive query can remain cached until its configured garbage-collection period expires.
// Reusing an inactive query before collection can keep its cached data available.
// After garbage collection, the cache no longer contains the removed entry.
// Garbage collection affects client-side cache memory, not the corresponding server resource.
// Staleness and garbage collection are separate: stale data can remain cached or be collected.
