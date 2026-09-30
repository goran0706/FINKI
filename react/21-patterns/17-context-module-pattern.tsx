/**
 * Context Module Pattern
 * ======================
 *
 * The Context Module pattern groups a context, its provider, and its consumer hook into
 * one cohesive module. The module exposes the feature's public API while keeping the
 * context object and implementation details private.
 */

import { createContext, useContext, useState, type FC, type ReactElement, type ReactNode } from "react";

// ---------------------------------------------------------------------
// 1. Define the feature types
// ---------------------------------------------------------------------

interface User {
  readonly name: string;
  readonly email: string;
}

interface UserContextValue {
  readonly user: User;
}

// The context type describes the value shared by the provider and its consumers.
// The context itself remains private to the module.

// ---------------------------------------------------------------------
// 2. Create the private context
// ---------------------------------------------------------------------

const UserContext = createContext<UserContextValue | null>(null);

// Consumers outside this module do not need direct access to UserContext.
// They use the exported hook instead.

// ---------------------------------------------------------------------
// 3. Create the provider
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

// The provider is part of the module's public API.
// Its implementation can change without requiring consumers to know how the value is created.

// ---------------------------------------------------------------------
// 4. Create the consumer hook
// ---------------------------------------------------------------------

export const useUser = (): UserContextValue => {
  const context = useContext(UserContext);

  if (context === null) {
    throw new Error("useUser must be used inside UserProvider.");
  }

  return context;
};

// The hook is the public access point for the context.
// It also guarantees that consumers receive a valid value.

// ---------------------------------------------------------------------
// 5. Consume the module API
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

export const UserPanel: FC = (): ReactElement => (
  <section>
    <h2>User Panel</h2>
    <UserProfile />
  </section>
);

export const UserModuleExample: FC = (): ReactElement => (
  <UserProvider>
    <UserPanel />
  </UserProvider>
);

// The consuming component only depends on UserProvider and useUser.
// The underlying UserContext object remains an implementation detail.

// ---------------------------------------------------------------------
// 6. Module-owned state
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

// The context, provider, and hook form one feature boundary.
// Consumers do not need to know that ThemeContext exists.

// ---------------------------------------------------------------------
// 7. Consume the theme module
// ---------------------------------------------------------------------

export const ThemeToggle: FC = (): ReactElement => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button type="button" onClick={toggleTheme}>
      Theme: {theme}
    </button>
  );
};

export const ThemeContent: FC = (): ReactElement => {
  const { theme } = useTheme();

  return (
    <main>
      <h2>{theme === "light" ? "Light mode" : "Dark mode"}</h2>
      <ThemeToggle />
    </main>
  );
};

export const ThemeModuleExample: FC = (): ReactElement => (
  <ThemeProvider>
    <ThemeContent />
  </ThemeProvider>
);

// The feature's public API consists of the provider and consumer hook.
// Internal context details remain hidden from consumers.

// ---------------------------------------------------------------------
// 8. Module with state and actions
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

// The module hides both the context object and the state-management details.
// Consumers interact with the feature through useSession.

// ---------------------------------------------------------------------
// 9. Session consumers
// ---------------------------------------------------------------------

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

export const SessionModuleExample: FC = (): ReactElement => (
  <SessionProvider>
    <SessionStatus />
    <SessionControls />
  </SessionProvider>
);

// Multiple consumers can use the same public hook without depending on the private context.

// ---------------------------------------------------------------------
// 10. Feature-level API
// ---------------------------------------------------------------------

export const UserFeature: FC = (): ReactElement => (
  <UserProvider>
    <UserPanel />
  </UserProvider>
);

export const ThemeFeature: FC = (): ReactElement => (
  <ThemeProvider>
    <ThemeContent />
  </ThemeProvider>
);

export const SessionFeature: FC = (): ReactElement => (
  <SessionProvider>
    <SessionStatus />
    <SessionControls />
  </SessionProvider>
);

// The module can expose a small, stable API while keeping implementation details private.

// ---------------------------------------------------------------------
// 11. Context module boundary
// ---------------------------------------------------------------------

export const ContextModulePatternDemo: FC = (): ReactElement => (
  <div>
    <UserFeature />
    <ThemeFeature />
    <SessionFeature />
  </div>
);

// Each feature groups its context, provider, and consumer hook into one conceptual module.
// This keeps related implementation details together and gives consumers a focused interface.

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - The Context Module pattern groups a context, provider, and consumer hook into one feature boundary.
// - The context object can remain private while the provider and hook form the public API.
// - The provider owns the shared value and makes it available to a component subtree.
// - The consumer hook centralizes useContext and provider validation.
// - Consumers depend on the feature API instead of the underlying context implementation.
// - The module can encapsulate state, derived values, and actions behind the same boundary.
// - Keeping related context logic together makes the feature easier to consume and change independently.
// - The pattern is especially useful when a shared context represents a cohesive domain or feature.
