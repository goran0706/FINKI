/**
 * JSX Elements
 * ============
 *
 * JSX elements represent the fundamental building blocks of React applications, acting as lightweight, immutable
 * JavaScript object descriptors that declare what the user interface should look like at any given application state.
 * Rather than directly instantiating heavy browser DOM nodes, every JSX tag compiles into a plain JavaScript object
 * containing structural properties such as type, props, and children.
 *
 * A critical distinction in React architecture lies between host elements and composite elements. Lowercase tags
 * represent native host elements corresponding directly to browser DOM nodes like divs or spans, whereas capitalized
 * tags represent composite user-defined components. React relies strictly on this capitalization rule during compilation
 * and runtime evaluation to distinguish between native host strings and custom component identifiers.
 *
 * Once created, a JSX element and its properties remain strictly immutable; state updates and re-renders cannot modify
 * existing element descriptors in place, but instead require generating an entirely new element description tree.
 * Furthermore, these elements can be nested recursively within one another to construct rich component hierarchies,
 * with compile-time type representation strongly managed via TypeScript interfaces like `JSX.Element` and `React.ReactElement`.
 */

import React from "react";

// ---------------------------------------------------------------------
// 1. Host Elements vs. Composite Elements
// ---------------------------------------------------------------------

const hostElement = <div className="container" />;

const CustomHeader = () => {
  return <h1>Header Title</h1>;
};

const componentElement = <CustomHeader />;

// ---------------------------------------------------------------------
// 2. Underlying Object Representation Concept
// ---------------------------------------------------------------------

const descriptionObject = <span id="text">Immutable Content</span>;

// Conceptual underlying structure of a JSX element object:
// {
//     type: "span",
//     props: { id: "text", children: "Immutable Content" },
//     key: null,
//     ref: null
// }

// ---------------------------------------------------------------------
// 3. Nested Element Hierarchies
// ---------------------------------------------------------------------

const nestedTree = (
  <section>
    <header>
      <h2>Section Title</h2>
    </header>
    <main>
      <p>Primary paragraph content.</p>
    </main>
  </section>
);

// ---------------------------------------------------------------------
// 4. Dynamic Component References via Capitalization
// ---------------------------------------------------------------------

const DynamicComponent = CustomHeader;
const dynamicInstance = <DynamicComponent />;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - JSX elements are lightweight JavaScript object descriptors of the UI.
// - Lowercase tags represent native host elements
// - Uppercase tags represent composite components.
// - Elements are strictly immutable after creation
// - Re-renders require generating fresh description trees.
// - Elements support deep, recursive nesting for complex layouts.
// - React uses the capitalization rule to distinguish host types from custom components.
// - TypeScript provides strong typing via `JSX.Element` and `React.ReactElement`.
