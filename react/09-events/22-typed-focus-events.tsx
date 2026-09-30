/**
 * Typed Focus Events
 * ==================
 *
 * React provides the `FocusEvent<T>` type for focus-related interactions such as gaining focus,
 * losing focus, and moving focus between elements. The generic element parameter identifies the
 * element receiving the handler and gives `currentTarget` an element-specific TypeScript type.
 *
 * Focus events expose `relatedTarget`, which identifies the other element involved in the focus
 * transition when one exists. For a focus event, this can represent the element losing focus or
 * receiving focus depending on the event being handled.
 *
 * React's `onFocus` and `onBlur` participate in React's event propagation system, including bubbling
 * behavior that differs from the native DOM `focus` and `blur` events. This allows a parent React
 * element to observe focus changes occurring within its descendant subtree.
 */

import React, { type FocusEvent, type ReactElement } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface FocusInputProps {
  readonly label: string;
}

export interface FocusBlurProps {
  readonly label: string;
}

export interface FocusRelatedTargetProps {
  readonly label: string;
}

export interface FocusContainerProps {
  readonly label: string;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * `FocusEvent<HTMLInputElement>` gives the focus handler an input-specific
 * `currentTarget` while exposing focus-related event information.
 */
export const FocusInput: React.FC<FocusInputProps> = ({ label }): ReactElement => {
  const handleFocus = (event: FocusEvent<HTMLInputElement>): void => {
    console.log("Focused element:", event.currentTarget);
    console.log("Event type:", event.type);
  };

  return <input aria-label={label} onFocus={handleFocus} />;
};

/**
 * `onBlur` receives the same React `FocusEvent<T>` family of event type.
 * It runs when the element loses focus.
 */
export const FocusBlur: React.FC<FocusBlurProps> = ({ label }): ReactElement => {
  const handleFocus = (event: FocusEvent<HTMLInputElement>): void => {
    console.log("Input focused:", event.currentTarget);
  };

  const handleBlur = (event: FocusEvent<HTMLInputElement>): void => {
    console.log("Input blurred:", event.currentTarget);
  };

  return <input aria-label={label} onFocus={handleFocus} onBlur={handleBlur} />;
};

/**
 * `relatedTarget` identifies the other element involved in a focus transition.
 * It can be `null`, such as when focus moves outside the document.
 */
export const FocusRelatedTarget: React.FC<FocusRelatedTargetProps> = ({ label }): ReactElement => {
  const handleBlur = (event: FocusEvent<HTMLInputElement>): void => {
    const relatedTarget: EventTarget | null = event.relatedTarget;

    console.log("Blurred element:", event.currentTarget);
    console.log("Next focus target:", relatedTarget);
  };

  return (
    <div>
      <input aria-label={`${label} first`} onBlur={handleBlur} />
      <input aria-label={`${label} second`} />
    </div>
  );
};

/**
 * React focus events can be observed on an ancestor when focus moves into
 * a descendant. `currentTarget` remains the ancestor containing the handler.
 */
export const FocusContainer: React.FC<FocusContainerProps> = ({ label }): ReactElement => {
  const handleFocus = (event: FocusEvent<HTMLDivElement>): void => {
    console.log("Focus event target:", event.target);
    console.log("Focus handler container:", event.currentTarget);
  };

  return (
    <div onFocus={handleFocus}>
      <label>
        {label}
        <input aria-label={label} />
      </label>
    </div>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

export const TypedFocusEventsDemo: React.FC = (): ReactElement => {
  return (
    <div>
      <h2>1. Typed Focus Event</h2>
      <FocusInput label="Focus Input" />

      <h2>2. Focus and Blur Events</h2>
      <FocusBlur label="Focus and Blur Input" />

      <h2>3. Focus Transition Information</h2>
      <FocusRelatedTarget label="Focus Transition" />

      <h2>4. Observing Descendant Focus</h2>
      <FocusContainer label="Focusable Control" />
    </div>
  );
};

export default TypedFocusEventsDemo;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - React focus handlers use the specialized `FocusEvent<T>` type.
// - The generic parameter identifies the element receiving the handler.
// - `onFocus` runs when an element receives focus.
// - `onBlur` runs when an element loses focus.
// - `event.currentTarget` is typed according to the handler's element.
// - `event.relatedTarget` identifies the other element involved in the focus transition.
// - `relatedTarget` can be `null` when there is no corresponding element.
// - React's focus events support ancestor observation of descendant focus changes.
