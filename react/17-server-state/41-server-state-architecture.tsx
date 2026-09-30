/**
 * Server State Architecture
 * ==========================
 *
 * Server state architecture defines how an application separates remote data, transport logic,
 * query management, and presentation concerns. A clear architecture prevents components from
 * becoming responsible for fetching, caching, transforming, synchronizing, and rendering server
 * state at the same time.
 *
 * A common architecture separates the server into a remote data source, an API layer that handles
 * transport concerns, a query layer that manages server-state behavior such as caching and request
 * status, and UI components that consume the resulting state. Each layer has a focused responsibility
 * while the layers work together to represent server data in the application.
 *
 * The API layer should generally know how to communicate with the backend but should not need to
 * know which component requested the data or how that data is rendered. The query layer can build
 * on the API layer by adding caching, deduplication, synchronization, retry behavior, and lifecycle
 * management. UI components should consume query state rather than implementing those mechanisms
 * themselves.
 *
 * This separation also makes architectural boundaries explicit. Components can remain focused on
 * rendering and user interaction, the query layer can remain focused on server-state management,
 * and the API layer can remain focused on communication with the backend.
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

export interface QueryState<TData> {
  readonly data: TData | null;
  readonly error: string | null;
  readonly isLoading: boolean;
  readonly isFetching: boolean;
}

export interface ServerStateArchitectureProps {
  readonly initialUser: User;
}

export interface ServerStateSourceProps {
  readonly user: User;
}

export interface ApiLayerProps {
  readonly response: ApiResponse<User>;
}

export interface QueryLayerProps {
  readonly state: QueryState<User>;
}

export interface PresentationLayerProps {
  readonly user: User | null;
}

export interface ArchitectureFlowProps {
  readonly layers: readonly string[];
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

export const ServerStateSource: FC<ServerStateSourceProps> = ({ user }): ReactElement => {
  return (
    <div>
      <p>Remote resource</p>
      <p>ID: {user.id}</p>
      <p>Name: {user.name}</p>
      <p>Role: {user.role}</p>
    </div>
  );
};

export const ApiLayer: FC<ApiLayerProps> = ({ response }): ReactElement => {
  return (
    <div>
      <p>API status: {response.status}</p>
      <p>API returned: {response.data.name}</p>
      <p>API responsibility: transport and response handling</p>
    </div>
  );
};

export const QueryLayer: FC<QueryLayerProps> = ({ state }): ReactElement => {
  return (
    <div>
      <p>Query loading: {state.isLoading ? "yes" : "no"}</p>
      <p>Query fetching: {state.isFetching ? "yes" : "no"}</p>
      <p>Cached data available: {state.data !== null ? "yes" : "no"}</p>
      <p>Query error: {state.error ?? "none"}</p>
    </div>
  );
};

export const PresentationLayer: FC<PresentationLayerProps> = ({ user }): ReactElement => {
  if (user === null) {
    return <p>No user available.</p>;
  }

  return (
    <article>
      <h3>{user.name}</h3>
      <p>Role: {user.role}</p>
    </article>
  );
};

export const ArchitectureFlow: FC<ArchitectureFlowProps> = ({ layers }): ReactElement => {
  return (
    <ol>
      {layers.map((layer: string) => (
        <li key={layer}>{layer}</li>
      ))}
    </ol>
  );
};

export const ServerStateArchitecture: FC<ServerStateArchitectureProps> = ({ initialUser }): ReactElement => {
  const [queryState, setQueryState] = useState<QueryState<User>>({
    data: initialUser,
    error: null,
    isLoading: false,
    isFetching: false,
  });

  const refreshUser = (): void => {
    setQueryState((currentState: QueryState<User>) => ({
      ...currentState,
      isFetching: true,
      error: null,
    }));

    window.setTimeout(() => {
      setQueryState({
        data: initialUser,
        error: null,
        isLoading: false,
        isFetching: false,
      });
    }, 700);
  };

  const apiResponse: ApiResponse<User> = {
    data: initialUser,
    status: 200,
  };

  return (
    <div>
      <ArchitectureFlow layers={["Remote server state", "API layer", "Query layer", "Presentation layer"]} />

      <ServerStateSource user={initialUser} />

      <ApiLayer response={apiResponse} />

      <QueryLayer state={queryState} />

      <PresentationLayer user={queryState.data} />

      <button type="button" disabled={queryState.isFetching} onClick={refreshUser}>
        {queryState.isFetching ? "Refreshing..." : "Refresh user"}
      </button>
    </div>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const initialUser: User = {
  id: 1,
  name: "John Doe",
  role: "Admin",
};

const ServerStateArchitectureDemo: FC = (): ReactElement => {
  const queryState: QueryState<User> = {
    data: initialUser,
    error: null,
    isLoading: false,
    isFetching: false,
  };

  return (
    <section>
      <h2>1. Remote Server State</h2>
      <ServerStateSource user={initialUser} />

      <h2>2. API Layer</h2>
      <ApiLayer
        response={{
          data: initialUser,
          status: 200,
        }}
      />

      <h2>3. Query Layer</h2>
      <QueryLayer state={queryState} />

      <h2>4. Presentation Layer</h2>
      <PresentationLayer user={initialUser} />

      <h2>5. Layered Server-State Architecture</h2>
      <ArchitectureFlow layers={["Remote server state", "API layer", "Query layer", "Presentation layer"]} />

      <h2>6. Integrated Architecture</h2>
      <ServerStateArchitecture initialUser={initialUser} />
    </section>
  );
};

export default ServerStateArchitectureDemo;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// Server-state architecture separates remote data management from presentation concerns.
// The server is the authoritative source of the remote resource.
// The API layer is responsible for communication and transport-level response handling.
// The query layer manages server-state behavior such as loading, caching, refetching, and errors.
// The presentation layer consumes query state and focuses on rendering the UI.
// Components should not need to implement transport, caching, and synchronization independently.
// A query layer can expose a stable interface while hiding the details of server-state management.
// Separating these responsibilities makes server-state behavior easier to test and reason about.
// The API layer and query layer have different responsibilities even though they often work together.
// Server-state architecture is independent of any particular query-management library.
