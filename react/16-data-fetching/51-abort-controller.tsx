/**
 * AbortController
 * ===============
 *
 * AbortController is a Web Platform API for signaling cancellation to
 * asynchronous operations that support AbortSignal. A controller owns an
 * AbortSignal, and calling abort() changes that signal to an aborted state.
 *
 * Internally, AbortSignal is an EventTarget-based signal object. Consumers can
 * observe its aborted state and abort event, while APIs such as fetch and Axios
 * listen to the signal and reject their pending operation when cancellation is
 * triggered. The same signal can be supplied to multiple compatible operations,
 * allowing one controller to cancel them as a group.
 *
 * An AbortController is one-shot. After abort() has been called, its signal
 * remains aborted and cannot be reset. A new asynchronous operation therefore
 * requires a new AbortController.
 *
 * A common edge case is creating a controller too early and attempting to reuse
 * it after cancellation. The second operation receives an already-aborted
 * signal and may be rejected immediately. Controllers should normally be
 * created for the lifecycle of the operation they control.
 *
 * Another important distinction is that AbortController does not automatically
 * cancel arbitrary asynchronous JavaScript work. The operation must support
 * AbortSignal and actually observe the signal. Cancellation of a fetch or
 * Axios request is different from stopping unrelated synchronous computation.
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

export interface AbortControllerExampleProps {
  readonly client: AxiosInstance;
}

export interface AbortSignalExampleProps {
  readonly client: AxiosInstance;
}

export interface AbortControllerOneShotExampleProps {
  readonly client: AxiosInstance;
}

export interface AbortControllerSharedSignalExampleProps {
  readonly client: AxiosInstance;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * Demonstrates creating a controller and passing its signal to Axios.
 *
 * Calling abort() changes the signal to aborted and causes Axios to reject the
 * associated request. The controller itself is retained only while the request
 * is active.
 */
export const AbortControllerExample: React.FC<AbortControllerExampleProps> = ({
  client,
}: AbortControllerExampleProps): React.ReactElement => {
  const controllerRef = useRef<AbortController | null>(null);

  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("No request is active.");

  const handleStart = async (): Promise<void> => {
    const controller: AbortController = new AbortController();

    controllerRef.current = controller;
    setLoading(true);
    setMessage("Request started.");

    try {
      const response: AxiosResponse<User> = await client.get<User>("/users/1", {
        signal: controller.signal,
      });

      if (!controller.signal.aborted && controllerRef.current === controller) {
        setMessage(`Loaded ${response.data.name}.`);
      }
    } catch (error: unknown) {
      if (axios.isCancel(error)) {
        setMessage("Request was cancelled.");
      } else {
        setMessage("Request failed.");
      }
    } finally {
      if (controllerRef.current === controller) {
        controllerRef.current = null;
        setLoading(false);
      }
    }
  };

  const handleAbort = (): void => {
    controllerRef.current?.abort();
  };

  return (
    <section>
      <button type="button" onClick={handleStart} disabled={loading}>
        {loading ? "Requesting..." : "Start Request"}
      </button>

      <button type="button" onClick={handleAbort} disabled={!loading}>
        Abort Request
      </button>

      <p role="status">{message}</p>
    </section>
  );
};

/**
 * Demonstrates observing the AbortSignal state directly.
 *
 * The signal exposes aborted so application code can determine whether an
 * operation has been cancelled before applying a result.
 */
export const AbortSignalExample: React.FC<AbortSignalExampleProps> = ({
  client,
}: AbortSignalExampleProps): React.ReactElement => {
  const [aborted, setAborted] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("Ready.");

  const handleRequest = async (): Promise<void> => {
    const controller: AbortController = new AbortController();

    setAborted(controller.signal.aborted);
    setMessage("Request started.");

    try {
      const response: AxiosResponse<User> = await client.get<User>("/users/1", {
        signal: controller.signal,
      });

      if (controller.signal.aborted) {
        setMessage("Result ignored because the request was aborted.");
        return;
      }

      setMessage(`Loaded ${response.data.name}.`);
    } catch (error: unknown) {
      setAborted(controller.signal.aborted);

      if (axios.isCancel(error)) {
        setMessage("Signal was aborted.");
      } else {
        setMessage("Request failed.");
      }
    }
  };

  return (
    <section>
      <button type="button" onClick={handleRequest}>
        Start Request
      </button>

      <p>Signal aborted: {aborted ? "yes" : "no"}</p>

      <p role="status">{message}</p>
    </section>
  );
};

/**
 * Demonstrates that an AbortController is one-shot.
 *
 * Once abort() has been called, the signal remains aborted. The second request
 * therefore creates a new controller instead of attempting to reuse the
 * already-aborted controller.
 */
export const AbortControllerOneShotExample: React.FC<AbortControllerOneShotExampleProps> = ({
  client,
}: AbortControllerOneShotExampleProps): React.ReactElement => {
  const controllerRef = useRef<AbortController | null>(null);

  const [message, setMessage] = useState<string>("A controller has not been created.");

  const handleAbort = (): void => {
    controllerRef.current?.abort();

    setMessage(
      controllerRef.current === null
        ? "There is no controller to abort."
        : `Controller aborted: ${controllerRef.current.signal.aborted}`,
    );
  };

  const handleRequest = async (): Promise<void> => {
    controllerRef.current?.abort();

    const controller: AbortController = new AbortController();

    controllerRef.current = controller;
    setMessage("Created a new controller.");

    try {
      const response: AxiosResponse<User> = await client.get<User>("/users/1", {
        signal: controller.signal,
      });

      if (!controller.signal.aborted) {
        setMessage(`Loaded ${response.data.name}.`);
      }
    } catch (error: unknown) {
      if (axios.isCancel(error)) {
        setMessage("The current request was aborted.");
      } else {
        setMessage("The current request failed.");
      }
    }
  };

  return (
    <section>
      <button type="button" onClick={handleRequest}>
        Start With New Controller
      </button>

      <button type="button" onClick={handleAbort}>
        Abort Current Controller
      </button>

      <p role="status">{message}</p>
    </section>
  );
};

/**
 * Demonstrates sharing one AbortSignal across multiple Axios requests.
 *
 * Both requests receive the same signal, so aborting the controller cancels
 * every request that is still observing that signal.
 */
export const AbortControllerSharedSignalExample: React.FC<AbortControllerSharedSignalExampleProps> = ({
  client,
}: AbortControllerSharedSignalExampleProps): React.ReactElement => {
  const controllerRef = useRef<AbortController | null>(null);

  const [message, setMessage] = useState<string>("No group request is active.");

  const handleStart = async (): Promise<void> => {
    const controller: AbortController = new AbortController();

    controllerRef.current = controller;
    setMessage("Two requests started.");

    const firstRequest: Promise<AxiosResponse<User>> = client.get<User>("/users/1", {
      signal: controller.signal,
    });

    const secondRequest: Promise<AxiosResponse<User>> = client.get<User>("/users/2", {
      signal: controller.signal,
    });

    try {
      const responses: [AxiosResponse<User>, AxiosResponse<User>] = await Promise.all([firstRequest, secondRequest]);

      if (!controller.signal.aborted) {
        setMessage(`Loaded ${responses[0].data.name} and ${responses[1].data.name}.`);
      }
    } catch (error: unknown) {
      if (axios.isCancel(error)) {
        setMessage("The shared signal cancelled the request group.");
      } else {
        setMessage("At least one request failed.");
      }
    } finally {
      if (controllerRef.current === controller) {
        controllerRef.current = null;
      }
    }
  };

  const handleAbort = (): void => {
    controllerRef.current?.abort();
  };

  return (
    <section>
      <button type="button" onClick={handleStart}>
        Start Request Group
      </button>

      <button type="button" onClick={handleAbort}>
        Abort Request Group
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

export const AbortControllerDemo: React.FC = (): React.ReactElement => {
  return (
    <main>
      <h1>AbortController</h1>

      <h2>1. Create an AbortController for an Axios Request</h2>
      <AbortControllerExample client={apiClient} />

      <h2>2. Inspect AbortSignal Cancellation State</h2>
      <AbortSignalExample client={apiClient} />

      <h2>3. Create a New Controller After Aborting</h2>
      <AbortControllerOneShotExample client={apiClient} />

      <h2>4. Share One Signal Across Multiple Requests</h2>
      <AbortControllerSharedSignalExample client={apiClient} />
    </main>
  );
};

export default AbortControllerDemo;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - AbortController owns an AbortSignal used to communicate cancellation.
// - Passing signal to Axios connects the request to the controller.
// - Calling abort() permanently marks that signal as aborted.
// - An aborted controller should not be reused for a new operation.
// - AbortSignal.aborted can be checked before applying asynchronous results.
// - One signal can coordinate cancellation of multiple compatible operations.
// - Cancellation is different from an HTTP error and should be handled separately.
// - AbortController only affects operations that actually support and observe AbortSignal.
