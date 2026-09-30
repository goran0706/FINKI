/**
 * Context Updating
 * ================
 *
 * Updating context state requires passing state transition handler functions through the provider's
 * `value` payload down to descendant components. Consumer components invoke these handlers to request
 * state changes, which update the state held in the ancestor provider and trigger a re-render across
 * all consuming components.
 *
 * To ensure consistent state updates and avoid race conditions, transition handlers provided via
 * context should leverage functional state updates when calculating new values based on previous state snapshots.
 */

import React, { createContext, ReactNode, useContext, useState } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface CounterContextType {
  readonly count: number;
  readonly increment: () => void;
  readonly decrement: () => void;
  readonly reset: () => void;
}

export interface CounterProviderProps {
  readonly children: ReactNode;
}

// ---------------------------------------------------------------------
// 2. Context Creation & Custom Consumption Hook
// ---------------------------------------------------------------------

export const CounterContext = createContext<CounterContextType | undefined>(undefined);

export const useCounterContext = (): CounterContextType => {
  const context = useContext(CounterContext);
  if (!context) {
    throw new Error("useCounterContext must be used within a CounterProvider");
  }
  return context;
};

// ---------------------------------------------------------------------
// 3. Provider Component Implementation
// ---------------------------------------------------------------------

export const CounterProvider: React.FC<CounterProviderProps> = ({ children }) => {
  const [count, setCount] = useState<number>(0);

  const increment = (): void => {
    setCount((prev) => prev + 1);
  };

  const decrement = (): void => {
    setCount((prev) => prev - 1);
  };

  const reset = (): void => {
    setCount(0);
  };

  const value: CounterContextType = {
    count,
    increment,
    decrement,
    reset,
  };

  return <CounterContext.Provider value={value}>{children}</CounterContext.Provider>;
};

// ---------------------------------------------------------------------
// 4. Consumer Component Implementations
// ---------------------------------------------------------------------

export const CounterDisplay: React.FC = () => {
  const { count } = useCounterContext();

  return (
    <div>
      <h4>Counter Value Display</h4>
      <p>Current Count: {count}</p>
    </div>
  );
};

export const CounterControls: React.FC = () => {
  const { increment, decrement, reset } = useCounterContext();

  return (
    <div>
      <h4>Counter Control Actions</h4>
      <button type="button" onClick={increment}>
        Increment (+1)
      </button>
      <button type="button" onClick={decrement}>
        Decrement (-1)
      </button>
      <button type="button" onClick={reset}>
        Reset
      </button>
    </div>
  );
};

// ---------------------------------------------------------------------
// 5. Main Container Component
// ---------------------------------------------------------------------

export const ContextUpdatingContainer: React.FC = () => {
  return (
    <CounterProvider>
      <div>
        <h1>22 - Context Updating</h1>

        <h2>1. Executing State Transition Handlers Through Context</h2>
        <CounterDisplay />
        <CounterControls />
      </div>
    </CounterProvider>
  );
};

export default ContextUpdatingContainer;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Updating context requires passing updater callbacks inside the provider value payload.
// - Consumers invoke context callbacks to dispatch state changes up to the ancestor provider.
// - Functional state updates ensure reliable transitions when state changes rely on prior state.
// - Context state updates re-render all descendant components subscribed to that context.
// - Passing action handlers keeps state mutation logic centralized within the provider component.
