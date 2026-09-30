/**
 * Controlled Input
 * ================
 *
 * A controlled input is a form control whose current value is owned by React state. The input
 * receives its displayed value through the `value` prop, and its `onChange` handler updates the
 * state from the event's current target value. React then re-renders the input with the updated
 * state, making React the single source of truth for the control's value.
 *
 * The state must remain synchronized with the input. Supplying `value` without an `onChange`
 * handler creates a read-only controlled input, while supplying `value={undefined}` or
 * `value={null}` can cause the control to transition away from controlled behavior. A controlled
 * input should therefore use a stable value of the correct type for its entire lifetime.
 *
 * Functional state updates are useful when the next state depends on previous state. For text
 * inputs, however, the new value normally comes directly from the event, so assigning
 * `event.target.value` is sufficient.
 */

import React from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface ControlledTextInputProps {
  readonly label: string;
  readonly initialValue: string;
}

export interface ControlledCheckboxProps {
  readonly label: string;
  readonly initialChecked: boolean;
}

export interface ControlledNumberInputProps {
  readonly label: string;
  readonly initialValue: number;
}

export interface ControlledInputProps {
  readonly label: string;
  readonly initialValue: string;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

export const ControlledTextInput: React.FC<ControlledTextInputProps> = ({
  label,
  initialValue,
}): React.ReactElement => {
  const [value, setValue] = React.useState<string>(initialValue);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setValue(event.target.value);
  };

  return (
    <div>
      <label>
        {label}
        <input type="text" value={value} onChange={handleChange} />
      </label>

      <p>Value: {value || "(empty)"}</p>
    </div>
  );
};

export const ControlledCheckbox: React.FC<ControlledCheckboxProps> = ({
  label,
  initialChecked,
}): React.ReactElement => {
  const [checked, setChecked] = React.useState<boolean>(initialChecked);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setChecked(event.target.checked);
  };

  return (
    <label>
      <input type="checkbox" checked={checked} onChange={handleChange} />
      {label}
    </label>
  );
};

export const ControlledNumberInput: React.FC<ControlledNumberInputProps> = ({
  label,
  initialValue,
}): React.ReactElement => {
  const [value, setValue] = React.useState<number>(initialValue);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const nextValue: number = Number(event.target.value);
    setValue(nextValue);
  };

  return (
    <div>
      <label>
        {label}
        <input type="number" value={value} onChange={handleChange} />
      </label>

      <p>Numeric value: {value}</p>
    </div>
  );
};

export const ControlledInput: React.FC<ControlledInputProps> = ({ label, initialValue }): React.ReactElement => {
  const [value, setValue] = React.useState<string>(initialValue);

  const handleClear = (): void => {
    setValue("");
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setValue(event.target.value);
  };

  return (
    <div>
      <label>
        {label}
        <input type="text" value={value} onChange={handleChange} />
      </label>

      <button type="button" onClick={handleClear}>
        Clear
      </button>
    </div>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const MainContainer: React.FC = (): React.ReactElement => {
  return (
    <main>
      <h1>Controlled Input</h1>

      <h2>1. Controlled Text Input</h2>
      <ControlledTextInput label="Username" initialValue="John Doe" />

      <h2>2. Controlled Checkbox</h2>
      <ControlledCheckbox label="Receive notifications" initialChecked={false} />

      <h2>3. Controlled Numeric Input</h2>
      <ControlledNumberInput label="Age" initialValue={30} />

      <h2>4. Programmatically Updating Controlled State</h2>
      <ControlledInput label="Message" initialValue="Hello" />
    </main>
  );
};

export default MainContainer;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - A controlled input receives its current value from React state.
// - `value` controls text-like inputs, while `checked` controls checkbox inputs.
// - `onChange` updates React state when the user changes the control.
// - `event.target.value` provides the current input value as a string.
// - Numeric inputs still expose their DOM value as a string and require explicit conversion.
// - A controlled input should keep a stable controlled value throughout its lifetime.
// - Supplying `value` without `onChange` creates a read-only controlled input.
// - Programmatic changes to the React state update the rendered input automatically.
