/**
 * Uncontrolled Input
 * ===================
 *
 * An uncontrolled input is a form control whose current value is maintained by the DOM rather
 * than by React state. React provides an initial value through `defaultValue` or `defaultChecked`,
 * and the DOM then manages subsequent user changes independently of React state.
 *
 * A ref can provide access to the underlying DOM element when the current value is needed, such
 * as during form submission or when an imperative DOM operation is required. Reading the value
 * from the ref does not cause a React re-render when the user edits the input.
 *
 * `defaultValue` and `defaultChecked` establish the initial DOM value only. Changing those props
 * after the element has mounted does not continuously control the input. This differs from
 * `value` and `checked`, which make React responsible for the current rendered value.
 */

import React from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface UncontrolledTextInputProps {
  readonly initialValue: string;
}

export interface UncontrolledCheckboxProps {
  readonly label: string;
  readonly initialChecked: boolean;
}

export interface UncontrolledFormProps {
  readonly initialName: string;
}

export interface UncontrolledInputProps {
  readonly initialValue: string;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

export const UncontrolledTextInput: React.FC<UncontrolledTextInputProps> = ({ initialValue }): React.ReactElement => {
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

export const UncontrolledCheckbox: React.FC<UncontrolledCheckboxProps> = ({
  label,
  initialChecked,
}): React.ReactElement => {
  const checkboxRef: React.RefObject<HTMLInputElement | null> = React.useRef<HTMLInputElement>(null);

  const handleReadChecked = (): void => {
    const checkbox: HTMLInputElement | null = checkboxRef.current;

    if (checkbox !== null) {
      console.log("Checked:", checkbox.checked);
    }
  };

  return (
    <div>
      <label>
        <input ref={checkboxRef} type="checkbox" defaultChecked={initialChecked} />
        {label}
      </label>

      <button type="button" onClick={handleReadChecked}>
        Read Checked State
      </button>
    </div>
  );
};

export const UncontrolledForm: React.FC<UncontrolledFormProps> = ({ initialName }): React.ReactElement => {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    const formData: FormData = new FormData(event.currentTarget);
    const name: FormDataEntryValue | null = formData.get("name");

    console.log("Submitted name:", name);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Name
        <input type="text" name="name" defaultValue={initialName} />
      </label>

      <button type="submit">Submit</button>
    </form>
  );
};

export const UncontrolledInput: React.FC<UncontrolledInputProps> = ({ initialValue }): React.ReactElement => {
  const inputRef: React.RefObject<HTMLInputElement | null> = React.useRef<HTMLInputElement>(null);

  const handleReset = (): void => {
    const input: HTMLInputElement | null = inputRef.current;

    if (input !== null) {
      input.value = initialValue;
    }
  };

  return (
    <div>
      <label>
        Message
        <input ref={inputRef} type="text" defaultValue={initialValue} />
      </label>

      <button type="button" onClick={handleReset}>
        Reset DOM Value
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
      <h1>Uncontrolled Input</h1>

      <h2>1. Reading an Uncontrolled Input with a Ref</h2>
      <UncontrolledTextInput initialValue="John Doe" />

      <h2>2. Reading an Uncontrolled Checkbox</h2>
      <UncontrolledCheckbox label="Receive notifications" initialChecked={true} />

      <h2>3. Reading Uncontrolled Form Values on Submit</h2>
      <UncontrolledForm initialName="John Doe" />

      <h2>4. Imperatively Updating an Uncontrolled Input</h2>
      <UncontrolledInput initialValue="Hello" />
    </main>
  );
};

export default MainContainer;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - An uncontrolled input stores its current value in the DOM rather than React state.
// - `defaultValue` provides the initial value for an uncontrolled text-like input.
// - `defaultChecked` provides the initial checked state for an uncontrolled checkbox.
// - A ref can access the underlying DOM element when its current value is needed.
// - Updating an uncontrolled input does not update React state or trigger a React re-render.
// - `FormData` can read named uncontrolled form controls during form submission.
// - `defaultValue` and `defaultChecked` do not continuously control the DOM after mounting.
// - `value` and `checked` are different because they make React responsible for the current value.
// - Refs can also be used for imperative DOM operations such as resetting an input value.
