/**
 * State as a Snapshot
 * ====================
 *
 * React state behaves like a snapshot of a component's value for a particular
 * render. Calling a state setter does not change the state variable captured by
 * the currently executing render; it requests another render with the next
 * state value.
 *
 * Event handlers are created during rendering and close over the state values
 * from that render. This means that every read of a state variable inside the
 * same event handler observes the same state snapshot, even after a state
 * setter has been called.
 *
 * Functional state updates can be used when the next state depends on the
 * previous state. Each updater receives the pending state value produced by
 * the previous updater in the same update sequence.
 *
 * A state snapshot is different from a mutable ref. A ref object remains the
 * same between renders, and its `.current` property can be changed
 * synchronously without scheduling a render. Reading `.current` again in the
 * same event handler therefore observes the changed value.
 *
 * This distinction is important when a value needs to participate in rendering
 * and follow React's state model versus when a mutable value needs to persist
 * between renders without causing a render when it changes.
 */

import { type FC, type ReactElement, useRef, useState } from "react";

// ---------------------------------------------------------------------
// 1. State is a snapshot
// ---------------------------------------------------------------------

export interface SnapshotReadProps {
  readonly initialValue: number;
}

export const SnapshotRead: FC<SnapshotReadProps> = ({ initialCount }): ReactElement => {
  const [count, setCount] = useState<number>(initialCount);
  const [observedCount, setObservedCount] = useState<number>(initialCount);

  const updateCount = (): void => {
    setCount((previousCount: number): number => previousCount + 1);
    setObservedCount(count);
  };

  return (
    <section>
      <p>Current count: {count}</p>
      <p>Value read immediately after the update request: {observedCount}</p>

      <button type="button" onClick={updateCount}>
        Update count
      </button>
    </section>
  );
};

// ---------------------------------------------------------------------
// 2. Multiple state updates use the same snapshot
// ---------------------------------------------------------------------

export interface SnapshotBatchProps {
  readonly initialCount: number;
}

export const SnapshotBatch: FC<SnapshotBatchProps> = ({ initialCount }): ReactElement => {
  const [count, setCount] = useState<number>(initialCount);

  const handleClick = (): void => {
    setCount(count + 1);
    setCount(count + 1);
    setCount(count + 1);
  };

  return (
    <section>
      <p>Count: {count}</p>
      <button type="button" onClick={handleClick}>
        Increment three times
      </button>
    </section>
  );
};

// ---------------------------------------------------------------------
// 3. Functional updates process the pending state
// ---------------------------------------------------------------------

export interface FunctionalUpdateProps {
  readonly initialCount: number;
}

export const FunctionalUpdate: FC<FunctionalUpdateProps> = ({ initialCount }): ReactElement => {
  const [count, setCount] = useState<number>(initialCount);

  const handleClick = (): void => {
    setCount((previousCount: number): number => previousCount + 1);
    setCount((previousCount: number): number => previousCount + 1);
    setCount((previousCount: number): number => previousCount + 1);
  };

  return (
    <section>
      <p>Count: {count}</p>
      <button type="button" onClick={handleClick}>
        Increment three times
      </button>
    </section>
  );
};

// ---------------------------------------------------------------------
// 4. State snapshot vs. mutable ref
// ---------------------------------------------------------------------

export interface SnapshotVsRefProps {
  readonly initialValue: number;
}

export const SnapshotVsRef: FC<SnapshotVsRefProps> = ({ initialValue }): ReactElement => {
  const [stateValue, setStateValue] = useState<number>(initialValue);
  const valueRef = useRef<number>(initialValue);

  const updateValues = (): void => {
    setStateValue((previousValue: number): number => previousValue + 1);
    valueRef.current += 1;
  };

  return (
    <section>
      <p>State value: {stateValue}</p>
      <p>Ref value: {valueRef.current}</p>
      <button type="button" onClick={updateValues}>
        Update state and ref
      </button>
    </section>
  );
};

// ---------------------------------------------------------------------
// 5. Same-handler observation
// ---------------------------------------------------------------------

// With an initial value of `0`, clicking the button logs:
//
// Before: 0 0
// After: 0 1
//
// `stateValue` remains `0` because this event handler belongs to the render
// that captured the `0` state snapshot. Calling `setStateValue` schedules a
// later render; it does not change the current snapshot.
//
// `valueRef.current` becomes `1` immediately because the ref object is mutable.
// Reading `valueRef.current` again in the same handler therefore observes `1`.
//
// The scheduled state update then causes another render. During that render,
// `stateValue` is `1`, and `valueRef.current` is still `1`.

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - State is a snapshot associated with a particular render.
// - Calling a state setter schedules another render; it does not change the
//   state value captured by the currently executing event handler.
// - Multiple reads of the same state variable inside one event handler observe
//   the same snapshot.
// - Functional state updates receive the pending state value and can therefore
//   compose multiple updates in the same event.
// - `useRef` returns a stable ref object whose `.current` property can be
//   changed synchronously.
// - Changing `.current` does not schedule a render.
// - A ref's `.current` value can therefore change and be observed again within
//   the same event handler.
// - State is appropriate for values that participate in rendering; refs are
//   appropriate for mutable values that need to persist between renders without
//   causing a render when changed.
// - The state snapshot and mutable ref behavior are different because state is
//   associated with a render, while a ref object persists across renders.
