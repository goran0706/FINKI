/**
 * Mocking Timers
 * ==============
 *
 * Timer mocks replace real passage of time with controlled virtual time during tests.
 * They allow tests to verify `setTimeout`, `setInterval`, and related timer behavior
 * without making the test wait for real-world delays.
 */

// ---------------------------------------------------------------------
// 1. Why mock timers
// ---------------------------------------------------------------------

// Real timers make tests unnecessarily slow:
//
// setTimeout(() => {
//     // Runs after the real delay.
// }, 5000);
//
// A timer mock lets the test advance virtual time immediately:
//
// vi.useFakeTimers();
//
// setTimeout(() => {
//     // Runs when the test advances the mocked clock.
// }, 5000);
//
// vi.advanceTimersByTime(5000);
//
// vi.useRealTimers();

// ---------------------------------------------------------------------
// 2. Component with a timeout
// ---------------------------------------------------------------------

import { useEffect, useState, type FC, type ReactElement } from "react";

interface DelayedMessageProps {
  readonly delay: number;
}

export const DelayedMessage: FC<DelayedMessageProps> = ({ delay }): ReactElement => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      setVisible(true);
    }, delay);

    return () => {
      window.clearTimeout(timerId);
    };
  }, [delay]);

  return <output aria-label="Delayed message">{visible ? "Message ready" : "Waiting"}</output>;
};

// The test can control the timeout:
//
// vi.useFakeTimers();
//
// render(<DelayedMessage delay={5000} />);
//
// expect(
//     screen.getByLabelText("Delayed message"),
// ).toHaveTextContent("Waiting");
//
// vi.advanceTimersByTime(5000);
//
// expect(
//     screen.getByLabelText("Delayed message"),
// ).toHaveTextContent("Message ready");
//
// vi.useRealTimers();

// ---------------------------------------------------------------------
// 3. `useFakeTimers`
// ---------------------------------------------------------------------

// `vi.useFakeTimers()` replaces timer APIs with Vitest's fake-timer
// implementation for the current test environment:
//
// vi.useFakeTimers();
//
// // Timer APIs are now controlled by Vitest.
//
// vi.useRealTimers();
//
// Always restore real timers after the test or test suite finishes.

// ---------------------------------------------------------------------
// 4. `useRealTimers`
// ---------------------------------------------------------------------

// `vi.useRealTimers()` restores the normal timer implementation:
//
// afterEach(() => {
//     vi.useRealTimers();
// });
//
// This prevents fake timers from leaking into unrelated tests.

// ---------------------------------------------------------------------
// 5. Advancing time
// ---------------------------------------------------------------------

// `vi.advanceTimersByTime` moves the virtual clock forward:
//
// vi.useFakeTimers();
//
// const callback = vi.fn();
//
// setTimeout(callback, 1000);
//
// expect(callback).not.toHaveBeenCalled();
//
// vi.advanceTimersByTime(1000);
//
// expect(callback).toHaveBeenCalledTimes(1);
//
// vi.useRealTimers();

// ---------------------------------------------------------------------
// 6. Advancing part of a delay
// ---------------------------------------------------------------------

// Advancing less time than the configured delay does not execute the timer:
//
// vi.useFakeTimers();
//
// const callback = vi.fn();
//
// setTimeout(callback, 5000);
//
// vi.advanceTimersByTime(4999);
//
// expect(callback).not.toHaveBeenCalled();
//
// vi.advanceTimersByTime(1);
//
// expect(callback).toHaveBeenCalledTimes(1);
//
// vi.useRealTimers();

// ---------------------------------------------------------------------
// 7. Running pending timers
// ---------------------------------------------------------------------

// `vi.runOnlyPendingTimers()` runs timers that are currently scheduled:
//
// vi.useFakeTimers();
//
// const callback = vi.fn();
//
// setTimeout(callback, 5000);
//
// vi.runOnlyPendingTimers();
//
// expect(callback).toHaveBeenCalledTimes(1);
//
// vi.useRealTimers();
//
// This is useful when the exact amount of elapsed time is not the behavior
// being tested and the test only needs the currently pending timer to execute.

// ---------------------------------------------------------------------
// 8. Running all timers
// ---------------------------------------------------------------------

// `vi.runAllTimers()` continues running timers until there are no pending timers:
//
// vi.useFakeTimers();
//
// const first = vi.fn();
// const second = vi.fn();
//
// setTimeout(() => {
//     first();
//     setTimeout(second, 1000);
// }, 1000);
//
// vi.runAllTimers();
//
// expect(first).toHaveBeenCalledTimes(1);
// expect(second).toHaveBeenCalledTimes(1);
//
// vi.useRealTimers();

// ---------------------------------------------------------------------
// 9. Interval component
// ---------------------------------------------------------------------

interface PollingCounterProps {
  readonly interval: number;
}

export const PollingCounter: FC<PollingCounterProps> = ({ interval }): ReactElement => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setCount((currentCount) => currentCount + 1);
    }, interval);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [interval]);

  return <output aria-label="Polling count">{count}</output>;
};

// A test can advance through multiple interval executions:
//
// vi.useFakeTimers();
//
// render(<PollingCounter interval={1000} />);
//
// expect(
//     screen.getByLabelText("Polling count"),
// ).toHaveTextContent("0");
//
// vi.advanceTimersByTime(1000);
//
// expect(
//     screen.getByLabelText("Polling count"),
// ).toHaveTextContent("1");
//
// vi.advanceTimersByTime(2000);
//
// expect(
//     screen.getByLabelText("Polling count"),
// ).toHaveTextContent("3");
//
// vi.useRealTimers();

// ---------------------------------------------------------------------
// 10. Clearing an interval
// ---------------------------------------------------------------------

// A component should clean up an interval when it unmounts:
//
// const intervalId = window.setInterval(() => {
//     // Repeated work.
// }, 1000);
//
// window.clearInterval(intervalId);
//
// Tests can verify observable behavior after unmounting:
//
// vi.useFakeTimers();
//
// const {unmount} = render(
//     <PollingCounter interval={1000} />,
// );
//
// unmount();
//
// vi.advanceTimersByTime(5000);
//
// // No additional interval-driven updates should occur after cleanup.
//
// vi.useRealTimers();

// ---------------------------------------------------------------------
// 11. Testing timer-driven state
// ---------------------------------------------------------------------

interface CountdownProps {
  readonly seconds: number;
}

export const Countdown: FC<CountdownProps> = ({ seconds }): ReactElement => {
  const [remaining, setRemaining] = useState(seconds);

  useEffect(() => {
    if (remaining <= 0) {
      return;
    }

    const timerId = window.setTimeout(() => {
      setRemaining((currentRemaining) => currentRemaining - 1);
    }, 1000);

    return () => {
      window.clearTimeout(timerId);
    };
  }, [remaining]);

  return <output aria-label="Countdown">{remaining}</output>;
};

// A test can advance one second at a time:
//
// vi.useFakeTimers();
//
// render(<Countdown seconds={3} />);
//
// expect(screen.getByLabelText("Countdown")).toHaveTextContent("3");
//
// vi.advanceTimersByTime(1000);
// expect(screen.getByLabelText("Countdown")).toHaveTextContent("2");
//
// vi.advanceTimersByTime(1000);
// expect(screen.getByLabelText("Countdown")).toHaveTextContent("1");
//
// vi.advanceTimersByTime(1000);
// expect(screen.getByLabelText("Countdown")).toHaveTextContent("0");
//
// vi.useRealTimers();

// ---------------------------------------------------------------------
// 12. Advancing timers and React updates
// ---------------------------------------------------------------------

// Timer callbacks can update React state, so timer advancement should happen
// through React's testing update mechanism when required by the test setup:
//
// vi.useFakeTimers();
//
// render(<Countdown seconds={1} />);
//
// act(() => {
//     vi.advanceTimersByTime(1000);
// });
//
// expect(screen.getByLabelText("Countdown")).toHaveTextContent("0");
//
// vi.useRealTimers();
//
// React Testing Library and user-event already handle many `act` concerns,
// but explicit timer advancement may require `act` when the timer callback
// causes a React update.

// ---------------------------------------------------------------------
// 13. `runOnlyPendingTimers` versus `advanceTimersByTime`
// ---------------------------------------------------------------------

// Use `advanceTimersByTime` when elapsed time itself is meaningful:
//
// vi.advanceTimersByTime(3000);
//
// Use `runOnlyPendingTimers` when the test only needs scheduled work to execute:
//
// vi.runOnlyPendingTimers();
//
// The distinction keeps the test aligned with the behavior it actually verifies.

// ---------------------------------------------------------------------
// 14. Testing delayed user feedback
// ---------------------------------------------------------------------

interface SaveFeedbackProps {
  readonly delay: number;
}

export const SaveFeedback: FC<SaveFeedbackProps> = ({ delay }): ReactElement => {
  const [saved, setSaved] = useState(false);

  const handleSave = (): void => {
    window.setTimeout(() => {
      setSaved(true);
    }, delay);
  };

  return (
    <>
      <button type="button" onClick={handleSave}>
        Save
      </button>

      <output aria-label="Save status">{saved ? "Saved" : "Not saved"}</output>
    </>
  );
};

// A timer mock makes the delayed behavior deterministic:
//
// const user = userEvent.setup({
//     advanceTimers: vi.advanceTimersByTime,
// });
//
// vi.useFakeTimers();
//
// render(<SaveFeedback delay={2000} />);
//
// await user.click(
//     screen.getByRole("button", {name: "Save"}),
// );
//
// expect(
//     screen.getByLabelText("Save status"),
// ).toHaveTextContent("Not saved");
//
// vi.advanceTimersByTime(2000);
//
// expect(
//     screen.getByLabelText("Save status"),
// ).toHaveTextContent("Saved");
//
// vi.useRealTimers();

// ---------------------------------------------------------------------
// 15. Fake timers with user-event
// ---------------------------------------------------------------------

// When using fake timers together with `userEvent`, configure user-event
// to advance the same virtual clock:
//
// const user = userEvent.setup({
//     advanceTimers: vi.advanceTimersByTime,
// });
//
// This prevents user-event's internal delays from becoming stuck behind
// the fake clock.

// ---------------------------------------------------------------------
// 16. Testing a debounced callback
// ---------------------------------------------------------------------

interface SearchInputProps {
  readonly onSearch: (value: string) => void;
  readonly delay: number;
}

export const SearchInput: FC<SearchInputProps> = ({ onSearch, delay }): ReactElement => {
  const [value, setValue] = useState("");

  useEffect(() => {
    if (value === "") {
      return;
    }

    const timerId = window.setTimeout(() => {
      onSearch(value);
    }, delay);

    return () => {
      window.clearTimeout(timerId);
    };
  }, [delay, onSearch, value]);

  return (
    <label>
      Search
      <input
        value={value}
        onChange={(event) => {
          setValue(event.target.value);
        }}
      />
    </label>
  );
};

// Fake timers make debounce behavior deterministic:
//
// const user = userEvent.setup({
//     advanceTimers: vi.advanceTimersByTime,
// });
// const onSearch = vi.fn();
//
// vi.useFakeTimers();
//
// render(
//     <SearchInput
//         onSearch={onSearch}
//         delay={500}
//     />,
// );
//
// await user.type(
//     screen.getByRole("textbox", {name: "Search"}),
//     "abc",
// );
//
// expect(onSearch).not.toHaveBeenCalled();
//
// vi.advanceTimersByTime(500);
//
// expect(onSearch).toHaveBeenCalledWith("abc");
//
// vi.useRealTimers();

// ---------------------------------------------------------------------
// 17. Verifying debounce cancellation
// ---------------------------------------------------------------------

// A debounce should cancel the previous timer when a new value arrives:
//
// vi.useFakeTimers();
//
// const onSearch = vi.fn();
//
// render(
//     <SearchInput
//         onSearch={onSearch}
//         delay={500}
//     />,
// );
//
// await user.type(
//     screen.getByRole("textbox", {name: "Search"}),
//     "a",
// );
//
// vi.advanceTimersByTime(250);
//
// await user.type(
//     screen.getByRole("textbox", {name: "Search"}),
//     "b",
// );
//
// vi.advanceTimersByTime(250);
//
// expect(onSearch).not.toHaveBeenCalled();
//
// vi.advanceTimersByTime(250);
//
// expect(onSearch).toHaveBeenCalledTimes(1);
// expect(onSearch).toHaveBeenCalledWith("ab");
//
// vi.useRealTimers();
//
// The first timer is cancelled when the input value changes, so only the
// latest value is submitted after the full debounce period.

// ---------------------------------------------------------------------
// 18. Inspecting pending timers
// ---------------------------------------------------------------------

// `vi.getTimerCount()` reports how many fake timers are currently scheduled:
//
// vi.useFakeTimers();
//
// setTimeout(() => {
//     // Pending work.
// }, 1000);
//
// expect(vi.getTimerCount()).toBe(1);
//
// vi.runOnlyPendingTimers();
//
// expect(vi.getTimerCount()).toBe(0);
//
// vi.useRealTimers();

// ---------------------------------------------------------------------
// 19. Running timers during cleanup
// ---------------------------------------------------------------------

// If a test or hook schedules timers that need cleanup, run pending timers
// before restoring real timers when the test's cleanup logic depends on them:
//
// afterEach(() => {
//     vi.runOnlyPendingTimers();
//     vi.useRealTimers();
// });
//
// The exact cleanup strategy depends on the timer behavior under test.
// Avoid running all timers automatically if doing so can execute unrelated
// or intentionally repeating work.

// ---------------------------------------------------------------------
// 20. Avoiding infinite interval execution
// ---------------------------------------------------------------------

// `runAllTimers` can be problematic with an interval that never clears itself:
//
// const intervalId = setInterval(() => {
//     // Continues indefinitely.
// }, 1000);
//
// vi.runAllTimers();
//
// A continuously scheduled interval can cause the fake-timer runner to
// execute indefinitely or stop with an infinite-loop protection error.
//
// Prefer advancing a finite amount of time or explicitly clearing the interval:
//
// vi.advanceTimersByTime(5000);
// clearInterval(intervalId);

// ---------------------------------------------------------------------
// 21. Testing cleanup behavior
// ---------------------------------------------------------------------

interface TimerStatusProps {
  readonly delay: number;
}

export const TimerStatus: FC<TimerStatusProps> = ({ delay }): ReactElement => {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      setReady(true);
    }, delay);

    return () => {
      window.clearTimeout(timerId);
    };
  }, [delay]);

  return <output aria-label="Timer status">{ready ? "Ready" : "Waiting"}</output>;
};

// A cleanup test should verify that unmounting prevents the delayed update:
//
// vi.useFakeTimers();
//
// const {unmount} = render(
//     <TimerStatus delay={5000} />,
// );
//
// unmount();
//
// vi.advanceTimersByTime(5000);
//
// // The important behavior is that the unmounted component does not receive
// // the timer-driven state update.
//
// vi.useRealTimers();

// ---------------------------------------------------------------------
// 22. Fake system time
// ---------------------------------------------------------------------

// Vitest can also control the system clock:
//
// vi.useFakeTimers();
//
// vi.setSystemTime(
//     new Date("2026-01-01T00:00:00.000Z"),
// );
//
// expect(new Date()).toEqual(
//     new Date("2026-01-01T00:00:00.000Z"),
// );
//
// vi.useRealTimers();
//
// This is different from simply advancing a timeout.
// `setSystemTime` changes the mocked current time used by date/time APIs,
// while timer advancement controls scheduled timer execution.

// ---------------------------------------------------------------------
// 23. Advancing the mocked system clock
// ---------------------------------------------------------------------

// Timer advancement can also move the mocked clock:
//
// vi.useFakeTimers();
//
// vi.setSystemTime(
//     new Date("2026-01-01T00:00:00.000Z"),
// );
//
// vi.advanceTimersByTime(60_000);
//
// expect(new Date()).toEqual(
//     new Date("2026-01-01T00:01:00.000Z"),
// );
//
// vi.useRealTimers();

// ---------------------------------------------------------------------
// 24. Testing date-dependent behavior
// ---------------------------------------------------------------------

export const CurrentYear: FC = (): ReactElement => {
  return <output aria-label="Current year">{new Date().getFullYear()}</output>;
};

// A test can freeze the clock:
//
// vi.useFakeTimers();
//
// vi.setSystemTime(
//     new Date("2026-01-01T00:00:00.000Z"),
// );
//
// render(<CurrentYear />);
//
// expect(
//     screen.getByLabelText("Current year"),
// ).toHaveTextContent("2026");
//
// vi.useRealTimers();

// ---------------------------------------------------------------------
// 25. Testing timer behavior without arbitrary delays
// ---------------------------------------------------------------------

// Avoid tests that actually wait:
//
// await new Promise((resolve) => {
//     setTimeout(resolve, 5000);
// });
//
// Instead, replace real timers and advance virtual time:
//
// vi.useFakeTimers();
//
// const callback = vi.fn();
//
// setTimeout(callback, 5000);
//
// vi.advanceTimersByTime(5000);
//
// expect(callback).toHaveBeenCalledTimes(1);
//
// vi.useRealTimers();

// ---------------------------------------------------------------------
// 26. Timer mocks and observable behavior
// ---------------------------------------------------------------------

// The timer itself is an implementation detail.
// Prefer testing what becomes observable after the timer executes:
//
// vi.useFakeTimers();
//
// render(<DelayedMessage delay={1000} />);
//
// expect(
//     screen.getByLabelText("Delayed message"),
// ).toHaveTextContent("Waiting");
//
// vi.advanceTimersByTime(1000);
//
// expect(
//     screen.getByLabelText("Delayed message"),
// ).toHaveTextContent("Message ready");
//
// vi.useRealTimers();
//
// The test does not need to inspect the internal timer ID.
// It verifies the externally observable state transition.

// ---------------------------------------------------------------------
// 27. Complete timer-testing pattern
// ---------------------------------------------------------------------

// A typical timer test follows this sequence:
//
// beforeEach(() => {
//     vi.useFakeTimers();
// });
//
// afterEach(() => {
//     vi.useRealTimers();
// });
//
// it("shows the message after the delay", () => {
//     render(<DelayedMessage delay={1000} />);
//
//     expect(
//         screen.getByLabelText("Delayed message"),
//     ).toHaveTextContent("Waiting");
//
//     vi.advanceTimersByTime(1000);
//
//     expect(
//         screen.getByLabelText("Delayed message"),
//     ).toHaveTextContent("Message ready");
// });
//
// The test controls time explicitly and completes immediately without
// waiting for the real delay.

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Fake timers replace real timer behavior with a controllable virtual clock.
// - `vi.useFakeTimers()` enables Vitest's fake-timer implementation.
// - `vi.useRealTimers()` restores real timer behavior.
// - `vi.advanceTimersByTime()` advances the virtual clock by a specific duration.
// - `vi.runOnlyPendingTimers()` executes currently pending timers.
// - `vi.runAllTimers()` executes timers until no timers remain.
// - `vi.getTimerCount()` reports the number of pending fake timers.
// - Fake timers are useful for testing timeouts, intervals, debounce logic, and delayed UI.
// - Timer-driven React state updates may need `act` around explicit timer advancement.
// - Configure `userEvent` with `advanceTimers` when combining user-event and fake timers.
// - `vi.setSystemTime()` controls the mocked current system time.
// - Repeating intervals require care because running all timers can produce unbounded execution.
// - Restore real timers after tests so fake-clock state does not leak into other tests.
// - Prefer asserting observable behavior rather than timer IDs or other implementation details.
