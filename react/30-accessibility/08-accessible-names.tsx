/**
 * Accessible Names
 * ================
 *
 * An accessible name is the short text that identifies an element to assistive
 * technologies. It communicates what an interactive control, form field, landmark,
 * dialog, or other nameable element represents and helps users distinguish it
 * from other elements with the same role.
 *
 * HTML provides many native naming mechanisms, including visible button content,
 * label elements, alt text, legends, captions, and figcaptions. When those mechanisms
 * are insufficient, ARIA provides additional techniques such as aria-label and
 * aria-labelledby. Accessible descriptions are separate from accessible names and
 * provide supplementary information rather than identifying the element itself.
 */

// ---------------------------------------------------------------------
// Imports
// ---------------------------------------------------------------------

import { type FC, type ReactElement } from "react";

// ---------------------------------------------------------------------
// 1. What an accessible name is
// ---------------------------------------------------------------------

// An accessible name is the name exposed to assistive technologies for an
// element that can or should be named.
//
// For a button such as:
//
// <button>Save</button>
//
// the visible text "Save" provides the accessible name.
//
// The name answers:
// "What is this element?"

export const NamedButton: FC = (): ReactElement => {
  return <button type="button">Save</button>;
};

// An accessible description answers a different question:
// "What additional information should the user know about this element?"

// ---------------------------------------------------------------------
// 2. Accessible name vs. accessible description
// ---------------------------------------------------------------------

// The accessible name identifies the element.
// The accessible description supplements that name.
//
// Example:
//
// Name:
// "Username"
//
// Description:
// "Use the username associated with your account."

export const NamedAndDescribedInput: FC = (): ReactElement => {
  return (
    <div>
      <label htmlFor="username">Username</label>

      <input id="username" name="username" type="text" aria-describedby="username-description" />

      <p id="username-description">Use the username associated with your account.</p>
    </div>
  );
};

// The label provides the accessible name.
// aria-describedby associates additional descriptive information.

// ---------------------------------------------------------------------
// 3. Why accessible names matter
// ---------------------------------------------------------------------

// Accessible names help users:
// - understand the purpose of controls;
// - distinguish similar controls;
// - navigate controls using assistive technology;
// - identify form fields;
// - identify dialogs and other named regions.
//
// A control without an appropriate name may expose only its role,
// leaving the user without enough information to understand its purpose.

export const UnnamedAndNamedControls: FC = (): ReactElement => {
  return (
    <div>
      <button type="button">Save</button>

      <button type="button" aria-label="Close dialog">
        ×
      </button>
    </div>
  );
};

// The first button gets its name from visible content.
// The second button gets its name from aria-label because the visible
// character does not adequately identify the action.

// ---------------------------------------------------------------------
// 4. Native HTML naming mechanisms
// ---------------------------------------------------------------------

// HTML already provides several mechanisms for accessible names.
//
// Common examples:
//
// button text       -> button's content
// label + input     -> associated form-control label
// alt on img       -> image's accessible name
// legend            -> fieldset name
// caption           -> table name
// figcaption        -> figure name
//
// Prefer these native mechanisms when they correctly describe the element.

export const NativeNamingExample: FC = (): ReactElement => {
  return (
    <form>
      <fieldset>
        <legend>Contact information</legend>

        <label htmlFor="name">Name</label>
        <input id="name" name="name" type="text" />

        <label htmlFor="email">Email address</label>
        <input id="email" name="email" type="email" />
      </fieldset>
    </form>
  );
};

// Native semantics generally require less custom accessibility code and
// provide browser and assistive-technology integration automatically.

// ---------------------------------------------------------------------
// 5. Visible button content as the accessible name
// ---------------------------------------------------------------------

// Buttons are normally named by their visible content.

export const VisibleButtonName: FC = (): ReactElement => {
  return <button type="button">Save changes</button>;
};

// The accessible name is:
// "Save changes"

// Avoid replacing useful visible button content with an unnecessary
// aria-label.

// ---------------------------------------------------------------------
// 6. Links are normally named by their content
// ---------------------------------------------------------------------

// A link's visible text normally provides its accessible name.

export const VisibleLinkName: FC = (): ReactElement => {
  return <a href="/products">View products</a>;
};

// The accessible name is:
// "View products"
//
// Descriptive link text is preferable to vague labels such as "Click here"
// when the surrounding context does not otherwise make the destination clear.

// ---------------------------------------------------------------------
// 7. Form controls and the label element
// ---------------------------------------------------------------------

// The HTML <label> element is the preferred naming mechanism for native
// form controls when a visible label is available.

export const LabelledInput: FC = (): ReactElement => {
  return (
    <div>
      <label htmlFor="display-name">Display name</label>

      <input id="display-name" name="display-name" type="text" />
    </div>
  );
};

// The htmlFor value must match the input's id.

// ---------------------------------------------------------------------
// 8. Implicit label association
// ---------------------------------------------------------------------

// A label can also contain the form control directly.
// This creates an implicit label association.

export const ImplicitLabel: FC = (): ReactElement => {
  return (
    <label>
      Display name
      <input name="display-name" type="text" />
    </label>
  );
};

// Both explicit and implicit label associations can provide the accessible
// name of the native form control.

// ---------------------------------------------------------------------
// 9. aria-label
// ---------------------------------------------------------------------

// aria-label provides an accessible name directly as a string.
//
// It is useful when there is no suitable visible text that can provide
// the accessible name.

export const AriaLabelButton: FC = (): ReactElement => {
  return (
    <button type="button" aria-label="Close dialog">
      ×
    </button>
  );
};

// The accessible name is:
// "Close dialog"
//
// The value of aria-label is not normally visible on screen.

// ---------------------------------------------------------------------
// 10. Icon-only controls
// ---------------------------------------------------------------------

// Icon-only controls are a common situation where aria-label can provide
// the missing accessible name.

export const IconButtons: FC = (): ReactElement => {
  return (
    <div>
      <button type="button" aria-label="Search">
        🔍
      </button>

      <button type="button" aria-label="Open settings">
        ⚙
      </button>

      <button type="button" aria-label="Close dialog">
        ×
      </button>
    </div>
  );
};

// The icon itself should not be relied upon as the control's only name
// when the meaning of the action is not otherwise accessible.

// ---------------------------------------------------------------------
// 11. aria-labelledby
// ---------------------------------------------------------------------

// aria-labelledby names an element by referencing the id of another
// element containing the naming text.

export const LabelledByExample: FC = (): ReactElement => {
  return (
    <section aria-labelledby="settings-title">
      <h2 id="settings-title">Account settings</h2>

      <p>Manage your account preferences.</p>
    </section>
  );
};

// The section's accessible name is:
// "Account settings"

// ---------------------------------------------------------------------
// 12. aria-labelledby with form controls
// ---------------------------------------------------------------------

// aria-labelledby can associate a visible element with a control when
// the naming relationship cannot conveniently be expressed with <label>.

export const LabelledByInput: FC = (): ReactElement => {
  return (
    <div>
      <span id="search-label">Search products</span>

      <input type="search" aria-labelledby="search-label" />
    </div>
  );
};

// For a native form control with a normal visible label, <label> is
// generally the simpler and more appropriate HTML mechanism.

// ---------------------------------------------------------------------
// 13. aria-labelledby can reference multiple elements
// ---------------------------------------------------------------------

// Multiple IDs can be provided to aria-labelledby.
// Their referenced text contributes to the resulting accessible name.

export const MultipleNameSources: FC = (): ReactElement => {
  return (
    <div>
      <span id="product-name">Example product</span>

      <span id="product-plan">Standard plan</span>

      <button type="button" aria-labelledby="product-name product-plan">
        Select
      </button>
    </div>
  );
};

// The accessible name is composed from the referenced text:
// "Example product Standard plan"

// ---------------------------------------------------------------------
// 14. aria-labelledby takes precedence over aria-label
// ---------------------------------------------------------------------

// When both aria-labelledby and aria-label are present, aria-labelledby
// has precedence in accessible-name computation.
//
// Do not provide both unless there is a specific reason and the resulting
// name is intentional.

export const LabelledByPrecedence: FC = (): ReactElement => {
  return (
    <div>
      <span id="visible-name">Account settings</span>

      <button type="button" aria-labelledby="visible-name" aria-label="Preferences">
        Open
      </button>
    </div>
  );
};

// The referenced "Account settings" name takes precedence over
// aria-label="Preferences".

// ---------------------------------------------------------------------
// 15. Visible text should normally remain visible to assistive technology
// ---------------------------------------------------------------------

// Using aria-label or aria-labelledby on some elements can replace the
// element's descendant content as its accessible name.
//
// For elements whose visible content already provides the name,
// overriding that content can make the accessibility tree less informative.

export const PreferVisibleButtonText: FC = (): ReactElement => {
  return <button type="button">Save</button>;
};

// Prefer the visible name instead of:
//
// <button aria-label="Save">Save</button>
//
// when no additional naming behavior is required.

// ---------------------------------------------------------------------
// 16. Accessible names should describe purpose
// ---------------------------------------------------------------------

// A good accessible name communicates the purpose of the element.
//
// Weak:
// "Click"
//
// Better:
// "Download report"
//
// The name should be concise while providing enough information to
// distinguish the control from other controls.

export const PurposefulNames: FC = (): ReactElement => {
  return (
    <div>
      <button type="button">Download report</button>

      <button type="button">Save changes</button>

      <button type="button">Cancel</button>
    </div>
  );
};

// ---------------------------------------------------------------------
// 17. Do not include unnecessary role information in the name
// ---------------------------------------------------------------------

// Accessible names normally identify the control without adding its role.
//
// Prefer:
// "Close dialog"
//
// Instead of:
// "Close dialog button"
//
// Assistive technologies can provide the element's role separately.

export const ConciseControlNames: FC = (): ReactElement => {
  return (
    <button type="button" aria-label="Close dialog">
      ×
    </button>
  );
};

// ---------------------------------------------------------------------
// 18. Accessible names should be unique where context requires it
// ---------------------------------------------------------------------

// Multiple controls can technically share a name when they perform the
// same action, but identical names can become ambiguous when their
// surrounding context does not distinguish them.

export const DistinctActionNames: FC = (): ReactElement => {
  return (
    <div>
      <article aria-labelledby="article-one-title">
        <h2 id="article-one-title">Example product</h2>

        <button type="button">View details</button>
      </article>

      <article aria-labelledby="article-two-title">
        <h2 id="article-two-title">Another product</h2>

        <button type="button">View details</button>
      </article>
    </div>
  );
};

// The two buttons have the same visible name, but their surrounding
// article context distinguishes which product each action belongs to.

// ---------------------------------------------------------------------
// 19. Accessible names and context
// ---------------------------------------------------------------------

// An accessible name does not always need to contain every piece of
// contextual information.
//
// The surrounding accessibility structure can provide context.

export const ContextualName: FC = (): ReactElement => {
  return (
    <article aria-labelledby="product-title">
      <h2 id="product-title">Example product</h2>

      <p>Standard plan.</p>

      <button type="button">Select</button>
    </article>
  );
};

// The button is named "Select". Its surrounding article provides
// additional context about what is being selected.

// ---------------------------------------------------------------------
// 20. Accessible names and headings
// ---------------------------------------------------------------------

// Headings normally receive their accessible name from their content.

export const HeadingName: FC = (): ReactElement => {
  return <h2>Account settings</h2>;
};

// Do not unnecessarily replace a heading's visible content with
// aria-label or aria-labelledby.

// ---------------------------------------------------------------------
// 21. Naming a landmark
// ---------------------------------------------------------------------

// Landmarks can be named when a name helps users distinguish multiple
// landmarks of the same type or understand the purpose of a region.

export const NamedNavigation: FC = (): ReactElement => {
  return (
    <nav aria-label="Primary navigation">
      <ul>
        <li>
          <a href="/">Home</a>
        </li>
        <li>
          <a href="/products">Products</a>
        </li>
      </ul>
    </nav>
  );
};

// If there are multiple navigation landmarks, distinct accessible names
// help users distinguish them.

// ---------------------------------------------------------------------
// 22. Naming a region with visible text
// ---------------------------------------------------------------------

// When a visible heading already identifies a region, aria-labelledby
// can connect the region to that heading.

export const NamedRegion: FC = (): ReactElement => {
  return (
    <section aria-labelledby="billing-heading">
      <h2 id="billing-heading">Billing information</h2>

      <p>Manage billing details for this account.</p>
    </section>
  );
};

// ---------------------------------------------------------------------
// 23. Naming a dialog
// ---------------------------------------------------------------------

// Dialogs require an accessible name.
// When a visible dialog title exists, aria-labelledby is generally
// preferable to duplicating the title in aria-label.

export const NamedDialog: FC = (): ReactElement => {
  return (
    <div role="dialog" aria-labelledby="dialog-title">
      <h2 id="dialog-title">Delete account</h2>

      <p>This action cannot be undone.</p>

      <button type="button">Cancel</button>

      <button type="button">Delete</button>
    </div>
  );
};

// The dialog's accessible name is "Delete account".

// ---------------------------------------------------------------------
// 24. aria-describedby is not a substitute for a name
// ---------------------------------------------------------------------

// aria-describedby provides a description.
// It does not replace the need for an accessible name where a name is
// required.

export const NameAndDescription: FC = (): ReactElement => {
  return (
    <div>
      <label htmlFor="password">Password</label>

      <input id="password" type="password" aria-describedby="password-help" />

      <p id="password-help">Use at least 12 characters.</p>
    </div>
  );
};

// Name:
// "Password"
//
// Description:
// "Use at least 12 characters."

// ---------------------------------------------------------------------
// 25. Error messages are descriptions, not names
// ---------------------------------------------------------------------

// Validation errors generally provide additional information about a
// named control rather than replacing its accessible name.

export const NamedInvalidField: FC = (): ReactElement => {
  return (
    <div>
      <label htmlFor="email-field">Email address</label>

      <input id="email-field" type="email" aria-invalid={true} aria-describedby="email-error" />

      <p id="email-error">Enter a valid email address.</p>
    </div>
  );
};

// Name:
// "Email address"
//
// Description:
// "Enter a valid email address."

// ---------------------------------------------------------------------
// 26. Placeholder is not a label
// ---------------------------------------------------------------------

// A placeholder is temporary hint text and should not be treated as
// the primary accessible name for a form control.
//
// Use a label for the control's name.

export const LabelInsteadOfPlaceholder: FC = (): ReactElement => {
  return (
    <div>
      <label htmlFor="email-address">Email address</label>

      <input id="email-address" type="email" placeholder="user@example.com" />
    </div>
  );
};

// The label identifies the field.
// The placeholder provides an example or hint.

// ---------------------------------------------------------------------
// 27. title should not be the primary naming mechanism when better
// mechanisms are available
// ---------------------------------------------------------------------

// The title attribute can participate in accessible description/name
// behavior in certain circumstances, but it should not replace an
// appropriate visible label or other primary naming mechanism.

export const ExplicitLabel: FC = (): ReactElement => {
  return (
    <div>
      <label htmlFor="account-id">Account ID</label>

      <input id="account-id" type="text" title="The identifier assigned to this account." />
    </div>
  );
};

// The label provides the primary accessible name.
// The title can provide supplementary information.

// ---------------------------------------------------------------------
// 28. Images and accessible names
// ---------------------------------------------------------------------

// An informative image receives its accessible text through alt.
//
// The alt text describes the image's purpose or equivalent information,
// not necessarily every visual detail.

export const InformativeImage: FC = (): ReactElement => {
  return <img src="https://example.com/product.jpg" alt="Example product in black" />;
};

// The alt attribute is the native naming mechanism for an image.

// ---------------------------------------------------------------------
// 29. Decorative images
// ---------------------------------------------------------------------

// Decorative images should not introduce unnecessary accessible names.
// An empty alt attribute tells assistive technologies that the image is
// intentionally decorative.

export const DecorativeImage: FC = (): ReactElement => {
  return <img src="https://example.com/decorative-divider.svg" alt="" />;
};

// Do not use aria-label to give a decorative image a meaningless name.

// ---------------------------------------------------------------------
// 30. Functional images
// ---------------------------------------------------------------------

// When an image is the content of a link or button, its alternative text
// should communicate the purpose of the action or destination.

export const FunctionalImageLink: FC = (): ReactElement => {
  return (
    <a href="/profile">
      <img src="https://example.com/profile.svg" alt="View profile" />
    </a>
  );
};

// The name communicates the action rather than merely saying "profile icon".

// ---------------------------------------------------------------------
// 31. SVG icons inside labelled controls
// ---------------------------------------------------------------------

// When a visible text label already names a button, a decorative icon
// inside that button does not need to create a second accessible name.

export const LabelledIconButton: FC = (): ReactElement => {
  return (
    <button type="button">
      <span aria-hidden="true">+</span>
      Add item
    </button>
  );
};

// The button's accessible name comes from "Add item".
// The decorative icon is hidden from the accessibility tree.

// ---------------------------------------------------------------------
// 32. Icon-only SVG controls
// ---------------------------------------------------------------------

// An icon-only control needs an accessible name describing its action.

export const IconOnlyButton: FC = (): ReactElement => {
  return (
    <button type="button" aria-label="Search">
      <svg aria-hidden="true" viewBox="0 0 24 24" width="24" height="24">
        <circle cx="11" cy="11" r="6" fill="none" stroke="currentColor" />
        <path d="m16 16 5 5" fill="none" stroke="currentColor" />
      </svg>
    </button>
  );
};

// The SVG is decorative because the button's accessible name already
// communicates the action.

// ---------------------------------------------------------------------
// 33. Do not duplicate visible text unnecessarily
// ---------------------------------------------------------------------

// If visible content already provides a suitable name, adding the same
// text through aria-label is generally redundant.

export const AvoidDuplicateName: FC = (): ReactElement => {
  return <button type="button">Download</button>;
};

// Prefer the native visible name rather than:
//
// <button aria-label="Download">Download</button>

// ---------------------------------------------------------------------
// 34. Naming with hidden text
// ---------------------------------------------------------------------

// aria-labelledby can reference text that is not visually displayed.
// This can be useful when a control needs a name that is not otherwise
// visible, although visible naming is generally preferable when practical.

export const HiddenNamingText: FC = (): ReactElement => {
  return (
    <div>
      <span id="menu-label" hidden>
        Account menu
      </span>

      <button type="button" aria-labelledby="menu-label">
        ☰
      </button>
    </div>
  );
};

// The referenced text contributes to the accessible name even though
// the naming element is hidden from visual presentation.

// ---------------------------------------------------------------------
// 35. Multiple naming sources
// ---------------------------------------------------------------------

// Avoid supplying multiple competing naming mechanisms.
//
// Prefer one clear source:
//
// visible content
// label
// caption / legend
// aria-labelledby
// aria-label
//
// depending on the element and its semantics.

export const SingleClearName: FC = (): ReactElement => {
  return <button type="button">Save changes</button>;
};

// A single clear naming source makes the markup easier to understand
// and reduces the chance of unexpected name computation.

// ---------------------------------------------------------------------
// 36. Accessible names are computed
// ---------------------------------------------------------------------

// Browsers and assistive technologies do not simply read the DOM text
// exactly as written. The accessibility tree exposes an accessible name
// calculated from applicable naming mechanisms.
//
// The exact algorithm is defined by the Accessible Name and Description
// Computation specification.

export const ComputedNameExample: FC = (): ReactElement => {
  return (
    <button type="button" aria-labelledby="action-label">
      <span id="action-label">Save</span>
    </button>
  );
};

// The accessible name is computed as "Save".

// ---------------------------------------------------------------------
// 37. aria-labelledby can combine visible text
// ---------------------------------------------------------------------

// Multiple references are useful when a name needs to combine separate
// pieces of visible information.

export const CombinedAccessibleName: FC = (): ReactElement => {
  return (
    <div>
      <span id="item-name">Example product</span>

      <span id="item-status">Draft</span>

      <button type="button" aria-labelledby="item-name item-status">
        Edit
      </button>
    </div>
  );
};

// The accessible name is composed from the referenced elements.

// ---------------------------------------------------------------------
// 38. Naming a form with a visible heading
// ---------------------------------------------------------------------

// A form can be associated with a visible heading using aria-labelledby
// when a named form landmark is useful.

export const NamedForm: FC = (): ReactElement => {
  return (
    <form aria-labelledby="contact-heading">
      <h2 id="contact-heading">Contact information</h2>

      <label htmlFor="contact-name">Name</label>

      <input id="contact-name" name="name" type="text" />
    </form>
  );
};

// ---------------------------------------------------------------------
// 39. Fieldset and legend
// ---------------------------------------------------------------------

// For a group of related form controls, fieldset and legend provide
// native grouping semantics and naming.

export const NamedFieldset: FC = (): ReactElement => {
  return (
    <fieldset>
      <legend>Notification preferences</legend>

      <label>
        <input type="checkbox" name="email" />
        Email
      </label>

      <label>
        <input type="checkbox" name="sms" />
        SMS
      </label>
    </fieldset>
  );
};

// Prefer the native legend mechanism instead of recreating fieldset
// naming with unnecessary ARIA.

// ---------------------------------------------------------------------
// 40. Table names
// ---------------------------------------------------------------------

// A table can be named with a caption.
// The caption is the native HTML naming mechanism.

export const NamedTable: FC = (): ReactElement => {
  return (
    <table>
      <caption>Recent orders</caption>

      <thead>
        <tr>
          <th scope="col">Order</th>
          <th scope="col">Status</th>
        </tr>
      </thead>

      <tbody>
        <tr>
          <td>#1001</td>
          <td>Shipped</td>
        </tr>
      </tbody>
    </table>
  );
};

// ---------------------------------------------------------------------
// 41. Figure names
// ---------------------------------------------------------------------

// A figure can use figcaption as its native accessible naming mechanism.

export const NamedFigure: FC = (): ReactElement => {
  return (
    <figure>
      <img src="https://example.com/chart.svg" alt="Sales increased steadily from January through June" />

      <figcaption>Monthly sales trend</figcaption>
    </figure>
  );
};

// The image and figure can have different semantic purposes:
// alt provides the image's text alternative,
// figcaption identifies the figure.

// ---------------------------------------------------------------------
// 42. Dialog name and description
// ---------------------------------------------------------------------

// A dialog can have a short accessible name and a longer description.

export const DialogNameAndDescription: FC = (): ReactElement => {
  return (
    <div role="dialog" aria-labelledby="confirmation-title" aria-describedby="confirmation-description">
      <h2 id="confirmation-title">Delete account?</h2>

      <p id="confirmation-description">This permanently removes the account and its associated data.</p>

      <button type="button">Cancel</button>

      <button type="button">Delete</button>
    </div>
  );
};

// Name:
// "Delete account?"
//
// Description:
// "This permanently removes the account and its associated data."

// ---------------------------------------------------------------------
// 43. Naming custom controls
// ---------------------------------------------------------------------

// Custom controls need the same accessible naming considerations as
// native controls.
//
// If a custom widget has visible text, reference that text when
// aria-labelledby is appropriate.

export const CustomNamedControl: FC = (): ReactElement => {
  return (
    <div>
      <span id="volume-label">Volume</span>

      <div
        role="slider"
        aria-labelledby="volume-label"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={50}
        tabIndex={0}
      >
        50%
      </div>
    </div>
  );
};

// The custom slider needs an accessible name, but it also requires the
// keyboard and value interaction behavior associated with a slider.

// ---------------------------------------------------------------------
// 44. Name every interactive control appropriately
// ---------------------------------------------------------------------

// Interactive controls should have names that communicate their purpose.
//
// This includes:
// buttons
// links
// form controls
// tabs
// menu items
// custom widgets
// dialogs and other roles that require names

export const NamedInteractiveControls: FC = (): ReactElement => {
  return (
    <div>
      <button type="button">Save</button>

      <a href="/settings">Settings</a>

      <label htmlFor="search">Search</label>
      <input id="search" type="search" />
    </div>
  );
};

// ---------------------------------------------------------------------
// 45. Avoid names that describe implementation
// ---------------------------------------------------------------------

// Accessible names should describe the user-facing purpose rather than
// implementation details.
//
// Avoid:
// "Button 1"
// "div control"
// "icon"
// "component"
//
// Prefer:
// "Delete account"
// "Open settings"
// "Search products"

export const UserFacingNames: FC = (): ReactElement => {
  return (
    <div>
      <button type="button" aria-label="Open settings">
        ⚙
      </button>

      <button type="button" aria-label="Delete account">
        🗑
      </button>
    </div>
  );
};

// ---------------------------------------------------------------------
// 46. Accessible name and visible label consistency
// ---------------------------------------------------------------------

// When a control has visible text, its accessible name should normally
// contain that visible label.
//
// This is particularly important for voice-control users who may identify
// a control by its visible text.

export const ConsistentVisibleName: FC = (): ReactElement => {
  return (
    <button type="button" aria-label="Save changes">
      Save changes
    </button>
  );
};

// Although the example is valid, the aria-label is unnecessary because
// the visible button text already supplies the same name.
//
// Prefer:

export const SimplerConsistentName: FC = (): ReactElement => {
  return <button type="button">Save changes</button>;
};

// ---------------------------------------------------------------------
// 47. Avoid using aria-label to hide useful visible content
// ---------------------------------------------------------------------

// On elements whose name can come from their visible content, applying
// aria-label can replace that content in the accessible name calculation.
//
// This can cause assistive technology users to receive less information
// than sighted users.

export const PreserveVisibleMeaning: FC = (): ReactElement => {
  return <button type="button">Download PDF</button>;
};

// Prefer the visible content when it already communicates the action.

// ---------------------------------------------------------------------
// 48. Accessible name testing
// ---------------------------------------------------------------------

// Testing should verify the computed accessible name rather than merely
// checking whether an aria-label attribute exists.
//
// For example, a testing tool can query an element by its role and
// accessible name.

export const TestableNameExample: FC = (): ReactElement => {
  return <button type="button">Submit order</button>;
};

// The important question is:
// Can the intended control be found by its role and meaningful accessible name?
//
// A browser accessibility inspector and assistive technology can also
// reveal how the name is exposed in the accessibility tree.

// ---------------------------------------------------------------------
// 49. Accessible name anti-patterns
// ---------------------------------------------------------------------

// Common problems include:
//
// - icon-only controls without an accessible name;
// - form controls without associated labels;
// - vague link or button names;
// - unnecessary aria-label overriding visible text;
// - conflicting aria-label and aria-labelledby values;
// - using placeholder as the primary label;
// - using aria-describedby as the only name;
// - naming an element whose role should not be named;
// - referencing the wrong ID;
// - referencing content that does not provide the intended meaning.

export const AccessibleNameAntiPatternFix: FC = (): ReactElement => {
  return (
    <div>
      <label htmlFor="product-search">Search products</label>

      <input id="product-search" type="search" />

      <button type="button" aria-label="Clear search">
        ×
      </button>
    </div>
  );
};

// ---------------------------------------------------------------------
// 50. Complete accessible form example
// ---------------------------------------------------------------------

export const AccessibleFormExample: FC = (): ReactElement => {
  return (
    <form aria-labelledby="form-title">
      <h2 id="form-title">Create account</h2>

      <div>
        <label htmlFor="full-name">Full name</label>

        <input id="full-name" name="full-name" type="text" autoComplete="name" />
      </div>

      <div>
        <label htmlFor="email">Email address</label>

        <input id="email" name="email" type="email" autoComplete="email" aria-describedby="email-help" />

        <p id="email-help">We will use this address for account notifications.</p>
      </div>

      <div>
        <label htmlFor="password">Password</label>

        <input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          aria-describedby="password-help"
        />

        <p id="password-help">Use at least 12 characters.</p>
      </div>

      <button type="submit">Create account</button>
    </form>
  );
};

// Every form control has a clear accessible name.
// Additional instructions are exposed as descriptions.
// The form itself has a name from its visible heading.

// ---------------------------------------------------------------------
// 51. Complete icon-button example
// ---------------------------------------------------------------------

export const AccessibleIconButton: FC = (): ReactElement => {
  return (
    <div>
      <button type="button" aria-label="Open navigation menu">
        <svg aria-hidden="true" viewBox="0 0 24 24" width="24" height="24">
          <path d="M4 6h16M4 12h16M4 18h16" fill="none" stroke="currentColor" />
        </svg>
      </button>

      <button type="button" aria-label="Search">
        <svg aria-hidden="true" viewBox="0 0 24 24" width="24" height="24">
          <circle cx="11" cy="11" r="6" fill="none" stroke="currentColor" />
          <path d="m16 16 5 5" fill="none" stroke="currentColor" />
        </svg>
      </button>
    </div>
  );
};

// The SVGs are decorative.
// The buttons receive their names from aria-label.

// ---------------------------------------------------------------------
// 52. Complete dialog example
// ---------------------------------------------------------------------

export const AccessibleDialogExample: FC = (): ReactElement => {
  return (
    <div role="dialog" aria-labelledby="settings-dialog-title" aria-describedby="settings-dialog-description">
      <h2 id="settings-dialog-title">Account settings</h2>

      <p id="settings-dialog-description">Update the preferences for this account.</p>

      <button type="button">Cancel</button>

      <button type="button">Save changes</button>
    </div>
  );
};

// The dialog has:
// accessible name -> "Account settings"
// accessible description -> "Update the preferences for this account."

// ---------------------------------------------------------------------
// 53. Complete navigation example
// ---------------------------------------------------------------------

export const AccessibleNavigationExample: FC = (): ReactElement => {
  return (
    <nav aria-labelledby="primary-navigation-title">
      <h2 id="primary-navigation-title">Primary navigation</h2>

      <ul>
        <li>
          <a href="/" aria-current="page">
            Home
          </a>
        </li>

        <li>
          <a href="/products">Products</a>
        </li>

        <li>
          <a href="/contact">Contact</a>
        </li>
      </ul>
    </nav>
  );
};

// The navigation landmark receives its name from the visible heading.

// ---------------------------------------------------------------------
// 54. Complete accessible-name checklist
// ---------------------------------------------------------------------

// For each interactive element:
//
// - Determine what the user needs to know to understand its purpose.
// - Prefer visible text or native HTML naming mechanisms.
// - Use <label> for native form controls.
// - Use alt for informative images.
// - Use empty alt for decorative images.
// - Use aria-labelledby when visible naming content exists and a reference
//   relationship is appropriate.
// - Use aria-label when no suitable visible naming source exists.
// - Keep the accessible name concise and purposeful.
// - Do not include the role in the name unnecessarily.
// - Do not use placeholder as a replacement for a label.
// - Use aria-describedby for additional instructions or error information.
// - Avoid conflicting naming mechanisms.
// - Verify that referenced IDs exist and identify the intended content.
// - Test the computed accessible name, not just the source attributes.
// - Confirm that the accessible name remains consistent with the visible UI.

// ---------------------------------------------------------------------
// 55. Final integrated example
// ---------------------------------------------------------------------

export const AccessibleNamesExample: FC = (): ReactElement => {
  return (
    <main>
      <header>
        <h1>Account settings</h1>
      </header>

      <section aria-labelledby="profile-title">
        <h2 id="profile-title">Profile</h2>

        <div>
          <label htmlFor="display-name">Display name</label>

          <input id="display-name" name="display-name" type="text" aria-describedby="display-name-help" />

          <p id="display-name-help">This name is displayed to other users.</p>
        </div>

        <button type="button" aria-label="Open profile settings">
          ⚙
        </button>
      </section>

      <section aria-labelledby="notifications-title">
        <h2 id="notifications-title">Notifications</h2>

        <label>
          <input type="checkbox" defaultChecked />
          Receive email notifications
        </label>
      </section>
    </main>
  );
};

// The integrated example demonstrates the main naming mechanisms:
// visible headings name sections,
// labels name form controls,
// aria-describedby provides supplementary information,
// aria-label names an icon-only control,
// and native checkbox semantics provide the control's name.

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - An accessible name identifies an element to assistive technologies.
// - Accessible names answer what an element is for; accessible descriptions provide additional information.
// - Native HTML naming mechanisms should be preferred when they provide the required name.
// - Visible button and link content can provide accessible names.
// - The label element provides the accessible name for associated native form controls.
// - Images use alt text as their native accessible naming mechanism.
// - Fieldset and legend provide native grouping and naming semantics.
// - Tables and figures can use caption and figcaption respectively.
// - aria-labelledby names an element by referencing one or more elements containing naming text.
// - aria-label supplies an accessible name directly as a string when an appropriate visible name is unavailable.
// - aria-labelledby takes precedence over aria-label during accessible-name computation.
// - aria-describedby provides an accessible description rather than replacing the accessible name.
// - Placeholder text should not be used as the primary label for a form control.
// - Accessible names should communicate purpose clearly and concisely.
// - Avoid unnecessary role words, implementation details, and redundant naming attributes.
// - Be careful when aria-label or aria-labelledby overrides visible descendant content.
// - Referenced IDs must identify the intended naming content.
// - Interactive controls and other name-required roles should expose an appropriate accessible name.
// - The computed accessible name should be tested through the accessibility tree and assistive technology.
