/**
 * Queries by Text
 * ===============
 *
 * Testing Library's text queries locate elements through the text content visible in the rendered UI.
 * They are useful when the text itself is meaningful to the user, such as headings, paragraphs,
 * messages, button labels, and other visible content that does not have a more specific semantic query.
 */

import { type FC, type ReactElement } from "react";

// ---------------------------------------------------------------------
// 1. Basic text query
// ---------------------------------------------------------------------

export const WelcomeMessage: FC = (): ReactElement => {
  return <p>Welcome, John Doe!</p>;
};

// A test can locate the paragraph through its visible text:
//
// screen.getByText("Welcome, John Doe!");

// ---------------------------------------------------------------------
// 2. Text queries target rendered content
// ---------------------------------------------------------------------

export const AccountMessage: FC = (): ReactElement => {
  return (
    <section>
      <h2>Account</h2>
      <p>Your account is ready.</p>
    </section>
  );
};

// The visible text can be used directly:
//
// screen.getByText("Account");
// screen.getByText("Your account is ready.");

// ---------------------------------------------------------------------
// 3. getByText
// ---------------------------------------------------------------------

export const StatusMessage: FC = (): ReactElement => {
  return <p>Profile saved successfully.</p>;
};

// `getByText` expects one matching element:
//
// screen.getByText("Profile saved successfully.");
//
// It throws when no matching element exists.
// It also throws when more than one element matches.

// ---------------------------------------------------------------------
// 4. Exact string matching
// ---------------------------------------------------------------------

export const ExactText: FC = (): ReactElement => {
  return <p>Account created</p>;
};

// A string query matches the text:
//
// screen.getByText("Account created");

// Exact string matching is enabled by default.

// ---------------------------------------------------------------------
// 5. Case sensitivity
// ---------------------------------------------------------------------

export const CaseSensitiveText: FC = (): ReactElement => {
  return <p>Account created</p>;
};

// This matches:
//
// screen.getByText("Account created");
//
// This does not match the same way because the capitalization differs:
//
// screen.getByText("account created");

// ---------------------------------------------------------------------
// 6. Regular-expression matching
// ---------------------------------------------------------------------

export const FlexibleText: FC = (): ReactElement => {
  return <p>Account created successfully.</p>;
};

// A regular expression allows flexible matching:
//
// screen.getByText(/account created/i);
//
// The `i` flag makes the expression case-insensitive.

// ---------------------------------------------------------------------
// 7. Partial string matching
// ---------------------------------------------------------------------

export const PartialText: FC = (): ReactElement => {
  return <p>Your account was created successfully.</p>;
};

// String matching can be made non-exact:
//
// screen.getByText(
//     "account",
//     {exact: false},
// );
//
// This can match text containing the requested substring.

// ---------------------------------------------------------------------
// 8. The exact option
// ---------------------------------------------------------------------

export const SimilarText: FC = (): ReactElement => {
  return (
    <>
      <p>Account</p>
      <p>Account settings</p>
    </>
  );
};

// Exact matching identifies only the first text:
//
// screen.getByText(
//     "Account",
//     {exact: true},
// );
//
// Non-exact matching can match text containing "Account":
//
// screen.getByText(
//     "Account",
//     {exact: false},
// );
//
// If multiple elements match, `getByText` becomes ambiguous.

// ---------------------------------------------------------------------
// 9. queryByText
// ---------------------------------------------------------------------

export const OptionalMessage: FC<{
  readonly visible: boolean;
}> = ({ visible }): ReactElement | null => {
  if (!visible) {
    return null;
  }

  return <p>Saved successfully.</p>;
};

// `queryByText` is useful when the element may not exist:
//
// render(<OptionalMessage visible={false} />);
//
// screen.queryByText("Saved successfully.");
//
// It returns `null` when there is no matching element.

// ---------------------------------------------------------------------
// 10. findByText
// ---------------------------------------------------------------------

export interface AsyncTextExample {
  readonly query: string;
  readonly purpose: string;
}

export const asyncTextExample: AsyncTextExample = {
  query: 'screen.findByText("Data loaded")',
  purpose: "Wait for visible text to appear asynchronously",
};

// Example:
//
// const message = await screen.findByText("Data loaded");
//
// `findByText` is appropriate when the matching text appears later.

// ---------------------------------------------------------------------
// 11. getAllByText
// ---------------------------------------------------------------------

export const RepeatedText: FC = (): ReactElement => {
  return (
    <ul>
      <li>Pending</li>
      <li>Pending</li>
      <li>Completed</li>
    </ul>
  );
};

// When multiple matching elements are expected:
//
// const pendingItems = screen.getAllByText("Pending");
//
// `getAllByText` returns every matching element.

// ---------------------------------------------------------------------
// 12. queryAllByText
// ---------------------------------------------------------------------

export interface QueryAllTextExample {
  readonly query: string;
  readonly result: string;
}

export const queryAllTextExample: QueryAllTextExample = {
  query: 'screen.queryAllByText("Pending")',
  result: "An array of matching elements, or an empty array",
};

// `queryAllByText` does not throw when there are no matches.

// ---------------------------------------------------------------------
// 13. findAllByText
// ---------------------------------------------------------------------

export interface FindAllTextExample {
  readonly query: string;
  readonly purpose: string;
}

export const findAllTextExample: FindAllTextExample = {
  query: 'screen.findAllByText("Pending")',
  purpose: "Wait for multiple matching elements to appear",
};

// `findAllByText` is the asynchronous counterpart to `getAllByText`.

// ---------------------------------------------------------------------
// 14. Text query family
// ---------------------------------------------------------------------

export interface TextQueryFamily {
  readonly query: string;
  readonly expectedResult: string;
}

export const textQueryFamilies: readonly TextQueryFamily[] = [
  {
    query: "getByText",
    expectedResult: "Exactly one matching element",
  },
  {
    query: "queryByText",
    expectedResult: "Zero or one matching element",
  },
  {
    query: "findByText",
    expectedResult: "One matching element asynchronously",
  },
  {
    query: "getAllByText",
    expectedResult: "One or more matching elements",
  },
  {
    query: "queryAllByText",
    expectedResult: "Zero or more matching elements",
  },
  {
    query: "findAllByText",
    expectedResult: "Multiple matching elements asynchronously",
  },
];

// The query family communicates both expected cardinality and timing.

// ---------------------------------------------------------------------
// 15. Headings
// ---------------------------------------------------------------------

export const AccountHeading: FC = (): ReactElement => {
  return <h1>Account settings</h1>;
};

// Text queries can locate headings:
//
// screen.getByText("Account settings");
//
// However, when the heading's semantic role is the important part,
// a role query is often more expressive:
//
// screen.getByRole(
//     "heading",
//     {name: "Account settings"},
// );

// ---------------------------------------------------------------------
// 16. Paragraphs
// ---------------------------------------------------------------------

export const Description: FC = (): ReactElement => {
  return <p>Update your account information below.</p>;
};

// Example:
//
// screen.getByText("Update your account information below.");

// ---------------------------------------------------------------------
// 17. Buttons
// ---------------------------------------------------------------------

export const SaveButton: FC = (): ReactElement => {
  return <button type="button">Save changes</button>;
};

// Text can locate the button:
//
// screen.getByText("Save changes");
//
// A role query is usually more specific for an interactive control:
//
// screen.getByRole(
//     "button",
//     {name: "Save changes"},
// );

// ---------------------------------------------------------------------
// 18. Links
// ---------------------------------------------------------------------

export const AccountLink: FC = (): ReactElement => {
  return <a href="/account">Account settings</a>;
};

// Text can locate the link:
//
// screen.getByText("Account settings");
//
// A role query can communicate the semantic intent more directly:
//
// screen.getByRole(
//     "link",
//     {name: "Account settings"},
// );

// ---------------------------------------------------------------------
// 19. Visible status messages
// ---------------------------------------------------------------------

export const SuccessMessage: FC = (): ReactElement => {
  return <p role="status">Changes saved.</p>;
};

// Text can locate the status:
//
// screen.getByText("Changes saved.");
//
// A role query can specifically express that the test expects a status:
//
// screen.getByRole(
//     "status",
//     {name: "Changes saved."},
// );

// ---------------------------------------------------------------------
// 20. Error messages
// ---------------------------------------------------------------------

export const ErrorMessage: FC = (): ReactElement => {
  return <p role="alert">Unable to save changes.</p>;
};

// Text can locate the message:
//
// screen.getByText("Unable to save changes.");
//
// If the semantic role matters, prefer:
//
// screen.getByRole(
//     "alert",
//     {name: "Unable to save changes."},
// );

// ---------------------------------------------------------------------
// 21. Text with nested elements
// ---------------------------------------------------------------------

export const NestedText: FC = (): ReactElement => {
  return (
    <p>
      Welcome, <strong>John Doe</strong>.
    </p>
  );
};

// The visible text is split across multiple DOM nodes.
//
// screen.getByText("John Doe");
//
// can locate the strong element because it contains that text.
//
// A query for the entire sentence may not match because the text
// is distributed across multiple elements.

// ---------------------------------------------------------------------
// 22. Text split across elements
// ---------------------------------------------------------------------

export const SplitMessage: FC = (): ReactElement => {
  return (
    <p>
      Account <strong>created</strong>
    </p>
  );
};

// The text is represented by multiple nodes:
//
// "Account " + "created"
//
// Therefore:
//
// screen.getByText("Account created");
//
// should not be assumed to match the parent element simply because
// the browser visually displays "Account created".

// ---------------------------------------------------------------------
// 23. Querying a nested element
// ---------------------------------------------------------------------

export const HighlightedText: FC = (): ReactElement => {
  return (
    <p>
      Your order is <strong>ready</strong>.
    </p>
  );
};

// The nested element can be targeted directly:
//
// screen.getByText("ready");
//
// This finds the element containing the text "ready".

// ---------------------------------------------------------------------
// 24. Function text matcher
// ---------------------------------------------------------------------

export const DynamicText: FC = (): ReactElement => {
  return <p>Order #12345 is ready.</p>;
};

// A function can provide custom matching logic:
//
// screen.getByText(
//     (content) => content.includes("Order #"),
// );
//
// Function matchers are useful when the exact text is dynamic.

// ---------------------------------------------------------------------
// 25. Function matcher with element filtering
// ---------------------------------------------------------------------

export const MultipleMessages: FC = (): ReactElement => {
  return (
    <section>
      <p>Order #12345 is ready.</p>
      <p>Order #67890 is ready.</p>
    </section>
  );
};

// A function matcher can inspect the text and the element:
//
// screen.getByText(
//     (content, element) =>
//         element?.tagName === "P" &&
//         content.includes("Order #12345"),
// );

// This allows matching logic to include element characteristics.

// ---------------------------------------------------------------------
// 26. Regular expressions for dynamic values
// ---------------------------------------------------------------------

export const DynamicUserMessage: FC = (): ReactElement => {
  return <p>Welcome, John Doe!</p>;
};

// Instead of depending on the exact name:
//
// screen.getByText(/welcome,/i);
//
// Regular expressions can focus the test on the stable part of the message.

// ---------------------------------------------------------------------
// 27. Whitespace in text
// ---------------------------------------------------------------------

export const WhitespaceText: FC = (): ReactElement => {
  return <p>Account created</p>;
};

// Testing Library normalizes text when matching in its normal text-query
// behavior, so formatting whitespace in JSX does not necessarily require
// reproducing the exact source formatting.

// ---------------------------------------------------------------------
// 28. Text content versus attributes
// ---------------------------------------------------------------------

export const TextAndAttribute: FC = (): ReactElement => {
  return (
    <button title="Save the account" type="button">
      Save
    </button>
  );
};

// `getByText` searches rendered text:
//
// screen.getByText("Save");
//
// It does not search the `title` attribute:
//
// screen.getByText("Save the account");
//
// would not mean "find an element whose title is ...".

// ---------------------------------------------------------------------
// 29. Text content versus placeholder
// ---------------------------------------------------------------------

export const PlaceholderOnly: FC = (): ReactElement => {
  return <input placeholder="Search products" type="search" />;
};

// The placeholder is not the element's text content:
//
// screen.getByText("Search products");
//
// is not the appropriate query.
//
// Use:
//
// screen.getByPlaceholderText("Search products");
//
// when the placeholder itself is the intended target.

// ---------------------------------------------------------------------
// 30. Text content versus accessible name
// ---------------------------------------------------------------------

export const AccessibleButton: FC = (): ReactElement => {
  return (
    <button aria-label="Close dialog" type="button">
      <span aria-hidden="true">×</span>
    </button>
  );
};

// The button's accessible name is "Close dialog", but its visible text
// is the decorative "×".
//
// Use a role query for the accessible name:
//
// screen.getByRole(
//     "button",
//     {name: "Close dialog"},
// );
//
// `getByText("Close dialog")` would not find this button.

// ---------------------------------------------------------------------
// 31. Text queries and semantic queries
// ---------------------------------------------------------------------

export interface QueryChoice {
  readonly query: string;
  readonly intent: string;
}

export const queryChoices: readonly QueryChoice[] = [
  {
    query: 'screen.getByText("Account settings")',
    intent: "Find visible text",
  },
  {
    query: 'screen.getByRole("heading", {name: "Account settings"})',
    intent: "Find a heading by semantic role and accessible name",
  },
  {
    query: 'screen.getByRole("button", {name: "Save changes"})',
    intent: "Find a button by semantic role and accessible name",
  },
];

// Prefer the query that best communicates what the test actually cares about.

// ---------------------------------------------------------------------
// 32. Text query versus test ID
// ---------------------------------------------------------------------

export const TestIdExample: FC = (): ReactElement => {
  return <p data-testid="status-message">Changes saved.</p>;
};

// Both queries can locate the element:
//
// screen.getByText("Changes saved.");
//
// screen.getByTestId("status-message");
//
// When the visible text is the meaningful contract, `getByText` avoids
// introducing a testing-specific attribute.

// ---------------------------------------------------------------------
// 33. Text query versus CSS selector
// ---------------------------------------------------------------------

export const CssExample: FC = (): ReactElement => {
  return <p className="success-message">Changes saved.</p>;
};

// A text query expresses user-visible behavior:
//
// screen.getByText("Changes saved.");
//
// A CSS selector depends on implementation details:
//
// container.querySelector(".success-message");

// ---------------------------------------------------------------------
// 34. Text inside list items
// ---------------------------------------------------------------------

export const ProductList: FC = (): ReactElement => {
  return (
    <ul>
      <li>Keyboard</li>
      <li>Monitor</li>
      <li>Mouse</li>
    </ul>
  );
};

// Individual visible text can be queried:
//
// screen.getByText("Keyboard");
// screen.getByText("Monitor");
// screen.getByText("Mouse");

// ---------------------------------------------------------------------
// 35. Repeated text
// ---------------------------------------------------------------------

export const RepeatedStatus: FC = (): ReactElement => {
  return (
    <section>
      <p>Pending</p>
      <p>Pending</p>
    </section>
  );
};

// A single-result query is ambiguous:
//
// screen.getByText("Pending");
//
// Use an all-results query when multiple matches are expected:
//
// screen.getAllByText("Pending");

// ---------------------------------------------------------------------
// 36. queryByText for optional content
// ---------------------------------------------------------------------

export const OptionalNotice: FC<{
  readonly showNotice: boolean;
}> = ({ showNotice }): ReactElement | null => {
  return showNotice ? <p>There are no new notifications.</p> : null;
};

// Example:
//
// render(<OptionalNotice showNotice={false} />);
//
// expect(screen.queryByText("There are no new notifications.")).toBeNull();
//
// `queryByText` allows absence to be observed without throwing from the query.

// ---------------------------------------------------------------------
// 37. findByText for asynchronous content
// ---------------------------------------------------------------------

export const LoadingState: FC = (): ReactElement => {
  return <p>Loading...</p>;
};

// A later render might replace "Loading..." with:
//
// <p>Data loaded.</p>
//
// An asynchronous test can wait for the new text:
//
// const message = await screen.findByText("Data loaded");

// ---------------------------------------------------------------------
// 38. Loading and loaded states
// ---------------------------------------------------------------------

export const DataState: FC<{
  readonly loaded: boolean;
}> = ({ loaded }): ReactElement => {
  return loaded ? <p>Data loaded.</p> : <p>Loading...</p>;
};

// Synchronous rendering:
//
// render(<DataState loaded={false} />);
// screen.getByText("Loading...");
//
// render(<DataState loaded />);
// screen.getByText("Data loaded.");

// ---------------------------------------------------------------------
// 39. Error state
// ---------------------------------------------------------------------

export const RequestState: FC<{
  readonly status: "loading" | "success" | "error";
}> = ({ status }): ReactElement => {
  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (status === "error") {
    return <p>Unable to load data.</p>;
  }

  return <p>Data loaded.</p>;
};

// Text queries can verify each visible state:
//
// screen.getByText("Loading...");
// screen.getByText("Unable to load data.");
// screen.getByText("Data loaded.");

// ---------------------------------------------------------------------
// 40. Text inside conditional UI
// ---------------------------------------------------------------------

export const Greeting: FC<{
  readonly authenticated: boolean;
}> = ({ authenticated }): ReactElement => {
  return authenticated ? <p>Welcome back.</p> : <p>Please sign in.</p>;
};

// The test can assert the currently rendered user-facing message:
//
// screen.getByText("Welcome back.");
//
// or:
//
// screen.getByText("Please sign in.");

// ---------------------------------------------------------------------
// 41. Text and internationalized content
// ---------------------------------------------------------------------

export const LocalizedMessage: FC = (): ReactElement => {
  return <p>Welcome back.</p>;
};

// Text queries can use the actual rendered language:
//
// screen.getByText("Welcome back.");
//
// If the application changes language, tests should generally query the
// text that users in that test scenario are expected to see.

// ---------------------------------------------------------------------
// 42. Text containing punctuation
// ---------------------------------------------------------------------

export const PunctuationMessage: FC = (): ReactElement => {
  return <p>Saved successfully!</p>;
};

// Punctuation is part of the rendered text:
//
// screen.getByText("Saved successfully!");
//
// A regular expression can omit punctuation when it is not important:
//
// screen.getByText(/saved successfully/i);

// ---------------------------------------------------------------------
// 43. Text containing numbers
// ---------------------------------------------------------------------

export const ResultCount: FC = (): ReactElement => {
  return <p>24 results found.</p>;
};

// Exact matching:
//
// screen.getByText("24 results found.");
//
// Flexible matching:
//
// screen.getByText(/results found/i);

// ---------------------------------------------------------------------
// 44. Text containing dynamic identifiers
// ---------------------------------------------------------------------

export const OrderMessage: FC = (): ReactElement => {
  return <p>Order #12345 has shipped.</p>;
};

// If the order number is dynamic, avoid hard-coding it when it is not
// relevant to the behavior:
//
// screen.getByText(/order #\d+ has shipped/i);

// ---------------------------------------------------------------------
// 45. Text containing user data
// ---------------------------------------------------------------------

export const UserGreeting: FC = (): ReactElement => {
  return <p>Hello, John Doe.</p>;
};

// When the exact user name is not the subject of the test:
//
// screen.getByText(/hello,/i);
//
// A flexible matcher can focus the test on the stable part of the message.

// ---------------------------------------------------------------------
// 46. Text in a custom component
// ---------------------------------------------------------------------

export interface MessageProps {
  readonly children: React.ReactNode;
}

export const Message = ({ children }: MessageProps): ReactElement => {
  return <p>{children}</p>;
};

// The rendered DOM determines what a text query can find:
//
// render(
//     <Message>
//         Account created.
//     </Message>,
// );
//
// screen.getByText("Account created.");

// ---------------------------------------------------------------------
// 47. Text across component boundaries
// ---------------------------------------------------------------------

export const AccountPanel: FC = (): ReactElement => {
  return (
    <section>
      <Message>Account created.</Message>
    </section>
  );
};

// Testing Library queries the rendered DOM rather than React component
// boundaries:
//
// screen.getByText("Account created.");

// ---------------------------------------------------------------------
// 48. Text and fragments
// ---------------------------------------------------------------------

export const FragmentMessage: FC = (): ReactElement => {
  return (
    <>
      <p>First message.</p>
      <p>Second message.</p>
    </>
  );
};

// Each rendered element can be located independently:
//
// screen.getByText("First message.");
// screen.getByText("Second message.");

// ---------------------------------------------------------------------
// 49. Text and conditional fragments
// ---------------------------------------------------------------------

export const AccountNotice: FC<{
  readonly premium: boolean;
}> = ({ premium }): ReactElement => {
  return (
    <>
      <p>Account</p>
      {premium && <p>Premium features enabled.</p>}
    </>
  );
};

// When the condition is true:
//
// screen.getByText("Premium features enabled.");
//
// When false, the text is absent and `queryByText` can verify that absence.

// ---------------------------------------------------------------------
// 50. Text query with a custom matcher
// ---------------------------------------------------------------------

export const CustomMatcherMessage: FC = (): ReactElement => {
  return <p>Account balance: $120.</p>;
};

// A matcher can focus on stable content:
//
// screen.getByText(
//     (content) => content.startsWith("Account balance:"),
// );

// Custom functions should remain readable and specific.

// ---------------------------------------------------------------------
// 51. Text query and element type
// ---------------------------------------------------------------------

export const DuplicateContent: FC = (): ReactElement => {
  return (
    <>
      <h2>Settings</h2>
      <p>Settings</p>
    </>
  );
};

// Text alone does not distinguish the elements:
//
// screen.getAllByText("Settings");
//
// If the heading is what matters, a role query is more precise:
//
// screen.getByRole(
//     "heading",
//     {name: "Settings"},
// );

// ---------------------------------------------------------------------
// 52. Text query and selector option
// ---------------------------------------------------------------------

export const SelectorExample: FC = (): ReactElement => {
  return (
    <section>
      <h2>Settings</h2>
      <p>Settings</p>
    </section>
  );
};

// When text appears in multiple element types, a selector can narrow
// a text query:
//
// screen.getByText(
//     "Settings",
//     {selector: "h2"},
// );

// This should be used when the element type is relevant to the test.

// ---------------------------------------------------------------------
// 53. Selector versus semantic role
// ---------------------------------------------------------------------

export interface TextQueryStrategy {
  readonly approach: string;
  readonly reason: string;
}

export const textQueryStrategies: readonly TextQueryStrategy[] = [
  {
    approach: 'getByText("Settings")',
    reason: "The visible text itself is the relevant contract",
  },
  {
    approach: 'getByRole("heading", {name: "Settings"})',
    reason: "The heading semantics are relevant",
  },
  {
    approach: 'getByText("Settings", {selector: "h2"})',
    reason: "The test specifically needs an h2 element",
  },
];

// Query choice should follow test intent rather than simply choosing
// whichever query happens to work.

// ---------------------------------------------------------------------
// 54. Text queries and accessibility
// ---------------------------------------------------------------------

export const AccessibleContent: FC = (): ReactElement => {
  return (
    <main>
      <h1>Account settings</h1>
      <p>Manage your account information.</p>
    </main>
  );
};

// Text queries can verify visible content:
//
// screen.getByText("Account settings");
// screen.getByText("Manage your account information.");
//
// Semantic role queries can additionally verify accessible structure.

// ---------------------------------------------------------------------
// 55. Text queries and hidden content
// ---------------------------------------------------------------------

export const HiddenText: FC = (): ReactElement => {
  return (
    <div>
      <p>Visible message.</p>
      <p hidden>Hidden message.</p>
    </div>
  );
};

// By default, text queries are intended for content that is part of the
// rendered user-facing tree rather than arbitrary hidden implementation details.
//
// screen.getByText("Visible message.");

// Hidden content should generally be tested through the behavior that makes
// it relevant rather than treating hidden implementation text as visible UI.

// ---------------------------------------------------------------------
// 56. Text queries and CSS visibility
// ---------------------------------------------------------------------

export const VisuallyHiddenContent: FC = (): ReactElement => {
  return <p className="visually-hidden">Additional information.</p>;
};

// CSS visibility and accessibility are distinct concepts.
// Query behavior depends on the Testing Library matcher and configuration,
// so tests should target the user-visible or accessible contract they intend to verify.

// ---------------------------------------------------------------------
// 57. Text and whitespace normalization
// ---------------------------------------------------------------------

export const FormattedText: FC = (): ReactElement => {
  return <p>Welcome to the application.</p>;
};

// Testing Library normalizes whitespace during normal text matching.
// Tests should therefore generally use meaningful text rather than
// reproducing JSX formatting whitespace.

// ---------------------------------------------------------------------
// 58. Text and text-transform CSS
// ---------------------------------------------------------------------

export const TransformedText: FC = (): ReactElement => {
  return <p className="uppercase">account settings</p>;
};

// CSS `text-transform` changes visual presentation but does not change
// the underlying DOM text:
//
// screen.getByText("account settings");
//
// The query operates on DOM text rather than the pixels displayed by CSS.

// ---------------------------------------------------------------------
// 59. Text and generated CSS content
// ---------------------------------------------------------------------

export const CssGeneratedContent: FC = (): ReactElement => {
  return <span className="required-indicator">Email</span>;
};

// CSS-generated content is not ordinary DOM text content.
// Text queries should target actual rendered DOM content when possible.

// ---------------------------------------------------------------------
// 60. Text and icon-only controls
// ---------------------------------------------------------------------

export const IconButton: FC = (): ReactElement => {
  return (
    <button aria-label="Close" type="button">
      <span aria-hidden="true">×</span>
    </button>
  );
};

// The visible symbol is not the meaningful accessible name:
//
// screen.getByText("×");
//
// can locate the decorative text.
//
// To test the actual control semantics:
//
// screen.getByRole(
//     "button",
//     {name: "Close"},
// );

// ---------------------------------------------------------------------
// 61. Text and button semantics
// ---------------------------------------------------------------------

export const ActionButtons: FC = (): ReactElement => {
  return (
    <>
      <button type="button">Save</button>
      <button type="button">Cancel</button>
    </>
  );
};

// Text queries can locate each label:
//
// screen.getByText("Save");
// screen.getByText("Cancel");
//
// Role queries communicate that these are interactive buttons:
//
// screen.getByRole(
//     "button",
//     {name: "Save"},
// );

// ---------------------------------------------------------------------
// 62. Text and links
// ---------------------------------------------------------------------

export const Navigation: FC = (): ReactElement => {
  return (
    <nav>
      <a href="/account">Account</a>
      <a href="/settings">Settings</a>
    </nav>
  );
};

// Visible text can locate either link:
//
// screen.getByText("Account");
// screen.getByText("Settings");
//
// Role queries can express the navigation semantics:
//
// screen.getByRole(
//     "link",
//     {name: "Account"},
// );

// ---------------------------------------------------------------------
// 63. Text and table content
// ---------------------------------------------------------------------

export const AccountTable: FC = (): ReactElement => {
  return (
    <table>
      <tbody>
        <tr>
          <td>John Doe</td>
          <td>john@example.com</td>
        </tr>
      </tbody>
    </table>
  );
};

// Text queries can locate cell content:
//
// screen.getByText("John Doe");
// screen.getByText("john@example.com");

// ---------------------------------------------------------------------
// 64. Text and list content
// ---------------------------------------------------------------------

export const SettingsList: FC = (): ReactElement => {
  return (
    <ul>
      <li>Profile</li>
      <li>Security</li>
      <li>Notifications</li>
    </ul>
  );
};

// Each item can be located by its visible text:
//
// screen.getByText("Profile");
// screen.getByText("Security");
// screen.getByText("Notifications");

// ---------------------------------------------------------------------
// 65. Text and status changes
// ---------------------------------------------------------------------

export const SaveStatus: FC<{
  readonly saved: boolean;
}> = ({ saved }): ReactElement => {
  return <p>{saved ? "Saved." : "Unsaved changes."}</p>;
};

// The text query reflects the current rendered state:
//
// screen.getByText("Unsaved changes.");
//
// or:
//
// screen.getByText("Saved.");

// ---------------------------------------------------------------------
// 66. Text and loading states
// ---------------------------------------------------------------------

export const LoadingIndicator: FC<{
  readonly loading: boolean;
}> = ({ loading }): ReactElement => {
  return loading ? <p>Loading profile...</p> : <p>Profile loaded.</p>;
};

// Text queries can verify the visible state:
//
// screen.getByText("Loading profile...");
// screen.getByText("Profile loaded.");

// ---------------------------------------------------------------------
// 67. Text and validation
// ---------------------------------------------------------------------

export const ValidationMessage: FC<{
  readonly invalid: boolean;
}> = ({ invalid }): ReactElement | null => {
  return invalid ? <p>Enter a valid email address.</p> : null;
};

// Absence can be tested without throwing:
//
// screen.queryByText("Enter a valid email address.");

// ---------------------------------------------------------------------
// 68. Text and confirmation messages
// ---------------------------------------------------------------------

export const Confirmation: FC = (): ReactElement => {
  return <p>Your changes have been saved.</p>;
};

// A user-facing confirmation is a natural target for a text query:
//
// screen.getByText("Your changes have been saved.");

// ---------------------------------------------------------------------
// 69. Text and dynamic asynchronous updates
// ---------------------------------------------------------------------

export interface AsyncUpdate {
  readonly query: string;
  readonly reason: string;
}

export const asyncUpdate: AsyncUpdate = {
  query: 'screen.findByText("Profile updated.")',
  reason: "The confirmation appears after an asynchronous operation",
};

// `findByText` combines text matching with asynchronous waiting.

// ---------------------------------------------------------------------
// 70. Text query errors
// ---------------------------------------------------------------------

export interface TextQueryErrors {
  readonly condition: string;
  readonly getByTextBehavior: string;
}

export const textQueryErrors: readonly TextQueryErrors[] = [
  {
    condition: "No matching element exists",
    getByTextBehavior: "Throws an error",
  },
  {
    condition: "Exactly one matching element exists",
    getByTextBehavior: "Returns the element",
  },
  {
    condition: "Multiple matching elements exist",
    getByTextBehavior: "Throws an ambiguity error",
  },
];

// This behavior is why `queryByText` and the `AllByText` variants
// are important when cardinality differs.

// ---------------------------------------------------------------------
// 71. Choosing the correct query family
// ---------------------------------------------------------------------

export interface QueryFamilyChoice {
  readonly situation: string;
  readonly query: string;
}

export const queryFamilyChoices: readonly QueryFamilyChoice[] = [
  {
    situation: "One matching element must exist now",
    query: "getByText",
  },
  {
    situation: "The element may be absent",
    query: "queryByText",
  },
  {
    situation: "One matching element appears asynchronously",
    query: "findByText",
  },
  {
    situation: "Several matching elements must exist now",
    query: "getAllByText",
  },
  {
    situation: "Several matching elements may be absent",
    query: "queryAllByText",
  },
  {
    situation: "Several matching elements appear asynchronously",
    query: "findAllByText",
  },
];

// Choose the query variant according to expected cardinality and timing.

// ---------------------------------------------------------------------
// 72. Prefer semantic queries when appropriate
// ---------------------------------------------------------------------

export const SemanticExample: FC = (): ReactElement => {
  return <button type="button">Save</button>;
};

// `getByText` works:
//
// screen.getByText("Save");
//
// But the role communicates more:
//
// screen.getByRole(
//     "button",
//     {name: "Save"},
// );
//
// Prefer the more specific semantic query when it expresses the test intent.

// ---------------------------------------------------------------------
// 73. Use text when text is the contract
// ---------------------------------------------------------------------

export const TextContract: FC = (): ReactElement => {
  return <p>Your profile is complete.</p>;
};

// When the requirement is specifically that this message is displayed:
//
// screen.getByText("Your profile is complete.");
//
// `getByText` directly represents that requirement.

// ---------------------------------------------------------------------
// 74. Avoid implementation-specific text queries
// ---------------------------------------------------------------------

export const ImplementationMarkup: FC = (): ReactElement => {
  return (
    <div>
      <span className="internal-status">Ready</span>
    </div>
  );
};

// If "Ready" is meaningful user-facing content:
//
// screen.getByText("Ready");
//
// There is usually no need to know the `.internal-status` implementation detail.

// ---------------------------------------------------------------------
// 75. Complete text-query example
// ---------------------------------------------------------------------

export const AccountSummary: FC = (): ReactElement => {
  return (
    <section>
      <h1>Account</h1>
      <p>Welcome, John Doe.</p>
      <p>Your profile is complete.</p>

      <button type="button">Edit profile</button>
    </section>
  );
};

// Text-oriented assertions:
//
// screen.getByText("Account");
// screen.getByText("Welcome, John Doe.");
// screen.getByText("Your profile is complete.");
//
// A semantic query is preferable for the interactive control:
//
// screen.getByRole(
//     "button",
//     {name: "Edit profile"},
// );

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - `getByText` locates elements through text content rendered in the UI.
// - Text queries are useful for visible headings, messages, paragraphs, list items, and other user-facing content.
// - `getByText` throws when there is no match or when multiple elements match.
// - `queryByText` returns `null` when no matching element exists and is useful when absence is expected.
// - `findByText` waits asynchronously for one matching element to appear.
// - `getAllByText`, `queryAllByText`, and `findAllByText` handle multiple matching elements.
// - String matching is exact and case-sensitive by default.
// - Regular expressions can provide flexible matching, such as case-insensitive or dynamic text matching.
// - The `exact` option can control exact versus non-exact string matching.
// - Function matchers allow custom matching logic when exact text is not stable enough.
// - Text queries operate on rendered DOM text, not arbitrary attributes such as `title` or `placeholder`.
// - Text split across multiple DOM elements may require a more targeted matcher or query.
// - `getByText` can locate interactive elements, but role queries are often more expressive for buttons and links.
// - `getByRole` is preferable when the semantic role and accessible name are the actual test contract.
// - `getByPlaceholderText` is more appropriate when placeholder text itself is the intended target.
// - `getByTestId` is a testing-specific fallback rather than the first choice for meaningful visible text.
// - Use text queries when the visible text itself is the behavior or content being tested.
// - Choose the query variant according to expected cardinality and whether the content appears synchronously or asynchronously.
/**
 * Queries by Test ID
 * ==================
 *
 * Testing Library's test ID queries locate elements through a `data-testid` attribute.
 * They are useful as a fallback when an element cannot be reliably identified through
 * its role, label, text, or another user-facing query.
 */

import { type FC, type ReactElement } from "react";

// ---------------------------------------------------------------------
// 1. Basic data-testid
// ---------------------------------------------------------------------

export const AccountStatus: FC = (): ReactElement => {
  return <p data-testid="account-status">Account ready.</p>;
};

// A test can locate the element through its test ID:
//
// screen.getByTestId("account-status");

// ---------------------------------------------------------------------
// 2. getByTestId
// ---------------------------------------------------------------------

export const ProfileMessage: FC = (): ReactElement => {
  return <p data-testid="profile-message">Profile updated.</p>;
};

// `getByTestId` expects exactly one matching element:
//
// screen.getByTestId("profile-message");
//
// It throws when no matching element exists.
// It also throws when multiple matching elements exist.

// ---------------------------------------------------------------------
// 3. queryByTestId
// ---------------------------------------------------------------------

export const OptionalStatus: FC<{
  readonly visible: boolean;
}> = ({ visible }): ReactElement | null => {
  return visible ? <p data-testid="status-message">Saved successfully.</p> : null;
};

// `queryByTestId` is useful when the element may not exist:
//
// render(<OptionalStatus visible={false} />);
//
// screen.queryByTestId("status-message");
//
// It returns `null` when no matching element exists.

// ---------------------------------------------------------------------
// 4. findByTestId
// ---------------------------------------------------------------------

export const AsyncStatus: FC = (): ReactElement => {
  return <p data-testid="async-status">Data loaded.</p>;
};

// When an element appears asynchronously:
//
// const status = await screen.findByTestId("async-status");
//
// `findByTestId` waits for the element to appear.

// ---------------------------------------------------------------------
// 5. getAllByTestId
// ---------------------------------------------------------------------

export const RepeatedStatus: FC = (): ReactElement => {
  return (
    <section>
      <p data-testid="item-status">Pending</p>
      <p data-testid="item-status">Pending</p>
    </section>
  );
};

// When multiple elements intentionally share the same test ID:
//
// const statuses = screen.getAllByTestId("item-status");
//
// `getAllByTestId` returns every matching element.

// ---------------------------------------------------------------------
// 6. queryAllByTestId
// ---------------------------------------------------------------------

export interface QueryAllTestIdExample {
  readonly query: string;
  readonly result: string;
}

export const queryAllTestIdExample: QueryAllTestIdExample = {
  query: 'screen.queryAllByTestId("item-status")',
  result: "An array of matching elements, or an empty array",
};

// `queryAllByTestId` does not throw when no matching elements exist.

// ---------------------------------------------------------------------
// 7. findAllByTestId
// ---------------------------------------------------------------------

export interface FindAllTestIdExample {
  readonly query: string;
  readonly purpose: string;
}

export const findAllTestIdExample: FindAllTestIdExample = {
  query: 'screen.findAllByTestId("item-status")',
  purpose: "Wait for multiple matching elements to appear",
};

// `findAllByTestId` is the asynchronous counterpart to `getAllByTestId`.

// ---------------------------------------------------------------------
// 8. Test ID query family
// ---------------------------------------------------------------------

export interface TestIdQueryFamily {
  readonly query: string;
  readonly expectedResult: string;
}

export const testIdQueryFamilies: readonly TestIdQueryFamily[] = [
  {
    query: "getByTestId",
    expectedResult: "Exactly one matching element",
  },
  {
    query: "queryByTestId",
    expectedResult: "Zero or one matching element",
  },
  {
    query: "findByTestId",
    expectedResult: "One matching element asynchronously",
  },
  {
    query: "getAllByTestId",
    expectedResult: "One or more matching elements",
  },
  {
    query: "queryAllByTestId",
    expectedResult: "Zero or more matching elements",
  },
  {
    query: "findAllByTestId",
    expectedResult: "Multiple matching elements asynchronously",
  },
];

// ---------------------------------------------------------------------
// 9. Why data-testid exists
// ---------------------------------------------------------------------

export const ComplexWidget: FC = (): ReactElement => {
  return (
    <div data-testid="complex-widget">
      <span>Widget content</span>
    </div>
  );
};

// Some elements do not have a stable role, accessible name, or useful text.
// A test ID can provide an explicit testing hook:
//
// screen.getByTestId("complex-widget");

// ---------------------------------------------------------------------
// 10. Test IDs as a fallback
// ---------------------------------------------------------------------

export const UserProfile: FC = (): ReactElement => {
  return (
    <section data-testid="user-profile">
      <h2>Profile</h2>
      <p>John Doe</p>
    </section>
  );
};

// Prefer a user-facing query when one expresses the test intent:
//
// screen.getByRole(
//     "heading",
//     {name: "Profile"},
// );
//
// Use the test ID when the container itself is what needs to be located:
//
// screen.getByTestId("user-profile");

// ---------------------------------------------------------------------
// 11. Test ID versus text
// ---------------------------------------------------------------------

export const StatusText: FC = (): ReactElement => {
  return <p data-testid="status">Profile ready.</p>;
};

// Both queries can locate the element:
//
// screen.getByText("Profile ready.");
// screen.getByTestId("status");
//
// Prefer the text query when the visible message itself is the contract.

// ---------------------------------------------------------------------
// 12. Test ID versus role
// ---------------------------------------------------------------------

export const SaveAction: FC = (): ReactElement => {
  return (
    <button data-testid="save-button" type="button">
      Save
    </button>
  );
};

// A role query expresses the user-facing semantics:
//
// screen.getByRole(
//     "button",
//     {name: "Save"},
// );
//
// A test ID is less expressive:
//
// screen.getByTestId("save-button");

// ---------------------------------------------------------------------
// 13. Test ID versus label
// ---------------------------------------------------------------------

export const EmailField: FC = (): ReactElement => {
  return (
    <label>
      Email
      <input data-testid="email-input" name="email" type="email" />
    </label>
  );
};

// The label provides a user-facing query:
//
// screen.getByLabelText("Email");
//
// A test ID is also possible:
//
// screen.getByTestId("email-input");
//
// Prefer the label query when the label is the relevant contract.

// ---------------------------------------------------------------------
// 14. Test ID versus placeholder
// ---------------------------------------------------------------------

export const SearchField: FC = (): ReactElement => {
  return <input data-testid="search-input" placeholder="Search products" type="search" />;
};

// A placeholder query is more descriptive when the placeholder matters:
//
// screen.getByPlaceholderText("Search products");
//
// The test ID is a fallback:
//
// screen.getByTestId("search-input");

// ---------------------------------------------------------------------
// 15. Test ID versus test implementation details
// ---------------------------------------------------------------------

export const NotificationPanel: FC = (): ReactElement => {
  return (
    <aside data-testid="notification-panel">
      <p>No new notifications.</p>
    </aside>
  );
};

// A class selector would expose styling implementation:
//
// container.querySelector(".notification-panel");
//
// A test ID is explicitly intended as a testing hook:
//
// screen.getByTestId("notification-panel");

// ---------------------------------------------------------------------
// 16. Test IDs do not describe accessibility
// ---------------------------------------------------------------------

export const AccessibleControl: FC = (): ReactElement => {
  return (
    <button data-testid="close-button" type="button">
      Close
    </button>
  );
};

// `data-testid` has no semantic meaning for assistive technologies.
//
// This query:
//
// screen.getByTestId("close-button");
//
// does not verify that the element is actually exposed as a button.
//
// This query does:
//
// screen.getByRole(
//     "button",
//     {name: "Close"},
// );

// ---------------------------------------------------------------------
// 17. Test IDs and accessible names
// ---------------------------------------------------------------------

export const IconButton: FC = (): ReactElement => {
  return (
    <button aria-label="Close dialog" data-testid="close-dialog" type="button">
      <span aria-hidden="true">×</span>
    </button>
  );
};

// A test ID can locate the element:
//
// screen.getByTestId("close-dialog");
//
// But the role query verifies its accessible contract:
//
// screen.getByRole(
//     "button",
//     {name: "Close dialog"},
// );

// ---------------------------------------------------------------------
// 18. Test IDs on containers
// ---------------------------------------------------------------------

export const AccountSection: FC = (): ReactElement => {
  return (
    <section data-testid="account-section">
      <h2>Account</h2>
      <p>Account settings</p>
    </section>
  );
};

// A test ID is particularly useful when the container itself has no
// meaningful accessible role or user-facing name:
//
// screen.getByTestId("account-section");

// ---------------------------------------------------------------------
// 19. Scoping a container
// ---------------------------------------------------------------------

export const SettingsPanel: FC = (): ReactElement => {
  return (
    <section data-testid="settings-panel">
      <button type="button">Save</button>
      <button type="button">Cancel</button>
    </section>
  );
};

// A test ID can identify a container that is then used as a query scope:
//
// const panel = screen.getByTestId("settings-panel");
//
// Tests can use Testing Library's `within` utility to query inside it:
//
// within(panel).getByRole(
//     "button",
//     {name: "Save"},
// );
//
// The test ID identifies the container; the nested query still uses semantics.

// ---------------------------------------------------------------------
// 20. Test IDs for repeated components
// ---------------------------------------------------------------------

export interface Product {
  readonly id: string;
  readonly name: string;
}

export const ProductList: FC<{
  readonly products: readonly Product[];
}> = ({ products }): ReactElement => {
  return (
    <ul>
      {products.map((product) => (
        <li data-testid={`product-${product.id}`} key={product.id}>
          {product.name}
        </li>
      ))}
    </ul>
  );
};

// A test ID can incorporate a stable identifier:
//
// screen.getByTestId("product-123");
//
// This is useful when the product ID is part of the test scenario.

// ---------------------------------------------------------------------
// 21. Dynamic test IDs
// ---------------------------------------------------------------------

export const OrderRow: FC<{
  readonly orderId: string;
}> = ({ orderId }): ReactElement => {
  return <div data-testid={`order-${orderId}`}>Order #{orderId}</div>;
};

// Dynamic test IDs should be based on stable identifiers:
//
// render(<OrderRow orderId="12345" />);
//
// screen.getByTestId("order-12345");

// ---------------------------------------------------------------------
// 22. Avoid unstable test IDs
// ---------------------------------------------------------------------

export const UnstableIdExample: FC = (): ReactElement => {
  return <div data-testid={`element-${Math.random()}`}>Content</div>;
};

// An unstable value makes the test ID unpredictable.
// Tests should use stable identifiers instead.

// ---------------------------------------------------------------------
// 23. Test IDs and generated values
// ---------------------------------------------------------------------

export const StableOrder: FC = (): ReactElement => {
  const orderId = "12345";

  return <div data-testid={`order-${orderId}`}>Order #{orderId}</div>;
};

// The same stable identifier can be used by the test:
//
// screen.getByTestId("order-12345");

// ---------------------------------------------------------------------
// 24. Test IDs and component state
// ---------------------------------------------------------------------

export const SaveState: FC<{
  readonly saved: boolean;
}> = ({ saved }): ReactElement => {
  return <div data-testid="save-state">{saved ? "Saved" : "Unsaved"}</div>;
};

// The test ID remains stable while the content changes:
//
// const state = screen.getByTestId("save-state");
//
// The text can then be asserted separately:
//
// within(state).getByText("Saved");

// ---------------------------------------------------------------------
// 25. Test IDs and conditional rendering
// ---------------------------------------------------------------------

export const ConditionalPanel: FC<{
  readonly visible: boolean;
}> = ({ visible }): ReactElement | null => {
  if (!visible) {
    return null;
  }

  return <section data-testid="conditional-panel">Panel content</section>;
};

// The test ID can verify presence:
//
// render(<ConditionalPanel visible />);
// screen.getByTestId("conditional-panel");
//
// It can also verify absence:
//
// render(<ConditionalPanel visible={false} />);
// screen.queryByTestId("conditional-panel");

// ---------------------------------------------------------------------
// 26. Test IDs and asynchronous rendering
// ---------------------------------------------------------------------

export const AsyncPanel: FC = (): ReactElement => {
  return <section data-testid="async-panel">Loaded content</section>;
};

// When the panel appears after asynchronous work:
//
// const panel = await screen.findByTestId("async-panel");

// ---------------------------------------------------------------------
// 27. Test IDs and multiple elements
// ---------------------------------------------------------------------

export const StatusList: FC = (): ReactElement => {
  return (
    <section>
      <p data-testid="status">Ready</p>
      <p data-testid="status">Ready</p>
      <p data-testid="status">Ready</p>
    </section>
  );
};

// If multiple matching elements are expected:
//
// const statuses = screen.getAllByTestId("status");
//
// The test can then inspect the collection.

// ---------------------------------------------------------------------
// 28. Prefer unique test IDs when possible
// ---------------------------------------------------------------------

export const UniqueStatus: FC = (): ReactElement => {
  return <p data-testid="profile-status">Ready</p>;
};

// A unique test ID makes the intended target unambiguous:
//
// screen.getByTestId("profile-status");

// ---------------------------------------------------------------------
// 29. Test IDs and repeated text
// ---------------------------------------------------------------------

export const RepeatedTextWithIds: FC = (): ReactElement => {
  return (
    <section>
      <p data-testid="primary-status">Ready</p>
      <p data-testid="secondary-status">Ready</p>
    </section>
  );
};

// Text alone is ambiguous:
//
// screen.getAllByText("Ready");
//
// Stable test IDs can distinguish the elements:
//
// screen.getByTestId("primary-status");
// screen.getByTestId("secondary-status");

// ---------------------------------------------------------------------
// 30. Test ID naming
// ---------------------------------------------------------------------

export interface TestIdNamingExample {
  readonly testId: string;
  readonly meaning: string;
}

export const testIdNamingExamples: readonly TestIdNamingExample[] = [
  {
    testId: "account-panel",
    meaning: "Identifies the account panel",
  },
  {
    testId: "profile-status",
    meaning: "Identifies the profile status element",
  },
  {
    testId: "search-results",
    meaning: "Identifies the search results container",
  },
];

// Names should describe the stable purpose of the element rather than
// its styling or implementation details.

// ---------------------------------------------------------------------
// 31. Avoid styling-based test IDs
// ---------------------------------------------------------------------

export const StylingBasedId: FC = (): ReactElement => {
  return <div data-testid="blue-rounded-panel">Content</div>;
};

// A styling-based ID couples the test to presentation:
//
// "blue-rounded-panel"
//
// If the styling changes, the test ID becomes misleading.
//
// Prefer:
//
// data-testid="account-panel"

// ---------------------------------------------------------------------
// 32. Avoid DOM-structure-based test IDs
// ---------------------------------------------------------------------

export const StructureBasedId: FC = (): ReactElement => {
  return <div data-testid="second-div-inside-header">Account</div>;
};

// An ID based on DOM structure is fragile:
//
// "second-div-inside-header"
//
// Prefer a semantic or behavioral name:
//
// data-testid="account-header"

// ---------------------------------------------------------------------
// 33. Test IDs should describe stable concepts
// ---------------------------------------------------------------------

export const StableConcept: FC = (): ReactElement => {
  return <section data-testid="search-results">Search results</section>;
};

// "search-results" describes the component's stable purpose.
// It does not depend on a CSS class or a particular DOM structure.

// ---------------------------------------------------------------------
// 34. Test ID configuration
// ---------------------------------------------------------------------

export interface TestIdAttributeExample {
  readonly defaultAttribute: string;
  readonly purpose: string;
}

export const testIdAttributeExample: TestIdAttributeExample = {
  defaultAttribute: "data-testid",
  purpose: "Attribute used by Testing Library's test ID queries",
};

// Testing Library uses `data-testid` by default.
//
// The attribute can be configured globally when an application has
// a different testing convention.

// ---------------------------------------------------------------------
// 35. Custom test ID attributes
// ---------------------------------------------------------------------

export interface CustomTestIdExample {
  readonly configuration: string;
  readonly markup: string;
}

export const customTestIdExample: CustomTestIdExample = {
  configuration: "configure({testIdAttribute: 'data-test-id'})",
  markup: '<div data-test-id="account-panel">...</div>',
};

// If the configured attribute changes, the markup and query behavior
// must use the same convention.

// ---------------------------------------------------------------------
// 36. Test IDs and reusable components
// ---------------------------------------------------------------------

export interface PanelProps {
  readonly testId?: string;
  readonly children: React.ReactNode;
}

export const Panel = ({ testId, children }: PanelProps): ReactElement => {
  return <section data-testid={testId}>{children}</section>;
};

// A reusable component can expose an optional testing hook:
//
// render(
//     <Panel testId="account-panel">
//         Account
//     </Panel>,
// );
//
// screen.getByTestId("account-panel");

// ---------------------------------------------------------------------
// 37. Do not add test IDs automatically
// ---------------------------------------------------------------------

export const SimpleMessage: FC = (): ReactElement => {
  return <p>Account ready.</p>;
};

// Adding a test ID only because a component exists is unnecessary:
//
// <p data-testid="simple-message">Account ready.</p>
//
// A visible text query is already available:
//
// screen.getByText("Account ready.");

// ---------------------------------------------------------------------
// 38. Test IDs for non-semantic containers
// ---------------------------------------------------------------------

export const LayoutContainer: FC = (): ReactElement => {
  return (
    <div data-testid="dashboard-content">
      <p>Dashboard</p>
    </div>
  );
};

// Generic containers often have no useful role or accessible name.
// A test ID can provide a stable way to locate such a container.

// ---------------------------------------------------------------------
// 39. Test IDs for complex widgets
// ---------------------------------------------------------------------

export const DataVisualization: FC = (): ReactElement => {
  return (
    <div data-testid="sales-chart">
      <span>Sales</span>
    </div>
  );
};

// A complex visualization may not expose a convenient semantic query.
// A test ID can identify the visualization as a whole.
//
// screen.getByTestId("sales-chart");

// ---------------------------------------------------------------------
// 40. Test IDs for third-party components
// ---------------------------------------------------------------------

export const ThirdPartyContainer: FC = (): ReactElement => {
  return <div data-testid="date-picker">Select a date</div>;
};

// A third-party widget may not expose stable accessible semantics that
// are convenient for a particular integration test.
// A test ID can provide a stable application-owned boundary.

// ---------------------------------------------------------------------
// 41. Test IDs and portals
// ---------------------------------------------------------------------

export const DialogContent: FC = (): ReactElement => {
  return <div data-testid="dialog-content">Dialog content</div>;
};

// If the component is rendered through a portal, the test ID still
// identifies the element in the rendered DOM:
//
// screen.getByTestId("dialog-content");

// ---------------------------------------------------------------------
// 42. Test IDs and server-rendered markup
// ---------------------------------------------------------------------

export const ServerRenderedRegion: FC = (): ReactElement => {
  return <section data-testid="server-region">Server-rendered content</section>;
};

// A `data-testid` is an ordinary DOM attribute and can exist in
// server-rendered markup as well.

// ---------------------------------------------------------------------
// 43. Test IDs and hydration
// ---------------------------------------------------------------------

export const HydratedRegion: FC = (): ReactElement => {
  return <section data-testid="hydrated-region">Account content</section>;
};

// The test ID itself does not verify hydration.
// It only provides a DOM lookup mechanism.
//
// screen.getByTestId("hydrated-region");

// ---------------------------------------------------------------------
// 44. Test IDs and component internals
// ---------------------------------------------------------------------

export const InternalStructure: FC = (): ReactElement => {
  return (
    <article data-testid="article">
      <div data-testid="article-content">Article content</div>
    </article>
  );
};

// Avoid testing every internal node merely because it has a test ID.
// Add hooks where they represent meaningful testing boundaries.

// ---------------------------------------------------------------------
// 45. Test IDs and implementation coupling
// ---------------------------------------------------------------------

export const RefactorableMarkup: FC = (): ReactElement => {
  return (
    <section data-testid="account-panel">
      <div>
        <p>Account information.</p>
      </div>
    </section>
  );
};

// The internal div can be replaced without changing the test ID:
//
// screen.getByTestId("account-panel");
//
// This can make a test less sensitive to internal DOM restructuring.

// ---------------------------------------------------------------------
// 46. Test IDs do not replace behavior assertions
// ---------------------------------------------------------------------

export const SavePanel: FC = (): ReactElement => {
  return (
    <section data-testid="save-panel">
      <p>Changes saved.</p>
    </section>
  );
};

// Locating the panel alone does not verify its behavior:
//
// screen.getByTestId("save-panel");
//
// A behavior-oriented assertion would verify the meaningful content:
//
// within(screen.getByTestId("save-panel")).getByText("Changes saved.");

// ---------------------------------------------------------------------
// 47. Test IDs and interaction
// ---------------------------------------------------------------------

export const ActionPanel: FC = (): ReactElement => {
  return (
    <section data-testid="action-panel">
      <button type="button">Save</button>
    </section>
  );
};

// A test ID can locate a container, while a semantic query locates
// the interactive element inside it:
//
// const panel = screen.getByTestId("action-panel");
//
// within(panel).getByRole(
//     "button",
//     {name: "Save"},
// );

// ---------------------------------------------------------------------
// 48. Test IDs and query scope
// ---------------------------------------------------------------------

export const MultiplePanels: FC = (): ReactElement => {
  return (
    <>
      <section data-testid="profile-panel">
        <button type="button">Edit</button>
      </section>

      <section data-testid="security-panel">
        <button type="button">Edit</button>
      </section>
    </>
  );
};

// Text alone finds multiple buttons:
//
// screen.getAllByRole(
//     "button",
//     {name: "Edit"},
// );
//
// A test ID can identify the intended region:
//
// const profilePanel = screen.getByTestId("profile-panel");
//
// Then query within that region:
//
// within(profilePanel).getByRole(
//     "button",
//     {name: "Edit"},
// );

// ---------------------------------------------------------------------
// 49. Test IDs and state-specific elements
// ---------------------------------------------------------------------

export const FormState: FC<{
  readonly submitted: boolean;
}> = ({ submitted }): ReactElement => {
  return submitted ? <p data-testid="form-success">Form submitted.</p> : <button type="submit">Submit</button>;
};

// The test ID can target a state-specific message:
//
// screen.getByTestId("form-success");

// ---------------------------------------------------------------------
// 50. Test IDs and error boundaries
// ---------------------------------------------------------------------

export const ErrorFallback: FC = (): ReactElement => {
  return <section data-testid="error-fallback">Something went wrong.</section>;
};

// A test ID can identify a fallback boundary:
//
// screen.getByTestId("error-fallback");
//
// The test can then assert the user-facing error content separately.

// ---------------------------------------------------------------------
// 51. Test IDs and loading indicators
// ---------------------------------------------------------------------

export const LoadingPanel: FC = (): ReactElement => {
  return <div data-testid="loading-panel">Loading...</div>;
};

// A test ID can identify a loading region:
//
// screen.getByTestId("loading-panel");
//
// If the loading state has an accessible role, a semantic query may be
// more meaningful than the test ID.

// ---------------------------------------------------------------------
// 52. Test IDs and complex DOM structures
// ---------------------------------------------------------------------

export const ComplexRegion: FC = (): ReactElement => {
  return (
    <section data-testid="results-region">
      <header>
        <h2>Results</h2>
      </header>
      <div>
        <p>24 results found.</p>
      </div>
      <footer>
        <button type="button">Next</button>
      </footer>
    </section>
  );
};

// The test ID can establish the boundary:
//
// const results = screen.getByTestId("results-region");
//
// More specific semantic queries can then operate within it.

// ---------------------------------------------------------------------
// 53. Test IDs and test readability
// ---------------------------------------------------------------------

export interface TestReadabilityExample {
  readonly lessExpressive: string;
  readonly moreExpressive: string;
}

export const testReadabilityExample: TestReadabilityExample = {
  lessExpressive: 'screen.getByTestId("save-button")',
  moreExpressive: 'screen.getByRole("button", {name: "Save"})',
};

// The second query communicates both the element type and its accessible name.
// Query choice affects how clearly a test describes user-facing behavior.

// ---------------------------------------------------------------------
// 54. Test IDs and accessibility regressions
// ---------------------------------------------------------------------

export const AccessibilityRegressionExample: FC = (): ReactElement => {
  return (
    <button data-testid="save-button" type="button">
      Save
    </button>
  );
};

// A test that only uses the test ID:
//
// screen.getByTestId("save-button");
//
// could still pass if the element's semantic role were accidentally changed.
//
// A role query would expose that regression:
//
// screen.getByRole(
//     "button",
//     {name: "Save"},
// );

// ---------------------------------------------------------------------
// 55. Test IDs and user-facing contracts
// ---------------------------------------------------------------------

export const UserFacingContract: FC = (): ReactElement => {
  return (
    <button data-testid="submit-action" type="button">
      Submit
    </button>
  );
};

// If the requirement is "the user can submit", a semantic query is stronger:
//
// screen.getByRole(
//     "button",
//     {name: "Submit"},
// );
//
// The test ID can still be useful for identifying a larger container
// around the action.

// ---------------------------------------------------------------------
// 56. Test IDs and implementation-only elements
// ---------------------------------------------------------------------

export const ImplementationElement: FC = (): ReactElement => {
  return (
    <div data-testid="internal-wrapper">
      <p>Visible content.</p>
    </div>
  );
};

// A test ID can be appropriate when the wrapper itself represents a
// meaningful testing boundary.
// It should not be added merely to make every DOM node easy to select.

// ---------------------------------------------------------------------
// 57. Test IDs and component APIs
// ---------------------------------------------------------------------

export interface WidgetProps {
  readonly testId?: string;
}

export const Widget = ({ testId }: WidgetProps): ReactElement => {
  return <section data-testid={testId}>Widget</section>;
};

// Exposing a test ID through a component API can be appropriate when
// consumers need a stable integration-test hook:
//
// <Widget testId="account-widget" />

// ---------------------------------------------------------------------
// 58. Test IDs and forwarding
// ---------------------------------------------------------------------

export interface CardProps {
  readonly testId?: string;
  readonly children: React.ReactNode;
}

export const Card = ({ testId, children }: CardProps): ReactElement => {
  return <article data-testid={testId}>{children}</article>;
};

// The component forwards the supplied value to the DOM attribute:
//
// <Card testId="account-card">Account</Card>
//
// The resulting element can be located with:
//
// screen.getByTestId("account-card");

// ---------------------------------------------------------------------
// 59. Test IDs and stable identifiers
// ---------------------------------------------------------------------

export const UserCard: FC<{
  readonly userId: string;
}> = ({ userId }): ReactElement => {
  return (
    <article data-testid={`user-card-${userId}`}>
      <p>John Doe</p>
    </article>
  );
};

// A domain identifier can make a useful test hook when it is stable
// and relevant to the scenario:
//
// screen.getByTestId("user-card-123");

// ---------------------------------------------------------------------
// 60. Test IDs and generated DOM IDs
// ---------------------------------------------------------------------

export const GeneratedDomId: FC = (): ReactElement => {
  return (
    <section data-testid="account-panel" id="account-panel">
      Account
    </section>
  );
};

// `id` and `data-testid` serve different purposes:
//
// id:
// - identifies a DOM element for HTML relationships and browser APIs
//
// data-testid:
// - provides a Testing Library test hook
//
// They should not be treated as interchangeable.

// ---------------------------------------------------------------------
// 61. Test IDs and labels
// ---------------------------------------------------------------------

export const LabeledInput: FC = (): ReactElement => {
  return (
    <label htmlFor="email">
      Email
      <input data-testid="email-input" id="email" type="email" />
    </label>
  );
};

// Prefer the label when testing the input as a user would find it:
//
// screen.getByLabelText("Email");
//
// The test ID can still be useful when the test specifically needs
// the implementation boundary.

// ---------------------------------------------------------------------
// 62. Test IDs and forms
// ---------------------------------------------------------------------

export const AccountForm: FC = (): ReactElement => {
  return (
    <form data-testid="account-form">
      <label htmlFor="name">
        Name
        <input id="name" name="name" />
      </label>

      <button type="submit">Save</button>
    </form>
  );
};

// The form itself may not have a convenient unique accessible query.
// A test ID can identify the form:
//
// const form = screen.getByTestId("account-form");
//
// The controls can still be queried semantically within it.

// ---------------------------------------------------------------------
// 63. Test IDs and empty states
// ---------------------------------------------------------------------

export const EmptyState: FC = (): ReactElement => {
  return (
    <section data-testid="empty-state">
      <h2>No results</h2>
      <p>Try another search.</p>
    </section>
  );
};

// The test ID identifies the entire state:
//
// screen.getByTestId("empty-state");
//
// User-facing text can then verify the state itself:
//
// within(screen.getByTestId("empty-state")).getByText("No results");

// ---------------------------------------------------------------------
// 64. Test IDs and result states
// ---------------------------------------------------------------------

export const SearchResults: FC<{
  readonly hasResults: boolean;
}> = ({ hasResults }): ReactElement => {
  return hasResults ? (
    <section data-testid="search-results">
      <p>Results found.</p>
    </section>
  ) : (
    <section data-testid="search-empty">
      <p>No results.</p>
    </section>
  );
};

// Different state boundaries can have distinct test IDs:
//
// screen.getByTestId("search-results");
// screen.getByTestId("search-empty");

// ---------------------------------------------------------------------
// 65. Test IDs and accessibility testing
// ---------------------------------------------------------------------

export const AccessibleRegion: FC = (): ReactElement => {
  return (
    <section aria-label="Account information" data-testid="account-region">
      Account content
    </section>
  );
};

// A test ID locates the region:
//
// screen.getByTestId("account-region");
//
// An accessible query verifies the semantic contract:
//
// screen.getByRole(
//     "region",
//     {name: "Account information"},
// );

// ---------------------------------------------------------------------
// 66. Test IDs and semantic query fallback
// ---------------------------------------------------------------------

export const FallbackExample: FC = (): ReactElement => {
  return (
    <div data-testid="application-shell">
      <p>Application content.</p>
    </div>
  );
};

// A sensible query-selection progression is:
//
// 1. Prefer role, label, text, or another user-facing query.
// 2. Use a test ID when no suitable user-facing query exists.
// 3. Keep the test ID stable and meaningful.

// ---------------------------------------------------------------------
// 67. Test IDs and exact matching
// ---------------------------------------------------------------------

export const ExactTestId: FC = (): ReactElement => {
  return <div data-testid="account-panel">Account</div>;
};

// Test IDs are matched against the configured test ID attribute:
//
// screen.getByTestId("account-panel");
//
// The query should use the exact stable identifier defined by the component.

// ---------------------------------------------------------------------
// 68. Test IDs and regular expressions
// ---------------------------------------------------------------------

export const RegexTestId: FC = (): ReactElement => {
  return <div data-testid="account-panel">Account</div>;
};

// Test ID queries can use regular expressions:
//
// screen.getByTestId(/account-/i);
//
// This can be useful when several IDs share a stable naming convention.

// ---------------------------------------------------------------------
// 69. Test IDs and custom matchers
// ---------------------------------------------------------------------

export const CustomTestIdMatcher: FC = (): ReactElement => {
  return <div data-testid="account-panel">Account</div>;
};

// A function matcher can provide custom matching logic:
//
// screen.getByTestId(
//     (testId) => testId.startsWith("account-"),
// );

// Keep custom matchers simple so that the test remains readable.

// ---------------------------------------------------------------------
// 70. Test IDs and query cardinality
// ---------------------------------------------------------------------

export interface TestIdCardinality {
  readonly situation: string;
  readonly query: string;
}

export const testIdCardinality: readonly TestIdCardinality[] = [
  {
    situation: "Exactly one element must exist",
    query: "getByTestId",
  },
  {
    situation: "The element may be absent",
    query: "queryByTestId",
  },
  {
    situation: "One element appears asynchronously",
    query: "findByTestId",
  },
  {
    situation: "Several elements must exist",
    query: "getAllByTestId",
  },
  {
    situation: "Several elements may be absent",
    query: "queryAllByTestId",
  },
  {
    situation: "Several elements appear asynchronously",
    query: "findAllByTestId",
  },
];

// ---------------------------------------------------------------------
// 71. Test IDs and debugging
// ---------------------------------------------------------------------

export const DebuggableRegion: FC = (): ReactElement => {
  return (
    <section data-testid="debug-region">
      <h2>Account</h2>
      <p>Account content.</p>
    </section>
  );
};

// A test ID can make a difficult-to-identify region easy to locate while
// debugging:
//
// screen.getByTestId("debug-region");
//
// It should still represent a meaningful boundary rather than a random DOM node.

// ---------------------------------------------------------------------
// 72. Test IDs and refactoring
// ---------------------------------------------------------------------

export const RefactorSafeRegion: FC = (): ReactElement => {
  return (
    <section data-testid="profile-region">
      <div>
        <p>Profile information.</p>
      </div>
    </section>
  );
};

// Internal markup can change while the stable testing boundary remains:
//
// <section data-testid="profile-region">
//
// This is one reason a meaningful test ID can be preferable to a CSS selector.

// ---------------------------------------------------------------------
// 73. Test IDs and overuse
// ---------------------------------------------------------------------

export const OveruseExample: FC = (): ReactElement => {
  return (
    <section data-testid="account-section">
      <h2 data-testid="account-heading">Account</h2>
      <p data-testid="account-description">Manage your account.</p>
      <button data-testid="account-save-button" type="button">
        Save
      </button>
    </section>
  );
};

// Not every element needs a test ID.
// Better queries already exist for most of these elements:
//
// screen.getByRole(
//     "heading",
//     {name: "Account"},
// );
//
// screen.getByText("Manage your account.");
//
// screen.getByRole(
//     "button",
//     {name: "Save"},
// );

// ---------------------------------------------------------------------
// 74. Test IDs and focused hooks
// ---------------------------------------------------------------------

export const FocusedTestHooks: FC = (): ReactElement => {
  return (
    <section data-testid="account-panel">
      <h2>Account</h2>
      <p>Manage your account.</p>
      <button type="button">Save</button>
    </section>
  );
};

// One stable test hook can identify the larger boundary:
//
// const panel = screen.getByTestId("account-panel");
//
// Semantic queries can handle the contents:
//
// within(panel).getByRole(
//     "button",
//     {name: "Save"},
// );

// ---------------------------------------------------------------------
// 75. Complete test ID example
// ---------------------------------------------------------------------

export const AccountDashboard: FC = (): ReactElement => {
  return (
    <main data-testid="account-dashboard">
      <h1>Account</h1>

      <section data-testid="profile-panel">
        <h2>Profile</h2>
        <p>John Doe</p>
        <button type="button">Edit profile</button>
      </section>

      <section data-testid="security-panel">
        <h2>Security</h2>
        <p>Your account is secure.</p>
        <button type="button">Review security</button>
      </section>
    </main>
  );
};

// Test IDs can identify meaningful regions:
//
// const profile = screen.getByTestId("profile-panel");
// const security = screen.getByTestId("security-panel");
//
// Semantic queries can then verify the user-facing behavior:
//
// within(profile).getByRole(
//     "button",
//     {name: "Edit profile"},
// );
//
// within(security).getByText("Your account is secure.");

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - `data-testid` provides an explicit testing hook for an element.
// - `getByTestId` returns exactly one matching element and throws when the result is ambiguous or absent.
// - `queryByTestId` returns `null` when no matching element exists and is useful when absence is expected.
// - `findByTestId` waits asynchronously for one matching element to appear.
// - `getAllByTestId`, `queryAllByTestId`, and `findAllByTestId` handle multiple matching elements.
// - Test IDs are most useful as a fallback when role, label, text, placeholder, or another user-facing query is not suitable.
// - A test ID does not describe an element's semantic role or accessible name.
// - `getByRole`, `getByLabelText`, `getByText`, and related queries are generally more expressive when they match the test's actual intent.
// - Test IDs are useful for meaningful containers, complex widgets, integration boundaries, and elements without convenient user-facing semantics.
// - Test IDs should be stable and describe the element's purpose rather than its styling or DOM structure.
// - Dynamic test IDs can be appropriate when they are based on stable identifiers relevant to the test.
// - Avoid unstable values such as random numbers in test IDs.
// - A test ID can identify a container while semantic queries locate the interactive elements inside it.
// - `within` can scope further queries to an element located by a test ID.
// - Adding test IDs to every DOM element creates unnecessary implementation coupling and reduces the value of more semantic queries.
// - The default Testing Library test ID attribute is `data-testid`, and the configured attribute can be changed when necessary.
// - Test IDs are lookup mechanisms, not accessibility assertions.
// - Use test IDs deliberately when they provide a stable testing boundary that cannot be expressed more meaningfully through a user-facing query.
