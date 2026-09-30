/**
 * Context Consumer
 * ================
 *
 * `Context.Consumer` is a legacy React component that allows components to subscribe to context
 * changes within a class component or functional component without using the `useContext` hook.
 * It uses the render prop pattern, requiring a function as its child component.
 *
 * While `useContext` is the modern standard for functional components, understanding `Context.Consumer`
 * remains important for maintaining legacy codebases and comprehending how render props facilitate
 * implicit state subscription in JSX subtrees.
 */

import React, { createContext, useState } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface UserPreferences {
  readonly language: string;
  readonly currency: string;
}

// ---------------------------------------------------------------------
// 2. Context Creation
// ---------------------------------------------------------------------

export const defaultPreferences: UserPreferences = {
  language: "English",
  currency: "USD",
};

export const PreferencesContext = createContext<UserPreferences>(defaultPreferences);

// ---------------------------------------------------------------------
// 3. Component Implementations
// ---------------------------------------------------------------------

export const PreferenceViewer: React.FC = () => {
  // Explicit Context.Consumer usage employing the render prop pattern
  return (
    <PreferencesContext.Consumer>
      {(preferences) => (
        <div>
          <h4>User Preferences (via Context.Consumer)</h4>
          <p>Language: {preferences.language}</p>
          <p>Currency: {preferences.currency}</p>
        </div>
      )}
    </PreferencesContext.Consumer>
  );
};

// ---------------------------------------------------------------------
// 4. Main Container Component
// ---------------------------------------------------------------------

export const ContextConsumerContainer: React.FC = () => {
  const [preferences, setPreferences] = useState<UserPreferences>({
    language: "English",
    currency: "USD",
  });

  const toggleRegion = (): void => {
    setPreferences((prev) =>
      prev.currency === "USD" ? { language: "German", currency: "EUR" } : { language: "English", currency: "USD" },
    );
  };

  return (
    <div>
      <h1>18 - Context Consumer</h1>

      <h2>1. Consuming Context via Render Prop with Context.Consumer</h2>
      <PreferencesContext.Provider value={preferences}>
        <PreferenceViewer />
      </PreferencesContext.Provider>

      <button type="button" onClick={toggleRegion}>
        Toggle Region Preferences
      </button>
    </div>
  );
};

export default ContextConsumerContainer;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Context.Consumer subscribes to context changes using the render prop pattern.
// - The child of Context.Consumer must be a function receiving the current context value.
// - Render prop consumers execute automatically whenever the parent provider value updates.
// - Context.Consumer is legacy syntax; modern functional components favor useContext.
// - Understanding Context.Consumer supports working with legacy React context patterns.
