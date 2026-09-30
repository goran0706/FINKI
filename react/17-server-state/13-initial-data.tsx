/**
 * Initial Data
 * ============
 *
 * Initial data is data supplied to a query before the query has successfully obtained its
 * current result from the server. It provides an initial value that can be used immediately
 * while the query-management system determines whether a network request is necessary.
 *
 * In query libraries such as TanStack Query, `initialData` is treated as actual query data and
 * is stored in the query cache. This differs from placeholder data, which is temporary display
 * data used while the real query result is being fetched and is not treated as the query's
 * persisted result in the same way.
 *
 * Initial data is useful when the application already has trustworthy data available from another
 * source, such as server-rendered data, previously loaded application state, or a parent resource.
 * Because initial data represents real data, its freshness should also be modeled correctly. If
 * the initial value is old, the query may still need to refetch it immediately or according to
 * the configured freshness policy.
 *
 * Initial data should not be confused with loading state. A query can have initial data and still
 * perform a background request to obtain a newer server value.
 */

import React, { useState } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface User {
  readonly id: number;
  readonly name: string;
  readonly email: string;
}

export interface QueryResult<TData> {
  readonly data: TData | null;
  readonly isFetching: boolean;
  readonly isStale: boolean;
}

export interface InitialDataExampleProps {
  readonly initialData: User;
}

export interface NoInitialDataExampleProps {
  readonly fallbackMessage: string;
}

export interface InitialDataWithRefetchProps {
  readonly initialData: User;
}

export interface InitialDataFreshnessProps {
  readonly initialData: User;
  readonly initialDataIsFresh: boolean;
}

export interface InitialDataFromParentProps {
  readonly user: User;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

export const InitialDataExample: React.FC<InitialDataExampleProps> = ({ initialData }): React.ReactElement => {
  const [query, setQuery] = useState<QueryResult<User>>({
    data: initialData,
    isFetching: false,
    isStale: false,
  });

  const refreshUser = (): void => {
    setQuery((currentQuery: QueryResult<User>): QueryResult<User> => ({
      ...currentQuery,
      isFetching: true,
    }));

    window.setTimeout((): void => {
      setQuery({
        data: {
          id: initialData.id,
          name: "Jane Doe",
          email: initialData.email,
        },
        isFetching: false,
        isStale: false,
      });
    }, 1000);
  };

  return (
    <div>
      <p>Name: {query.data?.name ?? "No data"}</p>
      <p>Email: {query.data?.email ?? "No data"}</p>
      <p>Fetching: {query.isFetching ? "yes" : "no"}</p>
      <button type="button" onClick={refreshUser} disabled={query.isFetching}>
        Refresh user
      </button>
    </div>
  );
};

export const NoInitialDataExample: React.FC<NoInitialDataExampleProps> = ({ fallbackMessage }): React.ReactElement => {
  const [query, setQuery] = useState<QueryResult<User>>({
    data: null,
    isFetching: true,
    isStale: false,
  });

  const fetchUser = (): void => {
    setQuery({
      data: null,
      isFetching: true,
      isStale: false,
    });

    window.setTimeout((): void => {
      setQuery({
        data: {
          id: 1,
          name: "John Doe",
          email: "john@example.com",
        },
        isFetching: false,
        isStale: false,
      });
    }, 1000);
  };

  return (
    <div>
      {query.data === null ? (
        <p>{query.isFetching ? "Loading user..." : fallbackMessage}</p>
      ) : (
        <p>Name: {query.data.name}</p>
      )}
      <button type="button" onClick={fetchUser} disabled={query.isFetching}>
        Fetch user
      </button>
    </div>
  );
};

export const InitialDataWithRefetch: React.FC<InitialDataWithRefetchProps> = ({ initialData }): React.ReactElement => {
  const [query, setQuery] = useState<QueryResult<User>>({
    data: initialData,
    isFetching: false,
    isStale: true,
  });

  const refetch = (): void => {
    setQuery((currentQuery: QueryResult<User>): QueryResult<User> => ({
      ...currentQuery,
      isFetching: true,
    }));

    window.setTimeout((): void => {
      setQuery({
        data: {
          id: initialData.id,
          name: "John Doe",
          email: "john@example.com",
        },
        isFetching: false,
        isStale: false,
      });
    }, 1000);
  };

  return (
    <div>
      <p>Name: {query.data?.name ?? "No data"}</p>
      <p>Data state: {query.isStale ? "stale" : "fresh"}</p>
      <p>Network state: {query.isFetching ? "fetching" : "idle"}</p>
      <button type="button" onClick={refetch} disabled={query.isFetching}>
        Refetch
      </button>
    </div>
  );
};

export const InitialDataFreshness: React.FC<InitialDataFreshnessProps> = ({
  initialData,
  initialDataIsFresh,
}): React.ReactElement => {
  const [query, setQuery] = useState<QueryResult<User>>({
    data: initialData,
    isFetching: !initialDataIsFresh,
    isStale: !initialDataIsFresh,
  });

  const synchronize = (): void => {
    setQuery((currentQuery: QueryResult<User>): QueryResult<User> => ({
      ...currentQuery,
      isFetching: true,
    }));

    window.setTimeout((): void => {
      setQuery({
        data: initialData,
        isFetching: false,
        isStale: false,
      });
    }, 1000);
  };

  return (
    <div>
      <p>Initial data: {query.data?.name ?? "none"}</p>
      <p>Initial data status: {query.isStale ? "stale" : "fresh"}</p>
      <p>Fetching: {query.isFetching ? "yes" : "no"}</p>
      <button type="button" onClick={synchronize} disabled={query.isFetching}>
        Synchronize
      </button>
    </div>
  );
};

export const InitialDataFromParent: React.FC<InitialDataFromParentProps> = ({ user }): React.ReactElement => {
  const [query, setQuery] = useState<QueryResult<User>>({
    data: user,
    isFetching: false,
    isStale: true,
  });

  const refresh = (): void => {
    setQuery((currentQuery: QueryResult<User>): QueryResult<User> => ({
      ...currentQuery,
      isFetching: true,
    }));

    window.setTimeout((): void => {
      setQuery({
        data: {
          ...user,
          name: "Updated User",
        },
        isFetching: false,
        isStale: false,
      });
    }, 1000);
  };

  return (
    <div>
      <p>Parent-provided name: {user.name}</p>
      <p>Query data: {query.data?.name ?? "none"}</p>
      <p>Fetching: {query.isFetching ? "yes" : "no"}</p>
      <button type="button" onClick={refresh} disabled={query.isFetching}>
        Refresh query
      </button>
    </div>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const InitialData: React.FC = (): React.ReactElement => {
  const user: User = {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
  };

  const olderUserData: User = {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
  };

  return (
    <main>
      <h1>Initial Data</h1>

      <h2>1. Initial data provides an immediate query value</h2>
      <InitialDataExample initialData={user} />

      <h2>2. Without initial data, the query can begin without data</h2>
      <NoInitialDataExample fallbackMessage="No user data is available." />

      <h2>3. Initial data can exist while a background refetch runs</h2>
      <InitialDataWithRefetch initialData={user} />

      <h2>4. Initial data has its own freshness state</h2>
      <InitialDataFreshness initialData={olderUserData} initialDataIsFresh={false} />

      <h2>5. Existing application data can provide initial query data</h2>
      <InitialDataFromParent user={user} />
    </main>
  );
};

export default InitialData;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// Initial data provides a query with data before its current server request completes.
// Initial data represents actual query data rather than merely a loading placeholder.
// Initial data can be available while the query performs a background refetch.
// Initial data can be fresh or stale depending on when and how it was obtained.
// Existing data from another trusted source can be used as initial query data.
// Initial data should not be confused with placeholder data.
// Initial data and its freshness policy should be modeled together to avoid presenting old data as current.
