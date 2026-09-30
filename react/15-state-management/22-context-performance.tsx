/**
 * Context Performance
 * ===================
 *
 * Context performance optimization focuses on preventing unnecessary re-renders in consumer
 * components. When a Context Provider re-renders, React checks the reference equality of the
 * `value` prop. If `value` is an inline object, it receives a new reference on every render,
 * triggering re-renders in all downstream consumers even if the underlying data is identical.
 *
 * Performance can be optimized by memoizing the context value payload with `useMemo`, splitting
 * single context providers into separate state and updater contexts, or wrapping consuming child
 * components with `React.memo` or passing them as `children`.
 */

import React, { createContext, ReactNode, useCallback, useContext, useMemo, useState } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface SystemConfig {
  readonly theme: "light" | "dark";
  readonly refreshRate: number;
}

export interface SystemConfigContextType {
  readonly config: SystemConfig;
  readonly toggleTheme: () => void;
  readonly setRefreshRate: (rate: number) => void;
}

export interface SystemConfigProviderProps {
  readonly children: ReactNode;
}

// ---------------------------------------------------------------------
// 2. Context Creation & Custom Consumption Hook
// ---------------------------------------------------------------------

export const SystemConfigContext = createContext<SystemConfigContextType | undefined>(undefined);

export const useSystemConfig = (): SystemConfigContextType => {
  const context = useContext(SystemConfigContext);
  if (!context) {
    throw new Error("useSystemConfig must be used within a SystemConfigProvider");
  }
  return context;
};

// ---------------------------------------------------------------------
// 3. Provider Component Implementation with Memoized Value
// ---------------------------------------------------------------------

export const SystemConfigProvider: React.FC<SystemConfigProviderProps> = ({ children }) => {
  const [config, setConfig] = useState<SystemConfig>({
    theme: "light",
    refreshRate: 60,
  });

  const toggleTheme = useCallback((): void => {
    setConfig((prev) => ({
      ...prev,
      theme: prev.theme === "light" ? "dark" : "light",
    }));
  }, []);

  const setRefreshRate = useCallback((rate: number): void => {
    setConfig((prev) => ({
      ...prev,
      refreshRate: rate,
    }));
  }, []);

  // Memoize value payload to prevent reference changes on unrelated parent renders
  const value = useMemo<SystemConfigContextType>(
    () => ({
      config,
      toggleTheme,
      setRefreshRate,
    }),
    [config, toggleTheme, setRefreshRate],
  );

  return <SystemConfigContext.Provider value={value}>{children}</SystemConfigContext.Provider>;
};

// ---------------------------------------------------------------------
// 4. Consumer Component Implementations
// ---------------------------------------------------------------------

export const ConfigDisplay: React.FC = () => {
  const { config } = useSystemConfig();

  return (
    <div>
      <h4>Optimized Config Display</h4>
      <p>Current Theme: {config.theme.toUpperCase()}</p>
      <p>Refresh Rate: {config.refreshRate} Hz</p>
    </div>
  );
};

export const ConfigControls: React.FC = () => {
  const { toggleTheme, setRefreshRate } = useSystemConfig();

  return (
    <div>
      <h4>Config Controls</h4>
      <button type="button" onClick={toggleTheme}>
        Toggle Theme
      </button>
      <button type="button" onClick={() => setRefreshRate(120)}>
        Set 120Hz
      </button>
    </div>
  );
};

// ---------------------------------------------------------------------
// 5. Main Container Component
// ---------------------------------------------------------------------

export const ContextPerformanceContainer: React.FC = () => {
  return (
    <SystemConfigProvider>
      <div>
        <h1>23 - Context Performance</h1>

        <h2>1. Memoized Context Value Payload Preventing Unnecessary Re-renders</h2>
        <ConfigDisplay />
        <ConfigControls />
      </div>
    </SystemConfigProvider>
  );
};

export default ContextPerformanceContainer;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Unmemoized inline context value objects create new references on every provider render.
// - Memoizing context value payloads with useMemo preserves reference equality across renders.
// - Wrapping callback handlers with useCallback prevents unnecessary context value changes.
// - Splitting read state and dispatch callbacks into separate contexts minimizes re-renders.
// - Optimizing context structure ensures descendant subtrees re-render only when data changes.
