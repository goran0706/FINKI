/**
 * Composite Components
 * =====================
 *
 * Composite components are components that combine multiple smaller components
 * into a cohesive UI unit with a shared purpose. Instead of exposing every
 * internal implementation detail, the composite component coordinates its
 * constituent parts and presents a higher-level interface to its parent.
 *
 * A composite component can manage how its internal components communicate,
 * which props they receive, and how they are arranged. This allows a parent
 * component to work with one meaningful component instead of coordinating
 * several implementation details itself.
 *
 * Composite components are useful when a group of components consistently
 * appears together and represents one conceptual piece of the interface.
 * The goal is not simply to create deeper component trees, but to encapsulate
 * a meaningful group of related UI responsibilities.
 *
 * Composition remains the mechanism used to build the composite component.
 * The distinction is that the resulting component represents a higher-level
 * UI unit with its own coherent responsibility.
 */

import { type FC, type ReactElement } from "react";

// ---------------------------------------------------------------------
// 1. Component Definitions
// ---------------------------------------------------------------------

interface User {
  readonly name: string;
  readonly email: string;
  readonly role: string;
}

interface UserHeaderProps {
  readonly name: string;
  readonly role: string;
}

interface UserDetailsProps {
  readonly email: string;
}

interface UserActionsProps {
  readonly onEdit: () => void;
  readonly onRemove: () => void;
}

interface UserPanelProps {
  readonly user: User;
  readonly onEdit: () => void;
  readonly onRemove: () => void;
}

/**
 * Displays the identifying information for a user.
 *
 * UserHeader is intentionally focused on the header portion of the interface.
 * It does not manage the details or actions belonging to the surrounding panel.
 */
const UserHeader: FC<UserHeaderProps> = ({ name, role }): ReactElement => {
  return (
    <header>
      <h2>{name}</h2>
      <p>{role}</p>
    </header>
  );
};

/**
 * Displays secondary information about a user.
 *
 * This component receives only the data required for its own responsibility.
 */
const UserDetails: FC<UserDetailsProps> = ({ email }): ReactElement => {
  return (
    <div>
      <strong>Email</strong>
      <p>{email}</p>
    </div>
  );
};

/**
 * Displays actions that can be performed on a user.
 *
 * The action behavior is supplied by the parent rather than implemented
 * inside this presentational component.
 */
const UserActions: FC<UserActionsProps> = ({ onEdit, onRemove }): ReactElement => {
  return (
    <footer>
      <button type="button" onClick={onEdit}>
        Edit
      </button>
      <button type="button" onClick={onRemove}>
        Remove
      </button>
    </footer>
  );
};

// ---------------------------------------------------------------------
// 2. Composite Component
// ---------------------------------------------------------------------

/**
 * Combines several focused components into one cohesive user panel.
 *
 * The parent of UserPanel does not need to know that the panel internally
 * consists of a header, details section, and action area. Those implementation
 * details are coordinated by the composite component.
 */
export const UserPanel: FC<UserPanelProps> = ({ user, onEdit, onRemove }): ReactElement => {
  return (
    <article>
      <UserHeader name={user.name} role={user.role} />
      <UserDetails email={user.email} />
      <UserActions onEdit={onEdit} onRemove={onRemove} />
    </article>
  );
};

// ---------------------------------------------------------------------
// 3. Using the Composite Component
// ---------------------------------------------------------------------

interface UserDashboardProps {
  readonly user: User;
}

export const UserDashboard: FC<UserDashboardProps> = ({ user }): ReactElement => {
  const handleEdit = (): void => {
    console.log(`Editing ${user.name}.`);
  };

  const handleRemove = (): void => {
    console.log(`Removing ${user.name}.`);
  };

  return (
    <section>
      <h1>User Dashboard</h1>
      <UserPanel user={user} onEdit={handleEdit} onRemove={handleRemove} />
    </section>
  );
};

// ---------------------------------------------------------------------
// 4. Reusing the Composite Component
// ---------------------------------------------------------------------

interface UserDashboardListProps {
  readonly users: readonly User[];
}

export const UserDashboardList: FC<UserDashboardListProps> = ({ users }): ReactElement => {
  return (
    <section>
      <h1>User Panels</h1>

      {users.map((user: User): ReactElement => (
        <UserPanel
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
// 5. Main Container Component
// ---------------------------------------------------------------------

export const CompositeComponentsDemo: FC = (): ReactElement => {
  const user: User = {
    name: "John Doe",
    email: "john.doe@example.com",
    role: "Administrator",
  };

  const users: readonly User[] = [
    user,
    {
      name: "Jane Doe",
      email: "jane.doe@example.com",
      role: "Editor",
    },
  ];

  return (
    <main>
      <h1>Composite Components</h1>
      <UserDashboard user={user} />
      <UserDashboardList users={users} />
    </main>
  );
};

export default CompositeComponentsDemo;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - A composite component combines several focused components into one cohesive UI unit.
// - Internal components can each maintain a narrow and clearly defined responsibility.
// - The composite component coordinates how its internal parts are arranged and supplied with data.
// - Parent components can use the composite component without knowing its internal structure.
// - Composite components create higher-level UI abstractions from smaller components.
// - Composition is the mechanism used to construct the composite component.
// - A composite component should represent a meaningful conceptual unit rather than arbitrary grouping.
