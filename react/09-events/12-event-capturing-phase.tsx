/**
 * Event Capturing Phase
 * =====================
 *
 * The capturing phase is the first propagation phase of a DOM event. After an event is dispatched,
 * it travels from the top of the relevant DOM hierarchy toward the element where the event
 * originated. Handlers registered for capture execute while the event moves toward its target.
 *
 * React exposes capture-phase handlers through event props ending in `Capture`, such as `onClickCapture`.
 * A click on a deeply nested element can therefore execute an ancestor's `onClickCapture` handler
 * before the target element's ordinary `onClick` handler runs.
 *
 * Capture and bubbling are different propagation phases. Capture travels toward the event target,
 * while bubbling travels away from the target toward its ancestors. The same event can participate
 * in both phases unless propagation is stopped.
 */

import React, { type MouseEvent } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface BasicCapturingPhaseProps {
  readonly label: string;
}

export interface NestedCapturingPhaseProps {
  readonly label: string;
}

export interface CaptureOrderProps {
  readonly label: string;
}

export interface CaptureTargetProps {
  readonly label: string;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * `onClickCapture` registers the handler for the capture phase, causing the
 * ancestor handler to execute before the nested button's bubbling handler.
 */
export const BasicCapturingPhase: React.FC<BasicCapturingPhaseProps> = ({ label }): React.ReactElement => {
  const handleParentCapture = (): void => {
    console.log("Parent capture handler executed.");
  };

  const handleChildClick = (): void => {
    console.log("Child click handler executed.");
  };

  return (
    <div onClickCapture={handleParentCapture}>
      <button type="button" onClick={handleChildClick}>
        {label}
      </button>
    </div>
  );
};

/**
 * Capture handlers can exist on multiple ancestors. They execute from the
 * outermost ancestor toward the element that originally received the event.
 */
export const NestedCapturingPhase: React.FC<NestedCapturingPhaseProps> = ({ label }): React.ReactElement => {
  const handleOuterCapture = (): void => {
    console.log("Outer capture handler executed.");
  };

  const handleMiddleCapture = (): void => {
    console.log("Middle capture handler executed.");
  };

  const handleButtonClick = (): void => {
    console.log("Button handler executed.");
  };

  return (
    <div onClickCapture={handleOuterCapture}>
      <div onClickCapture={handleMiddleCapture}>
        <button type="button" onClick={handleButtonClick}>
          {label}
        </button>
      </div>
    </div>
  );
};

/**
 * A capture handler executes before the target's ordinary handler because
 * capture moves toward the target before the bubbling phase begins.
 */
export const CaptureOrder: React.FC<CaptureOrderProps> = ({ label }): React.ReactElement => {
  const handleParentCapture = (): void => {
    console.log("1. Parent capture");
  };

  const handleButtonClick = (): void => {
    console.log("2. Button target handler");
  };

  const handleParentBubble = (): void => {
    console.log("3. Parent bubble");
  };

  return (
    <div onClickCapture={handleParentCapture} onClick={handleParentBubble}>
      <button type="button" onClick={handleButtonClick}>
        {label}
      </button>
    </div>
  );
};

/**
 * Capture handlers still receive the same event information. `currentTarget`
 * identifies the ancestor running the capture handler, while `target` remains
 * the element where the event originally occurred.
 */
export const CaptureTarget: React.FC<CaptureTargetProps> = ({ label }): React.ReactElement => {
  const handleCapture = (event: MouseEvent<HTMLDivElement>): void => {
    console.log("Capture current target:", event.currentTarget);
    console.log("Event target:", event.target);
  };

  return (
    <div onClickCapture={handleCapture}>
      <button type="button">{label}</button>
    </div>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

export const EventCapturingPhaseDemo: React.FC = (): React.ReactElement => {
  return (
    <div>
      <h2>1. Capture Handler Before Target Handler</h2>
      <BasicCapturingPhase label="Click Button" />

      <h2>2. Capture Through Multiple Ancestors</h2>
      <NestedCapturingPhase label="Click Nested Button" />

      <h2>3. Capture, Target, and Bubble Order</h2>
      <CaptureOrder label="Inspect Event Order" />

      <h2>4. Target and Current Target During Capture</h2>
      <CaptureTarget label="Inspect Event Targets" />
    </div>
  );
};

export default EventCapturingPhaseDemo;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - The capturing phase is the first propagation phase of a DOM event.
// - `onClickCapture` registers a React handler for the capture phase.
// - Capture handlers execute while an event travels toward its target.
// - Multiple ancestor capture handlers execute from outermost to innermost.
// - A target handler executes after the event reaches the target.
// - Bubbling occurs after the target phase and travels back toward ancestors.
// - `event.target` remains the original event source during capture.
// - `event.currentTarget` identifies the element whose capture handler is executing.
