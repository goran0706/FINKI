/**
 * Stateless Components
 * ====================
 *
 * Stateless components, also called presentational or pure components, focus strictly on UI
 * presentation by consuming inputs via props and returning JSX. They execute pure function
 * transformations mapping incoming props directly to UI elements: f(props) = UI.
 *
 * Stateless components contain no internal state, execute no side effects, and delegate all data
 * mutations upward to parent containers via callback props. Calculating derived values on-the-fly
 * directly from props remains fully valid because it introduces no persistent local memory.
 */

import React, { Component } from "react";

// ---------------------------------------------------------------------
// Component Props Interface
// ---------------------------------------------------------------------

export interface StatelessProps {
  readonly title: string;
  readonly items: ReadonlyArray<string>;
  readonly filterTerm?: string;
  readonly onItemClick?: (item: string) => void;
}

// ---------------------------------------------------------------------
// 1. Stateless Class Component
// ---------------------------------------------------------------------

export class StatelessClassComponent extends Component<StatelessProps> {
  // =====================================================================
  // SECTION 1: DATA (Props Only - Zero State)
  // =====================================================================
  // No `this.state` declaration, no `constructor`, and no state initialization.

  // =====================================================================
  // SECTION 2: LOGIC (Pure Derived State & Event Delegation)
  // =====================================================================
  // =====================================================================
  public override render(): React.ReactNode {
    const { title, items, filterTerm = "", onItemClick } = this.props;

    // Derived State calculated on-the-fly during render execution:
    const filteredItems = items.filter((item) => item.toLowerCase().includes(filterTerm.toLowerCase()));
    const totalCount = items.length;
    const filteredCount = filteredItems.length;

    return (
      <div>
        <h2>{title}</h2>
        <p>
          Showing {filteredCount} of {totalCount} items
        </p>
        <ul>
          {filteredItems.map((item, index) => (
            <li key={index}>
              <span>{item}</span>
              {onItemClick && (
                <button type="button" onClick={this.handleSelect(item)}>
                  Select
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>
    );
  }

  // =====================================================================
  // SECTION 3: APPEARANCE (Pure JSX Render Output)

  // No lifecycle hooks (`componentDidMount`, `componentDidUpdate`).
  private handleSelect = (item: string) => () => {
    if (this.props.onItemClick) {
      this.props.onItemClick(item); // Lifting state up via parent callback
    }
  };
}

// ---------------------------------------------------------------------
// 2. Stateless Function Component
// ---------------------------------------------------------------------

export const StatelessFunctionComponent: React.FC<StatelessProps> = (props) => {
  // =====================================================================
  // SECTION 1: DATA (Props Only - Destructured on New Line)
  // =====================================================================
  // Stateless components hold NO local state (`useState`, `useReducer`).
  // Props are destructured here inside the function body rather than in the signature.
  const { title, items, filterTerm = "", onItemClick } = props;

  // =====================================================================
  // SECTION 2: LOGIC (Pure Derived State & Event Delegation)
  // =====================================================================
  // Derived State (Valid in Stateless Components):
  // Computing derived values on-the-fly directly from incoming props is completely pure.
  // It calculates temporary display values without adding persistent state or side effects.
  const filteredItems = items.filter((item) => item.toLowerCase().includes(filterTerm.toLowerCase()));
  const totalCount = items.length;
  const filteredCount = filteredItems.length;

  const handleSelect = (item: string) => () => {
    if (onItemClick) {
      onItemClick(item); // Lifting state up — delegating mutation to parent component
    }
  };

  // =====================================================================
  // SECTION 3: APPEARANCE (Pure JSX Output)
  // =====================================================================
  return (
    <div>
      <h2>{title}</h2>
      <p>
        Showing {filteredCount} of {totalCount} items
      </p>
      <ul>
        {filteredItems.map((item, index) => (
          <li key={index}>
            <span>{item}</span>
            {onItemClick && (
              <button type="button" onClick={handleSelect(item)}>
                Select
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StatelessClassComponent;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Stateless Class Component: Extends `React.Component`, reads `this.props` inside `render()`, but contains no `this.state` or lifecycle hooks.
// - Stateless Function Component: Pure functional mapping of props directly to JSX without hooks or local memory.
// - Derived State in Stateless Components: On-the-fly computations derived directly from props (`filteredItems`, counts) are 100% valid because they do not introduce statefulness or side-effects.
// - Presentational: Both components delegate data mutations upward to parent containers via callback invocation.
