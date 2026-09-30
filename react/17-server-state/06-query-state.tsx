/**
 * Query State
 * ===========
 *
 * Query state describes the current condition of a server-state query. A query can have no
 * data yet, contain successfully fetched data, or contain an error. It can also be actively
 * fetching while existing data remains available, which is different from an initial loading
 * state where no data has been received yet.
 *
 * A useful distinction is between the query's data state and its fetching state. `isLoading`
 * commonly describes an initial request that has no usable data yet, while `isFetching`
 * describes any request currently in progress, including background refetches. A query can
 * therefore have data and still be fetching at the same time.
 *
 * Query-state flags are derived from the underlying server-state lifecycle. Query-management
 * libraries expose these states so components can render loading indicators, errors, existing
 * data, and background activity without manually coordinating every transition.
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

export interface QueryState {
  readonly data: User | null;
  readonly error: string | null;
  readonly isLoading: boolean;
  readonly isFetching: boolean;
}

export interface QueryStateExampleProps {
  readonly userId: number;
}

export interface BackgroundFetchingExampleProps {
  readonly initialUser: User;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * Demonstrates the initial loading state of a query.
 *
 * The query has no data while its first request is in progress. This is the situation
 * where displaying a loading indicator instead of existing server data is appropriate.
 */
export const InitialQueryState: React.FC = (): React.ReactElement => {
  const [queryState, setQueryState] = useState<QueryState>({
    data: null,
    error: null,
    isLoading: true,
    isFetching: true,
  });

  useEffect((): (() => void) => {
    const timeoutId: number = window.setTimeout((): void => {
      setQueryState({
        data: {
          id: 1,
          name: "John Doe",
          email: "john.doe@example.com",
        },
        error: null,
        isLoading: false,
        isFetching: false,
      });
    }, 1000);

    return (): void => {
      window.clearTimeout(timeoutId);
    };
  }, []);

  if (queryState.isLoading) {
    return <p>Loading initial server data...</p>;
  }

  return <p>Loaded: {queryState.data?.name}</p>;
};

/**
 * Demonstrates a successful query containing server data.
 *
 * Once the initial request has completed successfully, the query contains data and is
 * no longer in its initial loading state.
 */
export const SuccessfulQueryState: React.FC = (): React.ReactElement => {
  const queryState: QueryState = {
    data: {
      id: 1,
      name: "John Doe",
      email: "john.doe@example.com",
    },
    error: null,
    isLoading: false,
    isFetching: false,
  };

  return (
    <div>
      <p>Status: Success</p>
      <p>Name: {queryState.data?.name}</p>
      <p>Email: {queryState.data?.email}</p>
    </div>
  );
};

/**
 * Demonstrates a query error when no successful data exists.
 *
 * An error state is distinct from loading and success. The component can expose the error
 * while the data value remains null because the initial request did not produce usable data.
 */
export const ErrorQueryState: React.FC = (): React.ReactElement => {
  const queryState: QueryState = {
    data: null,
    error: "Unable to load the user.",
    isLoading: false,
    isFetching: false,
  };

  return (
    <div>
      <p role="alert">{queryState.error}</p>
      <p>Data available: {queryState.data !== null ? "Yes" : "No"}</p>
    </div>
  );
};

/**
 * Demonstrates the distinction between `isLoading` and `isFetching`.
 *
 * During a background refetch, existing data remains available. The query is therefore
 * fetching, but it is not in its initial loading state.
 */
export const BackgroundFetchingQueryState: React.FC<BackgroundFetchingExampleProps> = ({
  initialUser,
}: BackgroundFetchingExampleProps): React.ReactElement => {
  const [queryState, setQueryState] = useState<QueryState>({
    data: initialUser,
    error: null,
    isLoading: false,
    isFetching: false,
  });

  const refetch = (): void => {
    setQueryState((currentState: QueryState): QueryState => ({
      ...currentState,
      isFetching: true,
    }));

    window.setTimeout((): void => {
      setQueryState((currentState: QueryState): QueryState => ({
        data: {
          ...currentState.data!,
          name: "Jane Doe",
        },
        error: null,
        isLoading: false,
        isFetching: false,
      }));
    }, 1000);
  };

  return (
    <div>
      <p>Name: {queryState.data?.name}</p>
      <p>Initial loading: {queryState.isLoading ? "Yes" : "No"}</p>
      <p>Fetching: {queryState.isFetching ? "Yes" : "No"}</p>

      <button type="button" onClick={refetch} disabled={queryState.isFetching}>
        Refetch
      </button>
    </div>
  );
};

/**
 * Demonstrates that query state can contain existing data while an error occurs during
 * a later fetch.
 *
 * A background refetch can fail without making the previously successful data disappear.
 * The client can therefore have both usable data and an error describing the failed refresh.
 */
export const DataWithRefetchError: React.FC<BackgroundFetchingExampleProps> = ({
  initialUser,
}: BackgroundFetchingExampleProps): React.ReactElement => {
  const queryState: QueryState = {
    data: initialUser,
    error: "Background refetch failed.",
    isLoading: false,
    isFetching: false,
  };

  return (
    <div>
      <p>Name: {queryState.data?.name}</p>
      <p role="alert">{queryState.error}</p>
      <p>Existing data remains available even though the latest refetch failed.</p>
    </div>
  );
};

/**
 * Demonstrates query state changing when the requested resource changes.
 *
 * When the user ID changes, the application needs to obtain data for a different server
 * resource. The previous query state should not be mistaken for the result of the new query.
 */
export const QueryStateByResource: React.FC<QueryStateExampleProps> = ({
  userId,
}: QueryStateExampleProps): React.ReactElement => {
  const [queryState, setQueryState] = useState<QueryState>({
    data: null,
    error: null,
    isLoading: true,
    isFetching: true,
  });

  useEffect((): (() => void) => {
    let isCancelled: boolean = false;

    const loadUser = async (): Promise<void> => {
      setQueryState({
        data: null,
        error: null,
        isLoading: true,
        isFetching: true,
      });

      await new Promise<void>((resolve): void => {
        window.setTimeout(resolve, 700);
      });

      if (!isCancelled) {
        setQueryState({
          data: {
            id: userId,
            name: userId === 1 ? "John Doe" : "Jane Doe",
            email: userId === 1 ? "john.doe@example.com" : "jane.doe@example.com",
          },
          error: null,
          isLoading: false,
          isFetching: false,
        });
      }
    };

    void loadUser();

    return (): void => {
      isCancelled = true;
    };
  }, [userId]);

  if (queryState.isLoading) {
    return <p>Loading user {userId}...</p>;
  }

  if (queryState.error !== null) {
    return <p role="alert">{queryState.error}</p>;
  }

  return (
    <div>
      <p>User ID: {queryState.data?.id}</p>
      <p>Name: {queryState.data?.name}</p>
    </div>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const QueryState: React.FC = (): React.ReactElement => {
  const initialUser: User = {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
  };

  return (
    <main>
      <h1>Query State</h1>

      <h2>1. Initial loading state</h2>
      <InitialQueryState />

      <h2>2. Successful query state</h2>
      <SuccessfulQueryState />

      <h2>3. Query error state</h2>
      <ErrorQueryState />

      <h2>4. Existing data during background fetching</h2>
      <BackgroundFetchingQueryState initialUser={initialUser} />

      <h2>5. Existing data after a failed refetch</h2>
      <DataWithRefetchError initialUser={initialUser} />

      <h2>6. Query state for a changing resource</h2>
      <QueryStateByResource userId={1} />
    </main>
  );
};

export default QueryState;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// Query state describes the current condition of a server-state query.
// Initial loading occurs when a query is fetching for the first time without usable data.
// Success means the query has usable server data and no active initial loading state.
// An error represents a failed request and can occur without previously available data.
// isFetching can be true while existing server data remains available during a refetch.
// isLoading and isFetching therefore represent different concepts and should not be treated as interchangeable.
// Existing data can remain available even when a later background refetch fails.
// Query state changes when the identity of the requested server resource changes.
