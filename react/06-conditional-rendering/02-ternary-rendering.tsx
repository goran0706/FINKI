/**
 * Ternary Rendering
 * =================
 *
 * Ternary conditional rendering (`condition ? TrueNode : FalseNode`) is the primary architectural
 * pattern in React for handling mutually exclusive UI states. Unlike logical `&&` operators designed
 * for conditional omission, ternaries guarantee that exactly one of two distinct render branches is evaluated.
 *
 * Mutually exclusive UI states ensure deterministic layout output for binary alternatives, such as online
 * versus offline status or authenticated versus guest roles. To preserve readability, complex branching
 * should avoid deep inline ternary nesting in favor of early returns or derived helper variables.
 */

import React, { useState } from "react";

export interface SystemStatusBannerProps {
  readonly isSystemOnline: boolean;
}

export const SystemStatusBanner: React.FC<SystemStatusBannerProps> = (props) => {
  const { isSystemOnline } = props;

  return (
    <div>
      {isSystemOnline ? (
        <div style={{ color: "green" }}>
          <h4>Status: Operational</h4>
          <p>All core services are responding normally.</p>
        </div>
      ) : (
        <div style={{ color: "red" }}>
          <h4>Status: Offline</h4>
          <p>System connection lost. Attempting reconnection...</p>
        </div>
      )}
    </div>
  );
};

export const TernaryRenderingContainer: React.FC = () => {
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [userRole, setUserRole] = useState<"admin" | "guest">("admin");

  const handleToggleStatus = (): void => {
    setIsOnline((prev) => !prev);
  };

  const handleToggleRole = (): void => {
    setUserRole((prev) => (prev === "admin" ? "guest" : "admin"));
  };

  return (
    <div>
      <h1>Ternary Rendering Architecture Demonstration</h1>
      <p>Demonstrating mutually exclusive UI branches using native ternary expressions.</p>

      <div>
        <button type="button" onClick={handleToggleStatus}>
          Toggle System Status
        </button>
        <button type="button" onClick={handleToggleRole}>
          Switch User Role ({userRole})
        </button>
      </div>

      <SystemStatusBanner isSystemOnline={isOnline} />

      <div>
        {userRole === "admin" ? (
          <p>Access Granted: Full administrative controls enabled.</p>
        ) : (
          <p>Access Limited: Viewing in restricted guest mode.</p>
        )}
      </div>
    </div>
  );
};

export default TernaryRenderingContainer;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Binary UI Branching: Native ternary expressions (`? :`) enforce explicit, mutually exclusive rendering paths within JSX.
// - Deterministic Rendering: Guarantees that exactly one branch executes, preventing layout collapse or accidental empty state output.
// - Code Maintainability: Keeps inline branching flat and readable by avoiding deeply nested ternary chains.
// - Type-Safe Layout Composition: Ensures true and false render branches return structurally compatible JSX nodes.
// - Clean Architecture Compliance: Inputs are explicitly destructured on dedicated new lines inside component bodies, maintaining standard layout rules.
