/**
 * Optimistic Update
 * =================
 *
 * An optimistic update changes the client representation immediately when a mutation begins,
 * before the server has confirmed that the operation succeeded. The UI assumes the requested
 * operation will succeed so that the result can be reflected without waiting for network latency.
 *
 * Optimistic updates are useful for mutations where the expected result is predictable and the
 * interaction benefits from immediate feedback. The client temporarily represents a state that
 * has been requested but has not yet been confirmed by the server.
 *
 * Because the server can reject the mutation or the request can fail, an optimistic update must
 * account for failure. A common strategy is to preserve the previous value before applying the
 * optimistic change and restore it if the mutation fails. This restoration is the rollback step.
 *
 * The optimistic state is therefore not authoritative. It is a temporary client representation
 * that must eventually be reconciled with the server's response. If the server returns a different
 * representation than expected, the confirmed server response should replace the optimistic state.
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

export interface OptimisticMutationState {
  readonly status: "idle" | "pending" | "success" | "error";
  readonly variables: UpdateUserVariables | null;
  readonly error: string | null;
}

export interface UserDisplayProps {
  readonly user: User;
}

export interface MutationStateDisplayProps {
  readonly mutation: OptimisticMutationState;
}

export interface OptimisticStateExplanationProps {
  readonly currentRole: string;
  readonly requestedRole: string;
  readonly isPending: boolean;
}

export interface OptimisticUpdateControlsProps {
  readonly isPending: boolean;
  readonly onSuccess: () => void;
  readonly onFailure: () => void;
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

export const MutationStateDisplay: FC<MutationStateDisplayProps> = ({ mutation }): ReactElement => {
  return (
    <div>
      <p>Status: {mutation.status}</p>
      <p>Requested role: {mutation.variables === null ? "None" : mutation.variables.role}</p>
      <p>Error: {mutation.error ?? "None"}</p>
    </div>
  );
};

export const OptimisticStateExplanation: FC<OptimisticStateExplanationProps> = ({
  currentRole,
  requestedRole,
  isPending,
}): ReactElement => {
  return (
    <div>
      <p>Displayed role: {currentRole}</p>
      <p>Requested role: {requestedRole}</p>
      <p>
        {isPending
          ? "The displayed role has already changed before server confirmation."
          : "There is no pending optimistic mutation."}
      </p>
    </div>
  );
};

export const OptimisticUpdateControls: FC<OptimisticUpdateControlsProps> = ({
  isPending,
  onSuccess,
  onFailure,
  onReset,
}): ReactElement => {
  return (
    <div>
      <button type="button" disabled={isPending} onClick={onSuccess}>
        Simulate Successful Mutation
      </button>
      <button type="button" disabled={isPending} onClick={onFailure}>
        Simulate Failed Mutation
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

const OptimisticUpdate = (): ReactElement => {
  const initialUser: User = {
    id: 1,
    name: "John Doe",
    role: "Developer",
  };

  const [user, setUser] = useState<User>(initialUser);
  const [mutation, setMutation] = useState<OptimisticMutationState>({
    status: "idle",
    variables: null,
    error: null,
  });

  const [previousUser, setPreviousUser] = useState<User | null>(null);

  const requestedRole: string = user.role === "Developer" ? "Admin" : "Developer";

  const startOptimisticMutation = (shouldFail: boolean): void => {
    const variables: UpdateUserVariables = {
      userId: user.id,
      role: requestedRole,
    };

    const snapshot: User = user;

    // Save the confirmed state before applying the optimistic change.
    setPreviousUser(snapshot);

    // Apply the requested state immediately instead of waiting for the server.
    const optimisticUser: User = {
      ...user,
      role: variables.role,
    };

    setUser(optimisticUser);
    setMutation({
      status: "pending",
      variables,
      error: null,
    });

    window.setTimeout((): void => {
      if (shouldFail) {
        // The server rejected the request, so restore the saved confirmed state.
        setUser(snapshot);
        setMutation({
          status: "error",
          variables,
          error: "The server rejected the role change.",
        });
        return;
      }

      // The server accepted the request, so the optimistic state becomes confirmed state.
      setMutation({
        status: "success",
        variables,
        error: null,
      });
      setPreviousUser(null);
    }, 1000);
  };

  const simulateSuccess = (): void => {
    startOptimisticMutation(false);
  };

  const simulateFailure = (): void => {
    startOptimisticMutation(true);
  };

  const reset = (): void => {
    setUser(initialUser);
    setPreviousUser(null);
    setMutation({
      status: "idle",
      variables: null,
      error: null,
    });
  };

  return (
    <main>
      <h1>Optimistic Update</h1>

      <h2>1. Current User State</h2>
      <UserDisplay user={user} />

      <h2>2. Mutation State</h2>
      <MutationStateDisplay mutation={mutation} />

      <h2>3. Optimistic State</h2>
      <OptimisticStateExplanation
        currentRole={user.role}
        requestedRole={mutation.variables?.role ?? requestedRole}
        isPending={mutation.status === "pending"}
      />

      <h2>4. Previous State Snapshot</h2>
      <p>
        {previousUser === null ? "No rollback snapshot is currently stored." : `Rollback value: ${previousUser.role}`}
      </p>

      <h2>5. Optimistic Mutation Controls</h2>
      <OptimisticUpdateControls
        isPending={mutation.status === "pending"}
        onSuccess={simulateSuccess}
        onFailure={simulateFailure}
        onReset={reset}
      />
    </main>
  );
};

export default OptimisticUpdate;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// An optimistic update applies the requested client state before server confirmation.
// The optimistic state provides immediate feedback without waiting for network latency.
// The optimistic state is temporary and is not authoritative until the server confirms the mutation.
// A previous-state snapshot allows the client to restore the confirmed state when the mutation fails.
// Rollback is the process of restoring the previous state after a failed optimistic mutation.
// A successful mutation allows the optimistic state to become the confirmed client representation.
// The server response remains authoritative if the confirmed result differs from the optimistic assumption.
// Optimistic updates require explicit failure handling because the server can reject the requested change.
