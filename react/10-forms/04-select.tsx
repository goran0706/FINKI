/**
 * React Select
 * ============
 *
 * React `<select>` elements can be controlled by storing the selected option in React state and
 * passing that state through the `value` prop. The `onChange` handler receives a
 * `ChangeEvent<HTMLSelectElement>`, whose `target.value` contains the value of the currently
 * selected `<option>`.
 *
 * A controlled select follows the same one-way data flow as other controlled form elements:
 * React state determines the selected option, and user interaction produces an event that updates
 * that state. The `value` of an `<option>` is always represented as a string through the DOM event,
 * even when the application conceptually treats the selection as another type.
 *
 * A placeholder option can use an empty string as its value. If the select is required, the
 * browser considers that empty value invalid until the user chooses another option. A multiple
 * select is different: its selected state is represented by an array of selected options rather
 * than a single string value.
 */

import React from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface SelectProps {
  readonly label: string;
  readonly options: readonly string[];
  readonly initialValue: string;
}

export interface RequiredSelectProps {
  readonly label: string;
  readonly options: readonly string[];
}

export interface MultipleSelectProps {
  readonly label: string;
  readonly options: readonly string[];
  readonly initialValues: readonly string[];
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

export const Select: React.FC<SelectProps> = ({ label, options, initialValue }): React.ReactElement => {
  const [value, setValue] = React.useState<string>(initialValue);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    setValue(event.target.value);
  };

  return (
    <label>
      {label}
      <select value={value} onChange={handleChange}>
        {options.map((option: string): React.ReactElement => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <span> Selected: {value}</span>
    </label>
  );
};

export const RequiredSelect: React.FC<RequiredSelectProps> = ({ label, options }): React.ReactElement => {
  const [value, setValue] = React.useState<string>("");

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    setValue(event.target.value);
  };

  return (
    <label>
      {label}
      <select required value={value} onChange={handleChange}>
        <option value="" disabled>
          Select a role
        </option>

        {options.map((option: string): React.ReactElement => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
};

export const MultipleSelect: React.FC<MultipleSelectProps> = ({
  label,
  options,
  initialValues,
}): React.ReactElement => {
  const [values, setValues] = React.useState<readonly string[]>(initialValues);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    const nextValues: string[] = Array.from(
      event.target.selectedOptions,
      (option: HTMLOptionElement): string => option.value,
    );

    setValues(nextValues);
  };

  return (
    <div>
      <label>
        {label}
        <select multiple value={values} onChange={handleChange}>
          {options.map((option: string): React.ReactElement => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>

      <p>Selected: {values.length > 0 ? values.join(", ") : "(none)"}</p>
    </div>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const MainContainer: React.FC = (): React.ReactElement => {
  const roleOptions: readonly string[] = ["Developer", "Designer", "Manager"];

  const technologyOptions: readonly string[] = ["TypeScript", "React", "Node.js", "PostgreSQL"];

  return (
    <main>
      <h1>React Select</h1>

      <h2>1. Controlled Select</h2>
      <Select label="Role" options={roleOptions} initialValue="Developer" />

      <h2>2. Required Select with a Placeholder</h2>
      <RequiredSelect label="Choose a role" options={roleOptions} />

      <h2>3. Multiple Select</h2>
      <MultipleSelect label="Technologies" options={technologyOptions} initialValues={["TypeScript", "React"]} />
    </main>
  );
};

export default MainContainer;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - A controlled `<select>` uses `value` and `onChange` to synchronize selection with React state.
// - `ChangeEvent<HTMLSelectElement>` is the appropriate event type for a select change handler.
// - `event.target.value` contains the value of the currently selected option as a string.
// - A required select can use an empty-string placeholder to represent an unselected state.
// - A multiple select uses an array of selected values rather than a single string.
// - `event.target.selectedOptions` provides the currently selected option elements.
// - `Array.from()` can convert the selected option collection into a typed string array.
// - The `value` of an `<option>` is represented as a string by the DOM.
