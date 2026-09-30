/**
 * Dependency Through Context
 * ==========================
 *
 * Dependency through context means a component receives shared dependencies from a React Context
 * instead of receiving them directly through props. A provider establishes the dependency boundary,
 * while descendant components retrieve the dependency through context.
 */

import { createContext, useContext, type FC, type ReactElement, type ReactNode } from "react";

// ---------------------------------------------------------------------
// 1. Define a dependency contract
// ---------------------------------------------------------------------

interface User {
  readonly name: string;
  readonly email: string;
}

interface UserService {
  readonly getUser: () => User;
}

// The interface defines the operations consumers require.
// Consumers do not need to know which concrete service implementation provides them.

// ---------------------------------------------------------------------
// 2. Create the dependency context
// ---------------------------------------------------------------------

const UserServiceContext = createContext<UserService | null>(null);

// The context holds the dependency for a component subtree.
// null represents the absence of a provider.

// ---------------------------------------------------------------------
// 3. Provide the dependency
// ---------------------------------------------------------------------

interface UserServiceProviderProps {
  readonly service: UserService;
  readonly children: ReactNode;
}

export const UserServiceProvider: FC<UserServiceProviderProps> = ({ service, children }): ReactElement => (
  <UserServiceContext.Provider value={service}>{children}</UserServiceContext.Provider>
);

// The provider establishes the dependency boundary.
// Every descendant can access the supplied service without receiving it through props.

// ---------------------------------------------------------------------
// 4. Consume the dependency
// ---------------------------------------------------------------------

export const useUserService = (): UserService => {
  const service = useContext(UserServiceContext);

  if (service === null) {
    throw new Error("useUserService must be used inside UserServiceProvider.");
  }

  return service;
};

// The custom hook centralizes context access and provider validation.

// ---------------------------------------------------------------------
// 5. Use the dependency in a component
// ---------------------------------------------------------------------

export const UserDetails: FC = (): ReactElement => {
  const service = useUserService();
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

export const UserDetailsExample: FC = (): ReactElement => (
  <UserServiceProvider service={userService}>
    <UserDetails />
  </UserServiceProvider>
);

// UserDetails does not receive the service as a prop.
// The dependency enters through the provider and is consumed through useUserService.

// ---------------------------------------------------------------------
// 6. Remove prop drilling
// ---------------------------------------------------------------------

interface UserLayoutProps {
  readonly children: ReactNode;
}

export const UserLayout: FC<UserLayoutProps> = ({ children }): ReactElement => <div>{children}</div>;

export const UserPage: FC = (): ReactElement => (
  <UserLayout>
    <UserDetails />
  </UserLayout>
);

export const UserPageExample: FC = (): ReactElement => (
  <UserServiceProvider service={userService}>
    <UserPage />
  </UserServiceProvider>
);

// UserLayout and UserPage do not need to receive or forward the service.
// The dependency remains available to UserDetails through context.

// ---------------------------------------------------------------------
// 7. Multiple consumers
// ---------------------------------------------------------------------

export const UserName: FC = (): ReactElement => {
  const user = useUserService().getUser();

  return <span>{user.name}</span>;
};

export const UserEmail: FC = (): ReactElement => {
  const user = useUserService().getUser();

  return <span>{user.email}</span>;
};

export const UserSummary: FC = (): ReactElement => (
  <section>
    <h2>
      <UserName />
    </h2>
    <p>
      <UserEmail />
    </p>
  </section>
);

// Multiple descendants can access the same dependency independently.
// No intermediate component needs to forward the service.

// ---------------------------------------------------------------------
// 8. Provide different implementations
// ---------------------------------------------------------------------

const cachedUserService: UserService = {
  getUser: () => ({
    name: "John Doe",
    email: "john@example.com",
  }),
};

const remoteUserService: UserService = {
  getUser: () => ({
    name: "John Doe",
    email: "john@example.com",
  }),
};

export const CachedUserExample: FC = (): ReactElement => (
  <UserServiceProvider service={cachedUserService}>
    <UserSummary />
  </UserServiceProvider>
);

export const RemoteUserExample: FC = (): ReactElement => (
  <UserServiceProvider service={remoteUserService}>
    <UserSummary />
  </UserServiceProvider>
);

// The consumer depends on the UserService contract.
// The provider determines which implementation is available to the subtree.

// ---------------------------------------------------------------------
// 9. Multiple dependencies
// ---------------------------------------------------------------------

interface NotificationService {
  readonly notify: (message: string) => void;
}

const NotificationServiceContext = createContext<NotificationService | null>(null);

interface NotificationServiceProviderProps {
  readonly service: NotificationService;
  readonly children: ReactNode;
}

export const NotificationServiceProvider: FC<NotificationServiceProviderProps> = ({
  service,
  children,
}): ReactElement => (
  <NotificationServiceContext.Provider value={service}>{children}</NotificationServiceContext.Provider>
);

export const useNotificationService = (): NotificationService => {
  const service = useContext(NotificationServiceContext);

  if (service === null) {
    throw new Error("useNotificationService must be used inside NotificationServiceProvider.");
  }

  return service;
};

// Each dependency can have its own context and provider.
// This keeps the dependency contracts separate.

// ---------------------------------------------------------------------
// 10. Consume multiple dependencies
// ---------------------------------------------------------------------

export const AccountActions: FC = (): ReactElement => {
  const userService = useUserService();
  const notificationService = useNotificationService();
  const user = userService.getUser();

  const handleNotify = (): void => {
    notificationService.notify(`Account: ${user.name}`);
  };

  return (
    <section>
      <h2>{user.name}</h2>
      <button type="button" onClick={handleNotify}>
        Notify
      </button>
    </section>
  );
};

const notificationService: NotificationService = {
  notify: (message) => {
    console.log(message);
  },
};

export const AccountActionsExample: FC = (): ReactElement => (
  <UserServiceProvider service={userService}>
    <NotificationServiceProvider service={notificationService}>
      <AccountActions />
    </NotificationServiceProvider>
  </UserServiceProvider>
);

// AccountActions receives both dependencies through context.
// Its component API does not need to expose either dependency as a prop.

// ---------------------------------------------------------------------
// 11. Dependency boundary
// ---------------------------------------------------------------------

export const AccountPage: FC = (): ReactElement => (
  <main>
    <h1>Account</h1>
    <UserSummary />
    <AccountActions />
  </main>
);

export const AccountPageExample: FC = (): ReactElement => (
  <UserServiceProvider service={userService}>
    <NotificationServiceProvider service={notificationService}>
      <AccountPage />
    </NotificationServiceProvider>
  </UserServiceProvider>
);

// The providers establish the dependency boundary above the feature.
// Components inside that boundary can consume the dependencies without prop forwarding.

// ---------------------------------------------------------------------
// 12. Context and explicit dependency contracts
// ---------------------------------------------------------------------

interface SearchService {
  readonly search: (query: string) => string[];
}

const SearchServiceContext = createContext<SearchService | null>(null);

export const SearchServiceProvider: FC<{
  readonly service: SearchService;
  readonly children: ReactNode;
}> = ({ service, children }): ReactElement => (
  <SearchServiceContext.Provider value={service}>{children}</SearchServiceContext.Provider>
);

export const useSearchService = (): SearchService => {
  const service = useContext(SearchServiceContext);

  if (service === null) {
    throw new Error("useSearchService must be used inside SearchServiceProvider.");
  }

  return service;
};

export const SearchResults: FC = (): ReactElement => {
  const service = useSearchService();
  const results = service.search("example");

  return (
    <ul>
      {results.map((result) => (
        <li key={result}>{result}</li>
      ))}
    </ul>
  );
};

const searchService: SearchService = {
  search: (query) => [`${query} result 1`, `${query} result 2`],
};

export const SearchExample: FC = (): ReactElement => (
  <SearchServiceProvider service={searchService}>
    <SearchResults />
  </SearchServiceProvider>
);

// Context does not remove the dependency itself.
// It changes how the dependency reaches the component.

// ---------------------------------------------------------------------
// 13. Complete dependency-through-context example
// ---------------------------------------------------------------------

export const DependencyThroughContextDemo: FC = (): ReactElement => (
  <div>
    <UserServiceProvider service={userService}>
      <UserPage />
    </UserServiceProvider>

    <UserServiceProvider service={cachedUserService}>
      <UserSummary />
    </UserServiceProvider>

    <UserServiceProvider service={userService}>
      <NotificationServiceProvider service={notificationService}>
        <AccountPage />
      </NotificationServiceProvider>
    </UserServiceProvider>

    <SearchServiceProvider service={searchService}>
      <SearchResults />
    </SearchServiceProvider>
  </div>
);

// Context is useful when a dependency is required by multiple descendants or across several layers.
// The provider establishes the dependency once, and consumers retrieve it where it is needed.

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Dependency through context supplies shared dependencies through a provider boundary.
// - Consumers retrieve dependencies from context instead of receiving them directly through props.
// - A custom hook can centralize context access and provider validation.
// - Intermediate components do not need to receive or forward dependencies they do not use.
// - The provider can supply different implementations that satisfy the same dependency contract.
// - Multiple independent dependencies can be represented by separate contexts and providers.
// - Context changes how a dependency is delivered; it does not eliminate the dependency itself.
// - Dependency through context is useful when a dependency is needed by multiple descendants or across several component layers.
