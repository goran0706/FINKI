/**
 * Reusable Components
 * ====================
 *
 * A reusable component is designed to solve a general UI problem through a stable, well-defined
 * API rather than being tightly coupled to one screen or use case. Reusability comes from clear
 * responsibilities, composable extension points, predictable props, and minimal assumptions about
 * the environment in which the component is used.
 */

// ---------------------------------------------------------------------
// 1. Reusable components have focused responsibilities
// ---------------------------------------------------------------------

import { type FC, type ReactElement, type ReactNode } from "react";

interface ButtonProps {
  readonly children: ReactNode;
  readonly variant?: "primary" | "secondary" | "danger";
  readonly disabled?: boolean;
  readonly onClick?: () => void;
}

export const Button: FC<ButtonProps> = ({ children, variant = "primary", disabled = false, onClick }): ReactElement => {
  return (
    <button type="button" data-variant={variant} disabled={disabled} onClick={onClick}>
      {children}
    </button>
  );
};

export const FocusedResponsibilityExample: FC = (): ReactElement => {
  const handleSave = (): void => {
    console.log("Saving account.");
  };

  return (
    <Button variant="primary" onClick={handleSave}>
      Save
    </Button>
  );
};

// ---------------------------------------------------------------------
// 2. Reusable components accept data through props
// ---------------------------------------------------------------------

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

export const DataDrivenExample: FC = (): ReactElement => {
  const user: User = {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
  };

  return <UserCard user={user} />;
};

// ---------------------------------------------------------------------
// 3. Reusable components avoid hard-coded application behavior
// ---------------------------------------------------------------------

interface MessageProps {
  readonly title: string;
  readonly children: ReactNode;
}

export const Message: FC<MessageProps> = ({ title, children }): ReactElement => {
  return (
    <section>
      <h2>{title}</h2>
      <div>{children}</div>
    </section>
  );
};

export const MessageExample: FC = (): ReactElement => {
  return (
    <div>
      <Message title="Account">
        <p>John Doe</p>
      </Message>

      <Message title="Status">
        <p>Your account is active.</p>
      </Message>
    </div>
  );
};

// ---------------------------------------------------------------------
// 4. Children provide a general composition boundary
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

export const CompositionExample: FC = (): ReactElement => {
  return (
    <Panel title="Account">
      <UserCard
        user={{
          id: 1,
          name: "John Doe",
          email: "john.doe@example.com",
        }}
      />
      <Button variant="secondary">Edit</Button>
    </Panel>
  );
};

// ---------------------------------------------------------------------
// 5. Render functions make repeated structures extensible
// ---------------------------------------------------------------------

interface ListProps<Item> {
  readonly items: readonly Item[];
  readonly renderItem: (item: Item) => ReactNode;
}

export const List = <Item,>({ items, renderItem }: ListProps<Item>): ReactElement => {
  return (
    <ul>
      {items.map((item, index) => (
        <li key={index}>{renderItem(item)}</li>
      ))}
    </ul>
  );
};

export const GenericListExample: FC = (): ReactElement => {
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
    <List
      items={users}
      renderItem={(user) => (
        <div>
          <strong>{user.name}</strong>
          <p>{user.email}</p>
        </div>
      )}
    />
  );
};

// ---------------------------------------------------------------------
// 6. Generic components can reuse behavior across data types
// ---------------------------------------------------------------------

interface SelectProps<Value extends string> {
  readonly value: Value;
  readonly options: readonly Value[];
  readonly onChange: (value: Value) => void;
}

export const Select = <Value extends string>({ value, options, onChange }: SelectProps<Value>): ReactElement => {
  return (
    <select value={value} onChange={(event) => onChange(event.target.value as Value)}>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
};

export const GenericSelectExample: FC = (): ReactElement => {
  const roles = ["user", "editor", "admin"] as const;

  const handleChange = (role: (typeof roles)[number]): void => {
    console.log("Selected role:", role);
  };

  return <Select value="user" options={roles} onChange={handleChange} />;
};

// ---------------------------------------------------------------------
// 7. Reusable components can expose controlled state
// ---------------------------------------------------------------------

interface ToggleProps {
  readonly value: boolean;
  readonly onChange: (value: boolean) => void;
  readonly label: string;
}

export const Toggle: FC<ToggleProps> = ({ value, onChange, label }): ReactElement => {
  return (
    <button type="button" aria-pressed={value} onClick={() => onChange(!value)}>
      {label}: {value ? "On" : "Off"}
    </button>
  );
};

export const ControlledReuseExample: FC = (): ReactElement => {
  const handleNotificationsChange = (value: boolean): void => {
    console.log("Notifications:", value);
  };

  const handleDarkModeChange = (value: boolean): void => {
    console.log("Dark mode:", value);
  };

  return (
    <div>
      <Toggle value onChange={handleNotificationsChange} label="Notifications" />
      <Toggle value={false} onChange={handleDarkModeChange} label="Dark mode" />
    </div>
  );
};

// ---------------------------------------------------------------------
// 8. Reusable components can define semantic extension points
// ---------------------------------------------------------------------

interface CardProps {
  readonly title: string;
  readonly actions?: ReactNode;
  readonly footer?: ReactNode;
  readonly children: ReactNode;
}

export const Card: FC<CardProps> = ({ title, actions, footer, children }): ReactElement => {
  return (
    <article>
      <header>
        <h2>{title}</h2>
        {actions}
      </header>

      <div>{children}</div>

      {footer && <footer>{footer}</footer>}
    </article>
  );
};

export const ExtensionPointExample: FC = (): ReactElement => {
  const handleEdit = (): void => {
    console.log("Editing account.");
  };

  return (
    <Card
      title="Account"
      actions={
        <Button variant="secondary" onClick={handleEdit}>
          Edit
        </Button>
      }
      footer={<p>Last updated recently.</p>}
    >
      <UserCard
        user={{
          id: 1,
          name: "John Doe",
          email: "john.doe@example.com",
        }}
      />
    </Card>
  );
};

// ---------------------------------------------------------------------
// 9. Reusable components can provide defaults
// ---------------------------------------------------------------------

interface EmptyStateProps {
  readonly title?: string;
  readonly description?: string;
  readonly action?: ReactNode;
}

export const EmptyState: FC<EmptyStateProps> = ({
  title = "No results",
  description = "There is nothing to display.",
  action,
}): ReactElement => {
  return (
    <section>
      <h2>{title}</h2>
      <p>{description}</p>
      {action}
    </section>
  );
};

export const DefaultsExample: FC = (): ReactElement => {
  return (
    <div>
      <EmptyState />

      <EmptyState
        title="No accounts"
        description="Create an account to get started."
        action={<Button>Create account</Button>}
      />
    </div>
  );
};

// ---------------------------------------------------------------------
// 10. Reusable components can be composed into specialized components
// ---------------------------------------------------------------------

interface AccountCardProps {
  readonly user: User;
  readonly onEdit?: (user: User) => void;
}

export const AccountCard: FC<AccountCardProps> = ({ user, onEdit }): ReactElement => {
  return (
    <Card
      title={user.name}
      actions={
        onEdit && (
          <Button variant="secondary" onClick={() => onEdit(user)}>
            Edit
          </Button>
        )
      }
    >
      <p>{user.email}</p>
    </Card>
  );
};

export const SpecializedCompositionExample: FC = (): ReactElement => {
  const user: User = {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
  };

  const handleEdit = (selectedUser: User): void => {
    console.log("Editing:", selectedUser.name);
  };

  return <AccountCard user={user} onEdit={handleEdit} />;
};

// ---------------------------------------------------------------------
// 11. Reusability through dependency injection
// ---------------------------------------------------------------------

interface NotificationService {
  readonly notify: (message: string) => void;
}

interface NotificationButtonProps {
  readonly service: NotificationService;
  readonly message: string;
  readonly children: ReactNode;
}

export const NotificationButton: FC<NotificationButtonProps> = ({ service, message, children }): ReactElement => {
  const handleClick = (): void => {
    service.notify(message);
  };

  return <Button onClick={handleClick}>{children}</Button>;
};

export const DependencyExample: FC = (): ReactElement => {
  const notificationService: NotificationService = {
    notify: (message) => {
      console.log("Notification:", message);
    },
  };

  return (
    <NotificationButton service={notificationService} message="Account saved.">
      Save account
    </NotificationButton>
  );
};

// ---------------------------------------------------------------------
// 12. Reusable components should preserve a small public API
// ---------------------------------------------------------------------

interface UserActionsProps {
  readonly onEdit: () => void;
  readonly onDelete: () => void;
}

export const UserActions: FC<UserActionsProps> = ({ onEdit, onDelete }): ReactElement => {
  return (
    <div>
      <Button variant="secondary" onClick={onEdit}>
        Edit
      </Button>
      <Button variant="danger" onClick={onDelete}>
        Delete
      </Button>
    </div>
  );
};

export const SmallApiExample: FC = (): ReactElement => {
  const handleEdit = (): void => {
    console.log("Editing account.");
  };

  const handleDelete = (): void => {
    console.log("Deleting account.");
  };

  return <UserActions onEdit={handleEdit} onDelete={handleDelete} />;
};

// ---------------------------------------------------------------------
// 13. Reusability does not mean supporting every possible use case
// ---------------------------------------------------------------------

interface StatusBadgeProps {
  readonly status: "active" | "pending" | "disabled";
}

export const StatusBadge: FC<StatusBadgeProps> = ({ status }): ReactElement => {
  return <span data-status={status}>{status}</span>;
};

export const ConstrainedApiExample: FC = (): ReactElement => {
  return (
    <div>
      <StatusBadge status="active" />
      <StatusBadge status="pending" />
      <StatusBadge status="disabled" />
    </div>
  );
};

// ---------------------------------------------------------------------
// 14. Complete demonstration
// ---------------------------------------------------------------------

export const ReusableComponentsDemo: FC = (): ReactElement => {
  return (
    <main>
      <FocusedResponsibilityExample />
      <DataDrivenExample />
      <MessageExample />
      <CompositionExample />
      <GenericListExample />
      <GenericSelectExample />
      <ControlledReuseExample />
      <ExtensionPointExample />
      <DefaultsExample />
      <SpecializedCompositionExample />
      <DependencyExample />
      <SmallApiExample />
      <ConstrainedApiExample />
    </main>
  );
};

export default ReusableComponentsDemo;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Reusable components solve general UI problems through focused, well-defined APIs.
// - Props allow reusable components to receive data and behavior instead of hard-coding application-specific values.
// - `children`, slots, and render functions provide composition and extension points without exposing implementation details.
// - Generic components can reuse the same behavior across different data types while preserving type safety.
// - Controlled APIs allow reusable components to participate in parent-owned state management.
// - Sensible defaults make components convenient without forcing consumers to provide unnecessary configuration.
// - Specialized components can be built by composing smaller reusable components rather than duplicating their implementation.
// - Dependencies can be supplied through props so reusable components do not depend on a specific service implementation.
// - A small public API is easier to understand, maintain, and reuse than one containing many unrelated configuration options.
// - Reusability does not mean supporting every possible use case; a component should expose deliberate extension points that preserve its core contract.
