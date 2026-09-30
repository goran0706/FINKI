/**
 * Context
 * =======
 *
 * React Context provides a way to pass data through the component tree without having to pass props
 * manually at every level. It is designed to share data that can be considered global or broadly
 * required for a tree of components, such as current authenticated user, theme, or language settings.
 *
 * Context creates a direct pipeline between a provider component and downstream consumer components.
 * Consuming components subscribe to context changes, re-rendering automatically whenever the context
 * value updates, bypassing non-consuming intermediary components entirely.
 */

import React, { createContext, useContext, useState } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface ThemeContextType {
  readonly theme: "light" | "dark";
  readonly toggleTheme: () => void;
}

// ---------------------------------------------------------------------
// 2. Context Creation
// ---------------------------------------------------------------------

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// ---------------------------------------------------------------------
// 3. Component Implementations
// ---------------------------------------------------------------------

export const ThemeCard: React.FC = () => {
  // Direct context consumption: Bypasses intermediate props entirely
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("ThemeCard must be used within a ThemeContext provider");
  }

  const { theme, toggleTheme } = context;

  return (
    <div>
      <p>Current Theme: {theme.toUpperCase()}</p>
      <button type="button" onClick={toggleTheme}>
        Toggle Theme
      </button>
    </div>
  );
};

export const IntermediaryLayout: React.FC = () => {
  // Intermediary component: Agnostic of theme data, passes no theme props
  return (
    <div>
      <h4>Intermediary Layout (No Props Forwarded)</h4>
      <ThemeCard />
    </div>
  );
};

// ---------------------------------------------------------------------
// 4. Main Container Component
// ---------------------------------------------------------------------

export const ContextProvider: React.FC = () => {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  const toggleTheme = (): void => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div>
        <h1>13 - Context</h1>

        <h2>1. Broad Context Provider Bypassing Intermediary Components</h2>
        <IntermediaryLayout />
      </div>
    </ThemeContext.Provider>
  );
};

export default ContextProvider;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - React Context provides broad data sharing without explicit prop drilling.
// - Context creates a direct pipeline between provider ancestors and consumer descendants.
// - Descendant components subscribe to context values and re-render when values update.
// - Intermediary components remain uncoupled from context data structures.
// - Context is ideal for global or sub-tree state like themes, auth status, or localization.
