/**
 * List Rendering
 * ==============
 *
 * List rendering in React transforms data collections into virtual DOM elements using JavaScript
 * iteration methods. Direct array mapping projects raw items into uniform default component outputs,
 * embedding item presentation directly inside static collection components.
 *
 * The render props pattern decouples iteration mechanisms from UI presentation by delegating layout decisions
 * to a caller-provided render function. Splitting static mapping components from dynamic render prop list
 * containers enforces architectural separation and eliminates complex inline branching logic.
 */

import React from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface Item {
  readonly id: string;
  readonly title: string;
}

export interface ListItemProps {
  readonly item: Item;
}

export interface StaticListProps {
  readonly items: ReadonlyArray<Item>;
}

export interface DynamicListProps {
  readonly items: ReadonlyArray<Item>;
  readonly renderItem: (item: Item) => React.ReactNode;
}

// ---------------------------------------------------------------------
// 2. Presentational Child Components
// ---------------------------------------------------------------------

export const ListItem: React.FC<ListItemProps> = (props) => {
  const { item } = props;

  return <div>{item.title}</div>;
};

// ---------------------------------------------------------------------
// 3. Static and Dynamic List Components
// ---------------------------------------------------------------------

export const StaticList: React.FC<StaticListProps> = (props) => {
  const { items } = props;

  return (
    <div>
      {items.map((item: Item) => (
        <ListItem key={item.id} item={item} />
      ))}
    </div>
  );
};

export const DynamicList: React.FC<DynamicListProps> = (props) => {
  const { items, renderItem } = props;

  return (
    <div>
      {items.map((item: Item) => (
        <React.Fragment key={item.id}>{renderItem(item)}</React.Fragment>
      ))}
    </div>
  );
};

// ---------------------------------------------------------------------
// 4. Main Container Component
// ---------------------------------------------------------------------

export const ListRenderingContainer: React.FC = () => {
  const items: ReadonlyArray<Item> = [
    { id: "1", title: "First Item" },
    { id: "2", title: "Second Item" },
  ];

  return (
    <div>
      <h1>List Rendering</h1>

      <h2>Static List Rendering</h2>
      <StaticList items={items} />

      <h2>Dynamic List Rendering (Render Props)</h2>
      <DynamicList items={items} renderItem={(item: Item) => <p>Custom Item: {item.title}</p>} />
    </div>
  );
};

export default ListRenderingContainer;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Static List Mapping: Projects raw items directly into standard `ListItem` child elements without runtime layout callbacks.
// - Dynamic Render Props: Passes an explicit `renderItem` function to delegate item markup completely to the consuming context.
// - Explicit Component Separation: Avoids conditional ternary checks inside iteration blocks by providing distinct list components.
// - Key Propagation: Ensures reconciliation keys attach directly to top-level mapped nodes or `React.Fragment` elements.
// - Dedicated Destructuring Standard: Enforces single-property dedicated line breaks during prop destructuring inside component bodies.
