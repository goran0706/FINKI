/**
 * Query
 * =====
 *
 * A query represents a request for server data together with the information needed to
 * identify, retrieve, and represent that data. In server-state management, a query is
 * more than the HTTP request itself: it describes a piece of remote data that can have
 * a lifecycle, cached result, loading state, error state, and freshness information.
 *
 * A query typically has a query key that identifies which server data is being requested
 * and a query function that knows how to retrieve that data. The query key is important
 * because different parameters represent different pieces of server state.
 *
 * A query is also declarative. Instead of manually coordinating every request with local
 * effects and state variables, a component describes the server data it needs and a
 * query-management system can handle the request lifecycle around that declaration.
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

export interface QueryResult<TData> {
  readonly data: TData | null;
  readonly isLoading: boolean;
  readonly isError: boolean;
  readonly error: string | null;
}

export interface UserQueryProps {
  readonly userId: number;
}

export interface QueryStateExampleProps {
  readonly userId: number;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * Demonstrates the basic structure of a query.
 *
 * The query consists of an identifier describing which data is requested and a query
 * function responsible for retrieving that data. The simulated request represents the
 * asynchronous operation that would normally communicate with an API.
 */
export const BasicQuery: React.FC<UserQueryProps> = ({ userId }: UserQueryProps): React.ReactElement => {
  const [result, setResult] = useState<QueryResult<User>>({
    data: null,
    isLoading: true,
    isError: false,
    error: null,
  });

  useEffect((): (() => void) => {
    let isCancelled: boolean = false;

    const queryFn = async (): Promise<User> => {
      await new Promise<void>((resolve): void => {
        window.setTimeout(resolve, 500);
      });

      return {
        id: userId,
        name: "John Doe",
        email: "john.doe@example.com",
      };
    };

    const executeQuery = async (): Promise<void> => {
      setResult({
        data: null,
        isLoading: true,
        isError: false,
        error: null,
      });

      try {
        const data: User = await queryFn();

        if (!isCancelled) {
          setResult({
            data,
            isLoading: false,
            isError: false,
            error: null,
          });
        }
      } catch {
        if (!isCancelled) {
          setResult({
            data: null,
            isLoading: false,
            isError: true,
            error: "Failed to load user.",
          });
        }
      }
    };

    void executeQuery();

    return (): void => {
      isCancelled = true;
    };
  }, [userId]);

  if (result.isLoading) {
    return <p>Loading user...</p>;
  }

  if (result.isError) {
    return <p role="alert">{result.error}</p>;
  }

  return (
    <div>
      <p>Name: {result.data?.name}</p>
      <p>Email: {result.data?.email}</p>
    </div>
  );
};

/**
 * Demonstrates that a query represents server data, not merely a request execution.
 *
 * Once the request completes, the result represents a piece of server state associated
 * with the requested user. The data can therefore be treated as a distinct remote resource.
 */
export const QueryRepresentsServerData: React.FC = (): React.ReactElement => {
  const [user, setUser] = useState<User | null>(null);

  useEffect((): (() => void) => {
    const timeoutId: number = window.setTimeout((): void => {
      setUser({
        id: 1,
        name: "John Doe",
        email: "john.doe@example.com",
      });
    }, 500);

    return (): void => {
      window.clearTimeout(timeoutId);
    };
  }, []);

  return (
    <div>
      <p>Query data: {user?.name ?? "Loading..."}</p>
      <p>The query result represents remote user data rather than a purely local UI value.</p>
    </div>
  );
};

/**
 * Demonstrates that changing query input represents a different query.
 *
 * The user ID participates in the query's identity. When the ID changes, the component
 * needs data for a different remote resource and therefore executes the query again.
 */
export const QueryDependsOnInput: React.FC<UserQueryProps> = ({ userId }: UserQueryProps): React.ReactElement => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect((): (() => void) => {
    let isCancelled: boolean = false;

    const queryUser = async (): Promise<void> => {
      setIsLoading(true);

      await new Promise<void>((resolve): void => {
        window.setTimeout(resolve, 400);
      });

      const queriedUser: User = {
        id: userId,
        name: userId === 1 ? "John Doe" : "Jane Doe",
        email: userId === 1 ? "john.doe@example.com" : "jane.doe@example.com",
      };

      if (!isCancelled) {
        setUser(queriedUser);
        setIsLoading(false);
      }
    };

    void queryUser();

    return (): void => {
      isCancelled = true;
    };
  }, [userId]);

  if (isLoading) {
    return <p>Loading user {userId}...</p>;
  }

  return (
    <div>
      <p>Query user ID: {user?.id}</p>
      <p>Query result: {user?.name}</p>
    </div>
  );
};

/**
 * Demonstrates an important query misconception.
 *
 * A query key is not simply a label for the request. Its values must describe the
 * server data being requested. If two requests represent different resources but
 * share an identical key in a query-management system, they can incorrectly be treated
 * as the same piece of cached server state.
 */
export const QueryIdentityExample: React.FC = (): React.ReactElement => {
  const userId: number = 1;
  const queryKey: readonly [string, number] = ["user", userId];

  return (
    <div>
      <p>Query key: {JSON.stringify(queryKey)}</p>
      <p>The key identifies the user resource represented by this query.</p>
    </div>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const Query: React.FC = (): React.ReactElement => {
  return (
    <main>
      <h1>Query</h1>

      <h2>1. Basic query structure</h2>
      <BasicQuery userId={1} />

      <h2>2. A query represents server data</h2>
      <QueryRepresentsServerData />

      <h2>3. Query input identifies the requested resource</h2>
      <QueryDependsOnInput userId={2} />

      <h2>4. Query identity must describe the requested data</h2>
      <QueryIdentityExample />
    </main>
  );
};

export default Query;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// A query represents a piece of server data together with the logic required to retrieve it.
// A query normally has an identity, commonly represented by a query key.
// A query function performs the asynchronous operation that retrieves the remote data.
// Query state commonly includes data, loading, and error information.
// Changing the parameters that identify the requested resource represents a different query.
// Query identity is important because query-management systems use it to distinguish server-state resources.
