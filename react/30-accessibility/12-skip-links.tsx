/**
 * Skip Links
 * ==========
 *
 * Skip links are keyboard-accessible links that allow users to bypass repeated
 * content and move directly to a meaningful destination, such as the main content.
 * They are particularly useful for keyboard users and people who navigate pages
 * sequentially because they reduce the amount of repeated content that must be traversed.
 */

// ---------------------------------------------------------------------
// Imports
// ---------------------------------------------------------------------

import { type FC, type ReactElement } from "react";

// ---------------------------------------------------------------------
// 1. Basic skip link
// ---------------------------------------------------------------------

// A skip link is usually an ordinary anchor whose href points to an element
// later in the document.
//
// The target receives an ID that exactly matches the fragment in the href.

export const BasicSkipLink: FC = (): ReactElement => {
  return (
    <>
      <a href="#main-content">Skip to main content</a>

      <header>
        <h1>Example website</h1>
      </header>

      <main id="main-content">
        <h2>Main content</h2>

        <p>The user can move directly here without traversing all preceding content.</p>
      </main>
    </>
  );
};

// The skip link itself must be keyboard reachable.

// ---------------------------------------------------------------------
// 2. Why skip links are useful
// ---------------------------------------------------------------------

// Repeated content such as site navigation, branding, and utility links can
// create many keyboard stops before the primary page content.
//
// A skip link provides a direct route past that repeated content.

export const RepeatedNavigation: FC = (): ReactElement => {
  return (
    <>
      <a href="#main-content">Skip to main content</a>

      <header>
        <a href="/">Example website</a>

        <nav aria-label="Primary navigation">
          <a href="/products">Products</a>

          <a href="/settings">Settings</a>

          <a href="/help">Help</a>
        </nav>
      </header>

      <main id="main-content">
        <h1>Product settings</h1>
      </main>
    </>
  );
};

// The link lets a keyboard user bypass the repeated header and navigation.

// ---------------------------------------------------------------------
// 3. Skip links are ordinary links
// ---------------------------------------------------------------------

// A skip link should normally use a native anchor element.
//
// The browser already provides keyboard focus, activation, and fragment
// navigation for a normal anchor with an href.

export const NativeSkipLink: FC = (): ReactElement => {
  return <a href="#content">Skip to content</a>;
};

// There is no need to implement a custom click handler for basic skip
// navigation.

// ---------------------------------------------------------------------
// 4. The target needs a matching ID
// ---------------------------------------------------------------------

// The href fragment and target ID must match.
//
// href="#main-content" targets id="main-content".

export const MatchingSkipTarget: FC = (): ReactElement => {
  return (
    <>
      <a href="#main-content">Skip to main content</a>

      <main id="main-content">
        <h1>Main content</h1>
      </main>
    </>
  );
};

// A typo or mismatched ID prevents the skip link from reaching its target.

// ---------------------------------------------------------------------
// 5. The target should identify meaningful content
// ---------------------------------------------------------------------

// The destination should normally be a meaningful point in the page,
// such as the main content area.
//
// The target should not be an arbitrary decorative element.

export const MeaningfulSkipTarget: FC = (): ReactElement => {
  return (
    <>
      <a href="#main-content">Skip to main content</a>

      <header>
        <nav aria-label="Primary navigation">
          <a href="/">Home</a>

          <a href="/products">Products</a>
        </nav>
      </header>

      <main id="main-content">
        <h1>Products</h1>

        <p>Browse the available products.</p>
      </main>
    </>
  );
};

// The main landmark provides a clear semantic destination.

// ---------------------------------------------------------------------
// 6. Skip link destination and focus
// ---------------------------------------------------------------------

// Fragment navigation identifies an element by ID. A destination may also
// need to become the programmatic focus target when the design requires the
// keyboard focus indicator to move to the skipped content.
//
// tabindex="-1" allows a normally non-tabbable element to receive focus
// programmatically without adding it to the normal Tab sequence.

export const FocusableSkipTarget: FC = (): ReactElement => {
  return (
    <>
      <a href="#main-content">Skip to main content</a>

      <header>
        <nav aria-label="Primary navigation">
          <a href="/products">Products</a>

          <a href="/settings">Settings</a>
        </nav>
      </header>

      <main id="main-content" tabIndex={-1}>
        <h1>Main content</h1>
      </main>
    </>
  );
};

// The target remains outside the normal Tab sequence while being available
// as a deliberate focus target.

// ---------------------------------------------------------------------
// 7. Browser fragment navigation
// ---------------------------------------------------------------------

// A fragment link can navigate to an element identified by its ID.
//
// The browser's fragment navigation behavior and focus behavior should not
// be assumed to be identical across every browser and configuration.

export const FragmentNavigation: FC = (): ReactElement => {
  return (
    <>
      <a href="#main-content">Skip to main content</a>

      <div>Repeated navigation content.</div>

      <main id="main-content">
        <h1>Main content</h1>
      </main>
    </>
  );
};

// Adding tabindex="-1" to the destination can make the intended programmatic
// focus target explicit when focus management is needed.

// ---------------------------------------------------------------------
// 8. Visually hidden until focused
// ---------------------------------------------------------------------

// Skip links are commonly positioned so they do not occupy the normal visual
// layout until they receive keyboard focus.
//
// They should not be removed from the accessibility tree or keyboard order.

export const FocusVisibleSkipLink: FC = (): ReactElement => {
  return (
    <a className="skip-link" href="#main-content">
      Skip to main content
    </a>
  );
};

// Example CSS:
//
// .skip-link {
//     position: absolute;
//     left: 1rem;
//     top: 1rem;
//     transform: translateY(-200%);
// }
//
// .skip-link:focus-visible {
//     transform: translateY(0);
// }

// The exact visual technique can vary as long as the link remains available
// to keyboard users and becomes clearly visible when focused.

// ---------------------------------------------------------------------
// 9. Do not use display: none
// ---------------------------------------------------------------------

// display: none removes an element from the rendered page and prevents it
// from serving as a keyboard-accessible skip link.
//
// The skip link should instead be visually positioned off-screen or otherwise
// visually hidden while remaining available to keyboard navigation.

export const VisibleWhenFocused: FC = (): ReactElement => {
  return (
    <a className="skip-link" href="#main-content">
      Skip to main content
    </a>
  );
};

// Example CSS:
//
// .skip-link {
//     position: absolute;
//     left: -9999px;
// }
//
// .skip-link:focus {
//     left: 1rem;
// }

// The implementation can use another accessible visually-hidden pattern.

// ---------------------------------------------------------------------
// 10. The skip link must remain focusable
// ---------------------------------------------------------------------

// Removing an element from the accessibility tree or keyboard navigation
// defeats the purpose of a skip link.
//
// Avoid aria-hidden="true" on the skip link.

export const FocusableSkipLink: FC = (): ReactElement => {
  return (
    <a href="#main-content" className="skip-link">
      Skip to main content
    </a>
  );
};

// aria-hidden="true" would hide the link from assistive technologies and
// create a conflict with its purpose as a keyboard-accessible control.

// ---------------------------------------------------------------------
// 11. Skip links should appear when needed
// ---------------------------------------------------------------------

// A common pattern is to keep the link visually unobtrusive until it receives
// keyboard focus.
//
// This keeps the link available without permanently occupying prominent
// screen space.

export const RevealedSkipLink: FC = (): ReactElement => {
  return (
    <a href="#main-content" className="skip-link">
      Skip to main content
    </a>
  );
};

// Example CSS:
//
// .skip-link {
//     position: absolute;
//     top: 0;
//     left: 0;
//     transform: translateY(-100%);
// }
//
// .skip-link:focus-visible {
//     transform: translateY(0);
// }

// Focus styles should be sufficiently visible against the surrounding content.

// ---------------------------------------------------------------------
// 12. Multiple skip links
// ---------------------------------------------------------------------

// A page can provide more than one bypass mechanism when there are multiple
// repeated regions that users may reasonably want to bypass.
//
// Keep the set concise and task-oriented.

export const MultipleSkipLinks: FC = (): ReactElement => {
  return (
    <>
      <nav aria-label="Skip links">
        <a href="#main-content">Skip to main content</a>

        <a href="#search">Skip to search</a>
      </nav>

      <header>
        <div id="search">
          <label htmlFor="site-search">Search</label>

          <input id="site-search" type="search" />
        </div>
      </header>

      <main id="main-content">
        <h1>Search results</h1>
      </main>
    </>
  );
};

// Multiple links are useful only when the destinations provide meaningful
// alternatives in the user's navigation flow.

// ---------------------------------------------------------------------
// 13. Skip links and landmarks
// ---------------------------------------------------------------------

// Landmarks provide structural navigation for assistive technologies.
//
// Skip links and landmarks solve related but different problems:
// the skip link provides a direct keyboard route, while landmarks provide
// semantic regions that assistive technologies can navigate between.

export const SkipLinkWithLandmarks: FC = (): ReactElement => {
  return (
    <>
      <a href="#main-content">Skip to main content</a>

      <header>
        <nav aria-label="Primary navigation">
          <a href="/">Home</a>

          <a href="/products">Products</a>
        </nav>
      </header>

      <main id="main-content">
        <h1>Products</h1>

        <aside aria-label="Related links">
          <a href="/help">Help</a>
        </aside>
      </main>
    </>
  );
};

// Providing landmarks does not make a keyboard bypass link unnecessary for
// every page structure.

// ---------------------------------------------------------------------
// 14. Skip links and the main landmark
// ---------------------------------------------------------------------

// The main element is a natural destination for a "Skip to main content"
// link.
//
// The ID belongs on the actual main content container.

export const MainLandmarkTarget: FC = (): ReactElement => {
  return (
    <>
      <a href="#main-content">Skip to main content</a>

      <header>
        <h1>Example website</h1>
      </header>

      <main id="main-content" tabIndex={-1}>
        <h2>Dashboard</h2>
      </main>
    </>
  );
};

// A page should generally have one primary main landmark.

// ---------------------------------------------------------------------
// 15. Skip links and headings
// ---------------------------------------------------------------------

// A skip link can target a heading when the heading represents the intended
// destination and focus management is deliberate.
//
// The destination should still provide a logical point from which the user
// can continue navigating.

export const HeadingSkipTarget: FC = (): ReactElement => {
  return (
    <>
      <a href="#content-heading">Skip to content</a>

      <header>
        <nav aria-label="Primary navigation">
          <a href="/">Home</a>

          <a href="/products">Products</a>
        </nav>
      </header>

      <main>
        <h1 id="content-heading" tabIndex={-1}>
          Products
        </h1>

        <p>Product information.</p>
      </main>
    </>
  );
};

// A main landmark is often a clearer destination when the intent is to
// bypass repeated page-level content.

// ---------------------------------------------------------------------
// 16. Skip links in a persistent header
// ---------------------------------------------------------------------

// Persistent navigation can become especially costly for keyboard users
// because it may appear on every page.
//
// A skip link can be placed before that repeated content.

export const PersistentHeader: FC = (): ReactElement => {
  return (
    <>
      <a href="#main-content">Skip to main content</a>

      <header>
        <a href="/">Example website</a>

        <nav aria-label="Primary navigation">
          <a href="/products">Products</a>

          <a href="/settings">Settings</a>

          <a href="/account">Account</a>
        </nav>
      </header>

      <main id="main-content" tabIndex={-1}>
        <h1>Account</h1>
      </main>
    </>
  );
};

// The skip link should occur before the repeated content it is intended to
// bypass in the document order.

// ---------------------------------------------------------------------
// 17. Skip links in application layouts
// ---------------------------------------------------------------------

// React applications commonly render a persistent application shell around
// route-specific content.
//
// The skip link can remain in that shell while its destination remains the
// main content region.

export const ApplicationLayout: FC = (): ReactElement => {
  return (
    <>
      <a href="#main-content">Skip to main content</a>

      <header>
        <a href="/">Example application</a>
      </header>

      <nav aria-label="Primary navigation">
        <a href="/dashboard">Dashboard</a>

        <a href="/settings">Settings</a>
      </nav>

      <main id="main-content" tabIndex={-1}>
        <h1>Dashboard</h1>
      </main>
    </>
  );
};

// The route content should preserve the same meaningful destination across
// application navigation.

// ---------------------------------------------------------------------
// 18. Avoid duplicate IDs
// ---------------------------------------------------------------------

// IDs must identify a unique target within the document.
//
// Duplicate IDs make fragment navigation ambiguous and can also break
// relationships that depend on ID references.

export const UniqueSkipTarget: FC = (): ReactElement => {
  return (
    <>
      <a href="#main-content">Skip to main content</a>

      <main id="main-content">
        <h1>Products</h1>
      </main>
    </>
  );
};

// Generate stable, unique IDs when the destination is rendered dynamically.

// ---------------------------------------------------------------------
// 19. Multiple instances require unique targets
// ---------------------------------------------------------------------

// A reusable component should not hard-code the same target ID when multiple
// instances can appear on the same page.
//
// IDs should remain unique within the document.

interface SkipLinkProps {
  readonly targetId: string;
}

export const ReusableSkipLink: FC<SkipLinkProps> = ({ targetId }): ReactElement => {
  return <a href={`#${targetId}`}>Skip to content</a>;
};

// The caller is responsible for supplying a unique target ID.

// ---------------------------------------------------------------------
// 20. Skip link component
// ---------------------------------------------------------------------

interface SkipLinkComponentProps {
  readonly targetId: string;
  readonly children?: ReactElement;
}

export const SkipLink: FC<SkipLinkComponentProps> = ({ targetId, children }): ReactElement => {
  return (
    <a className="skip-link" href={`#${targetId}`}>
      {children ?? "Skip to main content"}
    </a>
  );
};

// The component keeps the behavior native while allowing the destination
// and visible label to be configured.

// ---------------------------------------------------------------------
// 21. Avoid JavaScript for basic skip navigation
// ---------------------------------------------------------------------

// A basic skip link does not require React state, an event handler, or
// imperative DOM manipulation.
//
// The fragment link is already a browser feature.

export const JavaScriptFreeSkipLink: FC = (): ReactElement => {
  return <a href="#main-content">Skip to main content</a>;
};

// Use JavaScript only when the application has an additional focus-management
// requirement that cannot be handled by the native fragment interaction.

// ---------------------------------------------------------------------
// 22. Programmatic focus with a ref
// ---------------------------------------------------------------------

// When explicit focus movement is necessary, React refs provide access to
// the DOM element after it has been rendered.

export const ProgrammaticSkipFocus: FC = (): ReactElement => {
  return (
    <>
      <a href="#main-content">Skip to main content</a>

      <main id="main-content" tabIndex={-1}>
        <h1>Main content</h1>
      </main>
    </>
  );
};

// A plain fragment link is preferable when it already provides the required
// interaction. Do not add imperative focus logic without a concrete need.

// ---------------------------------------------------------------------
// 23. Skip links and fixed headers
// ---------------------------------------------------------------------

// A fixed or sticky header can visually cover a fragment destination.
//
// CSS scroll-margin can provide spacing when the browser scrolls an element
// into view.

export const FixedHeaderTarget: FC = (): ReactElement => {
  return (
    <>
      <a href="#main-content">Skip to main content</a>

      <header className="site-header">
        <nav aria-label="Primary navigation">
          <a href="/">Home</a>

          <a href="/products">Products</a>
        </nav>
      </header>

      <main id="main-content" className="main-content" tabIndex={-1}>
        <h1>Products</h1>
      </main>
    </>
  );
};

// Example CSS:
//
// .main-content {
//     scroll-margin-top: 5rem;
// }
//
// The value should account for the actual fixed header dimensions.

// ---------------------------------------------------------------------
// 24. Skip links and scroll behavior
// ---------------------------------------------------------------------

// Smooth scrolling is a visual preference, not the purpose of a skip link.
//
// Motion preferences should be respected if smooth scrolling is used.

export const ScrollTarget: FC = (): ReactElement => {
  return (
    <main id="main-content" tabIndex={-1}>
      <h1>Main content</h1>
    </main>
  );
};

// Example CSS:
//
// html {
//     scroll-behavior: smooth;
// }
//
// @media (prefers-reduced-motion: reduce) {
//     html {
//         scroll-behavior: auto;
//     }
// }

// Skip navigation should remain functional without smooth scrolling.

// ---------------------------------------------------------------------
// 25. Skip links and SPA navigation
// ---------------------------------------------------------------------

// Single-page applications can update page content without performing a full
// document navigation.
//
// The application should preserve a meaningful focus strategy when the
// route or primary content changes.

export const SpaMainContent: FC = (): ReactElement => {
  return (
    <main id="main-content" tabIndex={-1}>
      <h1>Dashboard</h1>

      <p>Current page content.</p>
    </main>
  );
};

// A router may require additional route-level focus management beyond the
// basic skip link itself.

// ---------------------------------------------------------------------
// 26. Skip links should have descriptive text
// ---------------------------------------------------------------------

// The visible label should communicate where the link will take the user.
//
// "Skip to main content" is appropriate when the target is the main content.

export const DescriptiveSkipLink: FC = (): ReactElement => {
  return (
    <>
      <a href="#main-content">Skip to main content</a>

      <main id="main-content">
        <h1>Products</h1>
      </main>
    </>
  );
};

// Avoid vague labels such as "Click here" or "Skip" when the destination
// can be stated explicitly.

// ---------------------------------------------------------------------
// 27. Do not make every section a skip link
// ---------------------------------------------------------------------

// Skip links should solve a real navigation problem.
//
// A long list of skip links can create another set of keyboard stops and
// make the beginning of the page harder to navigate.

export const FocusedBypassNavigation: FC = (): ReactElement => {
  return (
    <>
      <a href="#main-content">Skip to main content</a>

      <header>
        <nav aria-label="Primary navigation">
          <a href="/">Home</a>

          <a href="/products">Products</a>

          <a href="/settings">Settings</a>
        </nav>
      </header>

      <main id="main-content">
        <h1>Settings</h1>
      </main>
    </>
  );
};

// Keep bypass mechanisms limited to useful navigation destinations.

// ---------------------------------------------------------------------
// 28. Skip links are not a replacement for landmarks
// ---------------------------------------------------------------------

// A skip link provides a sequential keyboard shortcut.
//
// Landmarks provide structural navigation to users of assistive technologies.
//
// Both mechanisms can coexist.

export const ComplementaryNavigation: FC = (): ReactElement => {
  return (
    <>
      <a href="#main-content">Skip to main content</a>

      <header>
        <nav aria-label="Primary navigation">
          <a href="/">Home</a>

          <a href="/products">Products</a>
        </nav>
      </header>

      <main id="main-content">
        <h1>Products</h1>

        <aside aria-label="Related content">
          <a href="/help">Help</a>
        </aside>
      </main>
    </>
  );
};

// The two mechanisms address different navigation needs.

// ---------------------------------------------------------------------
// 29. Skip links and screen readers
// ---------------------------------------------------------------------

// Screen-reader users may navigate by landmarks, headings, links, or other
// semantic structures rather than pressing Tab through every element.
//
// A skip link still provides a useful sequential keyboard-navigation
// mechanism and can also be discovered as a link.

export const ScreenReaderNavigation: FC = (): ReactElement => {
  return (
    <>
      <a href="#main-content">Skip to main content</a>

      <header>
        <nav aria-label="Primary navigation">
          <a href="/">Home</a>

          <a href="/products">Products</a>
        </nav>
      </header>

      <main id="main-content">
        <h1>Products</h1>
      </main>
    </>
  );
};

// Semantic landmarks and headings remain important even when skip links
// are provided.

// ---------------------------------------------------------------------
// 30. Skip links and repeated blocks
// ---------------------------------------------------------------------

// Repeated content is not limited to global navigation.
//
// A page can contain repeated toolbars, filters, advertisements, or other
// blocks that create unnecessary sequential navigation.

export const RepeatedToolbar: FC = (): ReactElement => {
  return (
    <>
      <a href="#results">Skip to results</a>

      <div>
        <button type="button">Filter</button>

        <button type="button">Sort</button>
      </div>

      <main id="results">
        <h1>Search results</h1>
      </main>
    </>
  );
};

// The destination should correspond to a meaningful point in the task.

// ---------------------------------------------------------------------
// 31. Skip links and focus styling
// ---------------------------------------------------------------------

// The skip link itself needs a visible focus indication.
//
// Its focus state should remain distinguishable from surrounding content.

export const StyledSkipLink: FC = (): ReactElement => {
  return (
    <a href="#main-content" className="skip-link">
      Skip to main content
    </a>
  );
};

// Example CSS:
//
// .skip-link:focus-visible {
//     outline: 3px solid currentColor;
//     outline-offset: 2px;
// }

// The focus indicator should not depend solely on color.

// ---------------------------------------------------------------------
// 32. Skip links and keyboard-only users
// ---------------------------------------------------------------------

// A skip link is particularly useful when it appears as the first
// keyboard-focusable element on a page.
//
// Mouse users do not need to use it to reach content.

export const FirstKeyboardStop: FC = (): ReactElement => {
  return (
    <>
      <a href="#main-content">Skip to main content</a>

      <header>
        <nav aria-label="Primary navigation">
          <a href="/">Home</a>

          <a href="/products">Products</a>
        </nav>
      </header>

      <main id="main-content">
        <h1>Products</h1>
      </main>
    </>
  );
};

// The skip link should appear before the content it bypasses in source order.

// ---------------------------------------------------------------------
// 33. Skip links and keyboard testing
// ---------------------------------------------------------------------

// A practical test begins with the page loaded and no pointer interaction.
//
// Press Tab and verify that the skip link receives focus.
// Activate it and verify that the intended destination is reached.

export const KeyboardTestTarget: FC = (): ReactElement => {
  return (
    <>
      <a href="#main-content">Skip to main content</a>

      <header>
        <nav aria-label="Primary navigation">
          <a href="/">Home</a>

          <a href="/products">Products</a>

          <a href="/settings">Settings</a>
        </nav>
      </header>

      <main id="main-content" tabIndex={-1}>
        <h1>Main content</h1>
      </main>
    </>
  );
};

// Also verify that subsequent Tab presses continue from a sensible point.

// ---------------------------------------------------------------------
// 34. Skip-link testing checklist
// ---------------------------------------------------------------------
// - Start with the page loaded and do not use the mouse.
// - Press Tab and verify that the skip link can receive focus.
// - Verify that its focus state is clearly visible.
// - Activate the link with the keyboard.
// - Verify that the intended destination is reached.
// - Verify that the destination is not hidden behind fixed UI.
// - Verify that the destination provides a meaningful place to continue.
// - Verify that the target ID exists.
// - Verify that the target ID is unique.
// - Test the link after route changes in a single-page application.
// - Test keyboard navigation after the skip action.
// - Test with different viewport sizes.
// - Test with browser zoom and responsive layouts.
// - Test with assistive technology where available.

// ---------------------------------------------------------------------
// 35. Complete skip-link pattern
// ---------------------------------------------------------------------

// This example combines the core pieces:
//
// - the skip link appears before repeated navigation;
// - the target is the main landmark;
// - the target can receive programmatic focus;
// - the link remains available to keyboard users;
// - the navigation retains native link semantics.

export const CompleteSkipLinkPattern: FC = (): ReactElement => {
  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>

      <header>
        <a href="/">Example website</a>

        <nav aria-label="Primary navigation">
          <a href="/products">Products</a>

          <a href="/settings">Settings</a>

          <a href="/help">Help</a>
        </nav>
      </header>

      <main id="main-content" tabIndex={-1}>
        <h1>Account settings</h1>

        <p>Manage your account settings here.</p>

        <button type="button">Save changes</button>
      </main>
    </>
  );
};

// Example CSS:
//
// .skip-link {
//     position: absolute;
//     left: 1rem;
//     top: 1rem;
//     z-index: 1000;
//     transform: translateY(-200%);
// }
//
// .skip-link:focus-visible {
//     transform: translateY(0);
//     outline: 3px solid currentColor;
//     outline-offset: 2px;
// }
//
// #main-content {
//     scroll-margin-top: 5rem;
// }
//
// The exact values should be adapted to the application's layout.

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Skip links provide a keyboard-accessible shortcut past repeated content.
// - A native anchor with an href fragment is the simplest skip-link implementation.
// - The href fragment must match the ID of the intended destination.
// - The destination should represent a meaningful point in the page, commonly the main content.
// - The skip link should appear before the repeated content it bypasses in document order.
// - Skip links must remain keyboard accessible and must not be hidden with display:none or aria-hidden.
// - A skip link is commonly visually hidden until it receives keyboard focus.
// - The focused skip link must have a clear visible focus indication.
// - tabindex="-1" can make a non-tabbable destination available for deliberate programmatic focus.
// - Native fragment navigation should be preferred over unnecessary JavaScript.
// - Fixed or sticky UI should not obscure the destination after skip navigation.
// - scroll-margin can provide space around a destination when the layout requires it.
// - IDs used as skip destinations must be unique within the document.
// - Reusable skip-link components should allow unique target IDs when multiple destinations exist.
// - Multiple skip links can be useful when several meaningful repeated regions need bypass mechanisms.
// - Skip links and landmarks provide different navigation mechanisms and can be used together.
// - Single-page applications may require additional focus management when primary content changes.
// - Skip-link labels should describe the destination clearly.
// - Skip links should solve a real navigation problem rather than create unnecessary keyboard stops.
// - Keyboard testing should verify focus, activation, destination visibility, and continued navigation.
