/**
 * Query Key
 * =========
 *
 * A query key uniquely identifies a piece of server state in a query-management system.
 * It describes which remote resource a query represents and is used to distinguish one
 * query from another.
 *
 * Query keys are typically structured values rather than arbitrary strings. A key can
 * contain a resource name and the parameters that determine which representation of that
 * resource is being requested. For example, ["user", 1] and ["user", 2] identify different
 * users, while ["users", {role: "admin"}] and ["users", {role: "customer"}] identify
 * different filtered collections.
 *
 * Query keys also form the identity used for caching. If two queries have the same logical
 * key, a query-management library can treat them as the same server-state resource. If a
 * value affects the requested data but is omitted from the key, different server responses
 * can incorrectly share one cache entry.
 */

import React, { useState } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface User {
  readonly id: number;
  readonly name: string;
}

export interface QueryKeyExampleProps {
  readonly userId: number;
}

export interface FilteredUsersQueryKeyProps {
  readonly role: string;
}

export interface SearchQueryKeyProps {
  readonly searchTerm: string;
  readonly page: number;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * Demonstrates a basic resource query key.
 *
 * The resource name identifies the kind of server data while the user ID identifies
 * the specific resource. Changing the ID therefore produces a different query key.
 */
export const BasicQueryKey: React.FC<QueryKeyExampleProps> = ({ userId }: QueryKeyExampleProps): React.ReactElement => {
  const queryKey: readonly [string, number] = ["user", userId];

  return (
    <div>
      <p>Query key: {JSON.stringify(queryKey)}</p>
      <p>Resource: user</p>
      <p>User ID: {userId}</p>
    </div>
  );
};

/**
 * Demonstrates query keys containing multiple resource parameters.
 *
 * Every value that changes which server data is requested should be represented by
 * the key. Here, both the search term and page number contribute to query identity.
 */
export const ParameterizedQueryKey: React.FC<SearchQueryKeyProps> = ({
  searchTerm,
  page,
}: SearchQueryKeyProps): React.ReactElement => {
  const queryKey: readonly [string, { readonly searchTerm: string; readonly page: number }] = [
    "users",
    {
      searchTerm,
      page,
    },
  ];

  return (
    <div>
      <p>Search term: {searchTerm}</p>
      <p>Page: {page}</p>
      <p>Query key: {JSON.stringify(queryKey)}</p>
    </div>
  );
};

/**
 * Demonstrates a query key for filtered server data.
 *
 * The filter is part of the server request, so it must also be part of the query identity.
 * Different filters therefore represent different server-state resources.
 */
export const FilteredQueryKey: React.FC<FilteredUsersQueryKeyProps> = ({
  role,
}: FilteredUsersQueryKeyProps): React.ReactElement => {
  const queryKey: readonly [string, { readonly role: string }] = [
    "users",
    {
      role,
    },
  ];

  return (
    <div>
      <p>Filter: {role}</p>
      <p>Query key: {JSON.stringify(queryKey)}</p>
    </div>
  );
};

/**
 * Demonstrates the effect of omitting a parameter from a query key.
 *
 * The component intentionally changes the requested user while keeping the key fixed.
 * This illustrates the conceptual problem: if a query-management system receives the same
 * key for different server resources, it cannot distinguish their cached results by that key.
 */
export const IncompleteQueryKey: React.FC = (): React.ReactElement => {
  const [userId, setUserId] = useState<number>(1);

  const queryKey: readonly [string] = ["user"];

  const changeUser = (): void => {
    setUserId((currentUserId: number): number => (currentUserId === 1 ? 2 : 1));
  };

  return (
    <div>
      <p>Requested user ID: {userId}</p>
      <p>Incorrect query key: {JSON.stringify(queryKey)}</p>
      <p>The user ID affects the requested data but is missing from the key.</p>
      <button type="button" onClick={changeUser}>
        Change User
      </button>
    </div>
  );
};

/**
 * Demonstrates that query-key structure should describe the server resource rather than
 * represent unrelated UI state.
 *
 * The selected tab does not change the requested user resource, so it does not belong
 * in this particular query key merely because it exists in the component.
 */
export const QueryKeyScope: React.FC<QueryKeyExampleProps> = ({ userId }: QueryKeyExampleProps): React.ReactElement => {
  const queryKey: readonly [string, number] = ["user", userId];
  const selectedTab: string = "profile";

  return (
    <div>
      <p>Selected UI tab: {selectedTab}</p>
      <p>Query key: {JSON.stringify(queryKey)}</p>
      <p>UI state belongs in the key only when it actually changes the server data represented by the query.</p>
    </div>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const QueryKey: React.FC = (): React.ReactElement => {
  return (
    <main>
      <h1>Query Key</h1>

      <h2>1. Basic resource query key</h2>
      <BasicQueryKey userId={1} />

      <h2>2. Query key with multiple parameters</h2>
      <ParameterizedQueryKey searchTerm="react" page={2} />

      <h2>3. Query key for filtered data</h2>
      <FilteredQueryKey role="admin" />

      <h2>4. Incomplete query key</h2>
      <IncompleteQueryKey />

      <h2>5. Query key scope</h2>
      <QueryKeyScope userId={1} />
    </main>
  );
};

export default QueryKey;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// A query key identifies a specific piece of server state.
// Query keys should contain the values that determine which server data is requested.
// Resource identifiers such as IDs commonly form part of the query key.
// Search terms, pagination parameters, and filters belong in the key when they change the server response.
// Omitting a data-determining parameter can cause different resources to share the same query identity.
// Unrelated UI state should not be added to a query key when it does not affect the requested server data.
// Query keys provide the identity used by query-management systems for caching and retrieving server state.
