/**
 * State Store
 * ===========
 *
 * A state store is a centralized mechanism for holding client-side state and exposing controlled
 * operations for reading, updating, and subscribing to changes in that state. Unlike component
 * local state, the store exists independently of any particular component instance.
 *
 * A basic store typically has three responsibilities: maintaining the current state, providing
 * operations that update that state, and notifying subscribers when the state changes. Components
 * can subscribe to the store and re-render when the selected client state changes.
 *
 * React provides useSyncExternalStore for safely subscribing to state that lives outside React's
 * own state system. Libraries such as Redux and Zustand build more complete state-management
 * abstractions around the same general idea of centralized state, updates, and subscriptions.
 *
 * A state store does not automatically mean that every piece of application state should be stored
 * globally. A store is useful when multiple independent parts of an application need coordinated
 * access to the same client-owned state.
 */

import type { FC, ReactElement } from "react";
import { useSyncExternalStore } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface AppState {
  readonly count: number;
  readonly theme: "light" | "dark";
}

export interface StateStore {
  readonly getState: () => AppState;
  readonly increment: () => void;
  readonly toggleTheme: () => void;
  readonly subscribe: (listener: () => void) => () => void;
}

export interface StoreCounterProps {
  readonly label: string;
}

export interface StoreThemeProps {
  readonly label: string;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

const createStateStore = (initialState: AppState): StateStore => {
  let state: AppState = initialState;
  const listeners: Set<() => void> = new Set();

  const getState = (): AppState => {
    return state;
  };

  const notify = (): void => {
    listeners.forEach((listener: () => void): void => {
      listener();
    });
  };

  const increment = (): void => {
    state = {
      ...state,
      count: state.count + 1,
    };
    notify();
  };

  const toggleTheme = (): void => {
    state = {
      ...state,
      theme: state.theme === "light" ? "dark" : "light",
    };
    notify();
  };

  const subscribe = (listener: () => void): (() => void) => {
    listeners.add(listener);

    return (): void => {
      listeners.delete(listener);
    };
  };

  return {
    getState,
    increment,
    toggleTheme,
    subscribe,
  };
};

const appStore: StateStore = createStateStore({
  count: 0,
  theme: "light",
});

export const StoreCounter: FC<StoreCounterProps> = ({ label }): ReactElement => {
  const count: number = useSyncExternalStore(
    appStore.subscribe,
    (): number => appStore.getState().count,
    (): number => appStore.getState().count,
  );

  return (
    <div>
      <p>
        {label}: {count}
      </p>
      <button type="button" onClick={appStore.increment}>
        Increment
      </button>
    </div>
  );
};

export const StoreTheme: FC<StoreThemeProps> = ({ label }): ReactElement => {
  const theme: "light" | "dark" = useSyncExternalStore(
    appStore.subscribe,
    (): "light" | "dark" => appStore.getState().theme,
    (): "light" | "dark" => appStore.getState().theme,
  );

  return (
    <div>
      <p>
        {label}: {theme}
      </p>
      <button type="button" onClick={appStore.toggleTheme}>
        Toggle theme
      </button>
    </div>
  );
};

export const StoreStateDescription: FC = (): ReactElement => {
  return (
    <article>
      <h3>Centralized client state</h3>
      <p>
        The store owns the current state and exposes operations that change it. Components subscribe to the store rather
        than owning separate copies of the shared values.
      </p>
    </article>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const StateStoreDemo: FC = (): ReactElement => {
  return (
    <section>
      <h2>1. A Centralized State Store</h2>
      <StoreStateDescription />

      <h2>2. Multiple Components Reading the Same Store</h2>
      <StoreCounter label="Counter A" />
      <StoreCounter label="Counter B" />

      <h2>3. Updating Shared Store State</h2>
      <StoreTheme label="Current theme" />
      <StoreTheme label="Theme in another component" />
    </section>
  );
};

export default StateStoreDemo;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// A state store holds client state outside any particular component instance.
// A store commonly provides state access, update operations, and subscriptions.
// Store updates notify subscribed components so they can obtain the latest state.
// useSyncExternalStore connects React components to external stores safely.
// Multiple components can subscribe to and read the same store state.
// Centralized state allows independent components to coordinate around shared client data.
// A store does not make every piece of state global by default.
// Local state remains appropriate when a value is only needed by one component or feature.
// More complete state-management libraries provide additional abstractions around the store pattern.
