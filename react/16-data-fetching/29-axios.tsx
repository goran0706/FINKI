/**
 * Axios
 * =====
 *
 * Axios is a promise-based HTTP client for browsers and other JavaScript
 * environments. It provides an API for sending HTTP requests and receiving
 * HTTP responses while adding conveniences such as automatic request and
 * response transformations, configurable defaults, interceptors, timeout
 * support, request cancellation, and structured error objects.
 *
 * Axios methods such as `get()`, `post()`, `put()`, `patch()`, and `delete()`
 * return Promises. For a successful request, the Promise resolves with an
 * AxiosResponse object containing properties such as `data`, `status`,
 * `statusText`, `headers`, `config`, and `request`.
 *
 * Unlike the Fetch API, Axios normally rejects its Promise when the HTTP
 * response status falls outside its configured `validateStatus` range. The
 * rejected AxiosError can contain a `response` when the server responded, a
 * `request` when the request was created but no usable response was received,
 * and a `message` or `code` describing the failure.
 *
 * Axios automatically transforms JavaScript objects supplied as request data
 * into JSON and normally sets an appropriate Content-Type header. JSON
 * response data is also automatically parsed when the response indicates JSON
 * content. The resulting value is available directly through `response.data`.
 *
 * Axios is not built into React or the browser. It must be installed as an
 * application dependency before it can be imported. This example uses the
 * public Axios API and explicit TypeScript types for response data and errors.
 */

import axios, { AxiosError, type AxiosResponse } from "axios";
import { type FC, type ReactNode, useState } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface AxiosGetProps {
  readonly url: string;
}

export interface AxiosResponseDataProps {
  readonly url: string;
}

export interface AxiosStatusProps {
  readonly url: string;
}

export interface AxiosPostProps {
  readonly url: string;
  readonly name: string;
  readonly email: string;
}

export interface AxiosErrorResponseProps {
  readonly status: number;
  readonly message: string;
}

export interface AxiosErrorNarrowingProps {
  readonly error: unknown;
}

export interface AxiosConfigProps {
  readonly url: string;
  readonly timeout: number;
}

export interface AxiosHeadersProps {
  readonly url: string;
  readonly headerName: string;
  readonly headerValue: string;
}

export interface AxiosValidateStatusProps {
  readonly url: string;
  readonly status: number;
}

export interface AxiosRequestStateProps {
  readonly url: string;
}

interface ExampleUser {
  readonly id: number;
  readonly name: string;
  readonly email: string;
}

interface ExampleCreateUser {
  readonly name: string;
  readonly email: string;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * Demonstrates the basic Axios GET request API.
 */
export const AxiosGetExample: FC<AxiosGetProps> = ({ url }: AxiosGetProps): ReactNode => {
  const [message, setMessage] = useState<string>("No request has been made.");

  const handleRequest = async (): Promise<void> => {
    try {
      const response: AxiosResponse = await axios.get(url);

      setMessage(`Request completed with HTTP ${response.status}.`);
    } catch {
      setMessage("Axios rejected the request.");
    }
  };

  return (
    <section>
      <h3>Basic Axios GET request</h3>

      <p>{message}</p>

      <button
        type="button"
        onClick={(): void => {
          void handleRequest();
        }}
      >
        Send GET request
      </button>
    </section>
  );
};

/**
 * Demonstrates accessing application data through AxiosResponse.data.
 */
export const AxiosResponseDataExample: FC<AxiosResponseDataProps> = ({ url }: AxiosResponseDataProps): ReactNode => {
  const [user, setUser] = useState<ExampleUser | null>(null);

  const handleRequest = async (): Promise<void> => {
    try {
      const response: AxiosResponse<ExampleUser> = await axios.get<ExampleUser>(url);

      setUser(response.data);
    } catch {
      setUser(null);
    }
  };

  return (
    <section>
      <h3>Reading response.data</h3>

      {user === null ? (
        <p>No user data has been received.</p>
      ) : (
        <>
          <p>ID: {user.id}</p>

          <p>Name: {user.name}</p>

          <p>Email: {user.email}</p>
        </>
      )}

      <button
        type="button"
        onClick={(): void => {
          void handleRequest();
        }}
      >
        Load user
      </button>
    </section>
  );
};

/**
 * Demonstrates accessing standard HTTP response metadata from AxiosResponse.
 */
export const AxiosStatusExample: FC<AxiosStatusProps> = ({ url }: AxiosStatusProps): ReactNode => {
  const [message, setMessage] = useState<string>("No response has been received.");

  const handleRequest = async (): Promise<void> => {
    try {
      const response: AxiosResponse = await axios.get(url);

      setMessage(`Status: ${response.status}; status text: ${response.statusText}`);
    } catch {
      setMessage("Axios rejected the request.");
    }
  };

  return (
    <section>
      <h3>Axios response metadata</h3>

      <p>{message}</p>

      <button
        type="button"
        onClick={(): void => {
          void handleRequest();
        }}
      >
        Read response metadata
      </button>
    </section>
  );
};

/**
 * Demonstrates sending a JavaScript object as an Axios JSON request body.
 */
export const AxiosPostExample: FC<AxiosPostProps> = ({ url, name, email }: AxiosPostProps): ReactNode => {
  const [message, setMessage] = useState<string>("No request has been sent.");

  const handleRequest = async (): Promise<void> => {
    const payload: ExampleCreateUser = {
      name,
      email,
    };

    try {
      const response: AxiosResponse<ExampleUser> = await axios.post<
        ExampleUser,
        AxiosResponse<ExampleUser>,
        ExampleCreateUser
      >(url, payload);

      setMessage(`Created user with HTTP ${response.status}.`);
    } catch {
      setMessage("Axios rejected the POST request.");
    }
  };

  return (
    <section>
      <h3>Sending JSON with Axios</h3>

      <p>{message}</p>

      <button
        type="button"
        onClick={(): void => {
          void handleRequest();
        }}
      >
        Create user
      </button>
    </section>
  );
};

/**
 * Demonstrates the AxiosError response property for an HTTP error response.
 */
export const AxiosErrorResponseExample: FC<AxiosErrorResponseProps> = ({
  status,
  message,
}: AxiosErrorResponseProps): ReactNode => {
  const error: AxiosError<{
    readonly message: string;
  }> = new AxiosError(message, "ERR_BAD_RESPONSE", undefined, undefined, {
    data: {
      message,
    },
    status,
    statusText: message,
    headers: {},
    config: {
      headers: {},
    },
  });

  return (
    <section>
      <h3>Axios HTTP error response</h3>

      <p>Error message: {error.message}</p>

      <p>HTTP status: {error.response?.status ?? "Unavailable"}</p>

      <p>Server message: {error.response?.data.message ?? "Unavailable"}</p>

      <p>Axios errors can contain a response when the server actually returned an HTTP response.</p>
    </section>
  );
};

/**
 * Demonstrates narrowing an unknown caught value with axios.isAxiosError().
 */
export const AxiosErrorNarrowingExample: FC<AxiosErrorNarrowingProps> = ({
  error,
}: AxiosErrorNarrowingProps): ReactNode => {
  let message: string;

  if (axios.isAxiosError(error)) {
    message = `Axios error: ${error.message}`;
  } else if (error instanceof Error) {
    message = `JavaScript error: ${error.message}`;
  } else {
    message = "Unknown error value.";
  }

  return (
    <section>
      <h3>Narrowing Axios errors</h3>

      <p>{message}</p>

      <p>axios.isAxiosError() provides a runtime type guard for Axios errors.</p>
    </section>
  );
};

/**
 * Demonstrates configuring request-specific Axios options.
 */
export const AxiosConfigExample: FC<AxiosConfigProps> = ({ url, timeout }: AxiosConfigProps): ReactNode => {
  const [message, setMessage] = useState<string>("No request has been made.");

  const handleRequest = async (): Promise<void> => {
    try {
      const response: AxiosResponse = await axios.get(url, {
        timeout,
      });

      setMessage(`HTTP ${response.status}; configured timeout: ${timeout} ms.`);
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.code === "ECONNABORTED") {
        setMessage("Axios aborted the request because the configured timeout elapsed.");
        return;
      }

      setMessage("Axios rejected the request.");
    }
  };

  return (
    <section>
      <h3>Axios request configuration</h3>

      <p>{message}</p>

      <button
        type="button"
        onClick={(): void => {
          void handleRequest();
        }}
      >
        Send configured request
      </button>
    </section>
  );
};

/**
 * Demonstrates supplying request headers through Axios request configuration.
 */
export const AxiosHeadersExample: FC<AxiosHeadersProps> = ({
  url,
  headerName,
  headerValue,
}: AxiosHeadersProps): ReactNode => {
  const [message, setMessage] = useState<string>("No request has been made.");

  const handleRequest = async (): Promise<void> => {
    try {
      const response: AxiosResponse = await axios.get(url, {
        headers: {
          [headerName]: headerValue,
        },
      });

      setMessage(`HTTP ${response.status}; request header configured: ${headerName}.`);
    } catch {
      setMessage("Axios rejected the request.");
    }
  };

  return (
    <section>
      <h3>Axios request headers</h3>

      <p>{message}</p>

      <button
        type="button"
        onClick={(): void => {
          void handleRequest();
        }}
      >
        Send request with header
      </button>
    </section>
  );
};

/**
 * Demonstrates changing Axios's HTTP-status rejection behavior with
 * validateStatus.
 */
export const AxiosValidateStatusExample: FC<AxiosValidateStatusProps> = ({
  url,
  status,
}: AxiosValidateStatusProps): ReactNode => {
  const [message, setMessage] = useState<string>("No request has been made.");

  const handleRequest = async (): Promise<void> => {
    try {
      const response: AxiosResponse = await axios.get(url, {
        validateStatus: (responseStatus: number): boolean => responseStatus === status,
      });

      setMessage(`Axios resolved because validateStatus accepted HTTP ${response.status}.`);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setMessage(`Axios rejected HTTP ${error.response?.status ?? "unknown"} because validateStatus returned false.`);
        return;
      }

      setMessage("The request failed unexpectedly.");
    }
  };

  return (
    <section>
      <h3>Custom HTTP-status validation</h3>

      <p>{message}</p>

      <button
        type="button"
        onClick={(): void => {
          void handleRequest();
        }}
      >
        Test validateStatus
      </button>
    </section>
  );
};

/**
 * Demonstrates a basic Axios loading, success, and error state flow.
 */
export const AxiosRequestStateExample: FC<AxiosRequestStateProps> = ({ url }: AxiosRequestStateProps): ReactNode => {
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleRequest = async (): Promise<void> => {
    setState("loading");

    try {
      await axios.get(url);

      setState("success");
    } catch {
      setState("error");
    }
  };

  return (
    <section>
      <h3>Axios request state</h3>

      <p>State: {state}</p>

      <button
        type="button"
        onClick={(): void => {
          void handleRequest();
        }}
      >
        Send request
      </button>
    </section>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const AxiosContainer: FC = (): ReactNode => {
  return (
    <main>
      <h1>Axios</h1>

      <h2>1. Sending a basic GET request</h2>
      <AxiosGetExample url="https://example.com/api/users" />

      <h2>2. Reading typed response data</h2>
      <AxiosResponseDataExample url="https://example.com/api/users/1" />

      <h2>3. Reading Axios response metadata</h2>
      <AxiosStatusExample url="https://example.com/api/users" />

      <h2>4. Sending a JSON request body</h2>
      <AxiosPostExample url="https://example.com/api/users" name="John Doe" email="john.doe@example.com" />

      <h2>5. Inspecting an Axios HTTP error</h2>
      <AxiosErrorResponseExample status={404} message="User not found" />

      <h2>6. Narrowing unknown errors</h2>
      <AxiosErrorNarrowingExample error={new AxiosError("Example Axios error")} />

      <h2>7. Configuring a request timeout</h2>
      <AxiosConfigExample url="https://example.com/api/users" timeout={5000} />

      <h2>8. Supplying request headers</h2>
      <AxiosHeadersExample url="https://example.com/api/users" headerName="X-Example-Header" headerValue="example" />

      <h2>9. Customizing HTTP-status validation</h2>
      <AxiosValidateStatusExample url="https://example.com/api/users" status={404} />

      <h2>10. Representing Axios request state</h2>
      <AxiosRequestStateExample url="https://example.com/api/users" />
    </main>
  );
};

export default AxiosContainer;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Axios is a promise-based HTTP client with browser support.
// - Axios methods such as get(), post(), put(), patch(), and delete() return Promises.
// - Successful requests resolve with an AxiosResponse object.
// - Response data is available through response.data.
// - Axios supports generic type parameters for describing expected response data.
// - Axios normally transforms JavaScript objects supplied as request data into JSON.
// - Axios normally parses JSON response data and exposes the parsed value through response.data.
// - Axios normally rejects requests when HTTP status validation fails.
// - AxiosError can contain response information when the server returned an HTTP response.
// - axios.isAxiosError() is a runtime type guard for identifying Axios errors.
// - Request-specific options can configure headers, timeout, credentials, and other request behavior.
// - validateStatus can customize which HTTP statuses cause Axios to resolve or reject.
// - Axios HTTP errors and transport-level failures can be handled separately.
// - TypeScript response types describe expected data but do not validate untrusted server data at runtime.
// - Axios must be installed as an application dependency before it can be imported.
