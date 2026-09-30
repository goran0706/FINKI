/**
 * API Client vs API Service
 * =========================
 *
 * An API client is a transport-focused abstraction responsible for communicating
 * with a remote HTTP API. It commonly owns request methods, base URLs, headers,
 * serialization, response parsing, and transport-specific error behavior.
 *
 * An API service is an application-focused abstraction built on top of an API
 * client. It exposes operations meaningful to the application's domain, such
 * as retrieving users, finding active users, or creating users. The service can
 * combine client operations and apply domain-specific rules before returning
 * data to its callers.
 *
 * Internally, the client knows how to communicate with the remote API, while
 * the service knows which API operations are useful to the application. A React
 * component can therefore depend on a service without knowing the HTTP library,
 * endpoint paths, headers, or response-envelope structure used underneath.
 *
 * A common misconception is that an API client and API service are simply two
 * names for the same abstraction. They can be combined in a small application,
 * but separating them gives each layer a distinct responsibility and makes
 * changes to transport details less likely to affect application code.
 *
 * An important edge case is error handling. Neither abstraction should silently
 * convert every failure into an empty value unless that behavior is part of its
 * explicit contract. Preserving meaningful failures lets the appropriate
 * application layer decide how an error should be handled or displayed.
 */

import axios, { type AxiosError, type AxiosInstance, type AxiosResponse } from "axios";
import { useState, type FC, type ReactElement } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface User {
  readonly id: number;
  readonly name: string;
  readonly email: string;
  readonly active: boolean;
}

export interface CreateUserInput {
  readonly name: string;
  readonly email: string;
}

export interface ApiClient {
  get<TResponse>(path: string): Promise<TResponse>;
  post<TResponse, TRequest>(path: string, body: TRequest): Promise<TResponse>;
}

export interface UserApiService {
  getUsers(): Promise<readonly User[]>;
  getActiveUsers(): Promise<readonly User[]>;
  createUser(input: CreateUserInput): Promise<User>;
}

export interface ApiClientResponsibilityExampleProps {
  readonly client: ApiClient;
}

export interface ApiServiceResponsibilityExampleProps {
  readonly service: UserApiService;
}

export interface ApiClientVsServiceBoundaryExampleProps {
  readonly service: UserApiService;
}

export interface ApiClientVsServiceErrorExampleProps {
  readonly service: UserApiService;
}

// ---------------------------------------------------------------------
// 2. API Client Implementation
// ---------------------------------------------------------------------

/**

* Implements the transport-oriented API client.
*
* The client knows the remote endpoint paths and Axios response structure.
* It returns typed data so callers do not need to work with AxiosResponse.
  */
export class AxiosUserApiClient implements ApiClient {
  public constructor(private readonly http: AxiosInstance) {}

  public async get<TResponse>(path: string): Promise<TResponse> {
    const response: AxiosResponse<TResponse> = await this.http.get<TResponse>(path);
    return response.data;
  }

  public async post<TResponse, TRequest>(path: string, body: TRequest): Promise<TResponse> {
    const response: AxiosResponse<TResponse> = await this.http.post<TResponse>(path, body);
    return response.data;
  }
}

// ---------------------------------------------------------------------
// 3. API Service Implementation
// ---------------------------------------------------------------------

/**

* Implements the application-focused user service.
*
* The service depends on the ApiClient interface rather than directly depending
* on Axios, allowing transport implementation details to remain behind the
* client boundary.
  */
export class DefaultUserApiService implements UserApiService {
  public constructor(private readonly client: ApiClient) {}

  public async getUsers(): Promise<readonly User[]> {
    return this.client.get<readonly User[]>("/users");
  }

  public async getActiveUsers(): Promise<readonly User[]> {
    const users: readonly User[] = await this.getUsers();
    return users.filter((user: User): boolean => user.active);
  }

  public async createUser(input: CreateUserInput): Promise<User> {
    return this.client.post<User, CreateUserInput>("/users", input);
  }
}

// ---------------------------------------------------------------------
// 4. API Client Responsibility
// ---------------------------------------------------------------------

/**

* Demonstrates the API client's responsibility.
*
* The component depends on the client and requests raw application data from
* an endpoint. It does not contain domain-specific filtering or composition.
  */
export const ApiClientResponsibilityExample: FC<ApiClientResponsibilityExampleProps> = ({ client }): ReactElement => {
  const [users, setUsers] = useState<readonly User[]>([]);
  const [message, setMessage] = useState<string>("");

  const handleLoadUsers = async (): Promise<void> => {
    setMessage("");

    try {
      const result: readonly User[] = await client.get<readonly User[]>("/users");
      setUsers(result);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setMessage(error.message);
        return;
      }

      setMessage("The API client request failed.");
    }
  };

  return (
    <section>
      <button type="button" onClick={handleLoadUsers}>
        Load Users Through API Client{" "}
      </button>
      <ul>
        {users.map(
          (user: User): ReactElement => (
            <li key={user.id}>{user.name}</li>
          ),
        )}
      </ul>
      {message !== "" && <p role="alert">{message}</p>}
    </section>
  );
};

// ---------------------------------------------------------------------
// 5. API Service Responsibility
// ---------------------------------------------------------------------

/**

* Demonstrates the API service's responsibility.
*
* The component asks for active users as a domain operation. The component does
* not know whether the service retrieves all users and filters them locally or
* uses a dedicated server-side endpoint.
  */
export const ApiServiceResponsibilityExample: FC<ApiServiceResponsibilityExampleProps> = ({
  service,
}): ReactElement => {
  const [users, setUsers] = useState<readonly User[]>([]);
  const [message, setMessage] = useState<string>("");

  const handleLoadActiveUsers = async (): Promise<void> => {
    setMessage("");

    try {
      const activeUsers: readonly User[] = await service.getActiveUsers();
      setUsers(activeUsers);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setMessage(error.message);
        return;
      }

      setMessage("The API service request failed.");
    }
  };

  return (
    <section>
      {" "}
      <button type="button" onClick={handleLoadActiveUsers}>
        Load Active Users Through API Service{" "}
      </button>
      <ul>
        {users.map(
          (user: User): ReactElement => (
            <li key={user.id}>{user.name}</li>
          ),
        )}
      </ul>
      {message !== "" && <p role="alert">{message}</p>}
    </section>
  );
};

// ---------------------------------------------------------------------
// 6. Client vs Service Boundary
// ---------------------------------------------------------------------

/**

* Demonstrates the boundary between client and service responsibilities.
*
* The service exposes a domain operation while the underlying client exposes
* transport operations. The React component only needs the service contract.
  */
export const ApiClientVsServiceBoundaryExample: FC<ApiClientVsServiceBoundaryExampleProps> = ({
  service,
}): ReactElement => {
  const [message, setMessage] = useState<string>("The component depends on the service contract.");

  const handleCreateUser = async (): Promise<void> => {
    const input: CreateUserInput = {
      name: "John Doe",
      email: "[john.doe@example.com](mailto:john.doe@example.com)",
    };

    try {
      const user: User = await service.createUser(input);
      setMessage(`Created ${user.name}.`);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setMessage(error.message);
        return;
      }

      setMessage("The user could not be created.");
    }
  };

  return (
    <section>
      {" "}
      <button type="button" onClick={handleCreateUser}>
        Create User Through Service{" "}
      </button>
      <p>{message}</p>
    </section>
  );
};

// ---------------------------------------------------------------------
// 7. Error Propagation
// ---------------------------------------------------------------------

/**

* Demonstrates error propagation through both abstraction layers.
*
* The client can expose transport errors while the service allows those errors
* to propagate. The UI then decides how the failure should be represented.
  */
export const ApiClientVsServiceErrorExample: FC<ApiClientVsServiceErrorExampleProps> = ({ service }): ReactElement => {
  const [message, setMessage] = useState<string>("");

  const handleRequest = async (): Promise<void> => {
    try {
      await service.getUsers();
      setMessage("The service request completed successfully.");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const axiosError: AxiosError = error;
        setMessage(`Transport error: ${axiosError.message}`);
        return;
      }

      if (error instanceof Error) {
        setMessage(`Service error: ${error.message}`);
        return;
      }

      setMessage("An unknown service error occurred.");
    }
  };

  return (
    <section>
      {" "}
      <button type="button" onClick={handleRequest}>
        Test Error Propagation{" "}
      </button>
      {message !== "" && <p role="alert">{message}</p>}
    </section>
  );
};

// ---------------------------------------------------------------------
// 8. Main Container Component
// ---------------------------------------------------------------------

const apiClientHttp: AxiosInstance = axios.create({
  baseURL: "https://api.example.com",
  timeout: 5000,
  headers: {
    Accept: "application/json",
  },
});

const apiClient: ApiClient = new AxiosUserApiClient(apiClientHttp);
const userService: UserApiService = new DefaultUserApiService(apiClient);

export const ApiClientVsApiService: FC = (): ReactElement => {
  return (
    <main>
      <h1>API Client vs API Service</h1>

      <h2>1. API Client Handles Transport Communication</h2>
      <ApiClientResponsibilityExample client={apiClient} />

      <h2>2. API Service Handles Domain Operations</h2>
      <ApiServiceResponsibilityExample service={userService} />

      <h2>3. Service Creates an Application-Focused Boundary</h2>
      <ApiClientVsServiceBoundaryExample service={userService} />

      <h2>4. Errors Can Propagate Through Both Layers</h2>
      <ApiClientVsServiceErrorExample service={userService} />
    </main>
  );
};

export default ApiClientVsApiService;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - An API client is responsible for communicating with a remote HTTP API.
// - An API service exposes application-focused operations using the client.
// - The client handles transport details such as HTTP methods and endpoints.
// - The service can apply domain rules and compose client operations.
// - Components can depend on the service without knowing the HTTP implementation.
// - Separating the two layers reduces coupling between UI code and transport code.
// - Errors should remain observable unless an explicit abstraction contract says otherwise.
