/**
 * Component Composition
 * =====================
 *
 * Component composition is the practice of building a component from smaller,
 * focused components rather than placing all rendering and behavior in one
 * large component. Each component owns a clear responsibility while the
 * parent component composes those pieces into a larger interface.
 *
 * Composition is one of React's fundamental component design techniques.
 * A parent can render child components, pass data through props, and arrange
 * those children into a meaningful UI without requiring the child components
 * to know how they are used.
 *
 * Good composition keeps components focused and reusable. Instead of creating
 * one component that knows how to render an entire page, an application can
 * compose smaller components such as a header, user summary, action area, and
 * footer into the required screen.
 *
 * Composition is different from inheritance. React components generally
 * become reusable by being combined with other components rather than by
 * extending component classes to inherit rendering behavior.
 */

import { type FC, type ReactElement } from "react";

// ---------------------------------------------------------------------
// 1. Component Definitions
// ---------------------------------------------------------------------

interface User {
  readonly name: string;
  readonly email: string;
}

interface UserSummaryProps {
  readonly user: User;
}

interface UserActionsProps {
  readonly onEdit: () => void;
  readonly onRemove: () => void;
}

interface UserCardProps {
  readonly user: User;
  readonly onEdit: () => void;
  readonly onRemove: () => void;
}

/**
 * A small component responsible only for displaying user information.
 *
 * It does not know where the user data came from or how the surrounding
 * interface is structured. Its responsibility is limited to presentation
 * of the supplied user data.
 */
const UserSummary: FC<UserSummaryProps> = ({ user }): ReactElement => {
  return (
    <div>
      <h2>{user.name}</h2>
      <p>{user.email}</p>
    </div>
  );
};

/**
 * A small component responsible only for rendering user actions.
 *
 * The component receives callbacks through props instead of deciding what
 * should happen when an action is triggered.
 */
const UserActions: FC<UserActionsProps> = ({ onEdit, onRemove }): ReactElement => {
  return (
    <div>
      <button type="button" onClick={onEdit}>
        Edit
      </button>
      <button type="button" onClick={onRemove}>
        Remove
      </button>
    </div>
  );
};

/**
 * Composes UserSummary and UserActions into a larger user-oriented component.
 *
 * UserCard does not duplicate the implementation details of either child.
 * Instead, it coordinates the smaller components and supplies the props
 * required by each one.
 */
const UserCard: FC<UserCardProps> = ({ user, onEdit, onRemove }): ReactElement => {
  return (
    <article>
      <UserSummary user={user} />
      <UserActions onEdit={onEdit} onRemove={onRemove} />
    </article>
  );
};

// ---------------------------------------------------------------------
// 2. Composing Components
// ---------------------------------------------------------------------

interface UserProfileProps {
  readonly user: User;
}

export const UserProfile: FC<UserProfileProps> = ({ user }): ReactElement => {
  const handleEdit = (): void => {
    console.log(`Editing ${user.name}.`);
  };

  const handleRemove = (): void => {
    console.log(`Removing ${user.name}.`);
  };

  return (
    <section>
      <h1>User Profile</h1>
      <UserCard user={user} onEdit={handleEdit} onRemove={handleRemove} />
    </section>
  );
};

// ---------------------------------------------------------------------
// 3. Reusing Composed Components
// ---------------------------------------------------------------------

interface UserListProps {
  readonly users: readonly User[];
}

export const UserList: FC<UserListProps> = ({ users }): ReactElement => {
  return (
    <section>
      <h1>Users</h1>

      {users.map((user: User): ReactElement => (
        <UserCard
          key={user.email}
          user={user}
          onEdit={() => console.log(`Editing ${user.name}.`)}
          onRemove={() => console.log(`Removing ${user.name}.`)}
        />
      ))}
    </section>
  );
};

// ---------------------------------------------------------------------
// 4. Composition With Different Parent Contexts
// ---------------------------------------------------------------------

export const ComponentCompositionDemo: FC = (): ReactElement => {
  const user: User = {
    name: "John Doe",
    email: "john.doe@example.com",
  };

  const users: readonly User[] = [
    user,
    {
      name: "Jane Doe",
      email: "jane.doe@example.com",
    },
  ];

  return (
    <main>
      <h1>Component Composition</h1>
      <UserProfile user={user} />
      <UserList users={users} />
    </main>
  );
};

export default ComponentCompositionDemo;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Component composition builds larger components from smaller focused components.
// - Each component should have a clear responsibility within the composed interface.
// - Parents can pass data and behavior to children through props.
// - Child components do not need to know how or where they are composed.
// - Composition allows the same focused components to be reused in different parent components.
// - Composition is a primary React reuse technique and generally avoids inheritance-based component reuse.
