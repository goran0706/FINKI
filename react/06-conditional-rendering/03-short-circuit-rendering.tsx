/**
 * Short-Circuit Rendering
 * =======================
 *
 * Short-circuit evaluation using the logical AND (`&&`) operator is a standard React pattern for
 * conditionally including or omitting a single UI element based on a boolean condition. If the expression
 * on the left evaluates to truthy, the element on the right renders; if falsy, React skips it entirely.
 *
 * Logical AND evaluation allows clean conditional inclusion of optional elements like alerts or badges
 * without requiring fallback branches. Explicit boolean checks (`count > 0`) are mandatory to guard against
 * JavaScript's falsy zero behavior, preventing numeric `0` values from leaking into the rendered DOM.
 */

import React, { useState } from "react";

export interface NotificationBadgeProps {
  readonly messageCount: number;
}

export const NotificationBadge: React.FC<NotificationBadgeProps> = (props) => {
  const { messageCount } = props;

  return (
    <div>
      {/* Safe evaluation guarding against the falsy zero trap */}
      {messageCount > 0 && <span className="badge">You have {messageCount} unread messages.</span>}
      {messageCount === 0 && <span>No new messages.</span>}
    </div>
  );
};

export const ShortCircuitContainer: React.FC = () => {
  const [messages, setMessages] = useState<number>(3);
  const [isAlertVisible, setIsAlertVisible] = useState<boolean>(true);

  const handleIncrement = (): void => {
    setMessages((prev) => prev + 1);
  };

  const handleClear = (): void => {
    setMessages(0);
  };

  const handleToggleAlert = (): void => {
    setIsAlertVisible((prev) => !prev);
  };

  return (
    <div>
      <h1>Short-Circuit Rendering Architecture Demonstration</h1>
      <p>Demonstrating conditional inclusion via logical AND (`&&`) evaluation and safe guarding.</p>

      <div>
        <button type="button" onClick={handleIncrement}>
          Add Message
        </button>
        <button type="button" onClick={handleClear}>
          Clear Messages (Test Zero Guard)
        </button>
        <button type="button" onClick={handleToggleAlert}>
          {isAlertVisible ? "Hide System Alert" : "Show System Alert"}
        </button>
      </div>

      <NotificationBadge messageCount={messages} />

      {/* Logical && short-circuit for optional alert banner */}
      {isAlertVisible && (
        <div className="alert-banner">
          <p>System Warning: Maintenance scheduled for tonight.</p>
        </div>
      )}
    </div>
  );
};

export default ShortCircuitContainer;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Conditional Inclusion: Uses the `&&` operator to render optional UI elements without needing an explicit `else` branch.
// - Falsy Zero Prevention: Employs explicit boolean comparisons (`> 0`) to prevent unexpected numeric `0` rendering in JSX.
// - Template Conciseness: Avoids unnecessary ternary syntax when no alternative fallback element is required.
// - Deterministic Omission: Ensures falsy conditions evaluate cleanly to `false` or `null`, keeping DOM trees unpolluted.
// - Clean Architecture Compliance: Inputs are explicitly destructured on separate lines inside component bodies, maintaining standard layout rules.
