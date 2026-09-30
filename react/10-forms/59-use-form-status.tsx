/**
 * useFormStatus
 * =============
 *
 * `useFormStatus` provides the status of the nearest parent form submission to a component
 * rendered inside that form. It exposes information such as whether the form is pending,
 * the submitted FormData, the HTTP method, and the action associated with the submission.
 *
 * The hook does not track the form from the component that renders the `<form>` itself.
 * It must be called by a descendant component so React can associate it with the nearest
 * parent form. This makes it useful for reusable submit buttons, loading indicators,
 * and components that need to inspect the current submission without owning form state.
 */

import React from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

interface FormStatusButtonProps {
  readonly label: string;
}

interface FormStatusIndicatorProps {
  readonly label: string;
}

interface FormStatusDataProps {
  readonly fieldName: string;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * A submit button can read the pending state of its nearest parent form.
 * The component itself does not need to receive `isPending` as a prop.
 */
export const FormStatusButton: React.FC<FormStatusButtonProps> = ({ label }): React.ReactElement => {
  const { pending } = React.useFormStatus();

  return (
    <button type="submit" disabled={pending}>
      {pending ? "Submitting..." : label}
    </button>
  );
};

/**
 * Any descendant of the form can read its pending status. This is useful for
 * displaying submission feedback independently from the submit button.
 */
export const FormStatusIndicator: React.FC<FormStatusIndicatorProps> = ({ label }): React.ReactElement => {
  const { pending } = React.useFormStatus();

  return <p aria-live="polite">{pending ? `${label} is submitting...` : `${label} is ready.`}</p>;
};

/**
 * `data` contains the FormData associated with the current submission while
 * the form is pending. Before submission, `data` is null.
 */
export const FormStatusData: React.FC<FormStatusDataProps> = ({ fieldName }): React.ReactElement => {
  const { data, pending } = React.useFormStatus();

  if (!pending || data === null) {
    return <p>No active form submission.</p>;
  }

  const value: FormDataEntryValue | null = data.get(fieldName);

  return <p>Submitted value: {String(value ?? "")}</p>;
};

/**
 * `useFormStatus` also exposes the method associated with the current form
 * submission. The value is normally "get" or "post".
 */
export const FormStatusMethod: React.FC = (): React.ReactElement => {
  const { method, pending } = React.useFormStatus();

  return <p>{pending ? `Submitting with method: ${method}` : `Form method: ${method}`}</p>;
};

/**
 * The `action` property identifies the action associated with the current
 * submission. It can be a URL or a function when using React form Actions.
 */
export const FormStatusAction: React.FC = (): React.ReactElement => {
  const { action, pending } = React.useFormStatus();

  if (!pending) {
    return <p>No active form action.</p>;
  }

  return <p>{typeof action === "function" ? "Submitting with a function action." : `Submitting to: ${action}`}</p>;
};

/**
 * Calling `useFormStatus` in the component that owns the form does not provide
 * that form's submission status. The hook observes a parent form, so a child
 * component must be used when status information is required.
 */
export const FormStatusChildBoundary: React.FC = (): React.ReactElement => {
  const action = async (formData: FormData): Promise<void> => {
    const value: FormDataEntryValue | null = formData.get("value");

    await new Promise<void>((resolve: () => void): void => {
      window.setTimeout(resolve, 1000);
    });

    console.log(`Submitted: ${String(value ?? "")}`);
  };

  return (
    <form action={action}>
      <input name="value" defaultValue="Example" />

      <FormStatusButton label="Submit" />
      <FormStatusIndicator label="Form" />
    </form>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const UseFormStatus: React.FC = (): React.ReactElement => {
  const action = async (formData: FormData): Promise<void> => {
    const value: FormDataEntryValue | null = formData.get("value");

    await new Promise<void>((resolve: () => void): void => {
      window.setTimeout(resolve, 1000);
    });

    console.log(`Processed: ${String(value ?? "")}`);
  };

  return (
    <div>
      <h1>useFormStatus</h1>

      <h2>1. Pending Submit Button</h2>
      <form action={action}>
        <input name="value" defaultValue="Submit button example" />
        <FormStatusButton label="Submit" />
      </form>

      <h2>2. Pending Status Indicator</h2>
      <form action={action}>
        <input name="value" defaultValue="Status example" />
        <FormStatusIndicator label="Form" />
        <FormStatusButton label="Submit" />
      </form>

      <h2>3. Submitted FormData</h2>
      <form action={action}>
        <input name="value" defaultValue="FormData example" />
        <FormStatusData fieldName="value" />
        <FormStatusButton label="Submit" />
      </form>

      <h2>4. Submission Method</h2>
      <form action={action} method="post">
        <input name="value" defaultValue="Method example" />
        <FormStatusMethod />
        <FormStatusButton label="Submit" />
      </form>

      <h2>5. Current Form Action</h2>
      <form action={action}>
        <input name="value" defaultValue="Action example" />
        <FormStatusAction />
        <FormStatusButton label="Submit" />
      </form>

      <h2>6. Hook Must Observe a Parent Form</h2>
      <FormStatusChildBoundary />
    </div>
  );
};

export default UseFormStatus;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - `useFormStatus` reads the status of the nearest parent form.
// - It must be called from a component rendered inside the form.
// - `pending` indicates whether the parent form is currently submitting.
// - `data` contains the current submission's `FormData` while the form is pending.
// - `method` exposes the submission method associated with the form.
// - `action` exposes the current form action.
// - The hook is useful for reusable submit buttons and submission indicators.
// - Calling `useFormStatus` directly in the component that renders the form does not observe that same form.
// - `data` is `null` when there is no active submission.
