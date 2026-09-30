/**
 * Color & Contrast
 * =================
 *
 * Accessible color choices ensure that text, controls, focus indicators, and meaningful
 * graphics remain distinguishable across different visual abilities and viewing conditions.
 * Accessibility also requires that color is not used as the only way to communicate information,
 * so important distinctions should have additional visual or textual cues.
 */

// ---------------------------------------------------------------------
// Imports
// ---------------------------------------------------------------------

import { type FC, type ReactElement } from "react";

// ---------------------------------------------------------------------
// 1. Color is part of accessibility
// ---------------------------------------------------------------------

export const AccessibleColor: FC = (): ReactElement => {
  return (
    <main>
      <h1>Accessible color</h1>

      <p>Text and interface elements should remain distinguishable from their backgrounds.</p>
    </main>
  );
};

// Color affects readability, identification of controls, state indication,
// focus visibility, and the interpretation of graphical information.

// ---------------------------------------------------------------------
// 2. Color is not the only accessibility concern
// ---------------------------------------------------------------------

export const ColorAndMeaning: FC = (): ReactElement => {
  return (
    <p>
      Important information should remain understandable even when a user cannot distinguish the colors used to present
      it.
    </p>
  );
};

// WCAG 1.4.1 requires that color not be the only visual means of conveying
// information, indicating an action, prompting a response, or distinguishing
// a visual element. :contentReference[oaicite:0]{index=0}

// ---------------------------------------------------------------------
// 3. Do not use color alone for status
// ---------------------------------------------------------------------

export const StatusWithText: FC = (): ReactElement => {
  return (
    <div>
      <p>
        <strong>Success:</strong> Your changes were saved.
      </p>

      <p>
        <strong>Error:</strong> Your changes could not be saved.
      </p>
    </div>
  );
};

// A color can reinforce the distinction, but the text communicates the status
// independently of color.

// ---------------------------------------------------------------------
// 4. Color plus an additional visual cue
// ---------------------------------------------------------------------

export const ColorAndIcon: FC = (): ReactElement => {
  return (
    <ul>
      <li>
        <span aria-hidden="true">✓</span> Completed
      </li>

      <li>
        <span aria-hidden="true">!</span> Requires attention
      </li>
    </ul>
  );
};

// Icons, patterns, text, shapes, or other visual distinctions can supplement
// color when color communicates meaning.

// ---------------------------------------------------------------------
// 5. Form errors must not rely on color alone
// ---------------------------------------------------------------------

export const FormError: FC = (): ReactElement => {
  return (
    <div>
      <label htmlFor="email">Email address</label>

      <input id="email" type="email" aria-invalid="true" aria-describedby="email-error" />

      <p id="email-error">Enter a valid email address.</p>
    </div>
  );
};

// A red border may reinforce the invalid state, but aria-invalid and the
// visible error message provide information independently of color.

// ---------------------------------------------------------------------
// 6. Required fields must not rely on color alone
// ---------------------------------------------------------------------

export const RequiredField: FC = (): ReactElement => {
  return (
    <div>
      <label htmlFor="name">
        Name <span aria-hidden="true">*</span>
      </label>

      <input id="name" name="name" required />

      <p>Fields marked with * are required.</p>
    </div>
  );
};

// A red label alone would not provide an equivalent indication for users who
// cannot distinguish the chosen color.

// ---------------------------------------------------------------------
// 7. Link identification
// ---------------------------------------------------------------------

export const DistinguishableLink: FC = (): ReactElement => {
  return (
    <p>
      Visit the <a href="/documentation">documentation</a> to learn more.
    </p>
  );
};

// Links should remain visually distinguishable from surrounding text.
// Color can be combined with an underline or another non-color cue.

// ---------------------------------------------------------------------
// 8. Link color contrast
// ---------------------------------------------------------------------

export const LinkContrast: FC = (): ReactElement => {
  return (
    <p>
      <a href="/documentation">Documentation</a>
    </p>
  );
};

// Link text must still have sufficient contrast against its background.
// A link that is distinguished from surrounding text by more than color can
// also provide a stronger visual indication of its interactive nature.

// ---------------------------------------------------------------------
// 9. Contrast ratio
// ---------------------------------------------------------------------

export const ContrastRatioConcept: FC = (): ReactElement => {
  return (
    <p>
      Contrast ratio compares the relative luminance of a lighter color with the relative luminance of a darker color.
    </p>
  );
};

// The WCAG contrast ratio ranges from 1:1 to 21:1.
// The formula is:
// (L1 + 0.05) / (L2 + 0.05)
// where L1 is the lighter relative luminance and L2 is the darker relative luminance.

// ---------------------------------------------------------------------
// 10. Relative luminance
// ---------------------------------------------------------------------

export const RelativeLuminance: FC = (): ReactElement => {
  return (
    <p>
      Relative luminance represents the perceived lightness contribution of a color after its RGB components are
      converted to linear values.
    </p>
  );
};

// WCAG contrast calculations use relative luminance rather than simply
// comparing the numeric RGB values.

// ---------------------------------------------------------------------
// 11. Contrast ratio is not a percentage
// ---------------------------------------------------------------------

export const ContrastRatioExample: FC = (): ReactElement => {
  return (
    <dl>
      <dt>1:1</dt>

      <dd>No luminance difference.</dd>

      <dt>4.5:1</dt>

      <dd>Minimum contrast for ordinary text at WCAG AA.</dd>

      <dt>21:1</dt>

      <dd>Maximum possible contrast between black and white.</dd>
    </dl>
  );
};

// Contrast ratios express a luminance relationship, not a percentage of
// accessibility or a percentage of visibility.

// ---------------------------------------------------------------------
// 12. Normal text contrast
// ---------------------------------------------------------------------

export const NormalTextContrast: FC = (): ReactElement => {
  return <p>Normal-sized text should have a contrast ratio of at least 4.5:1 against its background for WCAG AA.</p>;
};

// WCAG 1.4.3 requires at least 4.5:1 for normal text at Level AA,
// subject to its documented exceptions. :contentReference[oaicite:1]{index=1}

// ---------------------------------------------------------------------
// 13. Large text contrast
// ---------------------------------------------------------------------

export const LargeTextContrast: FC = (): ReactElement => {
  return <p>Large-scale text may use a minimum contrast ratio of 3:1 for WCAG AA.</p>;
};

// WCAG defines large-scale text using font-size and weight criteria rather
// than treating every heading as automatically being large text.

// ---------------------------------------------------------------------
// 14. Large text is not simply a heading
// ---------------------------------------------------------------------

export const LargeTextDefinition: FC = (): ReactElement => {
  return (
    <ul>
      <li>Large text is at least 18 point regular text.</li>

      <li>Large text is at least 14 point bold text.</li>
    </ul>
  );
};

// In CSS terms, these correspond approximately to 24 CSS pixels regular text
// and 18.66 CSS pixels bold text. A heading is not automatically exempt from
// the normal-text contrast requirement merely because it uses an h1 or h2 element.

// ---------------------------------------------------------------------
// 15. Enhanced text contrast
// ---------------------------------------------------------------------

export const EnhancedContrast: FC = (): ReactElement => {
  return <p>WCAG AAA uses a higher contrast threshold than AA for text.</p>;
};

// WCAG 1.4.6 specifies 7:1 for normal text and 4.5:1 for large text.
// AAA is an enhanced target, not the minimum AA requirement.

// ---------------------------------------------------------------------
// 16. Contrast is measured against the actual background
// ---------------------------------------------------------------------

export const BackgroundContrast: FC = (): ReactElement => {
  return (
    <p className="content">
      Text must remain distinguishable against the background over which it is actually rendered.
    </p>
  );
};

// A text color that passes against white may fail against a colored background,
// gradient, image, overlay, or changed theme.

// ---------------------------------------------------------------------
// 17. Background images can create contrast problems
// ---------------------------------------------------------------------

export const ImageBackgroundContrast: FC = (): ReactElement => {
  return (
    <section className="hero">
      <h1>Example heading</h1>

      <p>Text over imagery requires sufficient contrast across the background areas where it appears.</p>
    </section>
  );
};

// A single foreground color may not maintain sufficient contrast against
// every part of a changing or photographic background.

// ---------------------------------------------------------------------
// 18. Use a solid background behind text when necessary
// ---------------------------------------------------------------------

export const ProtectedTextBackground: FC = (): ReactElement => {
  return (
    <section className="hero">
      <div className="text-panel">
        <h1>Example heading</h1>

        <p>The background behind the text provides a predictable contrast surface.</p>
      </div>
    </section>
  );
};

// A sufficiently opaque background can make contrast predictable when the
// underlying content varies.

// ---------------------------------------------------------------------
// 19. Text in images
// ---------------------------------------------------------------------

export const TextAsText: FC = (): ReactElement => {
  return (
    <section>
      <h2>Prefer real text</h2>

      <p>
        Real HTML text can adapt to zoom, user styles, and assistive technologies more effectively than text embedded in
        an image.
      </p>
    </section>
  );
};

// WCAG 1.4.3 also applies to images of text, subject to its exceptions.
// Real text is generally preferable when the same presentation can be
// achieved without embedding text in an image.

// ---------------------------------------------------------------------
// 20. Placeholder text contrast
// ---------------------------------------------------------------------

export const PlaceholderContrast: FC = (): ReactElement => {
  return (
    <label htmlFor="search">
      Search
      <input id="search" type="search" placeholder="Search products" />
    </label>
  );
};

// Placeholder text is still text presented to the user and should not be
// styled so faintly that it becomes difficult to read.

// ---------------------------------------------------------------------
// 21. Disabled controls
// ---------------------------------------------------------------------

export const DisabledControl: FC = (): ReactElement => {
  return (
    <button type="button" disabled>
      Unavailable
    </button>
  );
};

// WCAG contrast requirements contain exceptions for inactive user interface
// components. This does not mean disabled controls should be made unreadable;
// usability should still be considered.

// ---------------------------------------------------------------------
// 22. Non-text contrast
// ---------------------------------------------------------------------

export const NonTextContrast: FC = (): ReactElement => {
  return (
    <button type="button" className="icon-button">
      <span aria-hidden="true">+</span>
    </button>
  );
};

// WCAG 1.4.11 requires at least 3:1 contrast against adjacent colors for
// visual information needed to identify active UI components and states, and
// for relevant graphical objects. :contentReference[oaicite:2]{index=2}

// ---------------------------------------------------------------------
// 23. Component boundaries
// ---------------------------------------------------------------------

export const ComponentBoundary: FC = (): ReactElement => {
  return (
    <button type="button" className="outlined-button">
      Save
    </button>
  );
};

// A border can provide important visual information about where a control
// begins and ends. If that boundary is necessary to identify the component,
// its contrast should be evaluated.

// ---------------------------------------------------------------------
// 24. Text can identify a button
// ---------------------------------------------------------------------

export const TextIdentifiesControl: FC = (): ReactElement => {
  return <button type="button">Save</button>;
};

// A button does not necessarily need a contrasting border if its text,
// placement, shape, or other visual presentation already makes the control
// identifiable. Non-text contrast applies to visual information required to
// identify the component or state.

// ---------------------------------------------------------------------
// 25. Input borders
// ---------------------------------------------------------------------

export const InputBoundary: FC = (): ReactElement => {
  return (
    <label htmlFor="username">
      Username
      <input id="username" name="username" className="text-input" />
    </label>
  );
};

// If a border or other visual indicator is necessary to identify the input,
// that indicator should have sufficient non-text contrast.

// ---------------------------------------------------------------------
// 26. Focus indicators
// ---------------------------------------------------------------------

export const FocusIndicator: FC = (): ReactElement => {
  return (
    <button type="button" className="focusable-button">
      Continue
    </button>
  );
};

// Keyboard focus needs a visible indication. Authors should not remove the
// browser's focus indication without providing an accessible replacement.

// ---------------------------------------------------------------------
// 27. Strong focus indicator
// ---------------------------------------------------------------------

export const StrongFocusIndicator: FC = (): ReactElement => {
  return (
    <button type="button" className="strong-focus">
      Continue
    </button>
  );
};

// A custom focus indicator should contrast against adjacent colors and remain
// clearly visible when the component receives keyboard focus.

// ---------------------------------------------------------------------
// 28. Two-color focus indicator
// ---------------------------------------------------------------------

export const TwoColorFocusIndicator: FC = (): ReactElement => {
  return (
    <button type="button" className="two-color-focus">
      Continue
    </button>
  );
};

// A focus indicator using more than one contrasting boundary can remain
// visible against a wider range of component and page backgrounds.

// ---------------------------------------------------------------------
// 29. Focus appearance
// ---------------------------------------------------------------------

export const FocusAppearance: FC = (): ReactElement => {
  return (
    <button type="button" className="focus-appearance">
      Continue
    </button>
  );
};

// WCAG 2.2 includes Focus Appearance at Level AAA. It specifies requirements
// for the area and contrast change of an author-controlled focus indicator.
// WCAG AA also requires focus visibility and sufficient non-text contrast
// for relevant focus indicators. :contentReference[oaicite:3]{index=3}

// ---------------------------------------------------------------------
// 30. Do not remove outlines without replacement
// ---------------------------------------------------------------------

export const PreservedFocus: FC = (): ReactElement => {
  return (
    <a href="/products" className="navigation-link">
      Products
    </a>
  );
};

// Avoid CSS such as:
// outline: none;
//
// unless another visible focus indication is provided and properly evaluated.

// ---------------------------------------------------------------------
// 31. Focus must remain visible
// ---------------------------------------------------------------------

export const VisibleFocusTarget: FC = (): ReactElement => {
  return (
    <button type="button" className="visible-focus">
      Save changes
    </button>
  );
};

// Sticky headers, banners, drawers, and overlays should not completely obscure
// the element that currently has keyboard focus. WCAG 2.4.11 addresses this
// issue at Level AA. :contentReference[oaicite:4]{index=4}

// ---------------------------------------------------------------------
// 32. Selected state
// ---------------------------------------------------------------------

export const SelectedControl: FC = (): ReactElement => {
  return (
    <button type="button" aria-pressed="true" className="selected">
      Favorite
    </button>
  );
};

// A selected state should not be communicated only through a color change.
// The semantic state and an additional visual distinction can work together.

// ---------------------------------------------------------------------
// 33. Checkbox state
// ---------------------------------------------------------------------

export const CheckboxState: FC = (): ReactElement => {
  return (
    <label>
      <input type="checkbox" defaultChecked />
      Receive notifications
    </label>
  );
};

// Native controls expose their state semantically. Visual styling should
// reinforce the state without making color the only indication.

// ---------------------------------------------------------------------
// 34. Error state with multiple cues
// ---------------------------------------------------------------------

export const ErrorState: FC = (): ReactElement => {
  return (
    <div className="error">
      <p>Error: Passwords do not match.</p>

      <input type="password" aria-invalid="true" aria-describedby="password-error" />

      <p id="password-error">Enter the same password in both fields.</p>
    </div>
  );
};

// The error uses text and semantic state in addition to any visual color.

// ---------------------------------------------------------------------
// 35. Success state with multiple cues
// ---------------------------------------------------------------------

export const SuccessState: FC = (): ReactElement => {
  return (
    <p className="success">
      <span aria-hidden="true">✓</span> Changes saved successfully.
    </p>
  );
};

// Color can reinforce the success state, while the message and icon provide
// additional information.

// ---------------------------------------------------------------------
// 36. Warning state with multiple cues
// ---------------------------------------------------------------------

export const WarningState: FC = (): ReactElement => {
  return (
    <aside className="warning">
      <strong>Warning:</strong> Your session will expire soon.
    </aside>
  );
};

// A warning should remain identifiable through text or another visual cue even
// if the warning color cannot be distinguished.

// ---------------------------------------------------------------------
// 37. Charts must not rely on color alone
// ---------------------------------------------------------------------

export const AccessibleChartLegend: FC = (): ReactElement => {
  return (
    <div>
      <p>Revenue by quarter</p>

      <ul>
        <li>Q1 — $10,000</li>

        <li>Q2 — $12,000</li>

        <li>Q3 — $9,000</li>
      </ul>
    </div>
  );
};

// Charts should provide labels, values, patterns, shapes, or another mechanism
// so information is not available only through hue differences.

// ---------------------------------------------------------------------
// 38. Color and graphical objects
// ---------------------------------------------------------------------

export const MeaningfulGraphic: FC = (): ReactElement => {
  return (
    <svg role="img" aria-label="Increasing trend" viewBox="0 0 200 100">
      <polyline points="10,80 60,60 110,65 160,20 190,10" fill="none" stroke="currentColor" strokeWidth="4" />
    </svg>
  );
};

// Meaningful graphical objects can be subject to non-text contrast requirements.
// The graphic should also have an appropriate accessible name or equivalent
// textual information when it communicates meaningful content.

// ---------------------------------------------------------------------
// 39. Decorative graphics
// ---------------------------------------------------------------------

export const DecorativeGraphic: FC = (): ReactElement => {
  return (
    <svg aria-hidden="true" viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="40" fill="currentColor" />
    </svg>
  );
};

// Decorative graphics do not communicate information required to understand
// the content and therefore should not create unnecessary accessibility noise.

// ---------------------------------------------------------------------
// 40. Logos
// ---------------------------------------------------------------------

export const BrandLogo: FC = (): ReactElement => {
  return <img src="/example-logo.svg" alt="Example" />;
};

// WCAG provides an exception for text that is part of a logo or brand name.
// This exception does not make other text on the page exempt from contrast
// requirements.

// ---------------------------------------------------------------------
// 41. Color blindness
// ---------------------------------------------------------------------

export const ColorBlindnessSafe: FC = (): ReactElement => {
  return (
    <ul>
      <li>
        <span aria-hidden="true">●</span> Completed
      </li>

      <li>
        <span aria-hidden="true">▲</span> Pending
      </li>

      <li>
        <span aria-hidden="true">■</span> Failed
      </li>
    </ul>
  );
};

// Different shapes and textual labels provide information independently of
// the user's ability to distinguish particular hues.

// ---------------------------------------------------------------------
// 42. Do not assume red and green are universally distinguishable
// ---------------------------------------------------------------------

export const RedGreenStatus: FC = (): ReactElement => {
  return (
    <ul>
      <li>
        <strong>Success:</strong> Payment completed.
      </li>

      <li>
        <strong>Error:</strong> Payment failed.
      </li>
    </ul>
  );
};

// Red and green can still be used as reinforcing colors, but the meaning
// should not depend exclusively on distinguishing those colors.

// ---------------------------------------------------------------------
// 43. Color-coded navigation
// ---------------------------------------------------------------------

export const ColorCodedNavigation: FC = (): ReactElement => {
  return (
    <nav aria-label="Primary">
      <a href="/products" aria-current="page" className="current-link">
        Products
      </a>

      <a href="/support">Support</a>
    </nav>
  );
};

// Current-page styling should use semantic state such as aria-current rather
// than depending only on a different link color.

// ---------------------------------------------------------------------
// 44. Hover and focus states
// ---------------------------------------------------------------------

export const InteractiveStates: FC = (): ReactElement => {
  return (
    <button type="button" className="interactive-control">
      Save
    </button>
  );
};

// Hover styling should not cause text, component boundaries, or focus
// indicators to lose required contrast.

// ---------------------------------------------------------------------
// 45. Visited links
// ---------------------------------------------------------------------

export const VisitedLinks: FC = (): ReactElement => {
  return (
    <p>
      Read the <a href="/documentation">documentation</a>.
    </p>
  );
};

// The visual treatment of visited links should remain usable and should not
// reduce the contrast of the link text against its background.

// ---------------------------------------------------------------------
// 46. Dark mode
// ---------------------------------------------------------------------

export const DarkModeContent: FC = (): ReactElement => {
  return (
    <main className="dark-theme">
      <h1>Dark theme</h1>

      <p>Text and controls need sufficient contrast in this theme too.</p>
    </main>
  );
};

// Accessibility requirements apply independently to each color theme.
// A palette that passes in light mode can fail in dark mode.

// ---------------------------------------------------------------------
// 47. Light mode
// ---------------------------------------------------------------------

export const LightModeContent: FC = (): ReactElement => {
  return (
    <main className="light-theme">
      <h1>Light theme</h1>

      <p>Text and controls need sufficient contrast in this theme too.</p>
    </main>
  );
};

// Contrast should be evaluated for every supported theme and state.

// ---------------------------------------------------------------------
// 48. prefers-color-scheme
// ---------------------------------------------------------------------

export const ColorSchemePreference: FC = (): ReactElement => {
  return (
    <div className="theme-aware-content">
      <h1>Theme-aware interface</h1>

      <p>The interface can respond to a user's preferred color scheme.</p>
    </div>
  );
};

// CSS can use prefers-color-scheme to adapt presentation.
// Each resulting palette still needs accessibility evaluation.

// ---------------------------------------------------------------------
// 49. prefers-contrast
// ---------------------------------------------------------------------

export const ContrastPreference: FC = (): ReactElement => {
  return (
    <div className="contrast-aware-content">
      <p>The interface can provide a higher-contrast presentation when the user requests it.</p>
    </div>
  );
};

// CSS supports the prefers-contrast media feature with values such as
// more, less, no-preference, and custom. :contentReference[oaicite:5]{index=5}

// ---------------------------------------------------------------------
// 50. Higher-contrast preference
// ---------------------------------------------------------------------

export const MoreContrastStyles: FC = (): ReactElement => {
  return (
    <div className="contrast-aware-component">
      <button type="button">Save</button>
    </div>
  );
};

// Example CSS:
//
// .contrast-aware-component {
//     border: 1px solid currentColor;
// }
//
// @media (prefers-contrast: more) {
//     .contrast-aware-component {
//         border-width: 2px;
//     }
// }

// The preference can be used to enhance visual distinctions rather than
// replacing baseline WCAG conformance.

// ---------------------------------------------------------------------
// 51. Forced colors
// ---------------------------------------------------------------------

export const ForcedColorsAware: FC = (): ReactElement => {
  return (
    <button type="button" className="system-color-control">
      Save
    </button>
  );
};

// System-enforced color modes can replace author colors.
// Avoid designs that depend on a particular hard-coded color being present
// in every rendering environment.

// ---------------------------------------------------------------------
// 52. Avoid color-only CSS-generated meaning
// ---------------------------------------------------------------------

export const CSSColorMeaning: FC = (): ReactElement => {
  return (
    <p>
      <span className="required">Required</span>
    </p>
  );
};

// CSS can style the state, but the content should communicate the meaning
// without requiring the user to perceive the chosen color.

// ---------------------------------------------------------------------
// 53. Contrast tokens
// ---------------------------------------------------------------------

export const ContrastTokens: FC = (): ReactElement => {
  return (
    <div className="theme">
      <p className="body-text">Primary body text</p>

      <p className="muted-text">Supporting information</p>
    </div>
  );
};

// Centralized design tokens make it easier to evaluate and maintain color
// relationships across an interface.

// ---------------------------------------------------------------------
// 54. Muted text
// ---------------------------------------------------------------------

export const MutedText: FC = (): ReactElement => {
  return <p className="muted-text">Supporting information remains readable.</p>;
};

// "Muted" does not mean exempt from contrast requirements.
// Ordinary visible text still needs sufficient contrast unless a WCAG
// exception applies.

// ---------------------------------------------------------------------
// 55. Placeholder versus supporting text
// ---------------------------------------------------------------------

export const SupportingText: FC = (): ReactElement => {
  return (
    <div>
      <label htmlFor="username">Username</label>

      <input id="username" name="username" aria-describedby="username-help" />

      <p id="username-help">Use 3–20 characters.</p>
    </div>
  );
};

// Supporting text outside the input is often preferable to relying on faint
// placeholder text for important instructions.

// ---------------------------------------------------------------------
// 56. Borders and separators
// ---------------------------------------------------------------------

export const MeaningfulSeparator: FC = (): ReactElement => {
  return (
    <section className="content-section">
      <h2>Account</h2>

      <hr />

      <p>Manage your account settings.</p>
    </section>
  );
};

// If a border or separator communicates meaningful structure, its visual
// treatment should remain perceivable.

// ---------------------------------------------------------------------
// 57. Focus ring over varied backgrounds
// ---------------------------------------------------------------------

export const RobustFocusRing: FC = (): ReactElement => {
  return (
    <button type="button" className="robust-focus">
      Continue
    </button>
  );
};

// A focus indicator that can appear over different backgrounds may need more
// than one contrasting edge so that it remains visible in all states.

// ---------------------------------------------------------------------
// 58. Gradients
// ---------------------------------------------------------------------

export const GradientBackground: FC = (): ReactElement => {
  return (
    <section className="gradient">
      <h2>Example content</h2>

      <p>Foreground content must remain readable across the gradient.</p>
    </section>
  );
};

// Contrast should be evaluated against the portions of the gradient that
// create the least favorable text/background relationship.

// ---------------------------------------------------------------------
// 59. Transparency and overlays
// ---------------------------------------------------------------------

export const OverlayContent: FC = (): ReactElement => {
  return (
    <div className="overlay">
      <p>Example content</p>
    </div>
  );
};

// Semi-transparent overlays can change the effective background beneath text
// and controls. Test the resulting presentation rather than only the source
// color values.

// ---------------------------------------------------------------------
// 60. Shadows are not a substitute for contrast
// ---------------------------------------------------------------------

export const ShadowDoesNotReplaceContrast: FC = (): ReactElement => {
  return (
    <button type="button" className="shadow-button">
      Continue
    </button>
  );
};

// A shadow can improve visual separation, but it should not be used as the
// only solution when required text or component contrast is insufficient.

// ---------------------------------------------------------------------
// 61. Contrast of focus indicators
// ---------------------------------------------------------------------

export const FocusContrast: FC = (): ReactElement => {
  return (
    <a href="/account" className="focus-link">
      Account
    </a>
  );
};

// Focus indicators are visual information about component state and therefore
// need appropriate contrast against adjacent colors when author-controlled.

// ---------------------------------------------------------------------
// 62. Contrast of selected controls
// ---------------------------------------------------------------------

export const SelectedContrast: FC = (): ReactElement => {
  return (
    <button type="button" aria-pressed="true" className="selected-control">
      Favorite
    </button>
  );
};

// A selected-state indicator should remain distinguishable from both the
// component and its surrounding background.

// ---------------------------------------------------------------------
// 63. Contrast of disabled controls
// ---------------------------------------------------------------------

export const DisabledContrast: FC = (): ReactElement => {
  return (
    <button type="button" disabled>
      Unavailable
    </button>
  );
};

// Inactive controls have an exception under WCAG contrast requirements, but
// designers should still consider whether disabled content remains usable
// and understandable.

// ---------------------------------------------------------------------
// 64. Contrast testing tools
// ---------------------------------------------------------------------

export const ContrastTesting: FC = (): ReactElement => {
  return (
    <ul>
      <li>Inspect foreground and background colors.</li>

      <li>Check normal and large text thresholds.</li>

      <li>Check controls and meaningful graphics at 3:1.</li>

      <li>Check focus and selected states.</li>

      <li>Test every supported theme.</li>
    </ul>
  );
};

// Automated contrast checkers can identify many color problems, but visual
// review is still needed for gradients, imagery, state changes, thin graphics,
// and information conveyed by color.

// ---------------------------------------------------------------------
// 65. Do not round failing ratios up
// ---------------------------------------------------------------------

export const ExactContrastThreshold: FC = (): ReactElement => {
  return <p>A computed contrast ratio of 2.999:1 does not satisfy a 3:1 threshold.</p>;
};

// WCAG explicitly states that computed contrast ratios should not be rounded
// when comparing them with the required threshold. :contentReference[oaicite:6]{index=6}

// ---------------------------------------------------------------------
// 66. Color contrast checklist
// ---------------------------------------------------------------------

export const ContrastChecklist: FC = (): ReactElement => {
  return (
    <ul>
      <li>Normal text meets the applicable contrast threshold.</li>

      <li>Large text meets the applicable large-text threshold.</li>

      <li>Important controls have sufficient non-text contrast.</li>

      <li>Meaningful graphical objects have sufficient contrast.</li>

      <li>Focus indicators remain visible.</li>

      <li>Current and selected states remain distinguishable.</li>

      <li>Errors and success states do not rely on color alone.</li>

      <li>Required fields do not rely on color alone.</li>

      <li>Links remain distinguishable.</li>

      <li>Every supported color theme has been tested.</li>
    </ul>
  );
};

// A contrast review should consider both WCAG ratios and whether the interface
// still communicates its meaning without relying on color perception.

// ---------------------------------------------------------------------
// 67. Color accessibility test
// ---------------------------------------------------------------------

export const ColorAccessibilityTest: FC = (): ReactElement => {
  return (
    <ol>
      <li>Check the default color palette.</li>

      <li>Check hover and active states.</li>

      <li>Check keyboard focus.</li>

      <li>Check selected and expanded states.</li>

      <li>Check validation and status states.</li>

      <li>Check light and dark themes.</li>

      <li>Check responsive layouts.</li>

      <li>Check charts and meaningful graphics.</li>

      <li>Verify that color is never the only source of important meaning.</li>
    </ol>
  );
};

// Testing states is important because a component can pass in its default
// appearance while failing when focused, selected, invalid, or disabled.

// ---------------------------------------------------------------------
// 68. Integrated accessible color example
// ---------------------------------------------------------------------

export const AccessibleColorExample: FC = (): ReactElement => {
  return (
    <main className="accessible-interface">
      <h1>Account settings</h1>

      <p>Update your account information.</p>

      <form>
        <div className="field">
          <label htmlFor="display-name">Display name</label>

          <input id="display-name" name="displayName" required aria-describedby="display-name-help" />

          <p id="display-name-help">This name will be visible to other users.</p>
        </div>

        <div className="field">
          <label htmlFor="email">Email address</label>

          <input id="email" name="email" type="email" aria-invalid="true" aria-describedby="email-error" />

          <p id="email-error">Error: Enter a valid email address.</p>
        </div>

        <p className="success">
          <span aria-hidden="true">✓</span> Profile information is up to date.
        </p>

        <button type="submit" className="save-button">
          Save changes
        </button>
      </form>
    </main>
  );
};

// The integrated example combines semantic form controls, visible text,
// semantic validation state, status information, and color as a supporting
// visual layer rather than the sole source of meaning.

export default AccessibleColorExample;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Color is useful for communicating information, but it must not be the only visual means of conveying important meaning.
// - WCAG 1.4.1 requires information conveyed through color to have an additional visual or textual distinction.
// - Normal text generally requires at least 4.5:1 contrast at WCAG AA.
// - Large-scale text generally requires at least 3:1 contrast at WCAG AA.
// - WCAG AAA uses higher text contrast thresholds than AA.
// - A heading is not automatically large text for contrast purposes.
// - Contrast ratios compare relative luminance and range from 1:1 to 21:1.
// - Text must be evaluated against the background on which it is actually rendered.
// - Images, gradients, overlays, and changing backgrounds can create additional contrast problems.
// - Placeholder text is still visible text and should not be made unnecessarily faint.
// - WCAG 1.4.11 requires at least 3:1 contrast for visual information needed to identify active UI components and relevant states, with documented exceptions.
// - Meaningful graphical objects can also require 3:1 contrast against adjacent colors.
// - Focus indicators are important visual state indicators and should remain clearly visible.
// - Author-controlled focus indicators must be evaluated for both adjacent contrast and their focused-versus-unfocused appearance.
// - WCAG 2.2 includes Focus Appearance at Level AAA.
// - Disabled controls have a WCAG contrast exception, but good usability still matters.
// - Errors, warnings, success states, and required fields should communicate their meaning through more than color.
// - Links should remain distinguishable from surrounding content.
// - Charts and meaningful graphics should not communicate their data only through hue.
// - Light and dark themes must each be evaluated independently.
// - prefers-contrast can be used to respond to user requests for higher or lower contrast.
// - Design tokens can make accessible color relationships easier to maintain consistently.
// - Automated contrast tools are useful, but state changes, imagery, gradients, and color-dependent meaning still require human review.
// - Accessibility testing should include default, hover, focus, selected, validation, theme, and responsive states.
