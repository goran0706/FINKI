/**
 * Zustand
 * =======
 *
 * Zustand is a lightweight state-management library for React that creates a store as a hook.
 * A Zustand store can contain both state and actions, and components subscribe directly to the
 * specific state selected from that store without requiring a React Context Provider.
 *
 * The create function accepts a state initializer and returns a React hook. The initializer
 * receives set and get functions: set updates store state, while get reads the current state
 * from inside store actions. Components call the generated hook with a selector to subscribe
 * only to the state they need.
 *
 * Zustand stores are external to React component state. Updating the store notifies subscribed
 * components and causes components whose selected values changed to render again. This makes
 * Zustand useful when state needs to be shared across otherwise unrelated component branches.
 */

import { create } from "zustand";
import type { FC, ReactElement } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface ZustandCounterStore {
  readonly count: number;
  readonly increment: () => void;
  readonly decrement: () => void;
  readonly reset: () => void;
}

export interface ZustandUserStore {
  readonly name: string;
  readonly setName: (name: string) => void;
}

export interface ZustandThemeStore {
  readonly theme: "light" | "dark";
  readonly toggleTheme: () => void;
}

export interface ZustandExampleProps {
  readonly label: string;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

export const useCounterStore = create<ZustandCounterStore>((set): ZustandCounterStore => ({
  count: 0,
  increment: (): void => {
    set((state): Pick<ZustandCounterStore, "count"> => ({
      count: state.count + 1,
    }));
  },
  decrement: (): void => {
    set((state): Pick<ZustandCounterStore, "count"> => ({
      count: state.count - 1,
    }));
  },
  reset: (): void => {
    set({
      count: 0,
    });
  },
}));

export const useUserStore = create<ZustandUserStore>((set): ZustandUserStore => ({
  name: "John Doe",
  setName: (name: string): void => {
    set({
      name,
    });
  },
}));

export const useThemeStore = create<ZustandThemeStore>((set): ZustandThemeStore => ({
  theme: "light",
  toggleTheme: (): void => {
    set((state): Pick<ZustandThemeStore, "theme"> => ({
      theme: state.theme === "light" ? "dark" : "light",
    }));
  },
}));

export const ZustandStoreHookExample: FC<ZustandExampleProps> = ({ label }: ZustandExampleProps): ReactElement => {
  const count: number = useCounterStore((state: ZustandCounterStore): number => state.count);

  return (
    <article>
      <h3>{label}</h3>
      <p>Count: {count}</p>
    </article>
  );
};

export const ZustandActionsExample: FC<ZustandExampleProps> = ({ label }: ZustandExampleProps): ReactElement => {
  const count: number = useCounterStore((state: ZustandCounterStore): number => state.count);
  const increment: () => void = useCounterStore((state: ZustandCounterStore): (() => void) => state.increment);
  const decrement: () => void = useCounterStore((state: ZustandCounterStore): (() => void) => state.decrement);
  const reset: () => void = useCounterStore((state: ZustandCounterStore): (() => void) => state.reset);

  return (
    <article>
      <h3>{label}</h3>
      <p>Count: {count}</p>
      <button type="button" onClick={increment}>
        Increment
      </button>
      <button type="button" onClick={decrement}>
        Decrement
      </button>
      <button type="button" onClick={reset}>
        Reset
      </button>
    </article>
  );
};

export const ZustandSharedStateExample: FC<ZustandExampleProps> = ({ label }: ZustandExampleProps): ReactElement => {
  const name: string = useUserStore((state: ZustandUserStore): string => state.name);
  const setName: (name: string) => void = useUserStore(
    (state: ZustandUserStore): ((name: string) => void) => state.setName,
  );

  return (
    <article>
      <h3>{label}</h3>
      <p>Shared name: {name}</p>
      <button
        type="button"
        onClick={() => {
          setName("Jane Doe");
        }}
      >
        Set Jane Doe
      </button>
      <button
        type="button"
        onClick={() => {
          setName("John Doe");
        }}
      >
        Set John Doe
      </button>
    </article>
  );
};

export const ZustandSelectorExample: FC<ZustandExampleProps> = ({ label }: ZustandExampleProps): ReactElement => {
  const theme: ZustandThemeStore["theme"] = useThemeStore(
    (state: ZustandThemeStore): ZustandThemeStore["theme"] => state.theme,
  );

  return (
    <article>
      <h3>{label}</h3>
      <p>Theme: {theme}</p>
    </article>
  );
};

export const ZustandActionSelectorExample: FC<ZustandExampleProps> = ({ label }: ZustandExampleProps): ReactElement => {
  const toggleTheme: () => void = useThemeStore((state: ZustandThemeStore): (() => void) => state.toggleTheme);

  return (
    <article>
      <h3>{label}</h3>
      <button type="button" onClick={toggleTheme}>
        Toggle theme
      </button>
    </article>
  );
};

export const ZustandExternalStoreExample: FC<ZustandExampleProps> = ({ label }: ZustandExampleProps): ReactElement => {
  const currentCount: number = useCounterStore.getState().count;

  return (
    <article>
      <h3>{label}</h3>
      <p>Current store value: {currentCount}</p>
      <p>Zustand stores also expose imperative APIs such as getState outside React components.</p>
    </article>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const ZustandDemo: FC = (): ReactElement => {
  return (
    <section>
      <h2>1. Reading State from a Zustand Store</h2>
      <ZustandStoreHookExample label="Store Hook" />

      <h2>2. Updating State with Store Actions</h2>
      <ZustandActionsExample label="Store Actions" />

      <h2>3. Sharing State Across Components</h2>
      <ZustandSharedStateExample label="Shared Store State" />

      <h2>4. Selecting a Specific Piece of State</h2>
      <ZustandSelectorExample label="State Selector" />

      <h2>5. Selecting a Store Action</h2>
      <ZustandActionSelectorExample label="Action Selector" />

      <h2>6. Accessing the Store Outside React Rendering</h2>
      <ZustandExternalStoreExample label="Imperative Store Access" />
    </section>
  );
};

export default ZustandDemo;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// Zustand creates a store that is consumed directly through a generated React hook.
// A Zustand store can contain both state values and functions that update those values.
// Components subscribe by passing selectors to the generated store hook.
// Zustand does not require a React Context Provider for its basic store pattern.
// Selecting a specific value avoids subscribing the component to unrelated store fields.
// Store actions can be selected independently from the state they modify.
// Zustand also exposes imperative APIs such as getState for non-rendering access to store state.
