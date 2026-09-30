/**
 * Key Stability
 * =============
 *
 * React relies on key stability to maintain DOM element identity and preserve local component state
 * across re-render cycles. A stable key persists for a given data record throughout its lifecycle.
 *
 * Using unstable keys—such as array index positions or dynamic runtime generators like `Math.random()`—
 * causes reconciliation failures. Index keys trigger component state mismatch when elements are prepended
 * or reordered, while dynamically generated keys force React to unmount and recreate child DOM subtrees
 * on every single render cycle, destroying internal state and crippling rendering performance.
 */

import React, { useState } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface TaskItem {
  readonly id: string;
  readonly text: string;
}

export interface KeyStabilityListProps {
  readonly items: ReadonlyArray<TaskItem>;
}

// ---------------------------------------------------------------------
// 2. Key Stability Implementations
// ---------------------------------------------------------------------

export const StableKeyList: React.FC<KeyStabilityListProps> = (props) => {
  const { items } = props;

  return (
    <div>
      {items.map((item: TaskItem) => (
        <div key={item.id}>
          <span>{item.text}: </span>
          <input type="text" placeholder="State bound to ID" />
        </div>
      ))}
    </div>
  );
};

export const IndexKeyList: React.FC<KeyStabilityListProps> = (props) => {
  const { items } = props;

  return (
    <div>
      {items.map((item: TaskItem, index: number) => (
        <div key={index}>
          <span>{item.text}: </span>
          <input type="text" placeholder="State bound to Index" />
        </div>
      ))}
    </div>
  );
};

export const DynamicRandomKeyList: React.FC<KeyStabilityListProps> = (props) => {
  const { items } = props;

  return (
    <div>
      {items.map((item: TaskItem) => (
        <div key={Math.random()}>
          <span>{item.text}: </span>
          <input type="text" placeholder="State destroyed on render" />
        </div>
      ))}
    </div>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

export const KeysStabilityContainer: React.FC = () => {
  const [items, setItems] = useState<ReadonlyArray<TaskItem>>([
    { id: "task-101", text: "First Task" },
    { id: "task-102", text: "Second Task" },
  ]);

  const handlePrependTask = (): void => {
    const newTask: TaskItem = {
      id: `task-${Date.now()}`,
      text: `Task ${items.length + 1}`,
    };

    setItems((prev: ReadonlyArray<TaskItem>) => [newTask, ...prev]);
  };

  return (
    <div>
      <h1>Keys Stability</h1>

      <button type="button" onClick={handlePrependTask}>
        Prepend Task to List
      </button>

      <h2>1. Stable Keys (Domain IDs)</h2>
      <StableKeyList items={items} />

      <h2>2. Unstable Keys (Array Index)</h2>
      <IndexKeyList items={items} />

      <h2>3. Unstable Dynamic Keys (Math.random)</h2>
      <DynamicRandomKeyList items={items} />
    </div>
  );
};

export default KeysStabilityContainer;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Stable Key Identifier: Uses unique domain IDs (`item.id`) to preserve DOM identity and local state across updates.
// - Index Key Drift: Array indices cause state misalignments when items are prepended, inserted, or reordered.
// - Dynamic Key Destruction: Inlining `Math.random()` or `Date.now()` forces complete component unmounting on every render.
// - State Preservation: Stable keys ensure uncontrolled child state (like input values or focus) stays bound to the correct item.
// - Performance Impact: Unstable keys invalidate Virtual DOM diffing, causing unnecessary full DOM re-creations.
