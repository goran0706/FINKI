/**
 * API Service Methods
 * ===================
 *
 * API service methods are typed application-facing operations that represent
 * actions supported by a remote API. Each method normally corresponds to a
 * meaningful resource operation, such as retrieving a collection, retrieving
 * one resource, creating a resource, updating a resource, or deleting a
 * resource.
 *
 * Internally, a service method delegates HTTP transport to an API client. The
 * service chooses the endpoint, HTTP operation, request payload, and returned
 * application type. This keeps those details out of UI components while
 * preserving a clear contract for callers.
 *
 * A service method should return the smallest useful application-level result.
 * For example, a getUser() method can return User rather than exposing an
 * AxiosResponse<User>. This prevents callers from becoming coupled to the
 * transport library used by the service implementation.
 *
 * A common misconception is that every HTTP endpoint needs to become a
 * one-to-one service method. Service methods should represent useful
 * application operations, so one method can combine multiple API calls when
 * that composition is part of the application's domain behavior.
 *
 * Another edge case is mutation methods. A create, update, or delete method
 * should communicate its result explicitly. A method returning Promise<void>
 * should be used when callers genuinely do not need response data; otherwise,
 * returning the created or updated resource can provide a more useful contract.
 */

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

export interface UpdateUserInput {
  readonly name: string;
  readonly email: string;
}

export interface ApiClient {
  get<TResponse>(path: string): Promise<TResponse>;
  post<TResponse, TRequest>(path: string, body: TRequest): Promise<TResponse>;
  put<TResponse, TRequest>(path: string, body: TRequest): Promise<TResponse>;
  delete(path: string): Promise<void>;
}

export interface UserApiService {
  listUsers(): Promise<readonly User[]>;
  getUser(id: number): Promise<User>;
  createUser(input: CreateUserInput): Promise<User>;
  updateUser(id: number, input: UpdateUserInput): Promise<User>;
  deleteUser(id: number): Promise<void>;
}

export interface ApiServiceListMethodExampleProps {
  readonly service: UserApiService;
}

export interface ApiServiceGetMethodExampleProps {
  readonly service: UserApiService;
}

export interface ApiServiceCreateMethodExampleProps {
  readonly service: UserApiService;
}

export interface ApiServiceUpdateMethodExampleProps {
  readonly service: UserApiService;
}

export interface ApiServiceDeleteMethodExampleProps {
  readonly service: UserApiService;
}

// ---------------------------------------------------------------------
// 2. API Client Implementation
// ---------------------------------------------------------------------

/**
 * Implements a small in-memory API client for the examples.
 *
 * The client interface exposes generic transport operations while the service
 * below exposes application-specific user operations.
 */
export class ExampleApiClient implements ApiClient {
  private users: User[];

  public constructor(initialUsers: readonly User[]) {
    this.users = [...initialUsers];
  }

  public async get<TResponse>(path: string): Promise<TResponse> {
    if (path === "/users") {
      return [...this.users] as TResponse;
    }

    const userMatch: RegExpMatchArray | null = path.match(/^\/users\/(\d+)$/);

    if (userMatch === null) {
      throw new Error(`Unsupported GET path: ${path}`);
    }

    const id: number = Number(userMatch[1]);
    const user: User | undefined = this.users.find((item: User): boolean => item.id === id);

    if (user === undefined) {
      throw new Error(`User ${id} was not found.`);
    }

    return user as TResponse;
  }

  public async post<TResponse, TRequest>(path: string, body: TRequest): Promise<TResponse> {
    if (path !== "/users") {
      throw new Error(`Unsupported POST path: ${path}`);
    }

    const input: CreateUserInput = body as CreateUserInput;
    const nextId: number =
      this.users.reduce((maximumId: number, user: User): number => Math.max(maximumId, user.id), 0) + 1;

    const createdUser: User = {
      id: nextId,
      name: input.name,
      email: input.email,
    };

    this.users = [...this.users, createdUser];

    return createdUser as TResponse;
  }

  public async put<TResponse, TRequest>(path: string, body: TRequest): Promise<TResponse> {
    const userMatch: RegExpMatchArray | null = path.match(/^\/users\/(\d+)$/);

    if (userMatch === null) {
      throw new Error(`Unsupported PUT path: ${path}`);
    }

    const id: number = Number(userMatch[1]);
    const input: UpdateUserInput = body as UpdateUserInput;
    const existingUser: User | undefined = this.users.find((user: User): boolean => user.id === id);

    if (existingUser === undefined) {
      throw new Error(`User ${id} was not found.`);
    }

    const updatedUser: User = {
      id,
      name: input.name,
      email: input.email,
    };

    this.users = this.users.map((user: User): User => (user.id === id ? updatedUser : user));

    return updatedUser as TResponse;
  }

  public async delete(path: string): Promise<void> {
    const userMatch: RegExpMatchArray | null = path.match(/^\/users\/(\d+)$/);

    if (userMatch === null) {
      throw new Error(`Unsupported DELETE path: ${path}`);
    }

    const id: number = Number(userMatch[1]);
    const existingUser: User | undefined = this.users.find((user: User): boolean => user.id === id);

    if (existingUser === undefined) {
      throw new Error(`User ${id} was not found.`);
    }

    this.users = this.users.filter((user: User): boolean => user.id !== id);
  }
}

// ---------------------------------------------------------------------
// 3. User API Service
// ---------------------------------------------------------------------

/**
 * Implements application-facing user service methods.
 *
 * The service chooses meaningful operations and hides endpoint and HTTP-method
 * details from its callers.
 */
export class DefaultUserApiService implements UserApiService {
  public constructor(private readonly client: ApiClient) {}

  public async listUsers(): Promise<readonly User[]> {
    return this.client.get<readonly User[]>("/users");
  }

  public async getUser(id: number): Promise<User> {
    return this.client.get<User>(`/users/${id}`);
  }

  public async createUser(input: CreateUserInput): Promise<User> {
    return this.client.post<User, CreateUserInput>("/users", input);
  }

  public async updateUser(id: number, input: UpdateUserInput): Promise<User> {
    return this.client.put<User, UpdateUserInput>(`/users/${id}`, input);
  }

  public async deleteUser(id: number): Promise<void> {
    await this.client.delete(`/users/${id}`);
  }
}

// ---------------------------------------------------------------------
// 4. Collection Service Method
// ---------------------------------------------------------------------

/**
 * Demonstrates a collection service method.
 *
 * listUsers() represents a domain operation and hides the collection endpoint
 * from its callers.
 */
export const ApiServiceListMethodExample: FC<ApiServiceListMethodExampleProps> = ({ service }): ReactElement => {
  const [users, setUsers] = useState<readonly User[]>([]);

  const handleListUsers = async (): Promise<void> => {
    try {
      const result: readonly User[] = await service.listUsers();
      setUsers(result);
    } catch {
      setUsers([]);
    }
  };

  return (
    <section>
      <button type="button" onClick={handleListUsers}>
        List Users
      </button>

      <ul>
        {users.map((user: User): ReactElement => (
          <li key={user.id}>
            {user.name} — {user.email}
          </li>
        ))}
      </ul>
    </section>
  );
};

// ---------------------------------------------------------------------
// 5. Single-Resource Service Method
// ---------------------------------------------------------------------

/**
 * Demonstrates a single-resource service method.
 *
 * getUser() accepts a domain identifier and returns a typed User rather than
 * exposing the transport response object.
 */
export const ApiServiceGetMethodExample: FC<ApiServiceGetMethodExampleProps> = ({ service }): ReactElement => {
  const [user, setUser] = useState<User | null>(null);

  const handleGetUser = async (): Promise<void> => {
    try {
      const result: User = await service.getUser(1);
      setUser(result);
    } catch {
      setUser(null);
    }
  };

  return (
    <section>
      <button type="button" onClick={handleGetUser}>
        Get User
      </button>

      {user !== null && (
        <p>
          {user.name} — {user.email}
        </p>
      )}
    </section>
  );
};

// ---------------------------------------------------------------------
// 6. Create Service Method
// ---------------------------------------------------------------------

/**
 * Demonstrates a create service method.
 *
 * createUser() receives a dedicated input type and returns the created User,
 * allowing callers to immediately use the server-created resource.
 */
export const ApiServiceCreateMethodExample: FC<ApiServiceCreateMethodExampleProps> = ({ service }): ReactElement => {
  const [message, setMessage] = useState<string>("");

  const handleCreateUser = async (): Promise<void> => {
    const input: CreateUserInput = {
      name: "John Doe",
      email: "john.doe@example.com",
    };

    try {
      const user: User = await service.createUser(input);
      setMessage(`Created user ${user.id}: ${user.name}.`);
    } catch (error: unknown) {
      const errorMessage: string = error instanceof Error ? error.message : "Unable to create the user.";

      setMessage(errorMessage);
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

// ---------------------------------------------------------------------
// 7. Update Service Method
// ---------------------------------------------------------------------

/**
 * Demonstrates an update service method.
 *
 * updateUser() accepts both a resource identifier and a dedicated update
 * payload, then returns the updated resource.
 */
export const ApiServiceUpdateMethodExample: FC<ApiServiceUpdateMethodExampleProps> = ({ service }): ReactElement => {
  const [message, setMessage] = useState<string>("");

  const handleUpdateUser = async (): Promise<void> => {
    const input: UpdateUserInput = {
      name: "John Updated",
      email: "john.updated@example.com",
    };

    try {
      const user: User = await service.updateUser(1, input);
      setMessage(`Updated user: ${user.name}.`);
    } catch (error: unknown) {
      const errorMessage: string = error instanceof Error ? error.message : "Unable to update the user.";

      setMessage(errorMessage);
    }
  };

  return (
    <section>
      <button type="button" onClick={handleUpdateUser}>
        Update User
      </button>

      {message !== "" && <p role="status">{message}</p>}
    </section>
  );
};

// ---------------------------------------------------------------------
// 8. Delete Service Method
// ---------------------------------------------------------------------

/**
 * Demonstrates a delete service method that intentionally returns void.
 *
 * The service hides the transport response because callers only need to know
 * that the delete operation completed successfully or rejected with an error.
 */
export const ApiServiceDeleteMethodExample: FC<ApiServiceDeleteMethodExampleProps> = ({ service }): ReactElement => {
  const [message, setMessage] = useState<string>("");

  const handleDeleteUser = async (): Promise<void> => {
    try {
      await service.deleteUser(1);
      setMessage("User deleted successfully.");
    } catch (error: unknown) {
      const errorMessage: string = error instanceof Error ? error.message : "Unable to delete the user.";

      setMessage(errorMessage);
    }
  };

  return (
    <section>
      <button type="button" onClick={handleDeleteUser}>
        Delete User
      </button>

      {message !== "" && <p role="status">{message}</p>}
    </section>
  );
};

// ---------------------------------------------------------------------
// 9. Main Container Component
// ---------------------------------------------------------------------

const exampleUsers: readonly User[] = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
  },
  {
    id: 2,
    name: "Jane Doe",
    email: "jane.doe@example.com",
  },
];

const apiClient: ApiClient = new ExampleApiClient(exampleUsers);
const userService: UserApiService = new DefaultUserApiService(apiClient);

export const ApiServiceMethodsDemo: FC = (): ReactElement => {
  return (
    <main>
      <h1>API Service Methods</h1>

      <h2>1. List Resources With a Collection Method</h2>
      <ApiServiceListMethodExample service={userService} />

      <h2>2. Retrieve One Resource With an Identifier</h2>
      <ApiServiceGetMethodExample service={userService} />

      <h2>3. Create a Resource With Typed Input</h2>
      <ApiServiceCreateMethodExample service={userService} />

      <h2>4. Update a Resource With Typed Input</h2>
      <ApiServiceUpdateMethodExample service={userService} />

      <h2>5. Delete a Resource With an Explicit Result Contract</h2>
      <ApiServiceDeleteMethodExample service={userService} />
    </main>
  );
};

export default ApiServiceMethodsDemo;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Service methods should represent meaningful application operations.
// - Collection methods can return typed readonly resource collections.
// - Single-resource methods can accept an identifier and return one typed resource.
// - Mutation methods should use dedicated input types rather than loosely typed objects.
// - A create or update method can return the resulting resource when callers need it.
// - A delete method can return Promise<void> when no response data is useful to callers.
// - Service methods hide endpoint and HTTP details from UI components.
// - A service does not need a one-to-one method for every underlying HTTP endpoint.
