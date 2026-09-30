/**
 * Multiple Form Actions
 * ======================
 *
 * A form can expose multiple submit operations by assigning different action functions
 * to different submit buttons. Each submit button can therefore represent a distinct
 * server or client operation while sharing the same form controls and submitted FormData.
 *
 * Button-level `formAction` values override the form-level `action` for that submission.
 * The selected action receives the complete FormData associated with the submit operation,
 * including the successful controls and the submitter's own name/value when provided.
 */

import React from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

interface MultipleFormActionsProps {
  readonly onResult: (message: string) => void;
}

interface SaveActionProps {
  readonly onResult: (message: string) => void;
}

interface PublishActionProps {
  readonly onResult: (message: string) => void;
}

interface ArchiveActionProps {
  readonly onResult: (message: string) => void;
}

interface DefaultActionProps {
  readonly onResult: (message: string) => void;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * A form-level action provides the default operation for submit buttons
 * that do not specify their own `formAction`.
 */
export const MultipleFormActionsDefault: React.FC<DefaultActionProps> = ({ onResult }): React.ReactElement => {
  const defaultAction = (formData: FormData): void => {
    const title: FormDataEntryValue | null = formData.get("title");
    onResult(`Default action: ${String(title ?? "")}`);
  };

  return (
    <form action={defaultAction}>
      <input name="title" defaultValue="Document" />
      <button type="submit">Use default action</button>
    </form>
  );
};

/**
 * One button can define a dedicated action for saving the current form data.
 */
export const MultipleFormActionsSave: React.FC<SaveActionProps> = ({ onResult }): React.ReactElement => {
  const saveAction = (formData: FormData): void => {
    const title: FormDataEntryValue | null = formData.get("title");
    onResult(`Saved: ${String(title ?? "")}`);
  };

  return (
    <form>
      <input name="title" defaultValue="Draft" />
      <button type="submit" formAction={saveAction}>
        Save
      </button>
    </form>
  );
};

/**
 * A different submit button can use a different action while sharing
 * the same form controls.
 */
export const MultipleFormActionsPublish: React.FC<PublishActionProps> = ({ onResult }): React.ReactElement => {
  const publishAction = (formData: FormData): void => {
    const title: FormDataEntryValue | null = formData.get("title");
    onResult(`Published: ${String(title ?? "")}`);
  };

  return (
    <form>
      <input name="title" defaultValue="Draft" />
      <button type="submit" formAction={publishAction}>
        Publish
      </button>
    </form>
  );
};

/**
 * Multiple operations can coexist in one form. Each submit button selects
 * its own action, while all actions receive the same form data structure.
 */
export const MultipleFormActionsOperations: React.FC<ArchiveActionProps> = ({ onResult }): React.ReactElement => {
  const saveAction = (formData: FormData): void => {
    const title: FormDataEntryValue | null = formData.get("title");
    onResult(`Save: ${String(title ?? "")}`);
  };

  const publishAction = (formData: FormData): void => {
    const title: FormDataEntryValue | null = formData.get("title");
    onResult(`Publish: ${String(title ?? "")}`);
  };

  const archiveAction = (formData: FormData): void => {
    const title: FormDataEntryValue | null = formData.get("title");
    onResult(`Archive: ${String(title ?? "")}`);
  };

  return (
    <form>
      <input name="title" defaultValue="Project Report" />

      <button type="submit" formAction={saveAction}>
        Save
      </button>
      <button type="submit" formAction={publishAction}>
        Publish
      </button>
      <button type="submit" formAction={archiveAction}>
        Archive
      </button>
    </form>
  );
};

/**
 * A submit button can also contribute its own name/value pair to FormData.
 * This is useful when an action needs to inspect which submitter was used.
 */
export const MultipleFormActionsSubmitter: React.FC<MultipleFormActionsProps> = ({ onResult }): React.ReactElement => {
  const action = (formData: FormData): void => {
    const title: FormDataEntryValue | null = formData.get("title");
    const operation: FormDataEntryValue | null = formData.get("operation");

    onResult(`${String(operation ?? "Unknown")} "${String(title ?? "")}"`);
  };

  return (
    <form action={action}>
      <input name="title" defaultValue="Document" />

      <button type="submit" name="operation" value="Save">
        Save
      </button>
      <button type="submit" name="operation" value="Publish">
        Publish
      </button>
    </form>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const MultipleFormActions: React.FC = (): React.ReactElement => {
  const [result, setResult] = React.useState<string>("No action submitted yet.");

  const handleResult = (message: string): void => {
    setResult(message);
  };

  return (
    <div>
      <h1>Multiple Form Actions</h1>

      <h2>1. Default Form Action</h2>
      <MultipleFormActionsDefault onResult={handleResult} />

      <h2>2. Dedicated Save Action</h2>
      <MultipleFormActionsSave onResult={handleResult} />

      <h2>3. Dedicated Publish Action</h2>
      <MultipleFormActionsPublish onResult={handleResult} />

      <h2>4. Multiple Operations in One Form</h2>
      <MultipleFormActionsOperations onResult={handleResult} />

      <h2>5. Identifying the Submitter with FormData</h2>
      <MultipleFormActionsSubmitter onResult={handleResult} />

      <p>{result}</p>
    </div>
  );
};

export default MultipleFormActions;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - A form can support multiple operations through different submit buttons.
// - `formAction` lets an individual submit button override the form-level action.
// - All selected actions receive the submitted `FormData`.
// - Multiple buttons can share the same form controls while performing different operations.
// - A submit button's `name` and `value` can identify the selected operation in `FormData`.
// - Only the submit button that initiated submission contributes its successful name/value pair.
// - A button without `formAction` uses the form-level `action` when one is defined.
