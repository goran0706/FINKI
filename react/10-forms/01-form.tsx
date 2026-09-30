/**
 * React Forms
 * ============
 *
 * React forms use controlled form elements whose current values are stored in component state.
 * The `value` or `checked` prop synchronizes the rendered control with state, while an `onChange`
 * handler receives a React change event and updates that state from the element's current value.
 * Form submission is handled through `onSubmit`; calling `preventDefault()` stops the browser's
 * native navigation and allows React code to process the submitted values.
 *
 * Controlled inputs have React state as their single source of truth. When state changes, React
 * re-renders the control with the new value. When the user interacts with the control, the browser
 * produces an event and the handler updates state. This creates a one-way data flow between state
 * and the rendered form control.
 *
 * Form controls expose their values differently. Text inputs and select elements use `value`,
 * checkbox inputs use `checked`, and numeric inputs still expose their value as a string through
 * `event.target.value`. Numeric conversion therefore has to be performed explicitly when a number
 * is required by application logic.
 */

import React, { type ChangeEvent, type FormEvent } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface ControlledInputProps {
  readonly label: string;
  readonly initialValue: string;
}

export interface FormSubmissionProps {
  readonly onSubmitValue: (value: string) => void;
}

export interface CheckboxProps {
  readonly label: string;
  readonly initialChecked: boolean;
}

export interface SelectProps {
  readonly label: string;
  readonly options: readonly string[];
  readonly initialValue: string;
}

export interface NumericInputProps {
  readonly label: string;
  readonly initialValue: number;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

export const ControlledInput: React.FC<ControlledInputProps> = ({ label, initialValue }): React.ReactElement => {
  const [value, setValue] = React.useState<string>(initialValue);

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setValue(event.target.value);
  };

  return (
    <div>
      <label>
        {label}
        <input type="text" value={value} onChange={handleChange} />
      </label>

      <p>Current value: {value || "(empty)"}</p>
    </div>
  );
};

export const FormSubmission: React.FC<FormSubmissionProps> = ({ onSubmitValue }): React.ReactElement => {
  const [value, setValue] = React.useState<string>("");

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setValue(event.target.value);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    onSubmitValue(value);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Name
        <input type="text" value={value} onChange={handleChange} />
      </label>

      <button type="submit">Submit</button>
    </form>
  );
};

export const Checkbox: React.FC<CheckboxProps> = ({ label, initialChecked }): React.ReactElement => {
  const [checked, setChecked] = React.useState<boolean>(initialChecked);

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setChecked(event.target.checked);
  };

  return (
    <label>
      <input type="checkbox" checked={checked} onChange={handleChange} />
      {label}
      <span> ({checked ? "enabled" : "disabled"})</span>
    </label>
  );
};

export const Select: React.FC<SelectProps> = ({ label, options, initialValue }): React.ReactElement => {
  const [value, setValue] = React.useState<string>(initialValue);

  const handleChange = (event: ChangeEvent<HTMLSelectElement>): void => {
    setValue(event.target.value);
  };

  return (
    <label>
      {label}
      <select value={value} onChange={handleChange}>
        {options.map((option: string): React.ReactElement => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <span> Selected: {value}</span>
    </label>
  );
};

export const NumericInput: React.FC<NumericInputProps> = ({ label, initialValue }): React.ReactElement => {
  const [value, setValue] = React.useState<number>(initialValue);

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const nextValue: number = Number(event.target.value);
    setValue(nextValue);
  };

  return (
    <label>
      {label}
      <input type="number" value={value} onChange={handleChange} />
      <span> Numeric value: {value}</span>
    </label>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const MainContainer: React.FC = (): React.ReactElement => {
  const [submittedName, setSubmittedName] = React.useState<string>("");

  const handleSubmittedName = (value: string): void => {
    setSubmittedName(value);
  };

  const selectOptions: readonly string[] = ["Developer", "Designer", "Manager"];

  return (
    <main>
      <h1>React Forms</h1>

      <h2>1. Controlled Text Input</h2>
      <ControlledInput label="Username" initialValue="John Doe" />

      <h2>2. Form Submission</h2>
      <FormSubmission onSubmitValue={handleSubmittedName} />
      <p>Submitted name: {submittedName || "(none)"}</p>

      <h2>3. Controlled Checkbox</h2>
      <Checkbox label="Receive notifications" initialChecked={false} />

      <h2>4. Controlled Select</h2>
      <Select label="Role" options={selectOptions} initialValue="Developer" />

      <h2>5. Numeric Input Values</h2>
      <NumericInput label="Age" initialValue={30} />
    </main>
  );
};

export default MainContainer;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Controlled form controls keep their current values in React state.
// - `value` and `onChange` keep text inputs and select elements synchronized with state.
// - `checked` and `onChange` control checkbox state; checkbox state is not read from `value`.
// - `FormEvent<HTMLFormElement>` types form submission handlers.
// - `ChangeEvent<HTMLInputElement>` types input and checkbox change handlers.
// - `ChangeEvent<HTMLSelectElement>` types select change handlers.
// - `preventDefault()` prevents the browser's native form submission navigation.
// - Input values are strings even when an `<input>` uses `type="number"`.
// - Numeric input values must be explicitly converted when application state requires a number.
