/**
 * Validation Timing
 * ==================
 *
 * Validation timing determines when a form field or form is checked and when validation feedback
 * becomes visible. Common strategies include validating while the user types, when a field loses
 * focus, when the form is submitted, or through a combination of these approaches.
 *
 * Validation timing affects both behavior and state management. Validation can be computed on every
 * render without immediately displaying the result, while interaction state such as `touched` or
 * `submitted` determines when that result should become visible to the user.
 */

import React from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface ValidationTimingChangeProps {
  readonly initialUsername: string;
}

export interface ValidationTimingBlurProps {
  readonly initialEmail: string;
}

export interface ValidationTimingSubmitProps {
  readonly initialPassword: string;
}

export interface ValidationTimingCombinedProps {
  readonly initialUsername: string;
  readonly initialEmail: string;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

export const ValidationTimingChange: React.FC<ValidationTimingChangeProps> = ({
  initialUsername,
}): React.ReactElement => {
  const [username, setUsername] = React.useState<string>(initialUsername);

  const validateUsername = (value: string): string => {
    if (value.trim() === "") {
      return "Username is required.";
    }

    if (value.trim().length < 3) {
      return "Username must contain at least 3 characters.";
    }

    return "";
  };

  const error: string = validateUsername(username);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setUsername(event.target.value);
  };

  return (
    <div>
      <label>
        Username
        <input type="text" name="username" value={username} onChange={handleChange} aria-invalid={error !== ""} />
      </label>

      {error !== "" && <p>{error}</p>}
    </div>
  );
};

export const ValidationTimingBlur: React.FC<ValidationTimingBlurProps> = ({ initialEmail }): React.ReactElement => {
  const [email, setEmail] = React.useState<string>(initialEmail);
  const [touched, setTouched] = React.useState<boolean>(false);

  const validateEmail = (value: string): string => {
    const normalizedEmail: string = value.trim();

    if (normalizedEmail === "") {
      return "Email is required.";
    }

    if (!normalizedEmail.includes("@")) {
      return "Enter an email address containing @.";
    }

    return "";
  };

  const error: string = touched ? validateEmail(email) : "";

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setEmail(event.target.value);
  };

  const handleBlur = (): void => {
    setTouched(true);
  };

  return (
    <div>
      <label>
        Email
        <input
          type="email"
          name="email"
          value={email}
          onChange={handleChange}
          onBlur={handleBlur}
          aria-invalid={error !== ""}
        />
      </label>

      {error !== "" && <p>{error}</p>}
    </div>
  );
};

export const ValidationTimingSubmit: React.FC<ValidationTimingSubmitProps> = ({
  initialPassword,
}): React.ReactElement => {
  const [password, setPassword] = React.useState<string>(initialPassword);
  const [submitted, setSubmitted] = React.useState<boolean>(false);

  const validatePassword = (value: string): string => {
    if (value.length === 0) {
      return "Password is required.";
    }

    if (value.length < 8) {
      return "Password must contain at least 8 characters.";
    }

    return "";
  };

  const error: string = validatePassword(password);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    setSubmitted(true);

    if (error !== "") {
      return;
    }

    console.log("Password validation passed.");
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Password
        <input
          type="password"
          name="password"
          value={password}
          onChange={(event: React.ChangeEvent<HTMLInputElement>): void => {
            setPassword(event.target.value);
          }}
          aria-invalid={submitted && error !== ""}
        />
      </label>

      {submitted && error !== "" && <p>{error}</p>}

      <button type="submit">Submit</button>
    </form>
  );
};

export const ValidationTimingCombined: React.FC<ValidationTimingCombinedProps> = ({
  initialUsername,
  initialEmail,
}): React.ReactElement => {
  const [username, setUsername] = React.useState<string>(initialUsername);
  const [email, setEmail] = React.useState<string>(initialEmail);
  const [touchedUsername, setTouchedUsername] = React.useState<boolean>(false);
  const [touchedEmail, setTouchedEmail] = React.useState<boolean>(false);
  const [submitted, setSubmitted] = React.useState<boolean>(false);

  const usernameError: string =
    username.trim() === ""
      ? "Username is required."
      : username.trim().length < 3
        ? "Username must contain at least 3 characters."
        : "";

  const emailError: string =
    email.trim() === "" ? "Email is required." : !email.includes("@") ? "Enter a valid email address." : "";

  const showUsernameError: boolean = touchedUsername || submitted;

  const showEmailError: boolean = touchedEmail || submitted;

  const isValid: boolean = usernameError === "" && emailError === "";

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    setSubmitted(true);

    if (!isValid) {
      return;
    }

    console.log("Combined validation passed.");
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
          onBlur={(): void => {
            setTouchedUsername(true);
          }}
          aria-invalid={showUsernameError && usernameError !== ""}
        />
      </label>

      {showUsernameError && usernameError !== "" && <p>{usernameError}</p>}

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
            setTouchedEmail(true);
          }}
          aria-invalid={showEmailError && emailError !== ""}
        />
      </label>

      {showEmailError && emailError !== "" && <p>{emailError}</p>}

      <button type="submit">Submit</button>

      {submitted && isValid && <p>All fields are valid.</p>}
    </form>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const MainContainer: React.FC = (): React.ReactElement => {
  return (
    <main>
      <h1>Validation Timing</h1>

      <h2>1. Validating While the User Types</h2>
      <ValidationTimingChange initialUsername="" />

      <h2>2. Validating When a Field Loses Focus</h2>
      <ValidationTimingBlur initialEmail="" />

      <h2>3. Validating When the Form Is Submitted</h2>
      <ValidationTimingSubmit initialPassword="" />

      <h2>4. Combining Blur and Submit Validation</h2>
      <ValidationTimingCombined initialUsername="" initialEmail="" />
    </main>
  );
};

export default MainContainer;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Validation can run on change, blur, submit, or a combination of these events.
// - Validation logic can be computed continuously while visibility of errors is controlled separately.
// - Change validation provides immediate feedback but can display errors before the user finishes typing.
// - Blur validation waits until the user leaves the field before displaying its validation result.
// - Submit validation delays validation feedback until the user attempts to submit the form.
// - A `touched` state can track whether a field has received and then lost focus.
// - A `submitted` state can ensure that all validation errors become visible after a submit attempt.
// - Combining `touched` and `submitted` states provides different feedback timing for individual fields and form submission.
// - The validation result should be derived from the current value rather than stored as independent validity state.
