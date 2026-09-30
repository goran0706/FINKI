/**
 * useRef vs useState
 * ==================
 *
 * `useRef` and `useState` both preserve values between renders, but they serve
 * different purposes in React's rendering model. State is reactive: updating
 * state schedules a render and React uses the new value to calculate the next
 * UI. A ref is mutable storage: changing `ref.current` does not schedule a
 * render.
 *
 * State should represent data that affects what the component renders. A ref
 * should represent mutable information that must persist between renders but
 * does not itself belong to React's rendered output.
 *
 * `useState` updates are scheduled by React and should normally use functional
 * updates when the next state depends on the previous state. A ref update is
 * an ordinary JavaScript mutation of the existing ref object.
 *
 * A ref is useful for values such as timer identifiers, DOM nodes, previous
 * values, or mutable handles. State is appropriate for values such as text,
 * selected options, visibility, counters, and other data that must be
 * reflected in the UI.
 *
 * A common misconception is that a ref is simply a faster form of state.
 * It is not. Choosing a ref instead of state for rendered data can leave the
 * displayed UI stale because React does not re-render when `.current` changes.
 */

import { type FC, type ReactNode, useEffect, useRef, useState } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface StateRenderingProps {
  readonly initialCount: number;
}

export interface RefRenderingProps {
  readonly initialCount: number;
}

export interface StateVsRefProps {
  readonly initialValue: string;
}

export interface TimerStorageProps {
  readonly durationMilliseconds: number;
}

export interface PreviousValueComparisonProps {
  readonly initialValue: string;
}

export interface FormInputComparisonProps {
  readonly initialValue: string;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * Demonstrates state for a value that belongs in the rendered UI. Updating
 * the state schedules a render, so the displayed count changes immediately
 * after React processes the update.
 */
export const StateRenderingExample: FC<StateRenderingProps> = ({ initialCount }: StateRenderingProps): ReactNode => {
  const [count, setCount] = useState<number>(initialCount);

  const increment = (): void => {
    setCount((previousCount: number): number => previousCount + 1);
  };

  return (
    <section>
      <h3>State drives rendering</h3>
      <p>Count: {count}</p>
      <button type="button" onClick={increment}>
        Increment state
      </button>
    </section>
  );
};

/**
 * Demonstrates that changing a ref does not schedule a render. A separate
 * state update is provided so the component can render again and reveal the
 * ref's current value.
 */
export const RefRenderingExample: FC<RefRenderingProps> = ({ initialCount }: RefRenderingProps): ReactNode => {
  const countRef = useRef<number>(initialCount);
  const [renderVersion, setRenderVersion] = useState<number>(0);

  const incrementRef = (): void => {
    countRef.current += 1;
  };

  const forceRender = (): void => {
    setRenderVersion((previousVersion: number): number => previousVersion + 1);
  };

  return (
    <section>
      <h3>Ref does not drive rendering</h3>
      <p>Ref value: {countRef.current}</p>
      <p>Render version: {renderVersion}</p>

      <button type="button" onClick={incrementRef}>
        Increment ref
      </button>

      <button type="button" onClick={forceRender}>
        Render again
      </button>
    </section>
  );
};

/**
 * Demonstrates the direct behavioral difference between state and a ref.
 * The state value updates the UI immediately, while the ref value changes
 * without requesting a render.
 */
export const StateVsRefExample: FC<StateVsRefProps> = ({ initialValue }: StateVsRefProps): ReactNode => {
  const [stateValue, setStateValue] = useState<string>(initialValue);
  const refValue = useRef<string>(initialValue);
  const [renderVersion, setRenderVersion] = useState<number>(0);

  const updateState = (): void => {
    setStateValue("State updated");
  };

  const updateRef = (): void => {
    refValue.current = "Ref updated";
  };

  const renderAgain = (): void => {
    setRenderVersion((previousVersion: number): number => previousVersion + 1);
  };

  return (
    <section>
      <h3>State versus ref behavior</h3>
      <p>State value: {stateValue}</p>
      <p>Ref value: {refValue.current}</p>
      <p>Render version: {renderVersion}</p>

      <button type="button" onClick={updateState}>
        Update state
      </button>

      <button type="button" onClick={updateRef}>
        Update ref
      </button>

      <button type="button" onClick={renderAgain}>
        Render again
      </button>
    </section>
  );
};

/**
 * Demonstrates an appropriate use of a ref for a timer handle. The timer ID
 * must persist between renders but does not belong in the rendered output.
 */
export const TimerStorageExample: FC<TimerStorageProps> = ({ durationMilliseconds }: TimerStorageProps): ReactNode => {
  const timerRef = useRef<number | null>(null);
  const [status, setStatus] = useState<string>("Idle");

  const startTimer = (): void => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
    }

    setStatus("Running");

    timerRef.current = window.setTimeout((): void => {
      timerRef.current = null;
      setStatus("Complete");
    }, durationMilliseconds);
  };

  const cancelTimer = (): void => {
    if (timerRef.current === null) {
      return;
    }

    window.clearTimeout(timerRef.current);
    timerRef.current = null;
    setStatus("Cancelled");
  };

  useEffect((): (() => void) => {
    return (): void => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, []);

  return (
    <section>
      <h3>Ref for non-rendered mutable data</h3>
      <p>Status: {status}</p>

      <button type="button" onClick={startTimer}>
        Start timer
      </button>

      <button type="button" onClick={cancelTimer}>
        Cancel timer
      </button>
    </section>
  );
};

/**
 * Demonstrates using state and a ref for different responsibilities in the
 * same component. State represents the current displayed value, while the ref
 * stores the previous committed value without becoming part of the update
 * mechanism.
 */
export const PreviousValueComparisonExample: FC<PreviousValueComparisonProps> = ({
  initialValue,
}: PreviousValueComparisonProps): ReactNode => {
  const [value, setValue] = useState<string>(initialValue);
  const previousValueRef = useRef<string | undefined>(undefined);

  useEffect((): void => {
    previousValueRef.current = value;
  }, [value]);

  const updateValue = (): void => {
    setValue("Updated value");
  };

  return (
    <section>
      <h3>State for current value and ref for previous value</h3>
      <p>Current value: {value}</p>
      <p>Previous value: {previousValueRef.current ?? "No previous value"}</p>

      <button type="button" onClick={updateValue}>
        Update value
      </button>
    </section>
  );
};

/**
 * Demonstrates a controlled input where state is the correct storage
 * mechanism because the input value is part of React's rendered UI.
 */
export const FormInputComparisonExample: FC<FormInputComparisonProps> = ({
  initialValue,
}: FormInputComparisonProps): ReactNode => {
  const [value, setValue] = useState<string>(initialValue);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setValue(event.target.value);
  };

  return (
    <section>
      <h3>State for reactive form data</h3>

      <label>
        Name
        <input value={value} onChange={handleChange} />
      </label>

      <p>Current value: {value}</p>
    </section>
  );
};

/**
 * Demonstrates the common mistake of using a ref for data that must update
 * the rendered output. The invalid pattern is displayed as text and is not
 * executed.
 */
export const RefForRenderedDataGotchaExample: FC = (): ReactNode => {
  const incorrectPattern: string = `
// Incorrect when the value must update the rendered UI.
const valueRef = useRef<string>("Initial");

const updateValue = (): void => {
  valueRef.current = "Updated";
};

// Use state for reactive rendered data.
const [value, setValue] = useState<string>("Initial");

const updateValue = (): void => {
  setValue("Updated");
};
`;

  return (
    <section>
      <h3>Gotcha: refs are not reactive state</h3>
      <pre>{incorrectPattern}</pre>
    </section>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const UseRefVsStateContainer: FC = (): ReactNode => {
  return (
    <main>
      <h1>useRef vs useState</h1>

      <h2>1. Using state when a value drives rendering</h2>
      <StateRenderingExample initialCount={0} />

      <h2>2. Using a ref for persistent non-rendered data</h2>
      <RefRenderingExample initialCount={0} />

      <h2>3. Comparing state and ref update behavior</h2>
      <StateVsRefExample initialValue="Initial value" />

      <h2>4. Storing a timer handle in a ref</h2>
      <TimerStorageExample durationMilliseconds={1000} />

      <h2>5. Combining state with a ref for different responsibilities</h2>
      <PreviousValueComparisonExample initialValue="Initial value" />

      <h2>6. Using state for controlled form data</h2>
      <FormInputComparisonExample initialValue="John Doe" />

      <h2>7. Avoiding refs for reactive rendered data</h2>
      <RefForRenderedDataGotchaExample />
    </main>
  );
};

export default UseRefVsStateContainer;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - `useState` stores reactive data and schedules renders when updated.
// - `useRef` stores mutable data that persists without scheduling renders.
// - State is appropriate when a value determines rendered output.
// - Refs are appropriate for timers, DOM nodes, previous values, and mutable handles.
// - Functional state updates are useful when the next state depends on the previous state.
// - Ref mutations directly change `.current` and do not participate in React's update scheduling.
// - State and refs can be used together when they serve different responsibilities.
// - Using a ref for reactive UI data can leave the rendered output stale.
