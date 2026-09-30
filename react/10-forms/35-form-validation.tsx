/**
 * Form Validation
 * ================
 *
 * Form validation evaluates whether the complete set of form values satisfies the application's
 * validation rules before the form is accepted. Individual fields can have their own validation
 * rules, while form-level validation combines those results to determine whether submission may
 * continue.
 *
 * Form-level validation is useful when validity depends on multiple fields or when the application
 * needs one consistent validation pass before submission. A validation result can contain errors
 * for individual fields as well as form-level errors that describe problems involving the form as
 * a whole.
 *
 * Validation should be derived from the current values rather than duplicated as independent
 * boolean state. This avoids contradictory states such as a field value changing while an older
 * `isValid` flag still describes the previous value.
 */

import React from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface FormValidationValues {
  readonly name: string;
  readonly email: string;
  readonly password: string;
}

export interface FormValidationErrors {
  readonly name: string;
  readonly email: string;
  readonly password: string;
  readonly form: string;
}

export interface FormValidationBasicProps {
  readonly initialValues: FormValidationValues;
}

export interface FormValidationCrossFieldProps {
  readonly initialPassword: string;
  readonly initialConfirmation: string;
}

export interface FormValidationSubmitProps {
  readonly initialValues: FormValidationValues;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

export const FormValidationBasic: React.FC<FormValidationBasicProps> = ({ initialValues }): React.ReactElement => {
  const [values, setValues] = React.useState<FormValidationValues>(initialValues);
  const [submitted, setSubmitted] = React.useState<boolean>(false);

  const validateForm = (formValues: FormValidationValues): FormValidationErrors => {
    return {
      name: formValues.name.trim() === "" ? "Name is required." : "",
      email:
        formValues.email.trim() === ""
          ? "Email is required."
          : !formValues.email.includes("@")
            ? "Enter a valid email address."
            : "",
      password: formValues.password.length < 8 ? "Password must contain at least 8 characters." : "",
      form: "",
    };
  };

  const errors: FormValidationErrors = validateForm(values);

  const isValid: boolean = errors.name === "" && errors.email === "" && errors.password === "" && errors.form === "";

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const field: keyof FormValidationValues = event.target.name as keyof FormValidationValues;

    setValues((previousValues: FormValidationValues): FormValidationValues => ({
      ...previousValues,
      [field]: event.target.value,
    }));
  };

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
          value={values.name}
          onChange={handleChange}
          aria-invalid={submitted && errors.name !== ""}
        />
      </label>

      {submitted && errors.name !== "" && <p>{errors.name}</p>}

      <label>
        Email
        <input
          type="email"
          name="email"
          value={values.email}
          onChange={handleChange}
          aria-invalid={submitted && errors.email !== ""}
        />
      </label>

      {submitted && errors.email !== "" && <p>{errors.email}</p>}

      <label>
        Password
        <input
          type="password"
          name="password"
          value={values.password}
          onChange={handleChange}
          aria-invalid={submitted && errors.password !== ""}
        />
      </label>

      {submitted && errors.password !== "" && <p>{errors.password}</p>}

      <button type="submit">Submit</button>

      {submitted && isValid && <p>Form is valid.</p>}
    </form>
  );
};

export const FormValidationCrossField: React.FC<FormValidationCrossFieldProps> = ({
  initialPassword,
  initialConfirmation,
}): React.ReactElement => {
  const [password, setPassword] = React.useState<string>(initialPassword);
  const [confirmation, setConfirmation] = React.useState<string>(initialConfirmation);
  const [submitted, setSubmitted] = React.useState<boolean>(false);

  const validateForm = (): string => {
    if (password.length < 8) {
      return "Password must contain at least 8 characters.";
    }

    if (password !== confirmation) {
      return "Password and confirmation must match.";
    }

    return "";
  };

  const error: string = validateForm();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    setSubmitted(true);

    if (error !== "") {
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

      {submitted && error !== "" && <p>{error}</p>}

      <button type="submit">Submit</button>
    </form>
  );
};

export const FormValidationSubmit: React.FC<FormValidationSubmitProps> = ({ initialValues }): React.ReactElement => {
  const [values, setValues] = React.useState<FormValidationValues>(initialValues);
  const [errors, setErrors] = React.useState<FormValidationErrors>({
    name: "",
    email: "",
    password: "",
    form: "",
  });

  const validateForm = (formValues: FormValidationValues): FormValidationErrors => {
    const nameError: string = formValues.name.trim() === "" ? "Name is required." : "";

    const emailError: string =
      formValues.email.trim() === ""
        ? "Email is required."
        : !formValues.email.includes("@")
          ? "Enter a valid email address."
          : "";

    const passwordError: string = formValues.password.length < 8 ? "Password must contain at least 8 characters." : "";

    const formError: string =
      passwordError === "" && formValues.password.toLowerCase().includes(formValues.name.trim().toLowerCase())
        ? "Password must not contain your name."
        : "";

    return {
      name: nameError,
      email: emailError,
      password: passwordError,
      form: formError,
    };
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const field: keyof FormValidationValues = event.target.name as keyof FormValidationValues;

    setValues((previousValues: FormValidationValues): FormValidationValues => ({
      ...previousValues,
      [field]: event.target.value,
    }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    const nextErrors: FormValidationErrors = validateForm(values);

    setErrors(nextErrors);

    const isValid: boolean =
      nextErrors.name === "" && nextErrors.email === "" && nextErrors.password === "" && nextErrors.form === "";

    if (!isValid) {
      return;
    }

    console.log("Validated form values:", values);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Name
        <input type="text" name="name" value={values.name} onChange={handleChange} aria-invalid={errors.name !== ""} />
      </label>

      {errors.name !== "" && <p>{errors.name}</p>}

      <label>
        Email
        <input
          type="email"
          name="email"
          value={values.email}
          onChange={handleChange}
          aria-invalid={errors.email !== ""}
        />
      </label>

      {errors.email !== "" && <p>{errors.email}</p>}

      <label>
        Password
        <input
          type="password"
          name="password"
          value={values.password}
          onChange={handleChange}
          aria-invalid={errors.password !== ""}
        />
      </label>

      {errors.password !== "" && <p>{errors.password}</p>}

      {errors.form !== "" && <p>{errors.form}</p>}

      <button type="submit">Validate and Submit</button>
    </form>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const MainContainer: React.FC = (): React.ReactElement => {
  const initialValues: FormValidationValues = {
    name: "",
    email: "",
    password: "",
  };

  return (
    <main>
      <h1>Form Validation</h1>

      <h2>1. Validating the Complete Form</h2>
      <FormValidationBasic initialValues={initialValues} />

      <h2>2. Validating Relationships Between Fields</h2>
      <FormValidationCrossField initialPassword="" initialConfirmation="" />

      <h2>3. Validating Before Accepting Submission</h2>
      <FormValidationSubmit initialValues={initialValues} />
    </main>
  );
};

export default MainContainer;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Form validation evaluates the complete set of form values before accepting submission.
// - Individual field errors can be combined into one form validation result.
// - Form-level validation can enforce rules that involve multiple fields.
// - Cross-field validation can compare values such as a password and its confirmation.
// - Validation results should be derived from current values rather than duplicated validity booleans.
// - A validation function can return structured field-level and form-level errors.
// - The submit handler should validate the current values before performing the submission action.
// - `event.preventDefault()` prevents the browser's default submission while React performs application validation.
// - `aria-invalid` can communicate the invalid state of individual controls to assistive technologies.
// - A form can be considered valid only when all applicable validation errors are empty.
