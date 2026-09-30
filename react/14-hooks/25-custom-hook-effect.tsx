/**
 * Custom Hook Effect
 * ==================
 *
 * A custom Hook can encapsulate side effects so that components consume a
 * reusable behavior instead of managing effect setup and cleanup directly.
 * The custom Hook calls `useEffect` internally and exposes only the values or
 * actions needed by its caller.
 *
 * An effect runs after React commits a render. React executes the effect setup
 * function after the component is committed and executes the returned cleanup
 * function before the effect is re-run because dependencies changed and when
 * the component unmounts.
 *
 * Dependencies describe the reactive values used by the effect. When a
 * dependency changes according to React's dependency comparison, React cleans
 * up the previous effect and then runs the new setup. A custom Hook should
 * include the same dependencies its internal effect actually uses.
 *
 * Custom Hooks are useful for encapsulating subscriptions, timers, browser
 * event listeners, synchronization with external systems, and other effects
 * that recur across components. The Hook should keep setup and cleanup paired
 * so that repeated renders do not accumulate stale resources.
 *
 * A common misconception is that a custom Hook makes an effect global or
 * shared. It does not. Every component that invokes the custom Hook gets its
 * own effect lifecycle and its own resources.
 */

import { type ChangeEvent, type FC, type ReactNode, useEffect, useState } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface CustomHookEffectWindowTitleProps {
  readonly title: string;
}

export interface CustomHookEffectIntervalProps {
  readonly initialSeconds: number;
  readonly enabled: boolean;
}

export interface CustomHookEffectEventListenerProps {
  readonly initialValue: string;
}

export interface CustomHookEffectSubscriptionProps {
  readonly channelName: string;
}

export interface CustomHookEffectOnlineStatusProps {
  readonly initialEnabled: boolean;
}

export interface CustomHookEffectStorageProps {
  readonly storageKey: string;
  readonly initialValue: string;
}

export interface CustomHookEffectFetchProps {
  readonly url: string;
}

export interface CustomHookEffectCleanupProps {
  readonly resourceName: string;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * Synchronizes the browser document title with a component value. The effect
 * reruns only when the title changes.
 */
const useDocumentTitle = (title: string): void => {
  useEffect((): void => {
    document.title = title;
  }, [title]);
};

/**
 * Demonstrates a custom Hook that synchronizes React state with an external
 * browser property.
 */
export const CustomHookEffectWindowTitleExample: FC<CustomHookEffectWindowTitleProps> = ({
  title,
}: CustomHookEffectWindowTitleProps): ReactNode => {
  useDocumentTitle(title);

  return (
    <section>
      <h3>Synchronizing a browser property</h3>

      <p>Document title: {title}</p>
    </section>
  );
};

interface IntervalHookResult {
  readonly seconds: number;
  readonly reset: () => void;
}

/**
 * Encapsulates interval setup, interval cleanup, and elapsed-time state.
 * Clearing the interval when the effect is disabled or unmounted prevents
 * multiple timers from continuing to update state.
 */
const useIntervalCounter = (initialSeconds: number, enabled: boolean): IntervalHookResult => {
  const [seconds, setSeconds] = useState<number>(initialSeconds);

  useEffect((): (() => void) | undefined => {
    if (!enabled) {
      return undefined;
    }

    const intervalId: number = window.setInterval((): void => {
      setSeconds((previousSeconds: number): number => previousSeconds + 1);
    }, 1000);

    return (): void => {
      window.clearInterval(intervalId);
    };
  }, [enabled]);

  const reset = (): void => {
    setSeconds(initialSeconds);
  };

  return {
    seconds,
    reset,
  };
};

/**
 * Demonstrates a custom Hook that owns an interval effect and exposes the
 * resulting state and reset operation.
 */
export const CustomHookEffectIntervalExample: FC<CustomHookEffectIntervalProps> = ({
  initialSeconds,
  enabled,
}: CustomHookEffectIntervalProps): ReactNode => {
  const { seconds, reset }: IntervalHookResult = useIntervalCounter(initialSeconds, enabled);

  return (
    <section>
      <h3>Encapsulating an interval effect</h3>

      <p>Elapsed seconds: {seconds}</p>
      <p>Interval: {enabled ? "Running" : "Stopped"}</p>

      <button type="button" onClick={reset}>
        Reset
      </button>
    </section>
  );
};

interface WindowKeyHookResult {
  readonly lastKey: string;
}

/**
 * Encapsulates a browser keyboard subscription. The listener is registered
 * once for the Hook instance and removed when the component unmounts.
 */
const useWindowKey = (): WindowKeyHookResult => {
  const [lastKey, setLastKey] = useState<string>("");

  useEffect((): (() => void) => {
    const handleKeyDown = (event: KeyboardEvent): void => {
      setLastKey(event.key);
    };

    window.addEventListener("keydown", handleKeyDown);

    return (): void => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return {
    lastKey,
  };
};

/**
 * Demonstrates encapsulating a browser event listener inside a custom Hook.
 */
export const CustomHookEffectEventListenerExample: FC<CustomHookEffectEventListenerProps> = ({
  initialValue,
}: CustomHookEffectEventListenerProps): ReactNode => {
  const { lastKey }: WindowKeyHookResult = useWindowKey();

  const [value, setValue] = useState<string>(initialValue);

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setValue(event.target.value);
  };

  return (
    <section>
      <h3>Encapsulating a browser event subscription</h3>

      <label>
        Value
        <input value={value} onChange={handleChange} />
      </label>

      <p>Last keyboard key: {lastKey || "(none)"}</p>
    </section>
  );
};

interface ChannelSubscription {
  readonly subscribe: (listener: (message: string) => void) => () => void;
  readonly publish: (message: string) => void;
}

const channelStores: Map<string, Set<(message: string) => void>> = new Map();

/**
 * Creates a small in-memory external channel. Each channel has its own
 * listener set, and subscribers receive messages published to that channel.
 */
const getChannelSubscription = (channelName: string): ChannelSubscription => {
  const getListeners = (): Set<(message: string) => void> => {
    const existingListeners: Set<(message: string) => void> | undefined = channelStores.get(channelName);

    if (existingListeners !== undefined) {
      return existingListeners;
    }

    const listeners: Set<(message: string) => void> = new Set();

    channelStores.set(channelName, listeners);

    return listeners;
  };

  const subscribe = (listener: (message: string) => void): (() => void) => {
    const listeners: Set<(message: string) => void> = getListeners();

    listeners.add(listener);

    return (): void => {
      listeners.delete(listener);
    };
  };

  const publish = (message: string): void => {
    const listeners: Set<(message: string) => void> = getListeners();

    listeners.forEach((listener: (message: string) => void): void => {
      listener(message);
    });
  };

  return {
    subscribe,
    publish,
  };
};

/**
 * Subscribes to an external channel whenever the channel name changes. The
 * previous subscription is cleaned up before the new subscription is created.
 */
const useChannelSubscription = (
  channelName: string,
): {
  readonly message: string;
  readonly publish: (message: string) => void;
} => {
  const [message, setMessage] = useState<string>("");

  useEffect((): (() => void) => {
    const channel: ChannelSubscription = getChannelSubscription(channelName);

    const unsubscribe: () => void = channel.subscribe((nextMessage: string): void => {
      setMessage(nextMessage);
    });

    return (): void => {
      unsubscribe();
    };
  }, [channelName]);

  const publish = (nextMessage: string): void => {
    const channel: ChannelSubscription = getChannelSubscription(channelName);

    channel.publish(nextMessage);
  };

  return {
    message,
    publish,
  };
};

/**
 * Demonstrates a custom Hook that owns an external subscription whose resource
 * changes when an input dependency changes.
 */
export const CustomHookEffectSubscriptionExample: FC<CustomHookEffectSubscriptionProps> = ({
  channelName,
}: CustomHookEffectSubscriptionProps): ReactNode => {
  const {
    message,
    publish,
  }: {
    readonly message: string;
    readonly publish: (message: string) => void;
  } = useChannelSubscription(channelName);

  return (
    <section>
      <h3>Encapsulating an external subscription</h3>

      <p>Channel: {channelName}</p>
      <p>Latest message: {message || "(none)"}</p>

      <button type="button" onClick={(): void => publish("Hello from the external channel.")}>
        Publish message
      </button>
    </section>
  );
};

interface OnlineStatusHookResult {
  readonly online: boolean;
}

/**
 * Encapsulates browser online/offline event subscriptions. The initial value
 * is read synchronously, while the effect keeps the value synchronized with
 * subsequent browser events.
 */
const useOnlineStatus = (): OnlineStatusHookResult => {
  const [online, setOnline] = useState<boolean>(navigator.onLine);

  useEffect((): (() => void) => {
    const handleOnline = (): void => {
      setOnline(true);
    };

    const handleOffline = (): void => {
      setOnline(false);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return (): void => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return {
    online,
  };
};

/**
 * Demonstrates encapsulating synchronization with browser connectivity events.
 */
export const CustomHookEffectOnlineStatusExample: FC<CustomHookEffectOnlineStatusProps> = ({
  initialEnabled,
}: CustomHookEffectOnlineStatusProps): ReactNode => {
  const { online }: OnlineStatusHookResult = useOnlineStatus();

  const [enabled, setEnabled] = useState<boolean>(initialEnabled);

  return (
    <section>
      <h3>Encapsulating browser connectivity events</h3>

      <p>Browser status: {online ? "Online" : "Offline"}</p>
      <p>Local feature: {enabled ? "Enabled" : "Disabled"}</p>

      <button
        type="button"
        onClick={(): void => {
          setEnabled((previousEnabled: boolean): boolean => !previousEnabled);
        }}
      >
        Toggle feature
      </button>
    </section>
  );
};

interface StorageHookResult {
  readonly value: string;
  readonly setValue: (value: string) => void;
}

/**
 * Synchronizes a state value with localStorage. The effect writes only after
 * the React state changes, while the initializer reads the existing stored
 * value once when the Hook instance is initialized.
 */
const useStoredValue = (storageKey: string, initialValue: string): StorageHookResult => {
  const [value, setValue] = useState<string>((): string => {
    const storedValue: string | null = window.localStorage.getItem(storageKey);

    return storedValue ?? initialValue;
  });

  useEffect((): void => {
    window.localStorage.setItem(storageKey, value);
  }, [storageKey, value]);

  return {
    value,
    setValue,
  };
};

/**
 * Demonstrates a custom Hook that synchronizes React state with browser
 * storage and reacts correctly when its storage key changes.
 */
export const CustomHookEffectStorageExample: FC<CustomHookEffectStorageProps> = ({
  storageKey,
  initialValue,
}: CustomHookEffectStorageProps): ReactNode => {
  const { value, setValue }: StorageHookResult = useStoredValue(storageKey, initialValue);

  return (
    <section>
      <h3>Synchronizing state with localStorage</h3>

      <p>Stored value: {value}</p>

      <button type="button" onClick={(): void => setValue("Updated stored value")}>
        Update stored value
      </button>
    </section>
  );
};

interface FetchHookResult {
  readonly data: string | null;
  readonly loading: boolean;
  readonly error: string | null;
}

/**
 * Demonstrates asynchronous effect cleanup. The AbortController prevents an
 * obsolete request from updating state after the URL changes or the component
 * unmounts.
 */
const useFetchText = (url: string): FetchHookResult => {
  const [data, setData] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect((): (() => void) => {
    const controller: AbortController = new AbortController();

    const load = async (): Promise<void> => {
      setLoading(true);
      setError(null);

      try {
        const response: Response = await fetch(url, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}.`);
        }

        const responseText: string = await response.text();

        setData(responseText);
        setLoading(false);
      } catch (caughtError: unknown) {
        if (controller.signal.aborted) {
          return;
        }

        const message: string = caughtError instanceof Error ? caughtError.message : "Unknown request error.";

        setError(message);
        setLoading(false);
      }
    };

    void load();

    return (): void => {
      controller.abort();
    };
  }, [url]);

  return {
    data,
    loading,
    error,
  };
};

/**
 * Demonstrates encapsulating an asynchronous request, loading state, error
 * state, and request cancellation inside a custom Hook.
 */
export const CustomHookEffectFetchExample: FC<CustomHookEffectFetchProps> = ({
  url,
}: CustomHookEffectFetchProps): ReactNode => {
  const { data, loading, error }: FetchHookResult = useFetchText(url);

  return (
    <section>
      <h3>Encapsulating an asynchronous effect</h3>

      {loading && <p>Loading...</p>}

      {error !== null && <p>Error: {error}</p>}

      {data !== null && <pre>{data}</pre>}
    </section>
  );
};

interface CleanupHookResult {
  readonly active: boolean;
}

/**
 * Encapsulates a resource lifecycle where setup and cleanup are paired. The
 * cleanup changes local state so the example can visibly demonstrate the
 * lifecycle transition.
 */
const useResourceLifecycle = (resourceName: string): CleanupHookResult => {
  const [active, setActive] = useState<boolean>(false);

  useEffect((): (() => void) => {
    setActive(true);

    return (): void => {
      setActive(false);
    };
  }, [resourceName]);

  return {
    active,
  };
};

/**
 * Demonstrates the cleanup requirement for effects that create or acquire
 * resources. Changing the resource name tears down the previous lifecycle.
 */
export const CustomHookEffectCleanupExample: FC<CustomHookEffectCleanupProps> = ({
  resourceName,
}: CustomHookEffectCleanupProps): ReactNode => {
  const { active }: CleanupHookResult = useResourceLifecycle(resourceName);

  return (
    <section>
      <h3>Pairing effect setup with cleanup</h3>

      <p>Resource: {resourceName}</p>
      <p>Lifecycle: {active ? "Active" : "Inactive"}</p>
    </section>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const CustomHookEffectContainer: FC = (): ReactNode => {
  return (
    <main>
      <h1>Custom Hook Effect</h1>

      <h2>1. Synchronizing a browser property</h2>
      <CustomHookEffectWindowTitleExample title="Custom Hook Example" />

      <h2>2. Encapsulating an interval effect</h2>
      <CustomHookEffectIntervalExample initialSeconds={0} enabled={true} />

      <h2>3. Encapsulating a browser event subscription</h2>
      <CustomHookEffectEventListenerExample initialValue="" />

      <h2>4. Encapsulating an external subscription</h2>
      <CustomHookEffectSubscriptionExample channelName="example" />

      <h2>5. Encapsulating browser connectivity events</h2>
      <CustomHookEffectOnlineStatusExample initialEnabled={true} />

      <h2>6. Synchronizing state with localStorage</h2>
      <CustomHookEffectStorageExample storageKey="example-message" initialValue="Initial stored value" />

      <h2>7. Encapsulating an asynchronous effect</h2>
      <CustomHookEffectFetchExample url="https://example.com" />

      <h2>8. Pairing effect setup with cleanup</h2>
      <CustomHookEffectCleanupExample resourceName="Example resource" />
    </main>
  );
};

export default CustomHookEffectContainer;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - A custom Hook can encapsulate `useEffect` and expose reusable side-effect behavior.
// - Effects run after React commits a render and can return cleanup functions.
// - Cleanup runs before an effect is re-run because dependencies changed and when the component unmounts.
// - Effect dependencies must include the reactive values used by the effect.
// - Browser event listeners, timers, subscriptions, storage synchronization, and asynchronous requests can be encapsulated in custom Hooks.
// - Every component that invokes an effect-based custom Hook receives its own effect lifecycle.
// - External resources should always have matching cleanup logic.
// - Asynchronous effects should prevent obsolete requests from updating current component state.
// - `AbortController` can cancel fetch requests when an effect becomes obsolete.
// - Custom Hooks do not make effects global or share effect resources between component instances.
