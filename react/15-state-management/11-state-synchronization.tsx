/**
 * State Synchronization
 * =====================
 *
 * State synchronization refers to keeping multiple pieces of state in step with each other.
 * In React, duplicating state to keep values synchronized across components introduces bugs,
 * redundant re-renders, and race conditions.
 *
 * Rather than manually synchronizing separate state variables through effects or event handlers,
 * React favors computing derived values dynamically during render. When state must be shared,
 * lifting state up ensures a single authoritative source of truth without manual syncing.
 */

import React, { useState } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface Product {
  readonly id: number;
  readonly name: string;
  readonly price: number;
}

export interface ProductListProps {
  readonly products: readonly Product[];
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

export const SynchronizedSelection: React.FC<ProductListProps> = ({ products }) => {
  // Store primitive ID instead of duplicating the full product object in state
  const [selectedId, setSelectedId] = useState<number>(products[0]?.id ?? 1);

  // Synchronized derived state: Computed dynamically during render
  const selectedProduct = products.find((p) => p.id === selectedId) ?? products[0];

  return (
    <div>
      <h3>Product Selection (Derived Synchronization)</h3>
      <div>
        {products.map((product) => (
          <button key={product.id} type="button" onClick={() => setSelectedId(product.id)}>
            {product.name}
          </button>
        ))}
      </div>
      {selectedProduct && (
        <p>
          Selected: {selectedProduct.name} — ${selectedProduct.price}
        </p>
      )}
    </div>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

export const StateSynchronizationContainer: React.FC = () => {
  const products: readonly Product[] = [
    { id: 1, name: "Workstation Laptop", price: 1500 },
    { id: 2, name: "Mechanical Keyboard", price: 150 },
    { id: 3, name: "UltraWide Monitor", price: 800 },
  ];

  return (
    <div>
      <h1>11 - State Synchronization</h1>

      <h2>1. Deriving Synchronized Selection State During Render</h2>
      <SynchronizedSelection products={products} />
    </div>
  );
};

export default StateSynchronizationContainer;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Manual state synchronization across multiple variables creates redundant state and bugs.
// - Computing derived values dynamically during render guarantees instant state synchronization.
// - Storing selection IDs rather than full objects avoids stale data duplication in state.
// - Lifting state to a common parent replaces manual sync chains with unidirectional props.
// - Eliminating redundant state reduces re-renders and keeps the UI predictable and lean.
