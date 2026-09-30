/**
 * Effect Debugging
 * ================
 *
 * Debugging an Effect starts by identifying when its setup runs, when its
 * cleanup runs, and which dependency caused React to re-synchronize it. React
 * compares each dependency with its previous value using `Object.is`. A
 * primitive dependency changes when its value changes, while objects, arrays,
 * and functions change when their references change.
 *
 * A useful debugging technique is to log setup and cleanup separately. This
 * reveals whether an Effect is being re-run because dependencies changed,
 * whether cleanup is correctly paired with setup, and whether development
 * Strict Mode is exposing an incomplete synchronization lifecycle.
 *
 * Dependency debugging should compare the previous and current values rather
 * than merely logging that an Effect ran. For reference values, comparing
 * object identity is important because two objects with identical properties
 * can still be different dependencies.
 *
 * An Effect that runs more often than expected is not automatically incorrect.
 * It may be synchronizing with a dependency that intentionally changes often.
 * The debugging goal is to determine the actual dependency change and then
 * decide whether the dependency, the Effect, or the external synchronization
 * needs to change.
 */

import { type FC, type ReactElement, useEffect, useRef, useState } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface EffectRunLoggerProps {
  readonly initialValue: string;
}

export interface DependencyDebuggerProps {
  readonly initialValue: string;
}

export interface ObjectDependencyDebuggerProps {
  readonly initialValue: string;
}

export interface CleanupDebuggerProps {
  readonly initialActive: boolean;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

export const EffectRunLogger: FC<EffectRunLoggerProps> = ({ initialValue }): ReactElement => {
  const [value, setValue] = useState<string>(initialValue);
  const setupCountRef = useRef<number>(0);
  const cleanupCountRef = useRef<number>(0);
  const [setupCount, setSetupCount] = useState<number>(0);
  const [cleanupCount, setCleanupCount] = useState<number>(0);

  useEffect((): (() => void) => {
    setupCountRef.current += 1;
    setSetupCount(setupCountRef.current);

    console.log("Effect setup", {
      value,
      setupCount: setupCountRef.current,
    });

    return (): void => {
      cleanupCountRef.current += 1;
      setCleanupCount(cleanupCountRef.current);

      console.log("Effect cleanup", {
        value,
        cleanupCount: cleanupCountRef.current,
      });
    };
  }, [value]);

  const changeValue = (): void => {
    setValue((previousValue: string): string => (previousValue === "John Doe" ? "Jane Doe" : "John Doe"));
  };

  return (
    <section>
      <p>Value: {value}</p>
      <p>Setups: {setupCount}</p>
      <p>Cleanups: {cleanupCount}</p>

      <button type="button" onClick={changeValue}>
        Change dependency
      </button>
    </section>
  );
};

export const DependencyDebugger: FC<DependencyDebuggerProps> = ({ initialValue }): ReactElement => {
  const [value, setValue] = useState<string>(initialValue);
  const previousValueRef = useRef<string | undefined>(undefined);
  const [changeDescription, setChangeDescription] = useState<string>("No comparison yet");

  useEffect((): void => {
    const previousValue: string | undefined = previousValueRef.current;

    if (previousValue === undefined) {
      setChangeDescription("Initial Effect setup");
    } else if (Object.is(previousValue, value)) {
      setChangeDescription("Dependency did not change");
    } else {
      setChangeDescription(`Dependency changed from "${previousValue}" to "${value}"`);
    }

    previousValueRef.current = value;
  }, [value]);

  const changeValue = (): void => {
    setValue((previousValue: string): string => (previousValue === "example.com" ? "example.org" : "example.com"));
  };

  return (
    <section>
      <p>Current dependency: {value}</p>
      <p>{changeDescription}</p>

      <button type="button" onClick={changeValue}>
        Change dependency
      </button>
    </section>
  );
};

export const ObjectDependencyDebugger: FC<ObjectDependencyDebuggerProps> = ({ initialValue }): ReactElement => {
  const [value, setValue] = useState<string>(initialValue);
  const previousOptionsRef = useRef<{ readonly value: string } | undefined>(undefined);
  const [identityChanged, setIdentityChanged] = useState<boolean>(false);

  const options: { readonly value: string } = { value };

  useEffect((): void => {
    const previousOptions: { readonly value: string } | undefined = previousOptionsRef.current;

    if (previousOptions !== undefined) {
      setIdentityChanged(previousOptions !== options);

      console.log("Object dependency comparison", {
        previousOptions,
        currentOptions: options,
        sameReference: previousOptions === options,
      });
    }

    previousOptionsRef.current = options;
  }, [options]);

  const changeValue = (): void => {
    setValue((previousValue: string): string => (previousValue === "John Doe" ? "Jane Doe" : "John Doe"));
  };

  return (
    <section>
      <p>Object value: {options.value}</p>
      <p>Object reference changed: {identityChanged ? "yes" : "no comparison yet"}</p>

      <button type="button" onClick={changeValue}>
        Change object contents
      </button>
    </section>
  );
};

export const CleanupDebugger: FC<CleanupDebuggerProps> = ({ initialActive }): ReactElement => {
  const [active, setActive] = useState<boolean>(initialActive);
  const [status, setStatus] = useState<string>(initialActive ? "Active" : "Inactive");

  useEffect((): (() => void) | undefined => {
    if (!active) {
      setStatus("Inactive");
      console.log("Effect skipped because synchronization is inactive");

      return undefined;
    }

    setStatus("Synchronized");
    console.log("Effect setup: synchronization started");

    return (): void => {
      console.log("Effect cleanup: synchronization stopped");
      setStatus("Cleanup completed");
    };
  }, [active]);

  const toggleActive = (): void => {
    setActive((previousActive: boolean): boolean => !previousActive);
  };

  return (
    <section>
      <p>Status: {status}</p>

      <button type="button" onClick={toggleActive}>
        Toggle synchronization
      </button>
    </section>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const EffectDebuggingExamples: FC = (): ReactElement => {
  return (
    <main>
      <h2>1. Logging Effect setup and cleanup to trace its lifecycle</h2>
      <EffectRunLogger initialValue="John Doe" />

      <h2>2. Comparing previous and current dependency values</h2>
      <DependencyDebugger initialValue="example.com" />

      <h2>3. Inspecting reference identity for object dependencies</h2>
      <ObjectDependencyDebugger initialValue="John Doe" />

      <h2>4. Logging cleanup to verify external synchronization is released</h2>
      <CleanupDebugger initialActive={false} />
    </main>
  );
};

export default EffectDebuggingExamples;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Log Effect setup and cleanup separately to understand its synchronization
//   lifecycle.
// - Compare previous and current dependency values when an Effect runs more
//   often than expected.
// - React compares dependencies with `Object.is`, so reference identity matters
//   for objects, arrays, and functions.
// - Two objects with identical properties can still be different dependencies
//   when they have different references.
// - Cleanup logs can reveal whether every synchronization setup is being
//   correctly released.
// - Development Strict Mode can expose missing or incomplete cleanup through
//   additional setup and cleanup cycles.
// - An Effect running frequently is not automatically a bug; the dependency
//   changes and the synchronization requirements determine whether the behavior
//   is appropriate.
// - Debugging should identify the actual dependency or lifecycle transition
//   before changing the Effect implementation.
