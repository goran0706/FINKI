/**
 * Provider Composition
 * =====================
 *
 * Provider composition combines multiple context providers into a single component tree.
 * Each provider owns a specific piece of shared state or behavior, while composition determines
 * how those independent providers are assembled around the application or a feature subtree.
 */

import { createContext, useContext, useState, type FC, type ReactElement, type ReactNode } from "react";

// ---------------------------------------------------------------------
// 1. User provider
// ---------------------------------------------------------------------

interface User {
  readonly name: string;
  readonly email: string;
}

interface UserContextValue {
  readonly user: User;
}

const UserContext = createContext<UserContextValue | null>(null);

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

export const useUser = (): UserContextValue => {
  const context = useContext(UserContext);

  if (context === null) {
    throw new Error("useUser must be used inside UserProvider.");
  }

  return context;
};

// The user provider owns user-related context.
// It does not need to know about other providers in the application.

// ---------------------------------------------------------------------
// 2. Theme provider
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

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
};

export const useTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext);

  if (context === null) {
    throw new Error("useTheme must be used inside ThemeProvider.");
  }

  return context;
};

// The theme provider owns theme-related state independently from user state.

// ---------------------------------------------------------------------
// 3. Session provider
// ---------------------------------------------------------------------

interface Session {
  readonly authenticated: boolean;
  readonly username: string;
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
    authenticated: true,
    username: "John Doe",
  });

  const signOut = (): void => {
    setSession({
      authenticated: false,
      username: "",
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

// Session state is another independent provider concern.

// ---------------------------------------------------------------------
// 4. Compose providers
// ---------------------------------------------------------------------

interface AppProvidersProps {
  readonly children: ReactNode;
}

export const AppProviders: FC<AppProvidersProps> = ({ children }): ReactElement => (
  <UserProvider>
    <ThemeProvider>
      <SessionProvider>{children}</SessionProvider>
    </ThemeProvider>
  </UserProvider>
);

// Each provider remains focused on one concern.
// AppProviders is responsible only for assembling those providers.

// ---------------------------------------------------------------------
// 5. Consume multiple providers
// ---------------------------------------------------------------------

export const UserSummary: FC = (): ReactElement => {
  const { user } = useUser();

  return (
    <section>
      <h2>{user.name}</h2>
      <p>{user.email}</p>
    </section>
  );
};

export const ThemeControl: FC = (): ReactElement => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button type="button" onClick={toggleTheme}>
      Theme: {theme}
    </button>
  );
};

export const SessionControl: FC = (): ReactElement => {
  const { session, signOut } = useSession();

  if (!session.authenticated) {
    return <p>No active session.</p>;
  }

  return (
    <button type="button" onClick={signOut}>
      Sign out {session.username}
    </button>
  );
};

export const Dashboard: FC = (): ReactElement => (
  <main>
    <UserSummary />
    <ThemeControl />
    <SessionControl />
  </main>
);

// A component can consume multiple contexts when it needs values from multiple provider domains.

// ---------------------------------------------------------------------
// 6. Provider composition for a feature
// ---------------------------------------------------------------------

export const DashboardProviders: FC<AppProvidersProps> = ({ children }): ReactElement => (
  <UserProvider>
    <ThemeProvider>{children}</ThemeProvider>
  </UserProvider>
);

export const DashboardFeature: FC = (): ReactElement => (
  <DashboardProviders>
    <Dashboard />
  </DashboardProviders>
);

// Composition can happen at different boundaries.
// A feature can compose only the providers required by that feature.

// ---------------------------------------------------------------------
// 7. Reusable provider composition
// ---------------------------------------------------------------------

interface ProviderCompositionProps {
  readonly children: ReactNode;
}

export const FeatureProviders: FC<ProviderCompositionProps> = ({ children }): ReactElement => (
  <ThemeProvider>
    <SessionProvider>{children}</SessionProvider>
  </ThemeProvider>
);

export const FeatureContent: FC = (): ReactElement => {
  const { theme } = useTheme();
  const { session } = useSession();

  return (
    <section>
      <h2>{session.authenticated ? session.username : "Guest"}</h2>
      <p>Theme: {theme}</p>
    </section>
  );
};

export const FeatureExample: FC = (): ReactElement => (
  <FeatureProviders>
    <FeatureContent />
  </FeatureProviders>
);

// A provider composition component can establish a reusable dependency boundary
// for a particular feature without changing the individual providers.

// ---------------------------------------------------------------------
// 8. Provider ordering
// ---------------------------------------------------------------------

interface PreferencesContextValue {
  readonly compactMode: boolean;
}

const PreferencesContext = createContext<PreferencesContextValue | null>(null);

export const PreferencesProvider: FC<ProviderCompositionProps> = ({ children }): ReactElement => {
  const preferences: PreferencesContextValue = {
    compactMode: true,
  };

  return <PreferencesContext.Provider value={preferences}>{children}</PreferencesContext.Provider>;
};

export const usePreferences = (): PreferencesContextValue => {
  const context = useContext(PreferencesContext);

  if (context === null) {
    throw new Error("usePreferences must be used inside PreferencesProvider.");
  }

  return context;
};

export const OrderedProviders: FC<ProviderCompositionProps> = ({ children }): ReactElement => (
  <UserProvider>
    <PreferencesProvider>
      <ThemeProvider>{children}</ThemeProvider>
    </PreferencesProvider>
  </UserProvider>
);

// Provider nesting establishes the component-tree relationships between contexts.
// A provider can consume another provider's context when its implementation is rendered inside that provider.

// ---------------------------------------------------------------------
// 9. Provider consuming another provider
// ---------------------------------------------------------------------

interface AccountContextValue {
  readonly displayName: string;
}

const AccountContext = createContext<AccountContextValue | null>(null);

export const AccountProvider: FC<ProviderCompositionProps> = ({ children }): ReactElement => {
  const { user } = useUser();

  return <AccountContext.Provider value={{ displayName: user.name }}>{children}</AccountContext.Provider>;
};

export const useAccount = (): AccountContextValue => {
  const context = useContext(AccountContext);

  if (context === null) {
    throw new Error("useAccount must be used inside AccountProvider.");
  }

  return context;
};

export const AccountExample: FC = (): ReactElement => {
  const { displayName } = useAccount();

  return <p>Account: {displayName}</p>;
};

export const AccountProviders: FC<ProviderCompositionProps> = ({ children }): ReactElement => (
  <UserProvider>
    <AccountProvider>{children}</AccountProvider>
  </UserProvider>
);

// AccountProvider consumes UserContext, so UserProvider must appear above it.
// Provider order therefore matters when one provider depends on another.

// ---------------------------------------------------------------------
// 10. Complete provider composition
// ---------------------------------------------------------------------

export const ProviderCompositionDemo: FC = (): ReactElement => (
  <AppProviders>
    <Dashboard />
  </AppProviders>
);

// Provider composition keeps individual providers independent while allowing an application
// or feature to establish all required shared dependencies in one place.

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Provider composition combines independent providers around a shared component subtree.
// - Each provider should own a focused piece of shared state or behavior.
// - A composition component can assemble several providers into one reusable boundary.
// - Components can consume multiple contexts when they need values from multiple provider domains.
// - Different features can define smaller provider compositions containing only their required dependencies.
// - Provider nesting determines which context values are available to descendants.
// - Provider order matters when one provider consumes another provider's context.
// - Composition separates provider implementation from the responsibility of assembling application dependencies.
