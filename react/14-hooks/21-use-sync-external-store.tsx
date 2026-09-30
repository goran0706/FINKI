/**
 * useSyncExternalStore
 * ====================
 *
 * `useSyncExternalStore` lets a component subscribe to an external store while
 * keeping its rendered snapshot consistent with React's concurrent rendering
 * model. An external store is state managed outside React, such as a browser
 * API, a third-party state library, or an application-level singleton.
 *
 * The Hook accepts a `subscribe` function and a `getSnapshot` function.
 * `subscribe` registers a callback that React calls when the external store
 * may have changed. `getSnapshot` returns the store's current immutable
 * snapshot. React calls `getSnapshot` during rendering and re-checks the
 * snapshot when the store reports a change.
 *
 * The snapshot returned by `getSnapshot` should be cached. Returning a newly
 * allocated object on every call can cause React to detect a change on every
 * render and can produce an infinite update loop. When the store state is
 * represented by an object, the store should preserve the same object
 * reference when its data has not changed.
 *
 * The optional `getServerSnapshot` function provides the snapshot used during
 * server rendering and during hydration. It should represent the same initial
 * store state that the client expects during hydration.
 *
 * Unlike `useState`, this Hook does not make the external store React-owned.
 * The external store remains the source of truth, while React subscribes to
 * it and reads consistent snapshots for rendering.
 *
 * `useSyncExternalStore` is intended for external stores and subscriptions.
 * For state that belongs entirely to a component, `useState` or another
 * React state Hook is generally the simpler abstraction.
 */

import { type FC, type ReactNode, useSyncExternalStore } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface SyncExternalStoreCounterProps {
  readonly initialCount: number;
}

export interface SyncExternalStoreClockProps {
  readonly initialTime: number;
}

export interface SyncExternalStoreBooleanProps {
  readonly initialValue: boolean;
}

export interface SyncExternalStoreObjectProps {
  readonly initialName: string;
}

export interface SyncExternalStoreServerProps {
  readonly initialValue: string;
}

export interface SyncExternalStoreGotchaProps {
  readonly initialValue: number;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

type Unsubscribe = () => void;
type StoreListener = () => void;

interface CounterStore {
  readonly getSnapshot: () => number;
  readonly subscribe: (listener: StoreListener) => Unsubscribe;
  readonly increment: () => void;
}

const createCounterStore = (initialCount: number): CounterStore => {
  let count: number = initialCount;
  const listeners: Set<StoreListener> = new Set();

  const getSnapshot = (): number => count;

  const subscribe = (listener: StoreListener): Unsubscribe => {
    listeners.add(listener);

    return (): void => {
      listeners.delete(listener);
    };
  };

  const increment = (): void => {
    count += 1;

    listeners.forEach((listener: StoreListener): void => {
      listener();
    });
  };

  return {
    getSnapshot,
    subscribe,
    increment,
  };
};

/**
 * Demonstrates the basic `useSyncExternalStore` contract with a small
 * external counter store. The store owns the value, while React subscribes
 * to changes and reads the current snapshot.
 */
export const SyncExternalStoreCounterExample: FC<SyncExternalStoreCounterProps> = ({
  initialCount,
}: SyncExternalStoreCounterProps): ReactNode => {
  const store: CounterStore = createCounterStore(initialCount);

  const count: number = useSyncExternalStore<number>(store.subscribe, store.getSnapshot, store.getSnapshot);

  return (
    <section>
      <h3>Reading an external store snapshot</h3>

      <p>Count: {count}</p>

      <button type="button" onClick={store.increment}>
        Increment external store
      </button>
    </section>
  );
};

/**
 * Demonstrates an external store whose value represents a browser clock.
 * The store notifies subscribers whenever its external value changes.
 */
export const SyncExternalStoreClockExample: FC<SyncExternalStoreClockProps> = ({
  initialTime,
}: SyncExternalStoreClockProps): ReactNode => {
  let currentTime: number = initialTime;
  const listeners: Set<StoreListener> = new Set();

  const subscribe = (listener: StoreListener): Unsubscribe => {
    listeners.add(listener);

    const intervalId: number = window.setInterval((): void => {
      currentTime = Date.now();

      listeners.forEach((storeListener: StoreListener): void => {
        storeListener();
      });
    }, 1000);

    return (): void => {
      window.clearInterval(intervalId);
      listeners.delete(listener);
    };
  };

  const getSnapshot = (): number => currentTime;

  const timestamp: number = useSyncExternalStore<number>(subscribe, getSnapshot, getSnapshot);

  return (
    <section>
      <h3>Subscribing to changing external data</h3>

      <p>External timestamp: {new Date(timestamp).toLocaleTimeString()}</p>
    </section>
  );
};

/**
 * Demonstrates an external boolean store. The subscription callback is the
 * mechanism that tells React that a new snapshot may be available.
 */
export const SyncExternalStoreBooleanExample: FC<SyncExternalStoreBooleanProps> = ({
  initialValue,
}: SyncExternalStoreBooleanProps): ReactNode => {
  let value: boolean = initialValue;
  const listeners: Set<StoreListener> = new Set();

  const getSnapshot = (): boolean => value;

  const subscribe = (listener: StoreListener): Unsubscribe => {
    listeners.add(listener);

    return (): void => {
      listeners.delete(listener);
    };
  };

  const toggle = (): void => {
    value = !value;

    listeners.forEach((listener: StoreListener): void => {
      listener();
    });
  };

  const enabled: boolean = useSyncExternalStore<boolean>(subscribe, getSnapshot, getSnapshot);

  return (
    <section>
      <h3>Subscribing to a primitive external snapshot</h3>

      <p>Status: {enabled ? "Enabled" : "Disabled"}</p>

      <button type="button" onClick={toggle}>
        Toggle external value
      </button>
    </section>
  );
};

/**
 * Demonstrates the snapshot identity requirement. The store caches its
 * snapshot object and replaces that object only when the underlying data
 * changes, allowing React to compare snapshots by reference.
 */
export const SyncExternalStoreObjectExample: FC<SyncExternalStoreObjectProps> = ({
  initialName,
}: SyncExternalStoreObjectProps): ReactNode => {
  interface UserSnapshot {
    readonly name: string;
  }

  let snapshot: UserSnapshot = {
    name: initialName,
  };

  const listeners: Set<StoreListener> = new Set();

  const getSnapshot = (): UserSnapshot => snapshot;

  const subscribe = (listener: StoreListener): Unsubscribe => {
    listeners.add(listener);

    return (): void => {
      listeners.delete(listener);
    };
  };

  const updateName = (): void => {
    snapshot = {
      name: "John Doe",
    };

    listeners.forEach((listener: StoreListener): void => {
      listener();
    });
  };

  const user: UserSnapshot = useSyncExternalStore<UserSnapshot>(subscribe, getSnapshot, getSnapshot);

  return (
    <section>
      <h3>Caching an object snapshot</h3>

      <p>Name: {user.name}</p>

      <button type="button" onClick={updateName}>
        Update external object
      </button>
    </section>
  );
};

/**
 * Demonstrates the optional third argument. `getServerSnapshot` supplies the
 * snapshot React can use during server rendering and hydration.
 */
export const SyncExternalStoreServerExample: FC<SyncExternalStoreServerProps> = ({
  initialValue,
}: SyncExternalStoreServerProps): ReactNode => {
  let value: string = initialValue;
  const listeners: Set<StoreListener> = new Set();

  const subscribe = (listener: StoreListener): Unsubscribe => {
    listeners.add(listener);

    return (): void => {
      listeners.delete(listener);
    };
  };

  const getSnapshot = (): string => value;

  const getServerSnapshot = (): string => initialValue;

  const updateValue = (): void => {
    value = "Updated value";

    listeners.forEach((listener: StoreListener): void => {
      listener();
    });
  };

  const currentValue: string = useSyncExternalStore<string>(subscribe, getSnapshot, getServerSnapshot);

  return (
    <section>
      <h3>Providing a server snapshot</h3>

      <p>Value: {currentValue}</p>

      <button type="button" onClick={updateValue}>
        Update value
      </button>
    </section>
  );
};

/**
 * Demonstrates that the external store remains outside React state. The
 * component does not call a React state setter to change the store; it mutates
 * the external source and notifies its subscribers.
 */
export const SyncExternalStoreOwnershipExample: FC = (): ReactNode => {
  let value: number = 0;
  const listeners: Set<StoreListener> = new Set();

  const subscribe = (listener: StoreListener): Unsubscribe => {
    listeners.add(listener);

    return (): void => {
      listeners.delete(listener);
    };
  };

  const getSnapshot = (): number => value;

  const increment = (): void => {
    value += 1;

    listeners.forEach((listener: StoreListener): void => {
      listener();
    });
  };

  const currentValue: number = useSyncExternalStore<number>(subscribe, getSnapshot, getSnapshot);

  return (
    <section>
      <h3>Keeping ownership outside React</h3>

      <p>External value: {currentValue}</p>

      <button type="button" onClick={increment}>
        Increment external state
      </button>
    </section>
  );
};

/**
 * Demonstrates the common snapshot caching gotcha. The store keeps the
 * snapshot in a stable variable instead of creating a fresh object every time
 * `getSnapshot` is called.
 */
export const SyncExternalStoreGotchaExample: FC<SyncExternalStoreGotchaProps> = ({
  initialValue,
}: SyncExternalStoreGotchaProps): ReactNode => {
  interface Snapshot {
    readonly value: number;
  }

  let snapshot: Snapshot = {
    value: initialValue,
  };

  const listeners: Set<StoreListener> = new Set();

  const getSnapshot = (): Snapshot => snapshot;

  const subscribe = (listener: StoreListener): Unsubscribe => {
    listeners.add(listener);

    return (): void => {
      listeners.delete(listener);
    };
  };

  const increment = (): void => {
    snapshot = {
      value: snapshot.value + 1,
    };

    listeners.forEach((listener: StoreListener): void => {
      listener();
    });
  };

  const currentSnapshot: Snapshot = useSyncExternalStore<Snapshot>(subscribe, getSnapshot, getSnapshot);

  return (
    <section>
      <h3>Gotcha: snapshots must be cached</h3>

      <p>Value: {currentSnapshot.value}</p>

      <button type="button" onClick={increment}>
        Increment snapshot
      </button>

      <p>A snapshot object should retain its identity until the represented external state actually changes.</p>
    </section>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const UseSyncExternalStoreContainer: FC = (): ReactNode => {
  return (
    <main>
      <h1>useSyncExternalStore</h1>

      <h2>1. Reading an external store snapshot</h2>
      <SyncExternalStoreCounterExample initialCount={0} />

      <h2>2. Subscribing to changing external data</h2>
      <SyncExternalStoreClockExample initialTime={Date.now()} />

      <h2>3. Subscribing to a primitive external snapshot</h2>
      <SyncExternalStoreBooleanExample initialValue={false} />

      <h2>4. Caching an object snapshot</h2>
      <SyncExternalStoreObjectExample initialName="John Doe" />

      <h2>5. Providing a server snapshot</h2>
      <SyncExternalStoreServerExample initialValue="Initial value" />

      <h2>6. Keeping external state ownership outside React</h2>
      <SyncExternalStoreOwnershipExample />

      <h2>7. Keeping snapshots cached</h2>
      <SyncExternalStoreGotchaExample initialValue={0} />
    </main>
  );
};

export default UseSyncExternalStoreContainer;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - `useSyncExternalStore` subscribes React components to external stores.
// - `subscribe` registers a listener that tells React when the store may have changed.
// - `getSnapshot` returns the store's current snapshot.
// - The snapshot returned by `getSnapshot` must be cached when it is an object.
// - A new snapshot reference should represent an actual change in external state.
// - `getServerSnapshot` provides the snapshot used during server rendering and hydration.
// - The external store remains the source of truth rather than becoming React state.
// - The Hook is intended for external subscriptions, not ordinary component-local state.
// - Proper cleanup from `subscribe` prevents stale subscriptions and unnecessary notifications.
