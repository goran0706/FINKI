/**
 * Component Pillars
 * =================
 *
 * Every React component is built upon 5 core architectural pillars that govern its behavior,
 * lifecycle, and presentation. Each pillar fulfills a distinct responsibility:
 *
 * - Props: Immutable external inputs passed down from parent components.
 * - State: Encapsulated local memory owned and updated by the component (`useState`).
 * - Lifecycle/Effects: Execution side-effects synchronized with state and prop changes (`useEffect`).
 * - Event Handling: Interactive bridge functions responding to user actions and triggering updates.
 * - Rendering: Declarative JSX transformation mapping inputs and states into clean visual structures.
 */

import React, { useCallback, useEffect, useState } from "react";

// ---------------------------------------------------------------------
// PILLAR 1: PROPS (External Input Definition)
// ---------------------------------------------------------------------

export interface ComponentPillarsProps {
  readonly initialCount?: number;
  readonly label?: string;
  readonly threshold?: number;
  readonly onThresholdReached?: (count: number) => void;
}

export const ComponentPillars: React.FC<ComponentPillarsProps> = (props) => {
  // ---------------------------------------------------------------------
  // PILLAR 1: PROPS (Destructured on new line)
  // ---------------------------------------------------------------------
  const { initialCount = 0, label = "Component Pillars", threshold = 5, onThresholdReached } = props;

  // ---------------------------------------------------------------------
  // PILLAR 2: STATE (Encapsulated Memory)
  // ---------------------------------------------------------------------
  const [count, setCount] = useState<number>(initialCount);

  // ---------------------------------------------------------------------
  // PILLAR 3: LIFECYCLE & EFFECTS (Execution Timeline & Side Effects)
  // ---------------------------------------------------------------------
  useEffect(() => {
    if (count >= threshold && onThresholdReached) {
      console.log(`[Pillar 3: Effect] Threshold of ${threshold} reached.`);
      onThresholdReached(count);
    }
  }, [count, threshold, onThresholdReached]);

  // ---------------------------------------------------------------------
  // PILLAR 4: EVENT HANDLING (Interactivity Bridge)
  // ---------------------------------------------------------------------
  const handleIncrement = useCallback(() => {
    setCount((prev) => prev + 1);
  }, []);

  const handleReset = (): void => {
    setCount(initialCount);
  };

  // ---------------------------------------------------------------------
  // PILLAR 5: RENDERING (Declarative JSX Transformation)
  // ---------------------------------------------------------------------
  return (
    <div>
      <header>
        <h1>{label}</h1>
        <p>Current Count: {count}</p>
      </header>

      <main>
        <button type="button" onClick={handleIncrement}>
          Increment Count
        </button>
        <button type="button" onClick={handleReset}>
          Reset
        </button>

        {count >= threshold && <p>Threshold reached!</p>}
      </main>
    </div>
  );
};

export default ComponentPillars;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Props (Pillar 1): Immutable external inputs passed down from parent components.
// - State (Pillar 2): Encapsulated local memory owned and updated by the component via `useState`.
// - Lifecycle & Effects (Pillar 3): Execution side effects synchronized with props and state changes via `useEffect`.
// - Event Handling (Pillar 4): Functions responding to user actions to trigger state transitions.
// - Rendering (Pillar 5): Declarative JSX transformation mapping inputs and states into clean visual trees.
