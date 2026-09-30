/**
 * Network Reconnect Refetch
 * =========================
 *
 * Network reconnect refetching is a server-state synchronization mechanism that can request fresh
 * query data after an application regains network connectivity. It is useful because a query may
 * have become stale, failed, or missed server updates while the application was offline.
 *
 * A reconnect event does not necessarily mean that every query must be fetched immediately. Query
 * libraries typically determine which queries are eligible for refetching according to their
 * freshness, activity, and reconnect configuration. The important distinction is that connectivity
 * restoration provides an opportunity to synchronize server state again.
 *
 * Existing data can remain available while the reconnect refetch is running. If the request fails
 * after connectivity has returned, the query can retain its previous data and expose the new error
 * separately from the data itself.
 */

import type { FC } from "react";
import { useEffect, useState } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface User {
  readonly id: number;
  readonly name: string;
  readonly role: string;
}

export interface NetworkQueryState<TData> {
  readonly data: TData | null;
  readonly isFetching: boolean;
  readonly isError: boolean;
  readonly lastUpdated: number | null;
}

export interface NetworkStatusProps {
  readonly isOnline: boolean;
}

export interface ReconnectRefetchProps {
  readonly user: User;
  readonly isOnline: boolean;
  readonly isFetching: boolean;
}

export interface ExistingDataDuringReconnectProps {
  readonly user: User;
  readonly isFetching: boolean;
  readonly isOnline: boolean;
}

export interface ReconnectControlProps {
  readonly enabled: boolean;
  readonly isFetching: boolean;
  readonly onRefetch: () => void;
}

export interface ReconnectErrorProps {
  readonly user: User;
  readonly isOnline: boolean;
  readonly isFetching: boolean;
  readonly isError: boolean;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

export const NetworkStatus: FC<NetworkStatusProps> = ({ isOnline }): React.ReactElement => {
  return (
    <div>
      <p>Network status: {isOnline ? "online" : "offline"}</p>
      <p>
        {isOnline
          ? "Network requests can be attempted."
          : "Network-dependent synchronization should wait for connectivity."}
      </p>
    </div>
  );
};

export const ReconnectRefetch: FC<ReconnectRefetchProps> = ({ user, isOnline, isFetching }): React.ReactElement => {
  return (
    <div>
      <p>
        {user.name} — {user.role}
      </p>
      <p>
        {isFetching
          ? "Refetching after network connectivity was restored."
          : isOnline
            ? "Connected and waiting for a refetch."
            : "Offline; reconnect refetch is unavailable."}
      </p>
    </div>
  );
};

export const ExistingDataDuringReconnect: FC<ExistingDataDuringReconnectProps> = ({
  user,
  isFetching,
  isOnline,
}): React.ReactElement => {
  return (
    <div>
      <p>Existing data: {user.name}</p>
      <p>Role: {user.role}</p>
      <p>
        {isFetching
          ? "Existing data remains visible while reconnect refetch is running."
          : isOnline
            ? "Existing data is currently displayed."
            : "Existing data remains available while offline."}
      </p>
    </div>
  );
};

export const ReconnectRefetchControl: FC<ReconnectControlProps> = ({
  enabled,
  isFetching,
  onRefetch,
}): React.ReactElement => {
  return (
    <div>
      <p>Reconnect refetch: {enabled ? "enabled" : "disabled"}</p>
      <button type="button" onClick={onRefetch} disabled={!enabled || isFetching}>
        {isFetching ? "Refetching..." : "Simulate reconnect refetch"}
      </button>
      <p>
        Disabling reconnect refetch prevents connectivity restoration from automatically triggering this
        synchronization.
      </p>
    </div>
  );
};

export const ReconnectRefetchError: FC<ReconnectErrorProps> = ({
  user,
  isOnline,
  isFetching,
  isError,
}): React.ReactElement => {
  if (!isOnline) {
    return <p>Offline. The reconnect refetch cannot currently run.</p>;
  }

  if (isFetching) {
    return (
      <div>
        <p>Existing data: {user.name}</p>
        <p>Reconnect refetch is in progress...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div>
        <p>Reconnect refetch failed.</p>
        <p>Previously available data: {user.name}</p>
        <p>Connectivity has returned, but the server request can still fail independently.</p>
      </div>
    );
  }

  return <p>No reconnect refetch error.</p>;
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const NetworkReconnectRefetch: FC = (): React.ReactElement => {
  const [user, setUser] = useState<User>({
    id: 1,
    name: "John Doe",
    role: "Developer",
  });
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [reconnectRefetchEnabled, setReconnectRefetchEnabled] = useState<boolean>(true);

  const refetch = (): void => {
    if (!isOnline || isFetching) {
      return;
    }

    setIsFetching(true);
    setIsError(false);

    window.setTimeout((): void => {
      setUser((currentUser: User): User => ({
        ...currentUser,
        role: "Senior Developer",
      }));
      setIsFetching(false);
    }, 900);
  };

  const refetchWithError = (): void => {
    if (!isOnline || isFetching) {
      return;
    }

    setIsFetching(true);
    setIsError(false);

    window.setTimeout((): void => {
      setIsFetching(false);
      setIsError(true);
    }, 900);
  };

  useEffect((): (() => void) => {
    const handleOnline = (): void => {
      setIsOnline(true);

      if (reconnectRefetchEnabled) {
        setIsFetching(true);
        setIsError(false);

        window.setTimeout((): void => {
          setUser((currentUser: User): User => ({
            ...currentUser,
            role: "Senior Developer",
          }));
          setIsFetching(false);
        }, 900);
      }
    };

    const handleOffline = (): void => {
      setIsOnline(false);
      setIsFetching(false);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return (): void => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [reconnectRefetchEnabled]);

  const toggleReconnectRefetch = (): void => {
    setReconnectRefetchEnabled((enabled: boolean): boolean => !enabled);
  };

  const simulateOffline = (): void => {
    setIsOnline(false);
    setIsFetching(false);
  };

  const simulateOnline = (): void => {
    setIsOnline(true);

    if (reconnectRefetchEnabled) {
      setIsFetching(true);
      setIsError(false);

      window.setTimeout((): void => {
        setUser((currentUser: User): User => ({
          ...currentUser,
          role: "Senior Developer",
        }));
        setIsFetching(false);
      }, 900);
    }
  };

  const reset = (): void => {
    setUser({
      id: 1,
      name: "John Doe",
      role: "Developer",
    });
    setIsOnline(true);
    setIsFetching(false);
    setIsError(false);
    setReconnectRefetchEnabled(true);
  };

  return (
    <main>
      <h1>Network Reconnect Refetch</h1>

      <section>
        <h2>1. Network Status</h2>
        <NetworkStatus isOnline={isOnline} />
        <button type="button" onClick={simulateOffline} disabled={!isOnline}>
          Simulate offline
        </button>
        <button type="button" onClick={simulateOnline} disabled={isOnline || isFetching}>
          Simulate reconnect
        </button>
      </section>

      <section>
        <h2>2. Refetch After Reconnect</h2>
        <ReconnectRefetch user={user} isOnline={isOnline} isFetching={isFetching} />
      </section>

      <section>
        <h2>3. Existing Data During Reconnect</h2>
        <ExistingDataDuringReconnect user={user} isFetching={isFetching} isOnline={isOnline} />
      </section>

      <section>
        <h2>4. Enabling and Disabling Reconnect Refetch</h2>
        <ReconnectRefetchControl enabled={reconnectRefetchEnabled} isFetching={isFetching} onRefetch={refetch} />
        <button type="button" onClick={toggleReconnectRefetch}>
          {reconnectRefetchEnabled ? "Disable reconnect refetch" : "Enable reconnect refetch"}
        </button>
      </section>

      <section>
        <h2>5. Reconnect Refetch Error</h2>
        <ReconnectRefetchError user={user} isOnline={isOnline} isFetching={isFetching} isError={isError} />
        <button type="button" onClick={refetchWithError} disabled={!isOnline || isFetching}>
          Simulate reconnect refetch error
        </button>
      </section>

      <button type="button" onClick={reset}>
        Reset
      </button>
    </main>
  );
};

export default NetworkReconnectRefetch;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// Network reconnect refetching synchronizes eligible server state after connectivity is restored.
// The browser exposes online and offline events that can be used to detect connectivity changes.
// Query libraries can use their own network manager to coordinate reconnect behavior across queries.
// Existing server data can remain available while a reconnect-triggered request is running.
// Regaining connectivity does not guarantee that the subsequent server request will succeed.
// A reconnect refetch can therefore produce a new error while previously cached data remains available.
// Reconnect refetch behavior can be enabled or disabled according to application requirements.
// Reconnect synchronization is distinct from the browser's network status itself: being online means
// a request can be attempted, not that the server request has necessarily succeeded.
