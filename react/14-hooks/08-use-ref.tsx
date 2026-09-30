/**
 * useRef
 * ======
 *
 * `useRef` creates a mutable ref object whose `.current` property persists
 * across renders. React returns the same ref object for the lifetime of the
 * component instance, so changing `.current` does not schedule a re-render.
 *
 * A ref can store a value that needs to survive between renders but does not
 * belong in the rendered output. Common uses include storing timer handles,
 * previous values, mutable instance-like data, and DOM references.
 *
 * When a ref is initialized with a value, React returns an object containing
 * that value as `.current`. Updating `.current` is a normal JavaScript
 * mutation. React does not track the mutation and therefore does not update
 * the UI because of it.
 *
 * A ref is different from state: state updates request a new render, while ref
 * mutations do not. If a value must affect rendered output, it should normally
 * be state instead of a ref.
 *
 * Ref objects should generally be read or written outside rendering when the
 * mutation is intended to represent an external or mutable value. Event
 * handlers and effects are common places to update refs. Reading a ref during
 * render is appropriate when the value is stable and does not participate in
 * React's reactive rendering data flow.
 */

import { type FC, type ReactNode, useEffect, useRef, useState } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface RenderCountRefProps {
  readonly label: string;
}

export interface PreviousValueRefProps {
  readonly value: string;
}

export interface TimerRefProps {
  readonly durationMilliseconds: number;
}

export interface InstanceValueRefProps {
  readonly initialValue: number;
}

export interface RefStateComparisonProps {
  readonly initialValue: number;
}

export interface MutableObjectRefProps {
  readonly initialValue: string;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * Demonstrates a ref used to count completed renders. The counter is updated
 * after each render so the ref mutation itself does not participate in the
 * render that caused it.
 */
export const RenderCountRefExample: FC<RenderCountRefProps> = ({ label }: RenderCountRefProps): ReactNode => {
  const renderCountRef = useRef<number>(0);
  const [count, setCount] = useState<number>(0);

  useEffect((): void => {
    renderCountRef.current += 1;
  });

  const increment = (): void => {
    setCount((previousCount: number): number => previousCount + 1);
  };

  return (
    <section>
      <h3>{label}</h3>
      <p>State count: {count}</p>
      <p>Completed renders before this render: {renderCountRef.current}</p>
      <button type="button" onClick={increment}>
        Render again
      </button>
    </section>
  );
};

/**
 * Demonstrates storing the previous committed value in a ref. The effect runs
 * after rendering and stores the current value for the next render.
 */
export const PreviousValueRefExample: FC<PreviousValueRefProps> = ({ value }: PreviousValueRefProps): ReactNode => {
  const previousValueRef = useRef<string | undefined>(undefined);

  useEffect((): void => {
    previousValueRef.current = value;
  }, [value]);

  return (
    <section>
      <h3>Previous value with a ref</h3>
      <p>Current value: {value}</p>
      <p>Previous value: {previousValueRef.current ?? "No previous value"}</p>
    </section>
  );
};

/**
 * Demonstrates storing a timeout identifier in a ref. The identifier persists
 * without causing a render when the timer is created or cleared.
 */
export const TimerRefExample: FC<TimerRefProps> = ({ durationMilliseconds }: TimerRefProps): ReactNode => {
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
      <h3>Timer handle in a ref</h3>
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
 * Demonstrates a ref as instance-like mutable data. Updating `.current`
 * preserves the value without scheduling a render, while an independent
 * state update can render the component and expose the current ref value.
 */
export const InstanceValueRefExample: FC<InstanceValueRefProps> = ({
  initialValue,
}: InstanceValueRefProps): ReactNode => {
  const valueRef = useRef<number>(initialValue);
  const [renderVersion, setRenderVersion] = useState<number>(0);

  const incrementRef = (): void => {
    valueRef.current += 1;
  };

  const forceRender = (): void => {
    setRenderVersion((previousVersion: number): number => previousVersion + 1);
  };

  return (
    <section>
      <h3>Persistent mutable value</h3>
      <p>Ref value: {valueRef.current}</p>
      <p>Render version: {renderVersion}</p>
      <button type="button" onClick={incrementRef}>
        Change ref
      </button>
      <button type="button" onClick={forceRender}>
        Render component
      </button>
    </section>
  );
};

/**
 * Demonstrates the difference between state and refs. State changes schedule
 * a render, while a ref mutation remains invisible until another render occurs.
 */
export const RefStateComparisonExample: FC<RefStateComparisonProps> = ({
  initialValue,
}: RefStateComparisonProps): ReactNode => {
  const refValue = useRef<number>(initialValue);
  const [stateValue, setStateValue] = useState<number>(initialValue);

  const updateRef = (): void => {
    refValue.current += 1;
  };

  const updateState = (): void => {
    setStateValue((previousValue: number): number => previousValue + 1);
  };

  return (
    <section>
      <h3>Ref versus state</h3>
      <p>Ref value: {refValue.current}</p>
      <p>State value: {stateValue}</p>
      <button type="button" onClick={updateRef}>
        Increment ref
      </button>
      <button type="button" onClick={updateState}>
        Increment state
      </button>
    </section>
  );
};

/**
 * Demonstrates that a ref can contain an object. Mutating a property of the
 * object changes the stored mutable value but does not schedule a render.
 */
export const MutableObjectRefExample: FC<MutableObjectRefProps> = ({
  initialValue,
}: MutableObjectRefProps): ReactNode => {
  const dataRef = useRef<{ value: string }>({
    value: initialValue,
  });
  const [renderVersion, setRenderVersion] = useState<number>(0);

  const updateObject = (): void => {
    dataRef.current.value = "Updated";
  };

  const forceRender = (): void => {
    setRenderVersion((previousVersion: number): number => previousVersion + 1);
  };

  return (
    <section>
      <h3>Mutable object in a ref</h3>
      <p>Object value: {dataRef.current.value}</p>
      <p>Render version: {renderVersion}</p>
      <button type="button" onClick={updateObject}>
        Mutate ref object
      </button>
      <button type="button" onClick={forceRender}>
        Render component
      </button>
    </section>
  );
};

/**

* Demonstrates a common misconception by mutating a ref and showing that the
* rendered UI does not update because changing `.current` does not schedule
* another render.
*/
export const RefDoesNotTriggerRenderExample: FC = (): ReactNode => {
  const valueRef = useRef<number>(0);
  const [renderVersion, setRenderVersion] = useState<number>(0);

  const updateRef = (): void => {
    valueRef.current += 1;
  };

  const forceRender = (): void => {
    setRenderVersion((previousVersion: number): number => previousVersion + 1);
  };

  return (
    <section>
      <h3>Refs do not trigger renders</h3>
      <p>Ref value: {valueRef.current}</p>
      <p>Render version: {renderVersion}</p>

      <button type="button" onClick={updateRef}>
        Change ref
      </button>

      <button type="button" onClick={forceRender}>
        Render component
      </button>
    </section>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const UseRefContainer: FC = (): ReactNode => {
  return (
    <main>
      <h1>useRef</h1>

      <h2>1. Persisting a value across renders</h2>
      <RenderCountRefExample label="Render counter" />

      <h2>2. Remembering a previous value</h2>
      <PreviousValueRefExample value="John Doe" />

      <h2>3. Storing a timer handle</h2>
      <TimerRefExample durationMilliseconds={1000} />

      <h2>4. Keeping mutable instance-like data</h2>
      <InstanceValueRefExample initialValue={0} />

      <h2>5. Comparing refs with state</h2>
      <RefStateComparisonExample initialValue={0} />

      <h2>6. Mutating an object stored in a ref</h2>
      <MutableObjectRefExample initialValue="Initial" />

      <h2>7. Understanding why ref changes do not render</h2>
      <RefDoesNotTriggerRenderExample />
    </main>
  );
};

export default UseRefContainer;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - `useRef` returns a persistent mutable object with a `.current` property.
// - The same ref object persists for the lifetime of the component instance.
// - Changing `.current` does not schedule a React render.
// - Refs can store timers, previous values, mutable instance-like data, and handles.
// - Effects and event handlers are appropriate places for most ref mutations.
// - State should be used when a value must cause the rendered UI to update.
// - Mutating a ref can be useful when the value intentionally exists outside React's render flow.
