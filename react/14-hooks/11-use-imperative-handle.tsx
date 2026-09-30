/**
 * useImperativeHandle
 * ===================
 *
 * `useImperativeHandle` customizes the value exposed through a ref to a child
 * component. Instead of exposing the underlying DOM node directly, the child
 * can expose a small imperative API containing only the operations its parent
 * is allowed to invoke.
 *
 * The Hook receives the ref supplied by the parent, a factory that creates the
 * exposed handle, and an optional dependency list. React assigns the returned
 * handle to `ref.current` after the component commits. When dependencies
 * change, React can recreate the handle.
 *
 * In React 19, function components can receive `ref` as a prop, so a component
 * using `useImperativeHandle` does not need `forwardRef` merely to receive the
 * ref. The ref can be declared explicitly in the component's props interface.
 *
 * The exposed handle should contain imperative operations rather than
 * duplicating ordinary declarative props. The parent can call those operations
 * from event handlers or Effects. Calling them during rendering would couple
 * rendering to an imperative side effect and should be avoided.
 *
 * `useImperativeHandle` does not make a component's state externally mutable.
 * The child still owns its internal state and can expose controlled operations
 * that update that state. This provides encapsulation while allowing specific
 * imperative interactions such as focus, reset, or selection.
 *
 * A common misconception is that `useImperativeHandle` is required whenever a
 * parent needs to interact with a child. Declarative props are normally the
 * preferred mechanism. `useImperativeHandle` is useful when the interaction is
 * inherently imperative and cannot be expressed naturally through props.
 */

import { type FC, type ReactNode, type Ref, useImperativeHandle, useRef, useState } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface InputHandle {
  readonly focus: () => void;
  readonly clear: () => void;
}

export interface ImperativeInputProps {
  readonly ref: Ref<InputHandle>;
  readonly initialValue: string;
}

export interface CounterHandle {
  readonly increment: () => void;
  readonly decrement: () => void;
  readonly reset: () => void;
}

export interface ImperativeCounterProps {
  readonly ref: Ref<CounterHandle>;
  readonly initialValue: number;
}

export interface DialogHandle {
  readonly open: () => void;
  readonly close: () => void;
}

export interface ImperativeDialogProps {
  readonly ref: Ref<DialogHandle>;
  readonly title: string;
  readonly children: ReactNode;
}

export interface SearchBoxHandle {
  readonly focus: () => void;
  readonly selectAll: () => void;
}

export interface ImperativeSearchBoxProps {
  readonly ref: Ref<SearchBoxHandle>;
  readonly initialValue: string;
}

export interface ImperativeHandleComparisonProps {
  readonly initialValue: string;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * Exposes a deliberately small API around an internal input element. The
 * parent receives `focus` and `clear` operations instead of direct access to
 * the DOM node.
 */
export const ImperativeInput: FC<ImperativeInputProps> = ({ ref, initialValue }: ImperativeInputProps): ReactNode => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  useImperativeHandle(
    ref,
    (): InputHandle => ({
      focus: (): void => {
        inputRef.current?.focus();
      },
      clear: (): void => {
        if (inputRef.current !== null) {
          inputRef.current.value = "";
        }
      },
    }),
    [],
  );

  return <input ref={inputRef} defaultValue={initialValue} aria-label="Imperative input" />;
};

/**
 * Exposes controlled operations for internal counter state. The parent cannot
 * directly mutate the state; it can only invoke the operations defined by the
 * handle.
 */
export const ImperativeCounter: FC<ImperativeCounterProps> = ({
  ref,
  initialValue,
}: ImperativeCounterProps): ReactNode => {
  const [count, setCount] = useState<number>(initialValue);

  useImperativeHandle(
    ref,
    (): CounterHandle => ({
      increment: (): void => {
        setCount((previousCount: number): number => previousCount + 1);
      },
      decrement: (): void => {
        setCount((previousCount: number): number => previousCount - 1);
      },
      reset: (): void => {
        setCount(initialValue);
      },
    }),
    [initialValue],
  );

  return <p>Count: {count}</p>;
};

/**
 * Exposes open and close operations for an internal dialog. The dialog's
 * visibility remains internal state while the parent receives only the
 * imperative operations needed to control it.
 */
export const ImperativeDialog: FC<ImperativeDialogProps> = ({
  ref,
  title,
  children,
}: ImperativeDialogProps): ReactNode => {
  const dialogRef = useRef<HTMLDialogElement | null>(null);

  useImperativeHandle(
    ref,
    (): DialogHandle => ({
      open: (): void => {
        dialogRef.current?.showModal();
      },
      close: (): void => {
        dialogRef.current?.close();
      },
    }),
    [],
  );

  return (
    <dialog ref={dialogRef}>
      <h3>{title}</h3>
      {children}
      <button
        type="button"
        onClick={(): void => {
          dialogRef.current?.close();
        }}
      >
        Close
      </button>
    </dialog>
  );
};

/**
 * Exposes focus and text-selection operations for an internal search input.
 * The DOM element itself remains private to the component.
 */
export const ImperativeSearchBox: FC<ImperativeSearchBoxProps> = ({
  ref,
  initialValue,
}: ImperativeSearchBoxProps): ReactNode => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  useImperativeHandle(
    ref,
    (): SearchBoxHandle => ({
      focus: (): void => {
        inputRef.current?.focus();
      },
      selectAll: (): void => {
        inputRef.current?.select();
      },
    }),
    [],
  );

  return <input ref={inputRef} defaultValue={initialValue} aria-label="Search" />;
};

/**
 * Demonstrates the recommended separation between declarative props and an
 * imperative handle. A normal value is supplied declaratively, while an
 * imperative operation is exposed only when the parent genuinely needs it.
 */
export const ImperativeHandleComparisonExample: FC<ImperativeHandleComparisonProps> = ({
  initialValue,
}: ImperativeHandleComparisonProps): ReactNode => {
  const inputHandle = useRef<InputHandle | null>(null);

  const focusInput = (): void => {
    inputHandle.current?.focus();
  };

  const clearInput = (): void => {
    inputHandle.current?.clear();
  };

  return (
    <section>
      <h3>Declarative props with an imperative API</h3>

      <ImperativeInput ref={inputHandle} initialValue={initialValue} />

      <button type="button" onClick={focusInput}>
        Focus
      </button>

      <button type="button" onClick={clearInput}>
        Clear
      </button>
    </section>
  );
};

/**
 * Demonstrates parent-side access to an imperative counter API. The parent
 * stores the exposed handle in a ref and calls its methods from event
 * handlers.
 */
export const ImperativeCounterExample: FC = (): ReactNode => {
  const counterHandle = useRef<CounterHandle | null>(null);

  const increment = (): void => {
    counterHandle.current?.increment();
  };

  const decrement = (): void => {
    counterHandle.current?.decrement();
  };

  const reset = (): void => {
    counterHandle.current?.reset();
  };

  return (
    <section>
      <h3>Calling an imperative child API</h3>

      <ImperativeCounter ref={counterHandle} initialValue={0} />

      <button type="button" onClick={increment}>
        Increment
      </button>

      <button type="button" onClick={decrement}>
        Decrement
      </button>

      <button type="button" onClick={reset}>
        Reset
      </button>
    </section>
  );
};

/**
 * Demonstrates exposing a dialog API without exposing the underlying
 * `HTMLDialogElement`. The parent can request opening or closing while the
 * child keeps ownership of the DOM element.
 */
export const ImperativeDialogExample: FC = (): ReactNode => {
  const dialogHandle = useRef<DialogHandle | null>(null);

  const openDialog = (): void => {
    dialogHandle.current?.open();
  };

  const closeDialog = (): void => {
    dialogHandle.current?.close();
  };

  return (
    <section>
      <h3>Imperative dialog API</h3>

      <button type="button" onClick={openDialog}>
        Open dialog
      </button>

      <button type="button" onClick={closeDialog}>
        Close dialog
      </button>

      <ImperativeDialog ref={dialogHandle} title="Example dialog">
        <p>This dialog is controlled through an exposed imperative API.</p>
      </ImperativeDialog>
    </section>
  );
};

/**
 * Demonstrates a common misconception by displaying a declarative alternative
 * to an imperative API. A boolean prop is preferable when the parent can
 * describe the desired UI state directly.
 */
export const ImperativeHandleGotchaExample: FC = (): ReactNode => {
  const declarativePattern: string = `
  // Prefer declarative state when the parent can describe the desired UI.
  <Dialog open={isOpen} onClose={handleClose} />

  // Use useImperativeHandle when an imperative operation is the
  // natural interface, such as focus, selection, or an animation.
  inputHandle.current?.focus();
  `;

  return (
    <section>
      <h3>Declarative versus imperative control</h3>
      <pre>{declarativePattern}</pre>
    </section>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const UseImperativeHandleContainer: FC = (): ReactNode => {
  return (
    <main>
      <h1>useImperativeHandle</h1>

      <h2>1. Exposing a focused and clearable input API</h2>
      <ImperativeHandleComparisonExample initialValue="John Doe" />

      <h2>2. Exposing controlled counter operations</h2>
      <ImperativeCounterExample />

      <h2>3. Exposing an imperative dialog API</h2>
      <ImperativeDialogExample />

      <h2>4. Keeping the DOM implementation private</h2>
      <section>
        <ImperativeSearchBox ref={useRef<SearchBoxHandle | null>(null)} initialValue="example.com" />
      </section>

      <h2>5. Choosing declarative props versus imperative APIs</h2>
      <ImperativeHandleGotchaExample />
    </main>
  );
};

export default UseImperativeHandleContainer;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - `useImperativeHandle` customizes the value exposed through a ref.
// - React 19 function components can receive `ref` directly as a prop.
// - A child can expose a small imperative API instead of exposing its DOM node.
// - The exposed handle should contain focused imperative operations.
// - Child state remains encapsulated even when imperative methods update it.
// - Declarative props are generally preferable when the desired UI can be described as state.
// - Imperative handles are useful for operations such as focus, selection, reset, and dialog control.
// - Imperative methods should be called from event handlers or Effects rather than during rendering.
