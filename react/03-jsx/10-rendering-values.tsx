/**
 * Rendering Values
 * ================
 *
 * React's JSX rendering engine handles various JavaScript data types differently when embedded inside
 * expression blocks, defining strict rules for what can and cannot be output to the DOM. Strings and
 * numbers render directly as text nodes, whereas booleans (`true`/`false`), `null`, and `undefined`
 * evaluate to empty output, making them ideal for conditional short-circuit expressions.
 *
 * Furthermore, arrays of renderable nodes are automatically flattened and sequenced, while plain objects
 * or uninvoked functions throw runtime invariant errors if rendered directly as children. TypeScript
 * enforces these node type constraints at compile time to ensure architectural safety.
 */

import React from "react";

// ---------------------------------------------------------------------
// 1. Primitives (Strings and Numbers)
// ---------------------------------------------------------------------

const textValue = "Dynamic Text Content";
const numericValue = 42;

export function PrimitiveRendering() {
  return (
    <div>
      <p>String: {textValue}</p>
      <p>Number: {numericValue}</p>
    </div>
  );
}

// ---------------------------------------------------------------------
// 2. Ignored Types (Booleans, Null, Undefined)
// ---------------------------------------------------------------------

const showDetails = true;
const missingValue = null;
const undefinedValue = undefined;

export function IgnoredValuesRendering() {
  return (
    <div>
      {showDetails && <p>Details are visible.</p>}
      {missingValue}
      {undefinedValue}
      <p>Static footer text.</p>
    </div>
  );
}

// ---------------------------------------------------------------------
// 3. Array Flattening and Sequence Rendering
// ---------------------------------------------------------------------

const itemsArray = ["Alpha", "Beta", "Gamma"];

export function ArrayRendering() {
  return (
    <ul>
      {itemsArray.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  );
}

// ---------------------------------------------------------------------
// 4. Parent Container Component Demonstrating Value Rendering
// ---------------------------------------------------------------------

export function RenderingValuesDemoContainer() {
  return (
    <div>
      <h1>Rendering Values Architecture Demonstration</h1>
      <PrimitiveRendering />
      <IgnoredValuesRendering />
      <ArrayRendering />
    </div>
  );
}

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Strings and numbers render directly as text nodes in the final DOM structure.
// - Booleans, `null`, and `undefined` evaluate to empty results and render nothing, enabling short-circuit patterns.
// - Arrays of renderable elements or values are automatically flattened and rendered sequentially.
// - Plain JavaScript objects cannot be rendered as children and will trigger runtime errors if passed.
// - Functions cannot be rendered directly as text nodes without explicit invocation or pattern handling.
// - TypeScript enforces compile-time type restrictions on what data types can pass as JSX children.
// - Understanding rendering value rules prevents common invariant errors in React UI development.
