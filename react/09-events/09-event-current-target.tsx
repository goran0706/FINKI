/**
 * Event Current Target
 * ====================
 *
 * The `currentTarget` property of a React event identifies the DOM element whose event handler
 * is currently executing. Unlike `target`, which identifies where the event originally occurred,
 * `currentTarget` follows the element on which the handler was registered.
 *
 * React's event type can use a generic element parameter to provide an accurate type for
 * `currentTarget`. For example, `MouseEvent<HTMLButtonElement>` makes `currentTarget` a
 * `HTMLButtonElement`, allowing TypeScript to expose button-specific DOM properties safely.
 *
 * `currentTarget` is especially useful when events originate from nested elements. A click on a
 * child element can produce a child `target` while the parent's handler still has the parent as
 * its `currentTarget`. This makes `currentTarget` the appropriate property when handler logic must
 * operate on the element that owns the handler.
 */

import React, { type MouseEvent } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface ButtonCurrentTargetProps {
  readonly label: string;
}

export interface NestedCurrentTargetProps {
  readonly label: string;
}

export interface CurrentTargetPropertyProps {
  readonly label: string;
}

export interface CurrentTargetComparisonProps {
  readonly label: string;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * The handler is attached to the button, so `currentTarget` identifies
 * that button when the click handler executes.
 */
export const ButtonCurrentTarget: React.FC<ButtonCurrentTargetProps> = ({ label }): React.ReactElement => {
  const handleClick = (event: MouseEvent<HTMLButtonElement>): void => {
    console.log("Current target:", event.currentTarget);
  };

  return (
    <button type="button" onClick={handleClick}>
      {label}
    </button>
  );
};

/**
 * Even when the click originates from the nested span, `currentTarget`
 * remains the button because the handler belongs to the button.
 */
export const NestedCurrentTarget: React.FC<NestedCurrentTargetProps> = ({ label }): React.ReactElement => {
  const handleClick = (event: MouseEvent<HTMLButtonElement>): void => {
    console.log("Target:", event.target);
    console.log("Current target:", event.currentTarget);
  };

  return (
    <button type="button" onClick={handleClick}>
      <span>{label}</span>
    </button>
  );
};

/**
 * The generic parameter on `MouseEvent` makes `currentTarget` a
 * `HTMLButtonElement`, so button-specific properties are available.
 */
export const CurrentTargetProperty: React.FC<CurrentTargetPropertyProps> = ({ label }): React.ReactElement => {
  const handleClick = (event: MouseEvent<HTMLButtonElement>): void => {
    event.currentTarget.disabled = true;
    console.log("Button text:", event.currentTarget.textContent);
  };

  return (
    <button type="button" onClick={handleClick}>
      {label}
    </button>
  );
};

/**
 * `target` and `currentTarget` can be different when an event originates
 * from a descendant of the element that owns the handler.
 */
export const CurrentTargetComparison: React.FC<CurrentTargetComparisonProps> = ({ label }): React.ReactElement => {
  const handleClick = (event: MouseEvent<HTMLButtonElement>): void => {
    const sameElement: boolean = event.target === event.currentTarget;

    console.log("Target:", event.target);
    console.log("Current target:", event.currentTarget);
    console.log("Same element:", sameElement);
  };

  return (
    <button type="button" onClick={handleClick}>
      <span>{label}</span>
    </button>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

export const EventCurrentTargetDemo: React.FC = (): React.ReactElement => {
  return (
    <div>
      <h2>1. Current Target on the Handling Element</h2>
      <ButtonCurrentTarget label="Inspect Current Target" />

      <h2>2. Current Target With a Nested Element</h2>
      <NestedCurrentTarget label="Click Nested Text" />

      <h2>3. Accessing Current Target Properties</h2>
      <CurrentTargetProperty label="Disable Button" />

      <h2>4. Comparing Target and Current Target</h2>
      <CurrentTargetComparison label="Compare Elements" />
    </div>
  );
};

export default EventCurrentTargetDemo;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - `event.currentTarget` identifies the element whose handler is executing.
// - `event.target` identifies the element where the event originally occurred.
// - A nested event target does not change the handler's `currentTarget`.
// - The event type's generic parameter provides an accurate type for `currentTarget`.
// - `MouseEvent<HTMLButtonElement>` gives `currentTarget` the type `HTMLButtonElement`.
// - `currentTarget` is useful when handler logic should operate on the element
//   that owns the event handler.
