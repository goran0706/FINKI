/**
 * Typed Pointer Events
 * =====================
 *
 * React provides the `PointerEvent<T>` type for unified pointer interactions from devices such as
 * mice, pens, and touchscreens. The generic element parameter identifies the element receiving the
 * handler and gives `currentTarget` an element-specific TypeScript type.
 *
 * Pointer events extend the mouse-event model with pointer-specific information such as `pointerId`,
 * `pointerType`, pressure, contact geometry, and button state. A single pointer-event API therefore
 * provides a consistent event model across several physical input technologies.
 *
 * `pointerId` identifies an active pointer, while `pointerType` describes the device category.
 * Properties such as `pressure`, `width`, and `height` can provide additional information for
 * devices capable of reporting contact characteristics.
 */

import React, { type PointerEvent, type ReactElement } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface PointerIdentityProps {
  readonly label: string;
}

export interface PointerDeviceProps {
  readonly label: string;
}

export interface PointerPressureProps {
  readonly label: string;
}

export interface PointerPositionProps {
  readonly label: string;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * `PointerEvent<HTMLDivElement>` gives the pointer handler an element-specific
 * `currentTarget` and exposes the pointer's unique identifier.
 */
export const PointerIdentity: React.FC<PointerIdentityProps> = ({ label }): ReactElement => {
  const handlePointerDown = (event: PointerEvent<HTMLDivElement>): void => {
    console.log("Pointer ID:", event.pointerId);
    console.log("Current target:", event.currentTarget);
  };

  return (
    <div onPointerDown={handlePointerDown} style={{ touchAction: "none" }}>
      {label}
    </div>
  );
};

/**
 * `pointerType` identifies the device category reported by the browser,
 * commonly `"mouse"`, `"pen"`, or `"touch"`.
 */
export const PointerDevice: React.FC<PointerDeviceProps> = ({ label }): ReactElement => {
  const handlePointerDown = (event: PointerEvent<HTMLDivElement>): void => {
    console.log("Pointer type:", event.pointerType);
  };

  return (
    <div onPointerDown={handlePointerDown} style={{ touchAction: "none" }}>
      {label}
    </div>
  );
};

/**
 * Pointer pressure is represented as a normalized numeric value. Devices
 * that do not report pressure can still produce pointer events with a value
 * determined by the browser and input device.
 */
export const PointerPressure: React.FC<PointerPressureProps> = ({ label }): ReactElement => {
  const handlePointerMove = (event: PointerEvent<HTMLDivElement>): void => {
    console.log("Pressure:", event.pressure);
  };

  return (
    <div onPointerMove={handlePointerMove} style={{ touchAction: "none" }}>
      {label}
    </div>
  );
};

/**
 * Pointer events expose viewport coordinates through `clientX` and `clientY`,
 * inherited from the mouse-event model.
 */
export const PointerPosition: React.FC<PointerPositionProps> = ({ label }): ReactElement => {
  const handlePointerMove = (event: PointerEvent<HTMLDivElement>): void => {
    console.log("Client X:", event.clientX);
    console.log("Client Y:", event.clientY);
  };

  return (
    <div onPointerMove={handlePointerMove} style={{ touchAction: "none" }}>
      {label}
    </div>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

export const TypedPointerEventsDemo: React.FC = (): ReactElement => {
  return (
    <div>
      <h2>1. Identifying a Pointer</h2>
      <PointerIdentity label="Interact with this area" />

      <h2>2. Identifying the Pointer Device</h2>
      <PointerDevice label="Use a mouse, pen, or touch device" />

      <h2>3. Reading Pointer Pressure</h2>
      <PointerPressure label="Move a pointer across this area" />

      <h2>4. Reading Pointer Coordinates</h2>
      <PointerPosition label="Move the pointer across this area" />
    </div>
  );
};

export default TypedPointerEventsDemo;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - React pointer handlers use the specialized `PointerEvent<T>` type.
// - The generic parameter identifies the element receiving the pointer handler.
// - `pointerId` identifies an active pointer.
// - `pointerType` identifies the reported input device category.
// - `pressure` provides normalized pointer-pressure information when available.
// - Pointer events expose coordinates such as `clientX` and `clientY`.
// - Pointer events unify mouse, pen, and touch input under a common event model.
