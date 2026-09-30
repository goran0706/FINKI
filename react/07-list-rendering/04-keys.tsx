/**
 * Keys
 * ====
 *
 * React keys are special string or number attributes required when rendering dynamic element lists.
 * Keys provide a persistent identity mechanism that allows React's Virtual DOM reconciliation engine
 * to match rendered nodes across re-render cycles efficiently.
 *
 * Keys must be unique among immediate sibling elements in a list, though they do not need to be globally
 * unique across the entire application. Proper key assignment prevents state corruption, unnecessary DOM
 * mutations, and unintended component re-initializations during list sorting or updates.
 */

import React from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface KeyItem {
  readonly id: string;
  readonly code: number;
  readonly label: string;
}

export interface KeyedListProps {
  readonly items: ReadonlyArray<KeyItem>;
}

// ---------------------------------------------------------------------
// 2. Key Type Implementations
// ---------------------------------------------------------------------

export const StringKeyedList: React.FC<KeyedListProps> = (props) => {
  const { items } = props;

  return (
    <div>
      {items.map((item: KeyItem) => (
        <p key={item.id}>
          String Key ({item.id}): {item.label}
        </p>
      ))}
    </div>
  );
};

export const NumberKeyedList: React.FC<KeyedListProps> = (props) => {
  const { items } = props;

  return (
    <div>
      {items.map((item: KeyItem) => (
        <p key={item.code}>
          Number Key ({item.code}): {item.label}
        </p>
      ))}
    </div>
  );
};

export const SiblingScopeList: React.FC<KeyedListProps> = (props) => {
  const { items } = props;

  return (
    <div>
      <div>
        <h3>Group A (Sibling Scope)</h3>
        {items.map((item: KeyItem) => (
          <p key={item.id}>Group A - {item.label}</p>
        ))}
      </div>

      <div>
        <h3>Group B (Sibling Scope)</h3>
        {items.map((item: KeyItem) => (
          <p key={item.id}>Group B - {item.label}</p>
        ))}
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

export const KeysContainer: React.FC = () => {
  const items: ReadonlyArray<KeyItem> = [
    { id: "key-alpha", code: 101, label: "Alpha Module" },
    { id: "key-beta", code: 102, label: "Beta Module" },
    { id: "key-gamma", code: 103, label: "Gamma Module" },
  ];

  return (
    <div>
      <h1>React Keys</h1>

      <h2>1. String Key Reconciliation</h2>
      <StringKeyedList items={items} />

      <h2>2. Number Key Reconciliation</h2>
      <NumberKeyedList items={items} />

      <h2>3. Sibling Scope Key Uniqueness</h2>
      <SiblingScopeList items={items} />
    </div>
  );
};

export default KeysContainer;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Reconciliation Identity: Keys give list elements persistent identities across Virtual DOM diffing cycles.
// - Sibling Uniqueness: Keys must be unique among immediate sibling nodes, not globally across the entire app.
// - Key Types: Accepts primitive string or number values as valid reconciliation key identifiers.
// - DOM Optimization: Enables React to reorder or patch existing DOM nodes instead of recreating them from scratch.
// - Dedicated Line Destructuring: Enforces single-property line breaks during prop destructuring inside component bodies.
