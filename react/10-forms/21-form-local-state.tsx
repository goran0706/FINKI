/**
 * Form Local State
 * =================
 *
 * Form-local state is state that belongs to a specific form component and is used only to manage
 * that form's current values, validation state, or interaction state. `useState` keeps this data
 * inside the component, so changes to the form can trigger re-renders without requiring the state
 * to be stored in a parent component or shared application state.
 *
 * Each form instance receives its own independent state. Rendering the same form component multiple
 * times therefore creates separate state cells for each instance. Updating one instance does not
 * mutate or replace the state belonging to another instance.
 *
 * Form-local state is appropriate when the state is only meaningful to the form itself. State that
 * must be shared with other components can instead be lifted to a common owner. The important
 * distinction is ownership: local state should remain as close as practical to the components
 * that use it.
 */

import React from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface FormLocalStateProps {
  readonly initialName: string;
  readonly initialEmail: string;
}

export interface FormLocalValidationProps {
  readonly initialName: string;
  readonly initialEmail: string;
}

export interface FormLocalResetProps {
  readonly initialName: string;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

export const FormLocalState: React.FC<FormLocalStateProps> = ({ initialName, initialEmail }): React.ReactElement => {
  const [name, setName] = React.useState<string>(initialName);
  const [email, setEmail] = React.useState<string>(initialEmail);

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setName(event.target.value);
  };

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setEmail(event.target.value);
  };

  return (
    <form>
      <label>
        Name
        <input type="text" value={name} onChange={handleNameChange} />
      </label>

      <label>
        Email
        <input type="email" value={email} onChange={handleEmailChange} />
      </label>

      <p>Name: {name || "(empty)"}</p>
      <p>Email: {email || "(empty)"}</p>
    </form>
  );
};

export const FormLocalValidation: React.FC<FormLocalValidationProps> = ({
  initialName,
  initialEmail,
}): React.ReactElement => {
  const [name, setName] = React.useState<string>(initialName);
  const [email, setEmail] = React.useState<string>(initialEmail);

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setName(event.target.value);
  };

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setEmail(event.target.value);
  };

  const nameError: string = name.trim().length === 0 ? "Name is required." : "";

  const emailError: string = email.trim().includes("@") ? "" : "Enter a valid email address.";

  const isValid: boolean = nameError === "" && emailError === "";

  return (
    <form>
      <label>
        Name
        <input type="text" value={name} onChange={handleNameChange} aria-invalid={nameError !== ""} />
      </label>

      {nameError !== "" && <p>{nameError}</p>}

      <label>
        Email
        <input type="email" value={email} onChange={handleEmailChange} aria-invalid={emailError !== ""} />
      </label>

      {emailError !== "" && <p>{emailError}</p>}

      <p>{isValid ? "Form is valid." : "Form contains validation errors."}</p>
    </form>
  );
};

export const FormLocalReset: React.FC<FormLocalResetProps> = ({ initialName }): React.ReactElement => {
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
        <input type="text" value={name} onChange={handleChange} />
      </label>

      <button type="button" onClick={handleReset}>
        Reset
      </button>
    </form>
  );
};

export const FormLocalSubmission: React.FC<FormLocalStateProps> = ({
  initialName,
  initialEmail,
}): React.ReactElement => {
  const [name, setName] = React.useState<string>(initialName);
  const [email, setEmail] = React.useState<string>(initialEmail);

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setName(event.target.value);
  };

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setEmail(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    console.log("Submitted name:", name);
    console.log("Submitted email:", email);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Name
        <input type="text" value={name} onChange={handleNameChange} />
      </label>

      <label>
        Email
        <input type="email" value={email} onChange={handleEmailChange} />
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
      <h1>Form Local State</h1>

      <h2>1. Keeping Form Values in Local State</h2>
      <FormLocalState initialName="John Doe" initialEmail="john@example.com" />

      <h2>2. Deriving Validation from Local Form State</h2>
      <FormLocalValidation initialName="John Doe" initialEmail="john@example.com" />

      <h2>3. Resetting Local Form State</h2>
      <FormLocalReset initialName="John Doe" />

      <h2>4. Using Local State during Form Submission</h2>
      <FormLocalSubmission initialName="John Doe" initialEmail="john@example.com" />
    </main>
  );
};

export default MainContainer;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Form-local state belongs to the component that owns and uses the form.
// - `useState` keeps form values local to each rendered form instance.
// - Each instance of a component receives its own independent state.
// - Updating one form instance does not change another instance's local state.
// - Local state can drive controlled form controls and derived validation.
// - Derived validation values generally do not need their own state.
// - Resetting a form field means restoring its local state to the desired initial value.
// - Form submission handlers can read the latest local state directly.
// - State should be lifted when multiple components need to share the same form data.
