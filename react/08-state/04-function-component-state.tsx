/**
 * Function Component State
 * ========================
 *
 * State in function components is managed with the `useState` Hook. React preserves state values
 * between renders and provides setter functions that schedule the component to render again with
 * the updated state.
 *
 * Unlike class components, function components do not use `this.state` or `this.setState()`.
 * Instead, `useState` provides the current state value and a setter function, while functional
 * state updates can receive the previous state when the next value depends on it.
 */

import React, { useState } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface FunctionCounterProps {
  readonly initialCount: number;
}

export interface FunctionCounterState {
  readonly count: number;
  readonly lastUpdated: string | null;
}

// ---------------------------------------------------------------------
// 2. Function Component Implementation
// ---------------------------------------------------------------------

export const FunctionCounter: React.FC<FunctionCounterProps> = ({ initialCount }) => {
  const [state, setState] = useState<FunctionCounterState>({
    count: initialCount,
    lastUpdated: null,
  });

  const handleIncrementDirect = (): void => {
    setState({
      count: state.count + 1,
      lastUpdated: new Date().toLocaleTimeString(),
    });
  };

  const handleIncrementFunctional = (): void => {
    setState((prevState) => ({
      count: prevState.count + 1,
      lastUpdated: new Date().toLocaleTimeString(),
    }));
  };

  const handleReset = (): void => {
    setState({
      count: initialCount,
      lastUpdated: null,
    });
  };

  return (
    <div>
      <p>Count: {state.count}</p>
      <p>Last Updated: {state.lastUpdated ?? "Never"}</p>
      <button type="button" onClick={handleIncrementDirect}>
        Increment Direct
      </button>
      <button type="button" onClick={handleIncrementFunctional}>
        Increment Functional
      </button>
      <button type="button" onClick={handleReset}>
        Reset
      </button>
    </div>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

export const FunctionComponentStateContainer: React.FC = () => {
  return (
    <div>
      <h1>Function Component State</h1>

      <h2>1. State Initialization and Updates with useState</h2>
      <FunctionCounter initialCount={0} />
    </div>
  );
};

export default FunctionComponentStateContainer;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Function component state is created with the `useState` Hook rather than `this.state`.
// - The setter returned by `useState` replaces the current state value rather than shallowly merging it.
// - A direct state update can calculate the next value from the current render's state.
// - A functional state update receives the previous state and is appropriate when the next state depends on it.
// - Updating state schedules the function component to execute again with the updated state.
// - State is preserved by React between renders even though the component function executes again.
