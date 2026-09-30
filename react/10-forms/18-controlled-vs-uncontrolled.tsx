/**
 * Controlled vs Uncontrolled
 * ==========================
 *
 * Controlled and uncontrolled form controls differ in where their current value is owned.
 * A controlled control receives its current value from React state and reports changes through
 * an event handler. An uncontrolled control keeps its current value in the DOM and uses
 * `defaultValue` or `defaultChecked` only to establish its initial state.
 *
 * Controlled inputs are useful when the rendered UI, validation, derived values, or other
 * application logic must react immediately to every change. Uncontrolled inputs are useful when
 * values only need to be read at specific points, such as form submission. Neither approach
 * makes the other universally preferable; the appropriate choice depends on where the current
 * value needs to live and whether React needs to react to changes.
 *
 * A form control should not switch between controlled and uncontrolled behavior during its
 * lifetime. For example, an input should not begin with `value={undefined}` and later receive a
 * string value. A stable value type and ownership model avoids React controlled/uncontrolled
 * transition warnings.
 */

import React from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface ControlledExampleProps {
  readonly initialValue: string;
}

export interface UncontrolledExampleProps {
  readonly initialValue: string;
}

export interface ControlledCheckboxExampleProps {
  readonly initialChecked: boolean;
}

export interface ComparisonFormProps {
  readonly initialName: string;
  readonly initialEmail: string;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

export const ControlledExample: React.FC<ControlledExampleProps> = ({ initialValue }): React.ReactElement => {
  const [value, setValue] = React.useState<string>(initialValue);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setValue(event.target.value);
  };

  return (
    <div>
      <label>
        Controlled Name
        <input type="text" value={value} onChange={handleChange} />
      </label>

      <p>React state: {value || "(empty)"}</p>
    </div>
  );
};

export const UncontrolledExample: React.FC<UncontrolledExampleProps> = ({ initialValue }): React.ReactElement => {
  const inputRef: React.RefObject<HTMLInputElement | null> = React.useRef<HTMLInputElement>(null);

  const handleReadValue = (): void => {
    const input: HTMLInputElement | null = inputRef.current;

    if (input !== null) {
      console.log("DOM value:", input.value);
    }
  };

  return (
    <div>
      <label>
        Uncontrolled Name
        <input ref={inputRef} type="text" defaultValue={initialValue} />
      </label>

      <button type="button" onClick={handleReadValue}>
        Read DOM Value
      </button>
    </div>
  );
};

export const ControlledCheckboxExample: React.FC<ControlledCheckboxExampleProps> = ({
  initialChecked,
}): React.ReactElement => {
  const [checked, setChecked] = React.useState<boolean>(initialChecked);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setChecked(event.target.checked);
  };

  return (
    <div>
      <label>
        <input type="checkbox" checked={checked} onChange={handleChange} />
        Controlled subscription
      </label>

      <p>React state: {checked ? "checked" : "unchecked"}</p>
    </div>
  );
};

export const ComparisonForm: React.FC<ComparisonFormProps> = ({ initialName, initialEmail }): React.ReactElement => {
  const [name, setName] = React.useState<string>(initialName);

  const handleControlledChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setName(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    const formData: FormData = new FormData(event.currentTarget);
    const email: FormDataEntryValue | null = formData.get("email");

    console.log("Controlled name:", name);
    console.log("Uncontrolled email:", email);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Controlled Name
        <input type="text" name="name" value={name} onChange={handleControlledChange} />
      </label>

      <label>
        Uncontrolled Email
        <input type="email" name="email" defaultValue={initialEmail} />
      </label>

      <button type="submit">Submit</button>
    </form>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const MainContainer: React.FC = (): React.ReactElement => {
  return (
    <main>
      <h1>Controlled vs Uncontrolled</h1>

      <h2>1. Controlled Input Owned by React State</h2>
      <ControlledExample initialValue="John Doe" />

      <h2>2. Uncontrolled Input Owned by the DOM</h2>
      <UncontrolledExample initialValue="John Doe" />

      <h2>3. Controlled Checkbox State</h2>
      <ControlledCheckboxExample initialChecked={false} />

      <h2>4. Using Controlled and Uncontrolled Controls Together</h2>
      <ComparisonForm initialName="John Doe" initialEmail="john@example.com" />
    </main>
  );
};

export default MainContainer;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - A controlled control receives its current value from React state.
// - A controlled input normally uses `value` with an `onChange` handler.
// - A controlled checkbox uses `checked` with an `onChange` handler.
// - An uncontrolled control keeps its current value in the DOM.
// - An uncontrolled input normally uses `defaultValue` instead of `value`.
// - An uncontrolled checkbox normally uses `defaultChecked` instead of `checked`.
// - Refs and `FormData` can read current values from uncontrolled controls.
// - Controlled controls are useful when React must immediately react to value changes.
// - Uncontrolled controls are useful when values only need to be read at specific points.
// - A control should not switch between controlled and uncontrolled behavior during its lifetime.
// - The choice depends on whether React or the DOM should own the current form value.
