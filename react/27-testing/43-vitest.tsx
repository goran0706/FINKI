/**
 * Vitest
 * ======
 *
 * Vitest is a modern JavaScript and TypeScript test runner designed to work well with
 * Vite-based projects. It provides test declarations, assertions, mocks, spies, fake timers,
 * setup hooks, and other features needed to build and run automated tests.
 *
 * Vitest integrates closely with the Vite module system, making it useful for projects that
 * already use Vite for development and production builds.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { type FC, type ReactElement, useState } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// ---------------------------------------------------------------------
// 1. Test structure
// ---------------------------------------------------------------------

// Vitest provides describe and it/test for organizing test cases.
//
// describe groups related tests.
// it defines an individual test case.
// expect creates assertions about the result.
//
// A simple Vitest test has three conceptual parts:
//
// 1. Arrange the required state.
// 2. Perform the behavior being tested.
// 3. Assert the expected result.

export const add = (first: number, second: number): number => first + second;

describe("add", () => {
  it("adds two numbers", () => {
    const result = add(2, 3);

    expect(result).toBe(5);
  });
});

// ---------------------------------------------------------------------
// 2. Test names
// ---------------------------------------------------------------------

// Test names should describe behavior rather than implementation details.
//
// Good:
//
// it("returns the user's display name", () => {
//     ...
// });
//
// Less useful:
//
// it("calls getDisplayName", () => {
//     ...
// });
//
// A behavior-focused name remains useful when the implementation changes.

// ---------------------------------------------------------------------
// 3. Assertions with expect
// ---------------------------------------------------------------------

export const createUser = (name: string): { readonly name: string } => ({
  name,
});

describe("createUser", () => {
  it("creates a user with the supplied name", () => {
    const user = createUser("John Doe");

    expect(user.name).toBe("John Doe");
    expect(user).toEqual({ name: "John Doe" });
  });
});

// toBe checks strict equality.
// toEqual compares values recursively.
//
// Choose the matcher that expresses the behavior the test actually needs.

// ---------------------------------------------------------------------
// 4. Common matchers
// ---------------------------------------------------------------------

describe("common assertions", () => {
  it("supports common value assertions", () => {
    expect(2 + 2).toBe(4);
    expect("John Doe").toContain("John");
    expect([1, 2, 3]).toContain(2);
    expect(10).toBeGreaterThan(5);
    expect(5).toBeGreaterThanOrEqual(5);
    expect(true).toBeTruthy();
    expect(false).toBeFalsy();
    expect(null).toBeNull();
    expect(undefined).toBeUndefined();
  });
});

// Vitest provides many built-in matchers for values, collections,
// strings, numbers, errors, promises, and functions.

// ---------------------------------------------------------------------
// 5. Testing errors
// ---------------------------------------------------------------------

export const parsePositiveNumber = (value: string): number => {
  const number = Number(value);

  if (!Number.isFinite(number) || number <= 0) {
    throw new Error("Value must be a positive number.");
  }

  return number;
};

describe("parsePositiveNumber", () => {
  it("returns a positive number", () => {
    expect(parsePositiveNumber("42")).toBe(42);
  });

  it("throws for invalid input", () => {
    expect(() => parsePositiveNumber("invalid")).toThrow("Value must be a positive number.");
  });
});

// Pass a function to expect when testing a synchronous throw.
// Calling the function before expect would throw outside the assertion.

// ---------------------------------------------------------------------
// 6. Testing promises
// ---------------------------------------------------------------------

export const loadMessage = async (): Promise<string> => {
  return "Loaded";
};

describe("loadMessage", () => {
  it("resolves with the expected value", async () => {
    await expect(loadMessage()).resolves.toBe("Loaded");
  });
});

// resolves unwraps a fulfilled promise for the following matcher.
// rejects can similarly assert a rejected promise.
//
// Tests involving promises should await the assertion so Vitest waits for
// the asynchronous expectation to finish.

// ---------------------------------------------------------------------
// 7. Async test functions
// ---------------------------------------------------------------------

describe("async tests", () => {
  it("can await asynchronous work directly", async () => {
    const message = await loadMessage();

    expect(message).toBe("Loaded");
  });
});

// Returning or awaiting the promise tells Vitest that the test is asynchronous.
// Without that signal, the test could finish before the asynchronous work does.

// ---------------------------------------------------------------------
// 8. beforeEach and afterEach
// ---------------------------------------------------------------------

let requestCount = 0;

describe("test lifecycle", () => {
  beforeEach(() => {
    requestCount = 0;
  });

  afterEach(() => {
    requestCount = 0;
  });

  it("starts with clean state", () => {
    requestCount += 1;

    expect(requestCount).toBe(1);
  });

  it("also starts with clean state", () => {
    expect(requestCount).toBe(0);
  });
});

// beforeEach runs before every test in the describe block.
// afterEach runs after every test in the describe block.
//
// Lifecycle hooks are useful for resetting mutable state and cleaning up
// resources that should not leak between tests.

// ---------------------------------------------------------------------
// 9. beforeAll and afterAll
// ---------------------------------------------------------------------

describe("suite-level lifecycle", () => {
  let initialized = false;

  beforeEach(() => {
    initialized = true;
  });

  afterEach(() => {
    initialized = false;
  });

  it("runs after the per-test setup", () => {
    expect(initialized).toBe(true);
  });
});

// Vitest also provides beforeAll and afterAll for setup or cleanup that
// should happen once for a test suite.
//
// Prefer per-test setup when shared state could create coupling between tests.
// Suite-level setup is appropriate for genuinely shared resources.

// ---------------------------------------------------------------------
// 10. Mock functions
// ---------------------------------------------------------------------

export const notify = (callback: () => void): void => {
  callback();
};

describe("mock functions", () => {
  it("records calls", () => {
    const callback = vi.fn();

    notify(callback);

    expect(callback).toHaveBeenCalledTimes(1);
  });
});

// vi.fn creates a mock function that records how it was called.
//
// Vitest provides matchers such as:
// - toHaveBeenCalled
// - toHaveBeenCalledTimes
// - toHaveBeenCalledWith
// - toHaveBeenLastCalledWith

// ---------------------------------------------------------------------
// 11. Mock return values
// ---------------------------------------------------------------------

describe("mock return values", () => {
  it("can provide controlled results", () => {
    const getName = vi.fn().mockReturnValue("John Doe");

    expect(getName()).toBe("John Doe");
    expect(getName).toHaveBeenCalledTimes(1);
  });

  it("can provide sequential results", () => {
    const getValue = vi.fn().mockReturnValueOnce("first").mockReturnValueOnce("second");

    expect(getValue()).toBe("first");
    expect(getValue()).toBe("second");
  });
});

// Controlled return values make dependencies deterministic and allow tests
// to focus on the behavior of the code under test.

// ---------------------------------------------------------------------
// 12. Spies
// ---------------------------------------------------------------------

export const formatLabel = (value: string): string => value.toUpperCase();

describe("spies", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("can observe an existing method", () => {
    const spy = vi.spyOn(console, "log").mockImplementation(() => undefined);

    console.log("Hello");

    expect(spy).toHaveBeenCalledWith("Hello");
  });
});

// vi.spyOn wraps an existing method so calls can be observed or controlled.
//
// restoreAllMocks restores spied-on implementations after the test.

// ---------------------------------------------------------------------
// 13. Mocking modules
// ---------------------------------------------------------------------

// Vitest can mock modules with vi.mock.
//
// Example:
//
// vi.mock("./user-service", () => ({
//     getUser: vi.fn().mockResolvedValue({
//         id: "user-1",
//         name: "John Doe",
//     }),
// }));
//
// Module mocking is useful when a test should replace an imported dependency
// with a deterministic implementation.
//
// Module mocking is different from spying on an object method: it replaces
// module-provided dependencies rather than observing one existing method.

// ---------------------------------------------------------------------
// 14. Fake timers
// ---------------------------------------------------------------------

describe("fake timers", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("controls timer execution", () => {
    vi.useFakeTimers();

    const callback = vi.fn();

    setTimeout(callback, 1000);

    expect(callback).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1000);

    expect(callback).toHaveBeenCalledTimes(1);
  });
});

// Fake timers replace real timer scheduling with a controllable clock.
//
// Common APIs include:
// - vi.useFakeTimers()
// - vi.useRealTimers()
// - vi.advanceTimersByTime()
// - vi.runAllTimers()
// - vi.runOnlyPendingTimers()

// ---------------------------------------------------------------------
// 15. System time
// ---------------------------------------------------------------------

describe("system time", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("controls Date.now", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-15T12:00:00Z"));

    expect(Date.now()).toBe(new Date("2026-01-15T12:00:00Z").getTime());
  });
});

// Fake system time is useful when application behavior depends on the current
// date or time.

// ---------------------------------------------------------------------
// 16. Testing React components
// ---------------------------------------------------------------------

export const Greeting: FC<{ readonly name: string }> = ({ name }): ReactElement => <p>Hello, {name}.</p>;

describe("Greeting", () => {
  it("renders the supplied name", () => {
    render(<Greeting name="John Doe" />);

    expect(screen.getByText("Hello, John Doe.")).toBeInTheDocument();
  });
});

// Vitest provides the test runner and assertions.
// Testing Library provides the React rendering and DOM querying utilities.
//
// These tools have different responsibilities and work together in a
// typical React testing setup.

// ---------------------------------------------------------------------
// 17. Testing user interactions
// ---------------------------------------------------------------------

export const Counter: FC = (): ReactElement => {
  const [count, setCount] = useState(0);

  return (
    <section aria-label="Counter">
      <output aria-label="Count">{count}</output>
      <button type="button" onClick={() => setCount((current) => current + 1)}>
        Increment
      </button>
    </section>
  );
};

describe("Counter", () => {
  it("increments when the user clicks the button", async () => {
    const user = userEvent.setup();

    render(<Counter />);

    expect(screen.getByLabelText("Count")).toHaveTextContent("0");

    await user.click(screen.getByRole("button", { name: "Increment" }));

    expect(screen.getByLabelText("Count")).toHaveTextContent("1");
  });
});

// userEvent models user interactions.
// Await the interaction because user-event APIs are asynchronous.

// ---------------------------------------------------------------------
// 18. Test isolation
// ---------------------------------------------------------------------

describe("isolated tests", () => {
  it("creates its own state", () => {
    const values: string[] = [];

    values.push("first");

    expect(values).toEqual(["first"]);
  });

  it("does not reuse the previous test's state", () => {
    const values: string[] = [];

    expect(values).toEqual([]);
  });
});

// Tests should establish their own state rather than depending on another
// test to run first or mutate shared data.

// ---------------------------------------------------------------------
// 19. Skipping tests
// ---------------------------------------------------------------------

describe("test selection", () => {
  it.skip("can be temporarily skipped", () => {
    expect(true).toBe(true);
  });
});

// it.skip excludes a test from the current run.
//
// Skipping should be deliberate and temporary when possible.
// A skipped test is not evidence that the behavior works.

// ---------------------------------------------------------------------
// 20. Running only selected tests
// ---------------------------------------------------------------------

describe("focused test execution", () => {
  it("can be selected with CLI filtering", () => {
    expect(true).toBe(true);
  });
});

// Vitest can filter tests by file, test name, project, or other CLI options.
//
// Examples:
//
// vitest
// vitest run
// vitest run src/example.test.ts
// vitest run -t "renders the supplied name"
//
// The exact command depends on the project's scripts and configuration.

// ---------------------------------------------------------------------
// 21. Watch mode
// ---------------------------------------------------------------------

// Running:
//
// vitest
//
// starts Vitest in watch mode in an interactive terminal.
//
// Watch mode reruns affected tests as source files change.
//
// Running:
//
// vitest run
//
// performs a non-watch test run and is commonly used in CI.

// ---------------------------------------------------------------------
// 22. Coverage
// ---------------------------------------------------------------------

// Vitest can collect coverage when the project has a supported coverage
// provider configured.
//
// A typical command is:
//
// vitest run --coverage
//
// The exact provider and configuration depend on the project.
//
// Coverage measures executed statements, branches, functions, and lines.
// It does not determine whether assertions adequately verify behavior.

// ---------------------------------------------------------------------
// 23. Configuration
// ---------------------------------------------------------------------

// Vitest configuration is commonly defined in vitest.config.ts.
//
// Example:
//
// import {defineConfig} from "vitest/config";
//
// export default defineConfig({
//     test: {
//         environment: "jsdom",
//         globals: true,
//         setupFiles: "./src/test-setup.ts",
//     },
// });
//
// defineConfig provides typed configuration.
// The test.environment option selects the environment used by tests.
//
// A React DOM test suite commonly uses jsdom or another browser-like
// environment rather than the default Node environment.

// ---------------------------------------------------------------------
// 24. Test environment
// ---------------------------------------------------------------------

// Browser-oriented tests often need DOM APIs such as document, window,
// HTMLElement, and localStorage.
//
// A project can configure a DOM-like environment:
//
// test: {
//     environment: "jsdom",
// }
//
// Node-oriented tests can use:
//
// test: {
//     environment: "node",
// }
//
// Choose the environment based on the APIs exercised by the tests.

// ---------------------------------------------------------------------
// 25. Setup files
// ---------------------------------------------------------------------

// A setup file can configure shared test behavior before test files execute.
//
// Example:
//
// import "@testing-library/jest-dom/vitest";
//
// The /vitest entry point integrates jest-dom's DOM matchers with Vitest.
//
// A setup file is useful for configuration that genuinely applies across
// the test suite rather than test-specific state.

// ---------------------------------------------------------------------
// 26. TypeScript support
// ---------------------------------------------------------------------

export interface User {
  readonly id: string;
  readonly name: string;
}

export const getUserName = (user: User): string => user.name;

describe("TypeScript support", () => {
  it("tests typed application code", () => {
    const user: User = {
      id: "user-1",
      name: "John Doe",
    };

    expect(getUserName(user)).toBe("John Doe");
  });
});

// Vitest can execute TypeScript test files as part of the Vite toolchain.
//
// Type checking is a separate concern from test execution. A test runner can
// execute code without guaranteeing that the entire project is type-safe.
//
// Use the project's TypeScript checking workflow when type correctness also
// needs to be verified.

// ---------------------------------------------------------------------
// 27. Testing rejected promises
// ---------------------------------------------------------------------

export const loadUser = async (): Promise<User> => {
  throw new Error("User could not be loaded.");
};

describe("rejected promises", () => {
  it("asserts the rejection", async () => {
    await expect(loadUser()).rejects.toThrow("User could not be loaded.");
  });
});

// rejects must be awaited so Vitest waits for the asynchronous assertion.

// ---------------------------------------------------------------------
// 28. Mocking asynchronous functions
// ---------------------------------------------------------------------

export const getRemoteUser = async (): Promise<User> => ({
  id: "user-1",
  name: "John Doe",
});

describe("async mocks", () => {
  it("controls an asynchronous dependency", async () => {
    const getUser = vi.fn().mockResolvedValue({
      id: "user-1",
      name: "John Doe",
    });

    await expect(getUser()).resolves.toEqual({
      id: "user-1",
      name: "John Doe",
    });

    expect(getUser).toHaveBeenCalledTimes(1);
  });
});

// mockResolvedValue creates a mock that returns a resolved promise.
// mockRejectedValue creates a mock that returns a rejected promise.

// ---------------------------------------------------------------------
// 29. Restoring mock state
// ---------------------------------------------------------------------

describe("mock lifecycle", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("restores spies after the test", () => {
    const spy = vi.spyOn(Math, "max").mockReturnValue(100);

    expect(Math.max(1, 2)).toBe(100);
    expect(spy).toHaveBeenCalledWith(1, 2);
  });
});

// clearAllMocks, resetAllMocks, and restoreAllMocks have different purposes:
//
// clearAllMocks:
// removes recorded calls and instances.
//
// resetAllMocks:
// clears recorded state and resets mock implementations.
//
// restoreAllMocks:
// restores original implementations for spies.

// ---------------------------------------------------------------------
// 30. Test configuration should match project needs
// ---------------------------------------------------------------------

// Vitest can be configured for:
// - test environments;
// - setup files;
// - coverage;
// - globals;
// - reporters;
// - test timeouts;
// - projects;
// - aliases and Vite integration.
//
// Keep configuration explicit and project-specific.
//
// Do not add global configuration merely to avoid writing a small amount
// of setup in an individual test.

// ---------------------------------------------------------------------
// 31. Vitest and Vite integration
// ---------------------------------------------------------------------

// Vitest uses Vite's transformation and module-resolution pipeline.
//
// This provides a close relationship between application code and tests:
//
// - TypeScript and JSX can use the same transformation pipeline.
// - Vite aliases can be shared with test configuration.
// - Vite plugins can participate in the test environment when configured.
// - Development feedback can remain fast because Vitest reuses Vite concepts.
//
// The exact configuration depends on the project and its Vite setup.

// ---------------------------------------------------------------------
// 32. Vitest is the runner, not the entire testing stack
// ---------------------------------------------------------------------

// A React project may combine:
//
// Vitest
//   -> test runner, assertions, mocks, spies, timers
//
// Testing Library
//   -> rendering, DOM queries, user-oriented interaction
//
// jest-dom
//   -> DOM-specific assertions
//
// MSW
//   -> network request interception
//
// Each tool addresses a different testing concern.
//
// Vitest does not replace every testing library used by a React application.

// ---------------------------------------------------------------------
// 33. A complete component test
// ---------------------------------------------------------------------

export const LoginButton: FC = (): ReactElement => {
  const [loggedIn, setLoggedIn] = useState(false);

  return (
    <button type="button" onClick={() => setLoggedIn((current) => !current)}>
      {loggedIn ? "Log out" : "Log in"}
    </button>
  );
};

describe("LoginButton", () => {
  it("changes its label after the user logs in", async () => {
    const user = userEvent.setup();

    render(<LoginButton />);

    expect(screen.getByRole("button", { name: "Log in" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Log in" }));

    expect(screen.getByRole("button", { name: "Log out" })).toBeInTheDocument();
  });
});

// This test combines the main pieces:
//
// 1. Vitest provides describe, it, and expect.
// 2. Testing Library renders the component and queries the DOM.
// 3. user-event performs the interaction.
// 4. The assertion checks the resulting user-visible behavior.

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Vitest is a test runner with assertions, mocks, spies, timers, lifecycle hooks, and Vite integration.
// - describe groups related tests, while it or test defines individual test cases.
// - expect provides assertions and supports many built-in matchers.
// - Async tests must return or await their promises so Vitest can observe completion.
// - vi.fn creates mock functions, while vi.spyOn observes or replaces existing methods.
// - Fake timers and controlled system time make time-dependent tests deterministic.
// - Vitest can test React components together with Testing Library and user-event.
// - Vitest configuration controls environments, setup files, coverage, reporters, and other test behavior.
// - Coverage is available through Vitest's coverage tooling when configured.
// - TypeScript execution and TypeScript type checking are separate concerns.
// - Vitest is the test runner; React projects can combine it with Testing Library, jest-dom, and MSW.
// - Reliable Vitest tests should be isolated, deterministic, behavior-focused, and explicit about asynchronous work.
