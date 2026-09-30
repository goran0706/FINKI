/**
 * Nested Components
 * =================
 *
 * React components are composed hierarchically by nesting subcomponents within parent components.
 * Proper nesting isolates responsibilities, controls re-render boundaries, and establishes clear
 * data contracts between tree levels.
 *
 * Complex interfaces are assembled using smaller, single-purpose subcomponents. Nested components
 * must always be declared at module scope rather than inline inside render bodies to prevent identity
 * destruction, maintaining unidirectional data propagation downward and inverse data flow upward.
 */

import React from "react";

// ---------------------------------------------------------------------
// Sub-Component (Nested Child) Interface & Implementation
// ---------------------------------------------------------------------

export interface ListItemProps {
  readonly id: string;
  readonly label: string;
  readonly isSelected: boolean;
  readonly onSelect: (id: string) => void;
}

// Declared at module scope to guarantee stable reference across renders
export const ListItem: React.FC<ListItemProps> = (props) => {
  const { id, label, isSelected, onSelect } = props;

  const handleClick = (): void => {
    onSelect(id);
  };

  return (
    <li>
      <span>{label}</span>
      <button type="button" onClick={handleClick} disabled={isSelected}>
        {isSelected ? "Active" : "Select"}
      </button>
    </li>
  );
};

// ---------------------------------------------------------------------
// Parent Component Interface & Implementation
// ---------------------------------------------------------------------

export interface ItemData {
  readonly id: string;
  readonly label: string;
}

export interface NestedListProps {
  readonly title: string;
  readonly items: ReadonlyArray<ItemData>;
  readonly selectedId?: string;
  readonly onItemSelect: (id: string) => void;
}

export const NestedList: React.FC<NestedListProps> = (props) => {
  const { title, items, selectedId, onItemSelect } = props;

  return (
    <div>
      <h2>{title}</h2>
      <ul>
        {items.map((item) => (
          <ListItem
            key={item.id}
            id={item.id}
            label={item.label}
            isSelected={item.id === selectedId}
            onSelect={onItemSelect}
          />
        ))}
      </ul>
    </div>
  );
};

export default NestedList;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Module Scope Declaration: Sub-components (`ListItem`) are defined outside parent render bodies to preserve DOM nodes and avoid identity loss.
// - Component Composition: Complex interfaces are effectively broken down into manageable, single-purpose building blocks.
// - Downward Props Flow: Parent components propagate read-only data and configuration downward to nested children.
// - Upward Callback Flow: Nested subcomponents delegate mutations upward by triggering parent-provided event handlers.
// - Render Stability: Declaring components outside the render scope prevents component type re-creation and state loss.
