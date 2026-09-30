/**
 * Concurrent Mutations
 * =====================
 *
 * Concurrent mutations occur when multiple server-side write operations are started before earlier
 * mutations have completed. Each mutation has its own variables, lifecycle, result, and potential
 * failure, so the application must not assume that mutations complete in the same order in which
 * they were started.
 *
 * Network timing can cause a later mutation to finish before an earlier mutation. If each response
 * blindly replaces shared client state, an older response can overwrite a newer result. This is a
 * race condition between mutation responses rather than a React rendering problem.
 *
 * Applications can handle concurrent mutations by tracking mutation identity, associating each
 * request with its variables, and reconciling responses against the current state. When ordering
 * matters, a server-provided version or sequence number is more reliable than assuming response
 * order represents mutation order.
 *
 * Concurrent mutations are also important for optimistic updates. Each optimistic operation needs
 * its own rollback context, and a failed older mutation should not blindly restore state that was
 * produced by a newer mutation.
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

export interface MutationVariables {
  readonly mutationId: number;
  readonly userId: number;
  readonly role: string;
}

export interface MutationRecord {
  readonly mutationId: number;
  readonly role: string;
  readonly status: "pending" | "success" | "error";
  readonly duration: number;
}

export interface ConcurrentMutationState {
  readonly activeMutations: readonly MutationVariables[];
  readonly completedMutations: readonly MutationRecord[];
}

export interface UserDisplayProps {
  readonly user: User;
}

export interface MutationListProps {
  readonly mutations: readonly MutationRecord[];
}

export interface ActiveMutationListProps {
  readonly mutations: readonly MutationVariables[];
}

export interface ConcurrencyExplanationProps {
  readonly latestStartedId: number | null;
  readonly latestCompletedId: number | null;
}

export interface ConcurrentMutationControlsProps {
  readonly isPending: boolean;
  readonly onStartFast: () => void;
  readonly onStartSlow: () => void;
  readonly onReset: () => void;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

export const UserDisplay: FC<UserDisplayProps> = ({ user }): ReactElement => {
  return (
    <div>
      <p>User ID: {user.id}</p>
      <p>Name: {user.name}</p>
      <p>Role: {user.role}</p>
    </div>
  );
};

export const MutationList: FC<MutationListProps> = ({ mutations }): ReactElement => {
  return (
    <div>
      {mutations.length === 0 ? (
        <p>No completed mutations.</p>
      ) : (
        mutations.map((mutation: MutationRecord): ReactElement => (
          <div key={mutation.mutationId}>
            <p>Mutation #{mutation.mutationId}</p>
            <p>Requested role: {mutation.role}</p>
            <p>Status: {mutation.status}</p>
            <p>Duration: {mutation.duration}ms</p>
          </div>
        ))
      )}
    </div>
  );
};

export const ActiveMutationList: FC<ActiveMutationListProps> = ({ mutations }): ReactElement => {
  return (
    <div>
      {mutations.length === 0 ? (
        <p>No mutations are currently pending.</p>
      ) : (
        mutations.map((mutation: MutationVariables): ReactElement => (
          <div key={mutation.mutationId}>
            <p>
              Mutation #{mutation.mutationId} is updating the role to {mutation.role}.
            </p>
          </div>
        ))
      )}
    </div>
  );
};

export const ConcurrencyExplanation: FC<ConcurrencyExplanationProps> = ({
  latestStartedId,
  latestCompletedId,
}): ReactElement => {
  return (
    <div>
      <p>Latest started mutation: {latestStartedId === null ? "None" : `#${latestStartedId}`}</p>
      <p>Latest completed mutation: {latestCompletedId === null ? "None" : `#${latestCompletedId}`}</p>
      <p>
        A later mutation can complete before an earlier mutation because network and server processing times are
        independent for each request.
      </p>
    </div>
  );
};

export const ConcurrentMutationControls: FC<ConcurrentMutationControlsProps> = ({
  isPending,
  onStartFast,
  onStartSlow,
  onReset,
}): ReactElement => {
  return (
    <div>
      <button type="button" disabled={isPending} onClick={onStartFast}>
        Start Fast Mutation
      </button>
      <button type="button" disabled={isPending} onClick={onStartSlow}>
        Start Slow Mutation
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

const ConcurrentMutations = (): ReactElement => {
  const initialUser: User = {
    id: 1,
    name: "John Doe",
    role: "Developer",
  };

  const [user, setUser] = useState<User>(initialUser);
  const [nextMutationId, setNextMutationId] = useState<number>(1);
  const [activeMutations, setActiveMutations] = useState<readonly MutationVariables[]>([]);
  const [completedMutations, setCompletedMutations] = useState<readonly MutationRecord[]>([]);
  const [latestStartedId, setLatestStartedId] = useState<number | null>(null);
  const [latestCompletedId, setLatestCompletedId] = useState<number | null>(null);

  const startMutation = (duration: number, role: string): void => {
    const mutationId: number = nextMutationId;

    const variables: MutationVariables = {
      mutationId,
      userId: user.id,
      role,
    };

    setNextMutationId((currentId: number): number => currentId + 1);
    setLatestStartedId(mutationId);
    setActiveMutations((currentMutations: readonly MutationVariables[]): readonly MutationVariables[] => [
      ...currentMutations,
      variables,
    ]);

    window.setTimeout((): void => {
      // Each completion removes only its own mutation from the active set.
      setActiveMutations((currentMutations: readonly MutationVariables[]): readonly MutationVariables[] =>
        currentMutations.filter((mutation: MutationVariables): boolean => mutation.mutationId !== mutationId),
      );

      setCompletedMutations((currentMutations: readonly MutationRecord[]): readonly MutationRecord[] => [
        ...currentMutations,
        {
          mutationId,
          role,
          status: "success",
          duration,
        },
      ]);

      setLatestCompletedId(mutationId);

      // The response is associated with its mutation ID instead of assuming
      // that completion order equals the order in which mutations were started.
      setUser((currentUser: User): User => ({
        ...currentUser,
        role,
      }));
    }, duration);
  };

  const startFastMutation = (): void => {
    const nextRole: string = user.role === "Developer" ? "Admin" : "Developer";

    startMutation(700, nextRole);
  };

  const startSlowMutation = (): void => {
    const nextRole: string = user.role === "Developer" ? "Admin" : "Developer";

    startMutation(1800, nextRole);
  };

  const reset = (): void => {
    setUser(initialUser);
    setNextMutationId(1);
    setActiveMutations([]);
    setCompletedMutations([]);
    setLatestStartedId(null);
    setLatestCompletedId(null);
  };

  const mutationState: ConcurrentMutationState = {
    activeMutations,
    completedMutations,
  };

  const isPending: boolean = mutationState.activeMutations.length > 0;

  return (
    <main>
      <h1>Concurrent Mutations</h1>

      <h2>1. Current User State</h2>
      <UserDisplay user={user} />

      <h2>2. Active Mutations</h2>
      <ActiveMutationList mutations={mutationState.activeMutations} />

      <h2>3. Completed Mutations</h2>
      <MutationList mutations={mutationState.completedMutations} />

      <h2>4. Mutation Completion Order</h2>
      <ConcurrencyExplanation latestStartedId={latestStartedId} latestCompletedId={latestCompletedId} />

      <h2>5. Starting Concurrent Mutations</h2>
      <p>
        Start mutations with different durations to observe that completion order does not have to match start order.
      </p>
      <ConcurrentMutationControls
        isPending={isPending}
        onStartFast={startFastMutation}
        onStartSlow={startSlowMutation}
        onReset={reset}
      />
    </main>
  );
};

export default ConcurrentMutations;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// Concurrent mutations are multiple server-side write operations running at the same time.
// Mutations can complete in a different order from the order in which they were started.
// Each mutation should have an identity so its response can be associated with the correct operation.
// Shared state must not assume that response order represents mutation order.
// Functional state updates help safely modify collections when asynchronous mutation responses arrive.
// When ordering matters, server-provided versions or sequence numbers can provide stronger ordering semantics.
// Concurrent optimistic mutations require independent rollback contexts to avoid restoring the wrong state.
// Applications should reconcile concurrent mutation results with the authoritative server state.
