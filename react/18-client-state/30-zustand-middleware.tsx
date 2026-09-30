/**
 * Zustand Middleware
 * ===================
 *
 * Zustand middleware extends a store by wrapping its state initializer with additional behavior.
 * Middleware can add capabilities such as persistence, Redux DevTools integration, or
 * subscription-based updates without placing that infrastructure directly inside components.
 *
 * Zustand provides middleware functions such as persist, devtools, and subscribeWithSelector.
 * Middleware is applied when the store is created, so the resulting store keeps the same hook
 * interface while gaining the behavior supplied by the middleware.
 *
 * Middleware can also be composed. The order of middleware matters because each middleware wraps
 * the initializer and can observe or modify the behavior provided by the middleware around it.
 */

import { create } from "zustand";
import { devtools, persist, subscribeWithSelector } from "zustand/middleware";
import type { FC, ReactElement } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface MiddlewareCounterStore {
  readonly count: number;
  readonly increment: () => void;
  readonly reset: () => void;
}

export interface PersistedSettingsStore {
  readonly theme: "light" | "dark";
  readonly language: string;
  readonly toggleTheme: () => void;
  readonly setLanguage: (language: string) => void;
}

export interface SubscribableStore {
  readonly count: number;
  readonly increment: () => void;
  readonly reset: () => void;
}

export interface ComposedMiddlewareStore {
  readonly count: number;
  readonly increment: () => void;
  readonly reset: () => void;
}

export interface ZustandMiddlewareExampleProps {
  readonly title: string;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

export const useDevtoolsStore = create<MiddlewareCounterStore>()(
  devtools(
    (set): MiddlewareCounterStore => ({
      count: 0,
      increment: (): void => {
        set(
          (state): Pick<MiddlewareCounterStore, "count"> => ({
            count: state.count + 1,
          }),
          false,
          "counter/increment",
        );
      },
      reset: (): void => {
        set(
          {
            count: 0,
          },
          false,
          "counter/reset",
        );
      },
    }),
    {
      name: "MiddlewareCounterStore",
    },
  ),
);

export const ZustandDevtoolsMiddlewareExample: FC<ZustandMiddlewareExampleProps> = ({
  title,
}: ZustandMiddlewareExampleProps): ReactElement => {
  const count: number = useDevtoolsStore((state: MiddlewareCounterStore): number => state.count);
  const increment: () => void = useDevtoolsStore((state: MiddlewareCounterStore): (() => void) => state.increment);
  const reset: () => void = useDevtoolsStore((state: MiddlewareCounterStore): (() => void) => state.reset);

  return (
    <article>
      <h3>{title}</h3>
      <p>Count: {count}</p>
      <button type="button" onClick={increment}>
        Increment
      </button>
      <button type="button" onClick={reset}>
        Reset
      </button>
      <p>The devtools middleware gives compatible Redux DevTools tooling access to store updates and named actions.</p>
    </article>
  );
};

export const usePersistedSettingsStore = create<PersistedSettingsStore>()(
  persist(
    (set): PersistedSettingsStore => ({
      theme: "light",
      language: "en",
      toggleTheme: (): void => {
        set((state): Pick<PersistedSettingsStore, "theme"> => ({
          theme: state.theme === "light" ? "dark" : "light",
        }));
      },
      setLanguage: (language: string): void => {
        set({
          language,
        });
      },
    }),
    {
      name: "example-settings",
    },
  ),
);

export const ZustandPersistMiddlewareExample: FC<ZustandMiddlewareExampleProps> = ({
  title,
}: ZustandMiddlewareExampleProps): ReactElement => {
  const theme: PersistedSettingsStore["theme"] = usePersistedSettingsStore(
    (state: PersistedSettingsStore): PersistedSettingsStore["theme"] => state.theme,
  );
  const language: string = usePersistedSettingsStore((state: PersistedSettingsStore): string => state.language);
  const toggleTheme: () => void = usePersistedSettingsStore(
    (state: PersistedSettingsStore): (() => void) => state.toggleTheme,
  );
  const setLanguage: (language: string) => void = usePersistedSettingsStore(
    (state: PersistedSettingsStore): ((language: string) => void) => state.setLanguage,
  );

  return (
    <article>
      <h3>{title}</h3>
      <p>Theme: {theme}</p>
      <p>Language: {language}</p>
      <button type="button" onClick={toggleTheme}>
        Toggle theme
      </button>
      <button
        type="button"
        onClick={() => {
          setLanguage("de");
        }}
      >
        Set German
      </button>
      <p>The persist middleware stores selected store state and restores it when the store initializes again.</p>
    </article>
  );
};

export const useSubscriptionStore = create<SubscribableStore>()(
  subscribeWithSelector((set): SubscribableStore => ({
    count: 0,
    increment: (): void => {
      set((state): Pick<SubscribableStore, "count"> => ({
        count: state.count + 1,
      }));
    },
    reset: (): void => {
      set({
        count: 0,
      });
    },
  })),
);

export const ZustandSubscribeWithSelectorExample: FC<ZustandMiddlewareExampleProps> = ({
  title,
}: ZustandMiddlewareExampleProps): ReactElement => {
  const count: number = useSubscriptionStore((state: SubscribableStore): number => state.count);
  const increment: () => void = useSubscriptionStore((state: SubscribableStore): (() => void) => state.increment);

  return (
    <article>
      <h3>{title}</h3>
      <p>Count: {count}</p>
      <button type="button" onClick={increment}>
        Increment
      </button>
      <p>
        subscribeWithSelector allows external subscriptions to react to changes in a selected portion of store state.
      </p>
    </article>
  );
};

export const useComposedMiddlewareStore = create<ComposedMiddlewareStore>()(
  devtools(
    persist(
      (set): ComposedMiddlewareStore => ({
        count: 0,
        increment: (): void => {
          set(
            (state): Pick<ComposedMiddlewareStore, "count"> => ({
              count: state.count + 1,
            }),
            false,
            "composed/increment",
          );
        },
        reset: (): void => {
          set(
            {
              count: 0,
            },
            false,
            "composed/reset",
          );
        },
      }),
      {
        name: "example-composed-store",
      },
    ),
    {
      name: "ComposedMiddlewareStore",
    },
  ),
);

export const ZustandComposedMiddlewareExample: FC<ZustandMiddlewareExampleProps> = ({
  title,
}: ZustandMiddlewareExampleProps): ReactElement => {
  const count: number = useComposedMiddlewareStore((state: ComposedMiddlewareStore): number => state.count);
  const increment: () => void = useComposedMiddlewareStore(
    (state: ComposedMiddlewareStore): (() => void) => state.increment,
  );
  const reset: () => void = useComposedMiddlewareStore((state: ComposedMiddlewareStore): (() => void) => state.reset);

  return (
    <article>
      <h3>{title}</h3>
      <p>Count: {count}</p>
      <button type="button" onClick={increment}>
        Increment
      </button>
      <button type="button" onClick={reset}>
        Reset
      </button>
      <p>This store combines persistence and Redux DevTools integration through middleware composition.</p>
    </article>
  );
};

export const ZustandMiddlewareBoundaryExample: FC<ZustandMiddlewareExampleProps> = ({
  title,
}: ZustandMiddlewareExampleProps): ReactElement => {
  const count: number = useDevtoolsStore((state: MiddlewareCounterStore): number => state.count);

  return (
    <article>
      <h3>{title}</h3>
      <p>Count: {count}</p>
      <p>
        Middleware changes the store's behavior at store creation time; components still consume the resulting store
        through the normal Zustand hook API.
      </p>
    </article>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const ZustandMiddlewareDemo: FC = (): ReactElement => {
  return (
    <section>
      <h2>1. Adding Redux DevTools Integration</h2>
      <ZustandDevtoolsMiddlewareExample title="DevTools Middleware" />

      <h2>2. Persisting Store State</h2>
      <ZustandPersistMiddlewareExample title="Persist Middleware" />

      <h2>3. Subscribing to Selected Store State</h2>
      <ZustandSubscribeWithSelectorExample title="Subscription Middleware" />

      <h2>4. Composing Multiple Middleware Functions</h2>
      <ZustandComposedMiddlewareExample title="Composed Middleware" />

      <h2>5. Consuming a Middleware-Enhanced Store</h2>
      <ZustandMiddlewareBoundaryExample title="Middleware Boundary" />
    </section>
  );
};

export default ZustandMiddlewareDemo;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// Zustand middleware wraps a store initializer to add behavior to the resulting store.
// devtools integrates Zustand store updates with Redux DevTools.
// persist stores selected state and restores it when the store initializes.
// subscribeWithSelector enables subscriptions to selected portions of store state.
// Middleware can be composed to provide multiple capabilities to the same store.
// Middleware is configured when the store is created rather than inside individual components.
// Components continue consuming a middleware-enhanced store through the normal Zustand hook API.
