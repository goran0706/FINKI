/**
 * Accessible Forms
 * ================
 *
 * Accessible forms provide clear labels, instructions, relationships, keyboard access,
 * understandable validation, and useful feedback so that users can identify controls,
 * enter information, correct mistakes, and understand submission results.
 *
 * Native HTML form controls should be preferred whenever they provide the required
 * behavior. React adds state and application logic, but it should preserve the native
 * semantics and accessibility relationships provided by HTML.
 */

// ---------------------------------------------------------------------
// Imports
// ---------------------------------------------------------------------

import { type ChangeEvent, type FC, type FormEvent, type ReactElement, useId, useRef, useState } from "react";

// ---------------------------------------------------------------------
// 1. Basic accessible form structure
// ---------------------------------------------------------------------

// A form should use semantic HTML and group related controls logically.

export const BasicAccessibleForm: FC = (): ReactElement => {
  return (
    <form>
      <h1>Contact information</h1>

      <label htmlFor="name">Name</label>

      <input id="name" name="name" type="text" />

      <button type="submit">Submit</button>
    </form>
  );
};

// The label identifies the input, while the button submits the form.

// ---------------------------------------------------------------------
// 2. Explicit label association
// ---------------------------------------------------------------------

export const ExplicitLabel: FC = (): ReactElement => {
  return (
    <div>
      <label htmlFor="email">Email address</label>

      <input id="email" name="email" type="email" />
    </div>
  );
};

// htmlFor must match the input's id exactly.

// ---------------------------------------------------------------------
// 3. Implicit label association
// ---------------------------------------------------------------------

export const ImplicitLabel: FC = (): ReactElement => {
  return (
    <label>
      Email address
      <input name="email" type="email" />
    </label>
  );
};

// Wrapping the control in its label also creates the association.

// ---------------------------------------------------------------------
// 4. Prefer label elements
// ---------------------------------------------------------------------

export const PreferredLabeling: FC = (): ReactElement => {
  const id = useId();

  return (
    <div>
      <label htmlFor={id}>Display name</label>

      <input id={id} name="displayName" type="text" />
    </div>
  );
};

// Native labels provide a robust association between the visible label and
// the form control.

// ---------------------------------------------------------------------
// 5. Labels should describe purpose
// ---------------------------------------------------------------------

export const DescriptiveLabels: FC = (): ReactElement => {
  return (
    <form>
      <label htmlFor="username">Username</label>

      <input id="username" name="username" type="text" />

      <label htmlFor="password">Password</label>

      <input id="password" name="password" type="password" />
    </form>
  );
};

// Labels should tell users what information the corresponding control expects.

// ---------------------------------------------------------------------
// 6. Do not use placeholder text as the label
// ---------------------------------------------------------------------

export const LabelAndPlaceholder: FC = (): ReactElement => {
  return (
    <div>
      <label htmlFor="email">Email address</label>

      <input id="email" name="email" type="email" placeholder="name@example.com" />
    </div>
  );
};

// The placeholder provides an example or supplementary hint.
// It should not replace the persistent label.

// ---------------------------------------------------------------------
// 7. Instructions
// ---------------------------------------------------------------------

export const FieldInstructions: FC = (): ReactElement => {
  const id = useId();
  const descriptionId = useId();

  return (
    <div>
      <label htmlFor={id}>Username</label>

      <input id={id} name="username" type="text" aria-describedby={descriptionId} />

      <p id={descriptionId}>Use 3 to 20 characters.</p>
    </div>
  );
};

// aria-describedby associates supplementary instructions with the control.

// ---------------------------------------------------------------------
// 8. Form-level instructions
// ---------------------------------------------------------------------

export const FormInstructions: FC = (): ReactElement => {
  return (
    <form>
      <h1>Create an account</h1>

      <p>Fields marked as required must be completed.</p>

      <label htmlFor="account-email">Email address (required)</label>

      <input id="account-email" name="email" type="email" required />

      <button type="submit">Create account</button>
    </form>
  );
};

// Important instructions should be available before users need to complete
// the relevant controls.

// ---------------------------------------------------------------------
// 9. Required fields
// ---------------------------------------------------------------------

export const RequiredField: FC = (): ReactElement => {
  return (
    <div>
      <label htmlFor="required-name">Name (required)</label>

      <input id="required-name" name="name" type="text" required />
    </div>
  );
};

// The visible "(required)" communicates the requirement to users generally,
// while required provides the native programmatic constraint.

// ---------------------------------------------------------------------
// 10. Required radio groups
// ---------------------------------------------------------------------

export const RequiredRadioGroup: FC = (): ReactElement => {
  return (
    <fieldset>
      <legend>Contact method (required)</legend>

      <label>
        <input type="radio" name="contact" value="email" required />
        Email
      </label>

      <label>
        <input type="radio" name="contact" value="phone" />
        Phone
      </label>
    </fieldset>
  );
};

// fieldset and legend provide the group label.
// The radio group can use native required validation.

// ---------------------------------------------------------------------
// 11. Checkbox labels
// ---------------------------------------------------------------------

export const CheckboxLabel: FC = (): ReactElement => {
  return (
    <label>
      <input type="checkbox" name="updates" />
      Receive updates
    </label>
  );
};

// The label includes the checkbox and its descriptive text.

// ---------------------------------------------------------------------
// 12. Multiple related checkboxes
// ---------------------------------------------------------------------

export const CheckboxGroup: FC = (): ReactElement => {
  return (
    <fieldset>
      <legend>Notification preferences</legend>

      <label>
        <input type="checkbox" name="notifications" value="email" />
        Email
      </label>

      <label>
        <input type="checkbox" name="notifications" value="sms" />
        Text messages
      </label>
    </fieldset>
  );
};

// fieldset and legend communicate that the controls form one logical group.

// ---------------------------------------------------------------------
// 13. Select controls
// ---------------------------------------------------------------------

export const AccessibleSelect: FC = (): ReactElement => {
  const id = useId();

  return (
    <div>
      <label htmlFor={id}>Country</label>

      <select id={id} name="country" defaultValue="">
        <option value="" disabled>
          Select a country
        </option>

        <option value="example">Example</option>

        <option value="other">Other</option>
      </select>
    </div>
  );
};

// A select needs a clear label just like a text input.

// ---------------------------------------------------------------------
// 14. Textareas
// ---------------------------------------------------------------------

export const AccessibleTextarea: FC = (): ReactElement => {
  const id = useId();
  const descriptionId = useId();

  return (
    <div>
      <label htmlFor={id}>Message</label>

      <textarea id={id} name="message" aria-describedby={descriptionId} />

      <p id={descriptionId}>Maximum 500 characters.</p>
    </div>
  );
};

// The description supplies additional instructions without replacing the label.

// ---------------------------------------------------------------------
// 15. Input types
// ---------------------------------------------------------------------

export const SemanticInputTypes: FC = (): ReactElement => {
  return (
    <form>
      <label>
        Email
        <input type="email" name="email" />
      </label>

      <label>
        Website
        <input type="url" name="website" />
      </label>

      <label>
        Age
        <input type="number" name="age" min={0} max={120} />
      </label>

      <label>
        Birth date
        <input type="date" name="birthDate" />
      </label>
    </form>
  );
};

// Appropriate native input types provide useful browser behavior and
// constraints and can also provide suitable input mechanisms on devices.

// ---------------------------------------------------------------------
// 16. Autocomplete
// ---------------------------------------------------------------------

export const AutocompleteExample: FC = (): ReactElement => {
  return (
    <form autoComplete="on">
      <label htmlFor="full-name">Full name</label>

      <input id="full-name" name="name" type="text" autoComplete="name" />

      <label htmlFor="email-address">Email address</label>

      <input id="email-address" name="email" type="email" autoComplete="email" />
    </form>
  );
};

// autocomplete can help users enter information they have already provided
// without requiring them to type it again.

// ---------------------------------------------------------------------
// 17. Inputmode
// ---------------------------------------------------------------------

export const InputModeExample: FC = (): ReactElement => {
  return (
    <div>
      <label htmlFor="postal-code">Postal code</label>

      <input id="postal-code" name="postalCode" type="text" inputMode="numeric" />
    </div>
  );
};

// inputMode can provide an appropriate virtual keyboard without changing the
// semantic type of the value being entered.

// ---------------------------------------------------------------------
// 18. Password fields
// ---------------------------------------------------------------------

export const PasswordField: FC = (): ReactElement => {
  const id = useId();
  const descriptionId = useId();

  return (
    <div>
      <label htmlFor={id}>Password</label>

      <input
        id={id}
        name="password"
        type="password"
        autoComplete="new-password"
        aria-describedby={descriptionId}
        required
      />

      <p id={descriptionId}>Use at least 12 characters.</p>
    </div>
  );
};

// Password requirements should be communicated before or while the user
// enters the value, not only after submission.

// ---------------------------------------------------------------------
// 19. Grouping related controls
// ---------------------------------------------------------------------

export const GroupedControls: FC = (): ReactElement => {
  return (
    <form>
      <fieldset>
        <legend>Shipping address</legend>

        <label>
          Street
          <input name="street" type="text" />
        </label>

        <label>
          City
          <input name="city" type="text" />
        </label>

        <label>
          Postal code
          <input name="postalCode" type="text" />
        </label>
      </fieldset>
    </form>
  );
};

// fieldset and legend are especially useful for groups of related controls
// such as radio buttons and address fields.

// ---------------------------------------------------------------------
// 20. Nested grouping
// ---------------------------------------------------------------------

export const NestedGroups: FC = (): ReactElement => {
  return (
    <fieldset>
      <legend>Contact information</legend>

      <fieldset>
        <legend>Preferred method</legend>

        <label>
          <input type="radio" name="preferred" value="email" />
          Email
        </label>

        <label>
          <input type="radio" name="preferred" value="phone" />
          Phone
        </label>
      </fieldset>
    </fieldset>
  );
};

// Grouping should reflect the actual conceptual relationships in the form.

// ---------------------------------------------------------------------
// 21. Readonly fields
// ---------------------------------------------------------------------

export const ReadonlyField: FC = (): ReactElement => {
  return (
    <div>
      <label htmlFor="account-id">Account ID</label>

      <input id="account-id" name="accountId" value="example-account" readOnly />
    </div>
  );
};

// readonly communicates that the value cannot be edited through the control.

// ---------------------------------------------------------------------
// 22. Disabled fields
// ---------------------------------------------------------------------

export const DisabledField: FC = (): ReactElement => {
  return (
    <div>
      <label htmlFor="disabled-field">Unavailable option</label>

      <input id="disabled-field" name="option" disabled />
    </div>
  );
};

// disabled communicates that the control is currently unavailable and removes
// it from normal keyboard interaction and form submission.

// ---------------------------------------------------------------------
// 23. aria-disabled is not the same as disabled
// ---------------------------------------------------------------------

export const AriaDisabledExample: FC = (): ReactElement => {
  const [disabled, setDisabled] = useState(true);

  return (
    <button
      type="button"
      aria-disabled={disabled}
      onClick={() => {
        if (disabled) {
          return;
        }

        console.log("Action");
      }}
    >
      Continue
    </button>
  );
};

// aria-disabled communicates state but does not automatically prevent
// interaction. The application must enforce the disabled behavior.
//
// For ordinary form controls, native disabled is generally preferable.

// ---------------------------------------------------------------------
// 24. Client-side validation
// ---------------------------------------------------------------------

export const NativeValidation: FC = (): ReactElement => {
  return (
    <form>
      <label htmlFor="native-email">Email address</label>

      <input id="native-email" name="email" type="email" required />

      <button type="submit">Submit</button>
    </form>
  );
};

// HTML provides native validation for many common constraints.

// ---------------------------------------------------------------------
// 25. Custom validation state
// ---------------------------------------------------------------------

interface ValidationState {
  readonly email: string;
  readonly emailError: string;
}

export const CustomValidation: FC = (): ReactElement => {
  const [state, setState] = useState<ValidationState>({
    email: "",
    emailError: "",
  });

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setState({
      email: event.target.value,
      emailError: "",
    });
  };

  const validate = (): void => {
    if (!state.email.includes("@")) {
      setState((current) => ({
        ...current,
        emailError: "Enter an email address such as name@example.com.",
      }));

      return;
    }

    setState((current) => ({
      ...current,
      emailError: "",
    }));
  };

  return (
    <div>
      <label htmlFor="custom-email">Email address</label>

      <input
        id="custom-email"
        name="email"
        type="email"
        value={state.email}
        aria-invalid={state.emailError !== ""}
        aria-describedby={state.emailError !== "" ? "custom-email-error" : undefined}
        onChange={handleChange}
      />

      {state.emailError && <p id="custom-email-error">{state.emailError}</p>}

      <button type="button" onClick={validate}>
        Validate
      </button>
    </div>
  );
};

// aria-invalid should describe an actual validation result.
// It should not be used simply because a field is required before the user
// has attempted to submit it.

// ---------------------------------------------------------------------
// 26. Error messages should explain correction
// ---------------------------------------------------------------------

export const CorrectiveError: FC = (): ReactElement => {
  const id = useId();
  const errorId = useId();

  return (
    <div>
      <label htmlFor={id}>Username</label>

      <input id={id} name="username" aria-invalid="true" aria-describedby={errorId} />

      <p id={errorId}>Username is unavailable. Choose another username.</p>
    </div>
  );
};

// An error should identify the problem and, where possible, explain how to
// correct it.

// ---------------------------------------------------------------------
// 27. aria-errormessage
// ---------------------------------------------------------------------

export const ErrorMessageRelationship: FC = (): ReactElement => {
  const id = useId();
  const errorId = useId();

  return (
    <div>
      <label htmlFor={id}>Username</label>

      <input id={id} name="username" aria-invalid="true" aria-errormessage={errorId} />

      <p id={errorId}>Username is unavailable.</p>
    </div>
  );
};

// aria-errormessage specifically identifies an error message for an invalid
// control. The control should indicate that it is invalid.

// ---------------------------------------------------------------------
// 28. Descriptions versus error messages
// ---------------------------------------------------------------------

export const DescriptionAndError: FC = (): ReactElement => {
  const id = useId();
  const descriptionId = useId();
  const errorId = useId();

  return (
    <div>
      <label htmlFor={id}>Username</label>

      <input id={id} name="username" aria-invalid="true" aria-describedby={descriptionId} aria-errormessage={errorId} />

      <p id={descriptionId}>Use 3 to 20 characters.</p>

      <p id={errorId}>This username is already in use.</p>
    </div>
  );
};

// The description provides instructions or context.
// The error message identifies a validation failure.

// ---------------------------------------------------------------------
// 29. Error summary
// ---------------------------------------------------------------------

export const ErrorSummary: FC = (): ReactElement => {
  return (
    <div role="alert">
      <h2>There are 2 errors</h2>

      <ul>
        <li>
          <a href="#first-name">Enter your first name.</a>
        </li>

        <li>
          <a href="#email">Enter a valid email address.</a>
        </li>
      </ul>
    </div>
  );
};

// An error summary can give users an overview of submission failures and
// provide direct links to the affected controls.

// ---------------------------------------------------------------------
// 30. Preserve entered values after validation
// ---------------------------------------------------------------------

interface ProfileValues {
  readonly name: string;
  readonly email: string;
}

export const PreserveFormValues: FC = (): ReactElement => {
  const [values, setValues] = useState<ProfileValues>({
    name: "",
    email: "",
  });

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setValues((current) => ({
      ...current,
      name: event.target.value,
    }));
  };

  const handleEmailChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setValues((current) => ({
      ...current,
      email: event.target.value,
    }));
  };

  return (
    <form>
      <label htmlFor="profile-name">Name</label>

      <input id="profile-name" name="name" value={values.name} onChange={handleNameChange} />

      <label htmlFor="profile-email">Email</label>

      <input id="profile-email" name="email" type="email" value={values.email} onChange={handleEmailChange} />

      <button type="submit">Save</button>
    </form>
  );
};

// Validation feedback should not unnecessarily force users to re-enter
// information they have already supplied.

// ---------------------------------------------------------------------
// 31. Focus the first invalid field
// ---------------------------------------------------------------------

export const FirstInvalidField: FC = (): ReactElement => {
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    if (!nameRef.current?.value.trim()) {
      nameRef.current?.focus();
      return;
    }

    if (!emailRef.current?.value.includes("@")) {
      emailRef.current?.focus();
      return;
    }

    console.log("Form submitted");
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="first-name">Name</label>

      <input ref={nameRef} id="first-name" name="name" />

      <label htmlFor="first-email">Email</label>

      <input ref={emailRef} id="first-email" name="email" type="email" />

      <button type="submit">Submit</button>
    </form>
  );
};

// When validation fails, moving focus to the first invalid control can help
// the user locate the next required action.

// ---------------------------------------------------------------------
// 32. Form submission status
// ---------------------------------------------------------------------

export const SubmissionStatus: FC = (): ReactElement => {
  const [submitted, setSubmitted] = useState(false);

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        setSubmitted(true);
      }}
    >
      <label htmlFor="status-name">Name</label>

      <input id="status-name" name="name" required />

      <button type="submit">Submit</button>

      {submitted && <p role="status">Your information was submitted.</p>}
    </form>
  );
};

// A status message can communicate successful completion without moving
// keyboard focus away from the submitted control.

// ---------------------------------------------------------------------
// 33. Submission errors
// ---------------------------------------------------------------------

export const SubmissionError: FC = (): ReactElement => {
  const [hasError, setHasError] = useState(false);

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        setHasError(true);
      }}
    >
      {hasError && (
        <div role="alert">There was a problem submitting the form. Check the fields below and try again.</div>
      )}

      <label htmlFor="submission-email">Email address</label>

      <input id="submission-email" name="email" type="email" required />

      <button type="submit">Submit</button>
    </form>
  );
};

// Important submission failures should be communicated in a way that does
// not depend only on visual styling.

// ---------------------------------------------------------------------
// 34. Server-side validation still matters
// ---------------------------------------------------------------------

// Client-side validation improves interaction and gives immediate feedback.
//
// It does not establish trust or replace server-side validation.
//
// A server must validate data again before accepting or processing it.

export const ClientValidationBoundary: FC = (): ReactElement => {
  const [value, setValue] = useState("");

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();

        if (!value.trim()) {
          return;
        }

        // The application would send the value to a server here.
        // The server must validate the submitted value independently.
        console.log(value);
      }}
    >
      <label htmlFor="validated-value">Value</label>

      <input
        id="validated-value"
        value={value}
        onChange={(event) => {
          setValue(event.target.value);
        }}
      />

      <button type="submit">Submit</button>
    </form>
  );
};

// Client validation is an interaction concern.
// Server validation is a trust-boundary concern.

// ---------------------------------------------------------------------
// 35. Avoid validation based only on color
// ---------------------------------------------------------------------

export const NonColorError: FC = (): ReactElement => {
  const id = useId();
  const errorId = useId();

  return (
    <div>
      <label htmlFor={id}>Email address</label>

      <input id={id} type="email" aria-invalid="true" aria-describedby={errorId} />

      <p id={errorId}>Error: enter a valid email address.</p>
    </div>
  );
};

// Color may supplement an error indication, but the error should also have
// textual or semantic communication.

// ---------------------------------------------------------------------
// 36. Do not use placeholder-only forms
// ---------------------------------------------------------------------

export const PersistentLabels: FC = (): ReactElement => {
  return (
    <form>
      <label htmlFor="persistent-email">Email address</label>

      <input id="persistent-email" type="email" placeholder="name@example.com" />
    </form>
  );
};

// The label remains available after the user enters a value.

// ---------------------------------------------------------------------
// 37. Avoid overly long labels
// ---------------------------------------------------------------------

export const ConciseLabels: FC = (): ReactElement => {
  return (
    <div>
      <label htmlFor="short-name">Name</label>

      <input id="short-name" name="name" />
    </div>
  );
};

// Labels should identify the purpose clearly without unnecessarily repeating
// large amounts of surrounding content.

// ---------------------------------------------------------------------
// 38. Help text
// ---------------------------------------------------------------------

export const HelpText: FC = (): ReactElement => {
  const id = useId();
  const helpId = useId();

  return (
    <div>
      <label htmlFor={id}>Account name</label>

      <input id={id} name="accountName" aria-describedby={helpId} />

      <p id={helpId}>This name is visible to other users.</p>
    </div>
  );
};

// Supplementary help should be associated with the relevant control.

// ---------------------------------------------------------------------
// 39. Date format instructions
// ---------------------------------------------------------------------

export const DateInstructions: FC = (): ReactElement => {
  const id = useId();
  const descriptionId = useId();

  return (
    <div>
      <label htmlFor={id}>Start date</label>

      <input id={id} name="startDate" type="date" aria-describedby={descriptionId} />

      <p id={descriptionId}>Choose the date when the service should begin.</p>
    </div>
  );
};

// Use native controls when they express the required data type accurately.

// ---------------------------------------------------------------------
// 40. Search forms
// ---------------------------------------------------------------------

export const SearchForm: FC = (): ReactElement => {
  return (
    <form role="search">
      <label htmlFor="search">Search</label>

      <input id="search" name="q" type="search" />

      <button type="submit">Search</button>
    </form>
  );
};

// A search landmark identifies a form whose purpose is searching.

// ---------------------------------------------------------------------
// 41. Login forms
// ---------------------------------------------------------------------

export const LoginForm: FC = (): ReactElement => {
  return (
    <form>
      <h1>Sign in</h1>

      <label htmlFor="login-email">Email address</label>

      <input id="login-email" name="email" type="email" autoComplete="username" required />

      <label htmlFor="login-password">Password</label>

      <input id="login-password" name="password" type="password" autoComplete="current-password" required />

      <button type="submit">Sign in</button>
    </form>
  );
};

// Authentication forms should still follow the same labeling, grouping,
// instruction, validation, and feedback principles.

// ---------------------------------------------------------------------
// 42. Avoid unnecessary fields
// ---------------------------------------------------------------------

export const FocusedForm: FC = (): ReactElement => {
  return (
    <form>
      <h1>Contact</h1>

      <label htmlFor="contact-email">Email address</label>

      <input id="contact-email" name="email" type="email" required />

      <button type="submit">Continue</button>
    </form>
  );
};

// Asking only for information needed for the task reduces cognitive and
// interaction burden.

// ---------------------------------------------------------------------
// 43. Preserve keyboard access
// ---------------------------------------------------------------------

export const KeyboardForm: FC = (): ReactElement => {
  return (
    <form>
      <label htmlFor="keyboard-name">Name</label>

      <input id="keyboard-name" name="name" />

      <button type="submit">Continue</button>
    </form>
  );
};

// Native form controls participate in the normal keyboard focus order.

// ---------------------------------------------------------------------
// 44. Submit with the Enter key
// ---------------------------------------------------------------------

export const NativeSubmitBehavior: FC = (): ReactElement => {
  return (
    <form>
      <label htmlFor="enter-search">Search</label>

      <input id="enter-search" name="q" type="search" />

      <button type="submit">Search</button>
    </form>
  );
};

// Native form submission behavior should generally be preserved instead of
// implementing submission exclusively through keydown handlers.

// ---------------------------------------------------------------------
// 45. Do not use divs as form controls
// ---------------------------------------------------------------------

export const NativeFormControl: FC = (): ReactElement => {
  return (
    <label>
      Name
      <input type="text" />
    </label>
  );
};

// A div does not provide the semantics, keyboard behavior, value handling,
// or form participation of an input.

// ---------------------------------------------------------------------
// 46. Accessible custom form component
// ---------------------------------------------------------------------

interface EmailFieldProps {
  readonly value: string;
  readonly onChange: (value: string) => void;
}

export const EmailField: FC<EmailFieldProps> = ({ value, onChange }): ReactElement => {
  const id = useId();
  const descriptionId = useId();

  return (
    <div>
      <label htmlFor={id}>Email address</label>

      <input
        id={id}
        name="email"
        type="email"
        value={value}
        aria-describedby={descriptionId}
        onChange={(event) => {
          onChange(event.target.value);
        }}
      />

      <p id={descriptionId}>Use an address such as name@example.com.</p>
    </div>
  );
};

// A reusable form component can manage its implementation details while
// preserving native semantics for consumers.

// ---------------------------------------------------------------------
// 47. Reusable field with error state
// ---------------------------------------------------------------------

interface FieldProps {
  readonly error?: string;
  readonly id: string;
  readonly label: string;
  readonly name: string;
  readonly value: string;
  readonly onChange: (value: string) => void;
}

export const TextField: FC<FieldProps> = ({ error, id, label, name, value, onChange }): ReactElement => {
  const errorId = `${id}-error`;

  return (
    <div>
      <label htmlFor={id}>{label}</label>

      <input
        id={id}
        name={name}
        value={value}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        onChange={(event) => {
          onChange(event.target.value);
        }}
      />

      {error && <p id={errorId}>{error}</p>}
    </div>
  );
};

// The component keeps the label, control, validation state, and error
// relationship together.

// ---------------------------------------------------------------------
// 48. Form state
// ---------------------------------------------------------------------

interface RegistrationValues {
  readonly name: string;
  readonly email: string;
}

export const ControlledForm: FC = (): ReactElement => {
  const [values, setValues] = useState<RegistrationValues>({
    name: "",
    email: "",
  });

  return (
    <form>
      <TextField
        id="registration-name"
        name="name"
        label="Name"
        value={values.name}
        onChange={(name) => {
          setValues((current) => ({
            ...current,
            name,
          }));
        }}
      />

      <TextField
        id="registration-email"
        name="email"
        label="Email address"
        value={values.email}
        onChange={(email) => {
          setValues((current) => ({
            ...current,
            email,
          }));
        }}
      />

      <button type="submit">Register</button>
    </form>
  );
};

// Controlled React state does not change the underlying accessibility
// requirements of the native controls.

// ---------------------------------------------------------------------
// 49. Uncontrolled form controls
// ---------------------------------------------------------------------

export const UncontrolledForm: FC = (): ReactElement => {
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();

        const form = event.currentTarget;
        const data = new FormData(form);

        console.log(data.get("name"));
        console.log(data.get("email"));
      }}
    >
      <label htmlFor="uncontrolled-name">Name</label>

      <input id="uncontrolled-name" name="name" />

      <label htmlFor="uncontrolled-email">Email address</label>

      <input id="uncontrolled-email" name="email" type="email" />

      <button type="submit">Submit</button>
    </form>
  );
};

// Accessibility does not require every input to be controlled by React state.

// ---------------------------------------------------------------------
// 50. Dynamic fields
// ---------------------------------------------------------------------

export const DynamicField: FC = (): ReactElement => {
  const [showPhone, setShowPhone] = useState(false);

  return (
    <form>
      <label htmlFor="dynamic-email">Email address</label>

      <input id="dynamic-email" name="email" type="email" />

      <button
        type="button"
        aria-expanded={showPhone}
        aria-controls="phone-field"
        onClick={() => {
          setShowPhone((current) => !current);
        }}
      >
        {showPhone ? "Hide phone number" : "Add phone number"}
      </button>

      {showPhone && (
        <div id="phone-field">
          <label htmlFor="phone">Phone number</label>

          <input id="phone" name="phone" type="tel" />
        </div>
      )}
    </form>
  );
};

// Dynamic form controls should have understandable relationships and state.

// ---------------------------------------------------------------------
// 51. Do not rely on disabled to explain a dependency
// ---------------------------------------------------------------------

export const DependentField: FC = (): ReactElement => {
  const [enabled, setEnabled] = useState(false);

  return (
    <form>
      <label>
        <input
          type="checkbox"
          checked={enabled}
          onChange={(event) => {
            setEnabled(event.target.checked);
          }}
        />
        Provide additional information
      </label>

      <label htmlFor="additional-info">Additional information</label>

      <input id="additional-info" name="additionalInfo" disabled={!enabled} />
    </form>
  );
};

// When a control depends on another control, the interface should make that
// relationship understandable rather than communicating it only through
// disabled styling.

// ---------------------------------------------------------------------
// 52. Accessible file input
// ---------------------------------------------------------------------

export const FileInput: FC = (): ReactElement => {
  const id = useId();
  const descriptionId = useId();

  return (
    <div>
      <label htmlFor={id}>Upload document</label>

      <input id={id} name="document" type="file" accept=".pdf" aria-describedby={descriptionId} />

      <p id={descriptionId}>PDF files only.</p>
    </div>
  );
};

// File restrictions should be communicated to users and also validated by
// the server when the file is submitted.

// ---------------------------------------------------------------------
// 53. Multiple file input
// ---------------------------------------------------------------------

export const MultipleFiles: FC = (): ReactElement => {
  return (
    <div>
      <label htmlFor="documents">Upload documents</label>

      <input id="documents" name="documents" type="file" multiple />
    </div>
  );
};

// The label should describe the purpose of the file selection control.

// ---------------------------------------------------------------------
// 54. Accessible date and time fields
// ---------------------------------------------------------------------

export const DateTimeFields: FC = (): ReactElement => {
  return (
    <fieldset>
      <legend>Appointment</legend>

      <label htmlFor="appointment-date">Date</label>

      <input id="appointment-date" name="date" type="date" />

      <label htmlFor="appointment-time">Time</label>

      <input id="appointment-time" name="time" type="time" />
    </fieldset>
  );
};

// Related fields can be grouped with a fieldset and legend.

// ---------------------------------------------------------------------
// 55. Accessible range constraints
// ---------------------------------------------------------------------

export const RangeConstraints: FC = (): ReactElement => {
  return (
    <div>
      <label htmlFor="quantity">Quantity</label>

      <input id="quantity" name="quantity" type="number" min={1} max={10} required />
    </div>
  );
};

// Native constraints can communicate valid ranges to browsers and assistive
// technologies.

// ---------------------------------------------------------------------
// 56. Form-level validation summary with links
// ---------------------------------------------------------------------

export const ValidationSummary: FC = (): ReactElement => {
  return (
    <section aria-labelledby="form-errors-heading">
      <h2 id="form-errors-heading">Please correct the following errors</h2>

      <ul>
        <li>
          <a href="#summary-name">Name is required.</a>
        </li>

        <li>
          <a href="#summary-email">Enter a valid email address.</a>
        </li>
      </ul>
    </section>
  );
};

// Error summaries are especially useful when several fields fail at once.

// ---------------------------------------------------------------------
// 57. Form errors should identify controls
// ---------------------------------------------------------------------

export const FieldErrorReference: FC = (): ReactElement => {
  return (
    <div>
      <p id="name-error">Name is required.</p>

      <label htmlFor="summary-name">Name</label>

      <input id="summary-name" aria-invalid="true" aria-describedby="name-error" />
    </div>
  );
};

// The relationship allows users to associate the message with the affected
// field.

// ---------------------------------------------------------------------
// 58. Avoid clearing unrelated fields after an error
// ---------------------------------------------------------------------

export const StableFormState: FC = (): ReactElement => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  return (
    <form>
      <label htmlFor="stable-name">Name</label>

      <input
        id="stable-name"
        value={name}
        onChange={(event) => {
          setName(event.target.value);
        }}
      />

      <label htmlFor="stable-email">Email</label>

      <input
        id="stable-email"
        value={email}
        onChange={(event) => {
          setEmail(event.target.value);
        }}
      />

      <button type="submit">Submit</button>
    </form>
  );
};

// Keeping valid entered data prevents unnecessary repetition when users
// correct validation errors.

// ---------------------------------------------------------------------
// 59. Accessible form submission
// ---------------------------------------------------------------------

export const AccessibleSubmission: FC = (): ReactElement => {
  const [status, setStatus] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    setStatus("Your changes were saved.");
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="submission-name">Name</label>

      <input id="submission-name" name="name" required />

      <button type="submit">Save changes</button>

      {status && <p role="status">{status}</p>}
    </form>
  );
};

// The form uses the native submit event and exposes the result through a
// semantic status message.

// ---------------------------------------------------------------------
// 60. Avoid moving focus unnecessarily
// ---------------------------------------------------------------------

export const NaturalSubmissionFocus: FC = (): ReactElement => {
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        console.log("Submitted");
      }}
    >
      <label htmlFor="natural-focus-name">Name</label>

      <input id="natural-focus-name" name="name" />

      <button type="submit">Submit</button>
    </form>
  );
};

// Focus should not be moved merely because the form submitted successfully.
// Move focus when a meaningful interface change makes it necessary.

// ---------------------------------------------------------------------
// 61. Avoid auto-focusing every form
// ---------------------------------------------------------------------

export const DeliberateFocus: FC = (): ReactElement => {
  return (
    <form>
      <label htmlFor="deliberate-name">Name</label>

      <input id="deliberate-name" name="name" />

      <button type="submit">Submit</button>
    </form>
  );
};

// Autofocus can unexpectedly move the user's focus and should be used only
// when the resulting focus placement is intentional and beneficial.

// ---------------------------------------------------------------------
// 62. Accessible custom submit button
// ---------------------------------------------------------------------

export const NativeSubmitButton: FC = (): ReactElement => {
  return <button type="submit">Save</button>;
};

// Use the native submit button instead of recreating submission behavior on
// a generic element.

// ---------------------------------------------------------------------
// 63. Avoid nested forms
// ---------------------------------------------------------------------

export const SingleFormBoundary: FC = (): ReactElement => {
  return (
    <form>
      <fieldset>
        <legend>Profile</legend>

        <label>
          Name
          <input name="name" />
        </label>
      </fieldset>

      <fieldset>
        <legend>Preferences</legend>

        <label>
          <input type="checkbox" name="updates" />
          Receive updates
        </label>
      </fieldset>

      <button type="submit">Save</button>
    </form>
  );
};

// Group related controls inside one appropriate form rather than nesting
// separate form elements.

// ---------------------------------------------------------------------
// 64. Form controls and accessible names
// ---------------------------------------------------------------------

export const AccessibleNameExample: FC = (): ReactElement => {
  const id = useId();

  return (
    <div>
      <label htmlFor={id}>Search</label>

      <input id={id} type="search" name="q" />
    </div>
  );
};

// A visible label normally provides the accessible name for the control.

// ---------------------------------------------------------------------
// 65. aria-label when no visible label is possible
// ---------------------------------------------------------------------

export const AriaLabelExample: FC = (): ReactElement => {
  return (
    <button type="button" aria-label="Clear search">
      ×
    </button>
  );
};

// aria-label is useful when a visible text label cannot reasonably be
// provided, such as for an icon-only control.

// ---------------------------------------------------------------------
// 66. Do not duplicate the visible label unnecessarily
// ---------------------------------------------------------------------

export const AvoidDuplicateName: FC = (): ReactElement => {
  const id = useId();

  return (
    <div>
      <label htmlFor={id}>Email address</label>

      <input id={id} type="email" name="email" />
    </div>
  );
};

// A correctly associated label already supplies the control's accessible name.

// ---------------------------------------------------------------------
// 67. Form autocomplete and sensitive data
// ---------------------------------------------------------------------

export const AccountFields: FC = (): ReactElement => {
  return (
    <form autoComplete="on">
      <label htmlFor="account-username">Username</label>

      <input id="account-username" name="username" autoComplete="username" />

      <label htmlFor="account-password">Password</label>

      <input id="account-password" name="password" type="password" autoComplete="current-password" />
    </form>
  );
};

// Autocomplete tokens communicate the purpose of common fields and can help
// browsers and password managers provide appropriate assistance.

// ---------------------------------------------------------------------
// 68. Accessible form status
// ---------------------------------------------------------------------

export const FormStatus: FC = (): ReactElement => {
  return (
    <form>
      <label htmlFor="status-field">Name</label>

      <input id="status-field" name="name" />

      <p role="status">Ready to submit.</p>

      <button type="submit">Submit</button>
    </form>
  );
};

// Status information should not obscure or replace the actual form controls.

// ---------------------------------------------------------------------
// 69. Error state and native constraint validation
// ---------------------------------------------------------------------

export const NativeConstraintAndAria: FC = (): ReactElement => {
  const [submitted, setSubmitted] = useState(false);

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        setSubmitted(true);
      }}
    >
      <label htmlFor="constraint-email">Email address (required)</label>

      <input id="constraint-email" name="email" type="email" required aria-invalid={submitted ? "true" : undefined} />

      <button type="submit">Submit</button>
    </form>
  );
};

// Native constraints and ARIA can work together, but aria-invalid should
// reflect the application's actual validation state.

// ---------------------------------------------------------------------
// 70. Accessible multi-step form
// ---------------------------------------------------------------------

export const MultiStepForm: FC = (): ReactElement => {
  const [step, setStep] = useState<1 | 2>(1);

  return (
    <form>
      <p>Step {step} of 2</p>

      {step === 1 && (
        <fieldset>
          <legend>Personal information</legend>

          <label htmlFor="step-name">Name</label>

          <input id="step-name" name="name" />

          <button
            type="button"
            onClick={() => {
              setStep(2);
            }}
          >
            Next
          </button>
        </fieldset>
      )}

      {step === 2 && (
        <fieldset>
          <legend>Contact information</legend>

          <label htmlFor="step-email">Email address</label>

          <input id="step-email" name="email" type="email" />

          <button type="submit">Finish</button>
        </fieldset>
      )}
    </form>
  );
};

// Multi-step forms should make the current step understandable and should
// manage focus deliberately when changing steps.

// ---------------------------------------------------------------------
// 71. Form validation checklist
// ---------------------------------------------------------------------
// - Every form control has a clear accessible name.
// - Labels are programmatically associated with their controls.
// - Visible labels are preferred over placeholder-only identification.
// - Related controls are grouped with fieldset and legend when appropriate.
// - Required fields are clearly identified.
// - Instructions are available before or alongside the relevant input.
// - Additional descriptions are associated with aria-describedby when appropriate.
// - Native HTML constraints are used where they accurately express the requirement.
// - Validation errors identify the affected control.
// - Error messages explain how the user can correct the problem.
// - Invalid controls expose their invalid state.
// - Error summaries provide useful navigation when multiple errors exist.
// - Valid values are preserved when possible after validation.
// - Focus can move to the first invalid field when appropriate.
// - Success and submission states are communicated.
// - Color is not the only indication of an error or required state.
// - Keyboard users can reach and operate every form control.
// - Native controls are preferred over custom replacements.
// - Client-side validation does not replace server-side validation.
// - Dynamic fields expose their state and relationships.
// - Focus is managed deliberately when form steps or fields change.
// - Forms do not rely on placeholder text as their only labels.
// - Form instructions and errors are understandable to assistive technology.

// ---------------------------------------------------------------------
// 72. Integrated accessible form
// ---------------------------------------------------------------------

interface ContactValues {
  readonly name: string;
  readonly email: string;
  readonly message: string;
}

interface ContactErrors {
  readonly name?: string;
  readonly email?: string;
  readonly message?: string;
}

export const AccessibleContactForm: FC = (): ReactElement => {
  const [values, setValues] = useState<ContactValues>({
    name: "",
    email: "",
    message: "",
  });

  const [errors, setErrors] = useState<ContactErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const firstErrorRef = useRef<HTMLInputElement>(null);

  const updateValue = (field: keyof ContactValues, value: string): void => {
    setValues((current) => ({
      ...current,
      [field]: value,
    }));

    setErrors((current) => ({
      ...current,
      [field]: undefined,
    }));
  };

  const validate = (): ContactErrors => {
    const nextErrors: ContactErrors = {};

    if (!values.name.trim()) {
      nextErrors.name = "Enter your name.";
    }

    if (!values.email.includes("@")) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (!values.message.trim()) {
      nextErrors.message = "Enter a message.";
    }

    return nextErrors;
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    const nextErrors = validate();

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      setSubmitted(false);

      if (nextErrors.name) {
        firstErrorRef.current?.focus();
      }

      return;
    }

    setErrors({});
    setSubmitted(true);
  };

  const nameErrorId = "contact-name-error";
  const emailErrorId = "contact-email-error";
  const messageErrorId = "contact-message-error";

  return (
    <form onSubmit={handleSubmit}>
      <h1>Contact us</h1>

      <p>Fields marked as required must be completed.</p>

      {Object.keys(errors).length > 0 && (
        <div role="alert">
          <h2>Please correct the following errors</h2>

          <ul>
            {errors.name && (
              <li>
                <a href="#contact-name">{errors.name}</a>
              </li>
            )}

            {errors.email && (
              <li>
                <a href="#contact-email">{errors.email}</a>
              </li>
            )}

            {errors.message && (
              <li>
                <a href="#contact-message">{errors.message}</a>
              </li>
            )}
          </ul>
        </div>
      )}

      <div>
        <label htmlFor="contact-name">Name (required)</label>

        <input
          ref={firstErrorRef}
          id="contact-name"
          name="name"
          type="text"
          value={values.name}
          required
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? nameErrorId : undefined}
          onChange={(event) => {
            updateValue("name", event.target.value);
          }}
        />

        {errors.name && <p id={nameErrorId}>{errors.name}</p>}
      </div>

      <div>
        <label htmlFor="contact-email">Email address (required)</label>

        <input
          id="contact-email"
          name="email"
          type="email"
          value={values.email}
          required
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? emailErrorId : undefined}
          onChange={(event) => {
            updateValue("email", event.target.value);
          }}
        />

        {errors.email && <p id={emailErrorId}>{errors.email}</p>}
      </div>

      <div>
        <label htmlFor="contact-message">Message (required)</label>

        <textarea
          id="contact-message"
          name="message"
          value={values.message}
          required
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? messageErrorId : undefined}
          onChange={(event) => {
            updateValue("message", event.target.value);
          }}
        />

        {errors.message && <p id={messageErrorId}>{errors.message}</p>}
      </div>

      <button type="submit">Send message</button>

      {submitted && <p role="status">Your message was sent successfully.</p>}
    </form>
  );
};

export default AccessibleContactForm;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Accessible forms provide clear labels, instructions, grouping, validation, and feedback.
// - Prefer native HTML form controls whenever they provide the required behavior.
// - Associate every form control with a clear accessible label.
// - Use label and htmlFor/id relationships for explicit label associations.
// - Wrapping a control in its label also creates a native label relationship.
// - Placeholder text should supplement a label, not replace it.
// - Use aria-describedby for supplementary instructions and descriptions.
// - Use fieldset and legend to group related controls.
// - Clearly identify required fields with both understandable text and native required constraints when appropriate.
// - Use semantic input types such as email, url, date, number, search, and password when they match the data.
// - autocomplete can communicate the purpose of common personal-information fields.
// - Native validation can provide useful browser-level constraints and feedback.
// - Custom validation should expose invalid state and understandable corrective messages.
// - aria-invalid should reflect an actual validation state rather than merely indicating that a field is required.
// - aria-errormessage can identify the error message associated with an invalid control.
// - Error messages should identify the problem and explain how to correct it.
// - Error summaries can provide an overview and links to invalid controls.
// - Preserve valid user-entered information when validation fails.
// - Moving focus to the first invalid control can help users locate the next required action.
// - Success and failure states should be communicated without relying only on visual styling.
// - Keyboard access should be preserved through native form controls and native form submission.
// - Client-side validation improves the interface but does not replace server-side validation.
// - Dynamic form fields need understandable labels, states, and relationships.
// - Reusable React form components should preserve native semantics and accessible relationships.
// - Focus should be moved deliberately when a meaningful form change requires it, not after every submission.
// - Accessible forms should be tested with keyboard navigation, assistive technology, and realistic validation states.
