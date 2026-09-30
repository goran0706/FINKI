/**
 * Union Props
 * ===========
 *
 * Union type props allow a single component property to accept multiple distinct types or literal
 * choices, enabling flexible, polymorphic component APIs without sacrificing compile-time safety.
 *
 * Union types support multi-type primitives (like numbers or strings) and scalar-versus-collection
 * polymorphism. Component logic uses runtime type guards to narrow types safely, while literal union
 * choices standardize visual styling and layout options.
 */

import React, { useState } from "react";

// ---------------------------------------------------------------------
// 1. Union Props Interface Definitions
// ---------------------------------------------------------------------

export type DimensionValue = string | number;
export type ContentPayload = string | ReadonlyArray<string>;
export type TextAlignment = "left" | "center" | "right";

export interface FlexibleBoxProps {
  readonly width: DimensionValue;
  readonly height: DimensionValue;
  readonly content: ContentPayload;
  readonly alignment: TextAlignment;
}

// ---------------------------------------------------------------------
// 2. Component Implementing Union Type Props
// ---------------------------------------------------------------------

export const FlexibleBox: React.FC<FlexibleBoxProps> = (props) => {
  const { width, height, content, alignment } = props;

  // Type narrowing and transformation for union types
  const resolvedWidth = typeof width === "number" ? `${width}px` : width;
  const resolvedHeight = typeof height === "number" ? `${height}px` : height;

  const renderContent = (): React.ReactNode => {
    if (Array.isArray(content)) {
      return (
        <ul>
          {content.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      );
    }
    return <p>{content}</p>;
  };

  return (
    <div
      style={{
        width: resolvedWidth,
        height: resolvedHeight,
        textAlign: alignment,
        border: "1px solid #ccc",
        padding: "16px",
      }}
    >
      {renderContent()}
    </div>
  );
};

// ---------------------------------------------------------------------
// 3. Parent Container Demonstrating Union Prop Variations
// ---------------------------------------------------------------------

export const FlexibleBoxContainer: React.FC = () => {
  const [useArrayContent, setUseArrayContent] = useState<boolean>(false);

  const currentContent: ContentPayload = useArrayContent
    ? ["First Item", "Second Item", "Third Item"]
    : "This is a single scalar string payload.";

  return (
    <div>
      <h1>Union Props Architecture Demonstration</h1>
      <p>Demonstrating multi-type primitives and scalar-versus-array polymorphism.</p>

      <button type="button" onClick={() => setUseArrayContent((prev) => !prev)}>
        Toggle Content Type ({useArrayContent ? "Array" : "Scalar String"})
      </button>

      <hr />

      {/* Passing numeric dimensions and scalar/array union content */}
      <FlexibleBox width={300} height="150px" content={currentContent} alignment="center" />
    </div>
  );
};

export default FlexibleBoxContainer;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Multi-Primitive Polymorphism: Union types (`string | number`) enable props to accept flexible input formats, such as numeric pixels or percentage strings.
// - Scalar and Collection Flexibility: Properties can accept either single items or array collections using union types.
// - Built-In Type Guards: Render logic successfully narrows union types at runtime using standard checks like `typeof` and `Array.isArray()`.
// - Literal String Restrictions: Union literal types constrain styling and layout parameters to safe, pre-approved choices.
// - Compile-Time Enforcement: TypeScript verifies that callers only supply values matching one of the permitted types defined in the contract.
