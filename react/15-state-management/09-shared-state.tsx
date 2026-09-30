/**
 * Shared State
 * ============
 *
 * Shared state occurs when multiple independent components across different branches of the UI tree
 * require access to the exact same data source. Rather than maintaining duplicated state copies across
 * components, shared state is lifted to a common ancestor or state provider to enforce a single source
 * of truth.
 *
 * Changes to shared state automatically trigger re-renders across all consumer components simultaneously.
 * This guarantees UI synchronization across distant elements, such as navigation headers, sidebars, and
 * main content areas, preventing inconsistent UI states across the application.
 */

import React, { useState } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface CartItem {
  readonly id: number;
  readonly name: string;
  readonly price: number;
}

export interface HeaderSummaryProps {
  readonly itemCount: number;
  readonly totalPrice: number;
}

export interface ProductCatalogProps {
  readonly items: readonly CartItem[];
  readonly cartItemIds: readonly number[];
  readonly onAddToCart: (id: number) => void;
  readonly onRemoveFromCart: (id: number) => void;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

export const HeaderSummary: React.FC<HeaderSummaryProps> = ({ itemCount, totalPrice }) => {
  return (
    <header>
      <h3>Store Header</h3>
      <p>
        Cart Items: {itemCount} | Total Amount: ${totalPrice}
      </p>
    </header>
  );
};

export const ProductCatalog: React.FC<ProductCatalogProps> = ({
  items,
  cartItemIds,
  onAddToCart,
  onRemoveFromCart,
}) => {
  return (
    <div>
      <h3>Product Catalog</h3>
      {items.map((item) => {
        const isSelected = cartItemIds.includes(item.id);

        return (
          <div key={item.id}>
            <span>
              {item.name} - ${item.price}
            </span>{" "}
            {isSelected ? (
              <button type="button" onClick={() => onRemoveFromCart(item.id)}>
                Remove from Cart
              </button>
            ) : (
              <button type="button" onClick={() => onAddToCart(item.id)}>
                Add to Cart
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

export const SharedStateContainer: React.FC = () => {
  const [cartItemIds, setCartItemIds] = useState<readonly number[]>([]);

  const products: readonly CartItem[] = [
    { id: 1, name: "Wireless Headphones", price: 150 },
    { id: 2, name: "Ergonomic Chair", price: 300 },
    { id: 3, name: "4K Monitor", price: 450 },
  ];

  const handleAddToCart = (id: number): void => {
    if (!cartItemIds.includes(id)) {
      setCartItemIds((prev) => [...prev, id]);
    }
  };

  const handleRemoveFromCart = (id: number): void => {
    setCartItemIds((prev) => prev.filter((itemId) => itemId !== id));
  };

  const selectedProducts = products.filter((p) => cartItemIds.includes(p.id));
  const totalPrice = selectedProducts.reduce((sum, item) => sum + item.price, 0);

  return (
    <div>
      <h1>09 - Shared State</h1>

      <h2>1. Synchronized Header and Catalog Displaying Shared Cart Data</h2>
      <HeaderSummary itemCount={cartItemIds.length} totalPrice={totalPrice} />
      <ProductCatalog
        items={products}
        cartItemIds={cartItemIds}
        onAddToCart={handleAddToCart}
        onRemoveFromCart={handleRemoveFromCart}
      />
    </div>
  );
};

export default SharedStateContainer;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Shared state provides a single source of truth for multiple distinct consumer components.
// - Modifying shared state automatically re-renders all dependent UI elements across branches.
// - Holding shared state in a common ancestor guarantees UI data consistency across components.
// - Derived state metrics are computed at the state owner level and passed as read-only props.
// - Sharing state eliminates duplicate state sync code and prevents out-of-sync UI bugs.
