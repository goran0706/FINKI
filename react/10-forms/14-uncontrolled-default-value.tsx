/**
 * Uncontrolled Default Value
 * ==========================
 *
 * The `defaultValue` prop sets the initial value of an uncontrolled form control. React uses the
 * supplied value when the DOM element is initialized, but it does not continue synchronizing the
 * DOM value with the prop after the element has mounted. The browser therefore becomes responsible
 * for the control's current value after initialization.
 *
 * This behavior is different from the controlled `value` prop. `value` continuously determines
 * the rendered value, while `defaultValue` only establishes the initial DOM value. Changing a
 * `defaultValue` prop during the component's lifetime does not reset an already-mounted input.
 *
 * The same principle applies to other uncontrolled form controls: `defaultChecked` establishes
 * the initial state of a checkbox or radio button, and `defaultValue` establishes the initial
 * selection of a `<select>` or the initial text of a `<textarea>`.
 */

import React from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface DefaultValueInputProps {
  readonly initialValue: string;
}

export interface DefaultValueTextareaProps {
  readonly initialValue: string;
}

export interface DefaultValueSelectProps {
  readonly initialValue: string;
}

export interface DefaultCheckedCheckboxProps {
  readonly initialChecked: boolean;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

export const DefaultValueInput: React.FC<DefaultValueInputProps> = ({ initialValue }): React.ReactElement => {
  return (
    <div>
      <label>
        Name
        <input type="text" defaultValue={initialValue} />
      </label>

      <p>`defaultValue` initializes the input but does not control later edits.</p>
    </div>
  );
};

export const DefaultValueTextarea: React.FC<DefaultValueTextareaProps> = ({ initialValue }): React.ReactElement => {
  return (
    <div>
      <label>
        Description
        <textarea defaultValue={initialValue} />
      </label>
    </div>
  );
};

export const DefaultValueSelect: React.FC<DefaultValueSelectProps> = ({ initialValue }): React.ReactElement => {
  return (
    <div>
      <label>
        Role
        <select defaultValue={initialValue}>
          <option value="Developer">Developer</option>
          <option value="Designer">Designer</option>
          <option value="Manager">Manager</option>
        </select>
      </label>
    </div>
  );
};

export const DefaultCheckedCheckbox: React.FC<DefaultCheckedCheckboxProps> = ({
  initialChecked,
}): React.ReactElement => {
  return (
    <label>
      <input type="checkbox" defaultChecked={initialChecked} />
      Receive notifications
    </label>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const MainContainer: React.FC = (): React.ReactElement => {
  return (
    <main>
      <h1>Uncontrolled Default Value</h1>

      <h2>1. Initial Input Value with defaultValue</h2>
      <DefaultValueInput initialValue="John Doe" />

      <h2>2. Initial Textarea Value with defaultValue</h2>
      <DefaultValueTextarea initialValue="Initial description" />

      <h2>3. Initial Select Value with defaultValue</h2>
      <DefaultValueSelect initialValue="Designer" />

      <h2>4. Initial Checkbox State with defaultChecked</h2>
      <DefaultCheckedCheckbox initialChecked={true} />
    </main>
  );
};

export default MainContainer;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - `defaultValue` establishes the initial DOM value of an uncontrolled form control.
// - `defaultValue` does not continuously synchronize the DOM value with a React prop.
// - User edits remain in the DOM without requiring React state.
// - `defaultValue` can initialize inputs, textareas, and select elements.
// - `defaultChecked` initializes the checked state of uncontrolled checkboxes and radio buttons.
// - Changing `defaultValue` after an element has mounted does not reset its current DOM value.
// - `value` is different because it continuously controls the current value from React.
// - `defaultValue` is therefore appropriate when React only needs to provide an initial value.
