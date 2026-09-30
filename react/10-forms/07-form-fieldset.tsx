/**
 * Form Fieldset
 * =============
 *
 * The HTML `<fieldset>` element groups related form controls into a semantic unit. Its `<legend>`
 * provides a caption for that group and is exposed by browsers and assistive technologies as the
 * group's name. React renders `<fieldset>` and `<legend>` as native HTML elements, so their
 * semantic behavior is provided by the browser rather than by React itself.
 *
 * A fieldset can be disabled with the `disabled` prop. When disabled, descendant form controls are
 * generally disabled by the browser and cannot be interacted with or submitted as successful form
 * controls. The `<legend>` is a special descendant: browsers keep the legend itself interactive
 * even when its containing fieldset is disabled.
 *
 * Fieldsets are useful when several controls represent one logical group, such as contact details,
 * account preferences, or a set of related radio buttons. They should describe an actual semantic
 * relationship between controls rather than being used merely as a visual layout container.
 */

import React from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface FieldsetProps {
  readonly legend: string;
  readonly children: React.ReactNode;
}

export interface DisabledFieldsetProps {
  readonly legend: string;
  readonly disabled: boolean;
}

export interface RadioFieldsetProps {
  readonly legend: string;
  readonly name: string;
  readonly options: readonly string[];
  readonly initialValue: string;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

export const Fieldset: React.FC<FieldsetProps> = ({ legend, children }): React.ReactElement => {
  return (
    <fieldset>
      <legend>{legend}</legend>
      {children}
    </fieldset>
  );
};

export const DisabledFieldset: React.FC<DisabledFieldsetProps> = ({ legend, disabled }): React.ReactElement => {
  return (
    <fieldset disabled={disabled}>
      <legend>{legend}</legend>

      <label>
        Username
        <input type="text" defaultValue="John Doe" />
      </label>

      <label>
        Email
        <input type="email" defaultValue="john@example.com" />
      </label>

      <button type="button">Save changes</button>
    </fieldset>
  );
};

export const RadioFieldset: React.FC<RadioFieldsetProps> = ({
  legend,
  name,
  options,
  initialValue,
}): React.ReactElement => {
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

      <p>Selected: {value}</p>
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
      <h1>Form Fieldset</h1>

      <h2>1. Grouping Related Controls</h2>
      <Fieldset legend="Contact information">
        <label>
          Full name
          <input type="text" defaultValue="John Doe" />
        </label>

        <label>
          Email
          <input type="email" defaultValue="john@example.com" />
        </label>
      </Fieldset>

      <h2>2. Disabling a Fieldset</h2>
      <DisabledFieldset legend="Account settings" disabled={true} />

      <h2>3. Grouping Radio Buttons</h2>
      <RadioFieldset legend="Select a role" name="role" options={roleOptions} initialValue="Developer" />
    </main>
  );
};

export default MainContainer;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - `<fieldset>` semantically groups related form controls.
// - `<legend>` provides the accessible name and visible caption for a fieldset.
// - A fieldset should represent a meaningful relationship between its descendant controls.
// - The `disabled` attribute disables descendant form controls through native browser behavior.
// - A disabled fieldset's `<legend>` is a special descendant that remains interactive.
// - Radio buttons that represent one choice should share the same `name` attribute.
// - Each individual form control should still have an associated `<label>`.
// - `<fieldset>` should not be used solely as a generic visual layout container.
