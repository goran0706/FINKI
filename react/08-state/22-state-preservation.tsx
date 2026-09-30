/**
 * State Preservation
 * ==================
 *
 * State is tied to a component's position in the UI tree, not to the component instance itself. React
 * preserves state as long as a component is rendered at the exact same position in the component tree
 * across re-renders.
 *
 * If a component is rendered at a different position in the UI tree, or if a different component type is
 * rendered at the same position, React destroys the old component instance, removes its state from memory,
 * and mounts a fresh component instance with initial state.
 */

import React, { useState } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface CounterProps {
  readonly isFancy?: boolean;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

export const PreservationCounter: React.FC<CounterProps> = ({ isFancy = false }) => {
  const [score, setScore] = useState<number>(0);

  return (
    <div
      style={{
        border: isFancy ? "2px solid gold" : "1px solid gray",
        padding: "8px",
      }}
    >
      <p>Score: {score}</p>
      <button type="button" onClick={() => setScore((prev) => prev + 1)}>
        Add Point
      </button>
    </div>
  );
};

export const TreePositionPreservation: React.FC = () => {
  const [isFancy, setIsFancy] = useState<boolean>(false);

  return (
    <div>
      {/* Same position in UI tree: state is preserved even when props change */}
      <PreservationCounter isFancy={isFancy} />

      <button type="button" onClick={() => setIsFancy((prev) => !prev)}>
        Toggle Styling Prop ({isFancy ? "Fancy" : "Normal"})
      </button>
    </div>
  );
};

export const TreePositionReset: React.FC = () => {
  const [isFancy, setIsFancy] = useState<boolean>(false);

  return (
    <div>
      {/* Different positions in JSX branches: state resets when switching branches */}
      {isFancy ? (
        <div>
          <PreservationCounter isFancy={true} />
        </div>
      ) : (
        <section>
          <PreservationCounter isFancy={false} />
        </section>
      )}

      <button type="button" onClick={() => setIsFancy((prev) => !prev)}>
        Toggle Outer Element Wrapper (Reset State)
      </button>
    </div>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

export const StatePreservationContainer: React.FC = () => {
  return (
    <div>
      <h1>22 - State Preservation</h1>

      <h2>1. Same Position in UI Tree Preserves State</h2>
      <TreePositionPreservation />

      <h2>2. Different Parent Hierarchy Resets State</h2>
      <TreePositionReset />
    </div>
  );
};

export default StatePreservationContainer;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - React ties local component state directly to its structural position in the UI rendering tree.
// - Rendering a component at the same tree position across re-renders preserves its local state.
// - Changing the component type or wrapper element at a tree position unmounts and resets state.
// - Conditional rendering in separate tree branches creates distinct state instances upon mounting.
// - Preserving state requires maintaining consistent component position and wrapping element hierarchy.
