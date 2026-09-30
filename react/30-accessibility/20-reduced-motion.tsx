/**
 * Reduced Motion
 * ==============
 *
 * Reduced-motion accessibility means respecting users who prefer less movement or animation
 * in an interface. CSS can respond to the user's system preference with `prefers-reduced-motion`,
 * while React can use `matchMedia()` when application behavior itself must change.
 *
 * Reducing motion does not necessarily mean removing every visual transition. The goal is to
 * remove or replace non-essential motion while preserving the information and functionality
 * that the interface communicates.
 */

// ---------------------------------------------------------------------
// Imports
// ---------------------------------------------------------------------

import { type FC, type ReactElement, useEffect, useState } from "react";

// ---------------------------------------------------------------------
// 1. What reduced motion means
// ---------------------------------------------------------------------

export const ReducedMotionConcept: FC = (): ReactElement => {
  return (
    <main>
      <h1>Reduced motion</h1>

      <p>The interface can provide less movement when the user has enabled a reduced-motion preference.</p>
    </main>
  );
};

// Reduced motion is a user preference for minimizing movement or animation.
// It is not the same as requiring a completely static interface.

// ---------------------------------------------------------------------
// 2. The prefers-reduced-motion media feature
// ---------------------------------------------------------------------

export const ReducedMotionMediaQuery: FC = (): ReactElement => {
  return (
    <div className="animated-panel">
      <p>Example content</p>
    </div>
  );
};

// Example CSS:
//
// .animated-panel {
//     animation: slide-in 300ms ease;
// }
//
// @media (prefers-reduced-motion: reduce) {
//     .animated-panel {
//         animation: none;
//     }
// }
//
// `reduce` indicates that the user prefers less motion.
// `no-preference` indicates that the user has not expressed a preference.

// ---------------------------------------------------------------------
// 3. Reduce is a preference, not a command to remove everything
// ---------------------------------------------------------------------

export const ReducedMotionDoesNotMeanNoAnimation: FC = (): ReactElement => {
  return (
    <div>
      <p>Important visual feedback can remain available while unnecessary movement is removed.</p>
    </div>
  );
};

// `prefers-reduced-motion: reduce` does not mean that every animation must
// disappear regardless of its purpose. Non-essential motion should be removed,
// reduced, or replaced while essential information or functionality remains.

// ---------------------------------------------------------------------
// 4. Why motion can be problematic
// ---------------------------------------------------------------------

export const MotionSensitivity: FC = (): ReactElement => {
  return (
    <p>
      Large or unexpected movement can cause discomfort for some users, particularly users who are sensitive to
      vestibular motion.
    </p>
  );
};

// Movement such as large-scale panning, zooming, scaling, and parallax can
// be particularly problematic for motion-sensitive users.

// ---------------------------------------------------------------------
// 5. Non-essential animation
// ---------------------------------------------------------------------

export const NonEssentialAnimation: FC = (): ReactElement => {
  return (
    <div className="decorative-animation">
      <p>Content</p>
    </div>
  );
};

// Decorative movement is usually non-essential.
// It can therefore be removed or replaced when reduced motion is requested.

// ---------------------------------------------------------------------
// 6. Essential animation
// ---------------------------------------------------------------------

export const EssentialAnimation: FC = (): ReactElement => {
  return (
    <div>
      <p>Animation communicates information required to understand the operation being performed.</p>
    </div>
  );
};

// Some animation can be essential to the information or functionality of a
// feature. Reduced-motion handling should preserve an equivalent way to
// understand or operate that feature.

// ---------------------------------------------------------------------
// 7. CSS should usually handle visual motion
// ---------------------------------------------------------------------

export const CSSReducedMotion: FC = (): ReactElement => {
  return (
    <button type="button" className="animated-button">
      Save
    </button>
  );
};

// Example CSS:
//
// .animated-button {
//     transition:
//         transform 150ms ease,
//         box-shadow 150ms ease;
// }
//
// @media (prefers-reduced-motion: reduce) {
//     .animated-button {
//         transition: none;
//     }
// }
//
// CSS media queries are preferable when reduced motion only changes visual
// presentation.

// ---------------------------------------------------------------------
// 8. Disable an animation
// ---------------------------------------------------------------------

export const DisabledAnimation: FC = (): ReactElement => {
  return <div className="notification">Notification</div>;
};

// Example CSS:
//
// .notification {
//     animation: notification-enter 300ms ease;
// }
//
// @media (prefers-reduced-motion: reduce) {
//     .notification {
//         animation: none;
//     }
// }

// ---------------------------------------------------------------------
// 9. Replace motion with a fade
// ---------------------------------------------------------------------

export const ReducedAnimationAlternative: FC = (): ReactElement => {
  return <div className="notification">Notification</div>;
};

// Example CSS:
//
// .notification {
//     animation: slide-in 300ms ease;
// }
//
// @media (prefers-reduced-motion: reduce) {
//     .notification {
//         animation: fade-in 150ms ease;
//     }
// }
//
// A replacement animation can be appropriate when the visual transition still
// provides useful context without the problematic movement.

// ---------------------------------------------------------------------
// 10. Avoid scaling effects
// ---------------------------------------------------------------------

export const ScaleAnimation: FC = (): ReactElement => {
  return (
    <button type="button" className="scale-button">
      Open
    </button>
  );
};

// Example CSS:
//
// .scale-button {
//     transition: transform 200ms ease;
// }
//
// .scale-button:hover {
//     transform: scale(1.08);
// }
//
// @media (prefers-reduced-motion: reduce) {
//     .scale-button {
//         transition: none;
//     }
//
//     .scale-button:hover {
//         transform: none;
//     }
// }

// ---------------------------------------------------------------------
// 11. Avoid large translations
// ---------------------------------------------------------------------

export const TranslationAnimation: FC = (): ReactElement => {
  return <aside className="drawer">Navigation</aside>;
};

// Example CSS:
//
// .drawer {
//     transform: translateX(100%);
//     transition: transform 300ms ease;
// }
//
// .drawer.open {
//     transform: translateX(0);
// }
//
// @media (prefers-reduced-motion: reduce) {
//     .drawer {
//         transition: none;
//     }
// }

// ---------------------------------------------------------------------
// 12. Avoid parallax motion
// ---------------------------------------------------------------------

export const ParallaxContent: FC = (): ReactElement => {
  return (
    <section className="hero">
      <h1>Example heading</h1>

      <p>Example content</p>
    </section>
  );
};

// Parallax movement changes the relative position of visual layers.
// It is a common candidate for removal or replacement under reduced motion.

// ---------------------------------------------------------------------
// 13. Avoid auto-playing decorative motion
// ---------------------------------------------------------------------

export const DecorativeLoop: FC = (): ReactElement => {
  return <div className="decorative-loop" aria-hidden="true" />;
};

// Continuously moving decorative content should not be necessary for users to
// understand or operate the interface.

// ---------------------------------------------------------------------
// 14. Infinite animations
// ---------------------------------------------------------------------

export const InfiniteAnimation: FC = (): ReactElement => {
  return <div className="loading-decoration">Loading</div>;
};

// Example CSS:
//
// .loading-decoration {
//     animation: pulse 1s ease-in-out infinite;
// }
//
// @media (prefers-reduced-motion: reduce) {
//     .loading-decoration {
//         animation: none;
//     }
// }

// ---------------------------------------------------------------------
// 15. Loading state without motion
// ---------------------------------------------------------------------

export const StaticLoadingState: FC = (): ReactElement => {
  return <div role="status">Loading...</div>;
};

// A loading state can communicate progress with text or another non-motion
// indicator when animation is disabled.

// ---------------------------------------------------------------------
// 16. Spinner with reduced motion
// ---------------------------------------------------------------------

export const LoadingSpinner: FC = (): ReactElement => {
  return <div role="status" aria-label="Loading" className="spinner" />;
};

// Example CSS:
//
// .spinner {
//     animation: spin 700ms linear infinite;
// }
//
// @media (prefers-reduced-motion: reduce) {
//     .spinner {
//         animation: none;
//     }
// }
//
// The loading state remains semantically available even when the visual
// rotation is removed.

// ---------------------------------------------------------------------
// 17. Pulsing effects
// ---------------------------------------------------------------------

export const PulsingElement: FC = (): ReactElement => {
  return <span className="notification-dot">New</span>;
};

// Pulsing, breathing, or repeatedly scaling decorative elements should have
// reduced-motion alternatives.

// ---------------------------------------------------------------------
// 18. Blinking content
// ---------------------------------------------------------------------

export const BlinkingContent: FC = (): ReactElement => {
  return <p>New message available.</p>;
};

// Blinking is not an appropriate replacement for ordinary status messaging.
// Important information should be communicated through accessible text and
// state rather than attention-demanding animation.

// ---------------------------------------------------------------------
// 19. Hover transitions
// ---------------------------------------------------------------------

export const HoverTransition: FC = (): ReactElement => {
  return (
    <button type="button" className="hover-button">
      Continue
    </button>
  );
};

// Example CSS:
//
// .hover-button {
//     transition:
//         background-color 150ms ease,
//         color 150ms ease;
// }
//
// @media (prefers-reduced-motion: reduce) {
//     .hover-button {
//         transition: none;
//     }
// }

// ---------------------------------------------------------------------
// 20. Color changes are different from motion
// ---------------------------------------------------------------------

export const NonMotionTransition: FC = (): ReactElement => {
  return (
    <button type="button" className="color-button">
      Continue
    </button>
  );
};

// A transition that changes only color, opacity, or other non-positional
// properties is different from motion animation as defined for WCAG.
// It can still be reduced for comfort and consistency.

// ---------------------------------------------------------------------
// 21. Opacity transitions
// ---------------------------------------------------------------------

export const OpacityTransition: FC = (): ReactElement => {
  return (
    <div className="fade-panel">
      <p>Example content</p>
    </div>
  );
};

// Example CSS:
//
// .fade-panel {
//     transition: opacity 200ms ease;
// }
//
// @media (prefers-reduced-motion: reduce) {
//     .fade-panel {
//         transition: none;
//     }
// }

// ---------------------------------------------------------------------
// 22. Reduced motion for menus
// ---------------------------------------------------------------------

export const ReducedMotionMenu: FC = (): ReactElement => {
  return (
    <nav className="navigation">
      <a href="/">Home</a>

      <a href="/products">Products</a>
    </nav>
  );
};

// A menu can appear immediately instead of sliding or scaling into view when
// reduced motion is requested.

// ---------------------------------------------------------------------
// 23. Reduced motion for dialogs
// ---------------------------------------------------------------------

export const ReducedMotionDialog: FC = (): ReactElement => {
  return (
    <dialog open>
      <h2>Example dialog</h2>

      <p>Dialog content</p>

      <button type="button">Close</button>
    </dialog>
  );
};

// Modal dialogs should not depend on animated movement for their basic
// accessibility or operation.

// ---------------------------------------------------------------------
// 24. Reduced motion for drawers
// ---------------------------------------------------------------------

export const ReducedMotionDrawer: FC = (): ReactElement => {
  return (
    <aside className="drawer">
      <nav aria-label="Drawer navigation">
        <a href="/">Home</a>

        <a href="/products">Products</a>
      </nav>
    </aside>
  );
};

// A drawer can switch from a sliding animation to an immediate state change
// when reduced motion is requested.

// ---------------------------------------------------------------------
// 25. Reduced motion for accordions
// ---------------------------------------------------------------------

export const ReducedMotionAccordion: FC = (): ReactElement => {
  return (
    <details>
      <summary>More information</summary>

      <p>Additional information is available here.</p>
    </details>
  );
};

// Native disclosure controls do not require custom animation to function.
// If an accordion is animated, provide a reduced-motion alternative.

// ---------------------------------------------------------------------
// 26. Reduced motion for tooltips
// ---------------------------------------------------------------------

export const ReducedMotionTooltip: FC = (): ReactElement => {
  return (
    <button type="button" aria-describedby="tooltip">
      Help
      <span id="tooltip">Opens help information.</span>
    </button>
  );
};

// Tooltips should not require a large movement or animated travel path to
// communicate their information.

// ---------------------------------------------------------------------
// 27. Reduced motion for carousels
// ---------------------------------------------------------------------

export const ReducedMotionCarousel: FC = (): ReactElement => {
  return (
    <section aria-label="Featured items">
      <button type="button">Previous</button>

      <article>
        <h2>Example item</h2>

        <p>Example carousel content.</p>
      </article>

      <button type="button">Next</button>
    </section>
  );
};

// A carousel should remain operable without animated sliding.
// The change between slides can be immediate when reduced motion is requested.

// ---------------------------------------------------------------------
// 28. Auto-advancing carousels
// ---------------------------------------------------------------------

export const AutoAdvancingCarousel: FC = (): ReactElement => {
  return (
    <section aria-label="Featured items">
      <p>Featured item</p>

      <button type="button">Pause</button>
    </section>
  );
};

// Automatically changing content creates additional accessibility concerns.
// Users should have control over moving content when applicable, and motion
// should not be required to understand the content.

// ---------------------------------------------------------------------
// 29. Reduced motion for route transitions
// ---------------------------------------------------------------------

export const RouteTransition: FC = (): ReactElement => {
  return (
    <main className="page">
      <h1>Products</h1>
    </main>
  );
};

// Example CSS:
//
// .page {
//     animation: page-enter 250ms ease;
// }
//
// @media (prefers-reduced-motion: reduce) {
//     .page {
//         animation: none;
//     }
// }

// ---------------------------------------------------------------------
// 30. Route transitions must not replace focus management
// ---------------------------------------------------------------------

export const RouteTransitionAccessibility: FC = (): ReactElement => {
  return (
    <main>
      <h1 tabIndex={-1}>Products</h1>

      <p>Example product information.</p>
    </main>
  );
};

// A visual route transition does not tell assistive technology where the new
// page begins. Focus management and semantic page structure remain separate
// accessibility concerns.

// ---------------------------------------------------------------------
// 31. Reduced motion for scrolling
// ---------------------------------------------------------------------

export const ScrollTarget: FC = (): ReactElement => {
  return (
    <main>
      <a href="#details">Jump to details</a>

      <section id="details">
        <h2>Details</h2>
      </section>
    </main>
  );
};

// Smooth scrolling is optional presentation.
// The destination must remain reachable when motion is reduced.

// ---------------------------------------------------------------------
// 32. Smooth scrolling
// ---------------------------------------------------------------------

export const SmoothScrolling: FC = (): ReactElement => {
  return (
    <main className="smooth-scroll-page">
      <a href="#details">View details</a>

      <section id="details">
        <h2>Details</h2>
      </section>
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

// ---------------------------------------------------------------------
// 33. Programmatic smooth scrolling
// ---------------------------------------------------------------------

export const ProgrammaticScroll: FC = (): ReactElement => {
  const scrollToDetails = (): void => {
    document.getElementById("details")?.scrollIntoView({
      behavior: "smooth",
    });
  };

  return (
    <main>
      <button type="button" onClick={scrollToDetails}>
        View details
      </button>

      <section id="details">
        <h2>Details</h2>
      </section>
    </main>
  );
};

// JavaScript-controlled motion does not automatically respond to the CSS
// media query. Application code needs to account for the preference when it
// explicitly requests animated scrolling.

// ---------------------------------------------------------------------
// 34. React can detect the preference
// ---------------------------------------------------------------------

export const ReducedMotionDetection: FC = (): ReactElement => {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const updatePreference = (): void => {
      setReducedMotion(mediaQuery.matches);
    };

    updatePreference();
    mediaQuery.addEventListener("change", updatePreference);

    return () => {
      mediaQuery.removeEventListener("change", updatePreference);
    };
  }, []);

  return <p>Motion preference: {reducedMotion ? "reduced" : "no preference"}</p>;
};

// matchMedia() allows JavaScript to read the current media-query state and
// subscribe to changes while the application is running.

// ---------------------------------------------------------------------
// 35. Use JavaScript only when behavior must change
// ---------------------------------------------------------------------

export const JavaScriptMotionDecision: FC = (): ReactElement => {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const updatePreference = (): void => {
      setReducedMotion(mediaQuery.matches);
    };

    updatePreference();
    mediaQuery.addEventListener("change", updatePreference);

    return () => {
      mediaQuery.removeEventListener("change", updatePreference);
    };
  }, []);

  return <button type="button">{reducedMotion ? "Open immediately" : "Open with transition"}</button>;
};

// Prefer CSS for purely visual changes.
// JavaScript detection is appropriate when the preference changes application
// behavior, animation APIs, timers, or other non-CSS logic.

// ---------------------------------------------------------------------
// 36. Avoid browser APIs during rendering
// ---------------------------------------------------------------------

export const SafePreferenceDetection: FC = (): ReactElement => {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    setReducedMotion(mediaQuery.matches);

    const handleChange = (): void => {
      setReducedMotion(mediaQuery.matches);
    };

    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  return <p>{reducedMotion ? "Reduced motion is enabled." : "Reduced motion is not enabled."}</p>;
};

// Reading window.matchMedia() inside an effect avoids directly accessing the
// browser-only API during server rendering.

// ---------------------------------------------------------------------
// 37. Respond to preference changes
// ---------------------------------------------------------------------

export const DynamicMotionPreference: FC = (): ReactElement => {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const handleChange = (event: MediaQueryListEvent): void => {
      setReducedMotion(event.matches);
    };

    setReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  return <p>Current preference: {reducedMotion ? "reduce" : "no preference"}</p>;
};

// The user's preference can change while the application is open.
// The change event allows the React state to stay synchronized.

// ---------------------------------------------------------------------
// 38. Avoid duplicate media-query listeners
// ---------------------------------------------------------------------

export const SinglePreferenceListener: FC = (): ReactElement => {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const handleChange = (event: MediaQueryListEvent): void => {
      setReducedMotion(event.matches);
    };

    setReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  return <p>{reducedMotion ? "Reduced" : "Standard"}</p>;
};

// A component should clean up its media-query listener when it unmounts.

// ---------------------------------------------------------------------
// 39. Reduced motion and animation libraries
// ---------------------------------------------------------------------

export const AnimationLibraryBoundary: FC = (): ReactElement => {
  return (
    <div>
      <p>Animation behavior should respect the user's motion preference.</p>
    </div>
  );
};

// Animation libraries do not automatically make an application accessible.
// The application still needs to determine when motion should be reduced.

// ---------------------------------------------------------------------
// 40. Animation configuration
// ---------------------------------------------------------------------

interface MotionConfiguration {
  readonly duration: number;
  readonly enabled: boolean;
}

export const MotionConfigurationExample: FC = (): ReactElement => {
  const configuration: MotionConfiguration = {
    duration: 200,
    enabled: true,
  };

  return (
    <p>
      Animation enabled: {String(configuration.enabled)}. Duration: {configuration.duration}ms.
    </p>
  );
};

// A centralized motion configuration can make animation behavior consistent
// across components.

// ---------------------------------------------------------------------
// 41. Reduced-motion configuration
// ---------------------------------------------------------------------

interface ReducedMotionConfiguration {
  readonly reducedMotion: boolean;
}

export const ReducedMotionConfigurationExample: FC = (): ReactElement => {
  const configuration: ReducedMotionConfiguration = {
    reducedMotion: true,
  };

  return <p>Reduced motion: {String(configuration.reducedMotion)}.</p>;
};

// Motion preferences can be passed to components when application behavior,
// rather than only CSS presentation, depends on the preference.

// ---------------------------------------------------------------------
// 42. Avoid duplicating motion state
// ---------------------------------------------------------------------

export const MotionState: FC = (): ReactElement => {
  const [open, setOpen] = useState(false);

  return (
    <section>
      <button
        type="button"
        onClick={() => {
          setOpen((current) => !current);
        }}
      >
        {open ? "Close" : "Open"}
      </button>

      <div hidden={!open}>Example content</div>
    </section>
  );
};

// The semantic open/closed state should remain independent from whether a
// transition is used to visually represent the state change.

// ---------------------------------------------------------------------
// 43. Motion should not determine semantic state
// ---------------------------------------------------------------------

export const SemanticStateIndependentOfMotion: FC = (): ReactElement => {
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
        More information
      </button>

      <div hidden={!open}>Additional information.</div>
    </section>
  );
};

// aria-expanded represents the actual interface state.
// Animation is only a visual presentation of that state.

// ---------------------------------------------------------------------
// 44. Reduced motion should preserve state changes
// ---------------------------------------------------------------------

export const PreservedStateChange: FC = (): ReactElement => {
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

      <div hidden={!open}>Details are visible.</div>
    </section>
  );
};

// Removing an animation must not remove the underlying functionality.

// ---------------------------------------------------------------------
// 45. Motion should not replace feedback
// ---------------------------------------------------------------------

export const TextFeedback: FC = (): ReactElement => {
  const [saved, setSaved] = useState(false);

  return (
    <div>
      <button
        type="button"
        onClick={() => {
          setSaved(true);
        }}
      >
        Save
      </button>

      {saved && <p role="status">Changes saved.</p>}
    </div>
  );
};

// A success animation may disappear under reduced motion, but the status
// message should remain available.

// ---------------------------------------------------------------------
// 46. Reduced motion and live regions
// ---------------------------------------------------------------------

export const MotionIndependentStatus: FC = (): ReactElement => {
  return <p role="status">Upload complete.</p>;
};

// Live-region announcements do not depend on animation.
// Do not use motion as the only mechanism for communicating asynchronous state.

// ---------------------------------------------------------------------
// 47. Reduced motion and focus
// ---------------------------------------------------------------------

export const FocusWithoutMotion: FC = (): ReactElement => {
  return (
    <button type="button" autoFocus>
      Continue
    </button>
  );
};

// Focus behavior and animation are separate concerns.
// Removing a transition should not remove or delay necessary focus management.

// ---------------------------------------------------------------------
// 48. Avoid delayed focus
// ---------------------------------------------------------------------

export const ImmediateFocusTarget: FC = (): ReactElement => {
  return <button type="button">Continue</button>;
};

// Do not delay accessibility-critical focus changes merely to synchronize them
// with a decorative animation.

// ---------------------------------------------------------------------
// 49. Reduced motion and CSS transitions
// ---------------------------------------------------------------------

export const TransitionExample: FC = (): ReactElement => {
  return (
    <button type="button" className="transition-button">
      Continue
    </button>
  );
};

// Example CSS:
//
// .transition-button {
//     transition:
//         transform 200ms ease,
//         opacity 200ms ease;
// }
//
// @media (prefers-reduced-motion: reduce) {
//     .transition-button {
//         transition: none;
//     }
// }

// ---------------------------------------------------------------------
// 50. Reduced motion and keyframes
// ---------------------------------------------------------------------

export const KeyframeExample: FC = (): ReactElement => {
  return <div className="animated-content">Content</div>;
};

// Example CSS:
//
// .animated-content {
//     animation: enter 300ms ease;
// }
//
// @media (prefers-reduced-motion: reduce) {
//     .animated-content {
//         animation: none;
//     }
// }

// ---------------------------------------------------------------------
// 51. Do not globally destroy every animation blindly
// ---------------------------------------------------------------------

export const TargetedReducedMotion: FC = (): ReactElement => {
  return (
    <main>
      <section className="decorative-motion">
        <p>Decorative animation can be reduced.</p>
      </section>

      <section className="essential-animation">
        <p>Essential functionality remains available.</p>
      </section>
    </main>
  );
};

// A blanket rule that indiscriminately disables every animation can interfere
// with animations that communicate necessary information. Prefer deliberate,
// component-level reduced-motion behavior.

// ---------------------------------------------------------------------
// 52. Reduced motion and transition duration
// ---------------------------------------------------------------------

export const ReducedDuration: FC = (): ReactElement => {
  return <div className="transitioning-panel">Example content</div>;
};

// Example CSS:
//
// .transitioning-panel {
//     transition: opacity 300ms ease;
// }
//
// @media (prefers-reduced-motion: reduce) {
//     .transitioning-panel {
//         transition-duration: 1ms;
//     }
// }
//
// Setting a very short duration is one possible implementation, but removing
// or replacing non-essential motion is often clearer and easier to reason about.

// ---------------------------------------------------------------------
// 53. Reduced motion and transform
// ---------------------------------------------------------------------

export const TransformMotion: FC = (): ReactElement => {
  return <div className="transform-panel">Example content</div>;
};

// Example CSS:
//
// .transform-panel {
//     transform: translateY(20px);
//     transition: transform 250ms ease;
// }
//
// .transform-panel.visible {
//     transform: translateY(0);
// }
//
// @media (prefers-reduced-motion: reduce) {
//     .transform-panel,
//     .transform-panel.visible {
//         transform: none;
//         transition: none;
//     }
// }

// ---------------------------------------------------------------------
// 54. Reduced motion and layout
// ---------------------------------------------------------------------

export const LayoutState: FC = (): ReactElement => {
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

      <div hidden={!expanded}>Additional information.</div>
    </section>
  );
};

// Layout still changes when motion is reduced.
// The user should receive the same information without requiring the animated
// transition between the two layout states.

// ---------------------------------------------------------------------
// 55. Reduced motion and accordions with CSS
// ---------------------------------------------------------------------

export const AnimatedAccordion: FC = (): ReactElement => {
  return (
    <details className="animated-details">
      <summary>Details</summary>

      <div>Additional information.</div>
    </details>
  );
};

// If an accordion is animated through CSS, provide a reduced-motion rule.
// Native disclosure semantics should remain independent of the animation.

// ---------------------------------------------------------------------
// 56. Reduced motion and image galleries
// ---------------------------------------------------------------------

export const ImageGallery: FC = (): ReactElement => {
  return (
    <section aria-label="Gallery">
      <button type="button">Previous image</button>

      <img src="/example-image.jpg" alt="Example landscape" />

      <button type="button">Next image</button>
    </section>
  );
};

// Image changes should remain understandable without a sliding or zooming
// animation.

// ---------------------------------------------------------------------
// 57. Reduced motion and drag interfaces
// ---------------------------------------------------------------------

export const DragInterface: FC = (): ReactElement => {
  return (
    <div>
      <p>Drag the item to reorder it.</p>

      <button type="button">Move item up</button>

      <button type="button">Move item down</button>
    </div>
  );
};

// Drag interactions should not rely exclusively on animated movement.
// Equivalent controls can provide an alternative interaction mechanism.

// ---------------------------------------------------------------------
// 58. Reduced motion and notifications
// ---------------------------------------------------------------------

export const NotificationMotion: FC = (): ReactElement => {
  return (
    <div role="status">
      <p>New message received.</p>
    </div>
  );
};

// A notification can appear immediately rather than flying, bouncing, or
// scaling into view.

// ---------------------------------------------------------------------
// 59. Reduced motion and progress indicators
// ---------------------------------------------------------------------

export const ProgressIndicator: FC = (): ReactElement => {
  return (
    <progress value={60} max={100}>
      60%
    </progress>
  );
};

// Native progress semantics can communicate progress without requiring a
// continuously animated visual indicator.

// ---------------------------------------------------------------------
// 60. Reduced motion and skeleton screens
// ---------------------------------------------------------------------

export const StaticSkeleton: FC = (): ReactElement => {
  return (
    <div aria-hidden="true" className="skeleton">
      Loading
    </div>
  );
};

// A skeleton shimmer is decorative motion. It should be disabled or replaced
// when reduced motion is requested.

// ---------------------------------------------------------------------
// 61. Reduced motion and CSS custom properties
// ---------------------------------------------------------------------

export const MotionTokens: FC = (): ReactElement => {
  return <div className="motion-component">Example content</div>;
};

// Example CSS:
//
// .motion-component {
//     --motion-duration: 200ms;
//     transition: transform var(--motion-duration) ease;
// }
//
// @media (prefers-reduced-motion: reduce) {
//     .motion-component {
//         --motion-duration: 0ms;
//     }
// }
//
// Custom properties can centralize motion values while the media query
// changes them consistently.

// ---------------------------------------------------------------------
// 62. Reduced motion and reusable components
// ---------------------------------------------------------------------

interface AnimatedPanelProps {
  readonly children: ReactElement;
}

export const AnimatedPanel: FC<AnimatedPanelProps> = ({ children }): ReactElement => {
  return <section className="animated-panel">{children}</section>;
};

// Reusable components should expose semantic state independently from visual
// motion so their reduced-motion behavior can be controlled consistently.

// ---------------------------------------------------------------------
// 63. Motion preference hook
// ---------------------------------------------------------------------

const usePrefersReducedMotion = (): boolean => {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const handleChange = (event: MediaQueryListEvent): void => {
      setReducedMotion(event.matches);
    };

    setReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  return reducedMotion;
};

// This hook is useful when JavaScript behavior itself must depend on the
// user's motion preference.

// ---------------------------------------------------------------------
// 64. Using the motion preference hook
// ---------------------------------------------------------------------

export const MotionAwareComponent: FC = (): ReactElement => {
  const reducedMotion = usePrefersReducedMotion();

  return <button type="button">{reducedMotion ? "Open" : "Open with animation"}</button>;
};

// The component can choose a different behavior when animation itself is
// controlled through JavaScript.

// ---------------------------------------------------------------------
// 65. Prefer CSS when possible
// ---------------------------------------------------------------------

export const CSSFirstMotion: FC = (): ReactElement => {
  return (
    <section className="css-first-motion">
      <h2>Example</h2>

      <p>CSS controls the visual transition.</p>
    </section>
  );
};

// If JavaScript does not need to know the user's preference, keep the
// implementation in CSS instead of duplicating the preference in React state.

// ---------------------------------------------------------------------
// 66. JavaScript animation decision
// ---------------------------------------------------------------------

export const JavaScriptAnimationDecision: FC = (): ReactElement => {
  const reducedMotion = usePrefersReducedMotion();

  const handleAnimation = (): void => {
    if (reducedMotion) {
      return;
    }

    // Start a non-essential JavaScript animation here.
  };

  return (
    <button type="button" onClick={handleAnimation}>
      Animate
    </button>
  );
};

// JavaScript-controlled non-essential animation should not start when the user
// has requested reduced motion.

// ---------------------------------------------------------------------
// 67. Avoid starting then immediately canceling motion
// ---------------------------------------------------------------------

export const AvoidUnnecessaryAnimationStart: FC = (): ReactElement => {
  const reducedMotion = usePrefersReducedMotion();

  const handleOpen = (): void => {
    if (reducedMotion) {
      return;
    }

    // Start the animation only when it is appropriate.
  };

  return (
    <button type="button" onClick={handleOpen}>
      Open
    </button>
  );
};

// It is preferable not to start a motion effect and then cancel it after the
// user's preference has already indicated that it should not run.

// ---------------------------------------------------------------------
// 68. Reduced motion and timers
// ---------------------------------------------------------------------

export const MotionTimer: FC = (): ReactElement => {
  const reducedMotion = usePrefersReducedMotion();

  const delay = reducedMotion ? 0 : 300;

  return <p>Transition delay: {delay}ms</p>;
};

// A timer used only to synchronize decorative animation can be removed when
// motion is reduced. Timers that implement actual application behavior should
// not be changed merely because animation is disabled.

// ---------------------------------------------------------------------
// 69. Reduced motion and asynchronous behavior
// ---------------------------------------------------------------------

export const AsyncOperation: FC = (): ReactElement => {
  return (
    <section>
      <p role="status">Data loaded.</p>
    </section>
  );
};

// Loading and completion should remain communicated semantically even when
// visual animation is removed.

// ---------------------------------------------------------------------
// 70. Reduced motion and route loading
// ---------------------------------------------------------------------

export const RouteLoading: FC = (): ReactElement => {
  return (
    <main>
      <p role="status">Loading page...</p>
    </main>
  );
};

// A route-loading state should not depend on a spinner animation to convey
// that work is occurring.

// ---------------------------------------------------------------------
// 71. Reduced motion and motion preference persistence
// ---------------------------------------------------------------------

export const MotionPreferenceBoundary: FC = (): ReactElement => {
  const reducedMotion = usePrefersReducedMotion();

  return (
    <section>
      <p>The application respects the system preference: {reducedMotion ? "yes" : "no preference detected"}.</p>
    </section>
  );
};

// The system preference should normally be treated as an input to presentation,
// rather than overridden silently by the application.

// ---------------------------------------------------------------------
// 72. Optional application-level motion setting
// ---------------------------------------------------------------------

export const MotionSetting: FC = (): ReactElement => {
  const [reducedMotion, setReducedMotion] = useState(false);

  return (
    <label>
      <input
        type="checkbox"
        checked={reducedMotion}
        onChange={(event) => {
          setReducedMotion(event.target.checked);
        }}
      />
      Reduce application motion
    </label>
  );
};

// An application may provide its own setting in addition to the system
// preference. If both exist, the application should define predictable
// behavior rather than unexpectedly overriding the user's request.

// ---------------------------------------------------------------------
// 73. Combining system and application preferences
// ---------------------------------------------------------------------

export const CombinedMotionPreference: FC = (): ReactElement => {
  const systemPreference = usePrefersReducedMotion();
  const [applicationPreference, setApplicationPreference] = useState(false);

  const reducedMotion = systemPreference || applicationPreference;

  return (
    <section>
      <label>
        <input
          type="checkbox"
          checked={applicationPreference}
          onChange={(event) => {
            setApplicationPreference(event.target.checked);
          }}
        />
        Reduce motion
      </label>

      <p>Reduced motion is {reducedMotion ? "enabled" : "not enabled"}.</p>
    </section>
  );
};

// One conservative strategy is to enable reduced motion when either the
// system or application preference requests it.

// ---------------------------------------------------------------------
// 74. Reduced motion should not reduce functionality
// ---------------------------------------------------------------------

export const PreservedFunctionality: FC = (): ReactElement => {
  const reducedMotion = usePrefersReducedMotion();

  return (
    <section>
      <button type="button">Open</button>

      <p>{reducedMotion ? "The panel opens without animation." : "The panel may use a visual transition."}</p>
    </section>
  );
};

// Reduced motion changes presentation, not the underlying capability of the
// interface.

// ---------------------------------------------------------------------
// 75. Reduced motion and content visibility
// ---------------------------------------------------------------------

export const VisibleContent: FC = (): ReactElement => {
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

      <div hidden={!open}>
        <p>Additional information.</p>
      </div>
    </section>
  );
};

// Do not use reduced-motion handling as a reason to hide content that should
// remain available. Remove the animation, not the functionality.

// ---------------------------------------------------------------------
// 76. Testing reduced motion in CSS
// ---------------------------------------------------------------------

export const ReducedMotionTest: FC = (): ReactElement => {
  return (
    <ol>
      <li>Enable reduced motion in the operating system.</li>

      <li>Reload the application.</li>

      <li>Trigger animated components.</li>

      <li>Confirm non-essential motion is removed or reduced.</li>
    </ol>
  );
};

// The reduced-motion media query should be tested in the actual browser
// environment rather than assumed to work from source inspection alone.

// ---------------------------------------------------------------------
// 77. Testing reduced motion in React
// ---------------------------------------------------------------------

export const ReactReducedMotionTest: FC = (): ReactElement => {
  return (
    <ol>
      <li>Test the default motion preference.</li>

      <li>Test with reduced motion enabled.</li>

      <li>Change the system preference while the application is running.</li>

      <li>Confirm JavaScript-controlled animation responds.</li>
    </ol>
  );
};

// Components that use matchMedia() should be tested both at initial render
// and after the media-query state changes.

// ---------------------------------------------------------------------
// 78. Test semantic state independently
// ---------------------------------------------------------------------

export const SemanticStateTest: FC = (): ReactElement => {
  return (
    <ul>
      <li>Verify aria-expanded reflects the actual open state.</li>

      <li>Verify status messages remain available without animation.</li>

      <li>Verify focus still moves to the intended destination.</li>

      <li>Verify navigation remains functional.</li>
    </ul>
  );
};

// Reduced-motion testing should confirm that removing animation does not
// accidentally remove semantics, focus behavior, or interaction.

// ---------------------------------------------------------------------
// 79. Reduced-motion checklist
// ---------------------------------------------------------------------

export const ReducedMotionChecklist: FC = (): ReactElement => {
  return (
    <ul>
      <li>Identify non-essential motion.</li>

      <li>Respect prefers-reduced-motion.</li>

      <li>Remove or replace large movement.</li>

      <li>Remove unnecessary parallax.</li>

      <li>Reduce decorative looping animation.</li>

      <li>Preserve equivalent information.</li>

      <li>Preserve keyboard interaction.</li>

      <li>Preserve focus management.</li>

      <li>Preserve semantic state.</li>

      <li>Test both preference states.</li>
    </ul>
  );
};

// A reduced-motion review should consider both visual presentation and the
// functionality that the animation may have been supporting.

// ---------------------------------------------------------------------
// 80. Integrated reduced-motion example
// ---------------------------------------------------------------------

export const AccessibleReducedMotionExample: FC = (): ReactElement => {
  const reducedMotion = usePrefersReducedMotion();
  const [open, setOpen] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = (): void => {
    setSaved(true);
  };

  return (
    <main className={reducedMotion ? "reduce-motion" : undefined}>
      <h1>Account settings</h1>

      <button
        type="button"
        aria-expanded={open}
        aria-controls="details"
        onClick={() => {
          setOpen((current) => !current);
        }}
      >
        {open ? "Hide details" : "Show details"}
      </button>

      <section id="details" hidden={!open} className="details-panel">
        <h2>Details</h2>

        <p>This content remains available whether or not motion is enabled.</p>
      </section>

      <button type="button" onClick={handleSave}>
        Save changes
      </button>

      {saved && <p role="status">Changes saved successfully.</p>}

      <p>Motion preference: {reducedMotion ? "reduced" : "no preference"}.</p>
    </main>
  );
};

// Example CSS:
//
// .details-panel {
//     animation: slide-in 250ms ease;
// }
//
// @media (prefers-reduced-motion: reduce) {
//     .details-panel {
//         animation: none;
//     }
// }
//
// The semantic state, content, status message, and interaction remain the same.
// Only the optional visual motion changes with the user's preference.

export default AccessibleReducedMotionExample;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Reduced motion means adapting non-essential movement or animation to a user's preference.
// - prefers-reduced-motion is the primary CSS media feature for detecting the user's reduced-motion preference.
// - The reduce value indicates that the user prefers less motion.
// - Reduced motion does not automatically mean that every animation must be removed.
// - Non-essential motion should be removed, reduced, or replaced when appropriate.
// - Large scaling, panning, parallax, sliding, and repeated decorative movement can be problematic for motion-sensitive users.
// - CSS should handle reduced-motion presentation whenever JavaScript does not need to know the preference.
// - JavaScript can use matchMedia() when application behavior or JavaScript-controlled animation must change.
// - Browser APIs such as window.matchMedia() should not be accessed directly during server rendering.
// - A matchMedia change listener allows a running application to respond when the user's preference changes.
// - React state should represent semantic interface state independently from animation state.
// - Removing animation must not remove functionality, content, focus management, or semantic state.
// - aria-expanded, status messages, navigation, and other accessibility semantics should remain correct when motion is disabled.
// - Loading states should remain understandable without relying on animated spinners or skeleton effects.
// - Carousels, drawers, dialogs, accordions, notifications, route transitions, and scrolling can all require reduced-motion alternatives.
// - Smooth scrolling is optional presentation and should not be required for navigation to function.
// - JavaScript-controlled scrolling and animation need explicit reduced-motion handling because CSS media queries do not automatically stop JavaScript behavior.
// - Focus changes should not be delayed merely to synchronize them with decorative animation.
// - A reduced-motion preference should not be used to remove necessary information or application functionality.
// - An application can provide its own motion setting in addition to the system preference.
// - A conservative combined strategy can enable reduced motion when either the system or application setting requests it.
// - Test reduced-motion behavior both when the preference is enabled and when it is not.
// - Test preference changes while the application is running when JavaScript depends on matchMedia().
// - Verify that semantic state, keyboard interaction, focus behavior, and status communication remain intact without animation.
// - Reduced-motion accessibility is about preserving equivalent functionality while avoiding unnecessary movement.
