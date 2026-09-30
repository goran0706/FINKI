/**
 * Act
 * ===
 *
 * React's `act` utility helps tests process updates caused by rendering,
 * user interactions, effects, and other asynchronous work before assertions
 * are made. Testing Library's helpers generally wrap the interactions and
 * rendering they perform in `act`, so direct use of `act` is usually limited
 * to cases where updates happen outside those helpers.
 */

import { act } from "react";
import { type FC, type ReactElement, useEffect, useState } from "react";

// ---------------------------------------------------------------------
// 1. Basic act usage
// ---------------------------------------------------------------------

// `act` executes code that causes React updates and waits for the updates
// to be processed before the test continues.
//
// await act(async () => {
//     render(<Counter />);
// });
//
// The assertion can then inspect the UI after React has processed the work.
//
// The callback passed to `act` should contain the operation that causes
// the React update rather than the assertion itself.

// ---------------------------------------------------------------------
// 2. Why act exists
// ---------------------------------------------------------------------

// React state updates can trigger rendering and effects after an interaction.
// A test should not assert against the UI before React has processed those
// updates.
//
// Conceptually:
//
// await act(async () => {
//     triggerUpdate();
// });
//
// expect(result).toMatchExpectedState();
//
// `act` establishes a boundary around React work so that related updates
// are flushed before the test continues.

// ---------------------------------------------------------------------
// 3. Rendering with act
// ---------------------------------------------------------------------

interface MessageProps {
  readonly message: string;
}

export const Message: FC<MessageProps> = ({ message }): ReactElement => {
  return <p>{message}</p>;
};

// Direct `act` usage can surround rendering:
//
// await act(async () => {
//     root.render(<Message message="Hello, John Doe" />);
// });
//
// In Testing Library, `render` already handles the relevant React `act`
// behavior, so wrapping ordinary `render` calls manually is unnecessary.

// ---------------------------------------------------------------------
// 4. State updates
// ---------------------------------------------------------------------

interface CounterProps {
  readonly initialValue?: number;
}

export const Counter: FC<CounterProps> = ({ initialValue = 0 }): ReactElement => {
  const [count, setCount] = useState(initialValue);

  return (
    <button type="button" onClick={() => setCount((current) => current + 1)}>
      Count: {count}
    </button>
  );
};

// A low-level test that directly triggers the state update might use:
//
// await act(async () => {
//     setCount(...);
// });
//
// However, component tests normally should interact with the rendered UI:
//
// await user.click(screen.getByRole("button", {name: "Count: 0"}));
//
// Testing Library's `userEvent` interaction handles the necessary React
// update boundary, so an additional `act` is normally unnecessary.

// ---------------------------------------------------------------------
// 5. Effects and asynchronous updates
// ---------------------------------------------------------------------

interface LoadedMessageProps {
  readonly loadMessage: () => Promise<string>;
}

export const LoadedMessage: FC<LoadedMessageProps> = ({ loadMessage }): ReactElement => {
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    void loadMessage().then((nextMessage) => {
      if (active) {
        setMessage(nextMessage);
      }
    });

    return () => {
      active = false;
    };
  }, [loadMessage]);

  return <p>{message ?? "Loading..."}</p>;
};

// A test should normally use Testing Library's asynchronous APIs:
//
// render(<LoadedMessage loadMessage={loadMessage} />);
//
// expect(await screen.findByText("Hello, John Doe")).toBeInTheDocument();
//
// `findBy...` waits for the asynchronous UI update and Testing Library handles
// the React `act` boundary. Manual `act` is not needed for this common case.

// ---------------------------------------------------------------------
// 6. User interactions
// ---------------------------------------------------------------------

// Prefer `userEvent` for realistic user interactions:
//
// const user = userEvent.setup();
//
// await user.click(screen.getByRole("button", {name: "Save"}));
//
// The interaction can cause React state updates, effects, and re-renders.
// `userEvent` integrates with React's update handling, so wrapping the click
// in another `act` call is normally redundant.

// ---------------------------------------------------------------------
// 7. When manual act can be useful
// ---------------------------------------------------------------------

// Manual `act` is most relevant when React updates are triggered by code that
// is outside the Testing Library interaction helpers.
//
// For example, a test may directly invoke an external callback:
//
// await act(async () => {
//     externalStore.emit({status: "ready"});
// });
//
// The important point is that the code inside `act` must be the operation
// responsible for triggering the React update.

// ---------------------------------------------------------------------
// 8. External update example
// ---------------------------------------------------------------------

interface StoreState {
  readonly status: "idle" | "ready";
}

type Listener = (state: StoreState) => void;

class ExampleStore {
  private state: StoreState = { status: "idle" };
  private readonly listeners = new Set<Listener>();

  public subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  public emit(state: StoreState): void {
    this.state = state;
    this.listeners.forEach((listener) => listener(state));
  }

  public getState(): StoreState {
    return this.state;
  }
}

interface StoreStatusProps {
  readonly store: ExampleStore;
}

export const StoreStatus: FC<StoreStatusProps> = ({ store }): ReactElement => {
  const [state, setState] = useState<StoreState>(() => store.getState());

  useEffect(() => {
    return store.subscribe(setState);
  }, [store]);

  return <output>{state.status}</output>;
};

// A test that directly triggers the external store could use:
//
// const store = new ExampleStore();
//
// render(<StoreStatus store={store} />);
//
// await act(async () => {
//     store.emit({status: "ready"});
// });
//
// expect(screen.getByRole("status")).toHaveTextContent("ready");
//
// Here `act` is useful because the update is triggered directly through an
// external store rather than through a Testing Library user interaction.

// ---------------------------------------------------------------------
// 9. Synchronous act callbacks
// ---------------------------------------------------------------------

// `act` can accept synchronous work:
//
// act(() => {
//     triggerSynchronousUpdate();
// });
//
// For modern React tests, prefer the async form:
//
// await act(async () => {
//     triggerSynchronousUpdate();
// });
//
// The async form is the recommended pattern because React updates can involve
// asynchronous work and the test remains consistent when the implementation
// evolves.

// ---------------------------------------------------------------------
// 10. Asynchronous act callbacks
// ---------------------------------------------------------------------

// When the operation itself is asynchronous, use an async callback:
//
// await act(async () => {
//     await performAsyncOperation();
// });
//
// React can then process updates associated with the completed operation
// before the test continues.
//
// Do not use arbitrary delays:
//
// await act(async () => {
//     await new Promise((resolve) => setTimeout(resolve, 1000));
// });
//
// The test should wait for actual application work rather than guessing
// how much time React or the application needs.

// ---------------------------------------------------------------------
// 11. act is not an assertion API
// ---------------------------------------------------------------------

// `act` prepares React for assertions; it does not replace assertions.
//
// Correct:
//
// await act(async () => {
//     updateApplication();
// });
//
// expect(screen.getByText("Ready")).toBeInTheDocument();
//
// The responsibilities remain separate:
//
// - `act`              -> process React updates.
// - Testing Library    -> interact with and query the UI.
// - jest-dom           -> express DOM assertions.

// ---------------------------------------------------------------------
// 12. Avoid wrapping everything in act
// ---------------------------------------------------------------------

// This is usually unnecessary:
//
// await act(async () => {
//     render(<Counter />);
// });
//
// await act(async () => {
//     await user.click(screen.getByRole("button", {name: "Count: 0"}));
// });
//
// Testing Library's `render` and `userEvent` already handle the React update
// boundaries required for their normal operations.
//
// Prefer:
//
// render(<Counter />);
//
// await user.click(screen.getByRole("button", {name: "Count: 0"}));

// ---------------------------------------------------------------------
// 13. act and waitFor solve different problems
// ---------------------------------------------------------------------

// `act` is about processing React updates caused by a piece of code.
//
// await act(async () => {
//     externalStore.emit({status: "ready"});
// });
//
// `waitFor` is about waiting until an observable condition becomes true:
//
// await waitFor(() => {
//     expect(screen.getByRole("status")).toHaveTextContent("ready");
// });
//
// They can appear together when an external operation triggers React updates
// and the resulting UI transition itself is asynchronous, but they should not
// be combined automatically.

// ---------------------------------------------------------------------
// 14. Testing Library usually removes the need for manual act
// ---------------------------------------------------------------------

// In a typical component test:
//
// const user = userEvent.setup();
//
// render(<Counter />);
//
// await user.click(screen.getByRole("button", {name: "Count: 0"}));
//
// expect(screen.getByRole("button", {name: "Count: 1"})).toBeInTheDocument();
//
// There is no explicit `act` call because the Testing Library APIs handle the
// React update boundary around rendering and user interactions.

// ---------------------------------------------------------------------
// 15. Common mistake: updating outside act
// ---------------------------------------------------------------------

// A low-level test that causes a React update directly can produce an `act`
// warning when the update is not wrapped.
//
// Example:
//
// externalStore.emit({status: "ready"});
//
// The component may update after the test has already moved on.
//
// If the update must be triggered directly, use:
//
// await act(async () => {
//     externalStore.emit({status: "ready"});
// });
//
// Then make the assertion after the update has been processed.

// ---------------------------------------------------------------------
// 16. Complete testing flow
// ---------------------------------------------------------------------

// A normal Testing Library test generally follows this structure:
//
// 1. Render the component.
// 2. Perform an interaction with `userEvent`.
// 3. Wait for asynchronous UI changes with `findBy...` or `waitFor`.
// 4. Assert the observable result.
//
// Example:
//
// const user = userEvent.setup();
//
// render(<Counter />);
//
// await user.click(screen.getByRole("button", {name: "Count: 0"}));
//
// expect(screen.getByRole("button", {name: "Count: 1"})).toBeInTheDocument();
//
// Manual `act` should be introduced only when the test directly triggers
// React updates that are not already handled by the testing utilities.

// ---------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------
// - `act` establishes a boundary around React work that causes updates.
// - Use `await act(async () => { ... })` when manual React update flushing is needed.
// - Testing Library `render` and `userEvent` normally handle `act` automatically.
// - Do not wrap every Testing Library operation in manual `act` calls.
// - Manual `act` is useful for low-level or external update sources.
// - `act` prepares updates; it does not perform assertions.
// - Use `findBy...` and `waitFor` to wait for asynchronous observable UI states.
// - Avoid arbitrary delays inside `act`; wait for actual application work.
// - Assert against rendered behavior rather than React's internal state.
