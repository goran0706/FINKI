/**
 * Passive Event Listeners
 * =======================
 *
 * Passive event listeners are browser event listeners registered with
 * `{ passive: true }`. The option tells the browser that the listener will
 * not call `preventDefault()`, allowing the browser to optimize interactions
 * where scrolling or other default behavior may otherwise need to wait for
 * JavaScript execution.
 *
 * React JSX event handlers such as `onWheel` and `onTouchMove` do not provide
 * a JSX-level `passive` option. When explicit listener options are required,
 * the native `addEventListener()` API must be used, typically with `useEffect`
 * so that the listener is registered and removed with the component lifecycle.
 *
 * A passive listener may observe an event, but calling `preventDefault()` from
 * that listener is not permitted to cancel the event's default action. This
 * restriction is the defining behavioral difference between passive and
 * non-passive listeners.
 */

import React, { type ReactElement, useEffect, useRef } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface PassiveWheelProps {
  readonly label: string;
}

export interface PassiveTouchProps {
  readonly label: string;
}

export interface NonPassiveWheelProps {
  readonly label: string;
}

export interface PassiveCleanupProps {
  readonly label: string;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * A native wheel listener can be registered as passive. The listener can
 * observe wheel movement, but it cannot cancel the browser's default action.
 */
export const PassiveWheel: React.FC<PassiveWheelProps> = ({ label }): ReactElement => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect((): (() => void) => {
    const container: HTMLDivElement | null = containerRef.current;

    if (container === null) {
      return (): void => undefined;
    }

    const handleWheel = (event: WheelEvent): void => {
      console.log("Wheel delta:", event.deltaY);
    };

    container.addEventListener("wheel", handleWheel, {
      passive: true,
    });

    return (): void => {
      container.removeEventListener("wheel", handleWheel);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        height: 100,
        overflow: "auto",
      }}
    >
      {label}
    </div>
  );
};

/**
 * Passive listeners are particularly relevant to touch and scrolling
 * interactions because the browser can proceed without waiting for a
 * listener to decide whether the default action should be cancelled.
 */
export const PassiveTouch: React.FC<PassiveTouchProps> = ({ label }): ReactElement => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect((): (() => void) => {
    const container: HTMLDivElement | null = containerRef.current;

    if (container === null) {
      return (): void => undefined;
    }

    const handleTouchMove = (event: TouchEvent): void => {
      console.log("Touch points:", event.touches.length);
    };

    container.addEventListener("touchmove", handleTouchMove, {
      passive: true,
    });

    return (): void => {
      container.removeEventListener("touchmove", handleTouchMove);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        touchAction: "pan-y",
      }}
    >
      {label}
    </div>
  );
};

/**
 * A non-passive listener can call `preventDefault()`. The listener must
 * explicitly opt out of passive behavior when cancellation is required.
 */
export const NonPassiveWheel: React.FC<NonPassiveWheelProps> = ({ label }): ReactElement => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect((): (() => void) => {
    const container: HTMLDivElement | null = containerRef.current;

    if (container === null) {
      return (): void => undefined;
    }

    const handleWheel = (event: WheelEvent): void => {
      event.preventDefault();
      console.log("Default wheel behavior prevented.");
    };

    container.addEventListener("wheel", handleWheel, {
      passive: false,
    });

    return (): void => {
      container.removeEventListener("wheel", handleWheel);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        height: 100,
        overflow: "auto",
      }}
    >
      {label}
    </div>
  );
};

/**
 * Native listeners registered by a component should be removed during
 * cleanup. The same listener function reference is used for registration
 * and removal so the listener can be detached correctly.
 */
export const PassiveCleanup: React.FC<PassiveCleanupProps> = ({ label }): ReactElement => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect((): (() => void) => {
    const container: HTMLDivElement | null = containerRef.current;

    if (container === null) {
      return (): void => undefined;
    }

    const handleWheel = (event: WheelEvent): void => {
      console.log("Observed wheel movement:", event.deltaY);
    };

    container.addEventListener("wheel", handleWheel, {
      passive: true,
    });

    return (): void => {
      container.removeEventListener("wheel", handleWheel);
    };
  }, []);

  return <div ref={containerRef}>{label}</div>;
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

export const PassiveListenersDemo: React.FC = (): ReactElement => {
  return (
    <div>
      <h2>1. Observing Wheel Events Passively</h2>
      <PassiveWheel label="Scroll over this area" />

      <h2>2. Observing Touch Events Passively</h2>
      <PassiveTouch label="Interact with this area on a touch device" />

      <h2>3. Using a Non-Passive Listener</h2>
      <NonPassiveWheel label="Default wheel behavior is prevented" />

      <h2>4. Cleaning Up a Passive Listener</h2>
      <PassiveCleanup label="Wheel listener with lifecycle cleanup" />
    </div>
  );
};

export default PassiveListenersDemo;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Passive listeners are created with `addEventListener()` and
//   `{ passive: true }`.
// - A passive listener promises not to call `preventDefault()`.
// - React JSX event props do not expose a general `passive` listener option.
// - Native listeners can be registered inside `useEffect()` when explicit
//   listener options are required.
// - A non-passive listener can use `preventDefault()` when the event is
//   cancelable and the browser permits cancellation.
// - Native listeners registered by a component should be removed during
//   effect cleanup.
// - The listener function reference must be preserved so it can be removed
//   with `removeEventListener()`.
