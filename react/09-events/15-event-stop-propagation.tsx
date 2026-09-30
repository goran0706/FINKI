/**
 * Event Stop Propagation
 * ======================
 *
 * `stopPropagation()` prevents an event from continuing through the DOM event propagation path.
 * In React, it is exposed through the SyntheticEvent API as `event.stopPropagation()`. Calling it
 * stops the event from reaching other elements in later propagation steps, but it does not cancel
 * the browser's default action associated with the event.
 *
 * For a bubbling event, stopping propagation in a child handler prevents the event from continuing
 * to ancestor handlers. When called during the capture phase, it prevents the event from continuing
 * farther along the propagation path. `stopPropagation()` therefore controls event propagation,
 * not whether the event itself occurred or whether its default browser behavior should happen.
 *
 * `stopPropagation()` also does not stop other handlers registered on the same element from running.
 * Stopping handlers on the same element requires different event-handling behavior and should not
 * be confused with stopping propagation to other elements.
 */

import React, { type MouseEvent } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface StopChildPropagationProps {
  readonly label: string;
}

export interface StopCapturePropagationProps {
  readonly label: string;
}

export interface StopDefaultActionProps {
  readonly label: string;
}

export interface StopSameElementHandlersProps {
  readonly label: string;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * Calling `stopPropagation()` in the child handler prevents the bubbling event
 * from reaching the parent handler.
 */
export const StopChildPropagation: React.FC<StopChildPropagationProps> = ({ label }): React.ReactElement => {
  const handleParentClick = (): void => {
    console.log("Parent handler executed.");
  };

  const handleChildClick = (event: MouseEvent<HTMLButtonElement>): void => {
    console.log("Child handler executed.");
    event.stopPropagation();
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
 * Stopping propagation during capture prevents the event from continuing
 * farther along the propagation path.
 */
export const StopCapturePropagation: React.FC<StopCapturePropagationProps> = ({ label }): React.ReactElement => {
  const handleOuterCapture = (event: MouseEvent<HTMLDivElement>): void => {
    console.log("Outer capture handler executed.");
    event.stopPropagation();
  };

  const handleButtonClick = (): void => {
    console.log("Button handler executed.");
  };

  return (
    <div onClickCapture={handleOuterCapture}>
      <button type="button" onClick={handleButtonClick}>
        {label}
      </button>
    </div>
  );
};

/**
 * `stopPropagation()` only controls propagation. It does not cancel the
 * browser's default action, which is a separate event operation.
 */
export const StopDefaultAction: React.FC<StopDefaultActionProps> = ({ label }): React.ReactElement => {
  const handleParentClick = (): void => {
    console.log("Parent handler executed.");
  };

  const handleButtonClick = (event: MouseEvent<HTMLButtonElement>): void => {
    event.stopPropagation();
    console.log("Propagation stopped.");
    console.log("Default action was not canceled.");
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
 * `stopPropagation()` does not prevent another handler registered on the same
 * element from executing. It controls propagation between elements.
 */
export const StopSameElementHandlers: React.FC<StopSameElementHandlersProps> = ({ label }): React.ReactElement => {
  const handleFirstClick = (event: MouseEvent<HTMLButtonElement>): void => {
    console.log("First handler executed.");
    event.stopPropagation();
  };

  const handleSecondClick = (): void => {
    console.log("Second handler executed.");
  };

  return (
    <button type="button" onClick={handleFirstClick} onClickCapture={handleSecondClick}>
      {label}
    </button>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

export const EventStopPropagationDemo: React.FC = (): React.ReactElement => {
  return (
    <div>
      <h2>1. Stop Bubbling to an Ancestor</h2>
      <StopChildPropagation label="Stop Parent Handler" />

      <h2>2. Stop Propagation During Capture</h2>
      <StopCapturePropagation label="Stop Capture Propagation" />

      <h2>3. Stop Propagation Without Canceling Default Action</h2>
      <StopDefaultAction label="Stop Propagation" />

      <h2>4. Same Element Handlers</h2>
      <StopSameElementHandlers label="Run Same-Element Handlers" />
    </div>
  );
};

export default EventStopPropagationDemo;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - `event.stopPropagation()` prevents an event from continuing through its
//   propagation path.
// - Stopping a child event prevents it from reaching ancestor handlers.
// - Stopping propagation during capture prevents the event from continuing
//   farther through the propagation path.
// - `stopPropagation()` does not cancel the browser's default action.
// - `stopPropagation()` does not stop other handlers on the same element.
// - Propagation control and default-action cancellation are separate operations.
