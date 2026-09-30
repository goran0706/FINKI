/**
 * Component Contract
 * ===================
 *
 * A component contract defines the rules a component promises to follow when it is used.
 * The contract includes accepted props, rendered behavior, state expectations, composition
 * points, and callback semantics so consumers can rely on predictable behavior.
 */

// ---------------------------------------------------------------------
// 1. Basic component contract
// ---------------------------------------------------------------------

import { type FC, type ReactElement, type ReactNode } from "react";

interface User {
  readonly id: number;
  readonly name: string;
  readonly email: string;
}

interface UserCardProps {
  readonly user: User;
}

export const UserCard: FC<UserCardProps> = ({ user }): ReactElement => {
  return (
    <article>
      <h2>{user.name}</h2>
      <p>{user.email}</p>
    </article>
  );
};

export const BasicContractExample: FC = (): ReactElement => {
  const user: User = {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
  };

  return <UserCard user={user} />;
};

// ---------------------------------------------------------------------
// 2. Required props define mandatory inputs
// ---------------------------------------------------------------------

interface UserSummaryProps {
  readonly name: string;
  readonly email: string;
}

export const UserSummary: FC<UserSummaryProps> = ({ name, email }): ReactElement => {
  return (
    <section>
      <h2>{name}</h2>
      <p>{email}</p>
    </section>
  );
};

export const RequiredPropsExample: FC = (): ReactElement => {
  return <UserSummary name="John Doe" email="john.doe@example.com" />;
};

// ---------------------------------------------------------------------
// 3. Optional props define supported variation
// ---------------------------------------------------------------------

interface StatusBadgeProps {
  readonly label: string;
  readonly status?: "active" | "inactive" | "pending";
}

export const StatusBadge: FC<StatusBadgeProps> = ({ label, status = "active" }): ReactElement => {
  return (
    <span data-status={status}>
      {label}: {status}
    </span>
  );
};

export const OptionalPropsExample: FC = (): ReactElement => {
  return (
    <div>
      <StatusBadge label="Account" />
      <StatusBadge label="Verification" status="pending" />
    </div>
  );
};

// ---------------------------------------------------------------------
// 4. Callback contracts define interaction behavior
// ---------------------------------------------------------------------

interface SaveButtonProps {
  readonly disabled?: boolean;
  readonly onSave: () => void;
}

export const SaveButton: FC<SaveButtonProps> = ({ disabled = false, onSave }): ReactElement => {
  return (
    <button type="button" disabled={disabled} onClick={onSave}>
      Save
    </button>
  );
};

export const CallbackContractExample: FC = (): ReactElement => {
  const handleSave = (): void => {
    console.log("Saving account.");
  };

  return <SaveButton onSave={handleSave} />;
};

// ---------------------------------------------------------------------
// 5. Callback arguments are part of the contract
// ---------------------------------------------------------------------

interface UserActionsProps {
  readonly user: User;
  readonly onEdit: (user: User) => void;
  readonly onDelete: (user: User) => void;
}

export const UserActions: FC<UserActionsProps> = ({ user, onEdit, onDelete }): ReactElement => {
  return (
    <div>
      <button type="button" onClick={() => onEdit(user)}>
        Edit
      </button>
      <button type="button" onClick={() => onDelete(user)}>
        Delete
      </button>
    </div>
  );
};

export const CallbackArgumentExample: FC = (): ReactElement => {
  const user: User = {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
  };

  const handleEdit = (selectedUser: User): void => {
    console.log("Editing:", selectedUser.name);
  };

  const handleDelete = (selectedUser: User): void => {
    console.log("Deleting:", selectedUser.name);
  };

  return <UserActions user={user} onEdit={handleEdit} onDelete={handleDelete} />;
};

// ---------------------------------------------------------------------
// 6. Controlled component contracts
// ---------------------------------------------------------------------

interface TextInputProps {
  readonly value: string;
  readonly onChange: (value: string) => void;
  readonly placeholder?: string;
}

export const TextInput: FC<TextInputProps> = ({ value, onChange, placeholder }): ReactElement => {
  return <input value={value} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} />;
};

export const ControlledContractExample: FC = (): ReactElement => {
  const handleChange = (value: string): void => {
    console.log("Input value:", value);
  };

  return <TextInput value="John Doe" onChange={handleChange} placeholder="Enter a name" />;
};

// ---------------------------------------------------------------------
// 7. Children define composition contracts
// ---------------------------------------------------------------------

interface PanelProps {
  readonly title: string;
  readonly children: ReactNode;
}

export const Panel: FC<PanelProps> = ({ title, children }): ReactElement => {
  return (
    <section>
      <header>
        <h2>{title}</h2>
      </header>
      <div>{children}</div>
    </section>
  );
};

export const ChildrenContractExample: FC = (): ReactElement => {
  return (
    <Panel title="Account">
      <p>John Doe</p>
      <p>john.doe@example.com</p>
    </Panel>
  );
};

// ---------------------------------------------------------------------
// 8. Render contracts define customization boundaries
// ---------------------------------------------------------------------

interface UserListProps {
  readonly users: readonly User[];
  readonly renderUser: (user: User) => ReactNode;
  readonly emptyState?: ReactNode;
}

export const UserList: FC<UserListProps> = ({ users, renderUser, emptyState }): ReactElement => {
  if (users.length === 0) {
    return <>{emptyState ?? <p>No users found.</p>}</>;
  }

  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>{renderUser(user)}</li>
      ))}
    </ul>
  );
};

export const RenderContractExample: FC = (): ReactElement => {
  const users: readonly User[] = [
    {
      id: 1,
      name: "John Doe",
      email: "john.doe@example.com",
    },
    {
      id: 2,
      name: "Jane Doe",
      email: "jane.doe@example.com",
    },
  ];

  return (
    <UserList
      users={users}
      renderUser={(user) => (
        <article>
          <strong>{user.name}</strong>
          <p>{user.email}</p>
        </article>
      )}
      emptyState={<p>No accounts available.</p>}
    />
  );
};

// ---------------------------------------------------------------------
// 9. Behavioral contracts should remain predictable
// ---------------------------------------------------------------------

interface ToggleProps {
  readonly enabled: boolean;
  readonly onToggle: (enabled: boolean) => void;
}

export const Toggle: FC<ToggleProps> = ({ enabled, onToggle }): ReactElement => {
  const handleClick = (): void => {
    onToggle(!enabled);
  };

  return (
    <button type="button" aria-pressed={enabled} onClick={handleClick}>
      {enabled ? "Enabled" : "Disabled"}
    </button>
  );
};

export const BehavioralContractExample: FC = (): ReactElement => {
  const handleToggle = (enabled: boolean): void => {
    console.log("Toggle state:", enabled);
  };

  return <Toggle enabled={true} onToggle={handleToggle} />;
};

// ---------------------------------------------------------------------
// 10. Composition contracts can expose extension points
// ---------------------------------------------------------------------

interface CardProps {
  readonly title: string;
  readonly actions?: ReactNode;
  readonly children: ReactNode;
}

export const Card: FC<CardProps> = ({ title, actions, children }): ReactElement => {
  return (
    <article>
      <header>
        <h2>{title}</h2>
        {actions && <div>{actions}</div>}
      </header>
      <div>{children}</div>
    </article>
  );
};

export const CompositionContractExample: FC = (): ReactElement => {
  const handleEdit = (): void => {
    console.log("Editing account.");
  };

  return (
    <Card
      title="Account"
      actions={
        <button type="button" onClick={handleEdit}>
          Edit
        </button>
      }
    >
      <p>John Doe</p>
      <p>john.doe@example.com</p>
    </Card>
  );
};

// ---------------------------------------------------------------------
// 11. Complete component contract example
// ---------------------------------------------------------------------

interface AccountCardProps {
  readonly user: User;
  readonly verified?: boolean;
  readonly onEdit: (user: User) => void;
  readonly onDelete?: (user: User) => void;
  readonly children?: ReactNode;
}

export const AccountCard: FC<AccountCardProps> = ({
  user,
  verified = false,
  onEdit,
  onDelete,
  children,
}): ReactElement => {
  return (
    <article>
      <header>
        <h2>
          {user.name} {verified && <span>Verified</span>}
        </h2>
        <p>{user.email}</p>
      </header>

      {children}

      <footer>
        <button type="button" onClick={() => onEdit(user)}>
          Edit
        </button>

        {onDelete && (
          <button type="button" onClick={() => onDelete(user)}>
            Delete
          </button>
        )}
      </footer>
    </article>
  );
};

export const AccountCardExample: FC = (): ReactElement => {
  const user: User = {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
  };

  const handleEdit = (selectedUser: User): void => {
    console.log("Editing:", selectedUser.name);
  };

  const handleDelete = (selectedUser: User): void => {
    console.log("Deleting:", selectedUser.name);
  };

  return (
    <AccountCard user={user} verified onEdit={handleEdit} onDelete={handleDelete}>
      <p>Account administrator.</p>
    </AccountCard>
  );
};

// ---------------------------------------------------------------------
// 12. Complete demonstration
// ---------------------------------------------------------------------

export const ComponentContractDemo: FC = (): ReactElement => {
  return (
    <main>
      <BasicContractExample />
      <RequiredPropsExample />
      <OptionalPropsExample />
      <CallbackContractExample />
      <CallbackArgumentExample />
      <ControlledContractExample />
      <ChildrenContractExample />
      <RenderContractExample />
      <BehavioralContractExample />
      <CompositionContractExample />
      <AccountCardExample />
    </main>
  );
};

export default ComponentContractDemo;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - A component contract defines the behavior and usage rules consumers can rely on.
// - Props describe the component's accepted inputs and distinguish required from optional configuration.
// - Callback signatures define how consumers participate in component interactions.
// - Controlled components establish a contract between externally owned state and change handlers.
// - Children and render props define explicit composition and customization boundaries.
// - Behavioral contracts should produce predictable results for the same supported inputs and interactions.
// - A component contract should expose supported extension points without requiring knowledge of internal implementation details.
// - Strong contracts make components easier to understand, compose, test, and reuse.
