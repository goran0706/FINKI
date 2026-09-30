/**
 * Form Action Reset
 * ==================
 *
 * React form Actions have built-in reset behavior for uncontrolled form controls. After a form
 * Action completes successfully, React resets the uncontrolled fields that participated in the
 * submission, while controlled inputs remain driven by their React state.
 *
 * Reset behavior therefore depends on how the form field is managed. An uncontrolled field can be
 * reset by the form Action lifecycle, whereas a controlled field must have its state updated
 * explicitly if the application wants its displayed value cleared after submission.
 */

import React from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface FormActionResetUncontrolledProps {
  readonly initialName: string;
}

export interface FormActionResetControlledProps {
  readonly initialMessage: string;
}

export interface FormActionResetManualProps {
  readonly initialTitle: string;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

export const FormActionResetUncontrolled: React.FC<FormActionResetUncontrolledProps> = ({
  initialName,
}): React.ReactElement => {
  const [submittedName, setSubmittedName] = React.useState<string>("");

  const handleAction = async (formData: FormData): Promise<void> => {
    const name: FormDataEntryValue | null = formData.get("name");

    if (typeof name !== "string" || name.trim() === "") {
      return;
    }

    await new Promise<void>((resolve: () => void): void => {
      window.setTimeout(resolve, 500);
    });

    setSubmittedName(`Submitted: ${name}`);
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

export const FormActionResetControlled: React.FC<FormActionResetControlledProps> = ({
  initialMessage,
}): React.ReactElement => {
  const [message, setMessage] = React.useState<string>(initialMessage);
  const [submittedMessage, setSubmittedMessage] = React.useState<string>("");

  const handleAction = async (formData: FormData): Promise<void> => {
    const submittedValue: FormDataEntryValue | null = formData.get("message");

    if (typeof submittedValue !== "string" || submittedValue.trim() === "") {
      return;
    }

    await new Promise<void>((resolve: () => void): void => {
      window.setTimeout(resolve, 500);
    });

    setSubmittedMessage(submittedValue);

    // A controlled input is reset by updating the state that controls its value.
    setMessage("");
  };

  return (
    <div>
      <form action={handleAction}>
        <label>
          Message
          <textarea
            name="message"
            value={message}
            onChange={(event: React.ChangeEvent<HTMLTextAreaElement>): void => {
              setMessage(event.target.value);
            }}
            rows={4}
          />
        </label>

        <button type="submit">Submit</button>
      </form>

      {submittedMessage !== "" && <p role="status">Submitted: {submittedMessage}</p>}
    </div>
  );
};

export const FormActionResetManual: React.FC<FormActionResetManualProps> = ({ initialTitle }): React.ReactElement => {
  const formRef = React.useRef<HTMLFormElement | null>(null);

  const [submittedTitle, setSubmittedTitle] = React.useState<string>("");

  const handleAction = (formData: FormData): void => {
    const title: FormDataEntryValue | null = formData.get("title");

    if (typeof title !== "string" || title.trim() === "") {
      return;
    }

    setSubmittedTitle(`Saved: ${title}`);

    // `HTMLFormElement.reset()` resets the form's controls to their default values.
    formRef.current?.reset();
  };

  return (
    <div>
      <form ref={formRef} action={handleAction}>
        <label>
          Title
          <input type="text" name="title" defaultValue={initialTitle} />
        </label>

        <button type="submit">Save</button>

        <button
          type="button"
          onClick={(): void => {
            formRef.current?.reset();
          }}
        >
          Reset
        </button>
      </form>

      {submittedTitle !== "" && <p role="status">{submittedTitle}</p>}
    </div>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const MainContainer: React.FC = (): React.ReactElement => {
  return (
    <main>
      <h1>Form Action Reset</h1>

      <h2>1. Resetting Uncontrolled Fields After a Form Action</h2>
      <FormActionResetUncontrolled initialName="" />

      <h2>2. Resetting a Controlled Field Through React State</h2>
      <FormActionResetControlled initialMessage="" />

      <h2>3. Manually Resetting an Uncontrolled Form</h2>
      <FormActionResetManual initialTitle="" />
    </main>
  );
};

export default MainContainer;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - React form Actions automatically reset uncontrolled form fields after a successful Action.
// - Uncontrolled fields use their DOM state, so React can reset them as part of the Action lifecycle.
// - Controlled fields are driven by React state and must be cleared by updating that state.
// - `defaultValue` establishes the initial value of an uncontrolled control and also determines the value restored by a native form reset.
// - `HTMLFormElement.reset()` resets form controls to their default values.
// - A native form reset does not clear React state that controls an input's `value`.
// - A manual reset button must use `type="button"` so it does not submit the form.
// - Validation failures that return early from an Action should not be treated as successful submission.
// - Resetting a form and clearing application state are separate operations and may both be necessary in a mixed controlled/uncontrolled form.
