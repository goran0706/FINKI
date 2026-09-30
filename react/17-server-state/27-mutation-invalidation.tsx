/**
 * Mutation Invalidation
 * ======================
 *
 * Mutation invalidation is the process of marking related cached server-state data as stale after
 * a successful mutation changes the server. The mutation changes the authoritative server state,
 * while invalidation tells the query layer that previously cached data may no longer be current.
 *
 * Invalidation does not normally delete cached data immediately. Existing data can remain available
 * to the UI while the affected query is considered stale and is refetched according to the query
 * layer's configuration and lifecycle rules.
 *
 * The relationship between a mutation and the queries it invalidates is important. A mutation should
 * invalidate the query keys whose data could have been affected by the server-side change. Invalidating
 * too little can leave stale data visible, while invalidating unrelated queries can cause unnecessary
 * network requests.
 *
 * Invalidation is therefore different from directly updating the cache. Invalidation says that cached
 * data should no longer be trusted as fresh; a subsequent refetch obtains the authoritative representation
 * from the server. Direct cache updates instead replace cached data immediately with a known value.
 */

import type { FC, ReactElement } from "react";
import { useState } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface User {
  readonly id: number;
  readonly name: string;
  readonly role: string;
}

export interface QueryCacheEntry<TData> {
  readonly queryKey: string;
  readonly data: TData;
  readonly isStale: boolean;
}

export interface MutationInvalidationState {
  readonly mutationStatus: "idle" | "pending" | "success";
  readonly invalidatedKeys: readonly string[];
}

export interface QueryCacheDisplayProps {
  readonly entries: readonly QueryCacheEntry<User>[];
}

export interface InvalidationStateDisplayProps {
  readonly state: MutationInvalidationState;
}

export interface InvalidationExplanationProps {
  readonly queryKey: string;
  readonly isStale: boolean;
}

export interface MutationInvalidationControlsProps {
  readonly isPending: boolean;
  readonly onUpdateUser: () => void;
  readonly onInvalidateUser: () => void;
  readonly onReset: () => void;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

export const QueryCacheDisplay: FC<QueryCacheDisplayProps> = ({ entries }): ReactElement => {
  return (
    <div>
      {entries.map((entry: QueryCacheEntry<User>): ReactElement => (
        <div key={entry.queryKey}>
          <p>Query key: {entry.queryKey}</p>
          <p>
            User: {entry.data.name} — {entry.data.role}
          </p>
          <p>Stale: {entry.isStale ? "Yes" : "No"}</p>
        </div>
      ))}
    </div>
  );
};

export const InvalidationStateDisplay: FC<InvalidationStateDisplayProps> = ({ state }): ReactElement => {
  return (
    <div>
      <p>Mutation status: {state.mutationStatus}</p>
      <p>Invalidated keys: {state.invalidatedKeys.length === 0 ? "None" : state.invalidatedKeys.join(", ")}</p>
    </div>
  );
};

export const InvalidationExplanation: FC<InvalidationExplanationProps> = ({ queryKey, isStale }): ReactElement => {
  return (
    <div>
      <p>Query key: {queryKey}</p>
      <p>
        {isStale
          ? "The cached data may still be displayed, but it should no longer be treated as fresh."
          : "The cached data is currently considered fresh."}
      </p>
    </div>
  );
};

export const MutationInvalidationControls: FC<MutationInvalidationControlsProps> = ({
  isPending,
  onUpdateUser,
  onInvalidateUser,
  onReset,
}): ReactElement => {
  return (
    <div>
      <button type="button" disabled={isPending} onClick={onUpdateUser}>
        Run Mutation
      </button>
      <button type="button" disabled={isPending} onClick={onInvalidateUser}>
        Invalidate User Query
      </button>
      <button type="button" onClick={onReset}>
        Reset
      </button>
    </div>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const MutationInvalidation = (): ReactElement => {
  const [user, setUser] = useState<User>({
    id: 1,
    name: "John Doe",
    role: "Developer",
  });

  const [cacheEntries, setCacheEntries] = useState<readonly QueryCacheEntry<User>[]>([
    {
      queryKey: "user:1",
      data: {
        id: 1,
        name: "John Doe",
        role: "Developer",
      },
      isStale: false,
    },
    {
      queryKey: "users",
      data: {
        id: 1,
        name: "John Doe",
        role: "Developer",
      },
      isStale: false,
    },
  ]);

  const [mutationStatus, setMutationStatus] = useState<MutationInvalidationState["mutationStatus"]>("idle");

  const [invalidatedKeys, setInvalidatedKeys] = useState<readonly string[]>([]);

  const invalidateQuery = (queryKey: string): void => {
    setCacheEntries((currentEntries: readonly QueryCacheEntry<User>[]): readonly QueryCacheEntry<User>[] =>
      currentEntries.map((entry: QueryCacheEntry<User>): QueryCacheEntry<User> =>
        entry.queryKey === queryKey ? { ...entry, isStale: true } : entry,
      ),
    );

    setInvalidatedKeys((currentKeys: readonly string[]): readonly string[] =>
      currentKeys.includes(queryKey) ? currentKeys : [...currentKeys, queryKey],
    );
  };

  const runMutation = (): void => {
    setMutationStatus("pending");
    setInvalidatedKeys([]);

    window.setTimeout((): void => {
      const updatedUser: User = {
        ...user,
        role: user.role === "Developer" ? "Admin" : "Developer",
      };

      setUser(updatedUser);
      setMutationStatus("success");

      invalidateQuery("user:1");
      invalidateQuery("users");
    }, 800);
  };

  const manuallyInvalidateUser = (): void => {
    invalidateQuery("user:1");
  };

  const reset = (): void => {
    const initialUser: User = {
      id: 1,
      name: "John Doe",
      role: "Developer",
    };

    setUser(initialUser);
    setCacheEntries([
      {
        queryKey: "user:1",
        data: initialUser,
        isStale: false,
      },
      {
        queryKey: "users",
        data: initialUser,
        isStale: false,
      },
    ]);
    setMutationStatus("idle");
    setInvalidatedKeys([]);
  };

  const invalidationState: MutationInvalidationState = {
    mutationStatus,
    invalidatedKeys,
  };

  return (
    <main>
      <h1>Mutation Invalidation</h1>

      <h2>1. Cached Server State</h2>
      <QueryCacheDisplay entries={cacheEntries} />

      <h2>2. Mutation and Invalidation State</h2>
      <InvalidationStateDisplay state={invalidationState} />

      <h2>3. Invalidated Query</h2>
      <InvalidationExplanation
        queryKey="user:1"
        isStale={
          cacheEntries.find((entry: QueryCacheEntry<User>): boolean => entry.queryKey === "user:1")?.isStale ?? false
        }
      />

      <h2>4. Mutation Affects Related Queries</h2>
      <p>
        Current server user: {user.name} — {user.role}
      </p>
      <p>
        A user mutation can affect both an individual-user query and a user-list query, so both related cache entries
        may need invalidation.
      </p>

      <h2>5. Mutation Invalidation Controls</h2>
      <MutationInvalidationControls
        isPending={mutationStatus === "pending"}
        onUpdateUser={runMutation}
        onInvalidateUser={manuallyInvalidateUser}
        onReset={reset}
      />
    </main>
  );
};

export default MutationInvalidation;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// Mutation invalidation marks related cached server-state data as stale after a server-side change.
// Invalidating a query does not necessarily remove its existing cached data immediately.
// Existing stale data can remain visible while a later refetch obtains a fresh server representation.
// The mutation should invalidate query keys whose cached data could have been affected.
// Invalidating too few queries can leave related cached data stale.
// Invalidating unrelated queries can cause unnecessary refetching and network activity.
// Invalidation communicates that cached data may be outdated; it does not directly replace that data.
// Cache invalidation and direct cache updates are separate synchronization strategies.
