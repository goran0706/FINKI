/**
 * Refs vs State
 * =============
 *
 * React state and refs both preserve values across renders, but they serve
 * different purposes. State represents data that participates in rendering:
 * calling its setter schedules an update, and the next render observes the
 * new state value. A ref is a stable mutable object whose `.current` value
 * persists across renders, but changing `.current` does not schedule an
 * update.
 *
 * State updates are processed by React's update system and may be batched,
 * while ref mutations are ordinary synchronous JavaScript property writes.
 * This makes refs appropriate for values React does not need to display,
 * such as DOM nodes, timer handles, instance-like mutable data, and values
 * needed by event handlers without causing additional renders.
 *
 * A common misconception is that refs are a faster replacement for state.
 * They are not interchangeable. If a changed value must appear in rendered
 * output, state is the appropriate mechanism. If changing the value should
 * not cause rendering, a ref can be appropriate.
 *
 * Another important distinction is that reading a ref during render observes
 * the current mutable value, but mutating a ref during render is generally
 * unsafe because rendering should remain free of imperative side effects.
 */

import { type FC, useEffect, useRef, useState } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface StateDrivenCounterProps {
  readonly initialValue: number;
}

export interface RefDrivenCounterProps {
  readonly initialValue: number;
}

export interface RenderTrackingExampleProps {
  readonly initialValue: string;
}

export interface TimerComparisonProps {
  readonly durationMs: number;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

export const StateDrivenCounter: FC<StateDrivenCounterProps> = ({ initialValue }): JSX.Element => {
  const [count, setCount] = useState<number>(initialValue);

  const increment = (): void => {
    setCount((prev: number): number => prev + 1);
  };

  return (
    <div>
      <p>Rendered state value: {count}</p>
      <button type="button" onClick={increment}>
        Increment state
      </button>
    </div>
  );
};

export const RefDrivenCounter: FC<RefDrivenCounterProps> = ({ initialValue }): JSX.Element => {
  const countRef = useRef<number>(initialValue);
  const [renderCount, setRenderCount] = useState<number>(0);

  const incrementRef = (): void => {
    countRef.current += 1;
  };

  const renderComponent = (): void => {
    setRenderCount((prev: number): number => prev + 1);
  };

  return (
    <div>
      <p>Ref value observed by this render: {countRef.current}</p>
      <p>Render count: {renderCount}</p>

      <button type="button" onClick={incrementRef}>
        Increment ref
      </button>

      <button type="button" onClick={renderComponent}>
        Render component
      </button>
    </div>
  );
};

export const RenderTrackingExample: FC<RenderTrackingExampleProps> = ({ initialValue }): JSX.Element => {
  const [value, setValue] = useState<string>(initialValue);
  const renderCountRef = useRef<number>(0);

  renderCountRef.current += 1;

  const updateValue = (): void => {
    setValue((prev: string): string => `${prev}!`);
  };

  return (
    <div>
      <p>State value: {value}</p>
      <p>Render count stored in ref: {renderCountRef.current}</p>
      <button type="button" onClick={updateValue}>
        Update state
      </button>
    </div>
  );
};

export const TimerComparison: FC<TimerComparisonProps> = ({ durationMs }): JSX.Element => {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  const startTimer = (): void => {
    if (timerRef.current !== null) {
      return;
    }

    setIsRunning(true);

    timerRef.current = setTimeout((): void => {
      timerRef.current = null;
      setIsRunning(false);
    }, durationMs);
  };

  const cancelTimer = (): void => {
    if (timerRef.current === null) {
      return;
    }

    clearTimeout(timerRef.current);
    timerRef.current = null;
    setIsRunning(false);
  };

  useEffect((): (() => void) => {
    return (): void => {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return (
    <div>
      <p>{isRunning ? "Timer is running." : "Timer is stopped."}</p>

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

const RefsVsStateExamples: FC = (): JSX.Element => {
  return (
    <main>
      <h2>1. State for values that drive rendered output</h2>
      <StateDrivenCounter initialValue={0} />

      <h2>2. Ref for mutable values that do not trigger rendering</h2>
      <RefDrivenCounter initialValue={0} />

      <h2>3. Using a ref to track renders without causing renders</h2>
      <RenderTrackingExample initialValue="John Doe" />

      <h2>4. Combining state for UI with a ref for an imperative handle</h2>
      <TimerComparison durationMs={3000} />
    </main>
  );
};

export default RefsVsStateExamples;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - State is appropriate when a value participates in rendered output.
// - Updating state schedules React to render the component again.
// - A ref preserves a mutable value without scheduling a render when `.current`
//   changes.
// - A ref is useful for imperative values such as DOM nodes and timer handles.
// - Refs are not a faster replacement for state because they do not update
//   rendered output automatically.
// - A common pattern is to use state for visible UI and a ref for an imperative
//   resource associated with that UI.
// - Ref mutations should not be performed during render because rendering
//   should remain free of imperative side effects.
// - Functional state updates are appropriate when the next state depends on
//   the previous state.
