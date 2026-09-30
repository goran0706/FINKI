/**
 * Zustand Selectors
 * =================
 *
 * A Zustand selector is a function that receives the complete store state and returns the
 * specific value a component needs. Components can therefore subscribe to a single property
 * instead of reading the entire store.
 *
 * Zustand compares the selected result to determine whether the subscribed component should
 * render again. Selecting stable primitive values such as strings, numbers, and booleans is
 * straightforward because their values can be compared directly.
 *
 * Selecting multiple values requires additional care because returning a newly created object
 * or array produces a new reference. Zustand provides useShallow for shallow comparison when
 * selecting multiple independent values into a new object or array.
 *
 * Selectors are also useful for deriving values from state. A derived selector computes a value
 * from existing store data without storing a second copy of that derived value in the store.
 */

import { create } from "zustand";
import { useShallow } from "zustand/react/shallow";
import type { FC, ReactElement } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface SelectorUser {
  readonly id: number;
  readonly name: string;
  readonly email: string;
}

export interface SelectorStore {
  readonly count: number;
  readonly user: SelectorUser;
  readonly notifications: number;
  readonly increment: () => void;
  readonly addNotification: () => void;
}

export interface ZustandSelectorExampleProps {
  readonly title: string;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

export const useSelectorStore = create<SelectorStore>((set): SelectorStore => ({
  count: 0,
  user: {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
  },
  notifications: 0,
  increment: (): void => {
    set((state): Pick<SelectorStore, "count"> => ({
      count: state.count + 1,
    }));
  },
  addNotification: (): void => {
    set((state): Pick<SelectorStore, "notifications"> => ({
      notifications: state.notifications + 1,
    }));
  },
}));

export const ZustandPrimitiveSelectorExample: FC<ZustandSelectorExampleProps> = ({
  title,
}: ZustandSelectorExampleProps): ReactElement => {
  const count: number = useSelectorStore((state: SelectorStore): number => state.count);
  const increment: () => void = useSelectorStore((state: SelectorStore): (() => void) => state.increment);

  return (
    <article>
      <h3>{title}</h3>
      <p>Selected count: {count}</p>
      <button type="button" onClick={increment}>
        Increment count
      </button>
    </article>
  );
};

export const ZustandNestedSelectorExample: FC<ZustandSelectorExampleProps> = ({
  title,
}: ZustandSelectorExampleProps): ReactElement => {
  const email: string = useSelectorStore((state: SelectorStore): string => state.user.email);

  return (
    <article>
      <h3>{title}</h3>
      <p>Selected email: {email}</p>
    </article>
  );
};

export const ZustandDerivedSelectorExample: FC<ZustandSelectorExampleProps> = ({
  title,
}: ZustandSelectorExampleProps): ReactElement => {
  const notificationSummary: string = useSelectorStore((state: SelectorStore): string =>
    state.notifications === 0
      ? "No new notifications"
      : `${state.notifications} new notification${state.notifications === 1 ? "" : "s"}`,
  );
  const addNotification: () => void = useSelectorStore((state: SelectorStore): (() => void) => state.addNotification);

  return (
    <article>
      <h3>{title}</h3>
      <p>{notificationSummary}</p>
      <button type="button" onClick={addNotification}>
        Add notification
      </button>
    </article>
  );
};

export const ZustandMultipleSelectorExample: FC<ZustandSelectorExampleProps> = ({
  title,
}: ZustandSelectorExampleProps): ReactElement => {
  const selection: {
    readonly name: string;
    readonly email: string;
  } = useSelectorStore(
    useShallow(
      (
        state: SelectorStore,
      ): {
        readonly name: string;
        readonly email: string;
      } => ({
        name: state.user.name,
        email: state.user.email,
      }),
    ),
  );

  return (
    <article>
      <h3>{title}</h3>
      <p>Name: {selection.name}</p>
      <p>Email: {selection.email}</p>
    </article>
  );
};

export const ZustandUnstableSelectorExample: FC<ZustandSelectorExampleProps> = ({
  title,
}: ZustandSelectorExampleProps): ReactElement => {
  const user: SelectorUser = useSelectorStore((state: SelectorStore): SelectorUser => state.user);

  return (
    <article>
      <h3>{title}</h3>
      <p>The user object is selected by reference and remains stable until the store replaces that object.</p>
      <p>Selected user: {user.name}</p>
    </article>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const ZustandSelectorsDemo: FC = (): ReactElement => {
  return (
    <section>
      <h2>1. Selecting a Primitive Store Value</h2>
      <ZustandPrimitiveSelectorExample title="Primitive Selector" />

      <h2>2. Selecting a Nested Store Value</h2>
      <ZustandNestedSelectorExample title="Nested Selector" />

      <h2>3. Deriving a Value with a Selector</h2>
      <ZustandDerivedSelectorExample title="Derived Selector" />

      <h2>4. Selecting Multiple Values with useShallow</h2>
      <ZustandMultipleSelectorExample title="Multiple-Value Selector" />

      <h2>5. Selecting an Object by Reference</h2>
      <ZustandUnstableSelectorExample title="Object Reference Selector" />
    </section>
  );
};

export default ZustandSelectorsDemo;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// A Zustand selector receives the complete store state and returns the value a component needs.
// Selecting a primitive value gives the component a stable scalar subscription target.
// Nested properties can be selected directly without subscribing to unrelated state.
// Selectors can derive display values from existing state instead of storing duplicated derived state.
// Returning a new object or array creates a new reference on every selector evaluation.
// useShallow can compare multiple selected values shallowly when a selector returns a new object or array.
// Selecting an existing object reference avoids creating a new container around that object.
