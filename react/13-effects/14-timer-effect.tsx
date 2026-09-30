/**
 * Timer Effect
 * ============
 *
 * A timer is an external browser resource because its execution continues
 * independently of React's render cycle. An Effect can synchronize a component
 * with that timer by creating it during setup and releasing it during cleanup.
 *
 * `setInterval` schedules repeated callbacks until `clearInterval` is called.
 * `setTimeout` schedules a single callback until it runs or is canceled with
 * `clearTimeout`. The returned timer identifier is the resource handle that
 * cleanup must retain so the exact timer created by that Effect instance can be
 * released.
 *
 * A timer callback closes over the values from the render that created it. A
 * dependency array therefore determines when React replaces the timer and its
 * callback. When only the state being incremented is needed, a functional state
 * updater can avoid capturing that state in the callback and allows the
 * interval to remain established across renders.
 *
 * Timer cleanup is especially important when dependencies change or a
 * component unmounts. Without cleanup, old timers can continue to execute and
 * can produce duplicate updates, unnecessary work, or updates associated with
 * obsolete synchronization.
 */

import { type FC, type ReactElement, useEffect, useState } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface IntervalTimerProps {
  readonly intervalMs: number;
  readonly initialCount: number;
}

export interface TimeoutTimerProps {
  readonly delayMs: number;
}

export interface ConfigurableTimerProps {
  readonly initialIntervalMs: number;
}

export interface PausableTimerProps {
  readonly intervalMs: number;
  readonly initialRunning: boolean;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

export const IntervalTimer: FC<IntervalTimerProps> = ({ intervalMs, initialCount }): ReactElement => {
  const [count, setCount] = useState<number>(initialCount);

  useEffect((): (() => void) => {
    const timerId: number = window.setInterval((): void => {
      setCount((previousCount: number): number => previousCount + 1);
    }, intervalMs);

    return (): void => {
      window.clearInterval(timerId);
    };
  }, [intervalMs]);

  return (
    <section>
      <p>Elapsed intervals: {count}</p>
      <p>Interval: {intervalMs} ms</p>
    </section>
  );
};

export const TimeoutTimer: FC<TimeoutTimerProps> = ({ delayMs }): ReactElement => {
  const [completed, setCompleted] = useState<boolean>(false);

  useEffect((): (() => void) => {
    setCompleted(false);

    const timerId: number = window.setTimeout((): void => {
      setCompleted(true);
    }, delayMs);

    return (): void => {
      window.clearTimeout(timerId);
    };
  }, [delayMs]);

  return (
    <section>
      <p>Timeout status: {completed ? "Completed" : "Waiting"}</p>
      <p>Delay: {delayMs} ms</p>
    </section>
  );
};

export const ConfigurableTimer: FC<ConfigurableTimerProps> = ({ initialIntervalMs }): ReactElement => {
  const [intervalMs, setIntervalMs] = useState<number>(initialIntervalMs);
  const [count, setCount] = useState<number>(0);

  useEffect((): (() => void) => {
    const timerId: number = window.setInterval((): void => {
      setCount((previousCount: number): number => previousCount + 1);
    }, intervalMs);

    return (): void => {
      window.clearInterval(timerId);
    };
  }, [intervalMs]);

  const increaseInterval = (): void => {
    setIntervalMs((previousIntervalMs: number): number => previousIntervalMs + 500);
  };

  return (
    <section>
      <p>Interval: {intervalMs} ms</p>
      <p>Ticks: {count}</p>

      <button type="button" onClick={increaseInterval}>
        Increase interval
      </button>
    </section>
  );
};

export const PausableTimer: FC<PausableTimerProps> = ({ intervalMs, initialRunning }): ReactElement => {
  const [running, setRunning] = useState<boolean>(initialRunning);
  const [count, setCount] = useState<number>(0);

  useEffect((): (() => void) | undefined => {
    if (!running) {
      return undefined;
    }

    const timerId: number = window.setInterval((): void => {
      setCount((previousCount: number): number => previousCount + 1);
    }, intervalMs);

    return (): void => {
      window.clearInterval(timerId);
    };
  }, [intervalMs, running]);

  const toggleRunning = (): void => {
    setRunning((previousRunning: boolean): boolean => !previousRunning);
  };

  return (
    <section>
      <p>Timer: {running ? "Running" : "Paused"}</p>
      <p>Ticks: {count}</p>

      <button type="button" onClick={toggleRunning}>
        {running ? "Pause" : "Resume"}
      </button>
    </section>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const TimerEffectExamples: FC = (): ReactElement => {
  return (
    <main>
      <h2>1. Creating and cleaning up a repeating interval</h2>
      <IntervalTimer intervalMs={1000} initialCount={0} />

      <h2>2. Creating and canceling a one-time timeout</h2>
      <TimeoutTimer delayMs={2000} />

      <h2>3. Replacing a timer when its interval dependency changes</h2>
      <ConfigurableTimer initialIntervalMs={1000} />

      <h2>4. Starting and stopping a timer with Effect synchronization</h2>
      <PausableTimer intervalMs={1000} initialRunning={false} />
    </main>
  );
};

export default TimerEffectExamples;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Timers are external browser resources that should be synchronized through
//   an Effect when their lifetime follows component state or props.
// - `setInterval` must be paired with `clearInterval` during cleanup.
// - `setTimeout` must be paired with `clearTimeout` when the timeout can become
//   obsolete before it fires.
// - The timer identifier belongs to the Effect setup that created it and should
//   be used by that setup's cleanup.
// - Changing a timer dependency causes React to clean up the old timer before
//   creating the new timer.
// - Functional state updates let interval callbacks update the latest state
//   without capturing that state in their closure.
// - A timer should be stopped when its synchronization condition becomes false.
// - Missing cleanup can leave obsolete timers running after dependency changes
//   or component unmounts.
