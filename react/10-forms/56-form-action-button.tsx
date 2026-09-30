/**
 * Form Action Button
 * ==================
 *
 * A submit button can provide its own form action through the `formAction` prop, allowing
 * different submit buttons inside the same form to trigger different action functions.
 * Each action receives the submitted `FormData`, while the form's `action` remains the
 * default action for buttons that do not override it.
 *
 * The button-level action is selected by the submitter that initiated the form submission.
 * This makes it possible to implement operations such as "Save", "Publish", or "Delete"
 * within one form without manually inspecting which button was clicked.
 */

import React from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

interface FormActionButtonProps {
  readonly onResult: (message: string) => void;
}

interface FormActionButtonDefaultProps {
  readonly onResult: (message: string) => void;
}

interface FormActionButtonOverrideProps {
  readonly onResult: (message: string) => void;
}

interface FormActionButtonMultipleProps {
  readonly onResult: (message: string) => void;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * The default form action handles submissions from buttons that do not provide
 * their own `formAction`.
 */
export const FormActionButtonDefault: React.FC<FormActionButtonDefaultProps> = ({ onResult }): React.ReactElement => {
  const defaultAction = (formData: FormData): void => {
    const title: FormDataEntryValue | null = formData.get("title");
    onResult(`Default action: ${String(title ?? "")}`);
  };

  return (
    <form action={defaultAction}>
      <input name="title" defaultValue="Draft" />
      <button type="submit">Submit with default action</button>
    </form>
  );
};

/**
 * A submit button can override the form's default action by providing
 * its own `formAction` function.
 */
export const FormActionButtonOverride: React.FC<FormActionButtonOverrideProps> = ({ onResult }): React.ReactElement => {
  const formAction = (formData: FormData): void => {
    const title: FormDataEntryValue | null = formData.get("title");
    onResult(`Form action: ${String(title ?? "")}`);
  };

  const buttonAction = (formData: FormData): void => {
    const title: FormDataEntryValue | null = formData.get("title");
    onResult(`Button action: ${String(title ?? "")}`);
  };

  return (
    <form action={formAction}>
      <input name="title" defaultValue="Draft" />
      <button type="submit" formAction={buttonAction}>
        Submit with button action
      </button>
    </form>
  );
};

/**
 * Multiple submit buttons can provide different actions while sharing
 * the same form fields.
 */
export const FormActionButtonMultiple: React.FC<FormActionButtonMultipleProps> = ({ onResult }): React.ReactElement => {
  const saveAction = (formData: FormData): void => {
    const title: FormDataEntryValue | null = formData.get("title");
    onResult(`Save action: ${String(title ?? "")}`);
  };

  const publishAction = (formData: FormData): void => {
    const title: FormDataEntryValue | null = formData.get("title");
    onResult(`Publish action: ${String(title ?? "")}`);
  };

  const deleteAction = (formData: FormData): void => {
    const title: FormDataEntryValue | null = formData.get("title");
    onResult(`Delete action: ${String(title ?? "")}`);
  };

  return (
    <form>
      <input name="title" defaultValue="Document" />

      <button type="submit" formAction={saveAction}>
        Save
      </button>
      <button type="submit" formAction={publishAction}>
        Publish
      </button>
      <button type="submit" formAction={deleteAction}>
        Delete
      </button>
    </form>
  );
};

/**
 * A button action receives the same submitted `FormData` as a normal
 * form action, including values from the other controls in the form.
 */
export const FormActionButtonSharedData: React.FC<FormActionButtonProps> = ({ onResult }): React.ReactElement => {
  const archiveAction = (formData: FormData): void => {
    const title: FormDataEntryValue | null = formData.get("title");
    const category: FormDataEntryValue | null = formData.get("category");

    onResult(`Archive "${String(title ?? "")}" from "${String(category ?? "")}"`);
  };

  return (
    <form>
      <input name="title" defaultValue="Report" />
      <select name="category" defaultValue="documents">
        <option value="documents">Documents</option>
        <option value="reports">Reports</option>
      </select>

      <button type="submit" formAction={archiveAction}>
        Archive
      </button>
    </form>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const FormActionButton: React.FC = (): React.ReactElement => {
  const [result, setResult] = React.useState<string>("No action submitted yet.");

  const handleResult = (message: string): void => {
    setResult(message);
  };

  return (
    <div>
      <h1>Form Action Button</h1>

      <h2>1. Default Form Action</h2>
      <FormActionButtonDefault onResult={handleResult} />

      <h2>2. Button-Level Action Override</h2>
      <FormActionButtonOverride onResult={handleResult} />

      <h2>3. Multiple Buttons with Different Actions</h2>
      <FormActionButtonMultiple onResult={handleResult} />

      <h2>4. Shared FormData</h2>
      <FormActionButtonSharedData onResult={handleResult} />

      <p>{result}</p>
    </div>
  );
};

export default FormActionButton;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - `formAction` on a submit button can override the form's default `action`.
// - Each button-level action receives the submitted `FormData`.
// - Multiple submit buttons can perform different operations from one form.
// - Buttons without `formAction` use the form's default action when one exists.
// - The button action is selected by the submit button that initiates submission.
// - Button-level actions can read any successful form controls included in the submission.
// - Non-submit buttons should use `type="button"` so they do not trigger form submission.
