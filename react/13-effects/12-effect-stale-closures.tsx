/**
 * Effect Stale Closures
 * =====================
 *
 * A closure captures the values that were in scope when the function was
 * created. An Effect setup function, its cleanup function, and callbacks
 * created inside it therefore retain the props and state values from the
 * render that created that Effect.
 *
 * A stale closure occurs when an asynchronous callback or external listener
 * continues using an older render's values after newer renders have committed.
 * This commonly happens when a reactive value is read inside an Effect but is
 * omitted from the dependency array, preventing React from replacing the
 * callback when that value changes.
 *
 * The dependency array describes the reactive values used by the Effect setup.
 * If a value is read by the Effect and can change between renders, it normally
 * belongs in the dependency list. When the dependency changes, React cleans up
 * the previous synchronization and creates a new one whose closure contains
 * the current values.
 *
 * Functional state updates solve a related but different problem. They allow
 * an asynchronous callback to calculate a new state value from the latest
 * state without reading that state through its closure. They do not make other
 * captured props or variables current, and they do not justify omitting those
 * values from Effect dependencies when those values are otherwise read by the
 * Effect.
 */

import { type FC, type ReactElement, useEffect, useRef, useState } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface StaleIntervalProps {
  readonly initialCount: number;
}

export interface FreshIntervalProps {
  readonly initialCount: number;
}

export interface FunctionalUpdateProps {
  readonly initialCount: number;
}

export interface RefLatestValueProps {
  readonly initialMessage: string;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

export const StaleInterval: FC<StaleIntervalProps> = ({ initialCount }): ReactElement => {
  const [count, setCount] = useState<number>(initialCount);
  const [observedCount, setObservedCount] = useState<number>(initialCount);

  useEffect((): (() => void) => {
    const timerId: number = window.setInterval((): void => {
      setObservedCount(count);
    }, 1000);

    return (): void => {
      window.clearInterval(timerId);
    };
  }, []);

  const increment = (): void => {
    setCount((previousCount: number): number => previousCount + 1);
  };

  return (
    <section>
      <p>Current count: {count}</p>
      <p>Interval callback sees: {observedCount}</p>

      <button type="button" onClick={increment}>
        Increment count
      </button>
    </section>
  );
};

export const FreshInterval: FC<FreshIntervalProps> = ({ initialCount }): ReactElement => {
  const [count, setCount] = useState<number>(initialCount);
  const [observedCount, setObservedCount] = useState<number>(initialCount);

  useEffect((): (() => void) => {
    const timerId: number = window.setInterval((): void => {
      setObservedCount(count);
    }, 1000);

    return (): void => {
      window.clearInterval(timerId);
    };
  }, [count]);

  const increment = (): void => {
    setCount((previousCount: number): number => previousCount + 1);
  };

  return (
    <section>
      <p>Current count: {count}</p>
      <p>Interval callback sees: {observedCount}</p>

      <button type="button" onClick={increment}>
        Increment count
      </button>
    </section>
  );
};

export const FunctionalUpdate: FC<FunctionalUpdateProps> = ({ initialCount }): ReactElement => {
  const [count, setCount] = useState<number>(initialCount);

  useEffect((): (() => void) => {
    const timerId: number = window.setInterval((): void => {
      setCount((previousCount: number): number => previousCount + 1);
    }, 1000);

    return (): void => {
      window.clearInterval(timerId);
    };
  }, []);

  return (
    <section>
      <p>Count: {count}</p>
      <p>The interval uses a functional update, so it does not need to capture the current count.</p>
    </section>
  );
};

export const RefLatestValue: FC<RefLatestValueProps> = ({ initialMessage }): ReactElement => {
  const [message, setMessage] = useState<string>(initialMessage);
  const latestMessageRef = useRef<string>(message);
  const [observedMessage, setObservedMessage] = useState<string>(initialMessage);

  latestMessageRef.current = message;

  useEffect((): (() => void) => {
    const timerId: number = window.setInterval((): void => {
      setObservedMessage(latestMessageRef.current);
    }, 1000);

    return (): void => {
      window.clearInterval(timerId);
    };
  }, []);

  const changeMessage = (): void => {
    setMessage((previousMessage: string): string => (previousMessage === "John Doe" ? "Jane Doe" : "John Doe"));
  };

  return (
    <section>
      <p>Current message: {message}</p>
      <p>Callback reads latest message: {observedMessage}</p>

      <button type="button" onClick={changeMessage}>
        Change message
      </button>
    </section>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const EffectStaleClosureExamples: FC = (): ReactElement => {
  return (
    <main>
      <h2>1. An omitted dependency can leave an interval with stale state</h2>
      <StaleInterval initialCount={0} />

      <h2>2. Including the reactive value recreates the synchronization</h2>
      <FreshInterval initialCount={0} />

      <h2>3. Functional updates avoid reading state through the closure</h2>
      <FunctionalUpdate initialCount={0} />

      <h2>4. A ref can expose a current value to a long-lived callback</h2>
      <RefLatestValue initialMessage="John Doe" />
    </main>
  );
};

export default EffectStaleClosureExamples;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Closures retain the props and state values from the render that created
//   them.
// - An asynchronous callback can therefore observe stale values when an Effect
//   does not re-synchronize after those values change.
// - Reactive values read by an Effect normally belong in its dependency array.
// - Adding a changing dependency lets React replace the old synchronization
//   with one whose closure contains current values.
// - Functional state updates can read the latest state through React without
//   capturing that state in an asynchronous callback.
// - Functional updates do not automatically provide current values for other
//   props or variables captured by the callback.
// - A ref can hold the latest value for a long-lived callback when the design
//   specifically requires reading a current mutable value without re-running
//   the Effect.
// - Cleanup is still required for long-lived asynchronous resources such as
//   intervals, even when their callbacks use functional updates or refs.
