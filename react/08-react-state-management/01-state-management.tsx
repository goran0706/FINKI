import React, { ReactNode, useState } from "react";

interface NavbarProps {
  cartItemsCount: number;
  children: ReactNode;
}

interface CartProps {
  cartItems: string[];
  onClear: () => void;
}

const NavBar = ({ cartItemsCount }: NavbarProps) => (
  <div>NavBar: {cartItemsCount}</div>
);

const Cart = ({ cartItems, onClear }: CartProps) => (
  <div>
    <div>Cart</div>
    <ul>
      {cartItems.map((item) => (
        <li>{item}</li>
      ))}
    </ul>
    <button onClick={onClear}>Clear</button>
  </div>
);

const StateManagement = () => {
  const [cartItems, setCartItem] = useState(["Product1", "Product2"]);
  const cartItemsCount = cartItems.length;

  // Remember:
  // The component that is holding the state is also responsible for updating the state.
  // - StateManagement component should handle any state updates.
  // - Cart component shouldn't change the props (update the state)
  const emptyCartItems = () => setCartItem([]);

  return (
    <NavBar cartItemsCount={cartItemsCount}>
      <Cart cartItems={cartItems} onClear={emptyCartItems} />
    </NavBar>
  );
};

export default StateManagement;
