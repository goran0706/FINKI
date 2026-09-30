/**
 * useLayoutEffect
 * ===============
 *
 * `useLayoutEffect` is an Effect Hook that runs after React commits DOM
 * mutations but before the browser repaints the screen. It has the same setup
 * and cleanup model as `useEffect`, but its timing makes it appropriate for
 * DOM measurements and visual mutations that must happen before the user sees
 * the committed result.
 *
 * The sequence is approximately: React renders, React commits DOM changes,
 * `useLayoutEffect` setup runs, and the browser can then paint. If a layout
 * Effect updates state, React processes that update before the browser paints,
 * allowing multiple DOM changes to be applied before the user sees the result.
 *
 * A layout Effect can read layout information such as `getBoundingClientRect`
 * after the DOM has been committed. This is useful when a component must
 * measure an element and synchronously adjust its layout without displaying
 * an intermediate position.
 *
 * `useLayoutEffect` should not be used merely because an operation is an
 * Effect. `useEffect` is preferred when the work does not need to block the
 * browser from painting. Layout Effects can delay painting and therefore
 * should be kept as small as practical.
 *
 * `useLayoutEffect` is also a browser-specific synchronization mechanism.
 * Server rendering does not have a browser layout to measure, so components
 * that require layout Effects need an appropriate client-only strategy when
 * rendered in environments that perform server rendering.
 */

import { type ChangeEvent, type FC, type ReactNode, useLayoutEffect, useRef, useState } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface MeasureElementProps {
  readonly text: string;
}

export interface MeasureAndDisplayProps {
  readonly initialWidth: number;
}

export interface FocusInputProps {
  readonly initialValue: string;
}

export interface PositionElementProps {
  readonly targetLabel: string;
}

export interface ResizeMeasurementProps {
  readonly initialWidth: number;
}

export interface CleanupLayoutEffectProps {
  readonly label: string;
}

export interface LayoutEffectComparisonProps {
  readonly initialValue: string;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * Measures a committed DOM element before the browser paints. The measurement
 * is stored in state so it can be displayed after React processes the layout
 * Effect update.
 */
export const MeasureElementExample: FC<MeasureElementProps> = ({ text }: MeasureElementProps): ReactNode => {
  const elementRef = useRef<HTMLDivElement | null>(null);
  const [width, setWidth] = useState<number | null>(null);

  useLayoutEffect((): void => {
    const element: HTMLDivElement | null = elementRef.current;

    if (element === null) {
      return;
    }

    const measuredWidth: number = element.getBoundingClientRect().width;
    setWidth(measuredWidth);
  }, [text]);

  return (
    <section>
      <h3>Measuring committed DOM layout</h3>

      <div
        ref={elementRef}
        style={{
          display: "inline-block",
          border: "1px solid currentColor",
          padding: "1rem",
        }}
      >
        {text}
      </div>

      <p>Measured width: {width === null ? "Measuring..." : `${width.toFixed(2)}px`}</p>
    </section>
  );
};

/**
 * Demonstrates a layout measurement followed by a state update. The layout
 * Effect calculates a value from the committed DOM and stores it before the
 * browser can paint the resulting UI.
 */
export const MeasureAndDisplayExample: FC<MeasureAndDisplayProps> = ({
  initialWidth,
}: MeasureAndDisplayProps): ReactNode => {
  const elementRef = useRef<HTMLDivElement | null>(null);
  const [measuredWidth, setMeasuredWidth] = useState<number>(initialWidth);

  useLayoutEffect((): void => {
    const element: HTMLDivElement | null = elementRef.current;

    if (element === null) {
      return;
    }

    const nextWidth: number = element.getBoundingClientRect().width;

    setMeasuredWidth((previousWidth: number): number =>
      Object.is(previousWidth, nextWidth) ? previousWidth : nextWidth,
    );
  }, []);

  return (
    <section>
      <h3>Updating state from a layout measurement</h3>

      <div
        ref={elementRef}
        style={{
          width: "240px",
          padding: "1rem",
          boxSizing: "border-box",
          border: "1px solid currentColor",
        }}
      >
        Measured element
      </div>

      <p>Width: {measuredWidth.toFixed(2)}px</p>
    </section>
  );
};

/**
 * Demonstrates focusing an input in a layout Effect. The focus operation is
 * performed after the DOM node has been committed and before the browser
 * presents the committed frame.
 */
export const FocusInputExample: FC<FocusInputProps> = ({ initialValue }: FocusInputProps): ReactNode => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  useLayoutEffect((): void => {
    inputRef.current?.focus();
  }, []);

  return (
    <section>
      <h3>Focusing after DOM commit</h3>

      <label>
        Name
        <input ref={inputRef} defaultValue={initialValue} aria-label="Name" />
      </label>
    </section>
  );
};

/**
 * Demonstrates reading layout information before performing a visual
 * adjustment. The element's position is measured after commit, and the
 * resulting value is used to set a CSS custom property.
 */
export const PositionElementExample: FC<PositionElementProps> = ({ targetLabel }: PositionElementProps): ReactNode => {
  const elementRef = useRef<HTMLDivElement | null>(null);
  const [topPosition, setTopPosition] = useState<number>(0);

  useLayoutEffect((): void => {
    const element: HTMLDivElement | null = elementRef.current;

    if (element === null) {
      return;
    }

    const nextTopPosition: number = element.getBoundingClientRect().top;

    setTopPosition((previousPosition: number): number =>
      Object.is(previousPosition, nextTopPosition) ? previousPosition : nextTopPosition,
    );
  }, [targetLabel]);

  return (
    <section>
      <h3>Reading an element's layout position</h3>

      <div
        ref={elementRef}
        style={{
          border: "1px solid currentColor",
          padding: "1rem",
        }}
      >
        {targetLabel}
      </div>

      <p>Top position: {topPosition.toFixed(2)}px</p>
    </section>
  );
};

/**
 * Demonstrates synchronizing a measurement with a resize event. The listener
 * is registered by the layout Effect, and cleanup removes the exact listener
 * when the component is unmounted.
 */
export const ResizeMeasurementExample: FC<ResizeMeasurementProps> = ({
  initialWidth,
}: ResizeMeasurementProps): ReactNode => {
  const elementRef = useRef<HTMLDivElement | null>(null);
  const [width, setWidth] = useState<number>(initialWidth);

  useLayoutEffect((): (() => void) => {
    const updateWidth = (): void => {
      const element: HTMLDivElement | null = elementRef.current;

      if (element === null) {
        return;
      }

      const nextWidth: number = element.getBoundingClientRect().width;

      setWidth((previousWidth: number): number => (Object.is(previousWidth, nextWidth) ? previousWidth : nextWidth));
    };

    updateWidth();
    window.addEventListener("resize", updateWidth);

    return (): void => {
      window.removeEventListener("resize", updateWidth);
    };
  }, []);

  return (
    <section>
      <h3>Synchronizing layout with resize events</h3>

      <div
        ref={elementRef}
        style={{
          width: "50%",
          minWidth: "160px",
          padding: "1rem",
          border: "1px solid currentColor",
          boxSizing: "border-box",
        }}
      >
        Resize the browser window.
      </div>

      <p>Current element width: {width.toFixed(2)}px</p>
    </section>
  );
};

/**
 * Demonstrates layout Effect cleanup. The cleanup function runs when the
 * component is removed or before the Effect is replaced by a new setup.
 */
export const CleanupLayoutEffectExample: FC<CleanupLayoutEffectProps> = ({
  label,
}: CleanupLayoutEffectProps): ReactNode => {
  const [status, setStatus] = useState<string>("Not measured");

  useLayoutEffect((): (() => void) => {
    setStatus(`Layout Effect active: ${label}`);

    return (): void => {
      setStatus("Layout Effect cleaned up");
    };
  }, [label]);

  return (
    <section>
      <h3>Layout Effect setup and cleanup</h3>
      <p>{status}</p>
    </section>
  );
};

/**
 * Demonstrates the distinction between layout Effects and ordinary Effects.
 * Layout-dependent work belongs in `useLayoutEffect`, while work that does not
 * need to block painting should normally use `useEffect`.
 */
export const LayoutEffectComparisonExample: FC<LayoutEffectComparisonProps> = ({
  initialValue,
}: LayoutEffectComparisonProps): ReactNode => {
  const [value, setValue] = useState<string>(initialValue);
  const elementRef = useRef<HTMLDivElement | null>(null);
  const [width, setWidth] = useState<number>(0);

  useLayoutEffect((): void => {
    const element: HTMLDivElement | null = elementRef.current;

    if (element === null) {
      return;
    }

    const nextWidth: number = element.getBoundingClientRect().width;

    setWidth((previousWidth: number): number => (Object.is(previousWidth, nextWidth) ? previousWidth : nextWidth));
  }, [value]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setValue(event.target.value);
  };

  return (
    <section>
      <h3>Choosing layout timing for layout-dependent work</h3>

      <label>
        Text
        <input value={value} onChange={handleChange} />
      </label>

      <div
        ref={elementRef}
        style={{
          display: "inline-block",
          marginTop: "0.5rem",
          padding: "1rem",
          border: "1px solid currentColor",
        }}
      >
        {value}
      </div>

      <p>Measured width: {width.toFixed(2)}px</p>
    </section>
  );
};

/**
 * Demonstrates the common misconception that every Effect should be a layout
 * Effect. The example shows when ordinary `useEffect` is sufficient and when
 * layout timing is actually required.
 */
export const LayoutEffectGotchaExample: FC = (): ReactNode => {
  const codeExample: string = `
// Ordinary synchronization does not need to block painting.
useEffect(() => {
  document.title = title;
}, [title]);

// Layout-dependent work can require pre-paint timing.
useLayoutEffect(() => {
  const width = elementRef.current?.getBoundingClientRect().width;
  // Use the measurement when visual synchronization must happen before paint.
}, []);
`;

  return (
    <section>
      <h3>Gotcha: do not replace every Effect with useLayoutEffect</h3>
      <pre>{codeExample}</pre>
    </section>
  );
};

/**
 * Demonstrates the server-rendering limitation. A layout Effect requires a
 * browser DOM, so code intended to run during server rendering must account
 * for the absence of layout information.
 */
export const ServerRenderingGotchaExample: FC = (): ReactNode => {
  return (
    <section>
      <h3>Server-rendering consideration</h3>
      <p>
        Layout Effects require a browser environment because server rendering has no committed browser layout to
        measure.
      </p>
    </section>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const UseLayoutEffectContainer: FC = (): ReactNode => {
  return (
    <main>
      <h1>useLayoutEffect</h1>

      <h2>1. Measuring a committed DOM element</h2>
      <MeasureElementExample text="Measured content" />

      <h2>2. Updating state from a layout measurement</h2>
      <MeasureAndDisplayExample initialWidth={240} />

      <h2>3. Focusing an element before paint</h2>
      <FocusInputExample initialValue="John Doe" />

      <h2>4. Reading an element's layout position</h2>
      <PositionElementExample targetLabel="Positioned content" />

      <h2>5. Synchronizing layout with browser resize events</h2>
      <ResizeMeasurementExample initialWidth={320} />

      <h2>6. Cleaning up a layout Effect</h2>
      <CleanupLayoutEffectExample label="Example layout synchronization" />

      <h2>7. Choosing layout timing for layout-dependent work</h2>
      <LayoutEffectComparisonExample initialValue="example.com" />

      <h2>8. Avoiding unnecessary layout Effects</h2>
      <LayoutEffectGotchaExample />

      <h2>9. Accounting for server-rendering limitations</h2>
      <ServerRenderingGotchaExample />
    </main>
  );
};

export default UseLayoutEffectContainer;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - `useLayoutEffect` runs after DOM commit and before the browser paints.
// - It is useful for measurements and visual DOM synchronization that must happen before paint.
// - `getBoundingClientRect()` can be used after commit to measure a DOM element.
// - State updates from a layout Effect can be processed before the browser paints.
// - Layout Effects can block painting, so unnecessary layout work should use `useEffect` instead.
// - Layout Effects use the same dependency and cleanup model as ordinary Effects.
// - DOM-dependent layout work requires a browser environment.
// - Server-rendered applications need an appropriate strategy for components that require layout Effects.
