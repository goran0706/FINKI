/**
 * Mutable Refs
 * ============
 *
 * A mutable ref is an object whose `.current` property can hold a value
 * across React renders without causing a render when that value changes.
 * `useRef` returns the same ref object for the lifetime of a mounted
 * component, so mutations to `.current` preserve data between event
 * handlers and renders while remaining outside React's state-update queue.
 *
 * A ref is useful for values that React does not need to render, such as
 * timer identifiers, previous values, DOM nodes, or imperative handles.
 * Updating `.current` is synchronous and does not schedule a React render.
 * This differs from state, where an update schedules React to reconcile the
 * component tree.
 *
 * DOM refs are assigned by React during the commit phase. A DOM ref should
 * therefore be read from event handlers, effects, or other lifecycle-safe
 * code rather than during rendering when the referenced element may not yet
 * exist.
 *
 * A ref does not automatically make an object immutable or reactive. If the
 * value stored in `.current` is an object, mutating that object also does not
 * notify React. When rendered output must reflect a change, state remains the
 * appropriate mechanism.
 */

import { type ChangeEvent, type FC, type ReactElement, useEffect, useRef, useState } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface MutableCounterRefProps {
  readonly initialValue: number;
}

export interface DomRefFocusProps {
  readonly placeholder: string;
}

export interface PreviousValueRefProps {
  readonly initialValue: string;
}

export interface TimerRefProps {
  readonly durationMs: number;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

export const MutableCounterRef: FC<MutableCounterRefProps> = ({ initialValue }): ReactElement => {
  const countRef = useRef<number>(initialValue);
  const [renderCount, setRenderCount] = useState<number>(0);

  const incrementRef = (): void => {
    countRef.current += 1;
  };

  const forceRender = (): void => {
    setRenderCount((previousCount: number): number => previousCount + 1);
  };

  return (
    <div>
      <p>Ref value: {countRef.current}</p>
      <p>Render count: {renderCount}</p>

      <button type="button" onClick={incrementRef}>
        Change ref
      </button>

      <button type="button" onClick={forceRender}>
        Render component
      </button>
    </div>
  );
};

export const DomRefFocus: FC<DomRefFocusProps> = ({ placeholder }): ReactElement => {
  const inputRef = useRef<HTMLInputElement>(null);

  const focusInput = (): void => {
    inputRef.current?.focus();
  };

  return (
    <div>
      <input ref={inputRef} placeholder={placeholder} />

      <button type="button" onClick={focusInput}>
        Focus input
      </button>
    </div>
  );
};

export const PreviousValueRef: FC<PreviousValueRefProps> = ({ initialValue }): ReactElement => {
  const [value, setValue] = useState<string>(initialValue);
  const previousValueRef = useRef<string>(initialValue);

  useEffect((): void => {
    previousValueRef.current = value;
  }, [value]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setValue(event.target.value);
  };

  return (
    <div>
      <label>
        Current value
        <input value={value} onChange={handleChange} />
      </label>

      <p>Previous value: {previousValueRef.current}</p>
    </div>
  );
};

export const TimerRef: FC<TimerRefProps> = ({ durationMs }): ReactElement => {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [completed, setCompleted] = useState<boolean>(false);

  const startTimer = (): void => {
    if (timerRef.current !== null) {
      return;
    }

    setCompleted(false);

    timerRef.current = setTimeout((): void => {
      setCompleted(true);
      timerRef.current = null;
    }, durationMs);
  };

  const cancelTimer = (): void => {
    if (timerRef.current === null) {
      return;
    }

    clearTimeout(timerRef.current);
    timerRef.current = null;
    setCompleted(false);
  };

  useEffect((): (() => void) => {
    return (): void => {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []);

  return (
    <div>
      <p>{completed ? "Timer completed." : "Timer is idle."}</p>

      <button type="button" onClick={startTimer}>
        Start timer
      </button>

      <button type="button" onClick={cancelTimer}>
        Cancel timer
      </button>
    </div>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const MutableRefsExamples: FC = (): ReactElement => {
  return (
    <main>
      <h2>1. Mutable ref without automatic re-rendering</h2>
      <MutableCounterRef initialValue={0} />

      <h2>2. DOM access through a ref</h2>
      <DomRefFocus placeholder="Click the button to focus this input" />

      <h2>3. Storing a previous value in a ref</h2>
      <PreviousValueRef initialValue="John Doe" />

      <h2>4. Storing an imperative timer handle in a ref</h2>
      <TimerRef durationMs={3000} />
    </main>
  );
};

export default MutableRefsExamples;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - `useRef` preserves the same ref object across renders of a mounted component.
// - Mutating `.current` does not schedule a React render.
// - State should be used when a value change must update rendered output.
// - DOM refs provide access to mounted DOM elements for imperative operations.
// - Refs can store mutable values such as previous values and timer handles.
// - A timer handle stored in a ref can be checked and cleared without rendering.
// - Ref values should be read or mutated outside render when their value depends
//   on mounted DOM nodes or other imperative resources.
// - Mutating a ref does not create React's state-update lifecycle automatically.
