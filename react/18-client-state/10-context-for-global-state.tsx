/**
 * Context for Global State
 * ========================
 *
 * React Context provides a mechanism for making a value available to components throughout a
 * component subtree without passing that value explicitly through every intermediate component.
 * It is commonly used to provide client-side state and the operations that update that state.
 *
 * A context consists of a context object, a Provider that supplies its value, and consumers that
 * read the nearest Provider value. When the Provider's value changes, React re-renders consumers
 * that read that context so they can observe the latest value.
 *
 * Context is a dependency-injection mechanism, not a state-management system by itself. State is
 * typically created with useState or another state mechanism and then exposed through Context.
 * Context is therefore useful for sharing state across a subtree, but it does not automatically
 * provide features such as normalized state, middleware, persistence, or advanced store semantics.
 */

import type { FC, ReactElement, ReactNode } from "react";
import { createContext, useContext, useState } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface ThemeContextValue {
  readonly theme: "light" | "dark";
  readonly toggleTheme: () => void;
}

export interface ThemeProviderProps {
  readonly children: ReactNode;
  readonly initialTheme: "light" | "dark";
}

export interface ThemeConsumerProps {
  readonly label: string;
}

export interface ContextDescriptionProps {
  readonly title: string;
  readonly description: string;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export const ThemeProvider: FC<ThemeProviderProps> = ({ children, initialTheme }): ReactElement => {
  const [theme, setTheme] = useState<"light" | "dark">(initialTheme);

  const toggleTheme = (): void => {
    setTheme((currentTheme: "light" | "dark"): "light" | "dark" => (currentTheme === "light" ? "dark" : "light"));
  };

  const contextValue: ThemeContextValue = {
    theme,
    toggleTheme,
  };

  return <ThemeContext.Provider value={contextValue}>{children}</ThemeContext.Provider>;
};

export const ThemeConsumer: FC<ThemeConsumerProps> = ({ label }): ReactElement => {
  const context: ThemeContextValue | undefined = useContext(ThemeContext);

  if (context === undefined) {
    throw new Error("ThemeConsumer must be rendered inside ThemeProvider.");
  }

  return (
    <div>
      <p>
        {label}: {context.theme}
      </p>
      <button type="button" onClick={context.toggleTheme}>
        Toggle theme
      </button>
    </div>
  );
};

export const ContextDescription: FC<ContextDescriptionProps> = ({ title, description }): ReactElement => {
  return (
    <article>
      <h3>{title}</h3>
      <p>{description}</p>
    </article>
  );
};

export const DeepThemeConsumer: FC = (): ReactElement => {
  return (
    <div>
      <ThemeConsumer label="Deep component" />
    </div>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const ContextForGlobalStateDemo: FC = (): ReactElement => {
  return (
    <section>
      <h2>1. Providing Global State Through Context</h2>
      <ContextDescription
        title="Context Provider"
        description="The provider makes the theme state and its update operation available to every consumer in its subtree."
      />
      <ThemeProvider initialTheme="light">
        <ThemeConsumer label="Header" />
        <ThemeConsumer label="Settings panel" />
      </ThemeProvider>

      <h2>2. Consuming Shared State Without Prop Drilling</h2>
      <ContextDescription
        title="Context consumer"
        description="A component can read the nearest context value directly, even when intermediate components do not receive or forward the value as props."
      />
      <ThemeProvider initialTheme="dark">
        <DeepThemeConsumer />
      </ThemeProvider>

      <h2>3. Context Scope Is Defined by the Provider</h2>
      <ContextDescription
        title="Provider boundaries"
        description="Only components rendered inside a particular provider receive that provider's value. Different providers can maintain independent state for separate subtrees."
      />

      <h2>4. Context Does Not Replace State Management</h2>
      <ContextDescription
        title="Sharing mechanism"
        description="Context distributes a value through a component subtree. The state itself is created and updated by a separate state mechanism such as useState."
      />
    </section>
  );
};

export default ContextForGlobalStateDemo;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// React Context makes a value available to components within a provider's subtree.
// A context consists of a context object, a provider, and consumers.
// useContext reads the nearest matching provider value above the consuming component.
// Context can prevent unnecessary prop drilling through intermediate components.
// A provider establishes the scope in which its value is available.
// Different providers can maintain independent state for separate component subtrees.
// Context can expose both state values and operations that update those values.
// Context itself does not create or manage state; it distributes a value.
// Context does not inherently provide persistence, middleware, normalization, or advanced store features.
// Context is useful when multiple components in a subtree need the same client-owned value.
