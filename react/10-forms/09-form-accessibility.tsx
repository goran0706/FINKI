/**
 * Form Accessibility
 * ===================
 *
 * Accessible forms provide programmatically determinable relationships between controls,
 * labels, instructions, validation messages, and groups of related fields. Native HTML
 * semantics such as `<label>`, `<fieldset>`, `<legend>`, `required`, and `aria-describedby`
 * allow browsers and assistive technologies to expose these relationships without requiring
 * custom accessibility logic.
 *
 * React uses `htmlFor` to associate a label with a control's `id`. The `aria-describedby`
 * attribute references the `id` of one or more elements containing supplementary instructions
 * or error messages. `aria-invalid` communicates that the current value fails validation, while
 * `aria-required` can communicate required state when native `required` semantics cannot be used.
 *
 * Native HTML validation should generally be preferred when the browser can express the
 * requirement directly. ARIA supplements native semantics; it does not replace native form
 * behavior or make an otherwise inaccessible control accessible by itself.
 */

import React from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface LabeledInputProps {
  readonly inputId: string;
  readonly label: string;
  readonly defaultValue: string;
}

export interface DescribedInputProps {
  readonly inputId: string;
  readonly label: string;
  readonly description: string;
}

export interface RequiredInputProps {
  readonly inputId: string;
  readonly label: string;
  readonly initialValue: string;
}

export interface ValidationInputProps {
  readonly inputId: string;
  readonly label: string;
  readonly initialValue: string;
}

export interface AccessibleRadioGroupProps {
  readonly name: string;
  readonly legend: string;
  readonly options: readonly string[];
  readonly initialValue: string;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

export const LabeledInput: React.FC<LabeledInputProps> = ({ inputId, label, defaultValue }): React.ReactElement => {
  return (
    <div>
      <label htmlFor={inputId}>{label}</label>
      <input id={inputId} type="text" defaultValue={defaultValue} />
    </div>
  );
};

export const DescribedInput: React.FC<DescribedInputProps> = ({ inputId, label, description }): React.ReactElement => {
  const descriptionId: string = `${inputId}-description`;

  return (
    <div>
      <label htmlFor={inputId}>{label}</label>

      <p id={descriptionId}>{description}</p>

      <input id={inputId} type="text" aria-describedby={descriptionId} />
    </div>
  );
};

export const RequiredInput: React.FC<RequiredInputProps> = ({ inputId, label, initialValue }): React.ReactElement => {
  const [value, setValue] = React.useState<string>(initialValue);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setValue(event.target.value);
  };

  return (
    <div>
      <label htmlFor={inputId}>{label}</label>

      <input id={inputId} type="email" value={value} onChange={handleChange} required />
    </div>
  );
};

export const ValidationInput: React.FC<ValidationInputProps> = ({
  inputId,
  label,
  initialValue,
}): React.ReactElement => {
  const [value, setValue] = React.useState<string>(initialValue);
  const [touched, setTouched] = React.useState<boolean>(false);

  const errorId: string = `${inputId}-error`;
  const hasError: boolean = touched && value.trim() === "";

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setValue(event.target.value);
  };

  const handleBlur = (): void => {
    setTouched(true);
  };

  return (
    <div>
      <label htmlFor={inputId}>{label}</label>

      <input
        id={inputId}
        type="text"
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        aria-invalid={hasError}
        aria-describedby={hasError ? errorId : undefined}
      />

      {hasError && <p id={errorId}>This field is required.</p>}
    </div>
  );
};

export const AccessibleRadioGroup: React.FC<AccessibleRadioGroupProps> = ({
  name,
  legend,
  options,
  initialValue,
}): React.ReactElement => {
  const [value, setValue] = React.useState<string>(initialValue);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setValue(event.target.value);
  };

  return (
    <fieldset>
      <legend>{legend}</legend>

      {options.map((option: string): React.ReactElement => {
        const inputId: string = `${name}-${option.toLowerCase()}`;

        return (
          <div key={option}>
            <input
              id={inputId}
              type="radio"
              name={name}
              value={option}
              checked={value === option}
              onChange={handleChange}
            />
            <label htmlFor={inputId}>{option}</label>
          </div>
        );
      })}
    </fieldset>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const MainContainer: React.FC = (): React.ReactElement => {
  const contactOptions: readonly string[] = ["Email", "Phone", "SMS"];

  return (
    <main>
      <h1>Form Accessibility</h1>

      <h2>1. Explicit Label Association</h2>
      <LabeledInput inputId="username" label="Username" defaultValue="John Doe" />

      <h2>2. Descriptive Instructions</h2>
      <DescribedInput inputId="password" label="Password" description="Use at least eight characters." />

      <h2>3. Native Required Semantics</h2>
      <RequiredInput inputId="email" label="Email address" initialValue="" />

      <h2>4. Accessible Validation State</h2>
      <ValidationInput inputId="display-name" label="Display name" initialValue="" />

      <h2>5. Accessible Radio Group</h2>
      <AccessibleRadioGroup
        name="contact-method"
        legend="Preferred contact method"
        options={contactOptions}
        initialValue="Email"
      />
    </main>
  );
};

export default MainContainer;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - `htmlFor` and `id` create an explicit programmatic label-to-control association.
// - `aria-describedby` associates supplementary instructions or messages with a form control.
// - Native `required` provides built-in required-field semantics and browser validation.
// - `aria-invalid` communicates that a control's current value is invalid.
// - Error messages should be associated with their control through `aria-describedby`.
// - `<fieldset>` and `<legend>` provide semantic grouping for related form controls.
// - Every individual form control should have an accessible name, normally provided by `<label>`.
// - Native HTML semantics should be preferred over ARIA when equivalent native semantics are available.
