/**
 * SWR
 * ===
 *
 * SWR is a React data-fetching library for managing remote data with a stale-while-revalidate
 * model. A component provides a cache key and a fetcher, and SWR returns the current cached
 * data together with loading, error, and revalidation state.
 *
 * The stale-while-revalidate model allows cached data to remain available while SWR revalidates
 * that data in the background. This means a component can continue rendering previously fetched
 * server data while a newer request is in progress.
 *
 * SWR identifies resources by keys. The key can be a string, array, or another supported key
 * representation. The fetcher receives the resolved key arguments and returns the requested data.
 * Components using the same key can share the corresponding cached server state through SWR's
 * cache and revalidation mechanisms.
 *
 * SWR also provides mutation through mutate. Mutation can update or revalidate cached data,
 * allowing applications to coordinate changes to server state without placing cache-management
 * logic directly inside presentation components.
 *
 * SWR focuses on server-state concerns such as caching, revalidation, deduplication, and
 * synchronization. It does not replace the API layer: the fetcher or API function remains
 * responsible for communicating with the remote service.
 */

import type { FC, ReactElement } from "react";
import { useState } from "react";
import useSWR from "swr";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface User {
  readonly id: number;
  readonly name: string;
  readonly role: "Admin" | "Editor" | "Viewer";
}

export interface UserResponse {
  readonly user: User;
}

export interface SwrStateDisplayProps {
  readonly data: User | undefined;
  readonly error: Error | undefined;
  readonly isLoading: boolean;
  readonly isValidating: boolean;
}

export interface UserDataDisplayProps {
  readonly user: User;
}

export interface UserQueryProps {
  readonly userId: number;
}

export interface SwrKeyDisplayProps {
  readonly queryKey: string;
}

export interface SwrExampleProps {
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

const userFetcher = async (key: string): Promise<User> => {
  const userId: number = Number(key.split(":")[1]);
  return fetchUser(userId);
};

export const SwrStateDisplay: FC<SwrStateDisplayProps> = ({ data, error, isLoading, isValidating }): ReactElement => {
  return (
    <dl>
      <dt>Data available</dt>
      <dd>{data !== undefined ? "yes" : "no"}</dd>
      <dt>Loading</dt>
      <dd>{isLoading ? "yes" : "no"}</dd>
      <dt>Validating</dt>
      <dd>{isValidating ? "yes" : "no"}</dd>
      <dt>Error</dt>
      <dd>{error?.message ?? "none"}</dd>
    </dl>
  );
};

export const UserDataDisplay: FC<UserDataDisplayProps> = ({ user }): ReactElement => {
  return (
    <article>
      <h3>{user.name}</h3>
      <p>User ID: {user.id}</p>
      <p>Role: {user.role}</p>
    </article>
  );
};

export const SwrKeyDisplay: FC<SwrKeyDisplayProps> = ({ queryKey }): ReactElement => {
  return (
    <div>
      <p>SWR cache key:</p>
      <code>{queryKey}</code>
    </div>
  );
};

export const UserQuery: FC<UserQueryProps> = ({ userId }): ReactElement => {
  const queryKey: string = `user:${userId}`;

  const { data, error, isLoading, isValidating, mutate } = useSWR<User, Error>(queryKey, userFetcher);

  if (isLoading) {
    return <p>Loading user...</p>;
  }

  if (error !== undefined) {
    return <p>Error: {error.message}</p>;
  }

  if (data === undefined) {
    return <p>No user data available.</p>;
  }

  return (
    <div>
      <UserDataDisplay user={data} />

      {isValidating && <p>Revalidating cached data...</p>}

      <button
        type="button"
        disabled={isValidating}
        onClick={() => {
          void mutate();
        }}
      >
        {isValidating ? "Revalidating..." : "Revalidate"}
      </button>
    </div>
  );
};

export const SwrExample: FC<SwrExampleProps> = ({ userId }): ReactElement => {
  const queryKey: string = `user:${userId}`;

  const { data, error, isLoading, isValidating, mutate } = useSWR<User, Error>(queryKey, userFetcher);

  return (
    <div>
      <SwrStateDisplay data={data} error={error} isLoading={isLoading} isValidating={isValidating} />

      {data !== undefined && <UserDataDisplay user={data} />}

      {data === undefined && isLoading && <p>No cached data is available yet.</p>}

      {error !== undefined && <p>Error: {error.message}</p>}

      {data !== undefined && isValidating && <p>Cached data remains visible while SWR revalidates it.</p>}

      <button
        type="button"
        disabled={isValidating}
        onClick={() => {
          void mutate();
        }}
      >
        {isValidating ? "Validating..." : "Revalidate"}
      </button>
    </div>
  );
};

export const SwrMutationExample: FC<UserQueryProps> = ({ userId }): ReactElement => {
  const queryKey: string = `user:${userId}`;
  const [message, setMessage] = useState<string>("");

  const { data, error, mutate } = useSWR<User, Error>(queryKey, userFetcher);

  const updateCachedRole = (): void => {
    if (data === undefined) {
      setMessage("No cached user is available.");
      return;
    }

    const updatedUser: User = {
      ...data,
      role: data.role === "Admin" ? "Editor" : "Admin",
    };

    void mutate(updatedUser, {
      revalidate: false,
    });

    setMessage("The local SWR cache was updated.");
  };

  if (error !== undefined) {
    return <p>Error: {error.message}</p>;
  }

  if (data === undefined) {
    return <p>Loading user...</p>;
  }

  return (
    <div>
      <UserDataDisplay user={data} />

      <button type="button" onClick={updateCachedRole}>
        Update cached role
      </button>

      {message !== "" && <p>{message}</p>}
    </div>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const SwrDemo: FC = (): ReactElement => {
  const userId: number = 1;
  const queryKey: string = `user:${userId}`;

  const { data, error, isLoading, isValidating } = useSWR<User, Error>(queryKey, userFetcher);

  return (
    <section>
      <h2>1. SWR Cache Key</h2>
      <SwrKeyDisplay queryKey={queryKey} />

      <h2>2. Fetcher</h2>
      <p>The fetcher retrieves the remote user represented by the SWR key.</p>

      <h2>3. SWR State</h2>
      <SwrStateDisplay data={data} error={error} isLoading={isLoading} isValidating={isValidating} />

      <h2>4. Server Data</h2>
      {data !== undefined && <UserDataDisplay user={data} />}

      {error !== undefined && <p>Error: {error.message}</p>}

      {data === undefined && isLoading && <p>Loading user...</p>}

      <h2>5. Stale-While-Revalidate</h2>
      {data !== undefined && (
        <p>
          {isValidating
            ? "Cached data is displayed while SWR validates it."
            : "Cached data is currently not being revalidated."}
        </p>
      )}

      <h2>6. Manual Revalidation</h2>
      <UserQuery userId={userId} />

      <h2>7. Cache Mutation</h2>
      <SwrMutationExample userId={userId} />

      <h2>8. Complete SWR Example</h2>
      <SwrExample userId={userId} />
    </section>
  );
};

export default SwrDemo;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// SWR is a React library for fetching and managing remote server state.
// A key identifies the server-state resource represented by an SWR query.
// A fetcher is responsible for retrieving data represented by the key.
// SWR manages cached data and can share that data between consumers using the same key.
// isLoading represents the initial loading state when usable data is not available yet.
// isValidating indicates that SWR is currently validating or revalidating the resource.
// Stale-while-revalidate allows existing cached data to remain visible during revalidation.
// mutate can revalidate a resource or update its cached value.
// A local cache mutation does not automatically mean that the remote server has been changed.
// API communication remains the responsibility of the fetcher or API layer.
// SWR therefore provides a query and cache-management layer rather than replacing the API layer.
