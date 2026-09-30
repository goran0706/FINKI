/**
 * Code Coverage
 * =============
 *
 * Code coverage measures which parts of the source code are exercised by a test suite.
 * Coverage reports commonly include statements, branches, functions, and lines, helping
 * identify code that has not been executed by tests.
 */

import { type FC, type ReactElement, useState } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// ---------------------------------------------------------------------
// 1. What code coverage measures
// ---------------------------------------------------------------------

// Statement coverage measures whether executable statements ran.
// Branch coverage measures whether each conditional path ran.
// Function coverage measures whether functions were called.
// Line coverage measures whether executable source lines ran.
//
// Coverage answers:
// - Which code executed during the tests?
// - Which branches were exercised?
// - Which functions were called?
//
// Coverage does not answer whether the assertions were meaningful or whether
// the tested behavior is correct.

export const CoverageExample: FC<{ readonly enabled: boolean }> = ({ enabled }): ReactElement => {
  if (enabled) {
    return <p>Enabled</p>;
  }

  return <p>Disabled</p>;
};

// ---------------------------------------------------------------------
// 2. Statement coverage
// ---------------------------------------------------------------------

export const formatUserName = (firstName: string, lastName: string): string => {
  const first = firstName.trim();
  const last = lastName.trim();

  return `${first} ${last}`.trim();
};

// A test that calls formatUserName exercises the statements inside the function.
//
// The coverage report can show that these statements executed.
// It does not prove that every meaningful input combination was tested.

const formattedName = formatUserName("John", "Doe");
void formattedName;

// ---------------------------------------------------------------------
// 3. Branch coverage
// ---------------------------------------------------------------------

export const getGreeting = (name: string, isReturningUser: boolean): string => {
  if (isReturningUser) {
    return `Welcome back, ${name}.`;
  }

  return `Welcome, ${name}.`;
};

// Testing only isReturningUser = true executes one branch.
// Testing both true and false exercises both branches.
//
// Branch coverage is useful when conditional logic has behavior that differs
// between the possible paths.

const returningGreeting = getGreeting("John", true);
const newGreeting = getGreeting("John", false);

void returningGreeting;
void newGreeting;

// ---------------------------------------------------------------------
// 4. Function coverage
// ---------------------------------------------------------------------

export const calculateTotal = (price: number, quantity: number): number => price * quantity;

export const calculateDiscount = (total: number): number => {
  if (total >= 100) {
    return total * 0.9;
  }

  return total;
};

// Calling calculateTotal but never calculateDiscount leaves the second
// function uncovered.
//
// Function coverage therefore answers whether a function was invoked,
// not whether every branch inside that function was exercised.

const total = calculateTotal(25, 4);
const discountedTotal = calculateDiscount(total);

void discountedTotal;

// ---------------------------------------------------------------------
// 5. Line coverage
// ---------------------------------------------------------------------

export const describeAccount = (isActive: boolean): string => {
  if (!isActive) {
    return "Account is inactive.";
  }

  return "Account is active.";
};

// A coverage report can associate executed statements with source lines.
// Line coverage can therefore reveal lines that the test suite never reaches.
//
// Line coverage and statement coverage are related but are not identical
// concepts. One source line can contain multiple executable statements.

const accountDescription = describeAccount(true);

void accountDescription;

// ---------------------------------------------------------------------
// 6. Testing both branches
// ---------------------------------------------------------------------

export const StatusMessage: FC<{ readonly loading: boolean }> = ({ loading }): ReactElement => {
  if (loading) {
    return <p role="status">Loading...</p>;
  }

  return <p>Ready</p>;
};

// A test suite that renders only loading = true does not exercise the
// non-loading branch.
//
// Rendering both states gives the tests access to both observable outcomes.

describeStatusMessage();

function describeStatusMessage(): void {
  const loadingElement = render(<StatusMessage loading={true} />).container.firstChild;
  const readyElement = render(<StatusMessage loading={false} />).container.firstChild;

  void loadingElement;
  void readyElement;
}

// ---------------------------------------------------------------------
// 7. Coverage does not replace assertions
// ---------------------------------------------------------------------

export const PasswordMessage: FC<{ readonly valid: boolean }> = ({ valid }): ReactElement => (
  <p>{valid ? "Password accepted." : "Password rejected."}</p>
);

// Rendering both branches increases coverage, but a test still needs assertions
// that verify the intended behavior.
//
// High coverage with weak assertions can leave incorrect behavior undetected.
//
// Example test structure:
//
// const user = userEvent.setup();
// render(<PasswordMessage valid={true} />);
// expect(screen.getByText("Password accepted.")).toBeInTheDocument();

void screen;
void userEvent;

// ---------------------------------------------------------------------
// 8. Coverage-driven test design
// ---------------------------------------------------------------------

export const getAccessMessage = (authenticated: boolean, isAdmin: boolean): string => {
  if (!authenticated) {
    return "Please sign in.";
  }

  if (isAdmin) {
    return "Admin access granted.";
  }

  return "User access granted.";
};

// The meaningful paths are:
//
// 1. authenticated = false
// 2. authenticated = true, isAdmin = true
// 3. authenticated = true, isAdmin = false
//
// A useful test suite exercises each behaviorally distinct path rather than
// simply trying to maximize a percentage.

const signedOutMessage = getAccessMessage(false, false);
const adminMessage = getAccessMessage(true, true);
const userMessage = getAccessMessage(true, false);

void signedOutMessage;
void adminMessage;
void userMessage;

// ---------------------------------------------------------------------
// 9. Testing a component with multiple states
// ---------------------------------------------------------------------

interface CounterProps {
  readonly initialValue?: number;
}

export const Counter: FC<CounterProps> = ({ initialValue = 0 }): ReactElement => {
  const [count, setCount] = useState(initialValue);

  return (
    <section aria-label="Counter">
      <output aria-label="Count">{count}</output>
      <button type="button" onClick={() => setCount((current) => current + 1)}>
        Increment
      </button>
      <button type="button" onClick={() => setCount((current) => current - 1)}>
        Decrement
      </button>
    </section>
  );
};

// A useful test suite can exercise:
// - the initial state;
// - the increment path;
// - the decrement path.
//
// Coverage helps identify whether these handlers have executed, while the
// assertions verify that each interaction produces the intended result.

const counter = render(<Counter initialValue={0} />);
const incrementButton = screen.getByRole("button", { name: "Increment" });
const decrementButton = screen.getByRole("button", { name: "Decrement" });

void counter;
void incrementButton;
void decrementButton;

// ---------------------------------------------------------------------
// 10. Coverage thresholds
// ---------------------------------------------------------------------

// Coverage tools can enforce minimum thresholds for a project.
//
// Typical thresholds can be configured for:
// - statements;
// - branches;
// - functions;
// - lines.
//
// A threshold can prevent a test run from passing when coverage falls below
// the configured minimum.
//
// Thresholds are guardrails, not proof of test quality.

// Example configuration:
//
// coverageThreshold: {
//     global: {
//         statements: 80,
//         branches: 75,
//         functions: 80,
//         lines: 80,
//     },
// }

// ---------------------------------------------------------------------
// 11. Coverage reports
// ---------------------------------------------------------------------

// Coverage tools can produce several report formats.
//
// Common formats include:
// - terminal text summaries;
// - HTML reports;
// - machine-readable JSON;
// - LCOV reports for external tooling.
//
// An HTML report is particularly useful for locating uncovered source
// statements and branches.
//
// The exact command and configuration depend on the test runner and
// coverage provider used by the project.

// ---------------------------------------------------------------------
// 12. Uncovered code is a signal, not an automatic defect
// ---------------------------------------------------------------------

export const normalizeName = (name: string): string => {
  return name.trim().replace(/\s+/g, " ");
};

// A line may legitimately remain uncovered when it belongs to:
// - defensive code;
// - an impossible state;
// - environment-specific behavior;
// - integration-only behavior;
// - error handling that is difficult to trigger in a unit test.
//
// Uncovered code should be investigated rather than automatically tested
// solely to increase the reported percentage.

const normalizedName = normalizeName("  John   Doe  ");

void normalizedName;

// ---------------------------------------------------------------------
// 13. Avoid testing only to increase coverage
// ---------------------------------------------------------------------

export const isEligible = (age: number, hasAccount: boolean): boolean => {
  return age >= 18 && hasAccount;
};

// A test written only to execute this function could increase coverage without
// verifying an important behavior.
//
// Better tests describe meaningful requirements:
//
// expect(isEligible(18, true)).toBe(true);
// expect(isEligible(17, true)).toBe(false);
// expect(isEligible(18, false)).toBe(false);
//
// Coverage should support test design rather than become the sole objective.

void isEligible;

// ---------------------------------------------------------------------
// 14. Coverage and unreachable code
// ---------------------------------------------------------------------

export const getDisplayName = (name: string | undefined): string => {
  if (name === undefined) {
    return "Anonymous";
  }

  return name;
};

// Coverage can reveal that one path is never exercised.
//
// If a branch is genuinely unreachable, the appropriate response may be to
// simplify or remove the code rather than manufacture a test for it.

const displayName = getDisplayName(undefined);

void displayName;

// ---------------------------------------------------------------------
// 15. Coverage with UI behavior
// ---------------------------------------------------------------------

export const ToggleMessage: FC = (): ReactElement => {
  const [enabled, setEnabled] = useState(false);

  return (
    <section aria-label="Toggle">
      <output aria-label="State">{enabled ? "On" : "Off"}</output>
      <button type="button" onClick={() => setEnabled((current) => !current)}>
        Toggle
      </button>
    </section>
  );
};

// A UI test should focus on observable behavior:
//
// render(<ToggleMessage />);
// expect(screen.getByLabelText("State")).toHaveTextContent("Off");
//
// await user.click(screen.getByRole("button", {name: "Toggle"}));
// expect(screen.getByLabelText("State")).toHaveTextContent("On");
//
// The interaction exercises the state transition, while the assertions
// establish that the transition produces the expected user-visible result.

// ---------------------------------------------------------------------
// 16. Coverage versus mutation testing
// ---------------------------------------------------------------------

// Coverage asks whether code was executed.
//
// Mutation testing asks whether tests can detect deliberate changes to the
// implementation.
//
// A suite can have high coverage while failing to detect certain incorrect
// implementations. Mutation testing can expose this weakness.
//
// These techniques therefore measure different properties of a test suite.

// ---------------------------------------------------------------------
// 17. Practical coverage workflow
// ---------------------------------------------------------------------

// A practical workflow is:
//
// 1. Write behavior-focused tests.
// 2. Run the test suite with coverage enabled.
// 3. Inspect uncovered statements and branches.
// 4. Decide whether each uncovered path represents meaningful behavior.
// 5. Add tests for important missing behavior.
// 6. Remove or simplify unjustified code when appropriate.
// 7. Treat coverage thresholds as guardrails rather than the final goal.
//
// The purpose of coverage is to make gaps visible so test design can improve.

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Code coverage measures which parts of source code are exercised by tests.
// - Statement, branch, function, and line coverage measure different aspects of execution.
// - Branch coverage is especially useful for conditional logic with multiple behavioral paths.
// - High coverage does not guarantee that assertions are meaningful or that behavior is correct.
// - Coverage reports help identify code paths that have not been exercised.
// - Coverage thresholds can enforce minimum levels but should not become the sole testing goal.
// - Uncovered code should be investigated rather than automatically tested just to raise a percentage.
// - Behavior-focused assertions remain more important than maximizing coverage numbers.
// - Mutation testing complements coverage by checking whether tests detect implementation changes.
