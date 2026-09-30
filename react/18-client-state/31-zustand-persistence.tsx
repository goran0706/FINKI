/**
 * Zustand Persistence
 * ====================
 *
 * Zustand's persist middleware stores selected Zustand state in a storage backend and restores
 * that state when the store initializes again. By default, persist uses localStorage through
 * JSON serialization, but the storage mechanism and persisted state can be configured.
 *
 * The persist middleware stores state rather than component instances or React state. Actions
 * remain defined by the store and are recreated from the store initializer rather than being
 * serialized as part of the persisted state.
 *
 * Persistence can be customized with options such as name, storage, partialize, version, and
 * migrate. partialize controls which state is persisted, while version and migrate provide a
 * mechanism for evolving persisted data when the store shape changes.
 */

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { FC, ReactElement } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface PersistentCounterStore {
  readonly count: number;
  readonly increment: () => void;
  readonly reset: () => void;
}

export interface PersistentPreferencesStore {
  readonly theme: "light" | "dark";
  readonly language: string;
  readonly fontSize: number;
  readonly setTheme: (theme: "light" | "dark") => void;
  readonly setLanguage: (language: string) => void;
  readonly setFontSize: (fontSize: number) => void;
}

export interface PersistedProfileStore {
  readonly name: string;
  readonly email: string;
  readonly sessionToken: string;
  readonly setProfile: (name: string, email: string) => void;
  readonly setSessionToken: (token: string) => void;
}

export interface VersionedSettings {
  readonly theme: "light" | "dark";
  readonly language: string;
}

export interface ZustandPersistenceExampleProps {
  readonly title: string;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

export const usePersistentCounterStore = create<PersistentCounterStore>()(
  persist(
    (set): PersistentCounterStore => ({
      count: 0,
      increment: (): void => {
        set((state): Pick<PersistentCounterStore, "count"> => ({
          count: state.count + 1,
        }));
      },
      reset: (): void => {
        set({
          count: 0,
        });
      },
    }),
    {
      name: "example-counter",
    },
  ),
);

export const ZustandBasicPersistenceExample: FC<ZustandPersistenceExampleProps> = ({
  title,
}: ZustandPersistenceExampleProps): ReactElement => {
  const count: number = usePersistentCounterStore((state: PersistentCounterStore): number => state.count);
  const increment: () => void = usePersistentCounterStore(
    (state: PersistentCounterStore): (() => void) => state.increment,
  );
  const reset: () => void = usePersistentCounterStore((state: PersistentCounterStore): (() => void) => state.reset);

  return (
    <article>
      <h3>{title}</h3>
      <p>Persisted count: {count}</p>
      <button type="button" onClick={increment}>
        Increment
      </button>
      <button type="button" onClick={reset}>
        Reset
      </button>
      <p>The count is restored from storage when the Zustand store initializes again.</p>
    </article>
  );
};

export const usePersistentPreferencesStore = create<PersistentPreferencesStore>()(
  persist(
    (set): PersistentPreferencesStore => ({
      theme: "light",
      language: "en",
      fontSize: 16,
      setTheme: (theme: "light" | "dark"): void => {
        set({
          theme,
        });
      },
      setLanguage: (language: string): void => {
        set({
          language,
        });
      },
      setFontSize: (fontSize: number): void => {
        set({
          fontSize,
        });
      },
    }),
    {
      name: "example-preferences",
      storage: createJSONStorage((): Storage => localStorage),
    },
  ),
);

export const ZustandCustomStorageExample: FC<ZustandPersistenceExampleProps> = ({
  title,
}: ZustandPersistenceExampleProps): ReactElement => {
  const theme: PersistentPreferencesStore["theme"] = usePersistentPreferencesStore(
    (state: PersistentPreferencesStore): PersistentPreferencesStore["theme"] => state.theme,
  );
  const language: string = usePersistentPreferencesStore((state: PersistentPreferencesStore): string => state.language);
  const fontSize: number = usePersistentPreferencesStore((state: PersistentPreferencesStore): number => state.fontSize);
  const setTheme: (theme: "light" | "dark") => void = usePersistentPreferencesStore(
    (state: PersistentPreferencesStore): ((theme: "light" | "dark") => void) => state.setTheme,
  );

  return (
    <article>
      <h3>{title}</h3>
      <p>
        Theme: {theme} | Language: {language} | Font size: {fontSize}px
      </p>
      <button
        type="button"
        onClick={() => {
          setTheme(theme === "light" ? "dark" : "light");
        }}
      >
        Toggle theme
      </button>
      <p>createJSONStorage can explicitly provide a JSON-compatible storage backend such as localStorage.</p>
    </article>
  );
};

export const usePartialPersistenceStore = create<PersistedProfileStore>()(
  persist(
    (set): PersistedProfileStore => ({
      name: "John Doe",
      email: "john.doe@example.com",
      sessionToken: "temporary-token",
      setProfile: (name: string, email: string): void => {
        set({
          name,
          email,
        });
      },
      setSessionToken: (token: string): void => {
        set({
          sessionToken: token,
        });
      },
    }),
    {
      name: "example-profile",
      partialize: (state: PersistedProfileStore): Pick<PersistedProfileStore, "name" | "email"> => ({
        name: state.name,
        email: state.email,
      }),
    },
  ),
);

export const ZustandPartialPersistenceExample: FC<ZustandPersistenceExampleProps> = ({
  title,
}: ZustandPersistenceExampleProps): ReactElement => {
  const name: string = usePartialPersistenceStore((state: PersistedProfileStore): string => state.name);
  const email: string = usePartialPersistenceStore((state: PersistedProfileStore): string => state.email);
  const sessionToken: string = usePartialPersistenceStore((state: PersistedProfileStore): string => state.sessionToken);
  const setSessionToken: (token: string) => void = usePartialPersistenceStore(
    (state: PersistedProfileStore): ((token: string) => void) => state.setSessionToken,
  );

  return (
    <article>
      <h3>{title}</h3>
      <p>Name: {name}</p>
      <p>Email: {email}</p>
      <p>Current token: {sessionToken}</p>
      <button
        type="button"
        onClick={() => {
          setSessionToken("temporary-token-updated");
        }}
      >
        Update token
      </button>
      <p>partialize persists name and email while excluding the session token from the persisted state.</p>
    </article>
  );
};

export const useVersionedSettingsStore = create<VersionedSettings>()(
  persist(
    (set): VersionedSettings => ({
      theme: "light",
      language: "en",
    }),
    {
      name: "example-versioned-settings",
      version: 2,
      migrate: (persistedState: unknown, version: number): VersionedSettings => {
        if (
          version === 1 &&
          typeof persistedState === "object" &&
          persistedState !== null &&
          "theme" in persistedState
        ) {
          const state: {
            readonly theme: unknown;
          } = persistedState;

          return {
            theme: state.theme === "dark" ? "dark" : "light",
            language: "en",
          };
        }

        if (
          typeof persistedState === "object" &&
          persistedState !== null &&
          "theme" in persistedState &&
          "language" in persistedState
        ) {
          const state: {
            readonly theme: unknown;
            readonly language: unknown;
          } = persistedState;

          return {
            theme: state.theme === "dark" ? "dark" : "light",
            language: typeof state.language === "string" ? state.language : "en",
          };
        }

        return {
          theme: "light",
          language: "en",
        };
      },
    },
  ),
);

export const ZustandVersionedPersistenceExample: FC<ZustandPersistenceExampleProps> = ({
  title,
}: ZustandPersistenceExampleProps): ReactElement => {
  const theme: VersionedSettings["theme"] = useVersionedSettingsStore(
    (state: VersionedSettings): VersionedSettings["theme"] => state.theme,
  );
  const language: string = useVersionedSettingsStore((state: VersionedSettings): string => state.language);

  return (
    <article>
      <h3>{title}</h3>
      <p>
        Theme: {theme} | Language: {language}
      </p>
      <p>A persisted store can migrate older serialized state when its version changes.</p>
    </article>
  );
};

export const ZustandPersistenceApiExample: FC<ZustandPersistenceExampleProps> = ({
  title,
}: ZustandPersistenceExampleProps): ReactElement => {
  const count: number = usePersistentCounterStore((state: PersistentCounterStore): number => state.count);

  const clearPersistedState = (): void => {
    usePersistentCounterStore.persist.clearStorage();
  };

  const removePersistedState = (): void => {
    usePersistentCounterStore.persist.setOptions({
      name: "example-counter",
    });
    usePersistentCounterStore.persist.clearStorage();
  };

  return (
    <article>
      <h3>{title}</h3>
      <p>Current count: {count}</p>
      <button type="button" onClick={clearPersistedState}>
        Clear persisted storage
      </button>
      <button type="button" onClick={removePersistedState}>
        Clear with configured storage name
      </button>
      <p>The persist middleware exposes additional persistence controls through the store's persist API.</p>
    </article>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const ZustandPersistenceDemo: FC = (): ReactElement => {
  return (
    <section>
      <h2>1. Persisting Zustand State</h2>
      <ZustandBasicPersistenceExample title="Basic Persistence" />

      <h2>2. Configuring JSON Storage</h2>
      <ZustandCustomStorageExample title="JSON Storage" />

      <h2>3. Persisting Only Selected State</h2>
      <ZustandPartialPersistenceExample title="Partial Persistence" />

      <h2>4. Migrating Versioned Persisted State</h2>
      <ZustandVersionedPersistenceExample title="Versioned Persistence" />

      <h2>5. Controlling Persisted Storage</h2>
      <ZustandPersistenceApiExample title="Persistence API" />
    </section>
  );
};

export default ZustandPersistenceDemo;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// The persist middleware serializes selected Zustand state into a storage backend.
// The persisted state is restored when the store initializes again.
// The storage key is configured with the name option.
// createJSONStorage can explicitly configure JSON-based storage such as localStorage.
// partialize controls which state values are included in persistence.
// Actions are not persisted as executable functions; they are recreated by the store initializer.
// version identifies the persisted state schema version.
// migrate can transform persisted data when the stored schema is older than the current version.
// The persist API provides additional controls for managing persisted storage.
