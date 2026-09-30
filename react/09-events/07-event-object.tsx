/**
 * Event Object
 * ============
 *
 * React event handlers receive a React event object when the handler declares an event parameter.
 * The object provides information about the event, including its type, modifier-key state, target
 * elements, and event-specific properties such as mouse coordinates or keyboard keys.
 *
 * React event objects follow the DOM event model while providing React-specific event interfaces.
 * The event type determines which properties are available, and the generic element parameter on
 * event types such as `MouseEvent<HTMLButtonElement>` identifies the associated DOM element.
 *
 * The `target` and `currentTarget` properties have different meanings. `target` identifies the
 * element where the event originated, while `currentTarget` identifies the element whose handler
 * is currently executing. These values can differ when an event originates from a descendant.
 */

import React, { type KeyboardEvent, type MouseEvent } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface MouseEventObjectProps {
  readonly label: string;
}

export interface KeyboardEventObjectProps {
  readonly label: string;
}

export interface ModifierEventObjectProps {
  readonly label: string;
}

export interface TargetEventObjectProps {
  readonly label: string;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * A mouse event object exposes information specific to the click, including
 * the event type, mouse button, and coordinates.
 */
export const MouseEventObject: React.FC<MouseEventObjectProps> = ({ label }): React.ReactElement => {
  const handleClick = (event: MouseEvent<HTMLButtonElement>): void => {
    console.log("Event type:", event.type);
    console.log("Mouse button:", event.button);
    console.log("Client X:", event.clientX);
    console.log("Client Y:", event.clientY);
  };

  return (
    <button type="button" onClick={handleClick}>
      {label}
    </button>
  );
};

/**
 * A keyboard event object exposes keyboard-specific information such as
 * the pressed key and the physical key location.
 */
export const KeyboardEventObject: React.FC<KeyboardEventObjectProps> = ({ label }): React.ReactElement => {
  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>): void => {
    console.log("Event type:", event.type);
    console.log("Key:", event.key);
    console.log("Code:", event.code);
    console.log("Repeat:", event.repeat);
  };

  return (
    <button type="button" onKeyDown={handleKeyDown}>
      {label}
    </button>
  );
};

/**
 * Modifier-key properties indicate whether keys such as Shift, Control,
 * Alt, or Meta were active when the event occurred.
 */
export const ModifierEventObject: React.FC<ModifierEventObjectProps> = ({ label }): React.ReactElement => {
  const handleClick = (event: MouseEvent<HTMLButtonElement>): void => {
    const modifiers: string[] = [];

    if (event.shiftKey) {
      modifiers.push("Shift");
    }

    if (event.ctrlKey) {
      modifiers.push("Control");
    }

    if (event.altKey) {
      modifiers.push("Alt");
    }

    if (event.metaKey) {
      modifiers.push("Meta");
    }

    console.log("Active modifiers:", modifiers.join(", ") || "None");
  };

  return (
    <button type="button" onClick={handleClick}>
      {label}
    </button>
  );
};

/**
 * The event's `target` can differ from `currentTarget` when the event
 * originates from a descendant of the element with the handler.
 */
export const TargetEventObject: React.FC<TargetEventObjectProps> = ({ label }): React.ReactElement => {
  const handleClick = (event: MouseEvent<HTMLButtonElement>): void => {
    console.log("Target:", event.target);
    console.log("Current target:", event.currentTarget);
  };

  return (
    <button type="button" onClick={handleClick}>
      <span>{label}</span>
    </button>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

export const EventObjectDemo: React.FC = (): React.ReactElement => {
  return (
    <div>
      <h2>1. Mouse Event Properties</h2>
      <MouseEventObject label="Inspect Mouse Event" />

      <h2>2. Keyboard Event Properties</h2>
      <KeyboardEventObject label="Press a Key" />

      <h2>3. Modifier Key Properties</h2>
      <ModifierEventObject label="Click With Modifiers" />

      <h2>4. Event Target Properties</h2>
      <TargetEventObject label="Click Nested Content" />
    </div>
  );
};

export default EventObjectDemo;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - React supplies an event object to handlers that declare an event parameter.
// - The event type determines which event-specific properties are available.
// - Mouse events expose properties such as `button`, `clientX`, and `clientY`.
// - Keyboard events expose properties such as `key`, `code`, and `repeat`.
// - Modifier properties such as `shiftKey` and `ctrlKey` describe the modifier
//   keys that were active when the event occurred.
// - `target` identifies the originating event target.
// - `currentTarget` identifies the element whose handler is currently executing.
