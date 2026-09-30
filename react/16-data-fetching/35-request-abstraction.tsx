/**
 * Request Abstraction
 * ===================
 *
 * A request abstraction is an application-level wrapper around HTTP transport
 * that exposes a smaller, purpose-specific interface to the rest of an
 * application. Instead of requiring components to know Axios methods, URLs,
 * headers, response envelopes, or transport-specific error behavior, the
 * abstraction can expose operations such as getUser() or createUser().
 *
 * Internally, the abstraction delegates transport work to a lower-level HTTP
 * client and converts transport-oriented results into shapes that application
 * code can consume. This creates a boundary between HTTP mechanics and domain
 * usage without requiring every component to understand the underlying client.
 *
 * A useful abstraction should hide implementation details that callers do not
 * need. It should not merely rename axios.get() while exposing every Axios
 * option unchanged, because doing so preserves the coupling the abstraction is
 * intended to remove.
 *
 * A common edge case occurs when the abstraction hides too much. Callers may
 * eventually need information such as pagination metadata or cancellation
 * support. The abstraction should expose application-relevant information
 * explicitly rather than forcing callers to reach through the abstraction.
 *
 * Another misconception is that abstraction automatically improves code.
 * An abstraction is useful when it establishes a meaningful boundary and
 * isolates change; unnecessary wrappers can instead add indirection without
 * reducing coupling.
 */

import React, { useState } from "react";
import axios, { AxiosInstance, AxiosResponse } from "axios";

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

export interface UserRequest {
  getUser(id: number): Promise<User>;

  createUser(input: CreateUserInput): Promise<User>;
}

export interface RequestAbstractionExampleProps {
  readonly requests: UserRequest;
}

export interface RequestAbstractionMutationExampleProps {
  readonly requests: UserRequest;
}

export interface RequestAbstractionBoundaryExampleProps {
  readonly requests: UserRequest;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * Implements the transport boundary behind the UserRequest interface.
 *
 * Components consuming UserRequest do not need to know that Axios is being
 * used, which URLs are called, or how AxiosResponse is unpacked.
 */
export class AxiosUserRequest implements UserRequest {
  public constructor(private readonly client: AxiosInstance) {}

  public async getUser(id: number): Promise<User> {
    const response: AxiosResponse<User> = await this.client.get<User>(`/users/${id}`);

    return response.data;
  }

  public async createUser(input: CreateUserInput): Promise<User> {
    const response: AxiosResponse<User> = await this.client.post<User>("/users", input);

    return response.data;
  }
}

/**
 * Demonstrates consuming a request abstraction for a read operation.
 *
 * The component depends on UserRequest rather than AxiosInstance. This keeps
 * the component focused on displaying application data instead of HTTP details.
 */
export const RequestAbstractionExample: React.FC<RequestAbstractionExampleProps> = ({
  requests,
}: RequestAbstractionExampleProps): React.ReactElement => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  const handleLoadUser = async (): Promise<void> => {
    setLoading(true);
    setMessage("");

    try {
      const result: User = await requests.getUser(1);

      setUser(result);
    } catch {
      setUser(null);
      setMessage("Unable to load the user.");
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

      {message !== "" && <p role="alert">{message}</p>}
    </section>
  );
};

/**
 * Demonstrates that the same abstraction can expose mutation operations.
 *
 * The component supplies domain input and receives a domain result without
 * constructing an Axios request configuration itself.
 */
export const RequestAbstractionMutationExample: React.FC<RequestAbstractionMutationExampleProps> = ({
  requests,
}: RequestAbstractionMutationExampleProps): React.ReactElement => {
  const [message, setMessage] = useState<string>("");

  const handleCreateUser = async (): Promise<void> => {
    const input: CreateUserInput = {
      name: "John Doe",
      email: "john.doe@example.com",
    };

    try {
      const user: User = await requests.createUser(input);

      setMessage(`Created ${user.name}.`);
    } catch {
      setMessage("Unable to create the user.");
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
 * Demonstrates the abstraction boundary.
 *
 * The component cannot accidentally depend on Axios-specific response fields
 * because the UserRequest interface exposes only application-level operations.
 * This is the key difference between a meaningful request abstraction and a
 * wrapper that simply forwards the entire HTTP client API.
 */
export const RequestAbstractionBoundaryExample: React.FC<RequestAbstractionBoundaryExampleProps> = ({
  requests,
}: RequestAbstractionBoundaryExampleProps): React.ReactElement => {
  const [message, setMessage] = useState<string>("The component depends only on UserRequest.");

  const handleCheckBoundary = async (): Promise<void> => {
    try {
      const user: User = await requests.getUser(1);

      setMessage(`Application data received for ${user.name}.`);
    } catch {
      setMessage("The request abstraction reported an error.");
    }
  };

  return (
    <section>
      <button type="button" onClick={handleCheckBoundary}>
        Use Request Abstraction
      </button>

      <p>{message}</p>
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

const userRequests: UserRequest = new AxiosUserRequest(apiClient);

export const RequestAbstractionDemo: React.FC = (): React.ReactElement => {
  return (
    <main>
      <h1>Request Abstraction</h1>

      <h2>1. Hide HTTP Details Behind an Application Interface</h2>
      <RequestAbstractionExample requests={userRequests} />

      <h2>2. Expose Domain Operations for Mutations</h2>
      <RequestAbstractionMutationExample requests={userRequests} />

      <h2>3. Keep Components Independent of Axios</h2>
      <RequestAbstractionBoundaryExample requests={userRequests} />
    </main>
  );
};

export default RequestAbstractionDemo;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - A request abstraction creates an application-facing boundary around HTTP.
// - Components can depend on domain operations instead of Axios APIs.
// - The abstraction can translate AxiosResponse objects into domain values.
// - A useful abstraction hides transport details that callers do not need.
// - Overly thin wrappers can preserve the coupling they are intended to remove.
// - Overly restrictive abstractions can hide application-relevant information.
// - The abstraction boundary should expose meaningful application operations.
