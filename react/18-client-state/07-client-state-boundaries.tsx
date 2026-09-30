/**
 * Client State Boundaries
 * =======================
 *
 * A client state boundary defines the part of a React component tree that owns, provides, or
 * consumes a particular piece of client-side state. Establishing clear boundaries helps determine
 * where state should live and which components should be allowed to depend on it.
 *
 * A state boundary can be local to one component, shared across a feature subtree, or extended
 * across a larger application area. Moving state upward broadens its reach, while keeping state
 * lower in the tree limits its dependencies. The boundary should therefore match the actual
 * sharing requirement rather than the maximum possible scope.
 *
 * Clear boundaries also help isolate updates. Components outside a state boundary should not need
 * to subscribe to state that they do not use, and unrelated state should not be coupled merely
 * because it happens to live in the same component or store.
 */

import type { FC, ReactElement, ReactNode } from "react";
import { createContext, useContext, useState } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface LocalBoundaryProps {
  readonly initialValue: string;
}

export interface FeatureState {
  readonly selectedView: "list" | "grid";
}

export interface FeatureStateContextValue {
  readonly state: FeatureState;
  readonly setSelectedView: (view: FeatureState["selectedView"]) => void;
}

export interface FeatureStateProviderProps {
  readonly children: ReactNode;
}

export interface FeatureStateConsumerProps {
  readonly label: string;
}

export interface BoundaryDescriptionProps {
  readonly name: string;
  readonly description: string;
  readonly examples: readonly string[];
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

export const LocalStateBoundary: FC<LocalBoundaryProps> = ({ initialValue }): ReactElement => {
  const [value, setValue] = useState<string>(initialValue);

  const updateValue = (): void => {
    setValue((currentValue: string): string => (currentValue === "Initial value" ? "Updated value" : "Initial value"));
  };

  return (
    <div>
      <p>Boundary-local value: {value}</p>
      <button type="button" onClick={updateValue}>
        Update local state
      </button>
    </div>
  );
};

const FeatureStateContext = createContext<FeatureStateContextValue | undefined>(undefined);

export const FeatureStateBoundary: FC<FeatureStateProviderProps> = ({ children }): ReactElement => {
  const [state, setState] = useState<FeatureState>({
    selectedView: "list",
  });

  const setSelectedView = (view: FeatureState["selectedView"]): void => {
    setState((currentState: FeatureState): FeatureState => ({
      ...currentState,
      selectedView: view,
    }));
  };

  const contextValue: FeatureStateContextValue = {
    state,
    setSelectedView,
  };

  return <FeatureStateContext.Provider value={contextValue}>{children}</FeatureStateContext.Provider>;
};

export const FeatureStateConsumer: FC<FeatureStateConsumerProps> = ({ label }): ReactElement => {
  const context = useContext(FeatureStateContext);

  if (context === undefined) {
    throw new Error("FeatureStateConsumer must be rendered inside FeatureStateBoundary.");
  }

  const toggleView = (): void => {
    context.setSelectedView(context.state.selectedView === "list" ? "grid" : "list");
  };

  return (
    <div>
      <p>
        {label}: {context.state.selectedView} view
      </p>
      <button type="button" onClick={toggleView}>
        Toggle view
      </button>
    </div>
  );
};

export const BoundaryDescription: FC<BoundaryDescriptionProps> = ({ name, description, examples }): ReactElement => {
  return (
    <article>
      <h3>{name}</h3>
      <p>{description}</p>
      <ul>
        {examples.map((example: string) => (
          <li key={example}>{example}</li>
        ))}
      </ul>
    </article>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const ClientStateBoundariesDemo: FC = (): ReactElement => {
  return (
    <section>
      <h2>1. A Local State Boundary</h2>
      <BoundaryDescription
        name="Component boundary"
        description="State can remain inside the component that owns an isolated interaction."
        examples={["Temporary input values", "Dialog visibility", "Local interaction state"]}
      />
      <LocalStateBoundary initialValue="Initial value" />

      <h2>2. A Feature State Boundary</h2>
      <BoundaryDescription
        name="Feature boundary"
        description="A provider can establish a boundary around a feature so related components can share the same client state."
        examples={["Feature-specific filters", "Selected view", "Feature-level preferences"]}
      />
      <FeatureStateBoundary>
        <FeatureStateConsumer label="Toolbar" />
        <FeatureStateConsumer label="Content area" />
      </FeatureStateBoundary>

      <h2>3. Keeping Unrelated State Outside the Boundary</h2>
      <BoundaryDescription
        name="Limited dependency boundary"
        description="Components should only depend on the state required for their behavior instead of subscribing to unrelated client state."
        examples={[
          "A dialog does not need the selected tab",
          "A feature does not need unrelated application preferences",
          "Independent interactions can maintain separate state",
        ]}
      />

      <h2>4. Choosing the Boundary</h2>
      <BoundaryDescription
        name="State scope"
        description="Place state at the narrowest boundary that can satisfy all components that genuinely need to share it."
        examples={[
          "One component → local boundary",
          "Related subtree → feature boundary",
          "Independent application areas → broader shared boundary",
        ]}
      />
    </section>
  );
};

export default ClientStateBoundariesDemo;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// A client state boundary defines where state is owned, provided, and consumed.
// Local boundaries keep isolated state close to the component that owns it.
// Feature boundaries allow related components to share client state.
// Broader boundaries should be used only when broader sharing is required.
// Moving state upward increases the number of components that can depend on it.
// Keeping state lower in the tree limits its dependency surface.
// Components should not depend on state that they do not actually use.
// Separate state concerns can have separate boundaries.
// Clear boundaries help prevent unrelated client-state concerns from becoming coupled.
// The correct boundary is determined by the actual sharing requirement.
