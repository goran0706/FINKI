/**
 * Event Handler Typing
 * ====================
 *
 * React event handlers can be explicitly typed with React's event types to describe both the
 * event being received and the DOM element that produced it. Event types such as `MouseEvent`,
 * `KeyboardEvent`, `FocusEvent`, and `ChangeEvent` are generic types whose type parameter can
 * identify the relevant HTML element.
 *
 * Typing the handler parameter allows TypeScript to validate event properties and provides accurate
 * types for `currentTarget`, `target`, and other event-specific values. The element type matters:
 * `MouseEvent<HTMLButtonElement>` provides a button-specific `currentTarget`, while
 * `ChangeEvent<HTMLInputElement>` provides an input-specific `currentTarget`.
 *
 * The event handler's return type should normally be `void` when the handler performs an action
 * rather than returning a meaningful application value. React's event prop itself determines which
 * event type is expected, while an explicit handler annotation documents and verifies the function's
 * parameter type.
 */

import React, { type ChangeEvent, type KeyboardEvent, type MouseEvent, useState } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface TypedMouseHandlerProps {
  readonly label: string;
}

export interface TypedKeyboardHandlerProps {
  readonly initialValue: string;
}

export interface TypedChangeHandlerProps {
  readonly initialValue: string;
}

export interface TypedFocusHandlerProps {
  readonly initialValue: string;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**

 * `MouseEvent<HTMLButtonElement>` identifies both the React mouse event
 * and the HTML element that receives the event.
 */
export const TypedMouseHandler: React.FC<TypedMouseHandlerProps> = ({ label }): React.ReactElement => {
  const handleClick = (event: MouseEvent<HTMLButtonElement>): void => {
    console.log("Event type:", event.type);
    console.log("Button text:", event.currentTarget.textContent);
    console.log("Mouse button:", event.button);
  };

  return (
    <button type="button" onClick={handleClick}>
      {label}
    </button>
  );
};

/**

 * `KeyboardEvent<HTMLInputElement>` provides keyboard-specific properties
 * while identifying the input element as the event's current target.
 */
export const TypedKeyboardHandler: React.FC<TypedKeyboardHandlerProps> = ({ initialValue }): React.ReactElement => {
  const [value, setValue] = useState<string>(initialValue);

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>): void => {
    if (event.key === "Enter") {
      console.log("Submitted value:", value);
    }
  };

  return (
    <input
      type="text"
      value={value}
      onChange={(event: ChangeEvent<HTMLInputElement>): void => {
        setValue(event.currentTarget.value);
      }}
      onKeyDown={handleKeyDown}
    />
  );
};

/**

 * `ChangeEvent<HTMLInputElement>` provides a typed `currentTarget` whose
 * value property is known to be the input's string value.
 */
export const TypedChangeHandler: React.FC<TypedChangeHandlerProps> = ({ initialValue }): React.ReactElement => {
  const [value, setValue] = useState<string>(initialValue);

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setValue(event.currentTarget.value);
  };

  return (
    <div>
      <input type="text" value={value} onChange={handleChange} />
      <p>Value: {value}</p>
    </div>
  );
};

/**

 * `FocusEvent<HTMLInputElement>` provides focus-specific event information
 * and identifies the input element associated with the event.
 */
export const TypedFocusHandler: React.FC<TypedFocusHandlerProps> = ({ initialValue }): React.ReactElement => {
  const [value, setValue] = useState<string>(initialValue);
  const [focused, setFocused] = useState<boolean>(false);

  const handleFocus = (event: React.FocusEvent<HTMLInputElement>): void => {
    setFocused(true);
    console.log("Focused element:", event.currentTarget);
  };

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>): void => {
    setFocused(false);
    console.log("Blurred element:", event.currentTarget);
  };

  return (
    <div>
      <input
        type="text"
        value={value}
        onChange={(event: ChangeEvent<HTMLInputElement>): void => {
          setValue(event.currentTarget.value);
        }}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
      <p>Focus state: {focused ? "Focused" : "Not focused"}</p>
    </div>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

export const EventHandlerTypingDemo: React.FC = (): React.ReactElement => {
  return (
    <div>
      <h2>1. Typed Mouse Event Handler</h2>
      <TypedMouseHandler label="Click Button" />

      <h2>2. Typed Keyboard Event Handler</h2>
      <TypedKeyboardHandler initialValue="" />

      <h2>3. Typed Change Event Handler</h2>
      <TypedChangeHandler initialValue="" />

      <h2>4. Typed Focus Event Handler</h2>
      <TypedFocusHandler initialValue="" />
    </div>
  );
};

export default EventHandlerTypingDemo;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - React event handlers can be explicitly typed with React event types.
// - Event types can specify the DOM element through a generic parameter.
// - MouseEvent<HTMLButtonElement> describes a mouse event from a button.
// - KeyboardEvent<HTMLInputElement> describes keyboard events from an input.
// - ChangeEvent<HTMLInputElement> provides typed access to an input's value.
// - FocusEvent<HTMLInputElement> describes focus events associated with an input.
// - currentTarget is typed according to the element specified by the event's generic parameter.
// - Event handlers that perform actions normally return void.
