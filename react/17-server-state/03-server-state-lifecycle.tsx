/**
 * Server State Lifecycle
 * ======================
 *
 * Server state moves through a lifecycle that is different from ordinary client state.
 * A component typically begins without data, requests data from a remote source, receives
 * a successful result or an error, and then continues displaying a cached or previously
 * fetched result while the remote data may become stale.
 *
 * The important lifecycle states are not limited to loading and success. A request can fail,
 * successful data can become stale, and existing data can remain available while a background
 * refetch is in progress. Server-state libraries model these transitions explicitly so that
 * fetching, caching, synchronization, and refetching do not have to be implemented separately
 * by every component.
 */

import React, { useEffect, useState } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface ServerUser {
  readonly id: number;
  readonly name: string;
  readonly email: string;
}

export interface ServerStateLifecycleProps {
  readonly userId: number;
}

export interface LifecycleState {
  readonly status: "idle" | "loading" | "success" | "error";
  readonly user: ServerUser | null;
  readonly error: string | null;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * Demonstrates the initial loading stage of a server-state lifecycle.
 *
 * Before the request completes, there is no server data available to render. The component
 * therefore represents the request as a loading state rather than treating missing data as
 * a successful empty result.
 */
export const ServerStateLoading: React.FC = (): React.ReactElement => {
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect((): (() => void) => {
    const timeoutId: number = window.setTimeout((): void => {
      setIsLoading(false);
    }, 1000);

    return (): void => {
      window.clearTimeout(timeoutId);
    };
  }, []);

  return <div>{isLoading ? <p>Loading server data...</p> : <p>Initial request completed.</p>}</div>;
};

/**
 * Demonstrates the successful state of a server-state lifecycle.
 *
 * After the remote request completes successfully, the response becomes available to the
 * client as server data. The component can render that data while the remote source remains
 * the authoritative owner.
 */
export const ServerStateSuccess: React.FC = (): React.ReactElement => {
  const [user, setUser] = useState<ServerUser | null>(null);

  useEffect((): (() => void) => {
    const timeoutId: number = window.setTimeout((): void => {
      setUser({
        id: 1,
        name: "John Doe",
        email: "john.doe@example.com",
      });
    }, 1000);

    return (): void => {
      window.clearTimeout(timeoutId);
    };
  }, []);

  if (user === null) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <p>Name: {user.name}</p>
      <p>Email: {user.email}</p>
    </div>
  );
};

/**
 * Demonstrates the error state of a server-state lifecycle.
 *
 * A failed request is different from a successful request that simply returned no data.
 * The component therefore keeps an explicit error value so the failure can be represented
 * independently from the server response.
 */
export const ServerStateError: React.FC = (): React.ReactElement => {
  const [error, setError] = useState<string | null>(null);

  useEffect((): (() => void) => {
    const timeoutId: number = window.setTimeout((): void => {
      setError("The server request failed.");
    }, 1000);

    return (): void => {
      window.clearTimeout(timeoutId);
    };
  }, []);

  if (error !== null) {
    return <p role="alert">{error}</p>;
  }

  return <p>Request is in progress...</p>;
};

/**
 * Demonstrates the stale-data stage of a server-state lifecycle.
 *
 * Existing server data does not disappear merely because it has become stale. Staleness means
 * that the client considers the data old enough to require validation or refetching; it does
 * not mean that the cached value is automatically unusable.
 */
export const ServerStateStale: React.FC = (): React.ReactElement => {
  const [user, setUser] = useState<ServerUser>({
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
  });
  const [isStale, setIsStale] = useState<boolean>(false);

  useEffect((): (() => void) => {
    const timeoutId: number = window.setTimeout((): void => {
      setIsStale(true);
    }, 1500);

    return (): void => {
      window.clearTimeout(timeoutId);
    };
  }, []);

  return (
    <div>
      <p>Name: {user.name}</p>
      <p>Status: {isStale ? "Stale — refetch may be required." : "Fresh"}</p>
    </div>
  );
};

/**
 * Demonstrates that existing server data can remain visible during a background refetch.
 *
 * A refetch does not necessarily require replacing the existing data with a loading screen.
 * The previous result can remain rendered while a new request validates the remote state.
 */
export const ServerStateBackgroundRefetch: React.FC = (): React.ReactElement => {
  const [user, setUser] = useState<ServerUser>({
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
  });
  const [isRefetching, setIsRefetching] = useState<boolean>(false);

  const refetch = (): void => {
    setIsRefetching(true);

    window.setTimeout((): void => {
      setUser(
        (currentUser: ServerUser): ServerUser => ({
          ...currentUser,
          name: "Jane Doe",
        }),
      );
      setIsRefetching(false);
    }, 1000);
  };

  return (
    <div>
      <p>Name: {user.name}</p>
      <p>{isRefetching ? "Refreshing server data..." : "Data is idle."}</p>
      <button type="button" onClick={refetch} disabled={isRefetching}>
        Refetch
      </button>
    </div>
  );
};

/**
 * Demonstrates the complete lifecycle as a single state model.
 *
 * The discriminated status value makes the mutually exclusive request states explicit,
 * while the user and error fields represent the data associated with those states.
 */
export const ServerStateLifecycleExample: React.FC<ServerStateLifecycleProps> = ({
  userId,
}: ServerStateLifecycleProps): React.ReactElement => {
  const [state, setState] = useState<LifecycleState>({
    status: "idle",
    user: null,
    error: null,
  });

  useEffect((): (() => void) => {
    let isCancelled: boolean = false;

    const loadUser = async (): Promise<void> => {
      setState({
        status: "loading",
        user: null,
        error: null,
      });

      await new Promise<void>((resolve): void => {
        window.setTimeout(resolve, 1000);
      });

      if (!isCancelled) {
        setState({
          status: "success",
          user: {
            id: userId,
            name: "John Doe",
            email: "john.doe@example.com",
          },
          error: null,
        });
      }
    };

    void loadUser();

    return (): void => {
      isCancelled = true;
    };
  }, [userId]);

  if (state.status === "idle") {
    return <p>Idle</p>;
  }

  if (state.status === "loading") {
    return <p>Loading server data...</p>;
  }

  if (state.status === "error") {
    return <p role="alert">{state.error}</p>;
  }

  return (
    <div>
      <p>Status: {state.status}</p>
      <p>Name: {state.user?.name}</p>
      <p>Email: {state.user?.email}</p>
    </div>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const ServerStateLifecycle: React.FC = (): React.ReactElement => {
  return (
    <main>
      <h1>Server State Lifecycle</h1>

      <h2>1. Initial loading state</h2>
      <ServerStateLoading />

      <h2>2. Successful server response</h2>
      <ServerStateSuccess />

      <h2>3. Failed server response</h2>
      <ServerStateError />

      <h2>4. Existing data becoming stale</h2>
      <ServerStateStale />

      <h2>5. Existing data during background refetch</h2>
      <ServerStateBackgroundRefetch />

      <h2>6. Complete request lifecycle</h2>
      <ServerStateLifecycleExample userId={1} />
    </main>
  );
};

export default ServerStateLifecycle;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// Server state can move through loading, success, error, stale, and refetching stages.
// Loading means a request is being resolved and usable server data may not exist yet.
// Success means a remote response has produced server data that can be rendered.
// Error represents a failed request and should not be confused with an empty successful response.
// Stale data can remain available while the client determines whether it should be refreshed.
// Background refetching can update server data without replacing the existing UI with a loading state.
// Server-state libraries model these lifecycle transitions so fetching and synchronization can be managed centrally.
