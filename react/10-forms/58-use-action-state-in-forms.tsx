/**
 * useActionState in Forms
 * =======================
 *
 * `useActionState` connects a form Action with React state, allowing an Action to return
 * the next state that should be exposed to the component. The hook returns the current
 * state, a form-compatible Action function, and a pending flag for the current submission.
 *
 * The Action receives the previous state and submitted FormData. Because the returned
 * Action is designed to be passed to a form's `action` prop, React manages submission
 * state and updates the component when the Action resolves with a new state.
 */

import React from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

interface ActionState {
  readonly message: string;
  readonly count: number;
}

interface ValidationState {
  readonly message: string;
  readonly error: string | null;
}

interface UseActionStateBasicProps {
  readonly onStateChange: (state: ActionState) => void;
}

interface UseActionStateValidationProps {
  readonly onStateChange: (state: ValidationState) => void;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * `useActionState` can track the value returned by a form Action.
 * The Action receives the previous state before processing FormData.
 */
export const UseActionStateBasic: React.FC<UseActionStateBasicProps> = ({ onStateChange }): React.ReactElement => {
  const action = (previousState: ActionState, formData: FormData): ActionState => {
    const name: FormDataEntryValue | null = formData.get("name");
    const nextState: ActionState = {
      message: `Hello, ${String(name ?? "Guest")}`,
      count: previousState.count + 1,
    };

    onStateChange(nextState);
    return nextState;
  };

  const [state, formAction, isPending] = React.useActionState<ActionState, FormData>(action, {
    message: "No submission yet.",
    count: 0,
  });

  return (
    <form action={formAction}>
      <input name="name" defaultValue="Ada" />
      <button type="submit" disabled={isPending}>
        {isPending ? "Submitting..." : "Submit"}
      </button>

      <p>{state.message}</p>
      <p>Submissions: {state.count}</p>
    </form>
  );
};

/**
 * The returned `formAction` replaces the original Action when attached to
 * the form. React uses it to connect the form submission to `useActionState`.
 */
export const UseActionStateFormAction: React.FC = (): React.ReactElement => {
  const action = (previousState: ActionState, formData: FormData): ActionState => {
    const value: FormDataEntryValue | null = formData.get("value");

    return {
      message: `Received: ${String(value ?? "")}`,
      count: previousState.count + 1,
    };
  };

  const [state, formAction] = React.useActionState<ActionState, FormData>(action, {
    message: "Waiting for submission.",
    count: 0,
  });

  return (
    <form action={formAction}>
      <input name="value" defaultValue="Example" />
      <button type="submit">Submit</button>

      <p>{state.message}</p>
      <p>Submissions: {state.count}</p>
    </form>
  );
};

/**
 * An Action can return validation state instead of performing a successful
 * operation. Returning an error keeps the result inside the same state flow.
 */
export const UseActionStateValidation: React.FC<UseActionStateValidationProps> = ({
  onStateChange,
}): React.ReactElement => {
  const action = (previousState: ValidationState, formData: FormData): ValidationState => {
    const email: FormDataEntryValue | null = formData.get("email");
    const value: string = String(email ?? "").trim();

    if (value === "") {
      const nextState: ValidationState = {
        message: "",
        error: "Email is required.",
      };

      onStateChange(nextState);
      return nextState;
    }

    if (!value.includes("@")) {
      const nextState: ValidationState = {
        message: "",
        error: "Enter a valid email address.",
      };

      onStateChange(nextState);
      return nextState;
    }

    const nextState: ValidationState = {
      message: `Submitted: ${value}`,
      error: null,
    };

    onStateChange(nextState);
    return nextState;
  };

  const [state, formAction, isPending] = React.useActionState<ValidationState, FormData>(action, {
    message: "",
    error: null,
  });

  return (
    <form action={formAction}>
      <input name="email" type="email" />

      <button type="submit" disabled={isPending}>
        {isPending ? "Checking..." : "Submit"}
      </button>

      {state.error !== null && <p>{state.error}</p>}
      {state.message !== "" && <p>{state.message}</p>}
    </form>
  );
};

/**
 * `isPending` is true while the current Action is executing. An asynchronous
 * Action can therefore expose submission progress without separate state.
 */
export const UseActionStatePending: React.FC = (): React.ReactElement => {
  const action = async (_previousState: ActionState, formData: FormData): Promise<ActionState> => {
    const value: FormDataEntryValue | null = formData.get("value");

    await new Promise<void>((resolve: () => void): void => {
      window.setTimeout(resolve, 1000);
    });

    return {
      message: `Finished: ${String(value ?? "")}`,
      count: 1,
    };
  };

  const [state, formAction, isPending] = React.useActionState<ActionState, FormData>(action, {
    message: "Waiting for submission.",
    count: 0,
  });

  return (
    <form action={formAction}>
      <input name="value" defaultValue="Async operation" />
      <button type="submit" disabled={isPending}>
        {isPending ? "Processing..." : "Run Action"}
      </button>

      <p>{state.message}</p>
    </form>
  );
};

/**
 * The initial state is used before the first submission. It is not a second
 * copy of the form state; it is simply the initial value exposed by the hook.
 */
export const UseActionStateInitialState: React.FC = (): React.ReactElement => {
  const action = (previousState: ActionState, _formData: FormData): ActionState => ({
    message: "Action completed.",
    count: previousState.count + 1,
  });

  const [state, formAction] = React.useActionState<ActionState, FormData>(action, {
    message: "Initial state.",
    count: 0,
  });

  return (
    <form action={formAction}>
      <button type="submit">Run Action</button>

      <p>{state.message}</p>
      <p>Count: {state.count}</p>
    </form>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const UseActionStateInForms: React.FC = (): React.ReactElement => {
  const [latestState, setLatestState] = React.useState<ActionState>({
    message: "No state update observed.",
    count: 0,
  });

  const [latestValidation, setLatestValidation] = React.useState<ValidationState>({
    message: "",
    error: null,
  });

  const handleStateChange = (state: ActionState): void => {
    setLatestState(state);
  };

  const handleValidationChange = (state: ValidationState): void => {
    setLatestValidation(state);
  };

  return (
    <div>
      <h1>useActionState in Forms</h1>

      <h2>1. Action State</h2>
      <UseActionStateBasic onStateChange={handleStateChange} />
      <p>Observed: {latestState.message}</p>

      <h2>2. Form Action Returned by the Hook</h2>
      <UseActionStateFormAction />

      <h2>3. Validation State</h2>
      <UseActionStateValidation onStateChange={handleValidationChange} />
      {latestValidation.error !== null && <p>Latest validation error: {latestValidation.error}</p>}

      <h2>4. Pending State</h2>
      <UseActionStatePending />

      <h2>5. Initial State</h2>
      <UseActionStateInitialState />
    </div>
  );
};

export default UseActionStateInForms;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - `useActionState` connects a form Action to React-managed state.
// - The Action receives the previous state and submitted `FormData`.
// - The hook returns `[state, formAction, isPending]`.
// - The returned `formAction` is passed to the form's `action` prop.
// - The Action's return value becomes the next state.
// - An Action can return validation errors or other application state.
// - `isPending` indicates that the current Action is still executing.
// - Asynchronous Actions can use `isPending` to represent submission progress.
// - The initial state is exposed before the first Action submission.
