/**
 * DOM Refs
 * ========
 *
 * A DOM ref gives a React component imperative access to a DOM element after
 * React has committed that element to the document. The most common approach
 * is `useRef`, which creates a stable ref object whose `.current` property is
 * populated with the corresponding DOM node.
 *
 * DOM refs are useful for operations that are inherently imperative, such as
 * focusing an input, selecting text, scrolling an element, measuring layout,
 * controlling media playback, or calling native form methods. They should be
 * used for interactions that cannot be expressed naturally through React's
 * declarative props and state model.
 */

import React from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface DomRefInputProps {
  readonly initialValue?: string;
}

export interface DomRefScrollProps {
  readonly itemCount: number;
}

export interface DomRefMediaProps {
  readonly source: string;
}

export interface DomRefMeasurementProps {
  readonly label: string;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * A DOM ref receives the actual HTML element after React commits it.
 * The ref can then be used to invoke imperative DOM methods such as `focus()`.
 */
export const DomRefFocus: React.FC<DomRefInputProps> = ({ initialValue = "" }): React.ReactElement => {
  const inputRef: React.RefObject<HTMLInputElement | null> = React.useRef<HTMLInputElement>(null);

  const handleFocus = (): void => {
    inputRef.current?.focus();
  };

  return (
    <div>
      <input ref={inputRef} defaultValue={initialValue} aria-label="Text input" />

      <button type="button" onClick={handleFocus}>
        Focus input
      </button>
    </div>
  );
};

/**
 * A DOM ref can access native element methods that are not represented by
 * ordinary React props. `select()` is a browser API that selects the text
 * contained in an input or textarea.
 */
export const DomRefSelectText: React.FC = (): React.ReactElement => {
  const inputRef: React.RefObject<HTMLInputElement | null> = React.useRef<HTMLInputElement>(null);

  const handleSelect = (): void => {
    inputRef.current?.select();
  };

  return (
    <div>
      <input ref={inputRef} defaultValue="Select this text" aria-label="Selectable text" />

      <button type="button" onClick={handleSelect}>
        Select text
      </button>
    </div>
  );
};

/**
 * Refs can be used with elements that expose native methods. The
 * `HTMLFormElement.reset()` method resets controls to their default values
 * without requiring a separate React state variable for every control.
 */
export const DomRefFormReset: React.FC = (): React.ReactElement => {
  const formRef: React.RefObject<HTMLFormElement | null> = React.useRef<HTMLFormElement>(null);

  const handleReset = (): void => {
    formRef.current?.reset();
  };

  return (
    <form ref={formRef}>
      <label>
        Name
        <input name="name" defaultValue="Initial value" />
      </label>

      <label>
        Email
        <input name="email" type="email" defaultValue="initial@example.com" />
      </label>

      <button type="button" onClick={handleReset}>
        Reset form
      </button>
    </form>
  );
};

/**
 * A ref can access scrolling APIs on an element. The operation is performed
 * imperatively because scrolling changes the browser's viewport state rather
 * than React's rendered state.
 */
export const DomRefScroll: React.FC<DomRefScrollProps> = ({ itemCount }): React.ReactElement => {
  const listRef: React.RefObject<HTMLUListElement | null> = React.useRef<HTMLUListElement>(null);

  const handleScrollToEnd = (): void => {
    listRef.current?.scrollTo({
      top: listRef.current.scrollHeight,
      behavior: "smooth",
    });
  };

  return (
    <div>
      <ul
        ref={listRef}
        style={{
          maxHeight: "150px",
          overflowY: "auto",
        }}
      >
        {Array.from({ length: itemCount }, (_value: undefined, index: number): React.ReactElement => (
          <li key={index}>Item {index + 1}</li>
        ))}
      </ul>

      <button type="button" onClick={handleScrollToEnd}>
        Scroll to end
      </button>
    </div>
  );
};

/**
 * DOM measurements are only meaningful after the element has been committed.
 * `useLayoutEffect` runs after the DOM mutation but before the browser paints,
 * making it appropriate when a measurement must be obtained synchronously
 * before the user sees the rendered result.
 */
export const DomRefMeasurement: React.FC<DomRefMeasurementProps> = ({ label }): React.ReactElement => {
  const elementRef: React.RefObject<HTMLDivElement | null> = React.useRef<HTMLDivElement>(null);
  const [width, setWidth] = React.useState<number>(0);

  React.useLayoutEffect((): void => {
    const element: HTMLDivElement | null = elementRef.current;

    if (element === null) {
      return;
    }

    const { width: measuredWidth } = element.getBoundingClientRect();

    setWidth(measuredWidth);
  }, []);

  return (
    <div>
      <div ref={elementRef}>{label}</div>

      <p>Measured width: {width}px</p>
    </div>
  );
};

/**
 * A media element exposes imperative browser APIs such as `play()` and
 * `pause()`. React controls the element's presence and attributes, while
 * the ref provides access to operations that belong to the media API.
 */
export const DomRefMedia: React.FC<DomRefMediaProps> = ({ source }): React.ReactElement => {
  const videoRef: React.RefObject<HTMLVideoElement | null> = React.useRef<HTMLVideoElement>(null);

  const handlePlay = (): void => {
    void videoRef.current?.play();
  };

  const handlePause = (): void => {
    videoRef.current?.pause();
  };

  return (
    <div>
      <video ref={videoRef} src={source} controls width={320} />

      <button type="button" onClick={handlePlay}>
        Play
      </button>

      <button type="button" onClick={handlePause}>
        Pause
      </button>
    </div>
  );
};

/**
 * A DOM ref can be used to inspect the currently mounted element, but the
 * value may be `null` when the element has not yet been committed or has
 * been removed. Optional chaining is useful when the operation is optional.
 */
export const DomRefNullable: React.FC = (): React.ReactElement => {
  const buttonRef: React.RefObject<HTMLButtonElement | null> = React.useRef<HTMLButtonElement>(null);

  const readElement = (): void => {
    const button: HTMLButtonElement | null = buttonRef.current;

    if (button === null) {
      console.log("The button is not currently mounted.");
      return;
    }

    console.log("Button text:", button.textContent);
    console.log("Button width:", button.getBoundingClientRect().width);
  };

  return (
    <button ref={buttonRef} type="button" onClick={readElement}>
      Inspect button
    </button>
  );
};

/**
 * Callback refs are another way to receive a DOM node. React invokes the
 * callback with the element when it attaches the ref and with `null` when
 * the element is detached.
 */
export const DomRefCallback: React.FC = (): React.ReactElement => {
  const handleRef = (element: HTMLInputElement | null): void => {
    if (element === null) {
      console.log("Input detached.");
      return;
    }

    console.log("Input attached:", element);
  };

  return <input ref={handleRef} defaultValue="Callback ref" aria-label="Callback ref input" />;
};

/**
 * A ref points to the currently committed DOM node. It should not be read
 * during rendering when the code requires the node to already exist. DOM
 * access belongs in event handlers, effects, or other post-commit logic.
 */
export const DomRefPostCommitAccess: React.FC = (): React.ReactElement => {
  const elementRef: React.RefObject<HTMLDivElement | null> = React.useRef<HTMLDivElement>(null);

  React.useEffect((): void => {
    const element: HTMLDivElement | null = elementRef.current;

    if (element !== null) {
      console.log("Mounted element:", element);
    }
  }, []);

  const handleRead = (): void => {
    console.log("Current element:", elementRef.current);
  };

  return (
    <div>
      <div ref={elementRef}>DOM element</div>

      <button type="button" onClick={handleRead}>
        Read ref
      </button>
    </div>
  );
};

/**
 * A common misconception is that changing a DOM ref causes React to render
 * again. Ref assignment is part of React's commit work and does not itself
 * schedule a component update. If the UI must react to a value, that value
 * should normally be represented by state instead.
 */
export const DomRefVsState: React.FC = (): React.ReactElement => {
  const [visible, setVisible] = React.useState<boolean>(true);
  const elementRef: React.RefObject<HTMLDivElement | null> = React.useRef<HTMLDivElement>(null);

  const toggleVisibility = (): void => {
    setVisible((currentVisible: boolean): boolean => !currentVisible);
  };

  const inspectRef = (): void => {
    console.log("Current DOM node:", elementRef.current);
  };

  return (
    <div>
      {visible && <div ref={elementRef}>This element can be mounted or unmounted.</div>}

      <button type="button" onClick={toggleVisibility}>
        Toggle element
      </button>

      <button type="button" onClick={inspectRef}>
        Inspect ref
      </button>
    </div>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const DomRefs: React.FC = (): React.ReactElement => {
  return (
    <div>
      <h1>DOM Refs</h1>

      <h2>1. Focusing a DOM Element</h2>
      <DomRefFocus initialValue="Focus this input" />

      <h2>2. Selecting Input Text</h2>
      <DomRefSelectText />

      <h2>3. Calling Native Form Methods</h2>
      <DomRefFormReset />

      <h2>4. Scrolling an Element Imperatively</h2>
      <DomRefScroll itemCount={20} />

      <h2>5. Measuring DOM Layout</h2>
      <DomRefMeasurement label="Measure this element" />

      <h2>6. Controlling Media Elements</h2>
      <DomRefMedia source="/media/example.mp4" />

      <h2>7. Handling Nullable DOM Refs</h2>
      <DomRefNullable />

      <h2>8. Using Callback Refs</h2>
      <DomRefCallback />

      <h2>9. Accessing DOM Nodes After Commit</h2>
      <DomRefPostCommitAccess />

      <h2>10. DOM Refs vs. React State</h2>
      <DomRefVsState />
    </div>
  );
};

export default DomRefs;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - DOM refs provide imperative access to committed DOM elements.
// - `useRef` returns a stable ref object whose `.current` points to the DOM node.
// - DOM refs are commonly used for focus, selection, scrolling, measurement, and native APIs.
// - A DOM ref can be `null` when its element is not currently mounted.
// - Callback refs receive the DOM node when attached and `null` when detached.
// - DOM measurements should be performed after the element has been committed.
// - `useLayoutEffect` is useful when layout must be measured before the browser paints.
// - DOM refs do not cause React re-renders when their `.current` value changes.
// - State should be used when a change needs to affect the rendered output.
// - DOM refs should complement React's declarative model rather than replace it.
