/**
 * Container-Presentational Pattern
 * ================================
 *
 * The container-presentational pattern separates data coordination from UI rendering.
 * Container components manage data, state, and application logic, while presentational
 * components receive prepared values and callbacks through props and focus on rendering them.
 */

import { useMemo, useState, type FC, type ReactElement } from "react";

// ---------------------------------------------------------------------
// 1. Presentational component
// ---------------------------------------------------------------------

interface User {
  readonly id: number;
  readonly name: string;
  readonly email: string;
  readonly active: boolean;
}

interface UserListProps {
  readonly users: readonly User[];
  readonly onSelect: (user: User) => void;
}

export const UserList: FC<UserListProps> = ({ users, onSelect }): ReactElement => (
  <ul>
    {users.map((user) => (
      <li key={user.id}>
        <button type="button" onClick={() => onSelect(user)}>
          {user.name}
        </button>
        <span> — {user.email}</span>
      </li>
    ))}
  </ul>
);

// ---------------------------------------------------------------------
// 2. Presentational detail view
// ---------------------------------------------------------------------

interface UserDetailsProps {
  readonly user: User | null;
}

export const UserDetails: FC<UserDetailsProps> = ({ user }): ReactElement => {
  if (!user) {
    return <p>Select a user to view their details.</p>;
  }

  return (
    <article>
      <h2>{user.name}</h2>
      <p>{user.email}</p>
      <p>Status: {user.active ? "Active" : "Inactive"}</p>
    </article>
  );
};

// ---------------------------------------------------------------------
// 3. Container component
// ---------------------------------------------------------------------

const initialUsers: readonly User[] = [
  { id: 1, name: "John Doe", email: "john@example.com", active: true },
  { id: 2, name: "Jane Doe", email: "jane@example.com", active: false },
  { id: 3, name: "Alex Smith", email: "alex@example.com", active: true },
];

export const UserContainer: FC = (): ReactElement => {
  const [users] = useState<readonly User[]>(initialUsers);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  const selectedUser = useMemo(() => users.find((user) => user.id === selectedUserId) ?? null, [users, selectedUserId]);

  const handleSelect = (user: User): void => {
    setSelectedUserId(user.id);
  };

  return (
    <section>
      <UserList users={users} onSelect={handleSelect} />
      <UserDetails user={selectedUser} />
    </section>
  );
};

// The container owns the state and selection logic.
// The presentational components receive the resulting data and callbacks.

// ---------------------------------------------------------------------
// 4. Separating filtering logic from rendering
// ---------------------------------------------------------------------

interface UserSearchProps {
  readonly query: string;
  readonly onQueryChange: (query: string) => void;
}

export const UserSearch: FC<UserSearchProps> = ({ query, onQueryChange }): ReactElement => (
  <label>
    Search users
    <input type="search" value={query} onChange={(event) => onQueryChange(event.target.value)} />
  </label>
);

interface FilteredUserListProps {
  readonly users: readonly User[];
}

export const FilteredUserList: FC<FilteredUserListProps> = ({ users }): ReactElement => (
  <ul>
    {users.map((user) => (
      <li key={user.id}>{user.name}</li>
    ))}
  </ul>
);

export const UserSearchContainer: FC = (): ReactElement => {
  const [query, setQuery] = useState("");

  const filteredUsers = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return initialUsers.filter((user) => user.name.toLowerCase().includes(normalizedQuery));
  }, [query]);

  return (
    <section>
      <UserSearch query={query} onQueryChange={setQuery} />
      <FilteredUserList users={filteredUsers} />
    </section>
  );
};

// ---------------------------------------------------------------------
// 5. Container coordinating multiple presentational components
// ---------------------------------------------------------------------

interface UserDashboardProps {
  readonly users: readonly User[];
  readonly selectedUser: User | null;
  readonly onSelect: (user: User) => void;
  readonly query: string;
  readonly onQueryChange: (query: string) => void;
}

export const UserDashboard: FC<UserDashboardProps> = ({
  users,
  selectedUser,
  onSelect,
  query,
  onQueryChange,
}): ReactElement => (
  <div>
    <UserSearch query={query} onQueryChange={onQueryChange} />
    <UserList users={users} onSelect={onSelect} />
    <UserDetails user={selectedUser} />
  </div>
);

// ---------------------------------------------------------------------
// 6. Complete container-presentational example
// ---------------------------------------------------------------------

export const ContainerPresentationalDemo: FC = (): ReactElement => {
  const [query, setQuery] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  const filteredUsers = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return initialUsers.filter((user) => user.name.toLowerCase().includes(normalizedQuery));
  }, [query]);

  const selectedUser = initialUsers.find((user) => user.id === selectedUserId) ?? null;

  const handleSelect = (user: User): void => {
    setSelectedUserId(user.id);
  };

  return (
    <UserDashboard
      users={filteredUsers}
      selectedUser={selectedUser}
      onSelect={handleSelect}
      query={query}
      onQueryChange={setQuery}
    />
  );
};

// The container owns query state, selection state, filtering, and event coordination.
// The presentational dashboard and its child components receive everything they need through props.

// ---------------------------------------------------------------------
// 7. Responsibility boundary
// ---------------------------------------------------------------------

interface Account {
  readonly name: string;
  readonly email: string;
}

interface AccountViewProps {
  readonly account: Account;
  readonly onEdit: () => void;
}

export const AccountView: FC<AccountViewProps> = ({ account, onEdit }): ReactElement => (
  <article>
    <h2>{account.name}</h2>
    <p>{account.email}</p>
    <button type="button" onClick={onEdit}>
      Edit
    </button>
  </article>
);

export const AccountContainer: FC = (): ReactElement => {
  const account: Account = {
    name: "John Doe",
    email: "john@example.com",
  };

  const handleEdit = (): void => {
    console.log("Edit account");
  };

  return <AccountView account={account} onEdit={handleEdit} />;
};

// The boundary does not require a specific component hierarchy.
// Its purpose is to make the ownership of data and rendering responsibilities explicit.

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - The container-presentational pattern separates data coordination from UI rendering.
// - Containers can own state, derive data, handle events, and coordinate application logic.
// - Presentational components receive prepared data and callbacks through props.
// - Presentational components focus on describing how the supplied data should appear.
// - The separation does not require presentational components to contain zero logic.
// - The pattern is useful when separating application concerns from reusable rendering concerns.
