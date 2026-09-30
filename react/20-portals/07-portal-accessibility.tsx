/**
 * Portal Accessibility
 * =====================
 *
 * React portals render a component's DOM output into a different location in the DOM
 * while keeping that component connected to the same React tree. This is useful for
 * overlays such as dialogs, menus, and tooltips, but moving DOM nodes does not
 * automatically make the resulting UI accessible.
 */

import { useEffect, useRef, useState, type ReactElement, type ReactNode } from "react";
import { createPortal } from "react-dom";

// ---------------------------------------------------------------------
// 1. Rendering content through a portal
// ---------------------------------------------------------------------

// A portal changes where React places the DOM nodes.
// It does not create a separate React tree.
interface PortalProps {
  readonly children: ReactNode;
  readonly container: Element;
}

function Portal({ children, container }: PortalProps): ReactElement {
  return createPortal(children, container);
}

// The portal target can be any existing DOM element.
function PortalExample(): ReactElement {
  const portalTarget = document.getElementById("portal-root");

  if (!portalTarget) {
    return <p>Portal target is unavailable.</p>;
  }

  return (
    <Portal container={portalTarget}>
      <p>This content is rendered inside the portal target.</p>
    </Portal>
  );
}

// ---------------------------------------------------------------------
// 2. Portals do not automatically provide accessibility
// ---------------------------------------------------------------------

// createPortal only changes the DOM location.
// It does not automatically provide:
// - dialog semantics
// - focus management
// - keyboard interaction
// - focus restoration
// - screen-reader behavior
//
// These responsibilities belong to the component using the portal.

// ---------------------------------------------------------------------
// 3. Modal dialog semantics
// ---------------------------------------------------------------------

interface ModalProps {
  readonly children: ReactNode;
  readonly onClose: () => void;
}

function Modal({ children, onClose }: ModalProps): ReactElement {
  const dialogRef = useRef<HTMLDivElement>(null);

  const portalTarget = document.getElementById("portal-root");

  useEffect(() => {
    // Move focus into the dialog when it opens.
    dialogRef.current?.focus();
  }, []);

  if (!portalTarget) {
    return <p>Portal target is unavailable.</p>;
  }

  return createPortal(
    <div
      aria-hidden="false"
      style={{
        position: "fixed",
        inset: 0,
        background: "rgb(0 0 0 / 0.5)",
      }}
    >
      <div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="dialog-title" tabIndex={-1}>
        <h2 id="dialog-title">Example dialog</h2>
        {children}
        <button type="button" onClick={onClose}>
          Close
        </button>
      </div>
    </div>,
    portalTarget,
  );
}

// A modal dialog should expose its purpose to assistive technology.
// `role="dialog"` identifies the element as a dialog.
// `aria-modal="true"` indicates that content outside the dialog is not part
// of the active modal interaction.
// `aria-labelledby` associates the dialog with its visible heading.

// ---------------------------------------------------------------------
// 4. Keyboard interaction
// ---------------------------------------------------------------------

function KeyboardAccessibleModal({ onClose }: { readonly onClose: () => void }): ReactElement {
  const dialogRef = useRef<HTMLDivElement>(null);
  const portalTarget = document.getElementById("portal-root");

  useEffect(() => {
    dialogRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  if (!portalTarget) {
    return <p>Portal target is unavailable.</p>;
  }

  return createPortal(
    <div
      role="presentation"
      style={{
        position: "fixed",
        inset: 0,
        background: "rgb(0 0 0 / 0.5)",
      }}
    >
      <div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="keyboard-dialog-title" tabIndex={-1}>
        <h2 id="keyboard-dialog-title">Keyboard-accessible dialog</h2>
        <p>Press Escape to close the dialog.</p>
        <button type="button" onClick={onClose}>
          Close
        </button>
      </div>
    </div>,
    portalTarget,
  );
}

// Escape is a common keyboard mechanism for dismissing a modal dialog.
// The event listener must be removed when the dialog unmounts.

// ---------------------------------------------------------------------
// 5. Restoring focus to the trigger
// ---------------------------------------------------------------------

function AccessibleModalExample(): ReactElement {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const handleClose = (): void => {
    setIsOpen(false);
    triggerRef.current?.focus();
  };

  return (
    <>
      <button ref={triggerRef} type="button" onClick={() => setIsOpen(true)}>
        Open dialog
      </button>

      {isOpen && (
        <Modal onClose={handleClose}>
          <p>Focus returns to the button when the dialog closes.</p>
        </Modal>
      )}
    </>
  );
}

// Returning focus to the control that opened a modal preserves a predictable
// keyboard-navigation path after the modal has been dismissed.

// ---------------------------------------------------------------------
// 6. Focus trapping
// ---------------------------------------------------------------------

function FocusTrapExample(): ReactElement {
  const firstFocusableRef = useRef<HTMLButtonElement>(null);
  const lastFocusableRef = useRef<HTMLButtonElement>(null);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>): void => {
    if (event.key !== "Tab") {
      return;
    }

    // A complete focus trap needs to account for every focusable element
    // and both forward and backward Tab navigation.
    //
    // This example only demonstrates the central idea:
    // focus must remain inside the modal while it is active.
    if (event.shiftKey && document.activeElement === firstFocusableRef.current) {
      event.preventDefault();
      lastFocusableRef.current?.focus();
    }

    if (!event.shiftKey && document.activeElement === lastFocusableRef.current) {
      event.preventDefault();
      firstFocusableRef.current?.focus();
    }
  };

  return (
    <div role="dialog" aria-modal="true" aria-labelledby="focus-trap-title" onKeyDown={handleKeyDown}>
      <h2 id="focus-trap-title">Focus trap</h2>
      <button ref={firstFocusableRef} type="button">
        First control
      </button>
      <button ref={lastFocusableRef} type="button">
        Last control
      </button>
    </div>
  );
}

// A production focus trap must include all relevant focusable elements,
// not just the first and last controls shown here.

// ---------------------------------------------------------------------
// 7. Preventing interaction with the background
// ---------------------------------------------------------------------

function ModalBackgroundExample(): ReactElement {
  return (
    <div role="dialog" aria-modal="true" aria-labelledby="background-dialog-title">
      {" "}
      <h2 id="background-dialog-title">Modal content</h2>{" "}
      <p>A modal should prevent users from accidentally interacting with the inactive application behind it. </p>{" "}
    </div>
  );
}

// `aria-modal` communicates modal semantics to assistive technologies.
// The application should also manage actual interaction and focus so that
// keyboard and pointer users cannot accidentally operate background content.

// ---------------------------------------------------------------------
// 8. Portal event propagation
// ---------------------------------------------------------------------

function PortalEventExample(): ReactElement {
  const portalTarget = document.getElementById("portal-root");

  if (!portalTarget) {
    return <p>Portal target is unavailable.</p>;
  }

  return (
    <div
      onClick={() => {
        console.log("React parent received the event.");
      }}
    >
      <Portal container={portalTarget}>
        <button type="button">Clicked through a portal</button>
      </Portal>
    </div>
  );
}

// Portal content is physically rendered elsewhere in the DOM,
// but React events still propagate according to the React tree.
// DOM placement and React-tree relationships are therefore different.

// ---------------------------------------------------------------------
// 9. Avoiding invalid portal targets
// ---------------------------------------------------------------------

function SafePortalExample(): ReactElement {
  const portalTarget = document.getElementById("portal-root");

  if (!portalTarget) {
    return null;
  }

  return createPortal(<p>Portal content</p>, portalTarget);
}

// A portal target may not exist during rendering.
// The component should handle that case instead of passing null to createPortal.

// ---------------------------------------------------------------------
// 10. Complete accessible portal example
// ---------------------------------------------------------------------

function AccessiblePortal(): ReactElement {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    dialogRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === "Escape") {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const portalTarget = document.getElementById("portal-root");

  const closeDialog = (): void => {
    setIsOpen(false);
    triggerRef.current?.focus();
  };

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
      >
        Open accessible dialog
      </button>

      {isOpen &&
        portalTarget &&
        createPortal(
          <div
            role="presentation"
            style={{
              position: "fixed",
              inset: 0,
              background: "rgb(0 0 0 / 0.5)",
            }}
          >
            <div
              ref={dialogRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="accessible-portal-title"
              tabIndex={-1}
            >
              <h2 id="accessible-portal-title">Accessible portal dialog</h2>

              <p>
                The dialog is rendered through a portal, receives focus when opened, and returns focus to its trigger
                when closed.
              </p>

              <button type="button" onClick={closeDialog}>
                Close
              </button>
            </div>
          </div>,
          portalTarget,
        )}
    </>
  );
}

export default AccessiblePortal;

// The portal is responsible only for rendering the dialog elsewhere in the DOM.
// Accessibility still requires explicit semantics, focus behavior, and keyboard handling.

// ---------------------------------------------------------------------
// 11. Portal accessibility principles
// ---------------------------------------------------------------------

// A portal is not inherently accessible or inaccessible.
//
// The important questions are:
// - What semantic role does the portaled content have?
// - Where should focus move when it opens?
// - Where should focus return when it closes?
// - Can keyboard users reach and leave every required control?
// - Can users interact with inactive background content?
// - Can assistive technology identify the dialog or other overlay correctly?
//
// These decisions belong to the component's interaction model, not to createPortal itself.

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - React portals change the DOM location of content without removing it from the React tree.
// - createPortal does not automatically provide accessibility behavior.
// - Modal portals should expose appropriate dialog semantics.
// - Focus should be deliberately moved into an active modal and restored when it closes.
// - Escape-key handling is commonly used to dismiss modal dialogs.
// - Focus trapping may be necessary when a modal must contain keyboard focus.
// - aria-modal describes modal semantics but does not replace actual interaction management.
// - Portal content still participates in React event propagation through its React parent.
// - Portal targets should be checked before rendering when they may be unavailable.
// - Accessible portal behavior requires both semantic markup and deliberate keyboard and focus management.
