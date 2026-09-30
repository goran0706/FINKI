/**
 * State Initialization
 * ====================
 *
 * The `initialState` argument passed to `useState` is used exclusively during the component's initial render.
 * On subsequent re-renders, React ignores the `initialState` value and preserves the existing state.
 *
 * Initializing state from props stores an initial snapshot. If parent props change later, local state will
 * not automatically update to match the new prop unless explicitly reset or synchronized via key changes.
 */

import React, { useState } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface PrimitiveInitProps {
  readonly defaultText: string;
}

export interface PropInitProps {
  readonly initialCount: number;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

export const PrimitiveInitialization: React.FC<PrimitiveInitProps> = ({ defaultText }) => {
  const [text, setText] = useState<string>(defaultText);

  return (
    <div>
      <p>Initialized State Text: {text}</p>
      <button type="button" onClick={() => setText("Modified Text")}>
        Change Text
      </button>
    </div>
  );
};

export const PropDerivedInitialization: React.FC<PropInitProps> = ({ initialCount }) => {
  const [count, setCount] = useState<number>(initialCount);

  return (
    <div>
      <p>Prop Value Provided: {initialCount}</p>
      <p>Current Internal State: {count}</p>
      <button type="button" onClick={() => setCount(count + 1)}>
        Increment Internal State
      </button>
    </div>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

export const StateInitializationContainer: React.FC = () => {
  const [parentCount, setParentCount] = useState<number>(100);

  return (
    <div>
      <h1>07 - State Initialization</h1>

      <h2>1. Direct Primitive Initialization</h2>
      <PrimitiveInitialization defaultText="Default Text Value" />

      <h2>2. Prop-Derived Initial State (Does Not Re-Sync)</h2>
      <button type="button" onClick={() => setParentCount(parentCount + 10)}>
        Update Parent Prop ({parentCount})
      </button>
      <PropDerivedInitialization initialCount={parentCount} />
    </div>
  );
};

export default StateInitializationContainer;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - The initial argument to useState is evaluated and assigned only on the initial component render.
// - During subsequent re-renders, React ignores the initial state value and retains current state.
// - Initializing state from props captures a one-time snapshot rather than creating a live binding.
// - Changes to parent props do not automatically recalculate or overwrite existing local state.
// - To re-initialize state when props change, components must use key-based resets or derived values.
