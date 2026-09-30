/**
 * Native Form Validation
 * ======================
 *
 * Native form validation is the browser's built-in validation system for HTML form controls.
 * Attributes such as `required`, `type`, `minLength`, `maxLength`, `min`, and `max` declare
 * constraints directly on form controls. The browser evaluates those constraints before allowing
 * a form submission to proceed.
 *
 * When a form contains an invalid control, the browser normally prevents the `submit` event from
 * being dispatched. This means a React `onSubmit` handler does not run until the browser's native
 * constraint validation succeeds, unless validation has been disabled for the form.
 *
 * Individual controls expose their validation state through the `ValidityState` interface.
 * Methods such as `checkValidity()` test constraints without displaying validation UI, while
 * `reportValidity()` performs the same validation and asks the browser to display its native
 * validation feedback when the control is invalid.
 */

import React from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface NativeValidationRequiredProps {
  readonly initialName: string;
}

export interface NativeValidationTypeProps {
  readonly initialEmail: string;
}

export interface NativeValidationLengthProps {
  readonly initialUsername: string;
}

export interface NativeValidationRangeProps {
  readonly initialAge: number;
}

export interface NativeValidationValidityProps {
  readonly initialName: string;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

export const NativeValidationRequired: React.FC<NativeValidationRequiredProps> = ({
  initialName,
}): React.ReactElement => {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    console.log("Native validation passed.");
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Name
        <input type="text" name="name" defaultValue={initialName} required />
      </label>

      <button type="submit">Submit</button>
    </form>
  );
};

export const NativeValidationType: React.FC<NativeValidationTypeProps> = ({ initialEmail }): React.ReactElement => {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    console.log("Email passed native validation.");
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Email
        <input type="email" name="email" defaultValue={initialEmail} required />
      </label>

      <button type="submit">Submit</button>
    </form>
  );
};

export const NativeValidationLength: React.FC<NativeValidationLengthProps> = ({
  initialUsername,
}): React.ReactElement => {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    console.log("Username passed length validation.");
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Username
        <input type="text" name="username" defaultValue={initialUsername} minLength={3} maxLength={12} required />
      </label>

      <button type="submit">Submit</button>
    </form>
  );
};

export const NativeValidationRange: React.FC<NativeValidationRangeProps> = ({ initialAge }): React.ReactElement => {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    console.log("Age passed range validation.");
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Age
        <input type="number" name="age" defaultValue={initialAge} min={18} max={100} required />
      </label>

      <button type="submit">Submit</button>
    </form>
  );
};

export const NativeValidationValidity: React.FC<NativeValidationValidityProps> = ({
  initialName,
}): React.ReactElement => {
  const inputRef: React.RefObject<HTMLInputElement | null> = React.useRef<HTMLInputElement>(null);

  const [message, setMessage] = React.useState<string>("");

  const handleCheck = (): void => {
    const input: HTMLInputElement | null = inputRef.current;

    if (input === null) {
      return;
    }

    const isValid: boolean = input.checkValidity();

    if (isValid) {
      setMessage("The value is valid.");
      return;
    }

    setMessage(input.validity.valueMissing ? "The name is required." : "The value is invalid.");
  };

  const handleReport = (): void => {
    const input: HTMLInputElement | null = inputRef.current;

    if (input === null) {
      return;
    }

    const isValid: boolean = input.reportValidity();

    setMessage(isValid ? "The value is valid." : "The browser reported a validation error.");
  };

  return (
    <form>
      <label>
        Name
        <input ref={inputRef} type="text" name="name" defaultValue={initialName} required />
      </label>

      <button type="button" onClick={handleCheck}>
        Check Validity
      </button>

      <button type="button" onClick={handleReport}>
        Report Validity
      </button>

      {message !== "" && <p>{message}</p>}
    </form>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const MainContainer: React.FC = (): React.ReactElement => {
  return (
    <main>
      <h1>Native Form Validation</h1>

      <h2>1. Validating Required Fields</h2>
      <NativeValidationRequired initialName="" />

      <h2>2. Validating an Email Input</h2>
      <NativeValidationType initialEmail="john@example.com" />

      <h2>3. Validating String Length</h2>
      <NativeValidationLength initialUsername="john" />

      <h2>4. Validating Numeric Ranges</h2>
      <NativeValidationRange initialAge={30} />

      <h2>5. Inspecting Native Validation State</h2>
      <NativeValidationValidity initialName="John Doe" />
    </main>
  );
};

export default MainContainer;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Native form validation is provided by the browser through HTML constraint attributes.
// - `required` prevents submission when a required control has no value.
// - Input types such as `email` provide type-specific native validation.
// - `minLength` and `maxLength` constrain the length of textual input.
// - `min` and `max` constrain supported numeric input values.
// - Invalid native constraints normally prevent the form's `submit` event from being dispatched.
// - `HTMLInputElement.checkValidity()` tests validity without requesting browser validation UI.
// - `HTMLInputElement.reportValidity()` tests validity and reports an invalid control through native browser UI.
// - `ValidityState` exposes individual validation conditions such as `valueMissing`.
// - Native validation can handle basic constraints without duplicating those checks in React state.
