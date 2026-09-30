/**
 * Form Action Errors
 * ===================
 *
 * Form Actions can fail while processing submitted data. An Action can represent expected
 * validation failures as returned state, while unexpected failures can be thrown as errors and
 * handled by an Error Boundary.
 *
 * `useActionState` is useful when the form needs to display expected submission errors because it
 * connects the Action's returned value to component state. Its Action receives the previous state
 * followed by the submitted `FormData`, and the returned state becomes available to the component.
 * Expected validation failures should generally be returned as state rather than thrown as
 * exceptions because they are part of the normal form interaction.
 */

import React from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface FormActionErrorState {
  readonly error: string;
  readonly success: string;
}

export interface FormActionErrorsBasicProps {
  readonly initialEmail: string;
}

export interface FormActionErrorsValidationProps {
  readonly initialUsername: string;
}

export interface FormActionErrorsAsyncProps {
  readonly initialCode: string;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

export const FormActionErrorsBasic: React.FC<FormActionErrorsBasicProps> = ({ initialEmail }): React.ReactElement => {
  const initialState: FormActionErrorState = {
    error: "",
    success: "",
  };

  const submitForm = async (
    _previousState: FormActionErrorState,
    formData: FormData,
  ): Promise<FormActionErrorState> => {
    const email: FormDataEntryValue | null = formData.get("email");

    if (typeof email !== "string" || email.trim() === "") {
      return {
        error: "Email is required.",
        success: "",
      };
    }

    if (!email.includes("@")) {
      return {
        error: "Enter a valid email address.",
        success: "",
      };
    }

    await new Promise<void>((resolve: () => void): void => {
      window.setTimeout(resolve, 500);
    });

    return {
      error: "",
      success: "The form was submitted successfully.",
    };
  };

  const [state, formAction, isPending] = React.useActionState<FormActionErrorState, FormData>(submitForm, initialState);

  return (
    <div>
      <form action={formAction}>
        <label>
          Email
          <input
            type="email"
            name="email"
            defaultValue={initialEmail}
            aria-invalid={state.error !== ""}
            aria-describedby={state.error !== "" ? "email-action-error" : undefined}
          />
        </label>

        {state.error !== "" && (
          <p id="email-action-error" role="alert">
            {state.error}
          </p>
        )}

        {state.success !== "" && <p role="status">{state.success}</p>}

        <button type="submit" disabled={isPending}>
          {isPending ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export const FormActionErrorsValidation: React.FC<FormActionErrorsValidationProps> = ({
  initialUsername,
}): React.ReactElement => {
  const initialState: FormActionErrorState = {
    error: "",
    success: "",
  };

  const submitForm = (_previousState: FormActionErrorState, formData: FormData): FormActionErrorState => {
    const username: FormDataEntryValue | null = formData.get("username");

    if (typeof username !== "string") {
      return {
        error: "Username is required.",
        success: "",
      };
    }

    const trimmedUsername: string = username.trim();

    if (trimmedUsername.length < 3) {
      return {
        error: "Username must contain at least 3 characters.",
        success: "",
      };
    }

    return {
      error: "",
      success: `Username "${trimmedUsername}" is valid.`,
    };
  };

  const [state, formAction] = React.useActionState<FormActionErrorState, FormData>(submitForm, initialState);

  return (
    <div>
      <form action={formAction}>
        <label>
          Username
          <input
            type="text"
            name="username"
            defaultValue={initialUsername}
            aria-invalid={state.error !== ""}
            aria-describedby={state.error !== "" ? "username-action-error" : undefined}
          />
        </label>

        {state.error !== "" && (
          <p id="username-action-error" role="alert">
            {state.error}
          </p>
        )}

        {state.success !== "" && <p role="status">{state.success}</p>}

        <button type="submit">Validate</button>
      </form>
    </div>
  );
};

export const FormActionErrorsAsync: React.FC<FormActionErrorsAsyncProps> = ({ initialCode }): React.ReactElement => {
  const initialState: FormActionErrorState = {
    error: "",
    success: "",
  };

  const submitForm = async (
    _previousState: FormActionErrorState,
    formData: FormData,
  ): Promise<FormActionErrorState> => {
    const code: FormDataEntryValue | null = formData.get("code");

    if (typeof code !== "string") {
      return {
        error: "Verification code is required.",
        success: "",
      };
    }

    await new Promise<void>((resolve: () => void): void => {
      window.setTimeout(resolve, 750);
    });

    if (code !== "123456") {
      return {
        error: "The verification code is incorrect.",
        success: "",
      };
    }

    return {
      error: "",
      success: "The verification code was accepted.",
    };
  };

  const [state, formAction, isPending] = React.useActionState<FormActionErrorState, FormData>(submitForm, initialState);

  return (
    <div>
      <form action={formAction}>
        <label>
          Verification code
          <input
            type="text"
            name="code"
            inputMode="numeric"
            defaultValue={initialCode}
            aria-invalid={state.error !== ""}
            aria-describedby={state.error !== "" ? "code-action-error" : undefined}
          />
        </label>

        {state.error !== "" && (
          <p id="code-action-error" role="alert">
            {state.error}
          </p>
        )}

        {state.success !== "" && <p role="status">{state.success}</p>}

        <button type="submit" disabled={isPending}>
          {isPending ? "Verifying..." : "Verify"}
        </button>
      </form>
    </div>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const MainContainer: React.FC = (): React.ReactElement => {
  return (
    <main>
      <h1>Form Action Errors</h1>

      <h2>1. Returning Expected Validation Errors from an Action</h2>
      <FormActionErrorsBasic initialEmail="" />

      <h2>2. Returning Synchronous Validation Errors</h2>
      <FormActionErrorsValidation initialUsername="" />

      <h2>3. Handling Errors from an Asynchronous Action</h2>
      <FormActionErrorsAsync initialCode="" />
    </main>
  );
};

export default MainContainer;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Expected form failures such as invalid input can be represented by the value returned from an Action.
// - `useActionState` connects an Action's returned state to the component that owns the form.
// - A `useActionState` Action receives the previous state first and the submitted `FormData` second.
// - The returned state can contain both validation errors and successful submission messages.
// - `isPending` from `useActionState` indicates that the Action is currently being processed.
// - Expected validation failures should normally be returned as state rather than thrown as exceptions.
// - Returned error state can be used to update `aria-invalid` and expose an error through `role="alert"`.
// - An asynchronous Action can perform asynchronous work before returning either an error or success state.
// - An Action's returned error state does not automatically mean that a JavaScript exception occurred.
// - Unexpected exceptions are different from expected validation failures and can be handled through React's error-handling mechanisms such as Error Boundaries.
// - Form Action state should describe the result of the latest submission rather than duplicating the current input values.
