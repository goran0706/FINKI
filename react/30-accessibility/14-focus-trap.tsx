/**
 * Focus Trap
 * ==========
 *
 * A focus trap keeps keyboard focus within an interaction context while that
 * context is active. It is primarily used for modal dialogs and other UI
 * patterns where content outside the active context must not be interacted with.
 *
 * A focus trap is not a general-purpose accessibility technique. It should only
 * be used when the interaction model intentionally establishes a contained
 * focus scope. Native modal <dialog> behavior should be preferred when it
 * provides the required behavior.
 */

// ---------------------------------------------------------------------
// Imports
// ---------------------------------------------------------------------

import {
  type FC,
  type ReactElement,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
  useEffect,
  useRef,
} from "react";

// ---------------------------------------------------------------------
// 1. What a focus trap does
// ---------------------------------------------------------------------

// A modal interaction establishes a temporary focus boundary.
//
// While the modal is open:
// - focus enters the modal;
// - Tab moves through controls inside the modal;
// - Shift+Tab moves backward through controls inside the modal;
// - focus does not escape to the page behind it;
// - closing the modal ends the focus boundary.

export const FocusTrapConcept: FC = (): ReactElement => {
  return (
    <div>
      <button type="button">Open settings</button>

      <div role="dialog" aria-modal="true" aria-labelledby="dialog-title">
        <h2 id="dialog-title">Settings</h2>

        <button type="button">Save</button>

        <button type="button">Cancel</button>
      </div>
    </div>
  );
};

// The example shows the semantic structure, but a role="dialog" element alone
// does not implement modal behavior or focus containment.

// ---------------------------------------------------------------------
// 2. Modal versus non-modal interaction
// ---------------------------------------------------------------------

// A modal dialog blocks interaction with the content behind it.
//
// A non-modal dialog does not establish the same focus boundary and therefore
// should not use a focus trap simply because it is visually presented as a
// floating panel.

export const ModalVsNonModal: FC = (): ReactElement => {
  return (
    <div>
      <section role="dialog" aria-labelledby="non-modal-title">
        <h2 id="non-modal-title">Non-modal panel</h2>

        <button type="button">Apply</button>
      </section>

      <button type="button">Page action</button>
    </div>
  );
};

// The interaction model determines whether focus must be contained.

// ---------------------------------------------------------------------
// 3. Why focus trapping is necessary for a custom modal
// ---------------------------------------------------------------------

// A custom modal built from ordinary elements does not automatically prevent
// Tab from reaching controls elsewhere on the page.
//
// The implementation must either use an appropriate native browser primitive
// or deliberately manage the modal's focus scope.

export const CustomModalBoundary: FC = (): ReactElement => {
  return (
    <div>
      <main>
        <button type="button">Background action</button>
      </main>

      <section role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <h2 id="modal-title">Example modal</h2>

        <button type="button">Confirm</button>

        <button type="button">Cancel</button>
      </section>
    </div>
  );
};

// aria-modal communicates modal semantics to assistive technologies, but the
// application must also make the modal actually behave as a modal.

// ---------------------------------------------------------------------
// 4. Native dialog is preferred when appropriate
// ---------------------------------------------------------------------

// The native <dialog> element provides browser-managed modal behavior when
// opened with showModal().
//
// A modal dialog opened with showModal() places the dialog in the top layer
// and makes the rest of the document inert.

export const NativeDialogMarkup: FC = (): ReactElement => {
  return (
    <dialog aria-labelledby="native-dialog-title">
      <h2 id="native-dialog-title">Example dialog</h2>

      <p>Dialog content.</p>

      <form method="dialog">
        <button type="submit">Close</button>
      </form>
    </dialog>
  );
};

// The React application still needs to control when the native dialog is
// opened and closed.

// ---------------------------------------------------------------------
// 5. Native dialog with a ref
// ---------------------------------------------------------------------

// HTMLDialogElement exposes showModal() and close().
//
// A ref gives React code access to the native dialog instance.

export const NativeDialog: FC = (): ReactElement => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  const openDialog = (): void => {
    dialogRef.current?.showModal();
  };

  const closeDialog = (): void => {
    dialogRef.current?.close();
  };

  return (
    <div>
      <button type="button" onClick={openDialog}>
        Open dialog
      </button>

      <dialog ref={dialogRef} aria-labelledby="dialog-title">
        <h2 id="dialog-title">Native modal</h2>

        <p>The browser manages the modal state and inert background.</p>

        <button type="button" onClick={closeDialog}>
          Close
        </button>
      </dialog>
    </div>
  );
};

// showModal() is different from dialog.show(): showModal() creates modal
// behavior, while show() creates a non-modal dialog.

// ---------------------------------------------------------------------
// 6. Modal focus must enter the dialog
// ---------------------------------------------------------------------

// When a modal opens, focus should move to an appropriate element inside it.
//
// The first interactive element is often suitable, but it is not always the
// best destination.

export const InitialDialogFocus: FC = (): ReactElement => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (dialogRef.current?.open) {
      dialogRef.current.querySelector<HTMLElement>("button, input, select, textarea, a[href]")?.focus();
    }
  }, []);

  return (
    <dialog ref={dialogRef} aria-labelledby="title">
      <h2 id="title">Confirm action</h2>

      <button type="button">Confirm</button>

      <button type="button">Cancel</button>
    </dialog>
  );
};

// In a real implementation, focus should be established as part of the
// transition that opens the dialog rather than merely when the component mounts.

// ---------------------------------------------------------------------
// 7. Initial focus is not always the first button
// ---------------------------------------------------------------------

// Dialog content can be large or structurally important.
//
// In those cases, focusing a static heading or introductory paragraph with
// tabIndex={-1} can let the user begin at the start of the content.

export const DialogContentFocus: FC = (): ReactElement => {
  const contentRef = useRef<HTMLParagraphElement>(null);

  const focusContent = (): void => {
    contentRef.current?.focus();
  };

  return (
    <div>
      <button type="button" onClick={focusContent}>
        Start dialog
      </button>

      <div role="dialog" aria-modal="true" aria-labelledby="title">
        <h2 id="title">Terms and conditions</h2>

        <p ref={contentRef} tabIndex={-1}>
          Read the information before choosing an action.
        </p>

        <button type="button">Accept</button>
      </div>
    </div>
  );
};

// The focus target should make the dialog's content understandable and keep
// the user's focus position visible.

// ---------------------------------------------------------------------
// 8. A close button belongs inside the dialog
// ---------------------------------------------------------------------

// A modal dialog should provide a visible way to close it.
//
// Keeping the close control inside the dialog ensures that it remains part of
// the modal's own interaction context.

export const DialogCloseButton: FC = (): ReactElement => {
  return (
    <div role="dialog" aria-modal="true" aria-labelledby="dialog-title">
      <h2 id="dialog-title">Preferences</h2>

      <button type="button">Close</button>
    </div>
  );
};

// Escape-key support can provide an additional dismissal mechanism.

// ---------------------------------------------------------------------
// 9. Escape closes the modal
// ---------------------------------------------------------------------

// Escape is commonly used to dismiss modal dialogs.
//
// Closing the dialog should also restore focus to an appropriate element.

export const EscapeToClose: FC = (): ReactElement => {
  const dialogRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>): void => {
    if (event.key === "Escape") {
      event.preventDefault();
      dialogRef.current?.remove();
    }
  };

  return (
    <div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="title" onKeyDown={handleKeyDown}>
      <h2 id="title">Example dialog</h2>

      <button type="button">Close</button>
    </div>
  );
};

// In React, state should normally control whether the dialog is rendered;
// direct DOM removal is shown here only to illustrate the Escape event.

// ---------------------------------------------------------------------
// 10. Identifying tabbable elements
// ---------------------------------------------------------------------

// A focus trap needs to know which descendants can receive sequential
// keyboard focus.
//
// Native controls and links are common candidates.

const getTabbableElements = (container: HTMLElement): HTMLElement[] => {
  const selector = [
    "a[href]",
    "button:not([disabled])",
    "input:not([disabled])",
    "select:not([disabled])",
    "textarea:not([disabled])",
    "[tabindex]:not([tabindex='-1'])",
  ].join(",");

  return Array.from(container.querySelectorAll<HTMLElement>(selector)).filter((element) => {
    const style = window.getComputedStyle(element);

    return style.display !== "none" && style.visibility !== "hidden" && !element.hasAttribute("hidden");
  });
};

// A production focus utility may need to account for additional browser
// behaviors and custom focusable elements.

// ---------------------------------------------------------------------
// 11. Basic Tab containment
// ---------------------------------------------------------------------

// When Tab is pressed on the last tabbable element, focus should wrap to the
// first tabbable element.
//
// When Shift+Tab is pressed on the first tabbable element, focus should wrap
// to the last tabbable element.

export const BasicTabContainment: FC = (): ReactElement => {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>): void => {
    if (event.key !== "Tab") {
      return;
    }

    const container = containerRef.current;

    if (!container) {
      return;
    }

    const elements = getTabbableElements(container);

    if (elements.length === 0) {
      event.preventDefault();
      return;
    }

    const first = elements[0];
    const last = elements[elements.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
      return;
    }

    if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  return (
    <div ref={containerRef} role="dialog" aria-modal="true" aria-labelledby="title" onKeyDown={handleKeyDown}>
      <h2 id="title">Example dialog</h2>

      <button type="button">First</button>

      <button type="button">Second</button>

      <button type="button">Last</button>
    </div>
  );
};

// The focus boundary is limited to the dialog's own tabbable descendants.

// ---------------------------------------------------------------------
// 12. Reusable FocusTrap component
// ---------------------------------------------------------------------

interface FocusTrapProps {
  readonly children: ReactNode;
  readonly enabled?: boolean;
}

export const FocusTrap: FC<FocusTrapProps> = ({ children, enabled = true }): ReactElement => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const container = containerRef.current;

    if (!container) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key !== "Tab") {
        return;
      }

      const elements = getTabbableElements(container);

      if (elements.length === 0) {
        event.preventDefault();
        return;
      }

      const first = elements[0];
      const last = elements[elements.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
        return;
      }

      if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    container.addEventListener("keydown", handleKeyDown);

    return () => {
      container.removeEventListener("keydown", handleKeyDown);
    };
  }, [enabled]);

  return <div ref={containerRef}>{children}</div>;
};

// This component demonstrates the core wrapping behavior but is not a complete
// modal implementation by itself.

// ---------------------------------------------------------------------
// 13. FocusTrap with a modal
// ---------------------------------------------------------------------

interface ModalProps {
  readonly open: boolean;
  readonly onClose: () => void;
}

export const TrappedModal: FC<ModalProps> = ({ open, onClose }): ReactElement | null => {
  if (!open) {
    return null;
  }

  return (
    <FocusTrap>
      <div role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <h2 id="modal-title">Example modal</h2>

        <p>Focus remains within this interaction while it is open.</p>

        <button type="button" onClick={onClose}>
          Close
        </button>

        <button type="button">Continue</button>
      </div>
    </FocusTrap>
  );
};

// A modal still needs opening focus, closing focus, background inertness, and
// an appropriate accessible name in addition to the Tab boundary.

// ---------------------------------------------------------------------
// 14. Saving the invoking element
// ---------------------------------------------------------------------

// Before opening a modal, store the element that invoked it.
//
// This gives the application a reliable focus-restoration target when the
// modal closes.

export const InvokerReference: FC = (): ReactElement => {
  const triggerRef = useRef<HTMLButtonElement>(null);

  const restoreFocus = (): void => {
    triggerRef.current?.focus();
  };

  return (
    <div>
      <button ref={triggerRef} type="button">
        Open dialog
      </button>

      <button type="button" onClick={restoreFocus}>
        Simulate close
      </button>
    </div>
  );
};

// The invoking element may disappear while the modal is open, so restoration
// logic should have a sensible fallback.

// ---------------------------------------------------------------------
// 15. Restoring focus when the modal closes
// ---------------------------------------------------------------------

interface RestoringModalProps {
  readonly open: boolean;
  readonly onClose: () => void;
  readonly triggerRef: RefObject<HTMLButtonElement | null>;
}

export const RestoringModal: FC<RestoringModalProps> = ({ open, onClose, triggerRef }): ReactElement | null => {
  const previousOpen = useRef(open);

  useEffect(() => {
    if (previousOpen.current && !open) {
      requestAnimationFrame(() => {
        triggerRef.current?.focus();
      });
    }

    previousOpen.current = open;
  }, [open, triggerRef]);

  if (!open) {
    return null;
  }

  return (
    <FocusTrap>
      <div role="dialog" aria-modal="true" aria-labelledby="title">
        <h2 id="title">Confirm action</h2>

        <button type="button" onClick={onClose}>
          Cancel
        </button>
      </div>
    </FocusTrap>
  );
};

// Returning focus to the invoking control is the normal result when the
// invoking control still exists and remains the logical continuation point.

// ---------------------------------------------------------------------
// 16. Fallback when the invoker no longer exists
// ---------------------------------------------------------------------

// Sometimes the element that opened a modal is removed as part of the action.
//
// In that situation, focus should move to another logical element rather than
// being restored to a disconnected node.

export const FocusRestorationFallback: FC = (): ReactElement => {
  const fallbackRef = useRef<HTMLHeadingElement>(null);

  const restoreFallback = (): void => {
    fallbackRef.current?.focus();
  };

  return (
    <main>
      <h1 ref={fallbackRef} tabIndex={-1}>
        Updated content
      </h1>

      <button type="button" onClick={restoreFallback}>
        Restore focus to page
      </button>
    </main>
  );
};

// The fallback should be selected according to the user's next logical task.

// ---------------------------------------------------------------------
// 17. Focus must remain visible
// ---------------------------------------------------------------------

// A focus trap that moves focus to an off-screen or visually obscured element
// is still inaccessible.
//
// Every focus destination must remain perceivable.

export const VisibleFocusInsideTrap: FC = (): ReactElement => {
  return (
    <div role="dialog" aria-modal="true" aria-labelledby="title">
      <h2 id="title">Settings</h2>

      <button className="dialog-control" type="button">
        Save
      </button>
    </div>
  );
};

// Example CSS:
//
// .dialog-control:focus-visible {
//     outline: 3px solid currentColor;
//     outline-offset: 3px;
// }

// ---------------------------------------------------------------------
// 18. No tabbable elements
// ---------------------------------------------------------------------

// A dialog can legitimately contain no interactive controls.
//
// The implementation must still provide a meaningful initial focus target
// instead of creating a focus trap with nowhere to move.

export const NoTabbableDialog: FC = (): ReactElement => {
  return (
    <div role="dialog" aria-modal="true" aria-labelledby="title">
      <h2 id="title" tabIndex={-1}>
        Information
      </h2>

      <p>This dialog contains information only.</p>
    </div>
  );
};

// A static heading or paragraph can be made programmatically focusable with
// tabIndex={-1} when it is the appropriate initial focus target.

// ---------------------------------------------------------------------
// 19. Avoid positive tabindex values in traps
// ---------------------------------------------------------------------

// A focus trap should not use positive tabindex values to force an order.
//
// The natural tab order should determine the sequence inside the dialog.

export const NaturalTrapOrder: FC = (): ReactElement => {
  return (
    <FocusTrap>
      <div role="dialog" aria-modal="true" aria-labelledby="title">
        <h2 id="title">Preferences</h2>

        <label>
          Name
          <input type="text" />
        </label>

        <button type="button">Save</button>

        <button type="button">Cancel</button>
      </div>
    </FocusTrap>
  );
};

// Native source order is easier to understand and maintain.

// ---------------------------------------------------------------------
// 20. Do not trap focus in ordinary page sections
// ---------------------------------------------------------------------

// A focus trap should not be applied to an ordinary card, sidebar, form, or
// section simply because it contains several controls.

export const OrdinarySection: FC = (): ReactElement => {
  return (
    <section>
      <h2>Account</h2>

      <label>
        Name
        <input type="text" />
      </label>

      <button type="button">Save</button>
    </section>
  );
};

// Ordinary content should allow focus to move naturally through the page.

// ---------------------------------------------------------------------
// 21. Focus trap versus focus restoration
// ---------------------------------------------------------------------

// These are separate responsibilities.
//
// Focus trapping controls where focus can move while a modal is open.
// Focus restoration controls where focus goes after the modal closes.

export const TrapAndRestore: FC = (): ReactElement => {
  return (
    <div>
      <button type="button">Open</button>

      <FocusTrap>
        <div role="dialog" aria-modal="true" aria-labelledby="title">
          <h2 id="title">Dialog</h2>

          <button type="button">Confirm</button>

          <button type="button">Close</button>
        </div>
      </FocusTrap>
    </div>
  );
};

// Both behaviors are necessary for a complete modal interaction.

// ---------------------------------------------------------------------
// 22. Focus trap versus inert
// ---------------------------------------------------------------------

// A focus trap keeps keyboard focus inside a boundary.
//
// inert prevents interaction with an element and its descendants, including
// focus and user interaction.
//
// Modal implementations can use inertness for the background and focus
// management for the modal itself.

export const InertBackground: FC = (): ReactElement => {
  return (
    <div>
      <main inert>
        <button type="button">Background action</button>
      </main>

      <div role="dialog" aria-modal="true" aria-labelledby="title">
        <h2 id="title">Active dialog</h2>

        <button type="button">Close</button>
      </div>
    </div>
  );
};

// In React's JSX, the boolean inert attribute is represented as inert.
// Native modal <dialog>.showModal() provides automatic background inertness.

// ---------------------------------------------------------------------
// 23. aria-modal does not create a focus trap
// ---------------------------------------------------------------------

// aria-modal communicates that a dialog is modal to assistive technologies.
//
// It does not itself implement keyboard focus containment.

export const AriaModalOnly: FC = (): ReactElement => {
  return (
    <div role="dialog" aria-modal="true" aria-labelledby="title">
      <h2 id="title">Modal</h2>

      <button type="button">Continue</button>
    </div>
  );
};

// A dialog marked aria-modal="true" must actually behave as a modal dialog.

// ---------------------------------------------------------------------
// 24. aria-hidden is not a focus trap
// ---------------------------------------------------------------------

// Hiding background content from assistive technologies does not by itself
// implement keyboard focus containment.
//
// Focusable background controls must also be prevented from interaction.

export const AriaHiddenIsNotEnough: FC = (): ReactElement => {
  return (
    <div>
      <main aria-hidden="true">
        <button type="button">Background action</button>
      </main>

      <div role="dialog" aria-modal="true" aria-labelledby="title">
        <h2 id="title">Dialog</h2>

        <button type="button">Close</button>
      </div>
    </div>
  );
};

// Do not use aria-hidden as a substitute for making the background actually
// inert and non-interactive.

// ---------------------------------------------------------------------
// 25. Background interaction must be blocked
// ---------------------------------------------------------------------

// A modal is not truly modal if users can continue activating controls behind
// it.
//
// The visual presentation, pointer interaction, keyboard interaction, and
// assistive-technology semantics should agree.

export const ModalBackground: FC = (): ReactElement => {
  return (
    <div>
      <main inert>
        <h1>Page content</h1>

        <button type="button">Background action</button>
      </main>

      <section role="dialog" aria-modal="true" aria-labelledby="title">
        <h2 id="title">Confirmation</h2>

        <button type="button">Confirm</button>

        <button type="button">Cancel</button>
      </section>
    </div>
  );
};

// The background should not remain interactable while a modal is active.

// ---------------------------------------------------------------------
// 26. Click outside is not the same as Escape
// ---------------------------------------------------------------------

// Some modal interfaces allow clicking the backdrop to dismiss the dialog.
//
// That behavior is separate from keyboard dismissal with Escape.

export const BackdropDismissal: FC = (): ReactElement => {
  return (
    <div className="modal-backdrop" role="presentation">
      <div role="dialog" aria-modal="true" aria-labelledby="title">
        <h2 id="title">Example dialog</h2>

        <button type="button">Close</button>
      </div>
    </div>
  );
};

// A backdrop implementation must ensure that clicks inside the dialog are
// not accidentally interpreted as backdrop clicks.

// ---------------------------------------------------------------------
// 27. Focus must not escape with Shift+Tab
// ---------------------------------------------------------------------

// A common incomplete focus trap handles Tab at the end but forgets
// Shift+Tab at the beginning.
//
// Both directions must be contained.

export const BidirectionalTrap: FC = (): ReactElement => {
  return (
    <FocusTrap>
      <div role="dialog" aria-modal="true" aria-labelledby="title">
        <h2 id="title">Preferences</h2>

        <button type="button">First</button>

        <button type="button">Last</button>
      </div>
    </FocusTrap>
  );
};

// Tab and Shift+Tab form one bidirectional focus cycle.

// ---------------------------------------------------------------------
// 28. Focus trap with dynamically changing controls
// ---------------------------------------------------------------------

// The set of tabbable elements can change while the modal is open.
//
// Recompute the set when Tab is handled instead of permanently caching the
// initial list.

export const DynamicTrapContent: FC = (): ReactElement => {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>): void => {
    if (event.key !== "Tab") {
      return;
    }

    const container = containerRef.current;

    if (!container) {
      return;
    }

    const elements = getTabbableElements(container);

    if (elements.length === 0) {
      event.preventDefault();
      return;
    }

    const first = elements[0];
    const last = elements[elements.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  return (
    <div ref={containerRef} role="dialog" aria-modal="true" aria-labelledby="title" onKeyDown={handleKeyDown}>
      <h2 id="title">Dynamic form</h2>

      <input type="text" aria-label="Name" />

      <button type="button">Add another field</button>

      <button type="button">Close</button>
    </div>
  );
};

// The list of focusable descendants should reflect the current DOM state.

// ---------------------------------------------------------------------
// 29. Focus trap with disabled controls
// ---------------------------------------------------------------------

// Disabled native controls should not be included in the sequential focus
// cycle.
//
// The browser already excludes them from ordinary Tab navigation.

export const DisabledTrapControl: FC = (): ReactElement => {
  return (
    <FocusTrap>
      <div role="dialog" aria-modal="true" aria-labelledby="title">
        <h2 id="title">Example form</h2>

        <button type="button" disabled>
          Unavailable
        </button>

        <button type="button">Continue</button>

        <button type="button">Close</button>
      </div>
    </FocusTrap>
  );
};

// The focus trap should follow the browser's actual focusability rather than
// treating every button element as tabbable.

// ---------------------------------------------------------------------
// 30. Focus trap with links and form controls
// ---------------------------------------------------------------------

// A modal can contain different kinds of interactive elements.
//
// The focus cycle should include every appropriate tabbable descendant.

export const MixedFocusableElements: FC = (): ReactElement => {
  return (
    <FocusTrap>
      <div role="dialog" aria-modal="true" aria-labelledby="title">
        <h2 id="title">Contact details</h2>

        <a href="/help">Help</a>

        <label>
          Name
          <input type="text" />
        </label>

        <select defaultValue="example">
          <option value="example">Example</option>

          <option value="other">Other</option>
        </select>

        <button type="button">Save</button>
      </div>
    </FocusTrap>
  );
};

// A production utility may need a more comprehensive tabbable-element
// implementation than the simplified teaching helper shown here.

// ---------------------------------------------------------------------
// 31. Focus trap and nested dialogs
// ---------------------------------------------------------------------

// A dialog can open another dialog.
//
// Nested modal interactions require a focus stack so that each dialog can
// restore focus to the element that opened it.

export const NestedDialogConcept: FC = (): ReactElement => {
  return (
    <div role="dialog" aria-modal="true" aria-labelledby="outer-title">
      <h2 id="outer-title">Outer dialog</h2>

      <button type="button">Open nested dialog</button>

      <button type="button">Close</button>
    </div>
  );
};

// Each modal layer needs its own lifecycle and restoration target.

// ---------------------------------------------------------------------
// 32. Do not create multiple simultaneous traps
// ---------------------------------------------------------------------

// Two independent active focus traps can compete for focus.
//
// Only the currently active modal interaction should own the focus boundary.

export const SingleActiveTrap: FC = (): ReactElement => {
  return (
    <FocusTrap>
      <div role="dialog" aria-modal="true" aria-labelledby="title">
        <h2 id="title">Active dialog</h2>

        <button type="button">Close</button>
      </div>
    </FocusTrap>
  );
};

// A modal manager can coordinate nested or stacked dialogs when an application
// requires them.

// ---------------------------------------------------------------------
// 33. Focus trap and portals
// ---------------------------------------------------------------------

// React portals can render a dialog outside the DOM subtree containing the
// trigger.
//
// Focus trapping still works as long as the trap owns the actual dialog DOM
// subtree.

export const PortaledDialogConcept: FC = (): ReactElement => {
  return (
    <div role="dialog" aria-modal="true" aria-labelledby="title">
      <h2 id="title">Portaled dialog</h2>

      <button type="button">Close</button>
    </div>
  );
};

// The DOM location of the dialog should be considered when applying background
// inertness and stacking behavior.

// ---------------------------------------------------------------------
// 34. Focus trap and screen readers
// ---------------------------------------------------------------------

// A focus trap is primarily a keyboard-focus mechanism.
//
// Screen readers may also navigate content using mechanisms that are not
// identical to sequential Tab navigation.
//
// Modal semantics and actual inertness must therefore be implemented together.

export const ScreenReaderModal: FC = (): ReactElement => {
  return (
    <div role="dialog" aria-modal="true" aria-labelledby="title">
      <h2 id="title">Confirmation</h2>

      <p>Confirm the requested action.</p>

      <button type="button">Confirm</button>

      <button type="button">Cancel</button>
    </div>
  );
};

// aria-modal="true" should only be used when the interaction actually behaves
// as modal for all users.

// ---------------------------------------------------------------------
// 35. Focus trap and accessible naming
// ---------------------------------------------------------------------

// A modal dialog needs an accessible name.
//
// A visible heading referenced by aria-labelledby is a common solution.

export const NamedModal: FC = (): ReactElement => {
  return (
    <div role="dialog" aria-modal="true" aria-labelledby="settings-title">
      <h2 id="settings-title">Account settings</h2>

      <button type="button">Close</button>
    </div>
  );
};

// A focus trap does not provide an accessible name; the dialog still needs
// correct naming semantics.

// ---------------------------------------------------------------------
// 36. Focus trap and descriptions
// ---------------------------------------------------------------------

// aria-describedby can associate simple descriptive content with a dialog.
//
// For complex content containing multiple paragraphs, lists, or other
// structures, forcing the entire description into the initial announcement
// may be inappropriate.

export const DescribedModal: FC = (): ReactElement => {
  return (
    <div role="dialog" aria-modal="true" aria-labelledby="title" aria-describedby="description">
      <h2 id="title">Delete item</h2>

      <p id="description">This action cannot be undone.</p>

      <button type="button">Delete</button>

      <button type="button">Cancel</button>
    </div>
  );
};

// The dialog's name and description should be designed according to the
// content and interaction rather than added mechanically.

// ---------------------------------------------------------------------
// 37. Focus trap and alert dialogs
// ---------------------------------------------------------------------

// An alert dialog is a specialized dialog for important messages that require
// immediate attention and user interaction.
//
// Its focus behavior follows the dialog model while the semantics communicate
// the higher-priority nature of the message.

export const AlertDialog: FC = (): ReactElement => {
  return (
    <div role="alertdialog" aria-modal="true" aria-labelledby="alert-title" aria-describedby="alert-description">
      <h2 id="alert-title">Delete item?</h2>

      <p id="alert-description">This action cannot be undone.</p>

      <button type="button">Delete</button>

      <button type="button">Cancel</button>
    </div>
  );
};

// The semantic role should reflect the actual interaction pattern.

// ---------------------------------------------------------------------
// 38. Initial focus for destructive dialogs
// ---------------------------------------------------------------------

// For a destructive action that cannot easily be reversed, the least
// destructive action may be the most appropriate initial focus target.

export const DestructiveDialog: FC = (): ReactElement => {
  return (
    <div role="alertdialog" aria-modal="true" aria-labelledby="title">
      <h2 id="title">Delete account?</h2>

      <p>This action cannot be undone.</p>

      <button type="button">Cancel</button>

      <button type="button">Delete account</button>
    </div>
  );
};

// Initial focus should be selected according to the task and consequences,
// not simply because one button happens to be first in the DOM.

// ---------------------------------------------------------------------
// 39. Focus trap and long dialog content
// ---------------------------------------------------------------------

// If a dialog contains a large amount of content, placing initial focus on a
// control near the bottom can cause the beginning of the content to scroll
// out of view.
//
// A static element near the beginning can be a better initial focus target.

export const LongDialog: FC = (): ReactElement => {
  return (
    <div role="dialog" aria-modal="true" aria-labelledby="title">
      <h2 id="title" tabIndex={-1}>
        Terms and conditions
      </h2>

      <p>Review the information before continuing.</p>

      <p>Additional terms and conditions are presented here.</p>

      <button type="button">Continue</button>

      <button type="button">Cancel</button>
    </div>
  );
};

// The initial focus position should keep both the user's focus and the
// beginning of important content visible.

// ---------------------------------------------------------------------
// 40. Focus trap and focus restoration after deletion
// ---------------------------------------------------------------------

// A modal can perform an operation that removes the original invoking control.
//
// Focus restoration must then use the next logical workflow destination.

export const DeletionWorkflow: FC = (): ReactElement => {
  return (
    <main>
      <h1 tabIndex={-1}>Items</h1>

      <p>The deleted item is no longer present.</p>

      <button type="button">Create new item</button>
    </main>
  );
};

// The fallback destination should reflect the user's next task rather than
// blindly restoring a stale reference.

// ---------------------------------------------------------------------
// 41. Focus trap should not depend on mouse events
// ---------------------------------------------------------------------

// Keyboard containment must work without pointer interaction.
//
// Do not implement the focus trap only through mouse handlers.

export const KeyboardOnlyTrap: FC = (): ReactElement => {
  return (
    <FocusTrap>
      <div role="dialog" aria-modal="true" aria-labelledby="title">
        <h2 id="title">Keyboard-accessible dialog</h2>

        <button type="button">First action</button>

        <button type="button">Close</button>
      </div>
    </FocusTrap>
  );
};

// Tab and Shift+Tab should be sufficient to traverse the complete focus scope.

// ---------------------------------------------------------------------
// 42. Avoid trapping focus with CSS
// ---------------------------------------------------------------------

// CSS can visually style a modal, but CSS alone does not establish the
// keyboard focus behavior required by a modal interaction.
//
// The interaction semantics and focus behavior must be implemented separately.

export const VisualModalOnly: FC = (): ReactElement => {
  return (
    <div className="modal">
      <h2>Example modal</h2>

      <button type="button">Close</button>
    </div>
  );
};

// Visual presentation is not a substitute for modal interaction semantics.

// ---------------------------------------------------------------------
// 43. A complete custom focus-trap modal
// ---------------------------------------------------------------------

interface CompleteModalProps {
  readonly open: boolean;
  readonly onClose: () => void;
  readonly triggerRef: RefObject<HTMLButtonElement | null>;
}

export const CompleteFocusTrapModal: FC<CompleteModalProps> = ({ open, onClose, triggerRef }): ReactElement | null => {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    closeRef.current?.focus();

    const dialog = dialogRef.current;

    if (!dialog) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab") {
        return;
      }

      const elements = getTabbableElements(dialog);

      if (elements.length === 0) {
        event.preventDefault();
        return;
      }

      const first = elements[0];
      const last = elements[elements.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
        return;
      }

      if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    dialog.addEventListener("keydown", handleKeyDown);

    return () => {
      dialog.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!open) {
      requestAnimationFrame(() => {
        triggerRef.current?.focus();
      });
    }
  }, [open, triggerRef]);

  if (!open) {
    return null;
  }

  return (
    <div className="modal-backdrop" role="presentation">
      <div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="complete-modal-title">
        <h2 id="complete-modal-title">Confirm changes</h2>

        <p>Review the changes before continuing.</p>

        <button ref={closeRef} type="button" onClick={onClose}>
          Cancel
        </button>

        <button type="button">Confirm</button>
      </div>
    </div>
  );
};

// This demonstrates the main responsibilities of a custom focus-trap modal:
// initial focus, Tab wrapping, Shift+Tab wrapping, Escape dismissal,
// accessible dialog semantics, and focus restoration.

// ---------------------------------------------------------------------
// 44. Complete native dialog pattern
// ---------------------------------------------------------------------

export const CompleteNativeDialog: FC = (): ReactElement => {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const openDialog = (): void => {
    dialogRef.current?.showModal();
  };

  const closeDialog = (): void => {
    dialogRef.current?.close();
    requestAnimationFrame(() => {
      triggerRef.current?.focus();
    });
  };

  return (
    <div>
      <button ref={triggerRef} type="button" onClick={openDialog}>
        Open settings
      </button>

      <dialog ref={dialogRef} aria-labelledby="native-title">
        <h2 id="native-title">Settings</h2>

        <p>Update your preferences.</p>

        <button type="button" onClick={closeDialog}>
          Close
        </button>

        <button type="button">Save</button>
      </dialog>
    </div>
  );
};

// The native dialog is generally preferable to reproducing browser modal
// behavior manually when its semantics and interaction model fit the design.

// ---------------------------------------------------------------------
// 45. Testing a focus trap
// ---------------------------------------------------------------------
// - Open the modal using only the keyboard.
// - Verify that focus enters the modal.
// - Verify that the initial focus target is appropriate.
// - Press Tab repeatedly and verify that focus remains inside the modal.
// - Press Shift+Tab repeatedly and verify that focus remains inside the modal.
// - Verify that focus wraps from the last tabbable element to the first.
// - Verify that focus wraps from the first tabbable element to the last.
// - Verify that disabled controls are not treated as tabbable.
// - Verify that dynamically added controls participate correctly.
// - Press Escape and verify that the modal closes when Escape is supported.
// - Verify that focus returns to the invoking control after closing.
// - Verify that a logical fallback receives focus if the invoking control no longer exists.
// - Verify that the background cannot be activated while the modal is open.
// - Verify that the background is visually obscured when the dialog is modal.
// - Verify that the dialog has an accessible name.
// - Test with keyboard-only navigation.
// - Test with screen readers and browser combinations used by the application.

// ---------------------------------------------------------------------
// 46. Focus-trap checklist
// ---------------------------------------------------------------------
// - Use a focus trap only for interaction contexts that genuinely require containment.
// - Prefer the native <dialog> element with showModal() when appropriate.
// - Move focus into the modal when it opens.
// - Choose the initial focus target according to the dialog's content and task.
// - Keep Tab inside the active modal.
// - Keep Shift+Tab inside the active modal.
// - Support Escape when the dialog interaction allows dismissal.
// - Provide a visible close mechanism inside the dialog.
// - Keep focus indicators visible.
// - Prevent interaction with the background while a modal is active.
// - Use inertness for background content when appropriate.
// - Do not rely on aria-modal to implement the actual focus behavior.
// - Do not use aria-hidden as a substitute for inertness or focus containment.
// - Restore focus when the modal closes.
// - Provide a logical fallback when the original invoker no longer exists.
// - Recalculate tabbable elements when modal content changes.
// - Avoid positive tabindex values.
// - Do not trap focus in ordinary non-modal page sections.
// - Coordinate nested dialogs so only the active modal owns the focus scope.
// - Test both forward and reverse keyboard navigation.
// - Test the complete interaction with assistive technology.

// ---------------------------------------------------------------------
// 47. Integrated example
// ---------------------------------------------------------------------

// This component demonstrates a complete interaction flow:
//
// 1. The trigger opens the modal.
// 2. Focus moves into the modal.
// 3. Tab and Shift+Tab remain inside it.
// 4. Escape closes it.
// 5. The close button closes it.
// 6. Focus returns to the trigger.
// 7. The modal exposes an accessible name.
// 8. The background remains inert while the modal is open.

export const FocusTrapExample: FC = (): ReactElement => {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;

    if (!dialog) {
      return;
    }

    if (open && !dialog.open) {
      dialog.showModal();
    }

    if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  const closeDialog = (): void => {
    setOpen(false);

    requestAnimationFrame(() => {
      triggerRef.current?.focus();
    });
  };

  return (
    <main>
      <h1>Account settings</h1>

      <button
        ref={triggerRef}
        type="button"
        onClick={() => {
          setOpen(true);
        }}
      >
        Open settings
      </button>

      <button type="button">Background action</button>

      <dialog
        ref={dialogRef}
        aria-labelledby="settings-title"
        onClose={() => {
          setOpen(false);
        }}
      >
        <h2 id="settings-title">Account settings</h2>

        <p>Update your account settings.</p>

        <label>
          Display name
          <input type="text" defaultValue="Example" />
        </label>

        <button type="button" onClick={closeDialog}>
          Cancel
        </button>

        <button type="button">Save changes</button>
      </dialog>
    </main>
  );
};

export default FocusTrapExample;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - A focus trap confines keyboard focus to an active interaction context.
// - Focus traps are primarily appropriate for modal dialogs and similar contained interactions.
// - Ordinary page sections should not trap focus.
// - The native <dialog> element with showModal() should be preferred when it provides the required behavior.
// - A modal should move focus into the dialog when it opens.
// - Initial focus should be selected according to the dialog's content and task.
// - Tab should remain inside the modal.
// - Shift+Tab should remain inside the modal.
// - Escape commonly dismisses modal dialogs.
// - A visible close mechanism should be available inside the dialog.
// - Focus should return to the invoking control when the modal closes when that control still exists.
// - If the invoking control no longer exists, focus should move to a logical workflow destination.
// - aria-modal="true" communicates modal semantics but does not itself implement a focus trap.
// - aria-hidden is not a substitute for actual modal interaction blocking.
// - Background content must not remain interactable while a modal is active.
// - inert can make background content non-interactive and remove it from sequential focus navigation.
// - Custom focus traps need to account for dynamically changing tabbable elements.
// - Disabled controls should not participate in the sequential focus cycle.
// - Positive tabindex values should not be used to construct a modal focus order.
// - Long dialogs may need initial focus on a static heading or paragraph with tabIndex={-1}.
// - Destructive dialogs may place initial focus on the least destructive action.
// - Nested dialogs require separate focus scopes and restoration targets.
// - A focus trap, focus restoration, accessible naming, and background inertness are separate responsibilities.
// - Focus management should preserve a visible and understandable point of interaction throughout the modal lifecycle.
