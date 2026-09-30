/**
 * Dependency Through Custom Hooks
 * ===============================
 *
 * A custom hook can act as a dependency access boundary by encapsulating how a component
 * obtains and uses a dependency. The component depends on the hook's API instead of knowing
 * whether the dependency comes from a service, Context, configuration, or another source.
 */

// ---------------------------------------------------------------------
// 1. Dependency exposed through a custom hook
// ---------------------------------------------------------------------

import { useCallback, useContext, useMemo, createContext } from "react";
import { type FC, type ReactElement, type ReactNode } from "react";

interface User {
  readonly id: number;
  readonly name: string;
  readonly email: string;
}

interface UserService {
  getUser(id: number): User;
  saveUser(user: User): void;
}

const userService: UserService = {
  getUser(id) {
    return {
      id,
      name: "John Doe",
      email: "john.doe@example.com",
    };
  },
  saveUser(user) {
    console.log("Saving user:", user);
  },
};

// The hook hides the concrete service used by the component.
// The component only knows that `useUserService` provides the dependency API.
const useUserService = (): UserService => userService;

interface UserProfileProps {
  readonly userId: number;
}

export const UserProfile: FC<UserProfileProps> = ({ userId }): ReactElement => {
  const service = useUserService();
  const user = service.getUser(userId);

  return (
    <section>
      <h2>{user.name}</h2>
      <p>{user.email}</p>
    </section>
  );
};

// ---------------------------------------------------------------------
// 2. Custom hooks can expose a focused dependency API
// ---------------------------------------------------------------------

interface UserActions {
  saveUser(user: User): void;
}

const useUserActions = (): UserActions => {
  const service = useUserService();

  return useMemo(
    () => ({
      saveUser: (user: User): void => {
        service.saveUser(user);
      },
    }),
    [service],
  );
};

interface UserEditorProps {
  readonly user: User;
}

export const UserEditor: FC<UserEditorProps> = ({ user }): ReactElement => {
  const { saveUser } = useUserActions();

  const handleSave = (): void => {
    saveUser(user);
  };

  return (
    <button type="button" onClick={handleSave}>
      Save {user.name}
    </button>
  );
};

// ---------------------------------------------------------------------
// 3. A custom hook can adapt a dependency for a feature
// ---------------------------------------------------------------------

interface UserRepository {
  findById(id: number): User;
  update(user: User): void;
}

const userRepository: UserRepository = {
  findById(id) {
    return {
      id,
      name: "John Doe",
      email: "john.doe@example.com",
    };
  },
  update(user) {
    console.log("Updating user:", user);
  },
};

interface UserProfileData {
  readonly user: User;
  readonly updateUser: (user: User) => void;
}

const useUserProfile = (userId: number): UserProfileData => {
  const repository = userRepository;
  const user = repository.findById(userId);

  const updateUser = useCallback(
    (nextUser: User): void => {
      repository.update(nextUser);
    },
    [repository],
  );

  return { user, updateUser };
};

export const UserProfileEditor: FC<UserProfileProps> = ({ userId }): ReactElement => {
  const { user, updateUser } = useUserProfile(userId);

  const handleSave = (): void => {
    updateUser(user);
  };

  return (
    <article>
      <h2>{user.name}</h2>
      <p>{user.email}</p>
      <button type="button" onClick={handleSave}>
        Save
      </button>
    </article>
  );
};

// ---------------------------------------------------------------------
// 4. Custom hooks can hide Context-based dependency access
// ---------------------------------------------------------------------

interface NotificationService {
  success(message: string): void;
  error(message: string): void;
}

const notificationService: NotificationService = {
  success(message) {
    console.log("Success:", message);
  },
  error(message) {
    console.log("Error:", message);
  },
};

const NotificationContext = createContext<NotificationService>(notificationService);

interface NotificationProviderProps {
  readonly service: NotificationService;
  readonly children: ReactNode;
}

export const NotificationProvider: FC<NotificationProviderProps> = ({ service, children }): ReactElement => {
  return <NotificationContext.Provider value={service}>{children}</NotificationContext.Provider>;
};

// Components do not need to know that the dependency comes from Context.
const useNotifications = (): NotificationService => {
  return useContext(NotificationContext);
};

export const SaveNotificationButton: FC = (): ReactElement => {
  const { success } = useNotifications();

  const handleSave = (): void => {
    success("User saved successfully.");
  };

  return (
    <button type="button" onClick={handleSave}>
      Save user
    </button>
  );
};

// ---------------------------------------------------------------------
// 5. Custom hooks can compose multiple dependencies
// ---------------------------------------------------------------------

interface AnalyticsService {
  track(event: string): void;
}

const analyticsService: AnalyticsService = {
  track(event) {
    console.log("Analytics event:", event);
  },
};

interface AccountActions {
  save(user: User): void;
  trackSave(): void;
}

const useAccountActions = (): AccountActions => {
  const { success } = useNotifications();

  return useMemo(
    () => ({
      save: (user: User): void => {
        userService.saveUser(user);
        success("User saved successfully.");
      },
      trackSave: (): void => {
        analyticsService.track("user_saved");
      },
    }),
    [success],
  );
};

interface AccountActionsExampleProps {
  readonly user: User;
}

export const AccountActionsExample: FC<AccountActionsExampleProps> = ({ user }): ReactElement => {
  const { save, trackSave } = useAccountActions();

  const handleSave = (): void => {
    save(user);
    trackSave();
  };

  return (
    <button type="button" onClick={handleSave}>
      Save account
    </button>
  );
};

// ---------------------------------------------------------------------
// 6. The hook becomes the component's dependency boundary
// ---------------------------------------------------------------------

interface AccountSummaryProps {
  readonly userId: number;
}

export const AccountSummary: FC<AccountSummaryProps> = ({ userId }): ReactElement => {
  const { user } = useUserProfile(userId);
  const { success } = useNotifications();

  const handleNotify = (): void => {
    success(`${user.name}'s account is active.`);
  };

  return (
    <section>
      <h2>{user.name}</h2>
      <p>{user.email}</p>
      <button type="button" onClick={handleNotify}>
        Show notification
      </button>
    </section>
  );
};

// ---------------------------------------------------------------------
// 7. Complete example
// ---------------------------------------------------------------------

const alternateNotificationService: NotificationService = {
  success(message) {
    console.log("Alternative success:", message);
  },
  error(message) {
    console.log("Alternative error:", message);
  },
};

export const DependencyThroughCustomHooksDemo: FC = (): ReactElement => {
  const user: User = {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
  };

  return (
    <NotificationProvider service={alternateNotificationService}>
      <main>
        <UserProfile userId={user.id} />
        <UserEditor user={user} />
        <UserProfileEditor userId={user.id} />
        <SaveNotificationButton />
        <AccountActionsExample user={user} />
        <AccountSummary userId={user.id} />
      </main>
    </NotificationProvider>
  );
};

export default DependencyThroughCustomHooksDemo;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - A custom hook can provide a focused boundary for accessing a dependency.
// - Components can depend on a hook API without knowing how the dependency is obtained.
// - A hook can adapt a low-level service into an API that matches a feature's needs.
// - A hook can hide Context access so consuming components remain independent of the Context implementation.
// - Custom hooks can compose multiple dependencies into one feature-specific API.
// - A custom hook does not provide automatic dependency injection; it encapsulates the mechanism used to obtain the dependency.
// - Dependencies remain replaceable when the underlying access mechanism supports alternative implementations.
