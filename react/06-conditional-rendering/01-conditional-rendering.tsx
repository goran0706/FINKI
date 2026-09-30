/**
 * Conditional Rendering
 * =====================
 *
 * Conditional rendering in React enables components to output different UI structures based on
 * state, props, or application logic. Because JSX compiles to JavaScript expressions, UI branching
 * relies on native language operators.
 *
 * Declarative UI branching is achieved through inline ternary expressions (`condition ? trueNode : falseNode`),
 * logical short-circuiting (`&&`), and top-level early returns. Early returns handle loading, error, or empty
 * guard states before reaching the primary return block, keeping render blocks readable and unencumbered
 * by deeply nested ternaries.
 */

import React, { useState } from "react";

export interface DashboardStatusProps {
  readonly isLoggedIn: boolean;
  readonly unreadCount: number;
}

export const DashboardStatus: React.FC<DashboardStatusProps> = (props) => {
  const { isLoggedIn, unreadCount } = props;

  return (
    <div>
      {/* 1. Ternary Operator for Binary State */}
      {isLoggedIn ? <p>Welcome back, User!</p> : <p>Please log in to continue.</p>}

      {/* 2. Logical && Operator for Conditional Inclusion */}
      {isLoggedIn && unreadCount > 0 && <p>You have {unreadCount} unread notifications.</p>}
    </div>
  );
};

export const ConditionalRenderingContainer: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);
  const [unreadCount, setUnreadCount] = useState<number>(3);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleToggleAuth = (): void => {
    setIsLoggedIn((prev) => !prev);
  };

  const handleToggleLoading = (): void => {
    setIsLoading((prev) => !prev);
  };

  const handleClearNotifications = (): void => {
    setUnreadCount(0);
  };

  // 3. Early Return Pattern for Asynchronous or Loading States
  if (isLoading) {
    return (
      <div>
        <h3>Loading System Resources...</h3>
        <button type="button" onClick={handleToggleLoading}>
          Stop Loading
        </button>
      </div>
    );
  }

  return (
    <div>
      <h1>Conditional Rendering Architecture Demonstration</h1>
      <p>Demonstrating inline ternaries, logical evaluations, and early returns.</p>

      <div>
        <button type="button" onClick={handleToggleAuth}>
          {isLoggedIn ? "Log Out" : "Log In"}
        </button>
        <button type="button" onClick={handleToggleLoading}>
          Simulate Loading State
        </button>
        <button type="button" onClick={handleClearNotifications}>
          Clear Notifications
        </button>
      </div>

      <DashboardStatus isLoggedIn={isLoggedIn} unreadCount={unreadCount} />
    </div>
  );
};

export default ConditionalRenderingContainer;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Native Expressions: Leverages standard JavaScript ternary (`? :`) and logical (`&&`) operators directly inside JSX blocks.
// - Early Guard Returns: Cleans up component bodies by short-circuiting loading, error, or empty states before primary render blocks.
// - Safe Logical Evaluation: Guards against unintended zero-value or string renders by maintaining explicit boolean expressions.
// - Render Layer Decoupling: Separates evaluation state changes from declarative appearance markup.
// - Clean Architecture Compliance: Inputs are explicitly destructured on separate lines inside component bodies, maintaining standard layout conventions.
