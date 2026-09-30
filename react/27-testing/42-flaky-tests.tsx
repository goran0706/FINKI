/**
 * Flaky Tests
 * ===========
 *
 * A flaky test is a test that sometimes passes and sometimes fails without a corresponding
 * change to the code being tested. Flakiness usually comes from nondeterministic timing,
 * shared state, asynchronous work, external dependencies, randomness, or environment differences.
 *
 * Reliable tests control the conditions that affect their outcome and assert on observable behavior
 * instead of relying on timing, implementation details, or accidental execution order.
 */

import { afterEach, describe, expect, it, vi } from "vitest";
import type { FC, ReactElement } from "react";
import { useState } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// ---------------------------------------------------------------------
// 1. What makes a test flaky
// ---------------------------------------------------------------------

// A flaky test has an outcome that can change between runs even when the
// application code and test code have not changed.
//
// Common causes include:
// - arbitrary timeouts;
// - race conditions;
// - uncontrolled asynchronous work;
// - shared mutable state;
// - dependence on test execution order;
// - real network requests;
// - current time;
// - randomness;
// - external services;
// - environment-specific behavior.
//
// Flakiness is different from a deterministic failing test.
//
// A deterministic failure produces the same result when the same conditions
// are reproduced. A flaky test can alternate between passing and failing.

// ---------------------------------------------------------------------
// 2. Avoid arbitrary delays
// ---------------------------------------------------------------------

export const DelayedMessage: FC = (): ReactElement => {
  const [message, setMessage] = useState("Waiting...");

  const showMessage = (): void => {
    window.setTimeout(() => {
      setMessage("Complete");
    }, 100);
  };

  return (
    <section aria-label="Delayed message">
      <p>{message}</p>
      <button type="button" onClick={showMessage}>
        Start
      </button>
    </section>
  );
};

// A fragile test might do this:
//
// await user.click(screen.getByRole("button", {name: "Start"}));
// await new Promise((resolve) => setTimeout(resolve, 150));
// expect(screen.getByText("Complete")).toBeInTheDocument();
//
// The test depends on the real scheduler and an arbitrary 150 ms delay.
//
// A better approach is to wait for the observable result:
//
// await user.click(screen.getByRole("button", {name: "Start"}));
// expect(await screen.findByText("Complete")).toBeInTheDocument();

// ---------------------------------------------------------------------
// 3. Use fake timers when testing timer behavior
// ---------------------------------------------------------------------

describe("timer-controlled behavior", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("advances a timer deterministically", () => {
    vi.useFakeTimers();

    let completed = false;

    window.setTimeout(() => {
      completed = true;
    }, 1000);

    expect(completed).toBe(false);

    vi.advanceTimersByTime(1000);

    expect(completed).toBe(true);
  });
});

// Fake timers make timer-based tests deterministic.
//
// The test controls when the timer runs instead of depending on wall-clock
// time or how quickly the test environment executes.

// ---------------------------------------------------------------------
// 4. Do not depend on execution speed
// ---------------------------------------------------------------------

export const isReadyAfterDelay = (elapsedMilliseconds: number): boolean => elapsedMilliseconds >= 500;

// Avoid:
//
// expect(isReadyAfterDelay(performance.now() - startedAt)).toBe(true);
//
// The result can depend on machine load and scheduler behavior.
//
// Prefer deterministic inputs:
//
// expect(isReadyAfterDelay(500)).toBe(true);
// expect(isReadyAfterDelay(499)).toBe(false);

const ready = isReadyAfterDelay(500);

void ready;

// ---------------------------------------------------------------------
// 5. Wait for conditions instead of fixed durations
// ---------------------------------------------------------------------

interface AsyncStatusProps {
  readonly ready: boolean;
}

export const AsyncStatus: FC<AsyncStatusProps> = ({ ready }): ReactElement => (
  <output aria-label="Status">{ready ? "Ready" : "Loading"}</output>
);

// A fixed delay assumes that the application will reach the expected state
// within that exact period.
//
// Condition-based waiting observes the state the test actually cares about:
//
// render(<AsyncStatus ready={false} />);
// expect(screen.getByLabelText("Status")).toHaveTextContent("Loading");
//
// rerender(<AsyncStatus ready={true} />);
// expect(screen.getByLabelText("Status")).toHaveTextContent("Ready");
//
// For genuinely asynchronous UI behavior, Testing Library's findBy queries
// or waitFor should wait for the observable condition.

// ---------------------------------------------------------------------
// 6. Await asynchronous interactions
// ---------------------------------------------------------------------

export const SubmitButton: FC = (): ReactElement => {
  const [submitted, setSubmitted] = useState(false);

  return (
    <button type="button" onClick={() => setSubmitted(true)}>
      {submitted ? "Submitted" : "Submit"}
    </button>
  );
};

// user-event interactions are asynchronous.
//
// Correct:
//
// const user = userEvent.setup();
// render(<SubmitButton />);
//
// await user.click(screen.getByRole("button", {name: "Submit"}));
// expect(
//   screen.getByRole("button", {name: "Submitted"})
// ).toBeInTheDocument();
//
// Omitting await can allow the assertion to execute before the interaction
// has completed, creating timing-dependent failures.

// ---------------------------------------------------------------------
// 7. Avoid race conditions
// ---------------------------------------------------------------------

export async function resolveInOrder<T>(first: Promise<T>, second: Promise<T>): Promise<[T, T]> {
  const firstResult = await first;
  const secondResult = await second;

  return [firstResult, secondResult];
}

// Tests should not assume that independent asynchronous operations finish in
// a particular order unless the application explicitly guarantees that order.
//
// A race condition can occur when a test observes shared state before all
// relevant asynchronous work has completed.
//
// Explicitly controlling or awaiting the relevant promises removes this source
// of nondeterminism.

// ---------------------------------------------------------------------
// 8. Control asynchronous dependencies
// ---------------------------------------------------------------------

export const fetchUserName = async (fetchImplementation: typeof fetch, userId: string): Promise<string> => {
  const response = await fetchImplementation(`/users/${userId}`);

  if (!response.ok) {
    throw new Error("Failed to fetch user.");
  }

  const user = (await response.json()) as {
    readonly name: string;
  };

  return user.name;
};

// Tests should normally replace network dependencies with deterministic
// test doubles.
//
// Example:
//
// const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(
//   new Response(JSON.stringify({name: "John Doe"}), {
//     status: 200,
//     headers: {"Content-Type": "application/json"},
//   }),
// );
//
// await expect(
//   fetchUserName(fetchMock, "123"),
// ).resolves.toBe("John Doe");
//
// This avoids dependence on network availability, server timing, and remote
// data that can change independently of the test.

// ---------------------------------------------------------------------
// 9. Do not make tests depend on real external services
// ---------------------------------------------------------------------

interface ExternalServiceStatusProps {
  readonly available: boolean;
}

export const ExternalServiceStatus: FC<ExternalServiceStatusProps> = ({ available }): ReactElement => (
  <p>{available ? "Service available" : "Service unavailable"}</p>
);

// A test that calls a real API can fail because:
// - the network is unavailable;
// - the server is temporarily unavailable;
// - the response changed;
// - rate limiting occurred;
// - authentication expired;
// - the request was slower than expected.
//
// Mocking or intercepting the dependency makes the test independent of
// external service availability.
//
// Integration and end-to-end tests can deliberately exercise real services,
// but those dependencies should be explicit rather than accidental.

// ---------------------------------------------------------------------
// 10. Reset shared state between tests
// ---------------------------------------------------------------------

let requestCount = 0;

const recordRequest = (): number => {
  requestCount += 1;
  return requestCount;
};

describe("isolated shared state", () => {
  afterEach(() => {
    requestCount = 0;
  });

  it("starts with a clean counter", () => {
    expect(recordRequest()).toBe(1);
  });

  it("also starts with a clean counter", () => {
    expect(recordRequest()).toBe(1);
  });
});

// Mutable module-level state can make tests depend on which test ran first.
//
// Reset shared state in appropriate lifecycle hooks, or preferably avoid
// shared mutable state entirely.

// ---------------------------------------------------------------------
// 11. Avoid test-order dependencies
// ---------------------------------------------------------------------

interface Counter {
  getValue: () => number;
  increment: () => void;
}

const createCounter = (): Counter => {
  let value = 0;

  return {
    getValue: () => value,
    increment: () => {
      value += 1;
    },
  };
};

describe("independent tests", () => {
  it("tests the initial state", () => {
    const counter = createCounter();

    expect(counter.getValue()).toBe(0);
  });

  it("tests incrementing", () => {
    const counter = createCounter();

    counter.increment();

    expect(counter.getValue()).toBe(1);
  });
});

// Each test creates the state it needs.
//
// A test should not depend on another test having already created data,
// changed configuration, or populated a shared variable.

// ---------------------------------------------------------------------
// 12. Reset mocks between tests
// ---------------------------------------------------------------------

describe("mock isolation", () => {
  const callback = vi.fn();

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("records one call", () => {
    callback();

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("starts with no calls from the previous test", () => {
    expect(callback).not.toHaveBeenCalled();

    callback();

    expect(callback).toHaveBeenCalledTimes(1);
  });
});

// clearAllMocks removes recorded calls while keeping the mock implementation.
//
// resetAllMocks also resets mock implementations.
//
// restoreAllMocks restores spies to their original implementations.
//
// The appropriate reset strategy depends on what the test changed.

// ---------------------------------------------------------------------
// 13. Control the current time
// ---------------------------------------------------------------------

export const isExpired = (expirationTime: number, currentTime: number): boolean => currentTime >= expirationTime;

// Avoid:
//
// isExpired(expirationTime, Date.now());
//
// when the test expects a specific result but does not control the current
// clock.
//
// Passing time explicitly makes the function deterministic:
//
// expect(isExpired(2_000, 1_999)).toBe(false);
// expect(isExpired(2_000, 2_000)).toBe(true);

const expirationResult = isExpired(2_000, 2_000);

void expirationResult;

// ---------------------------------------------------------------------
// 14. Fake system time when the code reads the clock internally
// ---------------------------------------------------------------------

describe("system time", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("controls Date.now", () => {
    vi.useFakeTimers();

    const fixedDate = new Date("2026-01-15T12:00:00Z");

    vi.setSystemTime(fixedDate);

    expect(Date.now()).toBe(fixedDate.getTime());
  });
});

// If production code calls Date.now() directly, fake system time can make
// the test deterministic without changing the production API.

// ---------------------------------------------------------------------
// 15. Control randomness
// ---------------------------------------------------------------------

export const createRandomId = (): number => Math.floor(Math.random() * 1_000_000);

// Random output should not normally be asserted against a specific value.
//
// Better:
//
// const id = createRandomId();
// expect(id).toBeGreaterThanOrEqual(0);
// expect(id).toBeLessThan(1_000_000);
//
// When a specific random sequence is part of the behavior being tested,
// mock or control the random source instead of relying on chance.

const randomId = createRandomId();

void randomId;

// ---------------------------------------------------------------------
// 16. Avoid real randomness in deterministic tests
// ---------------------------------------------------------------------

describe("controlled randomness", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("uses a controlled random value", () => {
    vi.spyOn(Math, "random").mockReturnValue(0.5);

    expect(createRandomId()).toBe(500_000);
  });
});

// The test controls the dependency and can therefore assert an exact result.
//
// restoreAllMocks restores Math.random after the test.

// ---------------------------------------------------------------------
// 17. Avoid order-dependent collections
// ---------------------------------------------------------------------

interface NamedUser {
  readonly name: string;
}

export const getUserNames = (users: readonly NamedUser[]): string[] => users.map((user) => user.name);

// Tests should not assume an arbitrary ordering unless ordering is part of
// the contract.
//
// If order is not meaningful, assert the collection as an unordered set
// when the testing library provides an appropriate assertion.
//
// If order is meaningful, preserve and explicitly test the required order.

// ---------------------------------------------------------------------
// 18. Avoid environment-dependent assumptions
// ---------------------------------------------------------------------

export const formatDate = (date: Date, locale: string): string =>
  new Intl.DateTimeFormat(locale, {
    dateStyle: "short",
  }).format(date);

// Date formatting can vary by:
// - locale;
// - timezone;
// - runtime;
// - operating-system configuration.
//
// Tests should explicitly control the relevant environment or test a stable
// contract rather than assuming the machine running the test has a particular
// locale or timezone.

// ---------------------------------------------------------------------
// 19. Avoid DOM timing assumptions
// ---------------------------------------------------------------------

export const AsyncToggle: FC = (): ReactElement => {
  const [enabled, setEnabled] = useState(false);

  return (
    <section aria-label="Async toggle">
      <output aria-label="State">{enabled ? "Enabled" : "Disabled"}</output>

      <button
        type="button"
        onClick={() => {
          window.setTimeout(() => {
            setEnabled(true);
          }, 50);
        }}
      >
        Enable
      </button>
    </section>
  );
};

// Avoid:
//
// await new Promise((resolve) => setTimeout(resolve, 100));
// expect(
//   screen.getByLabelText("State"),
// ).toHaveTextContent("Enabled");
//
// Prefer waiting for the observable state:
//
// expect(
//   await screen.findByText("Enabled"),
// ).toBeInTheDocument();
//
// If the purpose of the test is specifically timer behavior, fake timers
// can provide deterministic control over the timer instead.

// ---------------------------------------------------------------------
// 20. Clean up resources
// ---------------------------------------------------------------------

const createInterval = (callback: () => void, intervalMilliseconds: number): number =>
  window.setInterval(callback, intervalMilliseconds);

describe("resource cleanup", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("does not leave an active timer behind", () => {
    vi.useFakeTimers();

    const callback = vi.fn();
    const intervalId = createInterval(callback, 1000);

    vi.advanceTimersByTime(1000);

    expect(callback).toHaveBeenCalledTimes(1);

    window.clearInterval(intervalId);
  });
});

// Timers, subscriptions, event listeners, sockets, observers, and similar
// resources can continue running after a test finishes.
//
// Leaving them active can affect later tests and create intermittent failures.

// ---------------------------------------------------------------------
// 21. Do not depend on implementation timing
// ---------------------------------------------------------------------

interface StatusAfterRequestProps {
  readonly status: "idle" | "loading" | "success";
}

export const StatusAfterRequest: FC<StatusAfterRequestProps> = ({ status }): ReactElement => {
  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (status === "success") {
    return <p>Success</p>;
  }

  return <p>Idle</p>;
};

// A test should not assert that "Loading..." remains visible for exactly
// 100 milliseconds unless that timing is explicitly part of the product
// requirement.
//
// Instead, test the states and transitions that users can observe.

// ---------------------------------------------------------------------
// 22. Make test data deterministic
// ---------------------------------------------------------------------

interface TestUser {
  readonly id: string;
  readonly name: string;
}

const createTestUser = (overrides: Partial<TestUser> = {}): TestUser => ({
  id: "user-1",
  name: "John Doe",
  ...overrides,
});

describe("deterministic test data", () => {
  it("uses stable default data", () => {
    const user = createTestUser();

    expect(user).toEqual({
      id: "user-1",
      name: "John Doe",
    });
  });
});

// Avoid generating random IDs, random names, or random dates for ordinary
// tests unless randomness itself is what the test is examining.
//
// Stable fixtures make failures reproducible.

// ---------------------------------------------------------------------
// 23. Use user-event consistently
// ---------------------------------------------------------------------

export const EditableName: FC = (): ReactElement => {
  const [name, setName] = useState("");

  return (
    <label>
      Name
      <input
        value={name}
        onChange={(event) => {
          setName(event.target.value);
        }}
      />
    </label>
  );
};

// Correct interaction pattern:
//
// const user = userEvent.setup();
// render(<EditableName />);
//
// await user.type(
//   screen.getByRole("textbox", {name: "Name"}),
//   "John Doe",
// );
//
// expect(
//   screen.getByRole("textbox", {name: "Name"}),
// ).toHaveValue("John Doe");
//
// The interaction is awaited rather than assuming that the DOM updates
// synchronously after calling user.type.

// ---------------------------------------------------------------------
// 24. Diagnose flaky tests by repeating them
// ---------------------------------------------------------------------

// A useful diagnostic process is:
//
// 1. Identify the exact test that intermittently fails.
// 2. Run it repeatedly.
// 3. Record whether failures correlate with timing, ordering, or environment.
// 4. Look for asynchronous work that is not awaited.
// 5. Look for shared mutable state.
// 6. Look for real network, time, randomness, or filesystem dependencies.
// 7. Isolate the nondeterministic dependency.
// 8. Make that dependency deterministic.
// 9. Run the test repeatedly again.
//
// Repetition can expose flakiness, but repeating a test is not a fix.
// The underlying nondeterministic dependency still needs to be addressed.

// ---------------------------------------------------------------------
// 25. Retries are not a real fix
// ---------------------------------------------------------------------

// Some test runners support retrying failed tests.
//
// Retries can be useful for diagnosing or temporarily containing known
// infrastructure instability, but they can also hide genuine test defects.
//
// A test that passes only after several attempts is still nondeterministic.
//
// Prefer fixing the source of the flakiness rather than increasing retries.

// ---------------------------------------------------------------------
// 26. A reliable test has controlled inputs
// ---------------------------------------------------------------------

describe("deterministic test structure", () => {
  it("controls its inputs and observes its result", async () => {
    const user = userEvent.setup();

    render(<EditableName />);

    const input = screen.getByRole("textbox", {
      name: "Name",
    });

    await user.type(input, "John Doe");

    expect(input).toHaveValue("John Doe");
  });
});

// This test controls:
// - the rendered component;
// - the interaction sequence;
// - the input value.
//
// It then verifies an observable result rather than depending on arbitrary
// timing or internal implementation details.

// ---------------------------------------------------------------------
// 27. Flakiness checklist
// ---------------------------------------------------------------------

// When a test flakes, check:
//
// - Is every asynchronous operation awaited?
// - Is the test waiting for an observable condition?
// - Is there an arbitrary setTimeout delay?
// - Is real time involved?
// - Is randomness involved?
// - Is a real network service involved?
// - Is mutable state shared between tests?
// - Are mocks reset appropriately?
// - Are timers, listeners, or subscriptions cleaned up?
// - Does the test depend on execution order?
// - Does it depend on locale, timezone, or environment configuration?
// - Does it assume a particular execution speed?
// - Is a retry masking the underlying problem?
//
// These questions often identify the source of nondeterminism.

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
//
// - A flaky test can pass or fail without a relevant code change.
// - Arbitrary delays make asynchronous tests dependent on execution timing.
// - Await asynchronous interactions and wait for observable conditions.
// - Fake timers can make timer-dependent behavior deterministic.
// - Control clocks, randomness, network dependencies, and other external inputs when needed.
// - Reset shared mutable state and mocks between tests.
// - Avoid test-order dependencies and clean up resources created during tests.
// - Keep test data deterministic unless randomness itself is being tested.
// - Environment-dependent behavior such as locale and timezone should be controlled explicitly.
// - Retries can help diagnose infrastructure problems but do not make a flaky test reliable.
// - Coverage and repeated execution can reveal problems, but reliability comes from removing nondeterminism.
// - A reliable test controls its inputs, waits for the relevant behavior, and verifies observable results.
