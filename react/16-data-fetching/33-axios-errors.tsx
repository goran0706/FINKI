/**
 * Axios Errors
 * ============
 *
 * Axios represents failed requests with rejected promises. When the rejection
 * originates from Axios, the error can be identified with axios.isAxiosError()
 * and narrowed to AxiosError<TResponse, TRequest>. The error can contain the
 * request configuration, an error code, a response when the server replied,
 * and a request object when a request was created but no response was received.
 *
 * A response is available when the server returned an HTTP response that Axios
 * considered unsuccessful under the request's validateStatus configuration.
 * A request can exist without a response when the request was sent but no
 * usable response arrived, such as certain network failures or connection
 * problems.
 *
 * Axios errors can also occur before a request is sent, for example when
 * request configuration or request setup fails. Therefore, checking only
 * error.response is insufficient for complete error handling.
 *
 * axios.isAxiosError() is preferred over instanceof AxiosError because Axios
 * can exist in more than one bundled copy or execution context, where an
 * instanceof check may not reliably identify the error.
 *
 * The generic type on AxiosError describes the expected error response data;
 * it does not validate that data at runtime. Error responses from external
 * APIs should be treated as untrusted data unless they are validated.
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

export interface ApiErrorBody {
  readonly message: string;
  readonly code?: string;
}

export interface AxiosErrorExampleProps {
  readonly client: AxiosInstance;
}

export interface AxiosResponseErrorExampleProps {
  readonly client: AxiosInstance;
}

export interface AxiosNetworkErrorExampleProps {
  readonly client: AxiosInstance;
}

export interface AxiosUnknownErrorExampleProps {
  readonly client: AxiosInstance;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * Demonstrates the basic Axios error-narrowing pattern.
 *
 * The caught value is unknown because JavaScript allows anything to be thrown.
 * axios.isAxiosError() safely determines whether Axios created the error before
 * Axios-specific properties are accessed.
 */
export const AxiosErrorExample: React.FC<AxiosErrorExampleProps> = ({
  client,
}: AxiosErrorExampleProps): React.ReactElement => {
  const [message, setMessage] = useState<string>("");

  const handleRequest = async (): Promise<void> => {
    try {
      await client.get<User>("/users/invalid");
      setMessage("Request completed successfully.");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const axiosError: AxiosError = error;

        setMessage(`Axios error: ${axiosError.message}`);

        return;
      }

      setMessage("A non-Axios error was thrown.");
    }
  };

  return (
    <section>
      <button type="button" onClick={handleRequest}>
        Handle Axios Error
      </button>

      {message !== "" && <p role="status">{message}</p>}
    </section>
  );
};

/**
 * Demonstrates an error that includes an HTTP response.
 *
 * When the server responds with an HTTP status that Axios treats as a
 * rejection, error.response can provide the status, headers, and response body.
 */
export const AxiosResponseErrorExample: React.FC<AxiosResponseErrorExampleProps> = ({
  client,
}: AxiosResponseErrorExampleProps): React.ReactElement => {
  const [message, setMessage] = useState<string>("");

  const handleRequest = async (): Promise<void> => {
    try {
      await client.get<User>("/users/invalid");
      setMessage("Request completed successfully.");
    } catch (error: unknown) {
      if (!axios.isAxiosError<ApiErrorBody>(error)) {
        setMessage("An unexpected non-Axios error occurred.");

        return;
      }

      const axiosError: AxiosError<ApiErrorBody> = error;

      if (axiosError.response !== undefined) {
        const response: AxiosResponse<ApiErrorBody> = axiosError.response;

        const serverMessage: string = response.data.message ?? "The server returned an error.";

        setMessage(`HTTP ${response.status}: ${serverMessage}`);

        return;
      }

      setMessage("Axios did not receive an HTTP response.");
    }
  };

  return (
    <section>
      <button type="button" onClick={handleRequest}>
        Inspect HTTP Error Response
      </button>

      {message !== "" && <p role="alert">{message}</p>}
    </section>
  );
};

/**
 * Demonstrates the distinction between a request and a response.
 *
 * error.request can exist when Axios created and attempted a request but did
 * not receive a response. The exact runtime type of request depends on the
 * Axios adapter and execution environment, so application code should not
 * assume browser-only request properties.
 */
export const AxiosNetworkErrorExample: React.FC<AxiosNetworkErrorExampleProps> = ({
  client,
}: AxiosNetworkErrorExampleProps): React.ReactElement => {
  const [message, setMessage] = useState<string>("");

  const handleRequest = async (): Promise<void> => {
    try {
      await client.get<User>("/users");
      setMessage("Request completed successfully.");
    } catch (error: unknown) {
      if (!axios.isAxiosError(error)) {
        setMessage("An unexpected non-Axios error occurred.");

        return;
      }

      const axiosError: AxiosError = error;

      if (axiosError.response === undefined && axiosError.request !== undefined) {
        setMessage("The request was created, but no HTTP response was received.");

        return;
      }

      setMessage("The Axios request failed.");
    }
  };

  return (
    <section>
      <button type="button" onClick={handleRequest}>
        Handle Missing Response
      </button>

      {message !== "" && <p role="status">{message}</p>}
    </section>
  );
};

/**
 * Demonstrates the complete three-way Axios error classification.
 *
 * An application can distinguish a server response error, a missing-response
 * request error, and an error that occurred while configuring or preparing the
 * request. This avoids assuming that every failure contains response data.
 */
export const AxiosUnknownErrorExample: React.FC<AxiosUnknownErrorExampleProps> = ({
  client,
}: AxiosUnknownErrorExampleProps): React.ReactElement => {
  const [message, setMessage] = useState<string>("");

  const handleRequest = async (): Promise<void> => {
    try {
      await client.get<User>("/users");
      setMessage("Request completed successfully.");
    } catch (error: unknown) {
      if (!axios.isAxiosError(error)) {
        setMessage("Unknown non-Axios error.");

        return;
      }

      const axiosError: AxiosError = error;

      if (axiosError.response !== undefined) {
        setMessage(`Server responded with HTTP ${axiosError.response.status}.`);

        return;
      }

      if (axiosError.request !== undefined) {
        setMessage("The request was sent without receiving a response.");

        return;
      }

      setMessage(`Axios could not complete request setup: ${axiosError.message}`);
    }
  };

  return (
    <section>
      <button type="button" onClick={handleRequest}>
        Classify Axios Failure
      </button>

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

export const AxiosErrorsDemo: React.FC = (): React.ReactElement => {
  return (
    <main>
      <h1>Axios Errors</h1>

      <h2>1. Narrow Unknown Errors With isAxiosError</h2>
      <AxiosErrorExample client={apiClient} />

      <h2>2. Read an HTTP Error Response</h2>
      <AxiosResponseErrorExample client={apiClient} />

      <h2>3. Distinguish a Request From a Response</h2>
      <AxiosNetworkErrorExample client={apiClient} />

      <h2>4. Classify Different Axios Failure States</h2>
      <AxiosUnknownErrorExample client={apiClient} />
    </main>
  );
};

export default AxiosErrorsDemo;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Axios requests reject promises when failures satisfy Axios's rejection rules.
// - Catch values should be treated as unknown before accessing error properties.
// - axios.isAxiosError() safely narrows an unknown value to an Axios error.
// - error.response contains HTTP response information when the server replied.
// - error.request can exist when a request was made without receiving a response.
// - Some Axios errors occur before a request is successfully completed.
// - error.response should not be assumed to exist for every Axios failure.
// - AxiosError generics describe expected data shapes but do not perform runtime validation.
