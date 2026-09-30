/**
 * Loading State
 * =============
 *
 * A loading state represents an asynchronous operation that has started but has
 * not completed. In React, loading is commonly stored as a boolean or as one
 * branch of a discriminated request-state union.
 *
 * Internally, loading state changes when an operation begins and when it settles.
 * The state should be set to true immediately before starting the asynchronous
 * operation and reset after success, failure, or cancellation. Using finally is
 * useful when the same cleanup is required for both fulfilled and rejected
 * Promises.
 *
 * A loading indicator should describe the operation that is actually pending.
 * For a single request, a boolean can be sufficient. When several independent
 * requests can run simultaneously, one shared boolean can become incorrect:
 * one request may finish while another is still active. In that case, each
 * operation needs independent state or an active-request counter.
 *
 * A common edge case is a user clicking a request button repeatedly. Disabling
 * the initiating control while its operation is pending can prevent accidental
 * duplicate requests, but it does not by itself protect against requests
 * started by other parts of the application.
 *
 * Another misconception is that loading state means the UI must become empty.
 * Existing data can remain visible while a refresh is in progress, with loading
 * represented separately from the currently displayed data.
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

export interface LoadingStateExampleProps {
  readonly client: AxiosInstance;
}

export interface LoadingWithDataExampleProps {
  readonly client: AxiosInstance;
}

export interface IndependentLoadingStateExampleProps {
  readonly client: AxiosInstance;
}

export interface LoadingErrorExampleProps {
  readonly client: AxiosInstance;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * Demonstrates a basic boolean loading state.
 *
 * The state becomes true before the request starts and false in finally so the
 * indicator is removed after either a successful or failed request.
 */
export const LoadingStateExample: React.FC<LoadingStateExampleProps> = ({
  client,
}: LoadingStateExampleProps): React.ReactElement => {
  const [loading, setLoading] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);

  const handleRequest = async (): Promise<void> => {
    setLoading(true);

    try {
      const response: AxiosResponse<User> = await client.get<User>("/users/1");

      setUser(response.data);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <button type="button" onClick={handleRequest} disabled={loading}>
        {loading ? "Loading..." : "Load User"}
      </button>

      {loading && <p aria-live="polite">Loading user data...</p>}

      {user !== null && (
        <p>
          {user.name} — {user.email}
        </p>
      )}
    </section>
  );
};

/**
 * Demonstrates preserving existing data during loading.
 *
 * Loading state is independent from data state, so a refresh can display an
 * indicator without temporarily removing the previously loaded user.
 */
export const LoadingWithDataExample: React.FC<LoadingWithDataExampleProps> = ({
  client,
}: LoadingWithDataExampleProps): React.ReactElement => {
  const [loading, setLoading] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleRequest = async (): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const response: AxiosResponse<User> = await client.get<User>("/users/1");

      setUser(response.data);
    } catch {
      setError("The refresh failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <button type="button" onClick={handleRequest} disabled={loading}>
        {loading ? "Refreshing..." : "Refresh User"}
      </button>

      {loading && <p aria-live="polite">Refreshing without clearing existing data...</p>}

      {user !== null && (
        <p>
          {user.name} — {user.email}
        </p>
      )}

      {error !== null && <p role="alert">{error}</p>}
    </section>
  );
};

/**
 * Demonstrates independent loading state for multiple operations.
 *
 * Each request has its own boolean, so completing one operation does not hide
 * the loading indicator for another operation that is still running.
 */
export const IndependentLoadingStateExample: React.FC<IndependentLoadingStateExampleProps> = ({
  client,
}: IndependentLoadingStateExampleProps): React.ReactElement => {
  const [loadingUser, setLoadingUser] = useState<boolean>(false);
  const [loadingSecondUser, setLoadingSecondUser] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [secondUser, setSecondUser] = useState<User | null>(null);

  const handleLoadUser = async (): Promise<void> => {
    setLoadingUser(true);

    try {
      const response: AxiosResponse<User> = await client.get<User>("/users/1");

      setUser(response.data);
    } finally {
      setLoadingUser(false);
    }
  };

  const handleLoadSecondUser = async (): Promise<void> => {
    setLoadingSecondUser(true);

    try {
      const response: AxiosResponse<User> = await client.get<User>("/users/2");

      setSecondUser(response.data);
    } finally {
      setLoadingSecondUser(false);
    }
  };

  return (
    <section>
      <div>
        <button type="button" onClick={handleLoadUser} disabled={loadingUser}>
          {loadingUser ? "Loading User 1..." : "Load User 1"}
        </button>

        {user !== null && <p>{user.name}</p>}
      </div>

      <div>
        <button type="button" onClick={handleLoadSecondUser} disabled={loadingSecondUser}>
          {loadingSecondUser ? "Loading User 2..." : "Load User 2"}
        </button>

        {secondUser !== null && <p>{secondUser.name}</p>}
      </div>
    </section>
  );
};

/**
 * Demonstrates that loading must be cleared after failure.
 *
 * Without finally or equivalent cleanup, a rejected request can leave the
 * component permanently displaying its loading state.
 */
export const LoadingErrorExample: React.FC<LoadingErrorExampleProps> = ({
  client,
}: LoadingErrorExampleProps): React.ReactElement => {
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  const handleRequest = async (): Promise<void> => {
    setLoading(true);
    setMessage("");

    try {
      await client.get<User>("/users/invalid");

      setMessage("Request completed.");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setMessage(`Request failed: ${error.message}`);
      } else if (error instanceof Error) {
        setMessage(`Request failed: ${error.message}`);
      } else {
        setMessage("Request failed.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <button type="button" onClick={handleRequest} disabled={loading}>
        {loading ? "Waiting..." : "Start Request"}
      </button>

      {loading && <p aria-live="polite">Request is still in progress.</p>}

      {message !== "" && <p role="status">{message}</p>}
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

export const LoadingStateDemo: React.FC = (): React.ReactElement => {
  return (
    <main>
      <h1>Loading State</h1>

      <h2>1. Track a Single Request With a Loading Boolean</h2>
      <LoadingStateExample client={apiClient} />

      <h2>2. Preserve Existing Data While Refreshing</h2>
      <LoadingWithDataExample client={apiClient} />

      <h2>3. Track Independent Loading States</h2>
      <IndependentLoadingStateExample client={apiClient} />

      <h2>4. Clear Loading State After Request Failure</h2>
      <LoadingErrorExample client={apiClient} />
    </main>
  );
};

export default LoadingStateDemo;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Loading state represents an asynchronous operation that has not completed.
// - A boolean loading state is suitable for a single independently tracked operation.
// - finally can guarantee that loading is cleared after success or failure.
// - Existing data can remain visible while a refresh is loading.
// - Independent concurrent requests should not share one unrelated loading boolean.
// - A failed request must clear loading state so the UI does not remain stuck.
// - Loading state describes request activity and does not require clearing existing data.
