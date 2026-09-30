/**
 * Accessibility Testing
 * ======================
 *
 * Accessibility testing combines automated checks, manual inspection, keyboard testing,
 * assistive-technology testing, and evaluation of real interaction flows. Automated tools
 * can identify many potential problems, but they cannot determine every accessibility
 * requirement automatically, so human evaluation remains necessary.
 *
 * A useful accessibility test process checks both the rendered accessibility semantics
 * and the behavior users experience when navigating, operating, and understanding the UI.
 */

// ---------------------------------------------------------------------
// Imports
// ---------------------------------------------------------------------

import { type FC, type ReactElement, useId, useState } from "react";

// ---------------------------------------------------------------------
// 1. What accessibility testing evaluates
// ---------------------------------------------------------------------

export const AccessibilityTestingConcept: FC = (): ReactElement => {
  return (
    <main>
      <h1>Accessibility testing</h1>

      <p>Testing evaluates whether people can perceive, understand, navigate, and operate the interface.</p>
    </main>
  );
};

// Accessibility testing is broader than checking whether an element has an
// ARIA attribute. It evaluates semantics, behavior, presentation, and interaction.

// ---------------------------------------------------------------------
// 2. Automated testing
// ---------------------------------------------------------------------

export const AutomatedTesting: FC = (): ReactElement => {
  return (
    <section>
      <h2>Automated checks</h2>

      <ul>
        <li>Missing accessible names</li>

        <li>Invalid ARIA relationships</li>

        <li>Some color-contrast problems</li>

        <li>Some invalid or missing form relationships</li>
      </ul>
    </section>
  );
};

// Automated tools can quickly identify many potential accessibility barriers.
// They cannot automatically evaluate every accessibility requirement.

// ---------------------------------------------------------------------
// 3. Automated testing is not sufficient
// ---------------------------------------------------------------------

export const AutomatedTestingLimitations: FC = (): ReactElement => {
  return (
    <section>
      <h2>Human evaluation is still required</h2>

      <p>A page can pass automated checks and still be difficult to use with a keyboard or assistive technology.</p>
    </section>
  );
};

// W3C explicitly notes that accessibility evaluation tools cannot check all
// accessibility aspects automatically and that human judgment is required.

// ---------------------------------------------------------------------
// 4. Manual testing
// ---------------------------------------------------------------------

export const ManualTesting: FC = (): ReactElement => {
  return (
    <section>
      <h2>Manual checks</h2>

      <ul>
        <li>Keyboard navigation</li>

        <li>Focus order</li>

        <li>Focus visibility</li>

        <li>Accessible names</li>

        <li>Dynamic state changes</li>

        <li>Screen-reader behavior</li>
      </ul>
    </section>
  );
};

// Manual testing examines behavior that cannot reliably be inferred from static
// markup or automated rule checks.

// ---------------------------------------------------------------------
// 5. Test against WCAG success criteria
// ---------------------------------------------------------------------

export const WCAGTestBasis: FC = (): ReactElement => {
  return (
    <section>
      <h2>Test basis</h2>

      <p>Accessibility findings should be evaluated against the applicable WCAG success criteria.</p>
    </section>
  );
};

// WCAG success criteria are the normative basis for WCAG conformance.
// Individual automated or manual test rules are supporting evaluation methods.

// ---------------------------------------------------------------------
// 6. Accessibility testing layers
// ---------------------------------------------------------------------

export const TestingLayers: FC = (): ReactElement => {
  return (
    <ol>
      <li>Static and automated checks</li>

      <li>Component-level interaction tests</li>

      <li>Keyboard testing</li>

      <li>Browser accessibility inspection</li>

      <li>Screen-reader testing</li>

      <li>End-to-end user-flow testing</li>

      <li>Expert and user evaluation</li>
    </ol>
  );
};

// Different layers catch different classes of problems.
// No single testing technique provides complete coverage.

// ---------------------------------------------------------------------
// 7. Test semantic HTML
// ---------------------------------------------------------------------

export const SemanticHTMLTest: FC = (): ReactElement => {
  return (
    <main>
      <h1>Product details</h1>

      <p>Example product information.</p>

      <button type="button">Add to cart</button>
    </main>
  );
};

// Test whether native HTML elements express the intended semantics before
// investigating whether additional ARIA is necessary.

// ---------------------------------------------------------------------
// 8. Test headings
// ---------------------------------------------------------------------

export const HeadingTest: FC = (): ReactElement => {
  return (
    <main>
      <h1>Account</h1>

      <section>
        <h2>Profile</h2>

        <h2>Preferences</h2>
      </section>
    </main>
  );
};

// Test whether headings communicate the actual structure and hierarchy of the
// content rather than selecting heading levels only for visual appearance.

// ---------------------------------------------------------------------
// 9. Test landmarks
// ---------------------------------------------------------------------

export const LandmarkTest: FC = (): ReactElement => {
  return (
    <>
      <header>
        <nav aria-label="Primary">
          <a href="/">Home</a>
        </nav>
      </header>

      <main>
        <h1>Example page</h1>
      </main>

      <footer>Footer</footer>
    </>
  );
};

// Test whether major page regions have meaningful native landmarks and whether
// multiple landmarks can be distinguished by accessible names when necessary.

// ---------------------------------------------------------------------
// 10. Test links
// ---------------------------------------------------------------------

export const LinkTest: FC = (): ReactElement => {
  return (
    <nav aria-label="Primary">
      <a href="/products">Products</a>

      <a href="/account">Account</a>
    </nav>
  );
};

// Test that links have meaningful names and actually navigate to a destination.

// ---------------------------------------------------------------------
// 11. Test buttons
// ---------------------------------------------------------------------

export const ButtonTest: FC = (): ReactElement => {
  const [open, setOpen] = useState(false);

  return (
    <section>
      <button
        type="button"
        aria-expanded={open}
        onClick={() => {
          setOpen((current) => !current);
        }}
      >
        {open ? "Hide details" : "Show details"}
      </button>

      <div hidden={!open}>Details</div>
    </section>
  );
};

// Test that a button performs an action rather than being used to imitate a
// navigation link, and that its accessible state reflects the actual UI state.

// ---------------------------------------------------------------------
// 12. Test accessible names
// ---------------------------------------------------------------------

export const AccessibleNameTest: FC = (): ReactElement => {
  return (
    <button type="button" aria-label="Close dialog">
      ×
    </button>
  );
};

// Every interactive control should expose an accessible name that communicates
// its purpose in the current context.

// ---------------------------------------------------------------------
// 13. Test visible labels
// ---------------------------------------------------------------------

export const VisibleLabelTest: FC = (): ReactElement => {
  return (
    <form>
      <label htmlFor="email">Email address</label>

      <input id="email" name="email" type="email" />
    </form>
  );
};

// Test both the visible label and the programmatic relationship between the
// label and the form control.

// ---------------------------------------------------------------------
// 14. Test descriptions
// ---------------------------------------------------------------------

export const DescriptionTest: FC = (): ReactElement => {
  const descriptionId = useId();

  return (
    <form>
      <label htmlFor="password">Password</label>

      <input id="password" name="password" type="password" aria-describedby={descriptionId} />

      <p id={descriptionId}>Use at least eight characters.</p>
    </form>
  );
};

// A description provides additional information; it does not replace the
// accessible name of the control.

// ---------------------------------------------------------------------
// 15. Test required fields
// ---------------------------------------------------------------------

export const RequiredFieldTest: FC = (): ReactElement => {
  return (
    <form>
      <label htmlFor="name">Name</label>

      <input id="name" name="name" required />

      <button type="submit">Submit</button>
    </form>
  );
};

// Test whether required state is represented semantically and whether the
// interface communicates validation results clearly.

// ---------------------------------------------------------------------
// 16. Test validation errors
// ---------------------------------------------------------------------

export const ValidationErrorTest: FC = (): ReactElement => {
  const [invalid, setInvalid] = useState(false);

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        setInvalid(true);
      }}
    >
      <label htmlFor="username">Username</label>

      <input
        id="username"
        name="username"
        aria-invalid={invalid}
        aria-describedby={invalid ? "username-error" : undefined}
      />

      {invalid && <p id="username-error">Enter a username.</p>}

      <button type="submit">Continue</button>
    </form>
  );
};

// Test whether errors are programmatically associated with their controls and
// whether the user can identify and correct the invalid value.

// ---------------------------------------------------------------------
// 17. Test error focus
// ---------------------------------------------------------------------

export const ErrorFocusTest: FC = (): ReactElement => {
  return (
    <form>
      <p role="alert">Please correct the highlighted fields.</p>

      <label htmlFor="email">Email address</label>

      <input id="email" name="email" type="email" aria-invalid="true" />

      <button type="submit">Submit</button>
    </form>
  );
};

// A complete error test should also verify how focus is handled after
// submission, especially when multiple invalid fields exist.

// ---------------------------------------------------------------------
// 18. Test keyboard navigation
// ---------------------------------------------------------------------

export const KeyboardNavigationTest: FC = (): ReactElement => {
  return (
    <main>
      <a href="/products">Products</a>

      <button type="button">Add item</button>

      <input aria-label="Search" />
    </main>
  );
};

// Use the keyboard without relying on a mouse or pointer.
// Verify that every required interaction remains available.

// ---------------------------------------------------------------------
// 19. Test Tab navigation
// ---------------------------------------------------------------------

export const TabOrderTest: FC = (): ReactElement => {
  return (
    <form>
      <label htmlFor="search">Search</label>

      <input id="search" name="search" />

      <button type="submit">Search</button>

      <a href="/advanced-search">Advanced search</a>
    </form>
  );
};

// Test Tab and Shift+Tab through the interface and verify that the sequence
// follows a logical reading and interaction order.

// ---------------------------------------------------------------------
// 20. Test focus visibility
// ---------------------------------------------------------------------

export const FocusVisibilityTest: FC = (): ReactElement => {
  return (
    <button type="button" className="focus-visible-button">
      Continue
    </button>
  );
};

// Example CSS:
//
// .focus-visible-button:focus-visible {
//     outline: 3px solid currentColor;
//     outline-offset: 3px;
// }
//
// A keyboard user must be able to determine which element currently has focus.

// ---------------------------------------------------------------------
// 21. Test keyboard traps
// ---------------------------------------------------------------------

export const KeyboardTrapTest: FC = (): ReactElement => {
  return (
    <section>
      <button type="button">Previous</button>

      <button type="button">Next</button>
    </section>
  );
};

// Verify that users can move focus away from every component unless a deliberate
// modal interaction requires temporary focus containment.

// ---------------------------------------------------------------------
// 22. Test Escape behavior
// ---------------------------------------------------------------------

export const EscapeKeyTest: FC = (): ReactElement => {
  return (
    <dialog open>
      <h2>Example dialog</h2>

      <p>Press Escape to test the expected cancellation behavior.</p>

      <button type="button">Close</button>
    </dialog>
  );
};

// Dialog testing should include the Escape key where the dialog pattern
// supports cancellation through Escape.

// ---------------------------------------------------------------------
// 23. Test focus restoration
// ---------------------------------------------------------------------

export const FocusRestorationTest: FC = (): ReactElement => {
  return (
    <section>
      <button type="button">Open dialog</button>

      <p>After closing the dialog, verify where focus returns.</p>
    </section>
  );
};

// Test that closing an overlay returns focus to an appropriate element when
// the invoking element still exists.

// ---------------------------------------------------------------------
// 24. Test custom controls
// ---------------------------------------------------------------------

export const CustomControlTest: FC = (): ReactElement => {
  return (
    <div role="button" tabIndex={0}>
      Custom control
    </div>
  );
};

// Custom controls require more than a role.
// Test keyboard behavior, focus behavior, state, activation, and semantics.
// Native buttons should normally be preferred instead.

// ---------------------------------------------------------------------
// 25. Test ARIA states
// ---------------------------------------------------------------------

export const ARIAStateTest: FC = (): ReactElement => {
  const [expanded, setExpanded] = useState(false);

  return (
    <section>
      <button
        type="button"
        aria-expanded={expanded}
        onClick={() => {
          setExpanded((current) => !current);
        }}
      >
        Details
      </button>

      <div hidden={!expanded}>Details</div>
    </section>
  );
};

// Test whether ARIA state values describe the actual interface state rather
// than merely being present in the markup.

// ---------------------------------------------------------------------
// 26. Test dynamic content
// ---------------------------------------------------------------------

export const DynamicContentTest: FC = (): ReactElement => {
  const [message, setMessage] = useState("");

  return (
    <section>
      <button
        type="button"
        onClick={() => {
          setMessage("Saved successfully.");
        }}
      >
        Save
      </button>

      <p role="status">{message}</p>
    </section>
  );
};

// Dynamic updates should be tested for both visual and assistive-technology
// communication.

// ---------------------------------------------------------------------
// 27. Test live regions
// ---------------------------------------------------------------------

export const LiveRegionTest: FC = (): ReactElement => {
  return <p role="status">Changes saved.</p>;
};

// Verify that important asynchronous status changes are announced appropriately
// without forcing unnecessary focus movement.

// ---------------------------------------------------------------------
// 28. Test images
// ---------------------------------------------------------------------

export const ImageTest: FC = (): ReactElement => {
  return (
    <section>
      <img src="/example-product.jpg" alt="Example product in a black case" />

      <img src="/decorative-divider.svg" alt="" />
    </section>
  );
};

// Test whether meaningful images have useful alternatives and decorative images
// are prevented from contributing unnecessary information.

// ---------------------------------------------------------------------
// 29. Test functional images
// ---------------------------------------------------------------------

export const FunctionalImageTest: FC = (): ReactElement => {
  return (
    <a href="/products/example">
      <img src="/example-product.jpg" alt="View example product" />
    </a>
  );
};

// When an image is the content of a link or button, test the accessible name
// according to the action or destination rather than only the visual subject.

// ---------------------------------------------------------------------
// 30. Test color contrast
// ---------------------------------------------------------------------

export const ContrastTest: FC = (): ReactElement => {
  return <p className="contrast-example">Example text that must remain readable against its background.</p>;
};

// Contrast testing should include text, relevant user-interface components,
// states, and graphical information according to the applicable WCAG criteria.

// ---------------------------------------------------------------------
// 31. Test color-independent information
// ---------------------------------------------------------------------

export const ColorOnlyTest: FC = (): ReactElement => {
  return (
    <p>
      <span aria-hidden="true">●</span> Required field
    </p>
  );
};

// Test whether meaning remains available without relying only on color.

// ---------------------------------------------------------------------
// 32. Test zoom and text resizing
// ---------------------------------------------------------------------

export const ZoomTest: FC = (): ReactElement => {
  return (
    <main>
      <h1>Example content</h1>

      <p>Resize or zoom the page and verify that content remains usable and readable.</p>
    </main>
  );
};

// Test responsive behavior at increased text size and browser zoom levels
// relevant to the applicable WCAG success criteria.

// ---------------------------------------------------------------------
// 33. Test responsive layouts
// ---------------------------------------------------------------------

export const ResponsiveAccessibilityTest: FC = (): ReactElement => {
  return (
    <main>
      <section>
        <h1>Example page</h1>

        <p>The same information remains available at different viewport sizes.</p>
      </section>
    </main>
  );
};

// Accessibility testing should include layouts where responsive changes alter
// navigation, controls, content order, or visibility.

// ---------------------------------------------------------------------
// 34. Test orientation and viewport changes
// ---------------------------------------------------------------------

export const ViewportTest: FC = (): ReactElement => {
  return (
    <section>
      <p>Test the interface at different viewport dimensions and, where relevant, orientations.</p>
    </section>
  );
};

// Test that responsive transformations do not create inaccessible controls,
// clipped content, or unexpected interaction changes.

// ---------------------------------------------------------------------
// 35. Test reduced motion
// ---------------------------------------------------------------------

export const ReducedMotionTest: FC = (): ReactElement => {
  return (
    <section>
      <h2>Reduced motion</h2>

      <p>Test the interface with the operating-system reduced-motion preference enabled.</p>
    </section>
  );
};

// Verify that non-essential motion is reduced or removed while functionality
// and equivalent information remain available.

// ---------------------------------------------------------------------
// 36. Test screen-reader navigation
// ---------------------------------------------------------------------

export const ScreenReaderNavigationTest: FC = (): ReactElement => {
  return (
    <main>
      <h1>Example page</h1>

      <nav aria-label="Primary">
        <a href="/">Home</a>

        <a href="/products">Products</a>
      </nav>

      <section>
        <h2>Products</h2>

        <p>Example product information.</p>
      </section>
    </main>
  );
};

// Test navigation by headings, landmarks, links, form controls, and other
// semantic structures available through the screen reader.

// ---------------------------------------------------------------------
// 37. Test accessible names with browser inspection
// ---------------------------------------------------------------------

export const AccessibilityTreeInspection: FC = (): ReactElement => {
  return (
    <button type="button" aria-label="Delete example item">
      ×
    </button>
  );
};

// Browser developer tools can expose an accessibility tree or computed
// accessibility information. Use it to inspect names, roles, and states.

// ---------------------------------------------------------------------
// 38. Accessibility tree versus DOM inspection
// ---------------------------------------------------------------------

export const AccessibilityTreeConcept: FC = (): ReactElement => {
  return (
    <button type="button" aria-pressed="false">
      Favorite
    </button>
  );
};

// Inspecting only the DOM does not tell the complete story of what assistive
// technology receives. Accessibility-tree inspection can reveal computed roles,
// names, and states.

// ---------------------------------------------------------------------
// 39. Test dialogs
// ---------------------------------------------------------------------

export const DialogTesting: FC = (): ReactElement => {
  return (
    <dialog open>
      <h2>Confirm action</h2>

      <p>This action cannot be undone.</p>

      <button type="button">Cancel</button>

      <button type="button">Confirm</button>
    </dialog>
  );
};

// Test dialog naming, initial focus, keyboard interaction, Escape behavior,
// focus containment, and focus restoration where applicable.

// ---------------------------------------------------------------------
// 40. Test navigation
// ---------------------------------------------------------------------

export const NavigationTesting: FC = (): ReactElement => {
  return (
    <nav aria-label="Primary">
      <ul>
        <li>
          <a href="/" aria-current="page">
            Home
          </a>
        </li>

        <li>
          <a href="/products">Products</a>
        </li>
      </ul>
    </nav>
  );
};

// Test whether navigation has an appropriate landmark, meaningful link names,
// logical order, and correct current-page state.

// ---------------------------------------------------------------------
// 41. Test mobile navigation
// ---------------------------------------------------------------------

export const MobileNavigationTesting: FC = (): ReactElement => {
  const [open, setOpen] = useState(false);

  return (
    <header>
      <button
        type="button"
        aria-expanded={open}
        aria-controls="mobile-navigation"
        onClick={() => {
          setOpen((current) => !current);
        }}
      >
        Menu
      </button>

      <nav id="mobile-navigation" aria-label="Primary" hidden={!open}>
        <a href="/">Home</a>

        <a href="/products">Products</a>
      </nav>
    </header>
  );
};

// Test mobile navigation entirely with a keyboard and verify that its expanded
// state, focus behavior, and available links remain correct.

// ---------------------------------------------------------------------
// 42. Test tables
// ---------------------------------------------------------------------

export const TableTesting: FC = (): ReactElement => {
  return (
    <table>
      <caption>Example products</caption>

      <thead>
        <tr>
          <th scope="col">Product</th>

          <th scope="col">Price</th>
        </tr>
      </thead>

      <tbody>
        <tr>
          <td>Example item</td>

          <td>$10</td>
        </tr>
      </tbody>
    </table>
  );
};

// Test whether table headers and relationships allow users to understand the
// relationship between data cells and their headings.

// ---------------------------------------------------------------------
// 43. Test lists
// ---------------------------------------------------------------------

export const ListTesting: FC = (): ReactElement => {
  return (
    <ul>
      <li>Keyboard navigation</li>

      <li>Screen-reader navigation</li>

      <li>Contrast</li>
    </ul>
  );
};

// Test whether grouped content uses appropriate list semantics rather than
// relying on visual bullets or numbering alone.

// ---------------------------------------------------------------------
// 44. Test forms as complete flows
// ---------------------------------------------------------------------

export const FormFlowTesting: FC = (): ReactElement => {
  return (
    <form>
      <label htmlFor="name">Name</label>

      <input id="name" name="name" required />

      <button type="submit">Submit</button>
    </form>
  );
};

// Do not test form controls only in isolation. Test the complete flow from
// entering data through submission, validation, error correction, and success.

// ---------------------------------------------------------------------
// 45. Test form error recovery
// ---------------------------------------------------------------------

export const FormErrorRecoveryTest: FC = (): ReactElement => {
  return (
    <form>
      <p role="alert">Name is required.</p>

      <label htmlFor="name">Name</label>

      <input id="name" name="name" aria-invalid="true" aria-describedby="name-error" />

      <p id="name-error">Enter your name.</p>

      <button type="submit">Submit</button>
    </form>
  );
};

// Test whether a user can identify the invalid control, understand the error,
// move to the field, correct it, and successfully resubmit the form.

// ---------------------------------------------------------------------
// 46. Test focus order after state changes
// ---------------------------------------------------------------------

export const DynamicFocusTest: FC = (): ReactElement => {
  const [open, setOpen] = useState(false);

  return (
    <section>
      <button
        type="button"
        onClick={() => {
          setOpen(true);
        }}
      >
        Show actions
      </button>

      {open && (
        <div>
          <button type="button">Edit</button>

          <button type="button">Delete</button>
        </div>
      )}
    </section>
  );
};

// When controls appear or disappear dynamically, test whether focus remains
// logical and whether newly available controls can be reached predictably.

// ---------------------------------------------------------------------
// 47. Test disabled controls
// ---------------------------------------------------------------------

export const DisabledControlTest: FC = (): ReactElement => {
  return (
    <button type="button" disabled>
      Submit
    </button>
  );
};

// Test whether disabled controls behave as intended and whether disabled state
// is used only when the control should actually be unavailable.

// ---------------------------------------------------------------------
// 48. Test aria-disabled controls
// ---------------------------------------------------------------------

export const AriaDisabledTest: FC = (): ReactElement => {
  return (
    <div role="button" tabIndex={0} aria-disabled="true">
      Unavailable action
    </div>
  );
};

// aria-disabled communicates state but does not automatically provide native
// disabled behavior. Test the control's actual keyboard and pointer behavior.

// ---------------------------------------------------------------------
// 49. Test custom widgets
// ---------------------------------------------------------------------

export const CustomWidgetTest: FC = (): ReactElement => {
  const [selected, setSelected] = useState(false);

  return (
    <div>
      <button
        type="button"
        aria-pressed={selected}
        onClick={() => {
          setSelected((current) => !current);
        }}
      >
        Favorite
      </button>
    </div>
  );
};

// Test every interaction required by the widget pattern, including keyboard
// input, focus, state changes, names, and relationships.

// ---------------------------------------------------------------------
// 50. Test tab interfaces
// ---------------------------------------------------------------------

export const TabsTesting: FC = (): ReactElement => {
  const [selected, setSelected] = useState("overview");

  return (
    <section>
      <div role="tablist" aria-label="Product information">
        <button
          type="button"
          role="tab"
          aria-selected={selected === "overview"}
          onClick={() => {
            setSelected("overview");
          }}
        >
          Overview
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={selected === "details"}
          onClick={() => {
            setSelected("details");
          }}
        >
          Details
        </button>
      </div>

      <div role="tabpanel">{selected === "overview" ? "Overview content" : "Details content"}</div>
    </section>
  );
};

// Composite widgets require pattern-specific keyboard and state testing.
// Verify both pointer and keyboard interaction.

// ---------------------------------------------------------------------
// 51. Test loading states
// ---------------------------------------------------------------------

export const LoadingStateTest: FC = (): ReactElement => {
  return (
    <section>
      <p role="status">Loading results...</p>
    </section>
  );
};

// Test whether loading states are understandable without depending exclusively
// on animation or visual indicators.

// ---------------------------------------------------------------------
// 52. Test empty states
// ---------------------------------------------------------------------

export const EmptyStateTest: FC = (): ReactElement => {
  return (
    <section>
      <h2>Search results</h2>

      <p>No matching results were found.</p>

      <button type="button">Clear search</button>
    </section>
  );
};

// Empty states should explain the current state and provide an appropriate
// recovery or next action when one exists.

// ---------------------------------------------------------------------
// 53. Test asynchronous updates
// ---------------------------------------------------------------------

export const AsyncUpdateTest: FC = (): ReactElement => {
  return (
    <section>
      <p role="status">Profile updated.</p>
    </section>
  );
};

// Test asynchronous success, failure, and progress states because dynamic
// updates often expose accessibility problems that static pages do not.

// ---------------------------------------------------------------------
// 54. Test route changes
// ---------------------------------------------------------------------

export const RouteChangeTest: FC = (): ReactElement => {
  return (
    <main>
      <h1 tabIndex={-1}>Product details</h1>

      <p>Example product information.</p>
    </main>
  );
};

// For client-side navigation, test whether the new page content becomes
// discoverable and whether focus is moved or otherwise managed appropriately.

// ---------------------------------------------------------------------
// 55. Test skip links
// ---------------------------------------------------------------------

export const SkipLinkTest: FC = (): ReactElement => {
  return (
    <>
      <a href="#main-content">Skip to main content</a>

      <header>
        <nav aria-label="Primary">
          <a href="/">Home</a>

          <a href="/products">Products</a>
        </nav>
      </header>

      <main id="main-content" tabIndex={-1}>
        <h1>Main content</h1>
      </main>
    </>
  );
};

// Test skip links from the keyboard and verify that the destination is
// meaningful and that the repeated navigation can actually be bypassed.

// ---------------------------------------------------------------------
// 56. Test page structure
// ---------------------------------------------------------------------

export const PageStructureTest: FC = (): ReactElement => {
  return (
    <>
      <header>
        <nav aria-label="Primary">
          <a href="/">Home</a>
        </nav>
      </header>

      <main>
        <h1>Example page</h1>

        <section>
          <h2>Example section</h2>

          <p>Example content.</p>
        </section>
      </main>
    </>
  );
};

// A structural review checks headings, landmarks, lists, sections, and other
// semantic relationships before testing detailed interaction behavior.

// ---------------------------------------------------------------------
// 57. Test browser zoom
// ---------------------------------------------------------------------

export const BrowserZoomTest: FC = (): ReactElement => {
  return (
    <main>
      <h1>Example content</h1>

      <p>Increase browser zoom and verify that content remains usable.</p>
    </main>
  );
};

// Browser zoom testing should verify that controls remain available, content
// does not become inaccessible, and responsive layouts continue to function.

// ---------------------------------------------------------------------
// 58. Test text spacing
// ---------------------------------------------------------------------

export const TextSpacingTest: FC = (): ReactElement => {
  return (
    <article>
      <h1>Example article</h1>

      <p>
        This paragraph contains enough content to evaluate readability when user-controlled text spacing is increased.
      </p>
    </article>
  );
};

// Test content with increased text spacing to identify clipping, overlapping,
// or loss of content caused by rigid CSS sizing.

// ---------------------------------------------------------------------
// 59. Test browser and device differences
// ---------------------------------------------------------------------

export const BrowserTesting: FC = (): ReactElement => {
  return (
    <section>
      <p>Test important interaction flows in supported browsers and device configurations.</p>
    </section>
  );
};

// Accessibility behavior can vary across browsers and assistive technologies.
// Test representative combinations instead of assuming one environment
// represents every user.

// ---------------------------------------------------------------------
// 60. Test screen readers with representative flows
// ---------------------------------------------------------------------

export const ScreenReaderFlow: FC = (): ReactElement => {
  return (
    <main>
      <h1>Account</h1>

      <form>
        <label htmlFor="email">Email address</label>

        <input id="email" name="email" type="email" />

        <button type="submit">Save</button>
      </form>
    </main>
  );
};

// Test complete workflows rather than isolated announcements:
// navigate to the form, find the label, enter a value, submit, and evaluate
// the resulting state.

// ---------------------------------------------------------------------
// 61. Test with the accessibility tree
// ---------------------------------------------------------------------

export const AccessibilityTreeTest: FC = (): ReactElement => {
  return (
    <button type="button" aria-label="Open settings">
      ⚙
    </button>
  );
};

// Inspect the computed accessibility information to verify the expected role,
// accessible name, and state.

// ---------------------------------------------------------------------
// 62. Test with automated tooling
// ---------------------------------------------------------------------

export const AutomatedToolWorkflow: FC = (): ReactElement => {
  return (
    <ol>
      <li>Run an automated accessibility scan.</li>

      <li>Review reported violations.</li>

      <li>Inspect the relevant DOM and accessibility semantics.</li>

      <li>Verify each finding manually.</li>

      <li>Fix the underlying problem.</li>

      <li>Re-run the scan.</li>
    </ol>
  );
};

// Automated findings should be investigated rather than blindly fixed.
// Tools can produce false positives or misleading results.

// ---------------------------------------------------------------------
// 63. Automated tools and false confidence
// ---------------------------------------------------------------------

export const FalseConfidence: FC = (): ReactElement => {
  return (
    <section>
      <p>An automated scan passing does not prove that the interface is fully accessible.</p>
    </section>
  );
};

// A clean automated report is one testing signal, not a complete accessibility
// evaluation.

// ---------------------------------------------------------------------
// 64. Test rules versus WCAG
// ---------------------------------------------------------------------

export const TestRuleConcept: FC = (): ReactElement => {
  return (
    <section>
      <h2>Test rules</h2>

      <p>Test rules provide a repeatable method for evaluating particular accessibility requirements.</p>
    </section>
  );
};

// W3C's Accessibility Conformance Testing work documents rules for automated,
// semi-automated, and manual testing. These rules are informative; WCAG
// success criteria remain the normative conformance basis.

// ---------------------------------------------------------------------
// 65. Component-level accessibility tests
// ---------------------------------------------------------------------

export const ComponentAccessibilityTest: FC = (): ReactElement => {
  const [pressed, setPressed] = useState(false);

  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={() => {
        setPressed((current) => !current);
      }}
    >
      Favorite
    </button>
  );
};

// Component tests can verify semantics and behavior close to the component
// implementation.

// ---------------------------------------------------------------------
// 66. End-to-end accessibility tests
// ---------------------------------------------------------------------

export const EndToEndAccessibilityTest: FC = (): ReactElement => {
  return (
    <main>
      <h1>Checkout</h1>

      <button type="button">Continue</button>
    </main>
  );
};

// End-to-end tests can evaluate complete flows across routing, dynamic content,
// forms, overlays, and other application boundaries.

// ---------------------------------------------------------------------
// 67. Test rendered behavior, not implementation details
// ---------------------------------------------------------------------

export const BehaviorFocusedTest: FC = (): ReactElement => {
  const [open, setOpen] = useState(false);

  return (
    <section>
      <button
        type="button"
        aria-expanded={open}
        onClick={() => {
          setOpen((current) => !current);
        }}
      >
        Details
      </button>

      <div hidden={!open}>Additional information.</div>
    </section>
  );
};

// Accessibility tests should generally verify what users can perceive and
// operate rather than private component implementation details.

// ---------------------------------------------------------------------
// 68. Test accessible names by role
// ---------------------------------------------------------------------

export const RoleBasedNameTest: FC = (): ReactElement => {
  return (
    <section>
      <button type="button">Save</button>

      <button type="button" aria-label="Close dialog">
        ×
      </button>
    </section>
  );
};

// A useful test should distinguish controls by their semantic role and
// accessible name rather than relying only on CSS classes or DOM structure.

// ---------------------------------------------------------------------
// 69. Test hidden content
// ---------------------------------------------------------------------

export const HiddenContentTest: FC = (): ReactElement => {
  return (
    <section>
      <p hidden>This content is intentionally unavailable.</p>

      <p>This content is visible.</p>
    </section>
  );
};

// Verify that content intended to be hidden is actually hidden from the
// relevant interaction and accessibility mechanisms.

// ---------------------------------------------------------------------
// 70. Test visually hidden content
// ---------------------------------------------------------------------

export const VisuallyHiddenTest: FC = (): ReactElement => {
  return (
    <button type="button">
      <span className="visually-hidden">Close</span>×
    </button>
  );
};

// Visually hidden text can provide an accessible name while remaining visually
// unavailable. Test that the content remains available to assistive technology.

// ---------------------------------------------------------------------
// 71. Test focus after conditional rendering
// ---------------------------------------------------------------------

export const ConditionalFocusTest: FC = (): ReactElement => {
  const [visible, setVisible] = useState(false);

  return (
    <section>
      <button
        type="button"
        onClick={() => {
          setVisible(true);
        }}
      >
        Show action
      </button>

      {visible && <button type="button">New action</button>}
    </section>
  );
};

// When conditional rendering changes focusable content, test whether focus
// remains sensible instead of unexpectedly disappearing.

// ---------------------------------------------------------------------
// 72. Test pointer-only behavior
// ---------------------------------------------------------------------

export const PointerOnlyTest: FC = (): ReactElement => {
  return <button type="button">Activate</button>;
};

// Every pointer interaction that matters to the user should have an equivalent
// accessible interaction path, normally through native keyboard behavior.

// ---------------------------------------------------------------------
// 73. Test touch targets
// ---------------------------------------------------------------------

export const TouchTargetTest: FC = (): ReactElement => {
  return (
    <button type="button" className="touch-target">
      Menu
    </button>
  );
};

// Test touch interaction separately from keyboard interaction.
// Visual size, spacing, and accidental activation can matter on touch devices.

// ---------------------------------------------------------------------
// 74. Test pointer cancellation and activation
// ---------------------------------------------------------------------

export const ActivationTest: FC = (): ReactElement => {
  return <button type="button">Activate</button>;
};

// Interactive controls should not depend on a specific low-level pointer
// event when a native semantic control already provides appropriate activation.

// ---------------------------------------------------------------------
// 75. Test focus after errors
// ---------------------------------------------------------------------

export const ErrorRecoveryFocusTest: FC = (): ReactElement => {
  return (
    <form>
      <h1>Example form</h1>

      <p role="alert">There are errors in the form.</p>

      <label htmlFor="email">Email address</label>

      <input id="email" name="email" type="email" aria-invalid="true" />

      <button type="submit">Submit</button>
    </form>
  );
};

// Test both announcement and focus behavior after validation failure.
// Users should have a clear path to correcting errors.

// ---------------------------------------------------------------------
// 76. Test dynamic dialog content
// ---------------------------------------------------------------------

export const DynamicDialogTest: FC = (): ReactElement => {
  return (
    <dialog open>
      <h2>Example settings</h2>

      <p>Dialog content may change while the dialog is open.</p>

      <button type="button">Close</button>
    </dialog>
  );
};

// Dynamic dialog tests should cover changing content, focus, accessible name,
// Escape behavior, and the relationship between the dialog and its trigger.

// ---------------------------------------------------------------------
// 77. Test content updates without focus theft
// ---------------------------------------------------------------------

export const NoUnnecessaryFocusMovement: FC = (): ReactElement => {
  return (
    <section>
      <input aria-label="Search" />

      <p role="status">Results updated.</p>
    </section>
  );
};

// Not every dynamic update should move focus. Test that announcements and
// content changes do not unnecessarily interrupt the user's current task.

// ---------------------------------------------------------------------
// 78. Accessibility regression tests
// ---------------------------------------------------------------------

export const AccessibilityRegressionTest: FC = (): ReactElement => {
  return (
    <ul>
      <li>Accessible names remain present.</li>

      <li>Keyboard navigation remains available.</li>

      <li>Focus remains visible.</li>

      <li>Form labels remain associated.</li>

      <li>Dynamic status messages remain available.</li>
    </ul>
  );
};

// Accessibility tests are especially valuable as regression tests because
// changes to markup, component composition, or styling can remove semantics
// without producing a TypeScript error.

// ---------------------------------------------------------------------
// 79. Accessibility testing checklist
// ---------------------------------------------------------------------

export const AccessibilityTestingChecklist: FC = (): ReactElement => {
  return (
    <ul>
      <li>Check semantic HTML.</li>

      <li>Check accessible names and descriptions.</li>

      <li>Check keyboard navigation.</li>

      <li>Check focus visibility and order.</li>

      <li>Check forms and validation.</li>

      <li>Check dynamic content and live regions.</li>

      <li>Check dialogs and other overlays.</li>

      <li>Check color and contrast.</li>

      <li>Check zoom and responsive layouts.</li>

      <li>Check reduced motion.</li>

      <li>Run automated accessibility tools.</li>

      <li>Test with representative assistive technologies.</li>

      <li>Test complete user flows.</li>
    </ul>
  );
};

// A practical accessibility review combines automated, manual, and
// assistive-technology testing.

// ---------------------------------------------------------------------
// 80. Integrated accessibility testing example
// ---------------------------------------------------------------------

export const AccessibleTestingExample: FC = (): ReactElement => {
  const emailErrorId = useId();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [saved, setSaved] = useState(false);

  const emailInvalid = submitted && !email.includes("@");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    if (!email.includes("@")) {
      setSubmitted(true);
      return;
    }

    setSaved(true);
  };

  return (
    <main>
      <h1>Account settings</h1>

      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email address</label>

        <input
          id="email"
          name="email"
          type="email"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            setSubmitted(false);
            setSaved(false);
          }}
          aria-invalid={emailInvalid}
          aria-describedby={emailInvalid ? emailErrorId : undefined}
        />

        {emailInvalid && <p id={emailErrorId}>Enter a valid email address.</p>}

        <button type="submit">Save</button>
      </form>

      {saved && <p role="status">Settings saved.</p>}
    </main>
  );
};

// This example can be evaluated through multiple layers:
// semantic inspection, automated scanning, keyboard navigation, form validation,
// accessible-name testing, error recovery, and dynamic status communication.

export default AccessibleTestingExample;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Accessibility testing evaluates semantics, presentation, interaction, and user flows.
// - Automated tools can identify many potential accessibility problems quickly.
// - Automated tools cannot evaluate every accessibility requirement.
// - Human judgment remains necessary for accessibility evaluation.
// - WCAG success criteria provide the normative basis for WCAG conformance.
// - Test rules and automated checks are evaluation methods rather than substitutes for WCAG itself.
// - Manual testing should include keyboard navigation, focus, semantics, dynamic behavior, and assistive technology.
// - Test native HTML semantics before relying on custom ARIA implementations.
// - Test accessible names, descriptions, roles, states, and relationships.
// - Test keyboard operation without relying on a mouse or pointer.
// - Test Tab and Shift+Tab order and verify that focus follows a logical sequence.
// - Test focus visibility and ensure that keyboard users can identify the current focus.
// - Test dialogs, menus, tabs, custom widgets, and other composite components according to their interaction requirements.
// - Test validation errors, error recovery, and focus behavior in complete form flows.
// - Test dynamic content, live regions, loading states, success messages, and asynchronous updates.
// - Test images for appropriate text alternatives and functional-image names.
// - Test contrast and verify that meaning is not communicated through color alone.
// - Test zoom, text resizing, responsive layouts, and relevant viewport configurations.
// - Test reduced-motion behavior while preserving equivalent functionality.
// - Inspect the browser accessibility tree when verifying computed roles, names, and states.
// - Screen-reader testing should evaluate complete workflows rather than isolated announcements.
// - Automated findings should be investigated and verified instead of blindly applied.
// - A passing automated scan does not prove that an interface is fully accessible.
// - Accessibility regression tests help prevent later changes from removing semantics or interaction behavior.
// - A strong accessibility test strategy combines automated checks, manual testing, assistive-technology testing, and complete user-flow evaluation.
