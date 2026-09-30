/**
 * TanStack Form
 * =============
 *
 * TanStack Form is a headless, type-safe form library that manages form values,
 * field state, validation, and submission while leaving the rendered markup and
 * styling to the application. Its React adapter exposes `useForm`, whose form
 * instance provides field components, submission methods, subscriptions, and
 * access to the underlying form state.
 *
 * Fields are connected through `form.Field`. Each field receives its current
 * value and field API through a render function, and validation can be attached
 * directly to the field or to the form. Validation is explicitly associated
 * with lifecycle events such as `onChange`, `onBlur`, and `onSubmit`, while
 * `form.Subscribe` can select specific pieces of form state without making the
 * entire component depend on every form-state update.
 *
 * Install the React adapter with `npm install @tanstack/react-form`.
 */

import React from "react";
import { useForm } from "@tanstack/react-form";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface BasicTanStackFormValues {
  readonly firstName: string;
  readonly email: string;
}

export interface ValidationTanStackFormValues {
  readonly username: string;
  readonly email: string;
}

export interface SubmissionTanStackFormValues {
  readonly email: string;
}

export interface FormLevelTanStackFormValues {
  readonly firstName: string;
  readonly lastName: string;
}

export interface AsyncValidationTanStackFormValues {
  readonly username: string;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * `useForm` creates the form instance. `form.Field` then connects individual
 * inputs to that instance while preserving type safety for the field names
 * and their corresponding values.
 */
export const TanStackFormBasic: React.FC = (): React.ReactElement => {
  const form = useForm<BasicTanStackFormValues>({
    defaultValues: {
      firstName: "",
      email: "",
    },
    onSubmit: ({ value }): void => {
      console.log("Submitted values:", value);
    },
  });

  return (
    <form
      onSubmit={(event: React.FormEvent<HTMLFormElement>): void => {
        event.preventDefault();
        void form.handleSubmit();
      }}
    >
      <form.Field name="firstName">
        {(field): React.ReactElement => (
          <label>
            First name
            <input
              id={field.name}
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(event: React.ChangeEvent<HTMLInputElement>): void => {
                field.handleChange(event.target.value);
              }}
            />
          </label>
        )}
      </form.Field>

      <form.Field name="email">
        {(field): React.ReactElement => (
          <label>
            Email
            <input
              id={field.name}
              name={field.name}
              type="email"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(event: React.ChangeEvent<HTMLInputElement>): void => {
                field.handleChange(event.target.value);
              }}
            />
          </label>
        )}
      </form.Field>

      <button type="submit">Submit</button>
    </form>
  );
};

/**
 * Field-level validators can run on specific lifecycle events. Here the
 * username is validated whenever its value changes, while the email is
 * validated when the field loses focus.
 */
export const TanStackFormValidation: React.FC = (): React.ReactElement => {
  const form = useForm<ValidationTanStackFormValues>({
    defaultValues: {
      username: "",
      email: "",
    },
    onSubmit: ({ value }): void => {
      console.log("Valid form:", value);
    },
  });

  return (
    <form
      onSubmit={(event: React.FormEvent<HTMLFormElement>): void => {
        event.preventDefault();
        void form.handleSubmit();
      }}
    >
      <form.Field
        name="username"
        validators={{
          onChange: ({ value }): string | undefined => {
            if (value.trim() === "") {
              return "Username is required.";
            }

            if (value.trim().length < 3) {
              return "Username must contain at least 3 characters.";
            }

            return undefined;
          },
        }}
      >
        {(field): React.ReactElement => (
          <div>
            <label>
              Username
              <input
                id={field.name}
                name={field.name}
                value={field.state.value}
                onChange={(event: React.ChangeEvent<HTMLInputElement>): void => {
                  field.handleChange(event.target.value);
                }}
                onBlur={field.handleBlur}
                aria-invalid={field.state.meta.isValid ? undefined : true}
              />
            </label>

            {!field.state.meta.isValid && <p role="alert">{field.state.meta.errors.join(", ")}</p>}
          </div>
        )}
      </form.Field>

      <form.Field
        name="email"
        validators={{
          onBlur: ({ value }): string | undefined => {
            if (value.trim() === "") {
              return "Email is required.";
            }

            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
              return "Enter a valid email address.";
            }

            return undefined;
          },
        }}
      >
        {(field): React.ReactElement => (
          <div>
            <label>
              Email
              <input
                id={field.name}
                name={field.name}
                type="email"
                value={field.state.value}
                onChange={(event: React.ChangeEvent<HTMLInputElement>): void => {
                  field.handleChange(event.target.value);
                }}
                onBlur={field.handleBlur}
                aria-invalid={field.state.meta.isValid ? undefined : true}
              />
            </label>

            {!field.state.meta.isValid && <p role="alert">{field.state.meta.errors.join(", ")}</p>}
          </div>
        )}
      </form.Field>

      <button type="submit">Submit</button>
    </form>
  );
};

/**
 * Form-level validators operate on the complete form value instead of being
 * attached to one field. This is useful when a rule depends on multiple
 * fields, such as requiring two names to differ.
 */
export const TanStackFormLevelValidation: React.FC = (): React.ReactElement => {
  const form = useForm<FormLevelTanStackFormValues>({
    defaultValues: {
      firstName: "",
      lastName: "",
    },
    validators: {
      onChange: ({ value }): string | undefined => {
        if (
          value.firstName.trim() !== "" &&
          value.lastName.trim() !== "" &&
          value.firstName.trim().toLowerCase() === value.lastName.trim().toLowerCase()
        ) {
          return "First name and last name must be different.";
        }

        return undefined;
      },
    },
    onSubmit: ({ value }): void => {
      console.log("Form-level validation passed:", value);
    },
  });

  return (
    <form
      onSubmit={(event: React.FormEvent<HTMLFormElement>): void => {
        event.preventDefault();
        void form.handleSubmit();
      }}
    >
      <form.Field name="firstName">
        {(field): React.ReactElement => (
          <label>
            First name
            <input
              id={field.name}
              name={field.name}
              value={field.state.value}
              onChange={(event: React.ChangeEvent<HTMLInputElement>): void => {
                field.handleChange(event.target.value);
              }}
            />
          </label>
        )}
      </form.Field>

      <form.Field name="lastName">
        {(field): React.ReactElement => (
          <label>
            Last name
            <input
              id={field.name}
              name={field.name}
              value={field.state.value}
              onChange={(event: React.ChangeEvent<HTMLInputElement>): void => {
                field.handleChange(event.target.value);
              }}
            />
          </label>
        )}
      </form.Field>

      <form.Subscribe selector={(state): string | undefined => state.errorMap.onChange}>
        {(error): React.ReactElement | null => (error ? <p role="alert">{error}</p> : null)}
      </form.Subscribe>

      <button type="submit">Submit</button>
    </form>
  );
};

/**
 * `form.Subscribe` can select a small part of the form state. This allows
 * controls such as a submit button to react specifically to `canSubmit` and
 * `isSubmitting` rather than reading unrelated form state.
 */
export const TanStackFormSubmissionState: React.FC = (): React.ReactElement => {
  const form = useForm<SubmissionTanStackFormValues>({
    defaultValues: {
      email: "",
    },
    onSubmit: async ({ value }): Promise<void> => {
      await new Promise<void>((resolve: () => void): void => {
        window.setTimeout(resolve, 500);
      });

      console.log("Submitted:", value);
    },
  });

  return (
    <form
      onSubmit={(event: React.FormEvent<HTMLFormElement>): void => {
        event.preventDefault();
        void form.handleSubmit();
      }}
    >
      <form.Field
        name="email"
        validators={{
          onChange: ({ value }): string | undefined => {
            if (value.trim() === "") {
              return "Email is required.";
            }

            return undefined;
          },
        }}
      >
        {(field): React.ReactElement => (
          <label>
            Email
            <input
              id={field.name}
              name={field.name}
              type="email"
              value={field.state.value}
              onChange={(event: React.ChangeEvent<HTMLInputElement>): void => {
                field.handleChange(event.target.value);
              }}
            />
          </label>
        )}
      </form.Field>

      <form.Subscribe selector={(state): [boolean, boolean] => [state.canSubmit, state.isSubmitting]}>
        {([canSubmit, isSubmitting]): React.ReactElement => (
          <button type="submit" disabled={!canSubmit || isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        )}
      </form.Subscribe>
    </form>
  );
};

/**
 * TanStack Form also supports asynchronous validators. The async validator
 * returns a promise and can perform work such as checking whether a username
 * is available through an external service.
 */
export const TanStackFormAsyncValidation: React.FC = (): React.ReactElement => {
  const form = useForm<AsyncValidationTanStackFormValues>({
    defaultValues: {
      username: "",
    },
    onSubmit: ({ value }): void => {
      console.log("Async validation passed:", value);
    },
  });

  return (
    <form
      onSubmit={(event: React.FormEvent<HTMLFormElement>): void => {
        event.preventDefault();
        void form.handleSubmit();
      }}
    >
      <form.Field
        name="username"
        validators={{
          onChangeAsync: async ({ value }): Promise<string | undefined> => {
            if (value.trim() === "") {
              return "Username is required.";
            }

            await new Promise<void>((resolve: () => void): void => {
              window.setTimeout(resolve, 300);
            });

            if (value.trim().toLowerCase() === "admin") {
              return "This username is not available.";
            }

            return undefined;
          },
        }}
      >
        {(field): React.ReactElement => (
          <div>
            <label>
              Username
              <input
                id={field.name}
                name={field.name}
                value={field.state.value}
                onChange={(event: React.ChangeEvent<HTMLInputElement>): void => {
                  field.handleChange(event.target.value);
                }}
                onBlur={field.handleBlur}
              />
            </label>

            {!field.state.meta.isValid && <p role="alert">{field.state.meta.errors.join(", ")}</p>}
          </div>
        )}
      </form.Field>

      <button type="submit">Check and submit</button>
    </form>
  );
};

/**
 * A field's state contains both its current value and metadata about
 * validation and interaction. The metadata should not be confused with
 * the field value itself.
 */
export const TanStackFormFieldMetadata: React.FC = (): React.ReactElement => {
  const form = useForm<BasicTanStackFormValues>({
    defaultValues: {
      firstName: "",
      email: "",
    },
    onSubmit: ({ value }): void => {
      console.log("Metadata example:", value);
    },
  });

  return (
    <form
      onSubmit={(event: React.FormEvent<HTMLFormElement>): void => {
        event.preventDefault();
        void form.handleSubmit();
      }}
    >
      <form.Field name="firstName">
        {(field): React.ReactElement => (
          <div>
            <label>
              First name
              <input
                id={field.name}
                name={field.name}
                value={field.state.value}
                onChange={(event: React.ChangeEvent<HTMLInputElement>): void => {
                  field.handleChange(event.target.value);
                }}
                onBlur={field.handleBlur}
              />
            </label>

            <p>Touched: {field.state.meta.isTouched ? "yes" : "no"}</p>
          </div>
        )}
      </form.Field>

      <button type="submit">Submit</button>
    </form>
  );
};

/**
 * A common misconception is that TanStack Form automatically renders a
 * particular input, label, or error component. It is headless: `form.Field`
 * manages field behavior, while the application supplies the actual markup.
 */
export const TanStackFormHeadless: React.FC = (): React.ReactElement => {
  const form = useForm<BasicTanStackFormValues>({
    defaultValues: {
      firstName: "",
      email: "",
    },
    onSubmit: ({ value }): void => {
      console.log("Headless form:", value);
    },
  });

  return (
    <form
      onSubmit={(event: React.FormEvent<HTMLFormElement>): void => {
        event.preventDefault();
        void form.handleSubmit();
      }}
    >
      <form.Field name="firstName">
        {(field): React.ReactElement => (
          <div>
            <strong>{field.name}</strong>
            <input
              name={field.name}
              value={field.state.value}
              onChange={(event: React.ChangeEvent<HTMLInputElement>): void => {
                field.handleChange(event.target.value);
              }}
            />
          </div>
        )}
      </form.Field>

      <button type="submit">Submit</button>
    </form>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const TanStackFormExamples: React.FC = (): React.ReactElement => {
  return (
    <div>
      <h1>TanStack Form</h1>

      <h2>1. Creating a Type-Safe Form</h2>
      <TanStackFormBasic />

      <h2>2. Field-Level Validation</h2>
      <TanStackFormValidation />

      <h2>3. Form-Level Validation</h2>
      <TanStackFormLevelValidation />

      <h2>4. Subscribing to Submission State</h2>
      <TanStackFormSubmissionState />

      <h2>5. Asynchronous Field Validation</h2>
      <TanStackFormAsyncValidation />

      <h2>6. Reading Field Metadata</h2>
      <TanStackFormFieldMetadata />

      <h2>7. Headless Form Rendering</h2>
      <TanStackFormHeadless />
    </div>
  );
};

export default TanStackFormExamples;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - TanStack Form is a headless, type-safe form library for managing form state and validation.
// - `useForm` creates the form instance and establishes its default values and submission behavior.
// - `form.Field` connects individual fields to the form with type-safe field names and values.
// - Field validators can run on events such as `onChange`, `onBlur`, and `onSubmit`.
// - Form-level validators can validate relationships involving multiple fields.
// - Async validators can perform asynchronous checks before a field or form is considered valid.
// - `form.Subscribe` selects specific form-state values such as `canSubmit` and `isSubmitting`.
// - Field metadata contains interaction and validation information in addition to the field value.
// - TanStack Form is headless, so the application controls the rendered HTML and styling.
// - `form.handleSubmit()` runs validation and invokes the configured submission handler only when validation succeeds.
