/**
 * Validation State
 * =================
 *
 * Validation state describes the current validation condition of a form field or form. A useful
 * validation model distinguishes between states such as untouched, validating, valid, and invalid
 * rather than representing everything with a single boolean.
 *
 * Validation state is derived from current values and interaction state. For synchronous validation,
 * the result can be computed directly during rendering. For asynchronous validation, an explicit
 * state such as `idle`, `validating`, `valid`, or `invalid` is useful because the result is not
 * available immediately.
 */

import React from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface ValidationStateBasicProps {
  readonly initialUsername: string;
}

export interface ValidationStateTouchedProps {
  readonly initialEmail: string;
}

export interface ValidationStateFormProps {
  readonly initialName: string;
  readonly initialEmail: string;
  readonly initialPassword: string;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

export const ValidationStateBasic: React.FC<ValidationStateBasicProps> = ({ initialUsername }): React.ReactElement => {
  const [username, setUsername] = React.useState<string>(initialUsername);
  const [touched, setTouched] = React.useState<boolean>(false);

  const error: string =
    username.trim() === ""
      ? "Username is required."
      : username.trim().length < 3
        ? "Username must contain at least 3 characters."
        : "";

  const state: "untouched" | "valid" | "invalid" = !touched ? "untouched" : error === "" ? "valid" : "invalid";

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setUsername(event.target.value);
  };

  const handleBlur = (): void => {
    setTouched(true);
  };

  return (
    <div>
      <label>
        Username
        <input
          type="text"
          name="username"
          value={username}
          onChange={handleChange}
          onBlur={handleBlur}
          aria-invalid={state === "invalid"}
        />
      </label>

      <p>Validation state: {state}</p>

      {state === "invalid" && <p>{error}</p>}
    </div>
  );
};

export const ValidationStateTouched: React.FC<ValidationStateTouchedProps> = ({ initialEmail }): React.ReactElement => {
  const [email, setEmail] = React.useState<string>(initialEmail);
  const [touched, setTouched] = React.useState<boolean>(false);
  const [submitted, setSubmitted] = React.useState<boolean>(false);

  const error: string =
    email.trim() === "" ? "Email is required." : !email.includes("@") ? "Enter a valid email address." : "";

  const state: "untouched" | "invalid" | "valid" =
    !touched && !submitted ? "untouched" : error === "" ? "valid" : "invalid";

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    setSubmitted(true);

    if (error !== "") {
      return;
    }

    console.log("Email is valid.");
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Email
        <input
          type="email"
          name="email"
          value={email}
          onChange={(event: React.ChangeEvent<HTMLInputElement>): void => {
            setEmail(event.target.value);
          }}
          onBlur={(): void => {
            setTouched(true);
          }}
          aria-invalid={state === "invalid"}
        />
      </label>

      <p>Validation state: {state}</p>

      {state === "invalid" && <p>{error}</p>}

      <button type="submit">Submit</button>
    </form>
  );
};

export const ValidationStateForm: React.FC<ValidationStateFormProps> = ({
  initialName,
  initialEmail,
  initialPassword,
}): React.ReactElement => {
  const [name, setName] = React.useState<string>(initialName);
  const [email, setEmail] = React.useState<string>(initialEmail);
  const [password, setPassword] = React.useState<string>(initialPassword);
  const [submitted, setSubmitted] = React.useState<boolean>(false);

  const nameError: string = name.trim() === "" ? "Name is required." : "";

  const emailError: string =
    email.trim() === "" ? "Email is required." : !email.includes("@") ? "Enter a valid email address." : "";

  const passwordError: string = password.length < 8 ? "Password must contain at least 8 characters." : "";

  const isValid: boolean = nameError === "" && emailError === "" && passwordError === "";

  const state: "idle" | "invalid" | "valid" = !submitted ? "idle" : isValid ? "valid" : "invalid";

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    setSubmitted(true);

    if (!isValid) {
      return;
    }

    console.log("Form validation passed.");
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Name
        <input
          type="text"
          name="name"
          value={name}
          onChange={(event: React.ChangeEvent<HTMLInputElement>): void => {
            setName(event.target.value);
          }}
          aria-invalid={submitted && nameError !== ""}
        />
      </label>

      {submitted && nameError !== "" && <p>{nameError}</p>}

      <label>
        Email
        <input
          type="email"
          name="email"
          value={email}
          onChange={(event: React.ChangeEvent<HTMLInputElement>): void => {
            setEmail(event.target.value);
          }}
          aria-invalid={submitted && emailError !== ""}
        />
      </label>

      {submitted && emailError !== "" && <p>{emailError}</p>}

      <label>
        Password
        <input
          type="password"
          name="password"
          value={password}
          onChange={(event: React.ChangeEvent<HTMLInputElement>): void => {
            setPassword(event.target.value);
          }}
          aria-invalid={submitted && passwordError !== ""}
        />
      </label>

      {submitted && passwordError !== "" && <p>{passwordError}</p>}

      <p>Form validation state: {state}</p>

      <button type="submit">Validate</button>
    </form>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const MainContainer: React.FC = (): React.ReactElement => {
  return (
    <main>
      <h1>Validation State</h1>

      <h2>1. Representing Untouched, Valid, and Invalid States</h2>
      <ValidationStateBasic initialUsername="" />

      <h2>2. Combining Touched and Submitted State</h2>
      <ValidationStateTouched initialEmail="" />

      <h2>3. Representing the Validation State of a Form</h2>
      <ValidationStateForm initialName="" initialEmail="" initialPassword="" />
    </main>
  );
};

export default MainContainer;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Validation state describes more than whether a value is valid or invalid.
// - A field can begin in an untouched state before validation feedback is displayed.
// - Touched state records whether the user has interacted with a field and left it.
// - Submitted state can trigger validation feedback for every field in a form.
// - A validation state can be derived from the current value, validation result, and interaction state.
// - Form-level validation state can be derived by combining the validation results of its fields.
// - Avoid storing a separate `isValid` value when it can become stale relative to the current form values.
// - `aria-invalid` can expose an invalid validation state to assistive technologies.
