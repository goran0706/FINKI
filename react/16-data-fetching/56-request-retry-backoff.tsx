/**
 * Request Retry Backoff
 * =====================
 *
 * Retry backoff controls the delay between failed HTTP request attempts.
 * Instead of retrying immediately, the client waits for a calculated interval
 * before starting the next attempt. This reduces repeated pressure on a server
 * and gives transient failures time to recover.
 *
 * Exponential backoff increases the delay after each failed attempt. A common
 * formula is baseDelay * 2^(retryNumber - 1). For example, a base delay of
 * 500 milliseconds produces 500 ms, 1000 ms, 2000 ms, and so on. A maximum
 * delay cap prevents the calculated interval from growing without bound.
 *
 * Jitter adds a random component to the calculated delay. Without jitter,
 * clients that fail at approximately the same time can retry at approximately
 * the same time, creating synchronized retry bursts. Full jitter commonly
 * selects a random delay between zero and the calculated backoff limit.
 *
 * Backoff is a scheduling policy, not a guarantee that a request should be
 * retried. Retry eligibility must still be determined separately. For example,
 * a transient network failure or a server response such as HTTP 503 may be
 * retryable, while an invalid request may not be.
 *
 * A common edge case is cancellation while a retry is sleeping. The delay must
 * listen to an AbortSignal so cancellation can clear the pending timer rather
 * than waiting for the entire backoff period to finish.
 *
 * Another edge case is a server-provided Retry-After value. When an API
 * explicitly communicates when a client should retry, that value may be more
 * appropriate than blindly applying a local backoff calculation. The exact
 * interpretation depends on the response and API contract.
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

export interface RequestRetryBackoffExampleProps {
  readonly client: AxiosInstance;
}

export interface RequestRetryJitterExampleProps {
  readonly client: AxiosInstance;
}

export interface RequestRetryPolicyBackoffExampleProps {
  readonly client: AxiosInstance;
}

export interface RequestRetryCancellationBackoffExampleProps {
  readonly client: AxiosInstance;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * Demonstrates deterministic exponential backoff.
 *
 * Each retry uses a delay calculated from the retry number. The maximum delay
 * limits the result so repeated failures cannot produce arbitrarily long waits.
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
          setMessage(`Failed after ${attempt} attempts.`);

          break;
        }

        retryCount += 1;

        const exponentialDelay: number = baseDelayMs * 2 ** (retryCount - 1);

        const delay: number = Math.min(exponentialDelay, maxDelayMs);

        setMessage(`Attempt ${attempt} failed. Retrying in ${delay} ms.`);

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
        {loading ? "Retrying..." : "Start Exponential Backoff"}
      </button>

      <p role="status">{message}</p>
    </section>
  );
};

/**
 * Demonstrates full jitter applied to an exponential backoff delay.
 *
 * The exponential calculation establishes the maximum delay. Math.random()
 * then selects a value between zero and that maximum, distributing retry times
 * instead of making every client retry at the same deterministic interval.
 */
export const RequestRetryJitterExample: React.FC<RequestRetryJitterExampleProps> = ({
  client,
}: RequestRetryJitterExampleProps): React.ReactElement => {
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("Ready.");

  const handleRequest = async (): Promise<void> => {
    const maxRetries: number = 3;
    const baseDelayMs: number = 500;
    const maxDelayMs: number = 4000;

    let retryCount: number = 0;

    setLoading(true);
    setMessage("Starting request with jitter...");

    while (true) {
      const attempt: number = retryCount + 1;

      try {
        const response: AxiosResponse<User> = await client.get<User>("/users/1");

        setMessage(`Succeeded on attempt ${attempt}: ${response.data.name}.`);

        break;
      } catch {
        if (retryCount >= maxRetries) {
          setMessage(`Failed after ${attempt} attempts.`);

          break;
        }

        retryCount += 1;

        const exponentialDelay: number = baseDelayMs * 2 ** (retryCount - 1);

        const maximumDelay: number = Math.min(exponentialDelay, maxDelayMs);

        const jitteredDelay: number = Math.floor(Math.random() * (maximumDelay + 1));

        setMessage(`Attempt ${attempt} failed. Retrying in approximately ${jitteredDelay} ms.`);

        await new Promise<void>((resolve: () => void): void => {
          window.setTimeout(resolve, jitteredDelay);
        });
      }
    }

    setLoading(false);
  };

  return (
    <section>
      <button type="button" onClick={handleRequest} disabled={loading}>
        {loading ? "Retrying..." : "Start Backoff With Jitter"}
      </button>

      <p role="status">{message}</p>
    </section>
  );
};

/**
 * Demonstrates separating retry eligibility from backoff calculation.
 *
 * The request retries only network failures and selected transient HTTP
 * statuses. Non-retryable HTTP responses stop immediately without waiting for
 * another attempt.
 */
export const RequestRetryPolicyBackoffExample: React.FC<RequestRetryPolicyBackoffExampleProps> = ({
  client,
}: RequestRetryPolicyBackoffExampleProps): React.ReactElement => {
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
        if (!axios.isAxiosError(error)) {
          setMessage("An unexpected error occurred.");
          break;
        }

        if (!isRetryable(error)) {
          setMessage(
            error.response === undefined
              ? "The error is not retryable."
              : `HTTP ${error.response.status} is not retryable.`,
          );

          break;
        }

        if (retryCount >= maxRetries) {
          setMessage(`Retry limit reached after ${attempt} attempts.`);

          break;
        }

        retryCount += 1;

        const exponentialDelay: number = baseDelayMs * 2 ** (retryCount - 1);

        const delay: number = Math.min(exponentialDelay, maxDelayMs);

        setMessage(`Retryable failure. Waiting ${delay} ms.`);

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
        {loading ? "Applying Policy..." : "Retry Eligible Failures"}
      </button>

      <p role="status">{message}</p>
    </section>
  );
};

/**
 * Demonstrates cancellation during an exponential backoff delay.
 *
 * The same AbortSignal controls both the Axios request and the timer used for
 * backoff. Aborting the signal clears the timer and rejects the pending delay.
 */
export const RequestRetryCancellationBackoffExample: React.FC<RequestRetryCancellationBackoffExampleProps> = ({
  client,
}: RequestRetryCancellationBackoffExampleProps): React.ReactElement => {
  const controllerRef = useRef<AbortController | null>(null);

  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("Ready.");

  const waitWithAbort = (delayMs: number, signal: AbortSignal): Promise<void> => {
    return new Promise<void>((resolve: () => void, reject: (reason?: unknown) => void): void => {
      if (signal.aborted) {
        reject(new DOMException("Backoff cancelled.", "AbortError"));

        return;
      }

      let timerId: number | undefined;

      const handleAbort = (): void => {
        if (timerId !== undefined) {
          window.clearTimeout(timerId);
        }

        signal.removeEventListener("abort", handleAbort);

        reject(new DOMException("Backoff cancelled.", "AbortError"));
      };

      timerId = window.setTimeout((): void => {
        signal.removeEventListener("abort", handleAbort);

        resolve();
      }, delayMs);

      signal.addEventListener("abort", handleAbort, { once: true });
    });
  };

  const handleRequest = async (): Promise<void> => {
    controllerRef.current?.abort();

    const controller: AbortController = new AbortController();

    controllerRef.current = controller;

    const maxRetries: number = 3;
    const baseDelayMs: number = 500;
    const maxDelayMs: number = 4000;

    let retryCount: number = 0;

    setLoading(true);
    setMessage("Starting retry sequence...");

    try {
      while (!controller.signal.aborted) {
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
            setMessage(`Failed after ${attempt} attempts.`);

            break;
          }

          retryCount += 1;

          const exponentialDelay: number = baseDelayMs * 2 ** (retryCount - 1);

          const delay: number = Math.min(exponentialDelay, maxDelayMs);

          setMessage(`Attempt ${attempt} failed. Waiting ${delay} ms.`);

          await waitWithAbort(delay, controller.signal);
        }
      }
    } catch (error: unknown) {
      if (error instanceof DOMException && error.name === "AbortError") {
        setMessage("Retry backoff was cancelled.");
      } else {
        setMessage("The retry sequence failed.");
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
        {loading ? "Retrying..." : "Start Cancellable Backoff"}
      </button>

      <button type="button" onClick={handleCancel} disabled={!loading}>
        Cancel Retry
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

export const RequestRetryBackoffDemo: React.FC = (): React.ReactElement => {
  return (
    <main>
      <h1>Request Retry Backoff</h1>

      <h2>1. Use Exponential Backoff With a Maximum Delay</h2>
      <RequestRetryBackoffExample client={apiClient} />

      <h2>2. Add Full Jitter to Exponential Backoff</h2>
      <RequestRetryJitterExample client={apiClient} />

      <h2>3. Apply Backoff Only to Retryable Failures</h2>
      <RequestRetryPolicyBackoffExample client={apiClient} />

      <h2>4. Cancel a Request While Backoff Is Waiting</h2>
      <RequestRetryCancellationBackoffExample client={apiClient} />
    </main>
  );
};

export default RequestRetryBackoffDemo;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Backoff delays the next attempt instead of retrying immediately.
// - Exponential backoff increases the delay after successive failures.
// - A maximum delay prevents exponential growth from becoming excessive.
// - Full jitter randomizes the delay and reduces synchronized retry bursts.
// - Backoff calculation and retry eligibility are separate concerns.
// - HTTP 408, 429, and 5xx responses can be candidates for retry depending on the API contract.
// - AbortSignal can cancel both the active Axios request and a pending backoff timer.
// - A server-provided Retry-After value may take precedence over a locally calculated delay when the API specifies that behavior.
