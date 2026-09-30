/**
 * API Service
 * ===========
 *
 * An API service is an application-level abstraction that exposes operations
 * for a particular domain while delegating HTTP communication to an API client.
 * Instead of making UI components construct URLs, choose HTTP methods, or
 * interpret transport responses, the service provides operations such as
 * getUsers(), getUser(), or createUser().
 *
 * Internally, the service receives an API client through dependency injection.
 * The service calls the client, receives typed data, and can then apply
 * application-specific rules such as filtering, mapping, combining requests,
 * or converting transport-oriented data into domain-oriented values.
 *
 * The service boundary is different from the API client boundary. The client
 * is responsible for communicating with the remote API, while the service is
 * responsible for expressing application operations using that communication
 * layer.
 *
 * A common misconception is that an API service should contain every piece of
 * application logic. Business rules that are unrelated to remote API
 * operations may belong elsewhere. The service should primarily coordinate
 * domain operations that depend on the API.
 *
 * An important edge case is error handling. A service can translate transport
 * errors into domain-specific errors when that improves its contract, but it
 * should not silently turn failed requests into successful empty results unless
 * that behavior is explicitly part of the service contract.
 */

import React, { useState } from "react";

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

export interface UserService {
  getUsers(): Promise<readonly User[]>;

  getActiveUsers(): Promise<readonly User[]>;

  createUser(input: CreateUserInput): Promise<User>;
}

export interface ApiServiceExampleProps {
  readonly service: UserService;
}

export interface ApiServiceFilteringExampleProps {
  readonly service: UserService;
}

export interface ApiServiceMutationExampleProps {
  readonly service: UserService;
}

export interface ApiServiceErrorExampleProps {
  readonly service: UserService;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * Provides a small API-client implementation for the service.
 *
 * The client is intentionally transport-focused: it knows how to request
 * resources but does not decide which users are considered active or how
 * user operations should be presented to the application.
 */
export class ExampleApiClient implements ApiClient {
  public constructor(
    private readonly responses: Readonly<{
      readonly users: readonly User[];
    }>,
  ) {}

  public async get<TResponse>(path: string): Promise<TResponse> {
    if (path !== "/users") {
      throw new Error(`Unsupported GET path: ${path}`);
    }

    return this.responses.users as TResponse;
  }

  public async post<TResponse, TRequest>(path: string, body: TRequest): Promise<TResponse> {
    if (path !== "/users") {
      throw new Error(`Unsupported POST path: ${path}`);
    }

    const input: TRequest = body;

    if (typeof input !== "object" || input === null || !("name" in input) || !("email" in input)) {
      throw new Error("Invalid user request body.");
    }

    const userInput: {
      readonly name: string;
      readonly email: string;
    } = input as {
      readonly name: string;
      readonly email: string;
    };

    const createdUser: User = {
      id: this.responses.users.length + 1,
      name: userInput.name,
      email: userInput.email,
      active: true,
    };

    return createdUser as TResponse;
  }
}

/**
 * Implements domain-specific user operations on top of an API client.
 *
 * The service owns user-domain behavior while the client owns communication.
 */
export class DefaultUserService implements UserService {
  public constructor(private readonly client: ApiClient) {}

  public async getUsers(): Promise<readonly User[]> {
    const users: readonly User[] = await this.client.get<readonly User[]>("/users");

    return users;
  }

  public async getActiveUsers(): Promise<readonly User[]> {
    const users: readonly User[] = await this.getUsers();

    return users.filter((user: User): boolean => user.active);
  }

  public async createUser(input: CreateUserInput): Promise<User> {
    const user: User = await this.client.post<User, CreateUserInput>("/users", input);

    return user;
  }
}

/**
 * Demonstrates the primary service use case.
 *
 * The component asks the service for users and does not construct an HTTP
 * request itself.
 */
export const ApiServiceExample: React.FC<ApiServiceExampleProps> = ({
  service,
}: ApiServiceExampleProps): React.ReactElement => {
  const [users, setUsers] = useState<readonly User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const handleLoadUsers = async (): Promise<void> => {
    setLoading(true);

    try {
      const result: readonly User[] = await service.getUsers();

      setUsers(result);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <button type="button" onClick={handleLoadUsers} disabled={loading}>
        {loading ? "Loading..." : "Load Users"}
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
 * Demonstrates domain behavior implemented by the service.
 *
 * The component requests active users directly instead of retrieving all users
 * and implementing the active-user rule itself.
 */
export const ApiServiceFilteringExample: React.FC<ApiServiceFilteringExampleProps> = ({
  service,
}: ApiServiceFilteringExampleProps): React.ReactElement => {
  const [users, setUsers] = useState<readonly User[]>([]);

  const handleLoadActiveUsers = async (): Promise<void> => {
    const activeUsers: readonly User[] = await service.getActiveUsers();

    setUsers(activeUsers);
  };

  return (
    <section>
      <button type="button" onClick={handleLoadActiveUsers}>
        Load Active Users
      </button>

      <ul>
        {users.map((user: User): React.ReactElement => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </section>
  );
};

/**
 * Demonstrates a service mutation.
 *
 * The component supplies domain input while the service decides how that
 * operation is represented to the underlying API client.
 */
export const ApiServiceMutationExample: React.FC<ApiServiceMutationExampleProps> = ({
  service,
}: ApiServiceMutationExampleProps): React.ReactElement => {
  const [message, setMessage] = useState<string>("");

  const handleCreateUser = async (): Promise<void> => {
    const input: CreateUserInput = {
      name: "John Doe",
      email: "john.doe@example.com",
    };

    try {
      const user: User = await service.createUser(input);

      setMessage(`Created user ${user.name}.`);
    } catch {
      setMessage("The user could not be created.");
    }
  };

  return (
    <section>
      <button type="button" onClick={handleCreateUser}>
        Create User
      </button>

      {message !== "" && <p role="status">{message}</p>}
    </section>
  );
};

/**
 * Demonstrates service-level error propagation.
 *
 * The service does not convert an API failure into an empty collection.
 * Instead, the rejected promise reaches the caller so the UI can decide how
 * the failure should be presented.
 */
export const ApiServiceErrorExample: React.FC<ApiServiceErrorExampleProps> = ({
  service,
}: ApiServiceErrorExampleProps): React.ReactElement => {
  const [message, setMessage] = useState<string>("");

  const handleLoadUsers = async (): Promise<void> => {
    try {
      const users: readonly User[] = await service.getUsers();

      setMessage(`Received ${users.length} users.`);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setMessage(`Service error: ${error.message}`);

        return;
      }

      setMessage("An unknown service error occurred.");
    }
  };

  return (
    <section>
      <button type="button" onClick={handleLoadUsers}>
        Test Service Error Handling
      </button>

      {message !== "" && <p role="alert">{message}</p>}
    </section>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const exampleUsers: readonly User[] = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
    active: true,
  },
  {
    id: 2,
    name: "Jane Doe",
    email: "jane.doe@example.com",
    active: false,
  },
  {
    id: 3,
    name: "Alex Smith",
    email: "alex.smith@example.com",
    active: true,
  },
];

const apiClient: ApiClient = new ExampleApiClient({
  users: exampleUsers,
});

const userService: UserService = new DefaultUserService(apiClient);

export const ApiServiceDemo: React.FC = (): React.ReactElement => {
  return (
    <main>
      <h1>API Service</h1>

      <h2>1. Use a Service for Domain Operations</h2>
      <ApiServiceExample service={userService} />

      <h2>2. Encapsulate Domain Filtering in the Service</h2>
      <ApiServiceFilteringExample service={userService} />

      <h2>3. Expose Domain Mutations Through the Service</h2>
      <ApiServiceMutationExample service={userService} />

      <h2>4. Preserve Service Errors for the Calling Layer</h2>
      <ApiServiceErrorExample service={userService} />
    </main>
  );
};

export default ApiServiceDemo;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - An API service exposes application operations for a specific domain.
// - The service delegates HTTP communication to an API client.
// - Domain rules such as filtering can live in service operations.
// - Components can depend on service interfaces instead of transport details.
// - Dependency injection keeps the service independent of a specific client implementation.
// - Service errors should remain observable unless the service contract defines
//   an intentional error-to-value conversion.
// - An API service coordinates API-related domain operations rather than replacing
//   every other application layer.
