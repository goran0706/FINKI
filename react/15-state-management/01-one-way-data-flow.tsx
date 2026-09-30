/**
 * One-Way Data Flow
 * =================
 *
 * In React, data flows strictly top-down (unidirectional) from parent components to child components via props.
 * A parent component owns its state and passes snapshot values downward as read-only properties,
 * ensuring that child components cannot mutate parent state directly.
 *
 * When child components need to trigger changes in parent state, they do so by invoking callback functions
 * passed down from the parent. This architecture ensures predictable state updates, keeps component
 * rendering deterministic, and simplifies debugging state transitions throughout the tree.
 */

import React, { useState } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface DisplayProps {
  readonly count: number;
}

export interface ControlProps {
  readonly onIncrement: () => void;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

export const CountDisplay: React.FC<DisplayProps> = ({ count }) => {
  // Component receives state strictly as a read-only prop from parent
  return <p>Current Count: {count}</p>;
};

export const CountControls: React.FC<ControlProps> = ({ onIncrement }) => {
  // Component invokes callback prop to request state changes upward
  return (
    <button type="button" onClick={onIncrement}>
      Increment Counter
    </button>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

export const OneWayDataFlowContainer: React.FC = () => {
  // Parent component owns and manages the authoritative state
  const [count, setCount] = useState<number>(0);

  const handleIncrement = (): void => {
    setCount((prevCount) => prevCount + 1);
  };

  return (
    <div>
      <h1>01 - One-Way Data Flow</h1>

      <h2>1. Unidirectional Data Passing and Upward Callback Invocation</h2>
      <CountDisplay count={count} />
      <CountControls onIncrement={handleIncrement} />
    </div>
  );
};

export default OneWayDataFlowContainer;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - React uses unidirectional data flow where state moves strictly top-down from parent to child.
// - Props passed to child components act as immutable read-only snapshot values during render.
// - Child components trigger state modifications indirectly by executing parent callback props.
// - Owning state in a single parent component keeps state transitions deterministic and traceable.
// - One-way data flow simplifies application debugging by enforcing clear state update paths.
