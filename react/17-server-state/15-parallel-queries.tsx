/**
 * Parallel Queries
 * ================
 *
 * Parallel queries are multiple independent server-state queries that can execute at the same
 * time because none of them depends on the result of another. Running independent queries in
 * parallel reduces unnecessary sequencing and can allow the application to obtain several
 * resources during the same loading period.
 *
 * In a query-management library, multiple query observers can exist simultaneously, each with
 * its own query key, cache entry, loading state, error state, and result. The query-management
 * system can coordinate these requests independently while allowing the component to render
 * their combined results.
 *
 * Parallel queries are different from dependent queries. If query B needs information returned
 * by query A before it can construct its request, the queries are not independent and should not
 * be modeled as unconditional parallel requests.
 *
 * Parallel requests can also produce partial completion: one query may finish before another,
 * and one query may fail while the remaining queries succeed. A robust UI should therefore avoid
 * treating the entire group as a single indivisible loading or error state.
 */

import React, { useState } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface User {
  readonly id: number;
  readonly name: string;
}

export interface Product {
  readonly id: number;
  readonly name: string;
}

export interface Notification {
  readonly id: number;
  readonly message: string;
}

export interface QueryResult<TData> {
  readonly data: TData | null;
  readonly isFetching: boolean;
  readonly error: string | null;
}

export interface ParallelQueryExampleProps {
  readonly initialUser: User | null;
  readonly initialProducts: readonly Product[];
  readonly initialNotifications: readonly Notification[];
}

export interface IndependentQueryProps {
  readonly queryName: string;
  readonly initialData: string;
}

export interface PartialCompletionProps {
  readonly initialResults: readonly QueryResult<string>[];
}

export interface ParallelErrorProps {
  readonly initialResults: readonly QueryResult<string>[];
}

export interface SameQueryKeyProps {
  readonly initialData: User;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

export const ParallelQueryExample: React.FC<ParallelQueryExampleProps> = ({
  initialUser,
  initialProducts,
  initialNotifications,
}): React.ReactElement => {
  const [userQuery, setUserQuery] = useState<QueryResult<User>>({
    data: initialUser,
    isFetching: false,
    error: null,
  });
  const [productQuery, setProductQuery] = useState<QueryResult<readonly Product[]>>({
    data: initialProducts,
    isFetching: false,
    error: null,
  });
  const [notificationQuery, setNotificationQuery] = useState<QueryResult<readonly Notification[]>>({
    data: initialNotifications,
    isFetching: false,
    error: null,
  });

  const fetchAll = (): void => {
    setUserQuery({
      data: null,
      isFetching: true,
      error: null,
    });
    setProductQuery({
      data: null,
      isFetching: true,
      error: null,
    });
    setNotificationQuery({
      data: null,
      isFetching: true,
      error: null,
    });

    window.setTimeout((): void => {
      setUserQuery({
        data: {
          id: 1,
          name: "John Doe",
        },
        isFetching: false,
        error: null,
      });
    }, 700);

    window.setTimeout((): void => {
      setProductQuery({
        data: [
          {
            id: 1,
            name: "Example Laptop",
          },
        ],
        isFetching: false,
        error: null,
      });
    }, 1000);

    window.setTimeout((): void => {
      setNotificationQuery({
        data: [
          {
            id: 1,
            message: "Your order has shipped.",
          },
        ],
        isFetching: false,
        error: null,
      });
    }, 500);
  };

  return (
    <div>
      <p>User: {userQuery.isFetching ? "Loading..." : (userQuery.data?.name ?? "No user")}</p>
      <p>Products: {productQuery.isFetching ? "Loading..." : (productQuery.data?.length ?? 0)}</p>
      <p>Notifications: {notificationQuery.isFetching ? "Loading..." : (notificationQuery.data?.length ?? 0)}</p>
      <button
        type="button"
        onClick={fetchAll}
        disabled={userQuery.isFetching || productQuery.isFetching || notificationQuery.isFetching}
      >
        Fetch independent queries
      </button>
    </div>
  );
};

export const IndependentQuery: React.FC<IndependentQueryProps> = ({ queryName, initialData }): React.ReactElement => {
  const [query, setQuery] = useState<QueryResult<string>>({
    data: initialData,
    isFetching: false,
    error: null,
  });

  const fetchQuery = (): void => {
    setQuery({
      data: null,
      isFetching: true,
      error: null,
    });

    window.setTimeout((): void => {
      setQuery({
        data: `Result from ${queryName}`,
        isFetching: false,
        error: null,
      });
    }, 1000);
  };

  return (
    <div>
      <p>Query: {queryName}</p>
      <p>Result: {query.data ?? "No result"}</p>
      <button type="button" onClick={fetchQuery} disabled={query.isFetching}>
        Run query
      </button>
    </div>
  );
};

export const PartialCompletion: React.FC<PartialCompletionProps> = ({ initialResults }): React.ReactElement => {
  const [results, setResults] = useState<readonly QueryResult<string>[]>(initialResults);

  const runQueries = (): void => {
    setResults((currentResults: readonly QueryResult<string>[]): readonly QueryResult<string>[] =>
      currentResults.map((result: QueryResult<string>): QueryResult<string> => ({
        ...result,
        data: null,
        isFetching: true,
        error: null,
      })),
    );

    window.setTimeout((): void => {
      setResults((currentResults: readonly QueryResult<string>[]): readonly QueryResult<string>[] =>
        currentResults.map((result: QueryResult<string>, index: number): QueryResult<string> =>
          index === 0
            ? {
                data: "First query completed",
                isFetching: false,
                error: null,
              }
            : result,
        ),
      );
    }, 500);

    window.setTimeout((): void => {
      setResults((currentResults: readonly QueryResult<string>[]): readonly QueryResult<string>[] =>
        currentResults.map((result: QueryResult<string>, index: number): QueryResult<string> =>
          index === 1
            ? {
                data: "Second query completed",
                isFetching: false,
                error: null,
              }
            : result,
        ),
      );
    }, 1200);
  };

  return (
    <div>
      {results.map((result: QueryResult<string>, index: number): React.ReactElement => (
        <p key={index}>
          Query {index + 1}: {result.isFetching ? "fetching..." : (result.data ?? "not started")}
        </p>
      ))}
      <button type="button" onClick={runQueries}>
        Run queries in parallel
      </button>
    </div>
  );
};

export const ParallelError: React.FC<ParallelErrorProps> = ({ initialResults }): React.ReactElement => {
  const [results, setResults] = useState<readonly QueryResult<string>[]>(initialResults);

  const runQueries = (): void => {
    setResults((currentResults: readonly QueryResult<string>[]): readonly QueryResult<string>[] =>
      currentResults.map((result: QueryResult<string>): QueryResult<string> => ({
        ...result,
        data: null,
        isFetching: true,
        error: null,
      })),
    );

    window.setTimeout((): void => {
      setResults((currentResults: readonly QueryResult<string>[]): readonly QueryResult<string>[] =>
        currentResults.map((result: QueryResult<string>, index: number): QueryResult<string> =>
          index === 0
            ? {
                data: "Successful result",
                isFetching: false,
                error: null,
              }
            : result,
        ),
      );
    }, 700);

    window.setTimeout((): void => {
      setResults((currentResults: readonly QueryResult<string>[]): readonly QueryResult<string>[] =>
        currentResults.map((result: QueryResult<string>, index: number): QueryResult<string> =>
          index === 1
            ? {
                data: null,
                isFetching: false,
                error: "The second query failed.",
              }
            : result,
        ),
      );
    }, 1000);
  };

  return (
    <div>
      {results.map((result: QueryResult<string>, index: number): React.ReactElement => (
        <p key={index}>
          Query {index + 1}: {result.isFetching ? "fetching..." : (result.error ?? result.data ?? "not started")}
        </p>
      ))}
      <button type="button" onClick={runQueries}>
        Run queries
      </button>
    </div>
  );
};

export const SameQueryKey: React.FC<SameQueryKeyProps> = ({ initialData }): React.ReactElement => {
  const [query, setQuery] = useState<QueryResult<User>>({
    data: initialData,
    isFetching: false,
    error: null,
  });
  const [consumerCount, setConsumerCount] = useState<number>(0);

  const observeSameQuery = (): void => {
    setConsumerCount((currentCount: number): number => currentCount + 1);
    setQuery((currentQuery: QueryResult<User>): QueryResult<User> => ({
      ...currentQuery,
      isFetching: true,
    }));

    window.setTimeout((): void => {
      setQuery({
        data: initialData,
        isFetching: false,
        error: null,
      });
    }, 1000);
  };

  return (
    <div>
      <p>Query key: user:{initialData.id}</p>
      <p>Consumers: {consumerCount}</p>
      <p>Data: {query.data?.name ?? "No data"}</p>
      <p>
        Multiple observers of the same query identity can share one query state rather than representing unrelated
        resources.
      </p>
      <button type="button" onClick={observeSameQuery}>
        Add observer
      </button>
    </div>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const ParallelQueries: React.FC = (): React.ReactElement => {
  const initialUser: User = {
    id: 1,
    name: "John Doe",
  };

  const initialProducts: readonly Product[] = [
    {
      id: 1,
      name: "Example Laptop",
    },
  ];

  const initialNotifications: readonly Notification[] = [
    {
      id: 1,
      message: "Your order has shipped.",
    },
  ];

  const initialResults: readonly QueryResult<string>[] = [
    {
      data: null,
      isFetching: false,
      error: null,
    },
    {
      data: null,
      isFetching: false,
      error: null,
    },
  ];

  return (
    <main>
      <h1>Parallel Queries</h1>

      <h2>1. Independent resources can be fetched in parallel</h2>
      <ParallelQueryExample
        initialUser={initialUser}
        initialProducts={initialProducts}
        initialNotifications={initialNotifications}
      />

      <h2>2. Each independent query has its own state</h2>
      <IndependentQuery queryName="user" initialData="No user result" />
      <IndependentQuery queryName="products" initialData="No product result" />

      <h2>3. Parallel queries can complete at different times</h2>
      <PartialCompletion initialResults={initialResults} />

      <h2>4. One failed query does not inherently invalidate successful queries</h2>
      <ParallelError initialResults={initialResults} />

      <h2>5. The same query identity can be observed by multiple consumers</h2>
      <SameQueryKey initialData={initialUser} />
    </main>
  );
};

export default ParallelQueries;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// Parallel queries are independent queries that can execute without waiting for one another.
// Each query has its own query key, data, loading state, and error state.
// Independent requests can complete at different times.
// One query can fail while other parallel queries succeed.
// Parallel queries should not be confused with dependent queries.
// Multiple consumers of the same query identity can share the same query state.
// Parallel execution reduces unnecessary sequencing when resources do not depend on one another.
