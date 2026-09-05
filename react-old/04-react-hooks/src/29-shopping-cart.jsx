import { useState } from "react";

const cars = [
  { name: "Audi", price: 30000 },
  { name: "BMW", price: 40000 },
  { name: "Porsche", price: 50000 },
];
export default function ShoppingCart() {
  const [cart, setCart] = useState([]);
  console.log(cart);

  const addToCart = (product) => {
    const cartCopy = [...cart];
    const productInCart = cartCopy.find((p) => p.name === product.name);

    if (productInCart) {
      productInCart.quantity += 1;
      setCart(cartCopy);
    } else {
      setCart((prevState) => [...prevState, { ...product, quantity: 1 }]);
    }
  };

  const increaseQuantity = (product) => {
    const cartCopy = [...cart];
    const productInCart = cartCopy.find((p) => p.name === product.name);

    if (productInCart) {
      productInCart.quantity += 1;
    }

    setCart(cartCopy);
  };

  const decreaseQuantity = (product) => {
    let cartCopy = [...cart];
    const productInCart = cartCopy.find((p) => p.name === product.name);

    if (productInCart) {
      productInCart.quantity -= 1;
    } else {
      cartCopy = cartCopy.filter((p) => p.name !== product.name);
    }

    setCart(cartCopy);
  };

  return (
    <div>
      <h1>Shopping Cart</h1>

      <div className="wrapper">
        {cars.map((product) => (
          <div className="products" key={product.name}>
            <div>Product: {product.name}</div>
            <div>Price: {product.price}</div>
            <button onClick={() => addToCart(product)}>Add to cart</button>
          </div>
        ))}

        {cart.map((product) => (
          <div className="products" key={product.name}>
            <div>Product: {product.name}</div>
            <div>Price: {product.price}</div>
            <button onClick={() => decreaseQuantity(product)}>Decrease</button>
            <div>Quantity: {product.quantity}</div>
            <button onClick={() => increaseQuantity(product)}>Increase</button>
          </div>
        ))}
      </div>
    </div>
  );
}
