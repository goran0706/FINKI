/**
 * Accessible Dialogs
 * ===================
 *
 * Accessible dialogs provide focused interaction with content that temporarily
 * appears above the current page. A dialog needs an accessible name, appropriate
 * keyboard behavior, predictable focus management, and a clear relationship with
 * the element that opened it.
 *
 * Native <dialog> with showModal() should be preferred when its behavior matches
 * the required interaction. Custom dialog implementations must reproduce the
 * accessibility behavior that the native element would otherwise provide.
 */

// ---------------------------------------------------------------------
// Imports
// ---------------------------------------------------------------------

import { type FC, type ReactElement, type ReactNode, useEffect, useId, useRef, useState } from "react";

// ---------------------------------------------------------------------
// 1. What a dialog is
// ---------------------------------------------------------------------

// A dialog is a window that presents content separately from the main page
// while keeping the underlying page available or unavailable according to
// whether the dialog is modal or non-modal.

export const DialogConcept: FC = (): ReactElement => {
  return (
    <section>
      <h1>Account</h1>

      <button type="button">Edit profile</button>
    </section>
  );
};

// The button above could open a dialog containing the editing interface.

// ---------------------------------------------------------------------
// 2. Modal versus non-modal dialogs
// ---------------------------------------------------------------------

// A modal dialog prevents interaction with the content outside the dialog
// while it is open.
//
// A non-modal dialog allows the user to continue interacting with the rest
// of the page.

export const ModalAndNonModalConcept: FC = (): ReactElement => {
  return (
    <div>
      <button type="button">Open modal</button>

      <button type="button">Open non-modal panel</button>
    </div>
  );
};

// The interaction model must make the distinction meaningful rather than
// merely changing the visual appearance.

// ---------------------------------------------------------------------
// 3. Prefer the native dialog element
// ---------------------------------------------------------------------

export const NativeDialogMarkup: FC = (): ReactElement => {
  return (
    <dialog>
      <h2>Example dialog</h2>

      <p>Dialog content.</p>

      <button type="button">Close</button>
    </dialog>
  );
};

// The native dialog element provides browser-level dialog behavior that a
// custom div-based implementation would otherwise need to recreate.

// ---------------------------------------------------------------------
// 4. Opening a native modal dialog
// ---------------------------------------------------------------------

export const NativeModalDialog: FC = (): ReactElement => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  const openDialog = (): void => {
    dialogRef.current?.showModal();
  };

  return (
    <div>
      <button type="button" onClick={openDialog}>
        Open dialog
      </button>

      <dialog ref={dialogRef}>
        <h2>Example dialog</h2>

        <p>This dialog is modal.</p>

        <button
          type="button"
          onClick={() => {
            dialogRef.current?.close();
          }}
        >
          Close
        </button>
      </dialog>
    </div>
  );
};

// showModal() opens the dialog as a modal and places it in the browser's
// top layer. Content outside the modal dialog becomes inert.

// ---------------------------------------------------------------------
// 5. Native modal behavior
// ---------------------------------------------------------------------

// When a native dialog is opened with showModal(), interaction with the rest
// of the document is blocked while the modal is active.
//
// This is different from dialog.show(), which creates a non-modal dialog.

export const DialogOpenMethods: FC = (): ReactElement => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  const openModeless = (): void => {
    dialogRef.current?.show();
  };

  const openModal = (): void => {
    dialogRef.current?.showModal();
  };

  return (
    <div>
      <button type="button" onClick={openModeless}>
        Open non-modal
      </button>

      <button type="button" onClick={openModal}>
        Open modal
      </button>

      <dialog ref={dialogRef}>
        <p>Example dialog.</p>

        <button
          type="button"
          onClick={() => {
            dialogRef.current?.close();
          }}
        >
          Close
        </button>
      </dialog>
    </div>
  );
};

// Choose modal or non-modal behavior according to the actual interaction
// requirement.

// ---------------------------------------------------------------------
// 6. Accessible dialog names
// ---------------------------------------------------------------------

// A dialog needs an accessible name.
//
// A visible heading is usually a good naming source.

export const NamedDialog: FC = (): ReactElement => {
  const titleId = useId();

  return (
    <dialog aria-labelledby={titleId}>
      <h2 id={titleId}>Edit profile</h2>

      <p>Update your account information.</p>
    </dialog>
  );
};

// aria-labelledby connects the dialog to its visible title.

// ---------------------------------------------------------------------
// 7. aria-label for dialogs
// ---------------------------------------------------------------------

export const LabelledDialog: FC = (): ReactElement => {
  return (
    <dialog aria-label="Settings">
      <p>Update your preferences.</p>
    </dialog>
  );
};

// aria-label can provide the name when a suitable visible title is not
// available. A visible title is generally easier for all users to understand.

// ---------------------------------------------------------------------
// 8. Dialog descriptions
// ---------------------------------------------------------------------

export const DescribedDialog: FC = (): ReactElement => {
  const titleId = useId();
  const descriptionId = useId();

  return (
    <dialog aria-labelledby={titleId} aria-describedby={descriptionId}>
      <h2 id={titleId}>Delete account</h2>

      <p id={descriptionId}>This action permanently removes the account and its data.</p>

      <button type="button">Cancel</button>

      <button type="button">Delete account</button>
    </dialog>
  );
};

// aria-describedby is appropriate when the referenced content is a concise
// description that can be understood as a single announcement.

// ---------------------------------------------------------------------
// 9. Do not overuse aria-describedby
// ---------------------------------------------------------------------

export const StructuredDialog: FC = (): ReactElement => {
  const titleId = useId();

  return (
    <dialog aria-labelledby={titleId}>
      <h2 id={titleId}>Account information</h2>

      <p>Your account includes the following information.</p>

      <ul>
        <li>Name</li>
        <li>Email address</li>
        <li>Preferences</li>
      </ul>
    </dialog>
  );
};

// Large or structurally complex content does not necessarily belong in
// aria-describedby. Users should be able to perceive its structure naturally.

// ---------------------------------------------------------------------
// 10. The close button
// ---------------------------------------------------------------------

export const DialogWithCloseButton: FC = (): ReactElement => {
  return (
    <dialog>
      <h2>Example dialog</h2>

      <button type="button">Close</button>
    </dialog>
  );
};

// A visible close button should normally be available so users can dismiss
// the dialog without relying only on Escape.

// ---------------------------------------------------------------------
// 11. Escape closes a modal dialog
// ---------------------------------------------------------------------

export const EscapeDialog: FC = (): ReactElement => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  return (
    <dialog ref={dialogRef}>
      <h2>Example dialog</h2>

      <button
        type="button"
        onClick={() => {
          dialogRef.current?.close();
        }}
      >
        Close
      </button>
    </dialog>
  );
};

// Native modal dialogs support Escape-based cancellation.
// Custom dialogs must implement equivalent keyboard behavior.

// ---------------------------------------------------------------------
// 12. Cancel versus close
// ---------------------------------------------------------------------

export const DialogCancelAndClose: FC = (): ReactElement => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;

    if (!dialog) {
      return;
    }

    const handleCancel = (): void => {
      console.log("Dialog cancellation requested");
    };

    const handleClose = (): void => {
      console.log("Dialog closed");
    };

    dialog.addEventListener("cancel", handleCancel);
    dialog.addEventListener("close", handleClose);

    return () => {
      dialog.removeEventListener("cancel", handleCancel);
      dialog.removeEventListener("close", handleClose);
    };
  }, []);

  return (
    <dialog ref={dialogRef}>
      <p>Example dialog.</p>

      <button
        type="button"
        onClick={() => {
          dialogRef.current?.close();
        }}
      >
        Close
      </button>
    </dialog>
  );
};

// The cancel event represents a request to close, such as Escape.
// The close event fires after the dialog has actually closed.

// ---------------------------------------------------------------------
// 13. Focus when a dialog opens
// ---------------------------------------------------------------------

// Focus should move into a modal dialog when it opens.
//
// The exact initial focus target depends on the dialog's content and purpose.

export const InitialDialogFocus: FC = (): ReactElement => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const openDialog = (): void => {
    dialogRef.current?.showModal();
    closeRef.current?.focus();
  };

  return (
    <div>
      <button type="button" onClick={openDialog}>
        Open dialog
      </button>

      <dialog ref={dialogRef}>
        <h2>Example dialog</h2>

        <button
          ref={closeRef}
          type="button"
          onClick={() => {
            dialogRef.current?.close();
          }}
        >
          Close
        </button>
      </dialog>
    </div>
  );
};

// For short dialogs, the first useful interactive control is often a suitable
// initial focus target.

// ---------------------------------------------------------------------
// 14. Focus static content for large dialogs
// ---------------------------------------------------------------------

export const LargeDialogFocus: FC = (): ReactElement => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  const openDialog = (): void => {
    dialogRef.current?.showModal();
    headingRef.current?.focus();
  };

  return (
    <div>
      <button type="button" onClick={openDialog}>
        View information
      </button>

      <dialog ref={dialogRef}>
        <h2 ref={headingRef} tabIndex={-1}>
          Important information
        </h2>

        <p>
          This dialog contains enough information that beginning with the first interactive control could move the
          beginning of the content out of view.
        </p>

        <button
          type="button"
          onClick={() => {
            dialogRef.current?.close();
          }}
        >
          Close
        </button>
      </dialog>
    </div>
  );
};

// A static heading or paragraph can be made programmatically focusable with
// tabIndex={-1} when it is the most useful initial focus destination.

// ---------------------------------------------------------------------
// 15. Focus destructive dialog actions carefully
// ---------------------------------------------------------------------

export const DestructiveDialog: FC = (): ReactElement => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  return (
    <dialog ref={dialogRef}>
      <h2>Delete account</h2>

      <p>This action cannot be undone.</p>

      <button
        type="button"
        onClick={() => {
          dialogRef.current?.close();
        }}
      >
        Cancel
      </button>

      <button
        type="button"
        onClick={() => {
          dialogRef.current?.close("delete");
        }}
      >
        Delete account
      </button>
    </dialog>
  );
};

// For irreversible actions, initial focus on the least destructive action can
// reduce the chance of an accidental destructive operation.

// ---------------------------------------------------------------------
// 16. Keep focus inside a modal dialog
// ---------------------------------------------------------------------

// A modal dialog contains its keyboard focus sequence.
//
// Tab and Shift+Tab should not move focus to the inert page behind it.

export const ModalFocusConcept: FC = (): ReactElement => {
  return (
    <dialog>
      <button type="button">First</button>

      <button type="button">Second</button>

      <button type="button">Last</button>
    </dialog>
  );
};

// Native showModal() supplies the modal interaction boundary.
// Custom implementations must explicitly contain focus.

// ---------------------------------------------------------------------
// 17. Focus restoration
// ---------------------------------------------------------------------

export const RestoringFocusDialog: FC = (): ReactElement => {
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
        Edit profile
      </button>

      {open && (
        <dialog open>
          <h2>Edit profile</h2>

          <button type="button" onClick={closeDialog}>
            Close
          </button>
        </dialog>
      )}
    </div>
  );
};

// When a dialog closes, focus normally returns to the element that opened it.
// If that element no longer exists, focus should move to a logical alternative.

// ---------------------------------------------------------------------
// 18. Invoking element may disappear
// ---------------------------------------------------------------------

export const RemovedTrigger: FC = (): ReactElement => {
  const [open, setOpen] = useState(false);
  const [showTrigger, setShowTrigger] = useState(true);

  return (
    <div>
      {showTrigger && (
        <button
          type="button"
          onClick={() => {
            setOpen(true);
          }}
        >
          Open dialog
        </button>
      )}

      <button
        type="button"
        onClick={() => {
          setShowTrigger(false);
        }}
      >
        Remove trigger
      </button>

      {open && (
        <dialog open>
          <h2>Example dialog</h2>

          <button
            type="button"
            onClick={() => {
              setOpen(false);
            }}
          >
            Close
          </button>
        </dialog>
      )}
    </div>
  );
};

// If the invoking element no longer exists, restoring focus to it is
// impossible. The application should choose another logical destination.

// ---------------------------------------------------------------------
// 19. Dialog focus should remain visible
// ---------------------------------------------------------------------

export const VisibleDialogFocus: FC = (): ReactElement => {
  return (
    <dialog>
      <h2>Settings</h2>

      <label>
        Display name
        <input type="text" />
      </label>

      <button type="button">Save</button>

      <button type="button">Cancel</button>
    </dialog>
  );
};

// Do not move focus to an element that is visually hidden, obscured, or
// scrolled outside the useful area of the dialog.

// ---------------------------------------------------------------------
// 20. Do not focus the entire dialog unnecessarily
// ---------------------------------------------------------------------

export const DialogContainer: FC = (): ReactElement => {
  const titleId = useId();

  return (
    <dialog aria-labelledby={titleId}>
      <h2 id={titleId}>Preferences</h2>

      <label>
        Language
        <select>
          <option>Example</option>
        </select>
      </label>
    </dialog>
  );
};

// The dialog container itself does not normally need tabIndex={0}.
// Focus should normally land on an appropriate descendant.

// ---------------------------------------------------------------------
// 21. Custom dialog roles
// ---------------------------------------------------------------------

export const CustomDialogRole: FC = (): ReactElement => {
  const titleId = useId();

  return (
    <div role="dialog" aria-modal="true" aria-labelledby={titleId}>
      <h2 id={titleId}>Example dialog</h2>

      <button type="button">Close</button>
    </div>
  );
};

// role="dialog" communicates semantics but does not create modal behavior.
// Custom implementations must provide focus management and interaction
// containment themselves.

// ---------------------------------------------------------------------
// 22. aria-modal describes modality
// ---------------------------------------------------------------------

export const ModalAriaDialog: FC = (): ReactElement => {
  return (
    <div role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <h2 id="modal-title">Example dialog</h2>

      <button type="button">Close</button>
    </div>
  );
};

// aria-modal should only be used when the dialog actually behaves as modal
// for all users.

// ---------------------------------------------------------------------
// 23. aria-modal does not create a focus trap
// ---------------------------------------------------------------------

export const AriaModalIsNotBehavior: FC = (): ReactElement => {
  return (
    <div role="dialog" aria-modal="true">
      <p>The application still has to implement the modal behavior.</p>
    </div>
  );
};

// ARIA communicates semantics. It does not automatically prevent keyboard,
// pointer, or programmatic interaction with the background.

// ---------------------------------------------------------------------
// 24. Background interaction
// ---------------------------------------------------------------------

export const ModalBackground: FC = (): ReactElement => {
  return (
    <div>
      <main>
        <h1>Account</h1>

        <p>The page behind the dialog.</p>
      </main>

      <dialog>
        <h2>Example dialog</h2>

        <button type="button">Close</button>
      </dialog>
    </div>
  );
};

// A custom modal must make the background unavailable to interaction.
// Native showModal() provides this behavior for the containing document.

// ---------------------------------------------------------------------
// 25. Do not use aria-hidden as a substitute for modal behavior
// ---------------------------------------------------------------------

export const BackgroundSemanticsConcept: FC = (): ReactElement => {
  return (
    <div>
      <main>
        <h1>Main content</h1>
      </main>

      <div role="dialog" aria-modal="true" aria-labelledby="dialog-heading">
        <h2 id="dialog-heading">Example</h2>
      </div>
    </div>
  );
};

// A dialog marked modal must actually prevent interaction with the background.
// Hiding background semantics alone does not make it physically or
// programmatically inert.

// ---------------------------------------------------------------------
// 26. Native dialog and inert background
// ---------------------------------------------------------------------

export const NativeInertBackground: FC = (): ReactElement => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  return (
    <div>
      <main>
        <h1>Account</h1>

        <button type="button">Background action</button>
      </main>

      <button
        type="button"
        onClick={() => {
          dialogRef.current?.showModal();
        }}
      >
        Open dialog
      </button>

      <dialog ref={dialogRef}>
        <h2>Modal content</h2>

        <button
          type="button"
          onClick={() => {
            dialogRef.current?.close();
          }}
        >
          Close
        </button>
      </dialog>
    </div>
  );
};

// showModal() makes the rest of the document inert while the dialog is modal.

// ---------------------------------------------------------------------
// 27. Backdrop
// ---------------------------------------------------------------------

export const DialogBackdrop: FC = (): ReactElement => {
  return (
    <dialog className="example-dialog">
      <h2>Example dialog</h2>

      <button type="button">Close</button>
    </dialog>
  );
};

// The native dialog can be visually separated from the page using the
// ::backdrop pseudo-element.
//
// Example CSS:
//
// .example-dialog::backdrop {
//     background: rgb(0 0 0 / 0.5);
// }

// Visual obscuring helps communicate modality but does not replace the
// interaction behavior.

// ---------------------------------------------------------------------
// 28. Do not close solely on backdrop clicks
// ---------------------------------------------------------------------

export const ExplicitDialogDismissal: FC = (): ReactElement => {
  return (
    <dialog>
      <h2>Confirm changes</h2>

      <button type="button">Cancel</button>

      <button type="button">Save</button>
    </dialog>
  );
};

// If backdrop dismissal is supported by the design, it should not remove the
// only clear way to understand or cancel the dialog.

// ---------------------------------------------------------------------
// 29. Dialog forms
// ---------------------------------------------------------------------

export const DialogForm: FC = (): ReactElement => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  return (
    <dialog ref={dialogRef}>
      <h2>Choose an option</h2>

      <form method="dialog">
        <label htmlFor="dialog-option">Option</label>

        <select id="dialog-option" name="option" defaultValue="" required>
          <option value="" disabled>
            Select an option
          </option>

          <option value="example">Example</option>

          <option value="other">Other</option>
        </select>

        <button value="cancel">Cancel</button>

        <button value="confirm">Confirm</button>
      </form>
    </dialog>
  );
};

// A form with method="dialog" can close a native dialog without performing a
// normal page navigation. The submitting button can provide a return value.

// ---------------------------------------------------------------------
// 30. Dialog return values
// ---------------------------------------------------------------------

export const DialogReturnValue: FC = (): ReactElement => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [result, setResult] = useState("");

  useEffect(() => {
    const dialog = dialogRef.current;

    if (!dialog) {
      return;
    }

    const handleClose = (): void => {
      setResult(dialog.returnValue);
    };

    dialog.addEventListener("close", handleClose);

    return () => {
      dialog.removeEventListener("close", handleClose);
    };
  }, []);

  return (
    <div>
      <button
        type="button"
        onClick={() => {
          dialogRef.current?.showModal();
        }}
      >
        Choose
      </button>

      <dialog ref={dialogRef}>
        <h2>Choose an action</h2>

        <button
          type="button"
          onClick={() => {
            dialogRef.current?.close("cancel");
          }}
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={() => {
            dialogRef.current?.close("confirm");
          }}
        >
          Confirm
        </button>
      </dialog>

      <p role="status">Result: {result || "No result"}</p>
    </div>
  );
};

// close(value) updates the native dialog's returnValue.

// ---------------------------------------------------------------------
// 31. React state and native dialog state
// ---------------------------------------------------------------------

export const ReactControlledDialog: FC = (): ReactElement => {
  const [open, setOpen] = useState(false);
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

  return (
    <div>
      <button
        type="button"
        onClick={() => {
          setOpen(true);
        }}
      >
        Open
      </button>

      <dialog
        ref={dialogRef}
        onClose={() => {
          setOpen(false);
        }}
      >
        <h2>Settings</h2>

        <button
          type="button"
          onClick={() => {
            setOpen(false);
          }}
        >
          Close
        </button>
      </dialog>
    </div>
  );
};

// React state can represent application state while the HTMLDialogElement
// manages the browser's native dialog behavior.

// ---------------------------------------------------------------------
// 32. Avoid calling showModal repeatedly
// ---------------------------------------------------------------------

export const SafeDialogOpening: FC = (): ReactElement => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  const openDialog = (): void => {
    const dialog = dialogRef.current;

    if (!dialog || dialog.open) {
      return;
    }

    dialog.showModal();
  };

  return (
    <div>
      <button type="button" onClick={openDialog}>
        Open
      </button>

      <dialog ref={dialogRef}>
        <p>Example content.</p>

        <button
          type="button"
          onClick={() => {
            dialogRef.current?.close();
          }}
        >
          Close
        </button>
      </dialog>
    </div>
  );
};

// Calling showModal() on an already open dialog can produce an InvalidStateError.
// Guard the operation when imperative opening is necessary.

// ---------------------------------------------------------------------
// 33. Dialog close events
// ---------------------------------------------------------------------

export const DialogCloseEvent: FC = (): ReactElement => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [closed, setClosed] = useState(false);

  return (
    <div>
      <button
        type="button"
        onClick={() => {
          setClosed(false);
          dialogRef.current?.showModal();
        }}
      >
        Open
      </button>

      <dialog
        ref={dialogRef}
        onClose={() => {
          setClosed(true);
        }}
      >
        <h2>Example</h2>

        <button
          type="button"
          onClick={() => {
            dialogRef.current?.close();
          }}
        >
          Close
        </button>
      </dialog>

      {closed && <p role="status">Dialog closed.</p>}
    </div>
  );
};

// The close event is useful when application state needs to respond to a
// dialog closing through any supported mechanism.

// ---------------------------------------------------------------------
// 34. Dialog cancellation
// ---------------------------------------------------------------------

export const DialogCancellation: FC = (): ReactElement => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [cancellations, setCancellations] = useState(0);

  return (
    <div>
      <button
        type="button"
        onClick={() => {
          dialogRef.current?.showModal();
        }}
      >
        Open
      </button>

      <dialog
        ref={dialogRef}
        onCancel={() => {
          setCancellations((current) => current + 1);
        }}
      >
        <h2>Example</h2>

        <button
          type="button"
          onClick={() => {
            dialogRef.current?.close();
          }}
        >
          Close
        </button>
      </dialog>

      <p>Escape requests cancellation {cancellations} time(s).</p>
    </div>
  );
};

// The cancel event can be observed or prevented when the application has a
// specific reason to control Escape-based cancellation.

// ---------------------------------------------------------------------
// 35. Preventing cancellation
// ---------------------------------------------------------------------

export const ConfirmBeforeClose: FC = (): ReactElement => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [preventEscape, setPreventEscape] = useState(false);

  return (
    <div>
      <label>
        <input
          type="checkbox"
          checked={preventEscape}
          onChange={(event) => {
            setPreventEscape(event.target.checked);
          }}
        />
        Require explicit closing
      </label>

      <button
        type="button"
        onClick={() => {
          dialogRef.current?.showModal();
        }}
      >
        Open
      </button>

      <dialog
        ref={dialogRef}
        onCancel={(event) => {
          if (preventEscape) {
            event.preventDefault();
          }
        }}
      >
        <h2>Example</h2>

        <button
          type="button"
          onClick={() => {
            dialogRef.current?.close();
          }}
        >
          Close
        </button>
      </dialog>
    </div>
  );
};

// Prevent cancellation only when the interaction genuinely requires explicit
// confirmation. Do not unnecessarily trap users in dialogs.

// ---------------------------------------------------------------------
// 36. Dialog containing a form
// ---------------------------------------------------------------------

export const EditableDialog: FC = (): ReactElement => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  return (
    <div>
      <button
        type="button"
        onClick={() => {
          dialogRef.current?.showModal();
        }}
      >
        Edit
      </button>

      <dialog ref={dialogRef}>
        <h2>Edit profile</h2>

        <form method="dialog">
          <label htmlFor="dialog-name">Name</label>

          <input id="dialog-name" name="name" defaultValue="John Doe" />

          <button value="cancel">Cancel</button>

          <button value="save">Save</button>
        </form>
      </dialog>
    </div>
  );
};

// Native form controls remain the preferred choice inside dialogs.

// ---------------------------------------------------------------------
// 37. Dialog validation
// ---------------------------------------------------------------------

export const DialogValidation: FC = (): ReactElement => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  return (
    <dialog ref={dialogRef}>
      <h2>Enter your email</h2>

      <form method="dialog">
        <label htmlFor="dialog-email">Email address</label>

        <input id="dialog-email" name="email" type="email" required />

        <button value="cancel">Cancel</button>

        <button value="continue">Continue</button>
      </form>
    </dialog>
  );
};

// Native form validation can prevent a dialog form from closing until its
// constraints are satisfied.

// ---------------------------------------------------------------------
// 38. Dialog with a status message
// ---------------------------------------------------------------------

export const DialogStatus: FC = (): ReactElement => {
  const [saved, setSaved] = useState(false);

  return (
    <dialog open={saved}>
      <h2>Save result</h2>

      <p role="status">Changes saved successfully.</p>

      <button
        type="button"
        onClick={() => {
          setSaved(false);
        }}
      >
        Close
      </button>
    </dialog>
  );
};

// Important status information should remain understandable independently of
// the dialog's visual presentation.

// ---------------------------------------------------------------------
// 39. Alert dialogs
// ---------------------------------------------------------------------

export const AlertDialog: FC = (): ReactElement => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  return (
    <div>
      <button
        type="button"
        onClick={() => {
          dialogRef.current?.showModal();
        }}
      >
        Show alert
      </button>

      <dialog ref={dialogRef} aria-labelledby="alert-title" aria-describedby="alert-message">
        <h2 id="alert-title">Session expired</h2>

        <p id="alert-message">Sign in again to continue.</p>

        <button
          type="button"
          onClick={() => {
            dialogRef.current?.close();
          }}
        >
          Sign in
        </button>
      </dialog>
    </div>
  );
};

// An alertdialog pattern is intended for messages that require immediate
// attention. Do not use alert-style interaction for ordinary information.

// ---------------------------------------------------------------------
// 40. alertdialog semantics
// ---------------------------------------------------------------------

export const AlertDialogRole: FC = (): ReactElement => {
  return (
    <div
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <h2 id="alert-dialog-title">Delete account?</h2>

      <p id="alert-dialog-description">This action cannot be undone.</p>

      <button type="button">Cancel</button>

      <button type="button">Delete</button>
    </div>
  );
};

// alertdialog is a specialized dialog role for urgent attention.
// The implementation still needs correct modal and focus behavior.

// ---------------------------------------------------------------------
// 41. Confirmation dialogs
// ---------------------------------------------------------------------

export const ConfirmationDialog: FC = (): ReactElement => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  return (
    <div>
      <button
        type="button"
        onClick={() => {
          dialogRef.current?.showModal();
        }}
      >
        Delete item
      </button>

      <dialog ref={dialogRef}>
        <h2>Delete item?</h2>

        <p>This action cannot be undone.</p>

        <button
          type="button"
          onClick={() => {
            dialogRef.current?.close("cancel");
          }}
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={() => {
            dialogRef.current?.close("confirm");
          }}
        >
          Delete
        </button>
      </dialog>
    </div>
  );
};

// Confirmation dialogs should make the action, consequences, and available
// choices explicit.

// ---------------------------------------------------------------------
// 42. Avoid unnecessary confirmation dialogs
// ---------------------------------------------------------------------

export const DirectAction: FC = (): ReactElement => {
  return (
    <button
      type="button"
      onClick={() => {
        console.log("Saved");
      }}
    >
      Save
    </button>
  );
};

// Not every action requires a dialog. Additional interaction should have a
// meaningful purpose rather than creating unnecessary interruption.

// ---------------------------------------------------------------------
// 43. Nested dialogs
// ---------------------------------------------------------------------

export const NestedDialogConcept: FC = (): ReactElement => {
  return (
    <div>
      <dialog>
        <h2>First dialog</h2>

        <button type="button">Open second dialog</button>
      </dialog>
    </div>
  );
};

// Multiple modal layers require careful focus restoration and stacking logic.
// Avoid nested modal workflows unless the interaction genuinely requires them.

// ---------------------------------------------------------------------
// 44. Dialogs rendered through portals
// ---------------------------------------------------------------------

export const PortalDialogConcept: FC = (): ReactElement => {
  return (
    <dialog>
      <h2>Portal dialog</h2>

      <button type="button">Close</button>
    </dialog>
  );
};

// A React portal can render dialog content elsewhere in the DOM while
// preserving React's component relationships.
//
// The resulting DOM location still matters for native dialog behavior,
// stacking, and accessibility.

// ---------------------------------------------------------------------
// 45. Dialog content should remain inside the dialog
// ---------------------------------------------------------------------

export const DialogContentBoundary: FC = (): ReactElement => {
  return (
    <dialog>
      <h2>Preferences</h2>

      <label>
        Language
        <select>
          <option>Example</option>
        </select>
      </label>

      <button type="button">Save</button>
    </dialog>
  );
};

// Controls required to operate the dialog should be descendants of the
// dialog container.

// ---------------------------------------------------------------------
// 46. Do not hide dialog controls from assistive technology
// ---------------------------------------------------------------------

export const AvailableDialogControls: FC = (): ReactElement => {
  return (
    <dialog>
      <h2>Settings</h2>

      <button type="button">Save</button>

      <button type="button">Cancel</button>
    </dialog>
  );
};

// A visible control that users need to operate should not be hidden from the
// accessibility tree.

// ---------------------------------------------------------------------
// 47. Disabled dialog actions
// ---------------------------------------------------------------------

export const DisabledDialogAction: FC = (): ReactElement => {
  const [valid, setValid] = useState(false);

  return (
    <dialog>
      <h2>Confirm</h2>

      <label>
        <input
          type="checkbox"
          checked={valid}
          onChange={(event) => {
            setValid(event.target.checked);
          }}
        />
        I understand
      </label>

      <button type="button" disabled={!valid}>
        Confirm
      </button>
    </dialog>
  );
};

// Use native disabled semantics when an action genuinely cannot currently be
// performed.

// ---------------------------------------------------------------------
// 48. Dialog with long content
// ---------------------------------------------------------------------

export const LongDialog: FC = (): ReactElement => {
  return (
    <dialog className="long-dialog">
      <h2>Terms and conditions</h2>

      <div>
        <p>This dialog contains several paragraphs of information.</p>

        <p>Users should be able to scroll through the content while keeping the dialog controls available.</p>

        <p>The dialog should maintain an understandable reading order.</p>
      </div>

      <button type="button">Close</button>
    </dialog>
  );
};

// Long dialogs need a sensible focus target and a layout that does not force
// focused controls outside the visible dialog area.

// ---------------------------------------------------------------------
// 49. Scrollable dialog content
// ---------------------------------------------------------------------

export const ScrollableDialog: FC = (): ReactElement => {
  return (
    <dialog>
      <h2>Information</h2>

      <div className="dialog-content">
        <p>Long content belongs in a logically scrollable region.</p>

        <p>The close control remains available after the content.</p>
      </div>

      <button type="button">Close</button>
    </dialog>
  );
};

// Example CSS:
//
// .dialog-content {
//     max-block-size: 60vh;
//     overflow: auto;
// }

// The exact layout is application-specific, but focused content should remain
// visible while the user moves through the dialog.

// ---------------------------------------------------------------------
// 50. Do not create a keyboard trap accidentally
// ---------------------------------------------------------------------

export const SafeDialogControls: FC = (): ReactElement => {
  return (
    <dialog>
      <h2>Example</h2>

      <input aria-label="Example field" />

      <button type="button">Save</button>

      <button type="button">Close</button>
    </dialog>
  );
};

// A modal dialog intentionally contains focus while it is open, but users
// must always have a reliable way to dismiss or otherwise exit the modal.

// ---------------------------------------------------------------------
// 51. Focus order inside dialogs
// ---------------------------------------------------------------------

export const LogicalDialogOrder: FC = (): ReactElement => {
  return (
    <dialog>
      <h2>Edit profile</h2>

      <label>
        Name
        <input type="text" />
      </label>

      <label>
        Email
        <input type="email" />
      </label>

      <button type="button">Cancel</button>

      <button type="button">Save</button>
    </dialog>
  );
};

// The DOM order should reflect the intended interaction order.

// ---------------------------------------------------------------------
// 52. Avoid positive tabindex
// ---------------------------------------------------------------------

export const DialogTabOrder: FC = (): ReactElement => {
  return (
    <dialog>
      <button type="button">First</button>

      <button type="button">Second</button>
    </dialog>
  );
};

// Do not use positive tabindex values to manufacture a custom dialog focus
// sequence. Native document order and appropriate tabindex={-1} targets are
// normally sufficient.

// ---------------------------------------------------------------------
// 53. Dialog title as a focus target
// ---------------------------------------------------------------------

export const FocusableDialogTitle: FC = (): ReactElement => {
  const titleRef = useRef<HTMLHeadingElement>(null);

  const focusTitle = (): void => {
    titleRef.current?.focus();
  };

  return (
    <dialog>
      <h2 ref={titleRef} tabIndex={-1}>
        Important information
      </h2>

      <button type="button" onClick={focusTitle}>
        Review information
      </button>
    </dialog>
  );
};

// Static elements can use tabIndex={-1} when they need to receive
// programmatic focus without becoming part of the sequential Tab order.

// ---------------------------------------------------------------------
// 54. Accessible dialog component API
// ---------------------------------------------------------------------

interface DialogProps {
  readonly children: ReactNode;
  readonly labelledBy: string;
  readonly open: boolean;
  readonly onClose: () => void;
}

export const Dialog: FC<DialogProps> = ({ children, labelledBy, open, onClose }): ReactElement | null => {
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

  if (!open) {
    return null;
  }

  return (
    <dialog ref={dialogRef} aria-labelledby={labelledBy} onClose={onClose}>
      {children}
    </dialog>
  );
};

// A reusable dialog API should make the accessibility relationships explicit
// instead of forcing every consumer to recreate them.

// ---------------------------------------------------------------------
// 55. Complete reusable dialog
// ---------------------------------------------------------------------

interface CompleteDialogProps {
  readonly title: string;
  readonly children: ReactNode;
  readonly open: boolean;
  readonly onClose: () => void;
}

export const CompleteDialog: FC<CompleteDialogProps> = ({ title, children, open, onClose }): ReactElement | null => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const triggerRef = useRef<HTMLElement | null>(null);

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

  useEffect(() => {
    const dialog = dialogRef.current;

    if (!dialog) {
      return;
    }

    const handleClose = (): void => {
      onClose();

      requestAnimationFrame(() => {
        triggerRef.current?.focus();
      });
    };

    dialog.addEventListener("close", handleClose);

    return () => {
      dialog.removeEventListener("close", handleClose);
    };
  }, [onClose]);

  if (!open) {
    return null;
  }

  return (
    <dialog ref={dialogRef} aria-labelledby={titleId}>
      <h2 id={titleId}>{title}</h2>

      {children}

      <button
        type="button"
        onClick={() => {
          dialogRef.current?.close();
        }}
      >
        Close
      </button>
    </dialog>
  );
};

// The trigger reference must be supplied by the surrounding interaction in a
// real implementation. This component demonstrates the responsibilities a
// reusable dialog abstraction needs to account for.

// ---------------------------------------------------------------------
// 56. Dialog focus restoration with a known trigger
// ---------------------------------------------------------------------

interface FocusRestoringDialogProps {
  readonly open: boolean;
  readonly onClose: () => void;
  readonly triggerRef: React.RefObject<HTMLButtonElement | null>;
}

export const FocusRestoringDialog: FC<FocusRestoringDialogProps> = ({
  open,
  onClose,
  triggerRef,
}): ReactElement | null => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();

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

  useEffect(() => {
    const dialog = dialogRef.current;

    if (!dialog) {
      return;
    }

    const handleClose = (): void => {
      onClose();

      requestAnimationFrame(() => {
        triggerRef.current?.focus();
      });
    };

    dialog.addEventListener("close", handleClose);

    return () => {
      dialog.removeEventListener("close", handleClose);
    };
  }, [onClose, triggerRef]);

  if (!open) {
    return null;
  }

  return (
    <dialog ref={dialogRef} aria-labelledby={titleId}>
      <h2 id={titleId}>Example dialog</h2>

      <p>Dialog content.</p>

      <button
        type="button"
        onClick={() => {
          dialogRef.current?.close();
        }}
      >
        Close
      </button>
    </dialog>
  );
};

// The trigger reference gives the dialog a reliable restoration target.

// ---------------------------------------------------------------------
// 57. Custom dialog focus containment
// ---------------------------------------------------------------------

// Native <dialog> is preferable because it supplies modal behavior.
// A custom implementation needs an explicit focus-management strategy.

export const CustomModalConcept: FC = (): ReactElement => {
  return (
    <div role="dialog" aria-modal="true" aria-labelledby="custom-title">
      <h2 id="custom-title">Custom dialog</h2>

      <button type="button">Cancel</button>

      <button type="button">Save</button>
    </div>
  );
};

// A production custom modal must also contain Tab and Shift+Tab focus,
// handle Escape, block background interaction, and restore focus.

// ---------------------------------------------------------------------
// 58. Custom dialog keyboard behavior
// ---------------------------------------------------------------------

export const CustomDialogKeyboard: FC = (): ReactElement => {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>): void => {
    if (event.key === "Escape") {
      console.log("Close dialog");
    }
  };

  return (
    <div role="dialog" aria-modal="true" onKeyDown={handleKeyDown}>
      <h2>Custom dialog</h2>

      <button type="button">Close</button>
    </div>
  );
};

// Escape handling is only one part of a custom modal implementation.
// Keyboard focus containment and focus restoration are separate responsibilities.

// ---------------------------------------------------------------------
// 59. Dialog and screen readers
// ---------------------------------------------------------------------

export const ScreenReaderDialog: FC = (): ReactElement => {
  const titleId = useId();
  const descriptionId = useId();

  return (
    <dialog aria-labelledby={titleId} aria-describedby={descriptionId}>
      <h2 id={titleId}>Account deleted</h2>

      <p id={descriptionId}>Your account has been removed.</p>

      <button type="button">Close</button>
    </dialog>
  );
};

// Correct semantics, names, descriptions, and focus placement help assistive
// technology users understand why the dialog appeared and what to do next.

// ---------------------------------------------------------------------
// 60. Dialog and visual hierarchy
// ---------------------------------------------------------------------

export const DialogVisualStructure: FC = (): ReactElement => {
  return (
    <dialog>
      <h2>Preferences</h2>

      <p>Choose how your account should behave.</p>

      <fieldset>
        <legend>Notifications</legend>

        <label>
          <input type="checkbox" name="emailNotifications" />
          Email notifications
        </label>
      </fieldset>

      <button type="button">Save</button>
    </dialog>
  );
};

// Visual hierarchy should correspond to the semantic hierarchy.

// ---------------------------------------------------------------------
// 61. Avoid dialogs for ordinary page content
// ---------------------------------------------------------------------

export const RegularContent: FC = (): ReactElement => {
  return (
    <section>
      <h2>Account details</h2>

      <p>Your account information is displayed here.</p>
    </section>
  );
};

// If content can remain part of the normal page flow, a dialog may add
// unnecessary focus and interaction complexity.

// ---------------------------------------------------------------------
// 62. Dialog versus disclosure
// ---------------------------------------------------------------------

export const DisclosureInsteadOfDialog: FC = (): ReactElement => {
  const [open, setOpen] = useState(false);

  return (
    <section>
      <h2>Additional information</h2>

      <button
        type="button"
        aria-expanded={open}
        onClick={() => {
          setOpen((current) => !current);
        }}
      >
        {open ? "Hide" : "Show"}
      </button>

      {open && <p>Additional information remains part of the page.</p>}
    </section>
  );
};

// A disclosure is often more appropriate when users should continue
// interacting with the surrounding page.

// ---------------------------------------------------------------------
// 63. Dialog versus separate page
// ---------------------------------------------------------------------

export const SeparatePageNavigation: FC = (): ReactElement => {
  return <a href="/settings">Open settings</a>;
};

// If the task represents a substantial destination rather than a temporary
// interaction, normal navigation may be more appropriate than a dialog.

// ---------------------------------------------------------------------
// 64. Dialog state and conditional rendering
// ---------------------------------------------------------------------

export const ConditionalDialog: FC = (): ReactElement => {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button
        type="button"
        onClick={() => {
          setOpen(true);
        }}
      >
        Open
      </button>

      {open && (
        <dialog open>
          <h2>Example</h2>

          <button
            type="button"
            onClick={() => {
              setOpen(false);
            }}
          >
            Close
          </button>
        </dialog>
      )}
    </div>
  );
};

// Conditional rendering can create the dialog only when needed, but an
// implementation still needs to establish correct modal behavior and focus.

// ---------------------------------------------------------------------
// 65. Avoid direct DOM removal
// ---------------------------------------------------------------------

export const StateDrivenClose: FC = (): ReactElement => {
  const [open, setOpen] = useState(true);

  return (
    <div>
      {open && (
        <dialog open>
          <h2>Example</h2>

          <button
            type="button"
            onClick={() => {
              setOpen(false);
            }}
          >
            Close
          </button>
        </dialog>
      )}
    </div>
  );
};

// React components should normally change application state rather than
// manually removing React-managed DOM nodes.

// ---------------------------------------------------------------------
// 66. Dialog accessibility testing
// ---------------------------------------------------------------------

export const DialogTestingChecklist: FC = (): ReactElement => {
  return (
    <ul>
      <li>The dialog has an accessible name.</li>

      <li>The dialog is actually modal when aria-modal is true.</li>

      <li>Focus moves into the dialog when it opens.</li>

      <li>Focus remains within the modal while it is open.</li>

      <li>Escape can close the dialog when appropriate.</li>

      <li>A visible close control is available.</li>

      <li>Focus returns to the invoking element when the dialog closes.</li>

      <li>A logical focus destination exists if the invoking element was removed.</li>

      <li>Focus indicators remain visible.</li>

      <li>Dialog content remains understandable with a screen reader.</li>
    </ul>
  );
};

// Testing should include keyboard-only interaction and assistive technology,
// not only visual inspection.

// ---------------------------------------------------------------------
// 67. Keyboard testing
// ---------------------------------------------------------------------

export const KeyboardDialogChecklist: FC = (): ReactElement => {
  return (
    <ol>
      <li>Activate the trigger with the keyboard.</li>

      <li>Confirm focus enters the dialog.</li>

      <li>Press Tab repeatedly.</li>

      <li>Confirm focus does not escape the modal.</li>

      <li>Press Shift+Tab repeatedly.</li>

      <li>Confirm reverse focus movement remains inside the dialog.</li>

      <li>Press Escape when dismissal is allowed.</li>

      <li>Confirm focus returns to the invoking control.</li>
    </ol>
  );
};

// Keyboard testing verifies the interaction contract directly.

// ---------------------------------------------------------------------
// 68. Integrated accessible dialog
// ---------------------------------------------------------------------

export const AccessibleDialogExample: FC = (): ReactElement => {
  const [open, setOpen] = useState(false);
  const [saved, setSaved] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;

    if (!dialog) {
      return;
    }

    if (open && !dialog.open) {
      dialog.showModal();
      nameRef.current?.focus();
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

  const saveChanges = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    setSaved(true);
    closeDialog();
  };

  return (
    <section>
      <h1>Account settings</h1>

      <button
        ref={triggerRef}
        type="button"
        onClick={() => {
          setSaved(false);
          setOpen(true);
        }}
      >
        Edit profile
      </button>

      {saved && <p role="status">Profile saved.</p>}

      <dialog
        ref={dialogRef}
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        onClose={() => {
          if (open) {
            setOpen(false);
          }
        }}
      >
        <h2 id={titleId}>Edit profile</h2>

        <p id={descriptionId}>Update the information associated with your profile.</p>

        <form onSubmit={saveChanges}>
          <label htmlFor="profile-display-name">Display name</label>

          <input ref={nameRef} id="profile-display-name" name="displayName" type="text" defaultValue="John Doe" />

          <div>
            <button type="button" onClick={closeDialog}>
              Cancel
            </button>

            <button type="submit">Save changes</button>
          </div>
        </form>
      </dialog>
    </section>
  );
};

export default AccessibleDialogExample;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - A dialog presents temporary content separately from the surrounding page.
// - Modal dialogs prevent interaction with the content outside the dialog.
// - Prefer the native <dialog> element when its behavior matches the required interaction.
// - showModal() opens a native dialog as a modal and makes the rest of the document inert.
// - show() opens a native dialog without making it modal.
// - A dialog needs an accessible name, usually supplied by a visible heading through aria-labelledby.
// - aria-label can provide a name when a suitable visible title is unavailable.
// - aria-describedby can provide a concise accessible description when appropriate.
// - Large or structurally complex content should not automatically be placed in aria-describedby.
// - Modal dialogs should move focus into the dialog when they open.
// - The best initial focus target depends on the dialog's purpose and content.
// - Large dialogs may initially focus a static heading or paragraph with tabIndex={-1}.
// - Destructive workflows may initially focus the least destructive action.
// - Modal dialogs should keep keyboard focus within the dialog while open.
// - Escape should close a dialog when the interaction permits cancellation.
// - A visible close button should normally be available.
// - When a dialog closes, focus should normally return to the element that invoked it.
// - If the invoking element no longer exists, focus should move to a logical alternative.
// - aria-modal communicates modality but does not itself create a focus trap or block interaction.
// - A custom modal must implement focus containment, Escape handling, background blocking, and focus restoration.
// - aria-modal should only be used when the dialog actually behaves as modal for all users.
// - Native dialog forms can use method="dialog" and return values to communicate outcomes.
// - The close event indicates that the dialog has actually closed, while cancel represents a cancellation request.
// - Dialogs should preserve logical DOM order and visible focus indicators.
// - Positive tabindex values should not be used to manufacture a dialog focus order.
// - Native form controls should remain preferred inside dialogs.
// - Alert dialogs are specialized for messages that require immediate attention.
// - Not every temporary interaction needs a dialog; disclosures and normal navigation may be more appropriate.
// - Dialogs should be tested with keyboard-only interaction and assistive technologies.
// - A production dialog should be evaluated as a complete interaction system rather than as an ARIA role alone.
