/**
 * Strict Mode
 * ===========
 *
 * React Strict Mode is a development-only mechanism that enables additional
 * checks and intentionally re-runs certain operations to expose bugs caused by
 * impure rendering, missing effect cleanup, or other unsafe assumptions.
 * Strict Mode does not change the production behavior of the application.
 *
 * In development, Strict Mode can render components more than once and can
 * perform an extra setup-and-cleanup cycle for effects. The additional work
 * helps reveal code that assumes rendering happens exactly once or that an
 * effect's setup function runs without requiring cleanup.
 *
 * Strict Mode does not mean that React permanently mounts two copies of every
 * component. Its development checks simulate lifecycle situations that should
 * be handled correctly by components. Render-phase logic must therefore remain
 * pure, and effects must correctly undo the external resources they create.
 *
 * A common misconception is that Strict Mode itself causes production
 * performance behavior or production double rendering. The extra development
 * checks are intentionally development-only. Another misconception is that
 * every function is arbitrarily called twice; the checks target specific
 * React operations and lifecycle behavior.
 */

import { type ChangeEvent, type FC, type ReactElement, StrictMode, useEffect, useState } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface StrictRenderProps {
  readonly initialCount: number;
}

export interface StrictEffectProps {
  readonly initialMessage: string;
}

export interface CleanupEffectProps {
  readonly initialActive: boolean;
}

export interface PureCalculationProps {
  readonly value: number;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

export const StrictRenderExample: FC<StrictRenderProps> = ({ initialCount }): ReactElement => {
  const [count, setCount] = useState<number>(initialCount);

  const increment = (): void => {
    setCount((previousCount: number): number => previousCount + 1);
  };

  return (
    <section>
      <p>Count: {count}</p>

      <button type="button" onClick={increment}>
        Increment
      </button>
    </section>
  );
};

export const StrictEffectExample: FC<StrictEffectProps> = ({ initialMessage }): ReactElement => {
  const [message, setMessage] = useState<string>(initialMessage);

  useEffect((): void => {
    document.title = message;
  }, [message]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setMessage(event.target.value);
  };

  return (
    <section>
      <label htmlFor="strict-mode-message">Document title</label>

      <input id="strict-mode-message" value={message} onChange={handleChange} />
    </section>
  );
};

export const CleanupEffectExample: FC<CleanupEffectProps> = ({ initialActive }): ReactElement => {
  const [isActive, setIsActive] = useState<boolean>(initialActive);

  const [status, setStatus] = useState<string>("Inactive");

  useEffect((): (() => void) | undefined => {
    if (!isActive) {
      setStatus("Inactive");
      return undefined;
    }

    setStatus("Active");

    const timerId: number = window.setTimeout((): void => {
      setStatus("Active and synchronized");
    }, 1000);

    return (): void => {
      window.clearTimeout(timerId);
    };
  }, [isActive]);

  const toggleActive = (): void => {
    setIsActive((previousActive: boolean): boolean => !previousActive);
  };

  return (
    <section>
      <p>Status: {status}</p>

      <button type="button" onClick={toggleActive}>
        Toggle effect
      </button>
    </section>
  );
};

export const PureCalculationExample: FC<PureCalculationProps> = ({ value }): ReactElement => {
  const doubledValue: number = value * 2;

  return <p>Doubled value: {doubledValue}</p>;
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const StrictModeExamples: FC = (): ReactElement => {
  return (
    <StrictMode>
      <main>
        <h2>1. Keeping render logic safe for repeated development renders</h2>
        <StrictRenderExample initialCount={0} />

        <h2>2. Observing effect setup under Strict Mode</h2>
        <StrictEffectExample initialMessage="John Doe" />

        <h2>3. Cleaning up resources created by an effect</h2>
        <CleanupEffectExample initialActive={false} />

        <h2>4. Keeping render calculations pure</h2>
        <PureCalculationExample value={21} />
      </main>
    </StrictMode>
  );
};

export default StrictModeExamples;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - `StrictMode` enables additional development-only checks.
// - Strict Mode can intentionally re-run rendering-related operations to expose
//   code that is not safe to execute more than once.
// - Effects can receive an additional setup-and-cleanup cycle in development.
// - Effect cleanup must completely undo resources created by the effect setup.
// - Strict Mode does not represent production double rendering behavior.
// - Render logic should remain pure regardless of whether Strict Mode is
//   enabled.
// - Effects should tolerate setup followed immediately by cleanup and setup.
// - Timers, subscriptions, listeners, and other external resources require
//   cleanup so repeated development lifecycle checks remain safe.
