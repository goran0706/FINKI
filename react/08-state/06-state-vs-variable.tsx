/**
 * State vs Variable
 * =================
 *
 * Regular local variables declared inside a component function do not persist between renders.
 * Every time React re-renders a component, it executes the function from top to bottom, recreating
 * all local variables from scratch.
 *
 * Additionally, mutating a local variable does not notify React that an update occurred, so no re-render
 * is triggered. React state created with `useState` persists across renders and calling its set function
 * triggers React to render the component again with the updated state value.
 */

import React, { useState } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface VariableVsStateProps {
  readonly initialCount: number;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

export const VariableVsState: React.FC<VariableVsStateProps> = ({ initialCount }) => {
  const [stateCount, setStateCount] = useState<number>(initialCount);
  let localVariableCount = initialCount;

  const handleMutateVariable = (): void => {
    localVariableCount += 1;
    // The local variable is updated in memory, but no re-render is scheduled.
    console.log("Local variable value:", localVariableCount);
  };

  const handleUpdateState = (): void => {
    setStateCount((prevCount: number) => prevCount + 1);
    // Triggers re-render. During re-render, localVariableCount is re-initialized to initialCount.
  };

  return (
    <div>
      <p>State Count (Persists & Triggers Render): {stateCount}</p>
      <p>Local Variable Count (Resets on Render): {localVariableCount}</p>

      <button type="button" onClick={handleMutateVariable}>
        Mutate Local Variable (Check Console)
      </button>
      <button type="button" onClick={handleUpdateState}>
        Update State (Triggers Render)
      </button>
    </div>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

export const StateVsVariableContainer: React.FC = () => {
  return (
    <div>
      <h1>06 - State vs Variable</h1>

      <h2>1. State Persistence and Render Triggers</h2>
      <VariableVsState initialCount={0} />
    </div>
  );
};

export default StateVsVariableContainer;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Local variables declared in a component function are discarded and recreated on every re-render.
// - Mutating a regular local variable does not trigger React to re-render the component.
// - React state values persist across re-renders in memory associated with the UI tree location.
// - Calling a state setter function notifies React to schedule a new component render pass.
// - Local variable modifications are wiped out whenever a state update forces a re-render.
