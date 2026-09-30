/**
 * Lazy State Initialization
 * =========================
 *
 * Passing the result of a function call directly to `useState` (such as `useState(computeData())`)
 * causes that function to execute on every re-render of the component, even though React discards
 * the return value on all renders after the initial render.
 *
 * To avoid re-running expensive initialization logic during subsequent re-renders, pass an initializer
 * function instead: `useState(() => computeData())`. React calls this initializer function only during
 * the initial render pass when creating the component instance on the UI tree.
 */

import React, { useState } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface ExpensiveInitProps {
  readonly initialLabel: string;
}

// ---------------------------------------------------------------------
// 2. Helper Functions
// ---------------------------------------------------------------------

export const computeHeavyInitialValue = (): number => {
  let count = 0;
  for (let i = 0; i < 1000; i++) {
    count += 1;
  }
  return count;
};

// ---------------------------------------------------------------------
// 3. Component Implementations
// ---------------------------------------------------------------------

export const EagerInitialization: React.FC<ExpensiveInitProps> = ({ initialLabel }) => {
  // Executes computeHeavyInitialValue() on every render cycle
  const [count, setCount] = useState<number>(computeHeavyInitialValue());

  return (
    <div>
      <p>
        {initialLabel} (Eager): {count}
      </p>
      <button type="button" onClick={() => setCount((prev) => prev + 1)}>
        Trigger Component Re-render
      </button>
    </div>
  );
};

export const LazyInitialization: React.FC<ExpensiveInitProps> = ({ initialLabel }) => {
  // Executes computeHeavyInitialValue() only on initial mount
  const [count, setCount] = useState<number>(() => computeHeavyInitialValue());

  return (
    <div>
      <p>
        {initialLabel} (Lazy): {count}
      </p>
      <button type="button" onClick={() => setCount((prev) => prev + 1)}>
        Trigger Component Re-render
      </button>
    </div>
  );
};

// ---------------------------------------------------------------------
// 4. Main Container Component
// ---------------------------------------------------------------------

export const LazyStateInitializationContainer: React.FC = () => {
  const [, setRerenderFlag] = useState<boolean>(false);

  return (
    <div>
      <h1>08 - Lazy State Initialization</h1>

      <h2>1. Eager State Initialization Execution</h2>
      <EagerInitialization initialLabel="Eager Initializer" />

      <h2>2. Lazy State Initialization Execution</h2>
      <LazyInitialization initialLabel="Lazy Initializer" />

      <h2>3. Force Container Re-render</h2>
      <button type="button" onClick={() => setRerenderFlag((prev) => !prev)}>
        Force Re-render Parent Container
      </button>
    </div>
  );
};

export default LazyStateInitializationContainer;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Direct function invocations in useState execute on every single component re-render pass.
// - Passing an initializer function to useState delays execution until initial component mount.
// - React ignores initial state initializer functions on all subsequent re-render cycles.
// - Lazy initialization prevents unnecessary computational overhead during component updates.
// - Use initializer functions when computing initial state involves heavy calculations or storage reads.
