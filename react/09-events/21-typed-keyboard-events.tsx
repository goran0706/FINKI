/**
 * Typed Keyboard Events
 * =====================
 *
 * React provides the `KeyboardEvent<T>` type for keyboard interactions. The generic element
 * parameter identifies the element receiving the event handler and gives `currentTarget` an
 * element-specific TypeScript type.
 *
 * Keyboard events expose information about the physical or logical key involved in the interaction,
 * including `key`, `code`, modifier states, and repeat behavior. `key` represents the key value
 * interpreted by the browser, while `code` represents the physical key position on the keyboard.
 *
 * `keydown` fires when a key is pressed, `keyup` fires when it is released, and repeated
 * `keydown` events can occur when a key remains held down. Keyboard handlers should therefore
 * inspect the event properties relevant to the intended interaction rather than assuming every
 * keyboard event represents a single isolated key press.
 */

import React, { type KeyboardEvent, type ReactElement } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface KeyboardKeyProps {
  readonly label: string;
}

export interface KeyboardCodeProps {
  readonly label: string;
}

export interface KeyboardModifierProps {
  readonly label: string;
}

export interface KeyboardRepeatProps {
  readonly label: string;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * `key` describes the key value interpreted by the browser, such as `"Enter"`
 * or `"Escape"`.
 */
export const KeyboardKey: React.FC<KeyboardKeyProps> = ({ label }): ReactElement => {
  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>): void => {
    console.log("Key:", event.key);
  };

  return <input aria-label={label} onKeyDown={handleKeyDown} />;
};

/**
 * `code` identifies the physical keyboard key, while `key` represents the
 * resulting key value. They can differ when keyboard layouts are involved.
 */
export const KeyboardCode: React.FC<KeyboardCodeProps> = ({ label }): ReactElement => {
  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>): void => {
    console.log("Key:", event.key);
    console.log("Code:", event.code);
  };

  return <input aria-label={label} onKeyDown={handleKeyDown} />;
};

/**
 * Keyboard events expose modifier state through properties such as
 * `ctrlKey`, `shiftKey`, `altKey`, and `metaKey`.
 */
export const KeyboardModifier: React.FC<KeyboardModifierProps> = ({ label }): ReactElement => {
  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>): void => {
    if (event.ctrlKey || event.metaKey) {
      console.log("Control modifier is active.");
    }

    if (event.shiftKey) {
      console.log("Shift modifier is active.");
    }

    if (event.altKey) {
      console.log("Alt modifier is active.");
    }
  };

  return <input aria-label={label} onKeyDown={handleKeyDown} />;
};

/**
 * Holding a key can produce repeated `keydown` events. The `repeat` property
 * indicates whether the current event is an automatic key repeat.
 */
export const KeyboardRepeat: React.FC<KeyboardRepeatProps> = ({ label }): ReactElement => {
  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>): void => {
    console.log("Key:", event.key);
    console.log("Repeated:", event.repeat);
  };

  return <input aria-label={label} onKeyDown={handleKeyDown} />;
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

export const TypedKeyboardEventsDemo: React.FC = (): ReactElement => {
  return (
    <div>
      <h2>1. Reading the Pressed Key</h2>
      <KeyboardKey label="Type a key" />

      <h2>2. Comparing Key and Code</h2>
      <KeyboardCode label="Type a key" />

      <h2>3. Reading Keyboard Modifiers</h2>
      <KeyboardModifier label="Press a modifier combination" />

      <h2>4. Detecting Repeated Keydown Events</h2>
      <KeyboardRepeat label="Hold a key" />
    </div>
  );
};

export default TypedKeyboardEventsDemo;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - React keyboard handlers use the specialized `KeyboardEvent<T>` type.
// - The generic parameter identifies the element receiving the handler.
// - `event.key` describes the browser-interpreted key value.
// - `event.code` identifies the physical keyboard key position.
// - Modifier state is available through properties such as `ctrlKey`, `shiftKey`,
//   `altKey`, and `metaKey`.
// - `event.repeat` identifies automatically repeated `keydown` events.
// - Keyboard layouts can cause `key` and `code` to represent different information.
