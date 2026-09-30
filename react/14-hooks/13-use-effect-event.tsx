/**
 * useEffectEvent
 * ==============
 *
 * `useEffectEvent` creates a non-reactive Effect Event that can read the
 * latest committed props and state without causing the Effect that calls it
 * to re-synchronize when those values change. It isn't an effect at all; it
 * wraps a function so that it is non-reactive: it always sees the latest props
 * and state, but isn't a dependency and never triggers re-synchronization.
 * It's stable as of React 19.2.
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
 * non-reactive. It also replaces the old "latest ref" pattern
 * (`ref.current = callback`) with something safer and lint-aware, but it is
 * narrow by design: if you want it everywhere, the Effect probably has too
 * many responsibilities and should be split.
 *
 * ---------------------------------------------------------------------
 * useEffect vs useEffectEvent
 * ---------------------------------------------------------------------
 *
 * `useEffect`: runs after React commits and the browser paints. It's for
 * synchronizing with external systems (subscriptions, network, timers,
 * non-React widgets). Everything it reads from render scope is reactive: it
 * must be in the dependency array, and a change re-runs the effect (cleanup,
 * then setup).
 *
 * `useEffectEvent`: non-reactive. It always sees the latest props and state,
 * but isn't a dependency and never triggers re-synchronization.
 *
 * The problem it solves (see examples 1 and 2):
 *
 *   BAD  - `theme` is read inside the Effect, so the linter forces it into
 *          the dependency array: [roomId, theme]. Changing the theme tears
 *          down and reconnects the socket for no reason.
 *
 *            useEffect(() => {
 *              const conn = createConnection(roomId);
 *              conn.on("connected", () => showNotification("Connected!", theme));
 *              conn.connect();
 *              return () => conn.disconnect();
 *            }, [roomId, theme]); // theme change => needless reconnect
 *
 *   GOOD - the `theme` read moves into an Effect Event. The Effect depends
 *          only on [roomId], so it reconnects only when the room changes,
 *          while the notification still shows the latest theme.
 *
 *            const onConnected = useEffectEvent(() => {
 *              showNotification("Connected!", theme); // always latest theme
 *            });
 *
 *            useEffect(() => {
 *              const conn = createConnection(roomId);
 *              conn.on("connected", onConnected);
 *              conn.connect();
 *              return () => conn.disconnect();
 *            }, [roomId]); // only reconnects when roomId changes
 */

import { type ChangeEvent, type FC, type ReactNode, useEffect, useEffectEvent, useState } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface ChatRoomProps {
  readonly initialRoom: string;
  readonly initialTheme: string;
}

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

interface ChatConnection {
  readonly on: (event: "connected", callback: () => void) => void;
  readonly connect: () => void;
  readonly disconnect: () => void;
}

// ---------------------------------------------------------------------
// 2. Fake external system (simulates a chat server connection)
// ---------------------------------------------------------------------

/**
 * A tiny stand-in for a real socket. `connect()` emits the "connected" event
 * after a short delay, `disconnect()` cancels it. This lets the examples show
 * exactly when the Effect re-synchronizes.
 */
const createConnection = (roomId: string): ChatConnection => {
  let listener: (() => void) | null = null;
  let timerId: number | undefined;

  return {
    on: (_event: "connected", callback: () => void): void => {
      listener = callback;
    },
    connect: (): void => {
      console.log(`Connecting to ${roomId}...`);
      timerId = window.setTimeout((): void => {
        listener?.();
      }, 200);
    },
    disconnect: (): void => {
      console.log(`Disconnected from ${roomId}`);
      window.clearTimeout(timerId);
      listener = null;
    },
  };
};

// ---------------------------------------------------------------------
// 3. Component Implementations
// ---------------------------------------------------------------------

/**
 * BAD: `theme` is read inside the Effect, so it must be listed as a
 * dependency. Changing the theme disconnects and reconnects the socket even
 * though the room did not change. Watch "Connections made" climb when you
 * only switch the theme.
 */
export const ChatRoomWithoutEffectEvent: FC<ChatRoomProps> = ({
  initialRoom,
  initialTheme,
}: ChatRoomProps): ReactNode => {
  const [roomId, setRoomId] = useState<string>(initialRoom);
  const [theme, setTheme] = useState<string>(initialTheme);
  const [connectionCount, setConnectionCount] = useState<number>(0);
  const [notification, setNotification] = useState<string>("Not connected yet");

  useEffect((): (() => void) => {
    const connection: ChatConnection = createConnection(roomId);

    connection.on("connected", (): void => {
      setConnectionCount((previousCount: number): number => previousCount + 1);
      setNotification(`Connected to ${roomId} (${theme} theme)`);
    });

    connection.connect();

    return (): void => {
      connection.disconnect();
    };
  }, [roomId, theme]); // theme change => needless reconnect

  const handleRoomChange = (event: ChangeEvent<HTMLSelectElement>): void => {
    setRoomId(event.target.value);
  };

  const handleThemeChange = (event: ChangeEvent<HTMLSelectElement>): void => {
    setTheme(event.target.value);
  };

  return (
    <section>
      <h3>BAD: without useEffectEvent (deps: roomId, theme)</h3>

      <label>
        Room
        <select value={roomId} onChange={handleRoomChange}>
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
      </label>

      <label>
        Theme
        <select value={theme} onChange={handleThemeChange}>
          <option value="light">light</option>
          <option value="dark">dark</option>
        </select>
      </label>

      <p>Connections made: {connectionCount}</p>
      <p>{notification}</p>
      <p>Changing the theme reconnects, which is unnecessary.</p>
    </section>
  );
};

/**
 * GOOD: the `theme` read moves into an Effect Event. The Effect depends only
 * on `roomId`, so it reconnects only when the room changes. The notification
 * still reports the latest theme because the Effect Event always reads the
 * latest committed render. Changing the theme does not increase
 * "Connections made".
 */
export const ChatRoomWithEffectEvent: FC<ChatRoomProps> = ({ initialRoom, initialTheme }: ChatRoomProps): ReactNode => {
  const [roomId, setRoomId] = useState<string>(initialRoom);
  const [theme, setTheme] = useState<string>(initialTheme);
  const [connectionCount, setConnectionCount] = useState<number>(0);
  const [notification, setNotification] = useState<string>("Not connected yet");

  const onConnected = useEffectEvent((): void => {
    setConnectionCount((previousCount: number): number => previousCount + 1);
    setNotification(`Connected to ${roomId} (${theme} theme)`); // always latest theme
  });

  useEffect((): (() => void) => {
    const connection: ChatConnection = createConnection(roomId);

    connection.on("connected", onConnected);
    connection.connect();

    return (): void => {
      connection.disconnect();
    };
  }, [roomId]); // only reconnects when roomId changes

  const handleRoomChange = (event: ChangeEvent<HTMLSelectElement>): void => {
    setRoomId(event.target.value);
  };

  const handleThemeChange = (event: ChangeEvent<HTMLSelectElement>): void => {
    setTheme(event.target.value);
  };

  return (
    <section>
      <h3>GOOD: with useEffectEvent (deps: roomId only)</h3>

      <label>
        Room
        <select value={roomId} onChange={handleRoomChange}>
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
      </label>

      <label>
        Theme
        <select value={theme} onChange={handleThemeChange}>
          <option value="light">light</option>
          <option value="dark">dark</option>
        </select>
      </label>

      <p>Connections made: {connectionCount}</p>
      <p>{notification}</p>
      <p>Changing the theme does not reconnect. Only changing the room does.</p>
    </section>
  );
};

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
// 4. Main Container Component
// ---------------------------------------------------------------------

const UseEffectEventContainer: FC = (): ReactNode => {
  return (
    <main>
      <h1>useEffectEvent</h1>

      <h2>1. The problem: theme as a dependency causes needless reconnects</h2>
      <ChatRoomWithoutEffectEvent initialRoom="general" initialTheme="light" />

      <h2>2. The fix: read theme through an Effect Event</h2>
      <ChatRoomWithEffectEvent initialRoom="general" initialTheme="light" />

      <h2>3. Reading the latest value from an Effect Event</h2>
      <LatestValueEffectEventExample initialMessage="John Doe" />

      <h2>4. Reading the latest state from a timer</h2>
      <TimerEffectEventExample initialIncrement={1} />

      <h2>5. Reading the latest state from an event listener</h2>
      <EventListenerEffectEventExample initialEnabled />

      <h2>6. Separating reactive setup from non-reactive event logic</h2>
      <DependencySeparationExample initialRoom="general" />

      <h2>7. Keeping genuine Effect dependencies reactive</h2>
      <GenuineDependencyExample initialValue="example.com" />

      <h2>8. Calling Effect Events only from Effects</h2>
      <EffectEventCleanupExample initialLabel="Ready" />

      <h2>9. Avoiding Effect Events as a dependency workaround</h2>
      <EffectEventDependencyGotchaExample />
    </main>
  );
};

export default UseEffectEventContainer;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - `useEffect` syncs with external systems after paint; everything it reads is reactive and belongs in deps.
// - `useEffectEvent` is not an effect: it wraps non-reactive logic that always sees the latest props and state.
// - Without it, reading `theme` inside the Effect forces deps [roomId, theme], so a theme change reconnects.
// - With it, the Effect depends only on [roomId]; the theme is still read fresh when the event fires.
// - Effect Events must be called from Effects or other Effect Events.
// - Effect Events must not be called during rendering or passed to components or Hooks.
// - Effect Event functions must not be included in Effect dependency arrays.
// - Genuine synchronization dependencies must remain in the Effect dependency array.
// - `useEffectEvent` should not be used merely to suppress dependency warnings.
