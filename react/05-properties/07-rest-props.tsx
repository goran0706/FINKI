/**
 * Rest Props
 * ==========
 *
 * Rest props collect remaining un-destructured properties into a separate object using the
 * rest operator (`...rest`), allowing components to forward extra attributes cleanly to underlying
 * native elements or wrapper components.
 *
 * This pattern enables flexible API design by capturing miscellaneous attributes (like HTML event
 * handlers, accessibility tags, or custom data markers) without requiring explicit interface definitions
 * for every possible native attribute.
 */

import React from "react";

// ---------------------------------------------------------------------
// 1. Props Interface extending Native HTML Attributes
// ---------------------------------------------------------------------

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  readonly variant?: "primary" | "secondary";
  readonly isLoading?: boolean;
  readonly label: string;
}

// ---------------------------------------------------------------------
// 2. Component Utilizing Rest Props Forwarding
// ---------------------------------------------------------------------

export const Button: React.FC<ButtonProps> = (props) => {
  // Separate explicit custom props from the remaining native attributes via rest operator
  const { variant = "primary", isLoading = false, label, disabled, children, ...restAttributes } = props;

  return (
    <button type="button" disabled={disabled || isLoading} className={`btn btn-${variant}`} {...restAttributes}>
      {isLoading ? "Processing..." : label}
      {children}
    </button>
  );
};

// ---------------------------------------------------------------------
// 3. Parent Component Passing Forwarded Attributes
// ---------------------------------------------------------------------

export const ButtonContainer: React.FC = () => {
  const handleClick = (): void => {
    console.log("Button clicked!");
  };

  return (
    <section className="button-demo">
      <h2>Interactive Actions</h2>
      <Button
        label="Submit Form"
        variant="primary"
        onClick={handleClick}
        aria-label="Submit User Form"
        data-testid="submit-btn"
      />
    </section>
  );
};

export default ButtonContainer;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Rest Parameter Collection: The ES6 rest operator (`...rest`) captures all un-destructured property attributes into a single object container.
// - Attribute Forwarding: Captured rest properties can be spread (`{...restAttributes}`) onto underlying DOM elements to support native HTML attributes.
// - Interface Extension: Combining custom component interfaces with native types (`React.ButtonHTMLAttributes`) ensures comprehensive prop autocompletion.
// - Clean API Boundaries: Custom behavioral props are decoupled from generic styling or event attributes, preventing interface bloat.
// - Dynamic Extensibility: Components accept arbitrary DOM attributes (like `aria-*` or `data-*`) without requiring pre-declared interface definitions for each.
