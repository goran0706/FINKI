/**
 * Request Retry
 * =============
 *
 * Request retry means attempting the same asynchronous operation again after a
 * failed attempt. A retry policy normally defines which failures are retryable,
 * how many additional attempts are permitted, and how long to wait between
 * attempts.
 *
 * Retries should be bounded. An unbounded retry loop can keep consuming network
 * resources and can prevent an application from reaching a stable failure state.
 * A retry count therefore represents additional attempts after the initial
 * request rather than an unlimited number of executions.
 *
 * Backoff controls the delay between attempts. Exponential backoff increases
 * the delay as failures continue, commonly using a formula such as
 * baseDelay * 2^(attempt - 1). A small deterministic cap prevents delays from
 * becoming excessively large.
 *
 * Retry eligibility is separate from retry count. A transient network failure
 * may be retryable, while a request rejected because of invalid input normally
 * should not be retried automatically. HTTP status codes must therefore be
 * interpreted according to the API's semantics rather than treating every
 * failure as transient.
 *
 * A common edge case is a request whose first attempt succeeds after the user
 * has already started a newer request. Retry logic must still respect the
 * current operation and must not allow an obsolete retry sequence to overwrite
 * newer state.
 *
 * Another important edge case is cancellation during a retry delay. A pending
 * timer must be cancellable so that an obsolete retry sequence does not wait for
 * the full backoff interval before stopping.
 */

import React, { useRef, useState } from "react";
import axios, { AxiosError, AxiosInstance, AxiosResponse } from "axios";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface User {
  readonly id: number;
  readonly name: string;
  readonly email: string;
}

export interface RequestRetryExampleProps {
  readonly client: AxiosInstance;
}

export interface RequestRetryPolicyExampleProps {
  readonly client: AxiosInstance;
}

export interface RequestRetryBackoffExampleProps {
  readonly client: AxiosInstance;
}

export interface RequestRetryCancellationExampleProps {
  readonly client: AxiosInstance;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * Demonstrates a bounded retry policy.
 *
 * The first request is the initial attempt. A retry count of three permits at
 * most three additional attempts after that initial attempt, for a maximum of
 * four HTTP requests.
 */
export const RequestRetryExample: React.FC<RequestRetryExampleProps> = ({
  client,
}: RequestRetryExampleProps): React.ReactElement => {
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("No request has started.");

  const handleRequest = async (): Promise<void> => {
    const maxRetries: number = 3;
    let retryCount: number = 0;

    setLoading(true);
    setMessage("Starting request...");

    while (true) {
      const attempt: number = retryCount + 1;

      try {
        const response: AxiosResponse<User> = await client.get<User>("/users/1");

        setMessage(`Request succeeded on attempt ${attempt}: ${response.data.name}.`);

        break;
      } catch (error: unknown) {
        if (retryCount >= maxRetries) {
          setMessage(`Request failed after ${attempt} attempts.`);

          break;
        }

        retryCount += 1;

        setMessage(`Attempt ${attempt} failed. Retrying...`);
      }
    }

    setLoading(false);
  };

  return (
    <section>
      <button type="button" onClick={handleRequest} disabled={loading}>
        {loading ? "Retrying..." : "Request With Retries"}
      </button>

      <p role="status">{message}</p>
    </section>
  );
};

/**
 * Demonstrates deciding whether an Axios failure is retryable.
 *
 * The example retries network errors and selected server-side status codes while
 * avoiding automatic retries for ordinary client-side HTTP errors.
 */
export const RequestRetryPolicyExample: React.FC<RequestRetryPolicyExampleProps> = ({
  client,
}: RequestRetryPolicyExampleProps): React.ReactElement => {
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("Ready.");

  const isRetryable = (error: AxiosError): boolean => {
    if (error.code === "ERR_CANCELED") {
      return false;
    }

    if (error.response === undefined) {
      return true;
    }

    const status: number = error.response.status;

    return status === 408 || status === 429 || status >= 500;
  };

  const handleRequest = async (): Promise<void> => {
    const maxRetries: number = 2;
    let retryCount: number = 0;

    setLoading(true);
    setMessage("Starting request...");

    while (true) {
      const attempt: number = retryCount + 1;

      try {
        const response: AxiosResponse<User> = await client.get<User>("/users/1");

        setMessage(`Succeeded on attempt ${attempt}: ${response.data.name}.`);

        break;
      } catch (error: unknown) {
        if (!axios.isAxiosError(error)) {
          setMessage("A non-Axios error occurred.");
          break;
        }

        if (!isRetryable(error)) {
          setMessage(
            `Failure is not retryable${error.response === undefined ? "." : ` (HTTP ${error.response.status}).`}`,
          );

          break;
        }

        if (retryCount >= maxRetries) {
          setMessage(`Retry limit reached after ${attempt} attempts.`);

          break;
        }

        retryCount += 1;

        setMessage(`Retryable failure on attempt ${attempt}. Retrying...`);
      }
    }

    setLoading(false);
  };

  return (
    <section>
      <button type="button" onClick={handleRequest} disabled={loading}>
        {loading ? "Processing..." : "Apply Retry Policy"}
      </button>

      <p role="status">{message}</p>
    </section>
  );
};

/**
 * Demonstrates exponential backoff between retry attempts.
 *
 * The delay starts at the configured base value and doubles after each failed
 * retry. The maximum delay is capped so repeated failures cannot create an
 * unbounded waiting period.
 */
export const RequestRetryBackoffExample: React.FC<RequestRetryBackoffExampleProps> = ({
  client,
}: RequestRetryBackoffExampleProps): React.ReactElement => {
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("Ready.");

  const handleRequest = async (): Promise<void> => {
    const maxRetries: number = 3;
    const baseDelayMs: number = 500;
    const maxDelayMs: number = 4000;

    let retryCount: number = 0;

    setLoading(true);
    setMessage("Starting request...");

    while (true) {
      const attempt: number = retryCount + 1;

      try {
        const response: AxiosResponse<User> = await client.get<User>("/users/1");

        setMessage(`Succeeded on attempt ${attempt}: ${response.data.name}.`);

        break;
      } catch (error: unknown) {
        if (retryCount >= maxRetries) {
          setMessage(`Request failed after ${attempt} attempts.`);

          break;
        }

        retryCount += 1;

        const calculatedDelay: number = baseDelayMs * 2 ** (retryCount - 1);

        const delay: number = Math.min(calculatedDelay, maxDelayMs);

        setMessage(`Attempt ${attempt} failed. Retrying in ${delay} ms...`);

        await new Promise<void>((resolve: () => void): void => {
          window.setTimeout(resolve, delay);
        });
      }
    }

    setLoading(false);
  };

  return (
    <section>
      <button type="button" onClick={handleRequest} disabled={loading}>
        {loading ? "Waiting..." : "Retry With Backoff"}
      </button>

      <p role="status">{message}</p>
    </section>
  );
};

/**
 * Demonstrates cancelling a retry sequence while it is waiting for backoff.
 *
 * The AbortController is used for both the Axios request and the retry delay.
 * This prevents an obsolete retry sequence from continuing after cancellation.
 */
export const RequestRetryCancellationExample: React.FC<RequestRetryCancellationExampleProps> = ({
  client,
}: RequestRetryCancellationExampleProps): React.ReactElement => {
  const controllerRef = useRef<AbortController | null>(null);

  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("Ready.");

  const waitForRetry = (delayMs: number, signal: AbortSignal): Promise<void> => {
    return new Promise<void>((resolve: () => void, reject: (reason?: unknown) => void): void => {
      if (signal.aborted) {
        reject(new DOMException("Retry cancelled.", "AbortError"));

        return;
      }

      const timerId: number = window.setTimeout((): void => {
        signal.removeEventListener("abort", handleAbort);

        resolve();
      }, delayMs);

      const handleAbort = (): void => {
        window.clearTimeout(timerId);

        signal.removeEventListener("abort", handleAbort);

        reject(new DOMException("Retry cancelled.", "AbortError"));
      };

      signal.addEventListener("abort", handleAbort, { once: true });
    });
  };

  const handleRequest = async (): Promise<void> => {
    controllerRef.current?.abort();

    const controller: AbortController = new AbortController();

    controllerRef.current = controller;

    const maxRetries: number = 3;
    let retryCount: number = 0;

    setLoading(true);
    setMessage("Starting retry sequence...");

    try {
      while (true) {
        if (controller.signal.aborted) {
          return;
        }

        const attempt: number = retryCount + 1;

        try {
          const response: AxiosResponse<User> = await client.get<User>("/users/1", {
            signal: controller.signal,
          });

          if (controller.signal.aborted) {
            return;
          }

          setMessage(`Succeeded on attempt ${attempt}: ${response.data.name}.`);

          break;
        } catch (error: unknown) {
          if (axios.isCancel(error)) {
            return;
          }

          if (retryCount >= maxRetries) {
            setMessage(`Request failed after ${attempt} attempts.`);

            break;
          }

          retryCount += 1;

          const delay: number = Math.min(500 * 2 ** (retryCount - 1), 4000);

          setMessage(`Attempt ${attempt} failed. Waiting ${delay} ms before retrying...`);

          await waitForRetry(delay, controller.signal);
        }
      }
    } catch (error: unknown) {
      if (error instanceof DOMException && error.name === "AbortError") {
        setMessage("Retry sequence cancelled.");
      } else {
        setMessage("Retry sequence failed.");
      }
    } finally {
      if (controllerRef.current === controller) {
        controllerRef.current = null;
        setLoading(false);
      }
    }
  };

  const handleCancel = (): void => {
    controllerRef.current?.abort();
  };

  return (
    <section>
      <button type="button" onClick={handleRequest} disabled={loading}>
        {loading ? "Retry Sequence Running..." : "Start Retry Sequence"}
      </button>

      <button type="button" onClick={handleCancel} disabled={!loading}>
        Cancel Retry Sequence
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

export const RequestRetryDemo: React.FC = (): React.ReactElement => {
  return (
    <main>
      <h1>Request Retry</h1>

      <h2>1. Limit the Number of Retry Attempts</h2>
      <RequestRetryExample client={apiClient} />

      <h2>2. Retry Only Failures That Match the Retry Policy</h2>
      <RequestRetryPolicyExample client={apiClient} />

      <h2>3. Add Exponential Backoff Between Attempts</h2>
      <RequestRetryBackoffExample client={apiClient} />

      <h2>4. Cancel a Retry Sequence and Its Backoff Delay</h2>
      <RequestRetryCancellationExample client={apiClient} />
    </main>
  );
};

export default RequestRetryDemo;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - A bounded retry policy prevents an operation from retrying indefinitely.
// - Retry counts should distinguish the initial attempt from additional retries.
// - Retry eligibility should be based on the type of failure rather than every error.
// - Network failures and selected transient HTTP statuses can be retryable.
// - Client-side validation failures generally should not be retried automatically.
// - Exponential backoff spaces repeated attempts and can be capped at a maximum delay.
// - Retry delays should also be cancellable when the operation is no longer relevant.
// - Cancellation and retry-count checks should prevent obsolete retry sequences from continuing.
