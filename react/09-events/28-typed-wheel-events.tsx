/**
 * Typed Wheel Events
 * ===================
 *
 * React provides the `WheelEvent<T>` type for mouse-wheel and trackpad scrolling interactions.
 * The generic element parameter identifies the element receiving the handler and gives
 * `currentTarget` an element-specific TypeScript type.
 *
 * Wheel events expose movement through `deltaX`, `deltaY`, and `deltaZ`. These values describe
 * the amount of wheel or trackpad movement along each axis, while `deltaMode` identifies the
 * unit used by the delta values: pixels, lines, or pages.
 *
 * A wheel event describes input movement rather than the resulting scroll position. A wheel
 * interaction can therefore occur on an element without that element actually scrolling,
 * depending on its scrollability, CSS, and the browser's default behavior.
 */

import React, { type ReactElement, type WheelEvent } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface WheelDeltaProps {
  readonly label: string;
}

export interface WheelAxisProps {
  readonly label: string;
}

export interface WheelModeProps {
  readonly label: string;
}

export interface WheelPreventDefaultProps {
  readonly label: string;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * `WheelEvent<HTMLDivElement>` gives the wheel handler an element-specific
 * `currentTarget` while exposing movement through the delta properties.
 */
export const WheelDelta: React.FC<WheelDeltaProps> = ({ label }): ReactElement => {
  const handleWheel = (event: WheelEvent<HTMLDivElement>): void => {
    console.log("Delta X:", event.deltaX);
    console.log("Delta Y:", event.deltaY);
    console.log("Delta Z:", event.deltaZ);
  };

  return (
    <div
      aria-label={label}
      onWheel={handleWheel}
      style={{
        height: 100,
        overflow: "auto",
      }}
    >
      {label}
    </div>
  );
};

/**
 * Positive and negative delta values describe movement in opposite
 * directions. The sign should be interpreted according to the axis.
 */
export const WheelAxis: React.FC<WheelAxisProps> = ({ label }): ReactElement => {
  const handleWheel = (event: WheelEvent<HTMLDivElement>): void => {
    if (event.deltaY > 0) {
      console.log("Wheel moved toward positive Y.");
    }

    if (event.deltaY < 0) {
      console.log("Wheel moved toward negative Y.");
    }

    if (event.deltaX > 0) {
      console.log("Wheel moved toward positive X.");
    }

    if (event.deltaX < 0) {
      console.log("Wheel moved toward negative X.");
    }
  };

  return (
    <div aria-label={label} onWheel={handleWheel}>
      {label}
    </div>
  );
};

/**
 * `deltaMode` specifies the unit represented by the delta values:
 * `0` is pixels, `1` is lines, and `2` is pages.
 */
export const WheelMode: React.FC<WheelModeProps> = ({ label }): ReactElement => {
  const handleWheel = (event: WheelEvent<HTMLDivElement>): void => {
    if (event.deltaMode === 0) {
      console.log("Wheel delta is measured in pixels.");
    }

    if (event.deltaMode === 1) {
      console.log("Wheel delta is measured in lines.");
    }

    if (event.deltaMode === 2) {
      console.log("Wheel delta is measured in pages.");
    }
  };

  return (
    <div aria-label={label} onWheel={handleWheel}>
      {label}
    </div>
  );
};

/**
 * Wheel events can be cancelled with `preventDefault()`. This prevents the
 * browser's default wheel action when the event is cancelable.
 */
export const WheelPreventDefault: React.FC<WheelPreventDefaultProps> = ({ label }): ReactElement => {
  const handleWheel = (event: WheelEvent<HTMLDivElement>): void => {
    if (event.deltaY !== 0) {
      event.preventDefault();
      console.log("Default wheel behavior prevented.");
    }
  };

  return (
    <div aria-label={label} onWheel={handleWheel}>
      {label}
    </div>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

export const TypedWheelEventsDemo: React.FC = (): ReactElement => {
  return (
    <div>
      <h2>1. Reading Wheel Movement</h2>
      <WheelDelta label="Move the wheel or trackpad" />

      <h2>2. Reading Wheel Direction</h2>
      <WheelAxis label="Move horizontally or vertically" />

      <h2>3. Reading Delta Units</h2>
      <WheelMode label="Inspect the wheel delta mode" />

      <h2>4. Preventing Default Wheel Behavior</h2>
      <WheelPreventDefault label="Wheel behavior is prevented here" />
    </div>
  );
};

export default TypedWheelEventsDemo;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - React wheel handlers use the specialized `WheelEvent<T>` type.
// - The generic parameter identifies the element receiving the wheel handler.
// - `deltaX`, `deltaY`, and `deltaZ` describe wheel or trackpad movement.
// - `deltaMode` identifies whether delta values use pixels, lines, or pages.
// - Positive and negative delta values represent movement in opposite directions.
// - A wheel event describes input movement and does not necessarily mean that
//   the event target itself will scroll.
// - `preventDefault()` can cancel the browser's default scrolling behavior when
//   the wheel event is cancelable.
