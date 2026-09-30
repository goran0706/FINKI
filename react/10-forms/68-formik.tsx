/**
 * Formik
 * ======
 *
 * Formik is a third-party React form library that centralizes form values, validation,
 * submission state, and field metadata. A Formik form is typically created with
 * `useFormik`, `<Formik>`, or `<Form>`, while fields can be connected through the
 * `Field` component or the `useField` hook.
 *
 * Unlike libraries that primarily optimize around uncontrolled inputs, Formik commonly
 * keeps form values in React state. Changes therefore flow through Formik's state
 * management, and derived state such as `errors`, `touched`, `isSubmitting`, and
 * `isValid` can be used to drive the UI.
 */

import React from "react";
import { ErrorMessage, Field, Form, Formik, type FormikHelpers, useField, useFormik } from "formik";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface BasicFormikValues {
  readonly firstName: string;
  readonly email: string;
}

export interface ValidationFormikValues {
  readonly username: string;
  readonly email: string;
}

export interface FieldFormikValues {
  readonly displayName: string;
}

export interface SubmissionFormikValues {
  readonly email: string;
}

export interface CustomFieldProps {
  readonly name: string;
  readonly label: string;
}

export interface FormikValidationErrors {
  readonly username?: string;
  readonly email?: string;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * `useFormik` creates a Formik instance containing the form values, event
 * handlers, validation state, and submission behavior.
 */
export const FormikBasic: React.FC = (): React.ReactElement => {
  const formik = useFormik<BasicFormikValues>({
    initialValues: {
      firstName: "",
      email: "",
    },
    onSubmit: (values: BasicFormikValues, _helpers: FormikHelpers<BasicFormikValues>): void => {
      console.log("Submitted values:", values);
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <label>
        First name
        <input
          name="firstName"
          value={formik.values.firstName}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
      </label>

      <label>
        Email
        <input
          name="email"
          type="email"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
      </label>

      <button type="submit">Submit</button>
    </form>
  );
};

/**
 * Formik can perform synchronous validation through a `validate` function.
 * The returned object maps field names to validation messages.
 */
export const FormikValidation: React.FC = (): React.ReactElement => {
  const validate = (values: ValidationFormikValues): FormikValidationErrors => {
    const errors: FormikValidationErrors = {};

    if (values.username.trim() === "") {
      errors.username = "Username is required.";
    } else if (values.username.trim().length < 3) {
      errors.username = "Username must contain at least 3 characters.";
    }

    if (values.email.trim() === "") {
      errors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      errors.email = "Enter a valid email address.";
    }

    return errors;
  };

  const formik = useFormik<ValidationFormikValues>({
    initialValues: {
      username: "",
      email: "",
    },
    validate,
    onSubmit: (values: ValidationFormikValues, _helpers: FormikHelpers<ValidationFormikValues>): void => {
      console.log("Valid form:", values);
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <label>
        Username
        <input
          name="username"
          value={formik.values.username}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
      </label>

      {formik.touched.username && formik.errors.username && <p role="alert">{formik.errors.username}</p>}

      <label>
        Email
        <input
          name="email"
          type="email"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
      </label>

      {formik.touched.email && formik.errors.email && <p role="alert">{formik.errors.email}</p>}

      <button type="submit">Submit</button>
    </form>
  );
};

/**
 * `Field` connects a form control to Formik using the field's `name`.
 * Formik supplies the field value and event handlers through the render
 * function.
 */
export const FormikFieldComponent: React.FC = (): React.ReactElement => {
  const formik = useFormik<BasicFormikValues>({
    initialValues: {
      firstName: "",
      email: "",
    },
    onSubmit: (values: BasicFormikValues, _helpers: FormikHelpers<BasicFormikValues>): void => {
      console.log("Field component submission:", values);
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <label>
        First name
        <Field name="firstName" />
      </label>

      <label>
        Email
        <Field name="email" type="email" />
      </label>

      <button type="submit">Submit</button>
    </form>
  );
};

/**
 * `<Formik>` provides the form state through React context. `<Form>` is a
 * Formik-aware form element that automatically connects its submission
 * behavior to the surrounding Formik context.
 */
export const FormikContextComponents: React.FC = (): React.ReactElement => {
  return (
    <Formik<BasicFormikValues>
      initialValues={{
        firstName: "",
        email: "",
      }}
      onSubmit={(values: BasicFormikValues, _helpers: FormikHelpers<BasicFormikValues>): void => {
        console.log("Context-based submission:", values);
      }}
    >
      <Form>
        <label>
          First name
          <Field name="firstName" />
        </label>

        <label>
          Email
          <Field name="email" type="email" />
        </label>

        <button type="submit">Submit</button>
      </Form>
    </Formik>
  );
};

/**
 * `ErrorMessage` renders the validation message associated with a field.
 * It is normally paired with validation and touched state so that errors
 * are shown after the user has interacted with the field.
 */
export const FormikErrorMessage: React.FC = (): React.ReactElement => {
  const validateEmail = (value: string): string | undefined => {
    if (value.trim() === "") {
      return "Email is required.";
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return "Enter a valid email address.";
    }

    return undefined;
  };

  return (
    <Formik<BasicFormikValues>
      initialValues={{
        firstName: "",
        email: "",
      }}
      onSubmit={(values: BasicFormikValues, _helpers: FormikHelpers<BasicFormikValues>): void => {
        console.log("Error-message submission:", values);
      }}
    >
      <Form>
        <label>
          First name
          <Field name="firstName" />
        </label>

        <label>
          Email
          <Field name="email" type="email" validate={validateEmail} />
        </label>

        <ErrorMessage
          name="email"
          component="p"
          render={(message: string): React.ReactElement => <span role="alert">{message}</span>}
        />

        <button type="submit">Submit</button>
      </Form>
    </Formik>
  );
};

/**
 * `useField` connects a custom component to Formik. It returns field props,
 * metadata such as the current error and touched state, and helper methods
 * for updating the field.
 */
export const FormikCustomField: React.FC<CustomFieldProps> = ({ name, label }): React.ReactElement => {
  const [field, meta, helpers] = useField<string>(name);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    helpers.setValue(event.target.value);
  };

  return (
    <div>
      <label>
        {label}
        <input {...field} onChange={handleChange} aria-invalid={meta.touched && meta.error ? true : undefined} />
      </label>

      {meta.touched && meta.error && <p role="alert">{meta.error}</p>}
    </div>
  );
};

/**
 * Formik tracks submission state separately from the field values. An async
 * `onSubmit` function can await external work, after which Formik resolves
 * the submission cycle and updates `isSubmitting`.
 */
export const FormikSubmissionState: React.FC = (): React.ReactElement => {
  const formik = useFormik<SubmissionFormikValues>({
    initialValues: {
      email: "",
    },
    onSubmit: async (
      values: SubmissionFormikValues,
      _helpers: FormikHelpers<SubmissionFormikValues>,
    ): Promise<void> => {
      await new Promise<void>((resolve: () => void): void => {
        window.setTimeout(resolve, 500);
      });

      console.log("Submitted:", values);
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <label>
        Email
        <input
          name="email"
          type="email"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
      </label>

      <button type="submit" disabled={formik.isSubmitting}>
        {formik.isSubmitting ? "Submitting..." : "Submit"}
      </button>

      {formik.isSubmitting && <p role="status">Submission is in progress.</p>}
    </form>
  );
};

/**
 * Formik's state is centralized, so using both Formik state and separate
 * `useState` state for the same field creates two competing sources of truth.
 * A separate state variable is appropriate only when it represents distinct
 * UI state rather than a duplicate of a Formik field value.
 */
export const FormikSingleSourceOfTruth: React.FC = (): React.ReactElement => {
  const formik = useFormik<BasicFormikValues>({
    initialValues: {
      firstName: "",
      email: "",
    },
    onSubmit: (values: BasicFormikValues, _helpers: FormikHelpers<BasicFormikValues>): void => {
      console.log("Single source of truth:", values);
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <label>
        First name
        <input name="firstName" value={formik.values.firstName} onChange={formik.handleChange} />
      </label>

      <label>
        Email
        <input name="email" type="email" value={formik.values.email} onChange={formik.handleChange} />
      </label>

      <button type="submit">Submit</button>
    </form>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const FormikExamples: React.FC = (): React.ReactElement => {
  return (
    <div>
      <h1>Formik</h1>

      <h2>1. Managing Form State with useFormik</h2>
      <FormikBasic />

      <h2>2. Form-Level Validation</h2>
      <FormikValidation />

      <h2>3. Connecting Fields with Field</h2>
      <FormikFieldComponent />

      <h2>4. Using Formik Context Components</h2>
      <FormikContextComponents />

      <h2>5. Displaying Validation Errors</h2>
      <FormikErrorMessage />

      <h2>6. Building Custom Fields with useField</h2>
      <FormikCustomField name="displayName" label="Display name" />

      <h2>7. Tracking Asynchronous Submission State</h2>
      <FormikSubmissionState />

      <h2>8. Keeping Formik as the Field State Source</h2>
      <FormikSingleSourceOfTruth />
    </div>
  );
};

export default FormikExamples;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Formik centralizes form values, validation, metadata, and submission state.
// - `useFormik` creates a form instance and exposes handlers and derived state.
// - `Formik` provides form state through React context.
// - `Field` connects standard form controls to Formik.
// - `useField` provides the field props, metadata, and helpers needed by custom inputs.
// - `Form` connects a native form element to the surrounding Formik context.
// - `validate` can return field-specific validation messages.
// - `ErrorMessage` can render validation messages associated with named fields.
// - `isSubmitting` represents the active submission cycle.
// - Formik-managed field values should not be duplicated in separate React state.
