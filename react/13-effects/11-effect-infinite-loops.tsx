/**
 * Effect Infinite Loops
 * =====================
 *
 * An Effect can participate in an infinite render cycle when its setup
 * schedules a state update that causes one of its dependencies to change,
 * causing React to run the Effect again. The cycle is typically:
 * render -> commit -> Effect -> state update -> render -> changed dependency
 * -> Effect.
 *
 * An Effect that derives one piece of React state from another is a common
 * source of unnecessary update cycles. If the derived value can be calculated
 * during rendering, no Effect or second state variable is required.
 *
 * Another common cause is an unstable object, array, or function dependency.
 * React compares dependencies with `Object.is`. A value created during every
 * render therefore has a different identity on every render, even when its
 * contents are equivalent.
 *
 * Memoizing an unstable dependency can prevent unnecessary Effect executions,
 * but memoization is not a general fix for an Effect loop. The Effect should
 * still have a legitimate external synchronization purpose. If the Effect
 * only moves data between React state values, removing the Effect is usually
 * the correct fix.
 *
 * Functional state updates do not inherently prevent an infinite Effect loop.
 * If an Effect runs repeatedly and schedules another state update each time,
 * the functional updater can still produce an endless cycle.
 *
 * A useful debugging rule is to identify the state update performed by the
 * Effect, determine which dependency changes because of that update, and then
 * ask whether the Effect actually needs to exist.
 */

import { type FC, type ReactElement, useEffect, useMemo, useState } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface DerivedStateLoopProps {
  readonly initialCount: number;
}

export interface UnstableObjectDependencyProps {
  readonly initialValue: string;
}

export interface StableObjectDependencyProps {
  readonly initialValue: string;
}

export interface ExternalSynchronizationProps {
  readonly initialValue: string;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * This demonstrates an unnecessary Effect that derives state from other
 * React state. The Effect itself does not create an infinite loop because
 * `doubledCount` is not a dependency, but it introduces an unnecessary
 * additional render and is the kind of pattern that can become cyclic when
 * the derived state is included in the dependency chain.
 */
export const DerivedStateLoop: FC<DerivedStateLoopProps> = ({ initialCount }): ReactElement => {
  const [count, setCount] = useState<number>(initialCount);
  const [doubledCount, setDoubledCount] = useState<number>(initialCount * 2);

  useEffect((): void => {
    setDoubledCount(count * 2);
  }, [count]);

  const increment = (): void => {
    setCount((previousCount: number): number => previousCount + 1);
  };

  return (
    <section>
      <p>Count: {count}</p>
      <p>Derived count: {doubledCount}</p>

      <button type="button" onClick={increment}>
        Increment
      </button>
    </section>
  );
};

/**
 * An object created during rendering receives a new reference on every
 * render. Because `options` is an Effect dependency, every render causes the
 * Effect to run again. The state update inside the Effect then creates another
 * render, producing an infinite update cycle.
 */
export const UnstableObjectDependency: FC<UnstableObjectDependencyProps> = ({ initialValue }): ReactElement => {
  const [value, setValue] = useState<string>(initialValue);
  const [effectRuns, setEffectRuns] = useState<number>(0);

  const options: { readonly value: string } = { value };

  useEffect((): void => {
    setEffectRuns((previousRuns: number): number => previousRuns + 1);
  }, [options]);

  const changeValue = (): void => {
    setValue((previousValue: string): string => (previousValue === "John Doe" ? "Jane Doe" : "John Doe"));
  };

  return (
    <section>
      <p>Value: {value}</p>
      <p>Effect runs: {effectRuns}</p>

      <button type="button" onClick={changeValue}>
        Change value
      </button>
    </section>
  );
};

/**
 * Memoization can stabilize an object reference when the object itself is a
 * meaningful dependency. Here the Effect runs when `value` changes rather
 * than after every render. The state update performed by the Effect changes
 * `effectRuns`, but that does not change `options`, so the cycle terminates.
 */
export const StableObjectDependency: FC<StableObjectDependencyProps> = ({ initialValue }): ReactElement => {
  const [value, setValue] = useState<string>(initialValue);
  const [effectRuns, setEffectRuns] = useState<number>(0);

  const options: { readonly value: string } = useMemo<{ readonly value: string }>(
    (): { readonly value: string } => ({ value }),
    [value],
  );

  useEffect((): void => {
    setEffectRuns((previousRuns: number): number => previousRuns + 1);
  }, [options]);

  const changeValue = (): void => {
    setValue((previousValue: string): string => (previousValue === "John Doe" ? "Jane Doe" : "John Doe"));
  };

  return (
    <section>
      <p>Value: {value}</p>
      <p>Effect runs: {effectRuns}</p>

      <button type="button" onClick={changeValue}>
        Change value
      </button>
    </section>
  );
};

/**
 * When a state change is caused directly by a user interaction, the event
 * handler can perform the update without involving an Effect. This avoids
 * creating a render -> Effect -> state update cycle for an action that is
 * already represented by the event itself.
 */
export const EventDrivenUpdate: FC<ExternalSynchronizationProps> = ({ initialValue }): ReactElement => {
  const [value, setValue] = useState<string>(initialValue);

  const updateValue = (): void => {
    setValue((previousValue: string): string => (previousValue === "John Doe" ? "Jane Doe" : "John Doe"));
  };

  return (
    <section>
      <p>Value: {value}</p>

      <button type="button" onClick={updateValue}>
        Change value
      </button>
    </section>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const EffectInfiniteLoopExamples: FC = (): ReactElement => {
  return (
    <main>
      <h2>1. Avoid Effects that derive state from other state</h2>
      <DerivedStateLoop initialCount={0} />

      <h2>2. Unstable object dependencies can create an infinite loop</h2>
      <UnstableObjectDependency initialValue="John Doe" />

      <h2>3. Stable object dependencies prevent repeated synchronization</h2>
      <StableObjectDependency initialValue="John Doe" />

      <h2>4. Handle event-driven state changes directly</h2>
      <EventDrivenUpdate initialValue="John Doe" />
    </main>
  );
};

export default EffectInfiniteLoopExamples;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - An Effect can loop when its state update causes one of its dependencies
//   to change again.
// - Effects that only derive React state from other React state are usually
//   unnecessary and should generally be replaced with render-time
//   calculations.
// - Objects, arrays, and functions created during rendering receive new
//   reference identities on subsequent renders.
// - React compares Effect dependencies with `Object.is`, so new references
//   are considered changed even when their contents are equivalent.
// - `useMemo` can stabilize an object reference when that reference is a
//   meaningful dependency.
// - Memoization does not make an unnecessary Effect necessary; the Effect
//   still needs a legitimate synchronization purpose.
// - Functional state updates do not prevent an infinite loop when the Effect
//   itself continues to run after every render.
// - User-event-driven state changes should normally be performed directly
//   inside event handlers.
// - When debugging an Effect loop, identify the Effect's state update and
//   determine which dependency changes because of that update.
// - If no external system is being synchronized, removing the Effect is often
//   the correct solution.
