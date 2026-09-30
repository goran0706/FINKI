/**
 * Keyboard Navigation
 * ====================
 *
 * Keyboard navigation allows users to operate and move through an interface without
 * relying on a mouse or other pointing device. Accessible keyboard interaction depends
 * on native interactive elements, logical focus order, visible focus indication, complete
 * keyboard behavior, and appropriate focus management for custom widgets.
 *
 * React does not provide keyboard accessibility automatically. The rendered HTML,
 * event handling, focus management, and component behavior must together provide an
 * interface that can be operated with a keyboard.
 */

// ---------------------------------------------------------------------
// Imports
// ---------------------------------------------------------------------

import { type FC, type KeyboardEvent, type ReactElement, useRef, useState } from "react";

// ---------------------------------------------------------------------
// 1. Keyboard accessibility
// ---------------------------------------------------------------------

// All functionality should be operable with a keyboard unless the
// interaction fundamentally requires a type of input that cannot be
// performed through a keyboard.
//
// Keyboard accessibility benefits people who:
// - cannot use a mouse;
// - prefer keyboard interaction;
// - use switch or alternative input devices;
// - use screen readers or other assistive technologies.

export const KeyboardAccessibleInterface: FC = (): ReactElement => {
  return (
    <main>
      <h1>Account settings</h1>

      <button type="button">Save changes</button>

      <a href="/profile">View profile</a>
    </main>
  );
};

// Native links and buttons already provide keyboard interaction.

// ---------------------------------------------------------------------
// 2. Native controls provide keyboard behavior
// ---------------------------------------------------------------------

// Native interactive elements should be preferred because the browser
// provides their keyboard semantics and behavior.
//
// Common examples include:
//
// <button>
// <a href="...">
// <input>
// <select>
// <textarea>
// <summary>

export const NativeKeyboardControls: FC = (): ReactElement => {
  return (
    <form>
      <label htmlFor="name">Name</label>

      <input id="name" name="name" />

      <button type="submit">Save</button>
    </form>
  );
};

// Replacing these elements with generic containers creates additional
// accessibility responsibilities.

// ---------------------------------------------------------------------
// 3. The Tab key
// ---------------------------------------------------------------------

// Tab normally moves keyboard focus forward through sequentially
// focusable elements.
//
// Shift+Tab moves focus backward.

export const TabOrderExample: FC = (): ReactElement => {
  return (
    <div>
      <a href="/profile">Profile</a>

      <button type="button">Save</button>

      <input aria-label="Search" type="search" />
    </div>
  );
};

// The default sequential order follows the document's logical focus order.

// ---------------------------------------------------------------------
// 4. Document source order affects focus order
// ---------------------------------------------------------------------

// For ordinary page navigation, the DOM should be structured so that
// sequential focus follows a meaningful order.
//
// This avoids forcing developers to manually reorder focus with
// positive tabindex values.

export const LogicalFocusOrder: FC = (): ReactElement => {
  return (
    <main>
      <h1>Checkout</h1>

      <label htmlFor="email">Email</label>

      <input id="email" type="email" />

      <label htmlFor="address">Address</label>

      <input id="address" type="text" />

      <button type="submit">Continue</button>
    </main>
  );
};

// The focus sequence follows the same logical progression as the content.

// ---------------------------------------------------------------------
// 5. Focus order must preserve meaning
// ---------------------------------------------------------------------

// WCAG requires sequential focus order to preserve meaning and
// operability when the order affects understanding or operation. :contentReference[oaicite:0]{index=0}
//
// A keyboard user should not unexpectedly move from one part of a task
// to an unrelated part of the page.

export const MeaningfulFocusOrder: FC = (): ReactElement => {
  return (
    <section>
      <h2>Shipping information</h2>

      <label htmlFor="street">Street</label>

      <input id="street" />

      <label htmlFor="city">City</label>

      <input id="city" />

      <button type="button">Continue</button>
    </section>
  );
};

// ---------------------------------------------------------------------
// 6. Do not use positive tabindex values
// ---------------------------------------------------------------------

// tabindex="0" participates in the normal document-based tab order.
// tabindex="-1" allows programmatic focus without adding the element to
// sequential Tab navigation.
//
// Positive tabindex values create a separate author-defined order and
// should generally be avoided.

export const RecommendedTabIndex: FC = (): ReactElement => {
  return (
    <div>
      <button type="button" tabIndex={0}>
        Action
      </button>

      <div tabIndex={-1}>Programmatically focusable content</div>
    </div>
  );
};

// Native interactive elements normally do not need tabindex={0}.
// It is shown here to demonstrate the value's semantics.

// ---------------------------------------------------------------------
// 7. tabindex="-1"
// ---------------------------------------------------------------------

// tabindex="-1" removes an element from sequential Tab navigation while
// allowing it to receive focus programmatically.
//
// This is useful for focus targets such as dialog containers, headings,
// error summaries, and items in composite widgets.

export const ProgrammaticFocusTarget: FC = (): ReactElement => {
  const headingRef = useRef<HTMLHeadingElement>(null);

  const focusHeading = (): void => {
    headingRef.current?.focus();
  };

  return (
    <section>
      <button type="button" onClick={focusHeading}>
        Focus heading
      </button>

      <h2 ref={headingRef} tabIndex={-1}>
        Account information
      </h2>
    </section>
  );
};

// tabindex="-1" does not make the heading part of the normal Tab sequence.

// ---------------------------------------------------------------------
// 8. Avoid making static content tabbable
// ---------------------------------------------------------------------

// tabindex should not be added to ordinary content merely to make it
// reachable by Tab.
//
// Keyboard focus should generally be reserved for interactive elements
// and deliberate programmatic focus targets.

export const InteractiveContent: FC = (): ReactElement => {
  return (
    <section>
      <h2>Account</h2>

      <p>Manage your account information.</p>

      <button type="button">Edit account</button>
    </section>
  );
};

// The heading and paragraph are available through the document structure
// without becoming additional Tab stops.

// ---------------------------------------------------------------------
// 9. Clickable elements must be keyboard accessible
// ---------------------------------------------------------------------

// If an interface provides an action through a pointer, the same
// functionality should be available through the keyboard.
//
// The simplest solution is to use the native element representing the
// interaction.

export const KeyboardAction: FC = (): ReactElement => {
  return <button type="button">Delete item</button>;
};

// Avoid using a clickable div when a button provides the required behavior.

// ---------------------------------------------------------------------
// 10. Do not use div as a button
// ---------------------------------------------------------------------

// A div does not provide native button semantics, focus behavior, or
// keyboard activation.
//
// Adding an onClick handler does not turn it into a button.

export const NativeAction: FC = (): ReactElement => {
  return (
    <button
      type="button"
      onClick={() => {
        // Perform the action.
      }}
    >
      Delete item
    </button>
  );
};

// Native semantics provide a substantially smaller implementation surface.

// ---------------------------------------------------------------------
// 11. Custom controls require keyboard behavior
// ---------------------------------------------------------------------

// When a custom widget is genuinely necessary, the author must provide
// the keyboard interaction expected by that widget's semantics.
//
// Adding tabindex alone only makes an element focusable.
// It does not implement activation or navigation behavior.

export const CustomControl: FC = (): ReactElement => {
  const [selected, setSelected] = useState(false);

  return (
    <div role="button" tabIndex={0} aria-pressed={selected} onClick={() => setSelected((current) => !current)}>
      {selected ? "Selected" : "Select"}
    </div>
  );
};

// This example is still incomplete because keyboard activation has not
// been implemented. Prefer a native button whenever possible.

// ---------------------------------------------------------------------
// 12. Keyboard activation for a custom button
// ---------------------------------------------------------------------

// If a custom button is unavoidable, its keyboard behavior must match
// the intended button interaction.
//
// Enter and Space are important activation keys for button-like controls.

export const CustomButton: FC = (): ReactElement => {
  const [selected, setSelected] = useState(false);

  const activate = (): void => {
    setSelected((current) => !current);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>): void => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      activate();
    }
  };

  return (
    <div role="button" tabIndex={0} aria-pressed={selected} onClick={activate} onKeyDown={handleKeyDown}>
      {selected ? "Selected" : "Select"}
    </div>
  );
};

// The same action is shared by pointer and keyboard interaction.
//
// In production code, a native <button> remains preferable.

// ---------------------------------------------------------------------
// 13. Keyboard events should use semantic keys
// ---------------------------------------------------------------------

// KeyboardEvent.key identifies the logical key that was pressed.
//
// Prefer event.key values such as:
//
// "Enter"
// "Escape"
// "ArrowUp"
// "ArrowDown"
// "ArrowLeft"
// "ArrowRight"
// " "

export const KeyboardKeyHandling: FC = (): ReactElement => {
  const [message, setMessage] = useState("");

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>): void => {
    if (event.key === "Escape") {
      setMessage("Cancelled.");
    }
  };

  return (
    <div tabIndex={0} onKeyDown={handleKeyDown}>
      <p>{message}</p>
    </div>
  );
};

// Key values describe the user's intended key rather than depending on
// a physical keyboard layout.

// ---------------------------------------------------------------------
// 14. Enter and Space are not interchangeable everywhere
// ---------------------------------------------------------------------

// Keyboard behavior depends on the widget's semantics.
//
// For example, native buttons support activation through Enter and Space,
// while links have different activation behavior.
//
// Custom widgets should follow the interaction pattern appropriate to
// their role rather than treating every key as equivalent.

export const NativeButtonActivation: FC = (): ReactElement => {
  return <button type="button">Submit</button>;
};

// Native controls are preferable because their keyboard behavior is
// already defined by the browser.

// ---------------------------------------------------------------------
// 15. Escape commonly closes temporary UI
// ---------------------------------------------------------------------

// Many interactive patterns use Escape to dismiss a temporary context,
// such as a dialog or popup.
//
// The component must also restore focus appropriately when the temporary
// context closes.

export const EscapeToClose: FC = (): ReactElement => {
  const [open, setOpen] = useState(false);

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>): void => {
    if (event.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <div>
      <button type="button" onClick={() => setOpen(true)}>
        Open panel
      </button>

      {open && (
        <div role="dialog" aria-labelledby="panel-title" onKeyDown={handleKeyDown}>
          <h2 id="panel-title">Example panel</h2>

          <button type="button" onClick={() => setOpen(false)}>
            Close
          </button>
        </div>
      )}
    </div>
  );
};

// A production dialog also needs complete focus management.

// ---------------------------------------------------------------------
// 16. Focus is different from visibility
// ---------------------------------------------------------------------

// A visually visible element is not necessarily the current keyboard
// focus target.
//
// The browser maintains focus separately from visual rendering.

export const FocusTarget: FC = (): ReactElement => {
  const inputRef = useRef<HTMLInputElement>(null);

  const focusInput = (): void => {
    inputRef.current?.focus();
  };

  return (
    <div>
      <button type="button" onClick={focusInput}>
        Focus search
      </button>

      <input ref={inputRef} type="search" aria-label="Search" />
    </div>
  );
};

// element.focus() moves programmatic focus to a focusable element.

// ---------------------------------------------------------------------
// 17. document.activeElement
// ---------------------------------------------------------------------

// document.activeElement identifies the element that currently has focus
// within the document.
//
// It can be useful when debugging or implementing focus-management logic.

export const ActiveElementExample: FC = (): ReactElement => {
  const reportFocus = (): void => {
    const activeElement = document.activeElement;

    console.log(activeElement);
  };

  return (
    <button type="button" onClick={reportFocus}>
      Inspect focused element
    </button>
  );
};

// The browser determines which element is focused.
// Do not dispatch a synthetic focus event to move focus; use element.focus().

// ---------------------------------------------------------------------
// 18. Visible focus indication
// ---------------------------------------------------------------------

// Keyboard users need to see where focus is currently located.
//
// Focus styles should remain visible and sufficiently distinguishable.

export const FocusIndicator: FC = (): ReactElement => {
  return (
    <button type="button" className="focusable-button">
      Save
    </button>
  );
};

// Example CSS:
//
// .focusable-button:focus-visible {
//     outline: 3px solid currentColor;
//     outline-offset: 2px;
// }
//
// Do not remove focus outlines without providing an equally usable
// replacement.

// ---------------------------------------------------------------------
// 19. :focus-visible
// ---------------------------------------------------------------------

// :focus-visible can be used to provide a prominent focus indicator when
// keyboard-style focus indication is appropriate.

export const FocusVisibleControl: FC = (): ReactElement => {
  return (
    <a className="focusable-link" href="/settings">
      Settings
    </a>
  );
};

// Example CSS:
//
// .focusable-link:focus-visible {
//     outline: 3px solid currentColor;
//     outline-offset: 2px;
// }

// ---------------------------------------------------------------------
// 20. Focus must not disappear behind content
// ---------------------------------------------------------------------

// WCAG 2.2 includes Focus Not Obscured (Minimum), which requires that
// keyboard focus not be entirely hidden by author-created content. :contentReference[oaicite:1]{index=1}
//
// Sticky headers, footers, dialogs, and overlays should therefore be
// designed so focused elements remain visible.

export const VisibleFocusedControl: FC = (): ReactElement => {
  return (
    <main>
      <h1>Settings</h1>

      <button type="button">Save changes</button>
    </main>
  );
};

// Focus visibility is part of the interaction design, not merely a
// decorative CSS detail.

// ---------------------------------------------------------------------
// 21. Skip links
// ---------------------------------------------------------------------

// A skip link allows keyboard users to bypass repeated navigation and
// move directly to the main content.

export const SkipLinkNavigation: FC = (): ReactElement => {
  return (
    <>
      <a href="#main-content">Skip to main content</a>

      <nav aria-label="Primary navigation">
        <a href="/">Home</a>

        <a href="/products">Products</a>

        <a href="/settings">Settings</a>
      </nav>

      <main id="main-content">
        <h1>Settings</h1>
      </main>
    </>
  );
};

// The target must exist and the skip link must itself be keyboard reachable.

// ---------------------------------------------------------------------
// 22. Keyboard traps
// ---------------------------------------------------------------------

// A keyboard trap occurs when a user enters an interface region but
// cannot leave it using the keyboard.
//
// WCAG requires a mechanism to move focus away from a component using
// the keyboard. :contentReference[oaicite:2]{index=2}

export const EscapableRegion: FC = (): ReactElement => {
  const [open, setOpen] = useState(false);

  return (
    <section>
      <button type="button" onClick={() => setOpen(true)}>
        Open panel
      </button>

      {open && (
        <div>
          <p>Temporary panel.</p>

          <button type="button" onClick={() => setOpen(false)}>
            Close panel
          </button>
        </div>
      )}
    </section>
  );
};

// The close control provides a keyboard-accessible way to leave the
// temporary context.

// ---------------------------------------------------------------------
// 23. Focus management for dynamic content
// ---------------------------------------------------------------------

// When React inserts new content, focus does not automatically move to
// the new element.
//
// Focus should be moved only when the interaction requires it.

export const DynamicFocus: FC = (): ReactElement => {
  const [submitted, setSubmitted] = useState(false);
  const messageRef = useRef<HTMLParagraphElement>(null);

  const submit = (): void => {
    setSubmitted(true);

    requestAnimationFrame(() => {
      messageRef.current?.focus();
    });
  };

  return (
    <section>
      <button type="button" onClick={submit}>
        Submit
      </button>

      {submitted && (
        <p ref={messageRef} tabIndex={-1}>
          Form submitted successfully.
        </p>
      )}
    </section>
  );
};

// A real application should decide whether moving focus improves the
// interaction rather than moving focus after every state change.

// ---------------------------------------------------------------------
// 24. Focus should not move unnecessarily
// ---------------------------------------------------------------------

// Many state updates do not require focus movement.
//
// For example, a status message can be announced through a live region
// while focus remains on the control that triggered the operation.

export const PreservedFocus: FC = (): ReactElement => {
  const [saved, setSaved] = useState(false);

  return (
    <div>
      <button type="button" onClick={() => setSaved(true)}>
        Save
      </button>

      <p role="status">{saved ? "Changes saved." : ""}</p>
    </div>
  );
};

// The button remains the logical focus target after the status changes.

// ---------------------------------------------------------------------
// 25. Focus restoration
// ---------------------------------------------------------------------

// When a temporary interface closes, focus should generally return to
// the element that opened it when that remains an appropriate target.

export const FocusRestoration: FC = (): ReactElement => {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const close = (): void => {
    setOpen(false);

    requestAnimationFrame(() => {
      triggerRef.current?.focus();
    });
  };

  return (
    <div>
      <button ref={triggerRef} type="button" onClick={() => setOpen(true)}>
        Open panel
      </button>

      {open && (
        <section aria-labelledby="panel-heading">
          <h2 id="panel-heading">Example panel</h2>

          <button type="button" onClick={close}>
            Close panel
          </button>
        </section>
      )}
    </div>
  );
};

// The focus restoration strategy depends on whether the original trigger
// still exists and remains an appropriate destination.

// ---------------------------------------------------------------------
// 26. Roving tabindex
// ---------------------------------------------------------------------

// Composite widgets can use roving tabindex so that only one descendant
// participates in the normal Tab sequence at a time.
//
// The active descendant receives tabindex="0"; other descendants receive
// tabindex="-1". :contentReference[oaicite:3]{index=3}

export const RovingTabIndex: FC = (): ReactElement => {
  const [activeIndex, setActiveIndex] = useState(0);
  const items = ["First", "Second", "Third"];

  const move = (index: number): void => {
    setActiveIndex(index);
  };

  return (
    <div role="toolbar" aria-label="Formatting tools">
      {items.map((item, index) => (
        <button key={item} type="button" tabIndex={activeIndex === index ? 0 : -1} onClick={() => move(index)}>
          {item}
        </button>
      ))}
    </div>
  );
};

// A complete roving-tabindex widget also moves focus and implements the
// arrow-key behavior defined by its specific interaction pattern.

// ---------------------------------------------------------------------
// 27. Arrow-key navigation
// ---------------------------------------------------------------------

// Composite widgets commonly use arrow keys to move within the widget
// after the widget itself has been entered through the Tab sequence.

export const ArrowKeyNavigation: FC = (): ReactElement => {
  const [activeIndex, setActiveIndex] = useState(0);
  const items = ["One", "Two", "Three"];

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>): void => {
    let nextIndex = activeIndex;

    if (event.key === "ArrowRight") {
      nextIndex = Math.min(activeIndex + 1, items.length - 1);
    }

    if (event.key === "ArrowLeft") {
      nextIndex = Math.max(activeIndex - 1, 0);
    }

    if (nextIndex !== activeIndex) {
      event.preventDefault();
      setActiveIndex(nextIndex);
    }
  };

  return (
    <div role="toolbar" aria-label="Actions">
      {items.map((item, index) => (
        <button key={item} type="button" tabIndex={activeIndex === index ? 0 : -1} onKeyDown={handleKeyDown}>
          {item}
        </button>
      ))}
    </div>
  );
};

// This demonstrates state management only; a production widget should
// also move DOM focus to the newly active control.

// ---------------------------------------------------------------------
// 28. Moving focus programmatically
// ---------------------------------------------------------------------

// When arrow-key navigation changes the active item, focus can be moved
// to the newly active element.

export const ManagedArrowNavigation: FC = (): ReactElement => {
  const [activeIndex, setActiveIndex] = useState(0);
  const buttonRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const items = ["One", "Two", "Three"];

  const moveTo = (index: number): void => {
    setActiveIndex(index);
    buttonRefs.current[index]?.focus();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>): void => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      moveTo(Math.min(activeIndex + 1, items.length - 1));
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      moveTo(Math.max(activeIndex - 1, 0));
    }
  };

  return (
    <div role="toolbar" aria-label="Actions">
      {items.map((item, index) => (
        <button
          key={item}
          ref={(element) => {
            buttonRefs.current[index] = element;
          }}
          type="button"
          tabIndex={activeIndex === index ? 0 : -1}
          onKeyDown={handleKeyDown}
        >
          {item}
        </button>
      ))}
    </div>
  );
};

// element.focus() moves the actual keyboard focus to the selected item.

// ---------------------------------------------------------------------
// 29. aria-activedescendant
// ---------------------------------------------------------------------

// An alternative to moving DOM focus is aria-activedescendant.
// The container retains focus while the attribute identifies the
// currently active descendant.
//
// This pattern is appropriate only for widgets whose roles and focus
// model support it.

export const ActiveDescendantExample: FC = (): ReactElement => {
  const [activeId, setActiveId] = useState("option-1");

  return (
    <div role="listbox" tabIndex={0} aria-activedescendant={activeId} aria-label="Choose an option">
      <div id="option-1" role="option" aria-selected={activeId === "option-1"} onClick={() => setActiveId("option-1")}>
        First option
      </div>

      <div id="option-2" role="option" aria-selected={activeId === "option-2"} onClick={() => setActiveId("option-2")}>
        Second option
      </div>
    </div>
  );
};

// With aria-activedescendant, keyboard handlers on the focused widget
// must update the active descendant and its visual state.

// ---------------------------------------------------------------------
// 30. Tab navigation inside composite widgets
// ---------------------------------------------------------------------

// Composite widgets often use one Tab stop for the widget and arrow keys
// for navigation inside it.
//
// This prevents the user from having to tab through every descendant.

export const CompositeWidget: FC = (): ReactElement => {
  return (
    <div role="toolbar" aria-label="Text formatting">
      <button type="button">Bold</button>

      <button type="button">Italic</button>

      <button type="button">Underline</button>
    </div>
  );
};

// If the widget implements a true composite keyboard pattern, its focus
// model should follow that pattern rather than treating every child as
// an independent page-level Tab stop.

// ---------------------------------------------------------------------
// 31. Tabs require widget-specific keyboard behavior
// ---------------------------------------------------------------------

// Tabs are a composite widget with defined keyboard conventions.
// Focus management and arrow-key behavior are part of the tab pattern.

export const TabsStructure: FC = (): ReactElement => {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div>
      <div role="tablist" aria-label="Product information">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "overview"}
          tabIndex={activeTab === "overview" ? 0 : -1}
          onClick={() => setActiveTab("overview")}
        >
          Overview
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "details"}
          tabIndex={activeTab === "details" ? 0 : -1}
          onClick={() => setActiveTab("details")}
        >
          Details
        </button>
      </div>

      <div role="tabpanel" tabIndex={0}>
        {activeTab === "overview" ? "Product overview." : "Product details."}
      </div>
    </div>
  );
};

// A complete tabs implementation must also implement the appropriate
// arrow-key and focus behavior.

// ---------------------------------------------------------------------
// 32. Menus require menu keyboard conventions
// ---------------------------------------------------------------------

// Menu widgets have interaction conventions different from ordinary
// navigation lists.
//
// Do not add role="menu" merely to style a list of navigation links.

export const NavigationList: FC = (): ReactElement => {
  return (
    <nav aria-label="Primary navigation">
      <a href="/">Home</a>

      <a href="/products">Products</a>

      <a href="/settings">Settings</a>
    </nav>
  );
};

// A navigation landmark with links does not need to become an ARIA menu.

// ---------------------------------------------------------------------
// 33. Form controls and keyboard behavior
// ---------------------------------------------------------------------

// Native form controls support expected keyboard interaction.
//
// Developers should avoid intercepting keys unnecessarily.

export const NativeFormControls: FC = (): ReactElement => {
  return (
    <form>
      <label htmlFor="query">Search</label>

      <input id="query" type="search" />

      <button type="submit">Search</button>
    </form>
  );
};

// The browser already provides typing, focus, activation, and submission
// behavior appropriate to these controls.

// ---------------------------------------------------------------------
// 34. Do not prevent default unnecessarily
// ---------------------------------------------------------------------

// preventDefault() should be used only when the component intentionally
// replaces the browser's default behavior.
//
// Preventing default behavior indiscriminately can break keyboard
// interaction, scrolling, form submission, or other expected behavior.

export const SelectiveKeyboardHandling: FC = (): ReactElement => {
  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>): void => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      // Perform widget-specific arrow-key navigation.
    }
  };

  return (
    <button type="button" onKeyDown={handleKeyDown}>
      Next option
    </button>
  );
};

// Only the key whose browser behavior the widget intentionally replaces
// should be cancelled.

// ---------------------------------------------------------------------
// 35. Keyboard shortcuts
// ---------------------------------------------------------------------

// Keyboard shortcuts can improve efficiency, but shortcuts that rely on
// single character keys can interfere with text entry and assistive
// technology.
//
// WCAG 2.1.4 requires a mechanism to turn off or remap single-character
// shortcuts, or to limit them to an appropriate focused component. :contentReference[oaicite:4]{index=4}

export const ScopedShortcut: FC = (): ReactElement => {
  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>): void => {
    if (event.key === "Escape") {
      event.currentTarget.value = "";
    }
  };

  return <input type="search" aria-label="Search" onKeyDown={handleKeyDown} />;
};

// Scope shortcuts carefully and avoid interfering with normal text input.

// ---------------------------------------------------------------------
// 36. Modifier keys
// ---------------------------------------------------------------------

// Keyboard shortcuts may intentionally require modifier keys such as
// Control, Alt, or Meta.
//
// Check the relevant modifier property rather than treating a character
// key as a global shortcut.

export const ModifiedShortcut: FC = (): ReactElement => {
  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>): void => {
    if ((event.ctrlKey || event.metaKey) && event.key === "s") {
      event.preventDefault();
      // Save the current document.
    }
  };

  return <input aria-label="Document title" />;
};

// Applications should avoid overriding established browser or operating
// system shortcuts without a strong reason.

// ---------------------------------------------------------------------
// 37. Keyboard navigation and scrolling
// ---------------------------------------------------------------------

// Arrow keys have established meanings in many widgets and may also
// perform browser scrolling.
//
// A custom widget should prevent the default behavior only when the
// widget intentionally consumes the key.

export const ArrowKeyWidget: FC = (): ReactElement => {
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>): void => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      // Move within the widget.
    }
  };

  return (
    <div role="listbox" tabIndex={0} aria-label="Example options" onKeyDown={handleKeyDown}>
      Options
    </div>
  );
};

// Preventing the default action without implementing the replacement
// interaction can make the interface less accessible.

// ---------------------------------------------------------------------
// 38. Disabled controls
// ---------------------------------------------------------------------

// Native disabled controls communicate their state and are excluded from
// the normal sequential keyboard focus order.

export const DisabledNativeControl: FC = (): ReactElement => {
  return (
    <button type="button" disabled>
      Save
    </button>
  );
};

// Prefer native disabled behavior when the control supports it.

// ---------------------------------------------------------------------
// 39. aria-disabled is different from disabled
// ---------------------------------------------------------------------

// aria-disabled communicates a semantic disabled state but does not
// provide the complete behavior of the native disabled attribute.
//
// Application logic must prevent activation when appropriate.

export const AriaDisabledControl: FC = (): ReactElement => {
  const disabled = true;

  const activate = (): void => {
    if (disabled) {
      return;
    }

    // Perform the action.
  };

  return (
    <button type="button" aria-disabled={disabled} onClick={activate}>
      Save
    </button>
  );
};

// For native buttons, the disabled attribute is normally the appropriate
// mechanism when the control should actually be disabled.

// ---------------------------------------------------------------------
// 40. Focusable does not mean interactive
// ---------------------------------------------------------------------

// Making a non-interactive element focusable does not automatically give
// it meaningful keyboard behavior.
//
// A focusable element should have a deliberate interaction purpose.

export const DeliberateFocusTarget: FC = (): ReactElement => {
  const headingRef = useRef<HTMLHeadingElement>(null);

  return (
    <section>
      <h2 ref={headingRef} tabIndex={-1}>
        Search results
      </h2>

      <p>Four results found.</p>
    </section>
  );
};

// This heading is not part of the Tab sequence; it is available as a
// deliberate programmatic focus target.

// ---------------------------------------------------------------------
// 41. Keyboard navigation and CSS order
// ---------------------------------------------------------------------

// CSS visual reordering can create a mismatch between visual order and
// keyboard focus order.
//
// Structure the DOM in the intended logical sequence instead.

export const LogicalVisualOrder: FC = (): ReactElement => {
  return (
    <div className="content">
      <section>
        <h2>Main information</h2>

        <button type="button">Continue</button>
      </section>

      <aside>
        <h2>Related information</h2>

        <a href="/help">Help</a>
      </aside>
    </div>
  );
};

// CSS should enhance the layout rather than forcing an unrelated
// keyboard-navigation order.

// ---------------------------------------------------------------------
// 42. Focus and conditional rendering
// ---------------------------------------------------------------------

// When a focused element is removed from the DOM, focus can move to an
// unexpected location.
//
// Components that remove focused content should deliberately determine
// where focus should go next.

export const ConditionalFocus: FC = (): ReactElement => {
  const [visible, setVisible] = useState(true);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const hide = (): void => {
    setVisible(false);

    requestAnimationFrame(() => {
      triggerRef.current?.focus();
    });
  };

  return (
    <section>
      <button ref={triggerRef} type="button" onClick={hide}>
        Hide details
      </button>

      {visible && <p>Additional details are visible.</p>}
    </section>
  );
};

// Removing non-focusable content is straightforward; removing an
// interactive focused element requires more deliberate focus management.

// ---------------------------------------------------------------------
// 43. Focus and dialogs
// ---------------------------------------------------------------------

// Dialogs create a new interaction context and therefore require deliberate
// focus placement, keyboard operation, Escape handling where appropriate,
// and focus restoration when closed.

export const DialogFocusTarget: FC = (): ReactElement => {
  const dialogRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  const openDialog = (): void => {
    setOpen(true);

    requestAnimationFrame(() => {
      dialogRef.current?.focus();
    });
  };

  return (
    <div>
      <button type="button" onClick={openDialog}>
        Open dialog
      </button>

      {open && (
        <div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="dialog-title" tabIndex={-1}>
          <h2 id="dialog-title">Example dialog</h2>

          <button type="button" onClick={() => setOpen(false)}>
            Close
          </button>
        </div>
      )}
    </div>
  );
};

// A production modal must also ensure appropriate focus containment and
// restoration.

// ---------------------------------------------------------------------
// 44. Keyboard navigation should be predictable
// ---------------------------------------------------------------------

// Users build expectations from common interface patterns.
//
// Custom components should follow established keyboard conventions instead
// of inventing unrelated key behavior.

export const PredictableControl: FC = (): ReactElement => {
  return <button type="button">Open details</button>;
};

// Familiar semantics reduce the amount of interaction logic users need
// to learn.

// ---------------------------------------------------------------------
// 45. Focus should follow the user's task
// ---------------------------------------------------------------------

// Focus management should support the user's next task rather than merely
// reflecting the most recent React state change.

export const TaskOrientedFocus: FC = (): ReactElement => {
  const [submitted, setSubmitted] = useState(false);
  const messageRef = useRef<HTMLParagraphElement>(null);

  const submit = (): void => {
    setSubmitted(true);

    requestAnimationFrame(() => {
      messageRef.current?.focus();
    });
  };

  return (
    <section>
      <button type="button" onClick={submit}>
        Submit form
      </button>

      {submitted && (
        <p ref={messageRef} tabIndex={-1}>
          Submission completed successfully.
        </p>
      )}
    </section>
  );
};

// Moving focus to the completion message can be appropriate when the
// resulting state is the next meaningful point in the user's task.

// ---------------------------------------------------------------------
// 46. Keyboard navigation testing
// ---------------------------------------------------------------------

// Keyboard accessibility should be tested by actually operating the
// interface with the keyboard.
//
// A basic test sequence includes:
//
// 1. Start at the page.
// 2. Press Tab repeatedly.
// 3. Verify every required control can be reached.
// 4. Verify focus is visible.
// 5. Activate controls with the expected keys.
// 6. Use Shift+Tab to navigate backward.
// 7. Enter and leave composite widgets.
// 8. Verify dialogs and temporary UI can be exited.

export const KeyboardTestPage: FC = (): ReactElement => {
  return (
    <main>
      <h1>Keyboard test</h1>

      <a href="/profile">Profile</a>

      <button type="button">Save</button>

      <button type="button">Cancel</button>
    </main>
  );
};

// Manual keyboard testing reveals interaction problems that markup-only
// inspection may not reveal.

// ---------------------------------------------------------------------
// 47. Test reverse navigation
// ---------------------------------------------------------------------

// Shift+Tab should allow users to move backward through the focus order.
//
// Reverse navigation can expose focus-management mistakes that are not
// obvious when testing only with Tab.

export const ReverseNavigation: FC = (): ReactElement => {
  return (
    <form>
      <label htmlFor="first-name">First name</label>

      <input id="first-name" />

      <label htmlFor="last-name">Last name</label>

      <input id="last-name" />

      <button type="submit">Continue</button>
    </form>
  );
};

// Test both directions through every important interaction flow.

// ---------------------------------------------------------------------
// 48. Test keyboard operation of custom widgets
// ---------------------------------------------------------------------

// A custom widget should be tested according to its complete interaction
// pattern rather than only checking that it can receive focus.

export const CustomWidgetTestTarget: FC = (): ReactElement => {
  return (
    <div role="button" tabIndex={0}>
      Custom action
    </div>
  );
};

// This component is intentionally incomplete.
// A keyboard test would expose that it does not implement the expected
// button activation behavior.

// ---------------------------------------------------------------------
// 49. Keyboard accessibility checklist
// ---------------------------------------------------------------------
// - Make all required functionality operable with a keyboard.
// - Prefer native interactive HTML elements.
// - Keep the DOM order aligned with the intended logical focus order.
// - Use tabindex="0" only when an element deliberately needs sequential focus.
// - Use tabindex="-1" for deliberate programmatic focus targets.
// - Avoid positive tabindex values.
// - Do not make ordinary static content tabbable without a specific reason.
// - Give custom controls complete keyboard behavior.
// - Use the keyboard conventions appropriate to the widget's role.
// - Keep focus visible.
// - Do not remove focus outlines without an equivalent visible indication.
// - Ensure focused content is not entirely obscured by author-created UI.
// - Provide skip links when repeated navigation would otherwise create a barrier.
// - Make temporary interfaces keyboard-exitable.
// - Restore focus when closing temporary contexts when appropriate.
// - Do not move focus unnecessarily after ordinary state updates.
// - Manage focus deliberately when focused elements are removed.
// - Use arrow keys according to established composite-widget patterns.
// - Prevent default keyboard behavior only when replacing it intentionally.
// - Test both Tab and Shift+Tab navigation.
// - Test actual keyboard activation, not only focusability.
// - Test custom widgets with their complete interaction model.
// - Test representative keyboard and assistive-technology combinations.

// ---------------------------------------------------------------------
// 50. Summary
// ---------------------------------------------------------------------
// - Keyboard accessibility means that required functionality can be operated without a pointing device.
// - Native HTML controls provide established keyboard semantics and should be preferred whenever possible.
// - Tab and Shift+Tab provide sequential keyboard navigation through focusable content.
// - Focus order should preserve the meaning and operability of the interface.
// - DOM source order should normally establish the logical focus order.
// - Positive tabindex values should generally be avoided because they create a separate author-defined focus order.
// - tabindex="-1" is useful for programmatic focus targets but does not add an element to sequential Tab navigation.
// - A clickable element must also provide an appropriate keyboard interaction model.
// - Adding tabindex to a generic element does not automatically make it behave like a native control.
// - Custom widgets require complete keyboard behavior in addition to their ARIA semantics.
// - Focus should remain visible and should not be entirely obscured by author-created content.
// - Skip links can help keyboard users bypass repeated navigation.
// - Keyboard traps must be avoided; users need a keyboard-accessible way to leave temporary interaction contexts.
// - Focus should move deliberately when the user's task changes, but ordinary state updates do not automatically require focus movement.
// - Temporary interfaces such as dialogs often require focus placement, containment, Escape handling, and focus restoration.
// - Composite widgets may use roving tabindex or aria-activedescendant to manage focus within the widget.
// - Arrow-key behavior should follow the established interaction pattern of the specific widget.
// - Keyboard shortcuts should not interfere with normal text entry or established user-agent behavior.
// - Automated checks are useful, but real keyboard interaction should be tested directly.
// - Keyboard accessibility is a combination of semantics, focus management, interaction behavior, and predictable navigation.
