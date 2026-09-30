/**
 * Cache Invalidation
 * ==================
 *
 * Cache invalidation is the process of marking cached server data as no longer trustworthy
 * after an event changes the corresponding data. Invalidating a cache entry does not
 * necessarily delete its data; it typically tells a query-management system that the cached
 * value should be refreshed before it is treated as current.
 *
 * Invalidation is commonly triggered after mutations such as creating, updating, or deleting
 * server resources. A useful distinction is that invalidation describes the decision that
 * cached data is outdated, while refetching is the network operation that obtains newer data.
 * Depending on the query library and configuration, invalidation may mark data stale, trigger
 * an immediate refetch for active queries, or allow the next access to fetch fresh data.
 *
 * Cache invalidation can target one exact cache entry, a family of related entries, or a broader
 * set of queries. The invalidation scope should match the data affected by the server operation:
 * invalidating too little can leave stale data visible, while invalidating too much can cause
 * unnecessary network requests.
 */

import React, { useState } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface CacheRecord<TData> {
  readonly key: string;
  readonly data: TData;
  readonly isStale: boolean;
}

export interface User {
  readonly id: number;
  readonly name: string;
}

export interface InvalidateExactQueryProps {
  readonly initialRecord: CacheRecord<User>;
}

export interface InvalidateQueryFamilyProps {
  readonly initialRecords: readonly CacheRecord<User>[];
}

export interface InvalidationDoesNotDeleteDataProps {
  readonly initialRecord: CacheRecord<User>;
}

export interface InvalidationFollowedByRefetchProps {
  readonly initialRecord: CacheRecord<User>;
}

export interface OverInvalidationProps {
  readonly initialRecords: readonly CacheRecord<User>[];
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

export const InvalidateExactQuery: React.FC<InvalidateExactQueryProps> = ({ initialRecord }): React.ReactElement => {
  const [record, setRecord] = useState<CacheRecord<User>>(initialRecord);

  const invalidate = (): void => {
    setRecord((currentRecord: CacheRecord<User>): CacheRecord<User> => ({
      ...currentRecord,
      isStale: true,
    }));
  };

  return (
    <div>
      <p>Query: {record.key}</p>
      <p>User: {record.data.name}</p>
      <p>Stale: {record.isStale ? "yes" : "no"}</p>
      <button type="button" onClick={invalidate}>
        Invalidate query
      </button>
    </div>
  );
};

export const InvalidateQueryFamily: React.FC<InvalidateQueryFamilyProps> = ({ initialRecords }): React.ReactElement => {
  const [records, setRecords] = useState<readonly CacheRecord<User>[]>(initialRecords);

  const invalidateUserQueries = (): void => {
    setRecords((currentRecords: readonly CacheRecord<User>[]): readonly CacheRecord<User>[] =>
      currentRecords.map((record: CacheRecord<User>): CacheRecord<User> => ({
        ...record,
        isStale: record.key.startsWith("users"),
      })),
    );
  };

  return (
    <div>
      {records.map((record: CacheRecord<User>): React.ReactElement => (
        <p key={record.key}>
          {record.key}: {record.isStale ? "stale" : "fresh"}
        </p>
      ))}
      <button type="button" onClick={invalidateUserQueries}>
        Invalidate user query family
      </button>
    </div>
  );
};

export const InvalidationDoesNotDeleteData: React.FC<InvalidationDoesNotDeleteDataProps> = ({
  initialRecord,
}): React.ReactElement => {
  const [record, setRecord] = useState<CacheRecord<User>>(initialRecord);

  const invalidate = (): void => {
    setRecord((currentRecord: CacheRecord<User>): CacheRecord<User> => ({
      ...currentRecord,
      isStale: true,
    }));
  };

  return (
    <div>
      <p>Cached name: {record.data.name}</p>
      <p>Cached data is {record.isStale ? "stale but still available" : "fresh"}.</p>
      <button type="button" onClick={invalidate}>
        Mark cache as stale
      </button>
    </div>
  );
};

export const InvalidationFollowedByRefetch: React.FC<InvalidationFollowedByRefetchProps> = ({
  initialRecord,
}): React.ReactElement => {
  const [record, setRecord] = useState<CacheRecord<User>>(initialRecord);
  const [isFetching, setIsFetching] = useState<boolean>(false);

  const invalidateAndRefetch = (): void => {
    setRecord((currentRecord: CacheRecord<User>): CacheRecord<User> => ({
      ...currentRecord,
      isStale: true,
    }));
    setIsFetching(true);

    window.setTimeout((): void => {
      setRecord({
        key: initialRecord.key,
        data: {
          id: initialRecord.data.id,
          name: "Jane Doe",
        },
        isStale: false,
      });
      setIsFetching(false);
    }, 1000);
  };

  return (
    <div>
      <p>Query: {record.key}</p>
      <p>Name: {record.data.name}</p>
      <p>Cache state: {record.isStale ? "stale" : "fresh"}</p>
      <p>{isFetching ? "Fetching updated data..." : "Not fetching"}</p>
      <button type="button" onClick={invalidateAndRefetch} disabled={isFetching}>
        Invalidate and refetch
      </button>
    </div>
  );
};

export const OverInvalidation: React.FC<OverInvalidationProps> = ({ initialRecords }): React.ReactElement => {
  const [records, setRecords] = useState<readonly CacheRecord<User>[]>(initialRecords);

  const invalidateEverything = (): void => {
    setRecords((currentRecords: readonly CacheRecord<User>[]): readonly CacheRecord<User>[] =>
      currentRecords.map((record: CacheRecord<User>): CacheRecord<User> => ({
        ...record,
        isStale: true,
      })),
    );
  };

  const invalidateUserListOnly = (): void => {
    setRecords((currentRecords: readonly CacheRecord<User>[]): readonly CacheRecord<User>[] =>
      currentRecords.map((record: CacheRecord<User>): CacheRecord<User> => ({
        ...record,
        isStale: record.key === "users",
      })),
    );
  };

  return (
    <div>
      {records.map((record: CacheRecord<User>): React.ReactElement => (
        <p key={record.key}>
          {record.key}: {record.isStale ? "stale" : "fresh"}
        </p>
      ))}
      <button type="button" onClick={invalidateUserListOnly}>
        Invalidate affected query
      </button>
      <button type="button" onClick={invalidateEverything}>
        Invalidate all queries
      </button>
    </div>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const CacheInvalidation: React.FC = (): React.ReactElement => {
  const userRecord: CacheRecord<User> = {
    key: "user:1",
    data: {
      id: 1,
      name: "John Doe",
    },
    isStale: false,
  };

  const userQueryRecords: readonly CacheRecord<User>[] = [
    {
      key: "users",
      data: {
        id: 1,
        name: "John Doe",
      },
      isStale: false,
    },
    {
      key: "users?role=admin",
      data: {
        id: 1,
        name: "John Doe",
      },
      isStale: false,
    },
    {
      key: "products",
      data: {
        id: 101,
        name: "Example Product",
      },
      isStale: false,
    },
  ];

  return (
    <main>
      <h1>Cache Invalidation</h1>

      <h2>1. Invalidate an exact query</h2>
      <InvalidateExactQuery initialRecord={userRecord} />

      <h2>2. Invalidate a query family</h2>
      <InvalidateQueryFamily initialRecords={userQueryRecords} />

      <h2>3. Invalidation does not delete cached data</h2>
      <InvalidationDoesNotDeleteData initialRecord={userRecord} />

      <h2>4. Invalidation can be followed by refetching</h2>
      <InvalidationFollowedByRefetch initialRecord={userRecord} />

      <h2>5. Avoid unnecessarily broad invalidation</h2>
      <OverInvalidation initialRecords={userQueryRecords} />
    </main>
  );
};

export default CacheInvalidation;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// Cache invalidation marks cached server data as no longer trustworthy.
// Invalidating data does not inherently delete the cached value.
// Invalidation and refetching are separate concepts: invalidation identifies stale data,
// while refetching performs the network request needed to obtain an updated value.
// Exact invalidation limits the affected cache scope to one query or resource.
// Query-family invalidation can update several related cache entries together.
// Overly broad invalidation can cause unnecessary refetches and network traffic.
// The correct invalidation scope should reflect which server data was actually changed.
