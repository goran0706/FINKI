/**
 * Axios Request Config
 * ====================
 *
 * Axios request configuration controls how an individual HTTP request is
 * executed. Configuration can specify properties such as the request URL,
 * HTTP method, query parameters, request body, headers, timeout, and response
 * handling behavior.
 *
 * When a request is created, Axios combines configuration supplied directly
 * to the request with applicable defaults from the Axios instance and global
 * Axios configuration. More specific request configuration can override
 * inherited defaults for the same option.
 *
 * Query parameters belong in the params property, while a request payload
 * belongs in the data property. Axios serializes supported data values
 * according to the configured request and adapter behavior.
 *
 * A common misconception is that params and data are interchangeable. They
 * represent different parts of an HTTP request: params are normally encoded
 * into the URL query string, while data is normally sent as the request body.
 *
 * Another important edge case is timeout. A timeout rejects the request when
 * the configured duration is exceeded; it does not guarantee that the remote
 * server stopped processing the request after the client-side timeout.
 */

import React, { useState } from "react";
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface User {
  readonly id: number;
  readonly name: string;
  readonly email: string;
}

export interface UserQueryParams {
  readonly limit: number;
  readonly search: string;
}

export interface CreateUserRequest {
  readonly name: string;
  readonly email: string;
}

export interface AxiosRequestConfigExampleProps {
  readonly client: AxiosInstance;
}

export interface AxiosQueryParamsExampleProps {
  readonly client: AxiosInstance;
}

export interface AxiosRequestBodyExampleProps {
  readonly client: AxiosInstance;
}

export interface AxiosTimeoutExampleProps {
  readonly client: AxiosInstance;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * Demonstrates request-level configuration.
 *
 * The request-specific AxiosRequestConfig supplies a method, URL, headers,
 * and timeout without changing the configuration of the Axios instance.
 */
export const AxiosRequestConfigExample: React.FC<AxiosRequestConfigExampleProps> = ({
  client,
}: AxiosRequestConfigExampleProps): React.ReactElement => {
  const [message, setMessage] = useState<string>("");

  const handleRequest = async (): Promise<void> => {
    const config: AxiosRequestConfig = {
      method: "GET",
      url: "/users/1",
      headers: {
        Accept: "application/json",
      },
      timeout: 5000,
    };

    setMessage("Sending request...");

    try {
      const response: AxiosResponse<User> = await client.request<User>(config);

      setMessage(`Received ${response.data.name}.`);
    } catch {
      setMessage("The request could not be completed.");
    }
  };

  return (
    <section>
      <button type="button" onClick={handleRequest}>
        Send Configured Request
      </button>

      {message !== "" && <p role="status">{message}</p>}
    </section>
  );
};

/**
 * Demonstrates query-string parameters through the params property.
 *
 * Axios serializes the params object into the request URL according to its
 * parameter serialization rules. Query parameters are therefore distinct
 * from a request body.
 */
export const AxiosQueryParamsExample: React.FC<AxiosQueryParamsExampleProps> = ({
  client,
}: AxiosQueryParamsExampleProps): React.ReactElement => {
  const [users, setUsers] = useState<readonly User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSearch = async (): Promise<void> => {
    const params: UserQueryParams = {
      limit: 10,
      search: "John",
    };

    setLoading(true);

    try {
      const response: AxiosResponse<readonly User[]> = await client.get<readonly User[]>("/users", {
        params,
      });

      setUsers(response.data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <button type="button" onClick={handleSearch} disabled={loading}>
        {loading ? "Searching..." : "Search With Query Parameters"}
      </button>

      <ul>
        {users.map((user: User): React.ReactElement => (
          <li key={user.id}>
            {user.name} — {user.email}
          </li>
        ))}
      </ul>
    </section>
  );
};

/**
 * Demonstrates request-body configuration through the data property.
 *
 * The data object represents the payload sent to the server. The generic
 * response type on post<TResponse>() describes the expected response body,
 * while the request object describes the outgoing payload.
 */
export const AxiosRequestBodyExample: React.FC<AxiosRequestBodyExampleProps> = ({
  client,
}: AxiosRequestBodyExampleProps): React.ReactElement => {
  const [message, setMessage] = useState<string>("");

  const handleCreateUser = async (): Promise<void> => {
    const requestBody: CreateUserRequest = {
      name: "John Doe",
      email: "john.doe@example.com",
    };

    setMessage("Creating user...");

    try {
      const response: AxiosResponse<User> = await client.post<User>("/users", requestBody, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      setMessage(`Created user ${response.data.name}.`);
    } catch {
      setMessage("The user could not be created.");
    }
  };

  return (
    <section>
      <button type="button" onClick={handleCreateUser}>
        Send Request Body
      </button>

      {message !== "" && <p role="status">{message}</p>}
    </section>
  );
};

/**
 * Demonstrates a timeout edge case.
 *
 * A timeout belongs to the client-side request configuration. When it is
 * exceeded, Axios rejects the promise. The remote server may still have
 * received or processed the request independently of that client-side event.
 */
export const AxiosTimeoutExample: React.FC<AxiosTimeoutExampleProps> = ({
  client,
}: AxiosTimeoutExampleProps): React.ReactElement => {
  const [message, setMessage] = useState<string>("");

  const handleTimeoutRequest = async (): Promise<void> => {
    const config: AxiosRequestConfig = {
      timeout: 1000,
    };

    setMessage("Waiting for response...");

    try {
      await client.get<readonly User[]>("/users", config);
      setMessage("The response arrived before the timeout.");
    } catch (requestError: unknown) {
      if (axios.isAxiosError(requestError) && requestError.code === "ECONNABORTED") {
        setMessage("The client-side request timeout was reached.");
        return;
      }

      setMessage("The request failed for another reason.");
    }
  };

  return (
    <section>
      <button type="button" onClick={handleTimeoutRequest}>
        Test Request Timeout
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
  headers: {
    Accept: "application/json",
  },
});

export const AxiosRequestConfigDemo: React.FC = (): React.ReactElement => {
  return (
    <main>
      <h1>Axios Request Config</h1>

      <h2>1. Configure an Individual Axios Request</h2>
      <AxiosRequestConfigExample client={apiClient} />

      <h2>2. Send Query Parameters With params</h2>
      <AxiosQueryParamsExample client={apiClient} />

      <h2>3. Send a Request Body With data</h2>
      <AxiosRequestBodyExample client={apiClient} />

      <h2>4. Handle a Client-Side Request Timeout</h2>
      <AxiosTimeoutExample client={apiClient} />
    </main>
  );
};

export default AxiosRequestConfigDemo;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - AxiosRequestConfig describes configuration for an individual request.
// - params represents query-string parameters rather than the request body.
// - data represents the payload sent in the request body.
// - Request-level configuration can override applicable inherited defaults.
// - timeout controls how long the client waits before rejecting the request.
// - A client-side timeout does not guarantee that remote server processing
//   stopped when the Axios request was rejected.
