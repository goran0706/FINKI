/**
 * Effect Synchronization
 * ======================
 *
 * An Effect synchronizes a React component with an external system after React
 * has committed the rendered UI. External systems include browser APIs,
 * subscriptions, timers, network connections, third-party widgets, and other
 * imperative resources that exist outside React's declarative rendering model.
 *
 * `useEffect` accepts a setup function and an optional dependency array. React
 * runs the setup after the component commits, then runs the previous cleanup
 * before re-running the setup when a dependency changes. When the component
 * unmounts, React runs the final cleanup.
 *
 * The dependency array describes the reactive values used by the Effect.
 * Values such as props, state, and variables declared in the component are
 * reactive and generally need to be represented in the dependency list when
 * they are read by the Effect. An empty dependency array means the Effect does
 * not react to changes in those values, but it does not mean the setup runs
 * before the initial render or that it runs only once in every development
 * environment.
 *
 * Effects should synchronize with external systems rather than duplicate
 * calculations that can be performed during rendering. If no external system
 * is involved, an Effect is often unnecessary. Effect setup should also be
 * written so that its cleanup correctly reverses the synchronization when the
 * component stops using the external resource.
 */

import { type ChangeEvent, type FC, type ReactElement, useEffect, useState } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface DocumentTitleSyncProps {
  readonly title: string;
}

export interface BodyClassSyncProps {
  readonly className: string;
  readonly enabled: boolean;
}

export interface LocalStorageSyncProps {
  readonly storageKey: string;
  readonly value: string;
}

export interface ExternalValueSyncProps {
  readonly initialValue: string;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

export const DocumentTitleSync: FC<DocumentTitleSyncProps> = ({ title }): ReactElement => {
  useEffect((): void => {
    document.title = title;
  }, [title]);

  return (
    <section>
      <p>Document title is synchronized with the current prop.</p>
      <p>Requested title: {title}</p>
    </section>
  );
};

export const BodyClassSync: FC<BodyClassSyncProps> = ({ className, enabled }): ReactElement => {
  useEffect((): (() => void) => {
    if (enabled) {
      document.body.classList.add(className);
    }

    return (): void => {
      document.body.classList.remove(className);
    };
  }, [className, enabled]);

  return (
    <section>
      <p>Body class synchronization is {enabled ? "enabled" : "disabled"}.</p>
    </section>
  );
};

export const LocalStorageSync: FC<LocalStorageSyncProps> = ({ storageKey, value }): ReactElement => {
  useEffect((): void => {
    window.localStorage.setItem(storageKey, value);
  }, [storageKey, value]);

  return (
    <section>
      <p>Stored value: {value}</p>
      <p>Storage key: {storageKey}</p>
    </section>
  );
};

export const ExternalValueSync: FC<ExternalValueSyncProps> = ({ initialValue }): ReactElement => {
  const [value, setValue] = useState<string>(initialValue);

  useEffect((): void => {
    document.title = `Value: ${value}`;
  }, [value]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setValue(event.target.value);
  };

  return (
    <section>
      <label htmlFor="effect-synchronization-value">Value</label>

      <input id="effect-synchronization-value" value={value} onChange={handleChange} />
    </section>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const EffectSynchronizationExamples: FC = (): ReactElement => {
  return (
    <main>
      <h2>1. Synchronizing the document title with props</h2>
      <DocumentTitleSync title="John Doe" />

      <h2>2. Synchronizing a DOM class and cleaning it up</h2>
      <BodyClassSync className="example-active" enabled={true} />

      <h2>3. Synchronizing component data with local storage</h2>
      <LocalStorageSync storageKey="example-message" value="example.com" />

      <h2>4. Synchronizing an external browser API with state</h2>
      <ExternalValueSync initialValue="John Doe" />
    </main>
  );
};

export default EffectSynchronizationExamples;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Effects synchronize React state or props with systems outside React.
// - `useEffect` setup runs after the component has committed.
// - Reactive values read by an Effect should normally be represented in its
//   dependency array.
// - Cleanup reverses an Effect's external synchronization before the Effect
//   re-runs and when the component unmounts.
// - DOM APIs and browser storage are examples of external systems that can be
//   synchronized with Effects.
// - An Effect should not be used merely to calculate values that can be
//   derived during rendering.
// - An empty dependency array does not mean an Effect runs before the initial
//   render or that its setup is guaranteed to execute only once in development.
// - Synchronization code should tolerate setup and cleanup occurring more than
//   once during development lifecycle checks.
