/**
 * Server State
 * ============
 *
 * Server state is data that originates outside the React application and is owned by a remote
 * system such as an HTTP API, database-backed service, or other backend. Unlike local UI state,
 * server state can change independently of the current component tree and may need to be fetched,
 * cached, synchronized, refetched, and reconciled with the server over time.
 *
 * React state is useful for representing the result of a server request, but storing server data
 * in useState does not make that data client-owned. The underlying data still belongs to the
 * server, which means the client must account for loading, error, freshness, synchronization,
 * and refetching concerns.
 *
 * A server-state library can centralize these concerns by managing the server-data lifecycle,
 * while React remains responsible for rendering the current state exposed by that library.
 */

import React, { useEffect, useState } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface User {
  readonly id: number;
  readonly name: string;
  readonly email: string;
}

export interface ServerStateExampleProps {
  readonly userId: number;
}

export interface LocalStateExampleProps {
  readonly initialUser: User;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * Demonstrates the basic shape of server state after it has been fetched.
 * The component keeps the fetched value in React state so it can render the result,
 * but the source of truth remains the simulated remote server represented by fetchUser.
 */
export const ServerStateExample: React.FC<ServerStateExampleProps> = ({
  userId,
}: ServerStateExampleProps): React.ReactElement => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect((): (() => void) => {
    const controller = new AbortController();

    const fetchUser = async (): Promise<void> => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}.`);
        }

        const fetchedUser: User = await response.json();

        setUser(fetchedUser);
      } catch (requestError: unknown) {
        if (requestError instanceof DOMException && requestError.name === "AbortError") {
          return;
        }

        setError(requestError instanceof Error ? requestError.message : "An unknown error occurred.");
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    void fetchUser();

    return (): void => {
      controller.abort();
    };
  }, [userId]);

  if (isLoading) {
    return <p>Loading server data...</p>;
  }

  if (error !== null) {
    return <p>Failed to load server data: {error}</p>;
  }

  if (user === null) {
    return <p>No user data available.</p>;
  }

  return (
    <div>
      <p>ID: {user.id}</p> <p>Name: {user.name}</p> <p>Email: {user.email}</p>
    </div>
  );
};

/**
 * Demonstrates an important distinction: putting server data into useState does not
 * transform it into client-owned state. The value is still a snapshot of remote data.
 */
export const LocalStateDoesNotOwnServerData: React.FC<LocalStateExampleProps> = ({
  initialUser,
}: LocalStateExampleProps): React.ReactElement => {
  const [user, setUser] = useState<User>(initialUser);

  const changeLocalSnapshot = (): void => {
    setUser(
      (currentUser: User): User => ({
        ...currentUser,
        name: currentUser.name === "John Doe" ? "Jane Doe" : "John Doe",
      }),
    );
  };

  return (
    <div>
      <p>Name stored in the local snapshot: {user.name}</p>
      <button type="button" onClick={changeLocalSnapshot}>
        Change Local Snapshot
      </button>
      <p>This changes only the local snapshot. It does not update the remote server. </p>
    </div>
  );
};

/**
 * Demonstrates why server state differs from ordinary local UI state.
 * A local UI value can be changed entirely inside the browser, while server data
 * may become outdated because another client or process changes the remote source.
 */
export const ServerStateCanBecomeStale: React.FC = (): React.ReactElement => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = async (): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("https://jsonplaceholder.typicode.com/users/1");

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}.`);
      }

      const fetchedUser: User = await response.json();

      setUser(fetchedUser);
    } catch (requestError: unknown) {
      setError(requestError instanceof Error ? requestError.message : "An unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect((): void => {
    void fetchUser();
  }, []);

  if (isLoading && user === null) {
    return <p>Loading server data...</p>;
  }

  if (error !== null) {
    return (
      <div>
        <p>Failed to load server data: {error}</p>
        <button type="button" onClick={() => void fetchUser()}>
          Retry
        </button>
      </div>
    );
  }

  if (user === null) {
    return <p>No user data available.</p>;
  }

  return (
    <div>
      <p>Currently displayed name: {user.name}</p>
      <button type="button" onClick={() => void fetchUser()} disabled={isLoading}>
        {isLoading ? "Refreshing..." : "Refetch Server Data"}
      </button>
      <p>
        In a real application, the browser would need to refetch or otherwise synchronize with the server to discover
        this change.
      </p>
    </div>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const ServerState: React.FC = (): React.ReactElement => {
  const initialUser: User = {
    id: 1,
    name: "John Doe",
    email: "[john.doe@example.com](mailto:john.doe@example.com)",
  };

  return (
    <main>
      <h1>Server State</h1>

      <h2>1. Server data fetched into the client</h2>
      <ServerStateExample userId={1} />

      <h2>2. Server data stored in React state is still server data</h2>
      <LocalStateDoesNotOwnServerData initialUser={initialUser} />

      <h2>3. Server data can become stale independently of the UI</h2>
      <ServerStateCanBecomeStale />
    </main>
  );
};

export default ServerState;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// Server state originates from a remote source and remains owned by that remote source.
// useState can hold a server-data snapshot, but it does not change the ownership model.
// Server data can become stale because the remote source may change independently of React.
// Server state commonly requires fetching, caching, synchronization, refetching, and error handling.
// These lifecycle concerns distinguish server state from ordinary client-side UI state.
