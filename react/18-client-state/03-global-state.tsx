/**
 * Global State
 * ============
 *
 * Global state is client-side state that can be accessed or updated by multiple parts of an
 * application without requiring the state to be passed through every intermediate component.
 * It is useful when the same piece of application-owned information is needed across distant
 * branches of the component tree.
 *
 * Global state is not synonymous with server state. A globally accessible value can still be
 * client state when the application owns its updates and lifecycle. Common examples include
 * application preferences, a selected organization, authentication-related UI state, or a
 * shopping-cart representation maintained by the client.
 *
 * React Context is one mechanism for sharing client state across a component subtree, while
 * external state stores can provide application-wide access independent of a particular subtree.
 * The appropriate scope depends on which components need the state and how frequently it changes.
 */

import type { FC, ReactElement, ReactNode } from "react";
import { createContext, useContext, useState } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface ThemeState {
  readonly theme: "light" | "dark";
}

export interface ThemeContextValue {
  readonly theme: "light" | "dark";
  readonly toggleTheme: () => void;
}

export interface ThemeProviderProps {
  readonly children: ReactNode;
}

export interface GlobalThemeConsumerProps {
  readonly label: string;
}

export interface GlobalStateExampleProps {
  readonly initialTheme: "light" | "dark";
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export const GlobalThemeProvider: FC<ThemeProviderProps> = ({ children }): ReactElement => {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  const toggleTheme = (): void => {
    setTheme((currentTheme: "light" | "dark"): "light" | "dark" => (currentTheme === "light" ? "dark" : "light"));
  };

  const contextValue: ThemeContextValue = {
    theme,
    toggleTheme,
  };

  return <ThemeContext.Provider value={contextValue}>{children}</ThemeContext.Provider>;
};

export const GlobalThemeConsumer: FC<GlobalThemeConsumerProps> = ({ label }): ReactElement => {
  const context = useContext(ThemeContext);

  if (context === undefined) {
    throw new Error("GlobalThemeConsumer must be rendered inside GlobalThemeProvider.");
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

export const GlobalStateExample: FC<GlobalStateExampleProps> = ({ initialTheme }): ReactElement => {
  const [theme, setTheme] = useState<"light" | "dark">(initialTheme);

  const toggleTheme = (): void => {
    setTheme((currentTheme: "light" | "dark"): "light" | "dark" => (currentTheme === "light" ? "dark" : "light"));
  };

  return (
    <div>
      <p>Shared application theme: {theme}</p>
      <button type="button" onClick={toggleTheme}>
        Toggle shared theme
      </button>
    </div>
  );
};

export const GlobalStateConsumerPair: FC = (): ReactElement => {
  const context = useContext(ThemeContext);

  if (context === undefined) {
    throw new Error("GlobalStateConsumerPair must be rendered inside GlobalThemeProvider.");
  }

  return (
    <div>
      <GlobalThemeConsumer label="Header" />
      <GlobalThemeConsumer label="Settings panel" />
      <p>Both components read the same global state value: {context.theme}</p>
    </div>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const GlobalStateDemo: FC = (): ReactElement => {
  return (
    <section>
      <h2>1. Client-Owned State Shared Across Components</h2>
      <GlobalThemeProvider>
        <GlobalStateConsumerPair />
      </GlobalThemeProvider>

      <h2>2. Global State as Shared Application Data</h2>
      <GlobalStateExample initialTheme="light" />
    </section>
  );
};

export default GlobalStateDemo;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// Global state is client-side state that multiple parts of an application need to access.
// It avoids repeatedly passing the same state through unrelated intermediate components.
// React Context can share state across a component subtree.
// An external state store can provide shared state without depending on one particular subtree.
// Global accessibility does not make a value server state.
// Global state remains client state when the application owns its updates and lifecycle.
// Global state should not be used merely because a value could be shared.
// State should generally be scoped as narrowly as the application's requirements allow.
// The appropriate state scope depends on which components need the data and how it changes.
