/**
 * Accessible Components
 * ======================
 *
 * Accessible components combine semantic structure, accessible names, keyboard
 * interaction, focus management, state communication, and appropriate visual
 * feedback so that the same functionality remains usable with different input
 * methods and assistive technologies.
 *
 * Native HTML elements should be preferred whenever they provide the required
 * interaction. Custom components that recreate widgets with ARIA also have to
 * implement the keyboard behavior and focus management expected for those
 * widgets.
 */

// ---------------------------------------------------------------------
// Imports
// ---------------------------------------------------------------------

import { type FC, type ReactElement, type ReactNode, useId, useRef, useState } from "react";

// ---------------------------------------------------------------------
// 1. What makes a component accessible
// ---------------------------------------------------------------------

// An accessible component is not defined by ARIA alone.
//
// A complete component considers:
// - semantic HTML;
// - an accessible name;
// - keyboard access;
// - visible focus;
// - appropriate state communication;
// - predictable interaction;
// - sufficient contrast and visual feedback;
// - correct focus management;
// - compatibility with assistive technologies.

export const AccessibleComponentConcept: FC = (): ReactElement => {
  return <button type="button">Save changes</button>;
};

// A native button already provides the expected role, keyboard activation,
// focus behavior, and interaction semantics.

// ---------------------------------------------------------------------
// 2. Prefer native HTML
// ---------------------------------------------------------------------

// Native HTML controls provide browser behavior and accessibility semantics.
//
// Replacing a native control with a generic element creates additional
// accessibility responsibilities.

export const NativeControls: FC = (): ReactElement => {
  return (
    <form>
      <label>
        Name
        <input type="text" />
      </label>

      <button type="submit">Save</button>

      <a href="/account">Account</a>
    </form>
  );
};

// Native elements should be the starting point whenever their semantics and
// behavior match the required component.

// ---------------------------------------------------------------------
// 3. Do not recreate a button with a div
// ---------------------------------------------------------------------

export const IncorrectCustomButton: FC = (): ReactElement => {
  return <div>Save</div>;
};

// A generic div has no button semantics and is not a substitute for <button>.

// ---------------------------------------------------------------------
// 4. A native button is preferable to role="button"
// ---------------------------------------------------------------------

export const NativeButton: FC = (): ReactElement => {
  return <button type="button">Save</button>;
};

export const CustomButtonSemantics: FC = (): ReactElement => {
  return (
    <div role="button" tabIndex={0}>
      Save
    </div>
  );
};

// role="button" does not provide the native button's keyboard behavior.
// A custom button would need to implement the expected interaction itself.

// ---------------------------------------------------------------------
// 5. Custom button keyboard behavior
// ---------------------------------------------------------------------

export const CustomButton: FC = (): ReactElement => {
  const activate = (): void => {
    console.log("Activated");
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>): void => {
    if (event.key === "Enter") {
      event.preventDefault();
      activate();
    }

    if (event.key === " ") {
      event.preventDefault();
      activate();
    }
  };

  return (
    <div role="button" tabIndex={0} onClick={activate} onKeyDown={handleKeyDown}>
      Save
    </div>
  );
};

// This demonstrates the additional work required by a custom button.
// Prefer the native button whenever possible.

// ---------------------------------------------------------------------
// 6. Accessible names
// ---------------------------------------------------------------------

// Interactive components need an accessible name that identifies their
// purpose.
//
// Visible text is often the simplest naming mechanism.

export const NamedControls: FC = (): ReactElement => {
  return (
    <div>
      <button type="button">Save</button>

      <a href="/account">Account settings</a>
    </div>
  );
};

// The visible text supplies the accessible name for both controls.

// ---------------------------------------------------------------------
// 7. Icon-only controls
// ---------------------------------------------------------------------

// An icon by itself may not provide a useful accessible name.
//
// The control can use aria-label when there is no visible text.

export const IconButton: FC = (): ReactElement => {
  return (
    <button type="button" aria-label="Close">
      ×
    </button>
  );
};

// The accessible name describes the action rather than the visual symbol.

// ---------------------------------------------------------------------
// 8. Visible labels should normally remain visible
// ---------------------------------------------------------------------

export const LabeledInput: FC = (): ReactElement => {
  const inputId = useId();

  return (
    <div>
      <label htmlFor={inputId}>Email address</label>

      <input id={inputId} type="email" name="email" />
    </div>
  );
};

// A native label provides both a visible association and an accessible name.

// ---------------------------------------------------------------------
// 9. Descriptions and instructions
// ---------------------------------------------------------------------

export const DescribedInput: FC = (): ReactElement => {
  const inputId = useId();
  const descriptionId = useId();

  return (
    <div>
      <label htmlFor={inputId}>Username</label>

      <p id={descriptionId}>Use 3 to 20 characters.</p>

      <input id={inputId} type="text" aria-describedby={descriptionId} />
    </div>
  );
};

// aria-describedby supplements the accessible name with additional
// descriptive information.

// ---------------------------------------------------------------------
// 10. Accessible component state
// ---------------------------------------------------------------------

// State that changes visually should also be exposed when an appropriate
// semantic state exists.

export const PressedButton: FC = (): ReactElement => {
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

// aria-pressed communicates the current toggle-button state.

// ---------------------------------------------------------------------
// 11. Disabled controls
// ---------------------------------------------------------------------

export const DisabledButton: FC = (): ReactElement => {
  const [saving, setSaving] = useState(false);

  return (
    <button
      type="button"
      disabled={saving}
      onClick={() => {
        setSaving(true);
      }}
    >
      {saving ? "Saving..." : "Save"}
    </button>
  );
};

// Native disabled controls should generally use the disabled attribute.
// aria-disabled is appropriate for some composite-widget patterns where the
// element intentionally remains focusable.

// ---------------------------------------------------------------------
// 12. Links are for navigation
// ---------------------------------------------------------------------

export const NavigationLink: FC = (): ReactElement => {
  return <a href="/account">Account</a>;
};

// A link communicates navigation and supports browser link behavior.

// ---------------------------------------------------------------------
// 13. Buttons are for actions
// ---------------------------------------------------------------------

export const ActionButton: FC = (): ReactElement => {
  return (
    <button
      type="button"
      onClick={() => {
        console.log("Action");
      }}
    >
      Refresh
    </button>
  );
};

// Do not use a link solely because it happens to look like a button, or a
// button solely because it happens to look like a link.

// ---------------------------------------------------------------------
// 14. Form components
// ---------------------------------------------------------------------

interface FormFieldProps {
  readonly label: string;
}

export const FormField: FC<FormFieldProps> = ({ label }): ReactElement => {
  const inputId = useId();

  return (
    <div>
      <label htmlFor={inputId}>{label}</label>

      <input id={inputId} name="example" type="text" />
    </div>
  );
};

// Reusable form components should preserve the native relationship between
// labels and controls.

// ---------------------------------------------------------------------
// 15. Error messages
// ---------------------------------------------------------------------

export const InvalidField: FC = (): ReactElement => {
  const inputId = useId();
  const errorId = useId();

  return (
    <div>
      <label htmlFor={inputId}>Email address</label>

      <input id={inputId} name="email" type="email" aria-invalid="true" aria-describedby={errorId} />

      <p id={errorId}>Enter a valid email address.</p>
    </div>
  );
};

// aria-invalid communicates the invalid state, while aria-describedby
// associates the explanatory message with the control.

// ---------------------------------------------------------------------
// 16. Field groups
// ---------------------------------------------------------------------

export const AddressGroup: FC = (): ReactElement => {
  const groupId = useId();

  return (
    <fieldset aria-labelledby={groupId}>
      <legend id={groupId}>Shipping address</legend>

      <label>
        Street
        <input type="text" name="street" />
      </label>

      <label>
        City
        <input type="text" name="city" />
      </label>
    </fieldset>
  );
};

// fieldset and legend provide native grouping semantics for related controls.

// ---------------------------------------------------------------------
// 17. Disclosure components
// ---------------------------------------------------------------------

export const Disclosure: FC = (): ReactElement => {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  return (
    <div>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => {
          setOpen((current) => !current);
        }}
      >
        Details
      </button>

      {open && <div id={panelId}>Additional information.</div>}
    </div>
  );
};

// A disclosure button communicates whether its associated content is expanded.

// ---------------------------------------------------------------------
// 18. Accordion components
// ---------------------------------------------------------------------

// An accordion is a collection of disclosure controls whose panels are
// independently or collectively expanded according to the design.

interface AccordionItemProps {
  readonly title: string;
  readonly children: ReactNode;
}

export const AccordionItem: FC<AccordionItemProps> = ({ title, children }): ReactElement => {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  return (
    <section>
      <h3>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => {
            setOpen((current) => !current);
          }}
        >
          {title}
        </button>
      </h3>

      {open && <div id={panelId}>{children}</div>}
    </section>
  );
};

// Heading structure and button semantics make the accordion easier to
// understand and operate.

// ---------------------------------------------------------------------
// 19. Tabs
// ---------------------------------------------------------------------

// Tabs are a composite widget and therefore require more interaction logic
// than an ordinary collection of buttons.

interface TabProps {
  readonly selected: boolean;
  readonly controls: string;
  readonly id: string;
  readonly onClick: () => void;
  readonly children: ReactNode;
}

export const Tab: FC<TabProps> = ({ selected, controls, id, onClick, children }): ReactElement => {
  return (
    <button
      id={id}
      type="button"
      role="tab"
      aria-selected={selected}
      aria-controls={controls}
      tabIndex={selected ? 0 : -1}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

// A complete tab widget also needs the keyboard interaction model defined by
// the chosen tab pattern, including movement between tabs.

// ---------------------------------------------------------------------
// 20. Tab panels
// ---------------------------------------------------------------------

interface TabPanelProps {
  readonly id: string;
  readonly labelledBy: string;
  readonly children: ReactNode;
}

export const TabPanel: FC<TabPanelProps> = ({ id, labelledBy, children }): ReactElement => {
  return (
    <div id={id} role="tabpanel" aria-labelledby={labelledBy} tabIndex={0}>
      {children}
    </div>
  );
};

// The tab panel is associated with its controlling tab using
// aria-labelledby.

// ---------------------------------------------------------------------
// 21. A complete simple tab interface
// ---------------------------------------------------------------------

export const AccessibleTabs: FC = (): ReactElement => {
  const [selected, setSelected] = useState<"details" | "settings">("details");

  const detailsTabId = "details-tab";
  const settingsTabId = "settings-tab";
  const detailsPanelId = "details-panel";
  const settingsPanelId = "settings-panel";

  return (
    <div>
      <div role="tablist" aria-label="Account sections">
        <Tab
          id={detailsTabId}
          controls={detailsPanelId}
          selected={selected === "details"}
          onClick={() => {
            setSelected("details");
          }}
        >
          Details
        </Tab>

        <Tab
          id={settingsTabId}
          controls={settingsPanelId}
          selected={selected === "settings"}
          onClick={() => {
            setSelected("settings");
          }}
        >
          Settings
        </Tab>
      </div>

      {selected === "details" && (
        <TabPanel id={detailsPanelId} labelledBy={detailsTabId}>
          Account details.
        </TabPanel>
      )}

      {selected === "settings" && (
        <TabPanel id={settingsPanelId} labelledBy={settingsTabId}>
          Account settings.
        </TabPanel>
      )}
    </div>
  );
};

// This example demonstrates the semantic relationships but intentionally keeps
// the keyboard model simple. A production tablist should implement the
// interaction pattern appropriate to its design.

// ---------------------------------------------------------------------
// 22. Checkbox components
// ---------------------------------------------------------------------

export const NativeCheckbox: FC = (): ReactElement => {
  const [checked, setChecked] = useState(false);

  return (
    <label>
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => {
          setChecked(event.target.checked);
        }}
      />
      Receive notifications
    </label>
  );
};

// Native checkboxes already provide keyboard interaction and checked-state
// semantics.

// ---------------------------------------------------------------------
// 23. Custom checkbox
// ---------------------------------------------------------------------

export const CustomCheckbox: FC = (): ReactElement => {
  const [checked, setChecked] = useState(false);

  return (
    <div
      role="checkbox"
      tabIndex={0}
      aria-checked={checked}
      onClick={() => {
        setChecked((current) => !current);
      }}
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

// This custom implementation requires explicit keyboard and state behavior.
// The native checkbox remains preferable when its behavior is sufficient.

// ---------------------------------------------------------------------
// 24. Switch components
// ---------------------------------------------------------------------

export const NativeSwitchAlternative: FC = (): ReactElement => {
  const [enabled, setEnabled] = useState(false);

  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      onClick={() => {
        setEnabled((current) => !current);
      }}
    >
      Notifications
    </button>
  );
};

// A switch communicates a binary on/off state. The implementation must keep
// the visual state and aria-checked state synchronized.

// ---------------------------------------------------------------------
// 25. Radio groups
// ---------------------------------------------------------------------

export const NativeRadioGroup: FC = (): ReactElement => {
  const [value, setValue] = useState("email");

  return (
    <fieldset>
      <legend>Preferred contact method</legend>

      <label>
        <input
          type="radio"
          name="contact"
          value="email"
          checked={value === "email"}
          onChange={(event) => {
            setValue(event.target.value);
          }}
        />
        Email
      </label>

      <label>
        <input
          type="radio"
          name="contact"
          value="phone"
          checked={value === "phone"}
          onChange={(event) => {
            setValue(event.target.value);
          }}
        />
        Phone
      </label>
    </fieldset>
  );
};

// Native radio buttons already provide the expected grouping and keyboard
// interaction.

// ---------------------------------------------------------------------
// 26. Select controls
// ---------------------------------------------------------------------

export const NativeSelect: FC = (): ReactElement => {
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

// A native select should be preferred over recreating a listbox or combobox
// when the simpler native interaction is sufficient.

// ---------------------------------------------------------------------
// 27. Range controls
// ---------------------------------------------------------------------

export const NativeRange: FC = (): ReactElement => {
  const [value, setValue] = useState(50);

  return (
    <label>
      Volume
      <input
        type="range"
        min={0}
        max={100}
        value={value}
        onChange={(event) => {
          setValue(Number(event.target.value));
        }}
      />
      <output>{value}</output>
    </label>
  );
};

// Native range inputs provide keyboard behavior and range semantics.

// ---------------------------------------------------------------------
// 28. Progress indicators
// ---------------------------------------------------------------------

export const ProgressIndicator: FC = (): ReactElement => {
  return (
    <div>
      <label htmlFor="progress">Upload progress</label>

      <progress id="progress" value={60} max={100}>
        60%
      </progress>
    </div>
  );
};

// Use native progress when the value represents progress toward completion.

// ---------------------------------------------------------------------
// 29. Loading states
// ---------------------------------------------------------------------

export const LoadingButton: FC = (): ReactElement => {
  const [loading, setLoading] = useState(false);

  return (
    <button
      type="button"
      disabled={loading}
      aria-busy={loading}
      onClick={() => {
        setLoading(true);
      }}
    >
      {loading ? "Saving..." : "Save"}
    </button>
  );
};

// aria-busy communicates that the associated interface is currently busy.
// The actual loading behavior remains the responsibility of the application.

// ---------------------------------------------------------------------
// 30. Status messages
// ---------------------------------------------------------------------

export const StatusMessage: FC = (): ReactElement => {
  return <p role="status">Changes saved.</p>;
};

// A status region can communicate non-critical updates without moving focus.

// ---------------------------------------------------------------------
// 31. Alert messages
// ---------------------------------------------------------------------

export const AlertMessage: FC = (): ReactElement => {
  return <div role="alert">Your session has expired.</div>;
};

// Alerts are intended for important messages that need immediate attention.
// They should not be used for every ordinary status update.

// ---------------------------------------------------------------------
// 32. Dialog components
// ---------------------------------------------------------------------

export const AccessibleDialog: FC = (): ReactElement => {
  return (
    <div role="dialog" aria-modal="true" aria-labelledby="dialog-title">
      <h2 id="dialog-title">Confirm changes</h2>

      <p>Review your changes before saving.</p>

      <button type="button">Cancel</button>

      <button type="button">Save</button>
    </div>
  );
};

// A custom dialog needs correct naming, focus management, keyboard behavior,
// dismissal behavior, and background interaction handling.

// ---------------------------------------------------------------------
// 33. Tooltip components
// ---------------------------------------------------------------------

// A tooltip provides supplementary information rather than a replacement
// for an essential accessible name or control label.

export const TooltipExample: FC = (): ReactElement => {
  const tooltipId = useId();

  return (
    <div>
      <button type="button" aria-describedby={tooltipId}>
        Save
      </button>

      <div id={tooltipId} role="tooltip">
        Saves your changes.
      </div>
    </div>
  );
};

// Tooltip behavior must also account for pointer and keyboard users.

// ---------------------------------------------------------------------
// 34. Menu components
// ---------------------------------------------------------------------

// Menus are not merely visual lists of links.
//
// A true ARIA menu has a specific interaction model and keyboard behavior.

export const MenuConcept: FC = (): ReactElement => {
  return (
    <div>
      <button type="button" aria-haspopup="menu" aria-expanded={true}>
        Actions
      </button>

      <div role="menu" aria-label="Actions">
        <button type="button" role="menuitem">
          Edit
        </button>

        <button type="button" role="menuitem">
          Delete
        </button>
      </div>
    </div>
  );
};

// A production menu must implement the keyboard interaction expected by the
// menu pattern, including movement among menu items.

// ---------------------------------------------------------------------
// 35. Composite widgets
// ---------------------------------------------------------------------

// Composite widgets contain multiple interactive choices but usually expose
// one entry point in the page Tab sequence.
//
// Arrow keys or another pattern-specific mechanism can then manage movement
// within the widget.

export const CompositeWidgetConcept: FC = (): ReactElement => {
  return (
    <div role="toolbar" aria-label="Formatting">
      <button type="button">Bold</button>

      <button type="button">Italic</button>

      <button type="button">Underline</button>
    </div>
  );
};

// The exact focus model depends on the widget pattern. Do not invent keyboard
// behavior that conflicts with the established pattern.

// ---------------------------------------------------------------------
// 36. Roving tabindex
// ---------------------------------------------------------------------

export const RovingTabIndex: FC = (): ReactElement => {
  const [active, setActive] = useState(0);

  const items = ["One", "Two", "Three"];

  const move = (index: number): void => {
    setActive(index);
  };

  return (
    <div role="toolbar" aria-label="Example actions">
      {items.map((item, index) => (
        <button
          key={item}
          type="button"
          tabIndex={index === active ? 0 : -1}
          onClick={() => {
            move(index);
          }}
        >
          {item}
        </button>
      ))}
    </div>
  );
};

// Roving tabindex can keep one element in the sequential Tab sequence while
// other elements remain programmatically focusable.

// ---------------------------------------------------------------------
// 37. aria-activedescendant
// ---------------------------------------------------------------------

export const ActiveDescendantConcept: FC = (): ReactElement => {
  const [activeId, setActiveId] = useState("option-one");

  return (
    <div role="listbox" tabIndex={0} aria-activedescendant={activeId} aria-label="Example options">
      <div
        id="option-one"
        role="option"
        aria-selected={activeId === "option-one"}
        onClick={() => {
          setActiveId("option-one");
        }}
      >
        One
      </div>

      <div
        id="option-two"
        role="option"
        aria-selected={activeId === "option-two"}
        onClick={() => {
          setActiveId("option-two");
        }}
      >
        Two
      </div>
    </div>
  );
};

// aria-activedescendant keeps DOM focus on the composite container while
// communicating which descendant is currently active.
//
// The component still needs the keyboard behavior required by its pattern.

// ---------------------------------------------------------------------
// 38. Keyboard interaction is part of the component
// ---------------------------------------------------------------------

// ARIA semantics do not automatically implement keyboard interaction for
// custom widgets.

export const KeyboardControlledComponent: FC = (): ReactElement => {
  const [value, setValue] = useState(0);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>): void => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      setValue((current) => Math.min(current + 1, 10));
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      setValue((current) => Math.max(current - 1, 0));
    }
  };

  return (
    <div
      role="slider"
      tabIndex={0}
      aria-valuemin={0}
      aria-valuemax={10}
      aria-valuenow={value}
      aria-label="Example value"
      onKeyDown={handleKeyDown}
    >
      {value}
    </div>
  );
};

// This illustrates the principle that semantics and behavior are separate
// responsibilities. A native input[type="range"] would normally be preferable.

// ---------------------------------------------------------------------
// 39. Focus should remain predictable
// ---------------------------------------------------------------------

export const PredictableFocus: FC = (): ReactElement => {
  const inputRef = useRef<HTMLInputElement>(null);

  const focusInput = (): void => {
    inputRef.current?.focus();
  };

  return (
    <div>
      <button type="button" onClick={focusInput}>
        Edit name
      </button>

      <input ref={inputRef} type="text" aria-label="Name" />
    </div>
  );
};

// Programmatic focus should move to a logical destination and should be used
// when it improves the user's understanding of the interaction.

// ---------------------------------------------------------------------
// 40. Focus after conditional rendering
// ---------------------------------------------------------------------

export const FocusAfterRendering: FC = (): ReactElement => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const startEditing = (): void => {
    setEditing(true);

    requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
  };

  return (
    <div>
      {!editing && (
        <button type="button" onClick={startEditing}>
          Edit
        </button>
      )}

      {editing && <input ref={inputRef} type="text" aria-label="Value" />}
    </div>
  );
};

// When an interaction replaces the focused control, focus may need to be
// explicitly moved to the newly rendered control.

// ---------------------------------------------------------------------
// 41. Preserve focus when possible
// ---------------------------------------------------------------------

export const StableInteractiveElement: FC = (): ReactElement => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div>
      <button
        type="button"
        aria-expanded={expanded}
        onClick={() => {
          setExpanded((current) => !current);
        }}
      >
        Details
      </button>

      {expanded && <p>Additional details.</p>}
    </div>
  );
};

// Keeping the same button mounted avoids unnecessary focus loss.

// ---------------------------------------------------------------------
// 42. Do not use CSS order to change logical interaction order
// ---------------------------------------------------------------------

export const LogicalSourceOrder: FC = (): ReactElement => {
  return (
    <div className="layout">
      <main>
        <h1>Main content</h1>

        <button type="button">Continue</button>
      </main>

      <aside>
        <h2>Related information</h2>
      </aside>
    </div>
  );
};

// Visual layout can be changed with CSS, but source order should remain
// consistent with the intended reading and interaction sequence.

// ---------------------------------------------------------------------
// 43. Avoid removing focus outlines
// ---------------------------------------------------------------------

export const FocusableControl: FC = (): ReactElement => {
  return (
    <button type="button" className="action">
      Continue
    </button>
  );
};

// Avoid CSS such as:
// .action:focus {
//     outline: none;
// }
//
// If the browser focus indicator is replaced, the replacement must remain
// clearly visible.

// ---------------------------------------------------------------------
// 44. Accessible focus styling
// ---------------------------------------------------------------------

export const FocusStyleExample: FC = (): ReactElement => {
  return (
    <button type="button" className="action">
      Continue
    </button>
  );
};

// Example CSS:
//
// .action:focus-visible {
//     outline: 3px solid currentColor;
//     outline-offset: 3px;
// }

// The exact visual design can vary, but keyboard users need a discernible
// indication of where focus is located.

// ---------------------------------------------------------------------
// 45. Accessible tables
// ---------------------------------------------------------------------

export const AccessibleTable: FC = (): ReactElement => {
  return (
    <table>
      <caption>Example account balances</caption>

      <thead>
        <tr>
          <th scope="col">Account</th>
          <th scope="col">Balance</th>
        </tr>
      </thead>

      <tbody>
        <tr>
          <th scope="row">Example account</th>
          <td>$100</td>
        </tr>
      </tbody>
    </table>
  );
};

// Native table semantics provide structural information that custom div-based
// tables would otherwise have to recreate.

// ---------------------------------------------------------------------
// 46. Accessible lists
// ---------------------------------------------------------------------

export const AccessibleList: FC = (): ReactElement => {
  return (
    <ul>
      <li>Account</li>
      <li>Settings</li>
      <li>Notifications</li>
    </ul>
  );
};

// Use list elements when the content is actually a list.

// ---------------------------------------------------------------------
// 47. Accessible navigation
// ---------------------------------------------------------------------

export const AccessibleNavigation: FC = (): ReactElement => {
  return (
    <nav aria-label="Primary">
      <ul>
        <li>
          <a href="/">Home</a>
        </li>

        <li>
          <a href="/account">Account</a>
        </li>

        <li>
          <a href="/settings">Settings</a>
        </li>
      </ul>
    </nav>
  );
};

// A navigation landmark should have an accessible name when multiple
// navigation landmarks need to be distinguished.

// ---------------------------------------------------------------------
// 48. Accessible cards
// ---------------------------------------------------------------------

export const AccessibleCard: FC = (): ReactElement => {
  return (
    <article>
      <h2>Example article</h2>

      <p>A short description of the article.</p>

      <a href="/article">Read article</a>
    </article>
  );
};

// A card does not need to become a custom interactive widget simply because
// its contents are visually grouped.

// ---------------------------------------------------------------------
// 49. Avoid making the entire card clickable unnecessarily
// ---------------------------------------------------------------------

export const CardWithSpecificAction: FC = (): ReactElement => {
  return (
    <article>
      <h2>Example product</h2>

      <p>Product description.</p>

      <button type="button">Add to cart</button>

      <a href="/product">View product</a>
    </article>
  );
};

// Separate interactive elements communicate their individual purposes and
// remain independently keyboard accessible.

// ---------------------------------------------------------------------
// 50. Accessible images inside components
// ---------------------------------------------------------------------

export const ProductImage: FC = (): ReactElement => {
  return (
    <figure>
      <img src="/images/example-product.jpg" alt="Example product" />

      <figcaption>Example product.</figcaption>
    </figure>
  );
};

// Alternative text should communicate the image's purpose in its surrounding
// context. Decorative images should use alt="" instead.

// ---------------------------------------------------------------------
// 51. Decorative icons
// ---------------------------------------------------------------------

export const DecorativeIcon: FC = (): ReactElement => {
  return (
    <button type="button">
      <span aria-hidden="true">★</span>
      Favorite
    </button>
  );
};

// When visible text already names the control, a decorative icon does not
// need to become an additional accessible name.

// ---------------------------------------------------------------------
// 52. Loading spinners
// ---------------------------------------------------------------------

export const LoadingIndicator: FC = (): ReactElement => {
  return (
    <div role="status" aria-live="polite">
      <span aria-hidden="true">Loading...</span>

      <span>Loading account data.</span>
    </div>
  );
};

// Decorative animation should not be the only way to communicate progress.

// ---------------------------------------------------------------------
// 53. Avoid duplicate announcements
// ---------------------------------------------------------------------

export const SingleStatusMessage: FC = (): ReactElement => {
  return <div role="status">Saved.</div>;
};

// Do not create several overlapping live regions that announce the same
// message through different mechanisms.

// ---------------------------------------------------------------------
// 54. Accessible component APIs
// ---------------------------------------------------------------------

interface AccessibleButtonProps {
  readonly children: ReactNode;
  readonly disabled?: boolean;
  readonly onClick: () => void;
}

export const AccessibleButton: FC<AccessibleButtonProps> = ({ children, disabled = false, onClick }): ReactElement => {
  return (
    <button type="button" disabled={disabled} onClick={onClick}>
      {children}
    </button>
  );
};

// Reusable components should preserve native semantics rather than hiding
// them behind generic wrapper elements.

// ---------------------------------------------------------------------
// 55. Preserve native attributes
// ---------------------------------------------------------------------

interface TextInputProps {
  readonly id: string;
  readonly label: string;
  readonly name: string;
  readonly type?: "email" | "text";
}

export const TextInput: FC<TextInputProps> = ({ id, label, name, type = "text" }): ReactElement => {
  return (
    <div>
      <label htmlFor={id}>{label}</label>

      <input id={id} name={name} type={type} />
    </div>
  );
};

// Component APIs should expose the information necessary to preserve correct
// labels, names, states, and relationships.

// ---------------------------------------------------------------------
// 56. Avoid swallowing accessible behavior
// ---------------------------------------------------------------------

interface WrapperProps {
  readonly children: ReactNode;
}

export const SemanticWrapper: FC<WrapperProps> = ({ children }): ReactElement => {
  return <section>{children}</section>;
};

// Generic component abstractions should not replace meaningful semantics with
// unnecessary divs or spans.

// ---------------------------------------------------------------------
// 57. Accessible component composition
// ---------------------------------------------------------------------

export const ComposedForm: FC = (): ReactElement => {
  return (
    <form>
      <FormField label="Name" />

      <FormField label="Email" />

      <button type="submit">Submit</button>
    </form>
  );
};

// Composition should preserve the semantics of each child component.

// ---------------------------------------------------------------------
// 58. Do not hide required interaction behind hover
// ---------------------------------------------------------------------

export const HoverIndependentAction: FC = (): ReactElement => {
  return (
    <div>
      <button type="button">More information</button>

      <p>Additional information is available.</p>
    </div>
  );
};

// Essential information and actions should not depend exclusively on hover.

// ---------------------------------------------------------------------
// 59. Do not require pointer gestures
// ---------------------------------------------------------------------

export const KeyboardAccessibleAction: FC = (): ReactElement => {
  return <button type="button">Open details</button>;
};

// If a pointer gesture provides an action, an equivalent keyboard-accessible
// interaction should also be available.

// ---------------------------------------------------------------------
// 60. Accessible component testing
// ---------------------------------------------------------------------

export const AccessibilityTestingChecklist: FC = (): ReactElement => {
  return (
    <ul>
      <li>The component has an appropriate semantic role.</li>

      <li>The component has an accessible name when required.</li>

      <li>All functionality is keyboard accessible.</li>

      <li>Focus is visible.</li>

      <li>Focus moves predictably.</li>

      <li>Dynamic state is communicated.</li>

      <li>Related controls and content have correct relationships.</li>

      <li>Error and status information is accessible.</li>
    </ul>
  );
};

// Automated accessibility testing is useful, but keyboard and assistive
// technology testing remain necessary for interactive components.

// ---------------------------------------------------------------------
// 61. Component accessibility checklist
// ---------------------------------------------------------------------
// - Prefer native HTML elements when they provide the required behavior.
// - Give interactive components an appropriate accessible name.
// - Use visible labels whenever possible.
// - Use semantic HTML before adding ARIA.
// - Treat ARIA as semantics, not as an implementation of behavior.
// - Implement keyboard interaction for custom widgets.
// - Keep keyboard focus visible.
// - Keep focus movement predictable.
// - Do not use positive tabindex values to manufacture a focus order.
// - Preserve logical source order.
// - Communicate important state changes with appropriate native attributes or ARIA.
// - Use native disabled controls when they should be unavailable and unfocusable.
// - Use aria-disabled only when the interaction model intentionally keeps the element focusable.
// - Use the correct pattern-specific keyboard behavior for composite widgets.
// - Keep accessible names and descriptions distinct.
// - Associate form labels with their controls.
// - Associate errors and descriptions with the relevant controls.
// - Use live regions for appropriate dynamic status information.
// - Do not make essential functionality depend only on hover or pointer gestures.
// - Manage focus when components appear, disappear, or replace the focused element.
// - Keep modal background content non-interactive when a modal is active.
// - Test components with keyboard-only navigation.
// - Test semantic output with assistive technologies.
// - Test component states, errors, loading, and dynamic updates.
// - Verify that visual and accessibility states remain synchronized.

// ---------------------------------------------------------------------
// 62. Integrated accessible component
// ---------------------------------------------------------------------

// This component combines several core accessibility practices:
//
// - semantic HTML;
// - a native button;
// - an accessible name;
// - explicit expanded state;
// - an associated content region;
// - a labeled form control;
// - native form semantics;
// - a status message;
// - predictable focus behavior.

export const AccessibleComponentExample: FC = (): ReactElement => {
  const [expanded, setExpanded] = useState(false);
  const [saved, setSaved] = useState(false);
  const panelId = useId();
  const nameId = useId();

  const save = (): void => {
    setSaved(true);
  };

  return (
    <main>
      <h1>Account settings</h1>

      <section>
        <h2>Profile</h2>

        <button
          type="button"
          aria-expanded={expanded}
          aria-controls={panelId}
          onClick={() => {
            setExpanded((current) => !current);
          }}
        >
          {expanded ? "Hide details" : "Show details"}
        </button>

        {expanded && (
          <div id={panelId}>
            <p>Update your profile information.</p>

            <form
              onSubmit={(event) => {
                event.preventDefault();
                save();
              }}
            >
              <label htmlFor={nameId}>Display name</label>

              <input id={nameId} name="displayName" type="text" />

              <button type="submit">Save changes</button>
            </form>

            {saved && <p role="status">Changes saved.</p>}
          </div>
        )}
      </section>
    </main>
  );
};

export default AccessibleComponentExample;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Accessible components combine semantics, names, keyboard interaction, focus management, state, and visual feedback.
// - Prefer native HTML controls whenever they provide the required interaction.
// - Native controls provide behavior that custom ARIA widgets must otherwise implement themselves.
// - ARIA communicates semantics but does not automatically implement widget behavior.
// - A role is a contract: custom widgets must provide the interaction expected for that role.
// - Every interactive component needs an appropriate accessible name.
// - Visible labels should normally be preserved rather than replaced with invisible naming mechanisms.
// - Form controls should have correctly associated labels, descriptions, and error messages.
// - Native buttons are preferable to generic elements with role="button".
// - Links should represent navigation, while buttons should represent actions.
// - Native checkboxes, radios, selects, ranges, and other controls should be preferred when appropriate.
// - Dynamic states should be communicated through native attributes or appropriate ARIA states.
// - Disclosure controls should expose their expanded state and relationship to their content.
// - Composite widgets such as tabs, menus, listboxes, and toolbars require pattern-specific keyboard behavior.
// - Roving tabindex and aria-activedescendant are focus-management techniques for appropriate composite widgets.
// - Focus should remain visible and should move predictably when the component changes.
// - Logical DOM order should remain consistent with the intended reading and interaction order.
// - Modal components require accessible naming, focus management, keyboard behavior, and background interaction control.
// - Live regions should be reserved for appropriate dynamic status and alert information.
// - Accessibility should be preserved through component composition and reusable component APIs.
// - Keyboard, semantic, visual, and assistive-technology testing should all be part of validating interactive components.
