/**
 * Mutation Cache Update
 * =====================
 *
 * A mutation cache update directly replaces or modifies cached server-state data after a successful
 * mutation when the mutation result is known to contain enough information to represent the new state.
 * Instead of marking a query stale and waiting for another request, the query cache can be updated
 * immediately with the mutation response.
 *
 * This approach is useful when the server returns the authoritative representation of the changed
 * resource. For example, an update-user mutation can return the complete updated user, allowing the
 * corresponding cached `user` query to be replaced without an additional refetch.
 *
 * Cache updates must preserve the cache's data contract. The new value must have the same logical
 * shape as the query data it replaces, and related cache entries must also be considered when one
 * server-side change affects multiple representations of the same resource.
 *
 * Direct cache updates differ from invalidation. Invalidation marks cached data as stale and usually
 * leads to a later refetch, while a direct cache update immediately changes the cached representation.
 * A cache update is therefore most useful when the mutation response is authoritative and sufficiently
 * complete; otherwise, invalidation and refetching can be safer.
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

export interface UpdateUserVariables {
  readonly userId: number;
  readonly role: string;
}

export interface QueryCache<TData> {
  readonly queryKey: string;
  readonly data: TData;
}

export interface MutationState<TData, TVariables> {
  readonly status: "idle" | "pending" | "success" | "error";
  readonly variables: TVariables | null;
  readonly data: TData | null;
  readonly error: string | null;
}

export interface CacheDisplayProps {
  readonly cache: readonly QueryCache<User>[];
}

export interface MutationStateDisplayProps {
  readonly mutation: MutationState<User, UpdateUserVariables>;
}

export interface CacheUpdateExplanationProps {
  readonly before: User;
  readonly after: User;
}

export interface CacheUpdateControlsProps {
  readonly isPending: boolean;
  readonly onUpdateUser: () => void;
  readonly onReset: () => void;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

export const CacheDisplay: FC<CacheDisplayProps> = ({ cache }): ReactElement => {
  return (
    <div>
      {cache.map((entry: QueryCache<User>): ReactElement => (
        <div key={entry.queryKey}>
          <p>Query key: {entry.queryKey}</p>
          <p>
            User: {entry.data.name} — {entry.data.role}
          </p>
        </div>
      ))}
    </div>
  );
};

export const MutationStateDisplay: FC<MutationStateDisplayProps> = ({ mutation }): ReactElement => {
  return (
    <div>
      <p>Status: {mutation.status}</p>
      <p>
        Variables:{" "}
        {mutation.variables === null ? "None" : `user ${mutation.variables.userId}, role ${mutation.variables.role}`}
      </p>
      <p>Result: {mutation.data?.role ?? "None"}</p>
      <p>Error: {mutation.error ?? "None"}</p>
    </div>
  );
};

export const CacheUpdateExplanation: FC<CacheUpdateExplanationProps> = ({ before, after }): ReactElement => {
  return (
    <div>
      <p>
        Before: {before.name} — {before.role}
      </p>
      <p>
        After: {after.name} — {after.role}
      </p>
      <p>
        The mutation response can be written directly into the cache when it contains the authoritative updated
        resource.
      </p>
    </div>
  );
};

export const CacheUpdateControls: FC<CacheUpdateControlsProps> = ({
  isPending,
  onUpdateUser,
  onReset,
}): ReactElement => {
  return (
    <div>
      <button type="button" disabled={isPending} onClick={onUpdateUser}>
        Update User and Cache
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

const MutationCacheUpdate = (): ReactElement => {
  const initialUser: User = {
    id: 1,
    name: "John Doe",
    role: "Developer",
  };

  const [serverUser, setServerUser] = useState<User>(initialUser);
  const [cache, setCache] = useState<readonly QueryCache<User>[]>([
    {
      queryKey: "user:1",
      data: initialUser,
    },
    {
      queryKey: "users",
      data: initialUser,
    },
  ]);

  const [mutation, setMutation] = useState<MutationState<User, UpdateUserVariables>>({
    status: "idle",
    variables: null,
    data: null,
    error: null,
  });

  const updateUser = (): void => {
    const variables: UpdateUserVariables = {
      userId: serverUser.id,
      role: serverUser.role === "Developer" ? "Admin" : "Developer",
    };

    setMutation({
      status: "pending",
      variables,
      data: null,
      error: null,
    });

    window.setTimeout((): void => {
      const updatedUser: User = {
        ...serverUser,
        role: variables.role,
      };

      // The simulated server accepts the mutation and returns the updated resource.
      setServerUser(updatedUser);

      setMutation({
        status: "success",
        variables,
        data: updatedUser,
        error: null,
      });

      // The mutation response is authoritative, so the related cache entries
      // can be updated immediately instead of waiting for another refetch.
      setCache((currentCache: readonly QueryCache<User>[]): readonly QueryCache<User>[] =>
        currentCache.map((entry: QueryCache<User>): QueryCache<User> => ({
          ...entry,
          data: entry.data.id === updatedUser.id ? updatedUser : entry.data,
        })),
      );
    }, 800);
  };

  const reset = (): void => {
    setServerUser(initialUser);
    setCache([
      {
        queryKey: "user:1",
        data: initialUser,
      },
      {
        queryKey: "users",
        data: initialUser,
      },
    ]);
    setMutation({
      status: "idle",
      variables: null,
      data: null,
      error: null,
    });
  };

  const previousUser: User =
    mutation.data === null
      ? serverUser
      : {
          ...serverUser,
          role: mutation.data.role === "Admin" ? "Developer" : "Admin",
        };

  const updatedUser: User = mutation.data === null ? serverUser : mutation.data;

  return (
    <main>
      <h1>Mutation Cache Update</h1>

      <h2>1. Cached Server State</h2>
      <CacheDisplay cache={cache} />

      <h2>2. Mutation State</h2>
      <MutationStateDisplay mutation={mutation} />

      <h2>3. Mutation Response Updates the Cache</h2>
      <CacheUpdateExplanation before={previousUser} after={updatedUser} />

      <h2>4. Direct Cache Update</h2>
      <p>
        When the mutation returns the complete updated user, the cached user representation can be replaced immediately.
      </p>

      <h2>5. Mutation Cache Update Controls</h2>
      <CacheUpdateControls isPending={mutation.status === "pending"} onUpdateUser={updateUser} onReset={reset} />
    </main>
  );
};

export default MutationCacheUpdate;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// A mutation cache update directly changes cached server-state data after a successful mutation.
// The mutation response should contain an authoritative representation suitable for the cache.
// Direct cache updates can avoid an additional refetch when the returned data is complete.
// Related cache entries may also need to be updated when the same resource appears in multiple queries.
// Cache updates must preserve the data contract expected by the affected query.
// Invalidation marks data stale and can trigger a refetch; a direct cache update replaces the cached representation.
// Direct cache updates are less appropriate when the mutation response does not contain enough information to reconstruct the affected data.
