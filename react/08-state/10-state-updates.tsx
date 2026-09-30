/**
 * State Updates
 * =============
 *
 * Setting state requests a re-render from React with the new state value. Calling a state setter
 * updates the state for the next render pass and queues a component re-render.
 *
 * State updates replace state rather than mutating it in place. React compares next state to current state
 * using `Object.is`. If the state setter receives a value identical to the current value, React skips
 * re-rendering the component subtree.
 */

import React, { useState } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface DirectUpdateProps {
  readonly initialText: string;
}

export interface ToggleUpdateProps {
  readonly initialActive: boolean;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

export const DirectStateUpdate: React.FC<DirectUpdateProps> = ({ initialText }) => {
  const [text, setText] = useState<string>(initialText);

  const handleChangeText = (): void => {
    setText("Updated State Value");
  };

  const handleResetText = (): void => {
    setText(initialText);
  };

  return (
    <div>
      <p>Current Text: {text}</p>
      <button type="button" onClick={handleChangeText}>
        Set New Text
      </button>
      <button type="button" onClick={handleResetText}>
        Reset Text
      </button>
    </div>
  );
};

export const ToggleStateUpdate: React.FC<ToggleUpdateProps> = ({ initialActive }) => {
  const [isActive, setIsActive] = useState<boolean>(initialActive);

  const handleToggle = (): void => {
    setIsActive(!isActive);
  };

  return (
    <div>
      <p>Status: {isActive ? "Active" : "Inactive"}</p>
      <button type="button" onClick={handleToggle}>
        Toggle Status
      </button>
    </div>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

export const StateUpdatesContainer: React.FC = () => {
  return (
    <div>
      <h1>10 - State Updates</h1>

      <h2>1. Direct Replacement State Updates</h2>
      <DirectStateUpdate initialText="Initial State Value" />

      <h2>2. Boolean Toggle State Updates</h2>
      <ToggleStateUpdate initialActive={false} />
    </div>
  );
};

export default StateUpdatesContainer;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Calling a state setter queues a re-render pass with the replacement state value.
// - State updates completely replace current state values rather than mutating them in place.
// - Passing a value identical to current state via Object.is skips component re-rendering.
// - State setter calls notify React to schedule UI tree recalculation asynchronously.
// - Local component variables update only after React executes the next render cycle.
