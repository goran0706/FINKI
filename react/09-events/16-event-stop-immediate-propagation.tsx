/**
 * Event Stop Immediate Propagation
 * ================================
 *
 * `stopImmediatePropagation()` is a DOM event method that prevents the current event from being
 * delivered to any additional listeners on the same event target and also prevents the event from
 * continuing through the remaining propagation path. It is therefore stronger than
 * `stopPropagation()`, which prevents propagation to other elements but does not stop additional
 * listeners on the same element.
 *
 * React's `SyntheticEvent` does not define `stopImmediatePropagation()` as a React event method.
 * When access to this native behavior is required, the underlying DOM event is available through
 * `event.nativeEvent`, whose `stopImmediatePropagation()` method can be called.
 *
 * React's delegated event system also means that `nativeEvent.stopImmediatePropagation()` should not
 * be treated as a general mechanism for controlling multiple React handlers attached to the same
 * element. The native method directly controls the browser's native listener dispatch, while React
 * may dispatch multiple React handlers within its own event-processing logic.
 */

import React, { type MouseEvent, useEffect, useRef } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface NativeImmediatePropagationProps {
  readonly label: string;
}

export interface SameTargetNativeListenersProps {
  readonly label: string;
}

export interface ImmediatePropagationVsPropagationProps {
  readonly label: string;
}

export interface NativeMethodAccessProps {
  readonly label: string;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * `stopImmediatePropagation()` can be accessed through the native event when
 * the browser-level event API is required.
 */
export const NativeImmediatePropagation: React.FC<NativeImmediatePropagationProps> = ({
  label,
}): React.ReactElement => {
  const handleClick = (event: MouseEvent<HTMLButtonElement>): void => {
    event.nativeEvent.stopImmediatePropagation();
    console.log("Native immediate propagation stopped.");
  };

  return (
    <button type="button" onClick={handleClick}>
      {label}
    </button>
  );
};

/**
 * Native DOM listeners registered on the same element demonstrate the primary
 * behavior of `stopImmediatePropagation()`: later native listeners are skipped.
 */
export const SameTargetNativeListeners: React.FC<SameTargetNativeListenersProps> = ({ label }): React.ReactElement => {
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  useEffect((): (() => void) | undefined => {
    const button: HTMLButtonElement | null = buttonRef.current;

    if (button === null) {
      return undefined;
    }

    const firstListener = (): void => {
      console.log("First native listener executed.");
    };

    const secondListener = (event: Event): void => {
      console.log("Second native listener executed.");
      event.stopImmediatePropagation();
    };

    const thirdListener = (): void => {
      console.log("Third native listener was blocked.");
    };

    button.addEventListener("click", firstListener);
    button.addEventListener("click", secondListener);
    button.addEventListener("click", thirdListener);

    return (): void => {
      button.removeEventListener("click", firstListener);
      button.removeEventListener("click", secondListener);
      button.removeEventListener("click", thirdListener);
    };
  }, []);

  return (
    <button ref={buttonRef} type="button">
      {label}
    </button>
  );
};

/**
 * `stopPropagation()` and `stopImmediatePropagation()` have different scopes:
 * the former allows same-target listeners to continue, while the latter stops
 * additional listeners on the current target as well.
 */
export const ImmediatePropagationVsPropagation: React.FC<ImmediatePropagationVsPropagationProps> = ({
  label,
}): React.ReactElement => {
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  useEffect((): (() => void) | undefined => {
    const button: HTMLButtonElement | null = buttonRef.current;

    if (button === null) {
      return undefined;
    }

    const firstListener = (event: Event): void => {
      console.log("First listener executed.");
      event.stopImmediatePropagation();
    };

    const secondListener = (): void => {
      console.log("Second listener was blocked.");
    };

    button.addEventListener("click", firstListener);
    button.addEventListener("click", secondListener);

    return (): void => {
      button.removeEventListener("click", firstListener);
      button.removeEventListener("click", secondListener);
    };
  }, []);

  return (
    <button ref={buttonRef} type="button">
      {label}
    </button>
  );
};

/**
 * A common misconception is that `stopImmediatePropagation()` is a method on
 * React's SyntheticEvent. React exposes the native event through `nativeEvent`,
 * where the DOM method is available.
 */
export const NativeMethodAccess: React.FC<NativeMethodAccessProps> = ({ label }): React.ReactElement => {
  const handleClick = (event: MouseEvent<HTMLButtonElement>): void => {
    console.log("Native method available:", typeof event.nativeEvent.stopImmediatePropagation === "function");
  };

  return (
    <button type="button" onClick={handleClick}>
      {label}
    </button>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

export const EventStopImmediatePropagationDemo: React.FC = (): React.ReactElement => {
  return (
    <div>
      <h2>1. Accessing Native Immediate Propagation Control</h2>
      <NativeImmediatePropagation label="Stop Immediate Propagation" />

      <h2>2. Stopping Additional Listeners on One Target</h2>
      <SameTargetNativeListeners label="Test Native Listeners" />

      <h2>3. Immediate Propagation Stops Later Same-Target Listeners</h2>
      <ImmediatePropagationVsPropagation label="Test Listener Order" />

      <h2>4. Accessing the Native Method Through React</h2>
      <NativeMethodAccess label="Inspect Native Event API" />
    </div>
  );
};

export default EventStopImmediatePropagationDemo;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - `stopImmediatePropagation()` is a native DOM Event method.
// - It prevents additional native listeners on the current target from executing.
// - It also prevents the event from continuing through the remaining propagation path.
// - `stopPropagation()` does not prevent other listeners on the same target.
// - React's SyntheticEvent does not provide `stopImmediatePropagation()` directly.
// - The native method is available through `event.nativeEvent`.
// - Native immediate propagation control should not be assumed to control React's
//   internal dispatch of multiple React handlers on the same element.
