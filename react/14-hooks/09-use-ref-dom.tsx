/**
 * useRef with DOM Elements
 * ========================
 *
 * `useRef` can hold a reference to a DOM node when the ref object is passed
 * to a JSX element through its `ref` prop. After React commits that element,
 * React assigns the corresponding DOM node to `ref.current`. When the element
 * is removed, React resets the value to `null`.
 *
 * DOM refs are commonly used for imperative browser operations that are not
 * naturally expressed through React state, such as focusing an input,
 * selecting text, scrolling an element into view, or measuring an element
 * after it has been rendered.
 *
 * A DOM ref should be read or mutated from an event handler or an Effect when
 * the operation depends on the committed DOM. Reading `ref.current` during
 * render is generally inappropriate for DOM-dependent behavior because the
 * DOM for the current render has not necessarily been committed yet.
 *
 * The type of a DOM ref should match the element assigned to it. For example,
 * `useRef<HTMLInputElement | null>(null)` is appropriate for an input element.
 * React automatically assigns the matching DOM node and clears the ref when
 * that node is removed.
 *
 * A DOM ref is not a replacement for state. Changing `ref.current` does not
 * cause a render, so values that determine what React should display should
 * remain in state or props.
 */

import { type FC, type ReactNode, useEffect, useRef, useState } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface FocusInputProps {
  readonly initialValue: string;
}

export interface ScrollTargetProps {
  readonly label: string;
}

export interface SelectTextProps {
  readonly text: string;
}

export interface MeasureElementProps {
  readonly text: string;
}

export interface DomRefStateProps {
  readonly initialValue: string;
}

export interface DomRefLifecycleProps {
  readonly showElementInitially: boolean;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * Demonstrates focusing a DOM input imperatively. The ref points directly to
 * the input element after React commits it, allowing the click handler to call
 * the browser's `focus()` method.
 */
export const FocusInputExample: FC<FocusInputProps> = ({ initialValue }: FocusInputProps): ReactNode => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const focusInput = (): void => {
    inputRef.current?.focus();
  };

  return (
    <section>
      <h3>Focusing a DOM element</h3>

      <label>
        Name
        <input ref={inputRef} defaultValue={initialValue} />
      </label>

      <button type="button" onClick={focusInput}>
        Focus input
      </button>
    </section>
  );
};

/**
 * Demonstrates scrolling a DOM element into view. The browser performs the
 * scrolling operation when the event handler calls `scrollIntoView()`.
 */
export const ScrollTargetExample: FC<ScrollTargetProps> = ({ label }: ScrollTargetProps): ReactNode => {
  const targetRef = useRef<HTMLDivElement | null>(null);

  const scrollToTarget = (): void => {
    targetRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  };

  return (
    <section>
      <h3>Scrolling to a DOM element</h3>

      <button type="button" onClick={scrollToTarget}>
        Scroll to target
      </button>

      <div style={{ height: "160px" }} aria-hidden="true" />

      <div
        ref={targetRef}
        style={{
          border: "1px solid currentColor",
          padding: "1rem",
        }}
      >
        {label}
      </div>

      <div style={{ height: "160px" }} aria-hidden="true" />
    </section>
  );
};

/**
 * Demonstrates selecting the contents of a text input with the browser's
 * `select()` method.
 */
export const SelectTextExample: FC<SelectTextProps> = ({ text }: SelectTextProps): ReactNode => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const selectText = (): void => {
    inputRef.current?.select();
  };

  return (
    <section>
      <h3>Selecting input text</h3>

      <input ref={inputRef} defaultValue={text} />

      <button type="button" onClick={selectText}>
        Select text
      </button>
    </section>
  );
};

/**
 * Demonstrates measuring a committed DOM element. The measurement occurs in
 * an Effect after React has committed the element, so the browser can provide
 * its current bounding rectangle.
 */
export const MeasureElementExample: FC<MeasureElementProps> = ({ text }: MeasureElementProps): ReactNode => {
  const elementRef = useRef<HTMLDivElement | null>(null);
  const [width, setWidth] = useState<number | null>(null);

  useEffect((): void => {
    const element: HTMLDivElement | null = elementRef.current;

    if (element === null) {
      return;
    }

    const { width: measuredWidth } = element.getBoundingClientRect();
    setWidth(measuredWidth);
  }, [text]);

  return (
    <section>
      <h3>Measuring a DOM element</h3>

      <div
        ref={elementRef}
        style={{
          display: "inline-block",
          padding: "1rem",
          border: "1px solid currentColor",
        }}
      >
        {text}
      </div>

      <p>Width: {width === null ? "Measuring..." : `${width.toFixed(2)}px`}</p>
    </section>
  );
};

/**
 * Demonstrates that a DOM ref does not provide reactive rendering. The input
 * value is changed through the DOM, but React state is used to explicitly
 * trigger a render so the component can display the current DOM value.
 */
export const DomRefStateExample: FC<DomRefStateProps> = ({ initialValue }: DomRefStateProps): ReactNode => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [renderVersion, setRenderVersion] = useState<number>(0);

  const readDomValue = (): void => {
    setRenderVersion((previousVersion: number): number => previousVersion + 1);
  };

  const currentDomValue: string = inputRef.current?.value ?? "";

  return (
    <section>
      <h3>DOM refs do not trigger renders</h3>

      <input ref={inputRef} defaultValue={initialValue} />

      <button type="button" onClick={readDomValue}>
        Read DOM value
      </button>

      <p>DOM value read during this render: {currentDomValue}</p>
      <p>Render version: {renderVersion}</p>
    </section>
  );
};

/**
 * Demonstrates the lifecycle of a DOM ref. React assigns the DOM node when
 * the element is committed and clears `ref.current` when the element is
 * removed from the rendered tree.
 */
export const DomRefLifecycleExample: FC<DomRefLifecycleProps> = ({
  showElementInitially,
}: DomRefLifecycleProps): ReactNode => {
  const elementRef = useRef<HTMLDivElement | null>(null);
  const [showElement, setShowElement] = useState<boolean>(showElementInitially);
  const [status, setStatus] = useState<string>("Mounted");

  const toggleElement = (): void => {
    setShowElement((previousShowElement: boolean): boolean => !previousShowElement);
    setStatus((previousStatus: string): string => (previousStatus === "Mounted" ? "Toggled" : "Mounted"));
  };

  const inspectRef = (): void => {
    setStatus(elementRef.current === null ? "ref.current is null" : "ref.current contains the DOM element");
  };

  return (
    <section>
      <h3>DOM ref lifecycle</h3>

      {showElement ? (
        <div
          ref={elementRef}
          style={{
            padding: "1rem",
            border: "1px solid currentColor",
          }}
        >
          Referenced element
        </div>
      ) : (
        <p>The referenced element is not rendered.</p>
      )}

      <button type="button" onClick={toggleElement}>
        Toggle element
      </button>

      <button type="button" onClick={inspectRef}>
        Inspect ref
      </button>

      <p>Status: {status}</p>
    </section>
  );
};

/**
 * Demonstrates a common misconception by displaying an invalid reactive
 * pattern. Mutating or reading a DOM ref does not make React re-render the
 * component; state is required when the rendered output must change.
 */
export const DomRefDoesNotTriggerRenderExample: FC = (): ReactNode => {
  const incorrectPattern: string = `
// This changes the DOM but does not schedule a React render.
inputRef.current.value = "Updated";

// Use state when React should render the new value.
setValue("Updated");
`;

  return (
    <section>
      <h3>DOM refs are not reactive state</h3>
      <pre>{incorrectPattern}</pre>
    </section>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const UseRefDomContainer: FC = (): ReactNode => {
  return (
    <main>
      <h1>useRef with DOM Elements</h1>

      <h2>1. Focusing a DOM element</h2>
      <FocusInputExample initialValue="John Doe" />

      <h2>2. Scrolling to a DOM element</h2>
      <ScrollTargetExample label="Scroll target" />

      <h2>3. Selecting DOM input text</h2>
      <SelectTextExample text="example.com" />

      <h2>4. Measuring a committed DOM element</h2>
      <MeasureElementExample text="Measured content" />

      <h2>5. Understanding DOM refs versus state</h2>
      <DomRefStateExample initialValue="Initial value" />

      <h2>6. Understanding the DOM ref lifecycle</h2>
      <DomRefLifecycleExample showElementInitially />

      <h2>7. Understanding why DOM refs do not trigger renders</h2>
      <DomRefDoesNotTriggerRenderExample />
    </main>
  );
};

export default UseRefDomContainer;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - `useRef` can hold a reference to a DOM element through JSX's `ref` prop.
// - React assigns the DOM node to `ref.current` after the element is committed.
// - React clears the DOM ref when its referenced element is removed.
// - DOM refs are useful for focus, scrolling, text selection, and measurements.
// - DOM-dependent operations should generally run in event handlers or effects.
// - A DOM ref should use a TypeScript type matching the referenced element.
// - Changing a DOM ref does not schedule a React render.
// - State remains the appropriate mechanism for values that determine rendered output.
