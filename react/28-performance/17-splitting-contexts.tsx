/**
 * Splitting Contexts
 * ==================
 *
 * Splitting contexts means separating unrelated or independently changing values into different
 * React Contexts. This can reduce unnecessary context-driven re-renders because consumers subscribe
 * to the context they actually read instead of receiving every change from one shared context.
 */

import { createContext, useContext, useMemo, useState, type FC, type ReactElement, type ReactNode } from "react";

// ---------------------------------------------------------------------
// 1. A single context can contain unrelated values
// ---------------------------------------------------------------------

interface AppContextValue {
  readonly theme: "light" | "dark";
  readonly language: "en" | "de";
}

const AppContext = createContext<AppContextValue | null>(null);

const SingleContextExample: FC = (): ReactElement => {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [language, setLanguage] = useState<"en" | "de">("en");

  const value = useMemo<AppContextValue>(() => {
    return { theme, language };
  }, [theme, language]);

  return (
    <AppContext.Provider value={value}>
      <section>
        <button type="button" onClick={() => setTheme((current) => (current === "light" ? "dark" : "light"))}>
          Toggle theme
        </button>
        <button type="button" onClick={() => setLanguage((current) => (current === "en" ? "de" : "en"))}>
          Change language
        </button>
        <ThemeConsumer />
        <LanguageConsumer />
      </section>
    </AppContext.Provider>
  );
};

// Both values belong to one context.
// Whenever either theme or language changes, the provider value changes.
// Every consumer of AppContext is then notified of the changed context value.

// ---------------------------------------------------------------------
// 2. A consumer may only need one value
// ---------------------------------------------------------------------

const ThemeConsumer: FC = (): ReactElement => {
  const context = useContext(AppContext);

  if (context === null) {
    throw new Error("ThemeConsumer must be rendered inside AppContext.Provider");
  }

  console.log("ThemeConsumer rendered");

  return <p>Theme: {context.theme}</p>;
};

const LanguageConsumer: FC = (): ReactElement => {
  const context = useContext(AppContext);

  if (context === null) {
    throw new Error("LanguageConsumer must be rendered inside AppContext.Provider");
  }

  console.log("LanguageConsumer rendered");

  return <p>Language: {context.language}</p>;
};

// LanguageConsumer does not read theme, but it still subscribes to the entire AppContext.
// React Context does not automatically select individual properties from a context value.

// ---------------------------------------------------------------------
// 3. Split unrelated values into separate contexts
// ---------------------------------------------------------------------

type Theme = "light" | "dark";
type Language = "en" | "de";

const ThemeContext = createContext<Theme | null>(null);
const LanguageContext = createContext<Language | null>(null);

const SplitContextExample: FC = (): ReactElement => {
  const [theme, setTheme] = useState<Theme>("light");
  const [language, setLanguage] = useState<Language>("en");

  return (
    <ThemeContext.Provider value={theme}>
      <LanguageContext.Provider value={language}>
        <section>
          <button type="button" onClick={() => setTheme((current) => (current === "light" ? "dark" : "light"))}>
            Toggle theme
          </button>
          <button type="button" onClick={() => setLanguage((current) => (current === "en" ? "de" : "en"))}>
            Change language
          </button>
          <SplitThemeConsumer />
          <SplitLanguageConsumer />
        </section>
      </LanguageContext.Provider>
    </ThemeContext.Provider>
  );
};

// Each context now represents one independently changing concern.
// A component that consumes only ThemeContext does not subscribe to LanguageContext.

// ---------------------------------------------------------------------
// 4. Consumers subscribe to the context they read
// ---------------------------------------------------------------------

const SplitThemeConsumer: FC = (): ReactElement => {
  const theme = useContext(ThemeContext);

  if (theme === null) {
    throw new Error("SplitThemeConsumer must be rendered inside ThemeContext.Provider");
  }

  console.log("SplitThemeConsumer rendered");

  return <p>Theme: {theme}</p>;
};

const SplitLanguageConsumer: FC = (): ReactElement => {
  const language = useContext(LanguageContext);

  if (language === null) {
    throw new Error("SplitLanguageConsumer must be rendered inside LanguageContext.Provider");
  }

  console.log("SplitLanguageConsumer rendered");

  return <p>Language: {language}</p>;
};

// Changing the theme context value notifies ThemeContext consumers.
// Changing the language context value notifies LanguageContext consumers.
// This is the primary performance reason for splitting independent contexts.

// ---------------------------------------------------------------------
// 5. Context splitting is most useful for independently changing data
// ---------------------------------------------------------------------

interface User {
  readonly name: string;
}

const UserContext = createContext<User | null>(null);
const ThemePreferenceContext = createContext<Theme | null>(null);

const IndependentStateExample: FC = (): ReactElement => {
  const [user, setUser] = useState<User>({
    name: "John Doe",
  });
  const [theme, setTheme] = useState<Theme>("light");

  return (
    <UserContext.Provider value={user}>
      <ThemePreferenceContext.Provider value={theme}>
        <section>
          <button type="button" onClick={() => setUser({ name: "Jane Doe" })}>
            Change user
          </button>
          <button type="button" onClick={() => setTheme((current) => (current === "light" ? "dark" : "light"))}>
            Toggle theme
          </button>
          <UserDisplay />
          <ThemeDisplay />
        </section>
      </ThemePreferenceContext.Provider>
    </UserContext.Provider>
  );
};

// User and theme can change independently.
// Separating them prevents a theme update from being a context update for UserContext consumers.

// ---------------------------------------------------------------------
// 6. Splitting contexts does not prevent a component from rendering
// ---------------------------------------------------------------------

const CombinedConsumer: FC = (): ReactElement => {
  const user = useContext(UserContext);
  const theme = useContext(ThemePreferenceContext);

  if (user === null || theme === null) {
    throw new Error("CombinedConsumer must be rendered inside both context providers");
  }

  return (
    <p>
      {user.name} — {theme}
    </p>
  );
};

// A component that consumes both contexts subscribes to both.
// Splitting contexts helps consumers that need only one independently changing value.

// ---------------------------------------------------------------------
// 7. Context values can contain state and its updater
// ---------------------------------------------------------------------

interface ThemeContextValue {
  readonly theme: Theme;
  readonly setTheme: (theme: Theme) => void;
}

const ThemeStateContext = createContext<ThemeContextValue | null>(null);

interface ThemeProviderProps {
  readonly children: ReactNode;
}

const ThemeProvider: FC<ThemeProviderProps> = ({ children }): ReactElement => {
  const [theme, setTheme] = useState<Theme>("light");

  const value = useMemo<ThemeContextValue>(() => {
    return { theme, setTheme };
  }, [theme]);

  return <ThemeStateContext.Provider value={value}>{children}</ThemeStateContext.Provider>;
};

// A context can expose both state and the function that changes it.
// However, every consumer of this context still subscribes to the entire context value.

// ---------------------------------------------------------------------
// 8. State and dispatch can be split into separate contexts
// ---------------------------------------------------------------------

type ThemeAction = {
  readonly type: "toggle";
};

const ThemeValueContext = createContext<Theme | null>(null);
const ThemeDispatchContext = createContext<((action: ThemeAction) => void) | null>(null);

const SplitStateAndDispatchProvider: FC<ThemeProviderProps> = ({ children }): ReactElement => {
  const [theme, setTheme] = useState<Theme>("light");

  const dispatch = (action: ThemeAction): void => {
    if (action.type === "toggle") {
      setTheme((current) => (current === "light" ? "dark" : "light"));
    }
  };

  return (
    <ThemeValueContext.Provider value={theme}>
      <ThemeDispatchContext.Provider value={dispatch}>{children}</ThemeDispatchContext.Provider>
    </ThemeValueContext.Provider>
  );
};

// The state context changes when theme changes.
// The dispatch function can retain its reference because it does not need to be recreated
// for each theme value when defined outside the state-dependent render data.

// ---------------------------------------------------------------------
// 9. A dispatch-only consumer can subscribe only to dispatch
// ---------------------------------------------------------------------

const ThemeToggle: FC = (): ReactElement => {
  const dispatch = useContext(ThemeDispatchContext);

  if (dispatch === null) {
    throw new Error("ThemeToggle must be rendered inside ThemeDispatchContext.Provider");
  }

  console.log("ThemeToggle rendered");

  return (
    <button type="button" onClick={() => dispatch({ type: "toggle" })}>
      Toggle theme
    </button>
  );
};

const ThemeDisplay: FC = (): ReactElement => {
  const theme = useContext(ThemePreferenceContext);

  if (theme === null) {
    throw new Error("ThemeDisplay must be rendered inside ThemePreferenceContext.Provider");
  }

  console.log("ThemeDisplay rendered");

  return <p>Theme: {theme}</p>;
};

const UserDisplay: FC = (): ReactElement => {
  const user = useContext(UserContext);

  if (user === null) {
    throw new Error("UserDisplay must be rendered inside UserContext.Provider");
  }

  console.log("UserDisplay rendered");

  return <p>User: {user.name}</p>;
};

// A component that only dispatches actions does not need the current theme value.
// Separating dispatch from state can therefore make the subscription boundary more precise.

// ---------------------------------------------------------------------
// 10. Stable dispatch references matter
// ---------------------------------------------------------------------

const StableDispatchProvider: FC<ThemeProviderProps> = ({ children }): ReactElement => {
  const [theme, setTheme] = useState<Theme>("light");

  const dispatch = useMemo(() => {
    return (action: ThemeAction): void => {
      if (action.type === "toggle") {
        setTheme((current) => (current === "light" ? "dark" : "light"));
      }
    };
  }, []);

  return (
    <ThemeValueContext.Provider value={theme}>
      <ThemeDispatchContext.Provider value={dispatch}>{children}</ThemeDispatchContext.Provider>
    </ThemeValueContext.Provider>
  );
};

// Because dispatch uses the functional state-update form, it does not need to capture theme.
// Its reference can therefore remain stable across theme updates.
// This can prevent dispatch-only consumers from receiving a changed context value.

// ---------------------------------------------------------------------
// 11. Splitting contexts does not replace stable provider values
// ---------------------------------------------------------------------

interface UserContextValue {
  readonly user: User;
  readonly role: "user" | "admin";
}

const UserDetailsContext = createContext<UserContextValue | null>(null);

const UserProvider: FC<ThemeProviderProps> = ({ children }): ReactElement => {
  const [user] = useState<User>({
    name: "John Doe",
  });

  const value = useMemo<UserContextValue>(() => {
    return {
      user,
      role: "user",
    };
  }, [user]);

  return <UserDetailsContext.Provider value={value}>{children}</UserDetailsContext.Provider>;
};

// Splitting contexts addresses which values share a subscription.
// useMemo can separately address whether a provider creates a new object value unnecessarily.

// ---------------------------------------------------------------------
// 12. Avoid one large context for unrelated application state
// ---------------------------------------------------------------------

interface ApplicationContextValue {
  readonly user: User;
  readonly theme: Theme;
  readonly language: Language;
  readonly notifications: number;
  readonly sidebarOpen: boolean;
}

const ApplicationContext = createContext<ApplicationContextValue | null>(null);

const LargeContextExample: FC = (): ReactElement => {
  const value: ApplicationContextValue = {
    user: { name: "John Doe" },
    theme: "light",
    language: "en",
    notifications: 3,
    sidebarOpen: true,
  };

  return (
    <ApplicationContext.Provider value={value}>
      <section>
        <p>Application state is available here.</p>
      </section>
    </ApplicationContext.Provider>
  );
};

// A single context containing many independently changing concerns creates a broad subscription boundary.
// As the application grows, separating unrelated concerns can make update propagation more targeted.

// ---------------------------------------------------------------------
// 13. Group values that actually belong together
// ---------------------------------------------------------------------

interface UserPreferences {
  readonly language: Language;
  readonly theme: Theme;
}

const UserPreferencesContext = createContext<UserPreferences | null>(null);

const PreferencesExample: FC = (): ReactElement => {
  const preferences: UserPreferences = {
    language: "en",
    theme: "light",
  };

  return (
    <UserPreferencesContext.Provider value={preferences}>
      <PreferencesDisplay />
    </UserPreferencesContext.Provider>
  );
};

const PreferencesDisplay: FC = (): ReactElement => {
  const preferences = useContext(UserPreferencesContext);

  if (preferences === null) {
    throw new Error("PreferencesDisplay must be rendered inside UserPreferencesContext.Provider");
  }

  return (
    <p>
      {preferences.language} — {preferences.theme}
    </p>
  );
};

// Contexts do not need to contain exactly one primitive value.
// Values that are conceptually related and normally change together can reasonably share a context.

// ---------------------------------------------------------------------
// 14. Split contexts according to update frequency and consumer needs
// ---------------------------------------------------------------------

const FrequentlyChangingContext = createContext<number | null>(null);
const RarelyChangingContext = createContext<string | null>(null);

const UpdateFrequencyExample: FC = (): ReactElement => {
  const [count, setCount] = useState(0);
  const applicationName = "Example App";

  return (
    <FrequentlyChangingContext.Provider value={count}>
      <RarelyChangingContext.Provider value={applicationName}>
        <section>
          <button type="button" onClick={() => setCount((value) => value + 1)}>
            Increment
          </button>
          <FrequentlyChangingConsumer />
          <RarelyChangingConsumer />
        </section>
      </RarelyChangingContext.Provider>
    </FrequentlyChangingContext.Provider>
  );
};

const FrequentlyChangingConsumer: FC = (): ReactElement => {
  const count = useContext(FrequentlyChangingContext);

  if (count === null) {
    throw new Error("FrequentlyChangingConsumer must be rendered inside its provider");
  }

  return <p>Count: {count}</p>;
};

const RarelyChangingConsumer: FC = (): ReactElement => {
  const applicationName = useContext(RarelyChangingContext);

  if (applicationName === null) {
    throw new Error("RarelyChangingConsumer must be rendered inside its provider");
  }

  return <p>Application: {applicationName}</p>;
};

// Values with different update patterns can be separated when their consumers do not overlap.
// The goal is not to maximize the number of contexts, but to create useful subscription boundaries.

// ---------------------------------------------------------------------
// 15. Provider nesting is a tradeoff
// ---------------------------------------------------------------------

const NestedProvidersExample: FC = (): ReactElement => {
  return (
    <ThemeProvider>
      <UserProvider>
        <section>
          <p>Multiple independent providers can be composed.</p>
        </section>
      </UserProvider>
    </ThemeProvider>
  );
};

// Splitting contexts introduces additional providers.
// Excessive provider nesting can make component composition harder to understand,
// so contexts should be split according to meaningful state boundaries rather than arbitrarily.

// ---------------------------------------------------------------------
// 16. Custom Hooks can hide provider and context details
// ---------------------------------------------------------------------

const useTheme = (): Theme => {
  const theme = useContext(ThemeValueContext);

  if (theme === null) {
    throw new Error("useTheme must be used inside ThemeValueContext.Provider");
  }

  return theme;
};

const useThemeDispatch = (): ((action: ThemeAction) => void) => {
  const dispatch = useContext(ThemeDispatchContext);

  if (dispatch === null) {
    throw new Error("useThemeDispatch must be used inside ThemeDispatchContext.Provider");
  }

  return dispatch;
};

const CustomContextHooksExample: FC = (): ReactElement => {
  const theme = useTheme();
  const dispatch = useThemeDispatch();

  return (
    <section>
      <p>Theme: {theme}</p>
      <button type="button" onClick={() => dispatch({ type: "toggle" })}>
        Toggle
      </button>
    </section>
  );
};

// Custom Hooks can provide a clean API while keeping context access and provider validation centralized.
// They do not change the underlying context subscription behavior.

// ---------------------------------------------------------------------
// 17. Context splitting is not the same as context selectors
// ---------------------------------------------------------------------

interface StoreValue {
  readonly user: User;
  readonly theme: Theme;
}

const StoreContext = createContext<StoreValue | null>(null);

const StoreConsumer: FC = (): ReactElement => {
  const store = useContext(StoreContext);

  if (store === null) {
    throw new Error("StoreConsumer must be rendered inside StoreContext.Provider");
  }

  return <p>{store.user.name}</p>;
};

// useContext subscribes to the context value as a whole.
// Splitting contexts creates multiple subscription boundaries.
// A context-selector mechanism is a different pattern in which a consumer selects part of one store value.

// ---------------------------------------------------------------------
// 18. Splitting contexts is not automatically faster
// ---------------------------------------------------------------------

const SmallContextExample: FC = (): ReactElement => {
  const [value, setValue] = useState(0);

  return (
    <ThemeValueContext.Provider value="light">
      <section>
        <p>{value}</p>
        <button type="button" onClick={() => setValue((current) => current + 1)}>
          Increment
        </button>
      </section>
    </ThemeValueContext.Provider>
  );
};

// Context splitting has a structural cost: more providers and more conceptual boundaries.
// If the values always change together and all consumers need them together, splitting may provide little benefit.

// ---------------------------------------------------------------------
// 19. Measure context-driven rendering before optimizing
// ---------------------------------------------------------------------

const MeasuredContextConsumer: FC = (): ReactElement => {
  const theme = useTheme();

  console.log("MeasuredContextConsumer rendered:", theme);

  return <p>Theme: {theme}</p>;
};

const MeasurementExample: FC = (): ReactElement => {
  const [theme, setTheme] = useState<Theme>("light");

  return (
    <ThemeValueContext.Provider value={theme}>
      <section>
        <button type="button" onClick={() => setTheme((current) => (current === "light" ? "dark" : "light"))}>
          Toggle
        </button>
        <MeasuredContextConsumer />
      </section>
    </ThemeValueContext.Provider>
  );
};

// Console logging can reveal render frequency during a simple investigation.
// React DevTools Profiler can provide more useful information about actual rendering costs
// in a representative application.

// ---------------------------------------------------------------------
// 20. Integrated example
// ---------------------------------------------------------------------

interface Session {
  readonly userName: string;
}

const SessionContext = createContext<Session | null>(null);
const AppThemeContext = createContext<Theme | null>(null);
const AppLanguageContext = createContext<Language | null>(null);

const SessionDisplay: FC = (): ReactElement => {
  const session = useContext(SessionContext);

  if (session === null) {
    throw new Error("SessionDisplay must be rendered inside SessionContext.Provider");
  }

  return <p>Signed in as: {session.userName}</p>;
};

const AppThemeDisplay: FC = (): ReactElement => {
  const theme = useContext(AppThemeContext);

  if (theme === null) {
    throw new Error("AppThemeDisplay must be rendered inside AppThemeContext.Provider");
  }

  return <p>Theme: {theme}</p>;
};

const AppLanguageDisplay: FC = (): ReactElement => {
  const language = useContext(AppLanguageContext);

  if (language === null) {
    throw new Error("AppLanguageDisplay must be rendered inside AppLanguageContext.Provider");
  }

  return <p>Language: {language}</p>;
};

const SplittingContextsDemo: FC = (): ReactElement => {
  const [session] = useState<Session>({
    userName: "John Doe",
  });
  const [theme, setTheme] = useState<Theme>("light");
  const [language, setLanguage] = useState<Language>("en");

  return (
    <SessionContext.Provider value={session}>
      <AppThemeContext.Provider value={theme}>
        <AppLanguageContext.Provider value={language}>
          <main>
            <h1>Splitting Contexts</h1>

            <button type="button" onClick={() => setTheme((current) => (current === "light" ? "dark" : "light"))}>
              Toggle theme
            </button>

            <button type="button" onClick={() => setLanguage((current) => (current === "en" ? "de" : "en"))}>
              Change language
            </button>

            <SessionDisplay />
            <AppThemeDisplay />
            <AppLanguageDisplay />
          </main>
        </AppLanguageContext.Provider>
      </AppThemeContext.Provider>
    </SessionContext.Provider>
  );
};

export default SplittingContextsDemo;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - A React Context creates a subscription boundary around its provided value.
// - useContext does not automatically subscribe to only the property a component reads.
// - Changing a context value notifies consumers of that context.
// - Splitting unrelated values into separate contexts can reduce unnecessary context-driven updates.
// - Consumers that use only one split context do not subscribe to changes in the other contexts.
// - A component consuming multiple contexts subscribes to each of those contexts.
// - State and dispatch can be separated into different contexts when consumers have different needs.
// - A stable dispatch function can prevent dispatch-only consumers from receiving unnecessary context value changes.
// - useMemo can stabilize an object-valued provider when its constituent values have not changed.
// - Context splitting and provider-value memoization solve different identity and subscription problems.
// - Related values that normally change together can reasonably remain in the same context.
// - Splitting contexts according to update frequency and consumer needs can create more useful subscription boundaries.
// - Excessive context splitting introduces additional providers and architectural complexity.
// - Context splitting does not automatically make an application faster.
// - Context splitting is different from context-selector patterns, which select part of one context value.
// - Custom Hooks can hide context access and provider validation without changing context subscription semantics.
// - Performance decisions should be based on measured rendering work and actual consumer relationships.
