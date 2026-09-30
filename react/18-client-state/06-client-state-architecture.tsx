/**
 * Client State Architecture
 * ==========================
 *
 * Client state architecture describes how application-owned state is organized, scoped, updated,
 * and shared across a React application. A useful architecture separates state according to its
 * ownership and sharing requirements instead of placing every value in one global store.
 *
 * Local component state is appropriate for isolated interaction state. Context can share state
 * across a component subtree, while an external state store can provide shared state independently
 * of a specific component hierarchy. State can also be divided by feature so that each feature
 * owns the client state required to implement its behavior.
 *
 * A well-scoped architecture minimizes unnecessary dependencies between components. It also makes
 * state ownership explicit, keeps updates predictable, and prevents transient UI concerns from
 * becoming unnecessarily global.
 */

import type { FC, ReactElement, ReactNode } from "react";
import { createContext, useContext, useState } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface LocalStateArchitectureProps {
  readonly initialCount: number;
}

export interface FeatureState {
  readonly selectedView: "list" | "grid";
}

export interface FeatureStateContextValue {
  readonly selectedView: FeatureState["selectedView"];
  readonly setSelectedView: (view: FeatureState["selectedView"]) => void;
}

export interface FeatureStateProviderProps {
  readonly children: ReactNode;
}

export interface FeatureStateConsumerProps {
  readonly label: string;
}

export interface ArchitectureLayerProps {
  readonly name: string;
  readonly responsibility: string;
  readonly examples: readonly string[];
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

export const LocalFeatureState: FC<LocalStateArchitectureProps> = ({ initialCount }): ReactElement => {
  const [count, setCount] = useState<number>(initialCount);

  const increment = (): void => {
    setCount((currentCount: number): number => currentCount + 1);
  };

  return (
    <div>
      <p>Feature-local count: {count}</p>
      <button type="button" onClick={increment}>
        Increment
      </button>
    </div>
  );
};

const FeatureStateContext = createContext<FeatureStateContextValue | undefined>(undefined);

export const FeatureStateProvider: FC<FeatureStateProviderProps> = ({ children }): ReactElement => {
  const [selectedView, setSelectedView] = useState<FeatureState["selectedView"]>("list");

  const contextValue: FeatureStateContextValue = {
    selectedView,
    setSelectedView,
  };

  return <FeatureStateContext.Provider value={contextValue}>{children}</FeatureStateContext.Provider>;
};

export const FeatureStateConsumer: FC<FeatureStateConsumerProps> = ({ label }): ReactElement => {
  const context = useContext(FeatureStateContext);

  if (context === undefined) {
    throw new Error("FeatureStateConsumer must be rendered inside FeatureStateProvider.");
  }

  return (
    <div>
      <p>
        {label}: {context.selectedView} view
      </p>
      <button
        type="button"
        onClick={() => {
          context.setSelectedView(context.selectedView === "list" ? "grid" : "list");
        }}
      >
        Change view
      </button>
    </div>
  );
};

export const ArchitectureLayer: FC<ArchitectureLayerProps> = ({ name, responsibility, examples }): ReactElement => {
  return (
    <article>
      <h3>{name}</h3>
      <p>{responsibility}</p>
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

const ClientStateArchitectureDemo: FC = (): ReactElement => {
  const localExamples: readonly string[] = ["Dialog visibility", "Input values", "Temporary interaction state"];

  const featureExamples: readonly string[] = ["Feature-specific filters", "Selected view", "Feature-level preferences"];

  const sharedExamples: readonly string[] = [
    "Application theme",
    "Shared user preferences",
    "Cross-feature client state",
  ];

  return (
    <section>
      <h2>1. Local State for Isolated Concerns</h2>
      <ArchitectureLayer
        name="Component-local state"
        responsibility="Own state that is only required by one component or a tightly coupled interaction."
        examples={localExamples}
      />
      <LocalFeatureState initialCount={0} />

      <h2>2. Feature State for a Component Subtree</h2>
      <ArchitectureLayer
        name="Feature-scoped state"
        responsibility="Share state among components belonging to the same feature without making it application-wide."
        examples={featureExamples}
      />
      <FeatureStateProvider>
        <FeatureStateConsumer label="Toolbar" />
        <FeatureStateConsumer label="Content area" />
      </FeatureStateProvider>

      <h2>3. Broader Shared State</h2>
      <ArchitectureLayer
        name="Application-shared state"
        responsibility="Coordinate client-owned values that genuinely need to be accessed by independent application areas."
        examples={sharedExamples}
      />

      <h2>4. State Ownership and Scope</h2>
      <ArchitectureLayer
        name="State architecture"
        responsibility="Choose the narrowest state scope that satisfies the application's sharing requirements."
        examples={[
          "Local state for isolated behavior",
          "Feature state for related components",
          "Shared state for independent application areas",
        ]}
      />
    </section>
  );
};

export default ClientStateArchitectureDemo;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// Client state architecture defines how application-owned state is organized and shared.
// State scope should reflect which components actually need access to a value.
// Local state is appropriate for isolated component behavior.
// Feature-scoped state can coordinate components that belong to the same feature.
// Context can provide shared state across a component subtree.
// External stores can provide shared state independently of a particular component hierarchy.
// Application-wide state should be reserved for values that genuinely require broad sharing.
// State ownership should remain explicit so updates and dependencies are easier to reason about.
// Separating state by feature can reduce unnecessary coupling between unrelated parts of an application.
// A good architecture avoids turning every client-side value into global state.
