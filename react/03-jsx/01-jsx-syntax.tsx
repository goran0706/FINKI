/**
 * JSX Syntax & Compilation Foundations
 * ====================================
 *
 * JSX (JavaScript XML) is a syntax extension to JavaScript that allows writing HTML-like
 * markup directly within JavaScript or TypeScript files. It provides a readable, declarative
 * syntax for describing component trees before compilation.
 *
 * JSX serves as a declarative syntax extension that allows developers to write HTML-like markup directly
 * within JavaScript or TypeScript files. At compile time, every JSX expression transforms into standard
 * JavaScript function calls, specifically `React.createElement`.
 *
 * Paradigms: Imperative vs. Declarative Programming:
 * - Imperative Programming: Focuses on *how* things happen. Developers write explicit step-by-step
 *   instructions telling the browser precisely what state changes and DOM mutations to execute
 *   (e.g., using native APIs like `document.createElement` and `element.appendChild`).
 * - Declarative Programming: Focuses on *what* should happen. Developers describe the desired target
 *   UI state or structure, and the underlying framework (like React) handles the complex underlying
 *   DOM synchronization and node rendering automatically.
 *
 * To understand how rendering paradigms differ, imperative programming focuses on explicit step-by-step
 * instructions telling the browser precisely what state changes and DOM mutations to execute (using native APIs
 * like `document.createElement`). Conversely, declarative programming focuses on defining the desired target UI
 * state, allowing the framework to handle underlying DOM synchronization automatically.
 *
 * At compile time, every declarative JSX expression transforms into standard JavaScript function calls,
 * specifically `React.createElement`, bridging the gap between component templates and runtime execution.
 *
 * Fundamentally, React elements are plain JavaScript objects rather than actual DOM nodes. When you write a JSX
 * expression, the compiler translates it into an immutable description object containing properties such as `type`,
 * `props`, `key`, and `ref`. React reads these objects and uses them to construct and synchronize the real DOM.
 */

import React from "react";

// ---------------------------------------------------------------------
// 1. Evolution from Vanilla DOM (Imperative) to JSX (Declarative)
// ---------------------------------------------------------------------

// Imperative vanilla DOM creation pattern: manual step-by-step browser instructions
// const root = document.createElement("div");
// root.setAttribute("id", "root");

// Declarative React.createElement approach (without JSX syntax):
const pureElementExample = React.createElement("div", { className: "app-container" }, [
  React.createElement("h1", null, "React Application"),
  React.createElement("p", null, "Created using pure createElement calls"),
]);

// Modern JSX syntax equivalent (transpiled by Babel or modern runtime transforms):
const jsxElementExample = (
  <div className="app-container">
    <h1>React Application</h1>
    <p>Created using declarative JSX syntax</p>
  </div>
);

// ---------------------------------------------------------------------
// 2. React Elements as Plain JavaScript Objects
// ---------------------------------------------------------------------

// Demonstrating the underlying structure of a React element object.
// When JSX compiles, it evaluates to a plain JavaScript object description rather than a DOM element.
const rawReactElementDescription = {
  type: "div",
  props: {
    className: "panel",
    children: "Underlying JS Object Representation",
  },
  key: null,
  ref: null,
};

// ---------------------------------------------------------------------
// 3. JSX Interpolation and Prop Spreading
// ---------------------------------------------------------------------

const dynamicClassName = "container-active";
const dynamicContent = "Interpolated Dynamic Content";

// Interpolation injects variables and expressions directly into attributes and children
const interpolatedElement = <div className={dynamicClassName}>{dynamicContent}</div>;

// Prop spreading allows passing an entire pre-aggregated attributes object dynamically
const spreadAttributes = {
  className: "spread-container",
  title: "Tooltip Text",
};
const spreadElement = <div {...spreadAttributes}>Spreading properties object</div>;

// ---------------------------------------------------------------------
// 4. Single Root Rule & Fragment Encapsulation Variations
// ---------------------------------------------------------------------

// Shorthand fragment wrapper satisfying the single root rule without DOM node bloat
const shorthandFragmentContainer = (
  <>
    <h1>Primary Heading</h1>
    <p>Secondary description text</p>
  </>
);

// Explicit fragment wrapper providing identical rendering behavior
const explicitFragmentContainer = (
  <React.Fragment>
    <h1>Primary Heading</h1>
    <p>Secondary description text</p>
  </React.Fragment>
);

// ---------------------------------------------------------------------
// 5. Basic Functional Component with JSX
// ---------------------------------------------------------------------

interface RenderNoticeProps {
  readonly headline: string;
  readonly bodyText: string;
}

function RenderNotice(props: RenderNoticeProps) {
  const { headline, bodyText } = props;

  return (
    <React.Fragment>
      <h2>{headline}</h2>
      <p>{bodyText}</p>
    </React.Fragment>
  );
}

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - JSX is a syntax extension to JavaScript that allows writing HTML-like markup directly within JavaScript or TypeScript files.
// - It provides a readable, declarative syntax for describing component trees before compilation.
// - Imperative programming focuses on explicit step-by-step instructions (how), whereas declarative programming focuses on target states (what).
// - React components and elements compile down to plain immutable JavaScript objects that describe the UI tree.
// - Every JSX expression transforms into underlying JavaScript function calls, typically `React.createElement` or modern runtime equivalents.
// - Interpolation via curly braces `{}` allows embedding dynamic variables and expressions directly into attributes and children.
// - Prop spreading (`{...props}`) enables efficient transmission of pre-aggregated property objects to elements and components.
// - Fragments (`<>...</>`) allow grouping sibling elements without rendering unnecessary wrapper nodes into the DOM.
