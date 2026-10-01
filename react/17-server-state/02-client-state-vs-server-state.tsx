/**
 * Client State vs. Server State
 * =============================
 *
 * Client state is data whose source of truth exists inside the client application. It commonly
 * represents UI concerns such as form values, modal visibility, selected tabs, or other values
 * that can be changed locally without communicating with a remote system.
 *
 * Server state is data whose source of truth exists outside the client application. It must be
 * retrieved from a remote system and can change independently of the current application instance.
 * This introduces concerns such as loading, errors, caching, staleness, synchronization, refetching,
 * and mutations that do not normally exist for purely local UI state.
 *
 * The distinction is based on ownership and lifecycle, not on where the value happens to be stored.
 * A server response stored in React state is still server state because the remote system remains
 * the authoritative source of that data.
 */

import React, { useEffect, useState } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface ClientStateExampleProps {
  readonly initialCount: number;
}

export interface ServerUser {
  readonly id: number;
  readonly name: string;
  readonly email: string;
}

export interface ServerStateExampleProps {
  readonly userId: number;
}

export interface ServerDataSnapshotProps {
  readonly initialUser: ServerUser;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * Demonstrates client state.
 * The counter has no remote source of truth. Its value is created and changed entirely
 * within the browser, so React state directly represents the authoritative client value.
 */
export const ClientStateExample: React.FC<ClientStateExampleProps> = ({
  initialCount,
}: ClientStateExampleProps): React.ReactElement => {
  const [count, setCount] = useState<number>(initialCount);

  const increment = (): void => {
    setCount((currentCount: number): number => currentCount + 1);
  };

  const reset = (): void => {
    setCount(initialCount);
  };

  return (
    <div>
      <p>Client count: {count}</p>
      <button type="button" onClick={increment}>
        Increment
      </button>
      <button type="button" onClick={reset}>
        Reset
      </button>
    </div>
  );
};

/**
 * Demonstrates server state.
 * The delayed operation represents an API request. The resulting object is only a client-side
 * representation of data whose authoritative source exists on the server.
 */
export const ServerStateExample: React.FC<ServerStateExampleProps> = ({
  userId,
}: ServerStateExampleProps): React.ReactElement => {
  const [user, setUser] = useState<ServerUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect((): (() => void) => {
    const controller = new AbortController();

    const fetchUser = async (): Promise<void> => {
      setIsLoading(true);
      setUser(null);
      setError(null);

      try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}.`);
        }

        const remoteUser: ServerUser = await response.json();

        if (!controller.signal.aborted) {
          setUser(remoteUser);
          setIsLoading(false);
        }
      } catch (requestError: unknown) {
        if (requestError instanceof DOMException && requestError.name === "AbortError") {
          return;
        }

        if (!controller.signal.aborted) {
          setError(requestError instanceof Error ? requestError.message : "An unknown error occurred.");
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
    return <p>Loading server state...</p>;
  }

  if (error !== null) {
    return <p>Failed to load server state: {error}</p>;
  }

  if (user === null) {
    return <p>No server data available.</p>;
  }

  return (
    <div>
      <p>Server user: {user.name}</p> <p>Email: {user.email}</p>
    </div>
  );
};

/**
 * Demonstrates that storage location does not determine state ownership.
 * A server response can be placed inside useState, but the component does not become
 * the owner of that data. The remote system remains the authoritative source.
 */
export const ServerDataStoredInClientState: React.FC<ServerDataSnapshotProps> = ({
  initialUser,
}: ServerDataSnapshotProps): React.ReactElement => {
  const [user, setUser] = useState<ServerUser>(initialUser);

  const changeLocalSnapshot = (): void => {
    setUser(
      (currentUser: ServerUser): ServerUser => ({
        ...currentUser,
        name: "Jane Doe",
      }),
    );
  };

  return (
    <div>
      <p>Displayed name: {user.name}</p>
      <button type="button" onClick={changeLocalSnapshot}>
        Change Local Snapshot
      </button>
      <p>
        Changing this React state changes the displayed snapshot, but it does not change the authoritative value stored
        on the server.
      </p>
    </div>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const ClientStateVsServerState: React.FC = (): React.ReactElement => {
  const initialUser: ServerUser = {
    id: 1,
    name: "John Doe",
    email: "[john.doe@example.com](mailto:john.doe@example.com)",
  };

  return (
    <main>
      <h1>Client State vs. Server State</h1>

      <h2>1. Client state is owned by the application</h2>
      <ClientStateExample initialCount={0} />

      <h2>2. Server state originates from a remote source</h2>
      <ServerStateExample userId={1} />

      <h2>3. Server data stored in React remains server state</h2>
      <ServerDataStoredInClientState initialUser={initialUser} />
    </main>
  );
};

export default ClientStateVsServerState;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// Client state is locally owned data whose source of truth exists inside the application.
// Server state is remotely owned data whose source of truth exists outside the application.
// Client state can usually be changed without communicating with a server.
// Server state can change independently of the current React application instance.
// Storing server data in useState creates a client-side snapshot; it does not make React the source of truth.
// Server state therefore introduces concerns such as synchronization, freshness, caching, and refetching.
