/**
 * Testing Pyramid
 * ===============
 *
 * The testing pyramid is a model for balancing different levels of automated tests.
 * Unit tests are usually numerous and fast, integration tests validate interactions
 * between multiple parts of an application, and end-to-end tests validate complete
 * user workflows through the running application.
 *
 * The pyramid is a guideline rather than a strict numerical rule. The appropriate
 * balance depends on the application's architecture, risk profile, and testability.
 */

import { render, screen } from "@testing-library/react";
import { type FC, type ReactElement } from "react";

// ---------------------------------------------------------------------
// 1. The testing pyramid
// ---------------------------------------------------------------------

// The traditional pyramid has three broad levels:
//
//                         / \
//                        / E2E \
//                       /-------\
//                      /  Integration  \
//                     /-----------------\
//                    /      Unit         \
//                   /---------------------\
//
// Lower-level tests are generally faster and more isolated.
// Higher-level tests generally exercise more of the real application.

export interface TestingLevel {
  readonly name: string;
  readonly purpose: string;
  readonly relativeSpeed: "fast" | "medium" | "slow";
  readonly scope: "narrow" | "moderate" | "broad";
}

export const testingLevels: readonly TestingLevel[] = [
  {
    name: "Unit",
    purpose: "Verify a small unit of behavior in isolation",
    relativeSpeed: "fast",
    scope: "narrow",
  },
  {
    name: "Integration",
    purpose: "Verify that multiple parts work together",
    relativeSpeed: "medium",
    scope: "moderate",
  },
  {
    name: "End-to-end",
    purpose: "Verify a complete user workflow",
    relativeSpeed: "slow",
    scope: "broad",
  },
];

// ---------------------------------------------------------------------
// 2. Unit tests
// ---------------------------------------------------------------------

// A unit test focuses on a small unit of behavior.
//
// In frontend applications, the unit might be:
// - a pure function
// - a formatter
// - a validation function
// - a reducer
// - a small component
//
// The smaller the scope, the easier it is to identify which behavior failed.

export const formatPrice = (amount: number): string => {
  return `$${amount.toFixed(2)}`;
};

// A unit test for formatPrice does not need a browser, React tree,
// network request, or application router.

// ---------------------------------------------------------------------
// 3. Integration tests
// ---------------------------------------------------------------------

// An integration test verifies the interaction between multiple units.
//
// For React applications, an integration test might render:
// - a component
// - its child components
// - local state
// - context providers
// - user interactions
// - accessible DOM output
//
// The goal is to test behavior across a meaningful boundary.

export interface SearchFormProps {
  readonly onSearch: (query: string) => void;
}

export const SearchForm: FC<SearchFormProps> = ({ onSearch }): ReactElement => {
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const query = String(formData.get("query") ?? "");

        onSearch(query);
      }}
    >
      <label htmlFor="query">Search</label>
      <input id="query" name="query" type="search" />
      <button type="submit">Search</button>
    </form>
  );
};

// An integration test can verify that the form, input, submit behavior,
// and callback work together.

// ---------------------------------------------------------------------
// 4. End-to-end tests
// ---------------------------------------------------------------------

// An end-to-end test exercises the application from the user's perspective.
//
// A typical flow might be:
//
// 1. Open the application.
// 2. Navigate to a product.
// 3. Add the product to a cart.
// 4. Open checkout.
// 5. Submit the order.
// 6. Verify the resulting confirmation.
//
// End-to-end tests normally run against a real application environment
// rather than directly calling individual React components.

export interface PurchaseWorkflow {
  readonly steps: readonly string[];
}

export const purchaseWorkflow: PurchaseWorkflow = {
  steps: ["Open product page", "Add product to cart", "Open checkout", "Submit order", "Verify confirmation"],
};

// ---------------------------------------------------------------------
// 5. Test scope
// ---------------------------------------------------------------------

export interface TestScope {
  readonly testType: string;
  readonly unitsInvolved: string;
}

export const testScopes: readonly TestScope[] = [
  {
    testType: "Unit",
    unitsInvolved: "One focused unit",
  },
  {
    testType: "Integration",
    unitsInvolved: "Several collaborating units",
  },
  {
    testType: "End-to-end",
    unitsInvolved: "The application and its external boundaries",
  },
];

// Scope is one of the main differences between the testing levels.

// ---------------------------------------------------------------------
// 6. Test speed
// ---------------------------------------------------------------------

export interface TestSpeed {
  readonly level: string;
  readonly typicalReason: string;
}

export const testSpeed: readonly TestSpeed[] = [
  {
    level: "Unit",
    typicalReason: "Little setup and little infrastructure",
  },
  {
    level: "Integration",
    typicalReason: "Component trees and supporting infrastructure must run",
  },
  {
    level: "End-to-end",
    typicalReason: "Browser and application infrastructure must run",
  },
];

// Test speed is affected by implementation details and tooling.
// The pyramid describes a general tendency, not a guaranteed runtime.

// ---------------------------------------------------------------------
// 7. Test isolation
// ---------------------------------------------------------------------

export interface TestIsolation {
  readonly level: string;
  readonly isolation: string;
}

export const testIsolation: readonly TestIsolation[] = [
  {
    level: "Unit",
    isolation: "High",
  },
  {
    level: "Integration",
    isolation: "Moderate",
  },
  {
    level: "End-to-end",
    isolation: "Low",
  },
];

// More isolated tests generally have fewer external dependencies.
// Less isolated tests can reveal failures that isolated tests cannot see.

// ---------------------------------------------------------------------
// 8. Unit test example
// ---------------------------------------------------------------------

export const calculateSubtotal = (price: number, quantity: number): number => {
  return price * quantity;
};

// A unit test can exercise this function directly:
//
// expect(calculateSubtotal(10, 3)).toBe(30);
//
// No React rendering is necessary because the behavior is independent
// of the user interface.

// ---------------------------------------------------------------------
// 9. Integration test example
// ---------------------------------------------------------------------

export const SearchFormIntegrationExample: FC = (): ReactElement => {
  const handleSearch = (query: string): void => {
    console.log(`Searching for: ${query}`);
  };

  render(<SearchForm onSearch={handleSearch} />);

  return (
    <section>
      <h2>Search</h2>
      <p>{screen.queryByRole("textbox") ? "Search form rendered" : "Search form not rendered"}</p>
    </section>
  );
};

// In a real test file, render and screen would normally be used directly
// inside the test rather than during component rendering.
// This example shows the relationship between the React tree and
// Testing Library's DOM-oriented test APIs.

// ---------------------------------------------------------------------
// 10. End-to-end test example
// ---------------------------------------------------------------------

export interface BrowserWorkflow {
  readonly startUrl: string;
  readonly actions: readonly string[];
}

export const browserWorkflow: BrowserWorkflow = {
  startUrl: "/products",
  actions: ["Locate product by accessible name", "Activate Add to cart", "Open cart", "Verify product appears"],
};

// An end-to-end tool can execute these actions against the running application.
// The test does not need to know which React component owns the button.

// ---------------------------------------------------------------------
// 11. Pyramid proportions
// ---------------------------------------------------------------------

export interface TestDistribution {
  readonly unitTests: string;
  readonly integrationTests: string;
  readonly endToEndTests: string;
}

export const exampleTestDistribution: TestDistribution = {
  unitTests: "Many",
  integrationTests: "Some",
  endToEndTests: "Fewer",
};

// "Many / some / fewer" is more useful than prescribing a universal
// numerical ratio because applications have different risk profiles.

// ---------------------------------------------------------------------
// 12. Why unit tests are numerous
// ---------------------------------------------------------------------

export interface UnitTestAdvantage {
  readonly advantage: string;
}

export const unitTestAdvantages: readonly UnitTestAdvantage[] = [
  {
    advantage: "Fast feedback",
  },
  {
    advantage: "Small failure surface",
  },
  {
    advantage: "Simple setup",
  },
  {
    advantage: "Easy diagnosis",
  },
];

// Unit tests are particularly useful for deterministic business logic
// and other behavior that can be tested without rendering the application.

// ---------------------------------------------------------------------
// 13. Why integration tests matter
// ---------------------------------------------------------------------

export interface IntegrationTestAdvantage {
  readonly behavior: string;
}

export const integrationTestAdvantages: readonly IntegrationTestAdvantage[] = [
  {
    behavior: "Component interaction",
  },
  {
    behavior: "State transitions",
  },
  {
    behavior: "Form submission",
  },
  {
    behavior: "Context behavior",
  },
  {
    behavior: "User-visible UI changes",
  },
];

// Integration tests catch failures that can exist even when individual
// units work correctly in isolation.

// ---------------------------------------------------------------------
// 14. Why end-to-end tests matter
// ---------------------------------------------------------------------

export interface EndToEndAdvantage {
  readonly boundary: string;
}

export const endToEndAdvantages: readonly EndToEndAdvantage[] = [
  {
    boundary: "Routing",
  },
  {
    boundary: "Browser behavior",
  },
  {
    boundary: "Network integration",
  },
  {
    boundary: "Application startup",
  },
  {
    boundary: "Complete user workflows",
  },
];

// End-to-end tests verify that the pieces work together in an environment
// that is much closer to actual application usage.

// ---------------------------------------------------------------------
// 15. The pyramid is about feedback
// ---------------------------------------------------------------------

export interface FeedbackLayer {
  readonly level: string;
  readonly feedback: string;
}

export const feedbackLayers: readonly FeedbackLayer[] = [
  {
    level: "Unit",
    feedback: "Very focused",
  },
  {
    level: "Integration",
    feedback: "Behavior across boundaries",
  },
  {
    level: "End-to-end",
    feedback: "Complete workflow",
  },
];

// The testing pyramid is fundamentally a feedback strategy:
// obtain broad confidence without requiring every test to exercise
// the entire application.

// ---------------------------------------------------------------------
// 16. Avoid testing implementation details
// ---------------------------------------------------------------------

export interface ImplementationDetail {
  readonly detail: string;
  readonly userVisible: boolean;
}

export const implementationDetails: readonly ImplementationDetail[] = [
  {
    detail: "Internal component state variable name",
    userVisible: false,
  },
  {
    detail: "Private helper function name",
    userVisible: false,
  },
  {
    detail: "Accessible button name",
    userVisible: true,
  },
  {
    detail: "Visible validation message",
    userVisible: true,
  },
];

// Tests that focus on observable behavior tend to survive internal refactoring
// better than tests coupled to implementation details.

// ---------------------------------------------------------------------
// 17. User-visible behavior
// ---------------------------------------------------------------------

export interface ObservableBehavior {
  readonly behavior: string;
}

export const observableBehaviors: readonly ObservableBehavior[] = [
  {
    behavior: "A button is available to the user",
  },
  {
    behavior: "Submitting a form displays a validation message",
  },
  {
    behavior: "Selecting an item updates the visible selection",
  },
  {
    behavior: "Navigating to checkout displays the checkout page",
  },
];

// React Testing Library encourages testing the DOM as a user would observe it.

// ---------------------------------------------------------------------
// 18. Unit tests and pure functions
// ---------------------------------------------------------------------

export const isValidEmail = (value: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
};

// Pure functions are particularly suitable for unit tests because
// their output depends only on their inputs.

// ---------------------------------------------------------------------
// 19. Integration tests and component behavior
// ---------------------------------------------------------------------

export interface ToggleProps {
  readonly checked: boolean;
  readonly onChange: (checked: boolean) => void;
}

export const Toggle: FC<ToggleProps> = ({ checked, onChange }): ReactElement => {
  return (
    <button aria-pressed={checked} onClick={() => onChange(!checked)} type="button">
      {checked ? "Enabled" : "Disabled"}
    </button>
  );
};

// A component integration test can verify the relationship between
// rendered output and the callback produced by a user interaction.

// ---------------------------------------------------------------------
// 20. End-to-end tests and application behavior
// ---------------------------------------------------------------------

export interface CheckoutFlow {
  readonly prerequisite: string;
  readonly action: string;
  readonly result: string;
}

export const checkoutFlow: CheckoutFlow = {
  prerequisite: "A product is available",
  action: "Complete checkout",
  result: "Order confirmation is displayed",
};

// This workflow crosses multiple application boundaries and is therefore
// a natural candidate for an end-to-end test.

// ---------------------------------------------------------------------
// 21. Testing the same behavior at different levels
// ---------------------------------------------------------------------

export interface TestLevelComparison {
  readonly level: string;
  readonly target: string;
}

export const purchaseBehaviorTests: readonly TestLevelComparison[] = [
  {
    level: "Unit",
    target: "Calculate the order subtotal",
  },
  {
    level: "Integration",
    target: "Cart updates when a product is added",
  },
  {
    level: "End-to-end",
    target: "A user completes a purchase",
  },
];

// The same business area can have tests at several levels,
// with each level answering a different question.

// ---------------------------------------------------------------------
// 22. Avoid replacing all lower-level tests with E2E tests
// ---------------------------------------------------------------------

export interface EndToEndOveruseRisk {
  readonly risk: string;
  readonly consequence: string;
}

export const endToEndOveruseRisks: readonly EndToEndOveruseRisk[] = [
  {
    risk: "Using E2E tests for every small rule",
    consequence: "Slower feedback",
  },
  {
    risk: "Duplicating simple unit coverage as browser workflows",
    consequence: "More setup and maintenance",
  },
  {
    risk: "Large workflows for narrow failures",
    consequence: "Harder diagnosis",
  },
];

// End-to-end tests provide valuable confidence, but they are usually
// inefficient substitutes for focused lower-level tests.

// ---------------------------------------------------------------------
// 23. Avoid testing everything only at the unit level
// ---------------------------------------------------------------------

export interface UnitOnlyRisk {
  readonly risk: string;
  readonly consequence: string;
}

export const unitOnlyRisks: readonly UnitOnlyRisk[] = [
  {
    risk: "Testing components only through isolated helpers",
    consequence: "Integration failures can remain undetected",
  },
  {
    risk: "Mocking every dependency",
    consequence: "Tests may no longer represent real application behavior",
  },
];

// A strong test suite uses enough integration and end-to-end coverage
// to validate important boundaries.

// ---------------------------------------------------------------------
// 24. Test pyramid vs test trophy
// ---------------------------------------------------------------------

export interface TestingModel {
  readonly name: string;
  readonly emphasis: string;
}

export const testingModels: readonly TestingModel[] = [
  {
    name: "Testing pyramid",
    emphasis: "Many fast lower-level tests with fewer broad tests",
  },
  {
    name: "Testing trophy",
    emphasis: "Strong emphasis on integration tests around user-visible behavior",
  },
];

// These models are different ways of communicating test-distribution principles.
// Neither should be treated as a rigid mathematical requirement.

// ---------------------------------------------------------------------
// 25. React Testing Library and integration tests
// ---------------------------------------------------------------------

export interface TestingLibraryRole {
  readonly tool: string;
  readonly emphasis: string;
}

export const testingLibraryRole: TestingLibraryRole = {
  tool: "React Testing Library",
  emphasis: "Testing React behavior through the rendered DOM",
};

// React Testing Library is particularly suited to component and integration
// tests that interact with the UI through accessible queries.

// ---------------------------------------------------------------------
// 26. Browser-level testing
// ---------------------------------------------------------------------

export interface BrowserTestingRole {
  readonly tool: string;
  readonly emphasis: string;
}

export const browserTestingRole: BrowserTestingRole = {
  tool: "Browser automation",
  emphasis: "Testing complete application workflows in a browser",
};

// Browser automation tools are appropriate when the test needs the
// complete application environment rather than an isolated component tree.

// ---------------------------------------------------------------------
// 27. Choosing the lowest useful level
// ---------------------------------------------------------------------

export interface TestSelectionRule {
  readonly question: string;
}

export const testSelectionRules: readonly TestSelectionRule[] = [
  {
    question: "Can this behavior be verified without React or external infrastructure?",
  },
  {
    question: "Does the behavior require multiple React units working together?",
  },
  {
    question: "Does the behavior require the complete application and browser?",
  },
];

// Prefer the lowest test level that can meaningfully verify the behavior.
// Move upward when the behavior depends on broader integration boundaries.

// ---------------------------------------------------------------------
// 28. Risk-based testing
// ---------------------------------------------------------------------

export interface RiskArea {
  readonly area: string;
  readonly reason: string;
}

export const highRiskAreas: readonly RiskArea[] = [
  {
    area: "Authentication",
    reason: "Incorrect behavior can affect access to protected data",
  },
  {
    area: "Checkout",
    reason: "Incorrect behavior can affect completed purchases",
  },
  {
    area: "Data submission",
    reason: "Incorrect behavior can produce invalid or lost data",
  },
];

// Important workflows may justify more integration or end-to-end coverage
// than low-risk presentation details.

// ---------------------------------------------------------------------
// 29. Test redundancy
// ---------------------------------------------------------------------

export interface TestRedundancy {
  readonly lowerLevel: string;
  readonly higherLevel: string;
  readonly relationship: string;
}

export const testRedundancy: readonly TestRedundancy[] = [
  {
    lowerLevel: "Unit test",
    higherLevel: "Integration test",
    relationship: "Different scopes can provide complementary confidence",
  },
  {
    lowerLevel: "Integration test",
    higherLevel: "End-to-end test",
    relationship: "Broad tests should focus on workflows rather than repeat every detail",
  },
];

// Some overlap is useful, but every test should provide meaningful information.

// ---------------------------------------------------------------------
// 30. Failure diagnosis
// ---------------------------------------------------------------------

export interface FailureDiagnosis {
  readonly level: string;
  readonly typicalDiagnosis: string;
}

export const failureDiagnosis: readonly FailureDiagnosis[] = [
  {
    level: "Unit",
    typicalDiagnosis: "Usually localized to one behavior",
  },
  {
    level: "Integration",
    typicalDiagnosis: "Usually localized to an interaction or boundary",
  },
  {
    level: "End-to-end",
    typicalDiagnosis: "May require tracing several application layers",
  },
];

// Broader tests can provide stronger system confidence while producing
// a larger search space when they fail.

// ---------------------------------------------------------------------
// 31. Test maintenance
// ---------------------------------------------------------------------

export interface MaintenanceConcern {
  readonly level: string;
  readonly concern: string;
}

export const testMaintenance: readonly MaintenanceConcern[] = [
  {
    level: "Unit",
    concern: "Usually affected by local implementation changes",
  },
  {
    level: "Integration",
    concern: "Affected by component and boundary changes",
  },
  {
    level: "End-to-end",
    concern: "Affected by UI, routing, network, and environment changes",
  },
];

// Maintenance cost depends on both test scope and how stable the tested behavior is.

// ---------------------------------------------------------------------
// 32. A practical test portfolio
// ---------------------------------------------------------------------

export interface TestPortfolio {
  readonly unit: string;
  readonly integration: string;
  readonly endToEnd: string;
}

export const practicalTestPortfolio: TestPortfolio = {
  unit: "Focused logic and deterministic rules",
  integration: "Important component and application interactions",
  endToEnd: "Critical user journeys",
};

// This is a strategy rather than a fixed numerical distribution.

// ---------------------------------------------------------------------
// 33. Testing a validation rule
// ---------------------------------------------------------------------

export const validateUsername = (username: string): string | null => {
  if (username.trim().length === 0) {
    return "Username is required";
  }

  if (username.length < 3) {
    return "Username must contain at least 3 characters";
  }

  return null;
};

// A validation rule is naturally tested as a unit because its behavior
// does not require rendering a component.

// ---------------------------------------------------------------------
// 34. Testing a validation UI
// ---------------------------------------------------------------------

export interface UsernameFieldProps {
  readonly value: string;
  readonly error: string | null;
  readonly onChange: (value: string) => void;
}

export const UsernameField: FC<UsernameFieldProps> = ({ value, error, onChange }): ReactElement => {
  return (
    <div>
      <label htmlFor="username">Username</label>
      <input
        aria-describedby={error ? "username-error" : undefined}
        id="username"
        onChange={(event) => onChange(event.target.value)}
        value={value}
      />
      {error ? <p id="username-error">{error}</p> : null}
    </div>
  );
};

// The component's rendered validation state is a UI concern,
// so an integration test can verify what the user sees.

// ---------------------------------------------------------------------
// 35. Testing the complete form flow
// ---------------------------------------------------------------------

export interface FormWorkflow {
  readonly steps: readonly string[];
}

export const usernameFormWorkflow: FormWorkflow = {
  steps: ["Open the form", "Enter an invalid username", "Submit the form", "Observe the validation message"],
};

// If the form interacts with routing, networking, or other application
// infrastructure, the same workflow may also deserve broader integration
// or end-to-end coverage.

// ---------------------------------------------------------------------
// 36. Test pyramid limitations
// ---------------------------------------------------------------------

export interface PyramidLimitation {
  readonly limitation: string;
}

export const pyramidLimitations: readonly PyramidLimitation[] = [
  {
    limitation: "It does not specify exact test counts",
  },
  {
    limitation: "It does not account for every testing type",
  },
  {
    limitation: "It does not determine which behaviors are highest risk",
  },
  {
    limitation: "It does not replace engineering judgment",
  },
];

// The pyramid is a conceptual model for balancing feedback,
// not a universal test-plan formula.

// ---------------------------------------------------------------------
// 37. Component tests are not always purely unit tests
// ---------------------------------------------------------------------

export interface ComponentTestClassification {
  readonly question: string;
  readonly implication: string;
}

export const componentTestClassification: readonly ComponentTestClassification[] = [
  {
    question: "Does the test render one component with minimal dependencies?",
    implication: "It may function as a narrow unit-style test",
  },
  {
    question: "Does the test include providers, children, and interactions?",
    implication: "It is more accurately treated as an integration test",
  },
];

// Test classification should be based on what the test actually exercises,
// not simply on whether the subject happens to be a React component.

// ---------------------------------------------------------------------
// 38. Integration boundaries
// ---------------------------------------------------------------------

export interface IntegrationBoundary {
  readonly boundary: string;
  readonly example: string;
}

export const integrationBoundaries: readonly IntegrationBoundary[] = [
  {
    boundary: "Component to component",
    example: "Parent state controls child behavior",
  },
  {
    boundary: "Component to context",
    example: "Consumer reads provider state",
  },
  {
    boundary: "UI to application state",
    example: "Form submission updates visible state",
  },
  {
    boundary: "UI to data layer",
    example: "Loading and error states reflect a request",
  },
];

// Integration tests are valuable where behavior crosses meaningful boundaries.

// ---------------------------------------------------------------------
// 39. End-to-end boundaries
// ---------------------------------------------------------------------

export interface EndToEndBoundary {
  readonly boundary: string;
  readonly example: string;
}

export const endToEndBoundaries: readonly EndToEndBoundary[] = [
  {
    boundary: "Browser to application",
    example: "Navigation starts the requested route",
  },
  {
    boundary: "Application to backend",
    example: "A submitted form produces the expected server result",
  },
  {
    boundary: "User workflow",
    example: "A user completes checkout",
  },
];

// End-to-end tests validate multiple infrastructure boundaries together.

// ---------------------------------------------------------------------
// 40. Complete React testing example
// ---------------------------------------------------------------------

export interface GreetingProps {
  readonly name: string;
}

export const Greeting: FC<GreetingProps> = ({ name }): ReactElement => {
  return (
    <main>
      <h1>Hello, {name}</h1>
      <p>Welcome to the application.</p>
    </main>
  );
};

// A focused component test could render:
//
// render(<Greeting name="John Doe" />);
// expect(screen.getByRole("heading", {name: "Hello, John Doe"})).toBeInTheDocument();
//
// The assertion checks observable output rather than internal implementation.

// ---------------------------------------------------------------------
// 41. Complete testing strategy
// ---------------------------------------------------------------------

export interface TestingStrategy {
  readonly unitTests: readonly string[];
  readonly integrationTests: readonly string[];
  readonly endToEndTests: readonly string[];
}

export const applicationTestingStrategy: TestingStrategy = {
  unitTests: ["Validation rules", "Formatters", "Reducers", "Pure business logic"],
  integrationTests: ["Forms", "Component interactions", "Context behavior", "Important state transitions"],
  endToEndTests: ["Authentication workflow", "Checkout workflow", "Critical navigation flows"],
};

// The strategy assigns each kind of behavior to a test level that can
// verify it without unnecessarily expanding the test scope.

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - The testing pyramid organizes automated tests by scope, speed, and isolation.
// - Unit tests focus on small pieces of behavior and are generally fast and isolated.
// - Integration tests verify interactions between multiple units or application boundaries.
// - End-to-end tests verify complete user workflows through the running application.
// - The pyramid is a guideline, not a fixed numerical formula.
// - Unit tests are useful for deterministic logic such as validation, formatting, and reducers.
// - Integration tests are useful for component interactions, forms, context, and state transitions.
// - End-to-end tests are useful for critical workflows involving routing, browser behavior, and application infrastructure.
// - Lower-level tests generally provide faster and more localized feedback.
// - Higher-level tests generally provide broader confidence but can be slower and harder to diagnose.
// - React component tests can be unit-style or integration-style depending on how much of the application they exercise.
// - Tests should generally verify observable behavior rather than private implementation details.
// - React Testing Library is particularly suited to DOM-oriented component and integration testing.
// - Browser automation is appropriate for complete application workflows.
// - The lowest useful test level should usually be preferred for focused behavior.
// - Important or high-risk workflows may justify broader integration and end-to-end coverage.
// - End-to-end tests should not replace focused lower-level tests for every small rule.
// - Unit tests alone cannot establish that all application boundaries work together.
// - Some overlap between test levels is useful when the tests answer different questions.
// - A useful test portfolio contains focused unit tests, meaningful integration tests, and a smaller set of critical end-to-end workflows.
// - The testing pyramid is a strategy for balancing feedback speed, isolation, and system confidence rather than a universal test-count requirement.
