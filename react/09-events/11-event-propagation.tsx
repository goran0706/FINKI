/**
 * Event Propagation
 * =================
 *
 * Event propagation is the process by which a DOM event travels through the hierarchy of elements
 * involved in the event. After an event is dispatched to its originating element, it can propagate
 * through ancestor elements according to the event's propagation phases.
 *
 * React's event system follows the DOM event propagation model. A single user interaction can
 * therefore cause handlers on multiple nested elements to execute when those handlers participate
 * in the same propagation path. By default, React event handlers registered with `onClick` execute
 * during the bubbling phase after the event reaches its target.
 *
 * Propagation is independent of whether an event handler exists on every element in the hierarchy.
 * The browser constructs the event path from the relevant DOM hierarchy, and React invokes matching
 * handlers encountered along that path. Calling `stopPropagation()` can prevent the event from
 * continuing to other elements in the propagation path.
 */

import React, { type MouseEvent } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface ParentChildPropagationProps {
  readonly label: string;
}

export interface MultiLevelPropagationProps {
  readonly label: string;
}

export interface PropagationPathProps {
  readonly label: string;
}

export interface PropagationMisconceptionProps {
  readonly label: string;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * A click on the nested button propagates to the parent because both elements
 * participate in the same DOM event path and the event is allowed to bubble.
 */
export const ParentChildPropagation: React.FC<ParentChildPropagationProps> = ({ label }): React.ReactElement => {
  const handleParentClick = (): void => {
    console.log("Parent handler executed.");
  };

  const handleChildClick = (): void => {
    console.log("Child handler executed.");
  };

  return (
    <div onClick={handleParentClick}>
      <button type="button" onClick={handleChildClick}>
        {label}
      </button>
    </div>
  );
};

/**
 * Propagation can continue through multiple ancestors. A click on the innermost
 * button can therefore execute handlers on each ancestor during bubbling.
 */
export const MultiLevelPropagation: React.FC<MultiLevelPropagationProps> = ({ label }): React.ReactElement => {
  const handleOuterClick = (): void => {
    console.log("Outer handler executed.");
  };

  const handleMiddleClick = (): void => {
    console.log("Middle handler executed.");
  };

  const handleInnerClick = (): void => {
    console.log("Inner handler executed.");
  };

  return (
    <div onClick={handleOuterClick}>
      <div onClick={handleMiddleClick}>
        <button type="button" onClick={handleInnerClick}>
          {label}
        </button>
      </div>
    </div>
  );
};

/**
 * Event propagation follows the DOM hierarchy rather than the visual appearance
 * of the interface. `target` remains the originating element while `currentTarget`
 * changes for each handler that executes during propagation.
 */
export const PropagationPath: React.FC<PropagationPathProps> = ({ label }): React.ReactElement => {
  const handleOuterClick = (event: MouseEvent<HTMLDivElement>): void => {
    console.log("Outer current target:", event.currentTarget);
    console.log("Original target:", event.target);
  };

  const handleMiddleClick = (event: MouseEvent<HTMLDivElement>): void => {
    console.log("Middle current target:", event.currentTarget);
    console.log("Original target:", event.target);
  };

  const handleInnerClick = (event: MouseEvent<HTMLButtonElement>): void => {
    console.log("Inner current target:", event.currentTarget);
    console.log("Original target:", event.target);
  };

  return (
    <div onClick={handleOuterClick}>
      <div onClick={handleMiddleClick}>
        <button type="button" onClick={handleInnerClick}>
          {label}
        </button>
      </div>
    </div>
  );
};

/**
 * Propagation does not mean that every handler in the document executes. Only
 * elements participating in the event's propagation path can receive the event,
 * and only registered handlers for that event type are invoked.
 */
export const PropagationMisconception: React.FC<PropagationMisconceptionProps> = ({ label }): React.ReactElement => {
  const handleParentClick = (): void => {
    console.log("Parent handler executed.");
  };

  const handleUnrelatedClick = (): void => {
    console.log("Unrelated handler executed.");
  };

  return (
    <div>
      <div onClick={handleParentClick}>
        <button type="button">{label}</button>
      </div>

      <button type="button" onClick={handleUnrelatedClick}>
        Unrelated Button
      </button>
    </div>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

export const EventPropagationDemo: React.FC = (): React.ReactElement => {
  return (
    <div>
      <h2>1. Propagation From Child to Parent</h2>
      <ParentChildPropagation label="Click Child" />

      <h2>2. Propagation Through Multiple Ancestors</h2>
      <MultiLevelPropagation label="Click Inner Element" />

      <h2>3. The Event Propagation Path</h2>
      <PropagationPath label="Inspect Propagation" />

      <h2>4. Propagation Only Along the Event Path</h2>
      <PropagationMisconception label="Click Nested Button" />
    </div>
  );
};

export default EventPropagationDemo;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Event propagation describes how a DOM event travels through related elements.
// - React follows the DOM propagation model for its event handlers.
// - A child event can reach ancestor handlers during the bubbling phase.
// - Multiple ancestors can receive the same event as it propagates.
// - `event.target` identifies the original event source.
// - `event.currentTarget` identifies the element whose handler is currently executing.
// - Propagation follows the event's DOM path rather than every element in the document.
// - `stopPropagation()` can prevent an event from continuing to other elements
//   in its propagation path.
