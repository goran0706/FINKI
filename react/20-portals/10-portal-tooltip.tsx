/**
 * Portal Tooltip
 * ===============
 *
 * A tooltip is a common portal use case because its visual position often needs
 * to escape clipping, overflow, stacking contexts, or other layout constraints
 * created by ancestor elements. The tooltip can remain part of the same React
 * tree while its DOM node is rendered into a dedicated portal container.
 *
 * A portal does not position a tooltip automatically. The trigger's geometry
 * must be measured and the tooltip must be positioned explicitly. Accessible
 * tooltip behavior also requires an appropriate relationship between the
 * trigger and the tooltip content.
 */

import {
  type FC,
  type FocusEvent,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface TooltipProps {
  readonly target: HTMLElement;
  readonly label: string;
  readonly children: ReactNode;
}

export interface TooltipPosition {
  readonly top: number;
  readonly left: number;
}

export interface TooltipContentProps {
  readonly id: string;
  readonly label: string;
  readonly position: TooltipPosition;
}

export interface TooltipTriggerProps {
  readonly id: string;
  readonly label: string;
  readonly onShow: () => void;
  readonly onHide: () => void;
}

export interface TooltipExampleProps {
  readonly target: HTMLElement;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * Renders the visual tooltip through a portal.
 *
 * The tooltip uses `position: fixed`, so its coordinates are calculated from
 * the trigger's viewport-relative `getBoundingClientRect()` values.
 */
export const PortalTooltipContent: FC<TooltipContentProps> = ({ id, label, position }): ReactElement => {
  return (
    <div
      id={id}
      role="tooltip"
      style={{
        position: "fixed",
        top: position.top,
        left: position.left,
        padding: "0.5rem 0.75rem",
        background: "black",
        color: "white",
        borderRadius: "0.25rem",
        zIndex: 1000,
        pointerEvents: "none",
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </div>
  );
};

/**
 * Provides the trigger behavior for a tooltip.
 *
 * The tooltip is shown for both pointer hover and keyboard focus. This prevents
 * the tooltip from being exclusively dependent on pointer interaction.
 */
export const TooltipTrigger: FC<TooltipTriggerProps> = ({ id, label, onShow, onHide }): ReactElement => {
  const handleMouseEnter = (_event: MouseEvent<HTMLButtonElement>): void => {
    onShow();
  };

  const handleMouseLeave = (_event: MouseEvent<HTMLButtonElement>): void => {
    onHide();
  };

  const handleFocus = (_event: FocusEvent<HTMLButtonElement>): void => {
    onShow();
  };

  const handleBlur = (_event: FocusEvent<HTMLButtonElement>): void => {
    onHide();
  };

  return (
    <button
      type="button"
      aria-describedby={id}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
    >
      {label}
    </button>
  );
};

/**
 * Demonstrates the basic tooltip pattern with a portal.
 *
 * The trigger remains in the normal DOM tree while the tooltip content is
 * inserted into the supplied portal container.
 */
export const BasicPortalTooltip: FC<TooltipProps> = ({ target, label, children }): ReactElement => {
  const tooltipId: string = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [visible, setVisible] = useState<boolean>(false);
  const [position, setPosition] = useState<TooltipPosition>({
    top: 0,
    left: 0,
  });

  const updatePosition = (): void => {
    const trigger: HTMLButtonElement | null = triggerRef.current;

    if (!trigger) {
      return;
    }

    const rect: DOMRect = trigger.getBoundingClientRect();

    setPosition({
      top: rect.bottom + 8,
      left: rect.left,
    });
  };

  useEffect((): (() => void) | undefined => {
    if (!visible) {
      return undefined;
    }

    updatePosition();

    const handleViewportChange = (): void => {
      updatePosition();
    };

    window.addEventListener("resize", handleViewportChange);
    window.addEventListener("scroll", handleViewportChange, true);

    return (): void => {
      window.removeEventListener("resize", handleViewportChange);
      window.removeEventListener("scroll", handleViewportChange, true);
    };
  }, [visible]);

  return (
    <section>
      <h2>Basic portal tooltip</h2>

      <button
        ref={triggerRef}
        type="button"
        aria-describedby={visible ? tooltipId : undefined}
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        onFocus={() => setVisible(true)}
        onBlur={() => setVisible(false)}
      >
        {children}
      </button>

      {visible ? createPortal(<PortalTooltipContent id={tooltipId} label={label} position={position} />, target) : null}
    </section>
  );
};

/**
 * Demonstrates a tooltip that is available through keyboard focus as well as
 * pointer hover.
 *
 * Keyboard focus is important because a tooltip that only appears on pointer
 * hover is unavailable to users who navigate with a keyboard.
 */
export const KeyboardAccessibleTooltip: FC<TooltipProps> = ({ target, label, children }): ReactElement => {
  const tooltipId: string = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [visible, setVisible] = useState<boolean>(false);
  const [position, setPosition] = useState<TooltipPosition>({
    top: 0,
    left: 0,
  });

  useEffect((): (() => void) | undefined => {
    if (!visible) {
      return undefined;
    }

    const updatePosition = (): void => {
      const trigger: HTMLButtonElement | null = triggerRef.current;

      if (!trigger) {
        return;
      }

      const rect: DOMRect = trigger.getBoundingClientRect();

      setPosition({
        top: rect.bottom + 8,
        left: rect.left,
      });
    };

    updatePosition();

    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);

    return (): void => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [visible]);

  return (
    <section>
      <h2>Keyboard-accessible tooltip</h2>

      <button
        ref={triggerRef}
        type="button"
        aria-describedby={visible ? tooltipId : undefined}
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        onFocus={() => setVisible(true)}
        onBlur={() => setVisible(false)}
      >
        {children}
      </button>

      {visible ? createPortal(<PortalTooltipContent id={tooltipId} label={label} position={position} />, target) : null}
    </section>
  );
};

/**
 * Demonstrates positioning a tooltip from the trigger's viewport geometry.
 *
 * `getBoundingClientRect()` returns coordinates relative to the viewport,
 * making it suitable for a tooltip using `position: fixed`.
 */
export const TooltipPositioningExample: FC<TooltipProps> = ({ target, label, children }): ReactElement => {
  const tooltipId: string = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [visible, setVisible] = useState<boolean>(false);
  const [position, setPosition] = useState<TooltipPosition>({
    top: 0,
    left: 0,
  });

  const updatePosition = (): void => {
    const trigger: HTMLButtonElement | null = triggerRef.current;

    if (!trigger) {
      return;
    }

    const rect: DOMRect = trigger.getBoundingClientRect();

    setPosition({
      top: rect.bottom + 8,
      left: rect.left + rect.width / 2,
    });
  };

  useEffect((): (() => void) | undefined => {
    if (!visible) {
      return undefined;
    }

    updatePosition();

    const handleViewportChange = (): void => {
      updatePosition();
    };

    window.addEventListener("resize", handleViewportChange);
    window.addEventListener("scroll", handleViewportChange, true);

    return (): void => {
      window.removeEventListener("resize", handleViewportChange);
      window.removeEventListener("scroll", handleViewportChange, true);
    };
  }, [visible]);

  return (
    <section>
      <h2>Tooltip positioning</h2>

      <button
        ref={triggerRef}
        type="button"
        aria-describedby={visible ? tooltipId : undefined}
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        onFocus={() => setVisible(true)}
        onBlur={() => setVisible(false)}
      >
        {children}
      </button>

      {visible
        ? createPortal(
            <div
              id={tooltipId}
              role="tooltip"
              style={{
                position: "fixed",
                top: position.top,
                left: position.left,
                transform: "translateX(-50%)",
                padding: "0.5rem 0.75rem",
                background: "black",
                color: "white",
                borderRadius: "0.25rem",
                zIndex: 1000,
                pointerEvents: "none",
                whiteSpace: "nowrap",
              }}
            >
              {label}
            </div>,
            target,
          )
        : null}
    </section>
  );
};

/**
 * Demonstrates a tooltip whose DOM destination is separate from the trigger's
 * DOM location.
 *
 * The trigger can remain inside an overflow-constrained element while the
 * tooltip is mounted in a top-level portal container.
 */
export const OverflowEscapeTooltipExample: FC<TooltipProps> = ({ target, label, children }): ReactElement => {
  const tooltipId: string = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [visible, setVisible] = useState<boolean>(false);
  const [position, setPosition] = useState<TooltipPosition>({
    top: 0,
    left: 0,
  });

  useEffect((): (() => void) | undefined => {
    if (!visible) {
      return undefined;
    }

    const updatePosition = (): void => {
      const trigger: HTMLButtonElement | null = triggerRef.current;

      if (!trigger) {
        return;
      }

      const rect: DOMRect = trigger.getBoundingClientRect();

      setPosition({
        top: rect.bottom + 8,
        left: rect.left,
      });
    };

    updatePosition();

    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);

    return (): void => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [visible]);

  return (
    <section>
      <h2>Escaping overflow constraints</h2>

      <div
        style={{
          width: "12rem",
          height: "3rem",
          overflow: "hidden",
          border: "1px solid black",
          padding: "1rem",
        }}
      >
        <button
          ref={triggerRef}
          type="button"
          aria-describedby={visible ? tooltipId : undefined}
          onMouseEnter={() => setVisible(true)}
          onMouseLeave={() => setVisible(false)}
          onFocus={() => setVisible(true)}
          onBlur={() => setVisible(false)}
        >
          {children}
        </button>
      </div>

      {visible ? createPortal(<PortalTooltipContent id={tooltipId} label={label} position={position} />, target) : null}
    </section>
  );
};

/**
 * Demonstrates that the tooltip should not intercept pointer events when it is
 * purely supplementary content.
 *
 * This prevents the tooltip itself from interfering with pointer movement
 * between the trigger and surrounding content.
 */
export const NonInteractiveTooltipExample: FC<TooltipProps> = ({ target, label, children }): ReactElement => {
  const tooltipId: string = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [visible, setVisible] = useState<boolean>(false);
  const [position, setPosition] = useState<TooltipPosition>({
    top: 0,
    left: 0,
  });

  useEffect((): (() => void) | undefined => {
    if (!visible) {
      return undefined;
    }

    const updatePosition = (): void => {
      const trigger: HTMLButtonElement | null = triggerRef.current;

      if (!trigger) {
        return;
      }

      const rect: DOMRect = trigger.getBoundingClientRect();

      setPosition({
        top: rect.bottom + 8,
        left: rect.left,
      });
    };

    updatePosition();

    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);

    return (): void => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [visible]);

  return (
    <section>
      <h2>Non-interactive tooltip</h2>

      <button
        ref={triggerRef}
        type="button"
        aria-describedby={visible ? tooltipId : undefined}
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        onFocus={() => setVisible(true)}
        onBlur={() => setVisible(false)}
      >
        {children}
      </button>

      {visible
        ? createPortal(
            <div
              id={tooltipId}
              role="tooltip"
              style={{
                position: "fixed",
                top: position.top,
                left: position.left,
                padding: "0.5rem 0.75rem",
                background: "black",
                color: "white",
                borderRadius: "0.25rem",
                zIndex: 1000,
                pointerEvents: "none",
                whiteSpace: "nowrap",
              }}
            >
              {label}
            </div>,
            target,
          )
        : null}
    </section>
  );
};

/**
 * Demonstrates that tooltip visibility is controlled by React state rather
 * than by the portal itself.
 *
 * The portal only determines where the tooltip DOM node is rendered.
 */
export const TooltipStateExample: FC<TooltipProps> = ({ target, label, children }): ReactElement => {
  const tooltipId: string = useId();
  const [visible, setVisible] = useState<boolean>(false);

  return (
    <section>
      <h2>Tooltip state</h2>

      <button
        type="button"
        aria-describedby={visible ? tooltipId : undefined}
        onClick={() => setVisible((current) => !current)}
      >
        {children}
      </button>

      {visible
        ? createPortal(
            <div
              id={tooltipId}
              role="tooltip"
              style={{
                position: "fixed",
                top: "20rem",
                left: "2rem",
                padding: "0.5rem 0.75rem",
                background: "black",
                color: "white",
                borderRadius: "0.25rem",
                zIndex: 1000,
              }}
            >
              {label}
            </div>,
            target,
          )
        : null}
    </section>
  );
};

/**
 * Demonstrates a common misconception about portals and tooltip positioning.
 *
 * Moving the tooltip into a body-level container does not automatically place
 * it beside its trigger. The trigger's geometry still has to be measured.
 */
export const TooltipPortalIsNotPositioningExample: FC<TooltipProps> = ({ target, label, children }): ReactElement => {
  const [visible, setVisible] = useState<boolean>(false);

  return (
    <section>
      <h2>Portal is not a positioning system</h2>

      <button
        type="button"
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        onFocus={() => setVisible(true)}
        onBlur={() => setVisible(false)}
      >
        {children}
      </button>

      {visible
        ? createPortal(
            <div
              role="tooltip"
              style={{
                position: "fixed",
                top: "24rem",
                left: "2rem",
                padding: "0.5rem 0.75rem",
                background: "black",
                color: "white",
                zIndex: 1000,
              }}
            >
              {label}
            </div>,
            target,
          )
        : null}
    </section>
  );
};

/**
 * Demonstrates that tooltip content can be rendered into a dedicated DOM
 * container instead of the document body itself.
 *
 * The target element can be supplied by the surrounding application.
 */
export const DedicatedTooltipContainerExample: FC<TooltipProps> = ({ target, label, children }): ReactElement => {
  const tooltipId: string = useId();
  const [visible, setVisible] = useState<boolean>(false);

  return (
    <section>
      <h2>Dedicated tooltip container</h2>

      <button
        type="button"
        aria-describedby={visible ? tooltipId : undefined}
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        onFocus={() => setVisible(true)}
        onBlur={() => setVisible(false)}
      >
        {children}
      </button>

      {visible
        ? createPortal(
            <div
              id={tooltipId}
              role="tooltip"
              style={{
                position: "fixed",
                top: "28rem",
                left: "2rem",
                padding: "0.5rem 0.75rem",
                background: "black",
                color: "white",
                zIndex: 1000,
              }}
            >
              {label}
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

const PortalTooltipDemo: FC = (): ReactElement => {
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);

  useEffect((): (() => void) => {
    const existingTarget: HTMLElement | null = document.getElementById("portal-tooltip-root");

    if (existingTarget) {
      setPortalTarget(existingTarget);

      return (): void => {
        // The surrounding document owns the existing container.
      };
    }

    const createdTarget: HTMLDivElement = document.createElement("div");

    createdTarget.id = "portal-tooltip-root";
    document.body.appendChild(createdTarget);
    setPortalTarget(createdTarget);

    return (): void => {
      createdTarget.remove();
    };
  }, []);

  if (!portalTarget) {
    return (
      <main>
        <h1>Portal Tooltip</h1>
        <p>Preparing the tooltip portal destination.</p>
      </main>
    );
  }

  return (
    <main>
      <h1>Portal Tooltip</h1>

      <BasicPortalTooltip target={portalTarget} label="Additional information about this action.">
        Hover or focus me
      </BasicPortalTooltip>

      <KeyboardAccessibleTooltip target={portalTarget} label="This tooltip is also available through keyboard focus.">
        Keyboard-accessible tooltip
      </KeyboardAccessibleTooltip>

      <TooltipPositioningExample
        target={portalTarget}
        label="Position calculated from the trigger's viewport geometry."
      >
        Positioned tooltip
      </TooltipPositioningExample>

      <OverflowEscapeTooltipExample
        target={portalTarget}
        label="The portal allows this tooltip to escape the constrained ancestor."
      >
        Overflow-constrained trigger
      </OverflowEscapeTooltipExample>

      <NonInteractiveTooltipExample target={portalTarget} label="This tooltip does not intercept pointer events.">
        Non-interactive tooltip
      </NonInteractiveTooltipExample>

      <TooltipStateExample target={portalTarget} label="React state determines whether the tooltip is rendered.">
        Toggle tooltip
      </TooltipStateExample>

      <TooltipPortalIsNotPositioningExample
        target={portalTarget}
        label="The portal changes DOM placement; it does not calculate tooltip geometry."
      >
        Portal positioning misconception
      </TooltipPortalIsNotPositioningExample>

      <DedicatedTooltipContainerExample
        target={portalTarget}
        label="Tooltip content can use an application-owned portal container."
      >
        Dedicated container
      </DedicatedTooltipContainerExample>
    </main>
  );
};

export default PortalTooltipDemo;

// ---------------------------------------------------------------------
// Summary
// A tooltip can use a portal to escape ancestor clipping and stacking constraints.
// The portal changes the tooltip's DOM destination but does not position it automatically.
// `getBoundingClientRect()` can provide viewport coordinates for a fixed-position tooltip.
// Tooltip positioning may need to respond to scrolling and viewport resizing.
// Tooltip triggers should be usable through keyboard focus as well as pointer interaction.
// `aria-describedby` associates the trigger with the tooltip content.
// Tooltip content should generally be non-interactive and use `pointer-events: none` when it is supplementary.
// A dedicated portal container can be used instead of mounting directly into document.body.
// A portal does not provide tooltip accessibility, positioning, timing, or interaction behavior by itself.
// ---------------------------------------------------------------------
