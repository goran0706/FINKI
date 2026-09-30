/**
 * Callback Refs
 * =============
 *
 * A callback ref is a function supplied to React's `ref` prop. React calls
 * the function with the referenced DOM node when that node is attached and
 * calls it with `null` when the node is detached. Unlike an object ref, a
 * callback ref can execute imperative logic at the exact point React assigns
 * or removes the node.
 *
 * Callback refs are useful when code must react immediately to attachment
 * or detachment, such as measuring a DOM node, registering an observer, or
 * connecting an imperative API to an element. The callback receives the
 * actual element, so its parameter should be explicitly typed as the
 * corresponding DOM element type or `null`.
 *
 * Callback refs can be defined inline, but a ref callback whose identity
 * changes between renders can cause React to detach the previous callback
 * and attach the new callback. `useCallback` can stabilize the callback when
 * that distinction matters. A callback ref should also clean up resources
 * when React invokes it with `null`.
 *
 * Callback refs differ from `useRef`: an object ref stores a mutable value in
 * `.current`, whereas a callback ref runs code when React changes the
 * referenced node. Both approaches can be used for DOM references, but they
 * model different requirements.
 */

import { type FC, type HTMLAttributes, useCallback, useState } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface FocusCallbackRefProps {
  readonly label: string;
}

export interface MeasurementCallbackRefProps {
  readonly text: string;
}

export interface CallbackRefLifecycleProps {
  readonly className?: string;
}

export interface ObserverCallbackRefProps {
  readonly children: string;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

export const FocusCallbackRef: FC<FocusCallbackRefProps> = ({ label }): JSX.Element => {
  const setInputRef = useCallback((input: HTMLInputElement | null): void => {
    if (input === null) {
      return;
    }

    input.focus();
  }, []);

  return (
    <div>
      <input ref={setInputRef} aria-label={label} />
    </div>
  );
};

export const MeasurementCallbackRef: FC<MeasurementCallbackRefProps> = ({ text }): JSX.Element => {
  const [width, setWidth] = useState<number>(0);

  const setElementRef = useCallback((element: HTMLDivElement | null): void => {
    if (element === null) {
      return;
    }

    setWidth(element.getBoundingClientRect().width);
  }, []);

  return (
    <div>
      <div ref={setElementRef}>{text}</div>
      <p>Measured width: {width}px</p>
    </div>
  );
};

export const CallbackRefLifecycle: FC<CallbackRefLifecycleProps> = ({ className }): JSX.Element => {
  const setElementRef = useCallback((element: HTMLDivElement | null): void => {
    if (element === null) {
      return;
    }

    element.dataset.refAttached = "true";
  }, []);

  return (
    <div ref={setElementRef} className={className}>
      The callback ref marks this element when attached.
    </div>
  );
};

export const ObserverCallbackRef: FC<ObserverCallbackRefProps> = ({ children }): JSX.Element => {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const setObservedElement = useCallback((element: HTMLDivElement | null): (() => void) | void => {
    if (element === null) {
      return;
    }

    const observer: IntersectionObserver = new IntersectionObserver(([entry]: IntersectionObserverEntry[]): void => {
      setIsVisible(entry?.isIntersecting ?? false);
    });

    observer.observe(element);

    return (): void => {
      observer.disconnect();
    };
  }, []);

  const attributes: HTMLAttributes<HTMLDivElement> = {
    "aria-live": "polite",
  };

  return (
    <div {...attributes}>
      <div ref={setObservedElement}>{children}</div>
      <p>{isVisible ? "Element is visible." : "Element is not visible."}</p>
    </div>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const CallbackRefsExamples: FC = (): JSX.Element => {
  return (
    <main>
      <h2>1. Running imperative logic when a node attaches</h2>
      <FocusCallbackRef label="Example input" />

      <h2>2. Measuring a DOM node from a callback ref</h2>
      <MeasurementCallbackRef text="Measure this element." />

      <h2>3. Responding to callback-ref attachment</h2>
      <CallbackRefLifecycle className="example-element" />

      <h2>4. Connecting an observer through a callback ref</h2>
      <ObserverCallbackRef>Observe this element when it enters the viewport.</ObserverCallbackRef>
    </main>
  );
};

export default CallbackRefsExamples;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - A callback ref is a function that receives a DOM node when attached and
//   `null` when detached.
// - The callback parameter should be explicitly typed as the relevant DOM
//   element type or `null`.
// - Callback refs are useful when attachment itself must trigger imperative
//   logic.
// - A callback ref can measure an element or initialize an imperative API
//   immediately after React attaches the node.
// - Callback-ref cleanup must account for the node being detached.
// - Stabilizing a callback ref with `useCallback` can prevent unnecessary
//   detach-and-attach cycles caused by callback identity changes.
// - Object refs store values in `.current`; callback refs execute code when
//   React changes the referenced node.
// - A callback ref should not be treated as ordinary state because React does
//   not use its return value as component state.
