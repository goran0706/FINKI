/**
 * Context Hook
 * ============
 *
 * A custom context hook encapsulates the `useContext` call and provides a clean, self-documenting
 * API for consumer components. Consuming context directly via `useContext(MyContext)` across
 * multiple files duplicates boundary checks and exposes raw context objects to components.
 *
 * By abstracting `useContext` inside a dedicated custom hook, you can enforce runtime assertions
 * verifying that the hook executes inside an active Provider tree. This eliminates repetitive
 * `undefined` checks in consumers while providing a streamlined interface.
 */

import React, { createContext, ReactNode, useContext, useState } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface FeatureFlags {
  readonly enableBetaUI: boolean;
  readonly enableAnalytics: boolean;
}

export interface FeatureFlagsContextType {
  readonly flags: FeatureFlags;
  readonly toggleFlag: (flagKey: keyof FeatureFlags) => void;
}

export interface FeatureFlagsProviderProps {
  readonly children: ReactNode;
}

// ---------------------------------------------------------------------
// 2. Context Creation & Custom Hook Abstraction
// ---------------------------------------------------------------------

export const FeatureFlagsContext = createContext<FeatureFlagsContextType | undefined>(undefined);

export const useFeatureFlags = (): FeatureFlagsContextType => {
  const context = useContext(FeatureFlagsContext);
  if (!context) {
    throw new Error("useFeatureFlags must be used within a FeatureFlagsProvider");
  }
  return context;
};

// ---------------------------------------------------------------------
// 3. Provider Component Implementation
// ---------------------------------------------------------------------

export const FeatureFlagsProvider: React.FC<FeatureFlagsProviderProps> = ({ children }) => {
  const [flags, setFlags] = useState<FeatureFlags>({
    enableBetaUI: false,
    enableAnalytics: true,
  });

  const toggleFlag = (flagKey: keyof FeatureFlags): void => {
    setFlags((prev) => ({
      ...prev,
      [flagKey]: !prev[flagKey],
    }));
  };

  return <FeatureFlagsContext.Provider value={{ flags, toggleFlag }}>{children}</FeatureFlagsContext.Provider>;
};

// ---------------------------------------------------------------------
// 4. Consumer Component Implementations
// ---------------------------------------------------------------------

export const FeatureTogglePanel: React.FC = () => {
  // Encapsulated hook usage replacing direct useContext(FeatureFlagsContext)
  const { flags, toggleFlag } = useFeatureFlags();

  return (
    <div>
      <h4>Feature Flags Manager</h4>
      <label>
        <input type="checkbox" checked={flags.enableBetaUI} onChange={() => toggleFlag("enableBetaUI")} />
        Enable Beta UI
      </label>
      <label>
        <input type="checkbox" checked={flags.enableAnalytics} onChange={() => toggleFlag("enableAnalytics")} />
        Enable Analytics Telemetry
      </label>
    </div>
  );
};

export const FeatureStatusDisplay: React.FC = () => {
  const { flags } = useFeatureFlags();

  return (
    <div>
      <h4>Current Active Features</h4>
      <p>Beta Features: {flags.enableBetaUI ? "ACTIVE" : "INACTIVE"}</p>
      <p>Analytics Engine: {flags.enableAnalytics ? "ENABLED" : "DISABLED"}</p>
    </div>
  );
};

// ---------------------------------------------------------------------
// 5. Main Container Component
// ---------------------------------------------------------------------

export const ContextHookContainer: React.FC = () => {
  return (
    <FeatureFlagsProvider>
      <div>
        <h1>20 - Context Hook</h1>

        <h2>1. Consuming Context via Custom Guarded Context Hook</h2>
        <FeatureTogglePanel />
        <FeatureStatusDisplay />
      </div>
    </FeatureFlagsProvider>
  );
};

export default ContextHookContainer;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Custom context hooks encapsulate `useContext` calls to streamline consumer access APIs.
// - Encapsulating context logic hides internal context objects and centralization checks.
// - Guard clauses inside custom hooks validate that consumers reside within a Provider tree.
// - Custom hooks convert optional context types to non-null types for consumer convenience.
// - Abstracting context access improves code readability, maintainability, and testing.
