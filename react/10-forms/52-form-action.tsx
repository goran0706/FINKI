/**
 * Form Action
 * ===========
 *
 * React 19 allows the `action` prop of a `<form>` to receive a function instead of only a URL.
 * React calls that function with the submitted `FormData`, allowing form submission logic to be
 * expressed directly as an Action without manually handling the submit event or calling
 * `preventDefault()`.
 *
 * A function passed to `action` runs as a React Action. React manages the submission as a
 * Transition, and when the Action completes successfully, uncontrolled form fields are reset.
 * The Action can be synchronous or asynchronous, and the submitted `FormData` contains controls
 * that have a `name` attribute and participate in the form submission.
 */

import React from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface FormActionBasicProps {
  readonly initialName: string;
}

export interface FormActionAsyncProps {
  readonly initialEmail: string;
}

export interface FormActionMultipleProps {
  readonly initialMessage: string;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

export const FormActionBasic: React.FC<FormActionBasicProps> = ({ initialName }): React.ReactElement => {
  const [submittedName, setSubmittedName] = React.useState<string>("");

  const handleAction = (formData: FormData): void => {
    const name: FormDataEntryValue | null = formData.get("name");

    if (typeof name !== "string") {
      setSubmittedName("No name was submitted.");
      return;
    }

    setSubmittedName(`Submitted name: ${name}`);
  };

  return (
    <div>
      <form action={handleAction}>
        <label>
          Name
          <input type="text" name="name" defaultValue={initialName} />
        </label>

        <button type="submit">Submit</button>
      </form>

      {submittedName !== "" && <p role="status">{submittedName}</p>}
    </div>
  );
};

export const FormActionAsync: React.FC<FormActionAsyncProps> = ({ initialEmail }): React.ReactElement => {
  const [message, setMessage] = React.useState<string>("");

  const handleAction = async (formData: FormData): Promise<void> => {
    const email: FormDataEntryValue | null = formData.get("email");

    if (typeof email !== "string" || email.trim() === "") {
      setMessage("An email address is required.");
      return;
    }

    setMessage(`Preparing submission for ${email}...`);

    await new Promise<void>((resolve: () => void): void => {
      window.setTimeout(resolve, 500);
    });

    setMessage(`Submitted: ${email}`);
  };

  return (
    <div>
      <form action={handleAction}>
        <label>
          Email
          <input type="email" name="email" defaultValue={initialEmail} />
        </label>

        <button type="submit">Subscribe</button>
      </form>

      {message !== "" && <p role="status">{message}</p>}
    </div>
  );
};

export const FormActionMultiple: React.FC<FormActionMultipleProps> = ({ initialMessage }): React.ReactElement => {
  const [result, setResult] = React.useState<string>("");

  const sendMessage = (formData: FormData): void => {
    const message: FormDataEntryValue | null = formData.get("message");

    if (typeof message !== "string") {
      setResult("No message was submitted.");
      return;
    }

    setResult(`Published: ${message}`);
  };

  const saveDraft = (formData: FormData): void => {
    const message: FormDataEntryValue | null = formData.get("message");

    if (typeof message !== "string") {
      setResult("No message was submitted.");
      return;
    }

    setResult(`Draft saved: ${message}`);
  };

  return (
    <div>
      <form action={sendMessage}>
        <label>
          Message
          <textarea name="message" defaultValue={initialMessage} rows={4} />
        </label>

        <button type="submit" name="intent" value="publish">
          Publish
        </button>

        <button type="submit" formAction={saveDraft} name="intent" value="save">
          Save draft
        </button>
      </form>

      {result !== "" && <p role="status">{result}</p>}
    </div>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const MainContainer: React.FC = (): React.ReactElement => {
  return (
    <main>
      <h1>Form Action</h1>

      <h2>1. Handling FormData with the Form Action</h2>
      <FormActionBasic initialName="" />

      <h2>2. Using an Async Form Action</h2>
      <FormActionAsync initialEmail="" />

      <h2>3. Using Different Actions for Different Submit Buttons</h2>
      <FormActionMultiple initialMessage="" />
    </main>
  );
};

export default MainContainer;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - React 19 allows a function to be passed directly to a form's `action` prop.
// - A form Action receives the submitted `FormData` as its argument.
// - An Action can be synchronous or asynchronous.
// - `FormData.get()` retrieves the submitted value associated with a control's `name`.
// - Form controls generally need a `name` attribute to contribute their values to `FormData`.
// - A function passed to `action` runs as a React Action rather than as a conventional `onSubmit` handler.
// - An Action does not require `event.preventDefault()` because React handles the form submission.
// - After a successful Action, React automatically resets uncontrolled form controls.
// - A button can override the parent form Action with its `formAction` prop.
// - `formAction` allows one form to support different submission operations such as publishing and saving a draft.
// - A function passed to `action` or `formAction` uses POST semantics regardless of the form's `method` value.
// - Form Actions are distinct from Server Functions; a regular client-side function can also be used as a form Action.
