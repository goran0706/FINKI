/**
 * React Input
 * ===========
 *
 * React input elements use native HTML `<input>` controls together with React props and event
 * handlers. A controlled input receives its current value from React state through the `value`
 * prop, and its `onChange` handler updates that state when the user edits the control. The
 * browser still manages the low-level interaction, while React synchronizes the rendered value
 * with component state.
 *
 * Different input types expose their state differently. Text-like inputs provide their current
 * contents through `event.target.value`, while checkboxes expose their state through
 * `event.target.checked`. Numeric inputs also expose `event.target.value` as a string, so
 * converting that value to a number is an explicit application responsibility.
 *
 * An input can also be uncontrolled when `defaultValue` or `defaultChecked` is used instead of
 * `value` or `checked`. The distinction is important because a controlled input must remain
 * synchronized with its React state, whereas an uncontrolled input lets the DOM maintain its
 * current value after the initial render.
 */

import React from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface TextInputProps {
  readonly label: string;
  readonly initialValue: string;
}

export interface NumberInputProps {
  readonly label: string;
  readonly initialValue: number;
}

export interface CheckboxInputProps {
  readonly label: string;
  readonly initialChecked: boolean;
}

export interface UncontrolledInputProps {
  readonly label: string;
  readonly defaultValue: string;
}

export interface ReadOnlyInputProps {
  readonly label: string;
  readonly value: string;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

export const TextInput: React.FC<TextInputProps> = ({ label, initialValue }): React.ReactElement => {
  const [value, setValue] = React.useState<string>(initialValue);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setValue(event.target.value);
  };

  return (
    <label>
      {label}
      <input type="text" value={value} onChange={handleChange} />
      <span> Current value: {value || "(empty)"}</span>
    </label>
  );
};

export const NumberInput: React.FC<NumberInputProps> = ({ label, initialValue }): React.ReactElement => {
  const [value, setValue] = React.useState<number>(initialValue);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const nextValue: number = Number(event.target.value);
    setValue(nextValue);
  };

  return (
    <label>
      {label}
      <input type="number" value={value} onChange={handleChange} />
      <span> Current value: {value}</span>
    </label>
  );
};

export const CheckboxInput: React.FC<CheckboxInputProps> = ({ label, initialChecked }): React.ReactElement => {
  const [checked, setChecked] = React.useState<boolean>(initialChecked);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setChecked(event.target.checked);
  };

  return (
    <label>
      <input type="checkbox" checked={checked} onChange={handleChange} />
      {label}
      <span> {checked ? "Checked" : "Unchecked"}</span>
    </label>
  );
};

export const UncontrolledInput: React.FC<UncontrolledInputProps> = ({ label, defaultValue }): React.ReactElement => {
  return (
    <label>
      {label}
      <input type="text" defaultValue={defaultValue} />
    </label>
  );
};

export const ReadOnlyInput: React.FC<ReadOnlyInputProps> = ({ label, value }): React.ReactElement => {
  return (
    <label>
      {label}
      <input type="text" value={value} readOnly />
    </label>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const MainContainer: React.FC = (): React.ReactElement => {
  return (
    <main>
      <h1>React Input</h1>

      <h2>1. Controlled Text Input</h2>
      <TextInput label="Username" initialValue="John Doe" />

      <h2>2. Numeric Input</h2>
      <NumberInput label="Age" initialValue={30} />

      <h2>3. Checkbox Input</h2>
      <CheckboxInput label="Receive notifications" initialChecked={false} />

      <h2>4. Uncontrolled Input</h2>
      <UncontrolledInput label="Default value" defaultValue="example.com" />

      <h2>5. Read-Only Input</h2>
      <ReadOnlyInput label="Account ID" value="user-12345" />
    </main>
  );
};

export default MainContainer;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Controlled inputs receive their current state through `value` or `checked`.
// - `onChange` receives a `ChangeEvent<HTMLInputElement>` for input elements.
// - Text inputs expose their current contents through `event.target.value`.
// - Checkbox inputs expose their current state through `event.target.checked`.
// - Numeric inputs still expose `event.target.value` as a string and require explicit conversion.
// - `defaultValue` creates an uncontrolled input whose initial value is managed by the DOM.
// - `readOnly` allows a controlled value to be displayed without permitting user edits.
// - Controlled and uncontrolled inputs should not switch between modes during their lifetime.
