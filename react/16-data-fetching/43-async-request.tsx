/**
 * Async Request
 * =============
 *
 * An asynchronous request is a network operation whose result becomes
 * available after the current JavaScript execution completes. In React,
 * asynchronous request state is commonly represented with separate values for
 * loading, successful data, and failure information.
 *
 * An async function returns a Promise. Awaiting that Promise pauses the async
 * function until the request settles without blocking the browser's main
 * thread. The request therefore continues while React can render other UI.
 *
 * A request state transition normally starts by setting loading to true,
 * performs the asynchronous operation, stores the successful result or error,
 * and finally resets loading. The finally block is useful because it runs after
 * either fulfillment or rejection.
 *
 * A common edge case occurs when a component unmounts or when multiple requests
 * overlap. A completed request can otherwise attempt to update state after the
 * UI no longer needs that result. AbortController can be used with Axios to
 * cancel a request when its owning operation is no longer relevant.
 *
 * Another misconception is that async/await makes a request synchronous.
 * It only changes how asynchronous control flow is expressed; the underlying
 * network operation remains asynchronous.
 */

import React, { useEffect, useState } from "react";
import axios, { AxiosError, AxiosInstance, AxiosResponse } from "axios";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface User {
  readonly id: number;
  readonly name: string;
  readonly email: string;
}

export interface AsyncRequestState<TData> {
  readonly data: TData | null;
  readonly loading: boolean;
  readonly error: string | null;
}

export interface AsyncRequestExampleProps {
  readonly client: AxiosInstance;
}

export interface AsyncRequestStateExampleProps {
  readonly client: AxiosInstance;
}

export interface AsyncRequestErrorExampleProps {
  readonly client: AxiosInstance;
}

export interface AsyncRequestCancellationExampleProps {
  readonly client: AxiosInstance;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * Demonstrates the basic async/await request lifecycle.
 *
 * The request starts in an idle state, enters loading before the network
 * operation, stores successful data when the Promise fulfills, and clears the
 * loading state in finally regardless of the outcome.
 */
export const AsyncRequestExample: React.FC<AsyncRequestExampleProps> = ({
  client,
}: AsyncRequestExampleProps): React.ReactElement => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleRequest = async (): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const response: AxiosResponse<User> = await client.get<User>("/users/1");

      setUser(response.data);
    } catch {
      setUser(null);
      setError("The request failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <button type="button" onClick={handleRequest} disabled={loading}>
        {loading ? "Loading..." : "Load User"}
      </button>

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
 * Demonstrates a single typed state object for an async request.
 *
 * Keeping data, loading, and error together can make the request lifecycle
 * easier to pass between functions while preserving an explicit state shape.
 */
export const AsyncRequestStateExample: React.FC<AsyncRequestStateExampleProps> = ({
  client,
}: AsyncRequestStateExampleProps): React.ReactElement => {
  const [state, setState] = useState<AsyncRequestState<User>>({
    data: null,
    loading: false,
    error: null,
  });

  const handleRequest = async (): Promise<void> => {
    setState((previous: AsyncRequestState<User>): AsyncRequestState<User> => ({
      ...previous,
      loading: true,
      error: null,
    }));

    try {
      const response: AxiosResponse<User> = await client.get<User>("/users/1");

      setState({
        data: response.data,
        loading: false,
        error: null,
      });
    } catch {
      setState((previous: AsyncRequestState<User>): AsyncRequestState<User> => ({
        ...previous,
        loading: false,
        error: "Unable to load the user.",
      }));
    }
  };

  return (
    <section>
      <button type="button" onClick={handleRequest} disabled={state.loading}>
        {state.loading ? "Loading..." : "Request User"}
      </button>

      {state.data !== null && <p>{state.data.name}</p>}

      {state.error !== null && <p role="alert">{state.error}</p>}
    </section>
  );
};

/**
 * Demonstrates handling different error categories.
 *
 * Axios can distinguish an HTTP response error from a request that was sent
 * without receiving a response. The UI can use that information to display a
 * more appropriate message without assuming every failure has an HTTP status.
 */
export const AsyncRequestErrorExample: React.FC<AsyncRequestErrorExampleProps> = ({
  client,
}: AsyncRequestErrorExampleProps): React.ReactElement => {
  const [message, setMessage] = useState<string>("");

  const handleRequest = async (): Promise<void> => {
    try {
      await client.get<User>("/users/1");

      setMessage("The request succeeded.");
    } catch (requestError: unknown) {
      if (axios.isAxiosError(requestError)) {
        const axiosError: AxiosError = requestError;

        if (axiosError.response !== undefined) {
          setMessage(`The server returned HTTP ${axiosError.response.status}.`);

          return;
        }

        if (axiosError.request !== undefined) {
          setMessage("The request was sent, but no response was received.");

          return;
        }

        setMessage(`The request could not be prepared: ${axiosError.message}`);

        return;
      }

      if (requestError instanceof Error) {
        setMessage(requestError.message);

        return;
      }

      setMessage("An unknown request error occurred.");
    }
  };

  return (
    <section>
      <button type="button" onClick={handleRequest}>
        Test Request Error Handling
      </button>

      {message !== "" && <p role="status">{message}</p>}
    </section>
  );
};

/**
 * Demonstrates cancellation of an asynchronous request.
 *
 * AbortController provides a cancellation signal that Axios can use. Cleanup
 * aborts the active request when the component is unmounted, preventing an
 * obsolete network operation from continuing unnecessarily.
 */
export const AsyncRequestCancellationExample: React.FC<AsyncRequestCancellationExampleProps> = ({
  client,
}: AsyncRequestCancellationExampleProps): React.ReactElement => {
  const [message, setMessage] = useState<string>("No request is currently running.");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect((): (() => void) => {
    const controller: AbortController = new AbortController();

    const request = async (): Promise<void> => {
      setLoading(true);
      setMessage("Request is running.");

      try {
        await client.get<User>("/users/1", {
          signal: controller.signal,
        });

        if (!controller.signal.aborted) {
          setMessage("Request completed.");
        }
      } catch (requestError: unknown) {
        if (axios.isCancel(requestError)) {
          setMessage("Request was cancelled.");
          return;
        }

        if (!controller.signal.aborted) {
          setMessage("Request failed.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    void request();

    return (): void => {
      controller.abort();
    };
  }, [client]);

  return (
    <section>
      <p>{message}</p>

      {loading && <p aria-live="polite">Waiting for the response...</p>}
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

export const AsyncRequestDemo: React.FC = (): React.ReactElement => {
  return (
    <main>
      <h1>Async Request</h1>

      <h2>1. Manage the Basic Async Request Lifecycle</h2>
      <AsyncRequestExample client={apiClient} />

      <h2>2. Represent Request State With One Typed Object</h2>
      <AsyncRequestStateExample client={apiClient} />

      <h2>3. Distinguish HTTP, Network, and Unknown Errors</h2>
      <AsyncRequestErrorExample client={apiClient} />

      <h2>4. Cancel an Async Request When It Is No Longer Needed</h2>
      <AsyncRequestCancellationExample client={apiClient} />
    </main>
  );
};

export default AsyncRequestDemo;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Async functions return Promises and do not block the browser while network work is pending.
// - Request state commonly tracks loading, successful data, and errors.
// - finally is useful for resetting loading state after both success and failure.
// - Unknown thrown values should be handled safely before their properties are accessed.
// - Axios can distinguish HTTP response errors from requests that receive no response.
// - AbortController can cancel an Axios request through its signal option.
// - Async/await changes asynchronous control flow syntax; it does not make network requests synchronous.
