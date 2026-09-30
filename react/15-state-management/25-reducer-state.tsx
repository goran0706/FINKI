/**
 * Reducer State
 * =============
 *
 * Reducer state represents the structured state object managed by a reducer function.
 * Designing reducer state requires keeping data normalized, minimal, and predictable.
 * Avoiding duplicated or derived values inside the reducer state prevents synchronization
 * bugs and keeps state transition logic clean.
 *
 * Flat state structures simplify state updates in reducer functions, preventing deep
 * nested object copies and ensuring immutable state transitions remain performant.
 */

import React, { useReducer } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface FilterableItem {
  readonly id: string;
  readonly title: string;
  readonly category: string;
}

export interface InventoryState {
  readonly items: readonly FilterableItem[];
  readonly selectedCategory: string;
  readonly searchQuery: string;
}

export type InventoryAction =
  | { readonly type: "SET_CATEGORY"; readonly category: string }
  | { readonly type: "SET_SEARCH_QUERY"; readonly query: string }
  | { readonly type: "RESET_FILTERS" };

export interface InventoryViewerProps {
  readonly items: readonly FilterableItem[];
  readonly selectedCategory: string;
  readonly searchQuery: string;
  readonly onCategoryChange: (category: string) => void;
  readonly onSearchChange: (query: string) => void;
  readonly onReset: () => void;
}

// ---------------------------------------------------------------------
// 2. Pure Reducer & Initial State
// ---------------------------------------------------------------------

export const initialInventoryState: InventoryState = {
  items: [
    { id: "1", title: "TypeScript Handbook", category: "Books" },
    { id: "2", title: "Wireless Headphones", category: "Electronics" },
    { id: "3", title: "React State Design Patterns", category: "Books" },
    { id: "4", title: "Mechanical Keyboard", category: "Electronics" },
  ],
  selectedCategory: "All",
  searchQuery: "",
};

export const inventoryReducer = (state: InventoryState, action: InventoryAction): InventoryState => {
  switch (action.type) {
    case "SET_CATEGORY":
      return { ...state, selectedCategory: action.category };
    case "SET_SEARCH_QUERY":
      return { ...state, searchQuery: action.query };
    case "RESET_FILTERS":
      return { ...state, selectedCategory: "All", searchQuery: "" };
    default:
      return state;
  }
};

// ---------------------------------------------------------------------
// 3. Component Implementations
// ---------------------------------------------------------------------

export const InventoryViewer: React.FC<InventoryViewerProps> = ({
  items,
  selectedCategory,
  searchQuery,
  onCategoryChange,
  onSearchChange,
  onReset,
}) => {
  // Derived filtered items calculated dynamically during render
  const filteredItems = items.filter((item) => {
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div>
      <h4>Inventory Explorer</h4>
      <div>
        <input
          type="text"
          placeholder="Search titles..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        <select value={selectedCategory} onChange={(e) => onCategoryChange(e.target.value)}>
          <option value="All">All Categories</option>
          <option value="Books">Books</option>
          <option value="Electronics">Electronics</option>
        </select>
        <button type="button" onClick={onReset}>
          Reset Filters
        </button>
      </div>
      <ul>
        {filteredItems.map((item) => (
          <li key={item.id}>
            {item.title} ({item.category})
          </li>
        ))}
      </ul>
    </div>
  );
};

// ---------------------------------------------------------------------
// 4. Main Container Component
// ---------------------------------------------------------------------

export const ReducerStateContainer: React.FC = () => {
  const [state, dispatch] = useReducer(inventoryReducer, initialInventoryState);

  return (
    <div>
      <h1>25 - Reducer State</h1>

      <h2>1. Flat Reducer State Structure with Derived Rendering</h2>
      <InventoryViewer
        items={state.items}
        selectedCategory={state.selectedCategory}
        searchQuery={state.searchQuery}
        onCategoryChange={(category) => dispatch({ type: "SET_CATEGORY", category })}
        onSearchChange={(query) => dispatch({ type: "SET_SEARCH_QUERY", query })}
        onReset={() => dispatch({ type: "RESET_FILTERS" })}
      />
    </div>
  );
};

export default ReducerStateContainer;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Reducer state structures should remain flat to minimize shallow copy complexity.
// - Storing primitive keys and filter criteria avoids duplicating derived state data.
// - Computing derived filter outputs during render prevents stale state synchronization bugs.
// - Clear action types model explicit user intent rather than raw state setting operations.
// - Flat reducer state objects optimize rendering performance and state predictability.
