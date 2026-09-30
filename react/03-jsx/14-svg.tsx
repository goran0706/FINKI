/**
 * SVG in JSX
 * ==========
 *
 * SVG elements are fully supported as first-class JSX host elements in React, allowing vector
 * graphics to be rendered directly inline within component trees. SVG attributes must follow camelCase
 * conventions (e.g., `strokeWidth`, `viewBox`) to align with DOM property mapping, while namespace
 * attributes drop colons (e.g., `xlinkHref`).
 *
 * Lowercase tags represent native SVG elements, whereas capitalized wrappers define reusable vector
 * components. Inline SVGs support direct styling, event listeners, and dynamic props for dimensions
 * and color, with TypeScript providing compile-time validation via `React.SVGProps<SVGSVGElement>`.
 */

import React from "react";

// ---------------------------------------------------------------------
// 1. Static Inline SVG with CamelCase Attributes
// ---------------------------------------------------------------------

export function StaticCheckIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="icon-check"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

// ---------------------------------------------------------------------
// 2. Dynamic Parametric Vector Icon Component
// ---------------------------------------------------------------------

interface IconProps extends React.SVGProps<SVGSVGElement> {
  readonly size?: number | string;
  readonly color?: string;
}

export function DynamicSettingsIcon({ size = 24, color = "currentColor", className = "", ...restProps }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`icon-settings ${className}`.trim()}
      {...restProps}
    >
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}

// ---------------------------------------------------------------------
// 3. SVG Gradient Definition and Usage
// ---------------------------------------------------------------------

export function GradientCircleIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48">
      <defs>
        <linearGradient id="circleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1890ff" stopOpacity="1" />
          <stop offset="100%" stopColor="#52c41a" stopOpacity="1" />
        </linearGradient>
      </defs>
      <circle cx="24" cy="24" r="20" fill="url(#circleGrad)" />
    </svg>
  );
}

// ---------------------------------------------------------------------
// 4. Parent Container Component
// ---------------------------------------------------------------------

export function SvgDemoContainer() {
  return (
    <div>
      <h1>SVG in JSX Architecture Demonstration</h1>
      <StaticCheckIcon />
      <DynamicSettingsIcon size={32} color="#0052cc" onClick={() => console.log("SVG Clicked")} />
      <GradientCircleIcon />
    </div>
  );
}

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - SVG elements are rendered directly in JSX as native host elements without external asset loaders.
// - SVG attributes use camelCase property conventions (e.g., `strokeWidth`, `fillRule`, `viewBox`).
// - Namespaced attributes convert to camelCase strings omitting colons (e.g., `xlinkHref`).
// - Functional SVG components accept dynamic props for controlling size, color, and event handling.
// - Sub-elements like `<defs>`, `<linearGradient>`, and `<path>` function seamlessly inline.
// - TypeScript validates attributes via the `React.SVGProps<SVGSVGElement>` interface.
// - Inline vector components eliminate external HTTP asset requests while enabling dynamic CSS styling.
