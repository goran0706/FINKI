/**
 * Keyed Fragments
 * ===============
 *
 * React fragments group multiple child elements without injecting extraneous wrapper DOM nodes.
 * While the shorthand `<>...</>` syntax works for basic unkeyed groupings, it cannot accept attributes.
 *
 * When mapping dynamic collections that require returning multiple top-level sibling elements per iteration,
 * explicit `<React.Fragment key={...}>` syntax is required. This preserves valid HTML semantics while
 * supplying the reconciliation engine with stable keys.
 */

import React from "react";

// ---------------------------------------------------------------------
// 1. Interface Definitions
// ---------------------------------------------------------------------

export interface TermDefinition {
  readonly id: string;
  readonly term: string;
  readonly definition: string;
}

export interface MultiElementItem {
  readonly id: string;
  readonly title: string;
  readonly detail: string;
}

export interface KeyedFragmentListProps {
  readonly items: ReadonlyArray<MultiElementItem>;
}

export interface KeyedDescriptionListProps {
  readonly terms: ReadonlyArray<TermDefinition>;
}

// ---------------------------------------------------------------------
// 2. Component Implementations
// ---------------------------------------------------------------------

export const KeyedFragmentList: React.FC<KeyedFragmentListProps> = (props) => {
  const { items } = props;

  return (
    <div>
      {items.map((item: MultiElementItem) => (
        <React.Fragment key={item.id}>
          <p>Title: {item.title}</p>
          <p>Detail: {item.detail}</p>
        </React.Fragment>
      ))}
    </div>
  );
};

export const KeyedDescriptionList: React.FC<KeyedDescriptionListProps> = (props) => {
  const { terms } = props;

  return (
    <dl>
      {terms.map((term: TermDefinition) => (
        <React.Fragment key={term.id}>
          <dt>{term.term}</dt>
          <dd>{term.definition}</dd>
        </React.Fragment>
      ))}
    </dl>
  );
};

// ---------------------------------------------------------------------
// 3. Main Container Component
// ---------------------------------------------------------------------

export const KeyedFragmentsContainer: React.FC = () => {
  const items: ReadonlyArray<MultiElementItem> = [
    {
      id: "item-1",
      title: "Fragment Alpha",
      detail: "First detailed section",
    },
    {
      id: "item-2",
      title: "Fragment Beta",
      detail: "Second detailed section",
    },
  ];

  const terms: ReadonlyArray<TermDefinition> = [
    {
      id: "term-1",
      term: "JSX",
      definition: "JavaScript Syntax Extension",
    },
    {
      id: "term-2",
      term: "Reconciliation",
      definition: "Virtual DOM diffing process",
    },
  ];

  return (
    <div>
      <h1>Keyed Fragments</h1>

      <h2>1. Multiple Sibling Elements Per Iteration</h2>
      <KeyedFragmentList items={items} />

      <h2>2. Semantic HTML Definition List</h2>
      <KeyedDescriptionList terms={terms} />
    </div>
  );
};

export default KeyedFragmentsContainer;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Shorthand Restriction: Shorthand `<>...</>` syntax cannot receive attributes like `key`.
// - Explicit Syntax: `<React.Fragment key={...}>` is required when keying fragment containers in loops.
// - Semantic HTML Integrity: Avoids adding unnecessary wrapper `<div>` nodes that break semantic layouts like `<dl>`.
// - Sibling Grouping: Allows returning adjacent sibling DOM nodes per mapped iteration step cleanly.
// - Single-Line Destructuring: Enforces single-property line breaks during prop destructuring inside bodies.
