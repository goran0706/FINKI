/**
 * State Boundaries
 * ================
 *
 * State boundaries define the isolated boundaries within the component tree where state is held
 * and managed. Encapsulating state updates inside subtrees ensures that re-renders are contained
 * locally without causing top-level re-renders across unaffected sibling or parent subtrees.
 *
 * Designing explicit state boundaries prevents unnecessary re-rendering across broad component
 * trees, keeping state isolated near consuming components while insulating parent structures.
 */

import React, { useState } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface IsolatedBoundaryProps {
  readonly title: string;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

export const IsolatedBoundary: React.FC<IsolatedBoundaryProps> = ({ title }) => {
  // State boundary encapsulation: Re-renders are contained strictly inside this subtree
  const [count, setCount] = useState<number>(0);

  return (
    <div>
      <h3>{title}</h3>
      <p>Internal State Boundary Counter: {count}</p>
      <button type="button" onClick={() => setCount((prev) => prev + 1)}>
        Increment Boundary State
      </button>
    </div>
  );
};

export const StaticSibling: React.FC = () => {
  return (
    <div>
      <h3>Static Sibling Subtree</h3>
      <p>This component sits outside the state boundary and remains unaffected by updates.</p>
    </div>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

export const StateBoundariesContainer: React.FC = () => {
  return (
    <div>
      <h1>10 - State Boundaries</h1>

      <h2>1. Subtree State Boundary Containing Internal Re-renders</h2>
      <IsolatedBoundary title="Isolated Counter Subtree A" />
      <IsolatedBoundary title="Isolated Counter Subtree B" />
      <StaticSibling />
    </div>
  );
};

export default StateBoundariesContainer;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - State boundaries isolate state updates to specific component subtrees in the render hierarchy.
// - Encapsulating local state inside boundaries prevents unnecessary re-renders in parent trees.
// - Subtree state updates remain strictly contained within the declaring component boundary.
// - Isolating heavy interactive subtrees improves application rendering efficiency and clarity.
// - Strategic boundary placement establishes clean architectural separation across component scopes.
