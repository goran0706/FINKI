/**
 * Uncontrolled Refs
 * ==================
 *
 * Refs provide a way to access DOM elements directly without storing their current values in
 * React state. With an uncontrolled form control, a ref can point to the underlying HTML element
 * so its current DOM value, checked state, focus state, or other DOM properties can be read or
 * modified imperatively.
 *
 * `useRef` returns a stable ref object whose `.current` property persists across renders. Updating
 * `.current` does not trigger a React re-render. Before the element is mounted, `.current` is
 * `null`, so DOM access must account for that possibility.
 *
 * Refs are particularly useful for uncontrolled inputs because the DOM owns the current value.
 * They should not be used as a replacement for state when the UI needs to reactively render from
 * a value that changes over time.
 */

import React from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface UncontrolledInputRefProps {
  readonly initialValue: string;
}

export interface UncontrolledCheckboxRefProps {
  readonly initialChecked: boolean;
}

export interface UncontrolledFocusRefProps {
  readonly initialValue: string;
}

export interface UncontrolledFormRefProps {
  readonly initialName: string;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

export const UncontrolledInputRef: React.FC<UncontrolledInputRefProps> = ({ initialValue }): React.ReactElement => {
  const inputRef: React.RefObject<HTMLInputElement | null> = React.useRef<HTMLInputElement>(null);

  const handleReadValue = (): void => {
    const input: HTMLInputElement | null = inputRef.current;

    if (input !== null) {
      console.log("Current value:", input.value);
    }
  };

  return (
    <div>
      <label>
        Name
        <input ref={inputRef} type="text" defaultValue={initialValue} />
      </label>

      <button type="button" onClick={handleReadValue}>
        Read Value
      </button>
    </div>
  );
};

export const UncontrolledCheckboxRef: React.FC<UncontrolledCheckboxRefProps> = ({
  initialChecked,
}): React.ReactElement => {
  const checkboxRef: React.RefObject<HTMLInputElement | null> = React.useRef<HTMLInputElement>(null);

  const handleReadChecked = (): void => {
    const checkbox: HTMLInputElement | null = checkboxRef.current;

    if (checkbox !== null) {
      console.log("Checked:", checkbox.checked);
    }
  };

  return (
    <div>
      <label>
        <input ref={checkboxRef} type="checkbox" defaultChecked={initialChecked} />
        Receive notifications
      </label>

      <button type="button" onClick={handleReadChecked}>
        Read Checked State
      </button>
    </div>
  );
};

export const UncontrolledFocusRef: React.FC<UncontrolledFocusRefProps> = ({ initialValue }): React.ReactElement => {
  const inputRef: React.RefObject<HTMLInputElement | null> = React.useRef<HTMLInputElement>(null);

  const handleFocus = (): void => {
    inputRef.current?.focus();
  };

  return (
    <div>
      <label>
        Search
        <input ref={inputRef} type="text" defaultValue={initialValue} />
      </label>

      <button type="button" onClick={handleFocus}>
        Focus Input
      </button>
    </div>
  );
};

export const UncontrolledFormRef: React.FC<UncontrolledFormRefProps> = ({ initialName }): React.ReactElement => {
  const formRef: React.RefObject<HTMLFormElement | null> = React.useRef<HTMLFormElement>(null);

  const handleReadForm = (): void => {
    const form: HTMLFormElement | null = formRef.current;

    if (form !== null) {
      const formData: FormData = new FormData(form);
      const name: FormDataEntryValue | null = formData.get("name");

      console.log("Current name:", name);
    }
  };

  return (
    <form ref={formRef}>
      <label>
        Name
        <input type="text" name="name" defaultValue={initialName} />
      </label>

      <button type="button" onClick={handleReadForm}>
        Read Form
      </button>
    </form>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const MainContainer: React.FC = (): React.ReactElement => {
  return (
    <main>
      <h1>Uncontrolled Refs</h1>

      <h2>1. Reading an Uncontrolled Input through a Ref</h2>
      <UncontrolledInputRef initialValue="John Doe" />

      <h2>2. Reading an Uncontrolled Checkbox through a Ref</h2>
      <UncontrolledCheckboxRef initialChecked={true} />

      <h2>3. Imperatively Focusing an Uncontrolled Input</h2>
      <UncontrolledFocusRef initialValue="Search term" />

      <h2>4. Accessing an Uncontrolled Form through a Ref</h2>
      <UncontrolledFormRef initialName="John Doe" />
    </main>
  );
};

export default MainContainer;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - `useRef` provides a stable object whose `.current` property can reference a DOM element.
// - DOM refs are typed with the corresponding HTML element type, such as `HTMLInputElement`.
// - A DOM ref's `.current` value is `null` before the element is mounted.
// - Reading `.current` does not trigger a React re-render.
// - An uncontrolled input's current value can be read through `inputRef.current.value`.
// - An uncontrolled checkbox's current state can be read through `inputRef.current.checked`.
// - DOM methods such as `focus()` can be called through a ref for imperative operations.
// - A form ref can be passed to `FormData` to read its current named control values.
// - Refs should not replace state when changing data needs to trigger reactive rendering.
