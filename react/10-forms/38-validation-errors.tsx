/**
 * Validation Errors
 * ==================
 *
 * Validation errors describe why a form value or form state does not satisfy its validation rules.
 * A useful validation model keeps the error associated with the value or rule that produced it,
 * allowing the UI to display precise feedback instead of treating the entire form as simply valid
 * or invalid.
 *
 * Error state should normally be derived from current values and interaction state rather than
 * maintained as an independent boolean. This prevents stale validation state when a user changes
 * a value after an error has been produced.
 */

import React from "react";

export interface ValidationErrorsSingleProps {
  readonly initialUsername: string;
}

export interface ValidationErrorsMultipleProps {
  readonly initialUsername: string;
  readonly initialEmail: string;
  readonly initialPassword: string;
}

export interface ValidationErrorsSummaryProps {
  readonly initialName: string;
  readonly initialEmail: string;
}

export interface ValidationErrorsServerProps {
  readonly initialEmail: string;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

export const ValidationErrorsSingle: React.FC<ValidationErrorsSingleProps> = ({
  initialUsername,
}): React.ReactElement => {
  const [username, setUsername] = React.useState<string>(initialUsername);
  const [touched, setTouched] = React.useState<boolean>(false);

  const error: string =
    username.trim() === ""
      ? "Username is required."
      : username.trim().length < 3
        ? "Username must contain at least 3 characters."
        : "";

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setUsername(event.target.value);
  };

  const handleBlur = (): void => {
    setTouched(true);
  };

  const showError: boolean = touched && error !== "";

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
          aria-invalid={showError}
          aria-describedby={showError ? "username-error" : undefined}
        />
      </label>

      {showError && <p id="username-error">{error}</p>}
    </div>
  );
};

export const ValidationErrorsMultiple: React.FC<ValidationErrorsMultipleProps> = ({
  initialUsername,
  initialEmail,
  initialPassword,
}): React.ReactElement => {
  const [username, setUsername] = React.useState<string>(initialUsername);
  const [email, setEmail] = React.useState<string>(initialEmail);
  const [password, setPassword] = React.useState<string>(initialPassword);
  const [submitted, setSubmitted] = React.useState<boolean>(false);

  const usernameError: string = username.trim() === "" ? "Username is required." : "";

  const emailError: string =
    email.trim() === "" ? "Email is required." : !email.includes("@") ? "Enter a valid email address." : "";

  const passwordError: string = password.length < 8 ? "Password must contain at least 8 characters." : "";

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    setSubmitted(true);

    if (usernameError !== "" || emailError !== "" || passwordError !== "") {
      return;
    }

    console.log("All fields are valid.");
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Username
        <input
          type="text"
          name="username"
          value={username}
          onChange={(event: React.ChangeEvent<HTMLInputElement>): void => {
            setUsername(event.target.value);
          }}
          aria-invalid={submitted && usernameError !== ""}
        />
      </label>

      {submitted && usernameError !== "" && <p>{usernameError}</p>}

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

      <button type="submit">Submit</button>
    </form>
  );
};

export const ValidationErrorsSummary: React.FC<ValidationErrorsSummaryProps> = ({
  initialName,
  initialEmail,
}): React.ReactElement => {
  const [name, setName] = React.useState<string>(initialName);
  const [email, setEmail] = React.useState<string>(initialEmail);
  const [submitted, setSubmitted] = React.useState<boolean>(false);

  const nameError: string = name.trim() === "" ? "Name is required." : "";

  const emailError: string =
    email.trim() === "" ? "Email is required." : !email.includes("@") ? "Enter a valid email address." : "";

  const errors: string[] = [nameError, emailError].filter((error: string): boolean => error !== "");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    setSubmitted(true);

    if (errors.length > 0) {
      return;
    }

    console.log("Form is valid.");
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
        />
      </label>

      <label>
        Email
        <input
          type="email"
          name="email"
          value={email}
          onChange={(event: React.ChangeEvent<HTMLInputElement>): void => {
            setEmail(event.target.value);
          }}
        />
      </label>

      <button type="submit">Submit</button>

      {submitted && errors.length > 0 && (
        <div role="alert">
          <p>Please correct the following errors:</p>

          <ul>
            {errors.map((error: string): React.ReactElement => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      {submitted && errors.length === 0 && <p>Form is valid.</p>}
    </form>
  );
};

export const ValidationErrorsServer: React.FC<ValidationErrorsServerProps> = ({ initialEmail }): React.ReactElement => {
  const [email, setEmail] = React.useState<string>(initialEmail);
  const [serverError, setServerError] = React.useState<string>("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setEmail(event.target.value);
    setServerError("");
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    const normalizedEmail: string = email.trim().toLowerCase();

    if (normalizedEmail === "taken@example.com") {
      setServerError("This email address is already registered.");
      return;
    }

    setServerError("");
    console.log("Email accepted.");
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Email
        <input
          type="email"
          name="email"
          value={email}
          onChange={handleChange}
          aria-invalid={serverError !== ""}
          aria-describedby={serverError !== "" ? "server-email-error" : undefined}
        />
      </label>

      {serverError !== "" && <p id="server-email-error">{serverError}</p>}

      <button type="submit">Submit</button>
    </form>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const MainContainer: React.FC = (): React.ReactElement => {
  return (
    <main>
      <h1>Validation Errors</h1>

      <h2>1. Displaying an Individual Field Error</h2>
      <ValidationErrorsSingle initialUsername="" />

      <h2>2. Displaying Multiple Field Errors</h2>
      <ValidationErrorsMultiple initialUsername="" initialEmail="" initialPassword="" />

      <h2>3. Displaying a Form-Level Error Summary</h2>
      <ValidationErrorsSummary initialName="" initialEmail="" />

      <h2>4. Displaying an External Validation Error</h2>
      <ValidationErrorsServer initialEmail="" />
    </main>
  );
};

export default MainContainer;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Validation errors should explain why a value does not satisfy a specific rule.
// - Error messages can be derived directly from current field values.
// - A touched or submitted state can control when an existing error becomes visible.
// - `aria-invalid` communicates that a form control currently has an invalid value.
// - `aria-describedby` can associate a control with the element containing its error message.
// - Multiple field errors can be collected into an error summary for the complete form.
// - A form-level error can represent a rule that is not specific to one individual field.
// - External validation can produce errors that are not detectable by client-side validation alone.
// - External errors should generally be cleared or revalidated when the value they describe changes.
