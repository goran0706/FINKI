/**
 * ARIA Roles
 * ==========
 *
 * An ARIA role communicates the semantic type of an element to the browser's accessibility
 * layer. Roles can describe landmarks, widgets, document structures, live regions, and other
 * interface concepts that assistive technologies can expose to users.
 *
 * ARIA roles add semantics; they do not automatically provide the behavior, keyboard interaction,
 * focus management, or state synchronization associated with a native HTML control or custom widget.
 * Native HTML should therefore be preferred whenever it already provides the required semantics.
 */

import { type ReactElement } from "react";

// ---------------------------------------------------------------------
// 1. What an ARIA role does
// ---------------------------------------------------------------------

// The role attribute communicates what an element represents.
//
// For example:
//
// role="button"
// role="dialog"
// role="navigation"
// role="status"
//
// The role is exposed through the browser's accessibility layer so that
// assistive technologies can interpret the element according to its role.

export const BasicRoleExample = (): ReactElement => {
  return <div role="status">Changes saved.</div>;
};

// role="status" gives the element a specific accessibility semantic.
//
// The role does not change the element into a different HTML element.
// It remains a div in the DOM.

// ---------------------------------------------------------------------
// 2. Native HTML already has roles
// ---------------------------------------------------------------------

export const NativeRoleExample = (): ReactElement => {
  return <button type="button">Save</button>;
};

// Native HTML elements have implicit accessibility semantics.
//
// A button is exposed as a button without:
//
// role="button"
//
// Native semantics should normally be preferred because the HTML element
// also provides its associated interaction behavior.

// ---------------------------------------------------------------------
// 3. Explicit role versus implicit role
// ---------------------------------------------------------------------

export const ExplicitRoleExample = (): ReactElement => {
  return (
    <button type="button" role="button">
      Save
    </button>
  );
};

// The explicit role duplicates the button's native semantics.
//
// This is unnecessary because the button already has the button role.

// ---------------------------------------------------------------------
// 4. ARIA roles do not provide behavior
// ---------------------------------------------------------------------

export const RoleWithoutBehavior = (): ReactElement => {
  return <div role="button">Save</div>;
};

// role="button" communicates button semantics.
//
// It does not provide the native button's keyboard behavior, focus behavior,
// activation behavior, disabled behavior, or form integration.
//
// A native button should normally be used instead.

// ---------------------------------------------------------------------
// 5. Role categories
// ---------------------------------------------------------------------

export type AriaRoleCategory = "Widget" | "Composite" | "Document structure" | "Landmark" | "Live region" | "Window";

export interface AriaRoleCategoryExample {
  readonly category: AriaRoleCategory;
  readonly description: string;
}

export const ariaRoleCategories: readonly AriaRoleCategoryExample[] = [
  {
    category: "Widget",
    description: "Describes an individual interactive user-interface object.",
  },
  {
    category: "Composite",
    description: "Describes a widget that contains related interactive descendants.",
  },
  {
    category: "Document structure",
    description: "Describes structural or content relationships in a document.",
  },
  {
    category: "Landmark",
    description: "Identifies major navigational regions of a page.",
  },
  {
    category: "Live region",
    description: "Identifies content that can change dynamically and may need announcement.",
  },
  {
    category: "Window",
    description: "Describes dialog-like sub-windows within the current page.",
  },
];

// ARIA role classifications help organize the large role vocabulary.
//
// Some roles also participate in hierarchical role relationships in the
// ARIA specification.

// ---------------------------------------------------------------------
// 6. Widget roles
// ---------------------------------------------------------------------

// Widget roles describe interactive user-interface objects.
//
// Examples include:
//
// button
// checkbox
// link
// radio
// slider
// switch
// textbox
// tab
//
// Many of these have native HTML equivalents and should normally be
// implemented with those elements.

// ---------------------------------------------------------------------
// 7. Native widget example
// ---------------------------------------------------------------------

export const NativeWidget = (): ReactElement => {
  return <button type="button">Open settings</button>;
};

// The native button supplies both semantics and behavior.
//
// Replacing it with a generic element plus role="button" creates additional
// implementation responsibilities.

// ---------------------------------------------------------------------
// 8. Button role
// ---------------------------------------------------------------------

export const ButtonRoleExample = (): ReactElement => {
  return <button type="button">Save</button>;
};

// The native button already has the button role.
//
// Use role="button" primarily when implementing a genuine custom widget
// whose semantics cannot be provided by a suitable native element.

// ---------------------------------------------------------------------
// 9. Checkbox role
// ---------------------------------------------------------------------

export const NativeCheckbox = (): ReactElement => {
  return (
    <label>
      <input type="checkbox" />
      Receive notifications
    </label>
  );
};

// The native checkbox already exposes checkbox semantics and interaction.
//
// A custom element with role="checkbox" must also communicate its checked
// state and implement the expected interaction behavior.

// ---------------------------------------------------------------------
// 10. Custom checkbox role
// ---------------------------------------------------------------------

export const CustomCheckboxRole = (): ReactElement => {
  return (
    <span role="checkbox" aria-checked={false} tabIndex={0}>
      Receive notifications
    </span>
  );
};

// The role communicates that this is intended to be a checkbox.
//
// aria-checked communicates its current state.
//
// tabIndex makes the element keyboard-focusable, but focusability alone
// does not implement the complete checkbox interaction model.

// ---------------------------------------------------------------------
// 11. Radio role
// ---------------------------------------------------------------------

export const NativeRadioGroup = (): ReactElement => {
  return (
    <fieldset>
      <legend>Preferred format</legend>

      <label>
        <input type="radio" name="format" value="online" />
        Online
      </label>

      <label>
        <input type="radio" name="format" value="printed" />
        Printed
      </label>
    </fieldset>
  );
};

// Native radio buttons provide the semantics and interaction model needed
// for a standard radio group.

// ---------------------------------------------------------------------
// 12. Switch role
// ---------------------------------------------------------------------

export const NativeSwitchAlternative = (): ReactElement => {
  return (
    <label>
      <input type="checkbox" />
      Enable notifications
    </label>
  );
};

// A checkbox can represent an on/off preference when the native checkbox
// semantics match the intended interaction.
//
// A custom switch role is appropriate only when the interface actually
// implements a switch widget and its expected behavior.

// ---------------------------------------------------------------------
// 13. Custom switch role
// ---------------------------------------------------------------------

export const CustomSwitchRole = ({ enabled }: { readonly enabled: boolean }): ReactElement => {
  return (
    <button type="button" role="switch" aria-checked={enabled}>
      Notifications
    </button>
  );
};

// A button can be given switch semantics when the application is
// implementing a switch pattern.
//
// The aria-checked state must stay synchronized with the actual setting.

// ---------------------------------------------------------------------
// 14. Textbox role
// ---------------------------------------------------------------------

export const NativeTextInput = (): ReactElement => {
  return (
    <label>
      Search
      <input type="text" />
    </label>
  );
};

// Prefer native input and textarea elements for text entry.
//
// They provide native semantics and interaction behavior.

// ---------------------------------------------------------------------
// 15. Searchbox role
// ---------------------------------------------------------------------

export const SearchInput = (): ReactElement => {
  return (
    <label>
      Search
      <input type="search" name="query" />
    </label>
  );
};

// Native search inputs should be preferred when their semantics are
// sufficient.
//
// A searchbox role is useful when implementing a widget that needs that
// specific ARIA semantic and cannot use the appropriate native element.

// ---------------------------------------------------------------------
// 16. Slider role
// ---------------------------------------------------------------------

export const NativeRange = (): ReactElement => {
  return (
    <label>
      Volume
      <input type="range" min={0} max={100} defaultValue={50} />
    </label>
  );
};

// The native range input already provides slider-like semantics and
// keyboard interaction.
//
// Prefer it over recreating a slider with a generic element and ARIA.

// ---------------------------------------------------------------------
// 17. Progressbar role
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

// The progress element provides native progress semantics.
//
// A custom progressbar role is appropriate only when native progress
// cannot represent the required interface.

// ---------------------------------------------------------------------
// 18. Dialog role
// ---------------------------------------------------------------------

export const DialogRoleExample = (): ReactElement => {
  return (
    <div role="dialog" aria-labelledby="example-dialog-title">
      <h2 id="example-dialog-title">Example settings</h2>

      <p>Update your example preferences.</p>
    </div>
  );
};

// The dialog role identifies a window-like section of the application.
//
// The role alone does not implement modal behavior, focus management,
// focus trapping, Escape handling, or background interaction rules.

// ---------------------------------------------------------------------
// 19. Alertdialog role
// ---------------------------------------------------------------------

export const AlertDialogRoleExample = (): ReactElement => {
  return (
    <div role="alertdialog" aria-labelledby="example-alert-title" aria-describedby="example-alert-description">
      <h2 id="example-alert-title">Delete item?</h2>

      <p id="example-alert-description">This action cannot be undone.</p>

      <button type="button">Delete</button>

      <button type="button">Cancel</button>
    </div>
  );
};

// alertdialog is intended for an important dialog that interrupts the
// user's workflow and requires a response.
//
// The role does not implement the dialog interaction itself.

// ---------------------------------------------------------------------
// 20. Composite roles
// ---------------------------------------------------------------------

// Composite roles describe widgets that contain related interactive
// descendants.
//
// Common examples include:
//
// combobox
// grid
// listbox
// menu
// menubar
// radiogroup
// tablist
// tree
// treegrid
//
// These roles usually impose relationships between the parent widget and
// its descendants.

// ---------------------------------------------------------------------
// 21. Tablist role
// ---------------------------------------------------------------------

export const TabListExample = (): ReactElement => {
  return (
    <div role="tablist" aria-label="Example sections">
      <button
        type="button"
        role="tab"
        aria-selected={true}
        aria-controls="example-overview-panel"
        id="example-overview-tab"
      >
        Overview
      </button>

      <button
        type="button"
        role="tab"
        aria-selected={false}
        aria-controls="example-details-panel"
        id="example-details-tab"
      >
        Details
      </button>
    </div>
  );
};

// tablist is the container for tabs.
//
// Tabs normally have associated tabpanel elements.
//
// A complete tabs implementation also requires the appropriate keyboard
// interaction, focus behavior, selection behavior, and panel relationships.

// ---------------------------------------------------------------------
// 22. Tabpanel role
// ---------------------------------------------------------------------

export const TabPanelExample = (): ReactElement => {
  return (
    <div role="tabpanel" id="example-overview-panel" aria-labelledby="example-overview-tab" tabIndex={0}>
      <h2>Overview</h2>
      <p>Example overview content.</p>
    </div>
  );
};

// A tabpanel contains the content associated with a tab.
//
// aria-labelledby establishes the relationship between the panel and
// its controlling tab.

// ---------------------------------------------------------------------
// 23. Listbox and option roles
// ---------------------------------------------------------------------

export const ListboxExample = (): ReactElement => {
  return (
    <div role="listbox" aria-label="Example choices">
      <div role="option" aria-selected={true}>
        Example
      </div>

      <div role="option" aria-selected={false}>
        Other
      </div>
    </div>
  );
};

// listbox and option form a composite widget.
//
// A custom listbox requires keyboard interaction and selection behavior.
//
// For ordinary selection controls, a native select is usually simpler.

// ---------------------------------------------------------------------
// 24. Native select
// ---------------------------------------------------------------------

export const NativeSelect = (): ReactElement => {
  return (
    <label>
      Example choice
      <select defaultValue="example">
        <option value="example">Example</option>
        <option value="other">Other</option>
      </select>
    </label>
  );
};

// Native select should generally be preferred when it meets the product
// requirements.

// ---------------------------------------------------------------------
// 25. Combobox role
// ---------------------------------------------------------------------

export const ComboboxExample = (): ReactElement => {
  return (
    <div>
      <label htmlFor="example-combobox">Choose an example</label>

      <input
        id="example-combobox"
        role="combobox"
        aria-expanded={false}
        aria-controls="example-options"
        aria-autocomplete="list"
      />

      <div id="example-options" role="listbox" hidden>
        <div role="option">Example</div>
      </div>
    </div>
  );
};

// A combobox represents a control that manages a popup such as a listbox
// or grid.
//
// The role is part of a larger interaction pattern and should not be
// treated as a simple label that can be added without implementing the
// corresponding behavior.

// ---------------------------------------------------------------------
// 26. Menu role
// ---------------------------------------------------------------------

export const MenuExample = (): ReactElement => {
  return (
    <div role="menu" aria-label="Example actions">
      <button type="button" role="menuitem">
        Edit
      </button>

      <button type="button" role="menuitem">
        Delete
      </button>
    </div>
  );
};

// The menu pattern has specific interaction expectations.
//
// A navigation list should not automatically be implemented as a menu.
// The correct role depends on the interaction model and purpose of the
// interface.

// ---------------------------------------------------------------------
// 27. Tree roles
// ---------------------------------------------------------------------

export const TreeExample = (): ReactElement => {
  return (
    <div role="tree" aria-label="Example folders">
      <div role="treeitem" aria-expanded={true}>
        Example folder
      </div>
    </div>
  );
};

// A tree represents hierarchical interactive content.
//
// tree and treeitem require a complete interaction model for expanding,
// collapsing, focusing, and navigating through the hierarchy.

// ---------------------------------------------------------------------
// 28. Grid roles
// ---------------------------------------------------------------------

export const GridExample = (): ReactElement => {
  return (
    <div role="grid" aria-label="Example data">
      <div role="row">
        <div role="columnheader">Name</div>
        <div role="columnheader">Status</div>
      </div>

      <div role="row">
        <div role="gridcell">Example</div>
        <div role="gridcell">Active</div>
      </div>
    </div>
  );
};

// ARIA grid semantics are intended for interactive grid widgets.
//
// A normal non-interactive data table should generally use native table
// markup rather than an ARIA grid.

// ---------------------------------------------------------------------
// 29. Native table
// ---------------------------------------------------------------------

export const NativeTable = (): ReactElement => {
  return (
    <table>
      <caption>Example data</caption>

      <thead>
        <tr>
          <th scope="col">Name</th>
          <th scope="col">Status</th>
        </tr>
      </thead>

      <tbody>
        <tr>
          <td>Example</td>
          <td>Active</td>
        </tr>
      </tbody>
    </table>
  );
};

// Native table semantics are appropriate for ordinary tabular data.
//
// Do not replace a native table with grid roles simply because both
// interfaces visually contain rows and columns.

// ---------------------------------------------------------------------
// 30. Landmark roles
// ---------------------------------------------------------------------

// Landmark roles identify major regions that users may navigate between.
//
// Common landmark roles include:
//
// banner
// navigation
// main
// complementary
// contentinfo
// search
// form
// region
//
// Semantic HTML elements often provide these roles implicitly.

// ---------------------------------------------------------------------
// 31. Banner role
// ---------------------------------------------------------------------

export const BannerLandmark = (): ReactElement => {
  return (
    <header>
      <h1>Example site</h1>
    </header>
  );
};

// The header element can provide banner semantics when it represents the
// site's top-level header.
//
// Prefer the native header element rather than:
//
// <div role="banner">

// ---------------------------------------------------------------------
// 32. Navigation role
// ---------------------------------------------------------------------

export const NavigationLandmark = (): ReactElement => {
  return (
    <nav aria-label="Primary">
      <a href="/example">Home</a>
      <a href="/example/products">Products</a>
    </nav>
  );
};

// The nav element provides navigation landmark semantics.
//
// An accessible label is useful when multiple navigation landmarks need
// to be distinguished.

// ---------------------------------------------------------------------
// 33. Main role
// ---------------------------------------------------------------------

export const MainLandmark = (): ReactElement => {
  return (
    <main>
      <h1>Example page</h1>
      <p>Primary page content.</p>
    </main>
  );
};

// main provides the main landmark semantics natively.
//
// A document should normally have one main landmark representing its
// primary content.

// ---------------------------------------------------------------------
// 34. Complementary role
// ---------------------------------------------------------------------

export const ComplementaryLandmark = (): ReactElement => {
  return (
    <aside>
      <h2>Related information</h2>
      <p>Additional information about the example.</p>
    </aside>
  );
};

// aside provides complementary landmark semantics when it contains
// supporting content related to the main content.

// ---------------------------------------------------------------------
// 35. Contentinfo role
// ---------------------------------------------------------------------

export const ContentInfoLandmark = (): ReactElement => {
  return (
    <footer>
      <p>Example site.</p>
    </footer>
  );
};

// A page-level footer can provide contentinfo landmark semantics.
//
// Prefer the native footer element.

// ---------------------------------------------------------------------
// 36. Search role
// ---------------------------------------------------------------------

export const SearchLandmark = (): ReactElement => {
  return (
    <search>
      <label htmlFor="example-search">Search</label>

      <input id="example-search" type="search" />

      <button type="submit">Search</button>
    </search>
  );
};

// The search element provides native semantics for a search landmark.
//
// When multiple search regions exist, accessible labeling can distinguish
// their purposes.

// ---------------------------------------------------------------------
// 37. Form landmark
// ---------------------------------------------------------------------

export const FormLandmark = (): ReactElement => {
  return (
    <form aria-labelledby="example-form-title">
      <h2 id="example-form-title">Contact information</h2>

      <label htmlFor="example-email">Email</label>

      <input id="example-email" type="email" />

      <button type="submit">Submit</button>
    </form>
  );
};

// A form can function as a landmark when it has an accessible name.
//
// Native form semantics should be preferred over a generic element with
// role="form".

// ---------------------------------------------------------------------
// 38. Region role
// ---------------------------------------------------------------------

export const RegionLandmark = (): ReactElement => {
  return (
    <section aria-labelledby="example-region-title">
      <h2 id="example-region-title">Important information</h2>

      <p>Example supporting content.</p>
    </section>
  );
};

// A named section can expose region semantics when it represents an
// important navigable section.
//
// Not every section should become a landmark.

// ---------------------------------------------------------------------
// 39. Document structure roles
// ---------------------------------------------------------------------

// Document structure roles describe the structure of content.
//
// Examples include:
//
// article
// cell
// columnheader
// definition
// figure
// heading
// list
// listitem
// row
// rowgroup
// table
//
// Many of these have equivalent semantic HTML elements and should be
// implemented with those elements instead.

// ---------------------------------------------------------------------
// 40. Article role
// ---------------------------------------------------------------------

export const ArticleStructure = (): ReactElement => {
  return (
    <article>
      <h2>Example article</h2>
      <p>Example article content.</p>
    </article>
  );
};

// article already provides article semantics.
//
// Prefer:
//
// <article>
//
// over:
//
// <div role="article">

// ---------------------------------------------------------------------
// 41. Heading role
// ---------------------------------------------------------------------

export const HeadingStructure = (): ReactElement => {
  return <h2>Example section</h2>;
};

// Native heading elements provide heading semantics and document
// hierarchy.
//
// A custom heading role would additionally require aria-level.

// ---------------------------------------------------------------------
// 42. Native list structure
// ---------------------------------------------------------------------

export const ListStructure = (): ReactElement => {
  return (
    <ul>
      <li>Example</li>
      <li>Other</li>
    </ul>
  );
};

// Native list markup communicates list structure without manually adding
// list and listitem roles.

// ---------------------------------------------------------------------
// 43. Figure role
// ---------------------------------------------------------------------

export const FigureStructure = (): ReactElement => {
  return (
    <figure>
      <img src="/example-image.jpg" alt="Example landscape" />
      <figcaption>Example landscape.</figcaption>
    </figure>
  );
};

// The native figure element provides figure semantics.
//
// Prefer native HTML when an equivalent element exists.

// ---------------------------------------------------------------------
// 44. Table structure roles
// ---------------------------------------------------------------------

export const TableStructure = (): ReactElement => {
  return (
    <table>
      <thead>
        <tr>
          <th scope="col">Name</th>
          <th scope="col">Status</th>
        </tr>
      </thead>

      <tbody>
        <tr>
          <td>Example</td>
          <td>Active</td>
        </tr>
      </tbody>
    </table>
  );
};

// Native table markup already communicates table, row, and cell semantics.
//
// ARIA table roles should not be added to ordinary HTML tables without a
// specific semantic reason.

// ---------------------------------------------------------------------
// 45. Live region roles
// ---------------------------------------------------------------------

// Live region roles describe content that can change dynamically.
//
// Common live region roles include:
//
// alert
// log
// status
// timer
// marquee
//
// These roles affect how assistive technologies may be notified about
// changes to their content.

// ---------------------------------------------------------------------
// 46. Status role
// ---------------------------------------------------------------------

export const StatusRole = ({ message }: { readonly message: string }): ReactElement => {
  return <div role="status">{message}</div>;
};

// status is appropriate for advisory information that is not generally
// important enough to interrupt the user.

// ---------------------------------------------------------------------
// 47. Alert role
// ---------------------------------------------------------------------

export const AlertRole = ({ message }: { readonly message: string }): ReactElement => {
  return <div role="alert">{message}</div>;
};

// alert is intended for important, usually time-sensitive information.
//
// It should not be used for every ordinary status update because excessive
// announcements can interrupt users.

// ---------------------------------------------------------------------
// 48. Log role
// ---------------------------------------------------------------------

export const LogRole = ({ entries }: { readonly entries: readonly string[] }): ReactElement => {
  return (
    <div role="log" aria-label="Example activity">
      {entries.map((entry) => (
        <p key={entry}>{entry}</p>
      ))}
    </div>
  );
};

// A log represents a sequential record of additions such as an activity
// feed or chat-like stream.

// ---------------------------------------------------------------------
// 49. Timer role
// ---------------------------------------------------------------------

export const TimerRole = ({ seconds }: { readonly seconds: number }): ReactElement => {
  return (
    <div role="timer" aria-label="Time remaining">
      {seconds} seconds
    </div>
  );
};

// timer represents a numerical counter showing elapsed or remaining time.
//
// A timer should be used when the content genuinely represents a timer,
// not simply because a number changes.

// ---------------------------------------------------------------------
// 50. Window roles
// ---------------------------------------------------------------------

// Window roles represent sub-windows within the current page.
//
// The primary window roles are:
//
// dialog
// alertdialog
//
// These roles identify the semantic type of the window, but do not
// automatically implement modal interaction.

// ---------------------------------------------------------------------
// 51. Dialog versus alertdialog
// ---------------------------------------------------------------------

export interface DialogRoleComparison {
  readonly dialog: string;
  readonly alertdialog: string;
}

export const dialogRoleComparison: DialogRoleComparison = {
  dialog: "A dialog contains a distinct interaction or piece of content.",
  alertdialog: "An alert dialog communicates an important message and requires a response.",
};

// The distinction is based on the purpose of the window.
//
// The role should accurately reflect the interaction being implemented.

// ---------------------------------------------------------------------
// 52. Application role
// ---------------------------------------------------------------------

export const ApplicationRoleWarning = (): ReactElement => {
  return (
    <div>
      <h1>Example application</h1>
      <p>Standard web application content.</p>
    </div>
  );
};

// The application role is specialized and should not be added simply
// because a page is built with JavaScript or React.
//
// Most web applications should continue to expose normal document and
// widget semantics.

// ---------------------------------------------------------------------
// 53. Presentation and none roles
// ---------------------------------------------------------------------

export const PresentationalImage = (): ReactElement => {
  return <img src="/example-decoration.svg" alt="" />;
};

// presentation and none can remove an element's own semantics in
// appropriate situations.
//
// They should not be used as a generic way to hide meaningful content.

// ---------------------------------------------------------------------
// 54. Abstract roles
// ---------------------------------------------------------------------

// Abstract roles exist for organizing the ARIA role model.
//
// They are not intended to be placed directly in author markup.
//
// Examples include:
//
// command
// composite
// input
// landmark
// range
// roletype
// section
// structure
// widget
// window
//
// Application code should use concrete author-facing roles instead.

// ---------------------------------------------------------------------
// 55. Do not use abstract roles
// ---------------------------------------------------------------------

export const ConcreteRoleExample = (): ReactElement => {
  return <div role="status">Example status.</div>;
};

// Use a concrete role such as status rather than an abstract superclass
// such as widget or structure.

// ---------------------------------------------------------------------
// 56. Role inheritance
// ---------------------------------------------------------------------

export interface RoleRelationship {
  readonly role: string;
  readonly conceptualSuperclass: string;
}

export const roleRelationships: readonly RoleRelationship[] = [
  {
    role: "button",
    conceptualSuperclass: "widget",
  },
  {
    role: "tab",
    conceptualSuperclass: "widget",
  },
  {
    role: "dialog",
    conceptualSuperclass: "window",
  },
  {
    role: "main",
    conceptualSuperclass: "landmark",
  },
  {
    role: "navigation",
    conceptualSuperclass: "landmark",
  },
];

// The ARIA specification organizes roles into a hierarchy.
//
// Superclass relationships are part of the ARIA role model and help define
// which states and properties apply to particular roles.

// ---------------------------------------------------------------------
// 57. Required context
// ---------------------------------------------------------------------

export const TabWithContext = (): ReactElement => {
  return (
    <div role="tablist" aria-label="Example">
      <button type="button" role="tab" aria-selected={true}>
        Example
      </button>
    </div>
  );
};

// Some roles are meaningful only in the context of related roles.
//
// A tab belongs within a tablist pattern.
//
// Role correctness therefore depends on more than the role attribute
// itself.

// ---------------------------------------------------------------------
// 58. Required owned elements
// ---------------------------------------------------------------------

export const ListboxWithOptions = (): ReactElement => {
  return (
    <div role="listbox" aria-label="Example choices">
      <div role="option">Example</div>

      <div role="option">Other</div>
    </div>
  );
};

// Composite roles can establish relationships with their descendant
// roles.
//
// Implementations must follow the semantics and structural requirements
// of the chosen ARIA pattern.

// ---------------------------------------------------------------------
// 59. Role-dependent states
// ---------------------------------------------------------------------

export const CheckboxState = ({ checked }: { readonly checked: boolean }): ReactElement => {
  return (
    <span role="checkbox" aria-checked={checked} tabIndex={0}>
      Receive notifications
    </span>
  );
};

// Some roles require particular states or properties.
//
// For a checkbox role, aria-checked communicates the current checked
// state.

// ---------------------------------------------------------------------
// 60. Roles do not automatically add states
// ---------------------------------------------------------------------

export const IncompleteCheckboxRole = (): ReactElement => {
  return (
    <span role="checkbox" tabIndex={0}>
      Receive notifications
    </span>
  );
};

// The role alone does not communicate whether the checkbox is checked.
//
// A custom checkbox must expose the state required by its role and keep
// that state synchronized with the interface.

// ---------------------------------------------------------------------
// 61. Role and accessible name
// ---------------------------------------------------------------------

export const NamedRole = (): ReactElement => {
  return (
    <button type="button" aria-label="Open settings">
      ⚙
    </button>
  );
};

// A role identifies the type of control.
//
// An accessible name identifies the particular control.
//
// Interactive controls generally need an appropriate accessible name.

// ---------------------------------------------------------------------
// 62. Landmark naming
// ---------------------------------------------------------------------

export const NamedLandmarks = (): ReactElement => {
  return (
    <>
      <nav aria-label="Primary">
        <a href="/example">Home</a>
      </nav>

      <nav aria-label="Account">
        <a href="/example/profile">Profile</a>
      </nav>
    </>
  );
};

// Multiple landmarks of the same type should be distinguishable when
// necessary.
//
// aria-label or aria-labelledby can provide that distinction.

// ---------------------------------------------------------------------
// 63. Role does not replace an accessible name
// ---------------------------------------------------------------------

export const UnnamedDialog = (): ReactElement => {
  return (
    <div role="dialog">
      <p>Example dialog content.</p>
    </div>
  );
};

// The dialog role identifies the type of container.
//
// The dialog still needs an appropriate accessible name when the pattern
// requires one, commonly through aria-labelledby or aria-label.

// ---------------------------------------------------------------------
// 64. Avoid role conflicts
// ---------------------------------------------------------------------

export const AvoidConflictingRoles = (): ReactElement => {
  return <button type="button">Save</button>;
};

// Do not assign an unrelated role to a native element simply to alter
// how it is announced.
//
// Choose an element whose native semantics match the intended role.

// ---------------------------------------------------------------------
// 65. Roles should match the actual interface
// ---------------------------------------------------------------------

export const ActualButton = (): ReactElement => {
  return <button type="button">Delete</button>;
};

// The semantic role should describe what the element actually does.
//
// Do not choose roles based only on visual appearance.

// ---------------------------------------------------------------------
// 66. Navigation is not a menu
// ---------------------------------------------------------------------

export const NavigationNotMenu = (): ReactElement => {
  return (
    <nav aria-label="Primary">
      <a href="/example">Home</a>
      <a href="/example/products">Products</a>
      <a href="/example/contact">Contact</a>
    </nav>
  );
};

// Ordinary site navigation should normally use nav and links.
//
// The menu role represents a different interaction pattern with different
// keyboard and focus expectations.

// ---------------------------------------------------------------------
// 67. Table is not grid
// ---------------------------------------------------------------------

export const DataTableNotGrid = (): ReactElement => {
  return (
    <table>
      <thead>
        <tr>
          <th scope="col">Product</th>
          <th scope="col">Price</th>
        </tr>
      </thead>

      <tbody>
        <tr>
          <td>Example</td>
          <td>$10</td>
        </tr>
      </tbody>
    </table>
  );
};

// A static data table should use native table semantics.
//
// grid is an interactive composite role and should not be selected simply
// because the data visually appears in rows and columns.

// ---------------------------------------------------------------------
// 68. Dialog is not just a styled container
// ---------------------------------------------------------------------

export const DialogContainer = (): ReactElement => {
  return (
    <div role="dialog" aria-labelledby="example-dialog-heading">
      <h2 id="example-dialog-heading">Example dialog</h2>

      <button type="button">Close</button>
    </div>
  );
};

// Styling a div to look like a modal does not make it a dialog.
//
// If dialog semantics are used, the complete dialog interaction model
// must also be implemented.

// ---------------------------------------------------------------------
// 69. Feed role
// ---------------------------------------------------------------------

export const FeedExample = (): ReactElement => {
  return (
    <div role="feed" aria-label="Example articles">
      <article aria-posinset={1} aria-setsize={2}>
        <h2>Example article</h2>
        <p>Example article content.</p>
      </article>

      <article aria-posinset={2} aria-setsize={2}>
        <h2>Another article</h2>
        <p>Another article.</p>
      </article>
    </div>
  );
};

// A feed represents a dynamic stream of articles that can be extended as
// the user scrolls.
//
// It is not simply another name for an ordinary list of articles.

// ---------------------------------------------------------------------
// 70. Toolbar role
// ---------------------------------------------------------------------

export const ToolbarExample = (): ReactElement => {
  return (
    <div role="toolbar" aria-label="Text formatting">
      <button type="button">Bold</button>

      <button type="button">Italic</button>
    </div>
  );
};

// toolbar groups a set of commonly used controls into a compact
// interactive collection.
//
// The controls themselves retain their appropriate semantics.

// ---------------------------------------------------------------------
// 71. Tooltip role
// ---------------------------------------------------------------------

export const TooltipExample = (): ReactElement => {
  return (
    <div>
      <button type="button" aria-describedby="example-tooltip">
        Save
      </button>

      <div id="example-tooltip" role="tooltip">
        Save your changes.
      </div>
    </div>
  );
};

// tooltip identifies supplementary contextual information associated with
// another element.
//
// The tooltip role does not itself implement the visibility, positioning,
// timing, or interaction behavior of a tooltip.

// ---------------------------------------------------------------------
// 72. Img role
// ---------------------------------------------------------------------

export const SvgImageRole = (): ReactElement => {
  return (
    <svg role="img" aria-label="Example logo" viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="40" />
    </svg>
  );
};

// The img role can identify an SVG or collection of elements as a single
// image-like semantic object.
//
// The accessible name should communicate the meaningful image content.

// ---------------------------------------------------------------------
// 73. Presentation role
// ---------------------------------------------------------------------

export const DecorativePresentation = (): ReactElement => {
  return (
    <span role="presentation" aria-hidden="true">
      *
    </span>
  );
};

// Presentational semantics can be appropriate for genuinely decorative
// content.
//
// Do not use presentation or aria-hidden to suppress information that
// users need.

// ---------------------------------------------------------------------
// 74. Role and native semantics
// ---------------------------------------------------------------------

export interface RoleDecision {
  readonly requirement: string;
  readonly preferredApproach: string;
}

export const roleDecisions: readonly RoleDecision[] = [
  {
    requirement: "A standard button",
    preferredApproach: "Use <button>.",
  },
  {
    requirement: "A standard checkbox",
    preferredApproach: 'Use <input type="checkbox">.',
  },
  {
    requirement: "A standard text input",
    preferredApproach: "Use <input> or <textarea>.",
  },
  {
    requirement: "A standard data table",
    preferredApproach: "Use <table>.",
  },
  {
    requirement: "Primary page content",
    preferredApproach: "Use <main>.",
  },
  {
    requirement: "Site navigation",
    preferredApproach: "Use <nav>.",
  },
  {
    requirement: "Supporting content",
    preferredApproach: "Use <aside>.",
  },
];

// Native HTML should be the starting point for role decisions.
//
// ARIA is most useful when the required semantic pattern is not already
// adequately represented by native HTML.

// ---------------------------------------------------------------------
// 75. Custom widgets and role responsibilities
// ---------------------------------------------------------------------

export interface CustomWidgetResponsibilities {
  readonly correctRole: boolean;
  readonly accessibleName: boolean;
  readonly requiredStates: boolean;
  readonly keyboardBehavior: boolean;
  readonly focusBehavior: boolean;
  readonly stateSynchronization: boolean;
}

export const customWidgetResponsibilities: CustomWidgetResponsibilities = {
  correctRole: true,
  accessibleName: true,
  requiredStates: true,
  keyboardBehavior: true,
  focusBehavior: true,
  stateSynchronization: true,
};

// A custom ARIA widget is a complete accessibility implementation.
//
// Adding a role is only one part of that implementation.

// ---------------------------------------------------------------------
// 76. Role testing
// ---------------------------------------------------------------------

export const roleTestingChecklist = [
  "Does the role accurately describe the element?",
  "Could an appropriate native HTML element provide the same semantics?",
  "Does the role have required states or properties?",
  "Are required child or parent roles present?",
  "Does the control have an accessible name when required?",
  "Does the widget implement the expected keyboard behavior?",
  "Does focus behavior match the widget pattern?",
  "Does the role remain synchronized with the current UI state?",
] as const;

// Role testing should examine semantics and behavior together.
//
// Checking only whether role="..." exists is insufficient.

// ---------------------------------------------------------------------
// 77. Common role mistakes
// ---------------------------------------------------------------------

export const commonRoleMistakes = [
  "Using ARIA when native HTML already provides the required semantics",
  'Adding role="button" to a div without implementing button behavior',
  "Using menu roles for ordinary site navigation",
  "Using grid roles for ordinary data tables",
  "Using abstract roles in author markup",
  "Using an unrelated role to change how an element is announced",
  "Using a role without its required states or properties",
  "Using a composite role without its required related roles",
  "Creating an unnamed interactive control",
  "Allowing role information to become inconsistent with the actual UI",
] as const;

// A syntactically valid role can still be semantically or behaviorally
// incorrect.

// ---------------------------------------------------------------------
// 78. Integrated role example
// ---------------------------------------------------------------------

export interface AccessibleRoleExampleProps {
  readonly expanded: boolean;
  readonly onToggle: () => void;
}

export const AccessibleRoleExample = ({ expanded, onToggle }: AccessibleRoleExampleProps): ReactElement => {
  return (
    <main>
      <header>
        <h1>Example settings</h1>
      </header>

      <nav aria-label="Primary">
        <a href="/example">Home</a>
        <a href="/example/settings">Settings</a>
      </nav>

      <section aria-labelledby="details-heading">
        <h2 id="details-heading">Details</h2>

        <button type="button" aria-expanded={expanded} aria-controls="details-panel" onClick={onToggle}>
          {expanded ? "Hide details" : "Show details"}
        </button>

        <div id="details-panel" hidden={!expanded}>
          <p>Example settings information.</p>
        </div>
      </section>

      <aside aria-labelledby="help-heading">
        <h2 id="help-heading">Help</h2>
        <p>Example help information.</p>
      </aside>

      <footer>
        <p>Example site.</p>
      </footer>
    </main>
  );
};

// This example relies primarily on native HTML roles:
//
// main
// banner
// navigation
// heading
// region
// button
// complementary
// contentinfo
//
// ARIA is added only where additional semantics are useful, such as
// aria-expanded, aria-controls, and landmark labeling.

// ---------------------------------------------------------------------
// 79. Role decision process
// ---------------------------------------------------------------------

export const roleDecisionProcess = [
  "Identify what the element actually represents.",
  "Choose the native HTML element that provides that meaning when possible.",
  "Use an ARIA role only when the required semantic pattern needs it.",
  "Check whether the role requires states, properties, or related roles.",
  "Provide an accessible name when the role requires or benefits from one.",
  "Implement the complete interaction behavior for custom widgets.",
  "Keep role-related state synchronized with the actual interface.",
  "Test the resulting accessibility tree and keyboard interaction.",
] as const;

// The role decision process starts with semantics, not visual appearance.
//
// A component should not receive a role merely because its visual design
// resembles another type of control.

// ---------------------------------------------------------------------
// 80. Final role model
// ---------------------------------------------------------------------

export interface AriaRoleModel {
  readonly rolesDescribeSemanticType: boolean;
  readonly nativeHtmlIsPreferred: boolean;
  readonly customRolesRequireBehavior: boolean;
  readonly statesAndPropertiesRemainRelevant: boolean;
  readonly CompositeRolesRequireRelationships: boolean;
  readonly landmarksSupportNavigation: boolean;
  readonly liveRolesCommunicateDynamicContent: boolean;
  readonly abstractRolesAreNotAuthorMarkup: boolean;
}

export const ariaRoleModel: AriaRoleModel = {
  rolesDescribeSemanticType: true,
  nativeHtmlIsPreferred: true,
  customRolesRequireBehavior: true,
  statesAndPropertiesRemainRelevant: true,
  CompositeRolesRequireRelationships: true,
  landmarksSupportNavigation: true,
  liveRolesCommunicateDynamicContent: true,
  abstractRolesAreNotAuthorMarkup: true,
};

// ARIA roles form a semantic vocabulary for accessibility APIs.
//
// Correct role usage means choosing the right semantic type, satisfying
// the role's relationships and states, and implementing the behavior
// required by the corresponding interaction pattern.

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - An ARIA role communicates the semantic type of an element to the accessibility layer.
// - Native HTML elements already provide many implicit roles and should generally be preferred.
// - Adding a role does not turn one HTML element into another or provide the other element's native behavior.
// - Widget roles describe interactive controls such as buttons, checkboxes, radios, sliders, switches, tabs, and textboxes.
// - Composite roles describe widgets made from related interactive elements, such as tablists, listboxes, menus, trees, grids, and comboboxes.
// - Landmark roles identify major navigational regions such as main, navigation, complementary, banner, contentinfo, search, form, and region.
// - Document structure roles describe structural content, but many have equivalent native HTML elements that should be preferred.
// - Live region roles such as status, alert, log, and timer communicate different types of dynamic content.
// - Window roles include dialog and alertdialog and identify dialog-like interface regions.
// - Abstract roles are part of the ARIA role model but are not intended for use directly in author markup.
// - Roles can have required states, properties, parent roles, child roles, or other relationships.
// - A role must accurately describe the actual interface rather than its visual appearance.
// - Navigation should not be given menu semantics merely because it contains links.
// - Ordinary data tables should use table semantics rather than grid roles.
// - Custom ARIA widgets require complete keyboard, focus, interaction, and state behavior.
// - Accessible names and role-specific states or properties are separate requirements from the role itself.
// - Landmark labels can distinguish multiple landmarks with the same role when necessary.
// - The safest role strategy is to use native HTML first, add ARIA only where necessary, and keep semantics synchronized with the actual interface.
