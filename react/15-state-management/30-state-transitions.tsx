/**
 * State Transitions
 * =================
 *
 * State transitions define how an application moves from one state snapshot to another in
 * response to user actions or asynchronous events. Explicitly orchestrating state updates
 * ensures UI updates remain predictable, atomic, and synchronized with side effects.
 *
 * React state transitions can be non-blocking using `useTransition`, separating urgent state
 * updates (like typing in an input) from non-urgent transitions (like filtering a heavy list),
 * keeping the UI responsive during resource-intensive state changes.
 */

import React, { useState, useTransition } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface TransitionItem {
  readonly id: number;
  readonly text: string;
}

export interface TransitionListProps {
  readonly query: string;
}

// ---------------------------------------------------------------------
// 2. Secondary Display Component
// ---------------------------------------------------------------------

export const HeavyTransitionList: React.FC<TransitionListProps> = ({ query }) => {
  // Generate filtered list items based on non-urgent transition query
  const items: readonly TransitionItem[] = Array.from({ length: 2000 }, (_, index) => ({
    id: index,
    text: `Transition Record #${index + 1} matching "${query}"`,
  })).filter((item) => (query ? item.text.toLowerCase().includes(query.toLowerCase()) : true));

  return (
    <div>
      <p>Total Matching Items Rendered: {items.length}</p>
      <ul>
        {items.slice(0, 30).map((item) => (
          <li key={item.id}>{item.text}</li>
        ))}
      </ul>
    </div>
  );
};

// ---------------------------------------------------------------------
// 3. Main Transition State Controller Component
// ---------------------------------------------------------------------

export const TransitionStateController: React.FC = () => {
  const [urgentQuery, setUrgentQuery] = useState<string>("");
  const [deferredQuery, setDeferredQuery] = useState<string>("");
  const [isPending, startTransition] = useTransition();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const nextValue = e.target.value;
    // Urgent state update: keep input typing responsive
    setUrgentQuery(nextValue);

    // Non-urgent state transition: calculate deferred filtering without blocking input
    startTransition(() => {
      setDeferredQuery(nextValue);
    });
  };

  return (
    <div>
      <h4>Concurrent State Transition Manager</h4>

      <div>
        <input
          type="text"
          value={urgentQuery}
          onChange={handleInputChange}
          placeholder="Type to trigger transition..."
        />
        {isPending && <span>Processing non-urgent state transition...</span>}
      </div>

      <HeavyTransitionList query={deferredQuery} />
    </div>
  );
};

// ---------------------------------------------------------------------
// 4. Main Container Component
// ---------------------------------------------------------------------

export const StateTransitionsContainer: React.FC = () => {
  return (
    <div>
      <h1>30 - State Transitions</h1>

      <h2>1. Non-Blocking Non-Urgent State Transitions via useTransition</h2>
      <TransitionStateController />
    </div>
  );
};

export default StateTransitionsContainer;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - State transitions govern state updates in response to user actions or async events.
// - Non-urgent state transitions wrapped in startTransition prevent input rendering blocking.
// - Urgent state updates render immediately to maintain smooth user input responsiveness.
// - useTransition exposes an isPending flag to indicate background state calculation status.
// - Concurrent state transitions optimize performance during heavy component tree re-renders.
