/**
 * useActionState
 * ==============
 *
 * `useActionState` is a React Hook that allows updating state based on the result of a form action or async function.
 * It takes an action function `(previousState, formData | payload) => nextState` and an initial state value,
 * returning a tuple containing the current state, a wrapped action trigger function, and a boolean pending indicator.
 *
 * It simplifies handling asynchronous form submissions, server actions, and pending UI states without requiring
 * manual tracking using separate `useState` and `useEffect` hooks. When called inside a form, the action function
 * automatically receives `FormData` as its second parameter.
 */

import React, { useActionState } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface FormState {
  readonly error: string | null;
  readonly successMessage: string | null;
}

export interface UserProfileProps {
  readonly initialUsername: string;
}

// ---------------------------------------------------------------------
// 2. Action Function Implementations
// ---------------------------------------------------------------------

export const initialFormState: FormState = {
  error: null,
  successMessage: null,
};

export const updateUsernameAction = async (_previousState: FormState, formData: FormData): Promise<FormState> => {
  const username = formData.get("username") as string;

  if (!username || username.trim().length < 3) {
    return {
      error: "Username must be at least 3 characters long.",
      successMessage: null,
    };
  }

  // Simulate async API call delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return {
    error: null,
    successMessage: `Successfully updated username to "${username}".`,
  };
};

// ---------------------------------------------------------------------
// 3. Component Implementations
// ---------------------------------------------------------------------

export const UsernameForm: React.FC<UserProfileProps> = ({ initialUsername }) => {
  const [state, formAction, isPending] = useActionState(updateUsernameAction, initialFormState);

  return (
    <div>
      <form action={formAction}>
        <label htmlFor="username-input">Username:</label>
        <input id="username-input" name="username" type="text" defaultValue={initialUsername} disabled={isPending} />
        <button type="submit" disabled={isPending}>
          {isPending ? "Updating..." : "Save"}
        </button>
      </form>

      {state.error && <p>{state.error}</p>}
      {state.successMessage && <p>{state.successMessage}</p>}
    </div>
  );
};

// ---------------------------------------------------------------------
// 4. Main Container Component
// ---------------------------------------------------------------------

export const UseActionStateContainer: React.FC = () => {
  return (
    <div>
      <h1>03 - useActionState</h1>

      <h2>1. Form Action & Async Pending State</h2>
      <UsernameForm initialUsername="john_doe" />
    </div>
  );
};

export default UseActionStateContainer;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Calling useActionState accepts an action handler and initial state, returning state, action launcher, and pending status.
// - Action functions receive previous state as the first argument and action parameters or FormData as the second.
// - The isPending indicator automatically tracks asynchronous action transitions without manual state flags.
// - Integrating with native form elements allows seamless submission handling with optimistic and server action compatibility.
// - Handling form validations and async responses cleanly isolates update logic from component rendering.
