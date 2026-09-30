/**
 * Form Legend
 * ============
 *
 * The HTML `<legend>` element provides a caption for a `<fieldset>` and gives the group of
 * controls a semantic name. React renders `<legend>` as the native HTML element, so its
 * accessibility behavior is determined by the browser and accessibility tree rather than
 * by a React-specific API.
 *
 * A `<legend>` must be a child of the `<fieldset>` it describes. Its text identifies the
 * purpose of the grouped controls, while individual `<label>` elements identify the controls
 * inside that group. A fieldset can contain only one meaningful legend; additional descriptive
 * content should use ordinary elements such as `<p>` when it is not intended to name the group.
 *
 * The legend can contain phrasing content rather than plain text, which allows elements such
 * as `<span>` to provide additional presentation or status information. The legend should still
 * remain concise and describe the semantic purpose of the fieldset.
 */

import React from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface BasicLegendProps {
  readonly legend: string;
}

export interface DescriptiveLegendProps {
  readonly legend: string;
  readonly description: string;
}

export interface DynamicLegendProps {
  readonly initialValue: string;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

export const BasicLegend: React.FC<BasicLegendProps> = ({ legend }): React.ReactElement => {
  return (
    <fieldset>
      <legend>{legend}</legend>

      <label>
        Full name
        <input type="text" defaultValue="John Doe" />
      </label>

      <label>
        Email
        <input type="email" defaultValue="john@example.com" />
      </label>
    </fieldset>
  );
};

export const DescriptiveLegend: React.FC<DescriptiveLegendProps> = ({ legend, description }): React.ReactElement => {
  return (
    <fieldset>
      <legend>
        <span>{legend}</span>
      </legend>

      <p>{description}</p>

      <label>
        Username
        <input type="text" defaultValue="john.doe" />
      </label>
    </fieldset>
  );
};

export const DynamicLegend: React.FC<DynamicLegendProps> = ({ initialValue }): React.ReactElement => {
  const [selectedValue, setSelectedValue] = React.useState<string>(initialValue);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setSelectedValue(event.target.value);
  };

  return (
    <fieldset>
      <legend>Contact preference: {selectedValue}</legend>

      <label>
        <input
          type="radio"
          name="contact-preference"
          value="Email"
          checked={selectedValue === "Email"}
          onChange={handleChange}
        />
        Email
      </label>

      <label>
        <input
          type="radio"
          name="contact-preference"
          value="Phone"
          checked={selectedValue === "Phone"}
          onChange={handleChange}
        />
        Phone
      </label>
    </fieldset>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

const MainContainer: React.FC = (): React.ReactElement => {
  return (
    <main>
      <h1>Form Legend</h1>

      <h2>1. Naming a Form Group</h2>
      <BasicLegend legend="Contact information" />

      <h2>2. Combining a Legend with Additional Description</h2>
      <DescriptiveLegend legend="Account details" description="Enter the information associated with the account." />

      <h2>3. Dynamic Legend Content</h2>
      <DynamicLegend initialValue="Email" />
    </main>
  );
};

export default MainContainer;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - `<legend>` provides the semantic name and caption for a `<fieldset>`.
// - A `<legend>` must be a child of the `<fieldset>` it describes.
// - The legend identifies the purpose of the control group, while `<label>` identifies individual controls.
// - Additional descriptive text can be placed outside the `<legend>` when it does not name the group.
// - A legend can contain phrasing content such as `<span>` elements.
// - A dynamic legend can reflect React state while retaining its semantic relationship with the fieldset.
// - A fieldset should have one meaningful legend that identifies the purpose of its controls.
