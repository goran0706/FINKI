/**
 * Event Bubbling Phase
 * ====================
 *
 * The bubbling phase is the final propagation phase of a DOM event. After an event reaches its
 * original target, the event can travel back through its ancestor elements, from the target toward
 * the outermost relevant ancestor. React's ordinary event handlers, such as `onClick`, participate
 * in this bubbling phase.
 *
 * A bubbling event keeps the same `target` throughout propagation, because `target` identifies where
 * the event originally occurred. `currentTarget` changes for each ancestor handler and identifies
 * the element whose handler is currently executing.
 *
 * Bubbling allows a parent component to respond to interactions originating from descendants without
 * registering a handler on every descendant. Calling `stopPropagation()` prevents the event from
 * continuing to other elements in the propagation path.
 */

import React, { type MouseEvent } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface BasicBubblingPhaseProps {
  readonly label: string;
}

export interface NestedBubblingPhaseProps {
  readonly label: string;
}

export interface BubblingOrderProps {
  readonly label: string;
}

export interface BubblingTargetsProps {
  readonly label: string;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * A click on the button bubbles to its parent, allowing the parent's ordinary
 * `onClick` handler to execute after the button handler.
 */
export const BasicBubblingPhase: React.FC<BasicBubblingPhaseProps> = ({ label }): React.ReactElement => {
  const handleParentClick = (): void => {
    console.log("Parent bubbling handler executed.");
  };

  const handleButtonClick = (): void => {
    console.log("Button handler executed.");
  };

  return (
    <div onClick={handleParentClick}>
      <button type="button" onClick={handleButtonClick}>
        {label}
      </button>
    </div>
  );
};

/**
 * Bubbling can continue through multiple ancestors. Each ancestor handler
 * executes as the event travels outward from the original target.
 */
export const NestedBubblingPhase: React.FC<NestedBubblingPhaseProps> = ({ label }): React.ReactElement => {
  const handleOuterClick = (): void => {
    console.log("Outer handler executed.");
  };

  const handleMiddleClick = (): void => {
    console.log("Middle handler executed.");
  };

  const handleButtonClick = (): void => {
    console.log("Button handler executed.");
  };

  return (
    <div onClick={handleOuterClick}>
      <div onClick={handleMiddleClick}>
        <button type="button" onClick={handleButtonClick}>
          {label}
        </button>
      </div>
    </div>
  );
};

/**
 * Bubbling occurs after the target has been reached. This example makes the
 * relative order explicit: target handler first, then nearer ancestors,
 * followed by progressively more distant ancestors.
 */
export const BubblingOrder: React.FC<BubblingOrderProps> = ({ label }): React.ReactElement => {
  const handleOuterClick = (): void => {
    console.log("3. Outer bubble");
  };

  const handleMiddleClick = (): void => {
    console.log("2. Middle bubble");
  };

  const handleButtonClick = (): void => {
    console.log("1. Target handler");
  };

  return (
    <div onClick={handleOuterClick}>
      <div onClick={handleMiddleClick}>
        <button type="button" onClick={handleButtonClick}>
          {label}
        </button>
      </div>
    </div>
  );
};

/**
 * `target` remains the original event source while `currentTarget` identifies
 * the ancestor whose bubbling handler is currently executing.
 */
export const BubblingTargets: React.FC<BubblingTargetsProps> = ({ label }): React.ReactElement => {
  const handleParentClick = (event: MouseEvent<HTMLDivElement>): void => {
    console.log("Target:", event.target);
    console.log("Current target:", event.currentTarget);
    console.log("Same element:", event.target === event.currentTarget);
  };

  return (
    <div onClick={handleParentClick}>
      <button type="button">{label}</button>
    </div>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

export const EventBubblingPhaseDemo: React.FC = (): React.ReactElement => {
  return (
    <div>
      <h2>1. Bubbling From Target to Parent</h2>
      <BasicBubblingPhase label="Click Button" />

      <h2>2. Bubbling Through Multiple Ancestors</h2>
      <NestedBubblingPhase label="Click Nested Button" />

      <h2>3. Bubbling Execution Order</h2>
      <BubblingOrder label="Inspect Bubble Order" />

      <h2>4. Target Versus Current Target During Bubbling</h2>
      <BubblingTargets label="Inspect Event Targets" />
    </div>
  );
};

export default EventBubblingPhaseDemo;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Bubbling is the propagation phase in which an event travels from its target
//   toward its ancestor elements.
// - React's ordinary handlers such as `onClick` execute during bubbling.
// - The target handler executes before ancestor bubbling handlers.
// - Multiple ancestors can handle the same bubbling event.
// - `event.target` remains the original event source during bubbling.
// - `event.currentTarget` identifies the element whose handler is executing.
// - `stopPropagation()` can prevent an event from continuing to other elements
//   in the propagation path.
