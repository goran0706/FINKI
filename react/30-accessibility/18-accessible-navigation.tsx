/**
 * Accessible Navigation
 * ======================
 *
 * Accessible navigation provides predictable ways for users to move between
 * pages, sections, and destinations. Semantic navigation landmarks, meaningful
 * link names, current-page state, logical source order, keyboard access, and
 * appropriate disclosure behavior allow the same navigation structure to work
 * across visual, keyboard, and assistive technology interfaces.
 */

// ---------------------------------------------------------------------
// Imports
// ---------------------------------------------------------------------

import { type FC, type KeyboardEvent, type ReactElement, useId, useState } from "react";

// ---------------------------------------------------------------------
// 1. Navigation landmarks
// ---------------------------------------------------------------------

// The <nav> element identifies a major group of navigation links.
// It has an implicit navigation landmark role.

export const NavigationLandmark: FC = (): ReactElement => {
  return (
    <nav>
      <a href="/">Home</a>

      <a href="/about">About</a>

      <a href="/contact">Contact</a>
    </nav>
  );
};

// Semantic HTML should be preferred over recreating native semantics with
// generic elements and ARIA.

// ---------------------------------------------------------------------
// 2. Labeling navigation landmarks
// ---------------------------------------------------------------------

// A page can contain multiple navigation landmarks.
// Distinct purposes should be distinguishable with accessible names.

export const LabeledNavigation: FC = (): ReactElement => {
  return (
    <div>
      <nav aria-label="Primary">
        <a href="/">Home</a>

        <a href="/products">Products</a>
      </nav>

      <nav aria-label="Footer">
        <a href="/privacy">Privacy</a>

        <a href="/contact">Contact</a>
      </nav>
    </div>
  );
};

// The label should describe the purpose of the navigation.
// The word "navigation" does not need to be repeated in the label because
// the landmark role already communicates that information.

// ---------------------------------------------------------------------
// 3. Prefer <nav> over role="navigation"
// ---------------------------------------------------------------------

export const SemanticNavigation: FC = (): ReactElement => {
  return (
    <nav aria-label="Primary">
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

// role="navigation" is useful when semantic HTML cannot be used.
// It should not normally be added redundantly to <nav>.

// ---------------------------------------------------------------------
// 4. Navigation is more than a visual menu
// ---------------------------------------------------------------------

export const NavigationStructure: FC = (): ReactElement => {
  return (
    <header>
      <nav aria-label="Primary">
        <ul>
          <li>
            <a href="/">Home</a>
          </li>

          <li>
            <a href="/account">Account</a>
          </li>

          <li>
            <a href="/help">Help</a>
          </li>
        </ul>
      </nav>
    </header>
  );
};

// CSS may transform this list into a horizontal navigation bar, but the
// underlying semantic structure remains a collection of links.

// ---------------------------------------------------------------------
// 5. Navigation links should be real links
// ---------------------------------------------------------------------

export const RealNavigationLinks: FC = (): ReactElement => {
  return (
    <nav aria-label="Primary">
      <a href="/">Home</a>

      <a href="/products">Products</a>

      <a href="/contact">Contact</a>
    </nav>
  );
};

// An <a> with href provides native link semantics and keyboard behavior.
// A navigation destination should not normally be simulated with a button.

// ---------------------------------------------------------------------
// 6. Links versus buttons
// ---------------------------------------------------------------------

export const LinkOrButton: FC = (): ReactElement => {
  const [open, setOpen] = useState(false);

  return (
    <nav aria-label="Primary">
      <a href="/account">Account</a>

      <button
        type="button"
        onClick={() => {
          setOpen((current) => !current);
        }}
        aria-expanded={open}
      >
        More
      </button>
    </nav>
  );
};

// Use a link when activation navigates to a destination.
// Use a button when activation performs an action or changes interface state.

// ---------------------------------------------------------------------
// 7. Avoid clickable generic elements
// ---------------------------------------------------------------------

export const AvoidGenericNavigationControls: FC = (): ReactElement => {
  return (
    <nav aria-label="Primary">
      <a href="/products">Products</a>
    </nav>
  );
};

// A generic div or span with an onClick handler does not automatically gain
// the keyboard, focus, semantics, or activation behavior of a native link.

// ---------------------------------------------------------------------
// 8. Navigation link names
// ---------------------------------------------------------------------

export const MeaningfulLinkNames: FC = (): ReactElement => {
  return (
    <nav aria-label="Primary">
      <a href="/products">Products</a>

      <a href="/support">Support</a>

      <a href="/account">Account settings</a>
    </nav>
  );
};

// Link text should identify the destination or purpose without requiring
// visual context that is unavailable to the user.

// ---------------------------------------------------------------------
// 9. Avoid repeated "Read more" links
// ---------------------------------------------------------------------

export const DistinctNavigationLinks: FC = (): ReactElement => {
  return (
    <nav aria-label="Articles">
      <a href="/articles/accessibility">Accessibility fundamentals</a>

      <a href="/articles/forms">Accessible forms</a>

      <a href="/articles/navigation">Accessible navigation</a>
    </nav>
  );
};

// Identical link text becomes difficult to distinguish when links are
// encountered outside their surrounding visual context.

// ---------------------------------------------------------------------
// 10. Navigation link descriptions
// ---------------------------------------------------------------------

export const ContextualLinks: FC = (): ReactElement => {
  return (
    <nav aria-label="Resources">
      <a href="/documentation">Documentation</a>

      <a href="/support">Support center</a>
    </nav>
  );
};

// Surrounding content can provide context, but the link itself should still
// have a meaningful accessible name.

// ---------------------------------------------------------------------
// 11. Current page
// ---------------------------------------------------------------------

export const CurrentPageNavigation: FC = (): ReactElement => {
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

        <li>
          <a href="/account">Account</a>
        </li>
      </ul>
    </nav>
  );
};

// aria-current="page" identifies the link representing the current page.
// Only the current item in the relevant set should be marked current.

// ---------------------------------------------------------------------
// 12. aria-current is not selected state
// ---------------------------------------------------------------------

export const CurrentVersusSelected: FC = (): ReactElement => {
  return (
    <div>
      <nav aria-label="Primary">
        <a href="/account" aria-current="page">
          Account
        </a>
      </nav>

      <div role="tablist" aria-label="Account sections">
        <button type="button" role="tab" aria-selected="true">
          Profile
        </button>

        <button type="button" role="tab" aria-selected="false">
          Security
        </button>
      </div>
    </div>
  );
};

// aria-current describes the current item in a related set.
// aria-selected describes selection in widgets such as tabs and listboxes.

// ---------------------------------------------------------------------
// 13. Current navigation step
// ---------------------------------------------------------------------

export const CurrentStepNavigation: FC = (): ReactElement => {
  return (
    <nav aria-label="Checkout steps">
      <ol>
        <li>
          <a href="/checkout/cart">Cart</a>
        </li>

        <li>
          <a href="/checkout/details" aria-current="step">
            Details
          </a>
        </li>

        <li>
          <a href="/checkout/payment">Payment</a>
        </li>
      </ol>
    </nav>
  );
};

// aria-current="step" is appropriate when a navigation set represents
// ordered steps in a process.

// ---------------------------------------------------------------------
// 14. Breadcrumb navigation
// ---------------------------------------------------------------------

export const BreadcrumbNavigation: FC = (): ReactElement => {
  return (
    <nav aria-label="Breadcrumb">
      <ol>
        <li>
          <a href="/">Home</a>
        </li>

        <li>
          <a href="/products">Products</a>
        </li>

        <li>
          <span aria-current="page">Example product</span>
        </li>
      </ol>
    </nav>
  );
};

// Breadcrumbs are navigation, so <nav> provides the navigation landmark.
// The current page can be identified with aria-current="page".

// ---------------------------------------------------------------------
// 15. Breadcrumb link for the current page
// ---------------------------------------------------------------------

export const CurrentBreadcrumbLink: FC = (): ReactElement => {
  return (
    <nav aria-label="Breadcrumb">
      <ol>
        <li>
          <a href="/">Home</a>
        </li>

        <li>
          <a href="/products">Products</a>
        </li>

        <li>
          <a href="/products/example" aria-current="page">
            Example product
          </a>
        </li>
      </ol>
    </nav>
  );
};

// The current breadcrumb item may be a link or non-link depending on the
// application's navigation model.

// ---------------------------------------------------------------------
// 16. Navigation lists
// ---------------------------------------------------------------------

export const NavigationList: FC = (): ReactElement => {
  return (
    <nav aria-label="Primary">
      <ul>
        <li>
          <a href="/">Home</a>
        </li>

        <li>
          <a href="/about">About</a>
        </li>

        <li>
          <a href="/contact">Contact</a>
        </li>
      </ul>
    </nav>
  );
};

// Lists communicate that the navigation contains a collection of related
// items. They also provide useful structure to assistive technologies.

// ---------------------------------------------------------------------
// 17. Navigation order
// ---------------------------------------------------------------------

export const LogicalNavigationOrder: FC = (): ReactElement => {
  return (
    <nav aria-label="Primary">
      <ul>
        <li>
          <a href="/">Home</a>
        </li>

        <li>
          <a href="/products">Products</a>
        </li>

        <li>
          <a href="/support">Support</a>
        </li>
      </ul>
    </nav>
  );
};

// The DOM order should represent the intended navigation order.
// CSS should not be required to understand the sequence.

// ---------------------------------------------------------------------
// 18. Skip links
// ---------------------------------------------------------------------

export const SkipLink: FC = (): ReactElement => {
  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      <nav aria-label="Primary">
        <a href="/">Home</a>

        <a href="/products">Products</a>
      </nav>

      <main id="main-content">
        <h1>Products</h1>
      </main>
    </>
  );
};

// A skip link provides a direct keyboard path past repeated navigation.
// It complements, rather than replaces, semantic landmarks.

// ---------------------------------------------------------------------
// 19. Skip link focus target
// ---------------------------------------------------------------------

export const FocusableSkipTarget: FC = (): ReactElement => {
  return (
    <>
      <a href="#main-content">Skip to main content</a>

      <nav aria-label="Primary">
        <a href="/">Home</a>

        <a href="/products">Products</a>
      </nav>

      <main id="main-content" tabIndex={-1}>
        <h1>Products</h1>
      </main>
    </>
  );
};

// tabIndex={-1} allows the target to receive programmatic focus without
// adding it to the normal sequential Tab order.

// ---------------------------------------------------------------------
// 20. Multiple navigation landmarks
// ---------------------------------------------------------------------

export const MultipleNavigationLandmarks: FC = (): ReactElement => {
  return (
    <>
      <nav aria-label="Primary">
        <a href="/">Home</a>

        <a href="/products">Products</a>
      </nav>

      <nav aria-label="Account">
        <a href="/account">Profile</a>

        <a href="/account/security">Security</a>
      </nav>
    </>
  );
};

// Multiple navigation landmarks should have distinguishable labels when
// their purposes differ.

// ---------------------------------------------------------------------
// 21. Repeated navigation landmarks
// ---------------------------------------------------------------------

export const RepeatedNavigation: FC = (): ReactElement => {
  return (
    <>
      <header>
        <nav aria-label="Primary">
          <a href="/">Home</a>

          <a href="/products">Products</a>
        </nav>
      </header>

      <footer>
        <nav aria-label="Primary">
          <a href="/">Home</a>

          <a href="/products">Products</a>
        </nav>
      </footer>
    </>
  );
};

// If repeated navigation landmarks contain the same set of links and serve
// the same purpose, using the same label can identify them consistently.

// ---------------------------------------------------------------------
// 22. Search navigation
// ---------------------------------------------------------------------

export const SearchNavigation: FC = (): ReactElement => {
  return (
    <form role="search" action="/search" method="get">
      <label htmlFor="site-search">Search</label>

      <input id="site-search" name="query" type="search" />

      <button type="submit">Search</button>
    </form>
  );
};

// A search landmark groups controls that provide a search facility.
// Use the appropriate semantic search element when the target environment
// supports it; role="search" is also available on a suitable container.

// ---------------------------------------------------------------------
// 23. Navigation versus search
// ---------------------------------------------------------------------

export const NavigationAndSearch: FC = (): ReactElement => {
  return (
    <header>
      <nav aria-label="Primary">
        <a href="/">Home</a>

        <a href="/products">Products</a>
      </nav>

      <form role="search">
        <label htmlFor="query">Search</label>

        <input id="query" name="query" type="search" />

        <button type="submit">Search</button>
      </form>
    </header>
  );
};

// Search is a distinct landmark from ordinary site navigation.

// ---------------------------------------------------------------------
// 24. Navigation links in a footer
// ---------------------------------------------------------------------

export const FooterNavigation: FC = (): ReactElement => {
  return (
    <footer>
      <nav aria-label="Footer">
        <ul>
          <li>
            <a href="/privacy">Privacy</a>
          </li>

          <li>
            <a href="/terms">Terms</a>
          </li>

          <li>
            <a href="/contact">Contact</a>
          </li>
        </ul>
      </nav>
    </footer>
  );
};

// Footer navigation is still navigation and can be represented with <nav>.

// ---------------------------------------------------------------------
// 25. Section navigation
// ---------------------------------------------------------------------

export const SectionNavigation: FC = (): ReactElement => {
  return (
    <nav aria-label="On this page">
      <ul>
        <li>
          <a href="#overview">Overview</a>
        </li>

        <li>
          <a href="#requirements">Requirements</a>
        </li>

        <li>
          <a href="#examples">Examples</a>
        </li>
      </ul>
    </nav>
  );
};

// Navigation can point to sections within the same document as well as
// separate documents.

// ---------------------------------------------------------------------
// 26. Heading structure for navigation
// ---------------------------------------------------------------------

export const NavigationWithHeading: FC = (): ReactElement => {
  return (
    <nav aria-labelledby="section-navigation-title">
      <h2 id="section-navigation-title">On this page</h2>

      <ul>
        <li>
          <a href="#overview">Overview</a>
        </li>

        <li>
          <a href="#examples">Examples</a>
        </li>
      </ul>
    </nav>
  );
};

// A visible heading can provide an accessible name through aria-labelledby.
// This is useful when the navigation has a visible title.

// ---------------------------------------------------------------------
// 27. Navigation with a hidden label
// ---------------------------------------------------------------------

export const VisuallyHiddenNavigationLabel: FC = (): ReactElement => {
  return (
    <nav aria-label="Primary">
      <ul>
        <li>
          <a href="/">Home</a>
        </li>

        <li>
          <a href="/about">About</a>
        </li>
      </ul>
    </nav>
  );
};

// aria-label is useful when a visible heading would add unnecessary visual
// content. The label should remain concise and descriptive.

// ---------------------------------------------------------------------
// 28. Navigation does not require JavaScript
// ---------------------------------------------------------------------

export const StaticNavigation: FC = (): ReactElement => {
  return (
    <nav aria-label="Primary">
      <ul>
        <li>
          <a href="/">Home</a>
        </li>

        <li>
          <a href="/products">Products</a>
        </li>

        <li>
          <a href="/support">Support</a>
        </li>
      </ul>
    </nav>
  );
};

// Basic navigation should work with native HTML links without requiring
// client-side JavaScript.

// ---------------------------------------------------------------------
// 29. Client-side navigation
// ---------------------------------------------------------------------

export const ClientNavigationConcept: FC = (): ReactElement => {
  return (
    <nav aria-label="Primary">
      <a href="/dashboard">Dashboard</a>

      <a href="/settings">Settings</a>
    </nav>
  );
};

// Client-side routing can replace full document loads, but it should preserve
// the expected link semantics and provide an accessible destination state.

// ---------------------------------------------------------------------
// 30. Focus after client-side navigation
// ---------------------------------------------------------------------

export const NavigationDestination: FC = (): ReactElement => {
  return (
    <main>
      <h1>Settings</h1>

      <p>Update your preferences here.</p>
    </main>
  );
};

// In a single-page application, navigation changes may not naturally move
// focus to the newly rendered content. The routing layer should manage focus
// so users understand that navigation completed.

// ---------------------------------------------------------------------
// 31. Navigation destination heading
// ---------------------------------------------------------------------

export const NavigatedPage: FC = (): ReactElement => {
  return (
    <main>
      <h1 tabIndex={-1}>Account settings</h1>

      <p>Manage your account preferences.</p>
    </main>
  );
};

// A page heading can serve as a programmatic focus target after client-side
// navigation when that is the appropriate focus-management strategy.

// ---------------------------------------------------------------------
// 32. Active navigation styling
// ---------------------------------------------------------------------

export const ActiveNavigation: FC = (): ReactElement => {
  return (
    <nav aria-label="Primary">
      <a href="/" aria-current="page">
        Home
      </a>

      <a href="/products">Products</a>
    </nav>
  );
};

// Visual active-state styling should be accompanied by semantic state such as
// aria-current when the item represents the current page.

// ---------------------------------------------------------------------
// 33. Do not mark every navigation link current
// ---------------------------------------------------------------------

export const SingleCurrentItem: FC = (): ReactElement => {
  return (
    <nav aria-label="Primary">
      <a href="/products" aria-current="page">
        Products
      </a>

      <a href="/products/new">New product</a>

      <a href="/support">Support</a>
    </nav>
  );
};

// aria-current identifies the current item in the relevant set.
// It should not be applied indiscriminately to every related link.

// ---------------------------------------------------------------------
// 34. Navigation disclosure
// ---------------------------------------------------------------------

export const DisclosureNavigation: FC = (): ReactElement => {
  const [open, setOpen] = useState(false);

  return (
    <nav aria-label="Primary">
      <a href="/">Home</a>

      <button
        type="button"
        aria-expanded={open}
        aria-controls="products-navigation"
        onClick={() => {
          setOpen((current) => !current);
        }}
      >
        Products
      </button>

      {open && (
        <div id="products-navigation">
          <a href="/products">All products</a>

          <a href="/products/example">Example product</a>
        </div>
      )}
    </nav>
  );
};

// A disclosure button is appropriate when a control expands or collapses
// navigation content rather than directly navigating.

// ---------------------------------------------------------------------
// 35. aria-expanded describes disclosure state
// ---------------------------------------------------------------------

export const ExpandedNavigation: FC = (): ReactElement => {
  const [open, setOpen] = useState(false);

  return (
    <nav aria-label="Primary">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="more-links"
        onClick={() => {
          setOpen((current) => !current);
        }}
      >
        More
      </button>

      <div id="more-links" hidden={!open}>
        <a href="/about">About</a>

        <a href="/contact">Contact</a>
      </div>
    </nav>
  );
};

// aria-expanded communicates the state of the disclosure control.
// aria-controls identifies the controlled region when there is a useful
// relationship between the control and its target.

// ---------------------------------------------------------------------
// 36. Disclosure versus menu
// ---------------------------------------------------------------------

export const DisclosureVersusMenu: FC = (): ReactElement => {
  const [open, setOpen] = useState(false);

  return (
    <nav aria-label="Primary">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => {
          setOpen((current) => !current);
        }}
      >
        Products
      </button>

      <div hidden={!open}>
        <a href="/products">Products overview</a>

        <a href="/products/example">Example product</a>
      </div>
    </nav>
  );
};

// A disclosure navigation pattern does not automatically become an ARIA menu.
// Ordinary site navigation can often remain a collection of links.

// ---------------------------------------------------------------------
// 37. Menu buttons are different widgets
// ---------------------------------------------------------------------

export const MenuButtonConcept: FC = (): ReactElement => {
  return (
    <button type="button" aria-haspopup="menu" aria-expanded="false">
      Actions
    </button>
  );
};

// A menu button opens a menu widget with menu-specific interaction rules.
// It is different from a simple navigation disclosure.

// ---------------------------------------------------------------------
// 38. Navigation menus should not automatically use role="menu"
// ---------------------------------------------------------------------

export const OrdinaryNavigationMenu: FC = (): ReactElement => {
  return (
    <nav aria-label="Primary">
      <ul>
        <li>
          <a href="/">Home</a>
        </li>

        <li>
          <a href="/products">Products</a>
        </li>

        <li>
          <a href="/support">Support</a>
        </li>
      </ul>
    </nav>
  );
};

// The visual appearance of a navigation bar does not require the ARIA menu
// pattern. Native links are usually the simpler and more robust choice.

// ---------------------------------------------------------------------
// 39. Navigation menubar is a specialized pattern
// ---------------------------------------------------------------------

export const NavigationMenubarConcept: FC = (): ReactElement => {
  return (
    <div role="menubar" aria-label="Application navigation">
      <a role="menuitem" href="/dashboard">
        Dashboard
      </a>

      <a role="menuitem" href="/settings">
        Settings
      </a>
    </div>
  );
};

// A true menubar requires the keyboard interaction model defined for the
// pattern, including managed focus. Do not use it merely for styling.

// ---------------------------------------------------------------------
// 40. Keyboard navigation for ordinary links
// ---------------------------------------------------------------------

export const KeyboardNavigation: FC = (): ReactElement => {
  return (
    <nav aria-label="Primary">
      <a href="/">Home</a>

      <a href="/products">Products</a>

      <a href="/support">Support</a>
    </nav>
  );
};

// Native links are keyboard accessible without custom key handlers.
// Tab moves between focusable links according to the document order.

// ---------------------------------------------------------------------
// 41. Do not add custom Enter handling to links
// ---------------------------------------------------------------------

export const NativeLinkBehavior: FC = (): ReactElement => {
  return <a href="/products">Products</a>;
};

// Native links already implement expected keyboard activation.
// Custom key handling can introduce duplicate or incorrect behavior.

// ---------------------------------------------------------------------
// 42. Keyboard handling for a disclosure button
// ---------------------------------------------------------------------

export const DisclosureKeyboardBehavior: FC = (): ReactElement => {
  const [open, setOpen] = useState(false);

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>): void => {
    if (event.key === "Escape" && open) {
      setOpen(false);
    }
  };

  return (
    <nav aria-label="Primary">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => {
          setOpen((current) => !current);
        }}
        onKeyDown={handleKeyDown}
      >
        More
      </button>

      <div hidden={!open}>
        <a href="/about">About</a>
      </div>
    </nav>
  );
};

// The button itself receives native keyboard behavior.
// Additional keys should only be implemented when required by the chosen
// interaction pattern.

// ---------------------------------------------------------------------
// 43. Escape behavior for a disclosure
// ---------------------------------------------------------------------

export const EscapeDisclosure: FC = (): ReactElement => {
  const [open, setOpen] = useState(false);

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>): void => {
    if (event.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <nav aria-label="Primary" onKeyDown={handleKeyDown}>
      <button
        type="button"
        aria-expanded={open}
        onClick={() => {
          setOpen((current) => !current);
        }}
      >
        Products
      </button>

      <div hidden={!open}>
        <a href="/products">All products</a>

        <a href="/products/example">Example product</a>
      </div>
    </nav>
  );
};

// Escape-to-close is useful for an open disclosure when the interaction
// pattern calls for it. It should not interfere with native link behavior.

// ---------------------------------------------------------------------
// 44. Focus after opening navigation
// ---------------------------------------------------------------------

export const NavigationFocus: FC = (): ReactElement => {
  const [open, setOpen] = useState(false);

  return (
    <nav aria-label="Primary">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="navigation-panel"
        onClick={() => {
          setOpen(true);
        }}
      >
        More
      </button>

      <div id="navigation-panel" hidden={!open}>
        <a href="/about">About</a>

        <a href="/contact">Contact</a>
      </div>
    </nav>
  );
};

// For a simple disclosure, focus can normally remain on the button after it
// opens. The user can then choose to move into the links with Tab.

// ---------------------------------------------------------------------
// 45. Focus restoration after navigation disclosure
// ---------------------------------------------------------------------

export const DisclosureFocusRestoration: FC = (): ReactElement => {
  const [open, setOpen] = useState(true);

  return (
    <nav aria-label="Primary">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => {
          setOpen((current) => !current);
        }}
      >
        Products
      </button>

      <div hidden={!open}>
        <a href="/products">Products overview</a>

        <a href="/products/example">Example product</a>
      </div>
    </nav>
  );
};

// When a disclosure closes without navigation, the invoking button should
// remain a predictable place for keyboard users to continue.

// ---------------------------------------------------------------------
// 46. Navigation with icons
// ---------------------------------------------------------------------

export const IconNavigation: FC = (): ReactElement => {
  return (
    <nav aria-label="Primary">
      <a href="/account">
        <span aria-hidden="true">◯</span>
        Account
      </a>

      <a href="/settings">
        <span aria-hidden="true">⚙</span>
        Settings
      </a>
    </nav>
  );
};

// Decorative icons should not replace the accessible text that identifies
// the navigation destination.

// ---------------------------------------------------------------------
// 47. Icon-only navigation
// ---------------------------------------------------------------------

export const IconOnlyNavigation: FC = (): ReactElement => {
  return (
    <nav aria-label="Primary">
      <a href="/account" aria-label="Account">
        <span aria-hidden="true">◯</span>
      </a>

      <a href="/settings" aria-label="Settings">
        <span aria-hidden="true">⚙</span>
      </a>
    </nav>
  );
};

// If an icon is the only visible content of a link, the link still needs a
// meaningful accessible name.

// ---------------------------------------------------------------------
// 48. Navigation images
// ---------------------------------------------------------------------

export const ImageNavigation: FC = (): ReactElement => {
  return (
    <nav aria-label="Primary">
      <a href="/">
        <img src="/example-logo.svg" alt="Example" />
      </a>
    </nav>
  );
};

// An informative image used as the only link content needs alternative text
// that identifies the link destination or purpose.

// ---------------------------------------------------------------------
// 49. Decorative navigation imagery
// ---------------------------------------------------------------------

export const DecorativeNavigationIcon: FC = (): ReactElement => {
  return (
    <nav aria-label="Primary">
      <a href="/products">
        <img src="/example-icon.svg" alt="" />
        Products
      </a>
    </nav>
  );
};

// If visible text already provides the destination name, a decorative icon
// should generally use alt="" so it does not create redundant information.

// ---------------------------------------------------------------------
// 50. Navigation target IDs
// ---------------------------------------------------------------------

export const InPageNavigation: FC = (): ReactElement => {
  return (
    <>
      <nav aria-label="On this page">
        <a href="#overview">Overview</a>

        <a href="#details">Details</a>
      </nav>

      <main>
        <section id="overview">
          <h1>Overview</h1>
        </section>

        <section id="details">
          <h2>Details</h2>
        </section>
      </main>
    </>
  );
};

// Fragment links depend on stable target IDs.
// The target should correspond to the destination described by the link.

// ---------------------------------------------------------------------
// 51. Fixed headers and in-page navigation
// ---------------------------------------------------------------------

export const FixedHeaderNavigation: FC = (): ReactElement => {
  return (
    <>
      <nav aria-label="On this page">
        <a href="#details">Details</a>
      </nav>

      <main>
        <section id="details" className="section-target">
          <h2>Details</h2>
        </section>
      </main>
    </>
  );
};

// A fixed header can obscure a fragment target after scrolling.
// CSS such as scroll-margin-block-start can provide appropriate spacing.
//
// Example CSS:
//
// .section-target {
//     scroll-margin-block-start: 5rem;
// }

// ---------------------------------------------------------------------
// 52. Navigation and source order
// ---------------------------------------------------------------------

export const SourceOrderNavigation: FC = (): ReactElement => {
  return (
    <header>
      <a href="/">Example</a>

      <nav aria-label="Primary">
        <a href="/products">Products</a>

        <a href="/support">Support</a>
      </nav>
    </header>
  );
};

// The DOM should represent a logical reading and navigation sequence even
// when CSS creates a more elaborate visual layout.

// ---------------------------------------------------------------------
// 53. Avoid CSS-only navigation meaning
// ---------------------------------------------------------------------

export const SemanticBeforeVisual: FC = (): ReactElement => {
  return (
    <nav aria-label="Primary">
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

// Visual grouping, hover states, and positioning should enhance the semantic
// navigation rather than define it.

// ---------------------------------------------------------------------
// 54. Hover-only navigation
// ---------------------------------------------------------------------

export const HoverIndependentNavigation: FC = (): ReactElement => {
  return (
    <nav aria-label="Primary">
      <a href="/products">Products</a>

      <button type="button" aria-expanded="false">
        Categories
      </button>
    </nav>
  );
};

// Navigation that becomes available on hover must also have an equivalent
// keyboard-accessible interaction.

// ---------------------------------------------------------------------
// 55. Mobile navigation disclosure
// ---------------------------------------------------------------------

export const MobileNavigation: FC = (): ReactElement => {
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

        <a href="/support">Support</a>
      </nav>
    </header>
  );
};

// A mobile menu can use a native button to expose its expanded/collapsed
// state and a real <nav> for the navigation links.

// ---------------------------------------------------------------------
// 56. Mobile navigation and Escape
// ---------------------------------------------------------------------

export const MobileNavigationEscape: FC = (): ReactElement => {
  const [open, setOpen] = useState(false);

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>): void => {
    if (event.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <header onKeyDown={handleKeyDown}>
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

// Escape-to-close can be useful for a custom disclosure navigation.
// The control must still remain operable with ordinary keyboard activation.

// ---------------------------------------------------------------------
// 57. Mobile navigation and focus
// ---------------------------------------------------------------------

export const MobileNavigationFocus: FC = (): ReactElement => {
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

        <a href="/support">Support</a>
      </nav>
    </header>
  );
};

// A disclosure menu does not automatically require focus to move into the
// first link. Choose focus behavior according to the interaction model.

// ---------------------------------------------------------------------
// 58. Navigation that closes after activation
// ---------------------------------------------------------------------

export const ClosingMobileNavigation: FC = (): ReactElement => {
  const [open, setOpen] = useState(false);

  const closeAfterNavigation = (): void => {
    setOpen(false);
  };

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
        <a href="/" onClick={closeAfterNavigation}>
          Home
        </a>

        <a href="/products" onClick={closeAfterNavigation}>
          Products
        </a>
      </nav>
    </header>
  );
};

// Closing a mobile navigation after a link activation can reduce visual
// clutter. The destination page still needs an appropriate focus strategy.

// ---------------------------------------------------------------------
// 59. Navigation and focus restoration
// ---------------------------------------------------------------------

export const RestoredNavigationFocus: FC = (): ReactElement => {
  const [open, setOpen] = useState(false);

  return (
    <header>
      <button
        type="button"
        aria-expanded={open}
        aria-controls="navigation"
        onClick={() => {
          setOpen((current) => !current);
        }}
      >
        Menu
      </button>

      <nav id="navigation" aria-label="Primary" hidden={!open}>
        <a href="/">Home</a>

        <a href="/products">Products</a>
      </nav>
    </header>
  );
};

// If a navigation disclosure closes without navigation, the invoking button
// remains the logical place for keyboard interaction to continue.

// ---------------------------------------------------------------------
// 60. Navigation and route changes
// ---------------------------------------------------------------------

export const RouteChangeDestination: FC = (): ReactElement => {
  const headingId = useId();

  return (
    <main>
      <h1 id={headingId}>Products</h1>

      <p>Browse available products.</p>
    </main>
  );
};

// A client-side route transition should leave users with a clear indication
// of the new destination. Focus management and document titles are separate
// concerns that should also be considered.

// ---------------------------------------------------------------------
// 61. Navigation and document title
// ---------------------------------------------------------------------

export const PageTitleExample: FC = (): ReactElement => {
  return (
    <main>
      <h1>Products</h1>

      <p>Example product information.</p>
    </main>
  );
};

// A meaningful document title helps identify a navigated page, while the
// visible heading establishes the page's content hierarchy.

// ---------------------------------------------------------------------
// 62. Navigation landmarks should remain useful
// ---------------------------------------------------------------------

export const UsefulLandmarks: FC = (): ReactElement => {
  return (
    <div>
      <header>
        <nav aria-label="Primary">
          <a href="/">Home</a>

          <a href="/products">Products</a>
        </nav>
      </header>

      <main>
        <h1>Products</h1>
      </main>

      <aside>
        <h2>Related</h2>

        <a href="/support">Support</a>
      </aside>

      <footer>
        <nav aria-label="Footer">
          <a href="/privacy">Privacy</a>
        </nav>
      </footer>
    </div>
  );
};

// Landmarks should identify meaningful structural regions rather than every
// visually distinct container.

// ---------------------------------------------------------------------
// 63. Avoid excessive navigation landmarks
// ---------------------------------------------------------------------

export const LimitedNavigationLandmarks: FC = (): ReactElement => {
  return (
    <div>
      <nav aria-label="Primary">
        <a href="/">Home</a>

        <a href="/products">Products</a>
      </nav>

      <main>
        <h1>Products</h1>
      </main>
    </div>
  );
};

// Too many landmarks can make landmark navigation noisy and less useful.
// Use landmarks for meaningful navigation groups.

// ---------------------------------------------------------------------
// 64. Navigation labels should be concise
// ---------------------------------------------------------------------

export const ConciseNavigationLabels: FC = (): ReactElement => {
  return (
    <>
      <nav aria-label="Primary">
        <a href="/">Home</a>
      </nav>

      <nav aria-label="Account">
        <a href="/account">Profile</a>
      </nav>
    </>
  );
};

// "Primary" and "Account" distinguish the purposes without unnecessarily
// repeating the word "navigation".

// ---------------------------------------------------------------------
// 65. Navigation links should have sufficient target size
// ---------------------------------------------------------------------

export const NavigationTarget: FC = (): ReactElement => {
  return (
    <nav aria-label="Primary">
      <a href="/products">Products</a>

      <a href="/support">Support</a>
    </nav>
  );
};

// CSS should provide usable pointer targets and sufficient spacing.
// Accessibility is not limited to the semantic HTML alone.

// ---------------------------------------------------------------------
// 66. Navigation contrast and focus
// ---------------------------------------------------------------------

export const NavigationFocusIndicator: FC = (): ReactElement => {
  return (
    <nav aria-label="Primary" className="primary-navigation">
      <a href="/">Home</a>

      <a href="/products">Products</a>
    </nav>
  );
};

// Navigation links need a visible focus indicator that remains distinguishable
// from surrounding content.

// ---------------------------------------------------------------------
// 67. Do not remove focus outlines without replacement
// ---------------------------------------------------------------------

export const PreservedNavigationFocus: FC = (): ReactElement => {
  return (
    <nav aria-label="Primary">
      <a href="/">Home</a>

      <a href="/products">Products</a>
    </nav>
  );
};

// CSS such as outline: none should not remove the only visible indication of
// keyboard focus.

// ---------------------------------------------------------------------
// 68. Navigation and disabled links
// ---------------------------------------------------------------------

export const DisabledNavigationConcept: FC = (): ReactElement => {
  return (
    <nav aria-label="Primary">
      <a href="/products">Products</a>

      <span aria-disabled="true">Unavailable destination</span>
    </nav>
  );
};

// A disabled link is not a native HTML link state.
// If a destination is unavailable, the application should provide a clear
// interaction that does not misleadingly behave like an active link.

// ---------------------------------------------------------------------
// 69. Avoid fake disabled links
// ---------------------------------------------------------------------

export const AvailableNavigationLink: FC = (): ReactElement => {
  return (
    <nav aria-label="Primary">
      <a href="/products">Products</a>
    </nav>
  );
};

// Removing href from an anchor changes its semantics.
// Do not use a visually styled but semantically misleading disabled link.

// ---------------------------------------------------------------------
// 70. Navigation links to external destinations
// ---------------------------------------------------------------------

export const ExternalNavigation: FC = (): ReactElement => {
  return (
    <nav aria-label="Resources">
      <a href="https://example.com">Example website</a>
    </nav>
  );
};

// External destinations should still use normal link semantics.
// Additional behavior should be communicated when it materially affects the
// user's expectations.

// ---------------------------------------------------------------------
// 71. New tabs and navigation
// ---------------------------------------------------------------------

export const NewTabNavigation: FC = (): ReactElement => {
  return (
    <nav aria-label="Resources">
      <a href="https://example.com" target="_blank" rel="noreferrer">
        Example website
      </a>
    </nav>
  );
};

// Opening a new browsing context changes the navigation experience.
// The link's purpose should remain understandable from its accessible name
// and surrounding context.

// ---------------------------------------------------------------------
// 72. Navigation with grouped destinations
// ---------------------------------------------------------------------

export const GroupedNavigation: FC = (): ReactElement => {
  return (
    <nav aria-label="Primary">
      <h2>Products</h2>

      <ul>
        <li>
          <a href="/products">All products</a>
        </li>

        <li>
          <a href="/products/example">Example product</a>
        </li>
      </ul>
    </nav>
  );
};

// Headings and lists can communicate meaningful relationships within a
// navigation landmark without introducing unnecessary ARIA roles.

// ---------------------------------------------------------------------
// 73. Navigation and headings
// ---------------------------------------------------------------------

export const NavigationHeadingHierarchy: FC = (): ReactElement => {
  return (
    <header>
      <h1>Example</h1>

      <nav aria-labelledby="primary-navigation">
        <h2 id="primary-navigation">Main navigation</h2>

        <ul>
          <li>
            <a href="/">Home</a>
          </li>

          <li>
            <a href="/products">Products</a>
          </li>
        </ul>
      </nav>
    </header>
  );
};

// Heading levels should form a meaningful document hierarchy.
// A navigation label does not need to be a heading if aria-label is sufficient.

// ---------------------------------------------------------------------
// 74. Navigation with current location
// ---------------------------------------------------------------------

interface NavigationItem {
  readonly href: string;
  readonly label: string;
  readonly current?: boolean;
}

const navigationItems: readonly NavigationItem[] = [
  {
    href: "/",
    label: "Home",
  },
  {
    href: "/products",
    label: "Products",
    current: true,
  },
  {
    href: "/support",
    label: "Support",
  },
];

export const DataDrivenNavigation: FC = (): ReactElement => {
  return (
    <nav aria-label="Primary">
      <ul>
        {navigationItems.map((item) => (
          <li key={item.href}>
            <a href={item.href} aria-current={item.current ? "page" : undefined}>
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

// Navigation data should represent current state explicitly rather than
// relying only on visual styling.

// ---------------------------------------------------------------------
// 75. Avoid duplicate current-state sources
// ---------------------------------------------------------------------

export const SingleCurrentState: FC = (): ReactElement => {
  return (
    <nav aria-label="Primary">
      <a href="/products" aria-current="page" className="current">
        Products
      </a>

      <a href="/support">Support</a>
    </nav>
  );
};

// Visual styling and aria-current should describe the same current state.
// They should not contradict each other.

// ---------------------------------------------------------------------
// 76. Navigation testing
// ---------------------------------------------------------------------

export const NavigationTestingChecklist: FC = (): ReactElement => {
  return (
    <ul>
      <li>Navigation groups use appropriate semantic landmarks.</li>

      <li>Multiple navigation landmarks have distinguishable purposes.</li>

      <li>Navigation destinations use real links.</li>

      <li>Link names identify their destinations.</li>

      <li>The current page is identified with aria-current when appropriate.</li>

      <li>Skip links reach the intended content.</li>

      <li>Navigation works with keyboard input.</li>

      <li>Focus indicators remain visible.</li>

      <li>Responsive navigation is operable without a pointer.</li>

      <li>Client-side navigation communicates the new destination.</li>
    </ul>
  );
};

// Testing should cover semantics, keyboard behavior, focus behavior,
// responsive states, and actual navigation outcomes.

// ---------------------------------------------------------------------
// 77. Keyboard navigation test
// ---------------------------------------------------------------------

export const KeyboardNavigationTest: FC = (): ReactElement => {
  return (
    <ol>
      <li>Reach the navigation using Tab.</li>

      <li>Move through links with Tab and Shift+Tab.</li>

      <li>Activate links with the keyboard.</li>

      <li>Open responsive navigation with its button.</li>

      <li>Expand and collapse navigation without a pointer.</li>

      <li>Confirm the current page is exposed semantically.</li>
    </ol>
  );
};

// Keyboard testing verifies that native controls and custom navigation
// interactions remain usable without a mouse.

// ---------------------------------------------------------------------
// 78. Screen reader navigation
// ---------------------------------------------------------------------

export const ScreenReaderNavigation: FC = (): ReactElement => {
  return (
    <div>
      <nav aria-label="Primary">
        <a href="/" aria-current="page">
          Home
        </a>

        <a href="/products">Products</a>
      </nav>

      <main>
        <h1>Home</h1>
      </main>
    </div>
  );
};

// Screen reader users can navigate by landmarks, headings, and links.
// Correct semantic structure makes these navigation mechanisms meaningful.

// ---------------------------------------------------------------------
// 79. Navigation with no JavaScript fallback
// ---------------------------------------------------------------------

export const ProgressiveNavigation: FC = (): ReactElement => {
  return (
    <nav aria-label="Primary">
      <ul>
        <li>
          <a href="/">Home</a>
        </li>

        <li>
          <a href="/products">Products</a>
        </li>

        <li>
          <a href="/support">Support</a>
        </li>
      </ul>
    </nav>
  );
};

// Core navigation should remain understandable and usable even when optional
// client-side enhancements are unavailable.

// ---------------------------------------------------------------------
// 80. Complete accessible navigation
// ---------------------------------------------------------------------

export const AccessibleNavigationExample: FC = (): ReactElement => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNavigationKeyDown = (event: KeyboardEvent<HTMLElement>): void => {
    if (event.key === "Escape") {
      setMobileOpen(false);
    }
  };

  return (
    <div>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      <header>
        <a href="/">Example</a>

        <button
          type="button"
          aria-expanded={mobileOpen}
          aria-controls="primary-navigation"
          onClick={() => {
            setMobileOpen((current) => !current);
          }}
        >
          Menu
        </button>

        <nav id="primary-navigation" aria-label="Primary" hidden={!mobileOpen} onKeyDown={handleNavigationKeyDown}>
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
              <a href="/support">Support</a>
            </li>

            <li>
              <a href="/account">Account</a>
            </li>
          </ul>
        </nav>
      </header>

      <main id="main-content">
        <h1>Home</h1>

        <p>Welcome to the example application.</p>

        <section aria-labelledby="featured-title">
          <h2 id="featured-title">Featured content</h2>

          <a href="/products/example">View example product</a>
        </section>
      </main>

      <footer>
        <nav aria-label="Footer">
          <ul>
            <li>
              <a href="/privacy">Privacy</a>
            </li>

            <li>
              <a href="/terms">Terms</a>
            </li>

            <li>
              <a href="/contact">Contact</a>
            </li>
          </ul>
        </nav>
      </footer>
    </div>
  );
};

export default AccessibleNavigationExample;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Use semantic <nav> elements for major groups of navigation links.
// - Prefer semantic HTML over recreating native navigation semantics with ARIA.
// - Give multiple navigation landmarks distinguishable labels when their purposes differ.
// - Navigation landmark labels should be concise and should describe purpose rather than repeat the word "navigation".
// - Use real <a href> links for navigation destinations.
// - Use buttons for actions such as expanding or collapsing navigation.
// - Do not simulate links with generic clickable elements.
// - Navigation link names should clearly communicate their destinations or purposes.
// - Avoid repeated generic link names when users need to distinguish destinations.
// - Use aria-current to identify the current item in a related navigation set.
// - Use aria-current="page" for the current page and aria-current="step" for the current step when appropriate.
// - Do not use aria-current as a substitute for aria-selected in widgets such as tabs.
// - Breadcrumbs are navigation and should use a labeled navigation landmark.
// - Skip links provide a direct keyboard path past repeated navigation.
// - In-page navigation should point to stable and meaningful target IDs.
// - Fixed headers should not obscure in-page navigation targets.
// - Multiple navigation landmarks should remain meaningful rather than creating unnecessary landmark noise.
// - Search is a distinct landmark from ordinary site navigation.
// - Navigation does not automatically require JavaScript.
// - Client-side routing must preserve accessible link semantics and communicate destination changes.
// - A route transition may require focus management so keyboard and assistive technology users understand that navigation completed.
// - Ordinary site navigation should not automatically use the ARIA menu pattern.
// - A true menu or menubar is a specialized composite widget with additional keyboard and focus-management requirements.
// - Disclosure navigation can use a native button with aria-expanded and aria-controls.
// - Responsive navigation must remain operable with keyboard input and without pointer interaction.
// - Icon-only navigation links require accessible names.
// - Decorative navigation icons should not create redundant accessible names.
// - Visual active-state styling should agree with semantic current-page state.
// - Navigation should preserve logical DOM order and visible keyboard focus.
// - Landmarks, headings, links, and current-state semantics should work together as one navigation structure.
// - Navigation should be tested with keyboard-only interaction and assistive technologies, not only with visual inspection.
