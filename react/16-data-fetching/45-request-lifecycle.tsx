/**
 * Request Lifecycle
 * =================
 *
 * A request lifecycle describes the ordered state transitions an asynchronous
 * operation passes through from initiation to completion. A typical lifecycle
 * is idle -> loading -> success or idle -> loading -> error. The lifecycle
 * becomes the source of truth for rendering request-related UI.
 *
 * Internally, the lifecycle is represented as a discriminated union. Each state
 * has a literal status field, and TypeScript uses that discriminator to narrow
 * the properties available in each branch. A successful request carries data,
 * an error state carries an error message, and the loading state represents
 * work that has not completed yet.
 *
 * Starting a new request should reset or replace state deliberately. If a
 * previous error remains visible while a new request is loading, the UI can
 * incorrectly communicate that both states are active. Likewise, overlapping
 * requests can finish in a different order from the order in which they were
 * started. A request identifier can be used to ignore stale results.
 *
 * A common misconception is that an asynchronous request has only two states:
 * loading and not loading. In practice, idle, loading, success, and error carry
 * different information and should not be inferred solely from a boolean.
 *
 * Another edge case is cancellation. Cancellation is not necessarily the same
 * as a server failure. An application can treat cancellation as a separate
 * lifecycle outcome when the distinction matters to the UI or request logic.
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

export interface IdleRequestState {
  readonly status: "idle";
}

export interface LoadingRequestState {
  readonly status: "loading";
  readonly requestId: number;
}

export interface SuccessRequestState {
  readonly status: "success";
  readonly requestId: number;
  readonly data: User;
}

export interface ErrorRequestState {
  readonly status: "error";
  readonly requestId: number;
  readonly message: string;
}

export interface CancelledRequestState {
  readonly status: "cancelled";
  readonly requestId: number;
}

export type RequestLifecycleState =
  IdleRequestState | LoadingRequestState | SuccessRequestState | ErrorRequestState | CancelledRequestState;

export interface RequestLifecycleExampleProps {
  readonly client: AxiosInstance;
}

export interface RequestLifecycleTransitionExampleProps {
  readonly client: AxiosInstance;
}

export interface RequestLifecycleStaleRequestExampleProps {
  readonly client: AxiosInstance;
}

export interface RequestLifecycleCancellationExampleProps {
  readonly client: AxiosInstance;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * Demonstrates the complete request lifecycle.
 *
 * The state moves from idle to loading and then to either success or error.
 * Each transition replaces the previous lifecycle state rather than combining
 * independent booleans that could represent contradictory states.
 */
export const RequestLifecycleExample: React.FC<RequestLifecycleExampleProps> = ({
  client,
}: RequestLifecycleExampleProps): React.ReactElement => {
  const [state, setState] = useState<RequestLifecycleState>({
    status: "idle",
  });

  const handleRequest = async (): Promise<void> => {
    const requestId: number = Date.now();

    setState({
      status: "loading",
      requestId,
    });

    try {
      const response: AxiosResponse<User> = await client.get<User>("/users/1");

      setState({
        status: "success",
        requestId,
        data: response.data,
      });
    } catch {
      setState({
        status: "error",
        requestId,
        message: "The request failed.",
      });
    }
  };

  let content: React.ReactElement;

  switch (state.status) {
    case "idle":
      content = <p>Idle: no request has started.</p>;
      break;

    case "loading":
      content = <p>Loading: request {state.requestId} is active.</p>;
      break;

    case "success":
      content = <p>Success: loaded {state.data.name}.</p>;
      break;

    case "error":
      content = <p role="alert">Error: {state.message}</p>;
      break;

    case "cancelled":
      content = <p>Cancelled: the request was cancelled.</p>;
      break;
  }

  return (
    <section>
      <button type="button" onClick={handleRequest} disabled={state.status === "loading"}>
        Start Request
      </button>

      {content}
    </section>
  );
};

/**
 * Demonstrates explicit lifecycle transitions.
 *
 * Clearing the previous error before starting a new request prevents the UI
 * from simultaneously representing the previous error and the new loading
 * state.
 */
export const RequestLifecycleTransitionExample: React.FC<RequestLifecycleTransitionExampleProps> = ({
  client,
}: RequestLifecycleTransitionExampleProps): React.ReactElement => {
  const [state, setState] = useState<RequestLifecycleState>({
    status: "idle",
  });

  const handleRequest = async (): Promise<void> => {
    const requestId: number = Date.now();

    setState({
      status: "loading",
      requestId,
    });

    try {
      const response: AxiosResponse<User> = await client.get<User>("/users/1");

      setState({
        status: "success",
        requestId,
        data: response.data,
      });
    } catch (error: unknown) {
      const message: string = axios.isAxiosError(error) ? error.message : "An unexpected request error occurred.";

      setState({
        status: "error",
        requestId,
        message,
      });
    }
  };

  return (
    <section>
      <button type="button" onClick={handleRequest} disabled={state.status === "loading"}>
        Restart Request
      </button>

      {state.status === "idle" && <p>Ready to start.</p>}

      {state.status === "loading" && <p>Request is in progress.</p>}

      {state.status === "success" && <p>Completed successfully for {state.data.name}.</p>}

      {state.status === "error" && <p role="alert">{state.message}</p>}

      {state.status === "cancelled" && <p>The request was cancelled.</p>}
    </section>
  );
};

/**
 * Demonstrates protection against stale asynchronous results.
 *
 * Each request receives a unique identifier. Before applying a response, the
 * handler compares that identifier with the latest request identifier stored
 * in state. A response from an older request is ignored if a newer request has
 * already replaced it.
 */
export const RequestLifecycleStaleRequestExample: React.FC<RequestLifecycleStaleRequestExampleProps> = ({
  client,
}: RequestLifecycleStaleRequestExampleProps): React.ReactElement => {
  const [state, setState] = useState<RequestLifecycleState>({
    status: "idle",
  });

  const [latestRequestId, setLatestRequestId] = useState<number>(0);

  const handleRequest = async (): Promise<void> => {
    const requestId: number = latestRequestId + 1;

    setLatestRequestId(requestId);

    setState({
      status: "loading",
      requestId,
    });

    try {
      const response: AxiosResponse<User> = await client.get<User>("/users/1");

      setState((previous: RequestLifecycleState): RequestLifecycleState => {
        if (previous.status !== "loading" || previous.requestId !== requestId) {
          return previous;
        }

        return {
          status: "success",
          requestId,
          data: response.data,
        };
      });
    } catch (error: unknown) {
      const message: string = axios.isAxiosError(error) ? error.message : "The request failed.";

      setState((previous: RequestLifecycleState): RequestLifecycleState => {
        if (previous.status !== "loading" || previous.requestId !== requestId) {
          return previous;
        }

        return {
          status: "error",
          requestId,
          message,
        };
      });
    }
  };

  return (
    <section>
      <button type="button" onClick={handleRequest}>
        Start Request
      </button>

      {state.status === "idle" && <p>Waiting for a request.</p>}

      {state.status === "loading" && <p>Request {state.requestId} is loading.</p>}

      {state.status === "success" && <p>Latest response: {state.data.name}.</p>}

      {state.status === "error" && <p role="alert">{state.message}</p>}

      {state.status === "cancelled" && <p>Request cancelled.</p>}
    </section>
  );
};

/**
 * Demonstrates cancellation as an explicit lifecycle outcome.
 *
 * Axios accepts an AbortSignal through request configuration. When the
 * controller is aborted, the cancellation is represented separately from a
 * general request failure.
 */
export const RequestLifecycleCancellationExample: React.FC<RequestLifecycleCancellationExampleProps> = ({
  client,
}: RequestLifecycleCancellationExampleProps): React.ReactElement => {
  const [state, setState] = useState<RequestLifecycleState>({
    status: "idle",
  });

  const [controller, setController] = useState<AbortController | null>(null);

  const handleStart = async (): Promise<void> => {
    const requestId: number = Date.now();
    const nextController: AbortController = new AbortController();

    setController(nextController);

    setState({
      status: "loading",
      requestId,
    });

    try {
      const response: AxiosResponse<User> = await client.get<User>("/users/1", {
        signal: nextController.signal,
      });

      if (nextController.signal.aborted) {
        return;
      }

      setState({
        status: "success",
        requestId,
        data: response.data,
      });
    } catch (error: unknown) {
      if (axios.isCancel(error)) {
        setState({
          status: "cancelled",
          requestId,
        });

        return;
      }

      setState({
        status: "error",
        requestId,
        message: "The request failed.",
      });
    } finally {
      setController((previous: AbortController | null): AbortController | null =>
        previous === nextController ? null : previous,
      );
    }
  };

  const handleCancel = (): void => {
    controller?.abort();
  };

  return (
    <section>
      <button type="button" onClick={handleStart} disabled={state.status === "loading"}>
        Start Request
      </button>

      <button type="button" onClick={handleCancel} disabled={state.status !== "loading"}>
        Cancel Request
      </button>

      {state.status === "idle" && <p>No request has started.</p>}

      {state.status === "loading" && <p>Request is running.</p>}

      {state.status === "success" && <p>Loaded {state.data.name}.</p>}

      {state.status === "error" && <p role="alert">{state.message}</p>}

      {state.status === "cancelled" && <p>Request was cancelled.</p>}
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

export const RequestLifecycleDemo: React.FC = (): React.ReactElement => {
  return (
    <main>
      <h1>Request Lifecycle</h1>

      <h2>1. Represent the Complete Request Lifecycle</h2>
      <RequestLifecycleExample client={apiClient} />

      <h2>2. Transition Explicitly Between Request States</h2>
      <RequestLifecycleTransitionExample client={apiClient} />

      <h2>3. Ignore Results From Stale Requests</h2>
      <RequestLifecycleStaleRequestExample client={apiClient} />

      <h2>4. Represent Cancellation as a Separate Outcome</h2>
      <RequestLifecycleCancellationExample client={apiClient} />
    </main>
  );
};

export default RequestLifecycleDemo;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - A request lifecycle describes the ordered states of an asynchronous operation.
// - A discriminated union makes lifecycle states explicit and type-safe.
// - Starting a request should replace stale lifecycle information deliberately.
// - Request identifiers can prevent older asynchronous results from overwriting newer state.
// - Cancellation can be represented separately from ordinary request failure.
// - A loading boolean alone does not fully describe an asynchronous request lifecycle.
// - Explicit lifecycle states make rendering behavior easier to reason about.
