/**
 * Async Testing
 * =============
 *
 * React applications frequently update the UI asynchronously after user interactions,
 * network requests, timers, effects, or other deferred work. Async tests wait for the
 * observable UI state to reach the expected condition instead of asserting too early.
 */

import { type FC, type ReactElement, useEffect, useState } from "react";

// ---------------------------------------------------------------------
// 1. Why asynchronous testing is necessary
// ---------------------------------------------------------------------

// An asynchronous update does not necessarily happen during the same
// JavaScript turn as the interaction that triggered it.
//
// A test must therefore wait for the UI to reach the expected state:
//
// await waitFor(() => {
//     expect(screen.getByText("Loaded")).toBeInTheDocument();
// });
//
// The important principle is:
//
// interaction -> asynchronous work -> UI update -> assertion

// ---------------------------------------------------------------------
// 2. A component with asynchronous state
// ---------------------------------------------------------------------

export const LoadingMessage: FC = (): ReactElement => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 100);

    return () => window.clearTimeout(timer);
  }, []);

  return loading ? <p role="status">Loading...</p> : <p>Loaded</p>;
};

// The initial render contains "Loading...".
//
// The component later changes to "Loaded".
//
// A test should not immediately assume that the final state already exists.

// ---------------------------------------------------------------------
// 3. Waiting for an element to appear
// ---------------------------------------------------------------------

// For an element that appears asynchronously, an async query is often
// the most direct choice:
//
// const message = await screen.findByText("Loaded");
//
// expect(message).toBeInTheDocument();
//
// findBy queries combine the behavior of a getBy query with asynchronous
// waiting. The query resolves when the matching element appears.

// ---------------------------------------------------------------------
// 4. Waiting for disappearance
// ---------------------------------------------------------------------

// When an existing element should disappear asynchronously, queryBy is
// useful together with waitFor:
//
// await waitFor(() => {
//     expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
// });
//
// queryBy is important because getBy throws when the element is absent.

// ---------------------------------------------------------------------
// 5. waitFor
// ---------------------------------------------------------------------

// waitFor repeatedly executes a callback until the callback succeeds
// or the configured timeout is reached:
//
// await waitFor(() => {
//     expect(screen.getByText("Loaded")).toBeInTheDocument();
// });
//
// The callback should contain the condition that must eventually become true.

// ---------------------------------------------------------------------
// 6. Assertions inside waitFor
// ---------------------------------------------------------------------

// Assertions belong inside waitFor:
//
// await waitFor(() => {
//     expect(screen.getByRole("status")).toHaveTextContent("Saved");
// });
//
// The callback is retried when the assertion throws.
//
// Do not place the assertion only after waitFor:
//
// await waitFor(() => screen.getByRole("status"));
// expect(screen.getByRole("status")).toHaveTextContent("Saved");
//
// That separates the awaited condition from the actual condition being tested.

// ---------------------------------------------------------------------
// 7. Asynchronous user interactions
// ---------------------------------------------------------------------

// user-event interactions are commonly awaited:
//
// const user = userEvent.setup();
//
// await user.click(button);
//
// expect(...).to...;
//
// The interaction itself can trigger asynchronous React updates,
// so the test should wait for the relevant resulting UI state when necessary.

// ---------------------------------------------------------------------
// 8. Loading and loaded states
// ---------------------------------------------------------------------

interface UserProfileProps {
  readonly loadUser: () => Promise<string>;
}

export const UserProfile: FC<UserProfileProps> = ({ loadUser }): ReactElement => {
  const [name, setName] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    void loadUser().then((value) => {
      if (!cancelled) {
        setName(value);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [loadUser]);

  return name === null ? <p role="status">Loading...</p> : <p>Hello, {name}</p>;
};

// A test can verify both states:
//
// render(<UserProfile loadUser={async () => "John Doe"} />);
//
// expect(screen.getByRole("status")).toHaveTextContent("Loading...");
//
// expect(await screen.findByText("Hello, John Doe"))
//     .toBeInTheDocument();
//
// The initial assertion is synchronous.
// The final assertion waits for the asynchronous update.

// ---------------------------------------------------------------------
// 9. Async queries
// ---------------------------------------------------------------------

// Testing Library provides three query families for asynchronous scenarios:
//
// getBy...   -> synchronous, expects the element to exist now
// queryBy... -> synchronous, useful when absence is expected
// findBy...  -> asynchronous, waits for the element to appear
//
// Example:
//
// expect(screen.getByText("Loading...")).toBeInTheDocument();
// expect(await screen.findByText("Loaded")).toBeInTheDocument();

// ---------------------------------------------------------------------
// 10. findBy versus waitFor
// ---------------------------------------------------------------------

// Prefer findBy when the condition is simply that one element should
// eventually appear:
//
// const message = await screen.findByRole("status", {name: "Saved"});
//
// Use waitFor when the condition requires a more general assertion:
//
// await waitFor(() => {
//     expect(screen.getByRole("button", {name: "Save"})).toBeEnabled();
// });
//
// findBy is a query.
// waitFor waits for an assertion or arbitrary callback to succeed.

// ---------------------------------------------------------------------
// 11. Waiting for a value change
// ---------------------------------------------------------------------

export const AsyncInput: FC = (): ReactElement => {
  const [value, setValue] = useState("Waiting...");

  useEffect(() => {
    const timer = window.setTimeout(() => setValue("Ready"), 100);

    return () => window.clearTimeout(timer);
  }, []);

  return <output>{value}</output>;
};

// A value change can be awaited with waitFor:
//
// await waitFor(() => {
//     expect(screen.getByRole("status")).toHaveValue("Ready");
// });
//
// For non-form elements, assert their text instead:
//
// await waitFor(() => {
//     expect(screen.getByText("Ready")).toBeInTheDocument();
// });

// ---------------------------------------------------------------------
// 12. Waiting for an element to disappear
// ---------------------------------------------------------------------

export const TemporaryMessage: FC = (): ReactElement => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setVisible(false), 100);

    return () => window.clearTimeout(timer);
  }, []);

  return visible ? <p role="status">Saving...</p> : <p>Saved</p>;
};

// To test disappearance:
//
// await waitFor(() => {
//     expect(screen.queryByRole("status")).not.toBeInTheDocument();
// });
//
// The query returns null after the element disappears, allowing the
// negated assertion to succeed.

// ---------------------------------------------------------------------
// 13. Avoid arbitrary delays
// ---------------------------------------------------------------------

// Avoid:
//
// await new Promise((resolve) => setTimeout(resolve, 100));
//
// This waits for a fixed amount of time rather than for the condition
// the test actually cares about.
//
// Prefer:
//
// await waitFor(() => {
//     expect(screen.getByText("Saved")).toBeInTheDocument();
// });
//
// Condition-based waiting is less dependent on implementation timing.

// ---------------------------------------------------------------------
// 14. Async tests should return or await their Promise
// ---------------------------------------------------------------------

// An async test should await asynchronous work:
//
// test("loads the profile", async () => {
//     render(...);
//
//     expect(await screen.findByText("John Doe")).toBeInTheDocument();
// });
//
// Without await, the test runner can finish before the asynchronous
// assertion has completed.

// ---------------------------------------------------------------------
// 15. Handling rejected asynchronous operations
// ---------------------------------------------------------------------

export const FailedRequest: FC = (): ReactElement => {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.reject(new Error("Request failed")).catch(() => {
      setError("Unable to load profile");
    });
  }, []);

  return error === null ? <p role="status">Loading...</p> : <p role="alert">{error}</p>;
};

// A test can wait for the error UI:
//
// expect(await screen.findByRole("alert"))
//     .toHaveTextContent("Unable to load profile");
//
// The test verifies the user-visible result rather than the internal
// Promise implementation.

// ---------------------------------------------------------------------
// 16. Async testing should observe the UI
// ---------------------------------------------------------------------

// Prefer testing observable behavior:
//
// const alert = await screen.findByRole("alert");
// expect(alert).toHaveTextContent("Unable to load profile");
//
// Avoid testing internal implementation details such as:
//
// - whether a specific Promise chain was used;
// - how many internal callbacks ran;
// - the exact timer implementation;
// - private component state.
//
// The asynchronous test should focus on what the user eventually sees.

// ---------------------------------------------------------------------
// 17. A complete asynchronous flow
// ---------------------------------------------------------------------

export const SaveStatus: FC = (): ReactElement => {
  const [status, setStatus] = useState("Idle");

  const save = async (): Promise<void> => {
    setStatus("Saving...");
    await Promise.resolve();
    setStatus("Saved");
  };

  return (
    <div>
      <button type="button" onClick={() => void save()}>
        Save
      </button>
      <p role="status">{status}</p>
    </div>
  );
};

// A test can model the complete flow:
//
// const user = userEvent.setup();
//
// render(<SaveStatus />);
//
// const button = screen.getByRole("button", {name: "Save"});
// const status = screen.getByRole("status");
//
// expect(status).toHaveTextContent("Idle");
//
// await user.click(button);
//
// expect(status).toHaveTextContent("Saving...");
//
// await waitFor(() => {
//     expect(status).toHaveTextContent("Saved");
// });
//
// The test distinguishes the immediate state from the eventual state.

// ---------------------------------------------------------------------
// 18. Async failures and timeouts
// ---------------------------------------------------------------------

// Async queries and waitFor eventually stop waiting when their condition
// cannot be satisfied within the configured timeout.
//
// For example:
//
// await screen.findByText("Loaded");
//
// If "Loaded" never appears, the query rejects instead of waiting forever.
//
// This makes a missing asynchronous state fail the test rather than
// leaving the test indefinitely pending.

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - Asynchronous tests wait for observable UI state instead of asserting too early.
// - findBy queries wait for an element to appear asynchronously.
// - waitFor retries a callback until its assertions succeed or the timeout is reached.
// - queryBy is useful when waiting for an element to disappear.
// - Assertions that depend on asynchronous state should be awaited.
// - Prefer condition-based waiting over arbitrary fixed delays.
// - findBy is usually the simplest choice when waiting for one element to appear.
// - waitFor is useful for more general asynchronous assertions.
// - Async tests should verify user-visible results rather than implementation details.
// - Loading, success, error, appearance, disappearance, and state transitions are common async behaviors to test.
