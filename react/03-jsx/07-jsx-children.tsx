/**
 * JSX Children
 * ============
 *
 * JSX children represent inner content nested between opening and closing tags, serving as a powerful
 * composition mechanism for flexible, reusable layouts. Any nested content is automatically passed
 * as a special `children` prop, which can take diverse forms including primitive values, nested elements,
 * arrays, booleans, null/undefined, or render functions.
 *
 * Structural evaluation passes a single child directly or multiple children as an array. Container
 * components leverage these mechanisms for compound layouts, while `React.Children` utilities safely inspect,
 * count, map, and iterate over opaque child collections without array assumption bugs. TypeScript enforces
 * these safety contracts using `React.ReactNode` or `React.ReactElement`.
 */

import React from "react";

// ---------------------------------------------------------------------
// 1. Component Receiving Primitive and Element Children
// ---------------------------------------------------------------------

interface WrapperBoxProps {
  readonly title: string;
  readonly children: React.ReactNode;
}

export function WrapperBox({ title, children }: WrapperBoxProps) {
  return (
    <div className="wrapper-box">
      <h3>{title}</h3>
      <div className="box-body">{children}</div>
    </div>
  );
}

// ---------------------------------------------------------------------
// 2. Component Demonstrating All React.Children Utilities
// ---------------------------------------------------------------------

interface AdvancedListContainerProps {
  readonly children: React.ReactNode;
}

export function AdvancedListContainer({ children }: AdvancedListContainerProps) {
  // 1. React.Children.count: Safely counts total children, handling nulls/booleans
  const childCount = React.Children.count(children);

  // 2. React.Children.only: Verifies that children contains exactly one element and returns it
  const singleChild = React.Children.only(children);

  // 3. React.Children.forEach: Iterates over children without allocating/returning a new array
  React.Children.forEach(children, (child: { type: any }) => {
    if (React.isValidElement(child)) {
      // Inspecting individual child props or types imperatively
      console.log("Inspected child element type:", child.type);
    }
  });

  return (
    <div className="list-container">
      <span className="badge">Total Validated Items: {childCount}</span>
      <ul>
        {/* 4. React.Children.map: Transforms opaque child collections safely */}
        {React.Children.map(children, (child: any, index: any) => (
          <li key={index} className="list-item-wrapper">
            {child}
          </li>
        ))}
      </ul>
      {/* 5. React.Children.toArray: Flattens and stabilizes child collections into a standard array */}
      <div className="debug-summary">Array representation length: {React.Children.toArray(children).length}</div>
    </div>
  );
}

// ---------------------------------------------------------------------
// 3. Parent Container Demonstrating Child Composition
// ---------------------------------------------------------------------

export function JsxChildrenDemoContainer() {
  return (
    <div>
      <h1>JSX Children Architecture Demonstration</h1>

      <WrapperBox title="Composition Panel">
        <p>This paragraph is an element child passed into the wrapper.</p>
        <span>Inline tracking element</span>
      </WrapperBox>

      <AdvancedListContainer>
        <span>First Row Item</span>
        <span>Second Row Item</span>
        <span>Third Row Item</span>
      </AdvancedListContainer>
    </div>
  );
}

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Content placed between JSX tags is automatically passed to the component as the `children` prop.
// - Children can take diverse forms including strings, numbers, elements, arrays, null, or functions.
// - Single children pass as standalone nodes, whereas multiple children pass as a node collection.
// - Children power compound component and layout wrapper architectures without hardcoded inner UI structures.
// - `React.ReactNode` types general component children, while `React.ReactElement` restricts nodes to JSX elements.
// - `React.Children.map` transforms and maps opaque child collections safely.
// - `React.Children.forEach` iterates through child collections without creating new arrays.
// - `React.Children.count` computes the exact count of nodes while handling null and boolean omissions correctly.
// - `React.Children.only` enforces constraints requiring precisely one single child element.
// - `React.Children.toArray` flattens and converts opaque node collections into standard JavaScript arrays.
