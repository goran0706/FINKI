/**
 * JSX Fragments
 * =============
 *
 * JSX fragments provide a mechanism to group multiple sibling elements without introducing unnecessary
 * wrapper nodes into the final rendered DOM structure. They satisfy the strict requirement that a JSX
 * expression must have a single root container while preventing DOM tree bloat and preserving strict
 * CSS layouts like Grid or Flexbox parent-child relationships.
 *
 * The short syntax (`<>...</>`) offers clean conciseness, whereas the explicit long syntax
 * (`<React.Fragment>...</React.Fragment>`) is required when passing attributes like keys for efficient list
 * reconciliation. Reducing redundant nodes optimizes memory footprint, speeds up virtual DOM reconciliation,
 * and integrates natively with TypeScript for robust type safety.
 */

import React from "react";

// ---------------------------------------------------------------------
// 1. Short Syntax Fragment Component
// ---------------------------------------------------------------------

export function TableColumns() {
  return (
    <>
      <td>Identifier</td>
      <td>Description</td>
      <td>Status</td>
    </>
  );
}

// ---------------------------------------------------------------------
// 2. Explicit Fragment with Key Property Component
// ---------------------------------------------------------------------

interface ItemListProps {
  readonly items: ReadonlyArray<{
    readonly id: string;
    readonly text: string;
  }>;
}

export function KeyedFragmentList({ items }: ItemListProps) {
  return (
    <ul>
      {items.map((item) => (
        <React.Fragment key={item.id}>
          <li>{item.text}</li>
          <li className="separator" />
        </React.Fragment>
      ))}
    </ul>
  );
}

// ---------------------------------------------------------------------
// 3. Parent Container Component Demonstrating Fragment Layouts
// ---------------------------------------------------------------------

export function JsxFragmentsDemoContainer() {
  const sampleItems = [
    { id: "1", text: "Alpha Module" },
    { id: "2", text: "Beta Module" },
  ];

  return (
    <div>
      <h1>JSX Fragments Architecture Demonstration</h1>

      <table>
        <tbody>
          <tr>
            <TableColumns />
          </tr>
        </tbody>
      </table>

      <KeyedFragmentList items={sampleItems} />
    </div>
  );
}

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - JSX fragments group multiple sibling elements without injecting extra DOM nodes.
// - Solves the single root rule constraint cleanly without altering structural layouts.
// - Short syntax (`<>...</>`) provides conciseness, while long syntax (`<React.Fragment>`) supports props like `key`.
// - Prevents CSS layout distortions caused by redundant wrapper divs in Flexbox and Grid containers.
// - Reduces total DOM node count, improving memory usage and reconciliation efficiency.
// - TypeScript natively supports fragment nodes, preserving strict component output validation.
// - Explicit keyed fragments allow efficient list rendering without forcing parent wrappers.
