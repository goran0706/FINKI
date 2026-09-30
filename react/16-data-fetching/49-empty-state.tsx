/**
 * Empty State
 * ===========
 *
 * An empty state represents a successful or valid application state in which
 * there is currently no resource to display. For a collection request, this
 * commonly means the server returned an empty array. For a nullable resource,
 * it can mean the request succeeded but no matching entity exists.
 *
 * Internally, an empty result is different from loading and error. Loading means
 * the request is still unresolved, while error means the operation failed.
 * Empty means the operation completed successfully but produced no displayable
 * resource. Keeping these states separate prevents UI code from interpreting
 * an empty array as a failure or an absent resource as a network problem.
 *
 * An empty state can also be caused by valid filtering. A collection may contain
 * records before a filter is applied and contain zero records afterward. The
 * request itself can still be successful, so the UI can provide a message
 * appropriate to the active filter instead of displaying a generic error.
 *
 * A common edge case is distinguishing "no data exists" from "data has not been
 * loaded yet." An initially empty local array is not enough to determine that a
 * request returned zero records. A separate request state or an explicit
 * loaded flag is needed to make that distinction.
 *
 * Another misconception is that an empty state should always offer a retry
 * action. If the empty result is valid and expected, the appropriate action may
 * instead be creating a resource, changing a filter, or simply acknowledging
 * that there is nothing to display.
 */

import React, { useState } from "react";
import axios, { AxiosInstance, AxiosResponse } from "axios";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface User {
  readonly id: number;
  readonly name: string;
  readonly email: string;
}

export interface CollectionState {
  readonly status: "idle" | "loading" | "success" | "error";
  readonly users: readonly User[];
  readonly error: string | null;
}

export interface EmptyStateExampleProps {
  readonly client: AxiosInstance;
}

export interface EmptyStateNullableExampleProps {
  readonly client: AxiosInstance;
}

export interface EmptyStateFilterExampleProps {
  readonly client: AxiosInstance;
}

export interface EmptyStateInitialExampleProps {
  readonly client: AxiosInstance;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * Demonstrates an empty collection as a successful result.
 *
 * The response type is an array, so an empty array is a valid successful value.
 * The component checks the request status before displaying the empty message,
 * ensuring that the initial state is not mistaken for a completed empty result.
 */
export const EmptyStateExample: React.FC<EmptyStateExampleProps> = ({
  client,
}: EmptyStateExampleProps): React.ReactElement => {
  const [state, setState] = useState<CollectionState>({
    status: "idle",
    users: [],
    error: null,
  });

  const handleRequest = async (): Promise<void> => {
    setState({
      status: "loading",
      users: [],
      error: null,
    });

    try {
      const response: AxiosResponse<readonly User[]> = await client.get<readonly User[]>("/users");

      setState({
        status: "success",
        users: response.data,
        error: null,
      });
    } catch (requestError: unknown) {
      const message: string = axios.isAxiosError(requestError)
        ? requestError.message
        : requestError instanceof Error
          ? requestError.message
          : "The request failed.";

      setState({
        status: "error",
        users: [],
        error: message,
      });
    }
  };

  return (
    <section>
      <button type="button" onClick={handleRequest} disabled={state.status === "loading"}>
        {state.status === "loading" ? "Loading..." : "Load Users"}
      </button>

      {state.status === "idle" && <p>Users have not been requested yet.</p>}

      {state.status === "loading" && <p aria-live="polite">Loading users...</p>}

      {state.status === "success" && state.users.length === 0 && <p>No users are available.</p>}

      {state.status === "success" && state.users.length > 0 && (
        <ul>
          {state.users.map((user: User): React.ReactElement => (
            <li key={user.id}>{user.name}</li>
          ))}
        </ul>
      )}

      {state.status === "error" && state.error !== null && <p role="alert">{state.error}</p>}
    </section>
  );
};

/**
 * Demonstrates an empty state for a nullable resource.
 *
 * A successful response can contain null when no matching resource exists.
 * The null value is therefore rendered as an empty state instead of being
 * treated as a failed request.
 */
export const EmptyStateNullableExample: React.FC<EmptyStateNullableExampleProps> = ({
  client,
}: EmptyStateNullableExampleProps): React.ReactElement => {
  const [user, setUser] = useState<User | null | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleRequest = async (): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const response: AxiosResponse<User | null> = await client.get<User | null>("/users/1");

      setUser(response.data);
    } catch (requestError: unknown) {
      setUser(undefined);

      const message: string = axios.isAxiosError(requestError)
        ? requestError.message
        : requestError instanceof Error
          ? requestError.message
          : "The request failed.";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <button type="button" onClick={handleRequest} disabled={loading}>
        {loading ? "Searching..." : "Find User"}
      </button>

      {loading && <p aria-live="polite">Searching for the user...</p>}

      {!loading && error === null && user === null && <p>No matching user was found.</p>}

      {!loading && error === null && user !== null && user !== undefined && (
        <p>
          Found {user.name} — {user.email}
        </p>
      )}

      {error !== null && <p role="alert">{error}</p>}
    </section>
  );
};

/**
 * Demonstrates an empty state caused by a valid filter.
 *
 * Filtering is separate from request failure. A successful request can return
 * records, while the active client-side filter can reduce the displayed
 * collection to zero items.
 */
export const EmptyStateFilterExample: React.FC<EmptyStateFilterExampleProps> = ({
  client,
}: EmptyStateFilterExampleProps): React.ReactElement => {
  const [users, setUsers] = useState<readonly User[] | null>(null);
  const [filter, setFilter] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleRequest = async (): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const response: AxiosResponse<readonly User[]> = await client.get<readonly User[]>("/users");

      setUsers(response.data);
    } catch (requestError: unknown) {
      setUsers(null);

      const message: string = axios.isAxiosError(requestError)
        ? requestError.message
        : requestError instanceof Error
          ? requestError.message
          : "The request failed.";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setFilter(event.target.value);
  };

  const filteredUsers: readonly User[] =
    users?.filter((user: User): boolean => user.name.toLowerCase().includes(filter.toLowerCase())) ?? [];

  return (
    <section>
      <button type="button" onClick={handleRequest} disabled={loading}>
        {loading ? "Loading..." : "Load Users"}
      </button>

      <label>
        Filter users
        <input type="text" value={filter} onChange={handleFilterChange} disabled={users === null || loading} />
      </label>

      {loading && <p aria-live="polite">Loading users...</p>}

      {!loading && error === null && users !== null && filteredUsers.length === 0 && (
        <p>No users match the current filter.</p>
      )}

      {!loading && error === null && filteredUsers.length > 0 && (
        <ul>
          {filteredUsers.map((user: User): React.ReactElement => (
            <li key={user.id}>{user.name}</li>
          ))}
        </ul>
      )}

      {error !== null && <p role="alert">{error}</p>}
    </section>
  );
};

/**
 * Demonstrates why an initial empty array should not automatically render an
 * empty state.
 *
 * The users array begins empty before any request occurs. The explicit status
 * value distinguishes that initial condition from a successful response that
 * intentionally contains zero records.
 */
export const EmptyStateInitialExample: React.FC<EmptyStateInitialExampleProps> = ({
  client,
}: EmptyStateInitialExampleProps): React.ReactElement => {
  const [users, setUsers] = useState<readonly User[]>([]);
  const [loaded, setLoaded] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const handleRequest = async (): Promise<void> => {
    setLoading(true);

    try {
      const response: AxiosResponse<readonly User[]> = await client.get<readonly User[]>("/users");

      setUsers(response.data);
      setLoaded(true);
    } catch {
      setLoaded(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <button type="button" onClick={handleRequest} disabled={loading}>
        {loading ? "Loading..." : "Load Users"}
      </button>

      {!loaded && !loading && <p>No request has completed yet.</p>}

      {loading && <p aria-live="polite">Waiting for the response...</p>}

      {loaded && users.length === 0 && <p>The request succeeded, but there are no users.</p>}

      {loaded && users.length > 0 && (
        <p>
          {users.length} user
          {users.length === 1 ? "" : "s"} loaded.
        </p>
      )}
    </section>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const apiClient: AxiosInstance = axios.create({
  baseURL: "https://api.example.com",
  timeout: 5000,
  headers: {
    Accept: "application/json",
  },
});

export const EmptyStateDemo: React.FC = (): React.ReactElement => {
  return (
    <main>
      <h1>Empty State</h1>

      <h2>1. Render an Empty Collection as a Successful Result</h2>
      <EmptyStateExample client={apiClient} />

      <h2>2. Render a Nullable Resource as an Empty Result</h2>
      <EmptyStateNullableExample client={apiClient} />

      <h2>3. Distinguish an Empty Filter Result From a Request Error</h2>
      <EmptyStateFilterExample client={apiClient} />

      <h2>4. Distinguish Initial Empty Data From a Loaded Empty Result</h2>
      <EmptyStateInitialExample client={apiClient} />
    </main>
  );
};

export default EmptyStateDemo;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - An empty state means there is no displayable resource, not that the request failed.
// - An empty array can be a valid successful collection response.
// - A nullable resource can use null to represent a successful absence.
// - Filtering can produce an empty display without indicating a request failure.
// - Initial empty local data should not automatically be treated as a completed empty result.
// - Explicit request state distinguishes idle, loading, success, and error conditions.
// - Empty-state actions should reflect the reason the result is empty rather than assuming a retry is required.
