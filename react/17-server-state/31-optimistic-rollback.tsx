/**
 * Optimistic Rollback
 * ===================
 *
 * Optimistic rollback restores the previously confirmed client state when an optimistic mutation
 * fails. An optimistic mutation changes the UI immediately, so the client must preserve enough
 * information about the previous state to undo that temporary change if the server rejects it.
 *
 * The rollback value should be captured before applying the optimistic update. It represents the
 * last confirmed state at the time the mutation started and can therefore be restored when the
 * mutation fails.
 *
 * Rollback is different from simply resetting the component. A rollback specifically restores the
 * state that existed before a particular mutation attempt. This distinction becomes important when
 * mutations contain meaningful existing data or when multiple mutations can be in flight.
 *
 * A rollback strategy should also account for concurrent mutations. If multiple optimistic mutations
 * overlap, blindly restoring an old snapshot can overwrite a newer successful or optimistic change.
 * Real applications therefore commonly associate rollback context with individual mutation attempts
 * and reconcile the final state with the authoritative server response.
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

export type MutationStatus = "idle" | "pending" | "success" | "error";

export interface OptimisticMutationState {
  readonly status: MutationStatus;
  readonly variables: UpdateUserVariables | null;
  readonly error: string | null;
}

export interface RollbackContext<TData> {
  readonly previousData: TData;
}

export interface UserDisplayProps {
  readonly user: User;
}

export interface MutationStateDisplayProps {
  readonly mutation: OptimisticMutationState;
}

export interface RollbackContextDisplayProps {
  readonly context: RollbackContext<User> | null;
}

export interface RollbackExplanationProps {
  readonly currentUser: User;
  readonly rollbackUser: User | null;
  readonly isPending: boolean;
}

export interface RollbackControlsProps {
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

export const RollbackContextDisplay: FC<RollbackContextDisplayProps> = ({ context }): ReactElement => {
  return (
    <div>
      <p>
        {context === null
          ? "No rollback context is currently stored."
          : `Previous confirmed role: ${context.previousData.role}`}
      </p>
    </div>
  );
};

export const RollbackExplanation: FC<RollbackExplanationProps> = ({
  currentUser,
  rollbackUser,
  isPending,
}): ReactElement => {
  return (
    <div>
      <p>Displayed role: {currentUser.role}</p>
      <p>Rollback role: {rollbackUser === null ? "None" : rollbackUser.role}</p>
      <p>
        {isPending
          ? "The optimistic value is displayed while the server request is pending."
          : "There is no pending optimistic mutation."}
      </p>
    </div>
  );
};

export const RollbackControls: FC<RollbackControlsProps> = ({
  isPending,
  onSuccess,
  onFailure,
  onReset,
}): ReactElement => {
  return (
    <div>
      <button type="button" disabled={isPending} onClick={onSuccess}>
        Simulate Success
      </button>
      <button type="button" disabled={isPending} onClick={onFailure}>
        Simulate Failure
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

const OptimisticRollback = (): ReactElement => {
  const initialUser: User = {
    id: 1,
    name: "John Doe",
    role: "Developer",
  };

  const [user, setUser] = useState<User>(initialUser);
  const [rollbackContext, setRollbackContext] = useState<RollbackContext<User> | null>(null);
  const [mutation, setMutation] = useState<OptimisticMutationState>({
    status: "idle",
    variables: null,
    error: null,
  });

  const requestedRole: string = user.role === "Developer" ? "Admin" : "Developer";

  const startMutation = (shouldFail: boolean): void => {
    const variables: UpdateUserVariables = {
      userId: user.id,
      role: requestedRole,
    };

    const previousUser: User = user;

    // Capture the confirmed state before applying the optimistic change.
    const context: RollbackContext<User> = {
      previousData: previousUser,
    };

    setRollbackContext(context);

    // Apply the requested value immediately while the server request is pending.
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
        // Restore the state captured before this mutation started.
        setUser(context.previousData);
        setMutation({
          status: "error",
          variables,
          error: "The server rejected the requested role change.",
        });
        return;
      }

      // The server accepted the optimistic change, so no rollback is necessary.
      setMutation({
        status: "success",
        variables,
        error: null,
      });
      setRollbackContext(null);
    }, 1000);
  };

  const simulateSuccess = (): void => {
    startMutation(false);
  };

  const simulateFailure = (): void => {
    startMutation(true);
  };

  const reset = (): void => {
    setUser(initialUser);
    setRollbackContext(null);
    setMutation({
      status: "idle",
      variables: null,
      error: null,
    });
  };

  return (
    <main>
      <h1>Optimistic Rollback</h1>

      <h2>1. Current User State</h2>
      <UserDisplay user={user} />

      <h2>2. Mutation State</h2>
      <MutationStateDisplay mutation={mutation} />

      <h2>3. Rollback Context</h2>
      <RollbackContextDisplay context={rollbackContext} />

      <h2>4. Optimistic State and Rollback Value</h2>
      <RollbackExplanation
        currentUser={user}
        rollbackUser={rollbackContext?.previousData ?? null}
        isPending={mutation.status === "pending"}
      />

      <h2>5. Simulating Mutation Outcomes</h2>
      <RollbackControls
        isPending={mutation.status === "pending"}
        onSuccess={simulateSuccess}
        onFailure={simulateFailure}
        onReset={reset}
      />
    </main>
  );
};

export default OptimisticRollback;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// Optimistic rollback restores the confirmed state when an optimistic mutation fails.
// The previous state should be captured before the optimistic change is applied.
// The rollback context contains the information required to undo the failed mutation.
// A successful mutation clears the need for rollback because the server accepted the change.
// A failed mutation restores the saved state and records the mutation error.
// Rollback is specific to a mutation attempt and is different from resetting a component to arbitrary initial state.
// Multiple concurrent mutations require careful rollback context management to avoid overwriting newer state.
// The authoritative server response should ultimately determine the final server-state representation.
