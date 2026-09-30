/**
 * Context Custom Hook
 * ===================
 *
 * Combining a custom context hook with a dedicated provider component creates a robust state management
 * module. This pattern encapsulates state creation, transition handlers, and context provision into a single
 * cohesive API boundary, exposing only what consumers need to read or update state.
 *
 * Exposing a custom hook alongside an encapsulated provider hides internal implementation details (such as
 * `useState` or `useReducer` declarations), prevents out-of-bounds context consumption through guards, and
 * enforces uniform state transitions across the application.
 */

import React, { createContext, ReactNode, useContext, useState } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface ShoppingCartItem {
  readonly id: string;
  readonly name: string;
  readonly price: number;
  readonly quantity: number;
}

export interface ShoppingCartContextType {
  readonly items: readonly ShoppingCartItem[];
  readonly totalAmount: number;
  readonly addItem: (product: Omit<ShoppingCartItem, "quantity">) => void;
  readonly removeItem: (id: string) => void;
  readonly clearCart: () => void;
}

export interface ShoppingCartProviderProps {
  readonly children: ReactNode;
}

// ---------------------------------------------------------------------
// 2. Context Creation & Encapsulated Custom Hook
// ---------------------------------------------------------------------

export const ShoppingCartContext = createContext<ShoppingCartContextType | undefined>(undefined);

export const useShoppingCart = (): ShoppingCartContextType => {
  const context = useContext(ShoppingCartContext);
  if (!context) {
    throw new Error("useShoppingCart must be used within a ShoppingCartProvider");
  }
  return context;
};

// ---------------------------------------------------------------------
// 3. Encapsulated Provider Component
// ---------------------------------------------------------------------

export const ShoppingCartProvider: React.FC<ShoppingCartProviderProps> = ({ children }) => {
  const [items, setItems] = useState<readonly ShoppingCartItem[]>([]);

  const addItem = (product: Omit<ShoppingCartItem, "quantity">): void => {
    setItems((prev) => {
      const existingIndex = prev.findIndex((item) => item.id === product.id);
      if (existingIndex > -1) {
        return prev.map((item, index) => (index === existingIndex ? { ...item, quantity: item.quantity + 1 } : item));
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeItem = (id: string): void => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = (): void => {
    setItems([]);
  };

  const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const value: ShoppingCartContextType = {
    items,
    totalAmount,
    addItem,
    removeItem,
    clearCart,
  };

  return <ShoppingCartContext.Provider value={value}>{children}</ShoppingCartContext.Provider>;
};

// ---------------------------------------------------------------------
// 4. Consumer Component Implementations
// ---------------------------------------------------------------------

export const ProductList: React.FC = () => {
  const { addItem } = useShoppingCart();

  const availableProducts = [
    { id: "p1", name: "Mechanical Keyboard", price: 120 },
    { id: "p2", name: "Wireless Mouse", price: 60 },
  ];

  return (
    <div>
      <h4>Available Products</h4>
      {availableProducts.map((product) => (
        <div key={product.id}>
          <span>
            {product.name} - ${product.price}
          </span>{" "}
          <button type="button" onClick={() => addItem(product)}>
            Add To Cart
          </button>
        </div>
      ))}
    </div>
  );
};

export const CartSummary: React.FC = () => {
  const { items, totalAmount, removeItem, clearCart } = useShoppingCart();

  return (
    <div>
      <h4>Cart Contents (Total: ${totalAmount})</h4>
      {items.length === 0 ? (
        <p>Cart is empty.</p>
      ) : (
        <div>
          <ul>
            {items.map((item) => (
              <li key={item.id}>
                {item.name} x {item.quantity} ($
                {item.price * item.quantity}){" "}
                <button type="button" onClick={() => removeItem(item.id)}>
                  Remove
                </button>
              </li>
            ))}
          </ul>
          <button type="button" onClick={clearCart}>
            Clear Cart
          </button>
        </div>
      )}
    </div>
  );
};

// ---------------------------------------------------------------------
// 5. Main Container Component
// ---------------------------------------------------------------------

export const ContextCustomHookContainer: React.FC = () => {
  return (
    <ShoppingCartProvider>
      <div>
        <h1>21 - Context Custom Hook</h1>

        <h2>1. Complete Encapsulated State Management Module</h2>
        <ProductList />
        <CartSummary />
      </div>
    </ShoppingCartProvider>
  );
};

export default ContextCustomHookContainer;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Custom context hooks paired with providers form reusable state management modules.
// - Encapsulating provider logic hides underlying hooks and state structures from consumers.
// - Custom hooks enforce provider boundaries by throwing descriptive runtime errors.
// - Public APIs expose clean read-only state properties alongside explicit state action handlers.
// - Module boundaries isolate domain state while enabling effortless tree consumption.
