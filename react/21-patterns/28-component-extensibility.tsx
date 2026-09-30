/**
 * Component Extensibility
 * =======================
 *
 * Component extensibility is the ability to adapt a component to new use cases without modifying
 * its internal implementation. Extensible components expose deliberate extension points such as
 * children, slots, render functions, callbacks, and composition while keeping their core behavior stable.
 */

// ---------------------------------------------------------------------
// 1. Extensibility through children
// ---------------------------------------------------------------------

import { type FC, type ReactElement, type ReactNode } from "react";

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

export const ChildrenExtensionExample: FC = (): ReactElement => {
  return (
    <Panel title="Account">
      <p>John Doe</p>
      <p>john.doe@example.com</p>
      <button type="button">Edit</button>
    </Panel>
  );
};

// ---------------------------------------------------------------------
// 2. Extensibility through slots
// ---------------------------------------------------------------------

interface CardProps {
  readonly title: string;
  readonly headerAction?: ReactNode;
  readonly footer?: ReactNode;
  readonly children: ReactNode;
}

export const Card: FC<CardProps> = ({ title, headerAction, footer, children }): ReactElement => {
  return (
    <article>
      <header>
        <h2>{title}</h2>
        {headerAction}
      </header>

      <div>{children}</div>

      {footer && <footer>{footer}</footer>}
    </article>
  );
};

export const SlotExtensionExample: FC = (): ReactElement => {
  const handleEdit = (): void => {
    console.log("Editing account.");
  };

  return (
    <Card
      title="Account"
      headerAction={
        <button type="button" onClick={handleEdit}>
          Edit
        </button>
      }
      footer={<p>Last updated recently.</p>}
    >
      <p>John Doe</p>
      <p>john.doe@example.com</p>
    </Card>
  );
};

// ---------------------------------------------------------------------
// 3. Extensibility through render functions
// ---------------------------------------------------------------------

interface User {
  readonly id: number;
  readonly name: string;
  readonly email: string;
}

interface UserListProps {
  readonly users: readonly User[];
  readonly renderUser: (user: User) => ReactNode;
}

export const UserList: FC<UserListProps> = ({ users, renderUser }): ReactElement => {
  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>{renderUser(user)}</li>
      ))}
    </ul>
  );
};

export const RenderFunctionExtensionExample: FC = (): ReactElement => {
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
    />
  );
};

// ---------------------------------------------------------------------
// 4. Extensibility through behavior callbacks
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

export const CallbackExtensionExample: FC = (): ReactElement => {
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
// 5. Extensibility through component slots
// ---------------------------------------------------------------------

interface ListProps {
  readonly users: readonly User[];
  readonly itemComponent?: FC<{ readonly user: User }>;
}

const DefaultUserItem: FC<{ readonly user: User }> = ({ user }): ReactElement => {
  return (
    <div>
      <strong>{user.name}</strong>
      <p>{user.email}</p>
    </div>
  );
};

export const UserListWithComponent: FC<ListProps> = ({
  users,
  itemComponent: Item = DefaultUserItem,
}): ReactElement => {
  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>
          <Item user={user} />
        </li>
      ))}
    </ul>
  );
};

const CompactUserItem: FC<{ readonly user: User }> = ({ user }): ReactElement => {
  return (
    <span>
      {user.name} ({user.email})
    </span>
  );
};

export const ComponentSlotExtensionExample: FC = (): ReactElement => {
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

  return <UserListWithComponent users={users} itemComponent={CompactUserItem} />;
};

// ---------------------------------------------------------------------
// 6. Extensibility through composition
// ---------------------------------------------------------------------

interface ButtonProps {
  readonly children: ReactNode;
  readonly disabled?: boolean;
  readonly onClick?: () => void;
}

export const Button: FC<ButtonProps> = ({ children, disabled = false, onClick }): ReactElement => {
  return (
    <button type="button" disabled={disabled} onClick={onClick}>
      {children}
    </button>
  );
};

interface ToolbarProps {
  readonly children: ReactNode;
}

export const Toolbar: FC<ToolbarProps> = ({ children }): ReactElement => {
  return <div role="toolbar">{children}</div>;
};

export const CompositionExtensionExample: FC = (): ReactElement => {
  const handleSave = (): void => {
    console.log("Saving account.");
  };

  const handleCancel = (): void => {
    console.log("Cancelling edit.");
  };

  return (
    <Toolbar>
      <Button onClick={handleSave}>Save</Button>
      <Button onClick={handleCancel}>Cancel</Button>
    </Toolbar>
  );
};

// ---------------------------------------------------------------------
// 7. Extensibility through controlled state
// ---------------------------------------------------------------------

interface TextInputProps {
  readonly value: string;
  readonly onChange: (value: string) => void;
  readonly placeholder?: string;
}

export const TextInput: FC<TextInputProps> = ({ value, onChange, placeholder }): ReactElement => {
  return <input value={value} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} />;
};

export const ControlledExtensionExample: FC = (): ReactElement => {
  const handleChange = (value: string): void => {
    console.log("New value:", value);
  };

  return <TextInput value="John Doe" onChange={handleChange} placeholder="Enter a name" />;
};

// ---------------------------------------------------------------------
// 8. Extensibility through constrained configuration
// ---------------------------------------------------------------------

type ButtonVariant = "primary" | "secondary" | "danger";
type ButtonSize = "small" | "medium" | "large";

interface ConfigurableButtonProps {
  readonly variant?: ButtonVariant;
  readonly size?: ButtonSize;
  readonly children: ReactNode;
  readonly onClick?: () => void;
}

export const ConfigurableButton: FC<ConfigurableButtonProps> = ({
  variant = "primary",
  size = "medium",
  children,
  onClick,
}): ReactElement => {
  return (
    <button type="button" data-variant={variant} data-size={size} onClick={onClick}>
      {children}
    </button>
  );
};

export const ConfigurationExtensionExample: FC = (): ReactElement => {
  return (
    <div>
      <ConfigurableButton variant="primary">Save</ConfigurableButton>
      <ConfigurableButton variant="secondary" size="small">
        Cancel
      </ConfigurableButton>
    </div>
  );
};

// ---------------------------------------------------------------------
// 9. Extensibility without modifying the base component
// ---------------------------------------------------------------------

interface UserCardProps {
  readonly user: User;
  readonly actions?: ReactNode;
}

export const UserCard: FC<UserCardProps> = ({ user, actions }): ReactElement => {
  return (
    <article>
      <header>
        <h2>{user.name}</h2>
        {actions}
      </header>
      <p>{user.email}</p>
    </article>
  );
};

export const ExtendedUserCard: FC = (): ReactElement => {
  const user: User = {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
  };

  const handleEdit = (): void => {
    console.log("Editing account.");
  };

  return (
    <UserCard
      user={user}
      actions={
        <button type="button" onClick={handleEdit}>
          Edit
        </button>
      }
    />
  );
};

// ---------------------------------------------------------------------
// 10. Complete extensible component
// ---------------------------------------------------------------------

interface AccountCardProps {
  readonly user: User;
  readonly badge?: ReactNode;
  readonly actions?: ReactNode;
  readonly footer?: ReactNode;
  readonly renderDetails?: (user: User) => ReactNode;
}

export const AccountCard: FC<AccountCardProps> = ({ user, badge, actions, footer, renderDetails }): ReactElement => {
  return (
    <article>
      <header>
        <h2>
          {user.name}
          {badge && <span>{badge}</span>}
        </h2>
        {actions}
      </header>

      {renderDetails ? renderDetails(user) : <p>{user.email}</p>}

      {footer && <footer>{footer}</footer>}
    </article>
  );
};

export const AccountCardExtensionExample: FC = (): ReactElement => {
  const user: User = {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
  };

  const handleEdit = (): void => {
    console.log("Editing account.");
  };

  return (
    <AccountCard
      user={user}
      badge=" Verified"
      actions={
        <Button variant="secondary" onClick={handleEdit}>
          Edit
        </Button>
      }
      renderDetails={(selectedUser) => (
        <div>
          <p>{selectedUser.email}</p>
          <p>Account administrator.</p>
        </div>
      )}
      footer={<p>Last updated recently.</p>}
    />
  );
};

// ---------------------------------------------------------------------
// 11. Complete demonstration
// ---------------------------------------------------------------------

export const ComponentExtensibilityDemo: FC = (): ReactElement => {
  return (
    <main>
      <ChildrenExtensionExample />
      <SlotExtensionExample />
      <RenderFunctionExtensionExample />
      <CallbackExtensionExample />
      <ComponentSlotExtensionExample />
      <CompositionExtensionExample />
      <ControlledExtensionExample />
      <ConfigurationExtensionExample />
      <ExtendedUserCard />
      <AccountCardExtensionExample />
    </main>
  );
};

export default ComponentExtensibilityDemo;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Component extensibility allows new use cases without changing a component's internal implementation.
// - Children provide a simple extension point for custom content and composition.
// - Slots and render functions allow consumers to replace or customize specific parts of a component.
// - Callback props let consumers supply behavior while the component controls when that behavior is invoked.
// - Component slots allow consumers to replace a presentation detail with another component.
// - Controlled state lets consumers participate directly in state management.
// - Constrained configuration provides predictable extension points without exposing arbitrary implementation details.
// - Good extensibility exposes deliberate boundaries instead of accumulating unrelated props and special cases.
// - An extensible component should preserve its core contract while allowing consumers to customize supported parts of its behavior or presentation.
