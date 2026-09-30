/**
 * Effect Timing
 * =============
 *
 * `useEffect` is the normal Effect hook for synchronizing a component with
 * external systems after React commits the UI. It is appropriate for timers,
 * subscriptions, browser APIs, network synchronization, and other work that
 * does not need to block the browser's next paint.
 *
 * `useLayoutEffect` is a specialized Effect hook for work that must happen
 * after React commits DOM changes but before the browser paints them. It is
 * appropriate when code must synchronously measure the committed DOM or make
 * a visual DOM adjustment before the user can observe the intermediate state.
 *
 * The choice is not based on which hook is generally better. `useEffect`
 * should be preferred when there is no pre-paint requirement because layout
 * effects can block browser painting. `useLayoutEffect` should be chosen only
 * when DOM measurement or synchronous visual adjustment requires its earlier
 * timing.
 *
 * Work caused directly by a user interaction generally belongs in the event
 * handler rather than either Effect hook. Values that can be calculated from
 * props or state during rendering also do not require an Effect.
 *
 * A practical rule is to start with `useEffect`. Use `useLayoutEffect` only
 * when the operation specifically requires the committed DOM before paint,
 * such as measuring an element, positioning an overlay from its dimensions,
 * synchronously adjusting scroll position, or preventing a visible layout
 * correction.
 */

import { type ChangeEvent, type FC, type ReactElement, useEffect, useLayoutEffect, useRef, useState } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface PassiveEffectProps {
  readonly initialMessage: string;
}

export interface LayoutEffectProps {
  readonly initialText: string;
}

export interface MeasurementEffectProps {
  readonly initialWidth: number;
}

export interface EventTimingProps {
  readonly initialValue: string;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

export const PassiveEffectExample: FC<PassiveEffectProps> = ({ initialMessage }): ReactElement => {
  const [message, setMessage] = useState<string>(initialMessage);

  useEffect((): void => {
    document.title = message;
  }, [message]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setMessage(event.target.value);
  };

  return (
    <section>
      <label htmlFor="passive-effect-message">Message</label>
      <input id="passive-effect-message" value={message} onChange={handleChange} />
      <p>`useEffect` handles synchronization that does not require pre-paint timing.</p>
    </section>
  );
};

export const LayoutEffectExample: FC<LayoutEffectProps> = ({ initialText }): ReactElement => {
  const [text, setText] = useState<string>(initialText);
  const boxRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect((): void => {
    const box: HTMLDivElement | null = boxRef.current;

    if (box === null) {
      return;
    }

    box.scrollTop = box.scrollHeight;
  }, [text]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setText(event.target.value);
  };

  return (
    <section>
      <label htmlFor="layout-effect-text">Text</label>
      <input id="layout-effect-text" value={text} onChange={handleChange} />

      <div
        ref={boxRef}
        style={{
          maxHeight: "60px",
          overflowY: "auto",
          border: "1px solid black",
        }}
      >
        {text}
        <br />
        {text}
        <br />
        {text}
      </div>
    </section>
  );
};

export const MeasurementEffectExample: FC<MeasurementEffectProps> = ({ initialWidth }): ReactElement => {
  const [width, setWidth] = useState<number>(initialWidth);
  const [measuredWidth, setMeasuredWidth] = useState<number>(initialWidth);
  const boxRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect((): void => {
    const box: HTMLDivElement | null = boxRef.current;

    if (box === null) {
      return;
    }

    const nextWidth: number = box.getBoundingClientRect().width;

    setMeasuredWidth((previousWidth: number): number => (previousWidth === nextWidth ? previousWidth : nextWidth));
  }, [width]);

  const increaseWidth = (): void => {
    setWidth((previousWidth: number): number => previousWidth + 20);
  };

  return (
    <section>
      <div
        ref={boxRef}
        style={{
          width: `${width}px`,
          height: "40px",
          backgroundColor: "lightblue",
        }}
      />

      <p>Measured width: {measuredWidth}px</p>

      <button type="button" onClick={increaseWidth}>
        Increase width
      </button>
    </section>
  );
};

export const EventTimingExample: FC<EventTimingProps> = ({ initialValue }): ReactElement => {
  const [value, setValue] = useState<string>(initialValue);
  const [savedValue, setSavedValue] = useState<string>(initialValue);

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setValue(event.target.value);
  };

  const saveValue = (): void => {
    setSavedValue(value);
  };

  return (
    <section>
      <label htmlFor="event-timing-value">Value</label>
      <input id="event-timing-value" value={value} onChange={handleChange} />

      <button type="button" onClick={saveValue}>
        Save value
      </button>

      <p>Saved value: {savedValue}</p>
    </section>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const EffectTimingExamples: FC = (): ReactElement => {
  return (
    <main>
      <h2>1. useEffect for ordinary external synchronization</h2>
      <PassiveEffectExample initialMessage="John Doe" />

      <h2>2. useLayoutEffect for synchronous DOM adjustment</h2>
      <LayoutEffectExample initialText="John Doe" />

      <h2>3. useLayoutEffect for DOM measurement</h2>
      <MeasurementEffectExample initialWidth={160} />

      <h2>4. Event handlers for interaction-driven work</h2>
      <EventTimingExample initialValue="John Doe" />
    </main>
  );
};

export default EffectTimingExamples;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - `useEffect` is the normal Effect hook and should be preferred by default.
// - Use `useEffect` for synchronization that does not require pre-paint timing.
// - Use `useLayoutEffect` when committed DOM must be measured or synchronously
//   adjusted before the browser paints.
// - `useLayoutEffect` can block painting and should therefore remain focused on
//   work that actually requires pre-paint timing.
// - DOM measurement, synchronous positioning, and preventing visual layout
//   corrections are common `useLayoutEffect` cases.
// - Timers, subscriptions, browser APIs, and most external synchronization use
//   `useEffect`.
// - Work caused directly by a user interaction belongs in the event handler.
// - Values that can be calculated from props or state during rendering do not
//   require either Effect hook.
// - When there is no concrete pre-paint requirement, choose `useEffect`.
