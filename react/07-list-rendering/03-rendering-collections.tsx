/**
 * Rendering Collections
 * =====================
 *
 * Non-array collection structures like `Map`, `Set`, and plain JavaScript objects (`Record<string, T>`)
 * cannot be mapped directly in JSX. React requires iterable sequences to project items into virtual DOM nodes.
 *
 * Transforming non-array collections using methods like `Array.from()` or `Object.entries()` converts
 * stored key-value pairs or unique set entries into renderable array structures while preserving access
 * to primary lookup keys for React reconciliation.
 */

import React from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface Product {
  readonly id: string;
  readonly name: string;
  readonly price: number;
}

export interface MapCollectionProps {
  readonly productMap: Map<string, Product>;
}

export interface SetCollectionProps {
  readonly categorySet: Set<string>;
}

export interface RecordCollectionProps {
  readonly productRecord: Record<string, Product>;
}

// ---------------------------------------------------------------------
// 2. Collection Component Implementations
// ---------------------------------------------------------------------

export const MapCollectionList: React.FC<MapCollectionProps> = (props) => {
  const { productMap } = props;

  const mapEntries = Array.from(productMap.entries());

  return (
    <div>
      {mapEntries.map(([key, product]: [string, Product]) => (
        <p key={key}>
          [{key}] {product.name} - ${product.price}
        </p>
      ))}
    </div>
  );
};

export const SetCollectionList: React.FC<SetCollectionProps> = (props) => {
  const { categorySet } = props;

  const categories = Array.from(categorySet);

  return (
    <div>
      {categories.map((category: string) => (
        <p key={category}>Category: {category}</p>
      ))}
    </div>
  );
};

export const RecordCollectionList: React.FC<RecordCollectionProps> = (props) => {
  const { productRecord } = props;

  const recordEntries = Object.entries(productRecord);

  return (
    <div>
      {recordEntries.map(([id, product]: [string, Product]) => (
        <p key={id}>
          Record ID {id}: {product.name} - ${product.price}
        </p>
      ))}
    </div>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

export const RenderingCollectionsContainer: React.FC = () => {
  const productMap = new Map<string, Product>([
    ["p1", { id: "p1", name: "Keyboard", price: 100 }],
    ["p2", { id: "p2", name: "Mouse", price: 50 }],
  ]);

  const categorySet = new Set<string>(["Hardware", "Peripherals", "Accessories"]);

  const productRecord: Record<string, Product> = {
    rec1: { id: "p3", name: "Monitor", price: 300 },
    rec2: { id: "p4", name: "Headphones", price: 150 },
  };

  return (
    <div>
      <h1>Rendering Collections</h1>

      <h2>1. Map Collection Rendering (Array.from)</h2>
      <MapCollectionList productMap={productMap} />

      <h2>2. Set Collection Rendering (Array.from)</h2>
      <SetCollectionList categorySet={categorySet} />

      <h2>3. Record Object Collection Rendering (Object.entries)</h2>
      <RecordCollectionList productRecord={productRecord} />
    </div>
  );
};

export default RenderingCollectionsContainer;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Map Projection: Uses `Array.from(map.entries())` to convert key-value pairs into array tuples for JSX mapping.
// - Set Projection: Converts unique `Set` values into an array using `Array.from(set)` before element projection.
// - Object Record Projection: Uses `Object.entries(record)` to extract key-value arrays from plain dictionary objects.
// - Key Assignment: Leverages map keys, set values, or record keys as stable reconciliation `key` props.
// - Clean Architecture Compliance: Enforces dedicated single-line prop destructuring and eliminates UI noise.
