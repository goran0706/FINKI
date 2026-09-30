/**
 * Pending Form State
 * ==================
 *
 * Form submissions can expose a pending state while an Action is executing.
 * React provides this state through `useActionState` for the component that owns
 * the Action, while `useFormStatus` provides the pending state to descendants
 * rendered inside the corresponding form.
 *
 * Pending state is transient: it is `true` only while the current submission is
 * being processed. It should be used for submission feedback and interaction
 * control rather than as a replacement for the form's actual application state.
 */

import React from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

interface PendingState {
  readonly message: string;
  readonly submitted: boolean;
}

interface PendingFormButtonProps {
  readonly label: string;
}

interface PendingFormIndicatorProps {
  readonly label: string;
}

interface PendingFormActionProps {
  readonly onComplete: (message: string) => void;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * A form Action can expose its pending state through the third value returned
 * by `useActionState`. The component that owns the Action can use it directly.
 */
export const PendingFormAction: React.FC<PendingFormActionProps> = ({ onComplete }): React.ReactElement => {
  const action = async (_previousState: PendingState, formData: FormData): Promise<PendingState> => {
    const value: FormDataEntryValue | null = formData.get("value");

    await new Promise<void>((resolve: () => void): void => {
      window.setTimeout(resolve, 1000);
    });

    const message: string = `Completed: ${String(value ?? "")}`;
    onComplete(message);

    return {
      message,
      submitted: true,
    };
  };

  const [state, formAction, isPending] = React.useActionState<PendingState, FormData>(action, {
    message: "Waiting for submission.",
    submitted: false,
  });

  return (
    <form action={formAction}>
      <input name="value" defaultValue="Example" />

      <button type="submit" disabled={isPending}>
        {isPending ? "Submitting..." : "Submit"}
      </button>

      <p>{isPending ? "Submission is pending." : state.message}</p>
    </form>
  );
};

/**
 * `useFormStatus` exposes the pending state to a descendant of the form.
 * This allows a reusable button to respond to its parent form's submission.
 */
export const PendingFormButton: React.FC<PendingFormButtonProps> = ({ label }): React.ReactElement => {
  const { pending } = React.useFormStatus();

  return (
    <button type="submit" disabled={pending}>
      {pending ? "Submitting..." : label}
    </button>
  );
};

/**
 * A separate descendant can display pending feedback without receiving
 * the pending state through props.
 */
export const PendingFormIndicator: React.FC<PendingFormIndicatorProps> = ({ label }): React.ReactElement => {
  const { pending } = React.useFormStatus();

  return <p aria-live="polite">{pending ? `${label} is processing.` : `${label} is ready.`}</p>;
};

/**
 * Pending state is transient. After the Action resolves, the form is no longer
 * pending and the Action's returned state becomes available.
 */
export const PendingFormLifecycle: React.FC = (): React.ReactElement => {
  const action = async (formData: FormData): Promise<void> => {
    const value: FormDataEntryValue | null = formData.get("value");

    await new Promise<void>((resolve: () => void): void => {
      window.setTimeout(resolve, 1500);
    });

    console.log(`Processed: ${String(value ?? "")}`);
  };

  return (
    <form action={action}>
      <input name="value" defaultValue="Lifecycle example" />

      <PendingFormIndicator label="Form" />
      <PendingFormButton label="Submit" />
    </form>
  );
};

/**
 * Disabling the submit button while pending prevents repeated submissions
 * from the same control during the current Action execution.
 */
export const PendingFormInteraction: React.FC = (): React.ReactElement => {
  const action = async (formData: FormData): Promise<void> => {
    const value: FormDataEntryValue | null = formData.get("value");

    await new Promise<void>((resolve: () => void): void => {
      window.setTimeout(resolve, 1000);
    });

    console.log(`Saved: ${String(value ?? "")}`);
  };

  return (
    <form action={action}>
      <input name="value" defaultValue="Save this value" />

      <PendingFormIndicator label="Save operation" />
      <PendingFormButton label="Save" />
    </form>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const PendingFormState: React.FC = (): React.ReactElement => {
  const [completedMessage, setCompletedMessage] = React.useState<string>("No Action has completed yet.");

  const handleComplete = (message: string): void => {
    setCompletedMessage(message);
  };

  return (
    <div>
      <h1>Pending Form State</h1>

      <h2>1. Action-Level Pending State</h2>
      <PendingFormAction onComplete={handleComplete} />
      <p>{completedMessage}</p>

      <h2>2. Pending Submit Button</h2>
      <PendingFormLifecycle />

      <h2>3. Pending Status Indicator</h2>
      <PendingFormInteraction />

      <h2>4. Pending State Across Form Descendants</h2>
      <form
        action={async (): Promise<void> => {
          await new Promise<void>((resolve: () => void): void => {
            window.setTimeout(resolve, 1000);
          });
        }}
      >
        <input name="value" defaultValue="Shared pending state" />
        <PendingFormIndicator label="Parent form" />
        <PendingFormButton label="Submit" />
      </form>
    </div>
  );
};

export default PendingFormState;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Pending form state represents an Action that is currently being processed.
// - `useActionState` exposes pending state as the third value returned by the hook.
// - `useFormStatus` exposes `pending` to components rendered inside the corresponding form.
// - Pending state is transient and ends when the current Action finishes.
// - Submit controls can use pending state to prevent repeated submissions.
// - Descendant components can display pending feedback without receiving pending state through props.
// - Pending state describes submission activity; it is not a replacement for application data state.
