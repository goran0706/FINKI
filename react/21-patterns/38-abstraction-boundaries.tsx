/**
 * Abstraction Boundaries
 * =======================
 *
 * An abstraction boundary defines which responsibilities a component exposes and which implementation
 * details remain internal. A clear boundary keeps related behavior together, limits dependencies,
 * and gives consumers a stable API without requiring knowledge of internal implementation details.
 */

// ---------------------------------------------------------------------
// 1. A boundary separates public behavior from implementation details
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
  const displayName = user.name.trim();
  const displayEmail = user.email.toLowerCase();

  return (
    <article>
      <h2>{displayName}</h2>
      <p>{displayEmail}</p>
    </article>
  );
};

export const BoundaryExample: FC = (): ReactElement => {
  const user: User = {
    id: 1,
    name: "John Doe",
    email: "JOHN.DOE@EXAMPLE.COM",
  };

  return <UserCard user={user} />;
};

// Consumers provide a User and receive the component's public behavior.
// They do not need to know how the component prepares the displayed values.

// ---------------------------------------------------------------------
// 2. Keep implementation details inside the boundary
// ---------------------------------------------------------------------

interface UserSummaryProps {
  readonly user: User;
}

export const UserSummary: FC<UserSummaryProps> = ({ user }): ReactElement => {
  const getInitials = (name: string): string => {
    return name
      .split(" ")
      .map((part) => part[0] ?? "")
      .join("")
      .toUpperCase();
  };

  return (
    <section>
      <strong>{getInitials(user.name)}</strong>
      <span>{user.name}</span>
    </section>
  );
};

export const InternalImplementationExample: FC = (): ReactElement => {
  const user: User = {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
  };

  return <UserSummary user={user} />;
};

// `getInitials` is an implementation detail. It can change without changing
// the component's public props or requiring consumers to change their code.

// ---------------------------------------------------------------------
// 3. A public API should expose what consumers actually need
// ---------------------------------------------------------------------

interface SaveButtonProps {
  readonly onSave: () => void;
  readonly disabled?: boolean;
}

export const SaveButton: FC<SaveButtonProps> = ({ onSave, disabled = false }): ReactElement => {
  return (
    <button type="button" disabled={disabled} onClick={onSave}>
      Save
    </button>
  );
};

export const PublicApiExample: FC = (): ReactElement => {
  const handleSave = (): void => {
    console.log("Saving account.");
  };

  return <SaveButton onSave={handleSave} />;
};

// The consumer needs the save operation and disabled state.
// Internal event handling and markup remain behind the boundary.

// ---------------------------------------------------------------------
// 4. Do not expose internal state when consumers only need behavior
// ---------------------------------------------------------------------

interface ToggleProps {
  readonly value: boolean;
  readonly onChange: (value: boolean) => void;
  readonly label: string;
}

export const Toggle: FC<ToggleProps> = ({ value, onChange, label }): ReactElement => {
  const handleClick = (): void => {
    onChange(!value);
  };

  return (
    <button type="button" aria-pressed={value} onClick={handleClick}>
      {label}: {value ? "On" : "Off"}
    </button>
  );
};

export const StateBoundaryExample: FC = (): ReactElement => {
  const handleChange = (value: boolean): void => {
    console.log("Toggle value:", value);
  };

  return <Toggle value={false} onChange={handleChange} label="Notifications" />;
};

// The component exposes the state needed to control it and the callback needed
// to change it. Its event-handling implementation remains internal.

// ---------------------------------------------------------------------
// 5. Keep data transformation behind the boundary when it is presentation-specific
// ---------------------------------------------------------------------

interface Account {
  readonly firstName: string;
  readonly lastName: string;
  readonly email: string;
}

interface AccountHeaderProps {
  readonly account: Account;
}

export const AccountHeader: FC<AccountHeaderProps> = ({ account }): ReactElement => {
  const fullName = `${account.firstName} ${account.lastName}`;

  return (
    <header>
      <h2>{fullName}</h2>
      <p>{account.email}</p>
    </header>
  );
};

export const TransformationBoundaryExample: FC = (): ReactElement => {
  const account: Account = {
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
  };

  return <AccountHeader account={account} />;
};

// Formatting the name is part of the header's presentation responsibility.
// The consumer does not need to prepare a second `fullName` field.

// ---------------------------------------------------------------------
// 6. Keep service access behind a component boundary
// ---------------------------------------------------------------------

interface UserService {
  readonly getUser: (id: number) => User;
}

const userService: UserService = {
  getUser: (id) => ({
    id,
    name: "John Doe",
    email: "john.doe@example.com",
  }),
};

interface UserProfileProps {
  readonly userId: number;
}

export const UserProfile: FC<UserProfileProps> = ({ userId }): ReactElement => {
  const user = userService.getUser(userId);

  return (
    <article>
      <h2>{user.name}</h2>
      <p>{user.email}</p>
    </article>
  );
};

export const ServiceBoundaryExample: FC = (): ReactElement => {
  return <UserProfile userId={1} />;
};

// The component owns the decision to obtain user data from the service.
// Consumers only provide the identifier required by the component's API.

// ---------------------------------------------------------------------
// 7. Dependency injection can move a dependency across the boundary
// ---------------------------------------------------------------------

interface UserRepository {
  readonly getUser: (id: number) => User;
}

interface UserProfileWithRepositoryProps {
  readonly userId: number;
  readonly repository: UserRepository;
}

export const UserProfileWithRepository: FC<UserProfileWithRepositoryProps> = ({ userId, repository }): ReactElement => {
  const user = repository.getUser(userId);

  return (
    <article>
      <h2>{user.name}</h2>
      <p>{user.email}</p>
    </article>
  );
};

const inMemoryRepository: UserRepository = {
  getUser: (id) => ({
    id,
    name: "John Doe",
    email: "john.doe@example.com",
  }),
};

export const InjectedDependencyExample: FC = (): ReactElement => {
  return <UserProfileWithRepository userId={1} repository={inMemoryRepository} />;
};

// The repository interface crosses the boundary, not its implementation details.
// This makes the component independent of a particular repository implementation.

// ---------------------------------------------------------------------
// 8. Composition can establish a boundary between structure and content
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

export const CompositionBoundaryExample: FC = (): ReactElement => {
  return (
    <Panel title="Account">
      <p>John Doe</p>
      <p>john.doe@example.com</p>
    </Panel>
  );
};

// Panel owns structural behavior while its consumer owns the content.
// Neither component needs to know the other's internal implementation.

// ---------------------------------------------------------------------
// 9. Render functions can define a precise boundary for item presentation
// ---------------------------------------------------------------------

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

export const RenderBoundaryExample: FC = (): ReactElement => {
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
        <div>
          <strong>{user.name}</strong>
          <p>{user.email}</p>
        </div>
      )}
    />
  );
};

// UserList owns collection traversal and keys.
// The render function creates the boundary for item-specific presentation.

// ---------------------------------------------------------------------
// 10. A boundary should prevent unrelated responsibilities from leaking inward
// ---------------------------------------------------------------------

interface AccountActionsProps {
  readonly onEdit: () => void;
  readonly onDelete: () => void;
}

export const AccountActions: FC<AccountActionsProps> = ({ onEdit, onDelete }): ReactElement => {
  return (
    <div>
      <button type="button" onClick={onEdit}>
        Edit
      </button>
      <button type="button" onClick={onDelete}>
        Delete
      </button>
    </div>
  );
};

export const ResponsibilityBoundaryExample: FC = (): ReactElement => {
  const handleEdit = (): void => {
    console.log("Editing account.");
  };

  const handleDelete = (): void => {
    console.log("Deleting account.");
  };

  return <AccountActions onEdit={handleEdit} onDelete={handleDelete} />;
};

// AccountActions owns the presentation and interaction boundary.
// It does not decide how editing or deletion is implemented.

// ---------------------------------------------------------------------
// 11. Keep domain decisions outside purely presentational boundaries
// ---------------------------------------------------------------------

interface StatusBadgeProps {
  readonly status: "active" | "pending" | "disabled";
}

export const StatusBadge: FC<StatusBadgeProps> = ({ status }): ReactElement => {
  return <span data-status={status}>{status}</span>;
};

export const DomainBoundaryExample: FC = (): ReactElement => {
  const accountStatus: "active" | "pending" | "disabled" = "active";

  return <StatusBadge status={accountStatus} />;
};

// The badge represents the status it receives.
// The decision about which status applies belongs outside the presentation boundary.

// ---------------------------------------------------------------------
// 12. Keep public APIs stable when internal implementation changes
// ---------------------------------------------------------------------

interface NotificationProps {
  readonly message: string;
}

export const Notification: FC<NotificationProps> = ({ message }): ReactElement => {
  return <aside role="status">{message}</aside>;
};

export const StableApiExample: FC = (): ReactElement => {
  return <Notification message="Account saved." />;
};

// The implementation can change from one markup structure to another while
// preserving the same `message` contract for consumers.

// ---------------------------------------------------------------------
// 13. Avoid leaking internal implementation through overly broad props
// ---------------------------------------------------------------------

interface NarrowCardProps {
  readonly title: string;
  readonly children: ReactNode;
}

export const NarrowCard: FC<NarrowCardProps> = ({ title, children }): ReactElement => {
  return (
    <article>
      <h2>{title}</h2>
      {children}
    </article>
  );
};

export const NarrowBoundaryExample: FC = (): ReactElement => {
  return (
    <NarrowCard title="Account">
      <p>John Doe</p>
    </NarrowCard>
  );
};

// A narrow API prevents consumers from depending on implementation-specific
// options that may otherwise become difficult to remove later.

// ---------------------------------------------------------------------
// 14. Boundaries can be layered without exposing every layer
// ---------------------------------------------------------------------

interface AccountViewProps {
  readonly account: Account;
}

const AccountDetails: FC<AccountViewProps> = ({ account }): ReactElement => {
  return (
    <div>
      <p>
        {account.firstName} {account.lastName}
      </p>
      <p>{account.email}</p>
    </div>
  );
};

const AccountView: FC<AccountViewProps> = ({ account }): ReactElement => {
  return (
    <Panel title="Account">
      <AccountDetails account={account} />
    </Panel>
  );
};

export const LayeredBoundaryExample: FC = (): ReactElement => {
  const account: Account = {
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
  };

  return <AccountView account={account} />;
};

// AccountDetails and Panel each own a smaller responsibility.
// AccountView composes those responsibilities into the public account view.

// ---------------------------------------------------------------------
// 15. Keep internal components private when they are not part of the API
// ---------------------------------------------------------------------

const InternalStatus: FC<{
  readonly message: string;
}> = ({ message }): ReactElement => {
  return <p>{message}</p>;
};

interface AccountStatusProps {
  readonly account: Account;
}

export const AccountStatus: FC<AccountStatusProps> = ({ account }): ReactElement => {
  return (
    <section>
      <h2>{account.firstName}'s account</h2>
      <InternalStatus message="Account is active." />
    </section>
  );
};

export const PrivateImplementationExample: FC = (): ReactElement => {
  const account: Account = {
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
  };

  return <AccountStatus account={account} />;
};

// `InternalStatus` is an implementation detail. Keeping it unexported makes
// the intended public boundary explicit and reduces accidental coupling.

// ---------------------------------------------------------------------
// 16. Complete demonstration
// ---------------------------------------------------------------------

export const AbstractionBoundariesDemo: FC = (): ReactElement => {
  return (
    <main>
      <BoundaryExample />
      <InternalImplementationExample />
      <PublicApiExample />
      <StateBoundaryExample />
      <TransformationBoundaryExample />
      <ServiceBoundaryExample />
      <InjectedDependencyExample />
      <CompositionBoundaryExample />
      <RenderBoundaryExample />
      <ResponsibilityBoundaryExample />
      <DomainBoundaryExample />
      <StableApiExample />
      <NarrowBoundaryExample />
      <LayeredBoundaryExample />
      <PrivateImplementationExample />
    </main>
  );
};

export default AbstractionBoundariesDemo;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - An abstraction boundary separates public behavior from implementation details.
// - A clear boundary exposes the information consumers need without requiring knowledge of internal mechanics.
// - Internal state, transformations, event handling, and helper functions can remain private when they are implementation details.
// - Public APIs should expose stable responsibilities rather than incidental implementation details.
// - Dependency injection allows an abstraction boundary to depend on a contract instead of a concrete implementation.
// - Composition creates boundaries between structure and content so each component can own a focused responsibility.
// - Render functions create explicit boundaries between collection behavior and item presentation.
// - Domain decisions should remain outside purely presentational components when those decisions are not part of their responsibility.
// - Narrow APIs reduce accidental coupling and make internal implementation changes easier.
// - Internal components that are not part of the public contract can remain unexported to make the intended boundary explicit.
// - Good abstraction boundaries localize change: a change inside one boundary should require as few changes as possible outside it.
