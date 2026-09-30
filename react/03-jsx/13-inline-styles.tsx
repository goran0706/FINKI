/**
 * Inline Styles
 * =============
 *
 * Inline styles in JSX allow setting dynamic CSS properties directly on host elements using JavaScript
 * style objects rather than raw string declarations. The `style` attribute expects a plain object with
 * camelCase equivalents for hyphenated CSS properties, mapping numeric values to pixel strings automatically
 * for dimensional properties while leaving unitless attributes like opacity or flex as raw numbers.
 *
 * Furthermore, object spread operations enable seamless style composition, custom CSS variables require
 * explicit string key syntax, and TypeScript validates inline style keys and values against the strict
 * `React.CSSProperties` interface.
 */

import React from "react";

// ---------------------------------------------------------------------
// 1. Basic Style Object and CamelCase Properties
// ---------------------------------------------------------------------

const baseBoxStyle: React.CSSProperties = {
  backgroundColor: "#f4f5f7",
  padding: "16px",
  borderRadius: "8px",
  border: "1px solid #e1e4e8",
};

export function BasicInlineStyleComponent() {
  return <div style={baseBoxStyle}>Basic Style Object Box</div>;
}

// ---------------------------------------------------------------------
// 2. Dynamic Style Object Computation and Unit Conversion
// ---------------------------------------------------------------------

interface DynamicProgressBarProps {
  readonly progress: number; // Percentage 0-100
  readonly height?: number; // Evaluates as px automatically
}

export function DynamicProgressBar({ progress, height = 12 }: DynamicProgressBarProps) {
  const containerStyle: React.CSSProperties = {
    width: "100%",
    height, // Evaluates to `${height}px` automatically
    backgroundColor: "#e0e0e0",
    borderRadius: 4,
    overflow: "hidden",
  };

  const fillStyle: React.CSSProperties = {
    width: `${progress}%`,
    height: "100%",
    backgroundColor: progress > 80 ? "#2e7d32" : "#1976d2",
    transition: "width 0.3s ease-in-out",
  };

  return (
    <div style={containerStyle}>
      <div style={fillStyle} />
    </div>
  );
}

// ---------------------------------------------------------------------
// 3. Style Object Merging and CSS Variables
// ---------------------------------------------------------------------

interface CustomCardStyleProps {
  readonly customStyle?: React.CSSProperties;
  readonly accentColor: string;
}

export function CustomCardWithTheme({ customStyle, accentColor }: CustomCardStyleProps) {
  const mergedStyle: React.CSSProperties = {
    padding: 20,
    backgroundColor: "#ffffff",
    borderLeft: `4px solid ${accentColor}`,
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    // Custom CSS variables require explicit string typing:
    ["--accent-color" as string]: accentColor,
    ...customStyle,
  };

  return <div style={mergedStyle}>Card Content with Dynamic Accent</div>;
}

// ---------------------------------------------------------------------
// 4. Parent Container Component
// ---------------------------------------------------------------------

export function InlineStylesDemoContainer() {
  return (
    <div>
      <h1>Inline Styles Architecture Demonstration</h1>
      <BasicInlineStyleComponent />
      <DynamicProgressBar progress={85} height={16} />
      <CustomCardWithTheme accentColor="#ff5722" customStyle={{ marginTop: 12 }} />
    </div>
  );
}

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - The JSX `style` attribute expects a plain JavaScript object instead of a CSS string literal.
// - Hyphenated CSS property names are converted to camelCase equivalents (e.g., `backgroundColor`).
// - Numeric values for dimensional properties automatically append `px` (e.g., `padding: 16` becomes `16px`).
// - Unitless CSS properties such as `opacity`, `flex`, and `zIndex` remain unformatted numeric values.
// - Object spread operations (`{ ...baseStyle, ...customStyle }`) enable dynamic style composition.
// - CSS variables can be set in style objects using explicit string keys (e.g., `["--variable-name"]: value`).
// - TypeScript validates inline style structures using the comprehensive `React.CSSProperties` type definition.
