/**
 * Required Props
 * ==============
 *
 * Required props represent non-optional inputs that a component depends on to function correctly.
 * TypeScript enforces their presence at compile-time, preventing instantiation of components without
 * mandatory data dependencies.
 *
 * Properties declared without optional modifiers are mandatory for compilation, triggering static
 * build errors if omitted by parent components. This guarantees reliable runtime execution without
 * requiring defensive nullish checks, enforcing consistent structural integrity across boundaries.
 */

import React from "react";

// ---------------------------------------------------------------------
// 1. Interface Declaring Required Props
// ---------------------------------------------------------------------

export interface ProductCardProps {
  readonly id: string;
  readonly productName: string;
  readonly price: number;
  readonly currency: string;
}

// ---------------------------------------------------------------------
// 2. Component Consuming Required Props
// ---------------------------------------------------------------------

export const ProductCard: React.FC<ProductCardProps> = (props) => {
  const { id, productName, price, currency } = props;

  const formattedPrice = `${currency} ${price.toFixed(2)}`;

  return (
    <div className="product-card" id={`product-${id}`}>
      <h4>{productName}</h4>
      <p>Price: {formattedPrice}</p>
    </div>
  );
};

// ---------------------------------------------------------------------
// 3. Parent Component Fulfilling Required Props Contract
// ---------------------------------------------------------------------

export const ProductListContainer: React.FC = () => {
  return (
    <section className="product-list">
      <h2>Featured Products</h2>

      {/* All required props (id, productName, price, currency) explicitly supplied */}
      <ProductCard id="prod_9912" productName="Wireless Noise-Canceling Headphones" price={299.99} currency="USD" />

      <ProductCard id="prod_9913" productName="Mechanical Gaming Keyboard" price={149.5} currency="USD" />
    </section>
  );
};

export default ProductListContainer;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Mandatory Interface Contracts: Omitting the `?` modifier guarantees that TypeScript requires every declared property at compile-time.
// - Compiler-Enforced Safety: Omitting any required prop causes immediate build errors, preventing missing data bugs from reaching runtime.
// - Eliminated Defensive Code: Guaranteed required props allow component bodies to manipulate values directly without repetitive checks.
// - Architectural Transparency: Required props clearly express mandatory data requirements and core domain dependencies.
// - Deterministic Data Dependencies: Components remain fully predictable because every necessary dependency is guaranteed upon initialization.
