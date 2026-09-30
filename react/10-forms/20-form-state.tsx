/**
 * Form State
 * ==========
 *
 * Form state represents the current data entered into a form and the application state derived
 * from that data. React can store the complete form state in a single object, update individual
 * fields while preserving the remaining fields, and use the same state for rendering, validation,
 * and submission.
 *
 * A form state object should have an explicit TypeScript shape so each field has a known type.
 * When one property changes, the previous state object must be preserved with the spread syntax.
 * Functional state updates are appropriate because each update derives the next form object from
 * the previous one.
 *
 * Form state can also contain values that are derived from the fields, but derived values usually
 * should be calculated during rendering rather than duplicated in state. Keeping one source of
 * truth prevents the stored form data and the rendered form from becoming inconsistent.
 */

import React from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface FormState {
  readonly name: string;
  readonly email: string;
  readonly role: string;
  readonly subscribed: boolean;
}

export interface FormStateProps {
  readonly initialState: FormState;
}

export interface FormFieldProps {
  readonly initialValue: string;
}

export interface FormValidationProps {
  readonly initialState: FormState;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

export const FormStateFields: React.FC<FormStateProps> = ({ initialState }): React.ReactElement => {
  const [formState, setFormState] = React.useState<FormState>(initialState);

  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const fieldName: "name" | "email" = event.target.name as "name" | "email";
    const fieldValue: string = event.target.value;

    setFormState((previousState: FormState): FormState => ({
      ...previousState,
      [fieldName]: fieldValue,
    }));
  };

  const handleRoleChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    setFormState((previousState: FormState): FormState => ({
      ...previousState,
      role: event.target.value,
    }));
  };

  const handleSubscriptionChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setFormState((previousState: FormState): FormState => ({
      ...previousState,
      subscribed: event.target.checked,
    }));
  };

  return (
    <form>
      <label>
        Name
        <input type="text" name="name" value={formState.name} onChange={handleTextChange} />
      </label>

      <label>
        Email
        <input type="email" name="email" value={formState.email} onChange={handleTextChange} />
      </label>

      <label>
        Role
        <select value={formState.role} onChange={handleRoleChange}>
          <option value="Developer">Developer</option>
          <option value="Designer">Designer</option>
          <option value="Manager">Manager</option>
        </select>
      </label>

      <label>
        <input type="checkbox" checked={formState.subscribed} onChange={handleSubscriptionChange} />
        Subscribe to notifications
      </label>

      <pre>{JSON.stringify(formState, null, 2)}</pre>
    </form>
  );
};

export const FormStateField: React.FC<FormFieldProps> = ({ initialValue }): React.ReactElement => {
  const [value, setValue] = React.useState<string>(initialValue);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setValue(event.target.value);
  };

  const trimmedValue: string = value.trim();
  const isValid: boolean = trimmedValue.length >= 3;

  return (
    <div>
      <label>
        Name
        <input type="text" value={value} onChange={handleChange} />
      </label>

      <p>{isValid ? "Name is valid." : "Name must contain at least 3 characters."}</p>
    </div>
  );
};

export const FormStateValidation: React.FC<FormValidationProps> = ({ initialState }): React.ReactElement => {
  const [formState, setFormState] = React.useState<FormState>(initialState);

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setFormState((previousState: FormState): FormState => ({
      ...previousState,
      name: event.target.value,
    }));
  };

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setFormState((previousState: FormState): FormState => ({
      ...previousState,
      email: event.target.value,
    }));
  };

  const nameError: string = formState.name.trim().length === 0 ? "Name is required." : "";

  const emailError: string = formState.email.trim().includes("@") ? "" : "Enter a valid email address.";

  const isValid: boolean = nameError === "" && emailError === "";

  return (
    <form>
      <label>
        Name
        <input type="text" value={formState.name} onChange={handleNameChange} aria-invalid={nameError !== ""} />
      </label>

      {nameError !== "" && <p>{nameError}</p>}

      <label>
        Email
        <input type="email" value={formState.email} onChange={handleEmailChange} aria-invalid={emailError !== ""} />
      </label>

      {emailError !== "" && <p>{emailError}</p>}

      <p>{isValid ? "Form is valid." : "Form contains validation errors."}</p>
    </form>
  );
};

export const FormStateSubmission: React.FC<FormStateProps> = ({ initialState }): React.ReactElement => {
  const [formState, setFormState] = React.useState<FormState>(initialState);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const fieldName: "name" | "email" = event.target.name as "name" | "email";

    setFormState((previousState: FormState): FormState => ({
      ...previousState,
      [fieldName]: event.target.value,
    }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    console.log("Submitted form state:", formState);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Name
        <input type="text" name="name" value={formState.name} onChange={handleChange} />
      </label>

      <label>
        Email
        <input type="email" name="email" value={formState.email} onChange={handleChange} />
      </label>

      <button type="submit">Submit</button>
    </form>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const MainContainer: React.FC = (): React.ReactElement => {
  const initialState: FormState = {
    name: "John Doe",
    email: "john@example.com",
    role: "Developer",
    subscribed: false,
  };

  return (
    <main>
      <h1>Form State</h1>

      <h2>1. Storing Multiple Fields in Form State</h2>
      <FormStateFields initialState={initialState} />

      <h2>2. Using State for a Single Form Field</h2>
      <FormStateField initialValue="John Doe" />

      <h2>3. Deriving Validation from Form State</h2>
      <FormStateValidation initialState={initialState} />

      <h2>4. Submitting the Current Form State</h2>
      <FormStateSubmission initialState={initialState} />
    </main>
  );
};

export default MainContainer;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Form state stores the current values that React needs to manage for a form.
// - An explicit interface gives the complete form state a predictable TypeScript shape.
// - Multiple related fields can be stored together in one state object.
// - Updating one field should preserve the remaining properties with the spread syntax.
// - Functional state updates are useful when the next form state depends on the previous state.
// - Controlled form fields derive their rendered values directly from form state.
// - Validation results can be calculated from the current state without duplicating them in state.
// - Derived values should generally be calculated during rendering instead of stored separately.
// - Form submission can use the current state directly after preventing the browser's default submission.
// - Keeping one source of truth prevents form state and rendered control values from becoming inconsistent.
