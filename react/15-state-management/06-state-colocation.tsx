/**
 * State Colocation
 * ================
 *
 * State colocation is the practice of keeping state as close as possible to where it is rendered and used.
 * Keeping state localized inside the child components that consume it avoids polluting parent component
 * logic and prevents unnecessary re-renders of unrelated UI subtrees.
 *
 * When state is lifted higher than necessary, changes to that state force the entire parent tree to re-render.
 * Colocating state ensures that state updates only trigger re-renders in the specific components that rely
 * on that data.
 */

import React, { useState } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface ProductItem {
  readonly id: number;
  readonly name: string;
  readonly price: number;
}

export interface ProductCardProps {
  readonly product: ProductItem;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

export const ColocatedTooltipCard: React.FC<ProductCardProps> = ({ product }) => {
  // Colocated state: Tooltip visibility is managed locally where it is rendered
  const [isHovered, setIsHovered] = useState<boolean>(false);

  return (
    <div onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      <h3>{product.name}</h3>
      <p>Price: ${product.price}</p>

      {isHovered && <div>Product ID: {product.id} - In Stock</div>}
    </div>
  );
};

export const ColocatedExpandableItem: React.FC<{
  readonly title: string;
  readonly details: string;
}> = ({ title, details }) => {
  // Colocated state: Expansion state affects only this component instance
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  return (
    <div>
      <div>
        <span>{title}</span>
        <button type="button" onClick={() => setIsExpanded((prev) => !prev)}>
          {isExpanded ? "Hide Details" : "Show Details"}
        </button>
      </div>
      {isExpanded && <p>{details}</p>}
    </div>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

export const StateColocationContainer: React.FC = () => {
  const products: readonly ProductItem[] = [
    { id: 101, name: "Mechanical Keyboard", price: 120 },
    { id: 102, name: "Wireless Mouse", price: 60 },
  ];

  return (
    <div>
      <h1>06 - State Colocation</h1>

      <h2>1. Colocated Hover State inside Product Cards</h2>
      {products.map((product) => (
        <ColocatedTooltipCard key={product.id} product={product} />
      ))}

      <h2>2. Colocated Expansion State inside Individual Items</h2>
      <ColocatedExpandableItem title="Shipping Policy" details="Standard shipping takes 3-5 business days." />
      <ColocatedExpandableItem title="Return Policy" details="Items can be returned within 30 days of purchase." />
    </div>
  );
};

export default StateColocationContainer;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - State colocation places state at the closest possible node to where it is used.
// - Localizing state keeps parent components clean and free from unnecessary UI toggle state.
// - Colocating state prevents global re-renders when local UI interactions occur in a child.
// - Prematurely lifting state up introduces unneeded props and degrades performance.
// - Moving state down to consumer components improves modularity and codebase maintainability.
