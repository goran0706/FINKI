/**
 * Portal Use Cases
 * ================
 *
 * Portals are useful when React content must remain connected to its React
 * tree while being rendered into a different DOM location. Common applications
 * include modals, overlays, tooltips, dropdowns, toasts, and other UI that
 * needs to escape an ancestor's layout or stacking context.
 *
 * The portal itself does not provide positioning, focus management, keyboard
 * handling, accessibility semantics, or state management. Those behaviors must
 * be implemented by the surrounding UI component.
 */

import { type FC, type ReactElement, type ReactNode, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface PortalTargetProps {
  readonly target: HTMLElement;
}

export interface OverlayProps {
  readonly children: ReactNode;
  readonly onClose: () => void;
}

export interface TooltipProps {
  readonly target: HTMLElement;
  readonly label: string;
  readonly children: ReactNode;
}

export interface ToastProps {
  readonly target: HTMLElement;
  readonly message: string;
  readonly onDismiss: () => void;
}

export interface DropdownProps {
  readonly target: HTMLElement;
  readonly open: boolean;
  readonly onClose: () => void;
}

export interface ContainerExampleProps {
  readonly target: HTMLElement;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * Demonstrates an overlay use case.
 *
 * Rendering the overlay through a portal allows it to escape clipping,
 * positioning, and stacking contexts created by ancestors of the trigger.
 */
export const OverlayExample: FC<OverlayProps> = ({ children, onClose }): ReactElement => {
  return (
    <div
      role="presentation"
      style={{
        position: "fixed",
        inset: 0,
        background: "rgb(0 0 0 / 0.5)",
      }}
      onClick={onClose}
    >
      <div
        role="presentation"
        style={{
          position: "absolute",
          inset: "2rem",
          background: "white",
          padding: "1rem",
        }}
        onClick={(event) => event.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

/**
 * Demonstrates a modal as a portal use case.
 *
 * The modal state remains owned by the React component that opened it, while
 * the modal's DOM nodes can be rendered into a top-level portal container.
 */
export const ModalUseCaseExample: FC<PortalTargetProps> = ({ target }): ReactElement => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <section>
      <h2>Modal</h2>
      <button type="button" onClick={() => setOpen(true)}>
        Open modal
      </button>

      {open
        ? createPortal(
            <OverlayExample onClose={() => setOpen(false)}>
              <h3>Example modal</h3>
              <p>The modal is rendered through a portal while its open state remains in the React component.</p>
              <button type="button" onClick={() => setOpen(false)}>
                Close modal
              </button>
            </OverlayExample>,
            target,
          )
        : null}
    </section>
  );
};

/**
 * Demonstrates a tooltip use case.
 *
 * A portal can place tooltip content outside an ancestor that has `overflow:
 * hidden`, but positioning the tooltip still requires application-specific
 * measurements or a positioning system.
 */
export const TooltipUseCaseExample: FC<ContainerExampleProps> = ({ target }): ReactElement => {
  const [visible, setVisible] = useState<boolean>(false);

  return (
    <section>
      <h2>Tooltip</h2>

      <button
        type="button"
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        aria-describedby={visible ? "portal-tooltip" : undefined}
      >
        Hover for tooltip
      </button>

      {visible
        ? createPortal(
            <div
              id="portal-tooltip"
              role="tooltip"
              style={{
                position: "fixed",
                top: "8rem",
                left: "2rem",
                padding: "0.5rem",
                background: "black",
                color: "white",
              }}
            >
              Tooltip content rendered through a portal.
            </div>,
            target,
          )
        : null}
    </section>
  );
};

/**
 * Demonstrates a toast notification use case.
 *
 * Toasts commonly render into a dedicated container near the document body so
 * they are not affected by layout constraints surrounding the triggering UI.
 */
export const ToastUseCaseExample: FC<ContainerExampleProps> = ({ target }): ReactElement => {
  const [visible, setVisible] = useState<boolean>(false);

  return (
    <section>
      <h2>Toast notification</h2>

      <button type="button" onClick={() => setVisible(true)}>
        Show toast
      </button>

      {visible
        ? createPortal(
            <div
              role="status"
              aria-live="polite"
              style={{
                position: "fixed",
                right: "1rem",
                bottom: "1rem",
                padding: "1rem",
                background: "white",
                border: "1px solid black",
              }}
            >
              <span>Saved successfully.</span>
              <button type="button" onClick={() => setVisible(false)}>
                Dismiss
              </button>
            </div>,
            target,
          )
        : null}
    </section>
  );
};

/**
 * Demonstrates a dropdown use case.
 *
 * A portal can be useful when a dropdown would otherwise be clipped by an
 * ancestor. Real positioning logic should account for the trigger's geometry,
 * viewport boundaries, scrolling, and resizing.
 */
export const DropdownUseCaseExample: FC<ContainerExampleProps> = ({ target }): ReactElement => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <section>
      <h2>Dropdown</h2>

      <button type="button" aria-expanded={open} onClick={() => setOpen((current) => !current)}>
        Open dropdown
      </button>

      {open
        ? createPortal(
            <div
              role="menu"
              style={{
                position: "fixed",
                top: "12rem",
                left: "2rem",
                padding: "0.5rem",
                background: "white",
                border: "1px solid black",
              }}
            >
              <button type="button" role="menuitem" onClick={() => setOpen(false)}>
                Select item
              </button>
              <button type="button" role="menuitem" onClick={() => setOpen(false)}>
                Close menu
              </button>
            </div>,
            target,
          )
        : null}
    </section>
  );
};

/**
 * Demonstrates a context-menu-style use case.
 *
 * The portal can place the menu near the document root while the React state
 * remains associated with the component that triggered it.
 */
export const ContextMenuUseCaseExample: FC<ContainerExampleProps> = ({ target }): ReactElement => {
  const [open, setOpen] = useState<boolean>(false);

  const handleContextMenu = (event: React.MouseEvent<HTMLDivElement>): void => {
    event.preventDefault();
    setOpen(true);
  };

  return (
    <section>
      <h2>Context menu</h2>

      <div
        onContextMenu={handleContextMenu}
        style={{
          padding: "2rem",
          border: "1px dashed black",
        }}
      >
        Right-click this area.
      </div>

      {open
        ? createPortal(
            <div
              role="menu"
              style={{
                position: "fixed",
                top: "16rem",
                left: "2rem",
                padding: "0.5rem",
                background: "white",
                border: "1px solid black",
              }}
            >
              <button type="button" onClick={() => setOpen(false)}>
                Close context menu
              </button>
            </div>,
            target,
          )
        : null}
    </section>
  );
};

/**
 * Demonstrates a loading indicator use case.
 *
 * A global loading indicator can be rendered into a dedicated portal target
 * without moving the state that determines whether loading is active.
 */
export const LoadingOverlayUseCaseExample: FC<ContainerExampleProps> = ({ target }): ReactElement => {
  const [loading, setLoading] = useState<boolean>(false);

  useEffect((): (() => void) | undefined => {
    if (!loading) {
      return undefined;
    }

    const timeoutId: number = window.setTimeout(() => {
      setLoading(false);
    }, 1500);

    return (): void => {
      window.clearTimeout(timeoutId);
    };
  }, [loading]);

  return (
    <section>
      <h2>Loading overlay</h2>

      <button type="button" onClick={() => setLoading(true)}>
        Start loading
      </button>

      {loading
        ? createPortal(
            <div
              role="status"
              aria-live="polite"
              style={{
                position: "fixed",
                inset: 0,
                display: "grid",
                placeItems: "center",
                background: "rgb(255 255 255 / 0.8)",
              }}
            >
              Loading...
            </div>,
            target,
          )
        : null}
    </section>
  );
};

/**
 * Demonstrates a full-screen application overlay.
 *
 * This is useful for UI that must cover the entire viewport regardless of
 * which component originally requested it.
 */
export const FullScreenOverlayUseCaseExample: FC<ContainerExampleProps> = ({ target }): ReactElement => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <section>
      <h2>Full-screen overlay</h2>

      <button type="button" onClick={() => setOpen(true)}>
        Show full-screen overlay
      </button>

      {open
        ? createPortal(
            <div
              style={{
                position: "fixed",
                inset: 0,
                display: "grid",
                placeItems: "center",
                background: "rgb(0 0 0 / 0.75)",
                color: "white",
              }}
            >
              <div>
                <p>This UI covers the viewport from a portal container.</p>
                <button type="button" onClick={() => setOpen(false)}>
                  Close overlay
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
 * Demonstrates that portals are not inherently a positioning solution.
 *
 * The portal only changes the DOM destination. The example intentionally
 * renders content at a fixed location to emphasize that positioning must be
 * implemented separately.
 */
export const PortalIsNotPositioningExample: FC<ContainerExampleProps> = ({ target }): ReactElement => {
  const [visible, setVisible] = useState<boolean>(false);

  return (
    <section>
      <h2>Portal is not a positioning system</h2>

      <button type="button" onClick={() => setVisible((current) => !current)}>
        Toggle positioned content
      </button>

      {visible
        ? createPortal(
            <div
              style={{
                position: "fixed",
                top: "1rem",
                right: "1rem",
                padding: "1rem",
                background: "white",
                border: "1px solid black",
              }}
            >
              The portal changed the DOM destination. CSS positioning determines where this element appears.
            </div>,
            target,
          )
        : null}
    </section>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const PortalUseCasesDemo: FC = (): ReactElement => {
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);
  const createdTargetRef = useRef<HTMLDivElement | null>(null);

  useEffect((): (() => void) => {
    const existingTarget: HTMLElement | null = document.getElementById("portal-use-cases-root");

    if (existingTarget) {
      setPortalTarget(existingTarget);

      return (): void => {
        // The surrounding document owns this existing container.
      };
    }

    const createdTarget: HTMLDivElement = document.createElement("div");

    createdTarget.id = "portal-use-cases-root";
    document.body.appendChild(createdTarget);
    createdTargetRef.current = createdTarget;
    setPortalTarget(createdTarget);

    return (): void => {
      createdTarget.remove();
      createdTargetRef.current = null;
    };
  }, []);

  if (!portalTarget) {
    return (
      <main>
        <h1>Portal Use Cases</h1>
        <p>Preparing the portal destination.</p>
      </main>
    );
  }

  return (
    <main>
      <h1>Portal Use Cases</h1>

      <ModalUseCaseExample target={portalTarget} />

      <TooltipUseCaseExample target={portalTarget} />

      <ToastUseCaseExample target={portalTarget} />

      <DropdownUseCaseExample target={portalTarget} />

      <ContextMenuUseCaseExample target={portalTarget} />

      <LoadingOverlayUseCaseExample target={portalTarget} />

      <FullScreenOverlayUseCaseExample target={portalTarget} />

      <PortalIsNotPositioningExample target={portalTarget} />
    </main>
  );
};

export default PortalUseCasesDemo;

// ---------------------------------------------------------------------
// Summary
// Portals are commonly used for modals, overlays, tooltips, dropdowns, toasts, context menus, and loading indicators.
// A portal allows UI to escape DOM constraints such as clipping and ancestor stacking contexts.
// Portal rendering does not automatically provide positioning, focus management, keyboard handling, or accessibility behavior.
// Tooltip and dropdown positioning requires separate geometry and viewport logic.
// Modal and overlay components need their own interaction and accessibility semantics.
// Toast notifications can use live-region semantics to communicate updates to assistive technology.
// Portal state remains ordinary React state even when the rendered DOM is elsewhere.
// A portal changes the DOM destination, not the React ownership or behavior of the content.
// ---------------------------------------------------------------------
