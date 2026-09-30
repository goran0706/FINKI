/**
 * Query Priority
 * ==============
 *
 * Testing Library recommends choosing queries based on how closely they resemble the way users
 * interact with and identify elements. Prefer accessible, user-facing queries first and use
 * implementation-oriented queries such as test IDs only when a better semantic query is unavailable.
 */

import { type FC, type ReactElement } from "react";

// ---------------------------------------------------------------------
// 1. Query priority
// ---------------------------------------------------------------------

// Testing Library's recommended query priority is:
//
// 1. getByRole
// 2. getByLabelText
// 3. getByPlaceholderText
// 4. getByText
// 5. getByDisplayValue
// 6. getByAltText
// 7. getByTitle
// 8. getByTestId
//
// The priority is a guideline rather than a strict rule.
// The best query is the one that matches the user's reason for finding the element.

// ---------------------------------------------------------------------
// 2. getByRole
// ---------------------------------------------------------------------

// getByRole is generally the preferred query because it uses the element's
// accessible role and, optionally, its accessible name.
//
// Examples:
//
// screen.getByRole("button", {name: "Save"});
// screen.getByRole("heading", {name: "Account"});
// screen.getByRole("textbox", {name: "Email"});
//
// These queries describe elements in terms that assistive technologies
// and users can understand.

// ---------------------------------------------------------------------
// 3. getByLabelText
// ---------------------------------------------------------------------

interface LoginFormProps {
  readonly email: string;
  readonly onEmailChange: (value: string) => void;
}

export const LoginForm: FC<LoginFormProps> = ({ email, onEmailChange }): ReactElement => (
  <form>
    <label htmlFor="email">Email</label>
    <input id="email" value={email} onChange={(event) => onEmailChange(event.target.value)} />
    <button type="submit">Sign in</button>
  </form>
);

// A form control with a proper label can be queried through its label:
//
// screen.getByLabelText("Email");
//
// When the primary intent is to locate a form control by its associated
// label, getByLabelText expresses that intent directly.

// ---------------------------------------------------------------------
// 4. getByPlaceholderText
// ---------------------------------------------------------------------

// A placeholder can identify a control when the placeholder is meaningful
// and there is no better accessible label.
//
// <input placeholder="Search products" />
//
// screen.getByPlaceholderText("Search products");
//
// A placeholder should not normally replace a proper label.
// It disappears when the user enters a value and is not a substitute for
// accessible labeling.

// ---------------------------------------------------------------------
// 5. getByText
// ---------------------------------------------------------------------

interface MessageProps {
  readonly message: string;
}

export const Message: FC<MessageProps> = ({ message }): ReactElement => <p>{message}</p>;

// getByText is useful for visible text that is not better represented
// by another semantic query:
//
// screen.getByText("Welcome back");
//
// For interactive elements such as buttons, getByRole is usually more
// expressive:
//
// screen.getByRole("button", {name: "Continue"});

// ---------------------------------------------------------------------
// 6. getByDisplayValue
// ---------------------------------------------------------------------

// getByDisplayValue finds form controls by their current displayed value.
//
// <input value="John Doe" readOnly />
//
// screen.getByDisplayValue("John Doe");
//
// This is useful when the current value itself is the important part
// of the assertion, rather than the control's label.

// ---------------------------------------------------------------------
// 7. getByAltText
// ---------------------------------------------------------------------

// getByAltText is intended primarily for images and other elements that
// expose alternative text.
//
// <img src="/profile.jpg" alt="Profile photo" />
//
// screen.getByAltText("Profile photo");
//
// When an image is interactive, getByRole may better represent the user's
// interaction:
//
// screen.getByRole("img", {name: "Profile photo"});

// ---------------------------------------------------------------------
// 8. getByTitle
// ---------------------------------------------------------------------

// getByTitle queries the title attribute or corresponding title element.
//
// <button title="Close dialog">×</button>
//
// screen.getByTitle("Close dialog");
//
// This is lower in the priority order because title attributes are not
// generally the primary way users identify interface elements.

// ---------------------------------------------------------------------
// 9. getByTestId
// ---------------------------------------------------------------------

// test IDs are an escape hatch for elements that cannot be conveniently
// identified through accessible or user-facing characteristics.
//
// <div data-testid="results-panel">...</div>
//
// screen.getByTestId("results-panel");
//
// A test ID is tied to an implementation detail rather than something
// users normally perceive. It can therefore make tests less representative
// of actual user interaction.
//
// Test IDs are still appropriate when no suitable semantic query exists.

// ---------------------------------------------------------------------
// 10. Choosing between competing queries
// ---------------------------------------------------------------------

interface SearchFormProps {
  readonly value: string;
  readonly onChange: (value: string) => void;
}

export const SearchForm: FC<SearchFormProps> = ({ value, onChange }): ReactElement => (
  <form>
    <label htmlFor="search">Search</label>
    <input id="search" placeholder="Search products" value={value} onChange={(event) => onChange(event.target.value)} />
    <button type="submit">Search</button>
  </form>
);

// Several queries could locate the input:
//
// screen.getByRole("textbox", {name: "Search"});
// screen.getByLabelText("Search");
// screen.getByPlaceholderText("Search products");
// screen.getByTestId("search-input");
//
// The first two describe the control through its accessible interface.
// The placeholder is less preferable when a proper label is available.
// The test ID describes an implementation detail.

// ---------------------------------------------------------------------
// 11. Query priority follows user intent
// ---------------------------------------------------------------------

// Priority should not be applied mechanically.
//
// If the test asks whether a button exists:
//
// screen.getByRole("button", {name: "Save"});
//
// If the test asks whether a form control associated with "Email" exists:
//
// screen.getByLabelText("Email");
//
// If the test asks whether visible content appears:
//
// screen.getByText("Payment successful");
//
// The query should communicate what the test actually cares about.

// ---------------------------------------------------------------------
// 12. Query priority and accessibility
// ---------------------------------------------------------------------

// Accessible queries can expose accessibility problems naturally.
//
// A button with visible text:
//
// <button>Save</button>
//
// can be queried as:
//
// screen.getByRole("button", {name: "Save"});
//
// If an expected accessible name is missing, the query may fail.
// That failure can reveal an actual accessibility issue rather than
// merely requiring a different test selector.

// ---------------------------------------------------------------------
// 13. Query priority is not a ranking of correctness
// ---------------------------------------------------------------------

// A lower-priority query is not inherently incorrect.
//
// For example, getByTestId can be the appropriate choice when an element
// has no meaningful accessible or user-facing identifier.
//
// The priority exists to encourage tests that interact with the UI
// through characteristics users can actually perceive and use.

// ---------------------------------------------------------------------
// 14. A practical decision process
// ---------------------------------------------------------------------

// Ask these questions when selecting a query:
//
// 1. Is the element identified by an accessible role and name?
//    -> Prefer getByRole.
//
// 2. Is it a form control identified by its label?
//    -> Prefer getByLabelText.
//
// 3. Is a meaningful placeholder the intended identifier?
//    -> Consider getByPlaceholderText.
//
// 4. Is visible non-interactive text the intended identifier?
//    -> Consider getByText.
//
// 5. Is the current form-control value what the test cares about?
//    -> Consider getByDisplayValue.
//
// 6. Is alternative text the intended identifier?
//    -> Consider getByAltText.
//
// 7. Is a title attribute the intended identifier?
//    -> Consider getByTitle.
//
// 8. Is there no suitable user-facing query?
//    -> Consider getByTestId.

// ---------------------------------------------------------------------
// 15. Avoid implementation-first queries
// ---------------------------------------------------------------------

// Prefer:
//
// screen.getByRole("button", {name: "Submit"});
//
// over:
//
// screen.getByTestId("submit-button");
//
// The role-based query remains meaningful even if the implementation
// changes from one button element structure to another.
//
// A test ID may need to be changed whenever implementation details change.

// ---------------------------------------------------------------------
// 16. Query priority and maintainability
// ---------------------------------------------------------------------

// User-facing queries tend to make tests more resilient to implementation
// changes because they focus on behavior and semantics.
//
// Prefer a query that describes:
//
// - what the user sees;
// - what the user can access;
// - what the user can interact with;
// - or what the user would use to identify the element.
//
// Avoid selecting elements merely because a developer assigned a particular
// CSS class, DOM structure, or test-specific identifier.

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Query priority favors user-facing and accessible queries over implementation details.
// - getByRole is generally the preferred starting point for most elements.
// - getByLabelText is especially appropriate for labeled form controls.
// - getByPlaceholderText should be used when the placeholder is the meaningful identifier.
// - getByText is useful for visible text that is not better represented semantically.
// - getByDisplayValue targets the current displayed value of a form control.
// - getByAltText targets elements identified by alternative text, especially images.
// - getByTitle targets title attributes and is lower in the recommended priority.
// - getByTestId is an escape hatch when no suitable user-facing query exists.
// - The priority is a guideline; the query should ultimately match the test's intent.
// - Accessible queries can make accessibility problems visible through failing tests.
