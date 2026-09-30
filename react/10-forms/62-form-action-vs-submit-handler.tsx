/**
 * Form Action vs. Submit Handler
 * ==============================
 *
 * React forms can be handled either through a form Action or through the traditional
 * `onSubmit` event handler. A form Action receives the submitted `FormData` directly,
 * while an `onSubmit` handler receives a React form event and must extract the form data
 * from the event's current target.
 *
 * These approaches have different execution models. Form Actions integrate with React's
 * form submission lifecycle, including pending state and Action hooks, while `onSubmit`
 * provides direct event-level control over the browser submission event.
 */

import React from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

interface FormActionComparisonProps {
  readonly onResult: (message: string) => void;
}

interface SubmitHandlerComparisonProps {
  readonly onResult: (message: string) => void;
}

interface FormActionAsyncProps {
  readonly onResult: (message: string) => void;
}

interface SubmitHandlerAsyncProps {
  readonly onResult: (message: string) => void;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * A form Action receives FormData directly. React invokes the Action as part
 * of the form submission lifecycle.
 */
export const FormActionComparison: React.FC<FormActionComparisonProps> = ({ onResult }): React.ReactElement => {
  const action = (formData: FormData): void => {
    const value: FormDataEntryValue | null = formData.get("value");

    onResult(`Form Action received: ${String(value ?? "")}`);
  };

  return (
    <form action={action}>
      <input name="value" defaultValue="Action submission" />
      <button type="submit">Submit with Action</button>
    </form>
  );
};

/**
 * An `onSubmit` handler receives the React form event. FormData must be
 * constructed explicitly from the event's currentTarget.
 */
export const SubmitHandlerComparison: React.FC<SubmitHandlerComparisonProps> = ({ onResult }): React.ReactElement => {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    const formData: FormData = new FormData(event.currentTarget);
    const value: FormDataEntryValue | null = formData.get("value");

    onResult(`Submit handler received: ${String(value ?? "")}`);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="value" defaultValue="Submit event" />
      <button type="submit">Submit with Handler</button>
    </form>
  );
};

/**
 * Form Actions can be asynchronous. React tracks the Action as part of the
 * form submission lifecycle, allowing it to work with Action-specific hooks.
 */
export const FormActionAsyncComparison: React.FC<FormActionAsyncProps> = ({ onResult }): React.ReactElement => {
  const action = async (formData: FormData): Promise<void> => {
    const value: FormDataEntryValue | null = formData.get("value");

    await new Promise<void>((resolve: () => void): void => {
      window.setTimeout(resolve, 1000);
    });

    onResult(`Async Action completed: ${String(value ?? "")}`);
  };

  return (
    <form action={action}>
      <input name="value" defaultValue="Async Action" />
      <button type="submit">Run Async Action</button>
    </form>
  );
};

/**
 * An `onSubmit` handler can also perform asynchronous work, but the event
 * handler itself is responsible for preventing the browser's native submit.
 */
export const SubmitHandlerAsyncComparison: React.FC<SubmitHandlerAsyncProps> = ({ onResult }): React.ReactElement => {
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();

    const formData: FormData = new FormData(event.currentTarget);
    const value: FormDataEntryValue | null = formData.get("value");

    await new Promise<void>((resolve: () => void): void => {
      window.setTimeout(resolve, 1000);
    });

    onResult(`Async handler completed: ${String(value ?? "")}`);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="value" defaultValue="Async handler" />
      <button type="submit">Run Async Handler</button>
    </form>
  );
};

/**
 * A submit handler receives the browser event and can inspect submit-specific
 * information before deciding whether to prevent or continue submission.
 */
export const SubmitHandlerEventControl: React.FC = (): React.ReactElement => {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    const formData: FormData = new FormData(event.currentTarget);
    const value: FormDataEntryValue | null = formData.get("value");

    console.log(`Handled submit event: ${String(value ?? "")}`);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="value" defaultValue="Event control" />
      <button type="submit">Handle Event</button>
    </form>
  );
};

/**
 * Form Actions can return application state when combined with
 * `useActionState`, whereas a traditional submit handler has no equivalent
 * built-in Action-state return value.
 */
export const FormActionStateComparison: React.FC = (): React.ReactElement => {
  interface State {
    readonly message: string;
    readonly count: number;
  }

  const action = (previousState: State, formData: FormData): State => {
    const value: FormDataEntryValue | null = formData.get("value");

    return {
      message: `Processed: ${String(value ?? "")}`,
      count: previousState.count + 1,
    };
  };

  const [state, formAction] = React.useActionState<State, FormData>(action, {
    message: "No Action submitted.",
    count: 0,
  });

  return (
    <form action={formAction}>
      <input name="value" defaultValue="Action state" />
      <button type="submit">Submit</button>

      <p>{state.message}</p>
      <p>Submissions: {state.count}</p>
    </form>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const FormActionVsSubmitHandler: React.FC = (): React.ReactElement => {
  const [result, setResult] = React.useState<string>("No submission processed yet.");

  const handleResult = (message: string): void => {
    setResult(message);
  };

  return (
    <div>
      <h1>Form Action vs. Submit Handler</h1>

      <h2>1. Form Action</h2>
      <FormActionComparison onResult={handleResult} />

      <h2>2. onSubmit Handler</h2>
      <SubmitHandlerComparison onResult={handleResult} />

      <h2>3. Asynchronous Form Action</h2>
      <FormActionAsyncComparison onResult={handleResult} />

      <h2>4. Asynchronous Submit Handler</h2>
      <SubmitHandlerAsyncComparison onResult={handleResult} />

      <h2>5. Submit Event Control</h2>
      <SubmitHandlerEventControl />

      <h2>6. Action State</h2>
      <FormActionStateComparison />

      <p>{result}</p>
    </div>
  );
};

export default FormActionVsSubmitHandler;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - A form Action receives submitted `FormData` directly.
// - An `onSubmit` handler receives a React form event and can construct `FormData` from `event.currentTarget`.
// - An `onSubmit` handler normally calls `preventDefault()` when handling submission entirely in React.
// - Form Actions integrate with React's form submission lifecycle.
// - `useActionState` can connect a Form Action to returned application state and pending state.
// - `onSubmit` provides direct access to the submission event and explicit event-level control.
// - Both approaches can perform synchronous or asynchronous work.
// - The appropriate approach depends on whether the form needs React Action integration or direct event handling.
