/**
 * Event Prevent Default
 * =====================
 *
 * `preventDefault()` cancels the browser's default action associated with an event. React exposes
 * this behavior through `event.preventDefault()` on its SyntheticEvent objects, allowing a React
 * event handler to intercept native browser behavior such as form submission, link navigation, or
 * checkbox state changes.
 *
 * Preventing the default action is separate from stopping event propagation. `preventDefault()`
 * does not prevent the event from reaching other handlers during capture or bubbling. Conversely,
 * `stopPropagation()` does not cancel the browser's default action.
 *
 * Whether `preventDefault()` has an observable effect depends on whether the event has a cancelable
 * default action. Calling it on an event without a cancelable default action does not create a new
 * behavior to cancel. The native event's `defaultPrevented` state can be inspected after the
 * cancellation request has been made.
 */

import React, { type ChangeEvent, type FormEvent, type MouseEvent } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface PreventLinkNavigationProps {
  readonly label: string;
}

export interface PreventFormSubmissionProps {
  readonly label: string;
}

export interface PreventCheckboxChangeProps {
  readonly label: string;
}

export interface PreventDefaultPropagationProps {
  readonly label: string;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * A click on an anchor normally triggers navigation. Calling `preventDefault()`
 * cancels that browser default action while the click event still exists.
 */
export const PreventLinkNavigation: React.FC<PreventLinkNavigationProps> = ({ label }): React.ReactElement => {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>): void => {
    event.preventDefault();

    console.log("Navigation prevented.");
    console.log("Default prevented:", event.defaultPrevented);
  };

  return (
    <a href="https://example.com" onClick={handleClick}>
      {label}
    </a>
  );
};

/**
 * A form submission normally triggers the browser's form submission behavior.
 * Preventing the submit event allows React to handle the submission itself.
 */
export const PreventFormSubmission: React.FC<PreventFormSubmissionProps> = ({ label }): React.ReactElement => {
  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    console.log("Form submission prevented.");
    console.log("Default prevented:", event.defaultPrevented);
  };

  return (
    <form onSubmit={handleSubmit}>
      <button type="submit">{label}</button>
    </form>
  );
};

/**
 * A checkbox normally changes its checked state when clicked. Calling
 * `preventDefault()` during the click event cancels that browser action.
 */
export const PreventCheckboxChange: React.FC<PreventCheckboxChangeProps> = ({ label }): React.ReactElement => {
  const handleClick = (event: MouseEvent<HTMLInputElement>): void => {
    event.preventDefault();

    console.log("Checkbox default action prevented.");
    console.log("Default prevented:", event.defaultPrevented);
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    console.log("Checkbox changed:", event.currentTarget.checked);
  };

  return (
    <label>
      <input type="checkbox" onClick={handleClick} onChange={handleChange} />
      {label}
    </label>
  );
};

/**
 * `preventDefault()` does not stop propagation. The parent handler can still
 * execute because cancellation of the default action is independent of event
 * propagation.
 */
export const PreventDefaultPropagation: React.FC<PreventDefaultPropagationProps> = ({ label }): React.ReactElement => {
  const handleParentClick = (): void => {
    console.log("Parent handler executed.");
  };

  const handleChildClick = (event: MouseEvent<HTMLButtonElement>): void => {
    event.preventDefault();

    console.log("Child default action prevented.");
    console.log("Propagation continues.");
  };

  return (
    <div onClick={handleParentClick}>
      <button type="button" onClick={handleChildClick}>
        {label}
      </button>
    </div>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

export const EventPreventDefaultDemo: React.FC = (): React.ReactElement => {
  return (
    <div>
      <h2>1. Preventing Link Navigation</h2>
      <PreventLinkNavigation label="Prevent Navigation" />

      <h2>2. Preventing Form Submission</h2>
      <PreventFormSubmission label="Submit Form" />

      <h2>3. Preventing a Checkbox Default Action</h2>
      <PreventCheckboxChange label="Prevent Checkbox Change" />

      <h2>4. Prevent Default Without Stopping Propagation</h2>
      <PreventDefaultPropagation label="Prevent Default Action" />
    </div>
  );
};

export default EventPreventDefaultDemo;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - `event.preventDefault()` cancels the browser's default action for a cancelable event.
// - Form submission, link navigation, and checkbox activation can have default actions
//   that React handlers can prevent.
// - `event.defaultPrevented` indicates that the event's default action has been canceled.
// - Preventing the default action does not stop event propagation.
// - `stopPropagation()` and `preventDefault()` control different parts of event handling.
// - An event without a cancelable default action has no default behavior for
//   `preventDefault()` to cancel.
