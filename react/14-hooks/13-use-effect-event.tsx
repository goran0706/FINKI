/**
 * useEffectEvent
 * ==============
 *
 * `useEffectEvent` creates a non-reactive Effect Event that can read the
 * latest committed props and state without causing the Effect that calls it
 * to re-synchronize when those values change.
 *
 * An Effect Event is declared at the top level of a component and is called
 * from an Effect or another Effect Event in the same component. React keeps
 * the callback connected to the latest committed render, so the callback does
 * not suffer from the stale-value problem that can occur when an Effect
 * installs a long-lived event listener or timer.
 *
 * Effect Events are intentionally not stable function identities. They must
 * not be included in an Effect's dependency array, passed to another
 * component, or passed to another Hook. Their purpose is to separate
 * non-reactive event logic from the reactive setup and cleanup performed by an
 * Effect.
 *
 * The important distinction is between reactive and non-reactive logic. If a
 * value should cause an Effect to reconnect, resubscribe, or otherwise
 * re-synchronize, it belongs in the Effect's dependency list. If an Effect
 * needs the latest value only when an external event occurs, that read can be
 * placed inside an Effect Event.
 *
 * `useEffectEvent` is not a mechanism for suppressing dependency warnings.
 * Removing a genuine dependency with an Effect Event changes the behavior of
 * the Effect and should only be done when the extracted logic is intentionally
 * non-reactive.
 */

import { type ChangeEvent, type FC, type ReactNode, useEffect, useEffectEvent, useState } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface LatestValueEffectEventProps {
  readonly initialMessage: string;
}

export interface TimerEffectEventProps {
  readonly initialIncrement: number;
}

export interface EventListenerEffectEventProps {
  readonly initialEnabled: boolean;
}

export interface DependencySeparationProps {
  readonly initialRoom: string;
}

export interface GenuineDependencyProps {
  readonly initialValue: string;
}

export interface EffectEventCleanupProps {
  readonly initialLabel: string;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * Demonstrates that an Effect Event reads the latest state when the external
 * event occurs, while the event listener itself is established only once.
 */
export const LatestValueEffectEventExample: FC<LatestValueEffectEventProps> = ({
  initialMessage,
}: LatestValueEffectEventProps): ReactNode => {
  const [message, setMessage] = useState<string>(initialMessage);
  const [eventCount, setEventCount] = useState<number>(0);

  const handleVisibilityChange = useEffectEvent((): void => {
    setEventCount((previousCount: number): number => previousCount + 1);

    console.log(`Latest message: ${message}`);
  });

  useEffect((): (() => void) => {
    const handleEvent = (): void => {
      handleVisibilityChange();
    };

    document.addEventListener("visibilitychange", handleEvent);

    return (): void => {
      document.removeEventListener("visibilitychange", handleEvent);
    };
  }, []);

  const handleMessageChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setMessage(event.target.value);
  };

  return (
    <section>
      <h3>Reading the latest value from an Effect Event</h3>

      <label>
        Message
        <input value={message} onChange={handleMessageChange} />
      </label>

      <p>Visibility events observed: {eventCount}</p>
      <p>
        Change the message and trigger a browser visibility change to see the latest value used by the Effect Event.
      </p>
    </section>
  );
};

/**
 * Demonstrates the timer pattern where an interval remains active while the
 * Effect Event reads the latest increment value. Changing the increment does
 * not recreate the interval.
 */
export const TimerEffectEventExample: FC<TimerEffectEventProps> = ({
  initialIncrement,
}: TimerEffectEventProps): ReactNode => {
  const [count, setCount] = useState<number>(0);
  const [increment, setIncrement] = useState<number>(initialIncrement);

  const handleTick = useEffectEvent((): void => {
    setCount((previousCount: number): number => previousCount + increment);
  });

  useEffect((): (() => void) => {
    const intervalId: number = window.setInterval((): void => {
      handleTick();
    }, 1000);

    return (): void => {
      window.clearInterval(intervalId);
    };
  }, []);

  const increaseIncrement = (): void => {
    setIncrement((previousIncrement: number): number => previousIncrement + 1);
  };

  const decreaseIncrement = (): void => {
    setIncrement((previousIncrement: number): number => Math.max(0, previousIncrement - 1));
  };

  const reset = (): void => {
    setCount(0);
  };

  return (
    <section>
      <h3>Timer with the latest state</h3>

      <p>Count: {count}</p>
      <p>Increment per second: {increment}</p>

      <button type="button" onClick={decreaseIncrement}>
        Decrease increment
      </button>

      <button type="button" onClick={increaseIncrement}>
        Increase increment
      </button>

      <button type="button" onClick={reset}>
        Reset count
      </button>
    </section>
  );
};

/**
 * Demonstrates an event listener whose setup remains stable while an Effect
 * Event reads the latest `enabled` state. The listener is not re-registered
 * whenever the checkbox changes.
 */
export const EventListenerEffectEventExample: FC<EventListenerEffectEventProps> = ({
  initialEnabled,
}: EventListenerEffectEventProps): ReactNode => {
  const [enabled, setEnabled] = useState<boolean>(initialEnabled);
  const [moveCount, setMoveCount] = useState<number>(0);

  const handlePointerMove = useEffectEvent((): void => {
    if (!enabled) {
      return;
    }

    setMoveCount((previousCount: number): number => previousCount + 1);
  });

  useEffect((): (() => void) => {
    const handleMove = (): void => {
      handlePointerMove();
    };

    window.addEventListener("pointermove", handleMove);

    return (): void => {
      window.removeEventListener("pointermove", handleMove);
    };
  }, []);

  const handleEnabledChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setEnabled(event.target.checked);
  };

  return (
    <section>
      <h3>Event listener with the latest state</h3>

      <label>
        <input type="checkbox" checked={enabled} onChange={handleEnabledChange} />
        Count pointer movements
      </label>

      <p>Counted pointer movements: {moveCount}</p>
    </section>
  );
};

/**
 * Demonstrates separating reactive connection setup from non-reactive
 * notification logic. Changing the room reconnects the external system,
 * while changing the notification preference only changes what happens when
 * the connection event occurs.
 */
export const DependencySeparationExample: FC<DependencySeparationProps> = ({
  initialRoom,
}: DependencySeparationProps): ReactNode => {
  const [room, setRoom] = useState<string>(initialRoom);
  const [muted, setMuted] = useState<boolean>(false);
  const [connectionCount, setConnectionCount] = useState<number>(0);

  const handleConnected = useEffectEvent((): void => {
    setConnectionCount((previousCount: number): number => previousCount + 1);

    if (!muted) {
      console.log(`Connected to ${room}`);
    }
  });

  useEffect((): (() => void) => {
    let cancelled: boolean = false;

    const timerId: number = window.setTimeout((): void => {
      if (!cancelled) {
        handleConnected();
      }
    }, 250);

    return (): void => {
      cancelled = true;
      window.clearTimeout(timerId);
    };
  }, [room]);

  const handleRoomChange = (event: ChangeEvent<HTMLSelectElement>): void => {
    setRoom(event.target.value);
  };

  const handleMutedChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setMuted(event.target.checked);
  };

  return (
    <section>
      <h3>Separating reactive and non-reactive logic</h3>

      <label>
        Room
        <select value={room} onChange={handleRoomChange}>
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
      </label>

      <label>
        <input type="checkbox" checked={muted} onChange={handleMutedChange} />
        Mute connection notifications
      </label>

      <p>Current room: {room}</p>
      <p>Connection events: {connectionCount}</p>
    </section>
  );
};

/**
 * Demonstrates a genuine Effect dependency. The value is used to determine
 * which external resource the Effect synchronizes with, so it belongs in the
 * dependency array rather than being hidden inside an Effect Event.
 */
export const GenuineDependencyExample: FC<GenuineDependencyProps> = ({
  initialValue,
}: GenuineDependencyProps): ReactNode => {
  const [value, setValue] = useState<string>(initialValue);
  const [synchronizations, setSynchronizations] = useState<number>(0);

  useEffect((): void => {
    setSynchronizations((previousCount: number): number => previousCount + 1);

    console.log(`Synchronizing external resource: ${value}`);
  }, [value]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setValue(event.target.value);
  };

  return (
    <section>
      <h3>Keeping genuine dependencies reactive</h3>

      <label>
        Resource
        <input value={value} onChange={handleChange} />
      </label>

      <p>Synchronizations: {synchronizations}</p>
    </section>
  );
};

/**
 * Demonstrates that an Effect Event can be called from an Effect but should
 * not be called directly by a rendered event handler. A regular callback is
 * used for the button because browser event handlers are separate from Effect
 * Events.
 */
export const EffectEventCleanupExample: FC<EffectEventCleanupProps> = ({
  initialLabel,
}: EffectEventCleanupProps): ReactNode => {
  const [label, setLabel] = useState<string>(initialLabel);
  const [status, setStatus] = useState<string>("Waiting");

  const handleReady = useEffectEvent((): void => {
    setStatus(`Ready: ${label}`);
  });

  useEffect((): (() => void) => {
    const timerId: number = window.setTimeout((): void => {
      handleReady();
    }, 500);

    return (): void => {
      window.clearTimeout(timerId);
    };
  }, []);

  const handleLabelChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setLabel(event.target.value);
  };

  return (
    <section>
      <h3>Effect Events belong to Effects</h3>

      <label>
        Label
        <input value={label} onChange={handleLabelChange} />
      </label>

      <p>{status}</p>
    </section>
  );
};

/**
 * Demonstrates the common misconception of using `useEffectEvent` to hide a
 * dependency that should actually cause an Effect to re-run. The invalid
 * pattern is displayed as text and is not executed.
 */
export const EffectEventDependencyGotchaExample: FC = (): ReactNode => {
  const incorrectPattern: string = `
// Incorrect: pageUrl determines what the Effect synchronizes with.
const onVisit = useEffectEvent(() => {
  logVisit(pageUrl);
});

useEffect(() => {
  onVisit();
}, []);

// Correct: keep a genuine synchronization dependency reactive.
useEffect(() => {
  logVisit(pageUrl);
}, [pageUrl]);
`;

  return (
    <section>
      <h3>Gotcha: Effect Events do not hide dependencies</h3>
      <pre>{incorrectPattern}</pre>
    </section>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const UseEffectEventContainer: FC = (): ReactNode => {
  return (
    <main>
      <h1>useEffectEvent</h1>

      <h2>1. Reading the latest value from an Effect Event</h2>
      <LatestValueEffectEventExample initialMessage="John Doe" />

      <h2>2. Reading the latest state from a timer</h2>
      <TimerEffectEventExample initialIncrement={1} />

      <h2>3. Reading the latest state from an event listener</h2>
      <EventListenerEffectEventExample initialEnabled />

      <h2>4. Separating reactive setup from non-reactive event logic</h2>
      <DependencySeparationExample initialRoom="general" />

      <h2>5. Keeping genuine Effect dependencies reactive</h2>
      <GenuineDependencyExample initialValue="example.com" />

      <h2>6. Calling Effect Events only from Effects</h2>
      <EffectEventCleanupExample initialLabel="Ready" />

      <h2>7. Avoiding Effect Events as a dependency workaround</h2>
      <EffectEventDependencyGotchaExample />
    </main>
  );
};

export default UseEffectEventContainer;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - `useEffectEvent` creates a non-reactive function for logic called from an Effect.
// - An Effect Event always reads the latest committed props and state when called.
// - Effect Events can prevent an Effect from re-synchronizing for values that should not trigger synchronization.
// - Effect Events must be called from Effects or other Effect Events.
// - Effect Events must not be called during rendering or passed to components or Hooks.
// - Effect Event functions must not be included in Effect dependency arrays.
// - Genuine synchronization dependencies must remain in the Effect dependency array.
// - `useEffectEvent` should not be used merely to suppress dependency warnings.
