/**
 * Refetching
 * ==========
 *
 * Refetching is the process of requesting server state again after a query has already obtained
 * data. A refetch can happen because the application explicitly requests fresh data, because a
 * query becomes eligible for another request, or because a query library triggers a refetch in
 * response to configured lifecycle events.
 *
 * Refetching is different from the initial request. During an initial request there is no existing
 * query data to display, while a refetch commonly occurs while previous data is already available.
 * This allows an interface to continue displaying cached data while the newer request is in flight.
 *
 * A query can therefore have both data and a fetching state at the same time. This distinction is
 * important because `isLoading`-style state generally describes the absence of usable initial data,
 * whereas `isFetching`-style state describes an active request, including background refetches.
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

export interface BasicRefetchProps {
  readonly user: User | null;
  readonly isFetching: boolean;
}

export interface RefetchWithExistingDataProps {
  readonly user: User;
  readonly isFetching: boolean;
}

export interface InitialLoadingVsRefetchingProps {
  readonly state: QueryState<User>;
}

export interface RefetchErrorProps {
  readonly user: User | null;
  readonly isFetching: boolean;
  readonly isError: boolean;
}

export interface ManualRefetchProps {
  readonly isFetching: boolean;
  readonly onRefetch: () => void;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

export const BasicRefetch: FC<BasicRefetchProps> = ({ user, isFetching }): React.ReactElement => {
  return (
    <div>
      <p>Name: {user?.name ?? "No data"}</p>
      <p>Query status: {isFetching ? "refetching" : user ? "idle" : "not loaded"}</p>
    </div>
  );
};

export const RefetchWithExistingData: FC<RefetchWithExistingDataProps> = ({ user, isFetching }): React.ReactElement => {
  return (
    <div>
      <p>
        {user.name} — {user.role}
      </p>
      {isFetching && <p>Refreshing server data...</p>}
      <p>Existing data remains visible while the refetch is in progress.</p>
    </div>
  );
};

export const InitialLoadingVsRefetching: FC<InitialLoadingVsRefetchingProps> = ({ state }): React.ReactElement => {
  if (state.isLoading && state.data === null) {
    return <p>Initial request is loading and no data is available yet.</p>;
  }

  return (
    <div>
      <p>Data: {state.data?.name ?? "No data"}</p>
      <p>{state.isFetching ? "A request is currently in flight." : "No request is currently in flight."}</p>
      <p>
        {state.data !== null && state.isFetching
          ? "This is a refetch because existing data is still available."
          : "This is not currently a background refetch."}
      </p>
    </div>
  );
};

export const RefetchError: FC<RefetchErrorProps> = ({ user, isFetching, isError }): React.ReactElement => {
  if (isError && user !== null) {
    return (
      <div>
        <p>Unable to refresh the latest server data.</p>
        <p>Previously available data: {user.name}</p>
        <p>The previous data can remain available even though the latest refetch failed.</p>
      </div>
    );
  }

  if (isFetching) {
    return <p>Refreshing server data...</p>;
  }

  return <p>No refetch error.</p>;
};

export const ManualRefetch: FC<ManualRefetchProps> = ({ isFetching, onRefetch }): React.ReactElement => {
  return (
    <div>
      <button type="button" onClick={onRefetch} disabled={isFetching}>
        {isFetching ? "Refetching..." : "Refetch"}
      </button>
      <p>A manual refetch explicitly starts another request for the query.</p>
    </div>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const Refetching: FC = (): React.ReactElement => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isFetching, setIsFetching] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);

  const completeInitialRequest = (): void => {
    setUser({
      id: 1,
      name: "John Doe",
      role: "Developer",
    });
    setIsLoading(false);
    setIsFetching(false);
  };

  const refetch = (): void => {
    if (user === null || isFetching) {
      return;
    }

    setIsFetching(true);
    setIsError(false);

    window.setTimeout((): void => {
      setUser((currentUser: User | null): User | null => {
        if (currentUser === null) {
          return currentUser;
        }

        return {
          ...currentUser,
          role: "Senior Developer",
        };
      });
      setIsFetching(false);
    }, 900);
  };

  const refetchWithError = (): void => {
    if (user === null || isFetching) {
      return;
    }

    setIsFetching(true);
    setIsError(false);

    window.setTimeout((): void => {
      setIsFetching(false);
      setIsError(true);
    }, 900);
  };

  const reset = (): void => {
    setUser(null);
    setIsLoading(true);
    setIsFetching(true);
    setIsError(false);
  };

  return (
    <main>
      <h1>Refetching</h1>

      <section>
        <h2>1. Basic Refetch</h2>
        <BasicRefetch user={user} isFetching={isFetching} />
        {user === null && (
          <button type="button" onClick={completeInitialRequest}>
            Complete initial request
          </button>
        )}
      </section>

      <section>
        <h2>2. Existing Data During Refetch</h2>
        {user !== null ? (
          <RefetchWithExistingData user={user} isFetching={isFetching} />
        ) : (
          <p>Load the initial query data first.</p>
        )}
      </section>

      <section>
        <h2>3. Initial Loading vs Refetching</h2>
        <InitialLoadingVsRefetching
          state={{
            data: user,
            isLoading,
            isFetching,
            isError,
          }}
        />
      </section>

      <section>
        <h2>4. Refetch Error With Existing Data</h2>
        <RefetchError user={user} isFetching={isFetching} isError={isError} />
        <button type="button" onClick={refetchWithError} disabled={user === null || isFetching}>
          Refetch with error
        </button>
      </section>

      <section>
        <h2>5. Manual Refetch</h2>
        <ManualRefetch isFetching={isFetching} onRefetch={refetch} />
      </section>

      <button type="button" onClick={reset}>
        Reset
      </button>
    </main>
  );
};

export default Refetching;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// Refetching requests server state again after a query has already obtained data.
// A refetch can occur while previous query data remains available to the interface.
// `isFetching` describes an active request, including both initial requests and refetches.
// Initial loading commonly occurs when no usable query data exists yet.
// A background refetch can therefore have both `data` and `isFetching` at the same time.
// A failed refetch does not necessarily mean that previously available data must disappear.
// Manual refetching explicitly starts another request for the existing query.
// Refetching is a server-state synchronization mechanism rather than a replacement for local state.
