/**
 * ARIA Properties
 * ===============
 *
 * WAI-ARIA properties add semantic information to the accessibility tree when native HTML
 * semantics are insufficient. They describe relationships, labels, values, and other
 * characteristics of an element, but they do not create the interaction behavior themselves.
 *
 * Native HTML should be preferred when it already provides the required semantics and behavior.
 * When ARIA is appropriate, its properties must accurately reflect the current state and
 * relationships of the user interface.
 */

// ---------------------------------------------------------------------
// Imports
// ---------------------------------------------------------------------

import { useState, type FC, type ReactElement } from "react";

// ---------------------------------------------------------------------
// 1. ARIA properties describe semantics
// ---------------------------------------------------------------------

// ARIA properties communicate information to assistive technologies.
// They do not replace the JavaScript behavior required by custom widgets.
//
// For example, aria-expanded can communicate whether a controlled region
// is expanded, but it does not open or close that region by itself.

interface PropertyConcepts {
  readonly name: string;
  readonly purpose: string;
}

const propertyConcepts: PropertyConcepts[] = [
  {
    name: "aria-label",
    purpose: "Provides an accessible name when an appropriate visible label is unavailable.",
  },
  {
    name: "aria-labelledby",
    purpose: "Uses the text of one or more elements as the accessible name.",
  },
  {
    name: "aria-describedby",
    purpose: "Associates additional descriptive text with an element.",
  },
  {
    name: "aria-controls",
    purpose: "Identifies content or elements controlled by another element.",
  },
  {
    name: "aria-current",
    purpose: "Identifies the current item within a related set.",
  },
  {
    name: "aria-haspopup",
    purpose: "Communicates that an element invokes a popup interface.",
  },
];

// ---------------------------------------------------------------------
// 2. aria-label
// ---------------------------------------------------------------------

// aria-label provides a string that can be used as the accessible name.
//
// It is particularly useful when an interactive control has no visible
// text label, such as an icon-only button.

export const LabelledIconButton: FC = (): ReactElement => {
  return (
    <button type="button" aria-label="Close dialog">
      ×
    </button>
  );
};

// Prefer visible text when it already provides the accessible name.

export const VisibleTextButton: FC = (): ReactElement => {
  return <button type="button">Save</button>;
};

// aria-label should not unnecessarily replace useful visible text.
// If visible text already names a control, simply use the visible text
// unless there is a specific accessibility reason to provide another name.

// ---------------------------------------------------------------------
// 3. aria-labelledby
// ---------------------------------------------------------------------

// aria-labelledby references one or more elements by their id.
// The referenced text is used to provide the accessible name.

export const LabelledSection: FC = (): ReactElement => {
  return (
    <section aria-labelledby="account-heading">
      <h2 id="account-heading">Account settings</h2>
      <p>Manage the settings for this account.</p>
    </section>
  );
};

// Multiple IDs can be referenced when the accessible name is composed
// from more than one visible text node.

export const CompositeLabel: FC = (): ReactElement => {
  return (
    <div>
      <span id="product-name">Example product</span>
      <span id="product-type">Standard plan</span>

      <button type="button" aria-labelledby="product-name product-type">
        Select
      </button>
    </div>
  );
};

// When visible text already provides the appropriate accessible name,
// native labeling or the element's content is generally preferable to
// adding an unnecessary aria-labelledby relationship.

// ---------------------------------------------------------------------
// 4. aria-label vs. aria-labelledby
// ---------------------------------------------------------------------

// aria-label supplies the name directly.
// aria-labelledby obtains the name from referenced DOM elements.
//
// Prefer aria-labelledby when a suitable visible label already exists.
// Use aria-label when an appropriate visible label does not exist.

export const NamingComparison: FC = (): ReactElement => {
  return (
    <div>
      <button type="button" aria-label="Open settings">
        ⚙
      </button>

      <button type="button" aria-labelledby="settings-label">
        ⚙
      </button>

      <span id="settings-label">Settings</span>
    </div>
  );
};

// ---------------------------------------------------------------------
// 5. aria-describedby
// ---------------------------------------------------------------------

// aria-describedby associates an element with additional descriptive text.
// The referenced content supplements the accessible name rather than
// replacing it.

export const DescribedInput: FC = (): ReactElement => {
  return (
    <div>
      <label htmlFor="username">Username</label>
      <input id="username" name="username" type="text" aria-describedby="username-help" />
      <p id="username-help">Use between 3 and 30 characters.</p>
    </div>
  );
};

// Multiple descriptive elements can be referenced.

export const MultipleDescriptions: FC = (): ReactElement => {
  return (
    <div>
      <label htmlFor="email">Email address</label>
      <input id="email" name="email" type="email" aria-describedby="email-help email-example" />
      <p id="email-help">We will use this address for account notifications.</p>
      <p id="email-example">Example: user@example.com</p>
    </div>
  );
};

// ---------------------------------------------------------------------
// 6. aria-description
// ---------------------------------------------------------------------

// aria-description provides a description directly as a string rather than
// referencing another DOM element.
//
// When descriptive text is already visible in the document, an explicit
// aria-describedby relationship is often more appropriate because the
// same visible content can be associated with the element.

export const DirectDescription: FC = (): ReactElement => {
  return (
    <button
      type="button"
      aria-label="Delete account"
      aria-description="Permanently removes the account and its associated data."
    >
      Delete
    </button>
  );
};

// ---------------------------------------------------------------------
// 7. aria-details
// ---------------------------------------------------------------------

// aria-details identifies an element that contains additional detailed
// information about the current element.
//
// It is useful when the relationship is more complex than a short
// accessible description.

export const DetailedInformation: FC = (): ReactElement => {
  return (
    <div>
      <p>
        <span id="result-summary">Quarterly results</span>
      </p>

      <div id="result-details">
        <h3>Detailed results</h3>
        <p>Revenue increased during the quarter.</p>
        <ul>
          <li>Product sales increased.</li>
          <li>Service revenue remained stable.</li>
        </ul>
      </div>

      <div aria-labelledby="result-summary" aria-details="result-details">
        Results available
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------
// 8. aria-controls
// ---------------------------------------------------------------------

// aria-controls identifies the element or elements whose content or
// presence is controlled by the current element.
//
// The relationship does not perform the control operation itself.

export const ControlledRegion: FC = (): ReactElement => {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button
        type="button"
        aria-controls="details-panel"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
      >
        {open ? "Hide details" : "Show details"}
      </button>

      <div id="details-panel" hidden={!open}>
        Additional details are available here.
      </div>
    </div>
  );
};

// aria-controls identifies the relationship.
// aria-expanded communicates the current expanded/collapsed state.
// React state and the event handler provide the actual behavior.

// ---------------------------------------------------------------------
// 9. aria-expanded
// ---------------------------------------------------------------------

// aria-expanded communicates whether a controlled expandable element is
// currently expanded.
//
// The attribute belongs on the control that exposes the expandable content.

export const ExpandableSection: FC = (): ReactElement => {
  const [expanded, setExpanded] = useState(false);

  return (
    <section>
      <button
        type="button"
        aria-expanded={expanded}
        aria-controls="expandable-content"
        onClick={() => setExpanded((current) => !current)}
      >
        More information
      </button>

      <div id="expandable-content" hidden={!expanded}>
        Additional information is shown when the section is expanded.
      </div>
    </section>
  );
};

// React converts the boolean value into the corresponding ARIA state.
// The DOM should always reflect the actual UI state.

// ---------------------------------------------------------------------
// 10. aria-current
// ---------------------------------------------------------------------

// aria-current identifies the item that represents the current item within
// a related set, such as the current page in navigation.

export const CurrentNavigation: FC = (): ReactElement => {
  return (
    <nav aria-label="Primary">
      <ul>
        <li>
          <a href="/home" aria-current="page">
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

// aria-current has several semantic values, including:
// page  - current page
// step  - current step in a process
// location - current location within a context
// date  - current date
// time  - current time
// true  - current item when a more specific value is not appropriate

// ---------------------------------------------------------------------
// 11. aria-haspopup
// ---------------------------------------------------------------------

// aria-haspopup communicates that an element invokes a popup.
// The value can describe the type of popup, such as menu, listbox,
// tree, grid, or dialog.

export const MenuButton: FC = (): ReactElement => {
  return (
    <button type="button" aria-haspopup="menu" aria-expanded={false}>
      Actions
    </button>
  );
};

// aria-haspopup does not create the popup or its keyboard behavior.
// The implementation must still provide the appropriate interaction.

// ---------------------------------------------------------------------
// 12. aria-pressed
// ---------------------------------------------------------------------

// aria-pressed represents the pressed state of a toggle button.
// It is different from aria-expanded: a pressed button represents a
// persistent toggle state, while aria-expanded describes expandable content.

export const ToggleButton: FC = (): ReactElement => {
  const [pressed, setPressed] = useState(false);

  return (
    <button type="button" aria-pressed={pressed} onClick={() => setPressed((current) => !current)}>
      {pressed ? "Muted" : "Mute"}
    </button>
  );
};

// ---------------------------------------------------------------------
// 13. aria-selected
// ---------------------------------------------------------------------

// aria-selected identifies the current selection in widgets such as
// tabs, listboxes, grids, and trees.
//
// It should be used where the relevant ARIA pattern defines selection
// semantics, rather than as a generic replacement for application state.

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

// ---------------------------------------------------------------------
// 14. aria-checked
// ---------------------------------------------------------------------

// aria-checked communicates the checked state of ARIA widgets such as
// checkbox, radio, and related composite controls.
//
// Native input elements should generally be preferred when their built-in
// semantics and behavior are sufficient.

export const NativeCheckbox: FC = (): ReactElement => {
  return (
    <label>
      <input type="checkbox" />
      Receive notifications
    </label>
  );
};

export const CustomCheckboxSemantics: FC = (): ReactElement => {
  const [checked, setChecked] = useState(false);

  return (
    <div
      role="checkbox"
      aria-checked={checked}
      tabIndex={0}
      onClick={() => setChecked((current) => !current)}
      onKeyDown={(event) => {
        if (event.key === " " || event.key === "Enter") {
          event.preventDefault();
          setChecked((current) => !current);
        }
      }}
    >
      Receive notifications
    </div>
  );
};

// The custom example requires considerably more implementation than the
// native checkbox because ARIA does not supply native keyboard behavior.
// A native control is preferable when it can express the requirement.

// ---------------------------------------------------------------------
// 15. aria-disabled
// ---------------------------------------------------------------------

// aria-disabled communicates that an element is perceivable but disabled.
//
// Unlike the native disabled attribute, aria-disabled does not automatically
// prevent interaction. Application code must enforce the disabled behavior.

export const AriaDisabledButton: FC = (): ReactElement => {
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

// Prefer the native disabled attribute for native form controls when the
// native disabled behavior is what the interface requires.

export const NativeDisabledButton: FC = (): ReactElement => {
  return (
    <button type="button" disabled>
      Continue
    </button>
  );
};

// ---------------------------------------------------------------------
// 16. aria-invalid
// ---------------------------------------------------------------------

// aria-invalid communicates that the value entered into a form control
// does not conform to the expected format or constraints.

export const InvalidInput: FC = (): ReactElement => {
  return (
    <div>
      <label htmlFor="account-email">Email address</label>
      <input
        id="account-email"
        name="account-email"
        type="email"
        aria-invalid={true}
        aria-describedby="account-email-error"
      />
      <p id="account-email-error">Enter a valid email address.</p>
    </div>
  );
};

// The application should set aria-invalid according to actual validation
// results rather than using it simply because a field is required.

// ---------------------------------------------------------------------
// 17. aria-required
// ---------------------------------------------------------------------

// aria-required communicates that a value is required for an ARIA-aware
// control.
//
// Native required controls should generally use the HTML required attribute.

export const NativeRequiredField: FC = (): ReactElement => {
  return (
    <div>
      <label htmlFor="display-name">Display name</label>
      <input id="display-name" name="display-name" type="text" required />
    </div>
  );
};

export const AriaRequiredField: FC = (): ReactElement => {
  return (
    <div>
      <label htmlFor="custom-name">Display name</label>
      <input id="custom-name" name="custom-name" type="text" aria-required={true} />
    </div>
  );
};

// aria-required communicates semantics.
// It does not perform form validation.

// ---------------------------------------------------------------------
// 18. aria-readonly
// ---------------------------------------------------------------------

// aria-readonly communicates that an element's value is not editable.
//
// For native form controls, readOnly should generally be used when the
// native read-only behavior is appropriate.

export const NativeReadonlyField: FC = (): ReactElement => {
  return <input type="text" value="Read-only value" readOnly aria-label="Account identifier" />;
};

// ---------------------------------------------------------------------
// 19. aria-autocomplete
// ---------------------------------------------------------------------

// aria-autocomplete communicates the kind of autocomplete behavior
// provided by an editable widget.
//
// The value describes the interaction model; it does not implement the
// suggestions themselves.

export const AutocompleteInput: FC = (): ReactElement => {
  const suggestions = ["Apple", "Apricot", "Avocado"];

  return (
    <div>
      <label htmlFor="fruit-search">Fruit</label>
      <input
        id="fruit-search"
        type="text"
        role="combobox"
        aria-autocomplete="list"
        aria-controls="fruit-suggestions"
        aria-expanded={true}
      />

      <ul id="fruit-suggestions" role="listbox">
        {suggestions.map((suggestion) => (
          <li key={suggestion} role="option">
            {suggestion}
          </li>
        ))}
      </ul>
    </div>
  );
};

// A complete combobox requires substantially more behavior and state
// management than these ARIA attributes alone.

// ---------------------------------------------------------------------
// 20. aria-multiselectable
// ---------------------------------------------------------------------

// aria-multiselectable communicates that multiple items can be selected
// within an applicable composite widget.

export const MultiSelectableListbox: FC = (): ReactElement => {
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

// aria-multiselectable belongs to the widget that supports multiple
// selection. Individual options communicate their own selection state.

// ---------------------------------------------------------------------
// 21. aria-orientation
// ---------------------------------------------------------------------

// aria-orientation communicates whether an applicable widget is horizontal
// or vertical.
//
// Only use it where the relevant role supports the property.

export const VerticalTabList: FC = (): ReactElement => {
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
// 22. aria-valuemin, aria-valuemax, and aria-valuenow
// ---------------------------------------------------------------------

// Range widgets can communicate their numeric value and limits with
// aria-valuemin, aria-valuemax, and aria-valuenow.

export const ProgressExample: FC = (): ReactElement => {
  const value = 65;

  return (
    <div role="progressbar" aria-label="Upload progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={value}>
      {value}%
    </div>
  );
};

// The visible representation and ARIA value should remain synchronized.
// aria-valuenow should represent the current value of the widget.

// ---------------------------------------------------------------------
// 23. aria-valuetext
// ---------------------------------------------------------------------

// aria-valuetext provides a human-readable representation of a widget's
// current value when the numeric value alone does not adequately convey it.

export const TemperatureSlider: FC = (): ReactElement => {
  const value = 20;

  return (
    <div
      role="slider"
      aria-label="Temperature"
      aria-valuemin={0}
      aria-valuemax={40}
      aria-valuenow={value}
      aria-valuetext={`${value} degrees Celsius`}
      tabIndex={0}
    >
      {value}°C
    </div>
  );
};

// aria-valuetext should complement, not contradict, aria-valuenow.

// ---------------------------------------------------------------------
// 24. aria-level
// ---------------------------------------------------------------------

// aria-level communicates hierarchical level for roles that support
// hierarchical structures, such as tree items and headings represented
// through ARIA.
//
// Native heading elements are generally preferable when the content is
// actually a heading.

export const HeadingExample: FC = (): ReactElement => {
  return <h2>Account settings</h2>;
};

export const AriaHeadingExample: FC = (): ReactElement => {
  return (
    <div role="heading" aria-level={2}>
      Account settings
    </div>
  );
};

// ---------------------------------------------------------------------
// 25. aria-modal
// ---------------------------------------------------------------------

// aria-modal communicates that an element with an appropriate dialog role
// is modal.
//
// A modal dialog still requires correct focus management, keyboard behavior,
// labeling, and dismissal behavior.

export const ModalExample: FC = (): ReactElement => {
  return (
    <div role="dialog" aria-modal={true} aria-labelledby="dialog-title">
      <h2 id="dialog-title">Confirm action</h2>
      <p>This action cannot be undone.</p>
      <button type="button">Cancel</button>
      <button type="button">Confirm</button>
    </div>
  );
};

// aria-modal does not create a focus trap or prevent interaction with the
// rest of the document. Those behaviors must be implemented correctly.

// ---------------------------------------------------------------------
// 26. aria-live
// ---------------------------------------------------------------------

// aria-live communicates that an element may receive dynamic updates and
// that assistive technologies should be informed according to the chosen
// politeness level.

export const LiveStatus: FC = (): ReactElement => {
  return <p aria-live="polite">Saved successfully.</p>;
};

// Common values include:
// off     - do not announce updates by default
// polite  - announce when the user is idle enough for the update
// assertive - interrupt current speech when necessary

// ---------------------------------------------------------------------
// 27. aria-atomic
// ---------------------------------------------------------------------

// aria-atomic controls whether assistive technologies should present the
// entire changed region or only the changed portion.

export const AtomicStatus: FC = (): ReactElement => {
  return (
    <p aria-live="polite" aria-atomic={true}>
      Cart: 3 items
    </p>
  );
};

// aria-atomic is especially useful when the complete meaning depends on
// surrounding text rather than the changed fragment alone.

// ---------------------------------------------------------------------
// 28. aria-relevant
// ---------------------------------------------------------------------

// aria-relevant communicates which kinds of changes within a live region
// are relevant for assistive technology notifications.

export const RelevantUpdates: FC = (): ReactElement => {
  return (
    <div aria-live="polite" aria-relevant="additions text">
      New notifications will appear here.
    </div>
  );
};

// The value can describe changes such as additions, removals, text changes,
// or combinations of those categories.

// ---------------------------------------------------------------------
// 29. aria-busy
// ---------------------------------------------------------------------

// aria-busy communicates that an element is currently being modified or
// updated and that assistive technologies may need to wait before
// presenting the final state.

export const LoadingRegion: FC = (): ReactElement => {
  const loading = true;

  return (
    <section aria-busy={loading} aria-label="Search results">
      {loading ? "Loading results..." : "Results loaded."}
    </section>
  );
};

// aria-busy describes the update state; it does not perform loading logic.

// ---------------------------------------------------------------------
// 30. aria-controls and relationships
// ---------------------------------------------------------------------

// ARIA relationship properties connect elements through IDs.
// The relationship should represent an actual relationship in the UI.

interface DisclosureProps {
  readonly contentId: string;
  readonly expanded: boolean;
  readonly onToggle: () => void;
}

export const Disclosure: FC<DisclosureProps> = ({ contentId, expanded, onToggle }): ReactElement => {
  return (
    <button type="button" aria-expanded={expanded} aria-controls={contentId} onClick={onToggle}>
      {expanded ? "Hide" : "Show"} details
    </button>
  );
};

// IDs used by relationship properties must resolve to the intended
// elements in the rendered document.

// ---------------------------------------------------------------------
// 31. aria-labelledby and aria-describedby together
// ---------------------------------------------------------------------

// A component can have both an accessible name and an accessible description.
// The name identifies the object; the description provides additional context.

export const NamedAndDescribedDialog: FC = (): ReactElement => {
  return (
    <div role="dialog" aria-labelledby="confirmation-title" aria-describedby="confirmation-description">
      <h2 id="confirmation-title">Delete item?</h2>
      <p id="confirmation-description">This will permanently remove the selected item.</p>
      <button type="button">Cancel</button>
      <button type="button">Delete</button>
    </div>
  );
};

// ---------------------------------------------------------------------
// 32. ARIA properties must reflect the UI
// ---------------------------------------------------------------------

// ARIA must not describe a state that differs from the actual interface.
//
// Incorrect:
// <button aria-expanded={false}>...</button>
// while the controlled panel is visibly open.
//
// Correct:
// Keep React state as the source of truth and derive both the visual state
// and the ARIA state from that same value.

export const SynchronizedState: FC = (): ReactElement => {
  const [expanded, setExpanded] = useState(false);

  return (
    <section>
      <button
        type="button"
        aria-expanded={expanded}
        aria-controls="synchronized-panel"
        onClick={() => setExpanded((current) => !current)}
      >
        Details
      </button>

      <div id="synchronized-panel" hidden={!expanded}>
        The ARIA state and visible state are derived from the same React state value.
      </div>
    </section>
  );
};

// ---------------------------------------------------------------------
// 33. ARIA properties do not create behavior
// ---------------------------------------------------------------------

// Adding ARIA to a non-native element does not turn that element into a
// fully functional widget.
//
// role, aria-expanded, aria-selected, aria-checked, and similar attributes
// communicate semantics. JavaScript must still implement the required
// interaction, focus management, and state changes.

export const SemanticOnlyButton: FC = (): ReactElement => {
  return (
    <div role="button" aria-pressed={false}>
      Toggle
    </div>
  );
};

// This example demonstrates the semantic limitation intentionally.
// A native <button> is normally the appropriate implementation.

// ---------------------------------------------------------------------
// 34. Prefer native HTML where possible
// ---------------------------------------------------------------------

// Native HTML elements already provide semantics, keyboard behavior, focus
// behavior, and browser integration.
//
// Prefer:
// <button>    instead of <div role="button">
// <input>     instead of a custom textbox where possible
// <input type="checkbox"> instead of <div role="checkbox">
// <details>   where its disclosure behavior fits the requirement

export const NativeFirstExample: FC = (): ReactElement => {
  return (
    <div>
      <button type="button">Save</button>

      <label>
        <input type="checkbox" />
        Subscribe
      </label>
    </div>
  );
};

// ---------------------------------------------------------------------
// 35. ARIA properties in React
// ---------------------------------------------------------------------

// React uses the normal DOM-style spelling for ARIA attributes:
// aria-label
// aria-labelledby
// aria-describedby
// aria-controls
// aria-expanded
// aria-current
// aria-live
//
// ARIA names retain their lowercase, hyphenated form.

export const ReactAriaSyntax: FC = (): ReactElement => {
  return (
    <button type="button" aria-label="Open menu" aria-expanded={false} aria-controls="main-menu">
      Menu
    </button>
  );
};

// ---------------------------------------------------------------------
// 36. Boolean ARIA values in React
// ---------------------------------------------------------------------

// React accepts boolean values for ARIA properties whose DOM representation
// is an ARIA true/false value.
//
// Use the actual boolean state rather than manually constructing strings.

export const BooleanAriaState: FC = (): ReactElement => {
  const expanded = false;
  const disabled = true;

  return (
    <button type="button" aria-expanded={expanded} aria-disabled={disabled}>
      Action
    </button>
  );
};

// ---------------------------------------------------------------------
// 37. String-valued ARIA properties in React
// ---------------------------------------------------------------------

// Some ARIA properties use meaningful string tokens rather than booleans.

export const StringAriaValues: FC = (): ReactElement => {
  return (
    <nav aria-label="Primary navigation">
      <a href="/products" aria-current="page">
        Products
      </a>
    </nav>
  );
};

// ---------------------------------------------------------------------
// 38. Avoid redundant ARIA
// ---------------------------------------------------------------------

// Do not add ARIA merely because an attribute exists.
// Redundant ARIA can make markup harder to understand and maintain.

export const AvoidRedundantAria: FC = (): ReactElement => {
  return <button type="button">Save</button>;
};

// The native button already exposes button semantics.
// Adding role="button" would not improve it.

// ---------------------------------------------------------------------
// 39. Avoid conflicting ARIA
// ---------------------------------------------------------------------

// Conflicting ARIA can create an accessibility tree that does not match
// the visible interface.

export const ConflictingSemantics: FC = (): ReactElement => {
  return (
    <button type="button" aria-expanded={true}>
      Save
    </button>
  );
};

// aria-expanded implies an expandable control, but this button does not
// expose controlled expandable content. The attribute should not be used
// unless that relationship and state actually exist.

// ---------------------------------------------------------------------
// 40. Properties and accessibility relationships
// ---------------------------------------------------------------------

// Common relationship properties include:
// aria-labelledby  - identifies the element(s) providing the accessible name
// aria-describedby - identifies the element(s) providing additional description
// aria-controls    - identifies controlled content
// aria-details     - identifies detailed supporting information
// aria-owns        - expresses ownership when the accessibility relationship
//                    differs from the DOM hierarchy
//
// These relationships should describe real relationships in the interface.

// ---------------------------------------------------------------------
// 41. A complete disclosure example
// ---------------------------------------------------------------------

interface DisclosureExampleProps {
  readonly title: string;
  readonly content: string;
}

export const DisclosureExample: FC<DisclosureExampleProps> = ({ title, content }): ReactElement => {
  const [expanded, setExpanded] = useState(false);
  const contentId = "disclosure-content";

  return (
    <section>
      <h2>{title}</h2>

      <button
        type="button"
        aria-expanded={expanded}
        aria-controls={contentId}
        onClick={() => setExpanded((current) => !current)}
      >
        {expanded ? "Hide details" : "Show details"}
      </button>

      <div id={contentId} hidden={!expanded}>
        {content}
      </div>
    </section>
  );
};

// This example demonstrates the important relationship between:
// 1. the control,
// 2. aria-expanded,
// 3. aria-controls,
// 4. the controlled element,
// 5. the actual React state,
// 6. the visible result.

// ---------------------------------------------------------------------
// 42. A complete labelled form example
// ---------------------------------------------------------------------

interface FormFieldProps {
  readonly value: string;
  readonly invalid: boolean;
  readonly errorMessage?: string;
  readonly onChange: (value: string) => void;
}

export const AccessibleFormField: FC<FormFieldProps> = ({ value, invalid, errorMessage, onChange }): ReactElement => {
  const errorId = "username-error";
  const descriptionId = "username-description";

  return (
    <div>
      <label htmlFor="username-field">Username</label>

      <input
        id="username-field"
        name="username"
        type="text"
        value={value}
        aria-invalid={invalid}
        aria-describedby={invalid ? errorId : descriptionId}
        onChange={(event) => onChange(event.target.value)}
      />

      {invalid ? (
        <p id={errorId}>{errorMessage ?? "Enter a valid username."}</p>
      ) : (
        <p id={descriptionId}>Choose a name between 3 and 30 characters.</p>
      )}
    </div>
  );
};

// The accessible name comes from the <label>.
// aria-describedby associates supporting or error text.
// aria-invalid communicates the validation state.

// ---------------------------------------------------------------------
// 43. Properties should represent the current state
// ---------------------------------------------------------------------

// The accessibility tree should stay synchronized with the rendered UI.
//
// When a property represents changing state, derive it from the same state
// that controls the visual interface rather than maintaining unrelated
// duplicate values.

export const StateDrivenProperties: FC = (): ReactElement => {
  const [selected, setSelected] = useState(false);

  return (
    <button type="button" aria-pressed={selected} onClick={() => setSelected((current) => !current)}>
      {selected ? "Selected" : "Select"}
    </button>
  );
};

// ---------------------------------------------------------------------
// 44. Properties are not a replacement for accessible names
// ---------------------------------------------------------------------

// A control can have useful state properties while still requiring an
// accessible name.

export const NamedToggle: FC = (): ReactElement => {
  const [pressed, setPressed] = useState(false);

  return (
    <button
      type="button"
      aria-label="Notifications"
      aria-pressed={pressed}
      onClick={() => setPressed((current) => !current)}
    >
      {pressed ? "On" : "Off"}
    </button>
  );
};

// aria-pressed communicates state.
// aria-label provides the control's name.
// The button's actual interaction is provided by the native button.

// ---------------------------------------------------------------------
// 45. Properties and custom widgets
// ---------------------------------------------------------------------

// Custom widgets often need several coordinated ARIA properties.
// For example, a tab implementation can require:
//
// tablist
//   aria-label or aria-labelledby
//
// tab
//   aria-selected
//   aria-controls
//
// tabpanel
//   aria-labelledby
//
// These properties describe relationships and state, while JavaScript
// implements selection and keyboard interaction.

export const TabExample: FC = (): ReactElement => {
  return (
    <div>
      <div role="tablist" aria-label="Account sections">
        <Tab selected={true} controls="profile-panel" onSelect={() => undefined}>
          Profile
        </Tab>
        <Tab selected={false} controls="security-panel" onSelect={() => undefined}>
          Security
        </Tab>
      </div>

      <div id="profile-panel" role="tabpanel" aria-labelledby="profile-tab">
        Profile content
      </div>
    </div>
  );
};

// A production tab component would need matching IDs and complete keyboard
// interaction according to the tab pattern. The example demonstrates the
// semantic relationships rather than implementing the entire pattern.

// ---------------------------------------------------------------------
// 46. Do not use ARIA properties as styling hooks
// ---------------------------------------------------------------------

// ARIA communicates accessibility semantics.
// CSS classes, data attributes, and component state are generally better
// choices when a value exists only to control visual styling.

export const StylingSeparation: FC = (): ReactElement => {
  const expanded = true;

  return (
    <section>
      <button type="button" aria-expanded={expanded} className={expanded ? "is-expanded" : "is-collapsed"}>
        Details
      </button>
    </section>
  );
};

// The class controls presentation.
// aria-expanded communicates the semantic state.

// ---------------------------------------------------------------------
// 47. Property categories
// ---------------------------------------------------------------------

// ARIA attributes include properties and states grouped by their purpose.
// Common groups include:
//
// Widget attributes:
// aria-checked, aria-disabled, aria-expanded, aria-invalid,
// aria-label, aria-pressed, aria-required, aria-selected,
// aria-valuemax, aria-valuemin, aria-valuenow, aria-valuetext
//
// Live-region attributes:
// aria-atomic, aria-busy, aria-live, aria-relevant
//
// Relationship attributes:
// aria-activedescendant, aria-controls, aria-describedby,
// aria-details, aria-flowto, aria-labelledby, aria-owns,
// aria-posinset, aria-rowindex, aria-setsize
//
// Some ARIA attributes have specialized roles and applicability.
// Always verify that a property is supported for the role and element
// on which it is being used.

// ---------------------------------------------------------------------
// 48. Deprecated ARIA attributes
// ---------------------------------------------------------------------

// Some historical ARIA attributes are deprecated or obsolete in modern
// accessibility practice, including aria-dropeffect and aria-grabbed.
//
// New implementations should not rely on obsolete ARIA mechanisms.
// Prefer current HTML, ARIA, and interaction patterns.

export const ModernMarkup: FC = (): ReactElement => {
  return <button type="button">Move item</button>;
};

// ---------------------------------------------------------------------
// 49. ARIA properties and accessibility-tree semantics
// ---------------------------------------------------------------------

// ARIA primarily changes the semantics exposed through the accessibility
// tree. It does not directly change visual rendering or provide the
// behavior associated with a native HTML control.
//
// For example:
// aria-label       -> accessible name
// aria-describedby -> accessible description relationship
// aria-expanded    -> expanded/collapsed state
// aria-selected    -> selection state
// aria-controls    -> control relationship

export const AccessibilityTreeExample: FC = (): ReactElement => {
  return (
    <button type="button" aria-label="Open settings" aria-expanded={false} aria-controls="settings-panel">
      ⚙
    </button>
  );
};

// ---------------------------------------------------------------------
// 50. Final integrated example
// ---------------------------------------------------------------------

export const AriaPropertiesExample: FC = (): ReactElement => {
  const [expanded, setExpanded] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  return (
    <main>
      <section aria-labelledby="preferences-title">
        <h1 id="preferences-title">Preferences</h1>

        <div>
          <button
            type="button"
            aria-expanded={expanded}
            aria-controls="advanced-preferences"
            onClick={() => setExpanded((current) => !current)}
          >
            Advanced preferences
          </button>

          <div id="advanced-preferences" hidden={!expanded}>
            <label>
              <input
                type="checkbox"
                checked={notificationsEnabled}
                onChange={(event) => setNotificationsEnabled(event.target.checked)}
              />
              Receive notifications
            </label>

            <p id="notification-description">Notifications can be changed at any time.</p>

            <button
              type="button"
              aria-pressed={notificationsEnabled}
              aria-describedby="notification-description"
              onClick={() => setNotificationsEnabled((current) => !current)}
            >
              {notificationsEnabled ? "Notifications enabled" : "Notifications disabled"}
            </button>
          </div>
        </div>
      </section>
    </main>
  );
};

// The integrated example demonstrates several important principles:
// native HTML supplies behavior where possible;
// ARIA properties communicate state and relationships;
// React state keeps those properties synchronized with the interface;
// IDs establish relationships between controls and referenced content.

// ---------------------------------------------------------------------
// 51. Practical checklist
// ---------------------------------------------------------------------

// Before adding an ARIA property:
//
// - Check whether native HTML already provides the required semantics.
// - Use aria-label only when a suitable accessible name is not otherwise available.
// - Prefer aria-labelledby when an existing visible element provides the name.
// - Use aria-describedby for supplementary descriptions and error/help text.
// - Use aria-controls only for a real control-to-content relationship.
// - Keep aria-expanded synchronized with the actual expanded state.
// - Use aria-current only for the current item in a related set.
// - Use aria-pressed for toggle-button state.
// - Use aria-selected only where the applicable widget pattern defines selection.
// - Use aria-invalid to communicate actual validation state.
// - Keep ARIA properties synchronized with the visible interface.
// - Do not assume ARIA creates keyboard behavior, focus management, or styling.
// - Do not add redundant or conflicting ARIA.
// - Verify that a property is supported for the relevant role.
// - Test the resulting accessibility tree and keyboard interaction.

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - ARIA properties communicate semantic information through the accessibility tree.
// - aria-label and aria-labelledby provide accessible names.
// - aria-describedby, aria-description, and aria-details provide additional descriptions.
// - aria-controls establishes a relationship between a control and controlled content.
// - aria-expanded communicates expanded or collapsed state.
// - aria-current identifies the current item within a related set.
// - aria-pressed communicates the state of a toggle button.
// - aria-selected and aria-checked communicate selection and checked states where applicable.
// - aria-invalid and aria-required communicate form-validation semantics.
// - aria-valuemin, aria-valuemax, aria-valuenow, and aria-valuetext describe range values.
// - aria-live, aria-atomic, aria-relevant, and aria-busy support dynamic content communication.
// - ARIA properties communicate semantics but do not create interaction behavior.
// - Native HTML should be preferred when it already provides the required semantics and behavior.
// - ARIA properties must accurately reflect the current UI state and actual relationships.
// - Accessible names, descriptions, keyboard behavior, focus management, and state synchronization
//   must all be considered when building custom accessible components.

export default AriaPropertiesExample;
