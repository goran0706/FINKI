/**
 * Container Components
 * ====================
 *
 * Container components are responsible for coordinating data, state, or application logic and
 * passing the resulting values to other components. They focus on what information is needed
 * and how it is obtained, while the components they render can focus on displaying that information.
 */

import { type FC, type ReactElement } from "react";

// ---------------------------------------------------------------------
// 1. Container responsibilities
// ---------------------------------------------------------------------

interface User {
  readonly id: number;
  readonly name: string;
  readonly email: string;
}

interface UserListProps {
  readonly users: readonly User[];
}

export const UserList: FC<UserListProps> = ({ users }): ReactElement => (
  <ul>
    {users.map((user) => (
      <li key={user.id}>
        <strong>{user.name}</strong>
        <span> — {user.email}</span>
      </li>
    ))}
  </ul>
);

// ---------------------------------------------------------------------
// 2. Container supplying data
// ---------------------------------------------------------------------

export const UserListContainer: FC = (): ReactElement => {
  const users: readonly User[] = [
    { id: 1, name: "John Doe", email: "john@example.com" },
    { id: 2, name: "Jane Doe", email: "jane@example.com" },
  ];

  return <UserList users={users} />;
};

// The container determines which data is available.
// The child component determines how that data is rendered.

// ---------------------------------------------------------------------
// 3. Container with derived data
// ---------------------------------------------------------------------

interface UserSummaryProps {
  readonly totalUsers: number;
  readonly activeUsers: number;
}

export const UserSummary: FC<UserSummaryProps> = ({ totalUsers, activeUsers }): ReactElement => (
  <section>
    <p>Total users: {totalUsers}</p>
    <p>Active users: {activeUsers}</p>
  </section>
);

export const UserSummaryContainer: FC = (): ReactElement => {
  const users = [
    { id: 1, name: "John Doe", active: true },
    { id: 2, name: "Jane Doe", active: false },
    { id: 3, name: "Alex Smith", active: true },
  ];

  const totalUsers = users.length;
  const activeUsers = users.filter((user) => user.active).length;

  return <UserSummary totalUsers={totalUsers} activeUsers={activeUsers} />;
};

// ---------------------------------------------------------------------
// 4. Container with state
// ---------------------------------------------------------------------

import { useState } from "react";

interface UserFilterProps {
  readonly users: readonly User[];
}

export const UserFilter: FC<UserFilterProps> = ({ users }): ReactElement => (
  <ul>
    {users.map((user) => (
      <li key={user.id}>{user.name}</li>
    ))}
  </ul>
);

export const UserFilterContainer: FC = (): ReactElement => {
  const [query, setQuery] = useState("");

  const users: readonly User[] = [
    { id: 1, name: "John Doe", email: "john@example.com" },
    { id: 2, name: "Jane Doe", email: "jane@example.com" },
    { id: 3, name: "Alex Smith", email: "alex@example.com" },
  ];

  const filteredUsers = users.filter((user) => user.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <section>
      <label>
        Search
        <input value={query} onChange={(event) => setQuery(event.target.value)} />
      </label>
      <UserFilter users={filteredUsers} />
    </section>
  );
};

// ---------------------------------------------------------------------
// 5. Container coordinating multiple components
// ---------------------------------------------------------------------

interface UserDashboardProps {
  readonly users: readonly User[];
  readonly selectedUser?: User;
}

export const UserDashboard: FC<UserDashboardProps> = ({ users, selectedUser }): ReactElement => (
  <section>
    <UserList users={users} />

    {selectedUser && (
      <aside>
        <h2>Selected User</h2>
        <p>{selectedUser.name}</p>
        <p>{selectedUser.email}</p>
      </aside>
    )}
  </section>
);

export const UserDashboardContainer: FC = (): ReactElement => {
  const users: readonly User[] = [
    { id: 1, name: "John Doe", email: "john@example.com" },
    { id: 2, name: "Jane Doe", email: "jane@example.com" },
  ];

  const selectedUser = users[0];

  return <UserDashboard users={users} selectedUser={selectedUser} />;
};

// ---------------------------------------------------------------------
// 6. Container and presentation responsibilities
// ---------------------------------------------------------------------

interface AccountData {
  readonly name: string;
  readonly email: string;
  readonly role: string;
}

interface AccountViewProps {
  readonly account: AccountData;
}

export const AccountView: FC<AccountViewProps> = ({ account }): ReactElement => (
  <article>
    <h2>{account.name}</h2>
    <p>{account.email}</p>
    <p>{account.role}</p>
  </article>
);

export const AccountContainer: FC = (): ReactElement => {
  const account: AccountData = {
    name: "John Doe",
    email: "john@example.com",
    role: "Administrator",
  };

  return <AccountView account={account} />;
};

// The container owns the data or coordination required by the view.
// The view receives explicit props and does not need to know where the data came from.

// ---------------------------------------------------------------------
// 7. Complete container example
// ---------------------------------------------------------------------

export const ContainerComponentsDemo: FC = (): ReactElement => (
  <div>
    <UserListContainer />
    <UserSummaryContainer />
    <UserFilterContainer />
    <UserDashboardContainer />
    <AccountContainer />
  </div>
);

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Container components coordinate data, state, derived values, or application logic.
// - They commonly obtain or prepare data before passing it to child components through props.
// - Containers can own local state when that state is part of their coordination responsibility.
// - A container can coordinate multiple child components and provide each with the required data.
// - Keeping data coordination separate from rendering can make component responsibilities clearer.
// - Container components are a pattern for organizing responsibilities, not a requirement for every component.
