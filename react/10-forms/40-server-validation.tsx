/**
 * Server Validation
 * ==================
 *
 * Server validation verifies submitted form data against rules that must be enforced outside the
 * browser. Client-side validation can provide immediate feedback, but it cannot establish that
 * server-owned data is valid, unique, authorized, or acceptable to the backend.
 *
 * Server validation is asynchronous because the client must send data to a remote system and wait
 * for its response. React form state therefore needs to distinguish the submission lifecycle from
 * the validation result, including states such as idle, submitting, valid, and invalid.
 *
 * Server errors should be associated with the field or form rule they describe. A server response
 * may report a field-specific problem such as an already-used email address, or a form-level
 * problem such as a failed business rule that does not belong to one individual field.
 */

import React from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface ServerValidationErrors {
  readonly email: string;
  readonly username: string;
  readonly form: string;
}

export interface ServerValidationEmailProps {
  readonly initialEmail: string;
}

export interface ServerValidationFormProps {
  readonly initialEmail: string;
  readonly initialUsername: string;
}

export interface ServerValidationLifecycleProps {
  readonly initialEmail: string;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

export const ServerValidationEmail: React.FC<ServerValidationEmailProps> = ({ initialEmail }): React.ReactElement => {
  const [email, setEmail] = React.useState<string>(initialEmail);
  const [error, setError] = React.useState<string>("");
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false);

  const validateOnServer = async (value: string): Promise<string> => {
    await new Promise<void>((resolve: () => void): void => {
      window.setTimeout(resolve, 500);
    });

    return value.trim().toLowerCase() === "taken@example.com" ? "This email address is already registered." : "";
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    setIsSubmitting(true);
    setError("");

    const serverError: string = await validateOnServer(email);

    setError(serverError);
    setIsSubmitting(false);

    if (serverError !== "") {
      return;
    }

    console.log("Server validation passed.");
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Email
        <input
          type="email"
          name="email"
          value={email}
          onChange={(event: React.ChangeEvent<HTMLInputElement>): void => {
            setEmail(event.target.value);
            setError("");
          }}
          aria-invalid={error !== ""}
          aria-describedby={error !== "" ? "server-email-error" : undefined}
        />
      </label>

      {error !== "" && <p id="server-email-error">{error}</p>}

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Checking..." : "Submit"}
      </button>
    </form>
  );
};

export const ServerValidationForm: React.FC<ServerValidationFormProps> = ({
  initialEmail,
  initialUsername,
}): React.ReactElement => {
  const [email, setEmail] = React.useState<string>(initialEmail);
  const [username, setUsername] = React.useState<string>(initialUsername);
  const [errors, setErrors] = React.useState<ServerValidationErrors>({
    email: "",
    username: "",
    form: "",
  });
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false);

  const validateOnServer = async (formEmail: string, formUsername: string): Promise<ServerValidationErrors> => {
    await new Promise<void>((resolve: () => void): void => {
      window.setTimeout(resolve, 500);
    });

    const normalizedEmail: string = formEmail.trim().toLowerCase();
    const normalizedUsername: string = formUsername.trim().toLowerCase();

    return {
      email: normalizedEmail === "taken@example.com" ? "This email address is already registered." : "",
      username: normalizedUsername === "admin" ? "This username is unavailable." : "",
      form:
        normalizedEmail === "taken@example.com" && normalizedUsername === "admin"
          ? "The submitted account details cannot be used together."
          : "",
    };
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrors({
      email: "",
      username: "",
      form: "",
    });

    const nextErrors: ServerValidationErrors = await validateOnServer(email, username);

    setErrors(nextErrors);
    setIsSubmitting(false);

    const hasErrors: boolean = nextErrors.email !== "" || nextErrors.username !== "" || nextErrors.form !== "";

    if (hasErrors) {
      return;
    }

    console.log("Server validation passed.");
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
            setErrors({
              email: "",
              username: "",
              form: "",
            });
          }}
          aria-invalid={errors.username !== ""}
        />
      </label>

      {errors.username !== "" && <p>{errors.username}</p>}

      <label>
        Email
        <input
          type="email"
          name="email"
          value={email}
          onChange={(event: React.ChangeEvent<HTMLInputElement>): void => {
            setEmail(event.target.value);
            setErrors({
              email: "",
              username: "",
              form: "",
            });
          }}
          aria-invalid={errors.email !== ""}
        />
      </label>

      {errors.email !== "" && <p>{errors.email}</p>}

      {errors.form !== "" && <p role="alert">{errors.form}</p>}

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Validating..." : "Submit"}
      </button>
    </form>
  );
};

export const ServerValidationLifecycle: React.FC<ServerValidationLifecycleProps> = ({
  initialEmail,
}): React.ReactElement => {
  const [email, setEmail] = React.useState<string>(initialEmail);
  const [status, setStatus] = React.useState<"idle" | "submitting" | "valid" | "invalid">("idle");
  const [error, setError] = React.useState<string>("");

  const validateOnServer = async (value: string): Promise<boolean> => {
    await new Promise<void>((resolve: () => void): void => {
      window.setTimeout(resolve, 500);
    });

    return value.trim().toLowerCase() !== "invalid@example.com";
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    setStatus("submitting");
    setError("");

    const isValid: boolean = await validateOnServer(email);

    if (!isValid) {
      setStatus("invalid");
      setError("The server rejected this email address.");
      return;
    }

    setStatus("valid");
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Email
        <input
          type="email"
          name="email"
          value={email}
          onChange={(event: React.ChangeEvent<HTMLInputElement>): void => {
            setEmail(event.target.value);
            setStatus("idle");
            setError("");
          }}
          aria-invalid={status === "invalid"}
        />
      </label>

      {status === "submitting" && <p>Validating with the server...</p>}

      {status === "invalid" && <p role="alert">{error}</p>}

      {status === "valid" && <p>Server validation passed.</p>}

      <button type="submit" disabled={status === "submitting"}>
        Submit
      </button>
    </form>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const MainContainer: React.FC = (): React.ReactElement => {
  return (
    <main>
      <h1>Server Validation</h1>

      <h2>1. Validating a Field Against Server-Owned Data</h2>
      <ServerValidationEmail initialEmail="" />

      <h2>2. Handling Field-Level and Form-Level Server Errors</h2>
      <ServerValidationForm initialEmail="" initialUsername="" />

      <h2>3. Representing the Asynchronous Validation Lifecycle</h2>
      <ServerValidationLifecycle initialEmail="" />
    </main>
  );
};

export default MainContainer;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Server validation checks submitted data against rules enforced outside the browser.
// - Client-side validation cannot establish server-owned facts such as whether an email is already registered.
// - Server validation is asynchronous because the client must wait for a remote response.
// - Submission state can distinguish idle, submitting, valid, and invalid states.
// - Server responses can contain field-specific errors or form-level errors.
// - Field-specific server errors should be associated with the control they describe.
// - Form-level server errors are useful for business rules that do not belong to one field.
// - Clearing a server error when its associated value changes prevents stale feedback.
// - A submission should not be treated as successful until the server validation or submission response has succeeded.
// - Disabling the submit button while a request is pending can prevent duplicate submissions, but server-side handling must still remain safe against repeated requests.
