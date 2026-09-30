/**
 * JSX Expressions
 * ===============
 *
 * JSX expressions allow embedding any valid JavaScript expression directly inside markup by wrapping it
 * in curly braces `{}`, seamlessly bridging the gap between static templates and dynamic runtime data.
 *
 * Enclosing code in curly braces instructs the compiler to evaluate the JavaScript expression and render
 * its resulting value into the tree. Any valid JavaScript expression—including variables, arithmetic
 * operations, string concatenations, function invocations, and method calls—is fully supported inside braces.
 * Conditional rendering can be performed cleanly using JavaScript ternary operators and logical short-circuiting,
 * while arrays of data are dynamically transformed into lists of JSX elements using array mapping methods.
 * Plain JavaScript objects cannot be rendered directly as children and will trigger a runtime error if passed
 * into a JSX expression block, whereas TypeScript verifies that expression outputs conform to valid node types.
 */

import React from "react";

// ---------------------------------------------------------------------
// 1. Primitive and Variable Interpolation
// ---------------------------------------------------------------------

const userName = "John";
const userAge = 28;

const userProfileMarkup = (
  <div>
    User: {userName}, Age: {userAge}
  </div>
);

// ---------------------------------------------------------------------
// 2. Function Invocations and Method Calls
// ---------------------------------------------------------------------

const formatHeaderTitle = (text: string): string => text.toUpperCase();

const formattedHeaderMarkup = <h1>{formatHeaderTitle("system architecture")}</h1>;

// ---------------------------------------------------------------------
// 3. Mathematical and Logical Expressions
// ---------------------------------------------------------------------

const itemCount = 4;
const unitPrice = 25.0;
const isSessionActive = true;

const arithmeticMarkup = <p>Total Cost: {itemCount * unitPrice}</p>;
const ternaryMarkup = <div>{isSessionActive ? "Dashboard Active" : "Authentication Required"}</div>;
const logicalMarkup = <div>{isSessionActive && <span>Secure Token Verified</span>}</div>;

// ---------------------------------------------------------------------
// 4. Array Mapping and Dynamic Element Generation
// ---------------------------------------------------------------------

const renderedList = (
  <ul>
    {["Alpha", "Beta", "Gamma"].map((item, index) => (
      <li key={index}>{item}</li>
    ))}
  </ul>
);

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Curly braces `{}` enable embedding any valid JavaScript expression directly inside JSX markup.
// - Supports primitives, variables, arithmetic operations, string manipulations, and function return values.
// - Conditional rendering is achieved seamlessly using ternary operators and logical short-circuit operators.
// - Arrays of primitives or elements can be dynamically transformed and rendered using `.map()`.
// - Plain JavaScript objects are invalid renderable children and will trigger runtime errors if passed directly.
// - TypeScript enforces strict type checking on expression outputs to ensure compatibility with React nodes.
// - Expression evaluation occurs within the parent component's execution context during every render cycle.
