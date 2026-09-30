/**
 * jest-dom Matchers
 * =================
 *
 * jest-dom extends Jest-style assertions with matchers designed for testing DOM elements.
 * These matchers allow tests to express expectations about visibility, accessibility, form state,
 * attributes, text content, and other observable DOM behavior.
 */

import { type FC, type ReactElement } from "react";

// ---------------------------------------------------------------------
// 1. What jest-dom provides
// ---------------------------------------------------------------------

// Standard JavaScript equality:
//
// expect(element.textContent).toBe("Welcome");
//
// jest-dom provides DOM-specific assertions:
//
// expect(element).toBeInTheDocument();
// expect(element).toBeVisible();
// expect(button).toBeEnabled();
//
// These assertions communicate the intended DOM behavior more clearly
// than manually inspecting individual DOM properties.

// ---------------------------------------------------------------------
// 2. toBeInTheDocument
// ---------------------------------------------------------------------

export const WelcomeMessage: FC = (): ReactElement => <p>Welcome back</p>;

// toBeInTheDocument verifies that an element is present in the document:
//
// expect(screen.getByText("Welcome back")).toBeInTheDocument();
//
// It is useful when the test specifically needs to assert document presence.

// ---------------------------------------------------------------------
// 3. not.toBeInTheDocument
// ---------------------------------------------------------------------

// The matcher can be negated with `.not`:
//
// expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
//
// queryByText is appropriate here because the element is expected to be absent.
// getByText would throw before the matcher could evaluate the absence.

// ---------------------------------------------------------------------
// 4. toBeVisible
// ---------------------------------------------------------------------

export const VisiblePanel: FC = (): ReactElement => (
  <section aria-label="Account">
    <h2>Account</h2>
    <p>Your account details</p>
  </section>
);

// toBeVisible checks whether an element is considered visible:
//
// expect(screen.getByRole("region", {name: "Account"})).toBeVisible();
//
// Visibility depends on relevant DOM and CSS conditions rather than simply
// whether the element exists in the document.

// ---------------------------------------------------------------------
// 5. toBeEmptyDOMElement
// ---------------------------------------------------------------------

// toBeEmptyDOMElement checks that an element has no child nodes:
//
// expect(screen.getByRole("status")).toBeEmptyDOMElement();
//
// Text nodes count as content, so an element containing whitespace or text
// should not be treated as an empty DOM element.

// ---------------------------------------------------------------------
// 6. toHaveTextContent
// ---------------------------------------------------------------------

export const StatusMessage: FC = (): ReactElement => <p role="status">Saved successfully</p>;

// Match exact or partial text content:
//
// expect(screen.getByRole("status")).toHaveTextContent("Saved successfully");
// expect(screen.getByRole("status")).toHaveTextContent(/saved successfully/i);
//
// This matcher is useful when the text content itself is the behavior
// being asserted.

// ---------------------------------------------------------------------
// 7. toHaveAttribute
// ---------------------------------------------------------------------

export const ExternalLink: FC = (): ReactElement => (
  <a href="https://example.com" target="_blank" rel="noreferrer">
    Open example
  </a>
);

// Verify an attribute:
//
// expect(screen.getByRole("link", {name: "Open example"}))
//     .toHaveAttribute("href", "https://example.com");
//
// Without a second argument, the matcher checks only that the attribute exists:
//
// expect(link).toHaveAttribute("target");

// ---------------------------------------------------------------------
// 8. toHaveClass
// ---------------------------------------------------------------------

export const PrimaryButton: FC = (): ReactElement => (
  <button className="button button-primary" type="button">
    Save
  </button>
);

// Verify one or more CSS classes:
//
// expect(screen.getByRole("button", {name: "Save"}))
//     .toHaveClass("button", "button-primary");
//
// This matcher is useful when a class is part of the observable behavior
// being tested, but tests should avoid using CSS classes merely as selectors
// when a semantic query is available.

// ---------------------------------------------------------------------
// 9. toHaveStyle
// ---------------------------------------------------------------------

export const Highlight: FC = (): ReactElement => <p style={{ fontWeight: "bold" }}>Important</p>;

// Verify inline or computed style declarations:
//
// expect(screen.getByText("Important")).toHaveStyle({
//     fontWeight: "bold",
// });
//
// The matcher is intended for assertions about rendered styles, not for
// testing an application's entire stylesheet.

// ---------------------------------------------------------------------
// 10. toBeDisabled
// ---------------------------------------------------------------------

export const DisabledButton: FC = (): ReactElement => (
  <button type="button" disabled>
    Submit
  </button>
);

// Verify disabled state:
//
// expect(screen.getByRole("button", {name: "Submit"})).toBeDisabled();
//
// This communicates the intended form-control state more directly than
// checking `element.disabled` manually.

// ---------------------------------------------------------------------
// 11. toBeEnabled
// ---------------------------------------------------------------------

export const EnabledButton: FC = (): ReactElement => <button type="button">Continue</button>;

// Verify that a form-associated element is enabled:
//
// expect(screen.getByRole("button", {name: "Continue"})).toBeEnabled();

// ---------------------------------------------------------------------
// 12. toBeChecked
// ---------------------------------------------------------------------

export const Preferences: FC = (): ReactElement => (
  <label>
    <input type="checkbox" defaultChecked />
    Receive updates
  </label>
);

// Verify checkbox or radio state:
//
// expect(screen.getByRole("checkbox", {name: "Receive updates"}))
//     .toBeChecked();
//
// This is clearer than manually checking the element's `checked` property.

// ---------------------------------------------------------------------
// 13. toBePartiallyChecked
// ---------------------------------------------------------------------

// toBePartiallyChecked is useful for a checkbox that represents an
// indeterminate or mixed state:
//
// expect(screen.getByRole("checkbox", {name: "Select all"}))
//     .toBePartiallyChecked();
//
// The state can be represented by the native indeterminate property
// or the appropriate ARIA mixed state.

// ---------------------------------------------------------------------
// 14. toHaveFormValues
// ---------------------------------------------------------------------

export const ProfileForm: FC = (): ReactElement => (
  <form aria-label="Profile">
    <label>
      Name
      <input name="name" defaultValue="John Doe" />
    </label>
    <label>
      <input name="notifications" type="checkbox" defaultChecked />
      Notifications
    </label>
  </form>
);

// toHaveFormValues checks the values represented by form controls:
//
// expect(screen.getByRole("form", {name: "Profile"})).toHaveFormValues({
//     name: "John Doe",
//     notifications: true,
// });
//
// It is useful when the test cares about the form's current state as a whole.

// ---------------------------------------------------------------------
// 15. toHaveValue
// ---------------------------------------------------------------------

export const EmailInput: FC = (): ReactElement => (
  <label>
    Email
    <input type="email" value="john@example.com" readOnly />
  </label>
);

// Verify the current value of a form control:
//
// expect(screen.getByRole("textbox", {name: "Email"}))
//     .toHaveValue("john@example.com");

// ---------------------------------------------------------------------
// 16. toHaveDisplayValue
// ---------------------------------------------------------------------

// toHaveDisplayValue verifies the value displayed by a form control:
//
// expect(screen.getByRole("textbox", {name: "Email"}))
//     .toHaveDisplayValue("john@example.com");
//
// It is particularly useful when the displayed value is what matters
// to the user rather than the underlying DOM value representation.

// ---------------------------------------------------------------------
// 17. toBeRequired
// ---------------------------------------------------------------------

export const RequiredEmail: FC = (): ReactElement => (
  <label>
    Email
    <input type="email" required />
  </label>
);

// Verify that a form control is required:
//
// expect(screen.getByRole("textbox", {name: "Email"})).toBeRequired();

// ---------------------------------------------------------------------
// 18. toBeInvalid
// ---------------------------------------------------------------------

export const InvalidEmail: FC = (): ReactElement => (
  <label>
    Email
    <input type="email" required aria-invalid="true" value="invalid-value" readOnly />
  </label>
);

// Verify invalid state:
//
// expect(screen.getByRole("textbox", {name: "Email"})).toBeInvalid();
//
// This matcher can use the element's validity state or relevant ARIA
// invalid state to determine whether the control is invalid.

// ---------------------------------------------------------------------
// 19. toBeValid
// ---------------------------------------------------------------------

export const ValidEmail: FC = (): ReactElement => (
  <label>
    Email
    <input type="email" required value="john@example.com" readOnly />
  </label>
);

// Verify valid state:
//
// expect(screen.getByRole("textbox", {name: "Email"})).toBeValid();

// ---------------------------------------------------------------------
// 20. toHaveAccessibleName
// ---------------------------------------------------------------------

export const LabeledButton: FC = (): ReactElement => <button type="button">Save changes</button>;

// Verify the accessible name exposed to assistive technologies:
//
// expect(screen.getByRole("button")).toHaveAccessibleName("Save changes");
//
// This is particularly useful when testing accessibility-related semantics.

// ---------------------------------------------------------------------
// 21. toHaveAccessibleDescription
// ---------------------------------------------------------------------

export const DescribedInput: FC = (): ReactElement => (
  <div>
    <label htmlFor="password">Password</label>
    <p id="password-help">Use at least eight characters.</p>
    <input id="password" aria-describedby="password-help" type="password" />
  </div>
);

// Verify the accessible description:
//
// expect(screen.getByLabelText("Password"))
//     .toHaveAccessibleDescription("Use at least eight characters.");

// ---------------------------------------------------------------------
// 22. toHaveErrorMessage
// ---------------------------------------------------------------------

// For form validation, a control can expose an associated error message:
//
// <input aria-errormessage="email-error" aria-invalid="true" />
// <p id="email-error">Enter a valid email address.</p>
//
// expect(screen.getByRole("textbox", {name: "Email"}))
//     .toHaveErrorMessage("Enter a valid email address.");
//
// The matcher verifies the error message associated with the element.

// ---------------------------------------------------------------------
// 23. Matchers describe behavior
// ---------------------------------------------------------------------

// Prefer:
//
// expect(button).toBeDisabled();
//
// over:
//
// expect(button.disabled).toBe(true);
//
// Prefer:
//
// expect(message).toHaveTextContent("Saved");
//
// over:
//
// expect(message.textContent).toContain("Saved");
//
// DOM-specific matchers keep assertions close to the behavior being tested.

// ---------------------------------------------------------------------
// 24. Combining queries and matchers
// ---------------------------------------------------------------------

// A typical Testing Library assertion combines:
//
// 1. a user-facing query to locate the element;
// 2. a jest-dom matcher to verify its state.
//
// Example:
//
// const button = screen.getByRole("button", {name: "Save"});
// expect(button).toBeEnabled();
// expect(button).toHaveTextContent("Save");
//
// The query identifies the element through its accessible interface,
// while the matcher describes the expected DOM state.

// ---------------------------------------------------------------------
// 25. Negating jest-dom matchers
// ---------------------------------------------------------------------

// jest-dom matchers can be negated with `.not`:
//
// expect(screen.queryByRole("alert")).not.toBeInTheDocument();
// expect(button).not.toBeDisabled();
// expect(input).not.toHaveValue("old@example.com");
//
// The matcher remains the same; `.not` reverses the expectation.

// ---------------------------------------------------------------------
// 26. Matcher selection
// ---------------------------------------------------------------------

// Choose the matcher that expresses the property being tested:
//
// toBeInTheDocument()          -> document presence
// toBeVisible()                -> visibility
// toHaveTextContent()          -> text content
// toHaveAttribute()            -> attributes
// toHaveClass()                -> CSS classes
// toHaveStyle()                -> styles
// toBeDisabled()               -> disabled state
// toBeChecked()                -> checked state
// toHaveValue()                -> form-control value
// toHaveFormValues()           -> form values
// toBeRequired()               -> required state
// toBeInvalid()                -> invalid state
// toHaveAccessibleName()       -> accessible name
// toHaveAccessibleDescription()-> accessible description

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - jest-dom provides DOM-specific matchers for Jest-style assertions.
// - Matchers make expectations about rendered DOM behavior more expressive.
// - toBeInTheDocument checks whether an element is present in the document.
// - toBeVisible checks whether an element is considered visible.
// - toHaveTextContent checks rendered text content.
// - toHaveAttribute, toHaveClass, and toHaveStyle check DOM presentation details.
// - toBeDisabled, toBeEnabled, toBeChecked, and toBeRequired check control state.
// - toHaveValue and toHaveDisplayValue check form-control values.
// - toHaveFormValues checks the values represented by a form.
// - toBeInvalid and toBeValid check form validity state.
// - toHaveAccessibleName and toHaveAccessibleDescription support accessibility assertions.
// - Combining user-facing queries with DOM-specific matchers produces expressive tests.
// - `.not` can negate any applicable jest-dom matcher.
