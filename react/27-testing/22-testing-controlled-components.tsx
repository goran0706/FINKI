/**
 * Testing Controlled Components
 * =============================
 *
 * Controlled components receive their current value from React state and notify
 * their parent when the user requests a change. Tests should verify the rendered
 * value, user interaction, callback arguments, and the relationship between the
 * parent state and the controlled component.
 */

import { type ChangeEvent, type FC, type ReactElement, useState } from "react";

// ---------------------------------------------------------------------
// 1. Basic controlled input
// ---------------------------------------------------------------------

interface NameInputProps {
  readonly value: string;
  readonly onChange: (value: string) => void;
}

export const NameInput: FC<NameInputProps> = ({ value, onChange }): ReactElement => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    onChange(event.target.value);
  };

  return (
    <label>
      Name
      <input type="text" value={value} onChange={handleChange} />
    </label>
  );
};

// The test should provide the controlled value:
//
// render(<NameInput value="" onChange={onChange} />);
//
// const input = screen.getByRole("textbox", {name: "Name"});
//
// expect(input).toHaveValue("");

// ---------------------------------------------------------------------
// 2. Testing the change callback
// ---------------------------------------------------------------------

// A controlled component does not own the value itself.
// It reports the requested value to its parent.
//
// const onChange = vi.fn();
//
// render(<NameInput value="" onChange={onChange} />);
//
// const input = screen.getByRole("textbox", {name: "Name"});
//
// await user.type(input, "John Doe");
//
// expect(onChange).toHaveBeenLastCalledWith("John Doe");
//
// The important assertion is the value supplied to the callback.

// ---------------------------------------------------------------------
// 3. Testing the parent-controlled value
// ---------------------------------------------------------------------

export const NameForm: FC = (): ReactElement => {
  const [name, setName] = useState("");

  return (
    <form>
      <NameInput value={name} onChange={setName} />
      <output aria-label="Current name">{name}</output>
    </form>
  );
};

// A component-level test can verify the complete controlled data flow:
//
// render(<NameForm />);
//
// const input = screen.getByRole("textbox", {name: "Name"});
// const output = screen.getByLabelText("Current name");
//
// await user.type(input, "John Doe");
//
// expect(input).toHaveValue("John Doe");
// expect(output).toHaveTextContent("John Doe");
//
// The parent owns the state, while the child receives the current value.

// ---------------------------------------------------------------------
// 4. Controlled versus uncontrolled behavior
// ---------------------------------------------------------------------

// Controlled:
//
// <input value={name} onChange={handleChange} />
//
// The rendered value comes from React state.
//
// Uncontrolled:
//
// <input defaultValue="John Doe" />
//
// The DOM maintains the current value after initialization.
//
// A controlled-component test should therefore verify the relationship between
// the callback and the value supplied back through props.

// ---------------------------------------------------------------------
// 5. Testing a controlled checkbox
// ---------------------------------------------------------------------

interface CheckboxProps {
  readonly checked: boolean;
  readonly onChange: (checked: boolean) => void;
}

export const TermsCheckbox: FC<CheckboxProps> = ({ checked, onChange }): ReactElement => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    onChange(event.target.checked);
  };

  return (
    <label>
      <input type="checkbox" checked={checked} onChange={handleChange} />
      Accept terms
    </label>
  );
};

// The test can verify both the callback and the controlled value:
//
// const onChange = vi.fn();
//
// render(<TermsCheckbox checked={false} onChange={onChange} />);
//
// const checkbox = screen.getByRole("checkbox", {name: "Accept terms"});
//
// expect(checkbox).not.toBeChecked();
//
// await user.click(checkbox);
//
// expect(onChange).toHaveBeenCalledWith(true);

// ---------------------------------------------------------------------
// 6. Controlled checkbox with parent state
// ---------------------------------------------------------------------

export const TermsForm: FC = (): ReactElement => {
  const [accepted, setAccepted] = useState(false);

  return (
    <form>
      <TermsCheckbox checked={accepted} onChange={setAccepted} />
      <output aria-label="Terms status">{accepted ? "Accepted" : "Not accepted"}</output>
    </form>
  );
};

// A complete interaction test:
//
// render(<TermsForm />);
//
// const checkbox = screen.getByRole("checkbox", {name: "Accept terms"});
// const status = screen.getByLabelText("Terms status");
//
// expect(checkbox).not.toBeChecked();
// expect(status).toHaveTextContent("Not accepted");
//
// await user.click(checkbox);
//
// expect(checkbox).toBeChecked();
// expect(status).toHaveTextContent("Accepted");

// ---------------------------------------------------------------------
// 7. Controlled select
// ---------------------------------------------------------------------

type Country = "Canada" | "Germany" | "Japan";

interface CountrySelectProps {
  readonly value: Country;
  readonly onChange: (value: Country) => void;
}

export const CountrySelect: FC<CountrySelectProps> = ({ value, onChange }): ReactElement => {
  const handleChange = (event: ChangeEvent<HTMLSelectElement>): void => {
    onChange(event.target.value as Country);
  };

  return (
    <label>
      Country
      <select value={value} onChange={handleChange}>
        <option value="Canada">Canada</option>
        <option value="Germany">Germany</option>
        <option value="Japan">Japan</option>
      </select>
    </label>
  );
};

// The test can verify the selected value:
//
// render(<CountrySelect value="Canada" onChange={onChange} />);
//
// const select = screen.getByRole("combobox", {name: "Country"});
//
// expect(select).toHaveValue("Canada");
//
// await user.selectOptions(select, "Japan");
//
// expect(onChange).toHaveBeenCalledWith("Japan");

// ---------------------------------------------------------------------
// 8. Controlled value must come from props
// ---------------------------------------------------------------------

interface DisplayInputProps {
  readonly value: string;
  readonly onChange: (value: string) => void;
}

export const DisplayInput: FC<DisplayInputProps> = ({ value, onChange }): ReactElement => {
  return (
    <label>
      Value
      <input value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
};

// A controlled component does not permanently accept a user-entered value
// unless the parent updates its `value` prop.
//
// const onChange = vi.fn();
//
// const {rerender} = render(
//     <DisplayInput value="John Doe" onChange={onChange} />,
// );
//
// const input = screen.getByRole("textbox", {name: "Value"});
//
// expect(input).toHaveValue("John Doe");
//
// await user.clear(input);
// await user.type(input, "Jane Doe");
//
// expect(onChange).toHaveBeenCalled();
// expect(input).toHaveValue("Jane Doe");
//
// In a real controlled flow, the parent receives the callback and renders
// the component again with the new value.

// ---------------------------------------------------------------------
// 9. Testing the controlled feedback loop
// ---------------------------------------------------------------------

// The most complete test keeps state in the test component:
//
// const ControlledExample: FC = () => {
//     const [value, setValue] = useState("");
//
//     return (
//         <NameInput value={value} onChange={setValue} />
//     );
// };
//
// render(<ControlledExample />);
//
// const input = screen.getByRole("textbox", {name: "Name"});
//
// await user.type(input, "John Doe");
//
// expect(input).toHaveValue("John Doe");
//
// This verifies the complete loop:
//
// user input -> child callback -> parent state -> new props -> rendered value.

// ---------------------------------------------------------------------
// 10. Testing externally controlled updates
// ---------------------------------------------------------------------

// Controlled components must also respond when their parent changes the value
// without direct user interaction.
//
// const {rerender} = render(
//     <NameInput value="John Doe" onChange={onChange} />,
// );
//
// const input = screen.getByRole("textbox", {name: "Name"});
//
// expect(input).toHaveValue("John Doe");
//
// rerender(
//     <NameInput value="Jane Doe" onChange={onChange} />,
// );
//
// expect(input).toHaveValue("Jane Doe");
//
// `rerender` is useful for testing prop-driven changes.

// ---------------------------------------------------------------------
// 11. Validation in controlled components
// ---------------------------------------------------------------------

interface EmailInputProps {
  readonly value: string;
  readonly error?: string;
  readonly onChange: (value: string) => void;
}

export const EmailInput: FC<EmailInputProps> = ({ value, error, onChange }): ReactElement => {
  return (
    <label>
      Email
      <input
        type="email"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={error !== undefined}
        aria-describedby={error ? "email-error" : undefined}
      />
      {error && <p id="email-error">{error}</p>}
    </label>
  );
};

// Validation should be tested through accessible behavior:
//
// render(
//     <EmailInput
//         value="invalid"
//         error="Enter a valid email address"
//         onChange={onChange}
//     />,
// );
//
// expect(screen.getByRole("textbox", {name: "Email"})).toHaveAttribute(
//     "aria-invalid",
//     "true",
// );
//
// expect(
//     screen.getByText("Enter a valid email address"),
// ).toBeInTheDocument();

// ---------------------------------------------------------------------
// 12. Controlled components and userEvent
// ---------------------------------------------------------------------

// Prefer `userEvent` for user interactions:
//
// const user = userEvent.setup();
//
// render(<NameForm />);
//
// await user.type(
//     screen.getByRole("textbox", {name: "Name"}),
//     "John Doe",
// );
//
// expect(screen.getByLabelText("Current name")).toHaveTextContent("John Doe");
//
// `userEvent` exercises the interaction path that causes the controlled
// component's change handler to run.

// ---------------------------------------------------------------------
// 13. Avoid testing implementation details
// ---------------------------------------------------------------------

// Avoid asserting that a particular state setter was called:
//
// expect(setName).toHaveBeenCalledWith("John Doe");
//
// The setter is an implementation detail of the parent.
//
// Prefer asserting the observable result:
//
// expect(screen.getByRole("textbox", {name: "Name"})).toHaveValue("John Doe");
//
// The test remains valid if the parent later changes from `useState` to
// another state-management implementation.

// ---------------------------------------------------------------------
// 14. Controlled form submission
// ---------------------------------------------------------------------

export const ProfileForm: FC = (): ReactElement => {
  const [name, setName] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
  };

  return (
    <form onSubmit={handleSubmit}>
      <NameInput value={name} onChange={setName} />
      <button type="submit">Save</button>
    </form>
  );
};

// A test can verify the interaction without inspecting the component's state:
//
// render(<ProfileForm />);
//
// const input = screen.getByRole("textbox", {name: "Name"});
//
// await user.type(input, "John Doe");
//
// expect(input).toHaveValue("John Doe");
//
// await user.click(screen.getByRole("button", {name: "Save"}));

// ---------------------------------------------------------------------
// 15. Controlled component test checklist
// ---------------------------------------------------------------------

// A focused test should generally cover:
//
// - The initial value supplied through props.
// - The callback emitted when the user changes the value.
// - The updated value after the parent processes that callback.
// - External prop changes through `rerender` when relevant.
// - Validation or disabled states when they are part of the component contract.
//
// Do not test every internal state transition if the resulting behavior is
// already covered by observable assertions.

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Controlled components receive their current value from props.
// - The parent owns the state and provides an `onChange`-style callback.
// - Test the initial controlled value through the rendered element.
// - Test user interaction through `userEvent`.
// - Test callback arguments when the callback is part of the component contract.
// - Test the complete parent-child feedback loop when appropriate.
// - Use `rerender` to verify externally controlled prop changes.
// - Test validation through observable DOM and accessibility behavior.
// - Prefer observable behavior over assertions about React state setters.
// - Controlled-component tests should verify the relationship between props, callbacks, and rendered values.
