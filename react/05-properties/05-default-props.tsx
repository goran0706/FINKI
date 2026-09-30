/**
 * Default Props
 * =============
 *
 * Default props establish fallback values for optional component inputs when they are omitted
 * by parent components or evaluated as `undefined`. Modern React uses ES6 default parameters directly
 * within destructuring assignments, providing clean fallback handling without relying on legacy
 * static properties.
 *
 * ES6 parameter destructuring provides type-safe, concise fallbacks that trigger exclusively when
 * optional properties are `undefined` or omitted entirely. Explicitly passing `null` overrides these
 * default assignments, while avoiding legacy static properties improves overall TypeScript type inference.
 */

import React from "react";

// ---------------------------------------------------------------------
// 1. Props Interface with Optional Parameters
// ---------------------------------------------------------------------

export interface StatusBadgeProps {
  readonly label: string;
  readonly variant?: "info" | "success" | "warning" | "danger";
  readonly isVisible?: boolean;
  readonly refreshIntervalMs?: number;
}

// ---------------------------------------------------------------------
// 2. Component Applying ES6 Default Props
// ---------------------------------------------------------------------

export const StatusBadge: React.FC<StatusBadgeProps> = (props) => {
  const { label, variant = "info", isVisible = true, refreshIntervalMs = 5000 } = props;

  if (!isVisible) {
    return null;
  }

  return (
    <div className={`status-badge status-badge-${variant}`}>
      <span>{label}</span>
      <small>(Polling every {refreshIntervalMs / 1000}s)</small>
    </div>
  );
};

// ---------------------------------------------------------------------
// 3. Parent Component Demonstrating Default Behavior
// ---------------------------------------------------------------------

export const StatusBadgeContainer: React.FC = () => {
  return (
    <section>
      <h2>System Status Monitoring</h2>

      {/* Relies on all defaults: variant="info", isVisible=true, refreshIntervalMs=5000 */}
      <StatusBadge label="Database Connection" />

      {/* Overrides variant and refreshIntervalMs, relies on isVisible=true */}
      <StatusBadge label="Cache Server" variant="warning" refreshIntervalMs={10000} />

      {/* Overrides variant to danger */}
      <StatusBadge label="Payment Gateway" variant="danger" />
    </section>
  );
};

export default StatusBadgeContainer;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - ES6 Destructuring Defaults: Assigning default values inside prop destructuring is the idiomatic standard for functional components.
// - Undefined Trigger Guard: Default parameter values apply only when the incoming prop value is strictly `undefined` or omitted entirely.
// - Explicit Null Preservation: Passing `null` deliberately overrides ES6 default assignments rather than triggering fallbacks.
// - Elimination of Legacy Static Properties: Modern React codebases avoid static `.defaultProps` properties to improve TypeScript type inference.
// - Fallback Resilience: Providing smart default values ensures components render cleanly and reliably with minimal configurations.
