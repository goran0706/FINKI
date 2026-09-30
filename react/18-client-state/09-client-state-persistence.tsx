/**
 * Client State Persistence
 * =========================
 *
 * Client state persistence is the practice of storing application-owned state outside the
 * in-memory React component tree so that the state can survive events such as component
 * unmounting or a browser page reload.
 *
 * Browser storage APIs such as localStorage can persist serializable client state across page
 * loads. React state and browser storage serve different purposes: React state drives rendering,
 * while persistent storage provides a longer-lived copy that can be read when the application
 * initializes.
 *
 * Persistence requires synchronization between the in-memory state and the storage layer. Values
 * written to browser storage are strings, so structured state must be serialized before storage
 * and parsed when it is restored. Stored data can also be missing, malformed, outdated, or
 * incompatible with the current application state shape, so restoration should have a safe
 * fallback.
 */

import type { FC, ReactElement } from "react";
import { useEffect, useState } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface PersistentPreferences {
  readonly theme: "light" | "dark";
  readonly compactMode: boolean;
}

export interface PersistentStateExampleProps {
  readonly storageKey: string;
  readonly initialState: PersistentPreferences;
}

export interface StorageStatusProps {
  readonly status: "restored" | "default" | "invalid";
}

export interface PersistenceDescriptionProps {
  readonly title: string;
  readonly description: string;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

export const StorageStatus: FC<StorageStatusProps> = ({ status }): ReactElement => {
  return <p>Storage status: {status}</p>;
};

export const PersistentStateExample: FC<PersistentStateExampleProps> = ({ storageKey, initialState }): ReactElement => {
  const [preferences, setPreferences] = useState<PersistentPreferences>(initialState);
  const [storageStatus, setStorageStatus] = useState<StorageStatusProps["status"]>("default");

  useEffect((): void => {
    const storedValue: string | null = window.localStorage.getItem(storageKey);

    if (storedValue === null) {
      setStorageStatus("default");
      return;
    }

    try {
      const parsedValue: unknown = JSON.parse(storedValue);

      if (
        typeof parsedValue !== "object" ||
        parsedValue === null ||
        !("theme" in parsedValue) ||
        !("compactMode" in parsedValue) ||
        (parsedValue.theme !== "light" && parsedValue.theme !== "dark") ||
        typeof parsedValue.compactMode !== "boolean"
      ) {
        setStorageStatus("invalid");
        return;
      }

      const restoredPreferences: PersistentPreferences = {
        theme: parsedValue.theme,
        compactMode: parsedValue.compactMode,
      };

      setPreferences(restoredPreferences);
      setStorageStatus("restored");
    } catch {
      setStorageStatus("invalid");
    }
  }, [initialState, storageKey]);

  useEffect((): void => {
    window.localStorage.setItem(storageKey, JSON.stringify(preferences));
  }, [preferences, storageKey]);

  const toggleTheme = (): void => {
    setPreferences((currentPreferences: PersistentPreferences): PersistentPreferences => ({
      ...currentPreferences,
      theme: currentPreferences.theme === "light" ? "dark" : "light",
    }));
  };

  const toggleCompactMode = (): void => {
    setPreferences((currentPreferences: PersistentPreferences): PersistentPreferences => ({
      ...currentPreferences,
      compactMode: !currentPreferences.compactMode,
    }));
  };

  return (
    <div>
      <StorageStatus status={storageStatus} />
      <p>Theme: {preferences.theme}</p>
      <p>Compact mode: {preferences.compactMode ? "enabled" : "disabled"}</p>
      <button type="button" onClick={toggleTheme}>
        Toggle theme
      </button>
      <button type="button" onClick={toggleCompactMode}>
        Toggle compact mode
      </button>
    </div>
  );
};

export const PersistenceDescription: FC<PersistenceDescriptionProps> = ({ title, description }): ReactElement => {
  return (
    <article>
      <h3>{title}</h3>
      <p>{description}</p>
    </article>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const ClientStatePersistenceDemo: FC = (): ReactElement => {
  const initialPreferences: PersistentPreferences = {
    theme: "light",
    compactMode: false,
  };

  return (
    <section>
      <h2>1. Persistent Client State</h2>
      <PersistenceDescription
        title="React state and persistent storage"
        description="React state controls the current UI, while localStorage keeps a serialized copy that can be restored after a page reload."
      />

      <h2>2. Restoring State from Browser Storage</h2>
      <PersistentStateExample storageKey="example-preferences" initialState={initialPreferences} />

      <h2>3. Updating Persistent State</h2>
      <PersistenceDescription
        title="State and storage synchronization"
        description="When the in-memory preferences change, the effect serializes the current state and writes it to localStorage."
      />

      <h2>4. Invalid or Missing Stored Data</h2>
      <PersistenceDescription
        title="Stored data is not automatically trustworthy"
        description="Storage may contain no value, malformed JSON, or data with an incompatible shape. Restoration should validate the parsed value and safely handle invalid data."
      />
    </section>
  );
};

export default ClientStatePersistenceDemo;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// Client state persistence allows application-owned state to survive beyond an in-memory render.
// localStorage can keep serializable client state across browser page loads.
// React state remains responsible for driving the current rendered UI.
// Browser storage contains a separate persisted representation of that state.
// Structured values must be serialized before being stored and parsed when restored.
// Persisted data should be validated before being treated as the expected application type.
// Missing, malformed, or outdated storage data should have a safe fallback.
// Effects can synchronize in-memory state with browser storage after state changes.
// Persistence increases state lifetime but also introduces synchronization and data-version concerns.
// Not every piece of client state should be persisted, especially temporary UI state.
