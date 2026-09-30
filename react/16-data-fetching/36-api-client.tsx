/**
 * API Client
 * ==========
 *
 * An API client is a dedicated abstraction responsible for communicating with
 * a remote HTTP API. It centralizes transport concerns such as the base URL,
 * request methods, headers, serialization, response parsing, and transport
 * errors so that application code does not need to repeat those details.
 *
 * Internally, an API client delegates HTTP operations to a transport library
 * such as Axios. The client can expose typed methods that return application
 * data instead of exposing AxiosResponse objects, allowing callers to depend
 * on a stable interface rather than a particular HTTP library.
 *
 * A client can also normalize common transport behavior. For example, every
 * request can use the same authentication header, timeout configuration, or
 * response handling policy without requiring individual callers to configure
 * those options repeatedly.
 *
 * A common misconception is that an API client is the same thing as a domain
 * service. The client should primarily handle communication with the remote
 * API, while domain services can combine client operations and apply
 * application-specific rules.
 *
 * Another important edge case is error propagation. An API client should not
 * silently convert failed HTTP requests into successful empty values unless
 * that behavior is an intentional contract. Preserving meaningful failures
 * allows higher application layers to decide how errors should be presented.
 */

import axios, { type AxiosInstance, type AxiosResponse } from "axios";
import { useState, type FC, type ReactElement } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface User {
  readonly id: number;
  readonly name: string;
  readonly email: string;
}

export interface CreateUserInput {
  readonly name: string;
  readonly email: string;
}

export interface ApiClient {
  getUser(id: number): Promise<User>;
  createUser(input: CreateUserInput): Promise<User>;
}

export interface ApiClientExampleProps {
  readonly client: ApiClient;
}

export interface ApiClientMutationExampleProps {
  readonly client: ApiClient;
}

export interface ApiClientErrorExampleProps {
  readonly client: ApiClient;
}

// ---------------------------------------------------------------------
// 2. API Client Implementation
// ---------------------------------------------------------------------

/**

* Implements the API client using Axios.
*
* The implementation owns Axios-specific details and exposes only typed
* application data through the ApiClient interface.
  */
class AxiosApiClient implements ApiClient {
  constructor(private readonly http: AxiosInstance) {}

  public async getUser(id: number): Promise<User> {
    const response: AxiosResponse<User> = await this.http.get<User>(`/users/${id}`);
    return response.data;
  }

  public async createUser(input: CreateUserInput): Promise<User> {
    const response: AxiosResponse<User> = await this.http.post<User>("/users", input);
    return response.data;
  }
}

/**

* Demonstrates the mainstream API-client use case.
*
* The component requests application data through ApiClient and does not need
* to know which HTTP library performs the request or how the response body is
* extracted.
  */
export const ApiClientExample: FC<ApiClientExampleProps> = ({ client }): ReactElement => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleLoadUser = async (): Promise<void> => {
    setLoading(true);
    setError("");

    try {
      const result: User = await client.getUser(1);
      setUser(result);
    } catch {
      setUser(null);
      setError("Unable to load the user.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      {" "}
      <button type="button" onClick={handleLoadUser} disabled={loading}>
        {loading ? "Loading..." : "Load User"}{" "}
      </button>
      {user !== null && (
        <p>
          {user.name} — {user.email}{" "}
        </p>
      )}
      {error !== "" && <p role="alert">{error}</p>}{" "}
    </section>
  );
};

/**

* Demonstrates that an API client can expose typed mutation operations.
*
* The component supplies application data to createUser() while the client
* remains responsible for choosing the HTTP method, endpoint, and payload
* serialization.
  */
export const ApiClientMutationExample: FC<ApiClientMutationExampleProps> = ({ client }): ReactElement => {
  const [message, setMessage] = useState<string>("");

  const handleCreateUser = async (): Promise<void> => {
    const input: CreateUserInput = {
      name: "John Doe",
      email: "[john.doe@example.com](mailto:john.doe@example.com)",
    };

    try {
      const user: User = await client.createUser(input);
      setMessage(`Created ${user.name}.`);
    } catch {
      setMessage("Unable to create the user.");
    }
  };

  return (
    <section>
      {" "}
      <button type="button" onClick={handleCreateUser}>
        Create User Through API Client{" "}
      </button>
      {message !== "" && <p role="status">{message}</p>}{" "}
    </section>
  );
};

/**

* Demonstrates the error boundary between the API client and its caller.
*
* The client allows request failures to reject naturally instead of converting
* every failure into an empty User object. The component decides how that
* failure should be presented to the user.
  */
export const ApiClientErrorExample: FC<ApiClientErrorExampleProps> = ({ client }): ReactElement => {
  const [message, setMessage] = useState<string>("");

  const handleRequest = async (): Promise<void> => {
    try {
      await client.getUser(999999);
      setMessage("The user was loaded successfully.");
    } catch (requestError: unknown) {
      if (requestError instanceof Error) {
        setMessage(`API client error: ${requestError.message}`);
        return;
      }

      setMessage("An unknown API client error occurred.");
    }
  };

  return (
    <section>
      {" "}
      <button type="button" onClick={handleRequest}>
        Test API Client Error{" "}
      </button>
      {message !== "" && <p role="alert">{message}</p>}{" "}
    </section>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const httpClient: AxiosInstance = axios.create({
  baseURL: "https://api.example.com",
  timeout: 5000,
  headers: {
    Accept: "application/json",
  },
});

const apiClient: ApiClient = new AxiosApiClient(httpClient);

export const ApiClientDemo: FC = (): ReactElement => {
  return (
    <main>
      {" "}
      <h1>API Client</h1> <h2>1. Use a Typed API Client for Remote Data</h2> <ApiClientExample client={apiClient} />
      <h2>2. Encapsulate API Mutations</h2>
      <ApiClientMutationExample client={apiClient} />
      <h2>3. Propagate Client Errors to the Calling Layer</h2>
      <ApiClientErrorExample client={apiClient} />
    </main>
  );
};

export default ApiClientDemo;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - An API client centralizes communication with a remote HTTP API.
// - The client can hide Axios-specific request and response details.
// - Typed client methods give callers application-focused return values.
// - Shared transport configuration belongs inside the client implementation.
// - API failures should remain observable unless the client contract explicitly
//   defines another failure-handling strategy.
// - An API client communicates with an API; domain-specific business rules can
//   be handled by a separate application layer.
