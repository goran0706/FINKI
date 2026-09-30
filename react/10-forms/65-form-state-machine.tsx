/**
 * Form State Machine
 * ==================
 *
 * A form state machine models a form as a finite set of explicit states and
 * transitions between those states. Instead of independently managing several
 * booleans such as `isSubmitting`, `hasError`, and `isSuccess`, one discriminated
 * union can describe which state the form is currently in and which data is valid
 * for that state.
 *
 * `useReducer` is well suited to this pattern because every state transition is
 * centralized in a reducer. A discriminated union makes invalid state combinations
 * difficult to represent and allows TypeScript to narrow the state based on its
 * `status` discriminator.
 */

import React from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

interface FormValues {
  readonly name: string;
  readonly email: string;
}

interface IdleFormState {
  readonly status: "idle";
  readonly values: FormValues;
}

interface EditingFormState {
  readonly status: "editing";
  readonly values: FormValues;
}

interface SubmittingFormState {
  readonly status: "submitting";
  readonly values: FormValues;
}

interface SuccessFormState {
  readonly status: "success";
  readonly values: FormValues;
  readonly message: string;
}

interface ErrorFormState {
  readonly status: "error";
  readonly values: FormValues;
  readonly message: string;
}

type FormState = IdleFormState | EditingFormState | SubmittingFormState | SuccessFormState | ErrorFormState;

type FormAction =
  | {
      readonly type: "EDIT";
      readonly field: keyof FormValues;
      readonly value: string;
    }
  | {
      readonly type: "SUBMIT";
    }
  | {
      readonly type: "SUCCESS";
      readonly message: string;
    }
  | {
      readonly type: "FAILURE";
      readonly message: string;
    }
  | {
      readonly type: "RESET";
    };

interface StateMachineFormProps {
  readonly onStateChange: (state: FormState) => void;
}

interface FormStateStatusProps {
  readonly state: FormState;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * The reducer defines the allowed transitions between form states. Each action
 * is handled explicitly, and invalid transitions can be rejected rather than
 * silently producing an inconsistent state.
 */
const formReducer = (state: FormState, action: FormAction): FormState => {
  switch (action.type) {
    case "EDIT": {
      if (state.status === "submitting") {
        return state;
      }

      const nextValues: FormValues = {
        ...state.values,
        [action.field]: action.value,
      };

      return {
        status: "editing",
        values: nextValues,
      };
    }

    case "SUBMIT": {
      if (state.status === "submitting") {
        return state;
      }

      return {
        status: "submitting",
        values: state.values,
      };
    }

    case "SUCCESS": {
      if (state.status !== "submitting") {
        return state;
      }

      return {
        status: "success",
        values: state.values,
        message: action.message,
      };
    }

    case "FAILURE": {
      if (state.status !== "submitting") {
        return state;
      }

      return {
        status: "error",
        values: state.values,
        message: action.message,
      };
    }

    case "RESET": {
      return {
        status: "idle",
        values: {
          name: "",
          email: "",
        },
      };
    }
  }
};

/**
 * A status component can narrow the state using its discriminant and render
 * only the information valid for the current state.
 */
export const FormStateStatus: React.FC<FormStateStatusProps> = ({ state }): React.ReactElement => {
  switch (state.status) {
    case "idle":
      return <p>Form is ready.</p>;

    case "editing":
      return <p>Form is being edited.</p>;

    case "submitting":
      return <p>Submitting form...</p>;

    case "success":
      return <p>{state.message}</p>;

    case "error":
      return <p role="alert">{state.message}</p>;
  }
};

/**
 * The form dispatches events rather than directly modifying the state.
 * The reducer remains responsible for deciding the resulting state.
 */
export const StateMachineForm: React.FC<StateMachineFormProps> = ({ onStateChange }): React.ReactElement => {
  const initialState: FormState = {
    status: "idle",
    values: {
      name: "",
      email: "",
    },
  };

  const [state, dispatch] = React.useReducer(formReducer, initialState);

  React.useEffect((): void => {
    onStateChange(state);
  }, [onStateChange, state]);

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    dispatch({
      type: "EDIT",
      field: "name",
      value: event.target.value,
    });
  };

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    dispatch({
      type: "EDIT",
      field: "email",
      value: event.target.value,
    });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    if (state.status === "submitting") {
      return;
    }

    dispatch({ type: "SUBMIT" });

    window.setTimeout((): void => {
      if (state.values.name.trim() === "" || state.values.email.trim() === "") {
        dispatch({
          type: "FAILURE",
          message: "Name and email are required.",
        });
        return;
      }

      dispatch({
        type: "SUCCESS",
        message: "Form submitted successfully.",
      });
    }, 1000);
  };

  const handleReset = (): void => {
    dispatch({ type: "RESET" });
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Name
        <input
          name="name"
          value={state.values.name}
          onChange={handleNameChange}
          disabled={state.status === "submitting"}
        />
      </label>

      <label>
        Email
        <input
          name="email"
          type="email"
          value={state.values.email}
          onChange={handleEmailChange}
          disabled={state.status === "submitting"}
        />
      </label>

      <button type="submit" disabled={state.status === "submitting"}>
        {state.status === "submitting" ? "Submitting..." : "Submit"}
      </button>

      <button type="button" onClick={handleReset}>
        Reset
      </button>

      <FormStateStatus state={state} />
    </form>
  );
};

/**
 * A state machine can explicitly represent mutually exclusive states.
 * There is no separate `isSubmitting` flag that could accidentally conflict
 * with an error or success state.
 */
export const FormStateMachineStates: React.FC = (): React.ReactElement => {
  const states: readonly FormState[] = [
    {
      status: "idle",
      values: {
        name: "",
        email: "",
      },
    },
    {
      status: "editing",
      values: {
        name: "Ada",
        email: "ada@example.com",
      },
    },
    {
      status: "submitting",
      values: {
        name: "Ada",
        email: "ada@example.com",
      },
    },
    {
      status: "success",
      values: {
        name: "Ada",
        email: "ada@example.com",
      },
      message: "Submission succeeded.",
    },
    {
      status: "error",
      values: {
        name: "Ada",
        email: "",
      },
      message: "Email is required.",
    },
  ];

  return (
    <div>
      {states.map((state: FormState): React.ReactElement => (
        <FormStateStatus key={state.status} state={state} />
      ))}
    </div>
  );
};

/**
 * The reducer can reject transitions that do not make sense for the current
 * state. For example, a success result received while the form is not
 * submitting is ignored rather than creating an invalid state.
 */
export const FormStateMachineTransitions: React.FC = (): React.ReactElement => {
  const initialState: FormState = {
    status: "success",
    values: {
      name: "Ada",
      email: "ada@example.com",
    },
    message: "Already completed.",
  };

  const invalidTransition: FormState = formReducer(initialState, {
    type: "SUCCESS",
    message: "Unexpected success.",
  });

  return (
    <div>
      <p>Current state: {initialState.status}</p>
      <p>After invalid transition: {invalidTransition.status}</p>
    </div>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const FormStateMachine: React.FC = (): React.ReactElement => {
  const [latestState, setLatestState] = React.useState<FormState>({
    status: "idle",
    values: {
      name: "",
      email: "",
    },
  });

  const handleStateChange = (state: FormState): void => {
    setLatestState(state);
  };

  return (
    <div>
      <h1>Form State Machine</h1>

      <h2>1. Explicit Form State Transitions</h2>
      <StateMachineForm onStateChange={handleStateChange} />

      <h2>2. Discriminated Form States</h2>
      <FormStateMachineStates />

      <h2>3. Invalid Transition Handling</h2>
      <FormStateMachineTransitions />

      <h2>4. Current State</h2>
      <p>{latestState.status}</p>
    </div>
  );
};

export default FormStateMachine;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - A form state machine models the form as explicit mutually exclusive states.
// - A discriminated union uses `status` to describe which state-specific data is available.
// - `useReducer` centralizes state transitions and keeps transition logic predictable.
// - Actions describe events such as editing, submitting, succeeding, failing, and resetting.
// - Invalid transitions can be rejected instead of creating inconsistent state combinations.
// - State-specific properties can be accessed safely after TypeScript narrows the discriminated union.
// - A state machine avoids unrelated boolean flags that can represent contradictory states.
// - Asynchronous operations should dispatch explicit success or failure events when they finish.
