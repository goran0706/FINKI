/**
 * Component Layout
 * ================
 *
 * A well-structured React component follows a tripartite anatomical layout. Maintaining this
 * consistent structure across a codebase improves readability, maintainability, and cognitive
 * predictability through three core sections:
 *
 * - Data (Inputs & Memory): Destructuring props and declaring local state via `useState`.
 * - Logic (Behavior & Computations): Managing derived state, side effects (`useEffect`), and event handlers.
 * - Appearance (View / UI): The declarative JSX output mapping data and logic directly to the DOM.
 */

import React, { useCallback, useEffect, useState } from "react";

// ---------------------------------------------------------------------
// Component Props Interface
// ---------------------------------------------------------------------

export interface ComponentLayoutProps {
  readonly title?: string;
  readonly initialCount?: number;
}

// ---------------------------------------------------------------------
// Component Implementation
// ---------------------------------------------------------------------

export const ComponentLayout: React.FC<ComponentLayoutProps> = (props) => {
  // =====================================================================
  // SECTION 1: DATA (Inputs & Memory)
  // =====================================================================
  // Props destructured on a new line inside the component body
  const { title = "Component Anatomical Layout", initialCount = 0 } = props;

  // Local state declarations (Source of Truth)
  const [count, setCount] = useState<number>(initialCount);

  // =====================================================================
  // SECTION 2: LOGIC (Behavior & Computations)
  // =====================================================================
  // 2A. Derived State / Computations
  const isLimitReached = count >= 5;

  // 2B. Side Effects
  useEffect(() => {
    if (isLimitReached) {
      console.log("[Logic: Effect] Interaction limit reached!");
    }
  }, [isLimitReached]);

  // 2C. Event Handlers
  const handleIncrement = useCallback(() => {
    setCount((prev) => prev + 1);
  }, []);

  const handleReset = (): void => {
    setCount(initialCount);
  };

  // =====================================================================
  // SECTION 3: APPEARANCE (View / UI)
  // =====================================================================
  // Declarative JSX mapping Data and Logic directly to the DOM
  return (
    <div>
      <header>
        <h1>{title}</h1>
        <p>Count: {count}</p>
      </header>

      <main>
        <button type="button" onClick={handleIncrement}>
          Increment
        </button>
        <button type="button" onClick={handleReset}>
          Reset
        </button>

        {isLimitReached && <p>Limit reached!</p>}
      </main>
    </div>
  );
};

export default ComponentLayout;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Data (Top): Source of truth for the render cycle (props destructuring, state initialization).
// - Logic (Middle): Process data into derived values, handle side effects (`useEffect`), and define interactions.
// - Appearance (Bottom): Pure declarative JSX return structure representing the UI tree.
