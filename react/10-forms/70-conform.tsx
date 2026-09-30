/**
 * Conform
 * =======
 *
 * Conform is a type-safe form validation library built around standard HTML form
 * behavior and the FormData Web API. Its React adapter enhances native forms with
 * field metadata, validation state, accessibility attributes, and progressive
 * enhancement without requiring the application to replace ordinary HTML controls.
 *
 * The `useForm` hook creates form and field metadata, while helpers such as
 * `getFormProps` and `getInputProps` derive the attributes needed to connect those
 * elements to Conform. Validation can be performed with a schema integration such
 * as Zod, and the same parsing logic can be reused on the server so client and
 * server validation remain consistent.
 */

import React from "react";
import { getFormProps, getInputProps, getSelectProps, useForm } from "@conform-to/react";
import { getZodConstraint, parseWithZod } from "@conform-to/zod";
import { z } from "zod";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface BasicConformValues {
  readonly firstName: string;
  readonly email: string;
}

export interface ValidationConformValues {
  readonly username: string;
  readonly email: string;
}

export interface SelectConformValues {
  readonly country: string;
}

export interface SubmissionConformValues {
  readonly email: string;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * `useForm` creates form and field metadata, while `getFormProps` and
 * `getInputProps` derive the attributes needed by native form elements.
 * Conform captures values from the DOM rather than requiring every field
 * to be mirrored in React state.
 */
export const ConformBasic: React.FC = (): React.ReactElement => {
  const [form, fields] = useForm<BasicConformValues>({
    defaultValue: {
      firstName: "",
      email: "",
    },
  });

  return (
    <form {...getFormProps(form)}>
      <label htmlFor={fields.firstName.id}>First name</label>
      <input
        {...getInputProps(fields.firstName, {
          type: "text",
        })}
      />

      <label htmlFor={fields.email.id}>Email</label>
      <input
        {...getInputProps(fields.email, {
          type: "email",
        })}
      />

      <button type="submit">Submit</button>
    </form>
  );
};

/**
 * A Zod schema can provide the validation rules for Conform. The same schema
 * can be used to derive native constraints and to validate the submitted
 * FormData through `parseWithZod`.
 */
export const ConformZodValidation: React.FC = (): React.ReactElement => {
  const schema = z.object({
    username: z.string().trim().min(3, "Username must contain at least 3 characters."),
    email: z.string().trim().email("Enter a valid email address."),
  });

  const [form, fields] = useForm<ValidationConformValues>({
    constraint: getZodConstraint(schema),
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
    onValidate({ formData }): ReturnType<typeof parseWithZod> {
      return parseWithZod(formData, {
        schema,
      });
    },
  });

  return (
    <form {...getFormProps(form)}>
      <div>
        <label htmlFor={fields.username.id}>Username</label>
        <input
          {...getInputProps(fields.username, {
            type: "text",
          })}
        />

        <div id={fields.username.errorId}>
          {fields.username.errors?.map((error: string): React.ReactElement => (
            <p key={error} role="alert">
              {error}
            </p>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor={fields.email.id}>Email</label>
        <input
          {...getInputProps(fields.email, {
            type: "email",
          })}
        />

        <div id={fields.email.errorId}>
          {fields.email.errors?.map((error: string): React.ReactElement => (
            <p key={error} role="alert">
              {error}
            </p>
          ))}
        </div>
      </div>

      <button type="submit">Submit</button>
    </form>
  );
};

/**
 * Conform also supports native controls other than text inputs. The metadata
 * produced by `useForm` can be passed to helpers such as `getSelectProps`,
 * which generate the appropriate name, default value, and accessibility
 * attributes for the select element.
 */
export const ConformSelect: React.FC = (): React.ReactElement => {
  const [form, fields] = useForm<SelectConformValues>({
    defaultValue: {
      country: "",
    },
  });

  return (
    <form {...getFormProps(form)}>
      <label htmlFor={fields.country.id}>Country</label>

      <select {...getSelectProps(fields.country)}>
        <option value="">Select a country</option>
        <option value="mk">North Macedonia</option>
        <option value="de">Germany</option>
        <option value="fr">France</option>
      </select>

      <button type="submit">Submit</button>
    </form>
  );
};

/**
 * `shouldValidate` controls when validation begins. `onBlur` delays initial
 * validation until the user leaves a field, while `shouldRevalidate` can
 * switch subsequent validation to `onInput` for immediate feedback.
 */
export const ConformValidationTiming: React.FC = (): React.ReactElement => {
  const schema = z.object({
    email: z.string().email("Enter a valid email address."),
  });

  const [form, fields] = useForm<SubmissionConformValues>({
    constraint: getZodConstraint(schema),
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
    onValidate({ formData }): ReturnType<typeof parseWithZod> {
      return parseWithZod(formData, {
        schema,
      });
    },
  });

  return (
    <form {...getFormProps(form)}>
      <label htmlFor={fields.email.id}>Email</label>

      <input
        {...getInputProps(fields.email, {
          type: "email",
        })}
      />

      <div id={fields.email.errorId}>
        {fields.email.errors?.map((error: string): React.ReactElement => (
          <p key={error} role="alert">
            {error}
          </p>
        ))}
      </div>

      <button type="submit">Validate</button>
    </form>
  );
};

/**
 * Conform's field metadata contains identifiers used to connect labels,
 * controls, descriptions, and errors. `getInputProps` can use that metadata
 * to generate accessibility attributes such as `aria-invalid` and
 * `aria-describedby`.
 */
export const ConformAccessibility: React.FC = (): React.ReactElement => {
  const schema = z.object({
    email: z.string().email("Enter a valid email address."),
  });

  const [form, fields] = useForm<SubmissionConformValues>({
    constraint: getZodConstraint(schema),
    onValidate({ formData }): ReturnType<typeof parseWithZod> {
      return parseWithZod(formData, {
        schema,
      });
    },
  });

  return (
    <form {...getFormProps(form)}>
      <div>
        <label htmlFor={fields.email.id}>Email address</label>

        <input
          {...getInputProps(fields.email, {
            type: "email",
          })}
        />

        <div id={fields.email.errorId} aria-live="polite">
          {fields.email.errors?.map((error: string): React.ReactElement => (
            <p key={error} role="alert">
              {error}
            </p>
          ))}
        </div>
      </div>

      <button type="submit">Submit</button>
    </form>
  );
};

/**
 * Conform is designed around native form submission. The submitted values are
 * represented by `FormData`, which means the browser's successful-control
 * rules still matter: disabled controls are excluded, unchecked checkboxes
 * are excluded, and controls need a name to contribute a value.
 */
export const ConformFormDataModel: React.FC = (): React.ReactElement => {
  const [form, fields] = useForm<BasicConformValues>({
    defaultValue: {
      firstName: "",
      email: "",
    },
    onSubmit(
      event: React.FormEvent<HTMLFormElement>,
      {
        formData,
      }: {
        readonly formData: FormData;
      },
    ): void {
      event.preventDefault();

      console.log("firstName:", formData.get("firstName"));
      console.log("email:", formData.get("email"));
    },
  });

  return (
    <form {...getFormProps(form)}>
      <label htmlFor={fields.firstName.id}>First name</label>
      <input
        {...getInputProps(fields.firstName, {
          type: "text",
        })}
      />

      <label htmlFor={fields.email.id}>Email</label>
      <input
        {...getInputProps(fields.email, {
          type: "email",
        })}
      />

      <button type="submit">Read FormData</button>
    </form>
  );
};

/**
 * `defaultValue` establishes the initial value used to populate the form.
 * This is different from controlled React state: Conform can initialize
 * native controls while continuing to derive submitted values from the DOM.
 */
export const ConformDefaultValues: React.FC = (): React.ReactElement => {
  const [form, fields] = useForm<BasicConformValues>({
    defaultValue: {
      firstName: "Alex",
      email: "alex@example.com",
    },
  });

  return (
    <form {...getFormProps(form)}>
      <label htmlFor={fields.firstName.id}>First name</label>
      <input
        {...getInputProps(fields.firstName, {
          type: "text",
        })}
      />

      <label htmlFor={fields.email.id}>Email</label>
      <input
        {...getInputProps(fields.email, {
          type: "email",
        })}
      />

      <button type="submit">Submit</button>
    </form>
  );
};

/**
 * Conform does not require a custom component system for fields. Its helpers
 * generate attributes for standard HTML elements, so an application remains
 * free to control the surrounding markup, layout, and styling.
 */
export const ConformHeadlessModel: React.FC = (): React.ReactElement => {
  const [form, fields] = useForm<BasicConformValues>({
    defaultValue: {
      firstName: "",
      email: "",
    },
  });

  return (
    <form {...getFormProps(form)}>
      <section>
        <h3>Account information</h3>

        <div>
          <label htmlFor={fields.firstName.id}>First name</label>

          <input
            {...getInputProps(fields.firstName, {
              type: "text",
            })}
          />
        </div>

        <div>
          <label htmlFor={fields.email.id}>Email</label>

          <input
            {...getInputProps(fields.email, {
              type: "email",
            })}
          />
        </div>
      </section>

      <button type="submit">Create account</button>
    </form>
  );
};

/**
 * A common misconception is that Conform itself is a schema-validation
 * library. Conform provides the form and validation infrastructure, while
 * libraries such as Zod provide schema definitions through integrations such
 * as `@conform-to/zod`.
 */
export const ConformValidationSeparation: React.FC = (): React.ReactElement => {
  const schema = z.object({
    email: z.string().email("Enter a valid email address."),
  });

  const [form, fields] = useForm<SubmissionConformValues>({
    constraint: getZodConstraint(schema),
    onValidate({ formData }): ReturnType<typeof parseWithZod> {
      return parseWithZod(formData, {
        schema,
      });
    },
  });

  return (
    <form {...getFormProps(form)}>
      <label htmlFor={fields.email.id}>Email</label>

      <input
        {...getInputProps(fields.email, {
          type: "email",
        })}
      />

      {fields.email.errors && <p role="alert">{fields.email.errors[0]}</p>}

      <button type="submit">Submit</button>
    </form>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const ConformExamples: React.FC = (): React.ReactElement => {
  return (
    <div>
      <h1>Conform</h1>

      <h2>1. Form and Field Metadata</h2>
      <ConformBasic />

      <h2>2. Zod-Based Validation</h2>
      <ConformZodValidation />

      <h2>3. Native Select Controls</h2>
      <ConformSelect />

      <h2>4. Validation Timing</h2>
      <ConformValidationTiming />

      <h2>5. Accessibility Metadata</h2>
      <ConformAccessibility />

      <h2>6. FormData-Based Submission</h2>
      <ConformFormDataModel />

      <h2>7. Default Form Values</h2>
      <ConformDefaultValues />

      <h2>8. Headless Form Markup</h2>
      <ConformHeadlessModel />

      <h2>9. Form Management vs. Schema Validation</h2>
      <ConformValidationSeparation />
    </div>
  );
};

export default ConformExamples;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Conform enhances native HTML forms instead of replacing the browser's form model.
// - `useForm` returns form metadata and metadata for the form's fields.
// - `getFormProps` connects form metadata to a native `<form>` element.
// - `getInputProps` and `getSelectProps` derive the attributes required by native controls.
// - Form values are captured through the DOM and the FormData Web API.
// - Zod can provide schema validation through `@conform-to/zod`.
// - `getZodConstraint` can derive native validation constraints from a Zod schema.
// - `parseWithZod` can validate submitted FormData against the same schema.
// - `shouldValidate` controls when validation begins, while `shouldRevalidate` controls subsequent validation.
// - Conform field metadata provides identifiers and error information needed for accessible form markup.
// - Conform is headless: applications retain control over the HTML structure and presentation.
// - Conform is designed for progressive enhancement and can work with server-side form processing.
