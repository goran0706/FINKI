/**
 * Shared Form State
 * ==================
 *
 * Shared form state is form data owned by a common component and consumed by multiple child
 * components. The shared owner stores the current values, while different children receive only
 * the pieces of state and callbacks they need.
 *
 * This allows multiple parts of a form to stay synchronized without maintaining separate copies
 * of the same data. When one child reports a change, the shared owner updates its state and the
 * new value is passed to every child that depends on it.
 *
 * Shared state is useful when sibling components need to coordinate their behavior. A field can
 * update the state while another component reads that same state to display a preview, validation
 * result, character count, or other derived information.
 */

import React from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface SharedFormFieldProps {
  readonly value: string;
  readonly onChange: (value: string) => void;
}

export interface SharedFormPreviewProps {
  readonly name: string;
  readonly email: string;
}

export interface SharedFormValidationProps {
  readonly name: string;
  readonly email: string;
}

export interface SharedFormProps {
  readonly initialName: string;
  readonly initialEmail: string;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

export const SharedNameField: React.FC<SharedFormFieldProps> = ({ value, onChange }): React.ReactElement => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    onChange(event.target.value);
  };

  return (
    <label>
      Name
      <input type="text" value={value} onChange={handleChange} />
    </label>
  );
};

export const SharedEmailField: React.FC<SharedFormFieldProps> = ({ value, onChange }): React.ReactElement => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    onChange(event.target.value);
  };

  return (
    <label>
      Email
      <input type="email" value={value} onChange={handleChange} />
    </label>
  );
};

export const SharedFormPreview: React.FC<SharedFormPreviewProps> = ({ name, email }): React.ReactElement => {
  return (
    <section>
      <h3>Live Preview</h3>
      <p>Name: {name || "(empty)"}</p>
      <p>Email: {email || "(empty)"}</p>
    </section>
  );
};

export const SharedFormValidation: React.FC<SharedFormValidationProps> = ({ name, email }): React.ReactElement => {
  const nameIsValid: boolean = name.trim().length > 0;

  const emailIsValid: boolean = email.trim().includes("@");

  const isValid: boolean = nameIsValid && emailIsValid;

  return (
    <section>
      <h3>Form Status</h3>
      <p>{isValid ? "Form is valid." : "Form contains validation errors."}</p>
    </section>
  );
};

export const SharedForm: React.FC<SharedFormProps> = ({ initialName, initialEmail }): React.ReactElement => {
  const [name, setName] = React.useState<string>(initialName);
  const [email, setEmail] = React.useState<string>(initialEmail);

  const handleNameChange = (value: string): void => {
    setName(value);
  };

  const handleEmailChange = (value: string): void => {
    setEmail(value);
  };

  return (
    <form>
      <SharedNameField value={name} onChange={handleNameChange} />

      <SharedEmailField value={email} onChange={handleEmailChange} />

      <SharedFormPreview name={name} email={email} />

      <SharedFormValidation name={name} email={email} />
    </form>
  );
};

export const SharedFormDerivedState: React.FC = (): React.ReactElement => {
  const [name, setName] = React.useState<string>("John Doe");

  const handleNameChange = (value: string): void => {
    setName(value);
  };

  const characterCount: number = name.length;

  return (
    <section>
      <SharedNameField value={name} onChange={handleNameChange} />

      <p>Character count: {characterCount}</p>
    </section>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const MainContainer: React.FC = (): React.ReactElement => {
  return (
    <main>
      <h1>Shared Form State</h1>

      <h2>1. Sharing Form State between Sibling Components</h2>
      <SharedForm initialName="John Doe" initialEmail="john@example.com" />

      <h2>2. Deriving Additional Data from Shared State</h2>
      <SharedFormDerivedState />
    </main>
  );
};

export default MainContainer;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Shared form state is owned by a common component and consumed by multiple child components.
// - Child components receive only the state values and callbacks they need through props.
// - A field can update shared state while other components immediately receive the new value.
// - Multiple children can stay synchronized without maintaining duplicate copies of the same data.
// - A preview component can read shared state without owning or modifying that state.
// - Validation can derive its result directly from the current shared form values.
// - Derived values such as character counts generally do not need separate state.
// - Shared state is useful when sibling components need to coordinate around the same form data.
// - The component that owns shared state remains the source of truth for that data.
