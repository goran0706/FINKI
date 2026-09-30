/**
 * Local State vs Global State
 * ===========================
 *
 * Local state belongs to a specific component instance and is primarily used to control behavior
 * that does not need to be shared elsewhere. Global state is client-side state intentionally made
 * available to multiple, potentially distant parts of an application.
 *
 * The distinction is primarily about state scope and sharing requirements. Local state is usually
 * the default choice when only one component or a small component subtree needs the value, while
 * broader state is appropriate when unrelated parts of the application must coordinate around the
 * same client-owned value.
 *
 * A value should not become global merely because it is useful. Moving state to a broader scope
 * increases the number of components that can observe and potentially update it, so state should
 * generally be kept at the narrowest scope that satisfies the application's requirements.
 */

import type { FC, ReactElement, ReactNode } from "react";
import { createContext, useContext, useState } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface LocalCounterProps {
  readonly initialValue: number;
}

export interface LocalCounterDisplayProps {
  readonly value: number;
}

export interface GlobalSelectionContextValue {
  readonly selectedItem: string;
  readonly selectItem: (item: string) => void;
}

export interface GlobalSelectionProviderProps {
  readonly children: ReactNode;
  readonly initialItem: string;
}

export interface GlobalSelectionConsumerProps {
  readonly label: string;
}

export interface ComparisonExampleProps {
  readonly title: string;
  readonly description: string;
  readonly scope: "local" | "global";
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

export const LocalCounterDisplay: FC<LocalCounterDisplayProps> = ({ value }): ReactElement => {
  return <p>Local counter: {value}</p>;
};

export const LocalCounter: FC<LocalCounterProps> = ({ initialValue }): ReactElement => {
  const [count, setCount] = useState<number>(initialValue);

  const increment = (): void => {
    setCount((currentCount: number): number => currentCount + 1);
  };

  return (
    <div>
      <LocalCounterDisplay value={count} />
      <button type="button" onClick={increment}>
        Increment
      </button>
    </div>
  );
};

const GlobalSelectionContext = createContext<GlobalSelectionContextValue | undefined>(undefined);

export const GlobalSelectionProvider: FC<GlobalSelectionProviderProps> = ({ children, initialItem }): ReactElement => {
  const [selectedItem, setSelectedItem] = useState<string>(initialItem);

  const selectItem = (item: string): void => {
    setSelectedItem(item);
  };

  const contextValue: GlobalSelectionContextValue = {
    selectedItem,
    selectItem,
  };

  return <GlobalSelectionContext.Provider value={contextValue}>{children}</GlobalSelectionContext.Provider>;
};

export const GlobalSelectionConsumer: FC<GlobalSelectionConsumerProps> = ({ label }): ReactElement => {
  const context = useContext(GlobalSelectionContext);

  if (context === undefined) {
    throw new Error("GlobalSelectionConsumer must be rendered inside GlobalSelectionProvider.");
  }

  return (
    <div>
      <p>
        {label}: {context.selectedItem}
      </p>
      <button
        type="button"
        onClick={() => {
          context.selectItem(context.selectedItem === "Overview" ? "Details" : "Overview");
        }}
      >
        Change selection
      </button>
    </div>
  );
};

export const ComparisonExample: FC<ComparisonExampleProps> = ({ title, description, scope }): ReactElement => {
  return (
    <article>
      <h3>{title}</h3>
      <p>{description}</p>
      <p>State scope: {scope}</p>
    </article>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const LocalStateVsGlobalStateDemo: FC = (): ReactElement => {
  return (
    <section>
      <h2>1. Local State Belongs to One Component Instance</h2>
      <ComparisonExample
        title="Local counter"
        description="The counter value is owned by this component and does not need to be shared with other components."
        scope="local"
      />
      <LocalCounter initialValue={0} />

      <h2>2. Global State Can Be Shared Across Distant Components</h2>
      <GlobalSelectionProvider initialItem="Overview">
        <GlobalSelectionConsumer label="Navigation" />
        <GlobalSelectionConsumer label="Content area" />
      </GlobalSelectionProvider>

      <h2>3. State Scope Should Match the Requirement</h2>
      <ComparisonExample
        title="Choose the narrowest useful scope"
        description="Keep state local when one component owns it. Use broader shared state when multiple independent components must coordinate around the same client-owned value."
        scope="local"
      />
    </section>
  );
};

export default LocalStateVsGlobalStateDemo;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// Local state belongs to a particular component instance.
// Local state is appropriate when other components do not need the value.
// Global state is client-owned state made available to multiple parts of an application.
// Shared state allows separate components to observe and update the same value.
// React Context can provide shared state to components within a provider's subtree.
// Global state is not automatically better than local state simply because it is reusable.
// Broader state scope increases the number of components that can depend on the value.
// State should generally live at the narrowest scope that satisfies the sharing requirement.
// The key distinction is how widely the state needs to be shared, not whether it is important.
