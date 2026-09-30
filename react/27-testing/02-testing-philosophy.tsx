/**
 * Testing Philosophy
 * ===================
 *
 * Testing philosophy describes the principles used to decide what should be tested,
 * how tests should interact with application behavior, and what kind of confidence
 * a test suite should provide. Effective tests focus on meaningful behavior, use
 * realistic boundaries where practical, and provide fast, reliable feedback when
 * application behavior changes.
 */

import { type FC, type ReactElement } from "react";

// ---------------------------------------------------------------------
// 1. What testing philosophy means
// ---------------------------------------------------------------------

// Testing philosophy is not a collection of testing APIs.
// It is a set of principles for deciding:
//
// - what behavior matters
// - where tests should interact with the system
// - which boundaries should be isolated
// - when dependencies should be replaced
// - how much confidence a test should provide
// - how test maintenance should be controlled

export interface TestingPrinciple {
  readonly principle: string;
  readonly purpose: string;
}

export const testingPrinciples: readonly TestingPrinciple[] = [
  {
    principle: "Test behavior",
    purpose: "Verify what the system does rather than how it is implemented",
  },
  {
    principle: "Prefer realistic interaction",
    purpose: "Exercise application behavior through meaningful boundaries",
  },
  {
    principle: "Keep tests deterministic",
    purpose: "Make failures reproducible and trustworthy",
  },
  {
    principle: "Use appropriate test scope",
    purpose: "Match test scope to the behavior being verified",
  },
];

// ---------------------------------------------------------------------
// 2. Test behavior, not implementation
// ---------------------------------------------------------------------

// A behavior-focused test asks:
//
// "What should the user or consuming code observe?"
//
// An implementation-focused test asks:
//
// "Which internal function, state variable, or component method was called?"
//
// The first question usually produces tests that survive internal refactoring
// more easily.

export interface BehaviorContract {
  readonly action: string;
  readonly observableResult: string;
}

export const searchBehavior: BehaviorContract = {
  action: "Submit a search",
  observableResult: "Matching results are displayed",
};

// The test should primarily verify the observable result.

// ---------------------------------------------------------------------
// 3. Implementation details
// ---------------------------------------------------------------------

export interface ImplementationDetail {
  readonly detail: string;
  readonly reasonToAvoid: string;
}

export const implementationDetails: readonly ImplementationDetail[] = [
  {
    detail: "Private state variable names",
    reasonToAvoid: "They are not part of the user-visible contract",
  },
  {
    detail: "Internal helper function calls",
    reasonToAvoid: "Helpers can be replaced without changing behavior",
  },
  {
    detail: "Component instance methods",
    reasonToAvoid: "They expose implementation structure rather than user behavior",
  },
  {
    detail: "Internal DOM structure",
    reasonToAvoid: "Markup can change while behavior remains the same",
  },
];

// Testing implementation details can make otherwise harmless refactoring
// produce failing tests.

// ---------------------------------------------------------------------
// 4. Observable behavior
// ---------------------------------------------------------------------

export interface ObservableBehavior {
  readonly behavior: string;
  readonly observation: string;
}

export const observableBehaviors: readonly ObservableBehavior[] = [
  {
    behavior: "A button is available",
    observation: "The button can be found by its accessible role and name",
  },
  {
    behavior: "A form rejects invalid input",
    observation: "A validation message is displayed",
  },
  {
    behavior: "A selection changes",
    observation: "The selected option becomes visible",
  },
];

// User-visible behavior is generally a stronger testing contract than
// the implementation used to produce that behavior.

// ---------------------------------------------------------------------
// 5. Tests as contracts
// ---------------------------------------------------------------------

// A test can act as an executable description of an expected behavior.
//
// The test should communicate:
//
// - the situation
// - the action
// - the expected result

export interface TestContract {
  readonly given: string;
  readonly when: string;
  readonly then: string;
}

export const searchTestContract: TestContract = {
  given: "A user is viewing the search form",
  when: "The user submits a valid search",
  then: "Matching results are displayed",
};

// A clear contract makes the purpose of the test understandable without
// reading the implementation under test.

// ---------------------------------------------------------------------
// 6. Tests should communicate intent
// ---------------------------------------------------------------------

export interface TestIntent {
  readonly testName: string;
  readonly behavior: string;
}

export const testIntent: TestIntent = {
  testName: "displays matching products after a valid search",
  behavior: "A successful search updates the visible results",
};

// A test name should describe behavior rather than implementation mechanics.

// ---------------------------------------------------------------------
// 7. Arrange, Act, Assert
// ---------------------------------------------------------------------

// A common test structure is:
//
// Arrange -> prepare the required state
// Act     -> perform the behavior being tested
// Assert  -> verify the result

export interface TestAnatomy {
  readonly arrange: string;
  readonly act: string;
  readonly assert: string;
}

export const testAnatomy: TestAnatomy = {
  arrange: "Render the form with its initial state",
  act: "Submit the form with valid input",
  assert: "Verify the expected result is visible",
};

// This structure separates setup, behavior, and verification.

// ---------------------------------------------------------------------
// 8. Given, when, then
// ---------------------------------------------------------------------

export const givenWhenThen: TestContract = {
  given: "The form is displayed",
  when: "The user submits valid input",
  then: "The success message is displayed",
};

// Given/When/Then expresses the same conceptual structure using
// behavior-oriented language.

// ---------------------------------------------------------------------
// 9. Prefer realistic interactions
// ---------------------------------------------------------------------

export interface InteractionPrinciple {
  readonly approach: string;
  readonly reason: string;
}

export const interactionPrinciples: readonly InteractionPrinciple[] = [
  {
    approach: "Click the rendered button",
    reason: "Exercises the interaction as the user performs it",
  },
  {
    approach: "Type into the rendered input",
    reason: "Exercises the input and event flow",
  },
  {
    approach: "Call an internal handler directly",
    reason: "Bypasses part of the user interaction path",
  },
];

// A realistic interaction can verify more of the actual behavior
// without requiring an end-to-end browser test.

// ---------------------------------------------------------------------
// 10. User interaction vs direct invocation
// ---------------------------------------------------------------------

export interface InteractionComparison {
  readonly method: string;
  readonly scope: string;
}

export const interactionComparison: readonly InteractionComparison[] = [
  {
    method: "User interaction",
    scope: "Rendered UI behavior",
  },
  {
    method: "Direct handler invocation",
    scope: "Implementation-level behavior",
  },
];

// Direct invocation can still be appropriate for isolated logic,
// but it should not replace interaction testing when interaction behavior
// itself is important.

// ---------------------------------------------------------------------
// 11. Accessible queries
// ---------------------------------------------------------------------

export interface QueryPrinciple {
  readonly query: string;
  readonly reason: string;
}

export const queryPrinciples: readonly QueryPrinciple[] = [
  {
    query: "Role",
    reason: "Represents how users and assistive technologies identify elements",
  },
  {
    query: "Label",
    reason: "Represents the accessible relationship between labels and controls",
  },
  {
    query: "Visible text",
    reason: "Represents user-visible content",
  },
];

// Accessible queries often create stronger behavioral contracts than
// selectors based on implementation-specific attributes.

// ---------------------------------------------------------------------
// 12. Test IDs
// ---------------------------------------------------------------------

export interface TestIdGuideline {
  readonly use: string;
  readonly guidance: string;
}

export const testIdGuideline: TestIdGuideline = {
  use: "Element has no useful accessible or semantic query",
  guidance: "Use a test ID as a fallback rather than the default query strategy",
};

// Test IDs are sometimes necessary, but they generally provide less
// information about how a user interacts with the interface.

// ---------------------------------------------------------------------
// 13. Test through public interfaces
// ---------------------------------------------------------------------

export interface PublicInterface {
  readonly interfaceName: string;
  readonly purpose: string;
}

export const publicInterfaces: readonly PublicInterface[] = [
  {
    interfaceName: "Rendered DOM",
    purpose: "Observe user-visible UI behavior",
  },
  {
    interfaceName: "Component props",
    purpose: "Provide supported component inputs",
  },
  {
    interfaceName: "Public function parameters",
    purpose: "Exercise supported function behavior",
  },
];

// Tests should normally interact with the same public surfaces that
// application code or users are expected to rely upon.

// ---------------------------------------------------------------------
// 14. Avoid private interfaces
// ---------------------------------------------------------------------

export interface PrivateInterface {
  readonly interfaceName: string;
  readonly problem: string;
}

export const privateInterfaces: readonly PrivateInterface[] = [
  {
    interfaceName: "Private helper function",
    problem: "Its existence is an implementation choice",
  },
  {
    interfaceName: "Internal state setter",
    problem: "Its structure can change without changing behavior",
  },
  {
    interfaceName: "Private module variable",
    problem: "It is not part of the public contract",
  },
];

// Tests coupled to private interfaces can discourage legitimate refactoring.

// ---------------------------------------------------------------------
// 15. Test outcomes
// ---------------------------------------------------------------------

export interface TestOutcome {
  readonly outcome: string;
  readonly value: string;
}

export const meaningfulOutcomes: readonly TestOutcome[] = [
  {
    outcome: "Rendered content",
    value: "What the user sees",
  },
  {
    outcome: "Accessible state",
    value: "What assistive technologies can observe",
  },
  {
    outcome: "Navigation",
    value: "Where the user is taken",
  },
  {
    outcome: "Submitted data",
    value: "What the application sends or stores",
  },
];

// The most valuable assertions usually describe meaningful outcomes.

// ---------------------------------------------------------------------
// 16. Avoid excessive assertions
// ---------------------------------------------------------------------

export interface AssertionGuideline {
  readonly strategy: string;
  readonly consequence: string;
}

export const assertionGuidelines: readonly AssertionGuideline[] = [
  {
    strategy: "Assert every implementation detail",
    consequence: "Tests become fragile",
  },
  {
    strategy: "Assert the complete expected behavior",
    consequence: "The test communicates the important contract",
  },
];

// More assertions do not automatically produce more confidence.
// Assertions should support the behavior the test is intended to verify.

// ---------------------------------------------------------------------
// 17. One reason to fail
// ---------------------------------------------------------------------

export interface TestFocus {
  readonly test: string;
  readonly primaryBehavior: string;
}

export const focusedTest: TestFocus = {
  test: "displays a validation message for an empty username",
  primaryBehavior: "Empty username validation",
};

// A focused test makes failures easier to interpret.

// ---------------------------------------------------------------------
// 18. Avoid giant tests
// ---------------------------------------------------------------------

export interface LargeTestRisk {
  readonly risk: string;
  readonly consequence: string;
}

export const largeTestRisks: readonly LargeTestRisk[] = [
  {
    risk: "One test performs many unrelated workflows",
    consequence: "Failures become difficult to diagnose",
  },
  {
    risk: "One test contains extensive setup",
    consequence: "The important behavior becomes harder to see",
  },
  {
    risk: "One test asserts unrelated outcomes",
    consequence: "A failure may have little connection to the named behavior",
  },
];

// Large workflows belong in broader integration or end-to-end coverage
// when they represent one meaningful user journey.

// ---------------------------------------------------------------------
// 19. Test isolation
// ---------------------------------------------------------------------

export interface IsolationPrinciple {
  readonly principle: string;
  readonly purpose: string;
}

export const isolationPrinciples: readonly IsolationPrinciple[] = [
  {
    principle: "Tests should not depend on execution order",
    purpose: "Any test can run independently",
  },
  {
    principle: "Tests should control their relevant inputs",
    purpose: "Failures remain reproducible",
  },
  {
    principle: "Tests should clean up shared resources",
    purpose: "State does not leak between tests",
  },
];

// Isolation improves reliability and makes failures easier to reproduce.

// ---------------------------------------------------------------------
// 20. Determinism
// ---------------------------------------------------------------------

export interface DeterminismRule {
  readonly source: string;
  readonly strategy: string;
}

export const determinismRules: readonly DeterminismRule[] = [
  {
    source: "Current time",
    strategy: "Control the clock when time affects behavior",
  },
  {
    source: "Randomness",
    strategy: "Control or inject random values",
  },
  {
    source: "Network",
    strategy: "Control external responses",
  },
  {
    source: "Shared state",
    strategy: "Reset state between tests",
  },
];

// Deterministic tests produce repeatable results under the same conditions.

// ---------------------------------------------------------------------
// 21. Avoid unnecessary mocking
// ---------------------------------------------------------------------

export interface MockingGuideline {
  readonly strategy: string;
  readonly effect: string;
}

export const mockingGuidelines: readonly MockingGuideline[] = [
  {
    strategy: "Mock every dependency automatically",
    effect: "Can remove useful integration behavior",
  },
  {
    strategy: "Mock only boundaries that need isolation",
    effect: "Preserves more realistic behavior",
  },
];

// Mocking is a tool for controlling boundaries, not a goal in itself.

// ---------------------------------------------------------------------
// 22. Mocking a network boundary
// ---------------------------------------------------------------------

export interface NetworkBoundary {
  readonly boundary: string;
  readonly reasonToControl: string;
}

export const networkBoundary: NetworkBoundary = {
  boundary: "HTTP request",
  reasonToControl: "Make the test deterministic and avoid real external services",
};

// Network mocking can preserve the component's request and response behavior
// while preventing the test from depending on an external server.

// ---------------------------------------------------------------------
// 23. Dependency injection
// ---------------------------------------------------------------------

export interface Clock {
  readonly now: () => number;
}

export const systemClock: Clock = {
  now: () => Date.now(),
};

export const getTimestamp = (clock: Clock): number => {
  return clock.now();
};

// Injecting a dependency can make deterministic testing easier
// without requiring a global mock.

// ---------------------------------------------------------------------
// 24. Pure functions
// ---------------------------------------------------------------------

export const addTax = (subtotal: number, rate: number): number => {
  return subtotal + subtotal * rate;
};

// Pure functions are naturally deterministic because they do not depend
// on external mutable state.

// ---------------------------------------------------------------------
// 25. Testability as a design concern
// ---------------------------------------------------------------------

export interface TestabilityProperty {
  readonly property: string;
  readonly effect: string;
}

export const testabilityProperties: readonly TestabilityProperty[] = [
  {
    property: "Explicit dependencies",
    effect: "Dependencies can be controlled in tests",
  },
  {
    property: "Pure transformations",
    effect: "Logic can be tested directly",
  },
  {
    property: "Stable public interfaces",
    effect: "Tests can target supported behavior",
  },
  {
    property: "Clear boundaries",
    effect: "Integration points can be tested intentionally",
  },
];

// Testability is often an architectural property rather than a testing-tool feature.

// ---------------------------------------------------------------------
// 26. Realistic boundaries
// ---------------------------------------------------------------------

export interface BoundaryChoice {
  readonly boundary: string;
  readonly testStrategy: string;
}

export const boundaryChoices: readonly BoundaryChoice[] = [
  {
    boundary: "Pure calculation",
    testStrategy: "Test directly",
  },
  {
    boundary: "React component interaction",
    testStrategy: "Render and interact with the DOM",
  },
  {
    boundary: "External HTTP service",
    testStrategy: "Control the network boundary",
  },
  {
    boundary: "Complete browser workflow",
    testStrategy: "Use end-to-end browser automation",
  },
];

// Different boundaries call for different test strategies.

// ---------------------------------------------------------------------
// 27. Confidence
// ---------------------------------------------------------------------

export interface ConfidenceSource {
  readonly source: string;
  readonly confidenceProvided: string;
}

export const confidenceSources: readonly ConfidenceSource[] = [
  {
    source: "Unit test",
    confidenceProvided: "Focused behavior is correct",
  },
  {
    source: "Integration test",
    confidenceProvided: "Collaborating units behave correctly together",
  },
  {
    source: "End-to-end test",
    confidenceProvided: "A complete workflow works in the application environment",
  },
];

// Confidence comes from relevant evidence, not simply from increasing
// the number of tests.

// ---------------------------------------------------------------------
// 28. Test quantity vs test quality
// ---------------------------------------------------------------------

export interface TestQuality {
  readonly metric: string;
  readonly limitation: string;
}

export const testQuantityLimitations: readonly TestQuality[] = [
  {
    metric: "Number of tests",
    limitation: "Does not indicate whether important behavior is covered",
  },
  {
    metric: "Code coverage percentage",
    limitation: "Does not prove that assertions are meaningful",
  },
  {
    metric: "Passing tests",
    limitation: "Does not prove untested behavior is correct",
  },
];

// A large test suite can still provide weak confidence if it tests
// the wrong behavior or relies heavily on unrealistic assumptions.

// ---------------------------------------------------------------------
// 29. Coverage is evidence, not proof
// ---------------------------------------------------------------------

export interface CoveragePrinciple {
  readonly statement: string;
}

export const coveragePrinciples: readonly CoveragePrinciple[] = [
  {
    statement: "Executed code is not necessarily correctly asserted",
  },
  {
    statement: "Untested branches can still contain important behavior",
  },
  {
    statement: "High coverage does not guarantee realistic integration",
  },
];

// Coverage should inform testing decisions rather than replace them.

// ---------------------------------------------------------------------
// 30. Regression protection
// ---------------------------------------------------------------------

export interface RegressionTest {
  readonly failure: string;
  readonly protection: string;
}

export const regressionProtection: readonly RegressionTest[] = [
  {
    failure: "Previously valid input becomes rejected",
    protection: "Keep a test for the intended valid behavior",
  },
  {
    failure: "A visible error disappears",
    protection: "Test the user-visible error behavior",
  },
  {
    failure: "A critical workflow stops completing",
    protection: "Keep a broader workflow test",
  },
];

// A useful regression test captures a behavior that must remain true.

// ---------------------------------------------------------------------
// 31. Tests as executable documentation
// ---------------------------------------------------------------------

export interface DocumentationValue {
  readonly test: string;
  readonly documentedBehavior: string;
}

export const testDocumentation: DocumentationValue = {
  test: "submits valid search input",
  documentedBehavior: "Valid search input produces search results",
};

// Well-named tests can explain expected behavior to developers
// without requiring separate prose documentation.

// ---------------------------------------------------------------------
// 32. Tests should survive refactoring
// ---------------------------------------------------------------------

export interface RefactoringScenario {
  readonly implementationChange: string;
  readonly expectedTestResult: string;
}

export const refactoringScenario: RefactoringScenario = {
  implementationChange: "Replace one internal helper with another",
  expectedTestResult: "Behavior-focused tests continue to pass",
};

// If a behavior has not changed, implementation refactoring should
// generally not require rewriting behavior-focused tests.

// ---------------------------------------------------------------------
// 33. Testing public contracts
// ---------------------------------------------------------------------

export interface PublicContractExample {
  readonly input: string;
  readonly output: string;
}

export const formatterContract: PublicContractExample = {
  input: "John Doe",
  output: "John Doe",
};

// A test can verify a public function contract without depending
// on how the implementation produces the result.

// ---------------------------------------------------------------------
// 34. Integration over excessive mocking
// ---------------------------------------------------------------------

export interface IntegrationPreference {
  readonly behavior: string;
  readonly preferredStrategy: string;
}

export const integrationPreference: readonly IntegrationPreference[] = [
  {
    behavior: "Parent and child components interact",
    preferredStrategy: "Render them together",
  },
  {
    behavior: "Provider supplies context",
    preferredStrategy: "Render through the provider",
  },
  {
    behavior: "Form submission updates UI",
    preferredStrategy: "Interact with the rendered form",
  },
];

// Testing collaborating units together can reveal integration failures
// that isolated mocks cannot represent.

// ---------------------------------------------------------------------
// 35. But not everything should be integrated
// ---------------------------------------------------------------------

export interface IsolationCandidate {
  readonly behavior: string;
  readonly reason: string;
}

export const isolationCandidates: readonly IsolationCandidate[] = [
  {
    behavior: "Tax calculation",
    reason: "No UI or infrastructure is required",
  },
  {
    behavior: "Date formatting",
    reason: "The transformation can be verified directly",
  },
  {
    behavior: "Input validation rule",
    reason: "The rule has a small deterministic contract",
  },
];

// Integration should be used where collaboration matters,
// not where isolation provides a simpler and clearer test.

// ---------------------------------------------------------------------
// 36. Avoid testing framework behavior
// ---------------------------------------------------------------------

export interface FrameworkBehavior {
  readonly behavior: string;
  readonly reason: string;
}

export const frameworkBehaviors: readonly FrameworkBehavior[] = [
  {
    behavior: "React renders JSX",
    reason: "This is framework behavior rather than application behavior",
  },
  {
    behavior: "A DOM button dispatches a click event",
    reason: "The browser platform provides this behavior",
  },
];

// Tests should focus on application behavior built on top of frameworks,
// rather than attempting to prove that React or the browser works.

// ---------------------------------------------------------------------
// 37. Test application decisions
// ---------------------------------------------------------------------

export interface ApplicationDecision {
  readonly condition: string;
  readonly result: string;
}

export const authorizationDecision: ApplicationDecision = {
  condition: "User does not have permission",
  result: "The protected action is unavailable",
};

// The application decision is meaningful behavior that deserves coverage.

// ---------------------------------------------------------------------
// 38. Test errors intentionally
// ---------------------------------------------------------------------

export interface ErrorScenario {
  readonly condition: string;
  readonly expectedBehavior: string;
}

export const errorScenario: ErrorScenario = {
  condition: "The request fails",
  expectedBehavior: "An appropriate error state is displayed",
};

// Error paths are part of application behavior and should not be treated
// as secondary cases.

// ---------------------------------------------------------------------
// 39. Test loading states intentionally
// ---------------------------------------------------------------------

export interface LoadingScenario {
  readonly condition: string;
  readonly expectedBehavior: string;
}

export const loadingScenario: LoadingScenario = {
  condition: "Data is being loaded",
  expectedBehavior: "The loading state is displayed",
};

// Asynchronous UI has multiple observable states:
// initial, loading, success, empty, and error.

// ---------------------------------------------------------------------
// 40. Test empty states
// ---------------------------------------------------------------------

export interface EmptyStateScenario {
  readonly condition: string;
  readonly expectedBehavior: string;
}

export const emptyStateScenario: EmptyStateScenario = {
  condition: "The request succeeds with no results",
  expectedBehavior: "The empty-state message is displayed",
};

// Empty states are distinct from successful states containing data.

// ---------------------------------------------------------------------
// 41. Test accessibility as behavior
// ---------------------------------------------------------------------

export interface AccessibilityBehavior {
  readonly behavior: string;
  readonly value: string;
}

export const accessibilityBehaviors: readonly AccessibilityBehavior[] = [
  {
    behavior: "Form control has an accessible name",
    value: "Users and assistive technologies can identify it",
  },
  {
    behavior: "Error is associated with the input",
    value: "The validation problem can be understood in context",
  },
];

// Accessibility can be tested as part of observable UI behavior.

// ---------------------------------------------------------------------
// 42. Test semantics, not CSS selectors
// ---------------------------------------------------------------------

export interface SelectorStrategy {
  readonly selector: string;
  readonly stability: string;
}

export const selectorStrategies: readonly SelectorStrategy[] = [
  {
    selector: "Accessible role and name",
    stability: "Behavior-oriented",
  },
  {
    selector: "Associated label",
    stability: "Behavior-oriented",
  },
  {
    selector: "Visible text",
    stability: "User-oriented",
  },
  {
    selector: ".button-primary",
    stability: "Implementation-oriented",
  },
];

// Semantic queries usually express more useful contracts than styling selectors.

// ---------------------------------------------------------------------
// 43. Test setup should be understandable
// ---------------------------------------------------------------------

export interface TestSetupGuideline {
  readonly guideline: string;
}

export const testSetupGuidelines: readonly TestSetupGuideline[] = [
  {
    guideline: "Keep common setup genuinely common",
  },
  {
    guideline: "Keep behavior-specific setup near the test",
  },
  {
    guideline: "Avoid hiding important behavior inside helpers",
  },
];

// Excessive abstraction can make a test harder to understand than
// repeating a small amount of straightforward setup.

// ---------------------------------------------------------------------
// 44. Shared test utilities
// ---------------------------------------------------------------------

export interface TestUtility {
  readonly name: string;
  readonly purpose: string;
}

export const sharedTestUtilities: readonly TestUtility[] = [
  {
    name: "renderWithProviders",
    purpose: "Render components with required application providers",
  },
  {
    name: "createTestUser",
    purpose: "Create consistent test data",
  },
];

// Shared helpers are useful when they reduce repetitive infrastructure setup
// without hiding the behavior being tested.

// ---------------------------------------------------------------------
// 45. Avoid abstraction for its own sake
// ---------------------------------------------------------------------

export interface TestAbstraction {
  readonly abstraction: string;
  readonly risk: string;
}

export const testAbstractionRisk: TestAbstraction = {
  abstraction: "Generic helper wrapping every assertion",
  risk: "The actual behavior becomes difficult to see",
};

// Test code should optimize for clarity rather than maximum reuse.

// ---------------------------------------------------------------------
// 46. Test data
// ---------------------------------------------------------------------

export interface TestUser {
  readonly name: string;
  readonly email: string;
}

export const testUser: TestUser = {
  name: "John Doe",
  email: "john.doe@example.com",
};

// Test data should be representative enough to exercise the behavior
// without introducing unnecessary complexity.

// ---------------------------------------------------------------------
// 47. Avoid unrealistic test data
// ---------------------------------------------------------------------

export interface TestDataGuideline {
  readonly strategy: string;
  readonly reason: string;
}

export const testDataGuidelines: readonly TestDataGuideline[] = [
  {
    strategy: "Use realistic values",
    reason: "Behavior should be tested against plausible application input",
  },
  {
    strategy: "Use minimal values for focused edge cases",
    reason: "The test should isolate the relevant boundary condition",
  },
];

// Test data should support the behavior under test rather than obscure it.

// ---------------------------------------------------------------------
// 48. Edge cases
// ---------------------------------------------------------------------

export interface EdgeCase {
  readonly input: string;
  readonly expectedBehavior: string;
}

export const usernameEdgeCases: readonly EdgeCase[] = [
  {
    input: "",
    expectedBehavior: "Required validation is displayed",
  },
  {
    input: "ab",
    expectedBehavior: "Minimum-length validation is displayed",
  },
  {
    input: "John Doe",
    expectedBehavior: "The value is accepted",
  },
];

// Edge cases should be selected based on actual behavior and risk,
// not simply added to increase the test count.

// ---------------------------------------------------------------------
// 49. Failure messages
// ---------------------------------------------------------------------

export interface FailureMessage {
  readonly quality: string;
  readonly value: string;
}

export const failureMessageQualities: readonly FailureMessage[] = [
  {
    quality: "Specific",
    value: "Identifies the expected behavior",
  },
  {
    quality: "Readable",
    value: "Explains the failure without requiring implementation knowledge",
  },
  {
    quality: "Local",
    value: "Makes the relevant test behavior easy to identify",
  },
];

// Good assertions and test names make failures actionable.

// ---------------------------------------------------------------------
// 50. Reliable tests
// ---------------------------------------------------------------------

export interface ReliabilityProperty {
  readonly property: string;
  readonly effect: string;
}

export const reliabilityProperties: readonly ReliabilityProperty[] = [
  {
    property: "Deterministic inputs",
    effect: "Repeatable outcomes",
  },
  {
    property: "Controlled external boundaries",
    effect: "Reduced environmental variation",
  },
  {
    property: "Independent tests",
    effect: "No order-dependent failures",
  },
  {
    property: "Meaningful assertions",
    effect: "Failures correspond to relevant behavior",
  },
];

// Reliability is necessary before a test suite can provide trustworthy feedback.

// ---------------------------------------------------------------------
// 51. Flaky tests
// ---------------------------------------------------------------------

export interface FlakyTestSignal {
  readonly signal: string;
}

export const flakyTestSignals: readonly FlakyTestSignal[] = [
  {
    signal: "The same test sometimes passes and sometimes fails without code changes",
  },
  {
    signal: "Tests depend on uncontrolled timing",
  },
  {
    signal: "Tests depend on shared mutable state",
  },
  {
    signal: "Tests depend on unstable external services",
  },
];

// Flakiness weakens trust in the test suite because failures stop being
// reliable indicators of actual regressions.

// ---------------------------------------------------------------------
// 52. Fast feedback
// ---------------------------------------------------------------------

export interface FeedbackProperty {
  readonly property: string;
  readonly effect: string;
}

export const feedbackProperties: readonly FeedbackProperty[] = [
  {
    property: "Fast unit tests",
    effect: "Immediate feedback during development",
  },
  {
    property: "Focused integration tests",
    effect: "Fast validation of important boundaries",
  },
  {
    property: "Critical end-to-end tests",
    effect: "Broader workflow confidence",
  },
];

// Different test levels complement one another in a feedback strategy.

// ---------------------------------------------------------------------
// 53. Test suite ownership
// ---------------------------------------------------------------------

export interface TestOwnership {
  readonly owner: string;
  readonly responsibility: string;
}

export const testOwnership: readonly TestOwnership[] = [
  {
    owner: "Feature team",
    responsibility: "Maintain feature behavior and regression coverage",
  },
  {
    owner: "Platform team",
    responsibility: "Maintain shared test infrastructure",
  },
];

// Tests should have clear ownership so that failures and maintenance work
// do not become nobody's responsibility.

// ---------------------------------------------------------------------
// 54. Testing as part of design
// ---------------------------------------------------------------------

export interface DesignForTesting {
  readonly designChoice: string;
  readonly testingBenefit: string;
}

export const designForTesting: readonly DesignForTesting[] = [
  {
    designChoice: "Separate pure logic from UI",
    testingBenefit: "Pure logic can be tested directly",
  },
  {
    designChoice: "Inject external dependencies",
    testingBenefit: "Dependencies can be controlled",
  },
  {
    designChoice: "Expose narrow public interfaces",
    testingBenefit: "Tests can target stable contracts",
  },
];

// Good application design often makes good testing easier as a consequence.

// ---------------------------------------------------------------------
// 55. Testing should influence architecture carefully
// ---------------------------------------------------------------------

export interface ArchitectureTestingBalance {
  readonly principle: string;
}

export const architectureTestingBalance: readonly ArchitectureTestingBalance[] = [
  {
    principle: "Do not distort the public API solely to make tests easier",
  },
  {
    principle: "Prefer designs that are both clear in production and testable",
  },
  {
    principle: "Use dependency injection when the dependency boundary is meaningful",
  },
];

// Testability should support good architecture rather than justify artificial abstractions.

// ---------------------------------------------------------------------
// 56. Test behavior at the right boundary
// ---------------------------------------------------------------------

export interface BoundarySelection {
  readonly behavior: string;
  readonly preferredBoundary: string;
}

export const boundarySelection: readonly BoundarySelection[] = [
  {
    behavior: "Pure calculation",
    preferredBoundary: "Function",
  },
  {
    behavior: "Rendered interaction",
    preferredBoundary: "Component and DOM",
  },
  {
    behavior: "Cross-feature workflow",
    preferredBoundary: "Application",
  },
];

// Choosing the right boundary keeps tests both meaningful and maintainable.

// ---------------------------------------------------------------------
// 57. A practical philosophy
// ---------------------------------------------------------------------

export interface PracticalPhilosophy {
  readonly principle: string;
}

export const practicalPhilosophy: readonly PracticalPhilosophy[] = [
  {
    principle: "Test important behavior rather than implementation structure",
  },
  {
    principle: "Prefer realistic interactions at UI boundaries",
  },
  {
    principle: "Keep deterministic logic easy to test in isolation",
  },
  {
    principle: "Control external dependencies when they would make tests unreliable",
  },
  {
    principle: "Use integration tests where collaboration is the behavior",
  },
  {
    principle: "Use end-to-end tests for critical complete workflows",
  },
  {
    principle: "Keep tests readable enough to explain the expected behavior",
  },
  {
    principle: "Treat failures as feedback, not merely as pass/fail statistics",
  },
];

// ---------------------------------------------------------------------
// 58. Complete component example
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

// A behavior-focused test can render the component and verify its
// accessible heading without inspecting the component's internal implementation.
//
// render(<Greeting name="John Doe" />);
// expect(screen.getByRole("heading", {name: "Hello, John Doe"})).toBeInTheDocument();

// ---------------------------------------------------------------------
// 59. Complete philosophy example
// ---------------------------------------------------------------------

export interface TestingApproach {
  readonly behavior: string;
  readonly testLevel: "unit" | "integration" | "end-to-end";
  readonly interaction: string;
}

export const testingApproach: readonly TestingApproach[] = [
  {
    behavior: "Calculate a subtotal",
    testLevel: "unit",
    interaction: "Call the public calculation function",
  },
  {
    behavior: "Display validation after form submission",
    testLevel: "integration",
    interaction: "Render the form and submit it",
  },
  {
    behavior: "Complete checkout",
    testLevel: "end-to-end",
    interaction: "Perform the complete browser workflow",
  },
];

// Each test uses the boundary that best represents the behavior it verifies.

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Testing philosophy defines how a test suite should produce useful and trustworthy feedback.
// - Tests should primarily verify behavior rather than implementation details.
// - Observable behavior is generally a stronger contract than private implementation structure.
// - Tests should communicate intent through clear names and focused scenarios.
// - Arrange, Act, Assert and Given, When, Then provide useful structures for expressing test behavior.
// - Tests should interact with public interfaces rather than private implementation details.
// - Accessible queries often provide stronger UI contracts than implementation-specific selectors.
// - Test IDs are useful as a fallback when more meaningful queries are not available.
// - Realistic user interactions can reveal integration problems that direct handler invocation can bypass.
// - Direct testing remains appropriate for deterministic logic that does not require UI integration.
// - Tests should be deterministic, isolated, and independent of execution order.
// - External dependencies should be controlled when they introduce unwanted nondeterminism or environmental coupling.
// - Mocking is a boundary-control technique rather than a goal in itself.
// - Dependency injection can make meaningful external dependencies easier to control.
// - Pure functions are naturally suitable for focused unit tests.
// - Integration tests are appropriate when collaboration between components or application boundaries is itself the behavior.
// - End-to-end tests are appropriate for critical workflows that require the complete application environment.
// - Test quantity does not by itself indicate test quality or confidence.
// - Code coverage is useful evidence but does not prove that behavior is correctly tested.
// - Important error, loading, empty, and accessibility states are part of application behavior and should be tested intentionally.
// - Tests should be readable enough to act as executable documentation.
// - Focused tests are generally easier to diagnose and maintain than large tests containing unrelated behavior.
// - Shared test utilities are useful when they reduce repetitive infrastructure setup without hiding the behavior under test.
// - Test abstractions should improve clarity rather than maximize reuse.
// - Test data should be realistic for normal scenarios and deliberately chosen for edge cases.
// - A reliable test suite provides repeatable feedback and maintains trust in failures.
// - Testability is partly an architectural property created by clear boundaries, explicit dependencies, pure logic, and stable public interfaces.
// - Good testing supports good architecture but should not distort production design solely to make tests easier.
// - The appropriate test boundary depends on the behavior being verified, not simply on the type of code being tested.
