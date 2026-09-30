/**
 * API Layer vs Query Layer
 * ========================
 *
 * The API layer and query layer solve different problems in a server-state architecture.
 * The API layer is responsible for communicating with the remote server, while the query
 * layer is responsible for managing the lifecycle of the server data after it is requested.
 *
 * An API function typically defines an operation such as fetching a user and returns the
 * server response. It should not need to know whether a component is rendering the result,
 * whether the response is cached, or whether another component requested the same resource.
 *
 * The query layer consumes API functions and adds server-state behavior such as loading state,
 * caching, refetching, request deduplication, synchronization, retries, and error state.
 * It can therefore expose a stable query result to presentation components without requiring
 * those components to understand transport details.
 *
 * The distinction is important because an API function is not automatically a query. Calling
 * an API function retrieves data, whereas a query layer manages that data as application state.
 * The two layers work together but should remain conceptually separate.
 */

import type { FC, ReactElement } from "react";
import { useState } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface User {
  readonly id: number;
  readonly name: string;
  readonly role: "Admin" | "Editor" | "Viewer";
}

export interface ApiResponse<TData> {
  readonly data: TData;
  readonly status: number;
}

export interface QueryResult<TData> {
  readonly data: TData | null;
  readonly error: string | null;
  readonly isLoading: boolean;
  readonly isFetching: boolean;
}

export interface ApiLayerExampleProps {
  readonly user: User;
}

export interface QueryLayerExampleProps {
  readonly user: User;
}

export interface LayerComparisonProps {
  readonly apiResponsibility: readonly string[];
  readonly queryResponsibility: readonly string[];
}

export interface UserDisplayProps {
  readonly user: User | null;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

export const ApiLayerExample: FC<ApiLayerExampleProps> = ({ user }): ReactElement => {
  const fetchUser = (): ApiResponse<User> => {
    return {
      data: user,
      status: 200,
    };
  };

  const response: ApiResponse<User> = fetchUser();

  return (
    <div>
      <p>API status: {response.status}</p>
      <p>Returned user: {response.data.name}</p>
      <p>API responsibility: request and response communication</p>
    </div>
  );
};

export const QueryLayerExample: FC<QueryLayerExampleProps> = ({ user }): ReactElement => {
  const [result, setResult] = useState<QueryResult<User>>({
    data: null,
    error: null,
    isLoading: true,
    isFetching: true,
  });

  const executeQuery = (): void => {
    setResult((currentResult: QueryResult<User>) => ({
      ...currentResult,
      isFetching: true,
      error: null,
    }));

    window.setTimeout(() => {
      const response: ApiResponse<User> = {
        data: user,
        status: 200,
      };

      setResult({
        data: response.data,
        error: null,
        isLoading: false,
        isFetching: false,
      });
    }, 700);
  };

  return (
    <div>
      <p>Data available: {result.data !== null ? "yes" : "no"}</p>
      <p>Initial loading: {result.isLoading ? "yes" : "no"}</p>
      <p>Fetching: {result.isFetching ? "yes" : "no"}</p>
      <p>Error: {result.error ?? "none"}</p>

      <button type="button" disabled={result.isFetching} onClick={executeQuery}>
        {result.isFetching ? "Fetching..." : "Execute query"}
      </button>
    </div>
  );
};

export const UserDisplay: FC<UserDisplayProps> = ({ user }): ReactElement => {
  if (user === null) {
    return <p>No user data available.</p>;
  }

  return (
    <article>
      <h3>{user.name}</h3>
      <p>Role: {user.role}</p>
    </article>
  );
};

export const LayerComparison: FC<LayerComparisonProps> = ({ apiResponsibility, queryResponsibility }): ReactElement => {
  return (
    <div>
      <div>
        <h3>API layer</h3>
        <ul>
          {apiResponsibility.map((responsibility: string) => (
            <li key={responsibility}>{responsibility}</li>
          ))}
        </ul>
      </div>

      <div>
        <h3>Query layer</h3>
        <ul>
          {queryResponsibility.map((responsibility: string) => (
            <li key={responsibility}>{responsibility}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const ApiLayerVsQueryLayerDemo: FC = (): ReactElement => {
  const user: User = {
    id: 1,
    name: "John Doe",
    role: "Admin",
  };

  const apiResponsibility: readonly string[] = [
    "Construct or execute the remote request",
    "Handle transport-level response data",
    "Serialize request parameters when necessary",
    "Deserialize the server response",
    "Expose server communication as reusable functions",
  ];

  const queryResponsibility: readonly string[] = [
    "Track loading and fetching state",
    "Store and expose server data",
    "Manage query errors",
    "Coordinate refetching",
    "Manage caching and stale data",
    "Deduplicate equivalent requests",
    "Coordinate synchronization behavior",
  ];

  return (
    <section>
      <h2>1. API Layer</h2>
      <ApiLayerExample user={user} />

      <h2>2. Query Layer</h2>
      <QueryLayerExample user={user} />

      <h2>3. API Layer Responsibilities</h2>
      <LayerComparison apiResponsibility={apiResponsibility} queryResponsibility={[]} />

      <h2>4. Query Layer Responsibilities</h2>
      <LayerComparison apiResponsibility={[]} queryResponsibility={queryResponsibility} />

      <h2>5. Presentation Consumes Query Data</h2>
      <UserDisplay user={user} />
    </section>
  );
};

export default ApiLayerVsQueryLayerDemo;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// The API layer is responsible for communicating with the remote server.
// API functions should generally remain independent of component rendering and query caching.
// The query layer consumes API functions and manages server-state lifecycle concerns.
// Query state can include data, loading state, fetching state, errors, and synchronization status.
// Caching and request deduplication are query-layer concerns rather than transport concerns.
// A successful API response does not by itself provide query state management.
// Presentation components should consume query state rather than implement transport and caching logic.
// Keeping the layers separate allows API functions to be reused by multiple query operations.
// The API layer answers how data is retrieved; the query layer answers how that data is managed.
