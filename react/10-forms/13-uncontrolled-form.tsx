/**
 * Uncontrolled Form
 * ==================
 *
 * An uncontrolled form stores the current values of its controls in the DOM rather than in React
 * state. The controls use `defaultValue`, `defaultChecked`, or similar default props to establish
 * their initial values, while the browser remains responsible for subsequent changes.
 *
 * React can read the current form data when submission occurs without maintaining a separate state
 * value for every control. The `FormData` API collects successful named form controls from the
 * submitted form, including text inputs, checkboxes, and select elements.
 *
 * An uncontrolled form is useful when form values only need to be read at specific points, such
 * as submission. A common misconception is that uncontrolled means React cannot interact with the
 * form; refs, `FormData`, validation APIs, and event handlers can still be used when needed.
 */

import React from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface UncontrolledUserFormProps {
  readonly initialName: string;
  readonly initialEmail: string;
  readonly initialRole: string;
}

export interface UncontrolledCheckboxFormProps {
  readonly initialSubscribed: boolean;
}

export interface UncontrolledSelectFormProps {
  readonly initialRole: string;
}

export interface UncontrolledFormProps {
  readonly initialName: string;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

export const UncontrolledUserForm: React.FC<UncontrolledUserFormProps> = ({
  initialName,
  initialEmail,
  initialRole,
}): React.ReactElement => {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    const formData: FormData = new FormData(event.currentTarget);
    const name: FormDataEntryValue | null = formData.get("name");
    const email: FormDataEntryValue | null = formData.get("email");
    const role: FormDataEntryValue | null = formData.get("role");

    console.log("Name:", name);
    console.log("Email:", email);
    console.log("Role:", role);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Name
        <input type="text" name="name" defaultValue={initialName} />
      </label>

      <label>
        Email
        <input type="email" name="email" defaultValue={initialEmail} />
      </label>

      <label>
        Role
        <select name="role" defaultValue={initialRole}>
          <option value="Developer">Developer</option>
          <option value="Designer">Designer</option>
          <option value="Manager">Manager</option>
        </select>
      </label>

      <button type="submit">Submit</button>
    </form>
  );
};

export const UncontrolledCheckboxForm: React.FC<UncontrolledCheckboxFormProps> = ({
  initialSubscribed,
}): React.ReactElement => {
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

export const UncontrolledSelectForm: React.FC<UncontrolledSelectFormProps> = ({ initialRole }): React.ReactElement => {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    const formData: FormData = new FormData(event.currentTarget);
    const role: FormDataEntryValue | null = formData.get("role");

    console.log("Selected role:", role);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Role
        <select name="role" defaultValue={initialRole}>
          <option value="Developer">Developer</option>
          <option value="Designer">Designer</option>
          <option value="Manager">Manager</option>
        </select>
      </label>

      <button type="submit">Submit</button>
    </form>
  );
};

export const UncontrolledForm: React.FC<UncontrolledFormProps> = ({ initialName }): React.ReactElement => {
  const formRef: React.RefObject<HTMLFormElement | null> = React.useRef<HTMLFormElement>(null);

  const handleReadForm = (): void => {
    const form: HTMLFormElement | null = formRef.current;

    if (form !== null) {
      const formData: FormData = new FormData(form);
      const name: FormDataEntryValue | null = formData.get("name");

      console.log("Current name:", name);
    }
  };

  return (
    <form ref={formRef}>
      <label>
        Name
        <input type="text" name="name" defaultValue={initialName} />
      </label>

      <button type="button" onClick={handleReadForm}>
        Read Form
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
      <h1>Uncontrolled Form</h1>

      <h2>1. Reading Multiple Form Values with FormData</h2>
      <UncontrolledUserForm initialName="John Doe" initialEmail="john@example.com" initialRole="Developer" />

      <h2>2. Reading an Uncontrolled Checkbox</h2>
      <UncontrolledCheckboxForm initialSubscribed={true} />

      <h2>3. Reading an Uncontrolled Select</h2>
      <UncontrolledSelectForm initialRole="Designer" />

      <h2>4. Reading an Uncontrolled Form through a Ref</h2>
      <UncontrolledForm initialName="John Doe" />
    </main>
  );
};

export default MainContainer;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - An uncontrolled form stores its current control values in the DOM.
// - `defaultValue` and `defaultChecked` establish initial values without continuously controlling the controls.
// - Named controls are included in `FormData` when they are successful form controls.
// - `FormData.get()` returns a `FormDataEntryValue` or `null` when the requested field is absent.
// - Unchecked checkboxes are omitted from submitted form data.
// - A checkbox's submitted value comes from its `value` attribute rather than its boolean checked state.
// - A ref can provide direct access to the underlying `<form>` element.
// - `FormData` can read the current DOM values without storing every field in React state.
// - Uncontrolled forms can still use React event handlers, refs, validation, and browser form APIs.
