/**
 * ARIA
 * ====
 *
 * WAI-ARIA (Accessible Rich Internet Applications) provides roles, states, and properties
 * that communicate accessibility semantics to browsers and assistive technologies. ARIA
 * supplements HTML when native semantics are not sufficient, especially for custom widgets,
 * dynamic interfaces, relationships between elements, and application-specific states.
 *
 * ARIA does not automatically provide the behavior of a native HTML control. When native HTML
 * already provides the required semantics and behavior, it should generally be preferred over
 * recreating that behavior with ARIA.
 */

import { type ReactElement } from "react";

// ---------------------------------------------------------------------
// 1. What ARIA provides
// ---------------------------------------------------------------------

// ARIA adds accessibility semantics to elements.
//
// The three central concepts are:
//
// - Roles       describe what an element is.
// - States      describe a current condition that can change.
// - Properties  describe characteristics or relationships.
//
// ARIA semantics are exposed through the browser's accessibility APIs.
// They do not replace the underlying DOM, CSS, or JavaScript behavior.

export interface AriaConcept {
  readonly category: "Role" | "State" | "Property";
  readonly purpose: string;
}

export const ariaConcepts: readonly AriaConcept[] = [
  {
    category: "Role",
    purpose: "Identifies the type or semantic purpose of an element.",
  },
  {
    category: "State",
    purpose: "Communicates a current condition that can change during interaction.",
  },
  {
    category: "Property",
    purpose: "Communicates a characteristic or relationship associated with an element.",
  },
];

// ---------------------------------------------------------------------
// 2. ARIA supplements HTML
// ---------------------------------------------------------------------

export const AriaSupplementExample = (): ReactElement => {
  return (
    <button type="button" aria-pressed="false">
      Mute
    </button>
  );
};

// The button already has native button semantics.
//
// aria-pressed adds information about the button's toggle state.
//
// ARIA supplements the native semantics instead of replacing the button
// with a generic element.

// ---------------------------------------------------------------------
// 3. Prefer native HTML
// ---------------------------------------------------------------------

export const NativeButton = (): ReactElement => {
  return <button type="button">Save</button>;
};

// A native button already provides the semantics and interaction model
// expected of a button.
//
// A generic element with role="button" does not automatically acquire
// the native keyboard and activation behavior of a button.

// ---------------------------------------------------------------------
// 4. Native HTML versus unnecessary ARIA
// ---------------------------------------------------------------------

export const UnnecessaryButtonRole = (): ReactElement => {
  return (
    <button type="button" role="button">
      Save
    </button>
  );
};

// The explicit role is unnecessary because button already has button
// semantics.
//
// ARIA should not be added simply because a native element already
// provides the required semantics.

// ---------------------------------------------------------------------
// 5. The first rule of ARIA
// ---------------------------------------------------------------------

export const FirstRuleOfAria = (): ReactElement => {
  return <button type="button">Submit</button>;
};

// If a native HTML element provides the semantics and behavior required,
// prefer that element instead of recreating it with ARIA.
//
// This principle reduces the amount of custom behavior that must be
// implemented and maintained.

// ---------------------------------------------------------------------
// 6. ARIA does not create behavior
// ---------------------------------------------------------------------

export const AriaDoesNotCreateBehavior = (): ReactElement => {
  return <div role="button">Submit</div>;
};

// role="button" communicates button semantics to assistive technology.
//
// It does not make the div keyboard-operable or automatically implement
// click, Enter, or Space behavior.
//
// A real button should normally be used instead.

// ---------------------------------------------------------------------
// 7. A role is a semantic contract
// ---------------------------------------------------------------------

export const RoleContractExample = (): ReactElement => {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => {
        // Custom activation behavior would be implemented here.
      }}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
        }
      }}
    >
      Custom button
    </div>
  );
};

// A custom ARIA widget creates a responsibility to implement the interaction
// behavior expected from that widget.
//
// This example only illustrates the concept. A native button remains the
// preferred implementation when a button is what the interface requires.

// ---------------------------------------------------------------------
// 8. Roles
// ---------------------------------------------------------------------

export const RoleExample = (): ReactElement => {
  return <div role="status">Saved successfully.</div>;
};

// The role communicates the semantic type of the element.
//
// ARIA roles do not describe visual styling. A role communicates how the
// element should be understood by assistive technologies.

// ---------------------------------------------------------------------
// 9. Native implicit roles
// ---------------------------------------------------------------------

export const NativeImplicitSemantics = (): ReactElement => {
  return <button type="button">Continue</button>;
};

// HTML elements often already have implicit accessibility semantics.
//
// A button is exposed as a button without explicitly writing
// role="button".

// ---------------------------------------------------------------------
// 10. Explicit roles can change semantics
// ---------------------------------------------------------------------

export const ExplicitRoleExample = (): ReactElement => {
  return (
    <a href="/example" role="button">
      Continue
    </a>
  );
};

// Changing the role does not turn an anchor into a native button.
//
// The element still has anchor behavior such as link navigation, while
// assistive technology may receive the overridden role.
//
// Do not use conflicting roles as a substitute for choosing the correct
// native element.

// ---------------------------------------------------------------------
// 11. States
// ---------------------------------------------------------------------

export const AriaStateExample = (): ReactElement => {
  const expanded = true;

  return (
    <button type="button" aria-expanded={expanded}>
      Options
    </button>
  );
};

// aria-expanded communicates whether the controlled expandable content is
// currently expanded.
//
// The value must remain synchronized with the actual UI state.

// ---------------------------------------------------------------------
// 12. Properties
// ---------------------------------------------------------------------

export const AriaPropertyExample = (): ReactElement => {
  return (
    <button type="button" aria-describedby="save-help">
      Save
    </button>
  );
};

// aria-describedby establishes a relationship between the button and
// another element containing additional descriptive information.

// ---------------------------------------------------------------------
// 13. States and properties are different concepts
// ---------------------------------------------------------------------

export interface AriaStatePropertyExample {
  readonly expanded: boolean;
  readonly describedBy: string;
}

export const ariaStatePropertyExample: AriaStatePropertyExample = {
  expanded: false,
  describedBy: "help-text",
};

// aria-expanded describes a changing state.
//
// aria-describedby describes a relationship to another element.
//
// The distinction is useful when deciding which ARIA mechanism belongs
// to a particular accessibility requirement.

// ---------------------------------------------------------------------
// 14. ARIA attributes in JSX
// ---------------------------------------------------------------------

export const AriaJsxAttributes = (): ReactElement => {
  return (
    <button type="button" aria-label="Close dialog" aria-expanded={false} aria-controls="example-dialog">
      ×
    </button>
  );
};

// In JSX, ARIA attributes use their HTML attribute names.
//
// ARIA names remain lowercase and use hyphen-separated names such as
// aria-label, aria-expanded, and aria-controls.

// ---------------------------------------------------------------------
// 15. Boolean-like ARIA values
// ---------------------------------------------------------------------

export const AriaBooleanValues = (): ReactElement => {
  const expanded = false;

  return (
    <button type="button" aria-expanded={expanded}>
      Options
    </button>
  );
};

// React accepts the appropriate value for an ARIA boolean state and
// serializes it for the DOM.
//
// Keeping the value as actual component state helps prevent the
// accessibility state from becoming disconnected from the UI.

// ---------------------------------------------------------------------
// 16. Synchronizing ARIA with application state
// ---------------------------------------------------------------------

export interface DisclosureProps {
  readonly open: boolean;
  readonly onToggle: () => void;
}

export const Disclosure = ({ open, onToggle }: DisclosureProps): ReactElement => {
  return (
    <div>
      <button type="button" aria-expanded={open} aria-controls="example-disclosure" onClick={onToggle}>
        Options
      </button>

      {open && <div id="example-disclosure">Additional options.</div>}
    </div>
  );
};

// The DOM state and ARIA state describe the same UI state.
//
// When open is true, the controlled content exists and aria-expanded is
// true. When open is false, the content is hidden and aria-expanded is false.

// ---------------------------------------------------------------------
// 17. ARIA must describe reality
// ---------------------------------------------------------------------

export const InconsistentAria = (): ReactElement => {
  return (
    <div>
      <button type="button" aria-expanded={true} aria-controls="example-panel">
        Options
      </button>

      <div hidden id="example-panel">
        Additional options.
      </div>
    </div>
  );
};

// The ARIA state should correspond to the actual interface state.
//
// If a control claims that content is expanded while the content is
// actually hidden, the accessibility information is inconsistent.

// ---------------------------------------------------------------------
// 18. Accessible names
// ---------------------------------------------------------------------

export const AccessibleNameExample = (): ReactElement => {
  return <button type="button">Save</button>;
};

// The visible text provides the button's accessible name.
//
// An accessible name identifies the control to users of assistive
// technologies.

// ---------------------------------------------------------------------
// 19. aria-label
// ---------------------------------------------------------------------

export const AriaLabelExample = (): ReactElement => {
  return (
    <button type="button" aria-label="Close dialog">
      ×
    </button>
  );
};

// aria-label directly supplies an accessible name.
//
// It is useful when the visual content does not provide an adequate name,
// such as an icon-only control.

// ---------------------------------------------------------------------
// 20. Avoid replacing visible names unnecessarily
// ---------------------------------------------------------------------

export const VisibleLabelPreferred = (): ReactElement => {
  return (
    <button type="button" aria-label="Save document">
      Save document
    </button>
  );
};

// The visible text already provides a suitable accessible name.
//
// Adding aria-label here is unnecessary and can create maintenance
// problems if the visible label changes but the aria-label does not.

// ---------------------------------------------------------------------
// 21. aria-labelledby
// ---------------------------------------------------------------------

export const AriaLabelledByExample = (): ReactElement => {
  return (
    <section aria-labelledby="example-heading">
      <h2 id="example-heading">Account settings</h2>
      <p>Update your example account preferences.</p>
    </section>
  );
};

// aria-labelledby associates the section with an existing visible label.
//
// Referencing visible text is often preferable to duplicating that text
// in an aria-label.

// ---------------------------------------------------------------------
// 22. aria-describedby
// ---------------------------------------------------------------------

export const AriaDescribedByExample = (): ReactElement => {
  return (
    <div>
      <label htmlFor="example-password">Password</label>

      <input id="example-password" type="password" aria-describedby="password-help" />

      <p id="password-help">Use at least 12 characters.</p>
    </div>
  );
};

// aria-describedby associates additional descriptive information with the
// input without replacing its accessible name.

// ---------------------------------------------------------------------
// 23. Label versus description
// ---------------------------------------------------------------------

export const LabelAndDescription = (): ReactElement => {
  return (
    <div>
      <label htmlFor="example-email">Email address</label>

      <input id="example-email" type="email" aria-describedby="email-help" />

      <p id="email-help">Use an address such as john@example.com.</p>
    </div>
  );
};

// The label identifies the control.
//
// The description provides supplementary information.
//
// These are different accessibility relationships and should not be
// treated as interchangeable.

// ---------------------------------------------------------------------
// 24. Relationships between elements
// ---------------------------------------------------------------------

export const AriaRelationshipExample = (): ReactElement => {
  return (
    <div>
      <button type="button" aria-controls="example-panel" aria-expanded={false}>
        Details
      </button>

      <div id="example-panel" hidden>
        Additional details.
      </div>
    </div>
  );
};

// aria-controls expresses which element a control operates on.
//
// aria-expanded communicates the current expanded state.
//
// The referenced ID must identify the intended element.

// ---------------------------------------------------------------------
// 25. ID references must remain valid
// ---------------------------------------------------------------------

export const ValidAriaReference = (): ReactElement => {
  return (
    <div>
      <button type="button" aria-describedby="example-description">
        Save
      </button>

      <p id="example-description">Saving will update the example profile.</p>
    </div>
  );
};

// ARIA relationships commonly use ID references.
//
// The referenced element must exist and have the intended meaning.

// ---------------------------------------------------------------------
// 26. Broken ARIA relationships
// ---------------------------------------------------------------------

export const BrokenAriaReference = (): ReactElement => {
  return (
    <button type="button" aria-describedby="missing-description">
      Save
    </button>
  );
};

// The referenced element does not exist.
//
// The attribute therefore cannot establish the intended relationship.
//
// Invalid ID references are a common ARIA implementation error.

// ---------------------------------------------------------------------
// 27. Hidden content and ARIA
// ---------------------------------------------------------------------

export const HiddenContent = (): ReactElement => {
  return (
    <div>
      <button type="button" aria-expanded={false} aria-controls="example-panel">
        Details
      </button>

      <div id="example-panel" hidden>
        Additional details.
      </div>
    </div>
  );
};

// The hidden attribute changes the rendered accessibility state of the
// controlled content.
//
// ARIA should describe the actual state rather than attempting to expose
// content that the interface has intentionally hidden.

// ---------------------------------------------------------------------
// 28. ARIA is not visual styling
// ---------------------------------------------------------------------

export const AriaIsNotStyling = (): ReactElement => {
  return (
    <button type="button" aria-pressed={true}>
      Favorite
    </button>
  );
};

// aria-pressed communicates state.
//
// CSS can use the state to change visual presentation, but the ARIA
// attribute itself does not define the visual appearance of the button.

// ---------------------------------------------------------------------
// 29. ARIA does not replace keyboard interaction
// ---------------------------------------------------------------------

export const KeyboardBehaviorStillMatters = (): ReactElement => {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => {
        // Custom activation behavior.
      }}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
        }
      }}
    >
      Custom action
    </div>
  );
};

// A role communicates semantics, but custom widgets still require the
// interaction behavior expected from that widget.
//
// Native controls avoid much of this custom implementation burden.

// ---------------------------------------------------------------------
// 30. Do not use ARIA to fix incorrect HTML
// ---------------------------------------------------------------------

export const CorrectHtmlStructure = (): ReactElement => {
  return (
    <nav aria-label="Primary">
      <ul>
        <li>
          <a href="/example">Home</a>
        </li>
        <li>
          <a href="/example/products">Products</a>
        </li>
      </ul>
    </nav>
  );
};

// Use HTML's native structure first.
//
// ARIA should supplement the structure when additional semantics are
// actually needed, not compensate for avoidable misuse of HTML.

// ---------------------------------------------------------------------
// 31. Landmark semantics
// ---------------------------------------------------------------------

export const LandmarkExample = (): ReactElement => {
  return (
    <>
      <header>
        <h1>Example site</h1>
      </header>

      <nav aria-label="Primary">
        <a href="/example">Home</a>
        <a href="/example/products">Products</a>
      </nav>

      <main>
        <h2>Example content</h2>
        <p>Primary page content.</p>
      </main>
    </>
  );
};

// Semantic HTML already provides many landmark semantics.
//
// ARIA can provide additional labeling when multiple landmarks of the
// same type need to be distinguished.

// ---------------------------------------------------------------------
// 32. Labeling multiple landmarks
// ---------------------------------------------------------------------

export const MultipleNavigationLandmarks = (): ReactElement => {
  return (
    <>
      <nav aria-label="Primary">
        <a href="/example">Home</a>
        <a href="/example/products">Products</a>
      </nav>

      <nav aria-label="Account">
        <a href="/example/profile">Profile</a>
        <a href="/example/settings">Settings</a>
      </nav>
    </>
  );
};

// When multiple navigation landmarks exist, an accessible label can
// distinguish their purposes.

// ---------------------------------------------------------------------
// 33. Regions
// ---------------------------------------------------------------------

export const RegionExample = (): ReactElement => {
  return (
    <section aria-labelledby="example-section-heading">
      <h2 id="example-section-heading">Important information</h2>

      <p>This section contains information relevant to the current task.</p>
    </section>
  );
};

// A named section can expose useful region semantics when its content
// represents a meaningful navigable region.
//
// Not every section needs an ARIA region role or label.

// ---------------------------------------------------------------------
// 34. Do not add ARIA landmarks everywhere
// ---------------------------------------------------------------------

export const MinimalLandmarks = (): ReactElement => {
  return (
    <main>
      <h1>Example page</h1>
      <p>Example content.</p>
    </main>
  );
};

// Excessive landmark usage can make navigation harder rather than easier.
//
// Landmarks should represent meaningful regions of the interface.

// ---------------------------------------------------------------------
// 35. Form semantics
// ---------------------------------------------------------------------

export const NativeFormSemantics = (): ReactElement => {
  return (
    <form>
      <label htmlFor="example-name">Name</label>

      <input id="example-name" name="name" />

      <button type="submit">Save</button>
    </form>
  );
};

// Native form elements provide established semantics.
//
// Use ARIA when additional relationships or states are required rather
// than replacing every form element with generic elements.

// ---------------------------------------------------------------------
// 36. ARIA for custom widgets
// ---------------------------------------------------------------------

export const CustomProgress = (): ReactElement => {
  const progress = 75;

  return (
    <div
      role="progressbar"
      aria-label="Upload progress"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={progress}
    />
  );
};

// A custom widget may require ARIA to expose semantics that do not come
// from a suitable native HTML element.
//
// The implementation must keep the ARIA values synchronized with the
// actual widget state.

// ---------------------------------------------------------------------
// 37. Prefer native progress when appropriate
// ---------------------------------------------------------------------

export const NativeProgress = (): ReactElement => {
  return (
    <label>
      Upload progress
      <progress value={75} max={100}>
        75%
      </progress>
    </label>
  );
};

// The native progress element already provides progress semantics.
//
// Recreating it with div elements and ARIA is unnecessary when native
// progress semantics meet the requirement.

// ---------------------------------------------------------------------
// 38. Native checkbox versus custom checkbox
// ---------------------------------------------------------------------

export const NativeCheckbox = (): ReactElement => {
  return (
    <label>
      <input type="checkbox" />
      Receive notifications
    </label>
  );
};

// Native checkbox behavior should be preferred when it meets the design
// requirement.

// ---------------------------------------------------------------------
// 39. Custom checkbox semantics
// ---------------------------------------------------------------------

export interface CustomCheckboxProps {
  readonly checked: boolean;
  readonly onChange: () => void;
}

export const CustomCheckbox = ({ checked, onChange }: CustomCheckboxProps): ReactElement => {
  return (
    <span role="checkbox" aria-checked={checked} tabIndex={0} onClick={onChange}>
      Receive notifications
    </span>
  );
};

// This illustrates the semantic layer required for a custom checkbox.
//
// It is intentionally not presented as a complete checkbox implementation.
// Keyboard interaction, focus behavior, and all required widget behavior
// must also be implemented for a production custom control.
//
// A native checkbox is normally preferable.

// ---------------------------------------------------------------------
// 40. ARIA and interactive elements
// ---------------------------------------------------------------------

export const InteractiveElementExample = (): ReactElement => {
  return (
    <button type="button" aria-expanded={false}>
      Show details
    </button>
  );
};

// ARIA states and properties are particularly useful for communicating
// the current state and relationships of interactive widgets.

// ---------------------------------------------------------------------
// 41. ARIA should not create contradictory semantics
// ---------------------------------------------------------------------

export const AvoidContradictorySemantics = (): ReactElement => {
  return (
    <button type="button" aria-disabled={true}>
      Save
    </button>
  );
};

// aria-disabled communicates an accessibility state, but it does not
// automatically provide the same behavior as the native disabled attribute.
//
// If a native disabled button is required, use:
//
// <button type="button" disabled>
//
// The semantics and behavior should match the intended interaction.

// ---------------------------------------------------------------------
// 42. Native disabled behavior
// ---------------------------------------------------------------------

export const NativeDisabledButton = (): ReactElement => {
  return (
    <button type="button" disabled>
      Save
    </button>
  );
};

// Native HTML behavior is preferable when the control genuinely needs
// to be disabled according to the native interaction model.

// ---------------------------------------------------------------------
// 43. aria-disabled is different
// ---------------------------------------------------------------------

export const AriaDisabledButton = (): ReactElement => {
  return (
    <button type="button" aria-disabled={true}>
      Save
    </button>
  );
};

// aria-disabled communicates that an element is disabled from an
// accessibility perspective, but it does not automatically prevent
// interaction.
//
// Application logic must enforce the intended behavior.

// ---------------------------------------------------------------------
// 44. ARIA does not validate application logic
// ---------------------------------------------------------------------

export interface SaveButtonProps {
  readonly canSave: boolean;
}

export const SaveButton = ({ canSave }: SaveButtonProps): ReactElement => {
  return (
    <button type="button" disabled={!canSave}>
      Save
    </button>
  );
};

// Accessibility semantics should reflect real application state.
//
// ARIA cannot substitute for application logic, validation, or state
// management.

// ---------------------------------------------------------------------
// 45. ARIA and error messaging
// ---------------------------------------------------------------------

export const FormErrorExample = (): ReactElement => {
  return (
    <div>
      <label htmlFor="example-email">Email address</label>

      <input id="example-email" type="email" aria-invalid={true} aria-describedby="email-error" />

      <p id="email-error">Enter a valid email address.</p>
    </div>
  );
};

// aria-invalid communicates the invalid state.
//
// aria-describedby associates the input with the error message.
//
// The application must ensure both values accurately reflect the actual
// validation state.

// ---------------------------------------------------------------------
// 46. ARIA and loading status
// ---------------------------------------------------------------------

export const LoadingStatus = ({ loading }: { readonly loading: boolean }): ReactElement => {
  return (
    <div>
      <button type="button" disabled={loading}>
        {loading ? "Saving..." : "Save"}
      </button>

      <div role="status">{loading ? "Saving changes." : "Changes saved."}</div>
    </div>
  );
};

// A status region can communicate updates without requiring the user to
// find the changed text visually.
//
// The content should accurately reflect the application's current state.

// ---------------------------------------------------------------------
// 47. ARIA and dynamic content
// ---------------------------------------------------------------------

export const DynamicStatus = ({ message }: { readonly message: string }): ReactElement => {
  return <div role="status">{message}</div>;
};

// ARIA can communicate dynamic updates that would otherwise be difficult
// for assistive technology users to discover.
//
// The behavior and appropriate live-region semantics depend on the type
// of update.

// ---------------------------------------------------------------------
// 48. ARIA relationships are not visual
// ---------------------------------------------------------------------

export const NonVisualRelationship = (): ReactElement => {
  return (
    <div>
      <button type="button" aria-describedby="example-help">
        Continue
      </button>

      <p id="example-help">Your changes will be saved automatically.</p>
    </div>
  );
};

// The button and description may be visually separated or styled in
// different ways while retaining their programmatic relationship.

// ---------------------------------------------------------------------
// 49. ARIA and DOM structure
// ---------------------------------------------------------------------

export const AriaDoesNotChangeDom = (): ReactElement => {
  return (
    <div role="button" aria-label="Example action">
      Action
    </div>
  );
};

// ARIA adds accessibility semantics.
//
// It does not turn the div into an actual HTML button element or change
// the underlying DOM element's native behavior.

// ---------------------------------------------------------------------
// 50. ARIA does not replace CSS
// ---------------------------------------------------------------------

export const AriaAndCss = (): ReactElement => {
  return (
    <button type="button" aria-pressed={true} className="selected">
      Favorite
    </button>
  );
};

// ARIA communicates semantics and state.
//
// CSS controls visual presentation.
//
// JavaScript controls application behavior.
//
// Accessible components require these layers to remain consistent.

// ---------------------------------------------------------------------
// 51. ARIA does not replace focus management
// ---------------------------------------------------------------------

export const DialogTrigger = (): ReactElement => {
  return (
    <button type="button" aria-haspopup="dialog" aria-controls="example-dialog">
      Open dialog
    </button>
  );
};

// ARIA can communicate that a control opens a dialog and which element
// it controls.
//
// ARIA does not automatically move focus into the dialog or return focus
// to the triggering control.

// ---------------------------------------------------------------------
// 52. ARIA does not replace keyboard navigation
// ---------------------------------------------------------------------

export const TabListSemantics = (): ReactElement => {
  return (
    <div role="tablist" aria-label="Example sections">
      <button type="button" role="tab" aria-selected={true} aria-controls="example-panel" id="example-tab">
        Overview
      </button>
    </div>
  );
};

// ARIA can expose the semantics of a tab interface.
//
// It does not automatically implement tab selection, focus movement,
// activation, or panel management.

// ---------------------------------------------------------------------
// 53. ARIA widget patterns require complete behavior
// ---------------------------------------------------------------------

export interface WidgetRequirements {
  readonly semantics: boolean;
  readonly keyboardInteraction: boolean;
  readonly focusManagement: boolean;
  readonly stateSynchronization: boolean;
}

export const completeWidgetRequirements: WidgetRequirements = {
  semantics: true,
  keyboardInteraction: true,
  focusManagement: true,
  stateSynchronization: true,
};

// A custom ARIA widget is a complete interaction problem, not just a
// collection of ARIA attributes.

// ---------------------------------------------------------------------
// 54. Avoid ARIA when HTML already solves the problem
// ---------------------------------------------------------------------

export const NativeSelect = (): ReactElement => {
  return (
    <label>
      Country
      <select defaultValue="example">
        <option value="example">Example</option>
        <option value="other">Other</option>
      </select>
    </label>
  );
};

// Native controls provide semantics and behavior that would otherwise
// require substantial custom implementation.

// ---------------------------------------------------------------------
// 55. ARIA does not make invalid HTML accessible
// ---------------------------------------------------------------------

export const ValidStructure = (): ReactElement => {
  return <button type="button">Continue</button>;
};

// ARIA should be used alongside valid, meaningful HTML rather than as a
// mechanism for disguising incorrect element choices.

// ---------------------------------------------------------------------
// 56. Avoid role="presentation" as a generic fix
// ---------------------------------------------------------------------

export const PresentationExample = (): ReactElement => {
  return (
    <div>
      <img src="/example-decoration.svg" alt="" />
      <p>Example content.</p>
    </div>
  );
};

// Decorative content should be made appropriately non-informative using
// the mechanism appropriate to that element.
//
// Do not apply presentation semantics indiscriminately to remove
// semantics that users actually need.

// ---------------------------------------------------------------------
// 57. ARIA can hide useful semantics
// ---------------------------------------------------------------------

export const SemanticConflictExample = (): ReactElement => {
  return (
    <button type="button" role="presentation">
      Save
    </button>
  );
};

// Overriding native semantics can remove information that assistive
// technologies rely on.
//
// ARIA should enhance accessibility semantics rather than accidentally
// suppress useful native semantics.

// ---------------------------------------------------------------------
// 58. ARIA attribute validity
// ---------------------------------------------------------------------

export const ValidAriaAttributes = (): ReactElement => {
  return (
    <button type="button" aria-label="Save" aria-pressed={false}>
      Save
    </button>
  );
};

// ARIA attributes are standardized.
//
// Misspelled or unsupported aria-* attributes do not provide the intended
// accessibility semantics.

// ---------------------------------------------------------------------
// 59. Avoid invented ARIA attributes
// ---------------------------------------------------------------------

export const StandardAriaAttributes = (): ReactElement => {
  return (
    <button type="button" aria-label="Save">
      Save
    </button>
  );
};

// Do not invent attributes such as:
//
// aria-description-text
// aria-state
// aria-help
//
// Use standardized ARIA attributes or appropriate native HTML features.

// ---------------------------------------------------------------------
// 60. ARIA naming should be concise
// ---------------------------------------------------------------------

export const ConciseAriaName = (): ReactElement => {
  return (
    <button type="button" aria-label="Close">
      ×
    </button>
  );
};

// Accessible names should identify the control clearly and efficiently.
//
// Long or redundant names can make non-visual navigation harder to use.

// ---------------------------------------------------------------------
// 61. Prefer visible text when possible
// ---------------------------------------------------------------------

export const VisibleTextName = (): ReactElement => {
  return <button type="button">Close</button>;
};

// Visible text is often the simplest and most robust way to provide a
// control's accessible name.

// ---------------------------------------------------------------------
// 62. ARIA and component abstractions
// ---------------------------------------------------------------------

export interface ToggleProps {
  readonly pressed: boolean;
  readonly onToggle: () => void;
}

export const Toggle = ({ pressed, onToggle }: ToggleProps): ReactElement => {
  return (
    <button type="button" aria-pressed={pressed} onClick={onToggle}>
      Favorite
    </button>
  );
};

// Component abstractions can centralize ARIA behavior.
//
// The component should keep the ARIA state synchronized with the state
// that controls the actual interface.

// ---------------------------------------------------------------------
// 63. Do not hard-code changing ARIA state
// ---------------------------------------------------------------------

export const DynamicToggle = ({ pressed }: { readonly pressed: boolean }): ReactElement => {
  return (
    <button type="button" aria-pressed={pressed}>
      Favorite
    </button>
  );
};

// ARIA state should normally be derived from the same source of truth as
// the component's visual and behavioral state.

// ---------------------------------------------------------------------
// 64. ARIA and reusable components
// ---------------------------------------------------------------------

export interface DisclosureButtonProps {
  readonly expanded: boolean;
  readonly controls: string;
  readonly children: string;
  readonly onClick: () => void;
}

export const DisclosureButton = ({ expanded, controls, children, onClick }: DisclosureButtonProps): ReactElement => {
  return (
    <button type="button" aria-expanded={expanded} aria-controls={controls} onClick={onClick}>
      {children}
    </button>
  );
};

// Reusable components should expose the state and relationships needed
// to keep their accessibility semantics synchronized with their behavior.

// ---------------------------------------------------------------------
// 65. Avoid hiding meaningful information with aria-hidden
// ---------------------------------------------------------------------

export const VisibleMeaningfulContent = (): ReactElement => {
  return <p>Example warning message.</p>;
};

// aria-hidden should not be used merely to suppress content that users
// need to understand the interface.
//
// Removing meaningful content from the accessibility tree can create a
// mismatch between visual and non-visual experiences.

// ---------------------------------------------------------------------
// 66. aria-hidden for decorative content
// ---------------------------------------------------------------------

export const DecorativeSvgExample = (): ReactElement => {
  return (
    <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24">
      <path d="M12 2L2 22h20L12 2z" />
    </svg>
  );
};

// aria-hidden can be appropriate for decorative content that should not
// be exposed to assistive technologies.
//
// Decorative content must also not contain focusable or otherwise
// interactive content that users need to reach.

// ---------------------------------------------------------------------
// 67. ARIA and accessible names are connected
// ---------------------------------------------------------------------

export const NamedControl = (): ReactElement => {
  return (
    <button type="button" aria-label="Open settings">
      ⚙
    </button>
  );
};

// A role tells assistive technology what an element is.
//
// An accessible name tells the user what that particular element is for.
//
// Both concepts are important for interactive controls.

// ---------------------------------------------------------------------
// 68. ARIA and descriptions are different
// ---------------------------------------------------------------------

export const NamedAndDescribedControl = (): ReactElement => {
  return (
    <div>
      <button type="button" aria-label="Delete" aria-describedby="delete-description">
        ×
      </button>

      <p id="delete-description">This action permanently removes the example item.</p>
    </div>
  );
};

// aria-label supplies the name.
//
// aria-describedby supplies supplementary descriptive information.

// ---------------------------------------------------------------------
// 69. ARIA and semantic HTML work together
// ---------------------------------------------------------------------

export const HtmlAndAriaTogether = (): ReactElement => {
  return (
    <form aria-describedby="form-description">
      <p id="form-description">Complete the fields below to update the example profile.</p>

      <label htmlFor="example-name">Name</label>

      <input id="example-name" name="name" />

      <button type="submit">Save</button>
    </form>
  );
};

// Native HTML supplies the basic document and form semantics.
//
// ARIA adds an additional relationship where the native markup alone
// does not express the desired description.

// ---------------------------------------------------------------------
// 70. ARIA should remain synchronized during updates
// ---------------------------------------------------------------------

export interface ExpandableSectionProps {
  readonly expanded: boolean;
}

export const ExpandableSection = ({ expanded }: ExpandableSectionProps): ReactElement => {
  return (
    <section>
      <button type="button" aria-expanded={expanded} aria-controls="example-content">
        Details
      </button>

      <div id="example-content" hidden={!expanded}>
        Additional details.
      </div>
    </section>
  );
};

// A state transition should update all related parts of the interface.
//
// Here the expanded state controls both the ARIA state and the visibility
// of the associated content.

// ---------------------------------------------------------------------
// 71. ARIA is not a substitute for accessible design
// ---------------------------------------------------------------------

export const AccessibleDesignExample = (): ReactElement => {
  return (
    <button type="button" aria-pressed={true} className="favorite-button">
      Favorite
    </button>
  );
};

// ARIA communicates semantics, but an accessible component also requires:
//
// - usable keyboard interaction
// - visible focus
// - understandable labels
// - appropriate visual states
// - sufficient contrast
// - correct application behavior
//
// ARIA is one part of the accessibility implementation.

// ---------------------------------------------------------------------
// 72. Common ARIA mistakes
// ---------------------------------------------------------------------

export const commonAriaMistakes = [
  "Using ARIA when a native HTML element already provides the required semantics",
  "Adding a role without implementing the required interaction behavior",
  "Using an incorrect role for the actual widget",
  "Providing an accessible state that does not match the visual state",
  "Using aria-label when visible text already provides the correct name",
  "Using broken ID references with aria-labelledby or aria-describedby",
  "Inventing unsupported aria-* attributes",
  "Using aria-hidden to hide meaningful content",
  "Adding excessive landmarks",
  "Treating ARIA as a replacement for keyboard support",
  "Treating ARIA as a replacement for focus management",
] as const;

// ARIA mistakes are often semantic or behavioral rather than syntactic.
//
// Valid JSX can still produce an inaccessible component when the ARIA
// information does not match the actual interface.

// ---------------------------------------------------------------------
// 73. ARIA implementation checklist
// ---------------------------------------------------------------------

export const ariaChecklist = [
  "Use native HTML whenever it provides the required semantics and behavior.",
  "Add ARIA only when it provides necessary additional semantics.",
  "Choose a role that accurately represents the component.",
  "Implement the behavior required by custom ARIA widgets.",
  "Keep ARIA states synchronized with actual UI state.",
  "Provide accessible names for interactive controls.",
  "Use visible text and native naming mechanisms when appropriate.",
  "Keep aria-labelledby and aria-describedby references valid.",
  "Do not invent ARIA attributes.",
  "Do not use aria-hidden to hide meaningful content.",
  "Test keyboard interaction separately from ARIA semantics.",
  "Inspect the resulting accessibility tree when appropriate.",
] as const;

// ARIA should be evaluated as part of the complete interaction model,
// not as a collection of isolated attributes.

// ---------------------------------------------------------------------
// 74. Integrated ARIA example
// ---------------------------------------------------------------------

export interface AccessibleDisclosureProps {
  readonly expanded: boolean;
  readonly onToggle: () => void;
}

export const AccessibleDisclosure = ({ expanded, onToggle }: AccessibleDisclosureProps): ReactElement => {
  return (
    <section aria-labelledby="example-disclosure-heading">
      <h2 id="example-disclosure-heading">Example settings</h2>

      <button type="button" aria-expanded={expanded} aria-controls="example-disclosure-panel" onClick={onToggle}>
        {expanded ? "Hide settings" : "Show settings"}
      </button>

      <div id="example-disclosure-panel" hidden={!expanded}>
        <p>Update your example account preferences.</p>

        <label htmlFor="example-email">Email address</label>

        <input id="example-email" type="email" aria-describedby="example-email-help" />

        <p id="example-email-help">Use an address such as john@example.com.</p>
      </div>
    </section>
  );
};

// This component combines several accessibility mechanisms:
//
// - native section and heading semantics
// - visible button text
// - aria-expanded for current disclosure state
// - aria-controls for the controlled relationship
// - hidden for actual content visibility
// - native label/input semantics
// - aria-describedby for additional input guidance
//
// Each ARIA attribute adds a specific semantic relationship or state rather
// than replacing the native HTML semantics.

// ---------------------------------------------------------------------
// 75. ARIA decision process
// ---------------------------------------------------------------------

export const ariaDecisionProcess = [
  "Start with the correct native HTML element.",
  "Determine whether native semantics already express the requirement.",
  "Add ARIA only when additional semantics or relationships are needed.",
  "If creating a custom widget, implement its required keyboard and interaction behavior.",
  "Provide an accessible name when the native content does not supply one.",
  "Provide states and properties that accurately reflect the current UI.",
  "Keep referenced IDs valid.",
  "Test the complete component rather than checking attributes in isolation.",
] as const;

// The practical ARIA workflow is:
//
// native semantics first
// then additional ARIA semantics
// then complete interaction behavior
// then accessibility testing

// ---------------------------------------------------------------------
// 76. Final ARIA model
// ---------------------------------------------------------------------

export interface AriaAccessibilityModel {
  readonly usesNativeHtmlFirst: boolean;
  readonly rolesDescribeSemantics: boolean;
  readonly statesReflectCurrentUi: boolean;
  readonly propertiesDescribeRelationships: boolean;
  readonly customWidgetsImplementBehavior: boolean;
  readonly controlsHaveAccessibleNames: boolean;
  readonly ariaReferencesAreValid: boolean;
}

export const ariaAccessibilityModel: AriaAccessibilityModel = {
  usesNativeHtmlFirst: true,
  rolesDescribeSemantics: true,
  statesReflectCurrentUi: true,
  propertiesDescribeRelationships: true,
  customWidgetsImplementBehavior: true,
  controlsHaveAccessibleNames: true,
  ariaReferencesAreValid: true,
};

// ARIA is most effective when it supplements a sound HTML structure and
// remains synchronized with the complete behavior of the interface.

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - WAI-ARIA provides roles, states, and properties that communicate accessibility semantics.
// - ARIA supplements HTML; it does not replace the underlying DOM, CSS, or JavaScript behavior.
// - The first rule of ARIA is to prefer native HTML when it already provides the required semantics and behavior.
// - Native elements usually provide more built-in behavior than equivalent custom ARIA widgets.
// - A role communicates what an element is, while states and properties communicate additional conditions and relationships.
// - Adding an ARIA role does not automatically provide the keyboard or interaction behavior associated with that role.
// - Custom ARIA widgets require their expected keyboard, focus, state, and interaction behavior to be implemented.
// - ARIA states must remain synchronized with the actual state of the interface.
// - Accessible names identify controls, while descriptions provide supplementary information.
// - aria-label can provide an accessible name when appropriate, but visible text and native naming mechanisms should generally be preferred when available.
// - aria-labelledby can associate an element with an existing visible label.
// - aria-describedby can associate an element with supplementary descriptive content.
// - ARIA relationships commonly use ID references, so referenced IDs must remain valid.
// - ARIA can communicate relationships such as expanded content, controlled elements, descriptions, and labelled regions.
// - Semantic HTML and ARIA work together; ARIA should not be used to compensate for avoidable misuse of HTML.
// - ARIA does not replace keyboard navigation, focus management, validation, or application behavior.
// - ARIA does not define visual styling.
// - ARIA attributes should describe the actual interface rather than an imagined or stale state.
// - aria-hidden should not be used to remove meaningful content from the accessibility tree.
// - Dynamic interfaces can use ARIA to communicate relevant state changes and status information.
// - Accessible names should be concise, clear, and appropriate to the control's purpose.
// - The safest ARIA implementation starts with native HTML, adds only necessary ARIA semantics, implements complete widget behavior when required, and keeps all accessibility information synchronized with the UI.
