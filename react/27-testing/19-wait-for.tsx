/**
 * Wait For
 * ========
 *
 * `waitFor` waits for an assertion or other condition to become true when the result
 * depends on asynchronous changes. Testing Library repeatedly runs the callback until
 * it completes without throwing or the configured timeout is reached.
 */

import { type FC, type ReactElement, useEffect, useState } from "react";

// ---------------------------------------------------------------------
// 1. Basic waitFor usage
// ---------------------------------------------------------------------

// A `waitFor` callback is retried while it throws.
// The callback should therefore contain an assertion about the expected state.
//
// await waitFor(() => {
//     expect(screen.getByText("Loaded")).toBeInTheDocument();
// });
//
// `waitFor` resolves when the callback finishes without throwing.
// It rejects when the callback continues throwing until the timeout is reached.

// ---------------------------------------------------------------------
// 2. Why the callback must throw
// ---------------------------------------------------------------------

// `waitFor` does not interpret `false` as a failed condition.
//
// Incorrect:
// await waitFor(() => screen.queryByText("Loaded") !== null);
//
// The callback above returns a boolean, but does not throw.
// `waitFor` therefore has no failed assertion to retry.
//
// Correct:
// await waitFor(() => {
//     expect(screen.getByText("Loaded")).toBeInTheDocument();
// });

// ---------------------------------------------------------------------
// 3. Asynchronous UI state
// ---------------------------------------------------------------------

interface User {
  readonly name: string;
}

interface UserProfileProps {
  readonly loadUser: () => Promise<User>;
}

export const UserProfile: FC<UserProfileProps> = ({ loadUser }): ReactElement => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    let active = true;

    void loadUser().then((nextUser) => {
      if (active) {
        setUser(nextUser);
      }
    });

    return () => {
      active = false;
    };
  }, [loadUser]);

  return user ? <p>Welcome, {user.name}</p> : <p>Loading...</p>;
};

// A test can wait for the rendered result:
//
// render(<UserProfile loadUser={loadUser} />);
//
// await waitFor(() => {
//     expect(screen.getByText("Welcome, John Doe")).toBeInTheDocument();
// });
//
// The test does not need to know how long the asynchronous operation takes.

// ---------------------------------------------------------------------
// 4. Waiting for an element to appear
// ---------------------------------------------------------------------

// When the goal is simply to wait for an element to appear, a `findBy` query
// is usually clearer than combining `waitFor` with a `getBy` query.
//
// Preferred:
// const message = await screen.findByText("Welcome, John Doe");
//
// Equivalent pattern:
// await waitFor(() => {
//     expect(screen.getByText("Welcome, John Doe")).toBeInTheDocument();
// });
//
// `findBy` is specifically designed for asynchronous element appearance.
// `waitFor` becomes more useful when the condition is not simply element presence.

// ---------------------------------------------------------------------
// 5. Waiting for an assertion about state
// ---------------------------------------------------------------------

interface SaveStatusProps {
  readonly save: () => Promise<void>;
}

export const SaveStatus: FC<SaveStatusProps> = ({ save }): ReactElement => {
  const [status, setStatus] = useState<"idle" | "saving" | "saved">("idle");

  const handleSave = async (): Promise<void> => {
    setStatus("saving");
    await save();
    setStatus("saved");
  };

  return (
    <section>
      <button type="button" onClick={() => void handleSave()}>
        Save
      </button>
      <output aria-label="Save status">{status}</output>
    </section>
  );
};

// A test can wait for a state-dependent result:
//
// await user.click(screen.getByRole("button", {name: "Save"}));
//
// await waitFor(() => {
//     expect(screen.getByLabelText("Save status")).toHaveTextContent("saved");
// });
//
// The assertion describes the observable result rather than implementation details.

// ---------------------------------------------------------------------
// 6. Waiting for disappearance
// ---------------------------------------------------------------------

// Use a query that returns `null` when the element is absent.
// `getBy...` throws immediately when the element does not exist, which is
// the opposite of what is needed when waiting for disappearance.
//
// await waitFor(() => {
//     expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
// });
//
// The query is allowed to return `null`, while the assertion throws until
// the loading message has actually disappeared.

// ---------------------------------------------------------------------
// 7. waitForElementToBeRemoved
// ---------------------------------------------------------------------

// Testing Library also provides `waitForElementToBeRemoved` for disappearance.
//
// await waitForElementToBeRemoved(() => screen.getByText("Loading..."));
//
// This expresses the intention directly when an existing element is expected
// to be removed.
//
// `waitFor` is more general because its callback can assert any observable condition.

// ---------------------------------------------------------------------
// 8. Callbacks can run multiple times
// ---------------------------------------------------------------------

// The callback passed to `waitFor` may execute repeatedly.
// It should therefore be free of side effects.
//
// Avoid:
// await waitFor(() => {
//     user.click(screen.getByRole("button", {name: "Load"}));
//     expect(screen.getByText("Loaded")).toBeInTheDocument();
// });
//
// The click can happen more than once because the callback is retried.
//
// Prefer performing the interaction before waiting:
//
// await user.click(screen.getByRole("button", {name: "Load"}));
//
// await waitFor(() => {
//     expect(screen.getByText("Loaded")).toBeInTheDocument();
// });

// ---------------------------------------------------------------------
// 9. One observable condition per callback
// ---------------------------------------------------------------------

// Keep a `waitFor` callback focused on the condition that controls the wait.
//
// Clear:
// await waitFor(() => {
//     expect(screen.getByText("Loaded")).toBeInTheDocument();
// });
//
// Avoid putting unrelated operations or multiple independent state transitions
// into the callback. This makes retries easier to reason about.

// ---------------------------------------------------------------------
// 10. Waiting for a changing value
// ---------------------------------------------------------------------

interface CounterProps {
  readonly loadValue: () => Promise<number>;
}

export const AsyncCounter: FC<CounterProps> = ({ loadValue }): ReactElement => {
  const [value, setValue] = useState<number | null>(null);

  useEffect(() => {
    let active = true;

    void loadValue().then((nextValue) => {
      if (active) {
        setValue(nextValue);
      }
    });

    return () => {
      active = false;
    };
  }, [loadValue]);

  return <output aria-label="Counter value">{value ?? "Loading..."}</output>;
};

// `waitFor` can wait for the value represented by the UI:
//
// await waitFor(() => {
//     expect(screen.getByLabelText("Counter value")).toHaveTextContent("42");
// });
//
// The test does not need to inspect React state directly.

// ---------------------------------------------------------------------
// 11. Do not use arbitrary delays
// ---------------------------------------------------------------------

// Avoid fixed sleeps such as:
//
// await new Promise((resolve) => setTimeout(resolve, 1000));
//
// A fixed delay guesses how long the operation will take.
// It can make tests unnecessarily slow and can still fail on slower systems.
//
// Instead, wait for the observable condition:
//
// await waitFor(() => {
//     expect(screen.getByText("Completed")).toBeInTheDocument();
// });

// ---------------------------------------------------------------------
// 12. Always await waitFor
// ---------------------------------------------------------------------

// `waitFor` returns a Promise.
//
// Correct:
// await waitFor(() => {
//     expect(screen.getByText("Completed")).toBeInTheDocument();
// });
//
// Without `await`, the test can finish before the asynchronous assertion
// has completed, allowing failures to escape the intended test flow.

// ---------------------------------------------------------------------
// 13. waitFor vs. findBy
// ---------------------------------------------------------------------

// Use `findBy...` when you are waiting for a particular element to appear:
//
// const heading = await screen.findByRole("heading", {name: "Dashboard"});
//
// Use `waitFor` when you need to wait for a more general assertion:
//
// await waitFor(() => {
//     expect(screen.getByRole("status")).toHaveTextContent("Saved");
// });
//
// The distinction is about the condition being waited for, not about whether
// the application happens to use Promises internally.

// ---------------------------------------------------------------------
// 14. Keep assertions based on observable behavior
// ---------------------------------------------------------------------

// Prefer assertions against what the user can observe:
//
// await waitFor(() => {
//     expect(screen.getByRole("status")).toHaveTextContent("Saved");
// });
//
// Avoid waiting for implementation details such as:
//
// await waitFor(() => {
//     expect(componentState.status).toBe("saved");
// });
//
// React state, internal variables, and implementation-specific details are not
// the behavior that a component test should normally verify.

// ---------------------------------------------------------------------
// 15. Complete testing flow
// ---------------------------------------------------------------------

// A typical asynchronous interaction follows this sequence:
//
// 1. Render the component.
// 2. Perform the user interaction.
// 3. Wait for the observable asynchronous result.
// 4. Assert the final behavior.
//
// Example:
//
// render(<SaveStatus save={save} />);
//
// await user.click(screen.getByRole("button", {name: "Save"}));
//
// await waitFor(() => {
//     expect(screen.getByLabelText("Save status")).toHaveTextContent("saved");
// });
//
// The interaction happens once.
// The assertion is retried until the UI reaches the expected state.

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - `waitFor` retries its callback until it completes without throwing.
// - The callback should contain an assertion or another condition that throws when unmet.
// - Returning `false` does not tell `waitFor` to retry.
// - The callback may run multiple times, so avoid side effects inside it.
// - Await `waitFor` so the test waits for the asynchronous condition.
// - Use `findBy...` when waiting for an element to appear.
// - Use `queryBy...` with `waitFor` when waiting for an element to disappear.
// - Use `waitForElementToBeRemoved` when removal is the condition being tested.
// - Prefer observable UI behavior over internal implementation details.
// - Avoid arbitrary delays; wait for the condition that actually matters.
