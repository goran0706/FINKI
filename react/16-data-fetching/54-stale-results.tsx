/**
 * Stale Results
 * =============
 *
 * A stale result is data produced by an asynchronous operation that is no
 * longer the current result for the UI. Staleness commonly occurs when a newer
 * request starts before an older request finishes and the older response
 * resolves later.
 *
 * React does not automatically determine whether an asynchronous result is
 * still relevant. State updates are applied when their callbacks execute, so
 * request code must explicitly establish which result is current.
 *
 * A request sequence number is one reliable strategy. Each request receives a
 * monotonically increasing identifier, and the response is applied only when
 * its identifier matches the latest identifier. A request-specific AbortSignal
 * is another strategy, but cancellation and stale-result protection solve
 * slightly different problems: cancellation attempts to stop obsolete work,
 * while result validation prevents obsolete data from being committed.
 *
 * Stale results can also appear with search inputs. A user may type several
 * values quickly, causing multiple searches to overlap. The response for an
 * earlier query can arrive after the response for the latest query and replace
 * the current results with data for an old query.
 *
 * A common edge case is a failed old request completing after a newer request
 * has started. The old failure should not replace the loading or successful
 * state belonging to the newer request.
 *
 * Another misconception is that checking a component's mounted status is enough
 * to prevent stale data. A component can remain mounted while several requests
 * are active, so mounted-state checks do not establish which request is current.
 */

import React, { useRef, useState } from "react";
import axios, { AxiosInstance, AxiosResponse } from "axios";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface User {
  readonly id: number;
  readonly name: string;
  readonly email: string;
}

export interface StaleResultsSequenceExampleProps {
  readonly client: AxiosInstance;
}

export interface StaleResultsSearchExampleProps {
  readonly client: AxiosInstance;
}

export interface StaleResultsErrorExampleProps {
  readonly client: AxiosInstance;
}

export interface StaleResultsCancellationExampleProps {
  readonly client: AxiosInstance;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * Demonstrates rejecting a stale response with a request sequence identifier.
 *
 * Every request receives a new sequence number. A response is allowed to update
 * state only when its sequence number is still the latest stored identifier.
 */
export const StaleResultsSequenceExample: React.FC<StaleResultsSequenceExampleProps> = ({
  client,
}: StaleResultsSequenceExampleProps): React.ReactElement => {
  const latestRequestRef = useRef<number>(0);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("No request has completed.");

  const handleRequest = async (userId: number): Promise<void> => {
    const requestId: number = latestRequestRef.current + 1;

    latestRequestRef.current = requestId;
    setLoading(true);
    setMessage(`Request ${requestId} for user ${userId} started.`);

    try {
      const response: AxiosResponse<User> = await client.get<User>(`/users/${userId}`);

      if (requestId !== latestRequestRef.current) {
        return;
      }

      setUser(response.data);
      setMessage(`Request ${requestId} produced the current result.`);
    } catch (error: unknown) {
      if (requestId !== latestRequestRef.current) {
        return;
      }

      const errorMessage: string = axios.isAxiosError(error) ? error.message : "The request failed.";

      setMessage(errorMessage);
    } finally {
      if (requestId === latestRequestRef.current) {
        setLoading(false);
      }
    }
  };

  return (
    <section>
      <button
        type="button"
        onClick={(): void => {
          void handleRequest(1);
        }}
      >
        Request User 1
      </button>

      <button
        type="button"
        onClick={(): void => {
          void handleRequest(2);
        }}
      >
        Request User 2
      </button>

      <p role="status">{message}</p>

      {loading && <p aria-live="polite">Waiting for the current result...</p>}

      {user !== null && <p>Current user: {user.name}</p>}
    </section>
  );
};

/**
 * Demonstrates stale-result protection for rapidly changing search queries.
 *
 * The query that created a response is captured by that request's callback.
 * Only the request associated with the latest query is allowed to replace the
 * displayed search results.
 */
export const StaleResultsSearchExample: React.FC<StaleResultsSearchExampleProps> = ({
  client,
}: StaleResultsSearchExampleProps): React.ReactElement => {
  const latestRequestRef = useRef<number>(0);
  const [query, setQuery] = useState<string>("");
  const [users, setUsers] = useState<readonly User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("Enter a query and search.");

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setQuery(event.target.value);
  };

  const handleSearch = async (): Promise<void> => {
    const normalizedQuery: string = query.trim();

    if (normalizedQuery === "") {
      setUsers([]);
      setMessage("Enter a search query.");
      return;
    }

    const requestId: number = latestRequestRef.current + 1;

    latestRequestRef.current = requestId;
    setLoading(true);
    setMessage(`Searching for "${normalizedQuery}"...`);

    try {
      const response: AxiosResponse<readonly User[]> = await client.get<readonly User[]>("/users", {
        params: {
          search: normalizedQuery,
        },
      });

      if (requestId !== latestRequestRef.current) {
        return;
      }

      setUsers(response.data);
      setMessage(`Results for "${normalizedQuery}" are current.`);
    } catch (error: unknown) {
      if (requestId !== latestRequestRef.current) {
        return;
      }

      setUsers([]);

      const errorMessage: string = axios.isAxiosError(error) ? error.message : "Search failed.";

      setMessage(errorMessage);
    } finally {
      if (requestId === latestRequestRef.current) {
        setLoading(false);
      }
    }
  };

  return (
    <section>
      <label>
        Search users
        <input type="search" value={query} onChange={handleQueryChange} />
      </label>

      <button type="button" onClick={handleSearch} disabled={loading}>
        {loading ? "Searching..." : "Search"}
      </button>

      <p role="status">{message}</p>

      {!loading && users.length > 0 && (
        <ul>
          {users.map((user: User): React.ReactElement => (
            <li key={user.id}>{user.name}</li>
          ))}
        </ul>
      )}

      {!loading && users.length === 0 && query.trim() !== "" && <p>No current results.</p>}
    </section>
  );
};

/**
 * Demonstrates ignoring stale errors as well as stale successes.
 *
 * Both successful and failed responses use the same request identifier check,
 * preventing an older failure from replacing the state of a newer request.
 */
export const StaleResultsErrorExample: React.FC<StaleResultsErrorExampleProps> = ({
  client,
}: StaleResultsErrorExampleProps): React.ReactElement => {
  const latestRequestRef = useRef<number>(0);
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleRequest = async (userId: number): Promise<void> => {
    const requestId: number = latestRequestRef.current + 1;

    latestRequestRef.current = requestId;
    setLoading(true);
    setError(null);

    try {
      const response: AxiosResponse<User> = await client.get<User>(`/users/${userId}`);

      if (requestId !== latestRequestRef.current) {
        return;
      }

      setUser(response.data);
    } catch (requestError: unknown) {
      if (requestId !== latestRequestRef.current) {
        return;
      }

      setUser(null);

      const message: string = axios.isAxiosError(requestError) ? requestError.message : "The request failed.";

      setError(message);
    } finally {
      if (requestId === latestRequestRef.current) {
        setLoading(false);
      }
    }
  };

  return (
    <section>
      <button
        type="button"
        onClick={(): void => {
          void handleRequest(1);
        }}
      >
        Request User 1
      </button>

      <button
        type="button"
        onClick={(): void => {
          void handleRequest(999);
        }}
      >
        Request User 999
      </button>

      {loading && <p aria-live="polite">Current request is loading...</p>}

      {!loading && error !== null && <p role="alert">{error}</p>}

      {!loading && error === null && user !== null && <p>Current user: {user.name}</p>}
    </section>
  );
};

/**
 * Demonstrates combining stale-result validation with cancellation.
 *
 * Cancellation prevents unnecessary work when possible, while the request
 * identifier remains a correctness guard if the previous operation has already
 * settled or cancellation cannot prevent every asynchronous completion path.
 */
export const StaleResultsCancellationExample: React.FC<StaleResultsCancellationExampleProps> = ({
  client,
}: StaleResultsCancellationExampleProps): React.ReactElement => {
  const latestRequestRef = useRef<number>(0);
  const controllerRef = useRef<AbortController | null>(null);

  const [user, setUser] = useState<User | null>(null);
  const [message, setMessage] = useState<string>("No request is active.");

  const handleRequest = async (userId: number): Promise<void> => {
    controllerRef.current?.abort();

    const controller: AbortController = new AbortController();

    const requestId: number = latestRequestRef.current + 1;

    latestRequestRef.current = requestId;
    controllerRef.current = controller;

    setMessage(`Request ${requestId} for user ${userId} started.`);

    try {
      const response: AxiosResponse<User> = await client.get<User>(`/users/${userId}`, {
        signal: controller.signal,
      });

      if (controller.signal.aborted || requestId !== latestRequestRef.current) {
        return;
      }

      setUser(response.data);
      setMessage(`Request ${requestId} is the current result.`);
    } catch (error: unknown) {
      if (axios.isCancel(error)) {
        return;
      }

      if (requestId !== latestRequestRef.current) {
        return;
      }

      setMessage(axios.isAxiosError(error) ? error.message : "The current request failed.");
    } finally {
      if (controllerRef.current === controller && requestId === latestRequestRef.current) {
        controllerRef.current = null;
      }
    }
  };

  const handleCancel = (): void => {
    controllerRef.current?.abort();
  };

  return (
    <section>
      <button
        type="button"
        onClick={(): void => {
          void handleRequest(1);
        }}
      >
        Request User 1
      </button>

      <button
        type="button"
        onClick={(): void => {
          void handleRequest(2);
        }}
      >
        Request User 2
      </button>

      <button type="button" onClick={handleCancel}>
        Cancel Current Request
      </button>

      <p role="status">{message}</p>

      {user !== null && <p>Current user: {user.name}</p>}
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

export const StaleResultsDemo: React.FC = (): React.ReactElement => {
  return (
    <main>
      <h1>Stale Results</h1>

      <h2>1. Ignore Responses From Older Requests</h2>
      <StaleResultsSequenceExample client={apiClient} />

      <h2>2. Prevent Old Search Results From Replacing New Results</h2>
      <StaleResultsSearchExample client={apiClient} />

      <h2>3. Ignore Stale Errors as Well as Stale Successes</h2>
      <StaleResultsErrorExample client={apiClient} />

      <h2>4. Combine Cancellation With Stale-Result Validation</h2>
      <StaleResultsCancellationExample client={apiClient} />
    </main>
  );
};

export default StaleResultsDemo;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - A stale result belongs to an asynchronous operation that is no longer current.
// - Promise completion order can differ from request start order.
// - A request sequence identifier can prevent obsolete responses from updating state.
// - Stale-result checks should apply to both successful responses and failures.
// - Search interfaces are especially susceptible to stale results when requests overlap.
// - AbortController can reduce unnecessary work by cancelling obsolete requests.
// - Cancellation and sequence validation provide different protections and can be combined.
// - Component mounted state alone does not determine whether a completed request is still relevant.
