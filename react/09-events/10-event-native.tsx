/**
 * Native Event
 * ============
 *
 * React event handlers receive SyntheticEvent objects that provide a consistent event interface
 * across React's event system. The `nativeEvent` property exposes the underlying browser event that
 * React received from the DOM.
 *
 * The native event is the actual browser event object, so it can expose browser-level properties
 * that are not represented directly on the React SyntheticEvent. Its exact concrete event type is
 * determined by the browser event and React's event implementation.
 *
 * `nativeEvent` should be used when browser-native event information is specifically required.
 * React's event abstraction should remain the default interface for ordinary event handling because
 * React does not guarantee that every SyntheticEvent type maps to a particular native event type.
 */

import React, { type MouseEvent as ReactMouseEvent } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface NativeEventTypeProps {
  readonly label: string;
}

export interface NativeEventPropertyProps {
  readonly label: string;
}

export interface NativeEventComparisonProps {
  readonly label: string;
}

export interface NativeEventBoundaryProps {
  readonly label: string;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * `nativeEvent` exposes the underlying browser event, including its
 * browser-reported event type.
 */
export const NativeEventType: React.FC<NativeEventTypeProps> = ({ label }): React.ReactElement => {
  const handleClick = (event: ReactMouseEvent<HTMLButtonElement>): void => {
    console.log("React event type:", event.type);
    console.log("Native event type:", event.nativeEvent.type);
  };

  return (
    <button type="button" onClick={handleClick}>
      {label}
    </button>
  );
};

/**
 * The native event provides browser-level event information through
 * the underlying DOM event object.
 */
export const NativeEventProperty: React.FC<NativeEventPropertyProps> = ({ label }): React.ReactElement => {
  const handleClick = (event: ReactMouseEvent<HTMLButtonElement>): void => {
    console.log("Native event:", event.nativeEvent);
    console.log("Client X:", event.nativeEvent.clientX);
    console.log("Client Y:", event.nativeEvent.clientY);
  };

  return (
    <button type="button" onClick={handleClick}>
      {label}
    </button>
  );
};

/**
 * The SyntheticEvent and its native event are separate event objects,
 * even though the React event exposes the native event through `nativeEvent`.
 */
export const NativeEventComparison: React.FC<NativeEventComparisonProps> = ({ label }): React.ReactElement => {
  const handleClick = (event: ReactMouseEvent<HTMLButtonElement>): void => {
    console.log("Synthetic event:", event);
    console.log("Native event:", event.nativeEvent);
    console.log("Same object:", event === event.nativeEvent);
  };

  return (
    <button type="button" onClick={handleClick}>
      {label}
    </button>
  );
};

/**
 * `nativeEvent` is useful for browser-specific inspection, but application
 * code should not assume a particular native event mapping from a React event.
 */
export const NativeEventBoundary: React.FC<NativeEventBoundaryProps> = ({ label }): React.ReactElement => {
  const handleClick = (event: ReactMouseEvent<HTMLButtonElement>): void => {
    const nativeEvent: MouseEvent = event.nativeEvent;

    if (nativeEvent instanceof window.MouseEvent) {
      console.log("Native mouse event detected.");
      console.log("Button:", nativeEvent.button);
      console.log("Buttons:", nativeEvent.buttons);
    }
  };

  return (
    <button type="button" onClick={handleClick}>
      {label}
    </button>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

export const EventNativeDemo: React.FC = (): React.ReactElement => {
  return (
    <div>
      <h2>1. Inspecting the Native Event Type</h2>
      <NativeEventType label="Inspect Event Type" />

      <h2>2. Reading Native Event Properties</h2>
      <NativeEventProperty label="Inspect Mouse Coordinates" />

      <h2>3. Comparing React and Native Events</h2>
      <NativeEventComparison label="Compare Event Objects" />

      <h2>4. Handling Browser-Native Event Information</h2>
      <NativeEventBoundary label="Inspect Native Mouse Event" />
    </div>
  );
};

export default EventNativeDemo;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - React event handlers receive SyntheticEvent objects.
// - `event.nativeEvent` exposes the underlying browser event.
// - The native event can provide browser-level properties through the DOM
//   event interface.
// - The SyntheticEvent and native event are different objects.
// - React's event type should remain the default API for ordinary event handling.
// - Code should not rely on a specific SyntheticEvent-to-native-event mapping
//   unless the required browser behavior is explicitly understood.
