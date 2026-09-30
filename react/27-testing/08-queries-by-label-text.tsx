/**
 * Queries by Label Text
 * =====================
 *
 * Testing Library's label-text queries locate form controls through their associated labels.
 * They are especially useful for inputs, textareas, selects, and other controls whose accessible
 * identity is communicated through a visible label.
 */

// ---------------------------------------------------------------------
// 1. Basic label-text query
// ---------------------------------------------------------------------

export const EmailField = (): React.ReactElement => {
  return (
    <label>
      Email
      <input type="email" />
    </label>
  );
};

// A typical test:
//
// render(<EmailField />);
//
// screen.getByLabelText("Email");
//
// The query finds the form control associated with the "Email" label.

// ---------------------------------------------------------------------
// 2. Explicit label association
// ---------------------------------------------------------------------

export const PasswordField = (): React.ReactElement => {
  return (
    <>
      <label htmlFor="password">Password</label>
      <input id="password" type="password" />
    </>
  );
};

// The label and input are connected through `htmlFor` and `id`:
//
// screen.getByLabelText("Password");
//
// This is an explicit label-control association.

// ---------------------------------------------------------------------
// 3. Implicit label association
// ---------------------------------------------------------------------

export const NameField = (): React.ReactElement => {
  return (
    <label>
      Name
      <input type="text" />
    </label>
  );
};

// The input is nested inside the label:
//
// screen.getByLabelText("Name");
//
// The label relationship is implicit because the control is contained by the label.

// ---------------------------------------------------------------------
// 4. Explicit versus implicit association
// ---------------------------------------------------------------------

export const ExplicitField = (): React.ReactElement => {
  return (
    <>
      <label htmlFor="email">Email</label>
      <input id="email" type="email" />
    </>
  );
};

export const ImplicitField = (): React.ReactElement => {
  return (
    <label>
      Email
      <input type="email" />
    </label>
  );
};

// Both forms allow:
//
// screen.getByLabelText("Email");
//
// Explicit association uses matching `htmlFor` and `id` values.
// Implicit association places the control inside the label.

// ---------------------------------------------------------------------
// 5. Why label-text queries are useful
// ---------------------------------------------------------------------

export interface LabelQueryBenefit {
  readonly benefit: string;
  readonly explanation: string;
}

export const labelQueryBenefits: readonly LabelQueryBenefit[] = [
  {
    benefit: "User-oriented",
    explanation: "The query identifies a control through its visible label",
  },
  {
    benefit: "Accessible",
    explanation: "The label contributes to the control's accessible name",
  },
  {
    benefit: "Implementation-resistant",
    explanation: "The test does not need a CSS selector or internal class name",
  },
];

// A label-text query expresses the relationship a user sees between
// a form label and the control it describes.

// ---------------------------------------------------------------------
// 6. Text input
// ---------------------------------------------------------------------

export const UsernameField = (): React.ReactElement => {
  return (
    <label>
      Username
      <input type="text" />
    </label>
  );
};

// Example:
//
// screen.getByLabelText("Username");

// ---------------------------------------------------------------------
// 7. Email input
// ---------------------------------------------------------------------

export const ContactEmailField = (): React.ReactElement => {
  return (
    <label>
      Contact email
      <input type="email" />
    </label>
  );
};

// Example:
//
// screen.getByLabelText("Contact email");

// The input type does not change how the label is queried.

// ---------------------------------------------------------------------
// 8. Password input
// ---------------------------------------------------------------------

export const AccountPasswordField = (): React.ReactElement => {
  return (
    <label>
      Password
      <input type="password" />
    </label>
  );
};

// Example:
//
// screen.getByLabelText("Password");

// ---------------------------------------------------------------------
// 9. Number input
// ---------------------------------------------------------------------

export const QuantityField = (): React.ReactElement => {
  return (
    <label>
      Quantity
      <input type="number" />
    </label>
  );
};

// Example:
//
// screen.getByLabelText("Quantity");

// ---------------------------------------------------------------------
// 10. Search input
// ---------------------------------------------------------------------

export const SearchField = (): React.ReactElement => {
  return (
    <label>
      Search
      <input type="search" />
    </label>
  );
};

// Example:
//
// screen.getByLabelText("Search");

// A visible label provides a stronger testing contract than relying only
// on a placeholder such as "Search products".

// ---------------------------------------------------------------------
// 11. Textarea
// ---------------------------------------------------------------------

export const MessageField = (): React.ReactElement => {
  return (
    <label>
      Message
      <textarea />
    </label>
  );
};

// Example:
//
// screen.getByLabelText("Message");

// `getByLabelText` can locate textarea controls as well as inputs.

// ---------------------------------------------------------------------
// 12. Select
// ---------------------------------------------------------------------

export const CountryField = (): React.ReactElement => {
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
// screen.getByLabelText("Country");

// The label identifies the select control.

// ---------------------------------------------------------------------
// 13. Checkbox
// ---------------------------------------------------------------------

export const NewsletterField = (): React.ReactElement => {
  return (
    <label>
      Receive updates
      <input type="checkbox" />
    </label>
  );
};

// Example:
//
// screen.getByLabelText("Receive updates");

// ---------------------------------------------------------------------
// 14. Radio button
// ---------------------------------------------------------------------

export const DeliveryField = (): React.ReactElement => {
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

// Each radio button has its own label:
//
// screen.getByLabelText("Standard");
// screen.getByLabelText("Express");

// ---------------------------------------------------------------------
// 15. Multiple controls with different labels
// ---------------------------------------------------------------------

export const LoginFields = (): React.ReactElement => {
  return (
    <form>
      <label htmlFor="username">Username</label>
      <input id="username" />

      <label htmlFor="password">Password</label>
      <input id="password" type="password" />
    </form>
  );
};

// Each label identifies a different control:
//
// screen.getByLabelText("Username");
// screen.getByLabelText("Password");

// ---------------------------------------------------------------------
// 16. Label text must match the label
// ---------------------------------------------------------------------

export const AddressField = (): React.ReactElement => {
  return (
    <label>
      Street address
      <input type="text" />
    </label>
  );
};

// The visible label is "Street address":
//
// screen.getByLabelText("Street address");
//
// A query for an unrelated string does not identify the control:
//
// screen.getByLabelText("Address");

// ---------------------------------------------------------------------
// 17. Case-sensitive matching
// ---------------------------------------------------------------------

export const CaseSensitiveLabel = (): React.ReactElement => {
  return (
    <label>
      Email address
      <input type="email" />
    </label>
  );
};

// Exact string matching is case-sensitive by default:
//
// screen.getByLabelText("Email address");

// A different capitalization is not automatically the same exact string.

// ---------------------------------------------------------------------
// 18. Regular-expression matching
// ---------------------------------------------------------------------

export const FlexibleLabel = (): React.ReactElement => {
  return (
    <label>
      Email address
      <input type="email" />
    </label>
  );
};

// A regular expression can allow flexible matching:
//
// screen.getByLabelText(/email address/i);

// The `i` flag makes the match case-insensitive.

// ---------------------------------------------------------------------
// 19. Exact matching
// ---------------------------------------------------------------------

export const SimilarLabels = (): React.ReactElement => {
  return (
    <form>
      <label>
        Email
        <input type="email" />
      </label>

      <label>
        Email address
        <input type="email" />
      </label>
    </form>
  );
};

// An exact query targets only "Email":
//
// screen.getByLabelText(
//     "Email",
//     {exact: true},
// );

// Avoid broad matching when several labels can satisfy the same expression.

// ---------------------------------------------------------------------
// 20. Non-exact matching
// ---------------------------------------------------------------------

export const NonExactLabel = (): React.ReactElement => {
  return (
    <label>
      Email address
      <input type="email" />
    </label>
  );
};

// A non-exact query can match text containing the requested string:
//
// screen.getByLabelText(
//     "Email",
//     {exact: false},
// );

// Use this deliberately because broader matching can produce ambiguity.

// ---------------------------------------------------------------------
// 21. Label with additional text
// ---------------------------------------------------------------------

export const RequiredEmailField = (): React.ReactElement => {
  return (
    <label>
      Email
      <span> (required)</span>
      <input type="email" />
    </label>
  );
};

// The label's accessible text includes its relevant label content:
//
// screen.getByLabelText(/email/i);

// A regular expression can be useful when additional label text is present.

// ---------------------------------------------------------------------
// 22. Label containing nested elements
// ---------------------------------------------------------------------

export const NestedLabel = (): React.ReactElement => {
  return (
    <label>
      <span>Email address</span>
      <input type="email" />
    </label>
  );
};

// The label can contain markup while still labeling the input:
//
// screen.getByLabelText("Email address");

// The query operates on the label's associated text rather than requiring
// the label to be a single text node.

// ---------------------------------------------------------------------
// 23. Explicit association with nested label content
// ---------------------------------------------------------------------

export const ExplicitNestedLabel = (): React.ReactElement => {
  return (
    <>
      <label htmlFor="email">
        <span>Email address</span>
      </label>

      <input id="email" type="email" />
    </>
  );
};

// Example:
//
// screen.getByLabelText("Email address");

// The control does not need to be physically nested inside the label
// when an explicit association is provided.

// ---------------------------------------------------------------------
// 24. Label text versus placeholder text
// ---------------------------------------------------------------------

export const LabeledSearch = (): React.ReactElement => {
  return (
    <label>
      Search
      <input type="search" placeholder="Search products" />
    </label>
  );
};

// Prefer the label when one exists:
//
// screen.getByLabelText("Search");
//
// rather than:
//
// screen.getByPlaceholderText("Search products");

// The label represents the control's persistent identity;
// a placeholder usually provides supplementary input guidance.

// ---------------------------------------------------------------------
// 25. Label text versus role
// ---------------------------------------------------------------------

export const RoleAndLabel = (): React.ReactElement => {
  return (
    <label>
      Email
      <input type="email" />
    </label>
  );
};

// Both queries can identify the control:
//
// screen.getByLabelText("Email");
//
// screen.getByRole(
//     "textbox",
//     {name: "Email"},
// );

// `getByLabelText` directly expresses the label-control relationship,
// while `getByRole` expresses the control's accessible role and name.

// ---------------------------------------------------------------------
// 26. Choosing between label and role
// ---------------------------------------------------------------------

export interface FormQueryChoice {
  readonly query: string;
  readonly focus: string;
}

export const formQueryChoices: readonly FormQueryChoice[] = [
  {
    query: 'screen.getByLabelText("Email")',
    focus: "The label associated with the form control",
  },
  {
    query: 'screen.getByRole("textbox", {name: "Email"})',
    focus: "The control's semantic role and accessible name",
  },
];

// Both can be appropriate.
// Choose the query that most clearly expresses the behavior under test.

// ---------------------------------------------------------------------
// 27. Accessible name from a label
// ---------------------------------------------------------------------

export const AccessibleLabel = (): React.ReactElement => {
  return (
    <label>
      Email
      <input type="email" />
    </label>
  );
};

// The label contributes to the input's accessible name:
//
// screen.getByRole(
//     "textbox",
//     {name: "Email"},
// );
//
// The same relationship can be targeted directly:
//
// screen.getByLabelText("Email");

// ---------------------------------------------------------------------
// 28. aria-label without visible label
// ---------------------------------------------------------------------

export const AriaLabelledInput = (): React.ReactElement => {
  return <input type="search" aria-label="Search" />;
};

// `aria-label` provides an accessible name:
//
// screen.getByRole(
//     "searchbox",
//     {name: "Search"},
// );

// `getByLabelText("Search")` is not the primary query for this example
// because there is no associated visible label element.

// Prefer a visible `<label>` when a visible label is appropriate.

// ---------------------------------------------------------------------
// 29. aria-labelledby
// ---------------------------------------------------------------------

export const LabelledInput = (): React.ReactElement => {
  return (
    <>
      <span id="email-label">Email</span>

      <input type="email" aria-labelledby="email-label" />
    </>
  );
};

// The referenced text contributes to the accessible name:
//
// screen.getByRole(
//     "textbox",
//     {name: "Email"},
// );

// This is an accessible naming relationship rather than a `<label>` element.

// ---------------------------------------------------------------------
// 30. Label text is not arbitrary text
// ---------------------------------------------------------------------

export const DescriptiveText = (): React.ReactElement => {
  return (
    <>
      <p>Email address for account notifications.</p>

      <input type="email" aria-label="Email" />
    </>
  );
};

// The paragraph describes the control but does not label it:
//
// screen.getByLabelText(
//     "Email address for account notifications.",
// );
//
// should not be treated as equivalent to an actual label relationship.

// Use an actual `<label>` when the text is intended to label the control.

// ---------------------------------------------------------------------
// 31. Explicit label association and unique IDs
// ---------------------------------------------------------------------

export const UniqueLabelIds = (): React.ReactElement => {
  return (
    <form>
      <label htmlFor="email">Email</label>
      <input id="email" type="email" />

      <label htmlFor="phone">Phone</label>
      <input id="phone" type="tel" />
    </form>
  );
};

// Unique IDs keep explicit label associations unambiguous:
//
// screen.getByLabelText("Email");
// screen.getByLabelText("Phone");

// ---------------------------------------------------------------------
// 32. Duplicate labels
// ---------------------------------------------------------------------

export const DuplicateLabels = (): React.ReactElement => {
  return (
    <form>
      <label>
        Name
        <input type="text" />
      </label>

      <label>
        Name
        <input type="text" />
      </label>
    </form>
  );
};

// This query is ambiguous:
//
// screen.getByLabelText("Name");
//
// When multiple controls intentionally share a label, use an appropriate
// strategy to distinguish them rather than expecting one result.

// ---------------------------------------------------------------------
// 33. queryByLabelText
// ---------------------------------------------------------------------

export const OptionalEmail = ({ showEmail }: { readonly showEmail: boolean }): React.ReactElement | null => {
  if (!showEmail) {
    return null;
  }

  return (
    <label>
      Email
      <input type="email" />
    </label>
  );
};

// Example:
//
// render(<OptionalEmail showEmail={false} />);
//
// screen.queryByLabelText("Email");
//
// `queryByLabelText` returns `null` when no matching labeled control exists.

// ---------------------------------------------------------------------
// 34. findByLabelText
// ---------------------------------------------------------------------

export interface AsyncLabelExample {
  readonly query: string;
  readonly behavior: string;
}

export const asyncLabelExample: AsyncLabelExample = {
  query: 'screen.findByLabelText("Email")',
  behavior: "Wait for one labeled control to appear asynchronously",
};

// Conceptually:
//
// render(<AsyncForm />);
//
// const email = await screen.findByLabelText("Email");
//
// `findByLabelText` is appropriate when the labeled control appears later.

// ---------------------------------------------------------------------
// 35. getAllByLabelText
// ---------------------------------------------------------------------

export const RepeatedLabelFields = (): React.ReactElement => {
  return (
    <form>
      <label>
        Tag
        <input type="text" />
      </label>

      <label>
        Tag
        <input type="text" />
      </label>
    </form>
  );
};

// Example:
//
// const fields = screen.getAllByLabelText("Tag");
//
// `getAllByLabelText` returns every matching labeled control.

// ---------------------------------------------------------------------
// 36. queryAllByLabelText
// ---------------------------------------------------------------------

export interface QueryAllLabelExample {
  readonly query: string;
  readonly result: string;
}

export const queryAllLabelExample: QueryAllLabelExample = {
  query: 'screen.queryAllByLabelText("Tag")',
  result: "An array containing every matching control, or an empty array",
};

// Use this variant when zero or more matching labeled controls are valid.

// ---------------------------------------------------------------------
// 37. findAllByLabelText
// ---------------------------------------------------------------------

export interface FindAllLabelExample {
  readonly query: string;
  readonly behavior: string;
}

export const findAllLabelExample: FindAllLabelExample = {
  query: 'screen.findAllByLabelText("Tag")',
  behavior: "Wait for multiple labeled controls to appear",
};

// This is the asynchronous counterpart to `getAllByLabelText`.

// ---------------------------------------------------------------------
// 38. Query family
// ---------------------------------------------------------------------

export interface LabelQueryFamily {
  readonly query: string;
  readonly expectedResult: string;
}

export const labelQueryFamilies: readonly LabelQueryFamily[] = [
  {
    query: "getByLabelText",
    expectedResult: "Exactly one matching control",
  },
  {
    query: "queryByLabelText",
    expectedResult: "Zero or one matching control",
  },
  {
    query: "findByLabelText",
    expectedResult: "One matching control asynchronously",
  },
  {
    query: "getAllByLabelText",
    expectedResult: "One or more matching controls",
  },
  {
    query: "queryAllByLabelText",
    expectedResult: "Zero or more matching controls",
  },
  {
    query: "findAllByLabelText",
    expectedResult: "Multiple matching controls asynchronously",
  },
];

// The query family describes both expected cardinality and timing.

// ---------------------------------------------------------------------
// 39. Label text and checkbox groups
// ---------------------------------------------------------------------

export const NotificationPreferences = (): React.ReactElement => {
  return (
    <fieldset>
      <legend>Notifications</legend>

      <label>
        Email notifications
        <input type="checkbox" />
      </label>

      <label>
        SMS notifications
        <input type="checkbox" />
      </label>
    </fieldset>
  );
};

// Each control has its own label:
//
// screen.getByLabelText("Email notifications");
// screen.getByLabelText("SMS notifications");

// ---------------------------------------------------------------------
// 40. Label text and radio groups
// ---------------------------------------------------------------------

export const ShippingOptions = (): React.ReactElement => {
  return (
    <fieldset>
      <legend>Shipping method</legend>

      <label>
        Standard shipping
        <input type="radio" name="shipping" value="standard" />
      </label>

      <label>
        Express shipping
        <input type="radio" name="shipping" value="express" />
      </label>
    </fieldset>
  );
};

// Each radio can be located through its individual label:
//
// screen.getByLabelText("Standard shipping");
// screen.getByLabelText("Express shipping");

// ---------------------------------------------------------------------
// 41. Label text and select options
// ---------------------------------------------------------------------

export const LanguageField = (): React.ReactElement => {
  return (
    <label>
      Language
      <select defaultValue="en">
        <option value="en">English</option>
        <option value="de">German</option>
      </select>
    </label>
  );
};

// The label identifies the select:
//
// screen.getByLabelText("Language");
//
// The options themselves are separate elements with their own semantics.

// ---------------------------------------------------------------------
// 42. Label text and required controls
// ---------------------------------------------------------------------

export const RequiredField = (): React.ReactElement => {
  return (
    <label>
      Email
      <input type="email" required />
    </label>
  );
};

// The required attribute does not change how the label query locates the input:
//
// screen.getByLabelText("Email");
//
// A separate assertion can verify the required state.

// ---------------------------------------------------------------------
// 43. Label text and disabled controls
// ---------------------------------------------------------------------

export const DisabledField = (): React.ReactElement => {
  return (
    <label>
      Account ID
      <input type="text" disabled />
    </label>
  );
};

// The disabled control can still be located:
//
// screen.getByLabelText("Account ID");
//
// The query identifies the control; an assertion can verify its disabled state.

// ---------------------------------------------------------------------
// 44. Label text and default values
// ---------------------------------------------------------------------

export const DefaultEmail = (): React.ReactElement => {
  return (
    <label>
      Email
      <input type="email" defaultValue="john@example.com" />
    </label>
  );
};

// The label query identifies the control:
//
// screen.getByLabelText("Email");
//
// A separate value-oriented query can inspect the displayed value.

// ---------------------------------------------------------------------
// 45. Label text and controlled values
// ---------------------------------------------------------------------

export const ControlledEmail = (): React.ReactElement => {
  return (
    <label>
      Email
      <input type="email" value="john@example.com" readOnly />
    </label>
  );
};

// The label relationship remains the same for controlled inputs:
//
// screen.getByLabelText("Email");

// ---------------------------------------------------------------------
// 46. Label text and custom components
// ---------------------------------------------------------------------

export interface FieldProps {
  readonly label: string;
  readonly type?: "text" | "email" | "password";
}

export const Field = ({ label, type = "text" }: FieldProps): React.ReactElement => {
  const id = label.toLowerCase().replace(/\s+/g, "-");

  return (
    <>
      <label htmlFor={id}>{label}</label>
      <input id={id} type={type} />
    </>
  );
};

// A custom React component can preserve the normal label-control contract:
//
// render(<Field label="Email" type="email" />);
//
// screen.getByLabelText("Email");

// The test does not need to know how the field component constructs its markup.

// ---------------------------------------------------------------------
// 47. Label text and reusable field components
// ---------------------------------------------------------------------

export const AccountForm = (): React.ReactElement => {
  return (
    <form>
      <Field label="Name" />
      <Field label="Email" type="email" />
      <Field label="Password" type="password" />
    </form>
  );
};

// The rendered form exposes three labeled controls:
//
// screen.getByLabelText("Name");
// screen.getByLabelText("Email");
// screen.getByLabelText("Password");

// ---------------------------------------------------------------------
// 48. Label text and component boundaries
// ---------------------------------------------------------------------

export const UserDetails = (): React.ReactElement => {
  return (
    <section>
      <Field label="Name" />
      <Field label="Email" type="email" />
    </section>
  );
};

// Label-text queries operate on the final rendered DOM:
//
// screen.getByLabelText("Name");
// screen.getByLabelText("Email");
//
// They do not need to know which component produced the label or input.

// ---------------------------------------------------------------------
// 49. Label text and implementation details
// ---------------------------------------------------------------------

export interface LabelImplementationComparison {
  readonly approach: string;
  readonly dependency: string;
}

export const labelImplementationComparison: readonly LabelImplementationComparison[] = [
  {
    approach: 'screen.getByLabelText("Email")',
    dependency: "Label-control relationship",
  },
  {
    approach: 'screen.getByTestId("email-input")',
    dependency: "Explicit testing attribute",
  },
  {
    approach: 'container.querySelector(".email-input")',
    dependency: "CSS class structure",
  },
];

// The label query expresses a user-facing form contract.

// ---------------------------------------------------------------------
// 50. Label text and placeholder changes
// ---------------------------------------------------------------------

export const StableLabel = (): React.ReactElement => {
  return (
    <label>
      Email
      <input type="email" placeholder="john@example.com" />
    </label>
  );
};

// A placeholder can change without affecting the label query:
//
// screen.getByLabelText("Email");
//
// This makes the label a more stable target when the placeholder is
// merely input guidance.

// ---------------------------------------------------------------------
// 51. Label text and CSS changes
// ---------------------------------------------------------------------

export const StyledField = (): React.ReactElement => {
  return (
    <label className="field-label">
      Email
      <input className="field-input" type="email" />
    </label>
  );
};

// A test does not need to know either class:
//
// screen.getByLabelText("Email");

// Styling changes do not affect the label-control contract.

// ---------------------------------------------------------------------
// 52. Label text and DOM structure
// ---------------------------------------------------------------------

export const StructuredLabel = (): React.ReactElement => {
  return (
    <div>
      <label htmlFor="email">Email</label>
      <div>
        <input id="email" type="email" />
      </div>
    </div>
  );
};

// The input can still be found through its label:
//
// screen.getByLabelText("Email");
//
// The exact DOM nesting between the label and input is not relevant
// when an explicit association is used.

// ---------------------------------------------------------------------
// 53. Label text and hidden labels
// ---------------------------------------------------------------------

export const VisuallyHiddenLabel = (): React.ReactElement => {
  return (
    <label htmlFor="search" className="visually-hidden">
      Search
    </label>
  );
};

// In a real component, the associated input would use:
//
// <input id="search" type="search" />
//
// A visually hidden label can remain available to assistive technology
// while not being visually prominent.

// ---------------------------------------------------------------------
// 54. Label text and accessible forms
// ---------------------------------------------------------------------

export const AccessibleForm = (): React.ReactElement => {
  return (
    <form>
      <label htmlFor="name">Name</label>
      <input id="name" />

      <label htmlFor="email">Email</label>
      <input id="email" type="email" />

      <label htmlFor="country">Country</label>
      <select id="country">
        <option>North Macedonia</option>
        <option>Germany</option>
      </select>
    </form>
  );
};

// A label query can locate each control:
//
// screen.getByLabelText("Name");
// screen.getByLabelText("Email");
// screen.getByLabelText("Country");

// ---------------------------------------------------------------------
// 55. Label text and nested label content
// ---------------------------------------------------------------------

export const RequiredLabel = (): React.ReactElement => {
  return (
    <label>
      Email
      <span aria-hidden="true"> *</span>
      <input type="email" />
    </label>
  );
};

// Decorative label content can be excluded from the accessibility tree:
//
// screen.getByLabelText("Email");

// This keeps the accessible label focused on the meaningful text.

// ---------------------------------------------------------------------
// 56. Label text and ambiguity
// ---------------------------------------------------------------------

export interface LabelAmbiguity {
  readonly problem: string;
  readonly solution: string;
}

export const labelAmbiguity: LabelAmbiguity = {
  problem: "Several controls have the same label",
  solution: "Use a more specific accessible structure or another appropriate query strategy",
};

// A test should not arbitrarily select one of several identically labeled
// controls when the UI itself does not distinguish them.

// ---------------------------------------------------------------------
// 57. Label text and query intent
// ---------------------------------------------------------------------

export interface LabelQueryIntent {
  readonly query: string;
  readonly intent: string;
}

export const labelQueryIntent: readonly LabelQueryIntent[] = [
  {
    query: 'screen.getByLabelText("Email")',
    intent: "Find the form control labeled Email",
  },
  {
    query: 'screen.getByRole("textbox", {name: "Email"})',
    intent: "Find the textbox whose accessible name is Email",
  },
];

// Both queries can locate the same input while expressing slightly different test intent.

// ---------------------------------------------------------------------
// 58. Label text and absence
// ---------------------------------------------------------------------

export const ConditionalPhoneField = ({ visible }: { readonly visible: boolean }): React.ReactElement | null => {
  return visible ? (
    <label>
      Phone
      <input type="tel" />
    </label>
  ) : null;
};

// Example:
//
// render(<ConditionalPhoneField visible={false} />);
//
// screen.queryByLabelText("Phone");
//
// `queryByLabelText` is the appropriate family when absence is expected.

// ---------------------------------------------------------------------
// 59. Label text and asynchronous appearance
// ---------------------------------------------------------------------

export interface AsyncFieldQuery {
  readonly query: string;
  readonly use: string;
}

export const asyncFieldQuery: AsyncFieldQuery = {
  query: 'screen.findByLabelText("Email")',
  use: "A labeled control that appears asynchronously",
};

// Example:
//
// const email = await screen.findByLabelText("Email");
//
// The query waits for the control to appear instead of requiring it
// to exist synchronously.

// ---------------------------------------------------------------------
// 60. Label text and multiple controls
// ---------------------------------------------------------------------

export const MultipleEmailFields = (): React.ReactElement => {
  return (
    <form>
      <label htmlFor="primary-email">Primary email</label>
      <input id="primary-email" type="email" />

      <label htmlFor="secondary-email">Secondary email</label>
      <input id="secondary-email" type="email" />
    </form>
  );
};

// Distinct labels allow precise queries:
//
// screen.getByLabelText("Primary email");
// screen.getByLabelText("Secondary email");

// ---------------------------------------------------------------------
// 61. Label text and form semantics
// ---------------------------------------------------------------------

export interface FormSemanticContract {
  readonly element: string;
  readonly relationship: string;
}

export const formSemanticContracts: readonly FormSemanticContract[] = [
  {
    element: "<label>",
    relationship: "Provides the control's visible label",
  },
  {
    element: "<input>",
    relationship: "Receives the associated label",
  },
  {
    element: "<textarea>",
    relationship: "Receives the associated label",
  },
  {
    element: "<select>",
    relationship: "Receives the associated label",
  },
];

// A proper label-control relationship provides both accessibility and
// a strong Testing Library query target.

// ---------------------------------------------------------------------
// 62. Label text and fieldset legends
// ---------------------------------------------------------------------

export const PaymentMethod = (): React.ReactElement => {
  return (
    <fieldset>
      <legend>Payment method</legend>

      <label>
        Card
        <input type="radio" name="payment" />
      </label>

      <label>
        Bank transfer
        <input type="radio" name="payment" />
      </label>
    </fieldset>
  );
};

// The legend describes the group:
//
// screen.getByText("Payment method");
//
// Each individual control is still located by its label:
//
// screen.getByLabelText("Card");
// screen.getByLabelText("Bank transfer");

// ---------------------------------------------------------------------
// 63. Label text and grouped context
// ---------------------------------------------------------------------

export interface GroupedFieldContext {
  readonly group: string;
  readonly control: string;
}

export const groupedFieldContext: readonly GroupedFieldContext[] = [
  {
    group: "Payment method",
    control: "Card",
  },
  {
    group: "Payment method",
    control: "Bank transfer",
  },
];

// `getByLabelText` identifies the individual labeled control;
// group context can be queried separately when relevant.

// ---------------------------------------------------------------------
// 64. Label text and required indicators
// ---------------------------------------------------------------------

export const RequiredIndicator = (): React.ReactElement => {
  return (
    <label>
      Email
      <span aria-hidden="true">*</span>
      <input type="email" required />
    </label>
  );
};

// The decorative asterisk does not need to become part of the accessible
// label when it is marked `aria-hidden`.
//
// screen.getByLabelText("Email");

// ---------------------------------------------------------------------
// 65. Label text and validation messages
// ---------------------------------------------------------------------

export const InvalidEmailField = (): React.ReactElement => {
  return (
    <div>
      <label htmlFor="email">Email</label>

      <input id="email" type="email" aria-invalid="true" aria-describedby="email-error" />

      <p id="email-error">Enter a valid email address.</p>
    </div>
  );
};

// The control is still located through its label:
//
// screen.getByLabelText("Email");
//
// Validation state and error text are separate observable concerns.

// ---------------------------------------------------------------------
// 66. Label text and description
// ---------------------------------------------------------------------

export const DescribedEmail = (): React.ReactElement => {
  return (
    <div>
      <label htmlFor="email">Email</label>

      <input id="email" type="email" aria-describedby="email-help" />

      <p id="email-help">We will use this address for account notifications.</p>
    </div>
  );
};

// The label identifies the control:
//
// screen.getByLabelText("Email");
//
// The description provides supplementary information and is not the label itself.

// ---------------------------------------------------------------------
// 67. Label text and reusable IDs
// ---------------------------------------------------------------------

export interface FieldAssociation {
  readonly label: string;
  readonly id: string;
}

export const fieldAssociations: readonly FieldAssociation[] = [
  {
    label: "Name",
    id: "name",
  },
  {
    label: "Email",
    id: "email",
  },
  {
    label: "Password",
    id: "password",
  },
];

// Explicit associations should use matching IDs:
//
// <label htmlFor="email">Email</label>
// <input id="email" />

// ---------------------------------------------------------------------
// 68. Label text and component APIs
// ---------------------------------------------------------------------

export interface LabeledInputProps {
  readonly id: string;
  readonly label: string;
}

export const LabeledInput = ({ id, label }: LabeledInputProps): React.ReactElement => {
  return (
    <>
      <label htmlFor={id}>{label}</label>
      <input id={id} />
    </>
  );
};

// The component API preserves the semantic relationship:
//
// render(
//     <LabeledInput
//         id="email"
//         label="Email"
//     />,
// );
//
// screen.getByLabelText("Email");

// ---------------------------------------------------------------------
// 69. Label text and implementation resilience
// ---------------------------------------------------------------------

export interface LabelResilience {
  readonly implementationChange: string;
  readonly effectOnQuery: string;
}

export const labelResilience: readonly LabelResilience[] = [
  {
    implementationChange: "Change the input CSS class",
    effectOnQuery: "The label query remains unchanged",
  },
  {
    implementationChange: "Change surrounding layout markup",
    effectOnQuery: "The query can remain unchanged when the label relationship remains valid",
  },
  {
    implementationChange: "Change the placeholder text",
    effectOnQuery: "The label query remains unchanged",
  },
];

// The query is tied to the semantic label-control contract.

// ---------------------------------------------------------------------
// 70. Label text and test readability
// ---------------------------------------------------------------------

export const ReadableField = (): React.ReactElement => {
  return (
    <label>
      Email
      <input type="email" />
    </label>
  );
};

// Compare:
//
// screen.getByLabelText("Email");
//
// with:
//
// container.querySelector(".email-input");
//
// The first communicates the behavior being tested directly.

// ---------------------------------------------------------------------
// 71. Label text and user perspective
// ---------------------------------------------------------------------

export interface UserPerspectiveExample {
  readonly testCode: string;
  readonly meaning: string;
}

export const userPerspectiveExample: UserPerspectiveExample = {
  testCode: 'screen.getByLabelText("Email")',
  meaning: "Find the form control identified to the user as Email",
};

// The test describes the relationship users encounter in the form.

// ---------------------------------------------------------------------
// 72. Label text and test IDs
// ---------------------------------------------------------------------

export const TestIdAlternative = (): React.ReactElement => {
  return (
    <label>
      Email
      <input type="email" data-testid="email-input" />
    </label>
  );
};

// Both are possible:
//
// screen.getByLabelText("Email");
// screen.getByTestId("email-input");
//
// The label query is usually preferable because the label is meaningful
// user-facing semantics, while the test ID is a testing-specific hook.

// ---------------------------------------------------------------------
// 73. Label text and CSS selectors
// ---------------------------------------------------------------------

export interface QueryComparison {
  readonly query: string;
  readonly coupling: string;
}

export const queryComparison: readonly QueryComparison[] = [
  {
    query: 'screen.getByLabelText("Email")',
    coupling: "Label-control semantics",
  },
  {
    query: 'container.querySelector("input[type=\\"email\\"]")',
    coupling: "DOM implementation",
  },
];

// Label-text queries avoid making the test depend on how the control
// happens to be styled or structured.

// ---------------------------------------------------------------------
// 74. Label text and complete form
// ---------------------------------------------------------------------

export const ProfileForm = (): React.ReactElement => {
  return (
    <form>
      <LabeledInput id="name" label="Name" />

      <LabeledInput id="email" label="Email" />

      <LabeledInput id="phone" label="Phone" />

      <button type="submit">Save profile</button>
    </form>
  );
};

// A label-oriented test can locate each form control:
//
// screen.getByLabelText("Name");
// screen.getByLabelText("Email");
// screen.getByLabelText("Phone");
//
// The submit button is not labeled by a form label, so a role query
// is a more appropriate query for that element.

// ---------------------------------------------------------------------
// 75. Label text query checklist
// ---------------------------------------------------------------------

export interface LabelQueryChecklistItem {
  readonly item: string;
}

export const labelQueryChecklist: readonly LabelQueryChecklistItem[] = [
  {
    item: "Use `getByLabelText` to locate controls through associated labels",
  },
  {
    item: "Use explicit `htmlFor` and `id` associations when appropriate",
  },
  {
    item: "Nested controls can use implicit label association",
  },
  {
    item: "Use the label's visible text as the query target",
  },
  {
    item: "Use a regular expression when flexible label matching is intentional",
  },
  {
    item: "Use `queryByLabelText` when the labeled control may be absent",
  },
  {
    item: "Use `findByLabelText` when the labeled control appears asynchronously",
  },
  {
    item: "Use the `AllByLabelText` variants when multiple labeled controls are expected",
  },
  {
    item: "Prefer labels over placeholders when a persistent form label exists",
  },
  {
    item: "Prefer semantic role queries when they communicate the test intent more clearly",
  },
  {
    item: "Do not confuse descriptive text or placeholders with actual label associations",
  },
  {
    item: "Use test IDs as a fallback rather than the default for labeled controls",
  },
];

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - `getByLabelText` locates form controls through their associated label text.
// - Labels can be associated explicitly with `htmlFor` and `id`.
// - Labels can also be associated implicitly when the control is nested inside the `<label>`.
// - `getByLabelText` is useful for inputs, textareas, selects, checkboxes, and radio buttons.
// - A label contributes to the accessible name of its associated form control.
// - `queryByLabelText` returns `null` when no matching labeled control exists.
// - `findByLabelText` waits asynchronously for one matching labeled control to appear.
// - `getAllByLabelText`, `queryAllByLabelText`, and `findAllByLabelText` handle multiple matching controls.
// - Exact string matching is case-sensitive by default, while regular expressions can provide flexible matching.
// - The `exact` option can control whether string matching should be exact.
// - A visible `<label>` is generally preferable to relying only on placeholder text for identifying a form control.
// - `aria-label` and `aria-labelledby` provide accessible naming but are not the same as a `<label>` element.
// - `getByRole` can often locate the same control through its semantic role and accessible name.
// - Use the query that most clearly expresses the behavior being tested.
// - Duplicate labels can make a single-result query ambiguous and should be distinguished through the UI's semantics or an appropriate query strategy.
// - Label-text queries are generally resilient to changes in CSS classes, placeholders, and unrelated DOM structure.
// - Proper label-control associations improve both accessibility and testability.
