/**
 * Ref Typing
 * ==========
 *
 * React refs are generic values whose TypeScript type describes the value
 * stored in the ref's `.current` property. For DOM refs, the generic type
 * identifies the concrete DOM element, such as `HTMLInputElement` or
 * `HTMLButtonElement`. When React has not yet attached the element, `.current`
 * is `null`, so DOM refs are normally initialized with `null` and typed as
 * `useRef<ElementType | null>`.
 *
 * TypeScript uses the ref type to validate properties and methods accessed
 * through `.current`. Optional chaining or an explicit null check is required
 * when `.current` may be null. This reflects the runtime lifecycle: React
 * assigns the DOM node during the commit phase and resets the ref to `null`
 * when the node is removed.
 *
 * Mutable non-DOM refs can instead be initialized with a concrete value and
 * typed directly with `useRef<T>`. The generic describes the stored value,
 * not the component itself. A ref's type should therefore match the value
 * that React or application code actually places in `.current`.
 */

import { type FC, type FormEvent, useEffect, useRef } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface InputElementRefProps {
  readonly initialValue: string;
}

export interface ButtonElementRefProps {
  readonly label: string;
}

export interface NullableDomRefProps {
  readonly message: string;
}

export interface MutableValueRefProps {
  readonly initialValue: number;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

export const InputElementRef: FC<InputElementRefProps> = ({ initialValue }): JSX.Element => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const focusInput = (): void => {
    inputRef.current?.focus();
    inputRef.current?.select();
  };

  return (
    <div>
      <input ref={inputRef} defaultValue={initialValue} />
      <button type="button" onClick={focusInput}>
        Select input text
      </button>
    </div>
  );
};

export const ButtonElementRef: FC<ButtonElementRefProps> = ({ label }): JSX.Element => {
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  useEffect((): void => {
    buttonRef.current?.focus();
  }, []);

  return (
    <button ref={buttonRef} type="button">
      {label}
    </button>
  );
};

export const NullableDomRef: FC<NullableDomRefProps> = ({ message }): JSX.Element => {
  const formRef = useRef<HTMLFormElement | null>(null);

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    if (formRef.current === null) {
      return;
    }

    formRef.current.reset();
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit}>
      <input name="example" defaultValue={message} />
      <button type="submit">Reset form</button>
    </form>
  );
};

export const MutableValueRef: FC<MutableValueRefProps> = ({ initialValue }): JSX.Element => {
  const valueRef = useRef<number>(initialValue);

  const incrementValue = (): void => {
    valueRef.current += 1;
  };

  return (
    <div>
      <p>The stored value is {valueRef.current}, and changing it does not trigger a render.</p>
      <button type="button" onClick={incrementValue}>
        Mutate ref
      </button>
    </div>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const RefTypingExamples: FC = (): JSX.Element => {
  return (
    <main>
      <h2>1. Typing a ref for an input element</h2>
      <InputElementRef initialValue="John Doe" />

      <h2>2. Typing a ref for a button element</h2>
      <ButtonElementRef label="Focused button" />

      <h2>3. Handling nullable DOM refs safely</h2>
      <NullableDomRef message="Example value" />

      <h2>4. Typing a mutable non-DOM ref</h2>
      <MutableValueRef initialValue={0} />
    </main>
  );
};

export default RefTypingExamples;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Use `useRef<HTMLInputElement | null>(null)` for an input DOM ref.
// - The generic parameter identifies the value stored in `.current`.
// - DOM refs are nullable because React attaches them after rendering.
// - Optional chaining safely handles a DOM ref whose current value is null.
// - An explicit null check is useful when multiple operations use the node.
// - Mutable non-DOM refs can use `useRef<T>(initialValue)` when a value exists
//   immediately and must remain mutable across renders.
// - A ref's generic type should describe its stored value, not its component.
// - Changing `.current` does not trigger a React render, even when the ref is
//   strongly typed.
