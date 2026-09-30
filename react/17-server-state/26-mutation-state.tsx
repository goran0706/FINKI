/**
 * Mutation State
 * ==============
 *
 * Mutation state describes the current lifecycle state of a server-side write operation. A mutation
 * commonly moves from idle to pending and then to either success or error after the asynchronous
 * operation completes.
 *
 * Mutation state is separate from the state of the resource being mutated. A mutation can be pending
 * while the UI still displays the previous server data, and a successful mutation does not by itself
 * determine how related cached query data should be updated.
 *
 * A mutation state can also retain useful information about the operation, including the variables
 * that were submitted, the successful result, and the error produced by a failed request. These
 * values describe the mutation attempt and are distinct from the server-state cache itself.
 *
 * Resetting mutation state clears the mutation's lifecycle information without necessarily undoing
 * the server-side operation. A reset is therefore a client-side state reset, not a rollback.
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

export interface MutationState<TData, TVariables> {
  readonly status: MutationStatus;
  readonly variables: TVariables | null;
  readonly data: TData | null;
  readonly error: string | null;
}

export interface MutationStatusDisplayProps {
  readonly status: MutationStatus;
}

export interface MutationVariablesDisplayProps {
  readonly variables: UpdateUserVariables | null;
}

export interface MutationDataDisplayProps {
  readonly data: User | null;
}

export interface MutationErrorDisplayProps {
  readonly error: string | null;
}

export interface MutationStateDisplayProps {
  readonly mutation: MutationState<User, UpdateUserVariables>;
}

export interface MutationStateControlsProps {
  readonly isPending: boolean;
  readonly onSuccess: () => void;
  readonly onError: () => void;
  readonly onReset: () => void;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

export const MutationStatusDisplay: FC<MutationStatusDisplayProps> = ({ status }): ReactElement => {
  return (
    <div>
      <p>Status: {status}</p>
      <p>
        {status === "idle" && "No mutation has been submitted."}
        {status === "pending" && "The mutation is currently running."}
        {status === "success" && "The mutation completed successfully."}
        {status === "error" && "The mutation failed."}
      </p>
    </div>
  );
};

export const MutationVariablesDisplay: FC<MutationVariablesDisplayProps> = ({ variables }): ReactElement => {
  return (
    <div>
      {variables === null ? (
        <p>No mutation variables have been submitted.</p>
      ) : (
        <>
          <p>User ID: {variables.userId}</p>
          <p>Requested role: {variables.role}</p>
        </>
      )}
    </div>
  );
};

export const MutationDataDisplay: FC<MutationDataDisplayProps> = ({ data }): ReactElement => {
  return (
    <div>
      {data === null ? (
        <p>No successful mutation data is available.</p>
      ) : (
        <>
          <p>User ID: {data.id}</p>
          <p>Name: {data.name}</p>
          <p>Role: {data.role}</p>
        </>
      )}
    </div>
  );
};

export const MutationErrorDisplay: FC<MutationErrorDisplayProps> = ({ error }): ReactElement => {
  return (
    <div>
      <p>Error: {error ?? "No mutation error."}</p>
    </div>
  );
};

export const MutationStateDisplay: FC<MutationStateDisplayProps> = ({ mutation }): ReactElement => {
  return (
    <div>
      <p>Status: {mutation.status}</p>
      <p>Variables: {mutation.variables?.role ?? "None"}</p>
      <p>Data: {mutation.data?.name ?? "None"}</p>
      <p>Error: {mutation.error ?? "None"}</p>
    </div>
  );
};

export const MutationStateControls: FC<MutationStateControlsProps> = ({
  isPending,
  onSuccess,
  onError,
  onReset,
}): ReactElement => {
  return (
    <div>
      <button type="button" disabled={isPending} onClick={onSuccess}>
        Simulate Success
      </button>
      <button type="button" disabled={isPending} onClick={onError}>
        Simulate Error
      </button>
      <button type="button" onClick={onReset}>
        Reset Mutation State
      </button>
    </div>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const MutationState = (): ReactElement => {
  const [mutation, setMutation] = useState<MutationState<User, UpdateUserVariables>>({
    status: "idle",
    variables: null,
    data: null,
    error: null,
  });

  const [user, setUser] = useState<User>({
    id: 1,
    name: "John Doe",
    role: "Developer",
  });

  const submitMutation = (shouldFail: boolean): void => {
    const variables: UpdateUserVariables = {
      userId: user.id,
      role: user.role === "Developer" ? "Admin" : "Developer",
    };

    setMutation({
      status: "pending",
      variables,
      data: null,
      error: null,
    });

    window.setTimeout((): void => {
      if (shouldFail) {
        setMutation({
          status: "error",
          variables,
          data: null,
          error: "Unable to update the user.",
        });
        return;
      }

      const updatedUser: User = {
        ...user,
        role: variables.role,
      };

      setUser(updatedUser);
      setMutation({
        status: "success",
        variables,
        data: updatedUser,
        error: null,
      });
    }, 800);
  };

  const simulateSuccess = (): void => {
    submitMutation(false);
  };

  const simulateError = (): void => {
    submitMutation(true);
  };

  const resetMutationState = (): void => {
    setMutation({
      status: "idle",
      variables: null,
      data: null,
      error: null,
    });
  };

  return (
    <main>
      <h1>Mutation State</h1>

      <h2>1. Mutation Status</h2>
      <MutationStatusDisplay status={mutation.status} />

      <h2>2. Submitted Mutation Variables</h2>
      <MutationVariablesDisplay variables={mutation.variables} />

      <h2>3. Successful Mutation Data</h2>
      <MutationDataDisplay data={mutation.data} />

      <h2>4. Mutation Error</h2>
      <MutationErrorDisplay error={mutation.error} />

      <h2>5. Complete Mutation State</h2>
      <MutationStateDisplay mutation={mutation} />

      <h2>6. Changing Mutation State</h2>
      <MutationStateControls
        isPending={mutation.status === "pending"}
        onSuccess={simulateSuccess}
        onError={simulateError}
        onReset={resetMutationState}
      />
    </main>
  );
};

export default MutationState;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// Mutation state describes the lifecycle of a server-side write operation.
// The status commonly moves between idle, pending, success, and error.
// Submitted variables describe the input used by the mutation attempt.
// Successful data represents the result returned by the mutation operation.
// Error state represents a failed mutation attempt and can contain an error message.
// Mutation state can remain pending while the previous server data is still displayed.
// Resetting mutation state clears client-side mutation information and does not undo a server operation.
// Mutation state and cached server state are separate concerns that may need to be synchronized after a mutation.
