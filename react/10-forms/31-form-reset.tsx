/**
 * Form Reset
 * ==========
 *
 * A form can be reset to its initial control values through the browser's native reset behavior.
 * React exposes the form reset event through `onReset`, while `HTMLFormElement.reset()` can trigger
 * the same native reset behavior programmatically.
 *
 * For uncontrolled controls, resetting a form restores each control to its default value. For
 * controlled React inputs, the displayed value comes from React state, so a native form reset does
 * not replace the state value. Controlled fields therefore require their state to be reset as well.
 *
 * A reset restores default values; it does not necessarily clear every field to an empty value.
 * For example, an input with `defaultValue="John Doe"` resets to `"John Doe"`, and a checkbox with
 * `defaultChecked` resets to its declared default checked state.
 */

import React from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface FormResetUncontrolledProps {
  readonly initialName: string;
}

export interface FormResetControlledProps {
  readonly initialName: string;
}

export interface FormResetHandlerProps {
  readonly initialName: string;
}

export interface FormResetProgrammaticProps {
  readonly initialName: string;
}

export interface FormResetDefaultsProps {
  readonly initialName: string;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

export const FormResetUncontrolled: React.FC<FormResetUncontrolledProps> = ({ initialName }): React.ReactElement => {
  return (
    <form>
      <label>
        Name
        <input type="text" name="name" defaultValue={initialName} />
      </label>

      <button type="reset">Reset</button>
    </form>
  );
};

export const FormResetControlled: React.FC<FormResetControlledProps> = ({ initialName }): React.ReactElement => {
  const [name, setName] = React.useState<string>(initialName);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setName(event.target.value);
  };

  const handleReset = (): void => {
    setName(initialName);
  };

  return (
    <form>
      <label>
        Name
        <input type="text" name="name" value={name} onChange={handleChange} />
      </label>

      <button type="button" onClick={handleReset}>
        Reset
      </button>
    </form>
  );
};

export const FormResetHandler: React.FC<FormResetHandlerProps> = ({ initialName }): React.ReactElement => {
  const [message, setMessage] = React.useState<string>("");

  const handleReset = (event: React.FormEvent<HTMLFormElement>): void => {
    console.log("Reset event received for:", event.currentTarget);

    setMessage("Form was reset.");
  };

  return (
    <form onReset={handleReset}>
      <label>
        Name
        <input type="text" name="name" defaultValue={initialName} />
      </label>

      <button type="reset">Reset</button>

      {message !== "" && <p>{message}</p>}
    </form>
  );
};

export const FormResetProgrammatic: React.FC<FormResetProgrammaticProps> = ({ initialName }): React.ReactElement => {
  const formRef: React.RefObject<HTMLFormElement | null> = React.useRef<HTMLFormElement>(null);

  const handleReset = (): void => {
    formRef.current?.reset();
  };

  return (
    <form ref={formRef}>
      <label>
        Name
        <input type="text" name="name" defaultValue={initialName} />
      </label>

      <button type="button" onClick={handleReset}>
        Reset with JavaScript
      </button>
    </form>
  );
};

export const FormResetDefaults: React.FC<FormResetDefaultsProps> = ({ initialName }): React.ReactElement => {
  return (
    <form>
      <label>
        Name
        <input type="text" name="name" defaultValue={initialName} />
      </label>

      <label>
        Receive notifications
        <input type="checkbox" name="notifications" defaultChecked />
      </label>

      <button type="reset">Restore Defaults</button>
    </form>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const MainContainer: React.FC = (): React.ReactElement => {
  return (
    <main>
      <h1>Form Reset</h1>

      <h2>1. Resetting Uncontrolled Form Controls</h2>
      <FormResetUncontrolled initialName="John Doe" />

      <h2>2. Resetting Controlled Form State</h2>
      <FormResetControlled initialName="John Doe" />

      <h2>3. Handling the Form Reset Event</h2>
      <FormResetHandler initialName="John Doe" />

      <h2>4. Resetting a Form Programmatically</h2>
      <FormResetProgrammatic initialName="John Doe" />

      <h2>5. Restoring Declared Default Values</h2>
      <FormResetDefaults initialName="John Doe" />
    </main>
  );
};

export default MainContainer;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - A form reset restores its controls to their default values.
// - An uncontrolled input with `defaultValue` is reset to that default value.
// - A checkbox with `defaultChecked` is reset to its declared default checked state.
// - A controlled input is driven by React state, so native reset does not replace that state.
// - Controlled fields should reset their React state explicitly.
// - The `onReset` prop handles the form's native reset event in React.
// - `HTMLFormElement.reset()` can trigger a form reset programmatically.
// - A reset restores defaults; it does not necessarily clear every field to an empty value.
// - A reset button should use `type="reset"` so it participates in the form's native reset behavior.
// - A non-reset button that manually resets state should use `type="button"` to avoid submitting the form.
