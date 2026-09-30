/**
 * Zustand with TypeScript
 * =======================
 *
 * Zustand can be strongly typed by supplying a store interface to the create function.
 * The store interface describes both the state values and the actions exposed by the store,
 * allowing TypeScript to validate state access, action parameters, and state updates.
 *
 * TypeScript is particularly useful for Zustand stores because store state and actions are
 * consumed from many components. Explicit store types make the shared API predictable while
 * allowing the store implementation to remain concise.
 *
 * Zustand also supports generic state shapes, union types, readonly properties, and typed
 * selectors. The selector's return type determines the portion of the store consumed by a
 * component, while the complete store interface remains available to the store itself.
 */

import { create } from "zustand";
import type { FC, ReactElement } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface TypedCounterStore {
  readonly count: number;
  readonly increment: () => void;
  readonly decrement: () => void;
  readonly reset: () => void;
}

export interface TypedUser {
  readonly id: number;
  readonly name: string;
  readonly email: string;
}

export interface TypedUserStore {
  readonly user: TypedUser | null;
  readonly setUser: (user: TypedUser) => void;
  readonly clearUser: () => void;
}

export interface TypedSettingsStore {
  readonly theme: "light" | "dark";
  readonly notifications: boolean;
  readonly toggleTheme: () => void;
  readonly toggleNotifications: () => void;
}

export interface TypedZustandExampleProps {
  readonly title: string;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

export const useTypedCounterStore = create<TypedCounterStore>((set): TypedCounterStore => ({
  count: 0,
  increment: (): void => {
    set((state): Pick<TypedCounterStore, "count"> => ({
      count: state.count + 1,
    }));
  },
  decrement: (): void => {
    set((state): Pick<TypedCounterStore, "count"> => ({
      count: state.count - 1,
    }));
  },
  reset: (): void => {
    set({
      count: 0,
    });
  },
}));

export const ZustandTypedStoreExample: FC<TypedZustandExampleProps> = ({
  title,
}: TypedZustandExampleProps): ReactElement => {
  const count: number = useTypedCounterStore((state: TypedCounterStore): number => state.count);
  const increment: () => void = useTypedCounterStore((state: TypedCounterStore): (() => void) => state.increment);

  return (
    <article>
      <h3>{title}</h3>
      <p>Count: {count}</p>
      <button type="button" onClick={increment}>
        Increment
      </button>
    </article>
  );
};

export const useTypedUserStore = create<TypedUserStore>((set): TypedUserStore => ({
  user: null,
  setUser: (user: TypedUser): void => {
    set({
      user,
    });
  },
  clearUser: (): void => {
    set({
      user: null,
    });
  },
}));

export const ZustandTypedObjectStateExample: FC<TypedZustandExampleProps> = ({
  title,
}: TypedZustandExampleProps): ReactElement => {
  const user: TypedUser | null = useTypedUserStore((state: TypedUserStore): TypedUser | null => state.user);
  const setUser: (user: TypedUser) => void = useTypedUserStore(
    (state: TypedUserStore): ((user: TypedUser) => void) => state.setUser,
  );

  return (
    <article>
      <h3>{title}</h3>
      <p>{user ? `${user.name} — ${user.email}` : "No user selected"}</p>
      <button
        type="button"
        onClick={() => {
          setUser({
            id: 1,
            name: "John Doe",
            email: "john.doe@example.com",
          });
        }}
      >
        Set user
      </button>
    </article>
  );
};

export const useTypedSettingsStore = create<TypedSettingsStore>((set): TypedSettingsStore => ({
  theme: "light",
  notifications: true,
  toggleTheme: (): void => {
    set((state): Pick<TypedSettingsStore, "theme"> => ({
      theme: state.theme === "light" ? "dark" : "light",
    }));
  },
  toggleNotifications: (): void => {
    set((state): Pick<TypedSettingsStore, "notifications"> => ({
      notifications: !state.notifications,
    }));
  },
}));

export const ZustandLiteralStateExample: FC<TypedZustandExampleProps> = ({
  title,
}: TypedZustandExampleProps): ReactElement => {
  const theme: TypedSettingsStore["theme"] = useTypedSettingsStore(
    (state: TypedSettingsStore): TypedSettingsStore["theme"] => state.theme,
  );

  return (
    <article>
      <h3>{title}</h3>
      <p>Theme: {theme}</p>
    </article>
  );
};

export const ZustandTypedActionExample: FC<TypedZustandExampleProps> = ({
  title,
}: TypedZustandExampleProps): ReactElement => {
  const toggleNotifications: () => void = useTypedSettingsStore(
    (state: TypedSettingsStore): (() => void) => state.toggleNotifications,
  );
  const notifications: boolean = useTypedSettingsStore((state: TypedSettingsStore): boolean => state.notifications);

  return (
    <article>
      <h3>{title}</h3>
      <p>Notifications: {notifications ? "enabled" : "disabled"}</p>
      <button type="button" onClick={toggleNotifications}>
        Toggle notifications
      </button>
    </article>
  );
};

export const ZustandTypedSelectorExample: FC<TypedZustandExampleProps> = ({
  title,
}: TypedZustandExampleProps): ReactElement => {
  const email: string | null = useTypedUserStore((state: TypedUserStore): string | null => state.user?.email ?? null);

  return (
    <article>
      <h3>{title}</h3>
      <p>Selected email: {email ?? "No email available"}</p>
    </article>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const ZustandTypeScriptDemo: FC = (): ReactElement => {
  return (
    <section>
      <h2>1. Typing a Zustand Store</h2>
      <ZustandTypedStoreExample title="Typed Counter Store" />

      <h2>2. Typing Object State and Actions</h2>
      <ZustandTypedObjectStateExample title="Typed User Store" />

      <h2>3. Typing Literal State Values</h2>
      <ZustandLiteralStateExample title="Typed Theme State" />

      <h2>4. Typing Store Actions</h2>
      <ZustandTypedActionExample title="Typed Notification Action" />

      <h2>5. Typing Selectors</h2>
      <ZustandTypedSelectorExample title="Typed Selector" />
    </section>
  );
};

export default ZustandTypeScriptDemo;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// Passing a store interface to create<T>() gives the Zustand store a strongly typed API.
// Store interfaces can describe both state values and action functions.
// Object state can be represented with dedicated interfaces for predictable property access.
// Union types can restrict store values to a known set of valid alternatives.
// Action parameters are checked wherever store actions are called.
// Selectors can be typed according to the specific value they return.
// TypeScript therefore validates the shared contract between the Zustand store and its consumers.
