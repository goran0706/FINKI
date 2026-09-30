/**
 * Array State
 * ===========
 *
 * Arrays in JavaScript are mutable, but when stored in React state, they should be treated as read-only.
 * Mutating an array in place using methods like `push()`, `pop()`, or `splice()` alters the existing
 * reference, causing React's `Object.is` comparison to see no state change and skip re-rendering.
 *
 * To update an array in state, pass a new array reference created with non-mutating methods such as
 * `concat()`, `filter()`, `map()`, or spread syntax (`[...arr]`). To transform, insert, or replace items
 * within an array, create copies of the modified elements alongside the copied container array.
 */

import React, { useState } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface ListItem {
  readonly id: number;
  readonly text: string;
}

export interface ArrayStateProps {
  readonly initialItems: readonly ListItem[];
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

export const ItemListManager: React.FC<ArrayStateProps> = ({ initialItems }) => {
  const [items, setItems] = useState<readonly ListItem[]>(initialItems);
  const [textInput, setTextInput] = useState<string>("");

  const handleAddItem = (): void => {
    if (!textInput.trim()) {
      return;
    }

    const newItem: ListItem = {
      id: Date.now(),
      text: textInput.trim(),
    };

    // Create a fresh array reference using spread syntax
    setItems((prevItems) => [...prevItems, newItem]);
    setTextInput("");
  };

  const handleRemoveItem = (idToRemove: number): void => {
    // filter returns a brand new array reference without the target item
    setItems((prevItems) => prevItems.filter((item) => item.id !== idToRemove));
  };

  return (
    <div>
      <label htmlFor="item-input">New Item: </label>
      <input id="item-input" type="text" value={textInput} onChange={(e) => setTextInput(e.target.value)} />
      <button type="button" onClick={handleAddItem}>
        Add Item (Spread)
      </button>

      <ul>
        {items.map((item) => (
          <li key={item.id}>
            {item.text}{" "}
            <button type="button" onClick={() => handleRemoveItem(item.id)}>
              Delete (Filter)
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export const ArrayTransformations: React.FC<ArrayStateProps> = ({ initialItems }) => {
  const [items, setItems] = useState<readonly ListItem[]>(initialItems);

  const handleUppercaseAll = (): void => {
    // map produces a new array with updated item copies
    setItems((prevItems) =>
      prevItems.map((item) => ({
        ...item,
        text: item.text.toUpperCase(),
      })),
    );
  };

  const handleReverseItems = (): void => {
    // Copy original array before calling mutating method reverse()
    setItems((prevItems) => [...prevItems].reverse());
  };

  return (
    <div>
      <button type="button" onClick={handleUppercaseAll}>
        Uppercase All (Map)
      </button>
      <button type="button" onClick={handleReverseItems}>
        Reverse Array Order (Copy + Reverse)
      </button>

      <ul>
        {items.map((item) => (
          <li key={item.id}>{item.text}</li>
        ))}
      </ul>
    </div>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

export const ArrayStateContainer: React.FC = () => {
  const defaultList: readonly ListItem[] = [
    { id: 1, text: "Learn React" },
    { id: 2, text: "Build Architecture Repo" },
  ];

  return (
    <div>
      <h1>15 - Array State</h1>

      <h2>1. Adding and Removing Array Items Immutably</h2>
      <ItemListManager initialItems={defaultList} />

      <h2>2. Transforming and Reordering Array State</h2>
      <ArrayTransformations initialItems={defaultList} />
    </div>
  );
};

export default ArrayStateContainer;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Arrays in React state must be treated as immutable read-only structures.
// - Mutating array methods like push, pop, or splice prevent React from detecting state updates.
// - Non-mutating methods like concat, filter, and map generate fresh array references for rendering.
// - Array spread operators allow insertion of new items while preserving existing elements.
// - Call mutating methods like reverse or sort only on copied array instances to produce updated references.
