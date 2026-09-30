/**
 * forwardRef
 * ==========
 *
 * `forwardRef` creates a React component that can receive a ref from its
 * parent and pass that ref to a descendant DOM element or another ref-aware
 * component. The function supplied to `forwardRef` receives props and the
 * forwarded ref as separate arguments, allowing the component to define which
 * underlying value the parent can access.
 *
 * The ref type is supplied as the second generic parameter and the props type
 * as the first generic parameter. For a DOM input, `forwardRef<HTMLInputElement,
 * Props>` makes the component's exposed ref target an `HTMLInputElement`.
 * The callback must accept the same ref type, including `null` where required
 * by the ref contract.
 *
 * `forwardRef` is still available in React 19, although React 19 also allows
 * function components to receive `ref` directly as a prop. Existing codebases
 * that use `forwardRef` remain valid, and understanding its mechanics is
 * important when working with such components.
 *
 * A forwarded ref exposes the element chosen by the component implementation.
 * It does not automatically expose every descendant. The component should
 * attach the forwarded ref to exactly the element or imperative target that
 * forms its public ref contract.
 */

import { type FC, forwardRef, type Ref, type RefObject, useImperativeHandle, useRef } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface ForwardedInputProps {
  readonly label: string;
}

export interface ForwardedButtonProps {
  readonly label: string;
}

export interface ImperativeInputHandle {
  readonly focus: () => void;
  readonly select: () => void;
}

export interface ImperativeInputProps {
  readonly label: string;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

export const ForwardedInput = forwardRef<HTMLInputElement, ForwardedInputProps>(function ForwardedInput(
  { label }: ForwardedInputProps,
  ref: Ref<HTMLInputElement>,
): JSX.Element {
  return (
    <label>
      {label}
      <input ref={ref} />
    </label>
  );
});

export const ForwardedButton = forwardRef<HTMLButtonElement, ForwardedButtonProps>(function ForwardedButton(
  { label }: ForwardedButtonProps,
  ref: Ref<HTMLButtonElement>,
): JSX.Element {
  return (
    <button ref={ref} type="button">
      {label}
    </button>
  );
});

export const ImperativeInput = forwardRef<ImperativeInputHandle, ImperativeInputProps>(function ImperativeInput(
  { label }: ImperativeInputProps,
  ref: Ref<ImperativeInputHandle>,
): JSX.Element {
  const inputRef: RefObject<HTMLInputElement | null> = useRef<HTMLInputElement>(null);

  useImperativeHandle(
    ref,
    (): ImperativeInputHandle => ({
      focus: (): void => {
        inputRef.current?.focus();
      },
      select: (): void => {
        inputRef.current?.select();
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

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const ForwardRefExamples: FC = (): JSX.Element => {
  const inputRef: RefObject<HTMLInputElement | null> = useRef<HTMLInputElement>(null);

  const buttonRef: RefObject<HTMLButtonElement | null> = useRef<HTMLButtonElement>(null);

  const imperativeInputRef: RefObject<ImperativeInputHandle | null> = useRef<ImperativeInputHandle>(null);

  const focusInput = (): void => {
    inputRef.current?.focus();
  };

  const focusButton = (): void => {
    buttonRef.current?.focus();
  };

  const selectImperativeInput = (): void => {
    imperativeInputRef.current?.select();
  };

  return (
    <main>
      <h2>1. Forwarding a ref to an input element</h2>
      <ForwardedInput label="Forwarded input" ref={inputRef} />
      <button type="button" onClick={focusInput}>
        Focus input
      </button>

      <h2>2. Forwarding a ref to a button element</h2>
      <ForwardedButton label="Forwarded button" ref={buttonRef} />
      <button type="button" onClick={focusButton}>
        Focus button
      </button>

      <h2>3. Exposing a custom imperative ref handle</h2>
      <ImperativeInput label="Imperative input" ref={imperativeInputRef} />
      <button type="button" onClick={selectImperativeInput}>
        Select input
      </button>
    </main>
  );
};

export default ForwardRefExamples;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - `forwardRef` lets a component receive a ref and attach it to a descendant.
// - The first generic parameter describes the component's props.
// - The second generic parameter describes the value exposed through the ref.
// - A forwarded DOM ref should use the corresponding concrete DOM element type.
// - The forwarded ref can be an object ref or callback ref through `Ref<T>`.
// - `forwardRef` does not expose every descendant automatically; the component
//   decides which element or value receives the ref.
// - `useImperativeHandle` can expose a controlled imperative API instead of
//   exposing the underlying DOM node directly.
// - React 19 also supports receiving `ref` directly as a component prop, but
//   `forwardRef` remains available for existing and compatible component APIs.
