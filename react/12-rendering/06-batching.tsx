/**
 * Batching
 * ========
 *
 * React batches multiple state updates so that several updates can be
 * processed together and typically produce a single render for the affected
 * component tree. In React 18 and later, automatic batching applies to updates
 * from React event handlers as well as updates from many asynchronous sources,
 * including timers, promises, and native event callbacks.
 *
 * Batching does not mean that state variables mutate immediately. Each update
 * is still processed according to the state snapshot and update queue rules.
 * When several updates depend on the previous state, functional updater
 * functions should be used so React can apply the queued transformations in
 * sequence.
 *
 * Multiple updates that calculate their next value from the same captured
 * snapshot can therefore collapse to the same result. For example,
 * `setCount(count + 1)` repeated three times requests the same next value,
 * while three functional updates can increment the value three times.
 *
 * Batching reduces unnecessary rendering work, but it does not change the
 * semantic difference between state and refs. A ref mutation remains a
 * synchronous mutation of `.current` and does not participate in React's
 * state update queue.
 */

import { type FC, type ReactElement, useState } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface SnapshotBatchingProps {
  readonly initialCount: number;
}

export interface FunctionalBatchingProps {
  readonly initialCount: number;
}

export interface AsyncBatchingProps {
  readonly initialCount: number;
}

export interface IndependentStateBatchingProps {
  readonly initialFirstValue: number;
  readonly initialSecondValue: number;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

export const SnapshotBatching: FC<SnapshotBatchingProps> = ({ initialCount }): ReactElement => {
  const [count, setCount] = useState<number>(initialCount);

  const incrementThreeTimes = (): void => {
    setCount(count + 1);
    setCount(count + 1);
    setCount(count + 1);
  };

  return (
    <section>
      <p>Count: {count}</p>
      <button type="button" onClick={incrementThreeTimes}>
        Request three snapshot updates
      </button>
    </section>
  );
};

export const FunctionalBatching: FC<FunctionalBatchingProps> = ({ initialCount }): ReactElement => {
  const [count, setCount] = useState<number>(initialCount);

  const incrementThreeTimes = (): void => {
    setCount((previousCount: number): number => previousCount + 1);
    setCount((previousCount: number): number => previousCount + 1);
    setCount((previousCount: number): number => previousCount + 1);
  };

  return (
    <section>
      <p>Count: {count}</p>
      <button type="button" onClick={incrementThreeTimes}>
        Apply three functional updates
      </button>
    </section>
  );
};

export const AsyncBatching: FC<AsyncBatchingProps> = ({ initialCount }): ReactElement => {
  const [count, setCount] = useState<number>(initialCount);

  const incrementAfterTimeout = (): void => {
    setTimeout((): void => {
      setCount((previousCount: number): number => previousCount + 1);
      setCount((previousCount: number): number => previousCount + 1);
    }, 0);
  };

  return (
    <section>
      <p>Count: {count}</p>
      <button type="button" onClick={incrementAfterTimeout}>
        Update from timer
      </button>
    </section>
  );
};

export const IndependentStateBatching: FC<IndependentStateBatchingProps> = ({
  initialFirstValue,
  initialSecondValue,
}): ReactElement => {
  const [firstValue, setFirstValue] = useState<number>(initialFirstValue);
  const [secondValue, setSecondValue] = useState<number>(initialSecondValue);

  const updateBothValues = (): void => {
    setFirstValue((previousValue: number): number => previousValue + 1);
    setSecondValue((previousValue: number): number => previousValue + 1);
  };

  return (
    <section>
      <p>First value: {firstValue}</p>
      <p>Second value: {secondValue}</p>

      <button type="button" onClick={updateBothValues}>
        Update both values
      </button>
    </section>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const BatchingExamples: FC = (): ReactElement => {
  return (
    <main>
      <h2>1. Multiple updates using the same state snapshot</h2>
      <SnapshotBatching initialCount={0} />

      <h2>2. Multiple functional updates in one batch</h2>
      <FunctionalBatching initialCount={0} />

      <h2>3. Batching updates scheduled from a timer</h2>
      <AsyncBatching initialCount={0} />

      <h2>4. Batching updates to independent state variables</h2>
      <IndependentStateBatching initialFirstValue={0} initialSecondValue={10} />
    </main>
  );
};

export default BatchingExamples;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - React batches multiple state updates to reduce unnecessary rendering work.
// - React 18 and later automatically batch updates from React events and many
//   asynchronous sources, including timers and promises.
// - Batching does not make state variables mutate synchronously inside the
//   current render or event-handler snapshot.
// - Repeated snapshot-based updates can calculate the same next state value.
// - Functional updater functions process queued state transformations in order.
// - Multiple state variables can be updated during the same batch.
// - Batching affects when React processes renders; it does not change the
//   distinction between state updates and synchronous ref mutations.
// - Code should not depend on an immediate render occurring after each setter.
