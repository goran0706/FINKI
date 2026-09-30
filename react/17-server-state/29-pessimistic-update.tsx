/**
 * Pessimistic Update
 * ==================
 *
 * A pessimistic update waits for the server to confirm a mutation before changing the UI or cached
 * server state to the new value. The client treats the server response as the source of truth and
 * applies the resulting state only after the asynchronous operation succeeds.
 *
 * This approach is useful when a mutation must not be presented as successful before the server has
 * accepted it. During the pending period, the UI can keep displaying the previous value while
 * indicating that the requested operation is in progress.
 *
 * If the mutation fails, the previous state can remain unchanged because the client never applied
 * the requested change optimistically. There is therefore no optimistic state that needs to be rolled
 * back after a failed request.
 *
 * Pessimistic updates trade immediate visual feedback for stronger confirmation semantics. The UI
 * generally waits for the server response, whereas an optimistic update changes the client state
 * immediately and reconciles it with the server afterward.
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

export interface PessimisticMutationState {
  readonly status: MutationStatus;
  readonly variables: UpdateUserVariables | null;
  readonly error: string | null;
}

export interface UserDisplayProps {
  readonly user: User;
}

export interface MutationStateDisplayProps {
  readonly mutation: PessimisticMutationState;
}

export interface PessimisticUpdateExplanationProps {
  readonly currentRole: string;
  readonly requestedRole: string;
  readonly isPending: boolean;
}

export interface PessimisticUpdateControlsProps {
  readonly isPending: boolean;
  readonly onUpdate: () => void;
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

export const PessimisticUpdateExplanation: FC<PessimisticUpdateExplanationProps> = ({
  currentRole,
  requestedRole,
  isPending,
}): ReactElement => {
  return (
    <div>
      <p>Current displayed role: {currentRole}</p>
      <p>Requested role: {requestedRole}</p>
      <p>
        {isPending
          ? "The previous role remains displayed until the server confirms the mutation."
          : "The displayed role represents the currently confirmed state."}
      </p>
    </div>
  );
};

export const PessimisticUpdateControls: FC<PessimisticUpdateControlsProps> = ({
  isPending,
  onUpdate,
  onReset,
}): ReactElement => {
  return (
    <div>
      <button type="button" disabled={isPending} onClick={onUpdate}>
        Request Role Change
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

const PessimisticUpdate = (): ReactElement => {
  const initialUser: User = {
    id: 1,
    name: "John Doe",
    role: "Developer",
  };

  const [user, setUser] = useState<User>(initialUser);
  const [mutation, setMutation] = useState<PessimisticMutationState>({
    status: "idle",
    variables: null,
    error: null,
  });

  const requestedRole: string = user.role === "Developer" ? "Admin" : "Developer";

  const updateUser = (): void => {
    const variables: UpdateUserVariables = {
      userId: user.id,
      role: requestedRole,
    };

    setMutation({
      status: "pending",
      variables,
      error: null,
    });

    window.setTimeout((): void => {
      const serverAcceptedRequest: boolean = true;

      if (!serverAcceptedRequest) {
        setMutation({
          status: "error",
          variables,
          error: "The server rejected the role change.",
        });
        return;
      }

      const confirmedUser: User = {
        ...user,
        role: variables.role,
      };

      // The displayed user changes only after the simulated server confirms the mutation.
      setUser(confirmedUser);
      setMutation({
        status: "success",
        variables,
        error: null,
      });
    }, 1000);
  };

  const reset = (): void => {
    setUser(initialUser);
    setMutation({
      status: "idle",
      variables: null,
      error: null,
    });
  };

  return (
    <main>
      <h1>Pessimistic Update</h1>

      <h2>1. Current Server State</h2>
      <UserDisplay user={user} />

      <h2>2. Mutation State</h2>
      <MutationStateDisplay mutation={mutation} />

      <h2>3. Waiting for Server Confirmation</h2>
      <PessimisticUpdateExplanation
        currentRole={user.role}
        requestedRole={requestedRole}
        isPending={mutation.status === "pending"}
      />

      <h2>4. Pessimistic Update Controls</h2>
      <PessimisticUpdateControls isPending={mutation.status === "pending"} onUpdate={updateUser} onReset={reset} />
    </main>
  );
};

export default PessimisticUpdate;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// A pessimistic update waits for successful server confirmation before applying the requested change.
// The UI can continue displaying the previous state while the mutation is pending.
// A failed mutation does not require an optimistic rollback because the requested state was never applied.
// The server response determines the confirmed state shown after the mutation succeeds.
// Pessimistic updates provide confirmation before changing the displayed server state.
// The trade-off is that the requested change is not visible immediately while the server operation is pending.
// Pessimistic and optimistic updates differ primarily in when the client applies the requested state.
