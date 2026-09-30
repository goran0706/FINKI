/**
 * Request Cancellation
 * ====================
 *
 * Request cancellation stops an asynchronous operation when its result is no
 * longer needed. With Axios, cancellation is implemented by passing an
 * AbortSignal to the request configuration and calling abort() on the
 * corresponding AbortController.
 *
 * AbortController and AbortSignal are browser platform APIs. The controller
 * owns the cancellation operation, while its signal is passed to asynchronous
 * APIs that support cancellation. Calling controller.abort() changes the
 * signal to an aborted state and causes Axios to reject the associated request.
 *
 * Cancellation is different from an HTTP error. A cancelled request does not
 * represent a server response such as HTTP 404 or 500. Axios exposes
 * axios.isCancel() so application code can distinguish cancellation from other
 * request failures.
 *
 * A common edge case occurs when a component starts a request and then unmounts
 * before the response arrives. Aborting the request during effect cleanup stops
 * an obsolete operation and avoids treating its result as relevant to the
 * removed component.
 *
 * Another edge case occurs when a new request replaces an older request. The
 * previous controller should be aborted before the new controller becomes
 * active so that an older response cannot unnecessarily continue consuming
 * resources.
 *
 * Cancellation does not guarantee that a remote server has already stopped
 * processing the operation. It cancels the client-side request represented by
 * the AbortSignal; server-side cancellation depends on the protocol and server
 * implementation.
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

export interface RequestCancellationExampleProps {
  readonly client: AxiosInstance;
}

export interface RequestCancellationCleanupExampleProps {
  readonly client: AxiosInstance;
}

export interface RequestCancellationReplacementExampleProps {
  readonly client: AxiosInstance;
}

export interface RequestCancellationErrorExampleProps {
  readonly client: AxiosInstance;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * Demonstrates manually cancelling an active Axios request.
 *
 * The controller is stored in state so the cancel button can access the
 * controller belonging to the currently active request.
 */
export const RequestCancellationExample: React.FC<RequestCancellationExampleProps> = ({
  client,
}: RequestCancellationExampleProps): React.ReactElement => {
  const [controller, setController] = useState<AbortController | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("No request is active.");

  const handleStart = async (): Promise<void> => {
    const nextController: AbortController = new AbortController();

    setController(nextController);
    setLoading(true);
    setMessage("Request is running.");

    try {
      const response: AxiosResponse<User> = await client.get<User>("/users/1", {
        signal: nextController.signal,
      });

      if (!nextController.signal.aborted) {
        setMessage(`Loaded ${response.data.name}.`);
      }
    } catch (error: unknown) {
      if (axios.isCancel(error)) {
        setMessage("Request was cancelled.");
        return;
      }

      setMessage("Request failed.");
    } finally {
      setLoading(false);

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
      <button type="button" onClick={handleStart} disabled={loading}>
        {loading ? "Requesting..." : "Start Request"}
      </button>

      <button type="button" onClick={handleCancel} disabled={!loading}>
        Cancel Request
      </button>

      <p role="status">{message}</p>
    </section>
  );
};

/**
 * Demonstrates cancellation during React effect cleanup.
 *
 * The effect creates a controller for the request and aborts it when the effect
 * is cleaned up. Cleanup can happen when the component unmounts or when a
 * dependency changes and the effect is replaced.
 */
export const RequestCancellationCleanupExample: React.FC<RequestCancellationCleanupExampleProps> = ({
  client,
}: RequestCancellationCleanupExampleProps): React.ReactElement => {
  const [message, setMessage] = useState<string>("Starting request...");

  useEffect((): (() => void) => {
    const controller: AbortController = new AbortController();

    const loadUser = async (): Promise<void> => {
      try {
        const response: AxiosResponse<User> = await client.get<User>("/users/1", {
          signal: controller.signal,
        });

        if (!controller.signal.aborted) {
          setMessage(`Loaded ${response.data.name}.`);
        }
      } catch (error: unknown) {
        if (axios.isCancel(error)) {
          return;
        }

        if (!controller.signal.aborted) {
          setMessage("Request failed.");
        }
      }
    };

    void loadUser();

    return (): void => {
      controller.abort();
    };
  }, [client]);

  return (
    <section>
      <p role="status">{message}</p>
    </section>
  );
};

/**
 * Demonstrates replacing one request with another.
 *
 * The previous controller is stored in a ref because the active controller
 * represents mutable request infrastructure rather than data that needs to
 * trigger rendering. Starting a new request aborts the previous operation.
 */
export const RequestCancellationReplacementExample: React.FC<RequestCancellationReplacementExampleProps> = ({
  client,
}: RequestCancellationReplacementExampleProps): React.ReactElement => {
  const controllerRef = useRef<AbortController | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("No request is active.");

  const handleRequest = async (): Promise<void> => {
    controllerRef.current?.abort();

    const controller: AbortController = new AbortController();

    controllerRef.current = controller;
    setLoading(true);
    setMessage("Latest request is running.");

    try {
      const response: AxiosResponse<User> = await client.get<User>("/users/1", {
        signal: controller.signal,
      });

      if (controllerRef.current === controller && !controller.signal.aborted) {
        setMessage(`Latest request loaded ${response.data.name}.`);
      }
    } catch (error: unknown) {
      if (axios.isCancel(error)) {
        return;
      }

      if (controllerRef.current === controller) {
        setMessage("Latest request failed.");
      }
    } finally {
      if (controllerRef.current === controller) {
        controllerRef.current = null;
        setLoading(false);
      }
    }
  };

  return (
    <section>
      <button type="button" onClick={handleRequest}>
        Replace With New Request
      </button>

      <p role="status">{message}</p>

      {loading && <p aria-live="polite">Previous requests are cancelled when replaced.</p>}
    </section>
  );
};

/**
 * Demonstrates distinguishing cancellation from request failure.
 *
 * Cancellation is checked before generic error handling so an intentional
 * abort does not produce the same user-facing message as a failed request.
 */
export const RequestCancellationErrorExample: React.FC<RequestCancellationErrorExampleProps> = ({
  client,
}: RequestCancellationErrorExampleProps): React.ReactElement => {
  const [controller, setController] = useState<AbortController | null>(null);
  const [message, setMessage] = useState<string>("Ready.");

  const handleRequest = async (): Promise<void> => {
    const nextController: AbortController = new AbortController();

    setController(nextController);
    setMessage("Request started.");

    try {
      await client.get<User>("/users/1", {
        signal: nextController.signal,
      });

      if (!nextController.signal.aborted) {
        setMessage("Request succeeded.");
      }
    } catch (error: unknown) {
      if (axios.isCancel(error)) {
        setMessage("Request cancellation was intentional.");
      } else if (axios.isAxiosError(error)) {
        setMessage(`Request failed: ${error.message}`);
      } else if (error instanceof Error) {
        setMessage(`Unexpected error: ${error.message}`);
      } else {
        setMessage("An unknown error occurred.");
      }
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
      <button type="button" onClick={handleRequest}>
        Start Request
      </button>

      <button type="button" onClick={handleCancel} disabled={controller === null}>
        Cancel
      </button>

      <p role="status">{message}</p>
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

export const RequestCancellationDemo: React.FC = (): React.ReactElement => {
  return (
    <main>
      <h1>Request Cancellation</h1>

      <h2>1. Cancel an Active Axios Request Manually</h2>
      <RequestCancellationExample client={apiClient} />

      <h2>2. Cancel a Request During Effect Cleanup</h2>
      <RequestCancellationCleanupExample client={apiClient} />

      <h2>3. Cancel a Previous Request When Replacing It</h2>
      <RequestCancellationReplacementExample client={apiClient} />

      <h2>4. Distinguish Cancellation From Request Failure</h2>
      <RequestCancellationErrorExample client={apiClient} />
    </main>
  );
};

export default RequestCancellationDemo;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - AbortController provides a standard mechanism for cancelling supported asynchronous operations.
// - Axios accepts an AbortSignal through its request configuration.
// - axios.isCancel() distinguishes cancellation from ordinary request failures.
// - Effect cleanup can abort requests that are no longer relevant to a component.
// - A new request can abort an older request when only the latest operation should remain active.
// - A controller can be stored in a ref when it represents mutable request infrastructure rather than render state.
// - Client-side cancellation does not guarantee that a remote server has stopped processing the operation.
