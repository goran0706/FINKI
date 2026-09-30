/**
 * Mutation
 * ========
 *
 * A mutation represents an operation that changes server-side state, such as creating, updating,
 * or deleting a resource. Unlike a query, which primarily reads server state, a mutation performs
 * a write operation and may change the data that subsequent queries should observe.
 *
 * A mutation usually starts in an idle state, receives input variables, performs an asynchronous
 * server operation, and eventually produces either a successful result or an error. The mutation
 * itself does not automatically make previously fetched query data correct; applications commonly
 * follow a successful mutation with cache invalidation, refetching, or a direct cache update.
 *
 * Mutation variables are the input required by the server operation. They should describe the
 * requested change rather than represent UI state. For example, updating a user's role can use
 * `{ userId, role }` as mutation variables while the mutation function performs the actual request.
 *
 * A mutation is also distinct from an event handler. An event handler may start a mutation, but
 * the mutation represents the asynchronous server-side operation and its lifecycle independently
 * of the UI event that initiated it.
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

export interface CreateUserVariables {
  readonly name: string;
  readonly role: string;
}

export interface MutationResult<TData> {
  readonly data: TData | null;
  readonly error: string | null;
}

export interface MutationExampleProps {
  readonly user: User;
}

export interface MutationVariablesProps {
  readonly variables: UpdateUserVariables;
}

export interface MutationResultProps {
  readonly result: MutationResult<User>;
}

export interface MutationLifecycleProps {
  readonly status: "idle" | "pending" | "success" | "error";
}

export interface MutationControlsProps {
  readonly onUpdateRole: () => void;
  readonly onCreateUser: () => void;
  readonly onDeleteUser: () => void;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

export const MutationExample: FC<MutationExampleProps> = ({ user }): ReactElement => {
  return (
    <div>
      <p>User ID: {user.id}</p>
      <p>Name: {user.name}</p>
      <p>Role: {user.role}</p>
    </div>
  );
};

export const MutationVariables: FC<MutationVariablesProps> = ({ variables }): ReactElement => {
  return (
    <div>
      <p>User ID: {variables.userId}</p>
      <p>Requested role: {variables.role}</p>
    </div>
  );
};

export const MutationResult: FC<MutationResultProps> = ({ result }): ReactElement => {
  return (
    <div>
      <p>Result: {result.data === null ? "No successful result" : `${result.data.name} — ${result.data.role}`}</p>
      <p>Error: {result.error ?? "None"}</p>
    </div>
  );
};

export const MutationLifecycle: FC<MutationLifecycleProps> = ({ status }): ReactElement => {
  return (
    <div>
      <p>Mutation status: {status}</p>
      <p>
        {status === "idle" && "No mutation has been started."}
        {status === "pending" && "The server operation is in progress."}
        {status === "success" && "The server operation completed successfully."}
        {status === "error" && "The server operation failed."}
      </p>
    </div>
  );
};

export const MutationControls: FC<MutationControlsProps> = ({
  onUpdateRole,
  onCreateUser,
  onDeleteUser,
}): ReactElement => {
  return (
    <div>
      <button type="button" onClick={onUpdateRole}>
        Update Role
      </button>
      <button type="button" onClick={onCreateUser}>
        Create User
      </button>
      <button type="button" onClick={onDeleteUser}>
        Delete User
      </button>
    </div>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const Mutation = (): ReactElement => {
  const [user, setUser] = useState<User>({
    id: 1,
    name: "John Doe",
    role: "Developer",
  });
  const [status, setStatus] = useState<"idle" | "pending" | "success" | "error">("idle");
  const [result, setResult] = useState<MutationResult<User>>({
    data: null,
    error: null,
  });

  const updateRole = (): void => {
    const variables: UpdateUserVariables = {
      userId: user.id,
      role: user.role === "Developer" ? "Admin" : "Developer",
    };

    setStatus("pending");
    setResult({
      data: null,
      error: null,
    });

    window.setTimeout((): void => {
      const updatedUser: User = {
        ...user,
        role: variables.role,
      };

      setUser(updatedUser);
      setResult({
        data: updatedUser,
        error: null,
      });
      setStatus("success");
    }, 800);
  };

  const createUser = (): void => {
    const variables: CreateUserVariables = {
      name: "Jane Doe",
      role: "Developer",
    };

    setStatus("pending");
    setResult({
      data: null,
      error: null,
    });

    window.setTimeout((): void => {
      const createdUser: User = {
        id: 2,
        name: variables.name,
        role: variables.role,
      };

      setUser(createdUser);
      setResult({
        data: createdUser,
        error: null,
      });
      setStatus("success");
    }, 800);
  };

  const deleteUser = (): void => {
    setStatus("pending");
    setResult({
      data: null,
      error: null,
    });

    window.setTimeout((): void => {
      setUser({
        id: 0,
        name: "No user",
        role: "Deleted",
      });
      setResult({
        data: null,
        error: null,
      });
      setStatus("success");
    }, 800);
  };

  const reset = (): void => {
    setUser({
      id: 1,
      name: "John Doe",
      role: "Developer",
    });
    setStatus("idle");
    setResult({
      data: null,
      error: null,
    });
  };

  const updateVariables: UpdateUserVariables = {
    userId: user.id,
    role: user.role === "Developer" ? "Admin" : "Developer",
  };

  return (
    <main>
      <h1>Mutation</h1>

      <h2>1. Server State Being Changed</h2>
      <MutationExample user={user} />

      <h2>2. Mutation Variables</h2>
      <MutationVariables variables={updateVariables} />

      <h2>3. Mutation Lifecycle</h2>
      <MutationLifecycle status={status} />

      <h2>4. Mutation Result</h2>
      <MutationResult result={result} />

      <h2>5. Starting Mutations</h2>
      <MutationControls onUpdateRole={updateRole} onCreateUser={createUser} onDeleteUser={deleteUser} />

      <button type="button" onClick={reset}>
        Reset
      </button>
    </main>
  );
};

export default Mutation;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// A mutation represents an operation that changes server-side state.
// Mutations commonly create, update, or delete server-side resources.
// Mutation variables contain the input required to perform the requested server operation.
// A mutation can move through idle, pending, success, and error states.
// A successful mutation produces a result that can be used to update the UI or synchronize cached data.
// Starting a mutation from an event handler does not make the event handler itself the mutation.
// Mutations do not automatically guarantee that previously cached query data is synchronized.
// Applications commonly invalidate, refetch, or update related cached data after a successful mutation.
