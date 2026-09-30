/**
 * Context Custom Hook Pattern
 * ===========================
 *
 * The Context Custom Hook pattern combines React Context with a custom hook that owns
 * the context-consumption logic. The provider supplies shared state or behavior, while
 * the custom hook gives consumers a focused and consistent API for accessing that context.
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

// The context stores the shared value, while the custom hook will provide the consumer-facing API.

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

  return <UserContext.Provider value={{ user }}>{children}</UserContext.Provider>;
};

// The provider owns the context value and makes it available to its descendants.

// ---------------------------------------------------------------------
// 3. Create a custom context hook
// ---------------------------------------------------------------------

export const useUser = (): UserContextValue => {
  const context = useContext(UserContext);

  if (context === null) {
    throw new Error("useUser must be used inside UserProvider.");
  }

  return context;
};

// The hook centralizes context consumption and validates that a provider exists.
// Consumers no longer need to call useContext or perform the null check themselves.

// ---------------------------------------------------------------------
// 4. Consume the custom hook
// ---------------------------------------------------------------------

export const UserProfile: FC = (): ReactElement => {
  const { user } = useUser();

  return (
    <section>
      <h2>{user.name}</h2>
      <p>{user.email}</p>
    </section>
  );
};

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

export const UserExample: FC = (): ReactElement => (
  <UserProvider>
    <UserPanel />
  </UserProvider>
);

// The consumer only knows about useUser.
// The context implementation remains behind the custom hook boundary.

// ---------------------------------------------------------------------
// 5. Context with state and actions
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

// The provider owns the state and exposes both the current value and the action that changes it.

// ---------------------------------------------------------------------
// 6. Create the theme hook
// ---------------------------------------------------------------------

export const useTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext);

  if (context === null) {
    throw new Error("useTheme must be used inside ThemeProvider.");
  }

  return context;
};

// The custom hook creates a single access point for the theme context.
// It also guarantees that consumers receive a non-null ThemeContextValue.

// ---------------------------------------------------------------------
// 7. Use the custom context hook
// ---------------------------------------------------------------------

export const ThemeToggle: FC = (): ReactElement => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button type="button" onClick={toggleTheme}>
      Theme: {theme}
    </button>
  );
};

export const ThemedContent: FC = (): ReactElement => {
  const { theme } = useTheme();

  return (
    <main>
      <h2>{theme === "light" ? "Light mode" : "Dark mode"}</h2>
      <ThemeToggle />
    </main>
  );
};

export const ThemeExample: FC = (): ReactElement => (
  <ThemeProvider>
    <ThemedContent />
  </ThemeProvider>
);

// Components consume the domain-specific hook instead of depending directly on the context object.

// ---------------------------------------------------------------------
// 8. Hide the context implementation
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

export const useAccount = (): AccountContextValue => {
  const context = useContext(AccountContext);

  if (context === null) {
    throw new Error("useAccount must be used inside AccountProvider.");
  }

  return context;
};

export const AccountName: FC = (): ReactElement => {
  const { account } = useAccount();

  return <span>{account.name}</span>;
};

export const AccountRole: FC = (): ReactElement => {
  const { account } = useAccount();

  return <span>{account.role}</span>;
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

// The provider and context remain implementation details.
// Consumers interact with the domain-specific useAccount hook.

// ---------------------------------------------------------------------
// 9. Share context behavior through a custom hook
// ---------------------------------------------------------------------

interface Session {
  readonly username: string;
  readonly authenticated: boolean;
}

interface SessionContextValue {
  readonly session: Session;
  readonly signOut: () => void;
}

const SessionContext = createContext<SessionContextValue | null>(null);

interface SessionProviderProps {
  readonly children: ReactNode;
}

export const SessionProvider: FC<SessionProviderProps> = ({ children }): ReactElement => {
  const [session, setSession] = useState<Session>({
    username: "John Doe",
    authenticated: true,
  });

  const signOut = (): void => {
    setSession({
      username: "",
      authenticated: false,
    });
  };

  return <SessionContext.Provider value={{ session, signOut }}>{children}</SessionContext.Provider>;
};

export const useSession = (): SessionContextValue => {
  const context = useContext(SessionContext);

  if (context === null) {
    throw new Error("useSession must be used inside SessionProvider.");
  }

  return context;
};

export const SessionStatus: FC = (): ReactElement => {
  const { session } = useSession();

  return <p>{session.authenticated ? `Signed in as ${session.username}` : "Signed out"}</p>;
};

export const SessionControls: FC = (): ReactElement => {
  const { session, signOut } = useSession();

  if (!session.authenticated) {
    return <p>No active session.</p>;
  }

  return (
    <button type="button" onClick={signOut}>
      Sign out
    </button>
  );
};

export const SessionExample: FC = (): ReactElement => (
  <SessionProvider>
    <SessionStatus />
    <SessionControls />
  </SessionProvider>
);

// The custom hook exposes both shared state and domain actions through one API.

// ---------------------------------------------------------------------
// 10. Provider and hook as one feature boundary
// ---------------------------------------------------------------------

export const UserFeature: FC = (): ReactElement => (
  <UserProvider>
    <UserPanel />
  </UserProvider>
);

export const ThemeFeature: FC = (): ReactElement => (
  <ThemeProvider>
    <ThemedContent />
  </ThemeProvider>
);

export const AccountFeature: FC = (): ReactElement => (
  <AccountProvider>
    <AccountPanel />
  </AccountProvider>
);

export const SessionFeature: FC = (): ReactElement => (
  <SessionProvider>
    <SessionStatus />
    <SessionControls />
  </SessionProvider>
);

// A provider establishes the runtime boundary, while its custom hook establishes the consumer API.

// ---------------------------------------------------------------------
// 11. Complete context custom hook example
// ---------------------------------------------------------------------

export const ContextCustomHookPatternDemo: FC = (): ReactElement => (
  <div>
    <UserFeature />
    <ThemeFeature />
    <AccountFeature />
    <SessionFeature />
  </div>
);

// The pattern separates responsibilities:
// the provider supplies the shared value, the context transports it, and the custom hook exposes it.

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Context provides shared values to components within a provider subtree.
// - A provider owns and supplies the context value.
// - A custom hook centralizes context consumption and provider validation.
// - Consumers use a domain-specific hook instead of calling useContext directly.
// - The custom hook can expose both shared state and actions as one API.
// - The context and provider implementation can remain behind the feature boundary.
// - A provider establishes where shared state is available, while the custom hook defines how consumers access it.
// - This pattern combines Context's subtree-based sharing with the encapsulation and reuse of custom hooks.
