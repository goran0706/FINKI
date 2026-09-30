/**
 * State Snapshot
 * ==============
 *
 * State in React behaves like a snapshot for each render pass. Calling a state set function does not mutate
 * the state variable in the currently executing render closure. Instead, it schedules a new render with
 * the updated value.
 *
 * Inside an event handler or asynchronous closure, the value of state is fixed to what it was when React
 * rendered that component instance. Even if a set function is called multiple times within the same event execution,
 * the local state variable within that current function frame remains unchanged until React renders the next snapshot.
 */

import React, { useState } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface SnapshotDemoProps {
  readonly initialCount: number;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

export const SnapshotCounter: React.FC<SnapshotDemoProps> = ({ initialCount }) => {
  const [count, setCount] = useState<number>(initialCount);

  const handleTripleIncrement = (): void => {
    // Reads count from current render snapshot (e.g., 0)
    setCount(count + 1);
    setCount(count + 1);
    setCount(count + 1);
    // All three calls pass (0 + 1), scheduling state to become 1 on the next render
  };

  const handleAsyncAlert = (): void => {
    setTimeout(() => {
      // Displays the snapshot value captured when handleAsyncAlert was called
      alert(`State snapshot in timer: ${count}`);
    }, 3000);
  };

  return (
    <div>
      <p>Current Render Count: {count}</p>
      <button type="button" onClick={handleTripleIncrement}>
        Attempt Triple Increment (Direct)
      </button>
      <button type="button" onClick={handleAsyncAlert}>
        Show Async Alert in 3s
      </button>
    </div>
  );
};

export const AsyncSnapshotClosure: React.FC = () => {
  const [number, setNumber] = useState<number>(0);

  const handleIncrementAndAsyncRead = (): void => {
    setNumber(number + 5);
    setTimeout(() => {
      console.log("Captured render snapshot value:", number);
    }, 1000);
  };

  return (
    <div>
      <p>Number Snapshot: {number}</p>
      <button type="button" onClick={handleIncrementAndAsyncRead}>
        Add 5 & Log Captured Closure (1s)
      </button>
    </div>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

export const StateSnapshotContainer: React.FC = () => {
  return (
    <div>
      <h1>09 - State Snapshot</h1>

      <h2>1. State Values Are Immutable Within a Render Frame</h2>
      <SnapshotCounter initialCount={0} />

      <h2>2. Asynchronous Closures Capture Current Render Snapshot</h2>
      <AsyncSnapshotClosure />
    </div>
  );
};

export default StateSnapshotContainer;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - State variables act as immutable snapshots fixed to the specific execution frame of a render pass.
// - Calling a state setter does not mutate the variable in place within the currently executing closure.
// - Event handlers capture state values as they existed when the component rendered the current UI frame.
// - Multiple direct set calls using the same snapshot variable calculate next state from identical values.
// - Asynchronous callbacks evaluate captured closure state rather than live updated state values.
