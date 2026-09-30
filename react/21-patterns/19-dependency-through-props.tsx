/**
 * Dependency Through Props
 * ========================
 *
 * Dependency through props means a component receives the data, behavior, or service it needs
 * through its props instead of creating or discovering that dependency internally.
 *
 * This makes the dependency explicit at the component boundary and allows the parent to decide
 * which implementation the child should use.
 */

import { type FC, type ReactElement, type ReactNode } from "react";

// ---------------------------------------------------------------------
// 1. Pass data through props
// ---------------------------------------------------------------------

interface User {
  readonly name: string;
  readonly email: string;
}

interface UserProfileProps {
  readonly user: User;
}

export const UserProfile: FC<UserProfileProps> = ({ user }): ReactElement => (
  <section>
    <h2>{user.name}</h2>
    <p>{user.email}</p>
  </section>
);

const user: User = {
  name: "John Doe",
  email: "john@example.com",
};

export const UserProfileExample: FC = (): ReactElement => <UserProfile user={user} />;

// The component declares exactly what data it requires.
// It does not need to know where the user came from.

// ---------------------------------------------------------------------
// 2. Pass behavior through props
// ---------------------------------------------------------------------

interface SaveResult {
  readonly success: boolean;
}

interface SaveButtonProps {
  readonly onSave: () => SaveResult;
}

export const SaveButton: FC<SaveButtonProps> = ({ onSave }): ReactElement => {
  const handleSave = (): void => {
    const result = onSave();

    if (result.success) {
      console.log("Saved successfully.");
    }
  };

  return (
    <button type="button" onClick={handleSave}>
      Save
    </button>
  );
};

const saveUser = (): SaveResult => ({
  success: true,
});

export const SaveButtonExample: FC = (): ReactElement => <SaveButton onSave={saveUser} />;

// The child owns the interaction, while the parent supplies the behavior.
// The child does not need to know how saving is implemented.

// ---------------------------------------------------------------------
// 3. Pass services through props
// ---------------------------------------------------------------------

interface UserService {
  readonly getUser: () => User;
}

interface UserDetailsProps {
  readonly service: UserService;
}

export const UserDetails: FC<UserDetailsProps> = ({ service }): ReactElement => {
  const user = service.getUser();

  return (
    <section>
      <h2>{user.name}</h2>
      <p>{user.email}</p>
    </section>
  );
};

const userService: UserService = {
  getUser: () => ({
    name: "John Doe",
    email: "john@example.com",
  }),
};

export const UserDetailsExample: FC = (): ReactElement => <UserDetails service={userService} />;

// The component depends on the UserService contract rather than a concrete service implementation.

// ---------------------------------------------------------------------
// 4. Inject a dependency at the parent boundary
// ---------------------------------------------------------------------

interface UserPageProps {
  readonly service: UserService;
}

export const UserPage: FC<UserPageProps> = ({ service }): ReactElement => (
  <main>
    <h1>User</h1>
    <UserDetails service={service} />
  </main>
);

export const UserPageExample: FC = (): ReactElement => <UserPage service={userService} />;

// The parent decides which service instance enters the component subtree.
// The child receives the dependency explicitly through its props.

// ---------------------------------------------------------------------
// 5. Pass dependencies through several components
// ---------------------------------------------------------------------

interface UserLayoutProps {
  readonly service: UserService;
  readonly children: ReactNode;
}

export const UserLayout: FC<UserLayoutProps> = ({ service, children }): ReactElement => (
  <div>
    {children}
    <UserDetails service={service} />
  </div>
);

interface UserPageContainerProps {
  readonly service: UserService;
}

export const UserPageContainer: FC<UserPageContainerProps> = ({ service }): ReactElement => (
  <UserLayout service={service}>
    <h1>User Account</h1>
  </UserLayout>
);

export const PropDependencyChain: FC = (): ReactElement => <UserPageContainer service={userService} />;

// Props make the dependency explicit at every boundary.
// However, an intermediate component may need to accept and forward a dependency it does not use itself.

// ---------------------------------------------------------------------
// 6. Function dependencies
// ---------------------------------------------------------------------

interface UserActionsProps {
  readonly onEdit: (user: User) => void;
  readonly onDelete: (user: User) => void;
}

export const UserActions: FC<UserActionsProps> = ({ onEdit, onDelete }): ReactElement => (
  <div>
    <button type="button" onClick={() => onEdit(user)}>
      Edit
    </button>
    <button type="button" onClick={() => onDelete(user)}>
      Delete
    </button>
  </div>
);

const editUser = (selectedUser: User): void => {
  console.log(`Editing ${selectedUser.name}`);
};

const deleteUser = (selectedUser: User): void => {
  console.log(`Deleting ${selectedUser.name}`);
};

export const UserActionsExample: FC = (): ReactElement => <UserActions onEdit={editUser} onDelete={deleteUser} />;

// Function props allow parents to provide operations without exposing their implementation details.

// ---------------------------------------------------------------------
// 7. Dependency contracts
// ---------------------------------------------------------------------

interface NotificationService {
  readonly notify: (message: string) => void;
}

interface NotificationButtonProps {
  readonly service: NotificationService;
}

export const NotificationButton: FC<NotificationButtonProps> = ({ service }): ReactElement => {
  const handleClick = (): void => {
    service.notify("Operation completed.");
  };

  return (
    <button type="button" onClick={handleClick}>
      Notify
    </button>
  );
};

const notificationService: NotificationService = {
  notify: (message) => {
    console.log(message);
  },
};

export const NotificationExample: FC = (): ReactElement => <NotificationButton service={notificationService} />;

// The prop type acts as a dependency contract.
// The component only requires the operations defined by that contract.

// ---------------------------------------------------------------------
// 8. Different implementations
// ---------------------------------------------------------------------

const consoleNotificationService: NotificationService = {
  notify: (message) => {
    console.log(`[Console] ${message}`);
  },
};

const prefixedNotificationService: NotificationService = {
  notify: (message) => {
    console.log(`[Application] ${message}`);
  },
};

export const ConsoleNotificationExample: FC = (): ReactElement => (
  <NotificationButton service={consoleNotificationService} />
);

export const ApplicationNotificationExample: FC = (): ReactElement => (
  <NotificationButton service={prefixedNotificationService} />
);

// The same component can work with different implementations as long as they satisfy the contract.

// ---------------------------------------------------------------------
// 9. Dependency through props and component composition
// ---------------------------------------------------------------------

interface UserCardProps {
  readonly user: User;
  readonly actions: ReactNode;
}

export const UserCard: FC<UserCardProps> = ({ user, actions }): ReactElement => (
  <article>
    <h2>{user.name}</h2>
    <p>{user.email}</p>
    {actions}
  </article>
);

export const UserCardExample: FC = (): ReactElement => (
  <UserCard user={user} actions={<UserActions onEdit={editUser} onDelete={deleteUser} />} />
);

// Dependencies can be combined with composition.
// Data and behavior enter through props while the component controls the structural relationship.

// ---------------------------------------------------------------------
// 10. Explicit dependency boundary
// ---------------------------------------------------------------------

interface AccountViewProps {
  readonly userService: UserService;
  readonly notificationService: NotificationService;
}

export const AccountView: FC<AccountViewProps> = ({
  userService: accountService,
  notificationService: accountNotificationService,
}): ReactElement => {
  const accountUser = accountService.getUser();

  const handleNotify = (): void => {
    accountNotificationService.notify(`Account: ${accountUser.name}`);
  };

  return (
    <section>
      <h2>{accountUser.name}</h2>
      <button type="button" onClick={handleNotify}>
        Notify
      </button>
    </section>
  );
};

export const AccountViewExample: FC = (): ReactElement => (
  <AccountView userService={userService} notificationService={notificationService} />
);

// The component's prop type makes all required external dependencies visible.
// A consumer can inspect the component API without reading its implementation.

// ---------------------------------------------------------------------
// 11. Complete dependency-through-props example
// ---------------------------------------------------------------------

export const DependencyThroughPropsDemo: FC = (): ReactElement => (
  <div>
    <UserProfile user={user} />
    <SaveButton onSave={saveUser} />
    <UserDetails service={userService} />
    <UserActions onEdit={editUser} onDelete={deleteUser} />
    <NotificationButton service={notificationService} />
    <AccountView userService={userService} notificationService={notificationService} />
  </div>
);

// Each component receives its external dependencies from its parent.
// The components do not need to construct those dependencies or retrieve them from global state.

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Dependency through props makes a component's external requirements explicit.
// - Data, functions, and service objects can all be supplied through props.
// - A component can depend on an interface rather than a concrete implementation.
// - Parents control which dependency implementation is supplied to their children.
// - Different implementations can be passed to the same component when they satisfy the same contract.
// - Prop-based dependencies make component behavior easier to inspect at the component boundary.
// - Passing dependencies through several layers can create prop drilling when intermediate components only forward them.
// - Dependency through props is useful when the dependency belongs naturally to the component's explicit API.
