/**
 * Typed Form Events
 * =================
 *
 * React provides the `FormEvent<T>` type for form-related interactions such as form submission.
 * The generic element parameter identifies the element receiving the event handler and gives
 * `currentTarget` an element-specific TypeScript type.
 *
 * A form submission event is associated with the form element rather than an individual input.
 * `event.currentTarget` therefore provides access to form-specific properties and methods such
 * as `checkValidity()`, while individual controls can be accessed through the form when needed.
 *
 * Form submission normally triggers the browser's default navigation behavior. Calling
 * `event.preventDefault()` cancels that default action while leaving the React event itself
 * available for application-level processing.
 */

import React, { type FormEvent, type ReactElement } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface FormSubmitProps {
  readonly label: string;
}

export interface FormValidationProps {
  readonly label: string;
}

export interface FormTargetProps {
  readonly label: string;
}

export interface FormControlsProps {
  readonly label: string;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * `FormEvent<HTMLFormElement>` gives the submit handler an HTML form-specific
 * `currentTarget`, allowing form methods to be accessed safely.
 */
export const FormSubmit: React.FC<FormSubmitProps> = ({ label }): ReactElement => {
  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    console.log("Form submitted:", event.currentTarget);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        {label}
        <input name="value" />
      </label>
      <button type="submit">Submit</button>
    </form>
  );
};

/**
 * `currentTarget` is typed as `HTMLFormElement`, so built-in form validation
 * methods such as `checkValidity()` are available without a type assertion.
 */
export const FormValidation: React.FC<FormValidationProps> = ({ label }): ReactElement => {
  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    const isValid: boolean = event.currentTarget.checkValidity();

    console.log("Form is valid:", isValid);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        {label}
        <input name="value" required />
      </label>
      <button type="submit">Validate</button>
    </form>
  );
};

/**
 * `target` identifies the originating event target, while `currentTarget`
 * identifies the element on which the submit handler is registered.
 */
export const FormTarget: React.FC<FormTargetProps> = ({ label }): ReactElement => {
  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    console.log("Target:", event.target);
    console.log("Current target:", event.currentTarget);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        {label}
        <input name="value" />
      </label>
      <button type="submit">Submit</button>
    </form>
  );
};

/**
 * Form controls can be identified through the form element's `elements`
 * collection. The collection contains controls associated with the form.
 */
export const FormControls: React.FC<FormControlsProps> = ({ label }): ReactElement => {
  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    const controls: HTMLFormControlsCollection = event.currentTarget.elements;

    console.log("Number of controls:", controls.length);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        {label}
        <input name="value" />
      </label>
      <button type="submit">Submit</button>
    </form>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

export const TypedFormEventsDemo: React.FC = (): ReactElement => {
  return (
    <div>
      <h2>1. Handling Form Submission</h2>
      <FormSubmit label="Form value" />

      <h2>2. Validating the Form</h2>
      <FormValidation label="Required value" />

      <h2>3. Comparing Target and Current Target</h2>
      <FormTarget label="Form value" />

      <h2>4. Accessing Form Controls</h2>
      <FormControls label="Form value" />
    </div>
  );
};

export default TypedFormEventsDemo;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - React form handlers use the specialized `FormEvent<T>` type.
// - `FormEvent<HTMLFormElement>` gives `currentTarget` an HTML form-specific type.
// - Form submission normally performs a browser default action unless prevented.
// - `event.preventDefault()` cancels the default submission behavior.
// - `event.currentTarget` provides access to form APIs such as `checkValidity()`
//   and the `elements` collection.
// - `event.target` identifies the originating event target and can differ from
//   `currentTarget`.
