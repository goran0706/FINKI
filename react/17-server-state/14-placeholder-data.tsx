/**
 * Placeholder Data
 * ================
 *
 * Placeholder data is temporary data displayed while the real query result is being
 * fetched. It allows an interface to render a useful shape immediately instead of
 * showing an empty loading state while the requested server data is unavailable.
 *
 * Placeholder data is different from initial data. Initial data is treated as actual
 * query data and can become part of the query cache, while placeholder data is temporary
 * display data used while the real query result is being obtained. In TanStack Query,
 * placeholder data is exposed through the `isPlaceholderData` state.
 *
 * Placeholder data is especially useful when changing between related queries, such as
 * navigating between paginated results or switching from one resource identifier to
 * another. The previous or estimated data can remain visible while the new query is
 * loading, while the application can still distinguish that temporary value from the
 * real server response.
 *
 * Placeholder data must not be mistaken for authoritative server data. UI that displays
 * placeholder data should account for its temporary nature, especially when rendering
 * actions or information that must only be based on confirmed server state.
 */

import React, { useState } from "react";

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
  readonly isFetching: boolean;
  readonly isPlaceholderData: boolean;
}

export interface BasicPlaceholderDataProps {
  readonly placeholderData: User;
  readonly serverData: User;
}

export interface PreviousDataAsPlaceholderProps {
  readonly initialData: User;
  readonly nextData: User;
}

export interface PlaceholderVsRealDataProps {
  readonly placeholderData: User;
  readonly serverData: User;
}

export interface PlaceholderDataWarningProps {
  readonly placeholderData: User;
  readonly serverData: User;
}

export interface PlaceholderDataReplacementProps {
  readonly placeholderData: User;
  readonly serverData: User;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

export const BasicPlaceholderData: React.FC<BasicPlaceholderDataProps> = ({
  placeholderData,
  serverData,
}): React.ReactElement => {
  const [query, setQuery] = useState<QueryResult<User>>({
    data: placeholderData,
    isFetching: true,
    isPlaceholderData: true,
  });

  const fetchServerData = (): void => {
    setQuery({
      data: placeholderData,
      isFetching: true,
      isPlaceholderData: true,
    });

    window.setTimeout((): void => {
      setQuery({
        data: serverData,
        isFetching: false,
        isPlaceholderData: false,
      });
    }, 1000);
  };

  return (
    <div>
      <p>Name: {query.data?.name ?? "No data"}</p>
      <p>Email: {query.data?.email ?? "No data"}</p>
      <p>Data source: {query.isPlaceholderData ? "placeholder" : "server"}</p>
      <p>Fetching: {query.isFetching ? "yes" : "no"}</p>
      <button type="button" onClick={fetchServerData} disabled={query.isFetching}>
        Fetch server data
      </button>
    </div>
  );
};

export const PreviousDataAsPlaceholder: React.FC<PreviousDataAsPlaceholderProps> = ({
  initialData,
  nextData,
}): React.ReactElement => {
  const [userId, setUserId] = useState<number>(initialData.id);
  const [query, setQuery] = useState<QueryResult<User>>({
    data: initialData,
    isFetching: false,
    isPlaceholderData: false,
  });

  const switchUser = (): void => {
    setUserId(nextData.id);
    setQuery({
      data: query.data,
      isFetching: true,
      isPlaceholderData: true,
    });

    window.setTimeout((): void => {
      setQuery({
        data: nextData,
        isFetching: false,
        isPlaceholderData: false,
      });
    }, 1000);
  };

  return (
    <div>
      <p>Requested user: {userId}</p>
      <p>Displayed name: {query.data?.name ?? "No data"}</p>
      <p>Displayed value: {query.isPlaceholderData ? "previous placeholder" : "server data"}</p>
      <button type="button" onClick={switchUser} disabled={query.isFetching}>
        Load another user
      </button>
    </div>
  );
};

export const PlaceholderVsRealData: React.FC<PlaceholderVsRealDataProps> = ({
  placeholderData,
  serverData,
}): React.ReactElement => {
  const [query, setQuery] = useState<QueryResult<User>>({
    data: placeholderData,
    isFetching: true,
    isPlaceholderData: true,
  });

  const resolveQuery = (): void => {
    setQuery({
      data: serverData,
      isFetching: false,
      isPlaceholderData: false,
    });
  };

  return (
    <div>
      <p>Current name: {query.data?.name ?? "No data"}</p>
      <p>Query state: {query.isPlaceholderData ? "temporary placeholder" : "real query data"}</p>
      <p>The placeholder is not the authoritative server response.</p>
      <button type="button" onClick={resolveQuery} disabled={!query.isPlaceholderData}>
        Resolve query
      </button>
    </div>
  );
};

export const PlaceholderDataWarning: React.FC<PlaceholderDataWarningProps> = ({
  placeholderData,
  serverData,
}): React.ReactElement => {
  const [query, setQuery] = useState<QueryResult<User>>({
    data: placeholderData,
    isFetching: true,
    isPlaceholderData: true,
  });

  const saveDisplayedEmail = (): void => {
    if (query.isPlaceholderData) {
      return;
    }

    window.alert(`Confirmed email: ${query.data?.email ?? "none"}`);
  };

  const completeRequest = (): void => {
    setQuery({
      data: serverData,
      isFetching: false,
      isPlaceholderData: false,
    });
  };

  return (
    <div>
      <p>Name: {query.data?.name ?? "No data"}</p>
      <p>Email: {query.data?.email ?? "No data"}</p>
      <p>
        {query.isPlaceholderData
          ? "The displayed value is temporary."
          : "The displayed value is confirmed server data."}
      </p>
      <button type="button" onClick={saveDisplayedEmail}>
        Use confirmed email
      </button>
      <button type="button" onClick={completeRequest} disabled={!query.isPlaceholderData}>
        Complete request
      </button>
    </div>
  );
};

export const PlaceholderDataReplacement: React.FC<PlaceholderDataReplacementProps> = ({
  placeholderData,
  serverData,
}): React.ReactElement => {
  const [query, setQuery] = useState<QueryResult<User>>({
    data: placeholderData,
    isFetching: true,
    isPlaceholderData: true,
  });

  const replacePlaceholder = (): void => {
    setQuery({
      data: serverData,
      isFetching: false,
      isPlaceholderData: false,
    });
  };

  return (
    <div>
      <div>
        <strong>{query.data?.name ?? "No data"}</strong>
        <span> {query.isPlaceholderData ? "(temporary)" : "(server response)"}</span>
      </div>
      <p>{query.data?.email ?? "No email"}</p>
      <button type="button" onClick={replacePlaceholder} disabled={!query.isPlaceholderData}>
        Replace placeholder
      </button>
    </div>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const PlaceholderData: React.FC = (): React.ReactElement => {
  const placeholderUser: User = {
    id: 1,
    name: "Loading User",
    email: "loading@example.com",
  };

  const johnDoe: User = {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
  };

  const janeDoe: User = {
    id: 2,
    name: "Jane Doe",
    email: "jane@example.com",
  };

  return (
    <main>
      <h1>Placeholder Data</h1>

      <h2>1. Placeholder data can render while the real query is fetching</h2>
      <BasicPlaceholderData placeholderData={placeholderUser} serverData={johnDoe} />

      <h2>2. Previous data can temporarily represent a new query</h2>
      <PreviousDataAsPlaceholder initialData={johnDoe} nextData={janeDoe} />

      <h2>3. Placeholder data is distinguishable from real query data</h2>
      <PlaceholderVsRealData placeholderData={placeholderUser} serverData={johnDoe} />

      <h2>4. Temporary data should not be treated as confirmed server data</h2>
      <PlaceholderDataWarning placeholderData={placeholderUser} serverData={johnDoe} />

      <h2>5. The placeholder is replaced when the real query resolves</h2>
      <PlaceholderDataReplacement placeholderData={placeholderUser} serverData={johnDoe} />
    </main>
  );
};

export default PlaceholderData;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// Placeholder data provides temporary display data while the real query result is loading.
// Placeholder data is different from initial data and should not be treated as authoritative server data.
// Placeholder data can keep the UI populated while a query transitions to a different resource.
// The query can explicitly distinguish placeholder data from the real server response.
// Previous data can be used as temporary placeholder content for a related query.
// Placeholder data is replaced when the real query result becomes available.
// UI actions that require confirmed server state should account for the placeholder state.
