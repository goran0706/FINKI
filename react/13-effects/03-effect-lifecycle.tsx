/**
 * Effect Lifecycle
 * ================
 *
 * An Effect has a lifecycle tied to synchronization rather than simply to the
 * lifetime of the component. React runs an Effect's setup after a commit, and
 * when its dependencies change, React first runs the previous cleanup and then
 * runs the new setup. When the component is removed, React runs the final
 * cleanup.
 *
 * The setup function may optionally return a cleanup function. Cleanup should
 * undo the external resource or synchronization established by that setup.
 * This creates a setup/cleanup pair that can safely be repeated whenever the
 * Effect's dependencies change.
 *
 * The lifecycle is therefore best understood as synchronization cycles:
 * setup establishes synchronization with the current dependency values,
 * cleanup stops synchronization with those values, and a new setup establishes
 * synchronization with the next values. An Effect with no dependency array can
 * go through this cycle after every committed render, while an Effect with
 * dependencies re-synchronizes only when those dependencies change.
 *
 * Development Strict Mode can perform an additional setup-cleanup cycle after
 * the initial mount. Effect code should be correct when setup is followed by
 * cleanup and setup again. Cleanup must not assume that it is called only when
 * the user explicitly leaves the component.
 */

import { type FC, type ReactElement, useEffect, useState } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface LifecycleLoggerProps {
  readonly initialValue: string;
}

export interface DependencyLifecycleProps {
  readonly initialRoom: string;
}

export interface CleanupLifecycleProps {
  readonly initialActive: boolean;
}

export interface RepeatedLifecycleProps {
  readonly initialCount: number;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

export const LifecycleLogger: FC<LifecycleLoggerProps> = ({ initialValue }): ReactElement => {
  const [value, setValue] = useState<string>(initialValue);

  useEffect((): (() => void) => {
    document.title = `Value: ${value}`;

    return (): void => {
      document.title = "React";
    };
  }, [value]);

  const changeValue = (): void => {
    setValue((previousValue: string): string => (previousValue === "John Doe" ? "Jane Doe" : "John Doe"));
  };

  return (
    <section>
      <p>Current synchronized value: {value}</p>
      <button type="button" onClick={changeValue}>
        Change value
      </button>
    </section>
  );
};

export const DependencyLifecycle: FC<DependencyLifecycleProps> = ({ initialRoom }): ReactElement => {
  const [room, setRoom] = useState<string>(initialRoom);

  useEffect((): (() => void) => {
    document.title = `Room: ${room}`;

    return (): void => {
      document.title = "React";
    };
  }, [room]);

  const changeRoom = (): void => {
    setRoom((previousRoom: string): string => (previousRoom === "Lobby" ? "Meeting Room" : "Lobby"));
  };

  return (
    <section>
      <p>Current room: {room}</p>
      <button type="button" onClick={changeRoom}>
        Change room
      </button>
    </section>
  );
};

export const CleanupLifecycle: FC<CleanupLifecycleProps> = ({ initialActive }): ReactElement => {
  const [isActive, setIsActive] = useState<boolean>(initialActive);
  const [status, setStatus] = useState<string>(initialActive ? "Active" : "Inactive");

  useEffect((): (() => void) | undefined => {
    if (!isActive) {
      setStatus("Inactive");
      return undefined;
    }

    setStatus("Active");

    const timerId: number = window.setTimeout((): void => {
      setStatus("Active and synchronized");
    }, 1000);

    return (): void => {
      window.clearTimeout(timerId);
    };
  }, [isActive]);

  const toggleActive = (): void => {
    setIsActive((previousActive: boolean): boolean => !previousActive);
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

export const RepeatedLifecycle: FC<RepeatedLifecycleProps> = ({ initialCount }): ReactElement => {
  const [count, setCount] = useState<number>(initialCount);

  useEffect((): (() => void) => {
    const timerId: number = window.setTimeout((): void => {
      document.title = `Count: ${count}`;
    }, 0);

    return (): void => {
      window.clearTimeout(timerId);
    };
  }, [count]);

  const increment = (): void => {
    setCount((previousCount: number): number => previousCount + 1);
  };

  return (
    <section>
      <p>Count: {count}</p>
      <button type="button" onClick={increment}>
        Re-synchronize Effect
      </button>
    </section>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const EffectLifecycleExamples: FC = (): ReactElement => {
  return (
    <main>
      <h2>1. Effect setup and cleanup form one lifecycle pair</h2>
      <LifecycleLogger initialValue="John Doe" />

      <h2>2. Changing a dependency starts a new synchronization cycle</h2>
      <DependencyLifecycle initialRoom="Lobby" />

      <h2>3. Cleanup releases resources from the previous synchronization</h2>
      <CleanupLifecycle initialActive={false} />

      <h2>4. An Effect can repeat its setup and cleanup cycle</h2>
      <RepeatedLifecycle initialCount={0} />
    </main>
  );
};

export default EffectLifecycleExamples;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - An Effect's setup runs after a commit when its synchronization is needed.
// - Cleanup runs before the Effect is re-synchronized and when the component
//   unmounts.
// - Changing a dependency creates a new synchronization cycle.
// - Setup and cleanup should be designed as a matching pair.
// - Cleanup should undo timers, subscriptions, listeners, connections, or other
//   external resources established by setup.
// - An Effect without dependencies can repeat its lifecycle after every
//   committed render.
// - An Effect with dependencies repeats its lifecycle when a dependency changes.
// - Development Strict Mode can perform an additional setup-cleanup cycle, so
//   Effects must remain correct when synchronization is repeated.
