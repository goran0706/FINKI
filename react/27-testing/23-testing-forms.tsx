/**
 * Testing Forms
 * =============
 *
 * Form tests should verify the behavior users experience when entering values,
 * submitting forms, and encountering validation or error states. Prefer
 * accessible queries and realistic user interactions over inspecting form internals.
 */

import { type FormEvent, type FC, type ReactElement, useState } from "react";

// ---------------------------------------------------------------------
// 1. Basic form
// ---------------------------------------------------------------------

interface ContactFormProps {
  readonly onSubmit: (name: string, email: string) => void;
}

export const ContactForm: FC<ContactFormProps> = ({ onSubmit }): ReactElement => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    onSubmit(name, email);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Name
        <input type="text" value={name} onChange={(event) => setName(event.target.value)} />
      </label>
      <label>
        Email
        <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
      </label>
      <button type="submit">Send</button>
    </form>
  );
};

// A basic form test can verify the complete user flow:
//
// const user = userEvent.setup();
// const onSubmit = vi.fn();
//
// render(<ContactForm onSubmit={onSubmit} />);
//
// await user.type(
//     screen.getByRole("textbox", {name: "Name"}),
//     "John Doe",
// );
// await user.type(
//     screen.getByRole("textbox", {name: "Email"}),
//     "john@example.com",
// );
// await user.click(screen.getByRole("button", {name: "Send"}));
//
// expect(onSubmit).toHaveBeenCalledWith(
//     "John Doe",
//     "john@example.com",
// );

// ---------------------------------------------------------------------
// 2. Testing form fields
// ---------------------------------------------------------------------

// Query form controls by their accessible roles or labels:
//
// screen.getByRole("textbox", {name: "Name"});
// screen.getByRole("textbox", {name: "Email"});
//
// Labels provide accessible names for the associated controls.
//
// Avoid selecting inputs by implementation-specific CSS selectors when an
// accessible query can express the user's interaction directly.

// ---------------------------------------------------------------------
// 3. Testing initial values
// ---------------------------------------------------------------------

interface ProfileFormProps {
  readonly initialName?: string;
}

export const ProfileForm: FC<ProfileFormProps> = ({ initialName = "" }): ReactElement => {
  const [name, setName] = useState(initialName);

  return (
    <form>
      <label>
        Name
        <input type="text" value={name} onChange={(event) => setName(event.target.value)} />
      </label>
    </form>
  );
};

// Verify the value presented to the user:
//
// render(<ProfileForm initialName="John Doe" />);
//
// expect(screen.getByRole("textbox", {name: "Name"})).toHaveValue("John Doe");

// ---------------------------------------------------------------------
// 4. Testing text input
// ---------------------------------------------------------------------

// Use `user.type` for normal text entry:
//
// const user = userEvent.setup();
//
// const input = screen.getByRole("textbox", {name: "Name"});
//
// await user.type(input, "John Doe");
//
// expect(input).toHaveValue("John Doe");
//
// This tests the interaction through the same input element the user sees.

// ---------------------------------------------------------------------
// 5. Clearing a field
// ---------------------------------------------------------------------

// `user.clear` removes the current value before subsequent input:
//
// const user = userEvent.setup();
//
// const input = screen.getByRole("textbox", {name: "Name"});
//
// await user.clear(input);
// await user.type(input, "Jane Doe");
//
// expect(input).toHaveValue("Jane Doe");

// ---------------------------------------------------------------------
// 6. Testing select fields
// ---------------------------------------------------------------------

interface CountryFormProps {
  readonly onSubmit: (country: string) => void;
}

export const CountryForm: FC<CountryFormProps> = ({ onSubmit }): ReactElement => {
  const [country, setCountry] = useState("Canada");

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    onSubmit(country);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Country
        <select value={country} onChange={(event) => setCountry(event.target.value)}>
          <option value="Canada">Canada</option>
          <option value="Germany">Germany</option>
          <option value="Japan">Japan</option>
        </select>
      </label>
      <button type="submit">Save</button>
    </form>
  );
};

// Select an option through the user interaction API:
//
// const user = userEvent.setup();
//
// render(<CountryForm onSubmit={onSubmit} />);
//
// const select = screen.getByRole("combobox", {name: "Country"});
//
// await user.selectOptions(select, "Japan");
//
// expect(select).toHaveValue("Japan");

// ---------------------------------------------------------------------
// 7. Testing checkboxes
// ---------------------------------------------------------------------

interface PreferencesFormProps {
  readonly onSubmit: (accepted: boolean) => void;
}

export const PreferencesForm: FC<PreferencesFormProps> = ({ onSubmit }): ReactElement => {
  const [accepted, setAccepted] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    onSubmit(accepted);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        <input type="checkbox" checked={accepted} onChange={(event) => setAccepted(event.target.checked)} />
        Accept terms
      </label>
      <button type="submit">Continue</button>
    </form>
  );
};

// Test checkbox state through its accessible role:
//
// const checkbox = screen.getByRole("checkbox", {name: "Accept terms"});
//
// expect(checkbox).not.toBeChecked();
//
// await user.click(checkbox);
//
// expect(checkbox).toBeChecked();

// ---------------------------------------------------------------------
// 8. Testing radio groups
// ---------------------------------------------------------------------

export const ContactMethodForm: FC = (): ReactElement => {
  const [method, setMethod] = useState("email");

  return (
    <form>
      <fieldset>
        <legend>Preferred contact method</legend>
        <label>
          <input
            type="radio"
            name="contact"
            value="email"
            checked={method === "email"}
            onChange={(event) => setMethod(event.target.value)}
          />
          Email
        </label>
        <label>
          <input
            type="radio"
            name="contact"
            value="phone"
            checked={method === "phone"}
            onChange={(event) => setMethod(event.target.value)}
          />
          Phone
        </label>
      </fieldset>
    </form>
  );
};

// Radio buttons can be queried by role and accessible name:
//
// const phone = screen.getByRole("radio", {name: "Phone"});
//
// await user.click(phone);
//
// expect(phone).toBeChecked();
// expect(screen.getByRole("radio", {name: "Email"})).not.toBeChecked();

// ---------------------------------------------------------------------
// 9. Required fields
// ---------------------------------------------------------------------

export const RequiredForm: FC = (): ReactElement => {
  return (
    <form>
      <label>
        Name
        <input type="text" name="name" required />
      </label>
      <button type="submit">Save</button>
    </form>
  );
};

// Native validation state can be tested:
//
// const input = screen.getByRole("textbox", {name: "Name"});
//
// expect(input).toBeRequired();
//
// expect(input).toBeInvalid();
//
// await user.type(input, "John Doe");
//
// expect(input).toBeValid();

// ---------------------------------------------------------------------
// 10. Testing validation messages
// ---------------------------------------------------------------------

interface ValidatedFormProps {
  readonly onSubmit: (email: string) => void;
}

export const ValidatedForm: FC<ValidatedFormProps> = ({ onSubmit }): ReactElement => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    if (!email.includes("@")) {
      setError("Enter a valid email address");
      return;
    }

    setError(null);
    onSubmit(email);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Email
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          aria-invalid={error !== null}
          aria-describedby={error ? "email-error" : undefined}
        />
      </label>
      {error && <p id="email-error">{error}</p>}
      <button type="submit">Send</button>
    </form>
  );
};

// The invalid submission can be tested through observable behavior:
//
// const user = userEvent.setup();
//
// render(<ValidatedForm onSubmit={onSubmit} />);
//
// await user.click(screen.getByRole("button", {name: "Send"}));
//
// expect(
//     screen.getByText("Enter a valid email address"),
// ).toBeInTheDocument();
//
// expect(onSubmit).not.toHaveBeenCalled();

// ---------------------------------------------------------------------
// 11. Testing valid submission
// ---------------------------------------------------------------------

// After correcting the invalid input:
//
// const input = screen.getByRole("textbox", {name: "Email"});
//
// await user.type(input, "john@example.com");
// await user.click(screen.getByRole("button", {name: "Send"}));
//
// expect(onSubmit).toHaveBeenCalledWith("john@example.com");
//
// The test verifies that valid user input reaches the submission boundary.

// ---------------------------------------------------------------------
// 12. Testing submit with Enter
// ---------------------------------------------------------------------

// Forms should also support keyboard submission when their structure permits it:
//
// const user = userEvent.setup();
//
// const input = screen.getByRole("textbox", {name: "Email"});
//
// await user.type(input, "john@example.com");
// await user.keyboard("{Enter}");
//
// expect(onSubmit).toHaveBeenCalledWith("john@example.com");
//
// This tests a keyboard-driven submission rather than clicking the submit button.

// ---------------------------------------------------------------------
// 13. Testing disabled submit controls
// ---------------------------------------------------------------------

interface SubmitButtonFormProps {
  readonly canSubmit: boolean;
}

export const SubmitButtonForm: FC<SubmitButtonFormProps> = ({ canSubmit }): ReactElement => {
  return (
    <form>
      <label>
        Name
        <input type="text" name="name" />
      </label>
      <button type="submit" disabled={!canSubmit}>
        Save
      </button>
    </form>
  );
};

// Verify the button's actual state:
//
// render(<SubmitButtonForm canSubmit={false} />);
//
// const button = screen.getByRole("button", {name: "Save"});
//
// expect(button).toBeDisabled();

// ---------------------------------------------------------------------
// 14. Testing asynchronous submission
// ---------------------------------------------------------------------

interface AsyncFormProps {
  readonly submit: (email: string) => Promise<void>;
}

export const AsyncForm: FC<AsyncFormProps> = ({ submit }): ReactElement => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "saved">("idle");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    setStatus("saving");

    try {
      await submit(email);
      setStatus("saved");
    } catch {
      setStatus("idle");
    }
  };

  return (
    <form onSubmit={(event) => void handleSubmit(event)}>
      <label>
        Email
        <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
      </label>
      <button type="submit">Save</button>
      <output aria-label="Save status">{status}</output>
    </form>
  );
};

// An asynchronous form test can wait for the observable result:
//
// const user = userEvent.setup();
// const submit = vi.fn().mockResolvedValue(undefined);
//
// render(<AsyncForm submit={submit} />);
//
// await user.type(
//     screen.getByRole("textbox", {name: "Email"}),
//     "john@example.com",
// );
// await user.click(screen.getByRole("button", {name: "Save"}));
//
// expect(await screen.findByLabelText("Save status")).toHaveTextContent("saved");
// expect(submit).toHaveBeenCalledWith("john@example.com");

// ---------------------------------------------------------------------
// 15. Testing submission errors
// ---------------------------------------------------------------------

// A rejected submission should produce the UI state defined by the component.
//
// const submit = vi.fn().mockRejectedValue(new Error("Request failed"));
//
// render(<AsyncForm submit={submit} />);
//
// const input = screen.getByRole("textbox", {name: "Email"});
//
// await user.type(input, "john@example.com");
// await user.click(screen.getByRole("button", {name: "Save"}));
//
// await waitFor(() => {
//     expect(screen.getByLabelText("Save status")).toHaveTextContent("idle");
// });
//
// The test should verify the application's visible error behavior rather than
// assuming that every failed request must produce a particular UI.

// ---------------------------------------------------------------------
// 16. Testing form reset
// ---------------------------------------------------------------------

export const ResettableForm: FC = (): ReactElement => {
  const [name, setName] = useState("John Doe");

  return (
    <form>
      <label>
        Name
        <input type="text" value={name} onChange={(event) => setName(event.target.value)} />
      </label>
      <button type="reset" onClick={() => setName("John Doe")}>
        Reset
      </button>
    </form>
  );
};

// Test the user-visible state before and after reset:
//
// const user = userEvent.setup();
//
// render(<ResettableForm />);
//
// const input = screen.getByRole("textbox", {name: "Name"});
//
// await user.clear(input);
// await user.type(input, "Jane Doe");
//
// expect(input).toHaveValue("Jane Doe");
//
// await user.click(screen.getByRole("button", {name: "Reset"}));
//
// expect(input).toHaveValue("John Doe");

// ---------------------------------------------------------------------
// 17. Testing form values together
// ---------------------------------------------------------------------

// When a form represents a set of related values, `toHaveFormValues` can
// verify the resulting form state:
//
// const form = screen.getByRole("form");
//
// expect(form).toHaveFormValues({
//     name: "John Doe",
//     country: "Japan",
// });
//
// This can be useful when several controls together represent one form state.

// ---------------------------------------------------------------------
// 18. Testing the complete form workflow
// ---------------------------------------------------------------------

// A complete form test should follow the same sequence as a real user:
//
// const user = userEvent.setup();
// const onSubmit = vi.fn();
//
// render(<ContactForm onSubmit={onSubmit} />);
//
// await user.type(
//     screen.getByRole("textbox", {name: "Name"}),
//     "John Doe",
// );
// await user.type(
//     screen.getByRole("textbox", {name: "Email"}),
//     "john@example.com",
// );
// await user.click(screen.getByRole("button", {name: "Send"}));
//
// expect(onSubmit).toHaveBeenCalledWith(
//     "John Doe",
//     "john@example.com",
// );
//
// The test covers input, submission, and the externally observable submission
// contract without inspecting React state or event-handler implementation details.

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Query form controls through accessible roles, names, and labels.
// - Use `userEvent` for typing, clearing, selecting, checking, and submitting.
// - Assert controlled values with matchers such as `toHaveValue` and `toBeChecked`.
// - Verify validation through observable error messages and accessibility state.
// - Test both invalid and valid submission paths when they are part of the form contract.
// - Use `findBy...` or `waitFor` for asynchronous submission results.
// - Verify disabled and required states through the DOM.
// - Test keyboard submission when keyboard behavior is part of the form contract.
// - Prefer complete user workflows over assertions about internal React state.
