/**
 * React Context vs. Zustand State Store
 * ======================================
 *
 * React Context and Zustand can both make state available to components that are not directly
 * connected through props, but they solve the problem through different mechanisms. Context
 * distributes a value through a React component tree, while a Zustand store is an external
 * state container that components subscribe to directly.
 *
 * Context is provided with a Provider and consumed with useContext. A context consumer re-renders
 * when the context value supplied by its Provider changes. Zustand creates a store independently
 * of the React tree, and components subscribe to selected portions of that store through the
 * generated hook.
 *
 * The distinction is therefore architectural rather than simply syntactic. Context describes
 * how a value is distributed through a React tree, whereas a Zustand store describes how shared
 * state and its update logic are maintained outside individual component instances.
 */

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

import type { FC, ReactElement, ReactNode } from "react";
import { createContext, useContext, useState } from "react";
import { create } from "zustand";

export interface ContextCounterValue {
  readonly count: number;
  readonly increment: () => void;
}

export interface ContextProviderProps {
  readonly children: ReactNode;
}

export interface ZustandCounterStore {
  readonly count: number;
  readonly increment: () => void;
}

export interface ComparisonExampleProps {
  readonly title: string;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

const ContextCounter = createContext<ContextCounterValue | undefined>(undefined);

const ContextCounterProvider: FC<ContextProviderProps> = ({ children }: ContextProviderProps): ReactElement => {
  const [count, setCount] = useState<number>(0);

  const value: ContextCounterValue = {
    count,
    increment: (): void => {
      setCount((currentCount: number): number => currentCount + 1);
    },
  };

  return <ContextCounter.Provider value={value}>{children}</ContextCounter.Provider>;
};

const useContextCounter = (): ContextCounterValue => {
  const value: ContextCounterValue | undefined = useContext(ContextCounter);

  if (value === undefined) {
    throw new Error("useContextCounter must be used inside ContextCounterProvider.");
  }

  return value;
};

export const ContextStateExample: FC<ComparisonExampleProps> = ({ title }: ComparisonExampleProps): ReactElement => {
  return (
    <ContextCounterProvider>
      <ContextStateConsumer title={title} />
    </ContextCounterProvider>
  );
};

const ContextStateConsumer: FC<ComparisonExampleProps> = ({ title }: ComparisonExampleProps): ReactElement => {
  const { count, increment }: ContextCounterValue = useContextCounter();

  return (
    <article>
      <h3>{title}</h3>
      <p>Context count: {count}</p>
      <button type="button" onClick={increment}>
        Increment context state
      </button>
    </article>
  );
};

export const useComparisonStore = create<ZustandCounterStore>((set): ZustandCounterStore => ({
  count: 0,
  increment: (): void => {
    set((state: ZustandCounterStore): Pick<ZustandCounterStore, "count"> => ({
      count: state.count + 1,
    }));
  },
}));

export const ZustandStateExample: FC<ComparisonExampleProps> = ({ title }: ComparisonExampleProps): ReactElement => {
  const count: number = useComparisonStore((state: ZustandCounterStore): number => state.count);
  const increment: () => void = useComparisonStore((state: ZustandCounterStore): (() => void) => state.increment);

  return (
    <article>
      <h3>{title}</h3>
      <p>Zustand count: {count}</p>
      <button type="button" onClick={increment}>
        Increment Zustand state
      </button>
    </article>
  );
};

export const ContextProviderExample: FC<ComparisonExampleProps> = ({ title }: ComparisonExampleProps): ReactElement => {
  return (
    <ContextCounterProvider>
      <ContextProviderConsumer title={title} />
    </ContextCounterProvider>
  );
};

const ContextProviderConsumer: FC<ComparisonExampleProps> = ({ title }: ComparisonExampleProps): ReactElement => {
  const { count }: ContextCounterValue = useContextCounter();

  return (
    <article>
      <h3>{title}</h3>
      <p>Provider-managed count: {count}</p>
      <p>
        The state is owned by the component that renders the Context Provider and is distributed through the React tree.
      </p>
    </article>
  );
};

export const ZustandExternalStoreExample: FC<ComparisonExampleProps> = ({
  title,
}: ComparisonExampleProps): ReactElement => {
  const count: number = useComparisonStore.getState().count;

  return (
    <article>
      <h3>{title}</h3>
      <p>Store value: {count}</p>
      <p>The Zustand store exists independently of this component and can be read through its imperative store API.</p>
    </article>
  );
};

export const ContextArchitectureExample: FC<ComparisonExampleProps> = ({
  title,
}: ComparisonExampleProps): ReactElement => {
  return (
    <ContextCounterProvider>
      <ContextArchitectureConsumer title={title} />
    </ContextCounterProvider>
  );
};

const ContextArchitectureConsumer: FC<ComparisonExampleProps> = ({ title }: ComparisonExampleProps): ReactElement => {
  const { count, increment }: ContextCounterValue = useContextCounter();

  return (
    <article>
      <h3>{title}</h3>
      <p>Context value: {count}</p>
      <button type="button" onClick={increment}>
        Update Context
      </button>
      <p>Context consumption depends on the Provider relationship in the React component tree.</p>
    </article>
  );
};

export const ZustandArchitectureExample: FC<ComparisonExampleProps> = ({
  title,
}: ComparisonExampleProps): ReactElement => {
  const count: number = useComparisonStore((state: ZustandCounterStore): number => state.count);

  return (
    <article>
      <h3>{title}</h3>
      <p>Zustand value: {count}</p>
      <p>
        Zustand consumption depends on subscribing to the external store rather than locating a Provider above the
        component.
      </p>
    </article>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const ContextVsStateStoreDemo: FC = (): ReactElement => {
  return (
    <section>
      <h2>1. Sharing State Through React Context</h2>
      <ContextStateExample title="Context State" />

      <h2>2. Sharing State Through a Zustand Store</h2>
      <ZustandStateExample title="Zustand State Store" />

      <h2>3. Context State Is Distributed Through a Provider</h2>
      <ContextProviderExample title="Context Provider" />

      <h2>4. Zustand State Exists Outside the React Tree</h2>
      <ZustandExternalStoreExample title="External Zustand Store" />

      <h2>5. Context Consumption Depends on the React Tree</h2>
      <ContextArchitectureExample title="Context Architecture" />

      <h2>6. Zustand Consumption Uses Store Subscriptions</h2>
      <ZustandArchitectureExample title="Zustand Architecture" />
    </section>
  );
};

export default ContextVsStateStoreDemo;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// React Context distributes a value through a React component tree.
// Context consumers access the nearest matching Provider value with useContext.
// Context does not create state by itself; state can be owned by the Provider component.
// Zustand creates an external store containing state and actions.
// Zustand components subscribe directly to selected portions of the store.
// Zustand does not require a React Context Provider for normal store consumption.
// Context and Zustand can therefore provide shared state through different architectural models.
// The appropriate choice depends on the state ownership, distribution, subscription, and architecture requirements of the application.
