/**
 * Cross-Field Validation
 * ======================
 *
 * Cross-field validation applies a validation rule that depends on the values of two or more
 * form controls. Unlike field-level validation, where one value can be validated independently,
 * cross-field validation must evaluate related values together.
 *
 * Common examples include matching password and confirmation fields, validating that a minimum
 * value does not exceed a maximum value, and requiring one field when another field has a
 * particular value. The validation result should be derived from the current values so that
 * changing either related field immediately produces the correct validation state.
 */

import React from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface CrossFieldPasswordProps {
  readonly initialPassword: string;
  readonly initialConfirmation: string;
}

export interface CrossFieldRangeProps {
  readonly initialMinimum: number;
  readonly initialMaximum: number;
}

export interface CrossFieldConditionalProps {
  readonly initialContactMethod: "email" | "phone";
  readonly initialEmail: string;
  readonly initialPhone: string;
}

export interface CrossFieldFormProps {
  readonly initialPassword: string;
  readonly initialConfirmation: string;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

export const CrossFieldPassword: React.FC<CrossFieldPasswordProps> = ({
  initialPassword,
  initialConfirmation,
}): React.ReactElement => {
  const [password, setPassword] = React.useState<string>(initialPassword);
  const [confirmation, setConfirmation] = React.useState<string>(initialConfirmation);
  const [touched, setTouched] = React.useState<boolean>(false);

  const error: string = touched && password !== confirmation ? "Passwords must match." : "";

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    setTouched(true);

    if (password !== confirmation) {
      return;
    }

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
          aria-invalid={error !== ""}
        />
      </label>

      {error !== "" && <p>{error}</p>}

      <button type="submit">Submit</button>
    </form>
  );
};

export const CrossFieldRange: React.FC<CrossFieldRangeProps> = ({
  initialMinimum,
  initialMaximum,
}): React.ReactElement => {
  const [minimum, setMinimum] = React.useState<number>(initialMinimum);
  const [maximum, setMaximum] = React.useState<number>(initialMaximum);
  const [submitted, setSubmitted] = React.useState<boolean>(false);

  const error: string = minimum > maximum ? "Minimum cannot be greater than maximum." : "";

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    setSubmitted(true);

    if (error !== "") {
      return;
    }

    console.log("Range is valid:", {
      minimum,
      maximum,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Minimum
        <input
          type="number"
          name="minimum"
          value={minimum}
          onChange={(event: React.ChangeEvent<HTMLInputElement>): void => {
            setMinimum(event.target.valueAsNumber);
          }}
          aria-invalid={submitted && error !== ""}
        />
      </label>

      <label>
        Maximum
        <input
          type="number"
          name="maximum"
          value={maximum}
          onChange={(event: React.ChangeEvent<HTMLInputElement>): void => {
            setMaximum(event.target.valueAsNumber);
          }}
          aria-invalid={submitted && error !== ""}
        />
      </label>

      {submitted && error !== "" && <p>{error}</p>}

      <button type="submit">Submit</button>
    </form>
  );
};

export const CrossFieldConditional: React.FC<CrossFieldConditionalProps> = ({
  initialContactMethod,
  initialEmail,
  initialPhone,
}): React.ReactElement => {
  const [contactMethod, setContactMethod] = React.useState<"email" | "phone">(initialContactMethod);
  const [email, setEmail] = React.useState<string>(initialEmail);
  const [phone, setPhone] = React.useState<string>(initialPhone);
  const [submitted, setSubmitted] = React.useState<boolean>(false);

  const error: string =
    contactMethod === "email" && email.trim() === ""
      ? "Email is required when email is selected."
      : contactMethod === "phone" && phone.trim() === ""
        ? "Phone is required when phone is selected."
        : "";

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    setSubmitted(true);

    if (error !== "") {
      return;
    }

    console.log("Contact information is valid.");
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Preferred contact method
        <select
          name="contactMethod"
          value={contactMethod}
          onChange={(event: React.ChangeEvent<HTMLSelectElement>): void => {
            setContactMethod(event.target.value as "email" | "phone");
          }}
        >
          <option value="email">Email</option>
          <option value="phone">Phone</option>
        </select>
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
          aria-invalid={submitted && contactMethod === "email" && error !== ""}
        />
      </label>

      <label>
        Phone
        <input
          type="tel"
          name="phone"
          value={phone}
          onChange={(event: React.ChangeEvent<HTMLInputElement>): void => {
            setPhone(event.target.value);
          }}
          aria-invalid={submitted && contactMethod === "phone" && error !== ""}
        />
      </label>

      {submitted && error !== "" && <p>{error}</p>}

      <button type="submit">Submit</button>
    </form>
  );
};

export const CrossFieldForm: React.FC<CrossFieldFormProps> = ({
  initialPassword,
  initialConfirmation,
}): React.ReactElement => {
  const [password, setPassword] = React.useState<string>(initialPassword);
  const [confirmation, setConfirmation] = React.useState<string>(initialConfirmation);
  const [submitted, setSubmitted] = React.useState<boolean>(false);

  const passwordError: string = password.length < 8 ? "Password must contain at least 8 characters." : "";

  const confirmationError: string = confirmation !== password ? "Passwords must match." : "";

  const isValid: boolean = passwordError === "" && confirmationError === "";

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    setSubmitted(true);

    if (!isValid) {
      return;
    }

    console.log("Cross-field validation passed.");
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
          aria-invalid={submitted && passwordError !== ""}
        />
      </label>

      {submitted && passwordError !== "" && <p>{passwordError}</p>}

      <label>
        Confirm password
        <input
          type="password"
          name="confirmation"
          value={confirmation}
          onChange={(event: React.ChangeEvent<HTMLInputElement>): void => {
            setConfirmation(event.target.value);
          }}
          aria-invalid={submitted && confirmationError !== ""}
        />
      </label>

      {submitted && confirmationError !== "" && <p>{confirmationError}</p>}

      <button type="submit">Submit</button>

      {submitted && isValid && <p>All cross-field validation passed.</p>}
    </form>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const MainContainer: React.FC = (): React.ReactElement => {
  return (
    <main>
      <h1>Cross-Field Validation</h1>

      <h2>1. Matching Related Field Values</h2>
      <CrossFieldPassword initialPassword="password123" initialConfirmation="password123" />

      <h2>2. Comparing Numeric Fields</h2>
      <CrossFieldRange initialMinimum={10} initialMaximum={100} />

      <h2>3. Conditionally Requiring a Related Field</h2>
      <CrossFieldConditional initialContactMethod="email" initialEmail="" initialPhone="" />

      <h2>4. Combining Field and Cross-Field Rules</h2>
      <CrossFieldForm initialPassword="" initialConfirmation="" />
    </main>
  );
};

export default MainContainer;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Cross-field validation evaluates two or more related form values together.
// - Password confirmation is valid only when the confirmation matches the current password.
// - Numeric fields can be compared to enforce relationships such as minimum <= maximum.
// - One field can determine whether another field is required.
// - Cross-field errors should be derived from the current values of all participating fields.
// - Changing either related field can therefore change the validation result.
// - Field-specific errors and cross-field errors can coexist in the same form.
// - Validation should occur again during submission so the submitted values are validated as a complete set.
// - `aria-invalid` can identify controls whose current values participate in an invalid relationship.
