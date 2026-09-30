/**
 * TanStack Query
 * ==============
 *
 * TanStack Query is a server-state management library for React. It provides declarative
 * primitives for fetching asynchronous data and managing the resulting server state through
 * query keys, query functions, caching, background fetching, refetching, and query status.
 *
 * A query is identified by a queryKey and obtains its data through a queryFn. TanStack Query
 * uses the query key as the identity of the server-state resource, allowing equivalent queries
 * to share cached data and coordinate updates. The query function is responsible for retrieving
 * the data; TanStack Query manages the lifecycle around that request.
 *
 * QueryClient stores and manages the query cache and related server-state behavior. A
 * QueryClientProvider makes a QueryClient available to descendant components, while useQuery
 * subscribes a component to a query. The query result exposes both the current data and
 * lifecycle state such as pending, error, success, and background fetching.
 *
 * TanStack Query distinguishes the absence of usable data from an active fetch. A query can
 * therefore have existing data while isFetching is true during a background refetch. This
 * allows a UI to keep displaying known data while indicating that the server state is being
 * updated.
 *
 * The examples below use a local asynchronous function instead of a real HTTP endpoint so that
 * the query lifecycle can be demonstrated without depending on an external service.
 */

import { QueryClient, QueryClientProvider, queryOptions, useQuery } from "@tanstack/react-query";
import type { FC, ReactElement } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface User {
  readonly id: number;
  readonly name: string;
  readonly role: "Admin" | "Editor" | "Viewer";
}

export interface UserQueryProps {
  readonly userId: number;
}

export interface QueryStateDisplayProps {
  readonly isPending: boolean;
  readonly isFetching: boolean;
  readonly isError: boolean;
  readonly isSuccess: boolean;
}

export interface QueryKeyDisplayProps {
  readonly queryKey: readonly unknown[];
}

export interface QueryDataDisplayProps {
  readonly user: User;
}

export interface QueryStatusExampleProps {
  readonly userId: number;
}

export interface TanStackQueryDemoProps {
  readonly userId: number;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

const users: readonly User[] = [
  {
    id: 1,
    name: "John Doe",
    role: "Admin",
  },
  {
    id: 2,
    name: "Jane Doe",
    role: "Editor",
  },
];

const fetchUser = async (userId: number): Promise<User> => {
  await new Promise<void>((resolve: () => void) => {
    window.setTimeout(resolve, 500);
  });

  const user: User | undefined = users.find((currentUser: User): boolean => currentUser.id === userId);

  if (user === undefined) {
    throw new Error("User not found.");
  }

  return user;
};

const userQueryOptions = (userId: number) =>
  queryOptions({
    queryKey: ["user", userId] as const,
    queryFn: (): Promise<User> => fetchUser(userId),
  });

export const QueryStateDisplay: FC<QueryStateDisplayProps> = ({
  isPending,
  isFetching,
  isError,
  isSuccess,
}): ReactElement => {
  return (
    <dl>
      <dt>Pending</dt>
      <dd>{isPending ? "yes" : "no"}</dd>
      <dt>Fetching</dt>
      <dd>{isFetching ? "yes" : "no"}</dd>
      <dt>Error</dt>
      <dd>{isError ? "yes" : "no"}</dd>
      <dt>Success</dt>
      <dd>{isSuccess ? "yes" : "no"}</dd>
    </dl>
  );
};

export const QueryKeyDisplay: FC<QueryKeyDisplayProps> = ({ queryKey }): ReactElement => {
  return (
    <div>
      <p>Query identity:</p>
      <code>{JSON.stringify(queryKey)}</code>
    </div>
  );
};

export const QueryDataDisplay: FC<QueryDataDisplayProps> = ({ user }): ReactElement => {
  return (
    <article>
      <h3>{user.name}</h3>
      <p>User ID: {user.id}</p>
      <p>Role: {user.role}</p>
    </article>
  );
};

export const QueryStatusExample: FC<QueryStatusExampleProps> = ({ userId }): ReactElement => {
  const query = useQuery(userQueryOptions(userId));

  return (
    <div>
      <QueryStateDisplay
        isPending={query.isPending}
        isFetching={query.isFetching}
        isError={query.isError}
        isSuccess={query.isSuccess}
      />

      {query.isPending && <p>Loading user...</p>}

      {query.isError && <p>Error: {query.error.message}</p>}

      {query.isSuccess && <QueryDataDisplay user={query.data} />}

      {query.isFetching && !query.isPending && <p>Background update in progress...</p>}

      <button
        type="button"
        onClick={() => {
          void query.refetch();
        }}
        disabled={query.isFetching}
      >
        {query.isFetching ? "Fetching..." : "Refetch"}
      </button>
    </div>
  );
};

export const UserQuery: FC<UserQueryProps> = ({ userId }): ReactElement => {
  const query = useQuery(userQueryOptions(userId));

  if (query.isPending) {
    return <p>Loading user...</p>;
  }

  if (query.isError) {
    return <p>Error: {query.error.message}</p>;
  }

  return (
    <div>
      <QueryDataDisplay user={query.data} />
      {query.isFetching && <p>Updating from the server...</p>}
    </div>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const queryClient: QueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
    },
  },
});

const TanStackQueryDemo: FC<TanStackQueryDemoProps> = ({ userId }): ReactElement => {
  const query = useQuery(userQueryOptions(userId));

  const queryKey: readonly unknown[] = ["user", userId];

  return (
    <section>
      <h2>1. Query Key</h2>
      <QueryKeyDisplay queryKey={queryKey} />

      <h2>2. Query Function</h2>
      <p>The query function asynchronously retrieves the user associated with the query key.</p>

      <h2>3. Query State</h2>
      <QueryStateDisplay
        isPending={query.isPending}
        isFetching={query.isFetching}
        isError={query.isError}
        isSuccess={query.isSuccess}
      />

      <h2>4. Query Data</h2>
      {query.isPending && <p>Loading user...</p>}

      {query.isError && <p>Error: {query.error.message}</p>}

      {query.isSuccess && <QueryDataDisplay user={query.data} />}

      <h2>5. Background Fetching</h2>
      {query.isFetching && <p>The query is fetching while its current state is being updated.</p>}

      <h2>6. Query Refetching</h2>
      <button
        type="button"
        disabled={query.isFetching}
        onClick={() => {
          void query.refetch();
        }}
      >
        {query.isFetching ? "Refetching..." : "Refetch user"}
      </button>

      <h2>7. Query Component</h2>
      <UserQuery userId={userId} />

      <h2>8. Query Status Example</h2>
      <QueryStatusExample userId={userId} />
    </section>
  );
};

const TanStackQueryProvider: FC = (): ReactElement => {
  return (
    <QueryClientProvider client={queryClient}>
      <TanStackQueryDemo userId={1} />
    </QueryClientProvider>
  );
};

export default TanStackQueryProvider;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// TanStack Query provides React primitives for managing asynchronous server state.
// A query is identified by a queryKey and retrieves data through a queryFn.
// The query key provides the identity used for caching, refetching, and sharing query state.
// QueryClient owns the query cache and coordinates query-related behavior.
// QueryClientProvider makes a QueryClient available to descendant React components.
// useQuery subscribes a component to a query and returns its current query result.
// isPending describes the initial state where no data is available yet.
// isFetching describes an active fetch and can also be true when existing data is displayed.
// isError indicates that the latest query attempt failed.
// isSuccess indicates that the query currently has usable data.
// A background refetch can occur while previously fetched data remains visible.
// queryOptions can centralize and type query configuration for reuse.
// TanStack Query manages server-state lifecycle concerns rather than replacing the API layer.
