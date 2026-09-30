/**
 * Derived State
 * =============
 *
 * Derived state refers to values calculated dynamically on every render from existing props or state.
 * Storing redundant values in local state creates synchronization bugs, requires redundant effects,
 * and increases state management complexity unnecessarily.
 *
 * Values that can be computed during render should never be duplicated in state setters or synced via
 * effects. Instead, calculate these values directly within the component function body or memoize them
 * when performance optimization is necessary.
 */

import React, { useState } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface Item {
  readonly id: number;
  readonly name: string;
}

export interface NameFormProps {
  readonly defaultFirstName: string;
  readonly defaultLastName: string;
}

export interface ItemSelectionProps {
  readonly items: readonly Item[];
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

export const CalculatedFullName: React.FC<NameFormProps> = ({ defaultFirstName, defaultLastName }) => {
  const [firstName, setFirstName] = useState<string>(defaultFirstName);
  const [lastName, setLastName] = useState<string>(defaultLastName);

  // Derived value calculated during render pass without extra state or effects
  const fullName = `${firstName} ${lastName}`.trim();

  return (
    <div>
      <label htmlFor="first-name-input">First Name: </label>
      <input id="first-name-input" type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} />

      <br />

      <label htmlFor="last-name-input">Last Name: </label>
      <input id="last-name-input" type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} />

      <p>Full Name (Derived): {fullName}</p>
    </div>
  );
};

export const DerivedSelection: React.FC<ItemSelectionProps> = ({ items }) => {
  const [selectedId, setSelectedId] = useState<number | null>(items[0]?.id ?? null);

  // Derived selected object computed from selectedId state during render
  const selectedItem = items.find((item) => item.id === selectedId) ?? null;

  return (
    <div>
      <label htmlFor="item-select">Choose Item: </label>
      <select id="item-select" value={selectedId ?? ""} onChange={(e) => setSelectedId(Number(e.target.value))}>
        {items.map((item) => (
          <option key={item.id} value={item.id}>
            {item.name}
          </option>
        ))}
      </select>

      <p>Selected Item: {selectedItem ? `${selectedItem.name} (ID: ${selectedItem.id})` : "None"}</p>
    </div>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

export const DerivedStateContainer: React.FC = () => {
  const sampleItems: readonly Item[] = [
    { id: 101, name: "Alpha Component" },
    { id: 102, name: "Beta Module" },
    { id: 103, name: "Gamma Service" },
  ];

  return (
    <div>
      <h1>17 - Derived State</h1>

      <h2>1. Computing Strings Dynamically During Render</h2>
      <CalculatedFullName defaultFirstName="Ada" defaultLastName="Lovelace" />

      <h2>2. Deriving Objects from IDs During Render</h2>
      <DerivedSelection items={sampleItems} />
    </div>
  );
};

export default DerivedStateContainer;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Derived state consists of values calculated dynamically during render from props or existing state.
// - Redundant state variables introduce synchronization bugs and unnecessary re-render passes.
// - Calculating derived values directly in the function body eliminates the need for state sync effects.
// - Derive single objects or items using identifiers like IDs rather than duplicating objects in state.
// - Computing values during render keeps state minimal, predictable, and aligned with official React patterns.
