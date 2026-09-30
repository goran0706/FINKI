/**
 * Screen Readers
 * ===============
 *
 * Screen readers are assistive technologies that interpret information exposed by the
 * browser and communicate it to users primarily through synthesized speech or refreshable
 * braille. They rely heavily on the accessibility tree, which represents semantic information
 * such as an element's role, accessible name, description, state, and available interactions.
 *
 * Accessible React applications therefore need meaningful HTML structure, accessible names,
 * correct states and relationships, predictable keyboard interaction, and appropriately
 * exposed dynamic changes. Screen-reader support is not achieved by adding ARIA attributes
 * alone; the underlying semantics and behavior must also be correct.
 */

// ---------------------------------------------------------------------
// Imports
// ---------------------------------------------------------------------

import { type FC, type ReactElement, useState } from "react";

// ---------------------------------------------------------------------
// 1. What a screen reader does
// ---------------------------------------------------------------------

// A screen reader is assistive technology that communicates information from
// a user interface through speech, braille, or both.
//
// It does not simply read the raw HTML source from top to bottom.
// The browser exposes an accessibility representation of the page, and the
// screen reader interprets that representation for the user.

export const ScreenReaderContent: FC = (): ReactElement => {
  return (
    <main>
      <h1>Account settings</h1>

      <p>Manage your account preferences.</p>
    </main>
  );
};

// ---------------------------------------------------------------------
// 2. The accessibility tree
// ---------------------------------------------------------------------

// Browsers build an accessibility tree from information in the DOM and
// expose it through platform accessibility APIs.
//
// An accessibility-tree node can contain information such as:
//
// - role;
// - accessible name;
// - accessible description;
// - state;
// - available actions or interactions.
//
// Screen readers consume this semantic representation rather than relying
// on visual styling alone.

export const AccessibilityTreeExample: FC = (): ReactElement => {
  return (
    <button type="button" aria-label="Open settings">
      ⚙
    </button>
  );
};

// A screen reader can receive information equivalent to:
// role: button
// name: Open settings

// ---------------------------------------------------------------------
// 3. Semantic HTML provides useful information
// ---------------------------------------------------------------------

// Native HTML elements communicate their intended semantics to the browser.
//
// For example:
//
// <button>       -> button
// <a>            -> link
// <input>        -> form control
// <h1>           -> heading
// <nav>          -> navigation landmark
// <main>         -> main landmark
//
// Prefer native HTML when it already represents the required behavior.

export const SemanticElements: FC = (): ReactElement => {
  return (
    <main>
      <h1>Products</h1>

      <nav aria-label="Primary navigation">
        <a href="/">Home</a>
        <a href="/products">Products</a>
      </nav>

      <button type="button">Add product</button>
    </main>
  );
};

// ---------------------------------------------------------------------
// 4. Native semantics are more than labels
// ---------------------------------------------------------------------

// A semantic HTML element communicates both what an element is and, in
// many cases, how it can be interacted with.
//
// A native button has button semantics and browser-provided keyboard behavior.
// A generic div does not become equivalent merely because it has text.

export const NativeButton: FC = (): ReactElement => {
  return <button type="button">Save changes</button>;
};

// ---------------------------------------------------------------------
// 5. A generic element with role is not automatically equivalent
// ---------------------------------------------------------------------

// Adding role="button" changes accessibility semantics but does not make a
// generic element behave like a native button.
//
// The author must provide the interaction behavior expected by the role.

export const IncompleteCustomButton: FC = (): ReactElement => {
  return <div role="button">Save changes</div>;
};

// This example exposes button-like semantics without providing the complete
// keyboard and interaction behavior expected from a native button.
//
// Prefer:

export const CompleteNativeButton: FC = (): ReactElement => {
  return <button type="button">Save changes</button>;
};

// ---------------------------------------------------------------------
// 6. Accessible names are essential
// ---------------------------------------------------------------------

// Screen-reader users need a meaningful name for controls.
//
// Visible text often provides the name automatically.
// Icon-only controls generally need an explicit accessible name.

export const NamedControls: FC = (): ReactElement => {
  return (
    <div>
      <button type="button">Save</button>

      <button type="button" aria-label="Close dialog">
        ×
      </button>
    </div>
  );
};

// A screen reader can identify these controls by their role and names:
//
// button, "Save"
// button, "Close dialog"

// ---------------------------------------------------------------------
// 7. Form controls need labels
// ---------------------------------------------------------------------

// Screen-reader users need to know what each form control represents.
//
// Use a native label association whenever possible.

export const LabelledForm: FC = (): ReactElement => {
  return (
    <form>
      <label htmlFor="email">Email address</label>

      <input id="email" name="email" type="email" />
    </form>
  );
};

// The input can be announced with its role and accessible name,
// such as "Email address, edit field" depending on the screen reader
// and platform.

// ---------------------------------------------------------------------
// 8. Headings provide document structure
// ---------------------------------------------------------------------

// Screen readers commonly provide commands for navigating by headings.
// Correct heading structure therefore helps users understand and move
// through the page efficiently.

export const HeadingStructure: FC = (): ReactElement => {
  return (
    <main>
      <h1>Account</h1>

      <section>
        <h2>Profile</h2>

        <p>Manage your profile information.</p>
      </section>

      <section>
        <h2>Security</h2>

        <p>Manage account security settings.</p>
      </section>
    </main>
  );
};

// Headings should reflect the document's structural relationships rather
// than being chosen only for their visual size.

// ---------------------------------------------------------------------
// 9. Heading level is semantic, not visual styling
// ---------------------------------------------------------------------

// CSS should control visual presentation.
// Heading levels should communicate document structure.

export const SemanticHeading: FC = (): ReactElement => {
  return (
    <section>
      <h2>Security settings</h2>

      <p>Manage security preferences.</p>
    </section>
  );
};

// Do not choose <h4> merely because its default browser styling looks smaller.

// ---------------------------------------------------------------------
// 10. Landmarks support navigation
// ---------------------------------------------------------------------

// Landmark elements identify major regions of a page.
//
// Common landmarks include:
//
// header
// nav
// main
// aside
// footer
//
// Screen readers can provide navigation commands for these regions.

export const LandmarkPage: FC = (): ReactElement => {
  return (
    <>
      <header>
        <h1>Example application</h1>
      </header>

      <nav aria-label="Primary navigation">
        <a href="/">Home</a>
        <a href="/products">Products</a>
      </nav>

      <main>
        <h2>Products</h2>
      </main>

      <footer>
        <p>Example company</p>
      </footer>
    </>
  );
};

// ---------------------------------------------------------------------
// 11. Multiple landmarks may need names
// ---------------------------------------------------------------------

// If multiple landmarks have the same type, accessible names can help
// users distinguish their purposes.

export const NamedLandmarks: FC = (): ReactElement => {
  return (
    <>
      <nav aria-label="Primary navigation">
        <a href="/">Home</a>
      </nav>

      <nav aria-label="Account navigation">
        <a href="/profile">Profile</a>
      </nav>
    </>
  );
};

// ---------------------------------------------------------------------
// 12. Main content should be identifiable
// ---------------------------------------------------------------------

// The main element identifies the primary content of the document.
//
// It can help screen-reader users move directly to the main content.

export const MainContent: FC = (): ReactElement => {
  return (
    <main>
      <h1>Search results</h1>

      <p>Results for example.com.</p>
    </main>
  );
};

// ---------------------------------------------------------------------
// 13. Skip links
// ---------------------------------------------------------------------

// A skip link provides a keyboard-accessible mechanism for bypassing
// repeated navigation and reaching the main content.

export const SkipLink: FC = (): ReactElement => {
  return (
    <>
      <a href="#main-content">Skip to main content</a>

      <nav aria-label="Primary navigation">
        <a href="/">Home</a>
        <a href="/products">Products</a>
      </nav>

      <main id="main-content">
        <h1>Products</h1>
      </main>
    </>
  );
};

// The target needs to be identifiable and reachable.
// The skip link should also be visually usable when it receives focus.

// ---------------------------------------------------------------------
// 14. Links and buttons have different meanings
// ---------------------------------------------------------------------

// Screen readers expose native roles and users may navigate through
// controls according to those roles.
//
// Use a link for navigation.
// Use a button for an action.

export const LinkAndButton: FC = (): ReactElement => {
  return (
    <div>
      <a href="/settings">Open settings</a>

      <button type="button">Save changes</button>
    </div>
  );
};

// This distinction is important for users who navigate by control type.

// ---------------------------------------------------------------------
// 15. Do not use links as buttons
// ---------------------------------------------------------------------

// An anchor without a meaningful destination should not be used as a
// substitute for a button.

export const CorrectActionControl: FC = (): ReactElement => {
  return <button type="button">Show more</button>;
};

// ---------------------------------------------------------------------
// 16. Keyboard accessibility affects screen-reader interaction
// ---------------------------------------------------------------------

// Screen-reader users often interact with controls through keyboard
// commands or other non-pointer input.
//
// A control that cannot receive focus or cannot be operated with the
// expected keyboard interaction is not fully accessible.

export const KeyboardAccessibleControl: FC = (): ReactElement => {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button type="button" aria-expanded={open} aria-controls="details" onClick={() => setOpen((current) => !current)}>
        {open ? "Hide details" : "Show details"}
      </button>

      <div id="details">
        <p>Additional account details.</p>
      </div>
    </div>
  );
};

// The native button provides keyboard interaction.
// aria-expanded communicates the current state.

// ---------------------------------------------------------------------
// 17. State information must stay synchronized
// ---------------------------------------------------------------------

// When an interactive component changes state, its accessibility
// information should reflect the same state.
//
// Common ARIA states include:
//
// aria-expanded
// aria-selected
// aria-checked
// aria-pressed
// aria-disabled
// aria-current

export const ExpandedState: FC = (): ReactElement => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div>
      <button type="button" aria-expanded={expanded} onClick={() => setExpanded((current) => !current)}>
        Details
      </button>

      {expanded && <p>Additional details are visible.</p>}
    </div>
  );
};

// The state exposed to assistive technology follows the actual UI state.

// ---------------------------------------------------------------------
// 18. aria-expanded describes expandable state
// ---------------------------------------------------------------------

// aria-expanded communicates whether a controlled expandable region is
// currently expanded or collapsed.

export const ExpandableSection: FC = (): ReactElement => {
  const [expanded, setExpanded] = useState(false);

  return (
    <section>
      <button
        type="button"
        aria-expanded={expanded}
        aria-controls="account-details"
        onClick={() => setExpanded((current) => !current)}
      >
        Account details
      </button>

      {expanded && (
        <div id="account-details">
          <p>Example account information.</p>
        </div>
      )}
    </section>
  );
};

// ---------------------------------------------------------------------
// 19. Screen readers announce state changes differently
// ---------------------------------------------------------------------

// The exact spoken output depends on the screen reader, browser,
// operating system, and user settings.
//
// Developers should therefore avoid relying on one exact spoken sentence.
//
// Instead, expose correct semantics and state.

export const StateSemantics: FC = (): ReactElement => {
  const [expanded, setExpanded] = useState(false);

  return (
    <button type="button" aria-expanded={expanded} onClick={() => setExpanded((current) => !current)}>
      {expanded ? "Hide details" : "Show details"}
    </button>
  );
};

// The important requirement is that the exposed state and visible UI
// remain consistent.

// ---------------------------------------------------------------------
// 20. Live regions communicate dynamic updates
// ---------------------------------------------------------------------

// Some updates happen without moving focus.
// A live region can communicate appropriate status information to
// assistive technologies.

export const StatusMessage: FC = (): ReactElement => {
  const [saved, setSaved] = useState(false);

  return (
    <div>
      <button type="button" onClick={() => setSaved(true)}>
        Save
      </button>

      <p role="status">{saved ? "Changes saved." : ""}</p>
    </div>
  );
};

// role="status" provides a live-region semantic intended for status
// messages that do not require immediate interruption.

// ---------------------------------------------------------------------
// 21. Live regions should be used selectively
// ---------------------------------------------------------------------

// Not every changing piece of content needs to be announced.
//
// Excessive announcements can interrupt a user's current task and make
// a page difficult to use.
//
// Announce meaningful updates that the user needs to know about.

export const UsefulStatus: FC = (): ReactElement => {
  const [message, setMessage] = useState("");

  return (
    <div>
      <button type="button" onClick={() => setMessage("Profile updated.")}>
        Save profile
      </button>

      <p role="status">{message}</p>
    </div>
  );
};

// ---------------------------------------------------------------------
// 22. Alerts are for important messages
// ---------------------------------------------------------------------

// An alert is intended for important, time-sensitive information that
// should be communicated to the user.
//
// It should not be used for every ordinary UI update.

export const AlertMessage: FC = (): ReactElement => {
  const [error, setError] = useState("");

  return (
    <div>
      <button type="button" onClick={() => setError("Unable to save changes.")}>
        Save
      </button>

      {error && <p role="alert">{error}</p>}
    </div>
  );
};

// ---------------------------------------------------------------------
// 23. Screen-reader-only text
// ---------------------------------------------------------------------

// Sometimes information should be available to screen readers without
// being visually prominent.
//
// This requires visually-hidden CSS rather than display:none when the
// content must remain available to assistive technology.

export const VisuallyHiddenInformation: FC = (): ReactElement => {
  return (
    <button type="button">
      Download
      <span className="visually-hidden">PDF report</span>
    </button>
  );
};

// The CSS implementation of .visually-hidden must visually hide the
// content without removing it from the accessibility tree.
//
// display:none would remove the element from the accessibility tree.

// ---------------------------------------------------------------------
// 24. display:none removes content from the accessibility tree
// ---------------------------------------------------------------------

// Content with display:none is not exposed to screen readers.
//
// React's conditional rendering can similarly remove content from the DOM.

export const HiddenContent: FC = (): ReactElement => {
  return (
    <div>
      <p style={{ display: "none" }}>This content is hidden from the accessibility tree.</p>

      <p>This content is available.</p>
    </div>
  );
};

// Do not use display:none when the intention is to visually hide content
// while keeping it available to assistive technologies.

// ---------------------------------------------------------------------
// 25. aria-hidden
// ---------------------------------------------------------------------

// aria-hidden="true" removes an element and its descendants from the
// accessibility tree while leaving the visual content present.

export const DecorativeIcon: FC = (): ReactElement => {
  return (
    <button type="button">
      <span aria-hidden="true">+</span>
      Add item
    </button>
  );
};

// The plus sign is decorative.
// "Add item" remains the accessible name of the button.

// ---------------------------------------------------------------------
// 26. Do not hide focusable content with aria-hidden
// ---------------------------------------------------------------------

// An element that users can focus should not normally be removed from
// the accessibility tree with aria-hidden.
//
// Doing so can create a focusable element that assistive technology
// cannot properly perceive.

export const SafeInteractiveContent: FC = (): ReactElement => {
  return <button type="button">Open settings</button>;
};

// Keep interactive controls represented consistently in both the visual
// interface and accessibility tree.

// ---------------------------------------------------------------------
// 27. Images need meaningful alternatives
// ---------------------------------------------------------------------

// Screen readers cannot obtain the visual meaning of an image in the
// same way a sighted user can.
//
// Informative images therefore need appropriate alternative text.

export const InformativeImage: FC = (): ReactElement => {
  return <img src="https://example.com/product.jpg" alt="Example product in black" />;
};

// ---------------------------------------------------------------------
// 28. Decorative images should not add noise
// ---------------------------------------------------------------------

// A decorative image should normally have an empty alt attribute so the
// screen reader does not announce meaningless information.

export const DecorativeImage: FC = (): ReactElement => {
  return <img src="https://example.com/divider.svg" alt="" />;
};

// ---------------------------------------------------------------------
// 29. Accessible descriptions provide additional context
// ---------------------------------------------------------------------

// aria-describedby can associate supplementary text with a control.
//
// This is useful for instructions, help text, and validation messages.

export const DescribedControl: FC = (): ReactElement => {
  return (
    <div>
      <label htmlFor="password">Password</label>

      <input id="password" type="password" aria-describedby="password-help" />

      <p id="password-help">Use at least 12 characters.</p>
    </div>
  );
};

// The control has a name from the label and additional descriptive
// information from the help text.

// ---------------------------------------------------------------------
// 30. Error information should be associated with the control
// ---------------------------------------------------------------------

// Validation feedback should be exposed in a way that allows users to
// associate the error with the relevant control.

export const AccessibleError: FC = (): ReactElement => {
  return (
    <div>
      <label htmlFor="email-address">Email address</label>

      <input id="email-address" type="email" aria-invalid={true} aria-describedby="email-error" />

      <p id="email-error">Enter a valid email address.</p>
    </div>
  );
};

// ---------------------------------------------------------------------
// 31. Reading order follows document structure
// ---------------------------------------------------------------------

// Screen-reader users can navigate through the semantic structure of a
// page. DOM order therefore matters.
//
// Keep the source order aligned with the intended reading and interaction
// order whenever possible.

export const LogicalDocumentOrder: FC = (): ReactElement => {
  return (
    <main>
      <h1>Product details</h1>

      <p>Example product information.</p>

      <button type="button">Add to cart</button>
    </main>
  );
};

// Avoid rearranging meaningful content with CSS when doing so creates a
// confusing relationship between visual and programmatic order.

// ---------------------------------------------------------------------
// 32. CSS order does not replace semantic structure
// ---------------------------------------------------------------------

// CSS can visually reorder flex or grid items, but visual order should
// not be used to compensate for an incorrect DOM structure.

export const SourceOrderExample: FC = (): ReactElement => {
  return (
    <div>
      <section>
        <h2>Product information</h2>

        <p>Example product description.</p>
      </section>

      <aside>
        <h2>Related products</h2>

        <a href="/products">View products</a>
      </aside>
    </div>
  );
};

// The DOM order communicates the intended structure directly.

// ---------------------------------------------------------------------
// 33. Tables need meaningful structure
// ---------------------------------------------------------------------

// Proper table markup gives screen readers information about headers
// and their relationships with cells.

export const AccessibleTable: FC = (): ReactElement => {
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

// Avoid using tables solely for visual layout.

// ---------------------------------------------------------------------
// 34. Lists communicate relationships
// ---------------------------------------------------------------------

// Lists expose a collection relationship that can help screen-reader
// users understand the structure of related items.

export const SemanticList: FC = (): ReactElement => {
  return (
    <ul>
      <li>Profile</li>
      <li>Security</li>
      <li>Notifications</li>
    </ul>
  );
};

// ---------------------------------------------------------------------
// 35. Navigation links should have meaningful names
// ---------------------------------------------------------------------

// Screen readers can present lists of links for quick navigation.
// Link names should therefore make sense when encountered outside
// surrounding visual context.

export const MeaningfulLinks: FC = (): ReactElement => {
  return (
    <nav aria-label="Products">
      <ul>
        <li>
          <a href="/products/laptops">Laptops</a>
        </li>

        <li>
          <a href="/products/phones">Phones</a>
        </li>
      </ul>
    </nav>
  );
};

// Avoid a collection of links that are all named only "Read more" when
// their destinations cannot otherwise be distinguished.

// ---------------------------------------------------------------------
// 36. Current page state
// ---------------------------------------------------------------------

// aria-current identifies the item representing the user's current
// location or current state within a set.

export const CurrentNavigationItem: FC = (): ReactElement => {
  return (
    <nav aria-label="Primary navigation">
      <a href="/" aria-current="page">
        Home
      </a>

      <a href="/products">Products</a>
    </nav>
  );
};

// ---------------------------------------------------------------------
// 37. Dialogs need names
// ---------------------------------------------------------------------

// A dialog should expose a meaningful accessible name.
// A visible heading can provide that name through aria-labelledby.

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

// ---------------------------------------------------------------------
// 38. Focus management matters for dialogs
// ---------------------------------------------------------------------

// When a dialog opens, keyboard focus should be managed so users can
// interact with the dialog without having to search for it.
//
// The exact focus-management strategy depends on the dialog implementation.
//
// This example focuses on semantic structure rather than implementing
// a complete modal focus trap.

export const DialogStructure: FC = (): ReactElement => {
  return (
    <div role="dialog" aria-modal="true" aria-labelledby="dialog-heading">
      <h2 id="dialog-heading">Confirm action</h2>

      <button type="button">Cancel</button>

      <button type="button">Confirm</button>
    </div>
  );
};

// A production modal also needs correct focus placement, containment,
// and restoration when it closes.

// ---------------------------------------------------------------------
// 39. Custom widgets require complete semantics
// ---------------------------------------------------------------------

// ARIA can communicate the semantics of custom widgets, but ARIA does not
// automatically provide their keyboard behavior or interaction logic.

export const CustomSlider: FC = (): ReactElement => {
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

// A production slider must also implement the keyboard and interaction
// behavior required by the slider pattern.

// ---------------------------------------------------------------------
// 40. Screen-reader output depends on platform combinations
// ---------------------------------------------------------------------

// Screen-reader behavior is influenced by several layers:
//
// React application
//       ↓
// DOM
//       ↓
// Browser accessibility implementation
//       ↓
// Operating-system accessibility API
//       ↓
// Screen reader
//
// Different combinations can expose or announce information differently.

export const PlatformIndependentSemantics: FC = (): ReactElement => {
  return <button type="button">Save changes</button>;
};

// Therefore, code should target correct web semantics rather than trying
// to reproduce one exact screen-reader announcement.

// ---------------------------------------------------------------------
// 41. Do not write markup for one screen reader only
// ---------------------------------------------------------------------

// Avoid relying on browser- or screen-reader-specific announcement
// behavior when standard HTML and ARIA semantics can express the intent.

export const StandardSemantics: FC = (): ReactElement => {
  return <button type="button">Save</button>;
};

// Test important experiences with representative browser and
// assistive-technology combinations instead of assuming one environment
// represents all users.

// ---------------------------------------------------------------------
// 42. Screen-reader navigation is semantic navigation
// ---------------------------------------------------------------------

// Screen readers provide navigation mechanisms based on semantics such as:
//
// headings
// landmarks
// links
// buttons
// form controls
// lists
// tables
//
// Meaningful semantic markup gives those navigation mechanisms useful data.

export const NavigableStructure: FC = (): ReactElement => {
  return (
    <main>
      <h1>Settings</h1>

      <nav aria-label="Settings sections">
        <a href="#profile">Profile</a>

        <a href="#security">Security</a>
      </nav>

      <section id="profile">
        <h2>Profile</h2>
      </section>

      <section id="security">
        <h2>Security</h2>
      </section>
    </main>
  );
};

// ---------------------------------------------------------------------
// 43. Avoid unnecessary verbosity
// ---------------------------------------------------------------------

// Screen-reader users may encounter large amounts of content sequentially.
// Concise labels and descriptions reduce unnecessary cognitive and auditory
// load.
//
// Do not add redundant phrases to every control.

export const ConciseLabels: FC = (): ReactElement => {
  return (
    <div>
      <button type="button">Save</button>

      <button type="button">Cancel</button>
    </div>
  );
};

// The role is already exposed by the button element.
// There is usually no need for names such as "Save button".

// ---------------------------------------------------------------------
// 44. Dynamic React content must remain accessible
// ---------------------------------------------------------------------

// React can update parts of the DOM without performing a full page load.
// The resulting DOM still needs correct semantics and state information.

export const DynamicContent: FC = (): ReactElement => {
  const [loading, setLoading] = useState(false);

  return (
    <div>
      <button type="button" disabled={loading} onClick={() => setLoading(true)}>
        {loading ? "Saving..." : "Save"}
      </button>

      <p role="status">{loading ? "Saving changes." : ""}</p>
    </div>
  );
};

// The dynamic status is exposed separately from the button's own name.

// ---------------------------------------------------------------------
// 45. Loading states need meaningful semantics
// ---------------------------------------------------------------------

// A visual spinner alone may not communicate that an operation is in
// progress to a screen-reader user.
//
// The interface should expose useful state information.

export const LoadingState: FC = (): ReactElement => {
  const [loading, setLoading] = useState(false);

  return (
    <div>
      <button type="button" disabled={loading} onClick={() => setLoading(true)}>
        {loading ? "Saving..." : "Save"}
      </button>

      {loading && <p role="status">Saving changes.</p>}
    </div>
  );
};

// ---------------------------------------------------------------------
// 46. Disabled controls
// ---------------------------------------------------------------------

// Native disabled controls communicate their disabled state to browsers
// and assistive technologies and also receive appropriate browser behavior.

export const DisabledButton: FC = (): ReactElement => {
  return (
    <button type="button" disabled>
      Save
    </button>
  );
};

// Prefer native disabled semantics when the element supports them.

// ---------------------------------------------------------------------
// 47. aria-disabled does not behave like disabled
// ---------------------------------------------------------------------

// aria-disabled communicates a semantic state but does not automatically
// prevent interaction.
//
// When using aria-disabled on a custom widget, the application must enforce
// the corresponding interaction behavior.

export const AriaDisabledExample: FC = (): ReactElement => {
  return (
    <div role="button" aria-disabled="true" tabIndex={0}>
      Save
    </div>
  );
};

// This custom control is not automatically disabled by aria-disabled.
// Its event and keyboard logic would need to respect the state.

// ---------------------------------------------------------------------
// 48. Avoid unnecessary ARIA
// ---------------------------------------------------------------------

// Native HTML often provides the most reliable semantics with less code.
//
// Prefer:
//
// <button>Save</button>
//
// over:
//
// <div role="button" tabIndex={0}>Save</div>
//
// when a native button is suitable.

export const MinimalAccessibleMarkup: FC = (): ReactElement => {
  return <button type="button">Save</button>;
};

// ---------------------------------------------------------------------
// 49. Accessibility tree debugging
// ---------------------------------------------------------------------

// Browser developer tools can expose the accessibility tree.
// This helps verify information such as:
//
// role
// accessible name
// accessible description
// state
//
// Inspect the accessibility representation when debugging unexpected
// screen-reader behavior.

export const InspectableComponent: FC = (): ReactElement => {
  return (
    <button type="button" aria-describedby="save-help">
      Save changes
      <span id="save-help">Saves your current settings.</span>
    </button>
  );
};

// When debugging, verify what the browser exposes rather than only
// inspecting the JSX source.

// ---------------------------------------------------------------------
// 50. Screen-reader testing is not the same as automated testing
// ---------------------------------------------------------------------

// Automated accessibility testing can detect many structural problems,
// but it cannot reproduce every aspect of the user experience.
//
// Screen-reader testing can reveal issues involving:
//
// - navigation order;
// - announcements;
// - verbosity;
// - focus movement;
// - dynamic updates;
// - contextual understanding;
// - interaction patterns.

export const TestableInterface: FC = (): ReactElement => {
  return (
    <main>
      <h1>Account settings</h1>

      <button type="button">Save changes</button>
    </main>
  );
};

// Use automated checks as one layer of testing, not as a complete
// substitute for manual assistive-technology testing.

// ---------------------------------------------------------------------
// 51. Test the actual interaction
// ---------------------------------------------------------------------

// An element may have technically correct semantics but still provide a
// poor experience if focus, state, or dynamic updates are incorrect.
//
// Test the complete interaction:
//
// 1. Reach the control.
// 2. Identify its purpose.
// 3. Operate it.
// 4. Observe the resulting state.
// 5. Continue navigating.
//
// This tests the experience rather than only individual attributes.

export const InteractionExample: FC = (): ReactElement => {
  const [expanded, setExpanded] = useState(false);

  return (
    <section>
      <h2>Details</h2>

      <button
        type="button"
        aria-expanded={expanded}
        aria-controls="details-panel"
        onClick={() => setExpanded((current) => !current)}
      >
        {expanded ? "Hide details" : "Show details"}
      </button>

      {expanded && (
        <div id="details-panel">
          <p>Additional information is available.</p>
        </div>
      )}
    </section>
  );
};

// ---------------------------------------------------------------------
// 52. Complete accessible page
// ---------------------------------------------------------------------

export const AccessibleScreenReaderPage: FC = (): ReactElement => {
  const [saved, setSaved] = useState(false);

  return (
    <>
      <a href="#main-content">Skip to main content</a>

      <header>
        <h1>Example application</h1>
      </header>

      <nav aria-label="Primary navigation">
        <a href="/" aria-current="page">
          Home
        </a>

        <a href="/products">Products</a>

        <a href="/settings">Settings</a>
      </nav>

      <main id="main-content">
        <h2>Account settings</h2>

        <section aria-labelledby="profile-heading">
          <h3 id="profile-heading">Profile</h3>

          <label htmlFor="display-name">Display name</label>

          <input id="display-name" name="display-name" type="text" />
        </section>

        <section aria-labelledby="notifications-heading">
          <h3 id="notifications-heading">Notifications</h3>

          <label>
            <input type="checkbox" defaultChecked />
            Email notifications
          </label>
        </section>

        <button type="button" onClick={() => setSaved(true)}>
          Save changes
        </button>

        <p role="status">{saved ? "Changes saved." : ""}</p>
      </main>
    </>
  );
};

// This page combines several principles:
//
// - semantic HTML;
// - logical document structure;
// - headings;
// - landmarks;
// - a skip link;
// - meaningful link names;
// - native form labels;
// - native controls;
// - dynamic status feedback.
//
// No screen-reader-specific markup is needed simply because a screen
// reader is involved. The browser's accessibility tree provides the
// semantic bridge to assistive technology.

// ---------------------------------------------------------------------
// 53. Screen-reader accessibility checklist
// ---------------------------------------------------------------------
// - Use semantic HTML before adding ARIA.
// - Give interactive controls meaningful accessible names.
// - Associate labels with form controls.
// - Provide appropriate text alternatives for images.
// - Use headings to communicate document structure.
// - Use landmarks to identify major page regions.
// - Give repeated landmarks useful names when necessary.
// - Keep DOM order aligned with the intended reading and interaction order.
// - Use links for navigation and buttons for actions.
// - Make every interactive control keyboard accessible.
// - Keep exposed states synchronized with the actual UI state.
// - Use live regions only for meaningful dynamic updates.
// - Do not hide focusable content from the accessibility tree.
// - Use aria-describedby for supplementary information such as help and errors.
// - Avoid unnecessary ARIA when native HTML already provides the semantics.
// - Remember that ARIA semantics do not automatically provide interaction behavior.
// - Inspect the accessibility tree when debugging semantic problems.
// - Test important interactions with representative screen readers and browsers.
// - Treat automated accessibility testing as complementary to manual testing.

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Screen readers consume accessibility information exposed by browsers through platform accessibility APIs.
// - The accessibility tree represents semantics such as role, accessible name, description, and state.
// - Semantic HTML provides reliable information to the accessibility tree and should be preferred over unnecessary ARIA.
// - Accessible names allow screen-reader users to identify controls, landmarks, dialogs, and other nameable elements.
// - Headings and landmarks provide important navigation structures for screen-reader users.
// - Links and buttons communicate different interaction models and should be used according to their purpose.
// - Keyboard accessibility is part of the interaction model and cannot be replaced by ARIA semantics alone.
// - Dynamic React interfaces must keep accessibility semantics synchronized with changing UI state.
// - Live regions can communicate important updates that occur without moving focus.
// - aria-hidden removes content from the accessibility tree and should not be applied to focusable interactive content.
// - display:none removes content from the accessibility tree, so it should not be used for content that must remain available to screen readers.
// - Native controls such as buttons, inputs, checkboxes, and links provide behavior as well as semantics.
// - Custom ARIA widgets require developers to implement the interaction behavior expected by their roles.
// - Screen-reader output varies across browser, operating-system, and assistive-technology combinations.
// - Correct semantic markup is more robust than designing for one specific screen-reader announcement.
// - Automated accessibility checks are useful but do not replace manual screen-reader and keyboard testing.
