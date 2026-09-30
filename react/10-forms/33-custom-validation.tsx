/**
 * Custom Form Validation
 * =======================
 *
 * Custom form validation allows application-specific rules to be enforced when the browser's
 * built-in constraint validation is not sufficient. React can validate controlled values directly,
 * derive validation messages from state, and prevent submission when the application's rules fail.
 *
 * Custom validation should be separated from rendering where practical. A validation function can
 * return a specific error message or an empty string, while the component decides when to run that
 * validation and how to present the result. This keeps validation logic deterministic and makes
 * the distinction between an invalid value and an untouched field explicit.
 */

import React from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface CustomValidationRequiredProps {
  readonly initialUsername: string;
}

export interface CustomValidationMatchProps {
  readonly initialPassword: string;
  readonly initialConfirmation: string;
}

export interface CustomValidationFunctionProps {
  readonly initialUsername: string;
}

export interface CustomValidationTouchedProps {
  readonly initialEmail: string;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

export const CustomValidationRequired: React.FC<CustomValidationRequiredProps> = ({
  initialUsername,
}): React.ReactElement => {
  const [username, setUsername] = React.useState<string>(initialUsername);
  const [error, setError] = React.useState<string>("");

  const validateUsername = (value: string): string => {
    if (value.trim() === "") {
      return "Username is required.";
    }

    if (value.trim().length < 3) {
      return "Username must contain at least 3 characters.";
    }

    return "";
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setUsername(event.target.value);
    setError("");
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    const validationError: string = validateUsername(username);

    setError(validationError);

    if (validationError !== "") {
      return;
    }

    console.log("Username is valid:", username);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Username
        <input type="text" name="username" value={username} onChange={handleChange} />
      </label>

      {error !== "" && <p>{error}</p>}

      <button type="submit">Submit</button>
    </form>
  );
};

export const CustomValidationMatch: React.FC<CustomValidationMatchProps> = ({
  initialPassword,
  initialConfirmation,
}): React.ReactElement => {
  const [password, setPassword] = React.useState<string>(initialPassword);
  const [confirmation, setConfirmation] = React.useState<string>(initialConfirmation);
  const [error, setError] = React.useState<string>("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    if (password !== confirmation) {
      setError("Passwords must match.");
      return;
    }

    setError("");
    console.log("Passwords match.");
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
        />
      </label>

      <label>
        Confirm password
        <input
          type="password"
          name="confirmation"
          value={confirmation}
          onChange={(event: React.ChangeEvent<HTMLInputElement>): void => {
            setConfirmation(event.target.value);
          }}
        />
      </label>

      {error !== "" && <p>{error}</p>}

      <button type="submit">Submit</button>
    </form>
  );
};

export const CustomValidationFunction: React.FC<CustomValidationFunctionProps> = ({
  initialUsername,
}): React.ReactElement => {
  const [username, setUsername] = React.useState<string>(initialUsername);
  const [error, setError] = React.useState<string>("");

  const validateUsername = (value: string): boolean => {
    return /^[a-zA-Z0-9_]+$/.test(value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    const isValid: boolean = validateUsername(username);

    setError(isValid ? "" : "Username may contain only letters, numbers, and underscores.");

    if (!isValid) {
      return;
    }

    console.log("Custom username validation passed.");
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
        />
      </label>

      {error !== "" && <p>{error}</p>}

      <button type="submit">Submit</button>
    </form>
  );
};

export const CustomValidationTouched: React.FC<CustomValidationTouchedProps> = ({
  initialEmail,
}): React.ReactElement => {
  const [email, setEmail] = React.useState<string>(initialEmail);
  const [touched, setTouched] = React.useState<boolean>(false);

  const validateEmail = (value: string): string => {
    const normalizedEmail: string = value.trim();

    if (normalizedEmail === "") {
      return "Email is required.";
    }

    if (!normalizedEmail.includes("@")) {
      return "Email must contain an @ character.";
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

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    setTouched(true);

    const validationError: string = validateEmail(email);

    if (validationError !== "") {
      return;
    }

    console.log("Email validation passed.");
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
          onBlur={handleBlur}
          aria-invalid={error !== ""}
        />
      </label>

      {error !== "" && <p>{error}</p>}

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
      <h1>Custom Form Validation</h1>

      <h2>1. Validating Application-Specific Requirements</h2>
      <CustomValidationRequired initialUsername="" />

      <h2>2. Validating Related Field Values</h2>
      <CustomValidationMatch initialPassword="password123" initialConfirmation="password123" />

      <h2>3. Reusing a Custom Validation Function</h2>
      <CustomValidationFunction initialUsername="john_doe" />

      <h2>4. Showing Errors Only After Interaction</h2>
      <CustomValidationTouched initialEmail="" />
    </main>
  );
};

export default MainContainer;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Custom validation handles application-specific rules that native constraints may not express.
// - Validation functions can return a boolean when only validity is needed.
// - Validation functions can return an error message when the UI needs a specific explanation.
// - Related fields can be validated together, such as password and confirmation values.
// - Controlled React state makes custom validation straightforward because the current values are available directly.
// - Validation errors can be kept separate from input values so invalid and untouched states are distinguishable.
// - A touched state can prevent validation messages from appearing before the user interacts with a field.
// - `aria-invalid` can communicate the invalid state of a form control to assistive technologies.
// - Custom validation should not replace native constraints when native validation already expresses the requirement clearly.
