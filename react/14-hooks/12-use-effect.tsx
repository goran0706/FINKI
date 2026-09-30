/**
 * useEffect
 * =========
 *
 * `useEffect` synchronizes a component with an external system after React
 * commits the component to the DOM. External systems include browser APIs,
 * timers, subscriptions, network connections, and third-party libraries.
 *
 * An Effect receives a setup function and an optional dependency array. After
 * a commit, React runs the setup function when the Effect is eligible to run.
 * If the setup function returns a cleanup function, React runs that cleanup
 * before the Effect is re-run with changed dependencies and when the component
 * is removed.
 *
 * With no dependency array, the Effect runs after every completed render. With
 * an empty dependency array, it runs after the initial mount and its cleanup
 * runs when the component unmounts. With dependencies, React compares each
 * dependency with its previous value using `Object.is` and re-runs the Effect
 * when at least one dependency changes.
 *
 * Effects run after rendering and should not be used to calculate values that
 * can be derived directly during rendering. Derived data should normally be
 * calculated during render, while Effects should be reserved for
 * synchronization with systems outside React.
 *
 * In development Strict Mode, React may perform an additional setup and
 * cleanup cycle to expose missing cleanup logic. Correct cleanup should make
 * repeated setup and cleanup safe.
 */

import { type ChangeEvent, type FC, type ReactNode, useEffect, useState } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface DocumentTitleEffectProps {
  readonly title: string;
}

export interface TimerEffectProps {
  readonly durationMilliseconds: number;
}

export interface SubscriptionEffectProps {
  readonly topic: string;
}

export interface DependencyEffectProps {
  readonly initialValue: string;
}

export interface CleanupEffectProps {
  readonly label: string;
}

export interface DerivedValueEffectProps {
  readonly firstName: string;
  readonly lastName: string;
}

export interface ExternalSystemEffectProps {
  readonly initialValue: string;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * Demonstrates synchronizing the browser document title with component state.
 * The Effect runs after React commits the component and updates an external
 * browser API.
 */
export const DocumentTitleEffectExample: FC<DocumentTitleEffectProps> = ({
  title,
}: DocumentTitleEffectProps): ReactNode => {
  useEffect((): void => {
    document.title = title;
  }, [title]);

  return (
    <section>
      <h3>Synchronizing the document title</h3>
      <p>Document title: {title}</p>
    </section>
  );
};

/**
 * Demonstrates an Effect that creates and cleans up a browser timer. The timer
 * handle is kept in the cleanup closure so the correct timer is cleared when
 * the Effect is replaced or the component unmounts.
 */
export const TimerEffectExample: FC<TimerEffectProps> = ({ durationMilliseconds }: TimerEffectProps): ReactNode => {
  const [message, setMessage] = useState<string>("Waiting");

  useEffect((): (() => void) => {
    const timerId: number = window.setTimeout((): void => {
      setMessage("Timer completed");
    }, durationMilliseconds);

    return (): void => {
      window.clearTimeout(timerId);
    };
  }, [durationMilliseconds]);

  return (
    <section>
      <h3>Effect cleanup for a timer</h3>
      <p>{message}</p>
    </section>
  );
};

/**
 * Demonstrates subscription-style setup and cleanup. The example uses a
 * browser event target as an external system and removes exactly the listener
 * that was registered by the Effect.
 */
export const SubscriptionEffectExample: FC<SubscriptionEffectProps> = ({
  topic,
}: SubscriptionEffectProps): ReactNode => {
  const [eventCount, setEventCount] = useState<number>(0);

  useEffect((): (() => void) => {
    const handleEvent = (): void => {
      setEventCount((previousCount: number): number => previousCount + 1);
    };

    window.addEventListener("online", handleEvent);

    return (): void => {
      window.removeEventListener("online", handleEvent);
    };
  }, [topic]);

  return (
    <section>
      <h3>Subscribing and unsubscribing</h3>
      <p>Topic: {topic}</p>
      <p>Observed online events: {eventCount}</p>
    </section>
  );
};

/**
 * Demonstrates a dependency array. The Effect runs again only when the value
 * supplied in the dependency list changes according to `Object.is`.
 */
export const DependencyEffectExample: FC<DependencyEffectProps> = ({
  initialValue,
}: DependencyEffectProps): ReactNode => {
  const [value, setValue] = useState<string>(initialValue);
  const [effectRuns, setEffectRuns] = useState<number>(0);

  useEffect((): void => {
    setEffectRuns((previousRuns: number): number => previousRuns + 1);
  }, [value]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setValue(event.target.value);
  };

  return (
    <section>
      <h3>Effect dependencies</h3>

      <label>
        Value
        <input value={value} onChange={handleChange} />
      </label>

      <p>Effect runs: {effectRuns}</p>
    </section>
  );
};

/**
 * Demonstrates cleanup when an Effect is replaced. Each changed label creates
 * a new listener and the previous listener is removed before the new setup is
 * established.
 */
export const CleanupEffectExample: FC<CleanupEffectProps> = ({ label }: CleanupEffectProps): ReactNode => {
  const [events, setEvents] = useState<number>(0);

  useEffect((): (() => void) => {
    const handleClick = (): void => {
      setEvents((previousEvents: number): number => previousEvents + 1);
    };

    window.addEventListener("click", handleClick);

    return (): void => {
      window.removeEventListener("click", handleClick);
    };
  }, [label]);

  return (
    <section>
      <h3>Cleanup before Effect replacement</h3>
      <p>Active label: {label}</p>
      <p>Observed clicks: {events}</p>
    </section>
  );
};

/**
 * Demonstrates a common misconception by showing derived data that does not
 * require an Effect. The full name can be calculated directly during render
 * because it is completely determined by the component's inputs.
 */
export const DerivedValueEffectExample: FC<DerivedValueEffectProps> = ({
  firstName,
  lastName,
}: DerivedValueEffectProps): ReactNode => {
  const fullName: string = `${firstName} ${lastName}`;

  return (
    <section>
      <h3>Derived values do not need Effects</h3>
      <p>Full name: {fullName}</p>
    </section>
  );
};

/**
 * Demonstrates the difference between synchronizing with an external system
 * and performing ordinary React state calculations. The Effect represents an
 * external browser operation, while the displayed uppercase value is derived
 * directly during rendering.
 */
export const ExternalSystemEffectExample: FC<ExternalSystemEffectProps> = ({
  initialValue,
}: ExternalSystemEffectProps): ReactNode => {
  const [value, setValue] = useState<string>(initialValue);

  useEffect((): void => {
    document.body.dataset.exampleValue = value;
  }, [value]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setValue(event.target.value);
  };

  const uppercaseValue: string = value.toUpperCase();

  return (
    <section>
      <h3>Separating synchronization from derivation</h3>

      <label>
        Value
        <input value={value} onChange={handleChange} />
      </label>

      <p>Derived uppercase value: {uppercaseValue}</p>
    </section>
  );
};

/**
 * Demonstrates the no-dependency-array form of useEffect. This Effect runs
 * after every completed render and therefore should be used only when that
 * behavior is intentional.
 */
export const EveryRenderEffectExample: FC = (): ReactNode => {
  const [count, setCount] = useState<number>(0);
  const [effectRuns, setEffectRuns] = useState<number>(0);

  useEffect((): void => {
    setEffectRuns((previousRuns: number): number => previousRuns + 1);
  });

  const increment = (): void => {
    setCount((previousCount: number): number => previousCount + 1);
  };

  return (
    <section>
      <h3>Effect without a dependency array</h3>
      <p>Count: {count}</p>
      <p>Effect runs: {effectRuns}</p>

      <button type="button" onClick={increment}>
        Render again
      </button>
    </section>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const UseEffectContainer: FC = (): ReactNode => {
  return (
    <main>
      <h1>useEffect</h1>

      <h2>1. Synchronizing with the document title</h2>
      <DocumentTitleEffectExample title="React useEffect example" />

      <h2>2. Creating and cleaning up a timer</h2>
      <TimerEffectExample durationMilliseconds={1000} />

      <h2>3. Subscribing to an external event source</h2>
      <SubscriptionEffectExample topic="browser-status" />

      <h2>4. Controlling when an Effect re-runs</h2>
      <DependencyEffectExample initialValue="Initial value" />

      <h2>5. Cleaning up before Effect replacement</h2>
      <CleanupEffectExample label="Example subscription" />

      <h2>6. Calculating derived values without an Effect</h2>
      <DerivedValueEffectExample firstName="John" lastName="Doe" />

      <h2>7. Synchronizing external systems while deriving UI data directly</h2>
      <ExternalSystemEffectExample initialValue="example.com" />

      <h2>8. Running an Effect after every render</h2>
      <EveryRenderEffectExample />
    </main>
  );
};

export default UseEffectContainer;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - `useEffect` synchronizes React with systems outside React.
// - Effects run after React commits the component.
// - A cleanup function runs before an Effect is replaced and when the component unmounts.
// - An empty dependency array describes an Effect that does not depend on changing reactive values.
// - A dependency array controls re-synchronization based on `Object.is` comparisons.
// - Omitting the dependency array causes the Effect to run after every completed render.
// - Effects should not replace ordinary calculations that can be performed during rendering.
// - Correct cleanup is important for timers, subscriptions, listeners, and other external resources.
// - Development Strict Mode can perform an additional setup and cleanup cycle to expose missing cleanup logic.
