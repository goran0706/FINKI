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
