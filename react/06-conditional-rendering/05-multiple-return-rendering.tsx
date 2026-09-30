/**
 * Multiple Return Rendering
 * =========================
 *
 * Multiple return rendering leverages structural component branching by placing distinct, mutually exclusive return
 * statements across top-level state conditions. Unlike early returns used purely for guard clauses, multiple returns
 * partition a component into completely separate UI layouts based on primary operational modes.
 *
 * Mode-driven path selection isolates divergent UI workflows (such as an onboarding wizard versus a main dashboard)
 * into independent render branches. This architectural separation keeps individual render paths concise, predictable,
 * and completely unencumbered by monolithic return blocks or nested ternaries.
 */

import React, { useState } from "react";

export interface OnboardingViewProps {
  readonly onComplete: () => void;
}

export const OnboardingView: React.FC<OnboardingViewProps> = (props) => {
  const { onComplete } = props;

  return (
    <div>
      <h2>Welcome to the Onboarding Portal</h2>
      <p>Please complete your profile configuration to proceed.</p>
      <button type="button" onClick={onComplete}>
        Complete Onboarding
      </button>
    </div>
  );
};

export interface DashboardViewProps {
  readonly onReset: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = (props) => {
  const { onReset } = props;

  return (
    <div>
      <h2>Main Application Dashboard</h2>
      <p>System operational and ready for use.</p>
      <button type="button" onClick={onReset}>
        Reset to Onboarding
      </button>
    </div>
  );
};

export const MultipleReturnContainer: React.FC = () => {
  const [appMode, setAppMode] = useState<"onboarding" | "dashboard">("onboarding");

  const handleCompleteOnboarding = (): void => {
    setAppMode("dashboard");
  };

  const handleResetApp = (): void => {
    setAppMode("onboarding");
  };

  // 1. First Distinct Return Branch: Onboarding Mode
  if (appMode === "onboarding") {
    return (
      <div>
        <h1>Multiple Return Architecture Demonstration</h1>
        <p>Currently rendering the isolated onboarding workflow branch.</p>
        <OnboardingView onComplete={handleCompleteOnboarding} />
      </div>
    );
  }

  // 2. Second Distinct Return Branch: Dashboard Mode
  if (appMode === "dashboard") {
    return (
      <div>
        <h1>Multiple Return Architecture Demonstration</h1>
        <p>Currently rendering the isolated dashboard workflow branch.</p>
        <DashboardView onReset={handleResetApp} />
      </div>
    );
  }

  // 3. Fallback Return Branch (Safety Net)
  return (
    <div>
      <p>Error: Unknown application mode state.</p>
    </div>
  );
};

export default MultipleReturnContainer;

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Distinct Layout Branching: Partitions complex component workflows into isolated, top-level return statements.
// - Workflow Separation: Encapsulates distinct UI modes (such as setup wizards vs. primary dashboards) without inline template clutter.
// - State-Driven Routing: Directs execution cleanly to dedicated UI templates based on primary operational state flags.
// - Reduced Template Complexity: Eliminates multi-layered ternary trees within primary return blocks.
// - Clean Architecture Compliance: Inputs are explicitly destructured on separate lines inside component bodies, maintaining standard layout conventions.
