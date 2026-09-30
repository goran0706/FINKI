/**
 * Queries by Role
 * ===============
 *
 * Testing Library's `getByRole`, `queryByRole`, and `findByRole` queries locate elements through
 * their accessible roles. Role queries are usually preferred for semantic and interactive elements
 * because they reflect how users and assistive technologies identify elements in the rendered UI.
 */

import { type FC, type ReactElement } from "react";

// ---------------------------------------------------------------------
// 1. Basic role queries
// ---------------------------------------------------------------------

export const SaveButton: FC = (): ReactElement => {
  return <button type="button">Save</button>;
};

// A typical test:
//
// render(<SaveButton />);
//
// screen.getByRole("button");

// `getByRole` searches the rendered document for an element
// exposing the requested accessible role.

// ---------------------------------------------------------------------
// 2. Role with an accessible name
// ---------------------------------------------------------------------

export const ProfileActions: FC = (): ReactElement => {
  return (
    <section>
      <button type="button">Edit profile</button>
      <button type="button">Delete profile</button>
    </section>
  );
};

// When several elements have the same role, use `name`:
//
// screen.getByRole(
//     "button",
//     {name: "Edit profile"},
// );
//
// screen.getByRole(
//     "button",
//     {name: "Delete profile"},
// );

// The name is the element's accessible name, not its CSS class or test ID.

// ---------------------------------------------------------------------
// 3. Accessible names
// ---------------------------------------------------------------------

export const NamedButton: FC = (): ReactElement => {
  return <button type="button">Continue</button>;
};

// The button's accessible name is "Continue":
//
// screen.getByRole(
//     "button",
//     {name: "Continue"},
// );

// Visible button text commonly contributes to the accessible name.

// ---------------------------------------------------------------------
// 4. Native semantic roles
// ---------------------------------------------------------------------

export const SemanticElements: FC = (): ReactElement => {
  return (
    <main>
      <h1>Products</h1>
      <a href="/products">Products</a>
      <button type="button">Refresh</button>
    </main>
  );
};

// Native HTML elements expose semantic roles:
//
// screen.getByRole("main");
// screen.getByRole("heading", {name: "Products"});
// screen.getByRole("link", {name: "Products"});
// screen.getByRole("button", {name: "Refresh"});

// Prefer native semantic HTML when it already provides the required role.

// ---------------------------------------------------------------------
// 5. Common roles
// ---------------------------------------------------------------------

export interface RoleExample {
  readonly role: string;
  readonly element: string;
}

export const commonRoles: readonly RoleExample[] = [
  { role: "button", element: "<button>" },
  { role: "link", element: '<a href="...">' },
  { role: "heading", element: "<h1> through <h6>" },
  { role: "textbox", element: "<input> and <textarea> in applicable contexts" },
  { role: "checkbox", element: '<input type="checkbox">' },
  { role: "radio", element: '<input type="radio">' },
  { role: "combobox", element: "<select> and applicable controls" },
  { role: "list", element: "<ul>, <ol>" },
  { role: "listitem", element: "<li>" },
  { role: "navigation", element: "<nav>" },
  { role: "main", element: "<main>" },
  { role: "alert", element: "An element with alert semantics" },
  { role: "status", element: "An element with status semantics" },
];

// The role passed to `getByRole` describes the accessible role exposed by the element.

// ---------------------------------------------------------------------
// 6. Heading roles
// ---------------------------------------------------------------------

export const ProductPage: FC = (): ReactElement => {
  return (
    <main>
      <h1>Products</h1>
      <h2>Featured products</h2>
    </main>
  );
};

// Heading queries can include the heading level:
//
// screen.getByRole(
//     "heading",
//     {name: "Products", level: 1},
// );
//
// screen.getByRole(
//     "heading",
//     {name: "Featured products", level: 2},
// );

// ---------------------------------------------------------------------
// 7. Link roles
// ---------------------------------------------------------------------

export const Navigation: FC = (): ReactElement => {
  return (
    <nav aria-label="Main navigation">
      <a href="/">Home</a>
      <a href="/products">Products</a>
    </nav>
  );
};

// Example:
//
// screen.getByRole(
//     "link",
//     {name: "Products"},
// );

// The query describes the link's accessible identity rather than its URL.

// ---------------------------------------------------------------------
// 8. Form control roles
// ---------------------------------------------------------------------

export const ContactForm: FC = (): ReactElement => {
  return (
    <form>
      <label htmlFor="email">Email</label>
      <input id="email" type="email" />

      <label htmlFor="message">Message</label>
      <textarea id="message" />

      <button type="submit">Send</button>
    </form>
  );
};

// Example:
//
// screen.getByRole(
//     "textbox",
//     {name: "Email"},
// );
//
// screen.getByRole(
//     "textbox",
//     {name: "Message"},
// );
//
// screen.getByRole(
//     "button",
//     {name: "Send"},
// );

// Labels contribute to the accessible names of the form controls.

// ---------------------------------------------------------------------
// 9. Checkbox roles
// ---------------------------------------------------------------------

export const Preferences: FC = (): ReactElement => {
  return (
    <label>
      Receive updates
      <input type="checkbox" />
    </label>
  );
};

// Example:
//
// screen.getByRole(
//     "checkbox",
//     {name: "Receive updates"},
// );

// The role identifies the control and the name identifies the specific checkbox.

// ---------------------------------------------------------------------
// 10. Radio roles
// ---------------------------------------------------------------------

export const DeliveryOptions: FC = (): ReactElement => {
  return (
    <fieldset>
      <legend>Delivery</legend>

      <label>
        Standard
        <input type="radio" name="delivery" value="standard" />
      </label>

      <label>
        Express
        <input type="radio" name="delivery" value="express" />
      </label>
    </fieldset>
  );
};

// Example:
//
// screen.getByRole(
//     "radio",
//     {name: "Express"},
// );

// ---------------------------------------------------------------------
// 11. List roles
// ---------------------------------------------------------------------

export const ProductList: FC = (): ReactElement => {
  return (
    <ul>
      <li>Product A</li>
      <li>Product B</li>
      <li>Product C</li>
    </ul>
  );
};

// Example:
//
// screen.getByRole("list");
//
// screen.getAllByRole("listitem");

// A list has one `list` role and each direct list item exposes `listitem`.

// ---------------------------------------------------------------------
// 12. Navigation roles
// ---------------------------------------------------------------------

export const SiteNavigation: FC = (): ReactElement => {
  return (
    <nav aria-label="Primary">
      <a href="/">Home</a>
      <a href="/products">Products</a>
    </nav>
  );
};

// Example:
//
// screen.getByRole(
//     "navigation",
//     {name: "Primary"},
// );

// The `aria-label` gives the navigation landmark an accessible name.

// ---------------------------------------------------------------------
// 13. Multiple landmarks
// ---------------------------------------------------------------------

export const PageLayout: FC = (): ReactElement => {
  return (
    <>
      <header>
        <h1>Application</h1>
      </header>

      <main>
        <p>Content</p>
      </main>

      <footer>
        <a href="/help">Help</a>
      </footer>
    </>
  );
};

// Example:
//
// screen.getByRole("banner");
// screen.getByRole("main");
// screen.getByRole("contentinfo");

// Landmark roles allow tests to target meaningful page regions.

// ---------------------------------------------------------------------
// 14. Alert roles
// ---------------------------------------------------------------------

export const ErrorAlert: FC = (): ReactElement => {
  return <p role="alert">Unable to save changes.</p>;
};

// Example:
//
// screen.getByRole(
//     "alert",
//     {name: "Unable to save changes."},
// );

// ---------------------------------------------------------------------
// 15. Status roles
// ---------------------------------------------------------------------

export const SaveStatus: FC = (): ReactElement => {
  return <p role="status">Changes saved.</p>;
};

// Example:
//
// screen.getByRole(
//     "status",
//     {name: "Changes saved."},
// );

// `status` is appropriate for non-error status information that can be exposed
// as a live region.

// ---------------------------------------------------------------------
// 16. Role queries and accessible names
// ---------------------------------------------------------------------

export const AccessibleNameExample: FC = (): ReactElement => {
  return (
    <button type="button" aria-label="Close dialog">
      ×
    </button>
  );
};

// The accessible name comes from `aria-label`:
//
// screen.getByRole(
//     "button",
//     {name: "Close dialog"},
// );

// The visible "×" is not the accessible name in this example.

// ---------------------------------------------------------------------
// 17. aria-labelledby
// ---------------------------------------------------------------------

export const LabelledButton: FC = (): ReactElement => {
  return (
    <>
      <span id="save-label">Save changes</span>
      <button type="button" aria-labelledby="save-label">
        Save
      </button>
    </>
  );
};

// The referenced element contributes the accessible name:
//
// screen.getByRole(
//     "button",
//     {name: "Save changes"},
// );

// ---------------------------------------------------------------------
// 18. Name matching
// ---------------------------------------------------------------------

export const FlexibleNameExample: FC = (): ReactElement => {
  return <button type="button">Save changes</button>;
};

// Exact string matching:
//
// screen.getByRole(
//     "button",
//     {name: "Save changes"},
// );

// Regular-expression matching:
//
// screen.getByRole(
//     "button",
//     {name: /save changes/i},
// );

// Use flexible matching only when variation is intentionally acceptable.

// ---------------------------------------------------------------------
// 19. Case-insensitive matching
// ---------------------------------------------------------------------

export const CaseInsensitiveExample: FC = (): ReactElement => {
  return <button type="button">Submit</button>;
};

// Example:
//
// screen.getByRole(
//     "button",
//     {name: /submit/i},
// );

// The `i` flag makes the regular expression case-insensitive.

// ---------------------------------------------------------------------
// 20. Exact matching
// ---------------------------------------------------------------------

export const ExactNameExample: FC = (): ReactElement => {
  return (
    <>
      <button type="button">Save</button>
      <button type="button">Save changes</button>
    </>
  );
};

// An exact accessible name distinguishes the two:
//
// screen.getByRole(
//     "button",
//     {name: "Save"},
// );

// A broad regular expression could unintentionally match both buttons.

// ---------------------------------------------------------------------
// 21. getByRole
// ---------------------------------------------------------------------

export interface QueryVariant {
  readonly query: string;
  readonly result: string;
}

export const getByRoleVariant: QueryVariant = {
  query: 'screen.getByRole("button", {name: "Save"})',
  result: "One matching element",
};

// `getByRole` throws when no matching element exists.
// It also throws when multiple elements match the query.

// ---------------------------------------------------------------------
// 22. queryByRole
// ---------------------------------------------------------------------

export const OptionalButton: FC<{
  readonly visible: boolean;
}> = ({ visible }): ReactElement | null => {
  return visible ? <button type="button">Continue</button> : null;
};

// Example:
//
// render(<OptionalButton visible={false} />);
//
// screen.queryByRole(
//     "button",
//     {name: "Continue"},
// );
//
// The result is `null` when the button does not exist.

// `queryByRole` is appropriate when absence is an expected result.

// ---------------------------------------------------------------------
// 23. findByRole
// ---------------------------------------------------------------------

export const AsyncButton: FC<{
  readonly ready: boolean;
}> = ({ ready }): ReactElement | null => {
  return ready ? <button type="button">Continue</button> : null;
};

// Conceptually:
//
// render(<AsyncButton ready={false} />);
//
// const button = await screen.findByRole(
//     "button",
//     {name: "Continue"},
// );
//
// `findByRole` waits for the matching element to appear.

// ---------------------------------------------------------------------
// 24. getAllByRole
// ---------------------------------------------------------------------

export const ActionList: FC = (): ReactElement => {
  return (
    <div>
      <button type="button">Edit</button>
      <button type="button">Edit</button>
      <button type="button">Delete</button>
    </div>
  );
};

// Example:
//
// const editButtons = screen.getAllByRole(
//     "button",
//     {name: "Edit"},
// );
//
// `getAllByRole` returns all matching elements and throws when none exist.

// ---------------------------------------------------------------------
// 25. queryAllByRole
// ---------------------------------------------------------------------

export const queryAllByRoleExample = (): void => {
  const buttons = screen.queryAllByRole("button", { name: "Edit" });

  void buttons;
};

// `queryAllByRole` returns an empty array when there are no matches.

// ---------------------------------------------------------------------
// 26. findAllByRole
// ---------------------------------------------------------------------

export interface AsyncRoleQuery {
  readonly query: string;
  readonly behavior: string;
}

export const asyncRoleQuery: AsyncRoleQuery = {
  query: 'screen.findAllByRole("listitem")',
  behavior: "Wait for multiple matching elements to appear",
};

// `findAllByRole` is the asynchronous counterpart to `getAllByRole`.

// ---------------------------------------------------------------------
// 27. Role state: checked
// ---------------------------------------------------------------------

export const CheckedPreference: FC = (): ReactElement => {
  return (
    <label>
      Receive updates
      <input type="checkbox" defaultChecked />
    </label>
  );
};

// Example:
//
// screen.getByRole(
//     "checkbox",
//     {
//         name: "Receive updates",
//         checked: true,
//     },
// );

// Role-specific state can make a query more precise.

// ---------------------------------------------------------------------
// 28. Role state: selected
// ---------------------------------------------------------------------

export const Tabs: FC = (): ReactElement => {
  return (
    <div role="tablist">
      <button type="button" role="tab" aria-selected="true">
        Overview
      </button>

      <button type="button" role="tab" aria-selected="false">
        Details
      </button>
    </div>
  );
};

// Example:
//
// screen.getByRole(
//     "tab",
//     {
//         name: "Overview",
//         selected: true,
//     },
// );

// ---------------------------------------------------------------------
// 29. Role state: expanded
// ---------------------------------------------------------------------

export const OptionsButton: FC = (): ReactElement => {
  return (
    <button type="button" aria-expanded="true" aria-controls="options">
      Options
    </button>
  );
};

// Example:
//
// screen.getByRole(
//     "button",
//     {
//         name: "Options",
//         expanded: true,
//     },
// );

// ---------------------------------------------------------------------
// 30. Role state: pressed
// ---------------------------------------------------------------------

export const ToggleButton: FC = (): ReactElement => {
  return (
    <button type="button" aria-pressed="true">
      Bold
    </button>
  );
};

// Example:
//
// screen.getByRole(
//     "button",
//     {
//         name: "Bold",
//         pressed: true,
//     },
// );

// ---------------------------------------------------------------------
// 31. Role state: current
// ---------------------------------------------------------------------

export const CurrentNavigation: FC = (): ReactElement => {
  return (
    <nav aria-label="Main">
      <a href="/" aria-current="page">
        Home
      </a>
      <a href="/products">Products</a>
    </nav>
  );
};

// Example:
//
// screen.getByRole(
//     "link",
//     {
//         name: "Home",
//         current: "page",
//     },
// );

// ---------------------------------------------------------------------
// 32. Role state: disabled
// ---------------------------------------------------------------------

export const DisabledAction: FC = (): ReactElement => {
  return (
    <button type="button" disabled>
      Submit
    </button>
  );
};

// The role query finds the button:
//
// const button = screen.getByRole(
//     "button",
//     {name: "Submit"},
// );
//
// A separate assertion can verify that it is disabled.

// ---------------------------------------------------------------------
// 33. Role state and assertions
// ---------------------------------------------------------------------

export interface QueryResponsibility {
  readonly responsibility: string;
  readonly example: string;
}

export const queryResponsibilities: readonly QueryResponsibility[] = [
  {
    responsibility: "Locate the element",
    example: 'screen.getByRole("button", {name: "Submit"})',
  },
  {
    responsibility: "Verify its state",
    example: "An assertion that the button is disabled",
  },
];

// A query identifies an element; an assertion verifies the expected condition.

// ---------------------------------------------------------------------
// 34. Heading level
// ---------------------------------------------------------------------

export const HeadingLevels: FC = (): ReactElement => {
  return (
    <main>
      <h1>Account</h1>
      <h2>Preferences</h2>
    </main>
  );
};

// Example:
//
// screen.getByRole(
//     "heading",
//     {
//         name: "Account",
//         level: 1,
//     },
// );
//
// screen.getByRole(
//     "heading",
//     {
//         name: "Preferences",
//         level: 2,
//     },
// );

// ---------------------------------------------------------------------
// 35. Navigation name
// ---------------------------------------------------------------------

export const NamedNavigation: FC = (): ReactElement => {
  return (
    <>
      <nav aria-label="Primary">
        <a href="/products">Products</a>
      </nav>

      <nav aria-label="Secondary">
        <a href="/help">Help</a>
      </nav>
    </>
  );
};

// The navigation landmarks can be distinguished by accessible name:
//
// screen.getByRole(
//     "navigation",
//     {name: "Primary"},
// );
//
// screen.getByRole(
//     "navigation",
//     {name: "Secondary"},
// );

// ---------------------------------------------------------------------
// 36. Dialog roles
// ---------------------------------------------------------------------

export const ConfirmationDialog: FC = (): ReactElement => {
  return (
    <div role="dialog" aria-labelledby="dialog-title">
      <h2 id="dialog-title">Delete profile</h2>
      <button type="button">Cancel</button>
      <button type="button">Delete</button>
    </div>
  );
};

// Example:
//
// screen.getByRole(
//     "dialog",
//     {name: "Delete profile"},
// );

// The heading referenced by `aria-labelledby` provides the dialog's accessible name.

// ---------------------------------------------------------------------
// 37. Alert dialog roles
// ---------------------------------------------------------------------

export const AlertDialog: FC = (): ReactElement => {
  return (
    <div role="alertdialog" aria-labelledby="alert-title">
      <h2 id="alert-title">Unsaved changes</h2>
      <button type="button">Leave</button>
    </div>
  );
};

// Example:
//
// screen.getByRole(
//     "alertdialog",
//     {name: "Unsaved changes"},
// );

// `alertdialog` and `dialog` are different accessible roles.

// ---------------------------------------------------------------------
// 38. Role queries and semantic HTML
// ---------------------------------------------------------------------

export const SemanticButton: FC = (): ReactElement => {
  return <button type="button">Save</button>;
};

export const NonSemanticButton: FC = (): ReactElement => {
  return (
    <div role="button" tabIndex={0}>
      Save
    </div>
  );
};

// Both examples can expose a button role, but native `<button>` provides
// built-in keyboard, focus, and interaction semantics that a generic
// element with `role="button"` does not automatically provide.

// ---------------------------------------------------------------------
// 39. Avoiding unnecessary roles
// ---------------------------------------------------------------------

export const NativeSemantics: FC = (): ReactElement => {
  return <button type="button">Save</button>;
};

// Do not add:
//
// <button role="button">Save</button>
//
// when the native element already exposes the desired role.

// Native semantic elements usually produce simpler and more reliable UI.

// ---------------------------------------------------------------------
// 40. Role queries and accessible structure
// ---------------------------------------------------------------------

export const AccessiblePage: FC = (): ReactElement => {
  return (
    <main>
      <h1>Account</h1>

      <nav aria-label="Account navigation">
        <a href="/profile">Profile</a>
        <a href="/settings">Settings</a>
      </nav>

      <button type="button">Sign out</button>
    </main>
  );
};

// A role-based test can express the page structure:
//
// screen.getByRole("main");
// screen.getByRole("heading", {name: "Account"});
// screen.getByRole("navigation", {name: "Account navigation"});
// screen.getByRole("link", {name: "Settings"});
// screen.getByRole("button", {name: "Sign out"});

// ---------------------------------------------------------------------
// 41. Role queries and repeated elements
// ---------------------------------------------------------------------

export const RepeatedButtons: FC = (): ReactElement => {
  return (
    <section>
      <button type="button">Remove</button>
      <button type="button">Remove</button>
    </section>
  );
};

// This is ambiguous:
//
// screen.getByRole(
//     "button",
//     {name: "Remove"},
// );
//
// Use:
//
// screen.getAllByRole(
//     "button",
//     {name: "Remove"},
// );
//
// when multiple matching buttons are expected.

// ---------------------------------------------------------------------
// 42. Narrowing repeated roles with names
// ---------------------------------------------------------------------

export const NamedActions: FC = (): ReactElement => {
  return (
    <section>
      <button type="button">Edit</button>
      <button type="button">Delete</button>
      <button type="button">Archive</button>
    </section>
  );
};

// A role plus accessible name provides a narrower query:
//
// screen.getByRole(
//     "button",
//     {name: "Archive"},
// );

// ---------------------------------------------------------------------
// 43. Role queries and regular expressions
// ---------------------------------------------------------------------

export const RegexRoleQuery: FC = (): ReactElement => {
  return <button type="button">Save product</button>;
};

// Example:
//
// screen.getByRole(
//     "button",
//     {name: /save/i},
// );

// Regular expressions can be useful when the exact accessible name
// is intentionally variable.

// ---------------------------------------------------------------------
// 44. Avoiding overly broad names
// ---------------------------------------------------------------------

export const SimilarNames: FC = (): ReactElement => {
  return (
    <>
      <button type="button">Save</button>
      <button type="button">Save product</button>
    </>
  );
};

// This query can match more than one element:
//
// screen.getByRole(
//     "button",
//     {name: /save/i},
// );
//
// A specific name is safer when the test expects one particular button:
//
// screen.getByRole(
//     "button",
//     {name: "Save product"},
// );

// ---------------------------------------------------------------------
// 45. Role queries and hidden elements
// ---------------------------------------------------------------------

export const HiddenButton: FC = (): ReactElement => {
  return (
    <button type="button" hidden>
      Hidden action
    </button>
  );
};

// By default, role queries generally consider the accessibility tree:
//
// screen.getByRole(
//     "button",
//     {name: "Hidden action"},
// );
//
// If a test specifically needs to query hidden content, Testing Library
// provides the `hidden` option:
//
// screen.getByRole(
//     "button",
//     {
//         name: "Hidden action",
//         hidden: true,
//     },
// );

// ---------------------------------------------------------------------
// 46. Role query and inaccessible content
// ---------------------------------------------------------------------

export const InaccessibleContent: FC = (): ReactElement => {
  return (
    <div aria-hidden="true">
      <button type="button">Hidden from accessibility tree</button>
    </div>
  );
};

// The nested button is hidden from the accessibility tree by its ancestor.
// A normal role query should not treat it as an accessible button.

// This illustrates why role queries are different from arbitrary DOM selectors.

// ---------------------------------------------------------------------
// 47. Role queries and disabled controls
// ---------------------------------------------------------------------

export const DisabledControl: FC = (): ReactElement => {
  return (
    <button type="button" disabled>
      Continue
    </button>
  );
};

// The disabled button can still be located:
//
// screen.getByRole(
//     "button",
//     {name: "Continue"},
// );
//
// The query identifies the element; the test can separately verify
// the disabled state.

// ---------------------------------------------------------------------
// 48. Role queries and accessible descriptions
// ---------------------------------------------------------------------

export const DescribedControl: FC = (): ReactElement => {
  return (
    <>
      <p id="help-text">Saves the current changes.</p>

      <button type="button" aria-describedby="help-text">
        Save
      </button>
    </>
  );
};

// The accessible name is "Save" while the accessible description
// provides additional information.
//
// screen.getByRole(
//     "button",
//     {name: "Save"},
// );

// Description and state are separate from the role itself.

// ---------------------------------------------------------------------
// 49. Role queries and forms
// ---------------------------------------------------------------------

export const RegistrationForm: FC = (): ReactElement => {
  return (
    <form>
      <label htmlFor="name">Name</label>
      <input id="name" />

      <label htmlFor="email">Email</label>
      <input id="email" type="email" />

      <button type="submit">Create account</button>
    </form>
  );
};

// Example:
//
// screen.getByRole(
//     "textbox",
//     {name: "Name"},
// );
//
// screen.getByRole(
//     "textbox",
//     {name: "Email"},
// );
//
// screen.getByRole(
//     "button",
//     {name: "Create account"},
// );

// ---------------------------------------------------------------------
// 50. Role queries and stateful UI
// ---------------------------------------------------------------------

export interface RoleQueryState {
  readonly state: string;
  readonly query: string;
}

export const roleQueryStates: readonly RoleQueryState[] = [
  {
    state: "Initial UI",
    query: 'screen.getByRole("button", {name: "Start"})',
  },
  {
    state: "Updated UI",
    query: 'screen.getByRole("button", {name: "Stop"})',
  },
];

// After an interaction causes the UI to change, role queries can locate
// the new accessible state.

// ---------------------------------------------------------------------
// 51. Role queries and user-visible contracts
// ---------------------------------------------------------------------

export interface UserVisibleContract {
  readonly implementation: string;
  readonly contract: string;
}

export const userVisibleContracts: readonly UserVisibleContract[] = [
  {
    implementation: "CSS class",
    contract: "Styling implementation detail",
  },
  {
    implementation: "data-testid",
    contract: "Explicit testing hook",
  },
  {
    implementation: "Accessible role and name",
    contract: "User-facing semantic behavior",
  },
];

// Role queries generally target a stronger behavioral contract than
// implementation-specific selectors.

// ---------------------------------------------------------------------
// 52. Role queries and component boundaries
// ---------------------------------------------------------------------

export const UserCard: FC = (): ReactElement => {
  return (
    <article>
      <h2>John Doe</h2>
      <button type="button">View profile</button>
    </article>
  );
};

export const UserPage: FC = (): ReactElement => {
  return (
    <main>
      <h1>Users</h1>
      <UserCard />
    </main>
  );
};

// A test can query the resulting UI without knowing which component
// produced each element:
//
// screen.getByRole(
//     "heading",
//     {name: "John Doe"},
// );
//
// screen.getByRole(
//     "button",
//     {name: "View profile"},
// );

// ---------------------------------------------------------------------
// 53. Role queries and DOM implementation
// ---------------------------------------------------------------------

export interface ImplementationDetail {
  readonly selector: string;
  readonly stability: string;
}

export const implementationDetails: readonly ImplementationDetail[] = [
  {
    selector: ".save-button",
    stability: "Depends on a CSS class",
  },
  {
    selector: "#save",
    stability: "Depends on an implementation-specific ID",
  },
  {
    selector: 'button[aria-label="Save"]',
    stability: "Depends on accessible semantics",
  },
];

// `getByRole` avoids requiring the test to know the underlying CSS selector.

// ---------------------------------------------------------------------
// 54. Role queries and semantic changes
// ---------------------------------------------------------------------

export const SemanticContract: FC = (): ReactElement => {
  return <button type="button">Save</button>;
};

// If the internal markup changes while the element remains an accessible
// button named "Save", this query can remain valid:
//
// screen.getByRole(
//     "button",
//     {name: "Save"},
// );

// Tests are coupled to the observable contract rather than the exact markup.

// ---------------------------------------------------------------------
// 55. Role queries and test intent
// ---------------------------------------------------------------------

export interface TestIntent {
  readonly test: string;
  readonly intent: string;
}

export const testIntents: readonly TestIntent[] = [
  {
    test: 'screen.getByRole("button", {name: "Save"})',
    intent: "The user can find a Save button",
  },
  {
    test: 'screen.getByTestId("save-button")',
    intent: "A DOM node has a particular testing hook",
  },
];

// The first expresses a stronger user-facing intent.

// ---------------------------------------------------------------------
// 56. Role query decision
// ---------------------------------------------------------------------

export interface RoleDecision {
  readonly question: string;
  readonly answer: string;
}

export const roleDecision: readonly RoleDecision[] = [
  {
    question: "Is the target a semantic or interactive element?",
    answer: "Prefer `getByRole` when the role accurately represents the target",
  },
  {
    question: "Are several elements using the same role?",
    answer: "Use the accessible name or relevant role options to narrow the query",
  },
  {
    question: "Should the element be absent?",
    answer: "Use `queryByRole`",
  },
  {
    question: "Will the element appear asynchronously?",
    answer: "Use `findByRole`",
  },
  {
    question: "Are multiple matches expected?",
    answer: "Use the corresponding `AllByRole` variant",
  },
];

// ---------------------------------------------------------------------
// 57. Role query family
// ---------------------------------------------------------------------

export interface RoleQueryFamily {
  readonly family: string;
  readonly purpose: string;
}

export const roleQueryFamilies: readonly RoleQueryFamily[] = [
  {
    family: "getByRole",
    purpose: "One synchronous match is expected",
  },
  {
    family: "queryByRole",
    purpose: "Zero or one synchronous match is expected",
  },
  {
    family: "findByRole",
    purpose: "One match is expected asynchronously",
  },
  {
    family: "getAllByRole",
    purpose: "One or more synchronous matches are expected",
  },
  {
    family: "queryAllByRole",
    purpose: "Zero or more synchronous matches are expected",
  },
  {
    family: "findAllByRole",
    purpose: "Multiple matches are expected asynchronously",
  },
];

// The query family should match the expected cardinality and timing.

// ---------------------------------------------------------------------
// 58. Complete role-query example
// ---------------------------------------------------------------------

export const AccountPage: FC = (): ReactElement => {
  return (
    <main>
      <h1>Account</h1>

      <nav aria-label="Account navigation">
        <a href="/profile">Profile</a>
        <a href="/settings">Settings</a>
      </nav>

      <button type="button">Sign out</button>
    </main>
  );
};

// A role-oriented test can express the public UI:
//
// render(<AccountPage />);
//
// screen.getByRole(
//     "heading",
//     {name: "Account"},
// );
//
// screen.getByRole(
//     "navigation",
//     {name: "Account navigation"},
// );
//
// screen.getByRole(
//     "link",
//     {name: "Settings"},
// );
//
// screen.getByRole(
//     "button",
//     {name: "Sign out"},
// );

// ---------------------------------------------------------------------
// 59. Role-query checklist
// ---------------------------------------------------------------------

export interface RoleQueryChecklistItem {
  readonly item: string;
}

export const roleQueryChecklist: readonly RoleQueryChecklistItem[] = [
  {
    item: "Use the element's accessible role rather than its CSS selector",
  },
  {
    item: "Use the accessible name to distinguish elements sharing a role",
  },
  {
    item: "Use `getByRole` when one synchronous match is expected",
  },
  {
    item: "Use `queryByRole` when absence is an expected result",
  },
  {
    item: "Use `findByRole` when the element appears asynchronously",
  },
  {
    item: "Use the `AllByRole` variants when multiple matches are expected",
  },
  {
    item: "Use supported role options such as `level`, `checked`, `selected`, `expanded`, `pressed`, and `current` when relevant",
  },
  {
    item: "Prefer native semantic HTML over unnecessary ARIA roles",
  },
  {
    item: "Use test IDs when a meaningful role-based query is not appropriate",
  },
];

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Role queries locate elements through their accessible roles.
// - `getByRole` is usually the preferred query for semantic and interactive elements.
// - The `name` option narrows a role query using the element's accessible name.
// - Accessible names can come from visible text, associated labels, `aria-label`, `aria-labelledby`, and other accessibility semantics.
// - Native HTML elements provide semantic roles without requiring explicit ARIA roles.
// - `getByRole` throws when zero or multiple elements match the expected single result.
// - `queryByRole` returns `null` when no matching element exists and is useful for absence checks.
// - `findByRole` waits asynchronously for one matching element to appear.
// - `getAllByRole`, `queryAllByRole`, and `findAllByRole` handle multiple matching elements.
// - Role queries can use supported options to express states such as `checked`, `selected`, `expanded`, `pressed`, and `current`.
// - Heading queries can specify the expected heading `level`.
// - Navigation and landmark roles can be distinguished with accessible names.
// - Role queries operate on the rendered accessibility semantics rather than CSS classes or component instances.
// - Native semantic elements should generally be preferred over generic elements with manually assigned roles.
// - A role query locates an element; assertions separately verify properties such as disabled or checked state.
// - Semantic role queries generally make tests less coupled to internal DOM structure and styling implementation.
// - The query family should match the expected result: synchronous, asynchronous, absent, or multiple.
// - The goal of `getByRole` is to express the UI contract through semantics that users and assistive technologies can observe.
