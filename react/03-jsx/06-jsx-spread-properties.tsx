/**
 * JSX Spread Properties
 * =====================
 *
 * Spread properties (`{...props}`) allow passing an entire object of properties down to elements
 * or child components dynamically, bridging object data structures directly to JSX attributes.
 * Spreading unpacks an object's key-value pairs into individual attributes, while explicit props
 * placed after a spread attribute safely override internal values based on declaration order.
 *
 * Complementary rest syntax (`const { label, ...rest } = props`) enables extracting specific
 * component properties while passing remaining attributes down to underlying host elements. Design
 * system wrappers and proxy components use these patterns to forward native DOM attributes cleanly
 * without manual enumeration, with TypeScript validating that spread objects satisfy strict interface definitions.
 */

import React from "react";

// ---------------------------------------------------------------------
// 1. Base Object Spreading onto Host Elements
// ---------------------------------------------------------------------

interface BaseElementConfig {
  readonly id: string;
  readonly className: string;
  readonly title: string;
}

const configObject: BaseElementConfig = {
  id: "main-panel",
  className: "panel-box",
  title: "System Panel",
};

export function SpreadHostElement() {
  return <div {...configObject}>Spread Attributes Content</div>;
}

// ---------------------------------------------------------------------
// 2. Property Override Order Precedence
// ---------------------------------------------------------------------

interface OverrideDemoProps {
  readonly className?: string;
  readonly role?: string;
}

export function OverrideDemoComponent(props: OverrideDemoProps) {
  const defaultAttributes = {
    className: "default-class",
    role: "region",
    tabIndex: 0,
  };

  return (
    <div {...defaultAttributes} {...props}>
      Override Precedence Demonstration
    </div>
  );
}

// ---------------------------------------------------------------------
// 3. Rest Properties Pattern for Attribute Forwarding
// ---------------------------------------------------------------------

interface CustomButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  readonly customLabel: string;
  readonly disabled?: boolean;
  readonly onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

export function RestPropsButton({ customLabel, ...restAttributes }: CustomButtonProps) {
  return <button {...restAttributes}>{customLabel}</button>;
}

// ---------------------------------------------------------------------
// 4. Parent Container Component Demonstrating Spread Properties
// ---------------------------------------------------------------------

export function JsxSpreadDemoContainer() {
  const dynamicOverrides = {
    className: "custom-override-class",
    role: "complementary",
  };

  return (
    <div>
      <h1>JSX Spread Properties Architecture Demonstration</h1>

      <SpreadHostElement />

      <OverrideDemoComponent {...dynamicOverrides} />

      <RestPropsButton
        customLabel="Execute Secure Action"
        onClick={(event: React.MouseEvent<HTMLButtonElement>) => console.log("Secure action invoked", event)}
        disabled={false}
      />
    </div>
  );
}

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Spread properties (`{...props}`) unpack key-value objects directly into JSX attribute bindings.
// - Explicit attributes declared *after* a spread object will override preceding values safely.
// - Declaration order matters; placement precedence determines which properties win conflict resolutions.
// - The rest properties pattern (`const { prop, ...rest } = props`) enables clean extraction and forwarding.
// - Wrapper and proxy components rely on spread syntax to pass unhandled DOM parameters down to native elements.
// - TypeScript validates spread object structures against target component interfaces at compile time.
// - Avoiding excessive or blind prop spreading prevents unintended attribute leakage onto underlying DOM nodes.
