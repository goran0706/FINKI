/**
 * Query Layer
 * ===========
 *
 * A query layer is the application layer responsible for reading and managing server state
 * between an API layer and UI components. It coordinates concerns such as query state,
 * caching, refetching, request status, and errors so that presentation components do not
 * need to implement those mechanisms themselves.
 *
 * A query layer typically receives a stable query key and a function that can retrieve
 * the corresponding remote data. The layer manages the lifecycle around that request and
 * exposes declarative state such as data, loading status, fetching status, and errors.
 *
 * The query layer does not replace the API layer. The API layer defines how a request is
 * performed, while the query layer defines how the application manages the resulting server
 * state. This separation allows the same API functions to be consumed by different queries
 * while keeping caching and synchronization logic outside presentation components.
 *
 * In a real application, a query-management library can provide this layer. The architectural
 * boundary remains useful regardless of implementation: components consume query state instead
 * of directly coordinating every server-state lifecycle concern.
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

export interface QueryState<TData> {
  readonly data: TData | null;
  readonly error: string | null;
  readonly isLoading: boolean;
  readonly isFetching: boolean;
}

export interface QueryResult<TData> {
  readonly data: TData | null;
  readonly error: string | null;
  readonly isLoading: boolean;
  readonly isFetching: boolean;
}

export interface QueryLayerExampleProps {
  readonly initialData: User;
}

export interface QueryStateDisplayProps<TData> {
  readonly result: QueryResult<TData>;
}

export interface QueryKeyDisplayProps {
  readonly queryKey: readonly unknown[];
}

export interface QueryLifecycleProps {
  readonly state: QueryState<User>;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

export const QueryStateDisplay = <TData,>({ result }: QueryStateDisplayProps<TData>): ReactElement => {
  return (
    <dl>
      <dt>Data available</dt>
      <dd>{result.data !== null ? "yes" : "no"}</dd>
      <dt>Initial loading</dt>
      <dd>{result.isLoading ? "yes" : "no"}</dd>
      <dt>Background fetching</dt>
      <dd>{result.isFetching ? "yes" : "no"}</dd>
      <dt>Error</dt>
      <dd>{result.error ?? "none"}</dd>
    </dl>
  );
};

export const QueryKeyDisplay: FC<QueryKeyDisplayProps> = ({ queryKey }): ReactElement => {
  return (
    <div>
      <p>Query key:</p>
      <code>{JSON.stringify(queryKey)}</code>
    </div>
  );
};

export const QueryLifecycle: FC<QueryLifecycleProps> = ({ state }): ReactElement => {
  const status: string = state.isLoading
    ? "Initial loading"
    : state.isFetching
      ? "Fetching with existing state"
      : state.error !== null
        ? "Error"
        : "Success";

  return (
    <div>
      <p>Status: {status}</p>
      <p>Has data: {state.data !== null ? "yes" : "no"}</p>
      <p>Has error: {state.error !== null ? "yes" : "no"}</p>
    </div>
  );
};

export const QueryLayerExample: FC<QueryLayerExampleProps> = ({ initialData }): ReactElement => {
  const [result, setResult] = useState<QueryResult<User>>({
    data: initialData,
    error: null,
    isLoading: false,
    isFetching: false,
  });

  const refresh = (): void => {
    setResult((currentResult: QueryResult<User>) => ({
      ...currentResult,
      isFetching: true,
      error: null,
    }));

    window.setTimeout(() => {
      setResult({
        data: {
          ...initialData,
          role: "Editor",
        },
        error: null,
        isLoading: false,
        isFetching: false,
      });
    }, 700);
  };

  return (
    <div>
      <QueryStateDisplay result={result} />

      <button type="button" disabled={result.isFetching} onClick={refresh}>
        {result.isFetching ? "Fetching..." : "Refetch user"}
      </button>
    </div>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const QueryLayerDemo: FC = (): ReactElement => {
  const user: User = {
    id: 1,
    name: "John Doe",
    role: "Admin",
  };

  const queryKey: readonly unknown[] = ["user", user.id];

  const successfulResult: QueryResult<User> = {
    data: user,
    error: null,
    isLoading: false,
    isFetching: false,
  };

  const backgroundFetchingResult: QueryResult<User> = {
    data: user,
    error: null,
    isLoading: false,
    isFetching: true,
  };

  const loadingResult: QueryResult<User> = {
    data: null,
    error: null,
    isLoading: true,
    isFetching: true,
  };

  return (
    <section>
      <h2>1. Query State</h2>
      <QueryStateDisplay result={successfulResult} />

      <h2>2. Query Key</h2>
      <QueryKeyDisplay queryKey={queryKey} />

      <h2>3. Initial Loading</h2>
      <QueryLifecycle state={loadingResult} />

      <h2>4. Background Fetching</h2>
      <QueryLifecycle state={backgroundFetchingResult} />

      <h2>5. Successful Query</h2>
      <QueryLifecycle state={successfulResult} />

      <h2>6. Query Layer in Practice</h2>
      <QueryLayerExample initialData={user} />
    </section>
  );
};

export default QueryLayerDemo;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// A query layer manages server-state behavior between the API layer and presentation components.
// It exposes declarative state such as data, loading, fetching, and error information.
// The API layer determines how remote data is retrieved; the query layer manages that data afterward.
// A query key identifies which server-state resource a query represents.
// Initial loading means the query has no usable data while its first request is in progress.
// Background fetching can occur while previously loaded data remains available to the UI.
// Query state lets components render server-state conditions without managing request lifecycles directly.
// A query layer can also centralize caching, refetching, synchronization, retries, and deduplication.
// Query-management libraries commonly provide these responsibilities as a reusable abstraction.
