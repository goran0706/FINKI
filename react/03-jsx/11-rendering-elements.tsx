/**
 * Rendering Elements
 * ==================
 *
 * React elements are immutable object descriptors that can be stored in variables, passed as props,
 * and dynamically evaluated or conditionally rendered within component trees. Storing elements in
 * variables enables clean pre-computation of conditional UI branches and separation of complex logic
 * from the final return markup.
 *
 * Dynamic component tags utilize capitalized variable names to switch between components at runtime.
 * Furthermore, recursive element composition builds complex structural hierarchies, while TypeScript
 * enforces strict typing contracts for element variables using `JSX.Element` or `React.ReactElement`.
 */

import React from "react";

// ---------------------------------------------------------------------
// 1. Storing Elements in Variables
// ---------------------------------------------------------------------

const primaryAdminBadge = <span className="badge admin">Admin Access</span>;
const standardUserBadge = <span className="badge user">Standard User</span>;

export function BadgeDisplay({ isAdmin }: { readonly isAdmin: boolean }) {
  const activeBadge = isAdmin ? primaryAdminBadge : standardUserBadge;

  return (
    <div className="badge-container">
      <p>Current Authorization Status:</p>
      {activeBadge}
    </div>
  );
}

// ---------------------------------------------------------------------
// 2. Dynamic Component Tags
// ---------------------------------------------------------------------

function SectionHeader() {
  return <h2>Dynamic Section Header</h2>;
}

function ArticleHeader() {
  return <h2>Dynamic Article Header</h2>;
}

interface DynamicHeaderProps {
  readonly type: "section" | "article";
}

export function DynamicHeaderComponent({ type }: DynamicHeaderProps) {
  const HeaderComponent = type === "section" ? SectionHeader : ArticleHeader;

  return (
    <div className="dynamic-header-wrapper">
      <HeaderComponent />
    </div>
  );
}

// ---------------------------------------------------------------------
// 3. Pre-computed Conditional Element Blocks
// ---------------------------------------------------------------------

export function ConditionalElementBlock({ isLoaded }: { readonly isLoaded: boolean }) {
  let contentElement: JSX.Element;

  if (isLoaded) {
    contentElement = <p className="success-text">Data loaded successfully.</p>;
  } else {
    contentElement = <p className="loading-text">Loading system records...</p>;
  }

  return <div className="block-container">{contentElement}</div>;
}

// ---------------------------------------------------------------------
// 4. Parent Container Component Demonstrating Element Rendering
// ---------------------------------------------------------------------

export function RenderingElementsDemoContainer() {
  return (
    <div>
      <h1>Rendering Elements Architecture Demonstration</h1>
      <BadgeDisplay isAdmin={true} />
      <DynamicHeaderComponent type="article" />
      <ConditionalElementBlock isLoaded={false} />
    </div>
  );
}

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - JSX elements are first-class JavaScript objects that can be assigned directly to variables.
// - Storing elements in variables enables clean pre-computation of conditional UI branches.
// - Dynamic tags require proper capitalization so React recognizes them as custom component references.
// - Elements can be passed as regular variables or props throughout the component hierarchy.
// - TypeScript provides strong typing contracts for element variables using `JSX.Element` or `React.ReactElement`.
// - Managing element reference stability avoids unnecessary reconciliation overhead during state updates.
// - Pre-computing elements separates complex conditional routing logic from the final return statement.
