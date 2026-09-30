/**
 * Controlled Form
 * ===============
 *
 * A controlled form stores the current values of its form controls in React state. Each control
 * receives its current value from state and reports user changes through an event handler. The
 * form therefore has a single source of truth for its current data, allowing React code to read,
 * validate, transform, and submit the same values that are rendered by the controls.
 *
 * A form can keep multiple related values in one state object. When updating one field, the
 * previous object must be preserved so that unrelated fields are not removed. A functional state
 * update is appropriate when the next object depends on the previous state. The computed property
 * name syntax allows one generic change handler to update different fields from their `name`
 * attributes.
 *
 * Form submission is handled with `onSubmit` on the `<form>` element rather than relying on an
 * individual button's click event. Calling `preventDefault()` prevents the browser's native
 * navigation and leaves the submitted data available to React application logic.
 */

import React from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface UserFormData {
  readonly name: string;
  readonly email: string;
  readonly role: string;
}

export interface ControlledFormProps {
  readonly initialValues: UserFormData;
}

export interface SingleFieldFormProps {
  readonly initialValue: string;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

export const SingleFieldForm: React.FC<SingleFieldFormProps> = ({ initialValue }): React.ReactElement => {
  const [value, setValue] = React.useState<string>(initialValue);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setValue(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    console.log("Submitted value:", value);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Name
        <input type="text" value={value} onChange={handleChange} />
      </label>

      <button type="submit">Submit</button>
    </form>
  );
};

export const ControlledForm: React.FC<ControlledFormProps> = ({ initialValues }): React.ReactElement => {
  const [formData, setFormData] = React.useState<UserFormData>(initialValues);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const { name, value } = event.target;

    setFormData((previousData: UserFormData): UserFormData => ({
      ...previousData,
      [name]: value,
    }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    console.log("Submitted form:", formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Name
        <input type="text" name="name" value={formData.name} onChange={handleChange} />
      </label>

      <label>
        Email
        <input type="email" name="email" value={formData.email} onChange={handleChange} />
      </label>

      <label>
        Role
        <select name="role" value={formData.role} onChange={handleChange}>
          <option value="Developer">Developer</option>
          <option value="Designer">Designer</option>
          <option value="Manager">Manager</option>
        </select>
      </label>

      <button type="submit">Submit</button>
    </form>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const MainContainer: React.FC = (): React.ReactElement => {
  const initialValues: UserFormData = {
    name: "John Doe",
    email: "john@example.com",
    role: "Developer",
  };

  return (
    <main>
      <h1>Controlled Form</h1>

      <h2>1. Controlling a Form with State</h2>
      <SingleFieldForm initialValue="John Doe" />

      <h2>2. Controlling Multiple Form Fields</h2>
      <ControlledForm initialValues={initialValues} />
    </main>
  );
};

export default MainContainer;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - A controlled form stores its current form values in React state.
// - Each controlled field receives its current value from that state.
// - `onChange` handlers update state when the user changes a control.
// - A single state object can represent multiple related form fields.
// - Functional state updates preserve the previous state when updating one field.
// - The spread operator preserves unrelated fields when a form object is updated.
// - The `name` attribute can identify which property should be updated by a generic change handler.
// - Computed property names allow the changed field to be updated dynamically.
// - `onSubmit` handles form submission at the form level.
// - `preventDefault()` prevents the browser's native form submission navigation.
