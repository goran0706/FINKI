/**
 * Form Submit Handler
 * ====================
 *
 * A form submit handler is the function React invokes when a form successfully reaches its submit
 * event. The handler is attached through the form's `onSubmit` prop and receives a React form event
 * whose `currentTarget` is the `<form>` element.
 *
 * The submit handler is the appropriate place to coordinate submission-specific behavior such as
 * preventing the browser's default navigation, reading form values, validating submitted data,
 * updating submission state, or starting an asynchronous operation.
 *
 * `event.currentTarget` should be preferred when accessing the form element itself. Unlike
 * `event.target`, which identifies the element that originally triggered the event, `currentTarget`
 * identifies the element whose handler is currently executing.
 */

import React from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface FormSubmitHandlerBasicProps {
  readonly initialName: string;
}

export interface FormSubmitHandlerTargetProps {
  readonly initialName: string;
}

export interface FormSubmitHandlerDataProps {
  readonly initialName: string;
  readonly initialEmail: string;
}

export interface FormSubmitHandlerValidationProps {
  readonly initialName: string;
  readonly initialEmail: string;
}

export interface FormSubmitHandlerAsyncProps {
  readonly initialName: string;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

export const FormSubmitHandlerBasic: React.FC<FormSubmitHandlerBasicProps> = ({ initialName }): React.ReactElement => {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    console.log("Submit handler executed.");
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Name
        <input type="text" name="name" defaultValue={initialName} />
      </label>

      <button type="submit">Submit</button>
    </form>
  );
};

export const FormSubmitHandlerTarget: React.FC<FormSubmitHandlerTargetProps> = ({
  initialName,
}): React.ReactElement => {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    const form: HTMLFormElement = event.currentTarget;

    const target: EventTarget = event.target;

    console.log("Current target:", form);
    console.log("Original target:", target);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Name
        <input type="text" name="name" defaultValue={initialName} />
      </label>

      <button type="submit">Submit</button>
    </form>
  );
};

export const FormSubmitHandlerData: React.FC<FormSubmitHandlerDataProps> = ({
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

export const FormSubmitHandlerValidation: React.FC<FormSubmitHandlerValidationProps> = ({
  initialName,
  initialEmail,
}): React.ReactElement => {
  const [message, setMessage] = React.useState<string>("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    const formData: FormData = new FormData(event.currentTarget);

    const name: FormDataEntryValue | null = formData.get("name");

    const email: FormDataEntryValue | null = formData.get("email");

    if (typeof name !== "string" || name.trim().length === 0) {
      setMessage("Name is required.");
      return;
    }

    if (typeof email !== "string" || !email.includes("@")) {
      setMessage("Enter a valid email address.");
      return;
    }

    setMessage("Form is ready to submit.");
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

      <button type="submit">Validate</button>

      {message !== "" && <p>{message}</p>}
    </form>
  );
};

export const FormSubmitHandlerAsync: React.FC<FormSubmitHandlerAsyncProps> = ({ initialName }): React.ReactElement => {
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    setIsSubmitting(true);

    await new Promise<void>((resolve: () => void): void => {
      window.setTimeout(resolve, 500);
    });

    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Name
        <input type="text" name="name" defaultValue={initialName} disabled={isSubmitting} />
      </label>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Submit"}
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
      <h1>Form Submit Handler</h1>

      <h2>1. Defining an onSubmit Handler</h2>
      <FormSubmitHandlerBasic initialName="John Doe" />

      <h2>2. currentTarget and target in a Submit Handler</h2>
      <FormSubmitHandlerTarget initialName="John Doe" />

      <h2>3. Reading FormData inside the Handler</h2>
      <FormSubmitHandlerData initialName="John Doe" initialEmail="john@example.com" />

      <h2>4. Validating Data inside the Handler</h2>
      <FormSubmitHandlerValidation initialName="John Doe" initialEmail="john@example.com" />

      <h2>5. Using an Asynchronous Submit Handler</h2>
      <FormSubmitHandlerAsync initialName="John Doe" />
    </main>
  );
};

export default MainContainer;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - A form submit handler is attached through the form's `onSubmit` prop.
// - `React.FormEvent<HTMLFormElement>` types the submit event for a form element.
// - `event.currentTarget` refers to the form whose `onSubmit` handler is executing.
// - `event.target` refers to the original event target and should not be treated as the form automatically.
// - `event.preventDefault()` prevents the browser's default navigation-based submission.
// - `FormData` can be created from `event.currentTarget` inside the submit handler.
// - Validation can occur inside the submit handler before application-specific submission logic runs.
// - An asynchronous submit handler can await an operation while tracking submission state.
// - Native constraint validation can prevent the submit event from reaching the handler.
// - The submit handler should coordinate submission behavior rather than relying on a button click handler alone.
