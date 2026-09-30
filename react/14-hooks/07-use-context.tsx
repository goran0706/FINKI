/**
 * useContext
 * ==========
 *
 * `useContext` reads and subscribes a component to a context value created by
 * `createContext`. React searches upward through the rendered component tree
 * for the nearest matching context provider and returns that provider's
 * current value.
 *
 * A context provider supplies a value to every descendant in its subtree.
 * Nested providers override the value from an outer provider for their own
 * descendants. A component rendered without a matching provider receives the
 * default value passed to `createContext`.
 *
 * Context is useful for values that many components need without explicitly
 * passing them through every intermediate component. Common examples include
 * themes, locale settings, and application-level configuration.
 *
 * Context values are compared by identity. If a provider supplies a newly
 * created object on every render, consumers can re-render because the object
 * reference changed even when its contents are equal. `useMemo` can stabilize
 * an object value when its dependencies have not changed.
 *
 * `useContext` reads the provider associated with the component's position in
 * the tree. A provider returned by the same component does not affect that
 * component's own `useContext` call; the provider must be above the consumer
 * in the rendered tree.
 */

import { createContext, type FC, type ReactNode, useContext, useMemo, useState } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface ThemeContextValue {
  readonly theme: "light" | "dark";
  readonly toggleTheme: () => void;
}

export interface ThemeProviderProps {
  readonly children: ReactNode;
}

export interface ThemeConsumerProps {
  readonly label: string;
}

export interface UserContextValue {
  readonly name: string;
  readonly email: string;
}

export interface UserProviderProps {
  readonly children: ReactNode;
  readonly user: UserContextValue;
}

export interface NestedProviderProps {
  readonly children: ReactNode;
}

export interface ContextDefaultValueProps {
  readonly label: string;
}

export interface ContextValueProviderProps {
  readonly children: ReactNode;
  readonly theme: "light" | "dark";
}

export interface ContextValueConsumerProps {
  readonly label: string;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

export const ThemeContext = createContext<ThemeContextValue | null>(null);

export const UserContext = createContext<UserContextValue | null>(null);

/**
 * Provides a theme value and a function for changing that value to all
 * descendants that consume `ThemeContext`.
 */
export const ThemeProvider: FC<ThemeProviderProps> = ({ children }: ThemeProviderProps): ReactNode => {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  const toggleTheme = (): void => {
    setTheme((previousTheme: "light" | "dark"): "light" | "dark" => (previousTheme === "light" ? "dark" : "light"));
  };

  const contextValue: ThemeContextValue = useMemo<ThemeContextValue>(
    (): ThemeContextValue => ({
      theme,
      toggleTheme,
    }),
    [theme],
  );

  return <ThemeContext.Provider value={contextValue}>{children}</ThemeContext.Provider>;
};

/**
 * Reads the nearest `ThemeContext` value. The null check demonstrates the
 * behavior that occurs when this component is rendered without a provider.
 */
export const ThemeConsumerExample: FC<ThemeConsumerProps> = ({ label }: ThemeConsumerProps): ReactNode => {
  const context: ThemeContextValue | null = useContext(ThemeContext);

  if (context === null) {
    return (
      <section>
        <h3>{label}</h3>
        <p>No ThemeContext provider is available.</p>
      </section>
    );
  }

  return (
    <section>
      <h3>{label}</h3>
      <p>Current theme: {context.theme}</p>
      <button type="button" onClick={context.toggleTheme}>
        Toggle theme
      </button>
    </section>
  );
};

/**
 * Provides user data through context so descendants can read the same value
 * without receiving it through intermediate component props.
 */
export const UserProvider: FC<UserProviderProps> = ({ children, user }: UserProviderProps): ReactNode => {
  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
};

/**
 * Reads user data from the nearest `UserContext` provider.
 */
export const UserConsumerExample: FC<ThemeConsumerProps> = ({ label }: ThemeConsumerProps): ReactNode => {
  const user: UserContextValue | null = useContext(UserContext);

  if (user === null) {
    return (
      <section>
        <h3>{label}</h3>
        <p>No UserContext provider is available.</p>
      </section>
    );
  }

  return (
    <section>
      <h3>{label}</h3>
      <p>Name: {user.name}</p>
      <p>Email: {user.email}</p>
    </section>
  );
};

/**
 * Demonstrates provider nesting. The nested provider supplies `dark` to its
 * descendants while consumers outside that provider continue reading the
 * outer provider's value.
 */
export const NestedThemeProviderExample: FC<NestedProviderProps> = ({ children }: NestedProviderProps): ReactNode => {
  const outerContextValue: ThemeContextValue = {
    theme: "light",
    toggleTheme: (): void => undefined,
  };

  const innerContextValue: ThemeContextValue = {
    theme: "dark",
    toggleTheme: (): void => undefined,
  };

  return (
    <ThemeContext.Provider value={outerContextValue}>
      <section>
        <h3>Outer provider</h3>
        <ThemeConsumerExample label="Outer consumer" />

        <ThemeContext.Provider value={innerContextValue}>
          <h3>Nested provider</h3>
          {children}
        </ThemeContext.Provider>
      </section>
    </ThemeContext.Provider>
  );
};

/**
 * Demonstrates the default context value by rendering a consumer without a
 * matching provider.
 */
export const DefaultContextValueExample: FC<ContextDefaultValueProps> = ({
  label,
}: ContextDefaultValueProps): ReactNode => {
  const context: ThemeContextValue | null = useContext(ThemeContext);

  return (
    <section>
      <h3>{label}</h3>
      <p>{context === null ? "The context default value is null." : `Theme: ${context.theme}`}</p>
    </section>
  );
};

/**
 * Provides a memoized object as a context value. The object reference remains
 * stable when `theme` does not change, which avoids context updates caused
 * solely by recreating the value object.
 */
export const MemoizedContextValueExample: FC<ContextValueProviderProps> = ({
  children,
  theme,
}: ContextValueProviderProps): ReactNode => {
  const toggleTheme = (): void => undefined;

  const contextValue: ThemeContextValue = useMemo<ThemeContextValue>(
    (): ThemeContextValue => ({
      theme,
      toggleTheme,
    }),
    [theme],
  );

  return <ThemeContext.Provider value={contextValue}>{children}</ThemeContext.Provider>;
};

/**
 * Reads the memoized context value supplied by an ancestor provider.
 */
export const ContextValueConsumerExample: FC<ContextValueConsumerProps> = ({
  label,
}: ContextValueConsumerProps): ReactNode => {
  const context: ThemeContextValue | null = useContext(ThemeContext);

  return (
    <section>
      <h3>{label}</h3>
      <p>{context === null ? "No context value." : `Consumed theme: ${context.theme}`}</p>
    </section>
  );
};

/**
 * Demonstrates the provider-boundary rule. The component reads context before
 * rendering its provider, so its `useContext` call cannot consume the provider
 * that it returns.
 */
export const ProviderBoundaryExample: FC = (): ReactNode => {
  const context: ThemeContextValue | null = useContext(ThemeContext);

  const localContextValue: ThemeContextValue = {
    theme: "dark",
    toggleTheme: (): void => undefined,
  };

  return (
    <section>
      <h3>Provider boundary</h3>
      <p>Current component sees: {context === null ? "default value" : context.theme}</p>

      <ThemeContext.Provider value={localContextValue}>
        <ContextValueConsumerExample label="Child sees the provider value" />
      </ThemeContext.Provider>
    </section>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const UseContextContainer: FC = (): ReactNode => {
  const user: UserContextValue = {
    name: "John Doe",
    email: "john@example.com",
  };

  return (
    <main>
      <h1>useContext</h1>

      <h2>1. Reading a shared context value</h2>
      <ThemeProvider>
        <ThemeConsumerExample label="Theme consumer" />
      </ThemeProvider>

      <h2>2. Providing application data through context</h2>
      <UserProvider user={user}>
        <UserConsumerExample label="User consumer" />
      </UserProvider>

      <h2>3. Reading the nearest nested provider</h2>
      <NestedThemeProviderExample>
        <ThemeConsumerExample label="Nested consumer" />
      </NestedThemeProviderExample>

      <h2>4. Using the context default value</h2>
      <DefaultContextValueExample label="Consumer without provider" />

      <h2>5. Stabilizing an object context value</h2>
      <MemoizedContextValueExample theme="dark">
        <ContextValueConsumerExample label="Memoized context consumer" />
      </MemoizedContextValueExample>

      <h2>6. Understanding the provider boundary</h2>
      <ProviderBoundaryExample />
    </main>
  );
};

export default UseContextContainer;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - `useContext` reads the nearest matching provider's value.
// - Context avoids manually passing shared values through intermediate components.
// - Nested providers override the value for their descendant subtree.
// - Consumers without a provider receive the context's default value.
// - Context values are compared by identity.
// - Memoizing object context values can prevent unnecessary consumer updates.
// - A provider returned by a component does not affect that component's own `useContext` call.
// - Context is useful for shared values such as themes, users, and configuration.
