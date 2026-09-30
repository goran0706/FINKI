/**
 * Test Doubles
 * ============
 *
 * Test doubles are substitute implementations used in tests to control dependencies,
 * isolate behavior, or observe interactions. The main categories are dummies, stubs,
 * fakes, spies, and mocks, with each serving a different testing purpose.
 */

import { type FC, type ReactElement } from "react";

// ---------------------------------------------------------------------
// 1. What test doubles are
// ---------------------------------------------------------------------

// A test double stands in for a real dependency during a test.
//
// A production component may depend on:
//
// - an API client
// - a database repository
// - a clock
// - a payment service
// - a browser API
// - a notification service
//
// A test can replace one of these dependencies with a controlled substitute.

export interface TestDouble {
  readonly name: string;
  readonly purpose: string;
}

export const testDoubleDefinition: TestDouble = {
  name: "Test double",
  purpose: "A substitute used in place of a real dependency during testing",
};

// Test doubles allow a test to control boundaries that would otherwise
// be slow, unpredictable, expensive, or difficult to reproduce.

// ---------------------------------------------------------------------
// 2. Why test doubles are useful
// ---------------------------------------------------------------------

export interface TestDoubleReason {
  readonly reason: string;
  readonly benefit: string;
}

export const testDoubleReasons: readonly TestDoubleReason[] = [
  {
    reason: "Control external behavior",
    benefit: "The test can provide known responses",
  },
  {
    reason: "Avoid real infrastructure",
    benefit: "Tests do not require external services",
  },
  {
    reason: "Make failures deterministic",
    benefit: "The same inputs produce controlled conditions",
  },
  {
    reason: "Observe interactions",
    benefit: "The test can verify meaningful calls to a dependency",
  },
];

// A test double should solve a testing problem rather than exist simply
// because the dependency is inconvenient to instantiate.

// ---------------------------------------------------------------------
// 3. The main categories
// ---------------------------------------------------------------------

export type TestDoubleKind = "dummy" | "stub" | "fake" | "spy" | "mock";

export interface TestDoubleCategory {
  readonly kind: TestDoubleKind;
  readonly purpose: string;
}

export const testDoubleCategories: readonly TestDoubleCategory[] = [
  {
    kind: "dummy",
    purpose: "Satisfy a parameter or dependency that is not used",
  },
  {
    kind: "stub",
    purpose: "Provide controlled responses",
  },
  {
    kind: "fake",
    purpose: "Provide a working but simplified implementation",
  },
  {
    kind: "spy",
    purpose: "Record interactions for later inspection",
  },
  {
    kind: "mock",
    purpose: "Define expected interactions and verify them",
  },
];

// The terminology can vary between testing tools and teams.
// The important distinction is the purpose each substitute serves.

// ---------------------------------------------------------------------
// 4. Dummy
// ---------------------------------------------------------------------

// A dummy is supplied only because a value is required.
// The test does not use the dummy for its behavior.

export interface Logger {
  readonly info: (message: string) => void;
}

export interface ServiceOptions {
  readonly logger: Logger;
}

export const dummyLogger: Logger = {
  info: () => {
    // Intentionally empty.
  },
};

// The logger is required by the service but is irrelevant to a particular test.
// The dummy satisfies the dependency without participating in the behavior.

// ---------------------------------------------------------------------
// 5. Dummy values
// ---------------------------------------------------------------------

export interface RequestContext {
  readonly requestId: string;
  readonly userId: string;
}

export const dummyRequestContext: RequestContext = {
  requestId: "request-1",
  userId: "user-1",
};

// The values are valid enough to satisfy the type.
// Their specific contents do not matter when the behavior under test
// does not depend on them.

// ---------------------------------------------------------------------
// 6. Stub
// ---------------------------------------------------------------------

// A stub provides predetermined responses to control the conditions
// under which the system is tested.

export interface User {
  readonly id: string;
  readonly name: string;
}

export interface UserRepository {
  readonly findById: (id: string) => Promise<User | null>;
}

export const userRepositoryStub: UserRepository = {
  findById: async () => {
    return {
      id: "user-1",
      name: "John Doe",
    };
  },
};

// The stub makes the repository return a known user regardless of
// whether a real database exists.

// ---------------------------------------------------------------------
// 7. Stub for an error
// ---------------------------------------------------------------------

export const failingUserRepositoryStub: UserRepository = {
  findById: async () => {
    throw new Error("Database unavailable");
  },
};

// A stub can also control failure conditions that may be difficult
// to reproduce reliably with the real dependency.

// ---------------------------------------------------------------------
// 8. Stub for an empty result
// ---------------------------------------------------------------------

export const emptyUserRepositoryStub: UserRepository = {
  findById: async () => {
    return null;
  },
};

// Different stubs can represent different dependency outcomes.

// ---------------------------------------------------------------------
// 9. Stub responses should be intentional
// ---------------------------------------------------------------------

export interface StubScenario {
  readonly scenario: string;
  readonly response: string;
}

export const stubScenarios: readonly StubScenario[] = [
  {
    scenario: "User exists",
    response: "Return a known user",
  },
  {
    scenario: "User does not exist",
    response: "Return null",
  },
  {
    scenario: "Repository fails",
    response: "Reject with an error",
  },
];

// Stubs are particularly useful for testing success, empty, and failure paths.

// ---------------------------------------------------------------------
// 10. Fake
// ---------------------------------------------------------------------

// A fake is a simplified but functional implementation of a dependency.
//
// Unlike a simple stub, a fake can contain meaningful behavior and state.

export interface Product {
  readonly id: string;
  readonly name: string;
  readonly price: number;
}

export interface ProductRepository {
  readonly save: (product: Product) => Promise<void>;
  readonly findById: (id: string) => Promise<Product | null>;
}

export class InMemoryProductRepository implements ProductRepository {
  private readonly products = new Map<string, Product>();

  public async save(product: Product): Promise<void> {
    this.products.set(product.id, product);
  }

  public async findById(id: string): Promise<Product | null> {
    return this.products.get(id) ?? null;
  }
}

// The in-memory repository behaves like a repository while avoiding
// a real database.

// ---------------------------------------------------------------------
// 11. Fake vs stub
// ---------------------------------------------------------------------

export interface DoubleComparison {
  readonly double: string;
  readonly characteristic: string;
}

export const fakeVsStub: readonly DoubleComparison[] = [
  {
    double: "Stub",
    characteristic: "Usually returns predefined responses",
  },
  {
    double: "Fake",
    characteristic: "Implements simplified but meaningful behavior",
  },
];

// A fake can preserve enough behavior to exercise multiple operations
// against the same substitute.

// ---------------------------------------------------------------------
// 12. Fake state
// ---------------------------------------------------------------------

export const createProductRepository = (): ProductRepository => {
  return new InMemoryProductRepository();
};

// Each test can create a fresh fake to keep its state isolated.

// ---------------------------------------------------------------------
// 13. Spy
// ---------------------------------------------------------------------

// A spy records calls made to a dependency.
// It allows the test to inspect an interaction after the behavior occurs.

export interface NotificationService {
  readonly notify: (message: string) => void;
}

export interface Spy<TArgs extends readonly unknown[]> {
  readonly calls: readonly TArgs[];
  readonly invoke: (...args: TArgs) => void;
}

export const createSpy = <TArgs extends readonly unknown[]>(): Spy<TArgs> => {
  const calls: TArgs[] = [];

  return {
    calls,
    invoke: (...args: TArgs): void => {
      calls.push(args);
    },
  };
};

// The spy records each invocation without requiring a real notification service.

// ---------------------------------------------------------------------
// 14. Using a spy
// ---------------------------------------------------------------------

export const notificationSpy = createSpy<[string]>();

export const spyNotificationService: NotificationService = {
  notify: (message: string): void => {
    notificationSpy.invoke(message);
  },
};

// After the behavior runs, the test can inspect notificationSpy.calls.

// ---------------------------------------------------------------------
// 15. Spy observations
// ---------------------------------------------------------------------

export interface SpyObservation {
  readonly observation: string;
  readonly example: string;
}

export const spyObservations: readonly SpyObservation[] = [
  {
    observation: "Was called",
    example: "The dependency received at least one call",
  },
  {
    observation: "Call count",
    example: "The dependency was called exactly once",
  },
  {
    observation: "Arguments",
    example: "The dependency received the expected message",
  },
  {
    observation: "Call order",
    example: "One interaction happened before another",
  },
];

// A spy is primarily about observing what happened.

// ---------------------------------------------------------------------
// 16. Spy without replacing behavior
// ---------------------------------------------------------------------

export interface Calculator {
  readonly add: (left: number, right: number) => number;
}

export const realCalculator: Calculator = {
  add: (left, right) => left + right,
};

// A spy can also wrap a real implementation so that the original behavior
// remains available while interactions are recorded.

export interface SpiedCalculator extends Calculator {
  readonly calls: readonly [number, number][];
}

export const createSpiedCalculator = (): SpiedCalculator => {
  const calls: [number, number][] = [];

  return {
    calls,
    add: (left, right): number => {
      calls.push([left, right]);
      return realCalculator.add(left, right);
    },
  };
};

// ---------------------------------------------------------------------
// 17. Mock
// ---------------------------------------------------------------------

// A mock is commonly used to express an expected interaction with a dependency.
//
// The exact meaning of "mock" varies between testing libraries.
// In some tools, mocks are configurable replacement functions.
// In classic interaction-based testing terminology, a mock is configured
// with expectations that the test verifies.

export interface PaymentService {
  readonly charge: (amount: number) => Promise<void>;
}

export interface PaymentExpectation {
  readonly expectedAmount: number;
}

export const paymentExpectation: PaymentExpectation = {
  expectedAmount: 49.99,
};

// The important concept is the interaction contract:
// the payment service should be called with the expected amount.

// ---------------------------------------------------------------------
// 18. Mock vs spy
// ---------------------------------------------------------------------

export interface MockSpyComparison {
  readonly type: string;
  readonly question: string;
}

export const mockSpyComparison: readonly MockSpyComparison[] = [
  {
    type: "Spy",
    question: "What interaction happened?",
  },
  {
    type: "Mock",
    question: "Did the interaction satisfy the expected contract?",
  },
];

// The distinction is conceptual and depends on the terminology used
// by the testing framework.

// ---------------------------------------------------------------------
// 19. Stubs control state
// ---------------------------------------------------------------------

export interface StubPurpose {
  readonly question: string;
}

export const stubPurpose: readonly StubPurpose[] = [
  {
    question: "What response should the dependency provide?",
  },
  {
    question: "What error should the dependency produce?",
  },
  {
    question: "What data should the system receive?",
  },
];

// Stubs are useful when the dependency's output determines the scenario.

// ---------------------------------------------------------------------
// 20. Spies verify interactions
// ---------------------------------------------------------------------

export interface SpyPurpose {
  readonly question: string;
}

export const spyPurpose: readonly SpyPurpose[] = [
  {
    question: "Was the dependency called?",
  },
  {
    question: "How many times was it called?",
  },
  {
    question: "Which arguments were supplied?",
  },
];

// Spies are useful when the interaction itself is part of the contract.

// ---------------------------------------------------------------------
// 21. Fakes provide working behavior
// ---------------------------------------------------------------------

export interface FakePurpose {
  readonly question: string;
}

export const fakePurpose: readonly FakePurpose[] = [
  {
    question: "Can the test exercise several operations against the substitute?",
  },
  {
    question: "Does the dependency need simplified stateful behavior?",
  },
];

// A fake is often useful when a realistic but lightweight implementation
// provides better coverage than many manually configured stubs.

// ---------------------------------------------------------------------
// 22. Dummies satisfy dependencies
// ---------------------------------------------------------------------

export interface DummyPurpose {
  readonly question: string;
}

export const dummyPurpose: readonly DummyPurpose[] = [
  {
    question: "Does the dependency need to exist only to satisfy a parameter?",
  },
];

// Dummies should remain semantically irrelevant to the behavior under test.

// ---------------------------------------------------------------------
// 23. A service using a repository
// ---------------------------------------------------------------------

export interface UserService {
  readonly getUserName: (id: string) => Promise<string>;
}

export const createUserService = (repository: UserRepository): UserService => {
  return {
    getUserName: async (id: string): Promise<string> => {
      const user = await repository.findById(id);

      if (user === null) {
        return "Unknown user";
      }

      return user.name;
    },
  };
};

// The repository is an explicit dependency that can be replaced
// by a stub, fake, or other test double.

// ---------------------------------------------------------------------
// 24. Service with a stub
// ---------------------------------------------------------------------

export const stubbedUserService = createUserService(userRepositoryStub);

// The service receives a controlled repository response.

// Conceptually:
//
// Arrange:
// Use userRepositoryStub.
//
// Act:
// Call getUserName("user-1").
//
// Assert:
// The result is "John Doe".

// ---------------------------------------------------------------------
// 25. Service with a fake
// ---------------------------------------------------------------------

export const fakeRepository = new InMemoryProductRepository();

export const fakeProduct: Product = {
  id: "product-1",
  name: "Example Product",
  price: 49.99,
};

// A fake can be populated and then queried as a small working repository.

// ---------------------------------------------------------------------
// 26. Fakes and stateful scenarios
// ---------------------------------------------------------------------

export const createPopulatedProductRepository = async (): Promise<ProductRepository> => {
  const repository = new InMemoryProductRepository();

  await repository.save({
    id: "product-1",
    name: "Example Product",
    price: 49.99,
  });

  return repository;
};

// A fake can represent state transitions that would otherwise require
// real infrastructure.

// ---------------------------------------------------------------------
// 27. Test doubles at boundaries
// ---------------------------------------------------------------------

export type DependencyBoundary = "network" | "database" | "clock" | "filesystem" | "notification" | "payment";

export interface BoundaryDouble {
  readonly boundary: DependencyBoundary;
  readonly possibleDouble: TestDoubleKind;
}

export const boundaryDoubles: readonly BoundaryDouble[] = [
  {
    boundary: "network",
    possibleDouble: "stub",
  },
  {
    boundary: "database",
    possibleDouble: "fake",
  },
  {
    boundary: "clock",
    possibleDouble: "stub",
  },
  {
    boundary: "notification",
    possibleDouble: "spy",
  },
  {
    boundary: "payment",
    possibleDouble: "mock",
  },
];

// The appropriate double depends on what the test needs from the boundary.

// ---------------------------------------------------------------------
// 28. Controlling time
// ---------------------------------------------------------------------

export interface Clock {
  readonly now: () => Date;
}

export const fixedClock: Clock = {
  now: () => new Date("2026-01-01T00:00:00.000Z"),
};

export const getCurrentYear = (clock: Clock): number => {
  return clock.now().getUTCFullYear();
};

// A controlled clock turns time from an uncontrolled external dependency
// into explicit test input.

// ---------------------------------------------------------------------
// 29. Network stub
// ---------------------------------------------------------------------

export interface ApiClient {
  readonly getUser: (id: string) => Promise<User>;
}

export const apiClientStub: ApiClient = {
  getUser: async () => {
    return {
      id: "user-1",
      name: "John Doe",
    };
  },
};

// The stub makes the API response deterministic.

// ---------------------------------------------------------------------
// 30. Network failure stub
// ---------------------------------------------------------------------

export const failingApiClientStub: ApiClient = {
  getUser: async () => {
    throw new Error("Network request failed");
  },
};

// A failure stub allows the application error path to be tested
// without depending on an actual network failure.

// ---------------------------------------------------------------------
// 31. Notification spy
// ---------------------------------------------------------------------

export interface Notification {
  readonly message: string;
}

export interface NotificationPort {
  readonly send: (notification: Notification) => void;
}

export const notificationCalls: Notification[] = [];

export const notificationSpyPort: NotificationPort = {
  send: (notification): void => {
    notificationCalls.push(notification);
  },
};

// The spy records notifications so the test can inspect the interaction.

// ---------------------------------------------------------------------
// 32. Fake clock vs stub clock
// ---------------------------------------------------------------------

export interface ClockComparison {
  readonly double: string;
  readonly behavior: string;
}

export const clockComparison: readonly ClockComparison[] = [
  {
    double: "Stub clock",
    behavior: "Always returns a predetermined time",
  },
  {
    double: "Fake clock",
    behavior: "Can model advancing time and scheduled behavior",
  },
];

// A simple fixed clock is often enough for straightforward timestamp tests.
// A more capable fake can be useful when time progression itself is under test.

// ---------------------------------------------------------------------
// 33. Fake repository
// ---------------------------------------------------------------------

export class InMemoryUserRepository implements UserRepository {
  private readonly users = new Map<string, User>();

  public add(user: User): void {
    this.users.set(user.id, user);
  }

  public async findById(id: string): Promise<User | null> {
    return this.users.get(id) ?? null;
  }
}

// This fake provides stateful repository behavior without requiring a database.

// ---------------------------------------------------------------------
// 34. Using the fake repository
// ---------------------------------------------------------------------

export const createUserRepositoryForTest = (): InMemoryUserRepository => {
  const repository = new InMemoryUserRepository();

  repository.add({
    id: "user-1",
    name: "John Doe",
  });

  return repository;
};

// A fresh fake can be created for each test scenario.

// ---------------------------------------------------------------------
// 35. Avoid real infrastructure when unnecessary
// ---------------------------------------------------------------------

export interface RealInfrastructureConcern {
  readonly dependency: string;
  readonly problem: string;
}

export const realInfrastructureConcerns: readonly RealInfrastructureConcern[] = [
  {
    dependency: "Production database",
    problem: "Tests can become slow and environment-dependent",
  },
  {
    dependency: "External HTTP API",
    problem: "Tests depend on remote availability and response data",
  },
  {
    dependency: "Real payment gateway",
    problem: "Tests can trigger real external side effects",
  },
];

// Test doubles can isolate these boundaries when the real dependency
// is not part of the behavior being verified.

// ---------------------------------------------------------------------
// 36. Do not replace everything
// ---------------------------------------------------------------------

export interface OverMockingProblem {
  readonly strategy: string;
  readonly consequence: string;
}

export const overMockingProblems: readonly OverMockingProblem[] = [
  {
    strategy: "Mock every dependency",
    consequence: "Tests can verify an artificial interaction graph",
  },
  {
    strategy: "Mock collaborating components individually",
    consequence: "Integration behavior can disappear from the test",
  },
  {
    strategy: "Stub framework behavior",
    consequence: "Tests can stop representing actual application behavior",
  },
];

// Test doubles should isolate meaningful external boundaries,
// not erase the behavior that the test is supposed to verify.

// ---------------------------------------------------------------------
// 37. Over-mocking
// ---------------------------------------------------------------------

export interface OverMockingSignal {
  readonly signal: string;
}

export const overMockingSignals: readonly OverMockingSignal[] = [
  {
    signal: "A small implementation change requires many mock updates",
  },
  {
    signal: "Tests assert long sequences of internal calls",
  },
  {
    signal: "Mocks reproduce most of the implementation manually",
  },
  {
    signal: "Tests pass even though collaborating components no longer work together",
  },
];

// These are signs that tests may be coupled too closely to implementation structure.

// ---------------------------------------------------------------------
// 38. Mock behavior, not internals
// ---------------------------------------------------------------------

export interface InteractionContract {
  readonly action: string;
  readonly expectedInteraction: string;
}

export const interactionContract: InteractionContract = {
  action: "Submit a valid order",
  expectedInteraction: "The payment service receives the order total",
};

// If the payment call is part of the application's public behavior,
// verifying that boundary interaction can be meaningful.

// ---------------------------------------------------------------------
// 39. Do not assert incidental calls
// ---------------------------------------------------------------------

export interface IncidentalInteraction {
  readonly interaction: string;
  readonly reason: string;
}

export const incidentalInteractions: readonly IncidentalInteraction[] = [
  {
    interaction: "A helper function was called exactly twice",
    reason: "The helper is an implementation detail",
  },
  {
    interaction: "An internal formatter was called",
    reason: "The formatted result is the meaningful behavior",
  },
];

// Incidental interaction assertions make tests fragile without adding
// meaningful behavioral confidence.

// ---------------------------------------------------------------------
// 40. Test doubles and dependency inversion
// ---------------------------------------------------------------------

export interface RepositoryPort {
  readonly findById: (id: string) => Promise<User | null>;
}

export const createUserNameService = (repository: RepositoryPort): UserService => {
  return {
    getUserName: async (id: string): Promise<string> => {
      const user = await repository.findById(id);
      return user?.name ?? "Unknown user";
    },
  };
};

// Depending on an interface-like boundary makes it possible to substitute
// a repository implementation without changing the service.

// ---------------------------------------------------------------------
// 41. Explicit dependencies improve testability
// ---------------------------------------------------------------------

export interface ApplicationDependencies {
  readonly users: UserRepository;
  readonly clock: Clock;
  readonly notifications: NotificationPort;
}

export const applicationDependencies: ApplicationDependencies = {
  users: userRepositoryStub,
  clock: fixedClock,
  notifications: notificationSpyPort,
};

// Dependencies that are explicit inputs are easier to replace than
// hidden global dependencies.

// ---------------------------------------------------------------------
// 42. Global dependencies
// ---------------------------------------------------------------------

export const hiddenGlobalClock = (): Date => {
  return new Date();
};

// Directly depending on global time makes deterministic testing harder.
// Passing a Clock dependency makes the boundary explicit.

// ---------------------------------------------------------------------
// 43. Dependency factories
// ---------------------------------------------------------------------

export const createApplicationDependencies = (): ApplicationDependencies => {
  return {
    users: new InMemoryUserRepository(),
    clock: fixedClock,
    notifications: {
      send: () => {
        // Intentionally empty for this configuration.
      },
    },
  };
};

// A dependency factory can create a controlled set of substitutes
// for a test environment.

// ---------------------------------------------------------------------
// 44. Test doubles and React components
// ---------------------------------------------------------------------

export interface UserProfileProps {
  readonly repository: UserRepository;
  readonly userId: string;
}

export const UserProfile: FC<UserProfileProps> = ({ repository, userId }): ReactElement => {
  // The component would normally load the user through its repository
  // boundary and render the resulting state.
  //
  // The repository is explicit so a test can supply a controlled stub.

  void repository;
  void userId;

  return (
    <section>
      <h2>User profile</h2>
      <p>Profile content is loaded from the repository.</p>
    </section>
  );
};

// The important testing principle is the explicit dependency boundary.
// The UI test can provide a stub or fake without requiring a real database.

// ---------------------------------------------------------------------
// 45. Test doubles and component behavior
// ---------------------------------------------------------------------

export interface ComponentScenario {
  readonly dependency: string;
  readonly scenario: string;
  readonly expectedBehavior: string;
}

export const componentScenarios: readonly ComponentScenario[] = [
  {
    dependency: "User repository stub",
    scenario: "Repository returns a user",
    expectedBehavior: "The user's name is displayed",
  },
  {
    dependency: "User repository stub",
    scenario: "Repository returns null",
    expectedBehavior: "The empty state is displayed",
  },
  {
    dependency: "User repository stub",
    scenario: "Repository rejects",
    expectedBehavior: "The error state is displayed",
  },
];

// The same component can be exercised against controlled dependency outcomes.

// ---------------------------------------------------------------------
// 46. Test doubles and asynchronous behavior
// ---------------------------------------------------------------------

export interface AsyncDouble {
  readonly outcome: "success" | "empty" | "failure";
  readonly behavior: string;
}

export const asyncDoubleScenarios: readonly AsyncDouble[] = [
  {
    outcome: "success",
    behavior: "Resolve with known data",
  },
  {
    outcome: "empty",
    behavior: "Resolve with no data",
  },
  {
    outcome: "failure",
    behavior: "Reject with a known error",
  },
];

// Async doubles allow each state to be tested deterministically.

// ---------------------------------------------------------------------
// 47. Test doubles and error handling
// ---------------------------------------------------------------------

export interface ErrorDouble {
  readonly dependency: string;
  readonly controlledFailure: string;
}

export const errorDouble: ErrorDouble = {
  dependency: "API client",
  controlledFailure: "Network request failed",
};

// A controlled failure is preferable to waiting for a real external system
// to fail unpredictably.

// ---------------------------------------------------------------------
// 48. Test doubles and side effects
// ---------------------------------------------------------------------

export interface SideEffectDouble {
  readonly sideEffect: string;
  readonly strategy: TestDoubleKind;
}

export const sideEffectDoubles: readonly SideEffectDouble[] = [
  {
    sideEffect: "Send notification",
    strategy: "spy",
  },
  {
    sideEffect: "Charge payment",
    strategy: "mock",
  },
  {
    sideEffect: "Persist data",
    strategy: "fake",
  },
];

// The strategy depends on whether the test needs observation,
// controlled responses, or simplified working behavior.

// ---------------------------------------------------------------------
// 49. Test double lifecycle
// ---------------------------------------------------------------------

export interface DoubleLifecycle {
  readonly phase: string;
  readonly responsibility: string;
}

export const doubleLifecycle: readonly DoubleLifecycle[] = [
  {
    phase: "Create",
    responsibility: "Create a fresh double when isolation requires it",
  },
  {
    phase: "Configure",
    responsibility: "Define controlled responses or expected interactions",
  },
  {
    phase: "Use",
    responsibility: "Run the behavior under test",
  },
  {
    phase: "Verify",
    responsibility: "Inspect outcomes or interactions",
  },
  {
    phase: "Restore",
    responsibility: "Return global or shared resources to their original state",
  },
];

// A clear lifecycle prevents test doubles from leaking state between tests.

// ---------------------------------------------------------------------
// 50. Resetting spy state
// ---------------------------------------------------------------------

export const resetNotificationCalls = (): void => {
  notificationCalls.length = 0;
};

// Shared spies must be reset when they are reused.
// Creating a fresh spy per test is often simpler and provides stronger isolation.

// ---------------------------------------------------------------------
// 51. Fresh doubles
// ---------------------------------------------------------------------

export const createNotificationSpy = (): {
  readonly calls: Notification[];
  readonly service: NotificationPort;
} => {
  const calls: Notification[] = [];

  return {
    calls,
    service: {
      send: (notification): void => {
        calls.push(notification);
      },
    },
  };
};

// Factory-created doubles avoid accidental state sharing.

// ---------------------------------------------------------------------
// 52. Choosing a test double
// ---------------------------------------------------------------------

export interface DoubleSelection {
  readonly question: string;
  readonly choice: TestDoubleKind;
}

export const doubleSelection: readonly DoubleSelection[] = [
  {
    question: "Is the dependency irrelevant to this test?",
    choice: "dummy",
  },
  {
    question: "Do I need a controlled response?",
    choice: "stub",
  },
  {
    question: "Do I need simplified working behavior?",
    choice: "fake",
  },
  {
    question: "Do I need to inspect an interaction?",
    choice: "spy",
  },
  {
    question: "Is a specific interaction contract itself being verified?",
    choice: "mock",
  },
];

// The choice should follow the testing need rather than a blanket preference
// for one kind of double.

// ---------------------------------------------------------------------
// 53. Test double decision example
// ---------------------------------------------------------------------

export interface DecisionExample {
  readonly situation: string;
  readonly double: TestDoubleKind;
  readonly reason: string;
}

export const decisionExamples: readonly DecisionExample[] = [
  {
    situation: "A constructor requires a logger that the test never uses",
    double: "dummy",
    reason: "The logger only satisfies the dependency requirement",
  },
  {
    situation: "The service needs a known user response",
    double: "stub",
    reason: "The response controls the scenario",
  },
  {
    situation: "The test needs a lightweight repository with state",
    double: "fake",
    reason: "A simplified working implementation is useful",
  },
  {
    situation: "The test needs to verify a notification was sent",
    double: "spy",
    reason: "The interaction must be observed",
  },
  {
    situation: "The payment boundary must receive an exact amount",
    double: "mock",
    reason: "The interaction contract is part of the scenario",
  },
];

// ---------------------------------------------------------------------
// 54. Test doubles are not automatically better
// ---------------------------------------------------------------------

export interface DoubleTradeoff {
  readonly benefit: string;
  readonly cost: string;
}

export const doubleTradeoffs: readonly DoubleTradeoff[] = [
  {
    benefit: "Greater control",
    cost: "More test configuration",
  },
  {
    benefit: "Faster tests",
    cost: "Less real integration behavior",
  },
  {
    benefit: "Deterministic failures",
    cost: "Potentially unrealistic assumptions",
  },
];

// Every double introduces a boundary between the test and the real implementation.

// ---------------------------------------------------------------------
// 55. The risk of unrealistic doubles
// ---------------------------------------------------------------------

export interface UnrealisticDouble {
  readonly problem: string;
  readonly consequence: string;
}

export const unrealisticDouble: UnrealisticDouble = {
  problem: "The fake behaves differently from the production dependency",
  consequence: "Tests can pass while production integration fails",
};

// A double should model the relevant contract closely enough for the
// behavior being tested.

// ---------------------------------------------------------------------
// 56. Contract-focused doubles
// ---------------------------------------------------------------------

export interface DependencyContract {
  readonly operation: string;
  readonly input: string;
  readonly output: string;
}

export const userRepositoryContract: readonly DependencyContract[] = [
  {
    operation: "findById",
    input: "A user ID",
    output: "A user or null",
  },
];

// A double should respect the contract that the consuming code relies upon.

// ---------------------------------------------------------------------
// 57. Fakes and contract fidelity
// ---------------------------------------------------------------------

export const fakeUserRepository = new InMemoryUserRepository();

// The fake implements the same UserRepository contract as the production
// repository abstraction.

// ---------------------------------------------------------------------
// 58. Test double vs real dependency
// ---------------------------------------------------------------------

export interface DependencyChoice {
  readonly option: "real" | TestDoubleKind;
  readonly appropriateWhen: string;
}

export const dependencyChoices: readonly DependencyChoice[] = [
  {
    option: "real",
    appropriateWhen: "The integration itself is the behavior being tested",
  },
  {
    option: "stub",
    appropriateWhen: "A controlled response is sufficient",
  },
  {
    option: "fake",
    appropriateWhen: "Simplified working behavior is useful",
  },
  {
    option: "spy",
    appropriateWhen: "An interaction needs to be observed",
  },
];

// A real dependency is not inherently wrong.
// The question is whether including it provides useful confidence for this test.

// ---------------------------------------------------------------------
// 59. Integration boundaries
// ---------------------------------------------------------------------

export interface IntegrationBoundary {
  readonly boundary: string;
  readonly testDoubleQuestion: string;
}

export const integrationBoundary: readonly IntegrationBoundary[] = [
  {
    boundary: "Database",
    testDoubleQuestion: "Does this test need database behavior or only application logic?",
  },
  {
    boundary: "HTTP API",
    testDoubleQuestion: "Does this test need real HTTP integration or a controlled response?",
  },
  {
    boundary: "Payment provider",
    testDoubleQuestion: "Does this test need the real provider or only the payment contract?",
  },
];

// If the boundary itself is under test, a real integration test may be more appropriate.

// ---------------------------------------------------------------------
// 60. A balanced testing strategy
// ---------------------------------------------------------------------

export interface TestingStrategy {
  readonly scope: string;
  readonly dependencyStrategy: string;
}

export const balancedTestingStrategy: readonly TestingStrategy[] = [
  {
    scope: "Pure logic",
    dependencyStrategy: "No double when there are no external dependencies",
  },
  {
    scope: "Component behavior",
    dependencyStrategy: "Use realistic UI interaction and control external boundaries",
  },
  {
    scope: "Service behavior",
    dependencyStrategy: "Use stubs or fakes for external infrastructure",
  },
  {
    scope: "Critical integration",
    dependencyStrategy: "Use real dependencies where the integration itself matters",
  },
  {
    scope: "External side effect",
    dependencyStrategy: "Use a spy or controlled substitute unless the real side effect is explicitly under test",
  },
];

// A test suite can combine real dependencies and test doubles at different boundaries.

// ---------------------------------------------------------------------
// 61. Complete service example
// ---------------------------------------------------------------------

export interface Order {
  readonly id: string;
  readonly total: number;
}

export interface OrderRepository {
  readonly findById: (id: string) => Promise<Order | null>;
}

export interface PaymentGateway {
  readonly charge: (amount: number) => Promise<void>;
}

export interface OrderService {
  readonly pay: (orderId: string) => Promise<void>;
}

export const createOrderService = (orders: OrderRepository, payments: PaymentGateway): OrderService => {
  return {
    pay: async (orderId: string): Promise<void> => {
      const order = await orders.findById(orderId);

      if (order === null) {
        throw new Error("Order not found");
      }

      await payments.charge(order.total);
    },
  };
};

// The service depends on explicit boundaries.
// A test can provide:
// - a stubbed order repository
// - a spy or mock payment gateway

// ---------------------------------------------------------------------
// 62. Stub and spy together
// ---------------------------------------------------------------------

export const orderRepositoryStub: OrderRepository = {
  findById: async () => {
    return {
      id: "order-1",
      total: 49.99,
    };
  },
};

export const paymentCalls: number[] = [];

export const paymentSpy: PaymentGateway = {
  charge: async (amount): Promise<void> => {
    paymentCalls.push(amount);
  },
};

export const orderService = createOrderService(orderRepositoryStub, paymentSpy);

// Conceptually:
//
// Arrange:
// - Stub the order repository to return a known order.
// - Spy on the payment gateway.
//
// Act:
// - Pay order-1.
//
// Assert:
// - The payment gateway received 49.99.
//
// This combines different test doubles because the dependencies
// have different testing responsibilities.

// ---------------------------------------------------------------------
// 63. Test double boundaries should remain explicit
// ---------------------------------------------------------------------

export interface ExplicitBoundary {
  readonly dependency: string;
  readonly responsibility: string;
}

export const explicitBoundaries: readonly ExplicitBoundary[] = [
  {
    dependency: "Order repository",
    responsibility: "Provide order data",
  },
  {
    dependency: "Payment gateway",
    responsibility: "Process payment",
  },
];

// Explicit boundaries make it clear where substitutes can be introduced.

// ---------------------------------------------------------------------
// 64. Test doubles and React UI behavior
// ---------------------------------------------------------------------

export interface PaymentButtonProps {
  readonly paymentService: PaymentGateway;
  readonly amount: number;
}

export const PaymentButton: FC<PaymentButtonProps> = ({ paymentService, amount }): ReactElement => {
  void paymentService;
  void amount;

  return <button type="button">Pay</button>;
};

// A UI test should normally verify the user's observable payment behavior.
// The payment service can be controlled separately at its external boundary.

// ---------------------------------------------------------------------
// 65. Test doubles should support behavior-focused tests
// ---------------------------------------------------------------------

export interface BehaviorFocusedDouble {
  readonly dependency: string;
  readonly controlledBehavior: string;
  readonly observableResult: string;
}

export const behaviorFocusedDouble: BehaviorFocusedDouble = {
  dependency: "Payment gateway",
  controlledBehavior: "Payment succeeds",
  observableResult: "The UI displays the successful payment state",
};

// The double exists to create the condition required by the behavior test.
// The assertion remains focused on the application's observable result.

// ---------------------------------------------------------------------
// 66. Test double checklist
// ---------------------------------------------------------------------

export interface TestDoubleChecklist {
  readonly step: string;
}

export const testDoubleChecklist: readonly TestDoubleChecklist[] = [
  {
    step: "Identify the dependency boundary",
  },
  {
    step: "Decide whether the real dependency is useful for this test",
  },
  {
    step: "Choose the smallest appropriate double",
  },
  {
    step: "Keep the substitute faithful to the relevant contract",
  },
  {
    step: "Configure controlled responses or interactions",
  },
  {
    step: "Run the behavior under test",
  },
  {
    step: "Assert meaningful outcomes or required interactions",
  },
  {
    step: "Reset or discard state between tests",
  },
];

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - A test double is a substitute for a dependency used to control or observe behavior during testing.
// - Dummies satisfy required dependencies without participating in the behavior under test.
// - Stubs provide controlled responses for specific scenarios.
// - Fakes are simplified but functional implementations that can model meaningful behavior and state.
// - Spies record interactions so tests can inspect calls after the behavior occurs.
// - Mocks are commonly used to define and verify expected interactions, although terminology varies between tools.
// - The appropriate test double depends on whether the test needs irrelevant values, controlled responses, working behavior, interaction observation, or interaction expectations.
// - Explicit dependency boundaries make test doubles easier to introduce and reason about.
// - Dependency injection can turn external resources such as clocks, repositories, and services into controllable test inputs.
// - Stubs are useful for deterministic success, empty, and failure scenarios.
// - Fakes are useful when several operations or state transitions need to be exercised against a lightweight implementation.
// - Spies are useful when an interaction is itself part of the behavior contract.
// - A real dependency should still be used when the integration with that dependency is the behavior being tested.
// - Test doubles should not automatically replace every dependency.
// - Over-mocking can produce tests that verify implementation wiring instead of application behavior.
// - Incidental internal calls should generally not become test expectations unless they are part of a meaningful public contract.
// - Test doubles should model the relevant dependency contract closely enough to avoid unrealistic assumptions.
// - A double can make a test deterministic, but excessive substitution can remove valuable integration behavior.
// - Fresh doubles or explicit reset operations help prevent state from leaking between tests.
// - Test doubles are most useful when they create controlled conditions while the test continues to assert meaningful application behavior.
// - A balanced test suite uses real dependencies and test doubles at different boundaries according to the behavior being verified.
