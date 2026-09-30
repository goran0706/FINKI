/**
 * Effect Strict Mode
 * ==================
 *
 * Strict Mode enables additional development-only checks for React components.
 * For Effects, React may perform an additional setup and cleanup cycle during
 * development to verify that the Effect correctly supports being started and
 * stopped. This is separate from the normal dependency-driven lifecycle.
 *
 * An Effect must therefore be written as a reversible synchronization process:
 * setup establishes an external resource or connection, and cleanup completely
 * removes or disconnects that resource. Code that increments a global counter,
 * adds an event listener without removing it, or opens a connection without
 * closing it can expose bugs when Strict Mode repeats the setup and cleanup
 * sequence.
 *
 * Strict Mode does not mean that production applications permanently run two
 * copies of an Effect. The additional lifecycle check is development-only.
 * The correct response to an unexpected development-only setup is to make the
 * Effect's setup and cleanup symmetric rather than attempting to suppress the
 * extra execution with a ref or another one-time guard.
 *
 * Strict Mode also does not change the dependency rules for Effects. Reactive
 * values read by an Effect still determine when synchronization needs to be
 * repeated, and cleanup still runs before synchronization with changed
 * dependencies and when the component unmounts.
 */

import { type FC, type ReactElement, StrictMode, useEffect, useRef, useState } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface StrictModeCleanupProps {
  readonly initialActive: boolean;
}

export interface StrictModeEventProps {
  readonly eventName: string;
}

export interface StrictModeConnectionProps {
  readonly initialRoom: string;
}

export interface StrictModeRenderProps {
  readonly initialCount: number;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

export const StrictModeCleanup: FC<StrictModeCleanupProps> = ({ initialActive }): ReactElement => {
  const [active, setActive] = useState<boolean>(initialActive);
  const [status, setStatus] = useState<string>(initialActive ? "Active" : "Inactive");

  useEffect((): (() => void) | undefined => {
    if (!active) {
      setStatus("Inactive");
      return undefined;
    }

    setStatus("Active");

    const timerId: number = window.setTimeout((): void => {
      setStatus("Synchronized");
    }, 1000);

    return (): void => {
      window.clearTimeout(timerId);
    };
  }, [active]);

  const toggleActive = (): void => {
    setActive((previousActive: boolean): boolean => !previousActive);
  };

  return (
    <section>
      <p>Status: {status}</p>

      <button type="button" onClick={toggleActive}>
        Toggle Effect
      </button>
    </section>
  );
};

export const StrictModeEvent: FC<StrictModeEventProps> = ({ eventName }): ReactElement => {
  const [eventCount, setEventCount] = useState<number>(0);

  useEffect((): (() => void) => {
    const handleEvent = (): void => {
      setEventCount((previousCount: number): number => previousCount + 1);
    };

    window.addEventListener(eventName, handleEvent);

    return (): void => {
      window.removeEventListener(eventName, handleEvent);
    };
  }, [eventName]);

  return (
    <section>
      <p>
        "{eventName}" events received: {eventCount}
      </p>
    </section>
  );
};

export const StrictModeConnection: FC<StrictModeConnectionProps> = ({ initialRoom }): ReactElement => {
  const [room, setRoom] = useState<string>(initialRoom);
  const [connectionStatus, setConnectionStatus] = useState<string>("Disconnected");
  const connectionCountRef = useRef<number>(0);

  useEffect((): (() => void) => {
    connectionCountRef.current += 1;

    const connectionNumber: number = connectionCountRef.current;

    setConnectionStatus(`Connected to ${room} (connection ${connectionNumber})`);

    return (): void => {
      setConnectionStatus(`Disconnected from ${room}`);
    };
  }, [room]);

  const changeRoom = (): void => {
    setRoom((previousRoom: string): string => (previousRoom === "Lobby" ? "Meeting Room" : "Lobby"));
  };

  return (
    <section>
      <p>{connectionStatus}</p>

      <button type="button" onClick={changeRoom}>
        Change room
      </button>
    </section>
  );
};

export const StrictModeRender: FC<StrictModeRenderProps> = ({ initialCount }): ReactElement => {
  const [count, setCount] = useState<number>(initialCount);

  const increment = (): void => {
    setCount((previousCount: number): number => previousCount + 1);
  };

  return (
    <section>
      <p>Count: {count}</p>

      <button type="button" onClick={increment}>
        Update state
      </button>
    </section>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const EffectStrictModeExamples: FC = (): ReactElement => {
  return (
    <StrictMode>
      <main>
        <h2>1. Effect cleanup must tolerate repeated development cycles</h2>
        <StrictModeCleanup initialActive={false} />

        <h2>2. Event listeners must be removed by Effect cleanup</h2>
        <StrictModeEvent eventName="resize" />

        <h2>3. External synchronization must stop before it restarts</h2>
        <StrictModeConnection initialRoom="Lobby" />

        <h2>4. Components must remain safe when rendering is checked again</h2>
        <StrictModeRender initialCount={0} />
      </main>
    </StrictMode>
  );
};

export default EffectStrictModeExamples;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Strict Mode performs additional development-only checks.
// - An Effect may receive an additional setup-cleanup cycle during development.
// - Effect setup and cleanup should form a complete, reversible pair.
// - Timers, event listeners, subscriptions, and connections must be cleaned
//   up so repeated setup does not accumulate external resources.
// - Strict Mode does not permanently run two copies of an Effect in production.
// - A ref-based "run once" guard should not be used to hide an Effect cleanup
//   bug.
// - Dependency changes still trigger the normal cleanup-before-next-setup
//   lifecycle.
// - Strict Mode does not remove the need for correct dependency arrays.
// - The appropriate response to repeated development setup is idempotent,
//   correctly cleaned-up synchronization logic.
