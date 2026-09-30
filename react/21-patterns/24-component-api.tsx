/**
 * Component API
 * =============
 *
 * A component API is the public contract through which consumers configure and use a component.
 * A well-designed API exposes the inputs, composition points, and behavior consumers need while
 * keeping implementation details internal.
 */

// ---------------------------------------------------------------------
// 1. Basic component API
// ---------------------------------------------------------------------

import { type FC, type ReactElement, type ReactNode } from "react";

interface UserCardProps {
  readonly name: string;
  readonly email: string;
  readonly role: string;
}

export const UserCard: FC<UserCardProps> = ({ name, email, role }): ReactElement => {
  return (
    <article>
      <h2>{name}</h2>
      <p>{email}</p>
      <span>{role}</span>
    </article>
  );
};

export const BasicApiExample: FC = (): ReactElement => {
  return <UserCard name="John Doe" email="john.doe@example.com" role="Administrator" />;
};

// ---------------------------------------------------------------------
// 2. Required and optional API properties
// ---------------------------------------------------------------------

interface ProfileCardProps {
  readonly name: string;
  readonly email: string;
  readonly description?: string;
  readonly isVerified?: boolean;
}

export const ProfileCard: FC<ProfileCardProps> = ({ name, email, description, isVerified = false }): ReactElement => {
  return (
    <article>
      <h2>
        {name} {isVerified && <span>Verified</span>}
      </h2>
      <p>{email}</p>
      {description && <p>{description}</p>}
    </article>
  );
};

export const OptionalPropsExample: FC = (): ReactElement => {
  return <ProfileCard name="John Doe" email="john.doe@example.com" description="Account administrator." isVerified />;
};

// ---------------------------------------------------------------------
// 3. Callback properties define behavior contracts
// ---------------------------------------------------------------------

interface ActionButtonProps {
  readonly label: string;
  readonly onClick: () => void;
}

export const ActionButton: FC<ActionButtonProps> = ({ label, onClick }): ReactElement => {
  return (
    <button type="button" onClick={onClick}>
      {label}
    </button>
  );
};

export const CallbackApiExample: FC = (): ReactElement => {
  const handleSave = (): void => {
    console.log("Saving account.");
  };

  return <ActionButton label="Save" onClick={handleSave} />;
};

// ---------------------------------------------------------------------
// 4. Children create a composition point
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

export const ChildrenApiExample: FC = (): ReactElement => {
  return (
    <Panel title="Account">
      <p>John Doe</p>
      <p>john.doe@example.com</p>
    </Panel>
  );
};

// ---------------------------------------------------------------------
// 5. Render customization through slots
// ---------------------------------------------------------------------

interface User {
  readonly id: number;
  readonly name: string;
  readonly email: string;
}

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

export const RenderCustomizationExample: FC = (): ReactElement => {
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
          <span>{user.email}</span>
        </article>
      )}
    />
  );
};

// ---------------------------------------------------------------------
// 6. Variants make supported visual states explicit
// ---------------------------------------------------------------------

type ButtonVariant = "primary" | "secondary" | "danger";
type ButtonSize = "small" | "medium" | "large";

interface ButtonProps {
  readonly variant?: ButtonVariant;
  readonly size?: ButtonSize;
  readonly disabled?: boolean;
  readonly children: ReactNode;
  readonly onClick?: () => void;
}

export const Button: FC<ButtonProps> = ({
  variant = "primary",
  size = "medium",
  disabled = false,
  children,
  onClick,
}): ReactElement => {
  return (
    <button type="button" data-variant={variant} data-size={size} disabled={disabled} onClick={onClick}>
      {children}
    </button>
  );
};

export const VariantApiExample: FC = (): ReactElement => {
  return (
    <div>
      <Button variant="primary" size="medium">
        Save
      </Button>
      <Button variant="secondary" size="small">
        Cancel
      </Button>
      <Button variant="danger" size="large">
        Delete
      </Button>
    </div>
  );
};

// ---------------------------------------------------------------------
// 7. Controlled components expose state through the API
// ---------------------------------------------------------------------

interface TextInputProps {
  readonly value: string;
  readonly onChange: (value: string) => void;
  readonly placeholder?: string;
}

export const TextInput: FC<TextInputProps> = ({ value, onChange, placeholder }): ReactElement => {
  return <input value={value} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} />;
};

export const ControlledApiExample: FC = (): ReactElement => {
  return (
    <TextInput value="John Doe" onChange={(value) => console.log("New value:", value)} placeholder="Enter a name" />
  );
};

// ---------------------------------------------------------------------
// 8. APIs can expose semantic domain concepts
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

export const SemanticApiExample: FC = (): ReactElement => {
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
// 9. Compound APIs expose related components together
// ---------------------------------------------------------------------

interface CardProps {
  readonly children: ReactNode;
}

const Card: FC<CardProps> = ({ children }): ReactElement => {
  return <article>{children}</article>;
};

interface CardHeaderProps {
  readonly children: ReactNode;
}

const CardHeader: FC<CardHeaderProps> = ({ children }): ReactElement => {
  return <header>{children}</header>;
};

interface CardBodyProps {
  readonly children: ReactNode;
}

const CardBody: FC<CardBodyProps> = ({ children }): ReactElement => {
  return <div>{children}</div>;
};

export const CompoundApiExample: FC = (): ReactElement => {
  return (
    <Card>
      <CardHeader>
        <h2>Account</h2>
      </CardHeader>
      <CardBody>
        <p>John Doe</p>
        <p>john.doe@example.com</p>
      </CardBody>
    </Card>
  );
};

// ---------------------------------------------------------------------
// 10. Complete component API example
// ---------------------------------------------------------------------

interface AccountCardProps {
  readonly name: string;
  readonly email: string;
  readonly role?: string;
  readonly verified?: boolean;
  readonly actions?: ReactNode;
}

export const AccountCard: FC<AccountCardProps> = ({
  name,
  email,
  role = "User",
  verified = false,
  actions,
}): ReactElement => {
  return (
    <article>
      <header>
        <h2>
          {name} {verified && <span>Verified</span>}
        </h2>
        <p>{role}</p>
      </header>

      <p>{email}</p>

      {actions && <footer>{actions}</footer>}
    </article>
  );
};

export const AccountCardExample: FC = (): ReactElement => {
  const handleEdit = (): void => {
    console.log("Editing account.");
  };

  return (
    <AccountCard
      name="John Doe"
      email="john.doe@example.com"
      role="Administrator"
      verified
      actions={
        <Button variant="secondary" onClick={handleEdit}>
          Edit
        </Button>
      }
    />
  );
};

export const ComponentApiDemo: FC = (): ReactElement => {
  return (
    <main>
      <BasicApiExample />
      <OptionalPropsExample />
      <CallbackApiExample />
      <ChildrenApiExample />
      <RenderCustomizationExample />
      <VariantApiExample />
      <ControlledApiExample />
      <SemanticApiExample />
      <CompoundApiExample />
      <AccountCardExample />
    </main>
  );
};

export default ComponentApiDemo;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - A component API is the public contract through which consumers configure and compose a component.
// - Props should expose the information and behavior consumers actually need.
// - Required and optional props communicate which parts of the API are essential or configurable.
// - Callback props define explicit contracts for interactions and state changes.
// - Children and render props provide composition points without exposing implementation details.
// - Variants should use constrained values when a component supports a defined set of states.
// - Controlled component APIs expose state through value and change-handler props.
// - Semantic props can make an API express domain behavior instead of implementation details.
// - A component API should remain focused, predictable, and explicit about its supported extension points.
