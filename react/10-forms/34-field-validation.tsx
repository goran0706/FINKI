/**
 * Field Validation
 * =================
 *
 * Field validation validates individual form controls independently rather than treating the
 * entire form as one validation unit. Each field can have its own value, validation rule, error
 * message, and interaction state.
 *
 * A field is commonly considered in multiple states: its current value, whether the user has
 * interacted with it, whether it is currently valid, and whether an error should be displayed.
 * Keeping these concerns explicit prevents a common mistake where every validation error is shown
 * immediately, before the user has had an opportunity to interact with the field.
 */

import React from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface FieldValidationNameProps {
  readonly initialName: string;
}

export interface FieldValidationEmailProps {
  readonly initialEmail: string;
}

export interface FieldValidationPasswordProps {
  readonly initialPassword: string;
}

export interface FieldValidationFormProps {
  readonly initialName: string;
  readonly initialEmail: string;
  readonly initialPassword: string;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

export const FieldValidationName: React.FC<FieldValidationNameProps> = ({ initialName }): React.ReactElement => {
  const [name, setName] = React.useState<string>(initialName);
  const [touched, setTouched] = React.useState<boolean>(false);

  const error: string = touched && name.trim() === "" ? "Name is required." : "";

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setName(event.target.value);
  };

  const handleBlur = (): void => {
    setTouched(true);
  };

  return (
    <div>
      <label>
        Name
        <input
          type="text"
          name="name"
          value={name}
          onChange={handleChange}
          onBlur={handleBlur}
          aria-invalid={error !== ""}
        />
      </label>

      {error !== "" && <p>{error}</p>}
    </div>
  );
};

export const FieldValidationEmail: React.FC<FieldValidationEmailProps> = ({ initialEmail }): React.ReactElement => {
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

export const FieldValidationPassword: React.FC<FieldValidationPasswordProps> = ({
  initialPassword,
}): React.ReactElement => {
  const [password, setPassword] = React.useState<string>(initialPassword);
  const [touched, setTouched] = React.useState<boolean>(false);

  const validatePassword = (value: string): string => {
    if (value.length === 0) {
      return "Password is required.";
    }

    if (value.length < 8) {
      return "Password must contain at least 8 characters.";
    }

    return "";
  };

  const error: string = touched ? validatePassword(password) : "";

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setPassword(event.target.value);
  };

  const handleBlur = (): void => {
    setTouched(true);
  };

  return (
    <div>
      <label>
        Password
        <input
          type="password"
          name="password"
          value={password}
          onChange={handleChange}
          onBlur={handleBlur}
          aria-invalid={error !== ""}
        />
      </label>

      {error !== "" && <p>{error}</p>}
    </div>
  );
};

export const FieldValidationForm: React.FC<FieldValidationFormProps> = ({
  initialName,
  initialEmail,
  initialPassword,
}): React.ReactElement => {
  const [name, setName] = React.useState<string>(initialName);
  const [email, setEmail] = React.useState<string>(initialEmail);
  const [password, setPassword] = React.useState<string>(initialPassword);
  const [submitted, setSubmitted] = React.useState<boolean>(false);

  const validateName = (value: string): string => {
    return value.trim() === "" ? "Name is required." : "";
  };

  const validateEmail = (value: string): string => {
    const normalizedEmail: string = value.trim();

    if (normalizedEmail === "") {
      return "Email is required.";
    }

    if (!normalizedEmail.includes("@")) {
      return "Email must contain @.";
    }

    return "";
  };

  const validatePassword = (value: string): string => {
    if (value.length === 0) {
      return "Password is required.";
    }

    if (value.length < 8) {
      return "Password must contain at least 8 characters.";
    }

    return "";
  };

  const nameError: string = validateName(name);
  const emailError: string = validateEmail(email);
  const passwordError: string = validatePassword(password);

  const isFormValid: boolean = nameError === "" && emailError === "" && passwordError === "";

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    setSubmitted(true);

    if (!isFormValid) {
      return;
    }

    console.log("All fields are valid.");
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

      <button type="submit">Submit</button>

      {submitted && isFormValid && <p>All fields passed validation.</p>}
    </form>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const MainContainer: React.FC = (): React.ReactElement => {
  return (
    <main>
      <h1>Field Validation</h1>

      <h2>1. Validating an Individual Required Field</h2>
      <FieldValidationName initialName="" />

      <h2>2. Validating an Individual Email Field</h2>
      <FieldValidationEmail initialEmail="" />

      <h2>3. Validating an Individual Password Field</h2>
      <FieldValidationPassword initialPassword="" />

      <h2>4. Combining Independent Field Validation</h2>
      <FieldValidationForm initialName="" initialEmail="" initialPassword="" />
    </main>
  );
};

export default MainContainer;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Field validation treats each form control as an independent validation unit.
// - Each field can have its own value, validation function, interaction state, and error message.
// - A touched state can prevent errors from being displayed before the user interacts with a field.
// - Field validity can be derived directly from the current field value instead of stored separately.
// - A form is valid when all required field validation results indicate no errors.
// - Submission should still validate every field rather than relying only on individual interaction events.
// - `aria-invalid` can expose an invalid field state to assistive technologies.
// - Keeping field errors separate prevents one field's validation state from implicitly controlling another field.
