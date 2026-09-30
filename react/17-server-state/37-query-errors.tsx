/**
 * Query Errors
 * ============
 *
 * A query error occurs when a request for server state fails instead of producing usable data.
 * Query state therefore needs to distinguish successful data from an error state and expose enough
 * information for the UI to communicate the failure or provide a recovery action.
 *
 * A query can fail during its initial request, while refreshing existing data, or after a previously
 * successful request. These situations should not necessarily produce the same UI: an initial failure
 * has no data to display, while a refetch failure can leave previously cached data available.
 *
 * Error handling is separate from retry behavior. A query can expose an error without automatically
 * retrying, and a retry operation can explicitly request the same query again. In a real query library,
 * the error object is typically supplied by the query function or normalized by the query layer.
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

export interface QueryError {
  readonly message: string;
  readonly statusCode?: number;
}

export interface QueryState<TData> {
  readonly data: TData | null;
  readonly error: QueryError | null;
  readonly isLoading: boolean;
  readonly isFetching: boolean;
}

export interface QueryErrorDisplayProps {
  readonly error: QueryError | null;
}

export interface QueryStateDisplayProps {
  readonly state: QueryState<readonly User[]>;
}

export interface QueryErrorRecoveryProps {
  readonly error: QueryError | null;
  readonly isFetching: boolean;
  readonly onRetry: () => void;
}

export interface QueryDataDisplayProps {
  readonly data: readonly User[] | null;
}

export interface QueryErrorExampleProps {
  readonly initialData: readonly User[] | null;
  readonly failRequest: boolean;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

export const QueryErrorDisplay: FC<QueryErrorDisplayProps> = ({ error }): ReactElement => {
  if (error === null) {
    return <p>No query error.</p>;
  }

  return (
    <div role="alert">
      <p>Request failed.</p>
      <p>{error.message}</p>
      {error.statusCode !== undefined && <p>Status code: {error.statusCode}</p>}
    </div>
  );
};

export const QueryDataDisplay: FC<QueryDataDisplayProps> = ({ data }): ReactElement => {
  if (data === null) {
    return <p>No data available.</p>;
  }

  return (
    <ul>
      {data.map((user: User) => (
        <li key={user.id}>
          {user.name} — {user.role}
        </li>
      ))}
    </ul>
  );
};

export const QueryStateDisplay: FC<QueryStateDisplayProps> = ({ state }): ReactElement => {
  if (state.isLoading) {
    return <p>Loading initial data...</p>;
  }

  return (
    <div>
      <QueryDataDisplay data={state.data} />
      {state.isFetching && <p>Refreshing data...</p>}
      <QueryErrorDisplay error={state.error} />
    </div>
  );
};

export const QueryErrorRecovery: FC<QueryErrorRecoveryProps> = ({ error, isFetching, onRetry }): ReactElement => {
  if (error === null) {
    return <p>The query completed without an error.</p>;
  }

  return (
    <div>
      <p role="alert">{error.message}</p>
      <button type="button" disabled={isFetching} onClick={onRetry}>
        {isFetching ? "Retrying..." : "Retry"}
      </button>
    </div>
  );
};

export const QueryErrorExample: FC<QueryErrorExampleProps> = ({ initialData, failRequest }): ReactElement => {
  const [state, setState] = useState<QueryState<readonly User[]>>({
    data: initialData,
    error: null,
    isLoading: initialData === null,
    isFetching: false,
  });

  const executeQuery = (): void => {
    setState((currentState: QueryState<readonly User[]>) => ({
      ...currentState,
      isLoading: currentState.data === null,
      isFetching: true,
      error: null,
    }));

    window.setTimeout(() => {
      if (failRequest) {
        setState((currentState: QueryState<readonly User[]>) => ({
          ...currentState,
          isLoading: false,
          isFetching: false,
          error: {
            message: "The server could not complete the request.",
            statusCode: 503,
          },
        }));
        return;
      }

      setState({
        data: [
          { id: 1, name: "John Doe", role: "Admin" },
          { id: 2, name: "Jane Smith", role: "Editor" },
          { id: 3, name: "Alex Johnson", role: "Viewer" },
        ],
        error: null,
        isLoading: false,
        isFetching: false,
      });
    }, 700);
  };

  return (
    <div>
      <QueryStateDisplay state={state} />
      <QueryErrorRecovery error={state.error} isFetching={state.isFetching} onRetry={executeQuery} />
      <button type="button" disabled={state.isFetching} onClick={executeQuery}>
        Run query
      </button>
    </div>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const users: readonly User[] = [
  { id: 1, name: "John Doe", role: "Admin" },
  { id: 2, name: "Jane Smith", role: "Editor" },
  { id: 3, name: "Alex Johnson", role: "Viewer" },
];

const QueryErrorsDemo: FC = (): ReactElement => {
  return (
    <section>
      <h2>1. Representing a Query Error</h2>
      <QueryErrorDisplay
        error={{
          message: "The server could not complete the request.",
          statusCode: 503,
        }}
      />

      <h2>2. Successful Data Without an Error</h2>
      <QueryDataDisplay data={users} />

      <h2>3. Initial Query Failure</h2>
      <QueryErrorExample initialData={null} failRequest={true} />

      <h2>4. Refetch Failure With Existing Data</h2>
      <QueryErrorExample initialData={users} failRequest={true} />

      <h2>5. Successful Retry</h2>
      <QueryErrorExample initialData={null} failRequest={false} />
    </section>
  );
};

export default QueryErrorsDemo;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// A query error represents a failed request for server state.
// Query state should distinguish an error from loading and successful data.
// An initial query error means there is no successfully loaded data to display.
// A refetch error can occur while previously successful data remains available.
// Existing data and an error can therefore coexist in the same query state.
// Error messages should provide useful information without exposing sensitive server details.
// HTTP status codes can provide additional information when the request layer makes them available.
// Retry behavior is separate from error representation and can be triggered explicitly.
// A retry should clear or replace the previous error according to the query lifecycle.
// Query errors should not automatically imply that all previously cached data is unusable.
// A query library may also normalize transport errors into a consistent error representation.
