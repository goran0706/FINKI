/**
 * Event Target
 * ============
 *
 * The `target` property of a React event identifies the DOM element on which the event originally
 * occurred. When an event originates from a descendant element, `target` refers to that descendant
 * rather than the element whose event handler is currently running.
 *
 * The target is typed according to the actual event target available through the DOM event model.
 * Because an event can originate from different descendants, TypeScript generally exposes
 * `event.target` as `EventTarget`, which does not guarantee element-specific properties such as
 * `value` or `textContent` without additional narrowing.
 *
 * `target` should therefore be distinguished from `currentTarget`. The former identifies where the
 * event originated, while the latter identifies the element whose handler is executing. When the
 * handler is attached directly to the element that was clicked, the two values may refer to the
 * same element; nested elements can make them different.
 */

import React, { type MouseEvent } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface DirectEventTargetProps {
  readonly label: string;
}

export interface NestedEventTargetProps {
  readonly label: string;
}

export interface TargetNarrowingProps {
  readonly label: string;
}

export interface TargetVsCurrentTargetProps {
  readonly label: string;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * When the element containing the handler is also the element that receives
 * the click, `target` identifies that same button element.
 */
export const DirectEventTarget: React.FC<DirectEventTargetProps> = ({ label }): React.ReactElement => {
  const handleClick = (event: MouseEvent<HTMLButtonElement>): void => {
    console.log("Target:", event.target);
  };

  return (
    <button type="button" onClick={handleClick}>
      {label}
    </button>
  );
};

/**
 * When a descendant receives the click, `target` identifies the descendant
 * that originated the event rather than the button containing the handler.
 */
export const NestedEventTarget: React.FC<NestedEventTargetProps> = ({ label }): React.ReactElement => {
  const handleClick = (event: MouseEvent<HTMLButtonElement>): void => {
    console.log("Target:", event.target);
  };

  return (
    <button type="button" onClick={handleClick}>
      <span>{label}</span>
    </button>
  );
};

/**
 * `event.target` is typed as `EventTarget`, so element-specific properties
 * require a runtime type check before they can be accessed safely.
 */
export const TargetNarrowing: React.FC<TargetNarrowingProps> = ({ label }): React.ReactElement => {
  const handleClick = (event: MouseEvent<HTMLButtonElement>): void => {
    if (event.target instanceof HTMLElement) {
      console.log("Target text:", event.target.textContent);
    }
  };

  return (
    <button type="button" onClick={handleClick}>
      {label}
    </button>
  );
};

/**
 * `target` identifies the original event source, while `currentTarget`
 * identifies the element whose handler is currently executing.
 */
export const TargetVsCurrentTarget: React.FC<TargetVsCurrentTargetProps> = ({ label }): React.ReactElement => {
  const handleClick = (event: MouseEvent<HTMLButtonElement>): void => {
    console.log("Target:", event.target);
    console.log("Current target:", event.currentTarget);
    console.log("Same element:", event.target === event.currentTarget);
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

export const EventTargetDemo: React.FC = (): React.ReactElement => {
  return (
    <div>
      <h2>1. Target on the Handling Element</h2>
      <DirectEventTarget label="Click Button" />

      <h2>2. Target on a Nested Element</h2>
      <NestedEventTarget label="Click Nested Text" />

      <h2>3. Narrowing the Event Target</h2>
      <TargetNarrowing label="Inspect Target" />

      <h2>4. Target Versus Current Target</h2>
      <TargetVsCurrentTarget label="Compare Targets" />
    </div>
  );
};

export default EventTargetDemo;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - `event.target` identifies the DOM element where the event originated.
// - A nested element can become the event target even when the handler is
//   attached to an ancestor element.
// - `event.target` is generally typed as `EventTarget` and does not guarantee
//   element-specific properties without narrowing.
// - Runtime checks such as `instanceof HTMLElement` can narrow the target safely.
// - `event.target` and `event.currentTarget` can refer to different elements.
