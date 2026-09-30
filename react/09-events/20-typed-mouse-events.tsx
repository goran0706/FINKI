/**
 * Typed Mouse Events
 * ==================
 *
 * React provides specialized TypeScript event types for mouse interactions through `MouseEvent`.
 * The generic element parameter describes the DOM element on which the React handler is attached,
 * allowing properties such as `currentTarget` to be typed according to that element.
 *
 * Mouse events include interactions such as clicks, double clicks, pressing or releasing a mouse
 * button, entering or leaving an element, and moving across an element. Different React event
 * props can therefore use the same `MouseEvent<T>` type while exposing different mouse-specific
 * event properties.
 *
 * The event generic should describe the element receiving the handler, not the element that happens
 * to become `event.target`. `event.target` is typed more generally because the event may originate
 * from a descendant element, while `event.currentTarget` is typed using the generic element type.
 */

import React, { type MouseEvent } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface MouseClickEventProps {
  readonly label: string;
}

export interface MousePositionEventProps {
  readonly label: string;
}

export interface MouseButtonEventProps {
  readonly label: string;
}

export interface MouseEnterLeaveEventProps {
  readonly label: string;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * `MouseEvent<HTMLButtonElement>` types a click handler attached to a button.
 * The event exposes mouse-specific information while `currentTarget` is typed
 * as `HTMLButtonElement`.
 */
export const MouseClickEvent: React.FC<MouseClickEventProps> = ({ label }): React.ReactElement => {
  const handleClick = (event: MouseEvent<HTMLButtonElement>): void => {
    console.log("Button:", event.currentTarget);
    console.log("Click coordinates:", event.clientX, event.clientY);
  };

  return (
    <button type="button" onClick={handleClick}>
      {label}
    </button>
  );
};

/**
 * Mouse coordinates are reported relative to the browser viewport through
 * `clientX` and `clientY`.
 */
export const MousePositionEvent: React.FC<MousePositionEventProps> = ({ label }): React.ReactElement => {
  const handleMouseMove = (event: MouseEvent<HTMLDivElement>): void => {
    console.log("Client X:", event.clientX);
    console.log("Client Y:", event.clientY);
  };

  return <div onMouseMove={handleMouseMove}>{label}</div>;
};

/**
 * `button` identifies which mouse button triggered the event:
 * `0` is the primary button, `1` the middle button, and `2` the secondary button.
 */
export const MouseButtonEvent: React.FC<MouseButtonEventProps> = ({ label }): React.ReactElement => {
  const handleMouseDown = (event: MouseEvent<HTMLButtonElement>): void => {
    console.log("Mouse button:", event.button);
    console.log("Buttons currently pressed:", event.buttons);
  };

  return (
    <button type="button" onMouseDown={handleMouseDown}>
      {label}
    </button>
  );
};

/**
 * `onMouseEnter` and `onMouseLeave` use the same React `MouseEvent<T>` type,
 * but represent boundary transitions rather than button clicks.
 */
export const MouseEnterLeaveEvent: React.FC<MouseEnterLeaveEventProps> = ({ label }): React.ReactElement => {
  const handleMouseEnter = (event: MouseEvent<HTMLDivElement>): void => {
    console.log("Mouse entered:", event.currentTarget);
  };

  const handleMouseLeave = (event: MouseEvent<HTMLDivElement>): void => {
    console.log("Mouse left:", event.currentTarget);
  };

  return (
    <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      {label}
    </div>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

export const TypedMouseEventsDemo: React.FC = (): React.ReactElement => {
  return (
    <div>
      <h2>1. Typed Mouse Click Events</h2>
      <MouseClickEvent label="Click Button" />

      <h2>2. Typed Mouse Position Events</h2>
      <MousePositionEvent label="Move the Mouse Here" />

      <h2>3. Typed Mouse Button Information</h2>
      <MouseButtonEvent label="Press a Mouse Button" />

      <h2>4. Typed Mouse Enter and Leave Events</h2>
      <MouseEnterLeaveEvent label="Move Across This Area" />
    </div>
  );
};

export default TypedMouseEventsDemo;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - React mouse handlers use the specialized `MouseEvent<T>` type.
// - The generic parameter identifies the element receiving the event handler.
// - `currentTarget` receives the corresponding element-specific TypeScript type.
// - Mouse events expose properties such as `clientX`, `clientY`, `button`, and `buttons`.
// - `onMouseEnter` and `onMouseLeave` also use `MouseEvent<T>`.
// - The generic element type describes the handler's element, not necessarily
//   the element represented by `event.target`.
