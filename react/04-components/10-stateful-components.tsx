/**
 * Stateful Components
 * ===================
 *
 * Stateful components manage internal, persistent memory using `useState` or `this.state`.
 * They own their data lifecycle, handle local user interactions, and trigger virtual DOM
 * re-renders whenever their internal state updates.
 *
 * Stateful components encapsulate private memory across render cycles, controlling mutations via
 * designated setters to trigger reactive UI updates. They preserve unidirectional data flow by passing
 * local state downward to child components as read-only props, re-evaluating data, logic, and
 * appearance on every state change.
 */

import React, { Component, useState } from "react";

// ---------------------------------------------------------------------
// Component Props & State Interfaces
// ---------------------------------------------------------------------

export interface StatefulClassProps {
  readonly initialTitle?: string;
  readonly initialItems?: ReadonlyArray<string>;
}

export interface StatefulClassState {
  readonly items: ReadonlyArray<string>;
  readonly inputText: string;
}

export interface StatefulFunctionProps {
  readonly initialTitle?: string;
  readonly initialItems?: ReadonlyArray<string>;
}

// ---------------------------------------------------------------------
// 1. Stateful Class Component
// ---------------------------------------------------------------------

export class StatefulClassComponent extends Component<StatefulClassProps, StatefulClassState> {
  // =====================================================================
  // SECTION 1: DATA (Props & Instance State)
  // =====================================================================
  public override state: StatefulClassState = {
    items: this.props.initialItems ?? ["Class Item 1", "Class Item 2"],
    inputText: "",
  };

  // =====================================================================
  // SECTION 2: LOGIC (State Mutators & Event Handlers)

  // =====================================================================
  public override render(): React.ReactNode {
    const { initialTitle = "Stateful Class Component" } = this.props;
    const { items, inputText } = this.state;

    // Derived State
    const totalItems = items.length;
    const isInputEmpty = inputText.trim().length === 0;

    return (
      <div>
        <h2>{initialTitle}</h2>
        <p>Total Items: {totalItems}</p>

        <div>
          <input type="text" value={inputText} onChange={this.handleInputChange} placeholder="Add new item..." />
          <button type="button" onClick={this.handleAddItem} disabled={isInputEmpty}>
            Add Item
          </button>
        </div>

        <ul>
          {items.map((item, index) => (
            <li key={index}>
              <span>{item}</span>
              <button type="button" onClick={this.handleRemoveItem(index)}>
                Remove
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  // =====================================================================
  private handleInputChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    this.setState({ inputText: event.target.value });
  };

  private handleAddItem = (): void => {
    if (this.state.inputText.trim().length === 0) return;

    this.setState((prevState) => ({
      items: [...prevState.items, prevState.inputText.trim()],
      inputText: "",
    }));
  };

  // =====================================================================
  // SECTION 3: APPEARANCE (Declarative JSX Render Output)

  private handleRemoveItem = (indexToRemove: number) => (): void => {
    this.setState((prevState) => ({
      items: prevState.items.filter((_, index) => index !== indexToRemove),
    }));
  };
}

// ---------------------------------------------------------------------
// 2. Stateful Function Component
// ---------------------------------------------------------------------

export const StatefulFunctionComponent: React.FC<StatefulFunctionProps> = (props) => {
  // =====================================================================
  // SECTION 1: DATA (Props & Internal Memory)
  // =====================================================================
  const { initialTitle = "Stateful Function Component", initialItems = ["Item 1", "Item 2"] } = props;

  // Local Encapsulated State
  const [items, setItems] = useState<ReadonlyArray<string>>(initialItems);
  const [inputText, setInputText] = useState<string>("");

  // =====================================================================
  // SECTION 2: LOGIC (Derived State & State Mutators)
  // =====================================================================
  // Derived State computed on-the-fly from state
  const totalItems = items.length;
  const isInputEmpty = inputText.trim().length === 0;

  // State Mutation Handlers
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setInputText(event.target.value);
  };

  const handleAddItem = (): void => {
    if (isInputEmpty) return;
    setItems((prev) => [...prev, inputText.trim()]);
    setInputText("");
  };

  const handleRemoveItem = (indexToRemove: number) => (): void => {
    setItems((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  // =====================================================================
  // SECTION 3: APPEARANCE (Declarative JSX Render Output)
  // =====================================================================
  return (
    <div>
      <h2>{initialTitle}</h2>
      <p>Total Items: {totalItems}</p>

      <div>
        <input type="text" value={inputText} onChange={handleInputChange} placeholder="Add new item..." />
        <button type="button" onClick={handleAddItem} disabled={isInputEmpty}>
          Add Item
        </button>
      </div>

      <ul>
        {items.map((item, index) => (
          <li key={index}>
            <span>{item}</span>
            <button type="button" onClick={handleRemoveItem(index)}>
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StatefulClassComponent;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Stateful Class Component: Uses `StatefulClassProps` & `StatefulClassState` within `Component<P, S>`, mutating state via `this.setState`.
// - Stateful Function Component: Uses `StatefulFunctionProps` and manages state via `useState` hook.
// - Encapsulated State: State remains private to the component unless explicitly passed down to child components via props.
// - Controlled Updates: State is never mutated directly; mutations go through setters (`this.setState` / `setItems`) to trigger re-renders.
