/**
 * Index as Key
 * ============
 *
 * Using the array index as a key in React list rendering is generally discouraged, but it is acceptable
 * under specific static conditions. When a list is strictly static—meaning items are never reordered, filtered,
 * inserted, or deleted, and items hold no internal state—using the array index avoids explicit key generation.
 *
 * Conversely, using array indices as keys for dynamic lists leads to identity bugs. Because indices represent
 * positional order rather than persistent data identity, reordering or removing elements causes React to
 * misassociate DOM nodes and local state with the wrong data records during reconciliation cycles.
 */

import React, { useState } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface StaticItem {
  readonly title: string;
}

export interface DynamicItem {
  readonly id: string;
  readonly text: string;
}

export interface SafeIndexListProps {
  readonly items: ReadonlyArray<StaticItem>;
}

export interface UnsafeIndexListProps {
  readonly items: ReadonlyArray<DynamicItem>;
  readonly onDelete: (id: string) => void;
}

// ---------------------------------------------------------------------
// 2. Presentational Component Implementations
// ---------------------------------------------------------------------

export const SafeIndexList: React.FC<SafeIndexListProps> = (props) => {
  const { items } = props;

  return (
    <div>
      {items.map((item: StaticItem, index: number) => (
        <p key={index}>
          Static Entry {index}: {item.title}
        </p>
      ))}
    </div>
  );
};

export const UnsafeIndexList: React.FC<UnsafeIndexListProps> = (props) => {
  const { items, onDelete } = props;

  return (
    <div>
      {items.map((item: DynamicItem, index: number) => (
        <div key={index}>
          <span>
            {item.text} (Index {index}):{" "}
          </span>
          <input type="text" placeholder="Type to test state retention" />
          <button type="button" onClick={() => onDelete(item.id)}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

export const IndexAsKeyContainer: React.FC = () => {
  const staticItems: ReadonlyArray<StaticItem> = [
    { title: "Header Link A" },
    { title: "Header Link B" },
    { title: "Header Link C" },
  ];

  const [dynamicItems, setDynamicItems] = useState<ReadonlyArray<DynamicItem>>([
    { id: "item-1", text: "Alpha Record" },
    { id: "item-2", text: "Beta Record" },
    { id: "item-3", text: "Gamma Record" },
  ]);

  const handleDelete = (id: string): void => {
    setDynamicItems((prev: ReadonlyArray<DynamicItem>) => prev.filter((item: DynamicItem) => item.id !== id));
  };

  return (
    <div>
      <h1>Index as Key</h1>

      <h2>1. Safe Usage (Static Unchanging Array)</h2>
      <SafeIndexList items={staticItems} />

      <h2>2. Unsafe Usage (Dynamic Mutation & Deletion)</h2>
      <UnsafeIndexList items={dynamicItems} onDelete={handleDelete} />
    </div>
  );
};

export default IndexAsKeyContainer;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Safe Index Criteria: Permissible only when items are static, never reordered or mutated, and hold no local state.
// - Positional Key Hazard: Array indices track positional array slots rather than persistent data entity identities.
// - State Misassociation Bug: Removing an item forces remaining inputs to retain state bound to shifted index positions.
// - Reconciliation Inefficiency: Index shifts cause React to re-render DOM properties instead of moving existing nodes.
// - Best Practice Rule: Prefer unique domain entity identifiers over index values for dynamic collection mapping.
