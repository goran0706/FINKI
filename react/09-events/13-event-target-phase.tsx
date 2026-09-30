/**
 * Event Target Phase
 * ==================
 *
 * The target phase is the point in DOM event propagation where the event has reached the element
 * that originally received it. The event's `target` identifies this element, while
 * `currentTarget` identifies the element whose handler is currently executing.
 *
 * The target phase is distinct from the ancestor capture and bubbling phases. Both capture-style
 * and bubbling-style listeners can execute on the target itself. In React, this can be observed
 * by placing `onClickCapture` and `onClick` on the same element: the capture handler executes
 * before the ordinary handler when the event reaches that element.
 *
 * The target phase does not mean that `target` and `currentTarget` are always the same for every
 * handler involved in an event. They are the same when the handler is executing on the actual
 * target element, but ancestor handlers executed during propagation have a different
 * `currentTarget` while retaining the same `target`.
 */

import React, { type MouseEvent } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface TargetCaptureAndBubbleProps {
  readonly label: string;
}

export interface TargetPhaseOrderProps {
  readonly label: string;
}

export interface TargetElementIdentityProps {
  readonly label: string;
}

export interface TargetPhasePropagationProps {
  readonly label: string;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * Both capture and bubbling handlers can be registered directly on the target
 * element. The capture handler runs before the ordinary click handler.
 */
export const TargetCaptureAndBubble: React.FC<TargetCaptureAndBubbleProps> = ({ label }): React.ReactElement => {
  const handleCapture = (): void => {
    console.log("Target capture handler executed.");
  };

  const handleClick = (): void => {
    console.log("Target bubble handler executed.");
  };

  return (
    <button type="button" onClickCapture={handleCapture} onClick={handleClick}>
      {label}
    </button>
  );
};

/**
 * The event reaches the target after ancestor capture handlers have executed.
 * The target's capture handler then runs before its ordinary target handler.
 */
export const TargetPhaseOrder: React.FC<TargetPhaseOrderProps> = ({ label }): React.ReactElement => {
  const handleParentCapture = (): void => {
    console.log("1. Parent capture");
  };

  const handleTargetCapture = (): void => {
    console.log("2. Target capture");
  };

  const handleTargetClick = (): void => {
    console.log("3. Target handler");
  };

  const handleParentClick = (): void => {
    console.log("4. Parent bubble");
  };

  return (
    <div onClickCapture={handleParentCapture} onClick={handleParentClick}>
      <button type="button" onClickCapture={handleTargetCapture} onClick={handleTargetClick}>
        {label}
      </button>
    </div>
  );
};

/**
 * When the handler executes on the actual target element, `target` and
 * `currentTarget` identify the same DOM element.
 */
export const TargetElementIdentity: React.FC<TargetElementIdentityProps> = ({ label }): React.ReactElement => {
  const handleClick = (event: MouseEvent<HTMLButtonElement>): void => {
    const sameElement: boolean = event.target === event.currentTarget;

    console.log("Target:", event.target);
    console.log("Current target:", event.currentTarget);
    console.log("Same element:", sameElement);
  };

  return (
    <button type="button" onClick={handleClick}>
      {label}
    </button>
  );
};

/**
 * The target phase does not terminate propagation. After handlers on the target
 * execute, the event can continue into the bubbling phase on its ancestors.
 */
export const TargetPhasePropagation: React.FC<TargetPhasePropagationProps> = ({ label }): React.ReactElement => {
  const handleParentCapture = (): void => {
    console.log("Parent capture");
  };

  const handleTargetClick = (): void => {
    console.log("Target handler");
  };

  const handleParentBubble = (): void => {
    console.log("Parent bubble");
  };

  return (
    <div onClickCapture={handleParentCapture} onClick={handleParentBubble}>
      <button type="button" onClick={handleTargetClick}>
        {label}
      </button>
    </div>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

export const EventTargetPhaseDemo: React.FC = (): React.ReactElement => {
  return (
    <div>
      <h2>1. Capture and Bubble Handlers on the Target</h2>
      <TargetCaptureAndBubble label="Click Target" />

      <h2>2. Target Phase in the Propagation Order</h2>
      <TargetPhaseOrder label="Inspect Event Order" />

      <h2>3. Target and Current Target on the Target Element</h2>
      <TargetElementIdentity label="Compare Event Elements" />

      <h2>4. Propagation Continues After the Target Phase</h2>
      <TargetPhasePropagation label="Click Target" />
    </div>
  );
};

export default EventTargetPhaseDemo;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - The target phase begins when an event reaches its original target element.
// - A target can have both capture and ordinary event handlers.
// - On the target, the capture handler executes before the ordinary handler.
// - `event.target` identifies the original event target throughout propagation.
// - On a handler executing directly on the target, `target` and `currentTarget`
//   identify the same DOM element.
// - The target phase does not prevent the event from continuing into bubbling.
// - Ancestor bubbling handlers can execute after the target's handlers.
