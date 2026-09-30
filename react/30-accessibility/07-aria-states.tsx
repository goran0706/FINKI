/**
 * ARIA States
 * ===========
 *
 * WAI-ARIA states communicate dynamic conditions of an interface element,
 * such as whether a control is expanded, checked, selected, pressed, disabled,
 * invalid, or currently active. Unlike ordinary descriptive properties, states
 * commonly change in response to user interaction or application updates.
 *
 * ARIA states affect the semantics exposed through the accessibility tree.
 * They do not create the corresponding interaction behavior, focus management,
 * validation, or visual presentation. Native HTML should be preferred whenever
 * it already provides the required semantics and behavior.
 */

// ---------------------------------------------------------------------
// Imports
// ---------------------------------------------------------------------

import { useState, type FC, type ReactElement } from "react";

// ---------------------------------------------------------------------
// 1. What an ARIA state represents
// ---------------------------------------------------------------------

// An ARIA state describes a current condition of an interface element.
// States can change as the user interacts with the application.
//
// Examples include:
// aria-checked   - whether a checkbox-like widget is checked
// aria-disabled  - whether an element is unavailable for interaction
// aria-expanded  - whether controlled content is expanded
// aria-invalid   - whether an entered value is invalid
// aria-pressed   - whether a toggle button is pressed
// aria-selected  - whether an item is selected
//
// WAI-ARIA distinguishes states from properties conceptually, although
// both are exposed through ARIA attributes in HTML.

interface StateDescription {
  readonly name: string;
  readonly purpose: string;
}

const stateDescriptions: StateDescription[] = [
  {
    name: "aria-checked",
    purpose: "Communicates the checked state of an applicable widget.",
  },
  {
    name: "aria-disabled",
    purpose: "Communicates that an element is perceivable but disabled.",
  },
  {
    name: "aria-expanded",
    purpose: "Communicates whether controlled content is expanded or collapsed.",
  },
  {
    name: "aria-invalid",
    purpose: "Communicates that an entered value does not conform to the expected format.",
  },
  {
    name: "aria-pressed",
    purpose: "Communicates the pressed state of a toggle button.",
  },
  {
    name: "aria-selected",
    purpose: "Communicates the selected state of an applicable widget item.",
  },
];

// ---------------------------------------------------------------------
// 2. ARIA states do not create behavior
// ---------------------------------------------------------------------

// Adding an ARIA state does not make an element behave like the widget
// represented by that state.
//
// aria-expanded does not open a panel.
// aria-checked does not toggle a checkbox.
// aria-pressed does not toggle a button.
// aria-disabled does not automatically prevent interaction.
//
// Application logic must keep the state, behavior, DOM, and ARIA semantics
// synchronized.

export const SemanticStateOnly: FC = (): ReactElement => {
  return (
    <div role="button" aria-pressed={false}>
      Toggle
    </div>
  );
};

// A native <button> is normally preferable because it already provides
// button semantics, keyboard behavior, focus behavior, and activation.

// ---------------------------------------------------------------------
// 3. aria-expanded
// ---------------------------------------------------------------------

// aria-expanded communicates whether a control is currently expanded
// or collapsed.
//
// It belongs on the interactive control that changes the visibility or
// presence of the controlled content.

export const ExpandedState: FC = (): ReactElement => {
  const [expanded, setExpanded] = useState(false);

  return (
    <section>
      <button
        type="button"
        aria-expanded={expanded}
        aria-controls="details"
        onClick={() => setExpanded((current) => !current)}
      >
        {expanded ? "Hide details" : "Show details"}
      </button>

      <div id="details" hidden={!expanded}>
        Additional information is displayed here.
      </div>
    </section>
  );
};

// The same React state drives:
// 1. the visible label,
// 2. aria-expanded,
// 3. the hidden state of the controlled region.

// ---------------------------------------------------------------------
// 4. aria-expanded must match the interface
// ---------------------------------------------------------------------

// ARIA should describe the actual state of the interface.
//
// Incorrect:
// aria-expanded={false}
// while the controlled content is visibly expanded.
//
// Correct:
// derive aria-expanded from the same state that determines whether the
// controlled content is shown.

export const SynchronizedExpandedState: FC = (): ReactElement => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div>
      <button
        type="button"
        aria-expanded={expanded}
        aria-controls="synchronized-content"
        onClick={() => setExpanded((current) => !current)}
      >
        Details
      </button>

      <div id="synchronized-content" hidden={!expanded}>
        The accessibility state matches the visible state.
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------
// 5. aria-checked
// ---------------------------------------------------------------------

// aria-checked communicates whether an applicable widget is checked.
//
// Supported values depend on the role. For checkbox-like widgets,
// true and false are available, while a checkbox can also represent
// a mixed state.

export const NativeCheckboxState: FC = (): ReactElement => {
  return (
    <label>
      <input type="checkbox" defaultChecked />
      Receive notifications
    </label>
  );
};

// Native HTML controls should normally be preferred because they already
// provide the required checked semantics and interaction behavior.

// ---------------------------------------------------------------------
// 6. Custom checkbox state
// ---------------------------------------------------------------------

// A custom checkbox can use aria-checked, but the developer must also
// implement the interaction behavior that a native checkbox provides.

export const CustomCheckboxState: FC = (): ReactElement => {
  const [checked, setChecked] = useState(false);

  return (
    <div
      role="checkbox"
      aria-checked={checked}
      tabIndex={0}
      onClick={() => setChecked((current) => !current)}
      onKeyDown={(event) => {
        if (event.key === " ") {
          event.preventDefault();
          setChecked((current) => !current);
        }
      }}
    >
      Receive notifications
    </div>
  );
};

// This example intentionally demonstrates the additional responsibility
// created by a custom ARIA widget. A native checkbox is usually simpler
// and more robust.

// ---------------------------------------------------------------------
// 7. aria-checked="mixed"
// ---------------------------------------------------------------------

// The mixed state represents a partially selected checkbox state.
// It is applicable to checkbox-like roles that support a tri-state model.
//
// For example, a parent checkbox can be mixed when some, but not all,
// child options are selected.

export const MixedCheckboxState: FC = (): ReactElement => {
  return (
    <div role="checkbox" aria-checked="mixed" tabIndex={0}>
      Select all items
    </div>
  );
};

// "mixed" is not a universal value for every role that accepts
// aria-checked. Its availability depends on the applicable role.

// ---------------------------------------------------------------------
// 8. aria-pressed
// ---------------------------------------------------------------------

// aria-pressed communicates the current pressed state of a toggle button.
//
// It should not be confused with aria-expanded.
// A pressed state describes a toggle control; an expanded state describes
// the visibility or presence of controlled content.

export const PressedState: FC = (): ReactElement => {
  const [pressed, setPressed] = useState(false);

  return (
    <button type="button" aria-pressed={pressed} onClick={() => setPressed((current) => !current)}>
      {pressed ? "Muted" : "Mute"}
    </button>
  );
};

// The button remains the same control while its pressed state changes.

// ---------------------------------------------------------------------
// 9. aria-pressed is different from aria-expanded
// ---------------------------------------------------------------------

// aria-pressed:
//   "Is this toggle currently on or pressed?"
//
// aria-expanded:
//   "Is the content controlled by this element currently expanded?"

export const PressedVsExpanded: FC = (): ReactElement => {
  const [muted, setMuted] = useState(false);
  const [expanded, setExpanded] = useState(false);

  return (
    <div>
      <button type="button" aria-pressed={muted} onClick={() => setMuted((current) => !current)}>
        Mute
      </button>

      <button
        type="button"
        aria-expanded={expanded}
        aria-controls="more-info"
        onClick={() => setExpanded((current) => !current)}
      >
        More information
      </button>

      <div id="more-info" hidden={!expanded}>
        Additional information.
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------
// 10. aria-selected
// ---------------------------------------------------------------------

// aria-selected communicates the selected state of applicable widget items,
// including tabs, options, rows, and grid cells.
//
// It should be used according to the semantics of the widget role.

interface TabProps {
  readonly selected: boolean;
  readonly controls: string;
  readonly children: string;
  readonly onSelect: () => void;
}

const Tab: FC<TabProps> = ({ selected, controls, children, onSelect }): ReactElement => {
  return (
    <button type="button" role="tab" aria-selected={selected} aria-controls={controls} onClick={onSelect}>
      {children}
    </button>
  );
};

export const SelectedTab: FC = (): ReactElement => {
  const [selectedTab, setSelectedTab] = useState<"profile" | "security">("profile");

  return (
    <div>
      <div role="tablist" aria-label="Account sections">
        <Tab selected={selectedTab === "profile"} controls="profile-panel" onSelect={() => setSelectedTab("profile")}>
          Profile
        </Tab>

        <Tab
          selected={selectedTab === "security"}
          controls="security-panel"
          onSelect={() => setSelectedTab("security")}
        >
          Security
        </Tab>
      </div>

      <div id="profile-panel" role="tabpanel" hidden={selectedTab !== "profile"}>
        Profile settings.
      </div>

      <div id="security-panel" role="tabpanel" hidden={selectedTab !== "security"}>
        Security settings.
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------
// 11. aria-selected vs. aria-current
// ---------------------------------------------------------------------

// aria-selected describes selection within applicable widgets.
//
// aria-current identifies the current item within a related set, such as
// the current page in navigation or the current step in a process.
//
// They are not interchangeable.

export const SelectedVsCurrent: FC = (): ReactElement => {
  return (
    <div>
      <div role="tablist" aria-label="Product information">
        <button type="button" role="tab" aria-selected={true}>
          Details
        </button>
      </div>

      <nav aria-label="Primary">
        <a href="/products" aria-current="page">
          Products
        </a>
      </nav>
    </div>
  );
};

// A tab uses aria-selected to indicate which tab is selected.
// A navigation link uses aria-current to identify the current page.

// ---------------------------------------------------------------------
// 12. aria-current
// ---------------------------------------------------------------------

// aria-current identifies the item that represents the current item
// within a related set.
//
// Common values include:
// page
// step
// location
// date
// time
// true
// false

export const CurrentPageState: FC = (): ReactElement => {
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
          <a href="/contact">Contact</a>
        </li>
      </ul>
    </nav>
  );
};

// Only the current item in the relevant set should normally be marked
// with aria-current.

// ---------------------------------------------------------------------
// 13. aria-disabled
// ---------------------------------------------------------------------

// aria-disabled communicates that an element is perceivable but disabled.
//
// Unlike the native disabled attribute, aria-disabled does not automatically
// prevent interaction or remove the element from the normal interaction
// model.

export const AriaDisabledState: FC = (): ReactElement => {
  const disabled = true;

  return (
    <button
      type="button"
      aria-disabled={disabled}
      onClick={() => {
        if (disabled) {
          return;
        }

        console.log("Action performed.");
      }}
    >
      Continue
    </button>
  );
};

// Application logic must enforce the disabled behavior when aria-disabled
// is used on a custom or otherwise interactive element.

// ---------------------------------------------------------------------
// 14. Native disabled vs. aria-disabled
// ---------------------------------------------------------------------

// Prefer the native disabled attribute for native form controls when its
// built-in disabled behavior is appropriate.

export const NativeDisabledState: FC = (): ReactElement => {
  return (
    <button type="button" disabled>
      Continue
    </button>
  );
};

// aria-disabled communicates state.
// disabled provides native HTML behavior as well as the corresponding
// semantics for a native form control.

// ---------------------------------------------------------------------
// 15. aria-invalid
// ---------------------------------------------------------------------

// aria-invalid communicates that the value entered into a control does not
// conform to the expected format or constraints.
//
// It should represent an actual validation result rather than simply
// being added to every required field.

export const InvalidState: FC = (): ReactElement => {
  return (
    <div>
      <label htmlFor="email">Email address</label>

      <input id="email" name="email" type="email" aria-invalid={true} aria-describedby="email-error" />

      <p id="email-error">Enter a valid email address.</p>
    </div>
  );
};

// aria-invalid communicates the state.
// aria-describedby associates the corresponding explanation.

// ---------------------------------------------------------------------
// 16. aria-invalid with dynamic validation
// ---------------------------------------------------------------------

export const DynamicInvalidState: FC = (): ReactElement => {
  const [value, setValue] = useState("");
  const invalid = value.length > 0 && value.length < 3;

  return (
    <div>
      <label htmlFor="username">Username</label>

      <input
        id="username"
        name="username"
        type="text"
        value={value}
        aria-invalid={invalid}
        aria-describedby="username-hint"
        onChange={(event) => setValue(event.target.value)}
      />

      <p id="username-hint">Use at least 3 characters.</p>
    </div>
  );
};

// The validation state changes as the user enters a value.
// aria-invalid must change with the actual validation state.

// ---------------------------------------------------------------------
// 17. aria-required
// ---------------------------------------------------------------------

// aria-required communicates that a value is required for an applicable
// control.
//
// For native HTML form controls, the required attribute should generally
// be preferred because it also participates in native form validation.

export const NativeRequiredState: FC = (): ReactElement => {
  return (
    <div>
      <label htmlFor="display-name">Display name</label>

      <input id="display-name" name="display-name" type="text" required />
    </div>
  );
};

export const AriaRequiredState: FC = (): ReactElement => {
  return (
    <div>
      <label htmlFor="custom-display-name">Display name</label>

      <input id="custom-display-name" name="display-name" type="text" aria-required={true} />
    </div>
  );
};

// aria-required communicates the semantic requirement.
// It does not itself perform validation.

// ---------------------------------------------------------------------
// 18. aria-readonly
// ---------------------------------------------------------------------

// aria-readonly communicates that the value of an applicable widget
// is not editable.
//
// For native inputs, the readOnly attribute should generally be preferred
// because it provides native behavior.

export const NativeReadonlyState: FC = (): ReactElement => {
  return (
    <label>
      Account identifier
      <input type="text" value="example-account" readOnly />
    </label>
  );
};

// ---------------------------------------------------------------------
// 19. aria-busy
// ---------------------------------------------------------------------

// aria-busy communicates that an element is currently being modified or
// updated and that assistive technologies may need to wait before
// presenting the completed state.

export const BusyState: FC = (): ReactElement => {
  const loading = true;

  return (
    <section aria-busy={loading} aria-label="Search results">
      {loading ? "Loading results..." : "Results loaded."}
    </section>
  );
};

// aria-busy does not perform the loading operation.
// It communicates the current update state.

// ---------------------------------------------------------------------
// 20. aria-hidden
// ---------------------------------------------------------------------

// aria-hidden controls whether an element is exposed through the
// accessibility API.
//
// It does not visually hide the element.

export const HiddenFromAccessibilityTree: FC = (): ReactElement => {
  return (
    <div>
      <span aria-hidden="true">★</span>
      <span>Featured</span>
    </div>
  );
};

// The decorative star is hidden from the accessibility tree while
// the meaningful text remains available.

// ---------------------------------------------------------------------
// 21. aria-hidden must not hide needed interactive content
// ---------------------------------------------------------------------

// An element that is hidden from the accessibility tree must not contain
// focusable or otherwise necessary interactive content.
//
// Do not use aria-hidden as a general-purpose visibility mechanism.

export const VisibleInteractiveContent: FC = (): ReactElement => {
  return <button type="button">Save</button>;
};

// If the control must be unavailable, use an appropriate native or ARIA
// disabled mechanism rather than hiding it from assistive technologies.

// ---------------------------------------------------------------------
// 22. aria-modal
// ---------------------------------------------------------------------

// aria-modal communicates that an applicable dialog or alertdialog
// represents a modal interaction.
//
// It does not implement focus trapping, focus restoration, or dismissal.

export const ModalState: FC = (): ReactElement => {
  return (
    <div role="dialog" aria-modal={true} aria-labelledby="modal-title">
      <h2 id="modal-title">Confirm deletion</h2>

      <p>This action cannot be undone.</p>

      <button type="button">Cancel</button>

      <button type="button">Delete</button>
    </div>
  );
};

// The modal's keyboard and focus behavior must be implemented separately.

// ---------------------------------------------------------------------
// 23. aria-live is related to changing interface state
// ---------------------------------------------------------------------

// aria-live communicates that dynamic changes to a region may need to be
// announced to assistive technologies.
//
// It is commonly used for status messages and other asynchronous updates.

export const LiveState: FC = (): ReactElement => {
  const [message, setMessage] = useState("No changes yet.");

  return (
    <div>
      <button type="button" onClick={() => setMessage("Saved successfully.")}>
        Save
      </button>

      <p aria-live="polite">{message}</p>
    </div>
  );
};

// The state change updates the DOM.
// aria-live communicates that the changing region may need to be announced.

// ---------------------------------------------------------------------
// 24. aria-atomic
// ---------------------------------------------------------------------

// aria-atomic determines whether assistive technologies should present
// the entire live region or only the changed portion.

export const AtomicLiveState: FC = (): ReactElement => {
  const [count, setCount] = useState(0);

  return (
    <div>
      <button type="button" onClick={() => setCount((current) => current + 1)}>
        Add item
      </button>

      <p aria-live="polite" aria-atomic={true}>
        Cart contains {count} items.
      </p>
    </div>
  );
};

// With aria-atomic set to true, the complete message is treated as the
// unit to communicate when the live region changes.

// ---------------------------------------------------------------------
// 25. aria-relevant
// ---------------------------------------------------------------------

// aria-relevant communicates which types of changes within a live region
// are relevant for assistive technology notifications.

export const RelevantLiveState: FC = (): ReactElement => {
  return (
    <div aria-live="polite" aria-relevant="additions text">
      New notifications appear here.
    </div>
  );
};

// The value describes categories of DOM changes that are relevant.
// It does not determine what the application actually changes.

// ---------------------------------------------------------------------
// 26. aria-orientation
// ---------------------------------------------------------------------

// aria-orientation communicates the orientation of applicable widgets.
//
// It is a state/property that should only be used where the applicable
// role supports it.

export const OrientationState: FC = (): ReactElement => {
  return (
    <div role="tablist" aria-label="Settings sections" aria-orientation="vertical">
      <button type="button" role="tab" aria-selected={true}>
        General
      </button>

      <button type="button" role="tab" aria-selected={false}>
        Privacy
      </button>
    </div>
  );
};

// ---------------------------------------------------------------------
// 27. aria-multiselectable
// ---------------------------------------------------------------------

// aria-multiselectable communicates that multiple descendants can be
// selected within an applicable composite widget.

export const MultiSelectionState: FC = (): ReactElement => {
  return (
    <div role="listbox" aria-label="Available options" aria-multiselectable={true}>
      <div role="option" aria-selected={true}>
        Option A
      </div>

      <div role="option" aria-selected={false}>
        Option B
      </div>
    </div>
  );
};

// aria-selected communicates each option's selection state.
// aria-multiselectable communicates that multiple options can be selected.

// ---------------------------------------------------------------------
// 28. aria-valuenow
// ---------------------------------------------------------------------

// aria-valuenow communicates the current numeric value of an applicable
// range widget.

export const NumericValueState: FC = (): ReactElement => {
  const value = 65;

  return (
    <div role="progressbar" aria-label="Upload progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={value}>
      {value}%
    </div>
  );
};

// The value exposed through ARIA should correspond to the actual current
// state of the widget.

// ---------------------------------------------------------------------
// 29. aria-valuetext
// ---------------------------------------------------------------------

// aria-valuetext provides a human-readable value when the numeric value
// alone is not sufficient to communicate the meaning of a widget's state.

export const TextualValueState: FC = (): ReactElement => {
  const temperature = 20;

  return (
    <div
      role="slider"
      aria-label="Temperature"
      aria-valuemin={0}
      aria-valuemax={40}
      aria-valuenow={temperature}
      aria-valuetext={`${temperature} degrees Celsius`}
      tabIndex={0}
    >
      {temperature}°C
    </div>
  );
};

// aria-valuetext should accurately correspond to aria-valuenow and the
// actual state of the widget.

// ---------------------------------------------------------------------
// 30. aria-valuemin and aria-valuemax
// ---------------------------------------------------------------------

// aria-valuemin and aria-valuemax communicate the lower and upper bounds
// of an applicable range widget.

export const RangeState: FC = (): ReactElement => {
  return (
    <div role="slider" aria-label="Volume" aria-valuemin={0} aria-valuemax={100} aria-valuenow={50} tabIndex={0}>
      50%
    </div>
  );
};

// A custom slider also requires keyboard interaction, focus management,
// value changes, and other behavior. The ARIA states only communicate
// its current semantics.

// ---------------------------------------------------------------------
// 31. aria-errormessage
// ---------------------------------------------------------------------

// aria-errormessage identifies an element that provides an error message
// for an object when that object is in an invalid state.
//
// The control should also expose the invalid state when appropriate.

export const ErrorMessageState: FC = (): ReactElement => {
  return (
    <div>
      <label htmlFor="account-name">Account name</label>

      <input id="account-name" type="text" aria-invalid={true} aria-errormessage="account-name-error" />

      <p id="account-name-error">The account name is unavailable.</p>
    </div>
  );
};

// aria-errormessage specifically identifies error information.
// aria-describedby can be used for general descriptive or supporting text.

// ---------------------------------------------------------------------
// 32. aria-busy during asynchronous updates
// ---------------------------------------------------------------------

interface ResultsProps {
  readonly loading: boolean;
  readonly children: ReactElement;
}

export const AsyncResults: FC<ResultsProps> = ({ loading, children }): ReactElement => {
  return (
    <section aria-busy={loading} aria-label="Search results">
      {children}
    </section>
  );
};

// The loading state is supplied by the same application state that controls
// the asynchronous operation.

// ---------------------------------------------------------------------
// 33. State synchronization
// ---------------------------------------------------------------------

// A reliable pattern is:
//
// application state
//       ↓
// rendered UI
//       ↓
// ARIA state
//
// The same source of truth should determine all three whenever possible.

export const SingleSourceOfTruth: FC = (): ReactElement => {
  const [active, setActive] = useState(false);

  return (
    <button type="button" aria-pressed={active} onClick={() => setActive((current) => !current)}>
      {active ? "Active" : "Inactive"}
    </button>
  );
};

// Avoid maintaining one state value for the visual interface and another
// unrelated state value for aria-pressed.

// ---------------------------------------------------------------------
// 34. State transitions
// ---------------------------------------------------------------------

// ARIA states often change as the user interacts with a component.
//
// Before interaction:
// aria-expanded="false"
//
// After activation:
// aria-expanded="true"
//
// The application must update both the actual interface and the exposed
// state during the same transition.

export const StateTransition: FC = (): ReactElement => {
  const [expanded, setExpanded] = useState(false);

  const toggle = (): void => {
    setExpanded((current) => !current);
  };

  return (
    <div>
      <button type="button" aria-expanded={expanded} aria-controls="transition-panel" onClick={toggle}>
        Toggle panel
      </button>

      <div id="transition-panel" hidden={!expanded}>
        Panel content.
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------
// 35. State and visible styling
// ---------------------------------------------------------------------

// CSS can visually represent the same state that ARIA communicates.
//
// The important rule is that both should derive from the same source
// of truth rather than being maintained independently.

export const StateAndStyling: FC = (): ReactElement => {
  const [expanded, setExpanded] = useState(false);

  return (
    <button
      type="button"
      aria-expanded={expanded}
      className={expanded ? "is-expanded" : "is-collapsed"}
      onClick={() => setExpanded((current) => !current)}
    >
      Details
    </button>
  );
};

// aria-expanded communicates semantics.
// className controls presentation.
// React state synchronizes both.

// ---------------------------------------------------------------------
// 36. State values must be valid
// ---------------------------------------------------------------------

// ARIA states have defined value types and allowed values.
// Invalid or unsupported values can produce incorrect or incomplete
// accessibility semantics.

export const ValidStateValues: FC = (): ReactElement => {
  return (
    <button type="button" aria-pressed={true}>
      Favorite
    </button>
  );
};

// Avoid arbitrary values such as:
// aria-pressed="sometimes"
// aria-expanded="open"
// aria-selected="active"
//
// Use the value model defined for the specific ARIA state.

// ---------------------------------------------------------------------
// 37. States must be permitted for the role
// ---------------------------------------------------------------------

// Not every ARIA state is valid on every role.
//
// For example, aria-selected is meaningful for applicable selectable
// widget roles, while aria-checked is meaningful for roles that represent
// checked states.
//
// Always verify that the state is supported by the element's role.

export const RoleSpecificState: FC = (): ReactElement => {
  return (
    <div role="option" aria-selected={true}>
      Selected option
    </div>
  );
};

// Adding an unrelated state to an element does not make the semantics
// correct.

// ---------------------------------------------------------------------
// 38. Required states and properties
// ---------------------------------------------------------------------

// Some ARIA roles have required states or properties.
// When creating a custom widget, the implementation must provide the
// states and properties required by its role.

export const RequiredTabState: FC = (): ReactElement => {
  return (
    <button type="button" role="tab" aria-selected={true}>
      Profile
    </button>
  );
};

// A role should never be chosen independently of its required semantics.

// ---------------------------------------------------------------------
// 39. Native semantics remain preferable
// ---------------------------------------------------------------------

// If HTML already provides the required state and behavior, use HTML.
//
// Prefer:
// <input type="checkbox">
// <button disabled>
// <input readOnly>
// <input required>
//
// instead of recreating those behaviors with generic elements and ARIA.

export const NativeStateExamples: FC = (): ReactElement => {
  return (
    <form>
      <label>
        <input type="checkbox" defaultChecked />
        Subscribe
      </label>

      <input type="text" defaultValue="Read-only value" readOnly />

      <input type="text" required />

      <button type="submit" disabled>
        Submit
      </button>
    </form>
  );
};

// Native controls reduce the amount of custom accessibility behavior
// that the application must implement.

// ---------------------------------------------------------------------
// 40. ARIA state vs. DOM state
// ---------------------------------------------------------------------

// An ARIA state is not necessarily the same thing as a native DOM property.
//
// For example:
// disabled      -> native HTML behavior and state
// aria-disabled -> ARIA semantic state
//
// checked       -> native form-control state
// aria-checked  -> ARIA semantic state for applicable roles

export const DomAndAriaState: FC = (): ReactElement => {
  const [checked, setChecked] = useState(false);

  return (
    <label>
      <input type="checkbox" checked={checked} onChange={(event) => setChecked(event.target.checked)} />
      Receive notifications
    </label>
  );
};

// Here the native checked property already exposes the appropriate state,
// so aria-checked is unnecessary.

// ---------------------------------------------------------------------
// 41. State changes and live regions
// ---------------------------------------------------------------------

// Not every changing value should be announced through a live region.
// aria-live should be used when a dynamic update needs to be communicated
// to assistive technology without requiring focus to move.

export const StatusState: FC = (): ReactElement => {
  const [saved, setSaved] = useState(false);

  return (
    <div>
      <button type="button" onClick={() => setSaved(true)}>
        Save
      </button>

      <p aria-live="polite">{saved ? "Saved successfully." : ""}</p>
    </div>
  );
};

// A live region communicates the status update without moving focus
// away from the activating control.

// ---------------------------------------------------------------------
// 42. Do not use aria-hidden for visual hiding
// ---------------------------------------------------------------------

// aria-hidden changes accessibility exposure.
// It does not remove an element from visual rendering.
//
// Use CSS or HTML mechanisms intended for visual visibility when the
// objective is to hide something visually.

export const DecorativeContent: FC = (): ReactElement => {
  return (
    <div>
      <span aria-hidden="true">★</span>
      <span>Featured product</span>
    </div>
  );
};

// ---------------------------------------------------------------------
// 43. State-driven form example
// ---------------------------------------------------------------------

interface UsernameFieldProps {
  readonly value: string;
  readonly onChange: (value: string) => void;
}

export const UsernameField: FC<UsernameFieldProps> = ({ value, onChange }): ReactElement => {
  const invalid = value.length > 0 && value.length < 3;

  return (
    <div>
      <label htmlFor="username-field">Username</label>

      <input
        id="username-field"
        type="text"
        value={value}
        aria-invalid={invalid}
        aria-describedby="username-help"
        onChange={(event) => onChange(event.target.value)}
      />

      <p id="username-help">Use at least 3 characters.</p>
    </div>
  );
};

// The component derives aria-invalid directly from the validation state.
// There is no separate ARIA-only state to become inconsistent.

// ---------------------------------------------------------------------
// 44. State-driven disclosure example
// ---------------------------------------------------------------------

interface DisclosureProps {
  readonly title: string;
  readonly content: string;
}

export const DisclosureState: FC<DisclosureProps> = ({ title, content }): ReactElement => {
  const [expanded, setExpanded] = useState(false);
  const contentId = "disclosure-state-content";

  return (
    <section>
      <button
        type="button"
        aria-expanded={expanded}
        aria-controls={contentId}
        onClick={() => setExpanded((current) => !current)}
      >
        {expanded ? `Hide ${title}` : `Show ${title}`}
      </button>

      <div id={contentId} hidden={!expanded}>
        {content}
      </div>
    </section>
  );
};

// ---------------------------------------------------------------------
// 45. State-driven toggle example
// ---------------------------------------------------------------------

export const ToggleState: FC = (): ReactElement => {
  const [enabled, setEnabled] = useState(false);

  return (
    <button type="button" aria-pressed={enabled} onClick={() => setEnabled((current) => !current)}>
      {enabled ? "Enabled" : "Disabled"}
    </button>
  );
};

// The label and aria-pressed state both reflect the same boolean value.

// ---------------------------------------------------------------------
// 46. State-driven navigation example
// ---------------------------------------------------------------------

interface NavigationItem {
  readonly label: string;
  readonly href: string;
  readonly current: boolean;
}

const navigationItems: NavigationItem[] = [
  {
    label: "Home",
    href: "/",
    current: true,
  },
  {
    label: "Products",
    href: "/products",
    current: false,
  },
  {
    label: "Contact",
    href: "/contact",
    current: false,
  },
];

export const NavigationState: FC = (): ReactElement => {
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

// aria-current is present only for the current item.
// The visual current-page treatment should use the same underlying state.

// ---------------------------------------------------------------------
// 47. State and custom widgets
// ---------------------------------------------------------------------

// Custom widgets often combine several states and relationships.
//
// A tab may need:
// role="tab"
// aria-selected
// aria-controls
//
// A disclosure may need:
// aria-expanded
// aria-controls
//
// A custom checkbox may need:
// role="checkbox"
// aria-checked
//
// The complete widget also needs appropriate interaction and keyboard
// behavior.

export const CombinedWidgetState: FC = (): ReactElement => {
  return (
    <div>
      <button type="button" role="tab" aria-selected={true} aria-controls="combined-panel">
        Details
      </button>

      <div id="combined-panel" role="tabpanel">
        Product details.
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------
// 48. State synchronization checklist
// ---------------------------------------------------------------------

// When implementing an ARIA state:
//
// - Identify the actual application state.
// - Determine whether native HTML already exposes that state.
// - Use the ARIA state only when its semantics are appropriate.
// - Keep the ARIA value synchronized with the actual UI.
// - Use a single source of truth where possible.
// - Verify that the state is permitted for the role.
// - Provide required states and properties for custom roles.
// - Implement interaction behavior separately when ARIA does not provide it.
// - Keep keyboard behavior and focus behavior consistent with the widget.
// - Test both the visible interface and the accessibility tree.

// ---------------------------------------------------------------------
// 49. Final integrated example
// ---------------------------------------------------------------------

export const AriaStatesExample: FC = (): ReactElement => {
  const [expanded, setExpanded] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [invalid, setInvalid] = useState(false);

  return (
    <main>
      <section aria-labelledby="preferences-heading">
        <h1 id="preferences-heading">Preferences</h1>

        <button
          type="button"
          aria-expanded={expanded}
          aria-controls="advanced-settings"
          onClick={() => setExpanded((current) => !current)}
        >
          {expanded ? "Hide advanced settings" : "Show advanced settings"}
        </button>

        <div id="advanced-settings" hidden={!expanded}>
          <button type="button" aria-pressed={pressed} onClick={() => setPressed((current) => !current)}>
            {pressed ? "Notifications enabled" : "Notifications disabled"}
          </button>

          <div>
            <label htmlFor="account-name">Account name</label>

            <input id="account-name" type="text" aria-invalid={invalid} aria-describedby="account-name-help" />

            <p id="account-name-help">Use the account name associated with your profile.</p>

            <button type="button" onClick={() => setInvalid(true)}>
              Validate account name
            </button>
          </div>
        </div>
      </section>
    </main>
  );
};

// The integrated example demonstrates the central rule for ARIA states:
// the state exposed to assistive technologies must describe the actual
// current state of the interface.

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - ARIA states communicate dynamic conditions through the accessibility tree.
// - Common states include aria-checked, aria-disabled, aria-expanded, aria-invalid,
//   aria-pressed, aria-selected, aria-current, aria-hidden, and aria-busy.
// - aria-expanded describes whether controlled content is expanded or collapsed.
// - aria-checked describes the checked state of applicable widgets.
// - aria-pressed describes the pressed state of a toggle button.
// - aria-selected describes selection within applicable widgets such as tabs and options.
// - aria-current identifies the current item within a related set.
// - aria-disabled communicates disabled semantics but does not automatically prevent interaction.
// - aria-invalid communicates that a value does not conform to expected validation rules.
// - aria-hidden controls exposure to the accessibility tree and does not visually hide content.
// - aria-live and related attributes communicate dynamic updates that may need announcement.
// - ARIA states do not create keyboard behavior, focus management, validation, or interaction logic.
// - States must use valid values and must be permitted for the element's role.
// - Custom roles may require specific states and properties.
// - Native HTML should be preferred when it already provides the required semantics and behavior.
// - The actual application state, visible UI, and ARIA state should remain synchronized.
