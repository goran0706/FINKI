/**
 * Success State
 * =============
 *
 * A success state represents an asynchronous operation that completed
 * successfully and produced a usable result. In a request-state model, success
 * is distinct from loading, error, and idle because it guarantees that the
 * associated result is available.
 *
 * Internally, a discriminated union can associate the literal "success" status
 * with a required data property. TypeScript then narrows the state based on the
 * status field and guarantees that success-specific data is available in that
 * branch.
 *
 * A successful HTTP response does not necessarily mean that an application
 * operation produced useful data. The request may complete with an empty
 * collection, nullable resource, or other valid result. Those are still
 * successful outcomes when they satisfy the API contract.
 *
 * A common edge case is refreshing data after a previous success. The
 * application can either clear the previous result while loading or keep the
 * previous result visible until the new request succeeds. Keeping the old
 * result can reduce unnecessary visual changes, but the UI should clearly
 * distinguish existing data from newly completed data.
 *
 * Another misconception is that success should always be represented by a
 * boolean such as isSuccess. A boolean alone does not guarantee that the
 * corresponding data exists. A discriminated success state can make that
 * relationship explicit in the type system.
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

export interface SuccessState {
  readonly status: "success";
  readonly data: User;
}

export interface LoadingState {
  readonly status: "loading";
}

export interface ErrorState {
  readonly status: "error";
  readonly message: string;
}

export type UserRequestState = LoadingState | SuccessState | ErrorState;

export interface SuccessStateExampleProps {
  readonly client: AxiosInstance;
}

export interface SuccessStateCollectionExampleProps {
  readonly client: AxiosInstance;
}

export interface SuccessStateRefreshExampleProps {
  readonly client: AxiosInstance;
}

export interface SuccessStateEmptyExampleProps {
  readonly client: AxiosInstance;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * Demonstrates a success state with required typed data.
 *
 * The success branch is created only after the request resolves with a User,
 * making the data property guaranteed whenever status is "success".
 */
export const SuccessStateExample: React.FC<SuccessStateExampleProps> = ({
  client,
}: SuccessStateExampleProps): React.ReactElement => {
  const [state, setState] = useState<UserRequestState>({
    status: "loading",
  });

  const handleRequest = async (): Promise<void> => {
    setState({
      status: "loading",
    });

    try {
      const response: AxiosResponse<User> = await client.get<User>("/users/1");

      setState({
        status: "success",
        data: response.data,
      });
    } catch (error: unknown) {
      const message: string = axios.isAxiosError(error) ? error.message : "The request failed.";

      setState({
        status: "error",
        message,
      });
    }
  };

  return (
    <section>
      <button type="button" onClick={handleRequest} disabled={state.status === "loading"}>
        {state.status === "loading" ? "Loading..." : "Load User"}
      </button>

      {state.status === "success" && (
        <p>
          Success: {state.data.name} — {state.data.email}
        </p>
      )}

      {state.status === "error" && <p role="alert">{state.message}</p>}
    </section>
  );
};

/**
 * Demonstrates that an empty collection can still be a successful result.
 *
 * An empty array is valid collection data and should not automatically be
 * treated as an error merely because it contains no records.
 */
export const SuccessStateCollectionExample: React.FC<SuccessStateCollectionExampleProps> = ({
  client,
}: SuccessStateCollectionExampleProps): React.ReactElement => {
  const [users, setUsers] = useState<readonly User[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleRequest = async (): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const response: AxiosResponse<readonly User[]> = await client.get<readonly User[]>("/users");

      setUsers(response.data);
    } catch (requestError: unknown) {
      setUsers(null);

      if (axios.isAxiosError(requestError)) {
        setError(requestError.message);
      } else if (requestError instanceof Error) {
        setError(requestError.message);
      } else {
        setError("The request failed.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <button type="button" onClick={handleRequest} disabled={loading}>
        {loading ? "Loading..." : "Load Users"}
      </button>

      {users !== null && (
        <div>
          <p>
            Request succeeded with {users.length} user
            {users.length === 1 ? "" : "s"}.
          </p>

          {users.length === 0 ? (
            <p>No users were returned.</p>
          ) : (
            <ul>
              {users.map((user: User): React.ReactElement => (
                <li key={user.id}>{user.name}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      {error !== null && <p role="alert">{error}</p>}
    </section>
  );
};

/**
 * Demonstrates retaining successful data while a refresh is pending.
 *
 * The previous successful result remains available while loading. A separate
 * loading value communicates that the displayed data may be replaced when the
 * refresh completes.
 */
export const SuccessStateRefreshExample: React.FC<SuccessStateRefreshExampleProps> = ({
  client,
}: SuccessStateRefreshExampleProps): React.ReactElement => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  const handleRequest = async (): Promise<void> => {
    setLoading(true);
    setMessage("");

    try {
      const response: AxiosResponse<User> = await client.get<User>("/users/1");

      setUser(response.data);
      setMessage("The latest request succeeded.");
    } catch (requestError: unknown) {
      if (axios.isAxiosError(requestError)) {
        setMessage(`Refresh failed: ${requestError.message}`);
      } else if (requestError instanceof Error) {
        setMessage(`Refresh failed: ${requestError.message}`);
      } else {
        setMessage("Refresh failed.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <button type="button" onClick={handleRequest} disabled={loading}>
        {loading ? "Refreshing..." : "Refresh User"}
      </button>

      {user !== null && <p>Current successful data: {user.name}</p>}

      {loading && <p aria-live="polite">Refreshing the successful result...</p>}

      {message !== "" && <p role="status">{message}</p>}
    </section>
  );
};

/**
 * Demonstrates a successful request whose result is nullable.
 *
 * A nullable resource can be a valid server response. The application should
 * distinguish "request succeeded with no resource" from "request failed".
 */
export const SuccessStateEmptyExample: React.FC<SuccessStateEmptyExampleProps> = ({
  client,
}: SuccessStateEmptyExampleProps): React.ReactElement => {
  const [result, setResult] = useState<User | null | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleRequest = async (): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const response: AxiosResponse<User | null> = await client.get<User | null>("/users/1");

      setResult(response.data);
    } catch (requestError: unknown) {
      setResult(undefined);

      if (axios.isAxiosError(requestError)) {
        setError(requestError.message);
      } else if (requestError instanceof Error) {
        setError(requestError.message);
      } else {
        setError("The request failed.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <button type="button" onClick={handleRequest} disabled={loading}>
        {loading ? "Loading..." : "Request Optional User"}
      </button>

      {result !== undefined &&
        (result === null ? (
          <p>Request succeeded, but no user was returned.</p>
        ) : (
          <p>Request succeeded: {result.name}.</p>
        ))}

      {error !== null && <p role="alert">{error}</p>}
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

export const SuccessStateDemo: React.FC = (): React.ReactElement => {
  return (
    <main>
      <h1>Success State</h1>

      <h2>1. Represent Successful Data With a Discriminated State</h2>
      <SuccessStateExample client={apiClient} />

      <h2>2. Treat an Empty Collection as a Valid Success</h2>
      <SuccessStateCollectionExample client={apiClient} />

      <h2>3. Preserve Successful Data During a Refresh</h2>
      <SuccessStateRefreshExample client={apiClient} />

      <h2>4. Distinguish Successful Empty Results From Errors</h2>
      <SuccessStateEmptyExample client={apiClient} />
    </main>
  );
};

export default SuccessStateDemo;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - A success state represents a completed operation with a valid result.
// - A discriminated union can guarantee that successful state includes its required data.
// - An empty collection can be a valid successful response rather than an error.
// - Existing successful data can remain visible while a refresh is loading.
// - Nullable successful results should remain distinct from failed requests.
// - A success boolean alone does not guarantee that corresponding data exists.
// - Success state describes the outcome of the request, while rendering determines how that result is presented.
