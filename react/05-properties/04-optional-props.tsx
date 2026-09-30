/**
 * Optional Props
 * ==============
 *
 * Optional props are component properties that do not require explicit values from
 * parent components. They allow components to provide fallback behaviors or hide
 * conditional UI elements when specific inputs are omitted.
 *
 * Optional contract syntax uses question marks (`?`) in TypeScript to denote `T | undefined` types,
 * allowing components to handle missing properties via default parameter values and conditional
 * rendering guards. This keeps component APIs flexible and reusable across diverse UI contexts.
 */

import React from "react";

// ---------------------------------------------------------------------
// 1. Props Interface with Optional Fields
// ---------------------------------------------------------------------

export interface NotificationBannerProps {
  readonly title: string;
  readonly subtitle?: string;
  readonly actionLabel?: string;
  readonly dismissable?: boolean;
}

// ---------------------------------------------------------------------
// 2. Component Handling Optional Props
// ---------------------------------------------------------------------

export const NotificationBanner: React.FC<NotificationBannerProps> = (props) => {
  const { title, subtitle, actionLabel, dismissable = false } = props;

  return (
    <div className="notification-banner">
      <h3>{title}</h3>
      {subtitle && <p className="subtitle">{subtitle}</p>}

      <div className="banner-actions">
        {actionLabel && <button type="button">{actionLabel}</button>}
        {dismissable && <button type="button">Dismiss</button>}
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------
// 3. Parent Component Demonstrating Variations
// ---------------------------------------------------------------------

export const NotificationContainer: React.FC = () => {
  return (
    <section>
      <h2>System Notifications</h2>

      {/* Omit all optional props */}
      <NotificationBanner title="System Update Available" />

      {/* Provide partial optional props */}
      <NotificationBanner title="Account Warning" subtitle="Your storage is 90% full." />

      {/* Provide all optional props */}
      <NotificationBanner
        title="Welcome!"
        subtitle="Thank you for signing up for our platform."
        actionLabel="Take a Tour"
        dismissable={true}
      />
    </section>
  );
};

export default NotificationContainer;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Optional Interface Markers: Appending `?` to property declarations flags props as optional, evaluating to `T | undefined` inside the component.
// - Default Fallback Values: Destructuring with assignment operators (e.g., `dismissable = false`) safely handles missing or `undefined` props.
// - Conditional Element Guarding: Logical AND operators (`&&`) or ternary checks prevent rendering empty XML nodes when optional props are absent.
// - Flexible Consumer Surface: Optional props reduce required configuration overhead for simple use cases while keeping advanced functionality accessible.
// - Compile-Time Flexibility: TypeScript validates optional inputs accurately without throwing errors when optional attributes are omitted by parent components.
