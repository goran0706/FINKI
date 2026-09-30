/**
 * Refs
 * ====
 *
 * A React ref provides a persistent object or callback through which a component
 * can access a DOM node or retain a mutable value without causing a re-render when
 * that value changes. The most common form is `useRef`, which returns an object whose
 * `.current` property persists for the lifetime of the component instance.
 *
 * Refs are intentionally separate from React's rendering data flow. Updating
 * `ref.current` does not schedule a render, which makes refs appropriate for imperative
 * DOM operations, storing mutable values that do not affect the rendered output, and
 * keeping references to external resources. A ref should not normally be used as a
 * replacement for state when changing the value needs to update the UI.
 */

import React from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface RefInputProps {
  readonly initialValue?: string;
}

export interface RefFocusProps {
  readonly label: string;
}

export interface RefCallbackProps {
  readonly value: string;
}

export interface RefCounterProps {
  readonly label: string;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * `useRef` can hold a reference to a DOM element. React assigns the DOM node
 * to `.current` after the element is committed and resets it when the element
 * is removed from the DOM.
 */
export const DomElementRef: React.FC<RefInputProps> = ({ initialValue = "" }): React.ReactElement => {
  const inputRef: React.RefObject<HTMLInputElement | null> = React.useRef<HTMLInputElement>(null);

  const handleFocus = (): void => {
    inputRef.current?.focus();
  };

  const handleSelect = (): void => {
    inputRef.current?.select();
  };

  return (
    <div>
      <input ref={inputRef} defaultValue={initialValue} placeholder="Type something" />

      <button type="button" onClick={handleFocus}>
        Focus input
      </button>

      <button type="button" onClick={handleSelect}>
        Select text
      </button>
    </div>
  );
};

/**
 * A ref object persists across renders. The same ref object remains associated
 * with the component instance, while its `.current` property can be changed
 * without causing another render.
 */
export const PersistentRef: React.FC = (): React.ReactElement => {
  const renderCountRef: React.RefObject<number> = React.useRef<number>(0);

  renderCountRef.current += 1;

  return (
    <div>
      <p>Render count stored in ref: {renderCountRef.current}</p>
    </div>
  );
};

/**
 * A ref can store mutable data that does not belong in the rendered output.
 * Changing `.current` does not cause React to re-render the component.
 */
export const MutableRef: React.FC = (): React.ReactElement => {
  const valueRef: React.RefObject<number> = React.useRef<number>(0);

  const incrementRef = (): void => {
    valueRef.current += 1;
    console.log("Mutable ref value:", valueRef.current);
  };

  return (
    <div>
      <p>The current value is stored in a ref and logged to the console.</p>

      <button type="button" onClick={incrementRef}>
        Increment ref
      </button>
    </div>
  );
};

/**
 * A ref is initially `null` when it targets a DOM element. Code that runs
 * before React has committed the element cannot assume that `.current`
 * contains the node, so DOM operations should account for `null`.
 */
export const NullableDomRef: React.FC = (): React.ReactElement => {
  const buttonRef: React.RefObject<HTMLButtonElement | null> = React.useRef<HTMLButtonElement>(null);

  const readButton = (): void => {
    const button: HTMLButtonElement | null = buttonRef.current;

    if (button === null) {
      console.log("The button is not currently mounted.");
      return;
    }

    console.log("Button text:", button.textContent);
  };

  return (
    <button ref={buttonRef} type="button" onClick={readButton}>
      Read button
    </button>
  );
};

/**
 * A callback ref receives the DOM node when React attaches the ref and
 * `null` when React detaches it. Callback refs are useful when the reference
 * needs to trigger imperative setup or cleanup at attachment time.
 */
export const CallbackRef: React.FC<RefCallbackProps> = ({ value }): React.ReactElement => {
  const handleRef = (node: HTMLInputElement | null): void => {
    if (node !== null) {
      console.log("Input mounted:", node);
    } else {
      console.log("Input unmounted.");
    }
  };

  return <input ref={handleRef} defaultValue={value} />;
};

/**
 * A ref can point to a specific DOM node while the rendered element remains
 * declarative. The imperative operation is performed in the event handler,
 * not by manually changing the DOM during rendering.
 */
export const ImperativeDomOperation: React.FC<RefFocusProps> = ({ label }): React.ReactElement => {
  const inputRef: React.RefObject<HTMLInputElement | null> = React.useRef<HTMLInputElement>(null);

  const handleClear = (): void => {
    if (inputRef.current !== null) {
      inputRef.current.value = "";
      inputRef.current.focus();
    }
  };

  return (
    <div>
      <input ref={inputRef} aria-label={label} defaultValue="Temporary value" />

      <button type="button" onClick={handleClear}>
        Clear input
      </button>
    </div>
  );
};

/**
 * Refs are not reactive values. If a value must appear in rendered output,
 * state is the appropriate mechanism because state updates schedule a render.
 * A ref is appropriate when the value is needed imperatively but does not
 * determine what React should render.
 */
export const RefVsState: React.FC = (): React.ReactElement => {
  const [stateCount, setStateCount] = React.useState<number>(0);
  const refCount: React.RefObject<number> = React.useRef<number>(0);

  const incrementState = (): void => {
    setStateCount((count: number): number => count + 1);
  };

  const incrementRef = (): void => {
    refCount.current += 1;
    console.log("Ref count:", refCount.current);
  };

  return (
    <div>
      <p>State count: {stateCount}</p>
      <p>Ref count: {refCount.current}</p>

      <button type="button" onClick={incrementState}>
        Increment state
      </button>

      <button type="button" onClick={incrementRef}>
        Increment ref
      </button>
    </div>
  );
};

/**
 * A common ref use case is storing an interval identifier so that an effect
 * or event handler can later cancel the same timer. The identifier is mutable
 * implementation data rather than information that needs to be rendered.
 */
export const TimerRef: React.FC = (): React.ReactElement => {
  const timerRef: React.RefObject<number | null> = React.useRef<number | null>(null);

  const startTimer = (): void => {
    if (timerRef.current !== null) {
      return;
    }

    timerRef.current = window.setTimeout((): void => {
      console.log("Timer completed.");
      timerRef.current = null;
    }, 1000);
  };

  const cancelTimer = (): void => {
    if (timerRef.current === null) {
      return;
    }

    window.clearTimeout(timerRef.current);
    timerRef.current = null;
    console.log("Timer cancelled.");
  };

  return (
    <div>
      <button type="button" onClick={startTimer}>
        Start timer
      </button>

      <button type="button" onClick={cancelTimer}>
        Cancel timer
      </button>
    </div>
  );
};

/**
 * A ref does not make a DOM element controlled. When `defaultValue` is used,
 * the browser owns the current input value after initialization, while the ref
 * provides imperative access to the element itself.
 */
export const RefWithUncontrolledInput: React.FC = (): React.ReactElement => {
  const inputRef: React.RefObject<HTMLInputElement | null> = React.useRef<HTMLInputElement>(null);

  const readValue = (): void => {
    const value: string | undefined = inputRef.current?.value;

    console.log("Current input value:", value);
  };

  return (
    <div>
      <input ref={inputRef} defaultValue="Uncontrolled input" />

      <button type="button" onClick={readValue}>
        Read value
      </button>
    </div>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const Refs: React.FC = (): React.ReactElement => {
  return (
    <div>
      <h1>Refs</h1>

      <h2>1. Referencing a DOM Element</h2>
      <DomElementRef initialValue="Focus me" />

      <h2>2. Persistent Ref Values</h2>
      <PersistentRef />

      <h2>3. Mutable Values Without Re-rendering</h2>
      <MutableRef />

      <h2>4. Handling Nullable DOM Refs</h2>
      <NullableDomRef />

      <h2>5. Callback Refs</h2>
      <CallbackRef value="Callback ref example" />

      <h2>6. Imperative DOM Operations</h2>
      <ImperativeDomOperation label="Imperative input" />

      <h2>7. Refs vs. State</h2>
      <RefVsState />

      <h2>8. Storing Timer Identifiers</h2>
      <TimerRef />

      <h2>9. Refs with Uncontrolled Inputs</h2>
      <RefWithUncontrolledInput />
    </div>
  );
};

export default Refs;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - `useRef` returns a persistent ref object whose `.current` value survives re-renders.
// - DOM refs are assigned after React commits the corresponding element.
// - A DOM ref can be `null` when the element is not mounted.
// - Updating `.current` does not trigger a React re-render.
// - Callback refs receive the DOM node when attached and `null` when detached.
// - Refs are appropriate for imperative DOM operations and mutable non-rendering data.
// - State should be used when changing a value must cause the component to re-render.
// - Refs can store external resource handles such as timer identifiers.
// - `defaultValue` can be combined with a DOM ref for imperative access to an uncontrolled input.
// - Refs should not normally be used as a second source of truth for rendered state.
