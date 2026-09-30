/**
 * Form Labels
 * ============
 *
 * Form labels associate human-readable text with form controls and provide an accessible name
 * that assistive technologies can expose to users. A label can be associated explicitly by using
 * the label's `htmlFor` prop with an input `id`, or implicitly by placing the control inside the
 * `<label>` element. Explicit association is generally easier to maintain because the relationship
 * between the label and control is visible directly in the markup.
 *
 * React uses `htmlFor` rather than the HTML `for` attribute because `for` is a JavaScript keyword.
 * The value of `htmlFor` must exactly match the associated control's `id`. Clicking an associated
 * label activates or focuses its control, and assistive technologies can use the association to
 * determine the control's accessible name.
 *
 * A label should describe a specific form control rather than being used as generic instructional
 * text. When multiple controls form one logical group, `<fieldset>` and `<legend>` provide the
 * semantic group label, while individual `<label>` elements identify the controls within that group.
 */

import React from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface ExplicitLabelProps {
  readonly inputId: string;
  readonly label: string;
  readonly defaultValue: string;
}

export interface WrappedLabelProps {
  readonly label: string;
  readonly defaultValue: string;
}

export interface CheckboxLabelProps {
  readonly inputId: string;
  readonly label: string;
  readonly initialChecked: boolean;
}

export interface RadioGroupProps {
  readonly name: string;
  readonly legend: string;
  readonly options: readonly string[];
  readonly initialValue: string;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

export const ExplicitLabel: React.FC<ExplicitLabelProps> = ({ inputId, label, defaultValue }): React.ReactElement => {
  return (
    <div>
      <label htmlFor={inputId}>{label}</label>
      <input id={inputId} type="text" defaultValue={defaultValue} />
    </div>
  );
};

export const WrappedLabel: React.FC<WrappedLabelProps> = ({ label, defaultValue }): React.ReactElement => {
  return (
    <label>
      {label}
      <input type="text" defaultValue={defaultValue} />
    </label>
  );
};

export const CheckboxLabel: React.FC<CheckboxLabelProps> = ({ inputId, label, initialChecked }): React.ReactElement => {
  const [checked, setChecked] = React.useState<boolean>(initialChecked);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setChecked(event.target.checked);
  };

  return (
    <div>
      <input id={inputId} type="checkbox" checked={checked} onChange={handleChange} />
      <label htmlFor={inputId}>{label}</label>
      <span> {checked ? "Selected" : "Not selected"}</span>
    </div>
  );
};

export const RadioGroup: React.FC<RadioGroupProps> = ({ name, legend, options, initialValue }): React.ReactElement => {
  const [value, setValue] = React.useState<string>(initialValue);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setValue(event.target.value);
  };

  return (
    <fieldset>
      <legend>{legend}</legend>

      {options.map((option: string): React.ReactElement => {
        const inputId: string = `${name}-${option.toLowerCase()}`;

        return (
          <div key={option}>
            <input
              id={inputId}
              type="radio"
              name={name}
              value={option}
              checked={value === option}
              onChange={handleChange}
            />
            <label htmlFor={inputId}>{option}</label>
          </div>
        );
      })}
    </fieldset>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const MainContainer: React.FC = (): React.ReactElement => {
  const roleOptions: readonly string[] = ["Developer", "Designer", "Manager"];

  return (
    <main>
      <h1>Form Labels</h1>

      <h2>1. Explicit Label Association</h2>
      <ExplicitLabel inputId="username" label="Username" defaultValue="John Doe" />

      <h2>2. Implicit Label Association</h2>
      <WrappedLabel label="Email address" defaultValue="john@example.com" />

      <h2>3. Label Association with a Checkbox</h2>
      <CheckboxLabel inputId="notifications" label="Receive notifications" initialChecked={false} />

      <h2>4. Group Labeling with Fieldset and Legend</h2>
      <RadioGroup name="role" legend="Select a role" options={roleOptions} initialValue="Developer" />
    </main>
  );
};

export default MainContainer;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - `htmlFor` explicitly associates a `<label>` with a form control through its `id`.
// - The value of `htmlFor` must exactly match the associated control's `id`.
// - React uses `htmlFor` instead of the HTML `for` attribute.
// - A control can also be implicitly associated by placing it inside its `<label>`.
// - Clicking an associated label focuses or activates its form control.
// - Labels provide the accessible name of the controls they describe.
// - `<fieldset>` and `<legend>` semantically label groups of related form controls.
// - Individual controls within a group still require their own `<label>` elements.
