/**
 * ClassName
 * =========
 *
 * The `className` attribute in JSX specifies CSS class names for host DOM elements, mapping directly to
 * the underlying JavaScript `element.className` DOM property. JSX uses `className` instead of HTML `class`
 * to avoid reserved keyword collisions in the ECMAScript specification.
 *
 * Template literals enable seamless combination of static base classes with dynamic state variables.
 * Furthermore, design system components accept optional `className` props to merge internal default styles
 * with consumer-specified custom class overrides, while zero-dependency utility functions handle conditional
 * class joining cleanly under TypeScript type validation.
 */

import React from "react";

// ---------------------------------------------------------------------
// 1. Basic Static and Template Literal Class Binding
// ---------------------------------------------------------------------

export function StaticAndTemplateClassNames() {
  const isPrimary = true;
  const size = "large";

  const staticElement = <div className="panel-card shadow">Static Class Content</div>;

  const dynamicElement = (
    <div className={`btn ${isPrimary ? "btn-primary" : "btn-secondary"} btn-${size}`}>Dynamic Class Content</div>
  );

  return (
    <div>
      {staticElement}
      {dynamicElement}
    </div>
  );
}

// ---------------------------------------------------------------------
// 2. Class Merging Pattern for Component Props
// ---------------------------------------------------------------------

interface CustomCardProps {
  readonly className?: string;
  readonly title: string;
}

export function CustomCard({ className = "", title }: CustomCardProps) {
  const combinedClassName = `base-card-style padding-md ${className}`.trim();

  return (
    <div className={combinedClassName}>
      <h3>{title}</h3>
    </div>
  );
}

// ---------------------------------------------------------------------
// 3. Custom Class Name Joiner Utility (Zero-Dependency Pattern)
// ---------------------------------------------------------------------

type ClassValue = string | number | boolean | undefined | null;

export function classNames(...classes: ReadonlyArray<ClassValue>): string {
  return classes.filter(Boolean).join(" ");
}

interface StatusBadgeProps {
  readonly isActive: boolean;
  readonly isPending: boolean;
  readonly className?: string;
}

export function StatusBadge({ isActive, isPending, className }: StatusBadgeProps) {
  const computedClass = classNames("badge-base", isActive && "badge-active", isPending && "badge-pending", className);

  return <span className={computedClass}>Status Indicator</span>;
}

// ---------------------------------------------------------------------
// 4. Parent Container Component
// ---------------------------------------------------------------------

export function ClassNameDemoContainer() {
  return (
    <div>
      <h1>ClassName Architecture Demonstration</h1>
      <StaticAndTemplateClassNames />
      <CustomCard title="System Metrics" className="theme-dark border-highlight" />
      <StatusBadge isActive={true} isPending={false} className="shadow-sm" />
    </div>
  );
}

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - `className` replaces the HTML `class` attribute in JSX to avoid JavaScript reserved keyword conflicts.
// - Maps directly to the standard JavaScript `element.className` object property in the browser DOM API.
// - Template literals (`${...}`) enable dynamic string composition for state-dependent element classes.
// - Custom components accept an optional `className` prop to merge consumer classes with internal defaults.
// - Conditional classes can be cleanly filtered and joined using utility functions like `classNames(...)`.
// - TypeScript validates `className` as a string prop on standard React HTML and SVG elements.
// - Proper class merging preserves component modularity while allowing design system customization.
// - Use `className` (camelCase) instead of `class` to pass CSS class strings to JSX elements.
// - ES6 template literals (`\`class-\${condition ? 'a' : 'b'}\``) handle inline conditional styling cleanly.
// - The array filter-join pattern (`[base, condition && "modifier"].filter(Boolean).join(" ")`)
//   is great for multi-condition logic without third-party dependencies.
// - Dedicated helper libraries like `clsx` simplify complex conditional class mapping in larger codebases.
