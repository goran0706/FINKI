/**
 * React Hook Form
 * ===============
 *
 * React Hook Form is a third-party form library that manages form values, validation,
 * submission, and field registration with an API designed to minimize unnecessary
 * React re-renders. Instead of requiring every input to be controlled with `useState`,
 * fields can register themselves with the form instance and the library can track their
 * values independently of React component state.
 *
 * The central `useForm` hook creates the form instance, `register` connects native inputs
 * to that instance, `handleSubmit` coordinates validation and submission, and `formState`
 * exposes derived information such as validation errors, dirty state, and submission status.
 * Validation can be declared directly through registration options or through resolver-based
 * schema validation when an external validation library is used.
 */

import React from "react";
import { type FieldErrors, type SubmitHandler, useForm } from "react-hook-form";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface BasicFormValues {
  readonly firstName: string;
  readonly email: string;
}

export interface ValidationFormValues {
  readonly username: string;
  readonly email: string;
}

export interface DefaultValuesFormValues {
  readonly firstName: string;
  readonly country: string;
}

export interface SubmissionStateFormValues {
  readonly email: string;
}

export interface FormErrorDisplayProps {
  readonly errors: FieldErrors<ValidationFormValues>;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * `register` connects an input to the React Hook Form instance. It returns
 * the props required for registration, including the field name, ref, and
 * event handlers used by the library to observe the input.
 */
export const ReactHookFormBasic: React.FC = (): React.ReactElement => {
  const { register, handleSubmit } = useForm<BasicFormValues>();

  const onSubmit: SubmitHandler<BasicFormValues> = (data: BasicFormValues): void => {
    console.log("Submitted values:", data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <label>
        First name
        <input {...register("firstName")} />
      </label>

      <label>
        Email
        <input type="email" {...register("email")} />
      </label>

      <button type="submit">Submit</button>
    </form>
  );
};

/**
 * Registration options can perform common validation without manually
 * writing an `onChange` handler or separate state for every field.
 */
export const ReactHookFormValidation: React.FC = (): React.ReactElement => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ValidationFormValues>();

  const onSubmit: SubmitHandler<ValidationFormValues> = (data: ValidationFormValues): void => {
    console.log("Valid form:", data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <label>
        Username
        <input
          {...register("username", {
            required: "Username is required.",
            minLength: {
              value: 3,
              message: "Username must contain at least 3 characters.",
            },
          })}
        />
      </label>

      {errors.username && <p role="alert">{errors.username.message}</p>}

      <label>
        Email
        <input
          type="email"
          {...register("email", {
            required: "Email is required.",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Enter a valid email address.",
            },
          })}
        />
      </label>

      {errors.email && <p role="alert">{errors.email.message}</p>}

      <button type="submit">Submit</button>
    </form>
  );
};

/**
 * `defaultValues` initializes the form's values without requiring separate
 * React state. These values also establish the baseline used by React Hook
 * Form when calculating dirty-state information.
 */
export const ReactHookFormDefaultValues: React.FC = (): React.ReactElement => {
  const {
    register,
    handleSubmit,
    formState: { isDirty },
  } = useForm<DefaultValuesFormValues>({
    defaultValues: {
      firstName: "Alex",
      country: "North Macedonia",
    },
  });

  const onSubmit: SubmitHandler<DefaultValuesFormValues> = (data: DefaultValuesFormValues): void => {
    console.log("Default-value form:", data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <label>
        First name
        <input {...register("firstName")} />
      </label>

      <label>
        Country
        <input {...register("country")} />
      </label>

      <p>{isDirty ? "The form has changes." : "The form matches its defaults."}</p>

      <button type="submit">Submit</button>
    </form>
  );
};

/**
 * `handleSubmit` receives a callback for valid data and can also receive a
 * second callback for validation failures. The invalid callback is useful
 * when the application needs to react to submission-level validation errors.
 */
export const ReactHookFormInvalidSubmission: React.FC = (): React.ReactElement => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ValidationFormValues>();

  const onValid: SubmitHandler<ValidationFormValues> = (data: ValidationFormValues): void => {
    console.log("Valid submission:", data);
  };

  const onInvalid = (fieldErrors: FieldErrors<ValidationFormValues>): void => {
    console.log("Invalid submission:", fieldErrors);
  };

  return (
    <form onSubmit={handleSubmit(onValid, onInvalid)}>
      <label>
        Username
        <input
          {...register("username", {
            required: "Username is required.",
          })}
        />
      </label>

      {errors.username && <p role="alert">{errors.username.message}</p>}

      <label>
        Email
        <input
          type="email"
          {...register("email", {
            required: "Email is required.",
          })}
        />
      </label>

      {errors.email && <p role="alert">{errors.email.message}</p>}

      <button type="submit">Submit</button>
    </form>
  );
};

/**
 * `formState` contains derived information about the current form. Reading
 * only the properties needed by a component allows React Hook Form to
 * optimize when that component needs to re-render.
 */
export const ReactHookFormSubmissionState: React.FC = (): React.ReactElement => {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, isSubmitted, isSubmitSuccessful },
  } = useForm<SubmissionStateFormValues>();

  const onSubmit: SubmitHandler<SubmissionStateFormValues> = async (data: SubmissionStateFormValues): Promise<void> => {
    await new Promise<void>((resolve: () => void): void => {
      window.setTimeout(resolve, 500);
    });

    console.log("Submitted:", data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <label>
        Email
        <input
          type="email"
          {...register("email", {
            required: "Email is required.",
          })}
        />
      </label>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Submit"}
      </button>

      {isSubmitted && <p>The form has been submitted.</p>}

      {isSubmitSuccessful && <p role="status">Submission completed successfully.</p>}
    </form>
  );
};

/**
 * A registered field is not automatically controlled by React state. This
 * is a common misconception: `register` does not mean that every keystroke
 * must update a component's `useState` value.
 *
 * React Hook Form can still expose the current value when it is needed, but
 * applications should not create redundant local state merely to mirror every
 * registered field.
 */
export const ReactHookFormUncontrolledModel: React.FC = (): React.ReactElement => {
  const { register, handleSubmit } = useForm<BasicFormValues>();

  const onSubmit: SubmitHandler<BasicFormValues> = (data: BasicFormValues): void => {
    console.log("Form values are collected on submission:", data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <label>
        First name
        <input {...register("firstName")} />
      </label>

      <label>
        Email
        <input type="email" {...register("email")} />
      </label>

      <button type="submit">Read form values</button>
    </form>
  );
};

/**
 * Validation errors are stored by field name. The error object should be
 * treated as derived form state rather than as a replacement for the actual
 * field values.
 */
export const ReactHookFormErrorDisplay: React.FC<FormErrorDisplayProps> = ({ errors }): React.ReactElement => {
  return (
    <div>
      {errors.username && <p role="alert">Username: {errors.username.message}</p>}

      {errors.email && <p role="alert">Email: {errors.email.message}</p>}
    </div>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const ReactHookFormExamples: React.FC = (): React.ReactElement => {
  return (
    <div>
      <h1>React Hook Form</h1>

      <h2>1. Registering Form Fields</h2>
      <ReactHookFormBasic />

      <h2>2. Declarative Field Validation</h2>
      <ReactHookFormValidation />

      <h2>3. Default Form Values</h2>
      <ReactHookFormDefaultValues />

      <h2>4. Handling Invalid Submissions</h2>
      <ReactHookFormInvalidSubmission />

      <h2>5. Submission State</h2>
      <ReactHookFormSubmissionState />

      <h2>6. Uncontrolled Form Management</h2>
      <ReactHookFormUncontrolledModel />
    </div>
  );
};

export default ReactHookFormExamples;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - `useForm` creates and manages a React Hook Form instance.
// - `register` connects native form controls to the form instance.
// - Registered fields can be managed without mirroring every value in `useState`.
// - `handleSubmit` runs validation before invoking the valid submission callback.
// - Registration options support common field-level validation rules.
// - `formState.errors` contains validation errors associated with individual fields.
// - `defaultValues` initializes fields and establishes their initial form values.
// - `formState` exposes derived information such as dirty and submission state.
// - A second `handleSubmit` callback can handle invalid submissions.
// - React Hook Form is a third-party library and must be installed separately from React.
