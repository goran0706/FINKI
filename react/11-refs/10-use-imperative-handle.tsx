/**
 * useImperativeHandle
 * ===================
 *
 * `useImperativeHandle` customizes the value exposed through a ref instead of
 * exposing the component's underlying DOM node directly. The hook receives a
 * ref, a function that creates the exposed handle, and an optional dependency
 * list. React updates the ref with the returned handle when the component is
 * mounted and when dependencies change, and it clears the ref when the
 * component unmounts.
 *
 * The exposed handle is an imperative API owned by the child component. It can
 * contain methods that perform controlled operations on internal DOM nodes or
 * other imperative resources. The parent receives only the methods and values
 * deliberately exposed by the handle.
 *
 * `useImperativeHandle` is commonly used with `forwardRef` when a component
 * receives its ref through the second argument of the `forwardRef` render
 * function. In React 19, a function component can also receive `ref` directly
 * as a prop, but `useImperativeHandle` still provides the mechanism for
 * controlling the value exposed through that ref.
 *
 * The dependency list controls when the handle is recreated. Values captured
 * by the handle's methods should be included when they can change between
 * renders. A handle should expose the smallest imperative API necessary;
 * imperative handles are not a replacement for declarative props and state.
 */

import { type FC, forwardRef, type Ref, type RefObject, useImperativeHandle, useRef, useState } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface FocusableInputHandle {
  readonly focus: () => void;
}

export interface FocusableInputProps {
  readonly label: string;
}

export interface ResettableInputHandle {
  readonly reset: () => void;
}

export interface ResettableInputProps {
  readonly initialValue: string;
}

export interface CounterHandle {
  readonly increment: () => void;
  readonly getValue: () => number;
}

export interface ImperativeCounterProps {
  readonly initialValue: number;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

export const FocusableInput = forwardRef<FocusableInputHandle, FocusableInputProps>(function FocusableInput(
  { label }: FocusableInputProps,
  ref: Ref<FocusableInputHandle>,
): JSX.Element {
  const inputRef: RefObject<HTMLInputElement | null> = useRef<HTMLInputElement>(null);

  useImperativeHandle(
    ref,
    (): FocusableInputHandle => ({
      focus: (): void => {
        inputRef.current?.focus();
      },
    }),
    [],
  );

  return (
    <label>
      {label}
      <input ref={inputRef} />
    </label>
  );
});

export const ResettableInput = forwardRef<ResettableInputHandle, ResettableInputProps>(function ResettableInput(
  { initialValue }: ResettableInputProps,
  ref: Ref<ResettableInputHandle>,
): JSX.Element {
  const inputRef: RefObject<HTMLInputElement | null> = useRef<HTMLInputElement>(null);

  useImperativeHandle(
    ref,
    (): ResettableInputHandle => ({
      reset: (): void => {
        if (inputRef.current !== null) {
          inputRef.current.value = initialValue;
        }
      },
    }),
    [initialValue],
  );

  return <input ref={inputRef} defaultValue={initialValue} />;
});

export const ImperativeCounter = forwardRef<CounterHandle, ImperativeCounterProps>(function ImperativeCounter(
  { initialValue }: ImperativeCounterProps,
  ref: Ref<CounterHandle>,
): JSX.Element {
  const [value, setValue] = useState<number>(initialValue);
  const valueRef: RefObject<number | null> = useRef<number>(initialValue);

  const increment = (): void => {
    setValue((prev: number): number => prev + 1);
    valueRef.current = (valueRef.current ?? initialValue) + 1;
  };

  useImperativeHandle(
    ref,
    (): CounterHandle => ({
      increment,
      getValue: (): number => valueRef.current ?? initialValue,
    }),
    [initialValue],
  );

  return <p>Counter value: {value}</p>;
});

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const UseImperativeHandleExamples: FC = (): JSX.Element => {
  const focusableInputRef: RefObject<FocusableInputHandle | null> = useRef<FocusableInputHandle>(null);

  const resettableInputRef: RefObject<ResettableInputHandle | null> = useRef<ResettableInputHandle>(null);

  const counterRef: RefObject<CounterHandle | null> = useRef<CounterHandle>(null);

  const focusInput = (): void => {
    focusableInputRef.current?.focus();
  };

  const resetInput = (): void => {
    resettableInputRef.current?.reset();
  };

  const incrementCounter = (): void => {
    counterRef.current?.increment();
  };

  const readCounter = (): void => {
    const currentValue: number | undefined = counterRef.current?.getValue();

    if (currentValue !== undefined) {
      window.alert(`Current value: ${currentValue}`);
    }
  };

  return (
    <main>
      <h2>1. Exposing a controlled focus method</h2>
      <FocusableInput label="Focusable input" ref={focusableInputRef} />
      <button type="button" onClick={focusInput}>
        Focus input
      </button>

      <h2>2. Exposing an operation over an internal DOM node</h2>
      <ResettableInput initialValue="John Doe" ref={resettableInputRef} />
      <button type="button" onClick={resetInput}>
        Reset input
      </button>

      <h2>3. Exposing multiple imperative methods</h2>
      <ImperativeCounter initialValue={0} ref={counterRef} />
      <button type="button" onClick={incrementCounter}>
        Increment counter
      </button>
      <button type="button" onClick={readCounter}>
        Read counter
      </button>
    </main>
  );
};

export default UseImperativeHandleExamples;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - `useImperativeHandle` controls the value exposed through a component ref.
// - The handle should expose only the imperative operations the parent needs.
// - Internal DOM nodes can remain private while their supported operations are
//   exposed through methods on the handle.
// - The dependency list determines when React recreates the exposed handle.
// - Values captured by handle methods should be represented in the dependency
//   list when those values can change between renders.
// - `useImperativeHandle` can expose several methods through one ref.
// - Imperative handles complement declarative props and state; they should not
//   replace normal data flow when declarative rendering is sufficient.
// - The ref becomes unavailable when the component unmounts, so callers should
//   safely handle a null ref when invoking imperative methods.
