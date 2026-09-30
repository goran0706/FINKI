/**
 * Request Timeout
 * ===============
 *
 * A request timeout limits how long an HTTP request is allowed to remain
 * pending before the client stops waiting for a response. In Axios, a timeout
 * can be configured per request or on an Axios instance. When the configured
 * timeout is exceeded, Axios rejects the request with an Axios error whose code
 * is typically "ECONNABORTED" when the timeout is enforced by Axios.
 *
 * A timeout is different from cancellation. A timeout is an elapsed-time
 * condition that causes the HTTP client to terminate its wait automatically.
 * Cancellation is an explicit signal, commonly produced by AbortController.
 * Axios can also combine both mechanisms on the same request.
 *
 * Axios timeout measures the request's waiting period according to Axios's
 * adapter behavior. It should not be interpreted as a guarantee that every
 * server-side operation has stopped executing when the client stops waiting.
 * Server-side work can continue unless the server and protocol support a
 * corresponding cancellation mechanism.
 *
 * A common edge case is setting a timeout that is too short for a legitimate
 * operation. The resulting timeout is a client-side failure even though the
 * server may eventually complete the operation. Timeout values should therefore
 * reflect the expected latency of the particular request.
 *
 * Another common misconception is that a timeout means the request received an
 * HTTP error response. A timeout can occur without receiving any HTTP response,
 * so error handling should inspect the Axios error rather than assuming that
 * an HTTP status is available.
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

export interface RequestTimeoutExampleProps {
  readonly client: AxiosInstance;
}

export interface RequestTimeoutOverrideExampleProps {
  readonly client: AxiosInstance;
}

export interface RequestTimeoutErrorExampleProps {
  readonly client: AxiosInstance;
}

export interface RequestTimeoutCombinedExampleProps {
  readonly client: AxiosInstance;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * Demonstrates configuring a timeout for one Axios request.
 *
 * The timeout is supplied in milliseconds. If the request exceeds that limit,
 * Axios rejects the Promise instead of continuing to wait indefinitely.
 */
export const RequestTimeoutExample: React.FC<RequestTimeoutExampleProps> = ({
  client,
}: RequestTimeoutExampleProps): React.ReactElement => {
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("No request has started.");

  const handleRequest = async (): Promise<void> => {
    setLoading(true);
    setMessage("Waiting for the response...");

    try {
      const response: AxiosResponse<User> = await client.get<User>("/users/1", {
        timeout: 3000,
      });

      setMessage(`Loaded ${response.data.name}.`);
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.code === "ECONNABORTED") {
        setMessage("The request exceeded the 3-second timeout.");
      } else {
        setMessage("The request failed.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <button type="button" onClick={handleRequest} disabled={loading}>
        {loading ? "Waiting..." : "Start Timed Request"}
      </button>

      <p role="status">{message}</p>
    </section>
  );
};

/**
 * Demonstrates overriding an Axios instance timeout for a specific request.
 *
 * Request-level configuration takes precedence over the corresponding instance
 * default for that request.
 */
export const RequestTimeoutOverrideExample: React.FC<RequestTimeoutOverrideExampleProps> = ({
  client,
}: RequestTimeoutOverrideExampleProps): React.ReactElement => {
  const [message, setMessage] = useState<string>("The client provides a default timeout.");
  const [loading, setLoading] = useState<boolean>(false);

  const handleShortRequest = async (): Promise<void> => {
    setLoading(true);
    setMessage("Using a 1-second request-specific timeout...");

    try {
      const response: AxiosResponse<User> = await client.get<User>("/users/1", {
        timeout: 1000,
      });

      setMessage(`Loaded ${response.data.name}.`);
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.code === "ECONNABORTED") {
        setMessage("The request-specific timeout expired.");
      } else {
        setMessage("The request failed.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <button type="button" onClick={handleShortRequest} disabled={loading}>
        {loading ? "Waiting..." : "Use Request Timeout"}
      </button>

      <p role="status">{message}</p>
    </section>
  );
};

/**
 * Demonstrates identifying timeout errors without assuming an HTTP status.
 *
 * A timeout can happen before an HTTP response is available, so response status
 * should not be required to determine that the timeout condition occurred.
 */
export const RequestTimeoutErrorExample: React.FC<RequestTimeoutErrorExampleProps> = ({
  client,
}: RequestTimeoutErrorExampleProps): React.ReactElement => {
  const [error, setError] = useState<AxiosError | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleRequest = async (): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      await client.get<User>("/users/1", {
        timeout: 1500,
      });
    } catch (requestError: unknown) {
      if (axios.isAxiosError(requestError)) {
        setError(requestError);
      } else {
        setError(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const isTimeout: boolean = error?.code === "ECONNABORTED";

  return (
    <section>
      <button type="button" onClick={handleRequest} disabled={loading}>
        {loading ? "Checking..." : "Check Timeout"}
      </button>

      {error !== null && (
        <div role="alert">
          {isTimeout ? <p>The request timed out before completing.</p> : <p>The request failed for another reason.</p>}

          <p>HTTP status: {error.response?.status ?? "No response"}</p>
        </div>
      )}
    </section>
  );
};

/**
 * Demonstrates combining an Axios timeout with AbortController.
 *
 * The timeout provides automatic elapsed-time cancellation, while the abort
 * signal provides an explicit cancellation mechanism. Either condition can
 * cause the request to reject.
 */
export const RequestTimeoutCombinedExample: React.FC<RequestTimeoutCombinedExampleProps> = ({
  client,
}: RequestTimeoutCombinedExampleProps): React.ReactElement => {
  const [controller, setController] = useState<AbortController | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("Ready.");

  const handleRequest = async (): Promise<void> => {
    const nextController: AbortController = new AbortController();

    setController(nextController);
    setLoading(true);
    setMessage("Request has a 5-second timeout and can be cancelled manually.");

    try {
      const response: AxiosResponse<User> = await client.get<User>("/users/1", {
        timeout: 5000,
        signal: nextController.signal,
      });

      if (!nextController.signal.aborted) {
        setMessage(`Loaded ${response.data.name}.`);
      }
    } catch (error: unknown) {
      if (axios.isCancel(error)) {
        setMessage("The request was cancelled manually.");
      } else if (axios.isAxiosError(error) && error.code === "ECONNABORTED") {
        setMessage("The request exceeded its timeout.");
      } else {
        setMessage("The request failed.");
      }
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
      <button type="button" onClick={handleRequest} disabled={loading}>
        {loading ? "Requesting..." : "Start Request"}
      </button>

      <button type="button" onClick={handleCancel} disabled={!loading}>
        Cancel Early
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

export const RequestTimeoutDemo: React.FC = (): React.ReactElement => {
  return (
    <main>
      <h1>Request Timeout</h1>

      <h2>1. Configure a Timeout for an Individual Request</h2>
      <RequestTimeoutExample client={apiClient} />

      <h2>2. Override an Axios Instance Timeout</h2>
      <RequestTimeoutOverrideExample client={apiClient} />

      <h2>3. Detect Timeout Errors Without Requiring an HTTP Response</h2>
      <RequestTimeoutErrorExample client={apiClient} />

      <h2>4. Combine Timeout and Explicit Cancellation</h2>
      <RequestTimeoutCombinedExample client={apiClient} />
    </main>
  );
};

export default RequestTimeoutDemo;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Axios timeouts are expressed in milliseconds.
// - A request-level timeout can override the Axios instance timeout for that request.
// - A timeout can occur without receiving an HTTP response.
// - Axios timeout errors commonly use the ECONNABORTED error code.
// - Timeout handling should not assume that error.response is available.
// - Timeout and AbortController cancellation are different mechanisms.
// - Axios can use timeout and AbortSignal together on the same request.
// - A client-side timeout does not guarantee that server-side work has stopped.
