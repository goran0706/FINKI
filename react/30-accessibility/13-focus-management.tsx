/**
 * Focus Management
 * ================
 *
 * Focus management is the deliberate control of keyboard focus when content or
 * interface state changes. Good focus management keeps the user's position
 * understandable, preserves a logical interaction order, and moves focus only
 * when there is a clear interaction reason to do so.
 *
 * Native browser focus behavior should be preferred whenever it already provides
 * the correct result. Programmatic focus is most useful for interactions such as
 * dialogs, dynamically rendered content, route changes, and composite widgets.
 */

// ---------------------------------------------------------------------
// Imports
// ---------------------------------------------------------------------

import { type FC, type ReactElement, type RefObject, useEffect, useRef, useState } from "react";

// ---------------------------------------------------------------------
// 1. What focus represents
// ---------------------------------------------------------------------

// Keyboard focus identifies the element that currently receives keyboard
// interaction.
//
// Native interactive elements participate in focus navigation automatically.

export const NativeFocus: FC = (): ReactElement => {
  return (
    <div>
      <button type="button">First action</button>

      <a href="/products">Products</a>

      <label>
        Search
        <input type="search" />
      </label>
    </div>
  );
};

// Native buttons, links, and form controls provide built-in focus behavior.

// ---------------------------------------------------------------------
// 2. Focus should follow a logical order
// ---------------------------------------------------------------------

// The sequential focus order should preserve the meaning and operation of
// the interface.
//
// The DOM/source order is usually the simplest way to achieve this.

export const LogicalFocusOrder: FC = (): ReactElement => {
  return (
    <main>
      <h1>Account settings</h1>

      <label>
        Display name
        <input type="text" />
      </label>

      <label>
        Email
        <input type="email" />
      </label>

      <button type="submit">Save changes</button>
    </main>
  );
};

// Avoid creating a focus sequence that jumps unpredictably between unrelated
// parts of the interface.

// ---------------------------------------------------------------------
// 3. Avoid positive tabindex values
// ---------------------------------------------------------------------

// tabindex={0} allows an otherwise non-focusable element to participate in
// sequential keyboard navigation.
//
// tabindex={-1} allows programmatic focus without adding the element to the
// normal sequential Tab order.
//
// Positive tabindex values create an author-defined focus order and are
// generally difficult to maintain.

export const TabIndexValues: FC = (): ReactElement => {
  return (
    <div>
      <button type="button">Native button</button>

      <div tabIndex={0}>Programmatically and sequentially focusable element</div>

      <div tabIndex={-1}>Programmatically focusable destination</div>
    </div>
  );
};

// Prefer native interactive elements instead of making arbitrary elements
// focusable when they are intended to perform an interaction.

// ---------------------------------------------------------------------
// 4. Programmatic focus with useRef
// ---------------------------------------------------------------------

// React refs can hold a reference to a DOM element.
//
// The ref can then be used to call the element's native focus() method.

export const RefFocus: FC = (): ReactElement => {
  const inputRef = useRef<HTMLInputElement>(null);

  const focusInput = (): void => {
    inputRef.current?.focus();
  };

  return (
    <div>
      <button type="button" onClick={focusInput}>
        Focus input
      </button>

      <input ref={inputRef} type="text" aria-label="Example text" />
    </div>
  );
};

// The optional chaining operator avoids calling focus() when the element is
// not currently mounted.

// ---------------------------------------------------------------------
// 5. Focus should have a clear visual indicator
// ---------------------------------------------------------------------

// Users who rely on keyboard navigation need to be able to identify the
// element that currently has focus.
//
// Preserve the browser's focus indicator or provide a sufficiently visible
// alternative.

export const FocusIndicator: FC = (): ReactElement => {
  return (
    <div>
      <button type="button" className="focusable-control">
        Continue
      </button>
    </div>
  );
};

// Example CSS:
//
// .focusable-control:focus-visible {
//     outline: 3px solid currentColor;
//     outline-offset: 3px;
// }

// Do not remove focus outlines without providing an accessible replacement.

// ---------------------------------------------------------------------
// 6. :focus-visible
// ---------------------------------------------------------------------

// :focus-visible allows a design to provide a focus indicator when the browser
// determines that a visible focus indication is appropriate.
//
// It can be used without manually tracking whether the user is using a mouse
// or keyboard.

export const FocusVisibleExample: FC = (): ReactElement => {
  return (
    <button type="button" className="action-button">
      Save
    </button>
  );
};

// Example CSS:
//
// .action-button:focus-visible {
//     outline: 3px solid currentColor;
//     outline-offset: 3px;
// }

// The browser's default focus behavior should not be unnecessarily replaced.

// ---------------------------------------------------------------------
// 7. Focus should not be removed unnecessarily
// ---------------------------------------------------------------------

// Removing focus immediately after an interaction can leave a keyboard user
// without a clear interaction point.
//
// Focus should normally remain where the user expects it to remain.

export const PreserveFocus: FC = (): ReactElement => {
  return <button type="button">Save</button>;
};

// Avoid patterns such as calling blur() merely to hide the browser's focus
// indicator.

// ---------------------------------------------------------------------
// 8. Focusing a newly rendered element
// ---------------------------------------------------------------------

// Sometimes an element does not exist until state changes.
//
// A ref can be attached to the newly rendered element and focus can be moved
// after it has been committed to the DOM.

export const NewlyRenderedInput: FC = (): ReactElement => {
  const [showInput, setShowInput] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (showInput) {
      inputRef.current?.focus();
    }
  }, [showInput]);

  return (
    <div>
      <button
        type="button"
        onClick={() => {
          setShowInput(true);
        }}
      >
        Add field
      </button>

      {showInput && <input ref={inputRef} type="text" aria-label="New field" />}
    </div>
  );
};

// The effect runs after the component has committed the newly rendered input.

// ---------------------------------------------------------------------
// 9. useEffect versus useLayoutEffect
// ---------------------------------------------------------------------

// useEffect is appropriate for many focus-management situations.
//
// useLayoutEffect runs before the browser repaints and can be useful when
// focus must be established before the user sees an intermediate layout state.
//
// It should not be used automatically for every focus operation.

export const EffectFocus: FC = (): ReactElement => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return <input ref={inputRef} type="text" aria-label="Example field" />;
};

// Prefer useEffect unless the timing of the browser paint makes useLayoutEffect
// necessary.

// ---------------------------------------------------------------------
// 10. Focus after conditional rendering
// ---------------------------------------------------------------------

// Conditional rendering can remove the currently focused element from the DOM.
//
// When that happens, the application may need to establish a new meaningful
// focus target.

export const ConditionalFocus: FC = (): ReactElement => {
  const [showEditor, setShowEditor] = useState(false);
  const editorRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (showEditor) {
      editorRef.current?.focus();
    }
  }, [showEditor]);

  return (
    <div>
      {!showEditor && (
        <button
          type="button"
          onClick={() => {
            setShowEditor(true);
          }}
        >
          Edit name
        </button>
      )}

      {showEditor && <input ref={editorRef} type="text" defaultValue="Example" aria-label="Name" />}
    </div>
  );
};

// The new focus target should make sense in relation to the action that caused
// the content to appear.

// ---------------------------------------------------------------------
// 11. Focus after closing temporary content
// ---------------------------------------------------------------------

// When temporary content such as a popup or dialog closes, focus often needs
// to return to the control that opened it.
//
// Store the opening element in a ref so it can be restored later.

export const RestoreFocus: FC = (): ReactElement => {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const close = (): void => {
    setOpen(false);
    triggerRef.current?.focus();
  };

  return (
    <div>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => {
          setOpen(true);
        }}
      >
        Open panel
      </button>

      {open && (
        <section aria-label="Example panel">
          <p>Temporary content.</p>

          <button type="button" onClick={close}>
            Close panel
          </button>
        </section>
      )}
    </div>
  );
};

// Restoring focus gives the user a predictable place to continue from.

// ---------------------------------------------------------------------
// 12. Focus restoration after a dialog
// ---------------------------------------------------------------------

// Dialogs commonly move focus into the dialog when they open and restore focus
// to the invoking control when they close.
//
// The dialog itself also needs appropriate modal behavior when it is modal.

export const DialogFocusRestoration: FC = (): ReactElement => {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const closeDialog = (): void => {
    setOpen(false);

    requestAnimationFrame(() => {
      triggerRef.current?.focus();
    });
  };

  return (
    <div>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => {
          setOpen(true);
        }}
      >
        Open dialog
      </button>

      {open && (
        <div role="dialog" aria-modal="true" aria-labelledby="dialog-title">
          <h2 id="dialog-title">Confirm action</h2>

          <p>This action cannot be undone.</p>

          <button type="button" onClick={closeDialog}>
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

// A production modal dialog also needs to manage interaction within the modal,
// including preventing unintended interaction with content behind it.

// ---------------------------------------------------------------------
// 13. Focus a meaningful heading after navigation
// ---------------------------------------------------------------------

// After an application-level navigation, moving focus to the new page's
// heading can give keyboard users a clear indication that the page changed.
//
// The heading must be intentionally made programmatically focusable.

export const PageHeadingFocus: FC = (): ReactElement => {
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  return (
    <main>
      <h1 ref={headingRef} tabIndex={-1}>
        Products
      </h1>

      <p>Product information.</p>
    </main>
  );
};

// tabindex={-1} keeps the heading out of the normal Tab sequence while
// allowing the application to focus it deliberately.

// ---------------------------------------------------------------------
// 14. Focus management after route changes
// ---------------------------------------------------------------------

// A route change can replace a large portion of the page without moving the
// browser's focus automatically.
//
// The application can identify a stable destination for focus after the
// new content has been rendered.

interface PageProps {
  readonly title: string;
}

export const RoutedPage: FC<PageProps> = ({ title }): ReactElement => {
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    headingRef.current?.focus();
  }, [title]);

  return (
    <main>
      <h1 ref={headingRef} tabIndex={-1}>
        {title}
      </h1>

      <p>Page content for {title}.</p>
    </main>
  );
};

// In a real application, route-level focus management should be integrated
// with the routing lifecycle rather than implemented independently in every
// page without coordination.

// ---------------------------------------------------------------------
// 15. Focus and dynamic error messages
// ---------------------------------------------------------------------

// Validation errors should not automatically steal focus in every situation.
//
// When an error prevents the user from completing an important interaction,
// focus may be moved to a meaningful error summary or the first invalid field.

export const ErrorSummaryFocus: FC = (): ReactElement => {
  const [submitted, setSubmitted] = useState(false);
  const errorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (submitted) {
      errorRef.current?.focus();
    }
  }, [submitted]);

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        setSubmitted(true);
      }}
    >
      {submitted && (
        <div ref={errorRef} tabIndex={-1} role="alert">
          Please correct the errors before continuing.
        </div>
      )}

      <label>
        Name
        <input type="text" />
      </label>

      <button type="submit">Submit</button>
    </form>
  );
};

// The error summary should explain what needs attention and provide useful
// relationships to the affected controls when appropriate.

// ---------------------------------------------------------------------
// 16. Focus the first invalid field
// ---------------------------------------------------------------------

// Another strategy is to move focus directly to the first invalid control.
//
// The control itself should expose its invalid state and an accessible
// description of the problem.

export const FirstInvalidField: FC = (): ReactElement => {
  const emailRef = useRef<HTMLInputElement>(null);

  const validate = (): void => {
    if (!emailRef.current?.value) {
      emailRef.current?.focus();
    }
  };

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        validate();
      }}
    >
      <label htmlFor="email">Email</label>

      <input ref={emailRef} id="email" type="email" aria-describedby="email-error" />

      <p id="email-error">Enter an email address.</p>

      <button type="submit">Submit</button>
    </form>
  );
};

// Do not move focus repeatedly while the user is correcting the form.

// ---------------------------------------------------------------------
// 17. Focus after deleting an item
// ---------------------------------------------------------------------

// Removing a focused item can leave no obvious interaction point.
//
// After deletion, focus can move to a nearby remaining control.

export const DeletableItem: FC = (): ReactElement => {
  const [items, setItems] = useState(["First item", "Second item", "Third item"]);

  const buttonRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const removeItem = (index: number): void => {
    setItems((currentItems) => currentItems.filter((_, itemIndex) => itemIndex !== index));

    requestAnimationFrame(() => {
      const nextIndex = Math.min(index, items.length - 2);
      buttonRefs.current[nextIndex]?.focus();
    });
  };

  return (
    <ul>
      {items.map((item, index) => (
        <li key={item}>
          <span>{item}</span>

          <button
            ref={(element) => {
              buttonRefs.current[index] = element;
            }}
            type="button"
            onClick={() => {
              removeItem(index);
            }}
          >
            Delete
          </button>
        </li>
      ))}
    </ul>
  );
};

// The exact destination should depend on the interaction and remaining
// controls. Do not move focus to an arbitrary location after deletion.

// ---------------------------------------------------------------------
// 18. Focus after inserting content
// ---------------------------------------------------------------------

// Inserting content does not automatically mean focus should move.
//
// Content that appears without changing the user's current task should usually
// leave focus where it is.

export const InsertedContent: FC = (): ReactElement => {
  const [message, setMessage] = useState("");

  return (
    <div>
      <button
        type="button"
        onClick={() => {
          setMessage("Saved successfully.");
        }}
      >
        Save
      </button>

      {message && <p role="status">{message}</p>}
    </div>
  );
};

// A status message can communicate the update without disrupting the user's
// current keyboard position.

// ---------------------------------------------------------------------
// 19. Focus versus announcement
// ---------------------------------------------------------------------

// Moving focus and announcing information are different mechanisms.
//
// Not every dynamic update requires focus movement.

export const StatusWithoutFocusChange: FC = (): ReactElement => {
  return (
    <div>
      <button type="button">Save</button>

      <p role="status">Changes saved.</p>
    </div>
  );
};

// Unnecessary focus movement can interrupt the user's current task.

// ---------------------------------------------------------------------
// 20. Focus should not be used as a notification mechanism
// ---------------------------------------------------------------------

// A status message can often communicate an update without stealing focus.
//
// Focus should be reserved for situations where the user's next interaction
// genuinely needs to begin at the new destination.

export const NonDisruptiveUpdate: FC = (): ReactElement => {
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

      <span role="status">{saved ? "Changes saved." : ""}</span>
    </div>
  );
};

// This preserves the user's current focus on the Save button.

// ---------------------------------------------------------------------
// 21. Focus and hidden elements
// ---------------------------------------------------------------------

// An element that is hidden with display:none or the hidden attribute cannot
// serve as the current focus destination.
//
// Focus only elements that are actually available for interaction.

export const FocusableWhenVisible: FC = (): ReactElement => {
  const [visible, setVisible] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (visible) {
      buttonRef.current?.focus();
    }
  }, [visible]);

  return (
    <div>
      <button
        type="button"
        onClick={() => {
          setVisible(true);
        }}
      >
        Show action
      </button>

      {visible && (
        <button ref={buttonRef} type="button">
          New action
        </button>
      )}
    </div>
  );
};

// The focus operation occurs only after the element has been rendered.

// ---------------------------------------------------------------------
// 22. Focus and disabled controls
// ---------------------------------------------------------------------

// A disabled native control cannot receive normal focus.
//
// Do not attempt to move focus to a disabled element as the destination of
// an interaction.

export const DisabledControl: FC = (): ReactElement => {
  return (
    <div>
      <button type="button" disabled>
        Unavailable
      </button>

      <button type="button">Available</button>
    </div>
  );
};

// If an unavailable action needs an explanation, provide that information
// through an appropriate nearby description rather than focusing the disabled
// control.

// ---------------------------------------------------------------------
// 23. Focus and aria-disabled
// ---------------------------------------------------------------------

// aria-disabled communicates a disabled state but does not provide the native
// behavior of the disabled attribute.
//
// A custom or otherwise focusable control using aria-disabled must still
// prevent the disabled action from occurring.

export const AriaDisabledControl: FC = (): ReactElement => {
  const [disabled, setDisabled] = useState(true);

  return (
    <button
      type="button"
      aria-disabled={disabled}
      onClick={() => {
        if (disabled) {
          return;
        }

        setDisabled(false);
      }}
    >
      Continue
    </button>
  );
};

// Prefer the native disabled attribute when native disabled behavior is what
// the interface requires.

// ---------------------------------------------------------------------
// 24. Focus and custom controls
// ---------------------------------------------------------------------

// Custom controls have to participate correctly in the keyboard interaction
// model.
//
// Whenever possible, use the corresponding native HTML element instead.

export const NativeControlPreferred: FC = (): ReactElement => {
  return <button type="button">Activate</button>;
};

// Replacing a native button with a div creates additional accessibility
// responsibilities for keyboard interaction, focus, and semantics.

// ---------------------------------------------------------------------
// 25. Focus inside a composite widget
// ---------------------------------------------------------------------

// Composite widgets often manage focus among several internal items.
//
// A common model is to keep one item in the Tab sequence and move focus among
// internal items with widget-specific keys.

export const CompositeWidget: FC = (): ReactElement => {
  const [activeIndex, setActiveIndex] = useState(0);
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const moveFocus = (index: number): void => {
    const nextIndex = (index + 3) % 3;

    setActiveIndex(nextIndex);
    itemRefs.current[nextIndex]?.focus();
  };

  return (
    <div
      role="toolbar"
      aria-label="Formatting"
      onKeyDown={(event) => {
        if (event.key === "ArrowRight") {
          event.preventDefault();
          moveFocus(activeIndex + 1);
        }

        if (event.key === "ArrowLeft") {
          event.preventDefault();
          moveFocus(activeIndex - 1);
        }
      }}
    >
      {["Bold", "Italic", "Underline"].map((label, index) => (
        <button
          key={label}
          ref={(element) => {
            itemRefs.current[index] = element;
          }}
          type="button"
          tabIndex={index === activeIndex ? 0 : -1}
        >
          {label}
        </button>
      ))}
    </div>
  );
};

// The widget's keyboard behavior must match the semantics and interaction
// pattern appropriate for that widget.

// ---------------------------------------------------------------------
// 26. Roving tabindex
// ---------------------------------------------------------------------

// Roving tabindex keeps one item at tabIndex={0} and the remaining items at
// tabIndex={-1}.
//
// Arrow-key navigation can move the active item and update which item is
// reachable through the normal Tab sequence.

export const RovingTabIndex: FC = (): ReactElement => {
  const [activeIndex, setActiveIndex] = useState(0);
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const focusItem = (index: number): void => {
    const nextIndex = Math.max(0, Math.min(index, 2));

    setActiveIndex(nextIndex);
    itemRefs.current[nextIndex]?.focus();
  };

  return (
    <div
      role="toolbar"
      aria-label="Text formatting"
      onKeyDown={(event) => {
        if (event.key === "ArrowRight") {
          event.preventDefault();
          focusItem(activeIndex + 1);
        }

        if (event.key === "ArrowLeft") {
          event.preventDefault();
          focusItem(activeIndex - 1);
        }
      }}
    >
      {["Bold", "Italic", "Underline"].map((label, index) => (
        <button
          key={label}
          ref={(element) => {
            itemRefs.current[index] = element;
          }}
          type="button"
          tabIndex={index === activeIndex ? 0 : -1}
        >
          {label}
        </button>
      ))}
    </div>
  );
};

// The active item is the only item exposed through the normal Tab sequence.

// ---------------------------------------------------------------------
// 27. Focus movement should be intentional
// ---------------------------------------------------------------------

// Programmatic focus is an interaction decision, not merely a visual effect.
//
// Every focus move should answer a concrete question:
//
// "Where should the user's next keyboard interaction begin?"

export const IntentionalFocus: FC = (): ReactElement => {
  const buttonRef = useRef<HTMLButtonElement>(null);

  const moveFocus = (): void => {
    buttonRef.current?.focus();
  };

  return (
    <div>
      <button type="button">Current action</button>

      <button ref={buttonRef} type="button">
        Next meaningful action
      </button>

      <button type="button" onClick={moveFocus}>
        Move focus to next action
      </button>
    </div>
  );
};

// Avoid moving focus simply because a component re-rendered.

// ---------------------------------------------------------------------
// 28. Avoid focusing on every render
// ---------------------------------------------------------------------

// A focus effect without an appropriate dependency strategy can repeatedly
// move focus and interrupt typing or other interaction.
//
// Focus only when the relevant state transition occurs.

interface SearchResultProps {
  readonly resultCount: number;
}

export const SearchResults: FC<SearchResultProps> = ({ resultCount }): ReactElement => {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const previousCountRef = useRef(resultCount);

  useEffect(() => {
    if (previousCountRef.current !== resultCount) {
      headingRef.current?.focus();
    }

    previousCountRef.current = resultCount;
  }, [resultCount]);

  return (
    <main>
      <h1 ref={headingRef} tabIndex={-1}>
        Search results
      </h1>

      <p>{resultCount} results found.</p>
    </main>
  );
};

// The condition makes the focus move correspond to a meaningful change rather
// than every render.

// ---------------------------------------------------------------------
// 29. Focus and asynchronous content
// ---------------------------------------------------------------------

// Asynchronous work can replace or add content after a delay.
//
// Focus should move only if the completed operation changes where the user's
// interaction needs to continue.

export const AsyncContent: FC = (): ReactElement => {
  const [loading, setLoading] = useState(false);
  const [complete, setComplete] = useState(false);
  const resultRef = useRef<HTMLHeadingElement>(null);

  const load = (): void => {
    setLoading(true);

    window.setTimeout(() => {
      setLoading(false);
      setComplete(true);
    }, 500);
  };

  useEffect(() => {
    if (complete) {
      resultRef.current?.focus();
    }
  }, [complete]);

  return (
    <section>
      <button type="button" onClick={load} disabled={loading}>
        {loading ? "Loading..." : "Load results"}
      </button>

      {loading && <p role="status">Loading results.</p>}

      {complete && (
        <div>
          <h2 ref={resultRef} tabIndex={-1}>
            Results loaded
          </h2>

          <p>The requested results are available.</p>
        </div>
      )}
    </section>
  );
};

// The example moves focus because the completed state intentionally establishes
// a new interaction destination. A status message alone would not require it.

// ---------------------------------------------------------------------
// 30. Focus and loading states
// ---------------------------------------------------------------------

// A loading indicator does not automatically justify moving focus.
//
// If the user remains in the same interaction context, announcing the state
// can be preferable to stealing focus.

export const LoadingState: FC = (): ReactElement => {
  const [loading, setLoading] = useState(false);

  return (
    <div>
      <button
        type="button"
        onClick={() => {
          setLoading(true);
        }}
      >
        Submit
      </button>

      {loading && <p role="status">Saving changes.</p>}
    </div>
  );
};

// The button can remain focused while the asynchronous operation is announced.

// ---------------------------------------------------------------------
// 31. Focus and modal boundaries
// ---------------------------------------------------------------------

// A modal interaction changes the active interaction context.
//
// Focus should enter the modal when it opens and should not unintentionally
// escape to the obscured page behind it.

export const ModalBoundary: FC = (): ReactElement => {
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      dialogRef.current?.focus();
    }
  }, [open]);

  return (
    <div>
      <button
        type="button"
        onClick={() => {
          setOpen(true);
        }}
      >
        Open modal
      </button>

      {open && (
        <div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="modal-title" tabIndex={-1}>
          <h2 id="modal-title">Example modal</h2>

          <button
            type="button"
            onClick={() => {
              setOpen(false);
            }}
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
};

// A complete modal implementation also needs to constrain keyboard interaction
// and restore focus when the modal closes.

// ---------------------------------------------------------------------
// 32. Focus and disclosure widgets
// ---------------------------------------------------------------------

// Opening an ordinary disclosure does not always require moving focus.
//
// If the trigger remains the logical place from which the user continues,
// focus can stay on the trigger.

export const Disclosure: FC = (): ReactElement => {
  const [open, setOpen] = useState(false);

  return (
    <section>
      <button
        type="button"
        aria-expanded={open}
        aria-controls="details"
        onClick={() => {
          setOpen((current) => !current);
        }}
      >
        Details
      </button>

      {open && (
        <div id="details">
          <p>Additional information.</p>
        </div>
      )}
    </section>
  );
};

// The correct focus behavior depends on the widget's interaction pattern.

// ---------------------------------------------------------------------
// 33. Focus and accordions
// ---------------------------------------------------------------------

// Accordion headers are interactive controls and normally retain focus when
// their associated panel opens or closes.

export const Accordion: FC = (): ReactElement => {
  const [open, setOpen] = useState(false);

  return (
    <section>
      <h2>
        <button
          type="button"
          aria-expanded={open}
          aria-controls="panel"
          onClick={() => {
            setOpen((current) => !current);
          }}
        >
          Shipping information
        </button>
      </h2>

      {open && (
        <div id="panel">
          <p>Shipping details.</p>
        </div>
      )}
    </section>
  );
};

// Do not move focus into the panel merely because it became visible.

// ---------------------------------------------------------------------
// 34. Focus and menus
// ---------------------------------------------------------------------

// Menus have their own keyboard interaction model.
//
// Focus management inside a menu must be coordinated with its opening,
// navigation, and closing behavior.

export const MenuTrigger: FC = (): ReactElement => {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => {
          setOpen((current) => !current);
        }}
      >
        Actions
      </button>

      {open && (
        <div role="menu">
          <button type="button" role="menuitem">
            Edit
          </button>

          <button type="button" role="menuitem">
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

// A production menu needs complete keyboard behavior and appropriate focus
// movement; the example demonstrates the relationship between the trigger
// and the menu rather than implementing the complete menu pattern.

// ---------------------------------------------------------------------
// 35. Focus and skip links
// ---------------------------------------------------------------------

// A skip link can move the user directly to the main content.
//
// The destination can use tabIndex={-1} when explicit focus on the destination
// is part of the implementation.

export const SkipLinkFocus: FC = (): ReactElement => {
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

// Keep the destination meaningful and preserve a visible focus indicator.

// ---------------------------------------------------------------------
// 36. Focus and fixed headers
// ---------------------------------------------------------------------

// Sticky or fixed content can obscure the element that receives focus.
//
// CSS scroll-padding or scroll-margin can help maintain a visible focus
// destination when the page scrolls.

export const FixedHeaderFocus: FC = (): ReactElement => {
  return (
    <main className="page">
      <h1 id="content" tabIndex={-1} className="content-heading">
        Main content
      </h1>

      <p>Page content.</p>
    </main>
  );
};

// Example CSS:
//
// html {
//     scroll-padding-top: 5rem;
// }
//
// .content-heading {
//     scroll-margin-top: 5rem;
// }

// The value should match the application's actual persistent UI.

// ---------------------------------------------------------------------
// 37. Focus and preventScroll
// ---------------------------------------------------------------------

// HTMLElement.focus() can receive an options object.
//
// preventScroll: true prevents the browser from scrolling the focused element
// into view automatically.

export const FocusWithoutScroll: FC = (): ReactElement => {
  const targetRef = useRef<HTMLButtonElement>(null);

  const focusTarget = (): void => {
    targetRef.current?.focus({
      preventScroll: true,
    });
  };

  return (
    <div>
      <button type="button" onClick={focusTarget}>
        Focus without scrolling
      </button>

      <button ref={targetRef} type="button">
        Focus target
      </button>
    </div>
  );
};

// preventScroll should be used deliberately because keeping the focused
// element outside the viewport can make keyboard interaction confusing.

// ---------------------------------------------------------------------
// 38. Focus and document.activeElement
// ---------------------------------------------------------------------

// document.activeElement identifies the element that currently has focus
// within the document.
//
// It can be useful when debugging or verifying focus transitions.

export const ActiveElementExample: FC = (): ReactElement => {
  const reportFocus = (): void => {
    const activeElement = document.activeElement;

    if (activeElement instanceof HTMLElement) {
      console.log(activeElement.tagName);
    }
  };

  return (
    <button type="button" onFocus={reportFocus}>
      Inspect focus
    </button>
  );
};

// Focus debugging should not be used as a substitute for a deliberate focus
// strategy.

// ---------------------------------------------------------------------
// 39. Focus and focus-visible state
// ---------------------------------------------------------------------

// React does not need to maintain its own "is focused" state merely to style
// ordinary focus.
//
// CSS pseudo-classes are generally the simpler mechanism.

export const CssFocusState: FC = (): ReactElement => {
  return (
    <button type="button" className="focus-control">
      Continue
    </button>
  );
};

// Example CSS:
//
// .focus-control:focus-visible {
//     outline: 3px solid currentColor;
//     outline-offset: 3px;
// }

// Avoid duplicating browser focus state in React state when CSS can handle it.

// ---------------------------------------------------------------------
// 40. Focus events
// ---------------------------------------------------------------------

// React exposes focus events such as onFocus and onBlur.
//
// They can be useful when application logic genuinely depends on focus,
// such as validating a field after it loses focus.

export const FocusEvents: FC = (): ReactElement => {
  return (
    <label>
      Name
      <input
        type="text"
        onFocus={() => {
          console.log("Input focused");
        }}
        onBlur={() => {
          console.log("Input blurred");
        }}
      />
    </label>
  );
};

// Focus events should not be used to remove the user's ability to navigate
// naturally.

// ---------------------------------------------------------------------
// 41. Avoid focus traps outside modal interactions
// ---------------------------------------------------------------------

// A component that prevents focus from leaving itself without being a modal
// interaction can trap keyboard users.
//
// Focus containment should be reserved for interaction patterns that require it.

export const NoUnnecessaryFocusTrap: FC = (): ReactElement => {
  return (
    <section>
      <button type="button">First action</button>

      <button type="button">Second action</button>
    </section>
  );
};

// Ordinary page sections should allow focus to continue naturally into the
// surrounding document.

// ---------------------------------------------------------------------
// 42. Focus and component unmounting
// ---------------------------------------------------------------------

// Unmounting the currently focused element can unexpectedly move focus.
//
// Before removing a focused component, consider whether another element should
// receive focus.

export const RemovablePanel: FC = (): ReactElement => {
  const [visible, setVisible] = useState(true);
  const triggerRef = useRef<HTMLButtonElement>(null);

  return (
    <div>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => {
          setVisible(true);
        }}
      >
        Show panel
      </button>

      {visible && (
        <section>
          <button
            type="button"
            onClick={() => {
              setVisible(false);

              requestAnimationFrame(() => {
                triggerRef.current?.focus();
              });
            }}
          >
            Remove panel
          </button>
        </section>
      )}
    </div>
  );
};

// Restoring focus is especially important when the removed element was the
// user's current interaction point.

// ---------------------------------------------------------------------
// 43. Focus and preserving user context
// ---------------------------------------------------------------------

// The safest default is to preserve the user's current focus unless the
// interface has intentionally changed the interaction context.

export const PreserveUserContext: FC = (): ReactElement => {
  const [message, setMessage] = useState("");

  return (
    <div>
      <input type="text" aria-label="Name" />

      <button
        type="button"
        onClick={() => {
          setMessage("Draft saved.");
        }}
      >
        Save draft
      </button>

      <p role="status">{message}</p>
    </div>
  );
};

// Saving the draft does not require focus to move away from the user's current
// control.

// ---------------------------------------------------------------------
// 44. Focus management checklist
// ---------------------------------------------------------------------
// - Prefer native focus behavior whenever it already provides the correct result.
// - Keep the sequential focus order logical and meaningful.
// - Avoid positive tabindex values.
// - Use tabIndex={-1} for deliberate programmatic focus targets when appropriate.
// - Keep focus indicators visible.
// - Do not remove outlines without providing an accessible replacement.
// - Move focus only when the interaction context genuinely changes.
// - Use refs to access DOM elements that need programmatic focus.
// - Focus newly rendered content only after it exists in the DOM.
// - Restore focus after temporary UI closes when appropriate.
// - Consider focus when a focused element is removed.
// - Do not move focus merely because content changed if the user's context is unchanged.
// - Distinguish focus movement from status announcements.
// - Keep focused elements visible and account for fixed or sticky UI.
// - Use preventScroll only when suppressing automatic scrolling is intentional.
// - Coordinate focus with dialogs, menus, composite widgets, and route changes.
// - Avoid unnecessary focus traps.
// - Test with keyboard navigation and assistive technology.

// ---------------------------------------------------------------------
// 45. Complete focus-management example
// ---------------------------------------------------------------------

// This example combines several core principles:
//
// - native controls;
// - a deliberate focus target;
// - focus after a meaningful state change;
// - focus restoration;
// - a visible focusable destination;
// - non-disruptive status messaging.

export const FocusManagementExample: FC = (): ReactElement => {
  const [open, setOpen] = useState(false);
  const [saved, setSaved] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dialogCloseRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (open) {
      dialogCloseRef.current?.focus();
    }
  }, [open]);

  const close = (): void => {
    setOpen(false);

    requestAnimationFrame(() => {
      triggerRef.current?.focus();
    });
  };

  return (
    <main id="main-content" tabIndex={-1}>
      <h1>Account settings</h1>

      <p>Update your account settings.</p>

      <button
        ref={triggerRef}
        type="button"
        onClick={() => {
          setOpen(true);
        }}
      >
        Open confirmation
      </button>

      <button
        type="button"
        onClick={() => {
          setSaved(true);
        }}
      >
        Save changes
      </button>

      <p role="status">{saved ? "Changes saved." : ""}</p>

      {open && (
        <div role="dialog" aria-modal="true" aria-labelledby="confirmation-title">
          <h2 id="confirmation-title">Confirm changes</h2>

          <p>Review the changes before continuing.</p>

          <button ref={dialogCloseRef} type="button" onClick={close}>
            Close
          </button>
        </div>
      )}
    </main>
  );
};

export default FocusManagementExample;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Focus identifies the current interaction point for keyboard navigation.
// - Native HTML controls provide reliable focus behavior and should be preferred.
// - Focus order should preserve meaning and operability.
// - Avoid positive tabindex values because they create difficult-to-maintain focus orders.
// - tabIndex={-1} allows deliberate programmatic focus without normal Tab navigation.
// - React refs provide a direct way to focus DOM elements.
// - Focus should move only when there is a clear interaction reason.
// - Newly rendered content can be focused after React commits it to the DOM.
// - useEffect is sufficient for many focus-management operations.
// - useLayoutEffect is reserved for cases where focus timing before browser paint matters.
// - Focus should usually be restored after temporary interaction contexts close.
// - Route changes and large content replacements may require deliberate focus placement.
// - Validation errors may justify focusing an error summary or the first invalid control.
// - Removing a focused element requires consideration of where focus should continue.
// - Dynamic updates do not automatically require focus movement.
// - Status announcements and focus movement solve different problems.
// - Modal interactions require stronger focus management than ordinary disclosures.
// - Composite widgets may use patterns such as roving tabindex.
// - Focus indicators must remain visible.
// - Focused elements should not be entirely obscured by author-created content.
// - CSS scroll-padding or scroll-margin can help prevent fixed UI from hiding focused content.
// - HTMLElement.focus() supports options such as preventScroll.
// - document.activeElement can help inspect the current focus target.
// - Unnecessary focus traps and automatic focus movement can disrupt keyboard users.
// - Focus management should preserve the user's context whenever the interaction model allows it.
