/**
 * Screen
 * ======
 *
 * Testing Library's `screen` object provides queries against the document associated with the
 * current rendered test environment. It allows tests to find elements through the same accessible
 * roles, names, labels, text, and other observable characteristics that users interact with.
 */

import { type FC, type ReactElement } from "react";
import { render, screen } from "@testing-library/react";

// ---------------------------------------------------------------------
// 1. Basic screen usage
// ---------------------------------------------------------------------

export const Greeting: FC<{ readonly name: string }> = ({ name }): ReactElement => {
  return (
    <main>
      <h1>Hello, {name}</h1>
      <p>Welcome to the application.</p>
    </main>
  );
};

// A typical test first renders the component:
//
// render(<Greeting name="John Doe" />);
//
// const heading = screen.getByRole(
//     "heading",
//     {name: "Hello, John Doe"},
// );
//
// `screen` queries the document containing the rendered component.

// ---------------------------------------------------------------------
// 2. Why screen exists
// ---------------------------------------------------------------------

export interface ScreenPurpose {
  readonly purpose: string;
  readonly benefit: string;
}

export const screenPurposes: readonly ScreenPurpose[] = [
  {
    purpose: "Query the rendered document",
    benefit: "Tests can locate elements without carrying a container reference",
  },
  {
    purpose: "Express user-visible behavior",
    benefit: "Queries can describe roles, names, labels, and text",
  },
  {
    purpose: "Keep test code concise",
    benefit: "The test can use `screen.getByRole(...)` directly after rendering",
  },
];

// `screen` provides a shared query surface for the current test document.

// ---------------------------------------------------------------------
// 3. Render first, query second
// ---------------------------------------------------------------------

export const Status: FC<{
  readonly status: "loading" | "success";
}> = ({ status }): ReactElement => {
  return status === "loading" ? <p>Loading...</p> : <p>Completed successfully.</p>;
};

// The component must be rendered before `screen` can find its output:
//
// render(<Status status="success" />);
//
// screen.getByText("Completed successfully.");

// ---------------------------------------------------------------------
// 4. Screen queries the document
// ---------------------------------------------------------------------

export const documentQueryExample = (): void => {
  render(<Greeting name="John Doe" />);

  const heading = screen.getByRole("heading", { name: "Hello, John Doe" });

  void heading;
};

// The query is not tied to a component instance.
// It searches the current document for a matching element.

// ---------------------------------------------------------------------
// 5. getByRole
// ---------------------------------------------------------------------

export const AccessibleNavigation: FC = (): ReactElement => {
  return (
    <nav aria-label="Main navigation">
      <a href="/products">Products</a>
      <a href="/account">Account</a>
    </nav>
  );
};

// Example:
//
// render(<AccessibleNavigation />);
//
// screen.getByRole(
//     "link",
//     {name: "Products"},
// );
//
// screen.getByRole(
//     "link",
//     {name: "Account"},
// );

// `getByRole` is often the preferred query because it reflects
// how assistive technology exposes interactive and semantic elements.

// ---------------------------------------------------------------------
// 6. Accessible names
// ---------------------------------------------------------------------

export const SaveButton: FC = (): ReactElement => {
  return <button type="button">Save</button>;
};

// The button's accessible name is "Save":
//
// render(<SaveButton />);
//
// screen.getByRole(
//     "button",
//     {name: "Save"},
// );

// The `name` option is the accessible name, not necessarily a CSS class,
// test ID, or implementation-specific identifier.

// ---------------------------------------------------------------------
// 7. getByLabelText
// ---------------------------------------------------------------------

export const EmailField: FC = (): ReactElement => {
  return (
    <label>
      Email
      <input type="email" />
    </label>
  );
};

// Example:
//
// render(<EmailField />);
//
// screen.getByLabelText("Email");

// `getByLabelText` is useful for form controls associated with a visible label.

// ---------------------------------------------------------------------
// 8. Explicit label association
// ---------------------------------------------------------------------

export const PasswordField: FC = (): ReactElement => {
  return (
    <>
      <label htmlFor="password">Password</label>
      <input id="password" type="password" />
    </>
  );
};

// The explicit `htmlFor` / `id` association makes the label relationship
// clear to both users and the testing environment.
//
// screen.getByLabelText("Password");

// ---------------------------------------------------------------------
// 9. getByText
// ---------------------------------------------------------------------

export const WelcomeMessage: FC = (): ReactElement => {
  return <p>Welcome back.</p>;
};

// Example:
//
// render(<WelcomeMessage />);
//
// screen.getByText("Welcome back.");

// `getByText` is useful when visible text itself is the relevant target.

// ---------------------------------------------------------------------
// 10. getByTestId
// ---------------------------------------------------------------------

export const StatusRegion: FC = (): ReactElement => {
  return (
    <section data-testid="status-region">
      <p>Ready</p>
    </section>
  );
};

// Example:
//
// render(<StatusRegion />);
//
// screen.getByTestId("status-region");

// Test IDs are available when the element cannot be expressed well
// through more user-oriented queries.

// ---------------------------------------------------------------------
// 11. getByPlaceholderText
// ---------------------------------------------------------------------

export const SearchField: FC = (): ReactElement => {
  return <input type="search" placeholder="Search products" />;
};

// Example:
//
// render(<SearchField />);
//
// screen.getByPlaceholderText("Search products");

// Placeholder queries can be useful, but a real label is generally
// a stronger accessible contract for a form control.

// ---------------------------------------------------------------------
// 12. getByDisplayValue
// ---------------------------------------------------------------------

export const FilledSearchField: FC = (): ReactElement => {
  return <input aria-label="Search" value="example" readOnly />;
};

// Example:
//
// render(<FilledSearchField />);
//
// screen.getByDisplayValue("example");

// `getByDisplayValue` targets the current displayed value of a form control.

// ---------------------------------------------------------------------
// 13. getByAltText
// ---------------------------------------------------------------------

export const ProductImage: FC = (): ReactElement => {
  return <img src="/product.jpg" alt="Example product" />;
};

// Example:
//
// render(<ProductImage />);
//
// screen.getByAltText("Example product");

// `getByAltText` is useful for images and other elements that expose
// alternative text.

// ---------------------------------------------------------------------
// 14. getByTitle
// ---------------------------------------------------------------------

export const HelpButton: FC = (): ReactElement => {
  return (
    <button type="button" title="Open help">
      ?
    </button>
  );
};

// Example:
//
// render(<HelpButton />);
//
// screen.getByTitle("Open help");

// Prefer more user-facing accessible queries when they are available.

// ---------------------------------------------------------------------
// 15. Query families
// ---------------------------------------------------------------------

export interface QueryFamily {
  readonly family: string;
  readonly behavior: string;
}

export const queryFamilies: readonly QueryFamily[] = [
  {
    family: "getBy",
    behavior: "Return one matching element or throw when the result is invalid",
  },
  {
    family: "queryBy",
    behavior: "Return one matching element or null when no match exists",
  },
  {
    family: "findBy",
    behavior: "Return a Promise that resolves to one matching element asynchronously",
  },
];

// The query family determines how the test handles absence and asynchronous appearance.

// ---------------------------------------------------------------------
// 16. getBy queries
// ---------------------------------------------------------------------

export const getByExample = (): void => {
  render(<Greeting name="John Doe" />);

  const heading = screen.getByRole("heading", { name: "Hello, John Doe" });

  void heading;
};

// `getBy` is appropriate when the element should already exist
// and exactly one matching element is expected.

// ---------------------------------------------------------------------
// 17. queryBy queries
// ---------------------------------------------------------------------

export const OptionalMessage: FC<{
  readonly visible: boolean;
}> = ({ visible }): ReactElement | null => {
  return visible ? <p>Optional message</p> : null;
};

export const queryByExample = (): void => {
  render(<OptionalMessage visible={false} />);

  const message = screen.queryByText("Optional message");

  void message;
};

// `queryBy` returns `null` when no matching element exists.
// This makes it appropriate for asserting absence.

// ---------------------------------------------------------------------
// 18. findBy queries
// ---------------------------------------------------------------------

export const AsyncMessage: FC<{
  readonly loaded: boolean;
}> = ({ loaded }): ReactElement => {
  return loaded ? <p>Data loaded</p> : <p>Loading...</p>;
};

// Conceptually:
//
// render(<AsyncMessage loaded={true} />);
//
// const message = await screen.findByText("Data loaded");
//
// `findBy` is intended for elements that may appear asynchronously.

// ---------------------------------------------------------------------
// 19. getAllBy queries
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
// render(<ProductList />);
//
// const products = screen.getAllByRole("listitem");
//
// `getAllByRole` returns all matching elements and throws when none exist.

// ---------------------------------------------------------------------
// 20. queryAllBy queries
// ---------------------------------------------------------------------

export const queryAllByExample = (): void => {
  render(<ProductList />);

  const products = screen.queryAllByRole("listitem");

  void products;
};

// `queryAllBy` returns an empty array when no elements match.

// ---------------------------------------------------------------------
// 21. findAllBy queries
// ---------------------------------------------------------------------

export interface AsyncListProps {
  readonly items: readonly string[];
}

export const AsyncList: FC<AsyncListProps> = ({ items }): ReactElement => {
  return (
    <ul>
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
};

// Conceptually:
//
// render(<AsyncList items={["Product A", "Product B"]} />);
//
// const products = await screen.findAllByRole("listitem");
//
// `findAllBy` waits for multiple matching elements to appear.

// ---------------------------------------------------------------------
// 22. Querying by role with a name
// ---------------------------------------------------------------------

export const AccountActions: FC = (): ReactElement => {
  return (
    <section>
      <button type="button">Edit profile</button>
      <button type="button">Delete profile</button>
    </section>
  );
};

// Prefer a specific accessible name when multiple elements share a role:
//
// render(<AccountActions />);
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

// ---------------------------------------------------------------------
// 23. Querying headings
// ---------------------------------------------------------------------

export const ProductPage: FC = (): ReactElement => {
  return (
    <main>
      <h1>Products</h1>
      <section>
        <h2>Featured products</h2>
      </section>
    </main>
  );
};

// Example:
//
// render(<ProductPage />);
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

// Query options can further describe the expected accessible element.

// ---------------------------------------------------------------------
// 24. Querying links
// ---------------------------------------------------------------------

export const ProductLinks: FC = (): ReactElement => {
  return (
    <nav aria-label="Products">
      <a href="/products/1">Product A</a>
      <a href="/products/2">Product B</a>
    </nav>
  );
};

// Example:
//
// render(<ProductLinks />);
//
// screen.getByRole(
//     "link",
//     {name: "Product A"},
// );

// The query verifies the link's user-visible identity rather than its href.

// ---------------------------------------------------------------------
// 25. Querying checkboxes
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
// render(<Preferences />);
//
// screen.getByRole(
//     "checkbox",
//     {name: "Receive updates"},
// );

// Form controls can often be located through their semantic role and accessible name.

// ---------------------------------------------------------------------
// 26. Querying textbox controls
// ---------------------------------------------------------------------

export const ContactForm: FC = (): ReactElement => {
  return (
    <form>
      <label htmlFor="name">Name</label>
      <input id="name" />

      <label htmlFor="message">Message</label>
      <textarea id="message" />
    </form>
  );
};

// Example:
//
// render(<ContactForm />);
//
// screen.getByRole(
//     "textbox",
//     {name: "Name"},
// );
//
// screen.getByRole(
//     "textbox",
//     {name: "Message"},
// );

// Both `<input>` and `<textarea>` can expose the textbox role,
// depending on the element and its semantics.

// ---------------------------------------------------------------------
// 27. Querying comboboxes
// ---------------------------------------------------------------------

export const CountryField: FC = (): ReactElement => {
  return (
    <label>
      Country
      <select defaultValue="mk">
        <option value="mk">North Macedonia</option>
        <option value="de">Germany</option>
      </select>
    </label>
  );
};

// Example:
//
// render(<CountryField />);
//
// screen.getByRole(
//     "combobox",
//     {name: "Country"},
// );

// Native semantic controls give tests useful query targets.

// ---------------------------------------------------------------------
// 28. Querying alerts
// ---------------------------------------------------------------------

export const ErrorMessage: FC = (): ReactElement => {
  return <p role="alert">Unable to save changes.</p>;
};

// Example:
//
// render(<ErrorMessage />);
//
// screen.getByRole(
//     "alert",
//     {name: "Unable to save changes."},
// );

// The alert role exposes the message as a semantic status for assistive technology.

// ---------------------------------------------------------------------
// 29. Querying status messages
// ---------------------------------------------------------------------

export const SaveStatus: FC = (): ReactElement => {
  return <p role="status">Changes saved.</p>;
};

// Example:
//
// render(<SaveStatus />);
//
// screen.getByRole(
//     "status",
//     {name: "Changes saved."},
// );

// Semantic status regions can be queried through their role.

// ---------------------------------------------------------------------
// 30. Querying absence
// ---------------------------------------------------------------------

export const EmptyState: FC<{
  readonly hasItems: boolean;
}> = ({ hasItems }): ReactElement => {
  return hasItems ? <p>Products available.</p> : <p>No products found.</p>;
};

// Example:
//
// render(<EmptyState hasItems={false} />);
//
// screen.getByText("No products found.");
// screen.queryByText("Products available.");
//
// `queryBy` is useful when the test expects an element not to exist.

// ---------------------------------------------------------------------
// 31. Avoid using getBy for absence
// ---------------------------------------------------------------------

export const absenceQueryRule = {
  preferred: 'screen.queryByText("Products available.")',
  avoid: 'screen.getByText("Products available.")',
};

// `getBy` throws when no element is found.
// Therefore, it is the wrong query family for a normal absence assertion.

// ---------------------------------------------------------------------
// 32. Screen and multiple matches
// ---------------------------------------------------------------------

export const RepeatedLabels: FC = (): ReactElement => {
  return (
    <section>
      <button type="button">Remove</button>
      <button type="button">Remove</button>
    </section>
  );
};

// This query is ambiguous because two buttons match:
//
// screen.getByRole(
//     "button",
//     {name: "Remove"},
// );
//
// Use `getAllByRole` when multiple matching elements are expected:
//
// screen.getAllByRole(
//     "button",
//     {name: "Remove"},
// );

// ---------------------------------------------------------------------
// 33. Narrowing multiple results
// ---------------------------------------------------------------------

export const RepeatedItems: FC = (): ReactElement => {
  return (
    <ul>
      <li>Product</li>
      <li>Product</li>
      <li>Service</li>
    </ul>
  );
};

// When multiple elements match, a test can retrieve the collection:
//
// const products = screen.getAllByText("Product");
//
// The test can then inspect the collection when that multiplicity
// is part of the behavior being verified.

// ---------------------------------------------------------------------
// 34. Screen and scoped queries
// ---------------------------------------------------------------------

export const AccountPanel: FC = (): ReactElement => {
  return (
    <section aria-label="Account">
      <button type="button">Edit</button>
      <button type="button">Delete</button>
    </section>
  );
};

// `screen` queries the whole document.
//
// render(<AccountPanel />);
//
// screen.getByRole(
//     "button",
//     {name: "Edit"},
// );

// When a test needs to restrict queries to a particular subtree,
// Testing Library also provides `within`.

// ---------------------------------------------------------------------
// 35. Scoped query concept
// ---------------------------------------------------------------------

export interface ScopedQueryConcept {
  readonly utility: string;
  readonly purpose: string;
}

export const scopedQueryConcept: ScopedQueryConcept = {
  utility: "within",
  purpose: "Create queries scoped to a specific DOM element",
};

// Conceptually:
//
// const account = screen.getByRole(
//     "region",
//     {name: "Account"},
// );
//
// within(account).getByRole(
//     "button",
//     {name: "Edit"},
// );
//
// `within` is useful when the same query target appears in different regions.

// ---------------------------------------------------------------------
// 36. Screen and repeated regions
// ---------------------------------------------------------------------

export const Dashboard: FC = (): ReactElement => {
  return (
    <main>
      <section aria-label="Recent orders">
        <h2>Orders</h2>
        <button type="button">View all</button>
      </section>

      <section aria-label="Recent messages">
        <h2>Messages</h2>
        <button type="button">View all</button>
      </section>
    </main>
  );
};

// The same button name appears twice.
// A scoped query can distinguish the two regions:
//
// const orders = screen.getByRole(
//     "region",
//     {name: "Recent orders"},
// );
//
// within(orders).getByRole(
//     "button",
//     {name: "View all"},
// );

// ---------------------------------------------------------------------
// 37. Screen and DOM implementation details
// ---------------------------------------------------------------------

export interface QueryComparison {
  readonly query: string;
  readonly dependency: string;
}

export const queryComparisons: readonly QueryComparison[] = [
  {
    query: 'screen.getByRole("button", {name: "Save"})',
    dependency: "Accessible semantics",
  },
  {
    query: 'screen.getByTestId("save-button")',
    dependency: "A test-specific DOM attribute",
  },
];

// Prefer the query that represents the way the user or assistive technology
// would identify the element when such a query is available.

// ---------------------------------------------------------------------
// 38. Screen is not a selector engine
// ---------------------------------------------------------------------

export interface ScreenBoundary {
  readonly screen: string;
  readonly selectorEngine: string;
}

export const screenBoundary: ScreenBoundary = {
  screen: "Provides semantic and DOM-oriented Testing Library queries",
  selectorEngine: "Provides CSS selector matching such as querySelector",
};

// `screen` should be treated as a testing API rather than as a replacement
// for arbitrary browser DOM selection.

// ---------------------------------------------------------------------
// 39. Screen and accessible roles
// ---------------------------------------------------------------------

export const RoleBasedComponent: FC = (): ReactElement => {
  return <button type="button">Save changes</button>;
};

// Example:
//
// render(<RoleBasedComponent />);
//
// screen.getByRole(
//     "button",
//     {name: "Save changes"},
// );

// Role queries make the expected user-facing semantics explicit.

// ---------------------------------------------------------------------
// 40. Screen and visible text
// ---------------------------------------------------------------------

export const TextComponent: FC = (): ReactElement => {
  return <p>Your changes have been saved.</p>;
};

// Example:
//
// render(<TextComponent />);
//
// screen.getByText(
//     "Your changes have been saved.",
// );

// Text queries are appropriate when the visible text itself is the relevant behavior.

// ---------------------------------------------------------------------
// 41. Screen and form labels
// ---------------------------------------------------------------------

export const LoginForm: FC = (): ReactElement => {
  return (
    <form>
      <label htmlFor="username">Username</label>
      <input id="username" />

      <label htmlFor="password">Password</label>
      <input id="password" type="password" />

      <button type="submit">Sign in</button>
    </form>
  );
};

// Example:
//
// render(<LoginForm />);
//
// screen.getByRole(
//     "textbox",
//     {name: "Username"},
// );
//
// screen.getByLabelText("Password");
//
// screen.getByRole(
//     "button",
//     {name: "Sign in"},
// );

// Multiple query strategies can describe different elements in the same form.

// ---------------------------------------------------------------------
// 42. Screen and loading UI
// ---------------------------------------------------------------------

export const LoadingIndicator: FC<{
  readonly loading: boolean;
}> = ({ loading }): ReactElement => {
  return loading ? <p role="status">Loading...</p> : <p>Ready</p>;
};

// Example:
//
// render(<LoadingIndicator loading={true} />);
//
// screen.getByRole(
//     "status",
//     {name: "Loading..."},
// );

// The query describes the observable loading state.

// ---------------------------------------------------------------------
// 43. Screen and state transitions
// ---------------------------------------------------------------------

export interface StateTransition {
  readonly before: string;
  readonly after: string;
}

export const stateTransition: StateTransition = {
  before: "Loading...",
  after: "Ready",
};

// A test can query the initial UI and then, after an interaction or
// asynchronous update, query the resulting UI through `screen`.

// ---------------------------------------------------------------------
// 44. Screen and asynchronous appearance
// ---------------------------------------------------------------------

export interface AsyncQueryGuideline {
  readonly situation: string;
  readonly query: string;
}

export const asyncQueryGuideline: AsyncQueryGuideline = {
  situation: "An element appears after an asynchronous update",
  query: "screen.findByRole(...)",
};

// Example:
//
// render(<AsyncMessage loaded={false} />);
//
// // After the application updates:
//
// await screen.findByText("Data loaded");
//
// `findBy` combines querying with waiting for asynchronous appearance.

// ---------------------------------------------------------------------
// 45. Screen and disappearance
// ---------------------------------------------------------------------

export interface DisappearanceGuideline {
  readonly situation: string;
  readonly approach: string;
}

export const disappearanceGuideline: DisappearanceGuideline = {
  situation: "An element is expected to disappear asynchronously",
  approach: "Query the element and use an appropriate waiting utility for its removal",
};

// `screen` provides the query; asynchronous waiting utilities coordinate
// with React updates when the element disappears later.

// ---------------------------------------------------------------------
// 46. Screen and debug output
// ---------------------------------------------------------------------

export const debugScreenExample = (): void => {
  render(<Greeting name="John Doe" />);

  screen.debug();
};

// `screen.debug()` prints the current document or relevant DOM output.
// It is useful while developing a test.

// ---------------------------------------------------------------------
// 47. Debugging does not assert
// ---------------------------------------------------------------------

export const debugBoundary = {
  debug: "screen.debug()",
  assertion: "expect(screen.getByRole(...)).toBeInTheDocument()",
};

// Debugging shows what exists.
// Assertions determine whether the observed state is correct.

// ---------------------------------------------------------------------
// 48. Screen and document state
// ---------------------------------------------------------------------

export const DocumentStateExample: FC = (): ReactElement => {
  return (
    <>
      <header>
        <h1>Application</h1>
      </header>
      <main>
        <p>Content</p>
      </main>
    </>
  );
};

// After rendering:
//
// render(<DocumentStateExample />);
//
// `screen` can query across the rendered document:
//
// screen.getByRole(
//     "banner",
// );
//
// screen.getByRole(
//     "main",
// );

// The query surface is not limited to the component's immediate root element.

// ---------------------------------------------------------------------
// 49. Screen and fragments
// ---------------------------------------------------------------------

export const FragmentExample: FC = (): ReactElement => {
  return (
    <>
      <h1>Title</h1>
      <p>Content</p>
    </>
  );
};

// Rendering a fragment does not create an extra DOM element:
//
// render(<FragmentExample />);
//
// screen.getByRole(
//     "heading",
//     {name: "Title"},
// );

// `screen` queries the resulting DOM, not the React fragment itself.

// ---------------------------------------------------------------------
// 50. Screen and nested components
// ---------------------------------------------------------------------

export const UserCard: FC = (): ReactElement => {
  return (
    <article>
      <h2>John Doe</h2>
      <button type="button">View profile</button>
    </article>
  );
};

export const UserList: FC = (): ReactElement => {
  return (
    <main>
      <h1>Users</h1>
      <UserCard />
    </main>
  );
};

// Example:
//
// render(<UserList />);
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

// Queries operate on the resulting DOM regardless of which component
// produced each element.

// ---------------------------------------------------------------------
// 51. Screen and conditional rendering
// ---------------------------------------------------------------------

export const AccountBanner: FC<{
  readonly authenticated: boolean;
}> = ({ authenticated }): ReactElement => {
  return authenticated ? <p>Signed in as John Doe.</p> : <p>Sign in to continue.</p>;
};

// Example:
//
// render(<AccountBanner authenticated={false} />);
//
// screen.getByText("Sign in to continue.");
// screen.queryByText("Signed in as John Doe.");

// `screen` makes both presence and absence observable.

// ---------------------------------------------------------------------
// 52. Screen and attributes
// ---------------------------------------------------------------------

export const InputState: FC = (): ReactElement => {
  return <input aria-label="Search" placeholder="Search products" value="example" readOnly />;
};

// Different queries express different aspects:
//
// screen.getByLabelText("Search");
// screen.getByPlaceholderText("Search products");
// screen.getByDisplayValue("example");

// Prefer the query that best represents the behavior the test intends to verify.

// ---------------------------------------------------------------------
// 53. Screen and disabled controls
// ---------------------------------------------------------------------

export const DisabledButton: FC = (): ReactElement => {
  return (
    <button type="button" disabled>
      Submit
    </button>
  );
};

// Example:
//
// render(<DisabledButton />);
//
// const button = screen.getByRole(
//     "button",
//     {name: "Submit"},
// );
//
// // The assertion would verify its disabled state.
//
// `screen` finds the control; the assertion verifies its state.

// ---------------------------------------------------------------------
// 54. Screen and selected controls
// ---------------------------------------------------------------------

export const SelectedTab: FC = (): ReactElement => {
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
// render(<SelectedTab />);
//
// screen.getByRole(
//     "tab",
//     {name: "Overview", selected: true},
// );

// Query options can express accessibility state when supported by the role.

// ---------------------------------------------------------------------
// 55. Screen and checked controls
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
// render(<CheckedPreference />);
//
// screen.getByRole(
//     "checkbox",
//     {
//         name: "Receive updates",
//         checked: true,
//     },
// );

// The query can express the semantic state expected by the test.

// ---------------------------------------------------------------------
// 56. Screen and expanded controls
// ---------------------------------------------------------------------

export const ExpandedMenu: FC = (): ReactElement => {
  return (
    <button type="button" aria-expanded="true" aria-controls="menu">
      Options
    </button>
  );
};

// Example:
//
// render(<ExpandedMenu />);
//
// screen.getByRole(
//     "button",
//     {name: "Options", expanded: true},
// );

// Accessibility state can be part of the query when the role supports it.

// ---------------------------------------------------------------------
// 57. Screen and current document
// ---------------------------------------------------------------------

export interface CurrentDocumentConcept {
  readonly concept: string;
  readonly meaning: string;
}

export const currentDocumentConcept: CurrentDocumentConcept = {
  concept: "screen",
  meaning: "A set of queries bound to the document used by the testing environment",
};

// This is why a test normally does not need to obtain and pass
// `container` to every query.

// ---------------------------------------------------------------------
// 58. Screen versus render result queries
// ---------------------------------------------------------------------

export interface QuerySurfaceComparison {
  readonly surface: string;
  readonly usage: string;
}

export const querySurfaceComparison: readonly QuerySurfaceComparison[] = [
  {
    surface: "screen",
    usage: "Preferred for most document-level queries",
  },
  {
    surface: "render result",
    usage: "Useful when explicitly working with a specific rendered container",
  },
];

// Example:
//
// const {container} = render(<Greeting name="John Doe" />);
//
// container.querySelector("h1");
//
// screen.getByRole(
//     "heading",
//     {name: "Hello, John Doe"},
// );
//
// The semantic `screen` query is usually easier to read and more resilient.

// ---------------------------------------------------------------------
// 59. Screen and container-specific queries
// ---------------------------------------------------------------------

export interface ContainerQueryScenario {
  readonly scenario: string;
  readonly reason: string;
}

export const containerQueryScenario: readonly ContainerQueryScenario[] = [
  {
    scenario: "A test intentionally inspects a specific render container",
    reason: "The container itself is part of the behavior under test",
  },
  {
    scenario: "The component renders content into a controlled custom container",
    reason: "The test needs that specific DOM boundary",
  },
];

// These are specialized cases rather than the default query strategy.

// ---------------------------------------------------------------------
// 60. Screen and test readability
// ---------------------------------------------------------------------

export const readableScreenExample = (): void => {
  render(<Greeting name="John Doe" />);

  screen.getByRole("heading", { name: "Hello, John Doe" });
};

// Compare the intent:
//
// screen.getByRole("heading", {name: "Hello, John Doe"});
//
// is more descriptive than:
//
// document.querySelector("h1");

// The first statement describes the element through its accessible semantics.

// ---------------------------------------------------------------------
// 61. Screen and user perspective
// ---------------------------------------------------------------------

export interface UserPerspective {
  readonly testCode: string;
  readonly perspective: string;
}

export const userPerspective: UserPerspective = {
  testCode: 'screen.getByRole("button", {name: "Save"})',
  perspective: "Find the Save button as a user or assistive technology would identify it",
};

// Query choice influences what the test considers part of the component's public UI.

// ---------------------------------------------------------------------
// 62. Screen and implementation coupling
// ---------------------------------------------------------------------

export interface ImplementationCoupling {
  readonly query: string;
  readonly coupling: string;
}

export const implementationCoupling: readonly ImplementationCoupling[] = [
  {
    query: 'screen.getByRole("button", {name: "Save"})',
    coupling: "Coupled to the button's accessible behavior",
  },
  {
    query: 'screen.getByTestId("save-button")',
    coupling: "Coupled to an explicit testing attribute",
  },
  {
    query: 'container.querySelector(".save-button")',
    coupling: "Coupled to CSS class structure",
  },
];

// The first form usually communicates more meaningful user-facing intent.

// ---------------------------------------------------------------------
// 63. Screen and stable UI contracts
// ---------------------------------------------------------------------

export interface StableContract {
  readonly contract: string;
  readonly example: string;
}

export const stableContracts: readonly StableContract[] = [
  {
    contract: "Accessible role and name",
    example: 'screen.getByRole("button", {name: "Save"})',
  },
  {
    contract: "Visible label",
    example: 'screen.getByLabelText("Email")',
  },
  {
    contract: "Visible text",
    example: 'screen.getByText("Changes saved.")',
  },
];

// These contracts tend to correspond to behavior users can actually observe.

// ---------------------------------------------------------------------
// 64. Screen and test IDs
// ---------------------------------------------------------------------

export interface TestIdGuideline {
  readonly guideline: string;
}

export const testIdGuidelines: readonly TestIdGuideline[] = [
  {
    guideline: "Use semantic queries when they accurately represent the behavior",
  },
  {
    guideline: "Use a test ID when the target lacks a useful user-facing semantic",
  },
  {
    guideline: "Keep test IDs stable when they are part of the testing contract",
  },
];

// Test IDs are a useful escape hatch, not a replacement for semantic queries.

// ---------------------------------------------------------------------
// 65. Screen and hidden elements
// ---------------------------------------------------------------------

export const HiddenElementExample: FC = (): ReactElement => {
  return (
    <main>
      <p>Visible content</p>
      <p hidden>Hidden content</p>
    </main>
  );
};

// Visibility-sensitive queries can distinguish hidden content when needed.
//
// render(<HiddenElementExample />);
//
// screen.getByText(
//     "Hidden content",
//     {hidden: true},
// );
//
// Query behavior around visibility depends on the query and its options.

// ---------------------------------------------------------------------
// 66. Screen and role state
// ---------------------------------------------------------------------

export interface RoleState {
  readonly state: string;
  readonly example: string;
}

export const roleStates: readonly RoleState[] = [
  {
    state: "selected",
    example: "An active tab",
  },
  {
    state: "checked",
    example: "A checked checkbox",
  },
  {
    state: "expanded",
    example: "An expanded disclosure control",
  },
  {
    state: "pressed",
    example: "A pressed toggle button",
  },
  {
    state: "current",
    example: "The current navigation item",
  },
];

// Semantic state can often be expressed directly through role query options.

// ---------------------------------------------------------------------
// 67. Screen and current navigation
// ---------------------------------------------------------------------

export const Navigation: FC = (): ReactElement => {
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
// render(<Navigation />);
//
// screen.getByRole(
//     "link",
//     {name: "Home", current: "page"},
// );

// This verifies both the link's identity and its current-navigation state.

// ---------------------------------------------------------------------
// 68. Screen and accessible descriptions
// ---------------------------------------------------------------------

export const DescribedButton: FC = (): ReactElement => {
  return (
    <>
      <p id="save-help">Saves the current changes.</p>
      <button type="button" aria-describedby="save-help">
        Save
      </button>
    </>
  );
};

// The rendered DOM contains both the accessible name and description.
// Tests can query the button and, when relevant, assert its accessible
// description through the appropriate matcher.

// ---------------------------------------------------------------------
// 69. Screen and document-wide queries
// ---------------------------------------------------------------------

export const DocumentWideExample: FC = (): ReactElement => {
  return (
    <main>
      <h1>Products</h1>
      <footer>
        <a href="/help">Help</a>
      </footer>
    </main>
  );
};

// `screen` can find elements regardless of which nested component
// produced them:
//
// render(<DocumentWideExample />);
//
// screen.getByRole(
//     "link",
//     {name: "Help"},
// );

// ---------------------------------------------------------------------
// 70. Screen and component boundaries
// ---------------------------------------------------------------------

export interface ComponentBoundaryPrinciple {
  readonly principle: string;
}

export const componentBoundaryPrinciple: readonly ComponentBoundaryPrinciple[] = [
  {
    principle: "Query what the rendered component exposes",
  },
  {
    principle: "Do not query private component variables or React instances",
  },
  {
    principle: "Prefer observable DOM behavior over implementation details",
  },
];

// `screen` naturally encourages tests to operate at the rendered UI boundary.

// ---------------------------------------------------------------------
// 71. Screen and React component instances
// ---------------------------------------------------------------------

export interface InstanceBoundary {
  readonly testTarget: string;
  readonly avoidedTarget: string;
}

export const instanceBoundary: InstanceBoundary = {
  testTarget: "Rendered DOM and observable behavior",
  avoidedTarget: "Private component instance state or implementation methods",
};

// Function components do not expose an instance API that should be
// treated as the normal testing surface.

// ---------------------------------------------------------------------
// 72. Screen and callback behavior
// ---------------------------------------------------------------------

export const CallbackButton: FC<{
  readonly onSave: () => void;
}> = ({ onSave }): ReactElement => {
  return (
    <button type="button" onClick={onSave}>
      Save
    </button>
  );
};

// Example:
//
// render(<CallbackButton onSave={handleSave} />);
//
// screen.getByRole(
//     "button",
//     {name: "Save"},
// );
//
// The query finds the control; an interaction utility would perform the click.

// ---------------------------------------------------------------------
// 73. Screen and forms
// ---------------------------------------------------------------------

export const CheckoutForm: FC = (): ReactElement => {
  return (
    <form>
      <label htmlFor="address">Address</label>
      <input id="address" />

      <button type="submit">Place order</button>
    </form>
  );
};

// Example:
//
// render(<CheckoutForm />);
//
// screen.getByRole(
//     "textbox",
//     {name: "Address"},
// );
//
// screen.getByRole(
//     "button",
//     {name: "Place order"},
// );

// `screen` exposes the controls that an actual user would interact with.

// ---------------------------------------------------------------------
// 74. Screen and rendered lists
// ---------------------------------------------------------------------

export const NavigationList: FC = (): ReactElement => {
  return (
    <nav aria-label="Products">
      <ul>
        <li>
          <a href="/one">One</a>
        </li>
        <li>
          <a href="/two">Two</a>
        </li>
        <li>
          <a href="/three">Three</a>
        </li>
      </ul>
    </nav>
  );
};

// Example:
//
// render(<NavigationList />);
//
// const links = screen.getAllByRole("link");
//
// `getAllByRole` is appropriate when the multiplicity of matching
// elements is itself part of the behavior being verified.

// ---------------------------------------------------------------------
// 75. Screen and exact matching
// ---------------------------------------------------------------------

export const ExactTextExample: FC = (): ReactElement => {
  return <p>Product saved successfully.</p>;
};

// Queries can use exact matching by default:
//
// screen.getByText("Product saved successfully.");
//
// Matching options can be configured when a broader or narrower
// text match is specifically required.

// ---------------------------------------------------------------------
// 76. Screen and regular expressions
// ---------------------------------------------------------------------

export const RegexTextExample: FC = (): ReactElement => {
  return <p>Product saved successfully.</p>;
};

// A regular expression can be useful for flexible text matching:
//
// screen.getByText(/product saved/i);
//
// Use flexible matching when the behavior genuinely permits variation;
// do not make queries unnecessarily broad.

// ---------------------------------------------------------------------
// 77. Screen and text content
// ---------------------------------------------------------------------

export const TextContentExample: FC = (): ReactElement => {
  return <button type="button">Save changes</button>;
};

// A text query can find visible text:
//
// screen.getByText("Save changes");
//
// But for an interactive button, the role query is often more expressive:
//
// screen.getByRole(
//     "button",
//     {name: "Save changes"},
// );

// ---------------------------------------------------------------------
// 78. Screen query selection
// ---------------------------------------------------------------------

export interface QuerySelectionRule {
  readonly query: string;
  readonly use: string;
}

export const querySelectionRules: readonly QuerySelectionRule[] = [
  {
    query: "getByRole",
    use: "Semantic elements and interactive controls",
  },
  {
    query: "getByLabelText",
    use: "Form controls associated with labels",
  },
  {
    query: "getByText",
    use: "Visible text content",
  },
  {
    query: "getByDisplayValue",
    use: "Current value of a form control",
  },
  {
    query: "getByAltText",
    use: "Alternative text such as image descriptions",
  },
  {
    query: "getByTitle",
    use: "Elements identified by a title attribute",
  },
  {
    query: "getByPlaceholderText",
    use: "Controls identified by placeholder text",
  },
  {
    query: "getByTestId",
    use: "Targets that require an explicit test identifier",
  },
];

// Query selection should follow the behavior being tested.

// ---------------------------------------------------------------------
// 79. Screen and asynchronous tests
// ---------------------------------------------------------------------

export interface AsyncScreenFlow {
  readonly step: string;
  readonly operation: string;
}

export const asyncScreenFlow: readonly AsyncScreenFlow[] = [
  {
    step: "Arrange",
    operation: "render(<Component />)",
  },
  {
    step: "Wait",
    operation: "await screen.findByRole(...)",
  },
  {
    step: "Assert",
    operation: "Verify the resolved UI state",
  },
];

// `findBy` is the screen-based query family for asynchronous appearance.

// ---------------------------------------------------------------------
// 80. Screen and absence assertions
// ---------------------------------------------------------------------

export interface AbsenceFlow {
  readonly step: string;
  readonly operation: string;
}

export const absenceFlow: readonly AbsenceFlow[] = [
  {
    step: "Arrange",
    operation: "render(<Component />)",
  },
  {
    step: "Query",
    operation: "screen.queryByRole(...)",
  },
  {
    step: "Assert",
    operation: "Verify that the result is null",
  },
];

// `queryBy` allows the test to observe that no matching element exists.

// ---------------------------------------------------------------------
// 81. Screen and multiple elements
// ---------------------------------------------------------------------

export interface MultipleFlow {
  readonly step: string;
  readonly operation: string;
}

export const multipleFlow: readonly MultipleFlow[] = [
  {
    step: "Arrange",
    operation: "render(<Component />)",
  },
  {
    step: "Query",
    operation: "screen.getAllByRole(...)",
  },
  {
    step: "Assert",
    operation: "Verify the collection and its relevant elements",
  },
];

// `getAllBy` expresses that multiple matching elements are expected.

// ---------------------------------------------------------------------
// 82. Screen and nested regions
// ---------------------------------------------------------------------

export const RegionExample: FC = (): ReactElement => {
  return (
    <main>
      <section aria-label="Primary">
        <button type="button">Open</button>
      </section>
      <section aria-label="Secondary">
        <button type="button">Open</button>
      </section>
    </main>
  );
};

// `screen` can identify the regions:
//
// const primary = screen.getByRole(
//     "region",
//     {name: "Primary"},
// );
//
// A scoped query can then identify the correct "Open" button.

// ---------------------------------------------------------------------
// 83. Screen and semantic structure
// ---------------------------------------------------------------------

export interface SemanticStructure {
  readonly structure: string;
  readonly testingBenefit: string;
}

export const semanticStructure: readonly SemanticStructure[] = [
  {
    structure: "Headings",
    testingBenefit: "Can be located by heading role and accessible name",
  },
  {
    structure: "Buttons",
    testingBenefit: "Can be located by button role and accessible name",
  },
  {
    structure: "Links",
    testingBenefit: "Can be located by link role and accessible name",
  },
  {
    structure: "Form controls",
    testingBenefit: "Can be located by role or label",
  },
];

// Good semantic HTML creates useful query targets without test-specific markup.

// ---------------------------------------------------------------------
// 84. Screen and test-specific markup
// ---------------------------------------------------------------------

export const TestAttributeExample: FC = (): ReactElement => {
  return <section data-testid="results">Results</section>;
};

// Example:
//
// render(<TestAttributeExample />);
//
// screen.getByTestId("results");
//
// A test ID can be appropriate when no better semantic query describes
// the element or when the element represents a non-user-facing test boundary.

// ---------------------------------------------------------------------
// 85. Screen and implementation resilience
// ---------------------------------------------------------------------

export interface ResilienceExample {
  readonly change: string;
  readonly effect: string;
}

export const resilienceExamples: readonly ResilienceExample[] = [
  {
    change: "Replace a `<button>` implementation while preserving accessible behavior",
    effect: "A semantic query can remain stable when the user-facing contract remains stable",
  },
  {
    change: "Rename an internal CSS class",
    effect: "A semantic query is unaffected",
  },
  {
    change: "Change an internal component decomposition",
    effect: "A document-level query can remain unchanged",
  },
];

// Querying the observable contract reduces coupling to implementation structure.

// ---------------------------------------------------------------------
// 86. Screen and over-specific queries
// ---------------------------------------------------------------------

export interface OverSpecificQuery {
  readonly approach: string;
  readonly issue: string;
}

export const overSpecificQueries: readonly OverSpecificQuery[] = [
  {
    approach: "Query an internal CSS class",
    issue: "The test depends on styling implementation",
  },
  {
    approach: "Query a generated DOM structure",
    issue: "The test depends on markup details that may not matter to users",
  },
  {
    approach: "Query private component state",
    issue: "The test bypasses the rendered UI contract",
  },
];

// The goal is not to avoid all DOM details, but to choose the most meaningful
// observable contract for the behavior under test.

// ---------------------------------------------------------------------
// 87. Screen and meaningful boundaries
// ---------------------------------------------------------------------

export interface MeaningfulBoundary {
  readonly boundary: string;
  readonly queryStrategy: string;
}

export const meaningfulBoundaries: readonly MeaningfulBoundary[] = [
  {
    boundary: "A form",
    queryStrategy: "Labels, roles, and accessible names",
  },
  {
    boundary: "A navigation area",
    queryStrategy: "Navigation and link roles",
  },
  {
    boundary: "An alert",
    queryStrategy: "Alert role and message",
  },
  {
    boundary: "A list",
    queryStrategy: "List and listitem roles",
  },
];

// Query strategy should follow the semantic boundary exposed by the UI.

// ---------------------------------------------------------------------
// 88. Screen and role availability
// ---------------------------------------------------------------------

export const RoleExample: FC = (): ReactElement => {
  return <button type="button">Continue</button>;
};

// The role is determined by the rendered element and its accessibility semantics.
//
// render(<RoleExample />);
//
// screen.getByRole(
//     "button",
//     {name: "Continue"},
// );

// Avoid inventing roles in tests that do not correspond to the rendered UI.

// ---------------------------------------------------------------------
// 89. Screen and custom roles
// ---------------------------------------------------------------------

export const CustomRoleExample: FC = (): ReactElement => {
  return <div role="status">Processing</div>;
};

// The explicit role becomes part of the rendered accessibility semantics:
//
// render(<CustomRoleExample />);
//
// screen.getByRole(
//     "status",
//     {name: "Processing"},
// );

// Use explicit ARIA roles only when they are appropriate for the component's semantics.

// ---------------------------------------------------------------------
// 90. Screen and invalid semantics
// ---------------------------------------------------------------------

export const InvalidSemanticExample: FC = (): ReactElement => {
  return (
    <div>
      <button type="button">Continue</button>
    </div>
  );
};

// The button already has an appropriate native role.
// Adding an unnecessary custom role would make the markup harder to reason about.
//
// Prefer:
//
// <button type="button">Continue</button>
//
// over replacing its native semantics with an unrelated role.

// ---------------------------------------------------------------------
// 91. Screen and the rendered document
// ---------------------------------------------------------------------

export interface ScreenDocumentModel {
  readonly source: string;
  readonly target: string;
}

export const screenDocumentModel: ScreenDocumentModel = {
  source: "Rendered React tree",
  target: "DOM document exposed to Testing Library queries",
};

// `screen` operates on the rendered document rather than directly on
// React elements or component definitions.

// ---------------------------------------------------------------------
// 92. Screen and test independence
// ---------------------------------------------------------------------

export interface ScreenIsolation {
  readonly rule: string;
  readonly reason: string;
}

export const screenIsolation: readonly ScreenIsolation[] = [
  {
    rule: "Render the required UI within each test",
    reason: "The query results belong to that test's setup",
  },
  {
    rule: "Do not depend on stale rendered output",
    reason: "Tests should remain independent",
  },
];

// The screen queries should reflect the state established by the current test.

// ---------------------------------------------------------------------
// 93. Screen and cleanup
// ---------------------------------------------------------------------

export interface ScreenCleanup {
  readonly behavior: string;
  readonly implication: string;
}

export const screenCleanup: ScreenCleanup = {
  behavior: "The rendered tree is cleaned up between tests",
  implication: "Later tests should not find elements from earlier renders",
};

// Automatic cleanup is normally provided by the testing environment setup.

// ---------------------------------------------------------------------
// 94. Screen and debug workflow
// ---------------------------------------------------------------------

export interface DebugWorkflow {
  readonly step: string;
  readonly action: string;
}

export const debugWorkflow: readonly DebugWorkflow[] = [
  {
    step: "Render",
    action: "Create the component's UI",
  },
  {
    step: "Query",
    action: "Try the intended screen query",
  },
  {
    step: "Debug",
    action: "Inspect the rendered DOM if the query does not behave as expected",
  },
  {
    step: "Fix",
    action: "Correct the component or test based on the observed behavior",
  },
];

// Debugging should support understanding the rendered output,
// not replace assertions.

// ---------------------------------------------------------------------
// 95. Screen and complete example
// ---------------------------------------------------------------------

export const ProfileSummary: FC = (): ReactElement => {
  return (
    <section aria-label="Profile">
      <h1>John Doe</h1>
      <p>Member</p>
      <button type="button">Edit profile</button>
    </section>
  );
};

// Conceptual test:
//
// render(<ProfileSummary />);
//
// screen.getByRole(
//     "region",
//     {name: "Profile"},
// );
//
// screen.getByRole(
//     "heading",
//     {name: "John Doe"},
// );
//
// screen.getByText("Member");
//
// screen.getByRole(
//     "button",
//     {name: "Edit profile"},
// );
//
// Each query identifies an observable part of the rendered profile UI.

// ---------------------------------------------------------------------
// 96. Screen checklist
// ---------------------------------------------------------------------

export interface ScreenChecklistItem {
  readonly item: string;
}

export const screenChecklist: readonly ScreenChecklistItem[] = [
  {
    item: "Render the component before querying its output",
  },
  {
    item: "Use `screen` for most document-level queries",
  },
  {
    item: "Prefer semantic and accessible queries",
  },
  {
    item: "Use `getBy` when one matching element should already exist",
  },
  {
    item: "Use `queryBy` when the expected result may be absent",
  },
  {
    item: "Use `findBy` when the expected result appears asynchronously",
  },
  {
    item: "Use `getAllBy`, `queryAllBy`, or `findAllBy` when multiple elements are expected",
  },
  {
    item: "Use scoped queries when the same target appears in multiple regions",
  },
  {
    item: "Use test IDs when a meaningful semantic query is not available",
  },
  {
    item: "Use `screen.debug()` to inspect rendered output during development",
  },
];

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - `screen` provides Testing Library queries bound to the current rendered document.
// - A component must be rendered before its output can be queried through `screen`.
// - `screen` allows tests to query the rendered UI without passing a container reference to every query.
// - `getByRole` is often the preferred query for semantic elements and interactive controls.
// - Accessible names make role queries specific and describe how users identify elements.
// - `getByLabelText` is useful for form controls associated with visible labels.
// - `getByText` is useful when visible text itself is the behavior being verified.
// - `getByPlaceholderText`, `getByDisplayValue`, `getByAltText`, and `getByTitle` target specific observable properties.
// - `getByTestId` is a useful fallback when the target does not have a suitable user-facing semantic.
// - `getBy` queries expect one matching element and throw when the expected match is not found or is ambiguous.
// - `queryBy` queries return `null` when no matching element exists and are therefore useful for absence checks.
// - `findBy` queries wait asynchronously for one matching element to appear.
// - `getAllBy`, `queryAllBy`, and `findAllBy` handle scenarios where multiple matching elements are expected.
// - `screen.debug()` prints rendered DOM for diagnosis but does not perform an assertion.
// - `within` can scope queries to a particular rendered subtree when multiple regions contain similar elements.
// - Semantic queries generally reduce coupling to CSS classes, DOM structure, and internal component decomposition.
// - Query choice should reflect the observable behavior that matters to the test.
// - Accessibility state such as selected, checked, expanded, pressed, or current can be expressed through supported role-query options.
// - `screen` queries the rendered DOM rather than React component instances or private component state.
// - Rendered component trees can be queried across nested component boundaries because `screen` operates on the resulting document.
// - Test-specific attributes should be used deliberately rather than as the default query strategy.
// - `screen` is a query surface; interactions and assertions are separate testing responsibilities.
