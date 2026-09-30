/**
 * useActionState
 * ==============
 *
 * `useActionState` manages state produced by an Action. The Hook returns the
 * current state, a dispatch function for invoking the Action, and a pending
 * flag. The Action receives the previous state as its first argument and the
 * dispatched payload as its second argument, then returns the next state.
 *
 * Unlike a `useReducer` reducer, the function passed to `useActionState` may
 * be asynchronous and may perform side effects. React queues dispatched
 * Actions so that each Action receives the result of the previous Action as
 * its previous state.
 *
 * When the returned dispatch function is supplied directly to a form's
 * `action` prop, React treats form submission as an Action and manages the
 * associated transition. The Action receives the submitted `FormData`.
 *
 * The third return value, `isPending`, indicates whether an Action dispatched
 * through this Hook is still pending. It can be used to disable controls,
 * display progress, or prevent duplicate user interactions.
 *
 * The optional `permalink` argument is intended for progressive enhancement
 * with Server Functions and React Server Components. It is not required for
 * ordinary client-side usage.
 *
 * A common misconception is that `useActionState` is simply an asynchronous
 * version of `useReducer`. Both reduce a previous value into a next value,
 * but `useReducer` requires a pure reducer while `useActionState` is designed
 * for Actions that can perform side effects and participate in transitions.
 */

import { type ActionDispatch, type FC, type ReactNode, useActionState } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface ActionState {
  readonly status: "idle" | "success" | "error";
  readonly message: string;
}

export interface ActionStateFormProps {
  readonly initialMessage: string;
}

export interface ValidationActionState {
  readonly value: string;
  readonly error: string | null;
}

export interface ValidationActionStateProps {
  readonly initialValue: string;
}

export interface AsyncActionState {
  readonly count: number;
  readonly message: string;
}

export interface AsyncActionStateProps {
  readonly initialCount: number;
}

export interface ActionPayloadState {
  readonly lastAction: string;
  readonly total: number;
}

export interface ActionPayloadStateProps {
  readonly initialTotal: number;
}

export interface ActionStateComparisonProps {
  readonly initialCount: number;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * Demonstrates the basic form integration. Passing the action returned by
 * `useActionState` directly to the form lets React provide the submitted
 * `FormData` to the Action and expose its returned state to the component.
 */
export const BasicActionStateExample: FC<ActionStateFormProps> = ({
  initialMessage,
}: ActionStateFormProps): ReactNode => {
  const initialState: ActionState = {
    status: "idle",
    message: initialMessage,
  };

  const submitAction = async (previousState: ActionState, formData: FormData): Promise<ActionState> => {
    const nameValue: FormDataEntryValue | null = formData.get("name");
    const name: string = typeof nameValue === "string" ? nameValue.trim() : "";

    if (name.length === 0) {
      return {
        status: "error",
        message: "A name is required.",
      };
    }

    return {
      status: "success",
      message: `Hello, ${name}.`,
    };
  };

  const [state, formAction, isPending]: [ActionState, ActionDispatch<FormData>, boolean] = useActionState(
    submitAction,
    initialState,
  );

  return (
    <section>
      <h3>Basic Action state</h3>

      <form action={formAction}>
        <label>
          Name
          <input name="name" defaultValue="John Doe" />
        </label>

        <button type="submit" disabled={isPending}>
          {isPending ? "Submitting..." : "Submit"}
        </button>
      </form>

      <p>{state.message}</p>
    </section>
  );
};

/**
 * Demonstrates the pending flag returned by `useActionState`. The Action
 * deliberately waits before returning so the UI can expose the pending
 * transition to the user.
 */
export const PendingActionStateExample: FC = (): ReactNode => {
  const initialState: AsyncActionState = {
    count: 0,
    message: "Ready",
  };

  const incrementAction = async (previousState: AsyncActionState, _formData: FormData): Promise<AsyncActionState> => {
    await new Promise<void>((resolve): void => {
      window.setTimeout(resolve, 500);
    });

    return {
      count: previousState.count + 1,
      message: "Update completed.",
    };
  };

  const [state, formAction, isPending]: [AsyncActionState, ActionDispatch<FormData>, boolean] = useActionState(
    incrementAction,
    initialState,
  );

  return (
    <section>
      <h3>Pending Action state</h3>

      <form action={formAction}>
        <button type="submit" disabled={isPending}>
          {isPending ? "Updating..." : "Increment"}
        </button>
      </form>

      <p>Count: {state.count}</p>
      <p>{state.message}</p>
    </section>
  );
};

/**
 * Demonstrates returning validation failures as ordinary Action state. Known
 * validation problems can be represented by the returned state rather than
 * being thrown as exceptions.
 */
export const ValidationActionStateExample: FC<ValidationActionStateProps> = ({
  initialValue,
}: ValidationActionStateProps): ReactNode => {
  const initialState: ValidationActionState = {
    value: initialValue,
    error: null,
  };

  const validateAction = (_previousState: ValidationActionState, formData: FormData): ValidationActionState => {
    const valueEntry: FormDataEntryValue | null = formData.get("value");
    const value: string = typeof valueEntry === "string" ? valueEntry.trim() : "";

    if (value.length < 3) {
      return {
        value,
        error: "Enter at least three characters.",
      };
    }

    return {
      value,
      error: null,
    };
  };

  const [state, formAction, isPending]: [ValidationActionState, ActionDispatch<FormData>, boolean] = useActionState(
    validateAction,
    initialState,
  );

  return (
    <section>
      <h3>Action validation state</h3>

      <form action={formAction}>
        <label>
          Value
          <input name="value" defaultValue={initialValue} />
        </label>

        <button type="submit" disabled={isPending}>
          Validate
        </button>
      </form>

      {state.error !== null ? <p role="alert">{state.error}</p> : <p>Valid value: {state.value}</p>}
    </section>
  );
};

/**
 * Demonstrates passing an explicit payload to an Action through a form.
 * Multiple submit buttons can use the same Action while providing different
 * values through their named form fields.
 */
export const ActionPayloadExample: FC<ActionPayloadStateProps> = ({
  initialTotal,
}: ActionPayloadStateProps): ReactNode => {
  const initialState: ActionPayloadState = {
    lastAction: "None",
    total: initialTotal,
  };

  const updateAction = (previousState: ActionPayloadState, formData: FormData): ActionPayloadState => {
    const amountEntry: FormDataEntryValue | null = formData.get("amount");
    const labelEntry: FormDataEntryValue | null = formData.get("label");

    const amountText: string = typeof amountEntry === "string" ? amountEntry : "0";
    const label: string = typeof labelEntry === "string" ? labelEntry : "Unknown";

    const amount: number = Number(amountText);

    if (!Number.isFinite(amount)) {
      return previousState;
    }

    return {
      lastAction: label,
      total: previousState.total + amount,
    };
  };

  const [state, formAction, isPending]: [ActionPayloadState, ActionDispatch<FormData>, boolean] = useActionState(
    updateAction,
    initialState,
  );

  return (
    <section>
      <h3>Action payloads</h3>

      <form action={formAction}>
        <button type="submit" name="label" value="Added one" disabled={isPending} formAction={formAction}>
          Add 1
        </button>

        <button type="submit" name="label" value="Added ten" disabled={isPending} formAction={formAction}>
          Add 10
        </button>

        <input type="hidden" name="amount" value="1" />
      </form>

      <p>Total: {state.total}</p>
      <p>Last action: {state.lastAction}</p>
    </section>
  );
};

/**
 * Demonstrates that an Action can receive a value derived from submitted
 * form data while preserving the previous state. The previous state is the
 * result returned by the most recent completed Action.
 */
export const SequentialActionStateExample: FC = (): ReactNode => {
  const initialState: AsyncActionState = {
    count: 0,
    message: "No actions completed.",
  };

  const incrementAction = async (previousState: AsyncActionState, _formData: FormData): Promise<AsyncActionState> => {
    await new Promise<void>((resolve): void => {
      window.setTimeout(resolve, 300);
    });

    const nextCount: number = previousState.count + 1;

    return {
      count: nextCount,
      message: `Completed action ${nextCount}.`,
    };
  };

  const [state, formAction, isPending]: [AsyncActionState, ActionDispatch<FormData>, boolean] = useActionState(
    incrementAction,
    initialState,
  );

  return (
    <section>
      <h3>Sequential Action state</h3>

      <form action={formAction}>
        <button type="submit" disabled={isPending}>
          Queue action
        </button>
      </form>

      <p>Completed actions: {state.count}</p>
      <p>{state.message}</p>
    </section>
  );
};

/**
 * Demonstrates a common misconception by displaying an invalid side-effect
 * pattern for `useReducer`. The example is text only so the invalid pattern
 * is never executed.
 */
export const ActionStateVsReducerExample: FC<ActionStateComparisonProps> = ({
  initialCount,
}: ActionStateComparisonProps): ReactNode => {
  const reducerComparison: string = `
// useReducer reducers must remain pure.
const reducer = async (state, action) => {
  await saveToServer(action);
  return state;
};

// useActionState Actions may perform asynchronous side effects.
const action = async (previousState, formData) => {
  await saveToServer(formData);
  return nextState;
};
`;

  return (
    <section>
      <h3>Action state versus reducer state</h3>
      <p>Initial reducer comparison value: {initialCount}</p>
      <pre>{reducerComparison}</pre>
    </section>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const UseActionStateContainer: FC = (): ReactNode => {
  return (
    <main>
      <h1>useActionState</h1>

      <h2>1. Managing state returned from a form Action</h2>
      <BasicActionStateExample initialMessage="Enter a name to continue." />

      <h2>2. Tracking an asynchronous Action with isPending</h2>
      <PendingActionStateExample />

      <h2>3. Returning validation errors as Action state</h2>
      <ValidationActionStateExample initialValue="John Doe" />

      <h2>4. Reading submitted Action payloads</h2>
      <ActionPayloadExample initialTotal={0} />

      <h2>5. Processing Actions sequentially</h2>
      <SequentialActionStateExample />

      <h2>6. Understanding Action state versus reducer state</h2>
      <ActionStateVsReducerExample initialCount={0} />
    </main>
  );
};

export default UseActionStateContainer;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - `useActionState` manages state produced by an Action.
// - It returns the current state, an Action dispatcher, and an `isPending` flag.
// - An Action receives previous state followed by its dispatched payload.
// - Form Actions receive submitted `FormData` when used as a form `action`.
// - Actions can be asynchronous and can perform side effects.
// - React queues multiple dispatched Actions and passes each result forward.
// - Known validation failures can be returned as state rather than thrown.
// - `isPending` can provide feedback while an Action is being processed.
// - `useActionState` differs from `useReducer` because its Action can perform side effects.
