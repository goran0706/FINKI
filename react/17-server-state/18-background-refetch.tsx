/**
 * Background Refetch
 * ==================
 *
 * A background refetch is a server-state request that runs while previously fetched data remains
 * available to the interface. Instead of replacing the existing data with an initial loading state,
 * the query can continue displaying its current value while a newer server response is requested.
 *
 * Background refetching separates data availability from request activity. A query can therefore
 * have usable data and still be fetching at the same time. This distinction allows applications to
 * keep the interface stable while synchronizing cached server state with the latest server state.
 *
 * Background refetches can be triggered by mechanisms such as query lifecycle events, explicit
 * refetch calls, polling, reconnect behavior, or other query-library configuration. The important
 * characteristic is that the query already has data when the additional request begins.
 */

import type { FC } from "react";
import { useState } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface User {
  readonly id: number;
  readonly name: string;
  readonly role: string;
}

export interface QueryState<TData> {
  readonly data: TData | null;
  readonly isLoading: boolean;
  readonly isFetching: boolean;
  readonly isError: boolean;
}

export interface BackgroundRefetchProps {
  readonly user: User;
  readonly isFetching: boolean;
}

export interface BackgroundIndicatorProps {
  readonly isFetching: boolean;
}

export interface BackgroundDataProps {
  readonly user: User;
  readonly isFetching: boolean;
}

export interface BackgroundErrorProps {
  readonly user: User;
  readonly isFetching: boolean;
  readonly isError: boolean;
}

export interface BackgroundRefreshProps {
  readonly isFetching: boolean;
  readonly onRefresh: () => void;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

export const BackgroundRefetchExample: FC<BackgroundRefetchProps> = ({ user, isFetching }): React.ReactElement => {
  return (
    <div>
      <p>
        {user.name} — {user.role}
      </p>
      <p>{isFetching ? "Background refetch is in progress." : "No background refetch is currently running."}</p>
    </div>
  );
};

export const BackgroundFetchingIndicator: FC<BackgroundIndicatorProps> = ({ isFetching }): React.ReactElement => {
  return (
    <div>
      <p>Server data remains visible while the request runs.</p>
      {isFetching && <small>Refreshing in the background...</small>}
    </div>
  );
};

export const BackgroundDataRemainsAvailable: FC<BackgroundDataProps> = ({ user, isFetching }): React.ReactElement => {
  return (
    <div>
      <p>Name: {user.name}</p>
      <p>Role: {user.role}</p>
      <p>
        Data state: {isFetching ? "existing data + active background request" : "existing data + no active request"}
      </p>
    </div>
  );
};

export const BackgroundRefetchError: FC<BackgroundErrorProps> = ({ user, isFetching, isError }): React.ReactElement => {
  if (isFetching) {
    return (
      <div>
        <p>Showing existing data for {user.name}.</p>
        <p>Attempting to refresh the data...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div>
        <p>Latest refresh failed.</p>
        <p>Previously fetched data: {user.name}</p>
        <p>Existing data can remain available even when a background refetch fails.</p>
      </div>
    );
  }

  return <p>The latest background request completed successfully.</p>;
};

export const BackgroundRefreshButton: FC<BackgroundRefreshProps> = ({ isFetching, onRefresh }): React.ReactElement => {
  return (
    <div>
      <button type="button" onClick={onRefresh} disabled={isFetching}>
        {isFetching ? "Refreshing..." : "Refresh in background"}
      </button>
      <p>The refresh should not replace existing data with an initial loading state.</p>
    </div>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const BackgroundRefetch: FC = (): React.ReactElement => {
  const [user, setUser] = useState<User>({
    id: 1,
    name: "John Doe",
    role: "Developer",
  });
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);

  const refetchInBackground = (): void => {
    if (isFetching) {
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
    }, 1000);
  };

  const refetchWithError = (): void => {
    if (isFetching) {
      return;
    }

    setIsFetching(true);
    setIsError(false);

    window.setTimeout((): void => {
      setIsFetching(false);
      setIsError(true);
    }, 1000);
  };

  const reset = (): void => {
    setUser({
      id: 1,
      name: "John Doe",
      role: "Developer",
    });
    setIsFetching(false);
    setIsError(false);
  };

  return (
    <main>
      <h1>Background Refetch</h1>

      <section>
        <h2>1. Background Refetch</h2>
        <BackgroundRefetchExample user={user} isFetching={isFetching} />
      </section>

      <section>
        <h2>2. Background Fetching Indicator</h2>
        <BackgroundFetchingIndicator isFetching={isFetching} />
      </section>

      <section>
        <h2>3. Existing Data Remains Available</h2>
        <BackgroundDataRemainsAvailable user={user} isFetching={isFetching} />
      </section>

      <section>
        <h2>4. Background Refetch Error</h2>
        <BackgroundRefetchError user={user} isFetching={isFetching} isError={isError} />
        <button type="button" onClick={refetchWithError} disabled={isFetching}>
          Simulate refresh error
        </button>
      </section>

      <section>
        <h2>5. Explicit Background Refresh</h2>
        <BackgroundRefreshButton isFetching={isFetching} onRefresh={refetchInBackground} />
      </section>

      <button type="button" onClick={reset}>
        Reset
      </button>
    </main>
  );
};

export default BackgroundRefetch;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// A background refetch requests newer server data while existing data remains available.
// Background refetching separates data availability from active request state.
// `data` and `isFetching` can both be present at the same time.
// An interface can display existing data while showing a smaller refresh indicator.
// A background refetch should not automatically replace usable data with an initial loading screen.
// A failed background refetch can leave previously fetched data available to the user.
// Background refetching helps synchronize server state without unnecessarily disrupting the interface.
