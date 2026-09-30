/**
 * Typed Change Events
 * ====================
 *
 * React provides the `ChangeEvent<T>` type for form controls whose values can change through
 * user interaction. The generic element parameter identifies the element receiving the handler
 * and gives `currentTarget` an element-specific TypeScript type.
 *
 * The `change` event represents a committed value change as exposed through React's form event
 * system. For text inputs, React's `onChange` is designed to provide updates as the user edits
 * the value, while controls such as checkboxes expose their changed state through `checked`.
 *
 * `event.target` identifies the originating DOM node, while `event.currentTarget` identifies the
 * element on which the React handler is registered. Typed `ChangeEvent<T>` makes the latter
 * element-specific and allows direct access to properties such as `value` and `checked`.
 */

import React, { type ChangeEvent, type ReactElement } from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface TextChangeProps {
  readonly label: string;
}

export interface SelectChangeProps {
  readonly label: string;
}

export interface CheckboxChangeProps {
  readonly label: string;
}

export interface ChangeTargetProps {
  readonly label: string;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

/**
 * `ChangeEvent<HTMLInputElement>` gives the handler an input-specific
 * `currentTarget`, including its current string `value`.
 */
export const TextChange: React.FC<TextChangeProps> = ({ label }): ReactElement => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    console.log("Current value:", event.currentTarget.value);
  };

  return <input aria-label={label} onChange={handleChange} />;
};

/**
 * Select elements also use `ChangeEvent<HTMLSelectElement>`. The selected
 * option is available through the select element's `value` property.
 */
export const SelectChange: React.FC<SelectChangeProps> = ({ label }): ReactElement => {
  const handleChange = (event: ChangeEvent<HTMLSelectElement>): void => {
    console.log("Selected value:", event.currentTarget.value);
  };

  return (
    <select aria-label={label} defaultValue="" onChange={handleChange}>
      <option value="" disabled>
        Select an option
      </option>
      <option value="first">First</option>
      <option value="second">Second</option>
      <option value="third">Third</option>
    </select>
  );
};

/**
 * Checkboxes expose their state through `checked` rather than `value`.
 * `ChangeEvent<HTMLInputElement>` still provides the input-specific type.
 */
export const CheckboxChange: React.FC<CheckboxChangeProps> = ({ label }): ReactElement => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    console.log("Checked:", event.currentTarget.checked);
  };

  return (
    <label>
      <input type="checkbox" onChange={handleChange} />
      {label}
    </label>
  );
};

/**
 * `target` and `currentTarget` represent different concepts. `target` is
 * the originating event target, while `currentTarget` is the element whose
 * handler is currently executing.
 */
export const ChangeTarget: React.FC<ChangeTargetProps> = ({ label }): ReactElement => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    console.log("Target:", event.target);
    console.log("Current target:", event.currentTarget);
    console.log("Value:", event.currentTarget.value);
  };

  return (
    <label>
      {label}
      <input onChange={handleChange} />
    </label>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

export const TypedChangeEventsDemo: React.FC = (): ReactElement => {
  return (
    <div>
      <h2>1. Reading a Text Input Value</h2>
      <TextChange label="Type text" />

      <h2>2. Reading a Select Value</h2>
      <SelectChange label="Choose an option" />

      <h2>3. Reading Checkbox State</h2>
      <CheckboxChange label="Enable option" />

      <h2>4. Comparing Target and Current Target</h2>
      <ChangeTarget label="Change input" />
    </div>
  );
};

export default TypedChangeEventsDemo;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - React form change handlers use the specialized `ChangeEvent<T>` type.
// - The generic parameter identifies the element receiving the handler.
// - Text inputs expose their current text through `currentTarget.value`.
// - Select elements expose their selected value through `currentTarget.value`.
// - Checkboxes expose their state through `currentTarget.checked`.
// - `event.target` identifies the originating event target.
// - `event.currentTarget` identifies the element whose handler is executing.
// - The appropriate DOM element type should be supplied to `ChangeEvent<T>` for
//   accurate property access and TypeScript checking.
