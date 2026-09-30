/**
 * Context vs Props
 * ================
 *
 * Props and Context represent two distinct patterns for sharing data across React components. Props
 * provide an explicit, traceable data pipeline ideal for direct parent-child relationships and highly
 * reusable UI components. Passing props explicitly maintains clear component API contracts.
 *
 * Context provides an implicit data delivery channel designed for broadcasting state across deep or
 * wide component subtrees without intermediary prop drilling. Context trade-offs include reduced
 * component reusability outside provider boundaries and implicit state dependencies.
 */

import React, { createContext, useContext, useState } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface ThemeConfig {
  readonly colorScheme: "light" | "dark";
  readonly fontSize: number;
}

export interface PropBasedCardProps {
  readonly config: ThemeConfig;
}

// ---------------------------------------------------------------------
// 2. Context Creation
// ---------------------------------------------------------------------

export const ConfigContext = createContext<ThemeConfig | undefined>(undefined);

// ---------------------------------------------------------------------
// 3. Component Implementations
// ---------------------------------------------------------------------

export const PropBasedCard: React.FC<PropBasedCardProps> = ({ config }) => {
  // Explicit prop delivery: Clear interface contract, highly reusable anywhere
  return (
    <div>
      <h4>Explicit Prop-Based Component</h4>
      <p>
        Theme: {config.colorScheme} | Font Size: {config.fontSize}px
      </p>
    </div>
  );
};

export const ContextBasedCard: React.FC = () => {
  // Implicit context delivery: Direct consumption without explicit prop requirements
  const config = useContext(ConfigContext);

  if (!config) {
    throw new Error("ContextBasedCard must be used within a ConfigContext provider");
  }

  return (
    <div>
      <h4>Implicit Context-Based Component</h4>
      <p>
        Theme: {config.colorScheme} | Font Size: {config.fontSize}px
      </p>
    </div>
  );
};

// ---------------------------------------------------------------------
// 4. Main Container Component
// ---------------------------------------------------------------------

export const ContextVsPropsContainer: React.FC = () => {
  const [config, setConfig] = useState<ThemeConfig>({
    colorScheme: "light",
    fontSize: 14,
  });

  const toggleColorScheme = (): void => {
    setConfig((prev) => ({
      ...prev,
      colorScheme: prev.colorScheme === "light" ? "dark" : "light",
    }));
  };

  return (
    <div>
      <h1>14 - Context vs Props</h1>

      <h2>1. Explicit Data Passing via Props</h2>
      <PropBasedCard config={config} />

      <h2>2. Implicit Broadcast via Context Provider</h2>
      <ConfigContext.Provider value={config}>
        <ContextBasedCard />
      </ConfigContext.Provider>

      <button type="button" onClick={toggleColorScheme}>
        Toggle Color Scheme
      </button>
    </div>
  );
};

export default ContextVsPropsContainer;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Props deliver explicit, predictable data flow between direct parent and child components.
// - Context broadcasts implicit state across deep subtrees to eliminate prop drilling.
// - Explicit props preserve component reusability outside specific provider boundaries.
// - Context simplifies deep data access at the cost of implicit component dependencies.
// - Choosing between props and context depends on component depth and reusability requirements.
