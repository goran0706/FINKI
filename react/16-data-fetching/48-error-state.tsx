/**
 * Error State
 * ===========
 *
 * An error state represents an asynchronous operation that did not produce the
 * expected successful result. A request error state should contain enough
 * structured information for the UI to communicate the failure without making
 * assumptions about the underlying transport implementation.
 *
 * Internally, an error state is commonly represented by a discriminated union.
 * The literal "error" status identifies the state, while fields such as code,
 * message, and status provide structured information about the failure.
 * TypeScript narrows the union from the status property, so error-specific
 * properties are available only when the request is actually in an error state.
 *
 * HTTP failures, network failures, cancellation, and unexpected JavaScript
 * exceptions are not necessarily equivalent. An HTTP response provides a
 * status code, while a network failure may have no response at all. A robust
 * error state can normalize these different causes into one application-level
 * shape while retaining the distinctions that matter to the UI.
 *
 * A common edge case is a failed refresh after previously successful data was
 * displayed. Clearing the data immediately can create an unnecessary empty
 * screen. An application may instead retain the previous data while storing the
 * refresh failure separately.
 *
 * Another misconception is that every error message should be shown directly
 * to the user. Transport errors can contain technical details that are useful
 * for debugging but inappropriate for presentation. Error state should
 * distinguish structured error information from user-facing text when those
 * concerns differ.
 */

import React, { useState } from "react";
import axios, { AxiosError, AxiosInstance, AxiosResponse } from "axios";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface User {
  readonly id: number;
  readonly name: string;
  readonly email: string;
}

export interface RequestError {
  readonly code: string;
  readonly message: string;
  readonly status: number | null;
  readonly kind: "http" | "network" | "unknown";
}

export interface IdleRequestState {
  readonly status: "idle";
}

export interface LoadingRequestState {
  readonly status: "loading";
}

export interface SuccessRequestState {
  readonly status: "success";
  readonly data: User;
}

export interface ErrorRequestState {
  readonly status: "error";
  readonly error: RequestError;
}

export type UserRequestState = IdleRequestState | LoadingRequestState | SuccessRequestState | ErrorRequestState;

export interface ErrorStateExampleProps {
  readonly client: AxiosInstance;
}

export interface ErrorStateKindsExampleProps {
  readonly client: AxiosInstance;
}

export interface ErrorStateRefreshExampleProps {
  readonly client: AxiosInstance;
}

export interface ErrorStateRetryExampleProps {
  readonly client: AxiosInstance;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * Converts an unknown thrown value into a predictable request error.
 *
 * Axios response errors contain a response with an HTTP status. Axios errors
 * without a response represent requests that did not receive an HTTP response.
 * Other Error instances and arbitrary thrown values receive safe fallbacks.
 */
export const normalizeRequestError = (error: unknown): RequestError => {
  if (axios.isAxiosError(error)) {
    const axiosError: AxiosError<unknown> = error;

    if (axiosError.response !== undefined) {
      return {
        code: "HTTP_ERROR",
        message: "The server rejected the request.",
        status: axiosError.response.status,
        kind: "http",
      };
    }

    if (axiosError.request !== undefined) {
      return {
        code: "NETWORK_ERROR",
        message: "The server could not be reached.",
        status: null,
        kind: "network",
      };
    }

    return {
      code: "REQUEST_ERROR",
      message: "The request could not be prepared.",
      status: null,
      kind: "unknown",
    };
  }

  if (error instanceof Error) {
    return {
      code: "UNKNOWN_ERROR",
      message: error.message,
      status: null,
      kind: "unknown",
    };
  }

  return {
    code: "UNKNOWN_ERROR",
    message: "An unexpected error occurred.",
    status: null,
    kind: "unknown",
  };
};

/**
 * Demonstrates an explicit error request state.
 *
 * The error is stored as structured data rather than using a generic boolean,
 * allowing rendering code to access the error category and status safely.
 */
export const ErrorStateExample: React.FC<ErrorStateExampleProps> = ({
  client,
}: ErrorStateExampleProps): React.ReactElement => {
  const [state, setState] = useState<UserRequestState>({
    status: "idle",
  });

  const handleRequest = async (): Promise<void> => {
    setState({
      status: "loading",
    });

    try {
      const response: AxiosResponse<User> = await client.get<User>("/users/invalid");

      setState({
        status: "success",
        data: response.data,
      });
    } catch (error: unknown) {
      setState({
        status: "error",
        error: normalizeRequestError(error),
      });
    }
  };

  return (
    <section>
      <button type="button" onClick={handleRequest} disabled={state.status === "loading"}>
        {state.status === "loading" ? "Requesting..." : "Trigger Request"}
      </button>

      {state.status === "idle" && <p>No request has started.</p>}

      {state.status === "loading" && <p>Request is in progress.</p>}

      {state.status === "success" && <p>Loaded {state.data.name}.</p>}

      {state.status === "error" && (
        <div role="alert">
          <p>{state.error.message}</p>

          <p>Error type: {state.error.kind}</p>

          {state.error.status !== null && <p>HTTP status: {state.error.status}</p>}
        </div>
      )}
    </section>
  );
};

/**
 * Demonstrates that different request failures can map to the same error
 * state shape while retaining their meaningful category.
 *
 * HTTP errors contain an HTTP status, whereas network errors do not have a
 * response status. The normalized structure makes both cases predictable.
 */
export const ErrorStateKindsExample: React.FC<ErrorStateKindsExampleProps> = ({
  client,
}: ErrorStateKindsExampleProps): React.ReactElement => {
  const [error, setError] = useState<RequestError | null>(null);

  const handleHttpError = async (): Promise<void> => {
    try {
      await client.get<User>("/users/invalid");
      setError(null);
    } catch (requestError: unknown) {
      setError(normalizeRequestError(requestError));
    }
  };

  const handleNetworkError = async (): Promise<void> => {
    try {
      await client.get<User>("/network-failure");
      setError(null);
    } catch (requestError: unknown) {
      setError(normalizeRequestError(requestError));
    }
  };

  return (
    <section>
      <button type="button" onClick={handleHttpError}>
        Test HTTP Error
      </button>

      <button type="button" onClick={handleNetworkError}>
        Test Network Error
      </button>

      {error !== null && (
        <div role="alert">
          <p>Code: {error.code}</p>
          <p>Kind: {error.kind}</p>
          <p>Status: {error.status ?? "No HTTP response"}</p>
          <p>{error.message}</p>
        </div>
      )}
    </section>
  );
};

/**
 * Demonstrates retaining previous successful data after a refresh failure.
 *
 * The data and error are independent so a failed refresh does not necessarily
 * require the UI to discard information that was already displayed.
 */
export const ErrorStateRefreshExample: React.FC<ErrorStateRefreshExampleProps> = ({
  client,
}: ErrorStateRefreshExampleProps): React.ReactElement => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<RequestError | null>(null);

  const handleRequest = async (): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const response: AxiosResponse<User> = await client.get<User>("/users/1");

      setUser(response.data);
    } catch (requestError: unknown) {
      setError(normalizeRequestError(requestError));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <button type="button" onClick={handleRequest} disabled={loading}>
        {loading ? "Refreshing..." : "Refresh User"}
      </button>

      {user !== null && <p>Current data: {user.name}</p>}

      {loading && <p aria-live="polite">Refreshing current data...</p>}

      {error !== null && <p role="alert">Refresh failed: {error.message}</p>}
    </section>
  );
};

/**
 * Demonstrates retrying after an error.
 *
 * A retry starts a new request lifecycle and clears the previous error before
 * the new request begins. The previous error therefore does not remain
 * represented as active while the retry is running.
 */
export const ErrorStateRetryExample: React.FC<ErrorStateRetryExampleProps> = ({
  client,
}: ErrorStateRetryExampleProps): React.ReactElement => {
  const [error, setError] = useState<RequestError | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);

  const handleRetry = async (): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const response: AxiosResponse<User> = await client.get<User>("/users/1");

      setUser(response.data);
    } catch (requestError: unknown) {
      setError(normalizeRequestError(requestError));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <button type="button" onClick={handleRetry} disabled={loading}>
        {loading ? "Retrying..." : "Retry Request"}
      </button>

      {error !== null && (
        <div role="alert">
          <p>{error.message}</p>
          <p>Code: {error.code}</p>
        </div>
      )}

      {user !== null && <p>Request succeeded: {user.name}</p>}
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

export const ErrorStateDemo: React.FC = (): React.ReactElement => {
  return (
    <main>
      <h1>Error State</h1>

      <h2>1. Represent Failures With an Explicit Error State</h2>
      <ErrorStateExample client={apiClient} />

      <h2>2. Distinguish HTTP and Network Error Categories</h2>
      <ErrorStateKindsExample client={apiClient} />

      <h2>3. Preserve Existing Data After a Refresh Failure</h2>
      <ErrorStateRefreshExample client={apiClient} />

      <h2>4. Clear an Error Before Retrying the Request</h2>
      <ErrorStateRetryExample client={apiClient} />
    </main>
  );
};

export default ErrorStateDemo;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - An error state represents an unsuccessful asynchronous operation.
// - Structured error data is more useful than a boolean such as hasError.
// - Axios response errors can be distinguished from failures that receive no HTTP response.
// - Unknown thrown values should be normalized before their properties are accessed.
// - Existing successful data can remain visible when a refresh fails.
// - A retry should begin a new request lifecycle and clear the previous active error.
// - Technical error information and user-facing error messages do not always need to be identical.
