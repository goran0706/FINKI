/**
 * Mutation Errors
 * ===============
 *
 * A mutation error occurs when an operation that changes server state fails. Unlike a query,
 * which primarily reads server state, a mutation represents an intentional server-side operation
 * such as creating, updating, or deleting a resource.
 *
 * Mutation errors commonly need to be handled differently from query errors because the user
 * initiated an action and usually needs immediate feedback about whether that action succeeded.
 * The mutation can expose its error alongside its variables, status, and previously returned data.
 *
 * A failed mutation does not automatically mean that the cached query data is invalid. The
 * application must determine whether the failed operation changed any server state before deciding
 * whether invalidation, cache updates, or rollback behavior is required.
 *
 * A mutation can also be retried explicitly. Retrying should use the same mutation variables when
 * the operation is safe to repeat, while non-idempotent operations may require additional safeguards
 * such as idempotency keys to prevent an accidental duplicate server-side effect.
 */

import type { FC, ReactElement } from "react";
import { useState } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface User {
  readonly id: number;
  readonly name: string;
  readonly role: "Admin" | "Editor" | "Viewer";
}

export interface MutationVariables {
  readonly userId: number;
  readonly role: User["role"];
}

export interface MutationError {
  readonly message: string;
  readonly statusCode?: number;
}

export interface MutationState<TData> {
  readonly data: TData | null;
  readonly error: MutationError | null;
  readonly variables: MutationVariables | null;
  readonly isPending: boolean;
}

export interface MutationErrorDisplayProps {
  readonly error: MutationError | null;
}

export interface MutationStateDisplayProps {
  readonly state: MutationState<User>;
}

export interface MutationRecoveryProps {
  readonly error: MutationError | null;
  readonly isPending: boolean;
  readonly onRetry: () => void;
}

export interface MutationResultDisplayProps {
  readonly data: User | null;
}

export interface MutationErrorExampleProps {
  readonly shouldFail: boolean;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

export const MutationErrorDisplay: FC<MutationErrorDisplayProps> = ({ error }): ReactElement => {
  if (error === null) {
    return <p>No mutation error.</p>;
  }

  return (
    <div role="alert">
      <p>Mutation failed.</p>
      <p>{error.message}</p>
      {error.statusCode !== undefined && <p>Status code: {error.statusCode}</p>}
    </div>
  );
};

export const MutationResultDisplay: FC<MutationResultDisplayProps> = ({ data }): ReactElement => {
  if (data === null) {
    return <p>No successful mutation result.</p>;
  }

  return (
    <p>
      Updated user: {data.name} — {data.role}
    </p>
  );
};

export const MutationStateDisplay: FC<MutationStateDisplayProps> = ({ state }): ReactElement => {
  return (
    <div>
      <p>Status: {state.isPending ? "pending" : state.error ? "error" : state.data ? "success" : "idle"}</p>
      {state.variables !== null && <p>Requested role: {state.variables.role}</p>}
      <MutationResultDisplay data={state.data} />
      <MutationErrorDisplay error={state.error} />
    </div>
  );
};

export const MutationRecovery: FC<MutationRecoveryProps> = ({ error, isPending, onRetry }): ReactElement => {
  if (error === null) {
    return <p>No failed mutation requires recovery.</p>;
  }

  return (
    <div>
      <p>Retrying the mutation will use the same variables.</p>
      <button type="button" disabled={isPending} onClick={onRetry}>
        {isPending ? "Retrying..." : "Retry mutation"}
      </button>
    </div>
  );
};

export const MutationErrorExample: FC<MutationErrorExampleProps> = ({ shouldFail }): ReactElement => {
  const [state, setState] = useState<MutationState<User>>({
    data: null,
    error: null,
    variables: null,
    isPending: false,
  });

  const mutate = (): void => {
    const variables: MutationVariables = {
      userId: 1,
      role: "Editor",
    };

    setState({
      data: null,
      error: null,
      variables,
      isPending: true,
    });

    window.setTimeout(() => {
      if (shouldFail) {
        setState({
          data: null,
          error: {
            message: "The server rejected the requested update.",
            statusCode: 409,
          },
          variables,
          isPending: false,
        });
        return;
      }

      setState({
        data: {
          id: variables.userId,
          name: "John Doe",
          role: variables.role,
        },
        error: null,
        variables,
        isPending: false,
      });
    }, 700);
  };

  return (
    <div>
      <MutationStateDisplay state={state} />
      <MutationRecovery error={state.error} isPending={state.isPending} onRetry={mutate} />
      <button type="button" disabled={state.isPending} onClick={mutate}>
        Run mutation
      </button>
    </div>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const MutationErrorsDemo: FC = (): ReactElement => {
  return (
    <section>
      <h2>1. Representing a Mutation Error</h2>
      <MutationErrorDisplay
        error={{
          message: "The server rejected the requested update.",
          statusCode: 409,
        }}
      />

      <h2>2. Mutation State With an Error</h2>
      <MutationStateDisplay
        state={{
          data: null,
          error: {
            message: "The requested user could not be updated.",
            statusCode: 409,
          },
          variables: {
            userId: 1,
            role: "Editor",
          },
          isPending: false,
        }}
      />

      <h2>3. Failed Mutation With Explicit Recovery</h2>
      <MutationErrorExample shouldFail={true} />

      <h2>4. Successful Mutation</h2>
      <MutationErrorExample shouldFail={false} />
    </section>
  );
};

export default MutationErrorsDemo;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// A mutation error represents a failed server-side state-changing operation.
// Mutation errors should be represented separately from query errors because the lifecycle is different.
// Mutation variables remain useful when reporting or retrying a failed operation.
// A failed mutation does not automatically mean that cached query data must be invalidated.
// The application should determine whether the server actually changed any state before updating caches.
// Explicit retry behavior allows the user or application to decide when another attempt should occur.
// Retrying is safest when the operation is idempotent or protected against duplicate effects.
// Non-idempotent mutations may require an idempotency key or another server-side deduplication mechanism.
// A successful mutation can return authoritative server data that replaces or updates client state.
// Error messages should communicate actionable information without exposing sensitive implementation details.
