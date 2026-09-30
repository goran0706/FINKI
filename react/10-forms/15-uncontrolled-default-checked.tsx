/**
 * Uncontrolled Default Checked
 * =============================
 *
 * The `defaultChecked` prop sets the initial checked state of an uncontrolled checkbox or radio
 * button. React uses the supplied boolean when the DOM element is initialized, but it does not
 * continuously synchronize the element's checked state with the prop after mounting.
 *
 * After initialization, the browser owns the current checked state. A user can check or uncheck
 * the control without React state being updated. The current state can later be read through a
 * ref, a form submission event, or the `FormData` API.
 *
 * `defaultChecked` therefore differs from `checked`. `checked` makes the control controlled by
 * React and requires React to provide the current boolean state, while `defaultChecked` only
 * establishes the initial DOM state.
 */

import React from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface DefaultCheckedCheckboxProps {
  readonly label: string;
  readonly initialChecked: boolean;
}

export interface DefaultCheckedRadioProps {
  readonly value: string;
  readonly label: string;
  readonly initialChecked: boolean;
}

export interface DefaultCheckedFormProps {
  readonly initialSubscribed: boolean;
}

export interface DefaultCheckedRefProps {
  readonly initialChecked: boolean;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

export const DefaultCheckedCheckbox: React.FC<DefaultCheckedCheckboxProps> = ({
  label,
  initialChecked,
}): React.ReactElement => {
  return (
    <label>
      <input type="checkbox" defaultChecked={initialChecked} />
      {label}
    </label>
  );
};

export const DefaultCheckedRadio: React.FC<DefaultCheckedRadioProps> = ({
  value,
  label,
  initialChecked,
}): React.ReactElement => {
  return (
    <label>
      <input type="radio" name="role" value={value} defaultChecked={initialChecked} />
      {label}
    </label>
  );
};

export const DefaultCheckedForm: React.FC<DefaultCheckedFormProps> = ({ initialSubscribed }): React.ReactElement => {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    const formData: FormData = new FormData(event.currentTarget);
    const subscribed: FormDataEntryValue | null = formData.get("subscribed");

    console.log("Subscribed:", subscribed);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        <input type="checkbox" name="subscribed" value="yes" defaultChecked={initialSubscribed} />
        Subscribe to notifications
      </label>

      <button type="submit">Submit</button>
    </form>
  );
};

export const DefaultCheckedRef: React.FC<DefaultCheckedRefProps> = ({ initialChecked }): React.ReactElement => {
  const checkboxRef: React.RefObject<HTMLInputElement | null> = React.useRef<HTMLInputElement>(null);

  const handleReadChecked = (): void => {
    const checkbox: HTMLInputElement | null = checkboxRef.current;

    if (checkbox !== null) {
      console.log("Current checked state:", checkbox.checked);
    }
  };

  return (
    <div>
      <label>
        <input ref={checkboxRef} type="checkbox" defaultChecked={initialChecked} />
        Enable notifications
      </label>

      <button type="button" onClick={handleReadChecked}>
        Read Checked State
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
      <h1>Uncontrolled Default Checked</h1>

      <h2>1. Initial Checkbox State with defaultChecked</h2>
      <DefaultCheckedCheckbox label="Receive notifications" initialChecked={true} />

      <h2>2. Initial Radio Button State with defaultChecked</h2>
      <div>
        <DefaultCheckedRadio value="Developer" label="Developer" initialChecked={true} />
        <DefaultCheckedRadio value="Designer" label="Designer" initialChecked={false} />
        <DefaultCheckedRadio value="Manager" label="Manager" initialChecked={false} />
      </div>

      <h2>3. Reading an Uncontrolled Checkbox on Submit</h2>
      <DefaultCheckedForm initialSubscribed={true} />

      <h2>4. Reading the Current Checked State through a Ref</h2>
      <DefaultCheckedRef initialChecked={false} />
    </main>
  );
};

export default MainContainer;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - `defaultChecked` establishes the initial checked state of an uncontrolled checkbox or radio button.
// - The browser manages the current checked state after the control has been initialized.
// - User interaction changes the DOM checked state without requiring React state.
// - `defaultChecked` can be used with both checkboxes and radio buttons.
// - A radio group must use the same `name` so the browser treats its radio buttons as one group.
// - `FormData` includes a checked checkbox or selected radio button when it has a `name`.
// - An unchecked checkbox is omitted from `FormData`.
// - A ref can read the current DOM `checked` property.
// - `checked` differs from `defaultChecked` because `checked` makes the control controlled by React.
// - Changing `defaultChecked` after mounting does not continuously update the current DOM state.
