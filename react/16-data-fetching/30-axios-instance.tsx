/**
 * Axios Instance
 * ==============
 *
 * An Axios instance is an independently configured HTTP client created with
 * axios.create(). The instance stores its own defaults, such as baseURL,
 * timeout, headers, and other request configuration, and exposes the standard
 * Axios request methods through the returned AxiosInstance object.
 *
 * Internally, a request made through an instance merges the instance's
 * configured defaults with request-specific configuration before passing the
 * resulting configuration through Axios's request pipeline. The instance also
 * has its own interceptor managers, allowing request and response processing
 * to be configured for that client.
 *
 * An instance is useful when an application communicates with an API that has
 * shared configuration. It avoids repeating the same base URL and transport
 * options for every request and keeps separate API configurations independent.
 *
 * A common misconception is that creating an Axios instance creates a new
 * network connection. axios.create() creates a configured Axios client object;
 * connections are still managed by the underlying HTTP adapter and runtime.
 *
 * Another important detail is that instance defaults are not request results.
 * Changing defaults affects future requests made through that instance, while
 * configuration supplied directly to a request can override applicable
 * instance defaults.
 */

import React, { useState } from "react";
import axios, { AxiosError, AxiosInstance, AxiosResponse } from "axios";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface AxiosInstanceExampleProps {
  readonly client: AxiosInstance;
}

export interface AxiosInstanceIsolationExampleProps {
  readonly publicClient: AxiosInstance;
  readonly adminClient: AxiosInstance;
}

export interface AxiosInstanceErrorExampleProps {
  readonly client: AxiosInstance;
}

export interface User {
  readonly id: number;
  readonly name: string;
  readonly email: string;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * Demonstrates the mainstream use case for an Axios instance.
 *
 * The shared base URL is configured once when the instance is created, so
 * individual requests only need to provide the API-relative path.
 */
export const AxiosInstanceExample: React.FC<AxiosInstanceExampleProps> = ({
  client,
}: AxiosInstanceExampleProps): React.ReactElement => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleLoadUser = async (): Promise<void> => {
    setLoading(true);

    try {
      const response: AxiosResponse<User> = await client.get<User>("/users/1");

      setUser(response.data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <button type="button" onClick={handleLoadUser} disabled={loading}>
        {loading ? "Loading..." : "Load User"}
      </button>

      {user !== null && (
        <p>
          {user.name} — {user.email}
        </p>
      )}
    </section>
  );
};

/**
 * Demonstrates that Axios instances can maintain independent configuration.
 *
 * Each instance has its own base URL and default headers. Configuration on
 * one instance does not automatically become configuration on another.
 */
export const AxiosInstanceIsolationExample: React.FC<AxiosInstanceIsolationExampleProps> = ({
  publicClient,
  adminClient,
}: AxiosInstanceIsolationExampleProps): React.ReactElement => {
  const [message, setMessage] = useState<string>("Two independently configured Axios instances are available.");

  const handleDescribeClients = (): void => {
    const publicBaseUrl: string = publicClient.defaults.baseURL ?? "No base URL";

    const adminBaseUrl: string = adminClient.defaults.baseURL ?? "No base URL";

    setMessage(`Public client: ${publicBaseUrl}; Admin client: ${adminBaseUrl}`);
  };

  return (
    <section>
      <button type="button" onClick={handleDescribeClients}>
        Inspect Instance Configuration
      </button>

      <p>{message}</p>
    </section>
  );
};

/**
 * Demonstrates explicit request error handling.
 *
 * Axios rejects the request promise when a request fails according to Axios's
 * configured validation rules. AxiosError<T> provides typed access to Axios
 * error information while the generic parameter describes an error response
 * body when the server provides one.
 */
export const AxiosInstanceErrorExample: React.FC<AxiosInstanceErrorExampleProps> = ({
  client,
}: AxiosInstanceErrorExampleProps): React.ReactElement => {
  const [message, setMessage] = useState<string>("");

  const handleRequest = async (): Promise<void> => {
    setMessage("Requesting...");

    try {
      await client.get<User>("/users/999999");
      setMessage("Request completed.");
    } catch (requestError: unknown) {
      if (axios.isAxiosError(requestError)) {
        const axiosError: AxiosError<unknown> = requestError;

        setMessage(
          axiosError.response === undefined
            ? "The request failed before a response was received."
            : `The server returned HTTP ${axiosError.response.status}.`,
        );

        return;
      }

      setMessage("An unexpected non-Axios error occurred.");
    }
  };

  return (
    <section>
      <button type="button" onClick={handleRequest}>
        Test Error Handling
      </button>

      {message !== "" && <p role="status">{message}</p>}
    </section>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const publicApiClient: AxiosInstance = axios.create({
  baseURL: "https://api.example.com",
  timeout: 5000,
  headers: {
    Accept: "application/json",
  },
});

const adminApiClient: AxiosInstance = axios.create({
  baseURL: "https://admin.example.com",
  timeout: 10000,
  headers: {
    Accept: "application/json",
    "X-Client-Type": "admin",
  },
});

export const AxiosInstanceDemo: React.FC = (): React.ReactElement => {
  return (
    <main>
      <h1>Axios Instance</h1>

      <h2>1. Shared Configuration With an Axios Instance</h2>
      <AxiosInstanceExample client={publicApiClient} />

      <h2>2. Independent Axios Instance Configuration</h2>
      <AxiosInstanceIsolationExample publicClient={publicApiClient} adminClient={adminApiClient} />

      <h2>3. Handling Axios Instance Request Errors</h2>
      <AxiosInstanceErrorExample client={publicApiClient} />
    </main>
  );
};

export default AxiosInstanceDemo;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - axios.create() creates an independently configured AxiosInstance.
// - Instance defaults provide shared request configuration such as baseURL,
//   timeout, and headers.
// - Multiple Axios instances can maintain different API configurations.
// - Request-specific configuration can override applicable instance defaults.
// - Axios instances do not represent dedicated network connections.
// - Failed Axios requests should be handled with explicit error handling.
// - axios.isAxiosError() safely identifies errors produced by Axios.
