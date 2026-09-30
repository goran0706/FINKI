/**
 * JSX Properties
 * ==============
 *
 * Component properties (props) bridge parent and child components, enabling configuration data
 * and callbacks to flow downward through the tree. Every custom attribute passed to a component
 * tag becomes a key-value pair bundled inside the component's single `props` argument object.
 * ES6 variable naming shorthand allows passing properties concisely when variable names match
 * prop names.
 *
 * Content nested between opening and closing tags is automatically forwarded as a special `children`
 * prop. Component properties can be marked optional in TypeScript interfaces and assigned default
 * fallback values using ES6 parameter syntax. Object properties can also be forwarded wholesale
 * using the spread operator (`{...props}`). Finally, all received properties maintain a strict
 * read-only contract, ensuring they remain immutable and are never modified directly within the child.
 */

import React from "react";

// ---------------------------------------------------------------------
// 1. Basic Component Property Passing and Destructuring
// ---------------------------------------------------------------------

interface CardProps {
  readonly title: string;
  readonly subtitle?: string;
  readonly isActive: boolean;
}

function Card({ title, subtitle = "Default Subtitle", isActive }: CardProps) {
  return (
    <div className={`card ${isActive ? "active" : ""}`}>
      <h3>{title}</h3>
      {subtitle && <p>{subtitle}</p>}
    </div>
  );
}

// ---------------------------------------------------------------------
// 2. Children as an Implicit Component Property
// ---------------------------------------------------------------------

interface ContainerProps {
  readonly heading: string;
  readonly children?: React.ReactNode;
}

function PanelContainer({ heading, children }: ContainerProps) {
  return (
    <section className="panel-container">
      <h2>{heading}</h2>
      <div className="panel-content">{children}</div>
    </section>
  );
}

// ---------------------------------------------------------------------
// 3. Property Forwarding via Spread Operations
// ---------------------------------------------------------------------

interface WrapperProps {
  readonly label: string;
  readonly onClick: () => void;
  readonly disabled?: boolean;
}

function ActionButton(props: WrapperProps) {
  return <button {...props}>{props.label}</button>;
}

// ---------------------------------------------------------------------
// 4. Parent Component Demonstrating Property Usage
// ---------------------------------------------------------------------

function JsxPropertiesDemoContainer() {
  const handleActionClick = () => {
    console.log("Action button triggered");
  };

  return (
    <div>
      <h1>JSX Properties Demonstration</h1>

      <Card title="System Architecture" isActive={true} />

      <PanelContainer heading="Config Section">
        <p>This paragraph is passed implicitly as the children prop.</p>
      </PanelContainer>

      <ActionButton label="Execute Process" onClick={handleActionClick} disabled={false} />
    </div>
  );
}

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Custom attributes passed to JSX component tags are bundled into a single `props` object argument.
// - Content placed between opening and closing tags is passed automatically via the implicit `children` prop.
// - Optional properties are supported via TypeScript optional modifiers and ES6 default fallback parameters.
// - Property spreading (`{...props}`) allows convenient forwarding of configuration bundles to underlying elements.
// - Component props enforce strict unidirectional top-down data flow and absolute immutability within the child.
// - TypeScript interfaces provide rigorous compile-time type validation for all component property contracts.
// - Clear property naming conventions enhance component reusability and self-documenting code structures.
