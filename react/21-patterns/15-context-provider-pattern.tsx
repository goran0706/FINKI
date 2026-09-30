/**
 * Context Provider Pattern
 * ========================
 *
 * The Context Provider pattern uses React Context to make shared data or behavior available
 * to a subtree of components without passing those values through every intermediate component.
 *
 * A provider owns the context value and places it into the component tree, while consuming
 * components read that value from the nearest matching provider.
 */

import { createContext, useContext, useState, type FC, type ReactElement, type ReactNode } from "react";

// ---------------------------------------------------------------------
// 1. Define the context value
// ---------------------------------------------------------------------

interface User {
  readonly name: string;
  readonly email: string;
}

interface UserContextValue {
  readonly user: User;
}

const UserContext = createContext<UserContextValue | null>(null);

// The context describes the shape of the shared value.
// The initial value is null because a provider supplies the actual value at runtime.

// ---------------------------------------------------------------------
// 2. Create the provider
// ---------------------------------------------------------------------

interface UserProviderProps {
  readonly children: ReactNode;
}

export const UserProvider: FC<UserProviderProps> = ({ children }): ReactElement => {
  const user: User = {
    name: "John Doe",
    email: "john@example.com",
  };

  const value: UserContextValue = { user };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

// The provider owns the shared value and makes it available to every descendant.
// Components between the provider and its consumers do not need to receive the user as a prop.

// ---------------------------------------------------------------------
// 3. Consume the context
// ---------------------------------------------------------------------

export const UserProfile: FC = (): ReactElement => {
  const context = useContext(UserContext);

  if (context === null) {
    throw new Error("UserProfile must be rendered inside UserProvider.");
  }

  return (
    <section>
      <h2>{context.user.name}</h2>
      <p>{context.user.email}</p>
    </section>
  );
};

// useContext reads the value from the nearest UserContext.Provider above the component.
// The consumer does not need to know which intermediate components exist in the tree.

// ---------------------------------------------------------------------
// 4. Intermediate components
// ---------------------------------------------------------------------

export const UserDetails: FC = (): ReactElement => (
  <div>
    <UserProfile />
  </div>
);

export const UserPanel: FC = (): ReactElement => (
  <section>
    <h2>User Panel</h2>
    <UserDetails />
  </section>
);

export const ContextProviderExample: FC = (): ReactElement => (
  <UserProvider>
    <UserPanel />
  </UserProvider>
);

// UserPanel and UserDetails do not receive the user as props.
// UserProfile reads the shared value directly from context.

// ---------------------------------------------------------------------
// 5. Context with state
// ---------------------------------------------------------------------

interface ThemeContextValue {
  readonly theme: "light" | "dark";
  readonly toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

interface ThemeProviderProps {
  readonly children: ReactNode;
}

export const ThemeProvider: FC<ThemeProviderProps> = ({ children }): ReactElement => {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  const toggleTheme = (): void => {
    setTheme((currentTheme) => (currentTheme === "light" ? "dark" : "light"));
  };

  const value: ThemeContextValue = {
    theme,
    toggleTheme,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const ThemeToggle: FC = (): ReactElement => {
  const context = useContext(ThemeContext);

  if (context === null) {
    throw new Error("ThemeToggle must be rendered inside ThemeProvider.");
  }

  return (
    <button type="button" onClick={context.toggleTheme}>
      Theme: {context.theme}
    </button>
  );
};

export const ThemedContent: FC = (): ReactElement => {
  const context = useContext(ThemeContext);

  if (context === null) {
    throw new Error("ThemedContent must be rendered inside ThemeProvider.");
  }

  return (
    <main>
      <h2>{context.theme === "light" ? "Light mode" : "Dark mode"}</h2>
      <ThemeToggle />
    </main>
  );
};

// A provider can own both state and actions.
// Updating provider state changes the context value and can cause consuming components to render again.

// ---------------------------------------------------------------------
// 6. Multiple consumers
// ---------------------------------------------------------------------

export const ThemeHeader: FC = (): ReactElement => {
  const context = useContext(ThemeContext);

  if (context === null) {
    throw new Error("ThemeHeader must be rendered inside ThemeProvider.");
  }

  return <header>Current theme: {context.theme}</header>;
};

export const ThemeFooter: FC = (): ReactElement => {
  const context = useContext(ThemeContext);

  if (context === null) {
    throw new Error("ThemeFooter must be rendered inside ThemeProvider.");
  }

  return <footer>Theme: {context.theme}</footer>;
};

export const MultipleContextConsumers: FC = (): ReactElement => (
  <ThemeProvider>
    <ThemeHeader />
    <ThemedContent />
    <ThemeFooter />
  </ThemeProvider>
);

// Multiple descendants can consume the same provider value independently.
// They do not need to receive the value through their parent components.

// ---------------------------------------------------------------------
// 7. Nested providers
// ---------------------------------------------------------------------

export const NestedThemeProviders: FC = (): ReactElement => (
  <ThemeProvider>
    <section>
      <ThemeHeader />

      <ThemeProvider>
        <ThemedContent />
      </ThemeProvider>
    </section>
  </ThemeProvider>
);

// A consumer reads from the nearest matching provider.
// Nested providers can therefore establish a different context value for a subtree.

// ---------------------------------------------------------------------
// 8. Provider boundaries
// ---------------------------------------------------------------------

interface Account {
  readonly name: string;
  readonly role: "user" | "admin";
}

interface AccountContextValue {
  readonly account: Account;
}

const AccountContext = createContext<AccountContextValue | null>(null);

export const AccountProvider: FC<UserProviderProps> = ({ children }): ReactElement => {
  const account: Account = {
    name: "John Doe",
    role: "user",
  };

  return <AccountContext.Provider value={{ account }}>{children}</AccountContext.Provider>;
};

export const AccountName: FC = (): ReactElement => {
  const context = useContext(AccountContext);

  if (context === null) {
    throw new Error("AccountName must be rendered inside AccountProvider.");
  }

  return <span>{context.account.name}</span>;
};

export const AccountRole: FC = (): ReactElement => {
  const context = useContext(AccountContext);

  if (context === null) {
    throw new Error("AccountRole must be rendered inside AccountProvider.");
  }

  return <span>{context.account.role}</span>;
};

export const AccountPanel: FC = (): ReactElement => (
  <section>
    <h2>Account</h2>
    <p>
      Name: <AccountName />
    </p>
    <p>
      Role: <AccountRole />
    </p>
  </section>
);

// The provider defines the boundary within which the account is available.
// Consumers outside that boundary do not receive the provider's value.

// ---------------------------------------------------------------------
// 9. Complete provider pattern
// ---------------------------------------------------------------------

export const ContextProviderPatternDemo: FC = (): ReactElement => (
  <div>
    <UserProvider>
      <UserPanel />
    </UserProvider>

    <ThemeProvider>
      <ThemedContent />
      <ThemeFooter />
    </ThemeProvider>

    <AccountProvider>
      <AccountPanel />
    </AccountProvider>
  </div>
);

// The provider owns the shared value, the context transports it through the tree,
// and descendant consumers read the value where it is needed.

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - A context defines the shape of a value that can be shared through a component subtree.
// - A provider supplies the context value to its descendant components.
// - useContext reads the nearest matching provider value for the consuming component.
// - Intermediate components do not need to forward context values as props.
// - Providers can own state and expose both state values and actions through context.
// - Multiple components can consume the same context independently.
// - Nested providers can override a context value for their own subtree.
// - The provider boundary determines which descendants can access the supplied value.
// - Context is most useful when many components in a subtree need access to the same value or behavior.
