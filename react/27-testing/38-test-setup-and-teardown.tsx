/**
 * Test Setup and Teardown
 * =======================
 *
 * Test setup prepares the environment and data required by a test, while teardown restores the
 * environment after a test or test suite finishes. Vitest provides lifecycle hooks such as
 * `beforeEach`, `afterEach`, `beforeAll`, and `afterAll` for controlling this setup and cleanup.
 */

import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import type { FC, ReactElement } from "react";

// ---------------------------------------------------------------------
// 1. Basic test setup and teardown
// ---------------------------------------------------------------------

// `beforeEach` runs before every test in its surrounding scope.
// `afterEach` runs after every test in its surrounding scope.
//
// describe("feature", () => {
//     beforeEach(() => {
//         // Prepare state required by each test.
//     });
//
//     afterEach(() => {
//         // Restore state changed by each test.
//     });
//
//     it("runs one test", () => {
//         // Test body.
//     });
//
//     it("runs another test", () => {
//         // Test body.
//     });
// });

// ---------------------------------------------------------------------
// 2. beforeEach
// ---------------------------------------------------------------------

let testValue = 0;

beforeEach(() => {
  testValue = 10;
});

// Every test that uses this module-level value starts with the same state.

it("starts with the value prepared by beforeEach", () => {
  expect(testValue).toBe(10);
});

it("receives fresh setup before the test", () => {
  testValue += 5;

  expect(testValue).toBe(15);
});

// `beforeEach` runs again before this test, so it does not inherit the value
// changed by the previous test.

// ---------------------------------------------------------------------
// 3. afterEach
// ---------------------------------------------------------------------

let resourceIsActive = false;

beforeEach(() => {
  resourceIsActive = true;
});

afterEach(() => {
  resourceIsActive = false;
});

it("uses a resource prepared for the test", () => {
  expect(resourceIsActive).toBe(true);
});

// After this test completes, `afterEach` restores the resource state.

// ---------------------------------------------------------------------
// 4. beforeAll
// ---------------------------------------------------------------------

let sharedResource = "";

beforeAll(() => {
  sharedResource = "initialized";
});

afterAll(() => {
  sharedResource = "";
});

it("can use a resource initialized once", () => {
  expect(sharedResource).toBe("initialized");
});

// `beforeAll` runs once before the tests in its scope.
// `afterAll` runs once after the tests in its scope.
//
// This is useful for expensive setup that can safely be shared across tests.
// Shared mutable state should still be avoided when each test can use isolated
// setup instead.

// ---------------------------------------------------------------------
// 5. Hook execution order
// ---------------------------------------------------------------------

// Hooks can be nested:
//
// describe("outer", () => {
//     beforeEach(() => {
//         // Outer setup.
//     });
//
//     describe("inner", () => {
//         beforeEach(() => {
//             // Inner setup.
//         });
//
//         it("runs hooks in scope order", () => {
//             // Test.
//         });
//     });
// });
//
// For a test inside the nested scope, the outer `beforeEach` runs before the
// inner `beforeEach`. Teardown runs in the corresponding reverse nesting order.

// ---------------------------------------------------------------------
// 6. beforeEach versus beforeAll
// ---------------------------------------------------------------------

// Use `beforeEach` when every test needs a fresh state:
//
// beforeEach(() => {
//     database = createTestDatabase();
// });
//
// Use `beforeAll` when setup can safely be performed once:
//
// beforeAll(async () => {
//     await startTestServer();
// });
//
// The distinction is primarily about lifecycle and isolation:
//
// beforeEach
//     -> every test
//
// beforeAll
//     -> once per surrounding scope

// ---------------------------------------------------------------------
// 7. afterEach for cleanup
// ---------------------------------------------------------------------

const listeners = new Set<string>();

beforeEach(() => {
  listeners.add("test-listener");
});

afterEach(() => {
  listeners.clear();
});

it("can register test resources", () => {
  expect(listeners.has("test-listener")).toBe(true);
});

// Cleanup belongs in teardown when the test changes shared process state,
// registers resources, or creates other state that must not leak into another test.

// ---------------------------------------------------------------------
// 8. Clearing mocks with afterEach
// ---------------------------------------------------------------------

const callback = vi.fn();

afterEach(() => {
  vi.clearAllMocks();
});

it("records a mock call", () => {
  callback("first");

  expect(callback).toHaveBeenCalledTimes(1);
});

it("starts with no calls from the previous test", () => {
  expect(callback).not.toHaveBeenCalled();

  callback("second");

  expect(callback).toHaveBeenCalledTimes(1);
});

// `clearAllMocks` removes recorded calls while preserving the mock's current
// implementation. Use reset or restore APIs when a stronger reset is required.

// ---------------------------------------------------------------------
// 9. Resetting mocks
// ---------------------------------------------------------------------

const configurableMock = vi.fn(() => "default");

afterEach(() => {
  vi.resetAllMocks();
});

it("can temporarily configure a mock", () => {
  configurableMock.mockReturnValue("temporary");

  expect(configurableMock()).toBe("temporary");
});

// Resetting mocks also resets mock implementations to their initial state
// according to the mocking API and configuration in use.

// ---------------------------------------------------------------------
// 10. Restoring spies
// ---------------------------------------------------------------------

const dateSpy = vi.spyOn(Date, "now").mockReturnValue(1234567890);

afterEach(() => {
  vi.restoreAllMocks();
});

it("can replace an existing implementation with a spy", () => {
  expect(Date.now()).toBe(1234567890);
  expect(dateSpy).toHaveBeenCalled();
});

// `restoreAllMocks` restores spies to their original implementations.
// It is especially useful when tests modify existing module or object methods.

// ---------------------------------------------------------------------
// 11. DOM cleanup
// ---------------------------------------------------------------------

export const Greeting: FC = (): ReactElement => {
  return <h1>Hello, John Doe</h1>;
};

// Testing Library automatically performs cleanup after tests in standard
// supported test environments when its automatic cleanup integration is active.
//
// Explicit cleanup can also be registered:
//
// afterEach(() => {
//     cleanup();
// });
//
// Do not combine automatic and manual cleanup unnecessarily.
// If automatic cleanup is disabled or unavailable in the environment, registering
// `cleanup` explicitly ensures rendered DOM is removed after each test.

// ---------------------------------------------------------------------
// 12. Rendering isolated DOM for each test
// ---------------------------------------------------------------------

describe("Greeting", () => {
  it("renders the greeting", () => {
    render(<Greeting />);

    expect(
      //            screen.getByRole("heading", {name: "Hello, John Doe"}),
    ).toBeDefined();
  });
});

// The actual Testing Library assertion is normally:
//
// expect(
//     screen.getByRole("heading", {name: "Hello, John Doe"}),
// ).toBeInTheDocument();
//
// Each test should operate on its own rendered DOM rather than relying on
// elements left behind by another test.

// ---------------------------------------------------------------------
// 13. Cleanup external resources
// ---------------------------------------------------------------------

let connection: { close: () => void } | null = null;

beforeEach(() => {
  connection = {
    close: vi.fn(),
  };
});

afterEach(() => {
  connection?.close();
  connection = null;
});

it("uses a test connection", () => {
  expect(connection).not.toBeNull();
});

// Resources such as connections, subscriptions, observers, and timers should
// be released during teardown.

// ---------------------------------------------------------------------
// 14. Timer cleanup
// ---------------------------------------------------------------------

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

it("runs with controlled timers", () => {
  const callback = vi.fn();

  setTimeout(callback, 1000);

  vi.advanceTimersByTime(1000);

  expect(callback).toHaveBeenCalledTimes(1);
});

// Restoring real timers prevents fake-timer configuration from leaking into
// tests that expect normal timer behavior.

// ---------------------------------------------------------------------
// 15. System time cleanup
// ---------------------------------------------------------------------

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date("2026-01-01T00:00:00.000Z"));
});

afterEach(() => {
  vi.useRealTimers();
});

it("uses deterministic system time", () => {
  expect(Date.now()).toBe(new Date("2026-01-01T00:00:00.000Z").getTime());
});

// Fake timers can also control the system clock.
// Teardown should restore real timers after the test.

// ---------------------------------------------------------------------
// 16. Environment variable cleanup
// ---------------------------------------------------------------------

const originalEnvironmentValue = process.env.TEST_MODE;

beforeEach(() => {
  process.env.TEST_MODE = "test";
});

afterEach(() => {
  if (originalEnvironmentValue === undefined) {
    delete process.env.TEST_MODE;
  } else {
    process.env.TEST_MODE = originalEnvironmentValue;
  }
});

it("can configure process environment for a test", () => {
  expect(process.env.TEST_MODE).toBe("test");
});

// Environment changes are global to the Node.js process.
// Restore the previous value instead of assuming that it was undefined.

// ---------------------------------------------------------------------
// 17. Mocking browser APIs and restoring them
// ---------------------------------------------------------------------

const originalMatchMedia = window.matchMedia;

beforeEach(() => {
  window.matchMedia = vi.fn().mockReturnValue({
    matches: true,
    media: "",
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  });
});

afterEach(() => {
  window.matchMedia = originalMatchMedia;
});

it("can provide a browser API during a test", () => {
  expect(window.matchMedia("(prefers-color-scheme: dark)").matches).toBe(true);
});

// Global browser APIs should be restored so another test does not inherit the
// mocked implementation.

// ---------------------------------------------------------------------
// 18. Setup helpers
// ---------------------------------------------------------------------

interface TestUser {
  readonly id: string;
  readonly name: string;
}

const createTestUser = (): TestUser => {
  return {
    id: "42",
    name: "John Doe",
  };
};

describe("test helper setup", () => {
  let user: TestUser;

  beforeEach(() => {
    user = createTestUser();
  });

  it("creates a predictable user for each test", () => {
    expect(user).toEqual({
      id: "42",
      name: "John Doe",
    });
  });
});

// Factory functions keep repeated setup concise while still allowing each test
// to receive a fresh object.

// ---------------------------------------------------------------------
// 19. Setup should prepare, not assert
// ---------------------------------------------------------------------

// Keep assertions in the test:
//
// beforeEach(() => {
//     user = createTestUser();
// });
//
// it("renders the user", () => {
//     render(<UserCard user={user} />);
//
//     expect(
//         screen.getByText("John Doe"),
//     ).toBeInTheDocument();
// });
//
// Avoid placing test-specific assertions inside setup hooks.
// A hook should establish the conditions under which the test runs.

// ---------------------------------------------------------------------
// 20. Avoid hidden setup
// ---------------------------------------------------------------------

// Hidden setup can make a test difficult to understand:
//
// beforeEach(() => {
//     user = createTestUser();
//     user.role = "admin";
//     featureFlags.enable("new-profile");
//     mockApi();
// });
//
// it("renders the profile", () => {
//     // Many important conditions are hidden above.
// });
//
// Prefer setup that is small and directly relevant to the tests in its scope.

// ---------------------------------------------------------------------
// 21. Test-local setup
// ---------------------------------------------------------------------

describe("user profile", () => {
  const createProfile = () => ({
    name: "John Doe",
    role: "User",
  });

  it("renders the profile name", () => {
    const profile = createProfile();

    expect(profile.name).toBe("John Doe");
  });

  it("renders the profile role", () => {
    const profile = createProfile();

    expect(profile.role).toBe("User");
  });
});

// Not every repeated value requires a lifecycle hook.
// Local setup can be clearer when only one test needs the data.

// ---------------------------------------------------------------------
// 22. Scope hooks narrowly
// ---------------------------------------------------------------------

describe("feature with isolated setup", () => {
  let featureEnabled = false;

  beforeEach(() => {
    featureEnabled = true;
  });

  afterEach(() => {
    featureEnabled = false;
  });

  it("uses the enabled feature", () => {
    expect(featureEnabled).toBe(true);
  });
});

// A nested `describe` block limits setup to tests that actually need it.
// This avoids applying unrelated global state to the entire test file.

// ---------------------------------------------------------------------
// 23. Setup hooks are not shared test state
// ---------------------------------------------------------------------

// This pattern is risky:
//
// let value = 0;
//
// beforeEach(() => {
//     value = createValue();
// });
//
// it("changes value", () => {
//     value = 20;
// });
//
// it("expects another initial value", () => {
//     // beforeEach creates a fresh value again.
// });
//
// The reset is useful, but tests should still avoid depending on execution
// order. Each test should be understandable in isolation.

// ---------------------------------------------------------------------
// 24. beforeAll with expensive setup
// ---------------------------------------------------------------------

// An expensive resource can sometimes be initialized once:
//
// let server: TestServer;
//
// beforeAll(async () => {
//     server = await startTestServer();
// });
//
// afterAll(async () => {
//     await server.close();
// });
//
// it("uses the server", async () => {
//     // Request against the test server.
// });
//
// Use this pattern when sharing the resource is safe.
// If tests mutate shared server state, reset that state between tests.

// ---------------------------------------------------------------------
// 25. Reset shared state between tests
// ---------------------------------------------------------------------

// A shared resource can still require per-test cleanup:
//
// beforeAll(async () => {
//     server = await startTestServer();
// });
//
// beforeEach(async () => {
//     await server.resetDatabase();
// });
//
// afterAll(async () => {
//     await server.close();
// });
//
// This separates:
//
// beforeAll
//     -> expensive resource creation
//
// beforeEach
//     -> per-test isolation
//
// afterAll
//     -> resource destruction

// ---------------------------------------------------------------------
// 26. Async setup
// ---------------------------------------------------------------------

// Lifecycle hooks can be asynchronous:
//
// beforeEach(async () => {
//     await prepareTestData();
// });
//
// afterEach(async () => {
//     await removeTestData();
// });
//
// Vitest waits for the returned Promise before continuing the lifecycle.
//
// Avoid forgetting `await`:
//
// beforeEach(() => {
//     prepareTestData();
// });
//
// Without returning or awaiting the Promise, the test may begin before setup
// has completed.

// ---------------------------------------------------------------------
// 27. Async teardown
// ---------------------------------------------------------------------

// Teardown should also return or await asynchronous cleanup:
//
// afterEach(async () => {
//     await database.reset();
// });
//
// This ensures the next test does not start while cleanup is still running.

// ---------------------------------------------------------------------
// 28. Cleanup should happen even when a test fails
// ---------------------------------------------------------------------

// Lifecycle teardown is designed to run independently of whether the test
// itself passes or fails:
//
// afterEach(() => {
//     vi.restoreAllMocks();
// });
//
// If the test throws an assertion error, teardown still runs.
//
// This is one reason resource cleanup belongs in lifecycle hooks rather than
// only at the end of the test body.

// ---------------------------------------------------------------------
// 29. Cleanup order matters
// ---------------------------------------------------------------------

// If one resource depends on another, release them in a safe order:
//
// beforeEach(() => {
//     database = createDatabase();
//     service = createService(database);
// });
//
// afterEach(() => {
//     service?.close();
//     database?.close();
// });
//
// The dependent service is closed before its underlying database.

// ---------------------------------------------------------------------
// 30. Keep cleanup idempotent when practical
// ---------------------------------------------------------------------

// Cleanup may be easier to reason about when calling it more than once is safe:
//
// const cleanupResource = () => {
//     if (resource) {
//         resource.close();
//         resource = null;
//     }
// };
//
// afterEach(() => {
//     cleanupResource();
// });
//
// Guarding cleanup can prevent errors when setup fails partway through or when
// a resource was never created.

// ---------------------------------------------------------------------
// 31. Setup failures
// ---------------------------------------------------------------------

// If setup fails, the test may never execute:
//
// beforeEach(async () => {
//     await connectToTestDatabase();
// });
//
// it("runs only after setup succeeds", () => {
//     // Test body.
// });
//
// A failing setup hook indicates that the test environment could not be
// established. Keep setup deterministic and report failures clearly.

// ---------------------------------------------------------------------
// 32. Teardown failures
// ---------------------------------------------------------------------

// Teardown can also fail:
//
// afterEach(async () => {
//     await closeTestDatabase();
// });
//
// Cleanup failures are important because leaked or partially cleaned resources
// can affect later tests. Teardown should therefore be reliable and explicit.

// ---------------------------------------------------------------------
// 33. Global setup versus local setup
// ---------------------------------------------------------------------

// Global setup:
//
// beforeEach(() => {
//     // Applies to every test in this file.
// });
//
// Local setup:
//
// describe("database tests", () => {
//     beforeEach(() => {
//         // Applies only to database tests.
//     });
// });
//
// Prefer the narrowest scope that accurately represents the dependency.

// ---------------------------------------------------------------------
// 34. Do not use setup hooks to hide the test subject
// ---------------------------------------------------------------------

// Avoid:
//
// beforeEach(() => {
//     render(<UserCard name="John Doe" role="User" />);
// });
//
// it("renders the name", () => {
//     expect(
//         screen.getByRole("heading", {name: "John Doe"}),
//     ).toBeInTheDocument();
// });
//
// The test subject is hidden in setup.
//
// Prefer:
//
// it("renders the name", () => {
//     render(
//         <UserCard
//             name="John Doe"
//             role="User"
//         />,
//     );
//
//     expect(
//         screen.getByRole("heading", {name: "John Doe"}),
//     ).toBeInTheDocument();
// });
//
// This makes the test's arrangement visible next to its assertion.

// ---------------------------------------------------------------------
// 35. When shared render setup is useful
// ---------------------------------------------------------------------

// A shared render helper can be useful when every test in a focused suite
// genuinely needs the same provider configuration:
//
// const renderProfile = () => {
//     return render(
//         <ProfileProvider>
//             <UserCard
//                 name="John Doe"
//                 role="User"
//             />
//         </ProfileProvider>,
//     );
// };
//
// describe("UserCard with profile context", () => {
//     it("renders the name", () => {
//         renderProfile();
//
//         expect(
//             screen.getByRole("heading", {name: "John Doe"}),
//         ).toBeInTheDocument();
//     });
// });
//
// The helper should hide repetitive infrastructure, not important test inputs.

// ---------------------------------------------------------------------
// 36. Cleanup and user-event
// ---------------------------------------------------------------------

// User interactions should normally be awaited:
//
// it("handles a click", async () => {
//     const user = userEvent.setup();
//
//     render(<Greeting />);
//
//     await user.click(
//         screen.getByRole("button", {name: "Save"}),
//     );
// });
//
// Testing Library's automatic cleanup handles the rendered DOM between tests.
// The interaction object itself is test-local, so no lifecycle hook is needed.

// ---------------------------------------------------------------------
// 37. Resetting network handlers
// ---------------------------------------------------------------------

// With MSW, request handlers can be changed for an individual test:
//
// beforeAll(() => {
//     server.listen({onUnhandledRequest: "error"});
// });
//
// afterEach(() => {
//     server.resetHandlers();
// });
//
// afterAll(() => {
//     server.close();
// });
//
// `resetHandlers` restores the initial handler configuration after each test.
// `close` shuts down the request interception when the suite finishes.

// ---------------------------------------------------------------------
// 38. Lifecycle ownership
// ---------------------------------------------------------------------

// A useful ownership rule is:
//
// beforeAll
//     -> create long-lived suite resources
//
// beforeEach
//     -> establish isolated test state
//
// test
//     -> exercise behavior
//
// afterEach
//     -> remove per-test changes
//
// afterAll
//     -> release long-lived suite resources
//
// The hook should own the lifecycle of the resource it creates or modifies.

// ---------------------------------------------------------------------
// 39. Avoid unnecessary global mutable state
// ---------------------------------------------------------------------

// This creates hidden coupling:
//
// let currentUser: TestUser;
//
// beforeEach(() => {
//     currentUser = createTestUser();
// });
//
// Multiple tests can mutate `currentUser`.
//
// Prefer test-local values:
//
// it("uses a test user", () => {
//     const currentUser = createTestUser();
//
//     expect(currentUser.name).toBe("John Doe");
// });
//
// Local state is easier to trace and cannot leak through module-level mutation.

// ---------------------------------------------------------------------
// 40. A complete lifecycle pattern
// ---------------------------------------------------------------------

interface TestResource {
  readonly close: () => void;
}

let resource: TestResource | null = null;
let mockApiCall: ReturnType<typeof vi.fn>;

beforeAll(() => {
  resource = {
    close: vi.fn(),
  };
});

beforeEach(() => {
  mockApiCall = vi.fn().mockReturnValue({
    name: "John Doe",
  });

  vi.useFakeTimers();
});

afterEach(() => {
  vi.clearAllMocks();
  vi.useRealTimers();
});

afterAll(() => {
  resource?.close();
  resource = null;
});

describe("complete lifecycle", () => {
  it("uses isolated test setup", () => {
    expect(mockApiCall()).toEqual({
      name: "John Doe",
    });

    expect(mockApiCall).toHaveBeenCalledTimes(1);
  });

  it("receives fresh mock state", () => {
    expect(mockApiCall).not.toHaveBeenCalled();
  });
});

// This pattern demonstrates:
//
// beforeAll
//     -> create a suite-level resource
//
// beforeEach
//     -> create fresh per-test state
//     -> configure fake timers
//
// afterEach
//     -> clear mocks
//     -> restore real timers
//
// afterAll
//     -> close the suite-level resource

// ---------------------------------------------------------------------
// 41. Setup and teardown design principles
// ---------------------------------------------------------------------

// Good setup:
//
// - Is deterministic.
// - Is easy to discover.
// - Creates only what the test needs.
// - Produces fresh mutable state when isolation requires it.
// - Keeps important test inputs visible.
//
// Good teardown:
//
// - Reverses global changes.
// - Releases resources.
// - Restores mocks and spies.
// - Restores timers.
// - Removes test-specific handlers.
// - Prevents state from leaking into later tests.

// ---------------------------------------------------------------------
// 42. Common lifecycle mistakes
// ---------------------------------------------------------------------

// Common mistakes include:
//
// - Using `beforeAll` for mutable state that should be isolated per test.
// - Forgetting to restore fake timers.
// - Leaving spies installed after a test.
// - Leaving network handlers modified.
// - Mutating environment variables without restoring them.
// - Starting resources without closing them.
// - Performing assertions inside generic setup hooks.
// - Hiding important test inputs inside global setup.
// - Performing asynchronous setup without awaiting it.
// - Updating shared state instead of creating fresh test state.

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - `beforeEach` runs before every test in its scope and is commonly used for isolated test setup.
// - `afterEach` runs after every test and is commonly used for cleanup and state restoration.
// - `beforeAll` runs once before the tests in its scope and is useful for safely shareable expensive setup.
// - `afterAll` runs once after the tests in its scope and should release long-lived resources.
// - Nested hooks apply according to their surrounding test scopes.
// - Asynchronous lifecycle hooks should return or await their Promises.
// - Mock calls, implementations, spies, timers, environment variables, and browser APIs may require explicit restoration.
// - Testing Library normally performs DOM cleanup automatically when its cleanup integration is active.
// - Shared resources can be created once and reset between tests when creating them for every test is unnecessarily expensive.
// - Test-local setup is often clearer when only one test needs the data.
// - Setup should establish conditions rather than hide important assertions or test inputs.
// - Teardown should reliably undo changes made by setup or by the test.
// - The narrowest appropriate hook scope reduces hidden dependencies between tests.
// - Tests should remain isolated, deterministic, and understandable regardless of execution order.
