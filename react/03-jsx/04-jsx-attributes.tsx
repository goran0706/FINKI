/**
 * JSX Attributes
 * ==============
 *
 * JSX attributes provide configuration options and property values to elements and components,
 * serving as the interface between declarative templates and underlying DOM properties.
 * Unlike standard HTML where attributes are largely lowercase and accept raw strings, JSX attributes
 * follow camelCase naming conventions—such as `className` instead of `class`, `tabIndex` instead of
 * `tabindex`, and `htmlFor` instead of `for`—to align with standard JavaScript property naming rules.
 *
 * String literals can be passed directly using quotes, while non-string values like booleans,
 * numbers, objects, or functions must be enclosed inside curly braces as JavaScript expressions.
 * Omitting a value for a boolean attribute evaluates to true, mirroring traditional HTML behavior,
 * though explicit expression binding is preferred for dynamic control. Furthermore, entire objects
 * can be spread onto JSX elements using the spread operator to enable clean forwarding of property
 * sets. TypeScript validates attribute names and types against standard global JSX namespaces or
 * custom component prop interfaces at compile time, eliminating invalid attribute typos, while custom
 * data attributes (`data-*`) and accessibility features (`aria-*`) are fully supported for
 * extensibility and semantic metadata.
 */

import React from "react";

// ---------------------------------------------------------------------
// 1. CamelCase Attribute Conventions vs Standard HTML
// ---------------------------------------------------------------------

const standardAttributesElement = (
  <div className="panel-container" tabIndex={0}>
    <label htmlFor="username-input">Username</label>
    <input id="username-input" type="text" maxLength={30} />
  </div>
);

// ---------------------------------------------------------------------
// 2. String Literals vs. JavaScript Expression Bindings
// ---------------------------------------------------------------------

const isReadOnlyState = false;
const dynamicTabPosition = 1;

const mixedAttributesElement = (
  <textarea
    className="input-area"
    placeholder="Enter description..."
    readOnly={isReadOnlyState}
    tabIndex={dynamicTabPosition}
  />
);

// ---------------------------------------------------------------------
// 3. Boolean Shorthand vs. Explicit Expression Binding
// ---------------------------------------------------------------------

const isFeatureEnabled = true;

const shorthandBoolean = <button disabled>Submit</button>;
const explicitBoolean = <button disabled={!isFeatureEnabled}>Submit</button>;

// ---------------------------------------------------------------------
// 4. Spread Attributes Pattern
// ---------------------------------------------------------------------

interface ButtonConfigProps {
  readonly type: "button" | "submit";
  readonly onClick: () => void;
  readonly className: string;
}

const baseConfig: ButtonConfigProps = {
  type: "submit",
  onClick: () => console.log("Clicked"),
  className: "primary-btn",
};

const spreadAttributesElement = <button {...baseConfig}>Execute Action</button>;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - JSX attributes utilize camelCase naming conventions to match JavaScript DOM property standards.
// - String literals are passed using quotes, while non-string primitives, booleans, and objects require curly brace expression bindings.
// - Omitting a value for boolean attributes acts as a shorthand for true, while explicit bindings allow dynamic control.
// - The spread operator (`{...props}`) allows passing entire configuration objects directly as element attributes.
// - TypeScript provides comprehensive type validation for attribute names and value types at compile time.
// - Accessibility (`aria-*`) and custom metadata attributes (`data-*`) are fully supported out-of-the-box.
// - Proper attribute mapping bridges declarative markup semantics with imperative DOM properties seamlessly.
