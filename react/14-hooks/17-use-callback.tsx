/**
 * useCallback
 * ===========
 *
 * `useCallback` caches a function reference between renders. React returns the
 * same function reference on subsequent renders when the dependencies have not
 * changed, and creates a new function when one or more dependencies change.
 *
 * The Hook does not cache the result of calling the function. `useCallback(fn,
 * dependencies)` is conceptually equivalent to memoizing the function itself,
 * whereas `useMemo(() => fn, dependencies)` memoizes a value that happens to
 * be a function.
 *
 * The primary use cases are passing callbacks to memoized child components and
 * providing stable function dependencies to other Hooks. A callback that is
 * recreated on every render can cause a memoized child to render again when
 * that child compares props by reference.
 *
 * Dependencies must include reactive values read by the callback. Functional
 * state updates can sometimes remove a state value from the dependency list
 * because the updater receives the current state directly from React.
 *
 * `useCallback` is an optimization, not a correctness mechanism. Code must
 * remain correct if React creates a new function reference. It also does not
 * prevent the callback from executing when invoked.
 *
 * A common misconception is that every event handler should be wrapped in
 * `useCallback`. For ordinary components without a referential-stability
 * requirement, a normal function is usually simpler and sufficient.
 */

import { type ChangeEvent, type FC, memo, type ReactNode, useCallback, useState } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface MemoizedButtonProps {
  readonly onClick: () => void;
  readonly label: string;
}

export interface CallbackDependencyProps {
  readonly initialStep: number;
}

export interface FunctionalUpdateProps {
  readonly initialCount: number;
}

export interface SearchCallbackProps {
  readonly initialQuery: string;
}

export interface CallbackComparisonProps {
  readonly initialValue: number;
}

export interface StableCallbackProps {
  readonly initialLabel: string;
}

export interface CallbackGotchaProps {
  readonly initialValue: string;
}

export interface MemoizedReporterProps {
  readonly label: string;
  readonly onReport: (value: string) => void;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

export const MemoizedButtonExample: FC = (): ReactNode => {
  const [count, setCount] = useState<number>(0);
  const [renderVersion, setRenderVersion] = useState<number>(0);

  const handleClick = useCallback((): void => {
    setCount((previousCount: number): number => previousCount + 1);
  }, []);

  const forceParentRender = (): void => {
    setRenderVersion((previousVersion: number): number => previousVersion + 1);
  };

  return (
    <section>
      <h3>Stable callback for a memoized child</h3>

      <p>Count: {count}</p>
      <p>Parent render version: {renderVersion}</p>

      <MemoizedButton label="Increment" onClick={handleClick} />

      <button type="button" onClick={forceParentRender}>
        Re-render parent
      </button>
    </section>
  );
};

const MemoizedButton: FC<MemoizedButtonProps> = memo(({ onClick, label }: MemoizedButtonProps): ReactNode => {
  return (
    <button type="button" onClick={onClick}>
      {label}
    </button>
  );
});

export const CallbackDependencyExample: FC<CallbackDependencyProps> = ({
  initialStep,
}: CallbackDependencyProps): ReactNode => {
  const [step, setStep] = useState<number>(initialStep);
  const [count, setCount] = useState<number>(0);

  const addStep = useCallback((): void => {
    setCount((previousCount: number): number => previousCount + step);
  }, [step]);

  const increaseStep = (): void => {
    setStep((previousStep: number): number => previousStep + 1);
  };

  return (
    <section>
      <h3>Including callback dependencies</h3>

      <p>Step: {step}</p>
      <p>Count: {count}</p>

      <button type="button" onClick={addStep}>
        Add current step
      </button>

      <button type="button" onClick={increaseStep}>
        Increase step
      </button>
    </section>
  );
};

export const FunctionalUpdateExample: FC<FunctionalUpdateProps> = ({
  initialCount,
}: FunctionalUpdateProps): ReactNode => {
  const [count, setCount] = useState<number>(initialCount);

  const increment = useCallback((): void => {
    setCount((previousCount: number): number => previousCount + 1);
  }, []);

  const decrement = useCallback((): void => {
    setCount((previousCount: number): number => previousCount - 1);
  }, []);

  return (
    <section>
      <h3>Using functional updates with useCallback</h3>

      <p>Count: {count}</p>

      <button type="button" onClick={increment}>
        Increment
      </button>

      <button type="button" onClick={decrement}>
        Decrement
      </button>
    </section>
  );
};

export const SearchCallbackExample: FC<SearchCallbackProps> = ({ initialQuery }: SearchCallbackProps): ReactNode => {
  const [query, setQuery] = useState<string>(initialQuery);
  const [result, setResult] = useState<string>("No search performed");

  const search = useCallback((value: string): void => {
    const normalizedValue: string = value.trim();

    setResult(normalizedValue === "" ? "No search term" : `Searching for "${normalizedValue}"`);
  }, []);

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setQuery(event.target.value);
  };

  const handleSearch = (): void => {
    search(query);
  };

  return (
    <section>
      <h3>Passing changing data as an argument</h3>

      <label>
        Search
        <input value={query} onChange={handleChange} />
      </label>

      <button type="button" onClick={handleSearch}>
        Search
      </button>

      <p>{result}</p>
    </section>
  );
};

export const CallbackComparisonExample: FC<CallbackComparisonProps> = ({
  initialValue,
}: CallbackComparisonProps): ReactNode => {
  const [value, setValue] = useState<number>(initialValue);
  const [calls, setCalls] = useState<number>(0);

  const callback = useCallback((): void => {
    setCalls((previousCalls: number): number => previousCalls + value);
  }, [value]);

  const incrementValue = (): void => {
    setValue((previousValue: number): number => previousValue + 1);
  };

  return (
    <section>
      <h3>Callback identity follows dependencies</h3>

      <p>Value: {value}</p>
      <p>Accumulated callback result: {calls}</p>

      <button type="button" onClick={callback}>
        Invoke callback
      </button>

      <button type="button" onClick={incrementValue}>
        Change dependency
      </button>
    </section>
  );
};

export const StableCallbackExample: FC<StableCallbackProps> = ({ initialLabel }: StableCallbackProps): ReactNode => {
  const [label, setLabel] = useState<string>(initialLabel);
  const [renderVersion, setRenderVersion] = useState<number>(0);

  const reportLabel = useCallback((nextLabel: string): void => {
    console.log(`Label: ${nextLabel}`);
  }, []);

  const changeLabel = (): void => {
    setLabel("Example label");
  };

  const rerender = (): void => {
    setRenderVersion((previousVersion: number): number => previousVersion + 1);
  };

  return (
    <section>
      <h3>Stable callback with argument-based data</h3>

      <p>Label: {label}</p>
      <p>Parent render version: {renderVersion}</p>

      <MemoizedReporter label={label} onReport={reportLabel} />

      <button type="button" onClick={changeLabel}>
        Change label
      </button>

      <button type="button" onClick={rerender}>
        Re-render parent
      </button>
    </section>
  );
};

const MemoizedReporter: FC<MemoizedReporterProps> = memo(({ label, onReport }: MemoizedReporterProps): ReactNode => {
  return (
    <div>
      <p>Reporter label: {label}</p>

      <button type="button" onClick={(): void => onReport(label)}>
        Report label
      </button>
    </div>
  );
});

export const CallbackGotchaExample: FC<CallbackGotchaProps> = ({ initialValue }: CallbackGotchaProps): ReactNode => {
  const [value, setValue] = useState<string>(initialValue);
  const [invocations, setInvocations] = useState<number>(0);

  const callback = useCallback((): void => {
    setInvocations((previousInvocations: number): number => previousInvocations + 1);
  }, []);

  const changeValue = (): void => {
    setValue("Updated value");
  };

  return (
    <section>
      <h3>Gotcha: useCallback does not memoize execution</h3>

      <p>Value: {value}</p>
      <p>Callback invocations: {invocations}</p>

      <button type="button" onClick={callback}>
        Invoke callback
      </button>

      <button type="button" onClick={changeValue}>
        Change value
      </button>

      <p>
        The callback executes whenever it is called; useCallback only concerns its function identity between renders.
      </p>
    </section>
  );
};

export const UnnecessaryCallbackExample: FC = (): ReactNode => {
  const [count, setCount] = useState<number>(0);

  const increment = (): void => {
    setCount((previousCount: number): number => previousCount + 1);
  };

  return (
    <section>
      <h3>When useCallback is unnecessary</h3>

      <p>Count: {count}</p>

      <button type="button" onClick={increment}>
        Increment
      </button>

      <p>
        A local event handler does not normally need useCallback when its identity is not observed by another
        optimization.
      </p>
    </section>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const UseCallbackContainer: FC = (): ReactNode => {
  return (
    <main>
      <h1>useCallback</h1>

      <h2>1. Stabilizing a callback for a memoized child</h2>
      <MemoizedButtonExample />

      <h2>2. Declaring callback dependencies</h2>
      <CallbackDependencyExample initialStep={1} />

      <h2>3. Using functional state updates</h2>
      <FunctionalUpdateExample initialCount={0} />

      <h2>4. Passing changing data as callback arguments</h2>
      <SearchCallbackExample initialQuery="" />

      <h2>5. Observing callback identity changes</h2>
      <CallbackComparisonExample initialValue={1} />

      <h2>6. Providing a stable callback to a memoized child</h2>
      <StableCallbackExample initialLabel="John Doe" />

      <h2>7. Understanding callback identity versus execution</h2>
      <CallbackGotchaExample initialValue="Initial value" />

      <h2>8. Avoiding unnecessary useCallback</h2>
      <UnnecessaryCallbackExample />
    </main>
  );
};

export default UseCallbackContainer;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - `useCallback` caches a function reference between renders.
// - Dependencies determine when React may reuse the cached function reference.
// - `useCallback` does not cache the result of executing the function.
// - Stable callbacks are useful with memoized child components.
// - Callback dependencies must include reactive values read by the callback.
// - Functional state updates can avoid capturing current state in a callback.
// - Passing changing values as callback arguments can reduce callback dependencies.
// - `useCallback` is an optimization and is not required for every event handler.
// - A callback still executes every time it is invoked, even when its reference is memoized.
