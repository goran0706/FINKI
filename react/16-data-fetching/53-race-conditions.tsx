/**
 * Race Conditions
 * ===============
 *
 * A race condition occurs when multiple asynchronous operations overlap and
 * their completion order differs from their start order. In a React request
 * flow, this can cause an older response to update state after a newer request
 * has already started or completed.
 *
 * Network requests do not guarantee completion order. If request A starts first
 * and request B starts later, B may finish before A. If both responses write to
 * the same state without coordination, the final state can represent A even
 * though B was the latest request initiated by the user.
 *
 * One way to prevent stale results is to associate each request with a
 * monotonically increasing identifier. Before applying a response, the
 * component compares that identifier with the identifier of the latest request.
 * Only the current request is allowed to update the result.
 *
 * Another approach is cancellation. When a new request replaces an older one,
 * an AbortController can signal the older operation to stop. Cancellation
 * reduces unnecessary work, but it should not be the only correctness mechanism
 * because cancellation behavior depends on the asynchronous API and an
 * operation may already have completed.
 *
 * A common edge case occurs when a component unmounts while a request is still
 * pending. Cleanup should prevent the obsolete operation from updating the
 * component after it is no longer relevant.
 *
 * Another misconception is that making a request asynchronous automatically
 * preserves request order. Promise resolution order is independent of the
 * order in which Promises were created, so application code must explicitly
 * define which result is allowed to become current.
 */

import React, { useEffect, useRef, useState } from "react";
import axios, { AxiosInstance, AxiosResponse } from "axios";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface User {
  readonly id: number;
  readonly name: string;
  readonly email: string;
}

export interface RaceConditionStaleResponseExampleProps {
  readonly client: AxiosInstance;
}

export interface RaceConditionSequenceExampleProps {
  readonly client: AxiosInstance;
}

export interface RaceConditionCancellationExampleProps {
  readonly client: AxiosInstance;
}

export interface RaceConditionCleanupExampleProps {
  readonly client: AxiosInstance;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * Demonstrates how an older response can overwrite a newer result.
 *
 * Both requests write to the same state without checking which request is
 * current. If the first request resolves after the second request, its older
 * data can become the final rendered result.
 */
export const RaceConditionStaleResponseExample: React.FC<RaceConditionStaleResponseExampleProps> = ({
  client,
}: RaceConditionStaleResponseExampleProps): React.ReactElement => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("No request has completed.");

  const handleRequest = async (userId: number): Promise<void> => {
    setLoading(true);
    setMessage(`Request for user ${userId} started.`);

    try {
      const response: AxiosResponse<User> = await client.get<User>(`/users/${userId}`);

      setUser(response.data);
      setMessage(`Response for user ${userId} was applied.`);
    } catch {
      setMessage(`Request for user ${userId} failed.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <button
        type="button"
        onClick={(): void => {
          void handleRequest(1);
        }}
        disabled={loading}
      >
        Request User 1
      </button>

      <button
        type="button"
        onClick={(): void => {
          void handleRequest(2);
        }}
        disabled={loading}
      >
        Request User 2
      </button>

      <p role="status">{message}</p>

      {user !== null && <p>Displayed user: {user.name}</p>}
    </section>
  );
};

/**
 * Prevents stale responses by assigning every request a sequence number.
 *
 * The latest sequence number is stored in a ref because it represents mutable
 * request coordination rather than data that should itself trigger rendering.
 * A response is applied only when its sequence number is still current.
 */
export const RaceConditionSequenceExample: React.FC<RaceConditionSequenceExampleProps> = ({
  client,
}: RaceConditionSequenceExampleProps): React.ReactElement => {
  const requestSequenceRef = useRef<number>(0);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("No request has completed.");

  const handleRequest = async (userId: number): Promise<void> => {
    const requestSequence: number = requestSequenceRef.current + 1;

    requestSequenceRef.current = requestSequence;
    setLoading(true);
    setMessage(`Request ${requestSequence} for user ${userId} started.`);

    try {
      const response: AxiosResponse<User> = await client.get<User>(`/users/${userId}`);

      if (requestSequence !== requestSequenceRef.current) {
        return;
      }

      setUser(response.data);
      setMessage(`Current request ${requestSequence} was applied.`);
    } catch (error: unknown) {
      if (requestSequence !== requestSequenceRef.current) {
        return;
      }

      setMessage(axios.isAxiosError(error) ? `Request failed: ${error.message}` : "Request failed.");
    } finally {
      if (requestSequence === requestSequenceRef.current) {
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

      {loading && <p aria-live="polite">Waiting for the latest request...</p>}

      {user !== null && <p>Current user: {user.name}</p>}
    </section>
  );
};

/**
 * Prevents obsolete requests by aborting the previous request.
 *
 * The active AbortController is stored in a ref. Starting a new request first
 * aborts the previous operation and then creates a fresh controller for the new
 * operation.
 */
export const RaceConditionCancellationExample: React.FC<RaceConditionCancellationExampleProps> = ({
  client,
}: RaceConditionCancellationExampleProps): React.ReactElement => {
  const controllerRef = useRef<AbortController | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [message, setMessage] = useState<string>("No request is active.");

  const handleRequest = async (userId: number): Promise<void> => {
    controllerRef.current?.abort();

    const controller: AbortController = new AbortController();

    controllerRef.current = controller;
    setMessage(`Request for user ${userId} is active.`);

    try {
      const response: AxiosResponse<User> = await client.get<User>(`/users/${userId}`, {
        signal: controller.signal,
      });

      if (controller.signal.aborted || controllerRef.current !== controller) {
        return;
      }

      setUser(response.data);
      setMessage(`User ${userId} was applied.`);
    } catch (error: unknown) {
      if (axios.isCancel(error)) {
        return;
      }

      if (controllerRef.current === controller) {
        setMessage("The current request failed.");
      }
    } finally {
      if (controllerRef.current === controller) {
        controllerRef.current = null;
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

      {user !== null && <p>Current user: {user.name}</p>}
    </section>
  );
};

/**
 * Prevents a request from applying its result after effect cleanup.
 *
 * The active flag belongs to the specific effect execution. Cleanup changes
 * that flag, so a response belonging to an obsolete effect cannot update the
 * component's state.
 */
export const RaceConditionCleanupExample: React.FC<RaceConditionCleanupExampleProps> = ({
  client,
}: RaceConditionCleanupExampleProps): React.ReactElement => {
  const [userId, setUserId] = useState<number>(1);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect((): (() => void) => {
    let active: boolean = true;

    setLoading(true);

    const loadUser = async (): Promise<void> => {
      try {
        const response: AxiosResponse<User> = await client.get<User>(`/users/${userId}`);

        if (!active) {
          return;
        }

        setUser(response.data);
      } catch {
        if (!active) {
          return;
        }

        setUser(null);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void loadUser();

    return (): void => {
      active = false;
    };
  }, [client, userId]);

  return (
    <section>
      <button
        type="button"
        onClick={(): void => {
          setUserId((previous: number): number => (previous === 1 ? 2 : 1));
        }}
      >
        Load Another User
      </button>

      {loading && <p aria-live="polite">Loading user {userId}...</p>}

      {!loading && user !== null && <p>Loaded user: {user.name}</p>}
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

export const RaceConditionsDemo: React.FC = (): React.ReactElement => {
  return (
    <main>
      <h1>Race Conditions</h1>

      <h2>1. Observe How Completion Order Can Produce Stale Data</h2>
      <RaceConditionStaleResponseExample client={apiClient} />

      <h2>2. Ignore Responses From Older Requests</h2>
      <RaceConditionSequenceExample client={apiClient} />

      <h2>3. Cancel the Previous Request When Replacing It</h2>
      <RaceConditionCancellationExample client={apiClient} />

      <h2>4. Prevent Obsolete Effect Results After Cleanup</h2>
      <RaceConditionCleanupExample client={apiClient} />
    </main>
  );
};

export default RaceConditionsDemo;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Concurrent asynchronous requests can complete in a different order from their start order.
// - Without coordination, an older response can overwrite newer application state.
// - A monotonically increasing request sequence can identify which response is current.
// - AbortController can cancel an obsolete request when a newer request replaces it.
// - Cancellation reduces unnecessary work but should not be the only correctness guard.
// - Effect cleanup can invalidate results from an obsolete effect execution.
// - Promise creation order does not guarantee Promise completion order.
// - Race-condition handling should explicitly define which asynchronous result is allowed to update state.
