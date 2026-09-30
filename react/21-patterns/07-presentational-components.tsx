/**
 * Presentational Components
 * =========================
 *
 * Presentational components primarily describe how data and UI should be rendered.
 * They receive the values and callbacks they need through props and focus on visual structure,
 * while avoiding responsibility for where application data comes from or how it is obtained.
 */

import { type FC, type ReactElement, type ReactNode } from "react";

// ---------------------------------------------------------------------
// 1. Basic presentational component
// ---------------------------------------------------------------------

interface User {
  readonly name: string;
  readonly email: string;
}

interface UserCardProps {
  readonly user: User;
}

export const UserCard: FC<UserCardProps> = ({ user }): ReactElement => (
  <article>
    <h2>{user.name}</h2>
    <p>{user.email}</p>
  </article>
);

// ---------------------------------------------------------------------
// 2. Presentational component with callbacks
// ---------------------------------------------------------------------

interface UserActionsProps {
  readonly onEdit: () => void;
  readonly onDelete: () => void;
}

export const UserActions: FC<UserActionsProps> = ({ onEdit, onDelete }): ReactElement => (
  <div>
    <button type="button" onClick={onEdit}>
      Edit
    </button>
    <button type="button" onClick={onDelete}>
      Delete
    </button>
  </div>
);

// The component defines how actions are rendered.
// The caller decides what should happen when an action is triggered.

// ---------------------------------------------------------------------
// 3. Presentational component with multiple props
// ---------------------------------------------------------------------

interface ProfileCardProps {
  readonly name: string;
  readonly email: string;
  readonly role: string;
  readonly avatar?: ReactNode;
}

export const ProfileCard: FC<ProfileCardProps> = ({ name, email, role, avatar }): ReactElement => (
  <article>
    {avatar && <div>{avatar}</div>}
    <h2>{name}</h2>
    <p>{email}</p>
    <p>{role}</p>
  </article>
);

// ---------------------------------------------------------------------
// 4. Presentational component with explicit state from props
// ---------------------------------------------------------------------

interface StatusBadgeProps {
  readonly label: string;
  readonly active: boolean;
}

export const StatusBadge: FC<StatusBadgeProps> = ({ label, active }): ReactElement => (
  <span aria-label={`${label}: ${active ? "active" : "inactive"}`}>
    {label}: {active ? "Active" : "Inactive"}
  </span>
);

// The component renders the supplied state.
// It does not determine why the state is active or inactive.

// ---------------------------------------------------------------------
// 5. Reusable presentational list
// ---------------------------------------------------------------------

interface UserListProps {
  readonly users: readonly User[];
  readonly onSelect: (user: User) => void;
}

export const UserList: FC<UserListProps> = ({ users, onSelect }): ReactElement => (
  <ul>
    {users.map((user) => (
      <li key={user.email}>
        <button type="button" onClick={() => onSelect(user)}>
          {user.name}
        </button>
      </li>
    ))}
  </ul>
);

// ---------------------------------------------------------------------
// 6. Composing presentational components
// ---------------------------------------------------------------------

interface UserProfileProps {
  readonly user: User;
  readonly role: string;
  readonly active: boolean;
  readonly onEdit: () => void;
}

export const UserProfile: FC<UserProfileProps> = ({ user, role, active, onEdit }): ReactElement => (
  <article>
    <UserCard user={user} />
    <StatusBadge label="Account" active={active} />
    <p>Role: {role}</p>
    <UserActions onEdit={onEdit} onDelete={() => undefined} />
  </article>
);

// ---------------------------------------------------------------------
// 7. Presentational components receive prepared data
// ---------------------------------------------------------------------

const users: readonly User[] = [
  { name: "John Doe", email: "john@example.com" },
  { name: "Jane Doe", email: "jane@example.com" },
];

export const PresentationalComponentsDemo: FC = (): ReactElement => (
  <div>
    <UserList users={users} onSelect={(user) => console.log("Selected:", user.name)} />

    <UserProfile user={users[0]} role="Administrator" active onEdit={() => console.log("Edit profile")} />
  </div>
);

// The data is already available when the presentational components render.
// The components do not fetch the data or decide how it should be obtained.

// ---------------------------------------------------------------------
// 8. Presentation versus responsibility
// ---------------------------------------------------------------------

interface MessageProps {
  readonly title: string;
  readonly message: string;
  readonly action?: ReactNode;
}

export const Message: FC<MessageProps> = ({ title, message, action }): ReactElement => (
  <section>
    <h2>{title}</h2>
    <p>{message}</p>
    {action && <div>{action}</div>}
  </section>
);

export const EmptyUsersMessage: FC = (): ReactElement => (
  <Message
    title="No users"
    message="There are currently no users to display."
    action={<button type="button">Refresh</button>}
  />
);

// A presentational component can contain rendering logic such as conditional markup.
// What it avoids is responsibility for obtaining or coordinating the underlying application data.

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Presentational components primarily focus on rendering UI from the props they receive.
// - They generally do not own responsibility for obtaining application data.
// - Event callbacks can be received through props so callers control the resulting behavior.
// - Presentational components can compose other presentational components.
// - They can contain conditional rendering and other UI-specific logic.
// - Keeping data acquisition outside the component makes the rendered UI easier to reuse with different data.
// - A component can be presentational without being completely stateless or free of all logic.
