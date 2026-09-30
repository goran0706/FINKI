/**
 * Jest
 * ====
 *
 * Jest is a JavaScript testing framework that provides a test runner, assertions, mocks,
 * spies, fake timers, lifecycle hooks, and snapshot testing. It can be used to test
 * JavaScript and TypeScript applications, including React components.
 *
 * Jest is independent of the React Testing Library, which provides rendering, DOM queries,
 * and user-oriented interaction utilities for React component tests.
 */

import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, jest } from "@jest/globals";
import { type FC, type ReactElement, useState } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// ---------------------------------------------------------------------
// 1. Basic test structure
// ---------------------------------------------------------------------

// Jest provides describe and it/test for organizing test cases.
//
// describe groups related tests.
// it defines an individual test case.
// expect creates assertions about the result.
//
// A test normally follows this structure:
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

// Test names should describe observable behavior rather than implementation
// details.
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

// Jest provides matchers for values, collections, strings, numbers, errors,
// promises, functions, and other common testing scenarios.

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

export const loadMessage = async (): Promise<string> => "Loaded";

describe("loadMessage", () => {
  it("resolves with the expected value", async () => {
    await expect(loadMessage()).resolves.toBe("Loaded");
  });
});

// resolves unwraps a fulfilled promise for the following matcher.
// rejects can similarly assert a rejected promise.
//
// The assertion must be awaited so Jest waits for the asynchronous expectation.

// ---------------------------------------------------------------------
// 7. Async test functions
// ---------------------------------------------------------------------

describe("async tests", () => {
  it("can await asynchronous work directly", async () => {
    const message = await loadMessage();

    expect(message).toBe("Loaded");
  });
});

// Returning or awaiting a promise tells Jest that the test is asynchronous.
// Otherwise, the test could finish before the asynchronous work completes.

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

// beforeEach runs before every test in its scope.
// afterEach runs after every test in its scope.
//
// Lifecycle hooks are useful for resetting mutable state and cleaning up
// resources that should not leak between tests.

// ---------------------------------------------------------------------
// 9. beforeAll and afterAll
// ---------------------------------------------------------------------

describe("suite-level lifecycle", () => {
  let resourceReady = false;

  beforeAll(() => {
    resourceReady = true;
  });

  afterAll(() => {
    resourceReady = false;
  });

  it("runs after suite setup", () => {
    expect(resourceReady).toBe(true);
  });
});

// beforeAll runs once before the tests in its scope.
// afterAll runs once after the tests in its scope.
//
// Use suite-level hooks for resources that genuinely have suite-wide lifetime.
// Prefer per-test setup when shared state could create test coupling.

// ---------------------------------------------------------------------
// 10. Mock functions
// ---------------------------------------------------------------------

export const notify = (callback: () => void): void => {
  callback();
};

describe("mock functions", () => {
  it("records calls", () => {
    const callback = jest.fn();

    notify(callback);

    expect(callback).toHaveBeenCalledTimes(1);
  });
});

// jest.fn creates a mock function that records how it was called.
//
// Common mock assertions include:
// - toHaveBeenCalled
// - toHaveBeenCalledTimes
// - toHaveBeenCalledWith
// - toHaveBeenLastCalledWith

// ---------------------------------------------------------------------
// 11. Mock return values
// ---------------------------------------------------------------------

describe("mock return values", () => {
  it("can provide a controlled result", () => {
    const getName = jest.fn().mockReturnValue("John Doe");

    expect(getName()).toBe("John Doe");
    expect(getName).toHaveBeenCalledTimes(1);
  });

  it("can provide sequential results", () => {
    const getValue = jest.fn().mockReturnValueOnce("first").mockReturnValueOnce("second");

    expect(getValue()).toBe("first");
    expect(getValue()).toBe("second");
  });
});

// Controlled return values make dependencies deterministic and allow tests
// to focus on the behavior of the code under test.

// ---------------------------------------------------------------------
// 12. Spies
// ---------------------------------------------------------------------

describe("spies", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("can observe an existing method", () => {
    const spy = jest.spyOn(console, "log").mockImplementation(() => undefined);

    console.log("Hello");

    expect(spy).toHaveBeenCalledWith("Hello");
  });
});

// jest.spyOn wraps an existing method so calls can be observed or controlled.
//
// restoreAllMocks restores the original implementations of spies after tests.

// ---------------------------------------------------------------------
// 13. Mocking modules
// ---------------------------------------------------------------------

// Jest can mock imported modules with jest.mock.
//
// Example:
//
// jest.mock("./user-service", () => ({
//     getUser: jest.fn().mockResolvedValue({
//         id: "user-1",
//         name: "John Doe",
//     }),
// }));
//
// Module mocking replaces a module dependency with a controlled test
// implementation.
//
// Module mocking is different from spying on an object method because the
// mocked module becomes the dependency used by the importing code.

// ---------------------------------------------------------------------
// 14. Fake timers
// ---------------------------------------------------------------------

describe("fake timers", () => {
  afterEach(() => {
    jest.useRealTimers();
  });

  it("controls timer execution", () => {
    jest.useFakeTimers();

    const callback = jest.fn();

    setTimeout(callback, 1000);

    expect(callback).not.toHaveBeenCalled();

    jest.advanceTimersByTime(1000);

    expect(callback).toHaveBeenCalledTimes(1);
  });
});

// Fake timers replace real timer scheduling with a controllable clock.
//
// Common APIs include:
// - jest.useFakeTimers()
// - jest.useRealTimers()
// - jest.advanceTimersByTime()
// - jest.runAllTimers()
// - jest.runOnlyPendingTimers()

// ---------------------------------------------------------------------
// 15. System time
// ---------------------------------------------------------------------

describe("system time", () => {
  afterEach(() => {
    jest.useRealTimers();
  });

  it("controls Date.now", () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2026-01-15T12:00:00Z"));

    expect(Date.now()).toBe(new Date("2026-01-15T12:00:00Z").getTime());
  });
});

// Fake system time is useful when application behavior depends on the
// current date or time.

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

// Jest provides the test runner, assertions, mocks, and other test
// infrastructure.
//
// Testing Library provides React rendering and DOM queries.
//
// These tools have separate responsibilities and commonly work together.

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
// Await user-event interactions because its APIs can be asynchronous.

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

// Each test should establish the state it needs rather than depending on
// another test to run first or mutate shared data.

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
// 20. Running selected tests
// ---------------------------------------------------------------------

describe("focused test execution", () => {
  it("can be selected by its name", () => {
    expect(true).toBe(true);
  });
});

// Jest can filter tests by file path, test name, or other CLI options.
//
// Examples:
//
// jest
// jest --runInBand
// jest path/to/example.test.ts
// jest -t "renders the supplied name"
//
// The exact command depends on the project's package scripts and setup.

// ---------------------------------------------------------------------
// 21. Watch mode
// ---------------------------------------------------------------------

// Running:
//
// jest --watch
//
// starts Jest in watch mode.
//
// Watch mode reruns relevant tests as files change.
//
// A non-watch run is commonly used in CI:
//
// jest --runInBand
//
// --runInBand runs tests serially in the current process. It can be useful
// when diagnosing resource-sensitive tests, but it should not be used as a
// substitute for fixing unsafe shared state or test-order dependencies.

// ---------------------------------------------------------------------
// 22. Coverage
// ---------------------------------------------------------------------

// Jest can collect coverage with:
//
// jest --coverage
//
// Coverage reports commonly include:
// - statements;
// - branches;
// - functions;
// - lines.
//
// Coverage shows which code was exercised. It does not prove that the
// assertions adequately verify the intended behavior.

// ---------------------------------------------------------------------
// 23. Configuration
// ---------------------------------------------------------------------

// Jest can be configured in jest.config.ts or another supported configuration
// file.
//
// Example:
//
// export default {
//     testEnvironment: "jsdom",
//     setupFilesAfterEnv: ["<rootDir>/src/test-setup.ts"],
// };
//
// testEnvironment selects the environment used by the tests.
//
// React DOM tests commonly use jsdom or another browser-like environment.

// ---------------------------------------------------------------------
// 24. Setup files
// ---------------------------------------------------------------------

// A setup file can configure behavior shared across the test suite.
//
// Example:
//
// import "@testing-library/jest-dom";
//
// setupFilesAfterEnv runs after the test framework has been installed and
// before the test files execute.
//
// Shared matchers, global test configuration, and common initialization
// can be placed there when they genuinely apply to the entire suite.

// ---------------------------------------------------------------------
// 25. Test environment
// ---------------------------------------------------------------------

// Browser-oriented tests often need DOM APIs such as document, window,
// HTMLElement, and localStorage.
//
// A Jest configuration can select a DOM-like environment:
//
// testEnvironment: "jsdom"
//
// Node-oriented tests can instead use:
//
// testEnvironment: "node"
//
// The correct environment depends on the APIs exercised by the tests.

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

// Jest itself does not make TypeScript type checking equivalent to test
// execution.
//
// A project's TypeScript checking workflow should still run separately when
// type correctness needs to be verified.

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

// rejects unwraps a rejected promise for the following matcher.
// Await the assertion so Jest waits for the asynchronous expectation.

// ---------------------------------------------------------------------
// 28. Mocking asynchronous functions
// ---------------------------------------------------------------------

export const getRemoteUser = async (): Promise<User> => ({
  id: "user-1",
  name: "John Doe",
});

describe("async mocks", () => {
  it("controls an asynchronous dependency", async () => {
    const getUser = jest.fn().mockResolvedValue({
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
    jest.restoreAllMocks();
  });

  it("restores spies after the test", () => {
    const spy = jest.spyOn(Math, "max").mockReturnValue(100);

    expect(Math.max(1, 2)).toBe(100);
    expect(spy).toHaveBeenCalledWith(1, 2);
  });
});

// clearAllMocks removes recorded calls while keeping mock implementations.
//
// resetAllMocks also resets mock implementations.
//
// restoreAllMocks restores original implementations for spies.
//
// The appropriate cleanup strategy depends on what the test changed.

// ---------------------------------------------------------------------
// 30. Jest and React Testing Library
// ---------------------------------------------------------------------

// Jest and React Testing Library solve different problems.
//
// Jest provides:
//
// - test execution;
// - assertions;
// - mocks;
// - spies;
// - fake timers;
// - lifecycle hooks;
// - snapshots.
//
// React Testing Library provides:
//
// - component rendering;
// - DOM queries;
// - user-oriented testing utilities.
//
// A React project can therefore use both without one replacing the other.

// ---------------------------------------------------------------------
// 31. A complete component test
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

// The test combines the main pieces:
//
// 1. Jest provides describe, it, expect, and the test lifecycle.
// 2. Testing Library renders the component and queries the DOM.
// 3. user-event performs the interaction.
// 4. The assertions verify the resulting user-visible behavior.

// ---------------------------------------------------------------------
// 32. Jest snapshot testing
// ---------------------------------------------------------------------

export const UserSummary: FC<{ readonly name: string }> = ({ name }): ReactElement => (
  <article>
    <h2>{name}</h2>
    <p>Account summary</p>
  </article>
);

// Jest supports snapshot assertions such as:
//
// const {container} = render(<UserSummary name="John Doe" />);
// expect(container.firstChild).toMatchSnapshot();
//
// Snapshots store a serialized representation of the tested value.
//
// Snapshot testing can be useful when the output itself is the behavior of
// interest, but large or implementation-heavy snapshots can become difficult
// to review.

// ---------------------------------------------------------------------
// 33. Inline snapshots
// ---------------------------------------------------------------------

describe("inline snapshots", () => {
  it("can assert serialized output inline", () => {
    expect({ name: "John Doe" }).toMatchInlineSnapshot(`
          {
            "name": "John Doe",
          }
        `);
  });
});

// Inline snapshots keep the expected serialized value beside the test.
//
// They are most useful when the snapshot is small and easy to review.

// ---------------------------------------------------------------------
// 34. Mock lifecycle
// ---------------------------------------------------------------------

describe("mock cleanup", () => {
  const callback = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("starts without previous calls", () => {
    expect(callback).not.toHaveBeenCalled();

    callback();

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("also starts without previous calls", () => {
    expect(callback).not.toHaveBeenCalled();
  });
});

// clearAllMocks clears recorded calls and instances.
//
// resetAllMocks additionally resets mock implementations.
//
// restoreAllMocks restores original implementations for spies.

// ---------------------------------------------------------------------
// 35. Jest module mocking
// ---------------------------------------------------------------------

// A module can be mocked with jest.mock:
//
// jest.mock("./user-service", () => ({
//     getUser: jest.fn().mockResolvedValue({
//         id: "user-1",
//         name: "John Doe",
//     }),
// }));
//
// When using TypeScript, the mocked module's types and the project's Jest
// configuration must be compatible with the chosen mocking pattern.

// ---------------------------------------------------------------------
// 36. Deterministic tests
// ---------------------------------------------------------------------

export const isExpired = (expirationTime: number, currentTime: number): boolean => currentTime >= expirationTime;

describe("deterministic time-dependent logic", () => {
  it("uses explicit time values", () => {
    expect(isExpired(2_000, 1_999)).toBe(false);
    expect(isExpired(2_000, 2_000)).toBe(true);
  });
});

// Explicit inputs make pure logic deterministic.
//
// When production code reads Date.now() internally, Jest's fake timers can
// control the system clock instead.

// ---------------------------------------------------------------------
// 37. Jest versus other test tools
// ---------------------------------------------------------------------

// Jest can provide most of the core test infrastructure needed by a project:
//
// - runner;
// - assertions;
// - mocking;
// - spies;
// - fake timers;
// - snapshots;
// - lifecycle hooks.
//
// React Testing Library complements Jest by providing user-oriented DOM
// testing utilities.
//
// Other tools can be added when the project needs capabilities such as
// network interception, end-to-end browser testing, or visual regression.

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Jest is a JavaScript testing framework with a test runner, assertions, mocks, spies, timers, and snapshots.
// - describe groups related tests, while it or test defines individual test cases.
// - expect provides assertions for values, errors, promises, functions, and other test results.
// - jest.fn creates mock functions, while jest.spyOn observes or replaces existing methods.
// - Fake timers and controlled system time make time-dependent behavior deterministic.
// - beforeEach and afterEach provide per-test setup and cleanup; beforeAll and afterAll provide suite-level lifecycle hooks.
// - Jest can test React components together with React Testing Library and user-event.
// - Jest supports module mocking, asynchronous mocks, snapshot testing, and coverage collection.
// - TypeScript execution and TypeScript type checking remain separate concerns.
// - Jest configuration controls the test environment, setup files, coverage, and other test behavior.
// - Reliable Jest tests should be isolated, deterministic, behavior-focused, and explicit about asynchronous work.
