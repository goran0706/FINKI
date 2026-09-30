/**
 * Test Anatomy
 * ============
 *
 * A test describes a behavior that should remain true under defined conditions.
 * Its anatomy consists of the test description, setup, action, assertions, and
 * cleanup needed to establish and verify that behavior clearly and reliably.
 */

import { type FC, type ReactElement } from "react";

// ---------------------------------------------------------------------
// 1. The basic structure of a test
// ---------------------------------------------------------------------

// A test commonly follows three behavioral phases:
//
// Arrange -> establish the conditions
// Act     -> perform the behavior
// Assert  -> verify the result
//
// Cleanup may also be required when the test creates resources or state
// that must not leak into other tests.

// ---------------------------------------------------------------------
// 2. Arrange
// ---------------------------------------------------------------------

// Arrange prepares everything the behavior under test needs.
//
// This can include:
// - rendering a component
// - creating test data
// - configuring dependencies
// - establishing initial state
// - preparing controlled external responses

export interface ArrangeStep {
  readonly purpose: string;
  readonly example: string;
}

export const arrangeSteps: readonly ArrangeStep[] = [
  {
    purpose: "Provide initial component props",
    example: 'Render a greeting with the name "John Doe"',
  },
  {
    purpose: "Create test data",
    example: "Create a product with a known price",
  },
  {
    purpose: "Control a dependency",
    example: "Configure the repository to return a known product",
  },
];

// Arrange should establish the minimum state required to exercise the behavior.

// ---------------------------------------------------------------------
// 3. Act
// ---------------------------------------------------------------------

// Act performs the behavior being tested.
//
// For a React component, this is commonly a user interaction such as:
// - clicking a button
// - typing into an input
// - selecting an option
// - submitting a form
//
// For a pure function, Act may simply be calling the function.

export interface ActStep {
  readonly behavior: string;
  readonly example: string;
}

export const actSteps: readonly ActStep[] = [
  {
    behavior: "Submit a form",
    example: "The user submits the search form",
  },
  {
    behavior: "Click a button",
    example: "The user clicks the Save button",
  },
  {
    behavior: "Call a function",
    example: "The test passes input to a formatter",
  },
];

// The Act phase should represent the behavior whose result matters.

// ---------------------------------------------------------------------
// 4. Assert
// ---------------------------------------------------------------------

// Assert verifies that the expected behavior occurred.
//
// Assertions should describe meaningful outcomes rather than implementation
// details that are not part of the behavior contract.

export interface AssertStep {
  readonly outcome: string;
  readonly example: string;
}

export const assertSteps: readonly AssertStep[] = [
  {
    outcome: "Visible content",
    example: "The success message is displayed",
  },
  {
    outcome: "Accessible state",
    example: "The button is disabled",
  },
  {
    outcome: "Returned value",
    example: "The formatter returns the expected string",
  },
];

// Assertions are the part of a test that determines whether the behavior
// under test satisfies its expected contract.

// ---------------------------------------------------------------------
// 5. Cleanup
// ---------------------------------------------------------------------

// Cleanup removes resources or state created by the test.
//
// Testing tools often provide automatic cleanup for rendered React trees,
// but other resources may still require explicit cleanup:
//
// - timers
// - subscriptions
// - event listeners
// - temporary files
// - mocked global state
// - network handlers

export interface CleanupStep {
  readonly resource: string;
  readonly cleanup: string;
}

export const cleanupSteps: readonly CleanupStep[] = [
  {
    resource: "Timer",
    cleanup: "Restore or clear the timer",
  },
  {
    resource: "Event listener",
    cleanup: "Remove the listener",
  },
  {
    resource: "Temporary state",
    cleanup: "Restore the original state",
  },
];

// Cleanup prevents state created by one test from affecting another test.

// ---------------------------------------------------------------------
// 6. A complete Arrange, Act, Assert flow
// ---------------------------------------------------------------------

export interface TestFlow {
  readonly arrange: string;
  readonly act: string;
  readonly assert: string;
}

export const saveFormTestFlow: TestFlow = {
  arrange: "Render the form with valid initial data",
  act: "Submit the form",
  assert: "The success message is displayed",
};

// Conceptually:
//
// Arrange:
// render(<ProfileForm />)
//
// Act:
// await user.click(screen.getByRole("button", {name: "Save"}))
//
// Assert:
// expect(screen.getByText("Saved")).toBeInTheDocument()

// ---------------------------------------------------------------------
// 7. Given, When, Then
// ---------------------------------------------------------------------

// Given, When, Then expresses the same structure using behavior-oriented
// language:
//
// Given -> the initial conditions
// When  -> the behavior
// Then  -> the expected outcome

export interface GivenWhenThen {
  readonly given: string;
  readonly when: string;
  readonly then: string;
}

export const saveFormScenario: GivenWhenThen = {
  given: "The form contains valid information",
  when: "The user submits the form",
  then: "A success message is displayed",
};

// Given, When, Then is especially useful when a test is intended to read
// like a specification of application behavior.

// ---------------------------------------------------------------------
// 8. Test descriptions
// ---------------------------------------------------------------------

// A test description should explain the behavior that is expected.
//
// Prefer:
// "displays an error when the email is invalid"
//
// Avoid:
// "calls setError when handleSubmit runs"

export interface TestDescription {
  readonly description: string;
  readonly describes: string;
}

export const testDescription: TestDescription = {
  description: "displays an error when the email is invalid",
  describes: "Observable validation behavior",
};

// The description should remain meaningful even if the implementation changes.

// ---------------------------------------------------------------------
// 9. Behavior-focused test names
// ---------------------------------------------------------------------

export const behaviorTestNames: readonly string[] = [
  "displays the submitted name",
  "shows an error for an invalid email",
  "disables the button while saving",
  "renders an empty state when no results exist",
  "shows the saved state after a successful submission",
];

// These names communicate expected behavior rather than implementation structure.

// ---------------------------------------------------------------------
// 10. Implementation-focused names
// ---------------------------------------------------------------------

export const implementationTestNames: readonly string[] = [
  "calls setError",
  "invokes handleSubmit",
  "updates the isSaving state variable",
  "calls the internal formatter",
];

// These names expose implementation details and can become obsolete
// when the implementation is refactored.

// ---------------------------------------------------------------------
// 11. Setup data
// ---------------------------------------------------------------------

export interface Product {
  readonly id: string;
  readonly name: string;
  readonly price: number;
}

export const product: Product = {
  id: "product-1",
  name: "Example Product",
  price: 49.99,
};

// Test data should be explicit enough that the behavior under test
// is easy to understand.

// ---------------------------------------------------------------------
// 12. Minimal setup
// ---------------------------------------------------------------------

export interface TestUser {
  readonly name: string;
  readonly email: string;
}

export const testUser: TestUser = {
  name: "John Doe",
  email: "john.doe@example.com",
};

// Good setup contains what the test needs without unrelated state.

// Avoid creating large objects containing dozens of properties when
// the behavior only depends on two or three of them.

// ---------------------------------------------------------------------
// 13. Arrange only what matters
// ---------------------------------------------------------------------

export interface RelevantInput {
  readonly name: string;
  readonly email: string;
}

export const relevantInput: RelevantInput = {
  name: "John Doe",
  email: "john.doe@example.com",
};

// The test should make the relevant input obvious.

// ---------------------------------------------------------------------
// 14. One behavior per test
// ---------------------------------------------------------------------

export interface FocusedBehavior {
  readonly behavior: string;
  readonly reason: string;
}

export const focusedBehavior: FocusedBehavior = {
  behavior: "Displays a validation error for an invalid email",
  reason: "A failure points directly to the validation behavior",
};

// A test can contain multiple assertions when they collectively verify
// one behavior. "One assertion per test" is not a universal requirement.

// ---------------------------------------------------------------------
// 15. Multiple assertions
// ---------------------------------------------------------------------

export interface AssertionGroup {
  readonly behavior: string;
  readonly assertions: readonly string[];
}

export const successfulSubmissionAssertions: AssertionGroup = {
  behavior: "Successful form submission",
  assertions: ["The success message is visible", "The form is no longer submitting"],
};

// These assertions describe different observable consequences of
// the same successful submission behavior.

// ---------------------------------------------------------------------
// 16. Unrelated assertions
// ---------------------------------------------------------------------

export const unrelatedAssertions: readonly string[] = [
  "The success message is visible",
  "The navigation menu contains five links",
  "The footer contains the current year",
];

// Combining unrelated assertions makes the test's purpose less clear
// and makes failures harder to diagnose.

// ---------------------------------------------------------------------
// 17. Preconditions
// ---------------------------------------------------------------------

export interface Preconditions {
  readonly condition: string;
  readonly purpose: string;
}

export const preconditions: readonly Preconditions[] = [
  {
    condition: "The user is authenticated",
    purpose: "Required before accessing the protected form",
  },
  {
    condition: "The form contains valid data",
    purpose: "Required before testing successful submission",
  },
];

// Preconditions belong in Arrange because they establish the situation
// in which the behavior is expected to occur.

// ---------------------------------------------------------------------
// 18. Actions
// ---------------------------------------------------------------------

export interface UserAction {
  readonly action: string;
  readonly effect: string;
}

export const userActions: readonly UserAction[] = [
  {
    action: "Type into the email field",
    effect: "Updates the entered email",
  },
  {
    action: "Click Save",
    effect: "Starts form submission",
  },
];

// The Act phase should contain the meaningful action rather than
// unrelated setup operations.

// ---------------------------------------------------------------------
// 19. Assertions should verify outcomes
// ---------------------------------------------------------------------

export interface OutcomeAssertion {
  readonly outcome: string;
  readonly implementationDetail: string;
}

export const outcomeAssertion: OutcomeAssertion = {
  outcome: "A success message is displayed",
  implementationDetail: "A success state variable became true",
};

// Prefer asserting the outcome when the state variable itself is not
// part of the public contract.

// ---------------------------------------------------------------------
// 20. Querying the rendered UI
// ---------------------------------------------------------------------

export interface QueryExample {
  readonly query: string;
  readonly target: string;
}

export const queryExamples: readonly QueryExample[] = [
  {
    query: 'getByRole("button", {name: "Save"})',
    target: "The accessible Save button",
  },
  {
    query: 'getByLabelText("Email")',
    target: "The form control associated with the Email label",
  },
  {
    query: 'getByText("Saved")',
    target: "Visible success content",
  },
];

// Queries are part of how the test locates observable behavior.

// ---------------------------------------------------------------------
// 21. Query the same way users identify elements
// ---------------------------------------------------------------------

export interface UserOrientedQuery {
  readonly interface: string;
  readonly reason: string;
}

export const userOrientedQueries: readonly UserOrientedQuery[] = [
  {
    interface: "Accessible role",
    reason: "Reflects how users and assistive technologies identify controls",
  },
  {
    interface: "Accessible label",
    reason: "Reflects the relationship between a control and its label",
  },
  {
    interface: "Visible text",
    reason: "Reflects user-visible content",
  },
];

// User-oriented queries create tests that are less coupled to implementation details.

// ---------------------------------------------------------------------
// 22. The role of the assertion library
// ---------------------------------------------------------------------

// A testing framework typically provides the test lifecycle:
//
// describe(...)
// it(...) / test(...)
//
// An assertion library provides expectations:
//
// expect(...)
//
// A UI testing library provides mechanisms for rendering and interacting
// with the UI.
//
// These responsibilities are conceptually separate even when tools
// package some of them together.

export interface TestingLayer {
  readonly layer: string;
  readonly responsibility: string;
}

export const testingLayers: readonly TestingLayer[] = [
  {
    layer: "Test runner",
    responsibility: "Discovers and executes tests",
  },
  {
    layer: "Assertion library",
    responsibility: "Expresses expected results",
  },
  {
    layer: "UI testing library",
    responsibility: "Renders and interacts with UI",
  },
];

// ---------------------------------------------------------------------
// 23. Test runner structure
// ---------------------------------------------------------------------

// A test runner commonly provides a structure similar to:
//
// describe("SearchForm", () => {
//     it("displays results after a successful search", async () => {
//         // Arrange
//         // Act
//         // Assert
//     });
// });
//
// The exact API depends on the test runner.

// The test anatomy remains the same regardless of the runner.

// ---------------------------------------------------------------------
// 24. describe blocks
// ---------------------------------------------------------------------

export interface DescribeBlock {
  readonly subject: string;
  readonly purpose: string;
}

export const describeBlock: DescribeBlock = {
  subject: "SearchForm",
  purpose: "Group tests related to the search form behavior",
};

// A describe block can organize related tests, but excessive nesting
// can make the test hierarchy harder to read.

// ---------------------------------------------------------------------
// 25. Test cases
// ---------------------------------------------------------------------

export interface TestCase {
  readonly name: string;
  readonly behavior: string;
}

export const testCases: readonly TestCase[] = [
  {
    name: "displays results after a successful search",
    behavior: "Successful search behavior",
  },
  {
    name: "shows an error when the search fails",
    behavior: "Search failure behavior",
  },
  {
    name: "shows an empty state when no results are returned",
    behavior: "Empty search result behavior",
  },
];

// Each test case should describe one coherent behavior.

// ---------------------------------------------------------------------
// 26. Nested organization
// ---------------------------------------------------------------------

export interface TestOrganization {
  readonly level: string;
  readonly example: string;
}

export const testOrganization: readonly TestOrganization[] = [
  {
    level: "Feature",
    example: "SearchForm",
  },
  {
    level: "Scenario",
    example: "Successful submission",
  },
];

// Grouping should help readers locate behavior rather than force them
// to navigate a deeply nested hierarchy.

// ---------------------------------------------------------------------
// 27. Async tests
// ---------------------------------------------------------------------

export interface AsyncTest {
  readonly arrange: string;
  readonly act: string;
  readonly assert: string;
}

export const asyncTest: AsyncTest = {
  arrange: "Render the component with a controlled response",
  act: "Submit the form and wait for the result",
  assert: "The returned content is displayed",
};

// Asynchronous tests must wait for the behavior they are verifying.

// ---------------------------------------------------------------------
// 28. Do not assert too early
// ---------------------------------------------------------------------

export interface AsyncFailure {
  readonly incorrectApproach: string;
  readonly problem: string;
}

export const asyncFailure: AsyncFailure = {
  incorrectApproach: "Assert that the result exists immediately after starting the request",
  problem: "The asynchronous update may not have occurred yet",
};

// The test should synchronize with the behavior rather than rely on
// arbitrary delays.

// ---------------------------------------------------------------------
// 29. Waiting for behavior
// ---------------------------------------------------------------------

export interface WaitForBehavior {
  readonly behavior: string;
  readonly synchronization: string;
}

export const waitForBehavior: WaitForBehavior = {
  behavior: "A result appears after an asynchronous request",
  synchronization: "Wait for the result to become observable",
};

// Testing Library provides asynchronous utilities for this purpose.
// The synchronization should correspond to the expected behavior.

// ---------------------------------------------------------------------
// 30. Avoid arbitrary delays
// ---------------------------------------------------------------------

export const arbitraryDelayProblem = {
  strategy: "Wait for 1000 milliseconds",
  problem: "The delay does not establish that the expected behavior occurred",
};

// Fixed delays make tests slower and can still produce race conditions.

// ---------------------------------------------------------------------
// 31. Error behavior
// ---------------------------------------------------------------------

export interface ErrorTestAnatomy {
  readonly arrange: string;
  readonly act: string;
  readonly assert: string;
}

export const errorTestAnatomy: ErrorTestAnatomy = {
  arrange: "Configure the dependency to fail",
  act: "Trigger the request",
  assert: "The error state is displayed",
};

// Error paths should have the same deliberate test structure as success paths.

// ---------------------------------------------------------------------
// 32. Loading behavior
// ---------------------------------------------------------------------

export const loadingTestAnatomy: TestFlow = {
  arrange: "Render the component with a pending operation",
  act: "Start the operation",
  assert: "The loading indicator is displayed",
};

// Loading is observable behavior and can be tested independently
// from the eventual success or failure state.

// ---------------------------------------------------------------------
// 33. Empty behavior
// ---------------------------------------------------------------------

export const emptyStateTestAnatomy: TestFlow = {
  arrange: "Configure the dependency to return no results",
  act: "Trigger the search",
  assert: "The empty-state message is displayed",
};

// Empty results are different behavior from a request failure.

// ---------------------------------------------------------------------
// 34. Accessibility assertions
// ---------------------------------------------------------------------

export interface AccessibilityAssertion {
  readonly behavior: string;
  readonly verification: string;
}

export const accessibilityAssertions: readonly AccessibilityAssertion[] = [
  {
    behavior: "A button has an accessible name",
    verification: "Query the button by role and accessible name",
  },
  {
    behavior: "An input has an associated label",
    verification: "Query the input through its accessible label",
  },
];

// Accessibility assertions can verify that the interface exposes
// meaningful semantics to users and assistive technologies.

// ---------------------------------------------------------------------
// 35. State transitions
// ---------------------------------------------------------------------

export interface StateTransition {
  readonly initialState: string;
  readonly action: string;
  readonly resultingState: string;
}

export const saveStateTransition: StateTransition = {
  initialState: "Idle",
  action: "Submit the form",
  resultingState: "Saving",
};

// Tests can verify meaningful state transitions through their observable effects.

// ---------------------------------------------------------------------
// 36. State should usually be observed indirectly
// ---------------------------------------------------------------------

export interface StateObservation {
  readonly internalState: string;
  readonly observableEffect: string;
}

export const stateObservation: StateObservation = {
  internalState: "isSaving === true",
  observableEffect: "The Save button is disabled",
};

// If the disabled state is the public behavior, assert the disabled button
// rather than the internal state variable.

// ---------------------------------------------------------------------
// 37. Testing callbacks
// ---------------------------------------------------------------------

export interface CallbackBehavior {
  readonly userAction: string;
  readonly observableResult: string;
}

export const callbackBehavior: CallbackBehavior = {
  userAction: "Select an option",
  observableResult: "The selected option is displayed",
};

// A callback may be an implementation mechanism. The important test
// is often the behavior produced by the callback.

// ---------------------------------------------------------------------
// 38. When callback invocation itself matters
// ---------------------------------------------------------------------

export interface CallbackContract {
  readonly componentBehavior: string;
  readonly contract: string;
}

export const callbackContract: CallbackContract = {
  componentBehavior: "Notify the parent when the selection changes",
  contract: "The supplied callback receives the selected value",
};

// Testing a callback directly can be appropriate when invoking the callback
// is itself part of the component's public contract.

// ---------------------------------------------------------------------
// 39. Test data builders
// ---------------------------------------------------------------------

export const createTestProduct = (overrides: Partial<Product> = {}): Product => {
  return {
    id: "product-1",
    name: "Example Product",
    price: 49.99,
    ...overrides,
  };
};

// A small builder can reduce repetitive setup while keeping defaults explicit.

// ---------------------------------------------------------------------
// 40. Test data builders should stay simple
// ---------------------------------------------------------------------

export const discountedProduct = createTestProduct({
  price: 29.99,
});

// The builder should make important variations obvious at the call site.

// ---------------------------------------------------------------------
// 41. Setup helpers
// ---------------------------------------------------------------------

export interface RenderSetup {
  readonly name: string;
  readonly email: string;
}

export const createRenderSetup = (): RenderSetup => {
  return {
    name: "John Doe",
    email: "john.doe@example.com",
  };
};

// Helpers are useful when they reduce repetitive infrastructure setup.

// ---------------------------------------------------------------------
// 42. Avoid hidden setup
// ---------------------------------------------------------------------

export const hiddenSetupProblem: readonly string[] = [
  "The helper performs network configuration",
  "The helper creates several unrelated objects",
  "The helper changes global state",
];

// When important behavior is hidden inside a helper, the test can become
// difficult to understand from the test body alone.

// ---------------------------------------------------------------------
// 43. Hooks and lifecycle
// ---------------------------------------------------------------------

export interface LifecycleOperation {
  readonly operation: string;
  readonly purpose: string;
}

export const lifecycleOperations: readonly LifecycleOperation[] = [
  {
    operation: "beforeEach",
    purpose: "Prepare state shared by tests when appropriate",
  },
  {
    operation: "afterEach",
    purpose: "Clean up resources after each test",
  },
  {
    operation: "beforeAll",
    purpose: "Perform expensive setup shared by a test group when safe",
  },
  {
    operation: "afterAll",
    purpose: "Release resources created for a test group",
  },
];

// Lifecycle hooks can reduce duplication, but shared mutable state should
// not make tests depend on one another.

// ---------------------------------------------------------------------
// 44. Test isolation and hooks
// ---------------------------------------------------------------------

export interface HookGuideline {
  readonly guideline: string;
}

export const hookGuidelines: readonly HookGuideline[] = [
  {
    guideline: "Reset mutable state after each test when necessary",
  },
  {
    guideline: "Restore mocked globals after each test",
  },
  {
    guideline: "Avoid relying on a previous test to establish state",
  },
];

// Every test should remain understandable and executable independently.

// ---------------------------------------------------------------------
// 45. Test failure anatomy
// ---------------------------------------------------------------------

export interface FailureAnatomy {
  readonly part: string;
  readonly value: string;
}

export const failureAnatomy: readonly FailureAnatomy[] = [
  {
    part: "Test name",
    value: "Identifies the behavior that failed",
  },
  {
    part: "Assertion",
    value: "Identifies the expected and observed result",
  },
  {
    part: "Stack trace",
    value: "Identifies where the failure occurred",
  },
];

// Clear test structure makes failure output easier to interpret.

// ---------------------------------------------------------------------
// 46. Assertion messages
// ---------------------------------------------------------------------

export interface AssertionQuality {
  readonly quality: string;
  readonly result: string;
}

export const assertionQuality: readonly AssertionQuality[] = [
  {
    quality: "Behavior-specific",
    result: "The failure points toward the relevant behavior",
  },
  {
    quality: "Implementation-specific",
    result: "The failure may be difficult to interpret after refactoring",
  },
];

// Assertion output is most useful when it describes the expected contract.

// ---------------------------------------------------------------------
// 47. Test order
// ---------------------------------------------------------------------

export interface TestOrderPrinciple {
  readonly principle: string;
}

export const testOrderPrinciples: readonly TestOrderPrinciple[] = [
  {
    principle: "A test should not require another test to run first",
  },
  {
    principle: "Changing test order should not change the result",
  },
  {
    principle: "Shared setup should not depend on execution order",
  },
];

// Order independence is an important property of isolated tests.

// ---------------------------------------------------------------------
// 48. Test determinism
// ---------------------------------------------------------------------

export interface DeterminismSource {
  readonly source: string;
  readonly control: string;
}

export const determinismSources: readonly DeterminismSource[] = [
  {
    source: "Current time",
    control: "Use a controlled clock when time affects the behavior",
  },
  {
    source: "Random values",
    control: "Provide deterministic values when randomness is relevant",
  },
  {
    source: "Network responses",
    control: "Control the external response",
  },
];

// Determinism makes failures reproducible.

// ---------------------------------------------------------------------
// 49. Test boundaries
// ---------------------------------------------------------------------

export interface TestBoundary {
  readonly boundary: string;
  readonly question: string;
}

export const testBoundaries: readonly TestBoundary[] = [
  {
    boundary: "Unit",
    question: "Does this isolated piece of logic behave correctly?",
  },
  {
    boundary: "Integration",
    question: "Do these collaborating pieces behave correctly together?",
  },
  {
    boundary: "End-to-end",
    question: "Does the complete user workflow work in the application?",
  },
];

// The boundary should match the behavior being verified.

// ---------------------------------------------------------------------
// 50. Unit test anatomy
// ---------------------------------------------------------------------

export const unitTestAnatomy: TestFlow = {
  arrange: "Provide function inputs",
  act: "Call the function",
  assert: "Verify the returned result",
};

// Unit tests can often have a very small Arrange phase.

// ---------------------------------------------------------------------
// 51. Integration test anatomy
// ---------------------------------------------------------------------

export const integrationTestAnatomy: TestFlow = {
  arrange: "Render collaborating components with required providers",
  act: "Perform a meaningful interaction",
  assert: "Verify the resulting application behavior",
};

// Integration tests exercise a larger boundary.

// ---------------------------------------------------------------------
// 52. End-to-end test anatomy
// ---------------------------------------------------------------------

export const endToEndTestAnatomy: TestFlow = {
  arrange: "Open the application in a controlled environment",
  act: "Perform the complete user workflow",
  assert: "Verify the final user-visible outcome",
};

// End-to-end tests include more of the real application environment
// and therefore generally have a broader scope.

// ---------------------------------------------------------------------
// 53. Avoid testing implementation wiring
// ---------------------------------------------------------------------

export interface WiringTest {
  readonly approach: string;
  readonly concern: string;
}

export const wiringTest: WiringTest = {
  approach: "Verify that helper A calls helper B",
  concern: "The implementation can change while the behavior remains correct",
};

// Internal wiring is usually better covered through the behavior it produces.

// ---------------------------------------------------------------------
// 54. Test observable consequences
// ---------------------------------------------------------------------

export interface ObservableConsequence {
  readonly action: string;
  readonly consequence: string;
}

export const observableConsequence: ObservableConsequence = {
  action: "Save the profile",
  consequence: "The saved profile is displayed",
};

// The consequence is generally more stable than the internal sequence
// of function calls that produced it.

// ---------------------------------------------------------------------
// 55. Complete component under test
// ---------------------------------------------------------------------

export interface GreetingCardProps {
  readonly name: string;
}

export const GreetingCard: FC<GreetingCardProps> = ({ name }): ReactElement => {
  return (
    <article>
      <h2>Hello, {name}</h2>
      <p>Your profile is ready.</p>
    </article>
  );
};

// A conceptual test for this component would:
//
// Arrange:
// render(<GreetingCard name="John Doe" />)
//
// Act:
// No interaction is required.
//
// Assert:
// Verify that the heading "Hello, John Doe" is visible.
//
// The test observes rendered behavior rather than inspecting component internals.

// ---------------------------------------------------------------------
// 56. Complete interactive component
// ---------------------------------------------------------------------

export interface ToggleProps {
  readonly enabled: boolean;
  readonly onToggle: () => void;
}

export const Toggle: FC<ToggleProps> = ({ enabled, onToggle }): ReactElement => {
  return (
    <button type="button" aria-pressed={enabled} onClick={onToggle}>
      {enabled ? "Enabled" : "Disabled"}
    </button>
  );
};

// A conceptual interaction test would:
//
// Arrange:
// render(<Toggle enabled={false} onToggle={handleToggle} />)
//
// Act:
// Click the button.
//
// Assert:
// Verify that the callback was invoked or that the resulting application
// behavior reflects the change.
//
// Which assertion is appropriate depends on the public contract being tested.

// ---------------------------------------------------------------------
// 57. Test anatomy checklist
// ---------------------------------------------------------------------

export interface TestAnatomyChecklist {
  readonly step: string;
}

export const testAnatomyChecklist: readonly TestAnatomyChecklist[] = [
  {
    step: "Name the behavior clearly",
  },
  {
    step: "Arrange the minimum required conditions",
  },
  {
    step: "Perform the meaningful action",
  },
  {
    step: "Assert observable outcomes",
  },
  {
    step: "Wait for asynchronous behavior when necessary",
  },
  {
    step: "Clean up resources that are not automatically isolated",
  },
  {
    step: "Keep the test independent and deterministic",
  },
];

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - A test commonly follows Arrange, Act, Assert, with Cleanup when required.
// - Arrange establishes the conditions and inputs required by the behavior.
// - Act performs the behavior being tested.
// - Assert verifies meaningful observable outcomes.
// - Cleanup prevents resources and mutable state from leaking between tests.
// - Test descriptions should communicate behavior rather than implementation mechanics.
// - A test can contain multiple assertions when they collectively verify one coherent behavior.
// - "One assertion per test" is a guideline, not a universal testing rule.
// - Test setup should contain the minimum state necessary to understand the scenario.
// - User-oriented queries are generally more resilient than implementation-specific selectors.
// - Asynchronous tests should synchronize with expected behavior rather than use arbitrary delays.
// - Loading, success, empty, and error states are distinct behaviors that can require separate coverage.
// - Accessibility behavior can be tested through accessible names, roles, labels, and states.
// - Internal state should usually be observed through its public effects rather than accessed directly.
// - Callback invocation can be tested directly when callback invocation is itself part of the public contract.
// - Shared helpers are useful when they reduce repetitive setup without hiding important behavior.
// - Lifecycle hooks should support isolation rather than create shared mutable state between tests.
// - Tests should be independent of execution order.
// - Deterministic tests control relevant sources of time, randomness, network behavior, and shared state.
// - Unit, integration, and end-to-end tests use different boundaries for different behaviors.
// - A unit test usually exercises isolated logic, an integration test exercises collaboration, and an end-to-end test exercises a complete workflow.
// - Test failures are easier to diagnose when test names, setup, actions, and assertions clearly communicate intent.
// - The anatomy of a test stays conceptually consistent regardless of the specific test runner or testing library.
