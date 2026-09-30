/**
 * Server State Boundaries
 * =======================
 *
 * Server-state boundaries define where responsibility for remote data begins and ends within
 * an application. Clear boundaries prevent API communication, server-state management, and
 * presentation logic from becoming mixed together inside the same component.
 *
 * An API boundary separates transport concerns from application state management. The API layer
 * knows how to communicate with a remote service, but it should not decide how components cache,
 * refetch, or render the returned data.
 *
 * A query boundary separates server-state management from presentation. The query layer owns
 * concerns such as loading state, cached data, refetching, synchronization, and errors, while
 * components consume the resulting state and decide how to render it.
 *
 * A presentation boundary separates UI concerns from server-state implementation details.
 * Components should not need to know whether data came from a network request, a cache, a
 * background refetch, or another query-management mechanism.
 *
 * Boundaries are architectural responsibilities rather than mandatory files or folders. A small
 * application may implement several responsibilities close together, while a larger application
 * may isolate each boundary into separate modules or packages.
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

export interface ApiBoundaryProps {
  readonly user: User;
}

export interface QueryBoundaryProps {
  readonly user: User;
}

export interface PresentationBoundaryProps {
  readonly result: QueryResult<User>;
}

export interface BoundaryResponsibilityProps {
  readonly title: string;
  readonly responsibilities: readonly string[];
}

export interface IntegratedBoundaryProps {
  readonly initialUser: User;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

export const BoundaryResponsibility: FC<BoundaryResponsibilityProps> = ({ title, responsibilities }): ReactElement => {
  return (
    <div>
      <h3>{title}</h3>
      <ul>
        {responsibilities.map((responsibility: string) => (
          <li key={responsibility}>{responsibility}</li>
        ))}
      </ul>
    </div>
  );
};

export const ApiBoundary: FC<ApiBoundaryProps> = ({ user }): ReactElement => {
  const fetchUser = (): ApiResponse<User> => {
    return {
      data: user,
      status: 200,
    };
  };

  const response: ApiResponse<User> = fetchUser();

  return (
    <div>
      <p>HTTP status: {response.status}</p>
      <p>Remote resource: {response.data.name}</p>
      <p>Boundary owns: server communication</p>
    </div>
  );
};

export const QueryBoundary: FC<QueryBoundaryProps> = ({ user }): ReactElement => {
  const [result, setResult] = useState<QueryResult<User>>({
    data: user,
    error: null,
    isLoading: false,
    isFetching: false,
  });

  const refetchUser = (): void => {
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
      <p>Cached data: {result.data !== null ? "available" : "missing"}</p>
      <p>Initial loading: {result.isLoading ? "yes" : "no"}</p>
      <p>Fetching: {result.isFetching ? "yes" : "no"}</p>
      <p>Error: {result.error ?? "none"}</p>

      <button type="button" disabled={result.isFetching} onClick={refetchUser}>
        {result.isFetching ? "Refetching..." : "Refetch user"}
      </button>
    </div>
  );
};

export const PresentationBoundary: FC<PresentationBoundaryProps> = ({ result }): ReactElement => {
  if (result.isLoading && result.data === null) {
    return <p>Loading user...</p>;
  }

  if (result.error !== null && result.data === null) {
    return <p>Unable to display user: {result.error}</p>;
  }

  if (result.data === null) {
    return <p>No user data available.</p>;
  }

  return (
    <article>
      <h3>{result.data.name}</h3>
      <p>Role: {result.data.role}</p>
      {result.isFetching && <p>Updating data...</p>}
    </article>
  );
};

export const IntegratedBoundaries: FC<IntegratedBoundaryProps> = ({ initialUser }): ReactElement => {
  const [result, setResult] = useState<QueryResult<User>>({
    data: initialUser,
    error: null,
    isLoading: false,
    isFetching: false,
  });

  const refresh = (): void => {
    setResult((currentResult: QueryResult<User>) => ({
      ...currentResult,
      isFetching: true,
    }));

    window.setTimeout(() => {
      const response: ApiResponse<User> = {
        data: {
          ...initialUser,
          role: "Editor",
        },
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
      <div>
        <strong>API boundary</strong>
        <p>Produces the remote response.</p>
      </div>

      <div>
        <strong>Query boundary</strong>
        <p>Owns the current server-state lifecycle.</p>
      </div>

      <div>
        <strong>Presentation boundary</strong>
        <PresentationBoundary result={result} />
      </div>

      <button type="button" disabled={result.isFetching} onClick={refresh}>
        {result.isFetching ? "Updating..." : "Update server state"}
      </button>
    </div>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const ServerStateBoundariesDemo: FC = (): ReactElement => {
  const user: User = {
    id: 1,
    name: "John Doe",
    role: "Admin",
  };

  const apiResponsibilities: readonly string[] = [
    "Build and execute remote requests",
    "Handle transport-level responses",
    "Deserialize remote data",
    "Expose reusable server operations",
  ];

  const queryResponsibilities: readonly string[] = [
    "Track query lifecycle",
    "Store server-state data",
    "Manage cached data",
    "Coordinate refetching",
    "Expose loading and error state",
    "Coordinate synchronization",
  ];

  const presentationResponsibilities: readonly string[] = [
    "Render server-state data",
    "Render loading and error states",
    "Respond to user interaction",
    "Remain independent of transport details",
  ];

  const successfulQuery: QueryResult<User> = {
    data: user,
    error: null,
    isLoading: false,
    isFetching: false,
  };

  return (
    <section>
      <h2>1. API Boundary</h2>
      <ApiBoundary user={user} />

      <h2>2. Query Boundary</h2>
      <QueryBoundary user={user} />

      <h2>3. Presentation Boundary</h2>
      <PresentationBoundary result={successfulQuery} />

      <h2>4. API Responsibility</h2>
      <BoundaryResponsibility title="API boundary" responsibilities={apiResponsibilities} />

      <h2>5. Query Responsibility</h2>
      <BoundaryResponsibility title="Query boundary" responsibilities={queryResponsibilities} />

      <h2>6. Presentation Responsibility</h2>
      <BoundaryResponsibility title="Presentation boundary" responsibilities={presentationResponsibilities} />

      <h2>7. Complete Boundary Flow</h2>
      <IntegratedBoundaries initialUser={user} />
    </section>
  );
};

export default ServerStateBoundariesDemo;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// Server-state boundaries define which layer owns each responsibility.
// The API boundary owns communication with the remote server.
// The query boundary owns server-state lifecycle and management concerns.
// The presentation boundary owns rendering and user-facing interaction.
// Components should not need to know transport details to render server data.
// API functions should not need to know how their responses are cached or displayed.
// Query state provides a boundary between remote data management and presentation.
// Boundaries can exist conceptually even when several responsibilities are implemented in one module.
// Clear boundaries reduce coupling and make server-state behavior easier to change independently.
