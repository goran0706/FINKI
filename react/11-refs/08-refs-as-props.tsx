/**
 * Refs as Props
 * =============
 *
 * In React 19, function components can receive `ref` as an ordinary prop.
 * This allows a parent to pass a ref directly to a function component without
 * wrapping that component in `forwardRef`. The receiving component can then
 * attach the supplied ref to the appropriate DOM node or pass it to another
 * component.
 *
 * The `ref` prop should be typed with React's `Ref<T>` type, where `T` is the
 * value the component exposes through the ref. For a DOM input, this is
 * typically `Ref<HTMLInputElement>`. A ref may be an object ref, a callback
 * ref, or `null`, so consumers should not assume that every ref has a
 * writable `.current` property.
 *
 * A component should treat a received ref as an interface for exposing an
 * imperative target, not as arbitrary application state. The component
 * controls which underlying element receives the ref. If the implementation
 * changes from one DOM element type to another, the exposed ref contract must
 * be updated accordingly.
 *
 * Callback refs and object refs are both supported by the same `Ref<T>` type.
 * A component should normally pass the received ref directly to the target
 * element rather than reading or mutating it itself. This preserves the
 * semantics of both ref forms and lets React manage their attachment lifecycle.
 */

import { type FC, type Ref, type RefObject, useCallback, useRef } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface InputFieldProps {
  readonly label: string;
  readonly ref: Ref<HTMLInputElement>;
}

export interface CallbackRefInputProps {
  readonly label: string;
  readonly ref: Ref<HTMLInputElement>;
}

export interface OptionalRefInputProps {
  readonly label: string;
  readonly ref?: Ref<HTMLInputElement>;
}

export interface ForwardedValueInputProps {
  readonly label: string;
  readonly ref: Ref<HTMLInputElement>;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

export const InputField: FC<InputFieldProps> = ({ label, ref }): JSX.Element => {
  return (
    <label>
      {label}
      <input ref={ref} />
    </label>
  );
};

export const CallbackRefInput: FC<CallbackRefInputProps> = ({ label, ref }): JSX.Element => {
  return (
    <label>
      {label}
      <input ref={ref} />
    </label>
  );
};

export const OptionalRefInput: FC<OptionalRefInputProps> = ({ label, ref }): JSX.Element => {
  return (
    <label>
      {label}
      <input ref={ref} />
    </label>
  );
};

export const ForwardedValueInput: FC<ForwardedValueInputProps> = ({ label, ref }): JSX.Element => {
  return (
    <label>
      {label}
      <input ref={ref} />
    </label>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const RefsAsPropsExamples: FC = (): JSX.Element => {
  const inputRef: RefObject<HTMLInputElement | null> = useRef<HTMLInputElement>(null);

  const setCallbackRef = useCallback((element: HTMLInputElement | null): void => {
    if (element === null) {
      return;
    }

    element.focus();
  }, []);

  return (
    <main>
      <h2>1. Passing an object ref as a component prop</h2>
      <InputField label="Object ref input" ref={inputRef} />

      <h2>2. Passing a callback ref as a component prop</h2>
      <CallbackRefInput label="Callback ref input" ref={setCallbackRef} />

      <h2>3. Supporting an optional ref prop</h2>
      <OptionalRefInput label="Optional ref input" />

      <h2>4. Exposing a specific DOM element through the ref contract</h2>
      <ForwardedValueInput label="Input element ref" ref={inputRef} />
    </main>
  );
};

export default RefsAsPropsExamples;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - React 19 allows function components to receive `ref` as a regular prop.
// - `Ref<T>` can represent an object ref, callback ref, or `null`.
// - The generic type describes the value exposed by the component's ref.
// - A component should normally attach the received ref directly to its
//   intended DOM target rather than manipulating the ref itself.
// - Object refs and callback refs can use the same `Ref<T>` prop contract.
// - An optional ref prop can be declared with `ref?: Ref<T>` when the
//   component does not require a ref from its caller.
// - The exposed ref type must match the actual value attached to the ref.
// - This direct `ref` prop pattern is available for function components in
//   React 19 and does not require `forwardRef` for this use case.
