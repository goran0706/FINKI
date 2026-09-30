/**
 * Form Submission
 * ================
 *
 * A React form is submitted when the user activates a submit control or otherwise triggers the
 * form's native submission behavior. React invokes the `onSubmit` handler with a `FormEvent` whose
 * `currentTarget` is the `<form>` element that owns the handler.
 *
 * Calling `event.preventDefault()` prevents the browser's default navigation-based form submission,
 * allowing the React component to process the submitted data itself. The handler can then read
 * controlled state, construct `FormData` from the form element, perform validation, or initiate
 * an application-specific request.
 *
 * Browser constraint validation occurs before the `submit` event is dispatched. For example,
 * `required` and certain input-type constraints can prevent `onSubmit` from running until the
 * form is valid. Calling `preventDefault()` therefore prevents the default action after submission
 * has reached the handler; it does not bypass native constraint validation.
 */

import React from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface FormSubmissionBasicProps {
  readonly initialName: string;
  readonly initialEmail: string;
}

export interface FormSubmissionValidationProps {
  readonly initialName: string;
}

export interface FormSubmissionFormDataProps {
  readonly initialName: string;
  readonly initialEmail: string;
}

export interface FormSubmissionStatusProps {
  readonly initialName: string;
}

export interface FormSubmissionButtonProps {
  readonly initialName: string;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

export const FormSubmissionBasic: React.FC<FormSubmissionBasicProps> = ({
  initialName,
  initialEmail,
}): React.ReactElement => {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    console.log("Form submitted.");
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

      <button type="submit">Submit</button>
    </form>
  );
};

export const FormSubmissionFormData: React.FC<FormSubmissionFormDataProps> = ({
  initialName,
  initialEmail,
}): React.ReactElement => {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    const form: HTMLFormElement = event.currentTarget;

    const formData: FormData = new FormData(form);

    const name: FormDataEntryValue | null = formData.get("name");

    const email: FormDataEntryValue | null = formData.get("email");

    console.log("Name:", name);
    console.log("Email:", email);
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

      <button type="submit">Submit</button>
    </form>
  );
};

export const FormSubmissionValidation: React.FC<FormSubmissionValidationProps> = ({
  initialName,
}): React.ReactElement => {
  const [message, setMessage] = React.useState<string>("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    const formData: FormData = new FormData(event.currentTarget);

    const name: FormDataEntryValue | null = formData.get("name");

    if (typeof name !== "string" || name.trim().length === 0) {
      setMessage("Name is required.");
      return;
    }

    setMessage("Form submitted successfully.");
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Name
        <input type="text" name="name" defaultValue={initialName} />
      </label>

      <button type="submit">Submit</button>

      {message !== "" && <p>{message}</p>}
    </form>
  );
};

export const FormSubmissionStatus: React.FC<FormSubmissionStatusProps> = ({ initialName }): React.ReactElement => {
  const [isSubmitted, setIsSubmitted] = React.useState<boolean>(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    setIsSubmitted(true);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Name
        <input type="text" name="name" defaultValue={initialName} />
      </label>

      <button type="submit">Submit</button>

      {isSubmitted && <p>Form has been submitted.</p>}
    </form>
  );
};

export const FormSubmissionButton: React.FC<FormSubmissionButtonProps> = ({ initialName }): React.ReactElement => {
  const [message, setMessage] = React.useState<string>("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    setMessage("Submitted.");
  };

  const handleReset = (): void => {
    setMessage("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Name
        <input type="text" name="name" defaultValue={initialName} />
      </label>

      <button type="submit">Submit</button>

      <button type="button" onClick={handleReset}>
        Clear Status
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
      <h1>Form Submission</h1>

      <h2>1. Handling Form Submission in React</h2>
      <FormSubmissionBasic initialName="John Doe" initialEmail="john@example.com" />

      <h2>2. Reading Submitted Values with FormData</h2>
      <FormSubmissionFormData initialName="John Doe" initialEmail="john@example.com" />

      <h2>3. Validating Submitted Data</h2>
      <FormSubmissionValidation initialName="John Doe" />

      <h2>4. Tracking Submission Status</h2>
      <FormSubmissionStatus initialName="John Doe" />

      <h2>5. Distinguishing Submit and Non-Submit Buttons</h2>
      <FormSubmissionButton initialName="John Doe" />
    </main>
  );
};

export default MainContainer;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - React handles form submission through the `onSubmit` event handler.
// - `React.FormEvent<HTMLFormElement>` types a React form submission event.
// - `event.currentTarget` refers to the `<form>` element associated with the handler.
// - `event.preventDefault()` prevents the browser's default form submission behavior.
// - `FormData` can be constructed from `event.currentTarget` to read submitted form values.
// - Native constraint validation can prevent `onSubmit` from running for invalid forms.
// - Application-level validation can inspect submitted values after the submit event is received.
// - Submission state can be stored separately when the UI needs to reflect that a submission occurred.
// - Buttons that should not submit a form must explicitly use `type="button"`.
// - A submit button uses `type="submit"` and participates in the form's submission process.
