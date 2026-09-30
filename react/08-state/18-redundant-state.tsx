/**
 * Redundant State
 * ===============
 *
 * Redundant state occurs when information stored in local state can be calculated directly from existing
 * props or other state variables during render. Duplicate state requires manual synchronization across
 * multiple state updates and event handlers, introducing state desynchronization bugs and unnecessary
 * re-renders.
 *
 * Common examples of redundant state include storing full name alongside first and last name, storing item
 * counts alongside array items, or mirroring props directly into local state. Refactoring redundant state
 * to computed inline variables keeps state minimal and eliminates redundant update operations.
 */

import React, { useState } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface CartItem {
  readonly id: number;
  readonly name: string;
  readonly price: number;
  readonly quantity: number;
}

export interface ShoppingCartProps {
  readonly initialItems: readonly CartItem[];
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

export const RedundantStateCart: React.FC<ShoppingCartProps> = ({ initialItems }) => {
  const [items, setItems] = useState<readonly CartItem[]>(initialItems);

  // REDUNDANT STATE: Storing totalCount and totalPrice in state creates manual sync burdens
  const [totalCount, setTotalCount] = useState<number>(initialItems.reduce((acc, item) => acc + item.quantity, 0));
  const [totalPrice, setTotalPrice] = useState<number>(
    initialItems.reduce((acc, item) => acc + item.price * item.quantity, 0),
  );

  const handleIncrementQuantity = (id: number): void => {
    const nextItems = items.map((item) => {
      if (item.id === id) {
        return { ...item, quantity: item.quantity + 1 };
      }
      return item;
    });

    // Manual state synchronization prone to bugs
    setItems(nextItems);
    setTotalCount(nextItems.reduce((acc, item) => acc + item.quantity, 0));
    setTotalPrice(nextItems.reduce((acc, item) => acc + item.price * item.quantity, 0));
  };

  return (
    <div>
      <p>
        Redundant Cart - Total Items: {totalCount} | Total Price: ${totalPrice}
      </p>
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            {item.name} x {item.quantity} ($
            {item.price * item.quantity}){" "}
            <button type="button" onClick={() => handleIncrementQuantity(item.id)}>
              +1 Quantity
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export const RefactoredMinimalStateCart: React.FC<ShoppingCartProps> = ({ initialItems }) => {
  const [items, setItems] = useState<readonly CartItem[]>(initialItems);

  // MINIMAL STATE: Derived values calculated during render pass
  const totalCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleIncrementQuantity = (id: number): void => {
    setItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === id) {
          return { ...item, quantity: item.quantity + 1 };
        }
        return item;
      }),
    );
  };

  return (
    <div>
      <p>
        Refactored Cart - Total Items: {totalCount} | Total Price: ${totalPrice}
      </p>
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            {item.name} x {item.quantity} ($
            {item.price * item.quantity}){" "}
            <button type="button" onClick={() => handleIncrementQuantity(item.id)}>
              +1 Quantity
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

export const RedundantStateContainer: React.FC = () => {
  const defaultCart: readonly CartItem[] = [
    { id: 1, name: "Keyboard", price: 120, quantity: 1 },
    { id: 2, name: "Mouse", price: 60, quantity: 2 },
  ];

  return (
    <div>
      <h1>18 - Redundant State</h1>

      <h2>1. Redundant State Requiring Manual Synchronization</h2>
      <RedundantStateCart initialItems={defaultCart} />

      <h2>2. Refactored Minimal State with Render-Time Computations</h2>
      <RefactoredMinimalStateCart initialItems={defaultCart} />
    </div>
  );
};

export default RedundantStateContainer;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Redundant state refers to values in state that can be derived directly from other props or state.
// - Duplicating derived values forces developer maintenance across every event handler and state update.
// - Manual state synchronization frequently causes subtle bugs where state values fall out of sync.
// - Calculating derived totals inline during render eliminates redundant state setters and re-renders.
// - Keeping component state minimal makes components easier to read, maintain, and refactor reliably.
