/**
 * Uncontrolled Ref Values
 * ========================
 *
 * An uncontrolled form control keeps its current value in the DOM rather than in React state.
 * A ref provides direct access to that DOM element, allowing React code to read the current value
 * when needed without creating a state variable for every keystroke.
 *
 * A ref object is stable across renders, but changing `ref.current` does not trigger a render.
 * This makes refs useful for storing or reading mutable DOM values that do not need to drive
 * reactive UI updates. The value should be read from the DOM element at the moment it is needed,
 * such as when a button is clicked or a form is submitted.
 *
 * For text inputs, the DOM value is available through `inputRef.current.value`. For checkboxes,
 * the current boolean state is available through `inputRef.current.checked`. These are DOM
 * properties, not React state values, and they represent the control's current state at the time
 * they are read.
 */

import React from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface TextInputRefValueProps {
  readonly initialValue: string;
}

export interface NumberInputRefValueProps {
  readonly initialValue: number;
}

export interface CheckboxRefValueProps {
  readonly initialChecked: boolean;
}

export interface FormRefValuesProps {
  readonly initialName: string;
  readonly initialEmail: string;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

export const TextInputRefValue: React.FC<TextInputRefValueProps> = ({ initialValue }): React.ReactElement => {
  const inputRef: React.RefObject<HTMLInputElement | null> = React.useRef<HTMLInputElement>(null);

  const handleReadValue = (): void => {
    const input: HTMLInputElement | null = inputRef.current;

    if (input !== null) {
      console.log("Current value:", input.value);
    }
  };

  return (
    <div>
      <label>
        Name
        <input ref={inputRef} type="text" defaultValue={initialValue} />
      </label>

      <button type="button" onClick={handleReadValue}>
        Read Value
      </button>
    </div>
  );
};

export const NumberInputRefValue: React.FC<NumberInputRefValueProps> = ({ initialValue }): React.ReactElement => {
  const inputRef: React.RefObject<HTMLInputElement | null> = React.useRef<HTMLInputElement>(null);

  const handleReadValue = (): void => {
    const input: HTMLInputElement | null = inputRef.current;

    if (input !== null) {
      const numericValue: number = input.valueAsNumber;

      console.log("Numeric value:", numericValue);
    }
  };

  return (
    <div>
      <label>
        Age
        <input ref={inputRef} type="number" defaultValue={initialValue} />
      </label>

      <button type="button" onClick={handleReadValue}>
        Read Numeric Value
      </button>
    </div>
  );
};

export const CheckboxRefValue: React.FC<CheckboxRefValueProps> = ({ initialChecked }): React.ReactElement => {
  const checkboxRef: React.RefObject<HTMLInputElement | null> = React.useRef<HTMLInputElement>(null);

  const handleReadValue = (): void => {
    const checkbox: HTMLInputElement | null = checkboxRef.current;

    if (checkbox !== null) {
      console.log("Checked:", checkbox.checked);
    }
  };

  return (
    <div>
      <label>
        <input ref={checkboxRef} type="checkbox" defaultChecked={initialChecked} />
        Receive notifications
      </label>

      <button type="button" onClick={handleReadValue}>
        Read Checked State
      </button>
    </div>
  );
};

export const FormRefValues: React.FC<FormRefValuesProps> = ({ initialName, initialEmail }): React.ReactElement => {
  const formRef: React.RefObject<HTMLFormElement | null> = React.useRef<HTMLFormElement>(null);

  const handleReadValues = (): void => {
    const form: HTMLFormElement | null = formRef.current;

    if (form !== null) {
      const formData: FormData = new FormData(form);
      const name: FormDataEntryValue | null = formData.get("name");
      const email: FormDataEntryValue | null = formData.get("email");

      console.log("Name:", name);
      console.log("Email:", email);
    }
  };

  return (
    <form ref={formRef}>
      <label>
        Name
        <input type="text" name="name" defaultValue={initialName} />
      </label>

      <label>
        Email
        <input type="email" name="email" defaultValue={initialEmail} />
      </label>

      <button type="button" onClick={handleReadValues}>
        Read Form Values
      </button>
    </form>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const MainContainer: React.FC = (): React.ReactElement => {
  return (
    <main>
      <h1>Uncontrolled Ref Values</h1>

      <h2>1. Reading a Text Input Value from a Ref</h2>
      <TextInputRefValue initialValue="John Doe" />

      <h2>2. Reading a Numeric Input Value from a Ref</h2>
      <NumberInputRefValue initialValue={30} />

      <h2>3. Reading a Checkbox Value from a Ref</h2>
      <CheckboxRefValue initialChecked={true} />

      <h2>4. Reading Multiple Form Values from a Form Ref</h2>
      <FormRefValues initialName="John Doe" initialEmail="john@example.com" />
    </main>
  );
};

export default MainContainer;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - An uncontrolled input keeps its current value in the DOM rather than React state.
// - A ref provides direct access to the underlying DOM element.
// - `HTMLInputElement.value` returns the current text value as a string.
// - `HTMLInputElement.valueAsNumber` converts a valid number input value to a number.
// - `HTMLInputElement.checked` returns the current boolean state of a checkbox.
// - A ref's `.current` property must be checked because it can be `null` before mounting.
// - Reading a ref value does not trigger a React re-render.
// - A form ref can be passed to `FormData` to read multiple uncontrolled values at once.
// - Ref values should be read when needed rather than copied into state without a reactive requirement.
