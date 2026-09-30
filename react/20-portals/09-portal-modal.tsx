/**
 * Portal Modal
 * ============
 *
 * A modal is a common portal use case because its dialog and backdrop often
 * need to escape ancestor clipping, stacking contexts, and positioning rules.
 * `createPortal` changes the DOM destination while the modal remains part of
 * the same React tree that owns its state.
 *
 * A portal alone does not make an element a modal. A usable modal also needs
 * appropriate dialog semantics, a labelled accessible name, keyboard handling,
 * focus management, and a predictable way to close the dialog.
 */

import { type FC, type MouseEvent, type ReactElement, type ReactNode, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface ModalProps {
  readonly open: boolean;
  readonly title: string;
  readonly onClose: () => void;
  readonly children: ReactNode;
  readonly initialFocusRef?: React.RefObject<HTMLElement | null>;
}

export interface ModalTriggerProps {
  readonly onOpen: () => void;
}

export interface ModalExampleProps {
  readonly target: HTMLElement;
}

export interface ModalContentProps {
  readonly title: string;
  readonly onClose: () => void;
}

export interface ModalPortalProps {
  readonly target: HTMLElement;
  readonly children: ReactNode;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * Provides the basic modal implementation.
 *
 * The dialog is rendered through a portal so that its fixed positioning and
 * stacking context are independent of the component that owns the modal state.
 */
export const PortalModal: FC<ModalProps> = ({
  open,
  title,
  onClose,
  children,
  initialFocusRef,
}): ReactElement | null => {
  const titleId: string = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedElementRef = useRef<HTMLElement | null>(null);

  useEffect((): (() => void) | undefined => {
    if (!open) {
      return undefined;
    }

    previouslyFocusedElementRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;

    const focusTarget: HTMLElement | null = initialFocusRef?.current ?? dialogRef.current;

    focusTarget?.focus();

    return (): void => {
      previouslyFocusedElementRef.current?.focus();
      previouslyFocusedElementRef.current = null;
    };
  }, [initialFocusRef, open]);

  useEffect((): (() => void) | undefined => {
    if (!open) {
      return undefined;
    }

    const handleKeyDown = (event: globalThis.KeyboardEvent): void => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return (): void => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose, open]);

  if (!open) {
    return null;
  }

  return (
    <div
      role="presentation"
      style={{
        position: "fixed",
        inset: 0,
        display: "grid",
        placeItems: "center",
        padding: "1rem",
        background: "rgb(0 0 0 / 0.5)",
        zIndex: 1000,
      }}
      onMouseDown={(event: MouseEvent<HTMLDivElement>) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        style={{
          width: "min(32rem, 100%)",
          padding: "1.5rem",
          background: "white",
          color: "black",
          borderRadius: "0.5rem",
          boxShadow: "0 1rem 3rem rgb(0 0 0 / 0.3)",
        }}
      >
        <header>
          <h2 id={titleId}>{title}</h2>
          <button type="button" onClick={onClose} aria-label="Close dialog">
            ×
          </button>
        </header>

        {children}
      </div>
    </div>
  );
};

/**
 * Demonstrates the basic modal trigger and state relationship.
 *
 * The trigger remains in the normal React tree while the modal itself is
 * rendered into the portal destination.
 */
export const BasicModalExample: FC<ModalExampleProps> = ({ target }): ReactElement => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <section>
      <h2>Basic portal modal</h2>

      <button type="button" onClick={() => setOpen(true)}>
        Open modal
      </button>

      {createPortal(
        <PortalModal open={open} title="Example modal" onClose={() => setOpen(false)}>
          <p>This dialog is rendered into a separate DOM container while its state remains in the React parent.</p>
          <button type="button" onClick={() => setOpen(false)}>
            Close
          </button>
        </PortalModal>,
        target,
      )}
    </section>
  );
};

/**
 * Demonstrates the Escape-key closing behavior of a modal.
 *
 * Escape handling is an application behavior implemented around the portal;
 * `createPortal` does not provide it automatically.
 */
export const EscapeKeyModalExample: FC<ModalExampleProps> = ({ target }): ReactElement => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <section>
      <h2>Escape-key dismissal</h2>

      <button type="button" onClick={() => setOpen(true)}>
        Open Escape-enabled modal
      </button>

      {createPortal(
        <PortalModal open={open} title="Escape-key example" onClose={() => setOpen(false)}>
          <p>Press Escape or use the close button to dismiss this dialog.</p>
        </PortalModal>,
        target,
      )}
    </section>
  );
};

/**
 * Demonstrates clicking the backdrop to close a modal.
 *
 * The backdrop handler checks `event.target === event.currentTarget` so a
 * click inside the dialog does not accidentally close the modal.
 */
export const BackdropDismissModalExample: FC<ModalExampleProps> = ({ target }): ReactElement => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <section>
      <h2>Backdrop dismissal</h2>

      <button type="button" onClick={() => setOpen(true)}>
        Open backdrop-dismissable modal
      </button>

      {open
        ? createPortal(
            <div
              role="presentation"
              style={{
                position: "fixed",
                inset: 0,
                display: "grid",
                placeItems: "center",
                background: "rgb(0 0 0 / 0.5)",
                zIndex: 1000,
              }}
              onMouseDown={(event: MouseEvent<HTMLDivElement>) => {
                if (event.target === event.currentTarget) {
                  setOpen(false);
                }
              }}
            >
              <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="backdrop-modal-title"
                style={{
                  padding: "1.5rem",
                  background: "white",
                }}
              >
                <h2 id="backdrop-modal-title">Backdrop dismissal</h2>
                <p>Clicking outside this dialog closes it.</p>
                <button type="button" onClick={() => setOpen(false)}>
                  Close
                </button>
              </div>
            </div>,
            target,
          )
        : null}
    </section>
  );
};

/**
 * Demonstrates returning focus to the element that opened the modal.
 *
 * A modal temporarily changes the user's interaction context. Restoring focus
 * after dismissal allows keyboard users to continue from their previous place.
 */
export const FocusRestorationModalExample: FC<ModalExampleProps> = ({ target }): ReactElement => {
  const [open, setOpen] = useState<boolean>(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  return (
    <section>
      <h2>Focus restoration</h2>

      <button ref={triggerRef} type="button" onClick={() => setOpen(true)}>
        Open focus-managed modal
      </button>

      {createPortal(
        <PortalModal open={open} title="Focus restoration" onClose={() => setOpen(false)}>
          <p>Closing the modal returns focus to the opening button.</p>
          <button type="button" onClick={() => setOpen(false)}>
            Close
          </button>
        </PortalModal>,
        target,
      )}
    </section>
  );
};

/**
 * Demonstrates directing initial focus to a specific control inside the modal.
 *
 * Passing an explicit focus target is useful when the first interactive control
 * is not necessarily the most appropriate place for keyboard focus.
 */
export const InitialFocusModalExample: FC<ModalExampleProps> = ({ target }): ReactElement => {
  const [open, setOpen] = useState<boolean>(false);
  const confirmButtonRef = useRef<HTMLButtonElement>(null);

  return (
    <section>
      <h2>Initial focus target</h2>

      <button type="button" onClick={() => setOpen(true)}>
        Open confirmation modal
      </button>

      {createPortal(
        <PortalModal
          open={open}
          title="Confirm action"
          onClose={() => setOpen(false)}
          initialFocusRef={confirmButtonRef}
        >
          <p>The confirmation action receives initial focus.</p>
          <button ref={confirmButtonRef} type="button" onClick={() => setOpen(false)}>
            Confirm
          </button>
          <button type="button" onClick={() => setOpen(false)}>
            Cancel
          </button>
        </PortalModal>,
        target,
      )}
    </section>
  );
};

/**
 * Demonstrates the semantic attributes used for a modal dialog.
 *
 * `role="dialog"` identifies the dialog, `aria-modal="true"` communicates the
 * modal interaction model, and `aria-labelledby` associates the dialog with
 * its visible accessible name.
 */
export const AccessibleDialogSemanticsExample: FC<ModalExampleProps> = ({ target }): ReactElement => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <section>
      <h2>Dialog semantics</h2>

      <button type="button" onClick={() => setOpen(true)}>
        Open accessible dialog
      </button>

      {createPortal(
        <PortalModal open={open} title="Accessible dialog" onClose={() => setOpen(false)}>
          <p>The dialog has an accessible name and modal semantics.</p>
          <button type="button" onClick={() => setOpen(false)}>
            Close dialog
          </button>
        </PortalModal>,
        target,
      )}
    </section>
  );
};

/**
 * Demonstrates a form inside a portal modal.
 *
 * Portal content remains ordinary React content, so form state and submission
 * logic can remain owned by the same component that controls the modal.
 */
export const FormModalExample: FC<ModalExampleProps> = ({ target }): ReactElement => {
  const [open, setOpen] = useState<boolean>(false);
  const [name, setName] = useState<string>("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    setOpen(false);
  };

  return (
    <section>
      <h2>Form inside a modal</h2>

      <button type="button" onClick={() => setOpen(true)}>
        Open form modal
      </button>

      {createPortal(
        <PortalModal open={open} title="Profile form" onClose={() => setOpen(false)}>
          <form onSubmit={handleSubmit}>
            <label>
              Name
              <input value={name} onChange={(event) => setName(event.target.value)} />
            </label>

            <button type="submit">Save</button>

            <button type="button" onClick={() => setOpen(false)}>
              Cancel
            </button>
          </form>
        </PortalModal>,
        target,
      )}
    </section>
  );
};

/**
 * Demonstrates a common misconception about portals and modal behavior.
 *
 * `createPortal` only changes the DOM destination. It does not automatically
 * add dialog semantics, focus management, Escape handling, backdrop behavior,
 * or focus trapping.
 */
export const PortalDoesNotCreateModalExample: FC<PortalExampleProps> = ({ target }): ReactElement => {
  return (
    <section>
      <h2>Portal does not create modal behavior</h2>

      {createPortal(
        <div
          style={{
            padding: "1rem",
            background: "white",
            border: "1px solid black",
          }}
        >
          <p>This content is portaled, but it is not automatically a modal just because createPortal is being used.</p>
        </div>,
        target,
      )}
    </section>
  );
};

/**
 * Demonstrates an explicit close handler that can be shared by multiple
 * dismissal mechanisms.
 *
 * Centralizing the close operation keeps the modal state transition consistent
 * whether the user clicks the close button, presses Escape, or dismisses the
 * backdrop.
 */
export const SharedCloseHandlerModalExample: FC<ModalExampleProps> = ({ target }): ReactElement => {
  const [open, setOpen] = useState<boolean>(false);

  const handleClose = (): void => {
    setOpen(false);
  };

  const handleOpen = (): void => {
    setOpen(true);
  };

  return (
    <section>
      <h2>Shared close handler</h2>

      <button type="button" onClick={handleOpen}>
        Open modal
      </button>

      {createPortal(
        <PortalModal open={open} title="Shared dismissal logic" onClose={handleClose}>
          <p>Multiple dismissal mechanisms can use the same close operation.</p>
          <button type="button" onClick={handleClose}>
            Close
          </button>
        </PortalModal>,
        target,
      )}
    </section>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const PortalModalDemo: FC = (): ReactElement => {
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);

  useEffect((): (() => void) => {
    const existingTarget: HTMLElement | null = document.getElementById("portal-modal-root");

    if (existingTarget) {
      setPortalTarget(existingTarget);

      return (): void => {
        // The surrounding document owns the existing container.
      };
    }

    const createdTarget: HTMLDivElement = document.createElement("div");

    createdTarget.id = "portal-modal-root";
    document.body.appendChild(createdTarget);
    setPortalTarget(createdTarget);

    return (): void => {
      createdTarget.remove();
    };
  }, []);

  if (!portalTarget) {
    return (
      <main>
        <h1>Portal Modal</h1>
        <p>Preparing the modal portal destination.</p>
      </main>
    );
  }

  return (
    <main>
      <h1>Portal Modal</h1>

      <BasicModalExample target={portalTarget} />

      <EscapeKeyModalExample target={portalTarget} />

      <BackdropDismissModalExample target={portalTarget} />

      <FocusRestorationModalExample target={portalTarget} />

      <InitialFocusModalExample target={portalTarget} />

      <AccessibleDialogSemanticsExample target={portalTarget} />

      <FormModalExample target={portalTarget} />

      <PortalDoesNotCreateModalExample target={portalTarget} />

      <SharedCloseHandlerModalExample target={portalTarget} />
    </main>
  );
};

export default PortalModalDemo;

// ---------------------------------------------------------------------
// Summary
// A modal is commonly rendered through a portal to escape ancestor DOM constraints.
// `createPortal` changes the DOM destination but does not create modal behavior by itself.
// Modal dialogs should use appropriate dialog semantics such as role="dialog" and aria-modal.
// A visible heading can provide the dialog's accessible name through aria-labelledby.
// Escape-key handling must be implemented by the modal component.
// Backdrop dismissal should distinguish clicks on the backdrop from clicks inside the dialog.
// Focus should move into the modal when it opens and return to the triggering element when it closes.
// An explicit initial focus target can be useful for confirmation or destructive-action dialogs.
// Modal focus management is separate from portal rendering and may require a complete focus trap for complex dialogs.
// Portal content remains ordinary React content, so forms and state can be managed normally.
// ---------------------------------------------------------------------
